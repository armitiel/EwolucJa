/*!
 * SPDX-FileCopyrightText: © 2026 Amitiel Angelisme <armitiel@gmail.com>
 * SPDX-License-Identifier: LicenseRef-EwolucJA-Proprietary
 *
 * EwolucJA — gra edukacyjna dla dzieci.
 * Produkt powstał w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”;
 * autorskie prawa majątkowe pozostają przy autorze. Licencja: LICENSE.
 */
/**
 * mowaPostaci — jedna zasada na głos postaci w oknach i panelach gry.
 *
 * ZASADA: LEKTOR KOŃCZY ZDANIE.
 *
 * Wcześniej każde takie okno uciszało głos we własnym `useEffect` przy
 * zamknięciu — i to był błąd, który widać było w grze: dziecko stuka
 * w zielony przycisk po pierwszej linijce (bo już wie, co ma robić),
 * a Wizkor milknie w pół słowa, zanim zdąży powiedzieć GDZIE. Efekt był
 * odwrotny do zamierzonego: im sprawniejsze dziecko, tym mniej z kwestii
 * słyszało.
 *
 * Dlatego zamknięcie okna NIE ucisza. Tekst na ekranie jest krótki
 * (`tekstEkranu` w `kwestieWizkora.js`), lektor mówi pełniejszą wersję
 * i spokojnie dopowiada ją zza kadru, gdy lis już biegnie.
 *
 * NUTKA W HUD-ZIE NIE DOTYCZY GŁOSU (decyzja właściciela, 2026-09-16).
 * Steruje wyłącznie muzyką w tle. Wcześniej wyciszała jedno i drugie, więc
 * dziecko, które ściszyło muzykę — bo gra przy kimś, bo woli ciszej — traciło
 * przy okazji jedyną wersję kwestii dostępną dla kogoś, kto jeszcze nie czyta.
 * To dwie różne potrzeby i mają dwa różne przełączniki: muzyka to tło,
 * a Wizkor to treść.
 *
 * ── KOLEJKA ZAMIAST PRZERYWANIA (18.09.2026, `docs/tresci/08` §5) ─────────
 *
 * Do 18.09 KAŻDE wywołanie szło z `interrupt: true`, więc kto odezwał się
 * ostatni, ten wygrywał — i narratorka o zapadającej nocy potrafiła uciąć
 * Wizkora w pół słowa. Zachód i noc trafiają na siebie w tej samej sekundzie,
 * a jedyne, co temu zapobiegało, to ręczne `setTimeout(4200)` w JEDNYM miejscu
 * `Swiat.jsx`. To nie jest kolejka, tylko odstęp wpisany z palca.
 *
 * Teraz każda kwestia ma WAGĘ:
 *
 *   3 · rozmowa     — karta postaci, szuflada zadania; przerywa niższych
 *   2 · narratorka  — noc, powrót, podsumowanie; przerywa szept, czeka na rozmowę
 *   1 · szept       — myśl Wizkora o ciele, dymek liska; czeka albo odpada
 *
 * Wyższa waga przerywa. Równa czeka w kolejce (najwyżej JEDNA — druga
 * wypycha pierwszą, bo stara kwestia po dwóch przerwach i tak jest już nie
 * na temat). Niższa odpada bez śladu i BEZ zużycia budżetu w bramce
 * (`bramkaKomunikatow.js`) — to ta sama zasada, co przy odmowie bramki.
 *
 * Głos milknie w dwóch sytuacjach — i tylko w nich:
 *
 *  1. ZACZYNA MÓWIĆ COŚ WAŻNIEJSZEGO (wyższa waga, patrz wyżej).
 *  2. KTOŚ ŚWIADOMIE UCISZA (`uciszPostac`) — wejście w minigrę, przejście
 *     między ekranami, pulpit dev. To jest wyjątek, nie odruch: zwykłe
 *     zamknięcie okna go NIE używa.
 *
 * Osobny wyłącznik samego lektora istnieje (`ttsPlayer.enabled`, sprawdzany
 * w `speak`), ale w świecie nie ma go jeszcze na czym kliknąć — dziś rusza
 * nim tylko `NarratorVoice`.
 *
 * Kto tego używa: `PopupPostaci` (Wizkor i lisek na mapie),
 * `PodpowiedzMedrca` (myśl Wizkora o ciele), `panels/ZadaniePanel`
 * (Wizkor czyta zadanie poza ekranem), `Swiat.jsx` (narratorka).
 * Każde nowe powiadomienie z głosem postaci ma wchodzić tędy, a nie wołać
 * `ttsPlayer` po swojemu — inaczej zasada znów rozjedzie się na cztery kopie.
 */
import { ttsPlayer } from "../services/ttsPlayer.js";
import { odmienDlaGracza } from "../services/rodzaj.js";

/** Waga kwestii — kto kogo przerywa (`08` §5). */
export const WAGA = {
  SZEPT: 1,
  NARRATORKA: 2,
  ROZMOWA: 3,
};

/* ZNACZNIK CZASU OSTATNIEJ KWESTII KAŻDEGO GŁOSU. Czyta go `PodpowiedzMedrca`
   (R7 z `docs/tresci/01`): myśl Wizkora o ciele nie wchodzi, gdy od jego
   ostatniego okna minęło mniej niż dwie minuty. Pamięć modułu, nie
   localStorage — liczy się ta sesja, nie wczorajsza rozmowa. */
const _ostatnia = {};

/** Kiedy (ms od epoki) dany głos mówił ostatnio w tej sesji; 0 = jeszcze nie. */
export function kiedyMowil(glos) {
  return _ostatnia[glos] || 0;
}

/* ── KOLEJKA ────────────────────────────────────────────────────────────
   Trzy rzeczy, których pilnuje ten fragment, bo każda z nich potrafi uciszyć
   lektora do końca sesji:

   1. WŁAŚCICIELA POZNAJEMY PO TOKENIE, nie po wadze. Dwie kwestie tej samej
      wagi rozdzielone `uciszPostac()` miały ten sam „podpis” i stara potrafiła
      zamknąć turę nowej.
   2. STRAŻNIK CZASU. `ttsPlayer` nadpisuje `onended` przy każdym odtworzeniu,
      więc gdy dwa `speak` zachodzą na siebie (jedno z cache, drugie jeszcze
      pobierane), obietnica tego wcześniejszego NIGDY się nie rozwiązuje.
      Bez strażnika `_biezaca` zostawało ustawione na zawsze i wszystko dalsze
      szło do kolejki, z której nic już nie wychodziło.
   3. KAŻDA OBIETNICA SIĘ ROZWIĄZUJE — także ta, którą wypchnięto z kolejki.
      Wołający dostaje `null`, a nie wiszącą w nieskończoność obietnicę. */

/** Ile najdłużej trzymamy turę, jeśli lektor nie zgłosi końca. */
const MAKS_MOWIENIA = 20_000;
/** Po tylu ms kwestia w kolejce jest już nie na temat i przepada. */
const WAZNOSC_KOLEJKI = 20_000;

/** Co jest teraz w ustach lektora: `{ token, waga, straznik }` albo `null`. */
let _biezaca = null;
/** Co czeka: `{ zdanie, glos, ton, waga, kiedy, rozwiaz }` albo `null`. */
let _wKolejce = null;
let _token = 0;

function porzucKolejke() {
  if (!_wKolejce) return;
  const czeka = _wKolejce;
  _wKolejce = null;
  try { czeka.rozwiaz(null); } catch { /* wołający już nie słucha */ }
}

function ruszKolejke() {
  if (_biezaca || !_wKolejce) return;
  const czeka = _wKolejce;
  _wKolejce = null;
  if (Date.now() - czeka.kiedy > WAZNOSC_KOLEJKI) { czeka.rozwiaz(null); return; }
  czeka.rozwiaz(wypusc(czeka.zdanie, czeka.glos, czeka.ton, czeka.waga));
}

function zamknijTure(token) {
  if (!_biezaca || _biezaca.token !== token) return;
  try { clearTimeout(_biezaca.straznik); } catch {}
  _biezaca = null;
  ruszKolejke();
}

function wypusc(zdanie, glos, ton, waga) {
  _ostatnia[glos] = Date.now();
  const token = ++_token;
  let obietnica = null;
  try {
    obietnica = Promise.resolve(
      ttsPlayer.speak(zdanie, { land: glos, tone: ton, interrupt: true }),
    );
  } catch {
    return null;
  }
  let straznik = 0;
  try { straznik = setTimeout(() => zamknijTure(token), MAKS_MOWIENIA); } catch {}
  _biezaca = { token, waga, straznik };
  const koniec = () => zamknijTure(token);
  obietnica.then(koniec, koniec);
  return obietnica;
}

/**
 * Postać mówi. Zwraca obietnicę końca wypowiedzi albo `null`, gdy nic nie
 * poszło w głos. Obietnica kwestii, która czekała i została wypchnięta,
 * rozwiązuje się przez `null` — nigdy nie wisi.
 *
 * Cicho zawodzi: wszystko, co postać mówi, stoi także napisane na ekranie,
 * więc brak TTS-a nie zabiera dziecku informacji, tylko wrażenie.
 *
 * @param {string} tekst
 * @param {object} opcje
 * @param {string} opcje.glos   klucz lektora (`las_decyzji`, `lisek`, `gora_podsumowania`)
 * @param {string} [opcje.ton]
 * @param {number} [opcje.waga] WAGA.* — domyślnie rozmowa, bo tak wołała
 *                              większość miejsc, zanim kolejka powstała
 */
export function powiedzPostacia(tekst, { glos, ton = "mystery", waga = WAGA.ROZMOWA } = {}) {
  if (!tekst || !glos) return null;
  /* TOKENY RODZAJU `{m|ż}` ODMIENIAMY TUTAJ, nie u wołających. To jedyne
     wejście głosu postaci, więc lektor nigdy nie przeczyta klamry ani obu
     form naraz — niezależnie od tego, które okno go zawołało
     (`docs/tresci/01_STANDARD_GLOSOW.md`, R2). */
  const zdanie = odmienDlaGracza(tekst);
  if (!zdanie) return null;

  if (!_biezaca) return wypusc(zdanie, glos, ton, waga);

  /* RÓWNA WAGA TEŻ WCHODZI NA MIEJSCE POPRZEDNIEJ. Nowa karta postaci,
     nowy panel, drugie dotknięcie „przeczytaj” — wszystko to jest wymianą
     tego, co stoi na ekranie, a nie dopisywaniem drugiego zdania do kolejki.
     Kolejkowanie równych rozjeżdżało głos z obrazem: dziecko widziało kartę
     drugą, a lektor kończył pierwszą. */
  if (waga >= _biezaca.waga) {
    porzucKolejke();
    try { clearTimeout(_biezaca.straznik); } catch {}
    _biezaca = null;
    return wypusc(zdanie, glos, ton, waga);
  }

  /* Lżejsza CZEKA — nie odpada. Nocna kwestia narratorki nad otwartym oknem
     Wizkora ma zabrzmieć po nim, a nie przepaść (`02` §3.2). Druga czekająca
     wypycha pierwszą, bo po dwóch kwestiach stara opisuje ekran, którego
     już nie ma. */
  porzucKolejke();
  return new Promise((rozwiaz) => {
    _wKolejce = { zdanie, glos, ton, waga, kiedy: Date.now(), rozwiaz };
  });
}

/**
 * Ucisza NATYCHMIAST i czyści kolejkę. Tylko tam, gdzie cisza jest intencją —
 * nie przy zwykłym zamknięciu okna, bo od tego jest zasada „lektor kończy
 * zdanie” z nagłówka.
 */
export function uciszPostac() {
  if (_biezaca) { try { clearTimeout(_biezaca.straznik); } catch {} }
  _biezaca = null;
  porzucKolejke();
  try { ttsPlayer.stop(); } catch {}
}

/** Czy lektor mówi teraz — do pulpitu DEV i do testów. */
export function stanMowy() {
  return { biezaca: _biezaca ? { ..._biezaca } : null, wKolejce: !!_wKolejce };
}
