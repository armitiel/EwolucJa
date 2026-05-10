/**
 * MissionView — szczegóły aktualnej misji + form do submitowania dowodu.
 */

import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { api, session } from "../services/api.js";
import NarratorVoice from "../components/NarratorVoice.jsx";

export default function MissionView() {
  const navigate = useNavigate();
  const [mission, setMission] = useState(null);
  const [proofText, setProofText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [dopamine, setDopamine] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const id = session.getPlayer();
    if (!id) { navigate("/onboarding"); return; }
    api.getCurrentMission(id).then(setMission).catch((e) => setError(e.message));
  }, [navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!mission) return;
    setSubmitting(true);
    try {
      const res = await api.submitMissionProof(mission.mission_id, {
        proof_text: proofText,
      });
      setSubmitted(true);
      setDopamine(res.dopamine_reward);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  // Tekst narratora: intro + body (czytany jednym ciągiem przez 11Labs)
  const narrationText = useMemo(() => {
    if (!mission) return "";
    return [mission.narrative_intro, mission.body].filter(Boolean).join(" ");
  }, [mission?.narrative_intro, mission?.body]);

  if (error) return <div style={styles.wrap}><p style={{ color: "#ff8a8a" }}>{error}</p></div>;
  if (!mission) return <div style={styles.wrap}><p>Otwieranie zwoju…</p></div>;

  return (
    <div style={styles.wrap}>
      <button style={styles.back} onClick={() => navigate("/world")}>← Wróć do świata</button>
      <div style={styles.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <p style={styles.muted}>Misja tygodnia</p>
            <h1 style={styles.title}>{mission.title}</h1>
          </div>
          <NarratorVoice text={narrationText} land="las_decyzji" autoPlay />
        </div>
        {mission.narrative_intro && (
          <p style={styles.intro}>{mission.narrative_intro}</p>
        )}
        <div style={styles.body}>{mission.body}</div>
        {mission.safety_notes && (
          <p style={styles.safety}>⚠️ {mission.safety_notes}</p>
        )}
        <p style={styles.meta}>Czas: ~{mission.estimated_minutes} min</p>

        {!submitted ? (
          <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
            <label style={styles.label}>Opowiedz, jak Ci poszło:</label>
            <textarea
              style={styles.textarea}
              rows={5}
              value={proofText}
              onChange={(e) => setProofText(e.target.value)}
              placeholder="Co odkryłeś? Co Cię zaskoczyło?"
              required
            />
            <button type="submit" style={styles.btn} disabled={submitting}>
              {submitting ? "Wysyłam…" : "Pokaż Mentorowi"}
            </button>
          </form>
        ) : (
          <div style={styles.success}>
            <h3>Dowód wysłany!</h3>
            <p>Twój Mentor przyjrzy się temu w piątek.</p>
            {dopamine && (
              <div style={styles.gift}>
                <p style={styles.muted}>Tymczasem Kronika daje Ci:</p>
                <p style={styles.giftName}>✨ {dopamine.artifact_name}</p>
              </div>
            )}
            <button style={styles.btn} onClick={() => navigate("/world")}>
              Wróć do świata
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #1a1040 0%, #2d1b4e 50%, #1a1a2e 100%)",
    color: "#fff",
    padding: "20px 18px 60px",
    maxWidth: 640,
    margin: "0 auto",
    boxSizing: "border-box",
  },
  back: {
    background: "transparent", color: "#fff",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: 12, padding: "8px 14px",
    marginBottom: 16, cursor: "pointer",
  },
  card: {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 22, padding: 22,
  },
  muted: { opacity: 0.6, fontSize: 13, margin: "0 0 4px" },
  title: { fontSize: 26, margin: "0 0 12px" },
  intro: { fontStyle: "italic", opacity: 0.85, marginBottom: 14 },
  body: { fontSize: 17, lineHeight: 1.5, marginBottom: 12 },
  safety: { color: "#ffb84d", fontSize: 14 },
  meta: { fontSize: 13, opacity: 0.7 },
  label: { display: "block", marginBottom: 8, fontSize: 14, opacity: 0.85 },
  textarea: {
    width: "100%", padding: 14,
    borderRadius: 14, border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.08)", color: "#f