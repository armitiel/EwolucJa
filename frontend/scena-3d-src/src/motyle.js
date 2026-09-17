/*!
 * SPDX-FileCopyrightText: © 2026 Amitiel Angelisme <armitiel@gmail.com>
 * SPDX-License-Identifier: LicenseRef-EwolucJA-Proprietary
 *
 * EwolucJA — gra edukacyjna dla dzieci.
 * Produkt powstał w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”;
 * autorskie prawa majątkowe pozostają przy autorze. Licencja: LICENSE.
 */
/**
 * motyle.js — motyle latające po planecie.
 *
 * PO CO. Świat, w którym rusza się tylko bohater, czyta się jak makieta.
 * Kilkanaście motyli w różnych barwach, które lecą własnymi drogami, siadają
 * na kwiatach i zrywają się, gdy lisek podejdzie, daje planecie życie — bez
 * tekstu, bez nagrody, bez licznika. Nic tu nie da się „zebrać": motyle są
 * częścią świata, nie zasobem (patrz `docs/OPIS_PROJEKTU.md`).
 *
 * GDZIE ŻYJĄ. W grupie PLANETY, jak kwiaty i dymki: lot liczy się w płaskim
 * układzie mapy (x, z) plus wysokość nad kulą, a na sferę przenoszą go
 * `Planeta.naKule` i `Planeta.ramka` — tak samo jak wszystko inne w scenie.
 * Motyl obraca się więc razem z planetą pod bohaterem, a „na wprost" znaczy
 * dla niego to samo, co dla drzewa obok.
 *
 * JAK ZBUDOWANE. Dwa `InstancedMesh` na WSZYSTKIE motyle: skrzydła (dwa na
 * motyla, jedna geometria — lewe to prawe w lustrze) i tułowie. Skrzydło to
 * płaski wachlarz fasetek z barwą W WIERZCHOŁKACH (ciemny brzeg, jasna
 * plamka), a barwę całego motyla niesie kolor INSTANCJI; shader mnoży jedno
 * z drugim, więc jeden rysunek daje wiele barw bez żadnej tekstury —
 * planeta jest fasetkowa, nie teksturowana, i motyle mają być z tego świata.
 *
 * ZACHOWANIE. Cel → lot z błądzeniem (suma sinusów, NIE losowanie co klatkę:
 * losowanie drga, sinusy falują), rytmem „seria uderzeń → szybowanie" i od
 * czasu do czasu pełną pętlą → przy kwiatku zejście, lądowanie, odpoczynek
 * ze złożonymi skrzydłami → odlot do następnego celu, najczęściej dalekiego
 * (za horyzont). LISEK: siedzący motyl zrywa się, gdy lisek podejdzie bliżej
 * niż `ploszenie`; lecący bliżej niż `omijanie` wchodzi w UCIECZKĘ — zawraca
 * od liska, przyspiesza do `predkoscUcieczki`, idzie wyżej i trzepie szybciej
 * przez `ucieczkaCzas` od ostatniego zbliżenia, a następny cel wybiera z dala
 * od liska. W nocy (`Doba.stan.noc > 0,5`) motyle siadają i śpią, aż wróci
 * dzień — zbudzi je tylko lisek, i to na chwilę.
 *
 * Reakcja na bohatera to fizyka świata, nie pomiar: motyle nie liczą, czy
 * dziecko je goni, i niczego o nim nie zapisują.
 */
import {
  BufferGeometry, CapsuleGeometry, Color, DoubleSide, DynamicDrawUsage,
  Float32BufferAttribute, Group, InstancedMesh, Matrix4, MeshLambertMaterial,
  Quaternion, Vector3,
} from "three";

export const MOTYLE = {
  // Kilka, nie chmara (decyzja właściciela 2026-09-17: „mniej motyli"). Przy
  // siedmiu w kadrze są zwykle dwa–trzy — reszta śmiga po drugiej stronie kuli.
  ile: 7,
  // Promień koła (jednostki mapy), po którym latają. `null` = scena podstawia
  // 0,9·promienTresci — daleko za horyzont (ok. 115° od bieguna), bo motyle
  // mają latać WOKÓŁ planety, a nie tylko po polanie.
  zasieg: null,
  // Długość jednego skrzydła w jednostkach mapy (rozpiętość ≈ 2×). Lisek ma
  // 1,74 wysokości, kwiatek ok. 0,25 — motyl jest duży jak w kreskówce, bo
  // przy 95 px na jednostkę mapy mniejszy byłby drobinką, nie zwierzątkiem.
  rozmiarOd: 0.2, rozmiarDo: 0.28,
  wysokoscOd: 0.5, wysokoscDo: 1.05,    // pułap lotu nad ziemią
  predkoscOd: 0.7, predkoscDo: 1.25,    // jednostki mapy na sekundę
  skret: 2.6,                            // rad/s — jak ostro zawraca do celu
  bladzenie: 1.4,                        // siła meandrowania (1 = jak niżej)
  // Skrzydła: powolny, kreskówkowy trzepot (prawdziwy motyl bije 8–12 razy na
  // sekundę, ale na ekranie to drganie, nie ruch). Rytm: seria uderzeń →
  // szybowanie z rozłożonymi skrzydłami → seria uderzeń (`szybowanie*`).
  trzepotOd: 2.6, trzepotDo: 3.6,        // Hz w locie
  trzepotSiedzi: 0.7,                    // Hz — „oddech" złożonych skrzydeł
  szybowanieOd: 0.4, szybowanieDo: 1.1,  // s — jak długo szybuje
  uderzeniaOd: 0.9, uderzeniaDo: 2.0,    // s — jak długo trzepie między szybowaniami
  petlaCo: 22,                           // s — co ile (średnio) motyl robi pełną pętlę
  siedziOd: 3.0, siedziDo: 8.0,          // sekundy odpoczynku na kwiatku
  udzialKwiatow: 0.3,                    // jaka część celów to kwiat w okolicy
  udzialPrzyBohaterze: 0.2,              // część celów losowana koło liska…
  promienPrzyBohaterze: 4.5,             // …w tym promieniu (żeby było je widać)
  // Reszta celów to DALEKIE punkty gdziekolwiek w zasięgu (≥ 5 jednostek):
  // motyl znika za horyzontem i wraca z drugiej strony — to jest „wokół planety".
  dalekoOd: 5,
  // LISEK. Decyzja właściciela 2026-09-17: „jak lisek jest blisko, motyl
  // odlatuje" — nie unik o krok, tylko wyraźna ucieczka. Zasięgi liczone od
  // środka liska w jednostkach mapy (lisek ma ~1,7 wzrostu).
  ploszenie: 2.4,                        // siedzący się zrywa
  omijanie: 2.2,                         // lecący zawraca od liska i ucieka
  ucieczkaCzas: 1.6,                     // s — ile trwa ucieczka po ostatnim zbliżeniu
  predkoscUcieczki: 2.2,                 // jednostki/s (lisek idzie 1,38, biegnie 3,42)
  nocSpi: true,
  // Siedem barw, potasowane: przy siedmiu motylach każda pojawia się raz.
  barwy: [0xf7c948, 0xf28c38, 0xef6a8a, 0x7ab8f0, 0xb98ae0, 0x6fd0c4, 0xf5efe0],
  barwaTulowia: 0x4e4d76,                // atrament HUD-u, nie czerń
  ziarno: null,                          // liczba = powtarzalny świat (testy)
};

/* ── GEOMETRIA ──────────────────────────────────────────────────────────────
 * Obrys skrzydła w jednostkach „długość skrzydła = 1": x — od tułowia na
 * zewnątrz, z — wzdłuż tułowia (+ = ku głowie), y = 0. Przednie i tylne
 * skrzydło to dwa wachlarze z jednego zawiasu w (0, 0); między nimi zostaje
 * szczelina przy zawiasie, którą zakrywa tułów. */
const PRZEDNIE = [[0, .04], [.20, .34], [.60, .46], [1.0, .32], [.92, .06], [.50, -.02]];
const TYLNE = [[.02, -.06], [.46, -.10], [.74, -.32], [.58, -.64], [.24, -.68], [.04, -.42]];
// Pierścień dzieli wachlarz na wnętrze i brzeg — brzeg dostaje własne tony.
const PIERSCIEN = 0.52;
// Mnożniki barwy instancji. Wartości > 1 ROZJAŚNIAJĄ (Float32, bez
// przycięcia), stąd kremowa plamka jaśniejsza od barwy motyla.
const TON = {
  glowny: [1, 1, 1],
  stlumiony: [.93, .92, .95],
  ciemny: [.5, .45, .58],            // brzeg — chłodna ciemność, nie czerń
  plamka: [1.45, 1.42, 1.3],         // „okienko" na skrzydle
};
const PASY = {
  przednie: ["stlumiony", "plamka", "ciemny", "ciemny", "stlumiony"],
  tylne: ["stlumiony", "ciemny", "ciemny", "plamka", "stlumiony"],
};

function geometriaSkrzydla() {
  const poz = [], kol = [];
  const trojkat = (a, b, c, ton) => {
    // Nawinięcie jednolite (normalna w +Y) dla obu części skrzydła — inaczej
    // przednie i tylne łapałyby światło z przeciwnych stron.
    if ((b[1] - a[1]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[1] - a[1]) < 0) [b, c] = [c, b];
    for (const p of [a, b, c]) { poz.push(p[0], 0, p[1]); kol.push(...TON[ton]); }
  };
  const wachlarz = (obrys, pasy, tonWnetrza) => {
    const H = [0, 0];
    const M = obrys.map(([x, z]) => [x * PIERSCIEN, z * PIERSCIEN]);
    for (let i = 0; i < obrys.length - 1; i++) {
      trojkat(H, M[i], M[i + 1], tonWnetrza);
      trojkat(M[i], obrys[i], obrys[i + 1], pasy[i]);
      trojkat(M[i], obrys[i + 1], M[i + 1], pasy[i]);
    }
  };
  wachlarz(PRZEDNIE, PASY.przednie, "glowny");
  wachlarz(TYLNE, PASY.tylne, "stlumiony");
  const g = new BufferGeometry();
  g.setAttribute("position", new Float32BufferAttribute(poz, 3));
  g.setAttribute("color", new Float32BufferAttribute(kol, 3));
  g.computeVertexNormals();
  return g;
}

/* ── POMOCNICZE ───────────────────────────────────────────────────────────── */
const _pos = new Vector3(), _pos2 = new Vector3(), _gora = new Vector3(), _skala = new Vector3();
const _q = new Quaternion(), _qa = new Quaternion(), _qt = new Quaternion(), _m = new Matrix4();
const _X = new Vector3(1, 0, 0), _Y = new Vector3(0, 1, 0), _Z = new Vector3(0, 0, 1);
const _kolor = new Color();
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const dogon = (s, cel, tempo, dt) => s + (cel - s) * (1 - Math.exp(-tempo * dt));
const katDo = (a) => Math.atan2(Math.sin(a), Math.cos(a));     // do (−π, π]
// Skrzydła: kąt od poziomu (radiany). W locie od −17° do 80° (prawie płasko →
// prawie złączone nad grzbietem), w szybowaniu rozłożone i ledwo drżące,
// na kwiatku złożone z lekkim „oddechem".
const LOT = { srodek: 0.55, amp: 0.85 };
const SZYB = { srodek: 0.22, amp: 0.07 };
const SIAD = { srodek: 1.15, amp: 0.18 };

export class Motyle {
  /**
   * @param {Group} grupaPlanety grupa obracana pod bohaterem (`app.swiat`)
   * @param {Planeta} planeta
   * @param {object} opcje `MOTYLE` + `kwiaty` (wynik `zbudujKwiaty`, czytany
   *   na żywo — kwiaty z zasiewu też się liczą), `wysokoscGruntu(x, z)`
   *   (analityczna forma terenu — pod lot), `gruntDokladny(x, z)` (miernik
   *   z siatki — pod siadanie na ziemi), `woda(x, z)` (czy to staw),
   *   `przeszkody` (lista `{x, z, r}` z kolizji — motyl je omija),
   *   `srodek` ([x, z] — gdzie zaczyna bohater; tam startuje połowa motyli).
   */
  constructor(grupaPlanety, planeta, opcje = {}) {
    const C = this.C = { ...MOTYLE, ...opcje };
    this.planeta = planeta;
    this.kwiaty = C.kwiaty || null;
    this.grunt = typeof C.wysokoscGruntu === "function" ? C.wysokoscGruntu : () => 0;
    this.gruntDokladny = typeof C.gruntDokladny === "function" ? C.gruntDokladny : this.grunt;
    this.woda = typeof C.woda === "function" ? C.woda : () => false;
    this.przeszkody = Array.isArray(C.przeszkody) ? C.przeszkody : [];
    this.zasieg = C.zasieg > 0 ? C.zasieg : 10;
    this._hp = { x: C.srodek?.[0] ?? 0, z: C.srodek?.[1] ?? 0 };
    this._noc = 0;
    this._zajete = new Set();

    // Własny generator (mulberry32): `ziarno` z opcji daje powtarzalny świat
    // do testów, bez niego każda sesja losuje inne motyle — o to chodzi.
    let z = (C.ziarno ?? (Date.now() ^ Math.floor(Math.random() * 2147483647))) >>> 0;
    this.los = () => {
      z = (z + 0x6d2b79f5) >>> 0;
      let t = z;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    const mie = (a, b) => a + this.los() * (b - a);

    this.grupa = new Group();
    this.grupa.name = "motyle";
    grupaPlanety.add(this.grupa);

    const N = Math.max(0, C.ile | 0);
    this.gSkrzydlo = geometriaSkrzydla();
    // Tułów: kapsułka wzdłuż osi Z (głowa w +Z), środek w zawiasie skrzydeł.
    this.gTulow = new CapsuleGeometry(0.075, 0.5, 3, 7).rotateX(Math.PI / 2);
    this.mSkrzydlo = new MeshLambertMaterial({ vertexColors: true, side: DoubleSide, flatShading: true });
    this.mTulow = new MeshLambertMaterial({ color: C.barwaTulowia, flatShading: true });
    this.skrzydla = new InstancedMesh(this.gSkrzydlo, this.mSkrzydlo, Math.max(1, 2 * N));
    this.tulowie = new InstancedMesh(this.gTulow, this.mTulow, Math.max(1, N));
    this.skrzydla.name = "motyle-skrzydla";
    this.tulowie.name = "motyle-tulowie";
    for (const im of [this.skrzydla, this.tulowie]) {
      // Kula obwiedni instancji nie zna ich pozycji — bez tego renderer
      // wycinałby motyle, gdy środek grupy wyjdzie z kadru.
      im.frustumCulled = false;
      im.instanceMatrix.setUsage(DynamicDrawUsage);
      this.grupa.add(im);
    }
    this.skrzydla.count = 2 * N;
    this.tulowie.count = N;

    // Barwy po kolei z potasowanej listy: przy tuzinie motyli na pewno będą
    // wszystkie odcienie, a nie cztery żółte i jeden niebieski.
    const barwy = [...C.barwy];
    for (let i = barwy.length - 1; i > 0; i--) {
      const j = Math.floor(this.los() * (i + 1));
      [barwy[i], barwy[j]] = [barwy[j], barwy[i]];
    }

    this.sztuki = [];
    for (let i = 0; i < N; i++) {
      _kolor.set(barwy[i % barwy.length]).multiplyScalar(mie(0.92, 1.08));
      this.skrzydla.setColorAt(2 * i, _kolor);
      this.skrzydla.setColorAt(2 * i + 1, _kolor);
      const s = {
        i, x: 0, z: 0, y: 0, kurs: mie(0, Math.PI * 2), v: 0,
        vCel: mie(C.predkoscOd, C.predkoscDo),
        pulap: mie(C.wysokoscOd, C.wysokoscDo),
        rozmiar: mie(C.rozmiarOd, C.rozmiarDo),
        trzepot: mie(C.trzepotOd, C.trzepotDo),
        faza: mie(0, Math.PI * 2), f: 0,
        srodekSkrz: LOT.srodek, ampSkrz: LOT.amp,
        bank: 0, pitch: 0, wznos: 0,
        // Własny zegar i fazy meandrowania — dwa motyle nigdy nie falują zgodnie.
        t: mie(0, 100), f1: mie(0, 6.2832), f2: mie(0, 6.2832), f3: mie(0, 6.2832),
        // Rytm trzepot/szybowanie i pętla (ile radianów jeszcze do zamknięcia).
        szybuje: false, rytm: mie(0.3, 1.5), petla: 0, petlaKier: 1,
        // Ucieczka przed liskiem: ile sekund jeszcze trwa; po niej następny cel
        // nie może być koło liska.
        ucieczka: 0, unikajLiska: false,
        stan: "lot", czas: 0, cel: null, kwiat: null, kwiatOstatni: null,
      };
      // Start: połowa blisko miejsca startu bohatera (żeby na dzień dobry
      // coś latało w kadrze), reszta gdziekolwiek w zasięgu.
      const przyStarcie = this.los() < 0.5;
      const r = Math.sqrt(this.los()) * (przyStarcie ? Math.min(5.5, this.zasieg) : this.zasieg);
      const a = this.los() * Math.PI * 2;
      s.x = (przyStarcie ? this._hp.x : 0) + Math.cos(a) * r;
      s.z = (przyStarcie ? this._hp.z : 0) + Math.sin(a) * r;
      this._wZasiegu(s);
      s.y = this.grunt(s.x, s.z) + s.pulap;
      s.f = s.trzepot;
      s.v = s.vCel;
      this.sztuki.push(s);
    }
    if (this.skrzydla.instanceColor) this.skrzydla.instanceColor.needsUpdate = true;

    // Część zaczyna na kwiatkach — świat nie startuje „wszyscy w powietrzu".
    for (const s of this.sztuki) {
      if (this.los() < 0.35) {
        const k = this._wolnyKwiat(s, null);
        if (k) {
          this._celKwiat(s, k);
          this._usiadz(s, true);
          continue;
        }
      }
      this._nowyCel(s);
    }
    this._rysuj();
  }

  /**
   * @param {number} dt sekundy
   * @param {{x:number,z:number}} hp współrzędne MAPY bohatera (`app.hp`)
   * @param {object|null} stanDoby `Doba.stan` (pole `noc` 0..1) albo null
   * @param {boolean} spokojnie prefers-reduced-motion — wolniej, mniej trzepotu
   */
  aktualizuj(dt, hp, stanDoby = null, spokojnie = false) {
    if (!this.sztuki.length) return;
    dt = clamp(dt, 0, 0.05);
    if (hp) {
      // Tempo liska z przebytej drogi (jak w dymki.js) — uciekający motyl ma
      // być ZAWSZE trochę szybszy od niego, także gdy dziecko biegnie.
      // Skok (teleport, `ustawBohatera`) przycina się do 4 i szybko gaśnie.
      if (dt > 1e-4) {
        const d = Math.hypot(hp.x - this._hp.x, hp.z - this._hp.z);
        this._vLiska = dogon(this._vLiska || 0, Math.min(4, d / dt), 8, dt);
      }
      this._hp.x = hp.x; this._hp.z = hp.z;
    }
    this._noc = stanDoby ? (stanDoby.noc || 0) : 0;
    const C = this.C;
    const noc = C.nocSpi && this._noc > 0.5;
    const tempo = spokojnie ? 0.5 : 1;

    for (const s of this.sztuki) {
      s.t += dt * tempo;
      const ox = s.x - this._hp.x, oz = s.z - this._hp.z, odB = Math.hypot(ox, oz);
      const yPrzed = s.y;
      let skret = 0;

      if (s.stan === "lot") {
        if (!s.cel) this._nowyCel(s);
        // UCIECZKA. Lisek w zasięgu → w tył zwrot OD niego, gaz, wyżej, bez
        // szybowania i pętli. Zegar odnawia się co klatkę, póki lisek goni,
        // więc biegnące dziecko ma przed sobą uciekającego motyla, a nie taki,
        // który po sekundzie zawraca mu pod nos.
        if (odB < C.omijanie && odB > 1e-4) {
          if (!(s.ucieczka > 0)) this._uciekaj(s);
          s.ucieczka = Math.max(s.ucieczka, C.ucieczkaCzas);
        }
        const ucieka = s.ucieczka > 0;
        const dx = s.cel.x - s.x, dz = s.cel.z - s.z, dist = Math.hypot(dx, dz);
        const siada = !!(s.cel.kwiat || s.cel.ziemia);
        // Skręt do celu + meandrowanie, które gaśnie przy samym celu (żeby
        // trafić w kwiatek, a nie krążyć nad nim).
        const waga = clamp((dist - 0.6) / 1.4, 0.15, 1);
        if (ucieka) {
          s.ucieczka -= dt * tempo;
          s.petla = 0;
          skret = clamp(katDo(Math.atan2(ox, oz) - s.kurs) * 4.5, -5, 5);
        } else if (s.petla > 0) {
          // PĘTLA: pełny obrót w miejscu lotu, cel na chwilę nieważny. To ten
          // „freestyle" — motyl nie leci po sznurku, tylko czasem zakręci
          // kółko, jakby coś go ucieszyło.
          skret = 4.2 * s.petlaKier;
          s.petla -= Math.abs(skret) * dt * tempo;
        } else {
          skret = clamp(katDo(Math.atan2(dx, dz) - s.kurs) * 2.6, -C.skret, C.skret);
          skret += (Math.sin(s.t * 1.9 + s.f1) * 1.0 + Math.sin(s.t * 0.55 + s.f2) * 0.6) * C.bladzenie * waga;
          // Pętla zdarza się w drodze (daleko od celu), średnio co `petlaCo` s.
          if (dist > 3 && !siada && C.petlaCo > 0 && this.los() < dt * tempo / C.petlaCo) {
            s.petla = Math.PI * 2;
            s.petlaKier = this.los() < 0.5 ? -1 : 1;
          }
        }
        // RYTM SKRZYDEŁ: seria uderzeń, potem szybowanie z rozłożonymi
        // skrzydłami. Szybując motyl lekko opada, trzepiąc — wznosi się; stąd
        // falowanie toru, którego nie trzeba osobno animować.
        s.rytm -= dt * tempo;
        if (s.rytm <= 0) {
          s.szybuje = !s.szybuje;
          s.rytm = s.szybuje ? C.szybowanieOd + this.los() * (C.szybowanieDo - C.szybowanieOd)
            : C.uderzeniaOd + this.los() * (C.uderzeniaDo - C.uderzeniaOd);
        }
        // Przy lądowaniu, w pętli i w ucieczce zawsze trzepie — szybowanie
        // w dół na kwiatek wyglądałoby jak spadanie, a uciekać się nie szybuje.
        const szybuje = s.szybuje && !(siada && dist < 2) && !(s.petla > 0) && !ucieka;
        // Drzewa i głazy: łuk dookoła, nie przelot przez pień.
        for (const b of this.przeszkody) {
          if (!b || !(b.r >= 0.4)) continue;
          const px = s.x - b.x, pz = s.z - b.z, strefa = b.r + 0.45;
          if (Math.abs(px) > strefa || Math.abs(pz) > strefa) continue;
          const d = Math.hypot(px, pz);
          if (d >= strefa || d < 1e-4) continue;
          skret += clamp(katDo(Math.atan2(px, pz) - s.kurs) * 3, -4, 4) * (1 - d / strefa);
        }
        // Skraj zasięgu: zawracaj do środka mapy — im dalej za granicą, tym
        // mocniej (ma przeważyć nawet ucieczkę przed liskiem).
        const r = Math.hypot(s.x, s.z);
        if (r > this.zasieg) {
          skret += clamp(katDo(Math.atan2(-s.x, -s.z) - s.kurs) * 3, -4, 4) * clamp((r - this.zasieg) / 0.5 + 0.3, 0, 2.5);
        }
        s.kurs += skret * dt * tempo;
        // Do kwiatka podchodzi coraz wolniej — lądowanie, nie zderzenie.
        // W pętli zwalnia (kółko ma być ciasne), szybując leci odrobinę
        // szybciej, uciekając — pełny gaz, złapany szybko (tempo 6).
        const hamowanie = (siada ? clamp(0.35 + dist / 1.5, 0.35, 1) : 1) * (s.petla > 0 ? 0.6 : 1) * (szybuje ? 1.1 : 1);
        s.v = ucieka
          ? dogon(s.v, Math.max(C.predkoscUcieczki, (this._vLiska || 0) * 1.2), 6, dt)
          : dogon(s.v, s.vCel * hamowanie * (1 + 0.18 * Math.sin(s.t * 2.7 + s.f3)), 2.5, dt);
        const krok = s.v * dt * tempo;
        s.x += Math.sin(s.kurs) * krok;
        s.z += Math.cos(s.kurs) * krok;
        // Pułap faluje (szybując opada, trzepiąc się wznosi, w pętli podskakuje,
        // uciekając idzie wyżej); na ostatnim odcinku do kwiatka motyl schodzi.
        let yCel = this.grunt(s.x, s.z) + s.pulap
          + 0.1 * Math.sin(s.t * 1.1 + s.f2) + 0.04 * Math.sin(s.t * 2.6 + s.f1)
          + (szybuje ? -0.2 : 0.08)
          + (s.petla > 0 ? 0.3 * Math.sin((1 - s.petla / (Math.PI * 2)) * Math.PI) : 0)
          + (ucieka ? 0.7 : 0);
        if (siada && !ucieka) {
          const w = clamp((dist - 0.3) / 1.6, 0, 1);
          yCel = s.cel.y + (yCel - s.cel.y) * w;
        }
        s.y = dogon(s.y, yCel, 3.5, dt);
        this._trzepot(s, szybuje ? SZYB : LOT, szybuje ? 1.2 : s.trzepot * (ucieka ? 1.5 : 1), dt, tempo);
        if (dist < Math.max(0.22, krok * 1.5)) {
          // Kwiatek mógł w międzyczasie zająć inny motyl — wtedy szukaj dalej.
          if (siada && !(s.cel.kwiat && this._zajete.has(s.cel.kwiat))) { s.stan = "ladowanie"; s.czas = 0; }
          else this._nowyCel(s);
        }
      } else if (s.stan === "ladowanie") {
        s.czas += dt;
        s.x = dogon(s.x, s.cel.x, 7, dt);
        s.z = dogon(s.z, s.cel.z, 7, dt);
        s.y = dogon(s.y, s.cel.y, 7, dt);
        s.v = dogon(s.v, 0, 6, dt);
        this._trzepot(s, SIAD, C.trzepotSiedzi, dt, tempo);
        if (odB < C.ploszenie) this._start(s, true);
        else if (s.czas > 0.55) this._usiadz(s, false);
      } else {
        // siedzi
        s.y = s.cel.y;
        this._trzepot(s, SIAD, C.trzepotSiedzi, dt, tempo);
        if (odB < C.ploszenie) this._start(s, true);
        else if (!noc) {
          s.czas -= dt;
          if (s.czas <= 0) this._start(s, false);
        }
      }

      s.wznos = dogon(s.wznos, (s.y - yPrzed) / Math.max(dt, 1e-4), 6, dt);
      // Przechył w skręcie i pochylenie przy wznoszeniu — tylko w locie.
      s.bank = dogon(s.bank, s.stan === "lot" ? clamp(-skret * 0.22, -0.5, 0.5) : 0, 5, dt);
      s.pitch = dogon(s.pitch, s.stan === "lot" ? clamp(-s.wznos * 0.45, -0.45, 0.45) : 0, 5, dt);
    }
    this._rysuj();
  }

  /** Migawka do `stan()` sceny i pulpitu DEV. */
  stan() {
    let lataja = 0, siedza = 0, uciekaja = 0;
    for (const s of this.sztuki) {
      if (s.stan === "lot") { lataja++; if (s.ucieczka > 0) uciekaja++; } else siedza++;
    }
    return { ile: this.sztuki.length, lataja, siedza, uciekaja, noc: this._noc > 0.5 };
  }

  /* ── wnętrze ─────────────────────────────────────────────────────────── */

  _trzepot(s, cel, hz, dt, tempo) {
    s.f = dogon(s.f, hz, 6, dt);
    s.srodekSkrz = dogon(s.srodekSkrz, cel.srodek, 6, dt);
    s.ampSkrz = dogon(s.ampSkrz, cel.amp, 6, dt);
    s.faza += Math.PI * 2 * s.f * dt * tempo;
    if (s.faza > 1e4) s.faza -= 1e4;
  }

  _wZasiegu(s) {
    const r = Math.hypot(s.x, s.z);
    if (r > this.zasieg) { const k = (this.zasieg * 0.95) / r; s.x *= k; s.z *= k; }
  }

  /**
   * Wolny kwiat (nie trawa, wyrośnięty, w zasięgu), inny niż `nie`. Losowany
   * spośród KILKU NAJBLIŻSZYCH motyla, nie z całej mapy — motyl przelatuje
   * z kwiatka na kwiatek w swojej okolicy, a nie przez pół planety. W nocy
   * bierze najbliższy: śpiący motyl szuka posłania, nie przygody.
   */
  _wolnyKwiat(s, nie, najblizszy = false) {
    const lista = this.kwiaty?.lista;
    if (!lista || !lista.length) return null;
    const wolne = [];
    const zaBlisko = this.C.ploszenie + 0.4;
    for (const k of lista) {
      if (k.typ !== "kwiat" || (k.wzrost ?? 1) < 0.98 || k === nie || this._zajete.has(k)) continue;
      if (Math.hypot(k.x, k.z) > this.zasieg) continue;
      // Kwiatek pod nosem liska odpada — motyl nie siada tam, skąd zaraz
      // by go spłoszył; bez tego wpadałby w pętlę siadania i zrywania się.
      if (Math.hypot(k.x - this._hp.x, k.z - this._hp.z) < zaBlisko) continue;
      wolne.push(k);
    }
    if (!wolne.length) return null;
    if (s) wolne.sort((a, b) => Math.hypot(a.x - s.x, a.z - s.z) - Math.hypot(b.x - s.x, b.z - s.z));
    const ile = najblizszy || !s ? 1 : Math.min(3, wolne.length);
    return wolne[Math.floor(this.los() * ile)];
  }

  /** Cel na kwiatku: czubek główki (patrz `odswiez` w `zbudujKwiaty`) + tułów. */
  _celKwiat(s, k) {
    const wzrost = k.skala * (k.wzrost ?? 1);
    s.cel = { x: k.x, z: k.z, y: k.grunt + (k.h + 0.045) * wzrost + 0.075 * s.rozmiar, kwiat: k };
  }

  /**
   * Następny cel. Trzy rodzaje: kwiat w okolicy, punkt koło liska (żeby
   * część motyli zawsze była w kadrze — dziecko nie widzi tego jako
   * „podążania", bo przelot jest zwykłym przelotem) albo — najczęściej —
   * DALEKI punkt gdziekolwiek w zasięgu. Dalekie odcinki to decyzja
   * właściciela („niech sobie śmigają wokół planety"): motyl odlatuje za
   * horyzont i wraca z drugiej strony, a nie kręci się nad jedną polaną.
   */
  _nowyCel(s) {
    const C = this.C, los = this.los;
    const noc = C.nocSpi && this._noc > 0.5;
    const r = los();
    const unikaj = s.unikajLiska;
    s.unikajLiska = false;
    if (noc || r < C.udzialKwiatow) {
      const k = this._wolnyKwiat(s, s.kwiatOstatni, noc);
      if (k) { this._celKwiat(s, k); return; }
      if (noc) {
        // Brak wolnego kwiatka: śpi na trawie obok (nie na wodzie).
        for (let p = 0; p < 6; p++) {
          const a = los() * 6.2832, d = 0.8 + los() * 1.6;
          const x = s.x + Math.cos(a) * d, z = s.z + Math.sin(a) * d;
          if (Math.hypot(x, z) > this.zasieg || this.woda(x, z)) continue;
          s.cel = { x, z, y: this.gruntDokladny(x, z) + 0.075 * s.rozmiar, ziemia: true };
          return;
        }
      }
    }
    // Po ucieczce następny cel nie może być koło liska — inaczej motyl
    // zawracałby prosto pod nos temu, przed kim właśnie uciekł.
    const przyLisku = r < C.udzialKwiatow + C.udzialPrzyBohaterze && !unikaj;
    for (let p = 0; p < 10; p++) {
      let x, z;
      if (przyLisku) {
        // Nie bliżej niż zasięg płoszenia — cel pod nosem liska to od razu ucieczka.
        const a = los() * 6.2832, d = C.omijanie + 0.6 + Math.sqrt(los()) * C.promienPrzyBohaterze;
        x = this._hp.x + Math.cos(a) * d;
        z = this._hp.z + Math.sin(a) * d;
      } else {
        // Gdziekolwiek w zasięgu (równomiernie po polu koła), ale daleko —
        // blisko już był.
        const a = los() * 6.2832, d = Math.sqrt(los()) * this.zasieg;
        x = Math.cos(a) * d;
        z = Math.sin(a) * d;
      }
      if (Math.hypot(x, z) > this.zasieg) continue;
      if (Math.hypot(x - s.x, z - s.z) < (przyLisku ? 1.5 : C.dalekoOd)) continue;
      s.cel = { x, z, y: 0 };
      return;
    }
    // Nic nie pasuje (motyl na skraju zasięgu) — wracaj ku środkowi mapy.
    const k = 0.5 + los() * 0.3;
    s.cel = { x: s.x * k, z: s.z * k, y: 0 };
  }

  _usiadz(s, odRazu) {
    if (s.cel.kwiat && this._zajete.has(s.cel.kwiat)) { this._start(s, false); return; }
    s.stan = "siedzi";
    s.v = 0;
    s.x = s.cel.x; s.z = s.cel.z; s.y = s.cel.y;
    s.czas = this.C.siedziOd + this.los() * (this.C.siedziDo - this.C.siedziOd);
    if (s.cel.kwiat) {
      s.kwiat = s.cel.kwiat;
      this._zajete.add(s.kwiat);
      if (!odRazu) this._trac(s.kwiat, 0.7);
    }
    if (odRazu) { s.f = this.C.trzepotSiedzi; s.srodekSkrz = SIAD.srodek; s.ampSkrz = SIAD.amp; }
  }

  _start(s, ploszony) {
    if (s.kwiat) {
      this._zajete.delete(s.kwiat);
      this._trac(s.kwiat, 1.0);
    }
    // Zapamiętany także kwiatek, do którego motyl dopiero schodził — spłoszony
    // w lądowaniu nie ma wracać prosto na to samo miejsce.
    s.kwiatOstatni = s.kwiat || s.cel?.kwiat || s.kwiatOstatni;
    s.kwiat = null;
    s.stan = "lot";
    s.czas = 0;
    // Start zawsze na skrzydłach: seria uderzeń, żadnej pętli i szybowania.
    s.petla = 0;
    s.szybuje = false;
    s.rytm = this.C.uderzeniaOd + this.los() * (this.C.uderzeniaDo - this.C.uderzeniaOd);
    if (ploszony) {
      // Zerwany z kwiatka: od razu w ucieczce (kurs od liska, gaz, wyżej).
      s.kurs = Math.atan2(s.x - this._hp.x, s.z - this._hp.z) + (this.los() - 0.5) * 0.9;
      s.v = 1.2;
      this._uciekaj(s);
      s.ucieczka = this.C.ucieczkaCzas;
    } else {
      s.v = 0.35;
      this._nowyCel(s);
    }
  }

  /**
   * Cel ucieczki: kilka kroków dalej PO STRONIE PRZECIWNEJ do liska (z lekkim
   * rozrzutem, żeby stado nie uciekało po jednej linii), w zasięgu. Kurs
   * w locie i tak liczy się co klatkę od aktualnej pozycji liska — cel tylko
   * pilnuje, żeby po ucieczce motyl nie zawrócił prosto na niego.
   */
  _uciekaj(s) {
    const od = Math.atan2(s.x - this._hp.x, s.z - this._hp.z) + (this.los() - 0.5) * 0.9;
    const d = 4 + this.los() * 3;
    let x = s.x + Math.sin(od) * d, z = s.z + Math.cos(od) * d;
    const r = Math.hypot(x, z);
    if (r > this.zasieg) { x *= (this.zasieg * 0.9) / r; z *= (this.zasieg * 0.9) / r; }
    s.cel = { x, z, y: 0 };
    s.unikajLiska = true;
  }

  /** Kwiatek lekko się kołysze, gdy motyl siada i odlatuje (`k.gib` to
      sprężyna, którą co klatkę liczy `_gibKwiaty` w app.js). */
  _trac(k, sila) {
    if (!k?.gib) return;
    const a = this.los() * Math.PI * 2;
    k.gib.vx += Math.cos(a) * sila;
    k.gib.vz += Math.sin(a) * sila;
  }

  _rysuj() {
    const P = this.planeta;
    for (const s of this.sztuki) {
      const r = s.rozmiar;
      // Podskok w rytm uderzeń skrzydeł — tylko w locie (waga z amplitudy).
      const wLocie = clamp((s.ampSkrz - SIAD.amp) / (LOT.amp - SIAD.amp), 0, 1);
      P.naKule(s.x, s.z, s.y + 0.03 * Math.sin(s.faza) * wLocie, _pos);
      P.ramka(s.x, s.z, _q);
      _q.multiply(_qt.setFromAxisAngle(_Y, s.kurs));
      _q.multiply(_qt.setFromAxisAngle(_Z, s.bank));
      _q.multiply(_qt.setFromAxisAngle(_X, s.pitch));
      _skala.set(r, r, r);
      _m.compose(_pos, _q, _skala);
      this.tulowie.setMatrixAt(s.i, _m);
      // Zawias skrzydeł siedzi na grzbiecie, nie w osi tułowia.
      _gora.set(0, 1, 0).applyQuaternion(_q);
      _pos2.copy(_pos).addScaledVector(_gora, 0.07 * r);
      const theta = s.srodekSkrz + s.ampSkrz * Math.sin(s.faza);
      _qa.copy(_q).multiply(_qt.setFromAxisAngle(_Z, theta));
      _m.compose(_pos2, _qa, _skala);
      this.skrzydla.setMatrixAt(2 * s.i, _m);
      // Drugie skrzydło: to samo w lustrze (skala −x) i z przeciwnym kątem.
      _qa.copy(_q).multiply(_qt.setFromAxisAngle(_Z, -theta));
      _skala.set(-r, r, r);
      _m.compose(_pos2, _qa, _skala);
      this.skrzydla.setMatrixAt(2 * s.i + 1, _m);
    }
    this.skrzydla.instanceMatrix.needsUpdate = true;
    this.tulowie.instanceMatrix.needsUpdate = true;
  }
}
