/**
 * chmury.js — obłoki jako PRAWDZIWE BRYŁY, nie sprity.
 *
 * DLACZEGO BRYŁY. Płaski kształt z teksturą wygląda jak wycięty z papieru:
 * nie ma na nim przejścia jasności, więc nie czuć objętości. Obłok zlepiony
 * z kilku dwudziestościanów ma ścianki skierowane w różne strony, a więc sam
 * z siebie daje miękkie cieniowanie — kremowo u góry, chłodniej pod spodem —
 * i reaguje na wędrujące słońce: o zachodzie zapalają się krawędzie zwrócone
 * ku niemu, czego żaden sprite nie zrobi.
 *
 * BUDOWA. Jeden obłok to 4–6 brył o różnych promieniach i niejednakowej
 * skali, zrośniętych w jedną geometrię (jedno wywołanie rysowania). Spód jest
 * ŚCIĘTY PŁASKO — wierzchołki poniżej zera lądują na zerze — bo chmura widziana
 * od dołu ma płaską podstawę, a nie kulisty brzuch. Kolor siedzi
 * w wierzchołkach: pionowy gradient plus drobna różnica jasności na ściankę,
 * dzięki czemu materiał zostaje matowy, a powierzchnie nie są identyczne.
 *
 * GDZIE WISZĄ. Jako DZIECI KAMERY, nie planety. Kamera jest ortograficzna,
 * więc „daleko w niebie" nie istnieje — wszystko poza pudełkiem kadru jest
 * poza ekranem (ta sama pułapka, co przy słońcu w `doba.js`). Chmury stoją
 * więc na stałych miejscach kadru, na głębokości większej niż planeta, żeby
 * planeta zasłaniała je przy horyzoncie. Skutek uboczny jest zamierzony:
 * chmury NIE obracają się razem z terenem, tylko bardzo powoli dryfują.
 */
import {
  BufferGeometry, Color, Float32BufferAttribute, Group, IcosahedronGeometry,
  Matrix4, Mesh, MeshLambertMaterial, Vector3,
} from "three";

/**
 * Trzy warianty. Każdy wiersz to bryłka: [x, y, z, promień, sx, sy, sz]
 * w jednostkach obłoku (szerokość całości ≈ 2). Bryłki są celowo
 * spłaszczone (sy < 1) — kula daje watę, spłaszczona daje chmurę.
 */
const WARIANTY = [
  [
    [-0.86, 0.02, 0.00, 0.50, 1.00, 0.74, 0.88],
    [-0.24, 0.24, 0.05, 0.70, 1.04, 0.90, 0.94],
    [0.40, 0.08, -0.04, 0.56, 1.00, 0.78, 0.90],
    [0.92, -0.04, 0.02, 0.38, 0.94, 0.66, 0.84],
    [0.04, -0.08, -0.16, 0.46, 1.12, 0.56, 0.78],
  ],
  [
    [-0.62, 0.00, 0.02, 0.44, 1.00, 0.70, 0.86],
    [-0.05, 0.18, -0.03, 0.62, 1.06, 0.86, 0.92],
    [0.52, 0.02, 0.04, 0.46, 0.98, 0.72, 0.88],
    [0.16, -0.10, 0.14, 0.36, 1.05, 0.54, 0.76],
  ],
  [
    [-1.02, -0.02, 0.00, 0.40, 0.98, 0.64, 0.82],
    [-0.46, 0.16, 0.06, 0.58, 1.02, 0.84, 0.92],
    [0.08, 0.32, -0.02, 0.66, 1.00, 0.94, 0.96],
    [0.62, 0.12, 0.05, 0.52, 1.00, 0.76, 0.88],
    [1.06, -0.04, -0.03, 0.34, 0.92, 0.62, 0.80],
    [0.30, -0.12, -0.16, 0.42, 1.08, 0.50, 0.74],
  ],
];

const _m = new Matrix4();
const _v = new Vector3();
const _c = new Color();

/**
 * Zrasta bryłki w jedną geometrię: płaski spód, MIĘKKIE cieniowanie
 * i pionowy gradient w wierzchołkach.
 *
 * Normalne muszą być USREDNIANE PO POZYCJI, a nie policzone przez
 * `computeVertexNormals()`. Dwudziestościan jest nieindeksowany, więc każda
 * ścianka ma własne kopie wierzchołków i standardowy rachunek daje normalną
 * na ściankę — czyli cieniowanie płaskie, dokładnie to, czego tu nie chcemy.
 * Klucz jest z zaokrąglonej pozycji, dzięki czemu kopie tego samego punktu
 * (także z SĄSIEDNIEJ bryłki) dostają wspólną normalną i miejsce zrośnięcia
 * przestaje być widoczne jako krawędź.
 */
function geometriaOblok(brylki, barwaGory, barwaSpodu, ziarno) {
  const poz = [];
  for (const [x, y, z, r, sx, sy, sz] of brylki) {
    const g = new IcosahedronGeometry(r, 2);
    _m.makeScale(sx, sy, sz).setPosition(x, y, z);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      _v.fromBufferAttribute(p, i).applyMatrix4(_m);
      poz.push(_v.x, _v.y, _v.z);
    }
    g.dispose();
  }

  // Płaski spód: wszystko poniżej podstawy siada na podstawie.
  let min = Infinity;
  let max = -Infinity;
  for (let i = 1; i < poz.length; i += 3) { if (poz[i] < min) min = poz[i]; if (poz[i] > max) max = poz[i]; }
  const podstawa = min + (max - min) * 0.34;
  for (let i = 1; i < poz.length; i += 3) if (poz[i] < podstawa) poz[i] = podstawa;

  // MIĘKKIE NORMALNE — suma normalnych ścianek w każdym punkcie.
  const n = poz.length / 3;
  const klucz = (i) => `${Math.round(poz[i * 3] * 1e3)},${Math.round(poz[i * 3 + 1] * 1e3)},${Math.round(poz[i * 3 + 2] * 1e3)}`;
  const suma = new Map();
  const a = new Vector3(), b = new Vector3(), c = new Vector3(), nf = new Vector3(), ab = new Vector3(), ac = new Vector3();
  for (let t = 0; t + 2 < n; t += 3) {
    a.set(poz[t * 3], poz[t * 3 + 1], poz[t * 3 + 2]);
    b.set(poz[(t + 1) * 3], poz[(t + 1) * 3 + 1], poz[(t + 1) * 3 + 2]);
    c.set(poz[(t + 2) * 3], poz[(t + 2) * 3 + 1], poz[(t + 2) * 3 + 2]);
    nf.crossVectors(ab.subVectors(b, a), ac.subVectors(c, a));
    for (let k = 0; k < 3; k++) {
      const key = klucz(t + k);
      const w = suma.get(key);
      if (w) { w.x += nf.x; w.y += nf.y; w.z += nf.z; }
      else suma.set(key, { x: nf.x, y: nf.y, z: nf.z });
    }
  }

  const nor = new Float32Array(poz.length);
  const kol = new Float32Array(poz.length);
  const gora = new Color(barwaGory);
  const spod = new Color(barwaSpodu);
  for (let i = 0; i < n; i++) {
    const w = suma.get(klucz(i));
    _v.set(w.x, w.y, w.z);
    if (_v.lengthSq() < 1e-12) _v.set(0, 1, 0);
    _v.normalize();
    nor[i * 3] = _v.x; nor[i * 3 + 1] = _v.y; nor[i * 3 + 2] = _v.z;

    // Gradient liczony NA WIERZCHOŁEK — przy miękkim cieniowaniu szum na
    // ściankę wyszedłby plamami, a nie matową fakturą.
    const u = Math.min(1, Math.max(0, (poz[i * 3 + 1] - podstawa) / Math.max(1e-4, max - podstawa)));
    _c.copy(spod).lerp(gora, Math.pow(u, 0.62));
    kol[i * 3] = _c.r; kol[i * 3 + 1] = _c.g; kol[i * 3 + 2] = _c.b;
  }

  const geo = new BufferGeometry();
  geo.setAttribute("position", new Float32BufferAttribute(poz, 3));
  geo.setAttribute("normal", new Float32BufferAttribute(nor, 3));
  geo.setAttribute("color", new Float32BufferAttribute(kol, 3));
  geo.computeBoundingSphere();
  return geo;
}

export const CHMURY = {
  gora: 0xfffdf8,      // kremowa góra
  spod: 0xd5e6f8,      // błękitny spód — jaśniejszy, niż się wydaje: ACES
                       // ściąga jasność, a chmura ma zostać biała, nie szara
  ile: 5,
  // Ułamek POŁOWY kadru. Szczyt planety siedzi około 0,55, więc obłoki muszą
  // wisieć wyżej, żeby nie tonęły za horyzontem.
  wysokoscOd: 0.66,
  wysokoscDo: 0.90,
  skalaOd: 0.62,       // obłok ma ~2 j. szerokości; kadr ma ~14, więc to
  skalaDo: 1.32,        // 11–23% szerokości ekranu — kilka niewielkich obłoków
  tempoOd: 0.004,      // szerokości kadru na sekundę — bardzo powoli
  tempoDo: 0.010,
  glebokosc: -45,      // dalej niż planeta, bliżej niż słońce (-50)
};

export class Chmury {
  constructor(opcje = {}) {
    const C = { ...CHMURY, ...opcje };
    this.C = C;
    this.grupa = new Group();
    this.grupa.name = "chmury";
    // Jeden materiał na wszystkie obłoki — `doba.js` barwi je jedną zmianą.
    this.material = new MeshLambertMaterial({ vertexColors: true, flatShading: false });
    // OTOCZKA. Brzeg bryły jest z natury ostry; druga, lekko powiększona
    // kopia bez zapisu głębi rozmywa sylwetkę i daje chmurze puszystość,
    // której samo cieniowanie nie zrobi.
    this.materialOtoczki = new MeshLambertMaterial({
      vertexColors: true, flatShading: false,
      transparent: true, opacity: 0.34, depthWrite: false,
    });
    this.geometrie = WARIANTY.map((b, i) => geometriaOblok(b, C.gora, C.spod, i * 37 + 11));

    let o = 20260911;
    const los = () => (o = (o * 16807) % 2147483647) / 2147483647;
    this.sztuki = [];
    for (let i = 0; i < C.ile; i++) {
      const mesh = new Mesh(this.geometrie[i % this.geometrie.length], this.material);
      mesh.castShadow = false;
      mesh.receiveShadow = false;
      mesh.frustumCulled = false;
      // Lekki przechył: kamera patrzy na planetę z góry, więc obłoki widać
      // odrobinę od spodu — bez tego wyglądają jak naklejki.
      mesh.rotation.set(-0.18 - los() * 0.12, (los() - 0.5) * 0.7, (los() - 0.5) * 0.12);
      const skala = C.skalaOd + los() * (C.skalaDo - C.skalaOd);
      mesh.scale.setScalar(skala);
      const otoczka = new Mesh(mesh.geometry, this.materialOtoczki);
      otoczka.scale.setScalar(1.13);
      otoczka.renderOrder = 1;
      otoczka.castShadow = otoczka.receiveShadow = false;
      mesh.add(otoczka);
      this.grupa.add(mesh);
      this.sztuki.push({
        mesh,
        // Równomiernie po kadrze z drobnym rozrzutem — czysty los lubi je
        // zlepić w jeden wał i zostawić pół nieba puste.
        x: -1.1 + (i + 0.5) * (2.2 / C.ile) + (los() - 0.5) * (0.7 / C.ile),
        y: C.wysokoscOd + los() * (C.wysokoscDo - C.wysokoscOd),
        tempo: C.tempoOd + los() * (C.tempoDo - C.tempoOd),
        polSzer: skala * 0.75,
      });
    }
  }

  /** Chmury wiszą w kadrze — muszą być dziećmi kamery, jak słońce. */
  podepnijDoKamery(camera) {
    camera.add(this.grupa);
    this.kamera = camera;
  }

  /**
   * @param {number} dt sekundy
   * @param {object} stan wynik `Doba.stan` — albo `null`, gdy doby nie ma
   */
  aktualizuj(dt, stan) {
    const k = this.kamera;
    if (!k) return;
    const W = ((k.right - k.left) / 2) / (k.zoom || 1);
    const H = ((k.top - k.bottom) / 2) / (k.zoom || 1);
    for (const s of this.sztuki) {
      s.x += s.tempo * dt * 2;
      // Zawijanie liczone w JEDNOSTKACH KADRU, z zapasem na własną szerokość,
      // żeby obłok nie przeskakiwał w polu widzenia.
      const zapas = 1 + s.polSzer / Math.max(0.001, W);
      if (s.x > zapas) s.x = -zapas;
      s.mesh.position.set(s.x * W, s.y * H, this.C.glebokosc);
    }
    if (stan) this.grupa.visible = true;
  }
}
