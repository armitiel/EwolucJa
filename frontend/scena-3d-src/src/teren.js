/**
 * teren.js — FORMY TERENU rysowane po powierzchni planety.
 *
 * Teren (`swiat.js terenFasetowany`) i chodzenie bohatera (`app.groundHeightAt`)
 * liczą wysokość z tej samej funkcji `h(x, z)` (współrzędne mapy, wynik
 * w jednostkach mapy: + = wzniesienie, − = zagłębienie), więc to, co widać,
 * jest tym, po czym się chodzi, a obiekty (znaki, kwiaty, budynki) same
 * stają na właściwej wysokości.
 *
 * DANE (mapa.json):
 *   "formyTerenu": [
 *     { "typ": "wzgorze", "pos": [x, z], "promien": 4, "wysokosc": 0.6, "plaski": 0.3, "ziarno": 2 },
 *     { "typ": "niecka",  "pos": [x, z], "promien": 1.4, "glebokosc": 0.11, "stok": 0.9 }
 *   ]
 * `oczko` z mapy dostaje nieckę automatycznie (tafla leży W ziemi, nie na
 * niej). `ziarno` daje obły, nieregularny obrys (ten sam, co obrys oczka —
 * `mnoznikObrysu`), bez niego forma jest okrągła. `plaski` (0–1) to udział
 * płaskiego wierzchołka wzgórza. `stok` to szerokość zejścia w promieniach
 * (niecka: teren jest płaski do 1,0·r, potem łagodnie wraca do 1+stok;
 * ścianki terenu w strefie stoku są kolorowane na piaskowo — brzeg stawu
 * jest częścią terenu, nie osobną siatką).
 *
 * Wysokości są celowo skromne (dziesiąte części jednostki): bohater chodzi
 * po kuli z doliczoną wysokością, a kamera nie zna zboczy — wysokie góry
 * wyglądałyby jak ściany.
 */

/**
 * Obły, nieregularny obrys: mnożnik promienia 1 + Σ a_k·sin(kθ+φ_k) dla
 * k = 2, 3, 5 — niskie częstotliwości dają „kałużę", nie ząbki. `ziarno`
 * wybiera wariant (deterministycznie: ten sam kształt po każdym wczytaniu).
 */
export function mnoznikObrysu(ziarno = 1) {
  const f = (k) => Math.sin(ziarno * 12.9898 * k + 78.233) * 43758.5453;
  const faza = [2, 3, 5].map((k) => (f(k) % 1) * Math.PI * 2);
  const amp = [0.16, 0.1, 0.045];
  return (t) => 1 + amp[0] * Math.sin(2 * t + faza[0]) + amp[1] * Math.sin(3 * t + faza[1]) + amp[2] * Math.sin(5 * t + faza[2]);
}

const gladko = (u) => (u <= 0 ? 0 : u >= 1 ? 1 : u * u * (3 - 2 * u));

/** Odległość znormalizowana do obrysu formy (1 = brzeg). */
function odlegloscForma(f, x, z) {
  const dx = x - f.pos[0], dz = z - f.pos[1];
  const d = Math.hypot(dx, dz);
  if (!f._mn) return d / f.promien;
  const t = Math.atan2(dz, dx);
  return d / (f.promien * f._mn(t));
}

const PROFILE = {
  /** Kopiec: pełna wysokość na środku (albo na plaskim wierzchołku), zero na brzegu. */
  wzgorze(f, o) {
    const plaski = f.plaski ?? 0;
    if (o >= 1) return 0;
    const u = plaski >= 1 ? 0 : Math.max(0, (o - plaski) / (1 - plaski));
    return (f.wysokosc ?? 0.5) * (1 - gladko(u));
  },
  /** Niecka: płaskie dno do brzegu, potem stok do poziomu gruntu. */
  niecka(f, o) {
    const stok = f.stok ?? 0.9;
    if (o >= 1 + stok) return 0;
    const u = Math.max(0, (o - 1) / stok);
    return -(f.glebokosc ?? 0.11) * (1 - gladko(u));
  },
};

/**
 * Buduje funkcję wysokości z listy form mapy (+ niecka pod `oczko`).
 * Zwraca { h(x, z), formy, pusta }.
 */
export function formyTerenu(mapa) {
  const formy = [];
  for (const f of mapa.formyTerenu || []) {
    if (!f?.pos || !PROFILE[f.typ]) { console.warn("[teren] nieznana forma", f); continue; }
    formy.push({ ...f, promien: f.promien ?? 2, _mn: f.ziarno != null ? mnoznikObrysu(f.ziarno) : null });
  }
  if (mapa.oczko?.pos) {
    const o = mapa.oczko;
    formy.push({ typ: "niecka", pos: o.pos, promien: o.promien ?? 1.4, glebokosc: o.glebokosc ?? 0.11, stok: o.stok ?? 0.9, _mn: o.ziarno != null ? mnoznikObrysu(o.ziarno) : null, _zrodlo: "oczko" });
  }
  // zasięg każdej formy (do szybkiego odrzucania)
  for (const f of formy) f._zasieg = f.promien * 1.35 * (f.typ === "niecka" ? 1 + (f.stok ?? 0.9) : 1);
  const h = (x, z) => {
    let s = 0;
    for (const f of formy) {
      if (Math.abs(x - f.pos[0]) > f._zasieg || Math.abs(z - f.pos[1]) > f._zasieg) continue;
      s += PROFILE[f.typ](f, odlegloscForma(f, x, z));
    }
    return s;
  };
  /**
   * Strefa niecki dla kolorowania terenu: znormalizowana odległość od
   * brzegu najbliższej niecki (< 1 dno, 1..1+stok stok) albo null.
   */
  const niecka = (x, z) => {
    let best = null;
    for (const f of formy) {
      if (f.typ !== "niecka" || Math.abs(x - f.pos[0]) > f._zasieg || Math.abs(z - f.pos[1]) > f._zasieg) continue;
      const o = odlegloscForma(f, x, z);
      const stok = f.stok ?? 0.9;
      if (o < 1 + stok && (best === null || o < best.o)) best = { o, stok };
    }
    return best;
  };
  return { h, niecka, formy, pusta: formy.length === 0 };
}
