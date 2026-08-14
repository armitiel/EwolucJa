import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdventure } from "../adventure/engine/useAdventure.js";
import LightMoment, { pickLightMoment } from "../adventure/components/LightMoment.jsx";
import { GameIcon, IconButton } from "../adventure/components/icons.jsx";
import { listNotifications, markRead } from "../adventure/engine/notifications.js";
import { cue, unlockAudio } from "../adventure/audio/sceneAudio.js";
import "../adventure/styles/adventure.css";

const MAP_POINTS = {
  // Kamienny krąg ponad dolnym panelem — postać pozostaje w całości widoczna.
  przystan: { x: 195, y: 560 },
  "las-szeptow": { x: 195, y: 252 },
  "dolina-dzwiekow": { x: 82, y: 372 },
  "pracownia-gwiazd": { x: 309, y: 392 },
};

// Punkt dotyku Przystani jest nieco wyżej niż środek platformy, żeby pozostał
// widoczny ponad dolnym panelem akcji na małych telefonach.
const MAP_NODE_POINTS = {
  ...MAP_POINTS,
  przystan: { x: 195, y: 535 },
};

const ROUTES = {
  "przystan>las-szeptow": "M195 560 C190 525 192 485 195 450 C200 380 202 315 195 252",
  "las-szeptow>przystan": "M195 252 C202 315 200 380 195 450 C192 485 190 525 195 560",
  "las-szeptow>dolina-dzwiekow": "M195 252 C178 292 138 330 82 372",
  "dolina-dzwiekow>las-szeptow": "M82 372 C138 330 178 292 195 252",
  "las-szeptow>pracownia-gwiazd": "M195 252 C220 292 265 335 309 392",
  "pracownia-gwiazd>las-szeptow": "M309 392 C265 335 220 292 195 252",
  "dolina-dzwiekow>pracownia-gwiazd": "M82 372 C145 335 235 340 309 392",
  "pracownia-gwiazd>dolina-dzwiekow": "M309 392 C235 340 145 335 82 372",
};

function routeFor(from, to) {
  if (!from || !to || from === to) return null;
  return ROUTES[`${from}>${to}`] || ROUTES[`${to}>${from}`] || null;
}

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

export default function MapaSwiata() {
  const navigate = useNavigate();
  const { adventure, state, nextStep, goToScene } = useAdventure();
  const reducedMotion = useReducedMotion();
  const pathRef = useRef(null);
  const arrivalRef = useRef(null);
  const frameRef = useRef(null);
  const [mapLocation, setMapLocation] = useState(state.location);
  const currentPoint = MAP_POINTS[mapLocation] || MAP_POINTS.przystan;
  const targetLocation = nextStep.location || state.location;
  const activeRoute = useMemo(() => routeFor(mapLocation, targetLocation), [mapLocation, targetLocation]);
  const [journey, setJourney] = useState("idle");
  const [travelPath, setTravelPath] = useState(activeRoute);
  const [avatar, setAvatar] = useState(currentPoint);
  const [trail, setTrail] = useState(0);
  const [showLight, setShowLight] = useState(false);
  const [showInbox, setShowInbox] = useState(false);
  const [inbox, setInbox] = useState(() => listNotifications());
  const unread = inbox.filter((item) => !item.read).length;

  useEffect(() => {
    unlockAudio();
  }, []);

  useEffect(() => {
    setMapLocation(state.location);
  }, [state.location]);

  useEffect(() => {
    if (journey !== "idle") return;
    setAvatar(currentPoint);
    setTravelPath(activeRoute);
    setTrail(0);
  }, [currentPoint.x, currentPoint.y, activeRoute, journey]);

  useEffect(() => {
    if (journey !== "moving" || !pathRef.current) return undefined;
    const path = pathRef.current;
    const length = path.getTotalLength();
    const started = performance.now();
    const duration = reducedMotion ? 280 : 2300;
    const tick = (now) => {
      const raw = Math.min(1, (now - started) / duration);
      const progress = reducedMotion ? raw : 1 - Math.pow(1 - raw, 3);
      const point = path.getPointAtLength(length * progress);
      setAvatar({ x: point.x, y: point.y });
      setTrail(progress);
      if (raw < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        setJourney("arrived");
        window.setTimeout(() => arrivalRef.current?.(), reducedMotion ? 80 : 360);
      }
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [journey, reducedMotion]);

  function travelTo(locationId, onArrival) {
    const path = routeFor(mapLocation, locationId);
    if (!path) {
      onArrival();
      return;
    }
    cue.travel();
    arrivalRef.current = onArrival;
    setTravelPath(path);
    setTrail(0);
    setJourney("moving");
  }

  function openNextStep() {
    if (journey !== "idle") return;
    cue.pick();
    if (nextStep.kind === "scene") {
      const openScene = () => {
        goToScene(nextStep.sceneId);
        navigate("/przygoda");
      };
      if (nextStep.location && nextStep.location !== mapLocation) travelTo(nextStep.location, openScene);
      else openScene();
      return;
    }
    if (nextStep.to && nextStep.to !== "/mapa") {
      navigate(nextStep.to);
      return;
    }
    setShowLight(true);
  }

  function handleNode(locationId) {
    if (!state.unlocked.includes(locationId) || journey !== "idle" || locationId === mapLocation) return;
    if (nextStep.kind === "scene" && nextStep.location === locationId) {
      travelTo(locationId, () => {
        goToScene(nextStep.sceneId);
        navigate("/przygoda");
      });
      return;
    }
    if (locationId === "przystan" && !state.doneScenes.includes("przystan.przybycie")) {
      goToScene("przystan.przybycie");
      navigate("/przygoda");
      return;
    }
    travelTo(locationId, () => {
      setMapLocation(locationId);
      setJourney("idle");
    });
  }

  function openMissionBag() {
    navigate("/backpack");
  }

  const buttonLabel = journey === "moving" ? "Wędruję…" : journey === "arrived" ? "Jesteśmy na miejscu" : "Ruszaj";

  return (
    <div className={`adv-root adv-world-map adv-journey-${journey}`} onPointerDown={unlockAudio} data-testid="adv-map-screen">
      <img className="adv-map-backdrop" src="/assets/adventure-v2/world-map-night.png" alt="Baśniowa Mapa Iskier" />
      <div className="adv-map-atmosphere" aria-hidden="true" />

      <header className="adv-map-hud">
        <div className="adv-spark-counter" aria-label={`Iskry: ${state.iskry.length}`}>
          <GameIcon name="spark" size={25} />
          <strong>{state.iskry.length}</strong>
        </div>
        <div className="adv-map-hud-actions">
          <IconButton icon="scroll" label="Plecak misji" onClick={openMissionBag} badge={state.activeMission ? "1" : null} testId="adv-mission-bag" />
          <IconButton icon="profile" label="Profil awatara" onClick={() => navigate("/profile")} />
        </div>
      </header>

      <svg className="adv-travel-layer" viewBox="0 0 390 780" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <filter id="advRouteGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="advAvatarGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feDropShadow dx="0" dy="5" stdDeviation="6" floodColor="#FFD86D" floodOpacity=".72" />
          </filter>
        </defs>
        {travelPath ? (
          <>
            <path ref={pathRef} className="adv-route-base" d={travelPath} pathLength="1" />
            <path className="adv-route-live" d={travelPath} pathLength="1" style={{ strokeDashoffset: 1 - trail }} />
          </>
        ) : null}
        <g className="adv-map-avatar" style={{ transform: `translate(${avatar.x}px, ${avatar.y}px)` }}>
          <ellipse cy="4" rx="25" ry="7" className="adv-map-avatar-ground" />
          <circle cy="-48" r="46" className="adv-map-avatar-aura" />
          <g className="adv-map-avatar-body">
            <image href="/assets/adventure-v2/avatar-map-back-v2.png" x="-47" y="-122" width="94" height="132" preserveAspectRatio="xMidYMid meet" />
          </g>
          <g className="adv-map-avatar-companion">
            <circle r="12" className="adv-map-avatar-companion-halo" />
            <path d="M0 -7 L2 -2 L7 0 L2 2 L0 7 L-2 2 L-7 0 L-2 -2 Z" className="adv-map-avatar-companion-star" />
            <circle r="2.2" className="adv-map-avatar-companion-core" />
          </g>
        </g>
      </svg>

      <div className="adv-map-nodes">
        {Object.values(adventure.locations).map((location) => {
          const point = MAP_NODE_POINTS[location.id];
          if (!point || location.id === mapLocation) return null;
          const unlocked = state.unlocked.includes(location.id);
          const isActive = targetLocation === location.id && nextStep.kind === "scene";
          const isLit = state.iskry.some((id) => adventure.iskry[id]?.location === location.id);
          return (
            <button
              key={location.id}
              type="button"
              className={`adv-world-node${unlocked ? "" : " is-locked"}${isActive ? " is-active" : ""}${isLit ? " is-lit" : ""}`}
              style={{ left: `${(point.x / 390) * 100}%`, top: `${(point.y / 780) * 100}%` }}
              onClick={() => handleNode(location.id)}
              disabled={!unlocked}
              aria-label={`${location.name}${unlocked ? "" : " — jeszcze zamknięta"}`}
              data-testid={`adv-node-${location.id}`}
            >
              <span className="adv-world-node-ring">
                <GameIcon name={unlocked ? (isLit ? "spark" : "compass") : "lock"} size={unlocked ? 22 : 20} />
              </span>
              <span>{location.name}</span>
            </button>
          );
        })}
      </div>

      <div className="adv-map-bottom">
        <IconButton icon="light" label="Chwila Światła" onClick={() => setShowLight(true)} className="adv-map-side-action" />
        <div className="adv-map-primary">
          <div className="adv-map-next-copy">
            <span>Następny krok</span>
            <strong>{nextStep.label}</strong>
          </div>
          <button type="button" className="adv-map-go" onClick={openNextStep} disabled={journey !== "idle"} data-testid="adv-go">
            <GameIcon name="arrow" size={38} strokeWidth={2.5} />
            <span>{buttonLabel}</span>
          </button>
        </div>
        <IconButton
          icon="scroll"
          label={`Wiadomości${unread ? `, nieprzeczytane: ${unread}` : ""}`}
          badge={unread || null}
          onClick={() => { setInbox(listNotifications()); setShowInbox(true); }}
          className="adv-map-side-action"
          testId="adv-inbox-open"
        />
      </div>

      {showInbox ? (
        <div className="adv-light-moment" role="dialog" aria-label="Wiadomości" data-testid="adv-inbox">
          <div className="adv-light-card adv-inbox-card">
            <div className="adv-sheet-emblem"><GameIcon name="scroll" size={32} /></div>
            <h2>Wiadomości</h2>
            {inbox.length === 0 ? <p className="adv-muted">Na razie cisza. To też jest w porządku.</p> : inbox.slice(0, 8).map((item) => (
              <button key={item.id} type="button" className="adv-choice" onClick={() => { markRead(item.id); setShowInbox(false); navigate(item.to || "/mapa"); }}>
                <GameIcon name="spark" size={20} />
                <span><strong>{item.title}</strong><small>{item.body}</small></span>
              </button>
            ))}
            <button type="button" className="adv-ghost" onClick={() => setShowInbox(false)} data-testid="adv-inbox-close">Zamknij</button>
          </div>
        </div>
      ) : null}

      {showLight ? <LightMoment moment={pickLightMoment({ location: state.location })} onClose={() => setShowLight(false)} /> : null}
    </div>
  );
}
