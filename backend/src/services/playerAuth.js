/*!
 * SPDX-FileCopyrightText: © 2026 Amitiel Angelisme <armitiel@gmail.com>
 * SPDX-License-Identifier: LicenseRef-EwolucJA-Proprietary
 *
 * EwolucJA — gra edukacyjna dla dzieci.
 * Produkt powstał w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”;
 * autorskie prawa majątkowe pozostają przy autorze. Licencja: LICENSE.
 */
/**
 * playerAuth — kim jest wołający: dziecko (gracz) albo Mentor.
 *
 * STAN DZIŚ: gracz nie ma sesji ani hasła. Tożsamością jest samo posiadanie
 * `player_id` (UUID v4 z `crypto.randomUUID`, nie do zgadnięcia), które klient
 * trzyma w localStorage (`session.getPlayer()` w frontend/src/services/api.js)
 * i wysyła w ścieżce lub body. Sesja ePomost (`X-Adventure-Session`) żyje w
 * pamięci procesu, więc na Vercel Function nie da się na niej polegać.
 *
 * Ten moduł ujednolica ten model dla nowych endpointów „/me”:
 *   - dziecko: nagłówek `X-Player-Id: <player_id>`; sprawdzamy, że gracz
 *     istnieje → `req.player = { playerId, isDemo, etap, ustawienia }`;
 *   - Mentor: jak dotąd cookie `mentor_token` albo `Authorization: Bearer <jwt>`
 *     (services/authService.js) → `req.mentor = { gmAccountId, sessionId }`.
 *
 * Gdy przyjdzie prawdziwe logowanie dziecka, wystarczy podmienić
 * `resolvePlayerId` — trasy zostają.
 */
import { initDatabase, ustawieniaZDomyslnymi } from "../database/db.js";
import { verifySession } from "./authService.js";

const UUID_RE = /^[0-9a-f-]{8,64}$/i;

/** Id gracza z nagłówka `X-Player-Id` (albo `?player_id=` dla <img>/<a>, gdy jawnie dozwolone). */
export function resolvePlayerId(req, { allowQuery = false } = {}) {
  const h = req.get?.("x-player-id") || req.headers?.["x-player-id"];
  const raw = (typeof h === "string" && h.trim()) || (allowQuery && typeof req.query?.player_id === "string" ? req.query.player_id.trim() : "");
  if (!raw || !UUID_RE.test(raw)) return null;
  return raw;
}

/** Wczytaj minimum o graczu; null gdy nie istnieje. */
export async function loadPlayerAuth(playerId) {
  if (!playerId) return null;
  const pool = await initDatabase();
  const { rows } = await pool.query(
    "SELECT id, is_demo, etap_szkolny, ustawienia FROM players WHERE id = $1",
    [playerId]
  );
  if (!rows.length) return null;
  const r = rows[0];
  return {
    playerId: r.id,
    isDemo: r.is_demo === true,
    etap: r.etap_szkolny || null,
    ustawienia: ustawieniaZDomyslnymi(r.ustawienia, r.etap_szkolny),
  };
}

/** Mentor z cookie/Bearer albo null (bez 401 — do tras „gracz ALBO Mentor”). */
export async function mentorFromRequest(req) {
  const token = req.cookies?.mentor_token || req.headers.authorization?.replace(/^Bearer\s+/i, "");
  if (!token) return null;
  try { return await verifySession(token); } catch { return null; }
}

/**
 * Czy Mentor „ma” to dziecko: uczeń w jego klasie (aktywne członkostwo),
 * legacy parowanie `gm_pairings`, albo jego własny gracz demo.
 */
export async function mentorOwnsPlayer(pool, gmAccountId, playerId) {
  if (!gmAccountId || !playerId) return false;
  const { rows } = await pool.query(
    `SELECT 1 WHERE EXISTS (
        SELECT 1 FROM class_memberships cm
          JOIN mentor_classes mc ON mc.id = cm.class_id
         WHERE cm.player_id = $2 AND cm.left_at IS NULL AND mc.gm_account_id = $1)
       OR EXISTS (SELECT 1 FROM gm_pairings gp WHERE gp.gm_account_id = $1 AND gp.player_id = $2)
       OR EXISTS (SELECT 1 FROM players p WHERE p.id = $2 AND p.is_demo = TRUE AND p.created_by_gm_account_id = $1)`,
    [gmAccountId, playerId]
  );
  return rows.length > 0;
}

/** Middleware: wymaga dziecka (`X-Player-Id`). 401 gdy brak/nieznany. */
export function requirePlayer() {
  return async (req, res, next) => {
    try {
      const id = resolvePlayerId(req);
      if (!id) return res.status(401).json({ error: "Brak X-Player-Id", kod: "brak_gracza" });
      const p = await loadPlayerAuth(id);
      if (!p) return res.status(401).json({ error: "Nieznany gracz", kod: "nieznany_gracz" });
      req.player = p;
      next();
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  };
}

/**
 * Middleware: dziecko ALBO Mentor. Ustawia `req.player` i/lub `req.mentor`.
 * Kto ma prawo do konkretnego zasobu, sprawdza trasa (`canAccessPlayer`).
 */
export function requirePlayerOrMentor({ allowQuery = false } = {}) {
  return async (req, res, next) => {
    try {
      const id = resolvePlayerId(req, { allowQuery });
      if (id) req.player = await loadPlayerAuth(id);
      req.mentor = await mentorFromRequest(req);
      if (!req.player && !req.mentor) {
        return res.status(401).json({ error: "Wymagany X-Player-Id albo zalogowany Mentor", kod: "brak_tozsamosci" });
      }
      next();
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  };
}

/** Czy wołający (po requirePlayerOrMentor) ma dostęp do danych gracza `playerId`. */
export async function canAccessPlayer(req, playerId) {
  if (req.player && req.player.playerId === playerId) return true;
  if (req.mentor) {
    const pool = await initDatabase();
    return mentorOwnsPlayer(pool, req.mentor.gmAccountId, playerId);
  }
  return false;
}
