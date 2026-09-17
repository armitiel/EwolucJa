/**
 * ChmurkaZadania — „co jest do zrobienia", w chmurce myśli nad awatarem.
 *
 * PO CO TO ISTNIEJE. Wizkor mówi zadanie zdaniem („Budujemy pomost na
 * drzewie!"), a zdanie znika razem z oknem. Sześciolatek zostaje wtedy
 * z toastem, który też schodzi, i z licznikiem, który pokazuje STAN, a nie
 * CZYNNOŚĆ. Brakowało jednej rzeczy: obrazka tego, czego zadanie wymaga.
 * Chmurka wychodzi od awatara — czyli od SAMEGO DZIECKA, nie od Wizkora —
 * i pokazuje to bez ani jednego słowa: drzewo, siekiera, drzewo, siekiera.
 *
 * DLACZEGO KARUZELA, A NIE DWIE IKONY OBOK SIEBIE. Dwie ikony naraz czyta
 * się jak listę składników. Jedna po drugiej, z wjazdem z prawej, czyta się
 * jak myśl, która się rozwija — a przy okazji każda ikona dostaje cały
 * środek chmurki i jest dwa razy większa niż w parze.
 *
 * DLACZEGO ZNIKA SAMA. To nie jest wskaźnik stanu — od tego są liczniki
 * w pasku HUD (`game-hud-counter--drewno`). To jest podanie zadania do ręki
 * w chwili, w której zadanie się zaczyna. Po kilku obrotach schodzi i nie
 * zaśmieca ekranu.
 *
 * Kształt rysujemy dwiema warstwami kół (ciemne większe pod spodem, jasne
 * mniejsze na wierzchu) zamiast obrysu — cztery zachodzące na siebie koła
 * z `stroke` pokazałyby kreski w środku bryły.
 */
import React, { useEffect, useRef, useState } from "react";
import "../styles/chmurka-zadania.css";

/* Bryła chmurki i ogonek — układ współrzędnych 260×200. `o` to grubość
   ciemnego rantu: ciemne koło ma promień r+o, jasne dokładnie r. */
const O = 4.6;
const BRYLA = [
  [72, 126, 44],
  [128, 102, 52],
  [186, 126, 40],
  [124, 144, 44],
];
const OGONEK = [
  [50, 52, 14],
  [28, 20, 8],
];

export default function ChmurkaZadania({
  /** Lista `{ src, opis }` — kolejność w karuzeli. Pusta lista = nic nie ma. */
  ikony,
  /** Ile trwa jeden obrót karuzeli. */
  krok = 1500,
  /** Po jakim czasie chmurka schodzi z ekranu. */
  czas = 8200,
  onKoniec,
}) {
  const lista = Array.isArray(ikony) ? ikony.filter(Boolean) : [];
  const ile = lista.length;

  const [teraz, setTeraz] = useState(0);
  const [poprzednia, setPoprzednia] = useState(-1);
  const [schodzi, setSchodzi] = useState(false);

  /* `onKoniec` przez ref — wołający zwykle podaje świeżą domknietą funkcję
     przy każdym renderze, a to nie może restartować odliczania. */
  const koniecRef = useRef(onKoniec);
  koniecRef.current = onKoniec;

  /* Klucz listy: dopóki ikony są te same, karuzela ma się nie zaczynać od
     nowa przy każdym renderze rodzica. */
  const klucz = lista.map((i) => i.src).join("|");

  useEffect(() => {
    if (!ile) return undefined;
    setTeraz(0);
    setPoprzednia(-1);
    setSchodzi(false);

    /* Jedna ikona = nie ma czego przewijać; chmurka po prostu ją trzyma. */
    const obrot = ile > 1
      ? window.setInterval(() => {
          setTeraz((i) => {
            setPoprzednia(i);
            return (i + 1) % ile;
          });
        }, krok)
      : 0;

    const zejscie = window.setTimeout(() => setSchodzi(true), czas);
    const koniec = window.setTimeout(() => koniecRef.current?.(), czas + 380);
    return () => {
      if (obrot) window.clearInterval(obrot);
      window.clearTimeout(zejscie);
      window.clearTimeout(koniec);
    };
  }, [klucz, ile, krok, czas]);

  /* Ikona, która właśnie wyjechała w lewo, musi wrócić na prawą stronę —
     inaczej przy dwóch ikonach co drugi wjazd szedłby pod prąd. Wraca po
     zakończeniu przejścia, więc skok dzieje się przy zerowej widoczności. */
  useEffect(() => {
    if (poprzednia < 0) return undefined;
    const t = window.setTimeout(() => setPoprzednia(-1), 480);
    return () => window.clearTimeout(t);
  }, [poprzednia]);

  if (!ile) return null;

  const opis = lista.map((i) => i.opis).filter(Boolean).join(", ");

  return (
    <div
      className={`chmurka-zadania${schodzi ? " jest-schodzaca" : ""}`}
      role="status"
      aria-label={opis ? `Do zrobienia: ${opis}` : "Do zrobienia"}
      data-testid="hub-chmurka-zadania"
    >
      <svg
        className="chmurka-zadania-ksztalt"
        viewBox="0 0 260 200"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          {/* userSpaceOnUse, bo gradient ma iść przez CAŁĄ bryłę, a nie
              powtórzyć się osobno w każdym z czterech kół. */}
          <linearGradient id="chmurka-zadania-jasnosc" gradientUnits="userSpaceOnUse" x1="0" y1="48" x2="0" y2="192">
            <stop offset="0" stopColor="#fffdf7" />
            <stop offset="1" stopColor="#f3e7cd" />
          </linearGradient>
        </defs>

        <g className="chmurka-zadania-rant">
          {BRYLA.map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy} r={r + O} />)}
        </g>
        <g className="chmurka-zadania-bryla">
          {BRYLA.map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy} r={r} />)}
        </g>

        {OGONEK.map(([cx, cy, r], i) => (
          <g key={i} className={`chmurka-zadania-kropka chmurka-zadania-kropka--${i + 1}`}>
            <circle className="chmurka-zadania-rant" cx={cx} cy={cy} r={r + O} />
            <circle className="chmurka-zadania-bryla" cx={cx} cy={cy} r={r} />
          </g>
        ))}
      </svg>

      <div className="chmurka-zadania-scena">
        {lista.map((ikona, i) => (
          <img
            key={ikona.src}
            className="chmurka-zadania-ikona"
            data-stan={i === teraz ? "jest" : i === poprzednia ? "wychodzi" : "czeka"}
            src={ikona.src}
            alt=""
            aria-hidden="true"
            draggable="false"
          />
        ))}
      </div>
    </div>
  );
}
