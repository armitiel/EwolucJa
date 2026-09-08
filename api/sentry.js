/**
 * Sentry dla backendu (Express jako funkcja Vercela).
 *
 * MUSI być importowany jako PIERWSZY w `api/index.js`. SDK podmienia moduły
 * (http, express, pg) w chwili `init`, więc inicjalizacja po imporcie serwera
 * nie objęłaby już niczego — trasy byłyby nieinstrumentowane.
 *
 * Bez `SENTRY_DSN` w środowisku nic się nie dzieje: `npm run dev` na maszynie
 * autora nie wysyła zdarzeń i nie wymaga żadnej konfiguracji.
 */
import * as Sentry from "@sentry/node";

// .trim() nie jest ozdobą — `vercel env add` przez pipe potrafi dokleić \r\n
// na końcu wartości, a DSN ze spacją na końcu jest odrzucany po cichu.
const dsn = (process.env.SENTRY_DSN || "").trim();

if (dsn) {
  Sentry.init({
    dsn,
    environment: (process.env.VERCEL_ENV || "development").trim(),
    release: (process.env.VERCEL_GIT_COMMIT_SHA || "").trim().slice(0, 7) || undefined,
    // Aplikacja dla dzieci 6-12 lat: żadnych ciasteczek, nagłówków, ciał
    // żądań ani adresów IP w zdarzeniu. To ustawienie domyślne SDK, ale
    // przy tej grupie użytkowników ma stać w kodzie wprost.
    sendDefaultPii: false,
    // Same błędy. Tracing zżerałby limit spanów darmowego planu, a przy
    // trzech cronach dziennie nie ma tu czego profilować.
    tracesSampleRate: 0,
  });
}

export { Sentry };
export const sentryWlaczone = Boolean(dsn);
