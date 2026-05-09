/**
 * MapView / ScreenMap — pergaminowa mapa świata z 6 krainami.
 * Kliknięcie pinezki pokazuje opis krainy. Tylko Las Pytań aktywny w MVP.
 */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageShell from "../components/PageShell.jsx";
import TabBar from "../components/TabBar.jsx";
import { WorldMap, RegionIcon } from "../components/art.jsx";

const REGIONS = {
  forest: {
    name: "Las Pytań",
    color: "#5FA76F",
    desc: "Tu rosną pytania jak grzyby po deszczu.",
  },
  sea: {
    name: "Morze Słów",
    color: "#7BC0E8",
    desc: "Fale niosą historie z dalekich brzegów.",
  },
  mountain: {
    name: "Góry Liczb",
    color: "#7A8FB8",
    desc: "Strome szczyty mierzone krokami.",
  },
  castle: {
    name: "Zamek Czasu",
    color: "#7A4DC2",
    desc: "W komnatach drzemią zapomniane chwile.",
  },
  desert: {
    name: "Pustynia Pomysłów",
    color: "#E1C68A",
    desc: "Ziarna nowych myśli przesypują się w wietrze.",
  },
  sky: {
    name: "Niebo Marzeń",
    color: "#B886E8",
    desc: "Chmury, na których można usiąść z łokciami w gwiazdach.",
  },
};

export default function MapView() {
  const navigate = useNavigate();
  const [picked, setPicked] = useState("forest");
  const r = REGIONS[picked];

  return (
    <PageShell>
      <div className="topbar">
        <button className="btn btn-ghost btn-sm" onClick={() => navigate("/world")}>
          ‹
        </button>
        <div className="meta" style={{ textAlign: "center" }}>
          <div className="lbl">PRZEGLĄD ŚWIATA</div>
          <div className="nm">Kraina Kroniki</div>
        </div>
        <div style={{ width: 36 }} />
      </div>

      <div
        style={{
          flex: 1,
          padding: "4px 18px 14px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          overflowY: "auto",
          minHeight: 0,
        }}
      >
        <div style={{ display: "flex", justifyContent: "center" }}>
          <WorldMap width={340} height={400} currentRegion={picked} onPick={setPicked} />
        </div>

        <div className="card pop-in" key={picked}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ background: r.color + "33", borderRadius: 14, padding: 8 }}>
              <RegionIcon kind={picked} size={44} />
            </div>
            <div style={{ flex: 1 }}>
              <div className="t-display" style={{ fontSize: 22 }}>
                {r.name}
              </div>
              <div className="t-hand" style={{ fontSize: 17, color: "var(--p-ink-soft)" }}>
                {r.desc}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
            {picked === "forest" && (
              <>
                <span className="chip leaf">misje aktywne</span>
                <span className="chip magic">tu jesteś</span>
              </>
            )}
            {picked !== "forest" && <span className="chip">zablokowana</span>}
          </div>
          <button
            className="btn btn-magic btn-sm"
            style={{ marginTop: 10 }}
            onClick={() => (picked === "forest" ? navigate("/mission") : null)}
            disabled={picked !== "forest"}
          >
            {picked === "forest" ? "Wejdź do krainy →" : "Odblokuj — w przyszłych cyklach"}
          </button>
        </div>
      </div>

      <TabBar current="map" />
    </PageShell>
  );
}
