/*!
 * EwolucJA — gra edukacyjna dla dzieci.
 * © 2026 Amitiel Angelisme. Wszelkie prawa zastrzeżone.
 * Powstało w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”.
 * Prawa autorskie należą do autora. Pełna nota: LICENSE.
 */
/**
 * PageShell — wspólna otoczka wszystkich ekranów dziecka.
 * Zapewnia tło nieba, dryfujące chmury, opcjonalnie tab-bar.
 *
 * Mockup zakłada renderowanie w ramce telefonu 390×844, ale w produkcji
 * uruchamiamy fullscreen w przeglądarce — używamy całej szerokości viewport
 * z miękkim ograniczeniem do 480px na desktopie (czytelnie i blisko mockupu).
 *
 * `ramka` (2026-09-14) zdejmuje to ograniczenie i daje ekranowi tę samą
 * szarą ramkę i ten sam kadr 1,7:1, co świat 3D (`.hub-root` w `hub.css`).
 * Włącza ją ekran, który na desktopie ma WŁASNY układ, a nie rozciągniętą
 * kolumnę telefonu — dziś tylko `Landing`. Geometria zeszła ze stylu
 * inline do klasy `.page-scena`, bo inline wygrywa z każdą regułą CSS
 * i media query nie miałaby jak jej ruszyć.
 */
import React from "react";
import { useNavigate } from "react-router-dom";
import { Cloud } from "./art.jsx";

function DemoBanner() {
  const navigate = useNavigate();
  let inDemo = false;
  try { inDemo = localStorage.getItem("ewolucja.demoMode") === "1"; } catch {}
  if (!inDemo) return null;
  function exitDemo() {
    try {
      localStorage.removeItem("ewolucja.demoMode");
      localStorage.removeItem("ewolucja.playerId");
    } catch {}
    navigate("/mentor");
  }
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
      background: "linear-gradient(90deg, #FFD269 0%, #E89A3D 100%)",
      color: "#3B2A12", fontSize: 12, fontWeight: 700,
      padding: "6px 14px", display: "flex", alignItems: "center", gap: 10,
      boxShadow: "0 2px 6px rgba(80,50,10,.18)",
    }}>
      <span>🎮 Tryb testowy mentora</span>
      <button onClick={exitDemo} style={{ marginLeft: "auto", background: "rgba(59,42,18,.15)", border: "none", color: "#3B2A12", fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 8, cursor: "pointer" }}>
        ← Wróć do panelu mentora
      </button>
    </div>
  );
}

export default function PageShell({ children, dark = false, showClouds = true, sky = "default", skyVars = null, ramka = false }) {
  // sky: 'default' | 'night' | 'dawn'
  // skyVars: optional object { '--sky-top': '#...', '--sky-mid': '#...', '--sky-bot': '#...' } - nadpisuje gradient
  const skyClass = ["sky-bg"];
  if (dark || sky === "night") skyClass.push("night");
  if (sky === "dawn") skyClass.push("dawn");

  return (
    <div
      style={{
        minHeight: "100dvh",  // Android-aware viewport
        position: "relative",
        background: dark ? "#1a1430" : "transparent",
      }}
    >
      <DemoBanner />
      <div className={`page-bg ${dark ? "night" : ""}`} />
      <div
        className={`page-scena${ramka ? " jest-ramka" : ""}`}
        style={{
          // Position fixed + inset 0 = viewport zawsze ten sam rozmiar, niezaleznie od URL-bara iOS.
          // Zapobiega reflow przy scrollu (poprzednio 100dvh sie zmienialo gdy URL-bar slidoval).
          // Bok, szerokosc i marginesy siedza w `.page-scena` (ewolucja.css) —
          // inline zostaje tylko to, czego zaden ekran nie nadpisuje.
          position: "fixed",
          display: "flex",
          flexDirection: "column",
          background: "transparent",
          overflow: "hidden",  // wymusza zeby tylko screen-scroll mial scroll, nie cala middle
        }}
      >
        <div className={skyClass.join(" ")} style={skyVars || undefined} />
        {showClouds && !dark && (
          <>
            <div
              style={{
                position: "absolute",
                top: 90,
                left: -20,
                animation: "float-slow 5s ease-in-out infinite",
                zIndex: 0,
              }}
            >
              <Cloud size={120} opacity={0.7} />
            </div>
            <div
              style={{
                position: "absolute",
                top: 160,
                right: -30,
                animation: "float-mid 4s ease-in-out infinite",
                zIndex: 0,
              }}
            >
              <Cloud size={90} opacity={0.55} />
            </div>
          </>
        )}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minHeight: 0,  // KRYTYCZNE - bez tego flex:1 + screen-scroll z overflow:auto nie scrolluje na Androidzie
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
