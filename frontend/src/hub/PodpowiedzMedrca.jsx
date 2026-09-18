/*!
 * SPDX-FileCopyrightText: © 2026 Amitiel Angelisme <armitiel@gmail.com>
 * SPDX-License-Identifier: LicenseRef-EwolucJA-Proprietary
 *
 * EwolucJA — gra edukacyjna dla dzieci.
 * Produkt powstał w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”;
 * autorskie prawa majątkowe pozostają przy autorze. Licencja: LICENSE.
 */
/**
 * PodpowiedzMedrca — Wizkor wychyla się czasem w hubie z jedną myślą o ciele.
 * (Nazwa pliku, klasy `medrzec-*` i klucze zapisu zostają po dawnym „Mędrcu”
 * — to ta sama postać, patrz `docs/SWIAT_I_POSTACIE.md`.)
 *
 * Trzy decyzje, które warto znać przed zmianą:
 *
 * 1. RZADKO I NIGDY W DRODZE. Pokazuje się dopiero po chwili spokojnej gry
 *    (`PIERWSZA`), potem co kilka minut i najwyżej `MAX_NA_SESJE` razy. Znika
 *    sama albo po dotknięciu. To ma być mrugnięcie okiem, nie przypomnienie
 *    z aplikacji zdrowotnej — dziecko nie zrobi nic „źle", ignorując ją.
 *
 * 2. NIE PRZERYWA. Chowa się, gdy otwarty jest panel albo zwój, i nie wchodzi,
 *    zanim rozsuną się chmury. Nie łapie też dotknięć poza własnym dymkiem,
 *    więc nie blokuje chodzenia po świecie.
 *
 * 3. GŁOS WIZKORA. `glos: "las_decyzji"` to ten sam klucz lektora, którym
 *    Wizkor mówi w oknie postaci i w zadaniach — jedna postać, jeden głos
 *    (kanon 17.09.2026). Ton `calm`, bo to spokojna myśl, a nie zlecenie.
 *    Głos `mentor` zostaje wyłącznie po stronie dorosłego.
 *
 * Mówi niezależnie od nutki w HUD-zie — ta ścisza muzykę w tle, nie postacie
 * (`hub/mowaPostaci.js`). Głos Wizkora bywa jedyną wersją porady dostępną dla
 * dziecka, które jeszcze nie czyta płynnie.
 */
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import ChmurkaKsztalt from "./ChmurkaKsztalt.jsx";
import { powiedzPostacia } from "./mowaPostaci.js";
import { odmienDlaGracza } from "../services/rodzaj.js";
import DANE from "../hub/data/porady-zdrowia.v1.json";
import "../styles/wizkor-mysl.css";

const PIERWSZA = 75_000;        // ile spokojnej gry przed pierwszym wejściem
const KOLEJNA = 300_000;        // odstęp między kolejnymi
const WIDOCZNA = 11_000;        // jak długo wisi, jeśli nikt jej nie dotknie
/* Najpierw w róg wjeżdża awatar, dopiero potem rozwija się myśl. Pół sekundy
   to tyle, ile trwa wjazd — chmurka wchodzi w chwili, w której Wizkor już
   stoi. Głos rusza RAZEM z chmurką: zdanie ma zabrzmieć wtedy, kiedy jest
   co czytać, a nie zza pustego rogu ekranu. */
const ZWLOKA_CHMURKI = 520;
/* Zawinięcie: chmurka wciąga się 340 ms, awatar rusza 120 ms po niej i też
   idzie 340 ms. Ta liczba MUSI być sumą z `wizkor-mysl.css` — komponent zdejmuje
   się dopiero po niej, a krótsza ucięłaby animację w połowie. */
const ZEJSCIE = 460;
const MAX_NA_SESJE = 3;

/* ── MASZYNA DO PISANIA ──────────────────────────────────────────────────
   Trzeci takt wejścia: awatar wjeżdża, rozwija się chmurka, dopiero potem
   zdanie pisze się znak po znaku. Chodzi o to samo, co przy dwóch pierwszych —
   żeby to wyglądało na KOGOŚ, kto właśnie coś mówi, a nie na wyświetlony
   komunikat. Dziecko, które jeszcze składa litery, dostaje przy okazji tempo,
   w którym da się nadążyć wzrokiem.

   SZYBKO, nie dramatycznie: 22 ms na znak to jakieś 45 znaków na sekundę.
   Wolniej i zdanie zaczyna nudzić, zanim się skończy. Po kropce i przecinku
   pauza, bo tam człowiek nabiera powietrza — i dokładnie tam wzrok nadrabia
   zaległość. */
const ZNAK_MS = 22;
const PAUZA_ZDANIE = 170;   // po . ! ? …
const PAUZA_FRAZA = 90;     // po , ; : —

function pauzaPo(znak) {
  if (".!?…".includes(znak)) return PAUZA_ZDANIE;
  if (",;:—".includes(znak)) return PAUZA_FRAZA;
  return ZNAK_MS;
}

/** Ile mniej więcej potrwa pisanie — o tyle dłużej chmurka ma wisieć. */
function czasPisania(tekst) {
  let ms = 0;
  for (const z of tekst) ms += pauzaPo(z);
  return Math.min(ms, 3200);
}

function chceSpokoju() {
  try { return window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch { return false; }
}
const KLUCZ_OSTATNIA = "ewolucja.medrzec.ostatnia";   // znacznik czasu
const KLUCZ_HISTORIA = "ewolucja.medrzec.historia";   // ostatnio pokazane id

/** Losowa porada, ale nie ta sama co ostatnio — powtórka psuje wrażenie uwagi. */
function wybierzPorade() {
  const porady = DANE.porady || [];
  if (!porady.length) return null;
  let historia = [];
  try { historia = JSON.parse(localStorage.getItem(KLUCZ_HISTORIA) || "[]"); } catch {}
  const swieze = porady.filter((p) => !historia.includes(p.id));
  const pula = swieze.length ? swieze : porady;
  const wybrana = pula[Math.floor(Math.random() * pula.length)];
  try {
    localStorage.setItem(KLUCZ_HISTORIA, JSON.stringify([wybrana.id, ...historia].slice(0, 6)));
  } catch {}
  return wybrana;
}

/**
 * `onWidoczna` — melduje hubowi, że myśl Wizkora jest na ekranie. Po to, żeby
 * cichy kanał ikonek przy awatarze (`ChmurkaAwatara`) nie wszedł w tym samym
 * momencie: dwie chmurki naraz to dwa głosy naraz, a dziecko nie wie, na którą
 * patrzeć. Podział kanałów: `docs/design-system/powiadomienia.md`.
 */
const PodpowiedzMedrca = forwardRef(function PodpowiedzMedrca({ aktywna = true, onWidoczna }, ref) {
  const [porada, setPorada] = useState(null);
  /* Osobny stan, a nie `porada !== null`: awatar stoi w rogu przez pół
     sekundy ZANIM wejdzie chmurka, więc widok ma dwie fazy, nie jedną. */
  const [chmurka, setChmurka] = useState(false);
  /* Ile zdania jest już „napisane". Osobno od `porada`, bo rośnie po chwili
     od pojawienia się chmurki — to trzeci takt tej samej sceny. */
  const [pisane, setPisane] = useState("");
  /* Czwarty takt: zawinięcie. Myśl wsiąka z powrotem w Wizkora, on wychodzi
     tą samą drogą, którą przyszedł — i dopiero wtedy komponent się zdejmuje.
     Bez tego stanu zniknięcie było cięciem w połowie zdania. */
  const [znika, setZnika] = useState(false);
  const licznik = useRef(0);
  const timerPokazu = useRef(null);
  const timerChmurki = useRef(null);
  const timerUkrycia = useRef(null);
  const timerLitery = useRef(null);
  const timerZejscia = useRef(null);
  /* Ref, nie stan: `schowaj` musi umieć odrzucić drugie dotknięcie
     NATYCHMIAST, a stan doszedłby dopiero przy kolejnym renderze. */
  const znikaRef = useRef(false);
  const wymuszone = useRef(false);

  const powtorz = useCallback((tekst) => {
    powiedzPostacia(tekst, { glos: "las_decyzji", ton: "calm" });
  }, []);

  /**
   * Chowa dymek, ale NIE ucisza Wizkora — ta sama zasada, co w oknie postaci:
   * lektor kończy zdanie (`hub/mowaPostaci.js`). Dymek znika po jedenastu
   * sekundach albo po dotknięciu; zdanie bywa dłuższe niż cierpliwość palca,
   * a urwane w połowie brzmi jak usterka, nie jak koniec rozmowy.
   */
  /** Faktyczne zdjęcie z ekranu — dopiero PO zawinięciu. */
  const zwin = useCallback(() => {
    onWidoczna?.(false);
    window.clearTimeout(timerChmurki.current);
    window.clearTimeout(timerUkrycia.current);
    window.clearTimeout(timerLitery.current);
    window.clearTimeout(timerZejscia.current);
    znikaRef.current = false;
    wymuszone.current = false;
    setZnika(false);
    setChmurka(false);
    setPisane("");
    setPorada(null);
  }, []);

  const schowaj = useCallback(() => {
    /* Drugie dotknięcie w trakcie zawijania nie restartuje animacji — palec
       sześciolatka rzadko trafia raz. */
    if (znikaRef.current) return;
    znikaRef.current = true;
    window.clearTimeout(timerChmurki.current);
    window.clearTimeout(timerUkrycia.current);
    window.clearTimeout(timerLitery.current);
    setZnika(true);
    timerZejscia.current = window.setTimeout(zwin, ZEJSCIE);
  }, [zwin, onWidoczna]);

  const pokaz = useCallback((id) => {
    if (!id && licznik.current >= MAX_NA_SESJE) return;
    const wybrana = id
      ? (DANE.porady || []).find((p) => p.id === id) || wybierzPorade()
      : wybierzPorade();
    if (!wybrana) return;
    window.clearTimeout(timerChmurki.current);
    window.clearTimeout(timerUkrycia.current);
    window.clearTimeout(timerZejscia.current);
    licznik.current += 1;
    onWidoczna?.(true);
    znikaRef.current = false;
    setZnika(false);
    setChmurka(false);
    setPorada(wybrana);
    try { localStorage.setItem(KLUCZ_OSTATNIA, String(Date.now())); } catch {}
    /* Chmurka i głos wchodzą razem, po wjeździe awatara. Jedenaście sekund
       widoczności liczymy OD CHMURKI, nie od wjazdu — inaczej dziecko miałoby
       na przeczytanie zdania o pół sekundy mniej niż zakłada `WIDOCZNA`. */
    timerChmurki.current = window.setTimeout(() => {
      setChmurka(true);
      powtorz(wybrana.tekst);
      /* CZAS NA PRZECZYTANIE LICZY SIĘ OD OSTATNIEJ LITERY, nie od chmurki.
         Zdanie pisze się sekundę czy dwie — gdyby `WIDOCZNA` obejmowało też
         pisanie, dziecko miałoby o tyle mniej czasu na przeczytanie tego,
         co dopiero się pojawiło. */
      const czekaj = WIDOCZNA + (chceSpokoju() ? 0 : czasPisania(odmienDlaGracza(wybrana.tekst)));
      timerUkrycia.current = window.setTimeout(schowaj, czekaj);
    }, ZWLOKA_CHMURKI);
  }, [powtorz, schowaj, onWidoczna]);

  const pokazWymuszone = useCallback((id) => {
    wymuszone.current = true;
    pokaz(id);
  }, [pokaz]);

  const reset = useCallback(() => {
    licznik.current = 0;
    wymuszone.current = false;
    try {
      localStorage.removeItem(KLUCZ_OSTATNIA);
      localStorage.removeItem(KLUCZ_HISTORIA);
    } catch {}
    return "Mysl Wizkora: limit i historia wyzerowane";
  }, []);

  const lista = useCallback(() => (DANE.porady || []).map((p) => p.id), []);

  // Ten sam sterownik dostają hub, pulpit DEV i konsola. Dzięki temu testowa
  // chmurka nie ma osobnej, łatwej do zerwania ścieżki renderowania.
  useImperativeHandle(ref, () => ({
    pokaz: pokazWymuszone,
    schowaj,
    reset,
    lista,
  }), [lista, pokazWymuszone, reset, schowaj]);

  useEffect(() => {
    if (!aktywna && !wymuszone.current) {
      // Panel przykrył hub: chowamy dymek i wstrzymujemy zegar, ale NIE zerujemy
      // licznika — inaczej wchodzenie w zakładki resetowałoby limit na sesję.
      window.clearTimeout(timerPokazu.current);
      schowaj();
      return undefined;
    }
    // Dopóki karta jest widoczna, nie istnieje drugi zegar wejścia. Wcześniej
    // zmiana `porada` uruchamiała efekt ponownie i w tle zaczynało się kolejne
    // odliczanie — przy szybkich zmianach widoków komunikaty potrafiły się
    // przez to składać lub znikać w złym momencie.
    if (porada) return undefined;
    if (licznik.current >= MAX_NA_SESJE) return undefined;

    let ostatnia = 0;
    try { ostatnia = Number(localStorage.getItem(KLUCZ_OSTATNIA)) || 0; } catch {}
    const odOstatniej = Date.now() - ostatnia;
    // Pierwsze wejście w tej sesji liczymy od zera, ale jeśli Wizkor odezwał się
    // niedawno (np. dziecko wróciło do huba po minucie), czekamy do pełnej przerwy.
    const pierwsze = licznik.current === 0;
    const zwloka = pierwsze
      ? Math.max(PIERWSZA, ostatnia ? KOLEJNA - odOstatniej : 0)
      : KOLEJNA;

    timerPokazu.current = window.setTimeout(() => pokaz(), Math.max(1000, zwloka));
    return () => window.clearTimeout(timerPokazu.current);
  }, [aktywna, porada, pokaz, schowaj]);

  // Uchwyt do konsoli: czekanie 75 s przy kazdym sprawdzeniu tekstu jest nie do
  // zniesienia, a limit na sesje sprawia, ze po trzech probach nic juz nie wchodzi.
  //   window.medrzec.pokaz()        - wejscie teraz, z losowa porada
  //   window.medrzec.pokaz('woda')  - konkretna porada po id z JSON-a
  //   window.medrzec.schowaj()      - zdejmij dymek
  //   window.medrzec.reset()        - wyzeruj limit sesji i historie powtorek
  //   window.medrzec.lista()        - id wszystkich porad
  useEffect(() => {
    window.medrzec = {
      pokaz: pokazWymuszone,
      schowaj,
      reset,
      lista,
    };
    return () => { delete window.medrzec; };
  }, [lista, pokazWymuszone, reset, schowaj]);

  // Lokalny podgląd wizualny: `/swiat?medrzec=woda`. Działa wyłącznie w
  // buildzie developerskim, więc nie tworzy ukrytego wejścia w produkcji.
  useEffect(() => {
    if (!import.meta.env.DEV) return undefined;
    let id = null;
    try { id = new URLSearchParams(window.location.search).get("medrzec"); } catch {}
    if (!id) return undefined;
    const start = Date.now();
    const pokazGdyWidacSwiat = () => {
      if (window.__chmuryWisza && Date.now() - start < 12000) return;
      window.clearInterval(zegar);
      pokazWymuszone(id);
    };
    const zegar = window.setInterval(pokazGdyWidacSwiat, 250);
    pokazGdyWidacSwiat();
    return () => window.clearInterval(zegar);
  }, [pokazWymuszone]);

  useEffect(() => () => {
    window.clearTimeout(timerPokazu.current);
    window.clearTimeout(timerChmurki.current);
    window.clearTimeout(timerUkrycia.current);
    window.clearTimeout(timerLitery.current);
    window.clearTimeout(timerZejscia.current);
  }, []);

  /* Odmianę robimy RAZ, przed pisaniem. Gdyby `odmienDlaGracza` wołało się
     na każdym kawałku, „{m|ż}" trafiałoby pod nożyce w połowie tokenu. */
  const tekstPelny = porada ? odmienDlaGracza(porada.tekst) : "";

  /* PISANIE RUSZA DOPIERO Z CHMURKĄ. Wcześniej nie ma gdzie pisać — litery
     leciałyby w przezroczysty prostokąt nad ramieniem Wizkora. */
  useEffect(() => {
    window.clearTimeout(timerLitery.current);
    if (!chmurka || !tekstPelny) { setPisane(""); return undefined; }
    if (chceSpokoju()) { setPisane(tekstPelny); return undefined; }

    let i = 0;
    const krok = () => {
      i += 1;
      setPisane(tekstPelny.slice(0, i));
      if (i >= tekstPelny.length) return;
      // Pauza ZA właśnie postawionym znakiem, nie przed następnym.
      timerLitery.current = window.setTimeout(krok, pauzaPo(tekstPelny[i - 1]));
    };
    timerLitery.current = window.setTimeout(krok, 90);
    return () => window.clearTimeout(timerLitery.current);
  }, [chmurka, tekstPelny]);

  if (!porada) return null;

  return (
    <div
      className={`wizkor-mysl${chmurka ? " ma-chmurke" : ""}${znika ? " jest-znikajaca" : ""}`}
      role="status"
      aria-live="polite"
      data-testid="medrzec-podpowiedz"
    >
      {/* KOLEJNOŚĆ W DOM: najpierw chmurka, potem awatar. Chmurka jest wyżej
          na ekranie, a awatar wsuwa się pod jej ogon — siatka układa je
          w tej samej kolejności, w jakiej stoją. */}
      {/* CAŁA CHMURKA ZAMYKA, nie tylko krzyżyk. To ta sama zasada, co
          w dymkach `Reflektor` (`docs/design-system/README.md`, rozdz. 4.B):
          dotknięcie dymku zamyka go. Krzyżyk zostaje jako widoczny znak, że
          da się to odsunąć — ale sześciolatek, który celuje palcem w środek
          chmurki, też ma trafić. Myśl niczego nie uruchamia, więc przypadkowe
          zamknięcie nic nie kosztuje. */}
      <div className="wizkor-mysl-chmurka" onClick={schowaj}>
        <ChmurkaKsztalt wariant="prostokatTekst" ogon="dol-lewo" />
        <div className="wizkor-mysl-tresc">
          {/* Myśl Wizkora z tokenami `{m|ż}` — odmiana przed renderem; głos
              odmienia `powiedzPostacia`, więc oba dostają tę samą formę.

              DWIE KOPIE: przezroczysta trzyma miejsce i jest tym, co czyta
              czytnik ekranu; widoczna dopisuje się litera po literze i ma
              `aria-hidden`, żeby `aria-live` nie ogłaszał zdania po znaku.
              Uzasadnienie w `styles/wizkor-mysl.css`. */}
          <p className="wizkor-mysl-tekst">
            <span className="wizkor-mysl-pelny">{tekstPelny}</span>
            <span
              className={`wizkor-mysl-pisane${pisane.length >= tekstPelny.length ? " gotowe" : ""}`}
              aria-hidden="true"
            >
              {pisane}
            </span>
          </p>
        </div>
        <button
          type="button"
          className="chmurka-x wizkor-mysl-x"
          onClick={schowaj}
          aria-label="Zamknij podpowiedź"
        >
          <span aria-hidden="true">×</span>
        </button>
      </div>

      {/* TA SAMA ODZNAKA, CO AWATAR GRACZA. Wcześniej stała tu płaska głowa
          (`wizhead.svg`) doklejona do karty. Odznaka z obręczą jest w tej grze
          znakiem OSOBY — dziecko zna ją z lewego górnego rogu — więc Wizkor
          w rogu od razu czyta się jako ktoś, kto przyszedł, a nie jako ikonka
          powiadomienia. */}
      <img
        className="wizkor-mysl-awatar"
        src="/wizkor_avatar.png"
        alt=""
        aria-hidden="true"
        draggable="false"
      />
    </div>
  );
});

export default PodpowiedzMedrca;
