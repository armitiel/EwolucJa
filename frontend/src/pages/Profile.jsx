import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { session } from "../services/api.js";
import { ttsPlayer } from "../services/ttsPlayer";
import { useAppData } from "../contexts/AppData.jsx";
import PageShell from "../components/PageShell.jsx";
import TabBar from "../components/TabBar.jsx";
import TopBar from "../components/TopBar.jsx";
import { Avatar } from "../components/art.jsx";
import ProfileAvatar, { PROFILE_INFO } from "../components/ProfileAvatar.jsx";

const LEGACY_TO_PROFILE = { tropiciel_tajemnic: "DT", zaklinacz_uczuc: "EM", mistrz_map: "ST", tkacz_snow: "KR", gwardzista_odwagi: "LD", straznik_mostu: "MD" };
function profileCode(v) { if (!v) return "DT"; return PROFILE_INFO[v] ? v : (LEGACY_TO_PROFILE[v] || "DT"); }

const STAGES = [
  { lvl: 1, name: "Iskra", desc: "pierwszy trop" },
  { lvl: 2, name: "Tropiciel", desc: "wytrwały szukający" },
  { lvl: 3, name: "Zwiadowca", desc: "odważny wędrowiec" },
  { lvl: 4, name: "Mędrczyni", desc: "mistrz krainy" },
];

function levelFromScores(lifetime) {
  const total = Object.values(lifetime || {}).reduce((s, v) => s + (v || 0), 0);
  if (total >= 60) return 4;
  if (total >= 30) return 3;
  if (total >= 10) return 2;
  return 1;
}

function progressInLevel(lifetime, level) {
  const total = Object.values(lifetime || {}).reduce((s, v) => s + (v || 0), 0);
  const thresholds = [0, 10, 30, 60, 100];
  const start = thresholds[level - 1];
  const end = thresholds[level];
  if (total >= end) return { current: end - start, target: end - start, pct: 100 };
  return { current: total - start, target: end - start, pct: Math.round(((total - start) / (end - start)) * 100) };
}

const Stat = ({ val, label, c }) => (
  <div style={{ background: "rgba(255,255,255,.6)", borderRadius: 14, padding: "10px 12px" }}>
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

  function logoutFresh() {
    if (!confirm("Wylogować i zacząć nową postać? Twoja obecna postać zostanie zapomniana w tej przeglądarce.")) return;
    session.clear();
    ttsPlayer.stop();
    navigate("/");
  }

  if (error) return <PageShell><div style={{ padding: 40 }}><p style={{ color: "#B85B47" }}>{error}</p></div></PageShell>;
  if (!player) return null;

  const lvl = levelFromScores(player.lifetime_scores);
  const stage = STAGES[lvl - 1] || STAGES[0];
  const prog = progressInLevel(player.lifetime_scores, lvl);
  const choicesCount = (player.choices_log || []).length;
  const backpackCount = (player.backpack || []).length;

  return (
    <PageShell>
      <TopBar />

      <div className="screen-scroll" style={{ flex: 1, minHeight: 0, padding: "12px 18px 52px", display: "flex", flexDirection: "column", gap: 14 }}>
        <div className="card" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "22px 16px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 30%, rgba(255,210,105,.40), transparent 60%)" }} />
          <div style={{ filter: `drop-shadow(0 10px 24px ${PROFILE_INFO[profileCode(player.archetype)].glow})` }}>
            <ProfileAvatar profile={profileCode(player.archetype)} size={140} />
          </div>
          <div className="t-display" style={{ fontSize: 26, marginTop: 4 }}>{stage.name} · Poziom {lvl}</div>
          <div className="t-hand" style={{ fontSize: 18, color: "var(--p-ink-soft)" }}>
            „{player.player_name}, Twoje pytania zaczynają mieć moc."
          </div>
          <div style={{ width: "100%", marginTop: 6 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 800, color: "var(--p-ink-soft)", marginBottom: 4 }}>
              <span>do następnej ewolucji</span>
              <span>{prog.current} / {prog.target} ✦</span>
            </div>
            <div className="prog magic"><i style={{ width: `${prog.pct}%` }} /></div>
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.5, color: "var(--p-ink-soft)" }}>ŚCIEŻKA EWOLUCJI</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 14, gap: 6, position: "relative" }}>
            <div style={{ position: "absolute", left: "10%", right: "10%", top: "42%", height: 3, background: "rgba(122,77,194,.18)", borderRadius: 2, zIndex: 0 }} />
            <div style={{ position: "absolute", left: "10%", width: `${Math.max(0, ((lvl - 1) / (STAGES.length - 1)) * 80)}%`, top: "42%", height: 3, background: "linear-gradient(90deg,#C8A0F0,#7A4DC2)", borderRadius: 2, zIndex: 1 }} />
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

        <div className="card">
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.5, color: "var(--p-ink-soft)", marginBottom: 8 }}>KRONIKA TROPÓW</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Stat val={player.lifetime_scores?.DT || 0} label="iskier detektywa" c="var(--p-magic-dk)" />
            <Stat val={backpackCount} label="zdobytych artefaktów" c="var(--p-dusk)" />
            <Stat val={choicesCount} label="zarejestrowanych tropów" c="var(--p-leaf-dk)" />
            <Stat val={player.lifetime_scores?.EM || 0} label="ech empatii" c="var(--p-rose)" />
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.5, color: "var(--p-ink-soft)", marginBottom: 10 }}>USTAWIENIA KONTA</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <button className="btn btn-ghost btn-block" onClick={() => navigate("/")}>
              🏠 Ekran startowy (wybór trybu)
            </button>
            <button className="btn btn-magic btn-block" onClick={() => navigate("/invite-gm")}>
              🌟 Zaproś Mentora
            </button>
            <button className="btn btn-ghost btn-block" style={{ color: "#B85B47" }} onClick={logoutFresh}>
              🔄 Wyloguj — zacznij nową postać
            </button>
          </div>
        </div>
      </div>

      <TabBar current="profile" />
    </PageShell>
  );
}
