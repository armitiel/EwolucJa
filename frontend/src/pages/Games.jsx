/**
 * Games / ScreenGames — 3 gry tygodniowe (digital mini-wyzwania).
 * Mockup: liste 3 karty + progress + nagrody za ukonczenie.
 */
import React from "react";
import { useNavigate } from "react-router-dom";
import PageShell from "../components/PageShell.jsx";
import TabBar from "../components/TabBar.jsx";
import TopBar from "../components/TopBar.jsx";
import { Coin, Sparkle } from "../components/art.jsx";

const GAMES = [
  {
    id: "memory",
    title: "Pamięć Detektywa",
    desc: "Znajdź pary symboli ukrytych w mgle Lasu Pytań.",
    emoji: "🧠",
    bg: "linear-gradient(135deg,#FFE0B5,#FFD269)",
    accent: "#E89A3D",
    duration: "3 min",
    coins: 10,
    xp: 1,
    state: "available",
  },
  {
    id: "echo-puzzle",
    title: "Echo Słów",
    desc: "Ułóż słowa z liter, które niesie wiatr znad Morza Słów.",
    emoji: "🔤",
    bg: "linear-gradient(135deg,#C9E9FF,#7BC0E8)",
    accent: "#3F8BC2",
    duration: "5 min",
    coins: 12,
    xp: 1,
    state: "available",
  },
  {
    id: "trap-tropiciela",
    title: "Trop Tropiciela",
    desc: "Idź ścieżką dedukcji — wybierz właściwy znak na rozdrożu.",
    emoji: "🔍",
    bg: "linear-gradient(135deg,#E6D6FA,#B886E8)",
    accent: "#7A4DC2",
    duration: "4 min",
    coins: 14,
    xp: 2,
    state: "locked",
  },
];

export default function Games() {
  const navigate = useNavigate();
  const done = 0;
  const total = GAMES.length;
  const pct = Math.round((done / total) * 100);
  const totalCoinsAvail = GAMES.reduce((s, g) => s + g.coins, 0);

  return (
    <PageShell>
      <TopBar />

      <div
        style={{
          flex: 1,
          padding: "8px 14px 14px",
          display: "flex",
          flexDirection: "column",
          gap: 14,
          overflowY: "auto",
          minHeight: 0,
        }}
      >
        {/* Pasek postepu */}
        <div className="card" style={{ padding: "12px 14px" }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 8 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.5, color: "var(--p-magic-dk)" }}>POSTĘP</div>
              <div className="t-display" style={{ fontSize: 18, marginTop: 2 }}>{done} z {total} gier</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#C2851E", fontWeight: 800, fontSize: 13 }}>
              <Coin size={18} /> <span>+{totalCoinsAvail} do zdobycia</span>
            </div>
          </div>
          <div className="prog magic"><i style={{ width: `${pct}%` }} /></div>
          <p style={{ margin: "8px 0 0", fontSize: 12, color: "var(--p-ink-soft)" }}>
            Skończ wszystkie 3 gry żeby odblokować Skarb Cyklu ✦
          </p>
        </div>

        {/* Karty gier */}
        {GAMES.map((g, idx) => {
          const locked = g.state === "locked";
          return (
            <button
              key={g.id}
              onClick={() => !locked && alert(`Gra "${g.title}" — wkrótce!`)}
              disabled={locked}
              style={{
                border: "none",
                background: "transparent",
                padding: 0,
                cursor: locked ? "default" : "pointer",
                textAlign: "left",
                position: "relative",
              }}
            >
              <div
                className="card"
                style={{
                  padding: "14px 14px",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  background: locked ? "rgba(78,77,118,.08)" : g.bg,
                  filter: locked ? "grayscale(.6)" : "none",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: 62,
                    height: 62,
                    flex: "none",
                    borderRadius: 18,
                    background: "rgba(255,255,255,.7)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 32,
                    boxShadow: `inset 0 0 0 2px ${g.accent}33`,
                    animation: locked ? "none" : `float-mid ${3 + idx * 0.4}s ease-in-out infinite`,
                  }}
                >
                  {locked ? "🔒" : g.emoji}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.2, color: g.accent }}>
                    GRA #{idx + 1} · {g.duration}
                  </div>
                  <h3 className="t-display" style={{ fontSize: 19, margin: "2px 0 4px", lineHeight: 1.15 }}>
                    {g.title}
                  </h3>
                  <p style={{ margin: 0, fontSize: 12, color: "var(--p-ink-soft)", lineHeight: 1.3 }}>
                    {g.desc}
                  </p>
                  <div style={{ display: "flex", gap: 6, marginTop: 7, alignItems: "center" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        background: "rgba(255,255,255,.85)",
                        color: "#7A4D10",
                        fontWeight: 800,
                        fontSize: 11,
                        padding: "2px 8px",
                        borderRadius: 999,
                        boxShadow: "inset 0 0 0 1.2px #E1B66A",
                      }}
                    >
                      <Coin size={12} /> +{g.coins}
                    </span>
                    <span className="chip magic" style={{ fontSize: 11, padding: "2px 8px" }}>
                      +{g.xp} ✦
                    </span>
                    {locked && (
                      <span className="chip" style={{ background: "rgba(78,77,118,.12)", fontSize: 11, padding: "2px 8px" }}>
                        🔒 ukończ poprzednią
                      </span>
                    )}
                  </div>
                </div>
                <span style={{ fontSize: 28, color: g.accent, fontWeight: 700, opacity: locked ? 0.3 : 1 }}>›</span>
              </div>
              {!locked && idx === 0 && (
                <>
                  <div style={{ position: "absolute", top: -6, right: 16 }}>
                    <Sparkle size={18} />
                  </div>
                  <div style={{ position: "absolute", bottom: -2, left: 22 }}>
                    <Sparkle size={12} delay={0.5} />
                  </div>
                </>
              )}
            </button>
          );
        })}

        <p style={{ fontSize: 12, color: "var(--p-ink-soft)", textAlign: "center", margin: "4px 0 8px", fontStyle: "italic" }}>
          Każda ukończona gra dorzuca monety do Twojego skarbca ✦
        </p>
      </div>

      <TabBar current="home" />
    </PageShell>
  );
}
