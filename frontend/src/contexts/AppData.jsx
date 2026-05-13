/**
 * AppData — globalny stan aplikacji (player, cycle, mission).
 *
 * Idea: pobieramy dane RAZ przy starcie aplikacji (po onboardingu).
 * Wszystkie strony czytaja z kontekstu → przelaczanie zakladek jest natychmiastowe.
 *
 * Pierwszy load pokazuje jeden globalny <Loading /> z animacja Lottie.
 * Po zaladowaniu zadne kolejne wejscie na zakladke nie powoduje fetcha.
 *
 * Odswiezenie:
 * - refreshPlayer() po submit misji / changes na profilu
 * - refreshMission() po wygenerowaniu nowej misji
 * - refreshAll() na zadanie (np. po przyjsciu z tla, idle > 5min)
 */
import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { useLocation } from "react-router-dom";
import { api, session } from "../services/api.js";

const AppDataCtx = createContext(null);

export function useAppData() {
  const ctx = useContext(AppDataCtx);
  if (!ctx) throw new Error("useAppData must be used inside <AppDataProvider>");
  return ctx;
}

// Sciezki na ktorych potrzebujemy danych gracza (Dom / Mapa / Plecak / Profil / Mission / Gry / Reward)
const PROTECTED_PATHS = ["/world", "/map", "/backpack", "/profile", "/mission", "/games", "/reward"];

export default function AppDataProvider({ children }) {
  const location = useLocation();
  const [player, setPlayer] = useState(null);
  const [cycle, setCycle] = useState(null);
  const [mission, setMission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const lastPlayerIdRef = useRef(null);

  // Sprawdz czy biezacy route potrzebuje danych
  const isProtected = PROTECTED_PATHS.some((p) => location.pathname.startsWith(p));

  // Glowny load — startuje gdy mamy playerId w sesji LUB gdy id sie zmienia
  const loadAll = useCallback(async (id) => {
    if (!id) {
      setPlayer(null);
      setCycle(null);
      setMission(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const p = await api.getPlayer(id);
      setPlayer(p);
      // Cycle i mission — w tle, brak loadingu na nie czeka
      Promise.allSettled([
        api.getCurrentCycle(id).then((c) => setCycle(c)).catch(() => setCycle(null)),
        api
          .getCurrentMission(id)
          .then((m) => setMission(m))
          .catch(async () => {
            // Brak misji -> sprobuj wygenerowac
            try {
              const m = await api.generateMission(id);
              setMission(m);
            } catch {
              setMission(null);
            }
          }),
      ]);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Inicjalny load — gdy id pojawia sie w sesji
  useEffect(() => {
    const id = session.getPlayer();
    if (id && id !== lastPlayerIdRef.current) {
      lastPlayerIdRef.current = id;
      loadAll(id);
    } else if (!id) {
      // Nie ma gracza w sesji — nic nie ladujemy, nie blokujemy chronionych
      setLoading(false);
    }
  }, [loadAll, location.pathname]); // przy kazdej zmianie routa sprawdz czy nie zalogowal sie nowy gracz

  // API: odswieżenia
  const refreshPlayer = useCallback(async () => {
    const id = session.getPlayer();
    if (!id) return;
    try {
      const p = await api.getPlayer(id);
      setPlayer(p);
    } catch {}
  }, []);

  const refreshMission = useCallback(async () => {
    const id = session.getPlayer();
    if (!id) return;
    try {
      const m = await api.getCurrentMission(id);
      setMission(m);
    } catch {
      try {
        const m = await api.generateMission(id);
        setMission(m);
      } catch {
        setMission(null);
      }
    }
  }, []);

  const refreshAll = useCallback(() => {
    const id = session.getPlayer();
    if (id) loadAll(id);
  }, [loadAll]);

  const value = {
    player,
    cycle,
    mission,
    loading: loading && isProtected,
    error,
    refreshPlayer,
    refreshMission,
    refreshAll,
    setPlayer,
    setCycle,
    setMission,
    // Manualny update po onboardingu (zanim providerszy useEffect zlapie)
    initFromOnboarding: (newPlayer, newCycle) => {
      setPlayer(newPlayer);
      if (newCycle) setCycle(newCycle);
      lastPlayerIdRef.current = newPlayer?.player_id;
      setLoading(false);
    },
  };

  return <AppDataCtx.Provider value={value}>{children}</AppDataCtx.Provider>;
}
