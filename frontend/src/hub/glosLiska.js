/**
 * glosLiska — lisek mówi. Jedno miejsce na jego głos i na to, co nim wchodzi.
 *
 * KTO TO MÓWI, A NIE GDZIE TO JEST. Backend dobiera barwę po polu `land`
 * (`ttsService.js`), które historycznie znaczyło krainę. Dla postaci używamy
 * tego samego pola — `lisek` jest tam wpisany obok krain — bo dokładanie
 * drugiego kanału („voiceId") znaczyłoby dwie drogi do tej samej decyzji,
 * a przy trzeciej postaci nikt by już nie wiedział, która wygrywa.
 *
 * GDZIE LISEK SIĘ ODZYWA. Tylko tam, gdzie ZAPRASZA DO WSPÓLNEGO DZIAŁANIA —
 * w Poradzie dnia oraz w lekkiej wskazówce prowadzącej do Minigier. To jego
 * jedyna rola w mowie: nie opowiada świata (od tego jest narratorka) i nie
 * zleca zadań (od tego jest Wizkor). Mówi „zrobimy to razem" i tyle.
 *
 * ZDANIA SĄ KRÓTKIE Z PREMEDYTACJĄ. Dziecko ma je usłyszeć w biegu, przy
 * otwartej szufladzie, często z włączoną muzyką. Dłuższe zdanie w tym miejscu
 * zamienia zaproszenie w instrukcję.
 */
import { ttsPlayer } from "../services/ttsPlayer.js";

/** Klucz głosu po stronie backendu (`VOICES.lisek` w `ttsService.js`). */
export const GLOS_LISKA = "lisek";

/** Preset barwy: żywo i odrobinę szybciej niż narrator. */
export const TON_LISKA = "zabawa";

/**
 * Zachęty przy WYBORZE karty. Deterministyczne w obrębie dnia, tak jak same
 * karty — dziecko, które wraca do szuflady po pięciu minutach, ma usłyszeć to
 * samo zdanie, a nie losowanie przy każdym wejściu.
 */
export const ZACHETY = [
  "Wybierz jedną i zrobimy ją razem.",
  "Która dzisiaj? Ja jestem gotowy.",
  "Zrobimy to we dwoje — wybieraj.",
  "Wskaż jedną, a ja robię z tobą.",
  "Mam czas i ochotę. Co wybierasz?",
];

/**
 * Zapasowe „wchodzimy w to", gdy karta nie ma własnej zapowiedzi. Normalnie
 * lisek mówi KONKRETNIE, co to za praktyka (pole `zapowiedz` w `poradaDnia.js`)
 * — samo „świetny wybór" nie niesie żadnej informacji, a dziecko właśnie
 * zgodziło się na coś, czego jeszcze nie zna.
 */
export const WEJSCIA = [
  "Świetny wybór. Robimy to razem.",
  "Dobra, wchodzimy w to razem.",
  "To moja ulubiona. Zaczynamy!",
];

function zZiarna(lista, ziarno) {
  let h = 0;
  const s = String(ziarno);
  for (let i = 0; i < s.length; i += 1) h = (h * 31 + s.charCodeAt(i)) % 9973;
  return lista[h % lista.length];
}

function kluczDnia(data = new Date()) {
  // Lokalna data, nie ISO w UTC — o 23:30 czasu polskiego ISO pokazuje już
  // jutro. Ta sama zasada, co przy kartach dnia (`poradaDnia.js`).
  return `${data.getFullYear()}-${data.getMonth() + 1}-${data.getDate()}`;
}

export function zachetaDoWyboru(data = new Date()) {
  return zZiarna(ZACHETY, kluczDnia(data));
}

/**
 * Co lisek mówi po wybraniu karty: NAJPIERW czym jest ta praktyka, dopiero
 * potem zaproszenie. Zapowiedź stoi przy karcie, bo zależy od jej treści,
 * a nie od dnia — z tego samego powodu nie jest losowana.
 *
 * Gdy karta zapowiedzi nie ma (nowa pozycja, literówka w danych), schodzimy
 * na tytuł z opisem — dziecko dalej usłyszy, w co wchodzi, tylko sucho.
 */
export function zachetaDoKarty(karta, data = new Date()) {
  if (karta?.zapowiedz) return karta.zapowiedz;
  if (karta?.tytul && karta?.opis) return `${karta.tytul}. ${karta.opis}. Robimy to razem?`;
  return zZiarna(WEJSCIA, `${kluczDnia(data)}:${karta?.id || ""}`);
}

/**
 * Mówi głosem liska. Cicho zawodzi, gdy TTS jest niedostępny albo wyciszony —
 * to jest ozdoba przepływu, nie jego część: wszystko, co lisek mówi, stoi
 * także napisane na ekranie.
 */
export function powiedzJakLisek(tekst, { przerwij = true } = {}) {
  if (!tekst) return;
  try {
    ttsPlayer.speak(tekst, { land: GLOS_LISKA, tone: TON_LISKA, interrupt: przerwij });
  } catch {}
}

/** Ucisza liska — np. przy zamknięciu szuflady albo wyjściu z panelu. */
export function uciszLiska() {
  try { ttsPlayer.stop(); } catch {}
}
