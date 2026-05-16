/**
 * Landing / ScreenStart — pierwszy ekran w stylu Ghibli/Claymorphism.
 * Wielka ksiega z aurora "JA", podtytul, jeden CTA "Rozpocznij przygode",
 * pod spodem dyskretny link "Jestes doroslym? - zaloguj sie jako Mentor".
 */

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { session } from "../services/api.js";
import { ttsPlayer } from "../services/ttsPlayer";
import bgMusic from "../services/bgMusic.js";
import PageShell from "../components/PageShell.jsx";

function Splash({ onDone }) {
  const [fading, setFading] = useState(false);
  const [showCta, setShowCta] = useState(false);

  useEffect(() => {
    // CTA pojawia sie po 1.2s zeby gracz najpierw zobaczyl ekran z obrazkiem
    const t = setTimeout(() => setShowCta(true), 1200);
    return () => clearTimeout(t);
  }, []);

  function handleEnter() {
    // KRYTYCZNE: ta funkcja musi byc wywolana z user gesture (autoplay policy)
    try { ttsPlayer.unlock(); } catch {}
    try { bgMusic.setEnabled(true); } catch {}
    setFading(true);
    setTimeout(() => onDone(), 1400);
  }

  return (
    <div
      aria-hidden={fading}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "#1B1338",
        display: "flex", alignItems: "center", justifyContent: "center",
        opacity: fading ? 0 : 1,
        transition: "opacity 1.4s ease",
        pointerEvents: fading ? "none" : "auto",
        overflow: "hidden",
      }}
    >
      {/* Mobile-shaped container (max 480px) wycentrowany. Obraz wypelnia go w 100% (cover - bez ramek).
          Na desktopie kontener ma 480px, ciemne marginesy po bokach. Na mobile wypelnia 100% szerokosci. */}
      <div style={{
        position: "relative",
        width: "100%", maxWidth: 480,
        height: "100vh",
        overflow: "hidden",
        animation: "splash-pulse 1.4s ease-out forwards",
      }}>
        <img
          src="/bckg.png"
          alt=""
          style={{
            width: "100%", height: "100%",
            objectFit: "cover",
            objectPosition: "center center",
            display: "block",
          }}
        />

        {/* CTA dzwiek - na GORZE ekranu, w obszarze obrazka */}
        <button
          onClick={handleEnter}
          style={{
            position: "absolute",
            top: "calc(env(safe-area-inset-top, 0px) + 14vh)",
            left: "50%", transform: "translateX(-50%)",
            opacity: showCta ? 1 : 0,
            transition: "opacity .8s ease",
            pointerEvents: showCta ? "auto" : "none",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 22,
            background: "none", border: "none", padding: 0, cursor: "pointer",
          }}
        >
          {/* Etykieta NAD ikona dzwieku */}
          <div style={{
            background: "rgba(255,255,255,.95)", color: "#4A2A0E",
            padding: "10px 22px", borderRadius: 999,
            fontFamily: "var(--font-display, 'Baloo 2'), sans-serif",
            fontSize: 17, fontWeight: 800,
            boxShadow: "0 4px 12px rgba(0,0,0,.25)",
          }}>
            Włącz dźwięk i ruszamy
          </div>
          {/* Okrag z ikona dzwieku - pulsuje wabiac uwage */}
          <div style={{
            width: 84, height: 84, borderRadius: "50%",
            background: "linear-gradient(180deg, #FFD269 0%, #E89A3D 100%)",
            boxShadow: "0 0 0 6px rgba(255,210,105,.25), 0 8px 24px rgba(232,154,61,.55), 0 3px 0 #B47322",
            display: "flex", alignItems: "center", justifyContent: "center",
            animation: showCta ? "splash-cta-pulse 1.8s ease-in-out infinite" : "none",
          }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="#4A2A0E" stroke="#4A2A0E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9v6h4l5 4V5L7 9H3z" fill="#4A2A0E"/>
              <path d="M16 8a5 5 0 0 1 0 8" fill="none"/>
              <path d="M19 5a9 9 0 0 1 0 14" fill="none"/>
            </svg>
          </div>
        </button>
      </div>
    </div>
  );
}

export default function Landing() {
  const navigate = useNavigate();
  const playerId = session.getPlayer();
  const gmId = session.getGM();

  // Splash widoczny ZAWSZE przy wejsciu na strone glowna (bez cache w sessionStorage)
  const [showSplash, setShowSplash] = useState(true);
  const handleSplashDone = () => setShowSplash(false);

  function goChild() {
    // Pierwszy gest uzytkownika - odblokuj audio dla TTS (iOS/Safari wymaga gestu)
    ttsPlayer.unlock();
    navigate(playerId ? "/world" : "/onboarding");
  }

  function goGM(e) {
    e?.preventDefault?.();
    ttsPlayer.unlock();
    navigate("/mentor/zaloguj");
  }

  return (
    <>
      {showSplash && <Splash onDone={handleSplashDone} />}
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
              textShadow: "0 3px 0 rgba(255,255,255,.55), 0 6px 0 rgba(78,77,118,.06)",
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
    </>
  );
}
