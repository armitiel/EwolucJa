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
  width: "36px",
  height: "36px",
  borderRadius: "50%",
  border: "none",
  background: "linear-gradient(180deg, #B886E8, #7A4DC2)",
  color: "#fff",
  fontSize: "15px",
  cursor: "pointer",
  transition: "all 0.2s",
  outline: "none",
  padding: 0,
  boxShadow: "0 3px 0 #5A2BAE, 0 4px 12px rgba(122,77,194,.45)",
};

export default function NarratorVoice({ text, land, tone, speed, pauseBefore, pauseAfter, inlinePauses, autoPlay = true, autoPlayDelay = 0, compact = false, onEnd = null, playOnceKey = null }) {
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

    // playOnceKey — odtwórz raz na sesję (per klucz). Klucz "dom_greeting" itp.
    // Klucz może mieć przyrostek, np. zmiana misji => nowy klucz, więc znów się odtworzy.
    if (playOnceKey) {
      try {
        const flag = sessionStorage.getItem(`narrator_played_${playOnceKey}`);
        if (flag === "1") {
          lastTextRef.current = text; // żeby ręczny przycisk nadal mógł grać
          return;
        }
      } catch {}
    }

    lastTextRef.current = text;

    let cancelled = false;
    const timer = setTimeout(async () => {
      if (cancelled) return;
      setPlayingSync(true);
      await ttsPlayer.speak(text, { land, tone, speed, pauseBefore, pauseAfter, inlinePauses });
      if (!cancelled && mountedRef.current) {
        setPlayingSync(false);
        if (playOnceKey) {
          try { sessionStorage.setItem(`narrator_played_${playOnceKey}`, "1"); } catch {}
        }
        if (onEnd) onEnd();
      }
    }, autoPlayDelay);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      ttsPlayer.stop();
      if (mountedRef.current) setPlayingSync(false);
    };
  }, [text, available, muted, autoPlay, autoPlayDelay, land, tone, unlocked, setPlayingSync, onEnd, playOnceKey]);

  const handleSpeak = useCallback(async () => {
    if (!text || !available) return;
    ttsPlayer.unlock();
    // Zatrzymaj cokolwiek gra aktualnie
    ttsPlayer.stop();
    lastTextRef.current = text;
    setPlayingSync(true);
    await ttsPlayer.speak(text, { land, tone, speed, pauseBefore, pauseAfter, inlinePauses });
    if (mountedRef.current) {
      setPlayingSync(false);
      if (onEnd) onEnd();
    }
  }, [text, land, tone, available, setPlayingSync, onEnd]);

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
    background: "linear-gradient(180deg, #FF8AA3, #E94560)",
    boxShadow: "0 3px 0 #B82238, 0 4px 12px rgba(233,69,96,.45)",
    color: "#fff",
  };

  const muteBtn = {
    ...circleBtn,
    ...(muted
      ? {
          background: "linear-gradient(180deg, #C7BFD8, #8C8499)",
          boxShadow: "0 3px 0 #5F586B, 0 4px 10px rgba(70,60,90,.30)",
          color: "#fff",
        }
      : {}),
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
        {playing ? (
          <svg width="13" height="13" viewBox="0 0 14 14" fill="#fff"><rect x="3" y="3" width="8" height="8" rx="1"/></svg>
        ) : (
          <svg width="13" height="13" viewBox="0 0 14 14" fill="#fff" style={{ marginLeft: 2 }}><path d="M3 2 L11 7 L3 12 Z"/></svg>
        )}
      </button>
      <button onClick={handleMuteToggle} style={muteBtn}
        title={muted ? "Włącz głos" : "Wyłącz głos"}>
        {muted ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
            <path d="M3 9v6h4l5 4V5L7 9H3z" />
            <path d="M16.5 8.5l5 5M21.5 8.5l-5 5" stroke="#fff" strokeWidth="2" strokeLinecap="round" fill="none" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
            <path d="M3 9v6h4l5 4V5L7 9H3z" />
            <path d="M16 8a5 5 0 0 1 0 8 M19 5a9 9 0 0 1 0 14" stroke="#fff" strokeWidth="2" strokeLinecap="round" fill="none" />
          </svg>
        )}
      </button>
    </div>
  );
}
