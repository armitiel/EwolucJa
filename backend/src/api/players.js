import { Router } from "express";
import { getPlayer, savePlayer, initDatabase } from "../database/db.js";
import { randomUUID } from "crypto";

export function playerRoutes(db) {
  const router = Router();

  router.post("/", async (req, res) => {
    try {
      const { name } = req.body;
      if (!name || name.trim().length === 0) {
        return res.status(400).json({ error: "Imię gracza jest wymagane" });
      }
      const profile = {
        player_id: randomUUID(),
        player_name: name.trim(),
        avatar: { base_image: null, aura_color: null, starter_item: null, unlocked_assets: [] },
        scores: { EM: 0, ST: 0, KR: 0, LD: 0, DT: 0, MD: 0 },
        current_land: "dolina_selfie",
        completed_lands: [],
        choices_log: [],
        final_profile: null,
        lifetime_scores: { EM: 0, ST: 0, KR: 0, LD: 0, DT: 0, MD: 0 },
        backpack: [],
      };
      await savePlayer(db, profile);
      res.status(201).json(profile);
    } catch (e) {
      console.error("[players POST]", e);
      res.status(500).json({ error: e.message });
    }
  });

  router.get("/:id", async (req, res) => {
    try {
      const player = await getPlayer(db, req.params.id);
      if (!player) return res.status(404).json({ error: "Gracz nie znaleziony" });
      res.json(player);
    } catch (e) {
      console.error("[players GET]", e);
      res.status(500).json({ error: e.message });
    }
  });

  router.put("/:id", async (req, res) => {
    try {
      const existing = await getPlayer(db, req.params.id);
      if (!existing) return res.status(404).json({ error: "Gracz nie znaleziony" });
      const updated = { ...existing, ...req.body, player_id: req.params.id };
      await savePlayer(db, updated);
      res.json(updated);
    } catch (e) {
      console.error("[players PUT]", e);
      res.status(500).json({ error: e.message });
    }
  });

  // HINT/ARTEFAKT od mentora - pobierz nieprzeczytane
  router.get("/:id/hints/unread", async (req, res) => {
    try {
      const pool = await initDatabase();
      const { rows } = await pool.query(
        `SELECT mh.id, mh.kind, mh.title, mh.body, mh.sent_at,
                ga.name AS mentor_name
           FROM mentor_hints mh
           LEFT JOIN gm_accounts ga ON ga.id = mh.gm_account_id
           WHERE mh.player_id = $1 AND mh.viewed_at IS NULL
           ORDER BY mh.sent_at ASC`,
        [req.params.id]
      );
      res.json({ hints: rows });
    } catch (e) {
      console.error("[hints unread]", e);
      res.status(500).json({ error: e.message });
    }
  });

  // Oznacz hint jako widziany
  router.post("/:id/hints/:hintId/view", async (req, res) => {
    try {
      const pool = await initDatabase();
      await pool.query(
        `UPDATE mentor_hints SET viewed_at = NOW()
           WHERE id = $1 AND player_id = $2`,
        [req.params.hintId, req.params.id]
      );
      res.json({ ok: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  return router;
}
