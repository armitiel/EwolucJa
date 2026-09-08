/**
 * Vercel Serverless Function entry point.
 * Wszystkie /api/* request'y trafiają tu. Express obsługuje routing wewnętrznie.
 */
// PIERWSZY import w pliku — patrz komentarz w `api/sentry.js`.
import { Sentry, sentryWlaczone } from "./sentry.js";
import { createApp } from "../backend/src/server.js";

const app = createApp();

// Łapacz błędów Expressa rejestruje się PO trasach, więc siedzi tutaj,
// a nie w `createApp()`. Dzięki temu lokalny serwer deweloperski
// (`npm run dev:back`) zostaje nietknięty.
if (sentryWlaczone) Sentry.setupExpressErrorHandler(app);

export default async function handler(req, res) {
  if (!sentryWlaczone) return app(req, res);

  // Vercel zamraża funkcję zaraz po odesłaniu odpowiedzi, więc zdarzenie
  // wysyłane "w tle" potrafi nigdy nie wyjechać. Czekamy na koniec
  // odpowiedzi i dopiero wtedy opróżniamy kolejkę Sentry.
  const koniecOdpowiedzi = new Promise((resolve) => {
    res.on("finish", resolve);
    res.on("close", resolve);
  });

  app(req, res);
  await koniecOdpowiedzi;
  await Sentry.flush(2000).catch(() => {});
}
