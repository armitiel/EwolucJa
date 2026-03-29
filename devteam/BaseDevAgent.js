/**
 * BaseDevAgent — Bazowy agent deweloperski z integracją Claude API.
 *
 * Rozszerza wzorzec z backend/src/agents/BaseAgent.js,
 * ale działa samodzielnie (nie wymaga backendu Express).
 *
 * Używany przez: Telegram Bot + CLI + Cowork
 */

import fs from "fs";
import path from "path";

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

export class BaseDevAgent {
  constructor({ name, role, systemPrompt, model = "claude-sonnet-4-20250514", temperature = 0.3, maxTokens = 4096 }) {
    this.name = name;
    this.role = role;
    this.systemPrompt = systemPrompt;
    this.model = model;
    this.temperature = temperature;
    this.maxTokens = maxTokens;
    this.apiKey = process.env.ANTHROPIC_API_KEY || "";
    this.conversationHistory = [];
    this._callCount = 0;
  }

  /** Dodaj kontekst projektu do prompta */
  _projectContext() {
    const projectRoot = process.env.PROJECT_ROOT || path.resolve(".");
    let context = `\nPROJEKT: EwolucJA — edukacyjna gra PWA (React + Express + SQLite + Claude API)\n`;
    context += `KATALOG: ${projectRoot}\n`;

    // Próba odczytania package.json dla kontekstu
    try {
      const pkg = JSON.parse(fs.readFileSync(path.join(projectRoot, "frontend", "package.json"), "utf-8"));
      context += `FRONTEND: ${pkg.name} v${pkg.version} (${Object.keys(pkg.dependencies || {}).join(", ")})\n`;
    } catch {}
    try {
      const pkg = JSON.parse(fs.readFileSync(path.join(projectRoot, "backend", "package.json"), "utf-8"));
      context += `BACKEND: ${pkg.name} v${pkg.version} (${Object.keys(pkg.dependencies || {}).join(", ")})\n`;
    } catch {}

    return context;
  }

  /** Wyślij wiadomość do agenta */
  async chat(userMessage, options = {}) {
    const { includeProjectContext = true, resetHistory = false } = options;

    if (resetHistory) this.conversationHistory = [];

    let fullSystem = this.systemPrompt;
    if (includeProjectContext) fullSystem += this._projectContext();

    this.conversationHistory.push({ role: "user", content: userMessage });

    // Ogranicz historię do 20 ostatnich wiadomości
    if (this.conversationHistory.length > 20) {
      this.conversationHistory = this.conversationHistory.slice(-20);
    }

    const body = {
      model: this.model,
      max_tokens: this.maxTokens,
      temperature: this.temperature,
      system: fullSystem,
      messages: this.conversationHistory,
    };

    let responseText;
    if (!this.apiKey) {
      responseText = `[${this.name} — tryb demo] Brak ANTHROPIC_API_KEY. Ustaw zmienną środowiskową, żebym mógł odpowiadać na żywo.`;
    } else {
      responseText = await this._callAPI(body);
    }

    this.conversationHistory.push({ role: "assistant", content: responseText });
    this._callCount++;

    return responseText;
  }

  async _callAPI(body) {
    const res = await fetch(ANTHROPIC_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.text().catch(() => "");
      throw new Error(`Claude API ${res.status}: ${err.substring(0, 200)}`);
    }

    const data = await res.json();
    return data.content?.[0]?.text || "[Brak odpowiedzi]";
  }

  /** Wyczyść historię konwersacji */
  reset() {
    this.conversationHistory = [];
  }

  getInfo() {
    return { name: this.name, role: this.role, calls: this._callCount, historyLength: this.conversationHistory.length };
  }
}
