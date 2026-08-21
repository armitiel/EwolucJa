/**
 * poziomyGier — poziomy trudności i ILE MOŻNA WYGRAĆ, w jednym miejscu.
 *
 * Ta liczba to obietnica, a nie ozdoba: dziecko widzi ją, zanim zdecyduje,
 * czy w ogóle gra. Od kiedy zaproszenie liska na mapie pokazuje ją równolegle
 * z ekranem startowym gry, ta sama kwota stoi na DWÓCH ekranach naraz —
 * a dwie kopie liczby to tylko kwestia czasu, zanim jedna z nich zacznie
 * kłamać. Dlatego mieszka tutaj, a nie w komponentach.
 *
 * Zasady liczenia nagrody ZOSTAJĄ w grach: to ich strojenie (progi czasu,
 * kara za pudło, bonus za gwiazdkę) i nikomu z zewnątrz nie jest potrzebne.
 * Stąd wychodzi tylko sufit — `monetyMax` — którego gra używa i jako obietnicy,
 * i jako własnego ogranicznika, więc rozjazd nie ma jak powstać.
 *
 * `nazwa` jest opcjonalna: gra z jednym poziomem (Sekret pod puchem) nie ma
 * czego nazywać, więc pokazuje samą kwotę i nie udaje wyboru.
 */

export const POZIOMY_GIER = {
  "pamiec-medrca": [
    { id: "easy", nazwa: "Łatwy", monetyMax: 15 },
    { id: "hard", nazwa: "Średni", monetyMax: 25 },
  ],
  "sekret-pod-puchem": [
    // Pięć rund po najwyżej 5 monet — patrz `RUND` i `NAGRODY` w `PiorkaGame`.
    { id: "jeden", monetyMax: 25 },
  ],
  "lot-liska": [
    // Trzy obręcze PO KOLEI, każda na osobny strzał. Kolejne pudła obniżają
    // nagrodę, ale nie blokują gry.
    { id: "jeden", nazwa: "Łatwy", opis: "Obręcz po obręczy", monetyMax: 20 },
    // Dwie obręcze NARAZ, ustawione na jednym torze: liczy się przelot przez
    // obie w JEDNYM locie. Pudło przy którejkolwiek kończy próbę.
    { id: "brama", nazwa: "Trudny", opis: "Dwie naraz, jednym lotem", monetyMax: 30 },
  ],
  "bieg-liska": [
    // Pięć zadań; każda dobra odpowiedź płaci maks/5 — patrz `stawka` w grze.
    { id: "easy", nazwa: "Do 10", monetyMax: 20 },
    { id: "hard", nazwa: "Do 20", monetyMax: 30 },
  ],
};

/** Poziomy danej gry (pusta tablica dla gry spoza listy). */
export function poziomyGry(id) {
  return POZIOMY_GIER[id] || [];
}

/** Poziom zaznaczony na starcie — pierwszy, czyli zawsze ten łatwiejszy. */
export function poziomDomyslny(id) {
  return poziomyGry(id)[0]?.id || null;
}

/** Czy `poziom` istnieje w tej grze. Adres można wpisać ręcznie. */
export function poziomIstnieje(id, poziom) {
  return poziomyGry(id).some((p) => p.id === poziom);
}

/** Sufit nagrody dla poziomu — używany przez samą grę przy wypłacie. */
export function maksMonet(id, poziom) {
  return poziomyGry(id).find((p) => p.id === poziom)?.monetyMax || 0;
}
