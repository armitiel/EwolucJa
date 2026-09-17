/*!
 * SPDX-FileCopyrightText: © 2026 Amitiel Angelisme <armitiel@gmail.com>
 * SPDX-License-Identifier: LicenseRef-EwolucJA-Proprietary
 *
 * EwolucJA — gra edukacyjna dla dzieci.
 * Produkt powstał w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”;
 * autorskie prawa majątkowe pozostają przy autorze. Licencja: LICENSE.
 */
/**
 * wstega.js — wstęgi geodezyjne: ścieżki, rzeki, płoty, ślady, wszystko
 * liniowe, co ma mieć STAŁĄ SZEROKOŚĆ niezależnie od miejsca na planecie.
 *
 * PO CO TO ISTNIEJE. Teren jest jedną teksturą rozpiętą na płaskiej mapie
 * i owiniętą na kulę rzutem azymutalnym równoodległościowym. Ten rzut
 * ściska wymiary STYCZNE mnożnikiem `k = sin(a)/a` (a = r/R), więc kreska
 * o stałej szerokości w pikselach ma na kuli szerokość zależną od tego,
 * gdzie leży i w którą stronę biegnie. `swiat.js` kompensuje to w płótnie
 * (`poszerzenieNaKuli`), ale kompensacja ma sufit: przy 130° trzeba
 * poszerzać ×3, przy 160° ×8, a przy antypodzie ×∞. Do tego cała kula
 * rzutuje się na dysk o promieniu πR ≈ 25 jednostek, a płótno ma
 * półszerokość `teren/2` = 20 — ostatnie ~37° wokół antypodu fizycznie
 * nie mieści się na teksturze.
 *
 * JAK TO ROBIMY ZAMIAST. Wstęga powstaje OD RAZU na sferze. Dla każdego
 * punktu osi liczymy normalną `n`, styczną biegu `t` i poprzeczną
 * `p = n × t`, a brzegi odsuwamy o stałą odległość PO POWIERZCHNI
 * (`przesunPoKuli` = obrót po wielkim kole o kąt HW/R). Szerokość jest
 * wtedy stała z definicji — rzut w ogóle nie bierze udziału. UV biegnie
 * wzdłuż ŁUKU, więc tekstura wstęgi też się nie rozjeżdża.
 *
 * Pierwowzorem jest `wstegaNurtu` w `swiat.js` — nurt rzeki był jedyną
 * rzeczą liniową zrobioną poprawnie. Ten moduł uogólnia tamten pomysł
 * i dokłada to, czego tamtemu brakowało: przepróbkowanie po łuku, mitrę
 * na zakrętach, zaokrąglone końce i normalne do oświetlenia.
 *
 * DANE ZOSTAJĄ PŁASKIE. Wejściem są punkty w układzie (x, z) mapy, czyli
 * dokładnie to, co trzyma `mapa.json` i co rysuje edytor. Zmienia się
 * tylko miejsce, w którym powstaje geometria.
 */
import { BufferGeometry, Float32BufferAttribute, Vector3 } from "three";
import { doStycznej, stycznaDo } from "./planeta.js";

const _a = new Vector3();
const _b = new Vector3();
const _f = new Vector3();
const _g = new Vector3();
const _t = new Vector3();
const _p = new Vector3();
const _v = new Vector3();
const _os = new Vector3();

/** Odczyt pary współrzędnych z punktu w dowolnym z formatów, jakie chodzą po mapie. */
export function wspolrzedne(p) {
  if (Array.isArray(p)) return [p[0], p[1]];
  // Vector3 na mapie to (x, _, z) — os pionowa jest nieuzywana.
  // Vector2 (rzeka, probkowane krzywe) trzyma (x, y).
  if (p.isVector3) return [p.x, p.z];
  return [p.x, p.y];
}

/**
 * Punkty mapy → normalne na kuli. Punkty powtórzone wypadają, bo zerowy
 * odcinek nie ma kierunku i psułby ramkę.
 */
export function naNormalne(punkty, planeta, wez = wspolrzedne) {
  const out = [];
  for (const p of punkty) {
    const [x, z] = wez(p);
    const n = planeta.normalna(x, z, new Vector3());
    if (out.length && out[out.length - 1].dot(n) > 1 - 1e-12) continue;
    out.push(n);
  }
  return out;
}

/**
 * Przepróbkowanie łamanej na kuli STAŁYM krokiem po łuku (slerp między
 * kolejnymi normalnymi).
 *
 * Dlaczego to jest konieczne, a nie kosmetyczne: wstęga rozpina cięciwy,
 * a cięciwa odcinka o długości `s` odstaje od kuli o ~`s²/(8R)`. Przy
 * kroku 0,5 i R=8 to 0,004 (niewidoczne), przy kroku 2 już 0,06 — wstęga
 * wchodzi pod teren i znika plamami. Równy krok daje przy okazji równe UV
 * i na tyle małe zakręty na odcinek, że mitra nigdy nie musi ratować
 * sytuacji siłowo.
 */
export function przeprobkuj(normalne, planeta, krok = 0.12) {
  if (normalne.length < 2) return normalne.slice();
  const R = planeta.R;
  const out = [normalne[0].clone()];
  let reszta = krok;
  for (let i = 0; i < normalne.length - 1; i++) {
    const a = normalne[i];
    const b = normalne[i + 1];
    const om = Math.acos(Math.max(-1, Math.min(1, a.dot(b))));
    const dlug = om * R;
    if (dlug < 1e-9) continue;
    const so = Math.sin(om);
    let s = reszta;
    while (s <= dlug) {
      const u = s / dlug;
      // slerp — punkt na wielkim kole, nie na cięciwie
      const w1 = so > 1e-9 ? Math.sin((1 - u) * om) / so : 1 - u;
      const w2 = so > 1e-9 ? Math.sin(u * om) / so : u;
      out.push(_a.copy(a).multiplyScalar(w1).addScaledVector(b, w2).normalize().clone());
      s += krok;
    }
    reszta = s - dlug;
  }
  const ost = normalne[normalne.length - 1];
  if (out[out.length - 1].dot(ost) < 1 - 1e-9) out.push(ost.clone());
  return out;
}

/**
 * Styczna biegu w próbce `i` — uśredniona z odcinka wchodzącego
 * i wychodzącego, żeby na wierzchołku wstęga nie łamała się w pół.
 * Zwraca też `mitra`: o ile trzeba przesunąć brzeg, żeby krawędzie
 * sąsiednich odcinków się spotkały (1/cos połowy zakrętu).
 */
function ramkaOsi(os, i, planeta, mitraMax) {
  const n = os[i];
  const jest_przed = i > 0;
  const jest_za = i < os.length - 1;
  // kierunek wyjścia i kierunek wejścia, oba jako styczne w `n`
  if (jest_za) stycznaDo(n, os[i + 1], _f.set(1, 0, 0), _f);
  if (jest_przed) stycznaDo(n, os[i - 1], _g.set(1, 0, 0), _g).negate();
  if (!jest_za) _f.copy(_g);
  if (!jest_przed) _g.copy(_f);
  _t.copy(_f).add(_g);
  if (_t.lengthSq() < 1e-10) _t.copy(_f); // zawrót o 180° — nie ma dobrej odpowiedzi
  doStycznej(_t, n);
  const cos = Math.max(_t.dot(_f), 1 / mitraMax);
  return { t: _t, mitra: 1 / cos };
}

/**
 * Wstęga o stałej szerokości wzdłuż łamanej podanej w układzie mapy.
 *
 * @param {Array} punkty oś wstęgi — punkty (x, z) mapy
 * @param {Planeta} planeta
 * @param {object} opcje
 *   polSzerokosc — połowa szerokości w jednostkach mapy, mierzona PO KULI
 *   wysokosc     — uniesienie nad powierzchnię (teren o 192×128 segmentach
 *                  zapada się względem idealnej kuli o ~0,0011, więc niżej
 *                  niż 0,003 wstęga zaczyna migotać)
 *   krok         — gęstość przepróbkowania po łuku
 *   skalaUV      — ile powtórzeń tekstury na jednostkę długości
 *   mitraMax     — sufit wydłużenia brzegu na ostrym zakręcie
 *   kapsle       — zaokrąglone końce (bez nich wstęga kończy się ścięciem)
 * @returns {{geometry: BufferGeometry, os: Vector3[], dlugosc: number}}
 */
export function wstegaPoKuli(punkty, planeta, opcje = {}) {
  const {
    polSzerokosc = 0.5,
    wysokosc = 0.01,
    krok = 0.12,
    skalaUV = 1,
    mitraMax = 2.5,
    kapsle = true,
    juzNormalne = false,
    wez = wspolrzedne,
  } = opcje;

  // `juzNormalne` — wejsciem sa gotowe wektory jednostkowe na kuli (np. po
  // `potnijNaKuli`). Zgadywanie po dlugosci wektora byloby pulapka: punkt
  // mapy w odleglosci dokladnie 1 od srodka tez ma dlugosc 1.
  const surowe = juzNormalne
    ? punkty.map((n) => n.clone())
    : naNormalne(punkty, planeta, wez);
  if (surowe.length < 2) return null;

  const os = przeprobkuj(surowe, planeta, krok);
  if (os.length < 2) return null;

  // Próbki = oś + (opcjonalnie) zwężające się końcówki. Kapsel to po prostu
  // przedłużenie osi o `polSzerokosc` z profilem koła: hw = HW·cos(asin(d/HW)).
  // Dzięki temu zaokrąglenie jedzie tym samym kodem, co reszta wstęgi.
  const probki = os.map((n) => ({ n, hw: polSzerokosc }));
  if (kapsle && polSzerokosc > 1e-4) {
    const UDZIALY = [0.38, 0.71, 0.92, 0.999];
    const dopisz = (skad, dokad, naPoczatek) => {
      stycznaDo(skad, dokad, _v.set(1, 0, 0), _p).negate(); // kierunek NA ZEWNĄTRZ
      for (const u of UDZIALY) {
        const n = skad.clone();
        const f = _p.clone();
        planeta.przesunPoKuli(n, f, u * polSzerokosc);
        const wpis = { n, hw: polSzerokosc * Math.sqrt(Math.max(0, 1 - u * u)) };
        if (naPoczatek) probki.unshift(wpis);
        else probki.push(wpis);
      }
    };
    dopisz(os[0], os[1], true);
    dopisz(os[os.length - 1], os[os.length - 2], false);
  }

  const osProbek = probki.map((p) => p.n);
  const poz = [];
  const nor = [];
  const uv = [];
  const idx = [];
  const R = planeta.R;
  let dl = 0;

  for (let i = 0; i < probki.length; i++) {
    const { n, hw } = probki[i];
    if (i > 0) dl += R * Math.acos(Math.max(-1, Math.min(1, osProbek[i - 1].dot(n))));
    const { t, mitra } = ramkaOsi(osProbek, i, planeta, mitraMax);
    _p.crossVectors(n, t).normalize();
    const odsun = hw * mitra;
    for (const znak of [1, -1]) {
      _v.copy(n);
      _b.copy(_p);
      if (odsun > 1e-6) planeta.przesunPoKuli(_v, _b, znak * odsun);
      nor.push(_v.x, _v.y, _v.z); // normalna powierzchni = kierunek punktu
      _v.multiplyScalar(R + wysokosc);
      poz.push(_v.x, _v.y, _v.z);
    }
    uv.push(0, dl * skalaUV, 1, dl * skalaUV);
  }

  for (let j = 0; j < probki.length - 1; j++) {
    const b = j * 2;
    idx.push(b, b + 1, b + 2, b + 1, b + 3, b + 2);
  }

  const g = new BufferGeometry();
  g.setAttribute("position", new Float32BufferAttribute(poz, 3));
  g.setAttribute("normal", new Float32BufferAttribute(nor, 3));
  g.setAttribute("uv", new Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeBoundingSphere();
  return { geometry: g, os, dlugosc: dl };
}

/**
 * Łamana pocięta na kawałki mieszczące się w promieniu `rmax` od środka
 * mapy — odpowiednik `przytnijDoPromienia` z `planeta.js`, ale działający
 * na normalnych i mierzący odległość PO KULI, a nie w płaskim rzucie.
 *
 * Wstęgi nie obowiązuje `promienTresci` (0,72·πR), bo nie korzystają
 * z tekstury — jedyna prawdziwa granica to antypod, gdzie płaska mapa
 * zwija się w punkt i kierunek przestaje być określony.
 */
export function potnijNaKuli(normalne, planeta, rmax = Math.PI * planeta.R * 0.985) {
  const prog = Math.cos(Math.min(rmax / planeta.R, Math.PI * 0.995));
  const kawalki = [];
  let biezacy = [];
  for (const n of normalne) {
    if (n.y >= prog) biezacy.push(n);
    else if (biezacy.length) {
      if (biezacy.length >= 2) kawalki.push(biezacy);
      biezacy = [];
    }
  }
  if (biezacy.length >= 2) kawalki.push(biezacy);
  return kawalki;
}
