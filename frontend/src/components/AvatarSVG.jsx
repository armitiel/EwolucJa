import React from "react";

/**
 * AvatarSVG — Komponent awatara w stylu Claymorphism / Pixar
 *
 * Props:
 *  - config: { skinTone, hairStyle, hairColor, eyeColor, auraColor }
 *  - equipment: string[] — lista ID ekwipunku do renderowania
 *  - size: number (domyślnie 200)
 *  - animate: boolean (domyślnie true)
 */

// ── Palety kolorów ────────────────────────────────────────────────────

export const SKIN_TONES = [
  { id: "light",  hex: "#FDDCB5", shadow: "#E8C49A", name: "Jasna" },
  { id: "medium", hex: "#E8B887", shadow: "#D4A070", name: "Średnia" },
  { id: "tan",    hex: "#C8956C", shadow: "#B07D55", name: "Opalona" },
  { id: "brown",  hex: "#A0724A", shadow: "#8A5E3A", name: "Brązowa" },
  { id: "dark",   hex: "#6B4226", shadow: "#553418", name: "Ciemna" },
];

export const HAIR_COLORS = [
  { id: "black",    hex: "#2C1810", name: "Czarne" },
  { id: "brown",    hex: "#6B3A2A", name: "Brązowe" },
  { id: "blonde",   hex: "#D4A843", name: "Blond" },
  { id: "red",      hex: "#B84430", name: "Rude" },
  { id: "blue",     hex: "#4A90D9", name: "Niebieskie" },
  { id: "purple",   hex: "#8B5CF6", name: "Fioletowe" },
  { id: "green",    hex: "#34D399", name: "Zielone" },
  { id: "pink",     hex: "#F472B6", name: "Różowe" },
];

export const EYE_COLORS = [
  { id: "brown",  hex: "#6B3A2A", name: "Brązowe" },
  { id: "blue",   hex: "#3B82F6", name: "Niebieskie" },
  { id: "green",  hex: "#22C55E", name: "Zielone" },
  { id: "hazel",  hex: "#A0845C", name: "Piwne" },
  { id: "amber",  hex: "#F59E0B", name: "Bursztynowe" },
];

export const AURA_COLORS = [
  { id: "golden",  hex: "#FFD700", glow: "#FFD70055", name: "Złota" },
  { id: "blue",    hex: "#60A5FA", glow: "#60A5FA55", name: "Błękitna" },
  { id: "green",   hex: "#34D399", glow: "#34D39955", name: "Szmaragdowa" },
  { id: "purple",  hex: "#A78BFA", glow: "#A78BFA55", name: "Fioletowa" },
  { id: "pink",    hex: "#F472B6", glow: "#F472B655", name: "Różowa" },
  { id: "orange",  hex: "#FB923C", glow: "#FB923C55", name: "Pomarańczowa" },
];

export const HAIR_STYLES = [
  { id: "short",    name: "Krótkie" },
  { id: "spiky",    name: "Jeżyk" },
  { id: "long",     name: "Długie" },
  { id: "curly",    name: "Kręcone" },
  { id: "ponytail", name: "Kucyk" },
  { id: "buns",     name: "Koczki" },
];

// ── Definicje ekwipunku ──────────────────────────────────────────────

export const EQUIPMENT_DEFS = {
  // Starter items (Zadanie 1 — Dolina Selfie)
  magnifier:    { name: "Lupa Odkrywcy",      profile: "DT", emoji: "🔍", slot: "hand_right" },
  shield:       { name: "Tarcza Odwagi",       profile: "LD", emoji: "🛡️", slot: "hand_left" },
  book:         { name: "Księga Mądrości",     profile: "ST", emoji: "📚", slot: "hand_right" },
  backpack:     { name: "Plecak Podróżnika",  profile: "KR", emoji: "🎒", slot: "back" },

  // Nagrody za krainy
  green_cape:     { name: "Zielona Peleryna",    profile: "EM", emoji: "🧥", slot: "back" },
  time_compass:   { name: "Kompas Czasu",        profile: "ST", emoji: "🧭", slot: "belt" },
  inventor_goggles:{ name: "Gogle Wynalazcy",    profile: "KR", emoji: "🥽", slot: "head" },
  courage_crown:  { name: "Korona Odwagi",       profile: "LD", emoji: "👑", slot: "head" },
  crystal_heart:  { name: "Kryształowe Serce",   profile: "EM", emoji: "💎", slot: "chest" },
  wisdom_scroll:  { name: "Zwój Mądrości",       profile: "DT", emoji: "📜", slot: "hand_left" },
  peace_branch:   { name: "Gałązka Pokoju",      profile: "MD", emoji: "🕊️", slot: "hand_right" },
  team_medal:     { name: "Medal Drużyny",        profile: "MD", emoji: "🏅", slot: "chest" },
  star_boots:     { name: "Buty Gwiazd",          profile: "KR", emoji: "⭐", slot: "feet" },
  diamond_chest:  { name: "Diamentowa Skrzynia",  profile: "ST", emoji: "💠", slot: "special" },
};

// Mapowanie wyborów zadań na ekwipunek
export const TASK_EQUIPMENT_MAP = {
  "1_A": "magnifier",
  "1_B": "shield",
  "1_C": "book",
  "1_D": "backpack",
  "3_A": "green_cape",        // pomoc Chowańcowi → Zielona Peleryna
  "4_WAIT": "diamond_chest",  // cierpliwość → Diamentowa Skrzynia
  "4_CLICK": "time_compass",  // szybka reakcja → Kompas Czasu
  "6_A": "courage_crown",     // retry → Korona Odwagi
  "6_B": "wisdom_scroll",     // hint → Zwój Mądrości
  "8_C": "peace_branch",      // kompromis → Gałązka Pokoju
  "8_B": "team_medal",        // głosowanie → Medal Drużyny
  "9_A": "star_boots",        // kapitan → Buty Gwiazd
  "9_C": "crystal_heart",     // dusza towarzystwa → Kryształowe Serce
};

// ── Renderowanie włosów ──────────────────────────────────────────────

function HairSVG({ style, color, shadowColor }) {
  const s = shadowColor || shadeColor(color, -25);
  switch (style) {
    case "short":
      return (
        <g>
          <ellipse cx="100" cy="52" rx="48" ry="32" fill={color} />
          <ellipse cx="100" cy="56" rx="44" ry="24" fill={s} opacity="0.3" />
        </g>
      );
    case "spiky":
      return (
        <g>
          <ellipse cx="100" cy="55" rx="46" ry="28" fill={color} />
          <polygon points="70,38 78,15 88,38" fill={color} />
          <polygon points="88,32 96,8 106,32" fill={color} />
          <polygon points="106,32 114,12 122,38" fill={color} />
          <polygon points="120,42 130,22 135,48" fill={color} />
          <polygon points="65,48 60,30 72,45" fill={color} />
        </g>
      );
    case "long":
      return (
        <g>
          <ellipse cx="100" cy="52" rx="50" ry="34" fill={color} />
          <rect x="54" y="55" width="18" height="60" rx="9" fill={color} />
          <rect x="128" y="55" width="18" height="60" rx="9" fill={color} />
          <ellipse cx="63" cy="115" rx="9" ry="6" fill={s} opacity="0.3" />
          <ellipse cx="137" cy="115" rx="9" ry="6" fill={s} opacity="0.3" />
        </g>
      );
    case "curly":
      return (
        <g>
          <ellipse cx="100" cy="52" rx="50" ry="34" fill={color} />
          <circle cx="58" cy="60" r="14" fill={color} />
          <circle cx="142" cy="60" r="14" fill={color} />
          <circle cx="55" cy="80" r="12" fill={color} />
          <circle cx="145" cy="80" r="12" fill={color} />
          <circle cx="60" cy="98" r="10" fill={color} />
          <circle cx="140" cy="98" r="10" fill={color} />
          <circle cx="70" cy="36" r="10" fill={color} />
          <circle cx="130" cy="36" r="10" fill={color} />
          <circle cx="100" cy="30" r="12" fill={color} />
        </g>
      );
    case "ponytail":
      return (
        <g>
          <ellipse cx="100" cy="52" rx="48" ry="32" fill={color} />
          <ellipse cx="100" cy="28" rx="14" ry="10" fill={color} />
          <rect x="93" y="28" width="14" height="20" fill={color} />
          <ellipse cx="100" cy="12" rx="10" ry="14" fill={color} />
          <circle cx="100" cy="2" r="8" fill={s} opacity="0.4" />
        </g>
      );
    case "buns":
      return (
        <g>
          <ellipse cx="100" cy="52" rx="48" ry="30" fill={color} />
          <circle cx="70" cy="30" r="16" fill={color} />
          <circle cx="130" cy="30" r="16" fill={color} />
          <circle cx="70" cy="30" r="10" fill={s} opacity="0.2" />
          <circle cx="130" cy="30" r="10" fill={s} opacity="0.2" />
        </g>
      );
    default:
      return <ellipse cx="100" cy="52" rx="48" ry="32" fill={color} />;
  }
}

// ── Renderowanie ekwipunku ───────────────────────────────────────────

function EquipmentSVG({ equipment }) {
  if (!equipment || equipment.length === 0) return null;

  const items = equipment
    .map((id) => EQUIPMENT_DEFS[id])
    .filter(Boolean);

  return (
    <g className="equipment-layer">
      {items.map((item) => {
        switch (item.slot) {
          case "head":
            return (
              <g key={item.name}>
                {/* Korona / Gogle na głowie */}
                <text x="100" y="28" textAnchor="middle" fontSize="22" style={{ filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.3))" }}>
                  {item.emoji}
                </text>
              </g>
            );
          case "hand_right":
            return (
              <g key={item.name}>
                <text x="155" y="148" textAnchor="middle" fontSize="20" style={{ filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.3))" }}>
                  {item.emoji}
                </text>
              </g>
            );
          case "hand_left":
            return (
              <g key={item.name}>
                <text x="45" y="148" textAnchor="middle" fontSize="20" style={{ filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.3))" }}>
                  {item.emoji}
                </text>
              </g>
            );
          case "chest":
            return (
              <g key={item.name}>
                <text x="100" y="130" textAnchor="middle" fontSize="18" style={{ filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.3))" }}>
                  {item.emoji}
                </text>
              </g>
            );
          case "back":
            return (
              <g key={item.name}>
                {/* Peleryna / Plecak za postacią */}
                <text x="100" y="112" textAnchor="middle" fontSize="20" opacity="0.85" style={{ filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.3))" }}>
                  {item.emoji}
                </text>
              </g>
            );
          case "belt":
            return (
              <g key={item.name}>
                <text x="118" y="155" textAnchor="middle" fontSize="16" style={{ filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.3))" }}>
                  {item.emoji}
                </text>
              </g>
            );
          case "feet":
            return (
              <g key={item.name}>
                <text x="85" y="198" textAnchor="middle" fontSize="14" style={{ filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.3))" }}>
                  {item.emoji}
                </text>
                <text x="115" y="198" textAnchor="middle" fontSize="14" style={{ filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.3))" }}>
                  {item.emoji}
                </text>
              </g>
            );
          case "special":
            return (
              <g key={item.name}>
                <text x="160" y="170" textAnchor="middle" fontSize="18" style={{ filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.3))" }}>
                  {item.emoji}
                </text>
              </g>
            );
          default:
            return null;
        }
      })}
    </g>
  );
}

// ── Główny komponent awatara ────────────────────────────────────────

export default function AvatarSVG({
  config = {},
  equipment = [],
  size = 200,
  animate = true,
  showAura = true,
}) {
  const skin = SKIN_TONES.find((s) => s.id === config.skinTone) || SKIN_TONES[0];
  const hair = HAIR_COLORS.find((h) => h.id === config.hairColor) || HAIR_COLORS[0];
  const eyes = EYE_COLORS.find((e) => e.id === config.eyeColor) || EYE_COLORS[0];
  const aura = AURA_COLORS.find((a) => a.id === config.auraColor) || AURA_COLORS[0];
  const hairStyle = config.hairStyle || "short";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 210"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: "visible" }}
    >
      <defs>
        {/* Claymorphism cieniowanie */}
        <filter id="clay-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#00000033" />
        </filter>
        <filter id="clay-inner" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#ffffff22" />
        </filter>
        {/* Aura glow */}
        <radialGradient id="aura-glow">
          <stop offset="0%" stopColor={aura.glow} />
          <stop offset="60%" stopColor={aura.glow} />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        {/* Skin gradient for 3D look */}
        <radialGradient id="skin-grad" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor={lightenColor(skin.hex, 15)} />
          <stop offset="100%" stopColor={skin.hex} />
        </radialGradient>
        <radialGradient id="body-grad" cx="40%" cy="30%" r="70%">
          <stop offset="0%" stopColor={lightenColor(skin.hex, 10)} />
          <stop offset="100%" stopColor={skin.shadow} />
        </radialGradient>
      </defs>

      {/* Aura */}
      {showAura && (
        <g>
          <ellipse
            cx="100" cy="105" rx="95" ry="100"
            fill="url(#aura-glow)"
            opacity="0.6"
          >
            {animate && (
              <animate attributeName="rx" values="90;98;90" dur="3s" repeatCount="indefinite" />
            )}
          </ellipse>
        </g>
      )}

      {/* Ekwipunek — warstwa tylna (peleryna, plecak) */}
      <EquipmentSVG equipment={equipment.filter(id => {
        const def = EQUIPMENT_DEFS[id];
        return def && def.slot === "back";
      })} />

      {/* ── CIAŁO ── */}
      <g filter="url(#clay-shadow)">
        {/* Szyja */}
        <rect x="88" y="88" width="24" height="22" rx="8" fill={skin.hex} />

        {/* Tułów — zaokrąglony kształt koszulki */}
        <path
          d="M60,115 Q60,105 80,102 L120,102 Q140,105 140,115 L140,170 Q140,185 100,185 Q60,185 60,170 Z"
          fill="#5B7FFF"
          filter="url(#clay-inner)"
        />
        {/* Koszulka highlight */}
        <path
          d="M70,110 Q70,106 85,104 L115,104 Q130,106 130,110 L130,140 Q130,150 100,150 Q70,150 70,140 Z"
          fill="#6B8FFF"
          opacity="0.5"
        />

        {/* Ręce */}
        <ellipse cx="52" cy="135" rx="14" ry="20" fill={skin.hex} />
        <ellipse cx="52" cy="135" rx="11" ry="17" fill="url(#skin-grad)" opacity="0.6" />
        <ellipse cx="148" cy="135" rx="14" ry="20" fill={skin.hex} />
        <ellipse cx="148" cy="135" rx="11" ry="17" fill="url(#skin-grad)" opacity="0.6" />

        {/* Nogi */}
        <rect x="75" y="175" width="22" height="28" rx="10" fill="#4A5578" />
        <rect x="103" y="175" width="22" height="28" rx="10" fill="#4A5578" />

        {/* Buty */}
        <ellipse cx="86" cy="200" rx="16" ry="8" fill="#3D3D50" />
        <ellipse cx="114" cy="200" rx="16" ry="8" fill="#3D3D50" />
      </g>

      {/* ── GŁOWA ── */}
      <g filter="url(#clay-shadow)">
        {/* Włosy (warstwa dolna) */}
        <HairSVG style={hairStyle} color={hair.hex} shadowColor={shadeColor(hair.hex, -20)} />

        {/* Twarz — elipsa */}
        <ellipse cx="100" cy="68" rx="38" ry="40" fill="url(#skin-grad)" />

        {/* Policzki — rumieniec */}
        <ellipse cx="72" cy="78" rx="10" ry="6" fill="#FFB5B5" opacity="0.35" />
        <ellipse cx="128" cy="78" rx="10" ry="6" fill="#FFB5B5" opacity="0.35" />

        {/* Oczy — duże, Pixar-style */}
        <g>
          {/* Białka */}
          <ellipse cx="84" cy="65" rx="12" ry="13" fill="white" />
          <ellipse cx="116" cy="65" rx="12" ry="13" fill="white" />
          {/* Tęczówki */}
          <circle cx="86" cy="66" r="8" fill={eyes.hex} />
          <circle cx="118" cy="66" r="8" fill={eyes.hex} />
          {/* Źrenice */}
          <circle cx="87" cy="67" r="4" fill="#1a1a2e" />
          <circle cx="119" cy="67" r="4" fill="#1a1a2e" />
          {/* Odblaski — żywe oczy */}
          <circle cx="89" cy="63" r="2.5" fill="white" opacity="0.9" />
          <circle cx="121" cy="63" r="2.5" fill="white" opacity="0.9" />
          <circle cx="85" cy="68" r="1.2" fill="white" opacity="0.5" />
          <circle cx="117" cy="68" r="1.2" fill="white" opacity="0.5" />
        </g>

        {/* Brwi */}
        <path d="M74,54 Q84,49 94,54" stroke={shadeColor(hair.hex, -10)} strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M106,54 Q116,49 126,54" stroke={shadeColor(hair.hex, -10)} strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {/* Nos */}
        <ellipse cx="100" cy="76" rx="4" ry="3" fill={skin.shadow} opacity="0.4" />

        {/* Uśmiech */}
        <path d="M88,84 Q100,94 112,84" stroke={skin.shadow} strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {/* Uszy */}
        <ellipse cx="62" cy="68" rx="8" ry="10" fill={skin.hex} />
        <ellipse cx="62" cy="68" rx="5" ry="7" fill={skin.shadow} opacity="0.25" />
        <ellipse cx="138" cy="68" rx="8" ry="10" fill={skin.hex} />
        <ellipse cx="138" cy="68" rx="5" ry="7" fill={skin.shadow} opacity="0.25" />
      </g>

      {/* Ekwipunek — warstwa przednia (przedmioty w rękach, na głowie, itd.) */}
      <EquipmentSVG equipment={equipment.filter(id => {
        const def = EQUIPMENT_DEFS[id];
        return def && def.slot !== "back";
      })} />

      {/* Animacja oddychania */}
      {animate && (
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,0;0,-2;0,0"
          dur="4s"
          repeatCount="indefinite"
          additive="sum"
        />
      )}
    </svg>
  );
}

// ── Utility ─────────────────────────────────────────────────────────

function shadeColor(hex, percent) {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + percent));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + percent));
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) + percent));
  return `#${(0x1000000 + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

function lightenColor(hex, percent) {
  return shadeColor(hex, Math.abs(percent));
}
