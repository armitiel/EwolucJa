/**
 * ProfilPanel — awatar, mocne strony, ekwipunek, stan mapy.
 * Dane wyłącznie z istniejącego silnika przygody (`useAdventure`) i z gracza
 * w `AppData` — żadnego drugiego źródła prawdy o postępie.
 *
 * Panel jest celowo ubogi w słowa: wiersze to nazwa plus ikona stanu, bez
 * podpisów powtarzających to, co ikona już mówi. Objaśnienia mechaniki
 * („każdy wybór zostawia ślad") zeszły — dziecko widzi to po samych paskach.
 */
import React, { useMemo } from "react";
import { AvatarArt } from "../../adventure/art/characters.jsx";
import { GameIcon } from "../../adventure/components/icons.jsx";
import { TRAIT_LABELS } from "../../adventure/engine/adventureState.js";
import { useAdventureDane } from "../../adventure/engine/useAdventure.js";
import { useAppData } from "../../contexts/AppData.jsx";

export default function ProfilPanel() {
  const { adventure, state } = useAdventureDane();
  const { player } = useAppData();

  const cechy = useMemo(
    () => Object.entries(state.traits || {}).sort((a, b) => b[1] - a[1]),
    [state.traits]
  );
  const maks = Math.max(1, ...cechy.map(([, v]) => v));
  const zdobycze = (state.grants || []).map((id) => adventure.grants?.[id]).filter(Boolean);
  const wszystkieZdobycze = Object.keys(adventure.grants || {}).length;

  const krainy = useMemo(
    () =>
      Object.values(adventure.locations || {}).map((kraina) => ({
        ...kraina,
        otwarta: (state.unlocked || []).includes(kraina.id),
        rozswietlona: (state.iskry || []).some((id) => adventure.iskry?.[id]?.location === kraina.id),
      })),
    [adventure, state.unlocked, state.iskry]
  );

  return (
    <div className="hub-pane" data-testid="hub-pane-profil">
      <div className="hub-hero">
        <div className="hub-orbit" style={{ "--hub-avatar-color": state.color }}>
          <AvatarArt size={150} color={state.color} grants={state.grants} grantDefs={adventure.grants} />
        </div>
        <h3>{player?.name || "Wędrowiec bez imienia"}</h3>
        <div className="hub-counter-row">
          <span className="hub-counter">
            <img className="hub-resource-icon" src="/assets/hub-nav/iskra.png" alt="" aria-hidden="true" draggable="false" />
            <strong>{(state.iskry || []).length}</strong> iskry
          </span>
          <span className="hub-counter">
            <img className="hub-resource-icon" src="/assets/hub-nav/moneta.png" alt="" aria-hidden="true" draggable="false" />
            <strong>{player?.coins ?? 0}</strong>
          </span>
        </div>
      </div>

      <div className="hub-card">
        <h3 className="hub-card-title">Mocne strony</h3>
        {cechy.length === 0 ? (
          <p className="hub-muted">Jeszcze nic — pierwszy wybór zostawi ślad.</p>
        ) : (
          cechy.map(([klucz, wartosc], indeks) => (
            <div className="hub-trait" key={klucz}>
              <span className="hub-trait-rank">{indeks + 1}</span>
              <span className="hub-trait-bar">
                <strong>{TRAIT_LABELS[klucz] || klucz}</strong>
                <span>
                  <i style={{ width: `${Math.round((wartosc / maks) * 100)}%`, background: state.color }} />
                </span>
              </span>
              <b>{wartosc}</b>
            </div>
          ))
        )}
      </div>

      <div className="hub-sec-title">
        <h3>Ekwipunek</h3>
        <span className="hub-muted">
          {zdobycze.length}
          {wszystkieZdobycze ? ` z ${wszystkieZdobycze}` : ""}
        </span>
      </div>
      <div className="hub-card">
        {zdobycze.length === 0 ? (
          <p className="hub-muted">Jeszcze pusto.</p>
        ) : (
          zdobycze.map((zdobycz) => (
            <div className="hub-row" key={zdobycz.label}>
              <span className="hub-row-dot"><GameIcon name="gift" size={19} /></span>
              <span><strong>{zdobycz.label}</strong></span>
            </div>
          ))
        )}
      </div>

      <div className="hub-sec-title">
        <h3>Mapa</h3>
      </div>
      <div className="hub-card">
        {krainy.map((kraina) => (
          <div className="hub-row" key={kraina.id}>
            <span className="hub-row-dot">
              <GameIcon name={kraina.otwarta ? (kraina.rozswietlona ? "spark" : "compass") : "lock"} size={19} />
            </span>
            <span><strong>{kraina.name}</strong></span>
          </div>
        ))}
      </div>
    </div>
  );
}
