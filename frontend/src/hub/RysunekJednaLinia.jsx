/**
 * RysunekJednaLinia — karta „jedna rzecz z dziś, jedną linią".
 *
 * Wizkor prosi o to o zachodzie. Zasady są celowo ciasne, bo to ma być odcisk
 * dnia, nie konkurs rysunkowy: jedna ciągła kreska, bez odrywania palca,
 * bez gumki, bez kolorów. Odrywasz palec — linia jest skończona. Chcesz
 * inaczej — „Jeszcze raz" czyści całość. Dzięki temu nie ma wyniku „słabo
 * narysowane": jest linia albo jej nie ma.
 *
 * Ten sam wzorzec nakładki, co Koło Przeznaczenia (`KoloFortuny`): pełne
 * przyciemnienie, jedna karta, ten sam krzyżyk zamykania. Reszta stylu
 * w `styles/rysunek.css`.
 *
 * Podgląd maluje `namalujRysunek` z `ramkaDomku.js` — TA SAMA funkcja, która
 * potem robi teksturę do ramki w domku. Dziecko widzi w domku dokładnie to,
 * co widziało tu.
 */
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  MAX_PUNKTOW, MIN_DLUGOSC, dlugoscLinii, namalujRysunek, normalizujPunkty, zapiszRysunek,
} from "./ramkaDomku.js";
import "../styles/rysunek.css";

/* Rozdzielczość płótna roboczego. Punkty i tak wychodzą znormalizowane,
   więc liczba jest tylko o ostrości kreski na ekranie. */
const BOK = 640;
/* Minimalny odstęp między zapisanymi punktami (piksele płótna) — palec
   zgłasza ruch co ułamek milimetra, a nam wystarczy kształt. */
const KROK = 5;

export default function RysunekJednaLinia({ onGotowe, onZamknij }) {
  const plotno = useRef(null);
  const punkty = useRef([]);          // piksele płótna, w trakcie rysowania
  const rysuje = useRef(false);
  const [zamknieta, setZamknieta] = useState(false);   // palec oderwany — linia gotowa
  const [zaKrotko, setZaKrotko] = useState(false);
  const [ile, setIle] = useState(0);

  const odmaluj = useCallback(() => {
    const c = plotno.current;
    if (!c) return;
    const P = punkty.current;
    namalujRysunek(c, P.length >= 2 ? { punkty: normalizujPunkty(P, c.width, c.height) } : null);
  }, []);

  useEffect(() => { odmaluj(); }, [odmaluj]);

  /* Współrzędne wskaźnika → piksele płótna. Płótno jest kwadratowe i skalowane
     CSS-em, więc jeden mnożnik na oś wystarczy. */
  const pozycja = (ev) => {
    const c = plotno.current;
    const r = c.getBoundingClientRect();
    return [
      ((ev.clientX - r.left) / r.width) * c.width,
      ((ev.clientY - r.top) / r.height) * c.height,
    ];
  };

  const start = (ev) => {
    if (zamknieta) return;                 // jedna linia — druga nie ma prawa się zacząć
    ev.preventDefault();
    plotno.current?.setPointerCapture?.(ev.pointerId);
    rysuje.current = true;
    punkty.current = [pozycja(ev)];
    setZaKrotko(false);
  };

  const ruch = (ev) => {
    if (!rysuje.current) return;
    ev.preventDefault();
    const P = punkty.current;
    if (P.length >= MAX_PUNKTOW) return;   // dość na kształt, za mało na portret
    const [x, y] = pozycja(ev);
    const ost = P[P.length - 1];
    if (Math.hypot(x - ost[0], y - ost[1]) < KROK) return;
    P.push([x, y]);
    setIle(P.length);
    odmaluj();
  };

  const koniec = (ev) => {
    if (!rysuje.current) return;
    ev.preventDefault();
    rysuje.current = false;
    const c = plotno.current;
    const n = normalizujPunkty(punkty.current, c.width, c.height);
    if (dlugoscLinii(n) < MIN_DLUGOSC) {
      // kropka to jeszcze nie linia — bez oceny, po prostu jeszcze raz
      punkty.current = [];
      setIle(0);
      setZaKrotko(true);
      odmaluj();
      return;
    }
    setZamknieta(true);
  };

  const jeszczeRaz = () => {
    punkty.current = [];
    setIle(0);
    setZamknieta(false);
    setZaKrotko(false);
    odmaluj();
  };

  const powies = () => {
    const c = plotno.current;
    const wpis = zapiszRysunek(normalizujPunkty(punkty.current, c.width, c.height), { zrodlo: "zachod" });
    if (wpis) onGotowe?.(wpis);
  };

  return (
    <div className="rysunek-tlo" data-testid="rysunek-jedna-linia">
      <div className="rysunek-karta">
        <button type="button" className="popup-postaci-zamknij rysunek-x" onClick={onZamknij} aria-label="Zamknij" title="Zamknij">×</button>
        <p className="rysunek-nadtytul">Wizkor prosi</p>
        <h2 className="rysunek-tytul">Jedna rzecz z dziś</h2>
        <p className="rysunek-opis">
          {zamknieta
            ? "Gotowe. Powieszę to w domku."
            : zaKrotko
              ? "Za krótko na linię. Spróbuj dłuższą."
              : "Narysuj ją jedną linią. Nie odrywaj palca — jak oderwiesz, linia jest skończona."}
        </p>
        <div className={"rysunek-plotno-ramka" + (zamknieta ? " is-gotowe" : "")}>
          <canvas
            ref={plotno}
            className="rysunek-plotno"
            width={BOK}
            height={BOK}
            onPointerDown={start}
            onPointerMove={ruch}
            onPointerUp={koniec}
            onPointerCancel={koniec}
            onPointerLeave={koniec}
            aria-label="Płótno — narysuj swój dzień jedną linią"
          />
        </div>
        <div className="rysunek-przyciski">
          <button type="button" className="hub-btn btn-block rysunek-btn" onClick={jeszczeRaz} disabled={ile === 0 && !zamknieta}>
            Jeszcze raz
          </button>
          <button type="button" className="hub-btn hub-btn-primary btn-block rysunek-btn" onClick={powies} disabled={!zamknieta}>
            Powieś w domku
          </button>
        </div>
      </div>
    </div>
  );
}
