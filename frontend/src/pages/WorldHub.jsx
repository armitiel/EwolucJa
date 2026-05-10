/**
 * WorldHub — główny ekran spójnego świata. Pokazuje:
 * - awatar (archetyp)
 * - aktualny cykl + countdown do piątku
 * - aktualną misję (skrót + CTA)
 * - plecak (artefakty)
 * - link do zaproszenia GM (rodzic / nauczyciel)
 */

import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { api, session } from "../services/api.js";
import { ARCHETYPES, timeUntilFriday } from "../config.js";
import NarratorVoice from "../components/NarratorVoice.jsx";

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
          // brak aktywnej misji, generuj
          try {
            const m = await api.generateMission(id);
            setMission(m);
          } catch {}
        }
      } catch (e) {
        setError(e.message);
      }
    })();
  }, [navigate]);

  // ── HOOKS PRZED early returns (Rules of Hooks) ───────────────────
  const friday = cycle ? timeUntilFriday(cycle.friday_deadline) : null;
  const greeting = useMemo(() => {
    if (!player) return "";
    const parts = [`Witaj z powrotem, ${player.player_name}.`];
    if (mission) parts.push(`Twoja misja na ten tydzień: ${mission.title}.`);
    if (friday && !friday.passed) parts.push(`Zostało ${friday.label}.`);
    return parts.join(" ");
  }, [player, mission, friday]);

  // ── early returns ───────────────────────────────────────────────
  if (error) return <div style={styles.wrap}><p style={styles.err}>{error}</p></div>;
  if (!player) return <div style={styles.wrap}><p>Otwieranie Kroniki…</p></div>;

  const arch = ARCHETYPES[player.archetype] || ARCHETYPES.tropiciel_tajemnic;

  return (
    <div style={styles.wrap}>
      <header style={styles.header}>
        <div style={{ ...styles.avatarBubble, background: arch.accent_color }}>🔍</div>
        <div style={{ flex: 1 }}>
          <p style={styles.muted}>Tropiciel</p>
          <h1 style={styles.name}>{player.player_name}</h1>
          <p style={styles.archName}>{arch.name}</p>
        </div>
        <NarratorVoice text={greeting} land="dolina_selfie" autoPlay />
      </header>

      <section style={styles.card}>
        <h2 style={styles.cardTitle}>Cykl tygodnia</h2>
        {cycle ? (
          <>
            <p style={styles.cardLine}>Cykl #{cycle.cycle_number}</p>
            {friday && (
              <p style={{ ...styles.cardLine, color: friday.passed ? "#ff8a8a" : "#ffd166" }}>
                ⏳ {friday.label}
              </p>
            )}
          </>
        ) : (
          <button style={styles.btn} onClick={async () => setCycle(await api.startCycle(player.player_id))}>
            Rozpocznij pierwszy cykl
          </button>
        )}
      </section>

      <section style={styles.card}>
        <h2 style={styles.cardTitle}>Aktualna misja</h2>
        {mission ? (
          <>
            <p style={styles.missionTitle}>{mission.title}</p>
            <p style={styles.missionBody}>{mission.body}</p>
            <button style={styles.btn} onClick={() => navigate("/mission")}>
              Otwórz misję →
            </button>
          </>
        ) : (
          <p style={styles.muted}>Brak aktywnej misji. Wkrótce…</p>
        )}
      </section>

      <section style={styles.card}>
        <h2 style={styles.cardTitle}>Plecak</h2>
        <div style={styles.backpack}>
          {(player.backpack || []).length === 0 && (
            <p style={styles.muted}>Plecak czeka na pierwszy artefakt.</p>
          )}
          {(player.backpack || []).slice(-6).map((a) => (
            <div key={a.artifact_id} style={styles.artifact}>
              <div style={styles.artifactIcon}>✨</div>
              <span style={styles.artifactName}>{a.artifact_name}</span>
            </div>
          ))}
        </div>
      </section>

      <section style={styles.card}>
        <h2 style={styles.cardTitle}>Twój Mentor</h2>
        <p style={styles.muted}>
          Poproś dorosłego (rodzica lub nauczyciela), żeby zeskanował kod i dołączył jako Twój Mentor.
        </p>
        <button style={styles.btn} onClick={() => navigate("/invite-gm")}>
          Wygeneruj kod zaproszenia
        </button>
      </section>
    </div>
  );
}

const styles = {
  wrap: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #1a1040 0%, #2d1b4e 50%, #1a1a2e 100%)",
    color: "#fff",
    padding: "24px 18px 60px",
    maxWidth: 640,
    margin: "0 auto",
    boxSizing: "border-box",
  },
  header: { display: "flex", alignItems: "center", gap: 16, marginBottom: 20 },
  avatarBubble: {
    width: 72, height: 72, borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32,
  },
  muted: { opacity: 0.6, margin: 0, fontSize: 13 },
  name: { fontSize: 26, margin: "2px 0" },
  archName: { fontSize: 14, opacity: 0.85, margin: 0 },
  card: {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 22,
    padding: 18,
    marginBotto