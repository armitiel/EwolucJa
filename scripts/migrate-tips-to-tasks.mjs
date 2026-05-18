/**
 * migrate-tips-to-tasks.mjs
 *
 * Rozdziela frontend/src/dailyTipsData.js na dwa zbiory:
 *  - CURIOSITIES  -> zostaja w dailyTipsData.js (ciekawostki Medrca, motywacja, fakty)
 *  - TASKS        -> przenoszone do frontend/src/data/mentorTaskLibrary.js
 *
 * Uzycie: node scripts/migrate-tips-to-tasks.mjs
 *
 * Output (do scripts/out/):
 *   - dailyTipsData.curiosities.js  (CURIOSITIES, gotowy do podmiany frontend/src/dailyTipsData.js)
 *   - mentorTaskLibrary.additions.js (tablica nowych TASK-ow, do wstrzykniecia)
 *   - migration-report.json (statystyki + listy ID)
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SRC_TIPS = path.join(ROOT, "frontend", "src", "dailyTipsData.js");
const OUT_DIR = path.join(ROOT, "scripts", "out");

// MOCNE czasowniki — wymagaja realnego dzialania, wysilku, przedmiotu w rece, wyjscia.
// Jesli body/title sie od nich zaczyna -> ZAWSZE TASK.
const STRONG_TASK_VERBS = [
  "Zrob", "Zrob", "Wyjdz", "Wyjdz", "Zbierz", "Zbuduj", "Wytnij",
  "Pomaluj", "Posortuj", "Posprzataj", "Zaplanuj", "Schowaj", "Podaruj",
  "Wymysl", "Narysuj", "Wykonaj", "Pojdz", "Idz", "Zloz", "Uloz",
  "Daj", "Przygotuj", "Naucz", "Zorganizuj", "Zaproponuj", "Zachec",
  "Twoim zadaniem", "Twoja misja", "Misja:", "Powtorz", "Zbadaj",
  "Zrob", "Wyjdz", "Wymysl", "Pojdz", "Idz", "Zloz", "Uloz",
  "Posprzataj", "Zachec", "Powtorz",
];

// Dolaczamy warianty z polskimi znakami
const STRONG_TASK_VERBS_PL = [
  "Zrób", "Wyjdź", "Wymyśl", "Pójdź", "Idź", "Złóż", "Ułóż",
  "Posprzątaj", "Zachęć", "Powtórz", "Znajdź",
];

// SLABE czasowniki — moga byc mikro-akcja in-the-moment (curiosity) LUB pelnym zadaniem.
// Decyduje obecnosc TASK_SIGNAL_PHRASE w tresci.
const WEAK_TASK_VERBS = [
  "Sprobuj", "Wybierz", "Poloz", "Zapisz", "Policz", "Zapytaj",
  "Powiedz", "Zadaj", "Stan", "Wlacz", "Zaloz", "Podejdz",
  "Otworz", "Sprawdz", "Pomoz", "Polacz", "Pokaz", "Wez",
  "Usiadz", "Podlej", "Zmyj", "Wyjrzyj", "Spojrz", "Popatrz",
  "Patrz", "Zanim", "Rozejrzyj", "Posluchaj", "Wsluchaj",
  "Wyobraz", "Pomysl", "Zauwaz",
];
const WEAK_TASK_VERBS_PL = [
  "Spróbuj", "Połóż", "Stań", "Włącz", "Załóż", "Podejdź",
  "Otwórz", "Sprawdź", "Pomóż", "Połącz", "Pokaż", "Weź",
  "Usiądź", "Spójrz", "Posłuchaj", "Wsłuchaj", "Wyobraź",
  "Pomyśl", "Zauważ",
];

// Wskazniki ze SLABY czasownik = jednak pelne zadanie (wymaga przedmiotu/czasu/dowodu).
const TASK_SIGNAL_PHRASES = [
  "kartce", "kartki", "kartka", "papierze", "papieru",
  "z klocków", "z klockow", "kredkami", "flamastrami", "ołówkiem", "olowkiem",
  "słoik", "sloik", "pudełko", "pudelko", "z butelki",
  "przez 5 minut", "przez 10 minut", "przez 3 dni", "przez tydzień", "przez tydzien",
  "5 razy", "10 razy", "20 razy",
  "5 rzeczy", "10 rzeczy", "5 osób", "5 osob", "5 drobiazgów", "5 drobiazgow",
  "pięć rzeczy", "piec rzeczy", "trzy rzeczy", "trzy osoby",
  "Twoim zadaniem", "twoim zadaniem", "Twoja misja", "twoja misja",
  "zrób zdjęcie", "zrob zdjecie", "nagraj", "wykonaj zadanie",
];

// Frazy unievazniajace TASK — to ciekawostki/mysli/motywacje.
const CURIOSITY_PHRASES = [
  "Mędrzec mówi", "Medrzec mowi", "Mędrzec szepcze", "Medrzec szepcze",
  "Las Pytań szepcze", "Jaskinia Emocji szepcze",
  "Dolina Selfie szepcze", "Góry Liczb szepczą", "Wyspa Talentów szepcze",
  "Czy wiesz że", "Czy wiesz ze", "Czy wiedziałeś", "Czy wiedzialeś",
  "Pamiętaj że", "Pamietaj ze", "Wiesz co", "Twoje uczucia",
];

const ALL_STRONG = [...new Set([...STRONG_TASK_VERBS, ...STRONG_TASK_VERBS_PL])];
const ALL_WEAK = [...new Set([...WEAK_TASK_VERBS, ...WEAK_TASK_VERBS_PL])];

function isTaskByText(title, body) {
  const haystackBody = body || "";
  const haystackTitle = title || "";

  for (const p of CURIOSITY_PHRASES) {
    if (haystackBody.includes(p) || haystackTitle.includes(p)) return false;
  }

  const firstWord = (s) => (s || "").trim().split(/[\s,\.!\?:]/)[0];
  const bw = firstWord(haystackBody);
  const tw = firstWord(haystackTitle);

  for (const v of ALL_STRONG) {
    const vw = v.split(" ")[0];
    if (bw === vw || tw === vw) return true;
    if (haystackBody.startsWith(v) || haystackTitle.startsWith(v)) return true;
  }

  let hasWeakVerb = false;
  for (const v of ALL_WEAK) {
    if (bw === v || tw === v) { hasWeakVerb = true; break; }
    if (haystackBody.startsWith(v) || haystackTitle.startsWith(v)) { hasWeakVerb = true; break; }
  }
  if (hasWeakVerb) {
    for (const sig of TASK_SIGNAL_PHRASES) {
      if (haystackBody.includes(sig)) return true;
    }
  }

  if (/twoim zadaniem|twoja misja|wykonaj zadanie/i.test(haystackBody)) return true;
  return false;
}

function classify(tip) {
  if (tip.audience === "rodzic") return "CURIOSITY";
  if (tip.category === "misje" && tip.audience === "dziecko") return "TASK";
  if (isTaskByText(tip.title, tip.body)) return "TASK";
  return "CURIOSITY";
}

function bodyToRewardPoints(body) {
  const len = (body || "").length;
  if (len < 90) return 20;
  if (len < 140) return 25;
  if (len < 200) return 30;
  return 35;
}

function makeProofHint(tip) {
  const tags = tip.tags || [];
  if (tags.includes("rysunek") || tags.includes("rysuj")) return "Zdjecie rysunku lub opis 1 zdaniem.";
  if (tags.includes("kolekcja") || tags.includes("natura")) return "Zdjecie albo lista zebranych rzeczy.";
  if (tags.includes("liczenie")) return "Podaj liczbe i krotko gdzie liczyles.";
  if (tags.includes("rozmowa") || tags.includes("uczucia")) return "Napisz z kim rozmawiales i co uslyszales.";
  if (tags.includes("budowanie") || tags.includes("tworzenie")) return "Zdjecie tego, co powstalo.";
  if (tags.includes("muzyka") || tags.includes("taniec")) return "Krotkie nagranie albo opis 1 zdaniem.";
  if (tags.includes("pytania")) return "Wpisz pytania i krotkie odpowiedzi.";
  return "Krotko opisz albo wyslij zdjecie tego, co zrobiles.";
}

function makeCompetencyFocus(tip) {
  const primary = tip.profile;
  const subMap = {
    obserwacja: ["DT"], pytania: ["DT"], natura: ["DT", "KR"],
    uczucia: ["EM"], pomoc: ["EM"], dzielenie: ["EM"],
    planowanie: ["ST"], liczenie: ["ST"], mapy: ["ST"], wzory: ["ST"],
    tworzenie: ["KR"], wyobraznia: ["KR"], rysunek: ["KR"], muzyka: ["KR"],
    odwaga: ["LD"], inicjatywa: ["LD"],
    skupienie: ["MD"], spokoj: ["MD"], slowa: ["MD"],
  };
  const sec = new Set();
  for (const t of (tip.tags || [])) {
    const m = subMap[t.toLowerCase()];
    if (m) m.forEach(x => sec.add(x));
  }
  sec.delete(primary);
  return [primary, ...Array.from(sec).slice(0, 2)];
}

// ─── Wczytanie zrodla ───────────────────────────────────────────────
const mod = await import(pathToFileURL(SRC_TIPS).href);
const DAILY_TIPS = mod.DAILY_TIPS;
const PROFILES_META = mod.PROFILES_META;

if (!Array.isArray(DAILY_TIPS)) {
  console.error("Nie znaleziono DAILY_TIPS w pliku zrodlowym.");
  process.exit(1);
}

// ─── Klasyfikacja ───────────────────────────────────────────────────
const stats = { total: DAILY_TIPS.length, task: 0, curiosity: 0, per_profile: {}, per_category: {} };
const tasks = [];
const curiosities = [];

for (const tip of DAILY_TIPS) {
  const verdict = classify(tip);
  const profKey = tip.profile;
  const catKey = tip.category;
  stats.per_profile[profKey] = stats.per_profile[profKey] || { task: 0, curiosity: 0 };
  stats.per_category[catKey] = stats.per_category[catKey] || { task: 0, curiosity: 0 };
  if (verdict === "TASK") {
    stats.task++; stats.per_profile[profKey].task++; stats.per_category[catKey].task++;
    tasks.push(tip);
  } else {
    stats.curiosity++; stats.per_profile[profKey].curiosity++; stats.per_category[catKey].curiosity++;
    curiosities.push(tip);
  }
}

// ─── Renumeracja TASK-ow ────────────────────────────────────────────
const perProfileCounter = { DT: 11, EM: 11, ST: 11, KR: 11, LD: 11, MD: 11 };
const newTaskItems = tasks.map(tip => {
  const p = tip.profile;
  const num = String(perProfileCounter[p]++).padStart(3, "0");
  return {
    id: `${p}-TASK-${num}`,
    legacyId: tip.id,
    profile: p,
    kind: "task",
    title: tip.title,
    body: tip.body,
    points_reward: bodyToRewardPoints(tip.body),
    competency_focus: makeCompetencyFocus(tip),
    proof_hint: makeProofHint(tip),
    tags: tip.tags || [],
  };
});

// ─── Generowanie wyjsciowych plikow ─────────────────────────────────
fs.mkdirSync(OUT_DIR, { recursive: true });

const profilesMetaStr = JSON.stringify(PROFILES_META, null, 2);
const tipsArrayStr = JSON.stringify(curiosities, null, 2);

const newTipsFile = [
  "/**",
  " * dailyTipsData.js — porady-CIEKAWOSTKI dla 6 archetypow EwolucJA.",
  " * Po migracji 2026-05-17: TASK-i przeniesione do data/mentorTaskLibrary.js.",
  " * Wygenerowano przez scripts/migrate-tips-to-tasks.mjs.",
  " */",
  "",
  "export const PROFILES_META = " + profilesMetaStr + ";",
  "",
  "export const DAILY_TIPS = " + tipsArrayStr + ";",
  "",
  "export function tipsForProfile(profile) {",
  "  return DAILY_TIPS.filter(t => t.profile === profile);",
  "}",
  "",
  "export function tipsForDay(profile, day) {",
  "  return DAILY_TIPS.filter(t => t.profile === profile && t.day === day)",
  "    .sort((a, b) => {",
  "      const order = { poranek: 1, poludnie: 2, wieczor: 3 };",
  "      return order[a.slot] - order[b.slot];",
  "    });",
  "}",
  "",
  "export function tip(profile, day, slot) {",
  "  return DAILY_TIPS.find(t => t.profile === profile && t.day === day && t.slot === slot) || null;",
  "}",
  "",
  "export function todaysTip(profile, date = new Date(), slot = null) {",
  "  const day = ((date.getDate() - 1) % 30) + 1;",
  "  if (slot) {",
  "    const t = tip(profile, day, slot);",
  "    if (t) return t;",
  "  }",
  "  const h = date.getHours();",
  "  const preferred = h < 12 ? 'poranek' : h < 18 ? 'poludnie' : 'wieczor';",
  "  const order = preferred === 'poranek' ? ['poranek','poludnie','wieczor']",
  "              : preferred === 'poludnie' ? ['poludnie','poranek','wieczor']",
  "              : ['wieczor','poludnie','poranek'];",
  "  for (const s of order) {",
  "    const t = tip(profile, day, s);",
  "    if (t) return t;",
  "  }",
  "  return tipsForProfile(profile)[0] || null;",
  "}",
  "",
  "export function tipsByCategory(profile, category) {",
  "  return DAILY_TIPS.filter(t => t.profile === profile && t.category === category);",
  "}",
  "export function tipsBySubcategory(profile, subcategory) {",
  "  return DAILY_TIPS.filter(t => t.profile === profile && t.subcategory === subcategory);",
  "}",
  "",
  "export function tipsForAudience(profile, audience) {",
  "  return DAILY_TIPS.filter(t => t.profile === profile && t.audience === audience);",
  "}",
  "",
  "export function subcategoriesForProfile(profile) {",
  "  const set = new Set();",
  "  DAILY_TIPS.filter(t => t.profile === profile).forEach(t => set.add(t.subcategory));",
  "  return Array.from(set).sort();",
  "}",
  "",
  "export default DAILY_TIPS;",
  ""
].join("\n");

fs.writeFileSync(path.join(OUT_DIR, "dailyTipsData.curiosities.js"), newTipsFile, "utf8");

const taskItemsStripped = newTaskItems.map(({ legacyId, ...rest }) => rest);
const additionsStr = JSON.stringify(taskItemsStripped, null, 2);

const additionsFile = [
  "/**",
  " * mentorTaskLibrary.additions.js — nowe TASK-i wyciagniete z dailyTipsData.js.",
  " * Wygenerowano automatycznie 2026-05-17 przez scripts/migrate-tips-to-tasks.mjs.",
  " *",
  " * Sposob uzycia (recznie, jednorazowo):",
  " *   import { ADDITIONAL_TASKS } from './mentorTaskLibrary.additions.js';",
  " *   export const FULL_LIBRARY = [...MENTOR_TASK_LIBRARY, ...ADDITIONAL_TASKS];",
  " * lub wklej obiekty na koniec MENTOR_TASK_LIBRARY w mentorTaskLibrary.js.",
  " */",
  "",
  "export const ADDITIONAL_TASKS = " + additionsStr + ";",
  "",
  "export default ADDITIONAL_TASKS;",
  ""
].join("\n");

fs.writeFileSync(path.join(OUT_DIR, "mentorTaskLibrary.additions.js"), additionsFile, "utf8");

const report = {
  generated_at: new Date().toISOString(),
  stats,
  new_task_ids_by_profile: Object.fromEntries(
    ["DT","EM","ST","KR","LD","MD"].map(p => [
      p, newTaskItems.filter(t => t.profile === p).map(t => ({ newId: t.id, legacyId: t.legacyId, title: t.title }))
    ])
  ),
};
fs.writeFileSync(path.join(OUT_DIR, "migration-report.json"), JSON.stringify(report, null, 2), "utf8");

console.log("=== MIGRATION STATS ===");
console.log("Total tips:", stats.total);
console.log("  -> TASK:     ", stats.task);
console.log("  -> CURIOSITY:", stats.curiosity);
console.log("Per profile:", stats.per_profile);
console.log("Per category:", stats.per_category);
console.log("Output:");
console.log(" - " + path.join(OUT_DIR, "dailyTipsData.curiosities.js"));
console.log(" - " + path.join(OUT_DIR, "mentorTaskLibrary.additions.js"));
console.log(" - " + path.join(OUT_DIR, "migration-report.json"));
