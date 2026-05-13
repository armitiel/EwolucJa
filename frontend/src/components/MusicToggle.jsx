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

  return (
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
