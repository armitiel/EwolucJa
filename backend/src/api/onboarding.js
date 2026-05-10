import { Router } from "express";
import { getPlayer, savePlayer, createCycle } from "../database/db.js";

export const ONBOARDING_QUIZ = [
  {
    question_id: "q1",
    question: "Znajdujesz w lesie tajemniczą skrzynię. Co robisz?",
    answers: [
      { answer_id: "a", text: "Otwieram od razu, muszę wiedzieć, co tam jest!", points: { DT: 2, LD: 1 } },
      { answer_id: "b", text: "Najpierw oglądam ze wszystkich stron i szukam wskazówek.", points: { DT: 2, ST: 1 } },
      { answer_id: "c", text: "Wołam kogoś, żebyśmy otworzyli ją razem.", points: { MD: 2, EM: 1 } },
    ],
  },
  {
    question_id: "q2",
    question: "Twój przyjaciel jest smutny. Co czujesz najpierw?",
    answers: [
      { answer_id: "a", text: "Chcę wiedzieć, dlaczego — pytam, co się stało.", points: { EM: 2, DT: 1 } },
      { answer_id: "b", text: "Wymyślam coś, żeby go rozśmieszyć.", points: { KR: 2, EM: 1 } },
      { answer_id: "c", text: "Mówię: 'damy radę' i prowadzę go do działania.", points: { LD: 2 } },
    ],
  },
  {
    question_id: "q3",
    question: "Masz wybrać między dwiema ścieżkami. Pierwsza prowadzi do skarbu szybciej, druga ma znaki zapytania.",
    answers: [
      { answer_id: "a", text: "Idę szybciej — czas to skarb.", points: { ST: 2, LD: 1 } },
      { answer_id: "b", text: "Idę tą z pytaniami — chcę zrozumieć.", points: { DT: 3 } },
      { answer_id: "c", text: "Wymyślam trzecią drogę.", points: { KR: 2 } },
    ],
  },
  {
    question_id: "q4",
    question: "Dwie postacie się kłócą. Co robisz?",
    answers: [
      { answer_id: "a", text: "Słucham obu i pomagam znaleźć kompromis.", points: { MD: 3, EM: 1 } },
      { answer_id: "b", text: "Zadaję im pytania, żeby zrozumiały, o co naprawdę chodzi.", points: { DT: 2, MD: 1 } },
      { answer_id: "c", text: "Mówię: dość, idziemy dalej, decyduję.", points: { LD: 2 } },
    ],
  },
  {
    question_id: "q5",
    question: "Dostałeś zadanie domowe na cały tydzień. Co robisz w pierwszy dzień?",
    answers: [
      { answer_id: "a", text: "Planuję wszystko po kolei na kartce.", points: { ST: 3 } },
      { answer_id: "b", text: "Zaczynam od najciekawszej części — cieszę się tym, że robię to inaczej.", points: { KR: 2, DT: 1 } },
      { answer_id: "c", text: "Robię od razu, żeby już mieć z głowy.", points: { LD: 2, ST: 1 } },
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
      const { archetype, dominant_profile } = pickArchetype(scores);
      player.archetype = archetype;
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
        archetype,
        dominant_profile,
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
