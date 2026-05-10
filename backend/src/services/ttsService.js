/**
 * ElevenLabs TTS Service — Głos narratora GAMA-1
 *
 * Konwertuje tekst narracji na mowę za pomocą ElevenLabs API.
 * Zwraca audio jako Buffer (mp3) do strumieniowania przez Express.
 *
 * Endpoint: POST https://api.elevenlabs.io/v1/text-to-speech/{voice_id}
 */

// ── Konfiguracja głosów ──────────────────────────────────────────────

const VOICES = {
  // Głosy ElevenLabs — ID mogą się zmieniać, sprawdź w panelu.
  // Narrator GAMA-1 (kobiecy, ciepły, lekko tajemniczy)
  narrator: (process.env.ELEVENLABS_VOICE_ID || "").trim() || "XrYxa2QP5oFX1cg3JPdt",
  mystical: (process.env.ELEVENLABS_VOICE_ID || "").trim() || "XrYxa2QP5oFX1cg3JPdt",
  excited:  (process.env.ELEVENLABS_VOICE_ID || "").trim() || "XrYxa2QP5oFX1cg3JPdt",
  // Głos Mentora (rodzic/nauczyciel) — odróżnialny od narratora.
  // Fallback do narratora, jeśli nie ustawiony.
  mentor:   (process.env.ELEVENLABS_MENTOR_VOICE_ID || "").trim() || (process.env.ELEVENLABS_VOICE_ID || "").trim() || "XrYxa2QP5oFX1cg3JPdt",
};

const LAND_VOICES = {
  dolina_selfie:       "narrator",
  las_decyzji:         "mystical",
  jaskinia_emocji:     "narrator",
  wyspa_talentow:      "excited",
  przystan_wspolpracy: "narrator",
  gora_podsumowania:   "mystical",
  // V2 — rozdziały spójnego świata
  wezwanie_kroniki:    "mystical",
  // Mentor (osobny ton)
  mentor:              "mentor",
};

// ── Serwis TTS ───────────────────────────────────────────────────────


// ── Presety tonu narracji ─────────────────────────────────────────
// stability: 0=żywiołowy, 1=monotonny • style: 0=neutralny, 1=ekspresyjny
// similarity_boost: 0=swobodnie, 1=trzymaj się referencji
const TONE_PRESETS = {
  warm:        { stability: 0.55, similarity_boost: 0.78, style: 0.30 },  // domyślnie ciepły
  neutral:     { stability: 0.65, similarity_boost: 0.75, style: 0.15 },  // pytania quizu, instrukcje
  mystery:     { stability: 0.45, similarity_boost: 0.80, style: 0.55 },  // otwieranie zwoju, intro misji
  celebration: { stability: 0.35, similarity_boost: 0.75, style: 0.70 },  // reward, reveal archetypu
  whisper:     { stability: 0.70, similarity_boost: 0.82, style: 0.20 },  // szept Mentora
  calm:        { stability: 0.75, similarity_boost: 0.78, style: 0.10 },  // panel Mentora
};

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

  /** Pobierz voice_id dla danej krainy */
  getVoiceForLand(landName) {
    const voiceKey = LAND_VOICES[landName] || "narrator";
    return VOICES[voiceKey] || this.defaultVoice;
  }

  /**
   * Generuj mowę z tekstu
   * @param {string} text — tekst do odczytania
   * @param {object} options
   * @param {string} options.voiceId — ID głosu (domyślnie narrator)
   * @param {string} options.land — nazwa krainy (automatycznie dobiera głos)
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
    const cleanText = text.replace(/<[^>]*>/g, "").trim().slice(0, 4500);

    // Cache check
    const cacheKey = `${cleanText.slice(0, 100)}_${options.voiceId || options.land || "default"}`;
    if (this._cache.has(cacheKey)) {
      return this._cache.get(cacheKey);
    }

    // Wybierz głos
    const voiceId = options.voiceId || (options.land ? this.getVoiceForLand(options.land) : this.defaultVoice);

    // Tone preset (warm/mystery/celebration/whisper/calm/neutral) lub explicit values
    const preset = TONE_PRESETS[options.tone] || TONE_PRESETS.warm;
    const body = {
      text: cleanText,
      model_id: this.model,
      voice_settings: {
        stability: options.stability ?? preset.stability,
        similarity_boost: options.similarityBoost ?? preset.similarity_boost,
        style: options.style ?? preset.style,
        use_speaker_boost: true,
      },
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

  /** Wyczyść cache */
  clearCache() {
    this._cache.clear();
  }

  /** Info o serwisie */
  getInfo() {
    return {
      available: this.isAvailable,
      model: this.model,
      defaultVoice: this.defaultVoice,
      cacheSize: this._cache.size,
    };
  }
}

// Singleton
export const ttsService = new TTSService();
