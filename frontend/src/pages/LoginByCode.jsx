/**
 * LoginByCode — strona logowania krotkim kodem ucznia.
 *
 * Dziecko/rodzic wpisuje 6-znakowy kod (np. HQ7K2P) ktory mentor pokazal w popupie.
 * Backend zwraca playerId, my zapisujemy do localStorage i przekierowujemy.
 *
 * Sciezka: /odzyskaj (rowniez /witaj jako alias)
 */
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api, session } from "../services/api.js";
import { useAppData } from "../contexts/AppData.jsx";
import PageShell from "../components/PageShell.jsx";

export default function LoginByCode() {
  const navigate = useNavigate();
  const { refreshAll } = useAppData();
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  function clean(v) {
    return String(v).toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8);
  }

  async function handleSubmit(e) {
    e?.preventDefault?.();
    const c = clean(code);
    if (c.length < 4) { setError("Kod ma 6 znaków."); return; }
    setSubmitting(true);
    setError(null);
    try {
      const player = await api.getPlayerByLoginCode(c);
      session.setPlayer(player.player_id);
      try { await refreshAll(); } catch {}
      // Brak archetypu nie zawraca juz do onboardingu: w nowym doswiadczeniu
      // profil buduje sie z decyzji w fabule, a nie z quizu na wejsciu.
      const target = "/swiat";
      navigate(target, { replace: true });
    } catch (err) {
      setError(err.message || "Nie udało się zalogować");
      setSubmitting(false);
    }
  }

  return (
    <PageShell sky="dawn">
      <div className="kod-ekran">
        {/* Klucz to ten sam plik, ktory siedzi w przycisku „Mam juz kod" na
            ekranie startowym — dziecko widzi, ze trafilo tam, gdzie chcialo. */}
        <img className="kod-klucz" src="/assets/wejscie/klucz.png" alt="" aria-hidden="true" />

        <h1 className="t-display kod-tytul">Wpisz swój kod</h1>
        <p className="kod-podpis">
          Sześć znaków od rodzica albo nauczyciela. Otworzą Twoją Kronikę.
        </p>

        <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: 340, display: "flex", flexDirection: "column", gap: 12 }}>
          <input
            ref={inputRef}
            className="kod-pole"
            value={code}
            onChange={(e) => { setCode(clean(e.target.value)); setError(null); }}
            placeholder="HQ7K2P"
            inputMode="text"
            autoCapitalize="characters"
            autoComplete="off"
            spellCheck={false}
            maxLength={8}
            aria-label="Kod ucznia"
          />
          {error && <div className="kod-blad">{error}</div>}
          <button
            type="submit"
            className="btn btn-magic btn-block"
            disabled={submitting || clean(code).length < 4}
          >
            {submitting ? "Sprawdzam…" : (
              <>
                <img className="kod-ikona" src="/star.png" alt="" aria-hidden="true" />
                Otwórz Kronikę
              </>
            )}
          </button>
        </form>

        <div className="kod-stopka">
          Nie masz kodu?{" "}
          <button type="button" onClick={() => navigate("/dolacz")}>Dołącz przez kod klasy</button>
        </div>

        <button onClick={() => navigate("/")} className="btn btn-ghost btn-sm" style={{ marginTop: 2 }}>
          Wróć
        </button>
      </div>
    </PageShell>
  );
}
