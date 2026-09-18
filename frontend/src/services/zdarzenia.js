/*!
 * SPDX-FileCopyrightText: © 2026 Amitiel Angelisme <armitiel@gmail.com>
 * SPDX-License-Identifier: LicenseRef-EwolucJA-Proprietary
 *
 * EwolucJA — gra edukacyjna dla dzieci.
 * Produkt powstał w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”;
 * autorskie prawa majątkowe pozostają przy autorze. Licencja: LICENSE.
 */
/**
 * zdarzenia — analityka PĘTLI na naszym serwerze (docs/tresci/06 §4.12),
 * `POST /api/analytics/zdarzenia`. To NIE jest Vercel Web Analytics
 * (`analityka.jsx`): tam idą odsłony i zdarzenia „czy ktoś w ogóle wchodzi",
 * tu — zdarzenia, z których liczy się miary sukcesu z OPIS_PROJEKTU
 * („ilu wróciło po śladzie", „ile razy świat zareagował").
 *
 * Zasady:
 *  - paczka do 50 zdarzeń, wysyłka co 5 s albo od razu, gdy paczka pełna;
 *  - przy schowaniu karty / zamknięciu (`visibilitychange`, `pagehide`)
 *    `navigator.sendBeacon` z JSON-em — beacon nie niesie nagłówka
 *    `X-Player-Id`, więc gracz idzie w body jako `gracz` (serwer to
 *    przyjmuje i i tak zapisuje tylko skrót);
 *  - nic nie ginie po ciemku: nieudana paczka trafia do `localStorage`
 *    i wychodzi przy następnym starcie;
 *  - `dane` są PŁASKIE (tekst / liczba / prawda-fałsz), bez imion — serwer
 *    i tak wytnie klucze wyglądające na dane osobowe;
 *  - `wersja` z `dane.wersja` idzie też na wierzch zdarzenia (kolumna);
 *  - wyciszenie: ten sam zapis `ewolucja.bez-analityki` co w `analityka.jsx`
 *    (`?analityka=off` na urządzeniu autora). Localhost NIE wycisza — na dev
 *    zdarzenia mają dojść do lokalnego backendu, inaczej nie da się ich
 *    sprawdzić.
 *
 * Zdarzenia zapisywane PRZEZ SERWER (`zadanie.zlecone`, `slad.zostawiony`,
 * `mentor.zauwazyl`) klient pomija — dublowałyby liczniki.
 */

import { API_BASE } from "../config.js";
import { session } from "./api.js";

export const NAZWY_PETLI = Object.freeze([
  "zadanie.zlecone", "miejsce.wybrane", "hybryda.otwarta", "czescA.wybor",
  "most.odlozony", "slad.zostawiony", "swiat.zareagowal", "mentor.zauwazyl",
  "powrot.po.sladzie", "porada_wykonana", "porada_dnia_pokazana",
]);
const ZDARZENIA_SERWERA = new Set(["zadanie.zlecone", "slad.zostawiony", "mentor.zauwazyl"]);
const NAZWY = new Set(NAZWY_PETLI);

const KLUCZ_KOLEJKI = "ewolucja.zdarzenia.doWyslania";
const KLUCZ_WYCISZENIA = "ewolucja.bez-analityki";
const MAX_PACZKA = 50;
const MAX_W_KOLEJCE = 200;
const ODSTEP_MS = 5000;

let kolejka = [];
let zegar = null;
let wTrakcie = false;
let podpiete = false;

/** Czy zdarzenie należy do pętli (ma sens dla naszego serwera). */
export function czyZdarzeniePetli(nazwa) {
  return typeof nazwa === "string" && NAZWY.has(nazwa) && !ZDARZENIA_SERWERA.has(nazwa);
}

function wyciszone() {
  try { return localStorage.getItem(KLUCZ_WYCISZENIA) === "1"; } catch { return false; }
}

function plaskie(dane) {
  const out = {};
  if (!dane || typeof dane !== "object") return out;
  for (const [k, v] of Object.entries(dane)) {
    if (v === null || v === undefined) continue;
    const t = typeof v;
    if (t === "string") out[k] = v.slice(0, 120);
    else if (t === "number" && Number.isFinite(v)) out[k] = v;
    else if (t === "boolean") out[k] = v;
    // obiekty i listy odpadają — zdarzenia mają być płaskie
  }
  return out;
}

function adres() { return `${API_BASE}/analytics/zdarzenia`; }

function naglowki() {
  const h = { "Content-Type": "application/json" };
  const id = session.getPlayer();
  if (id) h["X-Player-Id"] = id;
  return h;
}

function odczytajZaległe() {
  try {
    const s = JSON.parse(localStorage.getItem(KLUCZ_KOLEJKI) || "[]");
    return Array.isArray(s) ? s : [];
  } catch { return []; }
}

function odlozNaPozniej(lista) {
  if (!lista.length) return;
  try {
    const razem = [...odczytajZaległe(), ...lista].slice(-MAX_W_KOLEJCE);
    localStorage.setItem(KLUCZ_KOLEJKI, JSON.stringify(razem));
  } catch {}
}

function wyczyscZaległe() {
  try { localStorage.removeItem(KLUCZ_KOLEJKI); } catch {}
}

/** Wyślij paczkę przez fetch (keepalive — działa też tuż przed zamknięciem). */
async function wyslijFetch(lista) {
  const res = await fetch(adres(), {
    method: "POST",
    headers: naglowki(),
    body: JSON.stringify({ zdarzenia: lista, gracz: session.getPlayer() || undefined }),
    keepalive: true,
  });
  if (!res.ok) throw new Error(`analytics ${res.status}`);
}

/** Wyślij paczkę beaconem (bez nagłówków — gracz w body). `true` gdy przyjęte do kolejki przeglądarki. */
function wyslijBeacon(lista) {
  try {
    if (typeof navigator === "undefined" || typeof navigator.sendBeacon !== "function") return false;
    const body = JSON.stringify({ zdarzenia: lista, gracz: session.getPlayer() || undefined });
    return navigator.sendBeacon(adres(), new Blob([body], { type: "application/json" }));
  } catch { return false; }
}

/** Opróżnij bufor: fetch; gdy się nie uda — do `localStorage` na następny start. */
export async function wyslijTeraz() {
  if (wTrakcie) return;
  if (zegar) { clearTimeout(zegar); zegar = null; }
  const paczka = kolejka.splice(0, MAX_PACZKA);
  if (!paczka.length) return;
  wTrakcie = true;
  try {
    await wyslijFetch(paczka);
  } catch (err) {
    console.warn("[zdarzenia] nie wysłano paczki — odkładam:", err?.message || err);
    odlozNaPozniej(paczka);
  } finally {
    wTrakcie = false;
  }
  if (kolejka.length) zaplanuj();
}

function zaplanuj() {
  if (zegar) return;
  zegar = setTimeout(() => { zegar = null; wyslijTeraz(); }, ODSTEP_MS);
}

/* Schowanie karty / zamknięcie: to, co w buforze, idzie beaconem od razu —
   `setTimeout` po `pagehide` już nie zadziała. */
function przyUkryciu() {
  if (!kolejka.length) return;
  const paczka = kolejka.splice(0, MAX_PACZKA);
  if (!wyslijBeacon(paczka)) odlozNaPozniej(paczka);
  if (kolejka.length) odlozNaPozniej(kolejka.splice(0));
}

function podepnij() {
  if (podpiete || typeof window === "undefined") return;
  podpiete = true;
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") przyUkryciu(); });
  window.addEventListener("pagehide", przyUkryciu);
}

/**
 * Zdarzenie pętli. `dane` płaskie; `opcje.wersja` (albo `dane.wersja`) idzie
 * na wierzch. Nigdy nie rzuca — analityka nie może wywrócić ścieżki gry.
 */
export function zdarzenie(nazwa, dane = {}, opcje = {}) {
  try {
    if (!czyZdarzeniePetli(nazwa) || wyciszone()) return false;
    const czyste = plaskie(dane);
    const wersja = opcje.wersja ?? czyste.wersja ?? null;
    const gracz = session.getPlayer() || undefined;
    kolejka.push({
      nazwa,
      dane: czyste,
      kiedy: new Date().toISOString(),
      ...(wersja != null ? { wersja: String(wersja).slice(0, 32) } : {}),
      ...(gracz ? { gracz } : {}),
    });
    podepnij();
    if (kolejka.length >= MAX_PACZKA) wyslijTeraz();
    else zaplanuj();
    return true;
  } catch {
    return false;
  }
}

/**
 * Ponowna próba dla paczek odłożonych w poprzedniej sesji. Wołane raz przy
 * starcie (`AppData.jsx`, razem z synchronizacją świata). Cicho przy braku sieci.
 */
export async function wyslijZalegle() {
  const zaległe = odczytajZaległe();
  if (!zaległe.length) return 0;
  wyczyscZaległe();
  let poszlo = 0;
  for (let i = 0; i < zaległe.length; i += MAX_PACZKA) {
    const paczka = zaległe.slice(i, i + MAX_PACZKA);
    try { await wyslijFetch(paczka); poszlo += paczka.length; }
    catch { odlozNaPozniej(paczka); }
  }
  return poszlo;
}
