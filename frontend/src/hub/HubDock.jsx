/**
 * HubDock — dolna belka huba 3D. Markup i klasy są te same co w podglądzie
 * `public/scena-3d/index.html`, żeby oba HUD-y stroiły się z jednego pliku CSS.
 *
 * Cztery sekcje, bez ikonki gracza: profil otwiera się kafelkiem z imieniem
 * w lewym górnym rogu, więc powtarzanie go na dole tylko zabierało miejsce
 * i mieszało dziecku dwa różne wejścia do tego samego ekranu.
 */
import React from "react";

const SEKCJE = [
  { id: "gry", label: "Minigry", asset: "/assets/hub-nav/minigry-simple.png" },
  { id: "czat", label: "Czat", asset: "/assets/hub-nav/czat-simple.png" },
  { id: "wiadomosci", label: "Wiadomości", asset: "/assets/hub-nav/wiadomosci-simple.png" },
  { id: "porada", label: "Porada", asset: "/assets/hub-nav/porada-simple.png" },
];

export default function HubDock({ aktywny, onWybor, nieprzeczytane = 0 }) {
  return (
    <nav className="game-hud-dock" aria-label="Sekcje świata">
      {SEKCJE.map((sekcja) => {
        const czyAktywny = aktywny === sekcja.id;
        const plakietka = sekcja.id === "wiadomosci" && nieprzeczytane > 0 ? nieprzeczytane : null;
        return (
          <button
            key={sekcja.id}
            type="button"
            className={czyAktywny ? "is-active" : undefined}
            data-section={sekcja.id}
            aria-pressed={czyAktywny}
            aria-label={plakietka ? `${sekcja.label}, nieprzeczytane: ${plakietka}` : sekcja.label}
            onClick={() => onWybor(sekcja.id)}
            data-testid={`hub-dock-${sekcja.id}`}
          >
            <img src={sekcja.asset} alt="" aria-hidden="true" draggable="false" />
            {plakietka ? (
              <span className="game-hud-badge" aria-hidden="true">{plakietka > 9 ? "9+" : plakietka}</span>
            ) : null}
          </button>
        );
      })}
    </nav>
  );
}
