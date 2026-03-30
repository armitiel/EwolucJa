import React, { useState, useEffect, useRef } from "react";
import agentAPI from "../services/agentAPI";

/**
 * AvatarAI — Komponent wyświetlający awatar wygenerowany przez fal.ai
 *
 * Wzorzec Progressive Enhancement:
 * 1. Natychmiast: SVG awatar (AvatarDisplay)
 * 2. W tle: fal.ai generuje AI obraz
 * 3. Gotowe: płynna animacja zamiany SVG → AI
 *
 * Props:
 * - playerName: string
 * - avatarConfig: object (konfiguracja SVG)
 * - hybridTitle: string (opcjonalnie, dla karty bohatera)
 * - equipment: string[] (opcjonalnie)
 * - mode: "avatar" | "hero-card" | "land" (typ generowania)
 * - landName: string (dla mode="land")
 * - onImageReady: (url) => void (callback po wygenerowaniu)
 * - fallback: React.ReactNode (komponent SVG do wyświetlenia podczas ładowania)
 * - compact: bool
 */

export default function AvatarAI({
  playerName,
  avatarConfig,
  hybridTitle,
  equipment = [],
  mode = "avatar",
  landName,
  onImageReady,
  fallback,
  compact = false,
}) {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fadeIn, setFadeIn] = useState(false);
  const requestedRef = useRef(false);

  useEffect(() => {
    if (requestedRef.current) return;
    requestedRef.current = true;

    async function generate() {
      setLoading(true);
      setError(null);

      try {
        let result = null;

        if (mode === "avatar") {
          result = await agentAPI.generateAvatar(playerName, avatarConfig);
        } else if (mode === "hero-card") {
          result = await agentAPI.generateHeroCard(playerName, hybridTitle, equipment);
        } else if (mode === "land") {
          result = await agentAPI.generateLandBackground(landName);
        }

        if (result?.url) {
          setImageUrl(result.url);
          // Płynne fade-in po załadowaniu obrazu
          setTimeout(() => setFadeIn(true), 100);
          onImageReady?.(result.url);
        } else {
          setError("Nie udalo sie wygenerowac obrazu");
        }
      } catch (err) {
        console.warn("[AvatarAI] Error:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    generate();
  }, [playerName, mode, landName]);

  const size = compact ? 120 : 280;

  return (
    <div style={{
      position: "relative",
      width: size,
      height: size,
      margin: "0 auto",
      borderRadius: compact ? "16px" : "24px",
      overflow: "hidden",
    }}>
      {/* Warstwa 1: SVG fallback (zawsze widoczny do zamiany) */}
      {fallback && (
        <div style={{
          position: "absolute",
          inset: 0,
          opacity: imageUrl && fadeIn ? 0 : 1,
          transition: "opacity 0.8s ease",
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          {fallback}
        </div>
      )}

      {/* Warstwa 2: AI obraz (fade-in po wygenerowaniu) */}
      {imageUrl && (
        <img
          src={imageUrl}
          alt={`AI avatar: ${playerName}`}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: compact ? "16px" : "24px",
            opacity: fadeIn ? 1 : 0,
            transform: fadeIn ? "scale(1)" : "scale(1.05)",
            transition: "opacity 0.8s ease, transform 0.8s ease",
            zIndex: 2,
          }}
        />
      )}

      {/* Warstwa 3: Loading indicator */}
      {loading && !imageUrl && (
        <div style={{
          position: "absolute",
          bottom: 8,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 3,
          background: "rgba(0,0,0,0.6)",
          borderRadius: "20px",
          padding: "4px 12px",
          fontSize: "11px",
          color: "rgba(255,255,255,0.8)",
          whiteSpace: "nowrap",
          backdropFilter: "blur(4px)",
        }}>
          <span style={{
            display: "inline-block",
            animation: "pulse 1.5s ease infinite",
          }}>
            Tworzenie portretu AI...
          </span>
        </div>
      )}

      {/* Warstwa 4: Sparkle po wygenerowaniu */}
      {imageUrl && fadeIn && (
        <div style={{
          position: "absolute",
          inset: 0,
          zIndex: 3,
          pointerEvents: "none",
          background: "radial-gradient(circle at 30% 20%, rgba(255,215,0,0.3) 0%, transparent 50%)",
          opacity: fadeIn ? 0 : 1,
          transition: "opacity 2s ease 0.5s",
        }} />
      )}

      {/* Inline keyframes for pulse */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
