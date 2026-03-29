import React, { useState } from "react";
import AvatarSVG, {
  SKIN_TONES,
  HAIR_COLORS,
  HAIR_STYLES,
  EYE_COLORS,
  AURA_COLORS,
} from "./AvatarSVG";
import NarratorVoice from "./NarratorVoice";

/**
 * AvatarBuilder — Kreator awatara w Dolinie Selfie.
 *
 * Gracz wybiera: karnację, fryzurę, kolor włosów, kolor oczu i kolor aury.
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
  stylePill: (selected) => ({
    padding: "8px 16px",
    borderRadius: "20px",
    background: selected ? "rgba(233,69,96,0.25)" : "rgba(255,255,255,0.06)",
    border: selected ? "2px solid #e94560" : "2px solid rgba(255,255,255,0.12)",
    color: selected ? "#fff" : "#aab",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s",
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

export default function AvatarBuilder({ onComplete, playerName }) {
  const [config, setConfig] = useState({
    skinTone: "light",
    hairStyle: "short",
    hairColor: "brown",
    eyeColor: "brown",
    auraColor: "golden",
  });

  const [step, setStep] = useState(0); // 0-4 etapy konfiguracji

  const steps = [
    {
      title: "Karnacja",
      key: "skinTone",
      type: "color",
      options: SKIN_TONES,
    },
    {
      title: "Fryzura",
      key: "hairStyle",
      type: "pill",
      options: HAIR_STYLES,
    },
    {
      title: "Kolor włosów",
      key: "hairColor",
      type: "color",
      options: HAIR_COLORS,
    },
    {
      title: "Kolor oczu",
      key: "eyeColor",
      type: "color",
      options: EYE_COLORS,
    },
    {
      title: "Kolor aury",
      key: "auraColor",
      type: "color",
      options: AURA_COLORS,
    },
  ];

  const narrations = [
    `Zwierciadło Prawdy mruga i mówi: „${playerName}, pokaż mi swoją twarz! Zacznijmy od odcienia skóry."`,
    `„Pięknie! A teraz — jaka fryzura najlepiej Cię opisuje?"`,
    `„Oho! Teraz kolory — jaki kolor mają Twoje włosy w magicznym świecie?"`,
    `„Widzę! A Twoje oczy — jakiego są koloru? To ważne, bo oczy to okna duszy!"`,
    `„Ostatni krok — wybierz kolor swojej aury! Aura to niewidzialna energia, która Cię otacza. Jaka jest Twoja?"`,
  ];

  const currentStepData = steps[step];

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

  // Tekst do TTS (bez cudzysłowów i znaków specjalnych)
  const ttsNarrations = [
    `${playerName}, pokaż mi swoją twarz! Zacznijmy od odcienia skóry.`,
    `Pięknie! A teraz, jaka fryzura najlepiej Cię opisuje?`,
    `Oho! Teraz kolory. Jaki kolor mają Twoje włosy w magicznym świecie?`,
    `Widzę! A Twoje oczy, jakiego są koloru? To ważne, bo oczy to okna duszy!`,
    `Ostatni krok! Wybierz kolor swojej aury. Aura to niewidzialna energia, która Cię otacza. Jaka jest Twoja?`,
  ];

  return (
    <div style={builderStyles.wrapper}>
      {/* Narracja z głosem */}
      <NarratorVoice text={ttsNarrations[step]} land="dolina_selfie" />
      <p style={builderStyles.narration}>{narrations[step]}</p>

      {/* Podgląd awatara */}
      <div style={builderStyles.previewBox}>
        <AvatarSVG config={config} equipment={[]} size={180} animate={true} />
      </div>

      {/* Selektor cech */}
      <div style={builderStyles.section}>
        <div style={builderStyles.sectionTitle}>{currentStepData.title}</div>
        <div style={builderStyles.optionsRow}>
          {currentStepData.type === "color"
            ? currentStepData.options.map((opt) => (
                <div key={opt.id} style={{ textAlign: "center" }}>
                  <div
                    style={builderStyles.colorSwatch(
                      opt.hex,
                      config[currentStepData.key] === opt.id
                    )}
                    onClick={() => handleSelect(opt.id)}
                    title={opt.name}
                  />
                  <div
                    style={{
                      fontSize: "10px",
                      color: "#889",
                      marginTop: "4px",
                    }}
                  >
                    {opt.name}
                  </div>
                </div>
              ))
            : currentStepData.options.map((opt) => (
                <div
                  key={opt.id}
                  style={builderStyles.stylePill(
                    config[currentStepData.key] === opt.id
                  )}
                  onClick={() => handleSelect(opt.id)}
                >
                  {opt.name}
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
            ← Wróć
          </button>
        )}
        <button style={builderStyles.confirmBtn} onClick={handleNext}>
          {step < steps.length - 1 ? "Dalej →" : "✨ Tworzę awatara!"}
        </button>
      </div>

      {/* Wskaźnik kroków */}
      <div
        style={{
          display: "flex",
          gap: "6px",
          justifyContent: "center",
        }}
      >
        {steps.map((_, i) => (
          <div
            key={i}
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background:
                i === step
                  ? "#ffd54f"
                  : i < step
                  ? "#e94560"
                  : "rgba(255,255,255,0.2)",
              transition: "all 0.3s",
            }}
          />
        ))}
      </div>
    </div>
  );
}
