import React from "react";
import { useNavigate } from "react-router-dom";
import { useAdventureDane } from "../adventure/engine/useAdventure.js";
import { ActionButton, GameIcon, IconButton } from "../adventure/components/icons.jsx";
import "../adventure/styles/adventure.css";

const ITEM_ICON = {
  slad: "compass",
  wiatr: "spark",
  ucho: "sound",
  krok: "arrow",
  latarnia: "light",
  pioro: "pen",
  kamyk: "spark",
  wstega: "gift",
  plaszcz: "profile",
  szal: "spark",
  kaptur: "profile",
  naramiennik: "gift",
};

const STATUS = {
  offered: { label: "Gotowa do wykonania", icon: "compass" },
  changes: { label: "Mentor prosi o poprawkę", icon: "pen" },
  sent: { label: "Czeka na Mentora", icon: "hourglass" },
  accepted: { label: "Nagroda jest gotowa", icon: "gift" },
};

export default function Backpack() {
  const navigate = useNavigate();
  const { adventure, state, nextStep } = useAdventureDane();
  const active = state.activeMission;
  const mission = active ? adventure.missions[active.ref] : null;
  const status = STATUS[active?.status] || STATUS.offered;
  const collected = state.grants.map((id) => ({ id, ...adventure.grants[id] })).filter((item) => item.label);

  function openMission() {
    if (nextStep.to?.startsWith("/przygoda")) navigate(nextStep.to);
    else navigate("/swiat");
  }

  return (
    <main className="adv-root adv-side-page" data-testid="adv-backpack">
      <img className="adv-side-backdrop" src="/assets/adventure-v2/forest-leaf-scene.png" alt="" aria-hidden="true" />
      <div className="adv-side-shade" />
      <header className="adv-side-top">
        <IconButton icon="arrow" label="Wróć do świata" onClick={() => navigate("/swiat")} />
        <div>
          <span>Plecak wędrowca</span>
          <h1>Misje i znaleziska</h1>
        </div>
        <div className="adv-side-counter" aria-label={`Iskry: ${state.iskry.length}`}><GameIcon name="spark" size={21} /><strong>{state.iskry.length}</strong></div>
      </header>

      <div className="adv-side-scroll">
        <section className="adv-parchment-card adv-mission-pocket">
          <div className="adv-card-emblem"><GameIcon name={mission ? "scroll" : "map"} size={31} /></div>
          <span className="adv-card-kicker">Aktywna misja</span>
          {mission ? (
            <>
              <h2>{mission.title}</h2>
              <p>{mission.goal}</p>
              <div className="adv-status-ribbon"><GameIcon name={status.icon} size={18} />{status.label}</div>
              {active.note ? <p className="adv-mentor-note">„{active.note}”</p> : null}
              <ActionButton className="adv-cta" icon={active.status === "sent" ? "hourglass" : active.status === "accepted" ? "gift" : "arrow"} onClick={openMission}>
                {active.status === "sent" ? "Sprawdź wiadomość" : active.status === "accepted" ? "Odbierz nagrodę" : "Otwórz misję"}
              </ActionButton>
            </>
          ) : (
            <>
              <h2>Plecak jest gotowy</h2>
              <p>Nowa misja pojawi się po spotkaniu na aktywnej ścieżce.</p>
              <ActionButton className="adv-cta" icon="map" onClick={() => navigate("/swiat")}>Wróć do świata</ActionButton>
            </>
          )}
        </section>

        <section className="adv-side-section">
          <div className="adv-section-heading">
            <div><span>Twoja historia</span><h2>Znalezione przedmioty</h2></div>
            <strong>{collected.length}</strong>
          </div>
          {collected.length ? (
            <div className="adv-artifact-grid">
              {collected.map((item) => (
                <article className="adv-artifact-tile" key={item.id}>
                  <span className="adv-artifact-icon"><GameIcon name={ITEM_ICON[item.icon] || "spark"} size={26} /></span>
                  <h3>{item.label}</h3>
                  <p>{item.note}</p>
                </article>
              ))}
            </div>
          ) : (
            <div className="adv-empty-card"><GameIcon name="spark" size={25} /><p>Pierwsze znalezisko czeka na początku opowieści.</p></div>
          )}
        </section>
      </div>
    </main>
  );
}
