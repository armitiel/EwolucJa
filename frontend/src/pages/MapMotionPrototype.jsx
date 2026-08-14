import React, { useEffect, useRef, useState } from "react";
import "../styles/map-motion-prototype.css";

const START = { x: 146, y: 590, angle: -12 };

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener?.("change", update);
    return () => media.removeEventListener?.("change", update);
  }, []);
  return reduced;
}

const easeInOutCubic = (value) => (value < 0.5
  ? 4 * value * value * value
  : 1 - Math.pow(-2 * value + 2, 3) / 2);

export default function MapMotionPrototype() {
  const reducedMotion = useReducedMotion();
  const pathRef = useRef(null);
  const transitionTimerRef = useRef(null);
  const [phase, setPhase] = useState("idle");
  const [avatar, setAvatar] = useState(START);
  const [trail, setTrail] = useState(0);
  const [choice, setChoice] = useState(null);
  const [proof, setProof] = useState("");

  useEffect(() => () => window.clearTimeout(transitionTimerRef.current), []);

  useEffect(() => {
    if (phase !== "moving" || !pathRef.current) return undefined;
    const route = pathRef.current;
    const total = route.getTotalLength();
    const duration = reducedMotion ? 420 : 4200;
    const startedAt = performance.now();
    let frameId;
    const tick = (now) => {
      const raw = Math.min(1, (now - startedAt) / duration);
      const progress = reducedMotion ? raw : easeInOutCubic(raw);
      const distance = total * progress;
      const point = route.getPointAtLength(distance);
      const previous = route.getPointAtLength(Math.max(0, distance - 2));
      const angle = Math.atan2(point.y - previous.y, point.x - previous.x) * 180 / Math.PI;
      setAvatar({ x: point.x, y: point.y, angle });
      setTrail(progress);
      if (raw < 1) {
        frameId = requestAnimationFrame(tick);
      } else {
        setPhase("arrived");
        transitionTimerRef.current = window.setTimeout(() => setPhase("scene"), reducedMotion ? 160 : 720);
      }
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [phase, reducedMotion]);

  const beginJourney = () => {
    if (phase !== "idle") return;
    setTrail(0);
    setAvatar(START);
    setPhase("moving");
  };

  const resetAdventure = () => {
    window.clearTimeout(transitionTimerRef.current);
    setPhase("idle");
    setTrail(0);
    setAvatar(START);
    setChoice(null);
    setProof("");
  };

  const status = {
    idle: "Szlak jest gotowy",
    moving: "Wędrujesz do Wieży Przypływów",
    arrived: "Cel osiągnięty",
    scene: "Spotkanie przy moście",
    mission: "Świetlisty liść jest w plecaku",
    proof: "Wróciłeś z misji",
    waiting: "Wieść leci do Mentora",
    success: "Las Szeptów rozbłysnął",
  }[phase];

  return (
    <main className={`map-motion-prototype phase-${phase}${reducedMotion ? " is-reduced" : ""}`} data-prototype-state={phase}>
      <section className="map-motion-stage" aria-label="Prototyp pierwszej misji">
        <header className="map-motion-header">
          <div>
            <span className="map-motion-eyebrow">MAPA WĘDRÓWKI</span>
            <h1>{phase === "success" ? "Las Szeptów" : "Szlak Świetlików"}</h1>
          </div>
          <span className="map-motion-step" aria-label="Etap pierwszy z trzech">1 / 3</span>
        </header>
        <p className="map-motion-intro">{phase === "success" ? "Jedna część mapy znów świeci." : "Jedna droga właśnie się obudziła."}</p>

        <div className="map-motion-canvas">
          <img className="map-motion-map" src="/assets/mapa.png" alt="Baśniowa mapa krain" />
          <div className="map-motion-vignette" aria-hidden="true" />
          <svg className="map-motion-route" viewBox="0 0 344 714" role="img" aria-label="Aktywna droga od kamiennej bramy do Wieży Przypływów">
            <defs>
              <filter id="route-glow" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="5" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
              <filter id="avatar-glow" x="-80%" y="-80%" width="260%" height="260%"><feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#55318f" floodOpacity=".45" /></filter>
            </defs>
            <path ref={pathRef} className="map-motion-path-base" d="M 146 590 C 174 596 205 575 201 553 C 198 534 184 518 216 497" />
            <path className="map-motion-path-glow" d="M 146 590 C 174 596 205 575 201 553 C 198 534 184 518 216 497" />
            <path className="map-motion-path-live" pathLength="1" d="M 146 590 C 174 596 205 575 201 553 C 198 534 184 518 216 497" style={{ strokeDashoffset: 1 - trail }} />
            <g className="map-motion-destination" transform="translate(216 497)" aria-hidden="true"><circle r="24" /><circle className="map-motion-destination-core" r="7" /></g>
            <g className="map-motion-avatar" style={{ transform: `translate(${avatar.x}px, ${avatar.y}px)` }} aria-label="Awatar wędrowca"><circle className="map-motion-avatar-aura" r="31" /><g style={{ transform: `rotate(${avatar.angle * 0.08}deg)` }}><circle className="map-motion-avatar-disc" r="25" /><image href="/lis.svg" x="-23" y="-24" width="46" height="46" /></g></g>
          </svg>
          <div className="map-motion-location" aria-hidden="true"><span />Wieża Przypływów</div>
          {phase === "success" && <div className="map-success-glow" aria-hidden="true">✦</div>}
        </div>

        {phase === "idle" || phase === "moving" || phase === "arrived" ? (
          <div className="map-motion-controls">
            <p className="map-motion-status" aria-live="polite">{status}</p>
            <button type="button" className="map-motion-action" onClick={beginJourney} disabled={phase !== "idle"}>
              <span aria-hidden="true">✦</span>{phase === "idle" ? "Ruszaj szlakiem" : phase === "moving" ? "W drodze…" : "Dotarliśmy"}
            </button>
          </div>
        ) : null}

        {phase === "scene" && <section className="story-panel" aria-label="Spotkanie przy moście">
          <img src="/wizard.png" alt="Strażnik mostu" className="story-guardian" />
          <span className="map-motion-eyebrow">STRAŻNIK MOSTU</span><h2>O, wędrowcze!</h2>
          <p>Świetliki zgubiły drogę do domu. Co chcesz zrobić?</p>
          <div className="choice-stack"><button onClick={() => { setChoice("help"); setPhase("mission"); }}>Pomogę im odnaleźć światło</button><button className="choice-secondary" onClick={() => { setChoice("example"); setPhase("mission"); }}>Pokaż mi mały przykład</button></div>
        </section>}

        {phase === "mission" && <section className="story-panel mission-panel" aria-label="Nowa misja">
          <div className="mission-artifact" aria-hidden="true">🍃<span>✦</span></div><span className="map-motion-eyebrow">NOWY PRZEDMIOT W PLECAKU</span>
          <h2>Świetlisty liść</h2><p>{choice === "example" ? "Zacznij od małego gestu: wybierz dziś jedną osobę, której pomożesz bez proszenia." : "Znajdź dziś trzy małe sposoby, aby pomóc komuś bez proszenia."}</p>
          <button className="map-motion-action story-primary" onClick={() => setPhase("proof")}>Zrobiłem — wracam z misji</button><button className="text-button" onClick={resetAdventure}>Wróć na mapę</button>
        </section>}

        {phase === "proof" && <section className="story-panel proof-panel" aria-label="Powrót z misji">
          <span className="map-motion-eyebrow">POWRÓT Z MISJI</span><h2>Co się wydarzyło?</h2><p>Napisz krótko lub dodaj zdjęcie. Mentor zobaczy tylko to, co zdecydujesz się wysłać.</p>
          <textarea value={proof} onChange={(event) => setProof(event.target.value)} placeholder="Pomogłem dziś…" aria-label="Opis wykonanej misji" />
          <button type="button" className="photo-choice" onClick={() => setProof((value) => value || "[Zdjęcie misji dodane]")}>＋ Dodaj zdjęcie</button>
          <button className="map-motion-action story-primary" onClick={() => setPhase("waiting")}>Wyślij do Mentora</button>
        </section>}

        {phase === "waiting" && <section className="story-panel waiting-panel" aria-label="Oczekiwanie na mentora">
          <div className="sealed-letter" aria-hidden="true">✉<span>✦</span></div><span className="map-motion-eyebrow">WIADOMOŚĆ W DRODZE</span><h2>Dobra robota.</h2><p>Wieść o twoim czynie leci do Mentora. Gdy ją opieczętuje, Las Szeptów pokaże ci nowy fragment.</p>
          <button className="map-motion-action story-primary" onClick={() => setPhase("success")}>Zobacz reakcję świata</button><button className="text-button" onClick={resetAdventure}>Wróć do mapy</button>
        </section>}

        {phase === "success" && <section className="story-panel success-panel" aria-label="Nagroda po misji">
          <div className="success-burst" aria-hidden="true">✦</div><span className="map-motion-eyebrow">PIECZĘĆ MENTORA</span><h2>Światło wróciło!</h2><p>Most rozjaśnił się dzięki twojej pomocy. Zdobywasz <strong>Iskrę Troski</strong> — zostanie z twoim awatarem.</p>
          <button className="map-motion-action story-primary" onClick={resetAdventure}>Wróć do mapy</button>
        </section>}

        {(phase === "scene" || phase === "mission" || phase === "proof" || phase === "waiting" || phase === "success") && <div className="map-motion-status-badge" aria-live="polite">{status}</div>}
      </section>
    </main>
  );
}
