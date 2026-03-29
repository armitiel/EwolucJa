/**
 * ReportAgent — Agent generowania raportów
 *
 * Generuje dwa rodzaje raportów po zakończeniu gry:
 * 1. Raport przygodowy (dla ucznia) — język gry, supermoce, tytuł
 * 2. Raport pedagogiczny (dla nauczyciela) — CASEL, VIA, rekomendacje
 */

import { BaseAgent } from "./BaseAgent.js";

const SYSTEM_PROMPT = `Jesteś ekspertem tworzącym raporty edukacyjne na podstawie danych z gry "Ewolucja" — gry diagnozującej kompetencje miękkie u dzieci 6-12 lat.

GENERUJESZ DWA TYPY RAPORTÓW:

1. RAPORT DLA UCZNIA (student_report):
- Język przygodowy, ciepły, zachęcający
- Odniesienia do supermocy i tytułu hybrydowego
- Pozytywne ujęcie nawet słabych stron ("ukryta supermoc czekająca na odkrycie")
- Max 5 zdań, proste słowa
- Styl: jakbyś mówił do dziecka po wspaniałej przygodzie

2. RAPORT DLA NAUCZYCIELA (teacher_report):
- Profesjonalna terminologia: CASEL (5 kompetencji), VIA Character Strengths
- Konkretne dowody z zachowania w grze (cytaty wyborów)
- Rekomendacje pedagogiczne z pomysłami na aktywności
- Format zgodny ze schematem teacher_report.json
- Mapowanie: EM→Social Awareness, ST→Self-Management, KR→Creativity/Wisdom,
  LD→Courage, DT→Love of Learning/Curiosity, MD→Fairness/Teamwork

ODPOWIADAJ ZAWSZE w formacie JSON. Treść po polsku.`;

// Mapowanie profili na siły VIA
const VIA_MAPPING = {
  EM: { strengths: ["Życzliwość", "Empatia", "Inteligencja społeczna"], category: "Humanitaryzm" },
  ST: { strengths: ["Rozwaga", "Samoregulacja", "Wytrwałość"], category: "Umiarkowanie" },
  KR: { strengths: ["Kreatywność", "Ciekawość", "Otwartość"], category: "Mądrość" },
  LD: { strengths: ["Odwaga", "Przywództwo", "Zapał"], category: "Odwaga" },
  DT: { strengths: ["Miłość do nauki", "Dociekliwość", "Perspektywa"], category: "Mądrość" },
  MD: { strengths: ["Sprawiedliwość", "Praca zespołowa", "Dyplomacja"], category: "Sprawiedliwość" },
};

export class ReportAgent extends BaseAgent {
  constructor() {
    super({
      name: "ReportAgent",
      systemPrompt: SYSTEM_PROMPT,
      temperature: 0.4,
      maxTokens: 2000,
    });
  }

  /**
   * Generuje oba raporty na raz.
   *
   * @param {object} params
   * @param {string} params.playerName
   * @param {object} params.scores — Końcowe punkty
   * @param {string} params.hybridTitle — Tytuł hybrydowy
   * @param {Array}  params.dominantProfiles — [profil1, profil2]
   * @param {string} params.challengeArea — Profil z najniższym wynikiem
   * @param {Array}  params.choicesLog — Pełny log wyborów
   * @param {object} [params.behavioralAnalysis] — Wynik z ProfilerAgent
   * @returns {Promise<object>} { student_report, teacher_report }
   */
  async generateReports({
    playerName,
    scores,
    hybridTitle,
    dominantProfiles,
    challengeArea,
    choicesLog,
    behavioralAnalysis,
  }) {
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const topVIA = sorted.slice(0, 3).map(([k]) => VIA_MAPPING[k]).filter(Boolean);

    const prompt = `GENEROWANIE RAPORTÓW

GRACZ: ${playerName}
TYTUŁ HYBRYDOWY: ${hybridTitle}
PROFILE DOMINUJĄCE: ${dominantProfiles.join(", ")}
OBSZAR WYZWANIA: ${challengeArea}
KOŃCOWE PUNKTY: ${JSON.stringify(scores)}

MAPOWANIE VIA (top 3):
${topVIA.map((v, i) => `${i + 1}. ${v.category}: ${v.strengths.join(", ")}`).join("\n")}

LOG WYBORÓW:
${JSON.stringify(choicesLog, null, 2)}

${behavioralAnalysis ? `ANALIZA BEHAWIORALNA:\n${JSON.stringify(behavioralAnalysis, null, 2)}` : ""}

Wygeneruj JSON z dwoma raportami:
{
  "student_report": {
    "title": "${hybridTitle}",
    "greeting": "<powitanie przygodowe z imieniem>",
    "superpower_description": "<2-3 zdania o supermocach gracza>",
    "challenge_message": "<1 zdanie o ukrytej supermocy do rozwoju>",
    "closing": "<1 zdanie motywujące>"
  },
  "teacher_report": {
    "student_name": "${playerName}",
    "date": "${new Date().toISOString().split("T")[0]}",
    "scores": ${JSON.stringify(scores)},
    "dominant_profiles": ${JSON.stringify(dominantProfiles)},
    "hybrid_title": "${hybridTitle}",
    "casel_analysis": {
      "self_awareness": { "level": "niski|średni|wysoki", "evidence": "<konkretne dowody>" },
      "self_management": { "level": "...", "evidence": "..." },
      "social_awareness": { "level": "...", "evidence": "..." },
      "relationship_skills": { "level": "...", "evidence": "..." },
      "responsible_decision_making": { "level": "...", "evidence": "..." }
    },
    "via_strengths": [
      { "strength_name": "...", "category": "...", "evidence": "..." }
    ],
    "recommendations": [
      { "area": "...", "suggestion": "...", "activity_ideas": ["..."] }
    ],
    "behavioral_insights": {
      "marshmallow_result": { "waited": true/false, "wait_time_seconds": ... },
      "frustration_tolerance": "niska|średnia|wysoka",
      "creativity_score": "standardowe|nieszablonowe|wybitne"
    }
  }
}`;

    return this.callJSON(prompt);
  }

  /**
   * Generuje TYLKO raport dla ucznia (szybki, lekki).
   */
  async generateStudentReport({ playerName, hybridTitle, dominantProfiles, challengeArea, scores }) {
    const prompt = `Wygeneruj KRÓTKI raport przygodowy dla dziecka.

GRACZ: ${playerName}
TYTUŁ: ${hybridTitle}
SUPERMOCE: ${dominantProfiles.join(" i ")}
WYZWANIE: ${challengeArea}
PUNKTY: ${JSON.stringify(scores)}

JSON:
{
  "greeting": "<powitanie>",
  "superpower_description": "<opis supermocy, 2-3 zdania>",
  "challenge_message": "<wyzwanie ujęte pozytywnie>",
  "closing": "<motywacja>"
}`;

    return this.callJSON(prompt);
  }

  // ── Demo fallback ──────────────────────────────────────────────────

  _demoFallback(body) {
    return {
      content: [{
        text: JSON.stringify({
          student_report: {
            title: "Bohater Ewolucji",
            greeting: "Brawo, podróżniku! Twoja przygoda się zakończyła!",
            superpower_description: "Wykazałeś się niesamowitą odwagą i empatią. Twoje supermoce to zdolność rozumienia innych i gotowość do działania!",
            challenge_message: "Twoja ukryta supermoc — kreatywność — czeka na odkrycie w przyszłych przygodach!",
            closing: "Pamiętaj, każdy bohater ciągle się rozwija. Do zobaczenia w kolejnej przygodzie!",
          },
          teacher_report: {
            student_name: "Gracz",
            date: new Date().toISOString().split("T")[0],
            scores: { EM: 5, ST: 5, KR: 3, LD: 4, DT: 4, MD: 5 },
            dominant_profiles: ["EM", "MD"],
            hybrid_title: "Strażnik Pokoju",
            casel_analysis: {
              self_awareness: { level: "średni", evidence: "Tryb demo" },
              self_management: { level: "średni", evidence: "Tryb demo" },
              social_awareness: { level: "średni", evidence: "Tryb demo" },
              relationship_skills: { level: "średni", evidence: "Tryb demo" },
              responsible_decision_making: { level: "średni", evidence: "Tryb demo" },
            },
            via_strengths: [{ strength_name: "Życzliwość", category: "Humanitaryzm", evidence: "Tryb demo" }],
            recommendations: [{ area: "Kreatywność", suggestion: "Tryb demo", activity_ideas: ["Tryb demo"] }],
            behavioral_insights: {
              marshmallow_result: { waited: true, wait_time_seconds: 30 },
              frustration_tolerance: "średnia",
              creativity_score: "standardowe",
            },
          },
          _demo: true,
        }),
      }],
      usage: { input_tokens: 0, output_tokens: 0 },
    };
  }
}
