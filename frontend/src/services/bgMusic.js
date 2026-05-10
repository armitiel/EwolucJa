/**
 * bgMusic — muzyka w tle (lokalny plik MP3 z public/).
 * Wymaga gestu użytkownika do odtworzenia (autoplay policy przeglądarki).
 * Współpracuje z ttsPlayer: gdy lektor mówi, muzyka cichnie (duck), potem wraca.
 */

const DEFAULT_TRACK = "/Mindful_Forest_Path.mp3";
const STORAGE_KEY = "ewolucja.bgmusic";

class BgMusic {
  constructor() {
    this._audio = null;
    this._enabled = this._readEnabled();
    this._volume = 0.25;        // 25% domyślnie
    this._duckedVolume = 0.05;  // gdy TTS mówi
    this._target = this._volume;
    this._fadeTimer = null;
    this._unlocked = false;
    this._track = DEFAULT_TRACK;
    this._installAutoUnlock();
  }

  _readEnabled() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw === null ? true : raw === "1";
    } catch {
      return true;
    }
  }

  _writeEnabled(v) {
    try { localStorage.setItem(STORAGE_KEY, v ? "1" : "0"); } catch {}
  }

  _installAutoUnlock() {
    if (typeof window === "undefined" || this._unlockInstalled) return;
    this._unlockInstalled = true;
    const handler = () => {
      if (this._unlocked) return;
      this._unlocked = true;
      if (this._enabled) this._start();
      window.removeEventListener("click", handler, true);
      window.removeEventListener("touchstart", handler, true);
      window.removeEventListener("keydown", handler, true);
      window.removeEventListener("pointerdown", handler, true);
    };
    window.addEventListener("click", handler, true);
    window.addEventListener("touchstart", handler, { capture: true, passive: true });
    window.addEventListener("keydown", handler, true);
    window.addEventListener("pointerdown", handler, true);
  }

  _ensureAudio() {
    if (this._audio) return this._audio;
    const a = new Audio(this._track);
    a.loop = true;
    a.volume = 0;
    a.preload = "auto";
    this._audio = a;
    return a;
  }

  _fade(toVolume, durationMs = 1200) {
    if (!this._audio) return;
    if (this._fadeTimer) clearInterval(this._fadeTimer);
    const from = this._audio.volume;
    const steps = Math.max(1, Math.floor(durationMs / 50));
    const delta = (toVolume - from) / steps;
    let step = 0;
    this._fadeTimer = setInterval(() => {
      step++;
      const next = from + delta * step;
      if (this._audio) this._audio.volume = Math.max(0, Math.min(1, next));
      if (step >= steps) {
        clearInterval(this._fadeTimer);
        this._fadeTimer = null;
      }
    }, 50);
  }

  _start() {
    const a = this._ensureAudio();
    a.play()
      .then(() => this._fade(this._target, 1500))
      .catch((e) => console.warn("[bgMusic] play blocked:", e.message));
  }

  /** Włącz lub wyłącz (zapamiętane w localStorage). */
  setEnabled(v) {
    this._enabled = !!v;
    this._writeEnabled(this._enabled);
    if (this._enabled) {
      if (this._unlocked) this._start();
    } else {
      this._fade(0, 600);
      setTimeout(() => { if (this._audio) this._audio.pause(); }, 700);
    }
  }

  toggle() { this.setEnabled(!this._enabled); return this._enabled; }
  isEnabled() { return this._enabled; }

  /** Ustawia głośność (0-1). */
  setVolume(v) {
    this._volume = Math.max(0, Math.min(1, v));
    this._target = this._volume;
    if (this._audio && this._enabled) this._fade(this._volume, 400);
  }

  /** Ducking: ścisz, gdy lektor mówi. Wywołuje TTS player. */
  duck() {
    if (!this._enabled || !this._audio) return;
    this._fade(this._duckedVolume, 250);
  }

  /** Przywrócenie głośności po końcu lektora. */
  unduck() {
    if (!this._enabled || !this._audio) return;
    this._fade(this._volume, 700);
  }

  /** Zmiana utworu (opcjonalnie). */
  setTrack(url) {
    this._track = url;
    if (this._audio) {
      const wasPlaying = !this._audio.paused;
      this._audio.src = url;
      if (wasPlaying && this._enabled) this._start();
    }
  }
}

const bgMusic = new BgMusic();
export default bgMusic;
