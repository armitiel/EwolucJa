/**
 * StarBurst — krotka eksplozja zlotych gwiazdek dla mikro-celebracji
 * (np. wybor poprawnej odpowiedzi). Renderuje 8-12 gwiazdek wokol pozycji
 * z roznymi katami, predkosciami i opoznieniami. Trwa ~900ms.
 *
 * Uzycie:
 *   {showBurst && <StarBurst onDone={() => setShowBurst(false)} />}
 *
 * Kontener musi miec position: relative (lub absolute), bo gwiazdki sa absolute.
 */
import React, { useEffect, useMemo } from "react";

export default function StarBurst({ count = 10, duration = 900, onDone, color = "#FFD269" }) {
  const stars = useMemo(() => Array.from({ length: count }).map((_, i) => {
    const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
    const dist = 40 + Math.random() * 50;
    return {
      id: i,
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist,
      delay: Math.random() * 120,
      size: 12 + Math.random() * 10,
      rotate: Math.random() * 360,
    };
  }), [count]);

  useEffect(() => {
    if (!onDone) return;
    const t = setTimeout(onDone, duration + 150);
    return () => clearTimeout(t);
  }, [duration, onDone]);

  return (
    <div aria-hidden="true" style={{
      position: "absolute", left: "50%", top: "50%",
      width: 0, height: 0, pointerEvents: "none", zIndex: 50,
    }}>
      {stars.map((s) => (
        <span
          key={s.id}
          style={{
            position: "absolute",
            left: 0, top: 0,
            transform: `translate(-50%, -50%) rotate(${s.rotate}deg)`,
            color,
            fontSize: s.size,
            animation: `star-pop ${duration}ms ease-out ${s.delay}ms forwards`,
            // Custom CSS variables - end position
            ["--burst-x"]: `${s.x}px`,
            ["--burst-y"]: `${s.y}px`,
            opacity: 0,
            filter: "drop-shadow(0 0 6px rgba(255,210,105,.8))",
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}
