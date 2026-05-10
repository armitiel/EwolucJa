/**
 * DevPanel — strona /dev. Inspektor quizu, dump stanu, akcje testowe,
 * tester generatora misji (porównanie z lore archetypu).
 */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE, ARCHETYPES } from "../config.js";
import { api, session } from "../services/api.js";

const PROFILE_LABELS = {
  EM: "Empata", ST: "Strateg", KR: "Kreator",
  LD: "Lider", DT: "Detektyw", MD: "Mediator",
};

// Słowa-klucze świata Zakątek Gama — używane do heurystycznej oceny "czy używa lore"
const LORE_KEYWORDS = ["trop", "zwój", "echo", "kronik", "plecak", "kompas cieni", "świecąc", "swieca", "tropi", "zwoj", "kompas"];

// Słowa charakterystyczne per archetyp — dopasowanie tekstu do osobowości
const ARCHETYPE_KEYWORDS = {
  tropiciel_tajemnic: { emoji: "🦊", words: ["pytan", "trop", "ślad", "slad", "cień", "cien", "tajemnic", "kompas", "lupa", "detektyw", "obserwuj", "zauważ", "zauwaz"] },
  zaklinacz_uczuc:    { emoji: "❤️", words: ["uczuc", "emocj", "serce", "kolor", "fal", "muszla", "słuchaj", "sluchaj", "wrażliw", "wrazliw"] },
  mistrz_map:         { emoji: "🗺️", words: ["mapa", "krok", "plan", "kompas", "strateg", "polic", "kolejność", "kolejnosc", "drog"] },
  tkacz_snow:         { emoji: "✨", words: ["sen", "wyobraź", "wyobraz", "marz", "kreatywn", "narysu", "wymyśl", "wymysl", "iskra", "pomysł", "pomysl", "tkaj"] },
  gwardzista_odwagi:  { emoji: "🛡️", words: ["odwag", "śmiał", "smial", "tarcza", "lid", "prowadź", "prowadz", "bądź pierwszy", "badz pierwszy", "stań", "stan"] },
  straznik_mostu:     { emoji: "🌉", words: ["most", "łącz", "lacz", "godzi", "obie stron", "kompromis", "razem", "porozumi", "poslucha"] },
};

function lower(s) { return (s || "").toLowerCase(); }

function evaluateMission(mission, archetype) {
  const text = lower(`${mission.title} ${mission.body} ${mission.narrative_intro || ""}`);
  const lore = LORE_KEYWORDS.filter((w) => text.includes(w));
  const archProfile = (ARCHETYPES[archetype]?.profile) || "DT";
  const archKw = ARCHETYPE_KEYWORDS[archetype] || ARCHETYPE_KEYWORDS.tropiciel_tajemnic;
  const archMatches = archKw.words.filter((w) => text.includes(w));
  const competencyMatch = (mission.competency_focus || []).includes(archProfile);
  return {
    lore_words: lore,
    archetype_words: archMatches,
    competency_match: competencyMatch,
    score: (lore.length > 0 ? 1 : 0) + (archMatches.length > 0 ? 1 : 0) + (competencyMatch ? 1 : 0), // 0-3
  };
}

export default function DevPanel() {
  const navigate = useNavigate();
  const [quizDebug, setQuizDebug] = useState(null);
  const [player, setPlayer] = useState(null);
  const [cycle, setCycle] = useState(null);
  const [mission, setMission] = useState(null);
  const [error, setError] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [batchTest, setBatchTest] = useState(null);
  const [batchRunning, setBatchRunning] = useState(false);
  const [narrativeStatus, setNarrativeStatus] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/onboarding/quiz-debug`).then((r) => r.json()).then(setQuizDebug).catch((e) => setError(e.message));
    fetch(`${API_BASE}/narrative/status`).then((r) => r.json()).then(setNarrativeStatus).catch(() => {});
    refreshPlayer();
  }, []);

  async function refreshPlayer() {
    const id = session.getPlayer();
    if (!id) { setPlayer(null); setCycle(null); setMission(null); return; }
    try {
      setPlayer(await api.getPlayer(id));
      try { setCycle(await api.getCurrentCycle(id)); } catch { setCycle(null); }
      try { setMission(await api.getCurrentMission(id)); } catch { setMission(null); }
    } catch (e) { setError(e.message); }
  }

  async function genMission() {
    const id = session.getPlayer();
    if (!id) return alert("Brak gracza");
    setGenerating(true);
    try {
      await api.generateMission(id);
      await refreshPlayer();
    } catch (e) { alert(e.message); }
    finally { setGenerating(false); }
  }

  async function runBatchTest() {
    const id = session.getPlayer();
    if (!id || !player?.archetype) return alert("Najpierw stwórz gracza i przejdź onboarding (musi mieć archetyp).");
    setBatchRunning(true);
    setBatchTest(null);
    try {
      const results = [];
      for (let i = 0; i < 5; i++) {
        const m = await api.generateMission(id);
        results.push({ ...m, evaluation: evaluateMission(m, player.archetype) });
      }
      setBatchTest(results);
    } catch (e) {
      alert(e.message);
    } finally {
      setBatchRunning(false);
    }
  }

  async function startNewCycle() {
    const id = session.getPlayer();
    if (!id) return alert("Brak gracza");
    try { await api.startCycle(id); await refreshPlayer(); } catch (e) { alert(e.message); }
  }

  return (
    <div style={styles.wrap}>
      <header style={styles.header}>
        <button style={styles.back} onClick={() => navigate("/")}>← Wróć</button>
        <h1 style={styles.title}>DEV PANEL</h1>
      </header>
      {error && <p style={styles.err}>{error}</p>}

      {/* Status generatora */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Generator narracji (Claude API)</h2>
        {!narrativeStatus ? <p style={styles.muted}>Ładuję…</p> : (
          <div>
            <p style={styles.muted}>
              Status: {narrativeStatus.available ? <span style={{ color: "#a3e635" }}>● dostępny</span> : <span style={{ color: "#ff8a8a" }}>● niedostępny (brak ANTHROPIC_API_KEY)</span>}
            </p>
            <p style={styles.muted}>Model: <span style={{ color: "#ffd166" }}>{narrativeStatus.model}</span></p>
          </div>
        )}
      </section>

      {/* Tester generatora vs archetyp */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Test dopasowania misji do archetypu</h2>
        {!player ? (
          <p style={styles.muted}>Najpierw stwórz gracza i przejdź onboarding.</p>
        ) : !player.archetype ? (
          <p style={styles.muted}>Gracz nie ma jeszcze archetypu — przejdź quiz w /onboarding.</p>
        ) : (
          <>
            <div style={styles.archHeader}>
              {(() => {
                const a = ARCHETYPES[player.archetype];
                const k = ARCHETYPE_KEYWORDS[player.archetype];
                return (
                  <>
                    <span style={{ fontSize: 32 }}>{k?.emoji || "🦊"}</span>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{a?.name}</div>
                      <div style={styles.muted}>profil: {a?.profile} • {a?.tagline}</div>
                    </div>
                  </>
                );
              })()}
            </div>
            <button style={{ ...styles.btn, marginTop: 10 }} onClick={runBatchTest} disabled={batchRunning}>
              {batchRunning ? "Generuję 5 misji…" : "Wygeneruj 5 misji testowych"}
            </button>
            <p style={styles.muted}>
              Każda misja jest oceniana heurystycznie: <b>słowa lore</b> (Kronika, trop, kompas…), <b>słowa archetypu</b> (charakterystyczne dla osobowości), <b>competency_focus</b> zawiera profil archetypu.
            </p>

            {batchTest && (
              <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
                <SummaryRow results={batchTest} />
                {batchTest.map((m, i) => <MissionCard key={i} mission={m} index={i} />)}
              </div>
            )}
          </>
        )}
      </section>

      {/* Quiz inspector */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Quiz onboardingu</h2>
        {!quizDebug ? <p style={styles.muted}>Ładuję…</p> : (
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
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 8 }}>
                  {q.answers.map((a) => (
                    <div key={a.answer_id} style={styles.aBox}>
                      <p style={styles.aLabel}>{a.answer_id}: {a.text}</p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
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

      {/* Stan gracza */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Stan gracza</h2>
        {!player ? (
          <p style={styles.muted}>Brak zalogowanego gracza. <a style={styles.link} href="/onboarding">Stwórz nowego</a></p>
        ) : (
          <>
            <div style={styles.actionRow}>
              <button style={styles.btn} onClick={refreshPlayer}>Odśwież</button>
              <button style={styles.btn} onClick={genMission} disabled={generating}>{generating ? "Generuję…" : "Wymuś nową misję"}</button>
              <button style={styles.btn} onClick={startNewCycle}>Wystartuj nowy cykl</button>
            </div>
            <details style={styles.details}><summary style={styles.summary}>Player JSON</summary><pre style={styles.pre}>{JSON.stringify(player, null, 2)}</pre></details>
            {cycle && <details style={styles.details}><summary style={styles.summary}>Aktywny cykl</summary><pre style={styles.pre}>{JSON.stringify(cycle, null, 2)}</pre></details>}
            {mission && <details style={styles.details}><summary style={styles.summary}>Aktualna misja</summary><pre style={styles.pre}>{JSON.stringify(mission, null, 2)}</pre></details>}
          </>
        )}
      </section>

      {/* Skróty */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Skróty</h2>
        <div style={styles.actionRow}>
          {["/", "/onboarding", "/world", "/map", "/backpack", "/profile", "/mission", "/reward", "/invite-gm", "/gm", "/play"].map((r) => (
            <button key={r} style={styles.btn} onClick={() => navigate(r)}>{r}</button>
          ))}
        </div>
      </section>
    </div>
  );
}

function SummaryRow({ results }) {
  const totals = results.reduce(
    (acc, r) => ({
      claude: acc.claude + (r.source === "claude" ? 1 : 0),
      seed: acc.seed + (r.source === "seed" ? 1 : 0),
      score3: acc.score3 + (r.evaluation.score === 3 ? 1 : 0),
      score2: acc.score2 + (r.evaluation.score === 2 ? 1 : 0),
      avg: acc.avg + r.evaluation.score,
    }),
    { claude: 0, seed: 0, score3: 0, score2: 0, avg: 0 }
  );
  return (
    <div style={{ background: "rgba(0,0,0,0.3)", padding: 12, borderRadius: 10, fontSize: 13 }}>
      <div style={{ fontWeight: 600, marginBottom: 6, color: "#ffd166" }}>PODSUMOWANIE 5 MISJI</div>
      <div>Źródło: <b style={{ color: "#a3e635" }}>{totals.claude} Claude</b> / <b style={{ color: "#ffb84d" }}>{totals.seed} seed</b></div>
      <div>Średni score (0-3): <b>{(totals.avg / 5).toFixed(2)}</b></div>
      <div>Pełne dopasowanie (3/3): <b>{totals.score3}</b> / Częściowe (2/3): <b>{totals.score2}</b></div>
    </div>
  );
}

function MissionCard({ mission, index }) {
  const ev = mission.evaluation;
  const scoreColor = ev.score === 3 ? "#a3e635" : ev.score === 2 ? "#ffd166" : "#ff8a8a";
  return (
    <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: 12, border: `1px solid ${scoreColor}40` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
        <div>
          <span style={{ ...styles.pointTag, background: mission.source === "claude" ? "rgba(155,89,182,.2)" : "rgba(255,184,77,.2)" }}>
            {mission.source === "claude" ? "✦ Claude" : "📚 seed"}
          </span>
          <h3 style={{ margin: "6px 0 4px", fontSize: 14 }}>#{index + 1} {mission.title}</h3>
        </div>
        <div style={{ fontSize: 22, fontWeight: 700, color: scoreColor }}>{ev.score}/3</div>
      </div>
      {mission.narrative_intro && <p style={{ fontSize: 12, fontStyle: "italic", opacity: 0.85, margin: "4px 0" }}>„{mission.narrative_intro}"</p>}
      <p style={{ fontSize: 13, margin: "4px 0 8px" }}>{mission.body}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, fontSize: 11 }}>
        <span style={styles.pointTag}>focus: {(mission.competency_focus || []).join(", ")}</span>
        <span style={{ ...styles.pointTag, color: ev.competency_match ? "#a3e635" : "#ff8a8a" }}>
          {ev.competency_match ? "✓" : "✗"} dopasowanie kompetencji
        </span>
        <span style={{ ...styles.pointTag, color: ev.lore_words.length > 0 ? "#a3e635" : "#ff8a8a" }}>
          lore: {ev.lore_words.length > 0 ? ev.lore_words.join(", ") : "brak"}
        </span>
        <span style={{ ...styles.pointTag, color: ev.archetype_words.length > 0 ? "#a3e635" : "#ff8a8a" }}>
          archetyp: {ev.archetype_words.length > 0 ? ev.archetype_words.join(", ") : "brak"}
        </span>
      </div>
    </div>
  );
}

const styles = {
  wrap: { minHeight: "100vh", background: "#0d0f18", color: "#fff", padding: "20px 18px 80px", maxWidth: 880, margin: "0 auto", fontFamily: "system-ui, -apple-system, sans-serif", boxSizing: "border-box" },
  header: { display: "flex", alignItems: "center", gap: 14, marginBottom: 18 },
  back: { background: "transparent", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 10, padding: "6px 12px", cursor: "pointer" },
  title: { fontSize: 22, color: "#ffd166", letterSpacing: 2, margin: 0 },
  err: { color: "#ff8a8a" },
  section: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: 16, marginBottom: 14 },
  sectionTitle: { fontSize: 16, marginTop: 0, color: "#ffd166" },
  muted: { opacity: 0.65, fontSize: 13 },
  archHeader: { display: "flex", alignItems: "center", gap: 12, padding: 10, background: "rgba(155,89,182,0.1)", borderRadius: 10, border: "1px solid rgba(155,89,182,0.3)" },
  tag: { display: "inline-block", marginRight: 8, padding: "2px 8px", background: "rgba(155,89,182,0.15)", border: "1px solid rgba(155,89,182,0.35)", borderRadius: 8, fontSize: 12, fontFamily: "monospace" },
  mvp: { color: "#ffd166", marginLeft: 4 },
  qBox: { padding: 12, marginTop: 10, background: "rgba(0,0,0,0.25)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)" },
  qNum: { margin: "0 0 4px", fontSize: 11, opacity: 0.6, fontFamily: "monospace" },
  qText: { margin: "0 0 10px", fontSize: 14 },
  aBox: { padding: 10, background: "rgba(255,255,255,0.04)", borderRadius: 8 },
  aLabel: { margin: "0 0 6px", fontSize: 13 },
  pointTag: { fontSize: 11, fontFamily: "monospace", padding: "2px 6px", background: "rgba(0,0,0,0.3)", borderRadius: 6, display: "inline-block" },
  details: { marginTop: 10, padding: 8, background: "rgba(0,0,0,0.25)", borderRadius: 8 },
  summary: { cursor: "pointer", fontSize: 13, opacity: 0.85 },
  pre: { fontSize: 11, fontFamily: "monospace", overflow: "auto", maxHeight: 320, color: "#a3e635", margin: "8px 0 0" },
  actionRow: { display: "flex", flexWrap: "wrap", gap: 8 },
  btn: { padding: "8px 12px", background: "rgba(155,89,182,0.15)", color: "#fff", border: "1px solid rgba(155,89,182,0.35)", borderRadius: 10, cursor: "pointer", fontSize: 13 },
  link: { color: "#ffd166" },
};
