/**
 * soundFx — jednorazowe efekty dzwiekowe (krótkie audio one-shot).
 * Volume 60% domyslnie, mozna nadpisac per call.
 * Cache instancji per src - kazdy plik ma jeden obiekt Audio reuzywany.
 */

const CACHE = new Map();
const DEFAULT_VOLUME = 0.6;

function getAudio(src) {
  if (CACHE.has(src)) return CACHE.get(src);
  const a = new Audio(src);
  a.preload = "auto";
  a.volume = DEFAULT_VOLUME;
  CACHE.set(src, a);
  return a;
}

/** Odtwarza dzwiek raz. Volume w zakresie 0-1 (60% domyslnie). */
export function playFx(src, volume = DEFAULT_VOLUME) {
  try {
    const a = getAudio(src);
    a.volume = Math.max(0, Math.min(1, volume));
    // currentTime = 0 throws gdy audio nie zaladowane - try/catch obejmuje to
    try { a.currentTime = 0; } catch {}
    const p = a.play();
    if (p && typeof p.catch === "function") {
      p.catch((e) => console.warn("[soundFx] play blocked:", src, e?.message));
    }
  } catch (e) {
    console.warn("[soundFx] error:", e?.message);
  }
}

/** Convenience wrappers - obecnie uzywane dzwieki. */
export const fx = {
  dopamine: (vol) => playFx("/Soft_dopamine.mp3", vol ?? 0.6),
  magicalAncient: (vol) => playFx("/A_magical_ancient.mp3", vol ?? 0.6),
};
