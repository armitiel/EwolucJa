/**
 * Krok 3 systemu stylow: literalne barwy -> var(--token) z public/tokeny.css.
 *
 * BEZSTRATNE. Podmieniamy TYLKO barwy, ktorych hex jest DOKLADNIE wartoscia
 * tokenu zdefiniowanego w globalnym `:root{}` w public/tokeny.css. Wyjatek:
 * cztery odcienie z listy FOLD, ktore leza deltaE < 4 od tokenu (polityka
 * z 9.09.2026, ta sama co w ujednolic-barwy.mjs) i zostaly wtedy przeoczone,
 * bo token jeszcze nie istnial.
 *
 * Zapis z alfa:  rgba(79,43,12,.5)  ->  color-mix(in srgb, var(--braz-800) 50%, transparent)
 * To ta sama barwa (color-mix w srgb z `transparent` = ten kolor z alfa),
 * ale odcien jest teraz JEDEN, w rampie. Repo uzywa juz color-mix, wiec
 * nie podnosimy wymagan wobec przegladarek.
 *
 * BEZPIECZNIKI:
 *  1. Komentarze — nietykane (komentarz w tym repo to dokumentacja).
 *  2. `url(` w deklaracji — cala deklaracja pominieta (data-URI ma sredniki).
 *  3. Zapasowa wartosc w `var(--x, #hex)` — zostaje literalem.
 *  4. Definicja `--cos: ...` dostaje TYLKO nieprzezroczysty hex -> var(),
 *     nigdy color-mix (JS czytajacy getPropertyValue dostalby funkcje, nie kolor).
 *  5. #FFFFFF i #000000 — nigdy (biel i czern to nie „odcien z rampy").
 *  6. Tokeny z kontenerow (--adv-*, --hud-* poza :root) nie sa zrodlem podmian.
 *  7. Kolizja w jednej deklaracji (dwa rozne wejscia -> to samo wyjscie, mozliwe
 *     tylko przez FOLD) — deklaracja nietknieta, zeby nie splaszczyc gradientu.
 *
 * Uzycie:  node scripts/tokenizuj-barwy.mjs --sucho   (raport, nic nie zapisuje)
 *          node scripts/tokenizuj-barwy.mjs           (zapisuje)
 */
import fs from "node:fs";
import path from "node:path";

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
].filter((p) => fs.existsSync(p));

/* Odcienie deltaE < 4 od tokenu — polityka scalania z 9.09.2026 */
const FOLD = {
  "#F5C45E": "#F4C95D", // -> --zloto-300 (3.7)
  "#FFFAF0": "#FFFDF4", // -> --tlo-jasne (1.5)
  "#FFF9E5": "#FFFBE0", // -> --krem-50 (3.6)
  "#FFF9D9": "#FFFBE0", // -> --krem-50 (2.7) — dawna gora kremu HUD
};
const NIGDY = new Set(["#FFFFFF", "#000000"]);

const rozwin = (h) => (h.length === 4 ? "#" + [...h.slice(1)].map((c) => c + c).join("") : h);
const norm = (h) => rozwin(h).toUpperCase().slice(0, 7);
const doHex = (r, g, b) => "#" + [r, g, b].map((v) => Number(v).toString(16).padStart(2, "0")).join("").toUpperCase();

/* ── 1. tokeny z globalnego :root w tokeny.css ─────────────────────── */
const tokenyCss = fs.readFileSync("frontend/public/tokeny.css", "utf8");
const tokeny = {}; // hex -> --nazwa (pierwsza definicja wygrywa: prymitywy stoja przed rolami)
{
  let i = 0;
  while ((i = tokenyCss.indexOf(":root", i)) !== -1) {
    const start = tokenyCss.indexOf("{", i);
    let g = 0, k = start;
    for (; k < tokenyCss.length; k++) { if (tokenyCss[k] === "{") g++; else if (tokenyCss[k] === "}") { g--; if (!g) break; } }
    const blok = tokenyCss.slice(start, k).replace(/\/\*[\s\S]*?\*\//g, "");
    for (const m of blok.matchAll(/(--[a-zA-Z0-9_-]+)\s*:\s*(#[0-9a-fA-F]{3,8})\s*[;}]/g)) {
      if (m[2].length === 5 || m[2].length === 9) continue;
      const h = norm(m[2]);
      if (!NIGDY.has(h) && !tokeny[h]) tokeny[h] = m[1];
    }
    i = k;
  }
}
for (const [od, doH] of Object.entries(FOLD)) if (!tokeny[doH]) throw new Error(`FOLD ${od} -> ${doH}: brak tokenu dla ${doH}`);

/* ── 2. przepisanie ────────────────────────────────────────────────── */
const RE_KOLOR = /#[0-9a-fA-F]{3,8}\b|rgba?\(\s*\d+[\s,]+\d+[\s,]+\d+\s*(?:[,/][^)]*)?\)/g;
const procent = (alfa) => {
  if (alfa.endsWith("%")) return alfa;
  const p = Math.round(parseFloat(alfa) * 100 * 1000) / 1000;
  return `${p}%`;
};

const raport = [];
const probki = [];
let zostalo = {};

for (const p of pliki) {
  const css = fs.readFileSync(p, "utf8");
  const nazwa = path.basename(p);
  let zmian = 0, mix = 0, pominietych = 0;

  const komentarze = [];
  for (const m of css.matchAll(/\/\*[\s\S]*?\*\//g)) komentarze.push([m.index, m.index + m[0].length]);
  const wKomentarzu = (pos) => komentarze.some(([a, b]) => pos >= a && pos < b);

  const kawalki = css.split(/(;)/);
  let offset = 0;
  for (let i = 0; i < kawalki.length; i++) {
    const dekl = kawalki[i];
    const bazowy = offset;
    offset += dekl.length;
    if (!dekl || dekl === ";") continue;
    RE_KOLOR.lastIndex = 0;
    if (!RE_KOLOR.test(dekl)) continue;
    RE_KOLOR.lastIndex = 0;
    if (dekl.includes("url(")) { pominietych++; continue; }
    const definicja = /(^|[\s{])--[a-zA-Z0-9_-]+\s*:/.test(dekl.replace(/\/\*[\s\S]*?\*\//g, ""));

    const wVar = (idx) => {
      const start = dekl.lastIndexOf("var(", idx);
      if (start === -1) return false;
      return !dekl.slice(start, idx).includes(")");
    };

    const trafienia = [...dekl.matchAll(RE_KOLOR)];
    RE_KOLOR.lastIndex = 0;
    const przed = [], po = [];
    for (const t of trafienia) {
      const surowe = t[0];
      const zostaw = () => { przed.push(surowe); po.push(surowe); };
      if (wKomentarzu(bazowy + t.index) || wVar(t.index)) { zostaw(); continue; }
      let h, alfa = null;
      if (surowe.startsWith("#")) {
        if (surowe.length === 5 || surowe.length === 9) { zostaw(); continue; }
        h = norm(surowe);
      } else {
        const q = surowe.match(/rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)\s*(?:[,/]\s*([^)]*))?\)/);
        h = doHex(q[1], q[2], q[3]);
        alfa = q[4] === undefined ? null : q[4].trim();
        if (alfa === "1" || alfa === "1.0" || alfa === "100%") alfa = null;
      }
      if (NIGDY.has(h)) { zostaw(); continue; }
      const kan = FOLD[h] || h;
      const tok = tokeny[kan];
      if (!tok) { zostalo[h] = (zostalo[h] || 0) + 1; zostaw(); continue; }
      let nowe;
      if (alfa === null) nowe = `var(${tok})`;
      else if (definicja || alfa === "0" || alfa === "0%") { zostaw(); continue; }
      else nowe = `color-mix(in srgb, var(${tok}) ${procent(alfa)}, transparent)`;
      przed.push(surowe); po.push(nowe);
    }

    const wejscia = new Set(przed.map((x) => x.replace(/\s+/g, "").toLowerCase()));
    const wyjscia = new Set(po.map((x) => x.replace(/\s+/g, "").toLowerCase()));
    if (wejscia.size > wyjscia.size) { pominietych++; continue; }

    let nowa = "", kursor = 0, zmienione = false;
    trafienia.forEach((t, idx) => {
      nowa += dekl.slice(kursor, t.index) + po[idx];
      kursor = t.index + t[0].length;
      if (po[idx] !== przed[idx]) { zmian++; zmienione = true; if (po[idx].startsWith("color-mix")) mix++; }
    });
    nowa += dekl.slice(kursor);
    if (zmienione && probki.length < 14) probki.push(`${nazwa}: ${dekl.trim().split("\n").pop().trim().slice(0, 70)}  ->  ${nowa.trim().split("\n").pop().trim().slice(0, 90)}`);
    kawalki[i] = nowa;
  }

  const wynik = kawalki.join("");
  if (!SUCHY && wynik !== css) fs.writeFileSync(p, wynik, "utf8");
  raport.push({ nazwa, zmian, mix, pominietych });
}

console.log(SUCHY ? "=== PRZEBIEG SUCHY (nic nie zapisano) ===" : "=== ZAPISANO ===");
console.log(`Tokenow globalnych z hexem: ${Object.keys(tokeny).length}`);
let s = 0, sm = 0, sp = 0;
for (const r of raport) {
  console.log(`${r.nazwa.padEnd(28)} podmian: ${String(r.zmian).padStart(4)}   w tym color-mix: ${String(r.mix).padStart(3)}   deklaracji pominietych: ${String(r.pominietych).padStart(3)}`);
  s += r.zmian; sm += r.mix; sp += r.pominietych;
}
console.log(`\nRAZEM: ${s} podmian (${sm} color-mix). Pominietych deklaracji: ${sp}.`);
const zost = Object.entries(zostalo).sort((a, b) => b[1] - a[1]);
console.log(`Barw bez tokenu po przebiegu: ${zost.length} (uzyc: ${zost.reduce((a, [, n]) => a + n, 0)}); najczestsze: ${zost.slice(0, 8).map(([h, n]) => `${h}x${n}`).join(" ")}`);
console.log("\nProbki:"); for (const x of probki) console.log("  " + x);
