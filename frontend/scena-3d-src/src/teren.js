/*!
 * SPDX-FileCopyrightText: © 2026 Amitiel Angelisme <armitiel@gmail.com>
 * SPDX-License-Identifier: LicenseRef-EwolucJA-Proprietary
 *
 * EwolucJA — gra edukacyjna dla dzieci.
 * Produkt powstał w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”;
 * autorskie prawa majątkowe pozostają przy autorze. Licencja: LICENSE.
 */
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
 *     { "typ": "niecka",  "pos": [x, z], "promien": 1.4, "glebokosc": 0.11, "stok": 0.9 },
 *     { "typ": "wykop",   "pos": [x, z], "promien": 0.9, "glebokosc": 0.04, "stok": 0.7 },
 *     { "typ": "wzgorze", "punkty": [[x,z], …], "wysokosc": 0.6 }
 *   ]
 * Zamiast `promien` + `ziarno` forma może dostać `punkty` — obrys narysowany
 * ręcznie w edytorze. Obrys zamienia się na funkcję promienia r(θ) wokół
 * środka ciężkości (`promienZObrysu`) i dalej idzie tą samą drogą, co kształt
 * z ziarna. Patrz komentarz przy `promienZObrysu` — działa dla kształtów
 * gwiaździstych, czyli dla wszystkiego poza podkową.
 * `fasola` z mapy dostaje wykop automatycznie (`fasola.grzadka {promien,
 * glebokosc, stok, ziarno}` nadpisuje domyślne): płytkie zagłębienie, a kolor
 * przekopanej ziemi maluje shader terenu z atrybutu `ziemiaForma` (waga
 * 0..1 z `formy.ziemia(x, z)`) — per piksel, więc plama jest obła nawet na
 * grubych ściankach.
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

/* ── RĘCZNIE RYSOWANY OBRYS ───────────────────────────────────────────────
 *
 * POMYSŁ, na którym stoi cała ta funkcja: narysowany obrys zamieniamy na
 * FUNKCJĘ PROMIENIA r(θ) wokół środka — czyli dokładnie to, czym jest
 * `mnoznikObrysu`. Dzięki temu ręczny kształt wchodzi w istniejący kod
 * w jednym miejscu i od razu napędza wszystko naraz: nieckę w terenie,
 * piaskowy brzeg z shadera, taflę wody i kopiec. Żadnej triangulacji,
 * żadnego drugiego profilu, żadnej osobnej ścieżki dla „stawu z obrysem".
 *
 * OGRANICZENIE, które trzeba znać: działa dla kształtów GWIAŹDZISTYCH
 * względem środka — każdy punkt brzegu musi być widoczny ze środka. Staw
 * w kształcie podkowy (promień przebija brzeg dwa razy) wyjdzie wypełniony.
 * Dla stawów i pagórków to prawie zawsze wystarcza, a edytor ostrzega, gdy
 * obrys przestaje być gwiaździsty.
 */

/** Środek ciężkości obrysu — wokół niego liczymy promień. */
export function srodekObrysu(punkty) {
  let x = 0, z = 0;
  for (const p of punkty) { x += p[0]; z += p[1]; }
  return [x / punkty.length, z / punkty.length];
}

/**
 * Jeden segment Catmulla-Roma zmieszany z odcinkiem prostym — dokładnie ten
 * sam wzór, co `catmull()` w edytorze (ścieżka i gałęzie). `t` = 0 daje
 * łamaną, `t` = 1 pełny splajn.
 */
function katmull(p0, p1, p2, p3, u, t) {
  const prosto = [p1[0] + (p2[0] - p1[0]) * u, p1[1] + (p2[1] - p1[1]) * u];
  if (!t) return prosto;
  const u2 = u * u, u3 = u2 * u;
  const cr = (a, b, c, d) => .5 * (2 * b + (-a + c) * u + (2 * a - 5 * b + 4 * c - d) * u2 + (-a + 3 * b - 3 * c + d) * u3);
  const s = [cr(p0[0], p1[0], p2[0], p3[0]), cr(p0[1], p1[1], p2[1], p3[1])];
  return [prosto[0] + (s[0] - prosto[0]) * t, prosto[1] + (s[1] - prosto[1]) * t];
}

/**
 * ZAOKRĄGLENIE NAROŻNIKÓW. Klikane punkty to WĘZŁY, nie wierzchołki: staw
 * z ostrymi kątami wygląda jak wykrojony nożyczkami, a nie jak woda. Zamknięty
 * splajn Catmulla-Roma (indeksy zawijają się dookoła, nie przycinają jak przy
 * ścieżce) przepuszcza krzywą DOKŁADNIE przez klikane punkty i tylko wygładza
 * to, co między nimi — więc przeciąganie węzła robi to, czego się spodziewasz.
 *
 * Tej samej funkcji musi używać edytor przy rysowaniu planu (ma swoją kopię
 * z komentarzem). Gdyby się rozjechały, plan pokazywałby inny brzeg niż scena.
 */
export const OBRYS_GLADKOSC = 0.7;
export const OBRYS_PROBKI = 6;
export function wygladzObrys(P, gladkosc = OBRYS_GLADKOSC, probki = OBRYS_PROBKI) {
  if (!Array.isArray(P) || P.length < 3 || !(gladkosc > 0)) return (P || []).map((p) => [p[0], p[1]]);
  const n = P.length;
  const wez = (i) => P[((i % n) + n) % n];
  const kr = Math.max(1, Math.round(probki));
  const out = [];
  for (let i = 0; i < n; i++)
    for (let s = 0; s < kr; s++)
      out.push(katmull(wez(i - 1), wez(i), wez(i + 1), wez(i + 2), s / kr, gladkosc));
  return out;
}

/**
 * Obrys → `r(θ)`. Wynik idzie do tablicy `PROBKI` kierunków i jest potem
 * interpolowany liniowo: `h(x, z)` wołane jest dla każdego wierzchołka
 * terenu i dla każdego kroku bohatera, więc przecinanie promienia
 * z krawędziami na żywo byłoby marnotrawstwem.
 */
const PROBKI = 180;
export function promienZObrysu(punkty, opcje = {}) {
  /* ŚRODEK Z PUNKTÓW KLIKANYCH, promienie z krzywej WYGŁADZONEJ. Środek
     liczony z gęstej krzywej pełzałby przy każdej zmianie gładkości i tafla
     wody odjeżdżałaby od niecki; klikane węzły są stabilne. */
  const srodek = opcje.srodek || srodekObrysu(punkty);
  const brzeg = wygladzObrys(punkty, opcje.gladkosc ?? OBRYS_GLADKOSC, opcje.probki ?? OBRYS_PROBKI);
  const tab = new Float64Array(PROBKI);
  const [cx, cz] = srodek;
  for (let i = 0; i < PROBKI; i++) {
    const t = (i / PROBKI) * Math.PI * 2;
    const dx = Math.cos(t), dz = Math.sin(t);
    let naj = 0;
    for (let a = 0, b = brzeg.length - 1; a < brzeg.length; b = a++) {
      const ax = brzeg[b][0] - cx, az = brzeg[b][1] - cz;
      const bx = brzeg[a][0] - cx, bz = brzeg[a][1] - cz;
      // promień: P = u·(dx, dz); krawędź: Q = A + v·(B − A), u ≥ 0, v ∈ [0,1]
      const ex = bx - ax, ez = bz - az;
      // u·d = A + v·e, mnożymy wektorowo przez d (składowa z): znika u.
      //   0 = (d × A) + v·(d × e)   →   v = −(d × A) / (d × e)
      // Minus jest istotny — bez niego v wypada po drugiej stronie krawędzi
      // i promień trafia w inny bok wieloboku niż powinien.
      const mian = dx * ez - dz * ex;
      if (Math.abs(mian) < 1e-12) continue;
      const v = -(dx * az - dz * ax) / mian;
      if (v < 0 || v > 1) continue;
      const u = Math.abs(dx) > Math.abs(dz) ? (ax + v * ex) / dx : (az + v * ez) / dz;
      if (u > naj) naj = u;
    }
    tab[i] = naj;
  }
  // Pusty obrys (albo zdegenerowany) nie może dać zera: forma o promieniu 0
  // dzieliłaby przez zero w `odlegloscForma`.
  let max = 0;
  for (const v of tab) if (v > max) max = v;
  if (max < 1e-6) return { r: () => 1, max: 1, srodek };
  for (let i = 0; i < PROBKI; i++) if (tab[i] < 1e-6) tab[i] = max * 0.05;

  const r = (t) => {
    const u = ((t / (Math.PI * 2)) % 1 + 1) % 1 * PROBKI;
    const i = Math.floor(u), f = u - i;
    return tab[i] * (1 - f) + tab[(i + 1) % PROBKI] * f;
  };
  return { r, max, srodek };
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
  /** Wykop: płytka grządka wykopanej ziemi (pod fasolą) — profil jak niecka. */
  wykop(f, o) {
    return PROFILE.niecka({ ...f, glebokosc: f.glebokosc ?? 0.04, stok: f.stok ?? 0.7 }, o);
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
/**
 * Ujednolica formę: obrys ręczny i obrys z ziarna schodzą do tej samej pary
 * (`promien`, `_mn`), więc `odlegloscForma` nie musi wiedzieć, skąd kształt
 * pochodzi. Przy ręcznym obrysie `promien` = 1, a cała skala siedzi w `r(θ)`.
 */
function ujednolic(f, domyslnyPromien = 2) {
  if (Array.isArray(f.punkty) && f.punkty.length >= 3) {
    const o = promienZObrysu(f.punkty, { gladkosc: f.gladkosc, probki: f.probki });
    return { ...f, pos: f.pos || o.srodek, promien: 1, _mn: o.r, _maxR: o.max };
  }
  const promien = f.promien ?? domyslnyPromien;
  return { ...f, promien, _mn: f.ziarno != null ? mnoznikObrysu(f.ziarno) : null, _maxR: promien * 1.35 };
}

export function formyTerenu(mapa) {
  const formy = [];
  for (const f of mapa.formyTerenu || []) {
    if (!PROFILE[f?.typ] || (!f.pos && !Array.isArray(f.punkty))) { console.warn("[teren] nieznana forma", f); continue; }
    formy.push(ujednolic(f));
  }
  /* OCZKA WODNE. `oczka` to lista; `oczko` (pojedyncze) zostaje, bo tak stoi
     w starszych mapach — jedno i drugie dostaje tę samą nieckę. */
  const listaOczek = [...(mapa.oczka || []), ...(mapa.oczko?.pos || mapa.oczko?.punkty ? [mapa.oczko] : [])];
  for (const o of listaOczek) {
    formy.push(ujednolic({
      typ: "niecka", pos: o.pos, punkty: o.punkty, promien: o.promien ?? 1.4,
      glebokosc: o.glebokosc ?? 0.11, stok: o.stok ?? 0.9, ziarno: o.ziarno,
      gladkosc: o.gladkosc, probki: o.probki,
      _zrodlo: "oczko",
    }, 1.4));
  }
  if (mapa.fasola?.pos) {
    const f = mapa.fasola, g = f.grzadka || {};
    formy.push({ typ: "wykop", pos: f.pos, promien: g.promien ?? 1.05, glebokosc: g.glebokosc ?? 0.035, stok: g.stok ?? 0.8, _mn: mnoznikObrysu(g.ziarno ?? 4), _zrodlo: "fasola" });
  }
  /* Zasięg każdej formy — pudełko do szybkiego odrzucania. Liczony z `_maxR`,
     bo przy ręcznym obrysie `promien` to 1, a prawdziwy rozmiar siedzi w r(θ);
     bez tego staw o średnicy sześciu jednostek byłby odrzucany metr od środka
     i w terenie zostałaby po nim ścięta łata. */
  for (const f of formy) f._zasieg = (f._maxR ?? f.promien * 1.35) * (f.typ === "niecka" || f.typ === "wykop" ? 1 + (f.stok ?? 0.9) : 1) + 0.2;
  const h = (x, z) => {
    let s = 0;
    for (const f of formy) {
      if (Math.abs(x - f.pos[0]) > f._zasieg || Math.abs(z - f.pos[1]) > f._zasieg) continue;
      s += PROFILE[f.typ](f, odlegloscForma(f, x, z));
    }
    return s;
  };
  /**
   * Strefa niecki/wykopu dla kolorowania terenu: {o, stok, typ} — znormalizowana
   * odległość od brzegu najbliższej formy (< 1 dno, 1..1+stok stok) albo null.
   */
  const niecka = (x, z) => {
    let best = null;
    for (const f of formy) {
      if ((f.typ !== "niecka" && f.typ !== "wykop") || Math.abs(x - f.pos[0]) > f._zasieg || Math.abs(z - f.pos[1]) > f._zasieg) continue;
      const o = odlegloscForma(f, x, z);
      const stok = f.stok ?? 0.9;
      if (o < 1 + stok && (best === null || o < best.o)) best = { o, stok, typ: f.typ };
    }
    return best;
  };
  /** Waga przekopanej ziemi 0..1 (wykopy): 1 w środku, 0 za połową stoku. */
  const ziemia = (x, z) => {
    let w = 0;
    for (const f of formy) {
      if (f.typ !== "wykop" || Math.abs(x - f.pos[0]) > f._zasieg || Math.abs(z - f.pos[1]) > f._zasieg) continue;
      const o = odlegloscForma(f, x, z);
      const kraniec = 1 + (f.stok ?? 0.8) * 0.55;
      w = Math.max(w, 1 - gladko((o - 0.75) / (kraniec - 0.75)));
    }
    return w;
  };
  return { h, niecka, ziemia, formy, pusta: formy.length === 0 };
}
