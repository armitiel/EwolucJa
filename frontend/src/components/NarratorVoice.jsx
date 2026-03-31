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

const circleBtn = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "44px",
  height: "44px",
  borderRadius: "50%",
  border: "1px solid rgba(255,255,255,0.15)",
  background: "rgba(255,255,255,0.06)",
  color: "#ddd",
  fontSize: "18px",
  cursor: "pointer",
  transition: "all 0.2s",
  outline: "none",
  padding: 0,
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
    ...circleBtn,
    background: "rgba(233,69,96,0.15)",
    borderColor: "rgba(233,69,96,0.4)",
    color: "#e94560",
  };

  const muteBtn = {
    ...circleBtn,
    ...(muted ? { background: "rgba(255,255,255,0.03)", color: "#667" } : {}),
  };

  if (compact) {
    return null;
  }

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "8px",
    }}>
      <button onClick={handleToggle} style={playing ? activeBtn : circleBtn}
        title={playing ? "Stop" : "Posłuchaj"}>
        {playing ? "\u23F9" : "\u25B6"}
      </button>
      <button onClick={handleMuteToggle} style={muteBtn}
        title={muted ? "Włącz głos" : "Wyłącz głos"}>
        {muted ? "\uD83D\uDD07" : "\uD83D\uDD0A"}
      </button>
    </div>
  );
}
