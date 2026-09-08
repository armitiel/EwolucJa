/**
 * Sentry — błędy z przeglądarki dziecka.
 *
 * PO CO. Scena 3D chodzi na cudzych telefonach, o których nic nie wiemy,
 * a bezgłowy Chromium nie testuje pętli renderowania (patrz CLAUDE.md).
 * Bez tego wywalona scena na starszym Androidzie kończy się zamkniętą
 * kartą i ciszą — nikt tego nie zgłasza.
 *
 * Importowany PIERWSZĄ linią `main.jsx`, żeby globalne łapacze `error`
 * i `unhandledrejection` stały, zanim React zacznie cokolwiek renderować.
 *
 * Bez `VITE_SENTRY_DSN` moduł jest no-opem — `npm run dev:front` nie wysyła
 * nic i nie wymaga konfiguracji.
 */
import * as Sentry from "@sentry/react";

// .trim() nie jest ozdobą — `vercel env add` przez pipe potrafi dokleić \r\n
// na końcu wartości, a DSN ze znakiem końca linii jest odrzucany po cichu.
const dsn = (import.meta.env.VITE_SENTRY_DSN || "").trim();

if (dsn) {
  Sentry.init({
    dsn,
    // Wstrzykiwane w `vite.config.js` z VERCEL_ENV — `import.meta.env.PROD`
    // jest prawdziwe także w buildzie podglądowym i mieszałoby preview
    // z produkcją w jednym strumieniu zgłoszeń.
    environment:
      typeof __EWOLUCJA_ENV__ !== "undefined"
        ? __EWOLUCJA_ENV__
        : import.meta.env.PROD
          ? "production"
          : "development",
    // Wstrzykiwane w `vite.config.js` ze skrótu commita na Vercelu.
    release: typeof __EWOLUCJA_RELEASE__ !== "undefined" ? __EWOLUCJA_RELEASE__ : "dev",

    // ŚWIADOME DECYZJE — nie zmieniaj ich bez przemyślenia, użytkownikiem
    // jest dziecko 6-12 lat:
    // 1. Session Replay (nagranie ekranu) NIE jest włączony. Nagrywanie
    //    sesji małoletnich wymaga zgody rodzica i wpisu w polityce
    //    prywatności — to osobna decyzja, nie efekt uboczny wpięcia SDK.
    // 2. Bez PII: żadnego IP, ciasteczek ani nagłówków w zdarzeniu.
    sendDefaultPii: false,
    // 3. Bez tracingu — darmowy plan ma limit spanów, a scena 3D
    //    generowałaby ich lawinę.
    tracesSampleRate: 0,

    // Szum, który nic nie mówi o grze: pętla ResizeObservera, błędy skryptów
    // z innej domeny (rozszerzenia) i odrzucone `play()` muzyki tła, gdy
    // przeglądarka blokuje autoodtwarzanie przed pierwszym kliknięciem.
    ignoreErrors: [
      "ResizeObserver loop limit exceeded",
      "ResizeObserver loop completed with undelivered notifications",
      /^Script error\.?$/,
      /play\(\) request was interrupted/,
      "The play method is not allowed by the user agent",
      "NotAllowedError",
    ],
    denyUrls: [
      /extensions\//i,
      /^chrome:\/\//i,
      /^chrome-extension:\/\//i,
      /^moz-extension:\/\//i,
    ],
  });
}

export { Sentry };
