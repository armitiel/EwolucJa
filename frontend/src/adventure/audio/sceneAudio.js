/**
 * sceneAudio — warstwa dźwięku przygody.
 *
 * Trzy zasady, których ta warstwa nigdy nie łamie:
 *  1. Dźwięk NIGDY nie blokuje decyzji. Nie ma tu żadnego `onEnd` sterującego UI.
 *  2. Tekst jest zawsze dostępny. Głos jest dodatkiem, nie nośnikiem treści.
 *  3. Głos to gotowe pliki (`/vo/<id>.mp3`). Synteza na żywo nie jest w ścieżce
 *     krytycznej — brak pliku oznacza ciszę, nie błąd i nie czekanie.
 *
 * Sygnały (klik, odkrycie, sukces, zmiana lokacji) są syntezowane przez WebAudio,
 * więc działają bez żadnych assetów i bez ryzyka 404.
 */

import bgMusic from "../../services/bgMusic.js";

const PREF_KEY = "ewolucja.adventure.sound";

let ctx = null;
let master = null;
let voiceEl = null;
let voiceToken = 0;
let unlocked = false;

function prefersSound() {
  try {
    return localStorage.getItem(PREF_KEY) !== "off";
  } catch {
    return true;
  }
}

export function isSoundOn() {
  return prefersSound();
}

export function setSoundOn(on) {
  try {
    localStorage.setItem(PREF_KEY, on ? "on" : "off");
  } catch {}
  if (!on) {
    stopVoice();
    try {
      bgMusic.setEnabled(false);
    } catch {}
  } else {
    try {
      bgMusic.setEnabled(true);
    } catch {}
  }
  return on;
}

function ensureCtx() {
  if (typeof window === "undefined") return null;
  if (ctx) return ctx;
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.22;
    master.connect(ctx.destination);
  } catch {
    ctx = null;
  }
  return ctx;
}

/** Odblokowanie audio przy pierwszym geście — wymagane przez politykę autoplay. */
export function unlockAudio() {
  if (unlocked) return;
  unlocked = true;
  const c = ensureCtx();
  try {
    if (c && c.state === "suspended") c.resume();
  } catch {}
}

/** Pojedynczy, miękki ton. */
function tone({ freq = 440, dur = 0.5, type = "sine", gain = 1, delay = 0, glideTo = null }) {
  const c = ensureCtx();
  if (!c || !prefersSound()) return;
  try {
    const t0 = c.currentTime + delay;
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (glideTo) osc.frequency.exponentialRampToValueAtTime(glideTo, t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, gain), t0 + 0.04);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g);
    g.connect(master);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  } catch {}
}

function chord(freqs, opts = {}) {
  freqs.forEach((f, i) => tone({ freq: f, delay: i * (opts.stagger ?? 0.07), ...opts }));
}

/** Sygnały dźwiękowe — nazwane po zdarzeniu w świecie, nie po instrumencie. */
export const cue = {
  /** wejście do sceny */
  sceneEnter: () => chord([392, 523.25, 659.25], { dur: 1.6, gain: 0.16, type: "sine", stagger: 0.12 }),
  /** dziecko dotknęło opcji */
  pick: () => tone({ freq: 587.33, dur: 0.28, gain: 0.2, type: "triangle", glideTo: 880 }),
  /** przewinięcie kwestii dialogowej */
  advance: () => tone({ freq: 523.25, dur: 0.16, gain: 0.1, type: "sine" }),
  /** coś się odkryło (nagroda za wybór) */
  discover: () => chord([659.25, 783.99, 1046.5], { dur: 1.1, gain: 0.16, stagger: 0.09 }),
  /** sukces / Iskra wraca */
  success: () => chord([523.25, 659.25, 783.99, 1046.5], { dur: 2.2, gain: 0.18, stagger: 0.13 }),
  /** zmiana lokacji */
  travel: () => tone({ freq: 330, dur: 1.4, gain: 0.14, type: "sine", glideTo: 660 }),
  /** dowód poszedł do Mentora */
  sent: () => chord([440, 587.33], { dur: 1.0, gain: 0.14, stagger: 0.16 }),
};

/* ── Głos ─────────────────────────────────────────────────────────────── */

function stopVoice() {
  voiceToken += 1;
  if (voiceEl) {
    try {
      voiceEl.pause();
      voiceEl.src = "";
    } catch {}
    voiceEl = null;
  }
  try {
    bgMusic.unduck();
  } catch {}
}

/**
 * Odtwarza gotowe nagranie kwestii. Zwraca natychmiast — wywołujący nigdy nie czeka.
 * @param {string|null} voiceId nazwa pliku bez rozszerzenia w /vo/
 */
export function speakLine(voiceId) {
  stopVoice();
  if (!voiceId || !prefersSound()) return;
  const myToken = voiceToken;
  try {
    const el = new Audio(`/vo/${voiceId}.mp3`);
    el.preload = "auto";
    voiceEl = el;
    // Ducking muzyki tylko gdy plik faktycznie ruszy.
    el.addEventListener("playing", () => {
      if (myToken !== voiceToken) return;
      try {
        bgMusic.duck();
      } catch {}
    });
    const restore = () => {
      if (myToken !== voiceToken) return;
      try {
        bgMusic.unduck();
      } catch {}
    };
    el.addEventListener("ended", restore);
    el.addEventListener("error", restore); // brak pliku = cisza, nic się nie psuje
    const p = el.play();
    if (p && typeof p.catch === "function") p.catch(restore);
  } catch {}
}

export function replayLine(voiceId) {
  speakLine(voiceId);
}

export function silence() {
  stopVoice();
}

/** Nastrój muzyczny sceny. Brak pliku muzyki nie przerywa niczego. */
export function setMood(mood) {
  if (!prefersSound()) return;
  const TRACKS = {
    swit: "/Mindful_Forest_Path.mp3",
    dzien: "/Mindful_Forest_Path.mp3",
    noc: "/A_magical_ancient.mp3",
  };
  const track = TRACKS[mood];
  if (!track) return;
  try {
    if (bgMusic.setTrack) bgMusic.setTrack(track);
  } catch {}
}

/** Stan „czekamy na Mentora" — muzyka schodzi niżej, żaden dźwięk nie ponagla. */
export function enterWaitingState() {
  try {
    bgMusic.duck();
  } catch {}
}

export function leaveWaitingState() {
  try {
    bgMusic.unduck();
  } catch {}
}
