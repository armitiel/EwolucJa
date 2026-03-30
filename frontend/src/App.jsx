import React, { useState, useCallback, useRef, useEffect } from "react";
import AvatarBuilder from "./components/AvatarBuilder";
import AvatarDisplay from "./components/AvatarDisplay";
import AvatarAI from "./components/AvatarAI";
import NarratorVoice from "./components/NarratorVoice";
import LandTransition from "./components/LandTransition";
import { ttsPlayer } from "./services/ttsPlayer";
import agentAPI from "./services/agentAPI";
import { TASK_EQUIPMENT_MAP, EQUIPMENT_DEFS } from "./components/AvatarSVG";
import { GROWTH_TIPS, DAILY_MISSIONS } from "./growthData";

/* ════════════════════════════════════════════════════════════════════════
   EWOLUCJA — Prototyp PWA (Single-file React App)
   Gra fabularna wspierająca rozwój kompetencji miękkich (6-12 lat)
   + System awatara i ekwipunku (Claymorphism / Pixar)
   ════════════════════════════════════════════════════════════════════════ */

// ── Dane gry ──────────────────────────────────────────────────────────

const LANDS = [
  "dolina_selfie",
  "las_decyzji",
  "jaskinia_emocji",
  "wyspa_talentow",
  "przystan_wspolpracy",
  "gora_podsumowania",
];

const LAND_NAMES = {
  dolina_selfie: "Dolina Selfie",
  las_decyzji: "Las Decyzji",
  jaskinia_emocji: "Jaskinia Emocji",
  wyspa_talentow: "Wyspa Talentów",
  przystan_wspolpracy: "Przystań Współpracy",
  gora_podsumowania: "Góra Podsumowania",
};

const LAND_COLORS = {
  dolina_selfie: "#e8d5f5",
  las_decyzji: "#c8e6c9",
  jaskinia_emocji: "#b3c6e7",
  wyspa_talentow: "#ffe0b2",
  przystan_wspolpracy: "#b2ebf2",
  gora_podsumowania: "#ffd54f",
};

const LAND_ICONS = {
  dolina_selfie: "\u{1FA9E}",
  las_decyzji: "\u{1F332}",
  jaskinia_emocji: "\u{1F52E}",
  wyspa_talentow: "\u{1F3DD}\uFE0F",
  przystan_wspolpracy: "\u2693",
  gora_podsumowania: "\u{1F3D4}\uFE0F",
};

const LAND_BG_GRADIENTS = {
  dolina_selfie: "linear-gradient(135deg, #1a1a2e 0%, #2d1b4e 50%, #1a1040 100%)",
  las_decyzji: "linear-gradient(135deg, #0d1f0d 0%, #1a3a1a 50%, #0f2f1a 100%)",
  jaskinia_emocji: "linear-gradient(135deg, #0d1525 0%, #162040 50%, #0f1a3a 100%)",
  wyspa_talentow: "linear-gradient(135deg, #2a1a0a 0%, #3a2510 50%, #2a1f0a 100%)",
  przystan_wspolpracy: "linear-gradient(135deg, #0a1a2a 0%, #0f2535 50%, #0a2030 100%)",
  gora_podsumowania: "linear-gradient(135deg, #2a2200 0%, #3a3000 50%, #2a2500 100%)",
};

const LAND_CARD_GLOW = {
  dolina_selfie: "rgba(168, 85, 247, 0.15)",
  las_decyzji: "rgba(34, 197, 94, 0.15)",
  jaskinia_emocji: "rgba(59, 130, 246, 0.15)",
  wyspa_talentow: "rgba(249, 115, 22, 0.15)",
  przystan_wspolpracy: "rgba(6, 182, 212, 0.15)",
  gora_podsumowania: "rgba(234, 179, 8, 0.15)",
};

const LAND_CARD_BORDER = {
  dolina_selfie: "rgba(168, 85, 247, 0.3)",
  las_decyzji: "rgba(34, 197, 94, 0.3)",
  jaskinia_emocji: "rgba(59, 130, 246, 0.3)",
  wyspa_talentow: "rgba(249, 115, 22, 0.3)",
  przystan_wspolpracy: "rgba(6, 182, 212, 0.3)",
  gora_podsumowania: "rgba(234, 179, 8, 0.3)",
};

const PROFILE_LABELS = {
  EM: { name: "Empata", icon: "❤️", color: "#e74c3c" },
  ST: { name: "Strateg", icon: "🧠", color: "#3498db" },
  KR: { name: "Kreator", icon: "🎨", color: "#e67e22" },
  LD: { name: "Lider", icon: "🛡️", color: "#2ecc71" },
  DT: { name: "Detektyw", icon: "🔍", color: "#9b59b6" },
  MD: { name: "Mediator", icon: "🕊️", color: "#1abc9c" },
};

const HYBRID_TITLES = {
  DT_KR: "Wizjoner Tajemnic", EM_MD: "Strażnik Pokoju",
  LD_ST: "Generał Przygody", KR_ST: "Architekt Przyszłości",
  DT_EM: "Odkrywca Serc", KR_LD: "Mistrz Inwencji",
  LD_MD: "Kapitan Drużyny", DT_ST: "Łamacz Kodów",
  EM_KR: "Artysta Emocji", DT_MD: "Dyplomata Wiedzy",
  EM_LD: "Odważne Serce", MD_ST: "Mędrzec Pokoju",
  EM_ST: "Cierpliwy Opiekun", KR_MD: "Twórczy Mediator",
  DT_LD: "Śmiały Tropiciel",
};

const SCORING = {
  "1_A": { DT: 2 }, "1_B": { LD: 2 }, "1_C": { ST: 2 }, "1_D": { KR: 1 },
  "2_A": { ST: 2 }, "2_B": { DT: 3 },
  "3_A": { EM: 2 }, "3_B": { MD: 1 }, "3_C": { ST: 2, EM: -1 },
  "4_WAIT": { ST: 3 }, "4_CLICK": { LD: 1 },
  "6_A": { ST: 2, LD: 1 }, "6_B": { MD: 2 }, "6_C": {},
  "8_A": { LD: 1, MD: -1 }, "8_B": { MD: 2 }, "8_C": { MD: 2, ST: 1 },
  "9_A": { LD: 2 }, "9_B": { ST: 1 }, "9_C": { EM: 2 },
};

// ── Style inline ──────────────────────────────────────────────────────

const styles = {
  app: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "0",
    margin: "0",
    background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    color: "#f0f0f0",
  },
  container: {
    maxWidth: "480px",
    width: "100%",
    padding: "20px",
    boxSizing: "border-box",
  },
  header: {
    textAlign: "center",
    marginBottom: "24px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    background: "linear-gradient(90deg, #e94560, #ffd54f)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: "4px",
  },
  subtitle: {
    fontSize: "14px",
    color: "#8899aa",
  },
  card: {
    background: "rgba(255,255,255,0.08)",
    borderRadius: "16px",
    padding: "24px",
    marginBottom: "16px",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.1)",
  },
  narration: {
    fontSize: "16px",
    lineHeight: "1.6",
    marginBottom: "20px",
    fontStyle: "italic",
    color: "#ddd",
  },
  button: {
    display: "block",
    width: "100%",
    padding: "14px 20px",
    marginBottom: "10px",
    border: "2px solid rgba(255,255,255,0.15)",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.05)",
    color: "#f0f0f0",
    fontSize: "15px",
    cursor: "pointer",
    textAlign: "left",
    transition: "all 0.2s",
  },
  buttonHover: {
    background: "rgba(233,69,96,0.2)",
    borderColor: "#e94560",
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "12px",
    border: "2px solid rgba(255,255,255,0.15)",
    background: "rgba(255,255,255,0.05)",
    color: "#f0f0f0",
    fontSize: "16px",
    boxSizing: "border-box",
    marginBottom: "12px",
  },
  landBadge: (color) => ({
    display: "inline-block",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
    background: color,
    color: "#1a1a2e",
    marginBottom: "12px",
  }),
  timer: {
    textAlign: "center",
    fontSize: "48px",
    fontWeight: "700",
    color: "#ffd54f",
    margin: "20px 0",
  },
  progressBar: {
    display: "flex",
    gap: "4px",
    marginBottom: "20px",
  },
  progressDot: (active, done) => ({
    flex: 1,
    height: "6px",
    borderRadius: "3px",
    background: done ? "#e94560" : active ? "#ffd54f" : "rgba(255,255,255,0.15)",
  }),
  scoreBar: (value, color) => ({
    height: "8px",
    borderRadius: "4px",
    background: `linear-gradient(90deg, ${color}, ${color}88)`,
    width: `${(value / 10) * 100}%`,
    transition: "width 0.5s ease",
  }),
  scoreRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "10px",
  },
  scoreLabel: {
    fontSize: "13px",
    width: "100px",
  },
  scoreTrack: {
    flex: 1,
    height: "8px",
    background: "rgba(255,255,255,0.1)",
    borderRadius: "4px",
  },
  scoreValue: {
    fontSize: "13px",
    width: "24px",
    textAlign: "right",
    fontWeight: "600",
  },
  finalTitle: {
    fontSize: "32px",
    fontWeight: "700",
    textAlign: "center",
    background: "linear-gradient(90deg, #e94560, #ffd54f, #2ecc71)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: "12px",
  },
};

// ── Pomocnicze ────────────────────────────────────────────────────────

function clamp(v, min = 0, max = 10) {
  return Math.max(min, Math.min(max, v));
}

function applyPoints(scores, points) {
  const s = { ...scores };
  for (const [k, v] of Object.entries(points)) {
    s[k] = clamp((s[k] || 0) + v);
  }
  return s;
}

// ── Komponenty krain ──────────────────────────────────────────────────

function ChoiceScreen({ narration, choices, onChoice, landColor, landName, land }) {
  const [hovered, setHovered] = useState(null);

  // Buduj pełny tekst TTS: narracja + opcje wyboru
  const choicesText = choices.map((c) => c.label).join(". ");
  const fullTTS = `${narration}. Spójrz, masz do wyboru: ${choicesText}.`;

  return (
    <div>
      <span style={styles.landBadge(landColor)}>{landName}</span>
      <NarratorVoice text={fullTTS} land={land} />
      <div style={styles.narration}>{narration}</div>
      {choices.map((c) => (
        <button
          key={c.id}
          style={{
            ...styles.button,
            ...(hovered === c.id ? styles.buttonHover : {}),
          }}
          onMouseEnter={() => setHovered(c.id)}
          onMouseLeave={() => setHovered(null)}
          onClick={() => { ttsPlayer.unlock(); onChoice(c.id); }}
        >
          {c.icon && <span style={{ marginRight: 8 }}>{c.icon}</span>}
          {c.label}
        </button>
      ))}
    </div>
  );
}

function TimerScreen({ onWait, onClick, landColor, landName, land }) {
  const [time, setTime] = React.useState(30);
  const [done, setDone] = React.useState(false);
  const [clicked, setClicked] = React.useState(false);

  React.useEffect(() => {
    if (done || clicked) return;
    if (time <= 0) {
      setDone(true);
      onWait();
      return;
    }
    const t = setTimeout(() => setTime(time - 1), 1000);
    return () => clearTimeout(t);
  }, [time, done, clicked]);

  const handleClick = () => {
    if (!done && !clicked) {
      setClicked(true);
      onClick(30 - time);
    }
  };

  return (
    <div>
      <span style={styles.landBadge(landColor)}>{landName}</span>
      <NarratorVoice text="Oto Skarbiec Czasu. Jeśli otworzysz skrzynię teraz, dostaniesz jeden złoty kryształ. Ale jeśli nie dotkniesz ekranu przez trzydzieści sekund, skrzynia zamieni się w diamentową i da Ci aż pięć kryształów! Co wybierasz? Otwierasz teraz, czy czekasz cierpliwie?" land={land} />
      <div style={styles.narration}>
        Strażnik mówi: „Oto Skarbiec Czasu. Jeśli otworzysz skrzynię teraz, dostaniesz 1 złoty kryształ.
        Ale jeśli NIE dotkniesz ekranu przez 30 sekund... skrzynia zamieni się w diamentową
        i da Ci aż 5 kryształów!"
      </div>
      {!done && !clicked ? (
        <div>
          <div style={styles.timer}>{time}s</div>
          <button
            style={{
              ...styles.button,
              textAlign: "center",
              background: "rgba(233,69,96,0.2)",
              borderColor: "#e94560",
              fontSize: "18px",
            }}
            onClick={handleClick}
          >
            Otwórz skrzynię teraz!
          </button>
          <p style={{ textAlign: "center", fontSize: "13px", color: "#8899aa" }}>
            ...albo czekaj cierpliwie do końca
          </p>
        </div>
      ) : done ? (
        <div style={{ textAlign: "center", fontSize: "20px", color: "#ffd54f" }}>
          Brawo! Twoja cierpliwość zamieniła skrzynię w diamentową! +5 kryształów
        </div>
      ) : (
        <div style={{ textAlign: "center", fontSize: "20px", color: "#e94560" }}>
          Otworzyłeś skrzynię! Dostajesz 1 złoty kryształ.
        </div>
      )}
    </div>
  );
}

function EmotionMatchScreen({ onComplete, landColor, landName, land }) {
  const emotions = [
    { id: "frustration", face: "😤😩", correct: "frustracja" },
    { id: "embarrassment", face: "😳🙈", correct: "zakłopotanie" },
    { id: "pride", face: "😌🏆", correct: "duma" },
  ];
  const labels = ["frustracja", "zakłopotanie", "duma"];
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    let correct = 0;
    emotions.forEach((e) => {
      if (answers[e.id] === e.correct) correct++;
    });
    setSubmitted(true);
    setTimeout(() => onComplete(correct), 1500);
  };

  return (
    <div>
      <span style={styles.landBadge(landColor)}>{landName}</span>
      <NarratorVoice text="Strażnik pokazuje Ci trzy magiczne kryształy z twarzami. To nie proste emocje, to uczucia złożone! Dopasuj nazwę do każdej miny. Masz do wyboru trzy uczucia: frustracja, zakłopotanie i duma. Przypisz każde do odpowiedniej twarzy!" land={land} />
      <div style={styles.narration}>
        Strażnik pokazuje Ci trzy magiczne kryształy z twarzami. To nie proste emocje —
        to uczucia złożone! Dopasuj nazwę do każdej miny.
      </div>
      {emotions.map((e) => (
        <div key={e.id} style={{ marginBottom: "16px" }}>
          <div style={{ fontSize: "36px", textAlign: "center", marginBottom: "8px" }}>{e.face}</div>
          <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
            {labels.map((l) => (
              <button
                key={l}
                style={{
                  ...styles.button,
                  width: "auto",
                  display: "inline-block",
                  textAlign: "center",
                  padding: "8px 14px",
                  fontSize: "13px",
                  background: answers[e.id] === l ? "rgba(233,69,96,0.3)" : "rgba(255,255,255,0.05)",
                  borderColor: answers[e.id] === l ? "#e94560" : "rgba(255,255,255,0.15)",
                }}
                onClick={() => !submitted && setAnswers({ ...answers, [e.id]: l })}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      ))}
      {!submitted && Object.keys(answers).length === 3 && (
        <button
          style={{ ...styles.button, textAlign: "center", background: "rgba(46,204,113,0.2)", borderColor: "#2ecc71" }}
          onClick={handleSubmit}
        >
          Sprawdź odpowiedzi!
        </button>
      )}
      {submitted && (
        <div style={{ textAlign: "center", color: "#ffd54f", fontSize: "18px" }}>
          Świetna robota! Zobaczmy, jak Ci poszło...
        </div>
      )}
    </div>
  );
}

function CreativityScreen({ onSubmit, landColor, landName, land }) {
  const [text, setText] = useState("");
  const presets = [
    { label: "Zbuduję most ze sznurka", score: 1 },
    { label: "Użyję parasola jako spadochronu i przelecę!", score: 3 },
    { label: "Puszka będzie kołem, sznurek osią, a parasol żaglem!", score: 3 },
    { label: "Zrobię tyrolkę ze sznurka i zjadę na parasolu", score: 3 },
  ];

  return (
    <div>
      <span style={styles.landBadge(landColor)}>{landName}</span>
      <NarratorVoice text="Droga się urywa, przed Tobą przepaść! W starym pudełku znajdziesz trzy przedmioty: parasol, pustą puszkę i rolkę sznurka. Jak ich użyjesz, żeby się dostać na drugą stronę? Możesz wpisać swój własny pomysł, albo wybrać jeden z gotowych: Zbuduję most ze sznurka. Użyję parasola jako spadochronu i przelecę. Puszka będzie kołem, sznurek osią, a parasol żaglem. Zrobię tyrolkę ze sznurka i zjadę na parasolu." land={land} />
      <div style={styles.narration}>
        Droga się urywa — przed Tobą przepaść! W starym pudełku znajdziesz trzy przedmioty:
        parasol, pustą puszkę i rolkę sznurka. Jak ich użyjesz, żeby się dostać na drugą stronę?
      </div>
      <input
        style={styles.input}
        placeholder="Wpisz swój pomysł..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      {text.length > 5 && (
        <button
          style={{ ...styles.button, textAlign: "center", background: "rgba(46,204,113,0.2)", borderColor: "#2ecc71" }}
          onClick={() => onSubmit(text, text.length > 30 ? 3 : 1)}
        >
          Wyślij pomysł!
        </button>
      )}
      <p style={{ fontSize: "13px", color: "#8899aa", marginTop: "16px" }}>Lub wybierz gotowy pomysł:</p>
      {presets.map((p, i) => (
        <button key={i} style={styles.button} onClick={() => onSubmit(p.label, p.score)}>
          {p.label}
        </button>
      ))}
    </div>
  );
}

function ScoreDisplay({ scores }) {
  return (
    <div>
      {Object.entries(PROFILE_LABELS).map(([key, { name, icon, color }]) => (
        <div key={key} style={styles.scoreRow}>
          <span style={styles.scoreLabel}>{icon} {name}</span>
          <div style={styles.scoreTrack}>
            <div style={styles.scoreBar(scores[key], color)} />
          </div>
          <span style={styles.scoreValue}>{scores[key]}</span>
        </div>
      ))}
    </div>
  );
}

function getDailyMission(profile) {
  const today = new Date();
  const dayIndex = Math.floor(today.getTime() / 86400000) % DAILY_MISSIONS[profile].length;
  return DAILY_MISSIONS[profile][dayIndex];
}

function FinalScreen({ scores, playerName, avatarConfig, equipment }) {
  const [showTips, setShowTips] = useState(null);
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const topTwo = [sorted[0][0], sorted[1][0]].sort().join("_");
  const title = HYBRID_TITLES[topTwo] || "Bohater Nieznanych Krain";
  const lowest = sorted[sorted.length - 1];
  const lowestLabel = PROFILE_LABELS[lowest[0]];
  const topProfiles = [sorted[0][0], sorted[1][0]];
  const weakProfile = lowest[0];

  const dailyMissions = [
    ...topProfiles.map((p) => ({ ...getDailyMission(p), profile: p, type: "strong" })),
    { ...getDailyMission(weakProfile), profile: weakProfile, type: "grow" },
  ];

  const finalNarration = `Brawo, ${playerName}! Przeszedłeś wszystkie krainy i Twoje prawdziwe supermoce się ujawniły! Jesteś ${title}! To znaczy, że łączysz w sobie niezwykłe talenty ${PROFILE_LABELS[sorted[0][0]].name} i ${PROFILE_LABELS[sorted[1][0]].name}!`;

  return (
    <div>
      <div style={{ textAlign: "center", fontSize: "48px", marginBottom: "8px" }}>🏔️</div>
      <div style={styles.finalTitle}>{title}</div>
      <NarratorVoice text={finalNarration} land="gora_podsumowania" />

      {avatarConfig && (
        <div style={{ marginBottom: "20px" }}>
          <AvatarAI
            playerName={playerName}
            avatarConfig={avatarConfig}
            hybridTitle={title}
            equipment={equipment}
            mode="hero-card"
            fallback={
              <AvatarDisplay
                avatarConfig={avatarConfig}
                equipment={equipment}
                playerName={playerName}
                compact={false}
              />
            }
          />
        </div>
      )}

      <div style={styles.narration}>
        Brawo, {playerName}! Twoje prawdziwe supermoce się ujawniły!
        Jesteś <strong style={{ color: "#ffd54f" }}>{title}</strong> — łączysz
        talenty {PROFILE_LABELS[sorted[0][0]].name} i{" "}
        {PROFILE_LABELS[sorted[1][0]].name}!
      </div>
      <div style={{ ...styles.card, background: "rgba(255,255,255,0.05)" }}>
        <h3 style={{ margin: "0 0 12px", fontSize: "16px" }}>Twoje supermoce:</h3>
        <ScoreDisplay scores={scores} />
      </div>

      {/* Wskazówki rozwojowe */}
      <div style={{ ...styles.card, background: "rgba(233,69,96,0.06)", border: "1px solid rgba(233,69,96,0.15)" }}>
        <h3 style={{ margin: "0 0 16px", fontSize: "17px" }}>
          🌱 Jak rozwijać swoje supermoce?
        </h3>
        {sorted.map(([profileKey]) => {
          const profile = PROFILE_LABELS[profileKey];
          const growth = GROWTH_TIPS[profileKey];
          const isOpen = showTips === profileKey;
          const isTop = topProfiles.includes(profileKey);
          const isWeak = profileKey === weakProfile;
          return (
            <div key={profileKey} style={{ marginBottom: "10px" }}>
              <button
                onClick={() => setShowTips(isOpen ? null : profileKey)}
                style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  width: "100%", padding: "10px 14px",
                  borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)",
                  background: isOpen ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.03)",
                  color: "#f0f0f0", fontSize: "14px", cursor: "pointer",
                  textAlign: "left", transition: "all 0.2s",
                }}
              >
                <span style={{ fontSize: "18px" }}>{profile.icon}</span>
                <span style={{ flex: 1, fontWeight: "600" }}>
                  {profile.name}
                  {isTop && <span style={{ marginLeft: "6px", fontSize: "11px", color: "#ffd54f" }}>★ TWOJA MOC</span>}
                  {isWeak && <span style={{ marginLeft: "6px", fontSize: "11px", color: "#e94560" }}>→ DO ROZWOJU</span>}
                </span>
                <span style={{ fontSize: "12px", color: "#889", transition: "transform 0.2s", transform: isOpen ? "rotate(180deg)" : "none" }}>▼</span>
              </button>
              {isOpen && (
                <div style={{
                  padding: "12px 14px", marginTop: "4px",
                  borderRadius: "0 0 10px 10px",
                  background: "rgba(255,255,255,0.03)",
                  borderLeft: `3px solid ${profile.color}`,
                }}>
                  <p style={{ margin: "0 0 10px", fontSize: "13px", color: "#bbb", fontStyle: "italic" }}>
                    {growth.desc}
                  </p>
                  <ul style={{ margin: 0, paddingLeft: "20px" }}>
                    {growth.tips.map((tip, i) => (
                      <li key={i} style={{ fontSize: "13px", color: "#ddd", marginBottom: "6px", lineHeight: "1.5" }}>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Misje dzienne */}
      <div style={{ ...styles.card, background: "rgba(255,213,84,0.06)", border: "1px solid rgba(255,213,84,0.15)" }}>
        <h3 style={{ margin: "0 0 6px", fontSize: "17px" }}>
          ⚡ Twoje misje na dziś
        </h3>
        <p style={{ margin: "0 0 14px", fontSize: "12px", color: "#889" }}>
          Nowe misje codziennie — dopasowane do Twojego profilu!
        </p>
        {dailyMissions.map((mission, i) => {
          const profile = PROFILE_LABELS[mission.profile];
          return (
            <div key={i} style={{
              display: "flex", alignItems: "flex-start", gap: "10px",
              padding: "12px", marginBottom: "8px",
              borderRadius: "10px",
              background: mission.type === "grow"
                ? "rgba(233,69,96,0.08)"
                : "rgba(255,255,255,0.04)",
              border: mission.type === "grow"
                ? "1px solid rgba(233,69,96,0.2)"
                : "1px solid rgba(255,255,255,0.06)",
            }}>
              <span style={{ fontSize: "24px", flexShrink: 0 }}>{mission.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "14px", color: "#eee", lineHeight: "1.5", marginBottom: "4px" }}>
                  {mission.text}
                </div>
                <div style={{ fontSize: "11px", color: mission.type === "grow" ? "#e94560" : "#889" }}>
                  {profile.icon} {profile.name}
                  {mission.type === "grow" && " — wyzwanie rozwojowe!"}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Wyzwanie na przyszłość */}
      <div style={{ ...styles.card, background: "rgba(255,215,84,0.08)", border: "1px solid rgba(255,215,84,0.2)" }}>
        <p style={{ margin: 0, fontSize: "14px" }}>
          {lowestLabel.icon} <strong>Wyzwanie na przyszłość:</strong> Rozwijaj swoją stronę{" "}
          {lowestLabel.name} — to Twoja ukryta supermoc, która czeka na odkrycie!
        </p>
      </div>
      {/* Lista zdobytego ekwipunku */}
      {equipment.length > 0 && (
        <div style={{ ...styles.card, background: "rgba(255,255,255,0.04)" }}>
          <h3 style={{ margin: "0 0 12px", fontSize: "16px" }}>Zdobyty ekwipunek:</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {equipment.map((id) => {
              const item = EQUIPMENT_DEFS[id];
              if (!item) return null;
              return (
                <div key={id} style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  padding: "8px 12px", borderRadius: "10px",
                  background: "rgba(255,255,255,0.04)",
                }}>
                  <span style={{ fontSize: "22px" }}>{item.emoji}</span>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: "600" }}>{item.name}</div>
                    <div style={{ fontSize: "11px", color: "#889" }}>
                      {PROFILE_LABELS[item.profile]?.icon} {PROFILE_LABELS[item.profile]?.name}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Główna aplikacja ──────────────────────────────────────────────────

const GAME_STEPS = [
  { land: "dolina_selfie", task: 0, type: "avatar_builder" },  // NOWE: kreator awatara
  { land: "dolina_selfie", task: 1, type: "choice" },
  { land: "las_decyzji", task: 2, type: "choice" },
  { land: "las_decyzji", task: 3, type: "choice" },
  { land: "jaskinia_emocji", task: 4, type: "timer" },
  { land: "jaskinia_emocji", task: 5, type: "emotion_match" },
  { land: "wyspa_talentow", task: 6, type: "choice" },
  { land: "wyspa_talentow", task: 7, type: "creativity" },
  { land: "przystan_wspolpracy", task: 8, type: "choice" },
  { land: "przystan_wspolpracy", task: 9, type: "choice" },
  { land: "gora_podsumowania", task: 0, type: "final" },
];

const TASK_DATA = {
  1: {
    narration:
      'Wspaniale! Twój awatar jest gotowy. Teraz Zwierciadło Prawdy mówi: „Wybierz swój element startowy — to pierwszy krok Twojej przygody!"',
    choices: [
      { id: "A", icon: "🔍", label: "Lupa Odkrywcy — chcę patrzeć z bliska na wszystko" },
      { id: "B", icon: "🛡️", label: "Tarcza Odwagi — chcę chronić siebie i innych" },
      { id: "C", icon: "📚", label: "Księga Mądrości — chcę wiedzieć jak najwięcej" },
      { id: "D", icon: "🎒", label: "Plecak Podróżnika — zbieram różne rzeczy" },
    ],
  },
  2: {
    narration:
      'Szlak prowadzi przez gęsty las. Ścieżka się rozdziela \u2014 prosta droga wiedzie do Zamku. Po prawej widzisz zarośniętą ścieżkę z tabliczką: \u201eTędy do niczego nie dojdziesz\u201D. Co robisz?',
    choices: [
      { id: "A", icon: "🏰", label: "Idę prosto do celu — Zamek czeka!" },
      { id: "B", icon: "🌿", label: "Sprawdzam zarośniętą ścieżkę — tabliczka mnie nie powstrzyma!" },
    ],
  },
  3: {
    narration:
      "Na ścieżce słyszysz cichy pisk. Między gałęziami widzisz małego Chowańca — futrzaste stworzenie z wielkimi oczami, uwięzione w sieci! Obok tyka zegar — im dłużej pomagasz, tym mniej bonusów za czas. Co robisz?",
    choices: [
      { id: "A", icon: "✂️", label: "Rozcinam sieć i pomagam Chowańcowi" },
      { id: "B", icon: "👥", label: "Szukam kogoś innego, kto może pomóc" },
      { id: "C", icon: "⏩", label: "Idę dalej — punkty za czas są ważniejsze" },
    ],
  },
  6: {
    narration:
      "Na wyspie czeka starożytna maszyna z zagadką. Próbujesz ją rozwiązać... ale nie da się! Za pierwszym razem to po prostu niemożliwe. Co robisz po porażce?",
    choices: [
      { id: "A", icon: "🔄", label: "Spróbuję ponownie!" },
      { id: "B", icon: "🤝", label: "Poproszę bota o wskazówkę" },
      { id: "C", icon: "⏭️", label: "Pomiń zadanie" },
    ],
  },
  8: {
    narration:
      'W przystani dwa stworzenia kłócą się przy mapie. Krabor krzyczy: \u201eNa PÓŁNOC!\u201D Żółwinka płacze: \u201eNa POŁUDNIE, tam bezpieczniej...\u201D Obydwoje patrzą na Ciebie. Co robisz?',
    choices: [
      { id: "A", icon: "📢", label: "CISZA! Ja tu decyduję!" },
      { id: "B", icon: "🗳️", label: "Głosujmy! Każdy powie, czego chce." },
      { id: "C", icon: "🤔", label: "Powiedzcie dlaczego — znajdziemy kompromis." },
    ],
  },
  9: {
    narration:
      "Wszyscy zgodzili się na plan! Trzeba zbudować tratwę. Każdy musi wybrać swoją rolę. Kim chcesz być?",
    choices: [
      { id: "A", icon: "🧭", label: "Kapitan — planuję i rozdzielam zadania" },
      { id: "B", icon: "🔨", label: "Rzemieślnik — biorę się za najtrudniejszą robotę" },
      { id: "C", icon: "🎉", label: "Dusza Towarzystwa — dbam, żeby nikomu nie było smutno" },
    ],
  },
};

export default function App() {
  const [phase, setPhase] = useState("start"); // start | playing | done
  const [startPhase, setStartPhase] = useState("logo"); // logo | welcome | name
  const [playerName, setPlayerName] = useState("");
  const [stepIndex, setStepIndex] = useState(0);
  const [scores, setScores] = useState({ EM: 0, ST: 0, KR: 0, LD: 0, DT: 0, MD: 0 });

  // ── Nowy stan awatara ──
  const [avatarConfig, setAvatarConfig] = useState(null);
  const [equipment, setEquipment] = useState([]);
  const [newItem, setNewItem] = useState(null);

  // Stan splash-screen / przejscie miedzy krainami
  const [showTransition, setShowTransition] = useState(false);
  const [transitionLand, setTransitionLand] = useState(null);
  const prevLandRef = useRef(null);
  const [contentVisible, setContentVisible] = useState(true);

  // AI avatar image
  const [aiAvatarUrl, setAiAvatarUrl] = useState(null);

  const currentStep = GAME_STEPS[stepIndex];

  // Wykryj zmiane krainy i pokaz splash screen
  useEffect(() => {
    if (phase !== "playing") return;
    const newLand = currentStep?.land;
    if (newLand && newLand !== prevLandRef.current && prevLandRef.current !== null) {
      setContentVisible(false);
      setTransitionLand(newLand);
      setShowTransition(true);
    }
    if (newLand) {
      prevLandRef.current = newLand;
    }
  }, [stepIndex, phase]);

  const advance = useCallback(() => {
    ttsPlayer.stop();
    if (stepIndex + 1 >= GAME_STEPS.length) {
      setPhase("done");
    } else {
      setStepIndex(stepIndex + 1);
    }
  }, [stepIndex]);

  // Dodawanie ekwipunku na podstawie wyboru
  const addEquipment = useCallback((taskId, choiceId) => {
    const key = `${taskId}_${choiceId}`;
    const itemId = TASK_EQUIPMENT_MAP[key];
    if (itemId && !equipment.includes(itemId)) {
      setEquipment((prev) => [...prev, itemId]);
      setNewItem(itemId);
    }
  }, [equipment]);

  const handleChoice = useCallback(
    (taskId, choiceId) => {
      const key = `${taskId}_${choiceId}`;
      const pts = SCORING[key] || {};
      setScores((prev) => applyPoints(prev, pts));
      addEquipment(taskId, choiceId);
      advance();
    },
    [advance, addEquipment]
  );

  const dismissNewItem = useCallback(() => {
    setNewItem(null);
  }, []);

  // ── Ekran startowy ────────────────────────────────────────────────

  if (phase === "start") {
    return (
      <div style={{
        ...styles.app,
        backgroundImage: "url(/tlo.png)",
        backgroundSize: "cover",
        backgroundPosition: "center bottom",
        backgroundRepeat: "no-repeat",
        position: "relative",
      }}>
        {/* Ciemna nakładka dla czytelności tekstu */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.25) 40%, rgba(0,0,0,0.5) 100%)",
          zIndex: 0,
        }} />
        <div style={{ ...styles.container, position: "relative", zIndex: 1 }}>

          {/* ═══ FAZA 1: Logo animowane + przycisk "Dotknij" ═══ */}
          {startPhase === "logo" && (
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "80vh",
              gap: "0",
            }}>
              {/* Logo — wlatuje z animacją */}
              <img
                src="/Logo.png"
                alt="EwolucJA"
                style={{
                  width: "280px",
                  maxWidth: "80vw",
                  height: "auto",
                  animation: "scaleRotateIn 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
                  filter: "drop-shadow(0 4px 20px rgba(233, 69, 96, 0.3))",
                }}
              />

              {/* Podtytuł — fade in z opóźnieniem */}
              <p style={{
                fontSize: "15px",
                opacity: 0,
                animation: "slideUpFade 0.8s ease-out 0.8s both",
                color: "rgba(255,255,255,0.5)",
                marginTop: "16px",
              }}>Odkryj swoje supermoce!</p>

              {/* Przycisk — pojawia się po animacjach logo */}
              <button
                onClick={() => {
                  ttsPlayer.unlock();
                  setStartPhase("welcome");
                }}
                style={{
                  marginTop: "50px",
                  padding: "16px 40px",
                  borderRadius: "30px",
                  border: "2px solid rgba(233, 69, 96, 0.5)",
                  background: "linear-gradient(135deg, rgba(233,69,96,0.2), rgba(255,213,84,0.15))",
                  color: "#fff",
                  fontSize: "17px",
                  fontWeight: "600",
                  cursor: "pointer",
                  opacity: 0,
                  animation: "slideUpFade 0.6s ease-out 1.6s both, invitePulse 2s ease-in-out 2.2s infinite",
                  letterSpacing: "0.5px",
                }}
              >
                Dotknij, aby rozpocząć
              </button>
            </div>
          )}

          {/* ═══ FAZA 2: Powitanie glosowe + tekst animowany ═══ */}
          {startPhase === "welcome" && (
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "80vh",
              gap: "0",
              padding: "0 20px",
            }}>
              {/* Logo — mniejsze, z glow */}
              <img
                src="/Logo.png"
                alt="EwolucJA"
                style={{
                  width: "200px",
                  maxWidth: "60vw",
                  height: "auto",
                  animation: "float 3s ease-in-out infinite",
                  filter: "drop-shadow(0 4px 20px rgba(233, 69, 96, 0.3))",
                  marginBottom: "40px",
                }}
              />

              {/* Tekst powitania — pojawia się z animacją */}
              <div style={{
                maxWidth: "360px",
                textAlign: "center",
                opacity: 0,
                animation: "slideUpFade 1s ease-out 0.3s both",
              }}>
                <p style={{
                  fontSize: "17px",
                  lineHeight: "1.7",
                  color: "rgba(255,255,255,0.85)",
                  margin: "0 0 8px",
                  fontWeight: "500",
                }}>
                  Witaj w magicznym świecie Ewolucji!
                </p>
                <p style={{
                  fontSize: "15px",
                  lineHeight: "1.6",
                  color: "rgba(255,255,255,0.6)",
                  margin: "0",
                  opacity: 0,
                  animation: "slideUpFade 0.8s ease-out 1s both",
                }}>
                  Czekają na Ciebie krainy pełne wyzwań, które pomogą Ci odkryć, jakim bohaterem jesteś.
                </p>
              </div>

              {/* Narrator — czyta powitanie, po zakonczeniu przechodzi do fazy "name" */}
              <div style={{
                marginTop: "24px",
                opacity: 0,
                animation: "fadeIn 0.5s ease-out 0.5s both",
              }}>
                <NarratorVoice
                  text="Witaj w magicznym świecie Ewolucji! Czekają na Ciebie krainy pełne wyzwań, które pomogą Ci odkryć, jakim bohaterem jesteś."
                  land="dolina_selfie"
                  autoPlayDelay={600}
                  compact={true}
                  onEnd={() => setStartPhase("name")}
                />
              </div>
            </div>
          )}

          {/* ═══ FAZA 3: Pole imienia + narracja zachecajaca ═══ */}
          {startPhase === "name" && (
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              minHeight: "80vh",
              paddingTop: "60px",
            }}>
              {/* Logo kompaktowe */}
              <img
                src="/Logo.png"
                alt="EwolucJA"
                style={{
                  width: "160px",
                  maxWidth: "50vw",
                  height: "auto",
                  animation: "float 3s ease-in-out infinite",
                  filter: "drop-shadow(0 4px 15px rgba(233, 69, 96, 0.25))",
                  marginBottom: "24px",
                }}
              />

              {/* Karta z polem imienia */}
              <div style={{
                ...styles.card,
                opacity: 0,
                animation: "slideUpFade 0.8s ease-out 0.1s both",
                maxWidth: "400px",
                width: "100%",
              }}>
                <NarratorVoice
                  text="Powiedz mi, jak masz na imię? Wpisz swoje imię, a Twoja przygoda się rozpocznie!"
                  land="dolina_selfie"
                  autoPlayDelay={400}
                  compact={false}
                />
                <p style={{
                  margin: "12px 0 20px",
                  fontSize: "16px",
                  lineHeight: "1.6",
                  textAlign: "center",
                  color: "rgba(255,255,255,0.75)",
                  opacity: 0,
                  animation: "slideUpFade 0.6s ease-out 0.5s both",
                }}>
                  Powiedz mi, jak masz na imię?<br/>
                  Wpisz je poniżej, a Twoja przygoda się rozpocznie!
                </p>
                <div style={{
                  opacity: 0,
                  animation: "slideUpFade 0.6s ease-out 0.8s both",
                }}>
                  <input
                    autoFocus
                    style={styles.input}
                    placeholder="Twoje imię..."
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                  />
                </div>
                {playerName.trim().length > 0 && (
                  <button
                    style={{
                      ...styles.button,
                      textAlign: "center",
                      background: "linear-gradient(135deg, rgba(233,69,96,0.3), rgba(255,213,84,0.3))",
                      borderColor: "#e94560",
                      fontSize: "18px",
                      fontWeight: "600",
                      animation: "slideUpFade 0.4s ease-out both, invitePulse 2.5s ease-in-out 0.5s infinite",
                      width: "100%",
                    }}
                    onClick={() => {
                      ttsPlayer.stop();
                      ttsPlayer._pendingText = null;
                      ttsPlayer.unlock();
                      prevLandRef.current = null;
                      setTransitionLand("dolina_selfie");
                      setShowTransition(true);
                      setContentVisible(false);
                      setStartPhase("transition");
                    }}
                  >
                    Wyruszam w przygodę!
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ═══ FAZA 4: Splash Dolina Selfie (izolowany) ═══ */}
          {startPhase === "transition" && showTransition && transitionLand && (
            <LandTransition
              land={transitionLand}
              playerName={playerName}
              onComplete={() => {
                setShowTransition(false);
                setTransitionLand(null);
                setContentVisible(true);
                setPhase("playing");
              }}
            />
          )}

        </div>
      </div>
    );
  }

  // ── Ekran gry ─────────────────────────────────────────────────────

  const land = currentStep?.land || "gora_podsumowania";
  const landColor = LAND_COLORS[land];
  const landName = LAND_NAMES[land];
  const landIcon = LAND_ICONS[land] || "";
  const landBg = LAND_BG_GRADIENTS[land] || styles.app.background;
  const cardGlow = LAND_CARD_GLOW[land] || "rgba(255,255,255,0.08)";
  const cardBorder = LAND_CARD_BORDER[land] || "rgba(255,255,255,0.1)";

  return (
    <div style={{ ...styles.app, background: landBg, transition: "background 1s ease" }}>
      {/* Splash screen przejscia miedzy krainami */}
      {showTransition && transitionLand && (
        <LandTransition
          land={transitionLand}
          playerName={playerName}
          onComplete={() => {
            setShowTransition(false);
            setTransitionLand(null);
            setContentVisible(true);
          }}
        />
      )}
      <div style={{
        ...styles.container,
        opacity: contentVisible ? 1 : 0,
        transform: contentVisible ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
      }}>
        <div style={styles.header}>
          <img
            src="/Logo.png"
            alt="EwolucJA"
            style={{
              width: "120px",
              height: "auto",
              filter: "drop-shadow(0 2px 8px rgba(233, 69, 96, 0.2))",
            }}
          />
          <p style={styles.subtitle}>{landIcon} {playerName} — {landName}</p>
        </div>

        {/* Kompaktowy awatar (widoczny po stworzeniu) — SVG lub AI */}
        {avatarConfig && currentStep?.type !== "avatar_builder" && currentStep?.type !== "final" && !newItem && (
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }}>
            {aiAvatarUrl ? (
              <img
                src={aiAvatarUrl}
                alt={playerName}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "3px solid " + (landColor || "#ffd54f"),
                  boxShadow: "0 2px 12px " + (cardGlow || "rgba(255,255,255,0.1)"),
                }}
              />
            ) : (
              <AvatarDisplay
                avatarConfig={avatarConfig}
                equipment={equipment}
                playerName={playerName}
                compact={true}
              />
            )}
          </div>
        )}

        {/* Powiadomienie o nowym przedmiocie */}
        {newItem && avatarConfig && (
          <div style={{ ...styles.card, padding: "16px" }}>
            <AvatarDisplay
              avatarConfig={avatarConfig}
              equipment={equipment}
              playerName={playerName}
              newItem={newItem}
              onNewItemDismiss={dismissNewItem}
            />
          </div>
        )}

        {/* Pasek postępu */}
        {!newItem && (
          <div style={styles.progressBar}>
            {GAME_STEPS.map((_, i) => (
              <div key={i} style={styles.progressDot(i === stepIndex, i < stepIndex)} />
            ))}
          </div>
        )}

        {!newItem && (
          <div style={{
            ...styles.card,
            background: cardGlow,
            border: `1px solid ${cardBorder}`,
            boxShadow: `0 4px 30px ${cardGlow}`,
          }}>
            {/* NOWY: Kreator awatara */}
            {currentStep?.type === "avatar_builder" ? (
              <AvatarBuilder
                playerName={playerName}
                onComplete={(config) => {
                  setAvatarConfig(config);
                  // Uruchom generowanie AI awatara w tle
                  agentAPI.generateAvatar(playerName, config).then((result) => {
                    if (result?.url) {
                      setAiAvatarUrl(result.url);
                      console.log("[AI Avatar] Generated:", result.url);
                    }
                  }).catch(() => {});
                  advance();
                }}
              />
            ) : phase === "done" || currentStep?.type === "final" ? (
              <FinalScreen
                scores={scores}
                playerName={playerName}
                avatarConfig={avatarConfig}
                equipment={equipment}
              />
            ) : currentStep?.type === "choice" ? (
              <ChoiceScreen
                narration={TASK_DATA[currentStep.task]?.narration}
                choices={TASK_DATA[currentStep.task]?.choices || []}
                onChoice={(id) => handleChoice(currentStep.task, id)}
                landColor={landColor}
                landName={landName}
                land={land}
              />
            ) : currentStep?.type === "timer" ? (
              <TimerScreen
                onWait={() => {
                  setScores((s) => applyPoints(s, { ST: 3 }));
                  addEquipment(4, "WAIT");
                  setTimeout(advance, 2000);
                }}
                onClick={(elapsed) => {
                  setScores((s) => applyPoints(s, { LD: 1 }));
                  addEquipment(4, "CLICK");
                  setTimeout(advance, 2000);
                }}
                landColor={landColor}
                landName={landName}
                land={land}
              />
            ) : currentStep?.type === "emotion_match" ? (
              <EmotionMatchScreen
                onComplete={(correct) => {
                  setScores((s) => applyPoints(s, { EM: correct, DT: correct }));
                  // Nagroda za emocje: inventor_goggles jeśli 2+ trafienia
                  if (correct >= 2) {
                    setEquipment((prev) =>
                      prev.includes("inventor_goggles") ? prev : [...prev, "inventor_goggles"]
                    );
                    setNewItem("inventor_goggles");
                  }
                  advance();
                }}
                landColor={landColor}
                landName={landName}
                land={land}
              />
            ) : currentStep?.type === "creativity" ? (
              <CreativityScreen
                onSubmit={(text, score) => {
                  setScores((s) => applyPoints(s, { KR: score }));
                  // Nagroda za kreatywność: star_boots jeśli wysoki wynik
                  if (score >= 3 && !equipment.includes("star_boots")) {
                    setEquipment((prev) => [...prev, "star_boots"]);
                    setNewItem("star_boots");
                  }
                  advance();
                }}
                landColor={landColor}
                landName={landName}
                land={land}
              />
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
