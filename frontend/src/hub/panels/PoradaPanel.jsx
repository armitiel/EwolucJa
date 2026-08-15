/**
 * PoradaPanel — Chwila Światła jako panel huba.
 *
 * Wybór jest deterministyczny w obrębie dnia (`pickLightMoment`) — odświeżenie
 * ekranu nie działa jak losowanie nagrody. Dobrowolne: pominięcie nie ma
 * konsekwencji i nie jest nigdzie liczone.
 *
 * Źródłem jest `adventure/data/chwile-swiatla.v1.json`, ten sam plik, z którego
 * korzysta modal na mapie — nie robimy drugiego zbioru porad.
 */
import React, { useMemo, useState } from "react";
import { IskraArt } from "../../adventure/art/characters.jsx";
import { GameIcon } from "../../adventure/components/icons.jsx";
import { markSeen, pickLightMoment } from "../../adventure/components/LightMoment.jsx";
import { useAdventure } from "../../adventure/engine/useAdventure.js";
import CHWILE from "../../adventure/data/chwile-swiatla.v1.json";

export default function PoradaPanel({ onZamknij }) {
  const { adventure, state } = useAdventure();
  const [przyjeta, setPrzyjeta] = useState(false);

  const chwila = useMemo(() => pickLightMoment({ location: state.location }), [state.location]);

  function zrodloNazwa(od) {
    return adventure.locations?.[od]?.name || adventure.characters?.[od]?.name || od;
  }

  const inne = useMemo(
    () => (CHWILE.moments || []).filter((m) => m.id !== chwila?.id).slice(0, 4),
    [chwila]
  );

  if (!chwila) {
    return (
      <div className="hub-pane" data-testid="hub-pane-porada">
        <div className="hub-card hub-empty">
          <GameIcon name="light" size={26} />
          <p>Dziś latarnia milczy. Wróć jutro — albo nie wracaj, nic się nie stanie.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="hub-pane" data-testid="hub-pane-porada">
      <div className="hub-tip">
        <div className="hub-tip-art">
          <IskraArt size={72} />
        </div>
        <p className="hub-tip-text">{chwila.text}</p>
        <span className="hub-muted">— od {zrodloNazwa(chwila.from)}</span>

        <div className="hub-actions">
          <button
            type="button"
            className="hub-btn hub-btn-primary"
            disabled={przyjeta}
            onClick={() => { markSeen(chwila.id); setPrzyjeta(true); }}
            data-testid="hub-porada-przyjmij"
          >
            {przyjeta ? "Dziękuję ✓" : "Wezmę to na dziś"}
          </button>
          <button type="button" className="hub-btn hub-btn-ghost" onClick={onZamknij}>
            Może później
          </button>
        </div>
      </div>

      <div className="hub-sec-title">
        <h3>Inne myśli z mapy</h3>
      </div>
      <div className="hub-card">
        {inne.map((moment) => (
          <div className="hub-row" key={moment.id}>
            <span className="hub-row-dot"><GameIcon name="light" size={18} /></span>
            <span>
              <strong>{moment.text}</strong>
              <small>od {zrodloNazwa(moment.from)}</small>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
