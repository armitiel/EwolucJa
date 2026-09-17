/*!
 * SPDX-FileCopyrightText: © 2026 Amitiel Angelisme <armitiel@gmail.com>
 * SPDX-License-Identifier: LicenseRef-EwolucJA-Proprietary
 *
 * EwolucJA — gra edukacyjna dla dzieci.
 * Produkt powstał w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”;
 * autorskie prawa majątkowe pozostają przy autorze. Licencja: LICENSE.
 */
import express from "express";
import { ttsRoutes } from "./src/api/tts.js";

const app = express();
app.use(express.json());

console.log("Registering /api/tts...");
app.use("/api/tts", ttsRoutes());
console.log("Route registered OK");

console.log("ELEVENLABS_API_KEY:", process.env.ELEVENLABS_API_KEY ? "SET (" + process.env.ELEVENLABS_API_KEY.slice(0,10) + "...)" : "MISSING");

app.listen(4555, async () => {
  console.log("Test server on http://localhost:4555");
  try {
    const r = await fetch("http://localhost:4555/api/tts/status");
    const d = await r.json();
    console.log("TTS STATUS:", JSON.stringify(d));
  } catch (e) {
    console.log("FETCH ERR:", e.message);
  }
  process.exit(0);
});
