/**
 * API Routes — Cykle tygodniowe i misje "w realu".
 */

import { Router } from "express";
import {
  getPlayer,
  savePlayer,
  createCycle,
  getCurrentCycle,
  closeCycle,
  createMission,
  getCurrentMission,
  getMission,
  submitMissionProof,
  addArtifactToBackpack,
} from "../database/db.js";

// Pula misji startowych dla MVP (archetyp: tropiciel_tajemnic / DT).
// AI Claude będzie generował dalsze; ta pula służy jako seed + fallback.
const SEED_MISSIONS_DT = [
  {
    title: "Trzy Sekrety Domu",
    body: "Znajdź w domu trzy rzeczy, których historii nikt Ci jeszcze nie opowiedział. Spytaj kogoś dorosłego, skąd się tam wzięły.",
    narrative_intro: "Tropicielu, Twój Kompas Cieni drży. W Twoim domu są ślady, które tylko Ty możesz odczytać.",
    competency_focus: ["DT", "EM"],
    proof_type: "conversation",
    estimated_minutes: 20,
    artifact_reward: { artifact_id: "kompas_cieni", artifact_name: "Kompas Cieni" },
  },
  {
    title: "Cisza Detektywa",
    body: "Znajdź w domu lub na podwórku miejsce, gdzie możesz posiedzieć 5 minut w ciszy. Co usłyszysz, czego nigdy wcześniej nie zauważyłeś?",
    narrative_intro: "Najlepsi tropiciele słyszą to, co inni przegapiają. Czas wytężyć słuch.",
    competency_focus: ["DT", "ST"],
    proof_type: "voice_note",
    estimated_minutes: 10,
    artifact_reward: { artifact_id: "ucho_lasu", artifact_name: "Ucho Lasu" },
  },
  {
    title: "Mapa Skarbów Pokoju",
    body: "Narysuj mapę swojego pokoju, ale zaznacz na niej trzy 'ukryte skarby' — rzeczy ważne, których nikt poza Tobą nie zna.",
    narrative_intro: "Każda kraina potrzebuje mapy. Twoja zaczyna się tu, gdzie śpisz.",
    competency_focus: ["DT", "KR"],
    proof_type: "drawing",
    estimated_minutes: 25,
    artifact_reward: { artifact_id: "atrament_kronikarski", artifact_name: "Atrament Kronikarski" },
  },
  {
    title: "Tropienie Pytań",
    body: "Zadaj komuś dorosłemu jedno pytanie, którego nigdy mu nie zadałeś. Może to być dziwne pytanie albo bardzo proste.",
    narrative_intro: "Tropiciel zna tajemnicę: pytania są mocniejsze od odpowiedzi.",
    competency_focus: ["DT", "EM", "MD"],
    proof_type: "conversation",
    estimated_minutes: 15,
    artifact_reward: { artifact_id: "klucz_pytan", artifact_name: "Klucz Pytań" },
  },
  {
    title: "Trop, Którego Nikt Nie Zauważył",
    body: "Wyjdź z domu (z dorosłym) i znajdź jedną rzecz na Twojej ulicy, której nigdy wcześniej nie zauważyłeś. Zrób zdjęcie albo opowiedz o niej.",
    narrative_intro: "Twój trop dziś jest w miejscu, które przechodziłeś już sto razy.",
    competency_focus: ["DT"],
    proof_type: "photo",
    estimated_minutes: 30,
    safety_notes: "Zawsze z dorosłym. Nie oddalaj się.",
    artifact_reward: { artifact_id: "ziarno_uwagi", artifact_name: "Ziarno Uwagi" },
  },
];

function pickSeedMission(player, usedMissionTitles) {
  // Wybiera pierwszą nieużytą misję z seedu. Jeśli wszystkie były — recyclinguj.
  const unused = SEED_MISSIONS_DT.filter((m) => !usedMissionTitles.includes(m.title));
  const pool = unused.length > 0 ? unused : SEED_MISSIONS_DT;
  const idx = Math.floor(Math.random() * pool.length);
  return pool[idx];
}

export function cycleRoutes(db) {
  const router = Router();

  // GET /api/cycles/current/:playerId
  router.get("/current/:playerId", (req, res) => {
    const cycle = getCurrentCycle(db, req.params.playerId);
    if (!cycle) return res.status(404).json({ error: "Brak aktywnego cyklu" });
    res.json(cycle);
  });

  // POST /api/cycles/start — ręczny start nowego cyklu (np. po zamknięciu poprzedniego)
  router.post("/start", (req, res) => {
    const { player_id } = req.body;
    const player = getPlayer(db, player_id);
    if (!player) return res.status(404).json({ error: "Gracz nie znaleziony" });
    const cycle = createCycle(db, player_id);
    res.json(cycle);
  });

  // POST /api/cycles/close — zamknij cykl (np. na koniec piątku)
  router.post("/close", (req, res) => {
    const { cycle_id, summary } = req.body;
    closeCycle(db, cycle_id, summary || {});
    res.json({ ok: true });
  });

  return router;
}

export function missionRoutes(db) {
  const router = Router();

  // POST /api/missions/generate — generuj misję dla cyklu (MVP: z seedu, później AI)
  router.post("/generate", (req, res) => {
    const { player_id, cycle_id } = req.body;
    const player = getPlayer(db, player_id);
    if (!player) return res.status(404).json({ error: "Gracz nie znaleziony" });

    const cycle = cycle_id ? { cycle_id } : getCurrentCycle(db, player_id);
    if (!cycle) return res.status(400).json({ error: "Brak cyklu" });

    // zbierz tytuły poprzednich misji, żeby nie powtórzyć
    const used = (player.choices_log || [])
      .filter((c) => c.cycle_id && c.task_id === "mission")
      .map((c) => c.choice_id);

    const seed = pickSeedMission(player, used);
    const mission = createMission(db, {
      cycle_id: cycle.cycle_id,
      player_id,
      title: seed.title,
      body: seed.body,
      narrative_intro: seed.narrative_intro,
      competency_focus: seed.competency_focus,
      proof_type: seed.proof_type,
      estimated_minutes: seed.estimated_minutes,
      safety_notes: seed.safety_notes || null,
    });

    // zachowaj artifact_reward osobno (do wręczenia po weryfikacji)
    db.prepare("UPDATE missions SET artifact_reward_json = ? WHERE id = ?").run(
      JSON.stringify(seed.artifact_reward || null),
      mission.mission_id
    );

    res.json(mission);
  });

  // GET /api/missions/current/:playerId
  router.get("/current/:playerId", (req, res) => {
    const mission = getCurrentMission(db, req.params.playerId);
    if (!mission) return res.status(404).json({ error: "Brak aktywnej misji" });
    res.json(mission);
  });

  // GET /api/missions/:id
  router.get("/:id", (req, res) => {
    const mission = getMission(db, req.params.id);
    if (!mission) return res.status(404).json({ error: "Misja nie znaleziona" });
    res.json(mission);
  });

  // POST /api/missions/:id/submit — gracz przesyła dowód
  router.post("/:id/submit", (req, res) => {
    const { proof_text, proof_media_url } = req.body;
    const mission = getMission(db, req.params.id);
    if (!mission) return res.status(404).json({ error: "Misja nie znaleziona" });

    submitMissionProof(db, req.params.id, {
      submitted_at: new Date().toISOString(),
      proof_text: proof_text || "",
      proof_media_url: proof_media_url || null,
    });

    // dorzuć dopaminowy artefakt do plecaka (mid-week reward, niezależnie od weryfikacji)
    const dopamineArtifact = {
      artifact_id: `dopamine_${Date.now()}`,
      artifact_name: "Świecące Piórko",
      cycle_id: mission.cycle_id,
    };
    addArtifactToBackpack(db, mission.player_id, dopamineArtifact);

    res.json({ ok: true, dopamine_reward: dopamineArtifact });
  });

  return router;
}
