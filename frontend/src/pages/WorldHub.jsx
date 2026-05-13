/**
 * WorldHub / ScreenHome — ekran "Dom" w stylu Ghibli/Claymorphism.
 * Wielki wizard u gory + powitanie + zegar cyklu + karta zwoju misji + karta Komnaty.
 */
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { api, session } from "../services/api.js";
import { ARCHETYPES, timeUntilFriday } from "../config.js";
import NarratorVoice from "../components/NarratorVoice.jsx";
import PageShell from "../components/PageShell.jsx";
import Loading from "../components/Loading.jsx";
import TabBar from "../components/TabBar.jsx";
import { Sparkle, Coin, CoinPill, Avatar } from "../components/art.jsx";

// ─── WeekProgress — pasek 7-dniowy + monety + streak ───
// Rozpoznaje aktualny dzien tygodnia (PN=0..ND=6) i koloruje:
//   - dni przed dzisiejszym = zlote monety (ukonczone)
//   - dzien dzisiejszy      = fioletowy ring (todayIndex)
//   - dni przyszle          = puste kola
function WeekProgress({ done = null, coins = 0, streak = 0, goal = 7, todayIndex = null, cycleLabel = null, remainingText = null }) {
  const days = ["PN", "WT", "ŚR", "CZ", "PT", "SO", "ND"];
  // Auto-detekcja PL: getDay() => Sun=0..Sat=6, my chcemy Mon=0..Sun=6.
  const computedToday = todayIndex != null ? todayIndex : ((new Date().getDay() + 6) % 7);
  // Jesli nie podano "done", domyslnie zalozmy ze gracz ukonczyl wszystkie poprzednie dni (todayIndex)
  const computedDone = done != null ? done : computedToday;
  const pct = Math.round((computedDone / goal) * 100);

  return (
    <div className="card" style={{ padding: "14px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <div className="t-display" style={{ fontSize: 20 }}>{computedDone}/{goal}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#C2851E", fontWeight: 800, fontSize: 13 }}>
          <Coin size={18} /> <span>+{coins}</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6, marginTop: 2 }}>
        {days.map((d, i) => {
          const isDone = i < computedDone;
          const isToday = i === computedToday && !isDone;
          const isFuture = i > computedToday;
          return (
            <div key={d} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div
                style={{
                  width: 32, height: 32, borderRadius: "50%", position: "relative",
                  background: isDone
                    ? "linear-gradient(180deg,#FFD269,#E89A3D)"
                    : isToday ? "rgba(184,134,232,.20)" : "rgba(255,255,255,.55)",
                  boxShadow: isDone
                    ? "0 2px 0 #B47322, 0 3px 8px rgba(232,154,61,.45)"
                    : isToday
                    ? "inset 0 0 0 2.2px var(--p-magic-dk), 0 0 0 4px rgba(184,134,232,.18)"
                    : "inset 0 0 0 1.4px rgba(78,77,118,.10)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  animation: isDone
                    ? `wk-bump .5s ${i * 0.06}s cubic-bezier(.34,1.56,.64,1) both`
                    : isToday
                    ? "pulse-dot 2.4s ease-in-out infinite"
                    : "none",
                  opacity: isFuture ? 0.7 : 1,
                }}
              >
                {isDone && <Coin size={20} />}
                {isToday && <span style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--p-magic-dk)" }} />}
              </div>
              <div
                style={{
                  fontSize: 10, fontWeight: 800, letterSpacing: 0.5,
                  color: isToday ? "var(--p-magic-dk)" : isDone ? "#7A4D10" : "var(--p-ink-soft)",
                  opacity: isFuture ? 0.55 : 1,
                }}
              >
                {d}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12 }}>
        <div style={{ flex: 1 }}>
          <div className="prog magic"><i style={{ width: `${pct}%` }} /></div>
        </div>
        <div
          style={{
            display: "flex", alignItems: "center", gap: 5,
            background: "linear-gradient(180deg,#FFC178,#E8632D)", color: "#fff",
            padding: "5px 11px", borderRadius: 999, fontSize: 13, fontWeight: 800,
            boxShadow: "0 2px 0 #A03A12, 0 3px 8px rgba(232,99,45,.45)",
          }}
          title="seria dni z rzedu"
        >
          <span style={{ display: "inline-block", animation: "streak-flame 1.4s ease-in-out infinite", transformOrigin: "50% 80%" }}>🔥</span>
          <span>{streak} dni</span>
        </div>
      </div>

      {remainingText && (
        <div style={{ marginTop: 8, fontSize: 12, color: "var(--p-ink-soft)", textAlign: "center", fontWeight: 600 }}>
          ⌛ {remainingText}
        </div>
      )}
    </div>
  );
}

// Zegar cyklu — radialny pasek postepu 1..N dni z nazwa i odliczeniem.
function CycleClock({ days = 5, dayIndex = 1, label = "Wieża Pytań", remainingText = "" }) {
  const r = 38;
  const C = 2 * Math.PI * r;
  const progress = Math.min(dayIndex / days, 1);
  const dash = `${C * progress} ${C}`;
  return (
    <div className="card" style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px" }}>
      <div style={{ position: "relative", width: 96, height: 96, flex: "none" }}>
        <svg viewBox="0 0 100 100" width="96" height="96" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="50" cy="50" r={r} fill="rgba(255,255,255,.65)" stroke="rgba(122,77,194,.18)" strokeWidth="6" />
          <circle cx="50" cy="50" r={r} fill="none" stroke="url(#cg)" strokeWidth="6" strokeLinecap="round" strokeDasharray={dash} />
          {Array.from({ length: days }).map((_, i) => {
            const a = (i / days) * Math.PI * 2;
            const x = 50 + Math.cos(a) * r;
            const y = 50 + Math.sin(a) * r;
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={i < dayIndex ? 4 : 3}
                fill={i < dayIndex ? "#7A4DC2" : "#fff"}
                stroke="#7A4DC2"
                strokeWidth="1.5"
              />
            );
          })}
          <defs>
            <linearGradient id="cg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#FFD269" />
              <stop offset="1" stopColor="#B886E8" />
            </linearGradient>
          </defs>
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div className="t-display" style={{ fontSize: 24, lineHeight: 1 }}>
            {dayIndex}
            <span style={{ fontSize: 14, color: "var(--p-ink-soft)" }}>/{days}</span>
          </div>
          <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 1, color: "var(--p-ink-soft)" }}>DZIEŃ</div>
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.5, color: "var(--p-ink-soft)" }}>
          CYKL · {days === 3 ? "SZYBKI" : days === 7 ? "DŁUGI" : "ŚREDNI"}
        </div>
        <div className="t-display" style={{ fontSize: 22, margin: "2px 0 0" }}>
          {label}
        </div>
        {remainingText && (
          <div style={{ fontSize: 13, color: "var(--p-ink-soft)", marginTop: 4 }}>
            {remainingText} ✦
          </div>
        )}
      </div>
    </div>
  );
}

export default function WorldHub() {
  const navigate = useNavigate();
  const [player, setPlayer] = useState(null);
  const [cycle, setCycle] = useState(null);
  const [mission, setMission] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const id = session.getPlayer();
    if (!id) {
      navigate("/onboarding");
      return;
    }
    (async () => {
      try {
        const p = await api.getPlayer(id);
        setPlayer(p);
        try {
          setCycle(await api.getCurrentCycle(id));
        } catch {}
        try {
          setMission(await api.getCurrentMission(id));
        } catch {
          try {
            setMission(await api.generateMission(id));
          } catch {}
        }
      } catch (e) {
        setError(e.message);
      }
    })();
  }, [navigate]);

  const friday = cycle ? timeUntilFriday(cycle.friday_deadline) : null;

  // Cykl 5-dniowy (Pn-Pt). Liczymy dayIndex z postepu pomiedzy started_at a friday_deadline.
  const { dayIndex, days } = useMemo(() => {
    const totalDays = 5;
    if (!cycle) return { dayIndex: 1, days: totalDays };
    const start = new Date(cycle.started_at).getTime();
    const end = new Date(cycle.friday_deadline).getTime();
    const now = Date.now();
    const total = Math.max(end - start, 1);
    const ratio = Math.max(0, Math.min(1, (now - start) / total));
    return { dayIndex: Math.max(1, Math.round(ratio * totalDays)), days: totalDays };
  }, [cycle]);

  const greeting = useMemo(() => {
    if (!player) return "";
    const parts = [`Witaj z powrotem… ${player.player_name}.`];
    if (mission) parts.push(`Twoja misja na ten tydzień — ${mission.title}.`);
    if (friday && !friday.passed) parts.push(`Mamy czas… zostało jeszcze ${friday.label}.`);
    return parts.join(" ");
  }, [player, mission, friday]);

  if (error) {
    return (
      <PageShell>
        <div style={{ padding: 40 }}>
          <p style={{ color: "#B85B47" }}>{error}</p>
        </div>
      </PageShell>
    );
  }
  if (!player) return <Loading text="Otwieranie Kroniki…" />;

  // Skarbiec — liczone z lifetime_scores