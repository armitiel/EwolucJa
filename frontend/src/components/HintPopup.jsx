/**
 * HintPopup — pop-up z wizardem przekazujacym wiadomosc od mentora.
 * Renderowany globalnie, polling co X sekund po /api/players/:id/hints/unread.
 * Pokazuje kolejke hintow jeden po drugim, kazdy klik "OK" oznacza widziany.
 */
import React, { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { api, session } from "../services/api.js";
import { fx } from "../services/soundFx.js";
// Coin/Sparkle uzywane przez RewardScreen wewnetrznie; tu nie potrzebne
import { useAppData } from "../contexts/AppData.jsx";
import RewardScreen from "./RewardScreen.jsx";

const POLL_INTERVAL_MS = 8_000; // co 8s - szybkie powiadomienia o nowych zadaniach/wiadomosciach od mentora
const MENTOR_PATHS = ["/mentor", "/gm", "/dev"]; // sciezki na ktorych NIE pollujemy hintow ucznia
// Sciezki, na ktorych popup jest wyciszony (uzytkownik widzi liste w inboxie)
const SILENT_POPUP_PATHS = ["/porady", "/przygoda", "/mapa", "/swiat", "/backpack", "/profile"]; // przygoda pokazuje decyzje Mentora wlasna scena

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

        {/* mentor_name celowo nie pokazywany w popupie - nie zaglosujemy imienia mentora dziecku */}

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
// Cienki wrapper na wspolny RewardScreen — parsuje hint i przekazuje propsy.
// Caly wyglad (konfetti, animacja, zlota karta) jest w RewardScreen.
function RewardPopup({ hint, onClose }) {
  const { refreshAll } = useAppData();
  // Parsuj liczbe coinow z body lub title (format "+25 ✦ ..." -> 25)
  const coinMatch = (hint.body || hint.title || "").match(/\+(\d+)/);
  const targetCoins = coinMatch ? parseInt(coinMatch[1], 10) : 20;
  // Komentarz mentora - body bez wiodacego "+N ✦ ·"
  const subText = (hint.body || "").replace(/^\+\d+\s*✦\s*·?\s*/, "").trim();
  // Tytul zadania - oczyszczony z "+N ✦ za " prefiksu
  const taskTitle = hint.title
    ? hint.title.replace(/^\+\d+\s*✦\s*za\s*„?/, "").replace(/[„""]$/, "")
    : null;

  async function handleDismiss() {
    // Odswiezamy AppData zeby player.coins zsynchronizowal sie z baza po zatwierdzeniu
    try { await refreshAll?.(); } catch {}
    onClose();
  }

  return (
    <RewardScreen
      eyebrow="✨ MENTOR ZATWIERDZIŁ"
      title="Świetna robota!"
      subtitle={taskTitle ? `za „${taskTitle}"` : undefined}
      coins={targetCoins}
      note={subText || undefined}
      noteStyle="quote"
      onDismiss={handleDismiss}
    />
  );
}
