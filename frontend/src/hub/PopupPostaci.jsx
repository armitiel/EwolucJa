/*!
 * SPDX-FileCopyrightText: © 2026 Amitiel Angelisme <armitiel@gmail.com>
 * SPDX-License-Identifier: LicenseRef-EwolucJA-Proprietary
 *
 * EwolucJA — gra edukacyjna dla dzieci.
 * Produkt powstał w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”;
 * autorskie prawa majątkowe pozostają przy autorze. Licencja: LICENSE.
 */
/**
 * PopupPostaci — okno powitalne, gdy lisek spotyka nową postać.
 *
 * Trzy decyzje, które warto znać przed zmianą:
 *
 * 1. POSTAĆ WYCHODZI Z KARTY, a nie stoi obok niej. Grafika jest przycięta
 *    płaskim dołem (tak przyszedł asset), więc wstęga z imieniem siada
 *    dokładnie na tym cięciu i je zakrywa — czyta się to jako jedną bryłę,
 *    a nie obrazek doklejony nad prostokątem. Ta sama zasada rządzi głową
 *    Wizkora w `PodpowiedzMedrca` i monetą w HUD-zie.
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
import React, { useEffect, useRef, useState } from "react";
import { powiedzPostacia } from "./mowaPostaci.js";
import { odmienDlaGracza } from "../services/rodzaj.js";

/**
 * `prefers-reduced-motion` czytane z JS, a nie z CSS — i to jest istotna
 * różnica. Wybór dotyczy PLIKU, nie stylu: animowany Wizkor waży 264 kB,
 * a jego ostatnia klatka 36 kB. Gdyby oba wisiały w HTML-u i decydowała
 * o nich media query, dziecko z wyłączonymi animacjami i tak pobrałoby
 * całą animację, żeby jej nie zobaczyć.
 *
 * Czytane RAZ, przy otwarciu okna (`useState` z funkcją) — okno żyje
 * kilkanaście sekund, a podmiana grafiki w trakcie mówienia postaci
 * byłaby dziwniejsza niż zignorowanie zmiany ustawień w tej jednej chwili.
 */
function spokojnyRuch() {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

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

/**
 * Proste obrazkowe wyjasnienie celu: jeden przedmiot i liczba sztuk do zebrania.
 * Bez powtarzania tej samej ikony i bez dodatkowej instrukcji do przeczytania.
 */
function CelDoZebrania({ dane }) {
  if (!dane) return null;
  const puzzle = dane.typ === "puzzle";
  const ikona = puzzle ? "/assets/puzzle/kawalek-v2.svg" : "/star.png";
  const nazwa = puzzle ? "kawałki obrazka" : "złote gwiazdki";
  const wartosc = Math.max(0, Number(dane.wartosc) || 0);
  const cel = Math.max(1, Number(dane.cel) || 1);
  const komplet = wartosc >= cel;

  return (
    <div
      className={`popup-postaci-cel popup-postaci-cel--${puzzle ? "puzzle" : "gwiazdki"}${komplet ? " jest-komplet" : ""}`}
      role="img"
      aria-label={`${nazwa}: ${wartosc} z ${cel}`}
    >
      <img className="popup-postaci-cel-ikona" src={ikona} alt="" draggable="false" aria-hidden="true" />
      <span className="popup-postaci-cel-razy" aria-hidden="true">×</span>
      <strong className="popup-postaci-cel-liczba" aria-hidden="true">{cel}</strong>
    </div>
  );
}

export default function PopupPostaci({
  otwarty = false,
  imie = "Wizkor",
  obrazek = "/wizPop.webp",
  /**
   * Animowana wersja TEJ SAMEJ grafiki — dziś tylko chwila pochwały
   * (`/wizkor-super.webp`: Wizkor mruga i się uśmiecha). Gra RAZ i zostaje
   * na ostatniej klatce; nie zapętla się, bo pochwała ma się WYDARZYĆ,
   * a nie migotać przez cały czas, gdy okno jest otwarte.
   *
   * `obrazek` zostaje wtedy ostatnią klatką animacji, a nie zwykłym
   * portretem — dzięki temu dziecko z wyłączonymi animacjami widzi ten sam
   * uśmiech, tylko bez dojścia do niego. Okno nie wie nic o tym, KIEDY jest
   * pochwała: dobiera to `hub/kwestieWizkora.js`.
   */
  obrazekAnim = null,
  tekst = "",
  /**
   * Krótka wersja TYLKO NA EKRAN. `tekst` zostaje pełną kwestią i to on idzie
   * w głos — a lektor nie milknie przy zamknięciu okna (`hub/mowaPostaci.js`),
   * więc spokojnie dopowiada resztę, gdy lis już biegnie.
   *
   * Podział jest celowy: sześciolatek czyta kartę wolniej, niż słucha, a ściana
   * liter w oknie zatrzymuje go dłużej niż cała kwestia wypowiedziana. Na karcie
   * ma stać JEDNO polecenie — co zrobić i gdzie; „dlaczego" należy do głosu.
   */
  tekstEkranu = null,
  wyroznienie = "",
  wizualizacja = null,
  przycisk = "Poznajmy się!",
  /**
   * Drugi przycisk pojawia się tylko wtedy, gdy okno naprawdę o coś PYTA.
   * Powitanie ma jedno wyjście („poznajmy się") i domknięcie krzyżykiem —
   * dokładanie mu „nie teraz" sugerowałoby wybór tam, gdzie go nie ma.
   * Zaproszenie do minigry ma dwa wyjścia i oba są w porządku.
   */
  przyciskDrugi = null,
  /**
   * Nazwa wariantu wyglądu (`lis` → klasa `popup-postaci--lis`). Postacie mają
   * różne sylwetki: czarodziej jest prawie kwadratowy przez kapelusz, lisek
   * wąski i wysoki przez uszy. Ta sama geometria dla obu dawałaby albo lisa
   * wielkości znaczka, albo czarodzieja poza ekranem.
   */
  wariant = null,
  /**
   * Cokolwiek, co okno ma pokazać MIĘDZY zdaniem postaci a przyciskami —
   * dziś kafelki „poziom + ile można wygrać" w zaproszeniu do minigry.
   *
   * Slot, a nie własne pole „poziomy": okno postaci nie ma nic wspólnego
   * z minigrami i nie powinno o nich wiedzieć. Wie tylko, że pod zdaniem
   * bywa coś do wybrania, zanim padnie odpowiedź.
   */
  dodatek = null,
  glos = null,
  ton = "mystery",
  onAkcja,
  onDrugi,
  onZamknij,
}) {
  const przyciskRef = useRef(null);
  const [spokojnie] = useState(spokojnyRuch);
  const bohater = obrazekAnim && !spokojnie ? obrazekAnim : obrazek;

  /* TOKENY RODZAJU `{m|ż}` ODMIENIAMY PRZED RENDEREM. Kwestie z `kwestieWizkora`
     i `misjeGier` piszą się w obu formach naraz („{sam|sama} to
     {przyniosłeś|przyniosłaś}"); tu wybieramy tę właściwą dla dziecka — dla
     karty, dla wyróżnienia (musi pasować do odmienionego zdania, inaczej
     `zlozTekst` go nie znajdzie) i dla głosu (`powiedzPostacia` odmienia
     jeszcze raz, ale bez tokenów to już nic nie zmienia). */
  const tekstGlosu = odmienDlaGracza(tekst);
  const tekstKarty = odmienDlaGracza(tekstEkranu || tekst);
  const wyroznienieKarty = odmienDlaGracza(wyroznienie);

  /**
   * Postać MÓWI to, co ma w dymku — i mówi to DO KOŃCA, także wtedy, gdy
   * dziecko zamknie okno po pierwszej linijce. Cała zasada (kiedy głos milknie
   * i dlaczego zamknięcie go nie ucina) stoi w `hub/mowaPostaci.js`.
   *
   * Na ekranie zostaje wersja krótka (`tekstEkranu`), w głos idzie `tekst` —
   * dlatego kwestia może dopowiedzieć sens, nie zatrzymując dziecka przed
   * ścianą liter. Muzykę ścisza na czas mowy i przywraca sam `ttsPlayer`;
   * wyciszona nutka w HUD-zie postaci NIE ucisza — to przełącznik tła.
   */
  useEffect(() => {
    if (!otwarty) return;
    powiedzPostacia(tekstGlosu, { glos, ton });
  }, [otwarty, glos, ton, tekstGlosu]);

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
    <div
      className={`popup-postaci${wariant ? ` popup-postaci--${wariant}` : ""}`}
      data-testid="popup-postaci"
    >
      {/* Zasłona jest osobnym elementem, a nie tłem kontenera: dzięki temu
          dotknięcie obok karty zamyka okno, a dotknięcie karty nie. */}
      <div className="popup-postaci-zaslona" onClick={() => onZamknij?.()} aria-hidden="true" />

      <div
        className="popup-postaci-karta"
        role="dialog"
        aria-modal="true"
        aria-labelledby="popup-postaci-imie"
      >
        {/* `key` pilnuje, żeby animacja ZACZYNAŁA SIĘ OD POCZĄTKU przy każdym
            otwarciu okna: przeglądarka odtwarza animowany WebP od pierwszej
            klatki dopiero dla nowego elementu, a nie po ponownym ustawieniu
            tego samego `src`. */}
        <img
          key={bohater}
          className="popup-postaci-bohater"
          src={bohater}
          alt=""
          aria-hidden="true"
          draggable="false"
          onError={(e) => {
            /* Gdyby animacji zabrakło (stary cache, nieudany deploy), okno nie
               może zostać z dziurą po grafice — wraca do klatki statycznej.
               Znacznik chroni przed pętlą, gdyby i ona nie doleciała. */
            if (e.currentTarget.dataset.zapasowa) return;
            e.currentTarget.dataset.zapasowa = "1";
            e.currentTarget.src = obrazek;
          }}
        />

        <button
          type="button"
          className="popup-postaci-zamknij"
          onClick={() => onZamknij?.()}
          aria-label="Zamknij"
        >
          {/* Znak „×" pisany LITERĄ, nie rysowany SVG. Guzik ma wyglądać
              dokładnie jak ten w belce szuflady, a tam krzyżyk jest tekstem
              (`font:900 32px`) — kreska SVG w tej samej grubości nominalnej
              wychodzi cieńsza niż glif w wadze 900 i różnicę widać od razu,
              gdy oba stoją w jednej aplikacji. */}
          ×
        </button>

        <p className="popup-postaci-wstega" id="popup-postaci-imie">
          <Gwiazdka className="popup-postaci-gwiazdka" />
          <span>{imie}</span>
          <Gwiazdka className="popup-postaci-gwiazdka" />
        </p>

        <p className="popup-postaci-tekst">
          {/* Wyróżnienie podajemy ZAWSZE — także przy krótkiej wersji. Gdy frazy
              w niej nie ma, `zlozTekst` oddaje zdanie w całości, więc nic się
              nie psuje, a kwestie, które da się skrócić Z zachowaniem frazy,
              nie tracą podkreślenia. */}
          {zlozTekst(tekstKarty, wyroznienieKarty)}
        </p>

        {wizualizacja ? (
          <CelDoZebrania dane={wizualizacja} />
        ) : (
          /* Przerywnik oddziela kwestie bez ilustracji od glownej akcji. */
          <p className="popup-postaci-przerywnik" aria-hidden="true">
            <Gwiazdka className="popup-postaci-iskra" />
            <Gwiazdka className="popup-postaci-iskra popup-postaci-iskra--duza" />
            <Gwiazdka className="popup-postaci-iskra" />
          </p>
        )}

        {dodatek ? <div className="popup-postaci-dodatek">{dodatek}</div> : null}

        {/* Brak `przycisk` = okno NIE MA glownego wyjscia, bo wyborem jest sam
            `dodatek` (tak dziala poznanie w W2: dziecko stuka w odpowiedz
            i okno idzie dalej). Pusty zielony pasek pod pytaniem wygladal jak
            zepsuty przycisk, wiec go nie rysujemy. */}
        {przycisk ? (
          <button
            type="button"
            ref={przyciskRef}
            className="hub-btn hub-btn-primary popup-postaci-akcja"
            onClick={() => (onAkcja || onZamknij)?.()}
            data-testid="popup-postaci-akcja"
          >
            {przycisk}
          </button>
        ) : null}

        {/* Odmowa jest lżejsza od zgody i stoi niżej — pierwszy pod kciukiem
            ma być ten przycisk, który prowadzi dalej. Ten sam układ, co
            w oknie „zagadać?": pion, nie dwa wąskie obok siebie. */}
        {przyciskDrugi ? (
          <button
            type="button"
            className="hub-btn hub-btn-ghost popup-postaci-akcja-drugi"
            onClick={() => (onDrugi || onZamknij)?.()}
            data-testid="popup-postaci-drugi"
          >
            {przyciskDrugi}
          </button>
        ) : null}
      </div>
    </div>
  );
}
