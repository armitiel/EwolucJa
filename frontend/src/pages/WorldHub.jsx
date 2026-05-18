/**
 * WorldHub / ScreenHome — ekran "Dom" w stylu Ghibli/Claymorphism.
 * Wielki wizard u gory + powitanie + zegar cyklu + karta zwoju misji + karta Komnaty.
 *
 * Nazwy kart (po konsultacji z agentami game-designer / komunikacja-z-rodzicami):
 *  1) WYPRAWA TYGODNIA / Trzy Próby Krain  (3 gry digital, link /games)
 *  2) ŚLAD W REALU / {mission.title}        (1 misja realna, link /mission)
 *  3) SZEPT MĘDRCZYNI / Komnata czeka z myślą (3 porady dnia, link /porady)
 *
 * Tygodniowy cel coinów: 50 (Iskra) → 70 (Wędrowiec) → 90 → 120 (Mędrczyni).
 * MVP: 50 (do dostosowania gdy backend wystawi cycle.weekly_goal).
 */
import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { session } from "../services/api.js";
import { timeUntilFriday } from "../config.js";
import { PROFILE_INFO } from "../components/ProfileAvatar.jsx";

const LEGACY_TO_PROFILE = { tropiciel_tajemnic: "DT", zaklinacz_uczuc: "EM", mistrz_map: "ST", tkacz_snow: "KR", gwardzista_odwagi: "LD", straznik_mostu: "MD" };
function profileCode(v) { if (!v) return "DT"; return PROFILE_INFO[v] ? v : (LEGACY_TO_PROFILE[v] || "DT"); }
import { useAppData } from "../contexts/AppData.jsx";
import PageShell from "../components/PageShell.jsx";
import TabBar from "../components/TabBar.jsx";
import TopBar from "../components/TopBar.jsx";
import { Coin } from "../components/art.jsx";

// ─── WeekProgress — orby tygodnia + jeden zloty pasek z wbudowanym licznikiem coinow ───
function WeekProgress({ todayIndex = null, coins = 0, weekGoal = 50 }) {
  const days = ["PN", "WT", "ŚR", "CZ", "PT", "SO", "ND"];
  const computedToday = todayIndex != null ? todayIndex : ((new Date().getDay() + 6) % 7);
  const computedDone = computedToday;
  const coinPct = Math.min(100, Math.round((coins / Math.max(1, weekGoal)) * 100));

  return (
    <div className="card" style={{ padding: "12px 16px" }}>
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

      {/* Jeden zloty pasek z wbudowanym licznikiem coinow */}
      <div style={{
        position: "relative",
        marginTop: 14,
        height: 22,
        borderRadius: 999,
        background: "rgba(255,221,154,.35)",
        boxShadow: "inset 0 1px 3px rgba(120,80,10,.18), inset 0 0 0 1px rgba(225,182,106,.45)",
        overflow: "hidden",
      }}>
        {/* Wypelnienie zlotym gradientem */}
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0,
          width: `${coinPct}%`,
          background: "linear-gradient(180deg, #FFE082 0%, #FFB300 50%, #E89A3D 100%)",
          boxShadow: "0 1px 0 rgba(180,115,34,.55), inset 0 1px 0 rgba(255,255,255,.4)",
          transition: "width .5s ease",
        }} />
        {/* Tekst nad paskiem — zawsze widoczny i wycentrowany */}
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: 6, fontSize: 12, fontWeight: 900, color: "var(--p-ink)",
          textShadow: "0 1px 0 rgba(255,255,255,.6)",
          letterSpacing: 0.3, pointerEvents: "none",
        }}>
          <Coin size={14} />
          <span>{coins} / {weekGoal} coinów</span>
        </div>
      </div>
    </div>
  );
}

export default function WorldHub() {
  const navigate = useNavigate();
  const { player, cycle, mission, error } = useAppData();

  useEffect(() => {
    if (!session.getPlayer()) navigate("/onboarding");
  }, [navigate]);

  const friday = cycle ? timeUntilFriday(cycle.friday_deadline) : null;

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
  if (!player) return null;

  const profile = profileCode(player.archetype);

  // Cel tygodniowy: 1000 coinów (do dostosowania per poziom cyklu w przyszlosci).
  // Frontend-only mechanizm reset: localStorage zapamietuje "snapshot coinow"
  // na poczatku biezacego tygodnia (poniedzialek 00:00). Co tydzien w niedziele po polnocy
  // licznik startuje od 0 — fizyczne player.coins NIE jest dotykane (sluzy jako lifetime total).
  const weekGoal = cycle?.weekly_goal ?? 1000;
  const totalCoins = player.coins ?? 0;
  const weekCoins = useMemo(() => {
    try {
      // Wylicz poczatek biezacego tygodnia (poniedzialek 00:00 lokalnej strefy)
      const now = new Date();
      const day = now.getDay(); // 0=ND, 1=PN .. 6=SO
      const daysSinceMon = (day + 6) % 7; // 0 dla PN, 6 dla ND
      const monday = new Date(now);
      monday.setDate(now.getDate() - daysSinceMon);
      monday.setHours(0, 0, 0, 0);
      const weekStartISO = monday.toISOString();

      const KEY = "ewolucja.weeklyBase";
      const raw = localStorage.getItem(KEY);
      let snap = raw ? JSON.parse(raw) : null;
      if (!snap || snap.weekStart !== weekStartISO) {
        // Nowy tydzien — resetujemy bazowy stan na obecny totalCoins.
        snap = { weekStart: weekStartISO, baseCoins: totalCoins };
        localStorage.setItem(KEY, JSON.stringify(snap));
      }
      return Math.max(0, totalCoins - (snap.baseCoins || 0));
    } catch {
      return totalCoins;
    }
  }, [totalCoins]);

  // Kraina pochodna profilu — do sublabela karty misji.
  const KRAINY = {
    DT: "Las Pytań", EM: "Morze Słów", ST: "Góry Liczb",
    KR: "Pustynia Pomysłów", LD: "Niebo Marzeń", MD: "Zamek Czasu",
  };
  const kraina = KRAINY[profile] || "Las Pytań";

  return (
    <PageShell>
      <TopBar narratorText={greeting} playOnceKey="worldhub_greeting" tone="calm" speed={0.86} />

      <div className="screen-scroll entrance-stagger" style={{ display: "flex", flexDirection: "column", gap: 14, padding: "20px 18px calc(120px + env(safe-area-inset-bottom, 0px))", position: "relative", zIndex: 1, flex: 1 }}>
        {/* Postep tygodnia + pasek COINÓW vs CEL TYGODNIA */}
        <WeekProgress coins={weekCoins} weekGoal={weekGoal} />

        {/* Karta 1: W TYM TYGODNIU / Gry (kolor pomaranczowy) */}
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
              position: "relative",
              overflow: "hidden",
              background: "linear-gradient(135deg, rgba(255,193,120,.55), rgba(232,99,45,.30))",
            }}
          >
            {/* Tlo SVG — Gry.svg, wypelnia cala karte (cover) */}
            <div aria-hidden="true" style={{
              position: "absolute", inset: 0,
              backgroundImage: "url('/Gry.svg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              opacity: 0.55, pointerEvents: "none",
            }} />
            {/* Biala warstwa po lewej dla czytelnosci tekstu */}
            <div aria-hidden="true" style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(90deg, rgba(255,255,255,.65) 0%, rgba(255,255,255,.30) 45%, rgba(255,255,255,0) 75%)",
              pointerEvents: "none",
            }} />
            {/* Pomaranczowa zaokraglona tabletka z nowym gamepadem (czysta, Pixar) */}
            <div style={{
              width: 80, height: 80, flex: "none",
              borderRadius: 22,
              background: "linear-gradient(180deg, #FFC178 0%, #E8632D 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 0 #A03A12, 0 8px 18px rgba(232,99,45,.45), inset 0 2px 0 rgba(255,255,255,.25)",
              animation: "float-mid 3.5s ease-in-out infinite",
              position: "relative", zIndex: 1,
            }}>
              <svg viewBox="0 0 48 48" width="46" height="46" fill="none">
                <path d="M14 17h20a9 9 0 0 1 9 9v2.5a5.5 5.5 0 0 1-10.2 2.9l-1.4-1.4h-14.8l-1.4 1.4A5.5 5.5 0 0 1 5 28.5V26a9 9 0 0 1 9-9z" fill="#fff" />
                <rect x="11" y="24.5" width="9" height="2.6" rx="1.3" fill="#E8632D" />
                <rect x="14.2" y="21.3" width="2.6" height="9" rx="1.3" fill="#E8632D" />
                <circle cx="33" cy="22.5" r="1.8" fill="#E8632D" />
                <circle cx="36.5" cy="26" r="1.8" fill="#FFD269" />
                <circle cx="33" cy="29.5" r="1.8" fill="#E8632D" />
                <circle cx="29.5" cy="26" r="1.8" fill="#E8632D" />
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0, position: "relative", zIndex: 1 }}>
              <h2 className="t-display" style={{ fontSize: 22, margin: 0, lineHeight: 1.15, color: "var(--p-ink)" }}>
                Gierki dla Ciebie
              </h2>
              <div style={{ display: "flex", gap: 6, marginTop: 6, alignItems: "center" }}>
                <span
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 5,
                    background: "rgba(255,255,255,.92)", color: "#7A4D10",
                    fontWeight: 800, fontSize: 14, padding: "4px 12px 4px 8px",
                    borderRadius: 999, boxShadow: "inset 0 0 0 1.5px #E1B66A, 0 1px 3px rgba(120,80,10,.15)",
                  }}
                >
                  <Coin size={16} /> +30
                </span>
                <span style={{ fontSize: 13, color: "var(--p-ink-soft)", fontWeight: 700 }}>0/3</span>
              </div>
            </div>
          </div>
        </button>

        {/* Karta 2: ŚLAD W REALU / {mission.title} (misja realna — kolor fioletowy) */}
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
              position: "relative",
              overflow: "hidden",
              background: "linear-gradient(135deg, rgba(200,160,240,.55), rgba(184,134,232,.35))",
            }}
          >
            {/* Subtelny vignette w odcieniach fioletu — pasuje do "zadan w realu" (zwoj+wstega) */}
            <div aria-hidden="true" style={{
              position: "absolute", inset: 0,
              background: "radial-gradient(ellipse at 80% 50%, rgba(184,134,232,.35) 0%, rgba(120,80,200,.10) 50%, transparent 80%)",
              pointerEvents: "none",
            }} />
            {/* Biala warstwa po lewej dla czytelnosci tekstu */}
            <div aria-hidden="true" style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(90deg, rgba(255,255,255,.55) 0%, rgba(255,255,255,.20) 50%, rgba(255,255,255,0) 80%)",
              pointerEvents: "none",
            }} />
            <div
              style={{
                width: 80, height: 80,
                display: "flex", justifyContent: "center", alignItems: "center",
                flex: "none",
                animation: "float-mid 3s ease-in-out infinite",
                position: "relative", zIndex: 1,
              }}
            >
              {/* zwoj2.svg — pelen zwoj z wstega + Medrzec (single source asset z trybu sealed) */}
              <img
                src="/zwoj2.svg"
                alt=""
                style={{
                  width: 80, height: "auto", objectFit: "contain",
                  filter: "drop-shadow(0 4px 8px rgba(80,40,140,.35))",
                }}
              />
            </div>
            <div style={{ flex: 1, minWidth: 0, position: "relative", zIndex: 1 }}>
              <h2 className="t-display" style={{ fontSize: 22, margin: 0, lineHeight: 1.15, color: "var(--p-ink)" }}>
                Zadania w Realu
              </h2>
              {mission && (
                <div style={{ display: "flex", gap: 6, marginTop: 6, alignItems: "center", flexWrap: "wrap" }}>
                  {mission.status === "submitted" && (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "rgba(122,77,194,.18)", color: "var(--p-magic-dk)", fontWeight: 800, fontSize: 12, padding: "4px 10px", borderRadius: 999, boxShadow: "inset 0 0 0 1.2px rgba(122,77,194,.30)" }}>
                      💌 Czeka na Mędrca
                    </span>
                  )}
                  {mission.status === "rejected" && (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "rgba(232,154,61,.22)", color: "#7A4D10", fontWeight: 800, fontSize: 12, padding: "4px 10px", borderRadius: 999, boxShadow: "inset 0 0 0 1.2px rgba(232,154,61,.4)", animation: "pulse-dot 2.4s ease-in-out infinite" }}>
                      🔄 Doprawka
                    </span>
                  )}
                  {(!mission.status || mission.status === "pending") && (
                    <span
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 5,
                        background: "rgba(255,255,255,.92)", color: "#7A4D10",
                        fontWeight: 800, fontSize: 14, padding: "4px 12px 4px 8px",
                        borderRadius: 999, boxShadow: "inset 0 0 0 1.5px #E1B66A, 0 1px 3px rgba(120,80,10,.15)",
                      }}
                    >
                      <Coin size={16} /> +12
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </button>

        {/* Karta 3: GŁOS MĘDRCA / Komnata czeka z myślą (3 porady dnia — kolor żółtawy) */}
        <button
          onClick={() => navigate("/porady")}
          style={{ border: "none", padding: 0, background: "transparent", cursor: "pointer", textAlign: "left" }}
        >
          <div
            className="card"
            style={{
              background: "linear-gradient(135deg, rgba(255,240,180,.75), rgba(255,224,120,.45))",
              position: "relative",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "14px 16px",
              minHeight: 120,
            }}
          >
            {/* Tlo SVG — rozkmina.svg, wypelnia cala karte (cover) */}
            <div aria-hidden="true" style={{
              position: "absolute", inset: 0,
              backgroundImage: "url('/rozkmina.svg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              opacity: 0.55, pointerEvents: "none",
            }} />
            {/* Biala warstwa po lewej dla czytelnosci tekstu */}
            <div aria-hidden="true" style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(90deg, rgba(255,255,255,.65) 0%, rgba(255,255,255,.30) 45%, rgba(255,255,255,0) 75%)",
              pointerEvents: "none",
            }} />
            <div
              style={{
                width: 90, height: 90,
                display: "flex", justifyContent: "center", alignItems: "center",
                flex: "none",
                animation: "float-mid 3.5s ease-in-out infinite",
                position: "relative", zIndex: 1,
              }}
            >
              <img
                src="/wizard.png"
                alt=""
                style={{
                  width: 90, height: 90, objectFit: "contain",
                  filter: "drop-shadow(0 6px 12px rgba(120,80,30,.45))",
                }}
              />
            </div>
            <div style={{ flex: 1, minWidth: 0, position: "relative", zIndex: 1 }}>
              <h2 className="t-display" style={{ fontSize: 22, margin: 0, lineHeight: 1.15, color: "var(--p-ink)" }}>
                Rozkmina Dnia
              </h2>
              <div style={{ marginTop: 6 }}>
                <span style={{
                  display: "inline-block",
                  padding: "3px 10px", borderRadius: 999,
                  background: "var(--p-magic-dk)", color: "#fff",
                  fontSize: 10, fontWeight: 900, letterSpacing: 1.2,
                  boxShadow: "0 2px 4px rgba(74,45,128,.3)",
                }}>
                  NOWE
                </span>
              </div>
            </div>
          </div>
        </button>

        {/* Mapa Świata + Plecak — USUNIĘTE (dostępne z TabBar na dole) */}
      </div>

      <TabBar current="home" />
    </PageShell>
  );
}
