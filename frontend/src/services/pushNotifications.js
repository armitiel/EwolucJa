/**
 * Push notifications - klient.
 *  - isSupported() - przegladarka wspiera Service Worker + Push + Notification API
 *  - getStatus()   - 'unsupported' | 'denied' | 'default' | 'subscribed' | 'permitted-not-subscribed'
 *  - enable()      - request permission + subscribe + POST do backend
 *  - disable()     - unsubscribe + DELETE backend
 *
 * iOS: dziala dopiero od iOS 16.4 + tylko gdy PWA zainstalowana na ekran glowny.
 */
import { api, session } from "./api.js";

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

function arrayBufferToBase64(buffer) {
  if (!buffer) return null;
  const bytes = new Uint8Array(buffer);
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  // base64 standard (web-push akceptuje base64 i base64url, podajemy standard)
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function isSupported() {
  return typeof window !== "undefined"
    && "serviceWorker" in navigator
    && "PushManager" in window
    && "Notification" in window;
}

async function getRegistration() {
  // SW rejestrujemy raz w main.jsx. Tu czekamy az bedzie ready.
  return await navigator.serviceWorker.ready;
}

export async function getStatus() {
  if (!isSupported()) return "unsupported";
  if (Notification.permission === "denied") return "denied";
  if (Notification.permission === "default") return "default";
  try {
    const reg = await getRegistration();
    const sub = await reg.pushManager.getSubscription();
    return sub ? "subscribed" : "permitted-not-subscribed";
  } catch {
    return "default";
  }
}

export async function enable() {
  if (!isSupported()) throw new Error("Twoja przeglądarka nie wspiera powiadomień");

  // 1. Permission (browser-native popup)
  const perm = await Notification.requestPermission();
  if (perm !== "granted") throw new Error("Brak zgody na powiadomienia");

  // 2. VAPID public key z backendu
  const { publicKey } = await api.getPushVapidKey();
  if (!publicKey) throw new Error("Serwer nie ma kluczy push");

  // 3. Subscribe w przegladarce
  const reg = await getRegistration();
  let sub = await reg.pushManager.getSubscription();
  if (!sub) {
    sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    });
  }

  // 4. Zapisz token w backendzie
  const playerId = session.getPlayer();
  if (!playerId) throw new Error("Nie znam gracza");
  const json = sub.toJSON();
  await api.pushSubscribe(playerId, {
    endpoint: json.endpoint,
    keys: { p256dh: json.keys.p256dh, auth: json.keys.auth },
  });

  return { ok: true, endpoint: json.endpoint };
}

export async function disable() {
  if (!isSupported()) return { ok: true };
  const reg = await getRegistration();
  const sub = await reg.pushManager.getSubscription();
  if (!sub) return { ok: true };
  const endpoint = sub.endpoint;
  await sub.unsubscribe();
  try {
    const playerId = session.getPlayer();
    if (playerId) await api.pushUnsubscribe(playerId, { endpoint });
  } catch {}
  return { ok: true };
}
