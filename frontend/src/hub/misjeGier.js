/*!
 * SPDX-FileCopyrightText: © 2026 Amitiel Angelisme <armitiel@gmail.com>
 * SPDX-License-Identifier: LicenseRef-EwolucJA-Proprietary
 *
 * EwolucJA — gra edukacyjna dla dzieci.
 * Produkt powstał w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”;
 * autorskie prawa majątkowe pozostają przy autorze. Licencja: LICENSE.
 */
/**
 * misjeGier — łańcuch zadań Wizkora, w których dziecko ODKRYWA minigry.
 *
 * DLACZEGO TO ISTNIEJE. Gry nie mają być listą, którą widać od pierwszego
 * wejścia. Mają być zdobyczą: Wizkor mówi, że obrazek rozsypał się po
 * polanie, dziecko zbiera kawałki, układa je — i dopiero wtedy gra jest
 * jego, na stałe. Dlatego jeden moduł trzyma OBIE rzeczy naraz: postęp
 * zadania i odkrycie gry. Trzymane osobno rozjechałyby się przy pierwszej
 * poprawce (zadanie skończone, a gra dalej niedostępna albo odwrotnie).
 *
 * ŻYCIE JEDNEJ MISJI — cztery kroki, każdy widoczny w innym miejscu:
 *
 *   1. ukryta        na mapie nie ma nic z tej misji, gry nie ma w zakładce
 *   2. ujawniona     Wizkor zlecił — po polanie leżą kawałki obrazka
 *   3. odkryta       układanka ułożona (`puzzleGier`) — gra ląduje w zakładce
 *                    NA STAŁE, znak wchodzi na mapę jako skrót do niej,
 *                    a minigra rusza OD RAZU
 *   4. wygrana       partia rozegrana do końca → Wizkor płaci (`wyplacona`)
 *
 * ETAPU „ZNAJDŹ ZNAK NA MAPIE" NIE MA (decyzja właściciela, 2026-08-22).
 * Wcześniej ułożona układanka tylko ODSŁANIAŁA znak, a grę odpalało dopiero
 * wbiegnięcie w niego. Szukanie po ułożonym obrazku było drugim szukaniem
 * pod rząd — dziecko przeszło już całą polanę po kawałki i dostawało za to
 * kolejne polowanie zamiast gry. Teraz obrazek JEST szukaniem: układanka
 * kończy pogoń, a znak zostaje na polanie jako stały skrót do gry.
 *
 * Kolejność ma znaczenie: `zaliczWygrana` nie ruszy misji, której układanka
 * nie została ułożona. To jest cała zasada „najpierw zdobądź grę". Dzięki
 * temu nie potrzeba żadnej ulotnej flagi „wszedłem z mapy" — samo `odkryta`
 * jest dowodem, a przy okazji przeżywa zamknięcie apki.
 *
 * Misje idą PO KOLEI, w porządku z `MISJE`. Wizkor zawsze mówi o pierwszej
 * nierozliczonej — dziecko ma na ekranie jeden cel, a nie listę zadań.
 *
 * Nagrody lądują w lokalnym bonusie monet (`services/monety.js`), bo backend
 * nadal nie ma końcówki „dodaj graczowi N monet" — ten dług opisuje
 * `zadanieGwiazdek.js`.
 */
import { bonusMonet, dodajMonety } from "../services/monety.js";
import { biezacePuzzle, czyOdblokowana as czyPuzzleUlozone } from "./puzzleGier.js";

const KLUCZ = "ewolucja.misje.gier";

/** Zdarzenie dla huba i zakładki gier: „stan się zmienił, przeczytaj od nowa". */
export const ZDARZENIE_ZMIANY = "ewolucja:misjeGierZmiana";

/**
 * Definicje misji. `id` to identyfikator gry z `hub/data/minigry.v1.json`
 * (jedno słownictwo dla katalogu, adresu i mapy), `znak` — identyfikator
 * znaku w scenie 3D z `public/scena-3d/mapa.json`.
 *
 * Teksty stoją TUTAJ, obok warunków, a nie w komponencie huba. Kwestia
 * Wizkora zmienia się razem ze stanem misji, więc rozdzielenie ich znaczyło
 * tylko tyle, że przy dodaniu trzeciej misji trzeba pamiętać o dwóch
 * plikach zamiast o jednym.
 */
export const MISJE = [
  {
    id: "pamiec-medrca",
    znak: "karty",
    tytul: "Gra na Pamięć",
    szukaj: "kartę Wizkora",
    ikona: "/assets/karty/rewers-3d.png",
    // Ksztalt ikony w HUD-zie: karta to prostokat 2:3 (dostaje wezsze
    // pudelko i zaokraglone rogi), zeton to kwadrat. Bez tego HUD musialby
    // zgadywac proporcje z nazwy pliku.
    ksztaltIkony: "karta",
    /* NAGRODA JEST ROZBITA NA DWIE. Ułożenie obrazka to osobne osiagniecie
       i ma wlasny ekran wygranej - dziecko biega po polanie po kawalki przez
       kilka minut i to bieganie musi sie oplacic samo w sobie, niezaleznie
       od tego, jak pojdzie sama partia. Druga czesc placi Wizkor za rozegrana
       gre. Suma zostaje ta sama, co przed rozbiciem (40). */
    nagrodaUlozenie: 15,
    nagroda: 25,
    /* MISJA ZACZYNA SIĘ OD PUZZLI (decyzja właściciela, 2026-08-22):
       zlecenie rozsypuje po polanie kawałki obrazka, a ułożenie ich WCHODZI
       PROSTO W GRĘ — znak zostaje przy okazji na mapie jako skrót (patrz
       `naMapie` niżej i `puzzleGier`). Stąd zlecenie mówi o kawałkach
       i obiecuje grę, a nie kolejne szukanie. */
    zlecenie: {
      tekst:
        "Mój obrazek rozsypał się po polanie. " +
        "Pozbieraj puzelki i ułóż go, a karta zostanie twoja.",
      wyroznienie: "puzelki",
      przycisk: "Zbieram puzelki!",
    },
    /* Dwie kwestie na etap puzzli, bo etap ma dwa widoczne stany:
       kawałki jeszcze w trawie i komplet czekający na ułożenie. */
    zbieranie: {
      tekst:
        "Puzelki błyszczą w trawie po całej polanie. " +
        "Zbierz wszystkie, a ułożymy z nich mój obrazek.",
      wyroznienie: "Puzelki",
      przycisk: "Zbieram dalej!",
    },
    ukladanie: {
      tekst:
        "Masz wszystkie puzelki! Ułóż z nich obrazek, " +
        "a od razu rozłoży się stół pełen par.",
      wyroznienie: "Ułóż z nich obrazek",
      przycisk: "Układam!",
    },
    /* `tekstEkranu` = KARTA (≤ 60 zn., jedno polecenie albo jeden fakt) —
       na ekran idzie ona, pełny `tekst` zostaje głosowi (`PopupPostaci`).
       Treść kart wg `docs/tresci/02_KOMUNIKATY_POPRAWKI.md` §2.2. */
    granie: {
      tekst:
        "Karta jest twoja — stoi na polanie i czeka w Minigrach. " +
        "Teraz dobierz wszystkie pary.",
      tekstEkranu: "Karta stoi na polanie. Dobierz pary.",
      wyroznienie: "dobierz wszystkie pary",
      przycisk: "Gram dalej!",
    },
    wyplata: {
      tekst:
        "Widziałem każdą parę. Karta zostaje na polanie — " +
        "wracaj do niej, kiedy chcesz.",
      tekstEkranu: "Wszystkie pary. Karta zostaje na polanie.",
      wyroznienie: "zostaje na polanie",
      przycisk: "Dobrze",
    },
    nagrodaEkranUlozenie: {
      title: "Obrazek ułożony!",
      subtitle: "Karta Wizkora stoi na polanie i czeka w Minigrach.",
    },
    nagrodaEkran: {
      title: "Wszystkie pary!",
      subtitle: "{Dobrałeś|Dobrałaś} wszystkie pary z karty Wizkora.",
    },
  },
  {
    id: "lot-liska",
    /* Znak tej misji to DRZEWO, nie leżący przedmiot. Choinkę widać z drugiego
       końca polany, więc dziecko nie szuka jej po trawie — idzie prosto do
       niej. To celowe: trzecia misja z rzędu polegająca na wypatrywaniu
       drobiazgu w trawie byłaby tym samym zadaniem trzeci raz.
       Sam znak jest budowany z generatora sceny (`file: "drzewo"` w mapa.json),
       bo pliku `drzewo.glb` nie ma — patrz patch `loadGLB` w bundlu. */
    znak: "drzewo-lotu",
    /* Choinka miała tu kiedyś `zostajeNaMapie: true` — była JEDYNYM znakiem,
       który przeżywał rozliczenie misji, bo jako drzewo nie czytała się jako
       „zbierz mnie". Flaga zniknęła, gdy zasada stała się ogólna: raz zdobyty
       znak stoi na polanie na stałe (patrz `naMapie`). Jeden wyjątek mniej. */
    /* Bez kafelka „0/1" w HUD. Choinkę widać z drugiego końca polany
       i wystarczy do niej podbiec — licznik nie niesie wtedy żadnej
       informacji, tylko zajmuje górę ekranu. */
    bezLicznikaHud: true,
    tytul: "Lot Liska",
    szukaj: "wysoką choinkę",
    // Ikona zadania to CHOINKA, a nie lisek: kafelek w HUD ma 30 px i mowi,
    // CZEGO SIE SZUKA na mapie ("wysoka choinke"), a nie kto szuka. Lisek w tym
    // rozmiarze byl pomaranczowa plamka - kazde zadanie wygladalo tak samo.
    ikona: "/assets/minigry/choinka.png",
    ksztaltIkony: "zeton",
    /* Ten sam podział co wyżej, suma 55 — lot jest ostatnią i najdłuższą
       z trzech gier, więc dostaje odrobinę więcej niż piórko. */
    nagrodaUlozenie: 20,
    nagroda: 35,
    zlecenie: {
      tekst:
        "Obrazek lotu rozsypał się po polanie. " +
        "Pozbieraj puzelki i ułóż go, a wejdziesz na szczyt choinki.",
      wyroznienie: "puzelki",
      przycisk: "Zbieram puzelki!",
    },
    zbieranie: {
      tekst:
        "Puzelki wciąż leżą w trawie. Zbierz wszystkie, " +
        "a ułożymy z nich obrazek lotu.",
      wyroznienie: "Puzelki",
      przycisk: "Zbieram dalej!",
    },
    ukladanie: {
      tekst:
        "Masz wszystkie puzelki! Ułóż z nich obrazek, " +
        "a od razu wejdziesz na choinkę.",
      wyroznienie: "Ułóż z nich obrazek",
      przycisk: "Układam!",
    },
    granie: {
      tekst:
        "Choinka jest twoja. Odbij się w dobrym momencie i łap wiatr — " +
        "im dłużej lecisz, tym dalej widać polanę.",
      tekstEkranu: "Choinka jest twoja. Odbij się i leć.",
      wyroznienie: "łap wiatr",
      przycisk: "Lecę!",
    },
    wyplata: {
      tekst:
        "Widziałem ten lot z ziemi. Kawał drogi. " +
        "Choinka zostaje na polanie — startuj, kiedy chcesz.",
      tekstEkranu: "Widziałem ten lot. Choinka zostaje twoja.",
      wyroznienie: "zostaje na polanie",
      przycisk: "Dobrze",
    },
    nagrodaEkranUlozenie: {
      title: "Obrazek ułożony!",
      subtitle: "Choinka jest twoja — od teraz startujesz z niej, kiedy chcesz.",
    },
    nagrodaEkran: {
      title: "Ale lot!",
      subtitle: "{Złapałeś|Złapałaś} wiatr i {poleciałeś|poleciałaś} dalej, niż sięga polana.",
    },
  },
  {
    id: "bieg-liska",
    /* Znak tej misji to BUCIK (`assets/but.glb`) — zgubiony but do biegania,
       leżący w trawie. Wracamy więc do schematu karty i piórka: przedmiot,
       który się podnosi, a nie miejsce, do którego się podchodzi. Dzięki temu
       wchłanianie działa tu tak samo jak w dwóch pierwszych misjach — bez
       wyjątków w kodzie sceny. */
    znak: "bucik",
    tytul: "Bieg Liska",
    szukaj: "zgubiony bucik",
    /* Ikona wyrenderowana z TEGO SAMEGO modelu, który leży na mapie
       (`scripts` w `tmp/ikona` — three.js + GLTFLoader, jedna klatka). Kafelek
       ma 30 px i mówi, CZEGO SIĘ SZUKA, więc musi to być ta sama rzecz i ten
       sam kolor, co w trawie. */
    ikona: "/assets/minigry/but.png",
    ksztaltIkony: "zeton",
    /* Ten sam podział co w reszcie łańcucha. Suma 65 — bieg jest ostatni
       i najdłuższy (pięć zadań na trasie), więc płaci najwięcej. Za ułożenie
       płacimy najhojniej z całego łańcucha (25): obrazek trasy ma dziewięć
       kawałków, a to najdłuższe zbieranie w grze. */
    nagrodaUlozenie: 25,
    nagroda: 40,
    zlecenie: {
      tekst:
        "Obrazek górskiej trasy rozsypał się po polanie. " +
        "Pozbieraj puzelki i ułóż go, a bucik do biegania będzie twój.",
      wyroznienie: "puzelki",
      przycisk: "Zbieram puzelki!",
    },
    zbieranie: {
      tekst:
        "Puzelki leżą w trawie po całej polanie. " +
        "Zbierz wszystkie, a ułożymy z nich górską trasę.",
      wyroznienie: "Puzelki",
      przycisk: "Zbieram dalej!",
    },
    ukladanie: {
      tekst:
        "Masz wszystkie puzelki! Ułóż z nich obrazek, " +
        "a trasa stanie otworem od razu.",
      wyroznienie: "Ułóż z nich obrazek",
      przycisk: "Układam!",
    },
    granie: {
      tekst:
        "Bucik jest twój, więc trasa stoi otworem. Biegnij i licz w biegu — " +
        "po jednej bramce naraz.",
      tekstEkranu: "Bucik jest twój. Trasa stoi otworem.",
      wyroznienie: "licz w biegu",
      przycisk: "Biegnę!",
    },
    wyplata: {
      tekst:
        "{Przebiegłeś|Przebiegłaś} całą trasę i jeszcze {liczyłeś|liczyłaś} po drodze. " +
        "Bucik zostaje na polanie — trasa jest twoja.",
      tekstEkranu: "Cała trasa. Bucik zostaje na polanie.",
      wyroznienie: "zostaje na polanie",
      przycisk: "Dobrze",
    },
    nagrodaEkranUlozenie: {
      title: "Obrazek ułożony!",
      subtitle: "Bucik jest twój — trasa czeka na polanie i w Minigrach.",
    },
    nagrodaEkran: {
      title: "Głowa i nogi!",
      subtitle: "{Przebiegłeś|Przebiegłaś} całą trasę, licząc na każdej bramce.",
    },
  },
];

/** Definicja misji po id gry albo po identyfikatorze znaku w scenie. */
export function misjaGry(id) {
  return MISJE.find((m) => m.id === id) || null;
}
export function misjaZnaku(znak) {
  return MISJE.find((m) => m.znak === znak) || null;
}

function czytaj() {
  try {
    const surowe = JSON.parse(localStorage.getItem(KLUCZ) || "null");
    return surowe && typeof surowe === "object" ? surowe : {};
  } catch {
    return {};
  }
}

function zapisz(zapis) {
  try { localStorage.setItem(KLUCZ, JSON.stringify(zapis)); } catch {}
  try {
    window.dispatchEvent(new CustomEvent(ZDARZENIE_ZMIANY, { detail: { misje: stanMisji() } }));
  } catch {}
}

/**
 * Gra, której układankę dziecko WŁAŚNIE zdobywa: od rozsypania kawałków po
 * polanie do ułożenia obrazka (`null`, gdy żadna). Liczone raz i podawane
 * dalej, bo `stanMisji` pytałoby o to samo dla każdej misji z łańcucha.
 */
function idEtapuPuzzli() {
  try { return biezacePuzzle()?.id || null; } catch { return null; }
}

function zStanu(def, wpis, etapPuzzli = idEtapuPuzzli()) {
  const ujawniona = !!wpis?.ujawniona;
  /* `znaleziona` to STARA nazwa tej samej flagi — z czasów, gdy grę odkrywało
     wbiegnięcie w znak, a nie ułożenie układanki. Czytamy obie, żeby zapis
     zrobiony przed tą zmianą nie odebrał dziecku zdobytej już gry. */
  const odkryta = !!(wpis?.odkryta || wpis?.znaleziona);
  const wygrana = !!wpis?.wygrana;
  const wyplacona = !!wpis?.wyplacona;
  const wyplaconaUlozenie = !!(wpis?.wyplaconaUlozenie || wpis?.wyplaconaZnalezienie);
  /**
   * JEDNO ZADANIE NA RAZ (decyzja właściciela, 2026-09-14). Dopóki trwa etap
   * puzzli JAKIEJŚ gry, wszystkie POZOSTAŁE gry łańcucha schodzą z drogi:
   * ich skrót znika z mapy, a kafel w skrzyni gaśnie. Nie dlatego, że dziecko
   * ma ich nie dostać — dostało je na stałe i wrócą w tej samej sekundzie,
   * w której obrazek się ułoży — tylko dlatego, że polana ma w danym momencie
   * mówić o jednej rzeczy. Zdobyta gra obok rozsypanych kawałków to wybór
   * między „zagram w to, co umiem" a „poszukam czegoś nowego", a
   * sześciolatek prawie zawsze wybierze pierwsze i etap puzzli nie ruszy
   * z miejsca.
   */
  const inneZadanieTrwa = !!etapPuzzli && etapPuzzli !== def.id;
  return {
    id: def.id,
    def,
    ujawniona,
    odkryta,
    wygrana,
    wyplacona,
    /** Czy zaplacilismy juz za SAMO ulozenie obrazka. */
    wyplaconaUlozenie,
    /** Obrazek ułożony, a nagroda za ułożenie jeszcze nieodebrana. */
    doNagrodyZaUlozenie: odkryta && !wyplaconaUlozenie,
    /** Kafelek w HUD ma stać, dopóki misja nie jest rozliczona. */
    aktywna: ujawniona && !wyplacona,
    /**
     * CO STOI NA MAPIE. Znak gry wchodzi na polanę w chwili UŁOŻENIA
     * układanki i zostaje tam NA ZAWSZE — jako skrót do zdobytej gry.
     *
     * Wcześniej znak chował się na czas kolejnego polowania („mapa mówi
     * o jednej rzeczy") i wracał dopiero po rozliczeniu wszystkich misji.
     * Miało to sens, dopóki znak BYŁ celem: dwa cele naraz gubiły ten
     * właściwy. Od kiedy celem jest obrazek, a znak tylko drzwiami do gry,
     * chowanie go odbierało dziecku wstęp do rzeczy, którą już zdobyło —
     * i to w jedynym momencie, w którym miałoby ochotę zagrać w nią jeszcze
     * raz. Cel nowej misji leży teraz w trawie jako kawałki puzzli i niczym
     * się z drzwiami nie myli (decyzja właściciela, 2026-08-22).
     *
     * Jedno zawężenie doszło 2026-09-14: skrót znika na CZAS ETAPU PUZZLI
     * innej gry i wraca, gdy tamten obrazek się ułoży — patrz
     * `inneZadanieTrwa` wyżej. To nie jest powrót do starego chowania „aż do
     * rozliczenia wszystkich misji": tam znak przepadał na całe godziny gry,
     * tutaj na jedno zbieranie.
     */
    naMapie: ujawniona && czyPuzzleUlozone(def.id) && !inneZadanieTrwa,
    /** Gra siedzi w zakładce od ułożenia obrazka — i tam zostaje. */
    wZakladce: odkryta,
    /**
     * Kafel w skrzyni jest, ale się nie odpala — bo trwa zdobywanie innej
     * gry. `wZakladce` zostaje prawdą: gra jest zdobyta i ma być widoczna,
     * inaczej dziecko pomyślałoby, że mu ją zabrano.
     */
    wstrzymanaZadaniem: odkryta && inneZadanieTrwa,
  };
}

/** Stany wszystkich misji, w kolejności z `MISJE`. */
export function stanMisji() {
  const zapis = czytaj();
  const etap = idEtapuPuzzli();
  return MISJE.map((def) => zStanu(def, zapis[def.id], etap));
}

/** Stan jednej misji (albo `null`, gdy takiej gry nie ma w łańcuchu). */
export function stanGry(id) {
  const def = misjaGry(id);
  if (!def) return null;
  return zStanu(def, czytaj()[id]);
}

/**
 * Misja, o której Wizkor mówi TERAZ: pierwsza nierozliczona. `null` = łańcuch
 * skończony, czyli czarodziej nie ma nowego zadania.
 */
export function aktualnaMisja() {
  return stanMisji().find((m) => !m.wyplacona) || null;
}

/** Misja z kafelkiem w HUD: pierwsza zlecona i nierozliczona. */
export function misjaWHudzie() {
  return stanMisji().find((m) => m.aktywna) || null;
}

/** Identyfikatory znaków, które mają stać na mapie. */
export function znakiNaMapie() {
  return stanMisji().filter((m) => m.naMapie).map((m) => m.def.znak);
}

/** Identyfikatory gier dostępnych w zakładce minigier. */
export function gryWZakladce() {
  return stanMisji().filter((m) => m.wZakladce).map((m) => m.id);
}

/**
 * Gra, którą dziecko TERAZ odblokowuje (etap puzzli), albo `null`. Skrzynia
 * z grami pyta o to, żeby wiedzieć, które kafle wygasić i czyim tytułem
 * wytłumaczyć blokadę.
 */
export function misjaOdblokowywana() {
  const id = idEtapuPuzzli();
  return id ? stanGry(id) : null;
}

/** Identyfikatory zdobytych gier, które na czas cudzego etapu puzzli milczą. */
export function gryWstrzymane() {
  return stanMisji().filter((m) => m.wstrzymanaZadaniem).map((m) => m.id);
}

function zmien(id, latka) {
  const def = misjaGry(id);
  if (!def) return null;
  const zapis = czytaj();
  const teraz = zapis[id] || {};
  const nowy = { ...teraz, ...latka };
  // Bez zmiany nie ma zapisu i nie ma zdarzenia — inaczej każde wejście
  // w zdobyty już znak przerysowywałoby hub bez powodu.
  const KLUCZE = ["ujawniona", "odkryta", "wygrana", "wyplacona", "wyplaconaUlozenie"];
  if (KLUCZE.every((k) => !!teraz[k] === !!nowy[k])) {
    return zStanu(def, teraz);
  }
  zapis[id] = nowy;
  zapisz(zapis);
  return zStanu(def, nowy);
}

/** Wizkor zleca misję: kawałki obrazka wchodzą na mapę, kafelek w HUD. */
export function ujawnij(id) {
  return zmien(id, { ujawniona: true });
}

/**
 * Układanka ułożona — gra ZDOBYTA. Od tej chwili siedzi w zakładce NA STAŁE
 * (także wtedy, gdy pierwszej partii dziecko nie skończy), a jej znak stoi na
 * polanie jako skrót. Ułożenie jest osobną nagrodą i nie może zależeć od
 * wyniku gry.
 *
 * Nazwa została z czasów, gdy grę odkrywało wbiegnięcie w znak — bo czynność
 * jest ta sama: „ta gra jest od teraz twoja".
 */
export function odkryj(id) {
  const teraz = stanGry(id);
  if (!teraz || !teraz.ujawniona) return null;   // misji nikt jeszcze nie zlecił
  return zmien(id, { odkryta: true });
}

/**
 * Wypłata za SAMO UŁOŻENIE obrazka. Osobna od wypłaty za partię, bo to dwa
 * różne wysiłki: zbieranie kawałków po polanie i rozegranie gry. Dziecko
 * dostaje za każdy z nich własny ekran wygranej, w chwili, w której naprawdę
 * coś zrobiło — czekanie z całą nagrodą do końca partii znaczyło, że kilka
 * minut zbierania nie miało na ekranie żadnego śladu.
 *
 * Idempotentna, dokładnie jak `odbierzNagrode`: powtórne wejście ani podwójne
 * kliknięcie w ekranie nagrody nie płacą drugi raz.
 */
export function odbierzNagrodeUlozenia(id) {
  const teraz = stanGry(id);
  if (!teraz || !teraz.odkryta || teraz.wyplaconaUlozenie) {
    return { stan: teraz, dodane: 0 };
  }
  const stan = zmien(id, { wyplaconaUlozenie: true });
  const ile = teraz.def.nagrodaUlozenie || 0;
  if (ile) dodajMonety(ile, `misja:${id}:ulozenie`);
  return { stan, dodane: ile };
}

/**
 * Rozegrana partia. Liczy się TYLKO dla gry zdobytej układanką — to jest
 * ten warunek, dla którego cały moduł istnieje. Zwraca `null`, gdy nie ma
 * czego zaliczać, więc gra wie, czy pokazywać jakąkolwiek reakcję.
 */
export function zaliczWygrana(id) {
  const teraz = stanGry(id);
  if (!teraz || !teraz.odkryta || teraz.wygrana || teraz.wyplacona) return null;
  return zmien(id, { wygrana: true });
}

/**
 * Wypłata. Idempotentna — podwójne kliknięcie w ekranie nagrody nie płaci
 * dwa razy.
 */
export function odbierzNagrode(id) {
  const teraz = stanGry(id);
  if (!teraz || !teraz.wygrana || teraz.wyplacona) {
    return { stan: teraz, dodane: 0 };
  }
  const stan = zmien(id, { wyplacona: true });
  dodajMonety(teraz.def.nagroda, `misja:${id}`);
  return { stan, dodane: teraz.def.nagroda };
}

/**
 * Domknięcie partii JEDNYM ruchem: zaliczenie wygranej i od razu wypłata.
 *
 * Wcześniej te dwa kroki dzieliło wyjście z gry — partia kończyła się
 * `zaliczWygrana`, a płacił dopiero hub, osobnym ekranem, po powrocie na mapę.
 * Dziecko oglądało wtedy TRZY ekrany pod rząd za jedną wygraną: celebrację
 * gry, jej podsumowanie i jeszcze nagrodę Wizkora — trzy razy to samo
 * „wygrałeś", z trzema przyciskami do przeklikania. Teraz gra zamyka misję
 * u siebie i pokazuje obie liczby na jednym ekranie.
 *
 * Zwraca `{ stan, dodane }`; `dodane` to 0, gdy nie było czego wypłacać
 * (gra bez misji, misja rozliczona wcześniej, układanka nieułożona) —
 * ekran wyniku pyta o to, zanim dopisze linijkę o Wizkorze.
 *
 * Ekran nagrody w hubie ZOSTAJE jako bezpiecznik: zapis sprzed tej zmiany
 * albo partia przerwana w pół wypłaty dalej domknie się po powrocie do świata.
 */
export function rozliczPartie(id) {
  zaliczWygrana(id);
  return odbierzNagrode(id);
}

/** Kasuje CAŁY łańcuch misji (bonus monet zostaje) — do testów z konsoli. */
export function skasujMisje() {
  try { localStorage.removeItem(KLUCZ); } catch {}
  try {
    window.dispatchEvent(new CustomEvent(ZDARZENIE_ZMIANY, { detail: { misje: stanMisji() } }));
  } catch {}
  return stanMisji();
}

export { bonusMonet };
