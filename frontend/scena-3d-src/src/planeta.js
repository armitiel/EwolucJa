/**
 * planeta.js — matematyka kuli.
 *
 * ZASADA. Cała logika gry (ruch bohatera, kolizje, ścieżka, rzeka, znaki,
 * edytor) dalej liczy się na PŁASKIEJ mapie w układzie (x, z) z `mapa.json`.
 * Kula to warstwa PREZENTACJI: każdy punkt mapy ma swoje miejsce na sferze
 * i swoją ramkę (co jest „górą", co „przodem"). Dzięki temu dane mapy, edytor
 * i cała fizyka z płaskiej wersji sceny zostały nietknięte, a planeta obraca
 * się pod liskiem.
 *
 * RZUT. Azymutalny równoodległościowy ze środka mapy: punkt w odległości `r`
 * od środka mapy ląduje w odległości kątowej `r / R` od bieguna kuli, w tym
 * samym azymucie. Odległości OD ŚRODKA są zachowane; odległości styczne
 * kurczą się z mnożnikiem sin(a)/a — przy 90° to 0,64, przy 140° to 0,37.
 * Dla „tiny planet" to akceptowalne: skraj mapy jest tłem widocznym zza
 * horyzontu, nie miejscem precyzyjnego chodzenia.
 *
 * UKŁAD LOKALNY PLANETY: biegun mapy (x=0, z=0) to +Y. Mapa +x biegnie po
 * południku w stronę +X, mapa +z w stronę +Z. Na biegunie ramka kuli pokrywa
 * się dokładnie z ramką płaskiej mapy, więc kod, który kiedyś ustawiał
 * `position.set(x, y, z)`, teraz woła `ustawNaKuli(obiekt, x, z, y)`.
 */
import { Vector3, Quaternion, Matrix4 } from "three";

const _m = new Matrix4();
const _ex = new Vector3();
const _n = new Vector3();
const _ez = new Vector3();

export class Planeta {
  /** @param {number} promien promień kuli w jednostkach mapy */
  constructor(promien = 9) {
    this.R = promien;
  }

  /**
   * Punkt mapy → wektor lokalny planety (na wysokości `h` nad powierzchnią).
   */
  naKule(x, z, h = 0, cel = new Vector3()) {
    const r = Math.hypot(x, z);
    const R = this.R;
    if (r < 1e-9) return cel.set(0, R + h, 0);
    const a = r / R;
    const cf = x / r;
    const sf = z / r;
    const sa = Math.sin(a);
    const ca = Math.cos(a);
    return cel.set(sa * cf, ca, sa * sf).multiplyScalar(R + h);
  }

  /** Normalna powierzchni (kierunek „w górę") w punkcie mapy. */
  normalna(x, z, cel = new Vector3()) {
    return this.naKule(x, z, 0, cel).normalize();
  }

  /**
   * Ortonormalna ramka w punkcie mapy: kolumny (e_x, n, e_z).
   * `e_x` to mapowe +x, `e_z` mapowe +z, `n` góra. Na biegunie jest to
   * identyczność. Ramka jest przenoszona równolegle wzdłuż południka, więc
   * kierunek „mapowa północ" zostaje ciągły na całej kuli poza antypodem.
   */
  ramka(x, z, cel = new Quaternion()) {
    const r = Math.hypot(x, z);
    if (r < 1e-9) return cel.identity();
    const a = r / this.R;
    const cf = x / r;
    const sf = z / r;
    const sa = Math.sin(a);
    const ca = Math.cos(a);
    // T_r — styczna wzdłuż rosnącego r, T_f — wzdłuż rosnącego azymutu.
    const trx = ca * cf, tryy = -sa, trz = ca * sf;
    const tfx = -sf, tfz = cf;
    _ex.set(cf * trx - sf * tfx, cf * tryy, cf * trz - sf * tfz);
    _ez.set(sf * trx + cf * tfx, sf * tryy, sf * trz + cf * tfz);
    _n.set(sa * cf, ca, sa * sf);
    _m.makeBasis(_ex, _n, _ez);
    return cel.setFromRotationMatrix(_m);
  }

  /**
   * Wektor lokalny planety → punkt mapy. Odwrotność `naKule`.
   * Zwraca {x, z, h} — `h` to wysokość nad powierzchnią.
   */
  zKuli(v, cel = { x: 0, z: 0, h: 0 }) {
    const len = v.length();
    if (len < 1e-9) return (cel.x = 0), (cel.z = 0), (cel.h = -this.R), cel;
    const ny = Math.max(-1, Math.min(1, v.y / len));
    const a = Math.acos(ny);
    const f = Math.atan2(v.z, v.x);
    const r = a * this.R;
    cel.x = r * Math.cos(f);
    cel.z = r * Math.sin(f);
    cel.h = len - this.R;
    return cel;
  }

  /**
   * Stawia obiekt three.js na kuli: pozycja z `naKule`, orientacja z `ramki`
   * plus własny obrót wokół pionu (`obrotY`, radiany — dawne `rotation.y`).
   */
  ustaw(obj, x, z, h = 0, obrotY = 0) {
    this.naKule(x, z, h, obj.position);
    this.ramka(x, z, obj.quaternion);
    if (obrotY) obj.quaternion.multiply(_q.setFromAxisAngle(_Y, obrotY));
    return obj;
  }

  /**
   * Kwaternion, jakim trzeba obrócić PLANETĘ, żeby punkt mapy (x, z) znalazł
   * się na górze (+Y świata), a jego ramka pokryła się z osiami świata.
   */
  obrotPodPunkt(x, z, cel = new Quaternion()) {
    return this.ramka(x, z, cel).invert();
  }
}

const _q = new Quaternion();
const _Y = new Vector3(0, 1, 0);
const _os = new Vector3();
const _t = new Vector3();

/* ── RUCH PO SFERZE (bohater) ───────────────────────────────────────────────
 * Bohater NIE żyje na płaskiej mapie: jego stan to normalna `n` (punkt na
 * kuli, wektor jednostkowy) i styczna `f` (przód). Dzięki temu da się obejść
 * planetę dookoła — przez antypod, gdzie płaskie rozwinięcie mapy się zwija.
 * Współrzędne mapy (x, z) liczy się z `n` tylko wtedy, gdy są potrzebne
 * (znaki, ścieżka, most, API), przez `zKuli`.
 */

/** Styczna w punkcie `n` skierowana do punktu `cel` (oba jednostkowe). Gdy
 *  `cel` leży na osi `n` (ten sam punkt albo antypod), zwraca `zapas`. */
export function stycznaDo(n, cel, zapas, wynik = new Vector3()) {
  wynik.copy(cel).addScaledVector(n, -cel.dot(n));
  const L = wynik.length();
  return L > 1e-6 ? wynik.divideScalar(L) : wynik.copy(zapas);
}

/** Rzutuje `f` na płaszczyznę styczną w `n` i normalizuje (transport równoległy po kroku). */
export function doStycznej(f, n) {
  f.addScaledVector(n, -f.dot(n));
  const L = f.length();
  if (L > 1e-6) f.divideScalar(L);
  else f.set(1, 0, 0).addScaledVector(n, -n.x).normalize();
  return f;
}

/** Obraca styczną `f` wokół normalnej `n` o kąt (radiany), w miejscu. */
export function obrocStyczna(f, n, kat) {
  _q.setFromAxisAngle(n, kat);
  return f.applyQuaternion(_q);
}

/** Kąt (ze znakiem) od stycznej `a` do stycznej `b` wokół normalnej `n`. */
export function katMiedzy(a, b, n) {
  _os.crossVectors(a, b);
  return Math.atan2(_os.dot(n), a.dot(b));
}

/** Kwaternion orientacji obiektu stojącego w `n` przodem do `f` (+Y = n, +Z = f). */
export function orientacja(n, f, cel = new Quaternion()) {
  _t.crossVectors(n, f); // +X = n × f, żeby X × Y = Z (układ prawoskrętny)
  _m.makeBasis(_t, n, f);
  return cel.setFromRotationMatrix(_m);
}

/** Minimalny obrót, który przenosi wektor `od` na wektor `do` (oba jednostkowe). */
export function obrotOdDo(od, do_, cel = new Quaternion()) {
  return cel.setFromUnitVectors(od, do_);
}

Planeta.prototype.przesunPoKuli = function (n, f, dystans) {
  // krok po wielkim kole: obrót wokół osi (n × f) o kąt dystans / R
  if (Math.abs(dystans) < 1e-9) return;
  _os.crossVectors(n, f).normalize();
  _q.setFromAxisAngle(_os, dystans / this.R);
  n.applyQuaternion(_q).normalize();
  f.applyQuaternion(_q);
  doStycznej(f, n);
};

/** Punkt na kuli przesunięty z `n` w stronę stycznej `f` o `dystans` (nowy wektor). */
Planeta.prototype.punktObok = function (n, f, dystans, cel = new Vector3()) {
  cel.copy(n);
  const ff = _t.copy(f);
  this.przesunPoKuli(cel, ff, dystans);
  return cel;
};

/** Odległość po powierzchni między dwiema normalnymi. */
Planeta.prototype.odleglosc = function (a, b) {
  return this.R * Math.acos(Math.max(-1, Math.min(1, a.dot(b))));
};

/** Stawia obiekt w normalnej `n`, przodem do `f`, `h` nad powierzchnią. */
Planeta.prototype.ustawN = function (obj, n, f, h = 0) {
  obj.position.copy(n).multiplyScalar(this.R + h);
  orientacja(n, f, obj.quaternion);
  return obj;
};

/**
 * Domyślny promień: taki, żeby główna część mapy (promień `promienMapy`)
 * zajmowała ok. 100° od bieguna — widoczna krzywizna, ale rzut jeszcze nie
 * zniekształca przesadnie tam, gdzie się chodzi.
 */
export function domyslnyPromienKuli(promienMapy = 14) {
  return promienMapy / (100 * Math.PI / 180);
}

/**
 * Tnie łamaną (punkty z .x/.y lub .x/.z — podaj `wez`) na kawałki leżące
 * bliżej środka mapy niż `rmax`. Zwraca tablicę kawałków (każdy ≥ 2 punkty).
 */
export function przytnijDoPromienia(punkty, rmax, wez = (p) => [p.x, p.y]) {
  const kawalki = [];
  let biezacy = [];
  for (const p of punkty) {
    const [x, z] = wez(p);
    if (Math.hypot(x, z) <= rmax) biezacy.push(p);
    else if (biezacy.length) {
      if (biezacy.length >= 2) kawalki.push(biezacy);
      biezacy = [];
    }
  }
  if (biezacy.length >= 2) kawalki.push(biezacy);
  return kawalki;
}
