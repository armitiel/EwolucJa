import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api, session } from "../services/api.js";
import { ARCHETYPES } from "../config.js";
import { ttsPlayer } from "../services/ttsPlayer";
import NarratorVoice from "../components/NarratorVoice.jsx";
import PageShell from "../components/PageShell.jsx";
import { Avatar, Sparkle } from "../components/art.jsx";

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState("name");
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

  function selectAnswer(qid, aid) {
    setAnswers((prev) => ({ ...prev, [qid]: aid }));
    if (quiz && questionIdx < quiz.questions.length - 1) {
      setQuestionIdx((i) => i + 1);
    } else {
      submitQuiz({ ...answers, [qid]: aid });
    }
  }

  async function submitQuiz(finalAnswers) {
    setLoading(true);
    try {
      const payload = Object.entries(finalAnswers).map(([q, a]) => ({ question_id: q, answer_id: a }));
      const res = await api.submitQuiz(playerId, payload);
      setResult(res);
      setStep("result");
      try { await api.generateMission(playerId); } catch {}
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const totalSteps = 1 + (quiz?.questions?.length || 5) + 1;
  const currentStepIdx = step === "name" ? 0 : step === "quiz" ? 1 + questionIdx : totalSteps - 1;

  return (
    <PageShell>
      <div className="topbar" style={{ position: "relative", zIndex: 1 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate("/")}>‹ Wróć</button>
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              style={{
                width: i === currentStepIdx ? 28 : 8,
                height: 8,
                borderRadius: 4,
                background: i <= currentStepIdx ? "var(--p-magic-dk)" : "rgba(43,42,74,.20)",
                transition: "all .25s",
              }}
            />
          ))}
        </div>
      </div>

      <div className="screen-scroll" style={{ flex: 1, padding: "10px 18px 28px" }}>
        {step === "name" && (
          <form onSubmit={handleStart} className="pop-in" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <h1 className="t-display" style={{ fontSize: 34, margin: "8px 0 0", color: "var(--p-ink)" }}>
              Witaj w Krainie&nbsp;Kroniki
            </h1>
            <p className="t-hand" style={{ margin: 0, fontSize: 20, color: "var(--p-ink-soft)" }}>
              Zanim wyruszymy — powiedz, jak się nazywasz?
            </p>

            <div style={{ position: "relative", marginTop: 6 }}>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={16}
                autoFocus
                style={{
                  width: "100%",
                  fontSize: 24,
                  fontFamily: "var(--font-display, 'Fredoka'), sans-serif",
                  fontWeight: 700,
                  padding: "18px 20px",
                  border: "2.5px solid var(--p-magic-dk)",
                  borderRadius: 18,
                  background: "rgba(255,255,255,.85)",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
              <span
                style={{
                  position: "absolute",
                  top: -10,
                  left: 18,
                  background: "var(--p-magic-dk)",
                  color: "#fff",
                  fontSize: 11,
                  fontWeight: 800,
                  padding: "2px 10px",
                  borderRadius: 6,
                  letterSpacing: 1,
                }}
              >
                TWOJE IMIĘ
              </span>
            </div>

            <button type="submit" className="btn btn-magic btn-block" disabled={loading || !name.trim()}>
              {loading ? "Otwieram bramę…" : "Dalej →"}
            </button>

            <NarratorVoice
              text="Witaj w Zakątku Gamma. Zanim wyruszymy, powiedz, jak się nazywasz."
              land="dolina_selfie"
              tone="warm"
              autoPlay
            />

            {error && <p style={{ color: "#B85B47" }}>{error}</p>}
          </form>
        )}

        {step === "quiz" && quiz && (
          <div className="pop-in" key={questionIdx} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <p style={{ opacity: 0.65, fontSize: 12, fontWeight: 800, letterSpacing: 1.5, margin: 0 }}>
              PYTANIE {questionIdx + 1} Z {quiz.questions.length}
            </p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
              <h2 className="t-display" style={{ fontSize: 26, lineHeight: 1.2, margin: 0, flex: 1 }}>
                {quiz.questions[questionIdx].question}
              </h2>
              <NarratorVoice text={quiz.questions[questionIdx].question} land="las_decyzji" tone="neutral" autoPlay />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {quiz.questions[questionIdx].answers.map((a) => (
                <button
                  key={a.answer_id}
                  className="card card-tight"
                  onClick={() => selectAnswer(quiz.questions[questionIdx].question_id, a.answer_id)}
                  disabled={loading}
                  style={{
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    padding: "14px 16px",
                    fontSize: 15,
                    fontFamily: "var(--font-body, 'Nunito'), sans-serif",
                    fontWeight: 600,
                    color: "var(--p-ink)",
                  }}
                >
                  {a.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === "result" && result && (
          <ArchetypeReveal result={result} onEnter={() => navigate("/world")} />
        )}
      </div>
    </PageShell>
  );
}

function ArchetypeReveal({ result, onEnter }) {
  const arch = ARCHETYPES[result.archetype] || ARCHETYPES.tropiciel_tajemnic;
  const revealText = `Kronika rozpoznała Cię jako: ${arch.name}. ${arch.tagline}`;
  return (
    <div className="pop-in" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
      <p style={{ opacity: 0.65, fontSize: 12, fontWeight: 800, letterSpacing: 1.5, margin: 0 }}>
        KRONIKA ROZPOZNAŁA CIĘ JAKO…
      </p>

      <div style={{ position: "relative" }}>
        <Avatar kind="fox" size={140} evolved={2} />
        <div style={{ position: "absolute", top: -6, right: -10 }}>
          <Sparkle size={22} />
        </div>
        <div style={{ position: "absolute", bottom: 10, left: -16 }}>
          <Sparkle size={16} delay={0.5} />
        </div>
      </div>

      <h2 className="t-display" style={{ fontSize: 32, margin: "4px 0 0", textAlign: "center" }}>
        {arch.name}
      </h2>
      <p className="t-hand" style={{ fontSize: 20, color: "var(--p-ink-soft)", margin: 0, textAlign: "center", maxWidth: 320 }}>
        {arch.tagline}
      </p>

      <div className="card card-paper" style={{ width: "100%", maxWidth: 380 }}>
        <p style={{ fontSize: 14, lineHeight: 1.5, margin: 0, color: "var(--p-ink-soft)" }}>
          {arch.description}
        </p>
        {arch.starter_artifact && (
          <p style={{ marginTop: 10, fontSize: 13 }}>
            Pierwszy artefakt w plecaku: <strong>{arch.starter_artifact.name}</strong>
          </p>
        )}
      </div>

      <NarratorVoice text={revealText} land="gora_podsumowania" tone="celebration" pauseBefore={600} inlinePauses autoPlay />

      <button className="btn btn-magic btn-block" style={{ maxWidth: 380 }} onClick={onEnter}>
        Wyrusz w drogę ✦
      </button>
    </div>
  );
}
