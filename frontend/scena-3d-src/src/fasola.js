/*!
 * SPDX-FileCopyrightText: © 2026 Amitiel Angelisme <armitiel@gmail.com>
 * SPDX-License-Identifier: LicenseRef-EwolucJA-Proprietary
 *
 * EwolucJA — gra edukacyjna dla dzieci.
 * Produkt powstał w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”;
 * autorskie prawa majątkowe pozostają przy autorze. Licencja: LICENSE.
 */
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
  DoubleSide, AdditiveBlending, Sprite, SpriteMaterial,
  CanvasTexture, SRGBColorSpace, PointLight, Color, BufferGeometry, Float32BufferAttribute,
} from "three";
import { Pnacze } from "./pnacze.js";
import { mnoznikObrysu, promienZObrysu, srodekObrysu } from "./teren.js";

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

// WSKAŹNIKI. Krąg i kropla wynurzają się dopiero przy lisku: świat, który
// świeci wskaźnikami bez przerwy, przestaje cokolwiek podpowiadać.
const POLE_WIDOCZNOSCI = 3.4;            // metrów ZA kręgiem — tam zaczyna się wynurzanie
const BARWA_KREGU_WODA = 0x8fd8ff;       // „przynieś wodę"
const BARWA_KREGU_WSPINACZKA = 0xffe2a0; // „wejdź na mnie" (po ostatnim podlaniu)
const klamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

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
 * Grządka pod rośliną. Sama PLAMA przekopanej ziemi to teren: `teren.js`
 * dodaje pod fasolą płytki `wykop`, a `shader-terenu.js` maluje go per piksel
 * (tak samo jak brzeg stawu) — obły, postrzępiony, bez osobnej siatki. Tu jest
 * tylko to, co wystaje: niski kopczyk pod ziarnem, grudki ziemi i kilka
 * szarych, nieregularnych kamyków wokół. Kopiec rośnie razem z rośliną
 * (nabiegi korzeniowe — patrz `update`).
 */
function kopczyk(r = 0.55, ziarno = 4, promienGrzadki = 1.05) {
  let sd = (ziarno * 9301 + 49297) % 233280;
  const los = () => (sd = (sd * 9301 + 49297) % 233280) / 233280;
  const g = new Group();
  const rdzen = new Group(); // to, co rośnie z rośliną (kopiec + grudki); kamyki zostają
  rdzen.name = "rdzen";
  g.add(rdzen);
  const czasza = mesh(new SphereGeometry(r, 10, 7), matKanciasty(FASOLA.barwaZiemia), [0, -r * 0.66, 0]);
  czasza.scale.set(1.15, 0.42, 1.08);
  rdzen.add(czasza);
  // grudki ziemi — świeżo okopana
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + 0.4 + (los() - 0.5) * 0.5;
    const d = r * (0.62 + los() * 0.3);
    const s = r * (0.08 + los() * 0.07);
    const k = mesh(new IcosahedronGeometry(s, 0), matKanciasty(i % 2 ? 0x8a6a46 : 0x6d5232),
      [Math.cos(a) * d, r * 0.01, Math.sin(a) * d], [los() * 3, los() * 3, los() * 3]);
    k.scale.set(1.15, 0.65, 1);
    rdzen.add(k);
  }
  // kamyki — dalej od środka, na obrzeżu wykopu
  // brązowe, tuż przy ziarnie (jak na koncepcie: ziarno obłożone grudami)
  const barwy = [0x7d5a3c, 0x6b4c31, 0x8f6a47];
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + (los() - 0.5) * 0.8 + 0.9;
    const d = r * (0.55 + los() * 0.35);
    const s = 0.06 + los() * 0.08;
    const k = mesh(new IcosahedronGeometry(s, 0), matKanciasty(barwy[i % barwy.length]),
      [Math.cos(a) * d, s * 0.25, Math.sin(a) * d], [los() * 3, los() * 3, los() * 3]);
    k.scale.set(0.8 + los() * 0.6, 0.5 + los() * 0.35, 0.8 + los() * 0.6);
    g.add(k);
  }
  return g;
}

/**
 * FOSFORYZUJĄCE ZIARNO. Model z Tripo ma bladą, „pastelową" teksturę; zieleń
 * podbijamy DWA razy: (1) sama tekstura — piksele, w których zieleń dominuje,
 * dostają więcej nasycenia i jasności (kamyki i ziemia w modelu zostają
 * bez zmian), (2) materiał — emisja przez tę samą mapę, więc świeci tylko to,
 * co zielone. Efekt: ziarno jest jaśniejsze od trawy i lekko żarzy się
 * od środka, a po zmroku zostaje widoczne.
 */
function rozswietlZiarno(o) {
  const m = o.material;
  if (!m || !m.map || m.userData.rozswietlone) return;
  m.userData.rozswietlone = true;
  const img = m.map.image;
  if (img && img.width) {
    const c = document.createElement("canvas");
    c.width = img.width; c.height = img.height;
    const x = c.getContext("2d");
    x.drawImage(img, 0, 0);
    const d = x.getImageData(0, 0, c.width, c.height);
    const px = d.data;
    for (let i = 0; i < px.length; i += 4) {
      const r = px[i], g = px[i + 1], b = px[i + 2];
      const zielen = g - Math.max(r, b);          // jak bardzo piksel jest zielony
      if (zielen <= 6) continue;
      const w = Math.min(1, zielen / 40);         // miękkie wejście, bez ostrych krawędzi
      px[i]     = Math.min(255, r * (1 - 0.35 * w) + 30 * w);
      px[i + 1] = Math.min(255, g * (1 + 0.28 * w) + 22 * w);
      px[i + 2] = Math.min(255, b * (1 - 0.55 * w));
    }
    x.putImageData(d, 0, 0);
    const t = new CanvasTexture(c);
    t.colorSpace = m.map.colorSpace;
    t.flipY = m.map.flipY;
    t.wrapS = m.map.wrapS; t.wrapT = m.map.wrapT;
    m.map = t;
  }
  m.emissive = new Color(0x8cff5e);
  m.emissiveMap = m.map;
  m.emissiveIntensity = 0.55;
  m.needsUpdate = true;
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
 * Ikona kropli — rysowana raz na canvasie, potem żyje jako sprite (zawsze
 * przodem do kamery). Biały obrys, bo tło jest zielone i sama błękitna
 * kropla ginęłaby na trawie.
 */
let _ikonaKropli = null;
function teksturaIkonyKropli() {
  if (_ikonaKropli) return _ikonaKropli;
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const x = c.getContext("2d");
  const ksztalt = () => {
    x.beginPath();
    x.moveTo(64, 12);
    x.bezierCurveTo(78, 34, 110, 58, 110, 80);   // prawy bok w dół
    x.arc(64, 80, 46, 0, Math.PI);               // okrągły spód
    x.bezierCurveTo(18, 58, 50, 34, 64, 12);     // lewy bok w górę
    x.closePath();
  };
  // miękki cień pod obrysem — odkleja kroplę od trawy
  x.save();
  x.shadowColor = "rgba(18,52,78,0.55)";
  x.shadowBlur = 12;
  x.shadowOffsetY = 3;
  x.fillStyle = "rgba(255,255,255,0.95)";
  ksztalt();
  x.fill();
  x.restore();
  const g = x.createLinearGradient(0, 16, 0, 124);
  g.addColorStop(0, "#dff6ff");
  g.addColorStop(0.45, "#8fd8ff");
  g.addColorStop(1, "#3aa6dd");
  x.fillStyle = g;
  ksztalt();
  x.save();
  x.clip();
  x.fillRect(0, 0, 128, 128);
  x.restore();
  x.lineWidth = 7;
  x.strokeStyle = "rgba(255,255,255,0.95)";
  ksztalt();
  x.stroke();
  // refleks
  x.beginPath();
  x.ellipse(48, 78, 11, 16, -0.35, 0, Math.PI * 2);
  x.fillStyle = "rgba(255,255,255,0.72)";
  x.fill();
  _ikonaKropli = new CanvasTexture(c);
  _ikonaKropli.colorSpace = SRGBColorSpace;
  return _ikonaKropli;
}

/**
 * KRĄG AKTYWNOŚCI — wstęga leżąca na ziemi wzdłuż okręgu o promieniu
 * `zasieg`, czyli dokładnie tam, gdzie `planeta.odleglosc` zaczyna
 * przyjmować kroplę. Dwie rzeczy, których nie wolno uprościć:
 *
 *  • Okrąg jest okręgiem NA KULI, a nie na mapie. Rzut mapy ściska
 *    odległości styczne (przy r≈9 do ~0,56), więc koło narysowane we
 *    współrzędnych mapy wyszłoby elipsą przesuniętą względem strefy,
 *    którą naprawdę liczy gra.
 *  • Wysokość każdego wierzchołka bierzemy z PRAWDZIWEGO terenu
 *    (`wysokoscGruntu`), bo teren jest fasetowany: krąg na jednej
 *    wysokości tonąłby w jednej krawędzi trójkąta i wisiał nad drugą.
 */
const PRZESWIT_KREGU = 0.085;   // 0,055 zakopania korzenia + 3 cm nad darnią
function siatkaKregu(planeta, root, r, wewn, gruntSrodka, wysokoscGruntu, punkty = 88) {
  const pos = [], idx = [];
  const R = planeta.R;
  const v = new Vector3();
  const m = { x: 0, z: 0, h: 0 };
  root.updateMatrix();   // root.matrix: układ rośliny → układ planety
  const wysokosc = (dx, dz) => {
    const luk = Math.sqrt(Math.max(0, R * R - dx * dx - dz * dz)) - R;
    if (!wysokoscGruntu) return luk + PRZESWIT_KREGU;
    v.set(dx, luk, dz).applyMatrix4(root.matrix);
    planeta.zKuli(v, m);
    return luk + (wysokoscGruntu(m.x, m.z) - gruntSrodka) + PRZESWIT_KREGU;
  };
  for (let j = 0; j < punkty; j++) {
    const t = (j / punkty) * Math.PI * 2;
    for (const rr of [r * wewn, r]) {
      const dx = Math.cos(t) * rr, dz = Math.sin(t) * rr;
      pos.push(dx, wysokosc(dx, dz), dz);
    }
  }
  for (let j = 0; j < punkty; j++) {
    const a = j * 2, b = a + 1, c = ((j + 1) % punkty) * 2, d = c + 1;
    idx.push(a, b, d, a, d, c);
  }
  const g = new BufferGeometry();
  g.setAttribute("position", new Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
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
 * KRĄG NA WODZIE O KSZTAŁCIE STAWU.
 *
 * Do 18.09 fala była `RingGeometry`, czyli idealnym kołem, rozciąganym skalą.
 * Dwie rzeczy z tego nie wychodziły i obie widać było na zrzucie z gry:
 *
 *  1. Staw nie jest kołem. Koło o promieniu bliskim NAJWIĘKSZEMU promieniowi
 *     stawu wychodzi poza brzeg wszędzie tam, gdzie staw jest węższy — fala
 *     wypływała na piasek i na trawę.
 *  2. Koło było PŁASKIE, a tafla wody idzie za kulą. Przy promieniu 2,7
 *     i R = 8,5 powierzchnia wody opada na brzegu o 0,43 — czyli cztery razy
 *     więcej, niż wynosi głębokość stawu. Płaski pierścień wisiał więc nad
 *     wodą, a przy brzegu nad gruntem.
 *
 * Dlatego fala ma własną siatkę: te same kierunki i ten sam mnożnik `r(θ)`,
 * co tafla, a wysokość każdego wierzchołka liczona z kuli. Animacja nie
 * skaluje obiektu (skalowanie zepsułoby dopasowanie do kuli), tylko
 * PRZEPISUJE pozycje — dwa okręgi po `punkty` wierzchołków, więc to kilkaset
 * liczb na klatkę.
 */
function falaOczka(r, mnoznik, R, punkty, material) {
  const kier = new Float64Array(punkty * 3);
  for (let j = 0; j < punkty; j++) {
    const t = (j / punkty) * Math.PI * 2;
    kier[j * 3] = Math.cos(t);
    kier[j * 3 + 1] = Math.sin(t);
    kier[j * 3 + 2] = r * mnoznik(t);
  }
  const atr = new Float32BufferAttribute(new Float32Array(punkty * 2 * 3), 3);
  const idx = [];
  for (let j = 0; j < punkty; j++) {
    const a = j, b = (j + 1) % punkty, c = a + punkty, d = b + punkty;
    idx.push(a, d, c, a, b, d);
  }
  const g = new BufferGeometry();
  g.setAttribute("position", atr);
  g.setIndex(idx);
  const mesh = new Mesh(g, material);
  mesh.name = "fala-oczka";
  mesh.frustumCulled = false;          // pozycje zmieniają się co klatkę
  return {
    mesh,
    /** `roWew`/`roZew` w ułamku promienia stawu; 1 = dokładnie brzeg. */
    ustaw(roWew, roZew, y) {
      const a = atr.array;
      for (let krag = 0; krag < 2; krag++) {
        const ro = krag === 0 ? roWew : roZew;
        for (let j = 0; j < punkty; j++) {
          const rr = ro * kier[j * 3 + 2];
          const o = (krag * punkty + j) * 3;
          a[o] = kier[j * 3] * rr;
          a[o + 1] = Math.sqrt(Math.max(0, R * R - rr * rr)) - R + y;
          a[o + 2] = kier[j * 3 + 1] * rr;
        }
      }
      atr.needsUpdate = true;
    },
  };
}

/**
 * Oczko wody: tafla dopasowana do kuli + lekkie falowanie. Niecka i brzeg
 * są WPISANE W TEREN (`teren.js` daje nieckę pod `mapa.oczko`, `swiat.js`
 * koloruje dno i stok), więc tafla leży w ziemi, a nie na niej. Lisek
 * wchodzi w nie po wodę; nie blokuje ruchu.
 */
export const OCZKO = { glebokosc: 0.11 };

export function zbudujOczko(def, planeta) {
  /* KSZTAŁT PRZYCHODZI Z TEGO SAMEGO MIEJSCA, CO W TERENIE. Obrys narysowany
     ręcznie (`punkty`) zamienia się na r(θ) i wchodzi tam, gdzie dotąd stał
     mnożnik z ziarna — więc tafla wody i niecka w gruncie są z definicji tym
     samym kształtem. Gdyby liczyć je osobno, rozjechałyby się przy pierwszej
     zmianie i woda zaczęłaby wystawać zza brzegu. */
  const reczny = Array.isArray(def.punkty) && def.punkty.length >= 3
    ? promienZObrysu(def.punkty, { gladkosc: def.gladkosc, probki: def.probki }) : null;
  const r = reczny ? 1 : (def.promien ?? 1.4);
  const mn = reczny ? reczny.r : mnoznikObrysu(def.ziarno ?? 1);
  /* GĘSTOŚĆ OBWODU rośnie z rozmiarem: przy ręcznym obrysie garść punktów
     zaokrągliłaby narysowaną zatoczkę tak, że nie byłoby jej widać.
     MNOŻNIK PODNIESIONY Z 26 NA 60 (18.09). Przy 26 staw o promieniu 2,5
     dostawał 66 segmentów, czyli odcinki po 0,22 jednostki z załamaniami do
     13,5° — a kamera gry pokazuje staw na jakieś sto pikseli na jednostkę,
     więc każdy taki odcinek to dwadzieścia parę pikseli prostej krawędzi
     i widoczne, drobne WCIĘCIE w brzegu wody. Przy 60 odcinek ma 0,10
     jednostki, największe załamanie spada do 4,8°, a załamań powyżej 10°
     nie ma już wcale. Koszt: tafla to kilkaset wierzchołków więcej, raz,
     przy budowie świata. */
  const obwod = reczny ? Math.min(240, Math.max(72, Math.round(reczny.max * 60))) : 64;
  const R = planeta.R;
  const g = new Group();
  g.name = "oczko";
  const gl = def.glebokosc ?? OCZKO.glebokosc;
  // brzeg jest CZĘŚCIĄ TERENU (teren.js/swiat.js: niecka + piaskowe ścianki);
  // tu tylko tafla, tuż nad płaskim dnem niecki.
  const tafla = new Mesh(
    siatkaOczka(r, mn, R, 0, 1.02, () => -gl + 0.05, 5, obwod),
    new MeshLambertMaterial({ color: 0x5fc4de, emissive: 0x1a6a88, emissiveIntensity: 0.35, transparent: true, opacity: 0.92 }),
  );
  g.add(tafla);
  /* Kręgi na wodzie biegną po TYM SAMYM kształcie, co tafla (`r`, `mn`), więc
     nie mają jak wyjść na brzeg — najszerszy dochodzi do 0,92 promienia
     w każdym kierunku z osobna. Szerokość pasma jest ułamkiem promienia,
     żeby na dużym stawie fala nie była nitką, a na małym obręczą. */
  const yFali = -gl + 0.055;
  const fale = [];
  for (let i = 0; i < 3; i++) {
    const f = falaOczka(r, mn, R, obwod, new MeshBasicMaterial({
      color: 0xdff6ff, transparent: true, opacity: 0.35, side: DoubleSide, depthWrite: false,
    }));
    f.faza = i / 3;
    f.ustaw(0.06, 0.10, yFali);
    g.add(f.mesh);
    fale.push(f);
  }
  // Środek ręcznego obrysu liczymy tak samo jak w `teren.js` (środek ciężkości),
  // inaczej tafla siedziałaby obok niecki.
  const pos = reczny ? reczny.srodek : def.pos;
  planeta.ustaw(g, pos[0], pos[1], 0, 0);
  const n = planeta.normalna(pos[0], pos[1]);
  return {
    mesh: g,
    n,
    pos,
    /* `promien` to ZASIĘG NABIERANIA WODY, nie rozmiar tafli. Przy ręcznym
       obrysie bierzemy największy promień: lisek ma nabrać wody, wchodząc
       w staw, a nie trafiając w jego środek ciężkości. */
    promien: reczny ? reczny.max : r,
    tik(dt) {
      for (const f of fale) {
        f.faza = (f.faza + dt * 0.28) % 1;
        const u = f.faza;
        /* Krąg rusza spod środka i gaśnie, ZANIM dojdzie do samego brzegu:
           0,92 zostawia pasek wody przy piasku, dzięki czemu fala wygląda,
           jakby się rozeszła, a nie jakby uderzyła w krawędź. */
        const zew = 0.10 + u * 0.82;
        f.ustaw(Math.max(0, zew - 0.045), zew, yFali);
        f.mesh.material.opacity = 0.42 * (1 - u) * (1 - u);
      }
    },
  };
}

export class Fasola {
  /**
   * @param {object} def wpis `fasola` z mapy
   * @param {Planeta} planeta
   * @param {(plik: string) => Promise<{scene: Group}>} loadGLB loader sceny
   * @param {(x: number, z: number) => number} [wysokoscGruntu]
   */
  constructor(def, planeta, loadGLB, wysokoscGruntu) {
    this.def = def;
    this.planeta = planeta;
    this.etap = 0;
    this.rosnie = null; // { t, od, do }
    this.czas = Math.random() * 10;
    this.n = planeta.normalna(def.pos[0], def.pos[1]);
    this.root = new Group();
    this.root.name = "fasola";
    const grunt = wysokoscGruntu ? wysokoscGruntu(def.pos[0], def.pos[1]) : 0;
    // Korzenie i kopczyk chowają punkt styku nawet na krawędzi trójkąta terenu.
    planeta.ustaw(this.root, def.pos[0], def.pos[1], grunt - .055, def.obrot ?? 0);
    const domyslne = [0.45, 0.9, 1.9, 3.2, 5.5];
    this.etapy = (def.etapy || []).map((e, i) => ({ def: e, wysokosc: e.wysokosc ?? domyslne[i] ?? 1 }));
    if (!this.etapy.length) for (let i = 0; i < 5; i++) this.etapy.push({ def: {}, wysokosc: domyslne[i] });
    this.H = this.etapy[this.ostatni].wysokosc;
    // stopień wzrostu pnącza dla każdego etapu: 0 = ziarno, 1 = pełna wysokość
    this.cele = this.etapy.map((e, i) => (i === 0 ? 0 : Math.min(1, e.wysokosc / this.H)));

    const P = def.pnacze || {};
    this.pnacze = new Pnacze({
      H: this.H, obroty: P.obroty, pnacza: P.pnacza, pedy: P.pedy, grubosc: P.grubosc,
      // krzywa wygięcia czubka — strojona w `/scena-3d/edytor-fasoli.html`
      wygiecieOd: P.wygiecieOd, wygiecieSila: P.wygiecieSila, wygiecieOpad: P.wygiecieOpad,
      szerokoscSciezki: P.szerokosc, ziarno: P.ziarno ?? 1,
    });
    this.u = 0;
    this.root.add(this.pnacze.group);
    // kopiec dobrany do grubości dojrzałej rośliny; przy ziarnie jest mały
    // i rośnie razem z pnączami (patrz `update`)
    this.kopczyk = kopczyk(Math.max(0.5, this.pnacze.grubosc * 1.3), def.grzadka?.ziarno ?? 4, def.grzadka?.promien ?? 1.05);
    this.kopczyk.getObjectByName("rdzen").scale.setScalar(0.4);
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

    // KRĄG AKTYWNOŚCI — dokładnie ten okrąg, który liczy `planeta.odleglosc`
    // przy podlewaniu, więc dziecko widzi, gdzie „roślina słyszy".
    this.zasieg = def.zasieg ?? 1.9;
    this.kragMat = new MeshBasicMaterial({
      color: BARWA_KREGU_WODA, transparent: true, opacity: 0,
      side: DoubleSide, depthWrite: false, toneMapped: false,
    });
    this.krag = new Mesh(siatkaKregu(planeta, this.root, this.zasieg, 0.9, grunt, wysokoscGruntu), this.kragMat);
    this.krag.renderOrder = 2;
    this.krag.visible = false;
    this.root.add(this.krag);

    // IKONA KROPLI nad rośliną + kropelka, która co jakiś czas z niej spada.
    // To spadanie niesie treść („polej mnie"); samo pulsowanie ikony mówi
    // tylko „tu coś jest".
    this.ikonaWody = new Sprite(new SpriteMaterial({
      map: teksturaIkonyKropli(), transparent: true, opacity: 0,
      depthWrite: false, toneMapped: false,
    }));
    this.ikonaWody.scale.set(0.62, 0.82, 1);
    this.ikonaWody.visible = false;
    this.root.add(this.ikonaWody);
    this.kropelka = new Sprite(this.ikonaWody.material.clone());
    this.kropelka.scale.set(0.24, 0.32, 1);
    this.kropelka.visible = false;
    this.root.add(this.kropelka);
    this._kapanie = 0;

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
        scena.traverse((o) => { if (o.isMesh) { o.castShadow = true; rozswietlZiarno(o); } });
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

  /**
   * Krąg aktywności i kropla. Oba mówią JEDNO zdanie naraz:
   *   • roślina czeka na wodę  → błękit, kropla kapie nad kopczykiem,
   *   • lisek niesie kroplę    → mocniej i szybciej (nagroda za znalezienie wody),
   *   • roślina wyrośnie       → kropla znika, krąg złocieje w „wejdź na mnie".
   * Poza `zasieg + POLE_WIDOCZNOSCI` wszystko jest wygaszone do zera.
   */
  _wskazniki(dt, dBohater, maKrople) {
    const bliskosc = klamp01((this.zasieg + POLE_WIDOCZNOSCI - dBohater) / 2.2);
    const doWspinaczki = this.gotowa;
    const tempo = maKrople ? 3.4 : 2.1;
    const puls = 0.72 + 0.28 * Math.sin(this.czas * tempo);
    const moc = doWspinaczki ? 0.5 : (maKrople ? 0.7 : 0.4);
    this.kragMat.color.setHex(doWspinaczki ? BARWA_KREGU_WSPINACZKA : BARWA_KREGU_WODA);
    this.kragMat.opacity = moc * bliskosc * puls * (dBohater < this.zasieg ? 1.25 : 1);
    this.krag.visible = this.kragMat.opacity > 0.004;

    // kropla tylko wtedy, gdy roślina naprawdę czeka na wodę (nie w trakcie wzrostu)
    const czeka = !doWspinaczki && !this.rosnie && bliskosc > 0.01;
    this.ikonaWody.visible = czeka;
    this.kropelka.visible = false;
    if (!czeka) return;
    const podstawa = Math.min(this.wysokosc, 1.7) + 0.62;
    this._kapanie = (this._kapanie + dt * (maKrople ? 0.62 : 0.42)) % 1;
    const k = this._kapanie;
    const odbicie = k < 0.12 ? Math.sin((k / 0.12) * Math.PI) : 0;   // moment oderwania kropelki
    this.ikonaWody.position.y = podstawa + Math.sin(this.czas * 2.4) * 0.07 - 0.06 * odbicie;
    this.ikonaWody.scale.set(0.62 * (1 - 0.12 * odbicie), 0.82 * (1 + 0.12 * odbicie), 1);
    this.ikonaWody.material.opacity = bliskosc * (maKrople ? 1 : 0.88);
    if (k > 0.1 && k < 0.55) {
      const u = (k - 0.1) / 0.45;
      this.kropelka.visible = true;
      this.kropelka.position.set(0, podstawa - 0.2 - (podstawa - 0.05) * u * u, 0);
      this.kropelka.material.opacity = bliskosc * (u > 0.82 ? (1 - u) / 0.18 : 1);
    }
  }

  update(dt, dBohater = 99, maKrople = false) {
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
      this.kopczyk.getObjectByName("rdzen").scale.setScalar(k);
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
    this._wskazniki(dt, dBohater, maKrople);
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
