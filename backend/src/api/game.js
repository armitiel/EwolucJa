/**
 * API Routes — Logika gry (wybory, mechaniki, profil końcowy)
 */

import { Router } from "express";
import { getPlayer, savePlayer } from "../database/db.js";

// Tabela punktacji (mirror z game_master.py)
const SCORING = {
  "1_A": { DT: 2 }, "1_B": { LD: 2 }, "1_C": { ST: 2 }, "1_D": { KR: 1 },
  "2_A": { ST: 2 }, "2_B": { DT: 3 },
  "3_A": { EM: 2 }, "3_B": { MD: 1 }, "3_C": { ST: 2, EM: -1 },
  "4_WAIT": { ST: 3 }, "4_CLICK": { LD: 1 },
  "6_A": { ST: 2, LD: 1 }, "6_B": { MD: 2 }, "6_C": {},
  "8_A": { LD: 1, MD: -1 }, "8_B": { MD: 2 }, "8_C": { MD: 2, ST: 1 },
  "9_A": { LD: 2 }, "9_B": { ST: 1 }, "9_C": { EM: 2 },
};

const HYBRID_TITLES = {
  "DT_KR": "Wizjoner Tajemnic", "EM_MD": "Strażnik Pokoju",
  "LD_ST": "Generał Przygody", "KR_ST": "Architekt Przyszłości",
  "DT_EM": "Odkrywca Serc", "KR_LD": "Mistrz Inwencji",
  "LD_MD": "Kapitan Drużyny", "DT_ST": "Łamacz Kodów",
  "EM_KR": "Artysta Emocji", "DT_MD": "Dyplomata Wiedzy",
  "EM_LD": "Odważne Serce", "MD_ST": "Mędrzec Pokoju",
  "EM_ST": "Cierpliwy Opiekun", "KR_MD": "Twórczy Mediator",
  "DT_LD": "Śmiały Tropiciel",
};

function clamp(val, min = 0, max = 10) {
  return Math.max(min, Math.min(max, val));
}

export function gameRoutes(db) {
  const router = Router();

  // POST /api/game/choice — Przetwarzanie wyboru gracza
  router.post("/choice", (req, res) => {
    const { player_id, task_id, choice_id, behavioral_data } = req.body;
    const player = getPlayer(db, player_id);
    if (!player) return res.status(404).json({ error: "Gracz nie znaleziony" });

    const key = `${task_id}_${choice_id}`;
    const points = SCORING[key] || {};

    for (const [skill, delta] of Object.entries(points)) {
      player.scores[skill] = clamp((player.scores[skill] || 0) + delta);
    }

    player.choices_log.push({
      land: player.current_land,
      task_id,
      choice_id,
      timestamp: new Date().toISOString(),
      points_awarded: points,
      behavioral_data: behavioral_data || {},
    });

    savePlayer(db, player);
    res.json({ scores: player.scores, points_awarded: points });
  });

  // POST /api/game/emotion-match — Strażnik Masek (Zadanie 5)
  router.post("/emotion-match", (req, res) => {
    const { player_id, matches } = req.body;
    const player = getPlayer(db, player_id);
    if (!player) return res.status(404).json({ error: "Gracz nie znaleziony" });

    const correct = { frustration: "frustracja", embarrassment: "zakłopotanie", pride: "duma" };
    let score = 0;
    for (const [key, val] of Object.entries(matches || {})) {
      if (correct[key] && correct[key].toLowerCase() === val.toLowerCase()) score++;
    }

    player.scores.EM = clamp(player.scores.EM + score);
    player.scores.DT = clamp(player.scores.DT + score);

    player.choices_log.push({
      land: "jaskinia_emocji", task_id: 5, choice_id: `MATCH_${score}/3`,
      timestamp: new Date().toISOString(),
      points_awarded: { EM: score, DT: score },
      behavioral_data: { matches, correct_count: score },
    });

    savePlayer(db, player);
    res.json({ scores: player.scores, correct_count: score });
  });

  // POST /api/game/finalize — Generowanie profilu końcowego
  router.post("/finalize", (req, res) => {
    const { player_id } = req.body;
    const player = getPlayer(db, player_id);
    if (!player) return res.status(404).json({ error: "Gracz nie znaleziony" });

    const sorted = Object.entries(player.scores).sort((a, b) => b[1] - a[1]);
    const topTwo = [sorted[0][0], sorted[1][0]].sort().join("_");
    const title = HYBRID_TITLES[topTwo] || "Bohater Nieznanych Krain";

    player.final_profile = {
      dominant_profiles: [sorted[0][0], sorted[1][0]],
      hybrid_title: title,
      challenge_area: sorted[sorted.length - 1][0],
    };
    player.current_land = null;

    savePlayer(db, player);
    res.json(player);
  });

  return router;
}
