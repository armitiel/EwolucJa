/**
 * API Routes — Generowanie obrazów przez fal.ai
 *
 * Endpointy:
 * POST /api/images/avatar     — generuj awatar gracza
 * POST /api/images/land        — generuj tło krainy
 * POST /api/images/hero-card   — generuj kartę bohatera
 * POST /api/images/equipment   — generuj obraz ekwipunku
 * POST /api/images/custom      — generuj custom prompt
 * GET  /api/images/status      — status serwisu
 */

import { Router } from "express";
import { falService } from "../services/falService.js";

export function imageRoutes() {
  const router = Router();

  // ── Status serwisu ──────────────────────────────────────────────────
  router.get("/status", (req, res) => {
    res.json({
      ok: true,
      service: "fal.ai",
      ...falService.getInfo(),
    });
  });

  // ── Generuj awatar gracza ──────────────────────────────────────────
  router.post("/avatar", async (req, res) => {
    try {
      const { playerName, avatarPrompt, avatarConfig } = req.body;

      if (!playerName) {
        return res.status(400).json({ error: "playerName is required" });
      }

      if (!falService.isAvailable()) {
        return res.status(503).json({
          error: "Image generation service not configured",
          hint: "Set FAL_KEY in .env",
        });
      }

      const result = await falService.generateAvatar({
        playerName,
        avatarPrompt,
        avatarConfig: avatarConfig || {},
      });

      res.json({
        ok: true,
        type: "avatar",
        ...result,
      });
    } catch (err) {
      console.error("[Images API] Avatar error:", err.message);
      res.status(500).json({ error: err.message });
    }
  });

  // ── Generuj tło krainy ─────────────────────────────────────────────
  router.post("/land", async (req, res) => {
    try {
      const { landName } = req.body;

      if (!landName) {
        return res.status(400).json({ error: "landName is required" });
      }

      if (!falService.isAvailable()) {
        return res.status(503).json({ error: "Service not configured" });
      }

      const result = await falService.generateLandBackground(landName);

      res.json({
        ok: true,
        type: "land_background",
        land: landName,
        ...result,
      });
    } catch (err) {
      console.error("[Images API] Land error:", err.message);
      res.status(500).json({ error: err.message });
    }
  });

  // ── Generuj kartę bohatera ─────────────────────────────────────────
  router.post("/hero-card", async (req, res) => {
    try {
      const { playerName, hybridTitle, imagePrompt, equipment } = req.body;

      if (!playerName) {
        return res.status(400).json({ error: "playerName is required" });
      }

      if (!falService.isAvailable()) {
        return res.status(503).json({ error: "Service not configured" });
      }

      const result = await falService.generateHeroCard({
        playerName,
        hybridTitle: hybridTitle || "Bohater",
        imagePrompt,
        equipment: equipment || [],
      });

      res.json({
        ok: true,
        type: "hero_card",
        ...result,
      });
    } catch (err) {
      console.error("[Images API] Hero card error:", err.message);
      res.status(500).json({ error: err.message });
    }
  });

  // ── Generuj obraz ekwipunku ────────────────────────────────────────
  router.post("/equipment", async (req, res) => {
    try {
      const { itemName, itemDescription } = req.body;

      if (!itemName) {
        return res.status(400).json({ error: "itemName is required" });
      }

      if (!falService.isAvailable()) {
        return res.status(503).json({ error: "Service not configured" });
      }

      const result = await falService.generateEquipmentImage(
        itemName,
        itemDescription || ""
      );

      res.json({
        ok: true,
        type: "equipment",
        item: itemName,
        ...result,
      });
    } catch (err) {
      console.error("[Images API] Equipment error:", err.message);
      res.status(500).json({ error: err.message });
    }
  });

  // ── Custom prompt ──────────────────────────────────────────────────
  router.post("/custom", async (req, res) => {
    try {
      const { prompt, imageSize, numSteps } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: "prompt is required" });
      }

      if (!falService.isAvailable()) {
        return res.status(503).json({ error: "Service not configured" });
      }

      const result = await falService.generate(prompt, {
        imageSize: imageSize || "square_hd",
        numSteps: numSteps || 4,
      });

      res.json({
        ok: true,
        type: "custom",
        ...result,
      });
    } catch (err) {
      console.error("[Images API] Custom error:", err.message);
      res.status(500).json({ error: err.message });
    }
  });

  return router;
}
