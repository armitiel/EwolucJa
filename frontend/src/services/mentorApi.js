/**
 * Klient API mentora — auth, klasy, join.
 * Wszystkie endpointy mentor/* wymagaja cookie sesji (httpOnly JWT).
 * fetch z credentials:'include' przesyla cookie do API.
 */

import { API_BASE } from "../config.js";

async function call(path, opts = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
    credentials: "include",
    ...opts,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  if (!res.ok) {
    let err;
    try { err = await res.json(); } catch { err = { error: res.statusText }; }
    const e = new Error(err.error || "Request failed");
    e.status = res.status;
    throw e;
  }
  return res.json();
}

export const mentorApi = {
  // Auth
  loginUrl: (returnTo = "/mentor") => `${API_BASE}/auth/google/start?state=${encodeURIComponent(returnTo)}`,
  me: () => call("/auth/me"),
  logout: () => call("/auth/logout", { method: "POST" }),

  // Tryb gracza (demo player mentora - bez par, poza klasami)
  getDemoPlayer: () => call("/mentor/me/demo-player"),
  startDemoPlayer: (name) => call("/mentor/me/demo-player", { method: "POST", body: { name } }),
  resetDemoPlayer: () => call("/mentor/me/demo-player", { method: "DELETE" }),

  // Whitelist
  listWhitelist: () => call("/mentor/whitelist"),
  addWhitelist: (email, note) => call("/mentor/whitelist", { method: "POST", body: { email, note } }),
  removeWhitelist: (email) => call(`/mentor/whitelist/${encodeURIComponent(email)}`, { method: "DELETE" }),

  // Klasy
  listClasses: () => call("/mentor/classes"),
  createClass: (data) => call("/mentor/classes", { method: "POST", body: data }),
  getClass: (id) => call(`/mentor/classes/${id}`),
  regenerateCode: (id) => call(`/mentor/classes/${id}/regenerate`, { method: "POST" }),
  deleteStudent: (classId, playerId) => call(`/mentor/classes/${classId}/students/${playerId}`, { method: "DELETE" }),
  getStudent: (classId, playerId) => call(`/mentor/classes/${classId}/students/${playerId}`),
  sendHint: (playerId, data) => call(`/mentor/students/${playerId}/hints`, { method: "POST", body: data }),
  verifyMission: (missionId, decision, comment) => call(`/mentor/missions/${missionId}/verify`, { method: "POST", body: { decision, comment } }),

  // Pary (Rozdarta Mapa) - GM strona
  listPairDefinitions: () => call("/pairs/definitions"),
  suggestPairs: (classId) => call("/pairs/suggest", { method: "POST", body: { classId } }),
  bulkAssignPairs: (assignments, gmAccountId) => call("/pairs/bulk-assign", { method: "POST", body: { assignments, gmAccountId } }),
  assignPair: (data) => call("/pairs/assign", { method: "POST", body: data }),
  listPairsForGm: (gmAccountId) => call(`/pairs/gm/${gmAccountId}/assignments`),
  listActivePairsForClass: (classId) => call(`/mentor/classes/${classId}/pairs`),
  completePair: (assignmentId) => call(`/mentor/pairs/${assignmentId}/complete`, { method: "POST" }),
};

export const joinApi = {
  // Publiczne (bez auth)
  checkCode: (code) => call(`/classes/check?code=${encodeURIComponent(code)}`),
  join: (data) => call("/classes/join", { method: "POST", body: data }),
};
