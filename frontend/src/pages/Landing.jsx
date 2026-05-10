/**
 * Landing — pierwszy ekran. Wybór ścieżki: dziecko (gracz) lub Mentor (rodzic/nauczyciel).
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import { session } from "../services/api.js";
import { ttsPlayer } from "../services/ttsPlayer";

export default function Landing() {
  const navigate = useNavigate();
  const playerId = session.getPlayer();
  const gmId = session.getGM();

  function goChild() {
    // Pierwszy gest użytkownika — odblokuj audio dla TTS (iOS/Safari wymaga gestu).
    ttsPlayer.unlock();
    navigate(playerId ? "/world" : "/onboarding");
  }

  function goGM() {
    ttsPlayer.unlock();
    navigate("/gm");
  }

  return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        <h1 style={styles.title}>EwolucJA</h1>
        <p style={styles.lead}>
          Świat, w którym Twoje wybory w realu rosną razem z Twoim bohaterem.
        </p>

        <div style={styles.row}>
          <button style={styles.btnChild} onClick={goChild}>
            <span style={styles.btnIcon}>🧙</span>
            <span style={styles.btnLabel}>Jestem bohaterem</span>
            <span style={styles.btnSub}>{playerId ? "Wróć do świata" : "Rozpocznij przygodę"}</span>
          </button>

          <button style={styles.btnGM} onClick={goGM}>
            <span style={styles.btnIcon}>🌟</span>
            <span style={styles.btnLabel}>Jestem Mentorem</span>
            <span style={styles.btnSub}>{gmId ? "Wróć do panelu" : "Panel rodzica / nauczyciela"}</span>
          </button>
        </div>

        <p style={styles.note}>
          Tryb klasyczny (wersja 1.0) — <a style={styles.link} href="/play">Otwórz starą grę</a>
        </p>
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    minHeight: "100vh",
    display: "flex", alignItems: "center", justifyContent: "center",
    background: "linear-gradient(135deg, #1a1040 0%, #2d1b4e 50%, #1a1a2e 100%)",
    padding: 20,
  },
  card: {
    maxWidth: 640, width: "100%",
    background: "rgba(255,255,255,0.06)",
    borderRadius: 28, padding: "40px 32px",
    color: "#fff", textAlign: "center",
    border: "1px solid rgba(255,255,255,0.1)",
  },
  title: { fontSize: 48, margin: "0 0 8px" },
  lead: { fontSize: 17, opacity: 0.85, marginBottom: 28 },
  row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 },
  btnChild: {
    display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
    padding: "24px 16px",
    background: "linear-gradient(135deg, #9b59b6, #6a3aa3)",
    border: "none", borderRadius: 18, color: "#fff", cursor: "pointer",
  },
  btnGM: {
    display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
    padding: "24px 16px",
    background: "linear-gradient(135deg, #f39c12, #d35400)",
    border: "none", borderRadius: 18, color: "#fff", cursor: "pointer",
  },
  btnIcon: { fontSize: 30 },
  btnLabel: { fontSiz