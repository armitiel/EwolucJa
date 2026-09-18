/*!
 * SPDX-FileCopyrightText: © 2026 Amitiel Angelisme <armitiel@gmail.com>
 * SPDX-License-Identifier: LicenseRef-EwolucJA-Proprietary
 *
 * EwolucJA — gra edukacyjna dla dzieci.
 * Produkt powstał w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”;
 * autorskie prawa majątkowe pozostają przy autorze. Licencja: LICENSE.
 */
/**
 * MiejscaZadania — „Gdzie możesz to zrobić?": karteczki jak w Poradach dnia
 * (papier, pinezka, jedno zdanie). Nie lista wymagań: wybór niczego nie
 * blokuje, jest po to, żeby dziecko przestało szukać „gdzie" i zaczęło robić.
 * Wspólne dla zadań Koła i hybryd; zapis wyboru robi wołający (`onWybor`).
 */
import React from "react";

export default function MiejscaZadania({ miejsca = [], wybrane = null, onWybor, o = (t) => t, naglowek = "Gdzie możesz to zrobić?" }) {
  if (!miejsca.length) return null;
  return (
    <>
      <h3 className="czat-naglowek">{o(naglowek)}</h3>
      <div className={`zadanie-miejsca${wybrane ? " ma-wybor" : ""}`}>
        {miejsca.map((m) => (
          <button
            key={m.id}
            type="button"
            className={`zadanie-miejsce${wybrane === m.id ? " is-wybrane" : ""}`}
            onClick={() => onWybor?.(wybrane === m.id ? null : m.id)}
          >
            <span className="zadanie-pinezka" aria-hidden="true" />
            <span className="zadanie-miejsce-emoji" aria-hidden="true">{m.emoji}</span>
            <strong>{o(m.nazwa)}</strong>
            {wybrane === m.id ? <small>{o(m.opis)}</small> : null}
          </button>
        ))}
      </div>
    </>
  );
}
