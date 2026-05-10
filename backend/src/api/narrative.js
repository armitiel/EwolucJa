/**
 * API Routes — generator opowieści/misji przez Claude API.
 *
 * GET  /api/narrative/status       — czy serwis jest dostępny
 * POST /api/narrative/intro        — wygeneruj wstęp narracyjny dla kontekstu
 * POST /api/narrative/mission      — wygeneruj pełną misję (alternatywa dla seed library)
 */
import { Router } from "express";
import { narrativeService } from "../services/narrativeService.js";
import { getPlayer } from "../database/db.js";

export function narrativeRoutes(db) {
  const router = Router();

  router.get("/status", (req, res) => {
    res.json(narrativeService.getInfo());
  });

  router.post("/intro", async (req, res) => {
    try {
      if (!narrativeService.isAvailable) {
        return res.status(503).json({ error: "Anthropic API niedostępny — brak ANTHROPIC_API_KEY" });
      }
      const { player_id, context } = req.body;
      if (!context) return res.status(400).json({ error: "Brak context" });
      const player = player_id ? await getPlayer(db, player_id) : null;
      const result = await narrativeService.generateNarrativeIntro({
        playerName: player?.player_name || "bohaterze",
        archetype: player?.archetype || "tropiciel_tajemnic",
        context,
      });
      res.json(result);
    } catch (e) {
      console.error("[narrative intro]", e);
      res.status(500).json({ error: e.message });
    }
  });

  router.post("/mission", async (req, res) => {
    try {
      if (!narrativeService.isAvailable) {
        return res.status(503).json({ error: "Anthropic API niedostępny" });
      }
      const { player_id } = req.body;
      const player = await getPlayer(db, player_id);
      if (!player) return res.status(404).json({ error: "Gracz nie znaleziony" });
      const completed = (player.choices_log || [])
        .filter((c) => c.task_id === "mission")
        .map((c) => c.choice_id);
      const result = await narrativeService.generateMission({
        playerName: player.player_name,
        archetype: player.archetype || "tropiciel_tajemnic",
        completedMissionTitles: completed,
        scores: player.scores,
        chapter: player.current_chapter || "wezwanie_kroniki",
      });
      res.json(result);
    } catch (e) {
      console.error("[narrative mission]", e);
      res.status(500).json({ error: e.message });
    }
  });

  return router;
}
