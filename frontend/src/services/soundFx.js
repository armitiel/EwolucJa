/**
 * soundFx — jednorazowe efekty dzwiekowe (krótkie audio one-shot).
 * Strategia:
 *   1) Eager prealokacja Audio objects + .load() przy imporcie modulu
 *   2) Warmup (play/pause z volume=0) przy pierwszym user gesture - unlock autoplay policy
 *   3) Buforowane elementy gotowe natychmiast do play() bez czekania na pobranie
 */

const DEFAULT_VOLUME = 0.6;

const SOURCES = {
  dopamine: "/Soft_dopamine.mp3",
  magicalAncient: "/A_magical_ancient.mp3",
  gentleMagical: "/Gentle_magical.mp3",
};

// Eager-tworzenie i load() przy imporcie modulu
const AUDIO_POOL = {};
if (typeof window !== "undefined") {
  for (const [key, src] of Object.entries(SOURCES)) {
    const a = new Audio(src);
    a.preload = "auto";
    a.volume = DEFAULT_VOLUME;
    try { a.load(); } catch {}
    AUDIO_POOL[key] = a;
  }
}

// Warmup - przy pierwszym kliknieciu robimy play/pause z volume=0 na kazdym audio.
// To "odblokowuje" je w przegladarce - kolejne play() beda natychmiastowe.
let warmed = false;
function warmupOnFirstGesture() {
  if (warmed || typeof window === "undefined") return;
  const handler = () => {
    if (warmed) return;
    warmed = true;
    for (const a of Object.values(AUDIO_POOL)) {
      try {
        const prevVol = a.volume;
        a.volume = 0;
        const p = a.play();
        if (p && typeof p.then === "function") {
          p.then(() => {
            a.pause();
            a.currentTime = 0;
            a.volume = prevVol;
          }).catch(() => {
            a.volume = prevVol;
          });
        }
      } catch {}
    }
    window.removeEventListener("click", handler, true);
    window.removeEventListener("touchstart", handler, true);
    window.removeEventListener("pointerdown", handler, true);
    window.removeEventListener("keydown", handler, true);
  };
  window.addEventListener("click", handler, true);
  window.addEventListener("touchstart", handler, { capture: true, passive: true });
  window.addEventListener("pointerdown", handler, true);
  window.addEventListener("keydown", handler, true);
}
warmupOnFirstGesture();

/** Odtwarza dzwiek raz. Volume w zakresie 0-1 (60% domyslnie). */
export function playFx(key, volume = DEFAULT_VOLUME) {
  try {
    const a = AUDIO_POOL[key];
    if (!a) {
      console.warn("[soundFx] unknown key:", key);
      return;
    }
    a.volume = Math.max(0, Math.min(1, volume));
    try { a.currentTime = 0; } catch {}
    const p = a.play();
    if (p && typeof p.catch === "function") {
      p.catch((e) => console.warn("[soundFx] play blocked:", key, e?.message));
    }
  } catch (e) {
    console.warn("[soundFx] error:", e?.message);
  }
}

/** Convenience wrappers - obecnie uzywane dzwieki. */
export const fx = {
  dopamine: (vol) => playFx("dopamine", vol ?? 0.6),
  magicalAncient: (vol) => playFx("magicalAncient", vol ?? 0.6),
  gentleMagical: (vol) => playFx("gentleMagical", vol ?? 0.6),
};
