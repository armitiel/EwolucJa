/**
 * EwolucJA — TTS API Routes
 *
 * POST /api/tts/speak     — generuj mowę z tekstu
 * GET  /api/tts/status     — status serwisu TTS
 */

import { Router } from "express";
import { ttsService } from "../services/ttsService.js";

export function ttsRoutes() {
  const router = Router();

  /**
   * POST /api/tts/speak
   * Body: { text, land?, voiceId? }
   * Response: audio/mpeg binary
   */
  router.post("/speak", async (req, res) => {
    try {
      const { text, land, voiceId } = req.body;

      if (!text) {
        return res.status(400).json({ error: "Brak tekstu" });
      }

      if (!ttsService.isAvailable) {
        return res.status(503).json({ error: "TTS niedostępny — brak ELEVENLABS_API_KEY" });
      }

      const audioBuffer = await ttsService.synthesize(text, { land, voiceId });

      res.set({
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.length,
        "Cache-Control": "public, max-age=3600",
      });
      res.send(audioBuffer);
    } catch (err) {
      console.error("[TTS]", err.message);
      res.status(500).json({ error: err.message });
    }
  });

  /**
   * GET /api/tts/status
   * Zwraca informacje o serwisie TTS
   */
  router.get("/status", (req, res) => {
    res.json(ttsService.getInfo());
  });

  return router;
}
