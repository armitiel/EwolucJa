/**
 * zadanieGwiazdek — licznik pierwszego zadania od czarodzieja i jego nagroda.
 *
 * Dlaczego localStorage, a nie baza: dziecko zamyka apkę w połowie zbierania
 * i wraca po godzinie. Licznik trzymany w pamięci komponentu kasowałby się
 * przy każdym odświeżeniu, a to jest ZADANIE — ma trwać.
 *
 * Nagroda też siedzi lokalnie i to jest świadomy DŁUG, nie docelowy kształt.
 * Backend nie ma dziś końcówki „dodaj graczowi monety" — monety przyznaje
 * wyłącznie weryfikacja misji przez Mentora. Dopóki ekonomia się ustala,
 * bonus z zadania trzymamy obok liczby z bazy i DODAJEMY go w HUD-zie:
 *
 *     monety w HUD = player.coins (baza) + bonusMonet() (lokalne zadania)
 *
 * Dzięki temu nic nie kłamie — liczba z bazy zostaje nietknięta, a dziecko
 * widzi swoje trzydzieści monet od razu. Gdy powstanie końcówka nagradzania,
 * `odbierzNagrode` ma wysłać ją na serwer i wyzerować bonus lokalny; reszta
 * kodu nie zauważy różnicy.
 */
import { bonusMonet, dodajMonety, wyzerujBonus } from "../services/monety.js";

const KLUCZ = "ewolucja.zadanie.gwiazdki";

export const CEL_DOMYSLNY = 10;
export const NAGRODA_MONET = 30;

/**
 * Zadanie ma CZTERY stany i każdy z nich musi dać się odczytać z jednego
 * obiektu — bez tego czarodziej nie wie, co powiedzieć, a HUD nie wie, co
 * pokazać:
 *
 *   1. nie ma zadania        istnieje=false
 *   2. trwa zbieranie        istnieje, !spelnione
 *   3. zebrane, nierozliczone istnieje, spelnione, !wyplacone
 *   4. rozliczone            wyplacone
 *
 * `istnieje` i `wyplacone` to fakty z zapisu, a `spelnione` i `aktywne` są
 * z nich WYLICZANE. Trzymanie ich osobno w zapisie skończyłoby się stanem,
 * w którym licznik pokazuje 10/10, a nagrody nigdy nie było — dokładnie tym,
 * na który się nadzialiśmy.
 */
const PUSTE = {
  istnieje: false,
  aktywne: false,
  cel: CEL_DOMYSLNY,
  zebrane: 0,
  // Identyfikatory gwiazdek już zabranych z mapy („gwiazda-3"…). Trzymamy je
  // W ZAPISIE, a nie w pamięci sceny, bo mapa buduje się od nowa przy każdym
  // wejściu do świata: bez tej listy dziecko wracałoby po przerwie do lasu
  // pełnego gwiazdek, mając na liczniku 7 z 10.
  zebraneZnaki: [],
  spelnione: false,
  wyplacone: false,
};

function czytaj() {
  try {
    const surowe = JSON.parse(localStorage.getItem(KLUCZ) || "null");
    if (!surowe || typeof surowe !== "object") return null;
    const cel = Number(surowe.cel) || CEL_DOMYSLNY;
    const zebrane = Math.max(0, Math.min(cel, Number(surowe.zebrane) || 0));
    const wyplacone = !!surowe.wyplacone;
    // Zapisy sprzed tej zmiany nie mają listy — wtedy pusta, a nie brak pola:
    // wołający ma dostać tablicę i nie sprawdzać jej istnienia za każdym razem.
    const zebraneZnaki = Array.isArray(surowe.zebraneZnaki)
      ? surowe.zebraneZnaki.filter((z) => typeof z === "string")
      : [];
    return {
      istnieje: true,
      zebraneZnaki,
      // „Aktywne" = licznik ma się pokazywać. Po odebraniu nagrody zadanie
      // jest skończone, więc kafelek schodzi z HUD-u, ale wpis ZOSTAJE —
      // inaczej kolejna rozmowa z czarodziejem zaczynałaby je od nowa.
      aktywne: !wyplacone,
      cel,
      zebrane,
      spelnione: zebrane >= cel,
      wyplacone,
    };
  } catch {
    return null;
  }
}

function zapisz(stan) {
  try {
    localStorage.setItem(
      KLUCZ,
      JSON.stringify({
        cel: stan.cel,
        zebrane: stan.zebrane,
        zebraneZnaki: stan.zebraneZnaki || [],
        wyplacone: stan.wyplacone,
      })
    );
  } catch {}
}

/** Bieżący stan zadania. Nieaktywne = czarodziej go nie dał albo już rozliczone. */
export function stanZadania() {
  return czytaj() || PUSTE;
}

/**
 * Start zadania. Jeśli już trwa, NIE zeruje licznika — dziecko mogło zagadać
 * do czarodzieja drugi raz, a skasowanie zebranych gwiazdek byłoby karą
 * za rozmowę. Zadania rozliczonego też nie wskrzesza.
 */
export function rozpocznijZadanie(cel = CEL_DOMYSLNY) {
  const teraz = czytaj();
  if (teraz) return teraz;
  const nowe = {
    istnieje: true, aktywne: true, cel, zebrane: 0, zebraneZnaki: [],
    spelnione: false, wyplacone: false,
  };
  zapisz(nowe);
  return nowe;
}

/**
 * Doliczenie jednej gwiazdki. Zwraca nowy stan albo `null`, gdy nie ma czego
 * liczyć (zadania nie ma, jest spełnione albo rozliczone) — dzięki temu
 * wywołujący wie, czy pokazać jakąkolwiek reakcję.
 */
export function dolicz(znak) {
  const teraz = czytaj();
  if (!teraz || teraz.spelnione || teraz.wyplacone) return null;
  const zebrane = Math.min(teraz.cel, teraz.zebrane + 1);
  // Ta sama gwiazdka nie może wejść na listę dwa razy — po awaryjnym
  // przywróceniu mapy (patrz `MAPA_PUSTA` w `Swiat.jsx`) dziecko zbiera te
  // same znaki po raz drugi, a lista ma zostać listą, nie workiem powtórzeń.
  const zebraneZnaki = teraz.zebraneZnaki || [];
  const nowe = {
    ...teraz,
    zebrane,
    zebraneZnaki:
      typeof znak === "string" && !zebraneZnaki.includes(znak)
        ? [...zebraneZnaki, znak]
        : zebraneZnaki,
    spelnione: zebrane >= teraz.cel,
  };
  zapisz(nowe);
  return nowe;
}

/**
 * Czyści listę zabranych gwiazdek, zostawiając licznik. Ratunek na sytuację,
 * w której na mapie nie ma już czego zbierać, a zadanie wciąż trwa — patrz
 * `MAPA_PUSTA` w `Swiat.jsx`. Bez tego zadanie dałoby się zablokować na
 * amen, a dziecko biegałoby po pustym lesie.
 */
export function przywrocGwiazdkiNaMape() {
  const teraz = czytaj();
  if (!teraz) return PUSTE;
  const nowe = { ...teraz, zebraneZnaki: [] };
  zapisz(nowe);
  return nowe;
}

// Lokalny licznik monet mieszka w `services/monety.js` — dzieli go zadanie
// czarodzieja z minigrami. Wystawiamy go dalej, żeby nie łamać istniejących
// importów, ale ŹRÓDŁEM jest tamten moduł.
export { bonusMonet };

/**
 * Rozliczenie zadania: dopisuje monety do lokalnego bonusu i zamyka zadanie.
 * Idempotentne — drugie wywołanie nic nie dodaje, więc podwójne kliknięcie
 * w ekranie nagrody nie wypłaca sześćdziesięciu monet.
 */
export function odbierzNagrode(ile = NAGRODA_MONET) {
  const teraz = czytaj();
  if (!teraz || !teraz.spelnione || teraz.wyplacone) return { stan: stanZadania(), dodane: 0 };
  zapisz({ ...teraz, wyplacone: true });
  dodajMonety(ile, "zadanie:gwiazdki");
  return { stan: stanZadania(), dodane: ile };
}

/** Kasuje zadanie i CAŁY lokalny bonus — na razie tylko do testów z konsoli. */
export function skasujZadanie() {
  try { localStorage.removeItem(KLUCZ); } catch {}
  wyzerujBonus();
  return PUSTE;
}
