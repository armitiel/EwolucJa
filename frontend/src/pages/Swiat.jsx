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
import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  przywrocGwiazdkiNaMape,
  rozpocznijZadanie,
  skasujZadanie,
  stanZadania,
} from "../hub/zadanieGwiazdek.js";
import {
  aktualnaMisja,
  MISJE,
  odbierzNagrode as odbierzNagrodeMisji,
  odbierzNagrodeUlozenia,
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
import {
  skasujZadanie as skasujZadanieWizkora,
  sprawdzMentoraWTle,
  stanZadania as stanZadaniaWizkora,
  ustawStatus as ustawStatusZadaniaWizkora,
  zadanieDlaCechy,
  zlecZadanie as zlecZadanieWizkora,
  ZDARZENIE_ZMIANY as ZDARZENIE_ZADANIA_WIZKORA,
  ZADANIA as ZADANIA_WIZKORA,
} from "../hub/zadanieWizkora.js";
import { poziomDomyslny, poziomyGry } from "../hub/poziomyGier.js";
import {
  aktywneZbieranie,
  biezacePuzzle,
  celPuzzli,
  czyOdblokowana,
  doliczPuzel as doliczKawalekPuzzli,
  PREFIKS_PUZLA,
  rozpocznijZbieranie,
  skasujPuzzle,
  stanPuzzli,
  ZDARZENIE_ZMIANY as PUZZLE_ZMIANA,
} from "../hub/puzzleGier.js";
import WyborPoziomu from "../hub/WyborPoziomu.jsx";
import {
  pokazZnakNaMapie,
  pozycjaNaEkranie,
  schowajZnakZMapy,
  wstrzymajPowrotZnaku,
  znakiGotowe,
  znakiZPrefiksem,
  zastosujZnakiUparcie,
} from "../hub/znakiMapy.js";
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
import { GRY_W_HUBIE, useHubPanel, useHubGra } from "../hub/useHubPanel.js";
import MinigryPanel from "../hub/panels/MinigryPanel.jsx";
import SplashGry from "../hub/SplashGry.jsx";
import KATALOG_GIER from "../hub/data/minigry.v1.json";
import ProfilPanel from "../hub/panels/ProfilPanel.jsx";
import CzatPanel from "../hub/panels/CzatPanel.jsx";
import PoradaPanel from "../hub/panels/PoradaPanel.jsx";
import ZadaniePanel from "../hub/panels/ZadaniePanel.jsx";
import { GameIcon } from "../adventure/components/icons.jsx";
import { unreadCount } from "../adventure/engine/notifications.js";
import {
  kasujNowosci,
  nowychPorad,
  nowychWCzacie,
  saNoweMinigry,
  ZDARZENIE_ZMIANY as NOWOSCI_ZMIANA,
} from "../hub/nowosci.js";
import { nieprzeczytaneZadaniaWizkora } from "../hub/wiadomosci.js";
import { uruchomKroki } from "../hub/krokiBohatera.js";
import { useAppData } from "../contexts/AppData.jsx";
import { api, session } from "../services/api.js";
import bgMusic from "../services/bgMusic.js";
import { fx } from "../services/soundFx.js";
import kolejkaStartu from "../services/kolejkaStartu.js";
import { awatarPostaci } from "../utils/postac.js";
import "../adventure/styles/adventure.css";
import "../hub/styles/hub.css";
import { leniwy } from "../services/leniwyImport.js";

// Cel monetowy pokazywany paskiem w HUD. Trzymany tutaj, a nie w bazie, bo
// dopóki ekonomia się ustala, to liczba do strojenia, nie ustawienie gracza.
const CEL_MONET = 100;

// Ile komunikat zostaje na mapie. 2,2 s wystarczało na „DEV: ...", ale zlecenie
// zadania łamie się na dwie linijki — dziecko w wieku 6-12 lat nie zdąży go
// przeczytać, zanim zniknie. Stąd pięć sekund.
const CZAS_KOMUNIKATU = 5000;

// Ikona monety w komunikacie zadania. Ten sam plik co kafelek monet w HUD —
// dziecko widzi w zleceniu dokładnie to, co potem rośnie mu na liczniku.
const IKONA_MONETY = "/assets/hub-nav/moneta.png";

// Po tym przedrostku poznajemy gwiazdki wśród znaków sceny. Ich LISTY nigdzie
// nie trzymamy — bierzemy ją ze sceny, więc dopisanie gwiazdki do `mapa.json`
// wystarczy, żeby weszła do zadania.
const PREFIKS_GWIAZDKI = "gwiazda-";

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
const ZNAK_PANELU = {
  /* Próg chatki. Jedyny znak na mapie, który nie jest znaleziskiem ani misją,
     tylko DRZWIAMI: nie znika po dotknięciu i można przez niego przechodzić
     tyle razy, ile się chce. Mechanizm był tu od dawna gotowy i pusty. */
  "drzwi-domu": "dom",
};

/**
 * Znaki w scenie, które ODPALAJĄ MINIGRĘ zamiast otwierać panel huba.
 */
const ZNAK_GRY = Object.fromEntries(MISJE.map((m) => [m.znak, m.id]));

/**
 * Stan `nagroda` niesie TRZY rodzaje ekranu wygranej: "gwiazdki", `id` misji
 * (wypłata za rozegraną partię) i `ulozenie:<id>` (wypłata za ułożenie
 * obrazka). Prefiks zamiast osobnego stanu, bo te ekrany nigdy nie stoją
 * obok siebie — zawsze jest ich na ekranie dokładnie zero albo jeden,
 * a drugi stan znaczyłby tylko tyle, że da się je pokazać naraz.
 */
const PREFIKS_ULOZENIE = "ulozenie:";
const idZUlozenia = (wartosc) =>
  (typeof wartosc === "string" && wartosc.startsWith(PREFIKS_ULOZENIE)
    ? wartosc.slice(PREFIKS_ULOZENIE.length)
    : null);

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
const DevRezyserka = leniwy(() => import("../hub/DevRezyserka.jsx"));

/**
 * Reflektor — wskazówka, która gasi świat i podświetla jeden element HUD-u.
 * `lazy`, bo dziecko zobaczy każdą z nich RAZ w życiu: nie ma powodu, żeby
 * ten kod wchodził do paczki wczytywanej przy każdym starcie.
 */
const Reflektor = leniwy(() => import("../hub/Reflektor.jsx"));

/**
 * Układanka odblokowująca minigrę (brama z puzzli). `lazy` — wchodzi raz
 * na grę, przy pierwszym podejściu, i nie ma czego robić w paczce startowej.
 */
const PuzzleBrama = leniwy(() => import("../hub/PuzzleBrama.jsx"));
/* Wnętrze chatki jest sceną 3D z własnym kontekstem WebGL — do głównego
   pakietu huba wchodzić nie może, tak samo jak minigry. */
const WnetrzeDomku = leniwy(() => import("./WnetrzeDomku.jsx"));
const KoloFortuny = leniwy(() => import("../hub/KoloFortuny.jsx"));

/* KOŁO PRZEZNACZENIA nie jest osobnym ekranem huba: stoi w panelu zadania
   (`panels/ZadaniePanel.jsx`) jako jego pierwsza odsłona, więc losowanie
   i opis wylosowanego zadania dzieją się w jednym miejscu. Hub tylko
   otwiera ten panel — zielonym przyciskiem Wizkora albo pulpitem dev. */

const GRY_OSADZONE = {
  "pamiec-medrca": leniwy(() => import("./MemoryGame.jsx")),
  "lot-liska": leniwy(() => import("./ChoinkaLaunchGame.jsx")),
  "bieg-liska": leniwy(() => import("./BiegLiskaGame.jsx")),
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
/**
 * Ile czekamy ze wpuszczeniem okna, gdy znak NIE znika po dotknięciu (dziś:
 * sosna Lotu Liska). Nie jest to „czas na błysk" — sosna po wbiegnięciu
 * KOŁYSZE SIĘ, i to kołysanie ma być widoczne, zanim ekran przykryje mapa.
 *
 * 800 ms to nie okrągła liczba z sufitu, tylko moment z animacji: drzewo
 * wychyla się o 8° (0,18 s), wraca na −4° (0,60 s) i o 0,84 s przechodzi
 * przez pion. Okno wchodzi więc po PEŁNYM wahnięciu w jedną i w drugą stronę,
 * a nie w połowie pierwszego. Wcześniej stało tu 280 ms i okno zasłaniało
 * drzewo, zanim zdążyło się odchylić.
 */
const KOLYSANIE_MS = 800;
const WYPRZEDZENIE_MS = 160;

/**
 * Teksty ŁAMANE RĘCZNIE (`\n` + `pre-line` w CSS), nie przez szerokość okna.
 * Zdanie liska ma dwie części — co znalazł i co z tego wynika — i każda ma
 * stać we własnej linijce. Automatyczne zawijanie cięło w środku frazy
 * („Tyle monet / można wygrać:"), a dziecko, które dopiero składa litery,
 * czyta linijkami: wiersz musi kończyć się tam, gdzie kończy się myśl.
 */
const ZAPROSZENIA = {
  "pamiec-medrca": {
    tekst: "Znalazłem kartę Mędrca!\nWybierz, jak trudno gramy:",
    wyroznienie: "kartę Mędrca",
  },
  "lot-liska": {
    // Od czasu dołożenia poziomu „brama" lot MA wybór trudności, więc
    // zaproszenie znów o niego pyta — jak przy kartach Mędrca.
    tekst: "Wszedłem na sosnę!\nWybierz, jak lecimy:",
    wyroznienie: "na sosnę",
  },
  "bieg-liska": {
    // Od czasu, gdy bieg dostał swój znak na mapie, lisek trzyma w łapach
    // BUCIK — mówi więc o tym, w co dziecko właśnie wbiegło, a nie o trasie.
    // Trasa jest tym, co się zaraz stanie, nie tym, co się znalazło.
    tekst: "Znalazłem bucik do biegania!\nWybierz, jak trudno gramy:",
    wyroznienie: "bucik do biegania",
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
/* Identyfikator sekcji został `wiadomosci` — siedzi w zapisach obejrzanych
   (`nowosci.js`), w adresach `?panel=` i w pulpicie testowym. Zmieniła się
   sama NAZWA na ekranie: zakładka niesie dziś zadanie w realu, a nie pocztę. */
const NAGLOWKI = {
  gry: "Minigry",
  profil: "Twój profil",
  czat: "Rozmowy",
  porada: "Porada dnia",
  zadanie: "Zadanie od Wizkora",
  /* „dom" NIE MA tu wpisu — i to jest cała mechanika przełączenia. Pokój nie
     jest już szufladą wysuwaną nad mapą, tylko pełnoekranową sceną 3D
     (`pages/WnetrzeDomku.jsx`), a `naglowek === null` trzyma `PanelSheet`
     zamkniętym. Reszta obsługi panelu (adres, pauza sceny, systemowy
     „wstecz") działa bez zmiany, bo to dalej ten sam `?panel=dom`. */
  wiadomosci: "Zadania",
};

export default function Swiat() {
  const navigate = useNavigate();
  const { panel, otworz, zamknij, przelacz } = useHubPanel();
  const { gra, poziom: poziomGry, otworzGre, zamknijGre } = useHubGra();
  const { player } = useAppData();
  useHudSkin();

  const scenaRef = useRef(null);
  const medrzecRef = useRef(null);
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
  /**
   * Układanka na ekranie: `null` albo id gry, której puzzle właśnie się
   * układa. Osobno od `zaproszenie` — układanka wchodzi też z biblioteki gier.
   */
  const [ukladanka, setUkladanka] = useState(null);
  // Koło przeznaczenia stoi NAD mapą, nie w szufladzie — patrz akcja `kolo`.
  const [kolo, setKolo] = useState(false);
  /**
   * Etap puzzli do LICZNIKA w HUD: `null` poza etapem, inaczej stan
   * z `puzzleGier` (zebrane/cel/komplet). Trzymany w stanie Reacta, bo
   * zbieranie w biegu zmienia zapis poza Reactem — patrz nasłuch niżej.
   */
  const [puzzleHud, setPuzzleHud] = useState(() => biezacePuzzle());
  /**
   * Poziom wybrany w oknie liska, ZANIM brama z puzzli przejęła wejście —
   * po ułożeniu gra ma ruszyć z tym wyborem, nie z domyślnym. Ref, bo
   * między wyborem a startem stoi cały ekran układanki.
   */
  const poziomPoUkladanceRef = useRef(null);
  /**
   * Brama puzzli dla ścieżek zdefiniowanych WYŻEJ w pliku (kafelek
   * biblioteki). Sama funkcja powstaje niżej — potrzebuje `pokazKomunikat`
   * — więc wcześniejsze ścieżki dostają ją przez ref.
   */
  const bramaRef = useRef(() => false);
  /**
   * UŁOŻENIE OBRAZKA JEST OSOBNĄ WYGRANĄ. Ostatni kawałek wciśnięty na
   * miejsce kończy pierwszą połowę misji — dziecko zbierało kawałki przez
   * kilka minut biegania po polanie i musi to zobaczyć NATYCHMIAST, a nie
   * dopiero po rozegranej partii. Ekran nagrody wchodzi więc dwa razy
   * w jednej misji: raz za ułożenie (`ulozenie:<id>`), raz za grę (`<id>`).
   *
   * Kolejność jest sztywna i po ekranie nagrody wchodzi DOKŁADNIE JEDNA
   * rzecz — dwa okna naraz na ekranie sześciolatka to nie świętowanie, tylko
   * hałas. Stąd dwa uchwyty, każdy na inną drogę:
   *
   *   `graPoNagrodzieRef`          układanka → ekran nagrody → SAMA GRA
   *                                (nowa droga: obrazek wchodzi wprost w grę),
   *   `zaproszeniePoNagrodzieRef`  znak na mapie → ekran nagrody → okno liska
   *                                (zostaje dla gier bez bramy z puzzli
   *                                 i dla zapisów sprzed zmiany).
   */
  const zaproszeniePoNagrodzieRef = useRef(null);
  /**
   * Gra, która ma ruszyć po zamknięciu ekranu nagrody za ułożenie:
   * `{ id, poziom }` albo `null`. Poziom pochodzi z okna liska sprzed bramy
   * (`poziomPoUkladanceRef`) albo z domyślnego dla tej gry.
   */
  const graPoNagrodzieRef = useRef(null);
  /**
   * Znak w trakcie wchłaniania (id gry albo `null`). Trzymany jako STAN, nie
   * ref, bo blokuje efekt pilnujący zaległych nagród — bez tego ekran
   * wygranej wskakiwałby w tej samej klatce, w której karta dopiero zaczyna
   * znikać z trawy, i dziecko nie zobaczyłoby, co właśnie znalazło.
   */
  const [wchlanianie, setWchlanianie] = useState(null);
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
  /* DWIE RÓŻNE RZECZY, celowo rozdzielone:
     `misjaAktywna` — czy jakakolwiek misja trwa. Po tym poznaje się, że dziecko
       ma cel, więc chmurka z podpowiedzią ma milczeć.
     `misjaHud`     — czy pokazać kafelek „0/1" u góry. Misja może go wyłączyć
       (`bezLicznikaHud`), a to nie znaczy, że przestała trwać. */
  const misjaAktywna = misje.find((m) => m.aktywna) || null;
  /* Kafelek misji („zagraj") czeka, aż puzzle będą ułożone — w etapie
     kawałków górę ekranu ma dla siebie ich licznik, a jeden cel naraz
     to cała zasada tego HUD-u. */
  const misjaHud =
    misje.find((m) => m.aktywna && !m.def.bezLicznikaHud && czyOdblokowana(m.id)) || null;
  const misjaDoZaplaty = misje.find((m) => m.wygrana && !m.wyplacona) || null;
  const misjaDoNagrodyUlozenia = misje.find((m) => m.doNagrodyZaUlozenie) || null;
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
  // Plakietki pozostałych sekcji doku. Osobno od `nieprzeczytane`, bo tamto
  // czeka na odpowiedź z sieci (podpowiedzi Mentora), a te trzy liczą się
  // z lokalnego zapisu i mają być na ekranie od razu.
  const [nowosci, setNowosci] = useState(() => ({ gry: false, czat: 0, porada: 0 }));
  /*
   * KRZYŻYK BELKI JAKO „WSTECZ" — wspólny dla wszystkich paneli z krokami.
   *
   * Panel, który ma w środku własny widok (Porady: wybrana karta albo
   * podsumowanie; Zadanie: krok „pokaż Mentorowi"), rejestruje tu funkcję
   * cofnięcia o JEDEN krok. Belka zamienia wtedy „×" na strzałkę. `null`
   * znaczy „jesteśmy na pierwszym ekranie panelu" — wtedy przycisk znów
   * zamyka szufladę do świata.
   *
   * Jedno miejsce dla wszystkich paneli, bo panel wychodzący czyści wpis
   * w swoim sprzątaniu, a React robi to przed efektami panelu wchodzącego.
   */
  const [powrotPanelu, setPowrotPanelu] = useState(null);
  const zarejestrujPowrot = useCallback((akcja) => {
    setPowrotPanelu(() => akcja || null);
  }, []);
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
   *
   * Warunek pyta o OBIE listy naraz — `GRY_OSADZONE` (jest komponent) i
   * `GRY_W_HUBIE` (adres wpuszczony przez `useHubGra`). Wcześniej pytał tylko
   * o pierwszą i przy rozjeździe kafelek umierał w ciszy: hub wybierał drogę
   * „nad sceną", a `otworzGre` odrzucał adres i wychodził bez śladu. Teraz
   * brak wpisu na białej liście degraduje się do własnego adresu gry, czyli
   * do czegoś, co działa.
   */
  const uruchomGre = useCallback(
    (pozycja) => {
      // BRAMA Z PUZZLI: pierwsza partia wymaga zebrania i ułożenia obrazka.
      if (bramaRef.current(pozycja.id, null)) return;
      if (GRY_OSADZONE[pozycja.id] && GRY_W_HUBIE.includes(pozycja.id)) {
        otworzGre(pozycja.id);
        return;
      }
      if (pozycja.trasa) navigate(pozycja.trasa);
    },
    [otworzGre, navigate]
  );

  // Wiadomości mają własną formę (zwój), więc nie wchodzą do arkusza sekcji.
  const zwojOtwarty = panel === "wiadomosci";
  const naglowek = zwojOtwarty ? null : NAGLOWKI[panel] || null;
  /**
   * Szuflada, która SAMA trzyma treść nad dokiem: nic w niej nie przewija się
   * pod ikony, bo pasek pisania jest przyklejony do dołu i przycina strumień.
   * To ta sama decyzja co `wypelnia` na `PanelSheet` (niżej) — stąd ten sam
   * warunek. Dok nie potrzebuje wtedy rozjaśniacza w górę i pasek pisania może
   * podejść blisko ikon, zamiast zostawiać 37 px pustego pergaminu.
   */
  const szufladaPelna = !!naglowek && panel === "czat";

  /* ── licznik nieprzeczytanych: świat + Mentor ─────────────────────────── */
  const przeliczNieprzeczytane = useCallback(async () => {
    let suma = 0;
    try { suma += unreadCount(); } catch {}
    // Zadanie do zrobienia poza ekranem pali „1" na zakładce wiadomości —
    // to jest jedyny sposób, w jaki dziecko dowiaduje się o nim po zamknięciu
    // rozmowy z Wizkorem.
    try { suma += nieprzeczytaneZadaniaWizkora(); } catch {}
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

  /* ── plakietki minigier, czatu i porad ───────────────────────────────── */
  const przeliczNowosci = useCallback(() => {
    setNowosci({
      gry: (() => { try { return saNoweMinigry(); } catch { return false; } })(),
      czat: (() => { try { return nowychWCzacie(); } catch { return 0; } })(),
      porada: (() => { try { return nowychPorad(); } catch { return 0; } })(),
    });
  }, []);

  /**
   * Trzy powody, dla których liczba może się zmienić, i każdy przychodzi
   * z innej strony: panel odznaczył swoje (`NOWOSCI_ZMIANA`), Wizkor zlecił
   * misję i w zakładce przybyła gra (`MISJE_ZMIANA`), albo minęła pora dnia
   * i wjechały nowe porady — tego nikt nie ogłasza, więc pytamy co minutę.
   * Minuta, bo to jedyny licznik, który potrafi odżyć sam z siebie.
   */
  useEffect(() => {
    przeliczNowosci();
    window.addEventListener(NOWOSCI_ZMIANA, przeliczNowosci);
    window.addEventListener(MISJE_ZMIANA, przeliczNowosci);
    const zegar = window.setInterval(przeliczNowosci, 60_000);
    return () => {
      window.removeEventListener(NOWOSCI_ZMIANA, przeliczNowosci);
      window.removeEventListener(MISJE_ZMIANA, przeliczNowosci);
      window.clearInterval(zegar);
    };
  }, [przeliczNowosci]);

  // Zamknięcie zakładki to moment, w którym panel zdążył już odznaczyć swoje.
  useEffect(() => { przeliczNowosci(); }, [panel, przeliczNowosci]);
  useEffect(() => { if (!panel) przeliczNieprzeczytane(); }, [panel, przeliczNieprzeczytane]);
  // Zadanie zmienia stan także spoza panelu (wysyłka, werdykt Mentora,
  // odebranie nagrody) — plakietka ma za tym nadążać bez przeładowania.
  useEffect(() => {
    const odswiez = () => { przeliczNieprzeczytane(); setBonus(bonusMonet()); };
    window.addEventListener(ZDARZENIE_ZADANIA_WIZKORA, odswiez);
    return () => window.removeEventListener(ZDARZENIE_ZADANIA_WIZKORA, odswiez);
  }, [przeliczNieprzeczytane]);

  /**
   * WERDYKT MENTORA SZUKA DZIECKA, NIE ODWROTNIE.
   *
   * Zadanie w realu wraca zatwierdzone raz na dobę, gdy dziecka nie ma przy
   * ekranie. Dopóki werdykt sprawdzał się wyłącznie przy wejściu do panelu,
   * dziecko musiało samo zgadnąć, że jest po co tam zajrzeć — i zwykle nie
   * zgadywało. Świat pyta więc sam: raz przy wejściu i raz przy powrocie do
   * karty. Zatwierdzenie ląduje wtedy w skrzynce jako wieść („Mentor przyjął
   * Twoje zadanie!") i zapala plakietkę na zakładce „Zadania".
   *
   * Dławik siedzi w `sprawdzMentoraWTle` (jedno zapytanie na 10 minut, tylko
   * gdy naprawdę czekamy), więc przeskakiwanie między kartami nie zamienia
   * tego w polling. `ZDARZENIE_ZADANIA_WIZKORA` wyżej dolicza plakietkę —
   * tu nie trzeba niczego przeliczać ręcznie.
   *
   * ZEGAR CO POŁ MINUTY nie jest pollingiem serwera: w wersji demo werdykt
   * przychodzi LOKALNIE (`DEMO_SAM_ZATWIERDZA` w `zadanieWizkora.js`) i bez
   * tykania dziecko zobaczyłoby go dopiero po przełączeniu karty — czyli
   * zwykle wcale. Gdy nie ma na co czekać, `sprawdzMentoraWTle` wychodzi
   * pierwszą linijką, a zapytania do sieci i tak pilnuje dławik.
   */
  useEffect(() => {
    const zapytaj = () => { sprawdzMentoraWTle().catch(() => {}); };
    zapytaj();
    const naWidocznosc = () => { if (!document.hidden) zapytaj(); };
    document.addEventListener("visibilitychange", naWidocznosc);
    window.addEventListener("focus", zapytaj);
    const zegar = window.setInterval(zapytaj, 30_000);
    return () => {
      document.removeEventListener("visibilitychange", naWidocznosc);
      window.removeEventListener("focus", zapytaj);
      window.clearInterval(zegar);
    };
  }, []);

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
  const misjaWToku = (zadanie.aktywne && !zadanie.spelnione) || !!misjaAktywna;

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
  /**
   * `opcje.ikona` wstawia obrazek W MIEJSCE słowa, a nie obok niego — zlecenie
   * brzmi „Zbierz 10 [moneta]". Dlatego `opcje.opis` jest wtedy OBOWIĄZKOWY:
   * czytnik ekranu nie widzi obrazka, a samo „Zbierz 10" nie jest zdaniem.
   */
  const pokazKomunikat = useCallback((tekst, opcje) => {
    setKomunikat({ tekst, ikona: opcje?.ikona || null, opis: opcje?.opis || tekst });
    window.clearTimeout(pokazKomunikat._t);
    pokazKomunikat._t = window.setTimeout(() => setKomunikat(null), CZAS_KOMUNIKATU);
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

  /* ── kroki bohatera ──────────────────────────────────────────────────── */
  /* Pętla czyta fazę odtwarzanej animacji chodu i syntezuje tupnięcie w chwili
     kontaktu stopy z ziemią. Startuje raz, na całe życie sceny: sama zauważy,
     że scena jeszcze się montuje albo że stoi na pauzie. */
  useEffect(() => uruchomKroki(() => scenaRef.current), []);

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
      !!powitanie || !!zaproszenie || !!nagroda || wskazowkaBlokuje
      || !!zegarZaproszeniaRef.current || !!zaproszeniePoNagrodzieRef.current
      || !!graPoNagrodzieRef.current;
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
    // Znak dopiero znika z trawy — nagroda poczeka te 0,8 s, żeby dziecko
    // zobaczyło, CO znalazło, zanim przykryje to ekran wygranej.
    if (wchlanianie) return;
    if (zadanie.spelnione && !zadanie.wyplacone) { setNagroda("gwiazdki"); return; }
    // Ułożenie idzie PRZED wypłatą za partię: to wcześniejszy krok misji,
    // a przy zapisie sprzed tej zmiany (gra zdobyta, nagrody nigdy nie
    // było) i tak trzeba je domknąć najpierw.
    if (misjaDoNagrodyUlozenia) { setNagroda(`${PREFIKS_ULOZENIE}${misjaDoNagrodyUlozenia.id}`); return; }
    if (misjaDoZaplaty) setNagroda(misjaDoZaplaty.id);
  }, [
    odsloniete, nagroda, gra, wchlanianie,
    zadanie.spelnione, zadanie.wyplacone,
    misjaDoNagrodyUlozenia?.id, misjaDoZaplaty?.id,
  ]);

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
   * albo `BiegLiskaGame`, rysowane nad hubem. Nasłuch zamiast odpytywania —
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
      const zaUlozenie = idZUlozenia(nagroda);
      if (zaUlozenie) {
        const { dodane } = odbierzNagrodeUlozenia(zaUlozenie);
        if (dodane) setBonus(bonusMonet());
        setMisje(stanMisji());
        return;
      }
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
    const zaUlozenie = idZUlozenia(nagroda);
    if (zaUlozenie) {
      const { dodane } = odbierzNagrodeUlozenia(zaUlozenie);
      if (dodane) setBonus(bonusMonet());
      setMisje(stanMisji());
    } else if (nagroda && nagroda !== "gwiazdki") {
      const { dodane } = odbierzNagrodeMisji(nagroda);
      if (dodane) setBonus(bonusMonet());
      setMisje(stanMisji());
    } else {
      const { stan, dodane } = odbierzNagrode(NAGRODA_MONET);
      if (dodane) setBonus(bonusMonet());
      setZadanie(stan);
    }
    setNagroda(null);
    /* PROSTO W GRĘ. Ekran nagrody za ułożenie jest ostatnią rzeczą między
       obrazkiem a partią: dziecko kliknęło już „Gramy!" (albo kafelek gry)
       przed bramą z puzzli, więc pytanie o to samo drugi raz byłoby oknem
       za dużo. Uchwyt zerujemy od razu — startuje dokładnie jedna gra. */
    const doGry = graPoNagrodzieRef.current;
    if (doGry) {
      graPoNagrodzieRef.current = null;
      otworzGre(doGry.id, { poziom: doGry.poziom });
      return;
    }
    // Lisek czekał z zaproszeniem, żeby nie mówić przez ekran wygranej.
    // Teraz jest jego kolej — i tylko jego, bo uchwyt zerujemy od razu.
    const dalej = zaproszeniePoNagrodzieRef.current;
    if (dalej) {
      zaproszeniePoNagrodzieRef.current = null;
      setZaproszenie(dalej);
    }
  }, [nagroda, otworzGre]);

  /**
   * Koniec rozmowy = zamknięcie okna. I tyle.
   *
   * Wcześniej Wizkor po każdej rozmowie ZNIKAŁ w iskrach i wracał po swojej
   * przerwie w innym z pięciu miejsc (`pozycje` + `cykl`/`respawn`
   * w `mapa.json`). Dziecko uczyło się wtedy nie drogi do niego, tylko
   * czekania — a wracając na polanę nie wiedziało, czy go w ogóle zastanie.
   * Teraz stoi w jednym miejscu na stałe i jest punktem orientacyjnym mapy,
   * jak sosna Lotu Liska.
   *
   * Powtórnemu zagadaniu zapobiega sama scena: znak ma `raz: true`, więc
   * odzywa się RAZ na podejście i uzbraja się dopiero, gdy lis odbiegnie
   * dalej niż `zbrojenie` (3,4). Nie potrzeba do tego znikania.
   */
  const rozstanie = useCallback(() => {
    setPowitanie(null);
  }, []);

  /**
   * Mrugnięcie zakładką „Zadania" w doku — kilka sekund, po czym cisza.
   *
   * PO CO. Wizkor mówi „czeka w zakładce Zadania", ale dla dziecka to
   * słowo, a ikonka w doku to obrazek — mrugnięcie skleja jedno z drugim
   * dokładnie w chwili, gdy okno schodzi i dok znów widać. Ograniczone
   * w czasie: skrót, który miga bez końca, to alarm, a tu nic się nie pali.
   */
  const [migaZadania, setMigaZadania] = useState(false);
  const migaZadaniaTimer = useRef(0);
  const mrugnijZadania = useCallback(() => {
    setMigaZadania(true);
    window.clearTimeout(migaZadaniaTimer.current);
    migaZadaniaTimer.current = window.setTimeout(() => setMigaZadania(false), 3600);
  }, []);
  useEffect(() => () => window.clearTimeout(migaZadaniaTimer.current), []);

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
   * Mapa pod bieżący stan ZADANIA GWIAZDEK.
   *
   * ZASADA: gwiazdka raz zabrana nie wraca — ani w trakcie zadania (inaczej
   * najszybciej jest stać przy jednym krzaku i czekać na odrost), ani PO NIM.
   * Rozliczenie nagrody zdejmuje z mapy cały komplet na stałe: pierwsza misja
   * zbierania jest skończona i las nie obiecuje jej drugi raz.
   *
   * Ta funkcja robi TWARDE zgaszenie (`schowajZnakZMapy`), więc wolno ją wołać
   * tylko przy wejściu do świata i przy zmianie stanu zadania — NIE w chwili
   * zbierania, bo ucięłaby animację wchłaniania. Tam wystarczy
   * `wstrzymajPowrotZnaku`.
   *
   * Znaki potrafią dojechać ułamek sekundy po „gotowa" sceny, stąd ponawianie.
   */
  const odswiezGwiazdkiNaMapie = useCallback((proby = 20) => {
    const scena = scenaRef.current;
    if (!scena) return false;
    if (!znakiGotowe(scena)) {
      if (proby > 0) setTimeout(() => odswiezGwiazdkiNaMapie(proby - 1), 200);
      return false;
    }
    const wszystkie = znakiZPrefiksem(scena, PREFIKS_GWIAZDKI);
    if (!wszystkie.length) return false;

    const z = stanZadania();
    /**
     * ZADANIE ROZLICZONE = GWIAZDKI ZNIKAJĄ NA STAŁE (decyzja właściciela,
     * 2026-08-22). Wcześniej po wypłacie wracały „do biegania", ale wtedy
     * las obiecywał zbieranie, za którym nie stoi już żadne zadanie —
     * dziecko zbierało w próżnię. Skończone znaczy skończone: mapa idzie
     * dalej, do misji z grami.
     */
    if (z.wyplacone) {
      for (const znak of wszystkie) schowajZnakZMapy(scena, znak);
      return true;
    }
    // Przed rozmową z Wizkorem gwiazdki STOJĄ na mapie — to zapowiedź
    // zadania; zbieranie i tak liczy się dopiero po zleceniu.
    if (!z.istnieje) {
      for (const znak of wszystkie) pokazZnakNaMapie(scena, znak);
      return true;
    }

    let zabrane = new Set(z.zebraneZnaki || []);
    /**
     * MAPA_PUSTA — bezpiecznik. Gdyby licznik rozjechał się z listą (gwiazdka
     * policzona bez zapisania id, ręczna zmiana zapisu, mniej gwiazdek na
     * mapie niż wynosi cel), dziecko biegałoby po pustym lesie bez szansy na
     * dokończenie. Wtedy oddajemy las: licznik zostaje, gwiazdki wracają.
     */
    if (!z.spelnione && wszystkie.every((znak) => zabrane.has(znak))) {
      console.warn("[gwiazdki] na mapie nie ma czego zbierać, a zadanie trwa — oddaję gwiazdki");
      setZadanie(przywrocGwiazdkiNaMape());
      zabrane = new Set();
    }

    for (const znak of wszystkie) {
      if (zabrane.has(znak)) schowajZnakZMapy(scena, znak);
      else pokazZnakNaMapie(scena, znak);
    }
    return true;
  }, []);

  /**
   * Mapa pod bieżące ZBIERANIE PUZZLI. Kawałki stoją na polanie tylko wtedy,
   * gdy jakaś gra właśnie czeka na komplet — poza polowaniem mapa nie obiecuje
   * zbierania, za którym nic nie stoi (ta sama zasada co przy gwiazdkach).
   * Gra 2×2 używa CZTERECH pierwszych znaków `puzel-*`, gry 3×3 — dziewięciu.
   */
  const odswiezPuzleNaMapie = useCallback((proby = 20) => {
    const scena = scenaRef.current;
    if (!scena) return false;
    if (!znakiGotowe(scena)) {
      if (proby > 0) setTimeout(() => odswiezPuzleNaMapie(proby - 1), 200);
      return false;
    }
    const wszystkie = znakiZPrefiksem(scena, PREFIKS_PUZLA);
    if (!wszystkie.length) return false;
    const zbieranie = aktywneZbieranie();
    if (!zbieranie) {
      for (const znak of wszystkie) schowajZnakZMapy(scena, znak);
      return true;
    }
    // Kolejność po numerze, nie po liście ze sceny — gra 2×2 ma dostawać
    // ZAWSZE te same cztery kawałki, niezależnie od kolejności wczytania.
    const kolejnosc = [...wszystkie].sort(
      (a, b) => (parseInt(a.split("-")[1], 10) || 0) - (parseInt(b.split("-")[1], 10) || 0)
    );
    const zabrane = new Set(zbieranie.zebraneZnaki || []);
    kolejnosc.forEach((znak, i) => {
      if (i < zbieranie.cel && !zabrane.has(znak)) pokazZnakNaMapie(scena, znak);
      else schowajZnakZMapy(scena, znak);
    });
    return true;
  }, []);

  /**
   * BRAMA Z PUZZLI — jedno wejście dla obu ścieżek startu gry (okno liska
   * i kafelek biblioteki). Gra bez ułożonej układanki nie startuje: komplet
   * kawałków otwiera układankę, brak kompletu — zbieranie po mapie.
   * Zwraca `true`, gdy brama przejęła wejście; ułożona brama jest
   * przezroczysta na zawsze (`czyOdblokowana`).
   */
  const bramaPuzzli = useCallback(
    (id, poziom) => {
      if (czyOdblokowana(id)) return false;
      const stan = stanPuzzli(id);
      poziomPoUkladanceRef.current = poziom || null;
      // Arkusz (biblioteka gier) schodzi — i układanka, i zbieranie dzieją
      // się na mapie, nie pod otwartym panelem.
      zamknij();
      if (stan.komplet) {
        setUkladanka(id);
        return true;
      }
      rozpocznijZbieranie(id);
      odswiezPuzleNaMapie();
      // „4 kawałki" / „9 kawałków" — odmiana, nie szablon.
      const ile = stan.cel === 4 ? "4 kawałki" : `${stan.cel} kawałków`;
      pokazKomunikat(`Znajdź ${ile} obrazka`, {
        opis: `Znajdź ${ile} obrazka na mapie`,
      });
      return true;
    },
    [zamknij, odswiezPuzleNaMapie, pokazKomunikat]
  );
  useEffect(() => { bramaRef.current = bramaPuzzli; }, [bramaPuzzli]);

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
      pokazKomunikat(`Zbierz ${CEL_DOMYSLNY}`, {
        ikona: IKONA_MONETY,
        opis: `Zbierz ${CEL_DOMYSLNY} złotych monet`,
      });
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
      try { odswiezZnakiMisji(); } catch {}
      rozstanie();
      /* MISJA ZACZYNA SIĘ OD PUZZLI. Zlecenie rozsypuje kawałki obrazka po
         mapie OD RAZU — dziecko wychodzi z rozmowy prosto w las i musi mieć
         czego szukać. Znak gry wejdzie po ułożeniu układanki i od razu
         z nią samą (`naMapie` w misjeGier pilnuje tego warunku). Ścieżka
         „znajdź znak na mapie" zostaje TYLKO dla misji bez bramy z puzzli —
         dziś nie ma takiej żadnej, ale katalog gier rośnie. */
      if (stan && !czyOdblokowana(id)) {
        rozpocznijZbieranie(id);
        odswiezPuzleNaMapie();
        const cel = stanPuzzli(id).cel;
        const ile = cel === 4 ? "4 kawałki" : `${cel} kawałków`;
        pokazKomunikat(`Znajdź ${ile} obrazka`, { opis: `Znajdź ${ile} obrazka na mapie` });
      } else if (stan) {
        pokazKomunikat(`Znajdź ${stan.def.szukaj} na mapie`);
      }
      return;
    }
    if (typeof akcja === "string" && akcja.startsWith("naplac:")) {
      setPowitanie(null);
      setNagroda(akcja.slice(7));
      return;
    }
    if (typeof akcja === "string" && akcja.startsWith("ukladanka:")) {
      // „Układam!" — okno Wizkora schodzi, na jego miejsce wchodzi układanka.
      setPowitanie(null);
      setUkladanka(akcja.slice(10));
      return;
    }
    if (typeof akcja === "string" && akcja.startsWith("zlecReal:")) {
      zlecZadanieWizkora(akcja.slice(9));
      rozstanie();
      przeliczNieprzeczytane();
      // Komunikat mówi, GDZIE tego szukać. Zadania poza ekranem nie widać
      // na mapie, więc bez tego zdania dziecko wychodzi z rozmowy z niczym.
      pokazKomunikat("Nowe zadanie — zajrzyj do Zadań");
      // Komunikat mówi „w Zadaniach" — zakładka w doku mruga, żeby było
      // widać, o KTÓRY przycisk chodzi.
      mrugnijZadania();
      return;
    }
    if (akcja === "otworzZadanie") {
      setPowitanie(null);
      otworz("zadanie");
      return;
    }
    if (akcja === "kolo") {
      // Okno Wizkora schodzi, na jego miejsce wchodzi koło — dokładnie tak
      // samo, jak układanka. Szuflada zadania NIE otwiera się teraz: wjedzie
      // dopiero po „Biorę zadanie!", żeby za kołem nie stał drugi ekran.
      setPowitanie(null);
      setKolo(true);
      return;
    }
    rozstanie();
  }, [powitanie, rozstanie, pokazKomunikat, odswiezZnakiMisji, odswiezPuzleNaMapie, otworz, przeliczNieprzeczytane, mrugnijZadania]);

  // Uchwyt do konsoli — czekanie na dziesięć gwiazdek przy każdym sprawdzeniu
  // licznika byłoby nie do zniesienia:
  //   window.zadanieGwiazdek.start() / .dolicz() / .kasuj() / .stan()
  useEffect(() => {
    window.zadanieGwiazdek = {
      start: () => { const s = rozpocznijZadanie(CEL_DOMYSLNY); setZadanie(s); return s; },
      dolicz: () => { const s = doliczGwiazdke(); if (s) setZadanie(s); return s; },
      // Kasowanie musi też ODDAĆ gwiazdki: zapis znika, ale scena wciąż ma
      // powygaszane znaki i mapa zostałaby pusta aż do przeładowania.
      kasuj: () => {
        const s = skasujZadanie();
        setZadanie(s);
        setBonus(bonusMonet());
        odswiezGwiazdkiNaMapie();
        return s;
      },
      // Podgląd, czego brakuje na mapie — bez tego trzeba czytać localStorage.
      naMapie: () => {
        const wszystkie = znakiZPrefiksem(scenaRef.current, PREFIKS_GWIAZDKI);
        const zabrane = new Set(stanZadania().zebraneZnaki || []);
        return { wszystkie, zabrane: [...zabrane], zostalo: wszystkie.filter((z) => !zabrane.has(z)) };
      },
      stan: () => ({ ...stanZadania(), bonusMonet: bonusMonet() }),
      nagroda: () => setNagroda("gwiazdki"),
    };
    // Misje z grami mają własny uchwyt — zbieranie kawałków po mapie przy
    // każdej poprawce w kwestii Wizkora byłoby nie do zniesienia:
    //   window.misjeGier.zlec("pamiec-medrca") / .odkryj(id) / .wygraj(id)
    //   window.misjeGier.stan() / .kasuj() / .nagroda(id)
    // Zadanie poza ekranem ma własny uchwyt: bez tego sprawdzenie ekranu
    // nagrody wymagałoby prawdziwego Mentora i prawdziwego werdyktu.
    //   window.zadanieWizkora.zlec() / .wyslane() / .przyjete() / .poprawka("…")
    window.zadanieWizkora = {
      lista: () => ZADANIA_WIZKORA.map((z) => z.id),
      zlec: (id) => zlecZadanieWizkora(id || ZADANIA_WIZKORA[0]?.id),
      wyslane: () => ustawStatusZadaniaWizkora("wyslane"),
      przyjete: (uwaga) => ustawStatusZadaniaWizkora("zatwierdzone", uwaga || "Ładnie to zrobiłeś."),
      poprawka: (uwaga) => ustawStatusZadaniaWizkora("poprawka", uwaga || "Opowiedz o tym trochę więcej."),
      stan: () => stanZadaniaWizkora(),
      kasuj: () => skasujZadanieWizkora(),
    };
    window.misjeGier = {
      lista: () => MISJE.map((m) => m.id),
      zlec: (id) => {
        const stan = ujawnijMisje(id);
        setMisje(stanMisji());
        try { odswiezZnakiMisji(); } catch {}
        return stan;
      },
      odkryj: (id) => { const stan = odkryjGre(id); setMisje(stanMisji()); return stan; },
      wygraj: (id) => { const stan = zaliczWygrana(id); setMisje(stanMisji()); return stan; },
      kasuj: () => { const stan = skasujMisje(); setMisje(stan); return stan; },
      stan: () => stanMisji().map(({ def, ...reszta }) => reszta),
      nagroda: (id) => setNagroda(id),
    };
    // Plakietki doku: czekanie na nową minigrę albo na zmianę pory dnia,
    // zeby sprawdzic jedno kolko, byloby absurdem.
    //   window.nowosci.stan() / .kasuj()  (kasuj = zapal wszystkie od nowa)
    window.nowosci = {
      stan: () => ({ ...nowosci, wiadomosci: nieprzeczytane }),
      kasuj: () => { kasujNowosci(); przeliczNowosci(); },
    };
    return () => {
      delete window.zadanieGwiazdek; delete window.misjeGier;
      delete window.zadanieWizkora; delete window.nowosci;
    };
  }, [odswiezZnakiMisji, odswiezGwiazdkiNaMapie, przeliczNowosci, nowosci, nieprzeczytane]);

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
      id: def.id, def, ujawniona: true, odkryta: false, wygrana: false,
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

    // Pięć kwestii na każdą misję — tyle, ile ma etapów: zlecenie → kawałki
    // → układanie → gra → wypłata. Kwestii „szukaj znaku" nie ma, bo nie ma
    // takiego etapu. Stany puzzli są PODSTAWIONE (`puzzle` w stanie misji),
    // więc podgląd nie zależy od prawdziwego zapisu i nic w nim nie zmienia.
    const poGwiazdkach = gwiazdkiStan({ spelnione: true, wyplacone: true, aktywne: false });
    const puzzlePrzed = (def, nadpisz) => ({
      brama: true, ulozona: false, komplet: false,
      cel: celPuzzli(def.id), zebrane: 0, ...nadpisz,
    });
    for (const def of MISJE) {
      const krotki = def.tytul.split(" ")[0];
      pozycje.push(
        { grupa: "Okno Wizkora", etykieta: `${krotki}: zlecenie`,
          odpal: () => okno(poGwiazdkach, misjaStan(def, { ujawniona: false })) },
        { grupa: "Okno Wizkora", etykieta: `${krotki}: kawałki`,
          odpal: () => okno(poGwiazdkach, misjaStan(def, { puzzle: puzzlePrzed(def) })) },
        { grupa: "Okno Wizkora", etykieta: `${krotki}: układanie`,
          odpal: () => okno(poGwiazdkach, misjaStan(def, {
            puzzle: puzzlePrzed(def, { komplet: true, zebrane: celPuzzli(def.id) }),
          })) },
        { grupa: "Okno Wizkora", etykieta: `${krotki}: gra`,
          odpal: () => okno(poGwiazdkach, misjaStan(def, { odkryta: true })) },
        { grupa: "Okno Wizkora", etykieta: `${krotki}: wypłata`,
          odpal: () => okno(poGwiazdkach, misjaStan(def, { odkryta: true, wygrana: true })) },
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
        etykieta: `Ułożone: ${def.tytul}`,
        odpal: () => setNagroda(`${PREFIKS_ULOZENIE}${def.id}`),
      })),
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
        // Pokazuje DOKŁADNIE zlecenie zadania, z ikoną i łamaniem na dwie
        // linijki — pulpit ma służyć do oglądania tego, co widzi dziecko,
        // a nie zastępczego napisu, który mieści się w jednej linii.
        odpal: () =>
          pokazKomunikat(`Zbierz ${CEL_DOMYSLNY}`, {
            ikona: IKONA_MONETY,
            opis: `Zbierz ${CEL_DOMYSLNY} złotych monet`,
          }),
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
      {
        grupa: "Zadanie w realu",
        etykieta: "Mentor zatwierdza",
        /**
         * Cała droga werdyktu w jednym kliknięciu: jeśli zadania nie ma —
         * zleca je, przestawia na „wysłane" i dopiero z tego stanu przyjmuje.
         * Przejście przez „wysłane" nie jest ozdobą: wieść w skrzynce rodzi
         * się na ZMIANIE stanu, więc skok prosto do „zatwierdzone" z pustego
         * zapisu nie sprawdzałby tego, o co tu chodzi.
         */
        odpal: () => {
          if (!stanZadaniaWizkora().istnieje) zlecZadanieWizkora(ZADANIA_WIZKORA[0]?.id);
          ustawStatusZadaniaWizkora("wyslane");
          ustawStatusZadaniaWizkora("zatwierdzone", "Widziałem. Zrobiłeś to naprawdę.");
          pokazKomunikat("DEV: werdykt Mentora + wieść w skrzynce");
        },
      },
      {
        grupa: "Zadanie w realu",
        etykieta: "Koło przeznaczenia",
        /**
         * Koło od razu, bez chodzenia do Wizkora. W grze wychodzi ono
         * z rozmowy (akcja `kolo`), a żeby ta rozmowa w ogóle się odbyła,
         * trzeba mieć rozliczone gwiazdki i wszystkie misje z grami —
         * przy każdej poprawce w kole byłaby to droga przez pół świata.
         *
         * Otwiera DOKŁADNIE to samo okno, co rozmowa: „Biorę zadanie!"
         * zleca wylosowane zadanie i wjeżdża szuflada. Bieżące zadanie
         * zostaje nietknięte aż do tej chwili — jeśli jakieś trwa, wybór
         * z koła je nadpisze, tak samo jak w grze.
         */
        odpal: () => setKolo(true),
      },
      {
        grupa: "Zadanie w realu",
        etykieta: "Zleć od nowa",
        odpal: () => {
          skasujZadanieWizkora();
          const nowe = ZADANIA_WIZKORA[0];
          zlecZadanieWizkora(nowe?.id);
          pokazKomunikat(nowe ? `DEV: zlecone „${nowe.tytul}"` : "DEV: katalog zadań pusty");
        },
      },
      {
        grupa: "Zadanie w realu",
        etykieta: "Koło od zera",
        /* To samo koło, ale po wyczyszczeniu zapisu RAZEM Z HISTORIĄ: losuje
           wtedy z pełnego katalogu, jak przy pierwszym uruchomieniu, zamiast
           omijać zadania rozliczone w poprzednich próbach. */
        odpal: () => {
          skasujZadanieWizkora({ historia: true });
          setKolo(true);
        },
      },
      // Puzzle przed grami: zbieranie, komplet i sama układanka na żądanie.
      ...MISJE.map((def) => ({
        grupa: "Puzzle",
        etykieta: `Zbieranie: ${def.tytul}`,
        odpal: () => {
          rozpocznijZbieranie(def.id);
          odswiezPuzleNaMapie();
          pokazKomunikat("DEV: kawałki czekają na mapie");
        },
      })),
      ...MISJE.map((def) => ({
        grupa: "Puzzle",
        etykieta: `Układanka: ${def.tytul}`,
        odpal: () => {
          rozpocznijZbieranie(def.id);
          for (let i = 1; i <= 9; i += 1) doliczKawalekPuzzli(`puzel-${i}`);
          odswiezPuzleNaMapie();
          setUkladanka(def.id);
        },
      })),
      {
        grupa: "Puzzle",
        etykieta: "Reset puzzli",
        odpal: () => {
          skasujPuzzle();
          setUkladanka(null);
          odswiezPuzleNaMapie();
          pokazKomunikat("DEV: puzzle skasowane");
        },
      },
    );

    return pozycje;
  }, [dev, pokazKomunikat, odswiezPuzleNaMapie, otworz]);

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
            pokazKomunikat(`Wizkor czeka — masz ${z.zebrane} z ${z.cel}`, {
              ikona: IKONA_MONETY,
              opis: `Wizkor czeka — masz ${z.zebrane} z ${z.cel} złotych monet`,
            });
            return;
          }
          // To samo w trakcie MISJI Z GRĄ. Przypomnienie mówi dokładnie to,
          // czego brakuje na tym etapie: zbierać kawałki czy dograć partię.
          const m = z.wyplacone ? aktualnaMisja() : null;
          if (m && m.ujawniona && !m.wygrana) {
            /* Etap puzzli: w trakcie zbierania — krótki licznik jak przy
               gwiazdkach. Z KOMPLETEM kawałków przypomnienia nie ma wcale:
               przepuszczamy do okna niżej, bo kwestia „Masz wszystkie
               kawałki!" niesie zielony przycisk otwierający układankę. */
            const puzzle = !m.odkryta ? stanPuzzli(m.id) : null;
            const brama = !!puzzle && puzzle.brama && !puzzle.ulozona;
            if (brama && !puzzle.komplet) {
              pokazKomunikat(`Wizkor czeka — masz ${puzzle.zebrane} z ${puzzle.cel} kawałków`);
              return;
            }
            /* Poza etapem puzzli zostaje jedno: gra jest zdobyta i czeka na
               rozegranie. Etapu „znajdź znak" nie ma, więc nie ma tu już
               drugiego przypomnienia. */
            if (!brama) {
              pokazKomunikat(`Wizkor czeka — zagraj w ${m.def.tytul}`);
              return;
            }
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
        if (typeof dane?.znak === "string" && dane.znak.startsWith(PREFIKS_GWIAZDKI)) {
          const po = doliczGwiazdke(dane.znak);
          if (po) {
            /**
             * TA gwiazdka już nie odrośnie — do końca zadania. Wyłączamy sam
             * powrót, a nie widoczność: wchłanianie z iskrami ma dograć się do
             * końca, bo to ono jest nagrodą za dobiegnięcie.
             */
            wstrzymajPowrotZnaku(scenaRef.current, dane.znak);
            // Ostatnia gwiazdka z mapy, a licznik jeszcze nie pełny — patrz
            // MAPA_PUSTA w `odswiezGwiazdkiNaMapie`. Sprawdzamy tutaj, bo
            // dopiero teraz las mógł się opróżnić.
            const wszystkie = znakiZPrefiksem(scenaRef.current, PREFIKS_GWIAZDKI);
            const zabrane = new Set(po.zebraneZnaki || []);
            if (!po.spelnione && wszystkie.length && wszystkie.every((z) => zabrane.has(z))) {
              setZadanie(przywrocGwiazdkiNaMape());
              odswiezGwiazdkiNaMapie();
            }
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
        /**
         * Kawałek puzzli. Liczy się tylko w trakcie zbierania — poza nim
         * znaków nie ma na mapie, a gdyby któryś mignął z animacji powrotu,
         * dotknięcie nie może ruszyć zapisu (`doliczPuzel` to sprawdza).
         * Ostatni kawałek otwiera układankę PO dograniu wchłaniania —
         * z tego samego powodu, dla którego na swój moment czeka okno liska.
         */
        if (typeof dane?.znak === "string" && dane.znak.startsWith(PREFIKS_PUZLA)) {
          const po = doliczKawalekPuzzli(dane.znak);
          if (po) {
            wstrzymajPowrotZnaku(scenaRef.current, dane.znak);
            if (po.komplet) {
              pokazKomunikat("Masz wszystkie kawałki!");
              window.setTimeout(() => setUkladanka(po.id), WCHLANIANIE_MS);
            } else {
              pokazKomunikat(`Kawałek obrazka — masz ${po.zebrane} z ${po.cel}`);
            }
          }
          return;
        }
        // Znak minigry — karta albo bucik na mapie. NIE wrzucamy dziecka
        // prosto w grę: bieg jest tu osobną przyjemnością i wpadnięcie w znak
        // bywa przypadkowe, więc najpierw pyta lisek, dokładnie tak jak
        // czarodziej pyta o rozmowę. Dopiero „Gramy!" otwiera grę — nad sceną,
        // która tylko pauzuje, więc po wyjściu lis stoi tam, gdzie stał.
        const doGry = ZNAK_GRY[dane?.znak];
        if (doGry) {
          // ZNAK GRY, KTÓREJ WIZKOR JESZCZE NIE ZLECIŁ, NIE ROBI NIC. Takiego
          // znaku nie ma na mapie, ale potrafi przez ułamek sekundy wracać
          // z animacji powrotu w chwili, gdy stan misji się właśnie zmienia.
          const stanZnaku = stanGry(doGry);
          if (!stanZnaku?.ujawniona) return;
          /* KAŻDY ZNAK GRY JEST SKRÓTEM DO NIEJ i zachowuje się tak samo:
             wchłania się, pyta lisek, gra rusza. Znak stoi na polanie od
             ułożenia układanki i zostaje tam na zawsze, więc zwykle nie ma
             tu już czego odkrywać ani wypłacać — `odkryj` i `rozliczPartie`
             zwrócą wtedy po prostu zero. Osobnej ścieżki nie potrzeba.

             `odkryjGre` zostaje jako domknięcie dwóch przypadków brzegowych:
             gry BEZ bramy z puzzli (nie ma jej dziś żadnej, ale katalog
             rośnie) i zapisu sprzed usunięcia etapu szukania. Stan podnosi
             nasłuch `MISJE_ZMIANA` — moduł ogłasza zmianę tylko wtedy, gdy
             naprawdę zaszła, więc kolejne wbiegnięcia w zdobyty już znak nie
             przerysowują huba. */
          odkryjGre(doGry);
          if (rozmowaRef.current) return;
          /**
           * ZNAK, KTÓRY NIE ZNIKA (sosna Lotu Liska), nie ma czego „wchłaniać".
           * Rozpoznajemy go po zdarzeniu: `minigra:start` przychodzi tylko od
           * znaków z `absorb`, a `znak:dotkniety` — od tych, które zostają.
           * Taki znak nie znika, tylko się KOŁYSZE (`bujanie` w mapie), więc
           * zamiast czekać, aż zejdzie z trawy, dajemy mu czas na wahnięcie
           * w obie strony — patrz `KOLYSANIE_MS`.
           */
          const bezWchlaniania = nazwa === "znak:dotkniety";
          const czekanie = bezWchlaniania ? KOLYSANIE_MS : WCHLANIANIE_MS - WYPRZEDZENIE_MS;
          if (!bezWchlaniania) setWchlanianie(doGry);
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
            setWchlanianie(null);
            /**
             * ZALEGŁA NAGRODA ZA UŁOŻENIE. Normalnie płaci ją ekran zaraz po
             * układance, więc tutaj zostaje tylko dla zapisu, w którym coś
             * przerwało tę drogę (zamknięta apka, gra bez bramy z puzzli).
             * Wtedy zamiast zaproszenia wpuszczamy ekran wygranej, a lisek
             * dostaje swoją kolej dopiero po jego zamknięciu.
             *
             * Gdy nagroda była już wypłacona — czyli prawie zawsze, bo znak
             * jest wtedy zwykłym skrótem — zaproszenie idzie od razu.
             */
            const stan = stanGry(doGry);
            if (stan?.doNagrodyZaUlozenie) {
              zaproszeniePoNagrodzieRef.current = doGry;
              /* Ekran wygranej ustawiamy TUTAJ, a nie zostawiamy efektowi
                 pilnującemu zaległych nagród. Efekt czyta stan misji ze stanu
                 Reacta, który podnosi się dopiero na zdarzenie `MISJE_ZMIANA`
                 — przy znaku, który nie znika, między dotknięciem a błyskiem
                 jest na to ledwie 280 ms i nagroda potrafiła się nie pokazać
                 wcale. `setNagroda` z funkcją: jeśli jakiś ekran już stoi,
                 nie podmieniamy go. */
              setNagroda((biezaca) => biezaca || `${PREFIKS_ULOZENIE}${doGry}`);
            } else setZaproszenie(doGry);
          }, czekanie);
          return;
        }

        const doOtwarcia = ZNAK_PANELU[dane?.znak];
        if (doOtwarcia) otworz(doOtwarcia);
        return;
      }
      if (nazwa === "blad") setScenaMartwa(true);
    },
    [otworz, panel, pokazKomunikat, navigate, odswiezZnakiMisji, odswiezGwiazdkiNaMapie]
  );

  // Uchwyt do konsoli — bieganie po mapie w poszukiwaniu piórka przy każdej
  // poprawce w oknie zaproszenia byłoby nie do zniesienia. Ten sam wzorzec, co
  // `window.popupPostaci` i `window.zadanieGwiazdek`:
  //   window.zaproszenieGry.pokaz("pamiec-medrca") / .schowaj()
  useEffect(() => {
    window.zaproszenieGry = {
      pokaz: (id = "pamiec-medrca") => setZaproszenie(id),
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
   * To samo dla gwiazdek — ale CELOWO bez `zadanie.zebrane` w zależnościach.
   * Zbieranie w biegu obsługuje sam moment dotknięcia (wyłącza powrót tej
   * jednej gwiazdki); wywołanie stąd przy każdej zebranej gasiłoby ją twardo
   * w tej samej klatce i wchłanianie urywałoby się w pół animacji.
   *
   * Zostają trzy momenty, w których mapa naprawdę wymaga przeliczenia: wejście
   * do świata (zapis mówi, czego już nie ma), zlecenie zadania i jego
   * rozliczenie (gwiazdki wracają).
   */
  useEffect(() => {
    if (!scenaGotowa) return;
    odswiezGwiazdkiNaMapie();
  }, [scenaGotowa, zadanie.istnieje, zadanie.wyplacone, odswiezGwiazdkiNaMapie]);

  /**
   * To samo dla kawałków puzzli. `ukladanka` w zależnościach: jej zamknięcie
   * (ułożona albo porzucona) to moment, w którym mapa ma przestać albo znów
   * zacząć pokazywać kawałki — sam moment dotknięcia obsługuje zbieranie
   * w biegu (`wstrzymajPowrotZnaku`), dokładnie jak przy gwiazdkach.
   */
  useEffect(() => {
    if (!scenaGotowa) return;
    odswiezPuzleNaMapie();
  }, [scenaGotowa, ukladanka, odswiezPuzleNaMapie]);

  /**
   * BEZPIECZNIK ZAPISU: misja zlecona, etap puzzli, a zbieranie nierozpoczęte
   * — tak wygląda zapis sprzed wprowadzenia bramy (i powrót na innym
   * urządzeniu). Bez tego dziecko stałoby przed pustą polaną: znak gry już
   * zdjęty (`naMapie`), kawałków jeszcze nikt nie rozsypał. Wejście do świata
   * dokańcza więc zlecenie Wizkora.
   */
  useEffect(() => {
    if (!scenaGotowa) return;
    const m = misje.find((w) => w.ujawniona && !w.odkryta && !w.wyplacona);
    if (!m || czyOdblokowana(m.id)) return;
    const stan = stanPuzzli(m.id);
    if (!stan.zbieranie && !stan.komplet) {
      rozpocznijZbieranie(m.id);
      odswiezPuzleNaMapie();
    }
  }, [scenaGotowa, misje, odswiezPuzleNaMapie]);

  /**
   * Licznik kawałków w HUD słucha modułu puzzli: każde `zapisz` (zebrany
   * kawałek, start zbierania, ułożenie, reset z pulpitu) ogłasza zmianę,
   * a licznik czyta stan od nowa. Bez nasłuchu liczba stałaby w miejscu
   * do najbliższego przerysowania z zupełnie innego powodu.
   */
  useEffect(() => {
    const przelicz = () => setPuzzleHud(biezacePuzzle());
    window.addEventListener(PUZZLE_ZMIANA, przelicz);
    return () => window.removeEventListener(PUZZLE_ZMIANA, przelicz);
  }, []);

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
    if (!id) return;
    // BRAMA Z PUZZLI: pierwsze „Gramy!" prowadzi najpierw po kawałki
    // obrazka. Wybrany poziom czeka w refie i wraca przy starcie po ułożeniu.
    if (bramaPuzzli(id, poziom)) return;
    otworzGre(id, { poziom });
  }, [zaproszenie, poziomZaproszenia, otworzGre, bramaPuzzli]);

  /**
   * Zasady „najpierw zdobądź grę" nie pilnuje żadna ulotna flaga: gry NIE MA
   * w zakładce, dopóki jej układanka nie zostanie ułożona, więc każda
   * rozegrana partia z definicji przyszła po zdobyciu. Warunek siedzi
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
          tam drugie, konkurencyjne tło.
          `ma-szuflade-pelna` zdejmuje podkład zupełnie — patrz `szufladaPelna`. */}
      <div
        className={`game-hud${odsloniete ? " jest-widoczny" : ""}${naglowek ? " ma-szuflade" : ""}${szufladaPelna ? " ma-szuflade-pelna" : ""}`}
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
            className={`game-hud-resources${zadanie.aktywne || misjaHud || puzzleHud ? " ma-zadanie" : ""}`}
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

                Kafelek wchodzi DOPIERO po ułożeniu układanki (patrz
                `misjaHud`), więc „0/1" znaczy tu jedno: gra jest już zdobyta,
                partia jeszcze nierozegrana. W etapie kawałków górę ekranu ma
                dla siebie ich własny licznik. */}
            {misjaHud ? (
              <span
                className={`game-hud-counter game-hud-counter--misja${misjaHud.wygrana ? " jest-spelnione" : ""}`}
                aria-label={
                  misjaHud.wygrana
                    ? `${misjaHud.def.tytul}: rozegrane`
                    : `${misjaHud.def.tytul}: gra zdobyta, zagraj`
                }
                data-testid={`hub-misja-${misjaHud.id}`}
              >
                <img
                  data-ksztalt={misjaHud.def.ksztaltIkony || "zeton"}
                  src={misjaHud.def.ikona}
                  alt=""
                  aria-hidden="true"
                  draggable="false"
                />
                <strong>{misjaHud.wygrana ? "1" : "0"}</strong>
                <em>/1</em>
              </span>
            ) : null}

            {/* Licznik KAWAŁKÓW PUZZLI — stoi przez cały etap puzzli (kafelek
                misji czeka wtedy schowany, więc góra ekranu dalej mówi
                o jednym celu). PRZYCISK, nie span: z kompletem dotknięcie
                otwiera układankę i kafelek świeci jak spełniona misja. */}
            {puzzleHud ? (
              <button
                type="button"
                className={`game-hud-counter game-hud-counter--misja game-hud-counter--puzzle${puzzleHud.komplet ? " jest-spelnione" : ""}`}
                aria-label={
                  puzzleHud.komplet
                    ? "Masz wszystkie kawałki — dotknij, żeby ułożyć obrazek"
                    : `Kawałki obrazka: masz ${puzzleHud.zebrane} z ${puzzleHud.cel}`
                }
                data-testid="hub-puzzle-licznik"
                onClick={() => {
                  if (puzzleHud.komplet) setUkladanka(puzzleHud.id);
                }}
              >
                <img
                  data-ksztalt="zeton"
                  src="/assets/puzzle/kawalek.svg"
                  alt=""
                  aria-hidden="true"
                  draggable="false"
                />
                <strong>{puzzleHud.zebrane}</strong>
                <em>/{puzzleHud.cel}</em>
              </button>
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
          <HubDock
            aktywny={panel}
            onWybor={przelacz}
            migajaca={migaZadania ? "wiadomosci" : null}
            plakietki={{
              gry: nowosci.gry,
              czat: nowosci.czat,
              porada: nowosci.porada,
              wiadomosci: nieprzeczytane,
            }}
          />
        </div>
      </div>

      {/* Mędrzec odzywa się tylko w spokojnym hubie: nie nad panelem, nie nad
          zwojem i nie zanim rozsuną się chmury. */}
      <PodpowiedzMedrca
        ref={medrzecRef}
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
        /* Zamknięcie krzyżykiem przypomnienia o zadaniu = „jeszcze nie teraz".
           Wtedy TYM BARDZIEJ mrugamy Zadaniami: dziecko nie weszło w zadanie,
           więc niech chociaż zobaczy, gdzie ono na nie czeka. */
        onZamknij={() => {
          if (powitanie?.akcja === "otworzZadanie") mrugnijZadania();
          rozstanie();
        }}
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

      {/* Nagroda za UŁOŻENIE OBRAZKA — pierwsza połowa misji. Wchodzi zaraz
          po ostatnim kawałku wciśniętym na miejsce: dziecko dostaje
          potwierdzenie dokładnie tam, gdzie skończył się wysiłek. Jej
          zamknięcie startuje minigrę (`graPoNagrodzieRef`), więc CTA mówi
          „Gramy!", a nie „Super!" — obiecuje to, co naprawdę się stanie. */}
      {stanGry(idZUlozenia(nagroda) || "") ? (
        <RewardScreen
          eyebrow="✦ OBRAZEK ZŁOŻONY"
          title={stanGry(idZUlozenia(nagroda)).def.nagrodaEkranUlozenie.title}
          subtitle={stanGry(idZUlozenia(nagroda)).def.nagrodaEkranUlozenie.subtitle}
          coins={stanGry(idZUlozenia(nagroda)).def.nagrodaUlozenie}
          note="Reszta czeka za rozegraną partię"
          ctaLabel={graPoNagrodzieRef.current ? "Gramy! ✦" : "Super! ✦"}
          onDismiss={zamknijNagrode}
        />
      ) : null}

      {/* Nagroda za misję z grą. Wchodzi dopiero po WYJŚCIU z gry — efekt
          pilnujący zaległych nagród nie odpala jej nad otwartą minigrą, żeby
          konfetti nie leciało pod planszą. Teksty stoją przy definicji misji,
          więc trzecia gra nie wymaga tu ani jednej linijki. */}
      {nagroda && nagroda !== "gwiazdki" && !idZUlozenia(nagroda) && stanGry(nagroda) ? (
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
        onPowrot={powrotPanelu}
        testId="hub-sheet"
        powrot={!!powrotPanelu}
        /* Czat sam dzieli sobie wysokość (strumień przewija się, pole pisania
           stoi na dole). Reszta paneli to listy — te przewijają się w całości. */
        wypelnia={panel === "czat"}
      >
        {/* `onGra`, a nie `onZamknij` + `navigate`: zakładka ZOSTAJE otwarta pod
            grą. Dzięki temu zamknięcie gry odsłania ją z powrotem, zamiast
            odbudowywać hub od zera — a wynika to z samego adresu
            (`?panel=gry&gra=…` → `?panel=gry`). */}
        {panel === "gry" ? (
          <MinigryPanel onGra={uruchomGre} onZamknij={zamknij} onKomunikat={pokazKomunikat} />
        ) : null}
        {panel === "profil" ? <ProfilPanel /> : null}
        {panel === "czat" ? <CzatPanel onPowrot={zarejestrujPowrot} /> : null}
        {panel === "porada" ? <PoradaPanel onPowrot={zarejestrujPowrot} /> : null}
        {panel === "zadanie" ? (
          <ZadaniePanel onKomunikat={pokazKomunikat} onZamknij={zamknij} onPowrot={zarejestrujPowrot} />
        ) : null}
      </PanelSheet>

      {komunikat ? (
        <div
          className="game-hud-toast is-visible"
          role="status"
          aria-label={komunikat.opis}
          data-testid="hub-toast"
        >
          <span className="game-hud-toast-tekst">{komunikat.tekst}</span>
          {komunikat.ikona ? (
            <img
              className="game-hud-toast-ikona"
              src={komunikat.ikona}
              alt=""
              aria-hidden="true"
              draggable="false"
            />
          ) : null}
        </div>
      ) : null}

      {/* KOŁO PRZEZNACZENIA — losowanie cechy przed zadaniem w realu.
          Wychodzi z rozmowy z Wizkorem (akcja `kolo`) i stoi NAD mapą, bez
          niczego pod spodem. Krzyżyk zamyka je bezpowrotnie: nie ma skrótu
          w szufladzie, po koło wraca się do Wizkora. Szuflada zadania wjeżdża
          dopiero z wylosowanym zadaniem. */}
      {kolo ? (
        <Suspense fallback={null}>
          <KoloFortuny
            onZamknij={() => setKolo(false)}
            onWybor={(cecha) => {
              const wylosowane = zadanieDlaCechy(cecha);
              setKolo(false);
              if (!wylosowane) return;
              zlecZadanieWizkora(wylosowane.id);
              przeliczNieprzeczytane();
              otworz("zadanie");
            }}
          />
        </Suspense>
      ) : null}

      {/* UKŁADANKA — brama przed minigrą. Nad HUD-em i arkuszem, pod samą
          grą (nigdy nie stoją naraz: jedna otwiera drugą). */}
      {ukladanka ? (
        <Suspense fallback={null}>
          <PuzzleBrama
            gra={ukladanka}
            tytul={(KATALOG_GIER.gry || []).find((g) => g.id === ukladanka)?.tytul || "Układanka"}
            /* KRZYŻYK PO UŁOŻENIU nie może odebrać zdobyczy. Brama zapisuje
               ułożenie od razu (`zaliczUlozenie`), więc obrazek jest złożony
               także wtedy, gdy dziecko zamknie ekran zamiast kliknąć „Gramy!".
               Domykamy więc to samo, co CTA, minus start gry — a nagrodę za
               ułożenie dopłaci efekt pilnujący zaległych nagród. */
            onZamknij={() => {
              const id = ukladanka;
              poziomPoUkladanceRef.current = null;
              setUkladanka(null);
              if (!id || !czyOdblokowana(id)) return;
              odkryjGre(id);
              setMisje(stanMisji());
              try { odswiezZnakiMisji(); } catch {}
            }}
            onUlozona={() => {
              const id = ukladanka;
              const poziom = poziomPoUkladanceRef.current || poziomDomyslny(id);
              poziomPoUkladanceRef.current = null;
              setUkladanka(null);
              /* UŁOŻONE = ZDOBYTE, I GRA RUSZA (decyzja właściciela,
                 2026-08-22). `odkryjGre` wstawia grę do skrzyni na stałe
                 i wpuszcza jej znak na polanę jako skrót — a dziecko idzie
                 PROSTO do gry, bez szukania czegokolwiek po trawie.

                 Wcześniej stał tu etap „znajdź kartę Mędrca na mapie":
                 ułożony obrazek tylko odsłaniał znak, a partię odpalało
                 wbiegnięcie w niego. Było to drugie polowanie pod rząd, tuż
                 po zbieraniu dziewięciu kawałków — czyli kara za skończenie
                 układanki, dokładnie w chwili największej ochoty na grę.

                 Między obrazkiem a partią zostaje jedna rzecz: ekran nagrody
                 za ułożenie. Nagroda należy się TERAZ, bo teraz skończył się
                 wysiłek, a jej zamknięcie startuje grę (`graPoNagrodzieRef`
                 → `zamknijNagrode`). Gdy nie ma czego wypłacać (druga
                 układanka tej samej gry po resecie puzzli), gra rusza od razu. */
              const stan = odkryjGre(id) || stanGry(id);
              setMisje(stanMisji());
              try { odswiezZnakiMisji(); } catch {}
              if (stan?.doNagrodyZaUlozenie) {
                graPoNagrodzieRef.current = { id, poziom };
                setNagroda(`${PREFIKS_ULOZENIE}${id}`);
                return;
              }
              otworzGre(id, { poziom });
            }}
          />
        </Suspense>
      ) : null}

      {/* MINIGRA NAD ŚWIATEM — ostatnia w drzewie, żeby przykryła wszystko:
          HUD, dok, arkusz sekcji. Scena pod spodem zostaje zamontowana
          i zapauzowana, więc wyjście z gry nie kosztuje ani jednego pobrania
          modelu, a lis stoi tam, gdzie go zostawiliśmy. */}
      {/* WNĘTRZE CHATKI — ta sama warstwa co minigra: scena mapy pod spodem
          zostaje zamontowana i zapauzowana (robi to efekt reagujący na `panel`),
          więc wyjście z pokoju stawia liska dokładnie tam, gdzie stał w progu. */}
      {panel === "dom" ? (
        <Suspense fallback={null}>
          <WnetrzeDomku onWyjscie={zamknij} />
        </Suspense>
      ) : null}

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
              // To samo dla gwiazdek: skok na etap „po nagrodzie" ma oddać
              // las, a skok na „zadanie trwa" — zabrać z niego to, co zapis
              // uważa za zebrane.
              try { odswiezGwiazdkiNaMapie(); } catch {}
              // I dla puzzli — reset z pulpitu ma od razu zdjąć kawałki z mapy.
              try { odswiezPuzleNaMapie(); } catch {}
              // Skok na inny etap unieważnia okno, które akurat stoi: kwestia
              // Wizkora sprzed skoku dotyczy już nieistniejącego stanu.
              setPowitanie(null);
              setNagroda(null);
            }}
            onOtworzGre={otworzGre}
            /* Panele huba (Zadania, zadanie) — sekcja „Zadanie w realu" otwiera
               nimi zwój i kartę zadania bez biegania po mapie. */
            onOtworzPanel={otworz}
            /* Oś etapów: moment „układanka" otwiera ekran układanki. */
            onOtworzUkladanke={(id) => setUkladanka(id)}
            onKomunikat={pokazKomunikat}
            zdarzenia={zdarzeniaDev}
            onWylacz={() => setDev(ustawDev(false))}
            onPokazWskazowke={(id) =>
              setWskazowka(wskazowkaPoId(id) || nastepnaWskazowka({ chodzenieOswojone: true }))
            }
            onPokazMyslMedrca={() => {
              setWskazowka(null);
              medrzecRef.current?.pokaz();
            }}
          />
        </Suspense>
      ) : null}
    </main>
  );
}
