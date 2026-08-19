/**
 * EkranOddechu — prowadzony oddech na pełnym ekranie.
 *
 * Dlaczego pełny ekran, a nie kafelek w panelu: to jedyny moment w całej
 * aplikacji, w którym nic się nie dzieje. Gdyby obok stały półki z poradami i
 * dok z zakładkami, dziecko wodziłoby po nich wzrokiem zamiast oddychać.
 *
 * Instrukcja jest podana TRZEMA kanałami naraz, bo sześciolatek jeszcze czyta
 * wolno, a dwunastolatek nie chce, żeby mu tłumaczyć:
 *   1. ruch  — koło rośnie i maleje; to jest kanał główny i wystarcza sam,
 *   2. słowo — jedno słowo w środku, nie zdanie,
 *   3. dźwięk — ton idący w górę na wdechu i w dół na wydechu.
 *
 * Rytm 4-4, bez wstrzymywania oddechu. Techniki typu 4-7-8 są dla dorosłych;
 * u dziecka wstrzymanie powoduje spinanie się zamiast rozluźnienia.
 *
 * Dźwięk chodzi tylko wtedy, gdy dziecko ma włączoną muzykę gry — wyciszona
 * gra ma zostać wyciszona, a sam ruch koła prowadzi równie dobrze.
 */
import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import bgMusic from "../services/bgMusic";

/** Tempo za porą dnia — rano krócej, wieczorem dłużej. */
const TEMPO = { rano: 3.4, poludnie: 3.8, popoludnie: 3.8, wieczor: 4.6, noc: 5 };
const CYKLE = 5;

const SLOWA = { wdech: "wdech", wydech: "wydech" };

export default function EkranOddechu({ pora = "poludnie", onKoniec }) {
  const dlugosc = TEMPO[pora] || 4;
  const [faza, setFaza] = useState("start");   // start | wdech | wydech | koniec
  const [cykl, setCykl] = useState(0);
  const dzwiek = useRef(null);

  const wolniej = useMemo(
    () => window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true,
    []
  );

  // ── Ton ──────────────────────────────────────────────────────────────
  // Jeden oscylator na cały seans, sterowany rampami. Włączanie i wyłączanie
  // go przy każdej fazie dawało słyszalne kliknięcia.
  useEffect(() => {
    if (!bgMusic.isEnabled()) return undefined;
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      const ctx = new Ctx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = 196;
      gain.gain.value = 0;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      dzwiek.current = { ctx, osc, gain };
    } catch { dzwiek.current = null; }
    return () => {
      const d = dzwiek.current;
      dzwiek.current = null;
      if (!d) return;
      try { d.gain.gain.cancelScheduledValues(d.ctx.currentTime); } catch {}
      try { d.osc.stop(); } catch {}
      try { d.ctx.close(); } catch {}
    };
  }, []);

  // ── Przebieg seansu ──────────────────────────────────────────────────
  useEffect(() => {
    if (faza === "koniec") return undefined;
    // Chwila ciszy na początku: dziecko ma zdążyć spojrzeć, zanim koło ruszy.
    if (faza === "start") {
      const t = window.setTimeout(() => setFaza("wdech"), 900);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(() => {
      if (faza === "wdech") { setFaza("wydech"); return; }
      if (cykl + 1 >= CYKLE) { setFaza("koniec"); return; }
      setCykl((c) => c + 1);
      setFaza("wdech");
    }, dlugosc * 1000);
    return () => window.clearTimeout(t);
  }, [faza, cykl, dlugosc]);

  // Ton i drgnięcie idą za fazą.
  useEffect(() => {
    const d = dzwiek.current;
    if (!d) return;
    const t = d.ctx.currentTime;
    const doGory = faza === "wdech";
    try {
      d.osc.frequency.cancelScheduledValues(t);
      d.osc.frequency.setValueAtTime(d.osc.frequency.value, t);
      d.gain.gain.cancelScheduledValues(t);
      d.gain.gain.setValueAtTime(d.gain.gain.value, t);
      if (faza === "koniec" || faza === "start") {
        d.gain.gain.linearRampToValueAtTime(0, t + 0.8);
        return;
      }
      d.osc.frequency.linearRampToValueAtTime(doGory ? 294 : 196, t + dlugosc);
      d.gain.gain.linearRampToValueAtTime(doGory ? 0.05 : 0.014, t + dlugosc * 0.9);
    } catch {}
  }, [faza, dlugosc]);

  useEffect(() => {
    if (faza !== "wdech" && faza !== "wydech") return;
    try { navigator.vibrate?.(10); } catch {}
  }, [faza]);

  const zrobione = faza === "koniec" ? CYKLE : cykl;

  return createPortal(
    <div className="oddech-ekran" role="dialog" aria-modal="true" aria-label="Oddech">
      <button type="button" className="oddech-zamknij" onClick={onKoniec} aria-label="Zamknij">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.4 6.4l11.2 11.2M17.6 6.4L6.4 17.6" /></svg>
      </button>

      <div
        className={`oddech-kolo oddech-kolo--${faza}${wolniej ? " bez-ruchu" : ""}`}
        style={{ transitionDuration: `${dlugosc}s` }}
        aria-hidden="true"
      >
        <span>{faza === "koniec" ? "" : SLOWA[faza] || "gotów?"}</span>
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
