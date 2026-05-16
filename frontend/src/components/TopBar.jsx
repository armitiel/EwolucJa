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
import { CoinPill } from "./art.jsx";
import ProfileAvatar, { PROFILE_INFO } from "./ProfileAvatar.jsx";
import NarratorVoice from "./NarratorVoice.jsx";
import { MusicToggleInline } from "./MusicToggle.jsx";

const LEGACY_TO_PROFILE = { tropiciel_tajemnic: "DT", zaklinacz_uczuc: "EM", mistrz_map: "ST", tkacz_snow: "KR", gwardzista_odwagi: "LD", straznik_mostu: "MD" };
function profileCode(v) { if (!v) return "DT"; return PROFILE_INFO[v] ? v : (LEGACY_TO_PROFILE[v] || "DT"); }

export default function TopBar({
  narratorText = null,
  playOnceKey = null,
  showLektor = true,
  showMusic = true,
  showLogout = false,
  onLogout = null,
  tone = "calm",
  speed = 0.86,
}) {
  const navigate = useNavigate();
  const { player } = useAppData();

  if (!player) return null;

  const profile = profileCode(player.archetype);
  // Coiny - osobne pole 'coins' w bazie (quiz daje +50, misja +10). Fallback do lifetime_scores sum dla starych graczy.
  const totalCoins = player.coins != null && player.coins > 0
    ? player.coins
    : Object.values(player.lifetime_scores || {}).reduce((s, v) => s + (v || 0), 0);

  return (
    <>
      {/* Spacer pod fixed-topbar — zachowuje przestrzen w flow zeby tresc nie zaczynala sie pod paskiem */}
      <div aria-hidden="true" style={{ height: "calc(12px + 60px + 12px + env(safe-area-inset-top, 0px))", flexShrink: 0 }} />

      <div
      className="safe-top"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "12px 16px 12px",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        maxWidth: 480,
        margin: "0 auto",
        zIndex: 50,
        background: "linear-gradient(180deg, rgba(255,255,255,.92) 0%, rgba(255,255,255,.85) 70%, rgba(255,255,255,0) 100%)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        transform: "translateZ(0)",
        willChange: "transform",
      }}
    >
      {/* Avatar - klikalny prowadzi na Profil. Lockowane proporcje 1:1 + crop scale 1.4 zeby usunac padding SVG. */}
      <button
        onClick={() => navigate("/profile")}
        aria-label="Profil"
        style={{
          flexShrink: 0, padding: 0, border: "none", background: "none", cursor: "pointer",
          width: 60, height: 60, minWidth: 60, minHeight: 60, maxWidth: 60, maxHeight: 60,
          aspectRatio: "1 / 1",
          borderRadius: "50%", overflow: "hidden",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        <div style={{ width: 60, height: 60, transform: "scale(1.4)", transformOrigin: "center center", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ProfileAvatar profile={profile} size={60} variant="mini" />
        </div>
      </button>
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
      {showLogout && (
        <button
          onClick={onLogout}
          aria-label="Wyloguj"
          title="Wyloguj"
          style={{
            flexShrink: 0,
            width: 40, height: 40, borderRadius: "50%",
            background: "linear-gradient(180deg, #FFC4DB 0%, #E84BA0 100%)",
            border: "none",
            cursor: "pointer", padding: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 0 #B82F7C, 0 4px 12px rgba(232,75,160,.40)",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>
      )}
    </div>
    </>
  );
}
