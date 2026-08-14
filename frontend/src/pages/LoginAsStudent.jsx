/**
 * LoginAsStudent — strona przekierowujaca rodzica/dziecko na konto ucznia.
 *
 * Flow: mentor kopiuje link /uczen?id=PLAYER_UUID i wysyla rodzicowi.
 * Po kliknieciu w link:
 *  1. Wyciagamy ?id= z URL
 *  2. Weryfikujemy ze gracz istnieje (api.getPlayer)
 *  3. Zapisujemy do session (localStorage.ewolucja.playerId)
 *  4. Przekierowujemy: jezeli ma archetype -> /mapa, jezeli nie -> /onboarding
 *
 * Bezpieczenstwo MVP: UUID jest nieprzewidywalny (v4). Kazdy z linkiem moze
 * zalogowac sie jako dziecko - to celowe, zeby rodzic mogl latwo wrocic.
 * Pozniej mozna dodac PIN / token / wygasanie.
 */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, session } from "../services/api.js";
import PageShell from "../components/PageShell.jsx";
import { Sparkle } from "../components/art.jsx";
import { useAppData } from "../contexts/AppData.jsx";

export default function LoginAsStudent() {
  const navigate = useNavigate();
  const { refreshAll } = useAppData();
  const [error, setError] = useState(null);
  const [stage, setStage] = useState("loading"); // loading | found | error

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (!id) {
      setError("Brak parametru id w linku.");
      setStage("error");
      return;
    }
    (async () => {
      try {
        const player = await api.getPlayer(id);
        if (!player || !player.player_id) {
          setError("Nie znalazłem takiego ucznia. Sprawdź link.");
          setStage("error");
          return;
        }
        // Zapisz sesje + odswiez AppData zeby player byl wczytany w kontekscie
        session.setPlayer(player.player_id);
        try { await refreshAll(); } catch {}
        setStage("found");
        const target = player.archetype ? "/swiat" : "/onboarding";
        // Krotka chwila pokazania imienia (UX), potem redirect
        setTimeout(() => navigate(target, { replace: true }), 800);
      } catch (e) {
        setError(e.message || "Błąd ładowania profilu");
        setStage("error");
      }
    })();
  }, [navigate, refreshAll]);

  return (
    <PageShell sky="dawn">
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 16, padding: 24, textAlign: "center",
      }}>
        {stage === "loading" && (
          <>
            <div style={{ animation: "float-mid 3s ease-in-out infinite" }}>
              <Sparkle size={50} />
            </div>
            <div className="t-display" style={{ fontSize: 22, color: "var(--p-magic-dk)" }}>
              Otwieram Twoją Kronikę…
            </div>
          </>
        )}
        {stage === "found" && (
          <>
            <div style={{ fontSize: 48 }}>✨</div>
            <div className="t-display" style={{ fontSize: 22, color: "var(--p-magic-dk)" }}>
              Witaj z powrotem!
            </div>
            <div style={{ fontSize: 13, color: "var(--p-ink-soft)" }}>
              Za chwilę przeniesiesz się do gry…
            </div>
          </>
        )}
        {stage === "error" && (
          <>
            <div style={{ fontSize: 48 }}>🔒</div>
            <div className="t-display" style={{ fontSize: 22, color: "#B85B47" }}>
              Hmm, coś nie gra…
            </div>
            <div style={{ fontSize: 14, color: "var(--p-ink-soft)", lineHeight: 1.4, maxWidth: 320 }}>
              {error}
            </div>
            <button className="btn btn-magic btn-block" style={{ maxWidth: 280, marginTop: 10 }} onClick={() => navigate("/")}>
              ← Wróć do startu
            </button>
          </>
        )}
      </div>
    </PageShell>
  );
}
