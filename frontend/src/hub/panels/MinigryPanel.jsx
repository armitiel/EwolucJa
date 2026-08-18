/**
 * MinigryPanel — biblioteka minigier.
 *
 * Odblokowania NIE mają własnej listy: liczą się z `state.unlocked` przygody,
 * więc biblioteka nie może pokazać czegoś, czego nie ma na mapie.
 *
 * Kafel mówi tylko trzy rzeczy: co to za gra (obrazek + nazwa) i ile daje
 * monet. Opis, kraina i wejście fabularne z niego zeszły — dziecko wybiera
 * grę wzrokiem, a nie czytaniem. Powód blokady zostaje, ale pokazujemy go
 * dopiero po dotknięciu kafla, jako krótki komunikat.
 */
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { GameIcon } from "../../adventure/components/icons.jsx";
import { useAdventureDane } from "../../adventure/engine/useAdventure.js";
import KATALOG from "../data/minigry.v1.json";

export default function MinigryPanel({ onGra, onZamknij, onKomunikat }) {
  const navigate = useNavigate();
  const { adventure, state } = useAdventureDane();

  const gry = useMemo(
    () =>
      (KATALOG.gry || []).map((gra) => ({
        ...gra,
        otwarta: !gra.wymaga || (state.unlocked || []).includes(gra.wymaga),
        kraina: gra.wymaga ? adventure.locations?.[gra.wymaga]?.name || gra.wymaga : null,
      })),
    [adventure, state.unlocked]
  );

  function uruchom(gra) {
    if (!gra.otwarta) {
      onKomunikat?.(`${gra.tytul} otworzy się w krainie: ${gra.kraina}`);
      return;
    }
    if (!gra.trasa) {
      onKomunikat?.("Wkrótce");
      return;
    }
    // Zakładki NIE zamykamy. Gra rysuje się nad hubem, a otwarta zakładka pod
    // nią jest tym, do czego dziecko wraca po wyjściu — wcześniej hub trzeba
    // było w tym momencie zbudować od nowa, razem ze sceną 3D.
    if (onGra) { onGra(gra); return; }
    // Bez `onGra` (gra otwierana spoza huba) zostaje stara droga.
    onZamknij?.();
    navigate(gra.trasa);
  }

  return (
    <div className="hub-pane" data-testid="hub-pane-gry">
      <div className="hub-grid">
        {gry.map((gra) => (
          <button
            key={gra.id}
            type="button"
            className={`hub-tile${gra.otwarta ? "" : " is-locked"}`}
            onClick={() => uruchom(gra)}
            data-testid={`hub-gra-${gra.id}`}
          >
            <span className="hub-tile-in" style={{ background: gra.otwarta ? gra.tlo : undefined }}>
              <span className="hub-tile-emoji">{gra.otwarta ? gra.emoji : <GameIcon name="lock" size={26} />}</span>
              <span className="hub-tile-title">{gra.tytul}</span>
              <span className="hub-coin">
                <img src="/assets/hub-nav/moneta.png" alt="" aria-hidden="true" draggable="false" />
                +{gra.monety}
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
