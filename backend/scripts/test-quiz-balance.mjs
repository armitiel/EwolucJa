// Monte Carlo balance test dla onboarding quiz v3-final.
// Wymagania (z agents/world/quiz_osobowosci.md §7):
//   - 10 000 losowych przebiegow
//   - rozklad 6 archetypow powinien byc 13-20% kazdy
//   - srednia minimalna wartosc cechy w radarze > 4 pkt (no zero-wedge)
//
// Uruchom z katalogu backend/: node scripts/test-quiz-balance.mjs
import { ONBOARDING_QUIZ, PROFILE_TO_ARCHETYPE } from "../src/api/onboarding.js";

const TIE_BREAK_PREFERENCE = ["DT", "KR", "EM", "ST", "LD", "MD"];
const PROFILES = ["EM", "ST", "KR", "LD", "DT", "MD"];

// Kopia pickArchetype z onboarding.js (nieexportowana w prod).
function pickArchetype(scores, opts = {}) {
  const { peripheral_sum = null, firstAnswerPoints = null } = opts;
  const eligible = Object.keys(scores).filter((p) => !!PROFILE_TO_ARCHETYPE[p]);
  const maxScore = Math.max(...eligible.map((p) => scores[p]));
  let tied = eligible.filter((p) => scores[p] === maxScore);
  if (tied.length === 1) return { dominant_profile: tied[0] };
  if (peripheral_sum) {
    const maxPeripheral = Math.max(...tied.map((p) => peripheral_sum[p] || 0));
    tied = tied.filter((p) => (peripheral_sum[p] || 0) === maxPeripheral);
    if (tied.length === 1) return { dominant_profile: tied[0] };
  }
  if (firstAnswerPoints) {
    const firstMain = Object.keys(firstAnswerPoints).find((p) => firstAnswerPoints[p] === 3);
    if (firstMain && tied.includes(firstMain)) return { dominant_profile: firstMain };
  }
  for (const pref of TIE_BREAK_PREFERENCE) {
    if (tied.includes(pref)) return { dominant_profile: pref };
  }
  return { dominant_profile: tied[0] };
}

function simulateOnePlayer() {
  const scores = { EM: 0, ST: 0, KR: 0, LD: 0, DT: 0, MD: 0 };
  const peripheral_sum = { EM: 0, ST: 0, KR: 0, LD: 0, DT: 0, MD: 0 };
  let firstAnswerPoints = null;
  for (const q of ONBOARDING_QUIZ) {
    const a = q.answers[Math.floor(Math.random() * q.answers.length)];
    if (q.question_id === "nq1") firstAnswerPoints = a.points;
    for (const [p, pts] of Object.entries(a.points)) {
      scores[p] += pts;
      if (pts === 1 || pts === 2) peripheral_sum[p] += pts;
    }
  }
  return { scores, peripheral_sum, firstAnswerPoints };
}

const N = 100_000;
const archetypeCounts = { EM: 0, ST: 0, KR: 0, LD: 0, DT: 0, MD: 0 };
let totalMinScore = 0;
let minOfAllMins = Infinity;
let totalMaxScore = 0;

for (let i = 0; i < N; i++) {
  const { scores, peripheral_sum, firstAnswerPoints } = simulateOnePlayer();
  const { dominant_profile } = pickArchetype(scores, { peripheral_sum, firstAnswerPoints });
  archetypeCounts[dominant_profile]++;
  const playerScores = PROFILES.map((p) => scores[p]);
  const minScore = Math.min(...playerScores);
  const maxScore = Math.max(...playerScores);
  totalMinScore += minScore;
  totalMaxScore += maxScore;
  if (minScore < minOfAllMins) minOfAllMins = minScore;
}

console.log(`\n=== Monte Carlo: ${N} losowych graczy ===\n`);
console.log("Rozklad archetypow (oczekiwane: 13-20% kazdy, idealnie 16.67%):");
for (const p of PROFILES) {
  const pct = (archetypeCounts[p] / N * 100).toFixed(2);
  const flag = archetypeCounts[p] / N < 0.13 || archetypeCounts[p] / N > 0.20 ? " ⚠️" : " ✅";
  console.log(`  ${p}: ${String(archetypeCounts[p]).padStart(5)} (${pct.padStart(5)}%)${flag}`);
}

const avgMin = (totalMinScore / N).toFixed(2);
const avgMax = (totalMaxScore / N).toFixed(2);
console.log(`\nSrednia min cecha (wymog >4):    ${avgMin} ${parseFloat(avgMin) > 4 ? "✅" : "⚠️"}`);
console.log(`Srednia max cecha (oczekiwane 12-18): ${avgMax}`);
console.log(`Najnizsza min cecha w 10k przebiegow: ${minOfAllMins}`);

// Test pokrycia: dla kazdego archetypu znajdz kombinacje ktora go wybiera
console.log(`\n=== Test pokrycia (kazdy archetyp osiagalny?) ===\n`);
const covered = new Set();
for (let i = 0; i < 50_000 && covered.size < 6; i++) {
  const { scores, peripheral_sum, firstAnswerPoints } = simulateOnePlayer();
  const { dominant_profile } = pickArchetype(scores, { peripheral_sum, firstAnswerPoints });
  covered.add(dominant_profile);
}
for (const p of PROFILES) {
  console.log(`  ${p}: ${covered.has(p) ? "✅ osiagalny" : "⚠️ NIEOSIAGALNY"}`);
}
