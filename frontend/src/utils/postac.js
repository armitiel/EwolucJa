/**
 * Kto jest bohaterem — jedno miejsce prawdy dla sceny 3D i dla interfejsu.
 *
 * Domyślnym bohaterem jest LIS. Chłopiec (`adventurer`) zostaje dostępny pod
 * `/swiat?postac=adventurer` — wybór zapamiętuje się w localStorage, więc przy
 * kolejnych wejściach trzyma się tego, co ostatnio podano w adresie.
 *
 * UWAGA przy testach: skoro wybór siedzi w localStorage, przeglądarka, w której
 * kiedykolwiek otwarto `?postac=…`, będzie trzymać TAMTĄ postać niezależnie od
 * tego, co jest domyślne w kodzie. Stąd wrażenie, że „produkcja ma starą wersję",
 * gdy lokalnie widać nową — to nie build, to zapamiętany wybór.
 *
 * Model GLB, mapowanie klipów animacji i wygląd materiału siedzą po stronie
 * modułu sceny (`SCENA3D_POSTACIE` w `public/scena-3d/scena3d.js`). Tutaj jest
 * tylko to, czego potrzebuje aplikacja Reacta: identyfikator i grafiki.
 */
export const KLUCZ_POSTACI = "ewolucja.postac";
export const POSTAC_DOMYSLNA = "fox";

/** Awatary postaci innych niż domyślna. Brak wpisu = zostaje grafika domyślna. */
const AWATARY = {
  fox: "/fox_avatar.png",
};

export function idPostaci() {
  try {
    const zAdresu = new URLSearchParams(window.location.search).get("postac");
    if (zAdresu) {
      localStorage.setItem(KLUCZ_POSTACI, zAdresu);
      return zAdresu;
    }
    return localStorage.getItem(KLUCZ_POSTACI) || POSTAC_DOMYSLNA;
  } catch {
    return POSTAC_DOMYSLNA;
  }
}

/**
 * Awatar bieżącej postaci albo `domyslny`, gdy postać swojego nie ma.
 * Domyślny podaje miejsce wywołania, bo każde ma inny: HUD używa portretu
 * w kółku, panel profilu — sylwetki na całą wysokość.
 */
export function awatarPostaci(domyslny) {
  return AWATARY[idPostaci()] || domyslny;
}
