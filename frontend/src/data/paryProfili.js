/**
 * paryProfili — jak nazywa się dziecko, gdy dwie cechy wyszły równie mocno.
 *
 * PO CO OSOBNA TABELA. Quiz zwraca sześć wyników; dwa najwyższe składają się
 * w parę i to ona dostaje nazwę na ekranie końcowym. Nazwa pary ma mówić
 * dziecku, CO POTRAFI, a nie brzmieć jak tytuł z legendy.
 *
 * CO SIĘ ZMIENIŁO (14.09.2026). Stara tabela pożyczała słowa od archetypów,
 * których już nie ma („Wizjoner Tajemnic" od Tropiciela Tajemnic, „Strażnik
 * Pokoju" od Strażnika Mostu, „Śmiały Tropiciel"), a „Odkrywca Serc" zderzał
 * się wprost z nową nazwą profilu DT. Reszta była albo dla dorosłego
 * („Dyplomata Wiedzy", „Architekt Przyszłości"), albo nie do odmienienia
 * („Generał", „Mędrzec", „Kapitan") — dziewczynka czytała o kimś innym.
 *
 * FORMA. Każda nazwa jest zapisana tokenem `{męski|żeński}` i przechodzi przez
 * `services/rodzaj.js` → `odmien()`. „Odważne Serce" nie ma tokenu, bo jest
 * wyrażeniem i działa dla obojga — tak samo jak „Spokojna Głowa" wśród profili.
 *
 * KLUCZ to dwa kody profilu POSORTOWANE ALFABETYCZNIE i sklejone `_`
 * (`DT_KR`, nie `KR_DT`) — tak samo liczy je `backend/src/api/game.js`.
 */
import { odmien, RODZAJ } from "../services/rodzaj.js";

export const NAZWY_PAR = {
  // ciekawość + kreatywność — pyta i od razu próbuje zrobić
  DT_KR: "{Pomysłowy Badacz|Pomysłowa Badaczka}",
  // życzliwość + skupienie — pomaga bez rozgłosu i nie odpuszcza
  EM_MD: "{Cichy Pomocnik|Cicha Pomocnica}",
  // odwaga + mądrość — rusza pierwszy, ale z planem
  LD_ST: "{Mądry Dowódca|Mądra Dowódczyni}",
  // kreatywność + mądrość — z pomysłu robi coś, co naprawdę działa
  KR_ST: "{Konstruktor Pomysłów|Konstruktorka Pomysłów}",
  // ciekawość + życzliwość — ciekawi go świat i ludzie w nim
  DT_EM: "{Ciekawski Kompan|Ciekawska Kompanka}",
  // kreatywność + odwaga — wymyśla i próbuje, zanim ktoś powie „nie da się"
  KR_LD: "{Odważny Majsterkowicz|Odważna Majsterkowiczka}",
  // odwaga + skupienie — nie panikuje, kiedy robi się trudno
  LD_MD: "{Opanowany Bohater|Opanowana Bohaterka}",
  // ciekawość + mądrość — zbiera tropy i układa je w całość
  DT_ST: "{Detektyw Zagadek|Detektywka Zagadek}",
  // życzliwość + kreatywność — pokazuje uczucia tym, co tworzy
  EM_KR: "{Artysta Serca|Artystka Serca}",
  // ciekawość + skupienie — zauważa to, co inni przegapiają
  DT_MD: "{Uważny Obserwator|Uważna Obserwatorka}",
  // życzliwość + odwaga — staje po czyjejś stronie, kiedy trzeba
  EM_LD: "Odważne Serce",
  // skupienie + mądrość — rozkłada trudną rzecz na kroki i idzie po kolei
  MD_ST: "{Cierpliwy Planista|Cierpliwa Planistka}",
  // życzliwość + mądrość — wie, co powiedzieć, gdy komuś jest źle
  EM_ST: "{Mądry Pocieszyciel|Mądra Pocieszycielka}",
  // kreatywność + skupienie — siada i robi swoje, aż skończy
  KR_MD: "{Cichy Twórca|Cicha Twórczyni}",
  // ciekawość + odwaga — pierwszy sprawdza, co jest za zakrętem
  DT_LD: "{Śmiały Zwiadowca|Śmiała Zwiadowczyni}",
};

/** Nazwa zapasowa, gdy para nie ma wpisu (nie powinno się zdarzyć). */
export const NAZWA_ZAPASOWA = "{Bohater Świata Ewolucji|Bohaterka Świata Ewolucji}";

/** Klucz pary z dwóch kodów profilu — kolejność nie ma znaczenia. */
export function kluczPary(a, b) {
  return [a, b].sort().join("_");
}

/**
 * @param {string} klucz np. "DT_KR"
 * @param {string} rodzaj RODZAJ.MESKI albo RODZAJ.ZENSKI
 */
export function nazwaPary(klucz, rodzaj = RODZAJ.MESKI) {
  return odmien(NAZWY_PAR[klucz] || NAZWA_ZAPASOWA, rodzaj);
}
