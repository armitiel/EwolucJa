/**
 * HintPopup — pop-up z wizardem przekazujacym wiadomosc od mentora.
 * Renderowany globalnie, polling co X sekund po /api/players/:id/hints/unread.
 * Pokazuje kolejke hintow jeden po drugim, kazdy klik "OK" oznacza widziany.
 */
import React, { useEffect, useState, useCallback } from "react";
import { api, session } from "../services/api.js";
import { fx } from "../services/soundFx.js";

const POLL_INTERVAL_MS = 60_000; // co minute sprawdzaj nowe hinty

export default function HintPopup() {
  const [queue, setQueue] = useState([]);
  const [current, setCurrent] = useState(null);

  const fetchHints = useCallback(async () => {
    const playerId = session.getPlayer();
    if (!playerId) return;
    try {
      const data = await api.getUnreadHints(playerId);
      if (data.hints && data.hints.length > 0) {
        setQueue((prev) => {
          // Merge - dodaj nowe, usun juz pokazane
          const existingIds = new Set(prev.map((h) => h.id));
          const fresh = data.hints.filter((h) => !existingIds.has(h.id));
          return [...prev, ...fresh];
        });
      }
    } catch {}
  }, []);

  // Initial fetch + polling
  useEffect(() => {
    fetchHints();
    const i = setInterval(fetchHints, POLL_INTERVAL_MS);
    return () => clearInterval(i);
  }, [fetchHints]);

  // Wyciagnij pierwszy z kolejki do "current" jezeli nic juz nie pokazujemy
  useEffect(() => {
    if (!current && queue.length > 0) {
      setCurrent(queue[0]);
      // delikatny dzwiek przy pojawieniu sie hintu
      try { fx.gentleMagical(0.5); } catch {}
    }
  }, [queue, current]);

  async function dismiss() {
    if (!current) return;
    const playerId = session.getPlayer();
    try { if (playerId) await api.markHintViewed(playerId, current.id); } catch {}
    setQueue((prev) => prev.filter((h) => h.id !== current.id));
    setCurrent(null);
  }

  if (!current) return null;

  const kindIcon = current.kind === "artifact" ? "🎁" : current.kind === "message" ? "💬" : "💡";
  const kindLabel = current.kind === "artifact" ? "ARTEFAKT" : current.kind === "message" ? "WIADOMOŚĆ" : "PODPOWIEDŹ";

  return (
    <div
      onClick={dismiss}
      style={{
        position: "fixed", inset: 0, zIndex: 9000,
        background: "rgba(20,15,40,.78)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 18,
        animation: "fadeIn .25s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="pop-in"
        style={{
          width: "100%", maxWidth: 380,
          background: "linear-gradient(180deg, #FCF5E1 0%, #F4E3B8 100%)",
          border: "1.5px solid #E1CB94",
          borderRadius: 22,
          boxShadow: "0 12px 40px rgba(80,50,10,.5)",
          padding: "26px 22px 22px",
          textAlign: "center",
          position: "relative",
        }}
      >
        {/* Wizard na gorze */}
        <div style={{ marginTop: -68, marginBottom: 8, display: "flex", justifyContent: "center" }}>
          <div style={{
            width: 108, height: 108, borderRadius: "50%",
            background: "rgba(255,255,255,.92)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 0 6px rgba(255,210,105,.30), 0 8px 24px rgba(232,154,61,.45)",
            animation: "float-mid 3s ease-in-out infinite",
          }}>
            <img
              src="/wizard.png"
              alt=""
              style={{ width: 96, height: 96, objectFit: "contain" }}
            />
          </div>
        </div>

        <div style={{
          display: "inline-block", padding: "3px 12px", borderRadius: 999,
          background: "rgba(122,77,194,.18)", color: "var(--p-magic-dk)",
          fontSize: 11, fontWeight: 800, letterSpacing: 1.5, marginBottom: 8,
        }}>
          {kindIcon} {kindLabel}
        </div>

        {current.title && (
          <h2 className="t-display" style={{ fontSize: 22, margin: "0 0 8px", color: "#3B2A12" }}>
            {current.title}
          </h2>
        )}

        <p className="t-hand" style={{ fontSize: 18, color: "#5C4220", margin: "0 0 6px", lineHeight: 1.35 }}>
          „{current.body}"
        </p>

        {current.mentor_name && (
          <p style={{ fontSize: 12, color: "var(--p-ink-soft)", margin: "0 0 16px", fontStyle: "italic" }}>
            — {current.mentor_name}
          </p>
        )}

        <button
          className="btn btn-magic btn-block"
          onClick={dismiss}
          style={{ marginTop: 8 }}
        >
          ✦ Rozumiem
        </button>
      </div>
    </div>
  );
}
