/*!
 * EwolucJA — gra edukacyjna dla dzieci.
 * © 2026 Amitiel Angelisme. Wszelkie prawa zastrzeżone.
 * Powstało w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”.
 * Prawa autorskie należą do autora. Pełna nota: LICENSE.
 */
/**
 * Integracja logowania ePomost ("Przygoda on Max") — kontrakt zewnętrznego auth (PKCE).
 *
 * Przepływ:
 *   1) front (w iframe Portalu) -> POST /api/epomost/begin
 *        backend losuje PKCE verifier, zwraca { attemptId, codeChallenge }
 *   2) front: const { code } = await EduPortal.auth.authorize({ codeChallenge })
 *   3) front -> POST /api/epomost/complete { attemptId, code, nickname? }
 *        backend: exchange(code, verifier) z nagłówkiem X-Edu-App-Key ->
 *        { grant, subject }; subject = stały klucz gracza -> mapowanie na players.
 *        backend zwraca { session, player } (session = handle X-Adventure-Session)
 *   4) każdy prywatny odczyt/zapis: świeży introspect(grant) (bez cache pozytywu)
 *
 * Sekrety (EDU_PRZYGODA_APP_KEY, EDU_EXTERNAL_APP_ENV) ładowane z env (systemd
 * EnvironmentFile = /srv/adventure/dev/data/epomost-sdk.env). Nigdy nie trafiają
 * do przeglądarki, logów, URL-i ani odpowiedzi.
 */
import { Router } from "express";
import { randomUUID, randomBytes, createHash } from "crypto";
import { getPlayer, findOrCreatePlayerBySubject } from "../database/db.js";

const API_BASE = process.env.EDU_API_BASE || "https://dev-api-edu.naszpomost.pl";
const APP_KEY = process.env.EDU_PRZYGODA_APP_KEY || "";
const APP_ENV = (process.env.EDU_EXTERNAL_APP_ENV || "dev").toLowerCase();
// "Produkcyjność" liczymy wg środowiska ePomost (EDU_EXTERNAL_APP_ENV), NIE wg NODE_ENV
// — NODE_ENV=production bywa ustawiony także na serwerze DEV (tryb Express).
const IS_PROD_ENV = APP_ENV === "production" || APP_ENV === "prod";
// Konto testowe/podgląd: włączone poza produkcją ePomost; nadpisywalne EDU_TEST_LOGIN=1/0.
const TEST_LOGIN_ENABLED =
  process.env.EDU_TEST_LOGIN != null
    ? process.env.EDU_TEST_LOGIN === "1"
    : !IS_PROD_ENV;
// Kanoniczny URL SDK (do wczytania w iframe przez front). NIE forkować / nie bundlować.
const SDK_URL =
  process.env.EDU_SDK_URL || "https://dev-games-edu.naszpomost.pl/_sdk/eduportal.js";

const ATTEMPT_TTL_MS = 120 * 1000; // 2 min na dokończenie logowania
const SESSION_TTL_MS = 6 * 60 * 60 * 1000; // twardy limit lokalnej sesji aplikacji

// Magazyny w pamięci procesu (pojedynczy backend DEV).
const attempts = new Map(); // attemptId -> { verifier, createdAt }
const sessions = new Map(); // token -> { subject, playerId, grant, isTest, createdAt }

function b64url(buf) {
  return Buffer.from(buf)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}
function makeVerifier() {
  return b64url(randomBytes(32)); // 43 znaki base64url — zgodne z /^[A-Za-z0-9_-]{43}$/
}
function challengeFor(verifier) {
  return b64url(createHash("sha256").update(verifier).digest());
}
function newToken() {
  return b64url(randomBytes(24));
}
function gcAttempts() {
  const now = Date.now();
  for (const [k, v] of attempts) if (now - v.createdAt > ATTEMPT_TTL_MS) attempts.delete(k);
}

async function eduPost(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    redirect: "error", // kontrakt: backend odmawia podążania za przekierowaniami
    headers: {
      "Content-Type": "application/json",
      "X-Edu-App-Key": APP_KEY,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = new Error(`edu_${res.status}`);
    err.status = res.status;
    throw err;
  }
  return res.json();
}
const exchange = (code, codeVerifier) =>
  eduPost("/external-apps/przygoda/exchange", { code, codeVerifier });
const introspect = (grant) => eduPost("/external-apps/przygoda/introspect", { grant });

function publicPlayer(p) {
  if (!p) return null;
  return {
    player_id: p.player_id,
    player_name: p.player_name,
    archetype: p.archetype || null,
    login_code: p.login_code || null,
    current_land: p.current_land || null,
  };
}

export function epomostRoutes(_db) {
  const router = Router();

  // Stan integracji (bez sekretów) — do diagnostyki i dla frontu (skąd wziąć SDK).
  router.get("/status", (req, res) => {
    res.json({
      env: APP_ENV,
      apiBase: API_BASE,
      keyConfigured: Boolean(APP_KEY),
      testLoginEnabled: TEST_LOGIN_ENABLED,
      sdkUrl: SDK_URL,
      appEnv: APP_ENV,
      isProdEnv: IS_PROD_ENV,
    });
  });

  // 1) Rozpoczęcie logowania: backend tworzy verifier, oddaje tylko challenge.
  router.post("/begin", (req, res) => {
    gcAttempts();
    const attemptId = randomUUID();
    const verifier = makeVerifier();
    attempts.set(attemptId, { verifier, createdAt: Date.now() });
    res.json({ attemptId, codeChallenge: challengeFor(verifier), sdkUrl: SDK_URL });
  });

  // 2) Dokończenie: wymiana code -> { grant, subject }, mapowanie na gracza, sesja.
  router.post("/complete", async (req, res) => {
    try {
      if (!APP_KEY) {
        return res.status(503).json({ error: "external_auth_unavailable" });
      }
      const { attemptId, code, nickname } = req.body || {};
      const attempt = attemptId && attempts.get(attemptId);
      if (!attempt) return res.status(400).json({ error: "invalid_attempt" });
      attempts.delete(attemptId); // jednorazowy
      if (!code) return res.status(400).json({ error: "missing_code" });

      const out = await exchange(code, attempt.verifier);
      const grant = out && out.grant;
      const subject = out && out.subject;
      if (!grant || !subject) return res.status(502).json({ error: "exchange_failed" });

      const nick = typeof nickname === "string" ? nickname.slice(0, 60) : null;
      const player = await findOrCreatePlayerBySubject(subject, { env: APP_ENV, nickname: nick });

      const token = newToken();
      sessions.set(token, {
        subject,
        playerId: player.player_id,
        grant,
        isTest: false,
        createdAt: Date.now(),
      });
      res.json({ session: token, player: publicPlayer(player) });
    } catch (e) {
      // Nie ujawniamy szczegółów — jednolity komunikat jak w kontrakcie.
      res.status(502).json({ error: "external_auth_unavailable" });
    }
  });

  // Middleware: świeży introspect przy każdym prywatnym żądaniu (bez cache pozytywu).
  async function requireEpomost(req, res, next) {
    const token = req.get("X-Adventure-Session");
    const s = token && sessions.get(token);
    if (!s) return res.status(401).json({ error: "no_session" });
    if (Date.now() - s.createdAt > SESSION_TTL_MS) {
      sessions.delete(token);
      return res.status(401).json({ error: "session_expired" });
    }
    if (s.isTest) {
      req.epomost = s; // konto testowe DEV — bez introspekcji (brak realnego grantu)
      return next();
    }
    try {
      const info = await introspect(s.grant);
      if (!info || info.active !== true || info.subject !== s.subject) {
        sessions.delete(token);
        return res.status(401).json({ error: "introspection_denied" });
      }
      req.epomost = s;
      next();
    } catch (e) {
      sessions.delete(token);
      res.status(401).json({ error: "introspection_error" });
    }
  }

  // 3) Kim jestem (świeży introspect).
  router.get("/me", requireEpomost, async (req, res) => {
    const player = await getPlayer(null, req.epomost.playerId);
    res.json({
      subject: req.epomost.subject,
      test: Boolean(req.epomost.isTest),
      player: publicPlayer(player),
    });
  });

  // 4) Wylogowanie: kasuje lokalną sesję (postęp zostaje).
  router.post("/logout", (req, res) => {
    const token = req.get("X-Adventure-Session");
    if (token) sessions.delete(token);
    res.json({ ok: true });
  });

  // 5) Konto testowe / podgląd — TYLKO poza produkcją. Mintuje stały testowy subject.
  router.post("/dev-login", async (req, res) => {
    if (!TEST_LOGIN_ENABLED) return res.status(404).json({ error: "not_found" });
    const raw = (req.body && req.body.testId) || "1";
    const testId = String(raw).replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 32) || "1";
    const subject = `dev-test:${APP_ENV}:${testId}`;
    const player = await findOrCreatePlayerBySubject(subject, {
      env: APP_ENV,
      nickname: `Test ${testId}`,
    });
    const token = newToken();
    sessions.set(token, {
      subject,
      playerId: player.player_id,
      grant: null,
      isTest: true,
      createdAt: Date.now(),
    });
    res.json({ session: token, test: true, player: publicPlayer(player) });
  });

  return router;
}
