/**
 * RewardScreen — uniwersalny komponent celebracji nagrody.
 * Używany wszędzie gdzie pojawia się "wygrana" w grze:
 *  - Po wysłaniu zadania w realu (MissionView modal)
 *  - Po zatwierdzeniu zadania przez Mentora (HintPopup RewardPopup)
 *  - Po ukończeniu mini-gry (MemoryGame)
 *  - Po quizie onboardingowym
 *  - itd.
 *
 * Zawiera: konfetti spadające w pętli, sparkle burst, złotą kartę
 * z gradient #FCF5E1 → #F4E3B8, animowany licznik 0→N coinów, CTA.
 *
 * Różnicowanie sytuacji odbywa się przez teksty (eyebrow, title, subtitle, note).
 *
 * Props:
 *  - eyebrow: string (mały nagłówek u góry, np. "✨ MENTOR ZATWIERDZIŁ")
 *  - title:   string (duży nagłówek, np. "Świetna robota!")
 *  - subtitle?: string (krótki opis pod title)
 *  - coins:   number (liczba do wyświetlenia w animowanym liczniku)
 *  - note?:   string (tekst pod licznikiem - np. komentarz mentora lub info "DUŻA NAGRODA PO AKCEPTACJI")
 *  - noteStyle?: 'quote' | 'caption' (default 'caption')
 *  - ctaLabel?: string (default "Dziękuję ✦")
 *  - onDismiss: function
 *  - autoDismissMs?: number (jeśli ustawiony, zamknie się sam po N ms)
 */
import React, { useEffect, useState } from "react";
import { Sparkle, Coin } from "./art.jsx";
import { fx } from "../services/soundFx.js";

const CONFETTI_COLORS = ["#FFD269", "#B886E8", "#7BC0E8", "#F08C8C", "#5FA76F", "#FFB347"];
const CONFETTI_PIECES = 32;
const SPARKLE_PIECES = 12;
const COIN_TALLY_MS = 1800;
const FLY_COINS_COUNT = 8;        // Ile monet leci do TopBar
const FLY_COIN_DURATION_MS = 900; // Czas pojedynczego lotu
const FLY_COIN_STAGGER_MS = 80;   // Odstep miedzy startami

export default function RewardScreen({
  eyebrow,
  title,
  subtitle,
  coins = 0,
  note,
  noteStyle = "caption",
  ctaLabel = "Dziękuję ✦",
  onDismiss,
  autoDismissMs,
}) {
  const [coinCount, setCoinCount] = useState(0);
  const [flyCoins, setFlyCoins] = useState(false);

  useEffect(() => {
    try { fx.gentleMagical(0.7); } catch {}
    try { fx.dopamine(0.6); } catch {}
    // Animowany licznik 0 → coins w 1.8s
    const start = Date.now();
    const tick = setInterval(() => {
      const t = Math.min(1, (Date.now() - start) / COIN_TALLY_MS);
      setCoinCount(Math.round(coins * t));
      if (t >= 1) clearInterval(tick);
    }, 40);
    return () => clearInterval(tick);
  }, [coins]);

  // Po zakonczeniu animacji licznika -> wyslij monety do TopBar.
  // Sekwencja: licznik (1.8s) -> flying coins (0.9s + stagger) -> event "coinsLanded".
  useEffect(() => {
    if (!coins || coins <= 0) return;
    const startFly = setTimeout(() => setFlyCoins(true), COIN_TALLY_MS);
    // Event emitowany gdy ostatni coin "wlatuje" - TopBar zlapie i odswiezy + pulsuje
    const lastCoinArrival = COIN_TALLY_MS + FLY_COIN_DURATION_MS + (FLY_COINS_COUNT - 1) * FLY_COIN_STAGGER_MS;
    const emitLanded = setTimeout(() => {
      try {
        window.dispatchEvent(new CustomEvent("ewolucja:coinsLanded", { detail: { amount: coins } }));
      } catch {}
    }, lastCoinArrival);
    return () => { clearTimeout(startFly); clearTimeout(emitLanded); };
  }, [coins]);

  // Auto-dismiss (opcjonalne)
  useEffect(() => {
    if (!autoDismissMs) return;
    const id = setTimeout(() => { try { onDismiss?.(); } catch {} }, autoDismissMs);
    return () => clearTimeout(id);
  }, [autoDismissMs, onDismiss]);

  return (
    <div
      role="dialog"
      aria-live="polite"
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "radial-gradient(circle at 50% 40%, rgba(122,77,194,.55) 0%, rgba(20,10,40,.85) 100%)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 18,
        animation: "fadeIn .3s ease",
        overflow: "hidden",
      }}
    >
      {/* Konfetti spadające w pętli */}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        {Array.from({ length: CONFETTI_PIECES }).map((_, i) => {
          const left = (i * 137) % 100;
          const delay = (i % 12) * 0.15;
          const dur = 2.4 + (i % 5) * 0.4;
          const sz = 8 + (i % 4) * 3;
          const drift = -30 + ((i * 31) % 60);
          const rot = (i * 47) % 360;
          const shape = i % 3;
          const radius = shape === 0 ? "50%" : shape === 1 ? "3px" : "60% 0 60% 0";
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${left}%`, top: "-20px",
                width: sz, height: sz,
                background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
                borderRadius: radius,
                transform: `rotate(${rot}deg)`,
                animation: `confetti-fall ${dur}s linear ${delay}s infinite`,
                ["--tx"]: `${drift}px`,
                opacity: 0.9,
              }}
            />
          );
        })}
      </div>

      {/* Sparkle burst (jednorazowy) */}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {Array.from({ length: SPARKLE_PIECES }).map((_, i) => {
          const a = (i / SPARKLE_PIECES) * Math.PI * 2;
          const cx = 50 + Math.cos(a) * 22;
          const cy = 42 + Math.sin(a) * 16;
          return (
            <div
              key={`b${i}`}
              style={{
                position: "absolute",
                left: `${cx}%`, top: `${cy}%`,
                width: 14, height: 14,
                borderRadius: "60% 0 60% 0",
                background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
                transform: `rotate(${i * 32}deg)`,
                animation: `petal-fly 1.6s cubic-bezier(.34,1.56,.64,1) ${i * 0.05}s both`,
              }}
            />
          );
        })}
      </div>

      {/* Karta główna */}
      <div
        className="pop-in"
        style={{
          position: "relative",
          width: "100%", maxWidth: 380,
          background: "linear-gradient(180deg, #FCF5E1 0%, #F4E3B8 100%)",
          border: "1.5px solid #E1CB94",
          borderRadius: 24,
          boxShadow: "0 16px 48px rgba(80,50,10,.55)",
          padding: "26px 22px 22px",
          textAlign: "center",
        }}
      >
        {eyebrow && (
          <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: 2, color: "var(--p-magic-dk)", marginBottom: 6 }}>
            {eyebrow}
          </div>
        )}
        {title && (
          <h2 className="t-display" style={{ fontSize: 30, margin: "0 0 4px", color: "var(--p-magic-dk)", lineHeight: 1.1 }}>
            {title}
          </h2>
        )}
        {subtitle && (
          <p style={{ fontSize: 13, color: "var(--p-ink-soft)", fontWeight: 700, margin: "0 0 14px" }}>
            {subtitle}
          </p>
        )}

        {/* Pigułka z animowanym licznikiem coinów */}
        <div style={{ margin: "16px 0 14px", position: "relative", display: "inline-block", animation: "coin-tally .6s ease-out" }}>
          <div
            style={{
              display: "inline-flex", alignItems: "center", gap: 12,
              background: "linear-gradient(180deg,#FFF1B0,#FFD269)",
              color: "#7A4D10",
              fontWeight: 800, fontSize: 36,
              padding: "16px 28px", borderRadius: 999,
              boxShadow: "inset 0 0 0 2.5px #E1B66A, 0 8px 20px rgba(160,110,30,.35), 0 0 60px rgba(255,210,105,.55)",
              fontFamily: "var(--font-display, 'Baloo 2'), sans-serif",
            }}
          >
            <Coin size={42} anim />
            <span style={{ lineHeight: 1 }}>+{coinCount}</span>
          </div>
          <div style={{ position: "absolute", top: -12, right: -14 }}>
            <Sparkle size={24} />
          </div>
          <div style={{ position: "absolute", bottom: -10, left: -10 }}>
            <Sparkle size={18} delay={0.4} />
          </div>
        </div>

        {note && noteStyle === "quote" && (
          <p className="t-hand" style={{ fontSize: 17, color: "#5C4220", margin: "8px 0 0", lineHeight: 1.35 }}>
            „{note}"
          </p>
        )}
        {note && noteStyle === "caption" && (
          <p style={{ fontSize: 11, color: "var(--p-ink-soft)", marginTop: 10, fontWeight: 700, letterSpacing: 0.5 }}>
            {note}
          </p>
        )}

        {onDismiss && (
          <button
            className="btn btn-magic btn-block"
            onClick={onDismiss}
            style={{ marginTop: 18 }}
          >
            {ctaLabel}
          </button>
        )}
      </div>

      {/* Flying coins - lecą z miejsca licznika do prawego górnego rogu (TopBar CoinPill).
          Trajektoria: krzywa Beziera, scale 1 → 0.5, rotate, fade out na koniec.
          CSS variables --tx, --ty obliczane runtime z window dimensions. */}
      {flyCoins && Array.from({ length: FLY_COINS_COUNT }).map((_, i) => {
        // Cel: TopBar CoinPill - prawy gorny rog (top ~36px, right ~30px)
        const targetX = window.innerWidth - 60;
        const targetY = 36;
        // Start: srodek modalu, mniej-wiecej tam gdzie pigulka licznika
        const startX = window.innerWidth / 2;
        const startY = window.innerHeight * 0.42;
        const tx = targetX - startX;
        const ty = targetY - startY;
        return (
          <div
            key={`fly${i}`}
            aria-hidden="true"
            style={{
              position: "fixed",
              left: startX,
              top: startY,
              width: 24,
              height: 24,
              marginLeft: -12,
              marginTop: -12,
              borderRadius: "50%",
              background: "radial-gradient(circle at 35% 30%, #FFE7B0 0%, #FFD269 50%, #E89A3D 100%)",
              boxShadow: "0 0 18px rgba(255,210,105,.9), inset 0 0 0 1.5px #B47322",
              animation: `coin-fly ${FLY_COIN_DURATION_MS}ms cubic-bezier(.45,.05,.55,.95) ${i * FLY_COIN_STAGGER_MS}ms forwards`,
              ["--tx"]: `${tx}px`,
              ["--ty"]: `${ty}px`,
              pointerEvents: "none",
              zIndex: 10001,
              opacity: 0,
            }}
          />
        );
      })}
    </div>
  );
}
