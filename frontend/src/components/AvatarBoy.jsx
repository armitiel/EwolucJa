import React, { useEffect, useRef, useState } from "react";

/**
 * AvatarBoy — Wyświetla avatar_boy.svg z dynamicznie zmienianymi kolorami warstw.
 *
 * NOWA STRUKTURA SVG (po aktualizacji):
 *
 *   skin
 *     kolor, kolor1-5  — skóra (st1 = #FAC9A4)
 *     shadow           — cienie skóry (st21 = #F2A67E)
 *     outline          — obrys (st16 = #6C4E3C)
 *
 *   buty               — buty (kolor6 st42, outline1 st16)
 *   spodenki           — spodenki (st17 kolor, st41 cień, outline2 st16)
 *   t_x5F_shirt        — koszulka (st17 kolor, st41 cień, st31 obrys)
 *
 *   Oczy
 *     kolor11, kolor12 — tęczówki (st39 = #2D78BD)
 *
 *   Usta               — warianty ust, ukryte st34 = display:none
 *     _x31_2           — domyślnie widoczny
 *     _x31_1, _x39_, _x38_, _x36_, _x35_, _x34_, _x32_, _x31_ — ukryte
 *
 *   Włosy
 *     girl_x5F_2       — widoczna domyślnie (kolor13 st44, shadow st37, outline4 st7)
 *     girl_x5F_1       — ukryta st34 (kolor14 st23, shadow st9, outline5 group)
 *     boy_x5F_1        — ukryta st34 (kolor15 st44, shadow st37, outline9 st5)
 *
 * Klasa ukrywania: st34 = display:none
 * Kolorowanie: zawsze style.fill (nadpisuje CSS klasy)
 * Włosy: kolor + shadow (ciemniejszy o 40%)
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

export const EYE_COLORS = [
  { id: "blue",    hex: "#2D78BD", name: "Niebieskie" },
  { id: "green",   hex: "#2E8B57", name: "Zielone" },
  { id: "brown",   hex: "#8B4513", name: "Brązowe" },
  { id: "hazel",   hex: "#B8860B", name: "Piwne" },
  { id: "gray",    hex: "#708090", name: "Szare" },
  { id: "amber",   hex: "#CF6F20", name: "Bursztynowe" },
  { id: "dark",    hex: "#3B2F2F", name: "Ciemne" },
];

// ── Włosy ────────────────────────────────────────────────────────────

export const HAIR_COLORS = [
  { id: "black",    hex: "#2C1810", name: "Czarne" },
  { id: "brown",    hex: "#6B3A2A", name: "Brązowe" },
  { id: "blonde",   hex: "#D4A843", name: "Blond" },
  { id: "red",      hex: "#B84430", name: "Rude" },
  { id: "ginger",   hex: "#E87040", name: "Rude jasne" },
  { id: "platinum", hex: "#E8DCC8", name: "Platynowe" },
  { id: "blue",     hex: "#4A90D9", name: "Niebieskie" },
  { id: "purple",   hex: "#8B5CF6", name: "Fioletowe" },
  { id: "green",    hex: "#34D399", name: "Zielone" },
  { id: "pink",     hex: "#F472B6", name: "Różowe" },
];

// Fryzury — ID warstw w SVG
// Wszystkie fryzury dostępne dla każdej płci
export const HAIR_STYLES_BOY = [
  { id: "boy_x5F_1",  svgId: "boy_x5F_1",  name: "Fryzura 1" },
  { id: "girl_x5F_1", svgId: "girl_x5F_1", name: "Fryzura 2" },
  { id: "girl_x5F_2", svgId: "girl_x5F_2", name: "Fryzura 3" },
];

export const HAIR_STYLES_GIRL = [
  { id: "girl_x5F_1", svgId: "girl_x5F_1", name: "Fryzura 1" },
  { id: "girl_x5F_2", svgId: "girl_x5F_2", name: "Fryzura 2" },
  { id: "boy_x5F_1",  svgId: "boy_x5F_1",  name: "Fryzura 3" },
];

// Wszystkie fryzury (do przełączania widoczności — unikalne ID)
export const ALL_HAIR_STYLES = [
  { id: "boy_x5F_1",  svgId: "boy_x5F_1",  name: "Fryzura 1" },
  { id: "girl_x5F_1", svgId: "girl_x5F_1", name: "Fryzura 2" },
  { id: "girl_x5F_2", svgId: "girl_x5F_2", name: "Fryzura 3" },
];

// Warianty ust — dostępne w nowym SVG.
// st34 = display:none. Wariant 12 domyślnie widoczny.
// Usunięte: 3 (_x33_), 7 (_x37_), 10 (_x31_0) — brak w SVG.
export const MOUTH_VARIANTS = [
  { id: 1,  svgId: "_x31_",  name: "Usta 1" },
  { id: 2,  svgId: "_x32_",  name: "Usta 2" },
  { id: 4,  svgId: "_x34_",  name: "Usta 4" },
  { id: 5,  svgId: "_x35_",  name: "Usta 5" },
  { id: 6,  svgId: "_x36_",  name: "Usta 6" },
  { id: 8,  svgId: "_x38_",  name: "Usta 8" },
  { id: 9,  svgId: "_x39_",  name: "Usta 9" },
  { id: 11, svgId: "_x31_1", name: "Usta 11" },
  { id: 12, svgId: "_x31_2", name: "Usta 12" },
];

// Domyślna konfiguracja
export const DEFAULT_AVATAR_CONFIG = {
  skinColor: "light",
  hairColor: "brown",
  hairStyle: "boy_x5F_1",
  shirtColor: "white",
  shortsColor: "white",
  shoesColor: "white",
  eyeColor: "blue",
  mouthVariant: 12,
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

const _svgCache = {};

// ── Mapowanie klas CSS do ról w SVG ──────────────────────────────────
// Włosy: elementy z id zawierającym "kolor" = kolor główny, "shadow" = cień
// Outline (id zawierający "outline") nie jest kolorowany — zostaje oryginalny
// Inne klasy wg kontekstu:
//   Włosy shadow: st37, st9 (ciemniejsze warianty)
//   Włosy kolor:  st44, st23, st35 (jasne warianty)

export default function AvatarBoy({ config = DEFAULT_AVATAR_CONFIG, size = 200, style = {}, gender = "boy" }) {
  const svgFile = "/avatar_boy.svg";
  const containerRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  // Załaduj SVG raz i cache'uj
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const cacheKey = "shared";
      if (!_svgCache[cacheKey]) {
        try {
          const res = await fetch(svgFile);
          if (!res.ok) {
            console.warn("[AvatarBoy] Failed to load SVG:", res.status);
            return;
          }
          _svgCache[cacheKey] = await res.text();
        } catch (e) {
          console.warn("[AvatarBoy] Failed to load SVG:", e);
          return;
        }
      }
      if (!cancelled && containerRef.current) {
        let clean = _svgCache[cacheKey];
        const svgStart = clean.indexOf("<svg");
        if (svgStart > 0) clean = clean.slice(svgStart);
        containerRef.current.innerHTML = clean;
        const svg = containerRef.current.querySelector("svg");
        if (svg) {
          svg.setAttribute("width", "100%");
          svg.setAttribute("height", "100%");
          svg.style.display = "block";

          // Ukryj/pokaż fryzury — st34 = display:none w CSS
          ALL_HAIR_STYLES.forEach(hs => {
            const hairEl = svg.querySelector(`#${CSS.escape(hs.svgId)}`);
            if (hairEl) {
              hairEl.style.display = hs.svgId === (config.hairStyle || "boy_x5F_1") ? "inline" : "none";
            }
          });

          // Pokaż domyślne usta — st34 = display:none w CSS
          const defaultMouthId = config.mouthVariant || 12;
          MOUTH_VARIANTS.forEach(mv => {
            const mouthEl = svg.querySelector(`#${CSS.escape(mv.svgId)}`);
            if (mouthEl) {
              mouthEl.style.display = mv.id === defaultMouthId ? "inline" : "none";
            }
          });
        }
        setLoaded(true);
      }
    })();
    return () => { cancelled = true; };
  }, [svgFile]);

  // Aplikuj kolory na warstwy gdy config się zmieni
  useEffect(() => {
    if (!loaded || !containerRef.current) return;
    const root = containerRef.current;

    const skin = findColor(SKIN_COLORS, config.skinColor);
    const shirt = findColor(SHIRT_COLORS, config.shirtColor);
    const shorts = findColor(SHORTS_COLORS, config.shortsColor);
    const shoes = findColor(SHOES_COLORS, config.shoesColor);

    // Helper: ustaw fill na elemencie (style.fill nadpisuje CSS klasy)
    const setFill = (el, color) => { el.style.fill = color; };
    const setFillAll = (group, selector, color) => {
      if (!group) return;
      group.querySelectorAll(selector).forEach(el => setFill(el, color));
    };

    // Helper: ustaw stroke na elemencie
    const setStroke = (el, color) => { el.style.stroke = color; };

    // ── Skóra ────────────────────────────────────────────────────────
    const skinOutline = darkenHex(skin.hex, 0.5);
    const skinGroup = root.querySelector("#skin");
    if (skinGroup) {
      // Koloruj grupy kolor, kolor1-5
      skinGroup.querySelectorAll('[id^="kolor"]').forEach(g => {
        setFillAll(g, "path, circle, ellipse", skin.hex);
      });
      // Cienie skóry
      const shadowGroup = skinGroup.querySelector("#shadow");
      if (shadowGroup) {
        setFillAll(shadowGroup, "path, circle, ellipse", skin.shadow);
      }
      // Outline skóry — ciemniejsza tonacja skóry
      const outlineGroup = skinGroup.querySelector("#outline");
      if (outlineGroup) {
        outlineGroup.querySelectorAll("path, circle, ellipse, line").forEach(el => {
          setFill(el, skinOutline);
          setStroke(el, skinOutline);
        });
      }
    }

    // ── Koszulka ─────────────────────────────────────────────────────
    const shirtOutline = darkenHex(shirt.hex, 0.5);
    const shirtGroup = root.querySelector('[id="t_x5F_shirt"]');
    if (shirtGroup) {
      shirtGroup.querySelectorAll("path, circle, ellipse").forEach(el => {
        const cls = el.getAttribute("class") || "";
        const eid = (el.getAttribute("id") || "").toLowerCase();
        const pid = (el.parentElement?.getAttribute("id") || "").toLowerCase();
        if (cls.includes("st41")) {
          setFill(el, shirt.shadow || darkenHex(shirt.hex));
        } else if (cls.includes("st31") || cls.includes("st16") || eid.includes("outline") || pid.includes("outline")) {
          setFill(el, shirtOutline);
          setStroke(el, shirtOutline);
        } else {
          setFill(el, shirt.hex);
        }
      });
    }

    // ── Spodenki ─────────────────────────────────────────────────────
    const shortsOutline = darkenHex(shorts.hex, 0.5);
    const shortsGroup = root.querySelector("#spodenki");
    if (shortsGroup) {
      shortsGroup.querySelectorAll("path, circle, ellipse").forEach(el => {
        const cls = el.getAttribute("class") || "";
        const eid = (el.getAttribute("id") || "").toLowerCase();
        const pid = (el.parentElement?.getAttribute("id") || "").toLowerCase();
        if (cls.includes("st41")) {
          setFill(el, shorts.shadow || darkenHex(shorts.hex));
        } else if (cls.includes("st16") || eid.includes("outline") || pid.includes("outline")) {
          setFill(el, shortsOutline);
          setStroke(el, shortsOutline);
        } else {
          setFill(el, shorts.hex);
        }
      });
    }

    // ── Buty ─────────────────────────────────────────────────────────
    const shoesOutline = darkenHex(shoes.hex, 0.5);
    const shoesGroup = root.querySelector("#buty");
    if (shoesGroup) {
      shoesGroup.querySelectorAll("path, circle, ellipse").forEach(el => {
        const cls = el.getAttribute("class") || "";
        const eid = (el.getAttribute("id") || "").toLowerCase();
        const pid = (el.parentElement?.getAttribute("id") || "").toLowerCase();
        if (cls.includes("st16") || eid.includes("outline") || pid.includes("outline")) {
          setFill(el, shoesOutline);
          setStroke(el, shoesOutline);
        } else {
          setFill(el, shoes.hex);
        }
      });
    }

    // ── Włosy — przełączanie fryzur ─────────────────────────────────
    const selectedStyle = config.hairStyle || "boy_x5F_1";
    ALL_HAIR_STYLES.forEach(hs => {
      const el = root.querySelector(`#${CSS.escape(hs.svgId)}`);
      if (el) {
        el.style.display = hs.svgId === selectedStyle ? "inline" : "none";
      }
    });

    // ── Włosy — kolor ────────────────────────────────────────────────
    // Każda fryzura ma warstwy: kolor (id z "kolor"), shadow (id z "shadow"), outline
    // Koloruj kolor = wybrany kolor, shadow = ciemniejszy o 40%, outline = nie ruszaj
    const hairColor = findColor(HAIR_COLORS, config.hairColor);
    const hairShadow = darkenHex(hairColor.hex, 0.2);   // lekko ciemniejszy od bazowego
    const hairOutline = darkenHex(hairColor.hex, 0.55);  // wyraźnie ciemniejszy
    const selectedHairEl = root.querySelector(`#${CSS.escape(selectedStyle)}`);
    if (selectedHairEl) {
      // Helper: sprawdź czy element ma dokładnie daną klasę CSS
      const hasClass = (cls, name) => cls.split(/\s+/).includes(name);

      selectedHairEl.querySelectorAll("path, circle, ellipse, line").forEach(p => {
        const pid = (p.getAttribute("id") || "").toLowerCase();
        const parentId = (p.parentElement?.getAttribute("id") || "").toLowerCase();
        const cls = p.getAttribute("class") || "";

        // Outline — ciemniejszy kolor włosów (id "outline" lub stroke classes)
        if (pid.includes("outline") || parentId.includes("outline") ||
            hasClass(cls, "st3") || hasClass(cls, "st5") || hasClass(cls, "st6") ||
            hasClass(cls, "st7") || hasClass(cls, "st8")) {
          setFill(p, hairOutline);
          setStroke(p, hairOutline);
          return;
        }

        // Shadow — id zawiera "shadow", lub klasy cieni (st9, st37)
        if (pid.includes("shadow") || parentId.includes("shadow") ||
            hasClass(cls, "st9") || hasClass(cls, "st37")) {
          setFill(p, hairShadow);
        } else {
          // Kolor główny
          setFill(p, hairColor.hex);
        }
      });
    }

    // ── Kolor oczu ───────────────────────────────────────────────────
    // Nowa struktura: Oczy > kolor11, kolor12 — tęczówki
    // Wewnątrz: circle.st39 = kolor tęczówki
    const eye = findColor(EYE_COLORS, config.eyeColor);
    ["#kolor11", "#kolor12"].forEach(sel => {
      const group = root.querySelector(sel);
      if (group) {
        group.querySelectorAll("circle").forEach(c => {
          const cls = c.getAttribute("class") || "";
          // st39 = kolor tęczówki (niebieski domyślnie)
          if (cls.includes("st39")) {
            setFill(c, eye.hex);
          }
        });
      }
    });

    // ── Usta — przełączanie wariantów ────────────────────────────────
    const mouthId = config.mouthVariant || 12;
    MOUTH_VARIANTS.forEach(mv => {
      const el = root.querySelector(`#${CSS.escape(mv.svgId)}`);
      if (el) {
        el.style.display = mv.id === mouthId ? "inline" : "none";
      }
    });

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
