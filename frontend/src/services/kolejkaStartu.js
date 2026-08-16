/**
 * kolejkaStartu — co się doładowuje PO tym, jak świat już stoi.
 *
 * Problem, który to rozwiązuje: przy wejściu do huba przeglądarka ściągała
 * wszystko naraz — modele 3D, tekstury, dźwięki i muzykę. Pasmo jest jedno,
 * więc każdy kilobajt dźwięku opóźniał model, na który dziecko patrzy.
 * A dźwięki są potrzebne DOPÓŹNIEJ: kroki dopiero gdy ruszy, brzdęk dopiero
 * gdy coś połknie.
 *
 * Zasady kolejki:
 *   1. Nic nie startuje, dopóki nie zawołasz `ruszaj()` — hub robi to, gdy
 *      scena zgłosi „gotowa".
 *   2. Zadania idą PO KOLEI (jedno naraz), według priorytetu — równoległe
 *      pobieranie znowu dzieliłoby pasmo, tyle że później.
 *   3. Każde kolejne wchodzi w `requestIdleCallback`, więc czeka na wolną
 *      chwilę głównego wątku i nie wchodzi w pierwsze klatki animacji.
 *
 * Zadanie może zwrócić obietnicę — kolejka poczeka na nią przed następnym.
 * Błąd jednego zadania nie zatrzymuje reszty (dźwięk to nie fundament gry).
 */
const zadania = [];
let ruszona = false;
let pracuje = false;
const zrobione = new Set();

/**
 * @param {string} nazwa       identyfikator (drugi raz to samo = pomijamy)
 * @param {() => any} zadanie  praca do wykonania; może zwrócić Promise
 * @param {{priorytet?: number}} opcje  mniejsza liczba = wcześniej (domyślnie 5)
 */
export function dodaj(nazwa, zadanie, { priorytet = 5 } = {}) {
  if (zrobione.has(nazwa) || zadania.some((z) => z.nazwa === nazwa)) return;
  zadania.push({ nazwa, zadanie, priorytet });
  zadania.sort((a, b) => a.priorytet - b.priorytet);
  if (ruszona) pchnij();
}

/** Świat stoi — można dociągać resztę. */
export function ruszaj() {
  if (ruszona) return;
  ruszona = true;
  pchnij();
}

/** Czy kolejka jest już pusta (przydatne w testach i w konsoli). */
export function pusta() {
  return ruszona && !pracuje && zadania.length === 0;
}

function wolnaChwila(fn) {
  if (typeof window === "undefined") return;
  // `timeout` jest po to, żeby zadanie weszło nawet wtedy, gdy główny wątek
  // nigdy nie jest bezczynny — a przy renderowaniu 3D bywa, że nie jest.
  if (typeof window.requestIdleCallback === "function") {
    window.requestIdleCallback(fn, { timeout: 1200 });
  } else {
    window.setTimeout(fn, 240);
  }
}

function pchnij() {
  if (pracuje || !ruszona || !zadania.length) return;
  pracuje = true;
  const { nazwa, zadanie } = zadania.shift();
  wolnaChwila(() => {
    let wynik;
    try {
      wynik = zadanie();
    } catch (e) {
      console.warn("[kolejkaStartu]", nazwa, "—", e?.message);
    }
    Promise.resolve(wynik)
      .catch((e) => console.warn("[kolejkaStartu]", nazwa, "—", e?.message))
      .then(() => {
        zrobione.add(nazwa);
        pracuje = false;
        pchnij();
      });
  });
}

export default { dodaj, ruszaj, pusta };
