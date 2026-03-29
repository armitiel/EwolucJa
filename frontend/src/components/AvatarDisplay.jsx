import React, { useState } from "react";
import AvatarSVG, { EQUIPMENT_DEFS } from "./AvatarSVG";

/**
 * AvatarDisplay — Wyświetla awatar gracza z ekwipunkiem w panelu bocznym/górnym.
 *
 * Props:
 *  - avatarConfig: obiekt konfiguracji awatara
 *  - equipment: string[] — lista ID posiadanego ekwipunku
 *  - playerName: string
 *  - compact: boolean — tryb kompaktowy (mały awatar w narożniku)
 *  - newItem: string|null — ID nowo zdobytego przedmiotu (do animacji)
 *  - onNewItemDismiss: () => void
 */

const displayStyles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
  },
  compactContainer: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    background: "rgba(255,255,255,0.06)",
    borderRadius: "16px",
    padding: "8px 16px 8px 8px",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  inventoryRow: {
    display: "flex",
    gap: "6px",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: "4px",
  },
  itemBadge: (isNew) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    padding: "4px 10px",
    borderRadius: "12px",
    background: isNew ? "rgba(255,213,84,0.2)" : "rgba(255,255,255,0.06)",
    border: isNew ? "1px solid rgba(255,213,84,0.4)" : "1px solid rgba(255,255,255,0.08)",
    fontSize: "12px",
    color: isNew ? "#ffd54f" : "#aab",
    animation: isNew ? "pulse-glow 1.5s ease-in-out infinite" : "none",
  }),
  newItemOverlay: {
    position: "relative",
    background: "linear-gradient(135deg, rgba(255,213,84,0.15), rgba(233,69,96,0.15))",
    borderRadius: "16px",
    padding: "16px",
    border: "1px solid rgba(255,213,84,0.3)",
    textAlign: "center",
    marginBottom: "8px",
  },
  newItemTitle: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#ffd54f",
    marginBottom: "4px",
  },
  newItemName: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#fff",
    marginBottom: "4px",
  },
  newItemEmoji: {
    fontSize: "36px",
    marginBottom: "8px",
    filter: "drop-shadow(0 2px 8px rgba(255,213,84,0.5))",
  },
  dismissBtn: {
    padding: "8px 20px",
    borderRadius: "10px",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.15)",
    color: "#ccc",
    fontSize: "13px",
    cursor: "pointer",
    marginTop: "8px",
  },
};

// Keyframes wstrzyknięte inline (CSS-in-JS)
const keyframesStyle = `
  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 4px rgba(255,213,84,0.2); }
    50% { box-shadow: 0 0 14px rgba(255,213,84,0.5); }
  }
  @keyframes float-in {
    0% { transform: scale(0.3) translateY(20px); opacity: 0; }
    50% { transform: scale(1.1) translateY(-5px); opacity: 1; }
    100% { transform: scale(1) translateY(0); opacity: 1; }
  }
`;

export default function AvatarDisplay({
  avatarConfig,
  equipment = [],
  playerName,
  compact = false,
  newItem = null,
  onNewItemDismiss,
}) {
  const [showInventory, setShowInventory] = useState(false);

  if (!avatarConfig) return null;

  // Powiadomienie o nowym przedmiocie
  if (newItem && EQUIPMENT_DEFS[newItem]) {
    const item = EQUIPMENT_DEFS[newItem];
    return (
      <div>
        <style>{keyframesStyle}</style>
        <div style={displayStyles.newItemOverlay}>
          <div style={displayStyles.newItemTitle}>Nowy przedmiot!</div>
          <div style={{ ...displayStyles.newItemEmoji, animation: "float-in 0.6s ease-out" }}>
            {item.emoji}
          </div>
          <div style={displayStyles.newItemName}>{item.name}</div>
          <div style={{ fontSize: "12px", color: "#aab" }}>
            Dodano do ekwipunku Twojego awatara
          </div>
          <button style={displayStyles.dismissBtn} onClick={onNewItemDismiss}>
            Super! Idę dalej →
          </button>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <AvatarSVG
            config={avatarConfig}
            equipment={equipment}
            size={140}
            animate={true}
          />
        </div>
      </div>
    );
  }

  // Tryb kompaktowy (pasek na górze ekranu gry)
  if (compact) {
    return (
      <div style={displayStyles.compactContainer}>
        <style>{keyframesStyle}</style>
        <AvatarSVG
          config={avatarConfig}
          equipment={equipment}
          size={50}
          animate={false}
          showAura={false}
        />
        <div>
          <div style={{ fontSize: "13px", fontWeight: "600", color: "#eee" }}>
            {playerName}
          </div>
          <div
            style={{ fontSize: "11px", color: "#889", cursor: "pointer" }}
            onClick={() => setShowInventory(!showInventory)}
          >
            {equipment.length} przedmiot{equipment.length === 1 ? "" : equipment.length < 5 ? "y" : "ów"}{" "}
            {showInventory ? "▲" : "▼"}
          </div>
        </div>
        {showInventory && equipment.length > 0 && (
          <div style={displayStyles.inventoryRow}>
            {equipment.map((id) => {
              const item = EQUIPMENT_DEFS[id];
              if (!item) return null;
              return (
                <span key={id} style={displayStyles.itemBadge(false)} title={item.name}>
                  {item.emoji} {item.name}
                </span>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Tryb pełny (np. na ekranie końcowym)
  return (
    <div style={displayStyles.container}>
      <style>{keyframesStyle}</style>
      <AvatarSVG
        config={avatarConfig}
        equipment={equipment}
        size={180}
        animate={true}
      />
      {equipment.length > 0 && (
        <div style={displayStyles.inventoryRow}>
          {equipment.map((id) => {
            const item = EQUIPMENT_DEFS[id];
            if (!item) return null;
            return (
              <span key={id} style={displayStyles.itemBadge(false)} title={item.name}>
                {item.emoji}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
