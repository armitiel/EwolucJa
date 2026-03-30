import React, { useEffect, useRef, useState } from "react";

/**
 * AvatarBoy — Wyświetla avatar_boy.svg z dynamicznie zmienianymi kolorami warstw.
 *
 * SVG ma warstwy (g id=):
 *   skin          — skóra (#FAC9A4)
 *   shadow        — cienie skóry (#F2A67E)
 *   outline       — obrys ciała (#6C4E3C, stroke)
 *   buty          — buty (#FEFEFE)
 *   spodenki      — spodenki (#FDF5E8)
 *   t_x5F_shirt   — koszulka (#FDF5E8)
 *   shadow_*      — cienie ubrań (#DED6CB)
 *   outline_x5F_ciuchy — obrys ubrań (#6C4E3C)
 *
 * Props:
 *  - config: { skinColor, shirtColor, shortsColor, shoesColor }
 *  - size: number (domyślnie 200)
 *  - style: dodatkowe style na wrapper
 */

// ── Palety kolorów ────────────────────────────────────────────────

export const SKIN_COLORS = [
  { id: "light",   hex: "#FAC9A4", shadow: "#F2A67E", name: "Jasna" },
  { id: "medium",  hex: "#E8B887", shadow: "#D4A070", name: "Średnia" },
  { id: "tan",     hex: "#C8956C", shadow: "#B07D55", name: "Opalona" },
  { id: "brown",   hex: "#A0724A", shadow: "#8A5E3A", name: "Brązowa" },
  { id: "dark",    hex: "#6B4226", shadow: "#553418", name: "Ciemna" },
];

export const SHIRT_COLORS = [
  { id: "white",   hex: "#FDF5E8", shadow: "#DED6CB", name: "Biała" },
  { id: "red",     hex: "#E94560", shadow: "#C4243F", name: "Czerwona" },
  { id: "blue",    hex: "#4A90D9", shadow: "#3570B0", name: "Niebieska" },
  { id: "green",   hex: "#34D399", shadow: "#22A87A", name: "Zielona" },
  { id: "yellow",  hex: "#FBBF24", shadow: "#D9A520", name: "Żółta" },
  { id: "purple",  hex: "#8B5CF6", shadow: "#6D3FD0", name: "Fioletowa" },
  { id: "orange",  hex: "#FB923C", shadow: "#D97420", name: "Pomarańczowa" },
  { id: "pink",    hex: "#F472B6", shadow: "#D05A98", name: "Różowa" },
];

export const SHORTS_COLORS = [
  { id: "white",   hex: "#FDF5E8", shadow: "#DED6CB", name: "Białe" },
  { id: "navy",    hex: "#1E3A5F", shadow: "#152D4A", name: "Granatowe" },
  { id: "black",   hex: "#2C2C2C", shadow: "#1A1A1A", name: "Czarne" },
  { id: "red",     hex: "#E94560", shadow: "#C4243F", name: "Czerwone" },
  { id: "green",   hex: "#22C55E", shadow: "#1A9E4A", name: "Zielone" },
  { id: "blue",    hex: "#3B82F6", shadow: "#2563EB", name: "Niebieskie" },
  { id: "brown",   hex: "#92400E", shadow: "#723208", name: "Brązowe" },
];

export const SHOES_COLORS = [
  { id: "white",   hex: "#FEFEFE", name: "Białe" },
  { id: "black",   hex: "#2C2C2C", name: "Czarne" },
  { id: "red",     hex: "#DC2626", name: "Czerwone" },
  { id: "blue",    hex: "#2563EB", name: "Niebieskie" },
  { id: "green",   hex: "#16A34A", name: "Zielone" },
  { id: "yellow",  hex: "#EAB308", name: "Żółte" },
  { id: "pink",    hex: "#EC4899", name: "Różowe" },
];

// Domyślna konfiguracja
export const DEFAULT_AVATAR_CONFIG = {
  skinColor: "light",
  shirtColor: "white",
  shortsColor: "white",
  shoesColor: "white",
};

// Helper: znajdź hex i shadow po id
function findColor(palette, id) {
  return palette.find((c) => c.id === id) || palette[0];
}

// Darken kolor o zadany procent (do generowania cieni)
function darkenHex(hex, amount = 0.2) {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, Math.floor(((num >> 16) & 0xff) * (1 - amount)));
  const g = Math.max(0, Math.floor(((num >> 8) & 0xff) * (1 - amount)));
  const b = Math.max(0, Math.floor((num & 0xff) * (1 - amount)));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

let _svgCache = null;

export default function AvatarBoy({ config = DEFAULT_AVATAR_CONFIG, size = 200, style = {} }) {
  const containerRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  // Załaduj SVG raz i cache'uj
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!_svgCache) {
        try {
          const res = await fetch("/avatar_boy.svg");
          _svgCache = await res.text();
        } catch (e) {
          console.warn("[AvatarBoy] Failed to load SVG:", e);
          return;
        }
      }
      if (!cancelled && containerRef.current) {
        containerRef.current.innerHTML = _svgCache;
        const svg = containerRef.current.querySelector("svg");
        if (svg) {
          svg.setAttribute("width", "100%");
          svg.setAttribute("height", "100%");
          svg.style.display = "block";
        }
        setLoaded(true);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Aplikuj kolory na warstwy gdy config się zmieni
  useEffect(() => {
    if (!loaded || !containerRef.current) return;
    const root = containerRef.current;

    const skin = findColor(SKIN_COLORS, config.skinColor);
    const shirt = findColor(SHIRT_COLORS, config.shirtColor);
    const shorts = findColor(SHORTS_COLORS, config.shortsColor);
    const shoes = findColor(SHOES_COLORS, config.shoesColor);

    // Skóra
    const skinGroup = root.querySelector("#skin");
    if (skinGroup) {
      skinGroup.querySelectorAll("path").forEach((p) => {
        p.setAttribute("fill", skin.hex);
      });
    }

    // Cienie skóry
    const shadowGroup = root.querySelector("#shadow");
    if (shadowGroup) {
      shadowGroup.querySelectorAll("path").forEach((p) => {
        p.setAttribute("fill", skin.shadow);
      });
    }

    // Koszulka
    const shirtGroup = root.querySelector('[id="t_x5F_shirt"]');
    if (shirtGroup) {
      shirtGroup.querySelectorAll("path").forEach((p) => {
        p.setAttribute("fill", shirt.hex);
      });
    }

    // Spodenki
    const shortsGroup = root.querySelector("#spodenki");
    if (shortsGroup) {
      shortsGroup.querySelectorAll("path").forEach((p) => {
        p.setAttribute("fill", shorts.hex);
      });
    }

    // Buty
    const butyGroup = root.querySelector("#buty");
    if (butyGroup) {
      butyGroup.querySelectorAll("path").forEach((p) => {
        p.setAttribute("fill", shoes.hex);
      });
    }

    // Cienie ubrań — mix cieni koszulki i spodenek
    const clothShadowGroup = root.querySelector('[id^="shadow_0000"]');
    if (clothShadowGroup) {
      clothShadowGroup.querySelectorAll("path").forEach((p) => {
        p.setAttribute("fill", shirt.shadow || darkenHex(shirt.hex));
      });
    }

  }, [loaded, config]);

  return (
    <div
      ref={containerRef}
      style={{
        width: size,
        height: size,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
    />
  );
}
