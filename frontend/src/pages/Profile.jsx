import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { session } from "../services/api.js";
import { ttsPlayer } from "../services/ttsPlayer";
import { useAppData } from "../contexts/AppData.jsx";
import PageShell from "../components/PageShell.jsx";
import TabBar from "../components/TabBar.jsx";
import TopBar from "../components/TopBar.jsx";
import ProfileAvatar, { PROFILE_INFO } from "../components/ProfileAvatar.jsx";
import CharakterBohatera from "../components/CharakterBohatera.jsx";

const LEGACY_TO_PROFILE = { tropiciel_tajemnic: "DT", zaklinacz_uczuc: "EM", mistrz_map: "ST", tkacz_snow: "KR", gwardzista_odwagi: "LD", straznik_mostu: "MD" };
function profileCode(v) { if (!v) return "DT"; return PROFILE_INFO[v] ? v : (LEGACY_TO_PROFILE[v] || "DT"); }

// Poziomy ewolucji - czysto numeryczne, bez nazw stylizowanych
const STAGES = [
  { lvl: 1 },
  { lvl: 2 },
  { lvl: 3 },
  { lvl: 4 },
];

function levelFromScores(lifetime) {
  // Quiz onboardingowy daje ~70-100 pkt baseline.
  // Levelup ma byc stopniowy z misji - prog zaczyna od progu znacznie powyzej baseline'u.
  const total = Object.values(lifetime || {}).reduce((s, v) => s + (v || 0), 0);
  if (total >= 400) return 4;
  if (total >= 250) return 3;
  if (total >= 130) return 2;
  return 1;
}

// Pomocnik: suma coinow zdobytych w tym tygodniu (od poniedzialku 00:00).
function weeklyCoinSum(player) {
  // Obecnie nie mamy timestampow przy choices_log; fallback: zlicz wpisy z tego tygodnia (kazdy = 1 ✦).
  const now = new Date();
  const day = (now.getDay() + 6) % 7; // 0 = poniedzialek
  const monday = new Date(now); monday.setHours(0, 0, 0, 0); monday.setDate(now.getDate() - day);
  const log = player.choices_log || [];
  let sum = 0;
  for (const entry of log) {
    const ts = entry.timestamp || entry.at;
    if (!ts || new Date(ts) >= monday) sum += 1; // brak ts = wlicz (defensywnie)
  }
  return sum;
}

const Stat = ({ val, label, c, delay = 0 }) => (
  <div style={{ background: "rgba(255,255,255,.6)", borderRadius: 14, padding: "10px 12px", opacity: 0, animation: `el-up .55s ease ${delay}s forwards` }}>
    <div className="t-display" style={{ fontSize: 26, color: c, lineHeight: 1 }}>{val}</div>
    <div style={{ fontSize: 11, color: "var(--p-ink-soft)", fontWeight: 700 }}>{label}</div>
  </div>
);

export default function Profile() {
  const navigate = useNavigate();
  const { player, error } = useAppData();

  useEffect(() => {
    if (!session.getPlayer()) navigate("/onboarding");
  }, [navigate]);

  function handleLogout() {
    if (!confirm("Wylogować? Twoja obecna postać zostanie zapomniana w tej przeglądarce.")) return;
    session.clear();
    ttsPlayer.stop();
    navigate("/");
  }

  if (error) return <PageShell><div style={{ padding: 40 }}><p style={{ color: "#B85B47" }}>{error}</p></div></PageShell>;
  if (!player) return null;

  const profile = profileCode(player.archetype);
  const info = PROFILE_INFO[profile];
  const lvl = levelFromScores(player.lifetime_scores);
  const weekCoins = weeklyCoinSum(player);
  const WEEK_TARGET = 20;
  const weekPct = Math.min(100, Math.round((weekCoins / WEEK_TARGET) * 100));
  const choicesCount = (player.choices_log || []).length;
  const backpackCount = (player.backpack || []).length;

  return (
    <PageShell>
      <TopBar showLogout onLogout={handleLogout} />

      <div className="screen-scroll" style={{ flex: 1, minHeight: 0, padding: "12px 18px 52px", display: "flex", flexDirection: "column", gap: 14 }}>
        {/* DUZY AVATAR - pierwsza rzecz na ekranie, z kolowym tlem + LV badge */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "4px 0 0", opacity: 0, animation: "el-down .7s ease forwards" }}>
          <div style={{ position: "relative", width: 300, height: 300, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            {/* Koliste tlo - radialny gradient w kolorze profilu (pulse) */}
            <div aria-hidden="true" style={{
              position: "absolute", inset: 0, borderRadius: "50%",
              background: `radial-gradient(circle at 50% 40%, ${info.glow.replace(/[\d.]+\)/, "0.55)")} 0%, ${info.glow} 45%, transparent 75%)`,
              filter: "blur(2px)",
              animation: "profile-glow-pulse 3.2s ease-in-out infinite",
            }} />
            {/* Kolisty pierscien wokol (oddycha synchronicznie) */}
            <div aria-hidden="true" style={{
              position: "absolute", inset: 22, borderRadius: "50%",
              background: "rgba(255,255,255,.40)",
              boxShadow: `inset 0 0 0 3px ${info.color}33, 0 8px 24px ${info.glow}`,
              animation: "profile-ring-pulse 3.2s ease-in-out infinite",
            }} />
            <div style={{ position: "relative", filter: `drop-shadow(0 14px 24px ${info.glow})`, animation: "float-mid 4s ease-in-out infinite" }}>
              <ProfileAvatar profile={profile} size={258} />
            </div>
            {/* LV BADGE - pomaranczowy z numerem */}
            <div style={{
              position: "absolute", right: 30, bottom: 20,
              width: 60, height: 60, borderRadius: "50%",
              background: "linear-gradient(180deg, #FFD269 0%, #E89A3D 100%)",
              boxShadow: "0 0 0 4px #fff, 0 4px 14px rgba(232,154,61,.55), 0 2px 0 #B47322",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              color: "#4A2A0E", fontFamily: "var(--font-display, 'Baloo 2'), sans-serif",
            }}>
              <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: .5, marginTop: 4 }}>LV</span>
              <span style={{ fontSize: 24, fontWeight: 800, lineHeight: 1 }}>{lvl}</span>
            </div>
          </div>
          <div className="t-display" style={{ fontSize: 32, marginTop: -4, color: info.color, letterSpacing: -.3 }}>
            {info.name}
          </div>
        </div>

        {/* PASEK POSTEPU TYGODNIA */}
        <div className="card" style={{ padding: "14px 16px", opacity: 0, animation: "el-up .55s ease .15s forwards" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 800, color: "var(--p-ink-soft)", marginBottom: 6 }}>
            <span>POSTĘP TYGODNIA</span>
            <span>{weekCoins} / {WEEK_TARGET} ✦</span>
          </div>
          <div className="prog magic"><i style={{ width: `${weekPct}%` }} /></div>
        </div>

        {/* SCIEZKA EWOLUCJI */}
        <div className="card" style={{ opacity: 0, animation: "el-up .55s ease .25s forwards" }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.5, color: "var(--p-ink-soft)" }}>ŚCIEŻKA EWOLUCJI</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 14, gap: 6, position: "relative" }}>
            <div style={{ position: "absolute", left: "10%", right: "10%", top: "42%", height: 3, background: "rgba(122,77,194,.18)", borderRadius: 2, zIndex: 0 }} />
            <div style={{ position: "absolute", left: "10%", width: `${Math.max(0, ((lvl - 1) / (STAGES.length - 1)) * 80)}%`, top: "42%", height: 3, background: "linear-gradient(90deg,#C8A0F0,#7A4DC2)", borderRadius: 2, zIndex: 1, transition: "width .8s ease" }} />
            {STAGES.map((s) => {
              const isPast = s.lvl < lvl;
              const isCurrent = s.lvl === lvl;
              const isFuture = s.lvl > lvl;
              return (
                <div key={s.lvl} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative", zIndex: 2 }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: "50%",
                    background: isCurrent
                      ? "linear-gradient(180deg,#FFD269,#E89A3D)"
                      : isPast
                      ? "linear-gradient(180deg,#C8A0F0,#7A4DC2)"
                      : "rgba(255,255,255,.85)",
                    boxShadow: isCurrent
                      ? "0 0 0 6px rgba(255,210,105,.30), 0 4px 14px rgba(232,154,61,.4)"
                      : isPast
                      ? "0 4px 12px rgba(122,77,194,.35)"
                      : "var(--shadow-sm)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 800, fontSize: 22,
                    color: isCurrent ? "#4A2A0E" : isPast ? "#fff" : "var(--p-ink-soft)",
                    opacity: isFuture ? 0.55 : 1,
                  }}>
                    {s.lvl}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CHARAKTER BOHATERA - radar 6 cech */}
        <div style={{ opacity: 0, animation: "el-up .55s ease .35s forwards" }}>
          <CharakterBohatera player={player} profile={profile} />
        </div>
      </div>

      <TabBar current="profile" />
    </PageShell>
  );
}
