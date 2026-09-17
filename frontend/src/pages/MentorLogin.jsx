/*!
 * EwolucJA — gra edukacyjna dla dzieci.
 * © 2026 Amitiel Angelisme. Wszelkie prawa zastrzeżone.
 * Powstało w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”.
 * Prawa autorskie należą do autora. Pełna nota: LICENSE.
 */
/**
 * MentorLogin — Google OAuth flow dla mentora.
 * Klik "Kontynuuj z Google" -> redirect na /api/auth/google/start -> Google -> callback -> /mentor.
 */
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PageShell from "../components/PageShell.jsx";
import { Sparkle } from "../components/art.jsx";
import { mentorApi } from "../services/mentorApi.js";

export default function MentorLogin() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState(params.get("error"));

  // Jezeli juz zalogowany — od razu na /mentor
  useEffect(() => {
    mentorApi.me().then(() => navigate("/mentor", { replace: true })).catch(() => setChecking(false));
  }, [navigate]);

  if (checking) {
    return (
      <PageShell>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Sparkle size={28} />
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 20px", gap: 18 }}>
        {/* Znak Mentora — dorosły obok dziecka, nie maskotka */}
        <div style={{ animation: "float-mid 3s ease-in-out infinite", marginBottom: 4 }}>
          <MentorIcon size={120} />
        </div>

        <div className="card card-paper" style={{ maxWidth: 380, width: "100%", padding: "26px 24px", textAlign: "center" }}>
          <h1 className="t-display" style={{ fontSize: 28, margin: "0 0 6px", color: "var(--p-magic-dk)" }}>
            Witaj w EwolucJA
          </h1>
          <p style={{ fontSize: 15, lineHeight: 1.45, margin: "0 0 22px", color: "var(--p-ink-soft)" }}>
            Zaloguj się, by zarządzać swoją klasą i wspierać uczniów w przygodzie.
          </p>

          {error && (
            <div style={{ background: "rgba(184,91,71,.10)", color: "#B85B47", borderRadius: 12, padding: "10px 14px", fontSize: 13, marginBottom: 14, textAlign: "left", lineHeight: 1.4 }}>
              {translateAuthError(error)}
            </div>
          )}

          <a
            href={mentorApi.loginUrl("/mentor")}
            className="btn btn-block"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              background: "#fff", color: "#3c4043",
              border: "1.5px solid rgba(78,77,118,.16)",
              fontWeight: 600, fontSize: 16,
              textDecoration: "none",
            }}
          >
            <GoogleIcon size={20} />
            Kontynuuj z Google
          </a>

          <p style={{ marginTop: 14, fontSize: 12, color: "var(--p-ink-soft)" }}>
            🔒 Bezpieczne logowanie · Bez haseł
          </p>
        </div>

        <button
          className="btn btn-ghost btn-sm"
          style={{ marginTop: 6 }}
          onClick={() => navigate("/")}
        >
          ← Wróć do strony głównej
        </button>

        <div style={{ position: "absolute", top: 100, left: 20 }}><Sparkle size={18} delay={0.2} /></div>
        <div style={{ position: "absolute", top: 180, right: 30 }}><Sparkle size={14} delay={0.6} /></div>
      </div>
    </PageShell>
  );
}

function translateAuthError(err) {
  if (!err) return "";
  if (err === "no_code") return "Logowanie anulowane.";
  if (/nie jest na liscie|whitelist|not_whitelisted/i.test(err)) {
    return "Twój email nie jest jeszcze na liście uprawnionych mentorów. Poproś mentora głównego (administratora) o dodanie Twojego adresu — zostaniesz powiadomiony gdy konto będzie aktywne.";
  }
  if (/email_verified/i.test(err)) return "Email Google nie jest zweryfikowany. Skonfiguruj weryfikację w Google i spróbuj ponownie.";
  return `Błąd: ${err}`;
}

function GoogleIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
      <path fill="#FBBC05" d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z"/>
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.167 6.656 3.58 9 3.58z"/>
    </svg>
  );
}

function MentorIcon({ size = 100 }) {
  // Znak Mentora: dorosły obok dziecka. Mentor to rola dorosłego (rodzica albo
  // nauczyciela), a nie postać ze świata gry — dlatego zwykła, ciepła para
  // sylwetek zamiast maskotki. Kolory z tej samej palety co reszta ekranu.
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" aria-hidden="true">
      <defs>
        <radialGradient id="mentor-tlo" cx="50%" cy="40%">
          <stop offset="0%" stopColor="#FFF6E0"/>
          <stop offset="100%" stopColor="#F5DDA8"/>
        </radialGradient>
      </defs>
      <circle cx="60" cy="60" r="54" fill="url(#mentor-tlo)" stroke="#7A4DC2" strokeWidth="4" />
      {/* Dorosły */}
      <circle cx="48" cy="40" r="12" fill="#7A4DC2" />
      <path d="M26 96 Q26 58 48 58 Q70 58 70 96 Z" fill="#7A4DC2" />
      {/* Dziecko */}
      <circle cx="80" cy="58" r="9" fill="#E89A3D" />
      <path d="M64 96 Q64 72 80 72 Q96 72 96 96 Z" fill="#E89A3D" />
    </svg>
  );
}
