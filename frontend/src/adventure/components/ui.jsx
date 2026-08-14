/**
 * ui.jsx — elementy interfejsu przygody.
 *
 * Reguła nadrzędna (wymóg §8): nic tutaj nie czeka na dźwięk. Przyciski są
 * aktywne od pierwszej klatki, tekst jest zawsze widoczny, a wyciszenie
 * albo błąd audio nie zmieniają ani jednego stanu interfejsu.
 */

import React, { useEffect, useRef, useState } from "react";
import { SceneArt } from "../art/scenes.jsx";
import { CharacterArt, AvatarArt, IskraArt } from "../art/characters.jsx";
import { ActionButton, GameIcon } from "./icons.jsx";
import { cue, isSoundOn, setSoundOn, speakLine, replayLine, silence, unlockAudio } from "../audio/sceneAudio.js";

const GENERATED_SCENES = {
  przystan: "/assets/adventure-v2/harbor-arrival.png",
  las: "/assets/adventure-v2/forest-leaf-scene.png",
};

export function SceneShell({ art, accent, lit, children, onTapBackground }) {
  const generatedScene = GENERATED_SCENES[art];
  return (
    <div className={`adv-root adv-scene-${art || "default"}`} onPointerDown={unlockAudio}>
      {generatedScene ? (
        <img className="adv-art adv-generated-scene" src={generatedScene} alt="" aria-hidden="true" />
      ) : (
        <SceneArt art={art} accent={accent} lit={lit} />
      )}
      <div className="adv-vignette" onClick={onTapBackground} />
      {children}
    </div>
  );
}

export function TopStrip({ place, sparks = 0, right = null }) {
  return (
    <div className="adv-top">
      <span className="adv-place">{place}</span>
      {right}
      {sparks > 0 && (
        <span className="adv-sparks" aria-label={`Iskry: ${sparks}`}>
          <GameIcon name="spark" size={19} />
          {sparks}
        </span>
      )}
    </div>
  );
}

export function Stage({ cast = [], characters = {}, avatar = null }) {
  return (
    <div className="adv-stage">
      {avatar}
      {cast.map((id) => {
        const def = characters[id];
        if (!def?.art) return null;
        return (
          <div key={id} className="adv-char-enter">
            <CharacterArt art={def.art} size={168} />
          </div>
        );
      })}
    </div>
  );
}

/**
 * Pasek dialogu. Zawsze pokazuje, kto mówi. Trzy narzędzia: powtórz, wycisz, dalej.
 * Głos startuje w tle; brak pliku albo wyciszenie nie zmieniają nic w układzie.
 */
export function DialogueBar({ who, name, text, voiceId, onNext, nextLabel = "Dalej" }) {
  const [sound, setSound] = useState(isSoundOn());
  const lastVoice = useRef(null);

  useEffect(() => {
    if (voiceId && voiceId !== lastVoice.current) {
      lastVoice.current = voiceId;
      speakLine(voiceId);
    }
    return () => silence();
  }, [voiceId]);

  return (
    <div className="adv-dialog">
      {name ? (
        <div className="adv-speaker">
          <span className="adv-speaker-dot" />
          {name}
        </div>
      ) : null}
      <p className="adv-line">{text}</p>
      <div className="adv-dialog-tools">
        <button
          type="button"
          className="adv-tool"
          onClick={() => replayLine(voiceId)}
          aria-label="Powtórz"
          disabled={!voiceId}
        >
          <GameIcon name="replay" size={20} />
        </button>
        <button
          type="button"
          className="adv-tool"
          onClick={() => {
            const next = !sound;
            setSound(next);
            setSoundOn(next);
            if (!next) silence();
          }}
          aria-label={sound ? "Wycisz" : "Włącz dźwięk"}
        >
          <GameIcon name={sound ? "sound" : "mute"} size={20} />
        </button>
        <ActionButton className="adv-next" onClick={onNext} data-testid="adv-next">{nextLabel}</ActionButton>
      </div>
    </div>
  );
}

/** Wybory dziecka. Widoczne natychmiast — nigdy nie są zasłonięte ani wyłączone. */
export function ChoiceRail({ prompt, options, onPick }) {
  const [picked, setPicked] = useState(null);
  useEffect(() => setPicked(null), [prompt]);
  return (
    <div className="adv-choices" data-testid="adv-choices">
      {prompt ? <p className="adv-prompt">{prompt}</p> : null}
      {options.map((o, i) => (
        <button
          type="button"
          key={o.id}
          className={`adv-choice${picked === o.id ? " adv-choice-picked" : ""}`}
          style={{ animationDelay: `${i * 55}ms` }}
          onClick={() => {
            if (picked) return;
            setPicked(o.id);
            onPick(o);
          }}
        >
          {o.color ? <span className="adv-swatch" style={{ background: o.color, color: o.color }} /> : null}
          <span>{o.text}</span>
        </button>
      ))}
    </div>
  );
}

/** Reakcja świata na wybór — jedno zdanie i widoczny zysk. */
export function Reaction({ text, grant, onNext }) {
  return (
    <div className="adv-reaction" data-testid="adv-reaction">
      <div>{text}</div>
      {grant ? (
        <div className="adv-grant">
          <GameIcon name="spark" size={22} />
          {grant.label}
          <span style={{ fontWeight: 500, opacity: 0.8 }}>· {grant.note}</span>
        </div>
      ) : null}
      <div className="adv-dialog-tools">
        <ActionButton className="adv-next" onClick={onNext} data-testid="adv-next">Dalej</ActionButton>
      </div>
    </div>
  );
}

/** Odsłonięcie awatara — jedno zdanie, jeden obraz, bez podwójnych ekranów. */
export function AvatarReveal({ color, grants, grantDefs, name, onName, onNext }) {
  const [value, setValue] = useState(name || "");
  return (
    <div className="adv-sheet" data-testid="adv-avatar-reveal">
      <div style={{ display: "grid", placeItems: "center", marginBottom: 8 }}>
        <AvatarArt size={150} color={color} grants={grants} grantDefs={grantDefs} />
      </div>
      <h2>Tak wyglądasz na mapie</h2>
      <p className="adv-muted">Mapa chce wiedzieć, jak cię zapisać.</p>
      <input
        className="adv-field"
        style={{ minHeight: 56 }}
        placeholder="Twoje imię"
        value={value}
        maxLength={24}
        onChange={(e) => setValue(e.target.value)}
        data-testid="adv-name"
      />
      <div style={{ height: 12 }} />
      <button
        type="button"
        className="adv-cta"
        onClick={() => {
          cue.discover();
          onName(value.trim());
          onNext();
        }}
        data-testid="adv-name-ok"
      >
        Zapisz mnie na mapie
      </button>
    </div>
  );
}

/** Odzyskana Iskra — świat zmienia się na oczach dziecka. */
export function IskraReveal({ iskra, onNext }) {
  return (
    <div className="adv-sheet" data-testid="adv-iskra">
      <div style={{ display: "grid", placeItems: "center", margin: "6px 0 12px" }}>
        <IskraArt size={120} color={iskra?.color || "#FFD98A"} />
      </div>
      <h2>{iskra?.label || "Iskra wraca"}</h2>
      <p>Świat odzyskał kawałek światła. Zobacz, co się zmieniło.</p>
      <ActionButton className="adv-cta" icon="map" onClick={onNext} data-testid="adv-next">Popatrz na świat</ActionButton>
    </div>
  );
}

/** Jeden jasny następny krok — mapa nigdy nie zostawia dziecka bez odpowiedzi. */
export function NextStepBar({ label, kicker = "Następny krok", onGo }) {
  return (
    <div className="adv-nextstep" data-testid="adv-nextstep">
      <span className="adv-nextstep-icon"><GameIcon name="spark" size={28} /></span>
      <div className="adv-nextstep-text">
        <div className="adv-nextstep-kicker">{kicker}</div>
        <div className="adv-nextstep-label">{label}</div>
      </div>
      <ActionButton className="adv-next" onClick={onGo} data-testid="adv-go">Idę</ActionButton>
    </div>
  );
}
