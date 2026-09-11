/**
 * app.js — rdzeń sceny: renderer, kamera, bohater, sterowanie, znaki, kino.
 *
 * KULA. Świat (`this.swiat`) to grupa obracana kwaternionem tak, żeby punkt
 * mapy, w którym stoi bohater, znalazł się u góry (+Y świata). Obrót goni
 * bohatera z opóźnieniem (`TEMPO_OBROTU`), więc lisek ma „mały margines"
 * własnego ruchu po ekranie, a planeta dogania go płynnie. Kamera jest
 * NIERUCHOMA (ortograficzna, izometryczna), patrzy na wierzchołek kuli.
 *
 * Cała logika pozycji — `this.hp` (x, z), kolizje, ścieżka, rzeka, znaki —
 * liczy się w PŁASKIM układzie mapy. Na kulę przenosi ją `Planeta`.
 */
import {
  WebGLRenderer, Scene, Color, HemisphereLight, DirectionalLight, AmbientLight, OrthographicCamera,
  Vector2, Vector3, Quaternion, Matrix4, Group, Mesh, RingGeometry, MeshBasicMaterial, DoubleSide,
  Raycaster, Clock, AnimationMixer, AnimationUtils, LoopOnce, Box3, CanvasTexture, SRGBColorSpace,
  EquirectangularReflectionMapping, PMREMGenerator, SphereGeometry, CylinderGeometry, BackSide,
  ACESFilmicToneMapping, Points, PointsMaterial, BufferGeometry, Float32BufferAttribute,
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Planeta, stycznaDo, doStycznej, obrocStyczna, katMiedzy, przytnijDoPromienia } from "./planeta.js";
import { wczytajMape } from "./mapa.js";
import { zbudujSwiat, sosna, drzewoLisciaste, plamaCienia, PALETA } from "./swiat.js";
import { Znak } from "./znak.js";
import { postac } from "./postacie.js";

const DOTYK = typeof matchMedia !== "undefined" && matchMedia("(pointer:coarse)").matches;

/* ── stałe ruchu (jak w pierwotnej scenie) ──────────────────────────────────── */
const SKALA_BOHATERA = 1.75;
const V_CHOD = 1.38;
const V_BIEG = 3.42;
const KLIP_CHOD = "walk";
const KLIP_BIEG = "run";
let trybBiegu = "clip";
const PROG_BIEG_WEJSCIE = 1.46;
const PROG_BIEG_WYJSCIE = 1.37;
const MAX_TEMPO_KLIPU = 2.6;
const POCHYLENIE_MAX = 0.13;
const POCHYLENIE_BIEG = -0.375;
const OS_POCHYLENIA = 0.55;
const MARTWA_STREFA = 0.14;
const PROG_TRZYMANIA = 0.45;
const CZAS_DO_BIEGU = 1.6;
const CZAS_ROZBIEGU = 1.25;
const KAT_ZMIANY_KIERUNKU = 1.7;
const MARGINES_KOLIZJI = 0.3;
const TINT_BOHATERA = 1.62;
const SELF_BOHATERA = 0.06;
const ENV_BOHATERA = 0.42;
const MOST_LUK = 0.3;
const MOST_POL_SZER = 1;
const MOST_PLASKI = 1.3;
const MOST_POL_DL = 2.1;
const DL_KROKU_CHOD = 0.517 * SKALA_BOHATERA;
const DL_KROKU_BIEG = 1.33 * SKALA_BOHATERA;
const KOSCI_KORZENIA = new Set(["Root", "Hip", "Pelvis"]);
const KLAWISZE = {
  ArrowUp: [0, 1], KeyW: [0, 1], ArrowDown: [0, -1], KeyS: [0, -1],
  ArrowLeft: [-1, 0], KeyA: [-1, 0], ArrowRight: [1, 0], KeyD: [1, 0],
};
const MAPA_KLIPOW_DOMYSLNA = { NlaTrack: "walk", "NlaTrack.001": "run", "NlaTrack.002": "idle", "NlaTrack.003": "happy" };

/** Tempo, z jakim planeta dogania bohatera (im mniej, tym większy margines ruchu). */
const TEMPO_OBROTU = 3.2;
/** Tempo dokręcania mapy „północą do góry" (patrz `korektaPolnocy`). */
const KOREKTA_W_RUCHU = 0.45;
const KOREKTA_W_SPOCZYNKU = 1.1;
/** Domyślne przybliżenie kamery (1 = kadr pierwotnej sceny; mniej = dalej). */
const ZOOM_DOMYSLNY = 0.8;
/** Punkt, na który patrzy kamera, względem wierzchołka kuli (jednostki mapy).
 *  Dodatnie = kamera patrzy wyżej, więc planeta zjeżdża w dół ekranu;
 *  ujemne = planeta idzie do góry. -2: cała kula w kadrze, lisek trochę
 *  powyżej środka, dół planety tuż nad paskiem HUD. */
const KAMERA_PODNIESIENIE = -2;

const clamp = (s, e, t) => Math.max(e, Math.min(t, s));
const dogon = (s, e, t, n) => s + (e - s) * (1 - Math.exp(-t * n));

/** Usuwa dryf korzenia z klipu (animacja „w miejscu"). */
function usunDryf(klip, prog = 0.1) {
  const raport = [];
  for (const n of klip.tracks) {
    if (!n.name.endsWith(".position") || !KOSCI_KORZENIA.has(n.name.split(".")[0])) continue;
    const i = n.times.length;
    if (i < 2) continue;
    const r = n.times[0];
    const a = n.times[i - 1] - r || 1;
    for (let o = 0; o < 3; o++) {
      const l = n.values[(i - 1) * 3 + o] - n.values[o];
      if (Math.abs(l) < prog) continue;
      for (let c = 0; c < i; c++) n.values[c * 3 + o] -= l * ((n.times[c] - r) / a);
      raport.push(`${n.name}[${"xyz"[o]}]=${l.toFixed(2)}`);
    }
  }
  return raport;
}

/** Domyka pętlę klipu — koniec dogina się do początku. */
function domknijPetle(klip, e = 0.3) {
  const t = (n) => n * n * (3 - 2 * n);
  for (const n of klip.tracks) {
    const i = n.times.length;
    if (i < 4) continue;
    const r = n.name.endsWith(".quaternion");
    const a = r ? 4 : n.values.length / i;
    const o = n.values.slice(0, a);
    const l = n.values.slice((i - 1) * a);
    let c = 0;
    for (let u = 0; u < a; u++) c += (o[u] - l[u]) ** 2;
    if (Math.sqrt(c) < 1e-4) continue;
    const h = Math.max(1, Math.floor(i * (1 - e)));
    if (r) {
      const u = new Quaternion(o[0], o[1], o[2], o[3]);
      const d = new Quaternion(l[0], l[1], l[2], l[3]);
      const f = u.clone().multiply(d.clone().invert());
      const m = new Quaternion(), y = new Quaternion(), g = new Quaternion();
      for (let p = h; p < i; p++) {
        const S = t((p - h) / (i - 1 - h));
        y.copy(m).slerp(f, S);
        g.fromArray(n.values, p * 4).premultiply(y).normalize();
        g.toArray(n.values, p * 4);
      }
    } else
      for (let u = h; u < i; u++) {
        const d = t((u - h) / (i - 1 - h));
        for (let f = 0; f < a; f++) n.values[u * a + f] += (o[f] - l[f]) * d;
      }
  }
  return klip;
}

let spokojnyRuch = globalThis.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

/** Gwiazdy w tle — tylko za planetą, żeby nie migały przed nią. */
function gwiazdy(kamera) {
  const N = 700;
  const poz = [];
  const kier = kamera.clone().normalize();
  let o = 7;
  const los = () => (o = (o * 16807) % 2147483647) / 2147483647;
  while (poz.length < N * 3) {
    const v = new Vector3(los() * 2 - 1, los() * 2 - 1, los() * 2 - 1);
    if (v.lengthSq() > 1 || v.lengthSq() < 0.05) continue;
    v.normalize();
    if (v.dot(kier) > -0.15) continue;
    v.multiplyScalar(70 + los() * 20);
    poz.push(v.x, v.y, v.z);
  }
  const g = new BufferGeometry();
  g.setAttribute("position", new Float32BufferAttribute(poz, 3));
  const p = new Points(g, new PointsMaterial({ color: 0xfff2cf, size: 2.2, sizeAttenuation: false, transparent: true, opacity: 0.85 }));
  p.frustumCulled = false;
  return p;
}

export class Aplikacja {
  constructor(host, opts = {}) {
    this.host = host;
    this.opts = opts;
    this.listeners = new Map();
    this.destroyed = false;
    this.paused = false;
    if (typeof opts.spokojnyRuch === "boolean") spokojnyRuch = opts.spokojnyRuch;

    this.mapa = wczytajMape();
    this.planeta = new Planeta(this.mapa.promienKuli);

    this.canvas = this.$("canvas");
    this.renderer = new WebGLRenderer({ canvas: this.canvas, antialias: !DOTYK });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio || 1, DOTYK ? 1.5 : 2));
    this.renderer.outputColorSpace = SRGBColorSpace;
    this.renderer.toneMapping = ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;

    this.scene = new Scene();
    this.scene.background = new Color(PALETA.night);
    this.scene.add(new HemisphereLight(14214399, 5600831, 1.05));
    const slonce = new DirectionalLight(16769200, 1.6);
    slonce.position.set(-6, 12, 4);
    this.scene.add(slonce);
    this.scene.add(new AmbientLight(8425664, 0.35));
    const wypelnienie = new DirectionalLight(16773855, 0.85);
    wypelnienie.position.set(5, 7, 9);
    this.scene.add(wypelnienie);

    this.camera = new OrthographicCamera(-1, 1, 1, -1, 0.1, 160);
    this.camDir = new Vector3(4.2, 11.5, 8).normalize().multiplyScalar(26);
    // Kamera patrzy na wierzchołek kuli — tam planeta „przynosi" bohatera.
    this.camTarget = new Vector3(0, this.planeta.R + (Number(globalThis.SCENA3D_KAMERA_PODNIESIENIE) || KAMERA_PODNIESIENIE), 0);
    this.camPos = new Vector3();
    this.scene.add(gwiazdy(this.camDir));

    const sw = zbudujSwiat(this.mapa, this.planeta);
    this.swiat = sw.group;
    this.ziemia = sw.ziemia;
    this.scene.add(this.swiat);
    this.lantern = sw.lantern;
    this.blockers = sw.blockers;
    this.kwiaty = sw.kwiaty;
    this.nurtTik = sw.nurtTik;

    // Most w układzie MAPY (do wysokości terenu i „czy stoję na moście").
    const mostQ = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), sw.obrotMostu);
    this.bridgeInv = new Matrix4().compose(new Vector3(this.mapa.most.pos[0], 0, this.mapa.most.pos[1]), mostQ, new Vector3(1, 1, 1)).invert();

    this.groundY = 0;
    this.footOffset = 0;

    // znacznik celu dotknięcia
    this.marker = new Mesh(new RingGeometry(0.28, 0.4, 24), new MeshBasicMaterial({ color: 16773839, transparent: true, opacity: 0, side: DoubleSide }));
    this.marker.rotation.x = -Math.PI / 2;
    this.marker.position.y = 0.05;
    this.markerKotwica = new Group();
    this.markerKotwica.add(this.marker);
    this.swiat.add(this.markerKotwica);
    this.markerPulse = 0;

    this.sparkles = [];
    this.sparkleGrupa = new Group();
    this.planeta.ustaw(this.sparkleGrupa, this.mapa.latarnia.pos.x, this.mapa.latarnia.pos.z, 0, 0);
    this.swiat.add(this.sparkleGrupa);

    // Stan bohatera NA SFERZE: normalna (punkt kuli) i styczna (przód).
    // `hp` to pochodne współrzędne mapy — do znaków, ścieżki, mostu i API.
    this.hn = new Vector3(0, 1, 0);
    this.hf = new Vector3(0, 0, 1);
    this.hp = { x: 0, z: 0 };
    this.heroLift = 0;
    this.obrotCel = new Quaternion();
    this._qTmp = new Quaternion();
    this._v1 = new Vector3();
    this._v2 = new Vector3();
    this._v3 = new Vector3();
    // rzeka i latarnia jako punkty na kuli (kolizja liczona w 3D — działa też na antypodzie)
    this.rzeka3d = przytnijDoPromienia(this.mapa.rzeka.punkty, this.mapa.promienTresci).map((k) => k.map((p) => this.planeta.naKule(p.x, p.y, 0)));
    this.latarniaN = this.planeta.normalna(this.mapa.latarnia.pos.x, this.mapa.latarnia.pos.z);
    this.ograniczenieMapy = !!this.mapa.surowa?.swiat?.tylkoMapa; // domyślnie: cała planeta jest do obejścia
    this.heroT = 0;
    this.targetT = 0;
    this.walking = false;
    this.celebrated = false;
    this.sequence = null;
    this.seqTimer = 0;
    this.mode = "goto";
    this.input = new Vector2(0, 0);
    this.keys = new Set();
    this.stick = null;
    this.inputSource = null;
    this.holdTime = 0;
    this.holdDir = null;
    this.running = false;
    this.idleAtLantern = 0;
    this.camRight = new Vector3();
    this.camFwd = new Vector3();
    this.raycaster = new Raycaster();
    this.clock = new Clock();

    // ścieżka
    const Ct = this.mapa.sciezka;
    this.odcinki = [];
    this.dlSciezki = 0;
    for (let s = 0; s < Ct.length - 1; s++) {
      const e = Ct[s].distanceTo(Ct[s + 1]);
      this.odcinki.push(e);
      this.dlSciezki += e;
    }
    this.tLatarni = 0;
    for (let e = 0; e < this.mapa.latarnia.punktSciezki && e < this.odcinki.length; e++) this.tLatarni += this.odcinki[e];

    this.gotowa = this.loadHero()
      .then(() => this.loadMarkers())
      .then(() => this.loadBudynki())
      .then(() => {
        if (this.destroyed) return;
        this.$(".scena3d-loading")?.remove();
        this.bindUI();
        this.placeHero(0, true);
        this.updateCameraBasis();
        if (this.opts.autostart !== false) this.renderer.setAnimationLoop(() => this.tick());
        this.emit("gotowa", { klipy: Object.keys(this.actions) });
        this._kinoWejscie();
      })
      .catch((a) => {
        this.emit("blad", { komunikat: String(a?.message || a) });
        throw a;
      });
    this.onWinResize = () => this.resize();
    addEventListener("resize", this.onWinResize);
    if (globalThis.ResizeObserver) {
      this.ro = new ResizeObserver(() => this.resize());
      this.ro.observe(this.host);
    }
    this.resize();
  }

  $(e) { return this.host.querySelector(e); }
  $$(e) { return this.host.querySelectorAll(e); }

  emit(e, t = {}) {
    const n = { nazwa: e, ...t };
    try { this.opts.onEvent?.(e, n); } catch (i) { console.warn("onEvent", i); }
    for (const i of this.listeners.get(e) || []) try { i(n); } catch (r) { console.warn("listener " + e, r); }
    for (const i of this.listeners.get("*") || []) try { i(n); } catch (r) { console.warn("listener *", r); }
    this.host.dispatchEvent(new CustomEvent("scena3d:" + e, { detail: n, bubbles: true }));
  }
  on(e, t) {
    if (!this.listeners.has(e)) this.listeners.set(e, new Set());
    this.listeners.get(e).add(t);
    return () => this.off(e, t);
  }
  off(e, t) { this.listeners.get(e)?.delete(t); }

  /* ── ścieżka (układ mapy) ─────────────────────────────────────────────────── */

  punktSciezki(s, e = new Vector3()) {
    const Ct = this.mapa.sciezka;
    s = clamp(s, 0, this.dlSciezki);
    let t = 0;
    for (let n = 0; n < this.odcinki.length; n++) {
      if (s <= t + this.odcinki[n]) return e.lerpVectors(Ct[n], Ct[n + 1], (s - t) / this.odcinki[n]);
      t += this.odcinki[n];
    }
    return e.copy(Ct[Ct.length - 1]);
  }

  najblizszyPunktSciezki(p) {
    const Ct = this.mapa.sciezka;
    let e = 0, t = Infinity, n = 0;
    const i = new Vector3(), r = new Vector3(), a = new Vector3();
    for (let o = 0; o < this.odcinki.length; o++) {
      i.copy(Ct[o]);
      r.subVectors(Ct[o + 1], Ct[o]);
      a.subVectors(p, i);
      const l = clamp(a.dot(r) / r.lengthSq(), 0, 1);
      const c = a.addScaledVector(r, -l).lengthSq();
      if (c < t) { t = c; e = n + l * this.odcinki[o]; }
      n += this.odcinki[o];
    }
    return { t: e, dist: Math.sqrt(t) };
  }

  /* ── wczytywanie ──────────────────────────────────────────────────────────── */

  loadGLB(e) {
    // ZNAK-PROG: próg domu to sam blask na ziemi — pusta grupa zamiast modelu.
    if (e === "prog") return Promise.resolve({ scene: new Group(), animations: [] });
    // ZNAK-DRZEWO: drzewa są proceduralne, więc znak-drzewo dostaje sosnę z generatora.
    if (e === "drzewo" || e === "drzewo-lisciaste") {
      const g = new Group();
      const d = (e === "drzewo-lisciaste" ? drzewoLisciaste : sosna)(1);
      d.scale.set(0.84, 1.26, 0.84);
      g.add(d);
      return Promise.resolve({ scene: g, animations: [] });
    }
    const loader = new GLTFLoader();
    const b64 = globalThis.__GLB_ASSETS?.[e] || (e === "adventurer" ? globalThis.__HERO_GLB_B64 : null);
    return new Promise((res, rej) => {
      if (b64) {
        const a = atob(b64);
        const o = new Uint8Array(a.length);
        for (let l = 0; l < a.length; l++) o[l] = a.charCodeAt(l);
        loader.parse(o.buffer, "", res, rej);
      } else loader.load(`${this.opts.zasoby ?? "./assets/"}${e}.glb`, res, undefined, rej);
    });
  }

  miejsceWolne(x, z, m, pomin, w) {
    if (!this.canWalk(x, z)) return false;
    for (let k = 0; k < 8; k++) {
      const a = (k / 8) * Math.PI * 2;
      if (!this.canWalk(x + Math.cos(a) * m, z + Math.sin(a) * m)) return false;
    }
    for (const q of w || []) {
      const d = q && q.e;
      if (!d || d.id === pomin || !d.pos) continue;
      if (Math.hypot(x - d.pos[0], z - d.pos[1]) < m) return false;
    }
    return true;
  }

  wolneMiejsca(e, w) {
    const baza = (p) => [p[0], this.groundHeightAt(p[0], p[1]), p[1]];
    for (const m of [e.margines ?? 1.6, 1, 0.6]) {
      const ok = e.pozycje.filter((p) => this.miejsceWolne(p[0], p[1], m, e.id, w));
      if (ok.length) return ok.map(baza);
    }
    return e.pozycje.map(baza);
  }

  async loadMarkers() {
    this.markers = [];
    const w = await Promise.all(
      this.mapa.znaki.map((e) =>
        this.loadGLB(e.file).then((t) => ({ e, t })).catch((t) => (console.warn("Nie udalo sie wczytac znaku", e.id, t), null)),
      ),
    );
    for (const x of w) {
      if (!x) continue;
      const { e, t } = x;
      if (e.pozycje) e._pozycje = this.wolneMiejsca(e, w);
      const n = this.groundHeightAt(e.pos[0], e.pos[1]);
      const i = new Znak(e, t.scene, n, this.planeta);
      if (e.animuj && t.animations && t.animations.length) {
        i.mixer = new AnimationMixer(t.scene);
        i.mixer.clipAction(t.animations[0]).play();
      }
      this.swiat.add(i.root);
      this.markers.push(i);
    }
  }

  async loadBudynki() {
    for (const e of this.mapa.budynki) {
      try {
        const t = await this.loadGLB(e.file);
        const n = t.scene;
        const box = new Box3().setFromObject(n);
        const r = new Vector3();
        box.getSize(r);
        n.scale.setScalar((e.wysokosc ?? 2.4) / Math.max(0.001, r.y));
        box.setFromObject(n);
        const o = box.getCenter(new Vector3());
        const kotwica = new Group();
        this.planeta.ustaw(kotwica, e.pos[0], e.pos[1], 0, 0);
        n.position.set(-o.x, this.groundHeightAt(e.pos[0], e.pos[1]) - box.min.y, -o.z);
        n.rotation.y = e.obrot ?? 0;
        if (e.jasnosc)
          n.traverse((c) => {
            const l = c.material ? (Array.isArray(c.material) ? c.material : [c.material]) : [];
            for (const h of l) if (h.color) { h.color.multiplyScalar(e.jasnosc); h.needsUpdate = true; }
          });
        kotwica.add(n);
        this.swiat.add(kotwica);
        // MROK WE WNĘTRZU: walec BackSide, przez drzwi widać ciemną ścianę w głębi.
        if (e.ciemnosc) {
          const cr = e.mrokPromien ?? (e.promien ?? 1.4) * 0.28;
          const ch = e.mrokWysokosc ?? (e.wysokosc ?? 4) * 0.46;
          const cm = new Mesh(new CylinderGeometry(cr, cr, ch, 24, 1, false), new MeshBasicMaterial({ color: e.mrokBarwa ?? 1511432, transparent: true, opacity: typeof e.ciemnosc === "number" ? e.ciemnosc : 0.86, side: BackSide, depthWrite: false }));
          const mx = e.mrokPos ? e.mrokPos[0] : e.pos[0];
          const mz = e.mrokPos ? e.mrokPos[1] : e.pos[1];
          this.planeta.ustaw(cm, mx, mz, this.groundHeightAt(mx, mz) + (e.mrokY ?? 0.02) + ch / 2, 0);
          cm.renderOrder = -1;
          cm.name = "mrok-" + (e.file || "budynek");
          this.swiat.add(cm);
        }
        // DOM Z DRZWIAMI: wieniec małych kół kolizji z wyrwą na bramę.
        if (e.drzwiKat != null) {
          const r2 = e.promien ?? 1.4, sz = e.drzwiSzer ?? 0.9, n2 = 14, kr = ((Math.PI * r2) / n2) * 1.15;
          for (let i = 0; i < n2; i++) {
            const a = (i / n2) * Math.PI * 2;
            const d = Math.atan2(Math.sin(a - e.drzwiKat), Math.cos(a - e.drzwiKat));
            if (Math.abs(d) < sz / 2) continue;
            this.blockers.push({ x: e.pos[0] + Math.sin(a) * r2, z: e.pos[1] + Math.cos(a) * r2, r: kr });
          }
        } else this.blockers.push({ x: e.pos[0], z: e.pos[1], r: e.promien ?? 1.4 });
      } catch (t) {
        console.warn("Nie udalo sie wczytac budynku", e.file, t);
      }
    }
  }

  async loadHero() {
    const P = postac();
    const e = await this.loadGLB(P.plik || "adventurer");
    const t = e.scene;
    t.traverse((o) => {
      if (o.isSkinnedMesh) { this.skinned = o; o.frustumCulled = false; }
    });
    if (!this.skinned) throw new Error("Brak SkinnedMesh w GLB — rig nie został wczytany");
    this.tilt = new Group();
    this.tilt.position.y = OS_POCHYLENIA;
    t.position.y = -OS_POCHYLENIA;
    this.tilt.add(t);
    this.hero = new Group();
    this.hero.add(this.tilt);
    this.model = t;
    const env = this.makeHeroEnv();
    t.traverse((o) => {
      const l = o.material ? (Array.isArray(o.material) ? o.material : [o.material]) : [];
      for (const c of l) {
        c.metalness = 0;
        c.metalnessMap = null;
        c.roughnessMap = null;
        c.roughness = 0.85;
        if (c.normalScale) c.normalScale.setScalar(0.55);
        c.color.setScalar(P.wyglad?.tint ?? TINT_BOHATERA);
        if (c.map) {
          c.emissiveMap = c.map;
          c.emissive.setScalar(1);
          c.emissiveIntensity = P.wyglad?.self ?? SELF_BOHATERA;
        }
        c.envMap = env;
        c.envMapIntensity = P.wyglad?.env ?? ENV_BOHATERA;
        c.needsUpdate = true;
      }
    });
    this.hero.scale.setScalar(SKALA_BOHATERA);

    // Cień: MultiplyBlending przyciemnia teren zamiast go zakrywać (dawna
    // poprawka z Reacta `dopracujCienBohatera` — teraz u źródła).
    const cienGrupa = plamaCienia(1.3, 0.62, 0.34, true);
    this.heroShadow = cienGrupa.userData.plama;
    this.heroShadow.geometry.scale(0.7, 0.7, 1);
    this.heroShadow.renderOrder = 2;
    this.heroShadow.userData.dopracowany = true;
    this.heroShadowKotwica = cienGrupa;
    this.swiat.add(cienGrupa);

    const klipy = {};
    const raport = [];
    for (const o of e.animations) {
      const l = (P.klipy || MAPA_KLIPOW_DOMYSLNA)[o.name] || o.name;
      o.name = l;
      raport.push(...usunDryf(o).map((c) => `${l}: ${c}`));
      if (l === "walk" || l === "run" || l === "idle") domknijPetle(o);
      klipy[l] = o;
    }
    this.clipReport = raport;
    if (klipy.walk && !klipy.turn) klipy.turn = AnimationUtils.subclip(klipy.walk, "turn", 0, 13, 24);
    this.mixer = new AnimationMixer(this.model);
    this.actions = {};
    for (const [o, l] of Object.entries(klipy)) {
      const c = this.mixer.clipAction(l);
      if (o === "turn" || o === "happy") { c.setLoop(LoopOnce); c.clampWhenFinished = true; }
      this.actions[o] = c;
    }
    if (this.actions.walk) this.actions.walk.timeScale = (V_CHOD / DL_KROKU_CHOD) * (P.tempo?.walk ?? 1);
    if (this.actions.run) this.actions.run.timeScale = (V_BIEG / DL_KROKU_BIEG) * (P.tempo?.run ?? 1);
    const a = this.alignRunToWalk();
    if (a) raport.push(`run→walk: obrót ${a.obrotPionowy}°, środek ${JSON.stringify(a.srodekSwiat)}`);
    this.calibrateFeet();
    this.current = null;
    this.play("idle");
    // Dopiero po kalibracji (liczonej w układzie własnym) bohater trafia na kulę.
    this.swiat.add(this.hero);
    this.debugAPI(e);
  }

  debugAPI(e) {
    globalThis.__POC = {
      app: this,
      bones: this.skinned.skeleton.bones.length,
      clips: e.animations.map((o) => o.name),
      isSkinned: true,
      setInput: (o, l) => { this.enterFreeMode(); this.input.set(o, l); this.inputSource = "api"; },
      pos: () => [+this.hp.x.toFixed(2), +this.heroLift.toFixed(2), +this.hp.z.toFixed(2)],
      clipReport: this.clipReport,
      clipY: () => this.clipY,
      setHeroLook: ({ tint: o, self: l, env: c }) => {
        this.hero.traverse((h) => {
          const u = h.material ? (Array.isArray(h.material) ? h.material : [h.material]) : [];
          for (const d of u) {
            if (o != null) d.color.setScalar(o);
            if (l != null) d.emissiveIntensity = l;
            if (c != null) d.envMapIntensity = c;
            d.needsUpdate = true;
          }
        });
        this.renderer.render(this.scene, this.camera);
      },
      leanDip: () => +(this.leanDip || 0).toFixed(4),
      setLean: (o) => { this.lean = o; this.tilt.rotation.x = o; },
      leanMax: POCHYLENIE_MAX,
      runMode: () => trybBiegu,
      markers: () =>
        (this.markers || []).map((o) => ({
          id: o.id, dotkniecia: o.touches, stan: o.state, pos: [+o.mapa.x.toFixed(2), +o.mapa.z.toFixed(2)],
          skala: +o.spin.scale.x.toFixed(3), halo: +o.halo.material.opacity.toFixed(2), swiatlo: +o.light.intensity.toFixed(2),
          przebudzenie: +o.wake.toFixed(2), wysokosc: +o.spin.position.y.toFixed(3), krycie: +o.fade.toFixed(2), widoczny: o.spin.visible,
        })),
      touched: () => this.touched || [],
      tapMarker: (o) => {
        const l = (this.markers || []).find((c) => c.id === o);
        if (!l) return null;
        l.def.absorb ? this.enterMarker(l, true) : this.touchMarker(l, true);
        return { skala: +l.spin.scale.x.toFixed(3), swiatlo: +l.light.intensity.toFixed(2) };
      },
      setRunMode: (o) => { trybBiegu = o; this.current = null; this.mixer.stopAllAction(); this.play("idle", 0); },
      groundAt: (o, l) => +this.groundHeightAt(o, l).toFixed(3),
      hold: () => ({
        trzymanie: +this.holdTime.toFixed(2), bieg: this.running, anim: this.current,
        predkosc: +(this.moveSpeed || 0).toFixed(2), tempoKlipu: +(this.actions[KLIP_CHOD]?.timeScale || 0).toFixed(2),
        pochylenieDeg: +(((this.lean || 0) * 180) / Math.PI).toFixed(1),
      }),
      planeta: () => ({ R: this.planeta.R, obrot: this.swiat.quaternion.toArray().map((v) => +v.toFixed(3)) }),
    };
  }

  makeHeroEnv() {
    const e = document.createElement("canvas");
    e.width = 64;
    e.height = 32;
    const t = e.getContext("2d");
    const n = t.createLinearGradient(0, 0, 0, 32);
    n.addColorStop(0, "#fff3dc");
    n.addColorStop(0.45, "#e9edff");
    n.addColorStop(1, "#9dbb72");
    t.fillStyle = n;
    t.fillRect(0, 0, 64, 32);
    const i = new CanvasTexture(e);
    i.mapping = EquirectangularReflectionMapping;
    i.colorSpace = SRGBColorSpace;
    const r = new PMREMGenerator(this.renderer);
    const a = r.fromEquirectangular(i);
    r.dispose();
    i.dispose();
    return a.texture;
  }

  play(e, t = 0.22, n = false) {
    if (this.current === e) return;
    const i = this.actions[e];
    if (!i) return;
    const r = this.current ? this.actions[this.current] : null;
    i.reset();
    if (n && r) {
      const a = r.getClip().duration, o = i.getClip().duration;
      if (a > 0) i.time = ((r.time % a) / a) * o;
    }
    i.fadeIn(r ? t : 0).play();
    if (r) r.fadeOut(t);
    this.current = e;
  }

  /* ── UI / wejście ─────────────────────────────────────────────────────────── */

  bindUI() {
    this.canvas.addEventListener("pointerdown", (n) => this.onPointerDown(n));
    this.canvas.addEventListener("pointermove", (n) => this.onPointerMove(n));
    this.canvas.addEventListener("pointerup", (n) => this.onPointerUp(n));
    this.canvas.addEventListener("pointercancel", (n) => this.onPointerUp(n));
    this.onKeyDown = (n) => {
      if (n.code === "ShiftLeft" || n.code === "ShiftRight") { this.keys.add(n.code); return; }
      if (KLAWISZE[n.code]) { n.preventDefault(); this.keys.add(n.code); this.enterFreeMode(); }
    };
    this.onKeyUp = (n) => { this.keys.delete(n.code); };
    this.onBlur = () => this.keys.clear();
    if (this.opts.klawiatura !== false) {
      addEventListener("keydown", this.onKeyDown);
      addEventListener("keyup", this.onKeyUp);
      addEventListener("blur", this.onBlur);
    }
    const e = this.$(".scena3d-runmode");
    if (e) {
      const n = () => { e.textContent = trybBiegu === "tempo" ? "bieg: tempo" : "bieg: klip"; };
      n();
      e.addEventListener("click", () => {
        trybBiegu = trybBiegu === "tempo" ? "clip" : "tempo";
        n();
        this.current = null;
        this.mixer.stopAllAction();
        this.play("idle", 0);
      });
    }
    this.stickBase = this.$(".scena3d-stick");
    this.stickKnob = this.$(".scena3d-knob");
    const t = (n, i) => this.$(`[data-akcja="${n}"]`)?.addEventListener("click", i);
    t("stop", () => { this.stopWalk(); this.setActive("stop"); });
    t("go", () => { this.goToLantern(); this.setActive("go"); });
    t("replay", () => { this.replayWalk(); this.setActive("replay"); });
  }

  updateCameraBasis() {
    this.camRight.set(1, 0, 0).applyQuaternion(this.camera.quaternion);
    this.camRight.y = 0;
    this.camRight.normalize();
    this.camFwd.set(0, 0, -1).applyQuaternion(this.camera.quaternion);
    this.camFwd.y = 0;
    this.camFwd.normalize();
  }

  enterFreeMode() {
    if (this.mode !== "free") { this.mode = "free"; this.walking = false; this.setActive(null); }
    if (this.sequence) this.sequence = null;
  }

  onPointerDown(e) {
    this.kinoSkroc();
    if (!this.stick) {
      this.stick = { id: e.pointerId, x0: e.clientX, y0: e.clientY, active: false };
      this.canvas.setPointerCapture?.(e.pointerId);
    }
  }
  onPointerMove(e) {
    const t = this.stick;
    if (!t || t.id !== e.pointerId) return;
    const n = e.clientX - t.x0, i = e.clientY - t.y0, r = Math.hypot(n, i);
    if (!t.active && r < 11) return;
    if (!t.active) { t.active = true; this.enterFreeMode(); this.showStick(t.x0, t.y0); }
    const a = 46, o = Math.min(1, r / a), l = r ? n / r : 0, c = r ? i / r : 0;
    this.input.set(l * o, -c * o);
    this.inputSource = "stick";
    this.moveKnob(l * o * a, c * o * a);
  }
  onPointerUp(e) {
    const t = this.stick;
    if (!t || t.id !== e.pointerId) return;
    this.stick = null;
    this.hideStick();
    if (t.active) { this.input.set(0, 0); this.inputSource = null; this.setRunFlag(false); }
    else this.tapAt(e.clientX, e.clientY);
  }
  showStick(e, t) {
    if (!this.stickBase) return;
    this.stickBase.style.left = `${e}px`;
    this.stickBase.style.top = `${t}px`;
    this.stickBase.classList.add("on");
  }
  moveKnob(e, t) {
    if (this.stickKnob) this.stickKnob.style.transform = `translate(-50%,-50%) translate(${e}px,${t}px)`;
  }
  hideStick() { this.stickBase?.classList.remove("on"); this.moveKnob(0, 0); }
  setRunFlag(e) {
    if (this.running !== e) { this.running = e; this.stickBase?.classList.toggle("run", e); }
  }
  readKeys() {
    let e = 0, t = 0;
    for (const n of this.keys) {
      const i = KLAWISZE[n];
      if (i) { e += i[0]; t += i[1]; }
    }
    if (e || t) {
      const n = Math.hypot(e, t);
      const i = this.keys.has("ShiftLeft") || this.keys.has("ShiftRight") ? 1 : 0.55;
      this.input.set((e / n) * i, (t / n) * i);
      this.inputSource = "keys";
      return true;
    }
    return false;
  }

  /* ── teren / most / kolizje (układ mapy) ──────────────────────────────────── */

  bridgeLocal(e, t, n) { return n.set(e, 0, t).applyMatrix4(this.bridgeInv); }

  groundHeightAt(e, t) {
    const n = this.bridgeLocal(e, t, this._blTmp || (this._blTmp = new Vector3()));
    const i = Math.abs(n.z);
    if (Math.abs(n.x) > MOST_POL_SZER + 0.2 || i > MOST_POL_DL) return 0;
    const r = MOST_LUK - 0.057 * (Math.min(i, MOST_PLASKI) / MOST_PLASKI) ** 2;
    const a = clamp((MOST_POL_DL - i) / (MOST_POL_DL - MOST_PLASKI), 0, 1);
    const o = clamp((MOST_POL_SZER + 0.2 - Math.abs(n.x)) / 0.3, 0, 1);
    return r * (a * a * (3 - 2 * a) * o);
  }
  onBridge(e, t) {
    const n = this.bridgeLocal(e, t, this._blTmp2 || (this._blTmp2 = new Vector3()));
    return Math.abs(n.x) < MOST_POL_SZER && Math.abs(n.z) < MOST_POL_DL;
  }

  /** Kolizja w układzie MAPY (używana przy stawianiu wędrujących znaków). */
  canWalk(e, t) {
    return this.canWalkN(this.planeta.normalna(e, t, this._v3));
  }

  /**
   * Kolizja dla punktu kuli `n` (normalna). Blokery i rzeka porównywane są
   * odległością w 3D (cięciwa ≈ łuk dla tych rozmiarów), więc obchodzenie
   * planety dookoła nie ma żadnego szwu.
   */
  canWalkN(n) {
    const R = this.planeta.R;
    if (this.ograniczenieMapy) {
      const p = this.planeta.zKuli(this._v1.copy(n).multiplyScalar(R));
      if (Math.hypot(p.x, p.z) > this.mapa.promienMapy) return false;
    }
    const P = this._v1.copy(n).multiplyScalar(R);
    for (const b of this.blockers) {
      if (!b.n) b.n = this.planeta.naKule(b.x, b.z, 0);
      const r = b.r + MARGINES_KOLIZJI;
      if (P.distanceToSquared(b.n) < r * r) return false;
    }
    let najblizej = Infinity;
    const d = this._v2;
    for (const Ml of this.rzeka3d)
      for (let i = 0; i < Ml.length - 1; i++) {
        const a = Ml[i], b = Ml[i + 1];
        d.subVectors(b, a);
        const ll = d.lengthSq();
        const c = ll > 0 ? clamp(this._v3.subVectors(P, a).dot(d) / ll, 0, 1) : 0;
        this._v3.copy(a).addScaledVector(d, c);
        najblizej = Math.min(najblizej, P.distanceTo(this._v3));
      }
    if (najblizej < this.mapa.rzeka.szerokosc + MARGINES_KOLIZJI * 0.5) {
      const p = this.planeta.zKuli(P);
      return this.onBridge(p.x, p.z);
    }
    return true;
  }

  /* ── kalibracja stóp i klipów ─────────────────────────────────────────────── */

  calibrateFeet(e = 56) {
    const t = this.skinned, n = t.geometry.attributes.position;
    let i = Infinity;
    for (let c = 0; c < n.count; c++) i = Math.min(i, n.getY(c));
    this.soleVerts = [];
    for (let c = 0; c < n.count; c++) if (n.getY(c) < i + 0.02) this.soleVerts.push(c);
    const r = new Vector3();
    const o = this.tilt.rotation.x;
    this.tilt.rotation.x = 0;
    this.hero.position.set(0, 0, 0);
    this.hero.quaternion.identity();
    this.clipY = {};
    for (const [c, h] of Object.entries(this.actions)) {
      this.mixer.stopAllAction();
      h.reset();
      h.timeScale = 1;
      h.play();
      this.tilt.rotation.x = c === KLIP_BIEG ? POCHYLENIE_BIEG : 0;
      const u = h.getClip().duration || 1;
      let d = Infinity;
      for (let f = 0; f < e; f++) {
        this.mixer.setTime((f / e) * u);
        this.hero.updateMatrixWorld(true);
        for (const m of this.soleVerts) { t.getVertexPosition(m, r).applyMatrix4(t.matrixWorld); if (r.y < d) d = r.y; }
      }
      this.clipY[c] = -d;
    }
    this.tilt.rotation.x = 0;
    const l = this.actions[KLIP_CHOD];
    if (l) {
      this.mixer.stopAllAction();
      l.reset();
      l.timeScale = 1;
      l.play();
      const c = l.getClip().duration || 1;
      const h = (u) => {
        this.tilt.rotation.x = u;
        let d = Infinity;
        for (let f = 0; f < e; f++) {
          this.mixer.setTime((f / e) * c);
          this.hero.updateMatrixWorld(true);
          for (const m of this.soleVerts) { t.getVertexPosition(m, r).applyMatrix4(t.matrixWorld); if (r.y < d) d = r.y; }
        }
        return d;
      };
      this.leanDip = Math.max(0, h(0) - h(POCHYLENIE_MAX));
    } else this.leanDip = 0;
    this.mixer.stopAllAction();
    this.mixer.setTime(0);
    this.tilt.rotation.x = o;
    this.footOffset = this.clipY.idle ?? 0;
    return this.clipY;
  }

  alignRunToWalk() {
    const e = this.actions[KLIP_CHOD], t = this.actions[KLIP_BIEG];
    if (!e || !t) return null;
    const n = this.skinned.skeleton.bones.find((U) => U.name === "Hip");
    if (!n) return null;
    const a = this.tilt.rotation.x;
    this.hero.position.set(0, 0, 0);
    this.hero.quaternion.identity();
    this.tilt.rotation.x = 0;
    const o = new Vector3(), l = new Vector3(), c = new Vector3(), h = 32;
    const u = this.skinned.skeleton.bones;
    const d = u.find((U) => U.name === "L_Thigh"), f = u.find((U) => U.name === "R_Thigh");
    if (!d || !f) return null;
    const m = (U, W = 0) => {
      this.mixer.stopAllAction();
      U.reset();
      U.timeScale = 1;
      U.play();
      this.tilt.rotation.x = W;
      const G = U.getClip().duration || 1, $ = new Vector3();
      let Q = 0, re = 0;
      for (let ce = 0; ce < h; ce++) {
        this.mixer.setTime((ce / h) * G);
        this.hero.updateMatrixWorld(true);
        n.getWorldPosition(o);
        $.add(o);
        d.getWorldPosition(l);
        f.getWorldPosition(c);
        const ge = c.x - l.x, Ge = c.z - l.z, ut = Math.hypot(ge, Ge) || 1;
        Q += Ge / ut;
        re += -ge / ut;
      }
      return { pos: $.multiplyScalar(1 / h), yaw: Math.atan2(Q / h, re / h) };
    };
    const y = new Quaternion();
    const g = m(e, 0), p = m(t, POCHYLENIE_BIEG);
    let S = g.yaw - p.yaw;
    while (S > Math.PI) S -= Math.PI * 2;
    while (S < -Math.PI) S += Math.PI * 2;
    const E = g.pos.clone().sub(p.pos);
    const v = new Quaternion();
    n.parent.getWorldQuaternion(v);
    const w = v.clone().invert();
    const b = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), S);
    const Rq = w.clone().multiply(b).multiply(v);
    const x = E.clone().divideScalar(SKALA_BOHATERA).applyQuaternion(w);
    const T = t.getClip();
    const I = T.tracks.find((U) => U.name === "Hip.position");
    if (I) for (let U = 0; U < I.times.length; U++) { I.values[U * 3] += x.x; I.values[U * 3 + 1] += x.y; I.values[U * 3 + 2] += x.z; }
    const Pq = T.tracks.find((U) => U.name === "Hip.quaternion");
    if (Pq) for (let U = 0; U < Pq.times.length; U++) { y.fromArray(Pq.values, U * 4).premultiply(Rq).normalize(); y.toArray(Pq.values, U * 4); }
    t.reset();
    const D = m(t, POCHYLENIE_BIEG);
    let H = D.yaw - g.yaw;
    while (H > Math.PI) H -= Math.PI * 2;
    while (H < -Math.PI) H += Math.PI * 2;
    this.mixer.stopAllAction();
    this.mixer.setTime(0);
    this.tilt.rotation.x = a;
    const X = D.pos.clone().sub(g.pos);
    return {
      obrotPionowy: +((S * 180) / Math.PI).toFixed(1),
      srodekSwiat: [+E.x.toFixed(3), +E.y.toFixed(3), +E.z.toFixed(3)],
      resztkowyBlad: +((H * 180) / Math.PI).toFixed(2),
      resztkowySrodek: +X.length().toFixed(4),
    };
  }

  /* ── gibanie drzew i kwiatów ──────────────────────────────────────────────── */

  _uderzDrzewa(hx, hz, dx, dz) {
    const lista = this.blockers;
    if (!lista || spokojnyRuch) return;
    const m = Math.hypot(dx, dz);
    if (!(m > 1e-6)) return;
    const dt = this._dtGib || 1 / 60, ZASIEG = 0.95, NACISK = 13; // od planety mocniej: kamera jest dalej, wychył ma być widoczny
    for (const b of lista) {
      const d = b && b.drzewo;
      if (!d) continue;
      const ox = b.x - hx, oz = b.z - hz, od = Math.hypot(ox, oz);
      if (od < 1e-4 || od > b.r + ZASIEG) continue;
      if ((dx * ox + dz * oz) / m <= 0) continue;
      const st = d.userData.gib || (d.userData.gib = { x: 0, z: 0, vx: 0, vz: 0 });
      const bliskosc = Math.min(1, (b.r + ZASIEG - od) / ZASIEG);
      const tempo = Math.min(1, (m * 60) / 3.2);
      const masa = b.skalaDrzewa || 1;
      const sila = ((NACISK * bliskosc * tempo) / masa) * dt;
      st.vx += (ox / od) * sila;
      st.vz += (oz / od) * sila;
    }
  }
  _uderzKwiaty(hx, hz, dx, dz) {
    const K = this.kwiaty;
    if (!K) return;
    const m = Math.hypot(dx, dz);
    if (!(m > 1e-6)) return;
    const dt = this._dtGib || 1 / 60, ZASIEG = 0.78, NACISK = 130;
    for (const k of K.lista) {
      const ox = k.x - hx, oz = k.z - hz, od = Math.hypot(ox, oz);
      if (od < 1e-4 || od > ZASIEG) continue;
      if ((dx * ox + dz * oz) / m <= 0) continue;
      const bliskosc = (ZASIEG - od) / ZASIEG, tempo = Math.min(1, (m * 60) / 3.2);
      const sila = NACISK * bliskosc * tempo * dt;
      k.gib.vx += (ox / od) * sila;
      k.gib.vz += (oz / od) * sila;
    }
  }
  _sprezyna(st, K, T, MAX, dt, eps, epsV) {
    st.vx += (-K * st.x - T * st.vx) * dt;
    st.vz += (-K * st.z - T * st.vz) * dt;
    st.x += st.vx * dt;
    st.z += st.vz * dt;
    if (st.x > MAX) { st.x = MAX; st.vx *= -0.2; } else if (st.x < -MAX) { st.x = -MAX; st.vx *= -0.2; }
    if (st.z > MAX) { st.z = MAX; st.vz *= -0.2; } else if (st.z < -MAX) { st.z = -MAX; st.vz *= -0.2; }
    if (Math.abs(st.x) < eps && Math.abs(st.z) < eps && Math.abs(st.vx) < epsV && Math.abs(st.vz) < epsV) st.x = st.z = st.vx = st.vz = 0;
  }
  _gibKwiaty(dt) {
    const K = this.kwiaty;
    if (!K) return;
    let ruszone = false;
    for (const k of K.lista) {
      const st = k.gib;
      if (!st.x && !st.z && !st.vx && !st.vz) continue;
      this._sprezyna(st, 52, 4.6, 1.05, dt, 3e-4, 3e-3);
      K.odswiez(k);
      ruszone = true;
    }
    if (ruszone) K.oznacz();
  }
  _gibDrzew(dt) {
    for (const b of this.blockers || []) {
      const d = b && b.drzewo;
      if (!d) continue;
      const st = d.userData.gib;
      if (!st || (!st.x && !st.z && !st.vx && !st.vz)) continue;
      const masa = b.skalaDrzewa || 1;
      this._sprezyna(st, 40 / masa, 4.6, 0.26 / masa, dt, 2e-4, 2e-3);
      d.rotation.z = -st.x;
      d.rotation.x = st.z;
    }
  }

  /* ── ruch bohatera ────────────────────────────────────────────────────────── */

  /** Przelicza `hp` (współrzędne mapy) z normalnej bohatera. */
  aktualizujHp() {
    const p = this.planeta.zKuli(this._v1.copy(this.hn).multiplyScalar(this.planeta.R));
    this.hp.x = p.x;
    this.hp.z = p.z;
  }

  /**
   * Krok po kuli w stronę stycznej `kier` o `dystans`. Gdy pełny krok jest
   * zablokowany, próbuje ślizgu wzdłuż osi ekranu (jak dawniej x-only / z-only).
   */
  moveKula(kier, dystans) {
    const x0 = this.hp.x, z0 = this.hp.z;
    const n = this._vm1 || (this._vm1 = new Vector3());
    const f = this._vm2 || (this._vm2 = new Vector3());
    const proba = (t, d) => {
      n.copy(this.hn);
      f.copy(t);
      this.planeta.przesunPoKuli(n, f, d);
      return this.canWalkN(n);
    };
    const przyjmij = () => {
      this.hn.copy(n);
      doStycznej(this.hf, this.hn);
      this.aktualizujHp();
      return true;
    };
    // Drzewa i kwiaty dostają ZAMIERZONY krok, zanim kolizja go utnie —
    // choinka ma się bujać także wtedy, gdy lisek w nią wbiega i stoi.
    {
      const zamiar = this._zamiar || (this._zamiar = { x: 0, z: 0, h: 0 });
      n.copy(this.hn);
      f.copy(kier);
      this.planeta.przesunPoKuli(n, f, dystans);
      const cel = this.planeta.zKuli(this._v1.copy(n).multiplyScalar(this.planeta.R), zamiar);
      this._uderzDrzewa(x0, z0, cel.x - x0, cel.z - z0);
      this._uderzKwiaty(x0, z0, cel.x - x0, cel.z - z0);
    }
    if (!this.canWalkN(this.hn) || proba(kier, dystans)) return przyjmij();
    // ślizg: składowe wzdłuż osi kamery rzutowanych na płaszczyznę styczną
    const a = this.stycznaZeSwiata(this.camRight, this._vm3 || (this._vm3 = new Vector3()));
    const b = this.stycznaZeSwiata(this.camFwd, this._vm4 || (this._vm4 = new Vector3()));
    const ka = kier.dot(a), kb = kier.dot(b);
    if (Math.abs(ka) > 1e-3 && proba(a, dystans * ka)) return przyjmij();
    if (Math.abs(kb) > 1e-3 && proba(b, dystans * kb)) return przyjmij();
    return false;
  }

  /** Kierunek ze świata (np. oś kamery) → styczna w punkcie bohatera (układ planety). */
  stycznaZeSwiata(w, cel) {
    this._qTmp.copy(this.swiat.quaternion).invert();
    cel.copy(w).applyQuaternion(this._qTmp);
    return doStycznej(cel, this.hn);
  }

  setLocomotion(e) {
    this.moveSpeed = e;
    if (e < 0.05) { this.play("idle", 0.28); return; }
    const t = trybBiegu === "clip" && !!this.actions[KLIP_BIEG];
    const n = this.current === KLIP_BIEG;
    if (t && (n ? e > PROG_BIEG_WYJSCIE : e > PROG_BIEG_WEJSCIE)) {
      const r = this.actions[KLIP_BIEG];
      r.timeScale = clamp(e / DL_KROKU_BIEG, 0.55, MAX_TEMPO_KLIPU);
      this.play(KLIP_BIEG, 0.26, true);
    } else {
      const r = this.actions[KLIP_CHOD];
      r.timeScale = clamp(e / DL_KROKU_CHOD, 0.6, MAX_TEMPO_KLIPU);
      this.play(KLIP_CHOD, 0.24, true);
    }
  }

  moveFree(e) {
    const t = this.input.length();
    const cn = this.mapa.latarnia.pos;
    if (t < MARTWA_STREFA) {
      this.holdTime = Math.max(0, this.holdTime - e * 3);
      this.holdDir = null;
      this.setRunFlag(false);
      this.setLocomotion(0);
      const y = this.planeta.odleglosc(this.hn, this.latarniaN);
      if (!this.celebrated && y < 2.4) {
        this.idleAtLantern += e;
        if (this.idleAtLantern > 0.35) this.startCelebration();
      } else this.idleAtLantern = 0;
      return;
    }
    this.idleAtLantern = 0;
    const n = clamp((t - MARTWA_STREFA) / (1 - MARTWA_STREFA), 0, 1);
    const i = V_CHOD * (0.45 + 0.55 * n);
    const r = Math.atan2(this.input.x, this.input.y);
    if (this.holdDir !== null) {
      let y = r - this.holdDir;
      while (y > Math.PI) y -= Math.PI * 2;
      while (y < -Math.PI) y += Math.PI * 2;
      if (Math.abs(y) > KAT_ZMIANY_KIERUNKU) this.holdTime = 0;
    }
    this.holdDir = r;
    if (n >= PROG_TRZYMANIA) this.holdTime = Math.min(CZAS_DO_BIEGU + CZAS_ROZBIEGU + 0.5, this.holdTime + e);
    else this.holdTime = Math.max(0, this.holdTime - e * 2);
    const a = clamp((this.holdTime - CZAS_DO_BIEGU) / CZAS_ROZBIEGU, 0, 1);
    const o = a * a * (3 - 2 * a);
    const l = V_CHOD + (V_BIEG - V_CHOD) * o;
    const c = Math.max(i, n >= PROG_TRZYMANIA ? l : 0);
    this.setRunFlag(c > V_CHOD * 1.5);
    const h = this._dirTmp || (this._dirTmp = new Vector3());
    h.copy(this.camRight).multiplyScalar(this.input.x / t).addScaledVector(this.camFwd, this.input.y / t).normalize();
    const m = this.stycznaZeSwiata(h, this._dirMap || (this._dirMap = new Vector3()));
    const u = this.moveKula(m, c * e);
    this.blockedFor = u ? 0 : (this.blockedFor || 0) + e;
    this.setLocomotion(this.blockedFor > 0.3 ? 0 : c);
    this.obrocKu(m, 11, e);
    const dl = this.planeta.odleglosc(this.hn, this.latarniaN);
    if (this.celebrated && dl > 4) this.celebrated = false;
  }

  /** Płynnie obraca przód bohatera ku stycznej `cel` (tempo jak dawne exp(-k·dt)). */
  obrocKu(cel, tempo, e) {
    const kat = katMiedzy(this.hf, cel, this.hn);
    obrocStyczna(this.hf, this.hn, kat * (1 - Math.exp(-tempo * e)));
    doStycznej(this.hf, this.hn);
    return kat;
  }

  /** Styczna w punkcie bohatera skierowana do punktu mapy (x, z). */
  stycznaDoMapy(x, z, cel) {
    const q = this.planeta.normalna(x, z, this._v2);
    return stycznaDo(this.hn, q, this.hf, cel);
  }

  /** Kurs bohatera w świecie (radiany, jak dawne `rotation.y`) — do kina i debugowania. */
  get heading() {
    const f = this._v3.copy(this.hf).applyQuaternion(this.swiat.quaternion);
    return Math.atan2(f.x, f.z);
  }
  set heading(_) {}

  setActive(e) {
    for (const t of this.$$(".scena3d-controls button")) t.classList.toggle("active", t.dataset.akcja === e);
  }

  /** Dotknięcie ekranu: znak → reakcja; teren → dojście do najbliższego punktu ścieżki. */
  tapAt(e, t) {
    const n = this.canvas.getBoundingClientRect();
    const i = new Vector2(((e - n.left) / n.width) * 2 - 1, -((t - n.top) / n.height) * 2 + 1);
    this.raycaster.setFromCamera(i, this.camera);
    const r = this.raycaster.intersectObjects((this.markers || []).map((c) => c.hit), false);
    if (r.length) {
      const c = r[0].object.userData.marker;
      c.def.absorb ? this.enterMarker(c, true) : this.touchMarker(c, true);
      return;
    }
    const z = this.raycaster.intersectObject(this.ziemia, false);
    if (!z.length) return;
    const lok = this.swiat.worldToLocal(z[0].point.clone());
    const p = this.planeta.zKuli(lok);
    const a = new Vector3(p.x, 0, p.z);
    const { t: o, dist: l } = this.najblizszyPunktSciezki(a);
    if (l > 4.5) return;
    this.mode = "goto";
    this.input.set(0, 0);
    this.heroT = this.najblizszyPunktSciezki(new Vector3(this.hp.x, 0, this.hp.z)).t;
    this.startWalk(o);
    const cel = this.punktSciezki(o);
    this.planeta.ustaw(this.markerKotwica, cel.x, cel.z, this.groundHeightAt(cel.x, cel.z), 0);
    this.markerPulse = 1;
  }

  touchMarker(e, t = false) {
    if (!e || !e.touch()) return;
    this.hint(e.def.toast);
    this.touched = (this.touched || []).concat(e.id);
    this.emit("znak:dotkniety", { znak: e.id, etykieta: e.def.label, palcem: t });
    try { navigator.vibrate?.([14, 40, 20]); } catch {}
    if (t && !this.walking && !this.sequence) { this.play("happy", 0.12); this.sequence = "happy"; this.seqTimer = 0; }
  }

  enterMarker(e, t = false) {
    if (!e || !e.startAbsorb(t)) return;
    this.hint(e.def.toast);
    this.touched = (this.touched || []).concat(e.id);
    this.emit("minigra:start", { znak: e.id, etykieta: e.def.label, palcem: t, poDomknieciu: 0.95 });
    try { navigator.vibrate?.([18, 50, 26]); } catch {}
    if (this.input.lengthSq() < 0.02 && (this.moveSpeed || 0) < 0.05 && !this.walking && !this.sequence) {
      this.play("happy", 0.12);
      this.sequence = "happy";
      this.seqTimer = 0;
    }
  }

  hint(e, t = 2200) {
    const n = this.$(".scena3d-hint span");
    if (!n) return;
    if (!this._hintBase) this._hintBase = n.textContent;
    n.textContent = e;
    clearTimeout(this._hintT);
    this._hintT = setTimeout(() => { n.textContent = this._hintBase; }, t);
  }

  startWalk(e) {
    this.targetT = e;
    this.walking = Math.abs(e - this.heroT) > 0.05;
    this.sequence = null;
    if (this.walking) this.play("walk");
  }
  stopWalk() {
    this.walking = false;
    this.sequence = null;
    this.input.set(0, 0);
    this.inputSource = null;
    this.holdTime = 0;
    this.holdDir = null;
    this.setRunFlag(false);
    this.keys.clear();
    this.hideStick();
    this.play("idle");
  }
  goToLantern() {
    this.celebrated = false;
    this.mode = "goto";
    this.input.set(0, 0);
    this.heroT = this.najblizszyPunktSciezki(new Vector3(this.hp.x, 0, this.hp.z)).t;
    this.startWalk(this.tLatarni);
  }
  replayWalk() {
    this.celebrated = false;
    this.mode = "goto";
    this.input.set(0, 0);
    this.placeHero(0, true);
    this.startWalk(this.tLatarni);
  }

  placeHero(e, natychmiast = false) {
    this.heroT = e;
    let n = this.punktSciezki(e);
    const st = this.mapa.start;
    if (st?.pos && e === 0) n = new Vector3(st.pos[0], 0, st.pos[1]);
    this.planeta.normalna(n.x, n.z, this.hn);
    this.aktualizujHp();
    this.groundY = this.groundHeightAt(n.x, n.z);
    this.lean = 0;
    if (this.tilt) this.tilt.rotation.x = 0;
    this.heroLift = this.groundY + (this.clipY?.idle ?? this.footOffset);
    const i = this.punktSciezki(Math.min(this.dlSciezki, e + 0.3));
    const kurs = st?.obrot != null && e === 0 ? st.obrot : Math.atan2(i.x - n.x, i.z - n.z);
    // przód z kursu w ramce mapy (na starcie mapa i kula pokrywają się)
    this.hf.set(Math.sin(kurs), 0, Math.cos(kurs)).applyQuaternion(this.planeta.ramka(n.x, n.z, this._qTmp));
    doStycznej(this.hf, this.hn);
    if (natychmiast) {
      this.planeta.obrotPodPunkt(this.hp.x, this.hp.z, this.swiat.quaternion);
      this.camPos.copy(this.camTarget).add(this.camDir);
      this.camera.position.copy(this.camPos);
      this.camera.lookAt(this.camTarget);
    }
    this.syncHero();
  }

  /** Przenosi bohatera (pozycja mapy + wysokość + kurs) na kulę. */
  syncHero() {
    if (!this.hero) return;
    this.planeta.ustawN(this.hero, this.hn, this.hf, this.heroLift);
  }

  startCelebration() {
    this.emit("latarnia:reakcja", { faza: "obrot" });
    this.celebrated = true;
    this.walking = false;
    this.sequence = "turning";
    this.seqTimer = 0;
    this.play("turn", 0.15);
  }

  spawnSparkles() {
    const e = new SphereGeometry(0.05, 6, 5);
    const t = new MeshBasicMaterial({ color: 16771496, transparent: true });
    for (let n = 0; n < 10; n++) {
      const i = new Mesh(e, t.clone());
      i.position.set(-0.6, 1.7, 0);
      const r = (n / 10) * Math.PI * 2;
      i.userData = { vel: new Vector3(Math.cos(r) * 0.9, 1.4 + Math.random(), Math.sin(r) * 0.9), life: 1 };
      this.sparkleGrupa.add(i);
      this.sparkles.push(i);
    }
  }

  /* ── pętla ────────────────────────────────────────────────────────────────── */

  tick() {
    const e = Math.min(0.05, this.clock.getDelta());
    const t = V_CHOD;
    this._dtGib = e;
    this._gibDrzew(e);
    this._gibKwiaty(e);
    if (!spokojnyRuch) this.nurtTik(e);

    if (this.stick?.active) {
      /* joystick prowadzi */
    } else if (this.keys.size) {
      this.readKeys();
      this.enterFreeMode();
    } else if (this.inputSource === "keys") {
      this.input.set(0, 0);
      this.inputSource = null;
    }
    if (this.mode === "free" && !this.sequence) this.moveFree(e);
    if (!this.walking && this.mode !== "free") this.moveSpeed = 0;

    if (this.walking) {
      const u = Math.sign(this.targetT - this.heroT);
      this.heroT += u * t * e;
      if ((u > 0 && this.heroT >= this.targetT) || (u < 0 && this.heroT <= this.targetT)) {
        this.heroT = this.targetT;
        this.walking = false;
        if (!this.celebrated && Math.abs(this.heroT - this.tLatarni) < 0.6) this.startCelebration();
        else this.play("idle");
        this.emit("bohater:doszedl", { x: +this.hp.x.toFixed(2), z: +this.hp.z.toFixed(2), latarnia: Math.abs(this.heroT - this.tLatarni) < 0.6 });
      }
      this.moveSpeed = t;
      const d = this.punktSciezki(this.heroT);
      this.planeta.normalna(d.x, d.z, this.hn);
      doStycznej(this.hf, this.hn);
      this.aktualizujHp();
      const f = this.punktSciezki(clamp(this.heroT + 0.35 * (u || 1), 0, this.dlSciezki));
      if (f.distanceToSquared(d) > 1e-6) {
        const cel = this.stycznaDoMapy(f.x, f.z, this._v1);
        if (u < 0) cel.negate();
        this.obrocKu(cel, 10, e);
      }
    }

    if (this.sequence === "turning") {
      this.seqTimer += e;
      const cel = stycznaDo(this.hn, this.latarniaN, this.hf, this._v1);
      const u = this.obrocKu(cel, 6, e);
      if (this.seqTimer > 0.5 && Math.abs(u) < 0.08) {
        this.sequence = "happy";
        this.seqTimer = 0;
        this.play("happy", 0.12);
        this.spawnSparkles();
      }
    } else if (this.sequence === "happy") {
      this.seqTimer += e;
      if (this.seqTimer > 1.55) { this.sequence = null; this.idleAtLantern = 0; this.play("idle", 0.3); }
    }

    // pochylenie w biegu
    let n;
    if (this.sequence || !this.moveSpeed) n = 0;
    else if (this.current === KLIP_BIEG) n = POCHYLENIE_BIEG;
    else n = POCHYLENIE_MAX * clamp((this.moveSpeed - V_CHOD * 0.8) / (V_BIEG - V_CHOD * 0.8), 0, 1);
    this.lean = dogon(this.lean || 0, n, 6, e);
    if (this.tilt) this.tilt.rotation.x = this.lean;

    // wysokość nad terenem (most) i stopy
    const i = this.groundHeightAt(this.hp.x, this.hp.z);
    this.groundY = dogon(this.groundY, i, 9, e);
    const r = this.clipY?.[this.current] ?? this.footOffset;
    this.footOffset = dogon(this.footOffset, r, 12, e);
    const a = (this.leanDip || 0) * Math.max(0, (this.lean || 0) / POCHYLENIE_MAX);
    this.heroLift = this.groundY + this.footOffset + a;
    this.syncHero();

    // PLANETA dogania bohatera — to jest „obrót kuli na wszystkie strony".
    // Jak kula śledząca (trackball): najmniejszy obrót, który przenosi
    // aktualną „górę" bohatera na +Y świata — bez skręcania wokół pionu.
    // Dzięki temu nie ma osobliwości i planetę da się obejść dookoła.
    const u = this._v1.copy(this.hn).applyQuaternion(this.swiat.quaternion);
    this._qTmp.setFromUnitVectors(u, this._v2.set(0, 1, 0));
    this.obrotCel.copy(this._qTmp).multiply(this.swiat.quaternion);
    const tempo = spokojnyRuch ? 30 : TEMPO_OBROTU;
    this.swiat.quaternion.slerp(this.obrotCel, 1 - Math.exp(-tempo * e));
    this.korektaPolnocy(e);

    this.camPos.copy(this.camTarget).add(this.camDir);
    this._kinoKlatka(e);
    this.camera.position.copy(this.camPos);
    this.camera.lookAt(this._kc.x, this._kc.y, this._kc.z);

    const l = spokojnyRuch ? 0.3 : 1;
    for (const u of this.markers || []) {
      const d = this.planeta.odleglosc(this.hn, u.n);
      u.update(e, l, d);
      if (d < (u.def.zasieg ?? 1) && !this._kino) u.def.absorb ? this.enterMarker(u) : this.touchMarker(u);
    }

    if (this.heroShadowKotwica) {
      const gy = this.groundHeightAt(this.hp.x, this.hp.z);
      this.planeta.ustawN(this.heroShadowKotwica, this.planeta.punktObok(this.hn, this.hf, 0.18, this._v1), this.hf, gy);
      const lift = Math.max(0, this.heroLift - gy - 0.02);
      const k = 1 + clamp(lift, 0, 0.35) * 0.7;
      this.heroShadow.scale.set(k, k, 1);
      this.heroShadow.material.opacity = clamp(1 - lift * 1.1, 0.5, 1);
    }
    if (this.markerPulse > 0) {
      this.markerPulse = Math.max(0, this.markerPulse - e * 1.4);
      this.marker.material.opacity = this.markerPulse * 0.9;
      const u = 1 + (1 - this.markerPulse) * 0.7;
      this.marker.scale.set(u, u, 1);
    }
    for (let u = this.sparkles.length - 1; u >= 0; u--) {
      const d = this.sparkles[u];
      d.userData.life -= e * 0.9;
      d.userData.vel.y -= e * 1.6;
      d.position.addScaledVector(d.userData.vel, e);
      d.material.opacity = Math.max(0, d.userData.life);
      if (d.userData.life <= 0) { this.sparkleGrupa.remove(d); this.sparkles.splice(u, 1); }
    }
    const c = this.lantern.userData;
    const h = 1 + Math.sin(performance.now() * 0.003) * 0.12;
    c.light.intensity = 9 * h;
    c.glassMat.emissiveIntensity = 1.1 * h;
    this.mixer?.update(e);
    this.renderer.render(this.scene, this.camera);
  }

  /**
   * KOREKTA PÓŁNOCY. Trackball nie skręca wokół pionu, więc po pętli wokół
   * planety mapa mogłaby stanąć bokiem. Tu powoli „dokręcamy" ją tak, żeby
   * mapowe +x znów biegło w prawo ekranu — ale tylko w głównej krainie:
   * blisko antypodu ramka mapy jest osobliwa i korekta wygasa (waga → 0).
   * Wolniej w ruchu (żeby nie kręciło pod nogami), szybciej gdy lisek stoi.
   */
  korektaPolnocy(e) {
    const r = Math.hypot(this.hp.x, this.hp.z);
    const a = r / this.planeta.R;
    const waga = clamp((2.4 - a) / 0.8, 0, 1); // pełna do ~90°, zero od ~140°
    if (waga <= 0) return;
    const ex = this._v1.set(1, 0, 0)
      .applyQuaternion(this.planeta.ramka(this.hp.x, this.hp.z, this._qTmp))
      .applyQuaternion(this.swiat.quaternion);
    const yaw = Math.atan2(ex.z, ex.x); // 0 = mapa „północą do góry"
    if (Math.abs(yaw) < 1e-4) return;
    const tempo = (this.moveSpeed || 0) > 0.05 ? KOREKTA_W_RUCHU : KOREKTA_W_SPOCZYNKU;
    // obrót o +θ wokół Y zmniejsza kąt yaw o θ (three.js: prawoskrętny)
    const krok = yaw * (1 - Math.exp(-tempo * waga * e));
    this._qTmp.setFromAxisAngle(this._v2.set(0, 1, 0), krok);
    this.swiat.quaternion.premultiply(this._qTmp);
  }

  /* ── API publiczne ────────────────────────────────────────────────────────── */

  pauza() {
    if (this.paused || this.destroyed) return;
    this.paused = true;
    this.renderer.setAnimationLoop(null);
    this.emit("pauza");
  }
  wznow() {
    if (!this.paused || this.destroyed) return;
    this.paused = false;
    this.clock.getDelta();
    this.renderer.setAnimationLoop(() => this.tick());
    this.emit("wznowienie");
  }
  ustawBohatera(e, t) {
    if (!this.hero) return false;
    this.stopWalk();
    this.mode = "free";
    this.planeta.normalna(e, t, this.hn);
    doStycznej(this.hf, this.hn);
    this.aktualizujHp();
    this.groundY = this.groundHeightAt(e, t);
    this.heroLift = this.groundY + (this.clipY?.[this.current] ?? 0);
    this.syncHero();
    return true;
  }
  ustawSpokojnyRuch(e) { spokojnyRuch = !!e; }
  ustawPowrotZnaku(e, t) {
    const n = (this.markers || []).find((i) => i.id === e);
    if (!n) return false;
    n.def.respawn = t === false ? Infinity : Number(t);
    return true;
  }

  /**
   * KINO — ujęcia na bohatera. Kamera ortograficzna: zbliżenie robi `zoom`,
   * kadr liczony z szerokości frustum. Tor: start przy pysku, obieg głowy
   * o `luk` radianów, potem MIESZANIE WAGOWE z normalnym położeniem (w: 1→0),
   * więc na ostatniej klatce kamera jest dokładnie tam, gdzie zwykle.
   */
  kino(e, t) {
    if (!this.hero || spokojnyRuch) return false;
    const P = {
      wejscie: { trzym: 1.9, powrot: 1.5, kadr: 1.7, luk: 1.45, el: 0.2 },
      bohater: { trzym: 0.9, powrot: 1.1, kadr: 2.6, luk: 0.8, el: 0.32 },
      blysk: { trzym: 0.45, powrot: 0.75, kadr: 3.4, luk: 0.45, el: 0.45 },
    };
    let p = P[e] || P.bohater;
    if (t) { p = Object.assign({}, p); for (const k in t) if (t[k] != null) p[k] = t[k]; }
    const hw = this.hero.getWorldPosition(new Vector3());
    const b = new Box3().setFromObject(this.hero);
    const gy = Math.min(2.2, Math.max(0.4, (b.max.y - hw.y) * 0.86));
    const szer = Math.max(0.001, this.camera.right - this.camera.left);
    const h = this.heading || 0;
    this._kino = {
      faza: "trzym", t: 0, trzymDl: p.trzym, powrotDl: p.powrot, gy,
      zoom: Math.max(1.05, szer / (p.kadr || 1.7)),
      az0: h - p.luk * 0.38, az1: h + p.luk * 0.62, el: p.el,
      br: this.camRight.clone(), bf: this.camFwd.clone(),
    };
    this.mode = "free";
    this.walking = false;
    this.emit("kino", { ujecie: e });
    return true;
  }
  kinoSkroc() {
    const K = this._kino;
    if (!K || K.faza !== "trzym") return false;
    K.pl = Math.min(1, K.t / Math.max(0.001, K.trzymDl));
    K.faza = "powrot";
    K.t = 0;
    K.powrotDl = 0.45;
    return true;
  }
  _kinoWejscie() {
    try {
      const k = "ewolucja.kino.wejscie";
      if (sessionStorage.getItem(k)) return;
      sessionStorage.setItem(k, "1");
    } catch {}
    this.kino("wejscie");
  }
  _kinoKlatka(e) {
    if (!this._kc) this._kc = new Vector3();
    if (!this._kcT) this._kcT = new Vector3();
    this._kc.set(this.camTarget.x, this.camTarget.y + 0.8, this.camTarget.z);
    const K = this._kino;
    if (!K || !this.hero) {
      if (this.camera.zoom !== 1) { this.camera.zoom = 1; this.camera.updateProjectionMatrix(); }
      return;
    }
    K.t += e;
    let w, pl;
    if (K.faza === "trzym") {
      pl = Math.min(1, K.t / Math.max(0.001, K.trzymDl));
      w = 1;
      if (K.t >= K.trzymDl) { K.faza = "powrot"; K.t = 0; }
    } else {
      pl = K.pl != null ? K.pl : 1;
      const q = Math.min(1, K.t / Math.max(0.001, K.powrotDl));
      w = 1 - q * q * (3 - 2 * q);
      if (K.t >= K.powrotDl) {
        this._kino = null;
        this.camRight.copy(K.br);
        this.camFwd.copy(K.bf);
        if (this.camera.zoom !== 1) { this.camera.zoom = 1; this.camera.updateProjectionMatrix(); }
        return;
      }
    }
    const ep = pl * pl * (3 - 2 * pl);
    const az = K.az0 + (K.az1 - K.az0) * ep;
    const el = K.el;
    const hp = this.hero.getWorldPosition(this._kcH || (this._kcH = new Vector3()));
    this._kcT.set(hp.x, hp.y + K.gy, hp.z);
    this._kc.lerp(this._kcT, w);
    this._kcT.set(Math.sin(az) * Math.cos(el), Math.sin(el), Math.cos(az) * Math.cos(el)).multiplyScalar(26).add(this._kc);
    this.camPos.lerp(this._kcT, w);
    const z = 1 + (K.zoom - 1) * w;
    if (Math.abs(this.camera.zoom - z) > 1e-4) { this.camera.zoom = z; this.camera.updateProjectionMatrix(); }
  }

  pokazZnak(e) {
    const t = (this.markers || []).find((n) => n.id === e);
    if (!t || t.state !== "gone") return false;
    t.state = "appear";
    t.phase = 0;
    t.setVisible(true);
    return true;
  }
  schowajZnak(e) {
    const t = (this.markers || []).find((n) => n.id === e);
    return t ? t.startAbsorb(true) : false;
  }
  stan() {
    return {
      gotowa: !!this.hero,
      pauza: this.paused,
      animacja: this.current,
      predkosc: +(this.moveSpeed || 0).toFixed(3),
      bohater: this.hero ? { x: +this.hp.x.toFixed(2), z: +this.hp.z.toFixed(2) } : null,
      znaki: (this.markers || []).map((e) => ({ id: e.id, stan: e.state, dotkniecia: e.touches })),
    };
  }
  zniszcz() {
    if (this.destroyed) return;
    this.destroyed = true;
    this.renderer.setAnimationLoop(null);
    removeEventListener("resize", this.onWinResize);
    if (this.onKeyDown) {
      removeEventListener("keydown", this.onKeyDown);
      removeEventListener("keyup", this.onKeyUp);
      removeEventListener("blur", this.onBlur);
    }
    this.ro?.disconnect();
    this.scene.traverse((e) => {
      e.geometry?.dispose?.();
      const t = e.material ? (Array.isArray(e.material) ? e.material : [e.material]) : [];
      for (const n of t) {
        for (const i of ["map", "emissiveMap", "normalMap", "roughnessMap", "metalnessMap"]) n[i]?.dispose?.();
        n.dispose?.();
      }
    });
    this.mixer?.stopAllAction();
    this.renderer.dispose();
    this.listeners.clear();
    this.emit("zniszczona");
  }
  resize() {
    if (this.destroyed) return;
    const e = this.host.getBoundingClientRect();
    const t = Math.max(1, Math.round(e.width || innerWidth));
    const n = Math.max(1, Math.round(e.height || innerHeight));
    this.renderer.setSize(t, n);
    const i = t / n;
    const zoom3d = Number(globalThis.SCENA3D_ZOOM) || ZOOM_DOMYSLNY;
    const r = (i < 1 ? 8.4 : 14) / zoom3d;
    const a = r / i;
    this.camera.left = -r / 2;
    this.camera.right = r / 2;
    this.camera.top = a / 2;
    this.camera.bottom = -a / 2;
    this.camera.updateProjectionMatrix();
    if (this.hero) this.updateCameraBasis();
  }
}
