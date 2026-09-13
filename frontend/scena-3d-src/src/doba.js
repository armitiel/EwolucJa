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
  CanvasTexture, SRGBColorSpace, Vector3, Vector4,
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
  // TRZY przystanki, nie dwa: zenit, środek, horyzont. Dwa wystarczały na
  // dzień, ale zachód z concept artu ma fiolet u góry, róż w środku i
  // pomarańcz przy ziemi — liniowe przejście fiolet→pomarańcz daje brud,
  // a nie zachód.
  niebo: {
    // płaska barwa `scene.background` — widać ją tylko tam, gdzie nie sięga
    // nieboskłon; zostaje dla bezpieczeństwa
    dzien: 0x8fc9e4, zorza: 0xd98a5e, noc: 0x243147, silaZorzy: 1.0,

    /**
     * CZTERY przystanki na fazę i wszystkie W WIDOCZNYM PASIE.
     *
     * Pierwsza wersja rozpinała gradient od 0,26 do 0,98 wysokości kadru,
     * ale planeta zasłania dolne ~55% — więc dwie trzecie przejścia działy
     * się za nią i na ekranie zostawał jeden płaski kolor. W concept arcie
     * CAŁY przebieg barw mieści się nad horyzontem: przy ziemi złoto, wyżej
     * koral, potem róż, a dopiero na górze fiolet albo błękit.
     *
     * `stopnie` to UŁAMKI WIDOCZNEGO NIEBA, liczone od linii horyzontu:
     * 0 to sama krawędź planety, 1 to górna ramka kadru. Shader dzieli
     * odległość od sylwetki przez tę, jaka zostaje do góry ekranu, więc
     * ten sam zestaw progów daje ten sam obraz na telefonie w pionie
     * (dużo nieba) i na szerokim ekranie (mało nieba).
     *
     * Wcześniej progi były w PROMIENIACH PLANETY i to była pułapka: na
     * telefonie planeta zajmuje dół kadru, nieba jest trzy razy więcej,
     * a cały przebieg barw i tak kończył się tuż nad horyzontem — zostawał
     * wąski tęczowy pasek i płaski błękit nad nim.
     */
    // UWAGA na skalę: planeta jest OGROMNA w kadrze (jej promień to ok. 2,6
    // wysokości pół-kadru), więc od krawędzi do górnej ramki jest tylko
    // ~0,1 promienia. Progi rzędu 0,4 czy 1,0 wypychały trzy z czterech
    // barw poza ekran i zostawał jeden płaski pomarańcz.
    stopnie: [0.0, 0.16, 0.42, 1.0],
    gradient: {
      dzien:   { horyzont: 0xdceef7, nisko: 0xa9d8f0, srodek: 0x6bb6e4, zenit: 0x3d93d6 },
      poranek: { horyzont: 0xffe3b8, nisko: 0xfbbfa0, srodek: 0xf3a9be, zenit: 0x9cc4e4 },
      zorza:   { horyzont: 0xffc46b, nisko: 0xf98e6b, srodek: 0xd97ba6, zenit: 0x8878a8 },
      noc:     { horyzont: 0x2e5f82, nisko: 0x27467a, srodek: 0x1b2f5e, zenit: 0x131f47 },
    },
  },
  // Miękki rdzeń i niezależna poświata: mleczne południe, złoty zachód.
  slonceTarcza: {
    rdzen: 0xfffdf2, poswiataDzien: 0xffe9a8, poswiataZorza: 0xff9b45,
    wielkosc: 0.95, rozmycieZorzy: 0.7,
    spowolnienieHoryzontu: 0.35, // 0–0.45; 0.35 daje 30% tempa przy horyzoncie, 170% w zenicie
    // Tor tarczy (patrz `wKadrze`): jak daleko w bok sięga w jednostkach
    // RAMKI (1,0 = krawędź ekranu), jak wysoko wchodzi w południe
    // i jak głęboko zanurza się w horyzont przy samym zachodzie.
    zasiegX: 0.93,
    szczyt: 0.48,
    zanurzenie: 0.05,
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
  /**
   * SPRAWDZONE 13.09: ściszanie świateł NIE usuwa metalicznego połysku.
   * Materiał terenu to Lambert — bez odbić — a połysk to złudzenie: nasycenie
   * spada razem ze wzrostem jasności, więc ściany w słońcu blakną, a te
   * w cieniu zostają soczyste. Zmierzone w renderze (średnie z ~50 tys.
   * pikseli terenu): przy mocy 1,8 średnie nasycenie 0,469, przy 1,45 — 0,470.
   * Bez różnicy; scena tylko ściemniała o 11%. Prawdziwą dźwignią jest ALBEDO,
   * nie światło — patrz `swiat.kreda` w mapa.js. Autor odrzucił tamten wariant
   * jako zmianę koloru, więc moce wracają na swoje. Nie próbuj tego drugi raz.
   */
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
  /**
   * Progi w STOPNIACH FAZY — czyli kąta od zenitu słońca liczonego wprost
   * z pozycji bohatera (`faza`), a NIE z przegiętego `luk`.
   *
   * Dwa razy się już na tym przejechaliśmy, więc po kolei:
   *
   * 1. Najpierw fazy liczyły się z `t = cos(kąt)`. `dt/dkąt = −sin(kąt)` jest
   *    największe dokładnie przy terminatorze, więc świt i zachód przelatywały
   *    najszybciej właśnie tam, gdzie mają trwać. Stąd przejście na stopnie.
   * 2. Potem stopnie brały się z `luk`, czyli z fazy PO przegięciu
   *    (`spowolnienieHoryzontu`). A przegięcie istnieje po to, żeby TARCZA
   *    zwalniała przy horyzoncie — przy okazji rozciągało zmierzch i zjadało
   *    dzień z nocą. Zmierzone: zamiast deklarowanych 23/56/21 wychodziło
   *    14/72/13, a szczyt pomarańczy wypadał nie na terminatorze, tylko
   *    ~11° za nim.
   *
   * Dlatego TARCZA dalej chodzi po `luk` (zachód ma prawo się dłużyć), a PORY
   * DNIA liczą się z `faza`. Przegięcie jest zerowe w 0°, ±90° i ±180°, więc
   * terminator wypada w obu układach w tym samym miejscu — rozjeżdżały się
   * tylko odcinki pomiędzy.
   *
   * Podział doby wzdłuż drogi (jedno okrążenie = 360° fazy), po etykiecie
   * `pora`, którą dostaje reszta sceny:
   *   0–63°    dzień                35% okrążenia
   *   63–117°  świt / zmierzch      30% (po 15% na stronę)
   *   117–180° noc                  35%
   * Strefy pełnego światła są węższe niż etykiety: `dzien` = 1 do 52°
   * (29% doby), `noc` = 1 od 140° (22%).
   *
   * W świecie W2 (R = 8,5) okrążenie to 38,7 s marszu — czyli dzień ~13,5 s,
   * jeden zmierzch ~5,8 s, noc ~13,6 s. Biegiem wszystko 2,5× krócej.
   *
   * Granicę dnia wyznacza `zorza > 0,35`, a granicę nocy `noc > 0,55`
   * (patrz `pora` niżej). Przy zmianie progów sprawdź, czy noc zapala się
   * ZANIM zgaśnie zorza — inaczej między nimi robi się szczelina, w której
   * etykieta wraca na „dzien" w środku nocy.
   */
  progi: {
    dzienDo: 52,        // poniżej — pełny dzień
    zmierzchDo: 98,     // powyżej — dnia już nie ma
    nocOd: 90,          // powyżej — noc zaczyna narastać (od terminatora)
    nocPelna: 140,      // powyżej — pełna noc
    zorzaSrodek: 90,    // szczyt pomarańczy = słońce dotyka horyzontu
    zorzaSzerokosc: 26.4,
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
const _sr = new Vector3();   // rzut srodka planety do NDC (nieboskLon)
const _tor = { x: 0, y: 0 };  // pozycja slonca w kadrze
const _torK = { x: 0, y: 0 }; // pozycja ksiezyca w kadrze


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
    uniforms: {
      zenit: { value: new Color(0x243147) }, srodek: { value: new Color(0x2a3f63) },
      nisko: { value: new Color(0x2c4670) }, horyzont: { value: new Color(0x2f4a78) },
      stopnie: { value: new Vector4(0.0, 0.16, 0.42, 1.0) },
      srodekPlanety: { value: new Vector4(0, 0, 1, 1) }, // xy = środek NDC, zw = promienie NDC
      wysokoscNieba: { value: 0.4 },  // ile zostaje od horyzontu do górnej ramki
      noc: { value: 0 }, aspekt: { value: 1 },
    },
    vertexShader: `
      varying vec2 vu;
      void main() { vu = uv; gl_Position = vec4(position.xy, 0.9999, 1.0); }
    `,
    fragmentShader: `
      uniform vec3 zenit;
      uniform vec3 srodek;
      uniform vec3 nisko;
      uniform vec3 horyzont;
      uniform vec4 stopnie;
      uniform vec4 srodekPlanety;
      uniform float wysokoscNieba;
      uniform float noc;
      uniform float aspekt;
      varying vec2 vu;
      void main() {
        // WYSOKOSC LICZONA OD HORYZONTU, nie od dolu ekranu.
        // Planeta jest kula w srodku ukladu, wiec w rzucie ortograficznym
        // jej sylwetka to elipsa o znanym srodku i promieniach. Odleglosc
        // fragmentu od tej elipsy (w jej promieniach) daje "ile nad
        // horyzontem" - i to wlasnie po tym idzie gradient. Cieply pas
        // trzyma sie wtedy krawedzi planety na calej szerokosci, tak jak
        // na concept arcie, i nie zalezy od zoomu ani od tego, ile kadru
        // planeta zajmuje.
        vec2 q = (vu * 2.0 - 1.0 - srodekPlanety.xy) / srodekPlanety.zw;
        // Odleglosc od sylwetki, ZNORMALIZOWANA przez to, ile nieba w ogole
        // widac. Dzieki temu 1.0 to zawsze gorna ramka kadru, niezaleznie
        // od tego, czy telefon stoi w pionie, czy ekran jest szeroki.
        float h = clamp((length(q) - 1.0) / max(wysokoscNieba, 0.001), 0.0, 1.6);
        vec3 sky = horyzont;
        sky = mix(sky, nisko,  smoothstep(stopnie.x, stopnie.y, h));
        sky = mix(sky, srodek, smoothstep(stopnie.y, stopnie.z, h));
        sky = mix(sky, zenit,  smoothstep(stopnie.z, stopnie.w, h));
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

  /**
   * Sylwetka planety w NDC i ile nieba zostaje nad nią.
   *
   * Kamera jest ortograficzna, a planeta to kula w środku układu, więc jej
   * obrys to elipsa o znanym środku (rzut zera) i promieniach (R podzielone
   * przez połowę kadru). `niebo` to odległość od tej elipsy do górnej ramki,
   * mierzona w jej własnych promieniach — jedna liczba, z której korzystają
   * i gradient nieba, i tor słońca.
   */
  _sylwetka(k, W, H) {
    _sr.set(0, 0, 0).project(k);
    const rx = (this.promienPlanety || 8) / W;
    const ry = (this.promienPlanety || 8) / H;
    return { cx: _sr.x, cy: _sr.y, rx, ry, niebo: Math.max(0.02, (1 - _sr.y) / ry - 1) };
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
    // ZNAK ustala, w ktora strone plynie doba. Ujemny sprawia, ze faza
    // ROSNIE w miare wedrowki: dzien zaczyna sie ze sloncem po LEWEJ
    // (faza < 0, wschod), przechodzi przez zenit i konczy sie po PRAWEJ
    // (faza > 0, zachod). Ten sam znak odwraca cienie i kolejnosc barw
    // nieba, wiec tarcza, swiatlo i zorza zostaja po tej samej stronie.
    const along = -hn.dot(this._orbita);
    const above = hn.dot(this.slonceN);
    const cel = Math.hypot(along, above) > 1e-6
      ? Math.atan2(along, above) : (this.faza ?? 0);
    if (this.faza === null || this.t === null) this.faza = cel;
    else {
      const delta = Math.atan2(Math.sin(cel-this.faza), Math.cos(cel-this.faza));
      this.faza += dogon(0, delta, C.tempo, dt);
    }
    const faza = Math.atan2(Math.sin(this.faza), Math.cos(this.faza));
    /**
     * ZWOLNIENIE PRZY HORYZONCIE. Chcemy, żeby wschód i zachód trwały dłużej
     * niż przejście przez zenit, więc czas doby jest przeginany:
     *
     *   luk = faza + k * sin(2 * faza)        d(luk)/d(faza) = 1 + 2k * cos(2 * faza)
     *
     * Przy horyzoncie (faza = ±90°) cosinus to −1, więc tarcza idzie z tempem
     * 1 − 2k; w południe i o północy 1 + 2k. Przy k = 0,35 to 30% i 170%.
     *
     * Wcześniej przegięcie działało TYLKO dla faza > 0. Wartość się zgadzała
     * (sin(2·0) = 0, sin(2π) = 0), ale POCHODNA nie: dokładnie w zenicie i w
     * nadirze tempo skakało z 1 na 1,7 — i to było widać jako szarpnięcie
     * słońca i księżyca w połowie drogi. Ta sama formuła na całym okręgu jest
     * gładka wszędzie, a przy okazji wydłuża tak samo wschód jak zachód.
     *
     * Monotoniczność (tarcza nigdy nie cofa się na niebie) wymaga k < 0,5 —
     * stąd zacisk na 0,45.
     */
    const luk = faza + zacisk(C.slonceTarcza.spowolnienieHoryzontu, 0, .45) * Math.sin(2 * faza);
    const t = this.t = Math.cos(luk);
    // KĄT od zenitu słońca w stopniach — to on, a nie `t`, rządzi fazami.
    // Z `faza`, NIE z `luk`: przegięcie jest po to, żeby zwalniała TARCZA,
    // a nie po to, żeby zmierzch zjadał dzień i noc (patrz `DOBA.progi`).
    const st = Math.abs(faza) * 180 / Math.PI;
    const dzien = 1 - gladko(C.progi.dzienDo, C.progi.zmierzchDo, st);
    const noc = gladko(C.progi.nocOd, C.progi.nocPelna, st);
    const u = (st - C.progi.zorzaSrodek) / C.progi.zorzaSzerokosc;
    const zorza = Math.exp(-u * u);
    // Znak `luk` rozstrzyga, po której stronie słońca stoimy: ujemny to
    // strona, z której słońce wschodzi.
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
      const G = C.niebo.gradient;
      const st4 = C.niebo.stopnie;
      u.stopnie.value.set(st4[0], st4[1], st4[2], st4[3]);
      // Sylwetka planety w NDC: kamera ortograficzna, kula w środku układu,
      // więc środek to rzut zera, a promienie to R podzielone przez połowę
      // kadru. `promienPlanety` podajemy z zewnątrz (app.js zna `planeta.R`).
      if (this.kamera && this.promienPlanety) {
        const k = this.kamera;
        const W = ((k.right - k.left) / 2) / (k.zoom || 1);
        const H = ((k.top - k.bottom) / 2) / (k.zoom || 1);
        const g2 = this._sylwetka(k, W, H);
        u.srodekPlanety.value.set(g2.cx, g2.cy, g2.rx, g2.ry);
        u.wysokoscNieba.value = g2.niebo;
      }
      // Ta sama recepta dla każdego przystanka: noc → dzień, a na wierzch
      // zorza, która po wschodniej stronie jest różowo-brzoskwiniowa,
      // a po zachodniej pomarańczowo-fioletowa.
      for (const klucz of ["horyzont", "nisko", "srodek", "zenit"]) {
        u[klucz].value.copy(_a.set(G.noc[klucz])).lerp(_b.set(G.dzien[klucz]), dzien)
          .lerp(_b.set(G.zorza[klucz]).lerp(_c.set(G.poranek[klucz]), poranek), zorzaN);
      }
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
      const g = this._sylwetka(k, W, H);

      /**
       * TOR SŁOŃCA — w POZIOMIE mierzony RAMKĄ, w PIONIE horyzontem.
       *
       * Poprzednia wersja szła po okręgu wokół planety, w jej promieniach —
       * a sylwetka planety jest znacznie szersza od ekranu (na telefonie
       * jej promień to ok. 3 połówki kadru). Słońce wylatywało więc poza
       * ramkę na długo przed zachodem i po prostu znikało.
       *
       * Teraz:
       *  • POZIOM: `sin(faza)` razy `zasiegX` w jednostkach RAMKI — ze
       *    ZNAKIEM fazy, ktora rosnie w ciagu dnia: wschod po LEWEJ,
       *    zachod po PRAWEJ. Przy
       *    0,93 tarcza w skrajach chowa się ledwie za krawędź ekranu —
       *    więc słońce widać przez całą dobę, a wschód i zachód dzieją się
       *    przy bokach kadru.
       *  • PION: najpierw znajdujemy, gdzie DOKŁADNIE POD SŁOŃCEM leży
       *    horyzont (elipsa sylwetki), a potem podnosimy tarczę o ułamek
       *    nieba, jakie w tym miejscu zostaje do górnej ramki.
       *
       * Dzięki temu tarcza wstaje z linii horyzontu i tam wraca, niezależnie
       * od proporcji ekranu — a przy samym zachodzie chowa się za nią do
       * połowy, zamiast gasnąć w powietrzu.
       */
      const wzniesienie = (kat) => C.slonceTarcza.szczyt * Math.cos(kat) - C.slonceTarcza.zanurzenie;
      const wKadrze = (kat, wynik) => {
        const xn = Math.sin(kat) * C.slonceTarcza.zasiegX;
        // Wysokość horyzontu pod tym miejscem — z równania elipsy sylwetki.
        const pod = 1 - Math.min(1, ((xn - g.cx) * (xn - g.cx)) / (g.rx * g.rx));
        const yH = g.cy + g.ry * Math.sqrt(Math.max(0, pod));
        wynik.x = xn * W;
        wynik.y = (yH + Math.max(0, 1 - yH) * wzniesienie(kat)) * H;
        return wynik;
      };
      const poz = wKadrze(luk, _tor);
      const x = poz.x;
      this.rdzenSlonca.position.set(poz.x, poz.y, -50);
      this.poswiata.position.set(poz.x, poz.y, -50.5);
      // Zachód zostaje złoty i widoczny aż tarcza schowa się za planetą.
      // Gaśnie dopiero GŁĘBOKO pod horyzontem — do tego czasu tarczę
      // zasłania sama planeta, a nie przezroczystość.
      this.rdzenSlonca.material.opacity = gladko(-0.52, -0.2, t) * (0.94 - 0.12 * dzien);
      this.rdzenSlonca.material.color.set(0xffeb79).lerp(_b.set(C.slonceTarcza.rdzen), dzien);
      this.rdzenSlonca.scale.setScalar(C.slonceTarcza.wielkosc * (1.0 + 0.18 * zorza));
      this.poswiata.material.opacity = Math.max(dzien * 0.48, zorza * 0.46) * gladko(-0.58, -0.24, t);
      this.poswiata.material.color.copy(_a.set(C.slonceTarcza.poswiataZorza))
        .lerp(_b.set(C.slonceTarcza.poswiataDzien), dzien);
      this.poswiata.scale.setScalar(C.slonceTarcza.wielkosc * (2.7 + C.slonceTarcza.rozmycieZorzy * zorza));

      // Księżyc stoi naprzeciw słońca — ten sam tor, przesunięty o pół doby.
      const pozK = wKadrze(luk + Math.PI, _torK);
      this.tarczaKsiezyca.position.set(pozK.x, pozK.y, -50);
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
