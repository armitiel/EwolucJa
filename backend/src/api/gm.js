/**
 * API Routes — Game Master (rodzic / nauczyciel).
 *
 * Architektura: jedna persona GM widziana przez dziecko, wiele kont dorosłych
 * podpiętych do tej samej persony.
 */

import { Router } from "express";
import { randomUUID } from "crypto";
import {
  getPlayer,
  savePlayer,
  createGMAccount,
  getGMAccount,
  pairGMWithPlayer,
  issuePairingCode,
  consumePairingCode,
  verifyMission,
  getMission,
  getMissionQueueForGM,
  addArtifactToBackpack,
} from "../database/db.js";

function ensureGMPersona(db, playerId) {
  const player = getPlayer(db, playerId);
  if (!player) return null;
  if (player.gm_persona_id) return player.gm_persona_id;
  const personaId = `gmp_${randomUUID()}`;
  player.gm_persona_id = personaId;
  savePlayer(db, player);
  return personaId;
}

export function gmRoutes(db) {
  const router = Router();

  // POST /api/gm/register — utworzenie konta GM (rodzic / nauczyciel)
  // Pierwsze konto powiązane z dzieckiem ustanawia personę GM.
  router.post("/register", (req, res) => {
    const { role, name, email, pairing_code } = req.body;
    if (!["parent", "teacher"].includes(role)) {
      return res.status(400).json({ error: "Niepoprawna rola (parent/teacher)" });
    }
    if (!name) {
      return res.status(400).json({ error: "Imię opiekuna jest wymagane" });
    }

    const accountId = `gm_${randomUUID()}`;

    let pairedPlayerId = null;
    let gmPersonaId = null;

    if (pairing_code) {
      const result = consumePairingCode(db, pairing_code, accountId);
      if (!result) {
        return res.status(400).json({ error: "Nieprawidłowy lub wygasły kod parowania" });
      }
      pairedPlayerId = result.player_id;
      gmPersonaId = ensureGMPersona(db, pairedPlayerId);
    } else {
      // Konto bez parowania (np. nauczyciel zarejestruje się i zaprosi dzieci później)
      gmPersonaId = `gmp_${randomUUID()}`;
    }

    createGMAccount(db, {
      account_id: accountId,
      role,
      name,
      email: email || null,
      gm_persona_id: gmPersonaId,
    });

    if (pairedPlayerId) {
      pairGMWithPlayer(db, accountId, pairedPlayerId, pairing_code);
    }

    res.status(201).json({
      account_id: accountId,
      role,
      name,
      gm_persona_id: gmPersonaId,
      paired_player_ids: pairedPlayerId ? [pairedPlayerId] : [],
    });
  });

  // GET /api/gm/:accountId — pobierz konto GM
  router.get("/:accountId", (req, res) => {
    const account = getGMAccount(db, req.params.accountId);
    if (!account) return res.status(404).json({ error: "Konto GM nie znalezione" });
    res.json(account);
  });

  // POST /api/gm/issue-pairing-code — gracz (lub pierwszy GM) generuje kod do dodania kolejnego opiekuna
  router.post("/issue-pairing-code", (req, res) => {
    const { player_id, role_for, issued_by_account_id } = req.body;
    if (!["parent", "teacher"].includes(role_for)) {
      return res.status(400).json({ error: "role_for musi być parent lub teacher" });
    }
    const player = getPlayer(db, player_id);
    if (!player) return res.status(404).json({ error: "Gracz nie znaleziony" });
    // Upewnij się, że dziecko ma już personę GM (jeśli nie, ustanów)
    ensureGMPersona(db, player_id);
    const code = issuePairingCode(db, player_id, role_for, issued_by_account_id);
    res.json(code);
  });

  // POST /api/gm/pair — dołącz istniejące konto GM do dziecka przez kod
  router.post("/pair", (req, res) => {
    const { account_id, pairing_code } = req.body;
    const account = getGMAccount(db, account_id);
    if (!account) return res.status(404).json({ error: "Konto GM nie znalezione" });
    const result = consumePairingCode(db, pairing_code, account_id);
    if (!result) return res.status(400).json({ error: "Nieprawidłowy lub wygasły kod parowania" });

    // jeśli dziecko ma już persona, użyj jego persona — wszystkie konta dorosłych
    // dzielą tę samą persona dla tego dziecka
    const personaId = ensureGMPersona(db, result.player_id);
    pairGMWithPlayer(db, account_id, result.player_id, pairing_code);

    res.json({ paired_player_id: result.player_id, gm_persona_id: personaId });
  });

  // GET /api/gm/:accountId/queue — kolejka misji do weryfikacji
  router.get("/:accountId/queue", (req, res) => {
    const queue = getMissionQueueForGM(db, req.params.accountId);
    // Wzbogać o imiona dzieci (czytelnie dla panelu)
    const enriched = queue.map((m) => {
      const p = getPlayer(db, m.player_id);
      return { ...m, player_name: p ? p.player_name : "?" };
    });
    res.json({ missions: enriched });
  });

  // POST /api/gm/verify/:missionId — zatwierdź / wyróżnij / dopytaj
  router.post("/verify/:missionId", (req, res) => {
    const { account_id, verdict, comment_text, comment_voice_url } = req.body;
    if (!["approved", "highlighted", "needs_followup"].includes(verdict)) {
      return res.status(400).json({ error: "Niepoprawny verdict" });
    }
    const account = getGMAccount(db, account_id);
    if (!account) return res.status(404).json({ error: "Konto GM nie znalezione" });

    const mission = getMission(db, req.params.missionId);
    if (!mission) return res.status(404).json({ error: "Misja nie znaleziona" });

    verifyMission(db, req.params.missionId, {
      verified_by_account_id: account_id,
      verified_at: new Date().toISOString(),
      verdict,
      comment_text: comment_text || "",
      comment_voice_url: comment_voice_url || null,
    });

    // Po zatwierdzeniu — dorzuć artefakt-nagrodę cyklu do plecaka dziecka
    if (verdict === "approved" || verdict === "highlighted") {
      if (mission.artifact_reward) {
        addArtifactToBackpack(db, mission.player_id, {
          ...mission.artifact_reward,
          cycle_id: mission.cycle_id,
        });
      }
      // Aktualizuj scoring dziecka na podstawie competency_focus misji
      const player = getPlayer(db, mission.player_id);
      if (player) {
        const bonus = verdict === "highlighted" ? 3 : 2;
        for (const profile of mission.competency_focus || []) {
          player.scores[profile] = Math.min(10, (player.scores[profile] || 0) + bonus);
          player.lifetime_scores[profile] = (player.lifetime_scores[profile] || 0) + bonus;
        }
        savePlayer(db, player);
      }
    }

    res.json({ ok: true });
  });

  return router;
}
