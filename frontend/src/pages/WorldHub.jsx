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

// ─── WeekProgress — pasek 7-dniowy + monety + streak + Skarb tygodnia ───
function WeekProgress({ done = 0, coins = 0, streak = 0, goal = 7 }) {
  const days = ["PN", "WT", "ŚR", "CZ", "PT", "SO", "ND"];
  const pct = Math.round((done / goal) * 100);
  return (
    <div className="card" style={{ padding: "14px 16px" }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 8 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.5, color: "var(--p-magic-dk)" }}>POSTĘP TYGODNIA</div>
          <div className="t-display" style={{ fontSize: 18, marginTop: 2 }}>{done} z {goal} zadań</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#C2851E", fontWeight: 800, fontSize: 13 }}>
          <Coin size={18} /> <span>+{coins} w tym tyg.</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6, marginTop: 2 }}>
        {days.map((d, i) => {
          const isDone = i < done;
          const isToday = i === done && done < goal;
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
                    : isToday ? "inset 0 0 0 2.2px var(--p-magic-dk)" : "inset 0 0 0 1.4px rgba(43,42,74,.10)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  animation: isDone ? `wk-bump .5s ${i * 0.06}s cubic-bezier(.34,1.56,.64,1) both` : "none",
                }}
              >
                {isDone && <Coin size={20} />}
                {isToday && <span style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--p-magic-dk)" }} />}
              </div>
              <div
                style={{
                  fontSize: 10, fontWeight: 800, letterSpacing: 0.5,
                  color: isToday ? "var(--p-magic-dk)" : "var(--p-ink-soft)",
                  opacity: isDone ? 1 : 0.7,
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
          <div style={{ fontSize: 10, fontWeight: 800, color: "var(--p-ink-soft)", marginTop: 4, letterSpacing: 0.5 }}>
            {done >= goal
              ? "TYDZIEŃ UKOŃCZONY ✦"
              : `JESZCZE ${goal - done} ${goal - done === 1 ? "ZADANIE" : (goal - done < 5 ? "ZADANIA" : "ZADAŃ")} DO SKARBU`}
          </div>
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

      <div
        style={{
          marginTop: 10, padding: "8px 10px", borderRadius: 14,
          background: done >= goal ? "linear-gradient(135deg,#FFE7B0,#FFD269)" : "rgba(122,77,194,.10)",
          display: "flex", alignItems: "center", gap: 10,
        }}
      >
        <div style={{ fontSize: 22, animation: done >= goal ? "wiggle .8s ease-in-out infinite" : "none", flex: "none" }}>
          {done >= goal ? "🎁" : "📜"}
        </div>
        <div style={{ flex: 1, fontSize: 12, color: "var(--p-ink-soft)", fontWeight: 600, lineHeight: 1.3 }}>
          {done >= goal ? (
            <><b style={{ color: "#7A4D10" }}>Skarb tygodnia odblokowany!</b> Odbierz +50 monet i artefakt cykli.</>
          ) : (
            <><b style={{ color: "var(--p-magic-dk)" }}>Skarb tygodnia:</b> +50 monet · rzadki artefakt · ewolucja</>
          )}
        </div>
      </div>
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

  // Skarbiec — liczone z lifetime_scores + backpack (placeholder logika)
  const totalCoins = ((player.lifetime_scores?.DT || 0) + (player.lifetime_scores?.EM || 0)) * 10 + 12;
  const weekDone = Math.min(7, (player.backpack || []).length);
  const weekCoins = weekDone * 12;
  const streak = (player.scores?.streak || 0) + Math.max(1, weekDone);

  // Archetyp + avatar
  const archetypeKey = player.archetype || "tropiciel_tajemnic";
  const archetypeLabel = (ARCHETYPES[archetypeKey]?.name || "Tropiciel").toUpperCase();
  const avatarKind = player.avatar_kind || "fox";

  // Postepy do progress barow na kaflach (Mapa: ile krain odblokowano /6, Plecak: artefakty)
  const regionsUnlocked = 1; // tylko Las Pytan w MVP
  const totalRegions = 6;
  const backpackItems = (player.backpack || []).length;
  const backpackGoal = 12;

  return (
    <PageShell>
      {/* Sticky topbar — avatar/imie/archetyp + sterowanie lektorem + CoinPill */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "12px 14px 8px",
          position: "relative",
          zIndex: 5,
        }}
      >
        <div style={{ flexShrink: 0 }}>
          <Avatar kind={avatarKind} size={48} evolved={1} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.5, color: "var(--p-magic-dk)" }}>
            {archetypeLabel}
          </div>
          <div
            className="t-display"
            style={{ fontSize: 20, lineHeight: 1.1, color: "var(--p-ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
          >
            {player.player_name}
          </div>
        </div>
        {/* Sterowanie lektorem (play/stop + mute) */}
        <div style={{ flexShrink: 0 }}>
          <NarratorVoice
            text={greeting}
            land="dolina_selfie"
            tone="calm"
            speed={0.86}
            pauseBefore={500}
            inlinePauses
            autoPlayDelay={900}
            autoPlay
            playOnceKey="worldhub_greeting"
          />
        </div>
        <div style={{ flexShrink: 0 }}>
          <CoinPill value={totalCoins} onClick={() => navigate("/backpack")} />
        </div>
      </div>

      <div className="screen-scroll" style={{ display: "flex", flexDirection: "column", gap: 14, paddingTop: 4, position: "relative", zIndex: 1, flex: 1 }}>
        {/* Zegar cyklu */}
        <CycleClock
          days={days}
          dayIndex={dayIndex}
          label={cycle ? `Cykl #${cycle.cycle_number || 1} — Wieża Pytań` : "Wieża Pytań"}
          remainingText={friday && !friday.passed ? `Zostało ${friday.label} do nagrody` : ""}
        />

        {/* Postep tygodnia + skarb */}
        <WeekProgress done={weekDone} coins={weekCoins} streak={streak} />

        {/* Karta 2: GRY na ten tydzien */}
        <button
          onClick={() => navigate("/games")}
          style={{ border: "none", background: "transparent", padding: 0, cursor: "pointer", textAlign: "left", position: "relative" }}
        >
          <div
            className="card"
            style={{
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              gap: 14,
              minHeight: 120,
              background: "linear-gradient(135deg, rgba(123,192,232,.30), rgba(184,134,232,.30))",
            }}
          >
            <div
              style={{
                width: 70,
                height: 70,
                flex: "none",
                borderRadius: 18,
                background: "linear-gradient(180deg,#FFE0B5,#FFC178)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 36,
                boxShadow: "inset 0 0 0 2px rgba(255,255,255,.65), 0 6px 14px rgba(232,154,61,.35)",
                animation: "float-mid 3.5s ease-in-out infinite",
              }}
            >
              🎮
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.5, color: "var(--p-magic-dk)" }}>
                GRY TYGODNIA
              </div>
              <h2 className="t-display" style={{ fontSize: 22, margin: "2px 0 0" }}>
                3 wyzwania na ten tydzień
              </h2>
              <div style={{ display: "flex", gap: 6, marginTop: 6, alignItems: "center" }}>
                <span className="chip magic" style={{ fontSize: 11, padding: "2px 8px" }}>0/3 ukończone</span>
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
                  <Coin size={12} /> +30
                </span>
              </div>
            </div>
            <span style={{ fontSize: 32, color: "var(--p-magic-dk)", fontWeight: 700 }}>›</span>
          </div>
        </button>

        {/* Karta 3: Aktualna misja (zwoj z zadaniami z reala) */}
        <button
          onClick={() => mission && navigate("/mission")}
          disabled={!mission}
          style={{ border: "none", background: "transparent", padding: 0, cursor: mission ? "pointer" : "default", textAlign: "left", position: "relative" }}
        >
          <div
            className="card"
            style={{
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              gap: 14,
              minHeight: 120,
              background: "linear-gradient(135deg, rgba(255,224,181,.55), rgba(255,210,105,.40))",
            }}
          >
            <div style={{ width: 70, display: "flex", justifyContent: "center", flex: "none" }}>
              <img
                src="/assets/zwoj-closed.png"
                alt=""
                style={{
                  width: 45,
                  height: "auto",
                  filter: "drop-shadow(0 6px 12px rgba(80,50,10,.35))",
                  animation: "float-mid 3s ease-in-out infinite",
                }}
              />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.5, color: "var(--p-magic-dk)" }}>
                DZISIEJSZY ZWÓJ — ZADANIE Z REALA
              </div>
              <h2 className="t-display" style={{ fontSize: 22, margin: "2px 0 0" }}>
                {mission ? mission.title : "Kronika szuka tropu…"}
              </h2>
              {mission && (
                <div style={{ display: "flex", gap: 6, marginTop: 6, alignItems: "center" }}>
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
                    <Coin size={12} /> +12
                  </span>
                  <span className="chip magic" style={{ fontSize: 11, padding: "2px 8px" }}>+3 ✦</span>
                </div>
              )}
            </div>
            <span style={{ fontSize: 32, color: "var(--p-magic-dk)", fontWeight: 700 }}>›</span>
          </div>
        </button>

        {/* Karta 4: Komnata Refleksji */}
        <button
          onClick={() => navigate("/invite-gm")}
          style={{ border: "none", padding: 0, background: "transparent", cursor: "pointer", textAlign: "left" }}
        >
          <div
            className="card"
            style={{
              background: "linear-gradient(135deg, rgba(184,134,232,.22), rgba(255,210,105,.20))",
              position: "relative",
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "14px 16px",
            }}
          >
            <img
              src="/wizard.png"
              alt=""
              aria-hidden="true"
              style={{
                width: 64,
                height: "auto",
                flex: "none",
                transform: "scaleX(-1)",
                filter: "drop-shadow(0 4px 8px rgba(80,40,140,.35))",
              }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.5, color: "var(--p-magic-dk)" }}>
                KOMNATA REFLEKSJI
              </div>
              <div className="t-display" style={{ fontSize: 18, lineHeight: 1.15, marginTop: 2 }}>
                Mędrzec ma dla Ciebie myśl
              </div>
            </div>
            <span style={{ fontSize: 28, color: "var(--p-magic-dk)", fontWeight: 700 }}>›</span>
          </div>
        </button>

        {/* Mniejsze kafelki: Mapa + Plecak (z paskami postepu na gorze) */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {/* Mapa */}
          <button
            onClick={() => navigate("/map")}
            style={{ border: "none", background: "transparent", padding: 0, cursor: "pointer", textAlign: "left" }}
          >
            <div className="card card-tight" style={{ padding: "10px 12px 12px" }}>
              <div className="prog" style={{ height: 5, marginBottom: 8 }}>
                <i style={{ width: `${Math.round((regionsUnlocked / totalRegions) * 100)}%`, background: "linear-gradient(90deg,#5FA76F,#FFD269)" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <span style={{ fontSize: 22 }}>🌲</span>
                <span style={{ fontSize: 11, color: "var(--p-ink-soft)", fontWeight: 800 }}>{regionsUnlocked}/{totalRegions}</span>
              </div>
              <div className="t-display" style={{ fontSize: 16, lineHeight: 1.1 }}>Mapa Świata</div>
              <div style={{ fontSize: 11, color: "var(--p-ink-soft)" }}>krainy do odkrycia</div>
            </div>
          </button>
          {/* Plecak */}
          <button
            onClick={() => navigate("/backpack")}
            style={{ border: "none", background: "transparent", padding: 0, cursor: "pointer", textAlign: "left" }}
          >
            <div className="card card-tight" style={{ padding: "10px 12px 12px" }}>
              <div className="prog" style={{ height: 5, marginBottom: 8 }}>
                <i style={{ width: `${Math.round((backpackItems / backpackGoal) * 100)}%`, background: "linear-gradient(90deg,#B886E8,#FFD269)" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <span style={{ fontSize: 22 }}>💜</span>
                <span style={{ fontSize: 11, color: "var(--p-ink-soft)", fontWeight: 800 }}>{backpackItems}/{backpackGoal}</span>
              </div>
              <div className="t-display" style={{ fontSize: 16, lineHeight: 1.1 }}>Plecak</div>
              <div style={{ fontSize: 11, color: "var(--p-ink-soft)" }}>artefakty zdobyte</div>
            </div>
          </button>
        </div>
      </div>

      <TabBar current="home" />
    </PageShell>
  );
}
