import React, { useState, useEffect, useCallback } from "react";
import NarratorVoice from "./NarratorVoice";
import { ttsPlayer } from "../services/ttsPlayer";

/* ════════════════════════════════════════════════════════════════════════
   LandTransition — Splash screen animowany przy wejściu do nowej krainy
   Styl: Claymorphism / Pixar — obłe kształty, żywe kolory, magia
   ════════════════════════════════════════════════════════════════════════ */

const LAND_CONFIG = {
  dolina_selfie: {
    icon: "",
    title: "Dolina Selfie",
    subtitle: "Poznaj siebie w magicznym zwierciadle",
    gradient: "url(/tlo3.png) center bottom/cover no-repeat",
    particles: ["✨", "🌸", "💜", "⭐"],
    bgEmoji: "🏔️",
    description: "Tutaj wszystko się zaczyna — odkryjesz kim naprawdę jesteś!",
  },
  las_decyzji: {
    icon: "🌲",
    title: "Las Decyzji",
    subtitle: "Każda ścieżka prowadzi gdzie indziej...",
    gradient: "url(/tlo4.png) center bottom/cover no-repeat",
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
  const [narratorDone, setNarratorDone] = useState(false);
  const config = LAND_CONFIG[land];

  // Rozpocznij zamykanie splasha
  const startExit = useCallback(() => {
    if (phase === "exit") return; // juz zamykamy
    setPhase("exit");
    setTimeout(() => { ttsPlayer.stop(); onComplete(); }, 600);
  }, [phase, onComplete]);

  // Gdy narrator skonczy mowic — czekaj na klikniecie uzytkownika
  // (nie zamykamy automatycznie)

  useEffect(() => {
    // Zatrzymaj poprzedni dzwiek zanim splash zacznie swoj
    ttsPlayer.stop();

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

    // Fallback — gdyby narrator nie odpowiedzial, zamknij po 15s
    const fallbackTimer = setTimeout(() => {
      setNarratorDone(true);
    }, 15000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(fallbackTimer);
    };
  }, [land]);

  return (
    <div
      onClick={() => { if (phase === "show") { ttsPlayer.stop(); startExit(); } }}
      style={{
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
        cursor: phase === "show" ? "pointer" : "default",
      }}
    >
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
      {config.icon && (
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
      )}

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


      {/* Głos narratora — czyta opis krainy, po zakończeniu zamyka splash */}
      {phase === "show" && (
        <NarratorVoice
          text={`${config.title}. ${config.description}`}
          land={land}
          compact={true}
          autoPlayDelay={800}
          onEnd={() => setNarratorDone(true)}
        />
      )}

      {/* Podpowiedź — dotknij aby kontynuować */}
      <div
        style={{
          position: "absolute",
          bottom: "40px",
          fontSize: "15px",
          fontWeight: "600",
          color: narratorDone ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.5)",
          opacity: phase === "show" ? 1 : 0,
          transition: "all 0.5s ease 2s",
          pointerEvents: "none",
          animation: narratorDone ? "pulseButton 1.5s ease-in-out infinite" : "none",
        }}
      >
        {narratorDone ? "▶ Dotknij aby kontynuować" : "Dotknij aby pominąć"}
      </div>
    </div>
  );
}
