/**
 * LoginByCode — strona logowania krotkim kodem ucznia.
 *
 * Dziecko/rodzic wpisuje 6-znakowy kod (np. HQ7K2P) ktory mentor pokazal w popupie.
 * Backend zwraca playerId, my zapisujemy do localStorage i przekierowujemy.
 *
 * Sciezka: /odzyskaj (rowniez /witaj jako alias)
 */
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api, session } from "../services/api.js";
import { useAppData } from "../contexts/AppData.jsx";
import PageShell from "../components/PageShell.jsx";

export default function LoginByCode() {
  const navigate = useNavigate();
  const { refreshAll } = useAppData();
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  function clean(v) {
    return String(v).toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8);
  }

  async function handleSubmit(e) {
    e?.preventDefault?.();
    const c = clean(code);
    if (c.length < 4) { setError("Kod ma 6 znaków."); return; }
    setSubmitting(true);
    setError(null);
    try {
      const player = await api.getPlayerByLoginCode(c);
      session.setPlayer(player.player_id);
      try { await refreshAll(); } catch {}
      const target = player.archetype ? "/world" : "/onboarding";
      navigate(target, { replace: true });
    } catch (err) {
      setError(err.message || "Nie udało się zalogować");
      setSubmitting(false);
    }
  }

  return (
    <PageShell sky="dawn">
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: 18, padding: "24px 26px", textAlign: "center",
      }}>
        <div style={{ fontSize: 56 }}>🗝️</div>
        <div className="t-display" style={{ fontSize: 26, color: "var(--p-magic-dk)", margin: 0 }}>
          Wracasz po przygodę?
        </div>
        <div style={{ fontSize: 14, color: "var(--p-ink-soft)", lineHeight: 1.4, maxWidth: 300 }}>
          Wpisz swój magiczny kod (znajdziesz go u rodzica lub nauczyciela).
        </div>

        <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: 340, display: "flex", flexDirection: "column", gap: 12 }}>
          <input
            ref={inputRef}
            value={code}
            onChange={(e) => { setCode(clean(e.target.value)); setError(null); }}
            placeholder="HQ7K2P"
            inputMode="text"
            autoCapitalize="characters"
            autoComplete="off"
            spellCheck={false}
            maxLength={8}
            style={{
              width: "100%", boxSizing: "border-box",
              padding: "16px 18px",
              border: "2px solid rgba(122,77,194,.35)",
              borderRadius: 14,
              background: "rgba(255,255,255,.95)",
              color: "var(--p-magic-dk)",
              fontFamily: "var(--font-display, 'Baloo 2'), sans-serif",
              fontSize: 32, fontWeight: 800,
              letterSpacing: 6, textAlign: "center", textTransform: "uppercase",
              outline: "none",
            }}
          />
          {error && (
            <div style={{ fontSize: 13, color: "#B85B47", fontWeight: 700 }}>{error}</div>
          )}
          <button
            type="submit"
            className="btn btn-magic btn-block"
            disabled={submitting || clean(code).length < 4}
          >
            {submitting ? "Sprawdzam…" : "✨ Otwórz Kronikę"}
          </button>
        </form>

        <div style={{ marginTop: 14, fontSize: 12, color: "var(--p-ink-soft)" }}>
          Nie masz kodu?{" "}
          <button onClick={() => navigate("/dolacz")} style={{ background: "none", border: "none", color: "var(--p-magic-dk)", fontWeight: 800, cursor: "pointer", padding: 0 }}>
            Dołącz przez kod klasy
          </button>
        </div>
        <button onClick={() => navigate("/")} className="btn btn-ghost btn-sm" style={{ marginTop: 4 }}>
          ← Wróć
        </button>
      </div>
    </PageShell>
  );
}
