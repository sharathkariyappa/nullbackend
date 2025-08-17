import axios from "axios";

/** Simple local baseline you can replace with a real model */
export async function flaskModelScore(gh, oc) {
  try {
    // Build payload exactly as Flask expects
    const payload = {
      totalContributions: gh.totalContributions,
      pullRequests: gh.totalPRs,
      issues: gh.issuesCreated,
      repositoriesContributedTo: gh.contributedRepos,
      followers: gh.followers,
      repositories: gh.topRepos.length,
      ethBalance: parseFloat(oc.ethBalance),
      txCount: oc.txCount,
      isContractDeployer: oc.isContractDeployer,
      contractDeployments: oc.contractDeployments,
      tokenBalances: oc.erc20.reduce((sum, t) => sum + parseFloat(t.balance), 0),
      nftCount: oc.nftCount,
      daoVotes: oc.daoVotes,
      hasNFTs: oc.hasNFTs
    };

    // Call your Flask model API
    const flaskResponse = await axios.post(
      "https://mlflaskmodel-production.up.railway.app/predict",
      payload,
      { timeout: 15000 }
    );

    // Return exactly what frontend expects
    return {
      score: flaskResponse.data.github_score + flaskResponse.data.onchain_score
    };

  } catch (error) {
    console.error("Error calling Flask ML model:", error.message);
    throw new Error("Failed to calculate role");
  }
}
