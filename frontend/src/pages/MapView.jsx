/**
 * MapView / ScreenMap — mapa krainy z mapa.png + spotlight na "TU JESTES".
 * Future pins szare zablokowane, current Las Pytan kolorowy z halo.
 */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageShell from "../components/PageShell.jsx";
import TabBar from "../components/TabBar.jsx";
import TopBar from "../components/TopBar.jsx";
import { RegionIcon } from "../components/art.jsx";

const REGIONS = {
  forest:   { name: "Las Pytań",         color: "#5FA76F", desc: "Tu rosną pytania jak grzyby po deszczu." },
  sea:      { name: "Morze Słów",        color: "#7BC0E8", desc: "Fale niosą historie z dalekich brzegów." },
  mountain: { name: "Góry Liczb",        color: "#7A8FB8", desc: "Strome szczyty mierzone krokami." },
  castle:   { name: "Zamek Czasu",       color: "#7A4DC2", desc: "W komnatach drzemią zapomniane chwile." },
  desert:   { name: "Pustynia Pomysłów", color: "#E1C68A", desc: "Ziarna nowych myśli przesypują się w wietrze." },
  sky:      { name: "Niebo Marzeń",      color: "#B886E8", desc: "Chmury, na których można usiąść z łokciami w gwiazdach." },
};

// Pozycje w % na obrazku mapa.png. forest = "tu jestes" (aktualnie aktywny).
const PINS = [
  { id: "castle",   x: 46, y: 7,  step: 5 },
  { id: "mountain", x: 55, y: 23, step: 4 },
  { id: "sea",      x: 64, y: 64, step: 3 },
  { id: "desert",   x: 48, y: 88, step: 2 },
  { id: "forest",   x: 28, y: 46, step: 1, current: true },
];

export default function MapView() {
  const navigate = useNavigate();
  const [picked, setPicked] = useState("forest");
  const currentPin = PINS.find((p) => p.current);
  const r = REGIONS[picked];

  const spotlight = `radial-gradient(circle at ${currentPin.x}% ${currentPin.y}%, black 0%, black 18%, rgba(0,0,0,.30) 28%, transparent 38%)`;

  return (
    <PageShell>
      <TopBar />

      <div
        className="screen-scroll"
        style={{
          flex: 1,
          padding: "12px 14px 52px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          minHeight: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            justifyContent: "center",
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: 1,
            color: "var(--p-ink-soft)",
          }}
        >
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#7A4DC2" }} />
          <span>TU JESTEŚ</span>
          <span style={{ width: 18, height: 1, background: "rgba(78,77,118,.25)" }} />
          <span style={{ opacity: 0.55 }}>↑ JESZCZE NIEDOSTĘPNE</span>
        </div>

        <div style={{ position: "relative", width: "100%", maxWidth: 340, margin: "0 auto" }}>
          <img
            src="/assets/mapa.png"
            alt=""
            style={{
              display: "block",
              width: "100%",
              height: "auto",
              filter: "grayscale(.95) brightness(1.05) opacity(.55)",
            }}
          />
          <img
            src="/assets/mapa.png"
            alt=""
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "auto",
              pointerEvents: "none",
              WebkitMaskImage: spotlight,
              maskImage: spotlight,
              filter: "drop-shadow(0 8px 18px rgba(122,77,194,.25))",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: `${currentPin.x}%`,
              top: `${currentPin.y}%`,
              transform: "translate(-50%,-50%)",
              width: 120,
              height: 120,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255,210,105,.35), transparent 65%)",
              pointerEvents: "none",
              animation: "pulse-halo 2.6s ease-in-out infinite",
            }}
          />

          {PINS.filter((p) => !p.current).map((p) => {
            const active = picked === p.id;
            const label = REGIONS[p.id]?.name || p.id;
            return (
              <button
                key={p.id}
                onClick={() => setPicked(p.id)}
                style={{
                  position: "absolute",
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  transform: `translate(-50%,-50%) ${active ? "scale(1.05)" : "scale(1)"}`,
                  border: "none",
                  background: "transparent",
                  padding: 0,
                  cursor: "pointer",
                  transition: "transform .18s ease",
                  zIndex: 2,
                }}
              >
                <div
                  style={{
                    background: "rgba(255,255,255,.92)",
                    color: "rgba(78,77,118,.55)",
                    fontFamily: "var(--font-display, 'Baloo 2'), sans-serif",
                    fontWeight: 700,
                    fontSize: 12,
                    padding: "4px 10px",
                    borderRadius: 999,
                    boxShadow: active
                      ? "0 0 0 3px rgba(184,134,232,.40), 0 2px 6px rgba(40,20,80,.25)"
                      : "0 2px 6px rgba(40,20,80,.20), inset 0 0 0 1.2px rgba(122,77,194,.18)",
                    whiteSpace: "nowrap",
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  <span style={{ fontSize: 11, opacity: 0.7 }}>🔒</span>
                  <span style={{ filter: "grayscale(.4)" }}>{label}</span>
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 800,
                      background: "rgba(78,77,118,.10)",
                      padding: "1px 6px",
                      borderRadius: 8,
                    }}
                  >
                    #{p.step}
                  </span>
                </div>
              </button>
            );
          })}

          <button
            onClick={() => setPicked(currentPin.id)}
            style={{
              position: "absolute",
              left: `${currentPin.x}%`,
              top: `${currentPin.y}%`,
              transform: `translate(-50%,-50%) ${picked === currentPin.id ? "scale(1.05)" : "scale(1)"}`,
              border: "none",
              background: "transparent",
              padding: 0,
              cursor: "pointer",
              transition: "transform .18s ease",
              zIndex: 3,
            }}
          >
            <div
              style={{
                background: "linear-gradient(180deg,#FFD269,#E89A3D)",
                color: "#4A2A0E",
                fontFamily: "var(--font-display, 'Baloo 2'), sans-serif",
                fontWeight: 800,
                fontSize: 14,
                padding: "6px 14px",
                borderRadius: 999,
                boxShadow: "0 0 0 5px rgba(255,210,105,.40), 0 6px 14px rgba(232,154,61,.55)",
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                gap: 7,
              }}
            >
              <span
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: "50%",
                  background: "#7A4DC2",
                  boxShadow: "0 0 0 3px rgba(122,77,194,.30)",
                  animation: "pulse-dot 1.8s ease-in-out infinite",
                }}
              />
              {REGIONS.forest.name}
            </div>
          </button>
        </div>

        <div className="card pop-in" key={picked}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                background: (r?.color || "#5FA76F") + "33",
                borderRadius: 14,
                padding: 8,
                filter: picked === "forest" ? "none" : "grayscale(.5)",
              }}
            >
              <RegionIcon kind={picked} size={44} />
            </div>
            <div style={{ flex: 1 }}>
              <div className="t-display" style={{ fontSize: 22 }}>{r?.name || picked}</div>
              <div className="t-hand" style={{ fontSize: 17, color: "var(--p-ink-soft)" }}>{r?.desc}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
            {picked === "forest" ? (
              <>
                <span className="chip leaf">2 misje</span>
                <span className="chip amber">1 artefakt</span>
                <span className="chip magic">tu jesteś</span>
              </>
            ) : (
              <span className="chip" style={{ background: "rgba(78,77,118,.12)" }}>🔒 niedostępne</span>
            )}
          </div>
          <button
            className="btn btn-magic btn-sm"
            style={{ marginTop: 10 }}
            onClick={() => (picked === "forest" ? navigate("/mission") : null)}
            disabled={picked !== "forest"}
          >
            {picked === "forest" ? "Wejdź do krainy →" : "🔒 Odblokuj po ukończeniu Lasu Pytań"}
          </button>
        </div>
      </div>

      <TabBar current="map" />
    </PageShell>
  );
}
