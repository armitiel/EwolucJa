/**
 * znak.js — znak na mapie (medal/karta/piórko/gwiazdka/czarodziej/próg…).
 *
 * Kontrakt z Reactem (`hub/znakiMapy.js`, `hub/DevRezyserka.jsx`): pola
 * `id`, `state`, `phase`, `def.respawn`, `def.respawnPierwszy`, `touches`,
 * `setVisible()`, `root`, `spin`, `halo`, `light`, `wake`, `fade`, oraz
 * `mapa` = {x, z} — położenie w układzie mapy (dawniej czytane z
 * `root.position`, które teraz jest punktem NA KULI).
 */
import {
  Group, Mesh, MeshBasicMaterial, CanvasTexture, SRGBColorSpace, RingGeometry, SphereGeometry,
  Sprite, SpriteMaterial, AdditiveBlending, DoubleSide, PointLight, Box3, Vector3,
  Float32BufferAttribute,
} from "three";

const ABSORB_CZAS = 0.95;
const APPEAR_CZAS = 0.7;

export function gladko(s, e, t) {
  const n = Math.min(1, Math.max(0, (s - e) / Math.max(1e-6, t - e)));
  return n * n * (3 - 2 * n);
}

let teksturaHalo = null;
function halo() {
  if (teksturaHalo) return teksturaHalo;
  const s = document.createElement("canvas");
  s.width = s.height = 128;
  const e = s.getContext("2d");
  const t = e.createRadialGradient(64, 64, 2, 64, 64, 64);
  t.addColorStop(0, "rgba(255,255,255,1)");
  t.addColorStop(0.35, "rgba(255,255,255,0.5)");
  t.addColorStop(1, "rgba(255,255,255,0)");
  e.fillStyle = t;
  e.fillRect(0, 0, 128, 128);
  teksturaHalo = new CanvasTexture(s);
  teksturaHalo.colorSpace = SRGBColorSpace;
  return teksturaHalo;
}

/** Krąg pod znakiem ze smugą biegnącą po obwodzie (kolory wierzchołków). */
function krag(kolor, krycie = 0.24) {
  const t = new Mesh(new RingGeometry(0.4, 0.66, 64), new MeshBasicMaterial({ color: kolor, transparent: true, opacity: krycie, side: DoubleSide, depthWrite: false }));
  t.rotation.x = -Math.PI / 2;
  t.position.y = 0.03;
  if (krycie <= 0) return t;
  const g = new RingGeometry(0.4, 0.68, 64);
  const p = g.getAttribute("position");
  const n = p.count;
  const kol = new Float32Array(n * 4);
  const kat = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    kol[i * 4] = kol[i * 4 + 1] = kol[i * 4 + 2] = 1;
    kol[i * 4 + 3] = 0;
    const a = Math.atan2(p.getY(i), p.getX(i));
    kat[i] = a < 0 ? a + Math.PI * 2 : a;
  }
  g.setAttribute("color", new Float32BufferAttribute(kol, 4));
  const sm = new Mesh(g, new MeshBasicMaterial({ color: kolor, vertexColors: true, transparent: true, opacity: 1, side: DoubleSide, depthWrite: false, blending: AdditiveBlending }));
  sm.position.z = 0.004;
  sm.__katy = kat;
  t.add(sm);
  t.smuga = sm;
  return t;
}

function smugaKregu(k, czas, moc) {
  const s = k.smuga;
  if (!s) return;
  const a = s.geometry.getAttribute("color");
  const kat = s.__katy;
  const n = kat.length;
  const czolo = (czas * 1.25) % (Math.PI * 2);
  const dl = 1.35;
  const m = Math.min(2.2, moc);
  for (let i = 0; i < n; i++) {
    let d = (czolo - kat[i]) % (Math.PI * 2);
    if (d < 0) d += Math.PI * 2;
    const u = d < dl ? 1 - d / dl : 0;
    a.setW(i, u * u * u * 0.85 * m);
  }
  a.needsUpdate = true;
}

export class Znak {
  /**
   * @param {object} def definicja z mapa.json
   * @param {Object3D} model wczytany model
   * @param {number} wysokoscTerenu wysokość gruntu w punkcie (most)
   * @param {Planeta} planeta
   */
  constructor(def, model, wysokoscTerenu = 0, planeta) {
    this.def = def;
    this.id = def.id;
    this.planeta = planeta;
    this.time = Math.random() * 6.28;
    this.wake = 0;
    this.punch = 0;
    this.touches = 0;
    this.state = "idle";
    this.phase = 0;
    this.fade = 1;
    this.armed = true;
    this.mapa = { x: def.pos[0], z: def.pos[1] };
    this.n = planeta.normalna(def.pos[0], def.pos[1]); // punkt na kuli (odległość od bohatera liczona sferycznie)
    this.root = new Group();
    planeta.ustaw(this.root, def.pos[0], def.pos[1], wysokoscTerenu, 0);

    const box = new Box3().setFromObject(model);
    const rozmiar = new Vector3();
    box.getSize(rozmiar);
    const skala = (0.55 * (def.scale ?? 1)) / Math.max(0.001, rozmiar.y);
    model.scale.setScalar(skala);
    box.setFromObject(model);
    model.position.sub(box.getCenter(new Vector3()));

    this.mats = [];
    model.traverse((l) => {
      const c = l.material ? (Array.isArray(l.material) ? l.material : [l.material]) : [];
      for (const h of c) {
        this.mats.push(h);
        if (def.absorb || def.cykl > 0) {
          h.transparent = true;
          h.depthWrite = true;
        }
        h.metalness = def.metalness ?? 0;
        h.roughness = def.roughness ?? 0.85;
        h.metalnessMap = null;
        h.roughnessMap = null;
        if (def.barwa != null) h.color.setHex(def.barwa).multiplyScalar(def.jasnosc ?? 1.35);
        else if (def.wlasneKolory) h.color.multiplyScalar(def.jasnosc ?? 1);
        else h.color.setScalar(def.jasnosc ?? 1.35);
        if (def.barwaMnoznik != null) {
          h.color.r *= ((def.barwaMnoznik >> 16) & 255) / 255;
          h.color.g *= ((def.barwaMnoznik >> 8) & 255) / 255;
          h.color.b *= (def.barwaMnoznik & 255) / 255;
        }
        if (h.map) {
          h.emissiveMap = h.map;
          h.emissive.setScalar(1);
          h.emissiveIntensity = 0;
        }
        h.needsUpdate = true;
      }
    });
    if (def.faceCamera) {
      model.rotation.y = Math.atan2(0.465, 0.885);
      model.rotation.x = -0.5;
    }
    this.spin = new Group();
    this.spin.position.y = def.height ?? 1.1;
    this.spin.add(model);
    this.root.add(this.spin);

    this.haloBase = def.haloOpacity ?? 0.2;
    this.ringBase = def.ringOpacity ?? 0.22;
    this.lightBase = def.lightBase ?? 2.2;
    this.halo = new Sprite(new SpriteMaterial({ map: halo(), color: def.glow, transparent: true, opacity: this.haloBase, blending: AdditiveBlending, depthWrite: false }));
    this.halo.scale.setScalar(def.haloScale ?? 1.75);
    this.halo.position.y = def.height ?? 1.1;
    this.root.add(this.halo);
    this.light = new PointLight(def.glow, this.lightBase, 6.5, 2);
    this.light.position.y = (def.height ?? 1.1) - 0.1;
    if (this.lightBase > 0) this.root.add(this.light);
    this.ring = krag(def.ringColor ?? def.glow, this.ringBase);
    this.root.add(this.ring);
    this.hit = new Mesh(new SphereGeometry(0.85, 10, 8), new MeshBasicMaterial({ visible: false }));
    this.hit.position.y = def.height ?? 1.1;
    this.hit.userData.marker = this;
    this.root.add(this.hit);
    this.sparks = [];
  }

  update(e, t = 1, n = 99) {
    this.time += e;
    if (this.mixer) this.mixer.update(e);
    let i = 0, r = 0, a = 1;
    if (this.state === "absorb") {
      this.phase = Math.min(1, this.phase + e / ABSORB_CZAS);
      const f = this.phase;
      i = (1 - (1 - f) * (1 - f)) * (this.def.absorbLift ?? 1.7);
      a = 1 + 0.45 * Math.sin(Math.min(1, f / 0.45) * Math.PI * 0.5) - 1.05 * gladko(f, 0.5, 1);
      r = Math.sin(Math.min(1, f / 0.75) * Math.PI);
      this.fade = 1 - gladko(f, 0.42, 0.92);
      if (f >= 1) {
        this.state = "gone";
        this.phase = 0;
        this.setVisible(false);
      }
    } else if (this.state === "gone") {
      this.phase += e;
      const prog = (this.powroty ? this.def.respawn : (this.def.respawnPierwszy ?? this.def.respawn)) ?? 3.2;
      if (this.phase >= prog) {
        this.powroty = (this.powroty || 0) + 1;
        this.przenies();
        this.state = "appear";
        this.phase = 0;
        this.setVisible(true);
        if (this.def.cykl > 0) this.sparkBurst(this.def.iskry ?? 18, this.def.iskrySila ?? 1.35);
      }
      return;
    } else if (this.state === "appear") {
      this.phase = Math.min(1, this.phase + e / APPEAR_CZAS);
      const f = this.phase;
      i = (1 - f) * 0.55;
      a = 0.25 + 0.75 * gladko(f, 0, 1);
      r = Math.sin(f * Math.PI) * 0.7;
      this.fade = gladko(f, 0.05, 0.6);
      if (f >= 1) {
        this.state = "idle";
        this.phase = 0;
        this.fade = 1;
      }
    }
    if (this.state === "idle" && this.def.cykl > 0 && (this.phase += e) >= this.def.cykl) this.startAbsorb(true);
    for (const f of this.mats) if (f.transparent) f.opacity = this.fade;
    if (n > (this.def.zbrojenie ?? 1.7)) this.armed = true;
    const o = n < 3.2 ? 1 : 0;
    this.wake += (o - this.wake) * (1 - Math.exp(-4 * e));
    this.punch = Math.max(0, this.punch - e * 2.2);
    const l = this.punch * this.punch;
    const c = this.def.bezUnoszenia ? 0 : Math.sin(this.time * 1.6) * (0.09 + 0.05 * this.wake) * t;
    this.spin.position.y = (this.def.height ?? 1.1) + c + (this.def.bezUnoszenia ? 0 : l * 0.35) + i;
    if (this.def.faceCamera) this.spin.rotation.y = Math.sin(this.time * 0.9) * 0.38 * t + l * 1.6 + r * 1.1;
    else if (this.def.bezObrotu) this.spin.rotation.y = this.def.obrotY ?? 0;
    else this.spin.rotation.y += e * (0.7 + 2.4 * l);
    const os = this.def.oddechSkali ?? 1;
    const h = Math.max(0, (1 + 0.08 * this.wake * os + 0.4 * l * (this.def.oddechDotyku ?? os)) * a);
    this.spin.scale.setScalar(h);
    if (this.def.bujanie != null) {
      if (this.buj != null) {
        if ((this.buj += e) > 2.6) {
          this.buj = null;
          this.spin.rotation.z = 0;
          this.spin.position.x = 0;
        } else {
          const bk = this.def.bujanie * Math.exp(-1.5 * this.buj) * Math.sin(7.5 * this.buj);
          const bh = 0.275 * (this.def.scale ?? 1);
          this.spin.rotation.z = bk;
          this.spin.position.x = -bh * Math.sin(bk);
          this.spin.position.y -= bh * (1 - Math.cos(bk));
        }
      } else {
        this.spin.rotation.z = 0;
        this.spin.position.x = 0;
      }
    }
    const u = 1 + Math.sin(this.time * 2.2) * 0.16;
    const d = 1 + 0.45 * this.wake + 1.6 * l + 3.2 * r;
    this.halo.position.y = this.spin.position.y;
    this.halo.scale.setScalar((this.def.haloScale ?? 1.75) * u * d);
    this.halo.material.opacity = Math.min(1, this.haloBase * d);
    this.light.intensity = this.lightBase * u * d;
    this.ring.material.opacity = Math.min(1, this.ringBase * (0.92 + 0.5 * (0.5 + 0.5 * Math.sin(this.time * 2.2))) * d);
    this.ring.scale.setScalar(1 + 0.06 * Math.sin(this.time * 2.2) + 0.35 * l + 0.5 * r);
    smugaKregu(this.ring, this.time, d);
    for (let f = this.sparks.length - 1; f >= 0; f--) {
      const m = this.sparks[f];
      m.userData.life -= e * 1.4;
      m.userData.vel.y -= e * 1.8;
      m.position.addScaledVector(m.userData.vel, e);
      m.material.opacity = Math.max(0, m.userData.life);
      if (m.userData.life <= 0) {
        this.root.remove(m);
        this.sparks.splice(f, 1);
      }
    }
  }

  touch() {
    if (this.state !== "idle" || this.punch > 0.55 || (this.def.raz && !this.armed)) return false;
    if (this.def.raz) this.armed = false;
    this.punch = 1;
    if (this.def.bujanie) this.buj = 0;
    this.touches++;
    this.sparkBurst(12, 1);
    return true;
  }

  startAbsorb(wymus = false) {
    if (this.state !== "idle" || (!wymus && !this.armed)) return false;
    this.armed = false;
    this.state = "absorb";
    this.phase = 0;
    this.punch = 0;
    this.touches++;
    this.sparkBurst(this.def.iskry ?? 18, this.def.iskrySila ?? 1.35);
    return true;
  }

  get ready() {
    return this.state === "idle";
  }

  /** Losowe przeniesienie na jedną z wolnych pozycji (`_pozycje` = [x, wysokość, z]). */
  przenies() {
    const p = this.def._pozycje;
    if (!p || p.length < 2) return;
    const q = p[Math.floor(Math.random() * p.length)];
    this.mapa = { x: q[0], z: q[2] };
    this.planeta.normalna(q[0], q[2], this.n);
    this.planeta.ustaw(this.root, q[0], q[2], q[1], 0);
  }

  setVisible(e) {
    this.spin.visible = e;
    this.halo.visible = e;
    this.light.visible = e;
    this.ring.visible = e;
    this.hit.visible = false;
    this.hit.userData.off = !e;
    if (e) this.spin.scale.setScalar(0.25);
    else {
      for (const t of this.sparks) this.root.remove(t);
      this.sparks.length = 0;
      this.light.intensity = 0;
      this.halo.material.opacity = 0;
      this.ring.material.opacity = 0;
    }
  }

  sparkBurst(ile, sila) {
    const n = new SphereGeometry(0.05, 6, 5);
    for (let i = 0; i < ile; i++) {
      const r = new Mesh(n, new MeshBasicMaterial({ color: this.def.glow, transparent: true, opacity: 1 }));
      r.position.copy(this.spin.position);
      const a = (i / ile) * Math.PI * 2;
      r.userData = { vel: new Vector3(Math.cos(a) * sila, 1.2 + Math.random() * 0.9, Math.sin(a) * sila), life: 1 };
      this.root.add(r);
      this.sparks.push(r);
    }
  }

  /** Położenie w układzie mapy (zgodność z dawnym `root.position`). */
  get worldPos() {
    return this.mapa;
  }
}
