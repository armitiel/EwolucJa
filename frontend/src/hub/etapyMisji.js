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
 * `odkryj` → `zaliczWygrana` → `odbierzNagrode`. Skrótem przez localStorage
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
 * Stopnie jednej misji — ta sama kolejność, co w grze. Od wprowadzenia bramy
 * z puzzli misja ma DWA stopnie więcej: po zleceniu dziecko najpierw zbiera
 * kawałki obrazka („kawalki"), potem układa układankę („komplet" = wszystkie
 * zebrane, nieułożone). Dopiero „zlecona" znaczy to, co dawniej: znak gry
 * stoi na mapie i się go szuka.
 */
const FAZY = ["brak", "kawalki", "komplet", "zlecona", "znaleziona", "wygrana"];

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

/** Sześć momentów jednej misji z grą, w kolejności jej życia. */
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
      opis: `Misja zlecona: ${kawalkow} kawałków obrazka rozsypanych po mapie (licznik w HUD). Znaku „${def.znak}" jeszcze nie ma — wejdzie po ułożeniu.`,
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
      id: `${def.id}:zlecona`,
      tytul: `${def.tytul} — szukanie`,
      opis: `Puzzle ułożone: znak „${def.znak}" stoi na mapie, gry nie ma jeszcze w zakładce.`,
      misja: idx,
      faza: "zlecona",
      akcja: null,
    },
    {
      id: `${def.id}:znaleziona`,
      tytul: `${def.tytul} — gra odkryta`,
      opis: "Znak dotknięty, gra siedzi w zakładce. Partia jeszcze nierozegrana.",
      misja: idx,
      faza: "znaleziona",
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
export const ETAPY = [
  ...etapyGwiazdek(),
  ...MISJE.flatMap((def, idx) => etapyMisji(def, idx)),
  {
    id: "koniec",
    tytul: "Łańcuch skończony",
    opis: "Wszystko rozliczone. Wizkor nie ma nowego zadania.",
    misja: MISJE.length,
    faza: "brak",
    akcja: null,
  },
];

/** Numer pierwszego etapu z grami — reszta osi liczy się od niego. */
const PIERWSZA_GRA = etapyGwiazdek().length;

/** Stopień jednej misji jako liczba, żeby dało się porównywać kolejność. */
function stopien(m) {
  if (m.wyplacona) return 6;
  if (m.wygrana) return 5;
  if (m.znaleziona) return 4;
  if (m.ujawniona) {
    // Etap puzzli mieści się między zleceniem a szukaniem znaku: najpierw
    // kawałki po mapie, potem układanka, dopiero potem znak (patrz FAZY).
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
  if (idx < 0) return ETAPY.length - 1;
  const faza = Math.min(stopien(misje[idx]), FAZY.length - 1);
  return PIERWSZA_GRA + idx * FAZY.length + faza;
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
    if (stopien(misje[i]) > 0 && stopien(misje[i - 1]) < 6) {
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
    if (faza === "kawalki" || faza === "komplet" || faza === "zlecona") break;
    odkryj(id);
    if (faza === "znaleziona") break;
    zaliczWygrana(id);
    if (faza === "wygrana") break;
    odbierzNagrodeMisji(id);
  }
  return etap;
}

/** Skok o jeden moment w przód albo w tył. Oś nie zawija się na końcach. */
export function przesunEtap(o) {
  return zastosujEtap(etapBiezacy() + o);
}
