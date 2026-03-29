/**
 * BaseAgent — Bazowy moduł agenta AI z integracją Claude API (Anthropic).
 *
 * Zapewnia:
 * - Komunikację z Claude API (messages endpoint)
 * - Retry z exponential backoff
 * - Walidację odpowiedzi JSON
 * - Logowanie i metryki
 * - Zarządzanie kontekstem konwersacji
 */

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

export class BaseAgent {
  /**
   * @param {object} options
   * @param {string} options.name — Nazwa agenta (do logów)
   * @param {string} options.systemPrompt — System prompt
   * @param {string} [options.model] — Model Claude (domyślnie claude-sonnet-4-20250514)
   * @param {number} [options.temperature] — Temperatura (domyślnie 0.4)
   * @param {number} [options.maxTokens] — Maks. tokenów odpowiedzi (domyślnie 1024)
   * @param {number} [options.maxRetries] — Maks. prób (domyślnie 3)
   */
  constructor({
    name,
    systemPrompt,
    model = "claude-sonnet-4-20250514",
    temperature = 0.4,
    maxTokens = 1024,
    maxRetries = 3,
  }) {
    this.name = name;
    this.systemPrompt = systemPrompt;
    this.model = model;
    this.temperature = temperature;
    this.maxTokens = maxTokens;
    this.maxRetries = maxRetries;
    this.apiKey = process.env.ANTHROPIC_API_KEY || "";
    this._callCount = 0;
    this._totalTokens = 0;
  }

  // ── Główna metoda wywołania AI ──────────────────────────────────────

  /**
   * Wysyła zapytanie do Claude API i zwraca odpowiedź.
   *
   * @param {string} userMessage — Wiadomość użytkownika
   * @param {object} [options]
   * @param {boolean} [options.jsonMode] — Wymuszenie odpowiedzi JSON
   * @param {Array} [options.conversationHistory] — Dotychczasowa historia
   * @returns {Promise<string>} Odpowiedź tekstowa od Claude
   */
  async call(userMessage, options = {}) {
    const { jsonMode = false, conversationHistory = [] } = options;

    const messages = [
      ...conversationHistory,
      { role: "user", content: userMessage },
    ];

    let systemContent = this.systemPrompt;
    if (jsonMode) {
      systemContent += "\n\nZAWSZE odpowiadaj wyłącznie poprawnym JSON. Nie dodawaj żadnego tekstu przed ani po JSON.";
    }

    const body = {
      model: this.model,
      max_tokens: this.maxTokens,
      temperature: this.temperature,
      system: systemContent,
      messages,
    };

    let lastError;
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const response = await this._fetch(body);
        this._callCount++;

        if (response.usage) {
          this._totalTokens += (response.usage.input_tokens || 0) + (response.usage.output_tokens || 0);
        }

        const text = response.content?.[0]?.text || "";

        if (jsonMode) {
          return this._extractJSON(text);
        }
        return text;

      } catch (err) {
        lastError = err;
        console.warn(`[${this.name}] Próba ${attempt}/${this.maxRetries} nie powiodła się:`, err.message);

        if (attempt < this.maxRetries) {
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
          await new Promise((r) => setTimeout(r, delay));
        }
      }
    }

    throw new Error(`[${this.name}] Wszystkie ${this.maxRetries} próby nie powiodły się. Ostatni błąd: ${lastError?.message}`);
  }

  /**
   * Wywołanie z oczekiwaniem odpowiedzi JSON (sparsowanej).
   * @param {string} userMessage
   * @param {object} [options]
   * @returns {Promise<object>} Sparsowany JSON
   */
  async callJSON(userMessage, options = {}) {
    const text = await this.call(userMessage, { ...options, jsonMode: true });
    try {
      return JSON.parse(text);
    } catch (e) {
      throw new Error(`[${this.name}] Nie udało się sparsować JSON: ${e.message}\nOtrzymano: ${text.substring(0, 200)}`);
    }
  }

  // ── Fetch do API ──────────────────────────────────────────────────

  async _fetch(body) {
    if (!this.apiKey) {
      // Tryb demo — zwracamy fallback bez API
      console.warn(`[${this.name}] Brak ANTHROPIC_API_KEY — tryb demo/fallback`);
      return this._demoFallback(body);
    }

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
      const errBody = await res.text().catch(() => "");
      throw new Error(`Claude API HTTP ${res.status}: ${errBody.substring(0, 300)}`);
    }

    return res.json();
  }

  // ── Demo fallback (bez klucza API) ────────────────────────────────

  _demoFallback(body) {
    // Podklasy mogą nadpisać tę metodę
    return {
      content: [{ text: JSON.stringify({ _demo: true, agent: this.name, message: "Tryb demo — brak klucza API" }) }],
      usage: { input_tokens: 0, output_tokens: 0 },
    };
  }

  // ── Ekstrakcja JSON z odpowiedzi ──────────────────────────────────

  _extractJSON(text) {
    // Próba bezpośredniego parsowania
    const trimmed = text.trim();
    if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
      try {
        JSON.parse(trimmed);
        return trimmed;
      } catch {}
    }

    // Szukanie bloku ```json ... ```
    const codeBlockMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlockMatch) {
      return codeBlockMatch[1].trim();
    }

    // Szukanie pierwszego { ... } lub [ ... ]
    const jsonMatch = trimmed.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
    if (jsonMatch) {
      return jsonMatch[1];
    }

    return trimmed;
  }

  // ── Metryki ───────────────────────────────────────────────────────

  getMetrics() {
    return {
      agent: this.name,
      calls: this._callCount,
      totalTokens: this._totalTokens,
    };
  }
}
