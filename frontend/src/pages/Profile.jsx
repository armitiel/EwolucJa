import React from "react";
import { useNavigate } from "react-router-dom";
import { AvatarArt } from "../adventure/art/characters.jsx";
import { GameIcon, IconButton } from "../adventure/components/icons.jsx";
import { TRAIT_LABELS } from "../adventure/engine/adventureState.js";
import { useAdventureDane } from "../adventure/engine/useAdventure.js";
import "../adventure/styles/adventure.css";

export default function Profile() {
  const navigate = useNavigate();
  const { adventure, state } = useAdventureDane();
  const traits = Object.entries(state.traits || {}).sort((a, b) => b[1] - a[1]);
  const grants = state.grants.map((id) => adventure.grants[id]).filter(Boolean);

  return (
    <main className="adv-root adv-side-page adv-profile-page" data-testid="adv-profile">
      <img className="adv-side-backdrop" src="/assets/adventure-v2/harbor-arrival.png" alt="" aria-hidden="true" />
      <div className="adv-side-shade" />
      <header className="adv-side-top">
        <IconButton icon="arrow" label="Wróć do świata" onClick={() => navigate("/swiat")} />
        <div><span>Profil awatara</span><h1>Twój wędrowiec</h1></div>
        <div className="adv-side-counter" aria-label={`Iskry: ${state.iskry.length}`}><GameIcon name="spark" size={21} /><strong>{state.iskry.length}</strong></div>
      </header>

      <div className="adv-side-scroll">
        <section className="adv-avatar-hero">
          <div className="adv-avatar-orbit" style={{ "--avatar-color": state.color }}>
            <AvatarArt size={192} color={state.color} grants={state.grants} grantDefs={adventure.grants} />
          </div>
          <span className="adv-card-kicker">Światło wędrowca</span>
          <h2>Rośniesz razem z mapą</h2>
          <p>Każdy wybór i każda ukończona misja zostawiają ślad na twoim awatarze.</p>
          <div className="adv-light-color"><span style={{ background: state.color }} />Wybrany kolor światła</div>
        </section>

        <section className="adv-side-section adv-traits-card">
          <div className="adv-section-heading"><div><span>Twoje mocne strony</span><h2>Ślady wyborów</h2></div><GameIcon name="compass" size={25} /></div>
          <div className="adv-trait-list">
            {traits.map(([key, value], index) => (
              <div className="adv-trait-row" key={key}>
                <span className="adv-trait-rank">{index + 1}</span>
                <div><strong>{TRAIT_LABELS[key] || key}</strong><span><i style={{ width: `${Math.min(100, 18 + value * 13)}%`, background: state.color }} /></span></div>
                <b>{value}</b>
              </div>
            ))}
          </div>
        </section>

        <section className="adv-side-section">
          <div className="adv-section-heading"><div><span>Ekwipunek</span><h2>Rozwój awatara</h2></div><strong>{grants.length}</strong></div>
          <div className="adv-profile-grants">
            {grants.length ? grants.map((grant) => (
              <div key={grant.label}><GameIcon name="gift" size={21} /><span><strong>{grant.label}</strong><small>{grant.note}</small></span></div>
            )) : <div className="adv-empty-card"><GameIcon name="gift" size={24} /><p>Pierwszy element stroju pojawi się po ważnym wyborze.</p></div>}
          </div>
        </section>
      </div>
    </main>
  );
}
