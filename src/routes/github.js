// src/routes/github.js
import { Router } from "express";
import { requireGitHub } from "../middleware/auth.js";
import { fetchGitHubContributorData } from "../services/github.js";

export const githubRouter = Router();

/** /api/github/stats?username=... */
githubRouter.get("/stats", requireGitHub, async (req, res) => {
  try {
    const username = String(req.query.username || "");
    if (!username) return res.status(400).json({ error: "username required" });

    const token = req.githubToken; // removed TS casting
    const stats = await fetchGitHubContributorData(token, username);
    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch GitHub stats" });
  }
});

/** Convenience: /api/github/me */
githubRouter.get("/me", requireGitHub, async (req, res) => {
  res.json({ ok: true });
});
