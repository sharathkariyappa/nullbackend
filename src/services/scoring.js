const axios = require('axios');

function calculateGithubScore(totalContributions, pullRequests, issues, repositoriesContributedTo, followers, repositories) {
    let activityScore = 0;
    if (totalContributions > 0) {
        if (totalContributions < 100) {
            activityScore = totalContributions * 0.1;
        } else if (totalContributions < 500) {
            activityScore = 10 + (totalContributions - 100) * 0.05;
        } else if (totalContributions < 2000) {
            activityScore = 30 + (totalContributions - 500) * 0.02;
        } else {
            activityScore = 60 + Math.log10(totalContributions / 2000) * 15;
        }
    }
    activityScore = Math.min(activityScore, 80);

    const prScore = Math.min(pullRequests * 1.5, 40);
    const issueScore = Math.min(issues * 1, 20);
    const impactScore = prScore + issueScore;

    const followerScore = Math.min(followers * 0.05, 15);

    const repoScore = Math.min(repositories * 2, 15);
    const contribScore = Math.min(repositoriesContributedTo * 0.5, 15);
    const collaborationScore = repoScore + contribScore;

    const totalGithubScore = activityScore + impactScore + collaborationScore + followerScore;
    
    // Normalize to max 50 (original max was 130)
    const normalizedScore = totalGithubScore * (50 / 130);
    return Math.round(normalizedScore * 100) / 100;
}

function calculateOnchainScore(ethBalance, txCount, contractDeployments, tokenBalances, nftCount, daoVotes) {
    const actualEthBalance = ethBalance < 1e6 ? ethBalance : ethBalance / 1e18;

    let wealthScore = 0;
    if (actualEthBalance > 0) {
        if (actualEthBalance < 1) {
            wealthScore += actualEthBalance * 10;
        } else if (actualEthBalance < 10) {
            wealthScore += 10 + (actualEthBalance - 1) * 5;
        } else if (actualEthBalance < 100) {
            wealthScore += 55 + (actualEthBalance - 10) * 2;
        } else {
            wealthScore += 235 + Math.log10(actualEthBalance / 100) * 30;
        }
    }

    wealthScore = Math.min(wealthScore, 200);

    let activityScore = 0;
    if (txCount > 0) {
        if (txCount < 100) {
            activityScore = txCount * 0.2;
        } else if (txCount < 1000) {
            activityScore = 20 + (txCount - 100) * 0.05;
        } else {
            activityScore = 65 + Math.log10(txCount / 1000) * 15;
        }
    }
    activityScore = Math.min(activityScore, 80);

    let technicalScore = 0;
    if (contractDeployments > 0) {
        technicalScore += 40 + Math.min(contractDeployments * 10, 30);
    }
    if (nftCount > 0) {
        technicalScore += 10;
    }

    const governanceScore = Math.min(daoVotes * 2, 30);

    const totalOnchainScore = wealthScore + activityScore + technicalScore + governanceScore;
    
    // Normalize to max 50 (original max was 390)
    const normalizedScore = totalOnchainScore * (50 / 390);
    return Math.round(normalizedScore * 100) / 100;
}

/** Local calculation replacing Flask model */
export async function flaskModelScore(gh, oc) {
    try {
        // Calculate GitHub score
        const githubScore = calculateGithubScore(
            gh.totalContributions,
            gh.totalPRs,
            gh.issuesCreated,
            gh.contributedRepos,
            gh.followers,
            gh.topRepos.length
        );

        // Calculate on-chain score
        const onchainScore = calculateOnchainScore(
            parseFloat(oc.ethBalance),
            oc.txCount,
            oc.contractDeployments,
            oc.erc20.reduce((sum, t) => sum + parseFloat(t.balance), 0),
            oc.nftCount,
            oc.daoVotes
        );

        // Return exactly what frontend expects
        return {
            score: githubScore + onchainScore
        };

    } catch (error) {
        console.error("Error calculating local score:", error.message);
        throw new Error("Failed to calculate role");
    }
}
