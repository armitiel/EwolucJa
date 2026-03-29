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

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Inicjalizacja bazy danych
const db = initDatabase();

// Routes
app.use("/api/players", playerRoutes(db));
app.use("/api/game", gameRoutes(db));
app.use("/api/agents", agentRoutes(db));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🎮 Ewolucja backend działa na http://localhost:${PORT}`);
});
