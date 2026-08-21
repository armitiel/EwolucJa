/**
 * misjeGier — łańcuch zadań Wizkora, w których dziecko ODKRYWA minigry.
 *
 * DLACZEGO TO ISTNIEJE. Gry nie mają być listą, którą widać od pierwszego
 * wejścia. Mają być znaleziskiem: Wizkor mówi, że coś leży w trawie, dziecko
 * biegnie tego szukać, wbiega w znak — i dopiero wtedy gra jest jego, na
 * stałe. Dlatego jeden moduł trzyma OBIE rzeczy naraz: postęp zadania
 * i odkrycie gry. Trzymane osobno rozjechałyby się przy pierwszej poprawce
 * (zadanie skończone, a gra dalej niedostępna albo odwrotnie).
 *
 * ŻYCIE JEDNEJ MISJI — cztery kroki, każdy widoczny w innym miejscu:
 *
 *   1. ukryta        znaku NIE MA na mapie, gry nie ma w zakładce
 *   2. ujawniona     Wizkor zlecił — znak pojawia się na mapie
 *   3. znaleziona    dziecko wbiegło w znak — gra ląduje w zakładce NA STAŁE,
 *                    a znak zostaje na mapie jako skrót do niej
 *   4. wygrana       partia rozegrana do końca → Wizkor płaci (`wyplacona`)
 *
 * Kolejność ma znaczenie: `zaliczWygrana` nie ruszy zadania, którego znak
 * nie został znaleziony. To jest cała zasada „najpierw znajdź na mapie".
 * Dzięki temu nie potrzeba żadnej ulotnej flagi „wszedłem z mapy" — samo
 * `znaleziona` jest dowodem, a przy okazji przeżywa zamknięcie apki.
 *
 * Misje idą PO KOLEI, w porządku z `MISJE`. Wizkor zawsze mówi o pierwszej
 * nierozliczonej — dziecko ma na ekranie jeden cel, a nie listę zadań.
 *
 * Nagrody lądują w lokalnym bonusie monet (`services/monety.js`), bo backend
 * nadal nie ma końcówki „dodaj graczowi N monet" — ten dług opisuje
 * `zadanieGwiazdek.js`.
 */
import { bonusMonet, dodajMonety } from "../services/monety.js";

const KLUCZ = "ewolucja.misje.gier";

/** Zdarzenie dla huba i zakładki gier: „stan się zmienił, przeczytaj od nowa". */
export const ZDARZENIE_ZMIANY = "ewolucja:misjeGierZmiana";

/**
 * Definicje misji. `id` to identyfikator gry z `hub/data/minigry.v1.json`
 * (jedno słownictwo dla katalogu, adresu i mapy), `znak` — identyfikator
 * znaku w scenie 3D z `public/scena-3d/mapa.json`.
 *
 * `leaf` przy piórku to identyfikator historyczny: model pod nim to dziś
 * piórko, nie liść. Nie zmieniam go, bo siedzi w bundlu sceny i w mapie.
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
    tytul: "Pamięć Mędrca",
    szukaj: "kartę Mędrca",
    ikona: "/assets/karty/rewers-3d.png",
    // Ksztalt ikony w HUD-zie: karta to prostokat 2:3 (dostaje wezsze
    // pudelko i zaokraglone rogi), zeton to kwadrat. Bez tego HUD musialby
    // zgadywac proporcje z nazwy pliku.
    ksztaltIkony: "karta",
    /* NAGRODA JEST ROZBITA NA DWIE. Znalezienie znaku na mapie to osobne
       osiagniecie i od teraz ma wlasny ekran wygranej - dziecko biega po
       polanie przez kilka minut i to bieganie musi sie oplacic samo w sobie,
       niezaleznie od tego, czy zaraz zagra. Druga czesc placi Wizkor za
       rozegrana partie. Suma zostaje ta sama, co przed rozbiciem (40). */
    nagrodaZnalezienie: 15,
    nagroda: 25,
    zlecenie: {
      tekst:
        "Masz oko do gwiazdek, wędrowcze. Teraz coś trudniejszego: " +
        "gdzieś na mapie leży karta Mędrca. Znajdź ją i zagraj w Pamięć " +
        "Mędrca — pokaż, że pamiętasz.",
      wyroznienie: "karta Mędrca",
      przycisk: "Szukam karty!",
    },
    szukanie: {
      tekst:
        "Karta leży gdzieś na polanie i mruga do ciebie złotem. " +
        "Wbiegnij w nią, a rozłoży się stół pełen par.",
      wyroznienie: "gdzieś na polanie",
      przycisk: "Szukam dalej!",
    },
    granie: {
      tekst:
        "Karta jest twoja — masz ją już w skrzyni z grami i na mapie. " +
        "Zostało najtrudniejsze: dobierz wszystkie pary.",
      wyroznienie: "w skrzyni z grami",
      przycisk: "Gram dalej!",
    },
    wyplata: {
      tekst:
        "Widziałem każdą parę, którą odkryłeś. Pamięć masz jak sowa — " +
        "należy ci się {nagroda} monet.",
      wyroznienie: "{nagroda} monet",
      przycisk: "Odbieram nagrodę!",
    },
    nagrodaEkranZnalezienie: {
      title: "Karta znaleziona!",
      subtitle: "Rewers Mędrca leżał w trawie. Od teraz czeka w skrzyni z grami.",
    },
    nagrodaEkran: {
      title: "Pamięć jak sowa!",
      subtitle: "Dobrałeś wszystkie pary z karty Mędrca.",
    },
  },
  {
    id: "sekret-pod-puchem",
    znak: "leaf",
    tytul: "Sekret pod puchem",
    szukaj: "złote piórko",
    ikona: "/assets/piorka/piorko-zlote.png",
    ksztaltIkony: "zeton",
    /* Ten sam podzial co przy karcie — jedna zasada dla calego lancucha.
       Suma bez zmian (50). */
    nagrodaZnalezienie: 20,
    nagroda: 30,
    zlecenie: {
      tekst:
        "Zostało jeszcze jedno. W trawie leży złote piórko, a pod nim " +
        "kopiec puchu — coś się tam ukrywa. Znajdź piórko i odgadnij, " +
        "co śpi pod spodem.",
      wyroznienie: "złote piórko",
      przycisk: "Szukam piórka!",
    },
    szukanie: {
      tekst:
        "Piórko jest lekkie i lubi się chować. Rozejrzyj się po polanie — " +
        "złoty błysk w trawie to właśnie ono.",
      wyroznienie: "złoty błysk w trawie",
      przycisk: "Szukam dalej!",
    },
    granie: {
      tekst:
        "Piórko masz. Teraz rozgarnij puch i zgadnij, co pod nim śpi — " +
        "im mniej odsłonisz, tym bystrzejsze oko.",
      wyroznienie: "im mniej odsłonisz",
      przycisk: "Gram dalej!",
    },
    wyplata: {
      tekst:
        "Odgadłeś, ledwo muskając puch. To rzadka bystrość, wędrowcze — " +
        "{nagroda} monet jest twoje.",
      wyroznienie: "{nagroda} monet",
      przycisk: "Odbieram nagrodę!",
    },
    nagrodaEkranZnalezienie: {
      title: "Złote piórko!",
      subtitle: "Leżało w trawie, a pod nim kopiec puchu. Gra czeka w skrzyni.",
    },
    nagrodaEkran: {
      title: "Bystre oko!",
      subtitle: "Odgadłeś sekret, który spał pod puchem.",
    },
  },
  {
    id: "lot-liska",
    /* Znak tej misji to DRZEWO, nie leżący przedmiot. Sosna widać z drugiego
       końca polany, więc dziecko nie szuka jej po trawie — idzie prosto do
       niej. To celowe: trzecia misja z rzędu polegająca na wypatrywaniu
       drobiazgu w trawie byłaby tym samym zadaniem trzeci raz.
       Sam znak jest budowany z generatora sceny (`file: "drzewo"` w mapa.json),
       bo pliku `drzewo.glb` nie ma — patrz patch `loadGLB` w bundlu. */
    znak: "drzewo-lotu",
    /* Sosna miała tu kiedyś `zostajeNaMapie: true` — była JEDYNYM znakiem,
       który przeżywał rozliczenie misji, bo jako drzewo nie czytała się jako
       „zbierz mnie". Flaga zniknęła, gdy zasada stała się ogólna: po
       rozliczeniu WSZYSTKICH misji na polanę wracają wszystkie zdobyte znaki
       (patrz `naMapie`), a w trakcie polowania chowają się wszystkie, łącznie
       z sosną. Jeden wyjątek mniej. */
    /* Bez kafelka „0/1" w HUD. Przy karcie i piórku licznik ma sens: znak
       leży gdzieś w trawie i kafelek przypomina, ŻE się go szuka. Sosnę widać
       z drugiego końca polany i wystarczy do niej podbiec — licznik nie niesie
       wtedy żadnej informacji, tylko zajmuje górę ekranu. */
    bezLicznikaHud: true,
    tytul: "Lot Liska",
    szukaj: "wysoką sosnę",
    // Ikona zadania to CHOINKA, a nie lisek: kafelek w HUD ma 30 px i mowi,
    // CZEGO SIE SZUKA na mapie ("wysoka sosne"), a nie kto szuka. Lisek w tym
    // rozmiarze byl pomaranczowa plamka - kazde zadanie wygladalo tak samo.
    ikona: "/assets/minigry/choinka.png",
    ksztaltIkony: "zeton",
    /* Ten sam podział co wyżej, suma 55 — lot jest ostatnią i najdłuższą
       z trzech gier, więc dostaje odrobinę więcej niż piórko. */
    nagrodaZnalezienie: 20,
    nagroda: 35,
    zlecenie: {
      tekst:
        "Widzisz tę wysoką sosnę na polanie? Z jej czubka widać cały las. " +
        "Wespnij się na nią, a potem skocz — zobaczymy, jak daleko dolecisz.",
      wyroznienie: "wysoką sosnę",
      przycisk: "Wchodzę na sosnę!",
    },
    szukanie: {
      tekst:
        "Sosna jest najwyższa na polanie, nie da się jej przeoczyć. " +
        "Podbiegnij do niej, a reszta pójdzie sama.",
      wyroznienie: "najwyższa na polanie",
      przycisk: "Już biegnę!",
    },
    granie: {
      tekst:
        "Jesteś na górze. Odbij się w dobrym momencie i łap wiatr — " +
        "im dłużej lecisz, tym więcej po drodze zbierzesz.",
      wyroznienie: "łap wiatr",
      przycisk: "Lecę!",
    },
    wyplata: {
      tekst:
        "Widziałem ten lot z ziemi, wędrowcze. Kawał drogi. " +
        "{nagroda} monet — należą ci się.",
      wyroznienie: "{nagroda} monet",
      przycisk: "Odbieram nagrodę!",
    },
    nagrodaEkranZnalezienie: {
      title: "Sosna znaleziona!",
      subtitle: "Najwyższa na polanie. Od teraz startujesz z niej, kiedy chcesz.",
    },
    nagrodaEkran: {
      title: "Ale lot!",
      subtitle: "Złapałeś wiatr i poleciałeś dalej, niż sięga polana.",
    },
  },
  {
    id: "bieg-liska",
    /* Znak tej misji to BUCIK (`assets/but.glb`) — zgubiony but do biegania,
       leżący w trawie. Wracamy więc do schematu karty i piórka: przedmiot,
       który się ZNAJDUJE i podnosi, a nie miejsce, do którego się podchodzi.
       Dzięki temu i wchłanianie, i ekran znalezienia działają tu tak samo jak
       w dwóch pierwszych misjach — bez wyjątków w kodzie sceny. */
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
       i najdłuższy (pięć zadań na trasie), więc płaci najwięcej.
       Za samo znalezienie bucika płacimy najhojniej z całego łańcucha (25):
       jest najmniejszy ze wszystkich znaków, więc i szuka się go najdłużej. */
    nagrodaZnalezienie: 25,
    nagroda: 40,
    zlecenie: {
      tekst:
        "Zostało ostatnie, wędrowcze. Ktoś zgubił na polanie bucik do " +
        "biegania — mały, żółty, łatwo go przeoczyć. Znajdź go, a pokażę ci " +
        "trasę, na której liczy się w biegu.",
      wyroznienie: "bucik do biegania",
      przycisk: "Szukam bucika!",
    },
    szukanie: {
      tekst:
        "Bucik jest mniejszy niż karta i niż piórko — leży gdzieś nisko " +
        "w trawie. Szukaj żółtej plamki i wbiegnij prosto w nią.",
      wyroznienie: "żółtej plamki",
      przycisk: "Szukam dalej!",
    },
    granie: {
      tekst:
        "Bucik masz, więc trasa stoi otworem. Biegnij i licz w biegu — " +
        "bramki nie czekają, aż się zastanowisz.",
      wyroznienie: "licz w biegu",
      przycisk: "Biegnę!",
    },
    wyplata: {
      tekst:
        "Przebiegłeś całą trasę i jeszcze liczyłeś po drodze. Głowa i nogi " +
        "naraz — to rzadkie. {nagroda} monet jest twoje.",
      wyroznienie: "{nagroda} monet",
      przycisk: "Odbieram nagrodę!",
    },
    nagrodaEkranZnalezienie: {
      title: "Bucik znaleziony!",
      subtitle: "Leżał w trawie, mały i żółty. Trasa czeka w skrzyni z grami.",
    },
    nagrodaEkran: {
      title: "Głowa i nogi!",
      subtitle: "Przebiegłeś całą trasę, licząc na każdej bramce.",
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
 * Czy trwa POLOWANIE: jest misja zlecona i jeszcze nierozliczona, czyli
 * dziecko szuka teraz nowej gry albo dopiero ma ją przejść pierwszy raz.
 * To jedyny stan, w którym mapa musi mówić o JEDNEJ rzeczy.
 */
function czyPolowanie(zapis) {
  return MISJE.some((def) => {
    const w = zapis[def.id];
    return !!w?.ujawniona && !w?.wyplacona;
  });
}

function zStanu(def, wpis, polowanie) {
  const ujawniona = !!wpis?.ujawniona;
  const znaleziona = !!wpis?.znaleziona;
  const wygrana = !!wpis?.wygrana;
  const wyplacona = !!wpis?.wyplacona;
  const wyplaconaZnalezienie = !!wpis?.wyplaconaZnalezienie;
  return {
    id: def.id,
    def,
    ujawniona,
    znaleziona,
    wygrana,
    wyplacona,
    /** Czy zaplacilismy juz za SAMO znalezienie znaku na mapie. */
    wyplaconaZnalezienie,
    /** Znak znaleziony, a nagroda za znalezienie jeszcze nieodebrana. */
    doNagrodyZaZnalezienie: znaleziona && !wyplaconaZnalezienie,
    /** Kafelek w HUD ma stać, dopóki misja nie jest rozliczona. */
    aktywna: ujawniona && !wyplacona,
    /**
     * CO STOI NA MAPIE — zależy od tego, czy trwa polowanie.
     *
     *   polowanie (misja zlecona, gra jeszcze nieprzeszła):
     *       na mapie stoi TYLKO jej znak, reszta skrótów się chowa,
     *   spokój (wszystko rozliczone):
     *       wracają WSZYSTKIE zdobyte znaki jako stałe skróty do gier.
     *
     * Dwie zasady w jednym warunku, bo to jedna decyzja. Kiedy dziecko czegoś
     * szuka, mapa ma mówić o jednej rzeczy — inaczej przestaje znaczyć „tego
     * szukasz", a zaczyna „tu coś jest", i cel ginie wśród pamiątek. Kiedy nie
     * szuka niczego, nie ma czego chronić: polana może być wtedy tym, czym
     * powinna — miejscem, z którego wchodzi się do każdej zdobytej gry.
     *
     * Wcześniej znak znikał po rozliczeniu NA ZAWSZE (poza wyjątkiem
     * `zostajeNaMapie` dla sosny). Skrót do przejętej gry przepadał, choć nic
     * już nie zaciemniał — bo w spokoju nie ma celu, z którym mógłby
     * konkurować. Wyjątek zniknął razem z regułą, która go wymuszała.
     */
    naMapie: ujawniona && (polowanie ? !wyplacona : true),
    /** Gra siedzi w zakładce dopiero od znalezienia — i tam zostaje. */
    wZakladce: znaleziona,
  };
}

/** Stany wszystkich misji, w kolejności z `MISJE`. */
export function stanMisji() {
  const zapis = czytaj();
  // `polowanie` liczymy RAZ, z całego zapisu: `naMapie` jednej misji zależy od
  // tego, czy któraś INNA jest w toku, więc nie da się go policzyć z samego
  // wpisu. To jedyne pole w tym module, które patrzy poza swoją misję.
  const polowanie = czyPolowanie(zapis);
  return MISJE.map((def) => zStanu(def, zapis[def.id], polowanie));
}

/** Stan jednej misji (albo `null`, gdy takiej gry nie ma w łańcuchu). */
export function stanGry(id) {
  const def = misjaGry(id);
  if (!def) return null;
  const zapis = czytaj();
  return zStanu(def, zapis[id], czyPolowanie(zapis));
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

function zmien(id, latka) {
  const def = misjaGry(id);
  if (!def) return null;
  const zapis = czytaj();
  const teraz = zapis[id] || {};
  const nowy = { ...teraz, ...latka };
  // Bez zmiany nie ma zapisu i nie ma zdarzenia — inaczej każde wejście
  // w znaleziony już znak przerysowywałoby hub bez powodu.
  const KLUCZE = ["ujawniona", "znaleziona", "wygrana", "wyplacona", "wyplaconaZnalezienie"];
  if (KLUCZE.every((k) => !!teraz[k] === !!nowy[k])) {
    return zStanu(def, teraz);
  }
  zapis[id] = nowy;
  zapisz(zapis);
  return zStanu(def, nowy);
}

/** Wizkor zleca misję: znak wchodzi na mapę, kafelek zapala się w HUD. */
export function ujawnij(id) {
  return zmien(id, { ujawniona: true });
}

/**
 * Dziecko wbiegło w znak. Od tej chwili gra jest w zakładce NA STAŁE — także
 * wtedy, gdy partii nie skończy. Znalezienie jest tu osobną nagrodą i nie
 * może zależeć od wyniku.
 */
export function odkryj(id) {
  const teraz = stanGry(id);
  if (!teraz || !teraz.ujawniona) return null;   // znaku i tak nie ma na mapie
  return zmien(id, { znaleziona: true });
}

/**
 * Wypłata za SAMO ZNALEZIENIE znaku. Osobna od wypłaty za partię, bo to dwa
 * różne wysiłki: bieganie po polanie i rozegranie gry. Dziecko dostaje za
 * każdy z nich własny ekran wygranej, w chwili, w której naprawdę coś
 * zrobiło — czekanie z całą nagrodą do końca partii znaczyło, że kilka minut
 * szukania nie miało na ekranie żadnego śladu.
 *
 * Idempotentna, dokładnie jak `odbierzNagrode`: powrót do znalezionego już
 * znaku ani podwójne kliknięcie w ekranie nagrody nie płacą drugi raz.
 */
export function odbierzNagrodeZnalezienia(id) {
  const teraz = stanGry(id);
  if (!teraz || !teraz.znaleziona || teraz.wyplaconaZnalezienie) {
    return { stan: teraz, dodane: 0 };
  }
  const stan = zmien(id, { wyplaconaZnalezienie: true });
  const ile = teraz.def.nagrodaZnalezienie || 0;
  if (ile) dodajMonety(ile, `misja:${id}:znalezienie`);
  return { stan, dodane: ile };
}

/**
 * Rozegrana partia. Liczy się TYLKO dla gry znalezionej na mapie — to jest
 * ten warunek, dla którego cały moduł istnieje. Zwraca `null`, gdy nie ma
 * czego zaliczać, więc gra wie, czy pokazywać jakąkolwiek reakcję.
 */
export function zaliczWygrana(id) {
  const teraz = stanGry(id);
  if (!teraz || !teraz.znaleziona || teraz.wygrana || teraz.wyplacona) return null;
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
 * (gra bez misji, misja rozliczona wcześniej, znak nieznaleziony na mapie) —
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
