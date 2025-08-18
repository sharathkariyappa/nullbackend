// src/routes/score.js
import { Router } from "express";
import { requireGitHub } from "../middleware/auth.js";
import { fetchGitHubContributorData } from "../services/github.js";
import { fetchOnchainStats } from "../services/onchain.js";
import { flaskModelScore } from "../services/scoring.js";

export const scoreRouter = Router();

/**
 * POST /api/score
 * body: { githubUsername: string, address: string, calculateScore?: boolean }
 */
scoreRouter.post("/", requireGitHub, async (req, res) => {
  const { githubUsername, address, useExternalModel } = req.body || {};
  if (!githubUsername || !address) {
    return res.status(400).json({ error: "githubUsername and address required" });
  }

  const token = req.githubToken;

  try {
    // Fetch both in parallel
    const [gh, oc] = await Promise.all([
      fetchGitHubContributorData(token, githubUsername),
      fetchOnchainStats(address)
    ]);

    // If score calculation is requested
    if (useExternalModel) {
      const scoreResult = await flaskModelScore(gh, oc);
      return res.json({ 
        github: gh, 
        onchain: oc, 
        score: scoreResult.score 
      });
    }

    return res.json({ github: gh, onchain: oc });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});