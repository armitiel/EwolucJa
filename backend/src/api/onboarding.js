import { Router } from "express";
import { getPlayer, savePlayer, createCycle } from "../database/db.js";

// QUIZ ZBALANSOWANY (v2):
// Kazdy z 6 archetypow pojawia sie we WSZYSTKICH 5 pytaniach.
// Max punktow do zdobycia: DT/EM/ST = 8 pkt | KR/LD/MD = 7 pkt (roznica tylko 1 pkt).
// Kazda odpowiedz daje 2 pkt do PIERWSZEGO archetypu + 1 pkt do DRUGIEGO.
export const ONBOARDING_QUIZ = [
  {
    question_id: "q1",
    question: "Wracasz z lasu i widzisz tajemniczą skrzynię. Co robisz?",
    answers: [
      { answer_id: "a", text: "Spokojnie. Najpierw obejdę ją dookoła, sprawdzę zamek — dopiero wtedy zdecyduję.", points: { ST: 2, MD: 1 } },
      { answer_id: "b", text: "Coś tu się ukrywa! Szukam wokół śladów i wskazówek.", points: { DT: 2, KR: 1 } },
      { answer_id: "c", text: "Otwieram odważnie. Strach minie, ciekawość zostanie!", points: { LD: 2, EM: 1 } },
    ],
  },
  {
    question_id: "q2",
    question: "Twój najlepszy przyjaciel siedzi smutny w kącie. Co robisz?",
    answers: [
      { answer_id: "a", text: 'Siadam obok i pytam: „co czujesz?" — czekam, aż się otworzy.', points: { EM: 2, DT: 1 } },
      { answer_id: "b", text: "Wymyślam głupkowate przebranie albo grę, żeby go rozśmieszyć.", points: { KR: 2, LD: 1 } },
      { answer_id: "c", text: 'Mówię: „jutro znajdziemy coś fajnego" — i razem to planujemy.', points: { ST: 2, MD: 1 } },
    ],
  },
  {
    question_id: "q3",
    question: "Dwie osoby w domu się kłócą. Co robisz?",
    answers: [
      { answer_id: "a", text: "Słucham każdej z osobna, szukam tego, co je łączy — i o tym mówię.", points: { MD: 2, EM: 1 } },
      { answer_id: "b", text: 'Pytam każdą: „co się NAPRAWDĘ stało?" — chcę zrozumieć.', points: { DT: 2, ST: 1 } },
      { answer_id: "c", text: 'Mówię: „STOP! Wymyśliłem coś, co robimy razem!"', points: { KR: 2, LD: 1 } },
    ],
  },
  {
    question_id: "q4",
    question: "Dostajesz tydzień na zrobienie czegoś wielkiego. Jak zaczynasz?",
    answers: [
      { answer_id: "a", text: "Wyciągam kartkę i planuję dzień po dniu, krok po kroku.", points: { ST: 2, DT: 1 } },
      { answer_id: "b", text: "Zbieram drużynę, rozdzielam role, ruszamy razem.", points: { LD: 2, MD: 1 } },
      { answer_id: "c", text: "Sprawdzam, czy nikt mi nie pomoże — razem szybciej i fajniej.", points: { EM: 2, KR: 1 } },
    ],
  },
  {
    question_id: "q5",
    question: "W twojej grupie jest ktoś nowy, kto siedzi sam. Co robisz?",
    answers: [
      { answer_id: "a", text: 'Podchodzę cicho, mówię: „cześć, lubisz tu?" — i słucham.', points: { EM: 2, ST: 1 } },
      { answer_id: "b", text: "Pytam, co lubi robić — szukam czegoś wspólnego.", points: { DT: 2, KR: 1 } },
      { answer_id: "c", text: "Łączę go z osobą, która ma podobne hobby — robię most.", points: { MD: 2, LD: 1 } },
    ],
  },
];

export const PROFILE_TO_ARCHETYPE = {
  DT: "tropiciel_tajemnic",
  EM: "zaklinacz_uczuc",
  ST: "mistrz_map",
  KR: "tkacz_snow",
  LD: "gwardzista_odwagi",
  MD: "straznik_mostu",
};
export const MVP_AVAILABLE_ARCHETYPES = [
  "tropiciel_tajemnic",
  "zaklinacz_uczuc",
  "mistrz_map",
  "tkacz_snow",
  "gwardzista_odwagi",
  "straznik_mostu",
];

function pickArchetype(scores) {
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  for (const [profile] of sorted) {
    const arch = PROFILE_TO_ARCHETYPE[profile];
    if (arch && MVP_AVAILABLE_ARCHETYPES.includes(arch)) {
      return { archetype: arch, dominant_profile: profile };
    }
  }
  return { archetype: "tropiciel_tajemnic", dominant_profile: "DT" };
}

export function onboardingRoutes(db) {
  const router = Router();

  router.get("/quiz", (req, res) => {
    res.json({
      questions: ONBOARDING_QUIZ.map((q) => ({
        question_id: q.question_id,
        question: q.question,
        answers: q.answers.map((a) => ({ answer_id: a.answer_id, text: a.text })),
      })),
    });
  });

  router.get("/quiz-debug", (req, res) => {
    res.json({
      questions: ONBOARDING_QUIZ,
      profile_to_archetype: PROFILE_TO_ARCHETYPE,
      mvp_available_archetypes: MVP_AVAILABLE_ARCHETYPES,
    });
  });

  router.post("/submit", async (req, res) => {
    try {
      const { player_id, answers } = req.body;
      const player = await getPlayer(db, player_id);
      if (!player) return res.status(404).json({ error: "Gracz nie znaleziony" });
      if (!Array.isArray(answers) || answers.length === 0) {
        return res.status(400).json({ error: "Brak odpowiedzi z quizu" });
      }
      const scores = { EM: 0, ST: 0, KR: 0, LD: 0, DT: 0, MD: 0 };
      const log = [];
      for (const ans of answers) {
        const q = ONBOARDING_QUIZ.find((x) => x.question_id === ans.question_id);
        if (!q) continue;
        const a = q.answers.find((x) => x.answer_id === ans.answer_id);
        if (!a) continue;
        for (const [profile, pts] of Object.entries(a.points)) {
          scores[profile] = (scores[profile] || 0) + pts;
        }
        log.push({ question_id: ans.question_id, answer_id: ans.answer_id, points_awarded: a.points });
      }
      // dominant_profile to docelowy 6-literowy kod (EM/ST/KR/LD/DT/MD).
      // 'archetype' jest deprecated (stara nazwa np. 'tropiciel_tajemnic') — zachowujemy w bazie tylko jako alias.
      // W player.archetype zapisujemy bezposrednio KOD profilu zeby uniknac mapowania w UI.
      const { dominant_profile } = pickArchetype(scores);
      player.archetype = dominant_profile;
      player.archetype_assigned_at = new Date().toISOString();
      player.onboarding_answers = log;
      player.lifetime_scores = player.lifetime_scores || { EM: 0, ST: 0, KR: 0, LD: 0, DT: 0, MD: 0 };
      for (const [k, v] of Object.entries(scores)) {
        player.lifetime_scores[k] = (player.lifetime_scores[k] || 0) + v;
      }
      player.current_chapter = "wezwanie_kroniki";
      await savePlayer(db, player);
      const cycle = await createCycle(db, player.player_id);
      res.json({
        player_id: player.player_id,
        profile: dominant_profile,         // KOD profilu: EM/ST/KR/LD/DT/MD
        archetype: dominant_profile,       // alias dla wstecznej kompat (sklejony z profile)
        dominant_profile,                  // legacy field name
        onboarding_scores: scores,
        first_cycle: cycle,
      });
    } catch (e) {
      console.error("[onboarding submit]", e);
      res.status(500).json({ error: e.message });
    }
  });

  return router;
}
