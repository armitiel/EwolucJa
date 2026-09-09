/**
 * leniwyImport — `React.lazy`, który przeżywa wdrożenie.
 *
 * PROBLEM, KTÓRY TO ROZWIĄZUJE. Vite tnie aplikację na kawałki z odciskiem
 * treści w nazwie: `KoloFortuny-CNoj3yOK.js`. Po każdym wdrożeniu odcisk jest
 * inny, a stare pliki znikają z serwera. Karta otwarta PRZED wdrożeniem ma
 * w pamięci stary `index.html` i dalej prosi o stare nazwy — więc pierwszy
 * kawałek, którego jeszcze nie zdążyła pobrać, wraca jako 404:
 *
 *     TypeError: Failed to fetch dynamically imported module:
 *     https://…/assets/KoloFortuny-CNoj3yOK.js
 *
 * Najbardziej narażone są ekrany otwierane RZADKO — koło fortuny, wnętrze
 * domku, reżyserka. Dziecko trzyma grę otwartą godzinami, my wdrażamy w tym
 * czasie trzy razy, a apka wykłada się dopiero wtedy, gdy sięgnie po ekran,
 * którego wcześniej nie otwierało. Z zewnątrz wygląda to na losową awarię.
 *
 * CO ROBIMY. Nieudany import to prawie zawsze „plik się przesunął", a nie
 * „internet nie działa" — a na to jedynym lekarstwem jest przeładowanie
 * strony, bo dopiero ono pobierze nowy `index.html` z nowymi nazwami.
 * Przeładowujemy więc RAZ, cicho, i wracamy dokładnie tam, gdzie dziecko było
 * (adres się nie zmienia).
 *
 * DLACZEGO TYLKO RAZ. Gdyby przeładowanie nie pomogło (naprawdę brak sieci,
 * plik faktycznie nie istnieje, serwer pada), pętla przeładowań byłaby gorsza
 * niż sam błąd: ekran migałby bez końca, bez żadnej informacji. Znacznik
 * w `sessionStorage` przepuszcza jedną próbę na kartę; druga porażka leci
 * dalej jako zwykły błąd, do obsłużenia wyżej. Znacznik kasuje się po
 * pierwszym udanym imporcie, więc kolejne wdrożenie znów dostaje swoją szansę.
 */
import { lazy } from "react";

const KLUCZ = "ewolucja.przeladowano-po-wdrozeniu";

function pamiec() {
  // Prywatne okno albo zablokowane dane witryny — wtedy po prostu nie mamy
  // gdzie zapisać znacznika i rezygnujemy z przeładowania. Lepiej pokazać
  // błąd niż ryzykować pętlę bez bezpiecznika.
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

/** Czy ten błąd wygląda na „kawałek aplikacji zniknął z serwera". */
function toZnikniętyKawałek(blad) {
  const tekst = String(blad?.message || blad || "");
  return (
    /Failed to fetch dynamically imported module/i.test(tekst)
    || /error loading dynamically imported module/i.test(tekst)
    || /Importing a module script failed/i.test(tekst)   // Safari
    || /'text\/html' is not a valid JavaScript MIME type/i.test(tekst) // 404 -> index.html
  );
}

/**
 * Zamiennik `lazy(() => import(...))`. Używać WSZĘDZIE zamiast gołego `lazy`,
 * bo każdy leniwy import jest tak samo narażony.
 */
export function leniwy(zaladuj) {
  return lazy(() =>
    zaladuj()
      .then((modul) => {
        // Udany import = aplikacja jest spójna. Zwalniamy bezpiecznik,
        // żeby następne wdrożenie też mogło się poratować.
        try { pamiec()?.removeItem(KLUCZ); } catch {}
        return modul;
      })
      .catch((blad) => {
        const magazyn = pamiec();
        if (!magazyn || !toZnikniętyKawałek(blad) || magazyn.getItem(KLUCZ)) throw blad;
        try { magazyn.setItem(KLUCZ, String(Date.now())); } catch { throw blad; }
        window.location.reload();
        // Strona zaraz zniknie. Obietnica, która nigdy się nie kończy, trzyma
        // `Suspense` na zasłonie ładowania zamiast mignąć błędem tuż przed
        // przeładowaniem.
        return new Promise(() => {});
      })
  );
}

/**
 * To samo zabezpieczenie dla `<link rel="modulepreload">`, które Vite wstawia
 * przed leniwym importem. Preload potrafi paść WCZEŚNIEJ niż sam import i
 * wtedy `leniwy` nie ma czego łapać. Wołane raz, z `main.jsx`.
 */
export function pilnujWdrozen() {
  window.addEventListener("vite:preloadError", (zdarzenie) => {
    const magazyn = pamiec();
    if (!magazyn || magazyn.getItem(KLUCZ)) return;   // niech leci normalnym torem
    zdarzenie.preventDefault();
    try { magazyn.setItem(KLUCZ, String(Date.now())); } catch { return; }
    window.location.reload();
  });
}
