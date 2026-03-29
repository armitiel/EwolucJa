/**
 * AvatarAgent — Agent generowania opisów i ulepszeń awatara
 *
 * Nie generuje obrazów (to robi frontend SVG), ale:
 * 1. Sugeruje ewolucję wizualną awatara na podstawie profilu
 * 2. Generuje opisy przedmiotów ekwipunku w stylu gry
 * 3. Tworzy "kartę bohatera" — finalny opis awatara z ekwipunkiem
 * 4. Może generować prompt do AI image generation (DALL-E/SD) jako rozszerzenie
 */

import { BaseAgent } from "./BaseAgent.js";

const SYSTEM_PROMPT = `Jesteś kreatywnym projektantem postaci w świecie gry "Ewolucja" — edukacyjnej gry fantasy dla dzieci 6-12 lat.

STYL WIZUALNY: Claymorphism / Pixar
- Obłe, miękkie kształty jak z plasteliny
- Żywe, nasycone kolory z matową teksturą
- Miękkie cienie, delikatne podświetlenia
- Duże, wyraziste oczy pełne życia
- Przytulny, bezpieczny wygląd

TWOJA ROLA:
1. Opisujesz jak awatar ewoluuje w trakcie gry (nowe elementy, zmiany aury)
2. Tworzysz opisy zdobytych przedmiotów w stylu gry
3. Generujesz "Kartę Bohatera" — podsumowanie wizualne postaci
4. Opcjonalnie: tworzysz prompty do generowania obrazów AI

PRZEDMIOTY EKWIPUNKU:
- 🔍 Lupa Odkrywcy (DT) — złoto-fioletowa lupa z kryształową soczewką
- 🛡️ Tarcza Odwagi (LD) — okrągła tarcza z herbem lwa, szmaragdowa
- 📚 Księga Mądrości (ST) — gruba książka ze świecącymi runami
- 🎒 Plecak Podróżnika (KR) — kolorowy plecak z kieszonkami pełnymi narzędzi
- 🧥 Zielona Peleryna (EM) — miękka peleryna w odcieniu szmaragdu, migocząca
- 🧭 Kompas Czasu (ST) — złoty kompas z niebieskim światłem
- 🥽 Gogle Wynalazcy (KR) — steampunkowe gogle z kolorowymi szkiełkami
- 👑 Korona Odwagi (LD) — mała korona ze srebra i rubinów
- 💎 Kryształowe Serce (EM) — wisiorek w kształcie serca z różowym kryształem
- 📜 Zwój Mądrości (DT) — starożytny zwój ze świecącymi literami
- 🕊️ Gałązka Pokoju (MD) — srebrna gałązka z zielonymi listkami
- 🏅 Medal Drużyny (MD) — złoty medal z symbolem dłoni
- ⭐ Buty Gwiazd (KR) — buty z gwiazdkami, lekko unoszące nad ziemię
- 💠 Diamentowa Skrzynia (ST) — miniaturowa skrzynka z kryształu

ODPOWIADAJ ZAWSZE w formacie JSON. Treść po polsku.`;

export class AvatarAgent extends BaseAgent {
  constructor() {
    super({
      name: "AvatarAgent",
      systemPrompt: SYSTEM_PROMPT,
      temperature: 0.6, // wyższa — kreatywne opisy
      maxTokens: 800,
    });
  }

  /**
   * Opisuje nowo zdobyty przedmiot w stylu gry.
   *
   * @param {object} params
   * @param {string} params.playerName
   * @param {string} params.itemId — ID przedmiotu
   * @param {string} params.itemName — Nazwa przedmiotu
   * @param {string} params.context — Co gracz zrobił, żeby go zdobyć
   * @returns {Promise<object>} Opis przedmiotu
   */
  async describeNewItem({ playerName, itemId, itemName, context }) {
    const prompt = `NOWY PRZEDMIOT ZDOBYTY!

GRACZ: ${playerName}
PRZEDMIOT: ${itemName} (${itemId})
JAK ZDOBYTY: ${context}

Wygeneruj krótki, ekscytujący opis zdobycia w stylu claymorphism/Pixar.
JSON:
{
  "acquisition_narration": "<2-3 zdania jak przedmiot pojawia się — efekty wizualne, światło, dźwięk>",
  "item_description": "<1-2 zdania opis przedmiotu w stylu gry>",
  "avatar_change": "<jak awatar się zmienia z nowym przedmiotem>"
}`;

    return this.callJSON(prompt);
  }

  /**
   * Generuje pełną "Kartę Bohatera" po zakończeniu gry.
   *
   * @param {object} params
   * @param {string} params.playerName
   * @param {string} params.hybridTitle
   * @param {Array}  params.dominantProfiles
   * @param {object} params.scores
   * @param {Array}  params.equipment — Lista ID zdobytych przedmiotów
   * @param {object} params.avatarConfig — Konfiguracja wyglądu awatara
   * @returns {Promise<object>} Karta Bohatera
   */
  async generateHeroCard({ playerName, hybridTitle, dominantProfiles, scores, equipment, avatarConfig }) {
    const prompt = `KARTA BOHATERA — PODSUMOWANIE

GRACZ: ${playerName}
TYTUŁ: ${hybridTitle}
PROFILE DOMINUJĄCE: ${dominantProfiles.join(", ")}
PUNKTY: ${JSON.stringify(scores)}
EKWIPUNEK: ${JSON.stringify(equipment)}
WYGLĄD AWATARA: ${JSON.stringify(avatarConfig)}

Stwórz Kartę Bohatera — uroczysty opis postaci po zakończeniu przygody.
JSON:
{
  "hero_title": "${hybridTitle}",
  "hero_epithet": "<krótki przydomek, np. 'Ten, który widzi sercem'>",
  "appearance_description": "<3-4 zdania opis jak wygląda awatar z pełnym ekwipunkiem, styl Pixar>",
  "aura_description": "<jak wygląda aura bohatera — kolor, kształt, efekty>",
  "signature_item": "<który przedmiot jest najbardziej charakterystyczny i dlaczego>",
  "hero_motto": "<motto bohatera, 1 krótkie zdanie>"
}`;

    return this.callJSON(prompt);
  }

  /**
   * Generuje prompt do AI image generation (np. DALL-E).
   * Użycie opcjonalne — rozszerzenie hybrydowe.
   */
  async generateImagePrompt({ playerName, hybridTitle, equipment, avatarConfig }) {
    const prompt = `Wygeneruj prompt w JĘZYKU ANGIELSKIM do DALL-E / Stable Diffusion.

POSTAĆ: ${playerName}, tytuł "${hybridTitle}"
WYGLĄD: ${JSON.stringify(avatarConfig)}
EKWIPUNEK: ${JSON.stringify(equipment)}

STYL: Pixar 3D render, claymorphism, chibi proportions, soft lighting, pastel background

JSON:
{
  "dalle_prompt": "<pełny prompt po angielsku, max 200 słów>",
  "negative_prompt": "<czego unikać>",
  "style_tags": ["<tagi stylu>"]
}`;

    return this.callJSON(prompt);
  }

  // ── Demo fallback ──────────────────────────────────────────────────

  _demoFallback(body) {
    return {
      content: [{
        text: JSON.stringify({
          acquisition_narration: "Przedmiot pojawia się w blasku złotego światła! Małe iskierki tańczą wokół niego jak świetliki.",
          item_description: "Magiczny przedmiot wykonany z najczystszego kryształu, ciepły w dotyku.",
          avatar_change: "Twój awatar promienieje nową energią — aura staje się jaśniejsza!",
          _demo: true,
        }),
      }],
      usage: { input_tokens: 0, output_tokens: 0 },
    };
  }
}
