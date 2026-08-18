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
    // Kurtyna z chmur PRZED nawigacja, nie po. Swiat 3D wczytuje modele kilka
    // sekund i bez niej dziecko dostawalo w tym czasie ciemne tlo huba —
    // kurtyna zyje w `index.html`, wiec przy wejsciu przez router (a nie przez
    // przeladowanie strony) trzeba ja postawic recznie.
    if (dokad === "/swiat") { try { window.__zbudujChmury?.(); } catch {} }
    navigate(dokad);
  }

  return (
    <PageShell showClouds={false}>
      <div className="start-ekran">
        {/* Nowa nazwa pliku, a nie podmiana starego: pliki w `public/` nie maja
            hasha, wiec nadpisanie `tlo-start.webp` zostawiloby dzieciom stary
            obrazek z cache przegladarki na dlugie tygodnie. */}
        <img className="start-tlo" src="/assets/wejscie/tlo-start-lis.webp" alt="" aria-hidden="true" />
        <div className="start-zaslona" aria-hidden="true" />

        <div className="start-tresc">
          {/* „JA" jest tu osobnym elementem, bo to nie jest wyroznienie
              typograficzne, tylko znaczek: zlota plakietka z HUD-u. Iskra
              siedzi w <h1>, a nie w tle, zeby skalowala sie razem z napisem. */}
          <h1 className="start-logo">
            Ewoluc<b>JA</b>
            <svg className="start-logo-iskra" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M12 1.6l3.1 6.4 7 1-5 4.9 1.2 7-6.3-3.3-6.3 3.3 1.2-7-5-4.9 7-1z"
                fill="#ffd257" stroke="#fffdf6" strokeWidth="1.6"
              />
            </svg>
          </h1>

          {/* Trzy slowa, bo to jedyna linijka, ktora dziecko przeczyta zanim
              kliknie. Dluzsze haslo lamalo sie tu na trzy wiersze i zaczynalo
              konkurowac z logo. */}
          <p className="start-haslo t-hand">
            Baw się i ucz
          </p>

          {/* Przyciski z rodziny HUD-u (`hub-btn`), a nie lzejsze `btn` z ekranow
              tekstowych: to pierwszy przycisk, jaki dziecko widzi, i ma wygladac
              dokladnie jak te w grze — zielony „idz dalej" i zloty poboczny. */}
          <div className="start-cta">
            {/* Jedno slowo, bez ikonki. Wczesniej byly dwa rozne napisy i
                gwiazdka — dziecko musialo je przeczytac, zeby wiedziec, gdzie
                klika. „START" rozpoznaje sie z odleglosci, a dokad prowadzi,
                decyduje sesja, nie tekst. */}
            <button className="hub-btn hub-btn-primary" onClick={() => wejdz(playerId ? "/swiat" : "/onboarding")}>
              START
            </button>

            {/* Widoczne zawsze — kodem loguje sie tez dziecko, ktore na tym
                telefonie ma juz zapisana czyjas sesje (np. rodzenstwa). */}
            <button className="hub-btn hub-btn-ghost" onClick={() => wejdz("/odzyskaj")}>
              <img className="start-ikona" src="/assets/wejscie/klucz.png" alt="" aria-hidden="true" />
              {playerId ? "Zaloguj innym kodem" : "Mam już kod"}
            </button>
          </div>

          {/* Linijka o muzyce zeszla: dziecko i tak nie ma tu czego ustawiac,
              a nutka w HUD-zie tlumaczy sie sama w chwili, gdy jest potrzebna. */}

          <p className="start-dorosly">
            Rodzic albo nauczyciel?
            <a href="#" onClick={(e) => { e.preventDefault(); wejdz("/mentor/zaloguj"); }}>
              wejdź do panelu Mentora
            </a>
          </p>
        </div>
      </div>
    </PageShell>
  );
}
