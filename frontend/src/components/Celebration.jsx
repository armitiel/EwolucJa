/**
 * Celebration — efekt świętowania (Lottie) wyświetlany w tle,
 * fullscreen, nie blokuje kliknięć. Steruj przez prop `active`.
 */
import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const LOTTIE_SRC = "/Celebrations%20Begin.lottie";

export default function Celebration({ active }) {
  if (!active) return null;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <DotLottieReact
        src={LOTTIE_SRC}
        autoplay
        style={{ width: "100%", height: "100%", maxWidth: 720 }}
      />
    </div>
  );
}
