/*!
 * SPDX-FileCopyrightText: © 2026 Amitiel Angelisme <armitiel@gmail.com>
 * SPDX-License-Identifier: LicenseRef-EwolucJA-Proprietary
 *
 * EwolucJA — gra edukacyjna dla dzieci.
 * Produkt powstał w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”;
 * autorskie prawa majątkowe pozostają przy autorze. Licencja: LICENSE.
 */
/**
 * obrazy — bezpieczny tor obrazu W7 (docs/tresci/06 §4.5), strona serwera.
 *
 * PLAN B (bez Vercel Blob). `@vercel/blob` w repo to 0.27.x, które zna tylko
 * `access: 'public'` — nie ma prywatnego magazynu ani podpisanych adresów.
 * Zamiast tego miniatura JPEG (≤ 512 px, ≤ 150 kB, zrobiona w przeglądarce
 * przez canvas, więc BEZ EXIF/GPS) trafia do `missions.miniatura` (BYTEA).
 * Odczyt wyłącznie przez `GET /api/missions/:id/obraz` z podpisanym,
 * krótkotrwałym tokenem (HMAC) albo z tożsamością dziecka/Mentora.
 * Retencja: `missions.obraz_do` (30 dni), czyszczenie w `usunStareObrazy`.
 */
import { createHmac, timingSafeEqual, randomBytes } from "node:crypto";
import { initDatabase } from "../database/db.js";

export const MAX_MINIATURA_BAJTOW = 150 * 1024;
export const MAX_MINIATURA_PX = 512;
export const RETENCJA_DNI = 30;
export const ADRES_TTL_S = 15 * 60;

/* Sekret podpisu: własny, albo JWT_SECRET/CRON_SECRET. Bez żadnego z nich —
   losowy na czas życia procesu (adresy działają tylko na „ciepłej” funkcji;
   w produkcji ustaw IMG_SIGN_SECRET). */
let _sekret = null;
function sekret() {
  if (_sekret) return _sekret;
  const s = process.env.IMG_SIGN_SECRET || process.env.JWT_SECRET || process.env.CRON_SECRET;
  _sekret = s && s.trim() ? s.trim() : randomBytes(32).toString("hex");
  if (!s) console.warn("[obrazy] brak IMG_SIGN_SECRET/JWT_SECRET — podpisy adresów obrazu są tymczasowe (per proces)");
  return _sekret;
}

function b64url(buf) {
  return Buffer.from(buf).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function hmac(dane) {
  return b64url(createHmac("sha256", sekret()).update(dane).digest());
}

/** Token do `?t=` — ważny do `exp` (sekundy epoki). */
export function podpiszAdresObrazu(missionId, ttlS = ADRES_TTL_S) {
  const exp = Math.floor(Date.now() / 1000) + ttlS;
  const dane = `${missionId}.${exp}`;
  return { token: `${exp}.${hmac(dane)}`, wygasa: new Date(exp * 1000).toISOString() };
}

/** Sprawdź token z `?t=`. */
export function sprawdzTokenObrazu(missionId, token) {
  if (typeof token !== "string" || token.length > 200) return false;
  const i = token.indexOf(".");
  if (i <= 0) return false;
  const exp = Number(token.slice(0, i));
  const sig = token.slice(i + 1);
  if (!Number.isInteger(exp) || exp * 1000 < Date.now()) return false;
  const oczek = hmac(`${missionId}.${exp}`);
  const a = Buffer.from(sig), b = Buffer.from(oczek);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Względny adres do <img src> (frontend dokleja API_BASE bez końcowego `/api`, jeśli trzeba). */
export function adresObrazu(missionId, ttlS) {
  const { token, wygasa } = podpiszAdresObrazu(missionId, ttlS);
  return { url: `/api/missions/${encodeURIComponent(missionId)}/obraz?t=${token}`, wygasa };
}

/**
 * Dekoduj `data:image/jpeg;base64,...` albo goły base64 do bufora.
 * Zwraca { buf, typ } albo rzuca Error z czytelnym `kod`.
 */
export function dekodujObraz(wejscie) {
  if (typeof wejscie !== "string" || !wejscie) throw blad("brak_obrazu", "Pole `obraz` (base64) jest wymagane");
  let b64 = wejscie.trim();
  const m = /^data:([a-z0-9/+.-]+);base64,(.*)$/is.exec(b64);
  let typ = "image/jpeg";
  if (m) { typ = m[1].toLowerCase(); b64 = m[2]; }
  if (typ !== "image/jpeg" && typ !== "image/jpg") throw blad("zly_typ", "Dozwolony tylko image/jpeg");
  // Górna granica PRZED dekodowaniem: base64 to ~4/3 bajtów.
  if (b64.length > Math.ceil(MAX_MINIATURA_BAJTOW * 4 / 3) + 16) throw blad("za_duzy", `Miniatura ponad ${MAX_MINIATURA_BAJTOW / 1024} kB`);
  const buf = Buffer.from(b64, "base64");
  if (buf.length < 4 || buf.length > MAX_MINIATURA_BAJTOW) throw blad("za_duzy", `Miniatura ponad ${MAX_MINIATURA_BAJTOW / 1024} kB`);
  if (!(buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff)) throw blad("nie_jpeg", "To nie jest plik JPEG");
  const wym = wymiaryJpeg(buf);
  if (!wym) throw blad("nie_jpeg", "Nie da się odczytać wymiarów JPEG");
  if (wym.w > MAX_MINIATURA_PX || wym.h > MAX_MINIATURA_PX) throw blad("za_duzy_px", `Miniatura ponad ${MAX_MINIATURA_PX} px`);
  if (maExif(buf)) throw blad("exif", "Miniatura nie może zawierać EXIF (zrób ją przez canvas)");
  return { buf, typ: "image/jpeg", szerokosc: wym.w, wysokosc: wym.h };
}

function blad(kod, msg) { const e = new Error(msg); e.kod = kod; e.status = 400; return e; }

/** Szerokość/wysokość z pierwszego markera SOFn. */
export function wymiaryJpeg(buf) {
  let i = 2;
  while (i + 9 < buf.length) {
    if (buf[i] !== 0xff) { i += 1; continue; }
    const marker = buf[i + 1];
    if (marker === 0xff) { i += 1; continue; }
    if (marker === 0xd8 || (marker >= 0xd0 && marker <= 0xd7) || marker === 0x01) { i += 2; continue; }
    const len = buf.readUInt16BE(i + 2);
    const sof = (marker >= 0xc0 && marker <= 0xcf) && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
    if (sof) return { h: buf.readUInt16BE(i + 5), w: buf.readUInt16BE(i + 7) };
    if (marker === 0xda) return null; // SOS bez SOF — uszkodzony
    i += 2 + len;
  }
  return null;
}

/** Czy jest segment APP1 „Exif” (GPS itd.). Canvas.toBlob go nie pisze. */
export function maExif(buf) {
  let i = 2;
  while (i + 4 < buf.length) {
    if (buf[i] !== 0xff) return false;
    const marker = buf[i + 1];
    if (marker === 0xda) return false;
    const len = buf.readUInt16BE(i + 2);
    if (marker === 0xe1 && buf.slice(i + 4, i + 10).toString("latin1") === "Exif\0\0") return true;
    i += 2 + len;
  }
  return false;
}

/** Retencja: wyczyść miniatury po terminie. Zwraca liczbę usuniętych. */
export async function usunStareObrazy() {
  const pool = await initDatabase();
  const { rowCount } = await pool.query(
    `UPDATE missions
        SET miniatura = NULL, miniatura_typ = NULL, pokaz_w_domku = FALSE
      WHERE miniatura IS NOT NULL AND obraz_do IS NOT NULL AND obraz_do < NOW()`
  );
  return rowCount || 0;
}

/* Leniwe czyszczenie: przy okazji ruchu na torze obrazu, najwyżej raz na
   godzinę na proces — na Vercel nie ma pewnego crona bez wpisu w vercel.json. */
let _ostatnieCzyszczenie = 0;
export function czyscPrzyOkazji() {
  const teraz = Date.now();
  if (teraz - _ostatnieCzyszczenie < 60 * 60e3) return;
  _ostatnieCzyszczenie = teraz;
  usunStareObrazy().then((n) => { if (n) console.log(`[obrazy] retencja: usunięto ${n}`); }).catch(() => {});
}
