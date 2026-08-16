/**
 * useAdventure — maszyna stanu przygody sterowana danymi.
 *
 * Cała treść (sceny, kwestie, wybory, misje, nagrody) pochodzi z pliku JSON.
 * Ten moduł nie zna ani jednego zdania fabuły — dodanie kolejnej przygody to
 * nowy plik danych i wpis w ADVENTURES, bez dotykania logiki.
 *
 * Rodzaje kroków sceny:
 *   line          — kwestia postaci lub narratora
 *   enter         — wejście postaci na scenę (efekt uboczny, sam się przewija)
 *   choice        — wybór dziecka; zmienia cechy i przyznaje przedmiot
 *   avatarReveal  — awatar pojawia się na mapie
 *   unlock        — odblokowanie lokacji (efekt uboczny)
 *   toMap         — koniec sceny, wracamy na mapę z jasnym następnym krokiem
 *   mission       — misja w realu jako wydarzenie w świecie
 *   iskra         — odzyskana Iskra
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { api, session } from "../../services/api.js";
import ADVENTURE from "../data/mapa-iskier.v1.json";
import {
  loadState,
  saveState,
  emptyState,
  hydrateFromApi,
  toLegacyScores,
  adoptAnonState,
} from "./adventureState.js";
import { cue, setMood } from "../audio/sceneAudio.js";
import { notify } from "./notifications.js";

export const ADVENTURES = { "mapa-iskier": ADVENTURE };

/** Kroki, które są instrukcją sceniczną — nie wymagają decyzji dziecka. */
const SIDE_EFFECT_STEPS = new Set(["enter", "unlock"]);

/**
 * Wersja TYLKO DO ODCZYTU — postęp, cechy, zdobycze, następny krok.
 *
 * Używaj jej wszędzie, gdzie przygoda jest źródłem danych, a nie ekranem:
 * w panelach huba, w plecaku, w profilu, w zwoju wiadomości. Różnica jest
 * jedna, ale istotna — nie rusza dźwięku. Pełne `useAdventure` przy każdym
 * zamontowaniu ustawia nastrój muzyczny sceny, co w hubie znaczyło: otwierasz
 * profil, muzyka startuje od nowa.
 */
export function useAdventureDane(adventureId) {
  return useAdventure(adventureId, { dzwiek: false });
}

/**
 * @param {string} adventureId
 * @param {{dzwiek?: boolean}} opcje  `dzwiek: false` = hook jest wyłącznie
 *   źródłem danych i NIE rusza dźwięku (patrz `useAdventureDane` niżej).
 */
export function useAdventure(adventureId = "mapa-iskier", { dzwiek = true } = {}) {
  const adventure = ADVENTURES[adventureId] || ADVENTURE;
  const [state, setState] = useState(() => loadState(adventure));
  const [cast, setCast] = useState([]); // postacie obecne na scenie
  const [busy, setBusy] = useState(false);
  const hydrated = useRef(false);

  /* Jednorazowa synchronizacja z serwerem — nigdy nie blokuje startu. */
  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    adoptAnonState();
    let alive = true;
    hydrateFromApi(state).then((merged) => {
      if (alive && merged !== state) setState(merged);
    });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scene = state.sceneId ? adventure.scenes[state.sceneId] : null;
  const location = scene ? adventure.locations[scene.location] : adventure.locations[state.location];

  /* Nastrój muzyczny przy wejściu do sceny.
     UWAGA: efekt odpala się także przy PIERWSZYM renderze, więc każdy
     komponent, który wywoła ten hook, przestawia muzykę tłem samym swoim
     zamontowaniem. Przez to otwarcie profilu albo minigier w hubie zrywało
     utwór i wracało do „Mindful Forest Path" od zera. Ekrany, które używają
     hooka wyłącznie jako źródła danych, biorą `useAdventureDane` i tego
     efektu nie uruchamiają. */
  useEffect(() => {
    if (!dzwiek) return;
    if (scene?.mood) setMood(scene.mood);
    if (scene) cue.sceneEnter();
    setCast([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.sceneId, dzwiek]);

  const persist = useCallback((updater) => {
    setState((prev) => {
      const next = typeof updater === "function" ? updater(prev) : { ...prev, ...updater };
      return saveState(next);
    });
  }, []);

  /* Przewijanie kroków będących instrukcją sceniczną. */
  const resolveSideEffects = useCallback(
    (sc, idx, draft) => {
      let i = idx;
      const next = { ...draft };
      while (sc && sc.steps[i] && SIDE_EFFECT_STEPS.has(sc.steps[i].kind)) {
        const step = sc.steps[i];
        if (step.kind === "enter") {
          setCast((c) => (c.includes(step.who) ? c : [...c, step.who]));
        }
        if (step.kind === "unlock" && step.location && !next.unlocked.includes(step.location)) {
          next.unlocked = [...next.unlocked, step.location];
          const loc = adventure.locations[step.location];
          notify({
            id: `map-${step.location}`,
            kind: "map_ready",
            title: "Świat się rozjaśnił",
            body: `${loc?.name || "Nowa kraina"} czeka na ciebie.`,
            // Bez celu: ta wieść dzieje się w świecie, po którym dziecko
            // wlasnie chodzi. Przycisk "zobacz" prowadzilby tam, gdzie juz jest.
            to: null,
          });
        }
        i += 1;
      }
      next.stepIdx = i;
      return next;
    },
    [adventure]
  );

  /* Ustawienie kroku startowego sceny (rozwija instrukcje sceniczne od razu). */
  useEffect(() => {
    if (!scene) return;
    const step = scene.steps[state.stepIdx];
    if (step && SIDE_EFFECT_STEPS.has(step.kind)) {
      persist((prev) => resolveSideEffects(scene, prev.stepIdx, prev));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.sceneId, state.stepIdx, scene]);

  const step = scene ? scene.steps[state.stepIdx] : null;

  /** Następny krok. Bez opóźnień, bez czekania na dźwięk. */
  const advance = useCallback(() => {
    if (!scene) return;
    cue.advance();
    persist((prev) => {
      const draft = { ...prev };
      return resolveSideEffects(scene, prev.stepIdx + 1, draft);
    });
  }, [scene, persist, resolveSideEffects]);

  /** Wybór dziecka: cechy, przedmiot, kolor, reakcja świata. */
  const choose = useCallback(
    (option) => {
      if (!scene || !option) return;
      cue.pick();
      if (option.grant) setTimeout(() => cue.discover(), 260);
      persist((prev) => {
        const traits = { ...prev.traits };
        for (const [k, v] of Object.entries(option.traits || {})) {
          traits[k] = (traits[k] || 0) + v;
        }
        const grants = option.grant && !prev.grants.includes(option.grant)
          ? [...prev.grants, option.grant]
          : prev.grants;
        const draft = {
          ...prev,
          traits,
          grants,
          colorId: option.color ? option.id : prev.colorId,
          color: option.color || prev.color,
          lastReaction: option.reaction || null,
        };
        return resolveSideEffects(scene, prev.stepIdx + 1, draft);
      });
    },
    [scene, persist, resolveSideEffects]
  );

  /** Koniec sceny → mapa. Zapisuje scenę jako przejętą. */
  const finishScene = useCallback(() => {
    persist((prev) => ({
      ...prev,
      doneScenes: prev.doneScenes.includes(prev.sceneId)
        ? prev.doneScenes
        : [...prev.doneScenes, prev.sceneId],
      sceneId: null,
      stepIdx: 0,
      lastReaction: null,
    }));
  }, [persist]);

  /** Wejście w scenę (z mapy albo z innej sceny). */
  const goToScene = useCallback(
    (sceneId) => {
      const sc = adventure.scenes[sceneId];
      if (!sc) return;
      cue.travel();
      persist((prev) => {
        const draft = { ...prev, sceneId, stepIdx: 0, location: sc.location, lastReaction: null };
        return resolveSideEffects(sc, 0, draft);
      });
    },
    [adventure, persist, resolveSideEffects]
  );

  /* ── Misja ─────────────────────────────────────────────────────────── */

  const missionDef = step?.kind === "mission" ? adventure.missions[step.missionRef] : null;

  /** Tworzy misję w istniejącym pipeline misji. Offline działa lokalnie. */
  const acceptMission = useCallback(
    async (ref) => {
      const def = adventure.missions[ref];
      if (!def) return;
      setBusy(true);
      let missionId = null;
      try {
        const pid = session.getPlayer();
        if (pid) {
          const created = await api.seedMission(pid, {
            title: def.title,
            body: `${def.goal} ${def.how}`,
            narrative_intro: def.world,
            competency_focus: def.competency_focus,
            proof_type: def.proofTypes?.[0] || "text",
            estimated_minutes: def.minutes || 10,
            adventure_ref: ref,
          });
          missionId = created?.mission_id || created?.id || null;
        }
      } catch {
        // Brak sieci lub brak konta — misja żyje lokalnie, dziecko idzie dalej.
      }
      persist((prev) => ({
        ...prev,
        activeMission: { ref, missionId, status: "offered", offeredAt: new Date().toISOString() },
      }));
      setBusy(false);
    },
    [adventure, persist]
  );

  /** Dziecko oddaje dowód. */
  const submitProof = useCallback(
    async (proof) => {
      setBusy(true);
      cue.sent();
      const mission = state.activeMission;
      try {
        if (mission?.missionId) {
          await api.submitMissionProof(mission.missionId, {
            proof_text: proof.text || "",
            proof_media_url: proof.mediaUrl || null,
          });
        }
      } catch {
        // Dowód zostaje lokalnie i pójdzie przy następnej okazji.
      }
      persist((prev) => ({
        ...prev,
        activeMission: {
          ...(prev.activeMission || {}),
          status: "sent",
          sentAt: new Date().toISOString(),
          proof,
        },
      }));
      setBusy(false);
    },
    [state.activeMission, persist]
  );

  /** Sprawdza, czy Mentor już zdecydował. Cicho, bez spinnerów.
   *
   * Pobieramy misję po ID, nie przez /missions/current — ta druga celowo pomija
   * status 'verified', więc zaakceptowana misja z niej znika. W projekcie żyją
   * dwa słowniki werdyktów (panel mentora: verified/rejected, starszy panel GM:
   * highlighted/needs_followup), więc rozpoznajemy oba.
   */
  const ACCEPTED = new Set(["verified", "highlighted"]);
  const CHANGES = new Set(["rejected", "needs_followup"]);

  const checkMentorDecision = useCallback(async () => {
    const mission = state.activeMission;
    if (!mission || mission.status !== "sent" || !mission.missionId) return null;
    try {
      const current = await api.getMissionById(mission.missionId);
      const status = current?.status;
      if (ACCEPTED.has(status)) {
        notify({
          id: `mentor-${mission.missionId}`,
          kind: "mentor_accepted",
          title: "Mentor zobaczył twój dowód",
          body: "Iskra jest gotowa, żeby wrócić na mapę.",
          to: "/przygoda/nagroda",
        });
        persist((prev) => ({ ...prev, activeMission: { ...prev.activeMission, status: "accepted" } }));
        return "accepted";
      }
      if (CHANGES.has(status)) {
        const note =
          current?.gm_verification?.comment_text || current?.gm_verification?.comment || null;
        persist((prev) => ({ ...prev, activeMission: { ...prev.activeMission, status: "changes", note } }));
        return "changes";
      }
    } catch {
      // Brak sieci — dziecko po prostu sprawdzi później. Nic się nie psuje.
    }
    return null;
  }, [state.activeMission, persist]);

  /** Nagroda po akceptacji: Iskra, przedmiot, odblokowanie kolejnej ścieżki. */
  const collectMissionReward = useCallback(() => {
    const mission = state.activeMission;
    const def = mission ? adventure.missions[mission.ref] : null;
    if (!def) return;
    cue.success();
    persist((prev) => {
      const reward = def.reward || {};
      const iskry = reward.iskra && !prev.iskry.includes(reward.iskra)
        ? [...prev.iskry, reward.iskra]
        : prev.iskry;
      const grants = reward.grant && !prev.grants.includes(reward.grant)
        ? [...prev.grants, reward.grant]
        : prev.grants;
      return { ...prev, iskry, grants, activeMission: null };
    });
  }, [state.activeMission, adventure, persist]);

  /** Dziecko poprawia misję po prośbie Mentora. */
  const reopenMission = useCallback(() => {
    persist((prev) => ({
      ...prev,
      activeMission: { ...(prev.activeMission || {}), status: "offered", note: prev.activeMission?.note },
    }));
  }, [persist]);

  /* ── Profil ────────────────────────────────────────────────────────── */

  /** Po pierwszej scenie zapisuje profil w istniejącym systemie cech. */
  const commitProfile = useCallback(async (name) => {
    const legacy = toLegacyScores(state.traits);
    try {
      let pid = session.getPlayer();
      if (!pid && name) {
        const created = await api.createPlayer(name);
        pid = created.player_id;
        session.setPlayer(pid);
        adoptAnonState();
      }
      if (pid) await api.applyAdventureProfile(pid, { scores: legacy, name: name || undefined });
    } catch {
      // Profil zostaje lokalnie; przygoda toczy się dalej.
    }
  }, [state.traits]);

  /* ── Mapa ──────────────────────────────────────────────────────────── */

  /** Jeden jasny następny krok — mapa nigdy nie zostawia dziecka bez odpowiedzi. */
  const nextStep = useMemo(() => {
    if (state.activeMission?.status === "sent") {
      return { kind: "waiting", label: "Opiekun czeka na Mentora", to: "/przygoda/czekam" };
    }
    if (state.activeMission?.status === "accepted") {
      return { kind: "reward", label: "Iskra wraca", to: "/przygoda/nagroda" };
    }
    if (state.activeMission?.status === "offered" || state.activeMission?.status === "changes") {
      return { kind: "mission", label: "Dokończ zadanie", to: "/przygoda/zadanie" };
    }
    if (!state.doneScenes.includes("przystan.przybycie")) {
      return { kind: "scene", label: "Wejdź do Przystani", sceneId: "przystan.przybycie" };
    }
    if (!state.doneScenes.includes("las.przybycie")) {
      return { kind: "scene", label: "Idź do Lasu Szeptów", sceneId: "las.przybycie", location: "las-szeptow" };
    }
    if (state.iskry.includes("iskra-lasu") && !state.doneScenes.includes("dolina.zapowiedz")) {
      return { kind: "scene", label: "Zajrzyj do Doliny Dźwięków", sceneId: "dolina.zapowiedz", location: "dolina-dzwiekow" };
    }
    return { kind: "rest", label: "Odpocznij przy Przystani", to: "/swiat" };
  }, [state]);

  const reset = useCallback(() => {
    setState(saveState(emptyState(adventure)));
  }, [adventure]);

  return {
    adventure,
    state,
    scene,
    step,
    cast,
    location,
    busy,
    missionDef,
    nextStep,
    advance,
    choose,
    finishScene,
    goToScene,
    acceptMission,
    submitProof,
    checkMentorDecision,
    collectMissionReward,
    reopenMission,
    commitProfile,
    reset,
  };
}
