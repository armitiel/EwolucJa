/*!
 * SPDX-FileCopyrightText: © 2026 Amitiel Angelisme <armitiel@gmail.com>
 * SPDX-License-Identifier: LicenseRef-EwolucJA-Proprietary
 *
 * EwolucJA — gra edukacyjna dla dzieci.
 * Produkt powstał w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”;
 * autorskie prawa majątkowe pozostają przy autorze. Licencja: LICENSE.
 */
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
  /* ZWÓJ, a nie własna ikona zakładki (właściciel, 2026-09-19). Ten sam
     rysunek nosi chmurka „co teraz" nad awatarem (`hub/coTeraz.js`, `IKONA.zwoj`)
     i to on zapowiada zadanie poza ekranem. Dziecko widzi więc zwój w dymku,
     a potem ten sam zwój w doku — i wie, gdzie tamto poszło. Dwie różne ikony
     na tę samą rzecz kazałyby mu się tego domyślać. */
  { id: "wiadomosci", label: "Zadania", asset: "/assets/wskazowki/ikona-zwoj.png" },
  { id: "porada", label: "Porada", asset: "/assets/hub-nav/porada-simple.png" },
];

/**
 * `plakietki` to mapa `id sekcji → liczba albo true`:
 *   liczba > 0  → czerwone kółko z cyferką („tyle rzeczy na Ciebie czeka")
 *   true        → zielona kropka bez liczby („jest coś nowego")
 * Liczba mówi ILE, kropka mówi tylko ŻE — i to jest cała różnica: przy nowej
 * minigrze liczba niczego nie wnosi, bo nie ma czego odhaczać.
 */
/**
 * `migajaca` = id sekcji, której ikona ma przez chwilę mrugać (klasa
 * `is-miga`). Steruje tym świat — np. po słowach Wizkora „czeka w twoich
 * Zadaniach" mruga zakładka, żeby słowo skleiło się z przyciskiem.
 */
/**
 * `sekcje` = lista id do pokazania. Domyślnie wszystkie cztery. Świat W2
 * wystawia na razie samą „Poradę", bo reszta wejść nie ma tam jeszcze treści —
 * a ikona prowadząca donikąd uczy, że nie warto tu zaglądać.
 */
export default function HubDock({ aktywny, onWybor, plakietki = {}, migajaca = null, sekcje = null }) {
  const widoczne = sekcje ? SEKCJE.filter((s) => sekcje.includes(s.id)) : SEKCJE;
  return (
    <nav className="game-hud-dock" aria-label="Sekcje świata"
      /* Siatka ma na stałe cztery kolumny po ~107 px. Przy podzbiorze zostaje
         ta sama szerokość kolumny, a zwęża się cały pasek — inaczej jedna
         ikona rozciąga się na 430 px razem ze swoją kremową podkładką
         (`.game-hud-dock button::before`) i czyta się jak drugie tło. */
      style={sekcje ? { gridTemplateColumns: `repeat(${widoczne.length}, 107px)`, width: 'auto' } : undefined}>
      {widoczne.map((sekcja) => {
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
            className={
              [czyAktywny && "is-active", migajaca === sekcja.id && "is-miga"]
                .filter(Boolean)
                .join(" ") || undefined
            }
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
