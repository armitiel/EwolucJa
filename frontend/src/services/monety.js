/**
 * monety — monety przyznawane po stronie gry, doliczane do liczby z bazy.
 *
 * DLACZEGO TO ISTNIEJE. Backend przyznaje monety wyłącznie przy weryfikacji
 * misji przez Mentora — nie ma końcówki „dodaj graczowi N monet". A gra ma
 * dziś dwa źródła nagród, które z Mentorem nie mają nic wspólnego: zadanie
 * czarodzieja i minigry. Do czasu, aż taka końcówka powstanie, trzymamy ich
 * dorobek lokalnie i DOLICZAMY w HUD-zie:
 *
 *     monety w HUD = player.coins (baza) + bonusMonet() (lokalne)
 *
 * Liczba z bazy zostaje nietknięta, więc nic nie kłamie i nic nie trzeba
 * cofać. Gdy końcówka powstanie, `dodajMonety` ma wysłać wartość na serwer
 * i wyzerować bonus — reszta kodu nie zauważy różnicy.
 *
 * UWAGA NA PODWÓJNE LICZENIE. Tędy idą wyłącznie nagrody, których backend
 * NIE zapisuje. Monet za misję zatwierdzoną przez Mentora tu nie dopisujemy —
 * one już są w bazie i pojawią się przy najbliższym odświeżeniu gracza.
 */
const KLUCZ = "ewolucja.monety.bonus";

/** Zdarzenie dla HUD-u: „liczba się zmieniła, przeczytaj od nowa". */
export const ZDARZENIE_ZMIANY = "ewolucja:monetyZmiana";

/** Lokalny dorobek do doliczenia obok liczby z bazy. */
export function bonusMonet() {
  try { return Math.max(0, Number(localStorage.getItem(KLUCZ)) || 0); } catch { return 0; }
}

/**
 * Dopisuje monety i ogłasza zmianę. `powod` idzie tylko do konsoli — przy
 * dwóch źródłach nagród warto widzieć w logu, skąd wzięła się liczba.
 * @returns {number} nowy stan bonusu
 */
export function dodajMonety(ile, powod = "") {
  const n = Math.max(0, Math.round(Number(ile) || 0));
  if (!n) return bonusMonet();
  const nowy = bonusMonet() + n;
  try { localStorage.setItem(KLUCZ, String(nowy)); } catch {}
  console.info("[monety] +%d (%s) → bonus %d", n, powod || "bez powodu", nowy);
  try {
    window.dispatchEvent(new CustomEvent(ZDARZENIE_ZMIANY, { detail: { dodane: n, bonus: nowy, powod } }));
  } catch {}
  return nowy;
}

/** Zerowanie — do testów z konsoli i do przyszłej migracji na serwer. */
export function wyzerujBonus() {
  try { localStorage.removeItem(KLUCZ); } catch {}
  try {
    window.dispatchEvent(new CustomEvent(ZDARZENIE_ZMIANY, { detail: { dodane: 0, bonus: 0, powod: "zerowanie" } }));
  } catch {}
  return 0;
}
