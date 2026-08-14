/**
 * scenes.jsx — tła krain jako wektor.
 *
 * Decyzja projektowa: sceny są rysowane w SVG, nie wczytywane jako bitmapy.
 * Powody: ostrość na każdym ekranie telefonu, kilkanaście kilobajtów zamiast
 * kilku megabajtów, możliwość reagowania na dotyk i kolor światła dziecka,
 * oraz brak zależności od pipeline'u graficznego przy pierwszym wydaniu.
 * Assety bitmapowe da się później podłożyć pod te same warstwy.
 */

import React from "react";

const VB = "0 0 390 780";
const SLICE = "xMidYMid slice";

function Glow({ cx, cy, r, color, opacity = 0.5 }) {
  return <circle cx={cx} cy={cy} r={r} fill={color} opacity={opacity} filter="url(#soft)" />;
}

function Defs({ id, stops, extra }) {
  return (
    <defs>
      <filter id="soft" x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="18" />
      </filter>
      <filter id="softer" x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="42" />
      </filter>
      <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
        {stops.map((s, i) => (
          <stop key={i} offset={s[0]} stopColor={s[1]} />
        ))}
      </linearGradient>
      {extra}
    </defs>
  );
}

/* ── Przystań Mapy ─────────────────────────────────────────────────────── */

export function PrzystanArt({ accent = "#57C7D4", lit = 0 }) {
  return (
    <svg viewBox={VB} preserveAspectRatio={SLICE} className="adv-art" aria-hidden="true">
      <Defs
        id="skyPrzystan"
        stops={[
          [0, "#0F1A3E"],
          [0.3, "#1E3163"],
          [0.55, "#3C5B85"],
          [0.74, "#7EA6B0"],
          [1, "#C9A57E"],
        ]}
        extra={
          <>
            <linearGradient id="waterPrzystan" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#8FB0B4" />
              <stop offset="0.28" stopColor="#3E6A84" />
              <stop offset="1" stopColor="#132C46" />
            </linearGradient>
            <linearGradient id="deckPrzystan" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#4A6076" />
              <stop offset="1" stopColor="#22364C" />
            </linearGradient>
          </>
        }
      />
      <rect width="390" height="780" fill="url(#skyPrzystan)" />

      {/* gwiazdy gasnące ku horyzontowi */}
      {Array.from({ length: 40 }).map((_, i) => {
        const x = (i * 97) % 390;
        const y = (i * 53) % 330;
        return <circle key={i} cx={x} cy={y} r={0.7 + (i % 3) * 0.5} fill="#EAF4FF" opacity={(1 - y / 380) * (0.3 + (i % 4) * 0.16)} />;
      })}

      {/* światło świtu nad horyzontem */}
      <Glow cx={230} cy={452} r={190} color="#F5C98A" opacity={0.34} />
      <Glow cx={110} cy={430} r={120} color="#8FD9E6" opacity={0.2} />

      {/* dalekie wyspy */}
      <path d="M0 424 q54 -34 120 -10 q64 24 120 -8 q56 -28 150 4 v30 H0 Z" fill="#22355C" opacity="0.75" />
      <path d="M0 444 q80 -22 156 4 q78 26 234 -10 v28 H0 Z" fill="#182741" opacity="0.85" />

      {/* woda */}
      <rect y="466" width="390" height="314" fill="url(#waterPrzystan)" />
      {/* odbicie słońca */}
      {Array.from({ length: 16 }).map((_, i) => (
        <ellipse key={`r${i}`} cx={230 + (i % 2 ? 8 : -8)} cy={476 + i * 18} rx={30 - i} ry={1.8} fill="#F7D8A6" opacity={0.42 - i * 0.022} />
      ))}
      {/* fale */}
      {Array.from({ length: 12 }).map((_, i) => (
        <ellipse key={`w${i}`} cx={30 + ((i * 97) % 330)} cy={492 + i * 24} rx={46 + (i % 3) * 30} ry={1.8} fill="#CFEAF2" opacity={0.06 + (i % 3) * 0.03} />
      ))}

      {/* pomost prowadzący w głąb kadru */}
      <g>
        <path d="M168 470 L222 470 L268 780 L122 780 Z" fill="url(#deckPrzystan)" />
        {Array.from({ length: 14 }).map((_, i) => {
          const t = i / 14;
          const y = 470 + t * 310;
          const halfTop = 27 + t * 46;
          return (
            <rect
              key={i}
              x={195 - halfTop}
              y={y}
              width={halfTop * 2}
              height={5 + t * 7}
              rx={3}
              fill="#7FA0B2"
              opacity={0.16 + t * 0.3}
            />
          );
        })}
        {/* pale wbite w wodę */}
        {[[150, 560], [242, 560], [128, 660], [266, 660]].map(([x, y], i) => (
          <rect key={i} x={x - 4} y={y} width="8" height="120" rx="4" fill="#1B2C3E" opacity="0.85" />
        ))}
      </g>

      {/* latarnie — dwie przy pomoście, jedna daleko */}
      {[
        { x: 143, y: 486, s: 0.75 },
        { x: 252, y: 508, s: 0.95 },
        { x: 96, y: 618, s: 1.25 },
      ].map((l, i) => {
        const on = i <= lit + 1;
        return (
          <g key={i} transform={`translate(${l.x} ${l.y}) scale(${l.s})`}>
            <rect x="-3" y="0" width="6" height="86" rx="3" fill="#1B2C3E" />
            <Glow cx={0} cy={-8} r={on ? 46 : 18} color={on ? "#FFD98A" : "#7FA6B8"} opacity={on ? 0.6 : 0.2} />
            <path d="M-13 -16 h26 l-5 -11 h-16 Z" fill="#2B4560" />
            <circle cx="0" cy="-6" r="10" fill={on ? "#FFEFC6" : "#4E6C80"} />
            {on ? <ellipse cx="0" cy="96" rx="16" ry="4" fill="#FFD98A" opacity="0.18" /> : null}
          </g>
        );
      })}

      {/* kamień z mapą — pierwszy plan */}
      <g transform="translate(286 690)">
        <ellipse cx="30" cy="52" rx="62" ry="20" fill="#0E2033" opacity="0.55" />
        <path d="M-4 40 q10 -30 36 -30 q30 0 34 32 q2 12 -12 14 H4 q-10 -4 -8 -16 Z" fill="#2A3D52" />
        <g transform="rotate(-8 30 18)">
          <path d="M2 6 h58 l4 30 H-2 Z" fill="#F2E4C2" opacity="0.95" />
          <path d="M10 16 q20 -10 40 4" stroke={accent} strokeWidth="2.2" fill="none" opacity="0.8" />
          <circle cx="46" cy="26" r="3.4" fill="#F5C45E" />
          <path d="M6 30 q16 6 30 -2" stroke="#B9A87E" strokeWidth="1.6" fill="none" opacity="0.7" />
        </g>
      </g>

      {/* iskry w powietrzu */}
      {Array.from({ length: 14 }).map((_, i) => (
        <circle
          key={i}
          className="adv-mote"
          style={{ animationDelay: `${(i % 6) * 0.9}s` }}
          cx={26 + ((i * 83) % 344)}
          cy={300 + ((i * 47) % 340)}
          r={1.5 + (i % 3) * 0.9}
          fill="#FFE6A8"
          opacity="0.7"
        />
      ))}
    </svg>
  );
}

/* ── Las Szeptów ───────────────────────────────────────────────────────── */

export function LasArt({ accent = "#7BD48F", lit = false }) {
  return (
    <svg viewBox={VB} preserveAspectRatio={SLICE} className="adv-art" aria-hidden="true">
      <Defs
        id="skyLas"
        stops={[
          [0, lit ? "#123B33" : "#0E2A2A"],
          [0.5, lit ? "#1D5A46" : "#163B36"],
          [1, lit ? "#2E7B54" : "#1C4A3E"],
        ]}
      />
      <rect width="390" height="780" fill="url(#skyLas)" />
      <Glow cx={210} cy={250} r={170} color={lit ? "#9BE3AC" : "#57806E"} opacity={lit ? 0.32 : 0.16} />

      {/* warstwy drzew */}
      {[
        { y: 300, o: 0.35, s: 1.15, c: "#123A31" },
        { y: 370, o: 0.55, s: 1.0, c: "#0F3129" },
        { y: 450, o: 0.85, s: 0.85, c: "#0B241F" },
      ].map((layer, li) => (
        <g key={li} opacity={layer.o}>
          {Array.from({ length: 7 }).map((_, i) => {
            const x = -20 + i * 66 + li * 18;
            return (
              <g key={i} transform={`translate(${x} ${layer.y}) scale(${layer.s})`}>
                <rect x="18" y="60" width="12" height="220" rx="6" fill={layer.c} />
                <ellipse cx="24" cy="52" rx="52" ry="44" fill={layer.c} />
                <ellipse cx="6" cy="82" rx="38" ry="30" fill={layer.c} />
                <ellipse cx="44" cy="86" rx="34" ry="28" fill={layer.c} />
              </g>
            );
          })}
        </g>
      ))}

      {/* ścieżka */}
      <path d="M110 780 q60 -160 90 -250 q26 -78 76 -140" stroke="#22503F" strokeWidth="46" fill="none" opacity="0.7" strokeLinecap="round" />
      <path d="M110 780 q60 -160 90 -250 q26 -78 76 -140" stroke="#2E6B52" strokeWidth="34" fill="none" opacity="0.8" strokeLinecap="round" />

      {/* małe ślady na ścieżce */}
      {Array.from({ length: 7 }).map((_, i) => (
        <ellipse key={i} cx={126 + i * 22} cy={720 - i * 62} rx="5" ry="3.4" fill={accent} opacity={lit ? 0.7 : 0.35} transform={`rotate(-18 ${126 + i * 22} ${720 - i * 62})`} />
      ))}

      {/* świecące liście */}
      {Array.from({ length: 22 }).map((_, i) => (
        <circle
          key={i}
          className="adv-mote"
          style={{ animationDelay: `${(i % 7) * 0.7}s` }}
          cx={16 + ((i * 91) % 360)}
          cy={140 + ((i * 61) % 520)}
          r={1.8 + (i % 3)}
          fill={lit ? "#CFFFDD" : accent}
          opacity={lit ? 0.85 : 0.5}
        />
      ))}
    </svg>
  );
}

/* ── Dolina Dźwięków ───────────────────────────────────────────────────── */

export function DolinaArt({ accent = "#F2B45C" }) {
  return (
    <svg viewBox={VB} preserveAspectRatio={SLICE} className="adv-art" aria-hidden="true">
      <Defs
        id="skyDolina"
        stops={[
          [0, "#2B2350"],
          [0.45, "#6B4A6E"],
          [1, "#D08C63"],
        ]}
      />
      <rect width="390" height="780" fill="url(#skyDolina)" />
      <Glow cx={130} cy={330} r={120} color="#FFD08A" opacity={0.4} />
      <circle cx={130} cy={330} r="34" fill="#FFE7BE" opacity="0.9" />

      {[
        { y: 430, c: "#7A5470", o: 0.7 },
        { y: 500, c: "#5E4162", o: 0.85 },
        { y: 580, c: "#40304C", o: 1 },
      ].map((h, i) => (
        <path key={i} d={`M0 ${h.y} q100 -70 195 -14 q95 56 195 -18 v${780 - h.y} H0 Z`} fill={h.c} opacity={h.o} />
      ))}

      {/* dzwonki wiatru */}
      {Array.from({ length: 5 }).map((_, i) => {
        const x = 50 + i * 74;
        const y = 470 + (i % 2) * 26;
        return (
          <g key={i} className="adv-sway" style={{ animationDelay: `${i * 0.5}s` }}>
            <line x1={x} y1={y} x2={x} y2={y + 34} stroke="#2E2340" strokeWidth="1.6" />
            <path d={`M${x - 7} ${y + 34} h14 l-3 16 h-8 Z`} fill={accent} opacity="0.9" />
            <Glow cx={x} cy={y + 44} r={16} color={accent} opacity={0.4} />
          </g>
        );
      })}

      {Array.from({ length: 14 }).map((_, i) => (
        <circle key={i} className="adv-mote" style={{ animationDelay: `${(i % 5) * 1.1}s` }} cx={20 + ((i * 79) % 350)} cy={300 + ((i * 67) % 400)} r={1.6 + (i % 2)} fill="#FFE2AE" opacity="0.7" />
      ))}
    </svg>
  );
}

/* ── Pracownia Gwiazd ──────────────────────────────────────────────────── */

export function PracowniaArt({ accent = "#B58CF0" }) {
  return (
    <svg viewBox={VB} preserveAspectRatio={SLICE} className="adv-art" aria-hidden="true">
      <Defs
        id="skyPracownia"
        stops={[
          [0, "#0B1030"],
          [0.55, "#221A4B"],
          [1, "#3A2A63"],
        ]}
      />
      <rect width="390" height="780" fill="url(#skyPracownia)" />
      {Array.from({ length: 60 }).map((_, i) => (
        <circle key={i} cx={(i * 113) % 390} cy={(i * 71) % 560} r={0.6 + (i % 4) * 0.4} fill="#EAE2FF" opacity={0.2 + (i % 5) * 0.14} />
      ))}
      <Glow cx={195} cy={520} r={160} color={accent} opacity={0.28} />
      {/* stół pracowni */}
      <path d="M40 600 h310 l24 180 H16 Z" fill="#2A2050" />
      <path d="M40 600 h310 l6 22 H34 Z" fill="#453576" />
      {/* narzędzia */}
      {[90, 160, 230, 300].map((x, i) => (
        <g key={i} className="adv-float" style={{ animationDelay: `${i * 0.8}s` }}>
          <Glow cx={x} cy={540} r={22} color={accent} opacity={0.45} />
          <circle cx={x} cy={540} r="7" fill="#F2E9FF" />
        </g>
      ))}
    </svg>
  );
}

export const SCENE_ART = {
  przystan: PrzystanArt,
  las: LasArt,
  dolina: DolinaArt,
  pracownia: PracowniaArt,
};

export function SceneArt({ art, ...rest }) {
  const Cmp = SCENE_ART[art] || PrzystanArt;
  return <Cmp {...rest} />;
}
