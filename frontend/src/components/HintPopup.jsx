/**
 * HintPopup — pop-up z wizardem przekazujacym wiadomosc od mentora.
 * Renderowany globalnie, polling co X sekund po /api/players/:id/hints/unread.
 * Pokazuje kolejke hintow jeden po drugim, kazdy klik "OK" oznacza widziany.
 */
import React, { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { api, session } from "../services/api.js";
import { fx } from "../services/soundFx.js";
import { Coin, Sparkle } from "./art.jsx";
import { useAppData } from "../contexts/AppData.jsx";

const POLL_INTERVAL_MS = 8_000; // co 8s - szybkie powiadomienia o nowych zadaniach/wiadomosciach od mentora
const MENTOR_PATHS = ["/mentor", "/gm", "/dev"]; // sciezki na ktorych NIE pollujemy hintow ucznia
// Sciezki, na ktorych popup jest wyciszony (uzytkownik widzi liste w inboxie)
const SILENT_POPUP_PATHS = ["/porady"];

export default function HintPopup() {
  const location = useLocation();
  const [queue, setQueue] = useState([]);
  const [current, setCurrent] = useState(null);
  // Dostep do refreshAll - gdy task/reward przychodzi, AppData musi zaladowac nowa misje + nowe coiny
  const { refreshAll } = useAppData();

  // Czy jestesmy na sciezce mentora / dev? Jezeli tak - nie pokazujemy hintow ucznia
  const isMentorRoute = MENTOR_PATHS.some((p) => location.pathname.startsWith(p));
  // Czy jestesmy na trasie z inboxem hintow? Wtedy nie wyswietlamy popupu (nie dublujemy)
  const isSilentRoute = SILENT_POPUP_PATHS.some((p) => location.pathname.startsWith(p));

  const fetchHints = useCallback(async () => {
    if (isMentorRoute) return;
    const playerId = session.getPlayer();
    if (!playerId) return;
    try {
      const data = await api.getUnreadHints(playerId);
      if (data.hints && data.hints.length > 0) {
        setQueue((prev) => {
          const existingIds = new Set(prev.map((h) => h.id));
          const fresh = data.hints.filter((h) => !existingIds.has(h.id));
          return [...prev, ...fresh];
        });
        // Auto-refresh AppData tylko gdy task (nowa misja) lub reward (coiny) - te wymagaja
        // odswiezenia. Generic hint/message/artifact same nie zmieniaja player state.
        // refreshAll jest TERAZ silent (bez globalnego loadera), wiec ekran nie miga.
        const needsRefresh = data.hints.some((h) => h.kind === "task" || h.kind === "reward");
        if (needsRefresh) {
          try { refreshAll?.(); } catch {}
        }
      }
    } catch {}
  }, [isMentorRoute, refreshAll]);

  // Initial fetch + polling. Re-fetch tez przy zmianie route - zeby od razu pokazac jezeli
  // gracz np. wyszedl z /porady i przyszedl wlasnie nowy hint.
  useEffect(() => {
    if (isMentorRoute) {
      // Na trasach mentora ukrywamy aktywne hinty i nie pollujemy
      setQueue([]);
      setCurrent(null);
      return;
    }
    fetchHints();
    const i = setInterval(fetchHints, POLL_INTERVAL_MS);
    return () => clearInterval(i);
  }, [fetchHints, isMentorRoute, location.pathname]);

  // Wyciagnij pierwszy z kolejki do "current" jezeli nic juz nie pokazujemy.
  // Na trasach SILENT (np. /porady) NIE wyciagamy popupu - lista i tak jest widoczna w inboxie.
  useEffect(() => {
    if (isSilentRoute) return;
    if (!current && queue.length > 0) {
      setCurrent(queue[0]);
      // delikatny dzwiek przy pojawieniu sie hintu
      try { fx.gentleMagical(0.5); } catch {}
    }
  }, [queue, current, isSilentRoute]);

  async function dismiss() {
    if (!current) return;
    const playerId = session.getPlayer();
    try { if (playerId) await api.markHintViewed(playerId, current.id); } catch {}
    setQueue((prev) => prev.filter((h) => h.id !== current.id));
    setCurrent(null);
  }

  if (!current) return null;

  // REWARD - mentor zatwierdzil zadanie. Wlasny celebration popup z animacja coinow.
  if (current.kind === "reward") {
    return <RewardPopup hint={current} onClose={dismiss} />;
  }

  const kindIcon = current.kind === "artifact" ? "🎁" : current.kind === "message" ? "💬" : current.kind === "task" ? "📜" : "💡";
  const kindLabel = current.kind === "artifact" ? "ARTEFAKT" : current.kind === "message" ? "WIADOMOŚĆ" : current.kind === "task" ? "NOWE ZADANIE" : "PODPOWIEDŹ";

  return (
    <div
      onClick={dismiss}
      style={{
        position: "fixed", inset: 0, zIndex: 9000,
        background: "rgba(20,15,40,.78)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 18,
        animation: "fadeIn .25s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="pop-in"
        style={{
          width: "100%", maxWidth: 380,
          background: "linear-gradient(180deg, #FCF5E1 0%, #F4E3B8 100%)",
          border: "1.5px solid #E1CB94",
          borderRadius: 22,
          boxShadow: "0 12px 40px rgba(80,50,10,.5)",
          padding: "26px 22px 22px",
          textAlign: "center",
          position: "relative",
        }}
      >
        {/* Wizard na gorze */}
        <div style={{ marginTop: -68, marginBottom: 8, display: "flex", justifyContent: "center" }}>
          <div style={{
            width: 108, height: 108, borderRadius: "50%",
            background: "rgba(255,255,255,.92)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 0 6px rgba(255,210,105,.30), 0 8px 24px rgba(232,154,61,.45)",
            animation: "float-mid 3s ease-in-out infinite",
          }}>
            <img
              src="/wizard.png"
              alt=""
              style={{ width: 96, height: 96, objectFit: "contain" }}
            />
          </div>
        </div>

        <div style={{
          display: "inline-block", padding: "3px 12px", borderRadius: 999,
          background: "rgba(122,77,194,.18)", color: "var(--p-magic-dk)",
          fontSize: 11, fontWeight: 800, letterSpacing: 1.5, marginBottom: 8,
        }}>
          {kindIcon} {kindLabel}
        </div>

        {current.title && (
          <h2 className="t-display" style={{ fontSize: 22, margin: "0 0 8px", color: "#3B2A12" }}>
            {current.title}
          </h2>
        )}

        <p className="t-hand" style={{ fontSize: 18, color: "#5C4220", margin: "0 0 6px", lineHeight: 1.35 }}>
          „{current.body}"
        </p>

        {current.mentor_name && (
          <p style={{ fontSize: 12, color: "var(--p-ink-soft)", margin: "0 0 16px", fontStyle: "italic" }}>
            — {current.mentor_name}
          </p>
        )}

        <button
          className="btn btn-magic btn-block"
          onClick={dismiss}
          style={{ marginTop: 8 }}
        >
          ✦ Rozumiem
        </button>
      </div>
    </div>
  );
}

// ─── RewardPopup — wyswietla sie gdy mentor zatwierdzil zadanie ─────────────
// Pelnoekranowy celebration z animowanym licznikiem coinow + konfetti + CTA "Dziekuje".
// Backdrop NIE zamyka (onClick={}), tylko CTA - zeby dziecko nasycilo sie nagroda.
function RewardPopup({ hint, onClose }) {
  // Parsuj liczbe coinow z body lub title (format "+25 ✦ ..." -> 25)
  const coinMatch = (hint.body || hint.title || "").match(/\+(\d+)/);
  const targetCoins = coinMatch ? parseInt(coinMatch[1], 10) : 20;
  const [coinCount, setCoinCount] = useState(0);
  const { refreshAll } = useAppData();

  useEffect(() => {
    try { fx.gentleMagical(0.7); } catch {}
    try { fx.dopamine(0.6); } catch {}
    // Animowany licznik 0 → targetCoins w 1.8s
    const start = Date.now();
    const duration = 1800;
    const tick = setInterval(() => {
      const t = Math.min(1, (Date.now() - start) / duration);
      setCoinCount(Math.round(targetCoins * t));
      if (t >= 1) clearInterval(tick);
    }, 40);
    return () => clearInterval(tick);
  }, [targetCoins]);

  async function handleDismiss() {
    // Odswiezamy AppData zeby player.coins zsynchronizowal sie z baza po zatwierdzeniu
    try { await refreshAll?.(); } catch {}
    onClose();
  }

  const colors = ["#FFD269", "#B886E8", "#7BC0E8", "#F08C8C", "#5FA76F", "#FFB347"];
  const PIECES = 32;
  // Komentarz mentora - body bez wiodacego "+N ✦ ·"
  const subText = (hint.body || "").replace(/^\+\d+\s*✦\s*·?\s*/, "").trim();

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "radial-gradient(circle at 50% 40%, rgba(122,77,194,.55) 0%, rgba(20,10,40,.85) 100%)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 18,
        animation: "fadeIn .3s ease",
        overflow: "hidden",
      }}
    >
      {/* Konfetti spadajace (loop) */}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        {Array.from({ length: PIECES }).map((_, i) => {
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
                background: colors[i % colors.length],
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
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * Math.PI * 2;
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
                background: colors[i % colors.length],
                transform: `rotate(${i * 32}deg)`,
                animation: `petal-fly 1.6s cubic-bezier(.34,1.56,.64,1) ${i * 0.05}s both`,
              }}
            />
          );
        })}
      </div>

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
        {/* Naglowek */}
        <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: 2, color: "var(--p-magic-dk)", marginBottom: 6 }}>
          ✨ MENTOR ZATWIERDZIŁ
        </div>
        <h2 className="t-display" style={{ fontSize: 30, margin: "0 0 4px", color: "var(--p-magic-dk)", lineHeight: 1.1 }}>
          Świetna robota!
        </h2>
        {hint.title && (
          <p style={{ fontSize: 13, color: "var(--p-ink-soft)", fontWeight: 700, margin: "0 0 14px" }}>
            za „{hint.title.replace(/^\+\d+\s*✦\s*za\s*„?/, "").replace(/[„""]$/, "")}"
          </p>
        )}

        {/* Pigulka z animowanym licznikiem coinow */}
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

        {subText && (
          <p className="t-hand" style={{ fontSize: 17, color: "#5C4220", margin: "8px 0 0", lineHeight: 1.35 }}>
            „{subText}"
          </p>
        )}
        {hint.mentor_name && (
          <p style={{ fontSize: 11, color: "var(--p-ink-soft)", margin: "6px 0 0", fontStyle: "italic" }}>
            — {hint.mentor_name}
          </p>
        )}

        <button
          className="btn btn-magic btn-block"
          onClick={handleDismiss}
          style={{ marginTop: 18 }}
        >
          Dziękuję ✦
        </button>
      </div>
    </div>
  );
}
