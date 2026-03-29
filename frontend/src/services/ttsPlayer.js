/**
 * EwolucJA — TTS Player (Frontend)
 *
 * Odtwarza narrację głosem GAMA-1 przez ElevenLabs API.
 * Obsługuje autoplay z obejściem browser autoplay policy.
 *
 * Użycie:
 *   import { ttsPlayer } from "../services/ttsPlayer";
 *   ttsPlayer.unlock();  // po pierwszym kliknięciu użytkownika
 *   await ttsPlayer.speak("Witaj!", { land: "dolina_selfie" });
 */

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

class TTSPlayer {
  constructor() {
    this._audio = null;
    this._playing = false;
    this._enabled = true;
    this._volume = 0.8;
    this._cache = new Map();
    this._unlocked = false;     // czy browser pozwala na autoplay
    this._pendingText = null;   // tekst czekający na odblokowanie
    this._pendingOpts = null;
  }

  get enabled() { return this._enabled; }
  set enabled(val) {
    this._enabled = val;
    if (!val) this.stop();
  }

  get volume() { return this._volume; }
  set volume(val) {
    this._volume = Math.max(0, Math.min(1, val));
    if (this._audio) this._audio.volume = this._volume;
  }

  get isPlaying() { return this._playing; }
  get isUnlocked() { return this._unlocked; }

  /**
   * Odblokuj autoplay — wywołaj po KAŻDYM kliknięciu użytkownika.
   * Przeglądarki wymagają user gesture przed odtworzeniem audio.
   * Jeśli jest pending tekst, odtworzy go natychmiast.
   */
  unlock() {
    if (this._unlocked) return;

    // Stwórz cichy audio context żeby odblokować
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const buf = ctx.createBuffer(1, 1, 22050);
      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.connect(ctx.destination);
      src.start(0);
      this._unlocked = true;

      // Odtwórz pending tekst
      if (this._pendingText) {
        const text = this._pendingText;
        const opts = this._pendingOpts;
        this._pendingText = null;
        this._pendingOpts = null;
        this.speak(text, opts);
      }
    } catch (e) {
      // Fallback — oznacz jako odblokowany i tak
      this._unlocked = true;
    }
  }

  /**
   * Wypowiedz tekst głosem narratora
   */
  async speak(text, options = {}) {
    if (!this._enabled || !text) return;

    const { land, voiceId, interrupt = true } = options;

    // Jeśli browser nie odblokowany — zapamiętaj i czekaj
    if (!this._unlocked) {
      this._pendingText = text;
      this._pendingOpts = options;
      return;
    }

    if (interrupt && this._playing) {
      this.stop();
    }

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

        if (this._cache.size >= 50) {
          const firstKey = this._cache.keys().next().value;
          URL.revokeObjectURL(this._cache.get(firstKey));
          this._cache.delete(firstKey);
        }
        this._cache.set(cacheKey, audioUrl);
      }

      return this._play(audioUrl);
    } catch (err) {
      console.warn("[TTS] Error:", err.message);
    }
  }

  /**
   * Prefetch — ściągnij audio w tle, żeby potem odtworzyć natychmiast
   */
  async prefetch(text, options = {}) {
    if (!this._enabled || !text) return;
    const { land, voiceId } = options;
    const cacheKey = `${text.slice(0, 80)}_${land || voiceId || "d"}`;

    if (this._cache.has(cacheKey)) return; // już w cache

    try {
      const res = await fetch(`${API_BASE}/api/tts/speak`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, land, voiceId }),
      });
      if (!res.ok) return;
      const blob = await res.blob();
      const audioUrl = URL.createObjectURL(blob);

      if (this._cache.size >= 50) {
        const firstKey = this._cache.keys().next().value;
        URL.revokeObjectURL(this._cache.get(firstKey));
        this._cache.delete(firstKey);
      }
      this._cache.set(cacheKey, audioUrl);
    } catch {}
  }

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

  stop() {
    if (this._audio) {
      this._audio.pause();
      this._audio.currentTime = 0;
      this._audio = null;
    }
    this._playing = false;
  }

  togglePause() {
    if (!this._audio) return;
    if (this._audio.paused) this._audio.play();
    else this._audio.pause();
  }

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

  clearCache() {
    for (const url of this._cache.values()) URL.revokeObjectURL(url);
    this._cache.clear();
  }
}

export const ttsPlayer = new TTSPlayer();
