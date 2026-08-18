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
function mapToProfileCode(value) {
  if (!value) return null;
  if (PROFILE_CODES.has(value)) return value;
  return LEGACY_ARCHETYPE_TO_PROFILE[value] || null;
}

// narrative_intro nie jest w bibliotece — generujemy lekkie wprowadzenie zaleznie od profilu.
// Krotkie, w trzeciej osobie z perspektywy Medrca, bez animizmu krain.
const PROFILE_INTROS = {
  DT: "Mędrzec szepcze: nowa zagadka czeka na tropiciela. Otwórz oczy uważniej niż zwykle.",
  EM: "Mędrzec uśmiecha się: dziś masz szansę zauważyć kogoś sercem. To też supermoc.",
  ST: "Mędrzec spogląda na mapę: dobry plan robi z małych rzeczy wielkie. Czas na ruch stratega.",
  KR: "Mędrzec mruga: Twoja wyobraźnia ma dziś robotę. Coś nowego chce się narodzić.",
  LD: "Mędrzec kiwa głową: odwaga zaczyna się od jednego małego kroku. Gwardzista próbuje.",
  MD: "Mędrzec mówi spokojnie: czasem największa siła to umieć kogoś wysłuchać. Spróbuj dziś.",
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
    narrative_intro: PROFILE_INTROS[profile] || "Mędrzec szepcze: nowe zadanie czeka.",
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
// Fallback: jesli profil nie znany albo brak zadan — losuj z calej bazy task-ow.
function pickSeedMission(usedTitles, archetypeOrProfile) {
  const profile = mapToProfileCode(archetypeOrProfile);
  const taskItems = MENTOR_TASK_LIBRARY.filter((it) => it.kind === "task");
  // 1. Preferuj zadania pasujace do profilu gracza
  const profileItems = profile
    ? taskItems.filter((it) => it.profile === profile)
    : taskItems;
  // 2. Wyklucz uzyte wczesniej (po tytule)
  const unused = (profileItems.length > 0 ? profileItems : taskItems)
    .filter((it) => !usedTitles.includes(it.title));
  // 3. Jesli wszystko uzyte — pozwol na powtorke z puli profilu
  const pool = unused.length > 0
    ? unused
    : (profileItems.length > 0 ? profileItems : taskItems);
  const picked = pool[Math.floor(Math.random() * pool.length)];
  return mapLibraryItemToMission(picked);
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
      const used = (player.choices_log || []).filter((c) => c.cycle_id && c.task_id === "mission").map((c) => c.choice_id);

      // Próbuj Claude API (spersonalizowana misja); fallback do seed library
      let payload;
      let source = "seed";
      if (narrativeService.isAvailable) {
        try {
          const ai = await narrativeService.generateMission({
            playerName: player.player_name,
            archetype: player.archetype || "tropiciel_tajemnic",
            completedMissionTitles: used,
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
        proof_type, estimated_minutes, safety_notes, adventure_ref,
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
      res.json(m);
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

      // NAGRODA: +punkty do lifetime_scores per cecha (mission.competency_focus) + bonus do profilu gracza
      const player = await getPlayer(db, mission.player_id);
      if (player) {
        const lifetime = { ...(player.lifetime_scores || { EM: 0, ST: 0, KR: 0, LD: 0, DT: 0, MD: 0 }) };
        const cycleScores = { ...(player.scores || { EM: 0, ST: 0, KR: 0, LD: 0, DT: 0, MD: 0 }) };
        const focus = Array.isArray(mission.competency_focus) ? mission.competency_focus : [];
        // GAME DESIGN v2: zadanie w realu = wartosciowy wysilek, ale glowna nagroda przychodzi
        // od mentora po verify. Tu tylko zalazek - efekt zaczet, czeka na potwierdzenie.
        // +4 do glownego profilu (bylo 8). Reszta przyjdzie z verify (+5 main + custom coins).
        const mainProfile = player.archetype && lifetime[player.archetype] !== undefined ? player.archetype : "DT";
        lifetime[mainProfile] = (lifetime[mainProfile] || 0) + 4;
        cycleScores[mainProfile] = (cycleScores[mainProfile] || 0) + 4;
        // +2 do kazdej cechy z competency_focus (bylo 5)
        for (const code of focus) {
          if (lifetime[code] !== undefined && code !== mainProfile) {
            lifetime[code] = (lifetime[code] || 0) + 2;
            cycleScores[code] = (cycleScores[code] || 0) + 2;
          }
        }
        player.lifetime_scores = lifetime;
        player.scores = cycleScores;
        // +5 coinow za wyslanie odpowiedzi (bylo 10) - "iskra odwagi" za sam fakt zrobienia.
        // Glowna nagroda 15-40 ✦ przyjdzie po verify mentora.
        player.coins = (player.coins || 0) + 5;
        await savePlayer(db, player);
      }

      const dopamineArtifact = {
        artifact_id: `dopamine_${Date.now()}`,
        artifact_name: "Świecące Piórko",
        cycle_id: mission.cycle_id,
      };
      await addArtifactToBackpack(db, mission.player_id, dopamineArtifact);
      res.json({ ok: true, dopamine_reward: dopamineArtifact, scores: player?.lifetime_scores });
    } catch (e) { console.error("[mission submit]", e); res.status(500).json({ error: e.message }); }
  });

  return router;
}
