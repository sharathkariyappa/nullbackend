// src/middleware/auth.js
import { cfg } from "../config.js";

export function cookieOptions(httpOnly = true) {
  return {
    httpOnly,
    secure: cfg.cookie.secure,
    sameSite: cfg.cookie.sameSite,
    domain: cfg.cookie.domain,
    path: "/",
    maxAge: cfg.cookie.maxAgeMs,
  };
}

export function requireGitHub(req, res, next) {
  const token = req.cookies?.[cfg.cookie.name];
  if (!token) return res.status(401).json({ error: "Not authenticated" });
  req.githubToken = token;
  next();
}
