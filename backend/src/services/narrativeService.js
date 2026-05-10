/**
 * NarrativeService — generator opowieści/misji przez Claude API.
 * Zachowuje styl GAMA-1: język 6–12 lat, ton ciepły, claymorphism, bezpieczne misje w realu.
 *
 * Endpointy backendu używają isAvailable() — jeśli nie ma klucza, fallback na seed library.
 */

const ANTHROPIC_API = "https://api.anthropic.com/v1/messages";

const ARCHETYPE_PROFILES = {
  tropiciel_tajemnic: {
    name: "Tropiciel Tajemnic",
    profile: "DT (Detektyw)",
    voice: "ciepły, lekko tajemniczy, używa metafor 'tropy', 'kompas', 'cienie'",
  },
  zaklinacz_uczuc: {
    name: "Zaklinacz Uczuć",
    profile: "EM (Empata)",
    voice: "miękki, uważny, mówi o kolorach emocji",
  },
  mistrz_map: { name: "Mistrz Map", profile: "ST (Strateg)", voice: "spokojny, planujący" },
  tkacz_snow: { name: "Tkacz Snów", profile: "KR (Kreator)", voice: "rozmarzony, pełen porównań" },
  gwardzista_odwagi: { name: "Gwardzista Odwagi", profile: "LD (Lider)", voice: "śmiały, motywujący" },
  straznik_mostu: { name: "Strażnik Mostu", profile: "MD (Mediator)", voice: "łagodzący, łączący" },
};

export class NarrativeService {
  constructor() {
    this.apiKey = (process.env.ANTHROPIC_API_KEY || "").trim();
    this.model = (process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5-20250929").trim();
  }

  get isAvailable() {
    return !!this.apiKey;
  }

  async _callClaude({ system, user, maxTokens = 1024 }) {
    const res = await fetch(ANTHROPIC_API, {
      method: "POST",
      headers: {
        "x-api-key": this.apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: maxTokens,
        system,
        messages: [{ role: "user", content: user }],
      }),
    });
    if (!res.ok) {
      const err = await res.text().catch(() => "");
      throw new Error(`Anthropic API ${res.status}: ${err.substring(0, 300)}`);
    }
    const data = await res.json();
    return data.content?.[0]?.text || "";
  }

  /**
   * Generuje misję w realu spersonalizowaną pod gracza.
   * Zwraca { title, body, narrative_intro, competency_focus, proof_type, estimated_minutes, artifact_reward }
   */
  async generateMission({ playerName, archetype, completedMissionTitles = [], scores = {}, chapter = "wezwanie_kroniki" }) {
    if (!this.isAvailable) throw new Error("ANTHROPIC_API_KEY not configured");
    const arch = ARCHETYPE_PROFILES[archetype] || ARCHETYPE_PROFILES.tropiciel_tajemnic;
    const used = completedMissionTitles.length > 0
      ? `Misje, które już wykonał: ${completedMissionTitles.slice(-5).join("; ")}. NIE powtarzaj tych zadań.`
      : "To jego pierwsza misja.";
    const lowest = Object.entries(scores).sort((a, b) => a[1] - b[1])[0];
    const focus = lowest ? `Słabiej rozwinięta kompetencja: ${lowest[0]}. Jeśli pasuje, dotknij jej delikatnie.` : "";

    const system = `Jesteś GAMA-1, narratorem-mentorem dla dzieci 6-12 lat w grze EwolucJA. Mówisz językiem ciepłym, prostym, lekko bajkowym. Twój styl: ${arch.voice}. Generujesz misje "w realu" — krótkie, bezpieczne zadania do wykonania w domu lub blisko domu. Każda misja:
- ma jeden konkretny krok (1-2 zdania)
- jest BEZPIECZNA (nigdy: kontakt z obcymi, samodzielne wychodzenie, ryzyko)
- jest pozytywna (nawet "nieudana" próba jest okazją do rozmowy)
- rozwija kompetencje miękkie: EM (empatia), ST (strateg), KR (kreator), LD (lider), DT (detektyw), MD (mediator)

ZAWSZE odpowiadasz CZYSTYM JSON-em w formacie:
{
  "title": "krótki tytuł 2-4 słowa",
  "body": "treść misji 1-2 zdania, do dziecka",
  "narrative_intro": "1-2 zdania w stylu archetypu, klimatyczne wprowadzenie",
  "competency_focus": ["DT", "EM"],
  "proof_type": "conversation" | "photo" | "voice_note" | "drawing" | "physical_object",
  "estimated_minutes": 15,
  "artifact_reward": { "artifact_id": "snake_case", "artifact_name": "Polska nazwa" },
  "safety_notes": "opcjonalne, jeśli wymaga obecności dorosłego"
}

Bez żadnych \`\`\` ani komentarzy. Tylko JSON.`;

    const user = `Gracz: ${playerName}, archetyp: ${arch.name} (${arch.profile}).
${used}
${focus}
Aktualny rozdział: ${chapter}.

Wygeneruj jedną misję na ten tydzień. Misja musi być inna niż poprzednie. Wpleć imię gracza w narrative_intro.`;

    const text = await this._callClaude({ system, user, maxTokens: 600 });
    // Próbuj wyciągnąć JSON (Claude czasem dodaje tekst dookoła)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Claude nie zwrócił JSON-a");
    const parsed = JSON.parse(jsonMatch[0]);
    return parsed;
  }

  /**
   * Generuje wstęp narracyjny (np. powitanie po cyklu, między rozdziałami).
   * Zwraca { text, tone, suggested_pause_before }
   */
  async generateNarrativeIntro({ playerName, archetype, context }) {
    if (!this.isAvailable) throw new Error("ANTHROPIC_API_KEY not configured");
    const arch = ARCHETYPE_PROFILES[archetype] || ARCHETYPE_PROFILES.tropiciel_tajemnic;

    const system = `Jesteś GAMA-1. Generujesz krótkie wstępy narracyjne (2-3 zdania) w stylu archetypu gracza: ${arch.voice}. Twój ton: bajkowy, ciepły, używasz interpunkcji rytmicznie (kropki, kropki kropki, myślniki).
ZAWSZE odpowiadasz JSON-em:
{ "text": "...", "tone": "warm" | "mystery" | "celebration" | "whisper" | "calm", "suggested_pause_before": 0-1500 }
Bez \`\`\` i bez komentarzy.`;

    const user = `Gracz: ${playerName}, archetyp: ${arch.name}. Kontekst: ${context}`;

    const text = await this._callClaude({ system, user, maxTokens: 400 });
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Claude nie zwrócił JSON-a");
    return JSON.parse(jsonMatch[0]);
  }

  getInfo() {
    return { available: this.isAvailable, model: this.model };
  }
}

export const narrativeService = new NarrativeService();
