/**
 * agentAPI.js — Serwis komunikacji frontendu z agentami AI (GAMA-1)
 *
 * Wszystkie wywołania idą przez backend Express → GameOrchestrator → Agenci Claude
 *
 * ARCHITEKTURA:
 *   React (frontend)
 *     ↓ fetch()
 *   Express API (/api/agents/*)
 *     ↓
 *   GameOrchestrator
 *     ↓
 *   [NarratorAgent, ProfilerAgent, CreativityAgent, ReportAgent, AvatarAgent]
 *     ↓
 *   Claude API (Anthropic)
 */

const API_BASE = "http://localhost:3001/api/agents";
const IMAGES_BASE = "http://localhost:3001/api/images";

// ── Pomocnik fetch ──────────────────────────────────────────────────

async function agentFetch(endpoint, body = {}) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
      throw new Error(err.error || `Błąd serwera: ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.warn(`[agentAPI] ${endpoint} error:`, err.message);
    return null; // Frontend obsłuży null jako fallback
  }
}

// ═══════════════════════════════════════════════════════════════════════
//  PUBLICZNE METODY API
// ═══════════════════════════════════════════════════════════════════════

/**
 * 1. NARRACJA — Pobierz dynamiczną narrację dla krainy/zadania.
 *
 * Użycie w komponencie:
 *   const narration = await agentAPI.getNarration(playerId, "las_decyzji", 2);
 *   // narration.narration → tekst fabularny
 *   // narration.atmosphere → opis nastroju
 *   // narration.avatar_reaction → reakcja awatara
 */
export async function getNarration(playerId, land, taskId) {
  return agentFetch("/narrate", { player_id: playerId, land, task_id: taskId });
}

/**
 * 2. PRZEJŚCIE MIĘDZY KRAINAMI — Narracja animacji przejścia.
 *
 * Użycie:
 *   const transition = await agentAPI.getTransition(playerId, "dolina_selfie", "las_decyzji");
 *   // transition.transition_text → "Opuszczasz Dolinę Selfie..."
 *   // transition.new_land_teaser → "Przed tobą gęsty, tajemniczy las..."
 */
export async function getTransition(playerId, fromLand, toLand) {
  return agentFetch("/transition", { player_id: playerId, from_land: fromLand, to_land: toLand });
}

/**
 * 3. MIKRO-ANALIZA WYBORU — Agent analizuje pojedynczy wybór "w locie".
 *
 * Użycie (opcjonalne, w tle po każdym wyborze):
 *   const insight = await agentAPI.analyzeChoice(playerId, 3, "A", { reaction_time_ms: 2500 });
 *   // insight.micro_insight → "Gracz wykazuje empatię"
 *   // insight.profile_tendency → "EM"
 */
export async function analyzeChoice(playerId, taskId, choiceId, behavioralData = {}) {
  return agentFetch("/analyze", { player_id: playerId, task_id: taskId, choice_id: choiceId, behavioral_data: behavioralData });
}

/**
 * 4. EWALUACJA KREATYWNOŚCI — Ocena odpowiedzi tekstowej (Zadanie 7).
 *
 * Użycie:
 *   const result = await agentAPI.evaluateCreativity(playerId, "Użyję parasola jako spadochronu!");
 *   // result.score → 3 (skala 1-4)
 *   // result.feedback → "Świetny pomysł! Twoja wyobraźnia..."
 *   // result.originality → "nieszablonowe"
 */
export async function evaluateCreativity(playerId, answer) {
  return agentFetch("/creativity", { player_id: playerId, answer });
}

/**
 * 5. OPIS EKWIPUNKU — Dynamiczny opis zdobytego przedmiotu.
 *
 * Użycie:
 *   const desc = await agentAPI.describeEquipment(playerId, "green_cape", "Zielona Peleryna", "Pomoc Chowańcowi");
 *   // desc.acquisition_narration → "Peleryna materializuje się w blasku..."
 *   // desc.item_description → "Miękka, szmaragdowa tkanina..."
 *   // desc.avatar_change → "Twój awatar promienieje..."
 */
export async function describeEquipment(playerId, itemId, itemName, context) {
  return agentFetch("/equipment", { player_id: playerId, item_id: itemId, item_name: itemName, context });
}

/**
 * 6. FINALIZACJA — Pełne raporty + analiza + karta bohatera.
 *
 * Użycie (na ekranie końcowym):
 *   const final = await agentAPI.finalizeGame(playerId);
 *   // final.student_report → raport dla ucznia
 *   // final.teacher_report → raport CASEL/VIA dla nauczyciela
 *   // final.hero_card → karta bohatera (opis, motto, epithet)
 *   // final.behavioral_analysis → pełna analiza behawioralna
 */
export async function finalizeGame(playerId) {
  return agentFetch("/finalize", { player_id: playerId });
}

/**
 * 7. PROMPT DO OBRAZU — Generuj prompt do DALL-E / Stable Diffusion.
 *
 * Użycie (opcjonalne rozszerzenie):
 *   const imgPrompt = await agentAPI.getImagePrompt(playerId);
 *   // imgPrompt.dalle_prompt → "A Pixar-style 3D chibi character..."
 */
export async function getImagePrompt(playerId) {
  return agentFetch("/image-prompt", { player_id: playerId });
}

/**
 * 8. METRYKI — Statystyki użycia agentów (dla panelu admina).
 */
export async function getMetrics() {
  const res = await fetch(`${API_BASE}/metrics`);
  return res.json();
}

// ═══════════════════════════════════════════════════════════════════════
//  OBRAZY — fal.ai
// ═══════════════════════════════════════════════════════════════════════

async function imageFetch(endpoint, body = {}) {
  try {
    const res = await fetch(`${IMAGES_BASE}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn(`[agentAPI/images] ${endpoint} error:`, err.message);
    return null;
  }
}

/**
 * 9. GENERUJ AWATAR AI — fal.ai tworzy obraz postaci
 */
export async function generateAvatar(playerName, avatarConfig = {}, gender = "boy", equipment = [], previousAvatarUrl = null) {
  return imageFetch("/avatar", { playerName, avatarConfig, gender, equipment, previousAvatarUrl });
}

/**
 * 10. GENERUJ TLO KRAINY — fal.ai splash screen background
 */
export async function generateLandBackground(landName) {
  return imageFetch("/land", { landName });
}

/**
 * 11. GENERUJ KARTE BOHATERA — fal.ai hero image
 */
export async function generateHeroCard(playerName, hybridTitle, equipment = []) {
  return imageFetch("/hero-card", { playerName, hybridTitle, equipment });
}

/**
 * 12. GENERUJ OBRAZ EKWIPUNKU — fal.ai item icon
 */
export async function generateEquipmentImage(itemName, description = "") {
  return imageFetch("/equipment", { itemName, itemDescription: description });
}

/**
 * 13. PEŁNA FINALIZACJA Z OBRAZEM — agenci + fal.ai
 */
export async function finalizeGameFull(playerId) {
  return agentFetch("/finalize-full", { player_id: playerId });
}

/**
 * 14. STATUS SERWISU OBRAZÓW
 */
export async function getImageStatus() {
  try {
    const res = await fetch(`${IMAGES_BASE}/status`);
    return res.json();
  } catch {
    return null;
  }
}

// ── Eksport zbiorczy ────────────────────────────────────────────────

const agentAPI = {
  getNarration,
  getTransition,
  analyzeChoice,
  evaluateCreativity,
  describeEquipment,
  finalizeGame,
  finalizeGameFull,
  getImagePrompt,
  getMetrics,
  // Obrazy fal.ai
  generateAvatar,
  generateLandBackground,
  generateHeroCard,
  generateEquipmentImage,
  getImageStatus,
};

export default agentAPI;
