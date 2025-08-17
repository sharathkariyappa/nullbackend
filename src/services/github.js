import axios from "axios";

const GQL = "https://api.github.com/graphql";

export async function fetchGitHubContributorData(token, username) {
  const query = `
    query {
      user(login: "${username}") {
        contributionsCollection {
          contributionCalendar {
            totalContributions
          }
          pullRequestContributionsByRepository(maxRepositories: 100) {
            repository { name }
            contributions(first: 100) {
              nodes {
                pullRequest { merged url }
              }
            }
          }
        }
        pullRequests(first: 100, states: [OPEN, CLOSED, MERGED]) { totalCount }
        issues { totalCount }
        repositoriesContributedTo(contributionTypes: [COMMIT, PULL_REQUEST, ISSUE], first: 100) { totalCount }
        followers { totalCount }
        repositories(first: 5, orderBy: {field: STARGAZERS, direction: DESC}) {
          nodes {
            name
            stargazerCount
            forkCount
            updatedAt
          }
        }
      }
    }
  `;

  const r = await axios.post(
    GQL,
    { query },
    { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
  );

  if (r.data.errors) {
    throw new Error(`GitHub GraphQL errors: ${JSON.stringify(r.data.errors)}`);
  }

  const user = r.data.data.user;
  const mergedPRs =
    user.contributionsCollection.pullRequestContributionsByRepository
      .flatMap(repo => repo.contributions.nodes)
      .filter(node => node.pullRequest?.merged).length;

  return {
    totalContributions: user.contributionsCollection.contributionCalendar.totalContributions,
    mergedPRs,
    totalPRs: user.pullRequests.totalCount,
    issuesCreated: user.issues.totalCount,
    contributedRepos: user.repositoriesContributedTo.totalCount,
    followers: user.followers.totalCount,
    topRepos: user.repositories.nodes.map(repo => ({
      name: repo.name,
      stargazerCount: repo.stargazerCount,
      forkCount: repo.forkCount,
      updatedAt: repo.updatedAt
    }))
  };
}
