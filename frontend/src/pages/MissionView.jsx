import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { api, session } from "../services/api.js";
import { useAppData } from "../contexts/AppData.jsx";
import NarratorVoice from "../components/NarratorVoice.jsx";
import PageShell from "../components/PageShell.jsx";
import TopBar from "../components/TopBar.jsx";
import TabBar from "../components/TabBar.jsx";
import Celebration from "../components/Celebration.jsx";
import { Sparkle, ScrollIcon } from "../components/art.jsx";

export default function MissionView() {
  const navigate = useNavigate();
  // Misja z globalnego kontekstu - byla zaladowana razem z domem, brak czekania
  const { mission, error: ctxError } = useAppData();
  const [step, setStep] = useState(0);
  const [answer, setAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const [error, setError] = useState(ctxError);

  useEffect(() => {
    if (!session.getPlayer()) navigate("/onboarding");
  }, [navigate]);

  useEffect(() => {
    if (step === 1) {
      const id = setTimeout(() => setStep(2), 2000);
      return () => clearTimeout(id);
    }
  }, [step]);

  const narrationText = useMemo(() => {
    if (!mission) return "";
    return [mission.narrative_intro, mission.body].filter(Boolean).join(" ");
  }, [mission]);

  async function handleSubmit() {
    if (!mission || !answer.trim()) return;
    setSubmitting(true);
    try {
      await api.submitMissionProof(mission.mission_id, { proof_text: answer });
      setCelebrating(true);
      setTimeout(() => navigate("/reward"), 1800);
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  if (error) {
    return (
      <PageShell>
        <TopBar />
        <div style={{ padding: 40 }}>
          <p style={{ color: "#B85B47" }}>{error}</p>
        </div>
        <TabBar current="home" />
      </PageShell>
    );
  }

  return (
    <PageShell>
      <TopBar />

      <div className="screen-scroll" style={{ flex: 1, padding: "4px 18px 84px", display: "flex", flexDirection: "column", gap: 14 }}>
        {!mission && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, padding: "40px 0" }}>
            <div style={{ animation: "float-mid 3s ease-in-out infinite" }}>
              <ScrollIcon size={80} />
            </div>
            <p className="t-hand" style={{ fontSize: 18, color: "var(--p-ink-soft)", margin: 0, textAlign: "center" }}>
              Kronika szuka tropu dla Ciebie…
            </p>
          </div>
        )}
        {mission && (
          <>
            <div className="t-display" style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.5, color: "var(--p-magic-dk)", textAlign: "center", marginTop: 4 }}>
              LAS PYTAŃ — MISJA
            </div>
          </>
        )}
        {mission && step === 0 && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18, padding: "12px 0" }}>
            <div style={{ position: "relative", animation: "float-mid 3s ease-in-out infinite" }}>
              <img src="/assets/zwoj-closed.png" alt="" style={{ width: 170, height: "auto", display: "block", filter: "drop-shadow(0 18px 26px rgba(80,50,10,.40))" }} />
              <div style={{ position: "absolute", top: -6, left: -22 }}><Sparkle size={20} /></div>
              <div style={{ position: "absolute", bottom: 30, right: -26 }}><Sparkle size={16} delay={0.4} /></div>
              <div style={{ position: "absolute", top: "42%", left: "50%", transform: "translate(-50%,-50%)", fontSize: 34, color: "#7A4DC2", textShadow: "0 2px 6px rgba(255,255,255,.6)" }}>✦</div>
            </div>
            <h2 className="t-display" style={{ fontSize: 26, textAlign: "center", margin: 0 }}>Zwój czeka na Ciebie</h2>
            <p className="t-hand" style={{ fontSize: 20, textAlign: "center", color: "var(--p-ink-soft)", margin: 0, maxWidth: 240 }}>
              Naciśnij, aby rozwinąć i poznać dzisiejsze tropienie.
            </p>
            <button className="btn btn-magic btn-block" style={{ maxWidth: 320 }} onClick={() => setStep(1)}>
              Rozwiń zwój ✦
            </button>
          </div>
        )}

        {mission && step === 1 && (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ position: "relative", width: "100%", maxWidth: 320, aspectRatio: "610 / 522" }}>
              <img src="/assets/zwoj-open.png" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", filter: "drop-shadow(0 14px 26px rgba(80,50,10,.35))", animation: "unroll 1.9s cubic-bezier(.33,.0,.30,1) forwards", transformOrigin: "center", transform: "scaleX(.08)", willChange: "transform" }} />
              <style>{`@keyframes unroll { 0% { transform: scaleX(.08) } 100% { transform: scaleX(1) } }`}</style>
            </div>
          </div>
        )}

        {mission && step === 2 && (
          <div className="pop-in" style={{ width: "100%", margin: "8px 0" }}>
            <div style={{ position: "relative", width: "100%", aspectRatio: "610 / 522" }}>
              <img src="/assets/zwoj-open.png" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", filter: "drop-shadow(0 14px 26px rgba(80,50,10,.35))" }} />
              <div style={{ position: "absolute", inset: "12% 17% 13% 17%", display: "flex", flexDirection: "column", justifyContent: "center", overflow: "hidden" }}>
                <div style={{ display: "flex", gap: 5, marginBottom: 6, flexWrap: "wrap" }}>
                  <span className="chip magic" style={{ fontSize: 10, padding: "3px 8px" }}>Las Pytań</span>
                  <span className="chip amber" style={{ fontSize: 10, padding: "3px 8px" }}>+3 ✦ +Artefakt</span>
                </div>
                <h2 className="t-display" style={{ fontSize: 17, lineHeight: 1.18, margin: "2px 0", color: "#3B2A12" }}>{mission.title}</h2>
                <p className="t-hand" style={{ fontSize: 14, lineHeight: 1.25, margin: "4px 0 0", color: "#5C4220" }}>{mission.body}</p>
              </div>
            </div>
            <div style={{ background: "rgba(122,77,194,.10)", borderRadius: 14, padding: "10px 12px", marginTop: 6 }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.5, color: "var(--p-magic-dk)" }}>JAK WRACA ECHO</div>
              <div style={{ fontSize: 13, marginTop: 4 }}>Zapisz lub nagraj odpowiedź dorosłego — to ona stanie się Twoim artefaktem.</div>
            </div>
            <button className="btn btn-magic btn-block" style={{ marginTop: 10 }} onClick={() => setStep(3)}>Mam już pytanie — dalej</button>
            <NarratorVoice text={narrationText} land="las_decyzji" tone="mystery" inlinePauses autoPlay />
          </div>
        )}

        {mission && step === 3 && (
          <div className="pop-in" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div className="card">
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.5, color: "var(--p-ink-soft)" }}>TWOJE PYTANIE / DOWÓD</div>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Wpisz pytanie, które zadałeś — albo opowiedz, jak Ci poszło…"
                style={{ width: "100%", minHeight: 90, marginTop: 6, padding: 12, border: "2px solid rgba(122,77,194,.30)", borderRadius: 14, background: "rgba(255,255,255,.85)", fontFamily: "Caveat, cursive", fontSize: 20, color: "var(--p-ink)", resize: "none", outline: "none", boxSizing: "border-box" }}
              />
            </div>
            <div className="card">
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.5, color: "var(--p-ink-soft)" }}>FORMA DOWODU (wkrótce)</div>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button className="btn btn-ghost btn-sm" style={{ flex: 1 }} disabled>✎ Zapisz</button>
                <button className="btn btn-ghost btn-sm" style={{ flex: 1 }} disabled>🎙 Nagraj</button>
                <button className="btn btn-ghost btn-sm" style={{ flex: 1 }} disabled>✏ Narysuj</button>
              </div>
            </div>
            <button className="btn btn-magic btn-block" disabled={!answer.trim() || submitting} onClick={handleSubmit}>
              {submitting ? "Wysyłam echo…" : "Złóż tropienie ✦"}
            </button>
          </div>
        )}
      </div>
      <Celebration active={celebrating} />
      <TabBar current="home" />
    </PageShell>
  );
}
