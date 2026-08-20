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
  { id: "czat", label: "Rozmowy", asset: "/assets/hub-nav/czat-simple.png" },
  { id: "wiadomosci", label: "Listy", asset: "/assets/hub-nav/wiadomosci-simple.png" },
  { id: "porada", label: "Porada", asset: "/assets/hub-nav/porada-simple.png" },
];

/**
 * `plakietki` to mapa `id sekcji → liczba albo true`:
 *   liczba > 0  → czerwone kółko z cyferką („tyle rzeczy na Ciebie czeka")
 *   true        → zielona kropka bez liczby („jest coś nowego")
 * Liczba mówi ILE, kropka mówi tylko ŻE — i to jest cała różnica: przy nowej
 * minigrze liczba niczego nie wnosi, bo nie ma czego odhaczać.
 */
export default function HubDock({ aktywny, onWybor, plakietki = {} }) {
  return (
    <nav className="game-hud-dock" aria-label="Sekcje świata">
      {SEKCJE.map((sekcja) => {
        const czyAktywny = aktywny === sekcja.id;
        const znak = plakietki[sekcja.id];
        const kropka = znak === true;
        const liczba = typeof znak === "number" && znak > 0 ? znak : null;
        const opis = kropka
          ? `${sekcja.label}, coś nowego`
          : liczba
            ? `${sekcja.label}, nowe: ${liczba}`
            : sekcja.label;
        return (
          <button
            key={sekcja.id}
            type="button"
            className={czyAktywny ? "is-active" : undefined}
            data-section={sekcja.id}
            aria-pressed={czyAktywny}
            aria-label={opis}
            onClick={() => onWybor(sekcja.id)}
            data-testid={`hub-dock-${sekcja.id}`}
          >
            <img src={sekcja.asset} alt="" aria-hidden="true" draggable="false" />
            <span className="game-hud-label" aria-hidden="true">{sekcja.label}</span>
            {kropka ? (
              <span className="game-hud-badge is-kropka" aria-hidden="true" />
            ) : liczba ? (
              // Cyferka w <span>, bo to ona jedzie lekko do góry względem
              // środka kółka — patrz `.game-hud-badge > span` w hud.css.
              <span className="game-hud-badge" aria-hidden="true">
                <span>{liczba > 9 ? "9+" : liczba}</span>
              </span>
            ) : null}
          </button>
        );
      })}
    </nav>
  );
}
