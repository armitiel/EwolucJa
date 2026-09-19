/*!
 * SPDX-FileCopyrightText: © 2026 Amitiel Angelisme <armitiel@gmail.com>
 * SPDX-License-Identifier: LicenseRef-EwolucJA-Proprietary
 *
 * EwolucJA — gra edukacyjna dla dzieci.
 * Produkt powstał w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”;
 * autorskie prawa majątkowe pozostają przy autorze. Licencja: LICENSE.
 */
/**
 * MentorBubble — wiadomość od Mentora z głową Wizkora obok.
 *
 * TEN SAM DYMEK, CO RESZTA GRY (od 19.09.2026). Wcześniej ten komponent
 * rysował własną bańkę: `div` z `borderRadius: 16`, obrys na `inset box-shadow`
 * i doklejony pod spodem `<span>` 14×14 obrócony o 45°, schowany na
 * `zIndex: -1`. Kolory szły z mapy dziesięciu hex-ów wpisanych tutaj i nigdzie
 * indziej w grze nieużywanych. Efekt: ta sama „wiadomość od postaci"
 * wyglądała inaczej niż wszystko obok, a poprawki kształtu dymków omijały ją
 * z definicji.
 *
 * Teraz kształt, lamówka, glina i cień idą z `hub/Dymek.jsx`, a `tone`
 * podmienia WYŁĄCZNIE tokeny barwy. To jest ta oś, na której dymki w tej grze
 * mają się różnić: jeden kształt, różne kolory i rozmiary.
 *
 * DZIÓBEK W BOK, nie w dół: głowa stoi OBOK bańki, nie pod nią. `Dymek`
 * rysuje ten wariant transpozycją osi — patrz `hub/ksztaltChmurki.js`.
 *
 * Props:
 *  - text (string)    — treść wiadomości (1–3 krótkie zdania)
 *  - title (string?)  — opcjonalny nagłówek wersalikami
 *  - tone (string)    — 'magic' (fiolet, domyślny) | 'amber' | 'leaf' | 'rose'
 *  - side (string)    — 'left' (głowa po lewej, domyślnie) | 'right'
 *  - size (string)    — 'sm' | 'md'
 *  - tail (boolean)   — czy bańka ma dzióbek wskazujący głowę (domyślnie tak)
 */
import React from "react";
import Dymek from "../hub/Dymek.jsx";

/* Barwy jako NADPISANIA TOKENÓW rodziny dymków, nie jako własny system.
   Dwa górne stopnie gliny to jaśniejszy koniec dawnego gradientu, trzy dolne —
   ciemniejszy; dzięki temu bańka ma to samo światło u góry i zejście w cień
   u dołu, co wszystkie pozostałe. */
const TONY = {
  magic: { rant: "#7A4DC2", gora: "#F4ECFF", dol: "#E6D6FA", tekst: "var(--p-magic-dk)" },
  amber: { rant: "#B47322", gora: "#FFF6DC", dol: "#FFE7B0", tekst: "#7A4D10" },
  leaf:  { rant: "#3B6D11", gora: "#E8F5E0", dol: "#DBF0CE", tekst: "#3B6D11" },
  rose:  { rant: "#A14040", gora: "#FFEAEA", dol: "#FFD7D7", tekst: "#7A2A2A" },
};

const ROZMIARY = {
  sm: { glowa: 36, oddech: "10px 12px", tekst: 12.5, tytul: 11, odstep: 8 },
  md: { glowa: 52, oddech: "12px 14px", tekst: 14, tytul: 12, odstep: 10 },
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
  const t = TONY[tone] || TONY.magic;
  const s = ROZMIARY[size] || ROZMIARY.md;
  const zLewej = side !== "right";

  return (
    <div
      className="pop-in"
      style={{
        display: "flex",
        flexDirection: zLewej ? "row" : "row-reverse",
        alignItems: "flex-end",
        gap: s.odstep,
        width: "100%",
        ...style,
      }}
    >
      {/* Głowa Wizkora — okrągły chip, ten sam wizerunek, co w „Poradzie dnia". */}
      <div
        aria-hidden="true"
        style={{
          width: s.glowa, height: s.glowa, flex: "none",
          borderRadius: "50%",
          background: "#fff",
          boxShadow: `0 0 0 2px ${t.rant}33, 0 4px 12px rgba(80,40,140,.22)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          overflow: "hidden",
          animation: "float-mid 3.4s ease-in-out infinite",
        }}
      >
        <img
          src="/wizhead.svg"
          alt=""
          style={{ width: s.glowa * 0.92, height: s.glowa * 0.92, objectFit: "contain" }}
        />
      </div>

      <Dymek
        ogon={tail ? "dziobek" : "brak"}
        /* Dzióbek celuje w GŁOWĘ, więc wychodzi tą stroną, po której ona stoi. */
        kierunek={zLewej ? "lewo" : "prawo"}
        style={{
          /* `flex: 1` wyznacza szerokość — `fit-content` z `.dymek` zostaje
             wtedy tylko podstawą rozciągania i nie ścina bańki do tekstu. */
          flex: 1,
          minWidth: 0,
          color: t.tekst,
          "--chmurka-akcent": t.rant,
          "--chmurka-tlo-0": t.gora,
          "--chmurka-tlo-1": t.gora,
          "--chmurka-tlo-2": t.dol,
          "--chmurka-tlo-3": t.dol,
          "--chmurka-tlo-4": t.dol,
          "--chmurka-lamowka": "2px",
          "--chmurka-cien-filtr": "drop-shadow(0 3px 8px rgba(43,42,74,.14))",
          "--dymek-oddech": s.oddech,
        }}
      >
        {title && (
          <div style={{
            fontSize: s.tytul, fontWeight: 900, letterSpacing: 1.1,
            textTransform: "uppercase",
            marginBottom: 4,
          }}>
            {title}
          </div>
        )}
        <div style={{ fontSize: s.tekst, lineHeight: 1.35, fontWeight: 600 }}>
          {text}
        </div>
      </Dymek>
    </div>
  );
}
