/**
 * Ewolucja — Serwer Backend
 *
 * Łączy frontend PWA z agentem GAMA-1 i bazą danych SQLite.
 */

import "dotenv/config";
import express from "express";
import cors from "cors";
import { initDatabase } from "./database/db.js";
import { playerRoutes } from "./api/players.js";
import { gameRoutes } from "./api/game.js";
import { agentRoutes } from "./api/agents.js";
import { ttsRoutes } from "./api/tts.js";
import { imageRoutes } from "./api/images.js";
import { onboardingRoutes } from "./api/onboarding.js";
import { cycleRoutes, missionRoutes } from "./api/cycles.js";
import { gmRoutes } from "./api/gm.js";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: "2mb" }));

// Inicjalizacja bazy danych
const db = initDatabase();

// Routes — V1 (zachowane dla wstecznej kompatybilności)
app.use("/api/players", playerRoutes(db));
app.use("/api/game", gameRoutes(db));
app.use("/api/agents", agentRoutes(db));
app.use("/api/tts", ttsRoutes());
app.use("/api/images", imageRoutes());

// Routes — V2 (nowy model: archetyp, cykl tygodniowy, GM)
app.use("/api/onboarding", onboardingRoutes(db));
app.use("/api/cycles", cycleRoutes(db));
app.use("/api/missions", missionRoutes(db));
app.use("/api/gm", gmRoutes(db));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🎮 Ewolucja backend działa na http://localhost:${PORT}`);
});
