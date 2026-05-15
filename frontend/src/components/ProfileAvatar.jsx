/**
 * ProfileAvatar — awatary dla 6 profili kompetencyjnych.
 * Korzysta z plikow SVG z /public (lis.svg, zolw.svg, sowa.svg, panda.svg, lew.svg, osmiornica.svg).
 * Pliki sa preloadowane w index.html (fetchpriority="high").
 *
 * Uzycie:
 *   <ProfileAvatar profile="DT" size={120} />
 *   <ProfileAvatar profile="EM" size={48} />  // dla TopBar / list items
 *
 * Profile codes:
 *   DT = Detektyw (lis)       LD = Lider (lew)
 *   EM = Empata (zolw)        MD = Mediator (osmiornica)
 *   ST = Strateg (sowa)
 *   KR = Kreator (panda)
 */
import React from "react";

export const PROFILE_INFO = {
  DT: { name: "Detektyw", emoji: "🔍", color: "#D85A30", glow: "rgba(216,90,48,.28)",  svg: "/lis.svg",        svgMini: "/avatary-10.svg", animal: "Lis" },
  EM: { name: "Empata",   emoji: "💚", color: "#E4779C", glow: "rgba(228,119,156,.28)", svg: "/zolw.svg",       svgMini: "/avatary-08.svg", animal: "Żółw" },
  ST: { name: "Strateg",  emoji: "🦉", color: "#378ADD", glow: "rgba(55,138,221,.28)",  svg: "/sowa.svg",       svgMini: "/avatary-09.svg", animal: "Sowa" },
  KR: { name: "Kreator",  emoji: "✨", color: "#EF9F27", glow: "rgba(239,159,39,.28)",  svg: "/panda.svg",      svgMini: "/avatary-07.svg", animal: "Panda" },
  LD: { name: "Lider",    emoji: "🦁", color: "#E89A3D", glow: "rgba(232,154,61,.28)",  svg: "/lew.svg",        svgMini: "/avatary-11.svg", animal: "Lew" },
  MD: { name: "Mediator", emoji: "🛡️", color: "#1D9E75", glow: "rgba(29,158,117,.28)",  svg: "/osmiornica.svg", svgMini: "/avatary-12.svg", animal: "Ośmiornica" },
};

export default function ProfileAvatar({ profile = "DT", size = 120, variant = "full" }) {
  const info = PROFILE_INFO[profile] || PROFILE_INFO.DT;
  // 'mini' = mała ikonka do top bara / list itemow (avatary-XX.svg, kwadratowy headshot)
  // 'full' = pelna postac (lis.svg itd) na ekrany glowne
  const src = variant === "mini" ? info.svgMini : info.svg;
  return (
    <img
      src={src}
      alt={`${info.animal} — ${info.name}`}
      width={size}
      height={size}
      loading="eager"
      style={{
        width: size,
        height: size,
        objectFit: "contain",
        display: "block",
        flexShrink: 0,
      }}
    />
  );
}
