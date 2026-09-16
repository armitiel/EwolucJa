/**
 * PodsumowanieDnia — ostatni obraz sesji. Wchodzi, gdy kamera skończy odjazd
 * od bohatera, a planeta stoi już pod gwiazdami.
 *
 * TRZY DECYZJE, KTÓRE WARTO ZNAĆ PRZED ZMIANĄ:
 *
 * 1. TO NIE JEST EKRAN „KONIEC CZASU". Nie ma tu ani minut, ani słowa
 *    o limicie, ani przycisku „wyjdź". Dziecko właśnie zobaczyło, jak jego
 *    planeta zasypia — okno tylko nazywa to, co się dziś wydarzyło, i mówi,
 *    co czeka POZA ekranem. Koniec sesji ma zostawiać niedosyt świata,
 *    a nie poczucie odebranej zabawki (`docs/OPIS_PROJEKTU.md`).
 *
 * 2. LISTA JEST Z PRAWDZIWEGO DNIA, nie z szablonu. Wpisy zbiera `dziennik`
 *    w `Swiat.jsx`, w tych samych miejscach, w których świat i tak reaguje
 *    na działanie dziecka. Pusty dzień NIE dostaje wypełniacza w stylu
 *    „dobrze się bawiłeś" — dostaje jedno zdanie, że planeta czekała, bo
 *    to prawda i dziecko to wie.
 *
 * 3. ZADANIE W REALU STOI NIŻEJ I OSOBNO. Nie jest jedną z pozycji listy,
 *    bo nie jest tym, co się stało — jest tym, co ma się dopiero wydarzyć,
 *    i jedyną rzeczą na tym ekranie, która wymaga czegokolwiek od dziecka.
 */
import React, { useEffect, useRef } from "react";
import { powiedzPostacia } from "./mowaPostaci.js";

/**
 * MIEJSCE NA GRAFIKĘ KOŃCA DNIA. Docelowo: planeta nocą, lisek pod gwiazdami
 * — jeden obraz, ten sam co wieczór, do zapamiętania jak dobranocka.
 *
 * Dziś stoi tu księżycowy Wizkor, którego już mamy: okno działa i wygląda
 * skończenie, zanim powstanie właściwa ilustracja. Po jej wygenerowaniu
 * wystarczy podmienić tę jedną ścieżkę — reszta komponentu nic o niej nie wie.
 */
const OBRAZ_NOCY = "/wizPop.webp";

/** Gwiazdka wektorem — ta sama co w oknie postaci, żeby oba były tą samą grą. */
function Gwiazdka({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 1.6l3.1 6.4 7 1-5 4.9 1.2 7-6.3-3.3-6.3 3.3 1.2-7-5-4.9 7-1z" />
    </svg>
  );
}

export default function PodsumowanieDnia({
  otwarty = false,
  /** Wpisy z dzisiejszej sesji: [{ id, tekst, ikona }]. Może być puste. */
  wpisy = [],
  /** Zadanie do zrobienia naprawdę — `def` z `zadanieWizkora`, albo null. */
  zadanie = null,
  obrazek = OBRAZ_NOCY,
  onZamknij,
}) {
  const przyciskRef = useRef(null);

  /* Wizkor odprowadza dzień głosem. Tekst na ekranie jest krótki, więc to
     głos niesie ciepło — a że nie milknie przy zamknięciu okna
     (`mowaPostaci.js`), dziecko usłyszy koniec zdania nawet wtedy, gdy od
     razu odłoży urządzenie. Tu akurat o to chodzi. */
  useEffect(() => {
    if (!otwarty) return;
    const pozegnanie = zadanie
      ? `Planeta zasnęła. To był dobry dzień. Pamiętasz, co czeka na ciebie naprawdę? ${zadanie.tytul}. Jutro zobaczymy, co z tego wyrosło.`
      : "Planeta zasnęła. To był dobry dzień. Jutro obudzi się razem z tobą.";
    powiedzPostacia(pozegnanie, { glos: "las_decyzji", ton: "calm" });
  }, [otwarty, zadanie]);

  useEffect(() => {
    if (!otwarty) return undefined;
    const naKlawisz = (e) => { if (e.key === "Escape") onZamknij?.(); };
    window.addEventListener("keydown", naKlawisz);
    return () => window.removeEventListener("keydown", naKlawisz);
  }, [otwarty, onZamknij]);

  useEffect(() => {
    if (!otwarty) return undefined;
    const t = window.setTimeout(() => {
      try { przyciskRef.current?.focus({ preventScroll: true }); } catch {}
    }, 420);
    return () => window.clearTimeout(t);
  }, [otwarty]);

  if (!otwarty) return null;

  return (
    <div className="podsumowanie-dnia" data-testid="podsumowanie-dnia">
      {/* Zasłona NIE zamyka okna dotknięciem obok. To jedyne okno w grze,
          które tak robi: koniec dnia ma zostać przeczytany, a nie odklikany
          przypadkiem kciukiem przy krawędzi. */}
      <div className="podsumowanie-dnia-zaslona" aria-hidden="true" />

      <div
        className="podsumowanie-dnia-karta"
        role="dialog"
        aria-modal="true"
        aria-labelledby="podsumowanie-dnia-tytul"
      >
        <img
          className="podsumowanie-dnia-obraz"
          src={obrazek}
          alt=""
          aria-hidden="true"
          draggable="false"
        />

        <p className="podsumowanie-dnia-wstega" id="podsumowanie-dnia-tytul">
          <Gwiazdka className="podsumowanie-dnia-gwiazdka" />
          <span>Dzień się skończył</span>
          <Gwiazdka className="podsumowanie-dnia-gwiazdka" />
        </p>

        {wpisy.length ? (
          <ul className="podsumowanie-dnia-lista">
            {wpisy.map((w) => (
              <li key={w.id} className="podsumowanie-dnia-wpis">
                {w.ikona
                  ? <img src={w.ikona} alt="" aria-hidden="true" draggable="false" />
                  : <Gwiazdka className="podsumowanie-dnia-iskra" />}
                <span>{w.tekst}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="podsumowanie-dnia-pusto">
            Planeta czekała dziś spokojnie. Też tak można.
          </p>
        )}

        {zadanie ? (
          <section className="podsumowanie-dnia-zadanie">
            <h3>A to czeka naprawdę</h3>
            <strong>{zadanie.tytul}</strong>
            <p>{zadanie.cel}</p>
          </section>
        ) : null}

        <button
          type="button"
          ref={przyciskRef}
          className="hub-btn hub-btn-primary podsumowanie-dnia-akcja"
          onClick={() => onZamknij?.()}
          data-testid="podsumowanie-dnia-akcja"
        >
          Do jutra!
        </button>
      </div>
    </div>
  );
}
