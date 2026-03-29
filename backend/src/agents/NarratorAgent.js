/**
 * NarratorAgent — GAMA-1 Agent Narrator
 *
 * Generuje dynamiczną narrację fabularną dla każdej krainy i zadania.
 * Personalizuje tekst na podstawie imienia gracza, dotychczasowych wyborów
 * i aktualnego profilu punktowego.
 *
 * Zwraca format zgodny z narrator_response.json schema.
 */

import { BaseAgent } from "./BaseAgent.js";

const SYSTEM_PROMPT = `Jesteś GAMA-1, Narratorem magicznego świata Ewolucji — gry edukacyjnej dla dzieci 6-12 lat.

TWOJA ROLA:
- Prowadzisz gracza przez krainy pełne przygód
- Mówisz ciepłym, zachęcającym, tajemniczym tonem
- Używasz prostego, żywego języka — bez żargonu
- Zwracasz się per "Ty" w 2. osobie liczby pojedynczej
- Nigdy nie oceniasz wyborów jako "złych" — każdy wybór ujawnia inną supermoc
- Narracja max 120 słów, ale treściwa i wciągająca

STYL WIZUALNY (opisuj świat w tym stylu):
Claymorphism / Pixar — obłe kształty, żywe kolory, matowe tekstury, miękkie cienie,
wszystko wygląda jak wylep z kolorowej plasteliny z połyskiem.

KRAINY ŚWIATA:
1. Dolina Selfie — kraina luster i samopoznania, tęczowe kryształy, magiczne zwierciadła
2. Las Decyzji — gęsty zielony las, rozświetlone polany, ukryte ścieżki, stworzenia w gąszczach
3. Jaskinia Emocji — migoczące kryształy, kamienny strażnik, skrzynie z niespodziankami
4. Wyspa Talentów — tropikalna wyspa, starożytne maszyny, przepaście i pudełka z gadżetami
5. Przystań Współpracy — molo z kolorowymi łodziami, morskie stworzenia, wspólne budowanie
6. Góra Podsumowania — szczyt z panoramą, magiczny portal, ceremonia nadania tytułu

ODPOWIEDZ ZAWSZE w formacie JSON:
{
  "land": "<nazwa_krainy>",
  "task_id": <numer>,
  "narration": "<tekst fabularny>",
  "choices": [{"id": "A", "label": "...", "icon": "..."}],
  "atmosphere": "<1 zdanie opisujące nastrój sceny>",
  "avatar_reaction": "<krótki opis jak awatar reaguje na scenę>"
}`;

// Kontekst krain do wzbogacenia promptów
const LAND_CONTEXT = {
  dolina_selfie: {
    theme: "samoświadomość i eksploracja tożsamości",
    visuals: "tęczowe kryształy, magiczne lustro odbijające prawdziwą duszę, mieniąca się aura",
    mood: "ciepło, ciekawość, odkrywanie siebie",
  },
  las_decyzji: {
    theme: "ciekawość poznawcza, empatia, etyka",
    visuals: "stare dęby, świetliki, zarośnięte ścieżki, pajęcze sieci, futrzaste Chowańce",
    mood: "tajemniczość, wybór, odwaga",
  },
  jaskinia_emocji: {
    theme: "cierpliwość, inteligencja emocjonalna, odraczanie gratyfikacji",
    visuals: "migoczące stalaktyty, kamienny strażnik, pulsujące skrzynie, kryształy z twarzami",
    mood: "napięcie, oczekiwanie, magia głębin",
  },
  wyspa_talentow: {
    theme: "kreatywność, tolerancja na frustrację, growth mindset",
    visuals: "tropikalna roślinność, starożytna maszyna, przepaść, pudełko z przedmiotami",
    mood: "wyzwanie, pomysłowość, przygoda",
  },
  przystan_wspolpracy: {
    theme: "praca zespołowa, mediacja, role grupowe",
    visuals: "drewniane molo, kolorowe żagle, Krabor i Żółwinka, budowa tratwy",
    mood: "energia, współpraca, kompromis",
  },
  gora_podsumowania: {
    theme: "podsumowanie, profil, ceremonia",
    visuals: "szczyt ze złotą panoramą, portal supermocy, korona tytułu",
    mood: "triumf, refleksja, duma",
  },
};

export class NarratorAgent extends BaseAgent {
  constructor() {
    super({
      name: "NarratorAgent",
      systemPrompt: SYSTEM_PROMPT,
      temperature: 0.5,
      maxTokens: 800,
    });
  }

  /**
   * Generuje narrację dla danego zadania w krainie.
   *
   * @param {object} params
   * @param {string} params.playerName
   * @param {string} params.land — ID krainy
   * @param {number} params.taskId — Numer zadania
   * @param {object} params.scores — Aktualne punkty {EM, ST, KR, LD, DT, MD}
   * @param {Array}  params.choicesLog — Dotychczasowe wybory
   * @param {string} params.scenarioText — Tekst scenariusza z lands_scenarios.txt
   * @returns {Promise<object>} Narrator response JSON
   */
  async generateNarration({ playerName, land, taskId, scores, choicesLog, scenarioText }) {
    const context = LAND_CONTEXT[land] || {};
    const recentChoices = (choicesLog || []).slice(-3).map(
      (c) => `Zadanie ${c.task_id}: wybór ${c.choice_id}`
    ).join(", ");

    const prompt = `GRACZ: ${playerName}
KRAINA: ${land} (${context.theme || ""})
ZADANIE: ${taskId}
WIZUALIA: ${context.visuals || ""}
NASTRÓJ: ${context.mood || ""}
AKTUALNE PUNKTY: ${JSON.stringify(scores)}
OSTATNIE WYBORY: ${recentChoices || "brak — to początek przygody"}

--- SCENARIUSZ KRAINY ---
${scenarioText}

Wygeneruj narrację dla tego zadania. Spersonalizuj tekst imieniem gracza.
Narracja powinna oddawać wizualny styl claymorphism/Pixar — opisuj obłe kształty, żywe kolory.
Jeśli gracz wcześniej dokonał wyborów, możesz subtelnie nawiązać do nich w narracji.`;

    return this.callJSON(prompt);
  }

  /**
   * Generuje narrację przejścia między krainami.
   */
  async generateTransition({ playerName, fromLand, toLand, scores }) {
    const toContext = LAND_CONTEXT[toLand] || {};

    const prompt = `GRACZ: ${playerName}
PRZEJŚCIE: ${fromLand} → ${toLand}
NOWA KRAINA: ${toContext.theme || ""}
WIZUALIA: ${toContext.visuals || ""}
NASTRÓJ: ${toContext.mood || ""}
AKTUALNE PUNKTY: ${JSON.stringify(scores)}

Wygeneruj KRÓTKĄ (max 60 słów) narrację przejścia między krainami.
Opisz jak gracz opuszcza starą krainę i wkracza do nowej.
Styl: claymorphism/Pixar — plastyczne, kolorowe, magiczne.

Odpowiedz JSON:
{
  "transition_text": "<tekst przejścia>",
  "new_land_teaser": "<1 zdanie zapowiedzi nowej krainy>"
}`;

    return this.callJSON(prompt);
  }

  // ── Demo fallback ──────────────────────────────────────────────────

  _demoFallback(body) {
    // Wyciągnij land i taskId z kontekstu
    const userMsg = body.messages?.find((m) => m.role === "user")?.content || "";
    const landMatch = userMsg.match(/KRAINA:\s*(\w+)/);
    const taskMatch = userMsg.match(/ZADANIE:\s*(\d+)/);
    const land = landMatch?.[1] || "dolina_selfie";
    const taskId = parseInt(taskMatch?.[1] || "1");

    const fallbacks = {
      dolina_selfie: {
        narration: "Witaj, podróżniku! Zwierciadło Prawdy mruga do Ciebie wesoło — jego plastikowa ramka lśni jak nowa. Wybierz swój pierwszy magiczny przedmiot!",
      },
      las_decyzji: {
        narration: "Gęsty las otacza Cię z każdej strony. Ścieżka rozdziela się na dwie — jedna prosta jak strzała, druga tajemnicza i zarośnięta.",
      },
      jaskinia_emocji: {
        narration: "Wchodzisz do jaskini pełnej migoczących kryształów. Kamienny Strażnik patrzy na Ciebie mądrymi oczami.",
      },
      wyspa_talentow: {
        narration: "Tropikalna wyspa wita Cię palmami i zagadkową maszyną z kręcącymi się kółkami.",
      },
      przystan_wspolpracy: {
        narration: "Przy drewnianym molo czekają dwa stworzenia — wielki Krabor i mała Żółwinka. Coś się między nimi gotuje!",
      },
      gora_podsumowania: {
        narration: "Stoisz na szczycie! Magiczny portal supermocy otwiera się przed Tobą.",
      },
    };

    const fallback = fallbacks[land] || fallbacks.dolina_selfie;

    return {
      content: [{
        text: JSON.stringify({
          land,
          task_id: taskId,
          narration: fallback.narration,
          choices: [],
          atmosphere: "Magiczna atmosfera pełna kolorów i tajemnic.",
          avatar_reaction: "Twój awatar rozgląda się z ciekawością.",
          _demo: true,
        }),
      }],
      usage: { input_tokens: 0, output_tokens: 0 },
    };
  }
}
