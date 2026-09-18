/*!
 * SPDX-FileCopyrightText: © 2026 Amitiel Angelisme <armitiel@gmail.com>
 * SPDX-License-Identifier: LicenseRef-EwolucJA-Proprietary
 *
 * EwolucJA — gra edukacyjna dla dzieci.
 * Produkt powstał w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”;
 * autorskie prawa majątkowe pozostają przy autorze. Licencja: LICENSE.
 */
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
  PlaneGeometry, CylinderGeometry, ConeGeometry, IcosahedronGeometry, DodecahedronGeometry, BoxGeometry,
  SphereGeometry, PointLight, Sprite, SpriteMaterial, AdditiveBlending, InstancedMesh,
  Vector2, Vector3, Euler, Quaternion, BufferAttribute, RepeatWrapping, DoubleSide,
  BufferGeometry, Float32BufferAttribute, MultiplyBlending, Matrix4, Color, Raycaster,
} from "three";
import { stycznaDo, doStycznej, przytnijDoPromienia } from "./planeta.js";
import { formyTerenu } from "./teren.js";
import { materialTerenu } from "./shader-terenu.js";
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
  pakKamien: 0x6b6f78, pakKamienCiemny: 0x4f535c, pakZylka: 0xc9c4b4,
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
 * Teren PROCEDURALNY — kula bez tekstury (`swiat.terenKanciasty`).
 *
 * ŻADNEJ TEKSTURY I ŻADNYCH `vertexColors`. Kolor liczy się w pikselu:
 * `shader-terenu.js` bierze kierunek na kuli i maluje miękkie plamy zieleni
 * (dwa tony + szarozielone przetarcie + kremowe rozjaśnienia). Geometria
 * niesie tylko `wysForma` — jak wysoko/głęboko leży teren w danym punkcie —
 * i z tego shader robi suchy wierzchołek wzgórza oraz piaskowy brzeg i
 * błotniste dno niecki. Paleta zmienia się BEZ przebudowy geometrii.
 *
 * Powierzchnia jest GŁADKA: normalne uśredniamy ręcznie (patrz
 * `gladkieNormalne`), bo plamę koloru ma nieść malunek, a nie siatka.
 * `swiat.terenFasety: true` wraca do ścianek — ten sam wzór, płaskie
 * cieniowanie.
 *
 * Lekkie wyboje (suma kilku sinusów po kierunku) zostają: łamią kulę na tyle,
 * żeby światło miało po czym chodzić.
 *
 * IcosahedronGeometry, a NIE SphereGeometry: kula z południków ma na biegunie
 * wachlarz trójkątów, co przy płaskim cieniowaniu robi gwiazdę dokładnie tam,
 * gdzie stoi dziecko (środek mapy = biegun). Bryła foremna ma ścianki równe na
 * całej kuli i żadnego bieguna. Jest NIEINDEKSOWANA — dlatego normalne trzeba
 * sklejać ręcznie. Wysokość liczymy z KIERUNKU, więc powtórzone wierzchołki
 * dostają tę samą wartość i między ściankami nie robią się szpary.
 *
 * Wyboje są celowo płytkie (0,05 przy R≈8): bohater chodzi po idealnej kuli,
 * a nie po tym meshu, więc głębsze zaczęłyby go zatapiać w zboczu.
 */
function terenProceduralny(mapa, planeta) {
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
  const kluczKierunku = (d) => `${Math.round(d.x * 1e4)},${Math.round(d.y * 1e4)},${Math.round(d.z * 1e4)}`;
  const przesun = (d, klucz) => {
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

  // FORMY TERENU (`teren.js`): wzgórza, niecki (w tym pod oczkiem wody) —
  // ta sama funkcja, z której `app.groundHeightAt` liczy wysokość bohatera.
  const formy = formyTerenu(mapa);
  const mp = { x: 0, z: 0, h: 0 };
  const forma = (d) => {
    if (formy.pusta) return 0;
    planeta.zKuli(d, mp);
    return formy.h(mp.x, mp.z);
  };

  const v = new Vector3();
  // `wysForma` idzie do shadera (piasek w niecce, suchy szczyt wzgórza);
  // `klucze` to tożsamość wierzchołka — po niej sklejamy normalne.
  const wysForma = new Float32Array(n);
  const ziemiaForma = new Float32Array(n); // przekopana ziemia (wykop pod fasolą) → shader
  const klucze = new Array(n);
  for (let i = 0; i < n; i++) {
    v.fromBufferAttribute(pos, i).normalize();
    const klucz = kluczKierunku(v);
    klucze[i] = klucz;
    if (rozrzut > 1e-6) przesun(v, klucz);
    const h = wybój(v.x, v.y, v.z);
    const fh = forma(v);
    wysForma[i] = fh;
    if (!formy.pusta) ziemiaForma[i] = formy.ziemia(mp.x, mp.z);
    // w niecce wyboje cichną (dno stawu ma być gładkie)
    v.multiplyScalar(R + amp * (fh < -1e-4 ? h * 0.3 : h) + fh);
    pos.setXYZ(i, v.x, v.y, v.z);
  }

  geo.setAttribute("wysForma", new Float32BufferAttribute(wysForma, 1));
  geo.setAttribute("ziemiaForma", new Float32BufferAttribute(ziemiaForma, 1));

  // NORMALNE. Geometria jest NIEINDEKSOWANA, więc `computeVertexNormals()`
  // dałoby normalną na ściankę — czyli kulę fasetowaną, choćby materiał
  // prosił o gładkie cieniowanie. Sklejamy więc ręcznie: normalne ścianek
  // sumują się w koszyku wspólnego wierzchołka (klucz = kierunek SPRZED
  // rozrzutu, ten sam dla wszystkich kopii), a potem wracają znormalizowane.
  if (mapa.terenFasety) geo.computeVertexNormals();
  else gladkieNormalne(geo, klucze);

  const m = new Mesh(geo, materialTerenu({
    barwy: mapa.terenBarwy || null,
    strojenie: mapa.terenShader || null,
    fasety: !!mapa.terenFasety,
  }));
  m.name = "ground";
  return m;
}

/** Uśrednione normalne dla geometrii nieindeksowanej (klucz = tożsamość wierzchołka). */
function gladkieNormalne(geo, klucze) {
  const pos = geo.attributes.position;
  const n = pos.count;
  const a = new Vector3(), b = new Vector3(), c = new Vector3();
  const ab = new Vector3(), ac = new Vector3(), nf = new Vector3();
  const koszyki = new Map();
  for (let t = 0; t + 2 < n; t += 3) {
    a.fromBufferAttribute(pos, t);
    b.fromBufferAttribute(pos, t + 1);
    c.fromBufferAttribute(pos, t + 2);
    nf.crossVectors(ab.subVectors(b, a), ac.subVectors(c, a)); // długość = 2× pole, czyli waga ścianki
    for (let k = 0; k < 3; k++) {
      const klucz = klucze[t + k];
      let s = koszyki.get(klucz);
      if (!s) koszyki.set(klucz, s = new Vector3());
      s.add(nf);
    }
  }
  const norm = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const s = koszyki.get(klucze[i]);
    nf.copy(s).normalize();
    norm[i * 3] = nf.x;
    norm[i * 3 + 1] = nf.y;
    norm[i * 3 + 2] = nf.z;
  }
  geo.setAttribute("normal", new Float32BufferAttribute(norm, 3));
}

/**
 * Kula terenu z wypaloną teksturą mapy (pierwszy świat). UV każdego
 * wierzchołka liczone są z odwrotnego rzutu: punkt kuli → punkt mapy →
 * miejsce na płaskim płótnie. Poza mapą tekstura się „przypina" do brzegu
 * (ClampToEdge), czyli daje trawę.
 */
export function zbudujTeren(mapa, planeta) {
  if (mapa.terenKanciasty) return terenProceduralny(mapa, planeta);
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

/**
 * KAMIENNY PĄK — martwy obiekt pierwszej misji.
 *
 * Zamknięty pąk z kamienia na spękanym kikucie, trzy razy wyższy od
 * bohatera. Fasetowany płaskim cieniowaniem, jak teren — ma należeć do tego
 * świata, a nie wyglądać jak przyklejony z innej gry.
 *
 * NIE MA ŻADNEJ ANIMACJI i to jest cały pomysł na jego „martwość": w świecie,
 * gdzie trawa się kołysze, chmury dryfują, a planeta się obraca, BEZRUCH
 * czyta się jako śmierć bez jednego słowa.
 *
 * Pąk, a nie uschnięte drzewo: pąk niesie w sobie „to się może otworzyć",
 * uschnięte drzewo niesie „to się skończyło". Pierwsze zadaje pytanie.
 */
export function kamiennyPak(s = 1) {
  const e = new Group();
  e.name = "kamienny-pak";
  const kamien = matKanciasty(KOLORY.pakKamien);
  const kamienCiemny = matKanciasty(KOLORY.pakKamienCiemny);

  // kikut — szeroki u dołu, żeby bryła siedziała w ziemi, a nie stała na niej
  e.add(mesh(new CylinderGeometry(0.34 * s, 0.58 * s, 0.72 * s, 7), kamienCiemny, [0, 0.3 * s, 0]));
  // kołnierz u nasady pąka
  e.add(mesh(new CylinderGeometry(0.46 * s, 0.3 * s, 0.26 * s, 7), kamien, [0, 0.76 * s, 0]));

  // trzy płatki — stożki odchylone na zewnątrz, obrócone co 120°
  for (let i = 0; i < 3; i++) {
    const kat = (i * Math.PI * 2) / 3 + 0.4;
    const p = mesh(new ConeGeometry(0.42 * s, 1.9 * s, 5), i === 1 ? kamienCiemny : kamien,
      [Math.cos(kat) * 0.19 * s, 1.72 * s, Math.sin(kat) * 0.19 * s],
      [Math.cos(kat) * 0.13, kat, Math.sin(kat) * 0.13]);
    e.add(p);
  }
  // rdzeń — wystaje ponad płatki, daje wyraźny szpic sylwetki na horyzoncie
  e.add(mesh(new ConeGeometry(0.3 * s, 2.3 * s, 6), kamien, [0, 1.95 * s, 0]));

  // martwe żyłki: cienkie jasne graniastosłupy wtopione w kamień
  for (let i = 0; i < 3; i++) {
    const kat = (i * Math.PI * 2) / 3 - 0.5;
    e.add(mesh(new CylinderGeometry(0.035 * s, 0.02 * s, 1.5 * s, 4),
      matKanciasty(KOLORY.pakZylka),
      [Math.cos(kat) * 0.3 * s, 1.55 * s, Math.sin(kat) * 0.3 * s],
      [Math.cos(kat) * 0.16, 0, Math.sin(kat) * 0.16]));
  }
  return e;
}

/* ── ELEMENTY ŚWIATA ────────────────────────────────────────────────────────── */

// Wspólne materiały utrzymują jedną paletę na całej planecie i ograniczają
// przełączanie materiałów przy większej liczbie dekoracji.
/**
 * GRADIENT PIONOWY wypalony w wierzchołkach jako MNOŻNIK barwy — ta sama
 * technika, co źdźbła trawy (`zbudujKwiaty`) i pnącze: `vertexColors: true`,
 * a three.js mnoży kolor materiału przez kolor wierzchołka.
 *
 * PO CO. Płaska bryła w jednym kolorze, oświetlona jednym słońcem, ma dokładnie
 * tyle odcieni, ile ma ścianek zwróconych w różne strony — czyli od góry
 * (a tak patrzy kamera tej gry) prawie jeden. Gradient dokłada drugą oś
 * różnicowania, NIEZALEŻNĄ od kąta padania światła: dół bryły jest ciemniejszy
 * i chłodniejszy, góra jaśniejsza i cieplejsza. Tak wygląda roślina, której
 * spód stoi we własnym cieniu, a czubek łapie niebo — i tak wygląda referencja.
 *
 * MNOŻNIK, nie gotowy kolor: dzięki temu `igly` i `iglyCiemne` zostają dwoma
 * różnymi zieleniami, a gradient kładzie się na obie tak samo. Zmiana palety
 * dalej idzie przez jedno miejsce (`MAT_DRZEWA`), nie przez tablice liczb.
 *
 * Wartości > 1 są legalne i celowe — rozjaśniają czubek ponad barwę bazową,
 * dokładnie jak w gradiencie trawy (1,113).
 *
 * `krzywa` > 1 spycha przejście ku górze (dłużej ciemno), < 1 ku dołowi.
 */
function gradientPionowy(geo, dol, gora, krzywa = 1) {
  const poz = geo.attributes.position;
  let minY = Infinity, maxY = -Infinity;
  for (let i = 0; i < poz.count; i++) {
    const y = poz.getY(i);
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  const rozpietosc = (maxY - minY) || 1;
  const barwy = new Float32Array(poz.count * 3);
  for (let i = 0; i < poz.count; i++) {
    const t = Math.pow((poz.getY(i) - minY) / rozpietosc, krzywa);
    barwy[i * 3]     = dol[0] + (gora[0] - dol[0]) * t;
    barwy[i * 3 + 1] = dol[1] + (gora[1] - dol[1]) * t;
    barwy[i * 3 + 2] = dol[2] + (gora[2] - dol[2]) * t;
  }
  geo.setAttribute("color", new Float32BufferAttribute(barwy, 3));
  return geo;
}

/** Zakresy gradientu trzymane w jednym miejscu — stroi się je tutaj, nie w bryłach. */
const GRAD = {
  igly:   [[.70, .76, .68], [1.17, 1.12, .97]],
  pien:   [[.64, .68, .70], [1.10, 1.06, 1.00]],
  lisc:   [[.71, .77, .69], [1.15, 1.12, .96]],
  kapelusz: [[.76, .72, .72], [1.13, 1.06, 1.02]],
  trzon:  [[.72, .74, .77], [1.07, 1.06, 1.02]],
};

/**
 * Materiały drzew MUSZĄ mieć `vertexColors: true`, a każda bryła, która ich
 * używa, MUSI mieć wypalony atrybut `color` — inaczej three.js rysuje ją
 * czarną. Dlatego to osobny zestaw, a nie przełącznik na `MAT_NATURA`:
 * skały i mech z `glaz()` zostają na starych materiałach i nic o gradiencie
 * nie wiedzą.
 */
const matGradient = (kolor) => new MeshLambertMaterial({ color: kolor, flatShading: true, vertexColors: true });

const MAT_DRZEWA = {
  pien: matGradient(0x765331), pienJasny: matGradient(0x91673b),
  igly: matGradient(0x3e793d), iglyCiemne: matGradient(0x2f6536),
  lisc: matGradient(0x579442), liscJasny: matGradient(0x72aa4e),
};

const MAT_NATURA = {
  pien: matKanciasty(0x765331), pienJasny: matKanciasty(0x91673b),
  igly: matKanciasty(0x3e793d), iglyCiemne: matKanciasty(0x2f6536),
  lisc: matKanciasty(0x579442), liscJasny: matKanciasty(0x72aa4e),
  skala: matKanciasty(0x918b78), skalaJasna: matKanciasty(0xaaa38d),
  skalaCiemna: matKanciasty(0x716c60), mech: matKanciasty(0x668b45),
};

/**
 * `faza` obraca CAŁĄ sosnę wokół własnej osi o zadany kąt — domyślnie 0, więc
 * każde dotychczasowe wywołanie daje dokładnie to samo drzewo, co wcześniej.
 * Po co: stożek ma siedem ścian, więc dwie sosny stojące obok siebie w tej
 * samej fazie czytają się jak jeden model postawiony dwa razy. Wystarczy
 * przekręcić drugą o pół ściany i sylwetki przestają się pokrywać, bez
 * dokładania ani jednego wierzchołka.
 */
export function sosna(s = 1, faza = 0) {
  const e = new Group();
  e.name = "sosna-low-poly";
  e.add(mesh(gradientPionowy(new CylinderGeometry(.105*s,.19*s,.88*s,6),...GRAD.pien),MAT_DRZEWA.pien,[0,.44*s,0],[0,.18+faza,0]));
  /* Gradient liczy się w obrębie KAŻDEGO stożka z osobna, nie całego drzewa:
     dzięki temu spód każdego piętra jest ciemny, a jego krawędź jasna — czyli
     piętra odcinają się od siebie także wtedy, gdy patrzy się z góry i światło
     pada na wszystkie tak samo. `krzywa` 1,35 trzyma ciemność przy podstawie
     stożka, żeby jasny był sam rant, a nie połowa piętra. */
  [[1.02,.98],[.84,1.48],[.65,1.94],[.43,2.36]].forEach(([r,y],i) => {
    const p=mesh(gradientPionowy(new ConeGeometry(r*s,.92*s,7),...GRAD.igly,1.35),
      i%2?MAT_DRZEWA.iglyCiemne:MAT_DRZEWA.igly,
      [0,y*s,0],[0,.18+faza+i*.48,(i%2?-.025:.025)]);
    p.scale.set(1,i===0?.82:.94,.88+(i%2)*.08);
    e.add(p);
  });
  return e;
}

export function drzewoLisciaste(s = 1) {
  const e = new Group();
  e.name = "drzewo-lisciaste-low-poly";
  e.add(mesh(gradientPionowy(new CylinderGeometry(.13*s,.22*s,1.25*s,6),...GRAD.pien),MAT_DRZEWA.pien,[0,.58*s,0],[0,.16,0]));
  e.add(mesh(gradientPionowy(new CylinderGeometry(.065*s,.09*s,.66*s,5),...GRAD.pien),MAT_DRZEWA.pienJasny,
    [-.17*s,1.08*s,.02*s],[0,0,.58]));
  e.add(mesh(gradientPionowy(new CylinderGeometry(.06*s,.085*s,.58*s,5),...GRAD.pien),MAT_DRZEWA.pien,
    [.19*s,1.12*s,.02*s],[.12,0,-.62]));
  const korony = [
    [-.45,1.66,.02,.66,.58,.62,0], [.38,1.70,.08,.70,.60,.64,1],
    [-.05,2.12,-.02,.72,.68,.66,0], [.04,1.63,.38,.57,.52,.56,1],
    [.62,1.48,-.04,.43,.40,.44,0],
  ];
  for (const [x,y,z,sx,sy,sz,jasna] of korony) {
    const p=mesh(gradientPionowy(new IcosahedronGeometry(1,1),...GRAD.lisc),
      jasna?MAT_DRZEWA.liscJasny:MAT_DRZEWA.lisc,
      [x*s,y*s,z*s],[.1+x*.2,.35+y*.13,z*.3]);
    p.scale.set(sx*s,sy*s,sz*s);
    e.add(p);
  }
  return e;
}

/**
 * CHOINKA PODWÓJNA — dwa iglaki w jednej kępie.
 *
 * Nie jest nowym modelem, tylko nowym UKŁADEM: bierze dwa razy `sosna()`
 * i stawia je blisko siebie. Tak rosną świerki w realu — z jednego korzenia
 * albo tuż obok, jeden dorosły i jeden młodszy w jego cieniu — i tak wygląda
 * referencja od właściciela. Robienie z tego osobnej bryły byłoby duplikatem
 * tych samych czterech stożków.
 *
 * Trzy rzeczy różnicują bliźniaki, żeby nie czytały się jak kopiuj-wklej:
 * skala (0,92 vs 0,60), faza obrotu (mniejsza przekręcona o ~pół ściany
 * stożka) i mikroskopijny przechył od pionu. Czwarta — przesunięcie — robi
 * z nich kępę, a nie szereg: mniejsza stoi Z TYŁU i z boku, więc z każdej
 * strony jedna zasłania drugą i sylwetka ma głębię.
 *
 * Kotwicą jest ta sama grupa, co u pojedynczego drzewa, więc gibanie
 * (`app.js`) obraca całą kępę naraz — dwa pnie kołyszą się zgodnie, jakby
 * łapał je ten sam podmuch.
 */
export function choinkaPodwojna(s = 1) {
  const e = new Group();
  e.name = "choinka-podwojna-low-poly";

  const duza = sosna(.92 * s, 0);
  duza.position.set(-.26 * s, 0, .13 * s);
  duza.rotation.z = .028;
  e.add(duza);

  const mala = sosna(.74 * s, .45);
  mala.position.set(.30 * s, 0, -.16 * s);
  mala.rotation.z = -.05;
  e.add(mala);

  return e;
}

/* Muchomor ma dwie barwy kapelusza, bo młody grzyb jest jaśniejszy i bardziej
   pomarańczowy niż wyrośnięty. Kropki i trzon celowo NIE są `matKanciasty`:
   fasetowanie na kulce wielkości kropki daje migotanie, a nie fakturę. */
const MAT_GRZYB = {
  // Kapelusz i trzon niosą gradient (patrz `gradientPionowy`), więc muszą mieć
  // `vertexColors`. Kropki i blaszki zostają płaskie: na kulce wielkości kropki
  // gradient jest niewidoczny, a wymusiłby wypalanie atrybutu na sześciu
  // bryłach na każdy grzyb.
  kapelusz: matPlaski(0xc7402c, { flatShading: true, vertexColors: true }),
  kapeluszMlody: matPlaski(0xdd6234, { flatShading: true, vertexColors: true }),
  trzon: matPlaski(0xefe3c6, { vertexColors: true }),
  kropka: matPlaski(0xf7f0dc), blaszki: matPlaski(0xd8c8a2),
};

/**
 * Jeden muchomor. `s = 1` to grzyb wysokości ok. 45 cm — czyli mniej więcej
 * do kolan liska (1 m). To jest bajkowa skala, nie botaniczna: przy prawdziwych
 * 10 cm kępka ginie w trawie i nie ma po co jej stawiać.
 *
 * Kapelusz jest wycinkiem kuli (0 → 0,54π), a nie stożkiem: stożek czyta się
 * jak czubek drzewa, a kopuła od razu jak grzyb. Spód zamyka cienki dysk
 * „blaszek" — bez niego przy kamerze od dołu widać wnętrze kapelusza.
 */
function grzyb(s = 1, mlody = false) {
  const e = new Group();
  const R = .17 * s;
  const yKap = .27 * s;

  e.add(mesh(gradientPionowy(new CylinderGeometry(.050*s, .073*s, .29*s, 7), ...GRAD.trzon), MAT_GRZYB.trzon, [0, .145*s, 0]));
  e.add(mesh(new CylinderGeometry(R*.96, R*.96, .014*s, 9), MAT_GRZYB.blaszki, [0, yKap - .004*s, 0]));

  /* `krzywa` 0,7 wypycha rozjaśnienie w dół kopuły: czubek kapelusza i tak
     łapie najwięcej światła od słońca, więc gradient ma robić ciemny RANT,
     a nie drugie słońce na górze. */
  const kap = mesh(gradientPionowy(new SphereGeometry(R, 9, 5, 0, Math.PI * 2, 0, Math.PI * .54), ...GRAD.kapelusz, .7),
    mlody ? MAT_GRZYB.kapeluszMlody : MAT_GRZYB.kapelusz, [0, yKap, 0]);
  kap.scale.set(1, .84, 1);
  e.add(kap);

  /* Kropki siedzą na kuli kapelusza we współrzędnych sferycznych (azymut,
     kąt od czubka), zanurzone na ~6% promienia, więc wystają jak garbki
     i nie odstają od skosu. Nierówne rozmiary i brak kropki na samym czubku
     — bo równo rozłożone kropki wyglądają jak wzór na tapecie. */
  for (const [az, kat, sk] of [[0.5,0.62,1], [2.2,0.78,.82], [3.7,0.50,.92], [5.1,0.86,.74], [1.4,1.06,.66], [4.3,1.08,.58]]) {
    const r = R * .94;
    const k = mesh(new SphereGeometry(.031 * s * sk, 7, 5), MAT_GRZYB.kropka, [
      Math.sin(kat) * Math.cos(az) * r,
      yKap + Math.cos(kat) * r * .84,
      Math.sin(kat) * Math.sin(az) * r,
    ]);
    e.add(k);
  }
  return e;
}

/**
 * KĘPKA GRZYBÓW — duży i mały, dokładnie jak na referencji.
 *
 * Dwa, nie trzy i nie jeden: pojedynczy grzyb wygląda jak zgubiony rekwizyt,
 * a trójka zaczyna konkurować z kwiatami o uwagę. Para czyta się jako
 * „tu coś rośnie" i tyle ma robić.
 *
 * Mały jest odwrócony w inną stronę i lekko odchylony — ten sam zabieg, co
 * przy choince: te same bryły, inna faza, więc nie widać powtórki.
 */
export function grzyby(s = 1) {
  const e = new Group();
  e.name = "grzyby-low-poly";

  const duzy = grzyb(s, false);
  duzy.position.set(-.05 * s, 0, .02 * s);
  duzy.rotation.set(0, .42, .045);
  e.add(duzy);

  const maly = grzyb(.54 * s, true);
  maly.position.set(.185 * s, 0, -.085 * s);
  maly.rotation.set(0, -1.15, -.07);
  e.add(maly);

  return e;
}

/**
 * DRZEWO DOMKOWE — to jedno drzewo, na którym stanie domek.
 *
 * PIEŃ JEST MODELEM, NIE KODEM (decyzja właściciela 2026-09-16).
 * Bryłę daje `assets/tree.glb` — drzewo rzeźbione pod to miejsce, wysłane
 * przez właściciela jako `public/tree.fbx` i przekonwertowane bez zmian
 * kształtu (FBX jest Z-up, więc model dostał ćwierć obrotu, podstawę na y=0
 * i stracił jednolity kolor wierzchołków — barwę daje scena). Wcześniej stało
 * tu `suche_drzewko.glb` w zastępstwie; ten model ma to, czego tamten nie
 * miał: pień pod skosem i konary na wysokości pomostu. Nagi pień plus
 * dorobiona zielona korona to drzewo żywe — i o to chodziło.
 *
 * TEN PLIK ROBI WIĘC TYLKO TO, CZEGO W MODELU NIE MA: koronę. Pień dokłada
 * `app.js`, bo wczytanie `.glb` jest asynchroniczne, a `zbudujSwiat` musi
 * zwrócić świat od razu.
 *
 * POMOST LEŻY NA KONARZE Z MODELU. To umowa między `swiat.js`
 * a `schronienie.js`: deski idą w +X, na wysokości `poziom`, do `zasiegKonaru`
 * — a te trzy liczby nie są gustem, tylko odczytem z bryły. Kto podmieni
 * model, musi je policzyć od nowa; kto je ruszy bez modelu, zawiesi pomost
 * w powietrzu.
 */
export const DOMEK_DRZEWO = {
  /** Ile razy powiększyć model (`tree.glb` ma 5,91 wysokości). */
  skalaModelu: 0.66,
  /**
   * JAK GŁĘBOKO PIEŃ SIEDZI W ZIEMI, w jednostkach korony.
   *
   * Model kończy się na dole PŁASKIM CIĘCIEM — postawiony dokładnie na darni
   * pokazuje tę ściętą podeszwę i wygląda, jakby go ktoś położył na trawie,
   * a nie jakby z niej wyrósł. Zanurzenie chowa cięcie i dolną część nabiegu
   * korzeniowego; to, co zostaje nad ziemią, czyta się jak korzenie wchodzące
   * w darń. Za mało — widać podeszwę; za dużo — drzewo traci nabieg i robi się
   * z niego słupek wbity w trawnik.
   */
  zanurzeniePnia: 0.34,
  /**
   * Obrót modelu wokół pionu, w radianach.
   *
   * Pomost wychodzi zawsze w +X — to umowa między tym plikiem
   * a `schronienie.js`. Model ma gałęzie tam, gdzie chciał rzeźbiarz, więc to
   * DRZEWO się kręci do pomostu, nie odwrotnie. 182° ustawia pod deskami ten
   * konar, który w modelu jest najbardziej poziomy i sięga najdalej (do 1,41
   * w tych jednostkach, na wysokości 2,58). Bez tego pomost wychodził
   * w pustkę między gałęziami i wyglądał jak doklejony.
   */
  obrotModelu: 3.176,
  /* PRZESUNIĘCIE PNIA względem kotwicy, w jednostkach korony — na dostrojenie.
     Zera są tu WYPRACOWANE, nie domyślne: bryła z ZBrusha miała środek pół
     jednostki obok osi pnia, więc klepisko, cień i kolizja siedziały w trawie
     obok drzewa, a nie pod nim. Model przepieczono tak, że podstawa pnia
     wypada dokładnie w kotwicy — i dlatego te trzy liczby mogą być zerami.
     Kto podmieni `tree.glb`, prawdopodobnie zobaczy to samo rozjechanie. */
  pienX: 0,
  pienY: 0,
  pienZ: 0,
  /**
   * Wysokość, na której leży pomost (w jednostkach kotwicy drzewa).
   * NIE JEST WYBRANA Z OKA: tyle ma wierzch konaru z modelu na odcinku, na
   * którym leżą deski. Zmiana obrotu albo modelu zmienia tę liczbę.
   */
  poziom: 2.60,
  /** Dokąd sięga konar z modelu — pomost nie może być dłuższy. */
  zasiegKonaru: 1.41,

  /* ── POMOST ── liczby, których używa `schronienie.js`. Leżą tutaj, a nie
     tam, bo razem z `poziom` i `zasiegKonaru` opisują JEDNO: gdzie na tym
     drzewie kończy się gałąź, a zaczyna deska. */
  /** Gdzie zaczynają się deski, licząc od osi pnia. */
  pomostOd: 0.20,
  /** Połowa szerokości pomostu. */
  pomostPol: 0.56,
  /** Promień klepiska — wydeptanej ziemi pod drzewem. */
  klepiskoR: 1.06,
  /** Wysokość barierki. */
  barierka: 0.50,
  /* ── CHATKA ── tylko ona, bez drzewa i pomostu (`schronienie.js`, etap 1). */
  /** Wysokość ścian; okna, nadproże i dach idą za nią. */
  wysokoscScian: 0.62,
  /** Szerokość otworu drzwi (front od strony drabinki). */
  szerokoscDrzwi: 0.44,
  /** Głębokość ganku przed drzwiami — reszta pomostu to dom. */
  ganek: 0.34,
  /** O ile stopa drabinki jest odsunięta za krawędź desek. */
  drabinkaOdsun: 0.62,
  /**
   * Długość drabinki jako KROTNOŚĆ odległości od ziemi do pokładu.
   * 1,0 = kończy się równo z deskami. Powyżej — wystaje ponad pomost, czyli
   * tak, jak stawia się drabinę pod prawdziwy właz: jest się czego złapać,
   * wchodząc na górę. Stopa zostaje na ziemi bez względu na tę liczbę.
   */
  drabinkaDlugosc: 1.0,

  /* ── KORONA ── kule na końcach konarów: [x, y, z, promień, jasna].
     Współrzędne są ODCZYTEM Z MODELU (patrz komentarz w `drzewoDomkowe`).
     Edytor w grze nadpisuje tę listę przez `mapa.schronienie.uklad`. */
  korony: [
    [1.58, 3.95, -0.38, 0.85, 0],   // czubek, najwyższy konar
    [0.76, 3.68, -1.42, 0.72, 1],
    [0.96, 3.30, -1.05, 0.68, 0],
    /* Koniec konaru pod pomostem. ODSUNIĘTY W +Z, bo drabinka stoi dokładnie
       w osi Z=0 przed deskami — kula na wprost połykała ją w całości i pomost
       wyglądał, jakby wchodziło się do niego przez krzak. */
    [1.96, 3.25, 0.95, 0.70, 1],
    [-1.01, 2.92, -2.22, 0.70, 1],
    [-2.01, 3.32, -0.74, 0.72, 0],
  ],
};

/**
 * UKŁAD DOMKU = wartości domyślne z `DOMEK_DRZEWO` przykryte tym, co stoi
 * w mapie (`schronienie.uklad`).
 *
 * PO CO TA WARSTWA. Te liczby są odczytem z bryły, więc w kodzie mają sens
 * jako punkt wyjścia — ale ustawia je oko, nie rachunek, i robi to właściciel
 * przy włączonej grze (`edytorDomku.js`). Trzymanie ich w mapie znaczy, że
 * poprawka z suwaka zostaje w projekcie i jedzie na produkcję razem z resztą
 * świata, zamiast żyć w czyjejś przeglądarce.
 *
 * Kopiujemy głęboko listę koron, żeby edytor nie mazał po module.
 */
export function ukladDomku(def) {
  const z = def && typeof def.uklad === "object" && def.uklad ? def.uklad : {};
  const u = { ...DOMEK_DRZEWO, ...z };
  const zrodlo = Array.isArray(z.korony) && z.korony.length ? z.korony : DOMEK_DRZEWO.korony;
  u.korony = zrodlo.map((k) => [
    Number(k[0]) || 0, Number(k[1]) || 0, Number(k[2]) || 0,
    Number(k[3]) || 0.5, k[4] ? 1 : 0,
  ]);
  return u;
}

/**
 * Zanurzenie kotwicy DOMKU pod darnią — w jednostkach świata, nie skalowane.
 * Tyle wystarczy, żeby klepisko nie fruwało nad trawą; głębiej nie ma po co,
 * bo na tej kotwicy nie stoi nic, co musi wyglądać na wrośnięte w ziemię.
 * Sceną rządzi `app.js` (`_osadz`), ale liczbę trzyma tu, bo `schronienie.js`
 * musi ją znać, żeby policzyć różnicę kotwic.
 */
export const ZANURZENIE_DOMKU = 0.02;

/**
 * Barwa pnia domkowego: kora żywego drzewa, nie suche drewno stosu.
 *
 * TA SAMA BARWA, CO PNIE POZOSTAŁYCH DRZEW (właściciel, 2026-09-17):
 * `MAT_DRZEWA.pien` / `MAT_NATURA.pien` to 0x765331 i drzewo domkowe nie ma
 * powodu być inne — własny, ciemniejszy brąz (0x6f4e2e, potem 0x614e3c)
 * wyróżniał je na polanie bez powodu. Różnica: tamte pnie mają pionowy
 * gradient z `GRAD.pien` (ciemniej u dołu), a ten jest modelem GLB bez
 * barw wierzchołków — czyta się więc odrobinę równiej.
 */
export const MAT_PIEN_DOMKU = matKanciasty(0x765331);

/**
 * Korona — jedyne, czego w modelu nie ma. Dodaje się to do tej samej kotwicy,
 * w której siedzi wczytany pień.
 */
export function drzewoDomkowe(s = 1, uklad = DOMEK_DRZEWO) {
  const e = new Group();
  e.name = "drzewo-domkowe";

  /* KONARA NIE RYSUJEMY. Miał go poprzedni model, który pod pomostem nie miał
     nic — ten ma gałąź dokładnie tam, gdzie leżą deski (stąd `obrotModelu`
     i `poziom` policzone z bryły). Dokładanie do niej drugiej, kodowej belki
     dawało dwie podpory obok siebie i bałagan pod pokładem.

     KORONA TO KULE NA KOŃCACH KONARÓW, nie jedna bryła na pniu (referencja od
     właściciela, 2026-09-16). To jest cała różnica między „drzewem" a „krzakiem
     nadzianym na patyk": liście rosną tam, gdzie kończy się gałąź. Punktem
     wyjścia są KOŃCE KONARÓW WYLICZONE Z MODELU (`DOMEK_DRZEWO.korony`),
     a ostateczne miejsca ustawia właściciel suwakami — patrz `ukladDomku`.

     Kula przy pomoście (ta najdalej w +X) siedzi ZA deskami, nie nad nimi:
     liście mają muskać krawędź pomostu, a nie go przykrywać. */
  const korony = uklad.korony || DOMEK_DRZEWO.korony;
  for (const [x, y, z, r, jasna] of korony) {
    const k = mesh(gradientPionowy(new IcosahedronGeometry(1, 1), ...GRAD.lisc),
      jasna ? MAT_DRZEWA.liscJasny : MAT_DRZEWA.lisc,
      [x * s, y * s, z * s], [.1 + x * .2, .35 + y * .13, z * .3]);
    /* Lekko spłaszczone i nierówne: idealne kule w rzędzie czytają się jak
       koraliki. Odchyłkę bierzemy z pozycji, żeby była stała między sesjami. */
    k.scale.set(r * s, r * (.88 + (Math.abs(x) % .17)) * s, r * (.96 + (Math.abs(z) % .13)) * s);
    e.add(k);
  }
  return e;
}

/**
 * GDZIE JEST GRUNT pod punktem (dx, dz) układu kotwicy — w tym samym układzie,
 * czyli zwykle liczba UJEMNA.
 *
 * PO CO. Kotwica to płaszczyzna STYCZNA do kuli, a kula spod niej ucieka:
 * trzy jednostki w bok od kotwicy ziemia jest już o pół jednostki niżej
 * (przy R = 8,5). Wszystko, co stoi przy kotwicy, tego nie odczuwa — ale
 * stopa drabinki odsunięta od pnia wisiała w powietrzu i wyglądało to na błąd
 * skali, a nie na geometrię kuli. Do tego dochodzi falowanie terenu.
 *
 * `gruntSrodka` można podać z zewnątrz, gdy liczy się wiele punktów naraz
 * (patrz `taflaNaGruncie`) — inaczej wysokość pod kotwicą liczy się sama.
 */
export function punktNaGruncie(planeta, kotwica, dx, dz, wysokoscGruntu, przeswit = 0, gruntSrodka = null) {
  const R = planeta.R;
  const luk = Math.sqrt(Math.max(0, R * R - dx * dx - dz * dz)) - R;
  if (!wysokoscGruntu) return luk + przeswit;
  const v = new Vector3();
  const m = { x: 0, z: 0, h: 0 };
  kotwica.updateMatrix();
  const naMape = (ax, ay, az) => {
    v.set(ax, ay, az).applyMatrix4(kotwica.matrix);
    planeta.zKuli(v, m);
    return m;
  };
  let g0 = gruntSrodka;
  if (g0 == null) { const s0 = naMape(0, 0, 0); g0 = wysokoscGruntu(s0.x, s0.z); }
  const t = naMape(dx, luk, dz);
  return luk + (wysokoscGruntu(t.x, t.z) - g0) + przeswit;
}

/**
 * TAFLA NA GRUNCIE — koło, które LEŻY na terenie, a nie na płaszczyźnie
 * stycznej do kuli.
 *
 * PO CO. `CircleGeometry` jest płaskie, a planeta ma promień 8,5. Tarcza
 * o promieniu 1 styka się z kulą tylko w środku i odstaje na brzegu o 6 cm
 * (√(R²−r²) − R). Środek leży więc DOKŁADNIE na terenie — a teren jest
 * trójkątną siatką z własnym falowaniem (zmierzone: 4 cm rozrzutu na
 * przestrzeni tej tarczy). Efekt: kilka trójkątów darni przebija przez
 * środek klepiska i widać ZIELONĄ DZIURĘ, której nie ma w geometrii.
 *
 * Tarcza dostaje więc tyle wierzchołków, ile trzeba, żeby iść za kulą
 * (`luk`) i za terenem (`wysokoscGruntu`), plus stały `przeswit` nad darnią.
 * Ta sama sztuczka, co krąg podlewania w `fasola.js`.
 *
 * Geometria powstaje w układzie KOTWICY (tej z `_osadz`), więc mesh dodaje
 * się do grupy w kotwicy bez żadnego obrotu ani przesunięcia.
 */
export function taflaNaGruncie(planeta, kotwica, r, wysokoscGruntu, przeswit = .03, punkty = 48, ringi = 5) {
  const R = planeta.R;
  const pos = [], idx = [];
  const v = new Vector3();
  const m = { x: 0, z: 0, h: 0 };
  kotwica.updateMatrix();

  const naMape = (dx, dy, dz) => {
    v.set(dx, dy, dz).applyMatrix4(kotwica.matrix);
    planeta.zKuli(v, m);
    return m;
  };
  const srodek = naMape(0, 0, 0);
  const gruntSrodka = wysokoscGruntu ? wysokoscGruntu(srodek.x, srodek.z) : 0;

  /* Ta sama formuła, co w `punktNaGruncie` — tylko tam liczona raz, a tu dwieście
     razy, więc `gruntSrodka` bierzemy z zewnątrz zamiast liczyć go w kółko. */
  const wysokosc = (dx, dz) =>
    punktNaGruncie(planeta, kotwica, dx, dz, wysokoscGruntu, przeswit, gruntSrodka);

  pos.push(0, wysokosc(0, 0), 0);
  for (let i = 1; i <= ringi; i++) {
    const rr = r * (i / ringi);
    for (let j = 0; j < punkty; j++) {
      const t = (j / punkty) * Math.PI * 2;
      const dx = Math.cos(t) * rr, dz = Math.sin(t) * rr;
      pos.push(dx, wysokosc(dx, dz), dz);
    }
  }
  for (let j = 0; j < punkty; j++) idx.push(0, 1 + j, 1 + (j + 1) % punkty);
  for (let i = 1; i < ringi; i++) {
    const a0 = 1 + (i - 1) * punkty, b0 = 1 + i * punkty;
    for (let j = 0; j < punkty; j++) {
      const j2 = (j + 1) % punkty;
      idx.push(a0 + j, b0 + j, b0 + j2, a0 + j, b0 + j2, a0 + j2);
    }
  }

  /* NAWINIĘCIE. W układzie XZ z osią Y do góry iloczyn wektorowy kierunku
     promieniowego i stycznego daje −ŷ, więc kolejność „środek → j → j+1"
     wychodzi spodem do góry. Odwracamy płaską listę indeksów — to odwraca
     też kolejność wierzchołków w każdym trójkącie. */
  idx.reverse();

  const g = new BufferGeometry();
  g.setAttribute("position", new Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  /* NORMALNE NA SZTYWNO W GÓRĘ, a nie z `computeVertexNormals`. Tafla jest
     naklejką na ziemi: ma trzymać się terenu KSZTAŁTEM, ale świecić równo —
     tak, jak świeciła płaska tarcza, którą zastępuje. Policzone normalne idą
     za falowaniem darni i klepisko robi się plamiaste: ciemniejsze wszędzie
     tam, gdzie grunt odchyla się od słońca. W układzie kotwicy +Y to i tak
     normalna powierzchni w tym miejscu kuli. */
  const nor = new Float32Array(pos.length);
  for (let i = 1; i < nor.length; i += 3) nor[i] = 1;
  g.setAttribute("normal", new Float32BufferAttribute(nor, 3));
  return g;
}

/**
 * UV DLA TAFLI Z `taflaNaGruncie` — kolowe, liczone z pozycji w plaszczyznie XZ.
 *
 * PO CO. Tafla powstaje jako czysta siatka pozycji i normalnych: klepisko jest
 * jednolita barwa i UV mu nie potrzeba. Ale plama cienia to TEKSTURA
 * (gradient z `plamaCienia`) — bez wspolrzednych wyszlaby rownym prostokatem
 * koloru zamiast miekkiej plamy. Srodek tafli ma wypasc w srodku tekstury,
 * a brzeg dokladnie tam, gdzie gradient schodzi do zera: stad `.5 + x/(2r)`.
 * V idzie w dol, bo os Z rosnie „w glab", a V tekstury w dol obrazka.
 */
export function uvKolowe(geo, r) {
  const poz = geo.getAttribute("position");
  const uv = new Float32Array(poz.count * 2);
  for (let i = 0; i < poz.count; i++) {
    uv[i * 2] = .5 + poz.getX(i) / (2 * r);
    uv[i * 2 + 1] = .5 - poz.getZ(i) / (2 * r);
  }
  geo.setAttribute("uv", new Float32BufferAttribute(uv, 2));
  return geo;
}

/** Trzy układy skał; `maly` tworzy pojedynczy kamień satelitarny. */
export function glaz(s = 1, maly = false, wariant = 0) {
  const e = new Group();
  wariant = ((wariant|0)%3+3)%3;
  e.name = maly ? "kamyk-low-poly" : "skaly-low-poly";
  e.userData.wariantSkaly = wariant;
  const bryla = (r, detal, mat, pos, rot, skala) => {
    const p=mesh(new DodecahedronGeometry(r*s,detal),mat,pos.map(v=>v*s),rot);
    p.scale.set(...skala);
    e.add(p);
    return p;
  };
  if (maly) {
    const ksztalty = [[1.22,.55,.88],[.96,.72,1.18],[1.34,.48,.78]];
    bryla(.48,wariant===1?1:0,wariant===2?MAT_NATURA.skalaCiemna:MAT_NATURA.skala,
      [0,.16,0],[.45+wariant*.22,.9-wariant*.18,.2+wariant*.3],ksztalty[wariant]);
    return e;
  }
  if (wariant===0) {
    // Łamany monolit: niewiele elementów, duże trójkątne płaszczyzny.
    bryla(.67,0,MAT_NATURA.skala,[0,.40,0],[.20,.73,.08],[1.12,.92,.86]);
    bryla(.39,0,MAT_NATURA.skalaJasna,[.48,.22,.12],[.78,.18,.46],[1.06,.66,.92]);
    bryla(.27,1,MAT_NATURA.skalaCiemna,[-.46,.16,.25],[.42,.62,.16],[1.18,.58,.88]);
    bryla(.25,1,MAT_NATURA.mech,[-.08,.73,-.02],[0,.4,0],[1.25,.13,.82]);
  } else if (wariant===1) {
    // Niskie płyty: szeroki ciężar przy ziemi i wyraźne uskoki wysokości.
    bryla(.60,0,MAT_NATURA.skalaCiemna,[0,.27,0],[.12,.42,.06],[1.34,.58,1.02]);
    bryla(.46,0,MAT_NATURA.skalaJasna,[-.15,.50,.01],[.05,.86,-.10],[1.12,.48,.84]);
    bryla(.34,1,MAT_NATURA.skala,[.50,.18,.19],[.64,.28,.52],[1.20,.55,.95]);
    bryla(.23,0,MAT_NATURA.skalaJasna,[-.56,.13,-.10],[.32,.98,.16],[1.10,.48,.80]);
    bryla(.28,1,MAT_NATURA.mech,[-.13,.69,.01],[0,.2,0],[1.38,.10,.72]);
  } else {
    // Rumowisko: więcej mniejszych brył, nieregularny obrys i gęsty środek.
    bryla(.51,0,MAT_NATURA.skala,[0,.31,.02],[.30,.74,.14],[1.08,.78,.96]);
    bryla(.42,0,MAT_NATURA.skalaJasna,[.44,.25,.08],[.78,.18,.54],[1.08,.69,.90]);
    bryla(.37,0,MAT_NATURA.skalaCiemna,[-.43,.21,.17],[.42,.91,.22],[1.18,.62,.86]);
    bryla(.29,1,MAT_NATURA.skala,[.18,.17,-.42],[.28,.36,.68],[1.24,.55,.82]);
    bryla(.24,0,MAT_NATURA.skalaJasna,[-.19,.14,-.40],[.72,.52,.18],[1.04,.58,.94]);
    bryla(.24,1,MAT_NATURA.mech,[.01,.60,-.02],[0,.4,0],[1.18,.12,.74]);
  }
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

/**
 * KŁADKA. Bez argumentów — dawny most w komplecie (siedem desek, słupki,
 * sznur), więc stare wywołanie z `zbudujSwiat` nic nie zmienia.
 *
 * Hybryda `kladka-nad-oczkiem` (05 karta 3) buduje ją etapami:
 *   `deski`: "pelne" (jak dawniej) | "brak" (tylko dwie skrajne — „kładka ma
 *            tylko brzegi") | "plaska" (deski) | "harmonijka" (zygzak) |
 *            "rurka" (walce) | "przemiennie" (deski i walce na zmianę)
 *   `porecz`: sznur na słupkach (po zauważeniu przez Mentora)
 * `userData.ustaw({ deski, porecz })` przebudowuje środek bez ruszania
 * kotwicy — kładka stoi, zmienia się tylko to, co dziecko sprawdziło.
 */
export function most({ deski = "pelne", porecz = true } = {}) {
  const s = new Group();
  s.name = "most";
  const srodek = new Group();
  srodek.name = "most-srodek";
  s.add(srodek);
  const zbuduj = ({ deski: d = "pelne", porecz: p = true } = {}) => {
    while (srodek.children.length) srodek.remove(srodek.children[0]);
    const skrajne = d === "brak" ? [-3, 3] : [-3, -2, -1, 0, 1, 2, 3];
    for (const e of skrajne) {
      const y = 0.16 + Math.cos(e * 0.4) * 0.09, rx = Math.sin(e * 0.4) * 0.09;
      const mat = matKanciasty(e % 2 ? KOLORY.wood : KOLORY.woodDark);
      const wewn = Math.abs(e) < 3;
      if (wewn && d === "harmonijka") {
        // Zygzak: dwie połówki deski złożone daszkiem, jak kartka-harmonijka.
        for (const st of [-1, 1]) {
          srodek.add(mesh(new BoxGeometry(2.2, 0.06, 0.2), mat, [0, y + 0.04, e * 0.38 + st * 0.085], [rx + st * 0.75, 0, 0]));
        }
      } else if (wewn && (d === "rurka" || (d === "przemiennie" && e % 2))) {
        srodek.add(mesh(new CylinderGeometry(0.11, 0.11, 2.2, 8), mat, [0, y + 0.03, e * 0.38], [rx, 0, Math.PI / 2]));
      } else {
        srodek.add(mesh(new BoxGeometry(2.2, 0.1, 0.34), mat, [0, y, e * 0.38], [rx, 0, 0]));
      }
    }
    for (const e of [-1, 1]) {
      for (const t of [-1, 1]) {
        srodek.add(mesh(new BoxGeometry(0.14, 0.7, 0.14), matKanciasty(KOLORY.woodDark), [e * 1, 0.45, t * 1.25]));
        srodek.add(mesh(new SphereGeometry(0.09, 6, 5), matKanciasty(KOLORY.wood), [e * 1, 0.84, t * 1.25]));
      }
      if (p) srodek.add(mesh(new CylinderGeometry(0.03, 0.03, 2.5, 5), matPlaski(KOLORY.rope), [e * 1, 0.62, 0], [Math.PI / 2, 0, 0]));
    }
    s.userData.deski = d;
    s.userData.porecz = p;
  };
  zbuduj({ deski, porecz });
  s.userData.ustaw = zbuduj;
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

/* ── KWIATY I TRAWA (InstancedMesh) ─────────────────────────────────────────── */

/**
 * Mierzy faktyczną wysokość fasetowanego terenu w układzie mapy. Dekoracje
 * nie mogą bazować wyłącznie na idealnym promieniu planety, bo na horyzoncie
 * nawet mała różnica odsłania szczelinę pod pniem lub kamieniem.
 */
function utworzMiernikGruntu(planeta, ziemia) {
  // Probe in planet-local space, so subsequent globe rotations cannot affect rooting.
  const podloze = new Mesh(ziemia.geometry, ziemia.material);
  podloze.updateMatrixWorld(true);
  ziemia.geometry.computeBoundingSphere();
  const zasieg = ziemia.geometry.boundingSphere.radius + 1;
  const promien = new Raycaster();
  const normalna = new Vector3();
  const poczatek = new Vector3();
  const kierunek = new Vector3();
  return function wysokoscGruntu(x, z) {
    planeta.normalna(x, z, normalna);
    promien.set(poczatek.copy(normalna).multiplyScalar(zasieg), kierunek.copy(normalna).negate());
    const hit = promien.intersectObject(podloze, false)[0];
    return (hit ? hit.point.dot(normalna) - planeta.R : 0) - .008;
  };
}

/**
 * ŹDŹBŁO TRAWY — jedna geometria i jeden materiał na cały świat.
 *
 * Mają je dwa systemy: pęki z zasiewu (`zbudujKwiaty`, rosną pod stopami
 * liska) i kołnierze przy pniach (`trawaPrzyPniach`). Gdyby każdy budował
 * swoją kopię, byłyby to dwa materiały, dwie geometrie i dwa miejsca, w
 * których trzeba poprawić odcień. Liczymy raz i oddajemy tę samą bryłę —
 * `InstancedMesh` i tak trzyma wszystko w macierzach instancji.
 */
let _zdzblo = null;
function zdzbloTrawy() {
  if (_zdzblo) return _zdzblo;
  const ZDZBLA = 18;
  /**
   * ŹDŹBŁO — bryła z modelu (`traw.fbx`), nie płatek.
   *
   * Poprzednie źdźbło było płaskim, dwustronnym liściem: z boku znikało, bo
   * nie miało grubości. To jest pięciopierścieniowy graniastosłup, taki sam
   * jak w modelu: wąski przy nasadzie, najszerszy mniej więcej w połowie,
   * zwężony w czubku, i wygięty o jakieś 44° od pionu. Nasada siedzi w
   * (0,0,0) i źdźbło rośnie w +Y, więc reszta kodu (skala h, obrót wokół Y)
   * działa bez zmian; łuk idzie w +Z, a obrót instancji rozrzuca go dookoła.
   *
   * Denka przy nasadzie NIE MA — i tak jest pod ziemią.
   */
  const gTrawa = new BufferGeometry();
  gTrawa.setAttribute("position", new Float32BufferAttribute([
    -.09,-.006,-.048, -.222,.978,.954, -.22,.926,1.003,
    -.116,-.016,.013, .092,.006,.048, .111,.017,-.013,
    -.147,.949,1.022, -.147,1,.973, -.009,-.005,.031,
    .013,.005,-.031, -.182,.938,1.012, -.183,.989,.963,
    -.307,.65,.188, -.312,.621,.228, -.019,.694,.268,
    -.022,.665,.306, -.163,.643,.267, -.159,.672,.228,
    -.297,.86,.531, -.293,.821,.574, -.067,.902,.586,
    -.066,.864,.627, -.175,.843,.6, -.177,.881,.558,
    -.197,.361,-.049, -.219,.34,-.003, .061,.399,.021,
    .046,.378,.065, -.083,.359,.031, -.065,.38,-.014,
  ], 3));
  /**
   * GRADIENT wzdłuż źdźbła wypalony w wierzchołkach jako MNOŻNIK barwy:
   * przy ziemi ciemno i chłodno, w czubku jaśniej i cieplej — tak jak trawa,
   * której dolna część stoi we własnym cieniu. Mnożnik, a nie gotowy kolor,
   * bo `instanceColor` dalej daje każdemu źdźbłu swój odcień z `barwyTrawy`;
   * three.js mnoży jedno przez drugie, więc pęk zostaje różnorodny.
   */
  gTrawa.setAttribute("color", new Float32BufferAttribute([
    .72,.78,.62, 1.113,1.094,.817, 1.096,1.081,.808,
    .72,.78,.62, .726,.785,.623, .735,.792,.628,
    1.103,1.087,.812, 1.12,1.1,.82, .72,.78,.62,
    .726,.785,.623, 1.1,1.084,.81, 1.117,1.097,.818,
    1.003,1.007,.762, .993,.999,.757, 1.019,1.019,.769,
    1.009,1.011,.764, 1.001,1.005,.761, 1.011,1.013,.766,
    1.075,1.064,.797, 1.062,1.053,.791, 1.088,1.075,.804,
    1.076,1.065,.798, 1.069,1.059,.794, 1.082,1.069,.801,
    .897,.922,.709, .889,.915,.704, .912,.934,.716,
    .904,.927,.712, .896,.921,.708, .905,.928,.712,
  ], 3));
  gTrawa.setIndex([
    10,11,1, 2,10,1, 6,7,11, 10,6,11, 19,18,12, 13,19,12,
    2,1,18, 19,2,18, 21,20,7, 6,21,7, 15,14,20, 21,15,20,
    21,22,16, 15,21,16, 6,10,22, 21,6,22, 22,19,13, 16,22,13,
    10,2,19, 22,10,19, 18,23,17, 12,18,17, 1,11,23, 18,1,23,
    23,20,14, 17,23,14, 11,7,20, 23,11,20, 25,24,0, 3,25,0,
    13,12,24, 25,13,24, 27,26,14, 15,27,14, 4,5,26, 27,4,26,
    27,28,8, 4,27,8, 15,16,28, 27,15,28, 28,25,3, 8,28,3,
    16,13,25, 28,16,25, 24,29,9, 0,24,9, 12,17,29, 24,12,29,
    29,26,5, 9,29,5, 17,14,26, 29,17,26,
  ]);
  /**
   * Proporcje modelu kontra skala świata. Źdźbło z pliku jest szerokie na
   * ~0,31 swojej długości i wygięte o 44° — jako samodzielny obiekt wygląda
   * dobrze, ale w pęku, oglądanym z góry, takie łopatki układają się w rozetę
   * zamiast w trawę. Ściskamy więc PRZEKRÓJ i ŁUK, zostawiając sylwetkę:
   * wąska nasada, zgrubienie w połowie, zwężony czubek. Liczby w tablicy
   * zostają surowe (to model), całe strojenie siedzi w tej jednej linii.
   */
  gTrawa.scale(1.05, 1, .4);
  gTrawa.computeVertexNormals();
  // Bryła ma grubość, więc `DoubleSide` nie jest już potrzebne — tylnych
  // ścianek i tak nie widać, a rysowanie ich kosztuje przy 18 źdźbłach na pęk.
  const mTrawa = new MeshLambertMaterial({ color: 0xffffff, flatShading: true, vertexColors: true });
  // Odcienie podniesione o ~10%, bo gradient wierzchołkowy jest w średniej
  // ciemniejszy od jedynki i bez tego cały pęk zszedłby w ciemną zieleń.
  const barwyTrawy = [new Color(0x58913c), new Color(0x6fa84a), new Color(0x86bb58)];
  _zdzblo = { ZDZBLA, gTrawa, mTrawa, barwyTrawy };
  return _zdzblo;
}

/**
 * KOŁNIERZ TRAWY U PODSTAWY PNIA.
 *
 * Pień wchodzi w darń płaskim ściętym walcem i ta styczna linia jest widoczna
 * z każdej strony — zwłaszcza na stoku, gdzie fasetka terenu podchodzi pod
 * kąt. Kępka trawy dookoła nasady chowa tę linię i robi z drzewa coś, co
 * z ziemi WYROSŁO, a nie zostało w nią wbite.
 *
 * TA SAMA ZASADA, CO W PĘKACH: źdźbła stoją do siebie grzbietami, czubkami
 * na zewnątrz — tyle że „na zewnątrz" liczy się tu od ŚRODKA PNIA, nie od
 * środka kępki. Bryła źdźbła jest wygięta w +Z, a obrót wokół Y o θ przenosi
 * +Z na `(sin θ, cos θ)`, więc dla kierunku promienistego `(cos k, sin k)`
 * właściwe jest θ = π/2 − k. (Na tym samym błędzie znaku siedziała do 18.09
 * cała trawa z zasiewu.)
 *
 * WSZYSTKO W JEDNYM `InstancedMesh` — dwadzieścia parę drzew razy kilkanaście
 * źdźbeł to trzysta brył; jako osobne obiekty byłoby to trzysta wywołań
 * rysowania na każdą klatkę.
 *
 * GRUNT MIERZYMY RAZ NA PIEŃ, nie raz na źdźbło: `wysokoscGruntu` to raycast
 * w całą siatkę terenu, a kołnierz ma promień poniżej pół jednostki, więc
 * teren pod nim jest praktycznie płaski. Zamiast tego chowamy nasadę głębiej
 * niż w pękach (dwanaście procent wysokości), żeby na stoku żadne źdźbło nie
 * zawisło nad darnią.
 *
 * `pnie`: `[{ x, z, promien, skala, seed }]` — `promien` to promień pnia przy
 * ziemi, bo od niego liczy się, gdzie trawa ma się zacząć.
 */
export function trawaPrzyPniach(pnie, planeta, wysokoscGruntu) {
  const { gTrawa, mTrawa, barwyTrawy } = zdzbloTrawy();
  /* ZIARNO BYWA UJEMNE. Liczymy je z pozycji drzewa, a połowa mapy leży po
     ujemnej stronie osi — przy `x` ujemnym `x / 4294967296` też wychodziło
     ujemne, więc `Math.floor(los() * 3)` dawało indeks −1, a `setColorAt`
     dostawało `undefined` i wywalało całą scenę przy wczytywaniu. Wcześniejsze
     `losownik` w tym pliku tego nie widziały, bo wołane są wyłącznie
     z licznikami dodatnimi.
     `Math.imul` mnoży dokładnie w trzydziestu dwóch bitach, a `>>> 0` trzyma
     wynik bez znaku — losy są przez to zawsze w [0, 1). */
  const los1 = (z) => {
    let x = Math.imul(Math.trunc(z) | 0, 2654435761) >>> 0;
    return () => { x = (Math.imul(x, 1664525) + 1013904223) >>> 0; return x / 4294967296; };
  };

  /* Scratch: kotwica na kuli → korzeń (miejsce i pochylenie) → źdźbło (obrót
     twarzy i skala). Ta sama trójka, co przy pękach — macierz świata czytamy
     z najgłębszego ogniwa. */
  const wKula = new Group(), korzen = new Group(), zdzblo = new Group();
  wKula.add(korzen); korzen.add(zdzblo);

  const wpisy = [];
  for (const p of pnie || []) {
    if (!p || !Number.isFinite(p.x) || !Number.isFinite(p.z)) continue;
    const promien = p.promien || .19 * (p.skala || 1);
    const los = los1((p.seed ?? Math.round((p.x * 131 + p.z * 977) * 100)) | 0);
    /* WSZYSTKO SKALUJE SIĘ GRUBOŚCIĄ PNIA, nie skalą drzewa. To jedna liczba
       zamiast dwóch, które dla drzewa domkowego rozjeżdżały się o rząd
       wielkości: jego skala to 1,45, ale pień jest pięć razy grubszy od sosny
       (0,62 wobec 0,19). Kołnierz liczony ze skali wychodził przy nim jak
       rzadka szczotka dookoła słupa. */
    const grubosc = promien / .19;
    /* PĘKI, NIE RÓWNY PIERŚCIEŃ. Źdźbła rozłożone po jednym na działkę
       obwodu czytały się jak szczotka nasadzona na pień — a trawa przy
       drzewie rośnie kępami, między którymi widać gołą darń. Liczba pęków
       rośnie z obwodem WOLNIEJ niż rosłaby liczba źdźbeł, więc przy grubym
       pniu kępy robią się większe, a nie gęściej upchane. */
    const ilePekow = Math.max(3, Math.round((4 + los() * 2.2) * Math.pow(grubosc, .40) * (p.gestosc || 1)));
    const obrotKolnierza = los() * Math.PI * 2;
    /* Charakter całego kołnierza, losowany raz: jak wysoko trawa podchodzi
       i jak mocno się rozkłada. Dwa drzewa obok siebie mają przez to inną
       kępę, mimo tej samej reguły. */
    const wysokoscKolnierza = .84 + los() * .42;
    const rozlozenie = .85 + los() * .45;
    const dzialka = (Math.PI * 2) / ilePekow;
    for (let k = 0; k < ilePekow; k += 1) {
      /* Pęk dostaje swoją działkę obwodu i rusza się tylko w jej granicach.
         Przy czystym losowaniu dwa pęki siadają na sobie, a po drugiej
         stronie pnia zostaje pusto na pół obwodu — przerwy mają być
         nierówne, ale mają BYĆ. */
      const katPeku = obrotKolnierza + (k + .5) * dzialka + (los() - .5) * dzialka * .5;
      /* Grubszy pień dostaje WIĘKSZE kępy, nie tylko więcej kęp — inaczej
         pod drzewem domkowym stoi dziewięć kępek wielkości tych spod sosny
         i wygląda to jak obrzeżenie klombu. */
      const ileZdzbel = 3 + Math.floor(los() * 2.4 + Math.min(1.6, (grubosc - 1) * .35));
      const rPeku = promien * (.92 + los() * .22);
      /* WACHLARZ NIE MOŻE ZJEŚĆ CAŁEJ DZIAŁKI. Rozwarcie jest kątowe, więc
         nie maleje razem z obwodem: przy grubym pniu, gdzie kęp jest więcej,
         a działki węższe, sąsiednie wachlarze zaczynały się stykać i kołnierz
         wracał do bycia pierścieniem. Sufit na 45% działki zostawia zawsze
         ponad połowę gołej darni między kępami — to ta przerwa robi z tego
         kępy, a nie samo grupowanie źdźbeł. */
      const wachlarz = Math.min(.42 + los() * .30, dzialka * .45);
      const hPeku = (.15 + los() * .10) * wysokoscKolnierza * Math.pow(grubosc, .35) * (p.wysokosc || 1);
      for (let j = 0; j < ileZdzbel; j += 1) {
        /* `t` biegnie od −1 do +1 w poprzek wachlarza. Środkowe źdźbło jest
           najwyższe i najbardziej promieniste, skrajne najniższe i najmocniej
           odgięte — kształt kępy bierze się stąd, a nie z losowania każdego
           źdźbła osobno. Dlatego dwa sąsiednie pęki wyglądają jak dwie kępy
           tej samej trawy, a nie jak dwa przypadkowe zestawy patyków. */
        const t = ileZdzbel > 1 ? (j / (ileZdzbel - 1)) * 2 - 1 : 0;
        // Kierunek czubka rozkłada się na pełne rozwarcie wachlarza…
        const kierunek = katPeku + t * wachlarz;
        // …a nasady niemal się stykają: to ma być JEDNA kępa, nie trzy
        // źdźbła stojące obok siebie w rzędzie.
        const kat = katPeku + t * wachlarz * .30;
        const r = rPeku + (los() - .5) * promien * .12;
        const h = hPeku * (1 - .26 * Math.abs(t)) * (.88 + los() * .24);
        /* Skrajne źdźbła kładą się mocniej — wachlarz ma się rozkładać, a nie
           sterczeć. Sufit 0,80 rad (46°) jest twardy: wyżej czubek, który
           dodatkowo ucieka łukiem w tę samą stronę, schodzi pod darń. */
        const odchylenie = Math.min(.80, (.28 + los() * .26 + .20 * Math.abs(t)) * rozlozenie);
        wpisy.push({
          x: p.x, z: p.z, grunt: null,
          dx: Math.cos(kat) * r, dz: Math.sin(kat) * r,
          // θ = π/2 − kierunek: czubek leci od pnia, grzbiet zostaje przy korze.
          obrot: Math.PI / 2 - kierunek + (los() - .5) * .22,
          pochylenieX: Math.sin(kierunek) * odchylenie,
          pochylenieZ: -Math.cos(kierunek) * odchylenie,
          h, szer: .82 + los() * .38, luk: .72 + los() * .45,
          barwa: barwyTrawy[Math.floor(los() * barwyTrawy.length)],
          pien: p,
        });
      }
    }
  }

  const im = new InstancedMesh(gTrawa, mTrawa, Math.max(1, wpisy.length));
  im.name = "trawa-przy-pniach";
  im.count = wpisy.length;
  im.frustumCulled = false;
  const gruntPnia = new Map();
  wpisy.forEach((o, i) => {
    let g = gruntPnia.get(o.pien);
    if (g == null) { g = wysokoscGruntu(o.x, o.z); gruntPnia.set(o.pien, g); }
    planeta.ustaw(wKula, o.x, o.z, g, 0);
    korzen.position.set(o.dx, 0, o.dz);
    korzen.rotation.set(o.pochylenieX, 0, o.pochylenieZ);
    zdzblo.position.set(0, -.12 * o.h, 0);
    zdzblo.rotation.set(0, o.obrot, 0);
    // Wszystkie trzy osie przez `h` — geometria jest znormalizowana do
    // wysokości 1, więc szerokość i łuk są MNOŻNIKAMI względem wysokości.
    zdzblo.scale.set(o.h * o.szer, o.h, o.h * o.luk);
    wKula.updateMatrixWorld(true);
    im.setMatrixAt(i, zdzblo.matrixWorld);
    im.setColorAt(i, o.barwa);
  });
  im.instanceMatrix.needsUpdate = true;
  if (im.instanceColor) im.instanceColor.needsUpdate = true;
  return im;
}

function zbudujKwiaty(DEF, planeta, ziemia, wysokoscGruntu = utworzMiernikGruntu(planeta, ziemia)) {
  const REZERWA = 256; // Fixed capacity for the living trail; no per-flower draw calls.
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
  const gPlatek = new SphereGeometry(0.052, 10, 7);
  const gSrodek = new SphereGeometry(0.040, 10, 7);
  const { ZDZBLA, gTrawa, mTrawa, barwyTrawy } = zdzbloTrawy();

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

  const N = DEF.length + REZERWA;
  const imLodyga = new InstancedMesh(gLodyga, mLodyga, N);
  const imLisc = new InstancedMesh(gLisc, mLisc, N * 2);
  const imTrawa = new InstancedMesh(gTrawa, mTrawa, REZERWA * ZDZBLA);
  imLodyga.count = DEF.length;
  imLisc.count = DEF.length * 2;
  imTrawa.count = 0;
  const imPlatek = [];
  const imSrodek = [];
  const kursor = [];
  PALETA_K.forEach((c, i) => {
    imPlatek.push(new InstancedMesh(gPlatek, new MeshLambertMaterial({ color: c.p, flatShading: false }), (ilePerKolor[i] + REZERWA) * 5));
    imSrodek.push(new InstancedMesh(gSrodek, new MeshLambertMaterial({ color: c.s, flatShading: false }), ilePerKolor[i] + REZERWA));
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
  const wTrawa = [], wZdzblo = [];
  wKula.add(wRoot);
  wRoot.add(wGlowa, wLodyga, ...wLisc);
  wGlowa.add(wSrodek);
  for (let q = 0; q < 5; q++) {
    const n = new Group();
    wGlowa.add(n);
    wPlatek.push(n);
  }
  for (let q = 0; q < ZDZBLA; q++) {
    const korzen = new Group(), zdzblo = new Group();
    korzen.add(zdzblo);
    wRoot.add(korzen);
    wTrawa.push(korzen);
    wZdzblo.push(zdzblo);
  }
  const macierzZero = new Matrix4().makeScale(0, 0, 0);

  function utworzKwiat(k, i) {
    const los = losownik(i + 1);
    const wariant = Math.max(0, Math.min(4, k.wariant | 0));
    // Scale is applied once by wRoot; a short stem supports the broad flower head.
    const wysokosc = 0.085 + los() * 0.025;
    const kwiat = {
      x: k.pos[0], z: k.pos[1], typ: k.typ === "trawa" ? "trawa" : "kwiat",
      wariant, h: wysokosc, iTrawa: k.iTrawa ?? null,
      grunt: wysokoscGruntu(k.pos[0], k.pos[1]), gruntX: k.pos[0], gruntZ: k.pos[1],
      skala: (0.92 + los() * 0.42) * (k.skala != null ? k.skala : 1),
      obrotY: k.obrot != null ? k.obrot : los() * Math.PI * 2,
      bazaZ: (los() - 0.5) * 0.28, bazaX: (los() - 0.5) * 0.2, glowaX: -0.34 + los() * 0.14,
      katy: [0, 0, 0, 0, 0].map((_, j) => (j / 5) * Math.PI * 2 + los() * 0.1),
      iLodyga: i, iLisc: [i * 2, i * 2 + 1], iSrodek: kursor[wariant],
      iPlatki: [0, 1, 2, 3, 4].map((j) => kursor[wariant] * 5 + j),
      gib: { x: 0, z: 0, vx: 0, vz: 0 },
    };
    kursor[wariant]++;
    return kwiat;
  }

  /**
   * PĘK TRAWY — losowany raz, przy sadzeniu.
   *
   * ŹDŹBŁA STOJĄ DO SIEBIE GRZBIETAMI, CZUBKAMI NA ZEWNĄTRZ. Bryła źdźbła
   * jest wygięta w +Z, więc strona wklęsła (twarz) patrzy tam, gdzie leci
   * czubek, a grzbiet zostaje po przeciwnej. Gdy każde źdźbło wygina się
   * w stronę od środka pęku, grzbiety schodzą się w środku i kępka czyta się
   * jak jedna roślina, a nie jak garść patyków.
   *
   * DO 18.09 BYŁO ODWROTNIE, i to przez pomyłkę w układzie osi. Kierunek
   * „na zewnątrz" to `(cos kat, sin kat)` w płaszczyźnie (x, z), ale obrót
   * wokół Y o kąt θ przenosi lokalne +Z na `(sin θ, cos θ)`. `obrot = kat`
   * dawało więc kierunek ODBITY względem prostej 45°: przy `kat` bliskim
   * ¾π źdźbło wyginało się dokładnie DO ŚRODKA pęku, a sąsiednie rosły
   * przeciwko sobie i przecinały się. Do tego dochodziło ±60° szumu.
   * Stąd bierze się poprawne θ = π/2 − kąt.
   *
   * Różnicę między kępkami niosą teraz trzy liczby losowane na CAŁY pęk
   * (rozrzut, smukłość, rozchylenie) plus wysokość i łuk każdego źdźbła —
   * a nie losowy kierunek wygięcia. Szumu w kierunku zostaje tyle, żeby pęk
   * nie był cyrklem: około ±12°.
   */
  function losujTrawa(k, seed) {
    const los = losownik(seed);
    const UKLADY = [
      [[0,0]],
      [[-.065,0],[.065,.012]],
      [[-.078,-.026],[0,.042],[.082,-.022]],
      [[-.10,-.012],[-.034,.038],[.038,.032],[.105,-.018]],
    ];
    const indeksUkladu = Math.floor(los() * UKLADY.length);
    const uklad = UKLADY[indeksUkladu];
    // Mniej źdźbeł niż przy płaskich liściach: bryła z grubością zasłania
    // sąsiadki, więc gęsta kępka zlewa się w jedną zieloną plamę.
    const ile = Math.min(ZDZBLA, 4 + uklad.length + Math.floor(los() * 4));
    const obrotUkladu = los() * Math.PI * 2;
    // Charakter pęku: jak szeroko siedzi, jak wysoki jest i jak mocno się
    // rozkłada. Te trzy liczby robią większość różnicy między kępkami.
    const rozrzut = .05 + los() * .075;
    /* PODŁOGA SMUKŁOŚCI, nie sam rozrzut. Przy .8 najniższy pęk schodził
       poniżej pięciu centymetrów świata i z kamery gry nie było go widać
       wcale — a zasiew stawia je właśnie tam, gdzie dziecko przed chwilą
       przeszło. Rozpiętość zostaje, podnosi się tylko dół. */
    const smuklosc = 1 + los() * .30;
    /* KĄT ROZWARCIA. Do 18.09 rozchylenie schodziło do .5, a odchylenie
       zaczynało się od .02 rad — czyli źdźbło stało praktycznie pionowo
       i cały rozrzut pęku robił sam łuk bryły. Pęk czytał się wtedy jak
       garść pionowych szpilek, wysoka i wąska. Trawa przy ziemi rozkłada
       się na boki, więc nasada dostaje teraz kilkanaście do czterdziestu
       paru stopni.
       GÓRNEGO KOŃCA PILNUJ: przy ok. 60° czubek, który dodatkowo ucieka
       łukiem w tę samą stronę, schodzi pod darń i źdźbło znika. */
    const rozchylenie = .85 + los() * .45;
    k.ukladTrawy = indeksUkladu;
    k.trawa = Array.from({ length: ZDZBLA }, (_, j) => {
      const srodek = uklad[j % uklad.length];
      const sx = srodek[0] * Math.cos(obrotUkladu) - srodek[1] * Math.sin(obrotUkladu);
      const sz = srodek[0] * Math.sin(obrotUkladu) + srodek[1] * Math.cos(obrotUkladu);
      const kat = obrotUkladu + j * 2.39996 + (los() - .5) * .95;
      const promien = j < uklad.length ? los() * .022 : Math.sqrt(los()) * rozrzut;
      // Samo źdźbło jest już wygięte, więc losowe pochylenie korzenia musi być
      // DUŻO mniejsze niż przy dawnym, prawie prostym liściu — inaczej pęk
      // kładzie się na ziemi zamiast stać.
      const odchylenie = (.26 + los() * .34) * rozchylenie;
      const kolor = Math.floor(los() * barwyTrawy.length);
      if (k.iTrawa != null) imTrawa.setColorAt(k.iTrawa + j, barwyTrawy[kolor]);
      const px = sx + Math.cos(kat) * promien;
      const pz = sz + Math.sin(kat) * promien;
      /* „Na zewnątrz" liczymy z FAKTYCZNEGO miejsca źdźbła, a nie z kąta
         losowania. Układy wieloogniskowe (`UKLADY`) odsuwają całe gniazdo od
         środka pęku, więc dla nich `kat` wskazuje zupełnie co innego niż
         kierunek od środka. Źdźbło dokładnie w osi nie ma „zewnątrz" —
         zostaje przy swoim kącie. */
      const odSrodka = Math.hypot(px, pz);
      const naZewnatrz = odSrodka > 1e-3 ? Math.atan2(pz, px) : kat;
      return {
        aktywne: j < ile,
        x: px, z: pz,
        // Górny koniec ścięty razem z podniesieniem rozwarcia: pochylone
        // źdźbło jest w pionie krótsze, ale kępka zajmuje więcej miejsca —
        // przy dawnej wysokości robiła się z tego kępa siana.
        h: (.135 + los() * .055 + (1 - Math.min(1, promien / rozrzut)) * .03) * smuklosc,
        szer: .78 + los() * .42,
        // Łuk osobno od szerokości: w dawnym źdźble oś Z niosła tylko drobne
        // odgięcie czubka, teraz niesie CAŁY łuk, więc skalowanie go
        // szerokością robiłoby ze źdźbeł raz laski, raz obwarzanki.
        // Górny pułap łuku ścięty: przy 1,3 czubek odlatywał w bok dalej, niż
        // źdźbło było wysokie, i kępka kładła się na darni zamiast z niej
        // rosnąć. Teraz najmocniej wygięte źdźbło ma czubek mniej więcej nad
        // krawędzią własnego pęku.
        luk: .62 + los() * .45,
        /* θ = π/2 − kąt: lokalne +Z (czubek) trafia dokładnie w kierunek od
           środka pęku. Szum ±0,22 rad ≈ ±12° — tyle, żeby dwa sąsiednie
           źdźbła nie były równoległe, i o tyle mało, żeby żadne nie zawróciło
           do środka. */
        obrot: Math.PI / 2 - naZewnatrz + (los() - .5) * .44,
        // Nasada pochyla się w tę samą stronę, w którą leci czubek — inaczej
        // źdźbło jest wygięte w jedną stronę, a przewrócone w drugą.
        pochylenieX: Math.sin(naZewnatrz) * odchylenie + (los() - .5) * .06,
        pochylenieZ: -Math.cos(naZewnatrz) * odchylenie + (los() - .5) * .06,
      };
    });
  }

  const lista = DEF.map(utworzKwiat);

  function odswiez(k) {
    if (k.x !== k.gruntX || k.z !== k.gruntZ) {
      k.grunt = wysokoscGruntu(k.x, k.z);
      k.gruntX = k.x; k.gruntZ = k.z;
    }
    planeta.ustaw(wKula, k.x, k.z, k.grunt, 0);
    wRoot.position.set(0, 0, 0);
    wRoot.rotation.set(k.bazaX + k.gib.z, k.obrotY, k.bazaZ - k.gib.x);
    const szerokosc = k.skala * (k.szerokoscWzrostu ?? 1);
    wRoot.scale.set(szerokosc, k.skala * (k.wzrost ?? 1), szerokosc);
    if (k.typ === "trawa") {
      imLodyga.setMatrixAt(k.iLodyga, macierzZero);
      imLisc.setMatrixAt(k.iLisc[0], macierzZero);
      imLisc.setMatrixAt(k.iLisc[1], macierzZero);
      imSrodek[k.wariant].setMatrixAt(k.iSrodek, macierzZero);
      for (let j = 0; j < 5; j++) imPlatek[k.wariant].setMatrixAt(k.iPlatki[j], macierzZero);
      k.trawa.forEach((o, j) => {
        const korzen = wTrawa[j], zdzblo = wZdzblo[j];
        korzen.position.set(o.x, 0, o.z);
        korzen.rotation.set(o.pochylenieX, 0, o.pochylenieZ);
        // Nasada źdźbła siedzi w y=0 geometrii, więc podnoszenie o h/2 (co
        // miało sens przy geometrii liczonej od środka) stawiało cały pęk
        // NAD gruntem. Zamiast tego chowamy nasadę odrobinę pod ziemię —
        // wtedy trawa wyrasta z darni, a nie stoi na niej.
        zdzblo.position.set(0, -.09 * o.h, 0);
        zdzblo.rotation.set(0, o.obrot, 0);
        // WSZYSTKIE trzy osie idą przez `h`. Geometria jest znormalizowana do
        // wysokości 1, więc skalowanie szerokości i łuku OSOBNO od wysokości
        // (co uchodziło przy dawnym, prawie płaskim liściu) rozjeżdża
        // proporcje: przy h = 0,15 źdźbło robiło się szersze i bardziej
        // wygięte niż wysokie, czyli po prostu kładło się na ziemi. `szer`
        // i `luk` są mnożnikami WZGLĘDEM wysokości, a nie osobną skalą.
        zdzblo.scale.set(o.h * o.szer, o.h, o.h * o.luk);
      });
      wKula.updateMatrixWorld(true);
      k.trawa.forEach((o, j) => imTrawa.setMatrixAt(k.iTrawa + j,
        o.aktywne ? wZdzblo[j].matrixWorld : macierzZero));
      return;
    }
    wLodyga.position.set(0, k.h / 2, 0);
    wLodyga.scale.set(1, k.h, 1);
    LISCIE.forEach((o, j) => {
      const n = wLisc[j];
      n.position.set(o.strona * 0.058 * o.sk, k.h * o.wys, 0);
      n.rotation.set(0, o.strona > 0 ? 0.25 : -0.25, o.obr);
      n.scale.set(1.35 * o.sk, 0.22 * o.sk, 0.70 * o.sk);
    });
    wGlowa.position.set(0, k.h, 0);
    wGlowa.rotation.set(k.glowaX, 0, 0);
    wSrodek.position.set(0, 0.016, 0);
    wSrodek.scale.set(1, 0.58, 1);
    k.katy.forEach((kat, j) => {
      const n = wPlatek[j];
      n.position.set(Math.cos(kat) * 0.066, 0, Math.sin(kat) * 0.066);
      n.rotation.set(0, -kat, 0.12);
      n.scale.set(1.30, 0.38, 0.88);
    });
    wKula.updateMatrixWorld(true);
    imLodyga.setMatrixAt(k.iLodyga, wLodyga.matrixWorld);
    imLisc.setMatrixAt(k.iLisc[0], wLisc[0].matrixWorld);
    imLisc.setMatrixAt(k.iLisc[1], wLisc[1].matrixWorld);
    imSrodek[k.wariant].setMatrixAt(k.iSrodek, wSrodek.matrixWorld);
    for (let j = 0; j < 5; j++) imPlatek[k.wariant].setMatrixAt(k.iPlatki[j], wPlatek[j].matrixWorld);
    if (k.iTrawa != null) {
      for (let j = 0; j < ZDZBLA; j++) imTrawa.setMatrixAt(k.iTrawa + j, macierzZero);
    }
  }

  lista.forEach(odswiez);
  function oznacz() {
    imLodyga.instanceMatrix.needsUpdate = true;
    imLisc.instanceMatrix.needsUpdate = true;
    imTrawa.instanceMatrix.needsUpdate = true;
    if (imTrawa.instanceColor) imTrawa.instanceColor.needsUpdate = true;
    for (let i = 0; i < PALETA_K.length; i++) {
      imPlatek[i].instanceMatrix.needsUpdate = true;
      imSrodek[i].instanceMatrix.needsUpdate = true;
    }
  }
  oznacz();
  const meshe = [imLodyga, imLisc, imTrawa, ...imPlatek, ...imSrodek];
  meshe.forEach((m) => (m.frustumCulled = false));
  const rosnace = new Set();
  // Time, width, height: anticipation, fast stretch, squash, small rebound, settle.
  // Scaling around the root keeps every pose planted in the ground.
  const POP_DELAY = .10, POP_DURATION = .84;
  const POP = [[0,0,0],[.14,1.12,.25],[.38,.82,1.35],
    [.57,1.12,.90],[.75,.97,1.06],[1,1,1]];
  let zasiane = 0, kolejny = 0;
  // Bufor na normalną sąsiada. NIE sięgaj po `normalna` z
  // `utworzMiernikGruntu` — to zmienna lokalna tamtej funkcji i poza nią
  // jest niezdefiniowana; wyjątek leciał aż z pętli renderowania i wieszał scenę.
  const nSasiad = new Vector3();
  /**
   * Sadzi roślinę w punkcie mapy. Trzeci argument to albo `bezAnimacji`
   * (tak woła zasiew liska — bez zmian), albo OPCJE:
   *   `{ bezAnimacji, typ, wariant }`
   * `typ: "kwiat"` wymusza kwiat zamiast losowania (zasiew daje ~45 % trawy,
   * a ślad przygody obiecuje kwiat); `wariant` 0–4 to barwa z `PALETA_K`
   * zamiast tej z licznika — ślady przygód (`slady.js`) muszą dawać ten sam
   * kolor przy pierwszym posadzeniu i przy odtworzeniu, a licznik `kolejny`
   * rośnie też od pęków spod łap liska. Strumień losowy jest ciągnięty tak
   * samo w obu trybach, więc wymuszenie nie przestawia niczego zasiewowi.
   */
  function posadz(x, z, bezAnimacji = false, opcje = {}) {
    if (bezAnimacji && typeof bezAnimacji === "object") {
      opcje = bezAnimacji;
      bezAnimacji = !!opcje.bezAnimacji;
    }
    if (!Number.isFinite(x) || !Number.isFinite(z)) return false;
    const n = planeta.normalna(x, z);
    // Avoid piling up flowers on a path the fox has already walked.
    if (lista.some(k => planeta.normalna(k.x, k.z, nSasiad).dot(n) > Math.cos(.32 / planeta.R))) return false;
    const seed = (kolejny + 1) * 7919;
    // Jeden strumień losowy na roślinę: rodzaj i wielkość z tego samego
    // ziarna. Wcześniej wielkość szła z `kolejny % 4`, więc co czwarty pęk
    // był co do joty tej samej wielkości — widać to było jak wzór na tapecie.
    const losRosliny = losownik(seed);
    const typLosowy = losRosliny() < .45 ? "trawa" : "kwiat";
    const typ = opcje.typ === "kwiat" || opcje.typ === "trawa" ? opcje.typ : typLosowy;
    const wariant = Number.isInteger(opcje.wariant)
      ? Math.max(0, Math.min(PALETA_K.length - 1, opcje.wariant))
      : kolejny % 5;
    /* Dolna granica podniesiona z .62: mnoży się jeszcze przez rozrzut
       z `utworzKwiat`, więc najmniejszy pęk wychodził w skali 0,53 — czyli
       źdźbło wysokie na pięć centymetrów świata przy planecie o promieniu
       8,5. Zmienności zostaje tyle samo, najmniejszy jest o połowę większy. */
    const skalaRosliny = .78 + losRosliny() * .42;
    let k;
    if (zasiane < REZERWA) {
      k = utworzKwiat({pos:[x,z],typ,wariant,
        skala:skalaRosliny,iTrawa:zasiane*ZDZBLA}, lista.length);
      lista.push(k);
      zasiane++;
      imLodyga.count = lista.length;
      imLisc.count = lista.length * 2;
      imPlatek[k.wariant].count = kursor[k.wariant] * 5;
      imSrodek[k.wariant].count = kursor[k.wariant];
      imTrawa.count = zasiane * ZDZBLA;
    } else {
      // Reuse only old trail plants well away from the current player area.
      k = lista.slice(DEF.length).find(k => !rosnace.has(k) &&
        planeta.normalna(k.x,k.z,nSasiad).dot(n) < Math.cos(9/planeta.R));
      if (!k) return false;
      k.x=x; k.z=z;
      k.typ=typ;
    }
    if (k.typ === "trawa") losujTrawa(k, seed * 17 + 12345);
    kolejny++;
    k.czasWzrostu=0;
    k.wzrost=bezAnimacji ? 1 : 0;
    k.szerokoscWzrostu=bezAnimacji ? 1 : 0;
    k.gib.x=k.gib.z=k.gib.vx=k.gib.vz=0;
    if (!bezAnimacji) rosnace.add(k);
    odswiez(k);
    oznacz();
    return true;
  }
  function aktualizujZasiew(dt, bezAnimacji = false) {
    if (!rosnace.size) return;
    for (const k of rosnace) {
      k.czasWzrostu += Math.max(0,dt);
      const p = bezAnimacji ? 1 : Math.max(0,
        Math.min(1,(k.czasWzrostu-POP_DELAY)/POP_DURATION));
      let i=1;
      while (i<POP.length-1 && p>POP[i][0]) i++;
      const a=POP[i-1], b=POP[i];
      const t=(p-a[0])/(b[0]-a[0]);
      const s=t*t*(3-2*t);
      k.szerokoscWzrostu=a[1]+(b[1]-a[1])*s;
      k.wzrost=a[2]+(b[2]-a[2])*s;
      odswiez(k);
      if (p===1) rosnace.delete(k);
    }
    oznacz();
  }
  return { lista, odswiez, oznacz, meshe, posadz, aktualizujZasiew,
    stanZasiewu: () => {
      const nowe = lista.slice(DEF.length, DEF.length + zasiane);
      return {zasiane,rosnace:rosnace.size,limit:REZERWA,
        trawy:nowe.filter(k => k.typ === "trawa").length,
        kwiaty:nowe.filter(k => k.typ === "kwiat").length};
    } };

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
  const wysokoscGruntu = utworzMiernikGruntu(planeta, ziemia);
  const sciezki = zbudujSciezke(mapa, planeta);
  s.add(sciezki);
  const nurt = zbudujNurt(mapa, planeta);
  s.add(nurt.mesh);

  const Ct = mapa.sciezka;
  const t = most();
  // Most stoi w poprzek ścieżki, więc kąt bierze z jej trzeciego węzła.
  // Bez ścieżki (pusty świat) nie ma czego przecinać — zero i tyle.
  // `most.obrot` i `most.skala` w mapie (kładka hybrydy nad oczkiem) mają pierwszeństwo.
  const obrotMostu = Number.isFinite(mapa.most.obrot) ? mapa.most.obrot
    : (Ct.length >= 3 ? Math.atan2(Ct[2].x - Ct[1].x, Ct[2].z - Ct[1].z) : 0);
  planeta.ustaw(t, mapa.most.pos[0], mapa.most.pos[1], mapa.most.h ?? 0, obrotMostu);
  if (Number.isFinite(mapa.most.skala)) t.scale.setScalar(mapa.most.skala);
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

  /* RODZAJE DRZEW w tablicy, nie w łańcuchu `?:` — dołożenie gatunku ma być
     jednym wpisem tutaj plus jednym generatorem wyżej. Nieznany `typ` (albo
     jego brak, jak w starszych mapach) spada na sosnę, więc mapa sprzed
     tej zmiany wczytuje się bez konwersji. */
  const RODZAJE_DRZEW = { sosna, lisciaste: drzewoLisciaste, podwojna: choinkaPodwojna };
  const drzewa = mapa.drzewa
    ? mapa.drzewa.map((d) => [(RODZAJE_DRZEW[d.typ] || sosna)(d.skala ?? 1), d.pos[0], d.pos[1], d.obrot, d.skala ?? 1, d.typ, d.trawa])
    : [[sosna(1.3), -3.6, 1.3], [sosna(0.9), 4.6, -4.2], [drzewoLisciaste(1), 4.2, 0.6], [sosna(1.1), -5.2, -3]];
  /* Nasady pni do kołnierzy trawy (`trawaPrzyPniach`). Zbieramy je TU, bo
     tylko tutaj widać naraz rodzaj drzewa i jego skalę — promień pnia przy
     ziemi jest inny dla sosny, inny dla liściastego i jeszcze inny dla kępy
     dwóch pni. */
  const pnieDoObrosniecia = [];
  for (const [l, c, h, obrot, skala, typ, trawa] of drzewa) {
    // Drzewo dostaje własną grupę-kotwicę na kuli; gibanie obraca WEWNĘTRZNĄ
    // grupę `l`, więc ramka kuli i wychył nie mieszają się ze sobą.
    const kotwica = new Group();
    const grunt = wysokoscGruntu(c, h);
    // Pień wchodzi kilka centymetrów w teren, więc na stromym trójkącie nie
    // odsłoni się jego płaska dolna ścianka.
    planeta.ustaw(kotwica, c, h, grunt - .10 * (skala || 1), obrot ?? 0);
    kotwica.add(l);
    s.add(kotwica);
    /* Kępa dwóch pni ma szerszą podstawę niż pojedyncze drzewo. Bez tego
       lisek obchodzi pierwszy pień i wchodzi w drugi, a plama cienia kończy
       się w połowie kępy — widać wtedy, że to dwa obiekty, nie jeden. */
    const podwojna = typ === "podwojna";
    blockers.push({ x: c, z: h, r: podwojna ? 1.02 : 0.75, drzewo: l, skalaDrzewa: skala || 1 });
    /* PROMIEŃ PNIA PRZY ZIEMI, nie promień kolizji. Walec sosny ma u dołu
       0,19, liściastego 0,22, a kotwica jest zanurzona o 0,10 — na wysokości
       darni walec zdążył się już odrobinę zwęzić. Kępa dwóch pni dostaje
       jeden szerszy kołnierz zamiast dwóch, bo między pniami i tak nic nie
       widać. Bez tej liczby trawa albo tkwi w korze, albo stoi od niej
       o pół metra. */
    /* ATRYBUT `trawa` PRZY DRZEWIE W MAPIE. Brak wpisu albo `true` znaczy
       „obrośnij domyślnie" — dzięki temu mapa sprzed tej zmiany wygląda tak
       samo jak po niej i nikt nie musi dopisywać pola do każdego drzewa.
       `false` zdejmuje kołnierz z tego jednego drzewa (np. gdy stoi na skale
       albo w wodzie). Obiekt `{ gestosc, wysokosc, promien }` to mnożniki —
       dla drzewa, które ma być zarośnięte mocniej albo ledwie muśnięte.
       Wartości poza 0,3–2,5 nie mają sensu i są przycinane. */
    if (trawa !== false) {
      const t = (trawa && typeof trawa === "object") ? trawa : {};
      const mn = (v) => Math.max(.3, Math.min(2.5, Number(v) || 1));
      pnieDoObrosniecia.push({
        x: c, z: h, skala: skala || 1,
        promien: (podwojna ? .38 : typ === "lisciaste" ? .213 : .18) * (skala || 1) * mn(t.promien),
        gestosc: mn(t.gestosc), wysokosc: mn(t.wysokosc),
        seed: Math.round((c * 7919 + h * 104729) * 16) | 0,
      });
    }
    const u = plamaCienia(podwojna ? 3.1 : 2.2, 0.3);
    planeta.ustaw(u, c, h, grunt + .006, 0);
    s.add(u);
  }

  const glazy = mapa.glazy
    ? mapa.glazy.map((g) => [g.pos[0], g.pos[1], g.skala ?? 1, g.obrot, g.wariant ?? 0])
    : [[-1.8, 6.6, 1.1], [3.1, 3.4, 0.8], [-2.6, -4.6, 1], [1.9, -5.4, 0.7], [-5.6, 4, 0.9]];
  const rozsypane = [
    [[1.02,.58,.30,1.3],[-.72,.92,.25,2.6]],
    [[.88,-.46,.28,.5],[-.82,.68,.24,2.2],[.52,.96,.22,1.4]],
    [[1.02,.52,.30,1.3],[-.80,.90,.25,2.6],[.34,-.92,.27,.4],[-1.04,-.30,.20,1.8],[.86,-.58,.22,2.9]],
  ];
  for (const [nr, [l, c, h, obrot, wariant=0]] of glazy.entries()) {
    /* Głaz i jego rozsypane kamienie siedzą w JEDNEJ nazwanej grupie. Grupa
       stoi w tożsamości (pozycje nadaje `planeta.ustaw` każdej bryle z osobna),
       więc nic się nie przesuwa — a rozbicie głazu da się zrobić jednym
       `visible = false` zamiast szukania pięciu obiektów po scenie. */
    const zestaw = new Group();
    zestaw.name = `glaz-${nr}`;
    zestaw.userData.mapaPos = [l, c];
    zestaw.userData.skala = h;
    const u = glaz(h,false,wariant);
    planeta.ustaw(u, l, c, wysokoscGruntu(l, c) - .08 * h, obrot != null ? obrot : l * 2.1);
    zestaw.add(u);
    blockers.push({ x: l, z: c, r: 0.55 * h });
    // Gęstość rozsypanych kamieni jest częścią wariantu; nie wpływają na kolizję.
    for (const [i,[dx,dz,ds,dr]] of rozsypane[((wariant|0)%3+3)%3].entries()) {
      const p = glaz(h*ds,true,wariant+i);
      const px = l + dx * h, pz = c + dz * h;
      planeta.ustaw(p, px, pz, wysokoscGruntu(px, pz) - .06 * h * ds, l + dr);
      zestaw.add(p);
    }
    s.add(zestaw);
  }

  /* GRZYBY — dekoracja, nie przeszkoda: celowo NIE trafiają do `blockers`.
     Kępka przy ścieżce ma być czymś, co lisek mija i po czym może przebiec,
     a nie niewidzialną ścianką wielkości głazu. Kapelusze są zanurzone
     w gruncie o 2% skali, żeby na skosie nie odsłonił się dysk blaszek. */
  for (const g of (mapa.grzyby || [])) {
    if (!Array.isArray(g?.pos)) continue;
    const [gx, gz] = g.pos;
    const sk = g.skala ?? 1;
    const grunt = wysokoscGruntu(gx, gz);
    const kepka = grzyby(sk);
    planeta.ustaw(kepka, gx, gz, grunt - .02 * sk, g.obrot ?? gx * 1.7);
    s.add(kepka);
    const cienGrzyba = plamaCienia(.62 * sk, .26);
    planeta.ustaw(cienGrzyba, gx, gz, grunt + .005, 0);
    s.add(cienGrzyba);
  }

  /* DRZEWO DOMKOWE — jedno, w miejscu, które mapa wskazuje jako `schronienie`.
     Stoi tam OD POCZĄTKU, zanim dziecko cokolwiek zbuduje: Wizkor mówi „na tym
     drzewie postawimy domek", więc drzewo musi być czymś, co dziecko widziało
     wcześniej, a nie czymś, co wyrasta razem z platformą.

     Pozycję i skalę bierze z `mapa.schronienie`, a nie z `mapa.drzewa` — dzięki
     temu platforma (`schronienie.js`, ta sama skala) siada na pniu co do
     centymetra, zamiast gonić dwa niezależne wpisy w mapie. */
  let kotwicaDomku = null;
  let ukladDomkuSwiata = ukladDomku(mapa.schronienie);
  if (mapa.schronienie && Array.isArray(mapa.schronienie.pos)) {
    const D = mapa.schronienie;
    const sk = D.skala ?? 1;
    const [dx, dz] = D.pos;
    const gruntD = wysokoscGruntu(dx, dz);
    const kotwicaD = new Group();
    kotwicaD.name = "drzewo-domkowe-kotwica";
    planeta.ustaw(kotwicaD, dx, dz, gruntD - ukladDomkuSwiata.zanurzeniePnia * sk, D.obrot ?? 0);
    const bryla = drzewoDomkowe(sk, ukladDomkuSwiata);
    kotwicaD.add(bryla);
    s.add(kotwicaD);
    // `app.js` dokłada tu wczytany pień — patrz `_wczytajPienDomku`.
    kotwicaDomku = kotwicaD;
    /* Kolizja na samym pniu (0,62), nie na koronie: dziecko ma móc podejść pod
       drzewo i stanąć przy drabince, a nie obchodzić niewidzialny krąg
       wielkości liści. */
    /* `domkowe: true` WYŁĄCZA JE ZE ŚCINANIA. Od 16.09 dziecko może ściąć
       dowolne drzewo na mapie (`_zarejestrujDrzewa` w `app.js`) — to jedno ma
       zostać, bo na nim stoi domek. Flaga jedzie przy blockerze, bo to on jest
       jedynym miejscem, w którym scena widzi listę wszystkich drzew. */
    /* KOLIZJA I CIEN LICZA SIE OD PNIA, NIE OD KOTWICY.
       `pienX/pienZ` przesuwaja model drzewa wzgledem kotwicy (suwaki edytora,
       zapisane w `mapa.json`). Dzis to 1,18 i -0,52 przy skali 1,45, czyli
       prawie dwie jednostki w bok. Blocker i plama liczone z samego `pos`
       siedzialy przez to W TRAWIE OBOK drzewa: dziecko przechodzilo przez pien
       na wylot, zatrzymywalo sie o powietrze metr dalej, a cien lezal obok
       korony. Punkt pnia liczymy tak samo jak stope drabinki: lokalny offset
       przez macierz kotwicy i z powrotem na mape (`zKuli`).
       To jest dokladnie ta pulapka, przed ktora ostrzega komentarz przy
       `DOMEK_DRZEWO.pienX` — zera przestaly byc zerami. */
    const PIEN_X = (ukladDomkuSwiata.pienX || 0) * sk;
    const PIEN_Z = (ukladDomkuSwiata.pienZ || 0) * sk;
    kotwicaD.updateMatrix();
    const pienMapa = planeta.zKuli(
      new Vector3(PIEN_X, 0, PIEN_Z).applyMatrix4(kotwicaD.matrix));
    blockers.push({ x: pienMapa.x, z: pienMapa.z, r: .62 * sk, drzewo: bryla, skalaDrzewa: sk, domkowe: true });

    /* CIEN LEZY NA TERENIE, a nie na plaszczyznie stycznej do kuli.
       `plamaCienia` daje kwadrat `PlaneGeometry`. Przy tej srednicy jego brzeg
       odstaje od kuli o pol jednostki (R = 8,5), a drzewo stoi na garbie — stad
       ciemna blacha wiszaca nad zboczem zamiast plamy pod korona. Podmieniamy
       geometrie na tafle idaca za kula i terenem (ta sama, co pod klepiskiem)
       i dorabiamy UV, bo gradient cienia jest tekstura.
       Promien zostaje ten, co byl: `plamaCienia(s)` robilo kwadrat o boku s,
       a gradient gasl na wpisanym w niego kole — czyli na `s/2`. */
    /* Drzewo domkowe obrasta tak samo jak reszta, i widać je najczęściej —
       dziecko stoi pod nim przy drabince. Kołnierz idzie wokół `pienMapa`,
       nie wokół `pos`: to ta sama pułapka, co przy kolizji i cieniu wyżej,
       tylko że tu trawa wyrosłaby w szczerym polu obok drzewa. Promień to
       promień pnia (0,62) z blockera. */
    if (mapa.schronienie.trawa !== false) {
      pnieDoObrosniecia.push({
        x: pienMapa.x, z: pienMapa.z, skala: sk, promien: .62 * sk, seed: 20260918,
      });
    }

    const R_CIEN = 2.0 * sk;
    const cienD = plamaCienia(2 * R_CIEN, .32);
    planeta.ustaw(cienD, pienMapa.x, pienMapa.z, wysokoscGruntu(pienMapa.x, pienMapa.z), 0);
    const plama = cienD.userData.plama;
    plama.geometry.dispose();
    plama.geometry = uvKolowe(
      taflaNaGruncie(planeta, cienD, R_CIEN, wysokoscGruntu, .012), R_CIEN);
    plama.rotation.set(0, 0, 0);
    plama.position.set(0, 0, 0);
    s.add(cienD);
  }

  /* Kołnierze trawy przy pniach — jeden `InstancedMesh` na wszystkie drzewa.
     Stawiamy PO drzewach i po schronieniu, bo dopiero wtedy lista pni jest
     pełna, a przed kwiatami, żeby zasiew liska kładł się na wierzchu. */
  const trawaPni = trawaPrzyPniach(pnieDoObrosniecia, planeta, wysokoscGruntu);
  if (trawaPni.count) s.add(trawaPni);

  const kwiaty = zbudujKwiaty(mapa.kwiaty, planeta, ziemia, wysokoscGruntu);
  if (kwiaty) kwiaty.meshe.forEach((m) => s.add(m));

  return { group: s, ziemia, sciezki, lantern: n, gate: r, bridge: t, obrotMostu, blockers, kwiaty, nurtTik: nurt.tik, wysokoscGruntu, kotwicaDomku, ukladDomku: ukladDomkuSwiata };
}
