/**
 * Reward / ScreenReward — ekran nagrody po ukończeniu misji.
 * 3-fazowa animacja: petale → artefakt → "awatar dojrzewa" chip.
 */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageShell from "../components/PageShell.jsx";
import { Artifact, Sparkle } from "../components/art.jsx";

export default function Reward() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const a = setTimeout(() => setPhase(1), 700);
    const b = setTimeout(() => setPhase(2), 1800);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, []);

  return (
    <PageShell sky="dawn">
      {/* Burst petals */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        {Array.from({ length: 14 }).map((_, i) => {
          const a = (i / 14) * Math.PI * 2;
          const cx = 50 + Math.cos(a) * 30;
          const cy = 38 + Math.sin(a) * 20;
          const colors = ["#FFD269", "#B886E8", "#7BC0E8", "#F08C8C", "#5FA76F"];
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${cx}%`,
                top: `${cy}%`,
                width: 14,
                height: 14,
                borderRadius: "60% 0 60% 0",
                background: colors[i % colors.length],
                transform: `rotate(${i * 32}deg)`,
                animation: `petal-fly 1.5s cubic-bezier(.34,1.56,.64,1) ${i * 0.04}s both`,
              }}
            />
          );
        })}
      </div>
      <style>{`
        @keyframes petal-fly { 0%{transform: rotate(0) scale(0); opacity:0} 60%{opacity:1} 100%{transform: rotate(720deg) scale(1) translateY(40px); opacity:0} }
        @keyframes glow-ring { 0%{transform: scale(.6); opacity:.7} 100%{transform: scale(2); opacity:0} }
        @keyframes float-art { 0%,100%{ transform: translateY(0) rotate(0)} 50%{ transform: translateY(-12px) rotate(4deg)} }
      `}</style>

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px 24px",
          gap: 14,
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: 2,
            color: "var(--p-magic-dk)",
          }}
        >
          TROP UKOŃCZONY
        </div>
        <h1
          className="t-display"
          style={{ fontSize: 42, margin: 0, color: "var(--p-magic-dk)" }}
        >
          Echo wraca!
        </h1>

        <div
          style={{
            position: "relative",
            width: 160,
            height: 160,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(255,210,105,.55), transparent 60%)",
              animation: "glow-ring 1.6s ease-out infinite",
            }}
          />
          {phase >= 1 ? (
            <div className="pop-in" style={{ animation: "float-art 3s ease-in-out infinite" }}>
              <Artifact kind="crystal" size={140} />
            </div>
          ) : (
            <Sparkle size={60} />
          )}
        </div>

        <div className="card pop-in" style={{ width: "100%", maxWidth: 380, textAlign: "left" }}>
          <div className="t-display" style={{ fontSize: 22 }}>
            Kryształ Echo
          </div>
          <div style={{ fontSize: 13, color: "var(--p-ink-soft)" }}>
            Zdobyty w Lesie Pytań · rzadki
          </div>
          <div
            className="t-hand"
            style={{ fontSize: 18, color: "var(--p-ink-soft)", marginTop: 6 }}
          >
            „Każda odpowiedź dorosłego, którą zapiszesz, dodaje światła temu kryształowi."
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, fontSize: 14, flexWrap: "wrap", justifyContent: "center" }}>
          <span className="chip amber">+3 ✦ doświadczenia</span>
          {phase >= 2 && (
            <span className="chip magic pop-in">awatar dojrzewa!</span>
          )}
        </div>

        <button
          className="btn btn-magic btn-block"
          style={{ maxWidth: 380 }}
          onClick={() => navigate("/world")}
        >
          Wróć do domu ✦
        </button>
      </div>
    </PageShell>
  );
}
