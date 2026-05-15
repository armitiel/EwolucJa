import { Router } from "express";
import { getPlayer, savePlayer, createCycle } from "../database/db.js";

// QUIZ V3-FINAL (zsynchronizowany z agents/world/quiz_osobowosci.md sekcja 5):
// 8 pytan × 4 odpowiedzi. Kazda odpowiedz daje punkty WSZYSTKIM 6 cechom
// wg rozkladu (3, 2, 2, 1, 1, 0) — glowna +3, sasiedzi w pierscieniu +2,
// dalsze +1, przeciwienstwo 0. Pierscien sasiedztwa: ST-MD-EM-KR-DT-LD-ST.
// Max do zdobycia per cecha: 8 × 3 = 24 pkt; realny zakres gracza: ~6-20 pkt.
export const ONBOARDING_QUIZ = [
  {
    question_id: "nq1",
    question: "Znajdujesz na strychu klucz. Chcesz sprawdzić, do czego pasuje. Co robisz?",
    answers: [
      { answer_id: "a", text: "Robię listę pomieszczeń w domu i sprawdzam jedno po drugim.", points: { ST: 3, MD: 2, EM: 1, KR: 0, DT: 1, LD: 2 } },
      { answer_id: "b", text: "Wymyślam, że to klucz do magicznej krainy i rysuję mapę.",     points: { ST: 0, MD: 1, EM: 2, KR: 3, DT: 2, LD: 1 } },
      { answer_id: "c", text: "Pytam babcię, dziadka, sąsiadkę — może któreś z nich pamięta.", points: { ST: 1, MD: 2, EM: 3, KR: 2, DT: 1, LD: 0 } },
      { answer_id: "d", text: "Idę natychmiast szukać zamka — sprawdzę każde drzwi i schowek.", points: { ST: 2, MD: 1, EM: 0, KR: 1, DT: 2, LD: 3 } },
    ],
  },
  {
    question_id: "nq2",
    question: "Koledze wypadła książka i wszystko się rozsypało, jest mu głupio. Co robisz?",
    answers: [
      { answer_id: "a", text: "Pomagam mu pozbierać książki, nic nie mówię.",                     points: { ST: 1, MD: 2, EM: 3, KR: 2, DT: 1, LD: 0 } },
      { answer_id: "b", text: 'Pytam: „pomóc Ci pozbierać? Co się rozsypało?"',                   points: { ST: 1, MD: 0, EM: 1, KR: 2, DT: 3, LD: 2 } },
      { answer_id: "c", text: 'Robię z tego nasz tajny żart, żeby śmiech zastąpił to „głupio".',  points: { ST: 0, MD: 1, EM: 2, KR: 3, DT: 2, LD: 1 } },
      { answer_id: "d", text: 'Wstaję pierwszy/a i wołam: „pomagamy zbierać, kto ze mną?"',       points: { ST: 2, MD: 1, EM: 0, KR: 1, DT: 2, LD: 3 } },
    ],
  },
  {
    question_id: "nq3",
    question: "Sąsiadka zgubiła kota. Co robisz najpierw?",
    answers: [
      { answer_id: "a", text: 'Rysuję plakat „Zaginął kot" i rozwieszam w okolicy.',         points: { ST: 0, MD: 1, EM: 2, KR: 3, DT: 2, LD: 1 } },
      { answer_id: "b", text: "Idę i pytam każdego sąsiada po kolei.",                       points: { ST: 2, MD: 1, EM: 0, KR: 1, DT: 2, LD: 3 } },
      { answer_id: "c", text: "Zostaję z sąsiadką i pocieszam ją — kot wróci, koty wracają.", points: { ST: 1, MD: 2, EM: 3, KR: 2, DT: 1, LD: 0 } },
      { answer_id: "d", text: "Pytam, gdzie ostatnio go widziała, gdzie kot najczęściej chodzi i co lubi, rysuję trasę.", points: { ST: 1, MD: 0, EM: 1, KR: 2, DT: 3, LD: 2 } },
    ],
  },
  {
    question_id: "nq4",
    question: "Pani mówi przed całą klasą, że Twoja praca była najlepsza. Co robisz?",
    answers: [
      { answer_id: "a", text: 'Robię gest zwycięstwa i krzyczę „JES!" — niech wszyscy poczują energię.', points: { ST: 2, MD: 1, EM: 0, KR: 1, DT: 2, LD: 3 } },
      { answer_id: "b", text: "Robię w głowie listę: co dokładnie zadziałało, żeby powtórzyć to następnym razem.", points: { ST: 3, MD: 2, EM: 1, KR: 0, DT: 1, LD: 2 } },
      { answer_id: "c", text: "Po lekcji rysuję kartkę z podziękowaniem dla pani — z serduszkami i ramką.", points: { ST: 0, MD: 1, EM: 2, KR: 3, DT: 2, LD: 1 } },
      { answer_id: "d", text: 'Po cichu mówię koledze obok: „pomogłeś mi z pomysłem — to też Twoja zasługa".', points: { ST: 2, MD: 3, EM: 2, KR: 1, DT: 0, LD: 1 } },
    ],
  },
  {
    question_id: "nq5",
    question: "Twoja drużyna ma minutę, żeby wybrać, co robicie na konkursie. Co proponujesz?",
    answers: [
      { answer_id: "a", text: 'Mówię: „robimy tak — kto się zgadza, ręka w górę".', points: { ST: 2, MD: 1, EM: 0, KR: 1, DT: 2, LD: 3 } },
      { answer_id: "b", text: '„Kto ma najlepszy pomysł — mów teraz, każdy 10 sekund" — zbieram od wszystkich i łączę w jedno.', points: { ST: 2, MD: 3, EM: 2, KR: 1, DT: 0, LD: 1 } },
      { answer_id: "c", text: "Robię w głowie szybkie sprawdzenie: co dobre, a co głupie w każdej opcji — wybieram lepszą.", points: { ST: 3, MD: 2, EM: 1, KR: 0, DT: 1, LD: 2 } },
      { answer_id: "d", text: '„A co jeśli zrobimy to po naszemu?" — rzucam zupełnie świeży pomysł.', points: { ST: 0, MD: 1, EM: 2, KR: 3, DT: 2, LD: 1 } },
    ],
  },
  {
    question_id: "nq6",
    question: "Dostajesz na urodziny dużą skrzynkę i możesz zrobić z niej, co tylko chcesz. Co to będzie?",
    answers: [
      { answer_id: "a", text: "Pracownia wynalazcy — kolorowa, z lampką, ze schowkami na pomysły.", points: { ST: 0, MD: 1, EM: 2, KR: 3, DT: 2, LD: 1 } },
      { answer_id: "b", text: "Laboratorium do badania kamyków, liści i owadów — z lupą i notesem.", points: { ST: 1, MD: 0, EM: 1, KR: 2, DT: 3, LD: 2 } },
      { answer_id: "c", text: "Pudełko-skarbiec: każda przegródka opisana, każdy drobiazg poukładany według rodzaju.", points: { ST: 3, MD: 2, EM: 1, KR: 0, DT: 1, LD: 2 } },
      { answer_id: "d", text: "Apteczka do pocieszania — chusteczki, naklejki, karteczki z dobrym słowem dla kogoś smutnego.", points: { ST: 1, MD: 2, EM: 3, KR: 2, DT: 1, LD: 0 } },
    ],
  },
  {
    question_id: "nq7",
    question: "Idziesz z grupą przez las i nagle drogę tarasuje wielkie powalone drzewo. Co robisz?",
    answers: [
      { answer_id: "a", text: "Patrzę, jak duże jest drzewo, szukam gdzie pień jest najniższy, układam plan przejścia.", points: { ST: 3, MD: 2, EM: 1, KR: 0, DT: 1, LD: 2 } },
      { answer_id: "b", text: "Idę wzdłuż pnia, sprawdzam gdzie jest najwęższy i czy ziemia się nie zapada.", points: { ST: 1, MD: 0, EM: 1, KR: 2, DT: 3, LD: 2 } },
      { answer_id: "c", text: "Trzymam się blisko najmłodszego — przejdziemy razem.", points: { ST: 2, MD: 3, EM: 2, KR: 1, DT: 0, LD: 1 } },
      { answer_id: "d", text: "Wymyślam plan: każdy szuka czegoś do oparcia — gałąź, kamień — pomagamy sobie przez drzewo.", points: { ST: 2, MD: 3, EM: 2, KR: 1, DT: 0, LD: 1 } },
    ],
  },
  {
    question_id: "nq8",
    question: "Na ławce w parku leży portfel. W środku jest zdjęcie uśmiechniętej babci z wnukiem. Chcesz pomóc oddać go właścicielowi. Co robisz?",
    answers: [
      { answer_id: "a", text: "Zanoszę portfel do najbliższego dorosłego, którego znam — niech pomoże znaleźć właściciela.", points: { ST: 2, MD: 3, EM: 2, KR: 1, DT: 0, LD: 1 } },
      { answer_id: "b", text: "Sprawdzam, czy jest tam coś, co podpowie, kto to zgubił — imię, numer telefonu, adres.", points: { ST: 1, MD: 0, EM: 1, KR: 2, DT: 3, LD: 2 } },
      { answer_id: "c", text: "Myślę o babci ze zdjęcia — pewnie się martwi. Idę spytać ludzi w parku, czy ktoś ją zna.", points: { ST: 1, MD: 2, EM: 3, KR: 2, DT: 1, LD: 0 } },
      { answer_id: "d", text: "Spisuję na karteczce, co i kiedy znalazłem, i zostawiam ją obok portfela tak, żeby każdy zobaczył.", points: { ST: 3, MD: 2, EM: 1, KR: 0, DT: 1, LD: 2 } },
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

// Tie-break preference: dzieci 6-8 lat lepiej startuja z DT/KR/EM (wszechstronne),
// MD/LD wymagaja dojrzalosci — niech wygrywaja tylko gdy sa wyraznie pierwsze.
const TIE_BREAK_PREFERENCE = ["DT", "KR", "EM", "ST", "LD", "MD"];

// pickArchetype(scores, opts?) — wybiera dominujacy profil z trójstopniowym tie-break:
//  1) peripheral_sum (suma punktow +1 i +2 — "szerokosc" profilu)
//  2) +3 w pierwszym pytaniu ("pierwsza intuicja")
//  3) TIE_BREAK_PREFERENCE
// opts.peripheral_sum: { EM:int, ST:int, ... } — wymagane dla kroku 1
// opts.firstAnswerPoints: points obj odpowiedzi na nq1 — wymagane dla kroku 2
function pickArchetype(scores, opts = {}) {
  const { peripheral_sum = null, firstAnswerPoints = null } = opts;

  const eligible = Object.keys(scores).filter((p) => {
    const arch = PROFILE_TO_ARCHETYPE[p];
    return arch && MVP_AVAILABLE_ARCHETYPES.includes(arch);
  });
  if (eligible.length === 0) {
    return { archetype: "tropiciel_tajemnic", dominant_profile: "DT" };
  }

  const maxScore = Math.max(...eligible.map((p) => scores[p]));
  let tied = eligible.filter((p) => scores[p] === maxScore);
  if (tied.length === 1) {
    return { archetype: PROFILE_TO_ARCHETYPE[tied[0]], dominant_profile: tied[0] };
  }

  // Krok 1: szerokosc profilu — wieksza suma punktow peryferyjnych (+1 i +2)
  if (peripheral_sum) {
    const maxPeripheral = Math.max(...tied.map((p) => peripheral_sum[p] || 0));
    tied = tied.filter((p) => (peripheral_sum[p] || 0) === maxPeripheral);
    if (tied.length === 1) {
      return { archetype: PROFILE_TO_ARCHETYPE[tied[0]], dominant_profile: tied[0] };
    }
  }

  // Krok 2: cecha z +3 w pierwszym pytaniu (jezeli wsrod tied)
  if (firstAnswerPoints) {
    const firstMain = Object.keys(firstAnswerPoints).find((p) => firstAnswerPoints[p] === 3);
    if (firstMain && tied.includes(firstMain)) {
      return { archetype: PROFILE_TO_ARCHETYPE[firstMain], dominant_profile: firstMain };
    }
  }

  // Krok 3: kolejnosc preferencji wieku
  for (const pref of TIE_BREAK_PREFERENCE) {
    if (tied.includes(pref)) {
      return { archetype: PROFILE_TO_ARCHETYPE[pref], dominant_profile: pref };
    }
  }

  return { archetype: PROFILE_TO_ARCHETYPE[tied[0]], dominant_profile: tied[0] };
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
      const peripheral_sum = { EM: 0, ST: 0, KR: 0, LD: 0, DT: 0, MD: 0 };
      let firstAnswerPoints = null;
      const log = [];
      for (const ans of answers) {
        const q = ONBOARDING_QUIZ.find((x) => x.question_id === ans.question_id);
        if (!q) continue;
        const a = q.answers.find((x) => x.answer_id === ans.answer_id);
        if (!a) continue;
        if (ans.question_id === "nq1") firstAnswerPoints = a.points;
        for (const [profile, pts] of Object.entries(a.points)) {
          scores[profile] = (scores[profile] || 0) + pts;
          if (pts === 1 || pts === 2) peripheral_sum[profile] = (peripheral_sum[profile] || 0) + pts;
        }
        log.push({ question_id: ans.question_id, answer_id: ans.answer_id, points_awarded: a.points });
      }
      // dominant_profile to docelowy 6-literowy kod (EM/ST/KR/LD/DT/MD).
      // 'archetype' jest deprecated (stara nazwa np. 'tropiciel_tajemnic') — zachowujemy w bazie tylko jako alias.
      // W player.archetype zapisujemy bezposrednio KOD profilu zeby uniknac mapowania w UI.
      const { dominant_profile } = pickArchetype(scores, { peripheral_sum, firstAnswerPoints });
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
