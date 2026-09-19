/*!
 * SPDX-FileCopyrightText: © 2026 Amitiel Angelisme <armitiel@gmail.com>
 * SPDX-License-Identifier: LicenseRef-EwolucJA-Proprietary
 *
 * EwolucJA — gra edukacyjna dla dzieci.
 * Produkt powstał w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”;
 * autorskie prawa majątkowe pozostają przy autorze. Licencja: LICENSE.
 */
/**
 * Dymek — JEDEN kształt dla wszystkich wypowiedzi w grze.
 *
 * PO CO TO POWSTAŁO (19.09.2026). Dymków było pięć i każdy robił to samo
 * inaczej: dwa rysowały ścieżkę SVG z `ksztaltChmurki.js`, jeden skleja obłok
 * z kółek, dwa doklejały pod spodem kwadrat obrócony o 45° (`.chmurka-awatara`
 * i `MentorBubble`). Kolory szły raz z tokenów `--chmurka-*`, raz z tokenów
 * HUD-u, a raz z dziesięciu hex-ów wpisanych w komponent. Każda poprawka
 * kształtu trafiała więc tylko w część gry — dzióbek naprawiony w „Poradzie
 * dnia" nadal się nie domykał przy awatarze.
 *
 * Teraz kształt, lamówka, glina, cień i krzyżyk są TUTAJ, a wołający decyduje
 * o trzech rzeczach:
 *
 *   `ogon`      — CZY to wypowiedź, czy myśl. Dzióbek mówi „ktoś to
 *                 powiedział", dwie kropki — „ktoś to sobie pomyślał".
 *                 To jedyne rozróżnienie idiomu, jakie ta gra ma, i zostaje
 *                 świadomie (decyzja właściciela, 19.09.2026).
 *   `kierunek`  — po której stronie wyrasta ogon, czyli w co celuje.
 *   tokeny CSS  — barwa (`--chmurka-akcent`, `--chmurka-tlo-*`) i oddech
 *                 (`--dymek-oddech`) ustawiane na rodzicu. Stąd biorą się
 *                 różnice między fioletowym Wizkorem, pomarańczowym liskiem
 *                 i kremowo-złotą pigułką przy awatarze gracza.
 *
 * CZEGO TU NIE MA I NIE BĘDZIE. Kiedy dymek ma wejść, jak długo wisi, czy
 * wolno mu wejść (`bramkaKomunikatow.js`) i co mówi — to wie wołający.
 * Tutaj jest wyłącznie obraz.
 *
 * ROZMIAR BIERZE SIĘ Z TREŚCI, nie odwrotnie: `ResizeObserver` mierzy pudełko
 * z dziećmi, a ścieżka rysuje się pod ten pomiar. Dlatego padding tego pudełka
 * JEST wewnętrznym marginesem bańki — nie ma osobnej „wysokości dymka" do
 * wpisania z palca. Wyjątkiem jest wariant `kropki`: obłok z kółek ma stałą
 * proporcję i mieści jedną ikonę, więc tam rozmiar podaje CSS.
 */
import React, { useCallback, useRef, useState } from "react";
import ChmurkaKsztalt from "./ChmurkaKsztalt.jsx";
import {
  MIN_SZEROKOSC, MIN_WYSOKOSC, OGON_DLUGOSC,
  glinaChmurki, poleChmurki, sciezkaChmurki,
} from "./ksztaltChmurki.js";
import "../styles/dymek.css";

/* Każda bańka na ekranie potrzebuje WŁASNEGO `id` gradientu. Dwa dymki potrafią
   stać naraz (myśl Wizkora i chmurka zadania), a powtórzony `id` sprawiłby, że
   drugi bierze definicję pierwszego — razem z jego zakresem, czyli z cudzą
   wysokością. `useId` daje znaki niedozwolone w URL-u `url(#…)`, stąd filtr. */
let licznikId = 0;

export default function Dymek({
  /** „dziobek" (wypowiedź) | „kropki" (myśl) | „brak". */
  ogon = "dziobek",
  /** Dzióbek: „dol" | „gora" | „lewo" | „prawo". Kropki: róg, np. „gora-lewo". */
  kierunek = "dol",
  /** Px WZDŁUŻ krawędzi, na której siedzi dzióbek. Domyślnie środek tej krawędzi. */
  ogonPrzy = null,
  /** Podane — rysujemy krzyżyk. Brak — dymek schodzi sam i nie ma czego klikać. */
  onZamknij = null,
  etykietaZamkniecia = "Zamknij",
  /** Dotknięcie całej bańki. W tej grze zwykle znaczy to samo, co krzyżyk. */
  onClick = null,
  className = "",
  children,
  ...reszta
}) {
  const [banka, setBanka] = useState({ szer: 0, wys: 0 });
  const obserwator = useRef(null);
  const gradId = useRef(null);
  if (gradId.current === null) gradId.current = `dymek-glina-${(licznikId += 1)}`;

  /* REF ZWROTNY, NIE `useLayoutEffect`. Dymek bywa montowany dopiero wtedy,
     gdy rodzic ma już treść — efekt po zmiennej zależności trafiałby na węzeł,
     którego w DOM-ie jeszcze nie ma, i pomiar nigdy by się nie powtórzył.
     Przeglądarka woła ref z węzłem, gdy ten wchodzi, i z `null`, gdy wychodzi.

     `offsetWidth/Height`, NIE `getBoundingClientRect`: dymki wjeżdżają
     animacją od `scale(.28)`, a prostokąt z `rect` podaje rozmiar PO
     transformacji — pierwszy pomiar byłby kilkukrotnie za mały i bańka
     narysowałaby się w połowie treści. */
  const zmierz = useCallback((el) => {
    obserwator.current?.disconnect();
    obserwator.current = null;
    if (!el) return;
    const odczyt = () => {
      const szer = el.offsetWidth;
      const wys = el.offsetHeight;
      setBanka((teraz) =>
        Math.abs(teraz.szer - szer) < 0.5 && Math.abs(teraz.wys - wys) < 0.5
          ? teraz
          : { szer, wys }
      );
    };
    odczyt();
    if (typeof ResizeObserver === "undefined") return;
    obserwator.current = new ResizeObserver(odczyt);
    obserwator.current.observe(el);
  }, []);

  const krzyzyk = onZamknij ? (
    <button
      type="button"
      className="chmurka-x dymek-x"
      onClick={(e) => { e.stopPropagation(); onZamknij(e); }}
      aria-label={etykietaZamkniecia}
    >
      <span aria-hidden="true">×</span>
    </button>
  ) : null;

  /* ── MYŚL: obłok z kółek ───────────────────────────────────────────────
     Stała proporcja i jedna ikona w środku — rozmiar podaje CSS wołającego
     (`aspect-ratio` + `width`), bo nie ma tu treści, która mogłaby urosnąć. */
  if (ogon === "kropki") {
    return (
      <div className={`dymek dymek--kropki ${className}`.trim()} onClick={onClick} {...reszta}>
        <ChmurkaKsztalt wariant="ikona" ogon={kierunek} />
        <div className="dymek-wnetrze">{children}</div>
        {krzyzyk}
      </div>
    );
  }

  /* ── WYPOWIEDŹ: bańka razem z dzióbkiem, jedną ścieżką ─────────────────
     Wartości zapasowe żyją przez jedną klatkę — zanim ref zdąży zmierzyć. */
  const szer = Math.max(MIN_SZEROKOSC, banka.szer || 240);
  const wys = Math.max(MIN_WYSOKOSC, banka.wys || 76);
  /* „brak" to nie brak kształtu, tylko ta sama bryła bez wypustki — stąd
     podmiana kierunku, a nie pominięcie ścieżki. */
  const kier = ogon === "brak" ? "brak" : kierunek;
  const pion = kier === "dol" || kier === "gora";
  const pole = poleChmurki({ szer, wys, kierunek: kier });
  const glina = glinaChmurki({ wys, kierunek: kier });
  const przy = ogonPrzy == null ? (pion ? szer : wys) / 2 : ogonPrzy;
  const d = sciezkaChmurki({ szer, wys, ogonX: przy, kierunek: kier });

  return (
    <div
      className={`dymek ${className}`.trim()}
      onClick={onClick}
      {...reszta}
      /* MINIMALNE WYMIARY WSTRZYKUJEMY Z JS, a nie wpisujemy w arkusz.
         Ścieżka i tak przycina bańkę do tych liczb (`MIN_SZEROKOSC`), więc
         gdyby pudełko z treścią mogło zejść niżej, kształt rysowałby się
         SZERZEJ niż box, który go mierzy. Trzymanie ich w CSS znaczyło, że
         przy każdej zmianie proporcji dzióbka trzeba pamiętać o dwóch
         miejscach — a nie pamiętało się. `dymek.css` bierze z tego maksimum
         razem z `--dymek-min-szer`, więc wołający może próg PODNIEŚĆ, ale
         nie obniżyć poniżej tego, co da się narysować. */
      style={{
        "--dymek-min-wbudowane": `${MIN_SZEROKOSC}px`,
        "--dymek-min-wys-wbudowane": `${MIN_WYSOKOSC}px`,
        ...(reszta.style || null),
      }}
    >
      {/* Ścieżka leży POD treścią i nie łapie dotknięć — klikalna jest cała
          bańka. Wystaje poza swój box o długość dzióbka, stąd `overflow:
          visible` w arkuszu i ujemne przesunięcie, gdy ogon idzie w górę
          albo w lewo: wtedy czubek jest PRZED lewym górnym rogiem bańki. */}
      <svg
        className="dymek-ksztalt"
        width={pole.szer}
        height={pole.wys}
        viewBox={`0 0 ${pole.szer} ${pole.wys}`}
        style={{ left: pole.przesX, top: pole.przesY }}
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          {/* GLINA — pięć stopni z `tokeny.css` sekcja 7. Zakres i offsety
              liczy `glinaChmurki`, bo zależą od tego, po której stronie wisi
              dzióbek; `userSpaceOnUse` jest do tego konieczne. */}
          <linearGradient
            id={gradId.current}
            gradientUnits="userSpaceOnUse"
            x1="0" y1={glina.y1} x2="0" y2={glina.y2}
          >
            {glina.stopnie.map(([offset, ton]) => (
              <stop key={ton} offset={offset} stopColor={`var(--chmurka-tlo-${ton})`} />
            ))}
          </linearGradient>
        </defs>
        {/* stroke i stroke-width idą z `dymek.css`: atrybut SVG nie przyjmuje
            `var()`, a lamówka ma być wspólna dla całej rodziny. */}
        <path d={d} fill={`url(#${gradId.current})`} strokeLinejoin="round" />
      </svg>

      <div className="dymek-wnetrze" ref={zmierz}>{children}</div>
      {krzyzyk}
    </div>
  );
}

/** Długość dzióbka — wołający potrzebuje jej, gdy sam ustawia dymek przy celu. */
export { OGON_DLUGOSC };
