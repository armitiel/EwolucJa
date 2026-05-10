import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api, session } from "../services/api.js";
import { ARCHETYPES } from "../config.js";
import { ttsPlayer } from "../services/ttsPlayer";
import NarratorVoice from "../components/NarratorVoice.jsx";
import PageShell from "../components/PageShell.jsx";
import { Avatar, Sparkle } from "../components/art.jsx";

// Krotkie teksty przejsciowe miedzy odpowiedzia a kolejnym pytaniem.
// Indeksowane po numerze pytania DO KTOREGO przechodzimy (1 -> 4).
const TRANSITIONS = [
  "",                                          // przed pyt. 1 (nieuzywane — tam jest intro)
  "Dobrze… słyszę cię. A teraz powiedz mi…",   // przed pyt. 2
  "Hmm, to ciekawe. Pomyśl chwilę nad tym…",   // przed pyt. 3
  "Czuję, że zaczynam cię już rozumieć. Jeszcze jedno…", // przed pyt. 4
  "Ostatnie pytanie. Skup się jeszcze na chwilę…",       // przed pyt. 5
];

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
  // Czy lektor skonczyl mowic (intro lub przejscie) — dopiero wtedy pokazujemy odpowiedzi.
  // Przy 1. pytaniu blokuje wszystko do konca intro. Przy kolejnych — do konca przejscia.
  const [narrationDone, setNarrationDone] = useState(false);

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
      setNarrationDone(false); // zablokuj odpowiedzi przy nastepnym pytaniu az lektor skonczy
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
            <h1 className="t-display" style={{ fontSize: 34, margin: "8px 0 4px", color: "var(--p-ink)", lineHeight: 1.18, letterSpacing: "-0.3px" }}>
              Witaj w Zakątku&nbsp;Gamma
            </h1>
            <p className="t-hand" style={{ margin: "4px 0 8px", fontSize: 20, color: "var(--p-ink-soft)", lineHeight: 1.5 }}>
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
              text="Witaj w Zakątku Gamma… Zanim ruszymy w tę przygodę — powiedz mi, jak masz na imię?"
              land="dolina_selfie"
              tone="warm"
              speed={0.95}
              pauseBefore={500}
              inlinePauses
              autoPlayDelay={1200}
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

            {/* Awatar — wyrazny podczas intro, mniejszy przy kolejnych pytaniach */}
            {questionIdx === 0 && !narrationDone && (
              <div className="pop-in" style={{ display: "flex", justifyContent: "center", padding: "8px 0 4px", position: "relative" }}>
                <div style={{ position: "relative" }}>
                  <Avatar kind="fox" size={130} evolved={1} />
                  <div style={{ position: "absolute", top: -4, right: -10 }}><Sparkle size={20} /></div>
                  <div style={{ position: "absolute", bottom: 6, left: -14 }}><Sparkle size={14} delay={0.5} /></div>
                </div>
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
              <h2 className="t-display" style={{ fontSize: 26, lineHeight: 1.2, margin: 0, flex: 1 }}>
                {quiz.questions[questionIdx].question}
              </h2>
              {questionIdx === 0 ? (
                <NarratorVoice
                  text={`Cześć. Bardzo się cieszę, że tu jesteś. Zakątek Gamma właśnie otwiera przed tobą swoje bramy… Czeka cię tu mnóstwo radości, gier i zupełnie nowych, tajemniczych miejsc do zbadania. Żeby ta podróż była dla ciebie jak najciekawsza — warto na samym początku sprawdzić, jaka niezwykła siła w tobie drzemie. Dlatego przygotowałam dla ciebie kilka prostych pytań. Dzięki twoim szczerym odpowiedziom dowiesz się, z jakim magicznym opiekunem wyruszycie w drogę. Może to będzie wspierający Empata… a może bystra Strateżka? Twój nowy przyjaciel poprowadzi cię przez wszystkie wyzwania i pokaże ci świat, w którym nauka jest najfajniejszą zabawą. Zaufaj sobie… i zobaczmy, od czego zacznie się twoja historia. A teraz… ${quiz.questions[0].question}`}
                  land="las_decyzji"
                  tone="warm"
                  speed={0.92}
                  pauseBefore={500}
                  inlinePauses
                  autoPlay
                  onEnd={() => setNarrationDone(true)}
                />
              ) : (
                <NarratorVoice
                  text={`${TRANSITIONS[questionIdx] || ""} ${quiz.questions[questionIdx].question}`.trim()}
                  land="las_decyzji"
                  tone="calm"
                  speed={0.94}
                  pauseBefore={300}
                  inlinePauses
                  autoPlay
                  onEnd={() => setNarrationDone(true)}
                />
              )}
            </div>

            {/* Odpowiedzi — pojawiaja sie dopiero po skonczeniu narracji, z animacja fade-up */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                opacity: narrationDone ? 1 : 0,
                transform: narrationDone ? "translateY(0)" : "translateY(12px)",
                transition: "opacity 0.5s ease, transform 0.5s ease",
                pointerEvents: narrationDone ? "auto" : "none",
              }}
            >
              {quiz.questions[questionIdx].answers.map((a, idx) => (
                <button
                  key={a.answer_id}
                  className="card card-tight"
                  onClick={() => selectAnswer(quiz.questions[questionIdx].question_id, a.answer_id)}
                  disabled={loading || !narrationDone}
                  style={{
                    border: "none",
                    cursor: narrationDone ? "pointer" : "default",
                    textAlign: "left",
                    padding: "14px 16px",
                    fontSize: 15,
                    fontFamily: "var(--font-body, 'Nunito'), sans-serif",
                    fontWeight: 600,
                    color: "var(--p-ink)",
                    transition: `opacity 0.4s ease ${idx * 0.08}s, transform 0.4s ease ${idx * 0.08}s`,
                    opacity: narrationDone ? 1 : 0,
                    transform: narrationDone ? "translateY(0)" : "translateY(8px)",
                  }}
                >
                  {a.text}
                </button>
              ))}

              {!narrationDone && (
                <p style={{ opacity: 0.55, fontSize: 13, textAlign: "center", margin: "8px 0 0", fontStyle: "italic" }}>
                  Posłuchaj uważnie… za chwilę pojawią się odpowiedzi.
                </p>
              )}
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
