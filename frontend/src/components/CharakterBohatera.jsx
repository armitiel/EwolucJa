/**
 * CharakterBohatera — radarowy wykres 6 cech postaci + lista wartosci po prawej.
 * Mapowanie cecha -> profil:
 *   MAD (Madrosc)     ↔ ST (Strateg)
 *   ODW (Odwaga)      ↔ LD (Lider)
 *   CIE (Ciekawosc)   ↔ DT (Detektyw)
 *   SKU (Skupienie)   ↔ MD (Mediator)
 *   ZYC (Zyczliwosc)  ↔ EM (Empata)
 *   KRE (Kreatywnosc) ↔ KR (Kreator)
 *
 * Skala radara: max wartosc = max(scores) lub 10 (zeby polygon zawsze byl widoczny).
 */
import React from "react";
import { PROFILE_INFO } from "./ProfileAvatar.jsx";

const TRAITS = [
  { code: "ST", short: "MĄD", name: "Mądrość",     color: "#7A4DC2", icon: "doc" },
  { code: "LD", short: "ODW", name: "Odwaga",      color: "#E89A3D", icon: "shield" },
  { code: "DT", short: "CIE", name: "Ciekawość",   color: "#5FA76F", icon: "search" },
  { code: "MD", short: "SKU", name: "Skupienie",   color: "#378ADD", icon: "target" },
  { code: "EM", short: "ŻYC", name: "Życzliwość",  color: "#E4779C", icon: "heart" },
  { code: "KR", short: "KRE", name: "Kreatywność", color: "#EF9F27", icon: "spark" },
];

export default function CharakterBohatera({ player, profile, onDetails }) {
  const scores = player?.lifetime_scores || {};
  // Stala skala = 50 punktow per cecha (kwiz daje max 24, misje dodaja powoli).
  // Quiz baseline wypelnia ~30-50% radara, nie 100%. Dalsze misje rosna polygon.
  const maxScore = 50;

  const archetypName = PROFILE_INFO[profile]?.name || "Detektyw";

  return (
    <div className="card pop-in" style={{
      background: "linear-gradient(180deg, #FCF5E1 0%, #F4E3B8 100%)",
      border: "1.5px solid #E1CB94",
      boxShadow: "0 4px 0 rgba(120,90,30,.18), 0 14px 30px rgba(80,50,10,.18)",
      padding: "18px 18px 16px",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.5, color: "var(--p-magic-dk)" }}>CHARAKTER BOHATERA</div>
        <div style={{ fontSize: 12, color: "var(--p-ink-soft)" }}>
          Archetyp: <span style={{ fontWeight: 800, color: "var(--p-magic-dk)" }}>{archetypName}</span>
        </div>
      </div>

      {/* RADAR na gorze, na pelnej szerokosci */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", margin: "8px 0 14px" }}>
        <RadarSvg traits={TRAITS} scores={scores} maxScore={maxScore} />
      </div>

      {/* LISTA STATOW - grid 2 kolumny pod radarem, responsywny */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        gap: 8,
      }}>
        {TRAITS.map((t) => (
          <StatRow key={t.code} trait={t} value={scores[t.code] || 0} />
        ))}
      </div>

      {/* DOLNY PASEK - postep tygodnia w profilu + Szczegoly */}
      <div style={{ display: "flex", gap: 8, marginTop: 14, alignItems: "center" }}>
        <div style={{ flex: 1, background: "rgba(122,77,194,.15)", color: "var(--p-magic-dk)", padding: "10px 14px", borderRadius: 999, fontSize: 13, fontWeight: 700, textAlign: "center" }}>
          +0 {(TRAITS.find((t) => t.code === profile)?.name || "punktów").toLowerCase()} w tym tyg.
        </div>
        {onDetails && (
          <button onClick={onDetails} className="btn btn-ghost btn-sm" style={{ background: "#fff", borderRadius: 999, fontSize: 13, padding: "10px 16px" }}>
            Szczegóły →
          </button>
        )}
      </div>
    </div>
  );
}

function RadarSvg({ traits, scores, maxScore }) {
  const size = 260;
  const cx = size / 2;
  const cy = size / 2;
  const R = 92; // outer hexagon radius
  // 6 wierzcholkow heksagonu (start na gorze, zegarowy)
  function vertex(i, r = R) {
    const angle = -Math.PI / 2 + (i / 6) * Math.PI * 2;
    return [cx + Math.cos(angle) * r, cy + Math.sin(angle) * r];
  }
  // Punkty siatki
  const outerHex = traits.map((_, i) => vertex(i).join(",")).join(" ");
  const mid75 = traits.map((_, i) => vertex(i, R * 0.75).join(",")).join(" ");
  const mid50 = traits.map((_, i) => vertex(i, R * 0.5).join(",")).join(" ");
  // Punkty polygonu gracza
  const dataPoints = traits.map((t, i) => {
    const val = (scores[t.code] || 0) / maxScore;
    return vertex(i, R * val);
  });
  const dataPolygon = dataPoints.map((p) => p.join(",")).join(" ");
  // Pozycje labelek (poza heksagonem)
  const labels = traits.map((t, i) => ({
    trait: t,
    x: vertex(i, R + 18)[0],
    y: vertex(i, R + 18)[1],
  }));

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <radialGradient id="radar-glow" cx=".5" cy=".5">
          <stop offset="0%" stopColor="#FFD269" stopOpacity=".55" />
          <stop offset="100%" stopColor="#FFD269" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Glow w srodku */}
      <circle cx={cx} cy={cy} r={R * 0.7} fill="url(#radar-glow)" />
      {/* Siatka heksagonalna 3 poziomy */}
      <polygon points={outerHex} fill="rgba(184,134,52,.05)" stroke="#B88634" strokeWidth="1.5" />
      <polygon points={mid75} fill="none" stroke="rgba(184,134,52,.30)" strokeWidth="1" strokeDasharray="2 3" />
      <polygon points={mid50} fill="none" stroke="rgba(184,134,52,.20)" strokeWidth="1" strokeDasharray="2 3" />
      {/* Linie od centrum */}
      {traits.map((_, i) => {
        const [x, y] = vertex(i);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(184,134,52,.18)" strokeWidth="1" />;
      })}
      {/* Polygon danych */}
      <polygon points={dataPolygon} fill="rgba(122,77,194,.28)" stroke="#7A4DC2" strokeWidth="2.5" strokeLinejoin="round" />
      {/* Krople na punktach */}
      {dataPoints.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3.5" fill="#FFD269" stroke="#7A4DC2" strokeWidth="1.5" />
      ))}
      {/* Etykiety wokol */}
      {labels.map(({ trait, x, y }) => (
        <g key={trait.code}>
          <circle cx={x} cy={y} r="14" fill="#fff" stroke={trait.color} strokeWidth="2" />
          <text x={x} y={y} fontSize="9" fontWeight="800" textAnchor="middle" dominantBaseline="middle" fill={trait.color} fontFamily="Baloo 2, sans-serif">
            {trait.short}
          </text>
        </g>
      ))}
    </svg>
  );
}

function StatRow({ trait, value }) {
  return (
    <div style={{
      background: "rgba(255,255,255,.75)",
      borderRadius: 12, padding: "7px 10px",
      display: "flex", alignItems: "center", gap: 8,
    }}>
      <StatIcon kind={trait.icon} color={trait.color} />
      <span style={{ flex: 1, fontSize: 12, fontWeight: 700, color: "var(--p-ink)" }}>{trait.name}</span>
      <span style={{ fontSize: 14, fontWeight: 800, color: trait.color, minWidth: 14, textAlign: "right" }}>{value}</span>
    </div>
  );
}

function StatIcon({ kind, color }) {
  const size = 22;
  const bg = `${color}26`; // ~15% alpha
  const icons = {
    doc: <path d="M5 3h10l4 4v14H5z M14 3v5h5" stroke={color} strokeWidth="1.6" fill="none" strokeLinejoin="round"/>,
    shield: <path d="M12 3 L4 6 V12 C4 17 8 20 12 21 C16 20 20 17 20 12 V6 Z M9 12 L11 14 L15 10" stroke={color} strokeWidth="1.6" fill="none" strokeLinejoin="round"/>,
    search: <g stroke={color} strokeWidth="1.6" fill="none"><circle cx="10" cy="10" r="5"/><line x1="14" y1="14" x2="18" y2="18"/></g>,
    target: <g stroke={color} strokeWidth="1.6" fill="none"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1" fill={color}/></g>,
    heart: <path d="M12 19 C12 19 4 14 4 9 C4 6.5 6 5 8 5 C10 5 12 7 12 7 C12 7 14 5 16 5 C18 5 20 6.5 20 9 C20 14 12 19 12 19 Z" stroke={color} strokeWidth="1.6" fill="none"/>,
    spark: <path d="M12 4 L13.5 10 L19 11 L13.5 12 L12 18 L10.5 12 L5 11 L10.5 10 Z" stroke={color} strokeWidth="1.6" fill="none" strokeLinejoin="round"/>,
  };
  return (
    <div style={{ width: size + 8, height: size + 8, borderRadius: 8, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <svg width={size} height={size} viewBox="0 0 24 24">{icons[kind] || null}</svg>
    </div>
  );
}
