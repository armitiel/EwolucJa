/**
 * DevTools — pływająca pinetka programisty.
 * Widoczna na każdej stronie (mount w main.jsx). Daje szybki dostęp do:
 *  - resetu sesji (wyloguj gracza, wyloguj GM, wipe wszystko)
 *  - panelu /dev (inspektor quizu, dump stanu)
 *  - bieżącego playerId i gmId
 *
 * Domyślnie schowana — kliknij "DEV" w prawym dolnym rogu.
 */

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { session } from "../services/api.js";
import { ttsPlayer } from "../services/ttsPlayer";

export default function DevTools() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [playerId, setPlayerId] = useState(session.getPlayer());
  const [gmId, setGmId] = useState(session.getGM());

  // Odśwież snapshot sesji przy każdej zmianie ścieżki
  useEffect(() => {
    setPlayerId(session.getPlayer());
    setGmId(session.getGM());
  }, [location.pathname]);

  function logoutPlayer() {
    if (!confirm("Wyloguj gracza i zacznij nową postać?")) return;
    session.setPlayer("");
    setPlayerId(null);
    ttsPlayer.stop();
    navigate("/onboarding");
  }

  function logoutGM() {
    if (!confirm("Wyloguj Mentora?")) return;
    session.setGM("");
    setGmId(null);
    navigate("/gm");
  }

  function wipeAll() {
    if (!confirm("WIPE — wyczyścić całą sesję (gracz + GM)?")) return;
    session.clear();
    setPlayerId(null);
    setGmId(null);
    ttsPlayer.stop();
    navigate("/");
  }

  if (!open) {
    return (
      <button
        style={styles.fab}
        onClick={() => setOpen(true)}
        title="Otwórz narzędzia developera"
      >
        ⚙️ DEV
      </button>
    );
  }

  return (
    <div style={styles.panel}>
      <div style={styles.head}>
        <strong>DevTools</strong>
        <button style={styles.closeBtn} onClick={() => setOpen(false)}>×</button>
      </div>

      <div style={styles.section}>
        <p style={styles.label}>Sesja</p>
        <p style={styles.kv}>
          <span style={styles.k}>player:</span>{" "}
          <span style={styles.v}>{playerId || "—"}</span>
        </p>
        <p style={styles.kv}>
          <span style={styles.k}>gm:</span>{" "}
          <span style={styles.v}>{gmId || "—"}</span>
        </p>
        <p style={styles.kv}>
          <span style={styles.k}>route:</span>{" "}
          <span style={styles.v}>{location.pathname}</span>
        </p>
      </div>

      <div style={styles.section}>
        <button style={styles.btn} onClick={logoutPlayer} disabled={!playerId}>
          🧙 Wyloguj gracza (nowa postać)
        </button>
        <button style={styles.btn} onClick={logoutGM} disabled={!gmId}>
          🌟 Wyloguj Mentora
        </button>
        <button style={{ ...styles.btn, ...styles.btnDanger }} onClick={wipeAll}>
          🧨 Wyczyść wszystko
        </button>
      </div>

      <div style={styles.section}>
        <button style={styles.btnLink} onClick={() => { setOpen(false); navigate("/dev"); }}>
          → Inspektor quizu i stanu
        </button>
        <button style={styles.btnLink} onClick={() => { setOpen(false); navigate("/"); }}>
          → Strona startowa
        </button>
      </div>
    </div>
  );
}

const styles = {
  fab: {
    position: "fixed",
    right: 14,
    bottom: 14,
    zIndex: 9999,
    background: "rgba(20,20,30,0.85)",
    color: "#ffd166",
    border: "1px solid rgba(255,209,102,0.4)",
    borderRadius: 22,
    padding: "8px 14px",
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 1,
    cursor: "pointer",
    backdropFilter: "blur(8px)",
  },
  panel: {
    position: "fixed",
    right: 14,
    bottom: 14,
    width: 280,
    zIndex: 9999,
    background: "rgba(20,20,30,0.95)",
    color: "#fff",
    border: "1px solid rgba(255,209,102,0.3)",
    borderRadius: 16,
    padding: 14,
    fontSize: 13,
    backdropFilter: "blur(8px)",
    boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
  },
  head: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, color: "#ffd166" },
  closeBtn: { background: "transparent", border: "none", color: "#fff", fontSize: 20, cursor: "pointer", lineHeight: 1 },
  section: { marginBottom: 12, paddingBottom: 12, borderBottom: "1px solid rgba(255,255,255,0.08)" },
  label: { opacity: 0.6, fontSize: 11, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: 1 },
  kv: { margin: "3px 0", fontSize: 12, fontFamily: "monospace", wordBreak: "break-all" },
  k: { opacity: 0.6 },
  v: { color: "#ffd166" },
  btn: {
    width: "100%",
    padding: "8px 10px",
    marginBottom: 6,
    background: "rgba(255,255,255,0.06)",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 10,
    fontSize: 13,
    cursor: "pointer",
    textAlign: "left",
  },
  btnDanger: { background: "rgba(231,76,60,0.15)", borderColor: "rgba(231,76,60,0.4)", color: "#ff8a8a" },
  btnLink: {
    width: "100%",
    padding: "6px 8px",
    marginBottom: 4,
    background: "transparent",
    color: "#9b59b6",
    border: "none",
    fontSize: 13,
    cursor: "pointer",
    textAlign: "left",
  },
};
