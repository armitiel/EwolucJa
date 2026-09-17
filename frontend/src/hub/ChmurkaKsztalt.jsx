/*!
 * SPDX-FileCopyrightText: © 2026 Amitiel Angelisme <armitiel@gmail.com>
 * SPDX-License-Identifier: LicenseRef-EwolucJA-Proprietary
 *
 * EwolucJA — gra edukacyjna dla dzieci.
 * Produkt powstał w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”;
 * autorskie prawa majątkowe pozostają przy autorze. Licencja: LICENSE.
 */
/**
 * ChmurkaKsztalt — obła chmura myśli jako jedna grafika SVG.
 *
 * JEDEN KSZTAŁT DLA DWÓCH CHMUREK. Rysuje ją i chmurka zadania liska (ikony),
 * i powiadomienie Wizkora (tekst). Różnią się WYŁĄCZNIE proporcją pola
 * i barwą `--chmurka-akcent` — reszta (lamówka, glina, cień) idzie
 * z `public/tokeny.css`, sekcja 7, razem z dymkami `Reflektor`.
 *
 * DWIE WARSTWY KÓŁ, NIE OBRYS. Bryła to cztery–siedem zachodzących na siebie
 * kół. Gdyby każde dostało `stroke`, w środku chmury widać by było kreski na
 * stykach. Dlatego pod spodem leży ta sama grupa kół powiększona o `rant`
 * i wypełniona barwą lamówki, a na wierzchu kładzie się bryła w glinie.
 *
 * DLACZEGO `rant` JEST INNY W KAŻDYM WARIANCIE. Lamówka ma mieć na ekranie
 * te same ~4 px, co reszta rodziny (`--chmurka-lamowka`). Jednostki SVG
 * skalują się do szerokości elementu, więc mała chmurka (260 j. → ~130 px)
 * potrzebuje grubszego rantu w jednostkach niż szeroka (440 j. → ~390 px).
 * Liczby są przeliczone, nie dobrane na oko.
 */
import React, { useId } from "react";
import "../styles/chmurka-ksztalt.css";

const WARIANTY = {
  /* Kwadratowa — mieści jedną ikonę. Ogon celuje w awatar NAD chmurką. */
  ikona: {
    pole: [260, 200],
    rant: 8,
    glina: [50, 188],
    bryla: [[72, 126, 44], [128, 102, 52], [186, 126, 40], [124, 144, 44]],
    ogony: { "gora-lewo": [[50, 52, 14], [28, 20, 8]] },
  },
  /* Szeroka — mieści kilka linijek tekstu. Ogon celuje w awatar POD nią. */
  tekst: {
    pole: [440, 262],
    rant: 4.6,
    glina: [20, 222],
    bryla: [
      [86, 118, 58], [168, 88, 68], [262, 86, 66], [352, 116, 58],
      [140, 152, 62], [230, 160, 62], [318, 152, 60],
    ],
    ogony: { "dol-lewo": [[66, 216, 13], [38, 246, 8]] },
  },
};

export default function ChmurkaKsztalt({ wariant = "ikona", ogon = null, className = "" }) {
  const w = WARIANTY[wariant] || WARIANTY.ikona;
  const [szer, wys] = w.pole;
  const [gora, dol] = w.glina;

  /* Gradient musi mieć unikalny `id` — dwie chmurki potrafią stać na ekranie
     naraz (zadanie liska + porada Wizkora), a powtórzony `id` sprawiłby, że
     druga bierze definicję pierwszej. */
  const grad = `chmurka-glina-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const kropki = (ogon && w.ogony[ogon]) || [];

  return (
    <svg
      className={`chmurka-ksztalt${className ? ` ${className}` : ""}`}
      viewBox={`0 0 ${szer} ${wys}`}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        {/* userSpaceOnUse i zakres liczony od góry SAMEJ bryły (bez ogona) —
            tak samo jak w ścieżce liska, patrz komentarz w `tokeny.css`. */}
        <linearGradient className="chmurka-ksztalt-glina" id={grad} gradientUnits="userSpaceOnUse" x1="0" y1={gora} x2="0" y2={dol}>
          <stop offset="0" />
          <stop offset="0.1" />
          <stop offset="0.9" />
          <stop offset="0.955" />
          <stop offset="1" />
        </linearGradient>
      </defs>

      <g className="chmurka-ksztalt-rant">
        {w.bryla.map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy} r={r + w.rant} />)}
      </g>
      <g fill={`url(#${grad})`}>
        {w.bryla.map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy} r={r} />)}
      </g>

      {kropki.map(([cx, cy, r], i) => (
        <g key={i} className={`chmurka-ksztalt-kropka chmurka-ksztalt-kropka--${i + 1}`}>
          <circle className="chmurka-ksztalt-rant" cx={cx} cy={cy} r={r + w.rant} />
          <circle cx={cx} cy={cy} r={r} fill={`url(#${grad})`} />
        </g>
      ))}
    </svg>
  );
}

/** Proporcja pola — komponenty ustawiają z niej `aspect-ratio`. */
export function proporcjaChmurki(wariant = "ikona") {
  const [szer, wys] = (WARIANTY[wariant] || WARIANTY.ikona).pole;
  return `${szer} / ${wys}`;
}
