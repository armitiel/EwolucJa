/**
 * PanelSheet — wysuwany od dołu arkusz, w którym żyją wszystkie sekcje huba.
 * Zostaje w drzewie także zamknięty (animacja + zachowany scroll), ale wtedy
 * jest wyjęty z drzewa dostępności i nie łapie dotknięć.
 */
import React, { useEffect, useRef } from "react";

export default function PanelSheet({ open, kicker = null, title, onClose, children, testId }) {
  const arkuszRef = useRef(null);

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
          <div>
            {kicker ? <span className="hub-kicker">{kicker}</span> : null}
            <h2>{title}</h2>
          </div>
          <button type="button" className="hub-sheet-close" onClick={onClose} aria-label="Zamknij" data-testid="hub-sheet-close">
            ✕
          </button>
        </header>
        <div className="hub-sheet-body screen-scroll">{children}</div>
      </section>
    </>
  );
}
