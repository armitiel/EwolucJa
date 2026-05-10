/**
 * EwolucJA — TTS Player (Frontend)
 * Odtwarza narrację głosem GAMA-1 przez ElevenLabs API.
 * Fallback na Web Speech API gdy ElevenLabs niedostępny.
 * iOS Safari compatible — persistent Audio element + global auto-unlock.
 */

import bgMusic from "./bgMusic.js";

const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "" : "http://localhost:3001");

class TTSPlayer {
  constructor() {
    this._audio = null;
    this._playing = false;
    this._enabled = true;
    this._volume = 0.52; // 0.8 - 35% (cichszy lektor wzgledem muzyki w tle)
    this._cache = new Map();
    this._unlocked = false;
    this._pendingText = null;
    this._pendingOpts = null;
    this._elevenLabsAvailable = null;
    this._useFallback = false;
    this._audioCtx = null;
    this._autoUnlockInstalled = false;

    this._checkElevenLabs();
    this._installAutoUnlock();
  }

  _installAutoUnlock() {
    if (this._autoUnlockInstalled || typeof window === "undefined") return;
    this._autoUnlockInstalled = true;

    const handler = () => {
      if (!this._unlocked) this.unlock();
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

  async _checkElevenLabs() {
    try {
      const res = await fetch(`${API_BASE}/api/tts/status`, { signal: AbortSignal.timeout(3000) });
      if (!res.ok) { this._elevenLabsAvailable = false; this._useFallback = true; return; }
      const data = await res.json();
      this._elevenLabsAvailable = data.available === true;
      this._useFallback = !this._elevenLabsAvailable;
      console.log(`[TTS] ElevenLabs: ${this._elevenLabsAvailable ? "dostępny" : "niedostępny, fallback → Web Speech API"}`);
    } catch {
      this._elevenLabsAvailable = false;
      this._useFallback = true;
      console.log("[TTS] Backend niedostępny, fallback → Web Speech API");
    }
  }

  unlock() {
    if (this._unlocked) return;
    try {
      this._audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (this._audioCtx.state === "suspended") this._audioCtx.resume();
      const buf = this._audioCtx.createBuffer(1, 1, 22050);
      const src = this._audioCtx.createBufferSource();
      src.buffer = buf;
      src.connect(this._audioCtx.destination);
      src.start(0);

      if (!this._audio) {
        this._audio = new Audio();
        this._audio.volume = this._volume;
        this._audio.src = "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAABhgC7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAAYYAAAAAAAAAAAAAAAAA";
        this._audio.play().then(() => {
          this._audio.pause();
          this._audio.currentTime = 0;
        }).catch(() => {});
      }

      this._unlocked = true;
      console.log("[TTS] Odblokowano audio");

      if (this._pendingText) {
        const text = this._pendingText;
        const opts = this._pendingOpts;
        this._pendingText = null;
        this._pendingOpts = null;
        this.speak(text, opts);
      }
    } catch (e) {
      this._unlocked = true;
      console.warn("[TTS] Unlock fallback:", e.message);
    }
  }

  async speak(text, options = {}) {
    if (!this._enabled || !text) return;
    const { land, voiceId, tone, speed, pauseBefore, pauseAfter, inlinePauses, interrupt = true } = options;

    if (!this._unlocked) {
      this._pendingText = text;
      this._pendingOpts = options;
      return;
    }

    if (interrupt && this._playing) this.stop();

    if (this._useFallback || this._elevenLabsAvailable === false) {
      return this._speakFallback(text);
    }

    const cacheKey = `v2_${text.slice(0, 80)}_${land || voiceId || "d"}_${tone || ""}_${speed || ""}_${pauseBefore||""}_${pauseAfter||""}_${inlinePauses?"i":""}`;

    try {
      let audioUrl = this._cache.get(cacheKey);

      if (!audioUrl) {
        const res = await fetch(`${API_BASE}/api/tts/speak`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, land, voiceId, tone, speed, pauseBefore, pauseAfter, inlinePauses }),
        });

        if (!res.ok) {
          console.warn("[TTS] ElevenLabs error, fallback:", res.status);
          return this._speakFallback(text);
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
      console.warn("[TTS] Network error, fallback:", err.message);
      return this._speakFallback(text);
    }
  }

  async prefetch(text, options = {}) {
    if (!this._enabled || !text || this._useFallback) return;
    const { land, voiceId, tone, speed, pauseBefore, pauseAfter, inlinePauses } = options;
    const cacheKey = `v2_${text.slice(0, 80)}_${land || voiceId || "d"}_${tone || ""}_${speed || ""}_${pauseBefore||""}_${pauseAfter||""}_${inlinePauses?"i":""}`;
    if (this._cache.has(cacheKey)) return;
    try {
      const res = await fetch(`${API_BASE}/api/tts/speak`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, land, voiceId, tone, speed, pauseBefore, pauseAfter, inlinePauses }),
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
      if (!this._audio) this._audio = new Audio();
      this._audio.volume = this._volume;
      this._audio.src = url;
      this._playing = true;
      let fadeTimer = null;
      let endedHandled = false;
      try { bgMusic.duck(); } catch {}

      const cleanup = () => {
        if (endedHandled) return;
        endedHandled = true;
        if (fadeTimer) clearInterval(fadeTimer);
        this._playing = false;
        try { bgMusic.unduck(); } catch {}
        resolve();
      };

      // Fade-out ostatnich ~250ms żeby ukryć ewentualny artefakt klikającego końcówki
      const onTimeUpdate = () => {
        if (!this._audio || endedHandled) return;
        const dur = this._audio.duration;
        const t = this._audio.currentTime;
        if (!isFinite(dur) || dur <= 0) return;
        const remaining = dur - t;
        if (remaining < 0.25 && !fadeTimer) {
          const startVol = this._audio.volume;
          const steps = 8;
          const dt = Math.max(20, (remaining * 1000) / steps);
          let i = 0;
          fadeTimer = setInterval(() => {
            i++;
            if (!this._audio) { clearInterval(fadeTimer); fadeTimer = null; return; }
            this._audio.volume = Math.max(0, startVol * (1 - i / steps));
            if (i >= steps) { clearInterval(fadeTimer); fadeTimer = null; }
          }, dt);
        }
      };

      this._audio.ontimeupdate = onTimeUpdate;
      this._audio.onended = cleanup;
      this._audio.onerror = cleanup;
      this._audio.play().catch((err) => {
        console.warn("[TTS] Play error:", err.message);
        cleanup();
        this._speakFallback(url).then(resolve);
      });
    });
  }

  _speakFallback(text) {
    return new Promise((resolve) => {
      if (!window.speechSynthesis) { resolve(); return; }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "pl-PL";
      utterance.rate = 0.95;
      utterance.pitch = 1.05;
      utterance.volume = this._volume;
      const voices = window.speechSynthesis.getVoices();
      const polishVoice = voices.find((v) => v.lang.startsWith("pl")) || voices[0];
      if (polishVoice) utterance.voice = polishVoice;
      this._playing = true;
      this._currentUtterance = utterance;
      utterance.onend = () => { this._playing = false; this._currentUtterance = null; resolve(); };
      utterance.onerror = () => { this._playing = false; this._currentUtterance = null; resolve(); };
      setTimeout(() => { window.speechSynthesis.speak(utterance); }, 50);
    });
  }

  stop() {
    if (this._audio) { this._audio.pause(); this._audio.currentTime = 0; this._audio.src = ""; }
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    this._playing = false;
    this._pendingText = null;
    this._pendingOpts = null;
    this._currentUtterance = null;
  }

  togglePause() {
    if (this._audio && this._audio.src && !this._audio.src.startsWith("data:")) {
      if (this._audio.paused) this._audio.play();
      else this._audio.pause();
    } else if (window.speechSynthesis) {
      if (window.speechSynthesis.paused) window.speechSynthesis.resume();
      else if (window.speechSynthesis.speaking) window.speechSynthesis.pause();
    }
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
