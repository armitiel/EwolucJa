/**
 * dev — przełącznik trybu testowego. Jedno źródło prawdy dla wszystkiego,
 * co ma NIE ISTNIEĆ na ekranie dziecka.
 *
 * ZASADA: LOKALNIE ZAWSZE, W PUBLIKACJI NIGDY.
 *
 *   • Lokalnie (serwer deweloperski Vite, `localhost`, adres w sieci domowej)
 *     pulpit jest włączony OD RAZU, bez żadnego parametru, a `Ctrl+Shift+D`
 *     przełącza go w obie strony. Tu nie ma dziecka — jest autor.
 *   • Na publikacji (ewolucja-azure.vercel.app i każdy inny host) pulpit jest
 *     wyłączony i nie da się go włączyć skrótem ani zapisem w przeglądarce.
 *     Zostaje jedno wyjście awaryjne: `?dev=1` w adresie, świadomie wpisane
 *     i NIEZAPAMIĘTYWANE — po wejściu bez parametru pulpitu znów nie ma.
 *
 * Dlaczego zapis w localStorage żyje tylko lokalnie: na produkcji byłby
 * miną. Jedno wejście z `?dev=1` na telefonie dziecka zostawiałoby pulpit
 * na stałe, a nikt by o tym nie pamiętał.
 */
const KLUCZ = "ewolucja.dev";

/** Czy to build z serwera deweloperskiego Vite (`npm run dev`). */
export const buildDeweloperski = !!import.meta.env?.DEV;

/**
 * Czy jesteśmy „u siebie". Sam `import.meta.env.DEV` nie wystarcza: paczkę
 * budujemy też lokalnie (`npm run build` + `preview`) i wtedy też chcemy mieć
 * narzędzia. Rozstrzyga adres, bo to on odróżnia maszynę autora od świata.
 */
export function czyLokalnie() {
  if (buildDeweloperski) return true;
  try {
    const h = window.location.hostname;
    return (
      h === "localhost" ||
      h === "127.0.0.1" ||
      h === "::1" ||
      h === "" ||                       // plik otwarty z dysku
      h.endsWith(".local") ||
      /^192\.168\./.test(h) ||          // telefon w tej samej sieci co komputer
      /^10\./.test(h) ||
      /^172\.(1[6-9]|2\d|3[01])\./.test(h)
    );
  } catch {
    return false;
  }
}

function zParametru() {
  try {
    const v = new URLSearchParams(window.location.search).get("dev");
    if (v === null) return null;
    return v !== "0" && v !== "false";
  } catch {
    return null;
  }
}

function zZapisu() {
  try {
    const s = localStorage.getItem(KLUCZ);
    if (s === "1") return true;
    if (s === "0") return false;
  } catch {}
  return null;
}

/** Czy tryb testowy jest teraz włączony. */
export function czyDev() {
  const zAdresu = zParametru();

  if (!czyLokalnie()) {
    // Publikacja: tylko jawny parametr w adresie, bez zapamiętywania.
    return zAdresu === true;
  }

  // Lokalnie: parametr ma pierwszeństwo i JEST zapamiętywany, żeby przetrwał
  // przeładowania w trakcie pracy.
  if (zAdresu !== null) return ustawDev(zAdresu);

  const zapis = zZapisu();
  return zapis === null ? true : zapis;   // domyślnie: włączony
}

/** Ustawia stan i go zapamiętuje (lokalnie). Zwraca nowy stan. */
export function ustawDev(czy) {
  const stan = !!czy;
  if (czyLokalnie()) {
    try { localStorage.setItem(KLUCZ, stan ? "1" : "0"); } catch {}
  }
  return stan;
}

/** Przełączenie skrótem `Ctrl+Shift+D`. Zwraca nowy stan. */
export function przelaczDev() {
  return ustawDev(!czyDev());
}
