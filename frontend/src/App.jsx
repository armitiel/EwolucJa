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
import detectGender from "./utils/detectGender";
import bgMusic from "./services/bgMusic";

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
    fontFamily: "'Lato', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
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
    maxWidth: "820px",
    width: "100%",
    padding: "20px 20px 90px",
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
    fontSize: "20px",
    fontWeight: "600",
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
    padding: "16px 20px",
    borderRadius: "12px",
    border: "2px solid rgba(255,255,255,0.15)",
    background: "rgba(255,255,255,0.05)",
    color: "#f0f0f0",
    fontSize: "24px",
    fontWeight: "600",
    boxSizing: "border-box",
    marginBottom: "12px",
    textAlign: "center",
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
  bottomNarrator: {
    position: "fixed",
    bottom: "24px",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 900,
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
          {c.icon && (
            c.icon.startsWith("/") ? (
              <img src={c.icon} alt="" style={{ width: 32, height: 32, marginRight: 10, verticalAlign: "middle", objectFit: "contain", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }} />
            ) : (
              <span style={{ marginRight: 8 }}>{c.icon}</span>
            )
          )}
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
      { id: "A", icon: "/lupa.png", label: "Lupa Odkrywcy — chcę patrzeć z bliska na wszystko" },
      { id: "B", icon: "/tarcza.png", label: "Tarcza Odwagi — chcę chronić siebie i innych" },
      { id: "C", icon: "/ksiazki.png", label: "Księga Mądrości — chcę wiedzieć jak najwięcej" },
      { id: "D", icon: "/plecak.png", label: "Plecak Podróżnika — zbieram różne rzeczy" },
    ],
  },
  2: {
    narration:
      'Szlak prowadzi przez gęsty las. Ścieżka się rozdziela \u2014 prosta droga wiedzie do Zamku. Po prawej widzisz zarośniętą ścieżkę z tabliczką: "Tędy do niczego nie dojdziesz". Co robisz?',
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
      'W przystani dwa stworzenia kłócą się przy mapie. Krabor krzyczy: "Na PÓŁNOC!" Żółwinka płacze: "Na POŁUDNIE, tam bezpieczniej..." Obydwoje patrzą na Ciebie. Co robisz?',
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
  const [playerGender, setPlayerGender] = useState("boy"); // boy | girl | unknown
  const [stepIndex, setStepIndex] = useState(0);
  const [scores, setScores] = useState({ EM: 0, ST: 0, KR: 0, LD: 0, DT: 0, MD: 0 });

  // ── Nowy stan awatara ──
  const [avatarConfig, setAvatarConfig] = useState(null);
  const [equipment, setEquipment] = useState([]);
  const [newItem, setNewItem] = useState(null);

  // ── Avatar AI update po zdobyciu ekwipunku ──
  const [avatarUpdatePhase, setAvatarUpdatePhase] = useState(null); // null | "generating" | "ready"

  // Stan splash-screen / przejscie miedzy krainami
  const [showTransition, setShowTransition] = useState(false);
  const [transitionLand, setTransitionLand] = useState(null);
  const prevLandRef = useRef(null);
  const equipmentRef = useRef(equipment);
  useEffect(() => { equipmentRef.current = equipment; }, [equipment]);
  const [contentVisible, setContentVisible] = useState(true);

  // AI avatar image
  const [aiAvatarUrl, setAiAvatarUrl] = useState(null);
  const aiAvatarUrlRef = useRef(null);
  useEffect(() => { aiAvatarUrlRef.current = aiAvatarUrl; }, [aiAvatarUrl]);

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

  // Gracz sam klika "Kontynuuj przygodę!" — brak auto-advance

  // Dodawanie ekwipunku na podstawie wyboru - zwraca czy coś się dodało
  const addEquipment = useCallback((taskId, choiceId) => {
    const key = `${taskId}_${choiceId}`;
    const itemId = TASK_EQUIPMENT_MAP[key];
    if (itemId && !equipment.includes(itemId)) {
      setEquipment((prev) => [...prev, itemId]);
      setNewItem(itemId);
      return true; // Nowy item został dodany
    }
    return false; // Nic się nie dodało
  }, [equipment]);

  const handleChoice = useCallback(
    (taskId, choiceId) => {
      const key = `${taskId}_${choiceId}`;
      const pts = SCORING[key] || {};
      setScores((prev) => applyPoints(prev, pts));
      const itemAdded = addEquipment(taskId, choiceId);
      // Jeśli dodano nowy item, nie przesuwaj się do przodu - czekaj na zakończenie opowiadania z awatarem
      if (!itemAdded) {
        advance();
      }
    },
    [advance, addEquipment]
  );

  const dismissNewItem = useCallback(() => {
    setNewItem(null);
    setAvatarUpdatePhase("generating");
    // Czytaj z refów — gwarantuje najnowszy stan (nie stale closure)
    const currentEquipment = equipmentRef.current;
    const currentAvatarUrl = aiAvatarUrlRef.current;
    console.log("[dismissNewItem] Equipment (from ref):", currentEquipment);
    console.log("[dismissNewItem] Previous avatar URL:", currentAvatarUrl ? currentAvatarUrl.slice(0, 80) : "null");
    console.log("[dismissNewItem] AvatarConfig being sent to API:", avatarConfig);
    agentAPI.generateAvatar(playerName, avatarConfig, playerGender, currentEquipment, currentAvatarUrl)
      .then((result) => {
        console.log("[dismissNewItem] Avatar generated:", result?.url ? result.url.slice(0, 80) : "NO URL");
        if (result?.url) setAiAvatarUrl(result.url);
        setAvatarUpdatePhase("ready");
      })
      .catch((err) => {
        console.error("[dismissNewItem] Avatar generation failed:", err);
        setAvatarUpdatePhase(null);
        advance();
      });
  }, [playerName, avatarConfig, playerGender, advance]);

  // ── Tekst TTS dla bieżącego ekranu gry (hook musi być PRZED warunkowymi return) ──
  const gameTtsText = React.useMemo(() => {
    if (!currentStep) return "";
    const type = currentStep.type;
    if (type === "choice") {
      const td = TASK_DATA[currentStep.task];
      if (!td) return "";
      const choicesText = (td.choices || []).map(c => c.label).join(". ");
      return `${td.narration}. Spójrz, masz do wyboru: ${choicesText}.`;
    }
    if (type === "timer") return "Oto Skarbiec Czasu. Jeśli otworzysz skrzynię teraz, dostaniesz jeden złoty kryształ. Ale jeśli nie dotkniesz ekranu przez trzydzieści sekund, skrzynia zamieni się w diamentową i da Ci aż pięć kryształów!";
    if (type === "emotion_match") return "Strażnik pokazuje Ci trzy magiczne kryształy z twarzami. Dopasuj nazwę do każdej miny!";
    if (type === "creativity") return "Droga się urywa, przed Tobą przepaść! Jak użyjesz parasola, puszki i sznurka?";
    if (type === "final") {
      const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
      if (sorted.length >= 2) {
        return `Brawo, ${playerName}! Jesteś połączeniem talentów ${PROFILE_LABELS[sorted[0][0]]?.name || ""} i ${PROFILE_LABELS[sorted[1][0]]?.name || ""}!`;
      }
    }
    return "";
  }, [currentStep, stepIndex, scores, playerName]);

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
        padding: 0,
        margin: 0,
        overflow: "hidden",
      }}>
        {/* Ciemna nakładka dla czytelności tekstu */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.25) 40%, rgba(0,0,0,0.5) 100%)",
          zIndex: 0,
        }} />
        <div style={{ ...styles.container, position: "relative", zIndex: 1, padding: 0, maxWidth: "100%" }}>

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
                  width: "840px",
                  maxWidth: "90vw",
                  height: "auto",
                  animation: "scaleRotateIn 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
                  filter: "drop-shadow(0 4px 20px rgba(233, 69, 96, 0.3))",
                }}
              />

              {/* Przycisk z cząsteczkami */}
              <div style={{ position: "relative", display: "inline-block", marginTop: "50px" }}>
                <button
                  className="cta-splash"
                  onMouseEnter={(e) => {
                    const container = e.currentTarget.parentElement;
                    if (container._hoverInterval) return;
                    container._hoverInterval = setInterval(() => {
                      const btn = container.querySelector("button");
                      const rect = btn.getBoundingClientRect();
                      const contRect = container.getBoundingClientRect();
                      for (let i = 0; i < 2; i++) {
                        const p = document.createElement("span");
                        p.className = "cta-particle";
                        const x = Math.random() * rect.width;
                        const y = Math.random() * rect.height;
                        p.style.left = (rect.left - contRect.left + x) + "px";
                        p.style.top = (rect.top - contRect.top + y) + "px";
                        p.style.setProperty("--dx", (Math.random() - 0.5) * 60 + "px");
                        p.style.setProperty("--dy", (Math.random() - 0.5) * 60 - 20 + "px");
                        p.style.background = Math.random() > 0.5
                          ? "rgba(233, 69, 96, " + (0.6 + Math.random() * 0.4) + ")"
                          : "rgba(255, 213, 84, " + (0.6 + Math.random() * 0.4) + ")";
                        container.appendChild(p);
                        setTimeout(() => p.remove(), 800);
                      }
                    }, 80);
                  }}
                  onMouseLeave={(e) => {
                    const container = e.currentTarget.parentElement;
                    clearInterval(container._hoverInterval);
                    container._hoverInterval = null;
                  }}
                  onClick={(e) => {
                    const btn = e.currentTarget;
                    const container = btn.parentElement;
                    const rect = btn.getBoundingClientRect();
                    const contRect = container.getBoundingClientRect();
                    const cx = rect.left - contRect.left + rect.width / 2;
                    const cy = rect.top - contRect.top + rect.height / 2;
                    for (let i = 0; i < 70; i++) {
                      const p = document.createElement("span");
                      p.className = "cta-particle cta-particle-explode";
                      p.style.left = cx + "px";
                      p.style.top = cy + "px";
                      const angle = (Math.PI * 2 * i) / 70 + (Math.random() - 0.5) * 0.5;
                      const dist = 80 + Math.random() * 180;
                      p.style.setProperty("--dx", Math.cos(angle) * dist + "px");
                      p.style.setProperty("--dy", Math.sin(angle) * dist + "px");
                      p.style.background = ["rgba(233,69,96,1)", "rgba(255,213,84,1)", "rgba(255,255,255,0.9)"][i % 3];
                      const size = (6 + Math.random() * 8) + "px";
                      p.style.width = size;
                      p.style.height = size;
                      p.style.animationDelay = (Math.random() * 0.3) + "s";
                      container.appendChild(p);
                      setTimeout(() => p.remove(), 3000);
                    }
                    clearInterval(container._hoverInterval);
                    container._hoverInterval = null;
                    setTimeout(() => {
                      ttsPlayer.unlock();
                      setStartPhase("welcome");
                      // Muzyka w tle — fade-in po chwili
                      setTimeout(() => {
                        bgMusic.play("VEDhdAQYFM8", {
                          startSeconds: 747,
                          fadeDuration: 4000,
                          volume: 25,
                        });
                      }, 1500);
                    }, 2800);
                  }}
                  style={{
                    padding: "16px 40px",
                    borderRadius: "30px",
                    border: "2px solid rgba(233, 69, 96, 0.6)",
                    background: "linear-gradient(135deg, rgba(233,69,96,0.25), rgba(255,213,84,0.2))",
                    color: "rgba(255,255,255,0.9)",
                    fontSize: "17px",
                    fontWeight: "600",
                    cursor: "pointer",
                    opacity: 0,
                    animation: "slideUpFade 0.6s ease-out 1.6s both, invitePulse 2s ease-in-out 2.2s infinite",
                    letterSpacing: "0.5px",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  Odkryj swoje supermoce!
                </button>
              </div>
            </div>
          )}

          {/* ═══ FAZA 2: Powitanie glosowe + tekst animowany ═══ */}
          {startPhase === "welcome" && (
            <div
              onClick={() => { ttsPlayer.stop(); setStartPhase("name"); }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "80vh",
                gap: "0",
                padding: "0 20px",
                cursor: "pointer",
              }}
            >
              {/* Tekst powitania — pojawia się z animacją */}
              <div style={{
                maxWidth: "500px",
                textAlign: "center",
                opacity: 0,
                animation: "slideUpFade 1s ease-out 0.3s both",
              }}>
                <p style={{
                  fontSize: "24px",
                  lineHeight: "1.7",
                  color: "rgba(255,255,255,0.85)",
                  margin: "0 0 12px",
                  fontWeight: "600",
                }}>
                  Witaj w magicznym świecie Ewolucji!
                </p>
                <p style={{
                  fontSize: "18px",
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
              <div style={styles.bottomNarrator}>
                <NarratorVoice
                  text="Witaj w magicznym świecie Ewolucji! Czekają na Ciebie krainy pełne wyzwań, które pomogą Ci odkryć, jakim bohaterem jesteś."
                  land="dolina_selfie"
                  autoPlayDelay={600}
                  compact={false}
                  onEnd={() => setStartPhase("name")}
                />
              </div>

              {/* Logo na dole ekranu */}
              <img
                src="/logo2.svg"
                alt="EwolucJA"
                style={{
                  position: "fixed",
                  bottom: "80px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "260px",
                  maxWidth: "40vw",
                  height: "auto",
                  filter: "drop-shadow(0 4px 20px rgba(233, 69, 96, 0.3))",
                  opacity: 0.7,
                  pointerEvents: "none",
                  zIndex: 20,
                }}
              />

              {/* Podpowiedź — dotknij aby pominąć */}
              <div style={{
                position: "fixed",
                bottom: "24px",
                left: "50%",
                transform: "translateX(-50%)",
                fontSize: "13px",
                color: "rgba(255,255,255,0.4)",
                opacity: 0,
                animation: "fadeIn 0.5s ease-out 3s both",
                pointerEvents: "none",
              }}>
                Dotknij aby pominąć
              </div>
            </div>
          )}

          {/* ═══ FAZA 3: Pole imienia + narracja zachecajaca ═══ */}
          {startPhase === "name" && (
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "100vh",
              padding: "20px",
            }}>

              {/* Karta z polem imienia — wycentrowana */}
              <div style={{
                ...styles.card,
                opacity: 0,
                animation: "slideUpFade 0.8s ease-out 0.1s both",
                maxWidth: "400px",
                width: "100%",
              }}>
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
                    onChange={(e) => {
                      const name = e.target.value;
                      setPlayerName(name);
                      if (name.trim().length >= 2) {
                        setPlayerGender(detectGender(name));
                      }
                    }}
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

              {/* Kontrolki dźwięku — na dole ekranu */}
              <div style={styles.bottomNarrator}>
                <NarratorVoice
                  text="Powiedz mi, jak masz na imię? Wpisz swoje imię, a Twoja przygoda się rozpocznie!"
                  land="dolina_selfie"
                  autoPlayDelay={400}
                  compact={false}
                />
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
      {contentVisible && <div style={{
        ...styles.container,
      }}>
        {/* Powiadomienie o nowym przedmiocie (AvatarDisplay renderuje fixed overlay) */}
        {newItem && avatarConfig && (
          <AvatarDisplay
            avatarConfig={avatarConfig}
            equipment={equipment}
            playerName={playerName}
            newItem={newItem}
            onNewItemDismiss={dismissNewItem}
          />
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
            display: "flex",
            gap: "20px",
            alignItems: "stretch",
          }}>
            {/* Avatar po lewej — rozciąga się na wysokość karty */}
            {avatarConfig && currentStep?.type !== "avatar_builder" && currentStep?.type !== "final" && (
              <div style={{
                flexShrink: 0,
                width: 280,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                borderRadius: "24px",
                overflow: "hidden",
                background: "rgba(255,255,255,0.10)",
                border: "3px solid " + (landColor || "#ffd54f"),
              }}>
                {aiAvatarUrl ? (
                  <img
                    src={aiAvatarUrl}
                    alt={playerName}
                    style={{
                      width: "100%",
                      flex: 1,
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div style={{
                    width: "100%",
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    <AvatarDisplay
                      avatarConfig={avatarConfig}
                      equipment={equipment}
                      playerName={playerName}
                      compact={false}
                    />
                  </div>
                )}
                <div style={{
                  padding: "8px 0",
                  fontSize: "14px",
                  color: "rgba(255,255,255,0.6)",
                  fontWeight: 600,
                  textAlign: "center",
                  background: "rgba(0,0,0,0.2)",
                  width: "100%",
                  flexShrink: 0,
                }}>
                  {playerName}
                </div>
              </div>
            )}

            {/* Karta gry po prawej */}
            <div style={{
              ...styles.card,
              background: cardGlow,
              border: `1px solid ${cardBorder}`,
              boxShadow: `0 4px 30px ${cardGlow}`,
              flex: 1,
              minWidth: 0,
            }}>
            {/* NOWY: Kreator awatara */}
            {currentStep?.type === "avatar_builder" ? (
              <AvatarBuilder
                playerName={playerName}
                gender={playerGender}
                onComplete={(config, gender) => {
                  setAvatarConfig(config);
                  if (gender) setPlayerGender(gender);
                  agentAPI.generateAvatar(playerName, config, gender || playerGender).then((result) => {
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
                  const added = addEquipment(4, "WAIT");
                  if (!added) setTimeout(advance, 2000);
                }}
                onClick={(elapsed) => {
                  setScores((s) => applyPoints(s, { LD: 1 }));
                  const added = addEquipment(4, "CLICK");
                  if (!added) setTimeout(advance, 2000);
                }}
                landColor={landColor}
                landName={landName}
                land={land}
              />
            ) : currentStep?.type === "emotion_match" ? (
              <EmotionMatchScreen
                onComplete={(correct) => {
                  setScores((s) => applyPoints(s, { EM: correct, DT: correct }));
                  let itemAdded = false;
                  if (correct >= 2 && !equipment.includes("inventor_goggles")) {
                    setEquipment((prev) => [...prev, "inventor_goggles"]);
                    setNewItem("inventor_goggles");
                    itemAdded = true;
                  }
                  if (!itemAdded) advance();
                }}
                landColor={landColor}
                landName={landName}
                land={land}
              />
            ) : currentStep?.type === "creativity" ? (
              <CreativityScreen
                onSubmit={(text, score) => {
                  setScores((s) => applyPoints(s, { KR: score }));
                  let itemAdded = false;
                  if (score >= 3 && !equipment.includes("star_boots")) {
                    setEquipment((prev) => [...prev, "star_boots"]);
                    setNewItem("star_boots");
                    itemAdded = true;
                  }
                  if (!itemAdded) advance();
                }}
                landColor={landColor}
                landName={landName}
                land={land}
              />
            ) : null}
            </div>
          </div>
        )}
      </div>}

      {/* Globalny NarratorVoice — zawsze na dole ekranu */}
      {contentVisible && gameTtsText && !newItem && !avatarUpdatePhase && (
        <div style={styles.bottomNarrator}>
          <NarratorVoice text={gameTtsText} land={land} />
        </div>
      )}

      {/* Globalny overlay dla nowych przedmiotów - poza kontenerami */}
      {newItem && avatarConfig && (
        <AvatarDisplay
          avatarConfig={avatarConfig}
          equipment={equipment}
          playerName={playerName}
          newItem={newItem}
          onNewItemDismiss={dismissNewItem}
        />
      )}

      {/* Globalny overlay dla aktualizacji awatara — ciemny fiolet, czeka na klik */}
      {avatarUpdatePhase && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(20, 10, 40, 0.92)",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(12px)",
        }}>
          <div style={{
            textAlign: "center",
            maxWidth: "500px",
            padding: "40px 32px",
          }}>
            {avatarUpdatePhase === "generating" && (
              <>
                <div style={{ fontSize: "24px", fontWeight: 600, color: "#fff", marginBottom: "24px" }}>
                  Twój awatar ewoluuje...
                </div>
                <div style={{
                  width: 350,
                  height: 350,
                  margin: "0 auto",
                  borderRadius: "24px",
                  overflow: "hidden",
                  position: "relative",
                  background: "rgba(255,255,255,0.05)",
                  border: "2px solid rgba(255,213,84,0.2)",
                }}>
                  {avatarConfig && (
                    <AvatarDisplay
                      avatarConfig={avatarConfig}
                      equipment={equipment}
                      playerName={playerName}
                      compact={false}
                    />
                  )}
                  <div style={{
                    position: "absolute",
                    bottom: 16,
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "rgba(0,0,0,0.7)",
                    borderRadius: "20px",
                    padding: "8px 20px",
                    fontSize: "14px",
                    color: "rgba(255,255,255,0.9)",
                  }}>
                    <span style={{ animation: "pulse 1.5s ease infinite", display: "inline-block" }}>
                      Tworzenie portretu AI...
                    </span>
                  </div>
                </div>
              </>
            )}
            {avatarUpdatePhase === "ready" && (
              <>
                <div style={{ fontSize: "26px", fontWeight: 700, color: "#ffd54f", marginBottom: "24px" }}>
                  Twój awatar ewoluuje!
                </div>
                {aiAvatarUrl && (
                  <img
                    src={aiAvatarUrl}
                    alt="AI Avatar"
                    style={{
                      width: 400,
                      height: 400,
                      borderRadius: "24px",
                      objectFit: "cover",
                      boxShadow: "0 0 50px rgba(255,215,0,0.3)",
                      marginBottom: "32px",
                    }}
                  />
                )}
                <button
                  onClick={() => {
                    setAvatarUpdatePhase(null);
                    advance();
                  }}
                  style={{
                    padding: "16px 40px",
                    borderRadius: "30px",
                    border: "none",
                    background: "linear-gradient(135deg, #6C63FF, #48E0C4)",
                    color: "#fff",
                    fontSize: "18px",
                    fontWeight: 600,
                    cursor: "pointer",
                    boxShadow: "0 6px 20px rgba(108,99,255,0.4)",
                    transition: "transform 0.2s",
                  }}
                  onMouseOver={(e) => e.target.style.transform = "translateY(-2px)"}
                  onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
                >
                  Kontynuuj przygodę! →
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}