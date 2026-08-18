/**
 * Swiat — hub 3D, GŁÓWNY ekran dziecka. Scena z `public/scena-3d/` jest tu
 * tłem trwałym, a nie stroną: montuje się raz i żyje, dopóki dziecko nie
 * wyjdzie z huba. Panele jej nie odmontowują — pauzują ją, żeby nie kręciła
 * się (i nie zjadała baterii) pod otwartym arkuszem.
 *
 * HUD jest WSPÓLNY z podglądem `/scena-3d/`: te same klasy (`game-hud-*`)
 * i ten sam arkusz (`useHudSkin`). Podgląd jest miejscem, gdzie HUD się
 * projektuje; aplikacja go tylko wypełnia danymi. Nie dubluj tu stylów —
 * poprawki idą do `public/scena-3d/hud.css`.
 *
 * Bez WebGL-a hub NIE przestaje działać: scena zamienia się w statyczne tło,
 * a wszystkie sekcje zostają dostępne.
 */
import React, { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Scena3D, { webglDostepny } from "../components/Scena3D.jsx";
import HubDock from "../hub/HubDock.jsx";
import PanelSheet from "../hub/PanelSheet.jsx";
import MessageScroll from "../hub/MessageScroll.jsx";
import PodpowiedzMedrca from "../hub/PodpowiedzMedrca.jsx";
import PopupPostaci from "../hub/PopupPostaci.jsx";
import PytanieSpotkania from "../hub/PytanieSpotkania.jsx";
import RewardScreen from "../components/RewardScreen.jsx";
import { bonusMonet, ZDARZENIE_ZMIANY as MONETY_ZMIANA } from "../services/monety.js";
import {
  CEL_DOMYSLNY,
  dolicz as doliczGwiazdke,
  NAGRODA_MONET,
  odbierzNagrode,
  rozpocznijZadanie,
  skasujZadanie,
  stanZadania,
} from "../hub/zadanieGwiazdek.js";
import useHudSkin from "../hub/useHudSkin.js";
import { useHubPanel, useHubGra } from "../hub/useHubPanel.js";
import MinigryPanel from "../hub/panels/MinigryPanel.jsx";
import SplashGry from "../hub/SplashGry.jsx";
import KATALOG_GIER from "../hub/data/minigry.v1.json";
import ProfilPanel from "../hub/panels/ProfilPanel.jsx";
import CzatPanel from "../hub/panels/CzatPanel.jsx";
import PoradaPanel from "../hub/panels/PoradaPanel.jsx";
import { GameIcon } from "../adventure/components/icons.jsx";
import { unreadCount } from "../adventure/engine/notifications.js";
import { useAppData } from "../contexts/AppData.jsx";
import { api, session } from "../services/api.js";
import bgMusic from "../services/bgMusic.js";
import { fx } from "../services/soundFx.js";
import kolejkaStartu from "../services/kolejkaStartu.js";
import { awatarPostaci } from "../utils/postac.js";
import "../adventure/styles/adventure.css";
import "../hub/styles/hub.css";

// Cel monetowy pokazywany paskiem w HUD. Trzymany tutaj, a nie w bazie, bo
// dopóki ekonomia się ustala, to liczba do strojenia, nie ustawienie gracza.
const CEL_MONET = 100;

/**
 * Znaki w scenie ↔ panele huba.
 *
 * PUSTA MAPA JEST CELOWA. Znaki na mapie są teraz zbieractwem: dziecko wbiega
 * w złoty listek, listek znika z wybuchem iskier i po chwili odrasta. Otwarcie
 * panelu w tym momencie przerywałoby bieg — a bieg jest tu całą przyjemnością.
 * Sekcje otwiera się dokiem na dole.
 *
 * Mechanizm zostaje gotowy: wystarczy dopisać `{ id_znaku: "nazwa_panelu" }`,
 * żeby wybrany znak znów coś otwierał. Uwaga na identyfikatory — złote listki
 * mają id `zloto-1`…`zloto-9`, a `lisc` to tylko nazwa pliku GLB (na tej
 * pomyłce już raz straciliśmy wieczór).
 */
const ZNAK_PANELU = {};

/**
 * Znaki w scenie, które ODPALAJĄ MINIGRĘ zamiast otwierać panel huba.
 *
 * `leaf` to identyfikator historyczny — model pod nim to dziś PIÓRKO
 * (`assets/lisc.glb`), nie liść. Nie zmieniam id w scenie, bo siedzi w bundlu
 * i w zapisanych stanach; zmiana nazwy dałaby tylko nowe miejsca do pomyłki.
 */
const ZNAK_GRY = {
  leaf: "sekret-pod-puchem",
  karty: "pamiec-medrca",
};

/**
 * Minigry, które hub potrafi wyświetlić NAD sceną. Klucz to `id` z katalogu
 * `hub/data/minigry.v1.json` — to samo, którego używa `useHubGra` w adresie.
 * Gra spoza tej mapy (na razie żadnej takiej nie ma) poleci po staremu na
 * własny adres `/games/…`.
 *
 * `lazy`, a nie zwykły import — i to nie jest mikro-optymalizacja. Kod gier
 * (plansze, pętla canvas, ekrany nagród) siedział w tej samej paczce co hub,
 * więc dziecko czekało na niego przy KAŻDYM wejściu do świata, nawet jeśli
 * tego dnia nie zagrało w nic. Teraz każda gra to osobny plik, pobierany
 * dopiero przy jej otwarciu.
 */
const GRY_OSADZONE = {
  "pamiec-medrca": lazy(() => import("./MemoryGame.jsx")),
  "sekret-pod-puchem": lazy(() => import("./PiorkaGame.jsx")),
};

/**
 * Ekran przejścia — to, co widać między dotknięciem kafelka a pierwszą klatką
 * gry. Musi wyglądać DOKŁADNIE jak splash, który gra pokaże za chwilę sama:
 * ten sam tytuł, ten sam znaczek, to samo tło. Inaczej dziecko widzi trzy
 * różne ekrany po kolei zamiast jednego wejścia do gry.
 *
 * Wcześniej tego ekranu nie było wcale — przez czas pobierania paczki gry
 * na ekranie stał sam gradient bez jednego napisu, co czyta się jak zawieszona
 * aplikacja, a nie jak ładowanie.
 */
function EkranPrzejscia({ id, onWyjscie }) {
  const pozycja = (KATALOG_GIER.gry || []).find((g) => g.id === id);
  return (
    <main className="gra-root gra-osadzona" data-testid="gra-wczytywanie">
      {/* Krzyżyk stoi tu od pierwszej klatki, w tym samym miejscu co w grze.
          Na wolnym łączu wczytywanie potrafi trwać i bez niego dziecko jest
          na ten czas zamknięte na ekranie, z którego nie ma jak wyjść. */}
      <div className="gra-pasek">
        <button type="button" className="gra-x" onClick={onWyjscie} aria-label="Zamknij" title="Zamknij">
          ×
        </button>
      </div>
      <div className="gra-scroll">
        <SplashGry
          tytul={pozycja?.tytul || "Chwileczkę"}
          podpis="Otwieram grę…"
          emoji={pozycja?.emoji || "✦"}
          gotowe={false}
        />
      </div>
    </main>
  );
}

/**
 * Powitanie postaci. Docelowo odpali je spotkanie w świecie („lisek podszedł
 * do czarodzieja") — ten wyzwalacz przychodzi osobno, razem z postacią na
 * mapie. Do tego czasu treść siedzi tutaj jako jeden obiekt, żeby wyzwalacz
 * miał co podać, a okno dało się obejrzeć:
 *
 *   window.popupPostaci.pokaz()                     — otwórz teraz
 *   window.popupPostaci.pokaz({ imie: "Ktoś" })     — podmień pola
 *   window.popupPostaci.schowaj()
 *   /swiat?popup=1                                  — otwarte od razu po wejściu
 */
/**
 * Czarodziej na mapie: identyfikator znaku w module sceny (`xf` w `scena3d.js`)
 * i pytanie, które pada, zanim otworzy się jego okno.
 *
 * Rytm pojawiania się siedzi PO STRONIE SCENY, nie tutaj: znak ma `cykl: 30`
 * (tyle stoi) i `respawn: 60` (tyle go nie ma), a przy każdym powrocie staje
 * w losowym miejscu z listy `pozycje`. Zegar chodzi w pętli renderowania, więc
 * zatrzymuje się razem z nią — pod otwartym panelem czarodziej nie zniknie.
 */
const ZNAK_CZARODZIEJA = "czarodziej";
const PYTANIE_CZARODZIEJA =
  "Czarodziej zatrzymał się na polanie i patrzy w twoją stronę. Zagadać do niego?";

/**
 * Co czarodziej mówi, zależy od STANU ZADANIA — i to nie jest ozdoba, tylko
 * poprawka błędu. Wcześniej miał jedną kwestię i zlecał zbieranie gwiazdek
 * nawet wtedy, gdy dziecko miało już komplet albo dawno odebrało nagrodę.
 *
 * Liczby w zdaniach biorą się ze stanu, nie z palca: to te same wartości,
 * które liczy kafelek w HUD-zie. Rozjazd między „zbierz 10" a licznikiem
 * do 12 byłby dla dziecka po prostu kłamstwem.
 *
 * `akcja` mówi hubowi, co zrobić po zielonym przycisku:
 *   "start"   → załóż zadanie i zapal licznik
 *   "nagroda" → otwórz ekran wygranej (zaległe rozliczenie)
 *   null      → sam przycisk zamykający, nic się nie dzieje
 */
function powitanieCzarodzieja(z) {
  const baza = { imie: "Wizkor", obrazek: "/wizPop.webp" };

  if (z.wyplacone) {
    return {
      ...baza,
      tekst:
        "Dobrze się spisałeś, mały wędrowcze. Odpocznij chwilę — " +
        "przygotowuję dla ciebie nowe zadanie.",
      wyroznienie: "nowe zadanie",
      przycisk: "Do zobaczenia!",
      akcja: null,
    };
  }

  if (z.spelnione) {
    return {
      ...baza,
      tekst:
        `Masz je wszystkie! ${z.cel} gwiazdek, co do jednej. ` +
        `Należy ci się ${NAGRODA_MONET} monet — bierz.`,
      wyroznienie: `${NAGRODA_MONET} monet`,
      przycisk: "Odbieram nagrodę!",
      akcja: "nagroda",
    };
  }

  // Kwestia „w trakcie" jest dziś nieosiągalna ze świata: w czasie zbierania
  // czarodziej w ogóle nie zagaduje (patrz obsługa dotknięcia — zamiast okna
  // wchodzi krótki komunikat). Zostaje, bo stan istnieje i wróci w chwili,
  // gdy rozmowa w trakcie zadania znów będzie miała co wnosić; na razie
  // dosięga jej tylko `window.popupPostaci.pokaz()`.
  if (z.istnieje) {
    const zostalo = z.cel - z.zebrane;
    return {
      ...baza,
      tekst:
        `Widzę, że szukasz. Masz ${z.zebrane} z ${z.cel} gwiazdek — ` +
        `zostało ${zostalo}. Świecą w trawie, trzeba tylko wbiec.`,
      wyroznienie: `${z.zebrane} z ${z.cel} gwiazdek`,
      przycisk: "Zbieram dalej!",
      akcja: null,
    };
  }

  return {
    ...baza,
    tekst:
      `Witaj, mały wędrowcze! Jestem Wizkor, strażnik Lasu Szeptów. ` +
      `Zbierz dla mnie ${CEL_DOMYSLNY} złotych gwiazdek, a otworzę przed tobą pierwszą bramę.`,
    wyroznienie: `${CEL_DOMYSLNY} złotych gwiazdek`,
    przycisk: "Ruszam po gwiazdki!",
    akcja: "start",
  };
}

// Sam tytuł sekcji, bez nadtytułu. Nadtytuł powtarzał innymi słowami to, co
// mówi już przycisk w doku — dziecko czytało dwie linijki zamiast jednej.
const NAGLOWKI = {
  gry: "Minigry",
  profil: "Twój profil",
  czat: "Czat",
  porada: "Porada dnia",
};

export default function Swiat() {
  const navigate = useNavigate();
  const { panel, otworz, zamknij, przelacz } = useHubPanel();
  const { gra, otworzGre, zamknijGre } = useHubGra();
  const { player } = useAppData();
  useHudSkin();

  const scenaRef = useRef(null);
  /**
   * Czy rozmowa jest właśnie na ekranie (pytanie albo okno postaci).
   *
   * REF, a nie stan: `naZdarzenieSceny` trafia do modułu sceny raz i trzyma
   * domknięcie sprzed zmiany — odczyt zwykłego stanu byłby w nim nieaktualny.
   * Bez tego strażnika kolejne dotknięcie czarodzieja potrafiło otworzyć
   * pytanie NAD otwartym już oknem i dziecko zamykało dwa okna po kolei.
   */
  const rozmowaRef = useRef(false);
  const [scenaMartwa, setScenaMartwa] = useState(() => !webglDostepny());
  // Scena wchodzi przejściem dopiero gdy naprawdę ma co pokazać (zdarzenie
  // „gotowa" z modułu). Do tego czasu widać spokojne tło huba, a nie puste
  // płótno WebGL, które przeskakuje w jasny las.
  const [scenaGotowa, setScenaGotowa] = useState(false);
  // Kurtyna z chmur żyje w `index.html` (musi zakryć też czas ładowania
  // bundla). Pytamy, czy WISI, a nie czy istnieje jej funkcja: od kiedy da się
  // ją postawić na żądanie, `__rozsunChmury` jest zdefiniowane zawsze, więc
  // stare sprawdzenie kazałoby HUD-owi czekać także tam, gdzie żadnej kurtyny
  // nie ma i nikt jej nie rozsunie.
  const [odsloniete, setOdsloniete] = useState(
    () => typeof window === "undefined" || !window.__chmuryWisza
  );
  // Powitanie postaci: `null` = zamknięte, obiekt = treść okna.
  const [powitanie, setPowitanie] = useState(null);
  // Krok przed powitaniem: „zagadać?". `false` = lis biegnie dalej.
  const [pytanie, setPytanie] = useState(false);
  // Zadanie od czarodzieja. Czytamy je z localStorage przy montowaniu, bo
  // zbieranie ma przeżyć zamknięcie apki.
  const [zadanie, setZadanie] = useState(() => stanZadania());
  // Ekran nagrody po skompletowaniu gwiazdek (konfetti + lecące monety).
  const [nagroda, setNagroda] = useState(false);
  // Monety z lokalnych zadań, doliczane do liczby z bazy — patrz `zadanieGwiazdek`.
  const [bonus, setBonus] = useState(() => bonusMonet());
  const [komunikat, setKomunikat] = useState(null);
  const [nieprzeczytane, setNieprzeczytane] = useState(0);
  // Podpowiedź sterowania pokazujemy do pierwszego dotknięcia i nigdy więcej —
  // dziecko, które już wie, jak chodzić, nie potrzebuje przypomnienia co wejście.
  const [pokazPodpowiedz, setPokazPodpowiedz] = useState(() => {
    try { return localStorage.getItem("ewolucja.hub.chodzenie") !== "1"; } catch { return true; }
  });

  // Bezpiecznik: gdyby moduł kiedyś przestał wysyłać „gotowa" (inna wersja
  // sceny, cichy błąd), scena zostałaby przezroczysta na zawsze. Po 6 s
  // pokazujemy ją bez pytania — lepiej jeden przeskok niż czarny ekran.
  useEffect(() => {
    if (scenaGotowa || scenaMartwa) return undefined;
    const t = window.setTimeout(() => setScenaGotowa(true), 6000);
    return () => window.clearTimeout(t);
  }, [scenaGotowa, scenaMartwa]);

  // Świat jest gotowy (albo wiadomo, że nie będzie) → rozsuwamy chmury,
  // a HUD wpuszczamy dopiero po ich zejściu.
  useEffect(() => {
    if (odsloniete || !(scenaGotowa || scenaMartwa)) return undefined;
    const rozsun = window.__rozsunChmury;
    if (typeof rozsun !== "function") { setOdsloniete(true); return undefined; }
    rozsun(() => setOdsloniete(true));
    return undefined;
  }, [scenaGotowa, scenaMartwa, odsloniete]);

  useEffect(() => {
    if (!pokazPodpowiedz) return undefined;
    const schowaj = () => {
      setPokazPodpowiedz(false);
      try { localStorage.setItem("ewolucja.hub.chodzenie", "1"); } catch {}
    };
    window.addEventListener("pointerdown", schowaj, { once: true });
    return () => window.removeEventListener("pointerdown", schowaj);
  }, [pokazPodpowiedz]);

  // Komponent minigry, która ma się teraz rysować nad światem (albo `null`).
  const GraOsadzona = gra ? GRY_OSADZONE[gra] || null : null;

  /**
   * Wejście do gry z kafelka biblioteki. Gry z `GRY_OSADZONE` otwieramy nad
   * hubem; pozostałe (jeszcze żadnej takiej nie ma, ale katalog rośnie)
   * dostają po staremu własny adres.
   */
  const uruchomGre = useCallback(
    (pozycja) => {
      if (GRY_OSADZONE[pozycja.id]) { otworzGre(pozycja.id); return; }
      if (pozycja.trasa) navigate(pozycja.trasa);
    },
    [otworzGre, navigate]
  );

  // Wiadomości mają własną formę (zwój), więc nie wchodzą do arkusza sekcji.
  const zwojOtwarty = panel === "wiadomosci";
  const naglowek = zwojOtwarty ? null : NAGLOWKI[panel] || null;

  /* ── licznik nieprzeczytanych: świat + Mentor ─────────────────────────── */
  const przeliczNieprzeczytane = useCallback(async () => {
    let suma = 0;
    try { suma += unreadCount(); } catch {}
    const pid = session.getPlayer();
    if (pid) {
      try {
        const dane = await api.getAllHints(pid);
        suma += (dane?.hints || []).filter((h) => !h.viewed_at).length;
      } catch {
        // Brak sieci = tylko licznik świata. Skrzynka i tak działa offline.
      }
    }
    setNieprzeczytane(suma);
  }, []);

  useEffect(() => { przeliczNieprzeczytane(); }, [przeliczNieprzeczytane]);
  useEffect(() => { if (!panel) przeliczNieprzeczytane(); }, [panel, przeliczNieprzeczytane]);

  /* ── komunikaty (krótkie, bez modali) ────────────────────────────────── */
  const pokazKomunikat = useCallback((tekst) => {
    setKomunikat(tekst);
    window.clearTimeout(pokazKomunikat._t);
    pokazKomunikat._t = window.setTimeout(() => setKomunikat(null), 2200);
  }, []);
  useEffect(() => () => window.clearTimeout(pokazKomunikat._t), [pokazKomunikat]);

  /* ── powitanie postaci (na razie bez wyzwalacza w świecie) ───────────── */
  // Uchwyt do konsoli i adres `?popup=1` — inaczej okna nie da się obejrzeć,
  // dopóki nie powstanie spotkanie z postacią na mapie.
  useEffect(() => {
    const pokaz = (nadpisz) =>
      setPowitanie({ ...powitanieCzarodzieja(stanZadania()), ...(nadpisz || {}) });
    window.popupPostaci = { pokaz, schowaj: () => setPowitanie(null) };
    try {
      if (new URLSearchParams(window.location.search).get("popup") === "1") pokaz();
    } catch {}
    return () => { delete window.popupPostaci; };
  }, []);

  /* ── scena reaguje na panele ─────────────────────────────────────────── */
  // Powitanie zatrzymuje świat tak samo jak szuflada: postać mówi, a lisek
  // w tle biegłby dalej pod kartą — razem z dźwiękiem kroków.
  useEffect(() => {
    const scena = scenaRef.current;
    if (scena) {
      if (panel || gra || powitanie || pytanie || nagroda) scena.pauza?.();
      else scena.wznow?.();
    }
  }, [panel, gra, powitanie, pytanie, nagroda]);

  useEffect(() => {
    rozmowaRef.current = !!powitanie || pytanie || nagroda;
    if (powitanie || pytanie || nagroda) fx.krokiStop();
  }, [powitanie, pytanie, nagroda]);

  /**
   * PILNOWANIE STANU, a nie tylko reagowanie na przejścia.
   *
   * Nagroda pokazywała się wyłącznie w momencie złapania dziesiątej gwiazdki.
   * Wystarczyło zamknąć apkę sekundę wcześniej (albo mieć zapis z poprzedniej
   * wersji kodu), żeby zadanie zostało na zawsze w stanie „10/10 i nic" —
   * licznik pełny, monet brak, a czarodziej dalej zlecał to samo zbieranie.
   *
   * Dlatego stan sprawdzamy przy KAŻDYM wejściu do świata: jeśli gwiazdki są
   * komplet, a nagroda nieodebrana, ekran wygranej wchodzi sam. Czekamy tylko
   * na rozsunięcie chmur, żeby konfetti nie leciało pod kurtyną.
   */
  useEffect(() => {
    if (!odsloniete || nagroda) return;
    if (zadanie.spelnione && !zadanie.wyplacone) setNagroda(true);
  }, [odsloniete, nagroda, zadanie.spelnione, zadanie.wyplacone]);

  /**
   * Powrót do karty: stan mógł zmienić się gdzie indziej (druga zakładka,
   * konsola, inny ekran gry). Odczytujemy zapis od nowa, żeby licznik monet
   * i gwiazdek nie pokazywał liczb sprzed przełączenia.
   */
  useEffect(() => {
    const odswiez = () => {
      if (document.hidden) return;
      setZadanie(stanZadania());
      setBonus(bonusMonet());
    };
    document.addEventListener("visibilitychange", odswiez);
    return () => document.removeEventListener("visibilitychange", odswiez);
  }, []);

  /**
   * Monety mogą dojść spoza huba — dziś z minigry, jutro z czegokolwiek, co
   * zawoła `dodajMonety`. Nasłuch zamiast odpytywania: licznik podnosi się
   * w tej samej chwili, w której nagroda została przyznana, nawet jeśli hub
   * akurat wisi pod otwartym panelem.
   */
  useEffect(() => {
    const naZmiane = () => setBonus(bonusMonet());
    window.addEventListener(MONETY_ZMIANA, naZmiane);
    return () => window.removeEventListener(MONETY_ZMIANA, naZmiane);
  }, []);

  /**
   * Dźwięk nagrody ściągamy przy PRZEDOSTATNIEJ gwiazdce, nie przy pierwszej.
   * `soundFx` nie pobiera już nic z góry, a `dopamine` (70 KB) gra wyłącznie
   * na ekranie wygranej — dla dziecka, które zadania nie skończy, byłby
   * czystym marnotrawstwem pasma. Jedna gwiazdka zapasu w zupełności starcza,
   * żeby plik zdążył.
   */
  useEffect(() => {
    if (!zadanie.aktywne || zadanie.zebrane < zadanie.cel - 1) return;
    try { fx.przygotuj("dopamine"); } catch {}
  }, [zadanie.aktywne, zadanie.zebrane, zadanie.cel]);

  /**
   * Monety z ekranu nagrody dopisujemy DOKŁADNIE wtedy, gdy tam dolatują.
   * `RewardScreen` po animacji licznika wypuszcza monety w stronę prawego
   * górnego rogu i na koniec lotu wysyła `ewolucja:coinsLanded` — kafelek
   * w HUD-zie ma podskoczyć w tej sekundzie, a nie po zamknięciu ekranu.
   * Samo dopisanie jest idempotentne, więc powtórka zdarzenia nic nie psuje.
   */
  useEffect(() => {
    if (!nagroda) return undefined;
    const naLadowanie = () => {
      const { stan, dodane } = odbierzNagrode(NAGRODA_MONET);
      if (dodane) setBonus(bonusMonet());
      setZadanie(stan);
    };
    window.addEventListener("ewolucja:coinsLanded", naLadowanie);
    return () => window.removeEventListener("ewolucja:coinsLanded", naLadowanie);
  }, [nagroda]);

  /**
   * Zamknięcie ekranu nagrody. Rozliczenie wołamy jeszcze raz na wypadek,
   * gdyby dziecko zamknęło ekran, zanim monety dolecą — nagroda nie może
   * przepaść przez szybsze kliknięcie.
   */
  const zamknijNagrode = useCallback(() => {
    const { stan, dodane } = odbierzNagrode(NAGRODA_MONET);
    if (dodane) setBonus(bonusMonet());
    setZadanie(stan);
    setNagroda(false);
  }, []);

  /**
   * Po rozmowie czarodziej odchodzi — w iskrach, tą samą animacją, którą
   * znika po swoim czasie. Bez tego stałby dalej obok lisa i przy pierwszym
   * odbiegnięciu i powrocie zapytałby o to samo jeszcze raz; a już
   * odpowiedział. Wróci sam, w innym miejscu, po swojej przerwie.
   */
  const rozstanie = useCallback(() => {
    setPowitanie(null);
    try { scenaRef.current?.schowajZnak?.(ZNAK_CZARODZIEJA); } catch {}
  }, []);

  /**
   * Zielony przycisk w oknie czarodzieja. Co robi, mówi `akcja` z kwestii —
   * bo ta sama postać w czterech stanach zadania proponuje cztery różne
   * rzeczy. Zamknięcie krzyżykiem albo dotknięciem obok NIGDY nie startuje
   * zadania ani nie wypłaca nagrody: to jest „jeszcze nie".
   */
  const naPrzyciskCzarodzieja = useCallback(() => {
    const akcja = powitanie?.akcja;
    if (akcja === "start") {
      setZadanie(rozpocznijZadanie(CEL_DOMYSLNY));
      rozstanie();
      pokazKomunikat(`Zbierz ${CEL_DOMYSLNY} złotych gwiazdek`);
      return;
    }
    if (akcja === "nagroda") {
      // Okno czarodzieja schodzi, ekran wygranej wchodzi na jego miejsce.
      // Rozstania NIE wołamy — czarodziej ma zostać, bo to on właśnie płaci.
      setPowitanie(null);
      setNagroda(true);
      return;
    }
    rozstanie();
  }, [powitanie, rozstanie, pokazKomunikat]);

  // Uchwyt do konsoli — czekanie na dziesięć gwiazdek przy każdym sprawdzeniu
  // licznika byłoby nie do zniesienia:
  //   window.zadanieGwiazdek.start() / .dolicz() / .kasuj() / .stan()
  useEffect(() => {
    window.zadanieGwiazdek = {
      start: () => { const s = rozpocznijZadanie(CEL_DOMYSLNY); setZadanie(s); return s; },
      dolicz: () => { const s = doliczGwiazdke(); if (s) setZadanie(s); return s; },
      kasuj: () => { const s = skasujZadanie(); setZadanie(s); setBonus(bonusMonet()); return s; },
      stan: () => ({ ...stanZadania(), bonusMonet: bonusMonet() }),
      nagroda: () => setNagroda(true),
    };
    return () => { delete window.zadanieGwiazdek; };
  }, []);

  const naZdarzenieSceny = useCallback(
    (nazwa, dane) => {
      if (nazwa === "gotowa") {
        // Znaki wracają SAME, po swoim czasie z definicji (3,2 s). Wcześniej
        // wstrzymywaliśmy powrót do zamknięcia panelu (`ustawPowrotZnaku(…, false)`)
        // i to było źródłem szarpania: znak wracał dokładnie w chwili, gdy
        // bohater wciąż na nim stał, więc od razu wchłaniał się znowu.
        // Teraz cykl jest jeden: powiększenie → zanik → chwila przerwy → powrót,
        // a przed natychmiastowym powtórzeniem chroni `armed` w module — znak
        // uzbraja się dopiero, gdy bohater odejdzie dalej niż 1,7 jednostki.
        if (panel) scenaRef.current?.pauza?.();
        setScenaGotowa(true);
        return;
      }
      // `minigra:start` = znak wchłonięty (dotknięty palcem albo wejściem
      // bohatera), `znak:dotkniety` = znak bez wchłaniania. Oba prowadzą do
      // panelu, więc obsługujemy je tą samą ścieżką.
      if (nazwa === "minigra:start" || nazwa === "znak:dotkniety") {
        fx.gentleMagical(0.55);
        // Czarodziej nie jest zbieractwem — po dotknięciu nie znika, tylko
        // pyta. Moduł pilnuje, żeby zapytał RAZ na podejście (`raz: true`):
        // pytanie wraca dopiero, gdy lis odbiegnie i wróci.
        if (dane?.znak === ZNAK_CZARODZIEJA) {
          // Rozmowa już trwa — drugie dotknięcie nie ma czego otwierać.
          if (rozmowaRef.current) return;
          // Stan czytamy ze ŹRÓDŁA, nie ze stanu Reacta: ta funkcja trafia do
          // modułu sceny raz i trzyma domknięcie sprzed zmiany.
          const z = stanZadania();
          // W TRAKCIE ZBIERANIA CZARODZIEJ NIE ZAGADUJE. Zadanie jest już
          // przyjęte, a on nie ma nic nowego do powiedzenia — okno na środku
          // przerywałoby tylko bieg za gwiazdkami. Zostaje krótki komunikat,
          // żeby dziecko wiedziało, że to nie awaria, i od razu widziało,
          // ile mu zostało. Wchodzi najwyżej raz na podejście (`raz` w scenie).
          if (z.istnieje && !z.spelnione) {
            pokazKomunikat(`Wizkor czeka — masz ${z.zebrane} z ${z.cel} gwiazdek`);
            return;
          }
          setPytanie(true);
          return;
        }
        // Gwiazdki liczą się TYLKO, gdy zadanie trwa. Przed rozmową z
        // czarodziejem są zwykłym zbieractwem i nie ma czego pokazywać, więc
        // `dolicz` zwraca wtedy null i nic się nie dzieje.
        if (typeof dane?.znak === "string" && dane.znak.startsWith("gwiazda-")) {
          const po = doliczGwiazdke();
          if (po) {
            setZadanie(po);
            // Komplet — ekran nagrody wchodzi od razu, w miejscu, w którym
            // dziecko właśnie złapało ostatnią gwiazdkę. Czekanie na powrót
            // do czarodzieja rozjeżdżałoby nagrodę z wysiłkiem.
            if (po.spelnione) setNagroda(true);
          }
        }
        // Znak, który prowadzi wprost do minigry — piórko na mapie otwiera
        // „Sekret pod puchem". Gra rysuje się NAD sceną, a nie na własnym
        // adresie: scena tylko pauzuje, więc po zamknięciu lis stoi dokładnie
        // tam, gdzie wbiegł w znak, i nie otwiera się przy tym zakładka
        // z biblioteką, której dziecko wcale nie odwiedziło.
        const doGry = ZNAK_GRY[dane?.znak];
        if (doGry) { otworzGre(doGry); return; }

        const doOtwarcia = ZNAK_PANELU[dane?.znak];
        if (doOtwarcia) otworz(doOtwarcia);
        return;
      }
      if (nazwa === "blad") setScenaMartwa(true);
    },
    [otworz, otworzGre, panel, pokazKomunikat, navigate]
  );

  /* ── doładowanie dźwięków pod kurtyną z chmur ────────────────────────── */
  /**
   * Kolejka rusza w chwili, gdy scena zgłosi „gotowa" — czyli DOKŁADNIE wtedy,
   * gdy modele są już pobrane, a chmury dopiero zaczynają się rozsuwać.
   * To najtańsze okno w całym starcie: pasmo jest wolne, główny wątek prawie
   * bezczynny (rozsuwanie chmur to transformacje CSS na kompozytorze), a
   * dziecko i tak nie może jeszcze grać. Zanim kurtyna zejdzie, kroki
   * (12 KB) i brzdęk połknięcia (70 KB) są na miejscu.
   *
   * Wcześniej te pliki — i jeszcze 385 KB ambientu, którego hub w ogóle nie
   * używa — leciały RÓWNOLEGLE z modelami, bo `soundFx` pobierał wszystko
   * przy imporcie modułu.
   */
  useEffect(() => {
    kolejkaStartu.dodaj("kroki", () => fx.przygotuj("kroki"), { priorytet: 1 });
    kolejkaStartu.dodaj("polkniecie", () => fx.przygotuj("gentleMagical"), { priorytet: 2 });
  }, []);

  useEffect(() => {
    if (scenaGotowa || scenaMartwa) kolejkaStartu.ruszaj();
  }, [scenaGotowa, scenaMartwa]);

  /* ── kroki ───────────────────────────────────────────────────────────── */
  // Moduł sceny nie emituje zdarzenia „stawiam krok", więc odpytujemy go
  // 8 razy na sekundę o stan ruchu.
  //
  // Sterujemy PRĘDKOŚCIĄ, a nie nazwą klipu animacji — i to jest poprawka
  // błędu, nie kosmetyka. Nazwa klipu potrafi zostać na „walk" po zatrzymaniu
  // (klip dobiega swoje, sekwencje w rodzaju „happy" wchodzą po swojemu),
  // więc dźwięk zapętlał się przy stojącej postaci. Prędkość jest liczbą
  // i zeruje się natychmiast — nie da się jej źle zinterpretować.
  useEffect(() => {
    if (!scenaGotowa || scenaMartwa) return undefined;
    // Bieg z HISTEREZĄ i na tych samych progach co animacja w module sceny
    // (`e > 1.46` przy wchodzeniu w bieg, `e > 1.37` przy wychodzeniu).
    // Wcześniej dźwięk miał własny, jeden próg 2,2: między 1,46 a 2,2 lis
    // wizualnie biegł, a brzmiał jakby szedł, a przy drążku trzymanym równo
    // w okolicy progu tempo przeskakiwało kilka razy na sekundę.
    let bieg = false;
    const t = window.setInterval(() => {
      const stan = scenaRef.current?.stan?.();
      const v = stan && !stan.pauza ? stan.predkosc ?? 0 : 0;
      // Próg 0,08 zamiast zera: przy dobieganiu do celu prędkość schodzi
      // asymptotycznie i szczątkowy ruch trzymałby dźwięk w nieskończoność.
      if (v > 0.08) {
        bieg = bieg ? v > 1.37 : v > 1.46;
        fx.krokiGraj({ bieg });
      } else {
        bieg = false;
        fx.krokiStop();
      }
    }, 125);
    return () => { window.clearInterval(t); fx.krokiStop(); };
  }, [scenaGotowa, scenaMartwa]);

  // Panel zasłania świat i pauzuje scenę — kroki muszą ucichnąć razem z nią,
  // inaczej dudnią pod otwartym arkuszem.
  useEffect(() => { if (panel || gra) fx.krokiStop(); }, [panel, gra]);

  // Karta w tle: przeglądarka wstrzymuje pętlę renderowania, ale nie audio —
  // bez tego kroki zostają słyszalne po przełączeniu zakładki.
  useEffect(() => {
    const naZmiane = () => { if (document.hidden) fx.krokiStop(); };
    document.addEventListener("visibilitychange", naZmiane);
    return () => document.removeEventListener("visibilitychange", naZmiane);
  }, []);

  /* ── muzyka krainy ───────────────────────────────────────────────────── */
  // bgMusic ma własny localStorage i bywa przełączany spoza tego ekranu
  // (DevTools, inne widoki), więc stan czytamy przy montowaniu i co sekundę
  // dosynchronizowujemy — inaczej ikona kłamałaby po powrocie do huba.
  const [muzykaGra, setMuzykaGra] = useState(() => bgMusic.isEnabled());
  useEffect(() => {
    const t = window.setInterval(() => {
      const teraz = bgMusic.isEnabled();
      setMuzykaGra((poprzednio) => (poprzednio === teraz ? poprzednio : teraz));
    }, 1000);
    return () => window.clearInterval(t);
  }, []);
  const przelaczMuzyke = useCallback(() => {
    setMuzykaGra(bgMusic.toggle());
  }, []);

  // Baza + lokalny bonus z zadań. Dopóki backend nie ma końcówki „dodaj
  // monety", to jedyny sposób, żeby nagroda była widoczna od razu, a liczba
  // z bazy została nietknięta. Szczegóły w `hub/zadanieGwiazdek.js`.
  const monety = (player?.coins ?? 0) + bonus;
  // Pasek nie przepełnia się powyżej celu — po przekroczeniu 100 zostaje pełny
  // i świeci, zamiast wychodzić poza kafelek.
  const postepMonet = Math.max(0, Math.min(100, (monety / CEL_MONET) * 100));

  return (
    <main className="hub-root" data-testid="hub-swiat">
      {scenaMartwa ? (
        <div className="hub-scena hub-scena-zastepcza">
          <img src="/assets/adventure-v2/harbor-arrival.png" alt="" aria-hidden="true" />
          <div className="hub-scena-info">
            <GameIcon name="compass" size={26} />
            {/* Bez przycisku „Otwórz Mapę Iskier": plaska mapa zostala usunieta,
                a jej adres przekierowuje tutaj — przycisk zawracalby na ten sam
                ekran. Zamiast slepego wyjscia zostaje uczciwa informacja, bo
                HUD, zakladki i zadania dzialaja pod spodem normalnie. */}
            <p>
              Ta przeglądarka nie rysuje sceny 3D — zostaje nieruchomy widok świata.
              Zakładki na dole, zadania i wiadomości działają normalnie.
            </p>
          </div>
        </div>
      ) : (
        <Scena3D
          apiRef={scenaRef}
          onZdarzenie={naZdarzenieSceny}
          onBlad={() => setScenaMartwa(true)}
          className={`hub-scena${scenaGotowa ? " is-ready" : ""}`}
        />
      )}

      {/* `naglowek`, a nie `panel`: zwój wiadomości nie jest szufladą i sam
          przykrywa ekran pergaminem — mocniejszy podkład pod dokiem robiłby
          tam drugie, konkurencyjne tło. */}
      <div
        className={`game-hud${odsloniete ? " jest-widoczny" : ""}${naglowek ? " ma-szuflade" : ""}`}
        data-variant="B"
        aria-label="Interfejs świata"
      >
        <div className="game-hud-top">
          <button
            type="button"
            className="game-hud-profile"
            onClick={() => otworz("profil")}
            aria-label={`Otwórz profil: ${player?.name || "Wędrowiec"}`}
            data-testid="hub-chip-profil"
          >
            <img src={awatarPostaci("/assets/hub-nav/profil-simple.png")} alt="" aria-hidden="true" draggable="false" />
            <span>{player?.name || "Wędrowiec"}</span>
          </button>

          <div className={`game-hud-resources${zadanie.aktywne ? " ma-zadanie" : ""}`}>
            {/* Licznik zadania pojawia się DOPIERO po jego przyjęciu i znika
                razem z nim. Stały licznik „0/10" na ekranie dziecka, które nie
                dostało jeszcze żadnego zadania, byłby wyrzutem sumienia bez
                powodu. Bez paska postępu — przy dziesięciu sztukach sama para
                liczb jest czytelniejsza niż kreska. */}
            {zadanie.aktywne ? (
              <span
                className={`game-hud-counter game-hud-counter--gwiazdki${zadanie.spelnione ? " jest-spelnione" : ""}`}
                aria-label={`Gwiazdki dla czarodzieja: ${zadanie.zebrane} z ${zadanie.cel}`}
                data-testid="hub-zadanie-gwiazdki"
              >
                <img src="/assets/hub-nav/iskra.png" alt="" aria-hidden="true" draggable="false" />
                <strong>{zadanie.zebrane}</strong>
                <em>/{zadanie.cel}</em>
              </span>
            ) : null}

            <span
              className="game-hud-counter game-hud-counter--coins"
              aria-label={`Monety: ${monety} ze ${CEL_MONET}`}
            >
              <img src="/assets/hub-nav/moneta.png" alt="" aria-hidden="true" draggable="false" />
              <strong>{monety}</strong>
              <i
                className={`game-hud-progress${monety <= 0 ? " is-empty" : ""}${postepMonet >= 100 ? " is-full" : ""}`}
                aria-hidden="true"
              >
                <i style={{ width: `${postepMonet}%` }} />
              </i>
            </span>

            <button
              type="button"
              className={`game-hud-music${muzykaGra ? "" : " is-off"}`}
              onClick={przelaczMuzyke}
              aria-pressed={muzykaGra}
              aria-label={muzykaGra ? "Wycisz muzykę krainy" : "Włącz muzykę krainy"}
              title={muzykaGra ? "Wycisz muzykę krainy" : "Włącz muzykę krainy"}
              data-testid="hub-music"
            >
              <img src="/music.png" alt="" aria-hidden="true" draggable="false" />
            </button>
          </div>
        </div>

        <div className="game-hud-bottom">
          {!panel && pokazPodpowiedz && !scenaMartwa ? (
            <span className="hub-hint">Przesuń palcem, by iść w dowolną stronę</span>
          ) : null}
          <HubDock aktywny={panel} onWybor={przelacz} nieprzeczytane={nieprzeczytane} />
        </div>
      </div>

      {/* Mędrzec odzywa się tylko w spokojnym hubie: nie nad panelem, nie nad
          zwojem i nie zanim rozsuną się chmury. */}
      <PodpowiedzMedrca
        aktywna={!panel && !zwojOtwarty && !powitanie && !pytanie && odsloniete}
      />

      {/* Dwa kroki, nie jeden: najpierw „zagadać?", dopiero po „tak" pełne
          okno postaci. Odmowa nie kosztuje nic — czarodziej stoi dalej i lis
          może wrócić, dopóki nie skończy mu się czas na polanie. */}
      <PytanieSpotkania
        otwarte={pytanie}
        tekst={PYTANIE_CZARODZIEJA}
        potwierdz="Zagadaj"
        odrzuc="Nie teraz"
        onTak={() => { setPytanie(false); setPowitanie(powitanieCzarodzieja(stanZadania())); }}
        onNie={() => setPytanie(false)}
      />

      {/* Głos czarodzieja: kraina „las decyzji" mapuje się w backendzie na
          barwę `mystical`, a ton `mystery` zwalnia tempo i dokłada pauzy —
          brzmi wtedy inaczej niż Mędrzec, który mówi głosem Mentora w tonie
          `calm`. Mowa milknie sama przy wyciszonej grze i przy zamknięciu okna. */}
      <PopupPostaci
        otwarty={!!powitanie}
        imie={powitanie?.imie}
        obrazek={powitanie?.obrazek}
        tekst={powitanie?.tekst || ""}
        wyroznienie={powitanie?.wyroznienie}
        przycisk={powitanie?.przycisk}
        glos="las_decyzji"
        ton="mystery"
        onAkcja={naPrzyciskCzarodzieja}
        onZamknij={rozstanie}
      />

      {/* Ekran wygranej — ten sam, którym gra świętuje minigry i zatwierdzone
          zadania: konfetti, licznik liczący się do 30 i monety lecące w prawy
          górny róg, dokładnie tam, gdzie stoi kafelek monet. */}
      {nagroda ? (
        <RewardScreen
          eyebrow="✦ ZADANIE CZARODZIEJA"
          title="Wszystkie gwiazdki!"
          subtitle={`Zebrałeś ${CEL_DOMYSLNY} złotych gwiazdek dla Wizkora.`}
          coins={NAGRODA_MONET}
          note="Czarodziej dotrzymał słowa"
          ctaLabel="Super! ✦"
          onDismiss={zamknijNagrode}
        />
      ) : null}

      <MessageScroll open={zwojOtwarty} onClose={zamknij} onZmiana={przeliczNieprzeczytane} />

      <PanelSheet
        open={!!naglowek}
        title={naglowek}
        onClose={zamknij}
        testId="hub-sheet"
      >
        {/* `onGra`, a nie `onZamknij` + `navigate`: zakładka ZOSTAJE otwarta pod
            grą. Dzięki temu zamknięcie gry odsłania ją z powrotem, zamiast
            odbudowywać hub od zera — a wynika to z samego adresu
            (`?panel=gry&gra=…` → `?panel=gry`). */}
        {panel === "gry" ? (
          <MinigryPanel onGra={uruchomGre} onZamknij={zamknij} onKomunikat={pokazKomunikat} />
        ) : null}
        {panel === "profil" ? <ProfilPanel /> : null}
        {panel === "czat" ? <CzatPanel /> : null}
        {panel === "porada" ? <PoradaPanel onZamknij={zamknij} /> : null}
      </PanelSheet>

      {komunikat ? (
        <div className="game-hud-toast is-visible" role="status" data-testid="hub-toast">{komunikat}</div>
      ) : null}

      {/* MINIGRA NAD ŚWIATEM — ostatnia w drzewie, żeby przykryła wszystko:
          HUD, dok, arkusz sekcji. Scena pod spodem zostaje zamontowana
          i zapauzowana, więc wyjście z gry nie kosztuje ani jednego pobrania
          modelu, a lis stoi tam, gdzie go zostawiliśmy. */}
      {GraOsadzona ? (
        <Suspense fallback={<EkranPrzejscia id={gra} onWyjscie={zamknijGre} />}>
          <GraOsadzona osadzona onWyjscie={zamknijGre} />
        </Suspense>
      ) : null}
    </main>
  );
}
