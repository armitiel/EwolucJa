/**
 * MentorBubble — chmurka z wiadomoscia od Mentora z ikona glowy maga.
 *
 * Reuzywalny komponent: wszedzie gdzie chcemy pokazac aktywnosc/wiadomosc od mentora
 * w spojnym formacie (z odznaka glowy maga + bablem dymku w stylu komiksowym).
 *
 * Props:
 *  - text (string)         — tresc wiadomosci (1-3 zdania, krotka)
 *  - title (string?)       — opcjonalny tytul wyrozniajacy w naglowku bubbla
 *  - tone (string)         — kolorystyka: 'magic' (fiolet, default) | 'amber' | 'leaf' | 'rose'
 *  - side (string)         — orientacja: 'left' (glowa po lewej, default) | 'right'
 *  - size (string)         — 'sm' | 'md' (default) — wielkosc glowy + paddingu
 *  - tail (boolean)        — dymek ma "ogonek" wskazujacy na glowe (default true)
 *
 * Uzycie:
 *  <MentorBubble text="Twoja odpowiedz jest sprawdzana przez Mentora" />
 *  <MentorBubble text="Spojrz na to co znalazl Tworz pierwszy zwoj!" title="Mentor mowi" tone="amber" />
 */
import React from "react";

const TONES = {
  magic: { bg: "linear-gradient(180deg,#F4ECFF,#E6D6FA)", ring: "#7A4DC2", ink: "var(--p-magic-dk)", titleInk: "var(--p-magic-dk)" },
  amber: { bg: "linear-gradient(180deg,#FFF6DC,#FFE7B0)", ring: "#B47322", ink: "#7A4D10",           titleInk: "#7A4D10" },
  leaf:  { bg: "linear-gradient(180deg,#E8F5E0,#DBF0CE)", ring: "#3B6D11", ink: "#3B6D11",           titleInk: "#3B6D11" },
  rose:  { bg: "linear-gradient(180deg,#FFEAEA,#FFD7D7)", ring: "#A14040", ink: "#7A2A2A",           titleInk: "#7A2A2A" },
};

const SIZES = {
  sm: { head: 36, padding: "10px 12px", fontSize: 12.5, titleSize: 11, gap: 8 },
  md: { head: 52, padding: "12px 14px", fontSize: 14,   titleSize: 12, gap: 10 },
};

export default function MentorBubble({
  text,
  title = null,
  tone = "magic",
  side = "left",
  size = "md",
  tail = true,
  style = {},
}) {
  const t = TONES[tone] || TONES.magic;
  const s = SIZES[size] || SIZES.md;
  const isLeft = side !== "right";

  return (
    <div
      className="pop-in"
      style={{
        display: "flex",
        flexDirection: isLeft ? "row" : "row-reverse",
        alignItems: "flex-end",
        gap: s.gap,
        width: "100%",
        ...style,
      }}
    >
      {/* Glowa maga - okragly chip z drop-shadow */}
      <div
        aria-hidden="true"
        style={{
          width: s.head, height: s.head, flex: "none",
          borderRadius: "50%",
          background: "#fff",
          boxShadow: `0 0 0 2px ${t.ring}33, 0 4px 12px rgba(80,40,140,.22)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          overflow: "hidden",
          animation: "float-mid 3.4s ease-in-out infinite",
        }}
      >
        <img
          src="/wizhead.svg"
          alt=""
          style={{ width: s.head * 0.92, height: s.head * 0.92, objectFit: "contain" }}
        />
      </div>

      {/* Dymek z tresci - z ogonkiem wskazujacym na glowe */}
      <div
        style={{
          position: "relative",
          flex: 1,
          minWidth: 0,
          background: t.bg,
          color: t.ink,
          padding: s.padding,
          borderRadius: 16,
          boxShadow: `inset 0 0 0 1.5px ${t.ring}33, 0 3px 12px rgba(43,42,74,.10)`,
        }}
      >
        {/* Ogonek dymku */}
        {tail && (
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              bottom: 10,
              [isLeft ? "left" : "right"]: -7,
              width: 14, height: 14,
              background: t.bg,
              boxShadow: `inset 0 0 0 1.5px ${t.ring}33`,
              transform: "rotate(45deg)",
              borderRadius: 3,
              zIndex: -1,
            }}
          />
        )}

        {title && (
          <div style={{
            fontSize: s.titleSize, fontWeight: 900, letterSpacing: 1.1,
            color: t.titleInk, textTransform: "uppercase",
            marginBottom: 4,
          }}>
            {title}
          </div>
        )}
        <div style={{ fontSize: s.fontSize, lineHeight: 1.35, fontWeight: 600 }}>
          {text}
        </div>
      </div>
    </div>
  );
}
