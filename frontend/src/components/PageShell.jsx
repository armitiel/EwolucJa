/**
 * PageShell — wspólna otoczka wszystkich ekranów dziecka.
 * Zapewnia tło nieba, dryfujące chmury, opcjonalnie tab-bar.
 *
 * Mockup zakłada renderowanie w ramce telefonu 390×844, ale w produkcji
 * uruchamiamy fullscreen w przeglądarce — używamy całej szerokości viewport
 * z miękkim ograniczeniem do 480px na desktopie (czytelnie i blisko mockupu).
 */
import React from "react";
import { Cloud } from "./art.jsx";

export default function PageShell({ children, dark = false, showClouds = true, sky = "default" }) {
  // sky: 'default' | 'night' | 'dawn'
  const skyClass = ["sky-bg"];
  if (dark || sky === "night") skyClass.push("night");
  if (sky === "dawn") skyClass.push("dawn");

  return (
    <div
      style={{
        minHeight: "100vh",
        position: "relative",
        background: dark ? "#1a1430" : "transparent",
      }}
    >
      <div className={`page-bg ${dark ? "night" : ""}`} />
      <div
        style={{
          maxWidth: 480,
          margin: "0 auto",
          minHeight: "100vh",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          background: "transparent",
        }}
      >
        <div className={skyClass.join(" ")} />
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
            minHeight: "100vh",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
