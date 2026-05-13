/**
 * Loading — wskaźnik ładowania na pełnym ekranie z animacją Lottie.
 * Wycentrowany pionowo i poziomo w PageShell.
 */
import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import PageShell from "./PageShell.jsx";

const LOTTIE_SRC = "/Loading%20animation%20blue.lottie";

export default function Loading({ text = "Ładowanie…", dark = false }) {
  const textColor = dark ? "#FBF1D6" : "#2B2A4A";

  return (
    <PageShell dark={dark}>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 40,
          paddingBottom: "25vh",
          gap: 0,
          minHeight: "70vh",
        }}
      >
        <DotLottieReact
          src={LOTTIE_SRC}
          loop
          autoplay
          style={{ width: 330, height: 330 }}
        />
        <p
          style={{
            margin: 0,
            marginTop: -64,
            color: textColor,
            fontFamily: "var(--font-display, 'Fredoka'), sans-serif",
            fontWeight: 500,
            fontSize: 21,
            letterSpacing: 0.2,
            opacity: 0.85,
          }}
        >
          {text}
        </p>
      </div>
    </PageShell>
  );
}
