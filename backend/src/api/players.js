import { Router } from "express";
import { getPlayer, savePlayer } from "../database/db.js";
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

  return router;
}
