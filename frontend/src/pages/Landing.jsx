/**
 * Landing / ScreenStart — pierwszy ekran w stylu Ghibli/Claymorphism.
 * Wielka ksiega z aurora "JA", podtytul, jeden CTA "Rozpocznij przygode",
 * pod spodem dyskretny link "Jestes doroslym? - zaloguj sie jako Mentor".
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import { session } from "../services/api.js";
import { ttsPlayer } from "../services/ttsPlayer";
import PageShell from "../components/PageShell.jsx";

export default function Landing() {
  const navigate = useNavigate();
  const playerId = session.getPlayer();
  const gmId = session.getGM();

  function goChild() {
    // Pierwszy gest uzytkownika - odblokuj audio dla TTS (iOS/Safari wymaga gestu)
    ttsPlayer.unlock();
    navigate(playerId ? "/world" : "/onboarding");
  }

  function goGM(e) {
    e?.preventDefault?.();
    ttsPlayer.unlock();
    navigate(gmId ? "/gm" : "/gm");
  }

  return (
    <PageShell>
      <div style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column" }}>
        <div
          style={{
            flex: 1,
            padding: "90px 24px 0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 18,
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Ksiega z aureola */}
          <div style={{ marginTop: 4, animation: "float-mid 4s ease-in-out infinite", position: "relative" }}>
            <div
              style={{
                position: "absolute",
                inset: "-12% -8% 4%",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(255,210,105,.45), transparent 65%)",
                filter: "blur(4px)",
              }}
            />
            <img
              src="/book.png"
              alt=""
              style={{
                position: "relative",
                width: 160,
                height: "auto",
                display: "block",
                filter: "drop-shadow(0 14px 22px rgba(80,40,140,.35))",
              }}
            />
          </div>

          {/* Tytul EwolucJA - z aurora "JA" */}
          <h1
            style={{
              fontFamily: "var(--font-display, 'Baloo 2'), sans-serif",
              fontSize: 72,
              fontWeight: 800,
              margin: "8px 0 0",
              textAlign: "center",
              letterSpacing: "-1px",
              color: "var(--p-ink)",
              textShadow: "0 3px 0 rgba(255,255,255,.55), 0 6px 0 rgba(43,42,74,.06)",
              lineHeight: 1,
            }}
          >
            Ewoluc<span className="aurora-text">JA</span>
          </h1>

          <p
            className="t-hand"
            style={{
              fontSize: 22,
              margin: 0,
              color: "var(--p-ink-soft)",
              textAlign: "center",
              maxWidth: 300,
              lineHeight: 1.25,
            }}
          >
            Baw się, odkrywaj i zdobywaj nowe moce z każdym krokiem.
          </p>

          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10, marginTop: 18, maxWidth: 380 }}>
            <button className="btn btn-magic btn-block" onClick={goChild}>
              <span style={{ fontSize: 20, marginRight: 6 }}>✦</span>
              {playerId ? "Wróć do świata" : "Rozpocznij przygodę"}
            </button>
          </div>

          <p style={{ marginTop: 20, fontSize: 13, color: "var(--p-ink-soft)", textAlign: "center" }}>
            Jesteś dorosłym? —{" "}
            <a
              href="#"
              onClick={goGM}
              style={{
                color: "var(--p-magic-dk)",
                fontWeight: 700,
                textDecoration: "underline",
                textUnderlineOffset: 3,
              }}
            >
              zaloguj się jako Mentor
            </a>
          </p>
        </div>
      </div>
    </PageShell>
  );
}
