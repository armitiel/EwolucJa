/**
 * PanelSheet — wysuwany od dołu arkusz, w którym żyją wszystkie sekcje huba.
 * Zostaje w drzewie także zamknięty (animacja + zachowany scroll), ale wtedy
 * jest wyjęty z drzewa dostępności i nie łapie dotknięć.
 */
import React, { createContext, useEffect, useRef, useState } from "react";

/**
 * Miejsce w NAGŁÓWKU, do którego panel może wrzucić własny pasek (dziś: kanały
 * czatu). Portal, a nie prop przez `Swiat` — inaczej stan „który kanał" musiałby
 * wyjechać z `CzatPanel` na samą górę drzewa tylko po to, żeby narysować trzy
 * zakładki. Panel zostaje samowystarczalny, arkusz tylko udostępnia miejsce.
 */
export const SlotNaglowka = createContext(null);

/**
 * `wypelnia` = treść sama zarządza przewijaniem (czat: strumień przewija się,
 * pole pisania stoi). Domyślnie przewija się CAŁY arkusz i tak zostaje dla
 * paneli, które są listą.
 */
export default function PanelSheet({ open, kicker = null, title, onClose, children, testId, wypelnia = false }) {
  const arkuszRef = useRef(null);
  // Stan, nie ref: portal musi się przerysować, gdy węzeł już istnieje.
  const [slot, setSlot] = useState(null);

  // Esc zamyka — na desktopie i na klawiaturach zewnętrznych.
  useEffect(() => {
    if (!open) return undefined;
    const naKlawisz = (e) => { if (e.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", naKlawisz);
    return () => window.removeEventListener("keydown", naKlawisz);
  }, [open, onClose]);

  // Po otwarciu zawartość wraca na górę i fokus wchodzi do arkusza.
  useEffect(() => {
    if (!open) return;
    const scroll = arkuszRef.current?.querySelector(".hub-sheet-body");
    if (scroll) scroll.scrollTop = 0;
    arkuszRef.current?.focus({ preventScroll: true });
  }, [open, title]);

  return (
    <>
      <div
        className={`hub-scrim${open ? " is-open" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <section
        ref={arkuszRef}
        className={`hub-sheet${open ? " is-open" : ""}`}
        role="dialog"
        aria-modal="false"
        aria-label={title}
        aria-hidden={open ? undefined : "true"}
        tabIndex={-1}
        data-testid={testId}
      >
        <span className="hub-sheet-grip" aria-hidden="true" />
        <header className="hub-sheet-head">
          {/* Nadtytuł jest opcjonalny — pusty <span> zostawiał w nagłówku
              martwy odstęp, więc rysujemy go tylko, gdy naprawdę jest. */}
          <div className="hub-sheet-head-tytul">
            {kicker ? <span className="hub-kicker">{kicker}</span> : null}
            <h2>{title}</h2>
          </div>
          <button type="button" className="hub-sheet-close" onClick={onClose} aria-label="Zamknij" data-testid="hub-sheet-close">
            ✕
          </button>
          {/* Pusty slot zwija się do zera (`:empty` w CSS), więc panele, które
              go nie używają, mają nagłówek co do piksela taki jak wcześniej. */}
          <div className="hub-sheet-head-slot" ref={setSlot} />
        </header>
        <div className={`hub-sheet-body screen-scroll${wypelnia ? " is-wypelnia" : ""}`}>
          <SlotNaglowka.Provider value={slot}>{children}</SlotNaglowka.Provider>
        </div>
      </section>
    </>
  );
}
