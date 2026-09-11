/**
 * swiat.js — budowa planety: teren (kula z wypaloną teksturą mapy), rzeka
 * z nurtem, most, latarnia, brama, drzewa, głazy, kwiaty.
 *
 * Wszystkie elementy są DZIEĆMI grupy planety i stoją na kuli przez
 * `planeta.ustaw(obiekt, x, z, h, obrotY)`. Ich układ lokalny ma +Y = „góra"
 * w tym miejscu kuli, więc kod, który kiedyś budował obiekt „nad ziemią"
 * (np. pień na wysokości 0,35), działa bez zmian.
 */
import {
  Group, Mesh, MeshLambertMaterial, MeshBasicMaterial, CanvasTexture, SRGBColorSpace,
  PlaneGeometry, CylinderGeometry, ConeGeometry, IcosahedronGeometry, BoxGeometry,
  SphereGeometry, PointLight, Sprite, SpriteMaterial, AdditiveBlending, InstancedMesh,
  Vector2, Vector3, Euler, Quaternion, BufferAttribute, RepeatWrapping, DoubleSide,
  Float32BufferAttribute, MultiplyBlending, Matrix4, Color,
} from "three";
import { stycznaDo, doStycznej, przytnijDoPromienia } from "./planeta.js";
import { naNormalne, potnijNaKuli, wstegaPoKuli } from "./wstega.js";

export const PALETA = {
  grassA: "#8bb054", grassB: "#6b9a45", grassC: "#a3c368", cliff: "#6d5a44",
  path: "#c9b58c", pathEdge: "#a8946e", pathSlab: "#d6c49c",
  water: "#3fb8c9", waterDeep: "#2a93a8", night: "#243147",
};

export const KOLORY = {
  pine: 4029027, pineDark: 3105616, trunk: 7031344, leafTree: 7319118,
  rock: 9673884, rockDark: 7831426, wood: 9133628, woodDark: 7226150,
  rope: 13219465, lantern: 8018488, flame: 16767091, gate: 10127978, gateGlow: 16771496,
};

const matPlaski = (kolor, extra = {}) => new MeshLambertMaterial({ color: kolor, ...extra });
const matKanciasty = (kolor) => new MeshLambertMaterial({ color: kolor, flatShading: true });

function mesh(geo, mat, pos = [0, 0, 0], rot = [0, 0, 0], skala = 1) {
  const m = new Mesh(geo, mat);
  m.position.set(...pos);
  m.rotation.set(...rot);
  m.scale.setScalar(skala);
  return m;
}

/* ── TEKSTURA TERENU (płaska, jak dawniej) ─────────────────────────────────── */

/**
 * O ile poszerzyć kreskę w punkcie mapy (x, z), żeby PO owinięciu na kulę
 * miała stałą szerokość. Rzut kurczy wymiary styczne (wokół środka mapy)
 * mnożnikiem sin(a)/a, a promieniowe zostawia. Szerokość kreski leży w
 * poprzek jej kierunku (dx, dz), więc liczymy, jak bardzo ta poprzeczna
 * ściśnie się na kuli, i dajemy odwrotność.
 */
export function poszerzenieNaKuli(x, z, dx, dz, R) {
  const r = Math.hypot(x, z);
  if (r < 1e-6) return 1;
  const a = r / R;
  const k = Math.sin(a) / a; // ściśnięcie styczne
  const L = Math.hypot(dx, dz) || 1;
  const nx = -dz / L, nz = dx / L; // poprzeczna kreski
  const rx = x / r, rz = z / r; // kierunek promieniowy
  const wzdluzR = nx * rx + nz * rz; // składowa promieniowa poprzecznej
  const wzdluzF = -nx * rz + nz * rx; // składowa styczna
  const eff = Math.sqrt(wzdluzR * wzdluzR + wzdluzF * wzdluzF * k * k);
  return Math.min(8, 1 / Math.max(1e-3, eff));
}

/**
 * Kreska łamanej wyrównana pod kulę: każdy odcinek to czworokąt o szerokości
 * poszerzonej w poprzek (`poszerzenieNaKuli`), a każdy wierzchołek dostaje
 * łącznik w kształcie ELIPSY — koło na kuli to w płaskiej teksturze elipsa
 * o osi promieniowej `w` i stycznej `w / k` (tam rzut ściska). Zwykłe
 * `stroke()` z okrągłymi końcami zostawiałoby na kuli wielkie plamy.
 */
function kreskaNaKuli(t, punkty, i, r, szerPx, R, n) {
  if (punkty.length < 2) return;
  t.fillStyle = t.strokeStyle;
  const w0 = szerPx / 2 / n; // pół szerokości w JEDNOSTKACH MAPY (punkty są w mapie)
  for (let k = 0; k < punkty.length - 1; k++) {
    const a = punkty[k], b = punkty[k + 1];
    let dx = b.x - a.x, dz = b.y - a.y;
    const L = Math.hypot(dx, dz);
    if (L < 1e-6) continue;
    dx /= L; dz /= L;
    const wa = w0 * poszerzenieNaKuli(a.x, a.y, dx, dz, R);
    const wb = w0 * poszerzenieNaKuli(b.x, b.y, dx, dz, R);
    t.beginPath();
    t.moveTo(i(a.x - dz * wa), r(a.y + dx * wa));
    t.lineTo(i(b.x - dz * wb), r(b.y + dx * wb));
    t.lineTo(i(b.x + dz * wb), r(b.y - dx * wb));
    t.lineTo(i(a.x + dz * wa), r(a.y - dx * wa));
    t.closePath();
    t.fill();
  }
  for (const p of punkty) {
    const rr = Math.hypot(p.x, p.y);
    const a = rr / R;
    const k = rr < 1e-6 ? 1 : Math.sin(a) / a;
    const styczna = w0 / Math.max(1e-3, Math.abs(k));
    t.save();
    t.translate(i(p.x), r(p.y));
    t.rotate(Math.atan2(p.y, p.x)); // oś X elipsy = kierunek promieniowy
    t.beginPath();
    t.ellipse(0, 0, w0 * n, Math.min(w0 * 8, styczna) * n, 0, 0, Math.PI * 2);
    t.fill();
    t.restore();
  }
}

/**
 * Płótno z mapą (trawa, rzeka, ścieżka, gałęzie, kwiatki-kropki). Rozmiar
 * `teren` × `teren` jednostek mapy. Bez winiety — na kuli skraj mapy jest
 * widoczny zza horyzontu i ma być zwyczajną trawą, nie ciemną plamą.
 */
export function teksturaTerenu(mapa, planeta) {
  const aa = mapa.teren;
  const ROZ = 2048;
  const e = document.createElement("canvas");
  e.width = e.height = ROZ;
  const t = e.getContext("2d");
  const n = ROZ / aa;
  const i = (m) => (m + aa / 2) * n;
  const r = (m) => (m + aa / 2) * n;

  const a = t.createLinearGradient(0, 0, 0, ROZ);
  a.addColorStop(0, PALETA.grassB);
  a.addColorStop(0.55, PALETA.grassA);
  a.addColorStop(1, PALETA.grassB);
  t.fillStyle = a;
  t.fillRect(0, 0, ROZ, ROZ);

  let o = 42;
  const los = () => (o = (o * 16807) % 2147483647) / 2147483647;
  for (let m = 0; m < 520; m++) {
    t.fillStyle = los() > 0.5 ? PALETA.grassC : PALETA.grassB;
    t.globalAlpha = 0.16 + los() * 0.2;
    t.beginPath();
    t.ellipse(los() * ROZ, los() * ROZ, (14 + los() * 46) * 2, (10 + los() * 30) * 2, los() * 3, 0, 7);
    t.fill();
  }
  t.globalAlpha = 1;

  // ciepła poświata przy latarni (o ile latarnia jest)
  if (!mapa.latarnia.ukryta) {
    const h = t.createRadialGradient(i(0), r(-6.5), 10, i(0), r(-6.5), ROZ * 0.5);
    h.addColorStop(0, "rgba(255,220,140,0.5)");
    h.addColorStop(0.4, "rgba(255,220,140,0.16)");
    h.addColorStop(1, "rgba(255,220,140,0)");
    t.fillStyle = h;
    t.fillRect(0, 0, ROZ, ROZ);
  }

  // rzeka wypalona w terenie — łamana z krzywych, kreska wyrównana pod kulę
  const R = planeta.R;
  const K = mapa.rzeka.krzywe;
  const rzeka = (m = 0) => {
    const o = [];
    K.forEach((k, ki) => {
      for (let j = ki ? 1 : 0; j <= 40; j++) {
        const tt = j / 40;
        o.push(new Vector2(
          (1 - tt) * (1 - tt) * k.od[0] + 2 * (1 - tt) * tt * k.kontrola[0] + tt * tt * k.do[0],
          (1 - tt) * (1 - tt) * (k.od[1] + m) + 2 * (1 - tt) * tt * (k.kontrola[1] + m) + tt * tt * (k.do[1] + m),
        ));
      }
    });
    return o;
  };
  const rmax = mapa.promienTresci;
  const rzK = przytnijDoPromienia(rzeka(), rmax);
  t.strokeStyle = PALETA.waterDeep;
  for (const k of rzK) kreskaNaKuli(t, k, i, r, 2.5 * n, R, n);
  t.strokeStyle = PALETA.water;
  for (const k of rzK) kreskaNaKuli(t, k, i, r, 1.9 * n, R, n);
  t.strokeStyle = "rgba(255,255,255,0.25)";
  // Jasne nitki tną się WEDŁUG osi rzeki (te same indeksy), inaczej
  // przesunięta nitka wystawałaby poza uciętą rzekę jako samotna kreska.
  const rz0 = rzeka();
  for (const m of [-0.7, 0.2, 0.8]) {
    const rzm = rzeka(m);
    const idxK = przytnijDoPromienia(rz0.map((q, ix) => ({ x: q.x, y: q.y, ix })), rmax);
    for (const k of idxK) kreskaNaKuli(t, k.map((q) => rzm[q.ix]), i, r, 0.25 * n, R, n);
  }

  // ŚCIEŻKI TU JUŻ NIE MA. Od WERSJA_SCENY 49 ścieżka główna i gałęzie są
  // geometrią — wstęgami geodezyjnymi z `wstega.js` (`zbudujSciezke` niżej).
  // W płótnie dało się utrzymać stałą szerokość tylko przez poszerzanie
  // kreski o 1/k, a to wysiada przy ~160° od środka mapy. Rzeka zostaje
  // wypalona, bo jej brzeg jest miękki i rozjazd szerokości jest tam
  // niewidoczny — a przy okazji `kreskaNaKuli` ma dalej jednego klienta.

  // drobne kropki-kwiatki w trawie
  for (let m = 0; m < 92; m++) {
    t.fillStyle = ["#ffffff", "#e8b7e0", "#ffd873"][Math.floor(los() * 3)];
    t.globalAlpha = 0.8;
    t.beginPath();
    t.arc(los() * ROZ, los() * ROZ, (2.6 + los() * 2) * 2, 0, 7);
    t.fill();
  }
  t.globalAlpha = 1;

  const d = new CanvasTexture(e);
  d.colorSpace = SRGBColorSpace;
  d.anisotropy = 8;
  return d;
}

/**
 * Teren FASETOWANY — ścianki zamiast malunku (`swiat.terenKanciasty`).
 *
 * ŻADNEJ TEKSTURY. Kolor siedzi w wierzchołkach (`vertexColors`), materiał ma
 * `flatShading`, więc każda ścianka ma jedną normalną i jeden odcień. Lekkie
 * wyboje (suma kilku sinusów po kierunku) łamią kulę na tyle, żeby sąsiednie
 * ścianki łapały światło pod różnym kątem — i to jest cały efekt.
 *
 * IcosahedronGeometry, a NIE SphereGeometry: kula z południków ma na biegunie
 * wachlarz trójkątów, co przy płaskim cieniowaniu robi gwiazdę dokładnie tam,
 * gdzie stoi dziecko (środek mapy = biegun). Bryła foremna ma ścianki równe na
 * całej kuli i żadnego bieguna. Jest NIEINDEKSOWANA, więc każda ścianka ma
 * własne wierzchołki — dokładnie to, czego trzeba do koloru „na ściankę".
 * Wysokość liczymy z KIERUNKU, więc powtórzone wierzchołki dostają tę samą
 * wartość i między ściankami nie robią się szpary.
 *
 * Wyboje są celowo płytkie (0,05 przy R≈8): bohater chodzi po idealnej kuli,
 * a nie po tym meshu, więc głębsze zaczęłyby go zatapiać w zboczu.
 */
function terenFasetowany(mapa, planeta) {
  const R = planeta.R;
  const gestosc = typeof mapa.terenKanciasty === "number" ? mapa.terenKanciasty : 5;
  const amp = mapa.terenWyboje ?? 0.05;
  const geo = new IcosahedronGeometry(R, gestosc);
  const pos = geo.attributes.position;
  const n = pos.count;

  const wybój = (x, y, z) =>
    Math.sin(4.8 * x + 0.7) * Math.sin(5.9 * z + 1.9) * 0.55 +
    Math.sin(9.3 * y + 2.6) * Math.sin(7.7 * x + 0.3) * 0.30 +
    Math.sin(15.1 * z + 4.2) * Math.sin(12.7 * y + 1.1) * 0.15;

  // NIEREGULARNOŚĆ. Bryła foremna daje trójkąty równe co do jednego, a to
  // widać jako siatkę. Rozrzucamy więc każdy wierzchołek STYCZNIE po kuli
  // o losowy ułamek długości krawędzi — kształty przestają się powtarzać,
  // a kula zostaje kulą.
  //
  // Klucz jest z ZAOKRĄGLONEGO kierunku, nie z indeksu: geometria jest
  // nieindeksowana, więc ten sam wierzchołek występuje w kilku ściankach
  // i każda jego kopia MUSI dostać identyczne przesunięcie. Inaczej między
  // ściankami otwierają się szpary.
  const nieregularnosc = mapa.terenNieregularnosc ?? 0.3;
  // three.js dzieli krawędź na (detail + 1) części; krawędź dwudziestościanu
  // rozpina ~1,107 rad, stąd kąt pojedynczej ścianki.
  const katKrawedzi = 1.10715 / (gestosc + 1);
  const rozrzut = nieregularnosc * katKrawedzi;

  const mieszaj = (k) => {
    let h = 2166136261;
    for (let i = 0; i < k.length; i++) { h ^= k.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  };
  const pamiec = new Map();
  const t1 = new Vector3();
  const t2 = new Vector3();
  const pomoc = new Vector3();
  const przesun = (d) => {
    const klucz = `${Math.round(d.x * 1e4)},${Math.round(d.y * 1e4)},${Math.round(d.z * 1e4)}`;
    const gotowe = pamiec.get(klucz);
    if (gotowe) return d.copy(gotowe);
    const h = mieszaj(klucz);
    const r1 = ((h % 2048) / 2048) * 2 - 1;
    const r2 = (((h >>> 11) % 2048) / 2048) * 2 - 1;
    pomoc.set(0, 1, 0);
    if (Math.abs(d.y) > 0.9) pomoc.set(1, 0, 0);
    t1.crossVectors(d, pomoc).normalize();
    t2.crossVectors(d, t1).normalize();
    d.addScaledVector(t1, r1 * rozrzut).addScaledVector(t2, r2 * rozrzut).normalize();
    pamiec.set(klucz, d.clone());
    return d;
  };

  const v = new Vector3();
  const wys = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    v.fromBufferAttribute(pos, i).normalize();
    if (rozrzut > 1e-6) przesun(v);
    const h = wybój(v.x, v.y, v.z);
    wys[i] = h;
    v.multiplyScalar(R + amp * h);
    pos.setXYZ(i, v.x, v.y, v.z);
  }

  // Kolor na ŚCIANKĘ (wierzchołki idą po trzy): średnia wysokość ścianki
  // daje odcień, drobny szum rozbija regularność wzoru.
  const kolory = new Float32Array(n * 3);
  const c = new Color();
  const jasna = new Color(mapa.terenBarwy?.jasna ?? 0x9ed163);
  const ciemna = new Color(mapa.terenBarwy?.ciemna ?? 0x6ba23f);
  for (let t = 0; t + 2 < n; t += 3) {
    const sr = (wys[t] + wys[t + 1] + wys[t + 2]) / 3;
    const szum = ((Math.sin((t + 1) * 12.9898) * 43758.5453) % 1 + 1) % 1;
    const u = Math.min(1, Math.max(0, 0.5 + 0.55 * sr + (szum - 0.5) * 0.24));
    c.copy(ciemna).lerp(jasna, u);
    for (let k = 0; k < 3; k++) {
      kolory[(t + k) * 3] = c.r;
      kolory[(t + k) * 3 + 1] = c.g;
      kolory[(t + k) * 3 + 2] = c.b;
    }
  }
  geo.setAttribute("color", new Float32BufferAttribute(kolory, 3));
  geo.computeVertexNormals();

  const m = new Mesh(geo, new MeshLambertMaterial({ vertexColors: true, flatShading: true }));
  m.name = "ground";
  return m;
}

/**
 * Kula terenu z wypaloną teksturą mapy (pierwszy świat). UV każdego
 * wierzchołka liczone są z odwrotnego rzutu: punkt kuli → punkt mapy →
 * miejsce na płaskim płótnie. Poza mapą tekstura się „przypina" do brzegu
 * (ClampToEdge), czyli daje trawę.
 */
export function zbudujTeren(mapa, planeta) {
  if (mapa.terenKanciasty) return terenFasetowany(mapa, planeta);
  const R = planeta.R;
  const geo = new SphereGeometry(R, 192, 128);
  const pos = geo.attributes.position;
  const uv = geo.attributes.uv;
  const v = new Vector3();
  const p = { x: 0, z: 0, h: 0 };
  const aa = mapa.teren;
  for (let k = 0; k < pos.count; k++) {
    v.fromBufferAttribute(pos, k);
    planeta.zKuli(v, p);
    uv.setXY(k, (p.x + aa / 2) / aa, 1 - (p.z + aa / 2) / aa);
  }
  uv.needsUpdate = true;
  const mat = new MeshLambertMaterial({ map: teksturaTerenu(mapa, planeta) });
  const m = new Mesh(geo, mat);
  m.name = "ground";
  return m;
}

/* ── RZEKA: nurt (narzedzia/rzeka-nurt.py) ──────────────────────────────────── */

const NURT = { PREDKOSC: 0.18, SZEROKOSC: 0.9, KRYCIE: 0.56, SKALA: 0.55, WYSOKOSC: 0.012 };

function teksturaNurtu(faza) {
  const c = document.createElement("canvas");
  c.width = 96;
  c.height = 256;
  const x = c.getContext("2d");
  x.clearRect(0, 0, 96, 256);
  x.lineCap = "round";
  for (let i = 0; i < 9; i++) {
    const y = 16 + i * 28 + ((i + faza) % 2) * 5;
    const a = 0.42 + (i % 3) * 0.09;
    const g = x.createLinearGradient(4, 0, 92, 0);
    g.addColorStop(0, "rgba(255,255,255,0)");
    g.addColorStop(0.18, `rgba(255,255,255,${(a * 0.72).toFixed(3)})`);
    g.addColorStop(0.5, `rgba(255,255,255,${a.toFixed(3)})`);
    g.addColorStop(0.82, `rgba(255,255,255,${(a * 0.72).toFixed(3)})`);
    g.addColorStop(1, "rgba(255,255,255,0)");
    x.strokeStyle = g;
    x.lineWidth = 2.5 + (i % 3) * 0.7;
    x.beginPath();
    x.moveTo(5, y);
    x.bezierCurveTo(25, y - 5 - faza, 62, y + 5, 91, y - 1);
    x.stroke();
  }
  x.strokeStyle = "rgba(255,255,255,.48)";
  x.lineWidth = 1.8;
  for (let j = 0; j < 8; j++) {
    const yy = 29 + j * 28 + faza * 7;
    const xx = 14 + (j % 4) * 15;
    x.beginPath();
    x.moveTo(xx, yy);
    x.quadraticCurveTo(xx + 8, yy - 3, xx + 17, yy);
    x.stroke();
  }
  return c;
}

/** Wstęga nurtu położona NA KULI: każdy wierzchołek rzutowany osobno. */
export function zbudujNurt(mapa, planeta) {
  const kawalki = przytnijDoPromienia(mapa.rzeka.punkty, mapa.promienTresci);
  const grupa = new Group();
  const tiki = [];
  for (const P of kawalki) {
    const w = wstegaNurtu(P, planeta);
    grupa.add(w.mesh);
    tiki.push(w.tik);
  }
  return { mesh: grupa, tik: (dt) => tiki.forEach((f) => f(dt)) };
}

function wstegaNurtu(P, planeta) {
  const pusty = () => ({ mesh: new Group(), tik: () => {} });
  if (!P || P.length < 2) return pusty();
  const poz = [];
  const uv = [];
  const idx = [];
  const HW = NURT.SZEROKOSC;
  // Brzegi wstęgi liczone NA KULI: środek rzutujemy, a potem odsuwamy się
  // w poprzek po powierzchni o stałe HW — dzięki temu nurt ma wszędzie tę
  // samą szerokość, niezależnie od ściśnięcia rzutu w oddali.
  const nS = new Vector3(), nQ = new Vector3(), nR = new Vector3(), kier = new Vector3(), poprz = new Vector3(), v = new Vector3(), f = new Vector3();
  let dl = 0;
  for (let i = 0; i < P.length; i++) {
    const p = P[i];
    const q = P[Math.min(i + 1, P.length - 1)];
    const r = P[Math.max(i - 1, 0)];
    planeta.normalna(p.x, p.y, nS);
    planeta.normalna(q.x, q.y, nQ);
    planeta.normalna(r.x, r.y, nR);
    stycznaDo(nS, nQ, f.set(1, 0, 0), kier);
    // kierunek = od poprzedniego do następnego (uśredniony)
    stycznaDo(nS, nR, f.set(1, 0, 0), f).negate();
    kier.add(f);
    if (kier.lengthSq() < 1e-6) stycznaDo(nS, nQ, f.set(1, 0, 0), kier);
    doStycznej(kier, nS);
    poprz.crossVectors(nS, kier).normalize();
    if (i > 0) dl += planeta.odleglosc(nS, planeta.normalna(P[i - 1].x, P[i - 1].y, nR));
    const vv = dl * NURT.SKALA;
    v.copy(nS); f.copy(poprz); planeta.przesunPoKuli(v, f, HW);
    v.multiplyScalar(planeta.R + NURT.WYSOKOSC);
    poz.push(v.x, v.y, v.z);
    v.copy(nS); f.copy(poprz); planeta.przesunPoKuli(v, f, -HW);
    v.multiplyScalar(planeta.R + NURT.WYSOKOSC);
    poz.push(v.x, v.y, v.z);
    uv.push(0, vv, 1, vv);
  }
  for (let j = 0; j < P.length - 1; j++) {
    const b = j * 2;
    idx.push(b, b + 1, b + 2, b + 1, b + 3, b + 2);
  }
  const g = new PlaneGeometry(1, 1);
  g.setAttribute("position", new Float32BufferAttribute(poz, 3));
  g.setAttribute("uv", new Float32BufferAttribute(uv, 2));
  g.deleteAttribute("normal");
  g.setIndex(idx);
  g.computeBoundingSphere();
  const t1 = new CanvasTexture(teksturaNurtu(0));
  const t2 = new CanvasTexture(teksturaNurtu(1));
  t1.wrapS = t1.wrapT = RepeatWrapping;
  t2.wrapS = t2.wrapT = RepeatWrapping;
  t2.repeat.set(1, 1.35);
  t2.offset.y = 0.37;
  const m1 = new MeshBasicMaterial({ map: t1, transparent: true, depthWrite: false, side: DoubleSide, opacity: NURT.KRYCIE });
  const m2 = new MeshBasicMaterial({ map: t2, transparent: true, depthWrite: false, side: DoubleSide, opacity: NURT.KRYCIE * 0.68 });
  const s1 = new Mesh(g, m1);
  s1.renderOrder = 1;
  s1.frustumCulled = false;
  const s2 = new Mesh(g, m2);
  s2.renderOrder = 2;
  s2.frustumCulled = false;
  const grupa = new Group();
  grupa.add(s1, s2);
  const tik = (dt) => {
    // Modulo trzyma offset w [0,1) — bez tego float po kilkudziesięciu minutach traci precyzję.
    t1.offset.y = (t1.offset.y - dt * NURT.PREDKOSC) % 1;
    t2.offset.y = (t2.offset.y - dt * NURT.PREDKOSC * 0.48) % 1;
    t2.offset.x = Math.sin(Date.now() * 18e-5) * 0.045;
  };
  return { mesh: grupa, tik };
}

/* ── ŚCIEŻKA: wstęgi geodezyjne ─────────────────────────────────────────────── */

/**
 * Połówki szerokości są dokładnie te, które miała kreska w płótnie
 * (`szerPx / 2 / n` dla 1,9 i 1,55 jednostki), więc ścieżka wygląda tak
 * samo — zmienia się tylko to, że teraz ta szerokość jest PRAWDZIWA
 * w każdym miejscu planety, a nie tylko blisko środka mapy.
 *
 * Wysokości: teren ma 192×128 segmentów i zapada się względem idealnej
 * kuli o ~0,0011, więc wszystko poniżej ~0,003 migocze. Trzy piętra
 * (obrys → wypełnienie → płytki) dodatkowo rozdziela `polygonOffset`.
 */
const SCIEZKA = {
  HW_OBRYS: 0.95,
  HW_WYPELNIENIE: 0.775,
  H_OBRYS: 0.005,
  H_WYPELNIENIE: 0.009,
  H_PLYTKI: 0.013,
  KROK: 0.14,
  CO_ILE_PLYTEK: 0.46,
};

/** Biała zaokrąglona płytka z alfą — kolor daje `instanceColor`. */
function teksturaPlytki() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const x = c.getContext("2d");
  x.fillStyle = "#ffffff";
  x.beginPath();
  x.roundRect(2, 2, 60, 60, 13);
  x.fill();
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  return t;
}

/**
 * Ścieżka główna i gałęzie jako geometria na kuli.
 *
 * Dane wejściowe zostają płaskie — `mapa.sciezka` to dalej punkty (x, z)
 * z `mapa.json`, a edytor rysuje je tak samo jak wcześniej. Zmienia się
 * wyłącznie miejsce, w którym powstaje kształt: zamiast kreski w płótnie
 * mamy wstęgę odsuniętą po powierzchni kuli (`wstegaPoKuli`).
 *
 * Przycinanie: wstęgi NIE obowiązuje `promienTresci` (0,72·πR) — ta granica
 * broniła tekstury, a wstęga tekstury nie używa. `potnijNaKuli` tnie dopiero
 * tuż przed antypodem, gdzie płaska mapa zwija się w punkt.
 */
export function zbudujSciezke(mapa, planeta) {
  const grupa = new Group();
  grupa.name = "sciezki";

  const matObrys = new MeshLambertMaterial({
    color: PALETA.pathEdge, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2,
  });
  const matWypelnienie = new MeshLambertMaterial({
    color: PALETA.path, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4,
  });

  const trasy = [[mapa.sciezka, 1]];
  for (const g of mapa.galezie || []) {
    const P = g && (g.sciezka || g.punkty);
    if (P && P.length >= 2) trasy.push([P, g.szerokosc || 0.75]);
  }

  const osie = [];
  for (const [punkty, szer] of trasy) {
    for (const kawalek of potnijNaKuli(naNormalne(punkty, planeta), planeta)) {
      const wspolne = { juzNormalne: true, krok: SCIEZKA.KROK };
      const obrys = wstegaPoKuli(kawalek, planeta, {
        ...wspolne, polSzerokosc: SCIEZKA.HW_OBRYS * szer, wysokosc: SCIEZKA.H_OBRYS,
      });
      const wypelnienie = wstegaPoKuli(kawalek, planeta, {
        ...wspolne, polSzerokosc: SCIEZKA.HW_WYPELNIENIE * szer, wysokosc: SCIEZKA.H_WYPELNIENIE,
      });
      if (obrys) grupa.add(wstegaMesh(obrys.geometry, matObrys));
      if (wypelnienie) {
        grupa.add(wstegaMesh(wypelnienie.geometry, matWypelnienie));
        osie.push({ os: wypelnienie.os, szer });
      }
    }
  }

  const plytki = zbierzPlytki(osie);
  if (plytki.length) grupa.add(zbudujPlytki(plytki, planeta));
  return grupa;
}

function wstegaMesh(geometry, material) {
  const m = new Mesh(geometry, material);
  m.frustumCulled = false; // wstęga jest dzieckiem obracanej planety
  return m;
}

/** Kamienne płytki rozsypane wzdłuż osi — ten sam detal, co miała tekstura. */
function zbierzPlytki(osie) {
  const out = [];
  let o = 1337;
  const los = () => (o = (o * 16807) % 2147483647) / 2147483647;
  const coIle = Math.max(1, Math.round(SCIEZKA.CO_ILE_PLYTEK / SCIEZKA.KROK));
  for (const { os, szer } of osie) {
    for (let i = coIle; i < os.length - coIle; i += coIle) {
      out.push({
        n: os[i], przed: os[i - 1], po: os[i + 1],
        wzdluz: (0.55 + los() * 0.25) * szer,
        wpoprzek: (0.42 + los() * 0.2) * szer,
        kolor: los() > 0.4 ? PALETA.pathSlab : "#cfbd96",
        bok: (los() - 0.5) * 0.12,
      });
    }
  }
  return out;
}

function zbudujPlytki(plytki, planeta) {
  const geo = new PlaneGeometry(1, 1);
  geo.rotateX(-Math.PI / 2); // leży płasko: +X w poprzek, +Z wzdłuż biegu
  const mat = new MeshLambertMaterial({
    map: teksturaPlytki(), transparent: true, opacity: 0.85, alphaTest: 0.35,
    polygonOffset: true, polygonOffsetFactor: -6, polygonOffsetUnits: -6,
  });
  const im = new InstancedMesh(geo, mat, plytki.length);
  im.frustumCulled = false;

  const M = new Matrix4();
  const kolor = new Color();
  const kier = new Vector3(), poprz = new Vector3(), wstecz = new Vector3();
  const n = new Vector3(), bokV = new Vector3();
  const X = new Vector3(), Y = new Vector3(), Z = new Vector3();

  plytki.forEach((p, k) => {
    stycznaDo(p.n, p.po, X.set(1, 0, 0), kier);
    stycznaDo(p.n, p.przed, X.set(1, 0, 0), wstecz).negate();
    kier.add(wstecz);
    doStycznej(kier, p.n);
    poprz.crossVectors(p.n, kier).normalize();

    // rozsunięcie w bok — po powierzchni, nie po cięciwie
    n.copy(p.n);
    bokV.copy(poprz);
    if (Math.abs(p.bok) > 1e-4) planeta.przesunPoKuli(n, bokV, p.bok);
    kier.crossVectors(bokV, n).normalize(); // (n × t) × n = t

    X.copy(bokV).multiplyScalar(p.wpoprzek);
    Y.copy(n);
    Z.copy(kier).multiplyScalar(p.wzdluz);
    M.makeBasis(X, Y, Z);
    M.setPosition(n.x * (planeta.R + SCIEZKA.H_PLYTKI), n.y * (planeta.R + SCIEZKA.H_PLYTKI), n.z * (planeta.R + SCIEZKA.H_PLYTKI));
    im.setMatrixAt(k, M);
    im.setColorAt(k, kolor.set(p.kolor));
  });
  im.instanceMatrix.needsUpdate = true;
  if (im.instanceColor) im.instanceColor.needsUpdate = true;
  return im;
}

/* ── ELEMENTY ŚWIATA ────────────────────────────────────────────────────────── */

export function sosna(s = 1) {
  const e = new Group();
  e.add(mesh(new CylinderGeometry(0.12 * s, 0.18 * s, 0.7 * s, 6), matKanciasty(KOLORY.trunk), [0, 0.35 * s, 0]));
  [[1.05, 0.95], [0.82, 1.6], [0.58, 2.2]].forEach(([n, i], r) => {
    e.add(mesh(new ConeGeometry(n * s, 1 * s, 7), matKanciasty(r % 2 ? KOLORY.pineDark : KOLORY.pine), [0, i * s, 0]));
  });
  return e;
}

export function drzewoLisciaste(s = 1) {
  const e = new Group();
  e.add(mesh(new CylinderGeometry(0.14 * s, 0.2 * s, 1.1 * s, 6), matKanciasty(KOLORY.trunk), [0, 0.55 * s, 0]));
  e.add(mesh(new IcosahedronGeometry(1 * s, 1), matKanciasty(KOLORY.leafTree), [0, 1.7 * s, 0]));
  e.add(mesh(new IcosahedronGeometry(0.5 * s, 1), matKanciasty(8371806), [0.5 * s, 1.3 * s, 0.25 * s]));
  return e;
}

/** Głaz z trzech ikosaedrów; `maly` = sam kamyk. */
export function glaz(s = 1, maly = false) {
  const e = new Group();
  if (maly) {
    const p = mesh(new IcosahedronGeometry(0.5 * s, 0), matKanciasty(KOLORY.rock), [0, 0.2 * s, 0], [0.6, 0.9, 0.3]);
    p.scale.set(1.1, 0.72, 1);
    e.add(p);
    return e;
  }
  const a = mesh(new IcosahedronGeometry(0.5 * s, 0), matKanciasty(KOLORY.rock), [0, 0.34 * s, 0], [0.28, 0.8, 0.1]);
  a.scale.set(1, 1.42, 0.96);
  const b = mesh(new IcosahedronGeometry(0.33 * s, 0), matKanciasty(KOLORY.rock), [0.26 * s, 0.19 * s, 0.14 * s], [0.9, 0.35, 0.5]);
  b.scale.set(1.12, 0.9, 1.05);
  const c = mesh(new IcosahedronGeometry(0.2 * s, 0), matKanciasty(KOLORY.rockDark), [-0.34 * s, 0.12 * s, 0.26 * s], [0.5, 0.2, 0.4]);
  c.scale.set(1.15, 0.8, 1);
  e.add(a, b, c);
  return e;
}

export function latarnia() {
  const s = new Group();
  s.add(mesh(new BoxGeometry(0.22, 2.1, 0.22), matKanciasty(KOLORY.lantern), [0, 1.05, 0]));
  s.add(mesh(new BoxGeometry(0.3, 0.16, 0.3), matKanciasty(KOLORY.woodDark), [0, 2.16, 0]));
  s.add(mesh(new BoxGeometry(0.8, 0.14, 0.18), matKanciasty(KOLORY.lantern), [-0.3, 2.02, 0]));
  const e = new Group();
  e.position.set(-0.62, 1.7, 0);
  e.add(mesh(new CylinderGeometry(0.02, 0.02, 0.24, 5), matKanciasty(KOLORY.woodDark), [0, 0.24, 0]));
  e.add(mesh(new BoxGeometry(0.24, 0.3, 0.24), matKanciasty(KOLORY.woodDark), [0, 0, 0]));
  const t = new MeshLambertMaterial({ color: KOLORY.flame, emissive: KOLORY.flame, emissiveIntensity: 1.6 });
  e.add(mesh(new BoxGeometry(0.18, 0.22, 0.18), t, [0, 0, 0]));
  e.add(mesh(new ConeGeometry(0.2, 0.14, 4), matKanciasty(KOLORY.woodDark), [0, 0.2, 0], [0, Math.PI / 4, 0]));
  s.add(e);
  const n = new PointLight(KOLORY.flame, 9, 7, 2);
  n.position.copy(e.position);
  s.add(n);
  s.userData = { lamp: e, light: n, glassMat: t };
  return s;
}

export function most() {
  const s = new Group();
  for (let e = -3; e <= 3; e++)
    s.add(
      mesh(new BoxGeometry(2.2, 0.1, 0.34), matKanciasty(e % 2 ? KOLORY.wood : KOLORY.woodDark),
        [0, 0.16 + Math.cos(e * 0.4) * 0.09, e * 0.38], [Math.sin(e * 0.4) * 0.09, 0, 0]),
    );
  for (const e of [-1, 1]) {
    for (const t of [-1, 1]) {
      s.add(mesh(new BoxGeometry(0.14, 0.7, 0.14), matKanciasty(KOLORY.woodDark), [e * 1, 0.45, t * 1.25]));
      s.add(mesh(new SphereGeometry(0.09, 6, 5), matKanciasty(KOLORY.wood), [e * 1, 0.84, t * 1.25]));
    }
    s.add(mesh(new CylinderGeometry(0.03, 0.03, 2.5, 5), matPlaski(KOLORY.rope), [e * 1, 0.62, 0], [Math.PI / 2, 0, 0]));
  }
  return s;
}

export function brama() {
  const s = new Group();
  for (const o of [-1, 1]) {
    s.add(mesh(new BoxGeometry(0.6, 2.6, 0.5), matKanciasty(KOLORY.gate), [o * 1.3, 1.3, 0]));
    s.add(mesh(new ConeGeometry(0.42, 0.6, 4), matKanciasty(KOLORY.gate), [o * 1.3, 2.85, 0], [0, Math.PI / 4, 0]));
  }
  s.add(mesh(new BoxGeometry(2.2, 0.5, 0.4), matKanciasty(KOLORY.gate), [0, 2.45, 0]));
  const e = document.createElement("canvas");
  e.width = e.height = 128;
  const t = e.getContext("2d");
  const n = t.createRadialGradient(64, 64, 4, 64, 64, 64);
  n.addColorStop(0, "rgba(255,240,190,1)");
  n.addColorStop(1, "rgba(255,220,140,0)");
  t.fillStyle = n;
  t.fillRect(0, 0, 128, 128);
  const r = new Sprite(new SpriteMaterial({ map: new CanvasTexture(e), color: KOLORY.gateGlow, transparent: true, opacity: 0.9, blending: AdditiveBlending, depthWrite: false }));
  r.scale.set(3.4, 3.4, 1);
  r.position.set(0, 1.6, 0);
  s.add(r);
  const a = new PointLight(KOLORY.gateGlow, 10, 10, 2);
  a.position.set(0, 1.8, 0);
  s.add(a);
  s.userData = { glow: r, light: a };
  return s;
}

/**
 * Miękka plama cienia (pod drzewem, pod bohaterem). Leży w płaszczyźnie XZ
 * swojego układu; zwraca GRUPĘ (do postawienia na kuli) z płaszczyzną w
 * `userData.plama`.
 *
 * `mnozenie` — wariant dla bohatera: MultiplyBlending przyciemnia teren
 * zamiast go zakrywać. Przy mnożeniu przezroczystość nic nie znaczy (liczy
 * się sam kolor), więc tekstura idzie od ciemnego środka do BIAŁEGO brzegu —
 * biały pomnożony przez teren daje teren, czyli „brak cienia".
 */
export function plamaCienia(s = 1, e = 0.35, rdzen = 0, mnozenie = false) {
  const t = document.createElement("canvas");
  t.width = t.height = 64;
  const n = t.getContext("2d");
  const i = n.createRadialGradient(32, 32, 2, 32, 32, 32);
  if (mnozenie) {
    // krycie `e` przekłada się na to, jak daleko od bieli jest środek
    const cien = `rgb(${Math.round(255 - (255 - 30) * e)},${Math.round(255 - (255 - 40) * e)},${Math.round(255 - (255 - 30) * e)})`;
    i.addColorStop(0, cien);
    if (rdzen) i.addColorStop(rdzen, cien);
    i.addColorStop(1, "rgb(255,255,255)");
  } else {
    i.addColorStop(0, `rgba(30,40,30,${e})`);
    if (rdzen) i.addColorStop(rdzen, `rgba(30,40,30,${e})`);
    i.addColorStop(1, "rgba(30,40,30,0)");
  }
  n.fillStyle = i;
  n.fillRect(0, 0, 64, 64);
  const tex = new CanvasTexture(t);
  tex.colorSpace = SRGBColorSpace;
  const mat = mnozenie
    // toneMapped:false — ACES ściągnąłby biel do ~0,8 i cały kwadrat plamy
    // przyciemniałby teren; bez tone mappingu biel mnoży przez 1 = nic.
    ? new MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, blending: MultiplyBlending, toneMapped: false })
    : new MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false });
  const r = new Mesh(new PlaneGeometry(s, s), mat);
  r.rotation.x = -Math.PI / 2;
  r.position.y = 0.02;
  const g = new Group();
  g.add(r);
  g.userData.plama = r;
  return g;
}

/* ── KWIATY (InstancedMesh) ──────────────────────────────────────────────────── */

function zbudujKwiaty(DEF, planeta) {
  if (!DEF.length) return null;
  const PALETA_K = [
    { p: 0xfdf6e6, s: 0xf2c14a }, { p: 0xf7c948, s: 0xe08a1e }, { p: 0xf08fb4, s: 0xf6d76b },
    { p: 0x7aa6e8, s: 0xf3e07a }, { p: 0xb98ae0, s: 0xf6e08a },
  ];
  const LISCIE = [
    { strona: 1, wys: 0.34, sk: 1, obr: -0.5 },
    { strona: -1, wys: 0.58, sk: 0.78, obr: 0.5 },
  ];
  const mLodyga = new MeshLambertMaterial({ color: 0x5c8c3a, flatShading: true });
  const mLisc = new MeshLambertMaterial({ color: 0x6ea34a, flatShading: true });
  const gLodyga = new CylinderGeometry(0.008, 0.012, 1, 5);
  const gLisc = new SphereGeometry(0.058, 9, 6);
  const gPlatek = new SphereGeometry(0.022, 6, 4);
  const gSrodek = new SphereGeometry(0.019, 7, 5);

  function losownik(z) {
    let x = (z * 2654435761) % 4294967296;
    return () => {
      x = (x * 1664525 + 1013904223) % 4294967296;
      return x / 4294967296;
    };
  }

  const warianty = DEF.map((k) => Math.max(0, Math.min(PALETA_K.length - 1, k.wariant | 0)));
  const ilePerKolor = PALETA_K.map(() => 0);
  warianty.forEach((w) => ilePerKolor[w]++);

  const N = DEF.length;
  const imLodyga = new InstancedMesh(gLodyga, mLodyga, N);
  const imLisc = new InstancedMesh(gLisc, mLisc, N * 2);
  const imPlatek = [];
  const imSrodek = [];
  const kursor = [];
  PALETA_K.forEach((c, i) => {
    imPlatek.push(new InstancedMesh(gPlatek, new MeshLambertMaterial({ color: c.p, flatShading: true }), Math.max(1, ilePerKolor[i] * 5)));
    imSrodek.push(new InstancedMesh(gSrodek, new MeshLambertMaterial({ color: c.s, flatShading: true }), Math.max(1, ilePerKolor[i])));
    imPlatek[i].count = ilePerKolor[i] * 5;
    imSrodek[i].count = ilePerKolor[i];
    kursor.push(0);
  });

  // Jedna hierarchia pomocnicza na wszystkie kwiaty. `wKula` stawia kwiat na
  // sferze, `wRoot` daje mu pochylenie i obrót w lokalnym układzie.
  const wKula = new Group();
  const wRoot = new Group();
  const wGlowa = new Group();
  const wLodyga = new Group();
  const wSrodek = new Group();
  const wLisc = [new Group(), new Group()];
  const wPlatek = [];
  wKula.add(wRoot);
  wRoot.add(wGlowa, wLodyga, ...wLisc);
  wGlowa.add(wSrodek);
  for (let q = 0; q < 5; q++) {
    const n = new Group();
    wGlowa.add(n);
    wPlatek.push(n);
  }

  const lista = DEF.map((k, i) => {
    const los = losownik(i + 1);
    const wariant = warianty[i];
    const wysokosc = (0.13 + los() * 0.07) * (k.skala != null ? k.skala : 1);
    const kwiat = {
      x: k.pos[0], z: k.pos[1], wariant, h: wysokosc,
      skala: (0.85 + los() * 0.5) * (k.skala != null ? k.skala : 1),
      obrotY: k.obrot != null ? k.obrot : los() * Math.PI * 2,
      bazaZ: (los() - 0.5) * 0.28, bazaX: (los() - 0.5) * 0.2, glowaX: -0.34 + los() * 0.14,
      katy: [0, 0, 0, 0, 0].map((_, j) => (j / 5) * Math.PI * 2 + los() * 0.1),
      iLodyga: i, iLisc: [i * 2, i * 2 + 1], iSrodek: kursor[wariant],
      iPlatki: [0, 1, 2, 3, 4].map((j) => kursor[wariant] * 5 + j),
      gib: { x: 0, z: 0, vx: 0, vz: 0 },
    };
    kursor[wariant]++;
    return kwiat;
  });

  function odswiez(k) {
    planeta.ustaw(wKula, k.x, k.z, 0, 0);
    wRoot.position.set(0, 0, 0);
    wRoot.rotation.set(k.bazaX + k.gib.z, k.obrotY, k.bazaZ - k.gib.x);
    wRoot.scale.setScalar(k.skala);
    wLodyga.position.set(0, k.h / 2, 0);
    wLodyga.scale.set(1, k.h, 1);
    LISCIE.forEach((o, j) => {
      const n = wLisc[j];
      n.position.set(o.strona * 0.075 * o.sk, k.h * o.wys, 0);
      n.rotation.set(0, o.strona > 0 ? 0.25 : -0.25, o.obr);
      n.scale.set(1.7 * o.sk, 0.2 * o.sk, 0.62 * o.sk);
    });
    wGlowa.position.set(0, k.h, 0);
    wGlowa.rotation.set(k.glowaX, 0, 0);
    wSrodek.position.set(0, 0.006, 0);
    wSrodek.scale.set(1, 0.75, 1);
    k.katy.forEach((kat, j) => {
      const n = wPlatek[j];
      n.position.set(Math.cos(kat) * 0.031, 0, Math.sin(kat) * 0.031);
      n.rotation.set(0, -kat, 0.3);
      n.scale.set(1.7, 0.42, 1);
    });
    wKula.updateMatrixWorld(true);
    imLodyga.setMatrixAt(k.iLodyga, wLodyga.matrixWorld);
    imLisc.setMatrixAt(k.iLisc[0], wLisc[0].matrixWorld);
    imLisc.setMatrixAt(k.iLisc[1], wLisc[1].matrixWorld);
    imSrodek[k.wariant].setMatrixAt(k.iSrodek, wSrodek.matrixWorld);
    for (let j = 0; j < 5; j++) imPlatek[k.wariant].setMatrixAt(k.iPlatki[j], wPlatek[j].matrixWorld);
  }

  lista.forEach(odswiez);
  function oznacz() {
    imLodyga.instanceMatrix.needsUpdate = true;
    imLisc.instanceMatrix.needsUpdate = true;
    for (let i = 0; i < PALETA_K.length; i++) {
      imPlatek[i].instanceMatrix.needsUpdate = true;
      imSrodek[i].instanceMatrix.needsUpdate = true;
    }
  }
  oznacz();
  const meshe = [imLodyga, imLisc, ...imPlatek, ...imSrodek];
  meshe.forEach((m) => (m.frustumCulled = false));
  return { lista, odswiez, oznacz, meshe };
}

/* ── SKŁADANIE ŚWIATA ───────────────────────────────────────────────────────── */

/**
 * Buduje grupę planety. Zwraca:
 *  group — grupa do dodania do sceny (obracana pod bohaterem),
 *  ziemia — kula terenu (do raycastu dotknięć),
 *  blockers — kolizje w układzie MAPY ({x, z, r, drzewo?, skalaDrzewa?}),
 *  lantern, gate, bridge, kwiaty, nurtTik.
 */
export function zbudujSwiat(mapa, planeta) {
  const s = new Group();
  s.name = "planeta";
  const blockers = [];

  const ziemia = zbudujTeren(mapa, planeta);
  s.add(ziemia);
  const sciezki = zbudujSciezke(mapa, planeta);
  s.add(sciezki);
  const nurt = zbudujNurt(mapa, planeta);
  s.add(nurt.mesh);

  const Ct = mapa.sciezka;
  const t = most();
  // Most stoi w poprzek ścieżki, więc kąt bierze z jej trzeciego węzła.
  // Bez ścieżki (pusty świat) nie ma czego przecinać — zero i tyle.
  const obrotMostu = Ct.length >= 3 ? Math.atan2(Ct[2].x - Ct[1].x, Ct[2].z - Ct[1].z) : 0;
  planeta.ustaw(t, mapa.most.pos[0], mapa.most.pos[1], 0, obrotMostu);
  if (!mapa.most.ukryty) s.add(t);

  const cn = mapa.latarnia.pos;
  const n = latarnia();
  planeta.ustaw(n, cn.x, cn.z, 0, -0.35);
  const i = plamaCienia(1.4);
  planeta.ustaw(i, cn.x, cn.z, 0, 0);
  if (!mapa.latarnia.ukryta) {
    s.add(n, i);
    blockers.push({ x: cn.x, z: cn.z, r: 0.45 });
  }

  const r = brama();
  planeta.ustaw(r, mapa.brama.pos[0], mapa.brama.pos[1], 0, 0);
  if (!mapa.brama.ukryta) {
    s.add(r);
    blockers.push(
      { x: mapa.brama.pos[0] - 1.3, z: mapa.brama.pos[1], r: 0.55 },
      { x: mapa.brama.pos[0] + 1.3, z: mapa.brama.pos[1], r: 0.55 },
    );
  }

  const drzewa = mapa.drzewa
    ? mapa.drzewa.map((d) => [(d.typ === "lisciaste" ? drzewoLisciaste : sosna)(d.skala ?? 1), d.pos[0], d.pos[1], d.obrot, d.skala ?? 1])
    : [[sosna(1.3), -3.6, 1.3], [sosna(0.9), 4.6, -4.2], [drzewoLisciaste(1), 4.2, 0.6], [sosna(1.1), -5.2, -3]];
  for (const [l, c, h, obrot, skala] of drzewa) {
    // Drzewo dostaje własną grupę-kotwicę na kuli; gibanie obraca WEWNĘTRZNĄ
    // grupę `l`, więc ramka kuli i wychył nie mieszają się ze sobą.
    const kotwica = new Group();
    planeta.ustaw(kotwica, c, h, 0, obrot ?? 0);
    kotwica.add(l);
    s.add(kotwica);
    blockers.push({ x: c, z: h, r: 0.75, drzewo: l, skalaDrzewa: skala || 1 });
    const u = plamaCienia(2.2, 0.3);
    planeta.ustaw(u, c, h, 0, 0);
    s.add(u);
  }

  const glazy = mapa.glazy
    ? mapa.glazy.map((g) => [g.pos[0], g.pos[1], g.skala ?? 1, g.obrot])
    : [[-1.8, 6.6, 1.1], [3.1, 3.4, 0.8], [-2.6, -4.6, 1], [1.9, -5.4, 0.7], [-5.6, 4, 0.9]];
  for (const [l, c, h, obrot] of glazy) {
    const u = glaz(h);
    planeta.ustaw(u, l, c, 0, obrot != null ? obrot : l * 2.1);
    s.add(u);
    blockers.push({ x: l, z: c, r: 0.55 * h });
    // kamyki wokół głazu — detal, nie kolizja
    for (const [dx, dz, ds, dr] of [[1.05, 0.62, 0.34, 1.3], [-0.78, 1.02, 0.26, 2.6], [0.42, -0.95, 0.3, 0.4]]) {
      const p = glaz(h * ds, true);
      planeta.ustaw(p, l + dx * h, c + dz * h, 0, l + dr);
      s.add(p);
    }
  }

  const kwiaty = zbudujKwiaty(mapa.kwiaty, planeta);
  if (kwiaty) kwiaty.meshe.forEach((m) => s.add(m));

  return { group: s, ziemia, sciezki, lantern: n, gate: r, bridge: t, obrotMostu, blockers, kwiaty, nurtTik: nurt.tik };
}
