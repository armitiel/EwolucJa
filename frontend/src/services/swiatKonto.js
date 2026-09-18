/*!
 * SPDX-FileCopyrightText: © 2026 Amitiel Angelisme <armitiel@gmail.com>
 * SPDX-License-Identifier: LicenseRef-EwolucJA-Proprietary
 *
 * EwolucJA — gra edukacyjna dla dzieci.
 * Produkt powstał w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”;
 * autorskie prawa majątkowe pozostają przy autorze. Licencja: LICENSE.
 */
/**
 * swiatKonto — cienka warstwa między pamięcią przeglądarki a kontem gracza
 * dla STANU ŚWIATA (docs/tresci/06 §4.4): dziennik śladów (`hub/sladySwiata.js`)
 * i ramka domku (`hub/ramkaDomku.js`). Do tej pory oba żyły tylko
 * w `localStorage`, więc kwiat posadzony na tablecie nie istniał na telefonie.
 *
 * Jak to działa:
 *  1. START (`AppData.jsx`, po wczytaniu gracza): `GET /players/me/swiat` →
 *     scalenie z lokalnym (unia po kluczu, jak serwer) → zapis lokalny.
 *     Jeśli scena już przeszła „gotowa" i odtworzyła lokalne ślady, dogrywamy
 *     samą różnicę bez animacji (`dograjSlady`).
 *  2. PO KAŻDYM `zapiszSlad` / `zapiszRysunek`: `PUT /players/me/swiat`
 *     z całym lokalnym stanem (serwer scala; 60 śladów + 7 rysunków to
 *     kilkanaście kB), z opóźnieniem 2 s — kilka reakcji naraz idzie jedną
 *     paczką. Odpowiedź (stan po scaleniu) wraca do lokalnego zapisu.
 *  3. OFFLINE: nieudany PUT zostawia znacznik w `ewolucja.swiat.doWyslania`;
 *     następny start (po GET) ponawia. Błędy sieci są ciche (`console.warn`).
 *  4. BEZ GRACZA (`session.getPlayer()` null — demo, pulpit) wszystko zostaje
 *     w `localStorage`, jak dotąd.
 *
 * Obraz misji do ramki (`ramka.obrazMisji`, tor W7): serwer daje podpisany
 * adres na 15 minut. Trzymamy go w `localStorage` z datą wygaśnięcia; domek
 * bierze go przez `pobierzObrazMisji()`, która sama odświeża adres, gdy
 * wygasł (`GET /missions/:id/obraz-adres`).
 */

import { api, session } from "./api.js";
import { adresObrazuPelny, adresZywy } from "./miniatura.js";
import { dograjSlady, scalSlady, sladySwiata, ZDARZENIE_SLADU } from "../hub/sladySwiata.js";
import { rysunki, scalRysunki, ZDARZENIE_RYSUNKU } from "../hub/ramkaDomku.js";
import { wyslijZalegle } from "./zdarzenia.js";

const KLUCZ_DO_WYSLANIA = "ewolucja.swiat.doWyslania";
const KLUCZ_OBRAZU = "ewolucja.domek.obrazMisji";
const OPOZNIENIE_MS = 2000;

let zegar = null;
let wTrakcie = false;
let ponowic = false;
let podpiete = false;
let ostatniGracz = null;

/* ── znacznik „do wysłania" ─────────────────────────────────────────────── */
function oznaczDoWyslania() {
  try { localStorage.setItem(KLUCZ_DO_WYSLANIA, JSON.stringify({ kiedy: new Date().toISOString(), slady: sladySwiata().length, rysunki: rysunki().length })); } catch {}
}
function czyDoWyslania() {
  try { return !!localStorage.getItem(KLUCZ_DO_WYSLANIA); } catch { return false; }
}
function zdejmijDoWyslania() {
  try { localStorage.removeItem(KLUCZ_DO_WYSLANIA); } catch {}
}

/* ── obraz misji w ramce ────────────────────────────────────────────────── */
function zapiszObrazMisji(obraz) {
  try {
    if (obraz && obraz.mission_id && obraz.url) localStorage.setItem(KLUCZ_OBRAZU, JSON.stringify({ mission_id: obraz.mission_id, url: obraz.url, wygasa: obraz.wygasa || null, obraz_do: obraz.obraz_do || null }));
    else localStorage.removeItem(KLUCZ_OBRAZU);
  } catch {}
}
function odczytajObrazMisji() {
  try {
    const o = JSON.parse(localStorage.getItem(KLUCZ_OBRAZU) || "null");
    return o && o.mission_id && o.url ? o : null;
  } catch { return null; }
}

/**
 * Obraz misji do ramki: `{ mission_id, url }` z PEŁNYM adresem albo `null`.
 * Adres podpisany żyje 15 min — po tym czasie pytamy serwer o nowy; bez
 * sieci oddajemy stary (obrazek może się nie wczytać — ramka wróci do kreski).
 */
export async function pobierzObrazMisji() {
  const o = odczytajObrazMisji();
  if (!o) return null;
  if (o.obraz_do && Date.parse(o.obraz_do) < Date.now()) { zapiszObrazMisji(null); return null; }
  if (adresZywy(o.wygasa)) return { mission_id: o.mission_id, url: adresObrazuPelny(o.url) };
  if (!session.getPlayer()) return { mission_id: o.mission_id, url: adresObrazuPelny(o.url) };
  try {
    const swiezy = await api.obrazAdresMisji(o.mission_id);
    if (swiezy?.url) {
      zapiszObrazMisji({ ...o, url: swiezy.url, wygasa: swiezy.wygasa, obraz_do: swiezy.obraz_do || o.obraz_do });
      return { mission_id: o.mission_id, url: adresObrazuPelny(swiezy.url) };
    }
  } catch (err) {
    // 404 `brak_obrazu` = Mentor usunął albo wygasło; reszta = sieć.
    if (err?.status === 404) { zapiszObrazMisji(null); return null; }
    console.warn("[swiatKonto] nie odświeżyłem adresu obrazu:", err?.message || err);
  }
  return { mission_id: o.mission_id, url: adresObrazuPelny(o.url) };
}

/* ── scalanie odpowiedzi serwera z lokalnym ─────────────────────────────── */
function przyjmijStan(stan) {
  if (!stan || typeof stan !== "object") return;
  scalSlady(Array.isArray(stan.slady) ? stan.slady : []);
  const rys = Array.isArray(stan.ramka) ? stan.ramka : stan.ramka?.rysunki;
  scalRysunki(Array.isArray(rys) ? rys : []);
  if (stan.ramka && typeof stan.ramka === "object" && "obrazMisji" in stan.ramka) zapiszObrazMisji(stan.ramka.obrazMisji);
  // Scena mogła już stanąć i odtworzyć lokalny dziennik — dogrywamy różnicę.
  try { dograjSlady(globalThis.__SCENA); } catch {}
}

/* ── wysyłka ────────────────────────────────────────────────────────────── */
async function wyslij() {
  if (zegar) { clearTimeout(zegar); zegar = null; }
  if (!session.getPlayer()) return;
  if (wTrakcie) { ponowic = true; return; }
  wTrakcie = true;
  try {
    const stan = await api.putSwiat({ slady: sladySwiata(), ramka: { rysunki: rysunki() } });
    zdejmijDoWyslania();
    przyjmijStan(stan);
    if (stan?.odrzucone && (stan.odrzucone.slady || stan.odrzucone.rysunki)) {
      console.warn("[swiatKonto] serwer odrzucił wpisy:", stan.odrzucone);
    }
  } catch (err) {
    oznaczDoWyslania();
    console.warn("[swiatKonto] PUT /players/me/swiat nie poszedł — spróbuję przy następnym starcie:", err?.message || err);
  } finally {
    wTrakcie = false;
    if (ponowic) { ponowic = false; zaplanujWysylke(); }
  }
}

/** Debounce 2 s — kilka śladów naraz idzie jedną paczką. */
export function zaplanujWysylke() {
  if (!session.getPlayer()) return;
  oznaczDoWyslania();     // gdyby karta zamknęła się przed upływem 2 s
  if (zegar) clearTimeout(zegar);
  zegar = setTimeout(() => { zegar = null; wyslij(); }, OPOZNIENIE_MS);
}

function podepnij() {
  if (podpiete || typeof window === "undefined") return;
  podpiete = true;
  window.addEventListener(ZDARZENIE_SLADU, zaplanujWysylke);
  window.addEventListener(ZDARZENIE_RYSUNKU, zaplanujWysylke);
}

/**
 * Synchronizacja przy starcie: GET → scal → (ewentualny) PUT zaległych.
 * Idempotentna per gracz — `AppData` może ją wołać przy każdym wczytaniu
 * gracza. Zwraca scalony stan albo `null` (bez gracza / bez sieci).
 */
export async function zsynchronizujSwiat() {
  podepnij();
  const gracz = session.getPlayer();
  if (!gracz) return null;
  let stan = null;
  try {
    stan = await api.getSwiat();
    przyjmijStan(stan);
  } catch (err) {
    console.warn("[swiatKonto] GET /players/me/swiat nie poszedł:", err?.message || err);
  }
  /* Zaległe z offline ALBO pierwszy raz na tym urządzeniu z lokalnym dorobkiem,
     którego konto nie zna (gracz sprzed synchronizacji): wysyłamy, serwer scala. */
  const lokalnychWiecej = stan && (sladySwiata().length > (stan.slady?.length || 0) || rysunki().length > (stan.ramka?.rysunki?.length || 0));
  if (czyDoWyslania() || lokalnychWiecej) await wyslij();
  return stan;
}

/**
 * Wejście z `AppData.jsx`: raz na gracza (zmiana gracza = nowa synchronizacja).
 * Nie czeka na wynik — świat rusza z lokalnego zapisu, konto dojeżdża w tle.
 */
export function uruchomSyncSwiata() {
  const gracz = session.getPlayer();
  if (!gracz || gracz === ostatniGracz) return;
  ostatniGracz = gracz;
  zsynchronizujSwiat().catch(() => {});
  wyslijZalegle().catch(() => {});
}
