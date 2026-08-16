/**
 * audioCtx — JEDEN AudioContext na całą aplikację.
 *
 * Dlaczego wspólny, a nie po jednym na moduł: każdy AudioContext otwiera
 * własny strumień do karty dźwiękowej. Przeglądarki dopuszczają ich kilka,
 * ale na telefonach (zwłaszcza starszym Androidzie i iOS) drugi strumień
 * potrafi dołożyć opóźnienie albo trzaski, a przy przełączaniu aplikacji
 * wraca do życia tylko jeden z nich. Jeden kontekst = jedno miejsce, które
 * trzeba odblokować i wznowić.
 *
 * Uwaga na politykę autoplay: kontekst utworzony poza gestem użytkownika
 * rodzi się `suspended`. To nie jest błąd — `odblokuj()` wołane przy
 * pierwszym dotknięciu (i przed samym odtworzeniem) budzi go.
 */
let ctx = null;

/** Zwraca wspólny kontekst; tworzy go przy pierwszym wywołaniu. `null` = brak Web Audio. */
export function audioCtx() {
  if (ctx) return ctx;
  if (typeof window === "undefined") return null;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  try {
    ctx = new AC();
  } catch (e) {
    console.warn("[audioCtx] nie udało się utworzyć kontekstu:", e?.message);
    ctx = null;
  }
  return ctx;
}

/** Kontekst TYLKO jeśli już istnieje — do wyciszania nie ma po co go budzić. */
export function audioCtxIstniejacy() {
  return ctx;
}

/** Budzi uśpiony kontekst. Bezpieczne do wołania wielokrotnie. */
export function odblokuj() {
  if (ctx && ctx.state === "suspended") {
    try { ctx.resume(); } catch {}
  }
}

if (typeof window !== "undefined") {
  const naGest = () => odblokuj();
  window.addEventListener("pointerdown", naGest, { capture: true, passive: true });
  window.addEventListener("touchstart", naGest, { capture: true, passive: true });
  window.addEventListener("keydown", naGest, true);
}
