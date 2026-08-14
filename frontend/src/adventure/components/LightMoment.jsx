/**
 * LightMoment — Chwila Światła / Iskra Dnia.
 *
 * Mikro-rytuał: obraz, jedno zdanie, łagodny dźwięk, kilkanaście sekund.
 * Dobrowolny. Pominięcie nie ma żadnych konsekwencji i nie jest nigdzie liczone.
 * Nie formułuje twierdzeń o psychice dziecka — mówi o świecie, nie o dziecku.
 */

import React, { useEffect, useMemo, useState } from "react";
import DATA from "../data/chwile-swiatla.v1.json";
import { IskraArt } from "../art/characters.jsx";
import { cue } from "../audio/sceneAudio.js";

const SEEN_KEY = "ewolucja.chwile.seen";

function readSeen() {
  try {
    return JSON.parse(localStorage.getItem(SEEN_KEY) || "[]");
  } catch {
    return [];
  }
}

/** Eksportowane, bo Chwilę pokazuje teraz też panel huba — jedno miejsce zapisu „widziane". */
export function markSeen(id) {
  try {
    const seen = readSeen();
    if (!seen.includes(id)) localStorage.setItem(SEEN_KEY, JSON.stringify([...seen, id].slice(-40)));
  } catch {}
}

/** Wybiera Chwilę pasującą do miejsca dziecka; nigdy nie powtarza ostatnio widzianej. */
export function pickLightMoment({ location, dayKey } = {}) {
  const seen = readSeen();
  const pool = DATA.moments.filter((m) => !seen.includes(m.id));
  const source = pool.length ? pool : DATA.moments;
  const local = source.filter((m) => m.from === location);
  const candidates = local.length ? local : source;
  // Deterministycznie w obrębie dnia — dziecko nie „losuje" nagrody odświeżaniem.
  const key = dayKey || new Date().toISOString().slice(0, 10);
  let h = 0;
  for (let i = 0; i < key.length; i += 1) h = (h * 31 + key.charCodeAt(i)) % 9973;
  return candidates[h % candidates.length];
}

export default function LightMoment({ moment, onClose }) {
  const [visible, setVisible] = useState(true);
  const m = useMemo(() => moment || pickLightMoment({}), [moment]);

  useEffect(() => {
    cue.discover();
  }, []);

  if (!visible || !m) return null;

  function close() {
    markSeen(m.id);
    setVisible(false);
    onClose?.();
  }

  return (
    <div className="adv-light-moment" role="dialog" aria-label="Chwila Światła" data-testid="adv-light-moment">
      <div className="adv-light-card">
        <div style={{ display: "grid", placeItems: "center" }}>
          <IskraArt size={78} />
        </div>
        <p>{m.text}</p>
        <button type="button" className="adv-cta" onClick={close} data-testid="adv-light-close">
          Dziękuję
        </button>
      </div>
    </div>
  );
}
