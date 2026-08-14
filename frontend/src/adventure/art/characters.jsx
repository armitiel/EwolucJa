/**
 * characters.jsx — postacie, awatar i przedmioty jako wektor.
 *
 * Awatar jest składany z warstw: sylwetka, kolor światła wybrany przez dziecko,
 * oraz elementy przyznane w przygodzie (strój / artefakt / znak). Dodanie nowego
 * elementu to wpis w `grants` w danych przygody i jeden przypadek w GRANT_ART.
 */

import React from "react";

function Aura({ color, r = 46, opacity = 0.45 }) {
  return (
    <>
      <defs>
        <filter id="cGlow" x="-70%" y="-70%" width="240%" height="240%">
          <feGaussianBlur stdDeviation="12" />
        </filter>
      </defs>
      <circle cx="60" cy="62" r={r} fill={color} opacity={opacity} filter="url(#cGlow)" />
    </>
  );
}

/* ── Opiekun Mapy ──────────────────────────────────────────────────────── */

export function OpiekunArt({ size = 132 }) {
  return (
    <svg viewBox="0 0 120 140" width={size} height={(size * 140) / 120} className="adv-char" aria-hidden="true">
      <Aura color="#F5D48B" r={44} opacity={0.4} />
      {/* płaszcz */}
      <path d="M60 44 q34 8 40 52 q4 30 -6 40 H26 q-10 -10 -6 -40 q6 -44 40 -52 Z" fill="#3A5B7A" />
      <path d="M60 44 q22 6 30 40 q4 22 -2 36 H32 q-6 -14 -2 -36 q8 -34 30 -40 Z" fill="#4E7796" />
      {/* kaptur */}
      <path d="M60 12 q26 0 28 30 q2 16 -8 20 q-8 -14 -20 -14 q-12 0 -20 14 q-10 -4 -8 -20 q2 -30 28 -30 Z" fill="#2E4A66" />
      {/* twarz */}
      <ellipse cx="60" cy="52" rx="17" ry="19" fill="#F3D8BC" />
      <circle cx="53" cy="50" r="2.3" fill="#3A3050" />
      <circle cx="67" cy="50" r="2.3" fill="#3A3050" />
      <path d="M53 60 q7 5 14 0" stroke="#3A3050" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      {/* broda */}
      <path d="M46 60 q14 26 28 0 q-2 24 -14 26 q-12 -2 -14 -26 Z" fill="#EDE6F5" opacity="0.95" />
      {/* latarnia w dłoni */}
      <g className="adv-float">
        <line x1="98" y1="70" x2="98" y2="86" stroke="#2E4A66" strokeWidth="2" />
        <circle cx="98" cy="92" r="9" fill="#FFE7B5" />
        <circle cx="98" cy="92" r="16" fill="#FFD98A" opacity="0.35" filter="url(#cGlow)" />
      </g>
    </svg>
  );
}

/* ── Szeptun (Las Szeptów) ─────────────────────────────────────────────── */

export function SzeptunArt({ size = 120 }) {
  return (
    <svg viewBox="0 0 120 140" width={size} height={(size * 140) / 120} className="adv-char adv-story-fox" aria-hidden="true">
      <Aura color="#9BE3AC" r={42} opacity={0.45} />
      <image href="/lis.svg" x="10" y="6" width="100" height="130" preserveAspectRatio="xMidYMid meet" />
      <circle cx="84" cy="34" r="12" fill="#9BE3AC" opacity="0.28" filter="url(#cGlow)" />
    </svg>
  );
}

/* ── Awatar dziecka ────────────────────────────────────────────────────── */

const GRANT_ART = {
  plaszcz: (c) => <path d="M60 50 q30 8 32 46 q2 24 -8 32 H36 q-10 -8 -8 -32 q2 -38 32 -46 Z" fill={c} opacity="0.92" />,
  szal: (c) => <path d="M42 58 q18 10 36 0 l4 12 q-22 12 -44 0 Z" fill={c} />,
  kaptur: (c) => <path d="M60 14 q24 0 26 26 q2 14 -8 18 q-8 -12 -18 -12 q-10 0 -18 12 q-10 -4 -8 -18 q2 -26 26 -26 Z" fill={c} />,
  naramiennik: (c) => (
    <g key="g">
      <ellipse cx="34" cy="62" rx="10" ry="7" fill={c} />
      <ellipse cx="86" cy="62" rx="10" ry="7" fill={c} />
    </g>
  ),
  latarnia: (c) => (
    <g className="adv-float">
      <circle cx="94" cy="88" r="7" fill="#FFE7B5" />
      <circle cx="94" cy="88" r="14" fill={c} opacity="0.4" filter="url(#cGlow)" />
    </g>
  ),
  pioro: (c) => <path d="M92 74 q14 -18 18 -2 q-10 12 -18 8 Z" fill={c} />,
  kamyk: (c) => <ellipse cx="28" cy="92" rx="9" ry="7" fill={c} opacity="0.9" />,
  wstega: (c) => <path d="M30 78 q30 16 60 0" stroke={c} strokeWidth="4" fill="none" strokeLinecap="round" />,
  slad: (c) => <ellipse cx="60" cy="104" rx="7" ry="4" fill={c} opacity="0.8" />,
  wiatr: (c) => <path d="M20 40 q16 -8 30 0 M18 50 q12 -6 22 0" stroke={c} strokeWidth="2.4" fill="none" strokeLinecap="round" opacity="0.8" />,
  ucho: (c) => <path d="M96 44 q10 -4 8 8 q-2 8 -10 6" stroke={c} strokeWidth="2.6" fill="none" strokeLinecap="round" />,
  krok: (c) => (
    <g opacity="0.8">
      <ellipse cx="48" cy="112" rx="5" ry="3" fill={c} />
      <ellipse cx="66" cy="118" rx="5" ry="3" fill={c} />
    </g>
  ),
};

export function AvatarArt({ size = 120, color = "#57C7D4", grants = [], grantDefs = {} }) {
  return (
    <svg viewBox="0 0 120 140" width={size} height={(size * 140) / 120} className="adv-char adv-avatar" aria-hidden="true">
      <Aura color={color} r={40} opacity={0.35} />
      <image href="/assets/adventure-v2/avatar-front-v2.png" x="3" y="0" width="114" height="140" preserveAspectRatio="xMidYMid meet" />
      {/* światło dziecka */}
      <circle cx="60" cy="72" r="5" fill={color} />
      <circle cx="60" cy="72" r="12" fill={color} opacity="0.4" filter="url(#cGlow)" />
    </svg>
  );
}

/* ── Iskra i drobiazgi ─────────────────────────────────────────────────── */

export function IskraArt({ size = 84, color = "#FFD98A" }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className="adv-iskra" aria-hidden="true">
      <defs>
        <filter id="iGlow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
      </defs>
      <circle cx="50" cy="50" r="30" fill={color} opacity="0.45" filter="url(#iGlow)" />
      <path d="M50 14 L58 42 L86 50 L58 58 L50 86 L42 58 L14 50 L42 42 Z" fill={color} />
      <circle cx="50" cy="50" r="7" fill="#FFFDF4" />
    </svg>
  );
}

export function PlecakArt({ size = 34, color = "#F5C45E" }) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} aria-hidden="true">
      <path d="M9 14 q11 -9 22 0 v18 q0 4 -4 4 H13 q-4 0 -4 -4 Z" fill="#4A5A86" />
      <path d="M14 12 q6 -6 12 0" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
      <rect x="15" y="22" width="10" height="8" rx="3" fill={color} />
    </svg>
  );
}

export const CHARACTER_ART = { opiekun: OpiekunArt, szeptun: SzeptunArt };

export function CharacterArt({ art, ...rest }) {
  const Cmp = CHARACTER_ART[art];
  return Cmp ? <Cmp {...rest} /> : null;
}
