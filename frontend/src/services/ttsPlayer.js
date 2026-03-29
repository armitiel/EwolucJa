/**
 * EwolucJA — TTS Player (Frontend)
 *
 * Odtwarza narrację głosem GAMA-1 przez ElevenLabs API.
 * Komunikuje się z backendem POST /api/tts/speak.
 *
 * Użycie w komponencie:
 *   import { ttsPlayer } from "../services/ttsPlayer";
 *   await ttsPlayer.speak("Witaj w Dolinie Selfie!", { land: "dolina_selfie" });
 *   ttsPlayer.stop();
 */

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

class TTSPlayer {
  constructor() {
    this._audio = null;
    this._playing = false;
    this._enabled = true;       // gracz może wyłączyć głos
    this._volume = 0.8;
    this._cache = new Map();    // url cache
    this._queue = [];
  }

  /** Czy TTS jest włączony */
  get enabled() { return this._enabled; }
  set enabled(val) {
    this._enabled = val;
    if (!val) this.stop();
  }

  /** Głośność (0-1) */
  get volume() { return this._volume; }
  set volume(val) {
    this._volume = Math.max(0, Math.min(1, val));
    if (this._audio) this._audio.volume = this._volume;
  }

  /** Czy aktualnie odtwarza */
  get isPlaying() { return this._playing; }

  /**
   * Wypowiedz tekst głosem narratora
   * @param {string} text — tekst do wypowiedzenia
   * @param {object} options
   * @param {string} options.land — kraina (dobiera głos)
   * @param {string} options.voiceId — konkretny voice_id
   * @param {boolean} options.interrupt — przerwij aktualny (domyślnie true)
   * @returns {Promise<void>}
   */
  async speak(text, options = {}) {
    if (!this._enabled || !text) return;

    const { land, voiceId, interrupt = true } = options;

    if (interrupt && this._playing) {
      this.stop();
    }

    // Cache key
    const cacheKey = `${text.slice(0, 80)}_${land || voiceId || "d"}`;

    try {
      let audioUrl = this._cache.get(cacheKey);

      if (!audioUrl) {
        const res = await fetch(`${API_BASE}/api/tts/speak`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, land, voiceId }),
        });

        if (!res.ok) {
          console.warn("[TTS] API error:", res.status);
          return;
        }

        const blob = await res.blob();
        audioUrl = URL.createObjectURL(blob);

        // Cache (max 50 entries)
        if (this._cache.size >= 50) {
          const firstKey = this._cache.keys().next().value;
          const firstUrl = this._cache.get(firstKey);
          URL.revokeObjectURL(firstUrl);
          this._cache.delete(firstKey);
        }
        this._cache.set(cacheKey, audioUrl);
      }

      return this._play(audioUrl);
    } catch (err) {
      console.warn("[TTS] Error:", err.message);
    }
  }

  /** Odtwórz z URL */
  _play(url) {
    return new Promise((resolve) => {
      this._audio = new Audio(url);
      this._audio.volume = this._volume;
      this._playing = true;

      this._audio.onended = () => {
        this._playing = false;
        resolve();
      };

      this._audio.onerror = () => {
        this._playing = false;
        resolve();
      };

      this._audio.play().catch(() => {
        this._playing = false;
        resolve();
      });
    });
  }

  /** Zatrzymaj odtwarzanie */
  stop() {
    if (this._audio) {
      this._audio.pause();
      this._audio.currentTime = 0;
      this._audio = null;
    }
    this._playing = false;
  }

  /** Pauza / wznów */
  togglePause() {
    if (!this._audio) return;
    if (this._audio.paused) {
      this._audio.play();
    } else {
      this._audio.pause();
    }
  }

  /** Sprawdź czy backend TTS jest dostępny */
  async checkAvailability() {
    try {
      const res = await fetch(`${API_BASE}/api/tts/status`);
      if (!res.ok) return false;
      const data = await res.json();
      return data.available === true;
    } catch {
      return false;
    }
  }

  /** Wyczyść cache audio */
  clearCache() {
    for (const url of this._cache.values()) {
      URL.revokeObjectURL(url);
    }
    this._cache.clear();
  }
}

export const ttsPlayer = new TTSPlayer();
