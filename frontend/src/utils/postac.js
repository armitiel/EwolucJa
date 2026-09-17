/*!
 * SPDX-FileCopyrightText: © 2026 Amitiel Angelisme <armitiel@gmail.com>
 * SPDX-License-Identifier: LicenseRef-EwolucJA-Proprietary
 *
 * EwolucJA — gra edukacyjna dla dzieci.
 * Produkt powstał w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”;
 * autorskie prawa majątkowe pozostają przy autorze. Licencja: LICENSE.
 */
/**
 * Kto jest bohaterem — jedno miejsce prawdy dla sceny 3D i dla interfejsu.
 *
 * Bohaterem jest LISEK — i tylko on (decyzja autora 17.09.2026, kanon
 * `docs/SWIAT_I_POSTACIE.md`). Postać chłopca (`adventurer`) i jej awatar są
 * wyłączone: parametr `?postac=` i dawny zapis w localStorage niczego już nie
 * zmieniają. Model `adventurer.glb` leży w assetach, ale nic go nie wczytuje.
 *
 * Model GLB, mapowanie klipów animacji i wygląd materiału siedzą po stronie
 * modułu sceny (`SCENA3D_POSTACIE` w `scena-3d-src/src/postacie.js`). Tutaj jest
 * tylko to, czego potrzebuje aplikacja Reacta: identyfikator i grafiki.
 */
export const KLUCZ_POSTACI = "ewolucja.postac";
export const POSTAC_DOMYSLNA = "fox";
/** Postacie, które wolno wczytać. Mapa świata nie może narzucić innej. */
export const DOSTEPNE_POSTACIE = ["fox"];

/** Awatar lisa: portret w złotym medalionie, uszy wychodzą poza pierścień. */
export const AWATAR_DOMYSLNY = "/fox_avatar.png";
const AWATARY = {
  fox: AWATAR_DOMYSLNY,
};

/** Czyści dawny wybór postaci, żeby stara przeglądarka nie trzymała chłopca. */
function wyczyscDawnyWybor() {
  try {
    const zapis = localStorage.getItem(KLUCZ_POSTACI);
    if (zapis && !DOSTEPNE_POSTACIE.includes(zapis)) localStorage.removeItem(KLUCZ_POSTACI);
  } catch {
    /* brak localStorage — nic do czyszczenia */
  }
}

export function idPostaci() {
  wyczyscDawnyWybor();
  return POSTAC_DOMYSLNA;
}

/**
 * Gracz nie wybiera już postaci, więc nie ma „jawnego wyboru”. Zostaje dla
 * zgodności z `Scena3D.jsx`, który i tak przepuszcza z mapy tylko postacie
 * z `DOSTEPNE_POSTACIE`.
 */
export function postacWybranaJawnie() {
  return false;
}

/** Awatar bieżącej postaci; `domyslny` tylko awaryjnie. */
export function awatarPostaci(domyslny = AWATAR_DOMYSLNY) {
  return AWATARY[idPostaci()] || domyslny;
}
