/**
 * API Routes — Zarządzanie graczami
 */

import { Router } from "express";
import { getPlayer, savePlayer } from "../database/db.js";
import { randomUUID } from "crypto";

export function playerRoutes(db) {
  const router = Router();

  // POST /api/players — Tworzenie nowego gracza
  router.post("/", (req, res) => {
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
    };

    savePlayer(db, profile);
    res.status(201).json(profile);
  });

  // GET /api/players/:id — Pobieranie profilu gracza
  router.get("/:id", (req, res) => {
    const player = getPlayer(db, req.params.id);
    if (!player) {
      return res.status(404).json({ error: "Gracz nie znaleziony" });
    }
    res.json(player);
  });

  // PUT /api/players/:id — Aktualizacja profilu gracza
  router.put("/:id", (req, res) => {
    const existing = getPlayer(db, req.params.id);
    if (!existing) {
      return res.status(404).json({ error: "Gracz nie znaleziony" });
    }
    const updated = { ...existing, ...req.body, player_id: req.params.id };
    savePlayer(db, updated);
    res.json(updated);
  });

  return router;
}
