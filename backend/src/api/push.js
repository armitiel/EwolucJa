/**
 * Push notifications - subscribe/unsubscribe + send daily tips.
 *
 * Endpointy:
 *  GET    /api/push/vapid-public-key           -> { publicKey }
 *  POST   /api/players/:id/push-subscribe      -> { endpoint, keys: { p256dh, auth } }
 *  DELETE /api/players/:id/push-unsubscribe    -> { endpoint }
 *  GET    /api/push/send-daily?slot=poranek    -> Vercel Cron (Bearer CRON_SECRET)
 *
 * VAPID keys (P-256 keypair) trzymane w env:
 *  VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT (mailto:armitiel@gmail.com)
 *
 * Cron Schedule (Vercel) - 3x dziennie:
 *  07:00 poranek, 13:00 południe, 19:00 wieczór (CET; Vercel cron UTC, sprawdz vercel.json)
 */
import { Router } from "express";
import { initDatabase } from "../database/db.js";

const VAPID_PUBLIC = process.env.VAPID_PUBLIC_KEY || "";
const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY || "";
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || "mailto:armitiel@gmail.com";
const CRON_SECRET = process.env.CRON_SECRET || "";

// Lazy load - web-push jest pakietem CommonJS, jego top-level import potrafi wywrocic
// cold-start Vercel Lambda (czasem brak natywnych binarek). Ladujemy dopiero gdy potrzebny.
let _webpush = null;
async function getWebpush() {
  if (_webpush) return _webpush;
  const mod = await import("web-push");
  _webpush = mod.default || mod;
  if (VAPID_PUBLIC && VAPID_PRIVATE) {
    _webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC, VAPID_PRIVATE);
  }
  return _webpush;
}

const SLOT_COPY = {
  poranek:  { title: "EwolucJA — poranek",  body: "Mędrzec szepcze: na ciebie czeka nowa porada. Otwórz Komnatę." },
  poludnie: { title: "EwolucJA — południe", body: "Mędrzec ma dla ciebie coś do przemyślenia. Wpadnij do Komnaty." },
  wieczor:  { title: "EwolucJA — wieczór",  body: "Wieczorna porada od Mędrca już na ciebie czeka." },
};

export function pushRoutes() {
  const router = Router();

  // Publiczny klucz VAPID - frontend potrzebuje by zasubskrybowac push.
  router.get("/vapid-public-key", (req, res) => {
    if (!VAPID_PUBLIC) return res.status(503).json({ error: "VAPID not configured" });
    res.json({ publicKey: VAPID_PUBLIC });
  });

  // Endpoint cron - wysyla notyfikacje do WSZYSTKICH zasubskrybowanych graczy.
  // Vercel Cron wywołuje GET; chronione Bearer CRON_SECRET.
  router.get("/send-daily", async (req, res) => {
    const auth = req.headers.authorization || "";
    if (!CRON_SECRET || auth !== `Bearer ${CRON_SECRET}`) {
      return res.status(401).json({ error: "unauthorized" });
    }
    const slot = (req.query.slot || "poludnie").toString();
    const copy = SLOT_COPY[slot] || SLOT_COPY.poludnie;
    if (!VAPID_PUBLIC) return res.status(503).json({ error: "VAPID not configured" });

    try {
      const webpush = await getWebpush();
      const pool = await initDatabase();
      const { rows } = await pool.query(`SELECT endpoint, p256dh, auth FROM push_subscriptions`);
      let ok = 0, gone = 0, fail = 0;
      const payload = JSON.stringify({ title: copy.title, body: copy.body, url: "/porady", tag: `slot-${slot}` });
      for (const r of rows) {
        try {
          await webpush.sendNotification({ endpoint: r.endpoint, keys: { p256dh: r.p256dh, auth: r.auth } }, payload);
          ok++;
        } catch (e) {
          // 404/410 = subscription wygasla -> sprzataj baze.
          if (e.statusCode === 404 || e.statusCode === 410) {
            gone++;
            await pool.query(`DELETE FROM push_subscriptions WHERE endpoint = $1`, [r.endpoint]).catch(() => {});
          } else {
            fail++;
            console.warn("[push] send failed:", e.statusCode, e.body || e.message);
          }
        }
      }
      res.json({ ok, gone, fail, total: rows.length, slot });
    } catch (e) {
      console.error("[push send-daily]", e);
      res.status(500).json({ error: e.message });
    }
  });

  return router;
}

// Helpery dla routera /players/:id - zarejestrowane bezposrednio w players.js,
// ale logika tu, by trzymac wszystko push-related w jednym pliku.
export async function subscribePush(pool, playerId, body) {
  const endpoint = body?.endpoint;
  const p256dh = body?.keys?.p256dh;
  const auth = body?.keys?.auth;
  if (!endpoint || !p256dh || !auth) {
    throw new Error("endpoint + keys.p256dh + keys.auth required");
  }
  await pool.query(
    `INSERT INTO push_subscriptions (endpoint, player_id, p256dh, auth)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (endpoint) DO UPDATE SET player_id = EXCLUDED.player_id, p256dh = EXCLUDED.p256dh, auth = EXCLUDED.auth`,
    [endpoint, playerId, p256dh, auth]
  );
}

export async function unsubscribePush(pool, playerId, body) {
  const endpoint = body?.endpoint;
  if (!endpoint) throw new Error("endpoint required");
  await pool.query(`DELETE FROM push_subscriptions WHERE endpoint = $1 AND player_id = $2`, [endpoint, playerId]);
}
