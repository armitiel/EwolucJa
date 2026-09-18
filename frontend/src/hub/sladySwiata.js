/**
 * sladySwiata.js — PAMIĘĆ ŚWIATA O TYM, CO DZIECKO ZROBIŁO POZA EKRANEM.
 *
 * Scena 3D buduje się od zera przy każdym wejściu. Kwiat, który wyrósł
 * wczoraj po zadaniu w realu, jutro by nie istniał — a Wizkor i tak mówi
 * o nim przy powitaniu („przy drzewie wyrósł nowy kwiat"). Ten plik jest tym,
 * co sprawia, że kwiat naprawdę tam jest.
 *
 * TRZYMAMY DZIENNIK, NIE STAN ŚWIATA. Zapisujemy listę wywołań
 * (`{ metoda, args }` prosto z `reakcja_swiata` w danych zadania), a nie
 * wyliczoną z nich mapę obiektów. Dwa powody:
 *
 *  1. Nowa reakcja w danych działa bez zmiany tego pliku — dziennik nie zna
 *     się na kwiatach ani kamyczkach, tylko je powtarza.
 *  2. Odtworzenie idzie DOKŁADNIE tą samą drogą, co pierwsze wywołanie, więc
 *     nie ma dwóch implementacji, które mogą się rozjechać. Metody sceny są
 *     deterministyczne (patrz `scena-3d-src/src/slady.js`), więc ta sama
 *     lista daje ten sam układ.
 *
 * PAMIĘĆ PRZEGLĄDARKI + KONTO. Źródłem prawdy dla sceny jest `localStorage`
 * (działa bez sieci i bez gracza), a `services/swiatKonto.js` trzyma to samo
 * na koncie gracza (`GET/PUT /players/me/swiat`): przy starcie scala oba
 * dzienniki (unia po kluczu, jak `backend/src/services/swiatService.js`),
 * a po każdym `zapiszSlad` wysyła różnicę. Ten plik o sieci nie wie — mówi
 * tylko zdarzeniem `ZDARZENIE_SLADU`, że coś doszło. W ePomost gra chodzi
 * w ramce na cudzej domenie, gdzie przeglądarki potrafią odciąć magazyn
 * strony trzeciej — dlatego każdy dostęp jest w `try`, a brak pamięci znaczy
 * „świat bez śladów", nie awarię.
 */

const KLUCZ = "ewolucja.swiat.slady";

/** Zdarzenie okna po każdym nowym śladzie — nasłuchuje `services/swiatKonto.js`. */
export const ZDARZENIE_SLADU = "ewolucja:sladSwiata";

/* Ile śladów pamiętamy. Sześćdziesiąt to około trzech miesięcy codziennego
   grania — dalej pierwsze kwiaty i tak zniknęłyby pod nowymi, a lista
   w pamięci przeglądarki ma swój koniec. */
const LIMIT = 60;

function odczytaj() {
  try {
    const s = JSON.parse(localStorage.getItem(KLUCZ) || "[]");
    return Array.isArray(s) ? s : [];
  } catch { return []; }
}

function zapisz(lista) {
  try { localStorage.setItem(KLUCZ, JSON.stringify(lista.slice(-LIMIT))); } catch {}
}

/** Wszystkie ślady, od najstarszego. */
export function sladySwiata() { return odczytaj(); }

/** Klucz wpisu — TEN SAM co `kluczSladu` na serwerze, żeby unia była jedna. */
export function kluczSladu(w) {
  return `${w.metoda}|${JSON.stringify(Array.isArray(w.args) ? w.args : [])}|${w.zrodlo ?? ""}|${w.kiedy}`;
}

/**
 * Scala dziennik z konta z lokalnym: unia po kluczu, od najstarszego,
 * ostatnie LIMIT. Zwraca scaloną listę (i zapisuje ją lokalnie). Nic nie
 * kasuje — ślad zostawiony offline na drugim urządzeniu dojdzie, nie zniknie.
 */
export function scalSlady(zdalne) {
  const lokalne = odczytaj();
  if (!Array.isArray(zdalne) || !zdalne.length) return lokalne;
  const mapa = new Map(lokalne.map((w) => [kluczSladu(w), w]));
  for (const w of zdalne) {
    if (!w || typeof w.metoda !== "string" || typeof w.kiedy !== "string") continue;
    const k = kluczSladu(w);
    if (!mapa.has(k)) mapa.set(k, { metoda: w.metoda, args: Array.isArray(w.args) ? w.args : [], zrodlo: w.zrodlo ?? null, kiedy: w.kiedy });
  }
  const lista = [...mapa.values()].sort((a, b) => String(a.kiedy).localeCompare(String(b.kiedy)));
  zapisz(lista);
  return lista.slice(-LIMIT);
}

/**
 * Dopisuje ślad do dziennika. Woła to `odpalReakcjeSwiata` w chwili, gdy
 * dziecko zostawiło ślad — czyli raz, a nie przy każdym wejściu.
 */
export function zapiszSlad(reakcja, zrodlo = null) {
  if (!reakcja?.metoda) return false;
  const lista = odczytaj();
  lista.push({
    metoda: reakcja.metoda,
    args: Array.isArray(reakcja.args) ? reakcja.args : [],
    zrodlo: zrodlo || null,         // id zadania — do analityki i do rozmowy z Mentorem
    kiedy: new Date().toISOString(),
  });
  zapisz(lista);
  try { window.dispatchEvent(new CustomEvent(ZDARZENIE_SLADU, { detail: lista[lista.length - 1] })); } catch {}
  return true;
}

/**
 * Odtwarza cały dziennik w świeżo zbudowanej scenie. Wołane po zdarzeniu
 * „gotowa", w tym samym miejscu, w którym wracają ścięte drzewa i etap domku.
 *
 * `bezAnimacji: true` jest tu istotą rzeczy, a nie oszczędnością: to jest
 * WEJŚCIE DO ŚWIATA, a nie chwila, w której coś rośnie. Kwiaty wystrzeliwujące
 * z ziemi przy każdym starcie zamieniłyby trwały ślad w efekt powitalny
 * i odebrały znaczenie temu jednemu razowi, kiedy naprawdę wyrósł.
 *
 * Zwraca liczbę odtworzonych śladów.
 */
export function odtworzSlady(scena) {
  const s = scena || globalThis.__SCENA;
  if (!s) return 0;
  /* Co już poszło do TEJ sceny — po kluczu wpisu. Dzięki temu `dograjSlady`
     (gdy konto dojedzie po „gotowa") dokłada tylko różnicę, a nie sadzi
     drugiego kwiatu w tym samym miejscu. */
  const odtworzoneKlucze = s.__sladyOdtworzone instanceof Set ? s.__sladyOdtworzone : new Set();
  try { s.__sladyOdtworzone = odtworzoneKlucze; } catch {}
  let odtworzone = 0;
  for (const wpis of odczytaj()) {
    const k = kluczSladu(wpis);
    if (odtworzoneKlucze.has(k)) continue;
    const fn = s[wpis.metoda];
    if (typeof fn !== "function") continue;   // metoda z przyszłej wersji danych
    try {
      fn(...(wpis.args || []), { bezAnimacji: true });
      odtworzoneKlucze.add(k);
      odtworzone += 1;
    } catch (err) {
      console.warn("[sladySwiata] nie udało się odtworzyć śladu", wpis.metoda, err);
    }
  }
  return odtworzone;
}

/**
 * Dogrywa do sceny ślady, których jeszcze nie odtworzyła — wołane przez
 * `swiatKonto.js`, gdy scalanie z kontem skończyło się PO „gotowa". Scena,
 * która jeszcze nie przeszła `odtworzSlady` (brak `__sladyOdtworzone`),
 * dostanie wszystko przy swoim „gotowa" — tu nic nie robimy.
 */
export function dograjSlady(scena) {
  const s = scena || globalThis.__SCENA;
  if (!s || !(s.__sladyOdtworzone instanceof Set)) return 0;
  return odtworzSlady(s);
}

/** Tylko pulpit testowy — świat bez historii, żeby dało się zagrać od nowa. */
export function wyczyscSlady() {
  try { localStorage.removeItem(KLUCZ); } catch {}
}
