/**
 * EkranOddechu — prowadzony oddech na pełnym ekranie.
 *
 * Dlaczego pełny ekran, a nie kafelek w panelu: to jedyny moment w całej
 * aplikacji, w którym nic się nie dzieje. Gdyby obok stały półki z poradami i
 * dok z zakładkami, dziecko wodziłoby po nich wzrokiem zamiast oddychać.
 *
 * Instrukcja jest podana TRZEMA kanałami naraz, bo sześciolatek jeszcze czyta
 * wolno, a dwunastolatek nie chce, żeby mu tłumaczyć:
 *   1. ruch  — koło rośnie, zatrzymuje się i maleje; kanał główny, wystarcza sam,
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

export default function EkranOddechu({ pora = "poludnie", onKoniec }) {
  const dlugosc = TEMPO[pora] || 4;
  const wstrzymanie = Math.min(1.6, dlugosc * 0.4);
  const [faza, setFaza] = useState("start");   // start | wdech | wstrzymaj | wydech | koniec
  const [cykl, setCykl] = useState(0);
  const audio = useRef(null);

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
    if (faza === "start") {
      const t = window.setTimeout(() => setFaza("wdech"), 900);
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
  }, [faza, cykl, dlugosc, wstrzymanie]);

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

      if (faza === "koniec" || faza === "start") {
        a.master.gain.linearRampToValueAtTime(0, t + 1);
        a.filtr.frequency.linearRampToValueAtTime(420, t + 1);
        if (faza === "koniec") {
          dzwonek(TONY[TONY.length - 1] * 2, 0.06);
          window.setTimeout(() => dzwonek(TONY[TONY.length - 1] * 3, 0.045), 180);
        }
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

  useEffect(() => {
    if (faza === "start" || faza === "koniec") return;
    try { navigator.vibrate?.(faza === "wstrzymaj" ? 6 : 12); } catch {}
  }, [faza]);

  const zrobione = faza === "koniec" ? CYKLE : cykl;
  const poziom = faza === "koniec" ? 1 : cykl / (CYKLE - 1);
  const trwanie = faza === "wstrzymaj" ? 0.25 : dlugosc;

  return createPortal(
    <div
      className={`oddech-ekran${wolniej ? " bez-ruchu" : ""}`}
      style={{ "--poziom": poziom }}
      role="dialog"
      aria-modal="true"
      aria-label="Oddech"
    >
      <button type="button" className="oddech-zamknij" onClick={onKoniec} aria-label="Zamknij">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.4 6.4l11.2 11.2M17.6 6.4L6.4 17.6" /></svg>
      </button>

      <div className="oddech-scena">
        {/* Poswiata jest OSOBNYM elementem, a nie cieniem kola: animowany
            box-shadow ląduje w kompozytowanej warstwie i jego rozmycie urywa
            sie na prostokacie tej warstwy - dokola kola widac bylo jasny
            kwadrat. Gradient wewnatrz wlasnego pudelka nie ma tego problemu. */}
        <span className="oddech-poswiata" aria-hidden="true" />
        {/* Iskry krążą wokół koła. Przy pierwszym oddechu są dwie, przy piątym
            wszystkie — to jest cała „rosnąca ekscytacja", bez fajerwerków. */}
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
          className={`oddech-kolo oddech-kolo--${faza}`}
          style={{ transitionDuration: `${trwanie}s` }}
          aria-hidden="true"
        >
          <span>{faza === "koniec" ? "" : SLOWA[faza] || "gotów?"}</span>
        </div>
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
