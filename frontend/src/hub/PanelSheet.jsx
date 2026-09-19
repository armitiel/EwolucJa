/*!
 * SPDX-FileCopyrightText: © 2026 Amitiel Angelisme <armitiel@gmail.com>
 * SPDX-License-Identifier: LicenseRef-EwolucJA-Proprietary
 *
 * EwolucJA — gra edukacyjna dla dzieci.
 * Produkt powstał w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”;
 * autorskie prawa majątkowe pozostają przy autorze. Licencja: LICENSE.
 */
/**
 * PanelSheet — wysuwany od dołu arkusz, w którym żyją wszystkie sekcje huba.
 * Zostaje w drzewie także zamknięty (animacja + zachowany scroll), ale wtedy
 * jest wyjęty z drzewa dostępności i nie łapie dotknięć.
 */
import React, { createContext, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";

/**
 * Ile trwa zjazd arkusza — ta sama liczba, co `transition` w `hub.css`
 * (szuflada .28 s, popup .26 s). Gdy ktoś tam ruszy czas, ruszy i tutaj:
 * za krótko = nowy kształt wskakuje na stary, za długo = martwa przerwa
 * między dotknięciem ikony a oknem.
 */
const CZAS_ZJAZDU = 280;

/** Czy użytkownik prosił o spokój — wtedy przesiadki nie ma wcale. */
function spokojnyRuch() {
  try { return window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch { return false; }
}

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
export default function PanelSheet({ open, kicker = null, title, onClose, onPowrot = null, children, testId, wypelnia = false, powrot = false, wariant = null, onPodklad = null }) {
  const arkuszRef = useRef(null);
  // `Swiat` zeruje aktywny panel od razu, a arkusz jeszcze przez moment zjeżdża.
  // Zapamiętujemy więc ikonę otwartego panelu, żeby Porada podczas animacji
  // zamykania nie mignęła krzyżykiem zamiast pozostać strzałką.
  const ostatniTrybPowrotuRef = useRef(powrot);
  if (open) ostatniTrybPowrotuRef.current = powrot;
  const pokazPowrot = open ? powrot : ostatniTrybPowrotuRef.current;
  /**
   * ── KSZTAŁT ARKUSZA I PRZESIADKI MIĘDZY NIMI ──────────────────────────
   *
   * Arkusz jest JEDNYM elementem, który nosi dwa zupełnie różne kształty:
   * szufladę przyklejoną do dołu i okno na środku ekranu (`jest-popup`).
   * Obowiązuje jedna zasada i wynika z niej cała reszta tego bloku:
   *
   *   OKNO PROFILU POJAWIA SIĘ I ZNIKA WYŁĄCZNIE ZE ŚRODKA EKRANU,
   *   SZUFLADA WYŁĄCZNIE Z DOŁU, A MIĘDZY NIMI ZAWSZE JEST PEŁNE
   *   ZAMKNIĘCIE. Żadne nie przechodzi w drugie.
   *
   * `ksztaltRef` to kształt, w którym arkusz STOI w tej chwili — także wtedy,
   * gdy jest zamknięty: zjechana szuflada zostaje szufladą, zgaszone okno
   * zostaje oknem. To jest punkt, z którego ruszy następna animacja, i dlatego
   * porównujemy się właśnie z nim, a NIE z poprzednią wartością `wariant`.
   *
   * Ta różnica jest całym sednem ostatniej poprawki. Wcześniej przesiadka
   * odpalała się tylko przy przejściu otwarty → otwarty, więc wystarczyło
   * zamknąć Porady krzyżykiem i stuknąć w awatar: arkusz stał wtedy zaparkowany
   * jako zjechana szuflada, a `wariant` szedł z `null` prosto na `popup` przy
   * zapalonym `is-open`. Przeglądarka animowała z parkingu szuflady do środka
   * ekranu — czyli znowu skos, tyle że po pustym ekranie.
   */
  const [zjezdza, setZjezdza] = useState(null);   // { ksztalt, skok } albo null
  const ksztaltRef = useRef(wariant);
  const bylOtwartyRef = useRef(open);

  /* Dopóki arkusz nie stanie w nowym kształcie, POKAZUJEMY STARY i trzymamy go
     zamkniętym. Dzięki temu nie istnieje ani jedna klatka, w której element
     byłby otwarty w kształcie, do którego dopiero ma przeskoczyć — a to ona
     była źródłem skosu. Efekt niżej tylko dokłada przeskok i otwarcie. */
  const wariantWidoczny = zjezdza ? zjezdza.ksztalt : ksztaltRef.current;
  const otwartyWidoczny = open && !zjezdza && wariant === ksztaltRef.current;

  useEffect(() => {
    const bylOtwarty = bylOtwartyRef.current;
    bylOtwartyRef.current = open;
    // Zamknięcie niczego nie przesiada: arkusz gaśnie w swoim kształcie
    // i w nim zostaje zaparkowany do następnego razu.
    if (!open || wariant === ksztaltRef.current) return undefined;

    let drugi = 0;

    /* PRZESKOK BEZ ANIMACJI. Sam arkusz ma `transition: transform`, więc
       przejście „popup zgaszony na środku" → „szuflada zjechana na dół" TEŻ
       było animowane: przeglądarka ruszała z punktu poprzednika, a chwilę
       później dokładało się otwarcie i kontynuowało z połowy drogi. Zmierzone:
       szuflada meldowała się jako `is-open`, ale z `matrix(0.86, …, -240, -472)`
       — w skali okna i w jego położeniu. `jest-bez-ruchu` (`transition:none`)
       stawia nowy kształt u siebie natychmiast, żeby animowało się dopiero
       otwarcie.

       `flushSync` + odczyt `offsetHeight` nie są ozdobą: React 18 zbiera zmiany
       stanu z `setTimeout` we własnym harmonogramie, więc bez wymuszenia klatka
       przeskoku trafiała do DOM-u dopiero razem z następną i znów nie było od
       czego zacząć animacji. */
    const wskocz = () => {
      flushSync(() => {
        ksztaltRef.current = wariant;
        setZjezdza({ ksztalt: wariant, skok: true });
      });
      void arkuszRef.current?.offsetHeight;
      /* NIE `requestAnimationFrame`: rAF nie tyka w ukrytej karcie, a wtedy
         arkusz zostawałby na zawsze w stanie pośrednim — nowy kształt,
         `is-open` nigdy nie wraca, czyli okno po prostu się nie otwiera.
         `setTimeout` w tle jest dławiony, ale zawsze fire'uje. */
      drugi = window.setTimeout(() => setZjezdza(null), 16);
    };

    /* Arkusz BYŁ ZAMKNIĘTY, tylko w cudzym kształcie — nie ma czego zamykać,
       wystarczy cichy przeskok na swoje miejsce i otwarcie. To jest przypadek
       „zamknąłem Porady, stukam w awatar". */
    if (!bylOtwarty || spokojnyRuch()) {
      wskocz();
      return () => window.clearTimeout(drugi);
    }

    /* Arkusz BYŁ OTWARTY: stary kształt najpierw zjeżdża u siebie. Zaczął to
       już sam — `otwartyWidoczny` zgasło w tym samym renderze, bo kształty się
       różnią — więc tutaj zostaje odczekać jego animację i przeskoczyć. */
    const t = window.setTimeout(wskocz, CZAS_ZJAZDU);
    return () => { window.clearTimeout(t); window.clearTimeout(drugi); };
  }, [open, wariant]);
  // Stan, nie ref: portal musi się przerysować, gdy węzeł już istnieje.
  const [slot, setSlot] = useState(null);

  /**
   * PODKŁAD POD DOKIEM MELDUJE SIĘ STĄD, a nie ze stanu panelu w `Swiat`.
   *
   * Kremowy pas (`hud.css`, `.ma-szuflade .game-hud-bottom::before`) chroni
   * ikony doku przed treścią przewijaną pod nie — czyli jest potrzebny
   * dokładnie wtedy, gdy na dole NAPRAWDĘ stoi szuflada. `Swiat` wie tylko,
   * który panel jest wybrany, i przełączał klasę w tej samej klatce, w której
   * dziecko stukało w ikonę. Przy przesiadce z okna profilu w szufladę
   * wyglądało to tak: pas zapalał się od razu, okno jeszcze przez ćwierć
   * sekundy gasło na środku, a na dole ekranu leżał kremowy brud na gołej
   * planecie — bez szuflady, która miałaby go tłumaczyć.
   *
   * Dlatego liczy się KSZTAŁT WIDOCZNY, nie wybrany: pas jest tylko wtedy,
   * gdy na ekranie stoi otwarta szuflada.
   */
  const podklad = otwartyWidoczny && !wariantWidoczny;
  useEffect(() => { onPodklad?.(podklad); }, [podklad, onPodklad]);

  // Esc zamyka — na desktopie i na klawiaturach zewnętrznych.
  useEffect(() => {
    if (!open) return undefined;
    const naKlawisz = (e) => { if (e.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", naKlawisz);
    return () => window.removeEventListener("keydown", naKlawisz);
  }, [open, onClose]);

  // Po otwarciu zawartość wraca na górę i fokus wchodzi do arkusza.
  // `otwartyWidoczny`, nie `open`: w trakcie przesiadki arkusz zjeżdża z ekranu
  // i wciąganie do niego fokusu akurat wtedy przewijałoby stronę do czegoś,
  // czego już nie widać.
  useEffect(() => {
    if (!otwartyWidoczny) return;
    const scroll = arkuszRef.current?.querySelector(".hub-sheet-body");
    if (scroll) scroll.scrollTop = 0;
    arkuszRef.current?.focus({ preventScroll: true });
  }, [otwartyWidoczny, title]);

  return (
    <>
      <div
        className={`hub-scrim${otwartyWidoczny ? " is-open" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <section
        ref={arkuszRef}
        className={`hub-sheet${wariantWidoczny ? ` jest-${wariantWidoczny}` : ""}${zjezdza?.skok ? " jest-bez-ruchu" : ""}${otwartyWidoczny ? " is-open" : ""}`}
        role="dialog"
        aria-modal="false"
        aria-label={title}
        aria-hidden={otwartyWidoczny ? undefined : "true"}
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
