/**
 * doba.js — dzień i noc, które dziecko robi NOGAMI.
 *
 * POMYSŁ. Słońce stoi nieruchomo w układzie PLANETY, a nie świata. Bohater
 * idzie, planeta obraca się pod nim — więc razem z nią obraca się słońce.
 * Idziesz w stronę słońca: robi się jaśniej. Idziesz od niego: zmierzch,
 * potem noc. Pora dnia nie jest zegarem; jest miejscem, w którym stoisz.
 *
 * PREZENTACJA. Pozycja na planecie wyznacza fazę dnia, a słońce porusza
 * się czytelnym łukiem od lewej do prawej. W pobliżu zachodu faza wizualna
 * zwalnia; ta sama faza steruje tarczą, światłem, niebem i księżycem.
 * Cofnięcie drogi cofa cykl, zatrzymanie liska zatrzymuje porę dnia.
 *
 * NOC NIE JEST KARĄ. Nigdy nie schodzimy do czerni: zostaje księżycowy
 * błękit, w którym bohatera widać wyraźnie. Noc ma być nagrodą za pójście
 * dalej, a nie ścianą.
 */
import {
  Color, Mesh, PlaneGeometry, ShaderMaterial, Sprite, SpriteMaterial,
  CanvasTexture, SRGBColorSpace, Vector3,
} from "three";

const zacisk = (x, a, b) => (x < a ? a : x > b ? b : x);
/** Hermite: 0 poniżej `a`, 1 powyżej `b`, miękko pomiędzy. */
const gladko = (a, b, x) => {
  const t = zacisk((x - a) / (b - a || 1e-6), 0, 1);
  return t * t * (3 - 2 * t);
};
/** Wykładnicze doganianie — niezależne od liczby klatek. */
const dogon = (teraz, cel, tempo, dt) => teraz + (cel - teraz) * (1 - Math.exp(-tempo * dt));

/**
 * Strojenie. Wszystko, co da się przesunąć bez dotykania kodu — także
 * z `mapa.json` przez `swiat.doba`.
 *
 * Barwy dzienne świateł są DOKŁADNIE te, które scena miała wcześniej
 * (`app.js`), więc przy pełnym dniu świat wygląda jak zawsze.
 */
export const DOBA = {
  // Nieboskłon jest GRADIENTEM: osobna barwa przy horyzoncie i w zenicie.
  // Wzięte z concept artu (poranek / dzień / zachód / noc).
  niebo: {
    dzien: 0x8fc9e4, zorza: 0xd98a5e, noc: 0x243147, silaZorzy: 1.0,
    zenitDzien: 0x48bdf0, horyzontDzien: 0xb9e6ee,
    zenitPoranek: 0x80cee4, horyzontPoranek: 0xffc58c,
    zenitZorza: 0x9b89bc, horyzontZorza: 0xffaa70,
    zenitNoc: 0x172f63, horyzontNoc: 0x345b88,
  },
  // Miękki rdzeń i niezależna poświata: mleczne południe, złoty zachód.
  slonceTarcza: {
    rdzen: 0xfffdf2, poswiataDzien: 0xffe9a8, poswiataZorza: 0xff9b45,
    wielkosc: 0.95, rozmycieZorzy: 0.7,
    spowolnienieZachodu: 0.35, // 0–0.45; 0.35 daje 30% tempa przy horyzoncie
  },
  ksiezyc: { barwa: 0xfff6dc, wielkosc: 1.15 },
  // Mnożnik barwy tekstury terenu. Biel = tekstura bez zmian (dzień).
  // Noc przesuwa zieleń w morski błękit, tak jak na concept arcie.
  // Teren: `barwa` to MNOŻNIK (biel = bez zmian), `emisja` to DODATEK.
  // Mnożnikiem nie da się rozjaśnić, a nocna trawa z concept artu jest
  // morska i świecąca — dlatego noc idzie emisją, a nie przyciemnianiem.
  ziemia: {
    dzien: 0xf5ffe6, zorza: 0xffd6aa, noc: 0x719bac,
    emisjaNoc: 0x123c4b, emisjaZorza: 0x554728,
  },
  slonce: { dzien: 0xfff0cf, zorza: 0xffb35e, moc: 1.8 },
  wypelnienie: { dzien: 0xfff2df, noc: 0x91bde3, mocDzien: 0.7, mocNoc: 0.8 },
  hemisfera: {
    goraDzien: 0xd8e4ff, dolDzien: 0x55763f,
    goraNoc: 0x75a9c9, dolNoc: 0x244455,
    zorzaGora: 0xffb070,
    mocDzien: 1.05, mocNoc: 0.78,
  },
  ambient: { dzien: 0x8090c0, noc: 0x688cba, mocDzien: 0.3, mocNoc: 0.38 },
  // Chmury: mnożnik barwy + odrobina emisji, żeby nocą nie znikały w czerni.
  chmury: { dzien: 0xffffff, zorza: 0xffc3a3, noc: 0x7895bd, emisjaNoc: 0x233b62 },
  gwiazdy: { krycie: 0.85 },
  // Progi na osi `t` (sinus wysokości słońca).
  progi: {
    switDo: 0.30,      // powyżej — pełny dzień
    switOd: -0.06,     // poniżej — dnia już nie ma
    nocOd: -0.38,      // poniżej — pełna noc
    zorzaSrodek: 0.04, // gdzie najmocniej pali się pomarańcz
    zorzaSzerokosc: 0.26,
  },
  tempo: 1.5,          // jak szybko światło dogania pozycję (1/s)
};

function scal(bazowe, nakladka) {
  if (!nakladka) return bazowe;
  const out = {};
  for (const k of Object.keys(bazowe)) {
    out[k] = typeof bazowe[k] === "object" && bazowe[k] !== null
      ? { ...bazowe[k], ...(nakladka[k] || {}) }
      : (nakladka[k] ?? bazowe[k]);
  }
  return out;
}

const _a = new Color();
const _b = new Color();
const _c = new Color();
const _px = new Vector3();
const _py = new Vector3();
const _pz = new Vector3();


/** Miękka tarcza: jasny rdzeń i gasnąca poświata. */
function teksturaTarczy(rdzen = "#fff6d8", poswiata = "#ffd98a") {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const x = c.getContext("2d");
  const g = x.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0.0, rdzen);
  g.addColorStop(0.32, rdzen);
  g.addColorStop(0.46, poswiata);
  g.addColorStop(1.0, "rgba(255,220,140,0)");
  x.fillStyle = g;
  x.fillRect(0, 0, 128, 128);
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  return t;
}

/** Sierp — pełne koło z wyciętym drugim kołem obok. */
function teksturaKsiezyca() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const x = c.getContext("2d");
  x.fillStyle = "#fff6dc";
  x.beginPath();
  x.arc(64, 64, 46, 0, Math.PI * 2);
  x.fill();
  x.globalCompositeOperation = "destination-out";
  x.beginPath();
  x.arc(43, 48, 43, 0, Math.PI * 2);
  x.fill();
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  return t;
}

/** Mleczny rdzeń: brak ostrej krawędzi nawet w pełnym południu. */
function teksturaSlonca() {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const x = c.getContext("2d");
  const g = x.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(.48, "rgba(255,255,255,1)");
  g.addColorStop(.67, "rgba(255,255,255,.90)");
  g.addColorStop(.82, "rgba(255,255,255,.36)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  x.fillStyle = g;
  x.fillRect(0, 0, 256, 256);
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  return t;
}

/**
 * Nieboskłon — czworokąt na PEŁNY EKRAN, rysowany w przestrzeni odcięcia.
 *
 * Dlaczego nie `scene.background`: tło sceny to jedna płaska barwa, a concept
 * art ma gradient — jaśniej przy horyzoncie, ciemniej w zenicie. Wierzchołki
 * dostają `gl_Position` wprost, więc kadr, zoom ani obrót kamery nic tu nie
 * zmieniają, a mesh nie potrzebuje żadnej obsługi przy zmianie rozmiaru okna.
 */
function nieboskLon() {
  const mat = new ShaderMaterial({
    uniforms: { zenit: { value: new Color(0x243147) }, horyzont: { value: new Color(0x2f4a78) }, noc: { value: 0 }, aspekt: { value: 1 } },
    vertexShader: `
      varying vec2 vu;
      void main() { vu = uv; gl_Position = vec4(position.xy, 0.9999, 1.0); }
    `,
    fragmentShader: `
      uniform vec3 zenit;
      uniform vec3 horyzont;
      uniform float noc;
      uniform float aspekt;
      varying vec2 vu;
      void main() {
        // Horyzont jest nisko — stąd przesunięcie i potęga, a nie liniowy mix.
        float h = smoothstep(0.48, 1.0, vu.y);
        vec3 sky = mix(horyzont, zenit, h);
        // BEZ CHMUR. Obloki sa brylami 3D (chmury.js) wiszacymi przed
        // nieboskLonem - malowanie ich tutaj dawalo plaskie plamy bez
        // objetosci i dublowalo te prawdziwe. NieboskLon to sam gradient.
        // (Uwaga: to wnetrze szablonu JS - zadnych odwroconych apostrofow.)
        // Stable sparse stars, independent of viewport resolution and camera zoom.
        vec2 cells = vec2(vu.x*aspekt,vu.y)*38.0;
        vec2 id = floor(cells);
        float seed = fract(sin(dot(id,vec2(127.1,311.7)))*43758.5453);
        vec2 point = fract(cells)-vec2(.3+seed*.4,.5);
        float star = (1.0-smoothstep(.025,.075,length(point))) * step(.965,seed);
        sky += vec3(.75,.83,1.0)*star*noc*smoothstep(.6,.8,vu.y);
        gl_FragColor = vec4(sky, 1.0);
        #include <colorspace_fragment>
      }
    `,
    depthTest: false,
    depthWrite: false,
    toneMapped: false,
  });
  const m = new Mesh(new PlaneGeometry(2, 2), mat);
  m.frustumCulled = false;
  m.renderOrder = -2000;
  m.name = "nieboskLon";
  return m;
}

export class Doba {
  /**
   * @param {object} o
   *   scena, slonce, wypelnienie, hemisfera, ambient, gwiazdy — obiekty ze sceny
   *   slonceN — Vector3 jednostkowy: punkt planety, nad którym stoi słońce
   *   strojenie — nadpisania z `mapa.json` (`swiat.doba`)
   */
  constructor(o) {
    this.C = scal(DOBA, o.strojenie);
    this.scena = o.scena;
    this.slonce = o.slonce;
    this.wypelnienie = o.wypelnienie;
    this.hemisfera = o.hemisfera;
    this.ambient = o.ambient;
    this.gwiazdy = o.gwiazdy;
    this.ziemia = o.ziemia || null;
    this.slonceN = o.slonceN.clone().normalize();
    this._sw = this.slonceN.clone();
    this._orbita = new Vector3();
    this.ustawSlonce(this.slonceN);
    this.faza = null;

    this.nieboskLon = nieboskLon();
    this.scena.add(this.nieboskLon);

    const C = this.C;
    const sprit = (tex, rozmiar) => {
      const s = new Sprite(new SpriteMaterial({
        map: tex, transparent: true, depthWrite: false, opacity: 0, toneMapped: false,
        // depthTest ZOSTAJE — dzięki temu planeta zasłania zachodzące słońce.
      }));
      s.scale.setScalar(rozmiar);
      s.renderOrder = -1000;
      return s;
    };
    this.rdzenSlonca = sprit(teksturaSlonca(), C.slonceTarcza.wielkosc);
    this.poswiata = sprit(teksturaTarczy("#ffffff", "#ffffff"), C.slonceTarcza.wielkosc * 2.2);
    this.tarczaKsiezyca = sprit(teksturaKsiezyca(), C.ksiezyc.wielkosc);
    // Start bez animacji: pierwsza klatka ma od razu właściwe światło.
    this.t = null;
    this.stan = { t: 0, dzien: 1, noc: 0, zorza: 0, pora: "dzien" };
  }

  /**
   * Ciała niebieskie wiszą w PRZESTRZENI KAMERY, nie w świecie.
   *
   * Kamera jest ortograficzna: odległość niczego nie pomniejsza, a wszystko
   * poza pudełkiem kadru (±7 jednostek) jest po prostu poza ekranem. Słońce
   * postawione „daleko w kierunku słońca" nigdy by się nie pokazało. Zamiast
   * tego rzutujemy kierunek słońca na osie kamery i kładziemy sprite w kadrze,
   * na głębokości większej niż planeta — przez co planeta zasłania je, gdy
   * słońce zachodzi za jej krawędzią.
   */
  podepnijDoKamery(camera) {
    camera.add(this.rdzenSlonca, this.poswiata, this.tarczaKsiezyca);
    this.kamera = camera;
  }

  /** Kładzie sprite w kadrze wg kierunku `dir` (świat), na głębokości `z`. */
  _wKadrze(sprite, dir, W, H, z) {
    sprite.position.set(dir.dot(_px) * W * 0.78, H * (0.54 + 0.30 * dir.y), z);
  }

  /** Przestawia słońce nad inny punkt planety (np. na potrzeby fabuły). */
  ustawSlonce(n) {
    this.slonceN.copy(n).normalize();
    // Stały południk mapy, niezależny od obrotu kamery i kierunku spojrzenia.
    this._orbita.set(0, 0, 1).addScaledVector(this.slonceN, -this.slonceN.z);
    if (this._orbita.lengthSq() < 1e-8) this._orbita.set(1, 0, 0);
    this._orbita.normalize();
  }

  /**
   * @param {Vector3} hn normalna bohatera (układ planety)
   * @param {Quaternion} qPlanety obrót grupy planety — potrzebny, żeby
   *   przeliczyć kierunek słońca na układ świata, w którym stoją światła
   * @param {number} dt sekundy od poprzedniej klatki
   * @returns {string} nazwa pory dnia: "dzien" | "zmierzch" | "noc"
   */
  aktualizuj(hn, qPlanety, dt = 0.016) {
    const C = this.C;
    const along = hn.dot(this._orbita);
    const above = hn.dot(this.slonceN);
    const cel = Math.hypot(along, above) > 1e-6
      ? Math.atan2(along, above) : (this.faza ?? 0);
    if (this.faza === null || this.t === null) this.faza = cel;
    else {
      const delta = Math.atan2(Math.sin(cel-this.faza), Math.cos(cel-this.faza));
      this.faza += dogon(0, delta, C.tempo, dt);
    }
    const faza = Math.atan2(Math.sin(this.faza), Math.cos(this.faza));
    // Monotoniczne spowolnienie wokół prawego horyzontu; bez skoku na północy.
    const luk = faza > 0
      ? faza + zacisk(C.slonceTarcza.spowolnienieZachodu, 0, .45) * Math.sin(2*faza)
      : faza;
    const t = this.t = Math.cos(luk);
    const dzien = gladko(C.progi.switOd, C.progi.switDo, t);
    const noc = 1 - gladko(C.progi.nocOd, C.progi.switOd + 0.10, t);
    const u = (t - C.progi.zorzaSrodek) / C.progi.zorzaSzerokosc;
    const zorza = Math.exp(-u * u);
    const poranek = 1 - gladko(-.2, .2, Math.sin(luk));
    if (this.kamera) this.kamera.matrixWorld.extractBasis(_px, _py, _pz);
    this._sw.set(_px.x, 0, _px.z).normalize().multiplyScalar(Math.sin(luk));
    this._sw.y = t;

    // ŚWIATŁO SŁONECZNE. Kierunek bierzemy z układu planety i przenosimy do
    // świata — dzięki temu cień bohatera kładzie się w prawą stronę, a nisko
    // stojące słońce naprawdę świeci z boku, nie z góry.
    this.slonce.position.copy(this._sw).multiplyScalar(30);
    this.slonce.intensity = C.slonce.moc * Math.max(dzien, zorza * 0.6);
    this.slonce.color.copy(_a.set(C.slonce.zorza)).lerp(_b.set(C.slonce.dzien), dzien);

    // WYPEŁNIENIE zmienia się w księżyc: chłodne i słabe, ale nigdy zgaszone —
    // po ciemku to ono trzyma sylwetkę bohatera czytelną.
    this.wypelnienie.intensity = C.wypelnienie.mocNoc + (C.wypelnienie.mocDzien - C.wypelnienie.mocNoc) * dzien + zorza * (0.5 + 0.35 * poranek);
    this.wypelnienie.color.copy(_a.set(C.wypelnienie.noc)).lerp(_b.set(C.wypelnienie.dzien), dzien);

    // Światło rozproszone nigdy nie schodzi poniżej `mocNoc` — to ono trzyma
    // ziemię czytelną po ciemku. Przy samym terminatorze dokładamy do niego
    // ciepło zorzy, żeby zmierzch był pomarańczowy, a nie po prostu ciemny.
    this.hemisfera.intensity = C.hemisfera.mocNoc + (C.hemisfera.mocDzien - C.hemisfera.mocNoc) * dzien + zorza * .65;
    this.hemisfera.color.copy(_a.set(C.hemisfera.goraNoc)).lerp(_b.set(C.hemisfera.goraDzien), dzien);
    if (C.hemisfera.zorzaGora) {
      this.hemisfera.color.lerp(_b.set(C.hemisfera.zorzaGora), zorza * (1 - 0.6 * dzien) * 0.35);
    }
    this.hemisfera.groundColor.copy(_a.set(C.hemisfera.dolNoc)).lerp(_b.set(C.hemisfera.dolDzien), dzien);

    this.ambient.intensity = C.ambient.mocNoc + (C.ambient.mocDzien - C.ambient.mocNoc) * dzien;
    this.ambient.color.copy(_a.set(C.ambient.noc)).lerp(_b.set(C.ambient.dzien), dzien);

    // NIEBO. Najpierw noc → dzień, potem dokładamy pomarańcz przy samym
    // terminatorze. Kolejność ma znaczenie: zorza ma palić się NAD nocą,
    // inaczej zmierzch wyszedłby bladoniebieski.
    if (this.scena.background) {
      this.scena.background
        .copy(_a.set(C.niebo.noc))
        .lerp(_b.set(C.niebo.dzien), dzien)
        .lerp(_b.set(C.niebo.zorza), zorza * (1 - 0.55 * dzien) * C.niebo.silaZorzy);
    }

    // NIEBOSKŁON — gradient od horyzontu do zenitu, mieszany tak samo jak
    // płaska barwa tła: najpierw noc → dzień, potem zorza na wierzchu.
    if (this.nieboskLon) {
      const u = this.nieboskLon.material.uniforms;
      const zorzaN = zorza * (1 - 0.55 * dzien) * C.niebo.silaZorzy;
      u.noc.value = noc;
      u.aspekt.value = this.kamera ? (this.kamera.right-this.kamera.left)/(this.kamera.top-this.kamera.bottom) : 1;
      u.zenit.value.copy(_a.set(C.niebo.zenitNoc)).lerp(_b.set(C.niebo.zenitDzien), dzien)
        .lerp(_b.set(C.niebo.zenitZorza).lerp(_c.set(C.niebo.zenitPoranek), poranek), zorzaN);
      u.horyzont.value.copy(_a.set(C.niebo.horyzontNoc)).lerp(_b.set(C.niebo.horyzontDzien), dzien)
        .lerp(_b.set(C.niebo.horyzontZorza).lerp(_c.set(C.niebo.horyzontPoranek), poranek), zorzaN);
    }

    // TEREN — sama tekstura zostaje, zmienia się mnożnik barwy. To dzięki
    // temu nocna trawa jest morska, a nie po prostu ciemnozielona.
    if (this.ziemia?.material) {
      const m = this.ziemia.material;
      m.color.copy(_a.set(C.ziemia.noc)).lerp(_b.set(C.ziemia.dzien), dzien)
        .lerp(_b.set(C.ziemia.zorza), zorza * (1 - 0.5 * dzien) * 0.7);
      if (m.emissive) {
        m.emissive.copy(_a.set(0x000000)).lerp(_b.set(C.ziemia.emisjaNoc), noc)
          .lerp(_b.set(C.ziemia.emisjaZorza), zorza * (1 - dzien) * 0.6);
      }
    }

    // SŁOŃCE I KSIĘŻYC w kadrze.
    if (this.kamera) {
      const k = this.kamera;
      k.matrixWorld.extractBasis(_px, _py, _pz); // prawo, góra, „ku widzowi"
      const W = ((k.right - k.left) / 2) / (k.zoom || 1);
      const H = ((k.top - k.bottom) / 2) / (k.zoom || 1);
      // Elipsa w kadrze: lewy horyzont → środek wysoko → prawy horyzont.
      const x = Math.sin(luk) * W * .76;
      const y = H * (.46 + .35 * Math.cos(luk));
      this.rdzenSlonca.position.set(x, y, -50);
      this.poswiata.position.set(x, y, -50.5);
      // Zachód zostaje złoty i widoczny aż tarcza schowa się za planetą.
      this.rdzenSlonca.material.opacity = gladko(-0.36, -0.12, t) * (0.94 - 0.12 * dzien);
      this.rdzenSlonca.material.color.set(0xffeb79).lerp(_b.set(C.slonceTarcza.rdzen), dzien);
      this.rdzenSlonca.scale.setScalar(C.slonceTarcza.wielkosc * (1.0 + 0.18 * zorza));
      this.poswiata.material.opacity = Math.max(dzien * 0.48, zorza * 0.46) * gladko(-0.42, -0.16, t);
      this.poswiata.material.color.copy(_a.set(C.slonceTarcza.poswiataZorza))
        .lerp(_b.set(C.slonceTarcza.poswiataDzien), dzien);
      this.poswiata.scale.setScalar(C.slonceTarcza.wielkosc * (2.7 + C.slonceTarcza.rozmycieZorzy * zorza));

      // Księżyc stoi naprzeciw słońca — czyli tam, gdzie w dzień go nie ma.
      this.tarczaKsiezyca.position.set(-x * .92, H * (.46 - .35 * Math.cos(luk)), -50);
      this.tarczaKsiezyca.material.opacity = noc * 0.95;
      this.tarczaKsiezyca.visible = noc > 0.02;
    }

    // CHMURY — gradient w wierzchołkach zostaje, zmienia się mnożnik.
    // O zachodzie krawędzie i tak zapalają się same, bo to prawdziwe bryły
    // stojące w prawdziwym świetle.
    for (const m of this.chmuryMaterialy || []) {
      m.color.copy(_a.set(C.chmury.noc)).lerp(_b.set(C.chmury.dzien), dzien)
        .lerp(_b.set(C.chmury.zorza), zorza * (1 - 0.45 * dzien) * 0.85);
      if (m.emissive) m.emissive.copy(_a.set(C.chmury.emisjaNoc)).lerp(_b.set(0xc4d9ed), dzien).lerp(_b.set(0xc69685), zorza * .75);
    }

    if (this.gwiazdy) {
      const krycie = C.gwiazdy.krycie * noc;
      this.gwiazdy.material.opacity = krycie;
      this.gwiazdy.visible = krycie > 0.02;
    }

    const pora = noc > 0.55 ? "noc" : zorza > 0.35 ? (poranek > 0.5 ? "poranek" : "zmierzch") : "dzien";
    this.stan = { t, dzien, noc, zorza, pora, faza, luk };
    return pora;
  }
}
