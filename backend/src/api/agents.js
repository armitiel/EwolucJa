/**
 * API Routes — Endpointy agentów AI (GAMA-1)
 *
 * Endpointy:
 * POST /api/agents/narrate       — Generuj narrację dla krainy/zadania
 * POST /api/agents/transition    — Generuj narrację przejścia
 * POST /api/agents/analyze       — Mikro-analiza wyboru
 * POST /api/agents/creativity    — Ewaluacja kreatywności
 * POST /api/agents/equipment     — Opis nowego przedmiotu
 * POST /api/agents/finalize      — Finalizacja: raporty + analiza + karta
 * POST /api/agents/image-prompt  — Prompt do AI image generation
 * GET  /api/agents/metrics       — Metryki agentów
 */

import { Router } from "express";
import { GameOrchestrator } from "../agents/GameOrchestrator.js";
import { getPlayer } from "../database/db.js";

export function agentRoutes(db) {
  const router = Router();
  const orchestrator = new GameOrchestrator();

  // ── Pomocnik: pobierz gracza lub zwróć 404 ────────────────────

  function getPlayerOrFail(req, res) {
    const { player_id } = req.body;
    if (!player_id) {
      res.status(400).json({ error: "Brak player_id" });
      return null;
    }
    const player = getPlayer(db, player_id);
    if (!player) {
      res.status(404).json({ error: "Gracz nie znaleziony" });
      return null;
    }
    return player;
  }

  // ── POST /api/agents/narrate ──────────────────────────────────

  router.post("/narrate", async (req, res) => {
    try {
      const player = getPlayerOrFail(req, res);
      if (!player) return;

      const { land, task_id } = req.body;
      if (!land || task_id === undefined) {
        return res.status(400).json({ error: "Brak land lub task_id" });
      }

      const result = await orchestrator.enterLand(player, land, task_id);
      res.json(result);
    } catch (err) {
      console.error("[agents/narrate]", err);
      res.status(500).json({ error: err.message });
    }
  });

  // ── POST /api/agents/transition ───────────────────────────────

  router.post("/transition", async (req, res) => {
    try {
      const player = getPlayerOrFail(req, res);
      if (!player) return;

      const { from_land, to_land } = req.body;
      if (!from_land || !to_land) {
        return res.status(400).json({ error: "Brak from_land lub to_land" });
      }

      const result = await orchestrator.transitionLand(player, from_land, to_land);
      res.json(result);
    } catch (err) {
      console.error("[agents/transition]", err);
      res.status(500).json({ error: err.message });
    }
  });

  // ── POST /api/agents/analyze ──────────────────────────────────

  router.post("/analyze", async (req, res) => {
    try {
      const player = getPlayerOrFail(req, res);
      if (!player) return;

      const { task_id, choice_id, behavioral_data } = req.body;
      if (!task_id || !choice_id) {
        return res.status(400).json({ error: "Brak task_id lub choice_id" });
      }

      const result = await orchestrator.processChoice(
        player, task_id, choice_id, behavioral_data || {}
      );
      res.json(result);
    } catch (err) {
      console.error("[agents/analyze]", err);
      res.status(500).json({ error: err.message });
    }
  });

  // ── POST /api/agents/creativity ───────────────────────────────

  router.post("/creativity", async (req, res) => {
    try {
      const player = getPlayerOrFail(req, res);
      if (!player) return;

      const { answer } = req.body;
      if (!answer) {
        return res.status(400).json({ error: "Brak answer" });
      }

      const result = await orchestrator.evaluateCreativity(player, answer);
      res.json(result);
    } catch (err) {
      console.error("[agents/creativity]", err);
      res.status(500).json({ error: err.message });
    }
  });

  // ── POST /api/agents/equipment ────────────────────────────────

  router.post("/equipment", async (req, res) => {
    try {
      const player = getPlayerOrFail(req, res);
      if (!player) return;

      const { item_id, item_name, context } = req.body;
      if (!item_id || !item_name) {
        return res.status(400).json({ error: "Brak item_id lub item_name" });
      }

      const result = await orchestrator.describeEquipment(
        player, item_id, item_name, context || ""
      );
      res.json(result);
    } catch (err) {
      console.error("[agents/equipment]", err);
      res.status(500).json({ error: err.message });
    }
  });

  // ── POST /api/agents/finalize ─────────────────────────────────

  router.post("/finalize", async (req, res) => {
    try {
      const player = getPlayerOrFail(req, res);
      if (!player) return;

      const result = await orchestrator.finalizeGame(player);
      res.json(result);
    } catch (err) {
      console.error("[agents/finalize]", err);
      res.status(500).json({ error: err.message });
    }
  });

  // ── POST /api/agents/image-prompt ─────────────────────────────

  router.post("/image-prompt", async (req, res) => {
    try {
      const player = getPlayerOrFail(req, res);
      if (!player) return;

      const result = await orchestrator.generateAvatarImagePrompt(player);
      res.json(result);
    } catch (err) {
      console.error("[agents/image-prompt]", err);
      res.status(500).json({ error: err.message });
    }
  });

  // ── POST /api/agents/generate-avatar — Pełny pipeline: prompt + obraz ──

  router.post("/generate-avatar", async (req, res) => {
    try {
      const player = getPlayerOrFail(req, res);
      if (!player) return;

      const result = await orchestrator.generateAvatarImage(player);
      res.json(result);
    } catch (err) {
      console.error("[agents/generate-avatar]", err);
      res.status(500).json({ error: err.message });
    }
  });

  // ── POST /api/agents/finalize-full — Finalizacja z obrazem bohatera ──

  router.post("/finalize-full", async (req, res) => {
    try {
      const player = getPlayerOrFail(req, res);
      if (!player) return;

      const result = await orchestrator.finalizeGameWithImage(player);
      res.json(result);
    } catch (err) {
      console.error("[agents/finalize-full]", err);
      res.status(500).json({ error: err.message });
    }
  });

  // ── POST /api/agents/character-description ─────────────────────

  router.post("/character-description", async (req, res) => {
    try {
      const { playerName, scores, title, topProfiles, equipment, gender } = req.body;
      if (!playerName || !scores || !title) {
        return res.status(400).json({ error: "Brak playerName, scores lub title" });
      }

      const description = await orchestrator.generateCharacterDescription({
        playerName, scores, title, topProfiles, equipment: equipment || [], gender: gender || "boy",
      });
      res.json({ description });
    } catch (err) {
      console.error("[agents/character-description]", err);
      res.status(500).json({ error: err.message });
    }
  });

  // ── GET /api/agents/metrics ───────────────────────────────────

  router.get("/metrics", (req, res) => {
    res.json(orchestrator.getMetrics());
  });

  return router;
}
