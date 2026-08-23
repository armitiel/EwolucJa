/**
 * soundFx — efekty dźwiękowe gry.
 *
 * Dwie osobne drogi, bo to dwa różne problemy:
 *
 *   • JEDNORAZOWE (brzdęk, nagroda) — zwykły element <audio>. Odtwarza próbkę
 *     raz i kończy; nie ma czego zapętlać, więc prostsze narzędzie wystarcza.
 *
 *   • KROKI — Web Audio (AudioBufferSourceNode). To NIE jest nadmiarowość:
 *     zapętlony MP3 w elemencie <audio> ma na styku dziurę. Format dokłada
 *     ciszę na końcu (padding kodera), a nasz plik ma dodatkowo ~0,19 s ciszy
 *     po ostatnim kroku — razem słychać przerwę w rytmie stóp co ~2 s chodu
 *     i co ~1,5 s biegu. Bufor w Web Audio zapętla się co do próbki, a
 *     `loopEnd` pozwala uciąć ogon bez ruszania samego pliku.
 *     Przy okazji znikają dwa timery: głośnością steruje rampa GainNode.
 *
 * NIC nie pobiera się przy imporcie. Wcześniej moduł tworzył trzy elementy
 * z `preload="auto"`, co ściągało 525 KB (w tym 385 KB ambientu używanego
 * tylko w misjach) dokładnie wtedy, gdy sceną leciały modele. Teraz plik
 * rusza dopiero, gdy ktoś go zamówi — patrz `kolejkaStartu`.
 */
import { audioCtx, audioCtxIstniejacy, odblokuj } from "./audioCtx.js";

const DEFAULT_VOLUME = 0.6;

const SOURCES = {
  dopamine: "/Soft_dopamine.mp3",
  magicalAncient: "/A_magical_ancient.mp3",
  gentleMagical: "/Gentle_magical.mp3",
};

const AUDIO_POOL = {};
// Czy padł już gest użytkownika — elementy tworzone PO nim trzeba rozgrzać
// od razu, bo nie doczekają się wspólnego rozgrzewania.
let bylGest = false;

/** Tworzy (i zaczyna pobierać) element dla klucza. Idempotentne. */
function element(key) {
  const src = SOURCES[key];
  if (!src) {
    console.warn("[soundFx] nieznany klucz:", key);
    return null;
  }
  if (AUDIO_POOL[key]) return AUDIO_POOL[key];
  if (typeof window === "undefined") return null;
  const a = new Audio(src);
  a.preload = "auto";
  a.volume = DEFAULT_VOLUME;
  try { a.load(); } catch {}
  AUDIO_POOL[key] = a;
  if (bylGest) rozgrzej(a);
  return a;
}

/**
 * Zamawia pobranie dźwięków z wyprzedzeniem — ekran woła to dla tego, czego
 * naprawdę użyje. Zwraca obietnicę spełnianą, gdy przeglądarka ma dość danych
 * do natychmiastowego startu (albo od razu, gdy nie umie tego zgłosić).
 */
export function przygotuj(...klucze) {
  return Promise.all(
    klucze.flat().map((key) => {
      if (key === "kroki") return przygotujKroki();
      const a = element(key);
      if (!a) return Promise.resolve(null);
      if (a.readyState >= 3) return Promise.resolve(a);
      return new Promise((gotowe) => {
        const koniec = () => {
          a.removeEventListener("canplaythrough", koniec);
          a.removeEventListener("error", koniec);
          gotowe(a);
        };
        a.addEventListener("canplaythrough", koniec);
        a.addEventListener("error", koniec);
        // Bezpiecznik: gdyby zdarzenie nie przyszło (bywa przy cache), nie
        // blokujemy kolejki w nieskończoność.
        window.setTimeout(koniec, 8000);
      });
    })
  );
}

/**
 * Rozgrzewka: krótkie play/pause przy WYCISZONYM elemencie odblokowuje go
 * w przeglądarce, więc pierwsze prawdziwe `play()` jest natychmiastowe.
 * `muted`, a nie `volume = 0` — na iOS samo zero nie blokuje pierwszej próbki.
 */
function rozgrzej(a) {
  try {
    const glosnosc = a.volume;
    a.muted = true;
    a.volume = 0;
    const p = a.play();
    const posprzataj = () => {
      try { a.pause(); a.currentTime = 0; } catch {}
      a.muted = false;
      a.volume = glosnosc;
    };
    if (p && typeof p.then === "function") p.then(posprzataj).catch(posprzataj);
    else posprzataj();
  } catch {}
}

if (typeof window !== "undefined") {
  const naGest = () => {
    if (bylGest) return;
    bylGest = true;
    odblokuj();
    for (const a of Object.values(AUDIO_POOL)) rozgrzej(a);
    window.removeEventListener("click", naGest, true);
    window.removeEventListener("touchstart", naGest, true);
    window.removeEventListener("pointerdown", naGest, true);
    window.removeEventListener("keydown", naGest, true);
  };
  window.addEventListener("click", naGest, true);
  window.addEventListener("touchstart", naGest, { capture: true, passive: true });
  window.addEventListener("pointerdown", naGest, true);
  window.addEventListener("keydown", naGest, true);
}

/** Odtwarza dźwięk raz. Volume 0-1 (60% domyślnie). */
export function playFx(key, volume = DEFAULT_VOLUME) {
  try {
    const a = element(key);
    if (!a) return;
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

/* ─────────────────────────────────────────────────────────────────────────
   KROKI — jedyny dźwięk ciągły, więc chodzi po Web Audio, a nie po <audio>.

   `KROKI_KONIEC_PETLI` ucina ogon nagrania: ostatnie stąpnięcie wybrzmiewa
   do 1,857 s, a plik trwa 2,052 s. Ta ćwierć sekundy ciszy była słyszalna
   jako dziura w rytmie co jedno okrążenie pętli. Zapętlamy więc wcześniej,
   zostawiając tylko tyle przerwy, ile mają odstępy między krokami w środku
   nagrania. Wartość jest w sekundach ORYGINAŁU — `playbackRate` skaluje ją
   sam, więc bieg nie wymaga drugiej liczby.

   Tempo biegu podbija `playbackRate` na buforze: w Web Audio zmienia ono też
   wysokość dźwięku i to jest tu zaletą — szybsze i odrobinę wyższe stopy
   brzmią jak bieg, a nie jak przewinięty chód.
   ───────────────────────────────────────────────────────────────────────── */
const KROKI_PLIK = "/footstep_scuff_run.mp3";
const KROKI_GLOSNOSC = 0.15;      // ściszone o 30% z 0,22
const KROKI_KONIEC_PETLI = 1.89;  // s — patrz komentarz wyżej
const KROKI_NARASTANIE = 0.05;    // s
const KROKI_WYGASZENIE = 0.13;    // s — tyle, żeby nie było trzasku

let krokiBufor = null;
let krokiLadowanie = null;
let krokiZrodlo = null;
let krokiWzm = null;
let krokiTimerStopu = null;

/** Pobiera i dekoduje próbkę kroków. Woła to kolejka startowa. */
export function przygotujKroki() {
  if (krokiBufor) return Promise.resolve(krokiBufor);
  if (krokiLadowanie) return krokiLadowanie;
  const ctx = audioCtx();
  if (!ctx) return Promise.resolve(null);
  krokiLadowanie = fetch(KROKI_PLIK)
    .then((r) => r.arrayBuffer())
    .then((dane) => ctx.decodeAudioData(dane))
    .then((bufor) => { krokiBufor = bufor; return bufor; })
    .catch((e) => { console.warn("[soundFx] kroki:", e?.message); return null; })
    .finally(() => { krokiLadowanie = null; });
  return krokiLadowanie;
}

function krokiNaglosnij(ctx) {
  if (!krokiWzm) return;
  const t = ctx.currentTime;
  krokiWzm.gain.cancelScheduledValues(t);
  krokiWzm.gain.setValueAtTime(krokiWzm.gain.value, t);
  krokiWzm.gain.linearRampToValueAtTime(KROKI_GLOSNOSC, t + KROKI_NARASTANIE);
}

/** Włącza pętlę kroków (jeśli już gra — tylko dostraja tempo). */
export function krokiGraj({ bieg = false } = {}) {
  const ctx = audioCtx();
  if (!ctx) return;
  if (!krokiBufor) {
    // Jeszcze się ładuje (albo nikt nie zamówił). Nie czekamy — sonda ruchu
    // odpyta nas za chwilę jeszcze raz i wtedy bufor już będzie.
    przygotujKroki();
    return;
  }
  odblokuj();
  if (krokiTimerStopu) { clearTimeout(krokiTimerStopu); krokiTimerStopu = null; }
  const tempo = bieg ? 1.35 : 1;

  if (krokiZrodlo) {
    if (krokiZrodlo.playbackRate.value !== tempo) krokiZrodlo.playbackRate.value = tempo;
    krokiNaglosnij(ctx);
    return;
  }

  krokiWzm = ctx.createGain();
  krokiWzm.gain.value = 0;
  krokiWzm.connect(ctx.destination);

  const z = ctx.createBufferSource();
  z.buffer = krokiBufor;
  z.loop = true;
  z.loopStart = 0;
  z.loopEnd = Math.min(KROKI_KONIEC_PETLI, krokiBufor.duration);
  z.playbackRate.value = tempo;
  z.connect(krokiWzm);
  z.start(0);
  krokiZrodlo = z;
  krokiNaglosnij(ctx);
}

/** Wygasza kroki i dopiero potem zatrzymuje źródło (bez trzasku). */
export function krokiStop() {
  const ctx = audioCtxIstniejacy();
  if (!ctx || !krokiZrodlo || !krokiWzm) return;
  // Wygaszanie już trwa — nie zaczynaj go od nowa. Bez tego strażnika sonda
  // ruchu (co 125 ms) co chwilę zerowałaby rampę i wyciszenie by się szarpało.
  if (krokiTimerStopu) return;

  const t = ctx.currentTime;
  krokiWzm.gain.cancelScheduledValues(t);
  krokiWzm.gain.setValueAtTime(krokiWzm.gain.value, t);
  krokiWzm.gain.linearRampToValueAtTime(0, t + KROKI_WYGASZENIE);

  const z = krokiZrodlo;
  const w = krokiWzm;
  krokiTimerStopu = window.setTimeout(() => {
    krokiTimerStopu = null;
    try { z.stop(); } catch {}
    try { z.disconnect(); } catch {}
    try { w.disconnect(); } catch {}
    if (krokiZrodlo === z) { krokiZrodlo = null; krokiWzm = null; }
  }, KROKI_WYGASZENIE * 1000 + 40);
}

/* ── TYK KOŁA FORTUNY ─────────────────────────────────────────────────────
   Syntezowany, nie z pliku. Dźwięk kręcącego się koła to nie jedna próbka,
   tylko RYTM: kołek uderza o każdy mijany klin, więc stuknięcia same
   zwalniają razem z tarczą. Próbka pętlowa tego nie zrobi — musiałaby
   zmieniać tempo w locie, a i tak rozjechałaby się z animacją.

   Barwa: krótki szum przepuszczony przez wąskie pasmo ~1,8 kHz. To brzmi jak
   drewno, nie jak elektroniczny „bip" — a koło w grze jest drewniane. */
let szumBufor = null;

function bufoSzumu(ctx) {
  if (szumBufor && szumBufor.sampleRate === ctx.sampleRate) return szumBufor;
  const dl = Math.floor(ctx.sampleRate * 0.05);
  const b = ctx.createBuffer(1, dl, ctx.sampleRate);
  const d = b.getChannelData(0);
  for (let i = 0; i < dl; i++) d[i] = Math.random() * 2 - 1;
  szumBufor = b;
  return b;
}

/**
 * Jedno stuknięcie kołka o klin. `sila` 0–1 ścisza i przygasza dźwięk —
 * pod koniec kręcenia tarcza ledwo się toczy i tyki mają być ciche.
 */
export function tykKola(sila = 1) {
  const ctx = audioCtx();
  if (!ctx) return;
  odblokuj();
  const s = Math.max(0, Math.min(1, sila));
  const t = ctx.currentTime;
  const zrodlo = ctx.createBufferSource();
  zrodlo.buffer = bufoSzumu(ctx);
  const pasmo = ctx.createBiquadFilter();
  pasmo.type = "bandpass";
  pasmo.frequency.value = 1500 + 600 * s;
  pasmo.Q.value = 7;
  const wzm = ctx.createGain();
  const szczyt = 0.05 + 0.16 * s;
  wzm.gain.setValueAtTime(0.0001, t);
  wzm.gain.exponentialRampToValueAtTime(szczyt, t + 0.003);
  wzm.gain.exponentialRampToValueAtTime(0.0001, t + 0.045);
  zrodlo.connect(pasmo).connect(wzm).connect(ctx.destination);
  zrodlo.start(t);
  zrodlo.stop(t + 0.06);
}

/** Skróty do dźwięków używanych w grze. */
export const fx = {
  tykKola,
  dopamine: (vol) => playFx("dopamine", vol ?? 0.6),
  magicalAncient: (vol) => playFx("magicalAncient", vol ?? 0.6),
  gentleMagical: (vol) => playFx("gentleMagical", vol ?? 0.6),
  przygotuj,
  krokiGraj,
  krokiStop,
};
