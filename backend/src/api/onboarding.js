/*!
 * EwolucJA — gra edukacyjna dla dzieci.
 * © 2026 Amitiel Angelisme. Wszelkie prawa zastrzeżone.
 * Powstało w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”.
 * Prawa autorskie należą do autora. Pełna nota: LICENSE.
 */
import { Router } from "express";
import { getPlayer, savePlayer, createCycle } from "../database/db.js";

// TRESC TESTU (szesc pytan, dwadziescia cztery odpowiedzi, warianty wiekowe)
// przeniesiona do `quizObrazkowy.js` — tu zostaje mechanika. Reeksport, bo
// `ONBOARDING_QUIZ` importuja tez skrypty bilansu i pulpit dev.
import { ONBOARDING_QUIZ } from "./quizObrazkowy.js";
export { ONBOARDING_QUIZ };

export const PROFILE_TO_ARCHETYPE = {
  DT: "tropiciel_tajemnic",
  EM: "zaklinacz_uczuc",
  ST: "mistrz_map",
  KR: "tkacz_snow",
  LD: "gwardzista_odwagi",
  // `straznik_mostu` to LEGACY ID, nie nazwa: typ MD nazywa sie dzis
  // Spokojna Glowa (Skupienie), ale klucz zostaje, bo siedzi w zapisach
  // starszych graczy i w tablicach LEGACY_TO_PROFILE we froncie.
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

  /**
   * Test w wersji dla danego etapu szkolnego.
   *
   * `?etap=1-3` — trzy kafelki na pytanie (`tylko48` odpada), scenki bez
   * ladunku leku (kloda zamiast strumyka) i podpisy, ktore front chowa pod
   * dotkniecie: dla najmlodszych obrazek niesie tresc, slowo jest tylko
   * etykieta do odsluchania.
   * `?etap=4-8` (domyslne) — cztery kafelki i warianty dla starszych tam,
   * gdzie scenka dla mlodszych czyta sie jako dziecinna (kredki -> piornik).
   *
   * Filtrujemy PO STRONIE SERWERA, bo od tego zalezy bilans: szesc ukrytych
   * kafelkow pokrywa szesc roznych typow i wersja trzykafelkowa zostaje przez
   * to zbalansowana. Front, ktory filtrowalby sam, moglby to po cichu zepsuc.
   *
   * Punktacji (`points`, `glowna`) NIE wysylamy — to jedyna rzecz, ktorej
   * dziecko po drugiej stronie nie ma jak zobaczyc w zakladce sieciowej.
   */
  router.get("/quiz", (req, res) => {
    const mlodsze = String(req.query.etap || "") === "1-3";
    res.json({
      etap: mlodsze ? "1-3" : "4-8",
      questions: ONBOARDING_QUIZ.map((q) => ({
        question_id: q.question_id,
        question: (mlodsze ? q.pytanie13 : q.pytanie48) || q.question,
        answers: q.answers
          .filter((a) => !(mlodsze && a.tylko48))
          .map((a) => {
            const w = (!mlodsze && a.wariant48) || {};
            return {
              answer_id: a.answer_id,
              podpis: w.podpis || a.podpis,
              obraz: w.obraz || a.obraz,
              text: w.text || a.text,
            };
          }),
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
      const { player_id, answers, name, etap_szkolny } = req.body;
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
      /* POLA PROFILU (TEST_OBRAZKOWY.md sekcja 7). `profil_wsparcie` to drugi
         typ w kolejnosci main_picks — dobiera trzecie zadanie, zeby profil nie
         zamykal dziecka w koleinie. `profil_zrodlo` odroznia wynik testu od
         profilu douczonego pozniej z realnych wyborow: reguly zmiany typu
         (sekcja 8) musza wiedziec, co wlasciwie zmieniaja. `sygnaly` startuja
         od zera i rosna poza tym miejscem. */
      const kolejnosc = Object.keys(main_picks).sort((a, b) => main_picks[b] - main_picks[a]);
      player.profil_glowny = dominant_profile;
      player.profil_wsparcie = kolejnosc.find((k) => k !== dominant_profile) || null;
      player.profil_zrodlo = "quiz";
      player.profil_aktualizacja = new Date().toISOString();
      player.sygnaly = player.sygnaly || { EM: 0, ST: 0, KR: 0, LD: 0, DT: 0, MD: 0 };
      player.etap_szkolny = etap_szkolny === "1-3" ? "1-3" : "4-8";
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
        profil_glowny: player.profil_glowny,
        profil_wsparcie: player.profil_wsparcie,
        etap_szkolny: player.etap_szkolny,
        first_cycle: cycle,
      });
    } catch (e) {
      console.error("[onboarding submit]", e);
      res.status(500).json({ error: e.message });
    }
  });

  return router;
}
