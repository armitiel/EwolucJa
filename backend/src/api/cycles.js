import { Router } from "express";
import {
  getPlayer, createCycle, getCurrentCycle, closeCycle,
  createMission, getCurrentMission, getMission, submitMissionProof,
  addArtifactToBackpack, getPool,
} from "../database/db.js";

const SEED_MISSIONS_DT = [
  { title: "Trzy Sekrety Domu", body: "Znajdź w domu trzy rzeczy, których historii nikt Ci jeszcze nie opowiedział. Spytaj kogoś dorosłego, skąd się tam wzięły.", narrative_intro: "Tropicielu, Twój Kompas Cieni drży. W Twoim domu są ślady, które tylko Ty możesz odczytać.", competency_focus: ["DT", "EM"], proof_type: "conversation", estimated_minutes: 20, artifact_reward: { artifact_id: "kompas_cieni", artifact_name: "Kompas Cieni" } },
  { title: "Cisza Detektywa", body: "Znajdź w domu lub na podwórku miejsce, gdzie możesz posiedzieć 5 minut w ciszy. Co usłyszysz, czego nigdy wcześniej nie zauważyłeś?", narrative_intro: "Najlepsi tropiciele słyszą to, co inni przegapiają. Czas wytężyć słuch.", competency_focus: ["DT", "ST"], proof_type: "voice_note", estimated_minutes: 10, artifact_reward: { artifact_id: "ucho_lasu", artifact_name: "Ucho Lasu" } },
  { title: "Mapa Skarbów Pokoju", body: "Narysuj mapę swojego pokoju, ale zaznacz na niej trzy 'ukryte skarby' — rzeczy ważne, których nikt poza Tobą nie zna.", narrative_intro: "Każda kraina potrzebuje mapy. Twoja zaczyna się tu, gdzie śpisz.", competency_focus: ["DT", "KR"], proof_type: "drawing", estimated_minutes: 25, artifact_reward: { artifact_id: "atrament_kronikarski", artifact_name: "Atrament Kronikarski" } },
  { title: "Tropienie Pytań", body: "Zadaj komuś dorosłemu jedno pytanie, którego nigdy mu nie zadałeś. Może to być dziwne pytanie albo bardzo proste.", narrative_intro: "Tropiciel zna tajemnicę: pytania są mocniejsze od odpowiedzi.", competency_focus: ["DT", "EM", "MD"], proof_type: "conversation", estimated_minutes: 15, artifact_reward: { artifact_id: "klucz_pytan", artifact_name: "Klucz Pytań" } },
  { title: "Trop, Którego Nikt Nie Zauważył", body: "Wyjdź z domu (z dorosłym) i znajdź jedną rzecz na Twojej ulicy, której nigdy wcześniej nie zauważyłeś. Zrób zdjęcie albo opowiedz o niej.", narrative_intro: "Twój trop dziś jest w miejscu, które przechodziłeś już sto razy.", competency_focus: ["DT"], proof_type: "photo", estimated_minutes: 30, safety_notes: "Zawsze z dorosłym. Nie oddalaj się.", artifact_reward: { artifact_id: "ziarno_uwagi", artifact_name: "Ziarno Uwagi" } },
];

function pickSeedMission(usedTitles) {
  const unused = SEED_MISSIONS_DT.filter((m) => !usedTitles.includes(m.title));
  const pool = unused.length > 0 ? unused : SEED_MISSIONS_DT;
  return pool[Math.floor(Math.random() * pool.length)];
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
      const cycle = cycle_id ? { cycle_id } : await getCurrentCycle(db, player_id);
      if (!cycle) return res.status(400).json({ error: "Brak cyklu" });
      const used = (player.choices_log || []).filter((c) => c.cycle_id && c.task_id === "mission").map((c) => c.choice_id);
      const seed = pickSeedMission(used);
      const mission = await createMission(db, {
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
      const pool = await getPool();
      await pool.query("UPDATE missions SET artifact_reward=$1 WHERE id=$2", [seed.artifact_reward || null, mission.mission_id]);
      res.json(mission);
    } catch (e) { console.error("[mission generate]", e); res.status(500).json({ error: e.message }); }
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
      const dopamineArtifact = {
        artifact_id: `dopamine_${Date.now()}`,
        artifact_name: "Świecące Piórko",
        cycle_id: mission.cycle_id,
      };
      await addArtifactToBackpack(db, mission.player_id, dopamineArtifact);
      res.json({ ok: true, dopamine_reward: dopamineArtifact });
    } catch (e) { console.error("[mission submit]", e); res.status(500).json({ error: e.message }); }
  });

  return router;
}
