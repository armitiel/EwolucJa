/**
 * Klient API V2 — onboarding, cykle, misje, GM.
 */

import { API_BASE } from "../config.js";

async function call(path, opts = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
    ...opts,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  if (!res.ok) {
    let err;
    try {
      err = await res.json();
    } catch {
      err = { error: res.statusText };
    }
    throw new Error(err.error || "Request failed");
  }
  return res.json();
}

export const api = {
  // Players (V1 zachowane)
  createPlayer: (name) => call("/players", { method: "POST", body: { name } }),
  getPlayer: (id) => call(`/players/${id}`),
  getPlayerByLoginCode: (code) => call(`/players/by-code/${encodeURIComponent(code)}`),
  getUnreadHints: (id) => call(`/players/${id}/hints/unread`),
  getAllHints: (id) => call(`/players/${id}/hints/all`),
  markHintViewed: (playerId, hintId) => call(`/players/${playerId}/hints/${hintId}/view`, { method: "POST" }),
  deleteHint: (playerId, hintId) => call(`/players/${playerId}/hints/${hintId}`, { method: "DELETE" }),

  // Onboarding (V2)
  getQuiz: () => call("/onboarding/quiz"),
  submitQuiz: (player_id, answers, name) =>
    call("/onboarding/submit", { method: "POST", body: { player_id, answers, name } }),

  // Cycles
  getCurrentCycle: (player_id) => call(`/cycles/current/${player_id}`),
  startCycle: (player_id) => call("/cycles/start", { method: "POST", body: { player_id } }),

  // Missions
  generateMission: (player_id) => call("/missions/generate", { method: "POST", body: { player_id } }),
  getCurrentMission: (player_id) => call(`/missions/current/${player_id}`),
  submitMissionProof: (mission_id, proof) =>
    call(`/missions/${mission_id}/submit`, { method: "POST", body: proof }),

  // GM
  registerGM: (payload) => call("/gm/register", { method: "POST", body: payload }),
  getGM: (account_id) => call(`/gm/${account_id}`),
  issuePairingCode: (player_id, role_for, issued_by_account_id) =>
    call("/gm/issue-pairing-code", {
      method: "POST",
      body: { player_id, role_for, issued_by_account_id },
    }),
  pairGM: (account_id, pairing_code) =>
    call("/gm/pair", { method: "POST", body: { account_id, pairing_code } }),
  getGMQueue: (account_id) => call(`/gm/${account_id}/queue`),
  verifyMission: (mission_id, payload) =>
    call(`/gm/verify/${mission_id}`, { method: "POST", body: payload }),
};

// Prosta warstwa persistencji (sesja), bo backend SQLite jest single-user-friendly
export const session = {
  PLAYER_KEY: "ewolucja.playerId",
  GM_KEY: "ewolucja.gmAccountId",
  setPlayer(id) {
    try {
      localStorage.setItem(this.PLAYER_KEY, id);
    } catch {}
  },
  getPlayer() {
    try {
      return localStorage.getItem(this.PLAYER_KEY);
    } catch {
      return null;
    }
  },
  setGM(id) {
    try {
      localStorage.setItem(this.GM_KEY, id);
    } catch {}
  },
  getGM() {
    try {
      return localStorage.getItem(this.GM_KEY);
    } catch {
      return null;
    }
  },
  clear() {
    try {
      localStorage.removeItem(this.PLAYER_KEY);
      localStorage.removeItem(this.GM_KEY);
    } catch {}
  },
};
