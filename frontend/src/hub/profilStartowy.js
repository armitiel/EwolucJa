/*!
 * SPDX-FileCopyrightText: © 2026 Amitiel Angelisme <armitiel@gmail.com>
 * SPDX-License-Identifier: LicenseRef-EwolucJA-Proprietary
 *
 * EwolucJA — gra edukacyjna dla dzieci.
 * Produkt powstał w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”;
 * autorskie prawa majątkowe pozostają przy autorze. Licencja: LICENSE.
 */
/**
 * profilStartowy — dwa klucze zapisu z testu profilu i nic poza tym.
 *
 * PO CO OSOBNY PLIK. Klucze mieszkały w `pages/Onboarding.jsx` i to było
 * w porządku, dopóki czytał je sam onboarding. Dziś sięgają po nie także oś
 * etapów (`etapyMisji.js`) i dwa pulpity dev — a import całej strony po dwa
 * ciągi znaków wciąga do huba komponent z lektorem, animacjami i quizem.
 * Tutaj jest sam zapis, więc każdy może to zaimportować bez kosztu.
 *
 * `Onboarding.jsx` reeksportuje oba klucze, żeby starsze importy dalej
 * działały — to jest jedyny powód, dla którego tam jeszcze występują.
 */

/** Kod typu z testu: "EM" / "ST" / "KR" / "LD" / "DT" / "MD". */
export const KLUCZ_TYP = "ewolucja.profil.typ";

/**
 * ETAP SZKOLNY — „1-3" albo „4-8". Decyduje o dwóch rzeczach naraz: ile
 * kafelków ma pytanie (trzy albo cztery) i ile z niego niesie obrazek, a ile
 * podpis. Serwer filtruje komplet po tej wartości
 * (`GET /onboarding/quiz?etap=`), bo od niej zależy bilans typów — patrz
 * `docs/TEST_OBRAZKOWY_PANEL.md`.
 *
 * Trzyma się w localStorage obok typu, a nie tylko przy koncie, żeby wersja
 * dla młodszych działała także zanim backend odpowie — i żeby dało się ją
 * przestawić z pulpitu dev.
 */
export const KLUCZ_ETAP = "ewolucja.profil.etap";

/** Etap szkolny z zapisu; domyślnie starsza wersja (cztery kafelki). */
export function etapSzkolny() {
  try { return localStorage.getItem(KLUCZ_ETAP) === "1-3" ? "1-3" : "4-8"; } catch { return "4-8"; }
}

/** Kod typu z zapisu albo `null`, gdy testu jeszcze nie było. */
export function typStartowy() {
  try { return localStorage.getItem(KLUCZ_TYP) || null; } catch { return null; }
}

/**
 * Kasuje typ i etap — czyli cofa dziecko przed pierwszy ekran onboardingu.
 * Konta NIE rusza: `player_id` żyje własnym życiem w `services/api.js`,
 * a test da się przejść ponownie na tym samym koncie.
 */
export function zapomnijProfil() {
  try {
    localStorage.removeItem(KLUCZ_TYP);
    localStorage.removeItem(KLUCZ_ETAP);
  } catch {}
}

/**
 * Nadaje profil, jesli go nie ma — do pulpitu dev. Kazdy etap osi PO
 * onboardingu zaklada dziecko, ktore test juz przeszlo; bez tego oś pokazuje
 * „Etap 1 z 24" (brak typu) przy jednoczesnym zadaniu gwiazdek w toku
 * i sama na siebie krzyczy rozjazdem. Nie nadpisuje istniejacego wyboru.
 */
export function upewnijProfil(typ = "DT", etap = "4-8") {
  try {
    if (!localStorage.getItem(KLUCZ_TYP)) localStorage.setItem(KLUCZ_TYP, typ);
    if (!localStorage.getItem(KLUCZ_ETAP)) localStorage.setItem(KLUCZ_ETAP, etap);
  } catch {}
}

/**
 * PORA DOBY dla ekranow, ktore nie maja sceny 3D — dzis tylko onboarding.
 *
 * Swiat ma wlasny cykl dnia i nocy (`cyklDnia` w mapie), wiec wejscie do niego
 * nie moze byc zawsze w samo poludnie: dziecko klikaloby START o dwudziestej
 * i wchodzilo w poludniowa planete, a sekunde pozniej ladowalo pod gwiazdami.
 * Tutaj nie ma zegara sceny, wiec bierzemy ten, ktory dziecko ma naprawde —
 * wlasny.
 *
 * Progi sa celowo szerokie: „wieczor" ma sie zaczynac wtedy, gdy za oknem
 * faktycznie szarzeje, a nie co do minuty.
 */
export function poraDoby(godzina = new Date().getHours()) {
  if (godzina >= 22 || godzina < 6) return "noc";
  if (godzina >= 18) return "zmierzch";
  return "dzien";
}
