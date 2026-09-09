/**
 * wskazowki — podpowiedzi, które pokazują palcem JEDNĄ rzecz w HUD-zie.
 *
 * PO CO. Dok ma cztery ikony i dziecko nie ma powodu ich dotykać — nikt mu
 * nie powiedział, co tam jest. Podpowiedź mówi to w miejscu, w którym to
 * widać: chmurka z dzióbkiem wbitym w ikonę i Wizkor, który dwoma zdaniami
 * tłumaczy, po co tam zaglądać.
 *
 * DWA TRYBY, bo to dwie różne sytuacje:
 *
 *   "dymek"     — lekki. Nic nie gaśnie, świat chodzi dalej, chmurka wisi
 *                 chwilę nad ikoną i schodzi sama. Wraca co jakiś czas,
 *                 dopóki dziecko tam nie zajrzy. Do zapraszania.
 *   "reflektor" — mocny. Świat ciemnieje, w świetle zostaje jeden przycisk,
 *                 wskazówka czeka na decyzję. Do rzeczy, bez których dalej
 *                 nie idzie. Dziś nieużywany — czeka gotowy.
 *
 * RYTM POJAWIANIA SIĘ (`poCzasie`, `powtorkaCo`, `maksNaSesje`) jest ŚWIADOMIE
 * późny. Podpowiedź przy pierwszym wejściu wpada w moment, w którym dziecko
 * i tak ma nowy świat, sterowanie i czarodzieja — czyli w najgorszy możliwy.
 * Chmurka odzywa się dopiero, gdy dziecko już pobiegało, a potem najwyżej
 * kilka razy na sesję. Milknie na zawsze, gdy raz zajrzy w to miejsce.
 *
 * Treść jest DANYMI, nie kodem: dopisanie wskazówki do `WSKAZOWKI` to wszystko,
 * czego trzeba — pomiar celu, chmurka i animacje są wspólne (`Reflektor.jsx`).
 */

const KLUCZ = "ewolucja.wskazowki";

/** Zdarzenie dla huba: „pamięć wskazówek się zmieniła" (np. reset z pulpitu). */
export const ZDARZENIE_ZMIANY = "ewolucja:wskazowkiZmiana";

export const WSKAZOWKI = [
  {
    id: "porada-dnia",
    tryb: "dymek",
    /** Selektor celu w HUD — element, w który celuje dzióbek. */
    cel: '[data-testid="hub-dock-porada"]',
    /**
     * Co w przycisku doku jest NAPRAWDĘ widoczne: złote koło 68×68 przyklejone
     * do dolnej krawędzi komórki siatki (`.game-hud-dock button::before`).
     * Bez tego dzióbek celowałby w środek komórki (~107×73), czyli w powietrze
     * nad ikoną, a obręcz byłaby szeroką elipsą zamiast koła.
     */
    obszar: { szer: 68, wys: 68, kotwica: "dol", przesuniecie: 1 },
    promien: "50%",
    /**
     * Który panel huba jest „tym miejscem". Otwarcie go — obojętnie czy przez
     * chmurkę, czy samodzielnie — kończy podpowiedź NA ZAWSZE. Dziecko, które
     * już tam było, nie ma być zapraszane po raz drugi.
     */
    panelCelu: "porada",
    /**
     * Popiersie Mędrca, nie wizerunek z palcem w górze (`/wizTip.webp`).
     * Ta sama grafika, co w chmurce Mędrca o ciele — dziecko ma widzieć jedną
     * postać mówiącą dwie rzeczy, a nie dwóch podobnych czarodziejów. Wskazanie
     * niesie obręcz na ikonie i dzióbek chmurki; palec był trzecim wskaźnikiem.
     */
    postac: "/wizhead.svg",
    tytul: "Porada dnia",
    // Bez przycisku w chmurce — dziecko ma dotknąć TEJ ikony, nie zielonego
    // guzika. Zdanie kończy się wskazaniem, obręcz pokazuje gdzie.
    tekst: "Zostawiam ci tu jedną krótką radę na dziś. Dotknij ikonki i zajrzyj.",

    /** Pierwsza chmurka dopiero po ~75 s w świecie, nie na wejściu. */
    poCzasie: 75000,
    /** Potem co ~3,5 minuty, jeśli dziecko dalej tam nie zajrzało. */
    powtorkaCo: 210000,
    /** Najwyżej tyle razy na jedno wejście do świata. */
    maksNaSesje: 3,
    /** Sama schodzi po tylu ms — to zaproszenie, nie okno do zamknięcia. */
    czasNaEkranie: 9000,
  },
  {
    id: "minigry-liska",
    tryb: "dymek",
    cel: '[data-testid="hub-dock-gry"]',
    obszar: { szer: 68, wys: 68, kotwica: "dol", przesuniecie: 1 },
    promien: "50%",
    panelCelu: "gry",
    postac: "/lisPop.webp",
    tytul: "Pobawimy się?",
    tekst: "Tutaj czekają minigry. Wybierzemy jedną razem!",
    linie: ["Tutaj czekają minigry.", "Wybierzemy jedną razem!"],
    /** Głos jest dodatkiem. Reflektor zawsze pokazuje to samo zdanie tekstem. */
    glos: "lisek",
    poCzasie: 90000,
    powtorkaCo: 240000,
    maksNaSesje: 3,
    czasNaEkranie: 10000,
  },
];

export function wskazowkaPoId(id) {
  return WSKAZOWKI.find((w) => w.id === id) || null;
}

function czytaj() {
  try {
    const s = JSON.parse(localStorage.getItem(KLUCZ) || "null");
    return s && typeof s === "object" ? s : {};
  } catch {
    return {};
  }
}

function zapisz(zapis) {
  try { localStorage.setItem(KLUCZ, JSON.stringify(zapis)); } catch {}
  try { window.dispatchEvent(new CustomEvent(ZDARZENIE_ZMIANY)); } catch {}
}

/** Czy dziecko już wie, co tam jest (raz zajrzało) — wtedy koniec podpowiedzi. */
export function czyPoznana(id) {
  return !!czytaj()[id];
}

/**
 * Pierwsza wskazówka, która ma dziś sens — albo `null`. Kolejność z tablicy
 * jest kolejnością nauki, więc nie sortujemy. O CZASIE decyduje hub; tutaj
 * tylko odsiewamy te, które dziecko już zna.
 */
export function nastepnaWskazowka(kontekst = {}) {
  const zapis = czytaj();
  return (
    WSKAZOWKI.find(
      (w) => !zapis[w.id] && (typeof w.warunek !== "function" || w.warunek(kontekst))
    ) || null
  );
}

/**
 * „Już wiem" — dziecko weszło tam, gdzie podpowiedź wskazywała. Zamknięcie
 * samej chmurki (upłynął czas, dotknięcie obok) NIE liczy się jako poznanie:
 * chmurka ma prawo wrócić, dopóki nie spełniła swojego zadania.
 */
export function oznaczPoznana(id) {
  if (!id) return;
  const zapis = czytaj();
  if (zapis[id]) return;
  zapis[id] = { kiedy: new Date().toISOString() };
  zapisz(zapis);
}

/** Kasowanie pamięci wskazówek — pulpit testowy i konsola. */
export function zresetujWskazowki() {
  try { localStorage.removeItem(KLUCZ); } catch {}
  try { window.dispatchEvent(new CustomEvent(ZDARZENIE_ZMIANY)); } catch {}
}
