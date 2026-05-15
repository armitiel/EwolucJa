import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { session } from "../services/api.js";
import { ttsPlayer } from "../services/ttsPlayer";
import { useAppData } from "../contexts/AppData.jsx";
import PageShell from "../components/PageShell.jsx";
import TabBar from "../components/TabBar.jsx";
import TopBar from "../components/TopBar.jsx";
import ProfileAvatar, { PROFILE_INFO } from "../components/ProfileAvatar.jsx";

const LEGACY_TO_PROFILE = { tropiciel_tajemnic: "DT", zaklinacz_uczuc: "EM", mistrz_map: "ST", tkacz_snow: "KR", gwardzista_odwagi: "LD", straznik_mostu: "MD" };
function profileCode(v) { if (!v) return "DT"; return PROFILE_INFO[v] ? v : (LEGACY_TO_PROFILE[v] || "DT"); }

// Poziomy ewolucji - nazwa stage'a zmienia sie z poziomem, ale jest niezalezna od profilu.
const STAGES = [
  { lvl: 1, name: "Iskra", desc: "pierwszy trop" },
  { lvl: 2, name: "Wędrowca", desc: "wytrwały szukający" },
  { lvl: 3, name: "Zwiadowca", desc: "odważny wędrowiec" },
  { lvl: 4, name: "Mistrz", desc: "władca krainy" },
];

function levelFromScores(lifetime) {
  const total = Object.values(lifetime || {}).reduce((s, v) => s + (v || 0), 0);
  if (total >= 60) return 4;
  if (total >= 30) return 3;
  if (total >= 10) return 2;
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
  const stage = STAGES[lvl - 1] || STAGES[0];
  const weekCoins = weeklyCoinSum(player);
  const WEEK_TARGET = 20;
  const weekPct = Math.min(100, Math.round((weekCoins / WEEK_TARGET) * 100));
  const choicesCount = (player.choices_log || []).length;
  const backpackCount = (player.backpack || []).length;

  return (
    <PageShell>
      <TopBar showLogout onLogout={handleLogout} />

      <div className="screen-scroll" style={{ flex: 1, minHeight: 0, padding: "12px 18px 52px", display: "flex", flexDirection: "column", gap: 14 }}>
        {/* DUZY AVATAR - pierwsza rzecz na ekranie */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "8px 0 6px", opacity: 0, animation: "el-down .7s ease forwards" }}>
          <div style={{ filter: `drop-shadow(0 18px 36px ${info.glow})`, animation: "float-mid 4s ease-in-out infinite" }}>
            <ProfileAvatar profile={profile} size={200} />
          </div>
          <div className="t-display" style={{ fontSize: 30, marginTop: 6, color: info.color, letterSpacing: -.3 }}>
            {info.name}
          </div>
          <div className="t-hand" style={{ fontSize: 17, color: "var(--p-ink-soft)", marginTop: 2 }}>
            {stage.name} · Poziom {lvl}
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
            {STAGES.map((s) => (
              <div key={s.lvl} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative", zIndex: 2, opacity: s.lvl <= lvl ? 1 : 0.42 }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: s.lvl === lvl ? "linear-gradient(180deg,#FFD269,#E89A3D)" : "rgba(255,255,255,.85)", boxShadow: s.lvl === lvl ? "0 0 0 6px rgba(255,210,105,.30), 0 4px 14px rgba(232,154,61,.4)" : "var(--shadow-sm)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 18, color: s.lvl === lvl ? "#4A2A0E" : "var(--p-ink-soft)" }}>
                  {s.lvl}
                </div>
                <div className="t-display" style={{ fontSize: 13, marginTop: 6, textAlign: "center" }}>{s.name}</div>
                <div style={{ fontSize: 10, color: "var(--p-ink-soft)", textAlign: "center" }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* KRONIKA TROPOW */}
        <div className="card" style={{ opacity: 0, animation: "el-up .55s ease .35s forwards" }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.5, color: "var(--p-ink-soft)", marginBottom: 8 }}>KRONIKA TROPÓW</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Stat val={player.lifetime_scores?.[profile] || 0} label={`punkty ${info.name.toLowerCase()}a`} c={info.color} delay={.45} />
            <Stat val={backpackCount} label="zdobytych artefaktów" c="var(--p-dusk)" delay={.50} />
            <Stat val={choicesCount} label="zarejestrowanych tropów" c="var(--p-leaf-dk)" delay={.55} />
            <Stat val={weekCoins} label="monet tygodnia" c="#C8843A" delay={.60} />
          </div>
        </div>
      </div>

      <TabBar current="profile" />
    </PageShell>
  );
}
