/**
 * Ujednolicenie blizniaczych barw w arkuszach EwolucJA.
 *
 * ZASADA: barwy rozniace sie o mniej niz deltaE 4 (CIE76) sprowadzamy do jednej
 * wartosci kanonicznej. Kanoniczna jest ta, ktora ma juz token w `:root`;
 * jesli grupa nie ma tokenu — najczesciej uzywana barwa w grupie.
 *
 * BEZPIECZNIKI:
 *  1. Nie ruszamy deklaracji `--token: wartosc` dla tokenow kanonicznych.
 *  2. Jesli w JEDNEJ deklaracji dwie rozne barwy zeszlyby sie do tej samej
 *     wartosci (typowo gradient z dwoch bliskich odcieni), cala deklaracja
 *     zostaje nietknieta — inaczej gradient splaszczylby sie do plamy.
 *  3. Deklaracje z `url(` pomijamy (data-URI potrafi zawierac srednik).
 *  4. `var(--token)` wstawiamy TYLKO dla tokenow z globalnego `:root`
 *     (ewolucja.css, hud.css). Tokeny `--adv-*`, `--start-*`, `--night`
 *     zyja na kontenerach i poza nimi nie istnieja.
 */
import fs from "node:fs";
import path from "node:path";

const PROG = 4.0;
const SUCHY = process.argv.includes("--sucho");

const pliki = [
  "frontend/src/hub/styles/hub.css",
  "frontend/public/scena-3d/hud.css",
  "frontend/src/styles/ewolucja.css",
  "frontend/src/adventure/styles/adventure.css",
  "frontend/src/styles/nagroda.css",
  "frontend/src/styles/puzzle-brama.css",
  "frontend/src/styles/kolo-fortuny.css",
  "frontend/src/styles/map-motion-prototype.css",
  "frontend/src/styles/bieg-liska.css",
  "frontend/src/hub/styles/tutorial.css",
  "frontend/src/styles/animations.css",
  "frontend/src/hub/styles/dom.css",
  "frontend/src/styles/wnetrze.css",
  "frontend/src/styles/choinka-launch.css",
];

/* ── kolorymetria ──────────────────────────────────────── */
const rozwin = (h) => (h.length === 4 ? "#" + [...h.slice(1)].map((c) => c + c).join("") : h);
const norm = (h) => rozwin(h).toUpperCase().slice(0, 7);

function lab(hex) {
  let [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  [r, g, b] = [lin(r), lin(g), lin(b)];
  const X = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
  const Y = r * 0.2126 + g * 0.7152 + b * 0.0722;
  const Z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;
  const f = (t) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  const [fx, fy, fz] = [f(X), f(Y), f(Z)];
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
}
const dyst = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const doHex = (r, g, b) => "#" + [r, g, b].map((v) => Number(v).toString(16).padStart(2, "0")).join("").toUpperCase();

/* ── 1. zbierz wszystkie barwy ─────────────────────────── */
const liczniki = {};
const zrodla = pliki.map((p) => ({ p, css: fs.readFileSync(p, "utf8") }));
for (const { css } of zrodla) {
  for (const m of css.matchAll(/#[0-9a-fA-F]{3,8}\b/g)) {
    if (m[0].length === 5 || m[0].length === 9) continue;
    const h = norm(m[0]);
    liczniki[h] = (liczniki[h] || 0) + 1;
  }
  for (const m of css.matchAll(/rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)/g)) {
    const h = doHex(m[1], m[2], m[3]);
    liczniki[h] = (liczniki[h] || 0) + 1;
  }
}

/* ── 2. tokeny z globalnego :root ──────────────────────── */
const globalneTokeny = {};
for (const nazwa of ["frontend/src/styles/ewolucja.css", "frontend/public/scena-3d/hud.css"]) {
  const css = fs.readFileSync(nazwa, "utf8");
  const i = css.indexOf(":root");
  if (i === -1) continue;
  const start = css.indexOf("{", i);
  let g = 0, k = start;
  for (; k < css.length; k++) { if (css[k] === "{") g++; else if (css[k] === "}") { g--; if (!g) break; } }
  const blok = css.slice(start, k);
  for (const m of blok.matchAll(/(--[a-zA-Z0-9-_]+)\s*:\s*(#[0-9a-fA-F]{3,8})\s*[;}]/g)) {
    const h = norm(m[2]);
    if (!globalneTokeny[h]) globalneTokeny[h] = m[1];
  }
}

/* ── 3. klastrowanie ───────────────────────────────────── */
/* Wartosci WSZYSTKICH tokenow (takze tych na kontenerach, jak --p-ink-soft
   czy --adv-*) sa kotwicami nietykalnymi: kazdy token to swiadomie osobna
   decyzja projektowa. `--p-ink` #4e4d76 i `--p-ink-soft` #5A4F77 dziela
   deltaE ponizej 4, ale to jest CELOWA dwustopniowa hierarchia tekstu —
   scalenie ich skasowaloby rozroznienie, ktore ktos zaprojektowal. */
const wartosciTokenow = new Set();
for (const { css } of zrodla) {
  for (const m of css.matchAll(/--[a-zA-Z0-9-_]+\s*:\s*(#[0-9a-fA-F]{3,8})\s*[;}]/g)) {
    if (m[1].length === 5 || m[1].length === 9) continue;
    wartosciTokenow.add(norm(m[1]));
  }
  // takze tokeny zapisane jako rgba() — `--hub-dock-glow`, `--start-panel`, `--p-shadow`
  for (const m of css.matchAll(/--[a-zA-Z0-9-_]+\s*:\s*rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)/g)) {
    wartosciTokenow.add(doHex(m[1], m[2], m[3]));
  }
}

const waga = (h, ile) => (globalneTokeny[h] ? 1e9 : 0) + (wartosciTokenow.has(h) ? 1e6 : 0) + ile;
const posort = Object.entries(liczniki).map(([hex, ile]) => ({ hex, ile, lab: lab(hex) }))
  .sort((a, b) => waga(b.hex, b.ile) - waga(a.hex, a.ile));

const klastry = [];
for (const k of posort) {
  // Kotwica tokenu zaklada WLASNA grupe i nigdy nie wchodzi do cudzej.
  // Barwy bez tokenu doklejaja sie do najblizszej grupy — takze tokenowej.
  const dom = wartosciTokenow.has(k.hex) ? null : klastry.find((c) => dyst(c.srodek, k.lab) < PROG);
  if (dom) dom.czlonkowie.push(k);
  else klastry.push({ srodek: k.lab, czlonkowie: [k] });
}

const mapa = {};          // hex -> kanoniczny hex
const naToken = {};       // kanoniczny hex -> --token
for (const c of klastry) {
  const zTok = c.czlonkowie.find((m) => globalneTokeny[m.hex]);
  const kan = zTok ? zTok.hex : c.czlonkowie[0].hex;
  if (zTok) naToken[kan] = globalneTokeny[kan];
  for (const m of c.czlonkowie) mapa[m.hex] = kan;
}

/* ── 4. przepisanie plikow ─────────────────────────────── */
const RE_KOLOR = /#[0-9a-fA-F]{3,8}\b|rgba?\(\s*\d+[\s,]+\d+[\s,]+\d+\s*(?:[,/][^)]*)?\)/g;
const raport = [];

for (const { p, css } of zrodla) {
  const nazwa = path.basename(p);
  let zmian = 0, tokenow = 0, pominietych = 0;

  // dzielimy na deklaracje, zachowujac srednik
  const kawalki = css.split(/(;)/);
  for (let i = 0; i < kawalki.length; i += 1) {
    const dekl = kawalki[i];
    if (!dekl || dekl === ";" || !RE_KOLOR.test(dekl)) { RE_KOLOR.lastIndex = 0; continue; }
    RE_KOLOR.lastIndex = 0;
    if (dekl.includes("url(")) { pominietych++; continue; }

    /* KAZDA definicja custom property zostaje nietknieta. Ujednolicamy
       UZYCIA barw, nigdy definicje tokenow — token jest swiadoma decyzja
       projektowa i nie moje narzedzie ma ja przesuwac. */
    if (/(^|\s)--[a-zA-Z0-9-_]+\s*:/.test(dekl)) { pominietych++; continue; }

    const trafienia = [...dekl.matchAll(RE_KOLOR)];
    RE_KOLOR.lastIndex = 0;

    /* Czy trafienie siedzi w srodku `var(--token, FALLBACK)`? Zapasowa wartosc
       ma zostac literalem — podmiana na `var(--inny)` zmienia znaczenie zapisu
       i potrafi zrobic z fallbacku odwolanie do zupelnie innego tokenu. */
    const wVar = (idx) => {
      const start = dekl.lastIndexOf("var(", idx);
      if (start === -1) return false;
      return !dekl.slice(start, idx).includes(")");
    };

    const przed = [], po = [];
    for (const t of trafienia) {
      const surowe = t[0];
      if (wVar(t.index)) { przed.push(surowe); po.push(surowe); continue; }
      let h, alfa = null, rgba = false;
      if (surowe.startsWith("#")) {
        if (surowe.length === 5 || surowe.length === 9) { przed.push(surowe); po.push(surowe); continue; }
        h = norm(surowe);
      } else {
        rgba = true;
        const q = surowe.match(/rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)\s*(?:[,/]\s*([^)]*))?\)/);
        h = doHex(q[1], q[2], q[3]);
        alfa = q[4] === undefined ? null : q[4].trim();
      }
      const kan = mapa[h] || h;
      let nowe;
      if (rgba) {
        // Barwa bez zmiany — zostawiamy zapis dokladnie taki, jaki byl.
        // Inaczej diff pucholby od samego przeformatowania odstepow.
        if (kan === h) { przed.push(surowe); po.push(surowe); continue; }
        const [r, g, b] = [1, 3, 5].map((x) => parseInt(kan.slice(x, x + 2), 16));
        nowe = alfa === null ? `rgb(${r},${g},${b})` : `rgba(${r},${g},${b},${alfa})`;
      } else if (naToken[kan]) {
        nowe = `var(${naToken[kan]})`;
      } else if (kan === h && norm(surowe) === surowe.toUpperCase()) {
        // ten sam kolor, tylko wielkosc liter — nie ruszamy
        przed.push(surowe); po.push(surowe); continue;
      } else {
        nowe = kan.toLowerCase();
      }
      przed.push(surowe);
      po.push(nowe);
    }

    // BEZPIECZNIK: kolizja w jednej deklaracji — zostawiamy oryginal
    const rozneWejscia = new Set(przed.map((x) => x.replace(/\s+/g, "").toLowerCase()));
    const rozneWyjscia = new Set(po.map((x) => x.replace(/\s+/g, "").toLowerCase()));
    if (rozneWejscia.size > rozneWyjscia.size) { pominietych++; continue; }

    let nowaDekl = "", kursor = 0;
    trafienia.forEach((t, idx) => {
      nowaDekl += dekl.slice(kursor, t.index) + po[idx];
      kursor = t.index + t[0].length;
      if (po[idx] !== przed[idx]) { zmian++; if (po[idx].startsWith("var(")) tokenow++; }
    });
    nowaDekl += dekl.slice(kursor);
    kawalki[i] = nowaDekl;
  }

  const wynik = kawalki.join("");
  if (!SUCHY && wynik !== css) fs.writeFileSync(p, wynik, "utf8");
  raport.push({ nazwa, zmian, tokenow, pominietych });
}

console.log(SUCHY ? "=== PRZEBIEG SUCHY (nic nie zapisano) ===" : "=== ZAPISANO ===");
console.log(`Barw przed: ${Object.keys(liczniki).length}   grup: ${klastry.length}   tokenow globalnych: ${Object.keys(globalneTokeny).length}`);
console.log("");
let suma = 0, sumaT = 0, sumaP = 0;
for (const r of raport) {
  console.log(`${r.nazwa.padEnd(28)} podmian: ${String(r.zmian).padStart(4)}   w tym var(): ${String(r.tokenow).padStart(3)}   pominietych deklaracji: ${String(r.pominietych).padStart(3)}`);
  suma += r.zmian; sumaT += r.tokenow; sumaP += r.pominietych;
}
console.log(`\nRAZEM podmian: ${suma}, w tym ${sumaT} na var(--token). Deklaracji ominietych przez bezpieczniki: ${sumaP}.`);
