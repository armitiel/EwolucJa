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
    nagroda: 40,
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
    nagrodaEkran: {
      title: "Pamięć jak sowa!",
      subtitle: "Znalazłeś kartę Mędrca i dobrałeś wszystkie pary.",
    },
  },
  {
    id: "sekret-pod-puchem",
    znak: "leaf",
    tytul: "Sekret pod puchem",
    szukaj: "złote piórko",
    ikona: "/assets/piorka/piorko-zlote.png",
    nagroda: 50,
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
    nagrodaEkran: {
      title: "Bystre oko!",
      subtitle: "Znalazłeś złote piórko i odgadłeś sekret pod puchem.",
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

function zStanu(def, wpis) {
  const ujawniona = !!wpis?.ujawniona;
  const znaleziona = !!wpis?.znaleziona;
  const wygrana = !!wpis?.wygrana;
  const wyplacona = !!wpis?.wyplacona;
  return {
    id: def.id,
    def,
    ujawniona,
    znaleziona,
    wygrana,
    wyplacona,
    /** Kafelek w HUD ma stać, dopóki misja nie jest rozliczona. */
    aktywna: ujawniona && !wyplacona,
    /** Znak ma być na mapie od zlecenia i zostaje tam już na zawsze. */
    naMapie: ujawniona || znaleziona,
    /** Gra siedzi w zakładce dopiero od znalezienia — i tam zostaje. */
    wZakladce: znaleziona,
  };
}

/** Stany wszystkich misji, w kolejności z `MISJE`. */
export function stanMisji() {
  const zapis = czytaj();
  return MISJE.map((def) => zStanu(def, zapis[def.id]));
}

/** Stan jednej misji (albo `null`, gdy takiej gry nie ma w łańcuchu). */
export function stanGry(id) {
  const def = misjaGry(id);
  return def ? zStanu(def, czytaj()[id]) : null;
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
  if (["ujawniona", "znaleziona", "wygrana", "wyplacona"].every((k) => !!teraz[k] === !!nowy[k])) {
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
