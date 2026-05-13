/**
 * TopBar — sticky pasek gorny dla wszystkich glownych ekranow.
 * Avatar + imie | kontrolki lektora | toggle muzyki | CoinPill.
 *
 * Uzycie: na poczatku kazdej strony zamiast pisac topbar od nowa.
 * <TopBar narratorText="…" totalCoins={82} />
 *
 * Props:
 *  - narratorText (opcjonalne) - tekst do narracji, jesli null = ukryty przycisk lektora
 *  - playOnceKey (opcjonalne) - klucz do narracji "raz na sesje"
 *  - showLektor (default true) - czy w ogole pokazac kontrolki lektora
 *  - showMusic (default true) - czy pokazac toggle muzyki
 */
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppData } from "../contexts/AppData.jsx";
import { Avatar, CoinPill } from "./art.jsx";
import NarratorVoice from "./NarratorVoice.jsx";
import { MusicToggleInline } from "./MusicToggle.jsx";

export default function TopBar({
  narratorText = null,
  playOnceKey = null,
  showLektor = true,
  showMusic = true,
  tone = "calm",
  speed = 0.86,
}) {
  const navigate = useNavigate();
  const { player } = useAppData();

  if (!player) return null;

  const avatarKind = player.avatar_kind || "fox";
  const totalCoins = ((player.lifetime_scores?.DT || 0) + (player.lifetime_scores?.EM || 0)) * 10 + 12;

  return (
    <div
      className="safe-top"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "28px 16px 24px",
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "linear-gradient(180deg, rgba(255,255,255,.92) 0%, rgba(255,255,255,.85) 70%, rgba(255,255,255,0) 100%)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
    >
      <div style={{ flexShrink: 0 }}>
        <Avatar kind={avatarKind} size={48} evolved={1} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          className="t-display"
          style={{
            fontSize: 26,
            lineHeight: 1,
            color: "var(--p-ink)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {player.player_name}
        </div>
      </div>
      {showLektor && narratorText && (
        <div style={{ flexShrink: 0 }}>
          <NarratorVoice
            text={narratorText}
            land="dolina_selfie"
            tone={tone}
            speed={speed}
            pauseBefore={500}
            inlinePauses
            autoPlayDelay={900}
            autoPlay
            playOnceKey={playOnceKey}
          />
        </div>
      )}
      {showMusic && (
        <div style={{ flexShrink: 0 }}>
          <MusicToggleInline />
        </div>
      )}
      <div style={{ flexShrink: 0 }}>
        <CoinPill value={totalCoins} onClick={() => navigate("/backpack")} />
      </div>
    </div>
  );
}
