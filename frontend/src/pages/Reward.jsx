/**
 * Reward — ekran nagrody po wyslaniu odpowiedzi na "Zadanie w realu".
 * Wzorowany na CelebrationThenArchetype z Onboarding: animowany licznik monet 0→N,
 * konfetti, sparkles, dymek od mentora. NIE pokazujemy artefaktu (Pieczec Medrca)
 * - zostaje sam efekt zdobycia coinow + ciepla wiadomosc + CTA "Dziekuje".
 *
 * Punktacja: per game-design v2, submit daje +5 coinow auto. Mentor moze potem przyznac dodatkowe 15-40.
 */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageShell from "../components/PageShell.jsx";
import { Sparkle, Coin } from "../components/art.jsx";
import { fx } from "../services/soundFx.js";
import MentorBubble from "../components/MentorBubble.jsx";

const REWARD = 5; // +5 coinow za sam submit (kolejne 15-40 przyjda po verify mentora)
const DWELL_MS = 1800;

export default function Reward() {
  const navigate = useNavigate();
  const [coinCount, setCoinCount] = useState(0);

  useEffect(() => {
    try { fx.gentleMagical(0.7); } catch {}
    try { fx.dopamine(0.5); } catch {}
    // Animowany licznik 0 → REWARD w 1.8s
    const start = Date.now();
    const tick = setInterval(() => {
      const t = Math.min(1, (Date.now() - start) / DWELL_MS);
      setCoinCount(Math.round(REWARD * t));
      if (t >= 1) clearInterval(tick);
    }, 40);
    return () => clearInterval(tick);
  }, []);

  const colors = ["#FFD269", "#B886E8", "#7BC0E8", "#F08C8C", "#5FA76F", "#FFB347"];
  const PIECES = 36;

  return (
    <PageShell sky="dawn">
      <div
        className="pop-in"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 18,
          padding: "40px 22px 28px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Konfetti spadajace 3.2s loop */}
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
          {Array.from({ length: PIECES }).map((_, i) => {
            const left = (i * 137) % 100;
            const delay = (i % 12) * 0.15;
            const dur = 2.4 + (i % 5) * 0.4;
            const sz = 8 + (i % 4) * 3;
            const drift = -30 + ((i * 31) % 60);
            const rot = (i * 47) % 360;
            const color = colors[i % colors.length];
            const shape = i % 3;
            const radius = shape === 0 ? "50%" : shape === 1 ? "3px" : "60% 0 60% 0";
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: `${left}%`,
                  top: "-20px",
                  width: sz,
                  height: sz,
                  background: color,
                  borderRadius: radius,
                  transform: `rotate(${rot}deg)`,
                  animation: `confetti-fall ${dur}s linear ${delay}s infinite`,
                  ["--tx"]: `${drift}px`,
                  opacity: 0.85,
                }}
              />
            );
          })}
        </div>

        {/* Sparkle burst dookola pigulki monet (jednorazowy) */}
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i / 12) * Math.PI * 2;
            const cx = 50 + Math.cos(a) * 22;
            const cy = 42 + Math.sin(a) * 16;
            return (
              <div
                key={`b${i}`}
                style={{
                  position: "absolute",
                  left: `${cx}%`,
                  top: `${cy}%`,
                  width: 14, height: 14,
                  borderRadius: "60% 0 60% 0",
                  background: colors[i % colors.length],
                  transform: `rotate(${i * 32}deg)`,
                  animation: `petal-fly 1.6s cubic-bezier(.34,1.56,.64,1) ${i * 0.05}s both`,
                }}
              />
            );
          })}
        </div>

        {/* Naglowek */}
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 2, color: "var(--p-magic-dk)", position: "relative", zIndex: 1 }}>
          ✨ ZADANIE W REALU WYSŁANE
        </div>
        <h1
          className="t-display"
          style={{
            fontSize: 40, margin: 0,
            color: "var(--p-magic-dk)",
            lineHeight: 1.1,
            textAlign: "center",
            position: "relative", zIndex: 1,
          }}
        >
          Świetna robota!
        </h1>

        {/* Pigulka monet z animowanym licznikiem - skopiowany pattern z Onboarding */}
        <div style={{ margin: "10px 0", position: "relative", animation: "coin-tally .6s ease-out", zIndex: 1 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              background: "linear-gradient(180deg,#FFF1B0,#FFD269)",
              color: "#7A4D10",
              fontWeight: 800,
              fontSize: 40,
              padding: "18px 32px",
              borderRadius: 999,
              boxShadow: "inset 0 0 0 2.5px #E1B66A, 0 8px 20px rgba(160,110,30,.35), 0 0 60px rgba(255,210,105,.55)",
              fontFamily: "var(--font-display, 'Baloo 2'), sans-serif",
            }}
          >
            <Coin size={48} anim />
            <span style={{ lineHeight: 1 }}>+{coinCount}</span>
          </div>
          <div style={{ position: "absolute", top: -12, right: -16 }}>
            <Sparkle size={28} />
          </div>
          <div style={{ position: "absolute", bottom: -10, left: -12 }}>
            <Sparkle size={20} delay={0.4} />
          </div>
        </div>

        {/* Wiadomosc od Mentora w dymku z glowa */}
        <div style={{ width: "100%", maxWidth: 360, position: "relative", zIndex: 1 }}>
          <MentorBubble
            title="Mentor"
            text="Twoja odpowiedź jest sprawdzana. Wkrótce docenię Twój wysiłek dodatkowymi monetami ✦"
            tone="magic"
            size="md"
          />
        </div>

        {/* CTA - Dziekuje */}
        <button
          className="btn btn-magic btn-block"
          style={{ maxWidth: 360, marginTop: 6, position: "relative", zIndex: 1 }}
          onClick={() => navigate("/swiat")}
        >
          Dziękuję ✦
        </button>
      </div>
    </PageShell>
  );
}
