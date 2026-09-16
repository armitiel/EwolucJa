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

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { session } from "../services/api.js";
import { statusEpomost, zalogujPrzezPortal, zalogujTestowo, wIframe } from "../services/epomost.js";
import { ttsPlayer } from "../services/ttsPlayer";
import bgMusic from "../services/bgMusic.js";
import PageShell from "../components/PageShell.jsx";

// Kanon wejscia (docs/WERSJA_AKTUALNA.md): START -> onboarding -> `/swiat`.
// 2026-09-14: przepiete z `/w2` na `/swiat`. Oprawa 3D z W2 (planeta, doba,
// kadry kamery, slonce) siedzi juz w mapie W1, wiec `/swiat` niesie i nowy
// swiat, i hub z lancuchem misji. `/w2` zyje dalej pod swoim adresem —
// to tam zostaje limit sesji i karta profilu, dopoki nie przejda tutaj.
const SWIAT = "/swiat";

export default function Landing() {
  const navigate = useNavigate();
  const playerId = session.getPlayer();

  const [statusEpo, setStatusEpo] = useState(null);
  const [logujePortal, setLogujePortal] = useState(false);
  const [bladPortal, setBladPortal] = useState(null);

  // Auto-login ePomost: gdy gra jest osadzona w iframe Portalu i nie ma jeszcze
  // sesji gracza, logujemy przez Portal (PKCE). Poza iframe nie robimy nic —
  // działa zwykły ekran startowy. Status pobieramy zawsze, żeby wiedzieć, czy
  // pokazać wejście testowe (tylko DEV).
  useEffect(() => {
    let anulowane = false;
    (async () => {
      const st = await statusEpomost();
      if (anulowane) return;
      setStatusEpo(st);
      if (playerId) return; // już zalogowany na tym urządzeniu
      if (!wIframe()) return; // samodzielne wejście — bez auto-loginu
      if (!st || !st.keyConfigured) return;
      // Kontrakt: pierwsze żądanie SDK dopiero po załadowaniu iframe i kolejnym
      // zadaniu przeglądarki — odczekaj jeden tick.
      await new Promise((r) => setTimeout(r, 0));
      if (anulowane) return;
      setLogujePortal(true);
      try {
        const gracz = await zalogujPrzezPortal();
        if (anulowane) return;
        navigate(gracz && gracz.archetype ? SWIAT : "/onboarding");
      } catch (e) {
        if (anulowane) return;
        setLogujePortal(false);
        setBladPortal("Nie udało się zalogować przez Portal. Spróbuj odświeżyć.");
      }
    })();
    return () => {
      anulowane = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function wejdzTestowo() {
    setBladPortal(null);
    try {
      const gracz = await zalogujTestowo("podglad");
      navigate(gracz && gracz.archetype ? SWIAT : "/onboarding");
    } catch (e) {
      setBladPortal("Nie udało się utworzyć konta testowego.");
    }
  }

  /** Kazde wyjscie z tego ekranu wlacza dzwiek — to jest ten „user gesture". */
  function wejdz(dokad) {
    try { ttsPlayer.unlock(); } catch {}
    try { bgMusic.setEnabled(true); } catch {}
    // Kurtyna z chmur PRZED nawigacja, nie po. Swiat 3D wczytuje modele kilka
    // sekund i bez niej dziecko dostawalo w tym czasie ciemne tlo huba —
    // kurtyna zyje w `index.html`, wiec przy wejsciu przez router (a nie przez
    // przeladowanie strony) trzeba ja postawic recznie.
    if (dokad === "/swiat" || dokad === "/w2") { try { window.__zbudujChmury?.(); } catch {} }
    navigate(dokad);
  }

  // `ramka`: na szerokim ekranie ten ekran ma WLASNY uklad dwukolumnowy
  // w tym samym szarym kadrze, co swiat 3D — patrz `.page-scena.jest-ramka`
  // i blok „Ekran powitalny na desktopie" w `styles/ewolucja.css`. Na
  // telefonie nie zmienia sie nic: ta sama kolumna 480 px, co dotad.
  if (logujePortal) {
    return (
      <PageShell showClouds={false} ramka>
        <div className="start-ekran">
          <div className="start-zaslona" aria-hidden="true" />
          <div className="start-tresc" style={{ textAlign: "center" }}>
            <h1 className="start-logo">Ewoluc<b>JA</b></h1>
            <p className="start-haslo t-hand">Logowanie przez Portal…</p>
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell showClouds={false} ramka>
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

          {/* Dwa slowa pod logo. To nie jest haslo reklamowe, tylko PODPIS —
              mowi doroslemu, ktory stoi obok, czym ta apka w ogole jest,
              zanim dziecko kliknie START. Dluzsza linijka lamala sie tu
              na trzy wiersze i zaczynala konkurowac z logo. */}
          <p className="start-haslo t-hand">
            Gra Edukacyjna
          </p>

          {/* Przyciski z rodziny HUD-u (`hub-btn`), a nie lzejsze `btn` z ekranow
              tekstowych: to pierwszy przycisk, jaki dziecko widzi, i ma wygladac
              dokladnie jak te w grze — zielony „idz dalej" i zloty poboczny. */}
          <div className="start-cta">
            {/* Jedno slowo, bez ikonki. Wczesniej byly dwa rozne napisy i
                gwiazdka — dziecko musialo je przeczytac, zeby wiedziec, gdzie
                klika. „START" rozpoznaje sie z odleglosci, a dokad prowadzi,
                decyduje sesja, nie tekst. */}
            <button className="hub-btn hub-btn-primary" onClick={() => wejdz(playerId ? SWIAT : "/onboarding")}>
              START
            </button>

            {/* Widoczne zawsze — kodem loguje sie tez dziecko, ktore na tym
                telefonie ma juz zapisana czyjas sesje (np. rodzenstwa). */}
            <button className="hub-btn hub-btn-ghost" onClick={() => wejdz("/odzyskaj")}>
              <img className="start-ikona" src="/assets/wejscie/klucz.png" alt="" aria-hidden="true" />
              {playerId ? "Zaloguj innym kodem" : "Mam już kod"}
            </button>

            {/* Konto testowe — widoczne TYLKO na DEV (backend: testLoginEnabled).
                Pozwala wejść do gry bez Portalu ePomost, do podglądu testów. */}
            {statusEpo && statusEpo.testLoginEnabled && (
              <button className="hub-btn hub-btn-ghost" onClick={wejdzTestowo}>
                Konto testowe (podgląd)
              </button>
            )}
          </div>

          {bladPortal && (
            <p className="start-haslo" style={{ color: "#c0392b", marginTop: 8 }}>{bladPortal}</p>
          )}

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
