import React, { useState, useEffect } from "react";
import NarratorVoice from "./NarratorVoice";

/* ════════════════════════════════════════════════════════════════════════
   LandTransition — Splash screen animowany przy wejściu do nowej krainy
   Styl: Claymorphism / Pixar — obłe kształty, żywe kolory, magia
   ════════════════════════════════════════════════════════════════════════ */

const LAND_CONFIG = {
  dolina_selfie: {
    icon: "🪞",
    title: "Dolina Selfie",
    subtitle: "Poznaj siebie w magicznym zwierciadle",
    gradient: "linear-gradient(135deg, #a855f7 0%, #e879f9 40%, #f0abfc 100%)",
    particles: ["✨", "🪞", "🌸", "💜"],
    bgEmoji: "🏔️",
    description: "Tutaj wszystko się zaczyna — odkryjesz kim naprawdę jesteś!",
  },
  las_decyzji: {
    icon: "🌲",
    title: "Las Decyzji",
    subtitle: "Każda ścieżka prowadzi gdzie indziej...",
    gradient: "linear-gradient(135deg, #16a34a 0%, #22c55e 40%, #86efac 100%)",
    particles: ["🍃", "🌿", "🦊", "🌲"],
    bgEmoji: "🌳",
    description: "Gęsty las pełen tajemnic. Twoje wybory kształtują przygodę!",
  },
  jaskinia_emocji: {
    icon: "🔮",
    title: "Jaskinia Emocji",
    subtitle: "Zanurz się w świecie uczuć",
    gradient: "linear-gradient(135deg, #2563eb 0%, #3b82f6 40%, #93c5fd 100%)",
    particles: ["💎", "🔮", "🦋", "💧"],
    bgEmoji: "⛰️",
    description: "Kryształy emocji świecą w ciemności. Czy potrafisz je rozpoznać?",
  },
  wyspa_talentow: {
    icon: "🏝️",
    title: "Wyspa Talentów",
    subtitle: "Odkryj swoje ukryte zdolności",
    gradient: "linear-gradient(135deg, #ea580c 0%, #f97316 40%, #fdba74 100%)",
    particles: ["🌺", "🎨", "⚡", "🌈"],
    bgEmoji: "🏝️",
    description: "Tropikalna wyspa, gdzie wyobraźnia nie zna granic!",
  },
  przystan_wspolpracy: {
    icon: "⚓",
    title: "Przystań Współpracy",
    subtitle: "Razem możemy więcej!",
    gradient: "linear-gradient(135deg, #0891b2 0%, #06b6d4 40%, #67e8f9 100%)",
    particles: ["🐚", "⚓", "🦀", "🌊"],
    bgEmoji: "🚢",
    description: "Port pełen stworzeń, które potrzebują Twojej pomocy!",
  },
  gora_podsumowania: {
    icon: "🏔️",
    title: "Góra Podsumowania",
    subtitle: "Dotarłeś na szczyt!",
    gradient: "linear-gradient(135deg, #ca8a04 0%, #eab308 40%, #fde047 100%)",
    particles: ["⭐", "🏆", "👑", "🎊"],
    bgEmoji: "🏔️",
    description: "Z tego szczytu widać całą Twoją przygodę!",
  },
};

export { LAND_CONFIG };

export default function LandTransition({ land, playerName, onComplete }) {
  const [phase, setPhase] = useState("enter"); // enter -> show -> exit
  const [particles, setParticles] = useState([]);
  const config = LAND_CONFIG[land];

  useEffect(() => {
    // Generuj losowe cząsteczki
    const pts = [];
    for (let i = 0; i < 20; i++) {
      pts.push({
        id: i,
        emoji: config.particles[i % config.particles.length],
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 16 + Math.random() * 24,
        delay: Math.random() * 1.5,
        duration: 2 + Math.random() * 2,
      });
    }
    setParticles(pts);

    // Animacja wejścia
    const showTimer = setTimeout(() => setPhase("show"), 100);
    // Po 3s automatycznie zamknij
    const exitTimer = setTimeout(() => setPhase("exit"), 3000);
    const doneTimer = setTimeout(() => onComplete(), 3600);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, [land]);

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 1000,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: config.gradient,
      opacity: phase === "enter" ? 0 : phase === "exit" ? 0 : 1,
      transform: phase === "enter" ? "scale(1.1)" : phase === "exit" ? "scale(0.95)" : "scale(1)",
      transition: "all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
      overflow: "hidden",
    }}>
      {/* Cząsteczki tła */}
      {particles.map((p) => (
        <div key={p.id} style={{
          position: "absolute",
          left: `${p.x}%`,
          top: `${p.y}%`,
          fontSize: `${p.size}px`,
          opacity: phase === "show" ? 0.6 : 0,
          transform: phase === "show"
            ? `translateY(0px) rotate(${p.delay * 60}deg)`
            : `translateY(30px) rotate(0deg)`,
          transition: `all ${p.duration}s ease ${p.delay}s`,
          pointerEvents: "none",
          filter: "blur(0.5px)",
        }}>
          {p.emoji}
        </div>
      ))}

      {/* Duża ikona krainy */}
      <div style={{
        fontSize: "96px",
        marginBottom: "16px",
        opacity: phase === "show" ? 1 : 0,
        transform: phase === "show" ? "translateY(0) scale(1)" : "translateY(40px) scale(0.5)",
        transition: "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s",
        filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.3))",
        textShadow: "0 4px 12px rgba(0,0,0,0.2)",
      }}>
        {config.icon}
      </div>

      {/* Tytuł krainy */}
      <div style={{
        fontSize: "36px",
        fontWeight: "800",
        color: "white",
        textShadow: "0 3px 12px rgba(0,0,0,0.3)",
        marginBottom: "8px",
        opacity: phase === "show" ? 1 : 0,
        transform: phase === "show" ? "translateY(0)" : "translateY(30px)",
        transition: "all 0.7s ease 0.3s",
        textAlign: "center",
        padding: "0 20px",
      }}>
        {config.title}
      </div>

      {/* Subtitle */}
      <div style={{
        fontSize: "18px",
        color: "rgba(255,255,255,0.9)",
        textShadow: "0 2px 8px rgba(0,0,0,0.2)",
        marginBottom: "24px",
        opacity: phase === "show" ? 1 : 0,
        transform: phase === "show" ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.7s ease 0.5s",
        textAlign: "center",
        fontStyle: "italic",
        padding: "0 20px",
      }}>
        {config.subtitle}
      </div>

      {/* Opis */}
      <div style={{
        maxWidth: "360px",
        padding: "16px 24px",
        background: "rgba(255,255,255,0.15)",
        borderRadius: "20px",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255,255,255,0.2)",
        textAlign: "center",
        fontSize: "15px",
        color: "rgba(255,255,255,0.95)",
        lineHeight: "1.5",
        opacity: phase === "show" ? 1 : 0,
        transform: phase === "show" ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.7s ease 0.7s",
      }}>
        {config.description}
      </div>

      {/* Imię gracza */}
      {playerName && (
        <div style={{
          marginTop: "20px",
          fontSize: "14px",
          color: "rgba(255,255,255,0.7)",
          opacity: phase === "show" ? 1 : 0,
          transition: "all 0.5s ease 0.9s",
        }}>
          {playerName}, wkraczasz do nowej krainy...
        </div>
      )}

      {/* Głos narratora — czyta opis krainy */}
      {phase === "show" && (
        <NarratorVoice
          text={`${config.title}. ${config.description}`}
          land={land}
          compact={true}
        />
      )}

      {/* Kliknij aby pominąć */}
      <button
        onClick={() => { setPhase("exit"); setTimeout(onComplete, 400); }}
        style={{
          position: "absolute",
          bottom: "40px",
          background: "rgba(255,255,255,0.15)",
          border: "1px solid rgba(255,255,255,0.3)",
          borderRadius: "30px",
          padding: "10px 24px",
          color: "rgba(255,255,255,0.8)",
          fontSize: "13px",
          cursor: "pointer",
          opacity: phase === "show" ? 1 : 0,
          transition: "all 0.5s ease 1s",
        }}
      >
        Dotknij, aby kontynuować
      </button>
    </div>
  );
}
