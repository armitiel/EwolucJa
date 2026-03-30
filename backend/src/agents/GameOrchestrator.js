/**
 * GameOrchestrator — Orkiestrator systemu agentów GAMA-1
 *
 * Zarządza wszystkimi agentami AI i koordynuje ich współpracę:
 * - Decyduje kiedy wywołać którego agenta
 * - Łączy wyniki z wielu agentów
 * - Obsługuje fallback (tryb demo bez API key)
 * - Loguje metryki i stan gry
 *
 * ARCHITEKTURA:
 *   Frontend → API → GameOrchestrator → [NarratorAgent, ProfilerAgent, CreativityAgent, ReportAgent, AvatarAgent]
 */

import { NarratorAgent } from "./NarratorAgent.js";
import { ProfilerAgent } from "./ProfilerAgent.js";
import { CreativityAgent } from "./CreativityAgent.js";
import { ReportAgent } from "./ReportAgent.js";
import { AvatarAgent } from "./AvatarAgent.js";

import { falService } from "../services/falService.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCENARIOS_PATH = path.resolve(__dirname, "../../../agents/prompts/lands_scenarios.txt");

export class GameOrchestrator {
  constructor() {
    this.narrator = new NarratorAgent();
    this.profiler = new ProfilerAgent();
    this.creativity = new CreativityAgent();
    this.reporter = new ReportAgent();
    this.avatar = new AvatarAgent();

    // Załaduj scenariusze
    try {
      this.scenariosText = fs.readFileSync(SCENARIOS_PATH, "utf-8");
    } catch {
      console.warn("[GameOrchestrator] Nie znaleziono lands_scenarios.txt — używam pustego");
      this.scenariosText = "";
    }
  }

  // ── Ekstrakcja sekcji scenariusza ────────────────────────────────

  _getLandScenario(landName) {
    const headers = {
      dolina_selfie: "KRAINA 1: DOLINA SELFIE",
      las_decyzji: "KRAINA 2: LAS DECYZJI",
      jaskinia_emocji: "KRAINA 3: JASKINIA EMOCJI",
      wyspa_talentow: "KRAINA 4: WYSPA TALENTÓW",
      przystan_wspolpracy: "KRAINA 5: PRZYSTAŃ WSPÓŁPRACY",
      gora_podsumowania: "GÓRA PODSUMOWANIA",
    };
    const header = headers[landName] || "";
    const start = this.scenariosText.indexOf(header);
    if (start === -1) return `[Brak scenariusza dla: ${landName}]`;

    const nextSection = this.scenariosText.indexOf("=" .repeat(20), start + header.length + 1);
    return nextSection === -1
      ? this.scenariosText.slice(start)
      : this.scenariosText.slice(start, nextSection).trim();
  }

  // ═══════════════════════════════════════════════════════════════════
  //  GŁÓWNE METODY ORKIESTRATORA
  // ═══════════════════════════════════════════════════════════════════

  /**
   * Wejście do krainy — generuje narrację + opcjonalnie sugestie awatara.
   *
   * @param {object} playerProfile — Pełny profil gracza z DB
   * @param {string} landName — ID krainy
   * @param {number} taskId — Numer zadania
   * @returns {Promise<object>} { narration, avatarReaction, atmosphere }
   */
  async enterLand(playerProfile, landName, taskId) {
    const scenarioText = this._getLandScenario(landName);

    const narrationResult = await this.narrator.generateNarration({
      playerName: playerProfile.name,
      land: landName,
      taskId,
      scores: playerProfile.scores || { EM: 0, ST: 0, KR: 0, LD: 0, DT: 0, MD: 0 },
      choicesLog: playerProfile.choices_log || [],
      scenarioText,
    });

    return {
      narration: narrationResult.narration || narrationResult,
      choices: narrationResult.choices || [],
      atmosphere: narrationResult.atmosphere || "",
      avatar_reaction: narrationResult.avatar_reaction || "",
      land: landName,
      task_id: taskId,
    };
  }

  /**
   * Przejście między krainami.
   */
  async transitionLand(playerProfile, fromLand, toLand) {
    return this.narrator.generateTransition({
      playerName: playerProfile.name,
      fromLand,
      toLand,
      scores: playerProfile.scores || {},
    });
  }

  /**
   * Przetwarzanie wyboru — scoring + mikro-analiza + ewentualny ekwipunek.
   *
   * @param {object} playerProfile
   * @param {number} taskId
   * @param {string} choiceId
   * @param {object} [behavioralData]
   * @returns {Promise<object>} { scores, points_awarded, micro_insight, new_equipment }
   */
  async processChoice(playerProfile, taskId, choiceId, behavioralData = {}) {
    // Mikro-analiza w tle (nie blokuje)
    const microAnalysisPromise = this.profiler.analyzeSingleChoice({
      taskId,
      choiceId,
      behavioralData,
      currentScores: playerProfile.scores || {},
    }).catch((err) => {
      console.warn("[GameOrchestrator] Mikro-analiza nieudana:", err.message);
      return { micro_insight: null, profile_tendency: null, confidence: 0 };
    });

    const microAnalysis = await microAnalysisPromise;

    return {
      micro_insight: microAnalysis.micro_insight,
      profile_tendency: microAnalysis.profile_tendency,
    };
  }

  /**
   * Ewaluacja odpowiedzi kreatywnej (Zadanie 7).
   *
   * @param {object} playerProfile
   * @param {string} answer — Tekst odpowiedzi gracza
   * @returns {Promise<object>} { score, feedback, originality }
   */
  async evaluateCreativity(playerProfile, answer) {
    const result = await this.creativity.evaluateCreativity({
      playerName: playerProfile.name,
      answer,
      taskId: 7,
    });

    return {
      score: result.score || 1,
      feedback: result.feedback_for_player || "Świetny pomysł!",
      originality: result.originality || "standardowe",
      items_combined: result.items_combined || false,
      reasoning: result.reasoning || "",
    };
  }

  /**
   * Opis nowo zdobytego przedmiotu.
   */
  async describeEquipment(playerProfile, itemId, itemName, context) {
    return this.avatar.describeNewItem({
      playerName: playerProfile.name,
      itemId,
      itemName,
      context,
    });
  }

  /**
   * Finalizacja gry — pełna analiza + raporty + karta bohatera.
   *
   * @param {object} playerProfile — Profil z final_profile
   * @returns {Promise<object>} { student_report, teacher_report, hero_card, behavioral_analysis }
   */
  async finalizeGame(playerProfile) {
    const { scores, name, final_profile, choices_log, avatar_config, equipment } = playerProfile;
    const hybridTitle = final_profile?.hybrid_title || "Bohater Ewolucji";
    const dominantProfiles = final_profile?.dominant_profiles || ["EM", "ST"];
    const challengeArea = final_profile?.challenge_area || "KR";

    // Równoległe wywołanie 3 agentów
    const [behavioralAnalysis, reports, heroCard] = await Promise.allSettled([
      // 1. Analiza behawioralna
      this.profiler.analyzeFullProfile({
        playerName: name,
        scores: scores || {},
        choicesLog: choices_log || [],
      }),

      // 2. Raporty (uczeń + nauczyciel)
      this.reporter.generateReports({
        playerName: name,
        scores: scores || {},
        hybridTitle,
        dominantProfiles,
        challengeArea,
        choicesLog: choices_log || [],
      }),

      // 3. Karta Bohatera
      this.avatar.generateHeroCard({
        playerName: name,
        hybridTitle,
        dominantProfiles,
        scores: scores || {},
        equipment: equipment || [],
        avatarConfig: avatar_config || {},
      }),
    ]);

    return {
      behavioral_analysis: behavioralAnalysis.status === "fulfilled" ? behavioralAnalysis.value : null,
      student_report: reports.status === "fulfilled" ? reports.value?.student_report : null,
      teacher_report: reports.status === "fulfilled" ? reports.value?.teacher_report : null,
      hero_card: heroCard.status === "fulfilled" ? heroCard.value : null,
    };
  }

  /**
   * Generowanie promptu do AI image generation.
   */
  async generateAvatarImagePrompt(playerProfile) {
    return this.avatar.generateImagePrompt({
      playerName: playerProfile.name,
      hybridTitle: playerProfile.final_profile?.hybrid_title || "Bohater",
      equipment: playerProfile.equipment || [],
      avatarConfig: playerProfile.avatar_config || {},
    });
  }

  /**
   * Pełny pipeline: Agent generuje prompt → fal.ai generuje obraz
   *
   * @param {object} playerProfile
   * @returns {Promise<{prompt: string, image_url: string}>}
   */
  async generateAvatarImage(playerProfile) {
    // 1. AvatarAgent tworzy prompt
    const promptData = await this.generateAvatarImagePrompt(playerProfile);
    const dallePrompt = promptData?.dalle_prompt || "";

    if (!dallePrompt) {
      throw new Error("AvatarAgent nie wygenerował promptu");
    }

    // 2. fal.ai generuje obraz
    if (!falService.isAvailable()) {
      return { prompt: dallePrompt, image_url: null, reason: "fal.ai not configured" };
    }

    const image = await falService.generateAvatar({
      playerName: playerProfile.name,
      avatarPrompt: dallePrompt,
      avatarConfig: playerProfile.avatar_config || {},
      gender: playerProfile.gender || "boy",
      equipment: playerProfile.equipment || [],
    });

    return {
      prompt: dallePrompt,
      image_url: image.url,
      width: image.width,
      height: image.height,
      elapsed_ms: image.elapsed_ms,
    };
  }

  /**
   * Pełny pipeline finalizacji z obrazem karty bohatera
   */
  async finalizeGameWithImage(playerProfile) {
    // Równolegle: finalizacja agentów + generowanie obrazu
    const [gameResult, imageResult] = await Promise.allSettled([
      this.finalizeGame(playerProfile),
      this.generateAvatarImage(playerProfile),
    ]);

    const result = gameResult.status === "fulfilled" ? gameResult.value : {};
    const image = imageResult.status === "fulfilled" ? imageResult.value : null;

    return {
      ...result,
      hero_image: image,
    };
  }

  // ── Metryki ───────────────────────────────────────────────────────

  getMetrics() {
    return {
      agents: [
        this.narrator.getMetrics(),
        this.profiler.getMetrics(),
        this.creativity.getMetrics(),
        this.reporter.getMetrics(),
        this.avatar.getMetrics(),
      ],
    };
  }
}
