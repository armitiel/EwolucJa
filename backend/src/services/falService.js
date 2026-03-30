/**
 * falService — Generowanie grafik AI przez fal.ai
 *
 * Obsługuje:
 * 1. Generowanie awatarów w stylu Pixar/Claymorphism
 * 2. Generowanie tła krain (splash screeny)
 * 3. Generowanie kart bohaterów (podsumowanie końcowe)
 * 4. Cache wyników (in-memory + opcjonalnie disk)
 *
 * Używa fal.ai API (flux, stable-diffusion, etc.)
 */

// Synchroniczny endpoint (fal.run) — zwraca obraz od razu
const FAL_API_URL = "https://fal.run";

// Styl bazowy dla wszystkich generacji
const BASE_STYLE = "3D Pixar claymorphism style, soft clay-like textures, rounded shapes, " +
  "vibrant saturated colors, matte finish, soft shadows, warm lighting, " +
  "chibi proportions, big expressive eyes, cozy safe look, children-friendly";

const NEGATIVE_PROMPT = "realistic, photographic, dark, scary, violent, blood, " +
  "nsfw, ugly, deformed, noisy, blurry, low contrast, text, watermark, " +
  "sharp edges, angular, adult content";

// Predefiniowane prompty dla krain (tła splash screenów)
const LAND_PROMPTS = {
  dolina_selfie: `A magical valley with floating mirrors and crystal selfie frames, ${BASE_STYLE}, purple and pink gradient sky, sparkling particles, flowers made of light`,
  las_decyzji: `An enchanted forest with two winding paths diverging, ${BASE_STYLE}, deep green canopy, glowing mushrooms, mystical fog, tiny woodland creatures`,
  jaskinia_emocji: `A magical crystal cave with glowing emotion crystals in different colors, ${BASE_STYLE}, blue bioluminescent light, floating crystal shards, ethereal atmosphere`,
  wyspa_talentow: `A tropical island with creative workshops and invention stations, ${BASE_STYLE}, orange sunset sky, colorful palm trees, rainbow waterfalls, art supplies floating`,
  przystan_wspolpracy: `A cozy harbor village with friendly sea creatures building a raft together, ${BASE_STYLE}, cyan ocean, wooden docks, lanterns, cooperative spirit`,
  gora_podsumowania: `A golden mountain summit with a hero standing at the peak looking over clouds, ${BASE_STYLE}, golden hour light, achievement trophies, stars and fireworks`,
};

class FalService {
  constructor() {
    this.apiKey = process.env.FAL_KEY || "";
    this.cache = new Map();
    this.maxCacheSize = 50;
    this.generating = new Map(); // In-flight requests deduplication
  }

  /**
   * Sprawdza czy serwis jest skonfigurowany
   */
  isAvailable() {
    return this.apiKey.length > 10;
  }

  /**
   * Generuje obraz przez fal.ai
   *
   * @param {string} prompt - Prompt opisujący obraz
   * @param {object} options
   * @param {string} options.model - Model do użycia (default: fal-ai/flux/schnell)
   * @param {string} options.negativePrompt
   * @param {string} options.imageSize - "square_hd", "landscape_4_3", "portrait_4_3"
   * @param {number} options.numSteps - Liczba kroków (domyślnie 4 dla schnell)
   * @param {boolean} options.enableSafetyChecker
   * @returns {Promise<{url: string, seed: number, timings: object}>}
   */
  async generate(prompt, options = {}) {
    if (!this.isAvailable()) {
      throw new Error("Fal.ai API key not configured");
    }

    const {
      model = "fal-ai/flux/schnell",
      negativePrompt = NEGATIVE_PROMPT,
      imageSize = "square_hd",
      numSteps = 4,
      enableSafetyChecker = true,
    } = options;

    // Cache check
    const cacheKey = `${model}:${prompt.slice(0, 100)}:${imageSize}`;
    if (this.cache.has(cacheKey)) {
      console.log("[FalService] Cache hit:", cacheKey.slice(0, 60));
      return this.cache.get(cacheKey);
    }

    // Deduplication — jeśli to samo żądanie jest w trakcie, czekaj
    if (this.generating.has(cacheKey)) {
      console.log("[FalService] Waiting for in-flight request:", cacheKey.slice(0, 60));
      return this.generating.get(cacheKey);
    }

    const requestPromise = this._doGenerate(model, prompt, negativePrompt, imageSize, numSteps, enableSafetyChecker);
    this.generating.set(cacheKey, requestPromise);

    try {
      const result = await requestPromise;

      // Cache result
      if (this.cache.size >= this.maxCacheSize) {
        const firstKey = this.cache.keys().next().value;
        this.cache.delete(firstKey);
      }
      this.cache.set(cacheKey, result);

      return result;
    } finally {
      this.generating.delete(cacheKey);
    }
  }

  /**
   * Image-to-image — generuje nowy obraz na bazie poprzedniego (zachowuje spójność)
   */
  async _generateImg2Img(prompt, imageUrl, options = {}) {
    if (!this.isAvailable()) {
      throw new Error("Fal.ai API key not configured");
    }

    const {
      imageSize = "square_hd",
      numSteps = 4,
      strength = 0.55,
    } = options;

    // Użyj flux/dev/image-to-image dla img2img
    const model = "fal-ai/flux/dev/image-to-image";
    const url = `${FAL_API_URL}/${model}`;

    const body = {
      prompt,
      image_url: imageUrl,
      image_size: imageSize,
      num_inference_steps: Math.max(numSteps, 15), // img2img potrzebuje więcej kroków
      num_images: 1,
      strength, // 0 = identyczny, 1 = zupełnie nowy
      enable_safety_checker: true,
    };

    console.log(`[FalService] Img2Img with strength=${strength}, model=${model}`);
    console.log(`[FalService] Prompt: ${prompt.slice(0, 120)}...`);

    const startTime = Date.now();

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Key ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[FalService] Img2Img error ${response.status}:`, errorText);
      // Fallback do zwykłego text2img
      console.log("[FalService] Falling back to text2img...");
      return this.generate(prompt, { imageSize, numSteps });
    }

    const data = await response.json();
    const elapsed = Date.now() - startTime;
    console.log(`[FalService] Img2Img generated in ${elapsed}ms`);

    const image = data.images?.[0] || {};
    return {
      url: image.url || "",
      width: image.width || 1024,
      height: image.height || 1024,
      seed: data.seed || 0,
      timings: data.timings || {},
      elapsed_ms: elapsed,
    };
  }

  /**
   * Wykonuje żądanie do fal.ai API (synchronous mode)
   */
  async _doGenerate(model, prompt, negativePrompt, imageSize, numSteps, enableSafetyChecker) {
    const url = `${FAL_API_URL}/${model}`;

    const body = {
      prompt,
      image_size: imageSize,
      num_inference_steps: numSteps,
      num_images: 1,
      enable_safety_checker: enableSafetyChecker,
    };

    // Dodaj negative prompt jeśli model go obsługuje
    if (negativePrompt && !model.includes("flux")) {
      body.negative_prompt = negativePrompt;
    }

    console.log(`[FalService] Generating with ${model}...`);
    console.log(`[FalService] Prompt: ${prompt.slice(0, 120)}...`);

    const startTime = Date.now();

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Key ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[FalService] Error ${response.status}:`, errorText);
      throw new Error(`Fal.ai API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const elapsed = Date.now() - startTime;

    console.log(`[FalService] Generated in ${elapsed}ms`);

    // Fal.ai zwraca images[] array
    const image = data.images?.[0] || {};

    return {
      url: image.url || "",
      width: image.width || 1024,
      height: image.height || 1024,
      seed: data.seed || 0,
      timings: data.timings || {},
      elapsed_ms: elapsed,
    };
  }

  // ── Specjalizowane metody ──────────────────────────────────────────

  /**
   * Generuje awatar gracza na podstawie konfiguracji SVG buildera
   *
   * @param {object} params
   * @param {string} params.playerName
   * @param {string} params.avatarPrompt - Opcjonalny prompt nadpisujący
   * @param {object} params.avatarConfig - Konfiguracja z AvatarBuilder
   * @param {string} params.gender - "boy" | "girl"
   * @returns {Promise<{url: string}>}
   */
  async generateAvatar({ playerName, avatarPrompt, avatarConfig, gender, equipment, previousAvatarUrl }) {
    if (avatarPrompt) {
      return this.generate(avatarPrompt, { imageSize: "square_hd", numSteps: 4 });
    }

    // Mapowanie ID kolorów z buildera na opisy do promptu
    const SKIN_NAMES = {
      light: "fair light", medium: "warm medium", tan: "tanned olive",
      brown: "brown", dark: "dark brown",
    };
    const EYE_NAMES = {
      blue: "bright blue", green: "emerald green", brown: "warm brown",
      hazel: "hazel", gray: "steel gray", amber: "golden amber", dark: "deep dark brown",
    };
    const COLOR_NAMES = {
      white: "white", red: "red", blue: "blue", green: "green",
      yellow: "yellow", purple: "purple", orange: "orange", pink: "pink",
      navy: "dark navy blue", black: "black", brown: "brown",
    };

    // Mapowanie ekwipunku na opisy wizualne do promptu
    const EQUIPMENT_VISUALS = {
      magnifier:        "holding a golden magnifying glass",
      shield:           "carrying a glowing blue shield on the arm",
      book:             "holding an ancient wisdom book",
      backpack:         "wearing a colorful adventure backpack",
      green_cape:       "wearing a flowing green cape",
      time_compass:     "with a magical compass on the belt",
      inventor_goggles: "wearing steampunk inventor goggles on the head",
      courage_crown:    "wearing a shining golden crown",
      crystal_heart:    "with a glowing crystal heart pendant on the chest",
      wisdom_scroll:    "holding a glowing scroll in hand",
      peace_branch:     "holding a white dove branch",
      team_medal:       "wearing a shiny team medal on the chest",
      star_boots:       "wearing glowing star-patterned boots",
      diamond_chest:    "with a small diamond chest floating beside",
    };

    const cfg = avatarConfig || {};
    const skinDesc = SKIN_NAMES[cfg.skinColor] || "light";
    const eyeDesc = EYE_NAMES[cfg.eyeColor] || "blue";
    const shirtDesc = COLOR_NAMES[cfg.shirtColor] || "white";
    const shortsDesc = COLOR_NAMES[cfg.shortsColor] || "white";
    const shoesDesc = COLOR_NAMES[cfg.shoesColor] || "white";
    const genderDesc = gender === "girl" ? "girl" : "boy";

    // Zbuduj opis ekwipunku
    const equipList = (equipment || [])
      .map(id => EQUIPMENT_VISUALS[id])
      .filter(Boolean);
    const equipDesc = equipList.length > 0
      ? `, ${equipList.join(", ")}`
      : "";

    const prompt =
      `A cute ${genderDesc} child character, full body standing pose, ` +
      `${skinDesc} skin tone, big round ${eyeDesc} eyes, ` +
      `wearing a ${shirtDesc} t-shirt, ${shortsDesc} shorts, and ${shoesDesc} sneakers, ` +
      `bald head (no hair), friendly cheerful smile${equipDesc}, ` +
      `${BASE_STYLE}, portrait, centered, clean soft gradient background, adventure-ready pose`;

    console.log("[FalService] Avatar prompt from config:", prompt.slice(0, 300));

    // Jeśli mamy poprzedni avatar — użyj image-to-image dla spójności
    if (previousAvatarUrl) {
      console.log("[FalService] Using img2img with previous avatar for consistency");
      return this._generateImg2Img(prompt, previousAvatarUrl, {
        imageSize: "square_hd",
        numSteps: 4,
        strength: 0.55, // Niska siła — zachowaj podobieństwo, dodaj nowy ekwipunek
      });
    }

    return this.generate(prompt, {
      imageSize: "square_hd",
      numSteps: 4,
    });
  }

  /**
   * Generuje tło krainy (splash screen)
   */
  async generateLandBackground(landName) {
    const prompt = LAND_PROMPTS[landName];
    if (!prompt) throw new Error(`Unknown land: ${landName}`);

    return this.generate(prompt, {
      imageSize: "landscape_4_3",
      numSteps: 4,
    });
  }

  /**
   * Generuje kartę bohatera (podsumowanie końcowe)
   */
  async generateHeroCard({ playerName, hybridTitle, imagePrompt, equipment }) {
    const equipmentStr = (equipment || []).join(", ");

    const prompt = imagePrompt ||
      `A heroic child character called "${hybridTitle}", holding magical items (${equipmentStr}), ` +
      `standing on a mountain peak with golden light behind them, ` +
      `${BASE_STYLE}, epic hero pose, achievement celebration, sparkles and stars`;

    return this.generate(prompt, {
      imageSize: "portrait_4_3",
      numSteps: 4,
    });
  }

  /**
   * Generuje obraz ekwipunku
   */
  async generateEquipmentImage(itemName, itemDescription) {
    const prompt = `A magical item: ${itemName}. ${itemDescription}. ` +
      `${BASE_STYLE}, item icon, clean background, floating with sparkle effects, game asset style`;

    return this.generate(prompt, {
      imageSize: "square_hd",
      numSteps: 4,
    });
  }

  /**
   * Info o serwisie
   */
  getInfo() {
    return {
      available: this.isAvailable(),
      cacheSize: this.cache.size,
      inFlight: this.generating.size,
    };
  }

  /**
   * Wyczyść cache
   */
  clearCache() {
    this.cache.clear();
    console.log("[FalService] Cache cleared");
  }
}

// Singleton
export const falService = new FalService();
