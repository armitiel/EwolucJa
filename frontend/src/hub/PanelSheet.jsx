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
export default function PanelSheet({ open, kicker = null, title, onClose, onPowrot = null, children, testId, wypelnia = false, powrot = false, wariant = null }) {
  const arkuszRef = useRef(null);
  // `Swiat` zeruje aktywny panel od razu, a arkusz jeszcze przez moment zjeżdża.
  // Zapamiętujemy więc ikonę otwartego panelu, żeby Porada podczas animacji
  // zamykania nie mignęła krzyżykiem zamiast pozostać strzałką.
  const ostatniTrybPowrotuRef = useRef(powrot);
  if (open) ostatniTrybPowrotuRef.current = powrot;
  const pokazPowrot = open ? powrot : ostatniTrybPowrotuRef.current;
  // TO SAMO dla wariantu wygladu, i z tego samego powodu. Bez tego popup
  // profilu przy zamykaniu tracil klase `jest-popup` w tej samej klatce, w
  // ktorej zaczynal znikac — wracal wiec do stylu szuflady i zamiast zapasc
  // sie w srodku ekranu, odjezdzal po skosie w dolny rog.
  const ostatniWariantRef = useRef(wariant);
  if (open) ostatniWariantRef.current = wariant;

  /**
   * PRZESIADKA MIĘDZY KSZTAŁTAMI — szuflada ↔ okno na środku.
   *
   * To jest ten sam błąd, co przy zamykaniu, tylko z drugiej strony. Arkusz
   * jest JEDNYM elementem: gdy dziecko ma otwarte Zadania i stuka w awatar,
   * `wariant` przeskakuje z `null` na `popup` przy wciąż zapalonym `is-open`.
   * CSS ma wtedy dwie różne pozycje tego samego, otwartego pudełka — dół
   * ekranu i środek — więc je po prostu animuje jedną w drugą. Okno leci
   * po skosie z dolnego rogu i wygląda, jakby wypadło z doku.
   *
   * Dlatego zmiana kształtu przy otwartym arkuszu przechodzi przez ZAMKNIĘCIE:
   * stary kształt zjeżdża tak, jak zawsze zjeżdża, a dopiero potem nowy
   * wyłania się u siebie — popup ze środka ekranu, szuflada z dołu. Kosztuje
   * to ćwierć sekundy i jest to ćwierć sekundy, w której dziecko widzi, że
   * jedna rzecz się skończyła, zanim zaczęła się druga.
   *
   * Przy `prefers-reduced-motion` przesiadki nie ma: kształt zmienia się od
   * razu, bo i tak nic się nie animuje (`transition:none` w `hub.css`), a
   * sama przerwa byłaby wtedy pustym ekranem bez powodu.
   */
  /* OBIEKT, nie sam kształt. Wariant szuflady TO `null` — gdyby stan trzymał
     go wprost, „zjeżdża szuflada" i „nie ma przesiadki" byłyby tą samą
     wartością i przejście z szuflady w popup nie zadziałałoby wcale.
     (Zadziałało dopiero po tym poprawieniu — pierwsza wersja cicho nie robiła
     nic akurat w tym jednym kierunku, o który chodziło.) */
  const [zjezdza, setZjezdza] = useState(null);   // { ksztalt } albo null
  const poprzedniWariantRef = useRef(wariant);
  const bylOtwartyRef = useRef(open);
  useEffect(() => {
    const poprzedni = poprzedniWariantRef.current;
    const bylOtwarty = bylOtwartyRef.current;
    poprzedniWariantRef.current = wariant;
    bylOtwartyRef.current = open;
    // Tylko przy przejściu OTWARTY → OTWARTY. Zwykłe otwarcie z zamkniętego
    // i tak startuje u siebie, więc nie ma czego przesiadać.
    if (!open || !bylOtwarty || wariant === poprzedni || spokojnyRuch()) return undefined;

    /* TRZY KROKI, nie dwa — i ten trzeci jest tu po przegranej walce z CSS.
       Wersja na dwa kroki (stary kształt zjeżdża → nowy wchodzi) dalej
       wpuszczała popup z dołu: ostatnia zmiana przestawiała naraz KSZTAŁT
       i `is-open`, więc przeglądarka miała do zanimowania przejście z
       „szuflada, zjechana na dół" wprost w „popup, otwarty na środku" —
       i robiła z tego jeden ukośny przelot, dokładnie ten sam, który mieliśmy
       naprawić. Zmierzone: górna krawędź szła 808 → 266 px przy stałej
       wysokości, czyli zjazd, a nie wyłanianie.

       Dlatego między nimi wchodzi klatka, w której arkusz ma JUŻ nowy kształt,
       ale jest JESZCZE zamknięty: popup stoi wtedy na środku ekranu w skali
       .86 i z zerowym kryciem. Dopiero z tego punktu rośnie.

       `flushSync` + odczyt `offsetHeight` NIE SĄ OZDOBĄ. React 18 zbiera
       zmiany stanu z `setTimeout` w paczkę i oddaje je do DOM-u własnym
       harmonogramem — bez wymuszenia klatka pośrednia trafiała do drzewa
       dopiero razem z następną, więc przeglądarka znów widziała jeden skok
       z zjechanej szuflady wprost w otwarty popup. `flushSync` wstawia ją do
       DOM-u natychmiast, a odczyt wysokości zmusza do przeliczenia stylów —
       dopiero wtedy jest od czego zacząć animację. Zmierzone przed poprawką:
       środek okna wędrował 1383 → 938 → 722 → 635, czyli dojeżdżał z dołu;
       po poprawce stoi na 635 i zmienia się sama skala.

       NIE `requestAnimationFrame` NA OSTATNIM KROKU. Kusiło, bo to naturalna
       jednostka klatki — ale rAF nie tyka w ukrytej karcie, a wtedy arkusz
       zostawał na zawsze w stanie pośrednim: nowy kształt, `is-open` nigdy
       nie wraca, czyli okno po prostu się nie otwiera. Dziecko, które
       przełączy zakładkę telefonu w złym momencie, zastaje pusty ekran.
       `setTimeout` w tle jest dławiony, ale FIRE'uje — a punkt startu
       animacji i tak gwarantuje `flushSync` z odczytem wysokości, nie klatka. */
    let drugi = 0;
    setZjezdza({ ksztalt: poprzedni });
    const t = window.setTimeout(() => {
      flushSync(() => setZjezdza({ ksztalt: wariant }));
      void arkuszRef.current?.offsetHeight;
      drugi = window.setTimeout(() => setZjezdza(null), 16);
    }, CZAS_ZJAZDU);
    return () => {
      window.clearTimeout(t);
      window.clearTimeout(drugi);
    };
  }, [open, wariant]);

  // W trakcie przesiadki arkusz nosi STARY kształt i jest zamknięty — to on
  // zjeżdża. Dopiero gdy zejdzie, wchodzi nowy.
  const wariantWidoczny = zjezdza ? zjezdza.ksztalt : (open ? wariant : ostatniWariantRef.current);
  const otwartyWidoczny = open && !zjezdza;
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
        className={`hub-sheet${wariantWidoczny ? ` jest-${wariantWidoczny}` : ""}${otwartyWidoczny ? " is-open" : ""}`}
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
