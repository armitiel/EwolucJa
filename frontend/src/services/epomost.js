/*!
 * EwolucJA — gra edukacyjna dla dzieci.
 * © 2026 Amitiel Angelisme. Wszelkie prawa zastrzeżone.
 * Powstało w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”.
 * Prawa autorskie należą do autora. Pełna nota: LICENSE.
 */
/**
 * Klient logowania ePomost ("Przygoda on Max").
 *
 * Przepływ (PKCE) — działa tylko gdy gra jest osadzona jako iframe w Portalu:
 *   begin (backend robi verifier)  ->  EduPortal.auth.authorize({codeChallenge})
 *   ->  complete (backend: exchange -> subject -> gracz)  ->  ustaw sesję gracza.
 *
 * SDK wczytujemy DYNAMICZNIE z kanonicznego URL-a (nie bundlujemy, nie forkujemy).
 * Poza iframe Portalu authorize się nie powiedzie — dlatego auto-login odpalamy
 * tylko w iframe, a do samodzielnych testów służy zalogujTestowo() (tylko DEV).
 */
import { API_BASE } from "../config.js";
import { session } from "./api.js";

const EPO_SESSION_KEY = "ewolucja.epomostSession";

async function jpost(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body || {}),
  });
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const j = await res.json();
      if (j && j.error) msg = j.error;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

async function jget(path) {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

/** Czy działamy w iframe (np. osadzeni w Portalu). Wyjątek = cross-origin iframe. */
export function wIframe() {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}

/** Stan integracji z backendu (bez sekretów): env, keyConfigured, testLoginEnabled, sdkUrl. */
export async function statusEpomost() {
  try {
    return await jget("/epomost/status");
  } catch {
    return null;
  }
}

function zapiszSesje(token) {
  try {
    if (token) localStorage.setItem(EPO_SESSION_KEY, token);
  } catch {}
}

/** Handle sesji aplikacji (X-Adventure-Session) — do prywatnych wywołań /api/epomost/*. */
export function sesjaEpomost() {
  try {
    return localStorage.getItem(EPO_SESSION_KEY);
  } catch {
    return null;
  }
}

/**
 * Pełne logowanie przez Portal. Zwraca { player } albo rzuca.
 * Ustawia sesję gracza (localStorage ewolucja.playerId) po sukcesie.
 */
export async function zalogujPrzezPortal() {
  const { attemptId, codeChallenge, sdkUrl } = await jpost("/epomost/begin", {});
  // Dynamiczny import ES-modułu SDK. @vite-ignore: URL runtime, nie bundlujemy.
  const mod = await import(/* @vite-ignore */ sdkUrl);
  const EduPortal = mod.EduPortal || (mod.default && mod.default.EduPortal) || mod.default;
  if (!EduPortal || !EduPortal.auth || typeof EduPortal.auth.authorize !== "function") {
    throw new Error("external_auth_unavailable");
  }
  const out = await EduPortal.auth.authorize({ codeChallenge });
  const code = out && out.code;
  if (!code) throw new Error("external_auth_unavailable");
  let nickname = null;
  try {
    const p = EduPortal.player && EduPortal.player.get ? await EduPortal.player.get() : null;
    nickname = (p && p.nickname) || null;
  } catch {}
  const done = await jpost("/epomost/complete", { attemptId, code, nickname });
  zapiszSesje(done.session);
  if (done.player && done.player.player_id) session.setPlayer(done.player.player_id);
  return done.player;
}

/** Konto testowe / podgląd — TYLKO DEV. Zwraca { player } i ustawia sesję gracza. */
export async function zalogujTestowo(testId = "podglad") {
  const done = await jpost("/epomost/dev-login", { testId });
  zapiszSesje(done.session);
  if (done.player && done.player.player_id) session.setPlayer(done.player.player_id);
  return done.player;
}
