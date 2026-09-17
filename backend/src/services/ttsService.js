/*!
 * SPDX-FileCopyrightText: © 2026 Amitiel Angelisme <armitiel@gmail.com>
 * SPDX-License-Identifier: LicenseRef-EwolucJA-Proprietary
 *
 * EwolucJA — gra edukacyjna dla dzieci.
 * Produkt powstał w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”;
 * autorskie prawa majątkowe pozostają przy autorze. Licencja: LICENSE.
 */
/**
 * ElevenLabs TTS Service — głosy Świata Ewolucji (narratorka, Wizkor, lisek)
 *
 * Konwertuje tekst narracji na mowę za pomocą ElevenLabs API.
 * Zwraca audio jako Buffer (mp3) do strumieniowania przez Express.
 *
 * Endpoint: POST https://api.elevenlabs.io/v1/text-to-speech/{voice_id}
 */

import { createHash } from "node:crypto";

// ── Konfiguracja głosów ──────────────────────────────────────────────

const VOICES = {
  // Głosy ElevenLabs — ID mogą się zmieniać, sprawdź w panelu.
  // Narratorka Świata Ewolucji (kobiecy, ciepły, lekko tajemniczy)
  narrator: (process.env.ELEVENLABS_VOICE_ID || "").trim() || "XrYxa2QP5oFX1cg3JPdt",
  /**
   * WIZKOR MA WŁASNY GŁOS — i do 17.09.2026 nie miał, przez co w całej grze
   * słychać było narratorkę: ten wpis wskazywał dokładnie ten sam
   * `ELEVENLABS_VOICE_ID`, co ona. Osobnej zmiennej po prostu nie było.
   *
   * Fallback ZOSTAJE (inaczej brak zmiennej = brak mowy Wizkora, a on prowadzi
   * przez zadania), ale widać go w `/api/tts/status` jako `wizkor: "narrator"`.
   */
  mystical: (process.env.ELEVENLABS_WIZKOR_VOICE_ID || "").trim()
    || (process.env.ELEVENLABS_VOICE_ID || "").trim() || "XrYxa2QP5oFX1cg3JPdt",
  excited:  (process.env.ELEVENLABS_VOICE_ID || "").trim() || "XrYxa2QP5oFX1cg3JPdt",
  // Głos Mentora (rodzic/nauczyciel) — odróżnialny od narratora.
  // Fallback do narratora, jeśli nie ustawiony.
  mentor:   (process.env.ELEVENLABS_MENTOR_VOICE_ID || "").trim() || (process.env.ELEVENLABS_VOICE_ID || "").trim() || "XrYxa2QP5oFX1cg3JPdt",
  /**
   * Lisek — bohater, którym gra dziecko. Mówi tylko tam, gdzie zaprasza do
   * wspólnego działania (Porada dnia i zaproszenie do Minigier), więc NIE ma fallbacku do
   * narratora: gdyby jego głos zniknął z konta, lepiej żeby zabrakło mowy,
   * niż żeby lisek nagle przemówił głosem narratorki i dziecko usłyszało,
   * że to jednak nie on.
   */
  lisek:    (process.env.ELEVENLABS_LISEK_VOICE_ID || "").trim() || "pXmYPDwdEllwGVxpqLZr",
};

/**
 * Klucz głosu → głos. Nazwy kluczy są historyczne (marcowe krainy prototypu V1,
 * usuniętego 17.09.2026), ale żywa gra dalej je wysyła jako „kto mówi":
 * `dolina_selfie` (TopBar, onboarding), `las_decyzji` (Wizkor),
 * `gora_podsumowania` (narratorka). Nie zmieniaj ich bez zmiany frontendu.
 * Nieznany klucz spada na narratorkę.
 */
const LAND_VOICES = {
  dolina_selfie:       "narrator",
  las_decyzji:         "mystical",
  // NARRATORKA, nie Wizkor. Ten klucz wysyła `PodsumowanieDnia` dla kroków
  // podpisanych `kto: "narratorka"` — a wskazywał na „mystical", czyli na
  // slot Wizkora. Dopóki oba slot-y miały ten sam identyfikator, nikt tego
  // nie słyszał; od chwili, gdy Wizkor dostaje swój głos, wieczorna narracja
  // mówiłaby jego głosem.
  gora_podsumowania:   "narrator",
  // Mentor (osobny ton)
  mentor:              "mentor",
  // Lisek — nie kraina, tylko postać; klucz działa tak samo, bo frontend
  // podaje `land` jako „kto to mówi", a nie „gdzie to się dzieje".
  lisek:               "lisek",
};

// ── Serwis TTS ───────────────────────────────────────────────────────


// ── Presety tonu narracji ─────────────────────────────────────────
// stability: 0=żywiołowy, 1=monotonny • style: 0=neutralny, 1=ekspresyjny
// similarity_boost: 0=swobodnie, 1=trzymaj się referencji
const TONE_PRESETS = {
  // stability • similarity • style • speed (0.7–1.2) • pauseBefore/After (ms) • inlineBreaths
  warm:        { stability: 0.55, similarity_boost: 0.78, style: 0.30, speed: 1.00, pauseBefore: 0,    pauseAfter: 200 },
  neutral:     { stability: 0.65, similarity_boost: 0.75, style: 0.15, speed: 1.00, pauseBefore: 0,    pauseAfter: 100 },
  mystery:     { stability: 0.45, similarity_boost: 0.80, style: 0.55, speed: 0.92, pauseBefore: 400,  pauseAfter: 300 },
  celebration: { stability: 0.35, similarity_boost: 0.75, style: 0.70, speed: 1.05, pauseBefore: 250,  pauseAfter: 100 },
  whisper:     { stability: 0.70, similarity_boost: 0.82, style: 0.20, speed: 0.90, pauseBefore: 200,  pauseAfter: 250 },
  calm:        { stability: 0.75, similarity_boost: 0.78, style: 0.10, speed: 0.95, pauseBefore: 100,  pauseAfter: 150 },
  // Lisek zapraszający do zabawy: żywo, ekspresyjnie i odrobinę szybciej niż
  // narrator — to kolega, który już się zerwał do biegu, a nie ktoś, kto
  // opowiada bajkę. Krótka pauza po zdaniu zostawia miejsce na decyzję.
  zabawa:      { stability: 0.40, similarity_boost: 0.75, style: 0.60, speed: 1.03, pauseBefore: 80,   pauseAfter: 180 },
};

/**
 * Polski wybor formy liczby mnogiej (1 / 2-4 / 5+ z odstepstwami dla 12-14 i 22-24...).
 *  pluralPL(1, "godzina","godziny","godzin") => "godzina"
 *  pluralPL(2, "godzina","godziny","godzin") => "godziny"
 *  pluralPL(5, "godzina","godziny","godzin") => "godzin"
 *  pluralPL(22,"godzina","godziny","godzin") => "godziny"
 */
function pluralPL(n, one, few, many) {
  const abs = Math.abs(Number(n));
  if (abs === 1) return one;
  const mod10 = abs % 10;
  const mod100 = abs % 100;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}

/**
 * Rozwija polskie skroty czasowe do pelnych slow z poprawna odmiana.
 *  "5h"      => "5 godzin"
 *  "2h"      => "2 godziny"
 *  "1h"      => "1 godzina"
 *  "4d"      => "4 dni"
 *  "1d"      => "1 dzien"
 *  "2d 5h"   => "2 dni 5 godzin"
 *  "30min"   => "30 minut"
 *  "5 tyg"   => "5 tygodni"
 *  "3 mies"  => "3 miesiace"
 * Granica slowa zapobiega kolizji ze "h2" / "5htm" itp.
 */
function expandPolishAbbreviations(text) {
  if (!text) return text;
  let t = text;
  // godziny
  t = t.replace(/\b(\d+)\s*h\b/gi, (_, n) => `${n} ${pluralPL(n, "godzina", "godziny", "godzin")}`);
  // dni (skrot "d" tylko jak osobny token, nie myl z "5d6h" — \b zalatwia sprawe)
  t = t.replace(/\b(\d+)\s*d\b/gi, (_, n) => `${n} ${pluralPL(n, "dzień", "dni", "dni")}`);
  // minuty
  t = t.replace(/\b(\d+)\s*min\b/gi, (_, n) => `${n} ${pluralPL(n, "minuta", "minuty", "minut")}`);
  // sekundy
  t = t.replace(/\b(\d+)\s*sek\b/gi, (_, n) => `${n} ${pluralPL(n, "sekunda", "sekundy", "sekund")}`);
  // tygodnie
  t = t.replace(/\b(\d+)\s*(?:tyg|tydz)\.?\b/gi, (_, n) => `${n} ${pluralPL(n, "tydzień", "tygodnie", "tygodni")}`);
  // miesiace
  t = t.replace(/\b(\d+)\s*(?:mies|msc)\.?\b/gi, (_, n) => `${n} ${pluralPL(n, "miesiąc", "miesiące", "miesięcy")}`);
  // lata
  t = t.replace(/\b(\d+)\s*l\b/gi, (_, n) => `${n} ${pluralPL(n, "rok", "lata", "lat")}`);
  return t;
}

/**
 * Przygotowuje tekst dla modelu.
 *
 * ŻADNA z pauz otaczających kwestię nie idzie do SSML-a — ani przed, ani po.
 *  - pauseAfter: trailing <break> w eleven_flash_v2_5 daje słyszalny urywek
 *    na końcu klipu (znany artefakt modelu).
 *  - pauseBefore: wiodący <break> to NIE cisza. Model zaczyna klip krótkim
 *    dźwiękiem, który dziecko słyszy jako wypowiedziane „o" przed kwestią
 *    Wizkora czy liska. Zmierzone na tym samym tekście i głosie:
 *       pauseBefore 400 → trzask w 0,000 s (−29 dB, 25 ms), mowa od 0,500 s
 *       pauseBefore 0   → cisza, mowa od 0,050 s, bez trzasku
 *    Obie pauzy odmierza klient (`ttsPlayer`), więc nagranie zawiera samą
 *    mowę — i dlatego to samo nagranie nadaje się do wgrania do projektu.
 *    Ile czekać przed startem, mówi nagłówek `X-Pauza-Przed` (`api/tts.js`).
 *  - inlinePauses: zamienia "…" na 600ms pauzę, "—" na 350ms (delikatnie).
 *    Te pauzy są W ŚRODKU wypowiedzi, więc artefakt ich nie dotyczy.
 *  - usuwa też trailing whitespace + dba o czyste zakończenie zdania
 */
function decorateText(text, opts = {}) {
  let t = String(text || "").trim();
  if (!t) return t;

  if (opts.inlinePauses) {
    t = t
      .replace(/…/g, ' <break time="0.6s" /> ')
      .replace(/—/g, ' <break time="0.35s" /> ')
      .replace(/\.\.\./g, ' <break time="0.6s" /> ');
  }

  // Wytnij ewentualne tagi break na samym końcu (gdyby ktoś dał "…" jako ostatni znak)
  t = t.replace(/(\s*<break\s+time="[^"]+"\s*\/?>\s*)+$/gi, "");
  t = t.trim();

  // Upewnij się że jest jakiś znak interpunkcyjny na końcu — model lepiej kończy frazę
  if (!/[.!?…]$/.test(t)) {
    t = t + ".";
  }

  // pauseBefore ani pauseAfter nie trafiają do tekstu — patrz opis wyżej.

  return t;
}

/**
 * Ile ciszy należy się PRZED tą kwestią (ms). Liczone tu, bo presety tonów
 * mieszkają w tym pliku, a odmierza to klient — dlatego trasa wysyła wynik
 * w nagłówku zamiast wklejać pauzę w nagranie.
 */
export function pauzaPrzed(options = {}) {
  const preset = TONE_PRESETS[options.tone] || TONE_PRESETS.warm;
  const ms = Number(options.pauseBefore ?? preset.pauseBefore ?? 0);
  return Math.max(0, Math.min(3000, Number.isFinite(ms) ? ms : 0));
}

/**
 * Klucz cache'u. Musi zależeć od WSZYSTKIEGO, co zmienia dźwięk:
 *  - skrót CAŁEGO tekstu (dawniej pierwsze 100 znaków — porady dnia potrafią
 *    mieć wspólny początek i różnić się dopiero ostatnim zdaniem, więc
 *    dziecko dostawało nagranie innej porady),
 *  - głos,
 *  - ustawienia głosu, czyli w praktyce ton: `mystery` i `warm` tej samej
 *    kwestii miały do tej pory jeden klucz i drugi ton nigdy nie wychodził
 *    z serwera.
 * Pauzy do klucza nie wchodzą, bo nie ma ich już w nagraniu.
 */
function kluczCache(tekst, voiceId, ust) {
  const skrot = createHash("sha1").update(tekst, "utf8").digest("hex").slice(0, 16);
  return [skrot, voiceId, ust.stability, ust.similarity_boost, ust.style, ust.speed].join("_");
}

const ELEVENLABS_API = "https://api.elevenlabs.io/v1/text-to-speech";

export class TTSService {
  constructor() {
    // .trim() na wszystkim — chroni przed śmieciami w env vars (np. \r\n, spacje)
    this.apiKey = (process.env.ELEVENLABS_API_KEY || "").trim();
    this.model = (process.env.ELEVENLABS_MODEL || "eleven_flash_v2_5").trim();
    this.defaultVoice = (process.env.ELEVENLABS_VOICE_ID || VOICES.narrator).trim();
    this._cache = new Map();       // prosty cache: hash(text) → Buffer
    this._cacheMaxSize = 100;
  }

  /** Czy serwis jest skonfigurowany */
  get isAvailable() {
    return !!this.apiKey;
  }

  /** Pobierz voice_id dla klucza głosu (patrz `LAND_VOICES`) */
  getVoiceForLand(landName) {
    const voiceKey = LAND_VOICES[landName] || "narrator";
    return VOICES[voiceKey] || this.defaultVoice;
  }

  /**
   * Generuj mowę z tekstu
   * @param {string} text — tekst do odczytania
   * @param {object} options
   * @param {string} options.voiceId — ID głosu (domyślnie narrator)
   * @param {string} options.land — klucz głosu z `LAND_VOICES` (automatycznie dobiera głos)
   * @param {number} options.stability — stabilność głosu 0-1 (domyślnie 0.5)
   * @param {number} options.similarityBoost — podobieństwo 0-1 (domyślnie 0.75)
   * @returns {Promise<Buffer>} audio MP3
   */
  async synthesize(text, options = {}) {
    if (!this.apiKey) {
      throw new Error("ELEVENLABS_API_KEY not configured");
    }

    if (!text || text.trim().length === 0) {
      throw new Error("Empty text");
    }

    // Ogranicz długość tekstu (ElevenLabs limit: ~5000 znaków)
    // + rozwin polskie skroty czasowe ("2h" -> "2 godziny", "4d" -> "4 dni" itd.)
    const cleanText = expandPolishAbbreviations(
      text.replace(/<[^>]*>/g, "").trim()
    ).slice(0, 4500);

    // Wybierz głos
    const voiceId = options.voiceId || (options.land ? this.getVoiceForLand(options.land) : this.defaultVoice);

    // Tone preset (warm/mystery/celebration/whisper/calm/neutral) lub explicit values
    const preset = TONE_PRESETS[options.tone] || TONE_PRESETS.warm;

    const decorated = decorateText(cleanText, {
      inlinePauses: options.inlinePauses ?? false,
    });

    const voice_settings = {
      stability: options.stability ?? preset.stability,
      similarity_boost: options.similarityBoost ?? preset.similarity_boost,
      style: options.style ?? preset.style,
      speed: options.speed ?? preset.speed ?? 1.0,
      use_speaker_boost: true,
    };

    // Cache dopiero TU: klucz liczymy z gotowego tekstu i ustawień głosu,
    // więc `inlinePauses` i ton same się w nim znajdują.
    const cacheKey = kluczCache(decorated, voiceId, voice_settings);
    if (this._cache.has(cacheKey)) {
      return this._cache.get(cacheKey);
    }

    const body = {
      text: decorated,
      model_id: this.model,
      voice_settings,
    };

    const res = await fetch(`${ELEVENLABS_API}/${voiceId}`, {
      method: "POST",
      headers: {
        "xi-api-key": this.apiKey,
        "Content-Type": "application/json",
        "Accept": "audio/mpeg",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.text().catch(() => "");
      throw new Error(`ElevenLabs API ${res.status}: ${err.substring(0, 300)}`);
    }

    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Cache (LRU-like)
    if (this._cache.size >= this._cacheMaxSize) {
      const firstKey = this._cache.keys().next().value;
      this._cache.delete(firstKey);
    }
    this._cache.set(cacheKey, buffer);

    return buffer;
  }

  /** Wyczysc cache */
  clearCache() {
    this._cache.clear();
  }

  /**
   * Info o serwisie. `glosy` mówi, która postać ma NAPRAWDĘ swój głos, a która
   * spadła na narratorkę — bez tego „czemu wszyscy mówią tym samym głosem"
   * trzeba diagnozować czytaniem kodu i zmiennych środowiskowych na serwerze.
   */
  getInfo() {
    const n = VOICES.narrator;
    const czyj = (id) => (id === n ? "narrator (fallback)" : "własny");
    return {
      available: this.isAvailable,
      model: this.model,
      defaultVoice: this.defaultVoice,
      cacheSize: this._cache.size,
      glosy: {
        narrator: "własny",
        wizkor: czyj(VOICES.mystical),
        lisek: czyj(VOICES.lisek),
        mentor: czyj(VOICES.mentor),
      },
    };
  }
}

// Singleton
export const ttsService = new TTSService();
