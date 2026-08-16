/**
 * PopupPostaci — okno powitalne, gdy lisek spotyka nową postać.
 *
 * Trzy decyzje, które warto znać przed zmianą:
 *
 * 1. POSTAĆ WYCHODZI Z KARTY, a nie stoi obok niej. Grafika jest przycięta
 *    płaskim dołem (tak przyszedł asset), więc wstęga z imieniem siada
 *    dokładnie na tym cięciu i je zakrywa — czyta się to jako jedną bryłę,
 *    a nie obrazek doklejony nad prostokątem. Ta sama zasada rządzi głową
 *    Mędrca w `PodpowiedzMedrca` i monetą w HUD-zie.
 *
 * 2. KOLORY WYŁĄCZNIE Z TOKENÓW `styles/ewolucja.css`. Fiolet (`--p-magic`)
 *    to w tym projekcie barwa magii i mentorów, papier to karta, zieleń
 *    (`--p-leaf`) to „idź dalej". Nie ma tu ani jednej nowej barwy — okno ma
 *    wyglądać na część gry, a nie na osobny ekran.
 *
 * 3. TO JEST MODAL. Zatrzymuje świat pod spodem (rodzic pauzuje scenę),
 *    łapie Escape i wpuszcza fokus na przycisk. Dziecko ma jedno wyjście
 *    główne (duży zielony przycisk) i jedno awaryjne (krzyżyk).
 *
 * Wyzwalacz „lisek spotkał nową postać" przyjdzie osobno — na razie okno
 * otwiera się z zewnątrz (prop `otwarty`), a do oglądania służy uchwyt
 * `window.popupPostaci.pokaz()` i adres `?popup=1`.
 */
import React, { useEffect, useRef } from "react";

/** Gwiazdka wektorem, nie plikiem: skaluje się bez rozmycia i bierze kolor z CSS. */
function Gwiazdka({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 1.6l3.1 6.4 7 1-5 4.9 1.2 7-6.3-3.3-6.3 3.3 1.2-7-5-4.9 7-1z" />
    </svg>
  );
}

/**
 * Wyróżnia JEDEN fragment zdania. Świadomie tylko jeden: podkreślenie działa,
 * dopóki jest rzadkie — dwa „ważne" fragmenty w trzech linijkach znaczą tyle,
 * co żaden. Gdy frazy nie ma w tekście, zdanie idzie w całości (bez wyjątku).
 */
function zlozTekst(tekst, wyroznienie) {
  if (!wyroznienie) return tekst;
  const i = tekst.indexOf(wyroznienie);
  if (i < 0) return tekst;
  return [
    tekst.slice(0, i),
    <mark key="wyroznik" className="popup-postaci-wyroznik">{wyroznienie}</mark>,
    tekst.slice(i + wyroznienie.length),
  ];
}

export default function PopupPostaci({
  otwarty = false,
  imie = "Wizcor",
  obrazek = "/wizPop.webp",
  tekst = "",
  wyroznienie = "",
  przycisk = "Poznajmy się!",
  onAkcja,
  onZamknij,
}) {
  const przyciskRef = useRef(null);

  // Escape zamyka — na desktopie to odruch, a okno nie ma nic do stracenia.
  useEffect(() => {
    if (!otwarty) return undefined;
    const naKlawisz = (e) => { if (e.key === "Escape") onZamknij?.(); };
    window.addEventListener("keydown", naKlawisz);
    return () => window.removeEventListener("keydown", naKlawisz);
  }, [otwarty, onZamknij]);

  // Fokus na przycisku, a nie na oknie: czytnik ekranu od razu mówi, co zrobić,
  // a klawiatura ma gdzie stać. `preventScroll`, żeby strona pod spodem nie drgnęła.
  useEffect(() => {
    if (!otwarty) return;
    const t = window.setTimeout(() => {
      try { przyciskRef.current?.focus({ preventScroll: true }); } catch {}
    }, 380);
    return () => window.clearTimeout(t);
  }, [otwarty]);

  if (!otwarty) return null;

  return (
    <div className="popup-postaci" data-testid="popup-postaci">
      {/* Zasłona jest osobnym elementem, a nie tłem kontenera: dzięki temu
          dotknięcie obok karty zamyka okno, a dotknięcie karty nie. */}
      <div className="popup-postaci-zaslona" onClick={() => onZamknij?.()} aria-hidden="true" />

      <div
        className="popup-postaci-karta"
        role="dialog"
        aria-modal="true"
        aria-labelledby="popup-postaci-imie"
      >
        <img
          className="popup-postaci-bohater"
          src={obrazek}
          alt=""
          aria-hidden="true"
          draggable="false"
        />

        <button
          type="button"
          className="popup-postaci-zamknij"
          onClick={() => onZamknij?.()}
          aria-label="Zamknij"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M6.4 6.4l11.2 11.2M17.6 6.4L6.4 17.6" />
          </svg>
        </button>

        <p className="popup-postaci-wstega" id="popup-postaci-imie">
          <Gwiazdka className="popup-postaci-gwiazdka" />
          <span>{imie}</span>
          <Gwiazdka className="popup-postaci-gwiazdka" />
        </p>

        <p className="popup-postaci-tekst">{zlozTekst(tekst, wyroznienie)}</p>

        {/* Przerywnik: trzy gwiazdki na cienkiej złotej linii. Oddziela to,
            co postać mówi, od tego, co dziecko ma zrobić. */}
        <p className="popup-postaci-przerywnik" aria-hidden="true">
          <Gwiazdka className="popup-postaci-iskra" />
          <Gwiazdka className="popup-postaci-iskra popup-postaci-iskra--duza" />
          <Gwiazdka className="popup-postaci-iskra" />
        </p>

        <button
          type="button"
          ref={przyciskRef}
          className="hub-btn hub-btn-primary popup-postaci-akcja"
          onClick={() => (onAkcja || onZamknij)?.()}
          data-testid="popup-postaci-akcja"
        >
          {przycisk}
        </button>
      </div>
    </div>
  );
}
