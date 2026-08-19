/**
 * PytanieSpotkania — „lis kogoś spotkał, zagadać?"
 *
 * Osobny, MAŁY krok przed właściwym oknem postaci i to jest celowe: dziecko
 * biega po mapie i wpada na czarodzieja przypadkiem. Bez pytania każde
 * muśnięcie ramieniem otwierałoby pełne okno z tekstem i przerywało zabawę.
 * Tutaj decyzja kosztuje jedno dotknięcie, a „nie teraz" nie zabiera nic.
 *
 * Kształt jest z tej samej rodziny co `PopupPostaci` (ta sama zasłona, ten sam
 * pergamin, ta sama wstęga), tylko węższy i bez wstęgi z imieniem — imię pada
 * dopiero w oknie właściwym, bo to ono jest przedstawieniem postaci.
 */
import React, { useEffect, useRef } from "react";

export default function PytanieSpotkania({
  otwarte = false,
  obrazek = "/wizPop.webp",
  tekst = "Ktoś stoi na polanie i patrzy w twoją stronę.",
  potwierdz = "Zagadaj",
  odrzuc = "Nie teraz",
  onTak,
  onNie,
}) {
  const takRef = useRef(null);

  useEffect(() => {
    if (!otwarte) return undefined;
    const naKlawisz = (e) => { if (e.key === "Escape") onNie?.(); };
    window.addEventListener("keydown", naKlawisz);
    return () => window.removeEventListener("keydown", naKlawisz);
  }, [otwarte, onNie]);

  useEffect(() => {
    if (!otwarte) return undefined;
    const t = window.setTimeout(() => {
      try { takRef.current?.focus({ preventScroll: true }); } catch {}
    }, 300);
    return () => window.clearTimeout(t);
  }, [otwarte]);

  if (!otwarte) return null;

  return (
    <div className="popup-postaci popup-pytanie" data-testid="pytanie-spotkania">
      {/* Dotknięcie obok = „nie teraz". Zamknięcie bez decyzji nie istnieje:
          każde wyjście z tego okna oznacza, że dziecko nie chce rozmawiać. */}
      <div className="popup-postaci-zaslona" onClick={() => onNie?.()} aria-hidden="true" />

      <div className="popup-postaci-karta" role="dialog" aria-modal="true" aria-label="Spotkanie">
        <img
          className="popup-postaci-bohater"
          src={obrazek}
          alt=""
          aria-hidden="true"
          draggable="false"
        />
        {/* Krzyzyk robi to samo, co "nie teraz" - ale dziecko szuka go odruchowo
            w rogu, bo tak zamyka sie kazde inne okno w grze. */}
        <button
          type="button"
          className="popup-postaci-zamknij"
          onClick={() => onNie?.()}
          aria-label="Zamknij"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M6.4 6.4l11.2 11.2M17.6 6.4L6.4 17.6" />
          </svg>
        </button>

        <p className="popup-postaci-tekst popup-pytanie-tekst">{tekst}</p>
        <div className="popup-pytanie-wybor">
          <button
            type="button"
            ref={takRef}
            className="hub-btn hub-btn-primary popup-pytanie-tak"
            onClick={() => onTak?.()}
            data-testid="pytanie-tak"
          >
            {potwierdz}
          </button>
          <button
            type="button"
            className="hub-btn hub-btn-ghost popup-pytanie-nie"
            onClick={() => onNie?.()}
            data-testid="pytanie-nie"
          >
            {odrzuc}
          </button>
        </div>
      </div>
    </div>
  );
}
