/**
 * Service Worker - obsluga push notifications.
 * Minimalna instalacja: tylko push + notificationclick. Bez cache strategy
 * (Vercel ma swoj cache, plus apka dziala online).
 */

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

// Push event - backend wysyla payload {title, body, url, tag}.
// Pokazuje notification z ikoną apki + clicked -> openWindow(url).
self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = { title: "EwolucJA", body: event.data ? event.data.text() : "Nowa wiadomość" };
  }
  const title = data.title || "EwolucJA";
  const options = {
    body: data.body || "Mędrzec ma dla ciebie wiadomość.",
    icon: "/icons/icon-192.png",
    badge: "/icons/icon-192.png",
    tag: data.tag || "ewolucja",
    data: { url: data.url || "/porady" },
    requireInteraction: false,
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

// Klik na notyfikacje -> otworz appke na danym route.
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification?.data?.url || "/porady";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      // Jesli okno apki juz otwarte - przelaczam i nawigujemy
      for (const client of windowClients) {
        try {
          if ("focus" in client) {
            client.focus();
            if ("navigate" in client) client.navigate(url);
            return;
          }
        } catch {}
      }
      // Inaczej otworz nowe
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })
  );
});
