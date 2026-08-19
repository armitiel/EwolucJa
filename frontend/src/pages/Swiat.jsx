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
import React, { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Scena3D, { webglDostepny } from "../components/Scena3D.jsx";
import HubDock from "../hub/HubDock.jsx";
import PanelSheet from "../hub/PanelSheet.jsx";
import MessageScroll from "../hub/MessageScroll.jsx";
import PodpowiedzMedrca from "../hub/PodpowiedzMedrca.jsx";
import PopupPostaci from "../hub/PopupPostaci.jsx";
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
import {
  aktualnaMisja,
  MISJE,
  odbierzNagrode as odbierzNagrodeMisji,
  odkryj as odkryjGre,
  skasujMisje,
  stanGry,
  stanMisji,
  ujawnij as ujawnijMisje,
  zaliczWygrana,
  znakiNaMapie,
  ZDARZENIE_ZMIANY as MISJE_ZMIANA,
} from "../hub/misjeGier.js";
import { powitanieCzarodzieja, ZNAK_CZARODZIEJA } from "../hub/kwestieWizkora.js";
import { poziomDomyslny, poziomyGry } from "../hub/poziomyGier.js";
import WyborPoziomu from "../hub/WyborPoziomu.jsx";
import { pozycjaNaEkranie, zastosujZnakiUparcie } from "../hub/znakiMapy.js";
import { lecDoLicznika, podbijKafelek } from "../hub/lotDoLicznika.js";
import { czyDev, czyLokalnie, ustawDev } from "../services/dev.js";
import {
  nastepnaWskazowka,
  oznaczPoznana,
  wskazowkaPoId,
  WSKAZOWKI,
  ZDARZENIE_ZMIANY as WSKAZOWKI_ZMIANA,
} from "../hub/wskazowki.js";
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
const ZNAK_GRY = Object.fromEntries(MISJE.map((m) => [m.znak, m.id]));

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
/**
 * Pulpit testowy. `lazy`, i to nie dla wygody: kod narzędzia ma NIE WCHODZIĆ
 * do paczki, którą pobiera dziecko. Import wykonuje się dopiero wtedy, gdy
 * tryb dev jest naprawdę włączony (`services/dev.js`).
 */
const DevRezyserka = lazy(() => import("../hub/DevRezyserka.jsx"));

/**
 * Reflektor — wskazówka, która gasi świat i podświetla jeden element HUD-u.
 * `lazy`, bo dziecko zobaczy każdą z nich RAZ w życiu: nie ma powodu, żeby
 * ten kod wchodził do paczki wczytywanej przy każdym starcie.
 */
const Reflektor = lazy(() => import("../hub/Reflektor.jsx"));

const GRY_OSADZONE = {
  "pamiec-medrca": lazy(() => import("./MemoryGame.jsx")),
  "sekret-pod-puchem": lazy(() => import("./PiorkaGame.jsx")),
};

/**
 * Zaproszenie do gry, którym lisek odzywa się po wbiegnięciu w znak minigry.
 * Klucz to `id` z katalogu; brak wpisu = zdanie ogólne, więc dopisanie gry
 * do katalogu nigdy nie zostawi pustego okna.
 *
 * Mówi LISEK, a nie narrator: to bohater dziecka znalazł coś na mapie, więc
 * mówi w pierwszej osobie. `wyroznienie` musi być dosłownym fragmentem
 * `tekst` — inaczej podkreślenie po prostu nie wejdzie.
 *
 * Zdanie ZAPOWIADA kafelki pod spodem, zamiast pytać „zagramy?". To okno jest
 * teraz ekranem startowym gry: pokazuje, ile można wygrać, pozwala wybrać
 * poziom i startuje partię. Pytanie „zagramy?", po którym gra i tak pytała
 * o to samo jeszcze raz na własnym ekranie, było jednym oknem za dużo.
 *
 * Kiedy to okno wchodzi.
 *
 * Znak nie znika od razu: moduł sceny gra na nim wchłanianie — obiekt unosi
 * się, powiększa i gaśnie przez 0,95 s (stała `Hx` w bundlu). Okno wchodzące
 * natychmiast przykrywało tę animację w połowie, więc dziecko słyszało brzdęk,
 * ale nie widziało, co się właściwie stało z kartą.
 *
 * Ale czekanie na SAM koniec, a potem jeszcze chwilę, było już dłużyzną. Okno
 * rusza więc tuż PRZED końcem znikania: karta jest wtedy już prawie
 * przezroczysta, a jej ostatnie iskry gasną pod wjeżdżającym oknem. Dwa ruchy
 * zazębiają się o te 160 ms i czyta się to jak jedno zdarzenie, a nie jak
 * animacja, pauza i dopiero okno.
 */
const WCHLANIANIE_MS = 950;
const WYPRZEDZENIE_MS = 160;

const ZAPROSZENIA = {
  "sekret-pod-puchem": {
    tekst: "Znalazłem złote piórko! Tyle monet można wygrać:",
    wyroznienie: "złote piórko",
  },
  "pamiec-medrca": {
    tekst: "Znalazłem kartę Mędrca! Wybierz, jak trudno gramy:",
    wyroznienie: "kartę Mędrca",
  },
};

function zaproszenieDoGry(id) {
  const zKatalogu = (KATALOG_GIER.gry || []).find((g) => g.id === id);
  const tytul = zKatalogu?.tytul || "tę grę";
  return (
    ZAPROSZENIA[id] || { tekst: `Zagramy w ${tytul}?`, wyroznienie: tytul }
  );
}

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
  const { gra, poziom: poziomGry, otworzGre, zamknijGre } = useHubGra();
  const { player } = useAppData();
  useHudSkin();

  const scenaRef = useRef(null);
  /**
   * Kafelek gwiazdek w HUD — CEL lecących iskier. Ref, bo mówimy o pozycji
   * elementu na ekranie i o jednorazowym podbiciu; przez stan Reacta nie da
   * się zapytać „gdzie to jest".
   */
  const licznikGwiazdekRef = useRef(null);
  /**
   * Czy rozmowa jest właśnie na ekranie (okno postaci albo zaproszenie).
   *
   * REF, a nie stan: `naZdarzenieSceny` trafia do modułu sceny raz i trzyma
   * domknięcie sprzed zmiany — odczyt zwykłego stanu byłby w nim nieaktualny.
   * Bez tego strażnika kolejne dotknięcie czarodzieja potrafiło otworzyć
   * drugie okno NAD otwartym już oknem i dziecko zamykało dwa po kolei.
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
  //
  // Wcześniej stał przed nim jeszcze jeden krok — okno „Czarodziej patrzy
  // w twoją stronę. Zagadać do niego?". Kosztowało dodatkowe kliknięcie
  // i nic za nie nie dawało: dziecko, które WBIEGŁO w czarodzieja, już
  // podjęło tę decyzję nogami. Do tego pytanie i odpowiedź wyglądały
  // niemal tak samo (ta sama karta, ta sama postać), więc drugie okno
  // czytało się jak zacięcie. Teraz dotknięcie otwiera od razu to, po co
  // się podchodzi — kwestię Wizkora, z jego zielonym przyciskiem.
  const [powitanie, setPowitanie] = useState(null);
  // Zaproszenie do minigry: `null` albo `id` gry z katalogu. Znak na mapie nie
  // wrzuca dziecka prosto w grę — najpierw pyta lisek. Tu pytanie ZOSTAJE,
  // choć u czarodzieja je zdjęliśmy: w znak gry wbiega się także przypadkiem,
  // biegnąc gdzie indziej, a wejście w grę wyrywa z biegu na dłużej niż
  // rozmowa. Do czarodzieja podchodzi się po coś.
  const [zaproszenie, setZaproszenie] = useState(null);
  // Poziom zaznaczony w oknie zaproszenia. Ustawia się razem z samym oknem
  // (na domyślny dla tej gry), więc START działa bez dotykania kafelków.
  const [poziomZaproszenia, setPoziomZaproszenia] = useState(null);
  // Odliczanie od dotknięcia znaku do wejścia okna. REF, nie stan: to tylko
  // uchwyt do sprzątnięcia, a przerysowanie huba w trakcie animacji sceny
  // byłoby dokładnie tym, czego ta pauza ma uniknąć.
  const zegarZaproszeniaRef = useRef(0);
  // Zadanie od czarodzieja. Czytamy je z localStorage przy montowaniu, bo
  // zbieranie ma przeżyć zamknięcie apki.
  const [zadanie, setZadanie] = useState(() => stanZadania());
  /**
   * Tryb testowy. LOKALNIE włączony od razu i przełączany `Ctrl+Shift+D`
   * w obie strony — do sprawdzenia, jak świat wygląda bez narzędzi, i z
   * powrotem, bez przeładowania i bez grzebania w adresie.
   *
   * NA PUBLIKACJI tego skrótu nie ma wcale (patrz `services/dev.js`), więc
   * dziecko nie odkryje pulpitu przypadkowym splotem klawiszy.
   */
  const [dev, setDev] = useState(() => czyDev());

  useEffect(() => {
    if (!czyLokalnie()) return undefined;
    const naKlawisz = (e) => {
      if (!e.ctrlKey || !e.shiftKey || (e.key || "").toLowerCase() !== "d") return;
      e.preventDefault();
      setDev((teraz) => ustawDev(!teraz));
    };
    window.addEventListener("keydown", naKlawisz);
    return () => window.removeEventListener("keydown", naKlawisz);
  }, []);
  // Wskazówka „reflektor": `null` albo definicja z `hub/wskazowki.js`.
  const [wskazowka, setWskazowka] = useState(null);
  /**
   * Czy podpowiedź WSTRZYMUJE świat. Chmurka („dymek") nie: dziecko biega
   * dalej, a ona wisi nad ikoną i schodzi sama. Świat zatrzymuje dopiero tryb
   * mocny („reflektor"), bo tam trzeba coś zdecydować.
   */
  const wskazowkaBlokuje = !!wskazowka && wskazowka.tryb === "reflektor";
  /**
   * Łańcuch misji z grami (karta Mędrca, złote piórko, …). Trzymamy CAŁĄ
   * listę, a nie samą bieżącą misję, bo hub czyta z niej trzy różne rzeczy:
   * kafelek w HUD (pierwsza aktywna), zestaw znaków na mapie (wszystkie
   * ujawnione) i kwestię Wizkora (pierwsza nierozliczona).
   */
  const [misje, setMisje] = useState(() => stanMisji());
  const misjaHud = misje.find((m) => m.aktywna) || null;
  const misjaDoZaplaty = misje.find((m) => m.wygrana && !m.wyplacona) || null;
  /**
   * Ekran nagrody: `null`, "gwiazdki" albo `id` gry, której misja właśnie
   * płaci. Zwykłe `true/false` nie wystarczy od chwili, gdy zadań jest kilka —
   * ekran musi wiedzieć, jaką kwotę wypłacić i co napisać, a pomyłka
   * oznaczałaby monety z jednego zadania wpisane na konto drugiego.
   */
  const [nagroda, setNagroda] = useState(null);
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

  /**
   * KIEDY WCHODZI CHMURKA — i to jest tu najważniejsza decyzja, nie wygląd.
   *
   * 1. NIE W TRAKCIE MISJI. Dziecko z zadaniem ma cel i biegnie do niego;
   *    zaproszenie do zakładki jest wtedy przeszkodą, nawet ładne. Chmurka
   *    wykorzystuje DZIURY w rozgrywce — chodzenie po mapie bez zadania.
   * 2. NIE NA WEJŚCIU. Pierwsze sekundy w świecie to już nowa scena,
   *    sterowanie i czarodziej. Chmurka odzywa się dopiero po chwili biegania
   *    (`poCzasie`), a potem najwyżej kilka razy (`maksNaSesje`).
   * 3. NIE NAD NICZYM. Panel, gra, okno postaci, ekran nagrody — wstrzymują.
   *
   * Zegar liczy CIĄGŁE wolne chodzenie: wejście w misję zeruje go (`wolneOdRef`),
   * bo odliczanie w tle podczas zadania skończyłoby się chmurką wyskakującą
   * w sekundzie, w której dziecko właśnie skończyło misję.
   */
  const rytmWskazowekRef = useRef({});
  const wolneOdRef = useRef(0);
  const misjaWToku = (zadanie.aktywne && !zadanie.spelnione) || !!misjaHud;

  useEffect(() => {
    if (wskazowka) return undefined;
    if (misjaWToku) { wolneOdRef.current = 0; return undefined; }

    const spokoj = odsloniete && !panel && !gra && !powitanie && !zaproszenie && !nagroda;
    // Otwarty panel wstrzymuje pokaz, ale NIE zeruje zegara: zajrzenie na
    // chwilę do profilu nie jest powodem, żeby kazać dziecku czekać od nowa.
    if (!spokoj) return undefined;

    const kandydat = nastepnaWskazowka({ chodzenieOswojone: !pokazPodpowiedz, zadanie, misje });
    if (!kandydat) return undefined;

    const rytm = rytmWskazowekRef.current[kandydat.id] || { pokazy: 0, ostatni: 0 };
    if (rytm.pokazy >= (kandydat.maksNaSesje ?? 3)) return undefined;

    if (!wolneOdRef.current) wolneOdRef.current = Date.now();
    const odKiedy = Math.max(wolneOdRef.current, rytm.ostatni);
    const czekaj = rytm.pokazy === 0 ? (kandydat.poCzasie ?? 75000) : (kandydat.powtorkaCo ?? 210000);
    const zostalo = Math.max(500, odKiedy + czekaj - Date.now());

    const zegar = window.setTimeout(() => {
      rytmWskazowekRef.current[kandydat.id] = { pokazy: rytm.pokazy + 1, ostatni: Date.now() };
      setWskazowka(kandydat);
    }, zostalo);
    return () => window.clearTimeout(zegar);
  }, [
    wskazowka, misjaWToku, odsloniete, panel, gra, powitanie, zaproszenie, nagroda,
    pokazPodpowiedz, zadanie, misje,
  ]);

  /**
   * Zamknięcie chmurki NIE znaczy „już wiem". Upłynął czas, dziecko dotknęło
   * krzyżyka — to tylko tyle, że akurat nie teraz. Wskazówka milknie na zawsze
   * dopiero wtedy, gdy dziecko naprawdę zajrzy we wskazane miejsce (efekt
   * niżej), bo dopiero wtedy spełniła swoje zadanie.
   */
  const zamknijWskazowke = useCallback(() => setWskazowka(null), []);

  // Otwarcie wskazanego panelu — obojętnie czy z chmurki, czy samodzielnie —
  // kończy podpowiedź na dobre.
  useEffect(() => {
    if (!panel) return;
    for (const w of WSKAZOWKI) if (w.panelCelu === panel) oznaczPoznana(w.id);
  }, [panel]);

  // Reset z pulpitu testowego kasuje pamięć wskazówek — hub ma o tym wiedzieć
  // od razu, a nie dopiero po przeładowaniu strony.
  useEffect(() => {
    const naZmiane = () => {
      rytmWskazowekRef.current = {};
      wolneOdRef.current = 0;
      setWskazowka(null);
    };
    window.addEventListener(WSKAZOWKI_ZMIANA, naZmiane);
    return () => window.removeEventListener(WSKAZOWKI_ZMIANA, naZmiane);
  }, []);

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
      setPowitanie({
        ...powitanieCzarodzieja(stanZadania(), aktualnaMisja()),
        ...(nadpisz || {}),
      });
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
      if (panel || gra || powitanie || zaproszenie || nagroda || wskazowkaBlokuje) scena.pauza?.();
      else scena.wznow?.();
    }
  }, [panel, gra, powitanie, zaproszenie, nagroda, wskazowkaBlokuje]);

  useEffect(() => {
    // `||` z lewej strony, a nie przypisanie wprost: gdy odliczanie do
    // zaproszenia już trwa, blokada ma zostać wciśnięta, choć żadne okno
    // jeszcze nie stoi na ekranie.
    rozmowaRef.current =
      !!powitanie || !!zaproszenie || !!nagroda || wskazowkaBlokuje || !!zegarZaproszeniaRef.current;
    if (powitanie || zaproszenie || nagroda || wskazowkaBlokuje) fx.krokiStop();
  }, [powitanie, zaproszenie, nagroda, wskazowkaBlokuje]);

  // Wyjście ze świata w trakcie odliczania: bez tego okno wskoczyłoby na
  // ekranie, którego już nie ma, i React zapłakałby o `setState` po
  // odmontowaniu.
  useEffect(() => () => window.clearTimeout(zegarZaproszeniaRef.current), []);

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
    // NIE nad otwartą grą. Ekran nagrody wchodzi wtedy POD nią (gra jest
    // ostatnia w drzewie), więc dziecko nie zobaczyłoby ani konfetti, ani
    // lecących monet — a `coinsLanded` po cichu wypłaciłby nagrodę i po
    // wyjściu z gry zostałby martwy ekran z odebranym już zadaniem.
    // Misje zaliczają się właśnie w grach, więc ten warunek nie jest teorią.
    if (gra) return;
    if (zadanie.spelnione && !zadanie.wyplacone) { setNagroda("gwiazdki"); return; }
    if (misjaDoZaplaty) setNagroda(misjaDoZaplaty.id);
  }, [odsloniete, nagroda, gra, zadanie.spelnione, zadanie.wyplacone, misjaDoZaplaty?.id]);

  /**
   * Powrót do karty: stan mógł zmienić się gdzie indziej (druga zakładka,
   * konsola, inny ekran gry). Odczytujemy zapis od nowa, żeby licznik monet
   * i gwiazdek nie pokazywał liczb sprzed przełączenia.
   */
  useEffect(() => {
    const odswiez = () => {
      if (document.hidden) return;
      setZadanie(stanZadania());
      setMisje(stanMisji());
      setBonus(bonusMonet());
    };
    document.addEventListener("visibilitychange", odswiez);
    return () => document.removeEventListener("visibilitychange", odswiez);
  }, []);

  /**
   * Misje domykają się W INNYCH komponentach: partię kończy `MemoryGame`
   * albo `PiorkaGame`, rysowane nad hubem. Nasłuch zamiast odpytywania —
   * licznik ma podskoczyć w tej samej chwili, w której padła ostatnia para,
   * a nie dopiero po powrocie do świata.
   */
  useEffect(() => {
    const naZmiane = (e) => setMisje(e?.detail?.misje || stanMisji());
    window.addEventListener(MISJE_ZMIANA, naZmiane);
    return () => window.removeEventListener(MISJE_ZMIANA, naZmiane);
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
      if (nagroda !== "gwiazdki") {
        const { dodane } = odbierzNagrodeMisji(nagroda);
        if (dodane) setBonus(bonusMonet());
        setMisje(stanMisji());
        return;
      }
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
    if (nagroda && nagroda !== "gwiazdki") {
      const { dodane } = odbierzNagrodeMisji(nagroda);
      if (dodane) setBonus(bonusMonet());
      setMisje(stanMisji());
    } else {
      const { stan, dodane } = odbierzNagrode(NAGRODA_MONET);
      if (dodane) setBonus(bonusMonet());
      setZadanie(stan);
    }
    setNagroda(null);
  }, [nagroda]);

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
   * Mapa pod bieżący stan misji: znaki gier jeszcze nieujawnionych po prostu
   * na niej nie stoją. Wołane po „gotowa" sceny i po każdej zmianie misji —
   * `zastosujZnaki` jest idempotentne, więc powtórzenie nic nie kosztuje.
   *
   * WSZYSTKIE znaki bierzemy z definicji misji, a widoczne ze stanu: dopisanie
   * trzeciej gry do `MISJE` wystarczy, żeby jej znak zniknął z mapy do czasu
   * zlecenia — bez jednej linijki tutaj.
   */
  const odswiezZnakiMisji = useCallback(() => {
    const scena = scenaRef.current;
    if (!scena) return false;
    return zastosujZnakiUparcie(scena, MISJE.map((m) => m.znak), znakiNaMapie);
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
      setNagroda("gwiazdki");
      return;
    }
    if (typeof akcja === "string" && akcja.startsWith("zlec:")) {
      const id = akcja.slice(5);
      const stan = ujawnijMisje(id);
      setMisje(stanMisji());
      // ZNAK WCHODZI NA MAPĘ OD RAZU. Dziecko wychodzi z rozmowy prosto
      // w las i musi mieć czego szukać — czekanie na kolejne wejście do
      // świata byłoby dla niego po prostu brakiem zadania.
      try { odswiezZnakiMisji(); } catch {}
      rozstanie();
      // Komunikat mówi CO zrobić, a nie „przyjęto zadanie": to jedyne zdanie,
      // które zostaje dziecku na ekranie po zamknięciu okna.
      if (stan) pokazKomunikat(`Znajdź ${stan.def.szukaj} na mapie`);
      return;
    }
    if (typeof akcja === "string" && akcja.startsWith("naplac:")) {
      setPowitanie(null);
      setNagroda(akcja.slice(7));
      return;
    }
    rozstanie();
  }, [powitanie, rozstanie, pokazKomunikat, odswiezZnakiMisji]);

  // Uchwyt do konsoli — czekanie na dziesięć gwiazdek przy każdym sprawdzeniu
  // licznika byłoby nie do zniesienia:
  //   window.zadanieGwiazdek.start() / .dolicz() / .kasuj() / .stan()
  useEffect(() => {
    window.zadanieGwiazdek = {
      start: () => { const s = rozpocznijZadanie(CEL_DOMYSLNY); setZadanie(s); return s; },
      dolicz: () => { const s = doliczGwiazdke(); if (s) setZadanie(s); return s; },
      kasuj: () => { const s = skasujZadanie(); setZadanie(s); setBonus(bonusMonet()); return s; },
      stan: () => ({ ...stanZadania(), bonusMonet: bonusMonet() }),
      nagroda: () => setNagroda("gwiazdki"),
    };
    // Misje z grami mają własny uchwyt — bieganie po mapie w poszukiwaniu
    // karty przy każdej poprawce w kwestii Wizkora byłoby nie do zniesienia:
    //   window.misjeGier.zlec("pamiec-medrca") / .znajdz(id) / .wygraj(id)
    //   window.misjeGier.stan() / .kasuj() / .nagroda(id)
    window.misjeGier = {
      lista: () => MISJE.map((m) => m.id),
      zlec: (id) => {
        const stan = ujawnijMisje(id);
        setMisje(stanMisji());
        try { odswiezZnakiMisji(); } catch {}
        return stan;
      },
      znajdz: (id) => { const stan = odkryjGre(id); setMisje(stanMisji()); return stan; },
      wygraj: (id) => { const stan = zaliczWygrana(id); setMisje(stanMisji()); return stan; },
      kasuj: () => { const stan = skasujMisje(); setMisje(stan); return stan; },
      stan: () => stanMisji().map(({ def, ...reszta }) => reszta),
      nagroda: (id) => setNagroda(id),
    };
    return () => { delete window.zadanieGwiazdek; delete window.misjeGier; };
  }, [odswiezZnakiMisji]);

  /**
   * KATALOG ZDARZEŃ dla pulpitu testowego.
   *
   * Świat odzywa się rzeczami, które przychodzą SAME i rzadko: Wizkor staje
   * na polanie co ~95 s, chmurka po minucie wolnego chodzenia, ekran nagrody
   * po dziesiątej gwiazdce, zaproszenie liska po wbiegnięciu w znak. Każde
   * z nich trzeba dać się obejrzeć NA ŻĄDANIE — inaczej sprawdzenie jednego
   * przecinka w kwestii czarodzieja kosztuje kwadrans biegania po mapie.
   *
   * Lista mieszka TUTAJ, a nie w pulpicie: to hub wie, co potrafi się w nim
   * wydarzyć. Pulpit dostaje gotowe pozycje i tylko rysuje przyciski, więc
   * dołożenie nowego okna nie wymaga zmiany w dwóch plikach.
   *
   * Kwestie Wizkora odpalamy na PODSTAWIONYCH stanach, nie na prawdziwych —
   * dzięki temu da się obejrzeć „nagrodę za gwiazdki", nie zbierając ich,
   * i nic przy tym nie zapisuje się do postępu dziecka.
   */
  const zdarzeniaDev = useMemo(() => {
    if (!dev) return [];

    const gwiazdkiStan = (nadpisz) => ({
      istnieje: true, aktywne: true, cel: CEL_DOMYSLNY, zebrane: 0,
      spelnione: false, wyplacone: false, ...nadpisz,
    });
    const misjaStan = (def, nadpisz) => ({
      id: def.id, def, ujawniona: true, znaleziona: false, wygrana: false,
      wyplacona: false, aktywna: true, naMapie: true, wZakladce: false, ...nadpisz,
    });
    const okno = (z, misja) => setPowitanie(powitanieCzarodzieja(z, misja));

    const pozycje = [
      {
        grupa: "Okno Wizkora",
        etykieta: "Stan bieżący",
        odpal: () => okno(stanZadania(), aktualnaMisja()),
      },
      {
        grupa: "Okno Wizkora",
        etykieta: "Gwiazdki: zlecenie",
        odpal: () => okno(gwiazdkiStan({ istnieje: false, aktywne: false }), null),
      },
      {
        grupa: "Okno Wizkora",
        etykieta: "Gwiazdki: w trakcie",
        odpal: () => okno(gwiazdkiStan({ zebrane: 4 }), null),
      },
      {
        grupa: "Okno Wizkora",
        etykieta: "Gwiazdki: nagroda",
        odpal: () => okno(gwiazdkiStan({ zebrane: CEL_DOMYSLNY, spelnione: true }), null),
      },
      {
        grupa: "Okno Wizkora",
        etykieta: "Łańcuch skończony",
        odpal: () => okno(gwiazdkiStan({ spelnione: true, wyplacone: true, aktywne: false }), null),
      },
    ];

    // Cztery kwestie na każdą misję — tyle, ile ma etapów.
    const poGwiazdkach = gwiazdkiStan({ spelnione: true, wyplacone: true, aktywne: false });
    for (const def of MISJE) {
      const krotki = def.tytul.split(" ")[0];
      pozycje.push(
        { grupa: "Okno Wizkora", etykieta: `${krotki}: zlecenie`,
          odpal: () => okno(poGwiazdkach, misjaStan(def, { ujawniona: false })) },
        { grupa: "Okno Wizkora", etykieta: `${krotki}: szukanie`,
          odpal: () => okno(poGwiazdkach, misjaStan(def)) },
        { grupa: "Okno Wizkora", etykieta: `${krotki}: gra`,
          odpal: () => okno(poGwiazdkach, misjaStan(def, { znaleziona: true })) },
        { grupa: "Okno Wizkora", etykieta: `${krotki}: wypłata`,
          odpal: () => okno(poGwiazdkach, misjaStan(def, { znaleziona: true, wygrana: true })) },
      );
    }

    for (const def of MISJE) {
      pozycje.push({
        grupa: "Okna i ekrany",
        etykieta: `Zaproszenie: ${def.tytul}`,
        odpal: () => setZaproszenie(def.id),
      });
    }

    pozycje.push(
      { grupa: "Okna i ekrany", etykieta: "Nagroda: gwiazdki", odpal: () => setNagroda("gwiazdki") },
      ...MISJE.map((def) => ({
        grupa: "Okna i ekrany",
        etykieta: `Nagroda: ${def.tytul}`,
        // Ekran nagrody czyta kwotę i teksty z definicji misji, więc pokaże
        // się poprawnie także wtedy, gdy misja nie jest jeszcze wygrana.
        // Wypłatę i tak blokuje `odbierzNagrode` (nie ma czego rozliczać).
        odpal: () => setNagroda(def.id),
      })),
      {
        grupa: "Okna i ekrany",
        etykieta: "Komunikat (toast)",
        odpal: () => pokazKomunikat("DEV: tak wygląda komunikat"),
      },
      {
        grupa: "Animacje",
        etykieta: "Lot gwiazdki do licznika",
        /**
         * Sam LOT, bez dopisywania gwiazdki — licznik ma pokazać podskok,
         * a nie urosnąć. Inaczej sprawdzenie animacji zmieniałoby postęp
         * zadania i po pięciu kliknięciach zadanie byłoby skończone.
         */
        odpal: () => {
          const kafelek = licznikGwiazdekRef.current;
          if (!kafelek) { pokazKomunikat("DEV: licznik gwiazdek jest ukryty"); return; }
          lecDoLicznika({
            start: pozycjaNaEkranie(scenaRef.current, "gwiazda-1"),
            cel: kafelek,
            onDolot: () => podbijKafelek(kafelek),
          });
        },
      },
    );

    return pozycje;
  }, [dev, pokazKomunikat]);

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
        // Znaki gier, których Wizkor jeszcze nie zlecił, schodzą z mapy ZANIM
        // dziecko zdąży cokolwiek zobaczyć — moduł buduje je z `mapa.json`,
        // która nic o misjach nie wie.
        odswiezZnakiMisji();
        setScenaGotowa(true);
        return;
      }
      // `minigra:start` = znak wchłonięty (dotknięty palcem albo wejściem
      // bohatera), `znak:dotkniety` = znak bez wchłaniania. Oba prowadzą do
      // panelu, więc obsługujemy je tą samą ścieżką.
      if (nazwa === "minigra:start" || nazwa === "znak:dotkniety") {
        fx.gentleMagical(0.55);
        // Czarodziej nie jest zbieractwem — po dotknięciu nie znika, tylko
        // mówi. Moduł pilnuje, żeby odezwał się RAZ na podejście (`raz: true`):
        // okno wraca dopiero, gdy lis odbiegnie i wróci.
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
          // To samo w trakcie MISJI Z GRĄ. Przypomnienie mówi dokładnie to,
          // czego brakuje na tym etapie: szukać znaku czy dograć partię.
          const m = z.wyplacone ? aktualnaMisja() : null;
          if (m && m.ujawniona && !m.wygrana) {
            pokazKomunikat(
              m.znaleziona
                ? `Wizkor czeka — zagraj w ${m.def.tytul}`
                : `Wizkor czeka — znajdź ${m.def.szukaj} na mapie`
            );
            return;
          }
          // WPROST do kwestii — bez kroku „zagadać?". Stan czytamy jeszcze
          // raz ze źródła, tuż przed otwarciem: `z` powyżej dotyczy gwiazdek,
          // a misja mogła domknąć się chwilę wcześniej w grze.
          setPowitanie(powitanieCzarodzieja(stanZadania(), aktualnaMisja()));
          return;
        }
        // Gwiazdki liczą się TYLKO, gdy zadanie trwa. Przed rozmową z
        // czarodziejem są zwykłym zbieractwem i nie ma czego pokazywać, więc
        // `dolicz` zwraca wtedy null i nic się nie dzieje.
        if (typeof dane?.znak === "string" && dane.znak.startsWith("gwiazda-")) {
          const po = doliczGwiazdke();
          if (po) {
            /**
             * Licznik NIE skacze od razu — najpierw lecą iskry. Liczba zmienia
             * się dopiero, gdy pierwsza z nich dolatuje do kafelka, więc
             * dziecko widzi jedno zdarzenie („ta gwiazdka poleciała tam
             * i dlatego mam więcej"), a nie dwa naraz w dwóch rogach ekranu.
             *
             * Stan czytamy w chwili dolotu ze ŹRÓDŁA, a nie z domknięcia:
             * przy zbieraniu w biegu potrafią lecieć dwie gwiazdki naraz
             * i druga musi zastać liczbę po pierwszej.
             */
            lecDoLicznika({
              start: pozycjaNaEkranie(scenaRef.current, dane.znak),
              cel: licznikGwiazdekRef.current,
              onDolot: () => {
                const teraz = stanZadania();
                setZadanie(teraz);
                podbijKafelek(licznikGwiazdekRef.current);
                // Komplet — ekran nagrody wchodzi od razu, w miejscu, w którym
                // dziecko właśnie złapało ostatnią gwiazdkę. Czekanie na powrót
                // do czarodzieja rozjeżdżałoby nagrodę z wysiłkiem.
                if (teraz.spelnione) setNagroda("gwiazdki");
              },
            });
          }
        }
        // Znak minigry — piórko albo karty na mapie. NIE wrzucamy dziecka
        // prosto w grę: bieg jest tu osobną przyjemnością i wpadnięcie w znak
        // bywa przypadkowe, więc najpierw pyta lisek, dokładnie tak jak
        // czarodziej pyta o rozmowę. Dopiero „Gramy!" otwiera grę — nad sceną,
        // która tylko pauzuje, więc po wyjściu lis stoi tam, gdzie stał.
        const doGry = ZNAK_GRY[dane?.znak];
        if (doGry) {
          // ZNALEZIONE. Od tej chwili gra siedzi w zakładce minigier na stałe
          // — także wtedy, gdy dziecko odmówi teraz gry albo przerwie partię.
          // Znalezienie jest osobną nagrodą i nie może zależeć od wyniku.
          // Stan podnosi nasłuch `MISJE_ZMIANA` — moduł ogłasza zmianę tylko
          // wtedy, gdy naprawdę zaszła, więc kolejne wbiegnięcia w znaleziony
          // już znak nie przerysowują huba.
          odkryjGre(doGry);
          if (rozmowaRef.current) return;
          // Blokada zapada OD RAZU, choć okno wejdzie dopiero za chwilę:
          // przez te 0,8 s lis biegnie dalej i bez tego zdążyłby wpaść
          // w drugi znak albo na czarodzieja, a wtedy odliczania nałożyłyby
          // się na siebie. Zdejmie ją zamknięcie okna (efekt niżej).
          rozmowaRef.current = true;
          window.clearTimeout(zegarZaproszeniaRef.current);
          zegarZaproszeniaRef.current = window.setTimeout(() => {
            // Zerujemy PRZED `setZaproszenie`, żeby uchwyt znaczył dokładnie
            // „odliczanie trwa" — inaczej blokada zostałaby wciśnięta na stałe
            // po pierwszym zaproszeniu.
            zegarZaproszeniaRef.current = 0;
            setZaproszenie(doGry);
          }, WCHLANIANIE_MS - WYPRZEDZENIE_MS);
          return;
        }

        const doOtwarcia = ZNAK_PANELU[dane?.znak];
        if (doOtwarcia) otworz(doOtwarcia);
        return;
      }
      if (nazwa === "blad") setScenaMartwa(true);
    },
    [otworz, panel, pokazKomunikat, navigate, odswiezZnakiMisji]
  );

  // Uchwyt do konsoli — bieganie po mapie w poszukiwaniu piórka przy każdej
  // poprawce w oknie zaproszenia byłoby nie do zniesienia. Ten sam wzorzec, co
  // `window.popupPostaci` i `window.zadanieGwiazdek`:
  //   window.zaproszenieGry.pokaz("sekret-pod-puchem") / .schowaj()
  useEffect(() => {
    window.zaproszenieGry = {
      pokaz: (id = "sekret-pod-puchem") => setZaproszenie(id),
      schowaj: () => setZaproszenie(null),
    };
    return () => { delete window.zaproszenieGry; };
  }, []);

  /**
   * Każda zmiana misji przekłada się na mapę: zlecenie stawia znak, a stan
   * wczytany z zapisu (inne urządzenie, powrót po tygodniu) domyka resztę.
   * Osobny efekt, a nie wywołanie przy okazji — scena bywa gotowa PÓŹNIEJ niż
   * stan, więc jedno miejsce musi pilnować obu kolejności.
   */
  useEffect(() => {
    if (!scenaGotowa) return;
    odswiezZnakiMisji();
  }, [scenaGotowa, misje, odswiezZnakiMisji]);

  /**
   * Każde nowe zaproszenie zaczyna od poziomu domyślnego — czyli tego
   * łatwiejszego. Bez tego drugie wejście w kartę pamiętałoby wybór sprzed
   * godziny, a dziecko nie ma jak skojarzyć, skąd on się wziął.
   */
  useEffect(() => {
    setPoziomZaproszenia(zaproszenie ? poziomDomyslny(zaproszenie) : null);
  }, [zaproszenie]);

  /**
   * START w oknie liska — okno schodzi, gra wchodzi na jego miejsce i od razu
   * rozdaje karty. Wybrany poziom leci przez adres (`?gra=…&poziom=…`), więc
   * gra pomija swój ekran startowy: dziecko odpowiedziało na jego jedyne
   * pytanie już tutaj.
   */
  const naZaproszenie = useCallback(() => {
    const id = zaproszenie;
    const poziom = poziomZaproszenia;
    setZaproszenie(null);
    if (id) otworzGre(id, { poziom });
  }, [zaproszenie, poziomZaproszenia, otworzGre]);

  /**
   * Zasady „najpierw znajdź na mapie" nie pilnuje już żadna ulotna flaga:
   * gry NIE MA w zakładce, dopóki jej znak nie zostanie znaleziony, więc
   * każda rozegrana partia z definicji przyszła po odkryciu. Warunek siedzi
   * w `zaliczWygrana` (`misjeGier.js`) i przeżywa zamknięcie apki.
   */

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

          <div
            className={`game-hud-resources${zadanie.aktywne || misjaHud ? " ma-zadanie" : ""}`}
          >
            {/* Licznik zadania pojawia się DOPIERO po jego przyjęciu i znika
                razem z nim. Stały licznik „0/10" na ekranie dziecka, które nie
                dostało jeszcze żadnego zadania, byłby wyrzutem sumienia bez
                powodu. Bez paska postępu — przy dziesięciu sztukach sama para
                liczb jest czytelniejsza niż kreska. */}
            {zadanie.aktywne ? (
              <span
                ref={licznikGwiazdekRef}
                className={`game-hud-counter game-hud-counter--gwiazdki${zadanie.spelnione ? " jest-spelnione" : ""}`}
                aria-label={`Gwiazdki dla czarodzieja: ${zadanie.zebrane} z ${zadanie.cel}`}
                data-testid="hub-zadanie-gwiazdki"
              >
                {/* TA SAMA gwiazdka, co leży w trawie i co świeci na ekranie
                    nagrody (`/star.png`). Wcześniej stała tu `iskra.png` —
                    czteroramienny klejnot z listkami, czyli inny przedmiot.
                    Dziecko zbiera gwiazdki, a licznik pokazywał coś innego. */}
                <img src="/star.png" alt="" aria-hidden="true" draggable="false" />
                <strong>{zadanie.zebrane}</strong>
                <em>/{zadanie.cel}</em>
              </span>
            ) : null}

            {/* Licznik misji z grą. Misje idą po kolei, więc na ekranie stoi
                zawsze najwyżej JEDEN kafelek — dwa cele naraz byłyby dla
                sześciolatka listą zadań, a nie przygodą. Wygląd dzieli
                z licznikiem gwiazdek (wspólne selektory w `hud.css`), a ikona
                idzie z definicji misji: rewers karty, złote piórko, cokolwiek
                dojdzie później.

                Kropka zamiast liczby, dopóki znak nie jest znaleziony: „0/1"
                sugerowałoby, że gdzieś się już liczy postęp, a na tym etapie
                nie ma czego liczyć — jest szukanie. */}
            {misjaHud ? (
              <span
                className={`game-hud-counter game-hud-counter--misja${misjaHud.wygrana ? " jest-spelnione" : ""}`}
                aria-label={
                  misjaHud.wygrana
                    ? `${misjaHud.def.tytul}: rozegrane`
                    : misjaHud.znaleziona
                      ? `${misjaHud.def.tytul}: znaleziona, zagraj`
                      : `${misjaHud.def.tytul}: znajdź ${misjaHud.def.szukaj} na mapie`
                }
                data-testid={`hub-misja-${misjaHud.id}`}
              >
                <img
                  className={misjaHud.znaleziona ? undefined : "jest-nieznaleziona"}
                  src={misjaHud.def.ikona}
                  alt=""
                  aria-hidden="true"
                  draggable="false"
                />
                <strong>{misjaHud.wygrana ? "1" : misjaHud.znaleziona ? "0" : "?"}</strong>
                <em>/1</em>
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
        aktywna={!panel && !zwojOtwarty && !powitanie && !zaproszenie && !wskazowka && odsloniete}
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

      {/* Zaproszenie do minigry — i zarazem JEJ EKRAN STARTOWY. To samo okno
          co u czarodzieja (wariant `lis` ma własną geometrię), ale niesie
          jeszcze kafelki „poziom + ile można wygrać" i startuje partię.
          Wcześniej pytało „zagramy?", a gra pytała o to samo jeszcze raz —
          dwa okna na jedną decyzję.

          Drugie wyjście ZOSTAJE: w znak gry wbiega się także przypadkiem,
          a znak i tak wróci na mapę, więc odmowa nic nie kosztuje. */}
      <PopupPostaci
        otwarty={!!zaproszenie}
        wariant="lis"
        imie="Lisek"
        obrazek="/lisPop.webp"
        tekst={zaproszenie ? zaproszenieDoGry(zaproszenie).tekst : ""}
        wyroznienie={zaproszenie ? zaproszenieDoGry(zaproszenie).wyroznienie : ""}
        dodatek={
          zaproszenie ? (
            <WyborPoziomu
              poziomy={poziomyGry(zaproszenie)}
              wybrany={poziomZaproszenia}
              onWybor={setPoziomZaproszenia}
            />
          ) : null
        }
        przycisk="START"
        przyciskDrugi="Nie teraz"
        onAkcja={naZaproszenie}
        onDrugi={() => setZaproszenie(null)}
        onZamknij={() => setZaproszenie(null)}
      />

      {/* Ekran wygranej — ten sam, którym gra świętuje minigry i zatwierdzone
          zadania: konfetti, licznik liczący się do 30 i monety lecące w prawy
          górny róg, dokładnie tam, gdzie stoi kafelek monet. */}
      {nagroda === "gwiazdki" ? (
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

      {/* Nagroda za misję z grą. Wchodzi dopiero po WYJŚCIU z gry — efekt
          pilnujący zaległych nagród nie odpala jej nad otwartą minigrą, żeby
          konfetti nie leciało pod planszą. Teksty stoją przy definicji misji,
          więc trzecia gra nie wymaga tu ani jednej linijki. */}
      {nagroda && nagroda !== "gwiazdki" && stanGry(nagroda) ? (
        <RewardScreen
          eyebrow="✦ ZADANIE WIZKORA"
          title={stanGry(nagroda).def.nagrodaEkran.title}
          subtitle={stanGry(nagroda).def.nagrodaEkran.subtitle}
          coins={stanGry(nagroda).def.nagroda}
          note="Wizkor dotrzymał słowa"
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
          {/* `poziom` z adresu = dziecko wybrało go już w oknie liska, więc
              gra pomija swój ekran startowy i od razu zaczyna partię. */}
          <GraOsadzona osadzona poziom={poziomGry} onWyjscie={zamknijGre} />
        </Suspense>
      ) : null}

      {/* Reflektor: świat gaśnie, światło zostaje na jednym przycisku doku. */}
      {wskazowka ? (
        <Suspense fallback={null}>
          <Reflektor wskazowka={wskazowka} onZamknij={zamknijWskazowke} />
        </Suspense>
      ) : null}

      {/* Pulpit testowy NAD wszystkim, także nad otwartą grą — inaczej
          „wygraj otwartą grę" byłoby przyciskiem, do którego nie da się
          dosięgnąć w jedynym momencie, w którym ma sens. */}
      {dev ? (
        <Suspense fallback={null}>
          <DevRezyserka
            scenaRef={scenaRef}
            onZmiana={() => {
              setZadanie(stanZadania());
              setMisje(stanMisji());
              setBonus(bonusMonet());
              // Znaki gier trzeba przeliczyć RĘCZNIE. Same zmiany zapisu
              // ogłasza `misjeGier`, ale mapa nie słucha zdarzeń — buduje się
              // z `mapa.json` i dostaje listę widocznych znaków dopiero, gdy
              // ktoś ją poda. Bez tej linijki „zleć" z pulpitu zmieniało stan,
              // a znak pojawiał się na mapie dopiero po przeładowaniu.
              try { odswiezZnakiMisji(); } catch {}
              // Skok na inny etap unieważnia okno, które akurat stoi: kwestia
              // Wizkora sprzed skoku dotyczy już nieistniejącego stanu.
              setPowitanie(null);
              setNagroda(null);
            }}
            onOtworzGre={otworzGre}
            onKomunikat={pokazKomunikat}
            zdarzenia={zdarzeniaDev}
            onWylacz={() => setDev(ustawDev(false))}
            onPokazWskazowke={(id) =>
              setWskazowka(wskazowkaPoId(id) || nastepnaWskazowka({ chodzenieOswojone: true }))
            }
          />
        </Suspense>
      ) : null}
    </main>
  );
}
