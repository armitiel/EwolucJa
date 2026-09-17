/*!
 * SPDX-FileCopyrightText: © 2026 Amitiel Angelisme <armitiel@gmail.com>
 * SPDX-License-Identifier: LicenseRef-EwolucJA-Proprietary
 *
 * EwolucJA — gra edukacyjna dla dzieci.
 * Produkt powstał w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”;
 * autorskie prawa majątkowe pozostają przy autorze. Licencja: LICENSE.
 */
import { Router } from "express";
import { narrativeService } from "../services/narrativeService.js";
import {
  getPlayer, savePlayer, createCycle, getCurrentCycle, closeCycle,
  createMission, getCurrentMission, getMission, submitMissionProof,
  addArtifactToBackpack, getPool,
} from "../database/db.js";
// SINGLE SOURCE OF TRUTH: ta sama biblioteka co panel mentora.
// frontend/src/data/mentorTaskLibrary.js zawiera BASE_LIBRARY (120 zredagowanych przez agentow)
// + ADDITIONAL_TASKS (216 swiezych zadan). Wczesniej backend mial 5 hardcoded staruszkow z DT,
// ktore nie byly redagowane razem z baza mentora — dawalo to wrazenie ze fallback zwraca rzeczy
// "z innego swiata" niz to, co dziala u mentora. Teraz oba korzystaja z tego samego pliku.
import { MENTOR_TASK_LIBRARY } from "../../../frontend/src/data/mentorTaskLibrary.js";

// Stare wartosci 'archetype' w bazie (np. 'tropiciel_tajemnic') -> kod profilu (DT).
// Nowe wartosci powinny byc bezposrednio kodami (EM/ST/KR/LD/DT/MD).
const LEGACY_ARCHETYPE_TO_PROFILE = {
  tropiciel_tajemnic: "DT",
  zaklinacz_uczuc: "EM",
  mistrz_map: "ST",
  tkacz_snow: "KR",
  gwardzista_odwagi: "LD",
  straznik_mostu: "MD",
};
const PROFILE_CODES = new Set(["DT", "EM", "ST", "KR", "LD", "MD"]);
// Monety w tle za slad zadania w realu (cichy licznik w HUD; zero w kwestiach).
const MONETY_ZA_SLAD = 25;
function mapToProfileCode(value) {
  if (!value) return null;
  if (PROFILE_CODES.has(value)) return value;
  return LEGACY_ARCHETYPE_TO_PROFILE[value] || null;
}

// narrative_intro nie jest w bibliotece — generujemy lekkie wprowadzenie zaleznie od profilu.
// Krotkie, w trzeciej osobie z perspektywy Wizkora (docs/SWIAT_I_POSTACIE.md).
const PROFILE_INTROS = {
  DT: "Wizkor szepcze: nowa zagadka czeka. Rozejrzyj się uważniej niż zwykle.",
  EM: "Wizkor uśmiecha się: dziś możesz zauważyć, czego ktoś potrzebuje.",
  ST: "Wizkor spogląda na mapę: dobry plan zaczyna się od jednej małej rzeczy.",
  KR: "Wizkor mruga: twoja wyobraźnia ma dziś robotę. Coś nowego chce powstać.",
  LD: "Wizkor kiwa głową: odwaga zaczyna się od jednego małego kroku.",
  MD: "Wizkor mówi spokojnie: zrób dziś jedną rzecz naraz, do samego końca.",
};

// Heurystyka: z tags + slow kluczowych w body wywnioskuj proof_type (kompatybilne z mission schema).
function inferProofType(item) {
  const tags = (item.tags || []).join(" ").toLowerCase();
  const body = (item.body || "").toLowerCase();
  const hint = (item.proof_hint || "").toLowerCase();
  const all = `${tags} ${body} ${hint}`;
  if (all.includes("zdjęcie") || all.includes("zdjecie") || all.includes("photo")) return "photo";
  if (all.includes("rysunek") || all.includes("narysuj") || all.includes("drawing")) return "drawing";
  if (all.includes("nagra") || all.includes("voice")) return "voice_note";
  if (all.includes("rozmowa") || all.includes("zapytaj")) return "conversation";
  return "text";
}

// Konwertuj item z mentorTaskLibrary na format misji backendu.
function mapLibraryItemToMission(item) {
  const profile = item.profile;
  return {
    title: item.title,
    body: item.body,
    narrative_intro: PROFILE_INTROS[profile] || "Wizkor szepcze: nowe zadanie czeka.",
    competency_focus: Array.isArray(item.competency_focus) && item.competency_focus.length > 0
      ? item.competency_focus
      : (profile ? [profile] : ["DT"]),
    proof_type: inferProofType(item),
    estimated_minutes: Math.max(10, Math.min(40, Math.round((item.points_reward || 25) * 0.9))),
    safety_notes: (item.tags || []).includes("z dorosłym") ? "Wymaga obecności dorosłego." : null,
    artifact_reward: null,
  };
}

// Wybierz misje z bazy mentora pasujaca do profilu gracza, nieprzerobiona wczesniej.
// POMIJANIE PO `id` BIBLIOTEKI, nie po tytule (docs/tresci/06 pkt 8): tytuly
// zmienialy sie 17.09 i to samo zadanie wracalo pod nowa nazwa. `usedIds` to
// `library_id` z wczesniejszych misji gracza (kolumna dopisywana nizej).
// PROFIL TO KOLEJNOSC, NIE ZBIOR (06 §4.7, 03 §6.2): zadania z profilu ida
// pierwsze, ale gdy sie wyczerpia, dziecko dostaje zadania z pozostalych
// profili zamiast powtorki — profil nie blokuje osi.
function pickSeedMission(usedIds, archetypeOrProfile) {
  const profile = mapToProfileCode(archetypeOrProfile);
  const taskItems = MENTOR_TASK_LIBRARY.filter((it) => it.kind === "task");
  const used = new Set(usedIds || []);
  const profileItems = profile ? taskItems.filter((it) => it.profile === profile) : [];
  const unusedProfile = profileItems.filter((it) => !used.has(it.id));
  const unusedAll = taskItems.filter((it) => !used.has(it.id));
  const pool = unusedProfile.length > 0 ? unusedProfile : (unusedAll.length > 0 ? unusedAll : taskItems);
  const picked = pool[Math.floor(Math.random() * pool.length)];
  return { ...mapLibraryItemToMission(picked), library_id: picked.id };
}

/* MIGRACJA (w stylu repo — `ALTER TABLE ... ADD COLUMN IF NOT EXISTS`, jak
   w `database/db.js`): `missions.library_id` trzyma id wpisu biblioteki, po
   ktorym pomijamy powtorki; `missions.rozmowa` — pytanie do rozmowy dla
   Mentora z karty zadania (03 §7). Uruchamiana raz, leniwie, przy pierwszym
   uzyciu; bez uprawnien do ALTER — cicho pomijana (kolumny opcjonalne). */
let _libraryIdReady = null;
export async function ensureLibraryIdColumn() {
  if (!_libraryIdReady) {
    _libraryIdReady = (async () => {
      try {
        const pool = await getPool();
        await pool.query("ALTER TABLE missions ADD COLUMN IF NOT EXISTS library_id TEXT");
        await pool.query("ALTER TABLE missions ADD COLUMN IF NOT EXISTS rozmowa TEXT");
        return true;
      } catch (e) {
        console.warn("[missions] library_id: brak kolumny, pomijanie powtorek po id wylaczone:", e.message);
        return false;
      }
    })();
  }
  return _libraryIdReady;
}

async function usedLibraryIds(playerId) {
  if (!(await ensureLibraryIdColumn())) return [];
  try {
    const pool = await getPool();
    const { rows } = await pool.query(
      "SELECT library_id FROM missions WHERE player_id = $1 AND library_id IS NOT NULL", [playerId]
    );
    return rows.map((r) => r.library_id);
  } catch { return []; }
}

/* Czy dziecko ma PRAWDZIWEGO Mentora: jest w klasie zywego konta Mentora
   i nie jest graczem demo. Frontend pokazuje „Mentor juz to widzi" tylko wtedy
   (docs/tresci/02 §2.5, 06 §4.7). */
async function mentorPresent(playerId) {
  try {
    const pool = await getPool();
    const { rows } = await pool.query(
      `SELECT 1 FROM class_memberships cm
         JOIN mentor_classes mc ON mc.id = cm.class_id
         JOIN players p ON p.id = cm.player_id
        WHERE cm.player_id = $1 AND cm.left_at IS NULL AND COALESCE(p.is_demo, FALSE) = FALSE
        LIMIT 1`,
      [playerId]
    );
    return rows.length > 0;
  } catch { return false; }
}

export function cycleRoutes(db) {
  const router = Router();

  router.get("/current/:playerId", async (req, res) => {
    try {
      const cycle = await getCurrentCycle(db, req.params.playerId);
      if (!cycle) return res.status(404).json({ error: "Brak aktywnego cyklu" });
      res.json(cycle);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  router.post("/start", async (req, res) => {
    try {
      const { player_id } = req.body;
      const player = await getPlayer(db, player_id);
      if (!player) return res.status(404).json({ error: "Gracz nie znaleziony" });
      const cycle = await createCycle(db, player_id);
      res.json(cycle);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  router.post("/close", async (req, res) => {
    try {
      const { cycle_id, summary } = req.body;
      await closeCycle(db, cycle_id, summary || {});
      res.json({ ok: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  return router;
}

export function missionRoutes(db) {
  const router = Router();

  router.post("/generate", async (req, res) => {
    try {
      const { player_id, cycle_id } = req.body;
      const player = await getPlayer(db, player_id);
      if (!player) return res.status(404).json({ error: "Gracz nie znaleziony" });
      let cycle = cycle_id ? { cycle_id } : await getCurrentCycle(db, player_id);
      // Jesli gracz nie ma jeszcze aktywnego cyklu — utworz pierwszy automatycznie.
      // Dzieki temu po onboardingu /missions/generate dziala bez osobnego /cycles/start.
      if (!cycle) {
        try {
          cycle = await createCycle(db, player_id);
        } catch (cycleErr) {
          console.error("[mission generate] auto-cycle failed:", cycleErr.message);
          return res.status(500).json({ error: `Nie udalo sie utworzyc cyklu: ${cycleErr.message}` });
        }
      }
      // `used` = id biblioteki z wczesniejszych misji gracza (pomijanie po id,
      // nie po tytule). Tytuly nadal ida do Claude jako kontekst.
      const used = await usedLibraryIds(player_id);
      const usedTitles = used.length ? MENTOR_TASK_LIBRARY.filter((it) => used.includes(it.id)).map((it) => it.title) : [];

      // Próbuj Claude API (spersonalizowana misja); fallback do seed library
      let payload;
      let source = "seed";
      if (narrativeService.isAvailable) {
        try {
          const ai = await narrativeService.generateMission({
            playerName: player.player_name,
            archetype: player.archetype || "tropiciel_tajemnic",
            completedMissionTitles: usedTitles,
            scores: player.scores,
            chapter: player.current_chapter || "wezwanie_kroniki",
          });
          payload = ai;
          source = "claude";
        } catch (claudeErr) {
          console.warn("[mission generate] Claude fallback:", claudeErr.message);
          payload = pickSeedMission(used, player.archetype);
        }
      } else {
        payload = pickSeedMission(used, player.archetype);
      }

      const mission = await createMission(db, {
        cycle_id: cycle.cycle_id,
        player_id,
        title: payload.title,
        body: payload.body,
        narrative_intro: payload.narrative_intro,
        competency_focus: payload.competency_focus,
        proof_type: payload.proof_type,
        estimated_minutes: payload.estimated_minutes,
        safety_notes: payload.safety_notes || null,
      });
      const pool = await getPool();
      await pool.query("UPDATE missions SET artifact_reward=$1 WHERE id=$2", [payload.artifact_reward ? JSON.stringify(payload.artifact_reward) : null, mission.mission_id]);
      if (payload.library_id && (await ensureLibraryIdColumn())) {
        try { await pool.query("UPDATE missions SET library_id=$1 WHERE id=$2", [payload.library_id, mission.mission_id]); } catch {}
      }
      mission.source = source;
      res.json(mission);
    } catch (e) { console.error("[mission generate]", e); res.status(500).json({ error: e.message }); }
  });

  /* Misja fabularna z przygody. W przeciwienstwie do /generate tresc nie jest
   * losowana ani generowana przez AI — przychodzi z wersjonowanych danych
   * przygody, wiec Mentor widzi dokladnie to, co dziecko dostalo w swiecie.
   * Idempotentne: ponowne wywolanie dla tego samego adventure_ref w aktywnym
   * cyklu zwraca istniejaca misje zamiast tworzyc duplikat.
   */
  router.post("/seed", async (req, res) => {
    try {
      const {
        player_id, title, body, narrative_intro, competency_focus,
        proof_type, estimated_minutes, safety_notes, adventure_ref, rozmowa,
      } = req.body || {};
      if (!player_id || !title?.trim() || !body?.trim()) {
        return res.status(400).json({ error: "player_id, title i body sa wymagane" });
      }
      const player = await getPlayer(db, player_id);
      if (!player) return res.status(404).json({ error: "Gracz nie znaleziony" });

      let cycle = await getCurrentCycle(db, player_id);
      if (!cycle) cycle = await createCycle(db, player_id);

      const pool = await getPool();
      if (adventure_ref) {
        const { rows } = await pool.query(
          `SELECT id FROM missions
             WHERE player_id = $1 AND cycle_id = $2 AND title = $3
               AND status IN ('pending','submitted','rejected')
             ORDER BY generated_at DESC LIMIT 1`,
          [player_id, cycle.cycle_id, title.trim()]
        );
        if (rows.length) return res.json({ mission_id: rows[0].id, reused: true });
      }

      const mission = await createMission(db, {
        cycle_id: cycle.cycle_id,
        player_id,
        title: title.trim(),
        body: body.trim(),
        narrative_intro: narrative_intro || null,
        competency_focus: Array.isArray(competency_focus) ? competency_focus : [],
        proof_type: proof_type || "text",
        estimated_minutes: Number(estimated_minutes) || 10,
        safety_notes: safety_notes || null,
      });
      mission.source = "adventure";
      // Zadania Wizkora niosa `adventure_ref: wizkor.<id>` — zapisujemy jako
      // library_id, zeby historia po stronie bazy tez znala id, nie tytul.
      if ((adventure_ref || rozmowa) && (await ensureLibraryIdColumn())) {
        try {
          await pool.query("UPDATE missions SET library_id=$1, rozmowa=$2 WHERE id=$3",
            [adventure_ref ? String(adventure_ref) : null, typeof rozmowa === "string" && rozmowa.trim() ? rozmowa.trim() : null, mission.mission_id]);
        } catch {}
      }
      mission.mentor_present = await mentorPresent(player_id);
      res.json(mission);
    } catch (e) {
      console.error("[mission seed]", e);
      res.status(500).json({ error: e.message });
    }
  });

  router.get("/current/:playerId", async (req, res) => {
    try {
      const m = await getCurrentMission(db, req.params.playerId);
      if (!m) return res.status(404).json({ error: "Brak aktywnej misji" });
      res.json(m);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  router.get("/:id", async (req, res) => {
    try {
      const m = await getMission(db, req.params.id);
      if (!m) return res.status(404).json({ error: "Misja nie znaleziona" });
      res.json({ ...m, mentor_present: await mentorPresent(m.player_id) });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  router.post("/:id/submit", async (req, res) => {
    try {
      const { proof_text, proof_media_url } = req.body;
      const mission = await getMission(db, req.params.id);
      if (!mission) return res.status(404).json({ error: "Misja nie znaleziona" });
      await submitMissionProof(db, req.params.id, {
        submitted_at: new Date().toISOString(),
        proof_text: proof_text || "",
        proof_media_url: proof_media_url || null,
      });

      /* SLAD ZOSTAWIONY (decyzja autora 17.09; docs/tresci/06 §4.6, pkt 20):
         - monety: stale 25 przy sladzie (bylo +5 tu i 15–40 od Mentora);
           zauwazenie przez Mentora nie dodaje monet — doklada obiekt w swiecie;
         - punkty ida do kodow z `competency_focus` ZADANIA, nigdy do
           `player.archetype` (to utrwalalo etykiete z testu). */
      const player = await getPlayer(db, mission.player_id);
      if (player) {
        const lifetime = { ...(player.lifetime_scores || { EM: 0, ST: 0, KR: 0, LD: 0, DT: 0, MD: 0 }) };
        const cycleScores = { ...(player.scores || { EM: 0, ST: 0, KR: 0, LD: 0, DT: 0, MD: 0 }) };
        const focus = Array.isArray(mission.competency_focus) ? mission.competency_focus : [];
        for (const code of focus) {
          if (lifetime[code] !== undefined) {
            lifetime[code] = (lifetime[code] || 0) + 4;
            cycleScores[code] = (cycleScores[code] || 0) + 4;
          }
        }
        player.lifetime_scores = lifetime;
        player.scores = cycleScores;
        player.coins = (player.coins || 0) + MONETY_ZA_SLAD;
        await savePlayer(db, player);
      }

      // Swiecace Piorko (artefakt za samo wyslanie) wycofane 17.09.2026 — docs/SWIAT_I_POSTACIE.md.
      res.json({ ok: true, scores: player?.lifetime_scores, coins_awarded: MONETY_ZA_SLAD, mentor_present: await mentorPresent(mission.player_id) });
    } catch (e) { console.error("[mission submit]", e); res.status(500).json({ error: e.message }); }
  });

  return router;
}
