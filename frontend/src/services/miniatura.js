/*!
 * SPDX-FileCopyrightText: © 2026 Amitiel Angelisme <armitiel@gmail.com>
 * SPDX-License-Identifier: LicenseRef-EwolucJA-Proprietary
 *
 * EwolucJA — gra edukacyjna dla dzieci.
 * Produkt powstał w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”;
 * autorskie prawa majątkowe pozostają przy autorze. Licencja: LICENSE.
 */
/**
 * miniatura — tor obrazu W7 po stronie przeglądarki (docs/tresci/06 §4.5).
 *
 * Zdjęcie dziecka NIGDY nie wychodzi z urządzenia jako plik. Przechodzi przez
 * `<canvas>` i dopiero to, co canvas oddaje, leci do `/missions/:id/miniatura`:
 *
 *   - canvas nie przenosi EXIF-u (a w nim pozycji GPS i modelu telefonu),
 *   - dłuższy bok ≤ 512 px — miniatura do zauważenia, nie fotografia,
 *   - JPEG ≤ 150 kB (jakość 0,82; gdy za dużo — 0,6),
 *   - orientacja: przeglądarki od 2020 same stosują EXIF Orientation przy
 *     dekodowaniu (`image-orientation: from-image`), więc obraz wychodzi tak,
 *     jak dziecko go widziało.
 *
 * `createImageBitmap` z `imageOrientation: "from-image"` jest pierwszym
 * wyborem; starsze WebKity dostają `<img>` z `URL.createObjectURL`.
 */

import { API_BASE } from "../config.js";

export const MAX_PX = 512;
export const MAX_BAJTOW = 150 * 1024;

/** Ile bajtów ma obraz z `data:` URL (base64 → bajty, bez nagłówka). */
export function bajtyDataUrl(dataUrl) {
  const i = typeof dataUrl === "string" ? dataUrl.indexOf(",") : -1;
  if (i < 0) return 0;
  const b64 = dataUrl.slice(i + 1);
  const pad = b64.endsWith("==") ? 2 : b64.endsWith("=") ? 1 : 0;
  return Math.floor((b64.length * 3) / 4) - pad;
}

async function wczytajObraz(plik) {
  if (typeof createImageBitmap === "function") {
    try { return await createImageBitmap(plik, { imageOrientation: "from-image" }); }
    catch { /* stary WebKit — niżej */ }
  }
  const url = URL.createObjectURL(plik);
  try {
    return await new Promise((ok, zle) => {
      const img = new Image();
      img.onload = () => ok(img);
      img.onerror = () => zle(new Error("Nie udało się odczytać zdjęcia."));
      img.src = url;
    });
  } finally {
    // `revoke` po dekodowaniu — obraz jest już w pamięci.
    setTimeout(() => { try { URL.revokeObjectURL(url); } catch {} }, 0);
  }
}

/**
 * Plik → `data:image/jpeg;base64,…` (≤ 512 px, ≤ 150 kB, bez EXIF).
 * Zwraca `{ obraz, szerokosc, wysokosc, bajty }`. Rzuca przy nieczytelnym pliku.
 */
export async function miniaturaZPliku(plik, { maxPx = MAX_PX, maxBajtow = MAX_BAJTOW } = {}) {
  const zrodlo = await wczytajObraz(plik);
  const sw = zrodlo.width || zrodlo.naturalWidth, wy = zrodlo.height || zrodlo.naturalHeight;
  if (!sw || !wy) throw new Error("Nie udało się odczytać zdjęcia.");
  const skala = Math.min(1, maxPx / Math.max(sw, wy));
  const w = Math.max(1, Math.round(sw * skala)), h = Math.max(1, Math.round(wy * skala));
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#fff";           // JPEG nie ma przezroczystości — PNG z alfą dostałby czarne tło
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(zrodlo, 0, 0, w, h);
  try { zrodlo.close?.(); } catch {}
  let obraz = c.toDataURL("image/jpeg", 0.82);
  if (bajtyDataUrl(obraz) > maxBajtow) obraz = c.toDataURL("image/jpeg", 0.6);
  if (bajtyDataUrl(obraz) > maxBajtow) {
    // Bardzo „szumiące" zdjęcie: mniejszy bok, ta sama jakość.
    const c2 = document.createElement("canvas");
    c2.width = Math.max(1, Math.round(w * 0.7)); c2.height = Math.max(1, Math.round(h * 0.7));
    c2.getContext("2d").drawImage(c, 0, 0, c2.width, c2.height);
    obraz = c2.toDataURL("image/jpeg", 0.6);
    return { obraz, szerokosc: c2.width, wysokosc: c2.height, bajty: bajtyDataUrl(obraz) };
  }
  return { obraz, szerokosc: w, wysokosc: h, bajty: bajtyDataUrl(obraz) };
}

/**
 * Adres obrazu z serwera jest WZGLĘDNY (`/api/missions/:id/obraz?t=…`), żeby
 * nie zależał od domeny. W produkcji `API_BASE` to `/api` (ta sama domena),
 * w dev `http://localhost:3001/api` — doklejamy więc bazę bez końcowego `/api`.
 */
export function adresObrazuPelny(url) {
  if (!url || typeof url !== "string") return null;
  if (/^https?:\/\//i.test(url)) return url;
  const baza = String(API_BASE || "").replace(/\/api\/?$/, "");
  return `${baza}${url.startsWith("/") ? "" : "/"}${url}`;
}

/** Czy podpisany adres jeszcze żyje (`wygasa` ISO z serwera, z zapasem 30 s). */
export function adresZywy(wygasa) {
  const t = Date.parse(wygasa || "");
  return Number.isFinite(t) && t - Date.now() > 30_000;
}
