/**
 * Reflektor — podpowiedź celująca w JEDEN element HUD-u. Dwa tryby:
 *
 *   "dymek"     — komiksowa chmurka z dzióbkiem wbitym w ikonę. Świat chodzi
 *                 dalej, nic nie gaśnie, chmurka schodzi sama po kilku
 *                 sekundach. Zaproszenie, nie przerwa.
 *   "reflektor" — świat ciemnieje, w świetle zostaje jeden przycisk, dziecko
 *                 musi coś zdecydować. Do rzeczy, bez których dalej nie idzie.
 *
 * POMIAR, NIE ZGADYWANIE. Pozycja bierze się z `getBoundingClientRect` celu
 * i odświeża się przy zmianie rozmiaru okna oraz co 250 ms, dopóki podpowiedź
 * stoi. HUD wjeżdża animacją i ma marginesy zależne od telefonu — współrzędne
 * wpisane z palca rozjechałyby się na pierwszym innym ekranie.
 *
 * DZIÓBEK LICZY SIĘ NAJBARDZIEJ. Dok ma cztery jednakowe ikony obok siebie;
 * chmurka wisząca „gdzieś nad dokiem" nie wskazuje żadnej z nich. Dlatego
 * dzióbek dostaje własną współrzędną (środek celu) i JEST CZĘŚCIĄ BAŃKI —
 * jedna ścieżka SVG rysuje obie rzeczy naraz (`ksztaltChmurki.js`). Doklejony
 * trójkąt zostawiał w miejscu styku szew i czytał się jak dwa kształty.
 *
 * Rozmiar bańki bierze się z TREŚCI: `ResizeObserver` mierzy warstwę z tekstem,
 * a ścieżka rysuje się pod ten pomiar. Dzięki temu chmurka rośnie z dłuższym
 * zdaniem i nie trzeba nigdzie wpisywać wysokości z palca.
 *
 * Reflektor NIE decyduje, kiedy się pokazać (to robi hub) ani czy dziecko już
 * zna to miejsce (to robi `wskazowki.js`). Tutaj jest obraz i wyjścia.
 */
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { OGON_DLUGOSC, sciezkaChmurki } from "./ksztaltChmurki.js";
import bgMusic from "../services/bgMusic.js";
import { powiedzJakLisek, uciszLiska } from "./glosLiska.js";

const ODSTEP = 10;          // ile światła/obręczy zostaje wokół celu
const PRZERWA = 9;          // odstęp chmurki od obręczy — dzióbek ma jej DOTYKAĆ
const SZER_DYMKA = 448;     // docelowa szerokość komponentu z Figmy
const MARGINES = 16;        // ile chmurka ma trzymać się od krawędzi ekranu

/**
 * Prostokąt do wskazania. Zwykle jest nim cały element, ale nie zawsze:
 * przycisk doku ma ~107×73 px komórki siatki, a WIDAĆ z niego złote koło 68×68
 * przyklejone do dolnej krawędzi (`::before` w `hud.css`). Bez `obszar`
 * dzióbek celowałby w powietrze nad ikoną.
 */
function zmierz(cel, obszar) {
  const r = cel?.getBoundingClientRect?.();
  if (!r || (!r.width && !r.height)) return null;

  let { left, top, width, height } = r;
  if (obszar) {
    width = obszar.szer ?? width;
    height = obszar.wys ?? height;
    left = r.left + (r.width - width) / 2;
    top =
      obszar.kotwica === "dol"
        ? r.bottom - height - (obszar.przesuniecie || 0)
        : obszar.kotwica === "gora"
          ? r.top + (obszar.przesuniecie || 0)
          : r.top + (r.height - height) / 2;
  }

  return {
    left: left - ODSTEP,
    top: top - ODSTEP,
    szer: width + ODSTEP * 2,
    wys: height + ODSTEP * 2,
    srodekX: left + width / 2,
  };
}

export default function Reflektor({ wskazowka, onZamknij }) {
  const [otwor, setOtwor] = useState(null);
  const [banka, setBanka] = useState({ szer: 0, wys: 0 });
  const celRef = useRef(null);
  const wnetrzeRef = useRef(null);

  // Cel znajdujemy PO wyrenderowaniu HUD-u: podpowiedź pojawia się nad żywym
  // interfejsem, a nie zamiast niego.
  useEffect(() => {
    if (!wskazowka) { setOtwor(null); celRef.current = null; return undefined; }
    let zywe = true;

    const odswiez = () => {
      if (!zywe) return;
      const el = document.querySelector(wskazowka.cel);
      celRef.current = el;
      setOtwor(zmierz(el, wskazowka.obszar));
    };

    odswiez();
    const zegar = window.setInterval(odswiez, 250);
    window.addEventListener("resize", odswiez);
    window.addEventListener("orientationchange", odswiez);
    return () => {
      zywe = false;
      window.clearInterval(zegar);
      window.removeEventListener("resize", odswiez);
      window.removeEventListener("orientationchange", odswiez);
    };
  }, [wskazowka]);

  /**
   * Rozmiar bańki bierze się z treści, nie odwrotnie: `ResizeObserver` patrzy
   * na warstwę z Wizkorem i tekstem, a ścieżka SVG rysuje się pod ten pomiar.
   * `useLayoutEffect`, żeby pierwsza narysowana klatka miała już właściwy
   * kształt — inaczej chmurka mrugałaby pustym tłem przy wjeździe.
   */
  useLayoutEffect(() => {
    const el = wnetrzeRef.current;
    if (!el) return undefined;
    /**
     * `offsetWidth/Height`, NIE `getBoundingClientRect`. Chmurka wjeżdża
     * animacją, która zaczyna się od `scale(.5)`, a prostokąt z `rect`
     * podaje rozmiar PO transformacji — pierwszy pomiar wypadał więc
     * dokładnie o połowę za mały i bańka rysowała się w połowie treści.
     * `offset*` opisuje układ, a nie to, co akurat robi z nim animacja.
     */
    const zmierzWnetrze = () => {
      const szer = el.offsetWidth;
      const wys = el.offsetHeight;
      setBanka((teraz) =>
        Math.abs(teraz.szer - szer) < 0.5 && Math.abs(teraz.wys - wys) < 0.5
          ? teraz
          : { szer, wys }
      );
    };
    zmierzWnetrze();
    if (typeof ResizeObserver === "undefined") return undefined;
    const obserwator = new ResizeObserver(zmierzWnetrze);
    obserwator.observe(el);
    return () => obserwator.disconnect();
  }, [wskazowka]);

  const zamknij = useCallback((powod) => onZamknij?.(powod), [onZamknij]);

  const powtorzGlos = useCallback(() => {
    if (wskazowka?.glos !== "lisek" || !wskazowka.tekst || !bgMusic.isEnabled()) return;
    powiedzJakLisek(wskazowka.tekst);
  }, [wskazowka]);

  // Lisek odzywa się chwilę po wjeździe chmurki, aby głos i animacja nie
  // startowały w tej samej klatce. Tekst pozostaje pełnym odpowiednikiem mowy,
  // a przycisk nutki pozwala ją powtórzyć. Brak dźwięku niczego nie blokuje.
  useEffect(() => {
    if (wskazowka?.glos !== "lisek") return undefined;
    const zegar = window.setTimeout(powtorzGlos, 420);
    return () => {
      window.clearTimeout(zegar);
      uciszLiska();
    };
  }, [wskazowka?.id, wskazowka?.glos, powtorzGlos]);

  /**
   * Chmurka schodzi SAMA. To zaproszenie w trakcie zabawy, a nie okno do
   * obsłużenia — dziecko, które jej nie zauważy, nie ma zostać z niczym
   * do kliknięcia na ekranie.
   */
  useEffect(() => {
    if (!wskazowka?.czasNaEkranie) return undefined;
    const zegar = window.setTimeout(() => zamknij("czas"), wskazowka.czasNaEkranie);
    return () => window.clearTimeout(zegar);
  }, [wskazowka, zamknij]);

  useEffect(() => {
    if (!wskazowka) return undefined;
    const naKlawisz = (e) => { if (e.key === "Escape") zamknij("escape"); };
    window.addEventListener("keydown", naKlawisz);
    return () => window.removeEventListener("keydown", naKlawisz);
  }, [wskazowka, zamknij]);

  /**
   * CHMURKA NIE MA PRZYCISKU. Wcześniej stało w niej zielone „Zobacz", które
   * klikało wskazaną ikonę za dziecko — i to była droga na skróty w złą
   * stronę: cała podpowiedź istnieje po to, żeby dziecko RAZ samo dotknęło
   * tej ikony i zapamiętało, gdzie ona jest. Zrobienie tego za nie uczy
   * tylko klikania w zielone przyciski.
   *
   * Dotknięcie samej chmurki znaczy więc „nie teraz" — schodzi z drogi
   * i odsłania to, na co wskazuje.
   */

  if (!wskazowka || !otwor) return null;

  const dymkowy = wskazowka.tryb !== "reflektor";
  const lisek = wskazowka.glos === "lisek";
  const wysOkna = typeof window === "undefined" ? 0 : window.innerHeight;
  // `.hub-root` jest na szerokim ekranie wyśrodkowaną, transformowaną planszą.
  // `position:fixed` wewnątrz takiego rodzica liczy pozycję od planszy, podczas
  // gdy `getBoundingClientRect()` celu zwraca współrzędne całego okna. Warstwę
  // portalujemy do `body`, ale poziomo nadal trzymamy ją w granicach planszy.
  const granice = typeof document === "undefined"
    ? { left: 0, right: 360, width: 360 }
    : (document.querySelector(".hub-root")?.getBoundingClientRect() || {
        left: 0, right: window.innerWidth, width: window.innerWidth,
      });
  const nadCelem = otwor.top > wysOkna * 0.45;

  // Chmurka trzyma się ekranu, ale dzióbek zostaje na celu — dlatego liczymy
  // je osobno. Przy skrajnej ikonie doku chmurka dosuwa się do krawędzi,
  // a dzióbek wędruje w jej stronę zamiast ciągnąć ją poza ekran.
  const szerDymka = Math.min(SZER_DYMKA, granice.width - MARGINES * 2);
  const lewaDymka = Math.max(
    granice.left + MARGINES,
    Math.min(otwor.srodekX - szerDymka / 2, granice.right - MARGINES - szerDymka)
  );
  const dziobekX = Math.max(18, Math.min(otwor.srodekX - lewaDymka - 13, szerDymka - 44));

  const stylDymka = nadCelem
    ? { bottom: `${Math.max(MARGINES, wysOkna - otwor.top + PRZERWA)}px` }
    : { top: `${otwor.top + otwor.wys + PRZERWA}px` };

  const kolisty = String(wskazowka.promien || "").trim() === "50%";
  const otworMaski = kolisty ? (
    <ellipse
      cx={otwor.left + otwor.szer / 2}
      cy={otwor.top + otwor.wys / 2}
      rx={otwor.szer / 2}
      ry={otwor.wys / 2}
      fill="black"
    />
  ) : (
    <rect
      x={otwor.left}
      y={otwor.top}
      width={otwor.szer}
      height={otwor.wys}
      rx={parseFloat(wskazowka.promien) || 18}
      fill="black"
    />
  );

  const lapacz = (styl, klucz) => (
    <div key={klucz} className="reflektor-lapacz" style={styl} onClick={() => zamknij("obok")} />
  );

  return createPortal((
    <div
      className={`reflektor${dymkowy ? " jest-dymkiem" : ""}${lisek ? " jest-liskiem" : " jest-wizkorem"}`}
      style={{ "--reflektor-akcent": lisek ? "#ff8a17" : "#7b3fb0" }}
      role={dymkowy ? "status" : "dialog"}
      aria-live={dymkowy ? "polite" : undefined}
      aria-modal={dymkowy ? undefined : "true"}
      aria-label={wskazowka.tytul}
    >
      {/* Tryb mocny: cień z otworem w kształcie celu (maska SVG) i cztery
          przezroczyste łapacze, które przejmują dotknięcia POZA otworem.
          Sam otwór zostaje wolny, więc dziecko może dotknąć tego, co świeci. */}
      {dymkowy ? null : (
        <>
          <svg className="reflektor-cien" aria-hidden="true">
            <defs>
              <mask id="reflektor-maska">
                <rect x="0" y="0" width="100%" height="100%" fill="white" />
                {otworMaski}
              </mask>
            </defs>
            <rect x="0" y="0" width="100%" height="100%" fill="rgba(22,16,44,.74)" mask="url(#reflektor-maska)" />
          </svg>
          {lapacz({ left: 0, top: 0, width: "100%", height: `${Math.max(0, otwor.top)}px` }, "gora")}
          {lapacz({ left: 0, top: `${otwor.top + otwor.wys}px`, width: "100%", bottom: 0 }, "dol")}
          {lapacz({ left: 0, top: `${otwor.top}px`, width: `${Math.max(0, otwor.left)}px`, height: `${otwor.wys}px` }, "lewo")}
          {lapacz({ left: `${otwor.left + otwor.szer}px`, top: `${otwor.top}px`, right: 0, height: `${otwor.wys}px` }, "prawo")}
        </>
      )}

      {/* Obręcz na ikonie — pulsuje w obu trybach. `pointer-events: none`,
          żeby nie odbierała kliknięcia temu, co wskazuje. */}
      <div
        className="reflektor-obrecz"
        style={{
          left: `${otwor.left}px`,
          top: `${otwor.top}px`,
          width: `${otwor.szer}px`,
          height: `${otwor.wys}px`,
          borderRadius: wskazowka.promien || "18px",
        }}
      />

      <div
        className={`reflektor-dymek${nadCelem ? " jest-nad" : " jest-pod"}`}
        style={{ ...stylDymka, left: `${lewaDymka}px`, width: `${szerDymka}px` }}
      >
        <div className="reflektor-karta" onClick={() => zamknij("dotkniecie")} role="presentation">
          {/* Bańka i dzióbek to JEDNA ścieżka. Leży pod treścią, nie łapie
              kliknięć (klikalna jest cała chmurka) i wystaje poza swój box
              o długość dzióbka — stąd `overflow: visible` w CSS. */}
          <svg
            className="reflektor-ksztalt"
            width={banka.szer || szerDymka}
            height={(banka.wys || 90) + OGON_DLUGOSC}
            viewBox={`0 0 ${banka.szer || szerDymka} ${(banka.wys || 90) + OGON_DLUGOSC}`}
            style={nadCelem ? { top: 0 } : { top: `${-OGON_DLUGOSC}px` }}
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="reflektor-wypelnienie" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#fffcf2" />
                <stop offset="1" stopColor="#ffeec4" />
              </linearGradient>
            </defs>
            <path
              d={sciezkaChmurki({
                szer: banka.szer || szerDymka,
                wys: banka.wys || 90,
                ogonX: otwor.srodekX - lewaDymka,
                wDol: nadCelem,
              })}
              fill="url(#reflektor-wypelnienie)"
              stroke="var(--reflektor-akcent)"
              strokeWidth="3"
              strokeLinejoin="round"
            />
          </svg>

          <button
            type="button"
            className="reflektor-x"
            onClick={(e) => { e.stopPropagation(); zamknij("krzyzyk"); }}
            aria-label="Zamknij podpowiedź"
          >
            ×
          </button>

          <div className="reflektor-wnetrze" ref={wnetrzeRef}>
            <img
              className={`reflektor-postac${lisek ? " jest-liskiem" : ""}`}
              src={wskazowka.postac}
              alt=""
              aria-hidden="true"
              draggable="false"
            />
            <div className="reflektor-tresc">
              <h2>{wskazowka.tytul}</h2>
              <p>
                {wskazowka.linie?.length
                  ? wskazowka.linie.map((linia, index) => (
                      <React.Fragment key={linia}>
                        {index ? <br /> : null}{linia}
                      </React.Fragment>
                    ))
                  : wskazowka.tekst}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ), document.body);
}
