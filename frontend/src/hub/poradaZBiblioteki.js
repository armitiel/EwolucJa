/**
 * poradaZBiblioteki — świeża porada dnia dla dziecka i jej historia.
 *
 * SKĄD SIĘ BIERZE. Z biblioteki `dailyTipsData.js` (355 wpisów, 6 archetypów),
 * ale wyłącznie z wpisów `audience: "dziecko"`. To nie jest drobiazg: 189 z 355
 * porad napisano DO RODZICA („Gdy dziecko o coś pyta, zanim odpowiesz…") i w
 * panelu dziecka brzmiałyby jak instrukcja obsługi samego siebie.
 *
 * KTÓRA. Profil dziecka × dzień miesiąca × pora dnia — tak samo jak `todaysTip()`
 * w bibliotece. Wybór jest DETERMINISTYCZNY: odświeżenie ekranu nie losuje
 * nowej porady. Zmienia ją dopiero nowa pora dnia albo nowy dzień, więc karta
 * nie działa jak automat do gry.
 *
 * DZIURY W SIATCE. Dla dziecka wypada 27–30 porad na profil przy 30 dniach × 3
 * porach, czyli większość slotów jest pusta. Schodzimy wtedy po kolei: ta sama
 * doba w innej porze → najbliższy następny dzień, który cokolwiek ma (cyklicznie).
 * Pusty ekran nie jest opcją; profil ST ma dziś tylko 21 z 30 dni obsadzonych.
 *
 * HISTORIA siedzi w dwóch miejscach naraz. localStorage działa offline i od
 * razu, backend (`viewed_tips`) przenosi ją między urządzeniami. Przy starcie
 * scalamy oba zbiory — tak samo robi `pages/PoradyPage.jsx`.
 */
import { DAILY_TIPS, PROFILES_META } from "../dailyTipsData.js";

const KLUCZ_HISTORIA = "ewolucja.porady.biblioteka";
const HISTORIA_MAX = 60;
const SLOTY = ["poranek", "poludnie", "wieczor"];

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

export function poraTeraz(data = new Date()) {
  const g = data.getHours();
  if (g < 12) return "poranek";
  if (g < 18) return "poludnie";
  return "wieczor";
}

/** Biblioteka jest cyklem 30-dniowym, więc dzień miesiąca wystarcza za licznik. */
function dzienCyklu(data) {
  return ((data.getDate() - 1) % 30) + 1;
}

function kolejnoscPor(pora) {
  const i = Math.max(0, SLOTY.indexOf(pora));
  return [...SLOTY.slice(i), ...SLOTY.slice(0, i)];
}

function dlaDziecka(profil) {
  return DAILY_TIPS.filter((t) => t.profile === profil && t.audience === "dziecko");
}

/** Ile porad dla dziecka ma ten profil — panel mówi o tym w stopce historii. */
export function ilePorad(profil) {
  return dlaDziecka(kodProfilu(profil)).length;
}

export function poradaPoId(id) {
  return DAILY_TIPS.find((t) => t.id === id) || null;
}

/**
 * Porada na teraz. Zwraca wpis z biblioteki albo `null`, gdy profil nie ma ani
 * jednej porady dla dziecka (dziś nie zdarza się to żadnemu z sześciu).
 */
export function swiezaPorada(profil, data = new Date()) {
  const pula = dlaDziecka(kodProfilu(profil));
  if (!pula.length) return null;
  const pory = kolejnoscPor(poraTeraz(data));
  const start = dzienCyklu(data);
  for (let krok = 0; krok < 30; krok += 1) {
    const dzien = ((start - 1 + krok) % 30) + 1;
    for (const pora of pory) {
      const t = pula.find((x) => x.day === dzien && x.slot === pora);
      if (t) return t;
    }
  }
  return pula[0];
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
  try { localStorage.removeItem(KLUCZ_HISTORIA); } catch {}
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
