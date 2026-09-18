/*!
 * SPDX-FileCopyrightText: © 2026 Amitiel Angelisme <armitiel@gmail.com>
 * SPDX-License-Identifier: LicenseRef-EwolucJA-Proprietary
 *
 * EwolucJA — gra edukacyjna dla dzieci.
 * Produkt powstał w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”;
 * autorskie prawa majątkowe pozostają przy autorze. Licencja: LICENSE.
 */
/**
 * PoradaAkcja — wykonanie porady w aplikacji (silniki inne niż `oddech`).
 *
 * ZASADA: nic tu nie tyka. Każdy silnik przełącza dziecko DOTKNIĘCIEM,
 * bez sekund i bez cyfr na ekranie (prompt §3 „nigdy odliczanie”; docs/tresci/04 §4.1).
 *
 *   szukanie — kropki do stuknięcia, ile wynika z `krok` (trzy / pięć…), bez „x z 5”;
 *   fazy     — kolejne fazy ruchu z `krok` (np. „strząśnij → zamrzyj → wydech”),
 *              następna po dotknięciu „Dalej” ALBO po końcu wydechu: faza ze
 *              słowem „wydech/oddech” dostaje kurczące się kółko w tempie pory
 *              (jak balon w `EkranOddechu`) i sama przechodzi dalej, gdy
 *              kółko zejdzie — bez sekund, bez cyfr;
 *   cisza    — ekran przygaszony, jedno dotknięcie „już cicho”;
 *   napiecie — „trzymaj” (napnij, palec na ekranie) → „puść”; trzy rundy.
 *
 * Portal na `document.body`, tak jak `EkranOddechu`.
 */
import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

/* Długość jednego wydechu za porą dnia — te same liczby, co `TEMPO` balonu
   w `EkranOddechu.jsx` (rano krócej, wieczorem dłużej); trzy pory biblioteki. */
const WYDECH_S = { poranek: 3.4, poludnie: 3.8, wieczor: 4.6 };

const SLOWNE = { jedn: 1, dw: 2, trz: 3, czter: 4, pięć: 5, pięci: 5, sześ: 6, siedm: 7, ośm: 8, dziewię: 9, dziesię: 10 };

/** Liczba z polecenia zapisana słownie („trzy rzeczy”) — bez cyfr w danych. */
function liczbaZKroku(krok, domyslna = 3) {
  const t = String(krok || "").toLowerCase();
  for (const [rdzen, n] of Object.entries(SLOWNE)) {
    if (new RegExp(`\\b${rdzen}\\w*`, "u").test(t)) return n;
  }
  return domyslna;
}

/** Fazy z polecenia: rozcięte na przecinkach i kropkach, bez ogonków typu „trzy razy”. */
function fazyZKroku(krok) {
  const czesci = String(krok || "")
    .split(/[.,;]\s*|\s+i\s+/u)
    .map((x) => x.trim())
    .filter((x) => x && !/^(trzy|dwa|pięć) razy$/iu.test(x) && !/^powtórz/iu.test(x));
  return czesci.length ? czesci : [String(krok || "")];
}

function Szukanie({ porada, onGotowe }) {
  const ile = useMemo(() => liczbaZKroku(porada?.krok, 3), [porada]);
  const [znalezione, setZnalezione] = useState(() => Array(ile).fill(false));
  const gotowe = znalezione.every(Boolean);
  return (
    <>
      <p className="porada-akcja-instrukcja">{porada?.krok}</p>
      <div className="porada-trop-listki" aria-label="Znalezione rzeczy">
        {znalezione.map((jest, i) => (
          <button
            key={i}
            type="button"
            className={jest ? "jest-znaleziony" : undefined}
            onClick={() => setZnalezione((o) => o.map((x, k) => (k === i ? true : x)))}
            disabled={jest}
            aria-label={jest ? "Znalezione" : "Znalazłem kolejną rzecz"}
          >
            <span aria-hidden="true" />
          </button>
        ))}
      </div>
      {gotowe ? (
        <button type="button" className="hub-btn hub-btn-primary porada-akcja-gotowe" onClick={onGotowe}>
          Mam wszystkie
        </button>
      ) : (
        <p className="porada-akcja-licznik">Dotknij listka, gdy coś znajdziesz.</p>
      )}
    </>
  );
}

function Fazy({ porada, onGotowe }) {
  const fazy = useMemo(() => fazyZKroku(porada?.krok), [porada]);
  const [krok, setKrok] = useState(0);
  const ostatnia = krok >= fazy.length - 1;
  const tekst = fazy[krok] || "";
  /* KONIEC WYDECHU PRZEŁĄCZA FAZĘ. Faza o wydechu pokazuje kółko, które
     kurczy się przez czas jednego wydechu; koniec przejścia CSS = koniec
     wydechu = następna faza (na ostatniej — zostaje „Zrobione"). Żadnego
     zegara na ekranie: dziecko widzi tylko, że kółko maleje. */
  const zWydechem = /wydech|oddech|wdech/iu.test(tekst);
  const dlugosc = WYDECH_S[porada?.slot] || 4;
  const [kurczy, setKurczy] = useState(false);
  useEffect(() => {
    setKurczy(false);
    if (!zWydechem) return undefined;
    const t = window.setTimeout(() => setKurczy(true), 120);
    return () => window.clearTimeout(t);
  }, [krok, zWydechem]);
  function dalej() { setKrok((k) => Math.min(fazy.length - 1, k + 1)); }
  return (
    <>
      <div className="porada-ruch-kropki" aria-label="Fazy ruchu">
        {fazy.map((_, i) => <span key={i} className={i <= krok ? "jest-pelna" : undefined} />)}
      </div>
      <p className="porada-ruch-polecenie">{tekst}</p>
      {zWydechem ? (
        <div className="porada-fazy-wydech" aria-hidden="true" style={{ display: "flex", justifyContent: "center", height: 120, alignItems: "center" }}>
          <span
            onTransitionEnd={() => { if (!ostatnia) dalej(); }}
            style={{
              display: "block", width: 110, height: 110, borderRadius: "50%",
              background: "radial-gradient(circle at 40% 35%, #fff6d6, #f2c14a)",
              boxShadow: "0 0 24px rgba(242,193,74,.45)",
              transform: kurczy ? "scale(.28)" : "scale(1)",
              transition: `transform ${dlugosc}s ease-in-out`,
            }}
          />
        </div>
      ) : null}
      {ostatnia ? (
        <button type="button" className="hub-btn hub-btn-primary porada-akcja-gotowe" onClick={onGotowe}>
          Zrobione
        </button>
      ) : (
        <button type="button" className="hub-btn hub-btn-primary porada-akcja-gotowe" onClick={dalej}>
          Dalej
        </button>
      )}
    </>
  );
}

function Cisza({ porada, onGotowe }) {
  return (
    <>
      <p className="porada-akcja-instrukcja">{porada?.krok}</p>
      <p className="porada-akcja-licznik">Posłuchaj. Dotknij, gdy będzie już cicho.</p>
      <button type="button" className="hub-btn hub-btn-primary porada-akcja-gotowe" onClick={onGotowe}>
        Już cicho
      </button>
    </>
  );
}

function Napiecie({ porada, onGotowe }) {
  const RUNDY = 3;
  const [runda, setRunda] = useState(0);
  const [trzyma, setTrzyma] = useState(false);
  const gotowe = runda >= RUNDY;
  function pusc() {
    if (!trzyma) return;
    setTrzyma(false);
    setRunda((r) => r + 1);
  }
  return (
    <>
      <p className="porada-akcja-instrukcja">{porada?.krok}</p>
      <div className="porada-ruch-kropki" aria-label="Rundy">
        {Array.from({ length: RUNDY }, (_, i) => <span key={i} className={i < runda ? "jest-pelna" : undefined} />)}
      </div>
      {gotowe ? (
        <button type="button" className="hub-btn hub-btn-primary porada-akcja-gotowe" onClick={onGotowe}>
          Zrobione
        </button>
      ) : (
        <button
          type="button"
          className={`hub-btn hub-btn-primary porada-akcja-gotowe${trzyma ? " jest-klik" : ""}`}
          onPointerDown={() => setTrzyma(true)}
          onPointerUp={pusc}
          onPointerCancel={pusc}
          onPointerLeave={pusc}
        >
          {trzyma ? "Trzymaj… i puść" : "Przytrzymaj, gdy napinasz"}
        </button>
      )}
    </>
  );
}

const SILNIKI = { szukanie: Szukanie, fazy: Fazy, cisza: Cisza, napiecie: Napiecie };

export default function PoradaAkcja({ porada, silnik, onZamknij, onUkonczone }) {
  const Silnik = SILNIKI[silnik];
  if (!porada || !Silnik) return null;
  const tytul = porada.title || "Mała chwila";
  return createPortal(
    <div className="porada-akcja-ekran" role="dialog" aria-modal="true" aria-label={tytul}>
      <button type="button" className="porada-akcja-zamknij" onClick={onZamknij} aria-label="Zamknij">×</button>
      <div className="porada-akcja-scena">
        <span className="porada-akcja-obraz">
          <img src="/assets/porady/lis-zdrowie-uniwersalny.png" alt="" aria-hidden="true" draggable="false" />
        </span>
        <h2>{tytul}</h2>
        <Silnik porada={porada} onGotowe={onUkonczone} />
      </div>
    </div>,
    document.body
  );
}
