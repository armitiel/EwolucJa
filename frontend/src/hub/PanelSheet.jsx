/**
 * PanelSheet — wysuwany od dołu arkusz, w którym żyją wszystkie sekcje huba.
 * Zostaje w drzewie także zamknięty (animacja + zachowany scroll), ale wtedy
 * jest wyjęty z drzewa dostępności i nie łapie dotknięć.
 */
import React, { createContext, useEffect, useRef, useState } from "react";

/**
 * Miejsce POD NAGŁÓWKIEM, do którego panel może wrzucić własny pasek na całą
 * szerokość arkusza (dziś: kanały czatu). Portal, a nie prop przez `Swiat` —
 * inaczej stan „który kanał" musiałby wyjechać z `CzatPanel` na samą górę
 * drzewa tylko po to, żeby narysować trzy zakładki. Panel zostaje
 * samowystarczalny, arkusz tylko udostępnia miejsce.
 *
 * Pas jest RODZEŃSTWEM nagłówka i ciała, a nie dzieckiem żadnego z nich:
 * w nagłówku musiałby się mieścić między krzyżykiem a krawędziami, a w ciele
 * przewijałby się razem z treścią.
 */
export const SlotNaglowka = createContext(null);

/**
 * `wypelnia` = treść sama zarządza przewijaniem (czat: strumień przewija się,
 * pole pisania stoi). Domyślnie przewija się CAŁY arkusz i tak zostaje dla
 * paneli, które są listą.
 *
 * `wypelnia` NIE zmienia wysokości arkusza. Czat miał przez chwilę własne
 * 88 % ekranu i to było widać jako usterkę: dok stoi na wierzchu, więc
 * przejście z Gier na Czat skakało o 82 px. Wszystkie szuflady mają jedną
 * wysokość, a miejsce dla rozmowy bierze się z jej wnętrza.
 */
export default function PanelSheet({ open, kicker = null, title, onClose, onPowrot = null, children, testId, wypelnia = false, powrot = false }) {
  const arkuszRef = useRef(null);
  // `Swiat` zeruje aktywny panel od razu, a arkusz jeszcze przez moment zjeżdża.
  // Zapamiętujemy więc ikonę otwartego panelu, żeby Porada podczas animacji
  // zamykania nie mignęła krzyżykiem zamiast pozostać strzałką.
  const ostatniTrybPowrotuRef = useRef(powrot);
  if (open) ostatniTrybPowrotuRef.current = powrot;
  const pokazPowrot = open ? powrot : ostatniTrybPowrotuRef.current;
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
          {/* Panel z krokami w środku (Porady, Zadanie od Wizkora) zgłasza
              przez `onPowrot`, że ma dokąd cofnąć — wtedy ten sam przycisk
              wraca strzałką zamiast zamykać. Panele bez kroków zamykają się
              krzyżykiem jak dotąd. Przycisk zachowuje tę samą czerwoną oprawę
              — zmienia się tylko biały znak i jego znaczenie. Dzięki temu
              w oknie jest JEDNO miejsce, które cofa, i żaden panel nie musi
              rysować własnego linku „wróć" nad treścią. */}
          <button
            type="button"
            className={`hub-sheet-close${pokazPowrot ? " is-back" : ""}`}
            onClick={pokazPowrot ? (onPowrot || onClose) : onClose}
            aria-label={pokazPowrot ? "Wróć" : "Zamknij"}
            data-testid="hub-sheet-close"
          >
            {pokazPowrot ? (
              <svg viewBox="0 0 32 28" aria-hidden="true" focusable="false">
                <path d="M13 3.7 2.7 14 13 24.3l3-3-5.2-5.1H29v-4.4H10.8L16 6.7z" />
              </svg>
            ) : "×"}
          </button>
        </header>
        {/* Slot stoi POD belką tytułową, na całą szerokość arkusza — nie
            w środku nagłówka. Pasek kanałów wciśnięty w ciemną belkę czytał
            się jak jej ozdoba, a nie jak nawigacja, i musiał się mieścić
            między krzyżykiem a krawędziami, więc nigdy nie brał pełnej
            szerokości. Tutaj jest samodzielnym pasem nad treścią.
            Pusty slot zwija się do zera (`:empty` w CSS), więc panele, które
            go nie używają, wyglądają co do piksela tak jak wcześniej. */}
        <div className="hub-sheet-slot" ref={setSlot} />
        <div className={`hub-sheet-body screen-scroll${wypelnia ? " is-wypelnia" : ""}`}>
          <SlotNaglowka.Provider value={slot}>{children}</SlotNaglowka.Provider>
        </div>
      </section>
    </>
  );
}
