/*!
 * SPDX-FileCopyrightText: © 2026 Amitiel Angelisme <armitiel@gmail.com>
 * SPDX-License-Identifier: LicenseRef-EwolucJA-Proprietary
 *
 * EwolucJA — gra edukacyjna dla dzieci.
 * Produkt powstał w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”;
 * autorskie prawa majątkowe pozostają przy autorze. Licencja: LICENSE.
 */
/**
 * bramkaKomunikatow — jedno miejsce, które wie, czy wolno się teraz odezwać.
 *
 * DLACZEGO ISTNIEJE. Do 18.09.2026 każdy kanał trzymał własną listę stanów,
 * przy których ma milczeć: `aktywna` w `PodpowiedzMedrca`, `spokoj` przy
 * Reflektorze, trzeci warunek przy ikonkach awatara. Żadna z tych list nie
 * obejmowała wszystkich czternastu stanów `Swiat.jsx`, bo nikt nie ma ich
 * w głowie naraz — i stąd brały się cztery kolizje opisane w
 * `docs/tresci/08_KANALY_I_WYSTEPOWANIE.md`. Bramka zabiera tę listę kanałom.
 *
 * NAJWAŻNIEJSZA ZASADA: ODMOWA NIE ZUŻYWA LIMITU. Kanał, który dostał
 * `wolno: false`, nie zwiększa swojego licznika i nie zapisuje znacznika
 * czasu — próbuje ponownie, gdy ekran się zwolni. Wcześniej myśl Wizkora
 * potrafiła odpalić się pod minigrą, odliczyć jedenaście sekund za zasłoną
 * i spalić jedno z dwóch dozwolonych wejść na sesję.
 *
 * CZEGO TU NIE MA. Bramka nie wie, CO kanał chce powiedzieć, i nie planuje
 * jego rytmu — zegary zostają u kanałów (R7 w `PodpowiedzMedrca`, `poCzasie`
 * w `wskazowki.js`). Tutaj jest wyłącznie odpowiedź na pytanie „czy teraz
 * wolno”, a odpowiedź „nie” zawsze ma powód do wypisania na pulpicie DEV.
 *
 * Moduł trzyma stan w pamięci, nie w `localStorage`: liczy się TA sesja.
 */

/** Jak głośny jest kanał. Wyższy poziom blokuje niższe, nie odwrotnie. */
export const POZIOM = {
  /** Świat pokazuje bez słów: kamera, iskry, licznik. Nigdy nie pyta bramki. */
  SWIAT: 0,
  /** Jedno potwierdzenie albo ikona: toast, ikonki, pasek, podpis narratorki. */
  ZNAK: 1,
  /** Jedno zdanie obok świata: myśl Wizkora, dymek Reflektora. */
  SZEPT: 2,
  /** Świat staje i jest przycisk: karty, szuflady, koło, nagroda, podsumowanie. */
  ROZMOWA: 3,
};

/** Miejsce na ekranie. Dwa kanały tego samego slotu nie stoją obok siebie. */
export const SLOT = {
  /** Każda bańka nad światem — stąd „jedna chmurka na ekranie”. */
  CHMURKA: "chmurka",
  /** Pasek na dole (toast). */
  DOL: "dol",
  /** Cichy podpis narratorki nad HUD-em. */
  PODPIS: "podpis",
};

/* ── STAŁE RYTMU (`08` §4 i §7) ─────────────────────────────────────────── */

/** Minimum między DWOMA dowolnymi odezwaniami z tekstem. */
export const ODSTEP_MIEDZY_GLOSAMI = 45_000;
/** Ile odezwań z tekstem poziomu SZEPT wolno na jedną sesję — razem. */
export const BUDZET_SZEPTU = 4;
/** Jak długo odłożony znak (toast, podpis) czeka na wolny ekran. */
export const WAZNOSC_ZNAKU = 15_000;

const STAN_POCZATKOWY = {
  /** Chmury się rozsunęły i widać świat. */
  odsloniete: false,
  /** Karta postaci, koło, reflektor — coś czeka na decyzję dziecka. */
  rozmowa: false,
  /** Minigra, nagroda, rysunek, układanka, podsumowanie, wnętrze domku. */
  pelnyEkran: false,
  /** Szuflada huba (porada, zadania, hybryda, profil, gry, zwój). */
  szuflada: false,
  /** Planeta śpi — po zachodzie milczy wszystko poza narratorką. */
  noc: false,
};

let _stan = { ...STAN_POCZATKOWY };
/** slot → kto go trzyma. */
const _sloty = new Map();
/** kanał → kiedy ostatnio wszedł (ms od epoki). */
let _ostatnie = {};
/** Kiedy cokolwiek z tekstem odezwało się ostatnio. */
let _ostatniGlos = 0;
/** Ile szeptów zostało na tę sesję. */
let _budzet = BUDZET_SZEPTU;
const _sluchacze = new Set();

function powiadom() {
  for (const fn of _sluchacze) {
    try { fn(); } catch { /* jeden zepsuty słuchacz nie psuje reszty */ }
  }
}

/**
 * Melduje stan ekranu. Woła to JEDNO miejsce — `Swiat.jsx` — w jednym efekcie.
 * Dopisanie nowego pełnego ekranu to jedna linijka tam, a nie poprawka
 * w czterech listach wyjątków.
 */
export function ustawStanEkranu(nowy = {}) {
  let zmiana = false;
  for (const klucz of Object.keys(STAN_POCZATKOWY)) {
    if (klucz in nowy) {
      const wartosc = !!nowy[klucz];
      if (_stan[klucz] !== wartosc) { _stan[klucz] = wartosc; zmiana = true; }
    }
  }
  if (zmiana) powiadom();
  return zmiana;
}

/** Kopia stanu — do pulpitu DEV i do testów. */
export function stanEkranu() {
  return { ..._stan };
}

/**
 * Czy wolno się teraz odezwać. Zwraca `{ wolno, powod }`; `powod` jest po to,
 * żeby pulpit DEV mógł napisać, DLACZEGO chmurka nie weszła — dziś to się
 * zgaduje z konsoli.
 *
 * @param {number} poziom   POZIOM.*
 * @param {object} opcje
 * @param {string} [opcje.slot]        SLOT.* — sprawdzane na wyłączność
 * @param {string} [opcje.kanal]       nazwa kanału do odstępów i budżetu
 * @param {number} [opcje.minOdstep]   minimum od ostatniego wejścia TEGO kanału
 * @param {boolean} [opcje.bezOdstepu] pomija odstęp globalny (odpowiedź na
 *                                     działanie dziecka, nie zaczepka)
 */
export function czyWolno(poziom, opcje = {}) {
  const { slot = null, kanal = null, minOdstep = 0, bezOdstepu = false } = opcje;

  if (poziom <= POZIOM.SWIAT) return { wolno: true, powod: null };

  if (!_stan.odsloniete) return { wolno: false, powod: "chmury" };
  if (_stan.rozmowa || _stan.pelnyEkran) return { wolno: false, powod: "rozmowa" };

  if (poziom >= POZIOM.SZEPT) {
    if (_stan.szuflada) return { wolno: false, powod: "szuflada" };
    /* Po zachodzie mówi już tylko narratorka — planeta zasypia i ostatnie
       słowo należy do podsumowania (`02` §3.2). */
    if (_stan.noc && kanal !== "narratorka") return { wolno: false, powod: "noc" };
    if (_budzet <= 0) return { wolno: false, powod: "budzet" };
  }

  if (slot) {
    const kto = _sloty.get(slot);
    if (kto && kto !== kanal) return { wolno: false, powod: "slot" };
  }

  if (kanal && minOdstep > 0) {
    if (Date.now() - (_ostatnie[kanal] || 0) < minOdstep) {
      return { wolno: false, powod: "odstep" };
    }
  }

  if (poziom >= POZIOM.SZEPT && !bezOdstepu) {
    if (Date.now() - _ostatniGlos < ODSTEP_MIEDZY_GLOSAMI) {
      return { wolno: false, powod: "odstep-globalny" };
    }
  }

  return { wolno: true, powod: null };
}

/** Skrót na warunek w JSX — samo `true`/`false`. */
export function wolno(poziom, opcje) {
  return czyWolno(poziom, opcje).wolno;
}

/**
 * Kanał WSZEDŁ. Dopiero tutaj schodzi budżet i zapisuje się znacznik czasu —
 * nigdy przy odmowie (patrz nagłówek).
 */
export function zanotuj(kanal, poziom = POZIOM.ZNAK) {
  const teraz = Date.now();
  if (kanal) _ostatnie[kanal] = teraz;
  /* ODSTĘP MIĘDZY GŁOSAMI liczy się od kanałów, które MÓWIĄ — toast i ikonki
     są nieme, więc nie mają czego odsuwać. Gdyby liczyły się tu, każde z 36
     wywołań `pokazKomunikat` uciszałoby myśl Wizkora na 45 s i aktywne
     dziecko nie usłyszałoby jej w całej sesji ani razu. */
  if (poziom >= POZIOM.SZEPT) _ostatniGlos = teraz;
  if (poziom >= POZIOM.SZEPT && _budzet > 0) _budzet -= 1;
  powiadom();
}

/** Kiedy dany kanał wszedł ostatnio; 0 = jeszcze nie w tej sesji. */
export function kiedyWszedl(kanal) {
  return _ostatnie[kanal] || 0;
}

/** Ile szeptów zostało na tę sesję. */
export function budzet() {
  return _budzet;
}

export function zajmijSlot(slot, kanal) {
  if (!slot) return;
  _sloty.set(slot, kanal || true);
  powiadom();
}

export function zwolnijSlot(slot, kanal) {
  if (!slot) return;
  const kto = _sloty.get(slot);
  /* Zwalnia tylko ten, kto zajął: chmurka schodząca z opóźnieniem nie może
     zdjąć slotu spod nóg następnej, która już wjechała. */
  if (kto && kanal && kto !== kanal) return;
  _sloty.delete(slot);
  powiadom();
}

export function ktoTrzyma(slot) {
  return _sloty.get(slot) || null;
}

/**
 * Powiadomienie o zwolnieniu ekranu — kanał, który dostał odmowę, może wrócić
 * bez czekania na własny zegar. Zwraca funkcję odsubskrybowania.
 */
export function subskrybuj(fn) {
  if (typeof fn !== "function") return () => {};
  _sluchacze.add(fn);
  return () => _sluchacze.delete(fn);
}

/** Nowa sesja: zerujemy budżet, znaczniki i sloty. Stan ekranu zostaje. */
export function resetSesji() {
  _ostatnie = {};
  _ostatniGlos = 0;
  _budzet = BUDZET_SZEPTU;
  _sloty.clear();
  powiadom();
}

/** Pełny obraz do pulpitu DEV. */
export function stanBramki() {
  return {
    ekran: { ..._stan },
    sloty: Object.fromEntries(_sloty),
    budzet: _budzet,
    ostatniGlos: _ostatniGlos,
    kanaly: { ..._ostatnie },
  };
}
