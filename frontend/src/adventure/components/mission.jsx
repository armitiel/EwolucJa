/**
 * mission.jsx — misja jako wydarzenie w świecie, oddanie dowodu, czekanie na
 * Mentora i nagroda po akceptacji.
 *
 * Misja nigdy nie wygląda jak formularz: najpierw jest zdanie o tym, co dzieje
 * się w świecie, potem jeden jasny cel, a dopiero na końcu miejsce na dowód.
 * „Pokaż przykład" i wariant bezpieczny są zawsze pod ręką.
 */

import React, { useEffect, useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import { API_BASE } from "../../config.js";
import { IskraArt, AvatarArt } from "../art/characters.jsx";
import { ActionButton, GameIcon } from "./icons.jsx";
import { cue, enterWaitingState, leaveWaitingState } from "../audio/sceneAudio.js";

const PROOF_LABEL = { text: "Napiszę", audio: "Nagram", photo: "Zrobię zdjęcie" };
const PROOF_ICON = { text: "pen", audio: "microphone", photo: "camera" };

export function MissionSheet({ def, note, onAccept, onSubmit, busy }) {
  const [stage, setStage] = useState(note ? "proof" : "intro");
  const [showExample, setShowExample] = useState(false);
  const [showSafe, setShowSafe] = useState(false);
  const [mode, setMode] = useState(def?.proofTypes?.[0] || "text");
  const [text, setText] = useState("");
  const [mediaUrl, setMediaUrl] = useState(null);
  const [mediaKind, setMediaKind] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadNote, setUploadNote] = useState(null);
  const fileRef = useRef(null);

  if (!def) return null;

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadNote(null);
    try {
      const ext = (file.name.split(".").pop() || "dat").toLowerCase();
      const result = await upload(`dowody/${Date.now()}.${ext}`, file, {
        access: "public",
        handleUploadUrl: `${API_BASE}/uploads/handler`,
      });
      setMediaUrl(result.url);
      setMediaKind(file.type.startsWith("audio") ? "audio" : "photo");
      cue.discover();
    } catch {
      // Bez sieci dowód i tak zostaje — opisz go słowami, Mentor zobaczy później.
      setUploadNote("Nie udało się teraz wysłać pliku. Możesz opisać to słowami — Mentor i tak zobaczy.");
    } finally {
      setUploading(false);
    }
  }

  if (stage === "intro") {
    return (
      <div className="adv-sheet" data-testid="adv-mission-intro">
        <div className="adv-sheet-emblem"><GameIcon name="leaf" size={34} /></div>
        <div className="adv-sheet-kicker">Nowa misja</div>
        <h2>{def.title}</h2>
        <p>{def.world}</p>
        <p className="adv-muted">{def.goal}</p>
        <ActionButton
          className="adv-cta"
          icon="check"
          onClick={() => {
            cue.pick();
            onAccept?.();
            setStage("proof");
          }}
          data-testid="adv-mission-accept"
        >Pomogę</ActionButton>
      </div>
    );
  }

  const canSend = text.trim().length > 1 || !!mediaUrl;

  return (
    <div className="adv-sheet" data-testid="adv-mission-proof">
      <div className="adv-sheet-emblem"><GameIcon name="scroll" size={32} /></div>
      <div className="adv-sheet-kicker">Plecak misji</div>
      <h2>{def.title}</h2>
      {note ? (
        <p style={{ color: "#FFD98A" }}>Mentor prosi o drobną poprawkę: {note}</p>
      ) : null}
      <p>{def.goal}</p>
      <p className="adv-muted">{def.how}</p>

      <div className="adv-chiprow">
        <button type="button" className="adv-chip" onClick={() => setShowExample((v) => !v)} data-testid="adv-example">
          <GameIcon name="light" size={18} /> Pokaż przykład
        </button>
        <button type="button" className="adv-chip" onClick={() => setShowSafe((v) => !v)}>
          <GameIcon name="compass" size={18} /> Inny sposób
        </button>
      </div>

      {showExample ? <p className="adv-muted" data-testid="adv-example-text">{def.example}</p> : null}
      {showSafe ? <p className="adv-muted">{def.safeVariant}</p> : null}

      <div className="adv-chiprow">
        {(def.proofTypes || ["text"]).map((t) => (
          <button
            key={t}
            type="button"
            className={`adv-chip${mode === t ? " adv-chip-on" : ""}`}
            onClick={() => setMode(t)}
          >
            <GameIcon name={PROOF_ICON[t] || "check"} size={18} /> {PROOF_LABEL[t] || t}
          </button>
        ))}
      </div>

      <textarea
        className="adv-field"
        placeholder="Napisz jednym zdaniem, co się wydarzyło…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        data-testid="adv-proof-text"
      />

      {mode !== "text" ? (
        <>
          <div style={{ height: 10 }} />
          <input
            ref={fileRef}
            type="file"
            accept={mode === "audio" ? "audio/*" : "image/*"}
            capture={mode === "photo" ? "environment" : undefined}
            onChange={handleFile}
            style={{ display: "none" }}
            data-testid="adv-proof-file"
          />
          <button type="button" className="adv-ghost" onClick={() => fileRef.current?.click()} disabled={uploading}>
            <GameIcon name={mode === "audio" ? "microphone" : "camera"} size={20} />
            {uploading ? "Wysyłam…" : mediaUrl ? "Dodano — zmień" : mode === "audio" ? "Dodaj nagranie" : "Dodaj zdjęcie"}
          </button>
          {uploadNote ? <p className="adv-muted" style={{ marginTop: 8 }}>{uploadNote}</p> : null}
        </>
      ) : null}

      <div style={{ height: 14 }} />
      <ActionButton
        className="adv-cta"
        icon="scroll"
        disabled={!canSend || busy}
        onClick={() => onSubmit({ text: text.trim(), mediaUrl, mediaKind })}
        data-testid="adv-proof-send"
      >Wyślij Opiekunowi</ActionButton>
      <p className="adv-muted" style={{ marginTop: 10, fontSize: 14 }}>
        <GameIcon name="spark" size={15} /> Nagroda: {def.reward?.coins ?? 25} i Iskra dla krainy.
      </p>
    </div>
  );
}

/** Scena oczekiwania. Bez odliczania, bez ponaglania, bez straty. */
export function WaitingScene({ onCheck, onMap, checking }) {
  const [dots, setDots] = useState(0);
  useEffect(() => {
    enterWaitingState();
    const t = setInterval(() => setDots((d) => (d + 1) % 4), 900);
    return () => {
      clearInterval(t);
      leaveWaitingState();
    };
  }, []);
  return (
    <div className="adv-sheet" data-testid="adv-waiting">
      <div className="adv-sheet-emblem adv-waiting-emblem"><GameIcon name="hourglass" size={42} /></div>
      <div className="adv-sheet-kicker">Wieść w drodze</div>
      <h2>Twój dowód jest w drodze{".".repeat(dots)}</h2>
      <p>Opiekun zaniósł go Mentorowi. Iskra wróci, kiedy Mentor go zobaczy.</p>
      <p className="adv-muted">Nie musisz tu czekać. Świat poczeka razem z tobą.</p>
      <ActionButton className="adv-cta" icon="spark" onClick={onCheck} disabled={checking} data-testid="adv-check">
        {checking ? "Sprawdzam…" : "Sprawdź, czy już wrócił"}
      </ActionButton>
      <button type="button" className="adv-ghost" onClick={onMap}>
        <GameIcon name="map" size={20} /> Wróć do świata
      </button>
    </div>
  );
}

/** Nagroda po akceptacji Mentora.
 *
 * Ten ekran jest o CZLOWIEKU: ktos dorosly zobaczyl prace dziecka i ja docenil.
 * Powrot Iskry i zmiana swiata to osobny beat, ktory dzieje sie juz w scenie —
 * dzieki temu dziecko nie oglada dwa razy tego samego obrazka.
 */
export function RewardScene({ def, iskra, grant, color, grants, grantDefs, onNext }) {
  useEffect(() => {
    cue.success();
  }, []);
  return (
    <div className="adv-sheet" data-testid="adv-reward">
      <div className="adv-sheet-kicker">Pieczęć Mentora</div>
      <div style={{ display: "grid", placeItems: "center", margin: "2px 0 6px" }}>
        <AvatarArt size={132} color={color} grants={grants} grantDefs={grantDefs} />
      </div>
      <h2>Mentor zobaczył twój dowód</h2>
      <p>Powiedział, że to było prawdziwe. {iskra?.label || "Iskra"} jest gotowa wrócić.</p>
      {grant ? (
        <div className="adv-grant" style={{ marginBottom: 12 }}>
          <GameIcon name="gift" size={22} />
          Nowe: {grant.label}
          <span style={{ fontWeight: 500, opacity: 0.8 }}>· {grant.note}</span>
        </div>
      ) : null}
      <p className="adv-muted adv-inline-icon"><GameIcon name="spark" size={16} /> +{def?.reward?.coins ?? 25} do twojego skarbca.</p>
      <ActionButton className="adv-cta" icon="arrow" onClick={onNext} data-testid="adv-next">Wracam do lasu</ActionButton>
    </div>
  );
}
