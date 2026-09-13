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
const MAT_NATURA = {
  pien: matKanciasty(0x765331), pienJasny: matKanciasty(0x91673b),
  igly: matKanciasty(0x3e793d), iglyCiemne: matKanciasty(0x2f6536),
  lisc: matKanciasty(0x579442), liscJasny: matKanciasty(0x72aa4e),
  skala: matKanciasty(0x918b78), skalaJasna: matKanciasty(0xaaa38d),
  skalaCiemna: matKanciasty(0x716c60), mech: matKanciasty(0x668b45),
};

export function sosna(s = 1) {
  const e = new Group();
  e.name = "sosna-low-poly";
  e.add(mesh(new CylinderGeometry(.105*s,.19*s,.88*s,6),MAT_NATURA.pien,[0,.44*s,0],[0,.18,0]));
  [[1.02,.98],[.84,1.48],[.65,1.94],[.43,2.36]].forEach(([r,y],i) => {
    const p=mesh(new ConeGeometry(r*s,.92*s,7),i%2?MAT_NATURA.iglyCiemne:MAT_NATURA.igly,
      [0,y*s,0],[0,.18+i*.48,(i%2?-.025:.025)]);
    p.scale.set(1,i===0?.82:.94,.88+(i%2)*.08);
    e.add(p);
  });
  return e;
}

export function drzewoLisciaste(s = 1) {
  const e = new Group();
  e.name = "drzewo-lisciaste-low-poly";
  e.add(mesh(new CylinderGeometry(.13*s,.22*s,1.25*s,6),MAT_NATURA.pien,[0,.58*s,0],[0,.16,0]));
  e.add(mesh(new CylinderGeometry(.065*s,.09*s,.66*s,5),MAT_NATURA.pienJasny,
    [-.17*s,1.08*s,.02*s],[0,0,.58]));
  e.add(mesh(new CylinderGeometry(.06*s,.085*s,.58*s,5),MAT_NATURA.pien,
    [.19*s,1.12*s,.02*s],[.12,0,-.62]));
  const korony = [
    [-.45,1.66,.02,.66,.58,.62,0], [.38,1.70,.08,.70,.60,.64,1],
    [-.05,2.12,-.02,.72,.68,.66,0], [.04,1.63,.38,.57,.52,.56,1],
    [.62,1.48,-.04,.43,.40,.44,0],
  ];
  for (const [x,y,z,sx,sy,sz,jasna] of korony) {
    const p=mesh(new IcosahedronGeometry(1,1),jasna?MAT_NATURA.liscJasny:MAT_NATURA.lisc,
      [x*s,y*s,z*s],[.1+x*.2,.35+y*.13,z*.3]);
    p.scale.set(sx*s,sy*s,sz*s);
    e.add(p);
  }
  return e;
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
  }

  /**
   * PĘK TRAWY — losowany raz, przy sadzeniu.
   *
   * Dawniej każdy pęk wychodził taki sam: źdźbła stały co złoty kąt, każde
   * odchylone od środka o ten sam rząd wielkości i obrócone DOKŁADNIE w
   * stronę swojego pochylenia. Z lotu ptaka dawało to idealną rozetę —
   * powtórzoną przy każdej kępce. Teraz losujemy trzy rzeczy na CAŁY pęk
   * (rozrzut, smukłość, rozchylenie), a twarz źdźbła odklejamy od kierunku
   * pochylenia, więc dwa pęki obok siebie nie są tym samym obiektem.
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
    const smuklosc = .8 + los() * .55;
    const rozchylenie = .5 + los() * 1.05;
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
      const odchylenie = (.02 + los() * .13) * rozchylenie;
      const kolor = Math.floor(los() * barwyTrawy.length);
      if (k.iTrawa != null) imTrawa.setColorAt(k.iTrawa + j, barwyTrawy[kolor]);
      return {
        aktywne: j < ile,
        x: sx + Math.cos(kat) * promien, z: sz + Math.sin(kat) * promien,
        h: (.115 + los() * .09 + (1 - Math.min(1, promien / rozrzut)) * .03) * smuklosc,
        szer: .75 + los() * .5,
        // Łuk osobno od szerokości: w dawnym źdźble oś Z niosła tylko drobne
        // odgięcie czubka, teraz niesie CAŁY łuk, więc skalowanie go
        // szerokością robiłoby ze źdźbeł raz laski, raz obwarzanki.
        luk: .75 + los() * .55,
        // Twarz źdźbła ODKLEJONA od kierunku pochylenia. Gdy `obrot === kat`,
        // każde źdźbło wygina się dokładnie na zewnątrz i pęk jest rozetą.
        obrot: kat + (los() - .5) * 2.1,
        pochylenieX: Math.sin(kat) * odchylenie + (los() - .5) * .1,
        pochylenieZ: -Math.cos(kat) * odchylenie + (los() - .5) * .1,
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
  function posadz(x, z, bezAnimacji = false) {
    if (!Number.isFinite(x) || !Number.isFinite(z)) return false;
    const n = planeta.normalna(x, z);
    // Avoid piling up flowers on a path the fox has already walked.
    if (lista.some(k => planeta.normalna(k.x, k.z, nSasiad).dot(n) > Math.cos(.32 / planeta.R))) return false;
    const seed = (kolejny + 1) * 7919;
    // Jeden strumień losowy na roślinę: rodzaj i wielkość z tego samego
    // ziarna. Wcześniej wielkość szła z `kolejny % 4`, więc co czwarty pęk
    // był co do joty tej samej wielkości — widać to było jak wzór na tapecie.
    const losRosliny = losownik(seed);
    const typ = losRosliny() < .45 ? "trawa" : "kwiat";
    const skalaRosliny = .62 + losRosliny() * .46;
    let k;
    if (zasiane < REZERWA) {
      k = utworzKwiat({pos:[x,z],typ,wariant:kolejny%5,
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
    const grunt = wysokoscGruntu(c, h);
    // Pień wchodzi kilka centymetrów w teren, więc na stromym trójkącie nie
    // odsłoni się jego płaska dolna ścianka.
    planeta.ustaw(kotwica, c, h, grunt - .10 * (skala || 1), obrot ?? 0);
    kotwica.add(l);
    s.add(kotwica);
    blockers.push({ x: c, z: h, r: 0.75, drzewo: l, skalaDrzewa: skala || 1 });
    const u = plamaCienia(2.2, 0.3);
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
  for (const [l, c, h, obrot, wariant=0] of glazy) {
    const u = glaz(h,false,wariant);
    planeta.ustaw(u, l, c, wysokoscGruntu(l, c) - .08 * h, obrot != null ? obrot : l * 2.1);
    s.add(u);
    blockers.push({ x: l, z: c, r: 0.55 * h });
    // Gęstość rozsypanych kamieni jest częścią wariantu; nie wpływają na kolizję.
    for (const [i,[dx,dz,ds,dr]] of rozsypane[((wariant|0)%3+3)%3].entries()) {
      const p = glaz(h*ds,true,wariant+i);
      const px = l + dx * h, pz = c + dz * h;
      planeta.ustaw(p, px, pz, wysokoscGruntu(px, pz) - .06 * h * ds, l + dr);
      s.add(p);
    }
  }

  const kwiaty = zbudujKwiaty(mapa.kwiaty, planeta, ziemia, wysokoscGruntu);
  if (kwiaty) kwiaty.meshe.forEach((m) => s.add(m));

  return { group: s, ziemia, sciezki, lantern: n, gate: r, bridge: t, obrotMostu, blockers, kwiaty, nurtTik: nurt.tik, wysokoscGruntu };
}
