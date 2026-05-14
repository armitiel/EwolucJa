/**
 * art.jsx — biblioteka SVG ilustracji dla EwolucJA (Ghibli-bright fantasy).
 * Awatary, ikony krain, artefakty, fazy księżyca, mapa świata, ikony tab-baru, chmury.
 * Konwersja z handoff Claude Design — z globali na ES modules.
 */
import React from "react";

// ─── Sparkle (mała iskra) ─────────────────────────────────────
export const Sparkle = ({ size = 16, c = "#FFD269", delay = 0 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    style={{ animation: `sparkle 1.8s ease-in-out infinite`, animationDelay: `${delay}s` }}
  >
    <path d="M8 0L9.5 6.5L16 8L9.5 9.5L8 16L6.5 9.5L0 8L6.5 6.5Z" fill={c} />
  </svg>
);

// ─── Awatary: małe ghibli-podobne stworki ─────────────────────
export const Avatar = ({ kind = "fox", size = 80, evolved = 0 }) => {
  const wrap = { width: size, height: size, position: "relative", display: "inline-block" };
  return (
    <div style={wrap}>
      {evolved > 0 && <div className="aura" style={{ opacity: 0.4 + evolved * 0.2 }} />}
      <svg width={size} height={size} viewBox="0 0 100 100" style={{ position: "relative" }}>
        <ellipse cx="50" cy="92" rx="22" ry="3" fill="rgba(0,0,0,.16)" />
        {kind === "fox" && <FoxArt evolved={evolved} />}
        {kind === "owl" && <OwlArt evolved={evolved} />}
        {kind === "rabbit" && <RabbitArt evolved={evolved} />}
        {kind === "dragon" && <DragonArt evolved={evolved} />}
        {kind === "cat" && <CatArt evolved={evolved} />}
      </svg>
    </div>
  );
};

const FoxArt = ({ evolved = 0 }) => (
  <g>
    <path d="M22 60 Q10 50 14 38 Q18 28 28 32 L36 60 Z" fill="#E89A3D" />
    <path d="M14 38 Q12 32 16 28" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" />
    <ellipse cx="55" cy="65" rx="28" ry="22" fill="#F0A957" />
    <ellipse cx="55" cy="70" rx="20" ry="14" fill="#FBE2C0" />
    <path d="M30 42 L42 22 L52 36 L68 36 L78 22 L86 44 Q86 60 58 60 Q30 60 30 42 Z" fill="#E89A3D" />
    <path d="M42 22 L48 35 L40 30 Z" fill="#A8612A" />
    <path d="M78 22 L72 35 L80 30 Z" fill="#A8612A" />
    <ellipse cx="48" cy="46" rx="3" ry="3.5" fill="#4e4d76" />
    <ellipse cx="68" cy="46" rx="3" ry="3.5" fill="#4e4d76" />
    <circle cx="49" cy="45" r="1" fill="#fff" />
    <circle cx="69" cy="45" r="1" fill="#fff" />
    <ellipse cx="58" cy="55" rx="9" ry="5" fill="#FBE2C0" />
    <ellipse cx="58" cy="52" rx="2" ry="1.5" fill="#4e4d76" />
    <circle cx="40" cy="52" r="2" fill="#F0A957" opacity=".7" />
    <circle cx="76" cy="52" r="2" fill="#F0A957" opacity=".7" />
    {evolved >= 1 && (
      <g>
        <path d="M28 30 Q58 14 88 30 L86 36 Q58 22 30 36 Z" fill="#7A4DC2" />
        <circle cx="58" cy="20" r="4" fill="#FFD269" />
      </g>
    )}
    {evolved >= 2 && (
      <g>
        <path d="M22 60 Q12 50 14 36" stroke="#FFD269" strokeWidth="2" fill="none" opacity=".7" />
      </g>
    )}
  </g>
);

const OwlArt = ({ evolved = 0 }) => (
  <g>
    <ellipse cx="50" cy="60" rx="30" ry="32" fill="#7A8FB8" />
    <ellipse cx="50" cy="65" rx="22" ry="22" fill="#D6DDEB" />
    <path d="M30 38 Q30 28 40 28 Q50 28 50 36 Q50 28 60 28 Q70 28 70 38 Q70 52 50 64 Q30 52 30 38 Z" fill="#F4E3B8" />
    <circle cx="40" cy="42" r="7" fill="#fff" />
    <circle cx="60" cy="42" r="7" fill="#fff" />
    <circle cx="40" cy="43" r="4" fill="#4e4d76" />
    <circle cx="60" cy="43" r="4" fill="#4e4d76" />
    <circle cx="41" cy="42" r="1.4" fill="#fff" />
    <circle cx="61" cy="42" r="1.4" fill="#fff" />
    <path d="M50 50 L46 56 L54 56 Z" fill="#E89A3D" />
    <path d="M42 88 L42 92 M46 88 L46 92" stroke="#E89A3D" strokeWidth="3" strokeLinecap="round" />
    <path d="M54 88 L54 92 M58 88 L58 92" stroke="#E89A3D" strokeWidth="3" strokeLinecap="round" />
    <path d="M28 30 L34 22 L36 32 Z" fill="#7A8FB8" />
    <path d="M72 30 L66 22 L64 32 Z" fill="#7A8FB8" />
    {evolved >= 1 && (
      <g>
        <circle cx="50" cy="22" r="6" fill="#FFD269" opacity=".9" />
        <path d="M44 22 L56 22 M50 16 L50 28" stroke="#fff" strokeWidth="1.5" />
      </g>
    )}
  </g>
);

const RabbitArt = ({ evolved = 0 }) => (
  <g>
    <ellipse cx="38" cy="20" rx="5" ry="16" fill="#F4D6E0" />
    <ellipse cx="62" cy="20" rx="5" ry="16" fill="#F4D6E0" />
    <ellipse cx="38" cy="22" rx="2" ry="10" fill="#F08C8C" />
    <ellipse cx="62" cy="22" rx="2" ry="10" fill="#F08C8C" />
    <ellipse cx="50" cy="65" rx="26" ry="24" fill="#FBE2EA" />
    <ellipse cx="50" cy="70" rx="18" ry="14" fill="#fff" />
    <ellipse cx="42" cy="48" rx="2.6" ry="3" fill="#4e4d76" />
    <ellipse cx="58" cy="48" rx="2.6" ry="3" fill="#4e4d76" />
    <circle cx="43" cy="47" r="1" fill="#fff" />
    <circle cx="59" cy="47" r="1" fill="#fff" />
    <path d="M48 56 Q50 58 52 56" stroke="#4e4d76" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <path d="M50 53 L48 56 L52 56 Z" fill="#F08C8C" />
    <circle cx="36" cy="55" r="3" fill="#F4B7C9" opacity=".7" />
    <circle cx="64" cy="55" r="3" fill="#F4B7C9" opacity=".7" />
    {evolved >= 1 && (
      <g>
        <path d="M30 32 Q50 18 70 32" stroke="#7A4DC2" strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="30" cy="32" r="3" fill="#FFD269" />
        <circle cx="70" cy="32" r="3" fill="#FFD269" />
      </g>
    )}
  </g>
);

const DragonArt = ({ evolved = 0 }) => (
  <g>
    <path d="M22 70 Q8 70 12 56 Q16 48 26 52" stroke="#5FA76F" strokeWidth="8" fill="none" strokeLinecap="round" />
    <ellipse cx="55" cy="64" rx="28" ry="22" fill="#5FA76F" />
    <ellipse cx="55" cy="70" rx="20" ry="14" fill="#A6D9AE" />
    <path d="M40 46 L44 38 L48 46 Z" fill="#3F8056" />
    <path d="M52 42 L56 32 L60 42 Z" fill="#3F8056" />
    <path d="M64 46 L68 38 L72 46 Z" fill="#3F8056" />
    <ellipse cx="55" cy="50" rx="22" ry="18" fill="#5FA76F" />
    <ellipse cx="44" cy="46" rx="3" ry="3.5" fill="#fff" />
    <ellipse cx="66" cy="46" rx="3" ry="3.5" fill="#fff" />
    <ellipse cx="44" cy="47" rx="1.5" ry="2.2" fill="#4e4d76" />
    <ellipse cx="66" cy="47" rx="1.5" ry="2.2" fill="#4e4d76" />
    <ellipse cx="55" cy="58" rx="6" ry="3" fill="#3F8056" />
    <circle cx="52" cy="58" r="1" fill="#4e4d76" />
    <circle cx="58" cy="58" r="1" fill="#4e4d76" />
    <path d="M24 56 Q14 40 28 30 Q34 38 36 50 Z" fill="#A6D9AE" />
    <path d="M76 56 Q86 40 72 30 Q66 38 64 50 Z" fill="#A6D9AE" />
    {evolved >= 1 && <circle cx="55" cy="32" r="3" fill="#FFD269" />}
  </g>
);

const CatArt = ({ evolved = 0 }) => (
  <g>
    <ellipse cx="50" cy="68" rx="26" ry="22" fill="#3F3855" />
    <ellipse cx="50" cy="72" rx="18" ry="13" fill="#FBE2C0" />
    <path d="M28 44 L34 28 L42 38 L58 38 L66 28 L72 44 Q72 58 50 58 Q28 58 28 44 Z" fill="#3F3855" />
    <path d="M34 28 L38 38 L40 32 Z" fill="#7A6B98" />
    <path d="M66 28 L62 38 L60 32 Z" fill="#7A6B98" />
    <ellipse cx="42" cy="46" rx="3.5" ry="4" fill="#FFD269" />
    <ellipse cx="58" cy="46" rx="3.5" ry="4" fill="#FFD269" />
    <ellipse cx="42" cy="46" rx="1" ry="3" fill="#4e4d76" />
    <ellipse cx="58" cy="46" rx="1" ry="3" fill="#4e4d76" />
    <path d="M50 52 L47 55 M50 52 L53 55" stroke="#4e4d76" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="50" cy="52" r="1.5" fill="#F08C8C" />
    <path d="M30 50 L42 51 M30 54 L42 53" stroke="#fff" strokeWidth="1" opacity=".7" />
    <path d="M70 50 L58 51 M70 54 L58 53" stroke="#fff" strokeWidth="1" opacity=".7" />
    <path d="M76 70 Q88 60 84 50" stroke="#3F3855" strokeWidth="7" fill="none" strokeLinecap="round" />
    {evolved >= 1 && <circle cx="76" cy="22" r="6" fill="#FFD269" opacity=".7" />}
  </g>
);

// ─── Ikony krain (mapa) ───────────────────────────────────────
export const RegionIcon = ({ kind, size = 44 }) => {
  const icons = {
    forest: (
      <g>
        <ellipse cx="22" cy="38" rx="20" ry="4" fill="rgba(0,0,0,.15)" />
        <path d="M22 4 L8 26 L14 26 L6 38 L20 38 L20 44 L24 44 L24 38 L38 38 L30 26 L36 26 Z" fill="#4A8F66" />
        <path d="M22 8 L12 24 L18 24 L11 36 L33 36 L26 24 L32 24 Z" fill="#5FA76F" />
      </g>
    ),
    mountain: (
      <g>
        <ellipse cx="22" cy="38" rx="20" ry="4" fill="rgba(0,0,0,.15)" />
        <path d="M4 38 L18 14 L26 26 L32 18 L40 38 Z" fill="#7A8FB8" />
        <path d="M14 22 L18 14 L22 22 Z" fill="#fff" />
        <path d="M30 24 L32 18 L34 24 Z" fill="#fff" />
      </g>
    ),
    sea: (
      <g>
        <circle cx="22" cy="22" r="20" fill="#7BC0E8" />
        <path d="M4 24 Q12 20 22 24 T40 24" stroke="#fff" strokeWidth="2" fill="none" opacity=".7" />
        <path d="M4 30 Q12 26 22 30 T40 30" stroke="#fff" strokeWidth="2" fill="none" opacity=".7" />
        <path d="M22 8 L26 16 L34 16 L28 22 L30 30 L22 26 L14 30 L16 22 L10 16 L18 16 Z" fill="#FFD269" />
      </g>
    ),
    castle: (
      <g>
        <ellipse cx="22" cy="38" rx="20" ry="4" fill="rgba(0,0,0,.15)" />
        <rect x="8" y="20" width="28" height="20" fill="#C8B898" />
        <rect x="6" y="14" width="6" height="8" fill="#7A4DC2" />
        <rect x="32" y="14" width="6" height="8" fill="#7A4DC2" />
        <rect x="19" y="10" width="6" height="14" fill="#7A4DC2" />
        <rect x="19" y="28" width="6" height="12" fill="#5A3A92" rx="3" />
        <path d="M19 10 L22 6 L25 10 Z" fill="#E89A3D" />
      </g>
    ),
    desert: (
      <g>
        <ellipse cx="22" cy="38" rx="20" ry="4" fill="rgba(0,0,0,.15)" />
        <path d="M2 38 Q12 28 22 32 Q32 36 42 30 L42 40 L2 40 Z" fill="#E1C68A" />
        <circle cx="32" cy="14" r="6" fill="#FFD269" />
        <path d="M16 38 Q14 28 18 26 L20 38 Z" fill="#5FA76F" />
      </g>
    ),
    sky: (
      <g>
        <circle cx="14" cy="22" r="6" fill="#fff" />
        <ellipse cx="22" cy="22" rx="10" ry="6" fill="#fff" />
        <circle cx="30" cy="20" r="5" fill="#fff" />
        <path d="M30 30 L22 38 L18 32 Z" fill="#B886E8" />
      </g>
    ),
  };
  return <svg width={size} height={size} viewBox="0 0 44 44">{icons[kind]}</svg>;
};

// ─── Artefakty ────────────────────────────────────────────────
export const Artifact = ({ kind, size = 64 }) => {
  if (kind === "crystal") {
    return (
      <div style={{ width: size, height: size, position: "relative", display: "inline-block" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(184,134,232,.55), transparent 65%)",
            filter: "blur(2px)",
          }}
        />
        <img
          src="/assets/krysztal.png"
          alt=""
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            objectFit: "contain",
            filter: "drop-shadow(0 4px 8px rgba(122,77,194,.4))",
          }}
        />
      </div>
    );
  }
  const items = {
    feather: (
      <g>
        <path d="M16 56 Q20 36 32 22 Q40 14 48 12 Q46 28 38 38 Q30 48 22 54 Z" fill="#7BC0E8" />
        <path d="M22 54 Q28 38 38 26 Q42 22 46 18" stroke="#fff" strokeWidth="1.2" fill="none" opacity=".8" />
        <path d="M16 56 L20 60" stroke="#7A6B98" strokeWidth="2" strokeLinecap="round" />
      </g>
    ),
    book: (
      <g>
        <rect x="10" y="14" width="44" height="40" rx="3" fill="#7A4DC2" />
        <rect x="14" y="18" width="36" height="32" rx="1" fill="#FBF1D6" />
        <path d="M22 28 L42 28 M22 34 L42 34 M22 40 L36 40" stroke="#7A4DC2" strokeWidth="1.4" strokeLinecap="round" />
        <circle cx="32" cy="32" r="4" fill="#FFD269" stroke="#E89A3D" strokeWidth="1" />
      </g>
    ),
    key: (
      <g>
        <circle cx="20" cy="32" r="14" fill="none" stroke="#FFD269" strokeWidth="6" />
        <circle cx="20" cy="32" r="6" fill="#E89A3D" />
        <rect x="34" y="28" width="22" height="8" fill="#FFD269" />
        <rect x="46" y="28" width="4" height="14" fill="#FFD269" />
        <rect x="52" y="28" width="4" height="10" fill="#FFD269" />
      </g>
    ),
    leaf: (
      <g>
        <path d="M32 8 Q12 18 16 38 Q20 56 32 56 Q44 56 48 38 Q52 18 32 8 Z" fill="#5FA76F" />
        <path d="M32 12 L32 54" stroke="#3F8056" strokeWidth="1.5" />
        <path d="M32 22 Q26 24 22 30 M32 32 Q26 34 22 40 M32 22 Q38 24 42 30 M32 32 Q38 34 42 40" stroke="#3F8056" strokeWidth="1" fill="none" />
      </g>
    ),
    shell: (
      <g>
        <path d="M32 8 Q14 14 14 36 Q14 56 32 58 Q50 56 50 36 Q50 14 32 8 Z" fill="#F4D6E0" />
        <path d="M32 12 L32 56 M22 16 Q24 36 30 56 M42 16 Q40 36 34 56 M16 28 Q22 38 32 44 Q42 38 48 28" stroke="#E8A8BD" strokeWidth="1.2" fill="none" />
      </g>
    ),
  };
  return (
    <svg width={size} height={size} viewBox="0 0 64 64">
      <ellipse cx="32" cy="60" rx="20" ry="2" fill="rgba(0,0,0,.18)" />
      {items[kind]}
    </svg>
  );
};

// ─── Fazy księżyca / słońce ───────────────────────────────────
export const MoonPhase = ({ phase = 0, size = 48, glow = true }) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    {glow && <circle cx="24" cy="24" r="22" fill="#FFD269" opacity={phase === 5 ? 0.4 : 0.18} />}
    {phase === 5 && (
      <g>
        <circle cx="24" cy="24" r="13" fill="#FFD269" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
          const r = (a * Math.PI) / 180;
          return (
            <line
              key={a}
              x1={24 + Math.cos(r) * 16}
              y1={24 + Math.sin(r) * 16}
              x2={24 + Math.cos(r) * 22}
              y2={24 + Math.sin(r) * 22}
              stroke="#FFD269"
              strokeWidth="3"
              strokeLinecap="round"
            />
          );
        })}
      </g>
    )}
    {phase !== 5 && (
      <g>
        <circle cx="24" cy="24" r="14" fill="#F4E3B8" />
        {phase === 0 && <circle cx="24" cy="24" r="14" fill="#4e4d76" opacity=".85" />}
        {phase === 1 && <path d="M24 10 A14 14 0 0 0 24 38 A8 14 0 0 1 24 10 Z" fill="#4e4d76" opacity=".75" />}
        {phase === 2 && <path d="M24 10 A14 14 0 0 0 24 38 Z" fill="#4e4d76" opacity=".75" />}
        {phase === 3 && <path d="M24 10 A14 14 0 0 0 24 38 A4 14 0 0 0 24 10 Z" fill="#4e4d76" opacity=".60" />}
        <circle cx="20" cy="20" r="2" fill="#D6C58A" opacity=".6" />
        <circle cx="28" cy="26" r="1.4" fill="#D6C58A" opacity=".6" />
      </g>
    )}
  </svg>
);

// ─── Mapa świata (pergamin z krainami) ────────────────────────
export const WorldMap = ({ width = 320, height = 380, currentRegion = "forest", onPick }) => {
  const regions = [
    { id: "forest", x: 24, y: 62, label: "Las Pytań" },
    { id: "sea", x: 78, y: 48, label: "Morze Słów" },
    { id: "mountain", x: 60, y: 18, label: "Góry Liczb" },
    { id: "castle", x: 26, y: 24, label: "Zamek Czasu" },
    { id: "desert", x: 80, y: 78, label: "Pustynia Pomysłów" },
    { id: "sky", x: 48, y: 6, label: "Niebo Marzeń" },
  ];
  return (
    <div style={{ position: "relative", width, height }}>
      <svg width={width} height={height} viewBox="0 0 320 380" style={{ display: "block" }}>
        <defs>
          <radialGradient id="mapBg" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#FCF5E1" />
            <stop offset="100%" stopColor="#E1CB94" />
          </radialGradient>
          <pattern id="mapGrain" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="5" r="0.6" fill="#A8762A" opacity=".15" />
            <circle cx="14" cy="12" r="0.5" fill="#A8762A" opacity=".10" />
          </pattern>
        </defs>
        <rect width="320" height="380" rx="22" fill="url(#mapBg)" />
        <rect width="320" height="380" rx="22" fill="url(#mapGrain)" />
        <path d="M180 130 Q260 120 280 180 Q300 240 240 270 Q200 280 220 220 Q230 180 180 170 Z" fill="#A8D8F0" opacity=".7" />
        <path d="M200 170 Q230 175 240 200" stroke="#fff" strokeWidth="1.5" fill="none" opacity=".7" />
        <ellipse cx="80" cy="240" rx="65" ry="40" fill="#A6D9AE" opacity=".7" />
        {[[40, 230], [60, 250], [80, 235], [100, 255], [120, 240]].map((p, i) => (
          <path
            key={i}
            d={`M${p[0]} ${p[1] + 10} L${p[0] - 6} ${p[1]} L${p[0] + 6} ${p[1]} Z M${p[0]} ${p[1]} L${p[0] - 8} ${
              p[1] - 8
            } L${p[0] + 8} ${p[1] - 8} Z`}
            fill="#5FA76F"
          />
        ))}
        <path d="M150 80 L200 30 L250 80 Z" fill="#B5C4D9" />
        <path d="M180 50 L200 30 L220 50 Z" fill="#fff" />
        <ellipse cx="80" cy="100" rx="38" ry="24" fill="#D5C29A" opacity=".7" />
        <path d="M210 280 Q280 280 290 320 L210 320 Z" fill="#E1C68A" opacity=".7" />
        <path
          d="M80 320 Q130 290 100 240 Q70 200 130 160 Q170 140 220 80"
          stroke="#A8762A"
          strokeWidth="2.5"
          strokeDasharray="3 5"
          fill="none"
          opacity=".7"
        />
        <text x="240" y="200" fontSize="14" fill="#7A4DC2" fontFamily="Fredoka">⛵</text>
        <text x="20" y="350" fontSize="11" fill="#7A4D10" fontFamily="Fredoka" fontWeight="600">
          Zakątek Gamma
        </text>
        <g transform="translate(280 50)">
          <circle r="14" fill="#FCF5E1" stroke="#A8762A" strokeWidth="1" />
          <path d="M0 -10 L3 0 L0 10 L-3 0 Z" fill="#7A4DC2" />
          <text y="-16" textAnchor="middle" fontSize="10" fill="#7A4D10" fontFamily="Fredoka" fontWeight="700">
            N
          </text>
        </g>
      </svg>
      {regions.map((r) => (
        <button
          key={r.id}
          className={`pin ${currentRegion === r.id ? "active" : ""}`}
          style={{
            left: `${r.x}%`,
            top: `${r.y}%`,
            background: "transparent",
            border: "none",
            padding: 0,
          }}
          onClick={() => onPick && onPick(r.id)}
        >
          <div className="pin-label">{r.label}</div>
          <div className="pin-dot" />
        </button>
      ))}
    </div>
  );
};

// ─── Ikony tab-baru ───────────────────────────────────────────
export const TabIcons = {
  home: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11l9-8 9 8v10a2 2 0 01-2 2h-4v-7h-6v7H5a2 2 0 01-2-2z" />
    </svg>
  ),
  map: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round">
      <path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z" />
      <path d="M9 4v16M15 6v16" />
    </svg>
  ),
  bag: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round">
      <path d="M5 8h14l-1 12H6z" />
      <path d="M9 8V5a3 3 0 016 0v3" />
    </svg>
  ),
  hero: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="9" r="4" />
      <path d="M5 21c0-4 3-7 7-7s7 3 7 7" />
    </svg>
  ),
};

// ─── Coin (Złota Moneta) — currency icon ─────────────────────
export const Coin = ({ size = 22, anim = false, delay = 0 }) => {
  const uid = `coin-${size}-${Math.round(delay * 100)}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      style={{
        display: "inline-block",
        verticalAlign: "middle",
        animation: anim ? `coin-spin 2.6s ease-in-out infinite` : "none",
        animationDelay: `${delay}s`,
        filter: "drop-shadow(0 2px 3px rgba(120,80,10,.45))",
      }}
    >
      <defs>
        <radialGradient id={`coinG-${uid}`} cx="35%" cy="32%" r="70%">
          <stop offset="0" stopColor="#FFF1B0" />
          <stop offset=".55" stopColor="#FFD269" />
          <stop offset="1" stopColor="#C2851E" />
        </radialGradient>
        <linearGradient id={`coinR-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFE39A" />
          <stop offset="1" stopColor="#A66614" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="15" fill={`url(#coinR-${uid})`} />
      <circle cx="16" cy="16" r="12" fill={`url(#coinG-${uid})`} />
      <circle cx="16" cy="16" r="11" fill="none" stroke="#B47322" strokeWidth=".8" opacity=".55" />
      <path
        d="M16 7.5 L17.6 13.4 L23.6 14.0 L18.9 17.6 L20.6 23.4 L16 19.9 L11.4 23.4 L13.1 17.6 L8.4 14.0 L14.4 13.4 Z"
        fill="#B47322"
        opacity=".42"
      />
      <path
        d="M16 8.5 L17.4 13.6 L22.6 14.1 L18.5 17.1 L19.9 22.1 L16 19.0 L12.1 22.1 L13.5 17.1 L9.4 14.1 L14.6 13.6 Z"
        fill="#FFEFA8"
      />
      <ellipse cx="11.5" cy="11" rx="2.6" ry="1.4" fill="#fff" opacity=".75" />
    </svg>
  );
};

// Pigułka z licznikiem monet
export const CoinPill = ({ value = 0, size = 22, recent = null, onClick }) => (
  <button
    onClick={onClick}
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      height: 36,
      background: "linear-gradient(180deg,#FFF1B0,#FFD269)",
      color: "#7A4D10",
      fontWeight: 800,
      fontSize: 15,
      padding: "0 14px 0 8px",
      borderRadius: 999,
      boxShadow: "inset 0 0 0 1.8px #E1B66A, 0 3px 0 #B47322, 0 4px 10px rgba(160,110,30,.30)",
      border: "none",
      cursor: onClick ? "pointer" : "default",
      position: "relative",
      whiteSpace: "nowrap",
      fontFamily: "var(--font-body, 'Nunito'), sans-serif",
    }}
  >
    <Coin size={size} anim />
    <span style={{ lineHeight: 1 }}>{Number(value).toLocaleString("pl-PL")}</span>
    {recent != null && recent > 0 && (
      <span
        style={{
          position: "absolute",
          top: -10,
          right: -6,
          background: "#5FA76F",
          color: "#fff",
          fontWeight: 800,
          fontSize: 11,
          padding: "2px 7px",
          borderRadius: 999,
          boxShadow: "0 2px 4px rgba(74,143,102,.45)",
          animation: "coin-bump .6s ease-out",
        }}
      >
        +{recent}
      </span>
    )}
  </button>
);

// ─── Chmury ───────────────────────────────────────────────────
export const Cloud = ({ size = 80, opacity = 0.7 }) => (
  <svg width={size} height={size * 0.6} viewBox="0 0 100 60" style={{ opacity }}>
    <ellipse cx="30" cy="40" rx="22" ry="14" fill="#fff" />
    <ellipse cx="50" cy="32" rx="22" ry="18" fill="#fff" />
    <ellipse cx="72" cy="40" rx="20" ry="14" fill="#fff" />
    <ellipse cx="50" cy="44" rx="32" ry="10" fill="#fff" />
  </svg>
);

// ─── ScrollIcon (pergamin zwoju zamknietego) ───────────────────
// Inline SVG zamiast PNG - laduje sie natychmiast, skaluje plynnie, nie wpada w reflow.
export const ScrollIcon = ({ size = 60 }) => (
  <svg
    width={size}
    height={size * 1.55}
    viewBox="0 0 60 93"
    style={{ display: "block", filter: "drop-shadow(0 6px 12px rgba(120,80,30,.35))" }}
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="scrollPaper" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#FBF1D6" />
        <stop offset="1" stopColor="#E5C988" />
      </linearGradient>
      <linearGradient id="scrollRod" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#C68A3F" />
        <stop offset=".5" stopColor="#A66614" />
        <stop offset="1" stopColor="#7C4810" />
      </linearGradient>
      <linearGradient id="scrollRodLight" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#E1A968" />
        <stop offset="1" stopColor="#B47322" />
      </linearGradient>
    </defs>

    {/* Gorny drazek */}
    <ellipse cx="30" cy="8" rx="26" ry="6" fill="url(#scrollRod)" />
    <ellipse cx="30" cy="6" rx="26" ry="4" fill="url(#scrollRodLight)" />
    {/* Galki na koncach drazka */}
    <circle cx="4" cy="8" r="6" fill="#7C4810" />
    <circle cx="4" cy="8" r="4" fill="#A66614" />
    <circle cx="3" cy="7" r="1.5" fill="#E1A968" opacity=".7" />
    <circle cx="56" cy="8" r="6" fill="#7C4810" />
    <circle cx="56" cy="8" r="4" fill="#A66614" />
    <circle cx="55" cy="7" r="1.5" fill="#E1A968" opacity=".7" />

    {/* Glowny papier zwoju (zwiniety) */}
    <path
      d="M 10 12 L 10 82 Q 30 90 50 82 L 50 12 Q 30 18 10 12 Z"
      fill="url(#scrollPaper)"
      stroke="#C9A65C"
      strokeWidth="1"
    />
    {/* Tlocenia papieru - drobne linie sugerujace tekst */}
    <line x1="18" y1="32" x2="42" y2="33" stroke="#A88A4A" strokeWidth=".7" opacity=".55" />
    <line x1="18" y1="40" x2="40" y2="41" stroke="#A88A4A" strokeWidth=".7" opacity=".55" />
    <line x1="18" y1="48" x2="42" y2="49" stroke="#A88A4A" strokeWidth=".7" opacity=".55" />
    <line x1="18" y1="56" x2="38" y2="57" stroke="#A88A4A" strokeWidth=".7" opacity=".55" />
    <line x1="18" y1="64" x2="42" y2="65" stroke="#A88A4A" strokeWidth=".7" opacity=".55" />

    {/* Dolny drazek */}
    <ellipse cx="30" cy="84" rx="22" ry="5" fill="url(#scrollRod)" />
    <ellipse cx="30" cy="83" rx="22" ry="3" fill="url(#scrollRodLight)" />

    {/* Maly blik */}
    <ellipse cx="20" cy="20" rx="3" ry="6" fill="#fff" opacity=".35" />
  </svg>
);

// ─── MissionScroll (zwoj misji - assety SVG: zwoj-gora.svg + zwoj-papier.svg) ───
// Konstrukcja: 2x belka SVG (gora + dol) + papier-img miedzy (rozciagliwy w pionie).
// Animacja: tylko papier (height transition), belki pozostaja na miejscu.
// Aspect ratio belki: 1053.9 / 192.9 ≈ 5.46:1
// Aspect ratio papieru: 814.5 / 295.9 ≈ 2.75:1 (ale stretchujemy w pionie)

export const MissionScroll = ({ state = "closed", width = 280, children, onClick }) => {
  const isOpen = state === "open";
  // Belka: szerokosc = width, wysokosc = width / 5.46
  const rodAspect = 1053.9 / 192.9;
  const rodH = Math.round(width / rodAspect);
  // Wysokosc papieru w 2 stanach
  const paperClosedH = Math.round(width * 0.24); // cienka harmonijka miedzy belkami
  const paperOpenH = Math.round(width * 1.0);    // pelny rozwiniety papier (~ proporcja oryginalu)

  return (
    <div
      className={`mission-scroll mission-scroll--${state}`}
      style={{
        position: "relative",
        width,
        margin: "0 auto",
        cursor: onClick ? "pointer" : "default",
        userSelect: "none",
        WebkitTapHighlightColor: "transparent",
      }}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      aria-label={isOpen ? "Zwoj otwarty - kliknij aby zwinac" : "Zwoj zamkniety - kliknij aby rozwinac"}
    >
      {/* GORNA BELKA */}
      <img
        src="/zwoj-gora.svg"
        alt=""
        aria-hidden="true"
        width={width}
        height={rodH}
        style={{
          display: "block",
          width: "100%",
          height: rodH,
          position: "relative",
          zIndex: 3,
          filter: "drop-shadow(0 4px 5px rgba(80,50,10,.22))",
        }}
      />

      {/* PAPIER MIEDZY BELKAMI - transition TYLKO na height; szerokosc stala = 100% (jak belki) */}
      <div
        className="mission-paper"
        style={{
          position: "relative",
          width: "100%",
          marginTop: `${-Math.round(rodH * 0.18)}px`,
          marginBottom: `${-Math.round(rodH * 0.18)}px`,
          height: isOpen ? paperOpenH : paperClosedH,
          transition: "height 1.1s cubic-bezier(.33, 0, .30, 1)",
          zIndex: 1,
          overflow: "hidden",
        }}
      >
        <img
          src="/zwoj-papier.svg"
          alt=""
          aria-hidden="true"
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            // Wymusza rozciaganie SVG w pionie bez zachowania aspect-ratio
            objectFit: "fill",
          }}
        />
        {/* Tresc - widoczna tylko gdy otwarty, z fade-in */}
        {isOpen && children && (
          <div
            style={{
              position: "absolute",
              inset: "9% 8% 9% 8%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              overflow: "hidden",
              opacity: 0,
              animation: "fadeIn .55s ease .8s forwards",
              color: "#3B2A12",
              pointerEvents: "auto",
            }}
          >
            {children}
          </div>
        )}
      </div>

      {/* DOLNA BELKA */}
      <img
        src="/zwoj-gora.svg"
        alt=""
        aria-hidden="true"
        width={width}
        height={rodH}
        style={{
          display: "block",
          width: "100%",
          height: rodH,
          position: "relative",
          zIndex: 3,
          filter: "drop-shadow(0 6px 8px rgba(80,50,10,.28))",
        }}
      />
    </div>
  );
};

// ─── AdviceIcon (Porada dnia - swietlista perla z gwiazda) ─────
// Magiczna kula / lampka madrosci - zamiast wizarda na karcie "Porada dnia".
// Inline SVG = brak requestu HTTP, brak reflow.
export const AdviceIcon = ({ size = 60 }) => {
  const uid = `adv-${size}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 60 60"
      style={{ display: "block" }}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`${uid}-glow`} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#FFE4A0" stopOpacity=".9" />
          <stop offset=".4" stopColor="#FFC178" stopOpacity=".5" />
          <stop offset="1" stopColor="#FFC178" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${uid}-orb`} cx="35%" cy="32%" r="70%">
          <stop offset="0" stopColor="#FFF6D8" />
          <stop offset=".5" stopColor="#FFD269" />
          <stop offset="1" stopColor="#B886E8" />
        </radialGradient>
        <radialGradient id={`${uid}-shine`} cx="35%" cy="30%" r="22%">
          <stop offset="0" stopColor="#fff" stopOpacity=".95" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${uid}-base`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9C7AD8" />
          <stop offset="1" stopColor="#5A2BAE" />
        </linearGradient>
      </defs>

      {/* Zewnetrzny glow */}
      <circle cx="30" cy="28" r="28" fill={`url(#${uid}-glow)`} />

      {/* Kula madrosci */}
      <circle cx="30" cy="28" r="18" fill={`url(#${uid}-orb)`} stroke="#7A4DC2" strokeWidth="1.5" opacity=".9" />

      {/* Wewnetrzna gwiazda */}
      <path
        d="M30 18 L32 25 L39 26 L33.5 30.5 L35 37 L30 33.5 L25 37 L26.5 30.5 L21 26 L28 25 Z"
        fill="#fff"
        opacity=".85"
      />
      <path
        d="M30 19.5 L31.5 25 L37 25.5 L33 29 L34 34 L30 31.5 L26 34 L27 29 L23 25.5 L28.5 25 Z"
        fill="#7A4DC2"
        opacity=".6"
      />

      {/* Blik */}
      <ellipse cx="22" cy="20" rx="6" ry="3" fill={`url(#${uid}-shine)`} />

      {/* Podstawka (poduszka pod kula) */}
      <ellipse cx="30" cy="48" rx="14" ry="3" fill="#4A2D80" opacity=".25" />
      <path
        d="M 18 46 Q 30 50 42 46 L 40 53 Q 30 57 20 53 Z"
        fill={`url(#${uid}-base)`}
        stroke="#4A2D80"
        strokeWidth="1"
      />
      <ellipse cx="30" cy="47" rx="11" ry="2" fill="#C8A0F0" opacity=".5" />

      {/* Iskierki dookola */}
      <circle cx="8" cy="12" r="1.5" fill="#FFD269" opacity=".8" />
      <circle cx="52" cy="14" r="1.2" fill="#FFD269" opacity=".7" />
      <circle cx="6" cy="32" r="1" fill="#fff" opacity=".7" />
      <circle cx="54" cy="30" r="1.3" fill="#fff" opacity=".7" />
    </svg>
  );
};

// ─── Fake QR (do ekranu Invite) ────────────────────────────────
export const FakeQR = () => {
  const cells = [];
  const seed = (i, j) => ((i * 7 + j * 13 + ((i * j) % 5)) % 5) > 1;
  for (let i = 0; i < 14; i++)
    for (let j = 0; j < 14; j++) {
      if (seed(i, j)) cells.push(<rect key={`${i}-${j}`} x={j * 10} y={i * 10} width={10} height={10} fill="#4e4d76" />);
    }
  return (
    <svg viewBox="0 0 140 140" width="100%" height="100%">
      <rect width="140" height="140" fill="#fff" />
      {cells}
      <rect x="0" y="0" width="40" height="40" fill="#fff" />
      <rect x="0" y="0" width="40" height="40" fill="none" stroke="#4e4d76" strokeWidth="8" />
      <rect x="14" y="14" width="12" height="12" fill="#4e4d76" />
      <rect x="100" y="0" width="40" height="40" fill="#fff" />
      <rect x="100" y="0" width="40" height="40" fill="none" stroke="#4e4d76" strokeWidth="8" />
      <rect x="114" y="14" width="12" height="12" fill="#4e4d76" />
      <rect x="0" y="100" width="40" height="40" fill="#fff" />
      <rect x="0" y="100" width="40" height="40" fill="none" stroke="#4e4d76" strokeWidth="8" />
      <rect x="14" y="114" width="12" height="12" fill="#4e4d76" />
      <circle cx="70" cy="70" r="14" fill="#7A4DC2" />
      <path d="M70 60 L73 68 L82 68 L75 73 L78 82 L70 76 L62 82 L65 73 L58 68 L67 68 Z" fill="#FFD269" />
    </svg>
  );
};
