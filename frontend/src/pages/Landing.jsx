/**
 * Landing — JEDEN ekran wejscia do gry.
 *
 * Wczesniej byly dwa: pelnoekranowa ilustracja z przyciskiem „Wlacz dzwiek
 * i ruszamy", a zaraz po niej wlasciwy ekran startowy z logo i przyciskami.
 * Dziecko musialo kliknac dwa razy, zeby dojsc do tego samego miejsca, a
 * pierwszy klik nie dawal mu nic poza dzwiekiem.
 *
 * Teraz jest jeden ekran: ilustracja zostaje jako tlo, logo i przyciski siedza
 * na niej, a dzwiek wlacza KAZDE wejscie do gry. Autoplay w przegladarce
 * wymaga gestu uzytkownika — i ten gest to po prostu klikniecie w CTA, ktore
 * dziecko i tak musi wykonac. Dlatego `wejdz()` odblokowuje audio ZANIM
 * zmieni adres; odwrotna kolejnosc gubi gest i muzyka nie rusza.
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import { session } from "../services/api.js";
import { ttsPlayer } from "../services/ttsPlayer";
import bgMusic from "../services/bgMusic.js";
import PageShell from "../components/PageShell.jsx";

export default function Landing() {
  const navigate = useNavigate();
  const playerId = session.getPlayer();

  /** Kazde wyjscie z tego ekranu wlacza dzwiek — to jest ten „user gesture". */
  function wejdz(dokad) {
    try { ttsPlayer.unlock(); } catch {}
    try { bgMusic.setEnabled(true); } catch {}
    navigate(dokad);
  }

  return (
    <PageShell showClouds={false}>
      <div className="start-ekran">
        <img className="start-tlo" src="/assets/wejscie/tlo-start.webp" alt="" aria-hidden="true" />
        <div className="start-zaslona" aria-hidden="true" />

        <div className="start-tresc">
          <h1 className="start-logo">
            Ewoluc<span className="aurora-text">JA</span>
          </h1>

          <p className="start-haslo t-hand">
            Baw się, odkrywaj i zdobywaj nowe moce.
          </p>

          <div className="start-cta">
            <button className="btn btn-magic btn-block" onClick={() => wejdz(playerId ? "/swiat" : "/onboarding")}>
              <img className="start-ikona" src="/star.png" alt="" aria-hidden="true" />
              {playerId ? "Wróć do świata" : "Rozpocznij przygodę"}
            </button>

            {/* Widoczne zawsze — kodem loguje sie tez dziecko, ktore na tym
                telefonie ma juz zapisana czyjas sesje (np. rodzenstwa). */}
            <button className="btn btn-ghost btn-block" onClick={() => wejdz("/odzyskaj")}>
              <img className="start-ikona" src="/assets/wejscie/klucz.png" alt="" aria-hidden="true" />
              {playerId ? "Zaloguj innym kodem" : "Mam już kod"}
            </button>
          </div>

          <p className="start-nuta">
            Muzyka włączy się razem z grą. Nutką w rogu wyciszysz ją w każdej chwili.
          </p>

          <p className="start-dorosly">
            Rodzic albo nauczyciel?{" "}
            <a href="#" onClick={(e) => { e.preventDefault(); wejdz("/mentor/zaloguj"); }}>
              wejdź do panelu Mentora
            </a>
          </p>
        </div>
      </div>
    </PageShell>
  );
}
