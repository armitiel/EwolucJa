import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { api, session } from "../services/api.js";
import { useAppData } from "../contexts/AppData.jsx";
import NarratorVoice from "../components/NarratorVoice.jsx";
import PageShell from "../components/PageShell.jsx";
import TopBar from "../components/TopBar.jsx";
import TabBar from "../components/TabBar.jsx";
import Celebration from "../components/Celebration.jsx";
import { Sparkle, ScrollIcon, MissionScroll, Coin } from "../components/art.jsx";

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

  // Krotki burst konfetti przy otwarciu zwoju (WOW efekt)
  const [openBurst, setOpenBurst] = useState(false);
  useEffect(() => {
    if (step === 2) {
      setOpenBurst(true);
      const id = setTimeout(() => setOpenBurst(false), 2400);
      return () => clearTimeout(id);
    }
  }, [step]);

  // Zwoj otwarty (step 2 lub 3) = ciemne tlo + glow
  const scrollOpen = step === 2 || step === 3;
  // Ciemny overlay zaczyna fade-in od step 1 (klikniecie 'Rozwin') - plynne przejscie kolor tla
  const darkOverlayOn = step === 1 || step === 2 || step === 3;

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
      {/* Plynnie pojawiajacy sie ciemny overlay - zaczyna fade-in od momentu kilkniecia 'Rozwin zwoj' */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          opacity: darkOverlayOn ? 1 : 0,
          transition: "opacity 1.2s cubic-bezier(.4, 0, .2, 1)",
          background:
            "radial-gradient(ellipse at 50% 35%, #2A1B5C 0%, #1A1238 45%, #0F0828 100%)",
        }}
      />
      <TopBar />

      <div className="screen-scroll" style={{ flex: 1, padding: "12px 18px 96px", display: "flex", flexDirection: "column", gap: 14, position: "relative", zIndex: 1 }}>
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
        {/* Etapy 0–2: zwoj zamkniety / w trakcie rozwijania / otwarty z tresci misji */}
        {mission && step !== 3 && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: "12px 0 0" }}>
            <div
              style={{
                animation: step === 0 ? "float-mid 3s ease-in-out infinite" : "none",
                position: "relative",
              }}
            >
              {/* GLOW HALO za zwojem - 2 warstwy dla WOW efektu */}
              {scrollOpen && (
                <>
                  {/* Warstwa zewnetrzna - duza, miekka, fioletowo-purpurowa aura */}
                  <div
                    aria-hidden="true"
                    className="mission-scroll-halo-outer"
                    style={{
                      position: "absolute",
                      inset: "-60% -40%",
                      zIndex: 0,
                      pointerEvents: "none",
                      background:
                        "radial-gradient(ellipse at center, rgba(180,130,255,.55) 0%, rgba(140,90,220,.40) 30%, rgba(80,40,160,.20) 60%, transparent 80%)",
                      filter: "blur(20px)",
                    }}
                  />
                  {/* Warstwa wewnetrzna - intensywna ciepla zlota poswiata */}
                  <div
                    aria-hidden="true"
                    className="mission-scroll-halo-inner"
                    style={{
                      position: "absolute",
                      inset: "-25% -15%",
                      zIndex: 0,
                      pointerEvents: "none",
                      background:
                        "radial-gradient(ellipse at center, rgba(255,235,170,.85) 0%, rgba(255,200,100,.65) 25%, rgba(255,160,60,.35) 50%, transparent 75%)",
                      filter: "blur(12px)",
                      mixBlendMode: "screen",
                    }}
                  />
                </>
              )}
              <MissionScroll
                state={step === 0 ? "closed" : "open"}
                width={300}
                onClick={() => {
                  if (step === 0) {
                    setStep(1);
                    setTimeout(() => setStep(2), 1200);
                  } else if (step === 2) {
                    setStep(0);
                  }
                }}
              >
                <div style={{ display: "flex", gap: 5, marginBottom: 8, flexWrap: "wrap", justifyContent: "center" }}>
                  <span className="chip magic" style={{ fontSize: 10, padding: "3px 8px" }}>Las Pytań</span>
                  <span className="chip amber" style={{ fontSize: 10, padding: "3px 8px" }}>+Artefakt</span>
                </div>
                <h2 className="t-display" style={{ fontSize: 18, lineHeight: 1.2, margin: "2px 0 8px", color: "#3B2A12", textAlign: "center" }}>
                  {mission.title}
                </h2>
                <p className="t-hand" style={{ fontSize: 15, lineHeight: 1.35, margin: 0, color: "#5C4220", textAlign: "center" }}>
                  {mission.body}
                </p>
                {/* Coin bonus - pojawia sie na pergaminie po rozwinieciu */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 12, padding: "6px 12px", background: "rgba(255,213,105,.30)", borderRadius: 999, alignSelf: "center", width: "fit-content" }}>
                  <Coin size={20} anim />
                  <span className="t-display" style={{ fontSize: 16, color: "#7A4D10", fontWeight: 800 }}>+3 monety bonusu</span>
                </div>
              </MissionScroll>
              {step === 0 && (
                <>
                  <div style={{ position: "absolute", top: -6, left: -22 }}><Sparkle size={20} /></div>
                  <div style={{ position: "absolute", bottom: 0, right: -26 }}><Sparkle size={16} delay={0.4} /></div>
                </>
              )}
            </div>

            {/* Podpowiedz + CTA rozwijania (alternatywa do klikniecia w zwoj) */}
            {step === 0 && (
              <>
                <p className="t-hand pop-in" style={{ fontSize: 17, color: "var(--p-magic-dk)", margin: 0, textAlign: "center", opacity: .85 }}>
                  ✨ Kliknij zwój albo przycisk, by poznać dziś zadanie
                </p>
                <button
                  className="btn btn-magic btn-block pop-in"
                  style={{ maxWidth: 300 }}
                  onClick={() => {
                    setStep(1);
                    setTimeout(() => setStep(2), 1200);
                  }}
                >
                  Rozwiń zwój ✦
                </button>
              </>
            )}

            {/* CTA po rozwinieciu */}
            {step === 2 && (
              <div className="pop-in" style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "center", width: "100%", maxWidth: 300, marginTop: 4 }}>
                <button className="btn btn-magic btn-block" style={{ width: "100%" }} onClick={() => setStep(3)}>
                  Daj Odpowiedź ✦
                </button>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#F4E8C2", opacity: .80, textAlign: "center" }}>
                  <span style={{ fontSize: 14 }}>👁️</span>
                  <span>Odpowiedź sprawdzi mentor</span>
                </div>
                <NarratorVoice text={narrationText} land="las_decyzji" tone="mystery" inlinePauses autoPlay />
              </div>
            )}
          </div>
        )}

        {/* Etap 3: formularz dowodu */}
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
      <Celebration active={celebrating || openBurst} />
      <TabBar current="home" />
    </PageShell>
  );
}
