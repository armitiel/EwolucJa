/**
 * adventureState — trwały stan pierwszej przygody.
 *
 * ZASADA (wymóg §11): przejście pierwszej historii NIE MOŻE zależeć od API.
 * Źródłem prawdy jest localStorage. API jest wyłącznie synchronizacją w tle
 * (best-effort) — każdy błąd sieci jest połykany i nie zatrzymuje dziecka.
 *
 * Kształt stanu jest wersjonowany (`v`). Kolejne przygody dokładają się jako
 * dane (nowy plik JSON + wpis w ADVENTURES), bez zmian w tej warstwie.
 */

import { api, session } from "../../services/api.js";

export const STATE_VERSION = 1;

/** Nowy, dziecięcy model 5 cech → istniejące kody profilu (DT/KR/EM/LD/ST/MD).
 *  Dzięki temu radar, raporty mentora i biblioteka misji działają bez zmian. */
export const TRAIT_TO_LEGACY = {
  ciekawosc: ["DT"],
  tworzenie: ["KR"],
  wspolpraca: ["EM", "MD"],
  odwaga: ["LD"],
  wytrwalosc: ["ST"],
};

export const TRAIT_LABELS = {
  ciekawosc: "Ciekawość",
  tworzenie: "Tworzenie",
  wspolpraca: "Współpraca",
  odwaga: "Odwaga",
  wytrwalosc: "Wytrwałość",
};

function storageKey() {
  let pid = null;
  try {
    pid = session.getPlayer();
  } catch {}
  return `ewolucja.adventure.v${STATE_VERSION}.${pid || "anon"}`;
}

export function emptyState(adventure) {
  return {
    v: STATE_VERSION,
    adventureId: adventure?.id || "mapa-iskier",
    adventureVersion: adventure?.version || 1,
    sceneId: adventure?.start || null,
    stepIdx: 0,
    doneScenes: [],
    traits: { ciekawosc: 0, tworzenie: 0, wspolpraca: 0, odwaga: 0, wytrwalosc: 0 },
    grants: [],
    colorId: null,
    color: "#57C7D4",
    location: "przystan",
    unlocked: ["przystan"],
    iskry: [],
    activeMission: null,
    flags: {},
    updatedAt: null,
  };
}

export function loadState(adventure) {
  try {
    const raw = localStorage.getItem(storageKey());
    if (!raw) return emptyState(adventure);
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.v !== STATE_VERSION) return emptyState(adventure);
    // Scal z pustym stanem — nowe pola w kolejnych wydaniach nie wywracają zapisu.
    return { ...emptyState(adventure), ...parsed };
  } catch {
    return emptyState(adventure);
  }
}

export function saveState(state) {
  const next = { ...state, updatedAt: new Date().toISOString() };
  try {
    localStorage.setItem(storageKey(), JSON.stringify(next));
  } catch {}
  syncToApi(next);
  return next;
}

/** Przenosi zapis z klucza "anon" na klucz gracza (po utworzeniu konta w trakcie przygody). */
export function adoptAnonState() {
  try {
    const anonKey = `ewolucja.adventure.v${STATE_VERSION}.anon`;
    const raw = localStorage.getItem(anonKey);
    if (!raw) return;
    const target = storageKey();
    if (target === anonKey) return;
    if (!localStorage.getItem(target)) localStorage.setItem(target, raw);
    localStorage.removeItem(anonKey);
  } catch {}
}

/** Suma cech przełożona na stare kody — karmi lifetime_scores i wybór archetypu. */
export function toLegacyScores(traits) {
  const out = { EM: 0, ST: 0, KR: 0, LD: 0, DT: 0, MD: 0 };
  for (const [trait, value] of Object.entries(traits || {})) {
    const codes = TRAIT_TO_LEGACY[trait];
    if (!codes || !value) continue;
    // Cecha rozdzielona na dwa kody (współpraca → EM+MD) dzieli punkty, nie mnoży ich.
    const share = value / codes.length;
    for (const code of codes) out[code] += share;
  }
  for (const k of Object.keys(out)) out[k] = Math.round(out[k]);
  return out;
}

export function dominantTrait(traits) {
  let best = null;
  let bestVal = -1;
  for (const [k, v] of Object.entries(traits || {})) {
    if (v > bestVal) {
      bestVal = v;
      best = k;
    }
  }
  return best;
}

let syncTimer = null;
let lastSyncPayload = null;

/** Synchronizacja w tle. Nigdy nie rzuca i nigdy nie blokuje interfejsu. */
function syncToApi(state) {
  let pid = null;
  try {
    pid = session.getPlayer();
  } catch {}
  if (!pid) return;
  const payload = JSON.stringify(state);
  if (payload === lastSyncPayload) return;
  lastSyncPayload = payload;
  clearTimeout(syncTimer);
  syncTimer = setTimeout(() => {
    try {
      api.saveAdventureState(pid, state).catch(() => {});
    } catch {}
  }, 800);
}

/** Pobiera stan z serwera i scala, jeśli jest świeższy niż lokalny. */
export async function hydrateFromApi(localState) {
  let pid = null;
  try {
    pid = session.getPlayer();
  } catch {}
  if (!pid) return localState;
  try {
    const remote = await api.getAdventureState(pid);
    if (!remote || remote.v !== STATE_VERSION) return localState;
    if (!localState?.updatedAt) return { ...localState, ...remote };
    if (remote.updatedAt && remote.updatedAt > localState.updatedAt) {
      return { ...localState, ...remote };
    }
  } catch {}
  return localState;
}
