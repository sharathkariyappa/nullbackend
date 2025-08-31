import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { cfg } from "./config.js";
import { authRouter } from "./routes/auth.js";
import { githubRouter } from "./routes/github.js";
import { onchainRouter } from "./routes/onchain.js";
import { scoreRouter } from "./routes/score.js";
import { leaderboardRouter } from "./routes/leaderboard.js";
import { earlyAccessRouter } from "./routes/earlyaccess.js";
import { likesRouter } from "./routes/likes.js";
import { vcRouter } from "./routes/vc.js";
import router from "./routes/contract.js";

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    origin: cfg.frontendUrl,
    credentials: true,
  })
);

// Basic rate limit
app.use(
  "/",
  rateLimit({
    windowMs: 60_000,
    max: 120, // 120 req/min per IP
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/auth", authRouter);
app.use("/api/github", githubRouter);
app.use("/api/onchain", onchainRouter);
app.use("/api/score", scoreRouter);
app.use("/api/leaderboard", leaderboardRouter);
app.use("/api/early-access", earlyAccessRouter);
app.use("/api/likes", likesRouter);
app.use("/api/vc", vcRouter);
app.use("/api/contract", router);

// Error handler (no TypeScript annotations)
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Server Error" });
});

// Export for Vercel serverless
export default app;
