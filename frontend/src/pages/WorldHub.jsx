import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { api, session } from "../services/api.js";
import { ARCHETYPES, timeUntilFriday } from "../config.js";
import NarratorVoice from "../components/NarratorVoice.jsx";
import PageShell from "../components/PageShell.jsx";
import TabBar from "../components/TabBar.jsx";
import { Avatar, MoonPhase, RegionIcon, Artifact, Sparkle } from "../components/art.jsx";

const WEEK_LABELS = ["PN", "WT", "ŚR", "CZ", "PT"];

export default function WorldHub() {
  const navigate = useNavigate();
  const [player, setPlayer] = useState(null);
  const [cycle, setCycle] = useState(null);
  const [mission, setMission] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const id = session.getPlayer();
    if (!id) { navigate("/onboarding"); return; }
    (async () => {
      try {
        const p = await api.getPlayer(id);
        setPlayer(p);
        try { setCycle(await api.getCurrentCycle(id)); } catch {}
        try {
          setMission(await api.getCurrentMission(id));
        } catch {
          try { setMission(await api.generateMission(id)); } catch {}
        }
      } catch (e) {
        setError(e.message);
      }
    })();
  }, [navigate]);

  const friday = cycle ? timeUntilFriday(cycle.friday_deadline) : null;

  const cycleProgress = useMemo(() => {
    if (!cycle) return 0;
    const start = new Date(cycle.started_at).getTime();
    const end = new Date(cycle.friday_deadline).getTime();
    const now = Date.now();
    const total = Math.max(end - start, 1);
    return Math.max(0, Math.min(1, (now - start) / total));
  }, [cycle]);

  const greeting = useMemo(() => {
    if (!player) return "";
    const parts = [`Witaj z powrotem, ${player.player_name}.`];
    if (mission) parts.push(`Twoja misja na ten tydzień: ${mission.title}.`);
    if (friday && !friday.passed) parts.push(`Zostało ${friday.label}.`);
    return parts.join(" ");
  }, [player, mission, friday]);

  if (error) return <PageShell><div style={{ padding: 40 }}><p style={{ color: "#B85B47" }}>{error}</p></div></PageShell>;
  if (!player) return <PageShell><div style={{ padding: 40, textAlign: "center" }}><p>Otwieranie Kroniki…</p></div></PageShell>;

  const coinsCount = (player.lifetime_scores?.DT || 0) + (player.lifetime_scores?.EM || 0);
  const backpackCount = (player.backpack || []).length;

  return (
    <PageShell>
      <div className="topbar">
        <div style={{ position: "relative" }}>
          <Avatar kind="fox" size={48} evolved={1} />
        </div>
        <div className="meta">
          <div className="lbl">Tropiciel</div>
          <div className="nm">{player.player_name}</div>
        </div>
        <div className="coins"><span style={{ color: "#E89A3D" }}>✦</span> {coinsCount}</div>
      </div>

      <div className="screen-scroll" style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
        <div className="card card-paper">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.5, color: "var(--p-ink-soft)" }}>CYKL TYGODNIA</div>
              <div className="t-display" style={{ fontSize: 22 }}>Cykl #{cycle?.cycle_number || 1} — Wieża Pytań</div>
            </div>
            <span className="chip amber"><span>⌛</span> {friday ? friday.label : "—"}</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", margin: "14px 4px 6px" }}>
            {[0, 1, 2, 3, 4].map((p) => {
              const phaseActive = p / 4 <= cycleProgress;
              return (
                <div key={p} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, opacity: phaseActive ? 1 : 0.45 }}>
                  <MoonPhase phase={p} size={28} glow={phaseActive} />
                  <div style={{ fontSize: 9, fontWeight: 800, color: "var(--p-ink-soft)" }}>{WEEK_LABELS[p]}</div>
                </div>
              );
            })}
          </div>
          <div className="prog magic"><i style={{ width: `${Math.round(cycleProgress * 100)}%` }} /></div>
          <p style={{ margin: "8px 0 0", fontSize: 12, color: "var(--p-ink-soft)" }}>
            Bohater dojrzewa z każdym tropem. Złóż dowód do piątku 20:00.
          </p>
        </div>

        <div style={{ position: "relative" }}>
          <div className="card card-paper" style={{ padding: "18px 16px", position: "relative" }}>
            <div className="scroll-rod" style={{ top: -4 }} />
            <div className="scroll-rod" style={{ bottom: -4 }} />
            <div style={{ padding: "14px 0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span className="chip magic">✦ AKTUALNA MISJA</span>
                <span className="chip leaf">+3 ✦</span>
              </div>
              {mission ? (
                <>
                  <h2 className="t-display" style={{ fontSize: 24, margin: "4px 0" }}>{mission.title}</h2>
                  <p className="t-hand" style={{ fontSize: 18, margin: "4px 0 10px", color: "var(--p-ink-soft)" }}>
                    „{mission.body}"
                  </p>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn btn-magic btn-sm" onClick={() => navigate("/mission")}>Otwórz misję ›</button>
                    <button className="btn btn-ghost btn-sm">Później</button>
                  </div>
                </>
              ) : (
                <p style={{ fontSize: 14, color: "var(--p-ink-soft)" }}>Brak aktywnej misji. Kronika szuka tropu…</p>
              )}
            </div>
          </div>
          <div style={{ position: "absolute", top: -8, right: -4 }}><Sparkle size={20} /></div>
          <div style={{ position: "absolute", bottom: -2, left: 8 }}><Sparkle size={14} delay={0.6} /></div>
        </div>

        <div className="card" style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ width: 46, height: 46, borderRadius: "50%", background: "linear-gradient(180deg,#FFE0B5,#E89A3D)", display: "flex", alignItems: "center", justifyContent: "center", flex: "none", boxShadow: "inset 0 0 0 2px #fff" }}>
            <span style={{ fontSize: 24 }}>🦉</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: "var(--p-ink-soft)", letterSpacing: 1.5 }}>SZEPT MENTORA</div>
            <div className="t-hand" style={{ fontSize: 18, lineHeight: 1.2 }}>„Pamiętaj — najlepsze pytania to te, które jeszcze nie znają odpowiedzi."</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <button className="card card-tight" style={{ textAlign: "left", cursor: "pointer", border: "none" }} onClick={() => navigate("/map")}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <RegionIcon kind="forest" size={36} />
              <span style={{ fontSize: 11, color: "var(--p-leaf-dk)", fontWeight: 800 }}>›</span>
            </div>
            <div className="t-display" style={{ fontSize: 17, marginTop: 6 }}>Mapa Świata</div>
            <div style={{ fontSize: 11, color: "var(--p-ink-soft)" }}>6 krain do odkrycia</div>
          </button>
          <button className="card card-tight" style={{ textAlign: "left", cursor: "pointer", border: "none" }} onClick={() => navigate("/backpack")}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <Artifact kind="crystal" size={36} />
              <span className="chip magic" style={{ fontSize: 10, padding: "2px 6px" }}>{backpackCount}</span>
            </div>
            <div className="t-display" style={{ fontSize: 17, marginTop: 6 }}>Plecak</div>
            <div style={{ fontSize: 11, color: "var(--p-ink-soft)" }}>{backpackCount} {backpackCount === 1 ? "artefakt" : "artefakty"} zdobyte</div>
          </button>
        </div>

        <div className="card" style={{ background: "linear-gradient(135deg, rgba(184,134,232,.20), rgba(255,210,105,.18))", position: "relative", overflow: "hidden" }}>
          <img src="/assets/wiz.png" alt="" aria-hidden="true" style={{ position: "absolute", right: -10, bottom: -6, width: 110, height: "auto", transform: "scaleX(-1)", pointerEvents: "none", filter: "drop-shadow(0 6px 12px rgba(80,40,140,.35))", opacity: 0.95, zIndex: 0 }} />
          <div style={{ position: "relative", zIndex: 1, paddingRight: 88 }}>
            <div className="t-display" style={{ fontSize: 18 }}>Twój Mentor</div>
            <p style={{ fontSize: 13, color: "var(--p-ink-soft)", margin: "4px 0 10px" }}>
              Poproś dorosłego, żeby zeskanował kod i dołączył jako Twój Mentor.
            </p>
            <button className="btn btn-magic btn-sm" onClick={() => navigate("/invite-gm")}>Wygeneruj kod zaproszenia</button>
          </div>
        </div>

        <NarratorVoice text={greeting} land="dolina_selfie" tone="warm" autoPlay />
      </div>

      <TabBar current="home" />
    </PageShell>
  );
}
