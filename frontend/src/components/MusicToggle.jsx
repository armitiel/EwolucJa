/**
 * MusicToggle — pływająca pinetka muzyki w prawym górnym rogu.
 * Zawsze widoczna (mountowana z PageShell na każdym ekranie dziecka),
 * klik = włącz/wyłącz tło muzyczne (Mindful Forest Path).
 *
 * Pierwszy klik gdziekolwiek na stronie i tak odblokowuje audio przez
 * globalny listener w bgMusic.js — ten przycisk daje wizualne potwierdzenie
 * stanu i kontrolę dla dziecka/rodzica.
 */
import React, { useState, useEffect } from "react";
import bgMusic from "../services/bgMusic";

export default function MusicToggle() {
  const [enabled, setEnabled] = useState(bgMusic.isEnabled());

  // Sync co 1s — bgMusic ma własny localStorage, mogę toggle z DevTools
  useEffect(() => {
    const t = setInterval(() => {
      const cur = bgMusic.isEnabled();
      if (cur !== enabled) setEnabled(cur);
    }, 1000);
    return () => clearInterval(t);
  }, [enabled]);

  function handleToggle() {
    const next = bgMusic.toggle();
    setEnabled(next);
  }

  // inline=true -> bez fixed positioning, dopasowany do topbara (jak kontrolki lektora)
  return MusicToggle.inline ? null : (
    <button
      onClick={handleToggle}
      title={enabled ? "Wycisz muzykę krainy" : "Włącz muzykę krainy"}
      style={{
        position: "fixed",
        top: 14,
        right: 14,
        zIndex: 9998,
        width: 42,
        height: 42,
        borderRadius: "50%",
        border: "1px solid rgba(255,255,255,0.4)",
        background: enabled ? "rgba(255,210,105,0.85)" : "rgba(78,77,118,0.55)",
        color: enabled ? "#4A2A0E" : "#fff",
        fontSize: 18,
        cursor: "pointer",
        boxShadow: "0 2px 12px rgba(78,77,118,.25), inset 0 -2px 0 rgba(0,0,0,.08)",
        backdropFilter: "blur(6px)",
        transition: "background .2s, transform .2s",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {enabled ? "🎵" : "🔇"}
    </button>
  );
}

// Inline wariant — uzywany w topbarze WorldHub obok kontrolek lektora.
// Ten sam wyglad co przyciski lektora (36px, fioletowy gradient, biala ikona SVG).
export function MusicToggleInline() {
  const [enabled, setEnabled] = useState(bgMusic.isEnabled());

  useEffect(() => {
    const t = setInterval(() => {
      const cur = bgMusic.isEnabled();
      if (cur !== enabled) setEnabled(cur);
    }, 1000);
    return () => clearInterval(t);
  }, [enabled]);

  function handleToggle() {
    const next = bgMusic.toggle();
    setEnabled(next);
  }

  const baseStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 36,
    height: 36,
    borderRadius: "50%",
    border: "none",
    color: "#fff",
    cursor: "pointer",
    transition: "all 0.2s",
    outline: "none",
    padding: 0,
  };

  const activeStyle = {
    ...baseStyle,
    background: "linear-gradient(180deg, #FFD269, #E89A3D)",
    boxShadow: "0 3px 0 #B47322, 0 4px 12px rgba(232,154,61,.45)",
  };

  const mutedStyle = {
    ...baseStyle,
    background: "linear-gradient(180deg, #C7BFD8, #8C8499)",
    boxShadow: "0 3px 0 #5F586B, 0 4px 10px rgba(70,60,90,.30)",
  };

  return (
    <button
      onClick={handleToggle}
      title={enabled ? "Wycisz muzykę krainy" : "Włącz muzykę krainy"}
      style={enabled ? activeStyle : mutedStyle}
    >
      {enabled ? (
        // Nutka muzyczna
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
          <path d="M9 17.5a3 3 0 1 1-2-2.83V5l11-3v11.5a3 3 0 1 1-2-2.83V5l-7 1.9V17.5z" />
        </svg>
      ) : (
        // Przekreślona nutka
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
          <path d="M9 17.5a3 3 0 1 1-2-2.83V5l11-3v11.5a3 3 0 1 1-2-2.83V5l-7 1.9V17.5z" />
          <path d="M3 3l18 18" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </svg>
      )}
    </button>
  );
}
