/**
 * CreativityAgent — Agent ewaluacji kreatywności
 *
 * Ocenia odpowiedzi tekstowe gracza (Zadanie 7 — Przepaść i Pudełko)
 * pod kątem myślenia dywergencyjnego, oryginalności i kombinowania przedmiotów.
 */

import { BaseAgent } from "./BaseAgent.js";

const SYSTEM_PROMPT = `Jesteś ekspertem od kreatywności i myślenia dywergencyjnego u dzieci.

TWOJA ROLA:
Oceniasz odpowiedzi tekstowe dziecka (6-12 lat) w zadaniu kreatywnym z gry "Ewolucja".

KONTEKST ZADANIA:
Gracz stoi przed przepaścią i ma 3 przedmioty: parasol, pustą puszkę i rolkę sznurka.
Musi wymyślić jak je wykorzystać żeby dostać się na drugą stronę.

KRYTERIA OCENY (skala 1-4):
1 — STANDARDOWE: Proste, oczywiste użycie jednego przedmiotu (np. "zrobię most ze sznurka")
2 — DOBRE: Łączenie 2 przedmiotów LUB nieszablonowe użycie jednego (np. "przywiążę sznurek do puszki i przerzucę")
3 — KREATYWNE: Łączenie ≥2 przedmiotów w nieoczywisty sposób (np. "parasol jako spadochron, sznurek jako lina")
4 — WYBITNE: Oryginalne, zaskakujące rozwiązanie łączące wszystkie 3 przedmioty z wewnętrzną logiką

WAŻNE:
- Bądź hojny w ocenie — to dzieci, chcemy je zachęcać!
- Nieortograficzne odpowiedzi też są ważne — liczy się pomysł, nie pisownia
- Nawet proste pomysły dostają minimum 1 punkt
- Doceniaj humor i wyobraźnię

ODPOWIADAJ ZAWSZE w formacie JSON.`;

export class CreativityAgent extends BaseAgent {
  constructor() {
    super({
      name: "CreativityAgent",
      systemPrompt: SYSTEM_PROMPT,
      temperature: 0.3,
      maxTokens: 500,
    });
  }

  /**
   * Ocenia kreatywną odpowiedź tekstową gracza.
   *
   * @param {object} params
   * @param {string} params.playerName
   * @param {string} params.answer — Tekst odpowiedzi gracza
   * @param {number} params.taskId — ID zadania (domyślnie 7)
   * @returns {Promise<object>} Ocena kreatywności
   */
  async evaluateCreativity({ playerName, answer, taskId = 7 }) {
    const prompt = `OCENA KREATYWNOŚCI

GRACZ: ${playerName}
ZADANIE: ${taskId} (Przepaść i Pudełko)
DOSTĘPNE PRZEDMIOTY: parasol, pusta puszka, rolka sznurka
ODPOWIEDŹ GRACZA: "${answer}"

Oceń tę odpowiedź i zwróć JSON:
{
  "score": <1-4>,
  "items_used": ["<które przedmioty gracz użył>"],
  "items_combined": <true/false — czy łączy ≥2 przedmioty>,
  "originality": "standardowe|dobre|nieszablonowe|wybitne",
  "feedback_for_player": "<1-2 zdania zachęcającego komentarza po polsku, w tonie przygody>",
  "reasoning": "<krótkie uzasadnienie oceny po polsku>"
}`;

    return this.callJSON(prompt);
  }

  // ── Demo fallback ──────────────────────────────────────────────────

  _demoFallback(body) {
    const userMsg = body.messages?.find((m) => m.role === "user")?.content || "";
    const answerMatch = userMsg.match(/ODPOWIEDŹ GRACZA:\s*"(.+?)"/);
    const answer = answerMatch?.[1] || "";

    // Prosta heurystyka offline
    const items = ["parasol", "puszk", "sznur"];
    const usedCount = items.filter((i) => answer.toLowerCase().includes(i)).length;
    const isLong = answer.length > 30;

    let score = 1;
    if (usedCount >= 2 && isLong) score = 3;
    else if (usedCount >= 2 || isLong) score = 2;

    return {
      content: [{
        text: JSON.stringify({
          score,
          items_used: items.filter((i) => answer.toLowerCase().includes(i)),
          items_combined: usedCount >= 2,
          originality: score >= 3 ? "nieszablonowe" : "standardowe",
          feedback_for_player: "Świetny pomysł! Twoja wyobraźnia jest naprawdę magiczna!",
          reasoning: `Tryb demo: wykryto ${usedCount} przedmiotów, długość ${answer.length} znaków.`,
          _demo: true,
        }),
      }],
      usage: { input_tokens: 0, output_tokens: 0 },
    };
  }
}
