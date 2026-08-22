/**
 * zasadyGier — co dziecko musi wiedzieć, ZANIM zacznie grać, i czy już to widziało.
 *
 * DLACZEGO OSOBNY PLIK, A NIE TEKST W GRZE. Tutorial ma być jeden dla całej
 * rodziny minigier: to samo miejsce w przepływie (po „Zagraj!", przed partią),
 * ten sam układ, ten sam przycisk. Gdyby każda gra pisała go po swojemu,
 * dziecko uczyłoby się pięciu różnych ekranów zamiast jednego. Tutaj leżą same
 * TREŚCI, a rysuje je `hub/TutorialGry.jsx`.
 *
 * TRZY KROKI, NIE WIĘCEJ. Czwarty krok to dla sześciolatka lista do
 * przeczytania, a nie wyjaśnienie. Wszystko, co nie mieści się w trzech
 * zdaniach, jest albo szczegółem (idzie do `stopka`), albo znakiem, że gra
 * jest za skomplikowana.
 *
 * `demo` wskazuje ruchomą miniaturę w `TutorialGry` — pokazuje zasadę zamiast
 * ją opisywać, więc dziecko, które jeszcze nie czyta, też ją złapie.
 */

const KLUCZ = "ewolucja.tutorial.widziany";

export const ZASADY = {
  "pamiec-medrca": {
    kroki: [
      { id: "odkryj",  demo: "karty-odkryj",  tekst: "Dotknij dwóch kart." },
      { id: "para",    demo: "karty-para",    tekst: "Takie same? Zostają odkryte." },
      { id: "wracaja", demo: "karty-wracaja", tekst: "Różne? Wracają na swoje miejsce." },
    ],
    // Zasada punktacji, nie zasada gry — dlatego pod spodem, drobniej.
    stopka: "Im mniej ruchów, tym więcej monet.",
  },
};

/** Zasady danej gry albo `null`, gdy jeszcze ich nie napisaliśmy. */
export function zasadyGry(id) {
  return ZASADY[id] || null;
}

function czytaj() {
  try {
    const s = JSON.parse(localStorage.getItem(KLUCZ) || "[]");
    return Array.isArray(s) ? s : [];
  } catch {
    return [];
  }
}

/**
 * Czy dziecko widziało już tutorial tej gry.
 *
 * localStorage, a nie konto: to jest wiedza o TYM urządzeniu i tym dziecku
 * przy nim. Zmiana telefonu ma pokazać zasady jeszcze raz — to tańszy błąd
 * niż dziecko wrzucone w grę, której nie rozumie.
 */
export function tutorialWidziany(id) {
  return czytaj().includes(id);
}

export function oznaczTutorial(id) {
  const lista = czytaj();
  if (lista.includes(id)) return lista;
  const nowa = [...lista, id];
  try { localStorage.setItem(KLUCZ, JSON.stringify(nowa)); } catch {}
  return nowa;
}

/** Do testów z konsoli: `window.zasadyGier.zapomnij()` i tutorial wraca. */
export function zapomnijTutoriale() {
  try { localStorage.removeItem(KLUCZ); } catch {}
}
