/*!
 * SPDX-FileCopyrightText: © 2026 Amitiel Angelisme <armitiel@gmail.com>
 * SPDX-License-Identifier: LicenseRef-EwolucJA-Proprietary
 *
 * EwolucJA — gra edukacyjna dla dzieci.
 * Produkt powstał w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”;
 * autorskie prawa majątkowe pozostają przy autorze. Licencja: LICENSE.
 */
/**
 * coTeraz — JEDNA odpowiedź na pytanie „co mam teraz zrobić", powiedziana
 * OBRAZKAMI w chmurce przy awatarze.
 *
 * PO CO TO POWSTAŁO. Chmurka z lupą i puzelkiem działała dobrze, ale tylko dla
 * puzzli — a każdy inny etap zostawiał dziecko z pustym ekranem i pamięcią.
 * Dziecko, które wróciło po dwóch dniach, wiedziało z HUD-u ILE czegoś ma
 * (liczniki), ale nie CO Z TYM ZROBIĆ. Ten plik jest tą wiedzą — jedną, dla
 * wszystkich zadań naraz.
 *
 * ZASADY, KTÓRE TU OBOWIĄZUJĄ:
 *
 *  1. JEDNA RZECZ NA RAZ. Zwracamy dokładnie jeden etap, nigdy listy zadań.
 *     Świat EwolucJI nie jest tablicą obowiązków (`docs/OPIS_PROJEKTU.md`);
 *     dziecko ma wiedzieć, co jest teraz, a nie ile ma zaległości.
 *  2. OBRAZEK NIESIE CAŁĄ TREŚĆ. Nie ma zdania ani lektora — para ikon mówi
 *     „zrób TO z TYM" (siekiera → stos, stos → domek, lupa → puzelek) i to
 *     wystarczy. Zdanie ma swoje miejsce: okno Wizkora przy zlecaniu zadania.
 *     Kanał, który odzywa się po każdej zmianie etapu, musi być cichy —
 *     inaczej po tygodniu dziecko przestaje go czytać i słyszeć.
 *  3. TO JEST DANE, NIE KOD. Dopisanie etapu to jeden wpis w `ETAPY` —
 *     chmurkę, dzióbek i przemianę obrazków rysuje `Reflektor.jsx`, ten sam,
 *     który obsługuje wskazówki z `wskazowki.js`.
 *  4. NIKT TU NIE MÓWI. To myśl dziecka przy jego własnym awatarze, a nie
 *     kolejna postać z poleceniem. Podział kanałów: `ChmurkaAwatara.jsx`.
 *
 * CZEGO TU NIE MA. Odliczania czasu, plakietek „zaległe", liczb w zdaniu
 * („zostało 7 z 10") — licznik w HUD-zie już to mówi, a powtórzone w chmurce
 * zamienia zaproszenie w raport.
 */

const IKONA = {
  lupa: "/assets/wskazowki/ikona-lupa.png",
  puzzel: "/assets/puzzle/ikona-puzzel.png",
  stos: "/assets/wskazowki/ikona-stos.png",
  gwiazdka: "/assets/wskazowki/ikona-gwiazdka.png",
  zwoj: "/assets/wskazowki/ikona-zwoj.png",
  siekiera: "/scena-3d/assets/ikona-siekiera.png",
  domek: "/scena-3d/assets/ikona-siedlisko.png",
};

/** Dzióbek chmurki celuje w SAM AWATAR, nie w pigułkę z imieniem. */
export const CEL_AWATARA = '[data-testid="hub-chip-profil"] img';

/**
 * ETAPY — kolejność ma znaczenie: pierwszy pasujący wygrywa.
 *
 * To jest KOLEJNOŚĆ ŁUKU GRY, nie kolejność dopisywania: gwiazdki (pierwsze
 * zadanie Wizkora) → drewno na domek → kawałki obrazka → zadanie poza ekranem.
 * Gdyby dwa etapy zapaliły się naraz — a gra tego pilnuje („jedno zadanie na
 * dany moment") — dziecko usłyszy o tym wcześniejszym, czyli o tym, które
 * zaczęło, a nie o tym, które akurat dopisała nowa mechanika.
 */
const ETAPY = [
  {
    id: "gwiazdki-zbieranie",
    pasuje: ({ gwiazdki }) => gwiazdki?.aktywne && !gwiazdki.spelnione,
    obrazki: [IKONA.gwiazdka, IKONA.lupa],
    tytul: "Złote gwiazdki",
  },
  {
    id: "gwiazdki-do-wizkora",
    pasuje: ({ gwiazdki }) => gwiazdki?.aktywne && gwiazdki.spelnione && !gwiazdki.wyplacone,
    obrazki: [IKONA.gwiazdka, IKONA.zwoj],
    tytul: "Wracamy do Wizkora",
  },
  {
    id: "drewno-scinanie",
    pasuje: ({ drewno }) => drewno?.istnieje && !drewno.zbudowane && drewno.doSciecia > 0,
    obrazki: [IKONA.siekiera, IKONA.stos],
    tytul: "Ścinamy drzewa",
  },
  {
    id: "drewno-znoszenie",
    pasuje: ({ drewno }) => drewno?.istnieje && !drewno.zbudowane && drewno.doZniesienia > 0,
    obrazki: [IKONA.stos, IKONA.domek],
    tytul: "Zanieś drewno",
  },
  {
    id: "puzzle-szukanie",
    pasuje: ({ puzzle }) => puzzle && !puzzle.komplet && !puzzle.zebrane,
    obrazki: [IKONA.lupa, IKONA.puzzel],
    tytul: "Szukamy kawałków",
  },
  {
    id: "puzzle-ukladanie",
    pasuje: ({ puzzle }) => puzzle?.komplet,
    obrazki: [IKONA.puzzel],
    tytul: "Masz wszystkie!",
  },
  {
    id: "real-do-zrobienia",
    pasuje: ({ real }) => real?.doZrobienia,
    obrazki: [IKONA.zwoj],
    tytul: "Zadanie poza ekranem",
  },
  {
    id: "real-do-odbioru",
    pasuje: ({ real }) => real?.doOdbioru,
    obrazki: [IKONA.zwoj, IKONA.gwiazdka],
    tytul: "Mentor zauważył",
  },
];

/**
 * Co teraz — albo `null`, gdy świat niczego nie oczekuje (i wtedy MA być
 * cicho: brak zadania to nie jest powód do odzywania się).
 *
 * Zwracany kształt to gotowa WSKAZÓWKA dla `Reflektor.jsx` — ten sam zapis, co
 * w `wskazowki.js`, żeby chmurka była jedna i wyglądała zawsze tak samo.
 */
export function coTeraz(stan = {}) {
  const etap = ETAPY.find((e) => {
    try { return e.pasuje(stan); } catch { return false; }
  });
  if (!etap) return null;
  return {
    id: `co-teraz:${etap.id}`,
    obrazki: etap.obrazki,
    /* Nazwa etapu NIE jest napisem na ekranie — idzie do `aria-label` chmurki
       i do pulpitu testowego. Cały kanał mówi obrazkami (patrz nagłówek). */
    tytul: etap.tytul,
    czasNaEkranie: 7000,
  };
}

/** Lista etapów do pulpitu testowego i do testów — bez stanu gry. */
export const ETAPY_CO_TERAZ = ETAPY.map(({ id, tytul, obrazki }) => ({ id, tytul, obrazki }));
