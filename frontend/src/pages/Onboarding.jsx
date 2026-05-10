/**
 * Onboarding — tworzenie konta dziecka + krótki quiz wstępny.
 * Po zakończeniu quizu: archetyp jest przypisany natychmiast i startuje pierwszy cykl.
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api, session } from "../services/api.js";
import { ARCHETYPES } from "../config.js";
import NarratorVoice from "../components/NarratorVoice.jsx";
import { ttsPlayer } from "../services/ttsPlayer";

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState("name"); // name | quiz | result
  const [name, setName] = useState("");
  const [playerId, setPlayerId] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [questionIdx, setQuestionIdx] = useState(0);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (step === "quiz" && !quiz) {
      api.getQuiz().then(setQuiz).catch((e) => setError(e.message));
    }
  }, [step, quiz]);

  async function handleStart(e) {
    e.preventDefault();
    if (!name.trim()) return;
    // Pierwszy gest użytkownika — odblokuj TTS (iOS/Safari)
    ttsPlayer.unlock();
    setLoading(true);
    setError(null);
    try {
      const player = await api.createPlayer(name.trim());
      session.setPlayer(player.player_id);
      setPlayerId(player.player_id);
      setStep("quiz");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function selectAnswer(questionId, answerId) {
    setAnswers((prev) => ({ ...prev, [questionId]: answerId }));
    if (quiz && questionIdx < quiz.questions.length - 1) {
      setQuestionIdx((i) => i + 1);
    } else {
      submitQuiz({ ...answers, [questionId]: answerId });
    }
  }

  async function submitQuiz(finalAnswers) {
    setLoading(true);
    try {
      const payload = Object.entries(finalAnswers).map(([q, a]) => ({
        question_id: q,
        answer_id: a,
      }));
      const res = await api.submitQuiz(playerId, payload);
      setResult(res);
      setStep("result");
      // wygeneruj pierwszą misję od razu — żeby było co robić w realu
      try {
        await api.generateMission(playerId);
      } catch {}
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function enterWorld() {
    navigate("/world");
  }

  // ── UI ──
  return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        {step === "name" && (
          <form onSubmit={handleStart}>
            <h1 style={styles.title}>EwolucJA</h1>
            <div style={styles.narrationRow}>
              <p style={styles.lead}>
                Witaj w Krainie Kroniki. Zanim wyruszymy, powiedz, jak się nazywasz.
              </p>
              <NarratorVoice
                text="Witaj w Krainie Kroniki. Zanim wyruszymy, powiedz, jak się nazywasz."
                land="dolina_selfie"
                autoPlay
              />
            </div>
            <input
              style={styles.input}
              autoFocus
              placeholder="Twoje imię"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={30}
            />
            <button type="submit" style={styles.btnPrimary} disabled={loading || !name.trim()}>
              {loading ? "Otwieram bramę…" : "Wejdź"}
            </button>
            {error && <p style={styles.error}>{error}</p>}
          </form>
        )}

        {step === "quiz" && quiz && (
          <div>
            <p style={styles.muted}>
              Pytanie {questionIdx + 1} z {quiz.questions.length}
            </p>
            <div style={styles.narrationRow}>
              <h2 style={styles.questionTitle}>{quiz.questions[questionIdx].question}</h2>
              <NarratorVoice
                text={quiz.questions[questionIdx].question}
                land="las_decyzji"
                autoPlay
              />
            </div>
            <div style={styles.answers}>
              {quiz.questions[questionIdx].answers.map((a) => (
                <button
                  key={a.answer_id}
                  style={styles.answerBtn}
                  onClick={() => selectAnswer(quiz.questions[questionIdx].question_id, a.answer_id)}
                  disabled={loading}
                >
                  {a.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === "result" && result && (
          <ArchetypeReveal result={result} onEnter={enterWorld} />
        )}
      </div>
    </div>
  );
}

function ArchetypeReveal({ result, onEnter }) {
  const arch = ARCHETYPES[result.archetype] || ARCHETYPES.tropiciel_tajemnic;
  const revealText = `Kronika rozpoznała Cię jako: ${arch.name}. ${arch.tagline} ${arch.description || ""}`;
  return (
    <div>
      <div style={styles.narrationRow}>
        <p style={styles.muted}>Kronika rozpoznała Cię jako…</p>
        <NarratorVoice text={revealText} land="gora_podsumowania" autoPlay />
      </div>
      <div
        style={{
          ...styles.archetypeCard,
          boxShadow: `0 20px 60px ${arch.glow_color || "rgba(155,89,182,0.25)"}`,
          borderColor: arch.accent_color,
        }}
      >
        <div style={{ ...styles.archetypeIcon, background: arch.accent_color }}>🔍</div>
        <h2 style={styles.archetypeName}>{arch.name}</h2>
        <p style={styles.archetypeTag}>{arch.tagline}</p>
        <p style={styles.archetypeDesc}>{arch.description}</p>
        <p style={styles.starter}>
          Pierwszy artefakt w plecaku: <strong>{arch.starter_artifact?.name}</strong>
        </p>
      </div>
      <button style={styles.btnPrimary} onClick={onEnter}>
        Wejdź do świata
      </button>
    </div>
  );
}

const styles = {
  wrap: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #1a1040 0%, #2d1b4e 50%, #1a1a2e 100%)",
    padding: 20,
  },
  card: {
    maxWidth: 560,
    width: "100%",
    background: "rgba(255,255,255,0.06)",
    borderRadius: 28,
    padding: "36px 32px",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.1)",
    backdropFilter: "blur(8px)",
  },
  title: { fontSize: 42, margin: "0 0 8px", letterSpacing: 1 },
  lead: { fontSize: 17, opacity: 0.8, marginBottom: 24 },
  input: {
    width: "100%",
    padding: "14px 18px",
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.08)",
    color: "#fff",
    fontSize: 18,
    marginBottom: 20,
    boxSizing: "border-box",
  },
  btnPrimary: {
    width: "100%",
    padding: "16px",
    borderRadius: 16,
    border: "none",
    background: "linear-gradient(135deg, #9b59b6, #6a3aa3)",
    color: "#fff",
    fontSize: 17,
    fontWeight: 600,
    cursor: "pointer",
    marginTop: 16,
  },
  error: { color: "#ff8a8a", marginTop: 12 },
  muted: { opacity: 0.6, fontSize: 14, marginBottom: 6 },
  narrationRow: { display: "flex", justifyContent: "space-between", alignItems: "fle