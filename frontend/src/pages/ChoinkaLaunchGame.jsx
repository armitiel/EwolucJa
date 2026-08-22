/**
 * Lot Liska — dotykowa minigra 3D.
 *
 * Jedyny gest jest fizyczny i czytelny bez instrukcji tekstowej:
 * dziecko ciągnie liska razem z czubkiem sprężystej choinki, ustawia kierunek
 * i naciąg, a po puszczeniu choinka prostuje się i wystrzeliwuje bohatera.
 *
 * Scena jest proceduralna poza modelem liska (`/fox.glb`). Dzięki temu gra nie
 * zależy od osobnego levelu ani ciężkiego pliku środowiska, a gięcie choinki
 * naprawdę wynika z łańcucha segmentów 3D, nie z płaskiej animacji.
 */
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import EkranStartuGry from "../hub/EkranStartuGry.jsx";
import SplashGry from "../hub/SplashGry.jsx";
import RewardScreen from "../components/RewardScreen.jsx";
import { dodajMonety } from "../services/monety.js";
import { rozliczPartie } from "../hub/misjeGier.js";
import { poziomyGry } from "../hub/poziomyGier.js";
import { czyDev } from "../services/dev.js";
import { fx } from "../services/soundFx.js";
import "../hub/styles/hub.css";
import "../styles/choinka-launch.css";

const GRA = "lot-liska";
const KIERUNEK_KAMERY = new THREE.Vector3(4.2, 11.5, 8).normalize().multiplyScalar(26);
const KIERUNEK_KAMERY_NACIAG = new THREE.Vector3(5.4, 3.1, 10.8).normalize().multiplyScalar(21.5);
const CEL_KAMERY_START = new THREE.Vector3(0, 2.85, 0);
const KIERUNEK_LOTU = new THREE.Vector3(-0.52, 0, -1).normalize();
const PRAWO_LOTU = new THREE.Vector3(1, 0, -0.52).normalize();
/**
 * Obrecze stoja DALEJ, niz stały wczesniej (o jedna trzecia). Blisko postawiony
 * cel przy podgladzie toru zamienial gre w przeciaganie kropek na miejsce -
 * dopiero dystans robi z tego celowanie, w ktorym cos moze nie wyjsc.
 * Kazda pozycja jest sprawdzona symulacja tego samego modelu, ktorego uzywa
 * gra: przy pelnym naciagu lisek mija srodek najdalszej o 0,7 m, czyli miesci
 * sie w obreczy (promien 1,15), ale bez zapasu na niechlujstwo.
 */
const CELE = [
  new THREE.Vector3(-6.76, 4.8, -12.09),
  new THREE.Vector3(-8.58, 3.9, -14.69),
  new THREE.Vector3(-10.14, 2.8, -16.9),
];
const ILE_CELÓW = CELE.length;

/**
 * Promień obręczy — i zarazem promień zaliczenia. Był 0,68; przy tej wielkości
 * dziecko musiało trafić niemal w środek, a przelot obok krawędzi wyglądał jak
 * trafienie i tak (stary test liczył samą ODLEGŁOŚĆ od środka, w kuli 1,48).
 * 1,15 daje bramkę, przez którą widać, że się przeleciało.
 */
const PROMIEN_OBRECZY = 1.15;

/**
 * Wysokość środka liska, gdy stoi on na ziemi. Model jest wyśrodkowany w swojej
 * grupie i po normalizacji ma ok. 1 m, więc jego środek siada mniej więcej pół
 * ciała nad murawą (ziemia leży na y = −0,04). Stąd bierze się moment zetknięcia
 * przy lądowaniu po chybionym strzale.
 */
const POZIOM_LADOWANIA = 0.3;

/** Skala spoczynkowa obręczy — stała, żeby nie tworzyć wektora w każdej klatce. */
const JEDNOSTKOWA = new THREE.Vector3(1, 1, 1);

/**
 * POZIOM „brama”: DWIE obręcze stoją NARAZ i obie trzeba przelecieć
 * w jednym locie. Pozycje nie są wymyślone — leżą na jednym, realnym torze
 * lotu, policzonym z tego samego modelu, którego używa gra (`predkoscZNaciagu`
 * + grawitacja 7,3). Dzięki temu istnieje siła naciągu, przy której lisek
 * przechodzi przez obie.
 *
 * Druga brama stoi DALEJ (11,7 zamiast 10,7 metra od czubka) i — co ważne —
 * NIE na prostej: jest odsunięta ok. 0,9 m w bok od linii łączącej czubek
 * z pierwszą bramą, w tę samą stronę, w którą wygina się tor łatwego poziomu.
 * Tor lotu jest w poziomie prostą (balistyka bez skrętu), więc „łuk” bierze
 * się stąd, że dziecko musi wycelować MIĘDZY bramy: przy skręcie ok. −0,17
 * lisek mija środek każdej z nich o ~0,4 m — mieści się w obręczy (promień
 * 1,15), ale nie ma już marginesu na strzelanie „prosto przed siebie”.
 * Sprawdzone symulacją całego zakresu naciągu: najlepszy przelot mija środki
 * o 0,51 m, czyli zostaje ok. 0,6 m zapasu.
 */
const BRAMY = [
  new THREE.Vector3(-4.91, 4.11, -9.45),
  new THREE.Vector3(-8.06, 2.25, -12.96),
];

const ogranicz = (n, min, max) => Math.max(min, Math.min(max, n));

function stworzLiskaZastepczego() {
  const lis = new THREE.Group();
  const pomarancz = new THREE.MeshStandardMaterial({ color: 0xf28b22, roughness: 0.72 });
  const krem = new THREE.MeshStandardMaterial({ color: 0xffe2aa, roughness: 0.8 });
  const braz = new THREE.MeshStandardMaterial({ color: 0x5f351f, roughness: 0.78 });

  const tulow = new THREE.Mesh(new THREE.SphereGeometry(0.34, 18, 14), pomarancz);
  tulow.scale.set(0.9, 1.2, 0.8);
  lis.add(tulow);

  const glowa = new THREE.Mesh(new THREE.SphereGeometry(0.28, 18, 14), pomarancz);
  glowa.position.set(0, 0.43, 0);
  lis.add(glowa);

  [-1, 1].forEach((strona) => {
    const ucho = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.34, 10), pomarancz);
    ucho.position.set(strona * 0.17, 0.72, 0);
    ucho.rotation.z = -strona * 0.12;
    lis.add(ucho);
  });

  const pyszczek = new THREE.Mesh(new THREE.SphereGeometry(0.17, 14, 10), krem);
  pyszczek.scale.set(1.3, 0.75, 0.8);
  pyszczek.position.set(0, 0.35, 0.23);
  lis.add(pyszczek);

  const nos = new THREE.Mesh(new THREE.SphereGeometry(0.055, 10, 8), braz);
  nos.position.set(0, 0.38, 0.39);
  lis.add(nos);

  const ogon = new THREE.Mesh(new THREE.ConeGeometry(0.26, 0.85, 14), pomarancz);
  ogon.position.set(-0.46, -0.08, 0);
  ogon.rotation.z = -1.08;
  lis.add(ogon);
  return lis;
}

function dodajChoinke(scena) {
  const korzen = new THREE.Group();
  korzen.position.set(0, 0.05, 0);
  scena.add(korzen);

  const segmenty = [];
  const dlugosc = 0.58;
  let rodzic = korzen;
  for (let i = 0; i < 10; i++) {
    const wezel = new THREE.Group();
    if (i > 0) wezel.position.y = dlugosc;
    rodzic.add(wezel);
    segmenty.push(wezel);

    const t = i / 9;
    const pien = new THREE.Mesh(
      new THREE.CylinderGeometry(0.09 * (1 - t * 0.45), 0.11 * (1 - t * 0.35), dlugosc, 10),
      new THREE.MeshStandardMaterial({ color: 0x75502c, roughness: 0.9 })
    );
    pien.position.y = dlugosc / 2;
    pien.castShadow = true;
    wezel.add(pien);

    const igly = new THREE.Mesh(
      new THREE.ConeGeometry(0.88 * (1 - t * 0.62), 1.15, 14),
      new THREE.MeshStandardMaterial({
        color: i % 2 ? 0x397457 : 0x2f654c,
        roughness: 0.84,
        flatShading: true,
      })
    );
    igly.position.y = dlugosc * 0.52;
    igly.castShadow = true;
    wezel.add(igly);
    rodzic = wezel;
  }

  const czubek = new THREE.Object3D();
  czubek.position.y = dlugosc;
  rodzic.add(czubek);
  return { korzen, segmenty, czubek };
}

function dodajTlo(scena) {
  /* Polana siega DALEJ niz najdalsza obrecz (najdalszy cel lezy ok. 20 m od
     choinki). Wczesniej promien 13 konczyl ziemie przed celami, wiec chybiony
     lisek spadal w pustke - a odkad po pudle widac cale ladowanie, musi byc
     na czym wyladowac. Promien 32 to nie zapas na oko: symulacja calego
     zakresu naciagu daje najdalsze ladowanie ok. 26 m od choinki, a lisek
     odbija sie po nim jeszcze dwa razy. */
  const ziemia = new THREE.Mesh(
    new THREE.CircleGeometry(32, 72),
    new THREE.MeshStandardMaterial({ color: 0x315d45, roughness: 1 })
  );
  ziemia.rotation.x = -Math.PI / 2;
  ziemia.position.y = -0.04;
  ziemia.receiveShadow = true;
  scena.add(ziemia);

  const kamienMat = new THREE.MeshStandardMaterial({ color: 0x9a825f, roughness: 1 });
  for (let i = 0; i < 15; i++) {
    const kat = (i / 15) * Math.PI * 2;
    const d = 2.4 + (i % 3) * 0.42;
    const kamien = new THREE.Mesh(new THREE.DodecahedronGeometry(0.12 + (i % 2) * 0.05, 0), kamienMat);
    kamien.position.set(Math.cos(kat) * d, 0.08, Math.sin(kat) * d * 0.35);
    kamien.scale.y = 0.65;
    scena.add(kamien);
  }

  // Odległe choinki budują głębię, ale pozostają prostymi sylwetkami — główna
  // sprężysta choinka ma być jedynym obiektem, który prosi o dotknięcie.
  for (let i = 0; i < 9; i++) {
    const x = -5.3 + i * 1.32;
    if (Math.abs(x) < 1.1) continue;
    const daleka = new THREE.Mesh(
      new THREE.ConeGeometry(0.75 + (i % 2) * 0.2, 3.2 + (i % 3) * 0.25, 10),
      new THREE.MeshStandardMaterial({ color: i % 2 ? 0x214b3d : 0x285643, roughness: 1 })
    );
    daleka.position.set(x, 1.45, -3.4 - (i % 2) * 0.5);
    scena.add(daleka);
  }
}

/**
 * Obręcz to BRAMKA, przez którą się przelatuje — nie tarcza, w którą się trafia.
 * Stąd dwie grupy zamiast jednej: `grupa` trzyma pozycję i USTAWIENIE obręczy
 * (obraca się przodem do choinki), a `kolo` w środku tylko się kołysze. Gdyby
 * kołysanie siedziało na `grupa.rotation.z`, nadpisywałoby kąt ustawiony przez
 * `lookAt` i płaszczyzna, którą sprawdzamy w locie, powoli by się przekręcała.
 */
function stworzCel(scena) {
  const grupa = new THREE.Group();
  const kolo = new THREE.Group();
  grupa.add(kolo);
  const obrecz = new THREE.Mesh(
    new THREE.TorusGeometry(PROMIEN_OBRECZY, 0.155, 12, 44),
    new THREE.MeshStandardMaterial({
      color: 0xf6b93b,
      emissive: 0x8a4c12,
      emissiveIntensity: 0.48,
      roughness: 0.38,
      metalness: 0.18,
    })
  );
  obrecz.castShadow = true;
  kolo.add(obrecz);
  const srodek = new THREE.Mesh(
    new THREE.CircleGeometry(PROMIEN_OBRECZY - 0.13, 32),
    new THREE.MeshBasicMaterial({ color: 0xffe39a, transparent: true, opacity: 0.16, side: THREE.DoubleSide })
  );
  srodek.position.z = -0.03;
  kolo.add(srodek);
  scena.add(grupa);
  grupa.kolo = kolo;
  return grupa;
}

export default function ChoinkaLaunchGame({ osadzona = false, poziom = null, onWyjscie }) {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const graRef = useRef({ sterowanie: null });
  const wyplaconoRef = useRef(false);
  /* Wybrany poziom żyje w stanie, a nie tylko w propsie: z mapy gra wchodzi
     od razu z poziomem, ale z biblioteki dziecko wybiera go na ekranie startu
     — i wtedy scena musi się przebudować pod nowy układ obręczy. */
  const [wybranyPoziom, setWybranyPoziom] = useState(poziom || "jeden");
  const brama = wybranyPoziom === "brama";
  const [faza, setFaza] = useState(poziom ? "gra" : "splash");
  const [trafienia, setTrafienia] = useState(0);
  const [strzaly, setStrzaly] = useState(0);
  const [monety, setMonety] = useState(0);
  const [komunikat, setKomunikat] = useState("Dotknij liska i przeciągnij w dół");
  // Nagroda Wizkora za domkniętą misję — 0, gdy misji nie ma albo sosna nie
  // została jeszcze znaleziona na mapie.
  const [nagrodaMisji, setNagrodaMisji] = useState(0);

  const wrocDoHuba = useCallback(() => {
    if (onWyjscie) onWyjscie();
    else navigate("/swiat");
  }, [navigate, onWyjscie]);

  const start = useCallback(() => {
    setTrafienia(0);
    setStrzaly(0);
    setMonety(0);
    setKomunikat("Dotknij liska i przeciągnij w dół");
    setNagrodaMisji(0);
    wyplaconoRef.current = false;
    setFaza("gra");
  }, []);

  /* Misja Wizkora zamyka się TUTAJ — dokładnie tak samo jak w `MemoryGame`
     i w `MemoryGame`. Bez tego partia kończyła się, a `wygrana` w łańcuchu
     zostawała na `false`: kafelek w HUD wisiał na „0/1" po przelocie przez
     obręcze i nagrody od Wizkora nie było. Ta gra powstała, zanim łańcuch
     dostał swoje trzecie i czwarte zadanie. */
  useEffect(() => {
    if (faza !== "koniec" || wyplaconoRef.current) return;
    wyplaconoRef.current = true;
    if (monety > 0) dodajMonety(monety, "minigra:lot-liska");
    try {
      const { dodane } = rozliczPartie(GRA);
      setNagrodaMisji(dodane || 0);
    } catch { setNagrodaMisji(0); }
  }, [faza, monety]);

  /* Uchwyt dla pulpitu testowego — ten sam wzorzec, co w pozostałych grach.
     Tylko w trybie dev. Kończy partię tak, jak kończy ją dziecko: komplet
     trafień i pełna stawka, więc idzie tą samą drogą (wypłata, domknięcie
     misji, ekran nagrody). */
  useEffect(() => {
    if (!czyDev()) return undefined;
    window.__devGra = {
      id: GRA,
      wygraj: () => {
        setTrafienia(brama ? BRAMY.length : ILE_CELÓW);
        setMonety(poziomyGry(GRA).find((p) => p.id === wybranyPoziom)?.monetyMax || 0);
        setFaza("koniec");
      },
    };
    return () => { if (window.__devGra?.id === GRA) delete window.__devGra; };
  }, [brama, wybranyPoziom]);

  useEffect(() => {
    if (faza !== "gra") return undefined;
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const scena = new THREE.Scene();
    // Mgla odsunieta: obrecze stoja teraz do 20 metrow od choinki, czyli
    // blisko 40 od kamery - przy dawnym zakresie (27-43) najdalsza tonela w
    // mgle i nie bylo w co celowac. Dalej robi glebie, ale juz za celami.
    scena.fog = new THREE.Fog(0x294b3f, 36, 76);
    // Dokładnie ten sam rzut i kąt co na głównej mapie: kamera ortograficzna
    // oraz kierunek (4.2, 11.5, 8). Gra wygląda dzięki temu jak fragment
    // polany, a nie osobna strzelnica widziana z boku.
    /* Kamera PERSPEKTYWICZNA, ale waskokatna - jak teleobiektyw. Przy rzucie
       ortograficznym (a taki byl tu wczesniej, dla zgodnosci z mapa) obrecz
       stojaca 20 metrow dalej jest dokladnie tak samo duza jak ta o 5 metrow -
       nic nie mowilo, ze cel jest DALEKO, a lot nie wygladal na lot w glab.
       Waski kat (liczony w `dopasuj` tak, zeby kadr mial te sama wysokosc, co
       przy starym rzucie) daje glebie, a mimo to nie rozjezdza sceny w
       rybie oko - z daleka nadal czyta sie jak fragment polany z mapy. */
    const ODLEGLOSC_ODNIESIENIA = 24;
    const kamera = new THREE.PerspectiveCamera(30, 1, 0.1, 90);
    const kameraCel = CEL_KAMERY_START.clone();
    kamera.position.copy(kameraCel).add(KIERUNEK_KAMERY);
    kamera.lookAt(kameraCel);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    scena.add(new THREE.HemisphereLight(0xfff4c7, 0x18382d, 2.15));
    const slonce = new THREE.DirectionalLight(0xffdf91, 3.2);
    slonce.position.set(-4, 8, 6);
    slonce.castShadow = true;
    slonce.shadow.mapSize.set(1024, 1024);
    scena.add(slonce);
    const wypelnienie = new THREE.PointLight(0xb993ff, 1.8, 12);
    wypelnienie.position.set(4, 5, 4);
    scena.add(wypelnienie);

    dodajTlo(scena);
    const choinka = dodajChoinke(scena);
    /* Na łatwym poziomie obręcz jest jedna i wędruje po trafieniu. Na „bramie"
       stoją obie naraz — dziecko musi ZOBACZYĆ tor, zanim wystrzeli,
       bo celuje nie w punkt, tylko w korytarz. */
    const cele = (brama ? BRAMY : [CELE[0]]).map((poz) => {
      const c = stworzCel(scena);
      c.position.copy(poz);
      c.lookAt(0, c.position.y, 0);
      return c;
    });
    const cel = cele[0];
    /* Kamera i kadrowanie mają patrzeć na obręcz, która jest teraz CELEM.
       Na łatwym poziomie jest tylko jedna; na bramie „teraz" zmienia się
       w trakcie lotu, a kamera pokazująca pierwszą bramę po jej przelocie
       zostawiałaby liska poza kadrem. */
    const celTeraz = () => cele[Math.min(stan.bramaIndex, cele.length - 1)];

    const lis = new THREE.Group();
    const zastepczy = stworzLiskaZastepczego();
    lis.add(zastepczy);
    lis.scale.setScalar(0.96);
    scena.add(lis);

    let modelLiska = null;
    const loader = new GLTFLoader();
    loader.load(
      "/fox.glb",
      (gltf) => {
        if (!zywe) return;
        modelLiska = gltf.scene;
        const box = new THREE.Box3().setFromObject(modelLiska);
        const rozmiar = box.getSize(new THREE.Vector3());
        const s = 1.05 / Math.max(rozmiar.x, rozmiar.y, rozmiar.z, 0.01);
        modelLiska.scale.setScalar(s);
        box.setFromObject(modelLiska);
        const srodek = box.getCenter(new THREE.Vector3());
        modelLiska.position.sub(srodek);
        modelLiska.rotation.y = -Math.PI / 2;
        modelLiska.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
        lis.remove(zastepczy);
        lis.add(modelLiska);
      },
      undefined,
      () => { /* Proceduralny lis pozostaje pełnoprawnym fallbackiem offline. */ }
    );

    /* ── Podglad toru: STRZALKA W LUKU, w scenie 3D ────────────────────
       Trzy podejscia, kazde odrzucone z innego powodu:

       1. Sznur kropek - mowil "gdzies tedy poleci", ale nie mowil, KTOREDY tor
          idzie w glab. Kilkanascie jednakowych kulek wyglada tak samo przy
          strzale w dal i przy strzale w bok.
       2. Rurka 3D o stalej grubosci w metrach - przy tej skali sceny robila
          sie nitka, a grot-stozek widziany od tylu byl plamka.
       3. Plaska strzalka w SVG NAD plotnem - czytelna, ale rysowana po
          wszystkim: zaslaniala liska i czubek choinki, bo nic o nich nie
          wiedziala.

       Zostaje wersja, ktora laczy zalety dwoch ostatnich: wstega ZYJE W
       SCENIE (wiec lisek i choinka ja zaslaniaja, bo dziala bufor glebi), ale
       jej szerokosc liczymy w PIKSELACH i przeliczamy na metry przez skale
       kamery ortograficznej. Wstega jest tez billboardem - obraca sie plaska
       strona do kamery - wiec nigdy nie splaszczy sie do kreski.

       Kamera jest ortograficzna, wiec przelicznik piksel-metr jest jeden dla
       calej sceny: wysokosc kadru / zoom / wysokosc plotna. */
    /* Strzalka jest CELOWNIKIEM, nie prognoza. Pokazuje tylko pierwszy kawalek
       lotu - kierunek i to, jak mocno lisek wystrzeli - a nie miejsce, w ktore
       spadnie. Pelny tor zamienial gre w ustawianie kropki na obreczy: dziecko
       nie celowalo, tylko przeciagalo koniec sznura na cel i puszczalo.
       Dlugosc strzalki rosnie z naciagiem, wiec sila nadal jest widoczna. */
    const KROK_TORU = 0.06;        // sekundy miedzy probkami balistyki
    const PROBEK_TORU = 8;         // ~0,5 s lotu, czyli okolo jednej trzeciej
    const SZER_OGON = 21;          // piksele - grubosc wstegi przy choince
    const SZER_PRZOD = 13;         // ...i tuz przed grotem
    const GROT_POL = 27;           // polowa szerokosci grotu
    const GROT_DL = 34;
    const KOLOR_OGON = new THREE.Color(0xc87a12);
    const KOLOR_GROT = new THREE.Color(0xfff0b0);

    const torLuk = new THREE.Mesh(
      new THREE.BufferGeometry(),
      new THREE.MeshBasicMaterial({
        vertexColors: true, transparent: true, opacity: 0.95,
        depthWrite: false, side: THREE.DoubleSide,
      })
    );
    torLuk.visible = false;
    torLuk.renderOrder = 2;
    scena.add(torLuk);

    /* Druga, blada kopia tej samej wstegi, rysowana BEZ testu glebi. Sam
       bufor glebi zalatwia zaslanianie zbyt dobrze: tor ucieka za choinke i za
       liska, wiec strzalka potrafila zniknac w polowie. Duch pokazuje, ktoredy
       leci ukryty kawalek, ale jest na tyle bledy, ze nie zakrywa postaci. */
    const torDuch = new THREE.Mesh(
      torLuk.geometry,
      new THREE.MeshBasicMaterial({
        vertexColors: true, transparent: true, opacity: 0.26,
        depthTest: false, depthWrite: false, side: THREE.DoubleSide,
      })
    );
    torDuch.visible = false;
    torDuch.renderOrder = 3;
    scena.add(torDuch);

    const tmpProbki = [];
    const tmpWidok = new THREE.Vector3();
    const tmpStyczna = new THREE.Vector3();
    const tmpBok = new THREE.Vector3();
    const tmpKolor = new THREE.Color();

    const stan = {
      tryb: "gotowy",
      naciagX: 0,
      naciagY: 0,
      ugiecie: 0,
      startX: 0,
      startY: 0,
      pointerId: null,
      predkosc: new THREE.Vector3(),
      predkoscOdbicia: new THREE.Vector3(),
      czasLotu: 0,
      czasTrafienia: 0,
      czasProstowania: 0,
      czasPodgladu: 0,
      celIndex: 0,
      trafienia: 0,
      strzaly: 0,
      /* Do wykrycia PRZELOTU: po której stronie płaszczyzny obręczy był lisek
         w poprzedniej klatce i gdzie dokładnie stał. Bez tego nie da się
         znaleźć punktu przecięcia — przy 60 klatkach na sekundę i szybkim
         locie lisek potrafi przeskoczyć obręcz w całości między klatkami. */
      stronaObreczy: null,
      poprzedniaPozycja: new THREE.Vector3(),
      /* Poziom „brama": indeks obręczy, przez którą lisek ma przelecieć jako
         następną. Kolejność jest istotna — bramy stoją jedna za drugą, więc
         sprawdzamy zawsze tylko TĘ jedną. */
      bramaIndex: 0,
      stronaBramy: null,
      /* LOT PO PUDLE. Chybiony strzał nie zamraża liska w powietrzu — lisek
         leci dalej własnym pędem, odbija się od ziemi i dopiero gdy się
         zatrzyma, gra wraca do naciągu. Te cztery pola prowadzą tę scenę. */
      czasPudla: 0,
      odbicia: 0,
      wSpoczynku: false,
      czasSpoczynku: 0,
    };
    const tmpTip = new THREE.Vector3();
    const tmpKamera = new THREE.Vector3();
    const tmpKierunekKamery = KIERUNEK_KAMERY.clone();
    const kameraNaciag = new THREE.Vector3();
    const kameraFokus = new THREE.Vector3();
    const kameraFokusNaciagu = new THREE.Vector3();
    const tmpKierunek = new THREE.Vector3();
    const tmpNormalna = new THREE.Vector3();
    const tmpPrzeciecie = new THREE.Vector3();
    const tmpLisEkran = new THREE.Vector3();
    const tmpPrawoKamery = new THREE.Vector3();
    const tmpGoraKamery = new THREE.Vector3();
    const zegar = new THREE.Clock();
    let raf = 0;
    let zywe = true;
    let zakonczTimer = 0;

    const ustawChoinke = (ugiecie, kierunek) => {
      choinka.segmenty.forEach((segment, i) => {
        const t = (i + 1) / choinka.segmenty.length;
        segment.rotation.z = -kierunek * ugiecie * (0.022 + t * 0.078);
        segment.rotation.x = ugiecie * 0.012 * Math.sin(i * 0.85);
      });
      choinka.korzen.updateMatrixWorld(true);
    };

    const predkoscZNaciagu = () => {
      const sila = ogranicz(stan.ugiecie, 0.18, 1);
      const skret = -stan.naciagX / 145;
      tmpKierunek.copy(KIERUNEK_LOTU).addScaledVector(PRAWO_LOTU, skret * 0.24).normalize();
      /* Zasieg musial urosnac razem z dystansem do obreczy. Wartosci nie sa
         zgadniete - wyszly z przemiatania calego zakresu naciagu przeciwko
         nowym pozycjom celow. Wychodzi z tego progresja sily: pierwsza obrecz
         jest do wziecia od naciagu ~0,3, druga od ~0,5, trzecia od ~0,63.
         Zaden cel nie wymaga naciagu na maksa (to byloby jedno ustawienie dla
         wszystkich), a przypadkowe machniecie trafia w pierwsza obrecz w
         okolo 12 przypadkach na sto - wiec celowanie ma znaczenie. */
      const pozioma = 8.0 + sila * 5.6;
      return new THREE.Vector3(
        tmpKierunek.x * pozioma,
        2.0 + Math.max(0, stan.naciagY) * 0.009 + sila * 0.5,
        tmpKierunek.z * pozioma
      );
    };

    const pokazTor = () => {
      choinka.czubek.getWorldPosition(tmpTip);
      const v = predkoscZNaciagu();

      tmpProbki.length = 0;
      for (let i = 0; i <= PROBEK_TORU; i++) {
        const t = i * KROK_TORU;
        const y = tmpTip.y + v.y * t - 0.5 * 7.3 * t * t;
        if (y < 0.35 && i > 2) break;   // gdyby ktos celowal w ziemie tuz obok
        tmpProbki.push(new THREE.Vector3(tmpTip.x + v.x * t, y, tmpTip.z + v.z * t));
      }
      const n = tmpProbki.length;
      if (n < 3) { schowajTor(); return; }

      const wysPlotna = canvas.clientHeight || 1;
      // W perspektywie metr na piksel rosnie z odlegloscia - inaczej strzalka
      // zwezalaby sie w glab kadru razem ze scena i po chwili znikala.
      const stozek = (2 * Math.tan((kamera.fov * Math.PI) / 360)) / (kamera.zoom * wysPlotna);
      const naPikselW = (punkt) => kamera.position.distanceTo(punkt) * stozek;
      kamera.getWorldDirection(tmpWidok);

      const poz = new Float32Array(n * 6 + 9);
      const kol = new Float32Array(n * 6 + 9);
      const idx = [];

      for (let i = 0; i < n; i++) {
        const p = tmpProbki[i];
        if (i < n - 1) tmpStyczna.copy(tmpProbki[i + 1]).sub(p).normalize();
        else tmpStyczna.copy(p).sub(tmpProbki[i - 1]).normalize();
        // Bok wstegi prostopadly i do toru, i do kierunku patrzenia - dzieki
        // temu wstega zawsze stoi plaska strona do dziecka.
        tmpBok.crossVectors(tmpStyczna, tmpWidok).normalize();
        const u = i / (n - 1);
        const polSzer = (SZER_OGON + (SZER_PRZOD - SZER_OGON) * u) * 0.5 * naPikselW(p);
        const o = i * 6;
        poz[o] = p.x + tmpBok.x * polSzer;
        poz[o + 1] = p.y + tmpBok.y * polSzer;
        poz[o + 2] = p.z + tmpBok.z * polSzer;
        poz[o + 3] = p.x - tmpBok.x * polSzer;
        poz[o + 4] = p.y - tmpBok.y * polSzer;
        poz[o + 5] = p.z - tmpBok.z * polSzer;
        tmpKolor.copy(KOLOR_OGON).lerp(KOLOR_GROT, u);
        kol[o] = kol[o + 3] = tmpKolor.r;
        kol[o + 1] = kol[o + 4] = tmpKolor.g;
        kol[o + 2] = kol[o + 5] = tmpKolor.b;
        if (i < n - 1) {
          const a = i * 2;
          idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
        }
      }

      // Grot: trojkat szerszy od wstegi, osadzony na jej koncu.
      const koniecLuku = tmpProbki[n - 1];
      const naPikselGrotu = naPikselW(koniecLuku);
      const polGrotu = GROT_POL * naPikselGrotu;
      const dlGrotu = GROT_DL * naPikselGrotu;
      const b = n * 6;
      poz[b] = koniecLuku.x + tmpBok.x * polGrotu;
      poz[b + 1] = koniecLuku.y + tmpBok.y * polGrotu;
      poz[b + 2] = koniecLuku.z + tmpBok.z * polGrotu;
      poz[b + 3] = koniecLuku.x - tmpBok.x * polGrotu;
      poz[b + 4] = koniecLuku.y - tmpBok.y * polGrotu;
      poz[b + 5] = koniecLuku.z - tmpBok.z * polGrotu;
      poz[b + 6] = koniecLuku.x + tmpStyczna.x * dlGrotu;
      poz[b + 7] = koniecLuku.y + tmpStyczna.y * dlGrotu;
      poz[b + 8] = koniecLuku.z + tmpStyczna.z * dlGrotu;
      for (let k = 0; k < 3; k++) {
        kol[b + k * 3] = KOLOR_GROT.r;
        kol[b + k * 3 + 1] = KOLOR_GROT.g;
        kol[b + k * 3 + 2] = KOLOR_GROT.b;
      }
      idx.push(n * 2, n * 2 + 1, n * 2 + 2);

      torLuk.geometry.dispose();
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(poz, 3));
      geo.setAttribute("color", new THREE.BufferAttribute(kol, 3));
      geo.setIndex(idx);
      torLuk.geometry = geo;
      torDuch.geometry = geo;      // ta sama bryla, inny material
      torLuk.visible = true;
      torDuch.visible = true;
    };

    const schowajTor = () => { torLuk.visible = false; torDuch.visible = false; };

    const przeliczKadry = () => {
      kameraFokus.set(cel.position.x, cel.position.y - 0.65, cel.position.z);
      // Po powrocie cel zostaje na skraju kadru jako drogowskaz, ale choinka
      // nadal jest dużym obiektem do naciągnięcia.
      kameraNaciag.copy(CEL_KAMERY_START).lerp(kameraFokus, 0.22);
    };

    const utrzymajLiskaWKadrze = () => {
      kamera.updateMatrixWorld(true);
      tmpLisEkran.copy(lis.position).project(kamera);

      // W perspektywie polowa kadru zalezy od tego, JAK DALEKO jest lisek -
      // przy stalej wartosci korekta byla raz za mala, raz przestrzelona.
      const odleglosc = kamera.position.distanceTo(lis.position);
      const polWysokosci = odleglosc * Math.tan((kamera.fov * Math.PI) / 360) / kamera.zoom;
      const polSzerokosci = polWysokosci * kamera.aspect;
      const korektaX = tmpLisEkran.x < -0.72
        ? (tmpLisEkran.x + 0.72) * polSzerokosci
        : tmpLisEkran.x > 0.72
          ? (tmpLisEkran.x - 0.72) * polSzerokosci
          : 0;
      const korektaY = tmpLisEkran.y < -0.62
        ? (tmpLisEkran.y + 0.62) * polWysokosci
        : tmpLisEkran.y > 0.58
          ? (tmpLisEkran.y - 0.58) * polWysokosci
          : 0;

      if (korektaX || korektaY) {
        tmpPrawoKamery.set(1, 0, 0).applyQuaternion(kamera.quaternion);
        tmpGoraKamery.set(0, 1, 0).applyQuaternion(kamera.quaternion);
        kameraCel.addScaledVector(tmpPrawoKamery, korektaX).addScaledVector(tmpGoraKamery, korektaY);
        kamera.position.addScaledVector(tmpPrawoKamery, korektaX).addScaledVector(tmpGoraKamery, korektaY);
        kamera.lookAt(kameraCel);
      }
    };

    const prowadzKameraZaNaciagiem = (intensywnosc, dt, czas) => {
      const t = ogranicz(intensywnosc, 0, 1);
      const miekkieT = t * t * (3 - 2 * t);
      const szybkosc = 1 - Math.exp(-9 * dt);

      // Im mocniejszy naciąg, tym niżej schodzi kamera i tym dalej patrzy
      // w kierunku lotu. Choinka zostaje na dole kadru, a przed graczem
      // otwiera się więcej polany i dłuższy tor.
      // Środek kadru reaguje również na ruch boczny: jest wyliczany pomiędzy
      // aktualnym czubkiem z liskiem a celem, zamiast przesuwać się po jednej osi.
      tmpKamera.copy(tmpTip).lerp(cel.position, 0.5);
      kameraFokusNaciagu.copy(kameraNaciag).lerp(tmpKamera, miekkieT);
      kameraFokusNaciagu.y -= 0.18 * miekkieT;
      kameraCel.lerp(kameraFokusNaciagu, szybkosc);
      tmpKierunekKamery.lerpVectors(KIERUNEK_KAMERY, KIERUNEK_KAMERY_NACIAG, miekkieT);
      // Kamera przy mocnym naciagu ODJEZDZA (do 18% dalej). W perspektywie
      // znaczy to, ze cel realnie sie oddala, a nie tylko przesuwa - dziecko
      // widzi, ze mierzy w cos daleko, i mocniejszy naciag ma sens.
      tmpKierunekKamery.multiplyScalar(1 + 0.18 * miekkieT);

      const ruchBoczny = ogranicz(Math.abs(stan.naciagX) / 145, 0, 1);
      const zoomNaciagu = 0.88 - ruchBoczny * 0.08;
      kamera.zoom += ((1 + (zoomNaciagu - 1) * miekkieT) - kamera.zoom) * szybkosc;
      kamera.updateProjectionMatrix();
      kamera.position.copy(kameraCel).add(tmpKierunekKamery);

      // Ledwo wyczuwalne drżenie dopiero przy prawie pełnym napięciu.
      const napiecie = ogranicz((t - 0.86) / 0.14, 0, 1);
      kamera.position.x += Math.sin(czas * 34) * 0.018 * napiecie;
      kamera.position.y += Math.cos(czas * 29) * 0.012 * napiecie;
      kamera.lookAt(kameraCel);
      utrzymajLiskaWKadrze();
    };

    const resetDoNaciagu = (pokazCel = true) => {
      stan.tryb = pokazCel ? "podglad" : "gotowy";
      stan.ugiecie = 0;
      stan.naciagX = 0;
      stan.naciagY = 0;
      stan.czasLotu = 0;
      stan.czasPudla = 0;
      stan.odbicia = 0;
      stan.wSpoczynku = false;
      stan.czasSpoczynku = 0;
      stan.predkosc.set(0, 0, 0);
      // Pamięć o stronie obręczy musi zniknąć razem z lotem — inaczej pierwsza
      // klatka nowego strzału porównywałaby się z poprzednim i mogła zaliczyć
      // przelot, którego nie było.
      stan.stronaObreczy = null;
      /* Na bramie każdy strzał zaczyna liczenie od zera: „dwie z trzech"
         z poprzedniego lotu nie przenosi się na następny, bo cała trudność
         tego poziomu polega na przejściu wszystkich JEDNYM lotem. */
      stan.stronaBramy = null;
      if (brama) {
        stan.bramaIndex = 0;
        stan.trafienia = 0;
        setTrafienia(0);
        cele.forEach((c) => c.scale.setScalar(1));
      }
      ustawChoinke(0, 0);
      choinka.czubek.getWorldPosition(tmpTip);
      lis.position.copy(tmpTip);
      stan.poprzedniaPozycja.copy(tmpTip);
      lis.rotation.set(0, 0, 0);
      stan.czasPodgladu = 0;
      przeliczKadry();
      setKomunikat(pokazCel ? "Spójrz, tam jest cel!" : "Naciągnij i leć w lewo");
    };

    const trafienie = () => {
      stan.tryb = "trafienie";
      stan.czasTrafienia = 0;
      tmpKierunek.copy(stan.predkosc);
      if (tmpKierunek.lengthSq() < 0.001) tmpKierunek.copy(KIERUNEK_LOTU);

      /* LIS PRZELATUJE NA DRUGĄ STRONĘ. Wcześniej obręcz była fizyczną
         przeszkodą: lisek zatrzymywał się przed jej płaszczyzną i odbijał do
         gracza. Czytało się to jak uderzenie w tarczę, a nie jak przelot przez
         bramkę — i kłóciło się z tym, co dziecko właśnie zrobiło.
         Zostaje mu jego własny pęd, tylko przygaszony, żeby lot za obręczą
         trwał chwilę dłużej i dało się go zobaczyć. */
      stan.predkoscOdbicia.copy(tmpKierunek).multiplyScalar(0.62);
      stan.predkoscOdbicia.y = Math.max(0.4, stan.predkoscOdbicia.y);
      stan.predkosc.set(0, 0, 0);
      stan.trafienia = brama ? cele.length : stan.trafienia + 1;
      setTrafienia(stan.trafienia);
      setKomunikat(brama ? "Obie bramy! ✦" : "Przelot! ✦");
      try { fx?.sukces?.(); } catch {}
      if (!brama) cel.scale.setScalar(1.28);
      /* Na „bramie" koniec przychodzi po JEDNYM udanym locie — nagroda jest
         wyższa, bo trzeba było trafić trzy razy z rzędu bez poprawki. */
      if (brama || stan.trafienia >= ILE_CELÓW) {
        const nadmiar = Math.max(0, stan.strzaly - (brama ? 1 : ILE_CELÓW));
        const nagroda = brama
          ? Math.max(12, 30 - nadmiar * 3)
          : Math.max(8, 20 - nadmiar * 2);
        setMonety(nagroda);
        zakonczTimer = window.setTimeout(() => setFaza("koniec"), 1150);
        return;
      }
      window.setTimeout(() => {
        if (!zywe) return;
        stan.celIndex += 1;
        cel.position.copy(CELE[stan.celIndex]);
        cel.lookAt(0, cel.position.y, 0);
        cel.scale.setScalar(1);
        resetDoNaciagu(true);
      }, 1150);
    };

    /**
     * PUDŁO NIE ZATRZYMUJE LOTU. Wcześniej chybiony strzał od razu przełączał
     * tryb na „pudlo", dla którego pętla klatek nie miała żadnej gałęzi —
     * lisek zawisał w powietrzu w połowie łuku, kamera stawała, a po 680 ms
     * scena skakała z powrotem do choinki. Dziecko nie widziało więc TEGO,
     * czego właśnie potrzebuje najbardziej: gdzie jego lot poleciał dalej
     * i jak daleko minął obręcz.
     *
     * Teraz „pudlo" jest normalną fazą lotu: lisek leci dalej swoim pędem,
     * spada, odbija się od murawy i dopiero gdy naprawdę się zatrzyma, gra
     * wraca do naciągu. Powrót prowadzi pętla klatek, nie zegar.
     */
    const pudlo = () => {
      if (stan.tryb === "pudlo") return;
      stan.tryb = "pudlo";
      stan.czasPudla = 0;
      stan.odbicia = 0;
      stan.wSpoczynku = false;
      stan.czasSpoczynku = 0;
      setKomunikat(
        brama && stan.bramaIndex > 0
          ? `Prawie! ${stan.bramaIndex} z ${BRAMY.length} — leć jeszcze raz`
          : "Prawie! Spróbuj jeszcze raz"
      );
      try { fx?.blad?.(); } catch {}
    };

    const pozycjaZdarzenia = (e) => ({ x: e.clientX, y: e.clientY });
    graRef.current.sterowanie = {
      start(e) {
        if (stan.tryb !== "gotowy") return;
        const p = pozycjaZdarzenia(e);
        stan.tryb = "naciag";
        stan.startX = p.x;
        stan.startY = p.y;
        stan.pointerId = e.pointerId;
        setKomunikat("Celuj i puść!");
        canvas.setPointerCapture?.(e.pointerId);
      },
      ruch(e) {
        if (stan.tryb !== "naciag" || (stan.pointerId != null && e.pointerId !== stan.pointerId)) return;
        const p = pozycjaZdarzenia(e);
        stan.naciagX = ogranicz(p.x - stan.startX, -145, 145);
        stan.naciagY = ogranicz(p.y - stan.startY, 0, 180);
        // Pełny naciąg mieści się w krótszym geście, a krzywa potęgowa
        // zachowuje precyzję na początku i dodaje mocy pod koniec ruchu.
        const gest = ogranicz(Math.hypot(stan.naciagX, stan.naciagY) / 132, 0, 1);
        stan.ugiecie = Math.pow(gest, 0.78);
        pokazTor();
      },
      koniec(e) {
        if (stan.tryb !== "naciag" || (stan.pointerId != null && e.pointerId !== stan.pointerId)) return;
        if (stan.ugiecie < 0.14) { resetDoNaciagu(); schowajTor(); return; }
        stan.tryb = "prostowanie";
        stan.czasProstowania = 0;
        stan.predkosc.copy(predkoscZNaciagu());
        stan.strzaly += 1;
        setStrzaly(stan.strzaly);
        setKomunikat("Choinka się prostuje…");
        schowajTor();
        try { fx?.click?.(); } catch {}
      },
      anuluj() {
        if (stan.tryb === "naciag") { resetDoNaciagu(); schowajTor(); }
      },
    };

    const dopasuj = () => {
      const w = Math.max(1, canvas.clientWidth);
      const h = Math.max(1, canvas.clientHeight);
      renderer.setSize(w, h, false);
      const proporcja = w / h;
      const szerokosc = (proporcja < 1 ? 8.4 : 14) / 1.25;
      const wysokosc = szerokosc / proporcja;
      // Kat dobrany tak, by w odleglosci odniesienia kadr byl tej samej
      // wysokosci, co dawny rzut ortograficzny - kompozycja zostaje, dochodzi
      // sama glebia.
      kamera.aspect = proporcja;
      kamera.fov = 2 * Math.atan((wysokosc / 2) / ODLEGLOSC_ODNIESIENIA) * (180 / Math.PI);
      kamera.updateProjectionMatrix();
    };
    dopasuj();
    window.addEventListener("resize", dopasuj);

    const klatka = () => {
      if (!zywe) return;
      const dt = Math.min(0.033, zegar.getDelta());
      const czas = zegar.elapsedTime;

      if (stan.tryb === "podglad") {
        stan.czasPodgladu += dt;
        let udzial;
        if (stan.czasPodgladu < 0.72) {
          const t = stan.czasPodgladu / 0.72;
          udzial = t * t * (3 - 2 * t);
        } else if (stan.czasPodgladu < 1.42) {
          udzial = 1;
        } else {
          const t = ogranicz((stan.czasPodgladu - 1.42) / 0.78, 0, 1);
          udzial = 1 - t * t * (3 - 2 * t);
        }
        tmpKamera.copy(kameraNaciag).lerp(kameraFokus, udzial);
        /* Powrót po chybionym locie zaczyna się TAM, gdzie lisek wylądował —
           bywa to 25 metrów od choinki. Twarde `copy` cięło wtedy obraz jak
           montaż w środku zdania; płynne dojście zachowuje ciągłość sceny,
           a po ułamku sekundy kamera i tak jedzie już dokładnie po
           zaplanowanej ścieżce podglądu. */
        kameraCel.lerp(tmpKamera, 1 - Math.exp(-7 * dt));
        tmpKierunekKamery.copy(KIERUNEK_KAMERY);
        kamera.zoom += (1 - kamera.zoom) * (1 - Math.exp(-8 * dt));
        kamera.updateProjectionMatrix();
        kamera.position.copy(kameraCel).add(tmpKierunekKamery);
        kamera.lookAt(kameraCel);
        ustawChoinke(0, 0);
        choinka.czubek.getWorldPosition(tmpTip);
        lis.position.copy(tmpTip);
        if (stan.czasPodgladu >= 2.2) {
          stan.tryb = "gotowy";
          kameraCel.copy(kameraNaciag);
          setKomunikat("Naciągnij i leć w lewo");
        }
      } else if (stan.tryb === "gotowy") {
        ustawChoinke(Math.sin(czas * 1.7) * 0.025, 0.35);
        choinka.czubek.getWorldPosition(tmpTip);
        lis.position.copy(tmpTip);
        lis.position.y += Math.sin(czas * 3) * 0.035;
        lis.rotation.z = Math.sin(czas * 2) * 0.035;
        prowadzKameraZaNaciagiem(0, dt, czas);
      } else if (stan.tryb === "naciag") {
        const kierunek = stan.naciagX / 145;
        ustawChoinke(stan.ugiecie, kierunek || 0.01);
        choinka.czubek.getWorldPosition(tmpTip);
        lis.position.copy(tmpTip);
        lis.rotation.z = -kierunek * 0.32;
        prowadzKameraZaNaciagiem(stan.ugiecie, dt, czas);
        // Wstega musi sie przebudowac razem z kamera, ktora w naciagu caly
        // czas plynie - liczenie jej tylko przy ruchu palca splaszczaloby ja
        // do kreski, gdy tylko dziecko przestanie ciagnac.
        pokazTor();
      } else if (stan.tryb === "prostowanie") {
        stan.czasProstowania += dt;
        const t = ogranicz(stan.czasProstowania / 0.28, 0, 1);
        const sprężyna = (1 - t) * Math.cos(t * Math.PI * 0.75);
        ustawChoinke(stan.ugiecie * sprężyna, stan.naciagX / 145 || 0.01);
        choinka.czubek.getWorldPosition(tmpTip);
        lis.position.copy(tmpTip);
        prowadzKameraZaNaciagiem(stan.ugiecie * (1 - t * 0.22), dt, czas);
        if (t >= 1) {
          stan.tryb = "lot";
          stan.czasLotu = 0;
          setKomunikat("Lecimy!");
          try { fx?.whoosh?.(); } catch {}
        }
      } else if (stan.tryb === "lot") {
        stan.czasLotu += dt;
        stan.predkosc.y -= 7.3 * dt;
        lis.position.addScaledVector(stan.predkosc, dt);
        lis.rotation.x -= dt * 3.8;
        lis.rotation.z -= dt * 1.7;
        // Kamera lekko podąża za lotem, ale nie gubi ani choinki, ani celu.
        tmpKamera.copy(lis.position).lerp(celTeraz().position, 0.38);
        kameraCel.lerp(tmpKamera, 1 - Math.exp(-2.4 * dt));
        tmpKierunekKamery.lerp(KIERUNEK_KAMERY, 1 - Math.exp(-2.8 * dt));
        // Tor jest o jedna trzecia dluzszy niz wczesniej, wiec kamera musi
        // oddac wiecej pola - inaczej lisek caly lot wisi przy krawedzi.
        kamera.zoom += (0.72 - kamera.zoom) * (1 - Math.exp(-3.4 * dt));
        kamera.updateProjectionMatrix();
        kamera.position.copy(kameraCel).add(tmpKierunekKamery);
        kamera.lookAt(kameraCel);
        utrzymajLiskaWKadrze();
        /* PRZELOT PRZEZ OBRĘCZ, nie trafienie w nią.
           Liczymy, po której stronie płaszczyzny obręczy jest lisek. Gdy w tej
           klatce przeszedł na drugą stronę, wyliczamy PUNKT PRZECIĘCIA (liniowo
           między poprzednią a obecną pozycją) i sprawdzamy, jak daleko od środka
           przeszedł. Bliżej niż promień obręczy — przelot. Dalej — leci sobie
           dalej i spada, tak jak powinien.
           Sprawdzanie samej odległości od środka (jak było) zaliczało też
           przelot OBOK krawędzi i nie odróżniało „przez" od „koło". */
        /* `sprawdzObrecz` zwraca:
             null  — lisek jeszcze nie doszedł do płaszczyzny tej obręczy,
             true  — przeszedł PRZEZ nią,
             false — przeszedł obok (minął płaszczyznę poza pierścieniem).
           Pamięć strony trzymamy osobno dla trybu łatwego i dla bramy, bo na
           bramie sprawdzana obręcz zmienia się w trakcie lotu. */
        const sprawdzObrecz = (obrecz, klucz) => {
          obrecz.getWorldDirection(tmpNormalna);
          const strona = tmpPrzeciecie.copy(lis.position).sub(obrecz.position).dot(tmpNormalna);
          let wynik = null;
          if (stan[klucz] !== null && stan[klucz] > 0 && strona <= 0) {
            const t = stan[klucz] / (stan[klucz] - strona || 1);
            tmpPrzeciecie.copy(stan.poprzedniaPozycja).lerp(lis.position, t).sub(obrecz.position);
            tmpPrzeciecie.addScaledVector(tmpNormalna, -tmpPrzeciecie.dot(tmpNormalna));
            wynik = tmpPrzeciecie.length() <= PROMIEN_OBRECZY;
          }
          stan[klucz] = strona;
          return wynik;
        };

        let przelot = false;
        let chybione = false;
        if (brama) {
          const nastepna = cele[stan.bramaIndex];
          const wynik = nastepna ? sprawdzObrecz(nastepna, "stronaBramy") : null;
          if (wynik === true) {
            nastepna.scale.setScalar(1.3);
            stan.bramaIndex += 1;
            stan.stronaBramy = null;
            setTrafienia(stan.bramaIndex);
            if (stan.bramaIndex >= cele.length) przelot = true;
            else {
              setKomunikat(`Brama ${stan.bramaIndex}! Lecisz dalej…`);
              try { fx?.gentleMagical?.(0.5); } catch {}
            }
          } else if (wynik === false) {
            // Pominięta brama przesądza o próbie od razu — ale nie ucina lotu:
            // lisek leci dalej i ląduje na oczach dziecka, żeby było widać,
            // KTÓRĘDY przeszedł obok bramy.
            chybione = true;
          }
        } else {
          /* Wynik `false` to minięcie płaszczyzny obręczy poza pierścieniem,
             czyli pudło rozpoznane W CHWILI, w której naprawdę zapadło —
             wcześniej czekaliśmy, aż lisek wyleci poza sztywne granice sceny,
             a te leżały bliżej niż najdalszy cel (z = −14 przy obręczy na
             z = −16,9), więc dobry, daleki strzał bywał ucinany przed metą. */
          const wynik = sprawdzObrecz(cel, "stronaObreczy");
          if (wynik === true) przelot = true;
          else if (wynik === false) chybione = true;
        }
        stan.poprzedniaPozycja.copy(lis.position);
        /* Bez `return` — na końcu `klatka` stoi `requestAnimationFrame`,
           więc wyjście stąd zatrzymałoby całą animację gry. */
        if (przelot) trafienie();
        else if (chybione) pudlo();
        /* Strzał za słaby: lisek dotyka murawy, zanim w ogóle doleci do
           płaszczyzny obręczy. To też pudło — a faza „pudlo" odbije go od
           ziemi, zamiast urwać animację. */
        else if (lis.position.y <= POZIOM_LADOWANIA) pudlo();
        /* Bezpiecznik na wypadek toru, który nie przecina niczego (np. strzał
           pionowo w górę przy dziwnym gescie). Hojny, bo normalny lot kończy
           się teraz na obręczy albo na ziemi, a nie na stoperze. */
        else if (stan.czasLotu > 6) pudlo();
      } else if (stan.tryb === "pudlo") {
        /* DALSZY CIĄG LOTU PO PUDLE — najważniejsza klatka nauki w tej grze.
           Lisek nie znika i nie zastyga: leci dalej dokładnie tym pędem, jaki
           dostał od choinki, spada, uderza w murawę i odbija się coraz niżej,
           aż stanie. Dopiero wtedy gra wraca do naciągu. Dziecko widzi więc
           CAŁY tor swojego strzału i samo odczytuje poprawkę: za nisko,
           za krótko, za bardzo w bok. */
        stan.czasPudla += dt;

        if (!stan.wSpoczynku) {
          stan.predkosc.y -= 7.3 * dt;
          lis.position.addScaledVector(stan.predkosc, dt);
          // Koziołkowanie gaśnie razem z prędkością — lisek, który już się
          // toczy po ziemi, nie ma się od czego kręcić w powietrzu.
          const rozped = ogranicz(stan.predkosc.length() / 6, 0, 1);
          lis.rotation.x -= dt * 3.4 * rozped;
          lis.rotation.z -= dt * 1.5 * rozped;

          if (lis.position.y <= POZIOM_LADOWANIA) {
            lis.position.y = POZIOM_LADOWANIA;
            const uderzenie = Math.abs(stan.predkosc.y);
            stan.odbicia += 1;
            /* Dwa odbicia wystarczają, żeby lądowanie miało wagę, a trzecie
               tylko przeciąga powrót do gry. Po nich lisek zostaje na murawie. */
            if (stan.odbicia <= 2 && uderzenie > 1.4) {
              stan.predkosc.y = uderzenie * 0.42;
              stan.predkosc.x *= 0.58;
              stan.predkosc.z *= 0.58;
            } else {
              stan.predkosc.set(0, 0, 0);
              stan.wSpoczynku = true;
              stan.czasSpoczynku = 0;
            }
          }
        } else {
          stan.czasSpoczynku += dt;
          // Lisek prostuje się na łapy — bez tego kończyłby scenę zaryty
          // nosem w ziemi pod przypadkowym kątem.
          const prostowanie = 1 - Math.exp(-9 * dt);
          lis.rotation.x += (0 - lis.rotation.x) * prostowanie;
          lis.rotation.z += (0 - lis.rotation.z) * prostowanie;
        }

        // Kamera leci z liskiem do samego końca i odjeżdża, żeby w kadrze
        // zmieściło się i miejsce upadku, i obręcz, której nie trafił.
        tmpKamera.copy(lis.position).lerp(celTeraz().position, 0.3);
        tmpKamera.y += 0.5;
        kameraCel.lerp(tmpKamera, 1 - Math.exp(-2.6 * dt));
        tmpKierunekKamery.lerp(KIERUNEK_KAMERY, 1 - Math.exp(-2.6 * dt));
        kamera.zoom += (0.7 - kamera.zoom) * (1 - Math.exp(-3 * dt));
        kamera.updateProjectionMatrix();
        kamera.position.copy(kameraCel).add(tmpKierunekKamery);
        kamera.lookAt(kameraCel);
        utrzymajLiskaWKadrze();

        /* Powrót prowadzi sam lot, nie zegar ustawiony w chwili pudła: chwila
           na oddech po wylądowaniu, a bezpiecznik czasowy łapie tor, który z
           jakiegoś powodu nigdy nie dotknął ziemi. */
        if ((stan.wSpoczynku && stan.czasSpoczynku > 0.6) || stan.czasPudla > 5) {
          if (zywe) resetDoNaciagu(true);
        }
      } else if (stan.tryb === "trafienie") {
        stan.czasTrafienia += dt;
        if (stan.czasTrafienia < 0.52) {
          stan.predkoscOdbicia.y -= 3.4 * dt;
          lis.position.addScaledVector(stan.predkoscOdbicia, dt);
          lis.rotation.x += dt * 2.4;
        }
        lis.rotation.y += dt * 7;
        cele.forEach((c) => { c.kolo.rotation.z += dt * 4; });
        // Po wygranej kamera siada na TEJ obręczy, przez którą lisek właśnie
        // przeleciał — na bramie jest to ostatnia z trzech, nie pierwsza.
        kameraCel.lerp(celTeraz().position, 1 - Math.exp(-3 * dt));
        tmpKierunekKamery.lerp(KIERUNEK_KAMERY, 1 - Math.exp(-3 * dt));
        kamera.zoom += (1 - kamera.zoom) * (1 - Math.exp(-3 * dt));
        kamera.updateProjectionMatrix();
        kamera.position.copy(kameraCel).add(tmpKierunekKamery);
        kamera.lookAt(kameraCel);
        utrzymajLiskaWKadrze();
      }

      cele.forEach((c, i) => {
        if (stan.tryb !== "trafienie") c.kolo.rotation.z = Math.sin(czas * 1.8 + i * 0.9) * 0.08;
        c.scale.lerp(JEDNOSTKOWA, dt * 4);
      });
      renderer.render(scena, kamera);
      raf = requestAnimationFrame(klatka);
    };
    resetDoNaciagu(true);
    raf = requestAnimationFrame(klatka);

    return () => {
      zywe = false;
      window.clearTimeout(zakonczTimer);
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", dopasuj);
      graRef.current.sterowanie = null;
      renderer.dispose();
      scena.traverse((o) => {
        if (o.geometry) o.geometry.dispose?.();
        if (o.material) {
          const materialy = Array.isArray(o.material) ? o.material : [o.material];
          materialy.forEach((m) => m.dispose?.());
        }
      });
    };
  }, [faza, brama]);

  const przekaz = (nazwa) => (e) => {
    e.preventDefault();
    graRef.current.sterowanie?.[nazwa]?.(e);
  };

  return (
    <main className={`gra-root choinka-gra${osadzona ? " gra-osadzona" : ""}`} data-testid="gra-lot-liska">
      <div className="gra-pasek choinka-pasek">
        {faza === "gra" ? (
          <span
            className="choinka-wynik"
            aria-label={brama ? `${trafienia} z ${BRAMY.length} bram w tym locie` : `${trafienia} z ${ILE_CELÓW} celów`}
          >
            <b>{trafienia}</b><span>/ {brama ? BRAMY.length : ILE_CELÓW}</span>
          </span>
        ) : null}
        <button type="button" className="gra-x" onClick={wrocDoHuba} aria-label="Zamknij grę">×</button>
      </div>

      {faza === "splash" || faza === "intro" ? (
        <div className="gra-scroll">
          <SplashGry minCzas={950} onKoniec={() => setFaza("intro")}>
            {({ laduje }) => (
              <EkranStartuGry
                ilustracja="/assets/piorka/lis-skok.webp"
                tytul="Lot Liska"
                haslo="Leć wysoko po gwiazdki!"
                wariant="lot"
                laduje={laduje}
                tekstLadowania="Wyznaczam lot…"
                poziomy={poziomyGry(GRA)}
                wybrany={wybranyPoziom}
                onWybor={setWybranyPoziom}
                cta="Lecimy!"
                onGraj={start}
              />
            )}
          </SplashGry>
        </div>
      ) : null}

      {faza === "gra" ? (
        <div className="choinka-scena">
          <canvas
            ref={canvasRef}
            className="choinka-canvas"
            onPointerDown={przekaz("start")}
            onPointerMove={przekaz("ruch")}
            onPointerUp={przekaz("koniec")}
            onPointerCancel={przekaz("anuluj")}
            aria-label="Scena gry. Przeciągnij liska w dół i w bok, potem puść."
          />
          <div className="choinka-komunikat" role="status">{komunikat}</div>
          <div className="choinka-podpowiedz" aria-hidden="true">
            <span className="choinka-palec">☝</span>
            <span>naciągnij · w głąb i w lewo · puść</span>
          </div>
          <span className="choinka-strzaly">Strzały: {strzaly}</span>
        </div>
      ) : null}

      {faza === "koniec" ? (
        <RewardScreen
          eyebrow="LOT LISKA"
          title={brama ? "Przez obie bramy!" : strzaly <= 4 ? "Ale lot!" : "Wszystkie obręcze trafione!"}
          subtitle={
            brama
              ? `Jeden lot, ${BRAMY.length} bramy — i ani razu obok.`
              : "Choinka wystrzeliła liska przez trzy złote cele."
          }
          coins={monety + nagrodaMisji}
          /* Rozbicie wchodzi tylko przy dwóch źródłach nagrody — patrz
             `RewardScreen`. Bez misji zostaje sama liczba za lot. */
          rozbicie={[
            { etykieta: "Za lot", monety },
            { etykieta: "Od Wizkora za misję", monety: nagrodaMisji },
          ]}
          gwiazdki={
            brama
              ? (strzaly <= 2 ? 3 : strzaly <= 5 ? 2 : 1)
              : (strzaly <= 4 ? 3 : strzaly <= 6 ? 2 : 1)
          }
          kafelki={[
            brama
              ? { wartosc: `${BRAMY.length}/${BRAMY.length}`, etykieta: "bramy" }
              : { wartosc: `${ILE_CELÓW}/${ILE_CELÓW}`, etykieta: "cele" },
            { wartosc: strzaly, etykieta: "strzały" },
          ]}
          akcje={[
            { etykieta: "Wracam", onClick: wrocDoHuba },
            { etykieta: "Jeszcze raz", onClick: start, ton: "ghost" },
          ]}
        />
      ) : null}
    </main>
  );
}
