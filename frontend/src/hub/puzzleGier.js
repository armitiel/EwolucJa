/**
 * puzzleGier — BRAMA Z PUZZLI przed każdą minigrą.
 *
 * DLACZEGO TO ISTNIEJE. Wejście do gry ma być zdobyczą, nie kliknięciem:
 * zanim tytułowa gra ruszy pierwszy raz, dziecko zbiera porozrzucane po
 * polanie kawałki obrazka, a potem układa z nich obrazek tej właśnie gry.
 * Ułożenie odblokowuje grę NA STAŁE — brama staje raz, przy pierwszym
 * podejściu, a nie przed każdą partią (drugie byłoby karą za chęć grania).
 *
 * ROZMIARY SIATEK są decyzją właściciela (2026-08-22): karty 2×2, choinka
 * (Lot Liska) 3×3, bucik (Bieg Liska) 3×3. Liczba kawałków DO ZEBRANIA na
 * mapie równa się liczbie pól siatki — dziecko układa dokładnie to, co
 * pozbierało; „zebrałeś 4, ułóż 9" byłoby obietnicą bez pokrycia.
 *
 * Znaki kawałków w scenie to `puzel-1`…`puzel-9` (`mapa.json`). Gra 2×2
 * używa pierwszych czterech — moduł mówi tylko, ILE kawałków trzeba, a
 * które znaki stoją na mapie, decyduje hub (jak przy gwiazdkach).
 *
 * Ten sam wzorzec co `zadanieGwiazdek` i `misjeGier`: localStorage + własne
 * zdarzenie zmiany, czytanie zawsze ze źródła.
 */

const KLUCZ = "ewolucja.puzzle.gier";

/** Zdarzenie dla huba: „stan puzzli się zmienił, przeczytaj od nowa". */
export const ZDARZENIE_ZMIANY = "ewolucja:puzzleZmiana";

/** Po tym przedrostku poznajemy kawałki puzzli wśród znaków sceny. */
export const PREFIKS_PUZLA = "puzel-";

/**
 * Bok siatki układanki dla każdej bramowanej gry. Gra spoza tej mapy nie ma
 * bramy i otwiera się po staremu — dopisanie gry tutaj wystarczy, żeby
 * dostała i zbieranie, i układankę.
 */
export const SIATKI = {
  "pamiec-medrca": 2,
  "lot-liska": 3,
  "bieg-liska": 3,
};

/** Obrazki układanek — wygenerowane pod temat gry (patrz tmp/generuj-puzzle). */
export function obrazekPuzzli(id) {
  return SIATKI[id] ? `/assets/puzzle/${id}.webp` : null;
}

export function bokSiatki(id) {
  return SIATKI[id] || 0;
}

/** Ile kawałków trzeba zebrać (= ile pól ma siatka). */
export function celPuzzli(id) {
  const bok = bokSiatki(id);
  return bok * bok;
}

function czytaj() {
  try {
    const surowe = JSON.parse(localStorage.getItem(KLUCZ) || "null");
    return surowe && typeof surowe === "object"
      ? { aktywna: surowe.aktywna || null, gry: surowe.gry || {} }
      : { aktywna: null, gry: {} };
  } catch {
    return { aktywna: null, gry: {} };
  }
}

function zapisz(zapis) {
  try { localStorage.setItem(KLUCZ, JSON.stringify(zapis)); } catch {}
  try {
    window.dispatchEvent(new CustomEvent(ZDARZENIE_ZMIANY, {}));
  } catch {}
}

/**
 * Stan bramy jednej gry. `zbieranie` = TA gra czeka teraz na kawałki z mapy;
 * `komplet` = wszystkie zebrane, można układać; `ulozona` = brama otwarta.
 */
export function stanPuzzli(id) {
  const bok = bokSiatki(id);
  const cel = bok * bok;
  const zapis = czytaj();
  const wpis = zapis.gry[id] || {};
  const zebraneZnaki = Array.isArray(wpis.zebrane) ? wpis.zebrane : [];
  const ulozona = !!wpis.ulozona;
  return {
    id,
    bok,
    cel,
    zebraneZnaki,
    zebrane: zebraneZnaki.length,
    ulozona,
    komplet: cel > 0 && zebraneZnaki.length >= cel,
    zbieranie: zapis.aktywna === id && !ulozona && zebraneZnaki.length < cel,
    /** Czy gra jest w ogóle bramowana. */
    brama: cel > 0,
  };
}

/**
 * Gra z kawałkami „w grze" — od rozpoczęcia zbierania aż do UŁOŻENIA.
 * Szersze niż `aktywneZbieranie`: obejmuje też stan „komplet zebrany,
 * układanka jeszcze nieułożona". Tego używa licznik w HUD — ma stać na
 * ekranie do końca etapu puzzli, nie znikać w chwili ostatniego kawałka.
 */
export function biezacePuzzle() {
  const zapis = czytaj();
  if (!zapis.aktywna) return null;
  const stan = stanPuzzli(zapis.aktywna);
  return stan.brama && !stan.ulozona ? stan : null;
}

/** Gra, której kawałki są teraz rozrzucone po mapie (albo `null`). */
export function aktywneZbieranie() {
  const zapis = czytaj();
  if (!zapis.aktywna) return null;
  const stan = stanPuzzli(zapis.aktywna);
  return stan.zbieranie ? stan : null;
}

/** Czy gra jest odblokowana (brak bramy albo brama ułożona). */
export function czyOdblokowana(id) {
  const stan = stanPuzzli(id);
  return !stan.brama || stan.ulozona;
}

/**
 * Start zbierania: kawałki TEJ gry wchodzą na mapę. Zebrane wcześniej
 * kawałki zostają — przerwane zbieranie kontynuuje się, nie zaczyna od zera.
 */
export function rozpocznijZbieranie(id) {
  const stan = stanPuzzli(id);
  if (!stan.brama || stan.ulozona) return stan;
  const zapis = czytaj();
  if (zapis.aktywna !== id) {
    zapis.aktywna = id;
    zapisz(zapis);
  }
  return stanPuzzli(id);
}

/**
 * Dziecko wbiegło w kawałek na mapie. Liczy się TYLKO w trakcie zbierania —
 * poza nim znaków i tak nie ma na mapie, a gdyby wróciły z animacji powrotu,
 * dotknięcie nie może psuć zapisu. Zwraca stan aktywnej gry albo `null`.
 */
export function doliczPuzel(znak) {
  const zapis = czytaj();
  const id = zapis.aktywna;
  if (!id) return null;
  const stan = stanPuzzli(id);
  if (!stan.zbieranie || stan.zebraneZnaki.includes(znak)) return null;
  const wpis = zapis.gry[id] || {};
  zapis.gry[id] = { ...wpis, zebrane: [...stan.zebraneZnaki, znak] };
  zapisz(zapis);
  return stanPuzzli(id);
}

/** Układanka ułożona — brama otwiera się na stałe. */
export function zaliczUlozenie(id) {
  const zapis = czytaj();
  const wpis = zapis.gry[id] || {};
  if (wpis.ulozona) return stanPuzzli(id);
  zapis.gry[id] = { ...wpis, ulozona: true };
  if (zapis.aktywna === id) zapis.aktywna = null;
  zapisz(zapis);
  return stanPuzzli(id);
}

/** Kasuje CAŁY stan puzzli — do testów z konsoli i pulpitu dev. */
export function skasujPuzzle() {
  try { localStorage.removeItem(KLUCZ); } catch {}
  try { window.dispatchEvent(new CustomEvent(ZDARZENIE_ZMIANY, {})); } catch {}
}
