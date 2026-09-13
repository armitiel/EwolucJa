/**
 * fasola.js — Magiczna Fasola: roślina, która rośnie etapami, gdy lisek
 * przynosi jej wodę, aż da się po niej wspiąć i pójść dalej.
 *
 * PĘTLA (brief: świat odpowiada na to, co robi dziecko, bez licznika):
 *   oczko wody → lisek wchodzi w wodę i „nabiera" (kropla krąży przy nim,
 *   jak kule światła) → niesie do fasoli → fasola wypija kroplę i ROŚNIE
 *   o etap (z podskokiem i rozbryzgiem) → … → przy ostatnim etapie lisek
 *   dotyka łodygi i wspina się spiralą w górę, a scena zgłasza `swiat:dalej`.
 *
 * DANE (mapa.json):
 *   "fasola": { "pos": [x, z], "obrot": 0.5, "zasieg": 1.9, "dalej": "w3",
 *               "etapy": [ { "file": "fasola_1", "wysokosc": 0.45 }, … ] }
 *   "oczko":  { "pos": [x, z], "promien": 1.4, "ziarno": 3 }   (ziarno = wariant obrysu)
 *
 * HYBRYDA: etap 0 (ziarno w kopczyku) to model GLB `etapy[0].file` (Tripo,
 * normalizowany jak budynek: wysokość `wysokosc`, środek XZ, spód na ziemi;
 * bez pliku — bryła zastępcza). Od pierwszego podlania roślina jest
 * PROCEDURALNA (`pnacze.js`): ziarno chowa się w ziemię, a pnącze rośnie
 * płynnie do wysokości `etapy[i].wysokosc` — ostatni etap to pełna
 * wysokość `H`. Opcjonalnie `"pnacze": { "obroty", "pnacza", "grubosc",
 * "szerokosc", "ziarno" }` w definicji fasoli (`pedy` działa dalej: pnącza = pedy+1).
 * Roślina to SPLOT 4–5 osobnych pnączy, które dochodzą etapami; przy ostatnim
 * etapie jedno z nich spłaszcza się w szeroką, grywalną wstęgę i to PO NIEJ
 * (`sciezka(u)`) wspina się lisek.
 */
import {
  Group, Mesh, MeshLambertMaterial, MeshBasicMaterial, Box3, Vector3, Quaternion,
  SphereGeometry, IcosahedronGeometry,
  RingGeometry, DoubleSide, AdditiveBlending, Sprite, SpriteMaterial,
  CanvasTexture, SRGBColorSpace, PointLight, BufferGeometry, Float32BufferAttribute,
} from "three";
import { Pnacze } from "./pnacze.js";
import { mnoznikObrysu } from "./teren.js";

export const FASOLA = {
  barwaLodygi: 0x6fb84a,
  barwaLodygiCiemna: 0x4f8f36,
  barwaLisc: 0x8dcc5a,
  barwaZiarno: 0xb9e36a,
  barwaZiemia: 0x7a5a3c,
  barwaKwiat: 0xfff6dc,
  czasWzrostu: 1.4,       // s — animacja jednego etapu
  czasWspinaczki: 5.6,    // s — lisek na szczyt (ścieżka ma więcej zwojów niż splot)
  odstepWspinaczki: 0.04, // lisek idzie PO wstędze, więc to tylko drobne odsunięcie
};

const matKanciasty = (kolor) => new MeshLambertMaterial({ color: kolor, flatShading: true });

function mesh(geo, mat, pos = [0, 0, 0], rot = [0, 0, 0], skala = 1) {
  const m = new Mesh(geo, mat);
  m.position.set(...pos);
  m.rotation.set(...rot);
  m.scale.setScalar(skala);
  m.castShadow = true;
  return m;
}

/**
 * Kopczyk ziemi pod rośliną — jedyne brązowe miejsce na zielonej planecie.
 * Ziarno jest w nim OKOPANE: kopiec ma wyraźną czaszę i wianuszek grudek,
 * a wraz ze wzrostem rośliny rośnie razem z nią (nabiega jak nabiegi korzeniowe).
 */
function kopczyk(r = 0.55) {
  const g = new Group();
  const czasza = mesh(new SphereGeometry(r, 10, 7), matKanciasty(FASOLA.barwaZiemia), [0, -r * 0.52, 0]);
  czasza.scale.set(1.3, 0.5, 1.22);
  g.add(czasza);
  // wianuszek grudek — świeżo okopana ziemia
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * Math.PI * 2 + 0.4;
    const d = r * (0.72 + (i % 3) * 0.13);
    const s = r * (0.10 + (i % 4) * 0.032);
    const k = mesh(new IcosahedronGeometry(s, 0), matKanciasty(i % 2 ? 0x8a6a46 : 0x6d5232),
      [Math.cos(a) * d, r * 0.02, Math.sin(a) * d], [0.4 + i, 0.9 * i, 0.2]);
    k.scale.set(1.15, 0.65, 1);
    g.add(k);
  }
  return g;
}

/** Bryła zastępcza ziarna (etap 0), gdy nie ma modelu GLB. */
export function bryłaZiarna(wysokosc = 0.45) {
  const g = new Group();
  const H = wysokosc;
  const z = mesh(new SphereGeometry(H * 0.5, 8, 6), matKanciasty(FASOLA.barwaZiarno), [0, H * 0.42, 0], [0.3, 0.2, 0.5]);
  z.scale.set(1.35, 0.85, 0.95);
  g.add(z);
  return g;
}

let _teksturaKropli = null;
function teksturaKropli() {
  if (_teksturaKropli) return _teksturaKropli;
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const x = c.getContext("2d");
  const g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.3, "rgba(200,240,255,0.9)");
  g.addColorStop(1, "rgba(120,200,255,0)");
  x.fillStyle = g;
  x.fillRect(0, 0, 64, 64);
  _teksturaKropli = new CanvasTexture(c);
  _teksturaKropli.colorSpace = SRGBColorSpace;
  return _teksturaKropli;
}

/**
 * Siatka oczka DOPASOWANA DO KULI: pierścienie ρ ∈ [ρ0, ρ1] × kąt θ, każdy
 * wierzchołek leży na sferze o promieniu R (y = √(R²−x²−z²) − R) plus
 * wysokość `h(ρ)` nad/pod powierzchnią. Bez tego tafla o promieniu 1,4 na
 * kuli R≈8,5 wisiałaby brzegami 15 cm nad ziemią. ρ0 = 0 daje pełne koło
 * (środek jako jeden wierzchołek), ρ0 > 0 — pierścień (brzeg).
 */
function siatkaOczka(r, mnoznik, R, ro0, ro1, h, ringi = 6, punkty = 44) {
  const pos = [], idx = [];
  const ringiLista = [];
  for (let i = 0; i <= ringi; i++) ringiLista.push(ro0 + (ro1 - ro0) * (i / ringi));
  let srodek = -1;
  if (ro0 === 0) { pos.push(0, h(0) + 0, 0); srodek = 0; ringiLista.shift(); }
  const start = pos.length / 3;
  for (let i = 0; i < ringiLista.length; i++) {
    const ro = ringiLista[i];
    for (let j = 0; j < punkty; j++) {
      const t = (j / punkty) * Math.PI * 2;
      const rr = ro * r * mnoznik(t);
      const x = Math.cos(t) * rr, z = Math.sin(t) * rr;
      const y = Math.sqrt(Math.max(0, R * R - x * x - z * z)) - R + h(ro);
      pos.push(x, y, z);
    }
  }
  if (srodek >= 0) for (let j = 0; j < punkty; j++) idx.push(0, start + ((j + 1) % punkty), start + j);
  for (let i = 0; i + 1 < ringiLista.length; i++) {
    for (let j = 0; j < punkty; j++) {
      const a = start + i * punkty + j, b = start + i * punkty + ((j + 1) % punkty);
      const c = a + punkty, d = b + punkty;
      idx.push(a, d, c, a, b, d);
    }
  }
  const g = new BufferGeometry();
  g.setAttribute("position", new Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

/**
 * Oczko wody: tafla dopasowana do kuli + lekkie falowanie. Niecka i brzeg
 * są WPISANE W TEREN (`teren.js` daje nieckę pod `mapa.oczko`, `swiat.js`
 * koloruje dno i stok), więc tafla leży w ziemi, a nie na niej. Lisek
 * wchodzi w nie po wodę; nie blokuje ruchu.
 */
export const OCZKO = { glebokosc: 0.11 };

export function zbudujOczko(def, planeta) {
  const r = def.promien ?? 1.4;
  const ziarno = def.ziarno ?? 1;
  const mn = mnoznikObrysu(ziarno);
  const R = planeta.R;
  const g = new Group();
  g.name = "oczko";
  const gl = def.glebokosc ?? OCZKO.glebokosc;
  // brzeg jest CZĘŚCIĄ TERENU (teren.js/swiat.js: niecka + piaskowe ścianki);
  // tu tylko tafla, tuż nad płaskim dnem niecki.
  const tafla = new Mesh(
    siatkaOczka(r, mn, R, 0, 1.02, () => -gl + 0.05, 5),
    new MeshLambertMaterial({ color: 0x5fc4de, emissive: 0x1a6a88, emissiveIntensity: 0.35, transparent: true, opacity: 0.92 }),
  );
  g.add(tafla);
  const fale = [];
  for (let i = 0; i < 3; i++) {
    const f = new Mesh(new RingGeometry(r * 0.2, r * 0.24, 32), new MeshBasicMaterial({ color: 0xdff6ff, transparent: true, opacity: 0.35, side: DoubleSide, depthWrite: false }));
    f.rotation.x = -Math.PI / 2;
    f.position.y = -gl + 0.055;
    f.userData.faza = i / 3;
    g.add(f);
    fale.push(f);
  }
  planeta.ustaw(g, def.pos[0], def.pos[1], 0, 0);
  const n = planeta.normalna(def.pos[0], def.pos[1]);
  return {
    mesh: g,
    n,
    promien: r,
    tik(dt) {
      for (const f of fale) {
        f.userData.faza = (f.userData.faza + dt * 0.28) % 1;
        const u = f.userData.faza;
        const s = 0.35 + u * 3.6;
        f.scale.set(s, s, 1);
        f.material.opacity = 0.42 * (1 - u) * (1 - u);
      }
    },
  };
}

export class Fasola {
  /**
   * @param {object} def wpis `fasola` z mapy
   * @param {Planeta} planeta
   * @param {(plik: string) => Promise<{scene: Group}>} loadGLB loader sceny
   */
  constructor(def, planeta, loadGLB) {
    this.def = def;
    this.planeta = planeta;
    this.etap = 0;
    this.rosnie = null; // { t, od, do }
    this.czas = Math.random() * 10;
    this.n = planeta.normalna(def.pos[0], def.pos[1]);
    this.root = new Group();
    this.root.name = "fasola";
    planeta.ustaw(this.root, def.pos[0], def.pos[1], 0, def.obrot ?? 0);
    const domyslne = [0.45, 0.9, 1.9, 3.2, 5.5];
    this.etapy = (def.etapy || []).map((e, i) => ({ def: e, wysokosc: e.wysokosc ?? domyslne[i] ?? 1 }));
    if (!this.etapy.length) for (let i = 0; i < 5; i++) this.etapy.push({ def: {}, wysokosc: domyslne[i] });
    this.H = this.etapy[this.ostatni].wysokosc;
    // stopień wzrostu pnącza dla każdego etapu: 0 = ziarno, 1 = pełna wysokość
    this.cele = this.etapy.map((e, i) => (i === 0 ? 0 : Math.min(1, e.wysokosc / this.H)));

    const P = def.pnacze || {};
    this.pnacze = new Pnacze({
      H: this.H, obroty: P.obroty, pnacza: P.pnacza, pedy: P.pedy, grubosc: P.grubosc,
      szerokoscSciezki: P.szerokosc, ziarno: P.ziarno ?? 1,
    });
    this.u = 0;
    this.root.add(this.pnacze.group);
    // kopiec dobrany do grubości dojrzałej rośliny; przy ziarnie jest mały
    // i rośnie razem z pnączami (patrz `update`)
    this.kopczyk = kopczyk(Math.max(0.45, this.pnacze.grubosc * 0.95));
    this.kopczyk.scale.setScalar(0.4);
    this.root.add(this.kopczyk);

    // ziarno (etap 0): model GLB albo bryła zastępcza
    this.ziarno = new Group();
    this.root.add(this.ziarno);

    // blask u podstawy — zaprasza do podlania / wspinaczki
    this.halo = new Sprite(new SpriteMaterial({ map: teksturaKropli(), color: 0xbfffd0, transparent: true, opacity: 0, blending: AdditiveBlending, depthWrite: false, toneMapped: false }));
    this.halo.scale.setScalar(1.6);
    this.halo.position.y = 0.35;
    this.root.add(this.halo);
    this.swiatlo = new PointLight(0xbfffb0, 0, 5, 2);
    this.swiatlo.position.y = 0.6;
    this.root.add(this.swiatlo);

    this.rozbryzgi = [];
    this.gotowe = this._wczytajZiarno(loadGLB);
  }

  async _wczytajZiarno(loadGLB) {
    const e = this.etapy[0];
    let scena = null;
    if (e.def.file && loadGLB) {
      try {
        const w = await loadGLB(e.def.file);
        scena = w.scene;
        const box = new Box3().setFromObject(scena);
        const roz = new Vector3();
        box.getSize(roz);
        scena.scale.setScalar(e.wysokosc / Math.max(0.001, roz.y));
        box.setFromObject(scena);
        const c = box.getCenter(new Vector3());
        scena.position.set(-c.x, -box.min.y - e.wysokosc * 0.22, -c.z);   // wkopane w kopczyk
        scena.traverse((o) => { if (o.isMesh) o.castShadow = true; });
      } catch (err) {
        console.warn("[fasola] brak modelu ziarna", e.def.file, "— bryła zastępcza");
        scena = null;
      }
    }
    const bryla = scena || bryłaZiarna(e.wysokosc);
    if (!scena) bryla.position.y -= e.wysokosc * 0.18;
    this.ziarno.add(bryla);
    this.ziarno.visible = this.etap === 0;
  }

  get ostatni() { return this.etapy.length - 1; }
  get gotowa() { return this.etap >= this.ostatni && !this.rosnie; }
  /** Bieżąca wysokość rośliny (pnącze; ziarno liczy się jako swoja wysokość). */
  get wysokosc() { return this.etap === 0 && !this.rosnie ? this.etapy[0].wysokosc : this.pnacze.wysokosc; }

  /**
   * Punkt ścieżki wspinaczki dla `u ∈ [0,1]` w układzie MAPY w miejscu fasoli
   * (kąt liczony jak `kier` w app.js — z uwzględnieniem `obrot` rośliny).
   * Zwraca {kat, r, h}.
   */
  sciezka(u) {
    const s = this.pnacze.sciezka(u, FASOLA.odstepWspinaczki);
    return { kat: s.kat - (this.def.obrot ?? 0), r: s.r, h: s.h };
  }

  /** Podlanie: przejście do następnego etapu. Zwraca false, gdy nie ma dokąd rosnąć. */
  podlej() {
    if (this.rosnie || this.etap >= this.ostatni) return false;
    this.rosnie = { t: 0, od: this.etap, do: this.etap + 1 };
    this._rozbryzg(16);
    return true;
  }

  _rozbryzg(ile) {
    const geo = new SphereGeometry(0.05, 6, 5);
    for (let i = 0; i < ile; i++) {
      const m = new Mesh(geo, new MeshBasicMaterial({ color: 0x9fe4ff, transparent: true, opacity: 1 }));
      m.position.set(0, 0.35, 0);
      const a = (i / ile) * Math.PI * 2;
      m.userData = { vel: new Vector3(Math.cos(a) * (0.6 + Math.random() * 0.8), 1.4 + Math.random() * 1.2, Math.sin(a) * (0.6 + Math.random() * 0.8)), life: 1 };
      this.root.add(m);
      this.rozbryzgi.push(m);
    }
  }

  update(dt, dBohater = 99) {
    this.czas += dt;
    if (this.rosnie) {
      const r = this.rosnie;
      r.t = Math.min(1, r.t + dt / FASOLA.czasWzrostu);
      const u0 = this.cele[r.od], u1 = this.cele[r.do];
      if (r.od === 0) {
        // ziarno chowa się w ziemię w pierwszej ćwiartce, pnącze rusza w drugiej
        const p1 = Math.min(1, r.t / 0.35);
        this.ziarno.visible = p1 < 1;
        this.ziarno.scale.setScalar(Math.max(0.001, 1 - p1));
      }
      const p = r.od === 0 ? Math.max(0, (r.t - 0.25) / 0.75) : r.t;
      // wzrost z przestrzeleniem: front dochodzi ~4 % za cel i wraca
      const e = p < 0.75 ? (p / 0.75) : 1;
      const wyg = e * e * (3 - 2 * e);
      const przestrzel = p < 0.75 ? 0 : Math.sin(((p - 0.75) / 0.25) * Math.PI) * 0.04;
      this.u = u0 + (u1 - u0) * wyg + (u1 - u0) * przestrzel;
      this.pnacze.ustawWzrost(this.u);
      if (r.t >= 1) {
        this.etap = r.do;
        this.rosnie = null;
        this.u = u1;
        this.pnacze.ustawWzrost(this.u);
      }
    }
    if (this.kopczyk) {
      const k = 0.4 + 0.6 * (this.u * this.u * (3 - 2 * this.u));
      this.kopczyk.scale.setScalar(k);
    }
    if (!this.rosnie && this.etap > 0) {
      // oddech: lekkie kołysanie żywej rośliny (ziarno — nie)
      this.pnacze.group.rotation.z = Math.sin(this.czas * 1.3) * 0.02;
      this.pnacze.group.rotation.x = Math.cos(this.czas * 1.1) * 0.015;
    }
    // blask: zaprasza, gdy lisek blisko (mocniej, gdy gotowa do wspinaczki)
    const blisko = Math.max(0, 1 - dBohater / 6);
    const baza = this.gotowa ? 0.55 : 0.22;
    const puls = 0.6 + 0.4 * Math.sin(this.czas * 2.2);
    this.halo.material.opacity = baza * blisko * puls;
    this.swiatlo.intensity = (this.gotowa ? 2.2 : 0.6) * blisko * puls;
    for (let i = this.rozbryzgi.length - 1; i >= 0; i--) {
      const m = this.rozbryzgi[i];
      m.userData.life -= dt * 1.1;
      m.userData.vel.y -= dt * 3.2;
      m.position.addScaledVector(m.userData.vel, dt);
      m.material.opacity = Math.max(0, m.userData.life);
      if (m.userData.life <= 0) { this.root.remove(m); this.rozbryzgi.splice(i, 1); }
    }
  }
}
