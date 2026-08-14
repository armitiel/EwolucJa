/**
 * DevPanel — strona /dev. Inspektor quizu, dump stanu, akcje testowe.
 * Tylko do developmentu — nie eksponuj w produkcji.
 */

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE, ARCHETYPES } from "../config.js";
import { api, session } from "../services/api.js";

const PROFILE_LABELS = {
  EM: "Empata", ST: "Strateg", KR: "Kreator",
  LD: "Lider", DT: "Detektyw", MD: "Mediator",
};

export default function DevPanel() {
  const navigate = useNavigate();
  const [quizDebug, setQuizDebug] = useState(null);
  const [player, setPlayer] = useState(null);
  const [cycle, setCycle] = useState(null);
  const [mission, setMission] = useState(null);
  const [error, setError] = useState(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/onboarding/quiz-debug`).then((r) => r.json()).then(setQuizDebug).catch((e) => setError(e.message));
    refreshPlayer();
  }, []);

  async function refreshPlayer() {
    const id = session.getPlayer();
    if (!id) { setPlayer(null); setCycle(null); setMission(null); return; }
    try {
      setPlayer(await api.getPlayer(id));
      try { setCycle(await api.getCurrentCycle(id)); } catch { setCycle(null); }
      try { setMission(await api.getCurrentMission(id)); } catch { setMission(null); }
    } catch (e) {
      setError(e.message);
    }
  }

  async function genMission() {
    const id = session.getPlayer();
    if (!id) return alert("Brak gracza");
    setGenerating(true);
    try {
      await api.generateMission(id);
      await refreshPlayer();
    } catch (e) {
      alert(e.message);
    } finally {
      setGenerating(false);
    }
  }

  async function startNewCycle() {
    const id = session.getPlayer();
    if (!id) return alert("Brak gracza");
    try {
      await api.startCycle(id);
      await refreshPlayer();
    } catch (e) {
      alert(e.message);
    }
  }

  return (
    <div style={styles.wrap}>
      <header style={styles.header}>
        <button style={styles.back} onClick={() => navigate("/")}>← Wróć</button>
        <h1 style={styles.title}>DEV PANEL</h1>
      </header>
      {error && <p style={styles.err}>{error}</p>}

      {/* ── 1. Quiz Inspector ──────────────────────────────────── */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Quiz onboardingu</h2>
        {!quizDebug ? (
          <p style={styles.muted}>Ładuję…</p>
        ) : (
          <>
            <p style={styles.muted}>
              Profil → archetyp:{" "}
              {Object.entries(quizDebug.profile_to_archetype).map(([p, a]) => (
                <span key={p} style={styles.tag}>
                  {p} → {a}
                  {quizDebug.mvp_available_archetypes.includes(a) && <span style={styles.mvp}> ★ MVP</span>}
                </span>
              ))}
            </p>
            {quizDebug.questions.map((q, i) => (
              <div key={q.question_id} style={styles.qBox}>
                <p style={styles.qNum}>{i + 1}. {q.question_id}</p>
                <p style={styles.qText}>{q.question}</p>
                <div style={styles.aGrid}>
                  {q.answers.map((a) => (
                    <div key={a.answer_id} style={styles.aBox}>
                      <p style={styles.aLabel}>{a.answer_id}: {a.text}</p>
                      <div style={styles.points}>
                        {Object.entries(a.points).map(([p, v]) => (
                          <span key={p} style={{ ...styles.pointTag, color: v < 0 ? "#ff8a8a" : "#a3e635" }}>
                            {PROFILE_LABELS[p]} {v > 0 ? `+${v}` : v}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
      </section>

      {/* ── 2. Player state dump ────────────────────────────────── */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Stan gracza</h2>
        {!player ? (
          <p style={styles.muted}>Brak zalogowanego gracza. <a style={styles.link} href="/onboarding">Stwórz nowego</a></p>
        ) : (
          <>
            <div style={styles.actionRow}>
              <button style={styles.btn} onClick={refreshPlayer}>Odśwież</button>
              <button style={styles.btn} onClick={genMission} disabled={generating}>
                {generating ? "Generuję…" : "Wymuś nową misję"}
              </button>
              <button style={styles.btn} onClick={startNewCycle}>Wystartuj nowy cykl</button>
            </div>
            <details style={styles.details}>
              <summary style={styles.summary}>Player JSON</summary>
              <pre style={styles.pre}>{JSON.stringify(player, null, 2)}</pre>
            </details>
            {cycle && (
              <details style={styles.details}>
                <summary style={styles.summary}>Aktywny cykl</summary>
                <pre style={styles.pre}>{JSON.stringify(cycle, null, 2)}</pre>
              </details>
            )}
            {mission && (
              <details style={styles.details}>
                <summary style={styles.summary}>Aktualna misja</summary>
                <pre style={styles.pre}>{JSON.stringify(mission, null, 2)}</pre>
              </details>
            )}
          </>
        )}
      </section>

      {/* ── 3. Archetypy ───────────────────────────────────────── */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Archetypy w MVP</h2>
        <div style={styles.archGrid}>
          {Object.values(ARCHETYPES).map((a) => (
            <div
              key={a.id}
              style={{
                ...styles.archCard,
                borderColor: a.accent_color,
                opacity: a.available_in_mvp ? 1 : 0.4,
              }}
            >
              <p style={styles.archName}>{a.name} {a.available_in_mvp && "★"}</p>
              <p style={styles.muted}>{a.profile} • {a.id}</p>
              <p style={styles.archTag}>{a.tagline}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. Skróty nawigacji ────────────────────────────────── */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Skróty</h2>
        <div style={styles.actionRow}>
          <button style={styles.btn} onClick={() => navigate("/")}>/</button>
          <button style={styles.btn} onClick={() => navigate("/onboarding")}>/onboarding</button>
          <button style={styles.btn} onClick={() => navigate("/swiat")}>/swiat</button>
          <button style={styles.btn} onClick={() => navigate("/mission")}>/mission</button>
          <button style={styles.btn} onClick={() => navigate("/invite-gm")}>/invite-gm</button>
          <button style={styles.btn} onClick={() => navigate("/gm")}>/gm</button>
          <button style={styles.btn} onClick={() => navigate("/play")}>/play (V1)</button>
        </div>
      </section>
    </div>
  );
}

const styles = {
  wrap: {
    minHeight: "100vh",
    background: "#0d0f18",
    color: "#fff",
    padding: "20px 18px 80px",
    maxWidth: 880,
    margin: "0 auto",
    fontFamily: "system-ui, -apple-system, sans-serif",
    boxSizing: "border-box",
  },
  header: { display: "flex", alignItems: "center", gap: 14, marginBottom: 18 },
  back: { background: "transparent", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 10, padding: "6px 12px", cursor: "pointer" },
  title: { fontSize: 22, color: "#ffd166", letterSpacing: 2, margin: 0 },
  err: { color: "#ff8a8a" },
  section: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
  },
  sectionTitle: { fontSize: 16, marginTop: 0, color: "#ffd166" },
  muted: { opacity: 0.65, fontSize: 13 },
  tag: { display: "inline-block", marginRight: 8, padding: "2px 8px", background: "rgba(155,89,182,0.15)", border: "1px solid rgba(155,89,182,0.35)", borderRadius: 8, fontSize: 12, fontFamily: "monospace" },
  mvp: { color: "#ffd166", marginLeft: 4 },
  qBox: { padding: 12, marginTop: 10, background: "rgba(0,0,0,0.25)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)" },
  qNum: { margin: "0 0 4px", fontSize: 11, opacity: 0.6, fontFamily: "monospace" },
  qText: { margin: "0 0 10px", fontSize: 14 },
  aGrid: { display: "grid", gridTemplateColumns: "1fr", gap: 8 },
  aBox: { padding: 10, background: "rgba(255,255,255,0.04)", borderRadius: 8 },
  aLabel: { margin: "0 0 6px", fontSize: 13 },
  points: { display: "flex", flexWrap: "wrap", gap: 6 },
  pointTag: { fontSize: 12, fontFamily: "monospace", padding: "2px 6px", background: "rgba(0,0,0,0.3)", borderRadius: 6 },
  details: { marginTop: 10, padding: 8, background: "rgba(0,0,0,0.25)", borderRadius: 8 },
  summary: { cursor: "pointer", fontSize: 13, opacity: 0.85 },
  pre: { fontSize: 11, fontFamily: "monospace", overflow: "auto", maxHeight: 320, color: "#a3e635", margin: "8px 0 0" },
  actionRow: { display: "flex", flexWrap: "wrap", gap: 8 },
  btn: { padding: "8px 12px", background: "rgba(155,89,182,0.15)", color: "#fff", border: "1px solid rgba(155,89,182,0.35)", borderRadius: 10, cursor: "pointer", fontSize: 13 },
  archGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10 },
  archCard: { padding: 12, background: "rgba(255,255,255,0.04)", border: "2px solid", borderRadius: 12 },
  archName: { fontSize: 14, fontWeight: 600, margin: "0 0 4px" },
  archTag: { fontSize: 12, fontStyle: "italic", opacity: 0.85, margin: "6px 0 0" },
  link: { color: "#ffd166" },
};
