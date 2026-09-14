import { Router } from "express";
import { getPlayer, savePlayer, createCycle } from "../database/db.js";

// QUIZ OBRAZKOWY v4 (zrodlo prawdy: docs/TEST_OBRAZKOWY.md).
// 6 pytan x 4 odpowiedzi. Punktacja z pierscienia ST-MD-EM-KR-DT-LD:
// glowna +3, sasiedzi +2, dalsze +1, przeciwienstwo 0 (9 pkt na odpowiedz).
// Kazdy typ jest 'glowna' dokladnie 4 razy w 24 odpowiedziach.
// `podpis` = 2-4 slowa pod kafelkiem, `obraz` = docelowa ilustracja,
// `tylko48` = kafelek pokazywany wylacznie klasom 4-8 (dla 1-3 zostaja trzy).
// TYP wybieramy z licznika main_picks (ile razy dana cecha byla glowna),
// a suma `scores` karmi wylacznie radar — patrz TEST_OBRAZKOWY.md sekcja 3.
export const ONBOARDING_QUIZ = [
  {
    question_id: "nq1",
    question: "Na polanie stoi zamknięta skrzynia. Co robisz?",
    answers: [
      { answer_id: "a", glowna: "ST", podpis: "Oglądam kłódkę", obraz: "/assets/onboarding/skrzynia-a.webp", text: "Kucam przy skrzyni i oglądam kłódkę — najpierw chcę wiedzieć, jak jest zamknięta.", points: { ST: 3, MD: 2, EM: 1, KR: 0, DT: 1, LD: 2 }, tylko48: true },
      { answer_id: "b", glowna: "KR", podpis: "To statek kosmiczny", obraz: "/assets/onboarding/skrzynia-b.webp", text: "Siadam na niej okrakiem: od teraz to mój statek kosmiczny.", points: { ST: 0, MD: 1, EM: 2, KR: 3, DT: 2, LD: 1 } },
      { answer_id: "c", glowna: "EM", podpis: "Wołam przyjaciela", obraz: "/assets/onboarding/skrzynia-c.webp", text: "Macham do przyjaciela — otworzymy ją razem.", points: { ST: 1, MD: 2, EM: 3, KR: 2, DT: 1, LD: 0 } },
      { answer_id: "d", glowna: "LD", podpis: "Otwieram od razu", obraz: "/assets/onboarding/skrzynia-d.webp", text: "Chwytam wieko obiema rękami i unoszę je od razu.", points: { ST: 2, MD: 1, EM: 0, KR: 1, DT: 2, LD: 3 } },
    ],
  },
  {
    question_id: "nq2",
    question: "Przez ścieżkę płynie strumyk. Jak przejdziesz?",
    answers: [
      { answer_id: "a", glowna: "MD", podpis: "Idę powoli i pewnie", obraz: "/assets/onboarding/strumyk-a.webp", text: "Stawiam stopę na kamieniu i idę powoli, patrząc pod nogi.", points: { ST: 2, MD: 3, EM: 2, KR: 1, DT: 0, LD: 1 }, tylko48: true },
      { answer_id: "b", glowna: "DT", podpis: "Sprawdzam patykiem", obraz: "/assets/onboarding/strumyk-b.webp", text: "Kucam na brzegu i sprawdzam patykiem, jak tu głęboko.", points: { ST: 1, MD: 0, EM: 1, KR: 2, DT: 3, LD: 2 } },
      { answer_id: "c", glowna: "KR", podpis: "Buduję kładkę", obraz: "/assets/onboarding/strumyk-c.webp", text: "Układam deskę i kamienie w poprzek — będzie kładka.", points: { ST: 0, MD: 1, EM: 2, KR: 3, DT: 2, LD: 1 } },
      { answer_id: "d", glowna: "LD", podpis: "Skaczę pierwszy", obraz: "/assets/onboarding/strumyk-d.webp", text: "Rozpędzam się i skaczę pierwszy na drugi brzeg.", points: { ST: 2, MD: 1, EM: 0, KR: 1, DT: 2, LD: 3 } },
    ],
  },
  {
    question_id: "nq3",
    question: "Komuś rozsypało się pudełko kredek. Co robisz?",
    answers: [
      { answer_id: "a", glowna: "EM", podpis: "Siadam obok", obraz: "/assets/onboarding/kredki-a.webp", text: "Siadam obok i podaję pierwszą kredkę — nie musi nic mówić.", points: { ST: 1, MD: 2, EM: 3, KR: 2, DT: 1, LD: 0 } },
      { answer_id: "b", glowna: "ST", podpis: "Układam po kolorach", obraz: "/assets/onboarding/kredki-b.webp", text: "Zbieram kredki i układam je po kolei, od najjaśniejszej.", points: { ST: 3, MD: 2, EM: 1, KR: 0, DT: 1, LD: 2 } },
      { answer_id: "c", glowna: "MD", podpis: "Trzymam pudełko", obraz: "/assets/onboarding/kredki-c.webp", text: "Trzymam otwarte pudełko, żeby łatwiej było je wkładać.", points: { ST: 2, MD: 3, EM: 2, KR: 1, DT: 0, LD: 1 } },
      { answer_id: "d", glowna: "DT", podpis: "Szukam zgubionych", obraz: "/assets/onboarding/kredki-d.webp", text: "Zaglądam pod ławkę — na pewno któraś się tam zakręciła.", points: { ST: 1, MD: 0, EM: 1, KR: 2, DT: 3, LD: 2 }, tylko48: true },
    ],
  },
  {
    question_id: "nq4",
    question: "Dostajesz wielkie pudło. Co z nim zrobisz?",
    answers: [
      { answer_id: "a", glowna: "KR", podpis: "Statek kosmiczny", obraz: "/assets/onboarding/pudlo-a.webp", text: "Maluję je, wycinam okienko i robię statek kosmiczny.", points: { ST: 0, MD: 1, EM: 2, KR: 3, DT: 2, LD: 1 } },
      { answer_id: "b", glowna: "DT", podpis: "Pracownia badacza", obraz: "/assets/onboarding/pudlo-b.webp", text: "Robię z niego pracownię: lupa, kamyki, liście, słoik.", points: { ST: 1, MD: 0, EM: 1, KR: 2, DT: 3, LD: 2 } },
      { answer_id: "c", glowna: "EM", podpis: "Domek dla misia", obraz: "/assets/onboarding/pudlo-c.webp", text: "Robię domek dla misia — z kocykiem i wyciętym sercem.", points: { ST: 1, MD: 2, EM: 3, KR: 2, DT: 1, LD: 0 }, tylko48: true },
      { answer_id: "d", glowna: "LD", podpis: "Tarcza i wieża", obraz: "/assets/onboarding/pudlo-d.webp", text: "Wycinam tarczę i hełm, a z reszty buduję wieżę.", points: { ST: 2, MD: 1, EM: 0, KR: 1, DT: 2, LD: 3 } },
    ],
  },
  {
    question_id: "nq5",
    question: "Na ziemi widzisz rząd tropów. Co robisz?",
    answers: [
      { answer_id: "a", glowna: "DT", podpis: "Idę po śladach", obraz: "/assets/onboarding/tropy-a.webp", text: "Idę wzdłuż tropów i patrzę, dokąd prowadzą.", points: { ST: 1, MD: 0, EM: 1, KR: 2, DT: 3, LD: 2 } },
      { answer_id: "b", glowna: "ST", podpis: "Rysuję mapę", obraz: "/assets/onboarding/tropy-b.webp", text: "Rysuję patykiem na ziemi mapę: tropy, drzewo, strzałka.", points: { ST: 3, MD: 2, EM: 1, KR: 0, DT: 1, LD: 2 } },
      { answer_id: "c", glowna: "KR", podpis: "Robię własne ślady", obraz: "/assets/onboarding/tropy-c.webp", text: "Odciskam własne ślady obok i układam z nich wzór.", points: { ST: 0, MD: 1, EM: 2, KR: 3, DT: 2, LD: 1 }, tylko48: true },
      { answer_id: "d", glowna: "MD", podpis: "Stoję cicho", obraz: "/assets/onboarding/tropy-d.webp", text: "Staję cicho za krzakiem i czekam, kto się pokaże.", points: { ST: 2, MD: 3, EM: 2, KR: 1, DT: 0, LD: 1 } },
    ],
  },
  {
    question_id: "nq6",
    question: "Ktoś nowy stoi sam obok bawiącej się grupy. Co robisz?",
    answers: [
      { answer_id: "a", glowna: "EM", podpis: "Podaję mu piłkę", obraz: "/assets/onboarding/nowy-a.webp", text: "Podchodzę i podaję mu piłkę.", points: { ST: 1, MD: 2, EM: 3, KR: 2, DT: 1, LD: 0 } },
      { answer_id: "b", glowna: "LD", podpis: "Wołam wszystkich", obraz: "/assets/onboarding/nowy-b.webp", text: "Wołam wszystkich: gramy razem, jest nas więcej!", points: { ST: 2, MD: 1, EM: 0, KR: 1, DT: 2, LD: 3 }, tylko48: true },
      { answer_id: "c", glowna: "ST", podpis: "Dzielę na drużyny", obraz: "/assets/onboarding/nowy-c.webp", text: "Rysuję dwa kręgi i dzielę nas na drużyny, żeby każdy miał miejsce.", points: { ST: 3, MD: 2, EM: 1, KR: 0, DT: 1, LD: 2 } },
      { answer_id: "d", glowna: "MD", podpis: "Łączę dwie strony", obraz: "/assets/onboarding/nowy-d.webp", text: "Biorę za rękę jego i kogoś z grupy — robię mostek.", points: { ST: 2, MD: 3, EM: 2, KR: 1, DT: 0, LD: 1 } },
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
      const { player_id, answers, name } = req.body;
      const player = await getPlayer(db, player_id);
      if (!player) return res.status(404).json({ error: "Gracz nie znaleziony" });
      if (!Array.isArray(answers) || answers.length === 0) {
        return res.status(400).json({ error: "Brak odpowiedzi z quizu" });
      }
      const scores = { EM: 0, ST: 0, KR: 0, LD: 0, DT: 0, MD: 0 };
      const peripheral_sum = { EM: 0, ST: 0, KR: 0, LD: 0, DT: 0, MD: 0 };
      // main_picks — ile razy dana cecha byla GLOWNA (+3) w wybranej odpowiedzi.
      // To z niego wybieramy typ: pierscien sasiedztwa sklei sasiadow w sumie
      // punktow i remis zapada z definicji, a nie z wyboru dziecka.
      const main_picks = { EM: 0, ST: 0, KR: 0, LD: 0, DT: 0, MD: 0 };
      let firstAnswerPoints = null;
      const log = [];
      for (const ans of answers) {
        const q = ONBOARDING_QUIZ.find((x) => x.question_id === ans.question_id);
        if (!q) continue;
        const a = q.answers.find((x) => x.answer_id === ans.answer_id);
        if (!a) continue;
        if (ans.question_id === "nq1") firstAnswerPoints = a.points;
        const glowna = a.glowna || Object.keys(a.points).find((k) => a.points[k] === 3);
        if (glowna && main_picks[glowna] !== undefined) main_picks[glowna] += 1;
        for (const [profile, pts] of Object.entries(a.points)) {
          scores[profile] = (scores[profile] || 0) + pts;
          if (pts === 1 || pts === 2) peripheral_sum[profile] = (peripheral_sum[profile] || 0) + pts;
        }
        log.push({ question_id: ans.question_id, answer_id: ans.answer_id, points_awarded: a.points });
      }
      // dominant_profile to docelowy 6-literowy kod (EM/ST/KR/LD/DT/MD).
      // 'archetype' jest deprecated (stara nazwa np. 'tropiciel_tajemnic') — zachowujemy w bazie tylko jako alias.
      // W player.archetype zapisujemy bezposrednio KOD profilu zeby uniknac mapowania w UI.
      // Kryterium glowne: main_picks. Pierwszy tie-break (szerokosc profilu)
      // dostaje pelna sume punktow — to ta sama logika, tylko inne zrodlo.
      const { dominant_profile } = pickArchetype(main_picks, { peripheral_sum: scores, firstAnswerPoints });
      // Aktualizuj imie jezeli przeslane (np. uczen ktory wszedl z /dolacz wpisuje imie dopiero w quizie)
      if (name && typeof name === "string" && name.trim()) {
        player.player_name = name.trim();
      }
      player.archetype = dominant_profile;
      player.archetype_assigned_at = new Date().toISOString();
      player.onboarding_answers = log;
      player.main_picks = main_picks;
      player.lifetime_scores = player.lifetime_scores || { EM: 0, ST: 0, KR: 0, LD: 0, DT: 0, MD: 0 };
      for (const [k, v] of Object.entries(scores)) {
        player.lifetime_scores[k] = (player.lifetime_scores[k] || 0) + v;
      }
      // Bonus po ukonczeniu quiz: +50 coinow startowych (tylko jezeli player nie ma juz coinow z poprzedniej sesji)
      if (!player.coins || player.coins === 0) player.coins = 50;
      player.current_chapter = "wezwanie_kroniki";
      await savePlayer(db, player);
      const cycle = await createCycle(db, player.player_id);
      res.json({
        player_id: player.player_id,
        profile: dominant_profile,         // KOD profilu: EM/ST/KR/LD/DT/MD
        archetype: dominant_profile,       // alias dla wstecznej kompat (sklejony z profile)
        dominant_profile,                  // legacy field name
        onboarding_scores: scores,
        main_picks,
        first_cycle: cycle,
      });
    } catch (e) {
      console.error("[onboarding submit]", e);
      res.status(500).json({ error: e.message });
    }
  });

  return router;
}
