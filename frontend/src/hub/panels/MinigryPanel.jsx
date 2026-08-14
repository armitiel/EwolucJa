/**
 * MinigryPanel — biblioteka minigier.
 *
 * Odblokowania NIE mają własnej listy: liczą się z `state.unlocked` przygody,
 * więc biblioteka nie może pokazać czegoś, czego nie ma na mapie.
 * Gra bez `trasa` jest jeszcze niezbudowana — mówimy to wprost, zamiast
 * udawać kafel, który nic nie robi.
 */
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { GameIcon } from "../../adventure/components/icons.jsx";
import { useAdventure } from "../../adventure/engine/useAdventure.js";
import KATALOG from "../data/minigry.v1.json";

export default function MinigryPanel({ onZamknij, onKomunikat }) {
  const navigate = useNavigate();
  const { adventure, state } = useAdventure();

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
      onKomunikat?.(`${gra.tytul} — jeszcze nie zbudowana`);
      return;
    }
    onZamknij?.();
    navigate(gra.trasa);
  }

  return (
    <div className="hub-pane" data-testid="hub-pane-gry">
      <p className="hub-note">
        <GameIcon name="spark" size={18} />
        <span>
          Minigry są <b>narzędziem w świecie</b>, nie osobną zakładką — medal na mapie prowadzi do tej samej gry.
          Biblioteka to drugie wejście, dla dziecka, które chce wrócić do gry poznanej w fabule.
        </span>
      </p>

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
              {gra.otwarta && !gra.trasa ? <span className="hub-flag">wkrótce</span> : null}
              <span className="hub-tile-emoji">{gra.otwarta ? gra.emoji : <GameIcon name="lock" size={26} />}</span>
              <span className="hub-tile-title">{gra.tytul}</span>
              <small>{gra.otwarta ? gra.opis : `Otworzy się w krainie: ${gra.kraina}`}</small>
              <span className="hub-coin">
                <img src="/assets/hub-nav/moneta.png" alt="" aria-hidden="true" draggable="false" />
                +{gra.monety}
              </span>
            </span>
          </button>
        ))}
      </div>

      <div className="hub-sec-title">
        <h3>Skąd wchodzi się do gry</h3>
      </div>
      <div className="hub-card">
        {gry.map((gra) => (
          <div className="hub-row" key={`wejscie-${gra.id}`}>
            <span className="hub-row-dot">
              <GameIcon name={gra.otwarta ? "compass" : "lock"} size={19} />
            </span>
            <span>
              <strong>{gra.tytul}</strong>
              <small>{gra.wejscieFabularne}</small>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
