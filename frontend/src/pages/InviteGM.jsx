/**
 * InviteGM — generuje kod parowania, który dziecko (lub jego rodzic) przekazuje
 * drugiemu opiekunowi. Z perspektywy dziecka — Mentor pozostaje JEDEN.
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, session } from "../services/api.js";

export default function InviteGM() {
  const navigate = useNavigate();
  const [role, setRole] = useState("parent");
  const [code, setCode] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true);
    setError(null);
    try {
      const id = session.getPlayer();
      if (!id) throw new Error("Najpierw stwórz konto bohatera.");
      const res = await api.issuePairingCode(id, role, null);
      setCode(res);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.wrap}>
      <button style={styles.back} onClick={() => navigate("/world")}>← Wróć</button>
      <div style={styles.card}>
        <h1 style={styles.title}>Zaproś Mentora</h1>
        <p style={styles.lead}>
          Mentor to jedna postać widziana przez Ciebie. Może być nią rodzic lub nauczyciel —
          albo oboje, ale dla Ciebie zawsze brzmi tym samym głosem.
        </p>

        <label style={styles.label}>Kogo zapraszasz?</label>
        <div style={styles.roleRow}>
          <button
            style={role === "parent" ? styles.roleBtnActive : styles.roleBtn}
            onClick={() => setRole("parent")}
          >
            Rodzic
          </button>
          <button
            style={role === "teacher" ? styles.roleBtnActive : styles.roleBtn}
            onClick={() => setRole("teacher")}
          >
            Nauczyciel
          </button>
        </div>

        <button style={styles.btnPrimary} onClick={generate} disabled={loading}>
          {loading ? "Generuję…" : "Wygeneruj kod"}
        </button>
        {error && <p style={styles.err}>{error}</p>}

        {code && (
          <div style={styles.codeBox}>
            <p style={styles.muted}>Kod do przekazania:</p>
            <p style={styles.code}>{code.code}</p>
            <p style={styles.muted}>
              Powiedz dorosłemu, żeby wszedł na ekran "Mentor" w aplikacji i wpisał ten kod.
              Kod jest ważny 7 dni.
            </p>
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
    maxWidth: 560,
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
  title: { fontSize: 26, marginTop: 0 },
  lead: { fontSize: 14, opacity: 0.85, marginBottom: 18 },
  label: { display: "block", marginBottom: 8, fontSize: 14, opacity: 0.85 },
  roleRow: { display: "flex", gap: 10, marginBottom: 18 },
  roleBtn: {
    flex: 1, padding: "12px",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 12, color: "#fff", cursor: "pointer",
  },
  roleBtnActive: {
    flex: 1, padding: "12px",
    background: "linear-gradient(135deg, #9b59b6, #6a3aa3)",
    border: "1px solid #9b59b6",
    borderRadius: 12, color: "#fff", cursor: "pointer", fontWeight: 600,
  },
  btnPrimary: {
    width: "100%", padding: 14,
    background: "linear-gradient(135deg, #9b59b6, #6a3aa3)",
    border: "none", borderRadius: 14,
    color: "#fff", fontSize: 16, fontWeight: 600, cursor: "pointer",
  },
  err: { color: "#ff8a8a", marginTop: 10 },
  muted: { opacity: 0.65, fontSize: 13, margin: "8px 0" },
  codeBox: {
    marginTop: 18, padding: 18,
    background: "rgba(255,209,102,0.08)",
    border: "1px solid rgba(255,209,102,0.25)",
    borderRadius: 14, textAlign: "center",
  },
  code: {
    fontSize: 38, letterSpacing: 6, fontWeight: 700,
    margin: "8px 0", color: "#ffd166",
  },
};
