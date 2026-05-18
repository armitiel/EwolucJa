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
    title: "Pamięć Mędrca",
    desc: "Znajdź pary magicznych symboli — im mniej ruchów, tym więcej ech.",
    emoji: "🧠",
    bg: "linear-gradient(135deg,#FFE0B5,#FFD269)",
    accent: "#E89A3D",
    duration: "3 min",
    coins: 10,
    xp: 1,
    state: "available",
    route: "/games/memory",
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

  return (
    <PageShell>
      <TopBar />

      {/* Delikatne pulsowanie samego emoji (tlo ikonki stoi w miejscu) */}
      <style>{`
        @keyframes gIconPulse {
          0%, 100% { transform: scale(1); }
          50%      { transform: scale(1.08); }
        }
      `}</style>

      <div
        className="screen-scroll"
        style={{
          flex: 1,
          padding: "12px 18px 52px",
          display: "flex",
          flexDirection: "column",
          gap: 14,
          minHeight: 0,
        }}
      >
        {/* Header spojny z Porady - maly caps label + duzy h1 "Gry" */}
        <div style={{ opacity: 0, animation: "el-up .55s ease 0s forwards", padding: "2px 2px 0" }}>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.8, color: "var(--p-magic-dk)", textTransform: "uppercase" }}>
            Wyprawa Tygodnia
          </div>
          <h1 className="t-display" style={{ fontSize: 28, margin: "2px 0 0", lineHeight: 1, color: "var(--p-ink)" }}>
            Gry
          </h1>
        </div>

        {/* Grid 2-kolumnowy: kompaktowe kafle gier (ikona + tytul + monety) */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          marginTop: 4,
        }}>
          {GAMES.map((g, idx) => {
            const locked = g.state === "locked";
            return (
              <button
                key={g.id}
                onClick={() => {
                  if (locked) return;
                  if (g.route) navigate(g.route);
                  else alert(`Gra "${g.title}" — wkrótce!`);
                }}
                disabled={locked}
                className="pop-in"
                style={{
                  border: "none",
                  padding: 0,
                  cursor: locked ? "default" : "pointer",
                  textAlign: "center",
                  background: "transparent",
                  animationDelay: `${idx * 80}ms`,
                }}
              >
                <div
                  className="card"
                  style={{
                    padding: "16px 12px 14px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 10,
                    background: locked ? "rgba(78,77,118,.08)" : g.bg,
                    filter: locked ? "grayscale(.6)" : "none",
                    position: "relative",
                    overflow: "hidden",
                    minHeight: 150,
                  }}
                >
                  {/* Tlo ikonki stoi nieruchomo - pulsuje tylko samo emoji w srodku */}
                  <div
                    style={{
                      width: 72,
                      height: 72,
                      flex: "none",
                      borderRadius: 22,
                      background: "rgba(255,255,255,.85)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: `inset 0 0 0 2px ${g.accent}33`,
                    }}
                  >
                    <span style={{
                      fontSize: 38, display: "inline-block",
                      animation: locked ? "none" : `gIconPulse ${2.4 + idx * 0.3}s ease-in-out infinite`,
                      animationDelay: `${idx * 0.4}s`,
                    }}>
                      {locked ? "🔒" : g.emoji}
                    </span>
                  </div>

                  {/* Nazwa gry */}
                  <h3 className="t-display" style={{
                    fontSize: 16, margin: 0, lineHeight: 1.15, color: "var(--p-ink)", textAlign: "center",
                  }}>
                    {g.title}
                  </h3>

                  {/* Mozliwa wygrana - chip z monetami (jedyna informacja oprocz tytulu) */}
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      background: "rgba(255,255,255,.9)",
                      color: "#7A4D10",
                      fontWeight: 800,
                      fontSize: 12,
                      padding: "3px 10px",
                      borderRadius: 999,
                      boxShadow: "inset 0 0 0 1.2px #E1B66A",
                    }}
                  >
                    <Coin size={14} /> +{g.coins}
                  </span>
                </div>
                {!locked && idx === 0 && (
                  <div style={{ position: "absolute", top: -6, right: 12, pointerEvents: "none" }}>
                    <Sparkle size={18} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <TabBar current="games" />
    </PageShell>
  );
}
