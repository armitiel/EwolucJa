/**
 * GMPanel — panel Game Mastera (rodzic / nauczyciel).
 *
 * Architektura: dziecko widzi JEDNĄ personę GM. Tu dorosły loguje się
 * własnym kontem (rejestracja → kod parowania → kolejka misji do weryfikacji).
 */

import React, { useEffect, useState } from "react";
import { api, session } from "../services/api.js";
import NarratorVoice from "../components/NarratorVoice.jsx";

export default function GMPanel() {
  const [account, setAccount] = useState(null);
  const [step, setStep] = useState("auth"); // auth | dashboard
  const [authMode, setAuthMode] = useState("register"); // register | login
  const [form, setForm] = useState({ role: "parent", name: "", email: "", pairing_code: "" });
  const [loginId, setLoginId] = useState("");
  const [queue, setQueue] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = session.getGM();
    if (saved) loadAccount(saved);
  }, []);

  async function loadAccount(id) {
    try {
      const acc = await api.getGM(id);
      setAccount(acc);
      session.setGM(acc.account_id);
      const q = await api.getGMQueue(acc.account_id);
      setQueue(q.missions || []);
      setStep("dashboard");
    } catch (e) {
      setError(e.message);
      session.setGM("");
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const acc = await api.registerGM({
        role: form.role,
        name: form.name,
        email: form.email,
        pairing_code: form.pairing_code || undefined,
      });
      session.setGM(acc.account_id);
      await loadAccount(acc.account_id);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await loadAccount(loginId.trim());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(missionId, verdict, comment) {
    try {
      await api.verifyMission(missionId, {
        account_id: account.account_id,
        verdict,
        comment_text: comment || "",
      });
      const q = await api.getGMQueue(account.account_id);
      setQueue(q.missions || []);
    } catch (e) {
      setError(e.message);
    }
  }

  function logout() {
    session.setGM("");
    setAccount(null);
    setStep("auth");
    setQueue([]);
  }

  // ── UI ──
  if (step === "auth") {
    return (
      <div style={styles.wrap}>
        <div style={styles.card}>
          <h1 style={styles.title}>Panel Mentora</h1>
          <p style={styles.muted}>
            Tu logujesz się jako rodzic lub nauczyciel. Z perspektywy dziecka pozostajesz
            jednym wspólnym Mentorem.
          </p>

          <div style={styles.tabs}>
            <button
              style={authMode === "register" ? styles.tabActive : styles.tab}
              onClick={() => setAuthMode("register")}
            >
              Nowe konto
            </button>
            <button
              style={authMode === "login" ? styles.tabActive : styles.tab}
              onClick={() => setAuthMode("login")}
            >
              Mam konto
            </button>
          </div>

          {authMode === "register" ? (
            <form onSubmit={handleRegister}>
              <label style={styles.label}>Rola</label>
              <div style={styles.roleRow}>
                <button
                  type="button"
                  style={form.role === "parent" ? styles.roleBtnActive : styles.roleBtn}
                  onClick={() => setForm({ ...form, role: "parent" })}
                >
                  Rodzic
                </button>
                <button
                  type="button"
                  style={form.role === "teacher" ? styles.roleBtnActive : styles.roleBtn}
                  onClick={() => setForm({ ...form, role: "teacher" })}
                >
                  Nauczyciel
                </button>
              </div>
              <label style={styles.label}>Twoje imię</label>
              <input
                style={styles.input}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <label style={styles.label}>E-mail (opcjonalnie)</label>
              <input
                style={styles.input}
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <label style={styles.label}>Kod parowania od dziecka (opcjonalnie)</label>
              <input
                style={styles.input}
                value={form.pairing_code}
                onChange={(e) => setForm({ ...form, pairing_code: e.target.value.toUpperCase() })}
                placeholder="ABC123"
              />
              <button type="submit" style={styles.btn} disabled={loading}>
                {loading ? "Tworzę…" : "Utwórz konto Mentora"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleLogin}>
              <label style={styles.label}>Identyfikator konta GM</label>
              <input
                style={styles.input}
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                placeholder="gm_..."
                required
              />
              <button type="submit" style={styles.btn} disabled={loading}>
                {loading ? "Loguję…" : "Zaloguj"}
              </button>
            </form>
          )}

          {error && <p style={styles.err}>{error}</p>}
        </div>
      </div>
    );
  }

  // dashboard
  return (
    <div style={styles.wrap}>
      <header style={styles.header}>
        <div>
          <p style={styles.muted}>Mentor ({account.role === "parent" ? "rodzic" : "nauczyciel"})</p>
          <h1 style={styles.title}>{account.name}</h1>
          <p style={{ ...styles.muted, fontSize: 12 }}>ID: {account.account_id}</p>
        </div>
        <button style={styles.logout} onClick={logout}>Wyloguj</button>
      </header>

      <section style={styles.card}>
        <h2 style={styles.section}>Twoi podopieczni</h2>
        {account.paired_player_ids.length === 0 ? (
          <p style={styles.muted}>
            Nikt jeszcze nie jest podpięty. Poproś dziecko (lub drugiego rodzica)
            o kod parowania, a potem wpisz go w nowym koncie albo użyj opcji "dodaj kod".
          </p>
        ) : (
          <ul style={styles.list}>
            {account.paired_player_ids.map((pid) => (
              <li key={pid} style={styles.listItem}>{pid}</li>
            ))}
          </ul>
        )}
      </section>

      <section style={styles.card}>
        <h2 style={styles.section}>Misje czekają na weryfikację ({queue.length})</h2>
        {queue.length === 0 ? (
          <p style={styles.muted}>Wszystko ogarnięte. W piątek wracaj — tam się dzieje.</p>
        ) : (
          queue.map((m) => <MissionVerifyCard key={m.mission_id} mission={m} onVerify={handleVerify} />)
        )}
      </section>
    </div>
  );
}

function MissionVerifyCard({ mission, onVerify }) {
  const [comment, setComment] = useState("");
  // Mentor odsłuchuje wpis dziecka głosem Mentora (osobny voice ID)
  const proofText = mission.submitted_proof?.proof_text || "";
  return (
    <div style={styles.missionCard}>
      <p style={styles.muted}>{mission.player_name} • cykl {mission.cycle_id?.slice(-6)}</p>
      <h3 style={styles.missionTitle}>{mission.title}</h3>
      <p style={styles.missionBody}>{mission.body}</p>
      {proofText && (
        <div style={styles.proof}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
            <p style={styles.muted}>Dziecko napisało:</p>
            <NarratorVoice text={proofText} land="mentor" autoPlay={false} />
          </div>
          <p>{proofText}</p>
        </div>
      )}
      <textarea
        style={styles.textarea}
        rows={2}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Komentarz Mentora (opcjonalnie)"
      />
      <div style={styles.btnRow}>
        <button style={styles.btnApprove} onClick={() => onVerify(mission.mission_id, "approved", comment)}>
          ✅ Zatwierdź
        </button>
        <button style={styles.btnHighlight} onClick={() => onVerify(mission.mission_id, "highlighted", comment)}>
          🌟 Wyróżnij
        </button>
        <button style={styles.btnFollowup} onClick={() => onVerify(mission.mission_id, "needs_followup", comment)}>
          💬 Dopytaj
        </button>
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f1730 0%, #182447 50%, #0f1730 100%)",
    color: "#fff",
    padding: "24px 18px 60px",
    maxWidth: 720,
    margin: "0 auto",
    boxSizing: "border-box",
  },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 },
  card: {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 22, padding: 20, marginBottom: 16,
  },
  title: { fontSize: 26, margin: "0" },
  muted: { opacity: 0.65, fontSize: 13, margin: "0 0 4px" },
  section: { fontSize: 17, marginTop: 0 },
  list: { listStyle: "none", padding: 0, margin: 0 },
  listItem: { padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.08)", fontSize: 14 },
  tabs: { display: "flex", gap: 6, marginBottom: 14 },
  tab: { flex: 1, padding: "10px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#fff", cursor: "pointer" },
  tabActive: { flex: 1, padding: "10px", background: "rgba(155,89,182,0.25)", border: "1px solid #9b59b6", borderRadius: 12, color: "#fff", cursor: "pointer", fontWeight: 600 },
  label: { display: "block", margin: "10px 0 6px", fontSize: 13, opacity: 0.85 },
  input: {
    width: "100%", padding: "12px 14px",
    borderRadius: 12, border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(255,255,255,0.07)", color: "#fff",
    fontSize: 15, boxSizing: "border-box",
  },
  roleRow: { display: "flex", gap: 8, marginBottom: 6 },
  roleBtn: { flex: 1, padding: "10px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, color: "#fff", cursor: "pointer" },
  roleBtnActive: { flex: 1, padding: "10px", background: "linear-gradient(135deg, #6a3aa3, #4f2680)", border: "1px solid #9b59b6", borderRadius: 12, color: "#fff", fontWeight: 600, cursor: "pointer" },
  btn: {
    width: "100%", marginTop: 14, padding: 14,
    background: "linear-gradient(135deg, #6a3aa3, #4f2680)",
    border: "none", borderRadius: 14,
    color: "#fff", fontSize: 16, fontWeight: 600, cursor: "pointer",
  },
  logout: { background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", borderRadius: 10, padding: "6px 12px", cursor: "pointer", height: "fit-content" },
  err: { color: "#ff8a8a", marginTop: 10 },
  missionCard: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 16, padding: 14, marginBottom: 12,
  },
  missionTitle: { fontSize: 17, margin: "4px 0" },
  missionBody: { fontSize: 14, opacity: 0.9, marginBottom: 8 },
  proof: { padding: "8px 10px", background: "rgba(255,255,255,0.05)", borderRadius: 10, marginBottom: 10, fontSize: 14 },
  textarea: { width: "100%", padding: 10, borderRadius: 10, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.06)", color: "#fff", fontSize: 14, fontFamily: "inherit", boxSizing: "border-box", resize: "vertical" },
  btnRow: { display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" },
  btnApprove: { flex: 1, padding: "10px", background: "rgba(46,204,113,0.2)", border: "1px solid #2ecc71", borderRadius: 10, color: "#fff", cursor: "pointer", fontSize: 14 },
  btnHighlight: { flex: 1,