/*!
 * SPDX-FileCopyrightText: © 2026 Amitiel Angelisme <armitiel@gmail.com>
 * SPDX-License-Identifier: LicenseRef-EwolucJA-Proprietary
 *
 * EwolucJA — gra edukacyjna dla dzieci.
 * Produkt powstał w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”;
 * autorskie prawa majątkowe pozostają przy autorze. Licencja: LICENSE.
 */
/**
 * SladWybor — ŚLAD Z TRZECH OPCJI (05 W2, 01 R9): trzy kartki z obrazkiem,
 * wybór jest pełnoprawnym śladem, zdanie niżej to dodatek. Wspólne dla
 * zadań Koła (`ZadaniePanel`) i hybryd (`HybrydaPanel`) — jeden wygląd,
 * jedno zachowanie: ponowne dotknięcie wybranej kartki zdejmuje wybór.
 *
 * `obrazek(nazwa)` daje znak dla nazwy z `slad.obrazki` (dziś emoji, docelowo
 * rysunki w stylu claymorphism). `o` odmienia tokeny `{m|ż}` pod gracza.
 */
import React from "react";

export default function SladWybor({ opcje = [], obrazki = [], wybrana = null, onWybor, obrazek, o = (t) => t, testId = "zadanie-slad" }) {
  if (!opcje.length) return null;
  return (
    <div className={`zadanie-miejsca zadanie-slad${Number.isInteger(wybrana) ? " ma-wybor" : ""}`} data-testid={testId}>
      {opcje.map((opcja, i) => (
        <button
          key={i}
          type="button"
          className={`zadanie-miejsce${wybrana === i ? " is-wybrane" : ""}`}
          onClick={() => onWybor?.(wybrana === i ? null : i)}
        >
          <span className="zadanie-pinezka" aria-hidden="true" />
          <span className="zadanie-miejsce-emoji" aria-hidden="true">{obrazek ? obrazek(obrazki?.[i]) : "✦"}</span>
          <strong>{o(opcja)}</strong>
        </button>
      ))}
    </div>
  );
}
