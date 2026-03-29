/**
 * ProfilerAgent — Agent analizy behawioralnej
 *
 * Analizuje ukryte wzorce w zachowaniu gracza wykraczające poza prosty scoring:
 * - Spójność wyborów (czy gracz konsekwentnie wybiera jeden styl?)
 * - Czas reakcji (szybkie vs. refleksyjne decyzje)
 * - Wzorce behawioralne (Test Marshmallow, reakcja na porażkę, ciekawość)
 * - Mikro-sygnały (co wybrał ZANIM zmienił zdanie, ile wahał się)
 */

import { BaseAgent } from "./BaseAgent.js";

const SYSTEM_PROMPT = `Jesteś ekspertem psychologii rozwojowej dzieci specjalizującym się w analizie kompetencji miękkich.

TWOJA ROLA:
Analizujesz zachowania gracza (dziecko 6-12 lat) w grze edukacyjnej "Ewolucja" i identyfikujesz ukryte wzorce behawioralne, które tabela punktów nie wychwytuje.

RAMY TEORETYCZNE:
- CASEL (5 kompetencji): samoświadomość, samoregulacja, świadomość społeczna, umiejętności relacyjne, odpowiedzialne podejmowanie decyzji
- VIA Character Strengths: mądrość, odwaga, humanitaryzm, sprawiedliwość, umiarkowanie, transcendencja
- Dweck Growth Mindset: stałe vs. wzrostowe nastawienie
- Test Marshmallow (Walter Mischel): odraczanie gratyfikacji
- Role Belbina: preferencje zespołowe

6 PROFILI KOMPETENCYJNYCH:
- EM (Empata): wrażliwość, życzliwość, dekodowanie emocji
- ST (Strateg): logika, planowanie, odraczanie gratyfikacji
- KR (Kreator): myślenie nieszablonowe, elastyczność poznawcza
- LD (Lider): odwaga, inicjatywa, gotowość do ryzyka
- DT (Detektyw): dociekliwość, eksploracja, ciekawość poznawcza
- MD (Mediator): sprawiedliwość, mediacja, praca zespołowa

ODPOWIADAJ ZAWSZE w formacie JSON. Używaj polskiego języka w treści, ale kluczy JSON po angielsku.`;

export class ProfilerAgent extends BaseAgent {
  constructor() {
    super({
      name: "ProfilerAgent",
      systemPrompt: SYSTEM_PROMPT,
      temperature: 0.2, // niska — analiza powinna być precyzyjna
      maxTokens: 1200,
    });
  }

  /**
   * Analizuje pełny log zachowań gracza po zakończeniu gry.
   *
   * @param {object} params
   * @param {string} params.playerName
   * @param {object} params.scores — Końcowe punkty
   * @param {Array}  params.choicesLog — Pełny log wyborów
   * @returns {Promise<object>} Analiza behawioralna
   */
  async analyzeFullProfile({ playerName, scores, choicesLog }) {
    const prompt = `ANALIZA BEHAWIORALNA GRACZA

GRACZ: ${playerName}
KOŃCOWE PUNKTY: ${JSON.stringify(scores)}

LOG WSZYSTKICH WYBORÓW:
${JSON.stringify(choicesLog, null, 2)}

Przeanalizuj zachowanie gracza i zwróć JSON z następującą strukturą:
{
  "behavioral_patterns": {
    "decision_style": "impulsywny|refleksyjny|zbalansowany",
    "consistency": "wysoka|średnia|niska — czy gracz konsekwentnie preferuje jeden profil",
    "risk_appetite": "wysoki|średni|niski",
    "social_orientation": "indywidualistyczny|kooperacyjny|adaptacyjny"
  },
  "marshmallow_insight": {
    "waited": true/false,
    "interpretation": "<co to mówi o samoregulacji dziecka>"
  },
  "frustration_response": {
    "reaction": "retry|seek_help|skip",
    "growth_mindset_indicator": "wysoki|średni|niski",
    "interpretation": "<co to mówi o nastawieniu na rozwój>"
  },
  "empathy_signals": {
    "helped_creature": true/false,
    "conflict_resolution_style": "autorytarny|demokratyczny|mediacyjny",
    "team_role_preference": "lider|wykonawca|opiekun",
    "interpretation": "<co to mówi o empatii i świadomości społecznej>"
  },
  "hidden_strengths": ["<max 3 ukryte mocne strony, których sam gracz może nie dostrzegać>"],
  "development_areas": ["<max 2 obszary do rozwoju, sformułowane pozytywnie>"],
  "casel_mapping": {
    "self_awareness": "niski|średni|wysoki",
    "self_management": "niski|średni|wysoki",
    "social_awareness": "niski|średni|wysoki",
    "relationship_skills": "niski|średni|wysoki",
    "responsible_decision_making": "niski|średni|wysoki"
  }
}`;

    return this.callJSON(prompt);
  }

  /**
   * Analizuje pojedynczy wybór "w locie" — do użytku w trakcie gry.
   *
   * @param {object} params
   * @param {number} params.taskId
   * @param {string} params.choiceId
   * @param {object} [params.behavioralData] — Np. czas reakcji
   * @param {object} params.currentScores
   * @returns {Promise<object>} Szybka mikro-analiza
   */
  async analyzeSingleChoice({ taskId, choiceId, behavioralData, currentScores }) {
    const prompt = `SZYBKA ANALIZA WYBORU

Zadanie: ${taskId}, Wybór: ${choiceId}
Dane behawioralne: ${JSON.stringify(behavioralData || {})}
Aktualne punkty: ${JSON.stringify(currentScores)}

Zwróć KRÓTKI JSON:
{
  "micro_insight": "<1 zdanie co ten wybór mówi o graczu>",
  "profile_tendency": "<który profil ten wybór wzmacnia: EM/ST/KR/LD/DT/MD>",
  "confidence": 0.0-1.0
}`;

    return this.callJSON(prompt);
  }

  // ── Demo fallback ──────────────────────────────────────────────────

  _demoFallback(body) {
    return {
      content: [{
        text: JSON.stringify({
          behavioral_patterns: {
            decision_style: "zbalansowany",
            consistency: "średnia",
            risk_appetite: "średni",
            social_orientation: "kooperacyjny",
          },
          marshmallow_insight: { waited: true, interpretation: "Tryb demo — brak analizy AI" },
          frustration_response: { reaction: "retry", growth_mindset_indicator: "średni", interpretation: "Tryb demo" },
          empathy_signals: { helped_creature: true, conflict_resolution_style: "demokratyczny", team_role_preference: "opiekun", interpretation: "Tryb demo" },
          hidden_strengths: ["empatia", "kreatywność"],
          development_areas: ["asertywność"],
          casel_mapping: {
            self_awareness: "średni", self_management: "średni",
            social_awareness: "średni", relationship_skills: "średni",
            responsible_decision_making: "średni",
          },
          _demo: true,
        }),
      }],
      usage: { input_tokens: 0, output_tokens: 0 },
    };
  }
}
