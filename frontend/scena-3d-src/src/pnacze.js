/**
 * pnacze.js — proceduralna Magiczna Fasola jako SPLOT KILKU PNĄCZY.
 *
 * Zasada naczelna: roślina NIE jest jednym pniem, który rośnie w górę.
 * To 4–5 OSOBNYCH pnączy (każde ma własny splajn), które pojawiają się
 * kolejno i oplatają wspólną oś:
 *
 *   ziarno → 1 pnącze → 2 pnącza → 3 → 4–5 splecionych → jedno się
 *   spłaszcza i staje się szeroką, grywalną ścieżką w górę
 *
 * Widok z góry w kolejnych etapach: 1 → 2 → 3 → 4–5 okręgów na pierścieniu,
 * którego promień lekko rośnie wraz z dojrzewaniem rośliny.
 *
 * KAŻDE PNĄCZE (`this.pnacza[i]`) ma:
 *   t0        — na jakiej wysokości wyrasta (0 = od ziemi)
 *   startU    — przy jakim stopniu wzrostu całej rośliny się pojawia
 *   faza      — przesunięcie kątowe (żeby pnącza się nie nakładały)
 *   obroty    — ile razy obiega oś do szczytu
 *   g         — mnożnik grubości
 *   zwezenie  — zbieżność ku górze
 *   szum      — amplituda bardzo niskoczęstotliwościowego szumu
 *   sciezkowa — czy to TO pnącze, które spłaszcza się w ścieżkę
 *
 * Splajn (pojęciowo):
 *   x = osX(t) + cos(t·2π·obroty + faza) · promienSplotu(t) + szum
 *   z = osZ(t) + sin(…)                  · promienSplotu(t) + szum
 *   y = t · H
 *
 * ŚCIEŻKA (etap 4). Nie ma osobnego, doklejonego mostu: jedno z pnączy
 * płynnie zmienia przekrój z koła w szeroką wstęgę (`_przekroj`), odchyla
 * się na zewnątrz splotu i zagęszcza obroty (żeby nachylenie dało się
 * przejść). Front spłaszczenia wędruje od dołu do góry wraz ze wzrostem.
 * Wspinaczka lisa (`sciezka(u)`) idzie po GÓRNEJ POWIERZCHNI tej wstęgi,
 * a nie po abstrakcyjnej spirali obok łodygi.
 *
 * KOSZT. Wierzchołki liczone są tylko przy zmianie „kroku dojrzałości"
 * (`PNACZE.krokiDojrzalosci` razy przez całe rośnięcie), nie co klatkę;
 * bufory są alokowane raz i nadpisywane w miejscu. Płynny wzrost między
 * krokami to `setDrawRange` na gotowej rurze. Liście, kwiaty i wąsy to
 * InstancedMesh (kilka rysunków na całą roślinę, nie kilkaset).
 *
 * Rysunków na całą, dojrzałą roślinę: 5 rur + 5 czubków + 3 liście
 * + 1 kwiaty + 1 wąsy ≈ 15.
 */
import {
  Group, Mesh, InstancedMesh, MeshLambertMaterial, BufferGeometry,
  Float32BufferAttribute, Vector3, Matrix4, Quaternion, Shape, ShapeGeometry,
  DoubleSide, SphereGeometry, TorusGeometry, Color,
} from "three";

export const PNACZE = {
  barwaGlowna: 0x6cae48,
  barwaGlownaCiemna: 0x4e8a36,
  barwaPed: 0x86cc55,
  barwaPedCiemny: 0x54973a,
  barwaSciezka: 0x9ad45f,
  barwaSciezkaCiemna: 0x63a03a,
  barwaLisc: 0x8fd05a,
  barwaLiscCiemny: 0x6fb648,
  barwaKwiat: 0xfff6dc,
  barwaSrodek: 0xf6d76b,
  /** Gładkie normalne rur — tanio ukrywają 7–8 segmentów obwodu. */
  gladkie: true,
  /** Ile razy przez całe rośnięcie przeliczamy kształt (reszta to drawRange). */
  krokiDojrzalosci: 14,
  /** Od jakiego stopnia wzrostu jedno pnącze zaczyna się spłaszczać w ścieżkę. */
  uSciezki: 0.55,
  /**
   * Skok ścieżki: pionowy odstęp między zwojami, liczony w szerokościach wstęgi.
   * Za mało — zwoje zasłaniają splot i roślina wygląda jak wiertło; za dużo —
   * podejście robi się strome. 2,3 to kompromis (nachylenie ~18°).
   */
  skokSciezki: 3.0,
};

/**
 * Szablon pnączy — kolejność = kolejność pojawiania się.
 * `start` to stopień wzrostu całej rośliny, przy którym pnącze rusza;
 * progi dobrane pod etapy z mapy (u ≈ 0 / 0,11 / 0,27 / 0,56 / 1).
 */
const SZABLON = [
  { g: 1.00, t0: 0.00, start: 0.00, om: 1.00, zwezenie: 0.42 },
  { g: 0.94, t0: 0.00, start: 0.16, om: 1.00, zwezenie: 0.38, sciezkowa: true },
  { g: 0.88, t0: 0.04, start: 0.30, om: 1.09, zwezenie: 0.44 },
  { g: 0.82, t0: 0.11, start: 0.45, om: 0.91, zwezenie: 0.44 },
  { g: 0.60, t0: 0.20, start: 0.62, om: 1.18, zwezenie: 0.52 },
];

const _v = new Vector3(), _w = new Vector3(), _o = new Vector3();
const _up = new Vector3(0, 1, 0), _m = new Matrix4(), _q = new Quaternion();
const _T = new Vector3(), _N = new Vector3(), _B = new Vector3(), _osY = new Vector3(0, 1, 0);
const _a = new Vector3(), _b = new Vector3(), _c = new Vector3();

const mat = (kolor, extra = {}) => new MeshLambertMaterial({ color: kolor, flatShading: true, ...extra });
const zakres = (x, a = 0, b = 1) => (x < a ? a : x > b ? b : x);
const wygladz = (x) => x * x * (3 - 2 * x);

/** Pseudolosowość deterministyczna (ta sama roślina po każdym wczytaniu). */
function los(ziarno) {
  let s = (ziarno * 9301 + 49297) % 233280;
  return () => (s = (s * 9301 + 49297) % 233280) / 233280;
}

/* ── biblioteka liści ─────────────────────────────────────────────────────── */

/**
 * Liść w płaszczyźnie XY: nasada w (0,0), czubek w (0,1). `szer` — jak szeroki,
 * `brzuch` — gdzie wypada najszersze miejsce, `falb` — wygięcie wzdłuż nerwu.
 */
function geoLiscia(szer, brzuch, falb) {
  const sh = new Shape();
  sh.moveTo(0, 0);
  sh.bezierCurveTo(-szer, brzuch * 0.15, -szer * 1.05, brzuch, 0, 1);
  sh.bezierCurveTo(szer * 1.05, brzuch, szer, brzuch * 0.15, 0, 0);
  const g = new ShapeGeometry(sh, 5);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i);
    p.setZ(i, -Math.abs(x) * falb + Math.sin(y * Math.PI) * 0.09);
  }
  g.computeVertexNormals();
  return g;
}

/** 3 warianty liścia — instancjonowane, po jednym rysunku na wariant. */
function bibliotekaLisci() {
  return [
    geoLiscia(0.58, 0.62, 0.26),   // sercowaty, szeroki
    geoLiscia(0.34, 0.55, 0.34),   // lancetowaty
    geoLiscia(0.70, 0.78, 0.18),   // okrągły, płaski
  ];
}

/** Kwiatek: 5 płatków + środek, JEDNA siatka (do instancjonowania). */
function geoKwiatka() {
  const pos = [], col = [], idx = [];
  const platek = new Color(PNACZE.barwaKwiat), srodek = new Color(PNACZE.barwaSrodek);
  const dodaj = (x, y, z, k) => { pos.push(x, y, z); col.push(k.r, k.g, k.b); return pos.length / 3 - 1; };
  const s0 = dodaj(0, 0.02, 0, srodek);
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2, a2 = a + 1.1;
    const r1 = 0.06, r2 = 0.19;
    const p1 = dodaj(Math.cos(a) * r1, 0, Math.sin(a) * r1, srodek);
    const p2 = dodaj(Math.cos((a + a2) / 2) * r2, 0.035, Math.sin((a + a2) / 2) * r2, platek);
    const p3 = dodaj(Math.cos(a2) * r1, 0, Math.sin(a2) * r1, srodek);
    idx.push(s0, p1, p3, p1, p2, p3);
  }
  const g = new BufferGeometry();
  g.setAttribute("position", new Float32BufferAttribute(pos, 3));
  g.setAttribute("color", new Float32BufferAttribute(col, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

export class Pnacze {
  /**
   * @param {object} o
   * @param {number} o.H          docelowa wysokość (jednostki mapy)
   * @param {number} [o.obroty]   ile razy splot obiega oś do szczytu
   * @param {number} [o.pnacza]   ile pnączy tworzy splot (2–5)
   * @param {number} [o.pedy]     zgodność wstecz: liczba pnączy poza głównym
   * @param {number} [o.grubosc]  promień CAŁEGO splotu u podstawy
   * @param {number} [o.szerokoscSciezki] szerokość grywalnej wstęgi
   * @param {number} [o.ziarno]   wariant (rozkład liści, drobne odchyłki)
   */
  constructor(o) {
    this.H = o.H;
    this.obroty = o.obroty ?? 2.6;
    const ile = o.pnacza ?? (o.pedy != null ? o.pedy + 1 : this.H > 6 ? 5 : 4);
    this.ile = Math.max(2, Math.min(SZABLON.length, Math.round(ile)));
    this.grubosc = o.grubosc ?? 0.18 + 0.10 * this.H;
    this.szerokoscSciezki = o.szerokoscSciezki ?? Math.max(0.7, 0.10 * this.H);
    this.u = 0;
    this.krok = -1;
    this.ozdobyWidoczne = true;

    const r = los(o.ziarno ?? 1);
    this.faza = [r() * 6.28, r() * 6.28, r() * 6.28];

    // promień pojedynczego pnącza tak dobrany, by `ile` pnączy na pierścieniu
    // stykało się bokami — splot jest pełny, ale z widocznymi bruzdami
    this.rBaza = this.grubosc / (1 + 0.36 * this.ile);
    this.rSplotu = 0.36 * this.ile * this.rBaza;

    // ile razy ścieżka obiega splot: tyle, żeby zwoje nie zasłaniały pnączy
    // (odstęp = `skokSciezki` × szerokość wstęgi), ale nie mniej niż splot
    const zwojow = this.H / Math.max(1.3, this.szerokoscSciezki * PNACZE.skokSciezki);
    this.obrotySciezki = Math.max(this.obroty * 0.85, zwojow);
    this.dodatkoweObroty = Math.max(0, this.obrotySciezki - this.obroty);
    // tablica skrętu: całka tempa nawijania; skala tak dobrana, by przy pełnym
    // spłaszczeniu wyszło dokładnie `dodatkoweObroty` zwojów mimo zmiennego tempa
    this.tabN = 192;
    this.tab = new Float32Array(this.tabN + 1);
    let pelna = 0;
    for (let j = 1; j <= this.tabN; j++) pelna += this._tempo((j - 0.5) / this.tabN) / this.tabN;
    this.skalaSkretu = this.dodatkoweObroty / Math.max(1e-6, pelna);

    this.group = new Group();
    this.group.name = "pnacze";

    this.matRura = mat(0xffffff, { vertexColors: true, flatShading: !PNACZE.gladkie });
    this.matLisc = mat(0xffffff, { side: DoubleSide });
    this.matKwiat = mat(0xffffff, { vertexColors: true, side: DoubleSide });

    this.pnacza = [];
    for (let i = 0; i < this.ile; i++) this._pnacze(i, r);
    this.sciezkowe = this.pnacza.find((p) => p.sciezkowa) || this.pnacza[0];

    this._ozdoby(r);
    this._przelicz(0);
    this.ustawWzrost(0);
  }

  /* ── splajny ────────────────────────────────────────────────────────────── */

  /** Wspólna oś splotu: pion z powolnym wychyleniem (roślina rośnie ku światłu). */
  os(t, cel = new Vector3()) {
    const w = 0.075 * this.H;
    const n = wygladz(zakres(t / 0.12));   // przy ziemi pień stoi prosto
    return cel.set(
      w * (Math.sin(t * 2.3 + this.faza[0]) + 0.45 * Math.sin(t * 5.3 + this.faza[2])) * n * t,
      t * this.H,
      w * (Math.cos(t * 1.9 + this.faza[1]) + 0.45 * Math.cos(t * 4.1 + this.faza[2])) * n * t,
    );
  }

  /** Promień pierścienia splotu na wysokości `t` (rośnie z dojrzałością). */
  promienSplotu(t) {
    return this.rSplotu * (1 - 0.34 * t) * (1 + 0.17 * Math.sin(t * 4.3 + this.faza[1]))
      * (0.62 + 0.38 * this.dojrzalosc);
  }

  /** Grubość pojedynczego pnącza. */
  promienPnacza(p, t) {
    const lok = zakres((t - p.t0) / Math.max(0.001, 1 - p.t0));
    // cieńsze tuż przy nasadzie — pęd wychodzi z innej łodygi, nie z powietrza
    const nasada = 0.45 + 0.55 * wygladz(zakres(lok / 0.08));
    const falowanie = 1 + 0.13 * Math.sin(t * 6.1 + p.faza * 3);
    return this.rBaza * p.g * (1 - p.zwezenie * t) * falowanie
      * (0.15 + 0.85 * Math.pow(this.dojrzalosc, 0.8)) * nasada;
  }

  /**
   * Ile pnącze jest spłaszczone w punkcie `t` (0 = okrągłe, 1 = pełna wstęga).
   * Front spłaszczenia wędruje od dołu do góry wraz ze wzrostem rośliny.
   */
  splaszczenie(p, t) {
    if (!p.sciezkowa) return 0;
    return zakres((this.frontSciezki - t) / 0.16);
  }

  /**
   * Tempo nawijania ścieżki na wysokości `t`. Nierówne z dwóch powodów:
   * pnie zwężają się ku górze (przy stałym nachyleniu zwoje muszą się tam
   * zagęszczać) i dlatego, że równe odstępy dają efekt wiertła. Zwoje mają
   * być różnej wysokości — raz szerszy oddech, raz ciaśniejsza pętla.
   */
  _tempo(t) {
    return (0.72 + 0.62 * t) * (1 + 0.34 * Math.sin(t * 6.0 + this.faza[2]))
      * (1 + 0.16 * Math.sin(t * 13.7 + this.faza[0]));
  }

  /**
   * Tablica całki `∫ spłaszczenie(τ)·tempo(τ) dτ` — kąt ścieżki liczy się z niej,
   * więc zwoje nie są równo rozstawione, a raz ułożony dół nie przekręca się,
   * gdy front spłaszczenia idzie wyżej. Liczona przy zmianie kroku dojrzałości.
   */
  _przeliczSkret() {
    const N = this.tabN;
    const p = this.sciezkowe;
    let suma = 0;
    this.tab[0] = 0;
    for (let j = 1; j <= N; j++) {
      const tm = (j - 0.5) / N;
      suma += this.splaszczenie(p, tm) * this._tempo(tm) / N;
      this.tab[j] = suma;
    }
  }

  /** Odczyt z tablicy skrętu (liniowa interpolacja). */
  _skret(t) {
    const x = zakres(t) * this.tabN;
    const i = Math.min(this.tabN - 1, Math.floor(x)), f = x - i;
    return this.tab[i] * (1 - f) + this.tab[i + 1] * f;
  }

  /** Kąt pnącza wokół osi. */
  kat(p, t) {
    let k = p.faza + Math.PI * 2 * this.obroty * p.om * t + 0.13 * Math.sin(t * 5.1 + p.faza);
    if (p.sciezkowa) k += Math.PI * 2 * this.skalaSkretu * this._skret(t);
    return k;
  }

  /** Odległość pnącza od osi: pierścień splotu + falowanie (przeplot) + odchył ścieżki. */
  promienOd(p, t) {
    const R = this.promienSplotu(t);
    // falowanie w innej fazie dla każdego pnącza — pnącza nurkują pod siebie
    let r = R * p.skalaR * (1 + 0.26 * Math.sin(t * Math.PI * 2 * this.obroty * 0.8 + p.faza * 2));
    if (p.sciezkowa) {
      const s = this.splaszczenie(p, t);
      r += s * (this.szerokoscSciezki * 0.34 + R * 0.35);
    }
    return r;
  }

  /** Punkt na splajnie pnącza. */
  punkt(p, t, cel = new Vector3()) {
    const a = this.kat(p, t), r = this.promienOd(p, t);
    this.os(t, cel);
    const sz = p.szum;
    cel.x += Math.cos(a) * r + sz * Math.sin(t * 3.1 + p.faza * 1.7);
    cel.z += Math.sin(a) * r + sz * Math.cos(t * 2.6 + p.faza * 2.4);
    return cel;
  }

  /** Styczna do splajnu pnącza. */
  styczna(p, t, cel = new Vector3()) {
    const e = 0.0035;
    this.punkt(p, Math.max(p.t0, t - e), _a);
    this.punkt(p, Math.min(1, t + e), _b);
    return cel.subVectors(_b, _a).normalize();
  }

  /**
   * Ramka przekroju w punkcie `t`: N — na zewnątrz od osi (poziomo),
   * B — „w górę" prostopadle do stycznej (to po B leży powierzchnia chodzenia).
   */
  ramka(p, t, N = _N, B = _B, T = _T) {
    this.punkt(p, t, _c);
    this.os(t, _o);
    this.styczna(p, t, T);
    N.set(_c.x - _o.x, 0, _c.z - _o.z);
    if (N.lengthSq() < 1e-8) N.set(1, 0, 0);
    N.addScaledVector(T, -N.dot(T)).normalize();
    B.crossVectors(T, N).normalize();
    if (B.y < 0) { B.negate(); N.negate(); }
    return _c;
  }

  /** Półosie przekroju: `w` wzdłuż N (szerokość), `h` wzdłuż B (grubość). */
  _przekroj(p, t) {
    const r = this.promienPnacza(p, t);
    const s = this.splaszczenie(p, t);
    if (s <= 0) return { w: r, h: r };
    return {
      w: r * (1 - s) + this.szerokoscSciezki * 0.5 * s,
      h: Math.max(r * (1 - 0.55 * s), this.szerokoscSciezki * 0.10 * s),
    };
  }

  /* ── rury ───────────────────────────────────────────────────────────────── */

  _pnacze(i, r) {
    const s = SZABLON[i];
    const dl = 1 - s.t0;
    const p = {
      i,
      t0: s.t0,
      startU: s.start,
      om: s.om,
      g: s.g,
      zwezenie: s.zwezenie,
      sciezkowa: !!s.sciezkowa && this.ile >= 2,
      faza: (i / this.ile) * Math.PI * 2 + (r() - 0.5) * 0.5,
      szum: this.rSplotu * 0.18 * (0.6 + r() * 0.8),
      skalaR: 1,
      obwod: i === 0 ? 8 : s.g > 0.7 ? 7 : 6,
    };
    // segmenty wzdłuż krzywej: proporcjonalnie do widocznej długości
    let dlugosc = dl * (this.H + Math.PI * 2 * this.rSplotu * this.obroty);
    if (p.sciezkowa) dlugosc += Math.PI * 2 * (this.rSplotu + this.szerokoscSciezki * 0.5) * this.dodatkoweObroty;
    let N = Math.round(zakres(dlugosc * 7, 28, 170));
    if (p.sciezkowa) { N = Math.round(Math.min(240, dlugosc * 9)); p.obwod = 8; }
    p.N = N;

    const V = (N + 1) * p.obwod;
    const pos = new Float32Array(V * 3), col = new Float32Array(V * 3);
    const idx = [];
    for (let j = 0; j < N; j++) {
      for (let k = 0; k < p.obwod; k++) {
        const a = j * p.obwod + k, b = (j + 1) * p.obwod + k;
        const c = (j + 1) * p.obwod + ((k + 1) % p.obwod), d = j * p.obwod + ((k + 1) % p.obwod);
        idx.push(a, b, d, b, c, d);
      }
    }
    const g = new BufferGeometry();
    g.setAttribute("position", new Float32BufferAttribute(pos, 3));
    g.setAttribute("color", new Float32BufferAttribute(col, 3));
    g.setIndex(idx);
    const m = new Mesh(g, this.matRura);
    m.castShadow = true;
    m.frustumCulled = false;
    p.mesh = m;
    // UWAGA: Float32BufferAttribute KOPIUJE tablicę — trzymamy referencję do kopii,
    // inaczej `_przeliczRure` pisałoby w nieużywany bufor i rury byłyby puste.
    p.pos = g.attributes.position.array;
    p.col = g.attributes.color.array;
    this.group.add(m);

    // czubek: pączek na froncie wzrostu
    this.geoPaczka = this.geoPaczka || new SphereGeometry(1, 6, 5);
    this.matCzubek = this.matCzubek || mat(PNACZE.barwaLisc);
    const cz = new Mesh(this.geoPaczka, this.matCzubek);
    cz.scale.set(0.8, 2.1, 0.8);
    const gr = new Group();
    gr.add(cz);
    gr.castShadow = true;
    p.czubek = gr;
    this.group.add(gr);

    this.pnacza.push(p);
  }

  /** Przelicza wierzchołki wszystkich rur dla bieżącej dojrzałości `u`. */
  _przelicz(u) {
    this.dojrzalosc = u;
    this.frontSciezki = zakres((u - PNACZE.uSciezki) / (1 - PNACZE.uSciezki)) * 1.18;
    for (const p of this.pnacza) {
      // główne pnącze wchodzi w splot dopiero, gdy dołączają następne
      p.skalaR = p.i === 0 ? 0.18 + 0.82 * wygladz(zakres((u - 0.1) / 0.45)) : 1;
    }
    this._przeliczSkret();
    for (const p of this.pnacza) this._przeliczRure(p);
    this._przeliczOzdoby();
  }

  _przeliczRure(p) {
    const { pos, col, N, obwod } = p;
    const jasny = new Color(p.i === 0 ? PNACZE.barwaGlowna : PNACZE.barwaPed);
    const ciemny = new Color(p.i === 0 ? PNACZE.barwaGlownaCiemna : PNACZE.barwaPedCiemny);
    const sJasny = new Color(PNACZE.barwaSciezka), sCiemny = new Color(PNACZE.barwaSciezkaCiemna);
    const skret = p.i === 0 ? 0.14 : 0.3;
    let o = 0;
    for (let j = 0; j <= N; j++) {
      const t = p.t0 + (1 - p.t0) * (j / N);
      const c = this.ramka(p, t, _N, _B, _T);
      const pr = this._przekroj(p, t);
      const s = this.splaszczenie(p, t);
      for (let k = 0; k < obwod; k++) {
        const a = (k / obwod) * Math.PI * 2;
        let cs = Math.cos(a), sn = Math.sin(a);
        if (s > 0.05) {   // superelipsa: im bardziej spłaszczone, tym bardziej „deska"
          const e = 1 - 0.52 * s;
          cs = Math.sign(cs) * Math.pow(Math.abs(cs), e);
          sn = Math.sign(sn) * Math.pow(Math.abs(sn), e);
        }
        pos[o] = c.x + pr.w * cs * _N.x + pr.h * sn * _B.x;
        pos[o + 1] = c.y + pr.w * cs * _N.y + pr.h * sn * _B.y;
        pos[o + 2] = c.z + pr.w * cs * _N.z + pr.h * sn * _B.z;
        let kol;
        if (s > 0.25) kol = sn > 0.25 ? sJasny : sCiemny;           // wierzch wstęgi jaśniejszy
        else kol = ((k + j * skret) % obwod) < obwod / 2 ? jasny : ciemny;
        col[o] = kol.r; col[o + 1] = kol.g; col[o + 2] = kol.b;
        o += 3;
      }
    }
    const g = p.mesh.geometry;
    g.attributes.position.needsUpdate = true;
    g.attributes.color.needsUpdate = true;
    g.computeVertexNormals();
    g.computeBoundingSphere();
  }

  /* ── liście, kwiaty, wąsy (instancjonowane) ─────────────────────────────── */

  _ozdoby(r) {
    this.ozdoby = [];
    const H = this.H;
    const bazaLiscia = 0.38 + 0.09 * H;           // duże, rzadkie liście
    const geoL = bibliotekaLisci();

    // ile czego — świadomie mało, żeby splot był widoczny
    const ileLisci = Math.round(zakres(6 + H * 0.95, 7, 40));
    const ileKwiatow = Math.round(zakres(3 + H * 0.6, 4, 18));
    const ileWasow = Math.round(zakres(3 + H * 0.4, 4, 12));

    const rozkl = [];   // {k, t} — miejsca na pnączach (bez pnącza-ścieżki)
    const nosne = this.pnacza.filter((p) => !p.sciezkowa);
    for (let n = 0; n < ileLisci; n++) {
      const p = nosne[n % nosne.length];
      const u0 = (Math.floor(n / nosne.length) + 0.35 + r() * 0.3) / Math.ceil(ileLisci / nosne.length);
      rozkl.push({ p, t: p.t0 + (1 - p.t0) * zakres(u0, 0.04, 0.97) });
    }

    // KIEŁEK (etap 1): łodyżka z DWOMA liśćmi na czubku, jak liścienie fasoli —
    // naprzeciw siebie, duże względem pędu, lekko uniesione. Później zostają
    // najniższą parą liści rośliny.
    const kielek = (obrot) => ({
      p: this.pnacza[0], t: 0.098, kiel: true,
      s: bazaLiscia * 0.82, obrot, tilt: 0.55, rol: 0,
    });
    rozkl.unshift(kielek(1.57), kielek(-1.57));

    // liście — 3 warianty, każdy własny InstancedMesh (3 rysunki)
    this.liscie = geoL.map((g, i) => {
      const ile = Math.ceil(rozkl.length / geoL.length) + 1;
      const im = new InstancedMesh(g, this.matLisc, ile);
      im.castShadow = true;
      im.frustumCulled = false;
      im.count = 0;
      this.group.add(im);
      return { im, uzyte: 0 };
    });
    const barwy = [new Color(PNACZE.barwaLisc), new Color(PNACZE.barwaLiscCiemny)];
    rozkl.forEach((m, n) => {
      const w = this.liscie[m.kiel ? 0 : n % this.liscie.length];
      const i = w.uzyte++;
      w.im.count = w.uzyte;
      w.im.setColorAt(i, barwy[!m.kiel && r() < 0.42 ? 1 : 0]);
      const t = m.t;
      this.ozdoby.push({
        im: w.im, i, p: m.p, t,
        // strefy z briefu: przy ziemi mniej i mniejszych liści, ku górze drobniejsze
        s: m.s ?? bazaLiscia * (1 - 0.42 * t) * (0.5 + 0.5 * wygladz(zakres(t / 0.16))) * (0.85 + r() * 0.35),
        obrot: m.obrot ?? (n % 2 - 0.5) * 1.7 + (r() - 0.5) * 0.9,
        tilt: m.tilt ?? 0.22 + r() * 0.5,
        rol: m.rol ?? (n % 2 ? 1 : -1) * (0.34 + r() * 0.34),
        wysun: 0,
        poz: new Vector3(), kw: new Quaternion(), pop: -1,
      });
    });
    for (const w of this.liscie) if (w.im.instanceColor) w.im.instanceColor.needsUpdate = true;

    // kwiaty — rzadkie akcenty od połowy wysokości
    const imK = new InstancedMesh(geoKwiatka(), this.matKwiat, ileKwiatow);
    imK.frustumCulled = false;
    imK.count = ileKwiatow;
    this.group.add(imK);
    this.kwiaty = imK;
    for (let n = 0; n < ileKwiatow; n++) {
      const p = nosne[n % nosne.length];
      const t = zakres(0.48 + (n / ileKwiatow) * 0.5 + (r() - 0.5) * 0.06, p.t0 + 0.02, 0.98);
      this.ozdoby.push({
        im: imK, i: n, p, t,
        s: 1.2 + 0.16 * H, obrot: (r() - 0.5) * 2.4, tilt: 0.55 + r() * 0.6, wysun: 0.02,
        poz: new Vector3(), kw: new Quaternion(), pop: -1,
      });
    }

    // wąsy — dekoracyjne skręty, też instancjonowane
    const imW = new InstancedMesh(
      new TorusGeometry(0.12, 0.022, 4, 10, Math.PI * 1.6), mat(PNACZE.barwaPed), ileWasow,
    );
    imW.frustumCulled = false;
    imW.count = ileWasow;
    this.group.add(imW);
    this.wasy = imW;
    for (let n = 0; n < ileWasow; n++) {
      const p = nosne[n % nosne.length];
      const t = zakres(0.12 + (n / ileWasow) * 0.8 + (r() - 0.5) * 0.08, p.t0 + 0.02, 0.97);
      this.ozdoby.push({
        im: imW, i: n, p, t,
        s: (0.8 + 0.16 * H) * (0.7 + r() * 0.6), obrot: (r() - 0.5) * 3, tilt: 0.2 + r() * 0.7, wysun: 0.01,
        poz: new Vector3(), kw: new Quaternion(), pop: -1,
      });
    }
  }

  /** Ozdoby siedzą na pnączach, więc po zmianie kształtu trzeba je przesadzić. */
  _przeliczOzdoby() {
    for (const o of this.ozdoby) {
      const c = this.ramka(o.p, o.t, _N, _B, _T);
      _o.copy(_N).applyAxisAngle(_up, o.obrot);
      // kierunek wyrastania: na zewnątrz od splotu, uniesiony o `tilt`
      const d = _a.copy(_o).multiplyScalar(Math.cos(o.tilt)).addScaledVector(_up, Math.sin(o.tilt)).normalize();
      const x = _b.crossVectors(d, _up);
      if (x.lengthSq() < 1e-6) x.set(1, 0, 0); else x.normalize();
      const z = _v.crossVectors(x, d).normalize();
      _m.makeBasis(x, d, z);
      o.kw.setFromRotationMatrix(_m);
      // obrót wokół własnego ogonka: blaszka nie leży poziomo, więc liść
      // czyta się z boku, a nie jako kreska
      if (o.rol) o.kw.multiply(_q.setFromAxisAngle(_osY, o.rol));
      o.poz.copy(c).addScaledVector(_o, this.promienPnacza(o.p, o.t) * 0.85 + o.wysun);
      o.pop = -1;   // wymuś przepisanie macierzy
    }
  }

  /* ── wzrost ─────────────────────────────────────────────────────────────── */

  /**
   * Ustawia stopień wzrostu całej rośliny (0 = nic, 1 = gigant).
   * Tanie: drawRange + czubki + macierze tych ozdób, które akurat wyskakują.
   * Kształt przeliczany tylko przy zmianie kroku dojrzałości.
   */
  ustawWzrost(u) {
    u = this.u = zakres(u);
    const krok = Math.round(u * PNACZE.krokiDojrzalosci);
    if (krok !== this.krok) { this.krok = krok; this._przelicz(krok / PNACZE.krokiDojrzalosci); }

    for (const p of this.pnacza) {
      const lok = zakres((u - p.startU) / Math.max(0.02, 1 - p.startU));
      // pnącze od ziemi rośnie liniowo — dzięki temu wysokość rośliny to
      // dokładnie `u · H` i etapy z mapy zgadzają się co do metra; boczne
      // pnącza ruszają później i doganiają front (stąd potęga < 1)
      p.front = p.startU > 0 ? Math.pow(lok, 0.72) : lok;
      p.tHead = p.t0 + (1 - p.t0) * p.front;        // dokąd sięga czubek
      const seg = Math.floor(p.front * p.N);
      p.mesh.geometry.setDrawRange(0, seg * p.obwod * 6);
      p.mesh.visible = seg > 0;
      p.czubek.visible = p.front > 0.004 && p.front < 0.999;
      if (p.czubek.visible) {
        const c = this.punkt(p, p.tHead, _v);
        p.czubek.position.copy(c);
        this.styczna(p, p.tHead, _w);
        p.czubek.quaternion.setFromUnitVectors(_up, _w);
        p.czubek.scale.setScalar(Math.max(0.001, this.promienPnacza(p, p.tHead) * 0.88));
      }
    }

    // ozdoby: wyskakują z lekkim przestrzeleniem, gdy mija je front wzrostu
    const dotkniete = new Set();
    for (const o of this.ozdoby) {
      const pp = this.ozdobyWidoczne ? zakres((o.p.tHead - o.t) / 0.05) : 0;
      if (Math.abs(pp - o.pop) < 0.004) continue;
      o.pop = pp;
      const s = pp <= 0 ? 0.0001 : (pp < 0.6 ? (pp / 0.6) * 1.16 : 1.16 - ((pp - 0.6) / 0.4) * 0.16) * o.s;
      _m.compose(o.poz, o.kw, _v.setScalar(Math.max(0.0001, s)));
      o.im.setMatrixAt(o.i, _m);
      dotkniete.add(o.im);
    }
    for (const im of dotkniete) im.instanceMatrix.needsUpdate = true;
  }

  /** Wysokość najwyższego punktu dla bieżącego wzrostu. */
  get wysokosc() { return this.u * this.H; }

  /** Ile pnączy jest już widocznych (test „widok z góry": 1 → 2 → 3 → 4–5"). */
  get widocznePnacza() { return this.pnacza.filter((p) => p.front > 0.01).length; }

  /* ── ścieżka i kolizja ──────────────────────────────────────────────────── */

  /**
   * Punkt dla wspinającego się lisa: GÓRNA POWIERZCHNIA spłaszczonego pnącza.
   * Zwraca {kat, r, h} — kąt wokół osi rośliny, odległość od osi, wysokość.
   */
  sciezka(u, odstep = 0) {
    const p = this.sciezkowe;
    const t = zakres(u, p.t0, 1);
    const c = this.ramka(p, t, _N, _B, _T);
    const pr = this._przekroj(p, t);
    _v.copy(c).addScaledVector(_B, pr.h * 0.92).addScaledVector(_N, odstep);
    return { kat: Math.atan2(_v.z, _v.x), r: Math.hypot(_v.x, _v.z), h: _v.y, os: [0, 0] };
  }

  /**
   * PROSTA reprezentacja kolizji grywalnej ścieżki — osobno od siatki widocznej.
   * Zwraca oś wstęgi (punkty + wektor „w bok" + normalna) i jej szerokość;
   * do zderzeń wystarczy rzut gracza na najbliższy odcinek.
   */
  kolizja(probek = 48) {
    const p = this.sciezkowe;
    const os = [], bok = [], gora = [];
    for (let j = 0; j <= probek; j++) {
      const t = p.t0 + (1 - p.t0) * (j / probek);
      const c = this.ramka(p, t, _N, _B, _T);
      const pr = this._przekroj(p, t);
      os.push(c.x + _B.x * pr.h * 0.92, c.y + _B.y * pr.h * 0.92, c.z + _B.z * pr.h * 0.92);
      bok.push(_N.x, _N.y, _N.z);
      gora.push(_B.x, _B.y, _B.z);
    }
    return { os, bok, gora, szerokosc: this.szerokoscSciezki, probek };
  }

  /** Niska siatka kolizji ścieżki (2 wierzchołki na próbkę) — do fizyki, nie do rysowania. */
  siatkaKolizji(probek = 40) {
    const k = this.kolizja(probek);
    const pos = [], idx = [];
    const pol = k.szerokosc * 0.5;
    for (let j = 0; j <= probek; j++) {
      const o = j * 3;
      pos.push(k.os[o] - k.bok[o] * pol, k.os[o + 1] - k.bok[o + 1] * pol, k.os[o + 2] - k.bok[o + 2] * pol);
      pos.push(k.os[o] + k.bok[o] * pol, k.os[o + 1] + k.bok[o + 1] * pol, k.os[o + 2] + k.bok[o + 2] * pol);
    }
    for (let j = 0; j < probek; j++) {
      const a = j * 2;
      idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
    }
    const g = new BufferGeometry();
    g.setAttribute("position", new Float32BufferAttribute(pos, 3));
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
  }

  /**
   * Przeszkoda centralna: splot jako łańcuch odcinków oś–promień.
   * Liście, kwiaty i pojedyncze pnącza NIE biorą udziału w kolizji.
   */
  przeszkodaSplotu(probek = 10) {
    const w = [];
    for (let j = 0; j <= probek; j++) {
      const t = j / probek;
      this.os(t, _v);
      w.push({ x: _v.x, y: _v.y, z: _v.z, r: this.promienSplotu(t) + this.rBaza * 1.15 });
    }
    return w;
  }

  /* ── narzędzia ──────────────────────────────────────────────────────────── */

  /** Test wizualny z briefu: bez liści i kwiatów splot musi nadal czytać się jako splot. */
  pokazOzdoby(widoczne) {
    this.ozdobyWidoczne = !!widoczne;
    for (const o of this.ozdoby) o.pop = -1;
    this.ustawWzrost(this.u);
  }

  stan() {
    return {
      u: +this.u.toFixed(3),
      pnaczy: this.pnacza.length,
      widoczne: this.widocznePnacza,
      splaszczenie: +zakres(this.frontSciezki).toFixed(3),
      krok: this.krok,
      rysunkow: this.group.children.filter((c) => c.visible).length,
      trojkatow: this.pnacza.reduce((n, p) => n + p.N * p.obwod * 2, 0),
    };
  }

  zniszcz() {
    this.group.traverse((o) => { if (o.geometry) o.geometry.dispose(); });
    for (const m of [this.matRura, this.matLisc, this.matKwiat, this.matCzubek]) m.dispose();
  }
}
