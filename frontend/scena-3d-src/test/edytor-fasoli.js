/**
 * edytor-fasoli.js — ręczne ustawianie wyglądu fasoli NA KAŻDYM ETAPIE.
 *
 * Po co: kształt rośliny na etapie `i` rządzi się JEDNĄ liczbą z mapy —
 * `fasola.etapy[i].wysokosc`. Ostatni etap ustala pełną wysokość `H` całej
 * rośliny (to jest SKALA), a każdy wcześniejszy jest jej ułamkiem i tyle
 * geometrii widać (to jest WYCIĘCIE: `Pnacze.ustawWzrost` przycina bufor
 * przez `drawRange`, nie przeskalowuje rośliny). Te dwie rzeczy chodzą więc
 * parami i dobiera się je okiem, a nie liczbą — stąd ten edytor.
 *
 * Czego NIE robi: nie zapisuje do `mapa-w2.json`. Wypluwa gotowy blok JSON
 * do skopiowania. Zapis z przeglądarki do pliku w repo wymagałby endpointu
 * w serwerze dev, a to zbyt dużo maszynerii jak na narzędzie do strojenia.
 *
 * Buduje się:  node scena-3d-src/test/buduj-edytor.mjs
 * i otwiera:   /scena-3d/edytor-fasoli.html
 */
import {
  Scene, PerspectiveCamera, WebGLRenderer, Color, HemisphereLight, DirectionalLight,
  Mesh, MeshBasicMaterial, CircleGeometry, Vector3, GridHelper, DoubleSide, BoxGeometry,
} from "three";
import { Pnacze } from "../src/pnacze.js";

const scena = new Scene();
scena.background = new Color(0xbfe0f2);
const kamera = new PerspectiveCamera(38, innerWidth / innerHeight, 0.05, 400);
const rend = new WebGLRenderer({ antialias: true });
rend.setSize(innerWidth, innerHeight);
rend.setPixelRatio(Math.min(2, devicePixelRatio));
document.body.appendChild(rend.domElement);

scena.add(new HemisphereLight(0xdff0ff, 0x6a8a4a, 1.1));
const sl = new DirectionalLight(0xfff2d0, 1.5);
sl.position.set(6, 12, 5);
scena.add(sl);
const ziemia = new Mesh(new CircleGeometry(30, 32), new MeshBasicMaterial({ color: 0x7fae54, side: DoubleSide }));
ziemia.rotation.x = -Math.PI / 2;
scena.add(ziemia);
scena.add(new GridHelper(30, 30, 0x5f8a3c, 0x6f9a4c));

// Znacznik wzrostu liska — bez skali odniesienia każda roślina wygląda dobrze.
const LISEK = 0.55;
const lisek = new Mesh(new BoxGeometry(0.35, LISEK, 0.7), new MeshBasicMaterial({ color: 0xd98b3f }));
lisek.position.set(1.6, LISEK / 2, 1.6);
scena.add(lisek);

const stan = {
  etapy: [0.45, 1.0, 2.4, 5.0, 9.0],
  pnacze: { obroty: 2.0, pedy: 3, ziarno: 1, wygiecieOd: 0.5, wygiecieSila: 0.42, wygiecieOpad: 0.16 },
  wybrany: 4,
  obrot: 0.9,
  auto: true,
  dist: 14,
  ozdoby: true,
};

let P = null;
function przebuduj() {
  if (P) { scena.remove(P.group); P.group.traverse((o) => { o.geometry?.dispose?.(); }); }
  const H = Math.max(0.2, stan.etapy[stan.etapy.length - 1]);
  // Wszystkie parametry z mapy idą dalej, nie tylko te z suwaków — inaczej
  // podgląd pokazywałby inną roślinę niż gra (np. `pnacza: 5` z `mapa-w2.json`).
  P = new Pnacze({ ...stan.pnacze, H });
  scena.add(P.group);
  zastosuj();
}
function zastosuj() {
  if (!P) return;
  const H = Math.max(0.2, stan.etapy[stan.etapy.length - 1]);
  const u = stan.wybrany === 0 ? 0 : Math.min(1, stan.etapy[stan.wybrany] / H);
  P.pokazOzdoby(stan.ozdoby);
  P.ustawWzrost(u);
}

function klatka() {
  const wys = Math.max(1, P ? P.wysokosc : 1);
  const d = stan.auto ? Math.max(2.5, wys * 1.5) : stan.dist;
  kamera.position.set(Math.sin(stan.obrot) * d, wys * 0.55, Math.cos(stan.obrot) * d);
  kamera.lookAt(new Vector3(0, wys * 0.45, 0));
  rend.render(scena, kamera);
}
rend.setAnimationLoop(klatka);
addEventListener("resize", () => {
  kamera.aspect = innerWidth / innerHeight;
  kamera.updateProjectionMatrix();
  rend.setSize(innerWidth, innerHeight);
});

/** Wczytuje bieżące ustawienia z mapy, żeby edytor startował od tego, co w grze. */
async function zMapy(nazwa = "mapa-w2.json") {
  try {
    const m = await fetch(`/scena-3d/${nazwa}`, { cache: "no-cache" }).then((r) => r.json());
    const f = m?.swiat ? m.fasola : m.fasola;
    if (f?.etapy?.length) stan.etapy = f.etapy.map((e, i) => e.wysokosc ?? stan.etapy[i] ?? 1);
    if (f?.pnacze) Object.assign(stan.pnacze, f.pnacze);
    stan.nazwyEtapow = (f?.etapy || []).map((e) => e.nazwa || "");
    stan.plikZiarna = f?.etapy?.[0]?.file || null;
    return true;
  } catch { return false; }
}

globalThis.__E = {
  stan,
  start: async () => { await zMapy(); przebuduj(); return stan; },
  etap: (i) => { stan.wybrany = i; zastosuj(); },
  wysokosc: (i, v) => {
    stan.etapy[i] = v;
    // ostatni etap to H całej rośliny — zmiana skali wymaga przebudowy siatki
    if (i === stan.etapy.length - 1) przebuduj(); else zastosuj();
  },
  param: (k, v) => { stan.pnacze[k] = v; przebuduj(); },
  ozdoby: (v) => { stan.ozdoby = v; zastosuj(); },
  obrot: (a) => { stan.obrot = a; },
  dist: (d) => { stan.dist = d; stan.auto = false; },
  autoKadr: (v) => { stan.auto = !!v; },
  /** Blok `fasola` gotowy do wklejenia w `mapa-w2.json`. */
  json: () => JSON.stringify({
    etapy: stan.etapy.map((w, i) => {
      const e = { wysokosc: Math.round(w * 100) / 100 };
      if (i === 0 && stan.plikZiarna) e.file = stan.plikZiarna;
      if (stan.nazwyEtapow?.[i]) e.nazwa = stan.nazwyEtapow[i];
      return e;
    }),
    pnacze: stan.pnacze,
  }, null, 2),
  /** Odchylenie osi od pionu na kilku wysokościach — liczbowa kontrola wygięcia. */
  krzywa: () => {
    if (!P) return null;
    const V = new Vector3();
    return [0.25, 0.5, 0.75, 1].map((t) => {
      P.os(t, V);
      return { t, bok: +Math.hypot(V.x, V.z).toFixed(2), y: +V.y.toFixed(2) };
    });
  },
  info: () => (P ? {
    etap: stan.wybrany,
    H: +P.H.toFixed(2),
    wyciecie: +(stan.wybrany === 0 ? 0 : stan.etapy[stan.wybrany] / stan.etapy[stan.etapy.length - 1]).toFixed(3),
    wysokoscTeraz: +P.wysokosc.toFixed(2),
    razyLisek: +(P.wysokosc / LISEK).toFixed(1),
  } : null),
};
