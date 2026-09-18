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
 * DŁUG DO SPŁACENIA: to jest `localStorage`, czyli dorobek nie przechodzi na
 * inne urządzenie i ginie po wyczyszczeniu danych strony — dokładnie ten sam
 * dług, co przy `services/monety.js`. Kształt wpisu jest już taki, żeby dało
 * się go przenieść do pola przy graczu w bazie (jak `lifetime_scores`) bez
 * zmiany niczego poza `odczytaj`/`zapisz`. W ePomost gra chodzi w ramce na
 * cudzej domenie, gdzie przeglądarki potrafią odciąć magazyn strony trzeciej
 * — dlatego każdy dostęp jest w `try`, a brak pamięci znaczy „świat bez
 * śladów", nie awarię.
 */

const KLUCZ = "ewolucja.swiat.slady";

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
  let odtworzone = 0;
  for (const wpis of odczytaj()) {
    const fn = s[wpis.metoda];
    if (typeof fn !== "function") continue;   // metoda z przyszłej wersji danych
    try {
      fn(...(wpis.args || []), { bezAnimacji: true });
      odtworzone += 1;
    } catch (err) {
      console.warn("[sladySwiata] nie udało się odtworzyć śladu", wpis.metoda, err);
    }
  }
  return odtworzone;
}

/** Tylko pulpit testowy — świat bez historii, żeby dało się zagrać od nowa. */
export function wyczyscSlady() {
  try { localStorage.removeItem(KLUCZ); } catch {}
}
