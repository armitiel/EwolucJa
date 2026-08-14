/**
 * Przygoda — odtwarzacz scen pierwszej przygody.
 *
 * Ten plik nie zawiera ani jednego zdania fabuły. Renderuje kroki, które
 * przychodzą z danych, i obsługuje cztery widoki pętli misji: scena, zadanie,
 * czekanie na Mentora, nagroda.
 */

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAdventure } from "../adventure/engine/useAdventure.js";
import { SceneShell, TopStrip, Stage, DialogueBar, ChoiceRail, Reaction, AvatarReveal, IskraReveal, NextStepBar } from "../adventure/components/ui.jsx";
import { MissionSheet, WaitingScene, RewardScene } from "../adventure/components/mission.jsx";
import { AvatarArt } from "../adventure/art/characters.jsx";
import { unlockAudio } from "../adventure/audio/sceneAudio.js";
import "../adventure/styles/adventure.css";

export default function Przygoda() {
  const navigate = useNavigate();
  const { view } = useParams();
  const adv = useAdventure();
  const { adventure, state, scene, step, cast, location } = adv;

  const [reaction, setReaction] = useState(null);
  const [checking, setChecking] = useState(false);
  const [pendingName, setPendingName] = useState("");

  useEffect(() => {
    unlockAudio();
  }, []);

  const litHere = state.iskry.some((id) => adventure.iskry[id]?.location === location?.id);
  const art = location?.art || "przystan";
  const accent = location?.accent || "#57C7D4";

  /* ── Widoki pętli misji ────────────────────────────────────────────── */

  if (view === "zadanie") {
    const def = adventure.missions[state.activeMission?.ref];
    return (
      <SceneShell art={art} accent={accent} lit={litHere}>
        <TopStrip place={location?.name || ""} sparks={state.iskry.length} />
        <MissionSheet
          def={def}
          note={state.activeMission?.status === "changes" ? state.activeMission?.note : null}
          busy={adv.busy}
          onSubmit={async (proof) => {
            await adv.submitProof(proof);
            navigate("/przygoda/czekam");
          }}
        />
      </SceneShell>
    );
  }

  if (view === "czekam") {
    return (
      <SceneShell art={art} accent={accent} lit={litHere}>
        <TopStrip place={location?.name || ""} sparks={state.iskry.length} />
        <WaitingScene
          checking={checking}
          onMap={() => navigate("/swiat")}
          onCheck={async () => {
            setChecking(true);
            const result = await adv.checkMentorDecision();
            setChecking(false);
            if (result === "accepted") navigate("/przygoda/nagroda");
            if (result === "changes") navigate("/przygoda/zadanie");
          }}
        />
      </SceneShell>
    );
  }

  if (view === "nagroda") {
    const def = adventure.missions[state.activeMission?.ref];
    const iskra = adventure.iskry[def?.reward?.iskra];
    const grant = adventure.grants[def?.reward?.grant];
    return (
      <SceneShell art={art} accent={accent} lit>
        <TopStrip place={location?.name || ""} sparks={state.iskry.length} />
        <RewardScene
          def={def}
          iskra={iskra}
          grant={grant}
          color={state.color}
          grants={state.grants}
          grantDefs={adventure.grants}
          onNext={() => {
            adv.collectMissionReward();
            adv.goToScene("las.iskra");
            navigate("/przygoda");
          }}
        />
      </SceneShell>
    );
  }

  /* ── Scena ─────────────────────────────────────────────────────────── */

  if (!scene || !step) {
    return (
      <SceneShell art={art} accent={accent} lit={litHere}>
        <TopStrip place={location?.name || "Las Szeptów"} sparks={state.iskry.length} />
        <Stage avatar={<AvatarArt size={130} color={state.color} grants={state.grants} grantDefs={adventure.grants} />} />
        <NextStepBar label={adv.nextStep.label} onGo={() => navigate("/swiat")} kicker="Dalej" />
      </SceneShell>
    );
  }

  const speaker = adventure.characters[step.who] || null;

  return (
    <SceneShell art={art} accent={accent} lit={litHere}>
      <TopStrip place={location?.name || ""} sparks={state.iskry.length} />
      <Stage
        cast={cast}
        characters={adventure.characters}
        avatar={
          state.doneScenes.length || state.grants.length ? (
            <AvatarArt size={132} color={state.color} grants={state.grants} grantDefs={adventure.grants} />
          ) : null
        }
      />

      {reaction ? (
        <Reaction
          text={reaction.text}
          grant={reaction.grant}
          onNext={() => setReaction(null)}
        />
      ) : step.kind === "line" ? (
        <DialogueBar
          who={step.who}
          name={speaker?.name || ""}
          text={step.text}
          voiceId={step.voice || null}
          onNext={adv.advance}
        />
      ) : step.kind === "choice" ? (
        <ChoiceRail
          prompt={step.prompt}
          options={step.options}
          onPick={(o) => {
            adv.choose(o);
            if (o.reaction) {
              setReaction({ text: o.reaction, grant: o.grant ? adventure.grants[o.grant] : null });
            }
          }}
        />
      ) : step.kind === "avatarReveal" ? (
        <AvatarReveal
          color={state.color}
          grants={state.grants}
          grantDefs={adventure.grants}
          name={pendingName}
          onName={(n) => {
            setPendingName(n);
            adv.commitProfile(n);
          }}
          onNext={adv.advance}
        />
      ) : step.kind === "mission" ? (
        <MissionSheet
          def={adventure.missions[step.missionRef]}
          busy={adv.busy}
          onAccept={() => adv.acceptMission(step.missionRef)}
          onSubmit={async (proof) => {
            await adv.submitProof(proof);
            adv.finishScene();
            navigate("/przygoda/czekam");
          }}
        />
      ) : step.kind === "iskra" ? (
        <IskraReveal iskra={adventure.iskry[step.iskra]} onNext={adv.advance} />
      ) : step.kind === "toMap" ? (
        <NextStepBar
          label={step.hint || "Wróć do świata"}
          kicker="Następny krok"
          onGo={() => {
            adv.finishScene();
            navigate("/swiat");
          }}
        />
      ) : (
        <NextStepBar label="Dalej" onGo={adv.advance} />
      )}
    </SceneShell>
  );
}
