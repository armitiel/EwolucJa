/**
 * mapa.js — dane świata z `mapa.json` (przez `globalThis.__SCENA3D_MAPA`)
 * z wartościami zapasowymi z pierwotnego prototypu. Wszystko w płaskim
 * układzie mapy (x, z); na kulę przenosi to `planeta.js`.
 *
 * Mapa czytana jest przy TWORZENIU sceny (nie przy ładowaniu modułu), więc
 * `__SCENA3D_MAPA` wystarczy ustawić przed `utworzScena3D`.
 */
import { Vector2, Vector3 } from "three";
import { domyslnyPromienKuli } from "./planeta.js";

const DOMYSLNA_RZEKA = [
  { od: [-12, 3.5], kontrola: [-6, 5.2], do: [-3.2, 8.6], kroki: 12 },
  { od: [-3.2, 8.6], kontrola: [-2.2, 10.6], do: [-4.5, 15.5], kroki: 8 },
];

const DOMYSLNA_SCIEZKA = [
  [-6.2, 8.6], [-4.7, 6.9], [-3.2, 5.2], [-1.4, 4.1], [-0.1, 2.6],
  [0.9, 0.6], [1.1, -1.4], [0.5, -3.4], [0, -5.6],
];

const DOMYSLNE_BUDYNKI = [
  { file: "hut2", pos: [-10.6, -4.4], wysokosc: 5.2, obrot: 0.55, promien: 2.6, jasnosc: 1.45 },
];

const GWIAZDKA = (id, pos) => ({
  id, file: "gwiazda", label: "Złota gwiazdka", toast: "Złota gwiazdka — złapana!",
  scale: 0.78, height: 0.95, glow: 16765514, barwa: 16763215, jasnosc: 1.32,
  metalness: 0.3, roughness: 0.7, haloOpacity: 0.1, haloScale: 0.9, ringOpacity: 0,
  lightBase: 0, absorb: true, absorbLift: 1.5, respawn: 12, iskry: 26, iskrySila: 1.6, pos,
});

const DOMYSLNE_ZNAKI = [
  {
    id: "czarodziej", file: "wizard", label: "Czarodziej", toast: "Czarodziej pojawił się w lesie",
    pos: [-3, 4], pozycje: [[-3, 4], [-7, -8], [4, 3.5], [4, -8], [0.5, 9]],
    scale: 3.7, height: 1.3, absorbLift: 2.8, animuj: true, bezObrotu: true, obrotY: 0.484,
    absorb: false, raz: true, zasieg: 1.9, zbrojenie: 3.4, margines: 1.8, cykl: 35,
    respawn: 60, respawnPierwszy: 12, glow: 12093672, ringColor: 14268159, jasnosc: 1.6,
    metalness: 0, roughness: 0.85, haloOpacity: 0.2, haloScale: 1.7, ringOpacity: 0.3,
    lightBase: 0, iskry: 38, iskrySila: 1.9,
  },
  {
    id: "karty", file: "karta", label: "Pamięć Mędrca", toast: "Karty Mędrca — dobierz pary",
    pos: [3, 2.6], scale: 1.3, height: 1.15, glow: 8015298, ringColor: 13148400,
    haloOpacity: 0.2, haloScale: 1.2, ringOpacity: 0.22, lightBase: 0, metalness: 0,
    roughness: 0.85, jasnosc: 1.7, absorb: true, absorbLift: 1.7, respawn: 3.2,
  },
  {
    id: "leaf", file: "lisc", label: "Sekret pod puchem", toast: "Piórko — sekret pod puchem",
    pos: [-1.3, 3.1], scale: 1.6, height: 1.55, glow: 10481874, ringColor: 12451048,
    haloOpacity: 0.13, ringOpacity: 0, lightBase: 0, haloScale: 1.15, metalness: 0,
    roughness: 0.9, absorb: true, absorbLift: 1.7, respawn: 3.2,
  },
  GWIAZDKA("gwiazda-1", [-0.4, 4.6]), GWIAZDKA("gwiazda-2", [2.4, 5.2]),
  GWIAZDKA("gwiazda-3", [-4.6, 1.2]), GWIAZDKA("gwiazda-4", [0.8, -2.4]),
  GWIAZDKA("gwiazda-5", [-3.2, -3.4]), GWIAZDKA("gwiazda-6", [4.8, 0.6]),
  GWIAZDKA("gwiazda-7", [-6.1, -1.6]), GWIAZDKA("gwiazda-8", [1.6, 7.0]),
  GWIAZDKA("gwiazda-9", [5.4, -3.8]),
];

/** Punkty krzywej Béziera 2. stopnia — używane i przez teksturę, i przez kolizję rzeki. */
function punktyRzeki(krzywe) {
  const B = (a, b, c, t) =>
    new Vector2(
      (1 - t) * (1 - t) * a[0] + 2 * (1 - t) * t * b[0] + t * t * c[0],
      (1 - t) * (1 - t) * a[1] + 2 * (1 - t) * t * b[1] + t * t * c[1],
    );
  const o = [];
  krzywe.forEach((k, ki) => {
    const n = k.kroki || 12;
    for (let i = ki ? 1 : 0; i <= n; i++) o.push(B(k.od, k.kontrola, k.do, i / n));
  });
  return o;
}

export function wczytajMape() {
  const M = globalThis.__SCENA3D_MAPA || {};
  const promienMapy = M.swiat?.promien ?? 12.5;
  const teren = M.swiat?.teren ?? 36;
  const promienKuli =
    Number(globalThis.SCENA3D_PROMIEN_KULI) ||
    M.swiat?.promienKuli ||
    domyslnyPromienKuli(promienMapy);

  const sciezka = (M.sciezka || DOMYSLNA_SCIEZKA).map((p) => new Vector3(p[0], 0, p[1]));
  const krzyweRzeki = M.rzeka?.krzywe || DOMYSLNA_RZEKA;

  // Dalej niż ~130° od środka mapy (w stronę antypodu) rzut zwija wszystko
  // w jeden punkt — rzekę i ścieżkę przycinamy PRZED tym miejscem, żeby nie
  // było „wachlarza" na drugiej stronie planety.
  const promienTresci = M.swiat?.promienTresci ?? 0.72 * Math.PI * promienKuli;

  return {
    surowa: M,
    promienMapy,
    teren,
    promienKuli,
    promienTresci,
    start: M.start || null,
    sciezka,
    latarnia: {
      pos: new Vector3(M.latarnia?.pos?.[0] ?? 2.5, 0, M.latarnia?.pos?.[1] ?? -1.2),
      punktSciezki: M.latarnia?.punktSciezki ?? 6,
      ukryta: !!M.latarnia?.ukryta,
    },
    most: { pos: [M.most?.pos?.[0] ?? -4.7, M.most?.pos?.[1] ?? 6.9] },
    brama: { pos: [M.brama?.pos?.[0] ?? 0, M.brama?.pos?.[1] ?? -7.2] },
    rzeka: {
      szerokosc: M.rzeka?.szerokosc ?? 1.5,
      krzywe: krzyweRzeki,
      punkty: punktyRzeki(krzyweRzeki),
    },
    galezie: Array.isArray(M.galezie) ? M.galezie : [],
    drzewa: M.drzewa || null,
    glazy: M.glazy || null,
    kwiaty: M.kwiaty || [],
    budynki: M.budynki ?? DOMYSLNE_BUDYNKI,
    znaki: M.znaki ?? DOMYSLNE_ZNAKI,
  };
}
