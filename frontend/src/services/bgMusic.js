/**
 * bgMusic — muzyka w tle (lokalny plik MP3 z public/).
 * Wymaga gestu użytkownika do odtworzenia (autoplay policy przeglądarki).
 * Współpracuje z ttsPlayer: gdy lektor mówi, muzyka cichnie (duck), potem wraca.
 *
 * KRYTYCZNE: używa Web Audio API (AudioContext + GainNode) bo na iOS Safari
 * `audio.volume` jest read-only (system zawsze gra na pełnej głośności).
 * GainNode obchodzi to ograniczenie — działa na wszystkich platformach.
 *
 * Ref-counting na duck/unduck: wiele "graczy" (TTS, MissionView, PoradyPage)
 * może prosić o ducking. Music wraca dopiero gdy WSZYSCY puszcza.
 */

const DEFAULT_TRACK = "/Mindful_Forest_Path.mp3";
const STORAGE_KEY = "ewolucja.bgmusic";

class BgMusic {
  constructor() {
    this._audio = null;
    this._ctx = null;            // AudioContext
    this._source = null;         // MediaElementAudioSourceNode (jednorazowy per audio element!)
    this._gain = null;           // GainNode — TYM sterujemy zamiast audio.volume
    this._enabled = this._readEnabled();
    this._volume = 0.25;         // 25% domyślnie
    this._duckedVolume = 0.05;   // 5% — gdy TTS mówi LUB strona prosi (np. /mission, /porady)
    this._target = this._volume;
    this._unlocked = false;
    this._track = DEFAULT_TRACK;
    this._duckRequests = 0;
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
    a.crossOrigin = "anonymous"; // wymagane dla Web Audio jesli serwer ustawia CORS
    a.volume = 1;                // zostawiamy 1 — gloscia steruje GainNode
    a.preload = "auto";
    this._audio = a;
    return a;
  }

  /** Buduje graf Web Audio: <audio> → source → gain → destination. */
  _ensureAudioGraph() {
    if (this._ctx) return true;
    if (!this._audio) return false;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false; // Web Audio nie wspierany (bardzo stare przegladarki)
      this._ctx = new AC();
      this._source = this._ctx.createMediaElementSource(this._audio);
      this._gain = this._ctx.createGain();
      this._gain.gain.value = 0; // start cicho, _fade go podniesie
      this._source.connect(this._gain).connect(this._ctx.destination);
      return true;
    } catch (e) {
      console.warn("[bgMusic] Web Audio init failed:", e?.message);
      this._ctx = null;
      this._source = null;
      this._gain = null;
      return false;
    }
  }

  /** Fade gain od obecnej wartosci do target w durationMs (linear ramp). */
  _fade(toVolume, durationMs = 1200) {
    const target = Math.max(0, Math.min(1, toVolume));
    if (this._gain && this._ctx) {
      const t = this._ctx.currentTime;
      const dur = Math.max(0.01, durationMs / 1000);
      try {
        this._gain.gain.cancelScheduledValues(t);
        this._gain.gain.setValueAtTime(this._gain.gain.value, t);
        this._gain.gain.linearRampToValueAtTime(target, t + dur);
      } catch (e) {
        // fallback: instant set
        try { this._gain.gain.value = target; } catch {}
      }
      return;
    }
    // Fallback (brak Web Audio): zmiana audio.volume krok po kroku (dziala na desktop)
    if (this._audio) {
      const from = this._audio.volume;
      const steps = Math.max(1, Math.floor(durationMs / 50));
      const delta = (target - from) / steps;
      let step = 0;
      if (this._fadeTimer) clearInterval(this._fadeTimer);
      this._fadeTimer = setInterval(() => {
        step++;
        try { this._audio.volume = Math.max(0, Math.min(1, from + delta * step)); } catch {}
        if (step >= steps) { clearInterval(this._fadeTimer); this._fadeTimer = null; }
      }, 50);
    }
  }

  _start() {
    const a = this._ensureAudio();
    a.play()
      .then(() => {
        // Buduj graf Web Audio dopiero PO play() — musi byc w gestcie usera.
        this._ensureAudioGraph();
        // Resume AudioContext jezeli suspended (iOS Safari domyslnie suspended).
        if (this._ctx && this._ctx.state === "suspended") {
          try { this._ctx.resume(); } catch {}
        }
        // Jesli ktos juz prosil o duck (np. user wszedl na /mission przed unlockiem),
        // zacznij od duckedVolume.
        const target = this._duckRequests > 0 ? this._duckedVolume : this._target;
        this._fade(target, 1500);
      })
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

  /** Ustawia głośność bazową (0-1). Nie wplywa na ducking. */
  setVolume(v) {
    this._volume = Math.max(0, Math.min(1, v));
    this._target = this._volume;
    if (this._enabled && (this._gain || this._audio)) {
      const target = this._duckRequests > 0 ? this._duckedVolume : this._volume;
      this._fade(target, 400);
    }
  }

  /** Ducking: ścisz do 5%, gdy lektor mówi LUB strona prosi. Ref-counted. */
  duck() {
    this._duckRequests++;
    if (!this._enabled) return;
    // Resume context jezeli suspended (np. iOS Safari po przerwie)
    if (this._ctx && this._ctx.state === "suspended") {
      try { this._ctx.resume(); } catch {}
    }
    this._fade(this._duckedVolume, 250);
  }

  /** Zwolnienie żądania ducking. Music wraca dopiero gdy nikt już nie prosi. */
  unduck() {
    this._duckRequests = Math.max(0, this._duckRequests - 1);
    if (!this._enabled) return;
    if (this._duckRequests === 0) {
      this._fade(this._volume, 700);
    }
    // jezeli jeszcze ktos prosi (np. /mission), zostaw ducked
  }

  /** Zmiana utworu. UWAGA: MediaElementAudioSource nie da sie podpiac drugi raz —
   *  trzeba zrobic nowy <audio> i nowy source. */
  setTrack(url) {
    this._track = url;
    if (this._audio) {
      // Tear down audio graph (zachowamy _ctx)
      try { this._audio.pause(); } catch {}
      try { if (this._source) this._source.disconnect(); } catch {}
      try { if (this._gain) this._gain.disconnect(); } catch {}
      this._audio = null;
      this._source = null;
      this._gain = null;
      if (this._enabled && this._unlocked) this._start();
    }
  }
}

const bgMusic = new BgMusic();
export default bgMusic;

// Hook DevTools w window dla debugowania na produkcji:
//   window.bgMusic.duck() / unduck() / setVolume(0.5)
if (typeof window !== "undefined") {
  window.bgMusic = bgMusic;
}
