/**
 * krokiBohatera — tupnięcia zsynchronizowane z ANIMACJĄ CHODU, nie z zegarem.
 *
 * Dlaczego nie plik dźwiękowy w pętli: pętla ma stałe tempo, a bohater
 * przyspiesza, zwalnia, przechodzi z chodu w bieg i staje w miejscu. Każda
 * pętla rozjeżdża się z obrazem po kilku sekundach i dziecko to słyszy, nawet
 * jeśli nie umie nazwać dlaczego. Dźwięk musi wychodzić z tego samego zegara,
 * co ruch nóg.
 *
 * SKĄD BIERZEMY MOMENT KROKU.
 * Moduł sceny (`public/scena-3d/scena3d.esm.js`) wystawia w swoim API pole
 * `_app` — całą instancję. Na niej siedzi `current` (nazwa granego klipu:
 * "walk" / "run" / "idle") i `actions` (obiekty `AnimationAction` three.js
 * z `.time` i `.getClip().duration`). Czytamy więc fazę cyklu prosto z
 * odtwarzanej animacji. Nie trzeba dotykać bundla — a to jest tu istotne,
 * bo bundla nie da się przebudować ze źródeł.
 *
 * GDZIE W CYKLU STOPA DOTYKA ZIEMI.
 * Wyliczone offline z samych plików GLB: kinematyka prosta na kościach
 * (`L_ToeBase` / `R_ToeBase`) przez cały klip, szukanie minimów wysokości.
 * Oba klipy zawierają PO DWA pełne cykle, czyli cztery kontakty na klip —
 * stąd krok co 0.25 fazy, a nie co 0.5. Wartości `start` to faza pierwszego
 * kontaktu; wyszły praktycznie identyczne dla chłopca i dla lisa, bo to ten
 * sam rig.
 *
 * Jeśli po odsłuchu w grze kroki będą minimalnie przed albo za obrazem,
 * poprawia się to jedną liczbą — bez przebudowy czegokolwiek:
 *   window.krokiBohatera.przesun("walk", 0.11)
 */
import { audioWyjscie } from "../adventure/audio/sceneAudio.js";

const FAZY = {
  walk: { start: 0.08, co: 0.25 },
  run: { start: 0.05, co: 0.25 },
};

/** Klipy, przy których w ogóle chodzimy. `idle` i `happy` nie robią kroków. */
const KLIPY_Z_KROKAMI = Object.keys(FAZY);

let szum = null;

/** Jeden bufor szumu na cały cykl życia — generowanie go co krok to marnotrawstwo. */
function buforSzumu(ctx) {
  if (szum && szum.sampleRate === ctx.sampleRate) return szum;
  const dlugosc = Math.floor(ctx.sampleRate * 0.25);
  const bufor = ctx.createBuffer(1, dlugosc, ctx.sampleRate);
  const dane = bufor.getChannelData(0);
  for (let i = 0; i < dlugosc; i += 1) dane[i] = Math.random() * 2 - 1;
  szum = bufor;
  return bufor;
}

const losowo = (od, do_) => od + Math.random() * (do_ - od);

/**
 * Jedno tupnięcie = dwie warstwy.
 *
 *   KORPUS — sinus ~110 Hz opadający do połowy w 60 ms. To jest ten „tup",
 *            czyli masa ciała lądująca na ziemi.
 *   SZUR   — krótki szum przez filtr pasmowy. Trawa, piasek, liście. Cichy:
 *            gdy jest za głośny, bohater brzmi jakby szedł po żwirze.
 *
 * Każdy krok jest LOSOWO trochę inny (wysokość, głośność, barwa szumu) i lewa
 * noga brzmi minimalnie niżej niż prawa. Bez tego dwa identyczne tupnięcia
 * pod rząd zdradzają pętlę — ucho wyłapuje powtórzenie szybciej niż melodię.
 */
function tupniecie({ ctx, master }, { noga, bieg }) {
  const t = ctx.currentTime;
  const koniecKorpusu = bieg ? 0.075 : 0.105;

  const kanal = ctx.createGain();
  kanal.gain.value = 1;
  let wyjscie = kanal;
  // Panorama jest subtelna (0.18) — to ma być ślad tego, że nogi są dwie,
  // a nie efekt stereo. W słuchawkach mocniejsze rozjechanie męczy.
  if (typeof ctx.createStereoPanner === "function") {
    const panorama = ctx.createStereoPanner();
    panorama.pan.value = noga === "L" ? -0.18 : 0.18;
    kanal.connect(panorama);
    wyjscie = panorama;
  }
  wyjscie.connect(master);

  /* ── korpus ── */
  const podstawa = losowo(96, 122) * (noga === "L" ? 0.94 : 1) * (bieg ? 1.12 : 1);
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(podstawa, t);
  osc.frequency.exponentialRampToValueAtTime(podstawa * 0.5, t + 0.06);
  const gKorpus = ctx.createGain();
  const szczyt = losowo(0.5, 0.72) * (bieg ? 1.35 : 1);
  gKorpus.gain.setValueAtTime(0.0001, t);
  gKorpus.gain.exponentialRampToValueAtTime(szczyt, t + 0.006);
  gKorpus.gain.exponentialRampToValueAtTime(0.0001, t + koniecKorpusu);
  osc.connect(gKorpus);
  gKorpus.connect(kanal);
  osc.start(t);
  osc.stop(t + koniecKorpusu + 0.03);

  /* ── szur ── */
  const zrodlo = ctx.createBufferSource();
  zrodlo.buffer = buforSzumu(ctx);
  zrodlo.playbackRate.value = losowo(0.85, 1.25);
  const filtr = ctx.createBiquadFilter();
  filtr.type = "bandpass";
  filtr.frequency.value = losowo(1500, 2900);
  filtr.Q.value = 0.9;
  const gSzur = ctx.createGain();
  const koniecSzuru = bieg ? 0.055 : 0.045;
  gSzur.gain.setValueAtTime(0.0001, t);
  gSzur.gain.exponentialRampToValueAtTime(losowo(0.1, 0.17) * (bieg ? 1.4 : 1), t + 0.004);
  gSzur.gain.exponentialRampToValueAtTime(0.0001, t + koniecSzuru);
  zrodlo.connect(filtr);
  filtr.connect(gSzur);
  gSzur.connect(kanal);
  zrodlo.start(t);
  zrodlo.stop(t + koniecSzuru + 0.03);
}

/**
 * Podpięcie pod scenę. `pobierzScene` to funkcja zwracająca API sceny
 * (`scenaRef.current`), a nie samo API — scena montuje się asynchronicznie
 * i w chwili uruchomienia tej pętli jeszcze jej nie ma.
 *
 * Zwraca funkcję zatrzymującą.
 */
export function uruchomKroki(pobierzScene) {
  let klatka = 0;
  let poprzedniIndeks = null;
  let poprzedniKlip = null;
  let zywe = true;

  function tik() {
    if (!zywe) return;
    klatka = window.requestAnimationFrame(tik);

    const app = pobierzScene()?._app;
    if (!app || app.paused || app.destroyed) { poprzedniIndeks = null; return; }

    const klip = app.current;
    if (!KLIPY_Z_KROKAMI.includes(klip)) { poprzedniIndeks = null; poprzedniKlip = klip; return; }

    const akcja = app.actions?.[klip];
    const dlugosc = akcja?.getClip?.().duration || 0;
    if (!akcja || !dlugosc) { poprzedniIndeks = null; return; }

    const ustawienia = FAZY[klip];
    const faza = ((akcja.time / dlugosc) % 1 + 1) % 1;
    const indeks = Math.floor((((faza - ustawienia.start) % 1 + 1) % 1) / ustawienia.co);

    // Przy wejściu w klip (albo po pauzie) NIE gramy od razu: bierzemy bieżący
    // indeks jako punkt odniesienia. Inaczej samo przełączenie z chodu w bieg
    // strzelałoby dodatkowym krokiem w losowym momencie cyklu.
    if (poprzedniIndeks === null || klip !== poprzedniKlip) {
      poprzedniIndeks = indeks;
      poprzedniKlip = klip;
      return;
    }
    if (indeks === poprzedniIndeks) return;
    poprzedniIndeks = indeks;

    const wyjscie = audioWyjscie();
    if (!wyjscie) return;
    try {
      tupniecie(wyjscie, { noga: indeks % 2 === 0 ? "L" : "P", bieg: klip === "run" });
    } catch {
      // Dźwięk nigdy nie wywraca sceny. Cisza jest akceptowalnym wynikiem.
    }
  }

  klatka = window.requestAnimationFrame(tik);

  // Uchwyt do strojenia na żywo — bez niego dopasowanie fazy znaczyłoby
  // edycję pliku, przeładowanie i dojście bohaterem do trawy przy każdej próbie.
  window.krokiBohatera = {
    fazy: () => JSON.parse(JSON.stringify(FAZY)),
    przesun: (klip, wartosc) => {
      if (!FAZY[klip]) return null;
      FAZY[klip].start = ((Number(wartosc) % 1) + 1) % 1;
      return FAZY[klip];
    },
    test: (bieg = false) => {
      const wyjscie = audioWyjscie();
      if (!wyjscie) return "dźwięk wyłączony";
      tupniecie(wyjscie, { noga: "L", bieg });
      window.setTimeout(() => tupniecie(wyjscie, { noga: "P", bieg }), bieg ? 260 : 430);
      return "gram";
    },
  };

  return () => {
    zywe = false;
    window.cancelAnimationFrame(klatka);
    if (window.krokiBohatera) delete window.krokiBohatera;
  };
}
