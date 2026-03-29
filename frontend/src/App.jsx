import React, { useState, useCallback } from "react";
import AvatarBuilder from "./components/AvatarBuilder";
import AvatarDisplay from "./components/AvatarDisplay";
import { TASK_EQUIPMENT_MAP, EQUIPMENT_DEFS } from "./components/AvatarSVG";

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

function ChoiceScreen({ narration, choices, onChoice, landColor, landName }) {
  const [hovered, setHovered] = useState(null);
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
          onClick={() => onChoice(c.id)}
        >
          {c.icon && <span style={{ marginRight: 8 }}>{c.icon}</span>}
          {c.label}
        </button>
      ))}
    </div>
  );
}

function TimerScreen({ onWait, onClick, landColor, landName }) {
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

function EmotionMatchScreen({ onComplete, landColor, landName }) {
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

function CreativityScreen({ onSubmit, landColor, landName }) {
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

function FinalScreen({ scores, playerName, avatarConfig, equipment }) {
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const topTwo = [sorted[0][0], sorted[1][0]].sort().join("_");
  const title = HYBRID_TITLES[topTwo] || "Bohater Nieznanych Krain";
  const lowest = sorted[sorted.length - 1];
  const lowestLabel = PROFILE_LABELS[lowest[0]];

  return (
    <div>
      <div style={{ textAlign: "center", fontSize: "48px", marginBottom: "8px" }}>🏔️</div>
      <div style={styles.finalTitle}>{title}</div>

      {/* Awatar z pełnym ekwipunkiem */}
      {avatarConfig && (
        <div style={{ marginBottom: "20px" }}>
          <AvatarDisplay
            avatarConfig={avatarConfig}
            equipment={equipment}
            playerName={playerName}
            compact={false}
          />
        </div>
      )}

      <div style={styles.narration}>
        Brawo, {playerName}! Przeszedłeś wszystkie krainy i Twoje prawdziwe supermoce się ujawniły!
        Jesteś <strong style={{ color: "#ffd54f" }}>{title}</strong> — to znaczy,
        że łączysz w sobie niezwykłe talenty {PROFILE_LABELS[sorted[0][0]].name} i{" "}
        {PROFILE_LABELS[sorted[1][0]].name}!
      </div>
      <div style={{ ...styles.card, background: "rgba(255,255,255,0.05)" }}>
        <h3 style={{ margin: "0 0 12px", fontSize: "16px" }}>Twoje supermoce:</h3>
        <ScoreDisplay scores={scores} />
      </div>
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
  const [playerName, setPlayerName] = useState("");
  const [stepIndex, setStepIndex] = useState(0);
  const [scores, setScores] = useState({ EM: 0, ST: 0, KR: 0, LD: 0, DT: 0, MD: 0 });

  // ── Nowy stan awatara ──
  const [avatarConfig, setAvatarConfig] = useState(null);
  const [equipment, setEquipment] = useState([]);
  const [newItem, setNewItem] = useState(null);

  const currentStep = GAME_STEPS[stepIndex];

  const advance = useCallback(() => {
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
      <div style={styles.app}>
        <div style={styles.container}>
          <div style={{ textAlign: "center", marginTop: "60px", marginBottom: "40px" }}>
            <div style={{ fontSize: "64px", marginBottom: "16px" }}>🌟</div>
            <div style={styles.title}>EWOLUCJA</div>
            <p style={styles.subtitle}>Odkryj swoje supermoce!</p>
          </div>
          <div style={styles.card}>
            <p style={{ margin: "0 0 16px", fontSize: "15px" }}>
              Witaj w magicznym świecie Ewolucji! Czekają na Ciebie krainy pełne wyzwań,
              które pomogą Ci odkryć, jakim bohaterem jesteś.
            </p>
            <input
              style={styles.input}
              placeholder="Wpisz swoje imię..."
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
            />
            {playerName.trim().length > 0 && (
              <button
                style={{
                  ...styles.button,
                  textAlign: "center",
                  background: "linear-gradient(135deg, rgba(233,69,96,0.3), rgba(255,213,84,0.3))",
                  borderColor: "#e94560",
                  fontSize: "18px",
                  fontWeight: "600",
                }}
                onClick={() => setPhase("playing")}
              >
                Wyruszam w przygodę!
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Ekran gry ─────────────────────────────────────────────────────

  const land = currentStep?.land || "gora_podsumowania";
  const landColor = LAND_COLORS[land];
  const landName = LAND_NAMES[land];

  return (
    <div style={styles.app}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.title}>EWOLUCJA</div>
          <p style={styles.subtitle}>{playerName} — Podróż trwa...</p>
        </div>

        {/* Kompaktowy awatar (widoczny po stworzeniu) */}
        {avatarConfig && currentStep?.type !== "avatar_builder" && currentStep?.type !== "final" && !newItem && (
          <AvatarDisplay
            avatarConfig={avatarConfig}
            equipment={equipment}
            playerName={playerName}
            compact={true}
          />
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
          <div style={styles.card}>
            {/* NOWY: Kreator awatara */}
            {currentStep?.type === "avatar_builder" ? (
              <AvatarBuilder
                playerName={playerName}
                onComplete={(config) => {
                  setAvatarConfig(config);
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
              />
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
