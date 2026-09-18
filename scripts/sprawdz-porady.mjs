/*!
 * SPDX-FileCopyrightText: © 2026 Amitiel Angelisme <armitiel@gmail.com>
 * SPDX-License-Identifier: LicenseRef-EwolucJA-Proprietary
 *
 * EwolucJA — gra edukacyjna dla dzieci.
 * Produkt powstał w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”;
 * autorskie prawa majątkowe pozostają przy autorze. Licencja: LICENSE.
 */
/**
 * sprawdz-porady.mjs — kontrola biblioteki porad dnia (`frontend/src/dailyTipsData.js`)
 * według standardu docs/tresci/04_PORADY_DNIA.md §4 i 06 §4.10.
 *
 *   node scripts/sprawdz-porady.mjs            (z katalogu repo)
 *   npm run sprawdz:porady                     (z `frontend/`)
 *
 * Bez zależności. Wyjście 1 = są BŁĘDY (limity, cyfry w mowie, tokeny rodzaju,
 * słowa zakazane, pora ≠ slot, druga ciekawostka w tygodniu, nieznane klucze).
 * OSTRZEŻENIA (reguła „ciało co trzy dni”, `krok` > 60, `minimum` > 50) nie
 * blokują — to luki do domknięcia treścią, nie błędy pliku.
 *
 * Sprawdzane są pola bazowe i każdy wariant etapu (`warianty["1-3"|"4-8"]`).
 */
import { pathToFileURL } from "node:url";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const TU = dirname(fileURLToPath(import.meta.url));
const PLIK = resolve(TU, "../frontend/src/dailyTipsData.js");
const { DAILY_TIPS } = await import(pathToFileURL(PLIK).href);

/* ── Słownik dozwolonych wartości (04 §4.1) ─────────────────────────────── */
const SLOTY = new Set(["poranek", "poludnie", "wieczor"]);
const SLOT_Z_ID = { S1: "poranek", S2: "poludnie", S3: "wieczor" };
const PROFILE = new Set(["DT", "EM", "ST", "KR", "LD", "MD"]);
const ETAPY = new Set(["1-3", "4-8", "oba"]);
const RODZAJE = new Set(["oddech", "zmysly", "ruch", "napiecie-pusc", "emocje-cialo", "zyczliwosc", "tworzenie", "mikroodwaga", "wyciszenie"]);
const DO_CIALA = new Set(["oddech", "zmysly", "ruch", "napiecie-pusc", "emocje-cialo"]);
const WEJSCIA = new Set(["trop", "cialo-kolor-postac", "liczenie-porzadek", "rece-material", "energia-cialo", "jedna-rzecz-wolno"]);
const TRYBY = new Set(["inicjowanie", "odpowiadanie", "zaproszenie", "obserwowanie"]);
const GDZIE = new Set(["apka", "obok", "dzien"]);
const SILNIKI = new Set(["oddech", "fazy", "szukanie", "cisza", "napiecie"]);
const SLADY = new Set(["lisek-oddycha", "lisek-strzasa", "swiatlo-dnia", "kamyczek-przy-drabince", "niebo-cichnie", "slady-lap", "kropla-swiatla", "kwiat-koloru"]);
const RODZINY = new Set(["kladka", "okno", "cisza-dzwiek", "po-cichu", "drugie-uzycie", "swiatla"]);

/* ── Limity (04 §4.1; `krok` 120 wg zlecenia wdrożenia, 60 jako ostrzeżenie) ── */
const LIMIT = { title: 28, zapowiedz: 120, zdanieZapowiedzi: 70, krok: 120, krokZalecany: 60, minimum: 50, odzew: 70, ciekawostka: 90 };
const MOWIONE = ["zapowiedz", "krok", "odzew"];           // TTS: bez cyfr i ukośników
const TEKSTOWE = ["title", "zapowiedz", "krok", "minimum", "odzew", "ciekawostka"];

/* Słowa zakazane (04 §4.2; 06 §4.10). Nazwy profili i postaci — wielką literą,
   jak w etykietach; zwroty oceniające i „pamiętaj/musisz” — bez względu na wielkość. */
const ZAKAZANE_WIELKA = /Wizkor|Mędrz|Odkrywc|Przyjaci|Myślic|Wynalaz|Śmiał(ek|k[ua]|kowie|kiem|ki|kach|ków)|Spokojn\p{L}* Głow/u;
const ZAKAZANE_KAZDA = /pamiętaj|musisz|dobra robota|brawo/iu;
/* Formy przeszłe i tryb przypuszczający o dziecku POZA tokenem `{m|ż}`. */
/* `\b` w JS zna tylko ASCII — „Właśnie” miałoby granicę po „ś”. Stąd `(?!\p{L})`. */
const KONCOWKI = /\p{L}*(łeś|łaś|byś)(?!\p{L})/gu;
const CIALO_CO_DNI = 3;
const DNI = 30;

const bledy = [];
const ostrzezenia = [];
const blad = (id, co) => bledy.push(`${id}: ${co}`);
const uwaga = (id, co) => ostrzezenia.push(`${id}: ${co}`);

const zdania = (t) => String(t).split(/(?<=[.!?…])\s+/u).map((z) => z.trim()).filter(Boolean);
const bezTokenow = (t) => String(t).replace(/\{[^{}]*\}/gu, "");

function sprawdzTeksty(id, p, etykieta = "") {
  const gdzie = etykieta ? `${id} [${etykieta}]` : id;
  for (const pole of TEKSTOWE) {
    const t = p[pole];
    if (t == null || t === "") continue;
    if (typeof t !== "string") { blad(gdzie, `${pole} nie jest tekstem`); continue; }
    if (pole === "title" && t.length > LIMIT.title) blad(gdzie, `title ${t.length} > ${LIMIT.title}: „${t}”`);
    if (pole === "zapowiedz") {
      if (t.length > LIMIT.zapowiedz) blad(gdzie, `zapowiedz ${t.length} > ${LIMIT.zapowiedz}`);
      for (const z of zdania(t)) if (z.length > LIMIT.zdanieZapowiedzi) blad(gdzie, `zdanie zapowiedzi ${z.length} > ${LIMIT.zdanieZapowiedzi}: „${z}”`);
    }
    if (pole === "krok") {
      if (t.length > LIMIT.krok) blad(gdzie, `krok ${t.length} > ${LIMIT.krok}`);
      else if (t.length > LIMIT.krokZalecany) uwaga(gdzie, `krok ${t.length} > ${LIMIT.krokZalecany} (04 §4.1 zaleca ≤ 60)`);
    }
    if (pole === "minimum" && t.length > LIMIT.minimum) uwaga(gdzie, `minimum ${t.length} > ${LIMIT.minimum}`);
    if (pole === "odzew" && t.length > LIMIT.odzew) blad(gdzie, `odzew ${t.length} > ${LIMIT.odzew}`);
    if (pole === "ciekawostka" && t.length > LIMIT.ciekawostka) blad(gdzie, `ciekawostka ${t.length} > ${LIMIT.ciekawostka}`);
    if (MOWIONE.includes(pole)) {
      if (/\d/u.test(t)) blad(gdzie, `${pole} ma cyfrę (TTS): „${t}”`);
      if (/\//u.test(t)) blad(gdzie, `${pole} ma ukośnik (TTS): „${t}”`);
    }
    const czyste = bezTokenow(t);
    const m = czyste.match(KONCOWKI);
    if (m) blad(gdzie, `${pole}: forma o dziecku bez tokenu {m|ż}: ${m.join(", ")}`);
    const z1 = t.match(ZAKAZANE_WIELKA);
    if (z1) blad(gdzie, `${pole}: słowo zakazane „${z1[0]}”`);
    const z2 = t.match(ZAKAZANE_KAZDA);
    if (z2) blad(gdzie, `${pole}: słowo zakazane „${z2[0]}”`);
    if (pole === "odzew" && /(?<!\p{L})twoj[ea]?(?!\p{L}).*(?<!\p{L})(już|był[ao]?|robi się)(?!\p{L})/iu.test(t)) blad(gdzie, `odzew orzeka o ciele dziecka: „${t}”`);
    if (pole === "odzew" && /liczy się/iu.test(t)) blad(gdzie, `odzew z „liczy się” (tylko w minimum)`);
  }
}

const ids = new Set();
const dzieci = DAILY_TIPS.filter((t) => (t.audience || "dziecko") === "dziecko");

for (const p of DAILY_TIPS) {
  const id = String(p.id || "(bez id)");
  if (ids.has(id)) blad(id, "powtórzone id");
  ids.add(id);
  if (!PROFILE.has(p.profile)) blad(id, `profil „${p.profile}”`);
  if (!Number.isInteger(p.day) || p.day < 1 || p.day > DNI) blad(id, `day „${p.day}”`);
  if (!SLOTY.has(p.slot)) blad(id, `slot „${p.slot}”`);
  /* `pora` zgodna ze slotem: pole `pora` (gdy jest) i kod S1/S2/S3 w id. */
  if (p.pora != null && p.pora !== p.slot) blad(id, `pora „${p.pora}” ≠ slot „${p.slot}”`);
  const zId = id.match(/-S([123])\b/u);
  if (zId && SLOT_Z_ID[`S${zId[1]}`] !== p.slot) blad(id, `slot „${p.slot}” ≠ S${zId[1]} w id`);
  const zDzien = id.match(/-D(\d\d)-/u);
  if (zDzien && Number(zDzien[1]) !== p.day) blad(id, `day ${p.day} ≠ D${zDzien[1]} w id`);
  if (p.etap != null && !ETAPY.has(p.etap)) blad(id, `etap „${p.etap}”`);
  if (!RODZAJE.has(p.rodzaj)) blad(id, `rodzaj „${p.rodzaj}”`);
  if (p.wejscie != null && !WEJSCIA.has(p.wejscie)) blad(id, `wejscie „${p.wejscie}”`);
  if (p.tryb != null && !TRYBY.has(p.tryb)) blad(id, `tryb „${p.tryb}”`);
  if (!GDZIE.has(p.gdzie)) blad(id, `gdzie „${p.gdzie}”`);
  if (p.silnik != null && !SILNIKI.has(p.silnik)) blad(id, `silnik „${p.silnik}”`);
  if (p.silnik && p.gdzie !== "apka") blad(id, `silnik „${p.silnik}” przy gdzie ≠ apka`);
  if (p.gdzie === "apka" && !p.silnik) uwaga(id, "gdzie: apka bez silnika (zostaje samo „Zrobione”)");
  if (p.slad != null && !SLADY.has(p.slad)) blad(id, `slad „${p.slad}”`);
  if (p.rodzina != null && !RODZINY.has(p.rodzina)) blad(id, `rodzina „${p.rodzina}” spoza rejestru 06 §6`);
  for (const pole of ["title", "zapowiedz", "krok", "odzew"]) if (!p[pole]) blad(id, `brak pola ${pole}`);
  sprawdzTeksty(id, p);
  if (p.warianty && typeof p.warianty === "object") {
    for (const [etap, w] of Object.entries(p.warianty)) {
      if (!["1-3", "4-8"].includes(etap)) { blad(id, `wariant „${etap}”`); continue; }
      sprawdzTeksty(id, w, etap);
    }
  }
}

/* ── Ciekawostki: ≤ 1 na 7 dni na profil (06 pkt 29) ────────────────────── */
for (const prof of PROFILE) {
  const dniZ = [...new Set(dzieci.filter((t) => t.profile === prof && t.ciekawostka).map((t) => t.day))].sort((a, b) => a - b);
  for (let i = 1; i < dniZ.length; i += 1) {
    if (dniZ[i] - dniZ[i - 1] < 7) blad(`${prof}`, `dwie ciekawostki w tygodniu: dni ${dniZ[i - 1]} i ${dniZ[i]}`);
  }
}

/* ── Ciało co trzy dni (04 §5.1) — ostrzeżenie ──────────────────────────── */
for (const prof of PROFILE) {
  const dniCiala = new Set(dzieci.filter((t) => t.profile === prof && DO_CIALA.has(t.rodzaj)).map((t) => t.day));
  const luki = [];
  for (let d = 1; d <= DNI - CIALO_CO_DNI + 1; d += 1) {
    let jest = false;
    for (let k = 0; k < CIALO_CO_DNI; k += 1) if (dniCiala.has(d + k)) { jest = true; break; }
    if (!jest) luki.push(`${d}–${d + CIALO_CO_DNI - 1}`);
  }
  if (luki.length) uwaga(prof, `bez porady do ciała w dniach ${luki.join(", ")}`);
}

/* ── Siatka: ile par dzień × pora ma każdy profil (04 §4.4 — informacja) ── */
const siatka = [...PROFILE].map((prof) => {
  const pary = new Set(dzieci.filter((t) => t.profile === prof).map((t) => `${t.day}:${t.slot}`));
  return `${prof} ${pary.size}/${DNI * 3}`;
});

console.log(`Porady: ${DAILY_TIPS.length} wpisów (${dzieci.length} dla dziecka). Siatka: ${siatka.join(", ")}.`);
if (ostrzezenia.length) {
  console.log(`\nOSTRZEŻENIA (${ostrzezenia.length}):`);
  for (const o of ostrzezenia) console.log("  - " + o);
}
if (bledy.length) {
  console.log(`\nBŁĘDY (${bledy.length}):`);
  for (const b of bledy) console.log("  - " + b);
  process.exit(1);
}
console.log("\nBez błędów.");
