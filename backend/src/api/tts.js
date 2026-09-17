/*!
 * SPDX-FileCopyrightText: © 2026 Amitiel Angelisme <armitiel@gmail.com>
 * SPDX-License-Identifier: LicenseRef-EwolucJA-Proprietary
 *
 * EwolucJA — gra edukacyjna dla dzieci.
 * Produkt powstał w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”;
 * autorskie prawa majątkowe pozostają przy autorze. Licencja: LICENSE.
 */
/**
 * EwolucJA — TTS API Routes
 *
 * POST /api/tts/speak     — generuj mowę z tekstu
 * GET  /api/tts/status     — status serwisu TTS
 */

import { Router } from "express";
import { ttsService, pauzaPrzed } from "../services/ttsService.js";

export function ttsRoutes() {
  const router = Router();

  /**
   * POST /api/tts/speak
   * Body: { text, land?, voiceId? }
   * Response: audio/mpeg binary
   */
  router.post("/speak", async (req, res) => {
    try {
      const { text, land, voiceId, tone, speed, pauseBefore, pauseAfter, inlinePauses } = req.body;

      if (!text) {
        return res.status(400).json({ error: "Brak tekstu" });
      }

      if (!ttsService.isAvailable) {
        return res.status(503).json({ error: "TTS niedostępny — brak ELEVENLABS_API_KEY" });
      }

      const audioBuffer = await ttsService.synthesize(text, { land, voiceId, tone, speed, pauseBefore, pauseAfter, inlinePauses });

      res.set({
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.length,
        "Cache-Control": "public, max-age=3600",
        // Cisza PRZED kwestią nie jest już w nagraniu (patrz `decorateText`
        // w ttsService.js) — odmierza ją klient. Bez `Expose-Headers`
        // przeglądarka nie pozwoli jej odczytać przy zapytaniu z innego
        // źródła (dev: 5173 → 3001).
        "X-Pauza-Przed": String(pauzaPrzed({ tone, pauseBefore })),
        "Access-Control-Expose-Headers": "X-Pauza-Przed",
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
