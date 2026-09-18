/*!
 * SPDX-FileCopyrightText: © 2026 Amitiel Angelisme <armitiel@gmail.com>
 * SPDX-License-Identifier: LicenseRef-EwolucJA-Proprietary
 *
 * EwolucJA — gra edukacyjna dla dzieci.
 * Produkt powstał w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”;
 * autorskie prawa majątkowe pozostają przy autorze. Licencja: LICENSE.
 */
/**
 * swiatService — stan świata na koncie gracza (docs/tresci/06 §4.4).
 *
 * `players.swiat` = { wersja, slady: [...], ramka: { rysunki: [...] } }.
 *
 *  - `slady` to DZIENNIK wywołań sceny (nie stan): { metoda, args, zrodlo, kiedy }
 *    — dokładnie kształt z frontend/src/hub/sladySwiata.js. Scalamy po kluczu
 *    (metoda, JSON args, zrodlo, kiedy) bez duplikatów, od najstarszego,
 *    ostatnie LIMIT_SLADOW.
 *  - `ramka.rysunki` to rysunki jedną linią z hub/ramkaDomku.js:
 *    { wersja, dzien, kiedy, punkty: [[x,y],...], zrodlo }; jeden na dzień,
 *    nowszy (po `kiedy`) nadpisuje ten sam dzień; ostatnie LIMIT_RYSUNKOW.
 *
 * Scalanie, nie nadpisywanie: dwa urządzenia (tablet mamy, telefon taty)
 * dopisują do jednego dziennika, a nie kasują sobie nawzajem świata.
 * Ten moduł nie dotyka bazy — czyste funkcje, testowalne bez Postgresa.
 */

/** Metody sceny, które wolno zapisać w dzienniku (06 §4.3 pkt 3). Stała. */
export const DOZWOLONE_METODY = Object.freeze([
  "posadzKwiat", "ulozKamyczki", "dodajGrzyb", "pokazUkryty", "dodajZnak",
  "ustawSladPorady", "ulozKamienie", "ustawLampke", "ustawOczko", "ustawLawke",
  "ustawRamke",
]);
const METODY = new Set(DOZWOLONE_METODY);

export const LIMIT_SLADOW = 200;
export const LIMIT_RYSUNKOW = 7;
export const MAX_ARGOW = 6;
export const MAX_PUNKTOW = 240;      // jak ramkaDomku.js
export const MAX_BODY_BAJTOW = 200 * 1024;

const DZIEN_RE = /^\d{4}-\d{2}-\d{2}$/;

function prymityw(v, maxStr = 64) {
  if (v === null) return true;
  const t = typeof v;
  if (t === "string") return v.length <= maxStr;
  if (t === "number") return Number.isFinite(v);
  return t === "boolean";
}

/* Argument reakcji: prymityw, ALBO płaska lista ≤ 8 prymitywów, ALBO płaski
   obiekt ≤ 8 pól z prymitywami — bo `ustawOczko({...})`, `ustawLawke({...})`,
   `ustawRamke({...})` i `ulozKamyczki(lista)` z 06 §4.3 biorą obiekt/listę. */
function poprawnyArg(a) {
  if (prymityw(a)) return true;
  if (Array.isArray(a)) return a.length <= 8 && a.every((x) => prymityw(x));
  if (a && typeof a === "object") {
    const k = Object.keys(a);
    return k.length <= 8 && k.every((key) => key.length <= 32 && prymityw(a[key]));
  }
  return false;
}

function isoAlboNull(v) {
  if (typeof v !== "string" || v.length > 40) return null;
  const t = Date.parse(v);
  return Number.isFinite(t) ? new Date(t).toISOString() : null;
}

/** Zwraca oczyszczony ślad albo null (odrzucony). */
export function oczyscSlad(w) {
  if (!w || typeof w !== "object") return null;
  if (typeof w.metoda !== "string" || !METODY.has(w.metoda)) return null;
  const args = Array.isArray(w.args) ? w.args : [];
  if (args.length > MAX_ARGOW || !args.every(poprawnyArg)) return null;
  const zrodlo = typeof w.zrodlo === "string" && w.zrodlo.length <= 80 ? w.zrodlo : null;
  const kiedy = isoAlboNull(w.kiedy);
  if (!kiedy) return null;
  return { metoda: w.metoda, args, zrodlo, kiedy };
}

export function kluczSladu(s) {
  return `${s.metoda}|${JSON.stringify(s.args)}|${s.zrodlo ?? ""}|${s.kiedy}`;
}

/** Zwraca oczyszczony rysunek albo null. */
export function oczyscRysunek(r) {
  if (!r || typeof r !== "object") return null;
  if (typeof r.dzien !== "string" || !DZIEN_RE.test(r.dzien)) return null;
  if (!Array.isArray(r.punkty) || r.punkty.length < 2 || r.punkty.length > MAX_PUNKTOW) return null;
  const punkty = [];
  for (const p of r.punkty) {
    if (!Array.isArray(p) || p.length !== 2) return null;
    const [x, y] = p;
    if (typeof x !== "number" || typeof y !== "number" || !Number.isFinite(x) || !Number.isFinite(y)) return null;
    if (x < 0 || x > 1 || y < 0 || y > 1) return null;
    punkty.push([+x.toFixed(4), +y.toFixed(4)]);
  }
  const kiedy = isoAlboNull(r.kiedy) || `${r.dzien}T12:00:00.000Z`;
  const zrodlo = typeof r.zrodlo === "string" && r.zrodlo.length <= 40 ? r.zrodlo : "zachod";
  const wersja = Number.isInteger(r.wersja) && r.wersja > 0 ? r.wersja : 1;
  return { wersja, dzien: r.dzien, kiedy, punkty, zrodlo };
}

/** Znormalizuj to, co leży w bazie (może być {} albo śmieci ze starszej wersji). */
export function normalizujSwiat(raw) {
  const s = raw && typeof raw === "object" ? raw : {};
  const slady = Array.isArray(s.slady) ? s.slady.map(oczyscSlad).filter(Boolean) : [];
  let rys = [];
  if (Array.isArray(s.ramka)) rys = s.ramka;
  else if (s.ramka && typeof s.ramka === "object" && Array.isArray(s.ramka.rysunki)) rys = s.ramka.rysunki;
  const rysunki = rys.map(oczyscRysunek).filter(Boolean);
  const wersja = Number.isInteger(s.wersja) && s.wersja > 0 ? s.wersja : 1;
  return { wersja, slady, ramka: { rysunki } };
}

/**
 * Scal stan z bazy z tym, co przysłał klient. Zwraca { swiat, odrzucone }.
 * `przych` = { slady?, ramka? (lista albo {rysunki}), wersja? }.
 */
export function scalSwiat(stary, przych) {
  const baza = normalizujSwiat(stary);
  const p = przych && typeof przych === "object" ? przych : {};
  const odrzucone = { slady: 0, rysunki: 0 };

  // — ślady —
  const mapa = new Map(baza.slady.map((s) => [kluczSladu(s), s]));
  if (Array.isArray(p.slady)) {
    for (const w of p.slady) {
      const s = oczyscSlad(w);
      if (!s) { odrzucone.slady += 1; continue; }
      const k = kluczSladu(s);
      if (!mapa.has(k)) mapa.set(k, s);
    }
  }
  const slady = [...mapa.values()]
    .sort((a, b) => a.kiedy.localeCompare(b.kiedy))
    .slice(-LIMIT_SLADOW);

  // — ramka —
  let przychRys = null;
  if (Array.isArray(p.ramka)) przychRys = p.ramka;
  else if (p.ramka && typeof p.ramka === "object" && Array.isArray(p.ramka.rysunki)) przychRys = p.ramka.rysunki;
  const poDniu = new Map(baza.ramka.rysunki.map((r) => [r.dzien, r]));
  if (przychRys) {
    for (const w of przychRys) {
      const r = oczyscRysunek(w);
      if (!r) { odrzucone.rysunki += 1; continue; }
      const juz = poDniu.get(r.dzien);
      if (!juz || r.kiedy >= juz.kiedy) poDniu.set(r.dzien, r);
    }
  }
  const rysunki = [...poDniu.values()]
    .sort((a, b) => a.dzien.localeCompare(b.dzien))
    .slice(-LIMIT_RYSUNKOW);

  const wersja = Number.isInteger(p.wersja) && p.wersja > 0 ? Math.max(baza.wersja, p.wersja) : baza.wersja;
  return { swiat: { wersja, slady, ramka: { rysunki } }, odrzucone };
}

/** Rozmiar body w bajtach (Content-Length albo długość JSON). */
export function rozmiarBody(req) {
  const cl = Number(req.headers?.["content-length"]);
  if (Number.isFinite(cl) && cl > 0) return cl;
  try { return Buffer.byteLength(JSON.stringify(req.body ?? {})); } catch { return 0; }
}
