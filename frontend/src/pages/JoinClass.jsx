/**
 * JoinClass — dolaczanie ucznia do klasy przez kod zaproszenia.
 * URL: /dolacz?kod=XYZ-ABC-DEF (auto-fill) lub /dolacz (manual).
 *
 * Flow:
 *   1. Wpisz/auto-fill kod -> sprawdz endpoint /check
 *   2. Pokaz potwierdzenie klasy + mentora
 *   3. Wpisz imie ucznia -> POST /join -> tworzy gracza + membership
 *   4. session.savePlayer() -> redirect /onboarding (quiz/archetyp)
 */
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PageShell from "../components/PageShell.jsx";
import { Sparkle } from "../components/art.jsx";
import { joinApi } from "../services/mentorApi.js";
import { session } from "../services/api.js";

export default function JoinClass() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const initialCode = (params.get("kod") || "").toUpperCase();

  // Etap: 'code' = wpisz kod, 'confirm' = potwierdz klase + imie, 'joining' = trwa
  const [step, setStep] = useState(initialCode ? "confirm" : "code");
  const [code, setCode] = useState(initialCode);
  const [codeInfo, setCodeInfo] = useState(null);
  const [error, setError] = useState(null);
  const [playerName, setPlayerName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Auto-check przy starcie jezeli kod w URL
  useEffect(() => {
    if (initialCode) {
      joinApi.checkCode(initialCode).then((res) => {
        if (!res.valid) { setError(translateReason(res.reason)); setStep("code"); }
        else setCodeInfo(res);
      }).catch((e) => { setError(e.message); setStep("code"); });
    }
  }, [initialCode]);

  async function handleCheckCode() {
    setError(null);
    if (!code.trim()) { setError("Wpisz kod"); return; }
    try {
      const res = await joinApi.checkCode(code.trim().toUpperCase());
      if (!res.valid) setError(translateReason(res.reason));
      else { setCodeInfo(res); setStep("confirm"); }
    } catch (e) { setError(e.message); }
  }

  async function handleJoin() {
    setError(null);
    if (!playerName.trim()) { setError("Wpisz imię ucznia"); return; }
    setSubmitting(true);
    try {
      const res = await joinApi.join({ invite_code: code.trim().toUpperCase(), player_name: playerName.trim() });
      session.savePlayer(res.player_id);
      navigate("/onboarding");
    } catch (e) {
      setError(e.message);
      setSubmitting(false);
    }
  }

  return (
    <PageShell>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 20px", gap: 14 }}>
        <div style={{ fontSize: 56, animation: "float-mid 3s ease-in-out infinite" }}>✨</div>

        {step === "code" && (
          <div className="card card-paper pop-in" style={{ width: "100%", maxWidth: 380, padding: "24px 22px", textAlign: "center" }}>
            <h1 className="t-display" style={{ fontSize: 24, margin: "0 0 6px", color: "var(--p-magic-dk)" }}>Witamy w EwolucJA</h1>
            <p style={{ fontSize: 14, color: "var(--p-ink-soft)", margin: "0 0 18px" }}>
              Wpisz kod zaproszenia, który dostałaś/dostałeś od mentora.
            </p>
            <input
              autoFocus
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && handleCheckCode()}
              placeholder="ZIELONA-WYDRA-2026"
              style={{
                width: "100%", padding: "14px 16px", fontSize: 17, fontFamily: "Baloo 2, sans-serif",
                fontWeight: 700, letterSpacing: 1, textAlign: "center",
                border: "2px solid rgba(122,77,194,.30)", borderRadius: 14,
                background: "rgba(255,255,255,.92)", color: "var(--p-ink)",
                outline: "none", boxSizing: "border-box",
              }}
            />
            {error && <p style={{ color: "#B85B47", fontSize: 13, margin: "10px 0 0" }}>{error}</p>}
            <button className="btn btn-magic btn-block" style={{ marginTop: 14 }} onClick={handleCheckCode}>
              Sprawdź kod →
            </button>
          </div>
        )}

        {step === "confirm" && codeInfo && (
          <div className="card card-paper pop-in" style={{ width: "100%", maxWidth: 380, padding: "24px 22px", textAlign: "center" }}>
            <h1 className="t-display" style={{ fontSize: 22, margin: "0 0 4px", color: "var(--p-magic-dk)" }}>Dołączasz do klasy:</h1>
            <div style={{ background: "rgba(122,77,194,.10)", borderRadius: 14, padding: "12px 14px", margin: "12px 0 18px" }}>
              <div className="t-display" style={{ fontSize: 20, color: "var(--p-ink)" }}>{codeInfo.class_name}</div>
              <div style={{ fontSize: 12, color: "var(--p-ink-soft)", marginTop: 4 }}>
                Mentor: <strong>{codeInfo.mentor_name}</strong><br />
                {codeInfo.student_count} z {codeInfo.max_students} miejsc
              </div>
            </div>

            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.4, color: "var(--p-ink-soft)", marginBottom: 4, textAlign: "left" }}>JAK MA NA IMIĘ UCZEŃ?</div>
            <input
              autoFocus
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !submitting && handleJoin()}
              placeholder="Imię"
              style={{
                width: "100%", padding: "12px 14px", fontSize: 17, fontFamily: "Baloo 2, sans-serif",
                border: "2px solid rgba(122,77,194,.30)", borderRadius: 14,
                background: "rgba(255,255,255,.92)", color: "var(--p-ink)",
                outline: "none", boxSizing: "border-box",
              }}
            />
            {error && <p style={{ color: "#B85B47", fontSize: 13, margin: "10px 0 0" }}>{error}</p>}
            <button className="btn btn-magic btn-block" style={{ marginTop: 14 }} disabled={submitting} onClick={handleJoin}>
              {submitting ? "Dołączam..." : "Dołącz do klasy ✦"}
            </button>
            <button className="btn btn-ghost btn-sm" style={{ marginTop: 8 }} onClick={() => { setStep("code"); setCodeInfo(null); setError(null); }}>
              Zmień kod
            </button>
          </div>
        )}

        <button className="btn btn-ghost btn-sm" onClick={() => navigate("/")}>← Strona główna</button>

        <div style={{ position: "absolute", top: 100, left: 30 }}><Sparkle size={18} /></div>
        <div style={{ position: "absolute", bottom: 100, right: 40 }}><Sparkle size={14} delay={0.4} /></div>
      </div>
    </PageShell>
  );
}

function translateReason(reason) {
  switch (reason) {
    case "not_found": return "Niepoprawny kod zaproszenia";
    case "archived": return "Ta klasa jest zarchiwizowana";
    case "expired": return "Kod wygasł — poproś mentora o nowy";
    case "full": return "Klasa jest pełna";
    default: return "Nie można dołączyć";
  }
}
