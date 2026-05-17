/**
 * MemoryGame — "Pamięć Mędrca" — klikalna mini-gra w pamięć par.
 * Z handoff Ewolucja-handoff(4)/game-memory.jsx, zaadaptowana do projektu EwolucJA:
 *  - PageShell + TopBar + TabBar zamiast inline frame
 *  - Sparkle/Cloud z naszego art.jsx
 *  - navigate("/games") po wyjściu
 *  - 3 fazy: intro → playing → done
 *  - 2 poziomy: easy (6 par 3×4) / hard (8 par 4×4)
 *  - Star rating po liczbie ruchów (<idealne+2 → 3*, <idealne+6 → 2*, inaczej 1*)
 */
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PageShell from "../components/PageShell.jsx";
import TabBar from "../components/TabBar.jsx";
import TopBar from "../components/TopBar.jsx";
import { Sparkle, Cloud, Coin } from "../components/art.jsx";
import { fx } from "../services/soundFx.js";

// ─── Game symbols (8 unique) ────────────────────────────────────
const GAME_SYMS = [
  { id: "scroll",  name: "Zwój",     c: "#A87A2A" },
  { id: "crystal", name: "Kryształ", c: "#7A4DC2" },
  { id: "coin",    name: "Moneta",   c: "#E89A3D" },
  { id: "owl",     name: "Sowa",     c: "#2E7AB8" },
  { id: "mush",    name: "Grzyb",    c: "#D45A5A" },
  { id: "star",    name: "Gwiazda",  c: "#F4C95D" },
  { id: "moon",    name: "Księżyc",  c: "#5FA76F" },
  { id: "feather", name: "Pióro",    c: "#B886E8" },
];

function GameSym({ kind, size = 42, c = "#7A4DC2" }) {
  const ic = {
    scroll: (
      <g>
        <rect x="5" y="6" width="14" height="12" rx="2" fill={c} opacity=".15" />
        <path d="M5 8h14M5 12h10M5 16h12" stroke={c} strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="20" cy="7" r="1.8" fill={c} />
      </g>
    ),
    crystal: (
      <g>
        <path d="M12 3l5 5-5 13-5-13 5-5z" fill={c} fillOpacity=".2" stroke={c} strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M7 8h10M12 3v18" stroke={c} strokeWidth="1.8" />
      </g>
    ),
    coin: (
      <g>
        <circle cx="12" cy="12" r="8" fill={c} fillOpacity=".2" stroke={c} strokeWidth="1.8" />
        <text x="12" y="16" textAnchor="middle" fontSize="11" fontWeight="900" fill={c} fontFamily="Nunito">$</text>
      </g>
    ),
    owl: (
      <g>
        <ellipse cx="12" cy="13" rx="6" ry="7" fill={c} fillOpacity=".2" stroke={c} strokeWidth="1.6" />
        <circle cx="9.5" cy="11" r="1.7" fill={c} />
        <circle cx="14.5" cy="11" r="1.7" fill={c} />
        <path d="M12 14l-1.2 1.5h2.4L12 14z" fill={c} />
      </g>
    ),
    mush: (
      <g>
        <path d="M6 13c0-3.5 2.7-6 6-6s6 2.5 6 6H6z" fill={c} fillOpacity=".2" stroke={c} strokeWidth="1.6" />
        <rect x="10" y="13" width="4" height="6" rx="1" fill={c} fillOpacity=".4" />
        <circle cx="9" cy="11" r="1" fill={c} />
        <circle cx="14" cy="10" r="1.2" fill={c} />
      </g>
    ),
    star: (
      <g>
        <path d="M12 3l2.5 6 6 .5-4.5 4.2 1.5 6.3L12 17l-5.5 3 1.5-6.3L3.5 9.5l6-.5L12 3z" fill={c} fillOpacity=".25" stroke={c} strokeWidth="1.6" strokeLinejoin="round" />
      </g>
    ),
    moon: (
      <g>
        <path d="M16 12a6 6 0 1 1-6.5-6 5 5 0 0 0 6.5 6z" fill={c} fillOpacity=".25" stroke={c} strokeWidth="1.6" />
      </g>
    ),
    feather: (
      <g>
        <path d="M18 4c-7 0-12 5-12 12l3 3 11-11c1-1 1-3 0-4s-1-0-2 0z" fill={c} fillOpacity=".2" stroke={c} strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M6 19l4-4" stroke={c} strokeWidth="1.6" strokeLinecap="round" />
      </g>
    ),
  }[kind] || null;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      {ic}
    </svg>
  );
}

// ─── Deck builder ──────────────────────────────────────────────
function makeDeck(pairs) {
  const syms = GAME_SYMS.slice(0, pairs);
  const cards = [];
  syms.forEach((s, idx) => {
    cards.push({ uid: `${s.id}-a`, sym: s, idx });
    cards.push({ uid: `${s.id}-b`, sym: s, idx });
  });
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}

// ─── Single card ───────────────────────────────────────────────
function MemCard({ card, flipped, matched, onFlip, size }) {
  const isUp = flipped || matched;
  const [displayUp, setDisplayUp] = useState(isUp);
  const [flipping, setFlipping] = useState(false);

  useEffect(() => {
    if (isUp === displayUp) return;
    setFlipping(true);
    const t = setTimeout(() => {
      setDisplayUp(isUp);
      setFlipping(false);
    }, 180);
    return () => clearTimeout(t);
  }, [isUp, displayUp]);

  return (
    <button
      onClick={() => !flipped && !matched && onFlip(card.uid)}
      style={{
        width: size, height: size, padding: 0, border: "none",
        background: "transparent", cursor: flipped || matched ? "default" : "pointer",
        opacity: matched ? 0.55 : 1,
        transition: "opacity .4s",
      }}
    >
      <div
        style={{
          width: "100%", height: "100%",
          transform: flipping ? "scaleX(0)" : "scaleX(1)",
          transition: "transform .18s ease-out",
          transformOrigin: "center",
        }}
      >
        {displayUp ? (
          <div style={{
            width: "100%", height: "100%", borderRadius: 14,
            background: matched
              ? `linear-gradient(135deg, ${card.sym.c}30, ${card.sym.c}15)`
              : "linear-gradient(180deg,#FCF5E1,#F4E3B8)",
            boxShadow: matched
              ? `inset 0 0 0 2px ${card.sym.c}88, 0 0 0 3px ${card.sym.c}33`
              : "inset 0 0 0 1.5px rgba(168,122,42,.4), 0 3px 0 rgba(120,90,30,.18), 0 6px 12px rgba(80,50,10,.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <GameSym kind={card.sym.id} size={size * 0.55} c={card.sym.c} />
          </div>
        ) : (
          <div style={{
            width: "100%", height: "100%", borderRadius: 14,
            background: "linear-gradient(135deg,#7A4DC2 0%,#4A2D80 60%,#291752 100%)",
            boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,.15), 0 3px 0 #2A1452, 0 8px 14px rgba(43,30,90,.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative", overflow: "hidden",
          }}>
            <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 60 60">
              <circle cx="30" cy="30" r="22" stroke="#FFD269" strokeWidth="1.2" fill="none" opacity=".6" />
              <circle cx="30" cy="30" r="16" stroke="#FFD269" strokeWidth="1.2" fill="none" opacity=".4" strokeDasharray="3 4" />
              <path d="M30 12l4 11 11 1-8 8 3 11-10-6-10 6 3-11-8-8 11-1 4-11z" fill="#FFD269" opacity=".75" />
            </svg>
            <div style={{ position: "absolute", top: 6, right: 8 }}><Sparkle size={10} c="#FFE7B0" /></div>
            <div style={{ position: "absolute", bottom: 6, left: 8 }}><Sparkle size={8} c="#C8A0F0" delay={0.4} /></div>
          </div>
        )}
      </div>
    </button>
  );
}

// ─── Helpers UI ────────────────────────────────────────────────
function fmtTime(s) {
  const m = Math.floor(s / 60);
  const ss = s % 60;
  return `${m}:${ss.toString().padStart(2, "0")}`;
}

function StatPill({ icon, label, value }) {
  const ic = {
    moves: <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M4 7h16M4 12h10M4 17h16" stroke="#7A4DC2" strokeWidth="2.4" strokeLinecap="round" /></svg>,
    time: <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="13" r="8" stroke="#7A4DC2" strokeWidth="2" /><path d="M12 9v4l3 2M9 3h6" stroke="#7A4DC2" strokeWidth="2" strokeLinecap="round" /></svg>,
    pairs: <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="8" height="11" rx="2" stroke="#7A4DC2" strokeWidth="2" /><rect x="13" y="9" width="8" height="11" rx="2" stroke="#7A4DC2" strokeWidth="2" /></svg>,
  }[icon];
  return (
    <div style={{
      flex: 1, padding: "8px 10px", borderRadius: 14,
      background: "rgba(255,255,255,.85)",
      boxShadow: "inset 0 0 0 1.2px rgba(122,77,194,.18)",
      display: "flex", alignItems: "center", gap: 8,
    }}>
      <span style={{
        width: 24, height: 24, borderRadius: 8,
        background: "rgba(122,77,194,.15)",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
      }}>{ic}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 9, fontWeight: 900, letterSpacing: 1, color: "var(--p-ink-soft)", textTransform: "uppercase" }}>{label}</div>
        <div className="t-display" style={{ fontSize: 15, lineHeight: 1 }}>{value}</div>
      </div>
    </div>
  );
}

function SummaryTile({ n, l }) {
  return (
    <div style={{
      padding: "10px 8px", borderRadius: 14,
      background: "rgba(255,255,255,.78)",
      boxShadow: "inset 0 0 0 1.2px rgba(43,42,74,.06)",
      display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
    }}>
      <div className="t-display" style={{ fontSize: 20, lineHeight: 1 }}>{n}</div>
      <div style={{ fontSize: 10.5, fontWeight: 800, color: "var(--p-ink-soft)", textTransform: "uppercase", letterSpacing: 0.4 }}>{l}</div>
    </div>
  );
}

function RewardItem({ icon, v, label }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, gap: 4 }}>
      {icon}
      <div className="t-display" style={{ fontSize: 18, lineHeight: 1 }}>{v}</div>
      <div style={{ fontSize: 10, fontWeight: 800, color: "var(--p-ink-soft)", letterSpacing: 0.4 }}>{label}</div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────
export default function MemoryGame() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState("intro"); // intro | playing | done
  const [diff, setDiff] = useState("easy");
  const pairs = diff === "easy" ? 6 : 8;
  const cols = 3;

  const [deck, setDeck] = useState(() => makeDeck(pairs));
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState(new Set());
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const tickRef = useRef(null);

  useEffect(() => {
    setDeck(makeDeck(pairs));
    setFlipped([]); setMatched(new Set()); setMoves(0); setSeconds(0);
  }, [pairs]);

  useEffect(() => {
    if (phase !== "playing") { clearInterval(tickRef.current); return; }
    tickRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(tickRef.current);
  }, [phase]);

  useEffect(() => {
    if (phase === "playing" && matched.size === pairs * 2) {
      try { fx.dopamine(0.5); } catch {}
      setTimeout(() => setPhase("done"), 600);
    }
  }, [matched, pairs, phase]);

  const handleFlip = (uid) => {
    if (flipped.length === 2) return;
    if (flipped.includes(uid)) return;
    try { fx.gentleMagical(0.25); } catch {}
    const next = [...flipped, uid];
    setFlipped(next);
    if (next.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = next.map((u) => deck.find((c) => c.uid === u));
      if (a.sym.id === b.sym.id) {
        setTimeout(() => {
          try { fx.dopamine(0.3); } catch {}
          setMatched((prev) => new Set([...prev, a.uid, b.uid]));
          setFlipped([]);
        }, 450);
      } else {
        setTimeout(() => setFlipped([]), 900);
      }
    }
  };

  const restart = (newDiff) => {
    if (newDiff) setDiff(newDiff);
    else setDeck(makeDeck(pairs));
    setFlipped([]); setMatched(new Set()); setMoves(0); setSeconds(0);
    setPhase("playing");
  };

  const idealMoves = pairs;
  const stars = moves <= idealMoves + 2 ? 3 : moves <= idealMoves + 6 ? 2 : 1;
  const progress = matched.size / (pairs * 2);
  const cardSize = useMemo(() => Math.floor((342 - (cols - 1) * 10) / cols), []);

  return (
    <PageShell>
      <TopBar />

      <div className="screen-scroll" style={{ flex: 1, padding: "8px 0 calc(100px + env(safe-area-inset-bottom, 0px))", display: "flex", flexDirection: "column", minHeight: 0 }}>
        <div style={{ position: "absolute", top: 80, right: -20, animation: "float-slow 6s ease-in-out infinite", zIndex: 0, pointerEvents: "none" }}><Cloud size={100} opacity={0.5} /></div>
        <div style={{ position: "absolute", bottom: 120, left: -30, animation: "float-mid 7s ease-in-out infinite", zIndex: 0, pointerEvents: "none" }}><Cloud size={80} opacity={0.4} /></div>

        {/* PLAYING — top bar with restart */}
        {phase === "playing" && (
          <div style={{ position: "relative", zIndex: 2, display: "flex", alignItems: "center", gap: 8, padding: "6px 16px 8px" }}>
            <button onClick={() => setPhase("intro")} className="btn btn-ghost btn-sm" style={{ padding: "8px 10px" }}>‹</button>
            <div style={{ flex: 1, textAlign: "center" }}>
              <div style={{ fontSize: 9, fontWeight: 900, letterSpacing: 1.4, color: "var(--p-magic-dk)", textTransform: "uppercase" }}>Gra tygodnia · 1/3</div>
              <div className="t-display" style={{ fontSize: 17, lineHeight: 1.1, marginTop: 1 }}>Pamięć Mędrca</div>
            </div>
            <button onClick={() => restart()} title="Restart" style={{
              border: "none", cursor: "pointer",
              width: 34, height: 34, borderRadius: "50%",
              background: "rgba(122,77,194,.18)",
              boxShadow: "inset 0 0 0 1.4px rgba(122,77,194,.3)",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M4 12a8 8 0 1 1 2.3 5.6M4 4v6h6" stroke="#7A4DC2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        )}

        {/* INTRO */}
        {phase === "intro" && (
          <div style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column", padding: "10px 24px 24px" }}>
            <button onClick={() => navigate("/games")} className="btn btn-ghost btn-sm" style={{ alignSelf: "flex-start", padding: "8px 14px" }}>‹ Wróć</button>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 16, gap: 10 }}>
              <div style={{ position: "relative", width: 150, height: 150 }}>
                <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,210,105,.5), transparent 65%)", filter: "blur(8px)", animation: "float-mid 4s ease-in-out infinite" }} />
                <div style={{
                  position: "absolute", inset: 14, borderRadius: "50%",
                  background: "linear-gradient(135deg,#7A4DC2 0%,#4A2D80 60%,#291752 100%)",
                  boxShadow: "0 6px 0 #2A1452, 0 20px 40px rgba(43,30,90,.5), inset 0 0 0 2px rgba(255,255,255,.12)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  animation: "float-mid 3.5s ease-in-out infinite",
                }}>
                  <svg width="76" height="76" viewBox="0 0 60 60">
                    <circle cx="30" cy="30" r="22" stroke="#FFD269" strokeWidth="1.5" fill="none" opacity=".6" />
                    <circle cx="30" cy="30" r="16" stroke="#FFD269" strokeWidth="1.2" fill="none" opacity=".4" strokeDasharray="3 4" />
                    <path d="M30 12l4 11 11 1-8 8 3 11-10-6-10 6 3-11-8-8 11-1 4-11z" fill="#FFD269" opacity=".85" />
                  </svg>
                </div>
                <div style={{ position: "absolute", top: 8, right: 18 }}><Sparkle size={16} c="#FFD269" /></div>
                <div style={{ position: "absolute", bottom: 24, left: 14 }}><Sparkle size={12} c="#C8A0F0" delay={0.4} /></div>
              </div>

              <div style={{ fontSize: 10.5, fontWeight: 900, letterSpacing: 1.6, color: "var(--p-magic-dk)", textTransform: "uppercase" }}>Gra tygodnia · #1</div>
              <h1 className="t-display" style={{ fontSize: 32, margin: 0, textShadow: "0 2px 0 rgba(255,255,255,.4)" }}>Pamięć Mędrca</h1>
              <p className="t-hand" style={{ margin: 0, fontSize: 16, color: "var(--p-ink-soft)", textAlign: "center", maxWidth: 280, lineHeight: 1.4 }}>
                Znajdź pary magicznych symboli. Im mniej ruchów, tym więcej ech ✦
              </p>
            </div>

            <div style={{ marginTop: 22 }}>
              <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: 1.4, color: "var(--p-ink-soft)", marginBottom: 8 }}>POZIOM TRUDNOŚCI</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[
                  { k: "easy", t: "Łatwy", sub: "6 par · 3×4", stars: 1 },
                  { k: "hard", t: "Średni", sub: "8 par · 4×4", stars: 2 },
                ].map((opt) => {
                  const active = diff === opt.k;
                  return (
                    <button key={opt.k} onClick={() => setDiff(opt.k)} style={{
                      border: "none", cursor: "pointer", textAlign: "left",
                      padding: "12px 14px", borderRadius: 18,
                      background: active ? "rgba(184,134,232,.22)" : "rgba(255,255,255,.78)",
                      boxShadow: active
                        ? "inset 0 0 0 2.5px var(--p-magic-dk), 0 4px 14px rgba(122,77,194,.2)"
                        : "inset 0 0 0 1.4px rgba(43,42,74,.08)",
                    }}>
                      <div className="t-display" style={{ fontSize: 18, lineHeight: 1 }}>{opt.t}</div>
                      <div style={{ fontSize: 12, color: "var(--p-ink-soft)", fontWeight: 700, marginTop: 2 }}>{opt.sub}</div>
                      <div style={{ display: "flex", gap: 2, marginTop: 6 }}>
                        {[1, 2, 3].map((i) => (
                          <svg key={i} width="12" height="12" viewBox="0 0 24 24">
                            <path d="M12 2l2.5 6 6 .5-4.5 4.2 1.5 6.3L12 17l-5.5 3 1.5-6.3L3.5 9.5l6-.5L12 2z"
                              fill={i <= opt.stars ? "#E89A3D" : "rgba(43,42,74,.15)"} />
                          </svg>
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ marginTop: 14, padding: "12px 14px", borderRadius: 14, background: "linear-gradient(180deg, #FCF5E1 0%, #F4E3B8 100%)", boxShadow: "inset 0 0 0 1.5px rgba(168,122,42,.25)", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: 1.4, color: "#A87A2A" }}>NAGRODY</span>
              <span style={{ flex: 1 }} />
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12.5, fontWeight: 900, color: "#4A2A0E" }}>
                <Coin size={16} /> 10
              </span>
              <span style={{ fontSize: 13, color: "#7A4DC2", fontWeight: 900 }}>✦</span>
              <span style={{ fontSize: 11, color: "var(--p-magic-dk)", fontWeight: 900 }}>+1 Skupienie</span>
            </div>

            <div style={{ flex: 1 }} />

            <button onClick={() => restart()} className="btn btn-magic btn-block" style={{ marginTop: 14 }}>
              <span style={{ fontSize: 18 }}>✦</span> Zagraj
            </button>
          </div>
        )}

        {/* PLAYING — grid */}
        {phase === "playing" && (
          <>
            <div style={{ position: "relative", zIndex: 1, padding: "4px 18px 8px", display: "flex", gap: 10 }}>
              <StatPill icon="moves" label="Ruchy" value={moves} />
              <StatPill icon="time" label="Czas" value={fmtTime(seconds)} />
              <StatPill icon="pairs" label="Pary" value={`${matched.size / 2}/${pairs}`} />
            </div>
            <div style={{ position: "relative", zIndex: 1, padding: "0 18px 4px" }}>
              <div className="prog magic" style={{ height: 6 }}>
                <i style={{ width: `${progress * 100}%` }} />
              </div>
            </div>
            <div style={{
              position: "relative", zIndex: 1, flex: 1,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              padding: "12px 18px 8px",
            }}>
              <div style={{
                display: "grid",
                gridTemplateColumns: `repeat(${cols}, ${cardSize}px)`,
                gridAutoRows: `${cardSize}px`,
                gap: 10,
              }}>
                {deck.map((card) => (
                  <MemCard key={card.uid}
                    card={card}
                    flipped={flipped.includes(card.uid)}
                    matched={matched.has(card.uid)}
                    onFlip={handleFlip}
                    size={cardSize}
                  />
                ))}
              </div>
              <div style={{ marginTop: 14, fontSize: 12, color: "var(--p-ink-soft)", fontWeight: 700, textAlign: "center", maxWidth: 280, lineHeight: 1.4 }}>
                Odkryj dwie karty z tym samym symbolem.<br />
                <b style={{ color: "var(--p-magic-dk)" }}>{idealMoves + 2}</b> ruchów = 3 gwiazdki ★★★
              </div>
            </div>
          </>
        )}

        {/* DONE */}
        {phase === "done" && (
          <div style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column", padding: "20px 24px 24px" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
              <div className="pop-in" style={{ display: "flex", gap: 8 }}>
                {[1, 2, 3].map((i) => {
                  const earned = i <= stars;
                  return (
                    <div key={i} style={{
                      width: earned ? 56 : 44, height: earned ? 56 : 44,
                      borderRadius: "50%",
                      background: earned ? "radial-gradient(circle at 35% 30%, #FFE7B0, #E89A3D)" : "rgba(255,255,255,.6)",
                      boxShadow: earned ? "0 4px 0 #B47322, 0 10px 22px rgba(232,154,61,.5)" : "inset 0 0 0 1.5px rgba(43,42,74,.12)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transform: `translateY(${i === 2 ? -6 : 0}px)`,
                      transition: "all .3s",
                    }}>
                      <svg width={earned ? 32 : 26} height={earned ? 32 : 26} viewBox="0 0 24 24">
                        <path d="M12 3l2.5 6 6 .5-4.5 4.2 1.5 6.3L12 17l-5.5 3 1.5-6.3L3.5 9.5l6-.5L12 3z"
                          fill={earned ? "#fff" : "rgba(43,42,74,.18)"}
                          stroke={earned ? "#fff" : "rgba(43,42,74,.2)"}
                          strokeWidth="1" strokeLinejoin="round" />
                      </svg>
                    </div>
                  );
                })}
              </div>

              <div style={{ fontSize: 10.5, fontWeight: 900, letterSpacing: 1.6, color: "var(--p-magic-dk)", textTransform: "uppercase", marginTop: 6 }}>Pamięć Mędrca · ukończona</div>
              <h1 className="t-display" style={{ fontSize: 32, margin: "2px 0 0", textShadow: "0 2px 0 rgba(255,255,255,.4)" }}>
                {stars === 3 ? "Wspaniale!" : stars === 2 ? "Super!" : "Brawo!"}
              </h1>
              <p className="t-hand" style={{ margin: 0, fontSize: 16, color: "var(--p-ink-soft)", textAlign: "center" }}>
                {stars === 3 ? "Twoja pamięć jest jak zwój Mędrca." :
                 stars === 2 ? "Niezła robota — spróbuj jeszcze raz!" :
                              "Każdy ruch to krok do wprawy."}
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, width: "100%", marginTop: 6 }}>
                <SummaryTile n={moves} l="ruchy" />
                <SummaryTile n={fmtTime(seconds)} l="czas" />
                <SummaryTile n={`${matched.size / 2}/${pairs}`} l="pary" />
              </div>

              <div style={{ padding: "14px 14px", width: "100%", marginTop: 6, borderRadius: 14, background: "linear-gradient(180deg, #FCF5E1 0%, #F4E3B8 100%)", boxShadow: "inset 0 0 0 1.5px rgba(168,122,42,.25)" }}>
                <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: 1.6, color: "#A87A2A", marginBottom: 8 }}>OTRZYMUJESZ</div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "space-between" }}>
                  <RewardItem icon={<Coin size={26} />} v={5 + stars * 3} label="monet" />
                  <RewardItem icon={<span style={{ fontSize: 24, color: "#FFD269" }}>✦</span>} v={stars} label="ech" />
                  <RewardItem icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#7A4DC2" strokeWidth="2" /><circle cx="12" cy="12" r="5" stroke="#7A4DC2" strokeWidth="2" /><circle cx="12" cy="12" r="1.5" fill="#7A4DC2" /></svg>} v="+1" label="Skupienie" />
                </div>
              </div>
            </div>

            <div style={{ flex: 1 }} />

            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              <button onClick={() => restart()} className="btn btn-ghost btn-block" style={{ flex: 1, color: "var(--p-ink)" }}>
                Zagraj ponownie
              </button>
              <button onClick={() => navigate("/games")} className="btn btn-magic btn-block" style={{ flex: 1.2 }}>
                Wróć do gier ✦
              </button>
            </div>
          </div>
        )}
      </div>

      <TabBar current="games" />
    </PageShell>
  );
}
