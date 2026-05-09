import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, session } from "../services/api.js";
import PageShell from "../components/PageShell.jsx";
import { FakeQR } from "../components/art.jsx";

function formatCode(code) {
  if (!code) return "—";
  if (code.length >= 6) return `${code.slice(0, 3)} · ${code.slice(3)}`;
  return code;
}

export default function InviteGM() {
  const navigate = useNavigate();
  const [role, setRole] = useState("parent");
  const [code, setCode] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true);
    setError(null);
    try {
      const id = session.getPlayer();
      if (!id) throw new Error("Najpierw stwórz konto bohatera.");
      const res = await api.issuePairingCode(id, role, null);
      setCode(res);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageShell>
      <div className="topbar">
        <button className="btn btn-ghost btn-sm" onClick={() => navigate("/world")}>‹</button>
        <div className="meta" style={{ textAlign: "center" }}>
          <div className="lbl">ZAPROŚ MENTORA</div>
          <div className="nm">Sygnał w butelce</div>
        </div>
        <div style={{ width: 36 }} />
      </div>

      <div style={{ flex: 1, padding: "4px 18px 28px", display: "flex", flexDirection: "column", alignItems: "center", gap: 14, overflowY: "auto", minHeight: 0 }}>
        <p className="t-hand" style={{ fontSize: 20, textAlign: "center", color: "var(--p-ink-soft)", margin: "4px 12px 0" }}>
          Daj kod dorosłemu — rodzicowi, dziadkowi, ulubionej cioci. To oni będą Twoim Mentorem.
        </p>

        <div className="card" style={{ width: "100%", maxWidth: 380, padding: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.5, color: "var(--p-ink-soft)", marginBottom: 8 }}>
            KOGO ZAPRASZASZ?
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {[["parent", "Rodzic"], ["teacher", "Nauczyciel"]].map(([k, l]) => (
              <button
                key={k}
                className={role === k ? "btn btn-magic btn-sm" : "btn btn-ghost btn-sm"}
                style={{ flex: 1 }}
                onClick={() => setRole(k)}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {!code && (
          <button className="btn btn-magic btn-block" style={{ maxWidth: 380 }} onClick={generate} disabled={loading}>
            {loading ? "Generuję…" : "Wygeneruj kod"}
          </button>
        )}

        {error && <p style={{ color: "#B85B47" }}>{error}</p>}

        {code && (
          <div className="card card-paper pop-in" style={{ width: "100%", maxWidth: 380, display: "flex", flexDirection: "column", alignItems: "center", padding: "22px 18px", gap: 10 }}>
            <div style={{ width: 160, height: 160, background: "#fff", borderRadius: 16, padding: 10, boxShadow: "inset 0 0 0 2px rgba(122,77,194,.30)" }}>
              <FakeQR />
            </div>
            <div style={{ fontSize: 11, fontWeight: 800, color: "var(--p-ink-soft)", letterSpacing: 1.5 }}>RUNICZNY KOD</div>
            <div className="t-display" style={{ fontSize: 30, letterSpacing: 2 }}>{formatCode(code.code)}</div>
            <div style={{ display: "flex", gap: 10, fontSize: 12, color: "var(--p-ink-soft)" }}>
              <span>⌛ ważny 7 dni</span><span>·</span><span>jednorazowy</span>
            </div>
            <div style={{ display: "flex", gap: 10, width: "100%", marginTop: 6 }}>
              <button className="btn btn-magic btn-block" style={{ flex: 1 }} onClick={() => navigator.share?.({ text: `Kod do EwolucJA: ${code.code}` }).catch(() => {})}>
                Udostępnij
              </button>
              <button className="btn btn-ghost btn-block" style={{ flex: 1 }} onClick={() => navigator.clipboard?.writeText(code.code)}>
                Skopiuj
              </button>
            </div>
          </div>
        )}

        <div className="card" style={{ width: "100%", maxWidth: 380 }}>
          <div className="t-display" style={{ fontSize: 18 }}>Co dorosły zobaczy?</div>
          <ul style={{ paddingLeft: 18, margin: "6px 0 0", fontSize: 13, color: "var(--p-ink-soft)", lineHeight: 1.5 }}>
            <li>kim jesteś i jakie masz aktualne cykle</li>
            <li>czy wykonujesz misje (treść Twoich pytań pozostaje Twoja)</li>
            <li>możliwość pisania do Ciebie szeptów</li>
          </ul>
        </div>
      </div>
    </PageShell>
  );
}
