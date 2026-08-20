/**
 * notifications — fundament pod powiadomienia mobilne.
 *
 * W prototypie powiadomienia są symulowane wewnątrz aplikacji: trafiają do
 * spokojnej listy na mapie zamiast wyskakiwać. Kształt wpisu jest już taki,
 * jakiego potrzebuje warstwa push (tytuł, treść, cel), więc podłączenie
 * `pushNotifications.js` nie zmieni tej struktury.
 *
 * Reguły, których ta warstwa pilnuje z definicji:
 *  – rodzic/Mentor decyduje, które rodzaje są włączone (PREFS),
 *  – nie ma odliczania, komunikatów o stracie, serii ani losowych nagród,
 *  – każde powiadomienie prowadzi do konkretnego, wartościowego ekranu.
 */

const INBOX_KEY = "ewolucja.powiadomienia";
const PREFS_KEY = "ewolucja.powiadomienia.zgody";

export const KINDS = {
  mentor_accepted: { label: "Mentor zaakceptował misję", defaultOn: true },
  map_ready: { label: "Nowa kraina w świecie", defaultOn: true },
  story_invite: { label: "Zaproszenie od postaci", defaultOn: true },
  mission_reminder: { label: "Przypomnienie o zaczętej misji", defaultOn: false },
  light_moment: { label: "Iskra Dnia", defaultOn: false },
};

export function getPrefs() {
  try {
    const saved = JSON.parse(localStorage.getItem(PREFS_KEY) || "{}");
    const out = {};
    for (const [k, v] of Object.entries(KINDS)) out[k] = k in saved ? !!saved[k] : v.defaultOn;
    return out;
  } catch {
    const out = {};
    for (const [k, v] of Object.entries(KINDS)) out[k] = v.defaultOn;
    return out;
  }
}

export function setPref(kind, on) {
  try {
    const prefs = getPrefs();
    prefs[kind] = !!on;
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch {}
}

/**
 * Skrzynka żyje w localStorage, więc wpisy z poprzednich wersji gry zostają
 * u dziecka na zawsze — razem z nieaktualnym słownictwem („Mapa się
 * rozjaśniła") i celem `/mapa`, który dziś nie jest już bazą. Przepisujemy je
 * przy ODCZYCIE, a nie migracją jednorazową: migracja odpaliłaby się tylko raz
 * i ominęła urządzenia, na których dziecko nie weszło do gry w tym oknie.
 *
 * Docelowo ta funkcja może zniknąć — gdy stare wpisy wygasną z rotacji 30
 * ostatnich powiadomień.
 */
function odswiezStareWpisy(wpis) {
  const stareOdniesienieDoMapy = typeof wpis?.to === "string" && wpis.to.startsWith("/mapa");
  const staryTytul = wpis?.kind === "map_ready" && /^Mapa się rozjaśniła/i.test(wpis?.title || "");
  if (!stareOdniesienieDoMapy && !staryTytul) return wpis;
  return {
    ...wpis,
    // Celowo `null`, a nie `/swiat`: świat jest ekranem, na którym skrzynka
    // stoi otwarta, więc przycisk „zobacz" prowadziłby donikąd.
    to: stareOdniesienieDoMapy ? null : wpis.to,
    title: staryTytul ? "Świat się rozjaśnił" : wpis.title,
  };
}

/**
 * RODZAJE WIESCI, KTORYCH NIE UZYWAMY.
 *
 * `map_ready` („Świat się rozjaśnił — Las Szeptów czeka na ciebie") rodzi się
 * w silniku przygody przy odblokowaniu krainy. Przygoda jest dziś mockupem
 * (patrz `POKAZ_MISJE_PRZYGODY` w `hub/MessageScroll.jsx`), więc ta wieść
 * mówiła dziecku o krainie, do której nie ma jak pójść — i stała w zwoju
 * pod jedynym prawdziwym zadaniem, rozcieńczając je.
 *
 * Filtrujemy przy ODCZYCIE, nie migracją: skrzynka żyje w localStorage, więc
 * wpisy zapisane wcześniej siedzą już na urządzeniach dzieci. `notify` odmawia
 * ich zapisania, a `markRead` (który przepisuje listę) sprząta stare przy
 * pierwszej okazji.
 */
const UKRYTE_RODZAJE = new Set(["map_ready"]);

export function listNotifications() {
  try {
    const zapisane = JSON.parse(localStorage.getItem(INBOX_KEY) || "[]");
    if (!Array.isArray(zapisane)) return [];
    return zapisane.filter((w) => !UKRYTE_RODZAJE.has(w?.kind)).map(odswiezStareWpisy);
  } catch {
    return [];
  }
}

/** Dodaje powiadomienie, o ile rodzic dopuścił ten rodzaj. Deduplikuje po `id`. */
export function notify({ id, kind, title, body, to }) {
  if (!KINDS[kind]) return false;
  if (UKRYTE_RODZAJE.has(kind)) return false;
  if (!getPrefs()[kind]) return false;
  try {
    const list = listNotifications();
    if (list.some((n) => n.id === id)) return false;
    const entry = { id, kind, title, body, to: to || "/swiat", at: new Date().toISOString(), read: false };
    localStorage.setItem(INBOX_KEY, JSON.stringify([entry, ...list].slice(0, 30)));
    return true;
  } catch {
    return false;
  }
}

export function markRead(id) {
  try {
    const list = listNotifications().map((n) => (n.id === id ? { ...n, read: true } : n));
    localStorage.setItem(INBOX_KEY, JSON.stringify(list));
  } catch {}
}

export function unreadCount() {
  return listNotifications().filter((n) => !n.read).length;
}
