/**
 * PuzzleBrama — ekran układanki, który ODBLOKOWUJE minigrę.
 *
 * Wchodzi, gdy dziecko ma już komplet kawałków z mapy (patrz `puzzleGier`).
 * Kawałek kładzie się DWOJAKO — oba gesty prowadzą przez tę samą regułę:
 *
 *   1. PRZECIĄGNIĘCIE palcem z tacy na siatkę (małe dzieci najpierw ciągną,
 *      dopiero potem odkrywają dotykanie),
 *   2. dotknięcie kawałka na tacy, potem jego miejsca na siatce.
 *
 * Reguła jest jedna: kawałek wskakuje TYLKO na swoje pole; cudze pole
 * odpowiada wstrząsem i kawałek zostaje w ręce / na tacy. Dzięki temu nie
 * istnieje stan „wszystko poukładane źle i nie da się ruszyć" — układanka
 * zawsze jest do skończenia, a pomyłka uczy, nie karze. Dotknięcie
 * ułożonego kawałka OBRACA go o ćwierć — kawałki przychodzą przekręcone
 * i to jest druga połowa zagadki. Przez pierwsze DWA obroty przekręcony,
 * położony kawałek nosi migającą ikonkę obrotu — potem gest jest już
 * dziecka i ikonka znika na zawsze (w tym otwarciu).
 *
 * KSZTAŁT KAWAŁKÓW jest prawdziwie puzzlowy: wypustki i wcięcia, nie
 * kwadraty. Każdy kawałek to SVG — ścieżka z czterech krawędzi tnie
 * (`clipPath`) pełny obrazek, więc osobne pliki graficzne nie istnieją,
 * a sąsiednie kawałki pasują do siebie co do piksela (dzielą tę samą
 * krzywą). Puste pole pokazuje KONTUR swojego kawałka — dziecko dobiera
 * kształt do dziury, jak przy prawdziwych puzzlach na stole. Na tacy leżą
 * SAME kawałki, bez kafelków pod spodem — kwadratowe podkładki robiły
 * z puzzli talię kart.
 *
 * Ułożenie (wszystkie pola pełne, wszystkie obroty wróciły do zera) zapisuje
 * się od razu (`zaliczUlozenie`) — CTA „Gramy!" tylko rusza dalej, więc
 * zamknięcie ekranu w tym miejscu niczego nie cofa.
 */
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { bokSiatki, obrazekPuzzli, zaliczUlozenie } from "./puzzleGier.js";
import "../styles/puzzle-brama.css";

/** Bok jednego pola w jednostkach viewBoxu — sama skala, dobrana dla czytelnych liczb. */
const S = 100;
/** Wysokość wypustki jako ułamek boku pola. */
const GLEBIA = 0.24;
/** Zapas viewBoxu na wypustki wystające poza pole. */
const MARGINES = S * 0.3;
const OBROTY = [90, 180, 270];
/** Ile pikseli palec musi przejechać, żeby dotknięcie stało się ciągnięciem. */
const PROG_CIAGNIECIA = 8;
/** Po ilu wykonanych obrotach ikonka-podpowiedź znika na dobre. */
const OBROTY_Z_PODPOWIEDZIA = 2;

/**
 * Jedna krawędź kawałka, od A do B. `off` to wektor wypustki W ŚWIECIE
 * (nie względem kierunku rysowania) — dzięki temu obie strony wspólnej
 * krawędzi, rysowane w przeciwnych kierunkach, dają DOKŁADNIE tę samą
 * krzywą i kawałki pasują bez szpar. `off = null` — prosty brzeg planszy.
 */
function segment(A, B, off) {
  if (!off) return `L ${B.x} ${B.y}`;
  const d = { x: B.x - A.x, y: B.y - A.y };
  const P = (u, o = 0) => `${A.x + d.x * u + off.x * o} ${A.y + d.y * u + off.y * o}`;
  return `L ${P(0.37)} C ${P(0.5)} ${P(0.35, 1)} ${P(0.5, 1)} C ${P(0.65, 1)} ${P(0.5)} ${P(0.63)} L ${B.x} ${B.y}`;
}

const losKierunek = () => (Math.random() < 0.5 ? -1 : 1);

/**
 * Krawędzie całej układanki — wypustka czy wcięcie, losowane RAZ na
 * otwarcie ekranu. Wspólna tablica, nie losowanie per kawałek: sąsiedzi
 * muszą się zgadzać (wypustka jednego to wcięcie drugiego).
 */
function losujKrawedzie(bok) {
  return {
    poziome: Array.from({ length: bok - 1 }, () => Array.from({ length: bok }, losKierunek)),
    pionowe: Array.from({ length: bok }, () => Array.from({ length: bok - 1 }, losKierunek)),
  };
}

function sciezkaKawalka(k, bok, kr) {
  const r = Math.floor(k / bok);
  const c = k % bok;
  const x0 = c * S;
  const y0 = r * S;
  const TL = { x: x0, y: y0 };
  const TR = { x: x0 + S, y: y0 };
  const BR = { x: x0 + S, y: y0 + S };
  const BL = { x: x0, y: y0 + S };
  const g = GLEBIA * S;
  const gora = r === 0 ? null : { x: 0, y: kr.poziome[r - 1][c] * g };
  const prawa = c === bok - 1 ? null : { x: kr.pionowe[r][c] * g, y: 0 };
  const dol = r === bok - 1 ? null : { x: 0, y: kr.poziome[r][c] * g };
  const lewa = c === 0 ? null : { x: kr.pionowe[r][c - 1] * g, y: 0 };
  return (
    `M ${TL.x} ${TL.y} ` +
    `${segment(TL, TR, gora)} ${segment(TR, BR, prawa)} ` +
    `${segment(BR, BL, dol)} ${segment(BL, TL, lewa)} Z`
  );
}

/**
 * Jeden kawałek jako SVG. Z `obrazek` — wycinek zdjęcia w puzzlowym
 * kształcie; bez — sam KONTUR (podpowiedź na pustym polu). ViewBox celuje
 * we własne pole z zapasem na wypustki, więc ten sam komponent działa
 * na siatce, na tacy i w kawałku ciągniętym pod palcem.
 */
function KawalekSVG({ k, bok, sciezka, obrazek, obrot = 0 }) {
  const uid = useId();
  const r = Math.floor(k / bok);
  const c = k % bok;
  return (
    <svg
      className="puzzle-kawalek-svg"
      viewBox={`${c * S - MARGINES} ${r * S - MARGINES} ${S + 2 * MARGINES} ${S + 2 * MARGINES}`}
      style={obrot ? { transform: `rotate(${obrot}deg)` } : undefined}
      aria-hidden="true"
    >
      {obrazek ? (
        <>
          <clipPath id={uid}>
            <path d={sciezka} />
          </clipPath>
          <g clipPath={`url(#${uid})`}>
            <image href={obrazek} x="0" y="0" width={bok * S} height={bok * S} preserveAspectRatio="none" />
          </g>
          <path d={sciezka} fill="none" stroke="rgba(90,58,18,.5)" strokeWidth="2.4" />
        </>
      ) : (
        <>
          {/* DZIURA, nie kontur: puste pole jest wgłębieniem w planszy —
              ciemniejsze wypełnienie, cień nad górną krawędzią i jasny brzeg
              pod dolną (drop-shadow w klasie) robią wrażenie, że kawałek
              trzeba WSADZIĆ. Kreskowana ramka mówiła „tu narysuj",
              wgłębienie mówi „tu włóż". */}
          <path
            className="puzzle-dziura"
            d={sciezka}
            fill="rgba(84,54,16,.18)"
            stroke="rgba(96,62,20,.3)"
            strokeWidth="1.6"
          />
        </>
      )}
    </svg>
  );
}

/** Migająca ikonka obrotu na położonym, przekręconym kawałku (pierwsze ruchy). */
function IkonkaObrotu() {
  return (
    <span className="puzzle-obrot-hint" aria-hidden="true">
      <svg viewBox="0 0 24 24">
        <path
          d="M 12 4.5 A 7.5 7.5 0 1 1 5.2 8.8"
          fill="none"
          stroke="#fff"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        <path d="M 2.4 3.4 L 8.4 4.6 L 4.4 9.2 Z" fill="#fff" />
      </svg>
    </span>
  );
}

/**
 * Taca na start: wszystkie kawałki, przetasowane i przekręcone. Obrót losuje
 * się z {90,180,270} — kawałek „od razu dobrze" zdarzałby się co czwarty raz
 * i połowa zagadki znikałaby z ekranu, zanim dziecko ją zauważy.
 */
function potasowane(ile) {
  const kawalki = Array.from({ length: ile }, (_, k) => ({
    kawalek: k,
    obrot: OBROTY[Math.floor(Math.random() * OBROTY.length)],
  }));
  for (let i = kawalki.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [kawalki[i], kawalki[j]] = [kawalki[j], kawalki[i]];
  }
  return kawalki;
}

export default function PuzzleBrama({ gra, tytul, onUlozona, onZamknij }) {
  const bok = bokSiatki(gra);
  const cel = bok * bok;
  const obrazek = obrazekPuzzli(gra);

  // Kształty losują się raz na otwarcie ekranu i żyją do jego zamknięcia —
  // kontur na pustym polu musi pasować do kawałka na tacy co do krzywej.
  const krawedzie = useMemo(() => losujKrawedzie(bok), [gra, bok]);
  const sciezki = useMemo(
    () => Array.from({ length: cel }, (_, k) => sciezkaKawalka(k, bok, krawedzie)),
    [cel, bok, krawedzie]
  );

  const [taca, setTaca] = useState(() => potasowane(cel));
  const [pola, setPola] = useState(() => Array(cel).fill(null));
  // Indeks na tacy, nie id kawałka: dwa dotknięcia tego samego kafelka mają
  // go odłożyć, a po każdym wstawieniu taca i tak numeruje się od nowa.
  const [wybrany, setWybrany] = useState(null);
  // Pole, które właśnie odmówiło przyjęcia kawałka — na chwilę, do wstrząsu.
  const [pudlo, setPudlo] = useState(null);
  /**
   * Pole, na które kawałek WŁAŚNIE wskoczył — na czas animacji osadzenia.
   * STAN, nie animacja wejściowa na montowaniu SVG: klasa zapala się w tej
   * samej chwili, w której zapada decyzja o położeniu, więc wskok nie
   * zależy od tego, jak i kiedy przeglądarka montuje element.
   */
  const [wskok, setWskok] = useState(null);
  const zegarWskoku = useRef(0);
  // Kawałek ciągnięty palcem: {indeks, x, y, rozmiar} albo null.
  const [ciag, setCiag] = useState(null);
  // Ile obrotów dziecko już wykonało — od tego zależy ikonka-podpowiedź.
  const [obroty, setObroty] = useState(0);
  const zegarPudla = useRef(0);
  const siatkaRef = useRef(null);
  // Dotknięcie na tacy między pointerdown a pointerup. REF, nie stan:
  // pierwsze piksele ruchu nie mają przerysowywać ekranu.
  const dotykRef = useRef(null);

  const ulozone = useMemo(
    () => pola.length > 0 && pola.every((p, i) => p && p.kawalek === i && p.obrot % 360 === 0),
    [pola]
  );

  // Zapis odblokowania NATYCHMIAST po ułożeniu, nie w CTA: zamknięcie ekranu
  // krzyżykiem po ułożeniu nie może odebrać tego, co dziecko już zrobiło.
  useEffect(() => {
    if (ulozone) zaliczUlozenie(gra);
  }, [ulozone, gra]);

  useEffect(
    () => () => {
      window.clearTimeout(zegarPudla.current);
      window.clearTimeout(zegarWskoku.current);
    },
    []
  );

  if (!bok) return null;

  const wstrzasnij = (pole) => {
    window.clearTimeout(zegarPudla.current);
    setPudlo(pole);
    zegarPudla.current = window.setTimeout(() => setPudlo(null), 420);
  };

  /**
   * Świętowanie na polu `i`: wskok ze złotym pierścieniem i brzdękiem.
   * Gra w DWÓCH momentach — bo dziecko wykonuje tu dwa osiągnięcia:
   * kawałek trafił do swojej dziury (pozycja) i kawałek obrócił się do
   * końca (dopasowanie). Dźwięk przez dynamiczny import: układanka nie
   * ciągnie modułu audio do paczki, a bez głośnika po prostu milczy.
   */
  const swietujOsadzenie = (i) => {
    window.clearTimeout(zegarWskoku.current);
    setWskok(i);
    zegarWskoku.current = window.setTimeout(() => setWskok(null), 700);
    import("../services/soundFx.js").then((m) => m.fx?.gentleMagical?.(0.45)).catch(() => {});
  };

  /**
   * Próba położenia kawałka z tacy na pole `i` — wspólna dla obu gestów.
   * Zwraca true, gdy kawałek wskoczył (gest ma wtedy sprzątnąć wybór).
   */
  const polozKawalek = (indeksTacy, i) => {
    const kawalek = taca[indeksTacy];
    if (!kawalek || pola[i]) return false;
    if (kawalek.kawalek !== i) {
      wstrzasnij(i);
      return false;
    }
    setPola((p) => p.map((w, idx) => (idx === i ? kawalek : w)));
    setTaca((t) => t.filter((_, idx) => idx !== indeksTacy));
    swietujOsadzenie(i);
    return true;
  };

  const naPole = (i) => {
    if (ulozone) return;
    if (pola[i]) {
      // Obrót o ćwierć — jedyne, co się robi z ułożonym kawałkiem.
      const nowyObrot = (pola[i].obrot + 90) % 360;
      setPola((p) => p.map((w, idx) => (idx === i ? { ...w, obrot: nowyObrot } : w)));
      setObroty((o) => o + 1);
      /* DOPASOWANE DO KOŃCA: obrót, który wrócił do zera, znaczy „kawałek
         siedzi idealnie" — dziecko właśnie DOMKNĘŁO ten kawałek i to jest
         moment na wskok z pierścieniem, wyraźniejszy niż samo położenie. */
      if (nowyObrot === 0) swietujOsadzenie(i);
      return;
    }
    if (wybrany === null) return;
    // Pomyłka zostawia kawałek WYBRANY — dziecko próbuje od razu dalej,
    // bez ponownego szukania go na tacy.
    if (polozKawalek(wybrany, i)) setWybrany(null);
  };

  /** Pole siatki pod punktem ekranu (albo null, gdy palec skończył obok). */
  const poleSpod = (x, y) => {
    const rect = siatkaRef.current?.getBoundingClientRect();
    if (!rect || x < rect.left || x >= rect.right || y < rect.top || y >= rect.bottom) return null;
    const kol = Math.min(bok - 1, Math.floor(((x - rect.left) / rect.width) * bok));
    const rzad = Math.min(bok - 1, Math.floor(((y - rect.top) / rect.height) * bok));
    return rzad * bok + kol;
  };

  /* ── ciągnięcie palcem ──
     `setPointerCapture` na przycisku tacy: ruch i puszczenie przychodzą do
     NIEGO nawet daleko poza jego brzegiem, więc nie potrzeba globalnych
     nasłuchów. Dotknięcie bez ruchu (poniżej progu) zostaje wyborem — jeden
     przycisk obsługuje oba gesty i żaden nie wchodzi drugiemu w drogę. */
  const naDotykTacy = (e, indeks) => {
    if (ulozone) return;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    dotykRef.current = { indeks, x0: e.clientX, y0: e.clientY, ruszyl: false };
  };

  const naRuchTacy = (e) => {
    const d = dotykRef.current;
    if (!d) return;
    if (!d.ruszyl) {
      if (Math.hypot(e.clientX - d.x0, e.clientY - d.y0) < PROG_CIAGNIECIA) return;
      d.ruszyl = true;
      const rect = siatkaRef.current?.getBoundingClientRect();
      // Ciągnięty kawałek ma rozmiar POLA siatki — pod palcem widać
      // dokładnie to, co za chwilę wskoczy na planszę.
      d.rozmiar = rect ? rect.width / bok : 96;
      setWybrany(null);
    }
    setCiag({ indeks: d.indeks, x: e.clientX, y: e.clientY, rozmiar: d.rozmiar });
  };

  const naKoniecTacy = (e, indeks) => {
    const d = dotykRef.current;
    dotykRef.current = null;
    if (!d) return;
    if (!d.ruszyl) {
      // Zwykłe dotknięcie: wybór albo odłożenie.
      setWybrany((w) => (w === indeks ? null : indeks));
      return;
    }
    setCiag(null);
    const i = poleSpod(e.clientX, e.clientY);
    if (i !== null && !pola[i]) polozKawalek(d.indeks, i);
    else if (i !== null) wstrzasnij(i);
  };

  const naPrzerwanieTacy = () => {
    dotykRef.current = null;
    setCiag(null);
  };

  const ciagniety = ciag ? taca[ciag.indeks] : null;

  return (
    <div className="puzzle-brama" data-testid="puzzle-brama">
      <div className="puzzle-karta">
        <button type="button" className="puzzle-x" onClick={onZamknij} aria-label="Zamknij" title="Zamknij">
          ×
        </button>
        <p className="puzzle-nadtytul">✦ UKŁADANKA</p>
        <h2 className="puzzle-tytul">{tytul}</h2>
        <p className="puzzle-podpowiedz">
          {ulozone
            ? "Obrazek jest cały — brama otwarta!"
            : "Przeciągnij kawałek na jego miejsce.\nDotknięty na siatce — obraca się."}
        </p>
        <div
          ref={siatkaRef}
          className={"puzzle-siatka" + (ulozone ? " is-ulozona" : "")}
          style={{ "--bok": bok }}
        >
          {pola.map((p, i) => (
            <button
              key={i}
              type="button"
              className={
                "puzzle-pole" +
                (p ? " is-pelne" : "") +
                (pudlo === i ? " is-pudlo" : "") +
                (wskok === i ? " is-wskok" : "")
              }
              onClick={() => naPole(i)}
              aria-label={`Pole ${i + 1}`}
            >
              {p ? (
                <KawalekSVG k={p.kawalek} bok={bok} sciezka={sciezki[p.kawalek]} obrazek={obrazek} obrot={p.obrot} />
              ) : (
                <KawalekSVG k={i} bok={bok} sciezka={sciezki[i]} />
              )}
              {/* Podpowiedź obrotu — tylko przez pierwsze ruchy i tylko na
                  kawałku, który faktycznie wymaga obrócenia. Po dwóch
                  wykonanych obrotach gest jest już dziecka. */}
              {p && p.obrot % 360 !== 0 && obroty < OBROTY_Z_PODPOWIEDZIA ? <IkonkaObrotu /> : null}
              {/* Złoty pierścień rozchodzący się z miejsca osadzenia. */}
              {wskok === i && p ? <span className="puzzle-blysk-osadzenia" /> : null}
            </button>
          ))}
          {/* Po ułożeniu siatka „zrasta się" w jeden obrazek — bez szwów,
              żeby nagrodą było ZOBACZENIE całości, nie tabelka z kratkami. */}
          {ulozone ? (
            <div className="puzzle-caly" style={{ backgroundImage: `url(${obrazek})` }} />
          ) : null}
        </div>
        {ulozone ? (
          <button type="button" className="puzzle-cta" onClick={onUlozona}>
            Gramy! ✦
          </button>
        ) : (
          <div className="puzzle-taca">
            {taca.map((k, i) => (
              <button
                key={k.kawalek}
                type="button"
                className={
                  "puzzle-kafelek" +
                  (wybrany === i ? " is-wybrany" : "") +
                  (ciag && ciag.indeks === i ? " is-ciagniety" : "")
                }
                onPointerDown={(e) => naDotykTacy(e, i)}
                onPointerMove={naRuchTacy}
                onPointerUp={(e) => naKoniecTacy(e, i)}
                onPointerCancel={naPrzerwanieTacy}
                aria-label={`Kawałek ${i + 1}`}
              >
                <KawalekSVG k={k.kawalek} bok={bok} sciezka={sciezki[k.kawalek]} obrazek={obrazek} obrot={k.obrot} />
              </button>
            ))}
          </div>
        )}
      </div>
      {/* Kawałek pod palcem — nad wszystkim, nie łapie dotknięć. */}
      {ciagniety ? (
        <div
          className="puzzle-ciag"
          style={{ left: ciag.x, top: ciag.y, width: ciag.rozmiar * 1.6, height: ciag.rozmiar * 1.6 }}
        >
          <KawalekSVG
            k={ciagniety.kawalek}
            bok={bok}
            sciezka={sciezki[ciagniety.kawalek]}
            obrazek={obrazek}
            obrot={ciagniety.obrot}
          />
        </div>
      ) : null}
    </div>
  );
}
