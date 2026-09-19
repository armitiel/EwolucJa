/*!
 * SPDX-FileCopyrightText: © 2026 Amitiel Angelisme <armitiel@gmail.com>
 * SPDX-License-Identifier: LicenseRef-EwolucJA-Proprietary
 *
 * EwolucJA — gra edukacyjna dla dzieci.
 * Produkt powstał w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”;
 * autorskie prawa majątkowe pozostają przy autorze. Licencja: LICENSE.
 */
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
 * Kształt i barwy idą z `ChmurkaKsztalt` — ta sama chmura, co w powiadomieniu
 * Wizkora, tylko w barwie liska (`--chmurka-akcent: --pomarancz-500`).
 */
import React, { useEffect, useRef, useState } from "react";
import Dymek from "./Dymek.jsx";
import "../styles/chmurka-zadania.css";

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
    /* WARIANT „KROPKI" WSPÓLNEGO DYMKA (`hub/Dymek.jsx`). Dwie pulsujące
       kropki zamiast dzióbka to jedyne rozróżnienie idiomu, jakie ta gra ma:
       dzióbek mówi „ktoś to POWIEDZIAŁ", kropki — „ktoś to sobie POMYŚLAŁ".
       Obłok z kółek zostaje świadomie (decyzja właściciela, 19.09.2026), ale
       lamówka, glina, cień i barwa idą już z tego samego miejsca, co reszta. */
    <Dymek
      ogon="kropki"
      kierunek="gora-lewo"
      className={`chmurka-zadania${schodzi ? " jest-schodzaca" : ""}`}
      role="status"
      aria-label={opis ? `Do zrobienia: ${opis}` : "Do zrobienia"}
      data-testid="hub-chmurka-zadania"
    >
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
    </Dymek>
  );
}
