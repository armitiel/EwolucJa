/*!
 * SPDX-FileCopyrightText: © 2026 Amitiel Angelisme <armitiel@gmail.com>
 * SPDX-License-Identifier: LicenseRef-EwolucJA-Proprietary
 *
 * EwolucJA — gra edukacyjna dla dzieci.
 * Produkt powstał w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”;
 * autorskie prawa majątkowe pozostają przy autorze. Licencja: LICENSE.
 */
/**
 * zdarzenia — analityka pętli (docs/tresci/06 §4.12), tabela `zdarzenia`.
 *
 * Bez PII: `gracz` to skrót SHA-256 z id gracza (z solą ANALYTICS_SALT albo
 * JWT_SECRET), obcięty do 24 znaków — wystarcza do liczenia „ilu graczy”
 * i do filtrowania po dziecku z panelu Mentora (serwer sam liczy skrót),
 * a nie da się z niego odzyskać id. Imię nigdy tu nie trafia; pola `dane`
 * są spłaszczane i filtrowane z kluczy wyglądających na dane osobowe.
 *
 * Zapis z serwera (`zrodlo: 'serwer'`): `zadanie.zlecone` (tworzenie misji),
 * `slad.zostawiony` (/missions/:id/submit), `mentor.zauwazyl` (verify).
 * Resztę zdarzeń przysyła klient przez POST /api/analytics/zdarzenia.
 */
import { createHash } from "node:crypto";
import { initDatabase } from "../database/db.js";

export const NAZWY_ZDARZEN = Object.freeze([
  "zadanie.zlecone", "miejsce.wybrane", "hybryda.otwarta", "czescA.wybor",
  "most.odlozony", "slad.zostawiony", "swiat.zareagowal", "mentor.zauwazyl",
  "powrot.po.sladzie", "porada_wykonana", "porada_dnia_pokazana",
]);
const NAZWY = new Set(NAZWY_ZDARZEN);

/* Zdarzenia zapisywane przez serwer — klient NIE powinien ich dublować. */
export const ZDARZENIA_SERWERA = Object.freeze(["zadanie.zlecone", "slad.zostawiony", "mentor.zauwazyl"]);

const KLUCZE_PII = /^(imie|imię|name|player_name|email|nazwisko|telefon|adres)$/i;
const MAX_KLUCZY = 20;
const MAX_STR = 120;

export function czyNazwaZdarzenia(n) {
  return typeof n === "string" && NAZWY.has(n);
}

/** Skrót id gracza (24 hex). null gdy brak. */
export function skrotGracza(playerId) {
  if (!playerId || typeof playerId !== "string") return null;
  const sol = process.env.ANALYTICS_SALT || process.env.JWT_SECRET || "ewolucja";
  return createHash("sha256").update(`${sol}:${playerId}`).digest("hex").slice(0, 24);
}

/** Spłaszcz i oczyść `dane`: tylko prymitywy, bez kluczy PII, limity. */
export function oczyscDane(dane) {
  const out = {};
  if (!dane || typeof dane !== "object" || Array.isArray(dane)) return out;
  let n = 0;
  for (const [k, v] of Object.entries(dane)) {
    if (n >= MAX_KLUCZY) break;
    if (typeof k !== "string" || k.length > 40 || KLUCZE_PII.test(k)) continue;
    if (v === null || v === undefined) continue;
    let w;
    if (typeof v === "string") w = v.slice(0, MAX_STR);
    else if (typeof v === "number") { if (!Number.isFinite(v)) continue; w = v; }
    else if (typeof v === "boolean") w = v;
    else continue; // obiekty/listy odpadają — zdarzenia mają być płaskie
    out[k] = w;
    n += 1;
  }
  return out;
}

function kiedyIso(v) {
  if (typeof v === "string") {
    const t = Date.parse(v);
    // Odrzucamy daty z przyszłości (> 5 min) i sprzed roku — to śmieci zegara.
    if (Number.isFinite(t) && t < Date.now() + 5 * 60e3 && t > Date.now() - 366 * 864e5) return new Date(t).toISOString();
  }
  return new Date().toISOString();
}

/**
 * Zapisz jedno zdarzenie. `playerId` to SUROWE id — skrót liczymy tutaj.
 * Nigdy nie rzuca: analityka nie może wywrócić ścieżki gry.
 */
export async function zapiszZdarzenie(nazwa, playerId, dane = {}, { wersja = null, zrodlo = "serwer", kiedy = null } = {}) {
  if (!czyNazwaZdarzenia(nazwa)) return false;
  try {
    const pool = await initDatabase();
    await pool.query(
      `INSERT INTO zdarzenia (nazwa, gracz, kiedy, dane, wersja, zrodlo) VALUES ($1,$2,$3,$4,$5,$6)`,
      [nazwa, skrotGracza(playerId), kiedyIso(kiedy), JSON.stringify(oczyscDane(dane)),
        wersja == null ? null : String(wersja).slice(0, 32), zrodlo === "klient" ? "klient" : "serwer"]
    );
    return true;
  } catch (e) {
    console.warn("[zdarzenia] nie zapisano", nazwa, e.message);
    return false;
  }
}

/** Zapis paczki z klienta: zwraca { zapisane, odrzucone }. */
export async function zapiszPaczke(lista, domyslnyGracz) {
  let zapisane = 0, odrzucone = 0;
  for (const z of lista) {
    if (!z || typeof z !== "object" || !czyNazwaZdarzenia(z.nazwa)) { odrzucone += 1; continue; }
    const gracz = typeof z.gracz === "string" && z.gracz ? z.gracz : domyslnyGracz;
    const ok = await zapiszZdarzenie(z.nazwa, gracz, z.dane, { wersja: z.wersja, zrodlo: "klient", kiedy: z.kiedy });
    if (ok) zapisane += 1; else odrzucone += 1;
  }
  return { zapisane, odrzucone };
}
