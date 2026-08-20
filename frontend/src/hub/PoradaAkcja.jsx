import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const RUCHY = [
  "Potrząśnij dłońmi",
  "Unieś ramiona wysoko",
  "Ziewnij i opuść barki",
];

function Trop({ onGotowe }) {
  const [slady, setSlady] = useState(() => Array(5).fill(false));
  const ile = slady.filter(Boolean).length;

  function znajdz(indeks) {
    setSlady((obecne) => obecne.map((stan, i) => (i === indeks ? true : stan)));
  }

  return (
    <>
      <p className="porada-akcja-instrukcja">
        Rozejrzyj się. Gdy znajdziesz coś zielonego, dotknij kolejnego listka.
      </p>
      <div className="porada-trop-listki" aria-label={`Znalezione zielone rzeczy: ${ile} z 5`}>
        {slady.map((znaleziony, i) => (
          <button
            key={i}
            type="button"
            className={znaleziony ? "jest-znaleziony" : undefined}
            onClick={() => znajdz(i)}
            disabled={znaleziony}
            aria-label={znaleziony ? `Ślad ${i + 1} znaleziony` : `Znalazłem ślad ${i + 1}`}
          >
            <span aria-hidden="true" />
          </button>
        ))}
      </div>
      {ile === 5 ? (
        <button type="button" className="hub-btn hub-btn-primary porada-akcja-gotowe" onClick={onGotowe}>
          Mam wszystkie!
        </button>
      ) : (
        <p className="porada-akcja-licznik">{ile} z 5 śladów</p>
      )}
    </>
  );
}

function Ruch({ onGotowe }) {
  const [krok, setKrok] = useState(0);
  const [sekundy, setSekundy] = useState(5);
  const skonczone = krok >= RUCHY.length;

  useEffect(() => {
    if (skonczone) return undefined;
    const zegar = window.setTimeout(() => {
      if (sekundy > 1) {
        setSekundy((s) => s - 1);
      } else {
        setKrok((k) => k + 1);
        setSekundy(5);
      }
    }, 1000);
    return () => window.clearTimeout(zegar);
  }, [krok, sekundy, skonczone]);

  return (
    <>
      <div className="porada-ruch-kropki" aria-label={`Ruch ${Math.min(krok + 1, 3)} z 3`}>
        {RUCHY.map((_, i) => <span key={i} className={i <= krok ? "jest-pelna" : undefined} />)}
      </div>
      {skonczone ? (
        <>
          <p className="porada-akcja-instrukcja">Gotowe. Puść łapki luźno i sprawdź, czy są lżejsze.</p>
          <button type="button" className="hub-btn hub-btn-primary porada-akcja-gotowe" onClick={onGotowe}>
            Czuję różnicę
          </button>
        </>
      ) : (
        <>
          <p className="porada-ruch-polecenie">{RUCHY[krok]}</p>
          <div className="porada-ruch-czas" aria-live="polite">{sekundy}</div>
        </>
      )}
    </>
  );
}

export default function PoradaAkcja({ karta, onZamknij, onUkonczone }) {
  const tytul = karta?.tytul || "Mała chwila";
  if (!karta || karta.akcja === "oddech") return null;

  return createPortal(
    <div className="porada-akcja-ekran" role="dialog" aria-modal="true" aria-label={tytul}>
      <button type="button" className="porada-akcja-zamknij" onClick={onZamknij} aria-label="Zamknij">×</button>
      <div className="porada-akcja-scena">
        <span className="porada-akcja-obraz">
          <img src={karta.ilustracja} alt="" aria-hidden="true" draggable="false" />
        </span>
        <h2>{tytul}</h2>
        {karta.akcja === "trop" ? <Trop onGotowe={onUkonczone} /> : <Ruch onGotowe={onUkonczone} />}
      </div>
    </div>,
    document.body
  );
}
