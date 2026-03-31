import React, { useState, useEffect, useRef } from "react";
import { ttsPlayer } from "../services/ttsPlayer";
import AvatarBoy, {
  SKIN_COLORS,
  HAIR_COLORS,
  HAIR_STYLES_BOY,
  HAIR_STYLES_GIRL,
  ALL_HAIR_STYLES,
  SHIRT_COLORS,
  SHORTS_COLORS,
  SHOES_COLORS,
  EYE_COLORS,
  MOUTH_VARIANTS,
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
    padding: "8px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "visible",
    width: "100%",
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

export default function AvatarBuilder({ onComplete, playerName, gender: initialGender = "boy" }) {
  // Normalizuj — jeśli detectGender zwróciło "unknown", domyślnie "boy"
  const safeGender = (initialGender === "boy" || initialGender === "girl") ? initialGender : "boy";
  const [selectedGender, setSelectedGender] = useState(safeGender);
  const hairStyles = selectedGender === "girl" ? HAIR_STYLES_GIRL : HAIR_STYLES_BOY;
  const defaultHairStyle = hairStyles[0]?.id || "boy_x5F_1";

  const [config, setConfig] = useState({
    ...DEFAULT_AVATAR_CONFIG,
    hairStyle: defaultHairStyle,
  });
  const [step, setStep] = useState(0);

  // Gdy zmieni się płeć — ustaw domyślną fryzurę dla nowej płci
  const handleGenderChange = (g) => {
    setSelectedGender(g);
    const styles = g === "girl" ? HAIR_STYLES_GIRL : HAIR_STYLES_BOY;
    setConfig(prev => ({ ...prev, hairStyle: styles[0]?.id || "boy_x5F_1" }));
  };

  const GENDER_OPTIONS = [
    { id: "boy",  name: "Chłopiec", emoji: "🧑" },
    { id: "girl", name: "Dziewczyna", emoji: "👧" },
  ];

  const allSteps = [
    {
      title: "Kim jesteś?",
      key: "gender",
      options: GENDER_OPTIONS,
      type: "gender",
    },
    {
      title: "Karnacja",
      key: "skinColor",
      options: SKIN_COLORS,
      type: "color",
    },
    {
      title: "Fryzura",
      key: "hairStyle",
      options: hairStyles,
      type: "hairstyle",
    },
    {
      title: "Kolor włosów",
      key: "hairColor",
      options: HAIR_COLORS,
      type: "color",
    },
    {
      title: "Kolor oczu",
      key: "eyeColor",
      options: EYE_COLORS,
      type: "color",
    },
    {
      title: "Usta",
      key: "mouthVariant",
      options: MOUTH_VARIANTS,
      type: "mouth",
    },
    {
      title: "Koszulka",
      key: "shirtColor",
      options: SHIRT_COLORS,
      type: "color",
    },
    {
      title: "Spodenki",
      key: "shortsColor",
      options: SHORTS_COLORS,
      type: "color",
    },
    {
      title: "Buty",
      key: "shoesColor",
      options: SHOES_COLORS,
      type: "color",
    },
  ];

  // Narracje per krok — mapowane po kluczu konfiguracji
  const narrationMap = {
    gender:       `Zwierciadło Prawdy mówi: "${playerName}, kim jesteś? Wybierz swoją postać!"`,
    skinColor:    `Zwierciadło Prawdy mruga i mówi: "${playerName}, pokaż mi swoją twarz! Zacznijmy od odcienia skóry."`,
    hairStyle:    `"A teraz fryzura! Jaka fryzura najbardziej do Ciebie pasuje?"`,
    hairColor:    `"Świetnie! Teraz wybierz kolor swoich włosów."`,
    eyeColor:     `"Spójrz mi w oczy! Jaki kolor tęczówek będzie miał Twój awatar?"`,
    mouthVariant: `"Uśmiechnij się! Wybierz usta, które najlepiej do Ciebie pasują."`,
    shirtColor:   `"Pięknie! A teraz - jaki kolor koszulki chcesz nosić w magicznym świecie?"`,
    shortsColor:  `"Super wybór! Teraz spodenki - jaki kolor najbardziej do Ciebie pasuje?"`,
    shoesColor:   `"Ostatni krok - wybierz kolor butów! Dobre buty to podstawa każdej przygody!"`,
  };

  const ttsMap = {
    gender:       `${playerName}, kim jesteś? Wybierz swoją postać!`,
    skinColor:    `${playerName}, pokaż mi swoją twarz! Zacznijmy od odcienia skóry.`,
    hairStyle:    `A teraz fryzura! Jaka fryzura najbardziej do Ciebie pasuje?`,
    hairColor:    `Świetnie! Teraz wybierz kolor swoich włosów.`,
    eyeColor:     `Spójrz mi w oczy! Jaki kolor tęczówek będzie miał Twój awatar?`,
    mouthVariant: `Uśmiechnij się! Wybierz usta, które najlepiej do Ciebie pasują.`,
    shirtColor:   `Pięknie! A teraz, jaki kolor koszulki chcesz nosić w magicznym świecie?`,
    shortsColor:  `Super wybór! Teraz spodenki, jaki kolor najbardziej do Ciebie pasuje?`,
    shoesColor:   `Ostatni krok! Wybierz kolor butów. Dobre buty to podstawa każdej przygody!`,
  };

  const steps = allSteps;
  const narrations = steps.map(s => narrationMap[s.key] || "");
  const ttsNarrations = steps.map(s => ttsMap[s.key] || "");

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
    if (currentStepData.key === "gender") {
      handleGenderChange(value);
    } else {
      setConfig((prev) => ({ ...prev, [currentStepData.key]: value }));
    }
  };

  // Kolory tła kafelków ust (ciepłe odcienie różu/beżu) do wizualnego rozróżnienia
  const mouthTileColors = [
    "#F9C195", "#F08775", "#E8A0BF", "#D4A0A0", "#C8956C",
    "#F2A67E", "#E6B89C", "#D9967A", "#C4766E", "#B05A5A",
    "#E8C4B0", "#F5D5C8",
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete(config, selectedGender);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  if (!currentStepData) {
    console.error("[AvatarBuilder] No step data for step:", step, "total steps:", steps.length);
    return <div style={{ color: "#fff", textAlign: "center", padding: "40px" }}>Ładowanie...</div>;
  }

  return (
    <div style={builderStyles.wrapper}>
      <p style={builderStyles.narration}>{narrations[step]}</p>

      {/* Podgląd awatara */}
      <div style={builderStyles.previewBox}>
        <AvatarBoy config={config} size={420} gender={selectedGender} />
        <img
          src="/logo2.svg"
          alt="EwolucJA"
          style={{
            position: "absolute",
            bottom: "8px",
            right: "12px",
            width: "84px",
            height: "auto",
            opacity: 0.3,
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Selektor opcji */}
      <div style={builderStyles.section}>
        <div style={builderStyles.sectionTitle}>{currentStepData.title}</div>
        <div style={builderStyles.optionsRow}>
          {currentStepData.type === "gender"
            ? currentStepData.options.map((opt) => {
                const selected = selectedGender === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => handleSelect(opt.id)}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "8px",
                      padding: "16px 28px",
                      borderRadius: "18px",
                      background: selected ? "rgba(255,213,84,0.2)" : "rgba(255,255,255,0.06)",
                      border: selected ? "3px solid #ffd54f" : "3px solid rgba(255,255,255,0.1)",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      transform: selected ? "scale(1.08)" : "scale(1)",
                      boxShadow: selected ? "0 0 16px rgba(255,213,84,0.3)" : "none",
                      minWidth: "100px",
                    }}
                  >
                    <span style={{ fontSize: "40px" }}>{opt.emoji}</span>
                    <span style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: selected ? "#ffd54f" : "rgba(255,255,255,0.8)",
                    }}>{opt.name}</span>
                  </div>
                );
              })
            : currentStepData.type === "hairstyle"
            ? currentStepData.options.map((opt, idx) => {
                const selected = config[currentStepData.key] === opt.id;
                const hairTileColors = ["#8B5CF6", "#4A90D9", "#34D399"];
                return (
                  <div key={opt.id} style={{ textAlign: "center" }}>
                    <div
                      style={{
                        width: "56px",
                        height: "56px",
                        borderRadius: "16px",
                        background: hairTileColors[idx % hairTileColors.length],
                        border: selected
                          ? "3px solid #ffd54f"
                          : "3px solid rgba(255,255,255,0.15)",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        boxShadow: selected
                          ? "0 0 12px rgba(255,213,84,0.4)"
                          : "none",
                        transform: selected ? "scale(1.15)" : "scale(1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "18px",
                        fontWeight: "700",
                        color: "#fff",
                        textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                      }}
                      onClick={() => handleSelect(opt.id)}
                      title={opt.name}
                    >
                      {idx + 1}
                    </div>
                    <span style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      color: selected ? "#ffd54f" : "rgba(255,255,255,0.6)",
                      marginTop: "4px",
                      display: "block",
                    }}>{opt.name}</span>
                  </div>
                );
              })
            : currentStepData.type === "mouth"
            ? currentStepData.options.map((opt, idx) => {
                const selected = config[currentStepData.key] === opt.id;
                return (
                  <div key={opt.id} style={{ textAlign: "center" }}>
                    <div
                      style={{
                        width: "42px",
                        height: "42px",
                        borderRadius: "12px",
                        background: mouthTileColors[idx % mouthTileColors.length],
                        border: selected
                          ? "3px solid #ffd54f"
                          : "3px solid rgba(255,255,255,0.15)",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        boxShadow: selected
                          ? "0 0 12px rgba(255,213,84,0.4)"
                          : "none",
                        transform: selected ? "scale(1.15)" : "scale(1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "16px",
                        fontWeight: "700",
                        color: "#fff",
                        textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                      }}
                      onClick={() => handleSelect(opt.id)}
                      title={opt.name}
                    >
                      {opt.id}
                    </div>
                  </div>
                );
              })
            : currentStepData.options.map((opt) => (
                <div
                  key={opt.id}
                  style={builderStyles.colorSwatch(
                    opt.hex,
                    config[currentStepData.key] === opt.id
                  )}
                  onClick={() => handleSelect(opt.id)}
                  title={opt.name}
                />
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
            {"← Wróć"}
          </button>
        )}
        <button style={builderStyles.confirmBtn} onClick={handleNext}>
          {step < steps.length - 1 ? "Dalej →" : "✨ Tworzę awatara!"}
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
