import React, { useState, useEffect, useCallback, useRef } from "react";
import { ttsPlayer } from "../services/ttsPlayer";

/**
 * NarratorVoice — Automatycznie czyta narrację głosem GAMA-1.
 *
 * Startuje automatycznie po zamontowaniu (po odblokowaniu audio).
 * Przycisk pozwala powtórzyć / zatrzymać / wyciszyć.
 *
 * Props:
 *  - text: string — tekst do wypowiedzenia
 *  - land: string — nazwa krainy (dobiera głos)
 *  - autoPlay: boolean — auto-odtwarzanie (domyślnie true)
 *  - compact: boolean — kompaktowy tryb
 */

const btnBase = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "6px",
  padding: "8px 14px",
  borderRadius: "20px",
  border: "1px solid rgba(255,255,255,0.15)",
  background: "rgba(255,255,255,0.06)",
  color: "#ddd",
  fontSize: "13px",
  cursor: "pointer",
  transition: "all 0.2s",
  outline: "none",
};

export default function NarratorVoice({ text, land, autoPlay = true, autoPlayDelay = 0, compact = false, onEnd = null }) {
  const [playing, setPlaying] = useState(false);
  const [available, setAvailable] = useState(null);
  const [unlocked, setUnlocked] = useState(ttsPlayer.isUnlocked);
  const [muted, setMuted] = useState(() => {
    try { return sessionStorage.getItem("ewolucja_muted") === "1"; } catch { return false; }
  });
  const lastTextRef = useRef("");
  const mountedRef = useRef(true);
  const playingRef = useRef(false);

  // Sprawdź dostępność TTS (raz)
  useEffect(() => {
    ttsPlayer.checkAvailability().then((ok) => {
      if (mountedRef.current) setAvailable(ok);
    }).catch(() => {
      if (mountedRef.current) setAvailable(false);
    });
    return () => { mountedRef.current = false; };
  }, []);

  // Nasłuchuj na unlock (user gesture) — sprawdzaj co 500ms
  useEffect(() => {
    if (unlocked) return;
    const interval = setInterval(() => {
      if (ttsPlayer.isUnlocked && mountedRef.current) {
        setUnlocked(true);
        clearInterval(interval);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [unlocked]);

  const setPlayingSync = useCallback((val) => {
    playingRef.current = val;
    setPlaying(val);
  }, []);

  // Auto-play gdy tekst się zmieni LUB gdy audio zostanie odblokowane
  useEffect(() => {
    if (!autoPlay || !available || muted || !text || !unlocked) return;
    if (text === lastTextRef.current) return;
    lastTextRef.current = text;

    let cancelled = false;
    const timer = setTimeout(async () => {
      if (cancelled) return;
      setPlayingSync(true);
      await ttsPlayer.speak(text, { land });
      if (!cancelled && mountedRef.current) {
        setPlayingSync(false);
        if (onEnd) onEnd();
      }
    }, autoPlayDelay);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      ttsPlayer.stop();
      if (mountedRef.current) setPlayingSync(false);
    };
  }, [text, available, muted, autoPlay, autoPlayDelay, land, unlocked, setPlayingSync, onEnd]);

  const handleSpeak = useCallback(async () => {
    if (!text || !available) return;
    ttsPlayer.unlock();
    // Zatrzymaj cokolwiek gra aktualnie
    ttsPlayer.stop();
    lastTextRef.current = text;
    setPlayingSync(true);
    await ttsPlayer.speak(text, { land });
    if (mountedRef.current) {
      setPlayingSync(false);
      if (onEnd) onEnd();
    }
  }, [text, land, available, setPlayingSync, onEnd]);

  const handleToggle = useCallback(() => {
    if (playing || playingRef.current) {
      ttsPlayer.stop();
      setPlayingSync(false);
    } else {
      handleSpeak();
    }
  }, [playing, handleSpeak, setPlayingSync]);

  const handleMuteToggle = useCallback(() => {
    const newMuted = !muted;
    setMuted(newMuted);
    ttsPlayer.enabled = !newMuted;
    try { sessionStorage.setItem("ewolucja_muted", newMuted ? "1" : "0"); } catch {}
    if (newMuted) {
      ttsPlayer.stop();
      setPlaying(false);
    }
  }, [muted]);

  // Nie renderuj dopóki nie sprawdzono dostępności (null = ładowanie)
  if (available === null) return null;

  // ── Style dynamiczne ──
  const activeBtn = {
    ...btnBase,
    background: "rgba(233,69,96,0.15)",
    borderColor: "rgba(233,69,96,0.4)",
    color: "#e94560",
  };

  const muteBtn = {
    ...btnBase,
    padding: "8px 10px",
    ...(muted ? { background: "rgba(255,255,255,0.03)", color: "#667" } : {}),
  };

  // ── Animacja pulsowania ──
  const pulseKeyframes = `
    @keyframes narrator-pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }
  `;

  if (compact) {
    return (
      <div style={{ display: "flex", gap: "4px" }}>
        <button onClick={handleToggle} style={playing ? activeBtn : btnBase}
          title={playing ? "Zatrzymaj" : "Posłuchaj"}>
          {playing ? "\u23F9\uFE0F" : "\uD83D\uDD0A"}
        </button>
        <button onClick={handleMuteToggle} style={muteBtn}
          title={muted ? "Włącz głos" : "Wyłącz głos"}>
          {muted ? "\uD83D\uDD07" : "\uD83D\uDD08"}
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
      <style>{pulseKeyframes}</style>
      <button onClick={handleToggle} style={playing ? activeBtn : btnBase}>
        {playing ? "\u23F9\uFE0F Zatrzymaj" : "\uD83D\uDD0A Posłuchaj"}
      </button>
      <button onClick={handleMuteToggle} style={muteBtn}
        title={muted ? "Włącz głos narratora" : "Wyłącz głos narratora"}>
        {muted ? "\uD83D\uDD07" : "\uD83D\uDD08"}
      </button>
      {playing && (
        <span style={{
          fontSize: "12px",
          color: "#e94560",
          fontWeight: "500",
          animation: "narrator-pulse 1.5s ease-in-out infinite",
        }}>
          GAMA-1 mówi...
        </span>
      )}
    </div>
  );
}
