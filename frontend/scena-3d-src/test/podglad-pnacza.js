/**
 * podglad-pnacza.js — samodzielny podgląd proceduralnej fasoli (bez planety).
 * Buduje się osobno:  node scena-3d-src/test/buduj-podglad.mjs
 * i otwiera plikiem   scena-3d-src/test/podglad-pnacza.html
 *
 * Do oceny kształtu: suwak wzrostu, przełącznik liści (test krytyczny z briefu),
 * widok z boku / z góry, siatka kolizji ścieżki.
 */
import {
  Scene, PerspectiveCamera, WebGLRenderer, Color, HemisphereLight, DirectionalLight,
  Mesh, MeshBasicMaterial, CircleGeometry, Vector3, GridHelper, DoubleSide,
} from "three";
import { Pnacze } from "../src/pnacze.js";

const H = Number(new URLSearchParams(location.search).get("h")) || 9;
const scena = new Scene();
scena.background = new Color(0xbfe0f2);
const kamera = new PerspectiveCamera(38, innerWidth / innerHeight, 0.05, 200);
const rend = new WebGLRenderer({ antialias: true });
rend.setSize(innerWidth, innerHeight);
rend.setPixelRatio(Math.min(2, devicePixelRatio));
document.body.appendChild(rend.domElement);

scena.add(new HemisphereLight(0xdff0ff, 0x6a8a4a, 1.1));
const sl = new DirectionalLight(0xfff2d0, 1.5);
sl.position.set(6, 12, 5);
scena.add(sl);
const ziemia = new Mesh(new CircleGeometry(14, 24), new MeshBasicMaterial({ color: 0x7fae54, side: DoubleSide }));
ziemia.rotation.x = -Math.PI / 2;
scena.add(ziemia);
const siatka = new GridHelper(14, 14, 0x5f8a3c, 0x6f9a4c);
siatka.position.y = 0.01;
scena.add(siatka);

const P = new Pnacze({ H, obroty: 2.0, pnacza: 5, ziarno: 1 });
scena.add(P.group);

let u = 1, gora = false, ozdoby = true, obrot = 0.6, dist = H * 1.35, auto = true;
const stosuj = () => { P.pokazOzdoby(ozdoby); P.ustawWzrost(u); };
stosuj();

function klatka() {
  // kadr „auto" trzyma w obrazie tyle rośliny, ile już urosło
  const wys = Math.max(0.8, P.wysokosc);
  const d = auto ? Math.max(2.2, wys * 1.45) : dist;
  const cel = new Vector3(0, wys * (gora ? 0.5 : 0.46), 0);
  if (gora) kamera.position.set(0.001, wys * 2.1, 0.001);
  else kamera.position.set(Math.sin(obrot) * d, wys * 0.58, Math.cos(obrot) * d);
  kamera.lookAt(cel);
  rend.render(scena, kamera);
}
rend.setAnimationLoop(klatka);
addEventListener("resize", () => {
  kamera.aspect = innerWidth / innerHeight;
  kamera.updateProjectionMatrix();
  rend.setSize(innerWidth, innerHeight);
});

globalThis.__P = {
  pnacze: P,
  wzrost: (v) => { u = v; stosuj(); },
  ozdoby: (v) => { ozdoby = v; stosuj(); },
  widok: (g) => { gora = g; },
  obrot: (a) => { obrot = a; },
  dist: (d) => { dist = d; auto = !d; },
  auto: (v) => { auto = !!v; },
  panel: (v) => { const e = document.getElementById("panel"); if (e) e.style.display = v ? "" : "none"; },
  klatka,
  stan: () => P.stan(),
};
