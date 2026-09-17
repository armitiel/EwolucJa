/*!
 * SPDX-FileCopyrightText: © 2026 Amitiel Angelisme <armitiel@gmail.com>
 * SPDX-License-Identifier: LicenseRef-EwolucJA-Proprietary
 *
 * EwolucJA — gra edukacyjna dla dzieci.
 * Produkt powstał w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”;
 * autorskie prawa majątkowe pozostają przy autorze. Licencja: LICENSE.
 */
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

// Nazwy par (dwie najmocniejsze cechy). Kopia tabeli z
// `frontend/src/data/paryProfili.js` — tam jest komentarz, skąd te nazwy.
// Token `{męski|żeński}` rozwija `nazwaPary()` niżej; baza nie ma dziś kolumny
// z rodzajem, więc bez podpowiedzi z klienta wychodzi forma męska.
const HYBRID_TITLES = {
  "DT_KR": "{Pomysłowy Badacz|Pomysłowa Badaczka}",
  "EM_MD": "{Cichy Pomocnik|Cicha Pomocnica}",
  "LD_ST": "{Mądry Dowódca|Mądra Dowódczyni}",
  "KR_ST": "{Konstruktor Pomysłów|Konstruktorka Pomysłów}",
  "DT_EM": "{Ciekawski Kompan|Ciekawska Kompanka}",
  "KR_LD": "{Odważny Majsterkowicz|Odważna Majsterkowiczka}",
  "LD_MD": "{Opanowany Bohater|Opanowana Bohaterka}",
  "DT_ST": "{Detektyw Zagadek|Detektywka Zagadek}",
  "EM_KR": "{Artysta Serca|Artystka Serca}",
  "DT_MD": "{Uważny Obserwator|Uważna Obserwatorka}",
  "EM_LD": "Odważne Serce",
  "MD_ST": "{Cierpliwy Planista|Cierpliwa Planistka}",
  "EM_ST": "{Mądry Pocieszyciel|Mądra Pocieszycielka}",
  "KR_MD": "{Cichy Twórca|Cicha Twórczyni}",
  "DT_LD": "{Śmiały Zwiadowca|Śmiała Zwiadowczyni}",
};

const NAZWA_ZAPASOWA = "{Bohater Nieznanych Krain|Bohaterka Nieznanych Krain}";

/** Rozwija token `{męski|żeński}` — ta sama zasada, co `odmien()` na froncie. */
function nazwaPary(klucz, rodzaj) {
  const wzor = HYBRID_TITLES[klucz] || NAZWA_ZAPASOWA;
  const zenski = String(rodzaj || "").toLowerCase();
  const k = zenski === "zenski" || zenski === "girl" || zenski === "k";
  return wzor.replace(/\{([^{}|]*)\|([^{}|]*)\}/g, (_, m, z) => (k ? z : m));
}

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
    // `rodzaj` jest opcjonalny: klient zna wybór z onboardingu, baza jeszcze nie.
    const { player_id, rodzaj } = req.body;
    const player = getPlayer(db, player_id);
    if (!player) return res.status(404).json({ error: "Gracz nie znaleziony" });

    const sorted = Object.entries(player.scores).sort((a, b) => b[1] - a[1]);
    const topTwo = [sorted[0][0], sorted[1][0]].sort().join("_");
    const title = nazwaPary(topTwo, rodzaj);

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
