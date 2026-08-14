/**
 * HubMusicButton — pinetka muzyki w HUD-zie huba 3D, obok monet.
 *
 * Steruje tym samym `bgMusic`, co reszta gry (domyślny utwór:
 * /Mindful_Forest_Path.mp3), więc stan jest wspólny dla wszystkich ekranów
 * i zapamiętany w localStorage.
 *
 * Grafika: /music.png (nutka w stylu claymorphism). Stan wyłączony = nutka
 * wyszarzona + przekreślenie, żeby dziecko widziało różnicę bez czytania.
 */
import React, { useEffect, useState } from "react";
import bgMusic from "../services/bgMusic";

export default function HubMusicButton() {
  const [wlaczona, setWlaczona] = useState(() => bgMusic.isEnabled());

  // bgMusic ma własny localStorage i może być przełączony z DevTools —
  // lekki polling trzyma ikonę w zgodzie ze stanem faktycznym.
  useEffect(() => {
    const t = setInterval(() => {
      const teraz = bgMusic.isEnabled();
      setWlaczona((poprz) => (poprz === teraz ? poprz : teraz));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <button
      type="button"
      className={`hub-music-button${wlaczona ? "" : " is-muted"}`}
      onClick={() => setWlaczona(bgMusic.toggle())}
      aria-pressed={wlaczona}
      aria-label={wlaczona ? "Wyłącz muzykę" : "Włącz muzykę"}
      title={wlaczona ? "Wyłącz muzykę" : "Włącz muzykę"}
      data-testid="hub-music-toggle"
    >
      <img src="/music.png" alt="" aria-hidden="true" draggable="false" />
    </button>
  );
}
