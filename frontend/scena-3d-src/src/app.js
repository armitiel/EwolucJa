/*!
 * SPDX-FileCopyrightText: © 2026 Amitiel Angelisme <armitiel@gmail.com>
 * SPDX-License-Identifier: LicenseRef-EwolucJA-Proprietary
 *
 * EwolucJA — gra edukacyjna dla dzieci.
 * Produkt powstał w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”;
 * autorskie prawa majątkowe pozostają przy autorze. Licencja: LICENSE.
 */
/**
 * app.js — rdzeń sceny: renderer, kamera, bohater, sterowanie, znaki, kino.
 *
 * KULA. Świat (`this.swiat`) to grupa obracana kwaternionem tak, żeby punkt
 * mapy, w którym stoi bohater, znalazł się u góry (+Y świata). Obrót goni
 * bohatera z opóźnieniem (`TEMPO_OBROTU`), więc lisek ma „mały margines"
 * własnego ruchu po ekranie, a planeta dogania go płynnie. Kamera jest
 * NIERUCHOMA (ortograficzna, izometryczna), patrzy na wierzchołek kuli.
 *
 * Cała logika pozycji — `this.hp` (x, z), kolizje, ścieżka, rzeka, znaki —
 * liczy się w PŁASKIM układzie mapy. Na kulę przenosi ją `Planeta`.
 */
import {
  WebGLRenderer, Scene, Color, HemisphereLight, DirectionalLight, AmbientLight, OrthographicCamera,
  Vector2, Vector3, Quaternion, Matrix4, Group, Mesh, RingGeometry, MeshBasicMaterial, MeshLambertMaterial, DoubleSide,
  Raycaster, Clock, AnimationMixer, AnimationUtils, LoopOnce, Box3, CanvasTexture, SRGBColorSpace,
  Sprite, SpriteMaterial,
  EquirectangularReflectionMapping, PMREMGenerator, SphereGeometry, CylinderGeometry, BoxGeometry, CircleGeometry, BackSide,
  ACESFilmicToneMapping, PCFSoftShadowMap, Points, PointsMaterial, BufferGeometry, Float32BufferAttribute,
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Planeta, stycznaDo, doStycznej, obrocStyczna, katMiedzy, przytnijDoPromienia } from "./planeta.js";
import { wczytajMape } from "./mapa.js";
import { zbudujSwiat, sosna, drzewoLisciaste, kamiennyPak, plamaCienia, taflaNaGruncie, punktNaGruncie, drzewoDomkowe, ukladDomku, DOMEK_DRZEWO, ZANURZENIE_DOMKU, MAT_PIEN_DOMKU, PALETA } from "./swiat.js";
import { stosDrewna, kamyczki, pieniek } from "./natura.js";
import { schronienie, LICZBA_ETAPOW } from "./schronienie.js";
import { Znak, krag, smugaKregu } from "./znak.js";
import { MokreSlady } from "./mokreslady.js";
import { postac } from "./postacie.js";
import { Doba } from "./doba.js";
import { Chmury } from "./chmury.js";
import { Swiatlo } from "./swiatlo.js";
import { Fasola, zbudujOczko, FASOLA } from "./fasola.js";
import { formyTerenu } from "./teren.js";
import { Dymki } from "./dymki.js";
import { Motyle } from "./motyle.js";

const DOTYK = typeof matchMedia !== "undefined" && matchMedia("(pointer:coarse)").matches;

/* ── stałe ruchu (jak w pierwotnej scenie) ──────────────────────────────────── */
/* Pięć sekund pracy. Trzy okazały się za krótkie: zanim dziecko zdążyło
   zauważyć, że lisek stanął i coś robi, było już po wszystkim. */
const CZAS_RABANIA = 5;

const SKALA_BOHATERA = 1.75;
const V_CHOD = 1.38;
const V_BIEG = 3.42;
const KLIP_CHOD = "walk";
const KLIP_BIEG = "run";
let trybBiegu = "clip";
const PROG_BIEG_WEJSCIE = 1.46;
const PROG_BIEG_WYJSCIE = 1.37;
const MAX_TEMPO_KLIPU = 2.6;
const POCHYLENIE_MAX = 0.13;
const POCHYLENIE_BIEG = -0.375;
const OS_POCHYLENIA = 0.55;
const MARTWA_STREFA = 0.14;
const PROG_TRZYMANIA = 0.45;
const CZAS_DO_BIEGU = 1.6;
const CZAS_ROZBIEGU = 1.25;
const KAT_ZMIANY_KIERUNKU = 1.7;
const MARGINES_KOLIZJI = 0.3;
const TINT_BOHATERA = 1.62;
const SELF_BOHATERA = 0.06;
const ENV_BOHATERA = 0.42;
const MOST_LUK = 0.3;
const MOST_POL_SZER = 1;
const MOST_PLASKI = 1.3;
const MOST_POL_DL = 2.1;
const DL_KROKU_CHOD = 0.517 * SKALA_BOHATERA;
const DL_KROKU_BIEG = 1.33 * SKALA_BOHATERA;
const KOSCI_KORZENIA = new Set(["Root", "Hip", "Pelvis"]);
const KLAWISZE = {
  ArrowUp: [0, 1], KeyW: [0, 1], ArrowDown: [0, -1], KeyS: [0, -1],
  ArrowLeft: [-1, 0], KeyA: [-1, 0], ArrowRight: [1, 0], KeyD: [1, 0],
};
const MAPA_KLIPOW_DOMYSLNA = { NlaTrack: "walk", "NlaTrack.001": "run", "NlaTrack.002": "idle", "NlaTrack.003": "happy" };

/** Tempo, z jakim planeta dogania bohatera (im mniej, tym większy margines ruchu). */
const TEMPO_OBROTU = 3.2;
// Podczas podglądu miejsca planeta obraca się WOLNIEJ niż zwykle: to ma być
// pokazanie, a nie szarpnięcie. Przy 3.2 przeskok na drugi koniec polany
// wyglądał jak błąd renderowania.
const TEMPO_PODGLADU = 1.7;
/** Tempo dokręcania mapy „północą do góry" (patrz `korektaPolnocy`). */
const KOREKTA_W_RUCHU = 0.45;
const KOREKTA_W_SPOCZYNKU = 1.1;
/** Domyślne przybliżenie kamery (1 = kadr pierwotnej sceny; mniej = dalej). */
const ZOOM_DOMYSLNY = 0.8;
/**
 * Ile kadru musi zostać NAD bohaterem, w promieniach planety — patrz `resize()`.
 * Horyzont (krawędź sylwetki kuli) leży jakieś 0,32 R nad liskiem, reszta to
 * niebo ze słońcem i księżycem. Mierzymy nad BOHATEREM, a nie całą wysokość
 * kadru, bo to, gdzie lisek stoi w kadrze, zmienia się z orientacją ekranu.
 * Uwaga przy strojeniu: w poziomie lisek nie może zejść za nisko, bo dolne
 * ćwierć ekranu zajmuje dok z przyciskami.
 */
const NIEBO_NAD_BOHATEREM = 0.573;
/**
 * To samo dla ekranu POZIOMEGO. Niżej niż w pionie, bo w niskim kadrze każdy
 * promień nieba kosztuje bardzo dużo liska. 0,50 zostawia pas nieba mniej
 * więcej na jedną ósmą wysokości ekranu — dość, żeby widać było słońce,
 * księżyc i zmianę barw, ale bez połowy ekranu błękitu.
 */
const NIEBO_NAD_BOHATEREM_POZIOM = 0.5;
/**
 * Ile ekranowego pionu daje jedna jednostka świata w osi Y. Kamera patrzy
 * z góry pod kątem (`camDir`), więc podniesienie celu o 1 przesuwa obraz
 * o 0,596 — to składowa „góry" kamery po rzucie `lookAt` z tym kierunkiem.
 */
const PION_EKRANU = 0.596;
/** Punkt, na który patrzy kamera, względem wierzchołka kuli (jednostki mapy).
 *  Dodatnie = kamera patrzy wyżej, więc planeta zjeżdża w dół ekranu;
 *  ujemne = planeta idzie do góry. Liczby są w PROMIENIACH PLANETY, nie
 *  w jednostkach mapy — inaczej przy zmianie `swiat.promienKuli` kadr się
 *  rozjeżdża: przy mniejszej kuli ten sam offset spycha liska pod krawędź.
 *  -0,182 (czyli -2 przy kuli o promieniu 11): cała kula w kadrze, lisek
 *  trochę powyżej środka, dół planety tuż nad paskiem HUD. */
const KAMERA_PODNIESIENIE = -0.182;
/**
 * O ile kamera odchodzi od bohatera, gdy zapada noc i sesja się domyka.
 * 0,62 to mniej więcej „lisek przestaje być bohaterem kadru, a zaczyna nim
 * być cała planeta" — dość, żeby ruch było widać, i za mało, żeby lisek
 * zniknął: ma być widoczny na własnej planecie, kiedy dzień się kończy.
 */
const ODDALENIE_NOCA = 0.62;

/* ── OPAD KŁÓD PO ŚCIĘCIU ────────────────────────────────────────────────
 *
 * Do tej pory stos pojawiał się w jednej klatce: drzewo znikało, drewno było.
 * Dziecko widziało WYNIK, ale nie widziało, że to ono go zrobiło — a to jest
 * jedyny moment w tym zadaniu, w którym świat odpowiada na jego pracę.
 * Teraz kłody zlatują z góry i układają się w ten sam szyk, co dotąd:
 * układ stosu nie jest animowany, tylko DOCHODZONY — pozycje docelowe są
 * dokładnie te z `natura.js`, więc po wylądowaniu stos wygląda identycznie
 * jak przedtem i nic nie trzeba stroić w dwóch miejscach.
 *
 * Kolejność jest od dołu: najpierw ląduje spód, na końcu kłoda ze szczytu
 * piramidy. Inaczej górna spadałaby na puste miejsce i czekała w powietrzu,
 * aż dolne się pod nią podsuną.
 */
const OPAD_CZAS = 0.62;      // lot jednej kłody, sekundy
const OPAD_ODSTEP = 0.085;   // przerwa między kolejnymi
const OPAD_WYSOKOSC = 2.6;   // z jakiej wysokości, w skalach stosu

/* POŚWIATA MATERIAŁU CZEKAJĄCEGO NA ZABRANIE. Barwa ta sama, co ślad do placu
   (`_sladDoPlacu`) i łuk wskaźnika rąbania — w tej scenie ciepły amber znaczy
   „tu jest coś do zrobienia", i ma znaczyć to samo za każdym razem. */
const POSWIATA_BARWA = 0xffc23a;
const POSWIATA_MIN = 0.09;   // najciemniejszy punkt pulsu
const POSWIATA_MAX = 0.26;   // najjaśniejszy — wyżej drewno gubi swój brąz
const POSWIATA_TEMPO = 2.2;  // rad/s, czyli pełny oddech w ~2,9 s

/**
 * Krzywa opadania: 0 = wysoko w powietrzu, 1 = na swoim miejscu w stosie.
 *
 * Pierwsze 68% to LOT Z PRZYSPIESZENIEM (`t²`) — kłoda nie płynie, tylko
 * spada, i to jedno decyduje, czy ma ciężar. Reszta to jedno miękkie
 * odbicie: wartość schodzi chwilowo poniżej jedynki, czyli kłoda podskakuje
 * NAD docelowe miejsce i siada. Bez tego lądowanie wygląda jak przyklejenie.
 */
function opadKrzywa(u) {
  if (u >= 1) return 1;
  if (u < .68) { const t = u / .68; return t * t; }
  const t = (u - .68) / .32;
  return 1 - Math.sin(t * Math.PI) * .17 * (1 - t);
}
/**
 * To samo dla ekranu POZIOMEGO. Kadr jest wtedy niski i szeroki: gdyby lisek
 * stał tam, gdzie w pionie, na niebo nad nim nie zostaje miejsca i ogranicznik
 * musiałby ściąć zoom do ~0,44 — lisek robi się ziarnkiem maku. Spychamy go
 * więc niżej w kadrze (kamera patrzy wyżej); to samo niebo mieści się wtedy
 * w dużo niższym kadrze, a na liska zostaje półtora raza więcej pikseli.
 */
const KAMERA_PODNIESIENIE_POZIOM = 0.127;
/**
 * To samo dla świata BEZ dolnego doku (`swiat.dolnyDok: false`). Nie ma czego
 * omijać na dole ekranu, więc lisek schodzi niżej, a na niebo zostaje tyle
 * samo miejsca w jeszcze niższym kadrze — czyli jeszcze większy bohater.
 */
const KAMERA_PODNIESIENIE_POZIOM_BEZ_DOKU = 0.218;

const clamp = (s, e, t) => Math.max(e, Math.min(t, s));
const dogon = (s, e, t, n) => s + (e - s) * (1 - Math.exp(-t * n));

/** Usuwa dryf korzenia z klipu (animacja „w miejscu"). */
function usunDryf(klip, prog = 0.1) {
  const raport = [];
  for (const n of klip.tracks) {
    if (!n.name.endsWith(".position") || !KOSCI_KORZENIA.has(n.name.split(".")[0])) continue;
    const i = n.times.length;
    if (i < 2) continue;
    const r = n.times[0];
    const a = n.times[i - 1] - r || 1;
    for (let o = 0; o < 3; o++) {
      const l = n.values[(i - 1) * 3 + o] - n.values[o];
      if (Math.abs(l) < prog) continue;
      for (let c = 0; c < i; c++) n.values[c * 3 + o] -= l * ((n.times[c] - r) / a);
      raport.push(`${n.name}[${"xyz"[o]}]=${l.toFixed(2)}`);
    }
  }
  return raport;
}

/** Domyka pętlę klipu — koniec dogina się do początku. */
function domknijPetle(klip, e = 0.3) {
  const t = (n) => n * n * (3 - 2 * n);
  for (const n of klip.tracks) {
    const i = n.times.length;
    if (i < 4) continue;
    const r = n.name.endsWith(".quaternion");
    const a = r ? 4 : n.values.length / i;
    const o = n.values.slice(0, a);
    const l = n.values.slice((i - 1) * a);
    let c = 0;
    for (let u = 0; u < a; u++) c += (o[u] - l[u]) ** 2;
    if (Math.sqrt(c) < 1e-4) continue;
    const h = Math.max(1, Math.floor(i * (1 - e)));
    if (r) {
      const u = new Quaternion(o[0], o[1], o[2], o[3]);
      const d = new Quaternion(l[0], l[1], l[2], l[3]);
      const f = u.clone().multiply(d.clone().invert());
      const m = new Quaternion(), y = new Quaternion(), g = new Quaternion();
      for (let p = h; p < i; p++) {
        const S = t((p - h) / (i - 1 - h));
        y.copy(m).slerp(f, S);
        g.fromArray(n.values, p * 4).premultiply(y).normalize();
        g.toArray(n.values, p * 4);
      }
    } else
      for (let u = h; u < i; u++) {
        const d = t((u - h) / (i - 1 - h));
        for (let f = 0; f < a; f++) n.values[u * a + f] += (o[f] - l[f]) * d;
      }
  }
  return klip;
}

let spokojnyRuch = globalThis.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

/** Gwiazdy w tle — tylko za planetą, żeby nie migały przed nią. */
function gwiazdy(kamera) {
  const N = 700;
  const poz = [];
  const kier = kamera.clone().normalize();
  let o = 7;
  const los = () => (o = (o * 16807) % 2147483647) / 2147483647;
  while (poz.length < N * 3) {
    const v = new Vector3(los() * 2 - 1, los() * 2 - 1, los() * 2 - 1);
    if (v.lengthSq() > 1 || v.lengthSq() < 0.05) continue;
    v.normalize();
    if (v.dot(kier) > -0.15) continue;
    v.multiplyScalar(70 + los() * 20);
    poz.push(v.x, v.y, v.z);
  }
  const g = new BufferGeometry();
  g.setAttribute("position", new Float32BufferAttribute(poz, 3));
  const p = new Points(g, new PointsMaterial({ color: 0xfff2cf, size: 2.2, sizeAttenuation: false, transparent: true, opacity: 0.85 }));
  p.frustumCulled = false;
  return p;
}

export class Aplikacja {
  constructor(host, opts = {}) {
    this.host = host;
    this.opts = opts;
    this.listeners = new Map();
    this.destroyed = false;
    this.paused = false;
    if (typeof opts.spokojnyRuch === "boolean") spokojnyRuch = opts.spokojnyRuch;

    this.mapa = wczytajMape();
    this.planeta = new Planeta(this.mapa.promienKuli);

    this.canvas = this.$("canvas");
    this.renderer = new WebGLRenderer({ canvas: this.canvas, antialias: !DOTYK });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio || 1, DOTYK ? 1.5 : 2));
    this.renderer.outputColorSpace = SRGBColorSpace;
    this.renderer.toneMapping = ACESFilmicToneMapping;
    // ACES odbarwia jasne końce: przy wysokiej ekspozycji zielone facetki
    // blakną w biel i kula czyta się jak szlifowany metal. W2 schodzi na 1,16
    // (`swiat.ekspozycja`), pierwszy świat zostaje na dotychczasowych 1,25.
    this.renderer.toneMappingExposure = this.mapa.ekspozycja;

    this.scene = new Scene();
    this.scene.background = new Color(PALETA.night);
    // Światła trzymamy na `this`, bo przy włączonym cyklu dnia (`doba.js`)
    // zmieniają barwę i moc w każdej klatce. Wartości poniżej to PEŁNY DZIEŃ
    // i są zarazem tym, co świat miał, zanim doba powstała.
    this.hemisfera = new HemisphereLight(14214399, 5600831, 1.05);
    this.scene.add(this.hemisfera);
    this.slonce = new DirectionalLight(16769200, 1.6);
    this.slonce.position.set(-6, 12, 4);
    this.scene.add(this.slonce);
    this.ambient = new AmbientLight(8425664, 0.35);
    this.scene.add(this.ambient);
    this.wypelnienie = new DirectionalLight(16773855, 0.85);
    this.wypelnienie.position.set(5, 7, 9);
    this.scene.add(this.wypelnienie);

    this.camera = new OrthographicCamera(-1, 1, 1, -1, 0.1, 160);
    this.camDir = new Vector3(4.2, 11.5, 8).normalize().multiplyScalar(26);
    // Kamera patrzy na wierzchołek kuli — tam planeta „przynosi" bohatera.
    // Wartość startowa; `resize()` i tak ją przelicza pod orientację ekranu.
    this.camTarget = new Vector3(0, this.planeta.R * (1 + KAMERA_PODNIESIENIE), 0);
    this.camPos = new Vector3();
    this.gwiazdy = gwiazdy(this.camDir);
    this.scene.add(this.gwiazdy);

    // DOBA — dzień i noc odmierzające sesję (`doba.js`). Bez flagi
    // `swiat.cyklDnia` obiekt w ogóle nie powstaje i światła stoją jak stały.
    //
    // `?doba=<minuty>` skraca całą dobę do oglądania. Pełny cykl trwa kwadrans
    // z okładem i nikt nie będzie tyle czekał, żeby sprawdzić, czy zachód
    // wchodzi o właściwej porze — a bez takiego skrótu sprawdza się to raz
    // i nigdy więcej. Działa tylko na strojenie w pamięci; mapa zostaje.
    const dobaSkrot = Number(new URLSearchParams(location.search).get("doba"));
    const strojenieDoby = Number.isFinite(dobaSkrot) && dobaSkrot > 0
      ? { ...(this.mapa.doba.strojenie || {}),
          sesja: { ...((this.mapa.doba.strojenie || {}).sesja || {}), minutySesji: dobaSkrot } }
      : this.mapa.doba.strojenie;
    this.doba = this.mapa.doba.wlaczona
      ? new Doba({
          scena: this.scene,
          slonce: this.slonce,
          wypelnienie: this.wypelnienie,
          hemisfera: this.hemisfera,
          ambient: this.ambient,
          gwiazdy: this.gwiazdy,
          slonceN: this.planeta.normalna(this.mapa.doba.nad[0], this.mapa.doba.nad[1]),
          strojenie: strojenieDoby,
        })
      : null;
    this._pora = null;
    this._etapSesji = null;
    // Obłoki — też dzieci kamery, więc NIE obracają się razem z terenem,
    // tylko bardzo powoli dryfują w poprzek kadru.
    this.chmury = this.mapa.chmury > 0 ? new Chmury({ ile: this.mapa.chmury }) : null;
    if (this.doba || this.chmury) {
      // Renderer rysuje tylko to, co wisi pod sceną — bez tej linijki dzieci
      // kamery nie pojawiłyby się wcale.
      this.scene.add(this.camera);
    }
    if (this.doba) {
      this.doba.podepnijDoKamery(this.camera);
      // Nieboskłon liczy gradient od krawędzi planety — musi znać jej promień.
      this.doba.promienPlanety = this.planeta.R;
    }
    if (this.chmury) {
      this.chmury.podepnijDoKamery(this.camera);
      if (this.doba) this.doba.chmuryMaterialy = [this.chmury.material];
    }

    this.formy = formyTerenu(this.mapa);
    const sw = zbudujSwiat(this.mapa, this.planeta);
    this.swiat = sw.group;
    this.ziemia = sw.ziemia;
    this.scene.add(this.swiat);
    this.lantern = sw.lantern;
    this.blockers = sw.blockers;
    /* WYSOKOŚĆ GRUNTU MIERZONA Z SIATKI, nie ze wzoru. Teren jest kanciasty
       (`terenKanciasty: 8`), więc analityczna forma `formy.h()` biegnie nad
       ścianami fasetek — obiekt osadzony według niej WISI nad trawą. Drzewa
       i głazy w `swiat.js` używają tego miernika (promień w dół), więc
       wszystko, co ma stać na ziemi obok nich, musi używać tego samego. */
    this.wysokoscGruntuSiatki = sw.wysokoscGruntu || null;
    if (this.doba) this.doba.ziemia = this.ziemia;

    // CIENIE. Domyślnie wyłączone — pierwszy świat ma plamy pod obiektami
    // (`plamaCienia`) i ma tak zostać. Włączone: jedno światło rzuca cień na
    // kulę, a przy niskim słońcu cienie robią się długie, jak na concept arcie.
    if (this.mapa.cienie) {
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = PCFSoftShadowMap;
      this.slonce.castShadow = true;
      const c = this.slonce.shadow;
      c.mapSize.set(DOTYK ? 1024 : 2048, DOTYK ? 1024 : 2048);
      c.camera.left = -14; c.camera.right = 14;
      c.camera.top = 14; c.camera.bottom = -14;
      c.camera.near = 2; c.camera.far = 62;
      // Kula ma łagodne zbocza, więc bez `normalBias` całą nocną stronę
      // pokryłby mory z samocieniowania.
      c.normalBias = 0.05;
      c.bias = -0.0004;
      if (this.ziemia) this.ziemia.receiveShadow = true;
      this.swiat.traverse((o) => {
        if (o.isMesh && o !== this.ziemia) { o.castShadow = true; o.receiveShadow = true; }
      });
    }
    this.kwiaty = sw.kwiaty;
    this.zasiewWlaczony = this.mapa.zasiew;
    this._zasiewOstatnia = null;
    this._zasiewDroga = 0;
    this.nurtTik = sw.nurtTik;
    /* MOTYLE (motyle.js). Wiszą na grupie planety jak kwiaty i dymki: lot
       liczy się w układzie mapy, siadają na kwiatach z `sw.kwiaty.lista`
       (także tych z zasiewu), omijają pnie z `blockers`. Pułap lotu bierze
       się z analitycznej formy terenu (tanio, co klatkę), a siadanie na
       ziemi — z miernika siatki (dokładnie, raz na lądowanie). `ile: 0`
       (brak wpisu `swiat.motyle` w mapie) = obiekt w ogóle nie powstaje. */
    this.motyle = this.mapa.motyle?.ile > 0
      ? new Motyle(this.swiat, this.planeta, {
          ...this.mapa.motyle,
          kwiaty: this.kwiaty,
          przeszkody: this.blockers,
          wysokoscGruntu: (x, z) => this.formy.h(x, z),
          gruntDokladny: this.wysokoscGruntuSiatki || ((x, z) => this.formy.h(x, z)),
          woda: (x, z) => !!this.formy.niecka(x, z),
          zasieg: this.mapa.motyle.zasieg ?? this.mapa.promienTresci * 0.9,
          srodek: this.mapa.start?.pos || [0, 0],
        })
      : null;
    /* PIEŃ DOMKOWEGO DRZEWA jest modelem, więc dojeżdża asynchronicznie.
       `zbudujSwiat` przygotował kotwicę z koroną i konarem; tu wkładamy do niej
       bryłę. Nie czekamy na nią — świat ma wstać nawet wtedy, gdy jeden plik
       nie doleci (tak samo robią znaki i suche drzewka). */
    this._kotwicaDomku = sw.kotwicaDomku || null;
    /* UKŁAD DOMKU — liczby opisujące to drzewo (obrót pnia, wysokość desek,
       kule korony). Domyślne siedzą w `swiat.js`, a mapa może je przykryć;
       edytor w grze (`edytorDomku.js`) miesza w tym obiekcie i woła
       `przebudujDomek`. Trzymamy je na scenie, bo to JEDNO źródło dla korony,
       pomostu i pnia naraz. */
    this._uklad = sw.ukladDomku || ukladDomku(this.mapa.schronienie);
    this._wczytajPienDomku();

    // MAGICZNA FASOLA + OCZKO WODY (fasola.js). Kropla, którą lisek niesie,
    // to ten sam mechanizm co kule światła — jedna kula, błękitna.
    /* OCZKA WODNE — lista, nie jeden obiekt. Woda rozlana po świecie to
       element krajobrazu, a nie pojedynczy rekwizyt przy fasoli; lisek nabiera
       jej z NAJBLIŻSZEGO stawu. `this.oczko` zostaje jako pierwszy z listy,
       bo tak woła go kod fasoli i pulpit reżyserki. */
    this.oczka = [
      ...(this.mapa.oczka || []),
      ...(this.mapa.oczko ? [this.mapa.oczko] : []),
    ].map((def) => zbudujOczko(def, this.planeta));
    for (const o of this.oczka) this.swiat.add(o.mesh);
    this.oczko = this.oczka[0] || null;
    /* MOKRE ŚLADY. Cała logika siedzi w `mokreslady.js` — tutaj zostaje tylko
       powołanie i jedno wywołanie w pętli, bo to jest efekt uboczny chodzenia,
       a nie kolejny system świata. Ślady wpinają się w grupę planety, więc
       obracają się razem z nią jak trawa i cienie. */
    this.mokreSlady = new MokreSlady(this.planeta, this.swiat, this.wysokoscGruntuSiatki);
    this.fasola = this.mapa.fasola ? new Fasola(this.mapa.fasola, this.planeta, (f) => this.loadGLB(f)) : null;
    if (this.fasola) this.swiat.add(this.fasola.root);

    // Most w układzie MAPY (do wysokości terenu i „czy stoję na moście").
    const mostQ = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), sw.obrotMostu);
    this.bridgeInv = new Matrix4().compose(new Vector3(this.mapa.most.pos[0], 0, this.mapa.most.pos[1]), mostQ, new Vector3(1, 1, 1)).invert();

    this.groundY = 0;
    this.footOffset = 0;

    // znacznik celu dotknięcia
    this.marker = new Mesh(new RingGeometry(0.28, 0.4, 24), new MeshBasicMaterial({ color: 16773839, transparent: true, opacity: 0, side: DoubleSide }));
    this.marker.rotation.x = -Math.PI / 2;
    this.marker.position.y = 0.05;
    this.markerKotwica = new Group();
    this.markerKotwica.add(this.marker);
    this.swiat.add(this.markerKotwica);
    this.markerPulse = 0;

    this.sparkles = [];
    this.sparkleGrupa = new Group();
    this.planeta.ustaw(this.sparkleGrupa, this.mapa.latarnia.pos.x, this.mapa.latarnia.pos.z, 0, 0);
    this.swiat.add(this.sparkleGrupa);

    // Stan bohatera NA SFERZE: normalna (punkt kuli) i styczna (przód).
    // `hp` to pochodne współrzędne mapy — do znaków, ścieżki, mostu i API.
    this.hn = new Vector3(0, 1, 0);
    /* Cele do ścięcia/rozbicia. Pusta lista = nie ma czego rąbać i cały
       mechanizm nie kosztuje nic w pętli (jedno `if` na klatkę). */
    this._doScinania = [];
    this._rabanieAktywne = true;
    this.hf = new Vector3(0, 0, 1);
    this.hp = { x: 0, z: 0 };
    this.heroLift = 0;
    this.obrotCel = new Quaternion();
    this._qTmp = new Quaternion();
    this._v1 = new Vector3();
    this._v2 = new Vector3();
    this._v3 = new Vector3();
    // rzeka i latarnia jako punkty na kuli (kolizja liczona w 3D — działa też na antypodzie)
    this.rzeka3d = przytnijDoPromienia(this.mapa.rzeka.punkty, this.mapa.promienTresci).map((k) => k.map((p) => this.planeta.naKule(p.x, p.y, 0)));
    this.latarniaN = this.planeta.normalna(this.mapa.latarnia.pos.x, this.mapa.latarnia.pos.z);
    this.ograniczenieMapy = !!this.mapa.surowa?.swiat?.tylkoMapa; // domyślnie: cała planeta jest do obejścia
    this.heroT = 0;
    this.targetT = 0;
    this.walking = false;
    this.celebrated = false;
    this.sequence = null;
    this.seqTimer = 0;
    this.mode = "goto";
    this.input = new Vector2(0, 0);
    this.keys = new Set();
    this.stick = null;
    this.inputSource = null;
    this.holdTime = 0;
    this.holdDir = null;
    this.running = false;
    this.idleAtLantern = 0;
    this.camRight = new Vector3();
    this.camFwd = new Vector3();
    this.raycaster = new Raycaster();
    this.clock = new Clock();

    // ścieżka
    const Ct = this.mapa.sciezka;
    this.odcinki = [];
    this.dlSciezki = 0;
    for (let s = 0; s < Ct.length - 1; s++) {
      const e = Ct[s].distanceTo(Ct[s + 1]);
      this.odcinki.push(e);
      this.dlSciezki += e;
    }
    this.tLatarni = 0;
    for (let e = 0; e < this.mapa.latarnia.punktSciezki && e < this.odcinki.length; e++) this.tLatarni += this.odcinki[e];

    this.gotowa = this.loadHero()
      .then(() => this.loadMarkers())
      .then(() => this.loadBudynki())
      .then(() => this.loadSucheDrzewka())
      .then(() => this.fasola?.gotowe)
      .then(() => {
        if (this.destroyed) return;
        this.$(".scena3d-loading")?.remove();
        this.bindUI();
        this.placeHero(0, true);
        this.updateCameraBasis();
        if (this.opts.autostart !== false) this.renderer.setAnimationLoop(() => this.tick());
        this.emit("gotowa", { klipy: Object.keys(this.actions) });
        this._kinoWejscie();
      })
      .catch((a) => {
        this.emit("blad", { komunikat: String(a?.message || a) });
        throw a;
      });
    this.onWinResize = () => this.resize();
    addEventListener("resize", this.onWinResize);
    if (globalThis.ResizeObserver) {
      this.ro = new ResizeObserver(() => this.resize());
      this.ro.observe(this.host);
    }
    this.resize();
  }

  $(e) { return this.host.querySelector(e); }
  $$(e) { return this.host.querySelectorAll(e); }

  emit(e, t = {}) {
    const n = { nazwa: e, ...t };
    try { this.opts.onEvent?.(e, n); } catch (i) { console.warn("onEvent", i); }
    for (const i of this.listeners.get(e) || []) try { i(n); } catch (r) { console.warn("listener " + e, r); }
    for (const i of this.listeners.get("*") || []) try { i(n); } catch (r) { console.warn("listener *", r); }
    this.host.dispatchEvent(new CustomEvent("scena3d:" + e, { detail: n, bubbles: true }));
  }
  on(e, t) {
    if (!this.listeners.has(e)) this.listeners.set(e, new Set());
    this.listeners.get(e).add(t);
    return () => this.off(e, t);
  }
  off(e, t) { this.listeners.get(e)?.delete(t); }

  /* ── ścieżka (układ mapy) ─────────────────────────────────────────────────── */

  punktSciezki(s, e = new Vector3()) {
    const Ct = this.mapa.sciezka;
    // Świat bez ścieżki (nowa planeta) — nie ma dokąd prowadzić, więc środek
    // mapy. Bez tego `Ct[Ct.length - 1]` na pustej tablicy wywraca scenę.
    if (!Ct.length) return e.set(0, 0, 0);
    s = clamp(s, 0, this.dlSciezki);
    let t = 0;
    for (let n = 0; n < this.odcinki.length; n++) {
      if (s <= t + this.odcinki[n]) return e.lerpVectors(Ct[n], Ct[n + 1], (s - t) / this.odcinki[n]);
      t += this.odcinki[n];
    }
    return e.copy(Ct[Ct.length - 1]);
  }

  najblizszyPunktSciezki(p) {
    const Ct = this.mapa.sciezka;
    let e = 0, t = Infinity, n = 0;
    const i = new Vector3(), r = new Vector3(), a = new Vector3();
    for (let o = 0; o < this.odcinki.length; o++) {
      i.copy(Ct[o]);
      r.subVectors(Ct[o + 1], Ct[o]);
      a.subVectors(p, i);
      const l = clamp(a.dot(r) / r.lengthSq(), 0, 1);
      const c = a.addScaledVector(r, -l).lengthSq();
      if (c < t) { t = c; e = n + l * this.odcinki[o]; }
      n += this.odcinki[o];
    }
    return { t: e, dist: Math.sqrt(t) };
  }

  /* ── wczytywanie ──────────────────────────────────────────────────────────── */

  loadGLB(e) {
    // ZNAK-PROG: próg domu to sam blask na ziemi — pusta grupa zamiast modelu.
    if (e === "prog") return Promise.resolve({ scene: new Group(), animations: [] });
    // ZNAK-PĄK: martwy obiekt pierwszej misji jest proceduralny, jak drzewa —
    // ta sama fasetowana bryła co teren, więc należy do świata.
    if (e === "pak") {
      const g = new Group();
      g.add(kamiennyPak(1));
      return Promise.resolve({ scene: g, animations: [] });
    }
    // ZNAK-DRZEWO: drzewa są proceduralne, więc znak-drzewo dostaje sosnę z generatora.
    if (e === "drzewo" || e === "drzewo-lisciaste") {
      const g = new Group();
      const d = (e === "drzewo-lisciaste" ? drzewoLisciaste : sosna)(1);
      d.scale.set(0.84, 1.26, 0.84);
      g.add(d);
      return Promise.resolve({ scene: g, animations: [] });
    }
    const loader = new GLTFLoader();
    const b64 = globalThis.__GLB_ASSETS?.[e] || (e === "adventurer" ? globalThis.__HERO_GLB_B64 : null);
    return new Promise((res, rej) => {
      if (b64) {
        const a = atob(b64);
        const o = new Uint8Array(a.length);
        for (let l = 0; l < a.length; l++) o[l] = a.charCodeAt(l);
        loader.parse(o.buffer, "", res, rej);
      } else loader.load(`${this.opts.zasoby ?? "./assets/"}${e}.glb`, res, undefined, rej);
    });
  }

  miejsceWolne(x, z, m, pomin, w) {
    if (!this.canWalk(x, z)) return false;
    for (let k = 0; k < 8; k++) {
      const a = (k / 8) * Math.PI * 2;
      if (!this.canWalk(x + Math.cos(a) * m, z + Math.sin(a) * m)) return false;
    }
    for (const q of w || []) {
      const d = q && q.e;
      if (!d || d.id === pomin || !d.pos) continue;
      if (Math.hypot(x - d.pos[0], z - d.pos[1]) < m) return false;
    }
    return true;
  }

  wolneMiejsca(e, w) {
    const baza = (p) => [p[0], this.groundHeightAt(p[0], p[1]), p[1]];
    for (const m of [e.margines ?? 1.6, 1, 0.6]) {
      const ok = e.pozycje.filter((p) => this.miejsceWolne(p[0], p[1], m, e.id, w));
      if (ok.length) return ok.map(baza);
    }
    return e.pozycje.map(baza);
  }

  async loadMarkers() {
    this.markers = [];
    const w = await Promise.all(
      this.mapa.znaki.map((e) =>
        this.loadGLB(e.file).then((t) => ({ e, t })).catch((t) => (console.warn("Nie udalo sie wczytac znaku", e.id, t), null)),
      ),
    );
    for (const x of w) {
      if (!x) continue;
      const { e, t } = x;
      if (e.pozycje) e._pozycje = this.wolneMiejsca(e, w);
      const n = this.groundHeightAt(e.pos[0], e.pos[1]);
      const i = new Znak(e, t.scene, n, this.planeta);
      if (e.animuj && t.animations && t.animations.length) {
        i.mixer = new AnimationMixer(t.scene);
        i.mixer.clipAction(t.animations[0]).play();
      }
      this.swiat.add(i.root);
      this.markers.push(i);
    }
  }

  /**
   * SUCHE DRZEWKA — martwe pnie, jedyne drzewa, ktore dziecko moze sciac.
   * Ladowane z MODELU (`assets/suche_drzewko.glb`), a nie rysowane kodem jak
   * sosny: to recznie rzezbiona bryla autora i ma sie roznic sylwetka od
   * generatora, zeby dziecko poznalo ja z drugiego konca polany.
   *
   * Skalujemy WYSOKOSCIA, nie mnoznikiem. Model przychodzi w swoich
   * jednostkach (5,86 wysokosci), a na mapie ma stac w skali sosen — wpis
   * `wysokosc` w mapie mowi wprost, jak wysokie ma byc drzewo w swiecie,
   * a przeliczenie zostaje tutaj. Ten sam zapis co przy budynkach.
   *
   * BEZ KOLIZJI: drzewko ma byc celem do wbiegniecia (jak znaki), a nie
   * przeszkoda. Gdy wejdzie rabanie, blocker moglby je wrecz zepsuc —
   * lisek nie doszedlby do pnia.
   */
  async loadSucheDrzewka() {
    for (const e of this.mapa.sucheDrzewka || []) {
      try {
        const t = await this.loadGLB(e.file || "suche_drzewko");
        const n = t.scene;
        const box = new Box3().setFromObject(n);
        const r = new Vector3();
        box.getSize(r);
        n.scale.setScalar((e.wysokosc ?? 2.4) / Math.max(0.001, r.y));
        box.setFromObject(n);
        // Model jest juz wyprostowany i wysrodkowany na pniu (obrot +90 wokol X
        // wypalony w pliku), wiec zostaje tylko posadzic go na gruncie.
        n.position.set(0, -box.min.y, 0);
        const kotwica = this._osadz(n, e.pos[0], e.pos[1], .04, e.obrot ?? 0);
        n.traverse((c) => {
          if (!c.isMesh) return;
          // Barwa Z PALETY SWIATA, nie z pliku: eksport z ZBrusha przyszedl bez
          // .mtl, a i tak chcemy jednego suchego drewna w calej grze — tego
          // samego, co stos po scieciu (`natura.js`, MAT_DREWNO.suchy).
          c.material = new MeshLambertMaterial({ color: 0x8a7557, flatShading: true });
          c.geometry.computeVertexNormals();
        });
        const id = e.id || `drzewko-${e.pos[0]}-${e.pos[1]}`;
        n.name = `suche-${id}`;
        this.swiat.add(kotwica);

        /* WYNIK PRACY buduje się OD RAZU, tylko jest schowany. Gdyby powstawał
           dopiero w chwili ścięcia, pierwsze ścięcie w sesji zacinałoby klatkę
           na budowie pięciu kłód — akurat w sekundzie, w której dziecko patrzy
           najuważniej. */
        const wynik = new Group();
        wynik.visible = false;
        // Stos leży OBOK pnia, na własnej kotwicy: na kanciastym terenie
        // wysokość pół kroku dalej potrafi być inna niż pod samym drzewem.
        /* Skala stosu liczona OD DRZEWKA, nie wpisana na sztywno: z pnia
           o wysokości 2,4 nie może zostać kupka wielkości kamyka. Przy .48
           stos ma około metra w poprzek — tyle, ile zajmują trzy kłody. */
        const skalaStosu = (e.wysokosc ?? 2.4) * .48;
        wynik.add(this._osadz(stosDrewna(skalaStosu), e.pos[0] + .72, e.pos[1] + .3, .05, .4));
        wynik.add(this._osadz(pieniek((e.wysokosc ?? 2.4) * .42), e.pos[0], e.pos[1], .04, 0));
        this.swiat.add(wynik);

        /* KOLIZJA MNIEJSZA NIŻ ZASIĘG PRACY. Bez blockera lisek przechodził
           przez pień jak przez mgłę i drzewo nie czytało się jak rzecz.
           Promień 0,5 przy zasięgu 1,6 znaczy: bohater zatrzymuje się O KROK
           przed pniem i to wystarczy, żeby zacząć piłować. Gdyby blocker był
           większy od zasięgu, dziecko nigdy by do drzewka nie doszło. */
        const blocker = { x: e.pos[0], z: e.pos[1], r: e.kolizja ?? 0.5 };
        this.blockers.push(blocker);

        /* Stos leży OBOK pnia, więc po niego przychodzi się w inne miejsce niż
           do piłowania. Zapamiętujemy tę pozycję osobno — bez niej lisek
           „podnosił" drewno, stojąc przy pieńku, czyli metr od stosu. */
        const posWyniku = [e.pos[0] + .72, e.pos[1] + .3];
        this._doScinania.push({
          id, rodzaj: "drzewko", pos: e.pos, zrodlo: n, wynik, blocker,
          n: this.planeta.normalna(e.pos[0], e.pos[1]),
          posWyniku, nWyniku: this.planeta.normalna(posWyniku[0], posWyniku[1]),
          skalaWyniku: skalaStosu,
          zasieg: e.zasieg ?? 1.6, postep: 0, zrobione: false, dostarczone: false,
        });
      } catch (blad) {
        // Brak modelu nie moze wywalic calej sceny — planeta ma wstac nawet
        // wtedy, gdy jeden asset nie doleci.
        console.warn("[scena] nie udalo sie wczytac suchego drzewka", blad);
      }
    }
    this._zarejestrujDrzewa();
    this._zarejestrujGlazy();
    const sch = this.mapa.schronienie;
    // Normalna placu liczona RAZ: sprawdzamy ją w każdej klatce transportu.
    this._nPlacu = sch ? this.planeta.normalna(sch.pos[0], sch.pos[1]) : null;
    // Jedna linia w konsoli zamiast zgadywania, czy cele w ogóle powstały.
    console.info("[rabanie] cele:", this._doScinania.map((c) => `${c.id} (${c.rodzaj}, zasieg ${c.zasieg})`));
    console.info("[schronienie] miejsce:", sch?.pos ?? "brak w mapie");
  }

  async loadBudynki() {
    for (const e of this.mapa.budynki) {
      try {
        const t = await this.loadGLB(e.file);
        const n = t.scene;
        const box = new Box3().setFromObject(n);
        const r = new Vector3();
        box.getSize(r);
        n.scale.setScalar((e.wysokosc ?? 2.4) / Math.max(0.001, r.y));
        box.setFromObject(n);
        const o = box.getCenter(new Vector3());
        const kotwica = new Group();
        this.planeta.ustaw(kotwica, e.pos[0], e.pos[1], 0, 0);
        n.position.set(-o.x, this.groundHeightAt(e.pos[0], e.pos[1]) - box.min.y, -o.z);
        n.rotation.y = e.obrot ?? 0;
        if (e.jasnosc)
          n.traverse((c) => {
            const l = c.material ? (Array.isArray(c.material) ? c.material : [c.material]) : [];
            for (const h of l) if (h.color) { h.color.multiplyScalar(e.jasnosc); h.needsUpdate = true; }
          });
        kotwica.add(n);
        this.swiat.add(kotwica);
        // MROK WE WNĘTRZU: walec BackSide, przez drzwi widać ciemną ścianę w głębi.
        if (e.ciemnosc) {
          const cr = e.mrokPromien ?? (e.promien ?? 1.4) * 0.28;
          const ch = e.mrokWysokosc ?? (e.wysokosc ?? 4) * 0.46;
          const cm = new Mesh(new CylinderGeometry(cr, cr, ch, 24, 1, false), new MeshBasicMaterial({ color: e.mrokBarwa ?? 1511432, transparent: true, opacity: typeof e.ciemnosc === "number" ? e.ciemnosc : 0.86, side: BackSide, depthWrite: false }));
          const mx = e.mrokPos ? e.mrokPos[0] : e.pos[0];
          const mz = e.mrokPos ? e.mrokPos[1] : e.pos[1];
          this.planeta.ustaw(cm, mx, mz, this.groundHeightAt(mx, mz) + (e.mrokY ?? 0.02) + ch / 2, 0);
          cm.renderOrder = -1;
          cm.name = "mrok-" + (e.file || "budynek");
          this.swiat.add(cm);
        }
        // DOM Z DRZWIAMI: wieniec małych kół kolizji z wyrwą na bramę.
        if (e.drzwiKat != null) {
          const r2 = e.promien ?? 1.4, sz = e.drzwiSzer ?? 0.9, n2 = 14, kr = ((Math.PI * r2) / n2) * 1.15;
          for (let i = 0; i < n2; i++) {
            const a = (i / n2) * Math.PI * 2;
            const d = Math.atan2(Math.sin(a - e.drzwiKat), Math.cos(a - e.drzwiKat));
            if (Math.abs(d) < sz / 2) continue;
            this.blockers.push({ x: e.pos[0] + Math.sin(a) * r2, z: e.pos[1] + Math.cos(a) * r2, r: kr });
          }
        } else this.blockers.push({ x: e.pos[0], z: e.pos[1], r: e.promien ?? 1.4 });
      } catch (t) {
        console.warn("Nie udalo sie wczytac budynku", e.file, t);
      }
    }
  }

  async loadHero() {
    const P = postac();
    const e = await this.loadGLB(P.plik || "fox");
    const t = e.scene;
    t.traverse((o) => {
      if (o.isSkinnedMesh) { this.skinned = o; o.frustumCulled = false; }
    });
    if (!this.skinned) throw new Error("Brak SkinnedMesh w GLB — rig nie został wczytany");
    this.tilt = new Group();
    this.tilt.position.y = OS_POCHYLENIA;
    t.position.y = -OS_POCHYLENIA;
    this.tilt.add(t);
    this.hero = new Group();
    this.hero.add(this.tilt);
    this.model = t;
    const env = this.makeHeroEnv();
    t.traverse((o) => {
      const l = o.material ? (Array.isArray(o.material) ? o.material : [o.material]) : [];
      for (const c of l) {
        c.metalness = 0;
        c.metalnessMap = null;
        c.roughnessMap = null;
        c.roughness = 0.85;
        if (c.normalScale) c.normalScale.setScalar(0.55);
        c.color.setScalar(P.wyglad?.tint ?? TINT_BOHATERA);
        if (c.map) {
          c.emissiveMap = c.map;
          c.emissive.setScalar(1);
          c.emissiveIntensity = P.wyglad?.self ?? SELF_BOHATERA;
        }
        c.envMap = env;
        c.envMapIntensity = P.wyglad?.env ?? ENV_BOHATERA;
        c.needsUpdate = true;
      }
    });
    this.hero.scale.setScalar(SKALA_BOHATERA);

    // Cień: MultiplyBlending przyciemnia teren zamiast go zakrywać (dawna
    // poprawka z Reacta `dopracujCienBohatera` — teraz u źródła).
    const cienGrupa = plamaCienia(1.3, 0.62, 0.34, true);
    this.heroShadow = cienGrupa.userData.plama;
    this.heroShadow.geometry.scale(0.7, 0.7, 1);
    this.heroShadow.renderOrder = 2;
    this.heroShadow.userData.dopracowany = true;
    this.heroShadowKotwica = cienGrupa;
    this.swiat.add(cienGrupa);

    const klipy = {};
    const raport = [];
    for (const o of e.animations) {
      const l = (P.klipy || MAPA_KLIPOW_DOMYSLNA)[o.name] || o.name;
      o.name = l;
      raport.push(...usunDryf(o).map((c) => `${l}: ${c}`));
      if (l === "walk" || l === "run" || l === "idle") domknijPetle(o);
      klipy[l] = o;
    }
    this.clipReport = raport;
    if (klipy.walk && !klipy.turn) klipy.turn = AnimationUtils.subclip(klipy.walk, "turn", 0, 13, 24);
    this.mixer = new AnimationMixer(this.model);
    this.actions = {};
    for (const [o, l] of Object.entries(klipy)) {
      const c = this.mixer.clipAction(l);
      if (o === "turn" || o === "happy") { c.setLoop(LoopOnce); c.clampWhenFinished = true; }
      this.actions[o] = c;
    }
    if (this.actions.walk) this.actions.walk.timeScale = (V_CHOD / DL_KROKU_CHOD) * (P.tempo?.walk ?? 1);
    if (this.actions.run) this.actions.run.timeScale = (V_BIEG / DL_KROKU_BIEG) * (P.tempo?.run ?? 1);
    const a = this.alignRunToWalk();
    if (a) raport.push(`run→walk: obrót ${a.obrotPionowy}°, środek ${JSON.stringify(a.srodekSwiat)}`);
    this.calibrateFeet();
    this.current = null;
    this.play("idle");
    // Dopiero po kalibracji (liczonej w układzie własnym) bohater trafia na kulę.
    this.swiat.add(this.hero);
    // Światło, które bohater NIESIE — kule wokół niego i latarnia.
    this.swiatlo = new Swiatlo(this.hero);
    // Kropla wody (jedna) — ten sam obieg, inna barwa i nikłe światło.
    this.kropla = new Swiatlo(this.hero, { ile: 1, barwa: 0x8fdcff, mocLatarni: 0.35, wielkoscKuli: 0.11, promienOrbity: 0.5, wysokosc: 0.6, tempoOrbity: 0.8 });
    this.kropla.grupa.name = "kropla-bohatera";
    // Kłębki spod łap. Wiszą na grupie PLANETY, nie na bohaterze — mają
    // zostawać tam, gdzie odbiła się łapa.
    this.dymki = new Dymki(this.swiat, this.planeta);
    this.debugAPI(e);
  }

  debugAPI(e) {
    globalThis.__POC = {
      app: this,
      bones: this.skinned.skeleton.bones.length,
      clips: e.animations.map((o) => o.name),
      isSkinned: true,
      setInput: (o, l) => { this.enterFreeMode(); this.input.set(o, l); this.inputSource = "api"; },
      pos: () => [+this.hp.x.toFixed(2), +this.heroLift.toFixed(2), +this.hp.z.toFixed(2)],
      clipReport: this.clipReport,
      clipY: () => this.clipY,
      setHeroLook: ({ tint: o, self: l, env: c }) => {
        this.hero.traverse((h) => {
          const u = h.material ? (Array.isArray(h.material) ? h.material : [h.material]) : [];
          for (const d of u) {
            if (o != null) d.color.setScalar(o);
            if (l != null) d.emissiveIntensity = l;
            if (c != null) d.envMapIntensity = c;
            d.needsUpdate = true;
          }
        });
        this.renderer.render(this.scene, this.camera);
      },
      leanDip: () => +(this.leanDip || 0).toFixed(4),
      setLean: (o) => { this.lean = o; this.tilt.rotation.x = o; },
      leanMax: POCHYLENIE_MAX,
      runMode: () => trybBiegu,
      markers: () =>
        (this.markers || []).map((o) => ({
          id: o.id, dotkniecia: o.touches, stan: o.state, pos: [+o.mapa.x.toFixed(2), +o.mapa.z.toFixed(2)],
          skala: +o.spin.scale.x.toFixed(3), halo: +o.halo.material.opacity.toFixed(2), swiatlo: +o.light.intensity.toFixed(2),
          przebudzenie: +o.wake.toFixed(2), wysokosc: +o.spin.position.y.toFixed(3), krycie: +o.fade.toFixed(2), widoczny: o.spin.visible,
        })),
      touched: () => this.touched || [],
      tapMarker: (o) => {
        const l = (this.markers || []).find((c) => c.id === o);
        if (!l) return null;
        l.def.absorb ? this.enterMarker(l, true) : this.touchMarker(l, true);
        return { skala: +l.spin.scale.x.toFixed(3), swiatlo: +l.light.intensity.toFixed(2) };
      },
      setRunMode: (o) => { trybBiegu = o; this.current = null; this.mixer.stopAllAction(); this.play("idle", 0); },
      groundAt: (o, l) => +this.groundHeightAt(o, l).toFixed(3),
      hold: () => ({
        trzymanie: +this.holdTime.toFixed(2), bieg: this.running, anim: this.current,
        predkosc: +(this.moveSpeed || 0).toFixed(2), tempoKlipu: +(this.actions[KLIP_CHOD]?.timeScale || 0).toFixed(2),
        pochylenieDeg: +(((this.lean || 0) * 180) / Math.PI).toFixed(1),
      }),
      planeta: () => ({ R: this.planeta.R, obrot: this.swiat.quaternion.toArray().map((v) => +v.toFixed(3)) }),
      motyle: () => (this.motyle ? this.motyle.stan() : null),
    };
  }

  makeHeroEnv() {
    const e = document.createElement("canvas");
    e.width = 64;
    e.height = 32;
    const t = e.getContext("2d");
    const n = t.createLinearGradient(0, 0, 0, 32);
    n.addColorStop(0, "#fff3dc");
    n.addColorStop(0.45, "#e9edff");
    n.addColorStop(1, "#9dbb72");
    t.fillStyle = n;
    t.fillRect(0, 0, 64, 32);
    const i = new CanvasTexture(e);
    i.mapping = EquirectangularReflectionMapping;
    i.colorSpace = SRGBColorSpace;
    const r = new PMREMGenerator(this.renderer);
    const a = r.fromEquirectangular(i);
    r.dispose();
    i.dispose();
    return a.texture;
  }

  play(e, t = 0.22, n = false) {
    if (this.current === e) return;
    const i = this.actions[e];
    if (!i) return;
    const r = this.current ? this.actions[this.current] : null;
    i.reset();
    if (n && r) {
      const a = r.getClip().duration, o = i.getClip().duration;
      if (a > 0) i.time = ((r.time % a) / a) * o;
    }
    i.fadeIn(r ? t : 0).play();
    if (r) r.fadeOut(t);
    this.current = e;
  }

  /* ── UI / wejście ─────────────────────────────────────────────────────────── */

  bindUI() {
    this.canvas.addEventListener("pointerdown", (n) => this.onPointerDown(n));
    this.canvas.addEventListener("pointermove", (n) => this.onPointerMove(n));
    this.canvas.addEventListener("pointerup", (n) => this.onPointerUp(n));
    this.canvas.addEventListener("pointercancel", (n) => this.onPointerUp(n));
    this.onKeyDown = (n) => {
      if (n.code === "ShiftLeft" || n.code === "ShiftRight") { this.keys.add(n.code); return; }
      if (KLAWISZE[n.code]) { n.preventDefault(); this.keys.add(n.code); this.enterFreeMode(); }
    };
    this.onKeyUp = (n) => { this.keys.delete(n.code); };
    this.onBlur = () => this.keys.clear();
    if (this.opts.klawiatura !== false) {
      addEventListener("keydown", this.onKeyDown);
      addEventListener("keyup", this.onKeyUp);
      addEventListener("blur", this.onBlur);
    }
    const e = this.$(".scena3d-runmode");
    if (e) {
      const n = () => { e.textContent = trybBiegu === "tempo" ? "bieg: tempo" : "bieg: klip"; };
      n();
      e.addEventListener("click", () => {
        trybBiegu = trybBiegu === "tempo" ? "clip" : "tempo";
        n();
        this.current = null;
        this.mixer.stopAllAction();
        this.play("idle", 0);
      });
    }
    this.stickBase = this.$(".scena3d-stick");
    this.stickKnob = this.$(".scena3d-knob");
    const t = (n, i) => this.$(`[data-akcja="${n}"]`)?.addEventListener("click", i);
    t("stop", () => { this.stopWalk(); this.setActive("stop"); });
    t("go", () => { this.goToLantern(); this.setActive("go"); });
    t("replay", () => { this.replayWalk(); this.setActive("replay"); });
  }

  updateCameraBasis() {
    this.camRight.set(1, 0, 0).applyQuaternion(this.camera.quaternion);
    this.camRight.y = 0;
    this.camRight.normalize();
    this.camFwd.set(0, 0, -1).applyQuaternion(this.camera.quaternion);
    this.camFwd.y = 0;
    this.camFwd.normalize();
  }

  enterFreeMode() {
    if (this.mode !== "free") { this.mode = "free"; this.walking = false; this.setActive(null); }
    if (this.sequence) this.sequence = null;
  }

  onPointerDown(e) {
    this.kinoSkroc();
    if (!this.stick) {
      this.stick = { id: e.pointerId, x0: e.clientX, y0: e.clientY, active: false };
      this.canvas.setPointerCapture?.(e.pointerId);
    }
  }
  onPointerMove(e) {
    const t = this.stick;
    if (!t || t.id !== e.pointerId) return;
    const n = e.clientX - t.x0, i = e.clientY - t.y0, r = Math.hypot(n, i);
    if (!t.active && r < 11) return;
    if (!t.active) { t.active = true; this.enterFreeMode(); this.showStick(t.x0, t.y0); }
    const a = 46, o = Math.min(1, r / a), l = r ? n / r : 0, c = r ? i / r : 0;
    this.input.set(l * o, -c * o);
    this.inputSource = "stick";
    this.moveKnob(l * o * a, c * o * a);
  }
  onPointerUp(e) {
    const t = this.stick;
    if (!t || t.id !== e.pointerId) return;
    this.stick = null;
    this.hideStick();
    if (t.active) { this.input.set(0, 0); this.inputSource = null; this.setRunFlag(false); }
    else this.tapAt(e.clientX, e.clientY);
  }
  showStick(e, t) {
    if (!this.stickBase) return;
    this.stickBase.style.left = `${e}px`;
    this.stickBase.style.top = `${t}px`;
    this.stickBase.classList.add("on");
  }
  moveKnob(e, t) {
    if (this.stickKnob) this.stickKnob.style.transform = `translate(-50%,-50%) translate(${e}px,${t}px)`;
  }
  hideStick() { this.stickBase?.classList.remove("on"); this.moveKnob(0, 0); }
  setRunFlag(e) {
    if (this.running !== e) { this.running = e; this.stickBase?.classList.toggle("run", e); }
  }
  readKeys() {
    let e = 0, t = 0;
    for (const n of this.keys) {
      const i = KLAWISZE[n];
      if (i) { e += i[0]; t += i[1]; }
    }
    if (e || t) {
      const n = Math.hypot(e, t);
      const i = this.keys.has("ShiftLeft") || this.keys.has("ShiftRight") ? 1 : 0.55;
      this.input.set((e / n) * i, (t / n) * i);
      this.inputSource = "keys";
      return true;
    }
    return false;
  }

  /* ── teren / most / kolizje (układ mapy) ──────────────────────────────────── */

  bridgeLocal(e, t, n) { return n.set(e, 0, t).applyMatrix4(this.bridgeInv); }

  /**
   * Sadzi bryłę na TEJ SAMEJ wysokości, co drzewa i głazy — czyli według
   * siatki terenu. Zwraca kotwicę (nie dodaje jej do sceny): wołający sam
   * decyduje, czy wiesza ją na świecie, czy w grupie wyniku.
   */
  _osadz(obj, x, z, zanurzenie = 0, obrot = 0) {
    const h = this.wysokoscGruntuSiatki ? this.wysokoscGruntuSiatki(x, z) : this.groundHeightAt(x, z);
    const kotwica = new Group();
    this.planeta.ustaw(kotwica, x, z, h - zanurzenie, obrot);
    // `null` wolno podać, gdy bryła powstaje DOPIERO na podstawie kotwicy
    // (tak robi domek: drabinka potrzebuje wysokości gruntu względem niej).
    if (obj) kotwica.add(obj);
    return kotwica;
  }

  groundHeightAt(e, t) {
    const forma = this.formy ? this.formy.h(e, t) : 0;
    const n = this.bridgeLocal(e, t, this._blTmp || (this._blTmp = new Vector3()));
    const i = Math.abs(n.z);
    if (Math.abs(n.x) > MOST_POL_SZER + 0.2 || i > MOST_POL_DL) return forma;
    const r = MOST_LUK - 0.057 * (Math.min(i, MOST_PLASKI) / MOST_PLASKI) ** 2;
    const a = clamp((MOST_POL_DL - i) / (MOST_POL_DL - MOST_PLASKI), 0, 1);
    const o = clamp((MOST_POL_SZER + 0.2 - Math.abs(n.x)) / 0.3, 0, 1);
    return r * (a * a * (3 - 2 * a) * o);
  }
  onBridge(e, t) {
    const n = this.bridgeLocal(e, t, this._blTmp2 || (this._blTmp2 = new Vector3()));
    return Math.abs(n.x) < MOST_POL_SZER && Math.abs(n.z) < MOST_POL_DL;
  }

  /** Kolizja w układzie MAPY (używana przy stawianiu wędrujących znaków). */
  canWalk(e, t) {
    return this.canWalkN(this.planeta.normalna(e, t, this._v3));
  }

  /**
   * Kolizja dla punktu kuli `n` (normalna). Blokery i rzeka porównywane są
   * odległością w 3D (cięciwa ≈ łuk dla tych rozmiarów), więc obchodzenie
   * planety dookoła nie ma żadnego szwu.
   */
  canWalkN(n) {
    const R = this.planeta.R;
    if (this.ograniczenieMapy) {
      const p = this.planeta.zKuli(this._v1.copy(n).multiplyScalar(R));
      if (Math.hypot(p.x, p.z) > this.mapa.promienMapy) return false;
    }
    const P = this._v1.copy(n).multiplyScalar(R);
    for (const b of this.blockers) {
      if (!b.n) b.n = this.planeta.naKule(b.x, b.z, 0);
      const r = b.r + MARGINES_KOLIZJI;
      if (P.distanceToSquared(b.n) < r * r) return false;
    }
    let najblizej = Infinity;
    const d = this._v2;
    for (const Ml of this.rzeka3d)
      for (let i = 0; i < Ml.length - 1; i++) {
        const a = Ml[i], b = Ml[i + 1];
        d.subVectors(b, a);
        const ll = d.lengthSq();
        const c = ll > 0 ? clamp(this._v3.subVectors(P, a).dot(d) / ll, 0, 1) : 0;
        this._v3.copy(a).addScaledVector(d, c);
        najblizej = Math.min(najblizej, P.distanceTo(this._v3));
      }
    if (najblizej < this.mapa.rzeka.szerokosc + MARGINES_KOLIZJI * 0.5) {
      const p = this.planeta.zKuli(P);
      return this.onBridge(p.x, p.z);
    }
    return true;
  }

  /* ── kalibracja stóp i klipów ─────────────────────────────────────────────── */

  calibrateFeet(e = 56) {
    const t = this.skinned, n = t.geometry.attributes.position;
    let i = Infinity;
    for (let c = 0; c < n.count; c++) i = Math.min(i, n.getY(c));
    this.soleVerts = [];
    for (let c = 0; c < n.count; c++) if (n.getY(c) < i + 0.02) this.soleVerts.push(c);
    const r = new Vector3();
    const o = this.tilt.rotation.x;
    this.tilt.rotation.x = 0;
    this.hero.position.set(0, 0, 0);
    this.hero.quaternion.identity();
    this.clipY = {};
    for (const [c, h] of Object.entries(this.actions)) {
      this.mixer.stopAllAction();
      h.reset();
      h.timeScale = 1;
      h.play();
      this.tilt.rotation.x = c === KLIP_BIEG ? POCHYLENIE_BIEG : 0;
      const u = h.getClip().duration || 1;
      let d = Infinity;
      for (let f = 0; f < e; f++) {
        this.mixer.setTime((f / e) * u);
        this.hero.updateMatrixWorld(true);
        for (const m of this.soleVerts) { t.getVertexPosition(m, r).applyMatrix4(t.matrixWorld); if (r.y < d) d = r.y; }
      }
      this.clipY[c] = -d;
    }
    this.tilt.rotation.x = 0;
    const l = this.actions[KLIP_CHOD];
    if (l) {
      this.mixer.stopAllAction();
      l.reset();
      l.timeScale = 1;
      l.play();
      const c = l.getClip().duration || 1;
      const h = (u) => {
        this.tilt.rotation.x = u;
        let d = Infinity;
        for (let f = 0; f < e; f++) {
          this.mixer.setTime((f / e) * c);
          this.hero.updateMatrixWorld(true);
          for (const m of this.soleVerts) { t.getVertexPosition(m, r).applyMatrix4(t.matrixWorld); if (r.y < d) d = r.y; }
        }
        return d;
      };
      this.leanDip = Math.max(0, h(0) - h(POCHYLENIE_MAX));
    } else this.leanDip = 0;
    this.mixer.stopAllAction();
    this.mixer.setTime(0);
    this.tilt.rotation.x = o;
    this.footOffset = this.clipY.idle ?? 0;
    return this.clipY;
  }

  alignRunToWalk() {
    const e = this.actions[KLIP_CHOD], t = this.actions[KLIP_BIEG];
    if (!e || !t) return null;
    const n = this.skinned.skeleton.bones.find((U) => U.name === "Hip");
    if (!n) return null;
    const a = this.tilt.rotation.x;
    this.hero.position.set(0, 0, 0);
    this.hero.quaternion.identity();
    this.tilt.rotation.x = 0;
    const o = new Vector3(), l = new Vector3(), c = new Vector3(), h = 32;
    const u = this.skinned.skeleton.bones;
    const d = u.find((U) => U.name === "L_Thigh"), f = u.find((U) => U.name === "R_Thigh");
    if (!d || !f) return null;
    const m = (U, W = 0) => {
      this.mixer.stopAllAction();
      U.reset();
      U.timeScale = 1;
      U.play();
      this.tilt.rotation.x = W;
      const G = U.getClip().duration || 1, $ = new Vector3();
      let Q = 0, re = 0;
      for (let ce = 0; ce < h; ce++) {
        this.mixer.setTime((ce / h) * G);
        this.hero.updateMatrixWorld(true);
        n.getWorldPosition(o);
        $.add(o);
        d.getWorldPosition(l);
        f.getWorldPosition(c);
        const ge = c.x - l.x, Ge = c.z - l.z, ut = Math.hypot(ge, Ge) || 1;
        Q += Ge / ut;
        re += -ge / ut;
      }
      return { pos: $.multiplyScalar(1 / h), yaw: Math.atan2(Q / h, re / h) };
    };
    const y = new Quaternion();
    const g = m(e, 0), p = m(t, POCHYLENIE_BIEG);
    let S = g.yaw - p.yaw;
    while (S > Math.PI) S -= Math.PI * 2;
    while (S < -Math.PI) S += Math.PI * 2;
    const E = g.pos.clone().sub(p.pos);
    const v = new Quaternion();
    n.parent.getWorldQuaternion(v);
    const w = v.clone().invert();
    const b = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), S);
    const Rq = w.clone().multiply(b).multiply(v);
    const x = E.clone().divideScalar(SKALA_BOHATERA).applyQuaternion(w);
    const T = t.getClip();
    const I = T.tracks.find((U) => U.name === "Hip.position");
    if (I) for (let U = 0; U < I.times.length; U++) { I.values[U * 3] += x.x; I.values[U * 3 + 1] += x.y; I.values[U * 3 + 2] += x.z; }
    const Pq = T.tracks.find((U) => U.name === "Hip.quaternion");
    if (Pq) for (let U = 0; U < Pq.times.length; U++) { y.fromArray(Pq.values, U * 4).premultiply(Rq).normalize(); y.toArray(Pq.values, U * 4); }
    t.reset();
    const D = m(t, POCHYLENIE_BIEG);
    let H = D.yaw - g.yaw;
    while (H > Math.PI) H -= Math.PI * 2;
    while (H < -Math.PI) H += Math.PI * 2;
    this.mixer.stopAllAction();
    this.mixer.setTime(0);
    this.tilt.rotation.x = a;
    const X = D.pos.clone().sub(g.pos);
    return {
      obrotPionowy: +((S * 180) / Math.PI).toFixed(1),
      srodekSwiat: [+E.x.toFixed(3), +E.y.toFixed(3), +E.z.toFixed(3)],
      resztkowyBlad: +((H * 180) / Math.PI).toFixed(2),
      resztkowySrodek: +X.length().toFixed(4),
    };
  }

  /* ── gibanie drzew i kwiatów ──────────────────────────────────────────────── */

  _uderzDrzewa(hx, hz, dx, dz) {
    const lista = this.blockers;
    if (!lista || spokojnyRuch) return;
    const m = Math.hypot(dx, dz);
    if (!(m > 1e-6)) return;
    const dt = this._dtGib || 1 / 60, ZASIEG = 0.95, NACISK = 13; // od planety mocniej: kamera jest dalej, wychył ma być widoczny
    for (const b of lista) {
      const d = b && b.drzewo;
      if (!d) continue;
      const ox = b.x - hx, oz = b.z - hz, od = Math.hypot(ox, oz);
      if (od < 1e-4 || od > b.r + ZASIEG) continue;
      if ((dx * ox + dz * oz) / m <= 0) continue;
      const st = d.userData.gib || (d.userData.gib = { x: 0, z: 0, vx: 0, vz: 0 });
      const bliskosc = Math.min(1, (b.r + ZASIEG - od) / ZASIEG);
      const tempo = Math.min(1, (m * 60) / 3.2);
      const masa = b.skalaDrzewa || 1;
      const sila = ((NACISK * bliskosc * tempo) / masa) * dt;
      st.vx += (ox / od) * sila;
      st.vz += (oz / od) * sila;
    }
  }
  _uderzKwiaty(hx, hz, dx, dz) {
    const K = this.kwiaty;
    if (!K) return;
    const m = Math.hypot(dx, dz);
    if (!(m > 1e-6)) return;
    const dt = this._dtGib || 1 / 60, ZASIEG = 0.78, NACISK = 130;
    for (const k of K.lista) {
      const ox = k.x - hx, oz = k.z - hz, od = Math.hypot(ox, oz);
      if (od < 1e-4 || od > ZASIEG) continue;
      if ((dx * ox + dz * oz) / m <= 0) continue;
      const bliskosc = (ZASIEG - od) / ZASIEG, tempo = Math.min(1, (m * 60) / 3.2);
      const sila = NACISK * bliskosc * tempo * dt;
      k.gib.vx += (ox / od) * sila;
      k.gib.vz += (oz / od) * sila;
    }
  }
  _sprezyna(st, K, T, MAX, dt, eps, epsV) {
    st.vx += (-K * st.x - T * st.vx) * dt;
    st.vz += (-K * st.z - T * st.vz) * dt;
    st.x += st.vx * dt;
    st.z += st.vz * dt;
    if (st.x > MAX) { st.x = MAX; st.vx *= -0.2; } else if (st.x < -MAX) { st.x = -MAX; st.vx *= -0.2; }
    if (st.z > MAX) { st.z = MAX; st.vz *= -0.2; } else if (st.z < -MAX) { st.z = -MAX; st.vz *= -0.2; }
    if (Math.abs(st.x) < eps && Math.abs(st.z) < eps && Math.abs(st.vx) < epsV && Math.abs(st.vz) < epsV) st.x = st.z = st.vx = st.vz = 0;
  }
  ustawZasiew(wlaczony) {
    this.zasiewWlaczony = !!wlaczony;
    this._zasiewOstatnia = null;
    this._zasiewDroga = 0;
  }
  _zasiejZaLiskiem() {
    if (!this.hero || !this.kwiaty || !this.zasiewWlaczony) return;
    if (!this._zasiewOstatnia) { this._zasiewOstatnia = this.hn.clone(); return; }
    const dystans = Math.acos(clamp(this.hn.dot(this._zasiewOstatnia),-1,1))*this.planeta.R;
    this._zasiewOstatnia.copy(this.hn);
    /* W WODZIE NIC NIE ROŚNIE. Brodzący lisek zostawiał za sobą kwiaty i kępki
       trawy na dnie stawu — a ślad po wodzie to mokre krople, nie łąka.
       Stan liczy `mokreslady.js` przy okazji wilgoci, więc nie robimy tego
       samego testu drugi raz. Zerujemy też przebytą drogę: po wyjściu na brzeg
       ma się zacząć nowy odcinek, a nie wypaść od razu kwiatek za cały postój
       w wodzie. */
    if (this.mokreSlady?.wWodzie) { this._zasiewDroga = 0; return; }
    // Teleports and cutscene repositioning should not draw a flower trail.
    if (dystans > 2 || this._kino || this.sequence) { this._zasiewDroga=0; return; }
    if (dystans < .00001) return;
    this._zasiewDroga += dystans;
    if (this._zasiewDroga < .70) return;
    this._zasiewDroga %= .70;
    const n = this.planeta.punktObok(this.hn, this.hf, -.55, this._zasiewN ||= new Vector3());
    const bok = (this._zasiewBok ||= new Vector3()).crossVectors(n,this.hf).normalize();
    this.planeta.punktObok(n,bok,(this._zasiewStrona = !this._zasiewStrona) ? .18 : -.18,n);
    const p = this.planeta.zKuli((this._zasiewP ||= new Vector3()).copy(n).multiplyScalar(this.planeta.R));
    if (!this.onBridge(p.x,p.z) || this.mapa.most.ukryty) this.kwiaty.posadz(p.x,p.z,spokojnyRuch);
  }
  _gibKwiaty(dt) {
    const K = this.kwiaty;
    if (!K) return;
    let ruszone = false;
    for (const k of K.lista) {
      const st = k.gib;
      if (!st.x && !st.z && !st.vx && !st.vz) continue;
      this._sprezyna(st, 52, 4.6, 1.05, dt, 3e-4, 3e-3);
      K.odswiez(k);
      ruszone = true;
    }
    if (ruszone) K.oznacz();
  }
  _gibDrzew(dt) {
    for (const b of this.blockers || []) {
      const d = b && b.drzewo;
      if (!d) continue;
      const st = d.userData.gib;
      if (!st || (!st.x && !st.z && !st.vx && !st.vz)) continue;
      const masa = b.skalaDrzewa || 1;
      this._sprezyna(st, 40 / masa, 4.6, 0.26 / masa, dt, 2e-4, 2e-3);
      d.rotation.z = -st.x;
      d.rotation.x = st.z;
      /* POMOST JEDZIE Z DRZEWEM. Domek stoi na własnej kotwicy (o 0,10 wyżej),
         więc nie jest dzieckiem tej grupy — ale leży na konarze i musi się
         przechylać razem z nim, inaczej platforma zsuwa się z gałęzi. Oba
         obroty idą wokół tego samego pionu w podstawie pnia; różnica kotwic
         daje błąd rzędu dwóch centymetrów, czyli mniej niż grubość deski. */
      if (b.domkowe && this._gibanaBudowla) {
        this._gibanaBudowla.rotation.z = d.rotation.z;
        this._gibanaBudowla.rotation.x = d.rotation.x;
      }
    }
  }

  /* ── ruch bohatera ────────────────────────────────────────────────────────── */

  /** Przelicza `hp` (współrzędne mapy) z normalnej bohatera. */
  aktualizujHp() {
    const p = this.planeta.zKuli(this._v1.copy(this.hn).multiplyScalar(this.planeta.R));
    this.hp.x = p.x;
    this.hp.z = p.z;
  }

  /**
   * Krok po kuli w stronę stycznej `kier` o `dystans`. Gdy pełny krok jest
   * zablokowany, próbuje ślizgu wzdłuż osi ekranu (jak dawniej x-only / z-only).
   */
  moveKula(kier, dystans) {
    const x0 = this.hp.x, z0 = this.hp.z;
    const n = this._vm1 || (this._vm1 = new Vector3());
    const f = this._vm2 || (this._vm2 = new Vector3());
    const proba = (t, d) => {
      n.copy(this.hn);
      f.copy(t);
      this.planeta.przesunPoKuli(n, f, d);
      return this.canWalkN(n);
    };
    const przyjmij = () => {
      this.hn.copy(n);
      doStycznej(this.hf, this.hn);
      this.aktualizujHp();
      return true;
    };
    // Drzewa i kwiaty dostają ZAMIERZONY krok, zanim kolizja go utnie —
    // choinka ma się bujać także wtedy, gdy lisek w nią wbiega i stoi.
    {
      const zamiar = this._zamiar || (this._zamiar = { x: 0, z: 0, h: 0 });
      n.copy(this.hn);
      f.copy(kier);
      this.planeta.przesunPoKuli(n, f, dystans);
      const cel = this.planeta.zKuli(this._v1.copy(n).multiplyScalar(this.planeta.R), zamiar);
      this._uderzDrzewa(x0, z0, cel.x - x0, cel.z - z0);
      this._uderzKwiaty(x0, z0, cel.x - x0, cel.z - z0);
    }
    if (!this.canWalkN(this.hn) || proba(kier, dystans)) return przyjmij();
    // ślizg: składowe wzdłuż osi kamery rzutowanych na płaszczyznę styczną
    const a = this.stycznaZeSwiata(this.camRight, this._vm3 || (this._vm3 = new Vector3()));
    const b = this.stycznaZeSwiata(this.camFwd, this._vm4 || (this._vm4 = new Vector3()));
    const ka = kier.dot(a), kb = kier.dot(b);
    if (Math.abs(ka) > 1e-3 && proba(a, dystans * ka)) return przyjmij();
    if (Math.abs(kb) > 1e-3 && proba(b, dystans * kb)) return przyjmij();
    return false;
  }

  /** Kierunek ze świata (np. oś kamery) → styczna w punkcie bohatera (układ planety). */
  stycznaZeSwiata(w, cel) {
    this._qTmp.copy(this.swiat.quaternion).invert();
    cel.copy(w).applyQuaternion(this._qTmp);
    return doStycznej(cel, this.hn);
  }

  setLocomotion(e) {
    this.moveSpeed = e;
    if (e < 0.05) { this.play("idle", 0.28); return; }
    const t = trybBiegu === "clip" && !!this.actions[KLIP_BIEG];
    const n = this.current === KLIP_BIEG;
    if (t && (n ? e > PROG_BIEG_WYJSCIE : e > PROG_BIEG_WEJSCIE)) {
      const r = this.actions[KLIP_BIEG];
      r.timeScale = clamp(e / DL_KROKU_BIEG, 0.55, MAX_TEMPO_KLIPU);
      this.play(KLIP_BIEG, 0.26, true);
    } else {
      const r = this.actions[KLIP_CHOD];
      r.timeScale = clamp(e / DL_KROKU_CHOD, 0.6, MAX_TEMPO_KLIPU);
      this.play(KLIP_CHOD, 0.24, true);
    }
  }

  moveFree(e) {
    const t = this.input.length();
    const cn = this.mapa.latarnia.pos;
    if (t < MARTWA_STREFA) {
      this.holdTime = Math.max(0, this.holdTime - e * 3);
      this.holdDir = null;
      this.setRunFlag(false);
      this.setLocomotion(0);
      const y = this.planeta.odleglosc(this.hn, this.latarniaN);
      if (!this.celebrated && y < 2.4) {
        this.idleAtLantern += e;
        if (this.idleAtLantern > 0.35) this.startCelebration();
      } else this.idleAtLantern = 0;
      return;
    }
    this.idleAtLantern = 0;
    const n = clamp((t - MARTWA_STREFA) / (1 - MARTWA_STREFA), 0, 1);
    const i = V_CHOD * (0.45 + 0.55 * n);
    const r = Math.atan2(this.input.x, this.input.y);
    if (this.holdDir !== null) {
      let y = r - this.holdDir;
      while (y > Math.PI) y -= Math.PI * 2;
      while (y < -Math.PI) y += Math.PI * 2;
      if (Math.abs(y) > KAT_ZMIANY_KIERUNKU) this.holdTime = 0;
    }
    this.holdDir = r;
    if (n >= PROG_TRZYMANIA) this.holdTime = Math.min(CZAS_DO_BIEGU + CZAS_ROZBIEGU + 0.5, this.holdTime + e);
    else this.holdTime = Math.max(0, this.holdTime - e * 2);
    const a = clamp((this.holdTime - CZAS_DO_BIEGU) / CZAS_ROZBIEGU, 0, 1);
    const o = a * a * (3 - 2 * a);
    const l = V_CHOD + (V_BIEG - V_CHOD) * o;
    const c = Math.max(i, n >= PROG_TRZYMANIA ? l : 0);
    this.setRunFlag(c > V_CHOD * 1.5);
    const h = this._dirTmp || (this._dirTmp = new Vector3());
    h.copy(this.camRight).multiplyScalar(this.input.x / t).addScaledVector(this.camFwd, this.input.y / t).normalize();
    const m = this.stycznaZeSwiata(h, this._dirMap || (this._dirMap = new Vector3()));
    const u = this.moveKula(m, c * e);
    this.blockedFor = u ? 0 : (this.blockedFor || 0) + e;
    this.setLocomotion(this.blockedFor > 0.3 ? 0 : c);
    this.obrocKu(m, 11, e);
    const dl = this.planeta.odleglosc(this.hn, this.latarniaN);
    if (this.celebrated && dl > 4) this.celebrated = false;
  }

  /** Płynnie obraca przód bohatera ku stycznej `cel` (tempo jak dawne exp(-k·dt)). */
  obrocKu(cel, tempo, e) {
    const kat = katMiedzy(this.hf, cel, this.hn);
    obrocStyczna(this.hf, this.hn, kat * (1 - Math.exp(-tempo * e)));
    doStycznej(this.hf, this.hn);
    return kat;
  }

  /** Styczna w punkcie bohatera skierowana do punktu mapy (x, z). */
  stycznaDoMapy(x, z, cel) {
    const q = this.planeta.normalna(x, z, this._v2);
    return stycznaDo(this.hn, q, this.hf, cel);
  }

  /** Kurs bohatera w świecie (radiany, jak dawne `rotation.y`) — do kina i debugowania. */
  get heading() {
    const f = this._v3.copy(this.hf).applyQuaternion(this.swiat.quaternion);
    return Math.atan2(f.x, f.z);
  }
  set heading(_) {}

  setActive(e) {
    for (const t of this.$$(".scena3d-controls button")) t.classList.toggle("active", t.dataset.akcja === e);
  }

  /** Dotknięcie ekranu: znak → reakcja; teren → dojście do najbliższego punktu ścieżki. */
  tapAt(e, t) {
    const n = this.canvas.getBoundingClientRect();
    const i = new Vector2(((e - n.left) / n.width) * 2 - 1, -((t - n.top) / n.height) * 2 + 1);
    this.raycaster.setFromCamera(i, this.camera);
    const r = this.raycaster.intersectObjects((this.markers || []).map((c) => c.hit), false);
    if (r.length) {
      const c = r[0].object.userData.marker;
      c.def.absorb ? this.enterMarker(c, true) : this.touchMarker(c, true);
      return;
    }
    const z = this.raycaster.intersectObject(this.ziemia, false);
    if (!z.length) return;
    const lok = this.swiat.worldToLocal(z[0].point.clone());
    const p = this.planeta.zKuli(lok);
    const a = new Vector3(p.x, 0, p.z);
    const { t: o, dist: l } = this.najblizszyPunktSciezki(a);
    if (l > 4.5) return;
    this.mode = "goto";
    this.input.set(0, 0);
    this.heroT = this.najblizszyPunktSciezki(new Vector3(this.hp.x, 0, this.hp.z)).t;
    this.startWalk(o);
    const cel = this.punktSciezki(o);
    this.planeta.ustaw(this.markerKotwica, cel.x, cel.z, this.groundHeightAt(cel.x, cel.z), 0);
    this.markerPulse = 1;
  }

  touchMarker(e, t = false) {
    if (!e || !e.touch(t)) return;
    // Toast sceny tylko wtedy, gdy znak naprawde go ma. Czarodziej go nie ma:
    // o jego stanie mowi komunikat o ZADANIU z huba, a dwa napisy naraz
    // (ogolny na gorze, konkretny na dole) to jeden za duzo.
    if (e.def.toast) this.hint(e.def.toast);
    this.touched = (this.touched || []).concat(e.id);
    this.emit("znak:dotkniety", { znak: e.id, etykieta: e.def.label, palcem: t });
    try { navigator.vibrate?.([14, 40, 20]); } catch {}
    if (t && !this.walking && !this.sequence) { this.play("happy", 0.12); this.sequence = "happy"; this.seqTimer = 0; }
  }

  enterMarker(e, t = false) {
    if (!e || !e.startAbsorb(t)) return;
    if (e.def.toast) this.hint(e.def.toast);
    this.touched = (this.touched || []).concat(e.id);
    this.emit("minigra:start", { znak: e.id, etykieta: e.def.label, palcem: t, poDomknieciu: 0.95 });
    try { navigator.vibrate?.([18, 50, 26]); } catch {}
    if (this.input.lengthSq() < 0.02 && (this.moveSpeed || 0) < 0.05 && !this.walking && !this.sequence) {
      this.play("happy", 0.12);
      this.sequence = "happy";
      this.seqTimer = 0;
    }
  }

  hint(e, t = 2200) {
    const n = this.$(".scena3d-hint span");
    if (!n) return;
    if (!this._hintBase) this._hintBase = n.textContent;
    n.textContent = e;
    clearTimeout(this._hintT);
    this._hintT = setTimeout(() => { n.textContent = this._hintBase; }, t);
  }

  startWalk(e) {
    this.targetT = e;
    this.walking = Math.abs(e - this.heroT) > 0.05;
    this.sequence = null;
    if (this.walking) this.play("walk");
  }
  stopWalk() {
    this.walking = false;
    this.sequence = null;
    this.input.set(0, 0);
    this.inputSource = null;
    this.holdTime = 0;
    this.holdDir = null;
    this.setRunFlag(false);
    this.keys.clear();
    this.hideStick();
    this.play("idle");
  }
  goToLantern() {
    this.celebrated = false;
    this.mode = "goto";
    this.input.set(0, 0);
    this.heroT = this.najblizszyPunktSciezki(new Vector3(this.hp.x, 0, this.hp.z)).t;
    this.startWalk(this.tLatarni);
  }
  replayWalk() {
    this.celebrated = false;
    this.mode = "goto";
    this.input.set(0, 0);
    this.placeHero(0, true);
    this.startWalk(this.tLatarni);
  }

  placeHero(e, natychmiast = false) {
    this.heroT = e;
    let n = this.punktSciezki(e);
    const st = this.mapa.start;
    if (st?.pos && e === 0) n = new Vector3(st.pos[0], 0, st.pos[1]);
    this.planeta.normalna(n.x, n.z, this.hn);
    this.aktualizujHp();
    this.groundY = this.groundHeightAt(n.x, n.z);
    this.lean = 0;
    if (this.tilt) this.tilt.rotation.x = 0;
    this.heroLift = this.groundY + (this.clipY?.idle ?? this.footOffset);
    const i = this.punktSciezki(Math.min(this.dlSciezki, e + 0.3));
    const kurs = st?.obrot != null && e === 0 ? st.obrot : Math.atan2(i.x - n.x, i.z - n.z);
    // przód z kursu w ramce mapy (na starcie mapa i kula pokrywają się)
    this.hf.set(Math.sin(kurs), 0, Math.cos(kurs)).applyQuaternion(this.planeta.ramka(n.x, n.z, this._qTmp));
    doStycznej(this.hf, this.hn);
    if (natychmiast) {
      this.planeta.obrotPodPunkt(this.hp.x, this.hp.z, this.swiat.quaternion);
      this.camPos.copy(this.camTarget).add(this.camDir);
      this.camera.position.copy(this.camPos);
      this.camera.lookAt(this.camTarget);
    }
    this.syncHero();
  }

  /** Przenosi bohatera (pozycja mapy + wysokość + kurs) na kulę. */
  syncHero() {
    if (!this.hero) return;
    this.planeta.ustawN(this.hero, this.hn, this.hf, this.heroLift);
  }

  startCelebration() {
    this.emit("latarnia:reakcja", { faza: "obrot" });
    this.celebrated = true;
    this.walking = false;
    this.sequence = "turning";
    this.seqTimer = 0;
    this.play("turn", 0.15);
  }

  spawnSparkles() {
    const e = new SphereGeometry(0.05, 6, 5);
    const t = new MeshBasicMaterial({ color: 16771496, transparent: true });
    for (let n = 0; n < 10; n++) {
      const i = new Mesh(e, t.clone());
      i.position.set(-0.6, 1.7, 0);
      const r = (n / 10) * Math.PI * 2;
      i.userData = { vel: new Vector3(Math.cos(r) * 0.9, 1.4 + Math.random(), Math.sin(r) * 0.9), life: 1 };
      this.sparkleGrupa.add(i);
      this.sparkles.push(i);
    }
  }

  /* ── pętla ────────────────────────────────────────────────────────────────── */

  tick() {
    const e = Math.min(0.05, this.clock.getDelta());
    const t = V_CHOD;
    this._dtGib = e;
    this._gibDrzew(e);
    this._gibKwiaty(e);
    this.kwiaty?.aktualizujZasiew(e, spokojnyRuch);
    if (!spokojnyRuch) this.nurtTik(e);

    if (this.stick?.active) {
      /* joystick prowadzi */
    } else if (this.keys.size) {
      this.readKeys();
      this.enterFreeMode();
    } else if (this.inputSource === "keys") {
      this.input.set(0, 0);
      this.inputSource = null;
    }
    if (this.mode === "free" && !this.sequence) this.moveFree(e);
    if (!this.walking && this.mode !== "free") this.moveSpeed = 0;

    if (this.walking) {
      const u = Math.sign(this.targetT - this.heroT);
      this.heroT += u * t * e;
      if ((u > 0 && this.heroT >= this.targetT) || (u < 0 && this.heroT <= this.targetT)) {
        this.heroT = this.targetT;
        this.walking = false;
        if (!this.celebrated && Math.abs(this.heroT - this.tLatarni) < 0.6) this.startCelebration();
        else this.play("idle");
        this.emit("bohater:doszedl", { x: +this.hp.x.toFixed(2), z: +this.hp.z.toFixed(2), latarnia: Math.abs(this.heroT - this.tLatarni) < 0.6 });
      }
      this.moveSpeed = t;
      const d = this.punktSciezki(this.heroT);
      this.planeta.normalna(d.x, d.z, this.hn);
      doStycznej(this.hf, this.hn);
      this.aktualizujHp();
      const f = this.punktSciezki(clamp(this.heroT + 0.35 * (u || 1), 0, this.dlSciezki));
      if (f.distanceToSquared(d) > 1e-6) {
        const cel = this.stycznaDoMapy(f.x, f.z, this._v1);
        if (u < 0) cel.negate();
        this.obrocKu(cel, 10, e);
      }
    }

    if (this.sequence === "turning") {
      this.seqTimer += e;
      const cel = stycznaDo(this.hn, this.latarniaN, this.hf, this._v1);
      const u = this.obrocKu(cel, 6, e);
      if (this.seqTimer > 0.5 && Math.abs(u) < 0.08) {
        this.sequence = "happy";
        this.seqTimer = 0;
        this.play("happy", 0.12);
        this.spawnSparkles();
      }
    } else if (this.sequence === "happy") {
      this.seqTimer += e;
      if (this.seqTimer > 1.55) { this.sequence = null; this.idleAtLantern = 0; this.play("idle", 0.3); }
    } else if (this.sequence === "wspinaczka") {
      this._wspinaczkaKlatka(e);
    }

    // pochylenie w biegu
    let n;
    if (this.sequence || !this.moveSpeed) n = 0;
    else if (this.current === KLIP_BIEG) n = POCHYLENIE_BIEG;
    else n = POCHYLENIE_MAX * clamp((this.moveSpeed - V_CHOD * 0.8) / (V_BIEG - V_CHOD * 0.8), 0, 1);
    this.lean = dogon(this.lean || 0, n, 6, e);
    if (this.tilt) this.tilt.rotation.x = this.lean;

    // wysokość nad terenem (most) i stopy
    const i = this.groundHeightAt(this.hp.x, this.hp.z);
    this.groundY = dogon(this.groundY, i, 9, e);
    const r = this.clipY?.[this.current] ?? this.footOffset;
    this.footOffset = dogon(this.footOffset, r, 12, e);
    const a = (this.leanDip || 0) * Math.max(0, (this.lean || 0) / POCHYLENIE_MAX);
    this.heroLift = this.groundY + this.footOffset + a + (this._wspDodatek || 0);
    this.syncHero();
    /* Ślady PO `syncHero` (dopiero tam `hn` jest pozycją z tej klatki),
       ale PRZED sianiem: `tik` liczy przy okazji, czy bohater stoi w wodzie,
       a `_zasiejZaLiskiem` tę odpowiedź czyta. Odwrotna kolejność dawałaby ją
       spóźnioną o klatkę i przy samym brzegu zdążyłby wyrosnąć kwiatek w stawie.
       Kino i sekwencje wstrzymują stawianie: przelot kamery nad planetą to
       nie jest marsz i nie ma po nim zostawać mokra ścieżka. */
    this.mokreSlady?.tik(e, this.hn, this.hf, this.oczka, !!(this._kino || this.sequence));
    this._zasiejZaLiskiem();

    // PLANETA dogania bohatera — to jest „obrót kuli na wszystkie strony".
    // Jak kula śledząca (trackball): najmniejszy obrót, który przenosi
    // aktualną „górę" bohatera na +Y świata — bez skręcania wokół pionu.
    // Dzięki temu nie ma osobliwości i planetę da się obejść dookoła.
    /* PODGLĄD MIEJSCA. Kamera w tej grze jest NIERUCHOMA — „przelot" to obrót
       planety. Wystarczy więc na chwilę podmienić punkt, który ma wjechać na
       górę kuli: zamiast normalnej bohatera bierzemy mieszankę jego normalnej
       i normalnej pokazywanego miejsca. Zero osobnego toru kamery, zero
       drugiego układu współrzędnych — a widać dokładnie to, co trzeba. */
    let nGora = this.hn;
    const wPod = this._podgladTik(e);
    if (wPod > 0) nGora = this._v3.copy(this.hn).lerp(this._podglad.n, wPod).normalize();
    const u = this._v1.copy(nGora).applyQuaternion(this.swiat.quaternion);
    this._qTmp.setFromUnitVectors(u, this._v2.set(0, 1, 0));
    this.obrotCel.copy(this._qTmp).multiply(this.swiat.quaternion);
    const tempo = spokojnyRuch ? 30 : (wPod > 0 ? TEMPO_PODGLADU : TEMPO_OBROTU);
    this.swiat.quaternion.slerp(this.obrotCel, 1 - Math.exp(-tempo * e));
    this.korektaPolnocy(e);

    // Światło liczymy PO obrocie planety — kierunek słońca w świecie wynika
    // z tego, jak planeta stoi w tej klatce.
    if (this.mapa.cienie && this.hero && !this._cienieBohatera) {
      this._cienieBohatera = true;
      this.hero.traverse((o) => { if (o.isMesh || o.isSkinnedMesh) o.castShadow = true; });
      // Plama pod bohaterem byłaby teraz drugim, nieprawdziwym cieniem.
      if (this.heroShadow) this.heroShadow.visible = false;
    }
    if (this.chmury) this.chmury.aktualizuj(e, this.doba?.stan || null, this.moveSpeed || 0);
    if (this.doba) {
      const pora = this.doba.aktualizuj(this.hn, this.swiat.quaternion, e);
      if (pora !== this._pora) {
        this._pora = pora;
        this.emit("doba:pora", { pora, ...this.doba.stan });
      }
      /* ETAP SESJI to osobne zdarzenie, nie odmiana `doba:pora` — bo to nie
         jest informacja o wyglądzie nieba, tylko o tym, że sesja dobiega
         końca. Hub podpina się pod nie i nie musi zgadywać z barw, czy
         „zmierzch" znaczy jeszcze zabawę, czy już pożegnanie. Leci RAZ na
         etap; odliczania nie wysyłamy w ogóle i nie ma go co pokazywać. */
      const etap = this.doba.etapSesji;
      if (etap !== this._etapSesji) {
        this._etapSesji = etap;
        this.emit("doba:sesja", { etap, ...this.doba.stan });
      }
    }

    this.camPos.copy(this.camTarget).add(this.camDir);
    this._kinoKlatka(e);
    this._wejscieKlatka(e);
    this._nocKlatka(e);
    this._opadKlodKlatka(e);
    this.camera.position.copy(this.camPos);
    this.camera.lookAt(this._kc.x, this._kc.y, this._kc.z);

    const l = spokojnyRuch ? 0.3 : 1;
    const poraTeraz = this.doba?.stan || null;
    for (const u of this.markers || []) {
      // BRAMA PORY DNIA. Próg 0,35 zamiast twardego „noc/dzień": świetliki
      // zapalają się już o zmierzchu, a gasną dopiero po świcie, więc dziecko
      // widzi, jak przychodzą i odchodzą, zamiast zastawać je gotowe.
      if (u.def.pora && poraTeraz) {
        u.ustawAktywny(u.def.pora === "noc" ? poraTeraz.noc > 0.35 : poraTeraz.dzien > 0.35);
      }
      const d = this.planeta.odleglosc(this.hn, u.n);
      u.update(e, l, d);
      if (u.aktywny === false) continue;

      // ODPOWIEDŹ ŚWIATA (brief §7, warstwa 3). Martwy obiekt reaguje na to,
      // ILE światła niesie bohater — dzięki temu licznik czyta się z celu,
      // a nie z cyfry. Zero światła = kamień, bez ruchu.
      if (u.def.reagujeNaSwiatlo && this.swiatlo) {
        const ile = this.swiatlo.ile;
        const blisko = Math.max(0, 1 - d / 7);
        const puls = ile >= 3 ? 1 : 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(this._czasGry * 2.4));
        const moc = (ile / 3) * puls * (0.35 + 0.65 * blisko);
        if (u.light) u.light.intensity = moc * 3.2;
        if (u.halo?.material) u.halo.material.opacity = moc * 0.55;
        if (ile === 0) { if (u.light) u.light.intensity = 0; if (u.halo?.material) u.halo.material.opacity = 0; }
      }

      if (d < (u.def.zasieg ?? 1) && !this._kino) {
        // ZBIERANIE ŚWIATŁA. Gdy komplet już jest, świetlik zostaje na mapie —
        // nie znika w nic, bo dziecko dostałoby karę za nadmiar.
        if (u.def.zbiera === "swiatlo") {
          if (this.swiatlo.komplet) continue;
          if (u.state === "idle" && this.swiatlo.dodaj()) {
            this.emit("swiatlo:zebrane", { ile: this.swiatlo.ile, komplet: this.swiatlo.komplet });
          }
        }
        u.def.absorb ? this.enterMarker(u) : this.touchMarker(u);
      }
    }
    if (this.swiatlo) this.swiatlo.aktualizuj(e);
    if (this.kropla) this.kropla.aktualizuj(e);
    this._fasolaTik(e);
    this._rabanieTik(e);
    this._transportTik(e);
    this._poswiataTik(e);
    this._sladTik(e);
    if (this.dymki) this.dymki.aktualizuj(e, this.hn, this.hf, this.doba?.stan || null);
    if (this.motyle) this.motyle.aktualizuj(e, this.hp, this.doba?.stan || null, spokojnyRuch);
    this._czasGry = (this._czasGry || 0) + e;

    if (this.heroShadowKotwica) {
      const gy = this.groundHeightAt(this.hp.x, this.hp.z);
      this.planeta.ustawN(this.heroShadowKotwica, this.planeta.punktObok(this.hn, this.hf, 0.18, this._v1), this.hf, gy);
      const lift = Math.max(0, this.heroLift - gy - 0.02);
      const k = 1 + clamp(lift, 0, 0.35) * 0.7;
      this.heroShadow.scale.set(k, k, 1);
      this.heroShadow.material.opacity = clamp(1 - lift * 1.1, 0.5, 1);
    }
    if (this.markerPulse > 0) {
      this.markerPulse = Math.max(0, this.markerPulse - e * 1.4);
      this.marker.material.opacity = this.markerPulse * 0.9;
      const u = 1 + (1 - this.markerPulse) * 0.7;
      this.marker.scale.set(u, u, 1);
    }
    for (let u = this.sparkles.length - 1; u >= 0; u--) {
      const d = this.sparkles[u];
      d.userData.life -= e * 0.9;
      d.userData.vel.y -= e * 1.6;
      d.position.addScaledVector(d.userData.vel, e);
      d.material.opacity = Math.max(0, d.userData.life);
      if (d.userData.life <= 0) { this.sparkleGrupa.remove(d); this.sparkles.splice(u, 1); }
    }
    const c = this.lantern.userData;
    const h = 1 + Math.sin(performance.now() * 0.003) * 0.12;
    c.light.intensity = 9 * h;
    c.glassMat.emissiveIntensity = 1.1 * h;
    this.mixer?.update(e);
    this.renderer.render(this.scene, this.camera);
  }

  /**
   * KOREKTA PÓŁNOCY. Trackball nie skręca wokół pionu, więc po pętli wokół
   * planety mapa mogłaby stanąć bokiem. Tu powoli „dokręcamy" ją tak, żeby
   * mapowe +x znów biegło w prawo ekranu — ale tylko w głównej krainie:
   * blisko antypodu ramka mapy jest osobliwa i korekta wygasa (waga → 0).
   * Wolniej w ruchu (żeby nie kręciło pod nogami), szybciej gdy lisek stoi.
   */
  korektaPolnocy(e) {
    const r = Math.hypot(this.hp.x, this.hp.z);
    const a = r / this.planeta.R;
    const waga = clamp((2.4 - a) / 0.8, 0, 1); // pełna do ~90°, zero od ~140°
    if (waga <= 0) return;
    const ex = this._v1.set(1, 0, 0)
      .applyQuaternion(this.planeta.ramka(this.hp.x, this.hp.z, this._qTmp))
      .applyQuaternion(this.swiat.quaternion);
    const yaw = Math.atan2(ex.z, ex.x); // 0 = mapa „północą do góry"
    if (Math.abs(yaw) < 1e-4) return;
    const tempo = (this.moveSpeed || 0) > 0.05 ? KOREKTA_W_RUCHU : KOREKTA_W_SPOCZYNKU;
    // obrót o +θ wokół Y zmniejsza kąt yaw o θ (three.js: prawoskrętny)
    const krok = yaw * (1 - Math.exp(-tempo * waga * e));
    this._qTmp.setFromAxisAngle(this._v2.set(0, 1, 0), krok);
    this.swiat.quaternion.premultiply(this._qTmp);
  }

  /* ── RĄBANIE: suche drzewka i głazy ──────────────────────────────────────
   *
   * Trzy decyzje, które warto znać przed zmianą:
   *
   * 1. PRACA NIE ZERUJE SIĘ PRZY ODEJŚCIU. Dziecko odbiega, wraca i kończy od
   *    tego miejsca, w którym przerwało. Zerowanie karałoby za rozglądanie
   *    się — a rozglądanie się jest w tej grze celem, nie błędem.
   *
   * 2. WYNIK JEST ZBUDOWANY OD POCZĄTKU, tylko schowany. Podmiana to dwa
   *    `visible`, więc klatka, w której dziecko patrzy najuważniej, nie ma
   *    prawa się zaciąć na budowaniu pięciu kłód.
   *
   * 3. SCENA NIE WIE, CZY ZADANIE TRWA. Melduje tylko „zdobyto surowiec"
   *    (`surowiec:zdobyty`), a co z tym zrobić, decyduje React. Dzięki temu
   *    świat da się testować bez postępu, a postęp bez świata.
   */

  /**
   * Pierścień postępu z piłą — wisi NAD LISKIEM, bo to on pracuje.
   *
   * PŁÓTNO MA 256 px, nie 128. Sprite urósł do 1,05 jednostki i przy 128 px
   * piła robiła się papką: to jest znaczek, na który dziecko patrzy przez całe
   * pięć sekund, więc musi być ostry. Wszystkie wymiary liczone od `S`, żeby
   * następna zmiana rozmiaru nie wymagała przeliczania trzydziestu liczb.
   */
  /**
   * Ikona siekiery do wskaznika pracy — ten sam tor co `_ikonaDomku`.
   * Plik dojezdza asynchronicznie, wiec po zaladowaniu przerysowujemy tarcze
   * ostatnim znanym postepem, zeby nie zostala dziura po ikonie.
   */
  _ikonaSiekiery() {
    if (this._ikSiek !== undefined) return this._ikSiek;
    const im = new Image();
    im.onload = () => { this._wskPracy?.rysuj(this._wskPostep ?? 0); };
    im.onerror = () => { console.warn("[wskaznik] brak ikony siekiery"); this._ikSiek = null; };
    im.src = `${this.opts.zasoby ?? "./assets/"}ikona-siekiera.png`;
    this._ikSiek = im;
    return im;
  }

  /**
   * TLO WSPOLNE DLA WSZYSTKICH WSKAZNIKOW (decyzja wlasciciela 2026-09-16).
   *
   * Wskazniki sa dwa i musza wygladac jak jedna rodzina: wskaznik AKCJI
   * (postep rabania, nad liskiem) i wskaznik MIEJSCA (domek nad placem).
   * Wczesniej kazdy malowal sobie tarcze po swojemu — polprzezroczysty granat
   * przepuszczal jasna trawe i znaczek robil sie wyblakly. Teraz tlo jest
   * JEDNO: nieprzezroczysty bezel z twardym obrysem, ciemna tarcza z gradientem
   * i delikatny polysk. Dzieki temu ikona na wierzchu zawsze ma ten sam,
   * ciemny kontrast pod spoda — niezaleznie od tego, nad czym wisi.
   *
   * Wymiary licza sie od `u = S/100`, czyli w jednostkach projektu
   * (`docs/design-system/wskaznik-scinania.md`). Zmiana rozmiaru plotna nie
   * wymaga przeliczania ani jednej liczby.
   *
   * `pierscien` rysuje warstwe miedzy bezelem a tarcza — u wskaznika akcji
   * jest tam luk postepu, u wskaznika miejsca pelna obwodka.
   */
  _tloWskaznika(g, S, pierscien) {
    const c0 = S / 2, u = S / 100;
    // bezel + twardy obrys calego znaczka
    g.fillStyle = "#211d16";
    g.beginPath(); g.arc(c0, c0, 49.2 * u, 0, Math.PI * 2); g.fill();
    g.lineWidth = 1.5 * u; g.strokeStyle = "#140f09";
    g.beginPath(); g.arc(c0, c0, 49.2 * u, 0, Math.PI * 2); g.stroke();

    if (pierscien) pierscien(g, c0, u);

    // ciemna tarcza: obrys od strony pierscienia + pole z gradientem
    g.fillStyle = "#140f09";
    g.beginPath(); g.arc(c0, c0, 37.7 * u, 0, Math.PI * 2); g.fill();
    const grad = g.createRadialGradient(c0, c0 - 6 * u, 2 * u, c0, c0, 36.7 * u);
    grad.addColorStop(0, "#4a4a53");
    grad.addColorStop(1, "#26262c");
    g.fillStyle = grad;
    g.beginPath(); g.arc(c0, c0, 36.7 * u, 0, Math.PI * 2); g.fill();

    // polysk u gory tarczy
    g.save();
    g.globalAlpha = .06; g.fillStyle = "#ffffff";
    g.beginPath(); g.ellipse(c0, c0 - 18 * u, 25 * u, 13 * u, 0, 0, Math.PI * 2); g.fill();
    g.restore();
    return { c0, u };
  }

  _wskaznikPracy() {
    if (this._wskPracy) return this._wskPracy;
    const S = 256, c0 = S / 2;
    const c = document.createElement("canvas");
    c.width = c.height = S;
    const g = c.getContext("2d");
    /* PRZESTRZEŃ BARW USTAWIONA JAWNIE. Renderer oddaje sRGB, a `Texture`
       domyślnie nie deklaruje przestrzeni — three.js traktuje wtedy piksele
       płótna jak liniowe i NIE robi konwersji. Ciemna tarcza (#211d16,
       gradient #4a4a53→#26262c) wychodziła przez to o kilkadziesiąt procent
       jaśniejsza i wyprana: granat robił się bladym błękitem. Każda inna
       tekstura płótna w tej scenie (doba, dymki, kropla, znak, teren) ma tę
       linię od dawna — te dwa wskaźniki były jedynymi, które jej nie miały. */
    const mapaWsk = new CanvasTexture(c);
    mapaWsk.colorSpace = SRGBColorSpace;
    const spr = new Sprite(new SpriteMaterial({
      map: mapaWsk, depthTest: false, transparent: true,
    }));
    spr.renderOrder = 60;
    spr.scale.setScalar(1.05);
    spr.visible = false;
    spr.rysuj = (p) => {
      p = Math.min(1, Math.max(0, p || 0));
      this._wskPostep = p;
      g.clearRect(0, 0, S, S);
      g.lineCap = "round";
      g.lineJoin = "round";

      /* Tlo wspolne dla wskaznikow, a w warstwie pierscienia — luk postepu.
         Zloto jest ZYWSZE niz bazowy amber UI i ma wewnetrzny blask: to jedyny
         element, ktory ma sie "palic" na jasnej trawie. Pod ostrym lukiem lezy
         rozmyta kopia (shadowBlur), bo sam gradient czytal sie plasko. */
      const { c0, u } = this._tloWskaznika(g, S, (g2, c, u2) => {
        const r = 43.5 * u2, lw = 11 * u2;
        g2.lineWidth = lw;
        g2.strokeStyle = "#5a5326";
        g2.beginPath(); g2.arc(c, c, r, 0, Math.PI * 2); g2.stroke();
        if (p <= 0) return;
        const k0 = -Math.PI / 2, k1 = k0 + Math.PI * 2 * p;
        g2.save();
        g2.shadowColor = "#ffab27";
        g2.shadowBlur = 6 * u2;
        g2.lineWidth = lw; g2.strokeStyle = "#ffab27";
        g2.beginPath(); g2.arc(c, c, r, k0, k1); g2.stroke();
        g2.beginPath(); g2.arc(c, c, r, k0, k1); g2.stroke();
        g2.restore();
        const gr = g2.createLinearGradient(0, c - r, 0, c + r);
        gr.addColorStop(0, "#ffdc4b");
        gr.addColorStop(.52, "#ffdc4b");
        gr.addColorStop(1, "#ff8f1f");
        g2.lineWidth = lw; g2.strokeStyle = gr;
        g2.beginPath(); g2.arc(c, c, r, k0, k1); g2.stroke();
      });

      /* SIEKIERA zamiast rysowanej pily (decyzja wlasciciela 2026-09-16):
         ikona generowana, ten sam plik i ten sam styl, co reszta znaczkow
         (`docs/design-system/styl-ikon-3d.md`). Polozenie z projektu:
         srodek ikony 11 jednostek nad srodkiem tarczy, liczba 20,5 pod nim. */
      const im = this._ikonaSiekiery();
      if (im && im.complete && im.naturalWidth) {
        const bok = 56 * u;
        g.drawImage(im, c0 - bok / 2, c0 - 11 * u - bok / 2, bok, bok);
      }

      g.font = `700 ${Math.round(17 * u)}px "Baloo 2", "Arial Rounded MT Bold", "Trebuchet MS", sans-serif`;
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.save();
      g.shadowColor = "rgba(0,0,0,.45)";
      g.shadowBlur = 3 * u;
      g.shadowOffsetY = 1.5 * u;
      g.fillStyle = "#fff7e6";
      g.fillText(`${Math.round(p * 100)}%`, c0, c0 + 20.5 * u);
      g.restore();

      spr.material.map.needsUpdate = true;
    };
    this.swiat.add(spr);
    this._wskPracy = spr;
    return spr;
  }

  /**
   * PIEŃ DRZEWA DOMKOWEGO — model `tree.glb`.
   *
   * DLACZEGO TEN MODEL (właściciel, 2026-09-16). Jest rzeźbiony pod to jedno
   * miejsce: pień pod skosem, widełki i — najważniejsze — konar biegnący
   * poziomo na wysokości pomostu. Wcześniej stało tu `suche_drzewko.glb`
   * w zastępstwie, a podporę pod deski trzeba było dorysowywać kodem.
   * Zieleń dokłada korona z `swiat.js`, kolor kory — `MAT_PIEN_DOMKU`.
   *
   * SKALA I OBRÓT Z JEDNEGO ŹRÓDŁA: `DOMEK_DRZEWO`. Korona i pomost liczą się
   * z tych samych liczb, więc nie da się ich rozjechać jednym niedopatrzeniem.
   */
  async _wczytajPienDomku() {
    const k = this._kotwicaDomku;
    const def = this.mapa.schronienie;
    if (!k || !def) return;
    try {
      const t = await this.loadGLB("tree");
      if (this.destroyed) return;
      const pien = t.scene.clone(true);
      pien.name = "drzewo-domkowe-pien";
      /* USTAWIENIE PNIA jest w jednym miejscu (`_ustawPien`), bo robi się je
         dwa razy: tu, po wczytaniu modelu, i przy każdym ruchu suwaka. */
      this._ustawPien(pien, def, this._uklad || DOMEK_DRZEWO);
      pien.traverse((o) => {
        if (!o.isMesh) return;
        o.material = MAT_PIEN_DOMKU;
        o.geometry.computeVertexNormals();
      });
      /* PIEŃ WCHODZI DO GRUPY, KTÓRA SIĘ GIBA, a nie do kotwicy.
         `_gibDrzew` obraca `blocker.drzewo` — czyli grupę z koroną. Pień
         dołożony obok niej, prosto do kotwicy, stał jak wryty, kiedy kule
         liści się kołysały: drzewo wyglądało, jakby liście odkleiły się od
         gałęzi. Grupa korony ma początek dokładnie w podstawie pnia, więc
         obrót wypada w tym samym miejscu, w którym drzewo rośnie z ziemi. */
      const gibana = (this.blockers || []).find((b) => b && b.domkowe && b.drzewo)?.drzewo;
      (gibana || k).add(pien);
      this._pienDomku = pien;   // trzymamy, żeby przebudowa korony go nie gubiła
    } catch (blad) {
      // Bez pnia zostaje sama korona z konarem — brzydko, ale świat stoi.
      console.warn("[domek] nie udalo sie wczytac pnia", blad);
    }
  }

  /**
   * Skala, obrót i przesunięcie wczytanego pnia — wszystko z układu.
   *
   * PRZESUNIĘCIE JEST W JEDNOSTKACH KORONY (czyli mnożone przez skalę
   * miejsca, nie przez skalę modelu). Dzięki temu „przesuń pień o 0,2" znaczy
   * to samo co „przesuń kulę liści o 0,2" — inaczej dwa suwaki obok siebie
   * ruszałyby o różne odległości i nie dałoby się ich zestroić.
   */
  _ustawPien(pien, def, u) {
    const sk = def.skala ?? 1;
    pien.scale.setScalar(sk * u.skalaModelu);
    /* OBRÓT USTAWIA KONAR POD POMOST — liczba i uzasadnienie siedzą przy
       `DOMEK_DRZEWO.obrotModelu` w `swiat.js`, razem z wysokością desek
       i zasięgiem konaru, bo wszystkie trzy odczytano z tej samej bryły. */
    pien.rotation.y = u.obrotModelu;
    pien.position.set((u.pienX || 0) * sk, (u.pienY || 0) * sk, (u.pienZ || 0) * sk);
  }

  /**
   * PRZEBUDOWA DOMKOWEGO DRZEWA NA ŻYWO — dla edytora (`edytorDomku.js`).
   *
   * Woła się to po każdym ruchu suwaka, więc musi być TANIE i BEZ MIGANIA:
   * pień zostaje ten sam (wczytany raz, tylko przestawiany), leci wyłącznie
   * korona i pomost. Gdyby przy każdej zmianie wczytywać `.glb` od nowa,
   * drzewo znikałoby na ułamek sekundy przy każdym drgnięciu myszy.
   *
   * `zmiany` to fragment układu — wystarczy `{ poziom: 2.7 }`. Gdy nic nie
   * przyjdzie, przebudowuje z tego, co już jest (po edycji tablicy koron
   * w miejscu).
   */
  przebudujDomek(zmiany) {
    if (zmiany) this._uklad = { ...this._uklad, ...zmiany };
    const u = this._uklad;
    const k = this._kotwicaDomku;
    const b = (this.blockers || []).find((x) => x && x.domkowe);
    if (!k || !b || !u) return;

    const def = this.mapa.schronienie || {};

    /* 0. KOTWICA DRZEWA na nowo, bo zanurzenie korzeni jest jej częścią.
          `zbudujSwiat` ustawił ją raz przy starcie; tu powtarzamy ten sam
          rachunek, żeby suwak „zanurzenie pnia" działał w tej samej klatce. */
    if (Array.isArray(def.pos)) {
      const sk = def.skala ?? 1;
      const h = this.wysokoscGruntuSiatki
        ? this.wysokoscGruntuSiatki(def.pos[0], def.pos[1])
        : this.groundHeightAt(def.pos[0], def.pos[1]);
      this.planeta.ustaw(k, def.pos[0], def.pos[1],
        h - (u.zanurzeniePnia ?? DOMEK_DRZEWO.zanurzeniePnia) * sk, def.obrot ?? 0);
    }

    // 1. Pień: nowa skala i obrót, nic więcej. Wyjmujemy go ze starej korony,
    //    zanim ta pójdzie do kosza razem ze swoimi geometriami.
    const pien = this._pienDomku;
    if (pien) {
      pien.parent?.remove(pien);
      this._ustawPien(pien, def, u);
    }

    // 2. Korona od nowa.
    if (b.drzewo) {
      k.remove(b.drzewo);
      b.drzewo.traverse((o) => { o.geometry?.dispose?.(); });
    }
    const nowa = drzewoDomkowe(def.skala ?? 1, u);
    if (pien) nowa.add(pien);
    k.add(nowa);
    b.drzewo = nowa;

    // 3. Pomost — tylko jeśli stoi. `ustawSchronienie` sam czyta `this._uklad`.
    if (this._etapSchronienia > 0) this.ustawSchronienie(this._etapSchronienia, false);
    return u;
  }

  /** Bieżący układ domku — edytor czyta stąd wartości do suwaków. */
  ukladDomku() { return this._uklad; }

  /** Świeża kopia wartości z kodu — przycisk „Domyślne" w edytorze. */
  ukladDomkuDomyslny() { return ukladDomku(null); }

  /**
   * Otwiera (albo zamyka) panel z suwakami do domkowego drzewa.
   *
   * MODUŁ DOJEŻDŻA NA ŻĄDANIE. To narzędzie właściciela, a nie część gry —
   * `import()` w tym miejscu trzyma jego kod poza paczką, którą pobiera
   * dziecko, dopóki nikt go nie zawoła.
   */
  async edytorDomku() {
    try {
      const m = await import("./edytorDomku.js");
      return m.otworzEdytorDomku(this);
    } catch (blad) {
      console.warn("[domek] edytor sie nie otworzyl", blad);
      return null;
    }
  }

  /**
   * KAŻDE DRZEWO NA MAPIE DA SIĘ ŚCIĄĆ (decyzja właściciela 2026-09-16).
   *
   * Wcześniej ścinało się JEDNO wskazane w mapie suche drzewko. Było w tym
   * ukryte założenie, że dziecko trafi akurat tam — a ono chodzi po planecie
   * i widzi piętnaście drzew, z których czternaście nie reaguje. Teraz celem
   * jest każde; TYM JEDNYM staje się to, przy którym dziecko stanie i zacznie
   * piłować. Do zadania potrzeba jednego drzewa (`CEL_DRZEWKA`), więc po
   * pierwszym ścięciu reszta i tak przestaje być potrzebna.
   *
   * SKĄD LISTA DRZEW. Scena nie trzyma ich osobno — jedynym miejscem, w którym
   * są wszystkie, jest tablica `blockers`: `zbudujSwiat` wpisuje tam każde
   * drzewo razem z referencją do bryły (`drzewo`) i jego skalą. Stąd
   * `skalaDrzewa` jako miara, ile z niego zostanie drewna.
   *
   * ID Z POZYCJI, nie z indeksu listy. Zapis zadania pamięta, CO zostało
   * zużyte; gdyby id szło z kolejności w `mapa.drzewa`, dopisanie jednego
   * drzewa przesunęłoby wszystkie i ścięte okazałoby się nagle innym.
   */
  _zarejestrujDrzewa() {
    for (const b of this.blockers || []) {
      if (!b || !b.drzewo || b.domkowe) continue;
      const sk = b.skalaDrzewa || 1;
      const pos = [b.x, b.z];
      const id = `drzewo-${b.x.toFixed(2)}-${b.z.toFixed(2)}`;

      /* WYNIK BUDUJE SIĘ OD RAZU, tylko jest schowany — tak samo jak przy
         suchym drzewku. Gdyby powstawał w chwili ścięcia, pierwsze ścięcie
         zacinałoby klatkę akurat w sekundzie, w której dziecko patrzy
         najuważniej. */
      const wynik = new Group();
      wynik.visible = false;
      wynik.name = `wynik-${id}`;
      /* Skala stosu liczona OD DRZEWA: z sosny o skali 1,3 nie może zostać
         kupka wielkości kamyka. 1,2 daje mniej więcej metr w poprzek — tyle,
         ile zajmują trzy kłody. */
      const skalaStosu = sk * 1.2;
      wynik.add(this._osadz(stosDrewna(skalaStosu), pos[0] + .72, pos[1] + .3, .05, .4));
      wynik.add(this._osadz(pieniek(sk * 1.05), pos[0], pos[1], .04, 0));
      this.swiat.add(wynik);

      const posWyniku = [pos[0] + .72, pos[1] + .3];
      this._doScinania.push({
        id, rodzaj: "drzewko", pos, zrodlo: b.drzewo, wynik, blocker: b,
        n: this.planeta.normalna(pos[0], pos[1]),
        posWyniku, nWyniku: this.planeta.normalna(posWyniku[0], posWyniku[1]),
        skalaWyniku: skalaStosu,
        zasieg: 1.6, postep: 0, zrobione: false, dostarczone: false,
      });
    }
  }

  /** Głazy oznaczone w mapie `doRozbicia` stają się celem tak jak drzewka. */
  _zarejestrujGlazy() {
    for (const [nr, g] of (this.mapa.glazy || []).entries()) {
      if (!g || !g.doRozbicia) continue;
      const zrodlo = this.swiat.getObjectByName(`glaz-${nr}`);
      if (!zrodlo) continue;
      const wynik = new Group();
      wynik.visible = false;
      // Zanurzenie 0,08 · skala — dokładnie tyle, ile zanurza głazy `swiat.js`,
      // więc kamyczki siadają w trawie tak samo jak bryła, z której powstały.
      /* Kamyczki są WIĘKSZE, niż wynikałoby ze skali głazu (.95, nie .64).
         Przy .64 kupka czytała się jak żwir, który się zamiata, a nie jak
         materiał, który się dźwiga na budowę — a to drugie jest tu całą
         treścią zadania. */
      wynik.add(this._osadz(kamyczki(.95 * (g.skala ?? 1)),
        g.pos[0], g.pos[1], .08 * (g.skala ?? 1), g.obrot ?? 0));
      this.swiat.add(wynik);

      /* KOLIZJA GŁAZU MUSI TRAFIĆ DO CELU, a nie zostać w tablicy sama.
         `swiat.js` dokłada blocker przy budowaniu głazu i na tym kończyła się
         jego historia: rozbity głaz znikał z ekranu, ale jego kolizja zostawała
         na polanie na zawsze. Dla dziecka wyglądało to jak duch — niewidzialna
         ściana w pustym miejscu, obok skrótu do minigry. Drzewka tego nie miały,
         bo ich blocker od początku siedzi w `_doScinania` i `_zdejmijKolizje`
         ma co zdjąć; głazy po prostu nigdy go tam nie dostały.
         Szukamy po pozycji, bo `swiat.js` bierze ją z tego samego `g.pos`. */
      const blocker = (this.blockers || []).find((b) => b && !b.drzewo
        && Math.abs(b.x - g.pos[0]) < 1e-6 && Math.abs(b.z - g.pos[1]) < 1e-6) || null;

      this._doScinania.push({
        id: g.id || `glaz-${nr}`, rodzaj: "glaz", pos: g.pos, zrodlo, wynik, blocker,
        n: this.planeta.normalna(g.pos[0], g.pos[1]),
        // Kamyczki zostają dokładnie tam, gdzie stał głaz — inaczej niż stos
        // drewna, który leży obok pnia.
        posWyniku: g.pos, nWyniku: this.planeta.normalna(g.pos[0], g.pos[1]),
        skalaWyniku: .95 * (g.skala ?? 1),
        // Zasięg WIĘKSZY niż przy drzewku: głaz ma kolizję (blocker r≈0,6),
        // więc lisek nie wejdzie w niego — musi mu wystarczyć stanięcie obok.
        zasieg: g.zasieg ?? 1.9, postep: 0, zrobione: false, dostarczone: false,
      });
    }
  }

  /**
   * Odtwarza stan z poprzedniej sesji: to, co już zużyte, od razu pokazuje
   * wynik. Woła React po „gotowa", bo tylko on wie, co dziecko zdążyło zrobić.
   */
  oznaczZuzyte(lista) {
    const zbior = new Set(Array.isArray(lista) ? lista : []);
    for (const c of this._doScinania) {
      const ma = zbior.has(c.id);
      if (ma === !!c.zrobione) continue;
      if (ma) {
        c.zrobione = true;
        c.postep = CZAS_RABANIA;
        c.zrodlo.visible = false;
        c.wynik.visible = true;
        this._zdejmijKolizje(c);
      } else {
        /* POWRÓT DO STANU SPRZED ŚCIĘCIA. Ta metoda odtwarzała dotąd zapis
           tylko w jedną stronę: czego nie ma na liście, tego nie ruszała.
           Wystarczało to przy wchodzeniu do świata, bo lista tylko rosła.
           Pulpit dev cofa łańcuch zdarzeń na wcześniejsze ogniwo i wtedy
           lista MALEJE — a świat zostawał ze ściętym drzewkiem i rozbitym
           głazem, choć zapis mówił, że ich jeszcze nikt nie tknął. */
        c.zrobione = false;
        c.dostarczone = false;
        c.niesione = false;
        c.postep = 0;
        c.zrodlo.visible = true;
        c.wynik.visible = false;
        this._wrocKolizje(c);
        // Ładunek w rękach znika razem z celem, z którego powstał.
        if (this._ladunek?.cel === c) this._porzucLadunek();
      }
    }
  }

  /** Ścięte drzewko przestaje zagradzać drogę — stos drewna jest niski. */
  _zdejmijKolizje(c) {
    if (!c.blocker) return;
    const i = this.blockers.indexOf(c.blocker);
    if (i >= 0) this.blockers.splice(i, 1);
    // Trzymamy obiekt na boku zamiast go gubić — inaczej cofnięcie stanu
    // postawiłoby drzewko, przez które dalej dałoby się przejść.
    c.blockerSchowany = c.blocker;
    c.blocker = null;
  }

  /** Odwrotność `_zdejmijKolizje` — używana przy cofaniu stanu z zapisu. */
  _wrocKolizje(c) {
    const b = c.blocker || c.blockerSchowany;
    if (!b) return;
    if (!this.blockers.includes(b)) this.blockers.push(b);
    c.blocker = b;
    c.blockerSchowany = null;
  }

  /** Wyłącznik na czas, gdy zadanie nie trwa — świat zostaje nietknięty. */
  ustawRabanieAktywne(v) {
    this._rabanieAktywne = v !== false;
    if (!this._rabanieAktywne && this._wskPracy) this._wskPracy.visible = false;
  }

  _rabanieTik(e) {
    if (!this._doScinania.length) return;
    const wsk = this._wskPracy;
    // Z pełnymi rękami się nie piłuje — i nie zaczyna drugiej roboty w trakcie
    // podglądu miejsca, bo wtedy lisek stoi, a planeta jedzie.
    if (this._kino || this.sequence || this._podglad || this._ladunek) {
      if (wsk) wsk.visible = false;
      return;
    }

    let pracuje = null;
    for (const c of this._doScinania) {
      if (c.zrobione) continue;
      if (this.planeta.odleglosc(this.hn, c.n) < c.zasieg) { pracuje = c; break; }
    }

    if (!pracuje) {
      if (wsk) wsk.visible = false;
      this._blokadaPokazana = false;
      this._rabUcieczka = 0;
      return;
    }

    /* WYŁĄCZONE RĄBANIE MÓWI, ŻE JEST WYŁĄCZONE. Wcześniej podejście do
       drzewka przy nieaktywnym zadaniu nie robiło nic i nie dało się zgadnąć,
       czy to blokada, czy błąd — a to jest dokładnie ten stan, w którym
       siedzi się, gdy zadanie nie zostało jeszcze przyjęte. */
    if (!this._rabanieAktywne) {
      if (wsk) wsk.visible = false;
      if (!this._blokadaPokazana) {
        this._blokadaPokazana = true;
        this.hint("Wizkor jeszcze o to nie prosił");
      }
      return;
    }
    this._blokadaPokazana = false;

    /* W MIEJSCU I PRZODEM DO CELU. Bez tego lisek piłował bokiem albo tyłem,
       a pierścień wisiał nad postacią idącą gdzie indziej.
       Uwaga na pułapkę: gdyby wejście zerowało wejście na sztywno, dziecko
       zostałoby uwięzione na pięć sekund. Dlatego liczymy, jak długo naprawdę
       ciśnie w bok — wyraźny ruch przez 0,35 s przerywa pracę. Postęp NIE
       przepada, więc odejście nic nie kosztuje. */
    const sila = Math.hypot(this.input.x, this.input.y);
    this._rabUcieczka = sila > .55 ? (this._rabUcieczka || 0) + e : 0;
    if (this._rabUcieczka > .35) {
      if (wsk) wsk.visible = false;
      return;
    }
    const kier = this.stycznaDoMapy(pracuje.pos[0], pracuje.pos[1],
      this._rabKier || (this._rabKier = new Vector3()));
    this.obrocKu(kier, 9, e);
    this.input.set(0, 0);
    this.setLocomotion(0);
    this.walking = false;

    pracuje.postep = Math.min(CZAS_RABANIA, pracuje.postep + e);
    const w = this._wskaznikPracy();
    w.visible = true;
    // Pierścień siedzi nad liskiem w układzie planety: pozycja bohatera plus
    // jego normalna (czyli „góra" w tym miejscu kuli), a nie sztywne +Y.
    w.position.copy(this.hero.position).addScaledVector(this.hn, 1.14);
    w.rysuj(pracuje.postep / CZAS_RABANIA);

    if (pracuje.postep < CZAS_RABANIA) return;

    pracuje.zrobione = true;
    pracuje.zrodlo.visible = false;
    pracuje.wynik.visible = true;
    /* Drzewo znika, a drewno zlatuje z góry i układa się w stos. Kamieniom
       tego nie dajemy: głaz rozpada się NA MIEJSCU, więc kamyczki spadające
       z nieba opowiadałyby co innego, niż dziecko przed chwilą zrobiło. */
    if (pracuje.rodzaj !== "glaz") {
      this._zacznijOpadKlod(pracuje.wynik, pracuje.skalaWyniku || 1);
    }
    this._zdejmijKolizje(pracuje);
    w.visible = false;
    this.hint(pracuje.rodzaj === "glaz" ? "Kamienie się przydadzą!" : "Drewno gotowe!");
    this.emit("surowiec:zdobyty", { rodzaj: pracuje.rodzaj, id: pracuje.id, pos: pracuje.pos });
    try { navigator.vibrate?.([18, 40, 18]); } catch {}
    if (this.input.lengthSq() < 0.02 && (this.moveSpeed || 0) < 0.05 && !this.walking) {
      this.play("happy", 0.12);
      this.sequence = "happy";
      this.seqTimer = 0;
    }
  }

  /* ── PODGLĄD MIEJSCA ──────────────────────────────────────────────────────
   *
   * „Zdobądź drewno" bez adresu to polecenie. „Tam powstanie schronienie,
   * przynieś tam drewno" to powód. Dlatego zanim dziecko cokolwiek zetnie,
   * świat sam pokazuje puste miejsce z palikami — i wraca do liska.
   *
   * Świadomie JEDEN raz, po zleceniu zadania: powtarzany przy każdym wejściu
   * przestaje być odkryciem, a staje się ekranem ładowania.
   */
  /**
   * Najazd kamery na KONKRETNY ZNAK — np. na jedna z gwiazdek w chwili,
   * gdy Wizkor zleca ich zbieranie.
   *
   * PO CO. "Zbierz 10 gwiazdek" bez pokazania ANI JEDNEJ to polecenie bez
   * adresu: dziecko wie, ile ma zebrac, ale nie wie, czego szuka ani jak to
   * wyglada w trawie. Jeden najazd zalatwia oba pytania naraz i nie zabiera
   * sterowania na dluzej niz dwie sekundy.
   *
   * Pozycje bierzemy z ZYWEGO obiektu sceny, nie z `mapa.json`: od planety
   * `root.position` to punkt NA KULI, a polozenie w ukladzie mapy trzyma
   * `mapa` (patrz `pozycjaZnaku` w pulpicie testowym).
   *
   * Zwraca false, gdy znaku nie ma albo juz zszedl z mapy — wolajacy nie
   * musi wtedy nic robic, bo brak najazdu niczego nie psuje.
   */
  pokazZnakWKadrze(znak, opcje = {}) {
    const m = (this.markers || []).find((z) => z && z.id === znak && z.state !== "gone");
    const p = m?.mapa || m?.root?.position;
    if (!p) return false;
    return this.pokazMiejsce([p.x, p.z], opcje);
  }

  pokazMiejsce(pos, opcje = {}) {
    const p = Array.isArray(pos) ? pos : this.mapa.schronienie?.pos;
    if (!p || !this.hero) return false;
    // Reduce-motion: obrót planety w tę i z powrotem to dokładnie ten ruch,
    // przed którym chroni to ustawienie. Zamiast niego zostaje sam znacznik.
    if (spokojnyRuch) { this.emit("miejsce:pokazane", { pos: p, pominiete: true }); return false; }
    this._podglad = {
      faza: "dojazd", t: 0,
      dojazd: opcje.dojazd ?? 1.25,
      trzym: opcje.trzym ?? 1.7,
      powrot: opcje.powrot ?? 1.1,
      n: this.planeta.normalna(p[0], p[1]),
      pos: p, w: 0,
    };
    this.input.set(0, 0);
    this.setLocomotion(0);
    this.walking = false;
    this.stopWalk?.();
    return true;
  }

  /** Zwraca wagę 0…1: ile „góry kuli" należy w tej klatce do pokazywanego miejsca. */
  _podgladTik(e) {
    const P = this._podglad;
    if (!P) return 0;
    P.t += e;
    if (P.faza === "dojazd") {
      P.w = Math.min(1, P.t / P.dojazd);
      if (P.t >= P.dojazd) { P.faza = "trzym"; P.t = 0; P.w = 1; }
    } else if (P.faza === "trzym") {
      P.w = 1;
      if (P.t >= P.trzym) { P.faza = "powrot"; P.t = 0; }
    } else {
      P.w = Math.max(0, 1 - P.t / P.powrot);
      if (P.t >= P.powrot) {
        this._podglad = null;
        this.emit("miejsce:pokazane", { pos: P.pos });
        return 0;
      }
    }
    // Wygładzenie na obu końcach — bez niego planeta rusza i staje skokiem.
    const w = P.w;
    return w * w * (3 - 2 * w);
  }

  /* ── POŚWIATA MATERIAŁU DO ZABRANIA ──────────────────────────────────────
   *
   * Ścięty stos leży w trawie w tym samym brązie, co dziesięć innych rzeczy na
   * planecie. Dziecko, które właśnie machnęło siekierą, nie ma z czego poznać,
   * że TERAZ trzeba po niego wrócić i zanieść go na plac — rąbanie skończyło
   * się znaczkiem nad liskiem, a potem świat zamilkł.
   *
   * Dlatego stos, który czeka na zabranie, ŚWIECI OD ŚRODKA: pulsuje emisja
   * w samych kłodach, więc światło wychodzi z drewna. Halo obok bryły byłoby
   * drugim znakiem tego samego rodzaju, co znaczki nad liskiem i pierścień
   * placu — a te już mówią „idź tam". Ten mówi „weź to".
   *
   * MATERIAŁY SĄ KLONOWANE, i to jest tu najważniejsza linijka: `natura.js`
   * trzyma `MAT_DREWNO` jako JEDEN zestaw dla całej planety, więc podniesienie
   * emisji na wspólnym materiale zapaliłoby każdą sosnę, każdy pieniek i kłody
   * domku na drzewie. Klon powstaje raz, przy pierwszym pulsie danego stosu.
   *
   * ŚWIECI TYLKO STOS, nie pieniek: pieniek jest śladem po drzewie, nie
   * rzeczą do wzięcia, a dwa świecące obiekty obok siebie znaczą „dwie rzeczy".
   *
   * GAŚNIE w chwili podniesienia i po dostarczeniu — i nie wraca. Światło jest
   * zaproszeniem, nie ozdobą.
   */

  /** Bryła, która ma świecić: sam materiał, bez pnia i bez reszty grupy. */
  _brylaDoZabrania(c) {
    return c.wynik?.getObjectByName("stos-drewna") || c.wynik?.getObjectByName("kamyczki") || null;
  }

  /** Czy kłody tego stosu jeszcze lecą — dopóki lecą, nic nie świeci. */
  _opadTrwa(c) {
    if (!this._opadKlod?.length) return false;
    const bryla = this._brylaDoZabrania(c);
    return !!bryla && this._opadKlod.some((a) => a.czesci?.[0]?.m.parent === bryla);
  }

  /**
   * Klony materiałów tej bryły (raz na bryłę), gotowe do pulsowania.
   *
   * PUSTEJ LISTY NIE ZAPAMIĘTUJEMY. Pierwszy tik po ścięciu potrafi zastać
   * bryłę, której `ustawRabanieAktywne` właśnie przebudowuje wynik — a puste
   * `[]` jest w JS prawdą, więc zapamiętane raz gasiło ten stos na zawsze
   * (widziane w podglądzie sceny 17.09). Brak materiałów znaczy „spróbuj
   * w następnej klatce", nie „ten stos nie świeci".
   */
  _materialyPoswiaty(c) {
    if (c._poswiata?.length) return c._poswiata;
    const bryla = this._brylaDoZabrania(c);
    if (!bryla) return null;
    const lista = [];
    bryla.traverse((o) => {
      if (!o.isMesh || !o.material) return;
      const klon = Array.isArray(o.material)
        ? o.material.map((m) => m.clone())
        : o.material.clone();
      o.material = klon;
      (Array.isArray(klon) ? klon : [klon]).forEach((m) => {
        if (!m.emissive) return;
        m.emissive.setHex(POSWIATA_BARWA);
        m.emissiveIntensity = 0;
        lista.push(m);
      });
    });
    if (lista.length) c._poswiata = lista;
    return lista;
  }

  _poswiataTik(e) {
    if (!this._doScinania?.length) return;
    this._czasPoswiaty = (this._czasPoswiaty || 0) + e;
    /* Przy `prefers-reduced-motion` światło jest STAŁE, nie zgaszone: pulsowanie
       jest ozdobą tego sygnału, ale sam sygnał niesie informację, bez której
       dziecko nie wie, że stos jest do wzięcia. */
    const moc = spokojnyRuch
      ? (POSWIATA_MIN + POSWIATA_MAX) * .5
      : POSWIATA_MIN + (POSWIATA_MAX - POSWIATA_MIN)
        * (.5 + .5 * Math.sin(this._czasPoswiaty * POSWIATA_TEMPO));

    for (const c of this._doScinania) {
      const czeka = c.zrobione && !c.niesione && !c.dostarczone && !this._opadTrwa(c);
      if (!czeka) {
        if (c._swieci) {
          (c._poswiata || []).forEach((m) => { m.emissiveIntensity = 0; });
          c._swieci = false;
        }
        continue;
      }
      const materialy = this._materialyPoswiaty(c);
      if (!materialy?.length) continue;
      materialy.forEach((m) => { m.emissiveIntensity = moc; });
      c._swieci = true;
    }
  }

  /* ── NOSZENIE MATERIAŁU ───────────────────────────────────────────────────
   *
   * Materiał NIE teleportuje się z lasu na budowę. Lisek wchodzi w stos,
   * bierze go na plecy i niesie — jeden ładunek na raz, więc są dwa kursy.
   * To jest ta część, w której „zdobyłem" zamienia się w „przyniosłem",
   * i jedyna, w której widać wysiłek.
   */
  _ladunekModel(rodzaj, s) {
    const g = new Group();
    g.name = "ladunek";
    /* WIĘKSZY NIŻ BYŁ (decyzja właściciela 2026-09-17). Przy 0,42 ładunek
       ginął za uszami liska: z góry widać było ciemny prostokąt i nie dało
       się poznać, czy to drewno, czy kamienie. A niesiona rzecz jest jedyną
       rzeczą, która tłumaczy, PO CO jest ten kurs — musi być czytelna.
       Proporcja, nie stała: stos z wyższego drzewka dalej jest większy
       od kupki kamyków.

       Drewno bierze wersję BEZ SZCZAP — z boku sterczały jak luźna deska
       (patrz `stosDrewna` w `natura.js`). */
    g.add(rodzaj === "glaz" ? kamyczki(s * .58) : stosDrewna(s * .58, { szczapy: false }));
    return g;
  }

  /* ── ŚLAD DO PLACU ────────────────────────────────────────────────────────
   *
   * Kropki leżące na ziemi od liska do placu budowy, zapalające się falą
   * w stronę celu. Widać je WYŁĄCZNIE, gdy lisek coś niesie.
   *
   * PO CO. Ładunek odbiera swobodę: dopóki lisek niesie, jedyne, co można
   * zrobić, to donieść (patrz `_transportTik`). Dziecko, które dopiero co
   * ścięło drzewo gdzieś w lesie, nie ma jak wiedzieć, w którą stronę jest
   * plac — a błądzenie z pełnymi rękami to jedyny moment w tej grze, w którym
   * eksploracja przestaje być nagrodą i zaczyna być karą. Ślad odpowiada na
   * pytanie „którędy", nie odbierając przy tym sterowania: to podpowiedź na
   * ziemi, nie prowadzenie za rękę.
   *
   * Kropki idą po PARAMETRACH MAPY, nie po prostej w przestrzeni — każda
   * siada na swojej wysokości gruntu, więc ślad płynie po pagórkach zamiast
   * wbijać się w zbocze.
   */
  _sladDoPlacu() {
    if (this._slad) return this._slad;
    const g = new Group();
    g.name = "slad-do-placu";
    const geo = new CircleGeometry(.135, 14);
    this._sladKropki = [];
    for (let i = 0; i < 16; i += 1) {
      const m = new Mesh(geo, new MeshBasicMaterial({
        color: 0xffc23a, transparent: true, opacity: 0, depthWrite: false,
      }));
      m.rotation.x = -Math.PI / 2;
      const kotwica = new Group();
      kotwica.add(m);
      g.add(kotwica);
      this._sladKropki.push(kotwica);
    }
    g.visible = false;
    this.swiat.add(g);
    this._slad = g;
    return g;
  }

  _sladTik(e) {
    const def = this.mapa.schronienie;
    const aktywny = !!this._ladunek && !!def && Array.isArray(def.pos) && !this._kino && !this._podglad;
    if (!aktywny) { if (this._slad) this._slad.visible = false; return; }

    const g = this._sladDoPlacu();
    g.visible = true;
    // Faza fali. Wolna (0,45/s): to ma wskazywać kierunek, a nie migotać.
    this._sladFaza = ((this._sladFaza || 0) + e * .45) % 1;

    const ax = this.hp.x, az = this.hp.z;
    const bx = def.pos[0], bz = def.pos[1];
    const n = this._sladKropki.length;
    for (let i = 0; i < n; i += 1) {
      const t = (i + 1) / (n + 1);
      const x = ax + (bx - ax) * t;
      const z = az + (bz - az) * t;
      const h = this.wysokoscGruntuSiatki ? this.wysokoscGruntuSiatki(x, z) : this.groundHeightAt(x, z);
      const kotwica = this._sladKropki[i];
      this.planeta.ustaw(kotwica, x, z, h + .02, 0);
      /* Fala biegnie OD LISKA DO CELU, więc kropka bliżej celu zapala się
         później. Bez tego ślad jest statyczną kreską i nie mówi, w którą
         stronę iść. */
      const f = (t - this._sladFaza + 1) % 1;
      const szczyt = Math.max(0, 1 - f * 2.4);
      const mesh0 = kotwica.children[0];
      mesh0.material.opacity = .16 + .52 * szczyt * szczyt;
      mesh0.scale.setScalar(.72 + .5 * szczyt);
    }
  }

  _transportTik(e) {
    if (!this._doScinania.length) return;
    if (this._kino || this.sequence || this._podglad) return;
    const def = this.mapa.schronienie;

    // NIOSĄC — jedyne, co można zrobić, to donieść. Żadnego zbierania po drodze.
    if (this._ladunek) {
      const m = this._ladunek.model;
      // Ładunek jedzie NA bohaterze, ale mieszka w `swiat`: hero bywa modelem
      // z własną skalą z GLB, więc dziecko dostawałoby stos wielkości domu.
      m.position.copy(this.hero.position).addScaledVector(this.hn, .66);
      m.quaternion.copy(this.hero.quaternion);
      if (!def || !this._nPlacu) return;
      if (this.planeta.odleglosc(this.hn, this._nPlacu) < (def.zasieg ?? 1.35)) this._oddajLadunek();
      return;
    }

    // PODNIESIENIE — wejście w stos wystarczy, nie ma osobnego przycisku.
    for (const c of this._doScinania) {
      if (!c.zrobione || c.dostarczone || c.niesione) continue;
      if (this.planeta.odleglosc(this.hn, c.nWyniku) >= (c.zasiegWyniku ?? .95)) continue;
      c.niesione = true;
      c.wynik.visible = false;
      const model = this._ladunekModel(c.rodzaj, c.skalaWyniku ?? 1);
      this.swiat.add(model);
      this._ladunek = { rodzaj: c.rodzaj, id: c.id, cel: c, model };
      this.hint(c.rodzaj === "glaz" ? "Niosę kamienie" : "Niosę drewno");
      this.emit("surowiec:podniesiony", { rodzaj: c.rodzaj, id: c.id });
      try { navigator.vibrate?.(14); } catch {}
      return;
    }
  }

  /**
   * Ładunek znika z rąk BEZ odkładania na plac. Wyłącznie do cofania stanu
   * (pulpit dev): cel, z którego ten stos powstał, właśnie przestał być
   * ścięty, więc dalsze niesienie go byłoby niesieniem niczego.
   */
  _porzucLadunek() {
    const L = this._ladunek;
    if (!L) return;
    this.swiat.remove(L.model);
    L.model.traverse((o) => { o.geometry?.dispose?.(); });
    if (L.cel) L.cel.niesione = false;
    this._ladunek = null;
  }

  _oddajLadunek() {
    const L = this._ladunek;
    if (!L) return;
    this.swiat.remove(L.model);
    L.model.traverse((o) => { o.geometry?.dispose?.(); });
    L.cel.niesione = false;
    L.cel.dostarczone = true;
    // Numer dostawy = ile już leży na placu. Liczymy PRZED dołożeniem tego stosu.
    this._polozNaPlacu(L.rodzaj, L.cel.skalaWyniku ?? 1,
      this._doScinania.filter((c) => c.dostarczone && c !== L.cel).length);
    this._ladunek = null;
    this.hint(L.rodzaj === "glaz" ? "Kamienie na placu!" : "Drewno na placu!");
    this.emit("surowiec:dostarczony", { rodzaj: L.rodzaj, id: L.id });
    try { navigator.vibrate?.([18, 40, 18]); } catch {}
    if (this.input.lengthSq() < 0.02 && (this.moveSpeed || 0) < 0.05 && !this.walking) {
      this.play("happy", 0.12);
      this.sequence = "happy";
      this.seqTimer = 0;
    }
  }

  /**
   * Materiał ląduje NA PLACU i jest go widać — to jest cała informacja zwrotna
   * za kurs.
   *
   * TRZY STOSY, TRZY MIEJSCA (17.09). Wcześniej pozycja zależała od RODZAJU:
   * drewno po jednej stronie klepiska, kamienie po drugiej. Odkąd etap kosztuje
   * trzy stosy drewna i nic więcej, ten sam wzór kładłby wszystkie trzy w jednym
   * punkcie — dziecko doniosłoby trzeci kurs i zobaczyło dokładnie to samo, co
   * po pierwszym. Rozkładamy więc po KOLEJNOŚCI dostawy, wachlarzem wzdłuż
   * krawędzi klepiska: rosnący rządek jest jedyną nagrodą za drugi i trzeci kurs.
   *
   * `nr` to numer dostawy liczony od zera. Skład przebudowuje się od zera przy
   * każdej zmianie (`oznaczDostarczone`), więc kolejność jest zawsze ta sama.
   */
  _polozNaPlacu(rodzaj, skala, nr = 0) {
    const def = this.mapa.schronienie;
    if (!def) return;
    if (!this._skladNaPlacu) {
      this._skladNaPlacu = new Group();
      this._skladNaPlacu.name = "sklad-na-placu";
      this.swiat.add(this._skladNaPlacu);
    }
    const s = def.skala ?? 1;
    /* Stosy idą PO ŁUKU wokół klepiska, nie w linii prostej: przy prostym
       rządku trzeci wypadał już poza placem, a po łuku wszystkie trzy zostają
       w kadrze, który kamera pokazuje przy `pokazMiejsce`. Środkowy (nr = 1)
       ląduje dokładnie tam, gdzie do 17.09 lądowało jedyne drewno — pierwszy
       kurs wygląda więc tak samo jak wcześniej, a rozsuwa się dopiero drugi. */
    const kat = (def.obrot ?? 0) + Math.PI + (nr - 1) * .55;
    const promien = 1.25 * s;
    const x = def.pos[0] + promien * Math.cos(kat);
    const z = def.pos[1] - promien * Math.sin(kat);
    const bryla = rodzaj === "glaz" ? kamyczki(skala * .8) : stosDrewna(skala * .7);
    this._skladNaPlacu.add(this._osadz(bryla, x, z, .05, kat + .35));
  }

  /** Czyści skład — woła `ustawSchronienie`, gdy materiał zamienia się w budowlę. */
  _zabierzSklad() {
    if (!this._skladNaPlacu) return;
    this.swiat.remove(this._skladNaPlacu);
    this._skladNaPlacu.traverse((o) => { o.geometry?.dispose?.(); });
    this._skladNaPlacu = null;
  }

  /**
   * Odtwarza dostawy z poprzedniej sesji. Ładunek „w rękach" NIE jest zapisywany
   * — zamknięta w pół drogi apka oddaje stos tam, gdzie leżał. To wybaczające
   * i uczciwe: dziecko nie traci materiału, tylko kurs.
   */
  oznaczDostarczone(lista) {
    const zbior = new Set(Array.isArray(lista) ? lista : []);
    let zmiana = false;
    for (const c of this._doScinania) {
      const ma = zbior.has(c.id);
      if (ma === !!c.dostarczone) continue;
      zmiana = true;
      if (ma) {
        c.dostarczone = true;
        c.niesione = false;
        c.zrobione = true;
        c.postep = CZAS_RABANIA;
        c.zrodlo.visible = false;
        c.wynik.visible = false;
        this._zdejmijKolizje(c);
      } else {
        // Cofnięcie dostawy: materiał wraca tam, skąd go zabrano — na stos
        // w lesie, jeśli drzewko jest dalej ścięte (`oznaczZuzyte` biegnie
        // wcześniej i zdążyło już ustawić `zrobione`).
        c.dostarczone = false;
        c.niesione = false;
        c.wynik.visible = !!c.zrobione;
        if (this._ladunek?.cel === c) this._porzucLadunek();
      }
    }
    if (!zmiana) return;

    /* SKŁAD PRZEBUDOWYWANY OD ZERA, a nie doklejany. `_polozNaPlacu` tylko
       dodaje bryły do wspólnej grupy i nie wie, czyja która jest — więc
       zdjęcia JEDNEJ dostawy z placu nie da się zrobić inaczej niż
       postawieniem składu na nowo. Przy trzech stosach to darmowe.

       Gdy szkielet już stoi, składu nie ma w ogóle: materiał ZAMIENIŁ SIĘ
       w budowlę (`ustawSchronienie` woła `_zabierzSklad` z tego samego
       powodu), a stos leżący obok kłamałby, że drewno poszło gdzie indziej. */
    this._zabierzSklad();
    if (this._etapSchronienia > 0) return;
    let nr = 0;
    for (const c of this._doScinania) {
      if (c.dostarczone) this._polozNaPlacu(c.rodzaj, c.skalaWyniku ?? 1, nr++);
    }
  }

  /* ── SCHRONIENIE ──────────────────────────────────────────────────────────
   *
   * To jest zapłata za rąbanie — jedyna, jaką to zadanie ma. Nie monety,
   * nie punkty: rzecz, która staje na polanie i zostaje tam na zawsze
   * (`docs/OPIS_PROJEKTU.md`, „działanie → konsekwencja → zmiana świata").
   *
   * Dwie decyzje warte zapamiętania:
   *
   * 1. SCENA NIE PAMIĘTA ETAPU. Numer etapu trzyma zapis w React
   *    (`zadanieDrewna.js`), a scena tylko wykonuje `ustawSchronienie(n)`.
   *    Dzięki temu po wejściu do świata budowla odtwarza się sama, a pulpit
   *    reżyserki może przeskakiwać etapy bez dotykania zapisu.
   *
   * 2. STAWIANIE JEST ANIMOWANE TYLKO NA ŻĄDANIE. Po powrocie do świata
   *    schronienie ma po prostu stać (`animuj=false`) — oglądanie, jak
   *    dom buduje się od nowa przy każdym wejściu, odbiera tej chwili wagę.
   *    Animacja należy do JEDNEGO momentu: kliknięcia „STAWIAMY!".
   */
  ustawSchronienie(n = 0, animuj = false) {
    const def = this.mapa.schronienie;
    if (!def || !Array.isArray(def.pos)) return;

    // Sprzątamy po poprzednim etapie: grupa i jej kolizje schodzą razem,
    // inaczej po przeskoku etapów w pulpicie zostają niewidzialne ściany.
    if (this._schronienie) {
      this.swiat.remove(this._schronienie);
      this._schronienie.traverse((o) => { o.geometry?.dispose?.(); });
      this._schronienie = null;
      this._gibanaBudowla = null;
    }
    for (const b of this._schronBlockers || []) {
      const i = this.blockers.indexOf(b);
      if (i >= 0) this.blockers.splice(i, 1);
    }
    this._schronBlockers = [];
    this._etapSchronienia = Math.max(0, Math.min(n | 0, LICZBA_ETAPOW));
    if (this._etapSchronienia <= 0) return;
    // Plac budowy schodzi w chwili, gdy budowa się na nim zaczyna — po to był.
    this.ustawPlacBudowy(false);
    /* Skład znika, bo ZAMIENIA SIĘ w budowlę. To jest ten jeden moment, w
       którym dziecko ma zobaczyć, że przyniesione drewno poszło w słupy —
       gdyby stos został obok, budowla wyglądałaby na zrobioną z niczego. */
    this._zabierzSklad();

    const s = def.skala ?? 1;
    const u0 = this._uklad || DOMEK_DRZEWO;

    /* KOTWICA POWSTAJE PIERWSZA, z pustą grupą w środku. Odwrotnie niż zwykle,
       bo drabinka musi wiedzieć, JAK GŁĘBOKO UCIEKA POD NIĄ ZIEMIA — a to
       liczy się dopiero względem kotwicy (`punktNaGruncie`). Stopa stoi kilka
       jednostek od pnia, gdzie kula odeszła już od płaszczyzny stycznej
       o ponad pół jednostki; bez tej poprawki drabinka wisiała w powietrzu. */
    const kotwica = this._osadz(null, def.pos[0], def.pos[1], ZANURZENIE_DOMKU, def.obrot ?? 0);
    kotwica.name = "schronienie-kotwica";
    /* DOMEK IDZIE ZA PNIEM. `pienX/pienZ` przesuwają model drzewa względem
       kotwicy — a pomost leży na JEGO konarze, klepisko jest wydeptane pod
       JEGO pniem, drabinka opiera się o JEGO deski. Gdyby przesuwał się sam
       pień, suwak rozklejałby drzewo od domku. Stopa drabinki liczy przez to
       wysokość gruntu w przesuniętym miejscu, nie w kotwicy. */
    const PRZ_X = (u0.pienX || 0) * s, PRZ_Z = (u0.pienZ || 0) * s;
    const stopaX = PRZ_X + (u0.zasiegKonaru - .12 + u0.drabinkaOdsun) * s;
    /* `przeswit` oddaje zanurzenie kotwicy (wiersz wyżej), więc stopa ląduje
       dokładnie na darni, a nie dwa centymetry pod nią. */
    const spadek = punktNaGruncie(this.planeta, kotwica, stopaX, PRZ_Z,
      this.wysokoscGruntuSiatki, ZANURZENIE_DOMKU);

    const bryla = schronienie(this._etapSchronienia, s, { ...u0, drabinkaSpadek: spadek });
    bryla.position.set(PRZ_X, 0, PRZ_Z);
    kotwica.add(bryla);

    /* KLEPISKO na taflę idącą za kulą i terenem — ten sam powód, co przy
       placu budowy: płaska tarcza o promieniu 1 styka się z planetą tylko
       w środku, więc darń przebijała przez jej środek zieloną dziurą.
       `schronienie.js` buduje tarczę awaryjną i tylko ją nazywa; planetę zna
       dopiero scena, więc podmiana siedzi tutaj.
       Zanurzenie kotwicy schronienia to 0,02 — patrz komentarz przy placu. */
    const klepisko = bryla.getObjectByName("schronienie-klepisko");
    if (klepisko) {
      klepisko.geometry.dispose();
      /* Tafla liczy się w układzie kotwicy, a klepisko siedzi w przesuniętej
         bryle — podajemy więc `taflaNaGruncie` macierz kotwicy Z TYM
         przesunięciem. Bez tego wierzchołki chodziłyby za terenem w jednym
         miejscu, a leżały w drugim, i darń znów przebijałaby przez środek. */
      kotwica.updateMatrix();
      const m = kotwica.matrix.clone().multiply(
        new Matrix4().makeTranslation(PRZ_X, 0, PRZ_Z));
      klepisko.geometry = taflaNaGruncie(this.planeta, { matrix: m, updateMatrix() {} },
        klepisko.userData.promien ?? 1.06 * s, this.wysokoscGruntuSiatki,
        ZANURZENIE_DOMKU + .03 * s);
      klepisko.rotation.set(0, 0, 0);
      klepisko.position.set(0, 0, 0);
    }

    /* CO JEDZIE Z DRZEWEM, A CO ZOSTAJE. Pomost leży na konarze, więc kiedy
       lisek wpadnie w pień i drzewo się zakołysze, deski muszą pojechać razem
       z nim — inaczej platforma zsuwa się z gałęzi na oczach dziecka.
       Ale drabinka STOI NA ZIEMI, a klepisko JEST ziemią: obrócone o te kilka
       stopni wjeżdżałyby pod darń albo zawisały nad nią. Elementy oznaczone
       w `schronienie.js` jako `przyZiemi` przepinamy więc do kotwicy, która się
       nie rusza, a kołysze się tylko reszta (`_gibanaBudowla`). */
    const naZiemi = new Group();
    naZiemi.name = "schronienie-przy-ziemi";
    naZiemi.position.copy(bryla.position);   // to samo przesunięcie, bez kołysania
    kotwica.add(naZiemi);
    for (const o of [...bryla.children]) {
      if (o.userData?.przyZiemi) naZiemi.add(o);
    }
    this._gibanaBudowla = bryla;

    this.swiat.add(kotwica);
    this._schronienie = kotwica;

    /* DOMEK NA DRZEWIE NIE DOKŁADA ŻADNEJ KOLIZJI.
       Wcześniej stały tu dwa blockery na słupach szałasu. Teraz jedyną bryłą
       przy ziemi jest PIEŃ, a jego kolizję postawiło już `zbudujSwiat` razem
       z drzewem — drzewo stoi tam od początku, także zanim cokolwiek powstanie.
       Platforma wisi 1,75 nad głową i nie ma prawa zagradzać drogi: dziecko
       ma móc obejść drzewo dookoła i stanąć pod drabinką.
       `_schronBlockers` zostaje pustą listą, bo sprzątanie etapów dalej po niej
       przechodzi — i przyda się, gdy etap 2 dostanie coś przy ziemi. */

    if (!animuj) return;

    /* STAWIANIE KROK PO KROKU. Elementy niosą `userData.krok` (klepisko 0,
       słupy 1 i 2, belka 3) — pokazujemy je po kolei, każdy z krótkim
       „dosiadem" ze skali. Bez tego cała budowla wyskakuje jedną klatką
       i wygląda jak błąd renderowania, a nie jak coś, co ktoś postawił. */
    const kroki = [];
    // Po kotwicy, nie po `bryla` — część elementów wyprowadziliśmy wyżej.
    kotwica.traverse((o) => {
      if (o.userData?.krok == null) return;
      kroki.push(o);
      o.visible = false;
    });
    kroki.sort((a, b) => a.userData.krok - b.userData.krok);
    if (!kroki.length) return;

    const POJAW = .34;   // ile trwa jedno „dosiadanie"
    const ODSTEP = .26;  // co ile wchodzi kolejny element
    const t0 = performance.now();
    const skale = kroki.map((o) => o.scale.clone());
    const krok = () => {
      if (this.destroyed || this._schronienie !== kotwica) return;
      const t = (performance.now() - t0) / 1000;
      let wszystkie = true;
      kroki.forEach((o, i) => {
        const u = (t - i * ODSTEP) / POJAW;
        if (u <= 0) { wszystkie = false; return; }
        o.visible = true;
        if (u >= 1) { o.scale.copy(skale[i]); return; }
        wszystkie = false;
        // Lekkie przestrzelenie w pionie: element „siada" na miejsce,
        // zamiast urosnąć liniowo. Bez tego ruch jest martwy.
        const e = 1 - (1 - u) * (1 - u);
        o.scale.set(skale[i].x * e, skale[i].y * (e + Math.sin(u * Math.PI) * .12), skale[i].z * e);
      });
      if (!wszystkie) requestAnimationFrame(krok);
    };
    requestAnimationFrame(krok);

    /* SIATKA BEZPIECZEŃSTWA. `requestAnimationFrame` zamiera w ukrytej karcie,
       więc gdyby dziecko przełączyło okno w trakcie stawiania, schronienie
       zostałoby niewidzialne NA ZAWSZE — zapis mówiłby „stoi", a na polanie
       byłaby dziura. `setTimeout` chodzi (wolniej, ale chodzi), więc po czasie
       animacji po prostu dopowiada jej koniec. */
    const czas = (kroki.length * ODSTEP + POJAW) * 1000 + 400;
    setTimeout(() => {
      if (this.destroyed || this._schronienie !== kotwica) return;
      kroki.forEach((o, i) => { o.visible = true; o.scale.copy(skale[i]); });
    }, czas);
  }

  /**
   * PLAC BUDOWY — miejsce, w którym STANIE schronienie, pokazane ZANIM cokolwiek
   * tam stoi. Bez tego zadanie brzmi „zdobądź drewno", a nie „zbuduj tam dom":
   * dziecko rąbie, nie wiedząc po co i gdzie. Znacznik jest obietnicą.
   *
   * Dwa stany, bo znaczą co innego:
   *   czeka   — wbite paliki, przygaszone: „tu będzie, przynieś materiał"
   *   gotowy  — jasne, pulsujące, uniesiona ikona: „masz wszystko, chodź tu"
   */
  _placBudowy(s) {
    const g = new Group();
    g.name = "plac-budowy";

    /* WYDEPTANEJ ZIEMI ANI OBRYSU TU NIE MA — obie rzeczy dokłada
       `ustawPlacBudowy`, bo obie muszą znać kotwicę: tarcza idzie za kulą
       i terenem (`taflaNaGruncie`), a pierścień siada na wysokości jej brzegu.

       KRESEK ROZSTAWIONYCH JAK OŚ ZEGARA JUŻ NIE MA (decyzja właściciela
       2026-09-16). Dwanaście prostokątów wokół tarczy czytało się jak
       podziałka albo coś technicznego — a to miejsce ma mówić „tu się zaraz
       zacznie", nie „tu się mierzy". Zamiast nich wchodzi ten sam krąg ze
       smugą, co pod znakami minigier: dziecko zna już ten sygnał z mapy
       i nie musi uczyć się drugiego. */

    // Paliki dokładnie tam, gdzie staną słupy — dziecko widzi rozstaw,
    // więc gotowa budowla nie „wyrasta znikąd", tylko trafia w swoje miejsce.
    const matPalik = new MeshLambertMaterial({ color: 0x9B7B4E, flatShading: true });
    for (const k of [-1, 1]) {
      const p = new Mesh(new CylinderGeometry(.06 * s, .085 * s, .34 * s, 5), matPalik);
      p.position.set(k * .68 * s, .17 * s, 0);
      g.add(p);
    }

    return g;
  }

  /**
   * Domek do znacznika placu — wczytany RAZ i trzymany na instancji.
   * Ścieżka idzie z `opts.zasoby`, tak samo jak modele (`loadGLB`), więc
   * ikona działa i w aplikacji, i w podglądzie offline, i na Vercelu.
   */
  _ikonaDomku() {
    if (this._ikDom !== undefined) return this._ikDom;
    const im = new Image();
    im.onload = () => { this._placIk?.rysuj(!!this._placGotowy); };
    im.onerror = () => { console.warn("[plac] brak ikony domku"); this._ikDom = null; };
    im.src = `${this.opts.zasoby ?? "./assets/"}ikona-siedlisko.png`;
    this._ikDom = im;
    return im;
  }

  /**
   * Ikona nad placem: domek na wspolnym tle wskaznika.
   *
   * DOMEK JEST ZAWSZE W PELNI WIDOCZNY (decyzja wlasciciela 2026-09-16).
   * Wczesniej przed skompletowaniem materialu cala tarcza szla na polowe
   * krycia, a sam domek na `globalAlpha .62` — przez jasna trawe robil sie
   * wyblakly i z dwoch metrow nie bylo widac, CO tam wlasciwie jest. A to
   * jest znaczek, ktory ma powiedziec "tu powstanie schronienie" zanim
   * dziecko podejdzie. Stan "jeszcze zbieramy" niesie teraz KOLOR OBWODKI
   * (wygaszone zloto zamiast pomaranczu), a nie przezroczystosc ikony.
   *
   * Plotno 256 px z tego samego powodu, co przy wskazniku pracy: przy 128 px
   * ikona robila sie papka.
   */
  _placIkona() {
    const S = 256;
    const c = document.createElement("canvas");
    c.width = c.height = S;
    const g = c.getContext("2d");
    // Ta sama przestrzeń barw, co przy wskaźniku pracy — patrz komentarz tam.
    const mapaIk = new CanvasTexture(c);
    mapaIk.colorSpace = SRGBColorSpace;
    const spr = new Sprite(new SpriteMaterial({ map: mapaIk, transparent: true, depthTest: false }));
    spr.renderOrder = 58;
    /* TEN SAM ROZMIAR, CO WSKAŹNIK CIĘCIA (1,05) — decyzja właściciela
       2026-09-16. Oba znaczki mówią „tu jest robota do zrobienia" i stoją
       w tej samej scenie, więc mniejszy czytał się jak mniej ważny, a nie
       jak inny rodzaj sprawy. Realną skalę nadaje pętla `bujaj`
       w `ustawPlacBudowy`; ta wartość jest dla chwili przed jej startem. */
    spr.scale.setScalar(1.05);
    spr.rysuj = (gotowy) => {
      g.clearRect(0, 0, S, S);
      g.lineCap = "round";
      g.lineJoin = "round";
      const { c0, u } = this._tloWskaznika(g, S, (g2, cc, u2) => {
        // Wskaznik MIEJSCA nie ma postepu — pelna obwodka. Pomaranczowa, gdy
        // material jest na placu; wygaszone zloto, gdy jeszcze zbieramy.
        g2.lineWidth = 11 * u2;
        g2.strokeStyle = gotowy ? "#FF7A18" : "#5a5326";
        g2.beginPath(); g2.arc(cc, cc, 43.5 * u2, 0, Math.PI * 2); g2.stroke();
      });
      /* DOMEK zamiast szkicu z trzech kresek (decyzja wlasciciela 2026-09-16).
         Dwa slupy i belka czytaly sie z dwoch metrow jak platanina patykow —
         domek mowi jednym ksztaltem, PO CO dziecko zbiera drewno.

         Obrazek dojezdza asynchronicznie, wiec `rysuj` wola sie drugi raz,
         gdy plik sie wczyta — do tego czasu w tarczy jest sam pierscien. */
      const im = this._ikonaDomku();
      if (im && im.complete && im.naturalWidth) {
        const bok = 62 * u;
        g.drawImage(im, c0 - bok / 2, c0 - bok / 2, bok, bok);
      }
      spr.material.map.needsUpdate = true;
    };
    return spr;
  }

  ustawPlacBudowy(widoczny, gotowy = false) {
    const def = this.mapa.schronienie;
    if (!def || !Array.isArray(def.pos)) return;

    if (!widoczny || this._etapSchronienia > 0) {
      if (this._plac) {
        this.swiat.remove(this._plac);
        this._plac.traverse((o) => { o.geometry?.dispose?.(); });
        this._plac = null;
        this._placPierscien = null;
        this._placGotowy = undefined;
      }
      /* IKONA SCHODZI OSOBNO. Wisi w `swiat`, a nie w kotwicy placu (musi
         stać pionowo względem kuli, nie względem tarczy), więc usunięcie
         kotwicy jej nie ruszało — po postawieniu schronienia domek zostawał
         w powietrzu nad gotową budowlą. Samo wyzerowanie `_placIk` tylko
         zatrzymywało pętlę bujania i gubiło referencję do obiektu w scenie. */
      if (this._placIk) {
        this.swiat.remove(this._placIk);
        this._placIk.material.map?.dispose?.();
        this._placIk.material.dispose?.();
        this._placIk = null;
      }
      return;
    }

    const s = def.skala ?? 1;
    if (!this._plac) {
      const bryla = this._placBudowy(s);
      const kotwica = this._osadz(bryla, def.pos[0], def.pos[1], .01, def.obrot ?? 0);

      /* WYDEPTANA ZIEMIA dopiero tutaj, bo tafla liczy się w układzie kotwicy
         i musi próbkować teren pod nią. Bledsza i mniejsza niż gotowe
         klepisko — po postawieniu schronienia ma być widać różnicę: tu był
         zamiar, tam jest dom.

         PRZEŚWIT ODRABIA ZANURZENIE KOTWICY. `_osadz` wpuszcza ją 0,01 pod
         darń (żeby paliki nie odsłoniły płaskiego denka), więc w układzie
         kotwicy grunt leży na +0,01 — tafla liczona od zera wyszłaby POD
         ziemią. Stąd zanurzenie + 3 cm luzu: więcej niż falowanie darni
         między próbkami, a z kamery gry niewidoczne. */
      const matGrunt = new MeshLambertMaterial({
        color: 0x8E7A56, flatShading: true, transparent: true, opacity: .55,
      });
      const tarcza = new Mesh(taflaNaGruncie(this.planeta, kotwica, 1.02 * s, this.wysokoscGruntuSiatki, .01 + .03 * s), matGrunt);
      bryla.add(tarcza);

      /* KRĄG AKTYWNOŚCI — ten sam, co pod znakami minigier (`znak.js`).
         Pierścień ze smugą biegnącą po obwodzie znaczy w tej grze jedno:
         „tu jest coś do zrobienia". Plac budowy jest dokładnie tym.
         Siada na wysokości BRZEGU tafli, nie w jej środku: pierścień jest
         płaski, a brzeg tarczy leży niżej od środka o tyle, o ile kula
         ucieka spod stycznej. */
      const rPier = 1.02 * s;
      const luk = Math.sqrt(Math.max(0, this.planeta.R ** 2 - rPier ** 2)) - this.planeta.R;
      const pierscien = krag(0xFFC061, .26);
      pierscien.scale.setScalar(rPier / .66);
      pierscien.position.y = luk + .05 * s;
      pierscien.renderOrder = 3;
      bryla.add(pierscien);

      const ik = this._placIkona();
      // Ikona wisi w układzie planety, tak jak pierścień pracy: pozycja placu
      // plus normalna, a nie sztywne +Y (na kuli „góra" zależy od miejsca).
      ik.position.copy(kotwica.position).addScaledVector(
        this.planeta.normalna(def.pos[0], def.pos[1]), 1.45 * s);
      this.swiat.add(kotwica);
      this.swiat.add(ik);
      this._plac = kotwica;
      this._placIk = ik;
      this._placBaza = ik.position.clone();
      this._placN = this.planeta.normalna(def.pos[0], def.pos[1]).clone();

      this._placPierscien = pierscien;
      const bujaj = () => {
        if (this.destroyed || this._placIk !== ik) return;
        const t = performance.now() * .0022;
        const g = !!this._placGotowy;
        ik.position.copy(this._placBaza).addScaledVector(this._placN, Math.sin(t) * (g ? .11 : .05));
        /* 1,05 to rozmiar wskaźnika cięcia; stan „czeka" jest ciut mniejszy
           (1,00), bo różnica ma zostać — tyle że jako oddech, a nie jako
           dwa różne znaczki. Amplituda pulsu przeliczona w tej samej
           proporcji, co skala (0,045 · 1,05/0,62). */
        ik.scale.setScalar(g ? 1.05 + Math.sin(t * 1.6) * .076 : 1.0);
        /* Smuga biegnie zawsze, a z kompletem materiału — mocniej. Ta sama
           funkcja, co w znakach, więc tempo obiegu jest identyczne i dwa
           sygnały na mapie nie tłuką się innym rytmem. */
        smugaKregu(pierscien, performance.now() * .001, g ? 1.9 : .85);
        requestAnimationFrame(bujaj);
      };
      requestAnimationFrame(bujaj);
    }

    if (this._placGotowy !== gotowy) {
      this._placGotowy = gotowy;
      this._placIk?.rysuj(gotowy);
      const pier = this._placPierscien;
      if (pier) {
        // „czeka" jest przygaszone i piaskowe, „gotowy" — jasne i pomarańczowe,
        // tym samym pomarańczem, co pierścień postępu przy pile.
        pier.material.opacity = gotowy ? .5 : .24;
        pier.material.color.setHex(gotowy ? 0xFF7A18 : 0xE8C88A);
        if (pier.smuga) pier.smuga.material.color.setHex(gotowy ? 0xFFD9A0 : 0xE8C88A);
      }
    }
  }

  /* ── MAGICZNA FASOLA ──────────────────────────────────────────────────────── */

  _fasolaTik(e) {
    for (const o of this.oczka) o.tik(e);
    const F = this.fasola;
    if (!F) return;
    const d = this.planeta.odleglosc(this.hn, F.n);
    F.update(e, d, !!this.kropla?.ile);
    if (this._kino || this.sequence) return;
    // NABIERANIE WODY: wejście w DOWOLNE oczko z pustymi łapami. Woda jest
    // rozlana po świecie, więc dziecko nie ma obowiązku pamiętać, z którego
    // stawu „się wolno" napić — liczy się ten, przy którym akurat stoi.
    if (this.kropla && !this.kropla.ile) {
      for (const o of this.oczka) {
        if (this.planeta.odleglosc(this.hn, o.n) >= o.promien * 0.85) continue;
        this.kropla.dodaj();
        this.hint("Kropla wody!");
        this.emit("woda:nabrana", { pos: o.pos });
        try { navigator.vibrate?.([12, 30, 12]); } catch {}
        break;
      }
    }
    if (d < (F.def.zasieg ?? 1.9)) {
      // PODLANIE: kropla wlatuje w roślinę, roślina rośnie o etap.
      if (this.kropla?.ile && !F.gotowa && F.podlej()) {
        this.kropla.oddaj();
        this.hint(F.etap + 1 >= F.ostatni ? "Fasola sięga chmur!" : "Fasola rośnie!");
        this.emit("fasola:podlana", { etap: F.etap + 1, etapow: F.ostatni });
        this._wspUzbrojona = false;
        try { navigator.vibrate?.([18, 40, 18]); } catch {}
        if (this.input.lengthSq() < 0.02 && (this.moveSpeed || 0) < 0.05 && !this.walking) {
          this.play("happy", 0.12);
          this.sequence = "happy";
          this.seqTimer = 0;
        }
      } else if (F.gotowa && d < 1.1 && this._wspUzbrojona) {
        this._wspinaczkaStart();
      }
    } else if (d > 2.4) {
      // Wspinaczka uzbraja się dopiero po odejściu: po ostatnim podlaniu
      // dziecko ma zobaczyć całą roślinę, a po zejściu — nie wejść w pętlę.
      this._wspUzbrojona = true;
    }
  }

  /**
   * WSPINACZKA: lisek idzie po zewnętrznej stronie łodygi wzdłuż jej krzywej
   * (`fasola.sciezka(u)` → kąt, promień, wysokość), `czasWspinaczki` s, a na
   * szczycie scena zgłasza `swiat:dalej` z celem z mapy (`fasola.dalej`).
   * Na starcie kąt przechodzi płynnie z miejsca, gdzie stał lisek, do
   * początku łodygi. Ruch liczony w układzie planety: punkt obok osi
   * rośliny + wysokość nad ziemią, przód wzdłuż ruchu.
   */
  _wspinaczkaStart() {
    const F = this.fasola;
    this.stopWalk();
    this.mode = "free";
    this.sequence = "wspinaczka";
    this.seqTimer = 0;
    this._wsp = { kat0: 0 };
    this._wspDodatek = 0;
    // kąt startowy: tam, gdzie lisek stoi względem osi rośliny
    const f0 = stycznaDo(F.n, this.hn, this.hf, this._v1);
    const wsch = this._v2.set(1, 0, 0).applyQuaternion(this.planeta.ramka(F.def.pos[0], F.def.pos[1], this._qTmp));
    doStycznej(wsch, F.n);
    const kat0 = katMiedzy(wsch, f0, F.n);
    // różnica do początku łodygi, znormalizowana do (-π, π]
    let dk = kat0 - F.sciezka(0).kat;
    dk = Math.atan2(Math.sin(dk), Math.cos(dk));
    this._wsp.dk = dk;
    this.play("run", 0.15);
    this.emit("fasola:wspinaczka", { wysokosc: F.wysokosc, dalej: F.def.dalej || null });
  }

  _wspinaczkaKlatka(e) {
    const F = this.fasola, W = this._wsp;
    if (!F || !W) { this.sequence = null; return; }
    this.seqTimer += e;
    const t = Math.min(1, this.seqTimer / FASOLA.czasWspinaczki);
    const u = t * t * (3 - 2 * t);
    const sc = F.sciezka(u);
    const kat = sc.kat + W.dk * (1 - Math.min(1, u / 0.12));
    // punkt obok osi w kierunku `kat` (w ramce mapy w punkcie fasoli)
    const ramka = this.planeta.ramka(F.def.pos[0], F.def.pos[1], this._qTmp);
    const kier = this._v1.set(Math.cos(kat), 0, Math.sin(kat)).applyQuaternion(ramka);
    doStycznej(kier, F.n);
    const n = this.planeta.punktObok(F.n, kier, sc.r, this._v2);
    // przód: styczna ruchu po okręgu w stronę rosnącego kąta — d/dkat (cos, sin) = (−sin, cos) = kier × n
    const przod = this._v3.crossVectors(kier, F.n).normalize();
    this.hn.copy(n);
    this.hf.copy(przod);
    doStycznej(this.hf, this.hn);
    this.aktualizujHp();
    this._wspDodatek = sc.h;
    if (t >= 1) {
      this.sequence = null;
      this.play("happy", 0.2);
      const cel = F.def.dalej || null;
      this.emit("swiat:dalej", { cel, z: "fasola" });
      // bez celu (podgląd): lisek zostaje na ziemi obok łodygi
      this._wspDodatek = 0;
      this._wsp = null;
      this._wspUzbrojona = false;
    }
  }

  /* ── API publiczne ────────────────────────────────────────────────────────── */

  pauza() {
    if (this.paused || this.destroyed) return;
    this.paused = true;
    this.renderer.setAnimationLoop(null);
    this.emit("pauza");
  }
  wznow() {
    if (!this.paused || this.destroyed) return;
    this.paused = false;
    this.clock.getDelta();
    this.renderer.setAnimationLoop(() => this.tick());
    this.emit("wznowienie");
  }
  ustawBohatera(e, t) {
    if (!this.hero) return false;
    this._zasiewOstatnia = null;
    this._zasiewDroga = 0;
    this.stopWalk();
    this.mode = "free";
    this.planeta.normalna(e, t, this.hn);
    doStycznej(this.hf, this.hn);
    this.aktualizujHp();
    this.groundY = this.groundHeightAt(e, t);
    this.heroLift = this.groundY + (this.clipY?.[this.current] ?? 0);
    this.syncHero();
    return true;
  }
  ustawSpokojnyRuch(e) { spokojnyRuch = !!e; }
  ustawPowrotZnaku(e, t) {
    const n = (this.markers || []).find((i) => i.id === e);
    if (!n) return false;
    n.def.respawn = t === false ? Infinity : Number(t);
    return true;
  }

  /**
   * KINO — ujęcia na bohatera. Kamera ortograficzna: zbliżenie robi `zoom`,
   * kadr liczony z szerokości frustum. Tor: start przy pysku, obieg głowy
   * o `luk` radianów, potem MIESZANIE WAGOWE z normalnym położeniem (w: 1→0),
   * więc na ostatniej klatce kamera jest dokładnie tam, gdzie zwykle.
   */
  kino(e, t) {
    if (!this.hero || spokojnyRuch) return false;
    const P = {
      wejscie: { trzym: 1.9, powrot: 1.5, kadr: 1.7, luk: 1.45, el: 0.2 },
      bohater: { trzym: 0.9, powrot: 1.1, kadr: 2.6, luk: 0.8, el: 0.32 },
      blysk: { trzym: 0.45, powrot: 0.75, kadr: 3.4, luk: 0.45, el: 0.45 },
    };
    let p = P[e] || P.bohater;
    if (t) { p = Object.assign({}, p); for (const k in t) if (t[k] != null) p[k] = t[k]; }
    const hw = this.hero.getWorldPosition(new Vector3());
    const b = new Box3().setFromObject(this.hero);
    const gy = Math.min(2.2, Math.max(0.4, (b.max.y - hw.y) * 0.86));
    const szer = Math.max(0.001, this.camera.right - this.camera.left);
    const h = this.heading || 0;
    this._kino = {
      faza: "trzym", t: 0, trzymDl: p.trzym, powrotDl: p.powrot, gy,
      zoom: Math.max(1.05, szer / (p.kadr || 1.7)),
      az0: h - p.luk * 0.38, az1: h + p.luk * 0.62, el: p.el,
      br: this.camRight.clone(), bf: this.camFwd.clone(),
    };
    this.mode = "free";
    this.walking = false;
    this.emit("kino", { ujecie: e });
    return true;
  }
  kinoSkroc() {
    const K = this._kino;
    if (!K || K.faza !== "trzym") return false;
    K.pl = Math.min(1, K.t / Math.max(0.001, K.trzymDl));
    K.faza = "powrot";
    K.t = 0;
    K.powrotDl = 0.45;
    return true;
  }
  _kinoWejscie() {
    // Najazd wejscia odpala teraz WYLACZNIE Swiat, przez `kinoWejsciaTeraz()`,
    // i to ZA KAZDYM razem PO rozsunieciu chmur (inaczej ruch szedlby za
    // kurtyna). Tu, na zdarzeniu "gotowa" — czyli jeszcze pod chmurami — nie
    // robimy nic, zeby dwie animacje kamery (_kino i _wejscie) sie nie bily.
  }
  /**
   * Najazd wejscia (Swiat wola po rozsunieciu chmur): kamera zaczyna niemal
   * PROSTO Z GORY nad planeta, robi orbite wokol bohatera i szybko, dynamicznie
   * (easeOut) siada w domyslnej pozycji. Konczy sie DOKLADNIE na `camTarget +
   * camDir`, zoom 1 — wiec wtapia sie w normalny kadr bez przeskoku.
   */
  kinoWejsciaTeraz() {
    // Bez blokady spokojnyRuch — najazd ma grac ZAWSZE po rozsunieciu chmur
    // (decyzja wlasciciela). Jesli kiedys ma respektowac reduce-motion, wroci
    // tu warunek na spokojnyRuch albo skrocona wersja bez orbity.
    try { console.log("[KINO] kinoWejsciaTeraz; hero?", !!this.hero, "camDir?", !!this.camDir, "camPos?", !!this.camPos); } catch {}
    if (!this.hero) return false;
    const azDef = Math.atan2(this.camDir.x, this.camDir.z);
    this._wejscie = {
      t: 0,
      hold: 1.9,               // trzymaj kadr Z GORY, poki schodza chmury —
                               // zeby po ich zejsciu nie mignal domyslny kadr
      dl: 1.7,                 // orbita + dojazd do pozycji domyslnej PO holdzie
      epsStart: 1.40,          // ~80 stopni nad horyzontem = prawie prosto z gory
      azStart: azDef + 2.62,   // ~150 stopni orbity do azymutu domyslnego
      zoomStart: 0.72,         // z gory widac wiecej planety; dojazd do 1
    };
    return true;
  }
  _wejscieKlatka(e) {
    const W = this._wejscie;
    if (!W) return;
    if (W.t === 0) { try { console.log("[KINO] pierwsza klatka najazdu (start z gory)"); } catch {} }
    W.t += e;
    // q = 0 podczas holdu (kamera stoi z gory), potem easeOut ruchu do kadru.
    let q = 0;
    if (W.t > W.hold) {
      const p = Math.min(1, (W.t - W.hold) / W.dl);
      q = 1 - Math.pow(1 - p, 3);              // easeOutCubic: szybko, potem miekko siada
    }
    const L = this.camDir.length();
    const epsDef = Math.asin(Math.max(-1, Math.min(1, this.camDir.y / L)));
    const azDef = Math.atan2(this.camDir.x, this.camDir.z);
    const eps = W.epsStart + (epsDef - W.epsStart) * q;
    const az = W.azStart + (azDef - W.azStart) * q;
    const zoom = W.zoomStart + (1 - W.zoomStart) * q;
    const ce = Math.cos(eps), se = Math.sin(eps);
    this.camPos.set(
      this.camTarget.x + ce * Math.sin(az) * L,
      this.camTarget.y + se * L,
      this.camTarget.z + ce * Math.cos(az) * L
    );
    this._kc.set(this.camTarget.x, this.camTarget.y + 0.8, this.camTarget.z);
    if (Math.abs(this.camera.zoom - zoom) > 1e-4) { this.camera.zoom = zoom; this.camera.updateProjectionMatrix(); }
    if (W.t >= W.hold + W.dl) {
      this._wejscie = null;
      if (this.camera.zoom !== 1) { this.camera.zoom = 1; this.camera.updateProjectionMatrix(); }
      try { this.emit("wejscie:gotowe"); } catch {}
    }
  }
  /**
   * ODJAZD NA KONIEC DNIA. Gdy księżyc dochodzi do zenitu, kamera powoli
   * odchodzi od bohatera i zostawia widok całej planety pod pełnią nocy —
   * obraz sam mówi „to był cały dzień", zanim cokolwiek się o tym odezwie.
   *
   * Mnoży zoom USTAWIONY WYŻEJ, zamiast go nadpisywać. `_kinoKlatka`
   * i `_wejscieKlatka` co klatkę przywracają swoje wartości (1, gdy nic nie
   * robią), więc kolejność jest tu całą umową: odjazd idzie ostatni i skaluje
   * to, co zostało. Dzięki temu nie kłóci się ani z najazdem na wejściu, ani
   * ze spojrzeniem na fasolę — po prostu oddala każdy z nich.
   *
   * `sesja:zamknieta` leci RAZ, gdy odjazd praktycznie doszedł do końca.
   * Hub czeka na to zdarzenie zamiast odliczać własnym `setTimeout` — inaczej
   * podsumowanie wchodziłoby w środku ruchu kamery na wolniejszym telefonie.
   */
  /**
   * Zaczyna opad kłód z grupy wyniku ścinania. Bierze DZIECI gotowego stosu
   * i podnosi je do góry, zamiast budować cokolwiek osobno — dzięki temu
   * animacja nie ma własnego układu i nie rozjedzie się z `natura.js`,
   * gdy ktoś przestawi kłodę w stosie.
   *
   * PIENIEK NIE SPADA. Siedzi w tej samej grupie wyniku, ale jest tym, co
   * ZOSTAŁO po drzewie, a nie tym, co z niego powstało — spadający z nieba
   * pieniek przeczyłby całej scenie.
   *
   * Przy `prefers-reduced-motion` wychodzimy od razu: stos pojawia się jak
   * dotąd, w jednej klatce. Ta animacja jest tu po to, żeby pokazać sprawstwo,
   * a nie po to, żeby ją trzeba było wysiedzieć.
   */
  _zacznijOpadKlod(wynik, skala = 1) {
    if (spokojnyRuch) return;
    const stos = wynik.getObjectByName("stos-drewna") || wynik.getObjectByName("kamyczki");
    if (!stos || !stos.children.length) return;

    /* CEL ZAPAMIĘTANY PRZY BRYLE, nie odczytany z bieżącej pozycji. Pulpit dev
       potrafi cofnąć łańcuch zdarzeń w środku animacji (`oznaczZuzyte`),
       a wtedy ponowne ścięcie odczytałoby jako „miejsce w stosie" pozycję
       kłody wiszącej w powietrzu — i układ stosu rozjechałby się na stałe,
       bez śladu w kodzie. Docelowe wartości zapisujemy raz i trzymamy przy
       siatce; drugie ścięcie tego samego drzewa zastaje je gotowe. */
    const czesci = stos.children.map((m) => {
      const cel = m.userData.opadCel || (m.userData.opadCel = {
        y: m.position.y, rx: m.rotation.x, rz: m.rotation.z,
      });
      return { m, y: cel.y, rx: cel.rx, rz: cel.rz };
    });
    // Poprzedni lot tej samej grupy przestaje obowiązywać — inaczej dwie
    // animacje szarpałyby te same kłody w przeciwne strony.
    if (this._opadKlod) this._opadKlod = this._opadKlod.filter((a) => a.czesci[0]?.m.parent !== stos);
    /* OD DOŁU DO GÓRY, a szczapy na samym końcu. Szczyt piramidy ma lądować
       na czymś, a nie przed czymś — a szczapy są OPARTE o gotowy stos
       (`natura.js`), więc spadające przed nim opierałyby się o powietrze.
       Poznajemy je po geometrii: kłody to walce, szczapy to prostopadłościany.
       Sprawdzamy typ, a nie kolejność w grupie, bo kolejność należy do
       `natura.js` i ma prawo się tam zmienić. */
    const szczapa = (m) => m.geometry?.type === "BoxGeometry";
    czesci.sort((a, b) =>
      (szczapa(a.m) ? 1 : 0) - (szczapa(b.m) ? 1 : 0) || a.y - b.y);

    const wysokosc = Math.max(1.1, skala * OPAD_WYSOKOSC);
    czesci.forEach((c, i) => {
      c.opoznienie = i * OPAD_ODSTEP;
      /* Wyżej w stosie = wyżej start, więc wszystkie lecą mniej więcej z tego
         samego pułapu i żadna nie wyskakuje nisko tuż nad ziemią. */
      c.start = c.y + wysokosc;
      /* Przechył w locie jest LOSOWY, ale zawsze dochodzi do wartości
         docelowej — kłoda wiruje w powietrzu i siada równo, zamiast wpadać
         w stos krzywo i zostać tak na zawsze. */
      c.obrotX = c.rx + (Math.random() - .5) * 1.2;
      c.obrotZ = c.rz + (Math.random() - .5) * 1.2;
      c.m.visible = false;
    });

    (this._opadKlod || (this._opadKlod = [])).push({ czesci, t: 0 });
  }

  /**
   * Klatka opadu. Lista, nie pojedyncza animacja: dziecko potrafi ściąć drugie
   * drzewo, zanim pierwszy stos doleci, a wtedy przerwana animacja zostawiłaby
   * kłody wiszące w powietrzu na stałe.
   */
  _opadKlodKlatka(e) {
    const lista = this._opadKlod;
    if (!lista || !lista.length) return;
    for (let i = lista.length - 1; i >= 0; i--) {
      const a = lista[i];
      a.t += e;
      let wPowietrzu = false;
      for (const c of a.czesci) {
        const u = (a.t - c.opoznienie) / OPAD_CZAS;
        if (u < 0) { wPowietrzu = true; continue; }
        c.m.visible = true;
        if (u >= 1) {
          c.m.position.y = c.y;
          c.m.rotation.x = c.rx;
          c.m.rotation.z = c.rz;
          continue;
        }
        wPowietrzu = true;
        const p = opadKrzywa(u);
        c.m.position.y = c.start + (c.y - c.start) * p;
        // Obrót dochodzi do celu SZYBCIEJ niż pozycja (do końca lotu, nie do
        // końca odbicia) — kłoda ma być już równo ułożona, gdy dotknie stosu.
        const o = Math.min(1, u / .68);
        const w = o * o * (3 - 2 * o);
        c.m.rotation.x = c.obrotX + (c.rx - c.obrotX) * w;
        c.m.rotation.z = c.obrotZ + (c.rz - c.obrotZ) * w;
      }
      if (!wPowietrzu) lista.splice(i, 1);
    }
  }

  _nocKlatka(e) {
    if (!this.doba || !this.doba.naCzas) return;
    // „koniec", nie „noc": noc to dalej gra, dopiero księżyc w zenicie domyka
    // sesję (patrz `etapSesji` w `doba.js`).
    const noc = this.doba.etapSesji === "koniec";
    if (this._zoomNocy === undefined) this._zoomNocy = 1;
    if (!noc && this._zoomNocy === 1) return;
    const cel = noc ? ODDALENIE_NOCA : 1;
    // Wykładnicze dochodzenie, niezależne od liczby klatek. 0.34/s daje
    // odczuwalne „kamera się cofa" przez jakieś 6 sekund, bez szarpnięcia.
    this._zoomNocy += (cel - this._zoomNocy) * (1 - Math.exp(-0.34 * e));
    if (Math.abs(this._zoomNocy - cel) < 0.004) this._zoomNocy = cel;
    if (noc && !this._sesjaZamknieta && this._zoomNocy < ODDALENIE_NOCA + 0.02) {
      this._sesjaZamknieta = true;
      this.emit("sesja:zamknieta", { ...this.doba.stan });
    }
    if (this._zoomNocy !== 1) {
      this.camera.zoom *= this._zoomNocy;
      this.camera.updateProjectionMatrix();
    }
  }

  _kinoKlatka(e) {
    if (!this._kc) this._kc = new Vector3();
    if (!this._kcT) this._kcT = new Vector3();
    this._kc.set(this.camTarget.x, this.camTarget.y + 0.8, this.camTarget.z);
    const K = this._kino;
    if (!K || !this.hero) {
      if (this.camera.zoom !== 1) { this.camera.zoom = 1; this.camera.updateProjectionMatrix(); }
      return;
    }
    K.t += e;
    let w, pl;
    if (K.faza === "trzym") {
      pl = Math.min(1, K.t / Math.max(0.001, K.trzymDl));
      w = 1;
      if (K.t >= K.trzymDl) { K.faza = "powrot"; K.t = 0; }
    } else {
      pl = K.pl != null ? K.pl : 1;
      const q = Math.min(1, K.t / Math.max(0.001, K.powrotDl));
      w = 1 - q * q * (3 - 2 * q);
      if (K.t >= K.powrotDl) {
        this._kino = null;
        this.camRight.copy(K.br);
        this.camFwd.copy(K.bf);
        if (this.camera.zoom !== 1) { this.camera.zoom = 1; this.camera.updateProjectionMatrix(); }
        return;
      }
    }
    const ep = pl * pl * (3 - 2 * pl);
    const az = K.az0 + (K.az1 - K.az0) * ep;
    const el = K.el;
    const hp = this.hero.getWorldPosition(this._kcH || (this._kcH = new Vector3()));
    this._kcT.set(hp.x, hp.y + K.gy, hp.z);
    this._kc.lerp(this._kcT, w);
    this._kcT.set(Math.sin(az) * Math.cos(el), Math.sin(el), Math.cos(az) * Math.cos(el)).multiplyScalar(26).add(this._kc);
    this.camPos.lerp(this._kcT, w);
    const z = 1 + (K.zoom - 1) * w;
    if (Math.abs(this.camera.zoom - z) > 1e-4) { this.camera.zoom = z; this.camera.updateProjectionMatrix(); }
  }

  pokazZnak(e) {
    const t = (this.markers || []).find((n) => n.id === e);
    if (!t || t.state !== "gone") return false;
    t.state = "appear";
    t.phase = 0;
    t.setVisible(true);
    return true;
  }
  schowajZnak(e) {
    const t = (this.markers || []).find((n) => n.id === e);
    return t ? t.startAbsorb(true) : false;
  }
  stan() {
    return {
      gotowa: !!this.hero,
      pauza: this.paused,
      animacja: this.current,
      predkosc: +(this.moveSpeed || 0).toFixed(3),
      zasiew: { wlaczony: this.zasiewWlaczony, ...this.kwiaty?.stanZasiewu() },
      motyle: this.motyle ? this.motyle.stan() : null,
      fasola: this.fasola ? { etap: this.fasola.etap, etapow: this.fasola.ostatni, gotowa: this.fasola.gotowa, kropla: !!this.kropla?.ile } : null,
      bohater: this.hero ? { x: +this.hp.x.toFixed(2), z: +this.hp.z.toFixed(2) } : null,
      znaki: (this.markers || []).map((e) => ({ id: e.id, stan: e.state, dotkniecia: e.touches })),
      rabanie: {
        aktywne: !!this._rabanieAktywne,
        cele: (this._doScinania || []).map((c) => ({
          id: c.id, rodzaj: c.rodzaj, zrobione: c.zrobione,
          niesione: !!c.niesione, dostarczone: !!c.dostarczone,
          postep: +(c.postep || 0).toFixed(2), zasieg: c.zasieg,
          odleglosc: this.hn && c.n ? +this.planeta.odleglosc(this.hn, c.n).toFixed(2) : null,
          doWyniku: this.hn && c.nWyniku ? +this.planeta.odleglosc(this.hn, c.nWyniku).toFixed(2) : null,
        })),
        niesie: this._ladunek ? { rodzaj: this._ladunek.rodzaj, id: this._ladunek.id } : null,
        doPlacu: this.hn && this._nPlacu ? +this.planeta.odleglosc(this.hn, this._nPlacu).toFixed(2) : null,
      },
      podglad: this._podglad ? { faza: this._podglad.faza, pos: this._podglad.pos } : null,
      schronienie: {
        etap: this._etapSchronienia || 0,
        etapow: LICZBA_ETAPOW,
        miejsce: this.mapa.schronienie?.pos || null,
        plac: this._plac ? (this._placGotowy ? "gotowy" : "czeka") : "ukryty",
      },
    };
  }
  zniszcz() {
    if (this.destroyed) return;
    this.destroyed = true;
    this.renderer.setAnimationLoop(null);
    removeEventListener("resize", this.onWinResize);
    if (this.onKeyDown) {
      removeEventListener("keydown", this.onKeyDown);
      removeEventListener("keyup", this.onKeyUp);
      removeEventListener("blur", this.onBlur);
    }
    this.ro?.disconnect();
    this.scene.traverse((e) => {
      e.geometry?.dispose?.();
      const t = e.material ? (Array.isArray(e.material) ? e.material : [e.material]) : [];
      for (const n of t) {
        for (const i of ["map", "emissiveMap", "normalMap", "roughnessMap", "metalnessMap"]) n[i]?.dispose?.();
        n.dispose?.();
      }
    });
    this.mixer?.stopAllAction();
    this.renderer.dispose();
    this.listeners.clear();
    this.emit("zniszczona");
  }
  resize() {
    if (this.destroyed) return;
    const e = this.host.getBoundingClientRect();
    const t = Math.max(1, Math.round(e.width || innerWidth));
    const n = Math.max(1, Math.round(e.height || innerHeight));
    this.renderer.setSize(t, n);
    const i = t / n;
    // Kolejność: adres (strojenie) → mapa świata → wartość domyślna.
    const zadany = Number(globalThis.SCENA3D_ZOOM) || Number(this.mapa?.zoom) || ZOOM_DOMYSLNY;
    const poziomo = i >= 1;
    const bazowa = poziomo ? 14 : 8.4;

    // GDZIE W KADRZE STOI LISEK. W pionie kamera patrzy PONIŻEJ wierzchołka
    // kuli, więc lisek siedzi trochę nad środkiem i cała planeta wchodzi
    // w kadr. W poziomie odwrotnie: kamera patrzy WYŻEJ, lisek zjeżdża do
    // dolnej trzeciej, a zwolnione miejsce u góry bierze niebo. To ta zmiana
    // pozwala przybliżyć — patrz ogranicznik niżej.
    const R = this.planeta?.R || 8;
    const podniesienie = Number(globalThis.SCENA3D_KAMERA_PODNIESIENIE)
      || (poziomo
        ? (Number(globalThis.SCENA3D_KAMERA_PODNIESIENIE_POZIOM)
          || R * (this.mapa?.dolnyDok === false
            ? KAMERA_PODNIESIENIE_POZIOM_BEZ_DOKU
            : KAMERA_PODNIESIENIE_POZIOM))
        : (this.mapa?.kameraPodniesienie ?? R * KAMERA_PODNIESIENIE));
    if (this.camTarget && Math.abs(this.camTarget.y - (R + podniesienie)) > 1e-6) {
      this.camTarget.y = R + podniesienie;
      if (this.camPos) {
        this.camPos.copy(this.camTarget).add(this.camDir);
        this.camera.position.copy(this.camPos);
        this.camera.lookAt(this.camTarget);
      }
    }

    // OGRANICZNIK NIEBA. Przybliżenie powiększa bohatera, ale planeta rośnie
    // razem z nim i potrafi wypchnąć horyzont poza ekran — zostaje sam zielony
    // ekran, bez nieba, słońca i księżyca. Pilnujemy więc tego, co naprawdę
    // ma znaczenie: ile kadru zostaje NAD BOHATEREM. Dawna reguła liczyła całą
    // wysokość kadru i zakładała, że lisek stoi w jego środku — przy poziomym
    // ekranie, gdzie stoi nisko, ścinała zoom bez potrzeby.
    //
    //   nad liskiem = połowa kadru + podniesienie * PION_EKRANU
    //
    // (podniesienie ujemne podnosi liska w kadrze, więc zabiera mu niebo).
    const niebo = poziomo ? NIEBO_NAD_BOHATEREM_POZIOM : NIEBO_NAD_BOHATEREM;
    const nadBohaterem = Math.max(0.5, niebo * R - podniesienie * PION_EKRANU);
    const zoomMax = bazowa / (i * 2 * nadBohaterem);
    const zoom3d = Math.max(0.3, Math.min(zadany, zoomMax));
    const r = bazowa / zoom3d;
    const a = r / i;
    this.camera.left = -r / 2;
    this.camera.right = r / 2;
    this.camera.top = a / 2;
    this.camera.bottom = -a / 2;
    this.camera.updateProjectionMatrix();
    if (this.hero) this.updateCameraBasis();
  }
}
