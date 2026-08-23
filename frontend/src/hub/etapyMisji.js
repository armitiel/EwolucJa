/**
 * etapyMisji — CAŁY łańcuch Wizkora rozłożony na pojedyncze MOMENTY, po
 * których da się chodzić w przód i w tył.
 *
 * PO CO TO JEST. Zadania idą po kolei (gwiazdki → karta → piórko), ale stan
 * trzymają DWA niezależne zapisy w localStorage: licznik gwiazdek
 * (`zadanieGwiazdek`) i łańcuch gier (`misjeGier`). Każdy z nich da się
 * ustawić osobno, więc przy testowaniu bardzo łatwo zrobić zapis, którego
 * gra nigdy by sama nie wyprodukowała — na przykład piórko zlecone, zanim
 * karta została rozliczona. Wizkor mówi wtedy o karcie, a na mapie stoi
 * piórko i wygląda to dokładnie jak „Wizkor gubi kolejność misji".
 *
 * Dlatego etap NIE jest tu zbiorem przełączników, tylko jednym punktem na
 * osi. Wybranie etapu odbudowuje OBA zapisy od zera, tą samą drogą, którą
 * idzie gra: `rozpocznijZadanie` → `dolicz` → `odbierzNagrode` → `ujawnij` →
 * `zaliczUlozenie` → `odkryj` → `zaliczWygrana` → `odbierzNagrode`.
 * Skrótem przez localStorage
 * byłoby to testowanie samego skrótu, a nie gry — i pierwszy stan niemożliwy
 * w grze znów wyglądałby jak jej błąd.
 *
 * Efekt uboczny, który jest tu zaletą: bonus monet też się odbudowuje, bo
 * `skasujZadanie` go zeruje, a nagrody dolatują po drodze. Portfel zgadza się
 * z momentem, zamiast rosnąć przy każdym skoku.
 *
 * Lista etapów powstaje z `MISJE`, więc dopisanie trzeciej gry rozszerza ją
 * samo — bez jednej linijki tutaj.
 */
import {
  CEL_DOMYSLNY,
  NAGRODA_MONET,
  dolicz,
  odbierzNagrode as odbierzGwiazdki,
  rozpocznijZadanie,
  skasujZadanie,
  stanZadania,
} from "./zadanieGwiazdek.js";
import {
  skasujZadanie as skasujReal,
  stanZadania as stanReal,
  ustawStatus as ustawStatusReala,
  wyslijDowodDev,
  zlecZadanie as zlecReal,
  ZADANIA as ZADANIA_REALNE,
} from "./zadanieWizkora.js";
import {
  celPuzzli,
  doliczPuzel,
  rozpocznijZbieranie,
  skasujPuzzle,
  stanPuzzli,
  zaliczUlozenie,
} from "./puzzleGier.js";
import {
  MISJE,
  odbierzNagrode as odbierzNagrodeMisji,
  odkryj,
  skasujMisje,
  stanMisji,
  ujawnij,
  zaliczWygrana,
} from "./misjeGier.js";

/**
 * Stopnie jednej misji — ta sama kolejność, co w grze. Po zleceniu dziecko
 * zbiera kawałki obrazka („kawalki"), potem układa układankę („komplet" =
 * wszystkie zebrane, nieułożone), a ułożenie od razu daje grę („odkryta").
 *
 * Etapu „znak stoi na mapie i się go szuka" już nie ma — układanka wchodzi
 * wprost w minigrę (patrz nagłówek `misjeGier.js`).
 */
const FAZY = ["brak", "kawalki", "komplet", "odkryta", "wygrana"];

/**
 * Etapy gwiazdek. `zebrane: null` znaczy „zadania w ogóle nie ma", a nie
 * „zero zebranych" — to dwa różne stany i Wizkor mówi w nich co innego.
 */
function etapyGwiazdek() {
  return [
    {
      id: "pusto",
      tytul: "Pusto",
      opis: "Nic nie zaczęte. Wizkor zleca zbieranie gwiazdek.",
      zebrane: null,
      wyplacone: false,
      akcja: "start",
    },
    {
      id: "gwiazdki-start",
      tytul: `Gwiazdki 0/${CEL_DOMYSLNY}`,
      opis: "Zadanie przyjęte, licznik zapalony. Wizkor tylko przypomina.",
      zebrane: 0,
      wyplacone: false,
      akcja: null,
    },
    {
      id: "gwiazdki-prawie",
      tytul: `Gwiazdki ${CEL_DOMYSLNY - 1}/${CEL_DOMYSLNY}`,
      opis: "Brakuje jednej — moment na lot iskry do licznika i dźwięk nagrody.",
      zebrane: Math.max(0, CEL_DOMYSLNY - 1),
      wyplacone: false,
      akcja: null,
    },
    {
      id: "gwiazdki-komplet",
      tytul: `Gwiazdki ${CEL_DOMYSLNY}/${CEL_DOMYSLNY}, bez nagrody`,
      opis: `Komplet nierozliczony. Ekran wygranej (${NAGRODA_MONET} monet) ma wejść sam.`,
      zebrane: CEL_DOMYSLNY,
      wyplacone: false,
      akcja: "nagroda",
    },
  ];
}

/** Pięć momentów jednej misji z grą, w kolejności jej życia. */
function etapyMisji(def, idx) {
  const kawalkow = celPuzzli(def.id);
  return [
    {
      id: `${def.id}:brak`,
      tytul: `${def.tytul} — do zlecenia`,
      opis: `Gwiazdki rozliczone. Wizkor zleca zbieranie kawałków obrazka. Na mapie nie ma jeszcze niczego z tej misji.`,
      misja: idx,
      faza: "brak",
      akcja: `zlec:${def.id}`,
    },
    {
      id: `${def.id}:kawalki`,
      tytul: `${def.tytul} — kawałki puzzli`,
      opis: `Misja zlecona: ${kawalkow} kawałków obrazka rozsypanych po mapie (licznik w HUD). Znaku „${def.znak}" jeszcze nie ma — wejdzie na stałe po ułożeniu.`,
      misja: idx,
      faza: "kawalki",
      akcja: null,
    },
    {
      id: `${def.id}:komplet`,
      tytul: `${def.tytul} — układanka`,
      opis: "Wszystkie kawałki zebrane, układanka nieułożona. Kwestia Wizkora prowadzi do niej przyciskiem „Układam!”.",
      misja: idx,
      faza: "komplet",
      akcja: `ukladanka:${def.id}`,
    },
    {
      id: `${def.id}:odkryta`,
      tytul: `${def.tytul} — gra zdobyta`,
      opis: `Puzzle ułożone: gra siedzi w zakładce, znak „${def.znak}" stoi na mapie jako skrót. Partia jeszcze nierozegrana.`,
      misja: idx,
      faza: "odkryta",
      akcja: null,
    },
    {
      id: `${def.id}:wygrana`,
      tytul: `${def.tytul} — do wypłaty`,
      opis: `Partia rozegrana. Czeka ekran wygranej i ${def.nagroda} monet.`,
      misja: idx,
      faza: "wygrana",
      akcja: `naplac:${def.id}`,
    },
  ];
}

/**
 * Wszystkie momenty łańcucha, po kolei. Każdy ma `akcja` — czego oczekujemy
 * po zielonym przycisku Wizkora. To pole nie steruje niczym w grze; służy
 * do PORÓWNANIA z tym, co naprawdę wybierze `powitanieCzarodzieja`, więc
 * rozjazd między osią a kwestią widać od razu, bez czytania kodu.
 */
/**
 * ZADANIE W REALU — ostatni odcinek łańcucha, po rozliczeniu wszystkich gier.
 * Tu Wizkor przestaje przydzielać i zaprasza do KOŁA PRZEZNACZENIA: koło
 * losuje cechę awatara, cecha wybiera zadanie poza ekranem, a rozliczenie
 * tę cechę wzmacnia. Oś kończyła się wcześniej na „łańcuch skończony", więc
 * cały ten odcinek był poza zasięgiem pulpitu — a przy okazji wyglądał jak
 * rozjazd, bo oś obiecywała `null`, a Wizkor mówił „Kręcę kołem!".
 *
 * `real` to etap tego odcinka; `misja: MISJE.length` znaczy „wszystkie gry
 * rozliczone" i buduje je w komplecie (patrz `zastosujEtap`).
 */
function etapyReala() {
  const wspolne = { misja: MISJE.length, faza: "brak" };
  return [
    {
      ...wspolne,
      id: "real:kolo",
      real: "brak",
      tytul: "Zadanie w realu — koło",
      opis: "Gry rozliczone, zadania jeszcze nie ma. Wizkor wynosi koło przeznaczenia wprost z rozmowy.",
      akcja: "otworzZadanie",
    },
    {
      ...wspolne,
      id: "real:doZrobienia",
      real: "zlecone",
      tytul: "Zadanie w realu — do zrobienia",
      opis: "Koło wylosowało cechę, zadanie leży w zakładce Zadania. Wizkor tylko przypomina.",
      akcja: "otworzZadanie",
    },
    {
      ...wspolne,
      id: "real:czeka",
      real: "wyslane",
      tytul: "Zadanie w realu — u Mentora",
      opis: "Dowód wysłany, werdyktu jeszcze nie ma. Wizkor mówi „baw się dalej”.",
      akcja: null,
    },
    {
      ...wspolne,
      id: "real:doOdbioru",
      real: "zatwierdzone",
      tytul: "Zadanie w realu — nagroda",
      opis: "Mentor przyjął. Zostaje odbiór nagrody i wzmocnienie wylosowanej cechy.",
      akcja: "otworzZadanie",
    },
  ];
}

/**
 * Wszystkie momenty łańcucha, po kolei. Każdy ma `akcja` — czego oczekujemy
 * po zielonym przycisku Wizkora. To pole nie steruje niczym w grze; służy
 * do PORÓWNANIA z tym, co naprawdę wybierze `powitanieCzarodzieja`, więc
 * rozjazd między osią a kwestią widać od razu, bez czytania kodu.
 */
export const ETAPY = [
  ...etapyGwiazdek(),
  ...MISJE.flatMap((def, idx) => etapyMisji(def, idx)),
  ...etapyReala(),
];

/** Numer pierwszego etapu z grami — reszta osi liczy się od niego. */
const PIERWSZA_GRA = etapyGwiazdek().length;
/** Numer pierwszego etapu zadania w realu (tuż za ostatnią misją). */
const PIERWSZY_REAL = PIERWSZA_GRA + MISJE.length * FAZY.length;

/** Stopień jednej misji jako liczba, żeby dało się porównywać kolejność. */
function stopien(m) {
  if (m.wyplacona) return 5;
  if (m.wygrana) return 4;
  if (m.odkryta) return 3;
  if (m.ujawniona) {
    // Etap puzzli mieści się między zleceniem a grą: najpierw kawałki po
    // mapie, potem układanka (patrz FAZY). Ułożona układanka bez `odkryta`
    // to zapis sprzed zmiany albo gra bez bramy — liczy się jak zdobyta.
    const puzzle = stanPuzzli(m.id);
    if (puzzle.brama && !puzzle.ulozona) return puzzle.komplet ? 2 : 1;
    return 3;
  }
  return 0;
}

/**
 * Etap, na którym stoi bieżący zapis. Nie musi być trafiony co do gwiazdki:
 * licznik 3/10 leży „w środku" etapu zbierania i dostaje jego numer, bo
 * z punktu widzenia Wizkora to ten sam moment.
 */
export function etapBiezacy() {
  const z = stanZadania();
  if (!z.istnieje) return 0;
  if (!z.spelnione) return z.zebrane >= CEL_DOMYSLNY - 1 ? 2 : 1;
  if (!z.wyplacone) return 3;

  const misje = stanMisji();
  const idx = misje.findIndex((m) => !m.wyplacona);
  if (idx >= 0) {
    const faza = Math.min(stopien(misje[idx]), FAZY.length - 1);
    return PIERWSZA_GRA + idx * FAZY.length + faza;
  }

  // Gry rozliczone → odcinek zadania w realu. Numer bierzemy ze STATUSU
  // zadania, nie z licznika: to jedyny stan, który tu jeszcze się zmienia.
  const real = stanReal();
  if (!real.istnieje || real.wyplacone) return PIERWSZY_REAL;
  if (real.doOdbioru) return PIERWSZY_REAL + 3;
  if (real.czeka) return PIERWSZY_REAL + 2;
  return PIERWSZY_REAL + 1;
}

/**
 * Czy zapis w ogóle trzyma się kolejności. Zwraca `null`, gdy wszystko gra,
 * albo zdanie mówiące, CO wyprzedziło swoją kolej — bo „coś się rozjechało"
 * nie jest informacją, z którą da się cokolwiek zrobić.
 */
export function zlamanaKolejnosc() {
  const z = stanZadania();
  const misje = stanMisji();
  const ruszone = misje.filter((m) => stopien(m) > 0);

  if (ruszone.length && !z.wyplacone) {
    return `„${ruszone[0].def.tytul}" ruszyła, choć gwiazdki nie są rozliczone.`;
  }
  for (let i = 1; i < misje.length; i += 1) {
    if (stopien(misje[i]) > 0 && stopien(misje[i - 1]) < 5) {
      return `„${misje[i].def.tytul}" ruszyła przed rozliczeniem „${misje[i - 1].def.tytul}".`;
    }
  }
  return null;
}

/**
 * Ustawienie świata na wybrany moment. Buduje stan OD ZERA, tą samą drogą,
 * którą idzie gra — patrz nagłówek pliku.
 */
export function zastosujEtap(nr) {
  const etap = ETAPY[Math.max(0, Math.min(ETAPY.length - 1, Number(nr) || 0))];
  if (!etap) return null;

  // Kasujemy OBA zapisy, zanim cokolwiek ustawimy. Bez tego skok w tył
  // zostawiałby ogon poprzedniego stanu — a to jest dokładnie ta klasa
  // zapisów, dla których ten plik powstał.
  skasujZadanie();
  skasujMisje();
  skasujPuzzle();

  // Etapy z grami nie powtarzają w kółko „gwiazdki: komplet, rozliczone" —
  // to warunek WEJŚCIA do łańcucha gier i wynika z samego faktu, że etap
  // dotyczy misji. Zapisany przy każdej z nich z osobna rozjechałby się przy
  // pierwszej zmianie celu.
  const zebrane = "zebrane" in etap ? etap.zebrane : CEL_DOMYSLNY;
  const wyplacone = "wyplacone" in etap ? etap.wyplacone : true;

  if (zebrane === null) return etap;

  rozpocznijZadanie(CEL_DOMYSLNY);
  for (let i = 0; i < zebrane; i += 1) dolicz();
  if (!wyplacone) return etap;

  odbierzGwiazdki(NAGRODA_MONET);

  /**
   * Stan puzzli misji budowany TĄ SAMĄ drogą, którą idzie gra:
   * rozpocznij → dolicz kawałek po kawałku → ułóż. `"kawalki"` zostawia
   * połowę w trawie, żeby licznik w HUD miał co pokazywać.
   */
  const zbudujPuzzle = (id, faza) => {
    const cel = celPuzzli(id);
    if (!cel) return;
    rozpocznijZbieranie(id);
    const ile = faza === "kawalki" ? Math.floor(cel / 2) : cel;
    for (let i = 1; i <= ile; i += 1) doliczPuzel(`puzel-${i}`);
    if (faza !== "kawalki" && faza !== "komplet") zaliczUlozenie(id);
  };

  const docelowa = typeof etap.misja === "number" ? etap.misja : MISJE.length;
  for (let k = 0; k < MISJE.length && k <= docelowa; k += 1) {
    const id = MISJE[k].id;
    const faza = k < docelowa ? "pelna" : etap.faza;
    if (faza === "brak") break;
    ujawnij(id);
    zbudujPuzzle(id, faza);
    if (faza === "kawalki" || faza === "komplet") break;
    odkryj(id);
    if (faza === "odkryta") break;
    zaliczWygrana(id);
    if (faza === "wygrana") break;
    odbierzNagrodeMisji(id);
  }

  /**
   * ODCINEK ZADANIA W REALU. Budowany tą samą drogą, co reszta osi: zlecenie
   * → dowód → werdykt. Dowód idzie ścieżką dev (`wyslijDowodDev`), bo
   * prawdziwa wymaga sieci i gracza, a pulpit ma działać bez obu.
   *
   * Zadanie kasujemy TU, a nie przy każdym etapie: skok na dowolny moment
   * łańcucha gier zostawia zadanie poza ekranem nietknięte — dziecko może
   * je mieć naprawdę zaczęte, a pulpit nie ma powodu tego niszczyć.
   */
  if (etap.real) {
    skasujReal();
    if (etap.real !== "brak") {
      zlecReal(ZADANIA_REALNE[0]?.id);
      if (etap.real !== "zlecone") {
        wyslijDowodDev({ opis: "DEV: dowód z osi etapów" });
        if (etap.real !== "wyslane") ustawStatusReala(etap.real, "DEV: werdykt z osi etapów");
      }
    }
  }
  return etap;
}

/** Skok o jeden moment w przód albo w tył. Oś nie zawija się na końcach. */
export function przesunEtap(o) {
  return zastosujEtap(etapBiezacy() + o);
}
