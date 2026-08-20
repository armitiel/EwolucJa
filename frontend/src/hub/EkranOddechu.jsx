/**
 * EkranOddechu — prowadzony oddech na pełnym ekranie.
 *
 * Dlaczego pełny ekran, a nie kafelek w panelu: to jedyny moment w całej
 * aplikacji, w którym nic się nie dzieje. Gdyby obok stały półki z poradami i
 * dok z zakładkami, dziecko wodziłoby po nich wzrokiem zamiast oddychać.
 *
 * Instrukcja jest podana TRZEMA kanałami naraz, bo sześciolatek jeszcze czyta
 * wolno, a dwunastolatek nie chce, żeby mu tłumaczyć:
 *   1. ruch  — balon rośnie, zatrzymuje się i maleje; kanał główny, wystarcza sam,
 *   2. słowo — jedno słowo w środku, nie zdanie,
 *   3. dźwięk — pad idący w górę na wdechu, drżący na wstrzymaniu, opadający
 *      na wydechu, plus dzwonek na każdej zmianie fazy.
 *
 * WSTRZYMANIE jest krótkie z premedytacją: 40% długości wdechu, nigdy więcej
 * niż 1,6 s. Dorosłe techniki (4-7-8) każą trzymać dłużej niż wdech — dziecko
 * przy takim poleceniu zaczyna się spinać i pilnować, zamiast uspokajać. Tyle,
 * ile tu jest, wystarcza, żeby poczuć zatrzymanie, i nie zaczyna wyścigu.
 *
 * ROSNĄCA EKSCYTACJA: każdy domknięty cykl podnosi `--poziom` (0→1). Od niego
 * idzie wszystko naraz — poświata koła, liczba iskier krążących wokół, jasność
 * tła i wysokość dźwięku. Piąty oddech ma wyglądać na nagrodę za cztery
 * poprzednie, a nie na piąte powtórzenie tego samego.
 *
 * SCENA: dziecko nadmuchuje balon razem z liskiem, który trzyma sznurki u dołu
 * ekranu. Balon skaluje się od WĘZEŁKA (transform-origin przy dolnej krawędzi),
 * a nie od środka — inaczej przy każdym wdechu odjeżdżałby od sznurków i cała
 * scena rozpadałaby się na dwa niezależne obrazki.
 *
 * SZNURKI SĄ RYSOWANE, NIE NAMALOWANE. Wcześniej lisek miał sznurki wprost na
 * ilustracji: cztery sztuki, uciekające poza kadr i niedochodzące do niczego,
 * bo balon jest osobnym elementem i pływa. Teraz ilustracja ma same zaciśnięte
 * łapki, a dwa sznurki dorysowuje SVG — od KAŻDEJ łapki do WĘZEŁKA balonu.
 * Punkty liczą się z żywych pomiarów obu elementów, więc trzymają się siebie
 * na każdym ekranie i w każdej fazie oddechu (węzełek nie rusza się przy
 * skalowaniu, bo balon rośnie właśnie od niego).
 *
 * ODLICZANIE 3-2-1 na starcie robi dwie rzeczy naraz: daje czas na odłożenie
 * telefonu wygodniej i ustawia rytm — trzy tyknięcia w tym samym tempie, w
 * którym za chwilę pójdzie wdech.
 *
 * Dźwięk chodzi tylko wtedy, gdy dziecko ma włączoną muzykę gry.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import bgMusic from "../services/bgMusic";

/** Tempo za porą dnia — rano krócej, wieczorem dłużej. */
const TEMPO = { rano: 3.4, poludnie: 3.8, popoludnie: 3.8, wieczor: 4.6, noc: 5 };
const CYKLE = 5;
const ISKRY = 9;

/** Pentatonika w górę: każdy cykl o stopień wyżej, bez fałszu. */
const TONY = [196, 220, 246.9, 261.6, 293.7];

const SLOWA = { wdech: "wdech", wstrzymaj: "trzymaj", wydech: "wydech" };

/**
 * Strzałka fazy — jeden kształt na wszystkie trzy stany, reszta to obrót.
 *
 * Narysowana w polu 32×32 i CELOWO mniejsza od niego: w `hub.css` dostaje
 * gruby obrys w swoim własnym kolorze (`stroke-linejoin: round`), który
 * rozdyma sylwetkę o kilka pikseli i zaokrągla wszystkie rogi. To ten sam
 * trick, którym gliniane przedmioty w grze dostają miękkie krawędzie —
 * taniej i ostrzej niż osobna ścieżka z łukami.
 */
const STRZALKA = "M16 5 27 16h-5.5v11h-11V16H5z";

export default function EkranOddechu({ pora = "poludnie", onKoniec }) {
  const dlugosc = TEMPO[pora] || 4;
  const wstrzymanie = Math.min(1.6, dlugosc * 0.4);
  const [faza, setFaza] = useState("odliczanie"); // odliczanie | wdech | wstrzymaj | wydech | koniec
  const [licznik, setLicznik] = useState(3);
  const [cykl, setCykl] = useState(0);
  const audio = useRef(null);

  /**
   * Punkty zaczepienia sznurków, w pikselach sceny: dwie łapki i węzełek.
   * `null` do czasu pierwszego pomiaru — dopóki go nie ma, nie rysujemy nic,
   * bo sznurek narysowany „mniej więcej" jest gorszy niż jego brak.
   */
  const scenaRef = useRef(null);
  const lisRef = useRef(null);
  const balonRef = useRef(null);
  const [sznurki, setSznurki] = useState(null);

  /**
   * Gdzie w ILUSTRACJI jest łapka trzymająca sznurek — ułamki szerokości
   * i wysokości grafiki. Zmierzone na `lis-oddech.png`; przy podmianie
   * ilustracji to jedyne dwie liczby, które trzeba poprawić.
   *
   * JEDEN SZNUREK, NIE DWA. Dwa — po jednym z każdej łapki — schodzą się
   * w węzełku i rysują nad głową liska pętlę jak od skakanki; przy dwóch
   * podniesionych łapkach nie da się tego rozplątać. Jeden idzie skosem
   * bokiem głowy i od razu widać, kto trzyma balon. Druga łapka po prostu
   * jest w górze i tyle.
   */
  const LAPKI = useMemo(() => [{ x: 0.125, y: 0.625 }], []);

  useEffect(() => {
    const zmierz = () => {
      const scena = scenaRef.current, lis = lisRef.current, balon = balonRef.current;
      if (!scena || !lis || !balon) return;
      const s = scena.getBoundingClientRect();
      const l = lis.getBoundingClientRect();
      const b = balon.getBoundingClientRect();
      if (!s.width || !l.width || !b.width) return;
      setSznurki({
        szer: s.width,
        wys: s.height,
        // O ile sznurek odsuwa się od łapki w bok, żeby ominąć sylwetkę.
        // Liczone z szerokości liska, więc skaluje się razem z nim.
        odsun: l.width * 0.1,
        // Węzełek = dolny środek balonu. Przy skalowaniu od dolnej krawędzi
        // ten punkt stoi w miejscu, więc sznurki nie odklejają się na wdechu.
        wezel: { x: b.left + b.width / 2 - s.left, y: b.bottom - s.top },
        lapki: LAPKI.map((p) => ({
          x: l.left + l.width * p.x - s.left,
          y: l.top + l.height * p.y - s.top,
        })),
      });
    };
    zmierz();
    const t = window.setTimeout(zmierz, 120);   // po wczytaniu grafiki
    window.addEventListener("resize", zmierz);
    window.addEventListener("orientationchange", zmierz);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("resize", zmierz);
      window.removeEventListener("orientationchange", zmierz);
    };
  }, [LAPKI]);

  const wolniej = useMemo(
    () => window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true,
    []
  );

  // ── Dźwięk ───────────────────────────────────────────────────────────
  // Pad z dwóch oscylatorów przez filtr dolnoprzepustowy. Jeden goły sinus
  // brzmiał jak sygnał testowy; kwinta i lekka rozstrojka robią z niego oddech.
  useEffect(() => {
    if (!bgMusic.isEnabled()) return undefined;
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      const ctx = new Ctx();
      const master = ctx.createGain();
      master.gain.value = 0;
      master.connect(ctx.destination);

      const filtr = ctx.createBiquadFilter();
      filtr.type = "lowpass";
      filtr.frequency.value = 420;
      filtr.Q.value = 0.7;
      filtr.connect(master);

      const o1 = ctx.createOscillator();
      const o2 = ctx.createOscillator();
      o1.type = "sine"; o2.type = "sine";
      o1.frequency.value = TONY[0];
      o2.frequency.value = TONY[0] * 1.5;
      o2.detune.value = 6;
      const mieszanka = ctx.createGain();
      mieszanka.gain.value = 0.5;
      o1.connect(mieszanka); o2.connect(mieszanka); mieszanka.connect(filtr);

      // Drżenie używane tylko na wstrzymaniu — dzięki niemu „trzymaj" słychać,
      // a nie tylko widać.
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 5.2;
      lfoGain.gain.value = 0;
      lfo.connect(lfoGain); lfoGain.connect(master.gain);

      o1.start(); o2.start(); lfo.start();
      audio.current = { ctx, master, filtr, o1, o2, lfoGain };
    } catch { audio.current = null; }

    return () => {
      const a = audio.current;
      audio.current = null;
      if (!a) return;
      try { a.o1.stop(); a.o2.stop(); } catch {}
      try { a.ctx.close(); } catch {}
    };
  }, []);

  /** Krótki dzwonek na zmianie fazy — im dalej w seans, tym jaśniejszy. */
  const dzwonek = useCallback((wysokosc, moc) => {
    const a = audio.current;
    if (!a) return;
    try {
      const t = a.ctx.currentTime;
      const o = a.ctx.createOscillator();
      const g = a.ctx.createGain();
      o.type = "triangle";
      o.frequency.value = wysokosc;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(moc, t + 0.04);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);
      o.connect(g); g.connect(a.ctx.destination);
      o.start(t); o.stop(t + 1);
    } catch {}
  }, []);

  // ── Przebieg seansu ──────────────────────────────────────────────────
  useEffect(() => {
    if (faza === "koniec") return undefined;
    if (faza === "odliczanie") {
      const t = window.setTimeout(() => {
        if (licznik > 1) { setLicznik((l) => l - 1); return; }
        setFaza("wdech");
      }, 850);
      return () => window.clearTimeout(t);
    }
    const ile = faza === "wstrzymaj" ? wstrzymanie : dlugosc;
    const t = window.setTimeout(() => {
      if (faza === "wdech") { setFaza("wstrzymaj"); return; }
      if (faza === "wstrzymaj") { setFaza("wydech"); return; }
      if (cykl + 1 >= CYKLE) { setFaza("koniec"); return; }
      setCykl((c) => c + 1);
      setFaza("wdech");
    }, ile * 1000);
    return () => window.clearTimeout(t);
  }, [faza, cykl, licznik, dlugosc, wstrzymanie]);

  // Dźwięk idzie za fazą.
  useEffect(() => {
    const a = audio.current;
    if (!a) return;
    const t = a.ctx.currentTime;
    const podstawa = TONY[Math.min(cykl, TONY.length - 1)];
    const jasnosc = 0.6 + (cykl / (CYKLE - 1)) * 0.4;   // rosnąca ekscytacja
    try {
      [a.o1, a.o2].forEach((o, i) => {
        const cel = podstawa * (i === 0 ? 1 : 1.5) * (faza === "wydech" ? 0.75 : 1);
        o.frequency.cancelScheduledValues(t);
        o.frequency.setValueAtTime(o.frequency.value, t);
        o.frequency.linearRampToValueAtTime(cel, t + (faza === "wstrzymaj" ? 0.2 : dlugosc));
      });
      a.master.gain.cancelScheduledValues(t);
      a.master.gain.setValueAtTime(a.master.gain.value, t);
      a.filtr.frequency.cancelScheduledValues(t);
      a.filtr.frequency.setValueAtTime(a.filtr.frequency.value, t);
      a.lfoGain.gain.setTargetAtTime(faza === "wstrzymaj" ? 0.012 : 0, t, 0.15);

      if (faza === "odliczanie") {
        a.master.gain.linearRampToValueAtTime(0, t + 0.2);
        return;
      }
      if (faza === "koniec") {
        a.master.gain.linearRampToValueAtTime(0, t + 1);
        a.filtr.frequency.linearRampToValueAtTime(420, t + 1);
        dzwonek(TONY[TONY.length - 1] * 2, 0.06);
        window.setTimeout(() => dzwonek(TONY[TONY.length - 1] * 3, 0.045), 180);
        return;
      }
      if (faza === "wdech") {
        a.master.gain.linearRampToValueAtTime(0.055 * jasnosc, t + dlugosc * 0.9);
        a.filtr.frequency.linearRampToValueAtTime(1400 * jasnosc, t + dlugosc);
        dzwonek(podstawa * 4, 0.03 * jasnosc);
      } else if (faza === "wstrzymaj") {
        a.master.gain.linearRampToValueAtTime(0.05 * jasnosc, t + 0.2);
      } else {
        a.master.gain.linearRampToValueAtTime(0.016, t + dlugosc * 0.9);
        a.filtr.frequency.linearRampToValueAtTime(500, t + dlugosc);
      }
    } catch {}
  }, [faza, cykl, dlugosc, dzwonek]);

  // Trzy tykniecia odliczania: coraz wyzej, ostatnie najglosniej.
  useEffect(() => {
    if (faza !== "odliczanie") return;
    dzwonek(392 + (3 - licznik) * 44, 0.035 + (3 - licznik) * 0.008);
    try { navigator.vibrate?.(8); } catch {}
  }, [faza, licznik, dzwonek]);

  useEffect(() => {
    if (faza === "odliczanie" || faza === "koniec") return;
    try { navigator.vibrate?.(faza === "wstrzymaj" ? 6 : 12); } catch {}
  }, [faza]);

  const zrobione = faza === "koniec" ? CYKLE : cykl;
  const poziom = faza === "koniec" ? 1 : cykl / (CYKLE - 1);
  /**
   * Czas przejścia balonu. TAKI SAM W KAŻDEJ FAZIE — i to jest poprawka
   * szarpnięcia, nie kosmetyka.
   *
   * Wcześniej wstrzymanie skracało go do 0,25 s. Wstrzymanie samo w sobie nie
   * zmienia skali, więc wyglądało to niewinnie, ale zegar JS i przejście CSS
   * nigdy nie kończą się w tej samej milisekundzie: resztka wdechu, która
   * została do przejechania, dostawała nagle 0,25 s zamiast czterech sekund
   * i balon „doskakiwał" do końca. To samo działo się przy wyjściu ze
   * wstrzymania. Jeden czas dla wszystkich faz i ruch jest ciągły.
   */
  const trwanie = dlugosc;

  /**
   * Kąt strzałki. Ćwierć obrotu na fazę, ZAWSZE w tę samą stronę: w górę na
   * wdechu, w bok na wstrzymaniu, w dół na wydechu — a kolejny wdech to nie
   * powrót o 180 stopni, tylko dokończenie obrotu. Stąd `cykl * 360`: bez
   * tego strzałka po każdym wydechu odkręcałaby się z powrotem i cały ruch
   * czytałby się jak wahadło zamiast jak jeden spokojny obieg.
   *
   * To zastąpiło trzy różne kształty przełączane klasą (trójkąt w górę,
   * kreska, trójkąt w dół) — te zmieniały się skokiem, bo kształtu z obramowań
   * nie da się animować.
   */
  const kat =
    cykl * 360 +
    (faza === "wstrzymaj" ? 90 : faza === "wydech" ? 180 : faza === "koniec" ? 270 : 0);

  return createPortal(
    <div
      className={`oddech-ekran oddech-ekran--${faza}${wolniej ? " bez-ruchu" : ""}`}
      style={{ "--poziom": poziom }}
      role="dialog"
      aria-modal="true"
      aria-label="Oddech"
    >
      {/* Tlo to trzy warstwy gaszone opacity, a nie jeden gradient zmieniany
          w locie: przejscia miedzy gradientami w tle sie NIE animuja - kolor
          skakalby na kazdej fazie zamiast plynnie przechodzic. */}
      <span className="oddech-tlo oddech-tlo--wdech" aria-hidden="true" />
      <span className="oddech-tlo oddech-tlo--wstrzymaj" aria-hidden="true" />
      <span className="oddech-tlo oddech-tlo--wydech" aria-hidden="true" />

      <button type="button" className="oddech-zamknij" onClick={onKoniec} aria-label="Zamknij">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.4 6.4l11.2 11.2M17.6 6.4L6.4 17.6" /></svg>
      </button>

      <div className="oddech-scena" ref={scenaRef}>
        {/* Poswiata jest OSOBNYM elementem, a nie cieniem balonu: animowany
            box-shadow ląduje w kompozytowanej warstwie i jego rozmycie urywa
            sie na prostokacie tej warstwy - dokola widac bylo jasny kwadrat.
            Gradient wewnatrz wlasnego pudelka nie ma tego problemu. */}
        <span className="oddech-poswiata" aria-hidden="true" />

        {/* Swietliki kraza wokol balonu. Przy pierwszym oddechu swieci sie
            dwa, przy piatym wszystkie - to jest cala „rosnaca ekscytacja". */}
        <div className="oddech-iskry" aria-hidden="true">
          {Array.from({ length: ISKRY }, (_, i) => (
            <span
              key={i}
              className={`oddech-iskra${i <= poziom * (ISKRY - 1) ? " jest-widoczna" : ""}`}
              style={{ "--kat": `${(360 / ISKRY) * i}deg`, "--zwloka": `${(i % 4) * 0.35}s` }}
            />
          ))}
        </div>

        <div
          ref={balonRef}
          className={`oddech-balon oddech-balon--${faza}`}
          style={{ transitionDuration: `${trwanie}s` }}
          aria-hidden="true"
        >
          <img src="/assets/porady/balon.png" alt="" draggable="false" />
          {/* Płytka ze słowem. Wszystkie napisy leżą JEDEN NA DRUGIM w tej
              samej komórce siatki i przełączają się przezroczystością, a nie
              podmianą treści. Dwie rzeczy naraz z tego wynikają: napisy
              przenikają się zamiast mrugać, a płytka ma stałą szerokość (tę
              najdłuższego słowa), więc nie skacze przy każdej zmianie fazy. */}
          <span className={`oddech-slowo oddech-slowo--${faza}`}>
            {/* Cień leży na NIEOBRACANEJ warstwie, a obraca się dopiero SVG
                w środku. Inaczej cień kręciłby się razem ze strzałką i przy
                wydechu padałby do góry — światło w scenie jest jedno i idzie
                z góry, niezależnie od tego, jak strzałka akurat stoi. */}
            <span className="oddech-strzalka" aria-hidden="true">
              <svg viewBox="0 0 32 32" style={{ rotate: `${kat}deg` }}>
                <defs>
                  <linearGradient id="oddech-strzalka-swiatlo" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#ffffff" stopOpacity=".42" />
                    <stop offset=".48" stopColor="#ffffff" stopOpacity=".06" />
                    <stop offset="1" stopColor="#1b2b45" stopOpacity=".2" />
                  </linearGradient>
                </defs>
                {/* Warstwa 1: pełny kolor fazy (przelewa się razem z napisem).
                    Warstwa 2: to samo, przykryte światłem i cieniem — stąd
                    wrażenie wypukłości bez malowania koloru na sztywno. */}
                <path className="oddech-strzalka-ksztalt" d={STRZALKA} />
                <path className="oddech-strzalka-swiatlo" d={STRZALKA} fill="url(#oddech-strzalka-swiatlo)" />
              </svg>
            </span>

            <span className="oddech-napisy">
              {["wdech", "wstrzymaj", "wydech"].map((f) => (
                <span
                  key={f}
                  className={`oddech-napis${faza === f ? " jest-teraz" : ""}`}
                  aria-hidden={faza === f ? undefined : "true"}
                >
                  {SLOWA[f]}
                </span>
              ))}
              <span className={`oddech-napis oddech-napis--licznik${faza === "odliczanie" ? " jest-teraz" : ""}`}>
                {licznik}
              </span>
            </span>
          </span>
        </div>

        {/* Pufy pary lecą do góry przy wydechu; klucz z numerem cyklu wymusza
            ponowne odegranie animacji przy każdym kolejnym oddechu. */}
        {faza === "wydech" ? (
          <div className="oddech-pufy" key={cykl} aria-hidden="true">
            <span /><span /><span />
          </div>
        ) : null}

        {/* Dwa sznurki: od łapek do węzełka. Rysujemy je NAD liskiem, ale POD
            balonem w kolejności wizualnej (z-index w CSS), więc końcówka ginie
            pod węzełkiem zamiast leżeć na nim kreską. */}
        {sznurki ? (
          <svg
            className="oddech-sznurki"
            width={sznurki.szer}
            height={sznurki.wys}
            viewBox={`0 0 ${sznurki.szer} ${sznurki.wys}`}
            aria-hidden="true"
          >
            {sznurki.lapki.map((lapka, i) => {
              /**
               * Sznurek OMIJA liska bokiem, zamiast iść prosto do węzełka.
               * Prosta z łapki do balonu przecinałaby głowę i uszy, a sznurki
               * leżą pod liskiem (z-index), więc w połowie drogi znikałyby
               * i pojawiały się znów nad czubkiem głowy.
               *
               * Krzywa sześcienna z dwoma punktami kontrolnymi wypchniętymi na
               * zewnątrz prowadzi go tuż przy krawędzi sylwetki: przy łapce
               * jest niemal pionowy, dopiero wysoko skręca do węzełka.
               */
              const naZewnatrz = (lapka.x < sznurki.wezel.x ? -1 : 1) * sznurki.odsun;
              const wysokosc = lapka.y - sznurki.wezel.y;
              return (
                <path
                  key={i}
                  d={
                    `M ${lapka.x} ${lapka.y} ` +
                    `C ${lapka.x + naZewnatrz} ${lapka.y - wysokosc * 0.3} ` +
                    `${lapka.x + naZewnatrz} ${sznurki.wezel.y + wysokosc * 0.12} ` +
                    `${sznurki.wezel.x} ${sznurki.wezel.y}`
                  }
                  fill="none"
                  stroke="rgba(230,180,60,.92)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              );
            })}
          </svg>
        ) : null}

        <img
          ref={lisRef}
          className="oddech-lisek"
          src="/assets/porady/lis-oddech.png"
          alt=""
          aria-hidden="true"
          draggable="false"
          onLoad={() => window.dispatchEvent(new Event("resize"))}
        />
      </div>

      {/* Płatki zamiast licznika: widać, ile zostało, ale nikt nie liczy. */}
      <div className="oddech-platki" aria-hidden="true">
        {Array.from({ length: CYKLE }, (_, i) => (
          <span key={i} className={`oddech-platek${i < zrobione ? " jest-pelny" : ""}`} />
        ))}
      </div>

      {faza === "koniec" ? (
        <div className="oddech-koniec">
          <p>Czujesz? Tak właśnie działa.</p>
          <button type="button" className="hub-btn hub-btn-primary" onClick={onKoniec}>
            Gotowe
          </button>
        </div>
      ) : null}
    </div>,
    document.body
  );
}
