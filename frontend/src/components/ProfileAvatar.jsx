/**
 * ProfileAvatar — inline SVG awatary dla 6 profili kompetencyjnych.
 * Styl: stylized claymorphism / Pixar-baby (krepe proporcje, miekkie linie,
 * matowe powierzchnie, brak ostrych katow).
 *
 * Uzycie:
 *   <ProfileAvatar profile="DT" size={120} />
 *   <ProfileAvatar profile="EM" size={48} />  // dla TopBar / list items
 *
 * Profile codes:
 *   DT = Detektyw (lis)       LD = Lider (lew)
 *   EM = Empata (zolwica)     MD = Mediator (osmiornik)
 *   ST = Strateg (sowa)
 *   KR = Kreator (panda)
 */
import React from "react";

export const PROFILE_INFO = {
  DT: { name: "Detektyw", emoji: "🔍", color: "#D85A30", glow: "rgba(216,90,48,.28)" },
  EM: { name: "Empata",   emoji: "💚", color: "#E4779C", glow: "rgba(228,119,156,.28)" },
  ST: { name: "Strateg",  emoji: "🦉", color: "#378ADD", glow: "rgba(55,138,221,.28)" },
  KR: { name: "Kreator",  emoji: "✨", color: "#EF9F27", glow: "rgba(239,159,39,.28)" },
  LD: { name: "Lider",    emoji: "🦁", color: "#E89A3D", glow: "rgba(232,154,61,.28)" },
  MD: { name: "Mediator", emoji: "🛡️", color: "#1D9E75", glow: "rgba(29,158,117,.28)" },
};

export default function ProfileAvatar({ profile = "DT", size = 120 }) {
  const Char = CHARACTERS[profile] || CHARACTERS.DT;
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" aria-hidden="true">
      <Char />
    </svg>
  );
}

const CHARACTERS = {
  DT: FoxDetective,
  EM: TurtleEmpath,
  ST: OwlStrategist,
  KR: PandaCreator,
  LD: LionLeader,
  MD: OctopusMediator,
};

// ──────────────────────────────────────────────────────────────
// DT — Detektyw (Lis)
// Pomaranczowy lis w plaszczu z monoklem
function FoxDetective() {
  return (
    <g>
      <defs>
        <radialGradient id="fox-body" cx=".5" cy=".4"><stop offset="0" stopColor="#F2A66B"/><stop offset="1" stopColor="#B85B27"/></radialGradient>
        <radialGradient id="fox-belly" cx=".5" cy=".5"><stop offset="0" stopColor="#FFF1DC"/><stop offset="1" stopColor="#F0D6A8"/></radialGradient>
      </defs>
      {/* Cien pod postacia */}
      <ellipse cx="60" cy="112" rx="32" ry="5" fill="rgba(80,40,10,.20)" />
      {/* Plaszcz */}
      <path d="M22 88 Q22 70 38 65 L82 65 Q98 70 98 88 L96 110 Q88 115 60 115 Q32 115 24 110 Z" fill="#6B3D2F"/>
      <rect x="55" y="78" width="10" height="32" rx="2" fill="#4A2A20"/>
      {/* Glowa - korpus pomaranczowy */}
      <ellipse cx="60" cy="55" rx="34" ry="32" fill="url(#fox-body)"/>
      {/* Pyszczek - jasna plama */}
      <ellipse cx="60" cy="64" rx="16" ry="13" fill="url(#fox-belly)"/>
      {/* Uszy */}
      <path d="M30 35 Q26 18 38 22 L42 38 Z" fill="url(#fox-body)"/>
      <path d="M90 35 Q94 18 82 22 L78 38 Z" fill="url(#fox-body)"/>
      <path d="M32 33 Q31 23 38 26 L41 36 Z" fill="#FFE5C2"/>
      <path d="M88 33 Q89 23 82 26 L79 36 Z" fill="#FFE5C2"/>
      {/* Monokl na prawym oku */}
      <circle cx="72" cy="50" r="11" fill="none" stroke="#7A4A1A" strokeWidth="2.5"/>
      <line x1="83" y1="50" x2="92" y2="48" stroke="#7A4A1A" strokeWidth="2"/>
      {/* Oczy */}
      <circle cx="48" cy="50" r="5" fill="#3B2A12"/>
      <circle cx="72" cy="50" r="5" fill="#3B2A12"/>
      <circle cx="49.5" cy="48.5" r="1.7" fill="#fff"/>
      <circle cx="73.5" cy="48.5" r="1.7" fill="#fff"/>
      {/* Nos */}
      <ellipse cx="60" cy="60" rx="3.5" ry="2.7" fill="#3B2A12"/>
      {/* Usmiech */}
      <path d="M55 67 Q60 70 65 67" fill="none" stroke="#3B2A12" strokeWidth="1.8" strokeLinecap="round"/>
    </g>
  );
}

// ──────────────────────────────────────────────────────────────
// EM — Empata (Zolwica z kwiatkiem)
function TurtleEmpath() {
  return (
    <g>
      <defs>
        <radialGradient id="turtle-shell" cx=".5" cy=".4"><stop offset="0" stopColor="#FBC9D8"/><stop offset="1" stopColor="#C57894"/></radialGradient>
        <radialGradient id="turtle-skin" cx=".5" cy=".5"><stop offset="0" stopColor="#F5EAF0"/><stop offset="1" stopColor="#D9C0CC"/></radialGradient>
      </defs>
      <ellipse cx="60" cy="112" rx="35" ry="5" fill="rgba(180,80,120,.18)"/>
      {/* Lapy */}
      <ellipse cx="32" cy="92" rx="9" ry="11" fill="url(#turtle-skin)"/>
      <ellipse cx="88" cy="92" rx="9" ry="11" fill="url(#turtle-skin)"/>
      <ellipse cx="40" cy="105" rx="8" ry="10" fill="url(#turtle-skin)"/>
      <ellipse cx="80" cy="105" rx="8" ry="10" fill="url(#turtle-skin)"/>
      {/* Skorupa */}
      <ellipse cx="60" cy="78" rx="40" ry="28" fill="url(#turtle-shell)"/>
      {/* Hexy na skorupie */}
      <path d="M48 70 L56 67 L64 70 L64 78 L56 81 L48 78 Z" fill="rgba(255,255,255,.30)"/>
      <path d="M68 68 L76 65 L84 68 L84 76 L76 79 L68 76 Z" fill="rgba(255,255,255,.30)"/>
      <path d="M58 82 L66 79 L74 82 L74 90 L66 93 L58 90 Z" fill="rgba(255,255,255,.30)"/>
      {/* Glowa */}
      <ellipse cx="60" cy="45" rx="22" ry="22" fill="url(#turtle-skin)"/>
      {/* Kwiatek na glowie */}
      <circle cx="60" cy="22" r="5" fill="#FFC6D8"/>
      <circle cx="55" cy="25" r="4" fill="#FFC6D8"/>
      <circle cx="65" cy="25" r="4" fill="#FFC6D8"/>
      <circle cx="60" cy="29" r="4" fill="#FFC6D8"/>
      <circle cx="60" cy="25" r="2.2" fill="#FFE3B0"/>
      {/* Oczy - duze, miekkie */}
      <ellipse cx="52" cy="44" rx="4" ry="5" fill="#3B2A28"/>
      <ellipse cx="68" cy="44" rx="4" ry="5" fill="#3B2A28"/>
      <circle cx="53" cy="42.5" r="1.5" fill="#fff"/>
      <circle cx="69" cy="42.5" r="1.5" fill="#fff"/>
      {/* Rumience */}
      <circle cx="44" cy="52" r="3.5" fill="rgba(231,123,156,.45)"/>
      <circle cx="76" cy="52" r="3.5" fill="rgba(231,123,156,.45)"/>
      {/* Usmiech */}
      <path d="M55 54 Q60 58 65 54" fill="none" stroke="#3B2A28" strokeWidth="1.7" strokeLinecap="round"/>
    </g>
  );
}

// ──────────────────────────────────────────────────────────────
// ST — Strateg (Sowa w okularach)
function OwlStrategist() {
  return (
    <g>
      <defs>
        <radialGradient id="owl-body" cx=".5" cy=".4"><stop offset="0" stopColor="#6F8FCC"/><stop offset="1" stopColor="#2D4577"/></radialGradient>
        <radialGradient id="owl-belly" cx=".5" cy=".5"><stop offset="0" stopColor="#F5DDA8"/><stop offset="1" stopColor="#D8B57A"/></radialGradient>
      </defs>
      <ellipse cx="60" cy="112" rx="32" ry="5" fill="rgba(45,69,119,.22)"/>
      {/* Cialo + glowa razem - sowy nie maja wyraznego oddzielenia */}
      <ellipse cx="60" cy="62" rx="40" ry="44" fill="url(#owl-body)"/>
      {/* Brzuch */}
      <ellipse cx="60" cy="72" rx="26" ry="30" fill="url(#owl-belly)"/>
      {/* Skrzydla */}
      <ellipse cx="22" cy="68" rx="11" ry="22" fill="#2D4577"/>
      <ellipse cx="98" cy="68" rx="11" ry="22" fill="#2D4577"/>
      {/* Pierka na piersi */}
      <path d="M50 68 Q60 66 70 68" fill="none" stroke="#B49254" strokeWidth="1.5"/>
      <path d="M48 78 Q60 76 72 78" fill="none" stroke="#B49254" strokeWidth="1.5"/>
      <path d="M50 88 Q60 86 70 88" fill="none" stroke="#B49254" strokeWidth="1.5"/>
      {/* Uszka */}
      <path d="M28 28 Q34 16 42 30" fill="#2D4577"/>
      <path d="M92 28 Q86 16 78 30" fill="#2D4577"/>
      {/* Okulary - duze, mosiezne */}
      <circle cx="46" cy="48" r="13" fill="#FFF" stroke="#B47322" strokeWidth="3"/>
      <circle cx="74" cy="48" r="13" fill="#FFF" stroke="#B47322" strokeWidth="3"/>
      <line x1="59" y1="48" x2="61" y2="48" stroke="#B47322" strokeWidth="3"/>
      {/* Oczy w okularach */}
      <circle cx="46" cy="48" r="5" fill="#3B2A12"/>
      <circle cx="74" cy="48" r="5" fill="#3B2A12"/>
      <circle cx="47.5" cy="46.5" r="1.7" fill="#fff"/>
      <circle cx="75.5" cy="46.5" r="1.7" fill="#fff"/>
      {/* Dziob */}
      <path d="M60 60 L56 70 L64 70 Z" fill="#E89A3D"/>
    </g>
  );
}

// ──────────────────────────────────────────────────────────────
// KR — Kreator (Panda czerwona z pedzelkiem)
function PandaCreator() {
  return (
    <g>
      <defs>
        <radialGradient id="panda-body" cx=".5" cy=".4"><stop offset="0" stopColor="#F5A04C"/><stop offset="1" stopColor="#B6571A"/></radialGradient>
      </defs>
      <ellipse cx="60" cy="112" rx="32" ry="5" fill="rgba(182,87,26,.22)"/>
      {/* Cialo */}
      <ellipse cx="60" cy="78" rx="32" ry="28" fill="url(#panda-body)"/>
      {/* Brzuch jasny */}
      <ellipse cx="60" cy="82" rx="20" ry="20" fill="#FFE5C2"/>
      {/* Glowa */}
      <ellipse cx="60" cy="48" rx="32" ry="28" fill="url(#panda-body)"/>
      {/* Uszy */}
      <ellipse cx="30" cy="30" rx="10" ry="11" fill="url(#panda-body)"/>
      <ellipse cx="90" cy="30" rx="10" ry="11" fill="url(#panda-body)"/>
      <ellipse cx="30" cy="32" rx="6" ry="7" fill="#FFE5C2"/>
      <ellipse cx="90" cy="32" rx="6" ry="7" fill="#FFE5C2"/>
      {/* Maska na oczach - bialy ksztalt */}
      <ellipse cx="44" cy="46" rx="11" ry="13" fill="#FFFFFF"/>
      <ellipse cx="76" cy="46" rx="11" ry="13" fill="#FFFFFF"/>
      {/* Oczy */}
      <circle cx="46" cy="48" r="4.5" fill="#3B2A12"/>
      <circle cx="74" cy="48" r="4.5" fill="#3B2A12"/>
      <circle cx="47.5" cy="46.5" r="1.6" fill="#fff"/>
      <circle cx="75.5" cy="46.5" r="1.6" fill="#fff"/>
      {/* Nos */}
      <ellipse cx="60" cy="56" rx="3" ry="2.4" fill="#3B2A12"/>
      {/* Pyszczek */}
      <path d="M55 62 Q60 66 65 62" fill="none" stroke="#3B2A12" strokeWidth="1.7" strokeLinecap="round"/>
      {/* Pedzel w lapce - lewa strona */}
      <rect x="14" y="70" width="3" height="22" rx="1.5" fill="#7A4A1A" transform="rotate(-25 16 81)"/>
      <ellipse cx="11" cy="65" rx="4" ry="6" fill="#E84BA0" transform="rotate(-25 11 65)"/>
      {/* Iskierki / banki */}
      <circle cx="100" cy="35" r="3" fill="#7A4DC2" opacity=".7"/>
      <circle cx="108" cy="55" r="2" fill="#FFD269" opacity=".8"/>
      <circle cx="98" cy="68" r="2.5" fill="#E84BA0" opacity=".7"/>
    </g>
  );
}

// ──────────────────────────────────────────────────────────────
// LD — Lider (Lew z chorągiewką)
function LionLeader() {
  return (
    <g>
      <defs>
        <radialGradient id="lion-mane" cx=".5" cy=".5"><stop offset="0" stopColor="#FFD269"/><stop offset="1" stopColor="#C8843A"/></radialGradient>
        <radialGradient id="lion-face" cx=".5" cy=".4"><stop offset="0" stopColor="#F5DDA8"/><stop offset="1" stopColor="#D49A4B"/></radialGradient>
      </defs>
      <ellipse cx="60" cy="112" rx="32" ry="5" fill="rgba(168,108,33,.22)"/>
      {/* Cialo - tarcza/zbroja */}
      <path d="M30 80 Q30 70 42 68 L78 68 Q90 70 90 80 L88 108 Q60 116 32 108 Z" fill="#A8651F"/>
      <circle cx="60" cy="86" r="8" fill="#FFD269"/>
      <path d="M60 80 L62 85 L67 86 L63 89 L64 94 L60 91 L56 94 L57 89 L53 86 L58 85 Z" fill="#E89A3D"/>
      {/* Grzywa - radialna, fluffy */}
      <circle cx="60" cy="46" r="42" fill="url(#lion-mane)"/>
      <circle cx="28" cy="46" r="10" fill="url(#lion-mane)"/>
      <circle cx="92" cy="46" r="10" fill="url(#lion-mane)"/>
      <circle cx="38" cy="22" r="8" fill="url(#lion-mane)"/>
      <circle cx="82" cy="22" r="8" fill="url(#lion-mane)"/>
      <circle cx="60" cy="14" r="9" fill="url(#lion-mane)"/>
      {/* Pyszczek */}
      <ellipse cx="60" cy="52" rx="22" ry="22" fill="url(#lion-face)"/>
      {/* Oczy */}
      <circle cx="50" cy="48" r="4" fill="#3B2A12"/>
      <circle cx="70" cy="48" r="4" fill="#3B2A12"/>
      <circle cx="51" cy="46.8" r="1.4" fill="#fff"/>
      <circle cx="71" cy="46.8" r="1.4" fill="#fff"/>
      {/* Nos */}
      <ellipse cx="60" cy="58" rx="4" ry="3" fill="#7A4A1A"/>
      {/* Pyszczek - usta */}
      <path d="M60 60 L60 64 M55 66 Q60 70 65 66" fill="none" stroke="#3B2A12" strokeWidth="1.7" strokeLinecap="round"/>
      {/* Chorągiewka */}
      <rect x="95" y="40" width="2.5" height="40" fill="#7A4A1A"/>
      <path d="M97 40 L114 44 L97 48 Z" fill="#E84BA0"/>
      <path d="M105 46 L107 44 L107 48 Z" fill="#FFD269"/>
    </g>
  );
}

// ──────────────────────────────────────────────────────────────
// MD — Mediator (Osmiornik ze wstega)
function OctopusMediator() {
  return (
    <g>
      <defs>
        <radialGradient id="octo-body" cx=".5" cy=".4"><stop offset="0" stopColor="#A8E8D2"/><stop offset="1" stopColor="#1D9E75"/></radialGradient>
      </defs>
      <ellipse cx="60" cy="112" rx="36" ry="5" fill="rgba(29,158,117,.22)"/>
      {/* Macki - 6 widocznych */}
      <path d="M30 80 Q22 90 24 105 Q24 110 30 110 Q32 100 36 92 Z" fill="url(#octo-body)"/>
      <path d="M42 92 Q38 102 36 112 Q42 113 44 110 Q46 100 46 92 Z" fill="url(#octo-body)"/>
      <path d="M54 96 Q52 108 50 114 Q56 115 58 112 Q58 100 60 96 Z" fill="url(#octo-body)"/>
      <path d="M66 96 Q68 108 70 114 Q64 115 62 112 Q62 100 60 96 Z" fill="url(#octo-body)"/>
      <path d="M78 92 Q82 102 84 112 Q78 113 76 110 Q74 100 74 92 Z" fill="url(#octo-body)"/>
      <path d="M90 80 Q98 90 96 105 Q96 110 90 110 Q88 100 84 92 Z" fill="url(#octo-body)"/>
      {/* Glowa - duza, bulwiasta */}
      <ellipse cx="60" cy="55" rx="38" ry="38" fill="url(#octo-body)"/>
      {/* Korona-warkocz */}
      <path d="M40 20 Q60 8 80 20" fill="none" stroke="#FFC4DB" strokeWidth="4" strokeLinecap="round"/>
      <path d="M40 24 Q60 14 80 24" fill="none" stroke="#FFE3B0" strokeWidth="3" strokeLinecap="round"/>
      {/* Oczy - polprzymkniete, spokojne */}
      <ellipse cx="48" cy="52" rx="6" ry="3" fill="#3B2A12"/>
      <ellipse cx="72" cy="52" rx="6" ry="3" fill="#3B2A12"/>
      <ellipse cx="48" cy="51" rx="5" ry="1.5" fill="#fff" opacity=".7"/>
      <ellipse cx="72" cy="51" rx="5" ry="1.5" fill="#fff" opacity=".7"/>
      {/* Usmiech */}
      <path d="M52 64 Q60 68 68 64" fill="none" stroke="#3B2A12" strokeWidth="1.8" strokeLinecap="round"/>
      {/* Wstega laczen - swietlista */}
      <path d="M14 60 Q40 50 60 56 Q80 50 106 60" fill="none" stroke="#FFE5B8" strokeWidth="3.5" strokeLinecap="round" opacity=".85"/>
      <path d="M14 60 Q40 50 60 56 Q80 50 106 60" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round"/>
      {/* Rumience */}
      <circle cx="36" cy="58" r="4" fill="rgba(255,182,193,.50)"/>
      <circle cx="84" cy="58" r="4" fill="rgba(255,182,193,.50)"/>
    </g>
  );
}
