/**
 * Ewolucja — Express app.
 * Eksportuje `createApp()` (do Vercel Function) i sam się uruchamia gdy odpalony jako CLI.
 */
import "dotenv/config";
import express from "express";
import cors from "cors";
import { playerRoutes } from "./api/players.js";
import { gameRoutes } from "./api/game.js";
import { ttsRoutes } from "./api/tts.js";
import { onboardingRoutes } from "./api/onboarding.js";
import { cycleRoutes, missionRoutes } from "./api/cycles.js";
import { gmRoutes } from "./api/gm.js";
import { narrativeRoutes } from "./api/narrative.js";
import { pairRoutes } from "./api/pairs.js";

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json({ limit: "2mb" }));

  // db parameter is unused — wszystkie funkcje DB pobierają pool same przez getPool()
  const db = null;

  app.use("/api/players", playerRoutes(db));
  app.use("/api/game", gameRoutes(db));
  app.use("/api/tts", ttsRoutes());
  app.use("/api/onboarding", onboardingRoutes(db));
  app.use("/api/cycles", cycleRoutes(db));
  app.use("/api/missions", missionRoutes(db));
  app.use("/api/gm", gmRoutes(db));
  app.use("/api/narrative", narrativeRoutes(db));
  app.use("/api/pairs", pairRoutes(db));

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  return app;
}

// Start serwera tylko gdy odpalony bezpośrednio (npm run dev)
if (import.meta.url === `file://${process.argv[1]}`) {
  const PORT = process.env.PORT || 3001;
  const app = createApp();
  app.listen(PORT, () => {
    console.log(`🎮 Ewolucja backend działa na http://localhost:${PORT}`);
  });
}
