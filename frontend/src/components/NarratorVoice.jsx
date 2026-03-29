import React, { useState, useEffect, useCallback } from "react";
import { ttsPlayer } from "../services/ttsPlayer";

/**
 * NarratorVoice — Przycisk odtwarzania głosu narratora
 *
 * Automatycznie wypowiada tekst narracji po zamontowaniu (jeśli autoPlay).
 * Pokazuje przycisk głośnika do powtórzenia / zatrzymania.
 *
 * Props:
 *  - text: string — tekst do wypowiedzenia
 *  - land: string — nazwa krainy (dobiera głos)
 *  - autoPlay: boolean — auto-odtwarzanie (domyślnie true)
 *  - compact: boolean — kompaktowy tryb (domyślnie false)
 */

const btnStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  padding: "8px 14px",
  borderRadius: "20px",
  border: "1px solid rgba(255,255,255,0.15)",
  background: "rgba(255,255,255,0.06)",
  color: "#ddd",
  fontSize: "13px",
  cursor: "pointer",
  transition: "all 0.2s",
  marginBottom: "12px",
};

const btnActiveStyle = {
  ...btnStyle,
  background: "rgba(233,69,96,0.15)",
  borderColor: "rgba(233,69,96,0.4)",
  color: "#e94560",
};

export default function NarratorVoice({ text, land, autoPlay = true, compact = false }) {
  const [playing, setPlaying] = useState(false);
  const [available, setAvailable] = useState(null); // null = checking
  const [muted, setMuted] = useState(false);

  // Sprawdź dostępność TTS
  useEffect(() => {
    ttsPlayer.checkAvailability().then(setAvailable);
  }, []);

  // Auto-play przy zmianie tekstu
  useEffect(() => {
    if (autoPlay && available && !muted && text) {
      handleSpeak();
    }
    return () => ttsPlayer.stop();
  }, [text, available, muted]);

  const handleSpeak = useCallback(async () => {
    if (!text || !available) return;
    setPlaying(true);
    await ttsPlayer.speak(text, { land });
    setPlaying(false);
  }, [text, land, available]);

  const handleToggle = useCallback(() => {
    if (playing) {
      ttsPlayer.stop();
      setPlaying(false);
    } else {
      handleSpeak();
    }
  }, [playing, handleSpeak]);

  const handleMuteToggle = useCallback(() => {
    const newMuted = !muted;
    setMuted(newMuted);
    ttsPlayer.enabled = !newMuted;
    if (newMuted) {
      ttsPlayer.stop();
      setPlaying(false);
    }
  }, [muted]);

  // Nie renderuj jeśli TTS niedostępny
  if (available === false) return null;
  if (available === null) return null; // loading

  if (compact) {
    return (
      <div style={{ display: "flex", gap: "4px" }}>
        <button
          onClick={handleToggle}
          style={playing ? btnActiveStyle : btnStyle}
          title={playing ? "Zatrzymaj" : "Posłuchaj"}
        >
          {playing ? "⏹️" : "🔊"}
        </button>
        <button
          onClick={handleMuteToggle}
          style={{ ...btnStyle, padding: "8px 10px" }}
          title={muted ? "Włącz głos" : "Wyłącz głos"}
        >
          {muted ? "🔇" : "🔈"}
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
      <button
        onClick={handleToggle}
        style={playing ? btnActiveStyle : btnStyle}
      >
        {playing ? "⏹️ Zatrzymaj" : "🔊 Posłuchaj"}
      </button>
      <button
        onClick={handleMuteToggle}
        style={{ ...btnStyle, padding: "8px 10px" }}
        title={muted ? "Włącz głos narratora" : "Wyłącz głos narratora"}
      >
        {muted ? "🔇" : "🔈"}
      </button>
      {playing && (
        <span style={{
          fontSize: "12px",
          color: "#e94560",
          animation: "pulse 1.5s infinite",
        }}>
          GAMA-1 mówi...
        </span>
      )}
    </div>
  );
}
