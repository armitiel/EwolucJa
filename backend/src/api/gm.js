import { Router } from "express";
import { randomUUID } from "crypto";
import {
  getPlayer, savePlayer, createGMAccount, getGMAccount,
  pairGMWithPlayer, issuePairingCode, consumePairingCode,
  verifyMission, getMission, getMissionQueueForGM, addArtifactToBackpack,
} from "../database/db.js";

async function ensureGMPersona(db, playerId) {
  const player = await getPlayer(db, playerId);
  if (!player) return null;
  if (player.gm_persona_id) return player.gm_persona_id;
  const personaId = `gmp_${randomUUID()}`;
  player.gm_persona_id = personaId;
  await savePlayer(db, player);
  return personaId;
}

export function gmRoutes(db) {
  const router = Router();

  router.post("/register", async (req, res) => {
    try {
      const { role, name, email, pairing_code } = req.body;
      if (!["parent", "teacher"].includes(role)) return res.status(400).json({ error: "Niepoprawna rola (parent/teacher)" });
      if (!name) return res.status(400).json({ error: "Imię opiekuna jest wymagane" });
      const accountId = `gm_${randomUUID()}`;
      let pairedPlayerId = null;
      let gmPersonaId = null;
      if (pairing_code) {
        const result = await consumePairingCode(db, pairing_code, accountId);
        if (!result) return res.status(400).json({ error: "Nieprawidłowy lub wygasły kod parowania" });
        pairedPlayerId = result.player_id;
        gmPersonaId = await ensureGMPersona(db, pairedPlayerId);
      } else {
        gmPersonaId = `gmp_${randomUUID()}`;
      }
      await createGMAccount(db, { account_id: accountId, role, name, email: email || null, gm_persona_id: gmPersonaId });
      if (pairedPlayerId) await pairGMWithPlayer(db, accountId, pairedPlayerId, pairing_code);
      res.status(201).json({
        account_id: accountId, role, name, gm_persona_id: gmPersonaId,
        paired_player_ids: pairedPlayerId ? [pairedPlayerId] : [],
      });
    } catch (e) { console.error("[gm register]", e); res.status(500).json({ error: e.message }); }
  });

  router.get("/:accountId", async (req, res) => {
    try {
      const account = await getGMAccount(db, req.params.accountId);
      if (!account) return res.status(404).json({ error: "Konto GM nie znalezione" });
      res.json(account);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  router.post("/issue-pairing-code", async (req, res) => {
    try {
      const { player_id, role_for, issued_by_account_id } = req.body;
      if (!["parent", "teacher"].includes(role_for)) return res.status(400).json({ error: "role_for musi być parent lub teacher" });
      const player = await getPlayer(db, player_id);
      if (!player) return res.status(404).json({ error: "Gracz nie znaleziony" });
      await ensureGMPersona(db, player_id);
      const code = await issuePairingCode(db, player_id, role_for, issued_by_account_id);
      res.json(code);
    } catch (e) { console.error("[gm issue-pairing]", e); res.status(500).json({ error: e.message }); }
  });

  router.post("/pair", async (req, res) => {
    try {
      const { account_id, pairing_code } = req.body;
      const account = await getGMAccount(db, account_id);
      if (!account) return res.status(404).json({ error: "Konto GM nie znalezione" });
      const result = await consumePairingCode(db, pairing_code, account_id);
      if (!result) return res.status(400).json({ error: "Nieprawidłowy lub wygasły kod parowania" });
      const personaId = await ensureGMPersona(db, result.player_id);
      await pairGMWithPlayer(db, account_id, result.player_id, pairing_code);
      res.json({ paired_player_id: result.player_id, gm_persona_id: personaId });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  router.get("/:accountId/queue", async (req, res) => {
    try {
      const queue = await getMissionQueueForGM(db, req.params.accountId);
      const enriched = await Promise.all(queue.map(async (m) => {
        const p = await getPlayer(db, m.player_id);
        return { ...m, player_name: p ? p.player_name : "?" };
      }));
      res.json({ missions: enriched });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  router.post("/verify/:missionId", async (req, res) => {
    try {
      const { account_id, verdict, comment_text, comment_voice_url } = req.body;
      if (!["approved", "highlighted", "needs_followup"].includes(verdict)) return res.status(400).json({ error: "Niepoprawny verdict" });
      const account = await getGMAccount(db, account_id);
      if (!account) return res.status(404).json({ error: "Konto GM nie znalezione" });
      const mission = await getMission(db, req.params.missionId);
      if (!mission) return res.status(404).json({ error: "Misja nie znaleziona" });
      await verifyMission(db, req.params.missionId, {
        verified_by_account_id: account_id,
        verified_at: new Date().toISOString(),
        verdict,
        comment_text: comment_text || "",
        comment_voice_url: comment_voice_url || null,
      });
      if (verdict === "approved" || verdict === "highlighted") {
        if (mission.artifact_reward) {
          await addArtifactToBackpack(db, mission.player_id, { ...mission.artifact_reward, cycle_id: mission.cycle_id });
        }
        const player = await getPlayer(db, mission.player_id);
        if (player) {
          const bonus = verdict === "highlighted" ? 3 : 2;
          for (const profile of mission.competency_focus || []) {
            player.scores[profile] = Math.min(10, (player.scores[profile] || 0) + bonus);
            player.lifetime_scores[profile] = (player.lifetime_scores[profile] || 0) + bonus;
          }
          await savePlayer(db, player);
        }
      }
      res.json({ ok: true });
    } catch (e) { console.error("[gm verify]", e); res.status(500).json({ error: e.message }); }
  });

  return router;
}
