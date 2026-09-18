/*!
 * SPDX-FileCopyrightText: © 2026 Amitiel Angelisme <armitiel@gmail.com>
 * SPDX-License-Identifier: LicenseRef-EwolucJA-Proprietary
 *
 * EwolucJA — gra edukacyjna dla dzieci.
 * Produkt powstał w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”;
 * autorskie prawa majątkowe pozostają przy autorze. Licencja: LICENSE.
 */
/**
 * poradaZBiblioteki — świeża porada dnia dla dziecka, jej wykonanie i historia.
 *
 * SKĄD SIĘ BIERZE. Z biblioteki `dailyTipsData.js` (format docs/tresci/04 §4.1;
 * porady rodzica leżą osobno w `dailyTipsRodzic.js` i nie mają tu wstępu).
 *
 * KTÓRA. Profil dziecka × dzień przygody (`services/dzienGry.js`) × pora dnia —
 * JEDNA definicja pory (`poraTeraz`: poranek / południe / wieczór). Wybór jest
 * deterministyczny: odświeżenie nie losuje. Gdy w tej porze nic nie ma, bierzemy
 * NAJBLIŻSZY NASTĘPNY DZIEŃ O TEJ SAMEJ PORZE (cyklicznie) — nigdy inną porę
 * tego dnia, żeby wieczorem nie czytać „zanim wstaniesz z łóżka”.
 *
 * ETAP. Pole `etap` porady (1-3 | 4-8 | oba) kontra etap dziecka z onboardingu
 * (`KLUCZ_ETAP`); bez zapisu etapu wszystko traktujemy jak `oba`. `warianty`
 * nadpisują pola dla jednego etapu.
 *
 * RODZINA. Porada z polem `rodzina` nie wchodzi w dniu, gdy dziecko ma aktywne
 * zadanie Wizkora albo hybrydę z tą samą rodziną (ta sama czynność w dwóch
 * miejscach; rejestr rodzin: docs/tresci/06 §6). Tylko odczyt stanu.
 *
 * WYKONANIE (nowe). Jedna porada dziennie może być „zrobiona”; zapis w
 * localStorage z kluczem dnia — bez licznika i bez serii. Odzew liska przy
 * `gdzie: dzien` pada przy następnym wejściu tego dnia.
 *
 * HISTORIA siedzi w dwóch miejscach naraz. localStorage działa offline i od
 * razu, backend (`viewed_tips`) przenosi ją między urządzeniami.
 */
import { DAILY_TIPS, PROFILES_META } from "../dailyTipsData.js";
import { dzienPrzygody } from "../services/dzienGry.js";
import { KLUCZ_ETAP } from "./profilStartowy.js";
import { stanZadania } from "./zadanieWizkora.js";
import { stanHybrydy } from "./hybryda.js";

const KLUCZ_HISTORIA = "ewolucja.porady.biblioteka";
const KLUCZ_WYKONANE = "ewolucja.porady.wykonane";
/* Ślad porady w świecie 3D — dzienny, nie trwały: NIE idzie do dziennika
   `sladySwiata` (tam są ślady zadań w realu). Klucz dnia, kasowany przez datę. */
const KLUCZ_SLAD = "ewolucja.porada.slad";
/* Kiedy lisek ostatnio powiedział odzew — R7: Wizkor milczy trzy minuty po nim. */
const KLUCZ_ODZEW = "ewolucja.porada.odzew";
const HISTORIA_MAX = 60;
const SLOTY = ["poranek", "poludnie", "wieczor"];
const DNI = 30;

/** Stare zapisy trzymały nazwę archetypu zamiast kodu profilu. */
const LEGACY_NA_KOD = {
  tropiciel_tajemnic: "DT", zaklinacz_uczuc: "EM", mistrz_map: "ST",
  tkacz_snow: "KR", gwardzista_odwagi: "LD", straznik_mostu: "MD",
};

export function kodProfilu(wartosc) {
  if (!wartosc) return "DT";
  if (PROFILES_META[wartosc]) return wartosc;
  return LEGACY_NA_KOD[wartosc] || "DT";
}

export function metaProfilu(wartosc) {
  return PROFILES_META[kodProfilu(wartosc)] || null;
}

export const PORA_NAZWA = { poranek: "Poranek", poludnie: "Południe", wieczor: "Wieczór" };

/** Jedyna definicja pory dnia dla porad. `EkranOddechu` mapuje ją na tempo. */
export function poraTeraz(data = new Date()) {
  const g = data.getHours();
  if (g < 12) return "poranek";
  if (g < 18) return "poludnie";
  return "wieczor";
}

/** Licznik dnia przygody mieszka w `services/dzienGry.js` — tu tylko przelot dalej. */
export { dzienPrzygody };

/** Etap szkolny dziecka: "1-3" | "4-8" | null (brak zapisu = wszystko pasuje). */
export function etapDziecka() {
  try {
    const e = localStorage.getItem(KLUCZ_ETAP);
    return e === "1-3" || e === "4-8" ? e : null;
  } catch {
    return null;
  }
}

function pasujeEtap(t, etap) {
  return !etap || !t.etap || t.etap === "oba" || t.etap === etap;
}

/** Porada z nałożonym wariantem etapu (`warianty["1-3"|"4-8"]` nadpisuje pola). */
export function zWariantem(t, etap = etapDziecka()) {
  if (!t) return null;
  const w = etap && t.warianty ? t.warianty[etap] : null;
  return w ? { ...t, ...w } : t;
}

/** Rodziny aktywnego zadania Wizkora i otwartej hybrydy (tylko odczyt). */
function rodzinyAktywne() {
  const r = new Set();
  try {
    const z = stanZadania();
    if (z?.istnieje && !z.wyplacone && z.def?.rodzina) r.add(z.def.rodzina);
  } catch {}
  try {
    const h = stanHybrydy();
    if (h?.istnieje && h.otwarta && h.def?.rodzina) r.add(h.def.rodzina);
  } catch {}
  return r;
}

function dlaDziecka(profil) {
  return DAILY_TIPS.filter((t) => t.profile === profil && (t.audience || "dziecko") === "dziecko");
}

/** Ile porad dla dziecka ma ten profil (tylko do narzędzi, nie na ekran). */
export function ilePorad(profil) {
  return dlaDziecka(kodProfilu(profil)).length;
}

export function poradaPoId(id, etap = etapDziecka()) {
  return zWariantem(DAILY_TIPS.find((t) => t.id === id) || null, etap);
}

/**
 * Porada na teraz. Zwraca wpis (z wariantem etapu) albo `null`, gdy profil nie
 * ma ani jednej porady dla dziecka.
 */
export function swiezaPorada(profil, player = null, data = new Date()) {
  const etap = etapDziecka();
  const rodziny = rodzinyAktywne();
  const pula = dlaDziecka(kodProfilu(profil))
    .filter((t) => pasujeEtap(t, etap))
    .filter((t) => !(t.rodzina && rodziny.has(t.rodzina)));
  if (!pula.length) return null;
  const pora = poraTeraz(data);
  const start = dzienPrzygody(player, data);
  for (let krok = 0; krok < DNI; krok += 1) {
    const dzien = ((start - 1 + krok) % DNI) + 1;
    const t = pula.find((x) => x.day === dzien && x.slot === pora);
    if (t) return zWariantem(t, etap);
  }
  return zWariantem(pula[0], etap);
}

/** Dzisiejsza porada dziecka z obiektu gracza (skrót dla huba, np. filtra tematu Wizkora). */
export function dzisiejszaPorada(player = null, data = new Date()) {
  return swiezaPorada(kodProfilu(player?.archetype), player, data);
}

/* ── Wykonanie dzisiejszej porady ──────────────────────────────────────────── */

/** Lokalna data, nie ISO w UTC — o 23:30 czasu polskiego ISO pokazuje już jutro. */
export function kluczDnia(data = new Date()) {
  return `${data.getFullYear()}-${data.getMonth() + 1}-${data.getDate()}`;
}

/** Zapis wykonania z dzisiaj albo `null`. Wczorajszy zapis nie liczy się i nie jest błędem. */
export function czytajWykonanie(data = new Date()) {
  try {
    const z = JSON.parse(localStorage.getItem(KLUCZ_WYKONANE) || "null");
    return z && z.dzien === kluczDnia(data) && z.id ? z : null;
  } catch {
    return null;
  }
}

/**
 * Oznacza poradę jako zrobioną dzisiaj. `odzewPowiedziany: false` znaczy, że
 * lisek jeszcze nie odpowiedział (porady `gdzie: dzien` — odzew przy następnym
 * wejściu tego dnia). Nic nie jest liczone i nic nie przepada.
 */
export function zapiszWykonanie(porada, { odzewPowiedziany = true } = {}, data = new Date()) {
  if (!porada) return null;
  const zapis = { dzien: kluczDnia(data), id: porada.id, rodzaj: porada.rodzaj || null, slad: porada.slad || null, odzewPowiedziany, kiedy: data.toISOString() };
  try { localStorage.setItem(KLUCZ_WYKONANE, JSON.stringify(zapis)); } catch {}
  if (odzewPowiedziany) oznaczOdzewLiska(data);
  return zapis;
}

export function oznaczOdzewPowiedziany(data = new Date()) {
  const z = czytajWykonanie(data);
  if (!z) return null;
  const nowy = { ...z, odzewPowiedziany: true };
  try { localStorage.setItem(KLUCZ_WYKONANE, JSON.stringify(nowy)); } catch {}
  oznaczOdzewLiska(data);
  return nowy;
}

/** Znacznik czasu odzewu liska (R7: Wizkor nie wchodzi z myślą przez 3 min po nim). */
export function oznaczOdzewLiska(data = new Date()) {
  try { localStorage.setItem(KLUCZ_ODZEW, String(data.getTime())); } catch {}
}

/** Kiedy lisek ostatnio powiedział odzew (ms od epoki); 0 = nigdy. */
export function kiedyOdzewLiska() {
  try { return Number(localStorage.getItem(KLUCZ_ODZEW)) || 0; } catch { return 0; }
}

/**
 * Ślad porady w świecie 3D — wywołanie defensywne. API sceny jest wystawione
 * jako `globalThis.__SCENA`; metoda `ustawSladPorady` powstanie po stronie
 * sceny później (docs/tresci/04 §6.1). Bez niej nic się nie dzieje i nic nie pęka.
 */
export function pokazSladPorady(slad, opcje = {}) {
  if (!slad) return false;
  const o = { kolor: null, bezAnimacji: false, ...opcje };
  /* Zapis PRZED wywołaniem sceny: scena bywa jeszcze niezbudowana (panel
     otwarty przed `gotowa`), a ślad ma wrócić przy następnym wejściu. */
  if (!o.bezAnimacji) zapiszSladPorady(slad, o.kolor);
  try {
    const f = globalThis.__SCENA?.ustawSladPorady;
    if (typeof f !== "function") return false;
    f.call(globalThis.__SCENA, slad, o);
    return true;
  } catch {
    return false;
  }
}

/** Ślad porady z dzisiaj: `{ dzien, slad, kolor }` albo `null` (wczorajszy nie liczy się). */
export function czytajSladPorady(data = new Date()) {
  try {
    const z = JSON.parse(localStorage.getItem(KLUCZ_SLAD) || "null");
    return z && z.dzien === kluczDnia(data) && z.slad ? z : null;
  } catch {
    return null;
  }
}

export function zapiszSladPorady(slad, kolor = null, data = new Date()) {
  if (!slad) return null;
  const zapis = { dzien: kluczDnia(data), slad, kolor: kolor ?? null };
  try { localStorage.setItem(KLUCZ_SLAD, JSON.stringify(zapis)); } catch {}
  return zapis;
}

/**
 * Odtworzenie śladu porady po `gotowa` tego samego dnia — bez animacji, jak
 * `oznaczZuzyte`. Woła `Swiat.jsx` obok `odtworzSlady`. Jeden ślad dziennie:
 * druga porada tego dnia nie dokłada drugiego (docs/tresci/04 §6).
 */
export function odtworzSladPorady(scena = globalThis.__SCENA) {
  const z = czytajSladPorady();
  if (!z) return false;
  try {
    const f = scena?.ustawSladPorady;
    if (typeof f !== "function") return false;
    f.call(scena, z.slad, { kolor: z.kolor ?? null, bezAnimacji: true });
    return true;
  } catch {
    return false;
  }
}

/* ── Historia ─────────────────────────────────────────────────────────────── */

function czytaj() {
  try {
    const s = localStorage.getItem(KLUCZ_HISTORIA);
    const d = s ? JSON.parse(s) : [];
    return Array.isArray(d) ? d : [];
  } catch {
    return [];
  }
}

function pisz(wpisy) {
  try {
    localStorage.setItem(KLUCZ_HISTORIA, JSON.stringify(wpisy.slice(0, HISTORIA_MAX)));
  } catch {}
}

function poSortowaniu(wpisy) {
  return [...wpisy].sort((a, b) => String(b.kiedy).localeCompare(String(a.kiedy)));
}

export function czytajHistorie() {
  return poSortowaniu(czytaj().filter((w) => w && w.id));
}

/**
 * Odnotowanie porady. Wołane, gdy dziecko ZOBACZY świeżą kartę — dzięki temu
 * jutro ląduje ona na liście, a na górze pojawia się następna. Ta sama porada
 * nie dubluje się w historii; liczy się pierwsze spotkanie.
 */
export function zanotujPorade(porada, data = new Date()) {
  if (!porada) return czytajHistorie();
  const wpisy = czytaj();
  if (wpisy.some((w) => w.id === porada.id)) return poSortowaniu(wpisy);
  const nowe = [{ id: porada.id, kiedy: data.toISOString() }, ...wpisy];
  pisz(nowe);
  return poSortowaniu(nowe);
}

/**
 * Scalenie z backendem. `zdalne` to odpowiedź `GET /players/:id/viewed-tips`
 * ([{ tip_id, viewed_at }]). Data z serwera wygrywa, bo to ona mówi, kiedy
 * dziecko zobaczyło poradę PIERWSZY raz — także na innym urządzeniu.
 */
export function scalHistorie(zdalne) {
  const mapa = new Map();
  for (const w of czytaj()) if (w && w.id) mapa.set(w.id, w);
  for (const z of zdalne || []) {
    if (!z || !z.tip_id) continue;
    mapa.set(z.tip_id, { id: z.tip_id, kiedy: z.viewed_at || mapa.get(z.tip_id)?.kiedy || new Date().toISOString() });
  }
  const scalone = poSortowaniu([...mapa.values()]);
  pisz(scalone);
  return scalone;
}

export function zresetujHistorie() {
  try {
    localStorage.removeItem(KLUCZ_HISTORIA);
    localStorage.removeItem(KLUCZ_WYKONANE);
    localStorage.removeItem(KLUCZ_SLAD);
    localStorage.removeItem(KLUCZ_ODZEW);
  } catch {}
  return [];
}

/** „dziś", „wczoraj", potem data — dziecko nie czyta znaczników czasu. */
export function etykietaDnia(kiedy, teraz = new Date()) {
  const d = new Date(kiedy);
  if (Number.isNaN(d.getTime())) return "";
  const doby = (a, b) => {
    const x = new Date(a); x.setHours(0, 0, 0, 0);
    const y = new Date(b); y.setHours(0, 0, 0, 0);
    return Math.round((y - x) / 86400000);
  };
  const r = doby(d, teraz);
  if (r <= 0) return "dziś";
  if (r === 1) return "wczoraj";
  if (r < 7) return `${r} dni temu`;
  return d.toLocaleDateString("pl-PL", { day: "numeric", month: "long" });
}
