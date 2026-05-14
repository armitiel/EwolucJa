/**
 * authService — Google OAuth + JWT sessions dla mentora.
 *
 * Flow:
 *   1. Frontend redirectuje na /api/auth/google/start
 *   2. Backend redirectuje do Google OAuth z odpowiednimi scopes
 *   3. Google -> callback /api/auth/google/callback z code
 *   4. Backend wymienia code na tokens, weryfikuje id_token (sygnatura Google)
 *   5. Backend znajduje/tworzy gm_accounts + google_identities
 *   6. Backend wystawia JWT, zapisuje sesje, ustawia cookie
 *   7. Redirect na /mentor (frontend)
 *
 * JWT: HS256, secret = JWT_SECRET. Payload: {sub: gm_account_id, sid: session_id}.
 * Token tez hashowany SHA256 w mentor_sessions.token_hash (mozemy unievaznic per-sessja).
 */

import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { createHash, randomUUID } from "node:crypto";
import { initDatabase } from "../database/db.js";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID?.trim();
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET?.trim();
const JWT_SECRET = process.env.JWT_SECRET?.trim();
const APP_BASE_URL = (process.env.APP_BASE_URL || "https://ewolucja-azure.vercel.app").trim().replace(/\/$/, "");
const SESSION_DURATION_DAYS = 30;

// Lazy init - jezeli env nie ustawione, system rzuci czytelny blad przy uzyciu
function ensureConfig() {
  const missing = [];
  if (!GOOGLE_CLIENT_ID) missing.push("GOOGLE_CLIENT_ID");
  if (!GOOGLE_CLIENT_SECRET) missing.push("GOOGLE_CLIENT_SECRET");
  if (!JWT_SECRET) missing.push("JWT_SECRET");
  if (missing.length) {
    throw new Error(`Missing env vars for Google OAuth: ${missing.join(", ")}`);
  }
}

function getOAuthClient() {
  ensureConfig();
  return new OAuth2Client({
    clientId: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    redirectUri: `${APP_BASE_URL}/api/auth/google/callback`,
  });
}

/** Wygeneruj URL do ktorego rediratujemy uzytkownika (Google login). */
export function getGoogleAuthUrl(state) {
  const client = getOAuthClient();
  return client.generateAuthUrl({
    access_type: "offline",
    scope: ["openid", "email", "profile"],
    prompt: "select_account",
    state: state || "",
  });
}

/** Wymien code z callbacku na sprawdzony profil Google. */
export async function exchangeCodeForProfile(code) {
  const client = getOAuthClient();
  const { tokens } = await client.getToken(code);
  if (!tokens.id_token) throw new Error("Brak id_token z Google");
  const ticket = await client.verifyIdToken({
    idToken: tokens.id_token,
    audience: GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  if (!payload?.sub) throw new Error("Niepoprawny id_token");
  if (!payload.email_verified) throw new Error("Email Google niezweryfikowany");
  return {
    sub: payload.sub,
    email: payload.email,
    name: payload.name || payload.email,
    picture: payload.picture || null,
  };
}

/** Znajdz lub utworz gm_accounts + google_identities. Zwraca gm_account_id. */
export async function findOrCreateMentor(googleProfile) {
  const pool = await initDatabase();
  const { sub, email, name, picture } = googleProfile;

  // Czy juz mamy google_identities dla tego sub?
  const existing = await pool.query(
    `SELECT gi.gm_account_id, ga.name, ga.role
       FROM google_identities gi
       JOIN gm_accounts ga ON ga.id = gi.gm_account_id
       WHERE gi.google_sub = $1
       LIMIT 1`,
    [sub]
  );
  if (existing.rows.length) {
    // Update picture/email jezeli sie zmienily
    await pool.query(
      `UPDATE google_identities SET email = $2, picture = $3, updated_at = NOW()
         WHERE gm_account_id = $1`,
      [existing.rows[0].gm_account_id, email, picture]
    );
    return existing.rows[0].gm_account_id;
  }

  // Nowy mentor: stworz gm_accounts + google_identities w transakcji
  const gmId = randomUUID();
  await pool.query("BEGIN");
  try {
    await pool.query(
      `INSERT INTO gm_accounts (id, role, name, email, gm_persona_id)
         VALUES ($1, 'teacher', $2, $3, 'mentor_default')`,
      [gmId, name, email]
    );
    await pool.query(
      `INSERT INTO google_identities (gm_account_id, google_sub, email, picture)
         VALUES ($1, $2, $3, $4)`,
      [gmId, sub, email, picture]
    );
    await pool.query("COMMIT");
  } catch (e) {
    await pool.query("ROLLBACK");
    throw e;
  }
  return gmId;
}

/** Wystaw JWT + zapisz sesje. Zwroc {token, sessionId, expiresAt}. */
export async function issueSession(gmAccountId, userAgent = null) {
  ensureConfig();
  const pool = await initDatabase();
  const sessionId = randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_DURATION_DAYS * 86400000);
  const token = jwt.sign(
    { sub: gmAccountId, sid: sessionId },
    JWT_SECRET,
    { expiresIn: `${SESSION_DURATION_DAYS}d` }
  );
  const tokenHash = createHash("sha256").update(token).digest("hex");
  await pool.query(
    `INSERT INTO mentor_sessions (id, gm_account_id, token_hash, expires_at, user_agent)
       VALUES ($1, $2, $3, $4, $5)`,
    [sessionId, gmAccountId, tokenHash, expiresAt, userAgent]
  );
  return { token, sessionId, expiresAt };
}

/** Sprawdz token z cookie. Zwroc {gmAccountId} lub null. */
export async function verifySession(token) {
  if (!token) return null;
  ensureConfig();
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const tokenHash = createHash("sha256").update(token).digest("hex");
    const pool = await initDatabase();
    const { rows } = await pool.query(
      `SELECT id, gm_account_id, expires_at
         FROM mentor_sessions
         WHERE id = $1 AND token_hash = $2 AND expires_at > NOW()`,
      [payload.sid, tokenHash]
    );
    if (!rows.length) return null;
    // Touch last_used_at (best effort)
    pool.query(`UPDATE mentor_sessions SET last_used_at = NOW() WHERE id = $1`, [payload.sid]).catch(() => {});
    return { gmAccountId: rows[0].gm_account_id, sessionId: rows[0].id };
  } catch {
    return null;
  }
}

/** Uniewaznij sesje (wylogowanie). */
export async function revokeSession(sessionId) {
  if (!sessionId) return;
  const pool = await initDatabase();
  await pool.query(`DELETE FROM mentor_sessions WHERE id = $1`, [sessionId]);
}

/** Express middleware: wymaga zalogowanego mentora. Atakuje req.mentor = {gmAccountId, sessionId}. */
export function requireMentor() {
  return async (req, res, next) => {
    const token = req.cookies?.mentor_token || req.headers.authorization?.replace(/^Bearer\s+/i, "");
    const session = await verifySession(token);
    if (!session) return res.status(401).json({ error: "Wymagane zalogowanie mentora" });
    req.mentor = session;
    next();
  };
}

/** Zwroc profil mentora (dla /api/auth/me). */
export async function getMentorProfile(gmAccountId) {
  const pool = await initDatabase();
  const { rows } = await pool.query(
    `SELECT ga.id, ga.name, ga.email, ga.role, gi.picture
       FROM gm_accounts ga
       LEFT JOIN google_identities gi ON gi.gm_account_id = ga.id
       WHERE ga.id = $1`,
    [gmAccountId]
  );
  return rows[0] || null;
}

export const SESSION_COOKIE_NAME = "mentor_token";
export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: "lax",
  maxAge: SESSION_DURATION_DAYS * 86400 * 1000,
  path: "/",
};

export const APP_BASE = APP_BASE_URL;
