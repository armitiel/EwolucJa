import React, { useState, useEffect, useRef } from "react";
import { ttsPlayer } from "../services/ttsPlayer";
import AvatarBoy, {
  SKIN_COLORS,
  SHIRT_COLORS,
  SHORTS_COLORS,
  SHOES_COLORS,
  DEFAULT_AVATAR_CONFIG,
} from "./AvatarBoy";


/**
 * AvatarBuilder — Kreator awatara w Dolinie Selfie.
 *
 * Gracz wybiera: karnację, kolor koszulki, spodenek i butów.
 * Po zatwierdzeniu, config trafia do stanu gry.
 *
 * Props:
 *  - onComplete(avatarConfig): callback po zatwierdzeniu
 *  - playerName: string
 */

const builderStyles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
  },
  previewBox: {
    background: "rgba(255,255,255,0.06)",
    borderRadius: "24px",
    padding: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "visible",
  },
  section: {
    width: "100%",
  },
  sectionTitle: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#A0B0C0",
    marginBottom: "8px",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  optionsRow: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  colorSwatch: (hex, selected) => ({
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background: hex,
    border: selected ? "3px solid #ffd54f" : "3px solid rgba(255,255,255,0.15)",
    cursor: "pointer",
    transition: "all 0.2s",
    boxShadow: selected ? "0 0 12px rgba(255,213,84,0.4)" : "none",
    transform: selected ? "scale(1.15)" : "scale(1)",
  }),
  confirmBtn: {
    display: "block",
    width: "100%",
    padding: "16px 24px",
    borderRadius: "14px",
    background: "linear-gradient(135deg, rgba(233,69,96,0.35), rgba(255,213,84,0.35))",
    border: "2px solid #e94560",
    color: "#fff",
    fontSize: "17px",
    fontWeight: "600",
    cursor: "pointer",
    textAlign: "center",
    transition: "all 0.2s",
    marginTop: "8px",
  },
  narration: {
    fontSize: "15px",
    lineHeight: "1.6",
    fontStyle: "italic",
    color: "#ddd",
    textAlign: "center",
    marginBottom: "4px",
  },
};

export default function AvatarBuilder({ onComplete, playerName, gender = "boy" }) {
  const [config, setConfig] = useState({ ...DEFAULT_AVATAR_CONFIG });
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Karnacja",
      key: "skinColor",
      options: SKIN_COLORS,
    },
    {
      title: "Koszulka",
      key: "shirtColor",
      options: SHIRT_COLORS,
    },
    {
      title: "Spodenki",
      key: "shortsColor",
      options: SHORTS_COLORS,
    },
    {
      title: "Buty",
      key: "shoesColor",
      options: SHOES_COLORS,
    },
  ];

  const narrations = [
    `Zwierciadło Prawdy mruga i mówi: "${playerName}, pokaż mi swoją twarz! Zacznijmy od odcienia skóry."`,
    `"Pięknie! A teraz - jaki kolor koszulki chcesz nosić w magicznym świecie?"`,
    `"Super wybór! Teraz spodenki - jaki kolor najbardziej do Ciebie pasuje?"`,
    `"Ostatni krok - wybierz kolor butów! Dobre buty to podstawa każdej przygody!"`,
  ];

  const ttsNarrations = [
    `${playerName}, pokaż mi swoją twarz! Zacznijmy od odcienia skóry.`,
    `Pięknie! A teraz, jaki kolor koszulki chcesz nosić w magicznym świecie?`,
    `Super wybór! Teraz spodenki, jaki kolor najbardziej do Ciebie pasuje?`,
    `Ostatni krok! Wybierz kolor butów. Dobre buty to podstawa każdej przygody!`,
  ];

  const currentStepData = steps[step];
  const lastSpokenRef = useRef("");

  // Odtwarzaj narrację głosową bez renderowania komponentu NarratorVoice
  useEffect(() => {
    const text = ttsNarrations[step];
    if (text && text !== lastSpokenRef.current) {
      lastSpokenRef.current = text;
      ttsPlayer.stop();
      ttsPlayer.speak(text, { land: "dolina_selfie" });
    }
    return () => ttsPlayer.stop();
  }, [step]);

  const handleSelect = (value) => {
    setConfig((prev) => ({ ...prev, [currentStepData.key]: value }));
  };

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete(config);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <div style={builderStyles.wrapper}>
      <p style={builderStyles.narration}>{narrations[step]}</p>

      {/* Podgląd awatara */}
      <div style={builderStyles.previewBox}>
        <AvatarBoy config={config} size={220} />
      </div>

      {/* Selektor kolorów */}
      <div style={builderStyles.section}>
        <div style={builderStyles.sectionTitle}>{currentStepData.title}</div>
        <div style={builderStyles.optionsRow}>
          {currentStepData.options.map((opt) => (
            <div key={opt.id} style={{ textAlign: "center" }}>
              <div
                style={builderStyles.colorSwatch(
                  opt.hex,
                  config[currentStepData.key] === opt.id
                )}
                onClick={() => handleSelect(opt.id)}
                title={opt.name}
              />
              <div style={{ fontSize: "10px", color: "#889", marginTop: "4px" }}>
                {opt.name}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Nawigacja */}
      <div style={{ display: "flex", gap: "10px", width: "100%" }}>
        {step > 0 && (
          <button
            style={{
              ...builderStyles.confirmBtn,
              background: "rgba(255,255,255,0.06)",
              borderColor: "rgba(255,255,255,0.15)",
              flex: "0 0 auto",
              width: "auto",
              padding: "14px 24px",
            }}
            onClick={handleBack}
          >
            \u2190 Wróć
          </button>
        )}
        <button style={builderStyles.confirmBtn} onClick={handleNext}>
          {step < steps.length - 1 ? "Dalej \u2192" : "\u2728 Tworzę awatara!"}
        </button>
      </div>

      {/* Wskaźnik kroków */}
      <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
        {steps.map((_, i) => (
          <div
            key={i}
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background:
                i === step ? "#ffd54f" : i < step ? "#e94560" : "rgba(255,255,255,0.2)",
              transition: "all 0.3s",
            }}
          />
        ))}
      </div>
    </div>
  );
}
