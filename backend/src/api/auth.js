/**
 * /api/auth - Google OAuth flow + sesja mentora.
 *
 * Endpoints:
 *   GET  /api/auth/google/start         - inicjuje OAuth, redirect na Google
 *   GET  /api/auth/google/callback      - odbiera code, wystawia sesje, redirect na /mentor
 *   GET  /api/auth/me                   - profil zalogowanego mentora (lub 401)
 *   POST /api/auth/logout               - wyloguj (uniewaznij sesje)
 */

import { Router } from "express";
import {
  getGoogleAuthUrl,
  exchangeCodeForProfile,
  findOrCreateMentor,
  issueSession,
  verifySession,
  revokeSession,
  getMentorProfile,
  requireMentor,
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_OPTIONS,
  APP_BASE,
} from "../services/authService.js";

export function authRoutes() {
  const r = Router();

  r.get("/google/start", (req, res) => {
    try {
      const state = req.query.state || "/mentor";
      const url = getGoogleAuthUrl(String(state));
      res.redirect(url);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  r.get("/google/callback", async (req, res) => {
    try {
      const { code, state, error: googleError } = req.query;
      if (googleError) return res.redirect(`${APP_BASE}/mentor/zaloguj?error=${encodeURIComponent(String(googleError))}`);
      if (!code) return res.redirect(`${APP_BASE}/mentor/zaloguj?error=no_code`);
      const profile = await exchangeCodeForProfile(String(code));
      const gmId = await findOrCreateMentor(profile);
      const { token } = await issueSession(gmId, req.headers["user-agent"] || null);
      res.cookie(SESSION_COOKIE_NAME, token, SESSION_COOKIE_OPTIONS);
      const destination = typeof state === "string" && state.startsWith("/") ? state : "/mentor";
      res.redirect(`${APP_BASE}${destination}`);
    } catch (e) {
      console.error("[auth/callback]", e);
      res.redirect(`${APP_BASE}/mentor/zaloguj?error=${encodeURIComponent(e.message)}`);
    }
  });

  r.get("/me", requireMentor(), async (req, res) => {
    try {
      const profile = await getMentorProfile(req.mentor.gmAccountId);
      if (!profile) return res.status(404).json({ error: "Profil nie znaleziony" });
      res.json(profile);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  r.post("/logout", async (req, res) => {
    try {
      const token = req.cookies?.[SESSION_COOKIE_NAME];
      const session = token ? await verifySession(token) : null;
      if (session?.sessionId) await revokeSession(session.sessionId);
      res.clearCookie(SESSION_COOKIE_NAME, { path: "/" });
      res.json({ ok: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  return r;
}
