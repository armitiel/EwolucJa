/**
 * WnetrzeDomku — pokój gracza w 3D, oglądany od środka.
 *
 * PO CO. Chatka stała na mapie jako bryła, do której dało się tylko podejść.
 * Teraz jest miejscem, w którym dziecko WIDZI, kim się stało: półka z trofeami
 * rośnie razem z domkniętymi misjami, słoik napełnia się monetami, girlanda
 * dostaje gwiazdkę za gwiazdkę. To samo, co liczy `panels/DomPanel.jsx`, tylko
 * że tu trzeba się rozejrzeć, żeby to zobaczyć — i o to chodzi.
 *
 * KAMERA STOI. Nie ma chodzenia po pokoju: jedna pozycja na środku i
 * rozglądanie się. Dziecko, które dopiero co biegało po polanie, dostaje
 * przeciwieństwo biegania — a my nie musimy rozwiązywać kolizji ze stołem.
 *
 * DWA STEROWANIA, JEDEN MODEL. Przeciąganie palcem i żyroskop zapisują się
 * w te same dwie liczby (`obrot.yaw`, `obrot.pitch`), więc nie ma dwóch
 * osobnych trybów kamery, które mogłyby się rozjechać. Żyroskop działa
 * PRZYROSTOWO: w chwili włączenia zapamiętujemy odczyt czujnika jako zero,
 * więc widok nie skacze, a telefon trzymany bokiem czy na leżąco nie ma
 * znaczenia. Odmowa zgody (iOS pyta) nie jest błędem — zostaje przeciąganie.
 *
 * WSZYSTKO PROCEDURALNE. Ani jednego nowego pliku 3D: podłoga i ściany to
 * tekstury rysowane na `<canvas>`, meble to pudełka i walce. Jedyne wczytywane
 * obrazki to ikony trofeów — te same, które stoją w HUD-zie.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useAppData } from "../contexts/AppData.jsx";
import { bonusMonet } from "../services/monety.js";
import { MISJE, stanMisji } from "../hub/misjeGier.js";
import { stanZadania as stanGwiazdek } from "../hub/zadanieGwiazdek.js";
import DomPanel from "../hub/panels/DomPanel.jsx";
import "../hub/styles/hub.css";
import "../styles/wnetrze.css";

/* Pokój: 4,8 × 4,8 m, 2,6 m w świetle. Wymiary są PRAWDZIWE, bo kamera stoi
   na wysokości dziecka (1,45 m) — pokój „na oko" wychodził albo katedrą,
   albo pudełkiem. */
const BOK = 4.8;
const WYSOKOSC = 2.6;
const OKO = 1.45;

/* Ile monet napełnia słoik do pełna. Nie chodzi o cel do zrealizowania —
   chodzi o to, żeby poziom w słoiku w ogóle był widoczny po pierwszej misji
   (25 monet to już palec wysokości). */
const SLOIK_PELNY = 300;

const ogranicz = (n, min, max) => Math.max(min, Math.min(max, n));

/* ── tekstury rysowane na canvasie ──────────────────────────────────────── */

/** Deski podłogi: ciepłe drewno, ciemniejsze fugi, drobne słoje. */
function teksturaDesek() {
  const c = document.createElement("canvas");
  c.width = c.height = 512;
  const g = c.getContext("2d");
  g.fillStyle = "#a9754a";
  g.fillRect(0, 0, 512, 512);
  let ziarno = 7;
  const los = () => (ziarno = (ziarno * 16807) % 2147483647) / 2147483647;
  const deska = 64;
  for (let y = 0; y < 512; y += deska) {
    g.fillStyle = ["#b07f52", "#a06e45", "#b98a5c", "#9a6942"][Math.floor(los() * 4)];
    g.fillRect(0, y, 512, deska - 2);
    // fuga między deskami
    g.fillStyle = "rgba(72,44,24,.55)";
    g.fillRect(0, y + deska - 2, 512, 2);
    // słoje
    for (let i = 0; i < 14; i++) {
      g.strokeStyle = `rgba(96,60,32,${0.06 + los() * 0.1})`;
      g.lineWidth = 1 + los();
      g.beginPath();
      const yy = y + 6 + los() * (deska - 14);
      g.moveTo(0, yy);
      g.bezierCurveTo(170, yy + (los() - 0.5) * 7, 340, yy + (los() - 0.5) * 7, 512, yy);
      g.stroke();
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(3, 3);
  t.anisotropy = 4;
  return t;
}

/** Ściana z bali: poziome wałki z cieniem pod każdym. */
function teksturaBali() {
  const c = document.createElement("canvas");
  c.width = c.height = 512;
  const g = c.getContext("2d");
  const bal = 74;
  for (let y = 0; y < 512; y += bal) {
    const grad = g.createLinearGradient(0, y, 0, y + bal);
    grad.addColorStop(0, "#c79a68");
    grad.addColorStop(0.42, "#e0b988");
    grad.addColorStop(1, "#a77a4f");
    g.fillStyle = grad;
    g.fillRect(0, y, 512, bal);
    g.fillStyle = "rgba(88,58,32,.4)";
    g.fillRect(0, y + bal - 3, 512, 3);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(2, 1);
  t.anisotropy = 4;
  return t;
}

/* ── drobne klocki, z których zbudowany jest pokój ──────────────────────── */

const mat = (kolor, opcje = {}) =>
  new THREE.MeshStandardMaterial({ color: kolor, roughness: 0.86, metalness: 0, ...opcje });

function pudelko(w, h, d, material, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

export default function WnetrzeDomku({ onWyjscie }) {
  const canvasRef = useRef(null);
  const hostRef = useRef(null);
  const { player } = useAppData();
  const [zyroskop, setZyroskop] = useState("wylaczony"); // wylaczony | wlaczony | brak | odmowa
  const [szczegoly, setSzczegoly] = useState(false);
  const zyroRef = useRef(null);
  /* Uchwyt do rzeczy w scenie, które muszą się zmienić PO jej zbudowaniu.
     Dziś jest tam jedno: poziom w słoiku. */
  const scenaRef = useRef(null);
  /* `onWyjscie` przez ref, a NIE w zależnościach efektu. Gdyby weszło do
     zależności, każda zmiana tożsamości tej funkcji przebudowywałaby cały
     pokój — czyli zrzucała i tworzyła od nowa kontekst WebGL, na oczach
     dziecka i za darmo. */
  const wyjscieRef = useRef(onWyjscie);
  wyjscieRef.current = onWyjscie;

  /* Stan czytamy RAZ, przy wejściu. Pokój jest zdjęciem chwili — nic w nim
     nie może się zmienić, dopóki dziecko w nim stoi, bo nie ma stąd jak
     zdobyć monety ani skończyć misji. Dzięki temu scena buduje się raz
     i nie przebudowuje się przy każdym renderze Reacta. */
  const dane = useMemo(() => {
    const misje = stanMisji();
    const gw = stanGwiazdek();
    return {
      gwiazdki: gw.istnieje ? gw.zebrane : 0,
      /* Trofeum = misja ROZLICZONA — ta sama zasada, co na półce w DomPanel:
         półka mówi „to już zrobiłeś", a nie „to zacząłeś". */
      zdobyte: new Set(misje.filter((m) => m.wyplacona).map((m) => m.id)),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const daneRef = useRef(dane);
  daneRef.current = dane;

  /* Monety stoją OSOBNO, bo jako jedyne mogą dojść po zbudowaniu pokoju:
     `player` przychodzi z sieci i przy wolnym łączu bywa `null` jeszcze
     w chwili montowania. Zamiast przebudowywać całą scenę, gdy się pojawi,
     zmieniamy w niej jedną rzecz — wysokość złota w słoiku. */
  const monety = (player?.coins ?? 0) + bonusMonet();
  const monetyRef = useRef(monety);
  monetyRef.current = monety;
  useEffect(() => {
    scenaRef.current?.ustawMonety?.(monety);
  }, [monety]);

  const wlaczZyroskop = useCallback(async () => {
    const DOE = window.DeviceOrientationEvent;
    if (!DOE) { setZyroskop("brak"); return; }
    try {
      // iOS 13+ wymaga zgody i MUSI o nią poprosić z gestu użytkownika —
      // stąd osobny przycisk, a nie włączanie żyroskopu przy wejściu.
      if (typeof DOE.requestPermission === "function") {
        const odp = await DOE.requestPermission();
        if (odp !== "granted") { setZyroskop("odmowa"); return; }
      }
      zyroRef.current?.wlacz();
      setZyroskop("wlaczony");
    } catch {
      setZyroskop("odmowa");
    }
  }, []);

  const wylaczZyroskop = useCallback(() => {
    zyroRef.current?.wylacz();
    setZyroskop("wylaczony");
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = hostRef.current;
    if (!canvas || !host) return undefined;

    let zywe = true;
    const scena = new THREE.Scene();
    scena.background = new THREE.Color(0x2a1c14);

    const kamera = new THREE.PerspectiveCamera(70, 1, 0.05, 40);
    kamera.position.set(0, OKO, 0.55);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const doSprzatania = [];
    const zapamietaj = (obiekt) => { doSprzatania.push(obiekt); return obiekt; };

    /* ── SKORUPA POKOJU ────────────────────────────────────────────────────
       Jedno pudełko z sześcioma materiałami i `BackSide` zamiast sześciu
       osobnych płaszczyzn: ściany na pewno się schodzą w rogach, a trzeba
       ustawić jedną pozycję zamiast sześciu. */
    const deski = zapamietaj(teksturaDesek());
    const bale = zapamietaj(teksturaBali());
    const T = THREE.BackSide;
    const scianaMat = mat(0xffffff, { map: bale, side: T });
    const skorupa = new THREE.Mesh(
      new THREE.BoxGeometry(BOK, WYSOKOSC, BOK),
      [
        scianaMat,                                              // +x
        scianaMat,                                              // -x
        mat(0x6b4a30, { side: T }),                             // sufit
        mat(0xffffff, { map: deski, side: T }),                 // podłoga
        scianaMat,                                              // +z
        scianaMat,                                              // -z
      ]
    );
    skorupa.position.y = WYSOKOSC / 2;
    skorupa.receiveShadow = true;
    scena.add(skorupa);

    // Belki stropowe — trzy ciemne pasy pod sufitem, żeby góra nie była pustą płytą.
    const drewnoC = mat(0x51371f);
    for (let i = -1; i <= 1; i++) {
      scena.add(pudelko(BOK, 0.16, 0.16, drewnoC, 0, WYSOKOSC - 0.12, i * 1.4));
    }

    /* ── OKNO (ściana +x) ──────────────────────────────────────────────────
       Nie wycinamy dziury w ścianie: „szyba" to jasny, świecący prostokąt
       tuż przed ścianą plus rama. Z wnętrza wygląda identycznie, a kosztuje
       dwa mesh-e zamiast geometrii z otworem. */
    const SCIANA = BOK / 2 - 0.01;
    const szyba = new THREE.Mesh(
      new THREE.PlaneGeometry(1.15, 1.0),
      new THREE.MeshBasicMaterial({ color: 0xfff2c8 })
    );
    szyba.rotation.y = -Math.PI / 2;
    szyba.position.set(SCIANA - 0.02, 1.55, -0.35);
    scena.add(szyba);
    const ramaMat = mat(0x7d5330);
    const rama = new THREE.Group();
    rama.position.set(SCIANA - 0.05, 1.55, -0.35);
    [[0, 0.53, 1.26, 0.09], [0, -0.53, 1.26, 0.09]].forEach(([y0, y1, w, h]) => {
      const b = pudelko(0.07, h, w, ramaMat, 0, y1, 0);
      rama.add(b);
    });
    [[-0.61], [0.61]].forEach(([z]) => rama.add(pudelko(0.07, 1.15, 0.09, ramaMat, 0, 0, z)));
    rama.add(pudelko(0.05, 1.0, 0.05, ramaMat, 0, 0, 0));      // szczeblina pionowa
    rama.add(pudelko(0.05, 0.05, 1.15, ramaMat, 0, 0, 0));      // szczeblina pozioma
    rama.add(pudelko(0.22, 0.07, 1.4, mat(0x8a5c36), 0.09, -0.58, 0)); // parapet
    scena.add(rama);

    /* Snop światła z okna: półprzezroczysty ostrosłup w trybie dodawania.
       Tanie „pyłki w powietrzu" — bez cząsteczek i bez shadera. */
    const snop = new THREE.Mesh(
      new THREE.ConeGeometry(1.15, 3.4, 4, 1, true),
      new THREE.MeshBasicMaterial({
        color: 0xffe9ae, transparent: true, opacity: 0.09,
        blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide,
      })
    );
    snop.rotation.z = Math.PI / 2 - 0.42;
    snop.rotation.y = 0.2;
    snop.position.set(SCIANA - 1.5, 1.1, -0.35);
    scena.add(snop);

    /* ── DRZWI (ściana +z, czyli ZA plecami) ───────────────────────────────
       Wyjście jest tam, gdzie dziecko NIE patrzy po wejściu. To celowe:
       żeby wyjść, trzeba się obrócić, czyli zrobić dokładnie tę jedną rzecz,
       której uczy ten ekran. Krzyżyk w rogu zostaje dla tych, którzy nie chcą. */
    const drzwi = new THREE.Group();
    drzwi.position.set(0.5, 0, BOK / 2 - 0.02);
    const plyta = pudelko(0.95, 1.95, 0.08, mat(0x8b5a2f), 0, 0.975, 0);
    plyta.userData.wyjscie = true;
    drzwi.add(plyta);
    [[-0.32], [0], [0.32]].forEach(([x]) => {
      const d = pudelko(0.26, 1.85, 0.05, mat(0x9c683a), x, 0.975, -0.05);
      d.userData.wyjscie = true;
      drzwi.add(d);
    });
    const klamka = new THREE.Mesh(
      new THREE.SphereGeometry(0.06, 12, 10),
      mat(0xe0b45c, { metalness: 0.45, roughness: 0.35 })
    );
    klamka.position.set(-0.36, 1.0, -0.1);
    klamka.userData.wyjscie = true;
    drzwi.add(klamka);
    scena.add(drzwi);

    /* ── KOMINEK (ściana -x) ───────────────────────────────────────────── */
    const kominek = new THREE.Group();
    kominek.position.set(-BOK / 2 + 0.02, 0, 0.2);
    const kamien = mat(0x8b8073, { roughness: 0.95 });
    kominek.add(pudelko(0.5, 1.5, 1.7, kamien, 0.25, 0.75, 0));
    kominek.add(pudelko(0.55, 0.12, 1.9, mat(0x6f6459), 0.28, 1.5, 0));  // gzyms
    kominek.add(pudelko(0.42, 0.75, 1.0, mat(0x1e1512), 0.32, 0.38, 0)); // palenisko
    const plomienie = [];
    for (let i = 0; i < 4; i++) {
      const p = new THREE.Mesh(
        new THREE.ConeGeometry(0.14 - i * 0.02, 0.42 + i * 0.06, 7),
        new THREE.MeshBasicMaterial({
          color: [0xffb43c, 0xff7a2a, 0xffd66b, 0xff9236][i],
          transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false,
        })
      );
      p.position.set(0.3, 0.22, (i - 1.5) * 0.16);
      p.userData.faza = i * 1.7;
      kominek.add(p);
      plomienie.push(p);
    }
    scena.add(kominek);
    const ogien = new THREE.PointLight(0xff9a3c, 3.2, 6, 2);
    ogien.position.set(-BOK / 2 + 0.5, 0.55, 0.2);
    scena.add(ogien);

    /* ── PÓŁKA Z TROFEAMI (ściana -z, na wprost po wejściu) ────────────────
       Jedno miejsce na KAŻDĄ misję z łańcucha, także tę nieskończoną. Puste
       miejsce jest tu informacją, a nie brakiem: mówi „tu coś jeszcze będzie".
       Stąd kurzowy krążek zamiast pominięcia. */
    const polkaMat = mat(0x8a5c36);
    const polka = pudelko(2.6, 0.09, 0.36, polkaMat, 0, 1.15, -BOK / 2 + 0.2);
    scena.add(polka);
    [[-1.2], [1.2]].forEach(([x]) =>
      scena.add(pudelko(0.1, 0.34, 0.3, polkaMat, x, 0.99, -BOK / 2 + 0.2))
    );

    const wczytywacz = new THREE.TextureLoader();
    const rozstaw = 2.2 / Math.max(1, MISJE.length - 1);
    MISJE.forEach((def, i) => {
      const x = MISJE.length === 1 ? 0 : -1.1 + i * rozstaw;
      const z = -BOK / 2 + 0.2;
      if (daneRef.current.zdobyte.has(def.id)) {
        const tekstura = zapamietaj(wczytywacz.load(def.ikona));
        tekstura.colorSpace = THREE.SRGBColorSpace;
        const zeton = new THREE.Mesh(
          new THREE.PlaneGeometry(0.34, 0.34),
          new THREE.MeshStandardMaterial({
            map: tekstura, transparent: true, alphaTest: 0.4, side: THREE.DoubleSide,
            roughness: 0.9,
            // Emisja z tej samej mapy: trofeum nigdy nie gaśnie w cieniu półki,
            // a jednocześnie dalej reaguje na światło z kominka.
            emissive: 0xffffff, emissiveMap: tekstura, emissiveIntensity: 0.35,
          })
        );
        zeton.position.set(x, 1.38, z + 0.02);
        scena.add(zeton);
        const blask = new THREE.PointLight(0xffd58a, 0.5, 1.1, 2);
        blask.position.set(x, 1.4, z + 0.25);
        scena.add(blask);
      } else {
        const kurz = new THREE.Mesh(
          new THREE.CircleGeometry(0.13, 20),
          new THREE.MeshStandardMaterial({ color: 0x6d5540, roughness: 1 })
        );
        kurz.rotation.x = -Math.PI / 2;
        kurz.position.set(x, 1.202, z);
        scena.add(kurz);
      }
    });

    /* ── SŁOIK MONET (na parapecie) ────────────────────────────────────────
       Poziom = ile monet dziecko ma. Nie liczba do przeczytania, tylko słupek
       do zobaczenia — dokładnie ta różnica, dla której ten pokój powstał. */
    const sloik = new THREE.Group();
    sloik.position.set(SCIANA - 0.22, 1.0, 0.15);
    const szklo = new THREE.Mesh(
      new THREE.CylinderGeometry(0.15, 0.15, 0.34, 20, 1, true),
      new THREE.MeshStandardMaterial({
        color: 0xd8f0ff, transparent: true, opacity: 0.28,
        roughness: 0.1, metalness: 0, side: THREE.DoubleSide,
      })
    );
    szklo.position.y = 0.17;
    sloik.add(szklo);
    /* Złoto ma STAŁĄ geometrię 0,3 m i zmienną skalę w osi Y. Dzięki temu
       poziom da się przestawić jedną liczbą, gdy monety dojdą później —
       bez tworzenia nowej geometrii i bez dotykania reszty pokoju. */
    const zloto = new THREE.Mesh(
      new THREE.CylinderGeometry(0.135, 0.135, 0.3, 18),
      mat(0xf1c43f, { metalness: 0.35, roughness: 0.45, emissive: 0x6a4b06, emissiveIntensity: 0.5 })
    );
    sloik.add(zloto);
    const ustawMonety = (ile) => {
      const t = ogranicz((ile || 0) / SLOIK_PELNY, 0, 1);
      zloto.visible = t > 0.015;
      zloto.scale.y = Math.max(0.02, t);
      zloto.position.y = 0.02 + (0.3 * t) / 2;
    };
    ustawMonety(0);
    scena.add(sloik);

    /* ── GIRLANDA GWIAZDEK (pod sufitem, przy oknie) ───────────────────── */
    const ileGwiazd = ogranicz(daneRef.current.gwiazdki, 0, 12);
    for (let i = 0; i < ileGwiazd; i++) {
      const t = ileGwiazd === 1 ? 0.5 : i / (ileGwiazd - 1);
      const gw = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.075, 0),
        new THREE.MeshStandardMaterial({
          color: 0xffe07a, emissive: 0xffc94a, emissiveIntensity: 0.6, roughness: 0.4,
        })
      );
      gw.position.set(
        -1.6 + t * 3.2,
        WYSOKOSC - 0.35 - Math.sin(t * Math.PI) * 0.22,
        -BOK / 2 + 0.55
      );
      gw.rotation.y = t * 4;
      scena.add(gw);
    }

    /* ── MEBLE ────────────────────────────────────────────────────────── */
    // Łóżko w rogu -x/-z
    const loze = new THREE.Group();
    loze.position.set(-1.45, 0, -1.35);
    loze.rotation.y = 0.18;
    loze.add(pudelko(1.0, 0.28, 1.85, mat(0x7a5130), 0, 0.16, 0));
    loze.add(pudelko(1.02, 0.16, 1.85, mat(0xc7dcc0), 0, 0.36, 0.05));   // koc
    loze.add(pudelko(0.72, 0.14, 0.4, mat(0xfff2d4), 0, 0.44, -0.68));   // poduszka
    loze.add(pudelko(1.05, 0.55, 0.1, mat(0x6b4527), 0, 0.42, -0.93));   // wezgłowie
    scena.add(loze);

    // Stół ze stołkiem w rogu +x/+z
    const stol = new THREE.Group();
    stol.position.set(1.35, 0, 1.15);
    stol.rotation.y = -0.3;
    stol.add(pudelko(1.0, 0.08, 0.72, mat(0xa9754a), 0, 0.72, 0));
    [[-0.42, -0.28], [0.42, -0.28], [-0.42, 0.28], [0.42, 0.28]].forEach(([x, z]) =>
      stol.add(pudelko(0.08, 0.7, 0.08, mat(0x7d5330), x, 0.35, z))
    );
    const kubek = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.11, 12), mat(0xdd7b5a));
    kubek.position.set(0.2, 0.81, 0.05);
    stol.add(kubek);
    scena.add(stol);
    const stolek = new THREE.Group();
    stolek.position.set(0.7, 0, 1.5);
    stolek.add(pudelko(0.36, 0.07, 0.36, mat(0x9c683a), 0, 0.42, 0));
    [[-0.13, -0.13], [0.13, -0.13], [-0.13, 0.13], [0.13, 0.13]].forEach(([x, z]) =>
      stolek.add(pudelko(0.05, 0.4, 0.05, mat(0x7d5330), x, 0.2, z))
    );
    scena.add(stolek);

    // Dywan przed kominkiem
    const dywan = new THREE.Mesh(
      new THREE.CircleGeometry(0.95, 28),
      new THREE.MeshStandardMaterial({ color: 0xb8574a, roughness: 1 })
    );
    dywan.rotation.x = -Math.PI / 2;
    dywan.position.set(-0.9, 0.012, 0.2);
    dywan.receiveShadow = true;
    scena.add(dywan);
    const dywanSrodek = new THREE.Mesh(
      new THREE.CircleGeometry(0.6, 26),
      new THREE.MeshStandardMaterial({ color: 0xd8836c, roughness: 1 })
    );
    dywanSrodek.rotation.x = -Math.PI / 2;
    dywanSrodek.position.set(-0.9, 0.016, 0.2);
    scena.add(dywanSrodek);

    /* ── ŚWIATŁO ─────────────────────────────────────────────────────────
       Trzy źródła i ani jednego więcej: dzień z okna (kierunkowe, rzuca cienie),
       ogień z kominka (punktowe, migocze) i wypełnienie, żeby cienie nie były
       czarnymi dziurami. */
    scena.add(new THREE.HemisphereLight(0xfff0cf, 0x3a2418, 1.15));
    const dzien = new THREE.DirectionalLight(0xffe6ae, 2.2);
    dzien.position.set(BOK, 3.1, -0.6);
    dzien.target.position.set(-1.2, 0.4, 0.4);
    dzien.castShadow = true;
    dzien.shadow.mapSize.set(1024, 1024);
    dzien.shadow.camera.left = -3.2;
    dzien.shadow.camera.right = 3.2;
    dzien.shadow.camera.top = 3.2;
    dzien.shadow.camera.bottom = -3.2;
    dzien.shadow.camera.near = 0.2;
    dzien.shadow.camera.far = 12;
    scena.add(dzien);
    scena.add(dzien.target);

    /* ── ROZGLĄDANIE SIĘ ───────────────────────────────────────────────────
       DWA WKŁADY, JEDEN KĄT. `baza` to obrót wypracowany palcem, `zyro` to
       przechył telefonu liczony od chwili włączenia czujnika. Kąt kamery jest
       ich SUMĄ, więc oba sterowania działają naraz i żadne nie kasuje drugiego:
       dziecko może przeciągnięciem obrócić się do drzwi, a potem rozglądać
       się już samym telefonem. Gdyby żyroskop wpisywał się wprost w kąt
       kamery (a tak było w pierwszej wersji), każdy odczyt czujnika kasowałby
       to, co dziecko przed chwilą przeciągnęło.

       Pochylenie ma twardy ogranicznik: bez niego dziecko „przewraca się"
       przez zenit i pokój staje na głowie. */
    const baza = { yaw: 0, pitch: -0.05 };
    const zyro = { yaw: 0, pitch: 0 };
    const obrot = { yaw: 0, pitch: -0.05 };
    const PITCH_MAX = 0.72;

    let ciagnie = false;
    let ostatni = null;
    let przesuniecie = 0;
    const CZULOSC = 0.0042;

    const naStart = (z) => {
      ciagnie = true;
      przesuniecie = 0;
      ostatni = { x: z.clientX, y: z.clientY };
      canvas.setPointerCapture?.(z.pointerId);
    };
    const naRuch = (z) => {
      if (!ciagnie || !ostatni) return;
      const dx = z.clientX - ostatni.x;
      const dy = z.clientY - ostatni.y;
      ostatni = { x: z.clientX, y: z.clientY };
      przesuniecie += Math.abs(dx) + Math.abs(dy);
      /* Kierunki są takie, jak przy przesuwaniu zdjęcia palcem: ciągniesz
         w prawo — świat jedzie w prawo, czyli patrzysz w lewo. To samo
         w pionie. Odwrotnie („jak w strzelance") dziecko odbiera jako awarię. */
      baza.yaw += dx * CZULOSC;
      baza.pitch = ogranicz(baza.pitch + dy * CZULOSC, -PITCH_MAX, PITCH_MAX);
    };
    const raycaster = new THREE.Raycaster();
    const punkt = new THREE.Vector2();
    const naKoniec = (z) => {
      canvas.releasePointerCapture?.(z.pointerId);
      const bylDrag = przesuniecie > 12;
      ciagnie = false;
      ostatni = null;
      if (bylDrag) return;
      // Dotknięcie BEZ przeciągnięcia = kliknięcie. Sprawdzamy tylko drzwi:
      // reszta pokoju nie ma na co reagować i cichy brak reakcji jest lepszy
      // niż przypadkowe wyjście przy nieudanym obrocie.
      const p = canvas.getBoundingClientRect();
      punkt.x = ((z.clientX - p.left) / p.width) * 2 - 1;
      punkt.y = -((z.clientY - p.top) / p.height) * 2 + 1;
      raycaster.setFromCamera(punkt, kamera);
      const trafienia = raycaster.intersectObjects(drzwi.children, false);
      if (trafienia.length && trafienia[0].object.userData.wyjscie) wyjscieRef.current?.();
    };

    canvas.addEventListener("pointerdown", naStart);
    canvas.addEventListener("pointermove", naRuch);
    canvas.addEventListener("pointerup", naKoniec);
    canvas.addEventListener("pointercancel", () => { ciagnie = false; ostatni = null; });

    /* Żyroskop PRZYROSTOWO: pierwszy odczyt po włączeniu staje się zerem,
       więc widok nie skacze, a to, JAK dziecko trzyma telefon w tej chwili
       (na leżąco, bokiem, pod kątem), przestaje mieć znaczenie. Bezwzględny
       odczyt kompasu wymagałby kalibracji i i tak myliłby się w budynku.

       WZMOCNIENIE 1,6 na obrocie w bok jest świadome, mimo że zniekształca
       odwzorowanie 1:1. Dziecko siedzi i nie obróci się wokół własnej osi —
       przy 1:1 drzwi za plecami byłyby nieosiągalne bez wstawania. Pion
       zostaje 1:1, bo tam pełny zakres mieści się w samym nadgarstku. */
    const WZMOCNIENIE_YAW = 1.6;
    let zero = null;
    let zyroCzynny = false;
    const naOrientacje = (z) => {
      if (!zyroCzynny || z.alpha == null || z.beta == null) return;
      const a = THREE.MathUtils.degToRad(z.alpha);
      const b = THREE.MathUtils.degToRad(z.beta);
      if (!zero) { zero = { a, b }; return; }
      let da = a - zero.a;
      // najkrótsza droga po okręgu — inaczej przejście przez 0°/360°
      // przerzucało widok o pełny obrót
      while (da > Math.PI) da -= Math.PI * 2;
      while (da < -Math.PI) da += Math.PI * 2;
      /* `alpha` rośnie, gdy telefon obraca się w LEWO, a dodatni `yaw` w tej
         kamerze też patrzy w lewo — więc znaki się zgadzają bez odwracania.
         (W pierwszej wersji stało tu `zero.a - a` i telefon obracany w prawo
         obracał widok w lewo.) */
      zyro.yaw = da * WZMOCNIENIE_YAW;
      zyro.pitch = -(b - zero.b);
    };
    zyroRef.current = {
      wlacz() {
        zero = null;
        zyro.yaw = 0;
        zyro.pitch = 0;
        zyroCzynny = true;
        window.addEventListener("deviceorientation", naOrientacje);
      },
      wylacz() {
        zyroCzynny = false;
        window.removeEventListener("deviceorientation", naOrientacje);
        // Wkład czujnika wtapiamy w bazę, żeby wyłączenie żyroskopu nie
        // przerzuciło widoku z powrotem tam, gdzie był przed jego włączeniem.
        baza.yaw += zyro.yaw;
        baza.pitch = ogranicz(baza.pitch + zyro.pitch, -PITCH_MAX, PITCH_MAX);
        zyro.yaw = 0;
        zyro.pitch = 0;
      },
    };

    /* ── pętla ──────────────────────────────────────────────────────────── */
    const zegar = new THREE.Clock();
    const dopasuj = () => {
      const w = Math.max(1, host.clientWidth);
      const h = Math.max(1, host.clientHeight);
      renderer.setSize(w, h, false);
      kamera.aspect = w / h;
      kamera.updateProjectionMatrix();
    };
    dopasuj();
    const obserwator = new ResizeObserver(dopasuj);
    obserwator.observe(host);

    const klatka = () => {
      if (!zywe) return;
      const dt = Math.min(0.05, zegar.getDelta());
      const czas = zegar.getElapsedTime();

      // Wygładzanie: kamera dogania cel, zamiast skakać za palcem. To ta sama
      // sztuczka, co przy kamerze na mapie — bez niej obraz drga na dotyku.
      const k = 1 - Math.exp(-11 * dt);
      const celYaw = baza.yaw + zyro.yaw;
      const celPitch = ogranicz(baza.pitch + zyro.pitch, -PITCH_MAX, PITCH_MAX);
      obrot.yaw += (celYaw - obrot.yaw) * k;
      obrot.pitch += (celPitch - obrot.pitch) * k;
      kamera.rotation.set(0, 0, 0);
      kamera.rotateY(obrot.yaw);
      kamera.rotateX(obrot.pitch);

      for (const p of plomienie) {
        const f = 0.75 + Math.sin(czas * 7 + p.userData.faza) * 0.2 + Math.sin(czas * 13.3 + p.userData.faza) * 0.1;
        p.scale.set(0.85 + f * 0.25, f, 0.85 + f * 0.25);
        p.material.opacity = 0.65 + f * 0.3;
      }
      ogien.intensity = 2.7 + Math.sin(czas * 6.1) * 0.5 + Math.sin(czas * 11.7) * 0.25;

      renderer.render(scena, kamera);
      window.requestAnimationFrame(klatka);
    };
    window.requestAnimationFrame(klatka);
    scenaRef.current = { ustawMonety };
    // Monety mogły już być znane, zanim scena stanęła — ustawiamy poziom od razu.
    ustawMonety(monetyRef.current);

    return () => {
      zywe = false;
      scenaRef.current = null;
      obserwator.disconnect();
      canvas.removeEventListener("pointerdown", naStart);
      canvas.removeEventListener("pointermove", naRuch);
      canvas.removeEventListener("pointerup", naKoniec);
      zyroRef.current?.wylacz();
      zyroRef.current = null;
      // Kontekst WebGL nie zwalnia się sam — a ten ekran żyje NAD sceną mapy,
      // która trzyma własny kontekst. Dwa niesprzątnięte konteksty na telefonie
      // to już czarny ekran przy trzecim wejściu.
      scena.traverse((o) => {
        o.geometry?.dispose?.();
        const m = o.material ? (Array.isArray(o.material) ? o.material : [o.material]) : [];
        for (const mm of m) mm.dispose?.();
      });
      for (const t of doSprzatania) t.dispose?.();
      renderer.dispose();
    };
    // Pusta lista zależności jest tu ŚWIADOMA: pokój buduje się raz na wejście.
    // Wszystko, co może się zmienić później, wchodzi przez `scenaRef`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="wnetrze-root" data-testid="wnetrze-domku">
      <div className="wnetrze-plotno" ref={hostRef}>
        <canvas ref={canvasRef} aria-label="Twój pokój. Przeciągnij palcem, żeby się rozejrzeć." />
      </div>

      <div className="wnetrze-gora">
        <button type="button" className="gra-x" onClick={() => onWyjscie?.()} aria-label="Wyjdź z domku">×</button>
        <span className="wnetrze-tytul">Twój pokój</span>
        <button
          type="button"
          className={`wnetrze-zyro${zyroskop === "wlaczony" ? " jest-wlaczony" : ""}`}
          onClick={zyroskop === "wlaczony" ? wylaczZyroskop : wlaczZyroskop}
          disabled={zyroskop === "brak"}
          aria-pressed={zyroskop === "wlaczony"}
        >
          {zyroskop === "wlaczony" ? "Ruch telefonem ✓" : "Rozglądaj telefonem"}
        </button>
      </div>

      {zyroskop === "odmowa" ? (
        <p className="wnetrze-info">Nie szkodzi — rozglądaj się, przeciągając palcem.</p>
      ) : null}
      {zyroskop === "brak" ? (
        <p className="wnetrze-info">Ten ekran nie ma czujnika ruchu. Przeciągaj palcem.</p>
      ) : null}

      <div className="wnetrze-dol">
        <span className="wnetrze-podpowiedz">Przeciągnij, żeby się rozejrzeć. Drzwi są za tobą.</span>
        <button type="button" className="hub-btn wnetrze-lista" onClick={() => setSzczegoly(true)}>
          Co już mam?
        </button>
      </div>

      {/* Szczegółowa lista to ISTNIEJĄCY `DomPanel` — pokój pokazuje, a panel
          liczy. Dublowanie tych liczb w 3D znaczyłoby dwa miejsca do poprawienia
          przy każdej zmianie zasad. */}
      {szczegoly ? (
        <div className="wnetrze-karta" role="dialog" aria-label="Co już mam">
          <button type="button" className="gra-x wnetrze-karta-x" onClick={() => setSzczegoly(false)} aria-label="Zamknij">×</button>
          <div className="wnetrze-karta-tresc screen-scroll">
            <DomPanel />
          </div>
        </div>
      ) : null}
    </main>
  );
}
