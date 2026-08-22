/**
 * Bieg Liska — matematyczny runner 3D.
 *
 * Lisek biegnie SAM po serpentynie zawieszonej na klifie i nie może z niej
 * zboczyć — droga jest wstęgą nad przepaścią, a jedyny gest gracza to
 * PODSKOK (dotknięcie ekranu albo spacja). Nad drogą wiszą złote tabliczki
 * z liczbami: podskok w dobrą zbiera odpowiedź na zadanie z góry ekranu,
 * przebiegnięcie pod spodem ją omija. Cała trudność siedzi więc w głowie
 * (które to 3+4?) i w rytmie (kiedy skoczyć?), nie w sterowaniu.
 *
 * Decyzje, których nie cofamy bez powodu:
 *
 * 1. JEDEN PRZYCISK. Dziecko 6–12 lat na telefonie nie ma czym celować —
 *    skręcanie zamieniłoby liczenie w zręcznościówkę, w której wygrywa
 *    kciuk, a nie głowa. Brak skrętu to nie brak funkcji, to sedno gry.
 *
 * 2. TRASA JEST ZAMKNIĘTĄ PĘTLĄ. Dzięki temu żadne zadanie nie może
 *    „nie zmieścić się przed końcem drogi" — lisek po prostu biegnie,
 *    aż skończą się pytania, niezależnie od tempa ich rozwiązywania.
 *
 * 3. ZŁA ODPOWIEDŹ NICZEGO NIE ODBIERA. Tabliczka gaśnie na szaro,
 *    a właściwa wciąż czeka dalej na trasie. Kara byłaby karą za odwagę
 *    próbowania — wystarczy, że minięta dobra odpowiedź kończy pytanie.
 *
 * 4. Model to ten sam `/fox.glb`, co w Locie Liska, z klipem biegu
 *    NlaTrack (mapowanie klipów zmierzone w scenie 3D: NlaTrack=run,
 *    NlaTrack.001=walk — UWAGA, odwrotnie niż u chłopca). Podskok nie ma
 *    własnego klipu, więc jest PROCEDURALNY: bieg zwalnia w powietrzu
 *    niemal do zera, ciało zadziera nos w górę przy wybiciu i opada nim
 *    przy lądowaniu, a squash-stretch dogrywa resztę. Wygląda to jak
 *    skok, choć szkielet gra cały czas ten sam bieg.
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
import { maksMonet, poziomIstnieje, poziomyGry } from "../hub/poziomyGier.js";
import { czyDev } from "../services/dev.js";
import { fx, krokiGraj, krokiStop } from "../services/soundFx.js";
import "../hub/styles/hub.css";
import "../styles/bieg-liska.css";

const GRA = "bieg-liska";
const ILE_PYTAN = 5;

/* Fizyka skoku. Wybicie 7.6 przy grawitacji 19 daje wierzchołek ~1.5 m
   i ~0.8 s w powietrzu — tabliczki wiszą na 1.55 m, więc zbiera się je
   W OKOLICY szczytu skoku, ale okno jest szerokie (próg zbierania 0.8 m).
   Dziecko ma trafić w rytm, nie w klatkę. */
const WYBICIE = 7.6;
const GRAWITACJA = 19;
const WYSOKOSC_TABLICZKI = 1.55;
const PROG_ZBIORU = 0.8;

/* ─── Wyrwy w drodze ──────────────────────────────────────────────────────
   Do tej pory podskok służył WYŁĄCZNIE do zbierania liczb — kto nie chciał
   liczyć, mógł po prostu biec i nic mu się nie działo. Wyrwy dokładają drugi
   powód, żeby skakać: dziura w serpentynie, przez którą trzeba przelecieć.

   SZEROKOŚĆ 2.8 m przy prędkości 6.2 m/s i locie ~0.8 s (4.96 m w poziomie)
   zostawia ponad dwa metry zapasu — wybicie w ostatniej chwili jeszcze
   przechodzi, ale przebiegnięcie już nie. Wyrwy stoją co ~34 m, czyli mniej
   więcej co 5 sekund biegu: dość rzadko, żeby liczenie zostało głównym
   zajęciem, a skok pozostał wydarzeniem.

   ŻYCIA, a nie koniec gry od razu: wpadnięcie kosztuje serce i cofa liska
   TUŻ PRZED wyrwę, więc dziecko od razu próbuje ten sam skok jeszcze raz.
   Trzy serca wystarczają na naukę rytmu; po ostatnim partia się kończy i
   liczą się odpowiedzi zebrane do tej pory (monety zostają — patrz `zakonczPytanie`). */
const SZEROKOSC_WYRWY = 2.8;
const ODSTEP_WYRW = 34;
const ZYCIA_START = 3;
const CZAS_SPADANIA = 0.62;   // sekundy lotu w przepaść, zanim lisek wróci
/**
 * ŁASKA KRAWĘDZI („coyote time"). Skok trwa 0.8 s i niesie liska 4.96 m,
 * a wyrwa ma 2.8 m — czyli na wybicie jest realnie ~0.35 s. Dla sześciolatka
 * z palcem nad ekranem to za mało: dziecko widzi dziurę, dotyka pół kroku za
 * późno i spada, choć „wiedziało".
 *
 * Przez te 0.18 s po wbiegnięciu na wyrwę lisek jeszcze NIE spada — dotknięcie
 * w tym oknie ratuje sytuację i wybija go z krawędzi (przeleci resztę dziury
 * z ogromnym zapasem). Ten trik jest standardem w platformówkach właśnie
 * dlatego, że nie ułatwia gry, tylko usuwa karę za rzecz, której gracz nie
 * jest w stanie zobaczyć: różnicę jednej klatki.
 */
const LASKA_KRAWEDZI = 0.18;
/* Ile podskoków dziecko musi zrobić, zanim podpowiedź gestu zniknie.
   Trzy = „umiem to", a nie „przypadkiem dotknąłem". */
const SKOKI_BEZ_PODPOWIEDZI = 3;

const ogranicz = (n, min, max) => Math.max(min, Math.min(max, n));
const losowe = (n) => Math.floor(Math.random() * n);

/* ─── Zadania ─────────────────────────────────────────────────────────────
   easy: dodawanie do 10. hard: dodawanie i odejmowanie do 20.
   Złe odpowiedzi są BLISKO dobrej (±1…3) — odległe zdradzałyby wynik samą
   dziwnością, a pomyłka o jeden to dokładnie ta, którą warto wyłapać. */
function ulozZadanie(poziom) {
  let a, b, znak, wynik;
  if (poziom === "hard" && Math.random() < 0.5) {
    a = 5 + losowe(15);
    b = 1 + losowe(a - 1);
    znak = "−";
    wynik = a - b;
  } else {
    const suma = poziom === "hard" ? 20 : 10;
    wynik = 3 + losowe(suma - 2);
    a = 1 + losowe(wynik - 1);
    b = wynik - a;
    znak = "+";
  }
  const zle = new Set();
  while (zle.size < 2) {
    const kandydat = wynik + (losowe(2) ? 1 : -1) * (1 + losowe(3));
    if (kandydat >= 0 && kandydat !== wynik) zle.add(kandydat);
  }
  return { tekst: `${a} ${znak} ${b} = ?`, wynik, liczby: [wynik, ...zle] };
}

function ulozZadania(poziom) {
  const lista = [];
  const widzianeTeksty = new Set();
  while (lista.length < ILE_PYTAN) {
    const z = ulozZadanie(poziom);
    if (widzianeTeksty.has(z.tekst)) continue;   // dwa razy to samo nudzi
    widzianeTeksty.add(z.tekst);
    lista.push(z);
  }
  return lista;
}

/* ─── Tabliczka z liczbą ──────────────────────────────────────────────────
   Sprite z płótna zamiast geometrii z tekstem: zawsze zwrócona do kamery,
   więc liczba jest czytelna na każdym zakręcie serpentyny. */
function stworzTabliczke(liczba) {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const x = c.getContext("2d");
  const g = x.createRadialGradient(128, 100, 20, 128, 128, 124);
  g.addColorStop(0, "#ffe9a8");
  g.addColorStop(0.75, "#f4c14f");
  g.addColorStop(1, "#c8862a");
  x.beginPath();
  x.arc(128, 128, 114, 0, 7);
  x.fillStyle = g;
  x.fill();
  x.lineWidth = 14;
  x.strokeStyle = "#fff3cf";
  x.stroke();
  x.fillStyle = "#5c3a12";
  x.font = "900 118px 'Baloo 2','Segoe UI',sans-serif";
  x.textAlign = "center";
  x.textBaseline = "middle";
  x.fillText(String(liczba), 128, 140);
  const tekstura = new THREE.CanvasTexture(c);
  tekstura.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: tekstura, transparent: true, depthTest: true })
  );
  sprite.scale.set(1.25, 1.25, 1);
  return sprite;
}

/* Zastępczy lisek na czas ładowania GLB i na tryb offline — te same obłe
   bryły, co w Locie Liska, tylko ustawione „do biegu". */
function stworzLiskaZastepczego() {
  const lis = new THREE.Group();
  const pomarancz = new THREE.MeshStandardMaterial({ color: 0xf28b22, roughness: 0.72 });
  const krem = new THREE.MeshStandardMaterial({ color: 0xffe2aa, roughness: 0.8 });
  const tulow = new THREE.Mesh(new THREE.SphereGeometry(0.34, 18, 14), pomarancz);
  tulow.scale.set(0.8, 0.9, 1.25);
  tulow.position.y = 0.45;
  lis.add(tulow);
  const glowa = new THREE.Mesh(new THREE.SphereGeometry(0.26, 18, 14), pomarancz);
  glowa.position.set(0, 0.78, 0.3);
  lis.add(glowa);
  [-1, 1].forEach((strona) => {
    const ucho = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.28, 10), pomarancz);
    ucho.position.set(strona * 0.14, 1.02, 0.26);
    lis.add(ucho);
  });
  const ogon = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.6, 12), krem);
  ogon.position.set(0, 0.5, -0.5);
  ogon.rotation.x = 1.2;
  lis.add(ogon);
  lis.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  return lis;
}

export default function BiegLiskaGame({ osadzona = false, poziom = null, onWyjscie }) {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const skokRef = useRef(null);            // uchwyt pętli 3D dla przycisków React
  const wyplaconoRef = useRef(false);
  const zPominieciemIntro = poziomIstnieje(GRA, poziom);
  const [diff, setDiff] = useState(zPominieciemIntro ? poziom : "easy");
  const [faza, setFaza] = useState(zPominieciemIntro ? "gra" : "splash");
  const [pytanie, setPytanie] = useState(null);          // { tekst, nr }
  const [dobrze, setDobrze] = useState(0);
  const [monety, setMonety] = useState(0);
  const [reakcja, setReakcja] = useState(null);          // { ton, tekst }
  const [zycia, setZycia] = useState(ZYCIA_START);       // serca — wyrwy w drodze
  /* Ile razy dziecko już podskoczyło w tej partii. Po `SKOKI_BEZ_PODPOWIEDZI`
     podpowiedź gestu znika — dalej tylko zasłania drogę. */
  const [skokow, setSkokow] = useState(0);
  // Nagroda Wizkora za domkniętą misję. Ekran wyniku pisze o niej tylko wtedy,
  // gdy naprawdę była — patrz `misjeGier.rozliczPartie`.
  const [nagrodaMisji, setNagrodaMisji] = useState(0);
  /**
   * Scena 3D nie wstała albo padła w trakcie. Osobny stan, a nie faza:
   * może się zdarzyć w KAŻDEJ fazie i musi przykryć wszystko, bo pod spodem
   * zostaje martwe płótno.
   */
  const [bladSceny, setBladSceny] = useState(null);

  const wrocDoHuba = useCallback(() => {
    if (onWyjscie) onWyjscie();
    else navigate("/swiat?panel=gry");
  }, [navigate, onWyjscie]);

  const start = useCallback(() => {
    setPytanie(null);
    setDobrze(0);
    setMonety(0);
    setReakcja(null);
    setZycia(ZYCIA_START);
    setSkokow(0);
    setNagrodaMisji(0);
    wyplaconoRef.current = false;
    setFaza("gra");
  }, []);

  /* Wypłata przy wejściu na ekran końcowy — raz, niezależnie od tego,
     ile razy dziecko obejrzy ekran nagrody.

     MISJA WIZKORA ZAMYKA SIĘ TUTAJ. Wcześniej ta gra dopisywała tylko własne
     monety, więc partia kończyła się, a `wygrana` w łańcuchu misji zostawała
     na `false`: kafelek w HUD wisiał na „0/1" po przejściu trasy, nagrody od
     Wizkora nie było, a bezpiecznik w hubie (`misjaDoZaplaty`) nie miał czego
     złapać, bo szuka misji WYGRANEJ. To samo robi `MemoryGame` i `ChoinkaLaunchGame`
     — ta gra po prostu powstała, zanim łańcuch dostał swoją czwartą misję.

     Gdy misji nie ma albo bucik nie został znaleziony na mapie, `rozliczPartie`
     zwraca `dodane: 0` i ekran wyniku po prostu nie pisze o Wizkorze. */
  useEffect(() => {
    if (faza !== "koniec" || wyplaconoRef.current) return;
    wyplaconoRef.current = true;
    if (monety > 0) dodajMonety(monety, "minigra:bieg-liska");
    try {
      const { dodane } = rozliczPartie(GRA);
      setNagrodaMisji(dodane || 0);
    } catch { setNagrodaMisji(0); }
  }, [faza, monety]);

  /* Uchwyt dla pulpitu testowego (`hub/DevRezyserka.jsx`, przycisk „Wygraj
     otwartą grę"). Rejestrujemy go TYLKO w trybie dev — na ekranie dziecka nie
     ma prawa istnieć przycisk kończący grę za nie. Kończymy tak, jak kończy
     dziecko: komplet odpowiedzi i pełna stawka, więc partia z pulpitu przechodzi
     tą samą drogą co prawdziwa (wypłata, domknięcie misji, ekran nagrody). */
  useEffect(() => {
    if (!czyDev()) return undefined;
    window.__devGra = {
      id: GRA,
      wygraj: () => {
        setDobrze(ILE_PYTAN);
        setMonety(maksMonet(GRA, diff));
        setFaza("koniec");
      },
    };
    return () => { if (window.__devGra?.id === GRA) delete window.__devGra; };
  }, [diff]);

  /* ─── Cała scena 3D żyje w jednym efekcie na czas fazy „gra" ─────────── */
  useEffect(() => {
    if (faza !== "gra") return undefined;
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    let zywe = true;
    const scena = new THREE.Scene();
    scena.background = new THREE.Color(0x8ecbee);
    scena.fog = new THREE.Fog(0x8ecbee, 14, 46);

    const kamera = new THREE.PerspectiveCamera(58, 1, 0.1, 200);
    /**
     * `alpha: true` NIE jest kosmetyką — to jest zawór bezpieczeństwa.
     *
     * Bez niego płótno WebGL jest NIEPRZEZROCZYSTE i dopóki nie pójdzie
     * pierwsza klatka, świeci czystą czernią (0,0,0). Gra leży nad hubem
     * z `z-index: 70`, więc czerń zakrywa HUD, dok i mapę — dziecko dostaje
     * pełnoekranową czarną planszę bez wyjścia. Dokładnie to zgłosił gracz.
     * Z przezroczystością spod spodu widać tło `.gra-root` i pasek z krzyżykiem,
     * więc najgorszy przypadek to brzydki ekran, z którego DA SIĘ wyjść.
     * `ChoinkaLaunchGame` miał to od początku — tutaj zabrakło.
     *
     * Samo `new WebGLRenderer` potrafi RZUCIĆ: hub trzyma własny kontekst
     * WebGL żywy (scena tylko pauzuje), więc gra otwiera drugi, a na telefonie
     * po kilku grach sterownik potrafi odmówić. Wcześniej ten wyjątek przerywał
     * efekt w połowie i zostawiał puste płótno bez śladu w interfejsie.
     */
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch (e) {
      console.error("[bieg-liska] nie udało się utworzyć kontekstu WebGL", e);
      setBladSceny("start");
      return undefined;
    }
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    /* Kontekst potrafi zniknąć w trakcie — telefon odbiera pamięć GPU przy
       przełączeniu apki albo przy drugiej grze 3D. Bez `preventDefault`
       przeglądarka nawet nie próbuje go przywrócić, a my i tak zdejmujemy
       dziecko z martwego płótna na ekran z przyciskiem. */
    const naUtracieKontekstu = (e) => {
      e.preventDefault();
      console.warn("[bieg-liska] utracony kontekst WebGL");
      setBladSceny("utracony");
    };
    canvas.addEventListener("webglcontextlost", naUtracieKontekstu);

    const dopasuj = () => {
      const w = canvas.clientWidth || 1;
      const h = canvas.clientHeight || 1;
      renderer.setSize(w, h, false);
      kamera.aspect = w / h;
      kamera.updateProjectionMatrix();
    };
    dopasuj();
    window.addEventListener("resize", dopasuj);

    scena.add(new THREE.HemisphereLight(0xfff4c7, 0x3d6e50, 2.0));
    const slonce = new THREE.DirectionalLight(0xffdf91, 2.6);
    slonce.position.set(-14, 22, 10);
    slonce.castShadow = true;
    slonce.shadow.mapSize.set(2048, 2048);
    slonce.shadow.camera.left = -40;
    slonce.shadow.camera.right = 40;
    slonce.shadow.camera.top = 40;
    slonce.shadow.camera.bottom = -40;
    scena.add(slonce);

    /* Serpentyna: zamknięta pętla o promieniu falującym potrójną sinusoidą —
       zakręty w obie strony i łagodne wzniesienia, bez dwóch takich samych
       łuków obok siebie. */
    const pkt = [];
    const N = 16;
    for (let i = 0; i < N; i++) {
      const a = (i / N) * Math.PI * 2;
      const r = 26 + Math.sin(a * 3) * 7;
      pkt.push(new THREE.Vector3(Math.cos(a) * r, Math.sin(a * 2) * 1.4, Math.sin(a) * r));
    }
    const krzywa = new THREE.CatmullRomCurve3(pkt, true, "catmullrom", 0.6);
    const DLUGOSC = krzywa.getLength();
    const up = new THREE.Vector3(0, 1, 0);

    /* ─── Rozkład wyrw ────────────────────────────────────────────────────
       Wyrwy są STAŁE na czas partii (wchodzą w geometrię drogi), losujemy je
       raz, przy budowie sceny. Pierwsza dopiero od 30 m, żeby dziecko zdążyło
       ruszyć i przeczytać podpowiedź o podskoku, zanim pojawi się dziura.
       Zapas na końcu (`DLUGOSC - 8`) chroni przed wyrwą sklejoną z pierwszą
       przez zawinięcie pętli — dwie dziury tuż obok siebie to nie zadanie,
       tylko pułapka. */
    const WYRWY = [];
    {
      const ile = Math.max(3, Math.round(DLUGOSC / ODSTEP_WYRW));
      const odstep = DLUGOSC / ile;
      for (let i = 0; i < ile; i++) {
        const srodek = 30 + i * odstep + (Math.random() - 0.5) * odstep * 0.3;
        const od = srodek - SZEROKOSC_WYRWY / 2;
        const doK = srodek + SZEROKOSC_WYRWY / 2;
        if (doK > DLUGOSC - 8) continue;
        WYRWY.push({ od, do: doK, srodek });
      }
    }
    /* Czy dany punkt trasy leży NAD przepaścią. Używa tego i budowa drogi
       (pomija kwadraty), i pętla klatek (sprawdza, czy lisek ma pod sobą grunt). */
    const wWyrwie = (d) => {
      const x = ((d % DLUGOSC) + DLUGOSC) % DLUGOSC;
      return WYRWY.find((w) => x > w.od && x < w.do) || null;
    };

    /* Wstęga drogi + dwie ściany klifu w dół. Droga NIE ma barierek —
       z trasy i tak nie da się zejść, więc barierka kłamałaby, że próbowano. */
    {
      const SEG = 560, SZER = 2.4, GLEBIA = 9;
      const gora = [], lewa = [], prawa = [];
      for (let i = 0; i <= SEG; i++) {
        const u = i / SEG;
        const p = krzywa.getPointAt(u);
        const t = krzywa.getTangentAt(u);
        const bok = new THREE.Vector3().crossVectors(t, up).normalize();
        const L = p.clone().addScaledVector(bok, -SZER / 2);
        const R = p.clone().addScaledVector(bok, SZER / 2);
        gora.push(L.x, L.y, L.z, R.x, R.y, R.z);
        const Ld = L.clone(); Ld.y -= GLEBIA; Ld.addScaledVector(bok, 0.9);
        const Rd = R.clone(); Rd.y -= GLEBIA; Rd.addScaledVector(bok, -0.9);
        lewa.push(L.x, L.y, L.z, Ld.x, Ld.y, Ld.z);
        prawa.push(R.x, R.y, R.z, Rd.x, Rd.y, Rd.z);
      }
      /* WYRWA = POMINIĘTY KWADRAT SIATKI, a nie osobny obiekt „dziura".
         Wierzchołki zostają na miejscu (dzięki temu wszystkie trzy powierzchnie
         mają wspólny indeks), po prostu nie łączymy ich w trójkąty tam, gdzie
         ma być przepaść. Efekt: przez otwór widać niebo i skałki pod drogą,
         a ściany klifu urywają się razem z nawierzchnią — bez tego dziura
         wyglądałaby jak dziurka w dywanie zawieszonym w powietrzu. */
      const idx = [];
      for (let i = 0; i < SEG; i++) {
        const dSeg = ((i + 0.5) / SEG) * DLUGOSC;
        if (wWyrwie(dSeg)) continue;
        const a = i * 2;
        idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
      }
      const mk = (pos, mat) => {
        const g = new THREE.BufferGeometry();
        g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
        g.setIndex(idx);
        g.computeVertexNormals();
        const m = new THREE.Mesh(g, mat);
        m.receiveShadow = true;
        return m;
      };
      scena.add(mk(gora, new THREE.MeshStandardMaterial({ color: 0xd9c08a, roughness: 0.95 })));
      const skala = new THREE.MeshStandardMaterial({ color: 0xa07c52, roughness: 1, side: THREE.DoubleSide });
      scena.add(mk(lewa, skala), mk(prawa, skala));

      // Gliniane kamyczki wzdłuż krawędzi — mówią „to jest brzeg" bez barierki.
      const ile = Math.floor(DLUGOSC / 2.4);
      const inst = new THREE.InstancedMesh(
        new THREE.SphereGeometry(0.16, 8, 6),
        new THREE.MeshStandardMaterial({ color: 0xb08a4f, roughness: 0.9 }),
        ile * 2
      );
      const m4 = new THREE.Matrix4();
      let k = 0;
      for (let i = 0; i < ile; i++) {
        const u = i / ile;
        // Nad wyrwą nie ma na czym położyć kamyczka - i dobrze: przerwa w
        // rzedzie kamieni jest pierwszym sygnałem „uwaga, dziura", widocznym
        // wcześniej niż sam otwór, bo kamienie są wyżej niż nawierzchnia.
        if (wWyrwie(u * DLUGOSC)) continue;
        const p = krzywa.getPointAt(u);
        const t = krzywa.getTangentAt(u);
        const bok = new THREE.Vector3().crossVectors(t, up).normalize();
        [-1, 1].forEach((strona) => {
          const poz = p.clone().addScaledVector(bok, strona * 1.16);
          poz.y += 0.07;
          const s = 0.8 + ((i * 7 + strona) % 5) * 0.11;
          m4.makeScale(s, s * 0.75, s);
          m4.setPosition(poz);
          inst.setMatrixAt(k++, m4);
        });
      }
      /* Pominięte kamyczki (te nad wyrwami) zostawiłyby w buforze macierze
         jednostkowe, czyli kulki zwalone na kupę w środku świata. Przycinamy
         licznik do faktycznie wypełnionych instancji. */
      inst.count = k;
      inst.castShadow = true;
      scena.add(inst);

      /* Słupki ostrzegawcze po obu stronach każdej wyrwy. Sama dziura na
         zakręcie serpentyny bywa widoczna dopiero z 5 m — czyli za późno na
         wybicie. Dwa ciepłoczerwone paliki widać zza łuku i mówią „tu się
         urywa" zanim jeszcze widać, że się urywa. Kolor jest ten sam, co
         krzyżyk zamykania w grze: czerwień znaczy w tej grze „stop". */
      if (WYRWY.length) {
        const drewno = new THREE.MeshStandardMaterial({ color: 0xc2432f, roughness: 0.75 });
        const slupki = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.09, 0.11, 0.62, 7), drewno, WYRWY.length * 4);
        const mm = new THREE.Matrix4();
        let s = 0;
        WYRWY.forEach((w) => {
          [w.od - 0.45, w.do + 0.45].forEach((d) => {
            const p = krzywa.getPointAt((((d % DLUGOSC) + DLUGOSC) % DLUGOSC) / DLUGOSC);
            const t = krzywa.getTangentAt((((d % DLUGOSC) + DLUGOSC) % DLUGOSC) / DLUGOSC);
            const bok = new THREE.Vector3().crossVectors(t, up).normalize();
            [-1, 1].forEach((strona) => {
              const poz = p.clone().addScaledVector(bok, strona * 1.02);
              poz.y += 0.31;
              mm.identity();
              mm.setPosition(poz);
              slupki.setMatrixAt(s++, mm);
            });
          });
        });
        slupki.count = s;
        slupki.castShadow = true;
        scena.add(slupki);
      }
    }

    // Chmury nad horyzontem i pod drogą + skałki w przepaści budują wysokość.
    for (let i = 0; i < 14; i++) {
      const s = new THREE.Sprite(new THREE.SpriteMaterial({ color: 0xffffff, opacity: 0.85, transparent: true }));
      const a = Math.random() * Math.PI * 2;
      const r = 20 + Math.random() * 34;
      s.position.set(Math.cos(a) * r, i % 3 === 0 ? 4 + Math.random() * 5 : -3 - Math.random() * 9, Math.sin(a) * r);
      s.scale.set(6 + Math.random() * 5, 2.2 + Math.random() * 1.6, 1);
      scena.add(s);
    }
    {
      const skalka = new THREE.MeshStandardMaterial({ color: 0x7a5c3e, roughness: 1 });
      for (let i = 0; i < 10; i++) {
        const m = new THREE.Mesh(new THREE.DodecahedronGeometry(1.2 + Math.random() * 1.6, 0), skalka);
        const a = Math.random() * Math.PI * 2;
        const r = 14 + Math.random() * 30;
        m.position.set(Math.cos(a) * r, -8 - Math.random() * 6, Math.sin(a) * r);
        m.scale.y = 0.7;
        scena.add(m);
      }
    }

    /* Lisek: `lis` niesie pozycję i kierunek na krzywej, `cialo` — pochylenie
       i squash skoku. Rozdzielone, żeby skok nie walczył z orientacją. */
    const lis = new THREE.Group();
    const cialo = new THREE.Group();
    lis.add(cialo);
    scena.add(lis);
    const zastepczy = stworzLiskaZastepczego();
    cialo.add(zastepczy);

    let mixer = null;
    let biegAkcja = null;
    /* Zastępczy lisek stoi już na torze, więc brak modelu NIE zatrzymuje gry —
       ale ma zostawić ślad w konsoli, a nie zniknąć po cichu. */
    new GLTFLoader().load(
      "/fox.glb",
      (gltf) => {
        if (!zywe) return;
        const m = gltf.scene;
        const box = new THREE.Box3().setFromObject(m);
        const roz = box.getSize(new THREE.Vector3());
        const s = 1.7 / Math.max(roz.x, roz.y, roz.z, 0.01);
        m.scale.setScalar(s);
        box.setFromObject(m);
        const srodek = box.getCenter(new THREE.Vector3());
        m.position.sub(srodek);
        m.position.y += (roz.y * s) / 2;
        // BEZ obrotu wokół Y: +Z modelu to przód liska, a grupę `lis`
        // orientujemy tak, że +Z patrzy w kierunku biegu. Dodanie tu PI
        // odwraca liska pyszczkiem do kamery — sprawdzone na prototypie.
        m.traverse((o) => { if (o.isMesh) o.castShadow = true; });
        cialo.remove(zastepczy);
        cialo.add(m);
        mixer = new THREE.AnimationMixer(m);
        // NlaTrack = BIEG (mapowanie klipów lisa odwrotne niż u chłopca).
        const klip = gltf.animations.find((k) => k.name === "NlaTrack") || gltf.animations[0];
        if (klip) {
          biegAkcja = mixer.clipAction(klip);
          biegAkcja.play();
          biegAkcja.timeScale = 1.15;
        }
      },
      undefined,
      (e) => {
        /* Zastępczy lisek zostaje — gra działa offline. Ale zostawiamy ślad:
           cicha porażka wczytania modelu wyglądała w zgłoszeniach tak samo
           jak martwa scena, a to dwie różne awarie. */
        console.warn("[bieg-liska] nie wczytano /fox.glb — gram na zastępczym lisku", e);
      }
    );

    /* ─── Stan biegu i zadań (poza Reactem — to jest pętla klatek) ──────── */
    const zadania = ulozZadania(diff);
    const stawka = Math.floor(maksMonet(GRA, diff) / ILE_PYTAN) || 4;
    const stan = {
      d: 0, v: 6.2, y: 0, vy: 0, wSkoku: false,
      nrPytania: 0, aktywne: null, nastepneOd: 14,
      dobrze: 0, meta: null, squash: 0,
      // wyrwy: ile serc zostało, czy lecimy w przepaść i ile jeszcze trwa
      // łaska krawędzi nad wyrwą, na którą właśnie wbiegliśmy
      zycia: ZYCIA_START, spadanie: 0, powrotNa: 0, laska: 0, laskaWyrwa: null,
    };

    const tabliczki = [];      // aktywne sprite'y odpowiedzi
    const iskry = [];          // cząstki po zebraniu

    const zakonczPytanie = (sukces, wynik) => {
      const z = stan.aktywne;
      if (!z) return;
      stan.aktywne = null;
      stan.nastepneOd = stan.d + 10;
      tabliczki.forEach((t) => { t.userData.znika = true; });
      if (sukces) {
        stan.dobrze += 1;
        setDobrze(stan.dobrze);
        setMonety(stan.dobrze * stawka);
        setReakcja({ ton: "dobrze", tekst: `Brawo! ${z.tekst.replace("?", String(wynik))}` });
        try { fx?.dopamine?.(); } catch {}
      } else {
        setReakcja({ ton: "mimo", tekst: `Uciekła! ${z.tekst.replace("?", String(wynik))}` });
      }
      if (stan.nrPytania >= ILE_PYTAN) {
        // Meta: jeszcze chwila biegu na wybrzmienie reakcji, potem wynik.
        stan.meta = stan.d + 16;
      }
    };

    const aktywujPytanie = () => {
      const z = zadania[stan.nrPytania];
      stan.nrPytania += 1;
      stan.aktywne = z;
      setPytanie({ tekst: z.tekst, nr: stan.nrPytania });
      setReakcja(null);
      // Trzy tabliczki w wylosowanej kolejności, co 7 m, pierwsza 14 m przed
      // liskiem — na przeczytanie zadania ZANIM trzeba decydować o skoku.
      const kolejnosc = [...z.liczby].sort(() => Math.random() - 0.5);
      kolejnosc.forEach((liczba, i) => {
        const sprite = stworzTabliczke(liczba);
        const dm = (stan.d + 14 + i * 7) % DLUGOSC;
        const p = krzywa.getPointAt(dm / DLUGOSC);
        sprite.position.copy(p);
        sprite.position.y += WYSOKOSC_TABLICZKI;
        sprite.userData = { d: dm, liczba, dobra: liczba === z.wynik, zebrana: false, znika: false, skala: 1.25 };
        scena.add(sprite);
        tabliczki.push(sprite);
      });
    };

    const rozsypIskry = (pozycja) => {
      for (let i = 0; i < 10; i++) {
        const s = new THREE.Sprite(new THREE.SpriteMaterial({ color: 0xffe08a, transparent: true, opacity: 1 }));
        s.position.copy(pozycja);
        s.scale.setScalar(0.16 + Math.random() * 0.12);
        s.userData = {
          v: new THREE.Vector3((Math.random() - 0.5) * 4, 2 + Math.random() * 3, (Math.random() - 0.5) * 4),
          zycie: 0.7,
        };
        scena.add(s);
        iskry.push(s);
      }
    };

    /* Wpadnięcie w wyrwę. Nie kończy partii od razu: zabiera serce, przez
       chwilę pokazuje lot w przepaść (czytelna informacja zwrotna — dziecko
       widzi, ŻE spadło, a nie tylko że coś mrugnęło), po czym stawia liska
       6 m przed tą samą wyrwą, żeby od razu spróbować jeszcze raz.
       Pytanie w toku zostaje nietknięte — wyrwa karze za rytm, nie za liczenie. */
    const wpadnij = (wyrwa) => {
      if (stan.spadanie > 0) return;
      stan.spadanie = CZAS_SPADANIA;
      stan.wSkoku = false;
      stan.vy = 0;
      stan.laska = 0;
      stan.laskaWyrwa = null;
      stan.powrotNa = (((wyrwa.od - 6) % DLUGOSC) + DLUGOSC) % DLUGOSC;
      stan.zycia -= 1;
      setZycia(stan.zycia);
      setReakcja({ ton: "zle", tekst: stan.zycia > 0 ? "Ups! Wyrwa w drodze…" : "Ostatnie serce…" });
      if (biegAkcja) biegAkcja.timeScale = 0.35;
      try { krokiStop(); } catch {}
    };

    const skok = () => {
      if (stan.wSkoku || stan.meta !== null || stan.spadanie > 0) return;
      stan.wSkoku = true;
      stan.vy = WYBICIE;
      // Wybicie z krawędzi w oknie łaski: dług wobec grawitacji umorzony.
      stan.laska = 0;
      stan.laskaWyrwa = null;
      setSkokow((n) => n + 1);
      if (biegAkcja) biegAkcja.timeScale = 0.12;   // nogi „zamierają" w locie
      try { krokiStop(); } catch {}
    };
    skokRef.current = skok;
    const naKlawisz = (e) => {
      if (e.code === "Space" || e.code === "ArrowUp") { e.preventDefault(); skok(); }
    };
    window.addEventListener("keydown", naKlawisz);
    try { krokiGraj({ bieg: true }); } catch {}

    /* Odległość wzdłuż pętli z uwzględnieniem zawinięcia: wynik w (-L/2, L/2]. */
    const wzdluz = (od, doPunktu) => {
      let r = (doPunktu - od) % DLUGOSC;
      if (r > DLUGOSC / 2) r -= DLUGOSC;
      if (r < -DLUGOSC / 2) r += DLUGOSC;
      return r;
    };

    const tmpM = new THREE.Matrix4();
    const tmpQ = new THREE.Quaternion();
    const zegar = new THREE.Clock();
    let raf = 0;

    const klatka = () => {
      if (!zywe) return;
      const dt = Math.min(zegar.getDelta(), 0.05);
      const teraz = performance.now();

      /* ─── Lot w przepaść ───────────────────────────────────────────────
         Podczas spadania trasa stoi: lisek nie posuwa się naprzód, tylko leci
         w dół. Wychodzimy z klatki wcześnie, żeby żadna inna zasada (zadania,
         tabliczki, meta) nie zadziałała, kiedy liska formalnie nie ma na drodze. */
      if (stan.spadanie > 0) {
        stan.spadanie -= dt;
        stan.y -= 16 * dt * (1 + (CZAS_SPADANIA - stan.spadanie) * 1.6);
        cialo.rotation.x = -0.5;
        if (stan.spadanie <= 0) {
          if (stan.zycia <= 0) {
            // Ostatnie serce — partia się kończy, zebrane odpowiedzi zostają.
            stan.spadanie = 0;
            stan.meta = null;
            zywe && setFaza("koniec");
            return;
          }
          stan.spadanie = 0;
          stan.d = stan.powrotNa;
          stan.y = 0;
          stan.squash = 1;
          cialo.rotation.x = 0;
          if (biegAkcja) biegAkcja.timeScale = 1.15;
          try { krokiGraj({ bieg: true }); } catch {}
        }
        const uS = stan.d / DLUGOSC;
        const pS = krzywa.getPointAt(uS);
        lis.position.set(pS.x, pS.y + stan.y, pS.z);
        kamera.lookAt(lis.position);
        if (mixer) mixer.update(dt);
        renderer.render(scena, kamera);
        raf = requestAnimationFrame(klatka);
        return;
      }

      stan.d = (stan.d + stan.v * dt) % DLUGOSC;

      // skok + lądowanie
      if (stan.wSkoku) {
        stan.vy -= GRAWITACJA * dt;
        stan.y += stan.vy * dt;
        if (stan.y <= 0) {
          stan.y = 0;
          stan.wSkoku = false;
          stan.squash = 1;
          if (biegAkcja) biegAkcja.timeScale = 1.15;
          try { krokiGraj({ bieg: true }); } catch {}
        }
      }
      stan.squash = Math.max(0, stan.squash - dt * 6);

      /* Grunt pod łapami. Sprawdzamy DOPIERO po policzeniu skoku, bo lisek
         w powietrzu przelatuje nad wyrwą bez konsekwencji — o to w niej chodzi.
         `stan.y <= 0.05` zamiast `=== 0` daje zapas na lądowanie tuż przy
         krawędzi: przy dokładnie zerowej wysokości pojedyncza klatka na styku
         potrafiła wpuścić liska w dziurę, w którą już dolatywał. */
      if (!stan.wSkoku && stan.y <= 0.05 && stan.meta === null) {
        const wyrwa = wWyrwie(stan.d);
        if (wyrwa) {
          // Łaska krawędzi liczy się OSOBNO dla każdej wyrwy — inaczej po
          // wpadnięciu i powrocie zegar byłby już zużyty.
          if (stan.laskaWyrwa !== wyrwa) { stan.laskaWyrwa = wyrwa; stan.laska = LASKA_KRAWEDZI; }
          stan.laska -= dt;
          if (stan.laska <= 0) wpadnij(wyrwa);
        } else if (stan.laskaWyrwa) {
          stan.laskaWyrwa = null;
          stan.laska = 0;
        }
      }

      // zadania: aktywacja i rozstrzyganie
      if (!stan.aktywne && stan.meta === null && stan.nrPytania < ILE_PYTAN
        && wzdluz(stan.nastepneOd, stan.d) >= 0) {
        aktywujPytanie();
      }
      if (stan.meta !== null && wzdluz(stan.meta, stan.d) >= 0) {
        stan.meta = null;
        zywe && setFaza("koniec");
      }

      // pozycja i orientacja liska
      const u = stan.d / DLUGOSC;
      const p = krzywa.getPointAt(u);
      const t = krzywa.getTangentAt(u);
      lis.position.copy(p);
      lis.position.y += stan.y;
      tmpM.lookAt(new THREE.Vector3(), t.clone().negate(), up);
      tmpQ.setFromRotationMatrix(tmpM);
      lis.quaternion.slerp(tmpQ, 1 - Math.exp(-14 * dt));

      // proceduralny podskok: pochylenie za prędkością pionową + squash
      cialo.rotation.x = stan.wSkoku ? -stan.vy * 0.055 : 0;
      const sq = stan.squash * 0.22;
      cialo.scale.set(1 + sq, 1 - sq, 1 + sq);
      if (stan.wSkoku) cialo.scale.y = 1 + ogranicz(Math.abs(stan.vy) / WYBICIE, 0, 1) * 0.16;

      // zbieranie i mijanie tabliczek
      for (let i = tabliczki.length - 1; i >= 0; i--) {
        const tab = tabliczki[i];
        const dane = tab.userData;
        if (dane.znika) {
          dane.skala -= dt * 5;
          if (dane.skala <= 0) { scena.remove(tab); tab.material.map?.dispose(); tab.material.dispose(); tabliczki.splice(i, 1); }
          else tab.scale.set(dane.skala, dane.skala, 1);
          continue;
        }
        tab.material.rotation = Math.sin(teraz / 300 + dane.d) * 0.08;
        const dyst = wzdluz(stan.d, dane.d);
        if (!dane.zebrana && Math.abs(dyst) < 1.0 && stan.y > PROG_ZBIORU) {
          dane.zebrana = true;
          rozsypIskry(tab.position);
          if (dane.dobra) {
            zakonczPytanie(true, dane.liczba);
          } else {
            // zła: gaśnie na szaro, pytanie biegnie dalej
            tab.material.color = new THREE.Color(0x8f8f8f);
            dane.znika = true;
            const z = stan.aktywne;
            if (z) setReakcja({ ton: "zle", tekst: "To nie ta liczba…" });
            // jeśli dobra już minęła, kończymy pytanie porażką
            const dobraTab = tabliczki.find((x) => x.userData.dobra && !x.userData.znika);
            if (z && !dobraTab) zakonczPytanie(false, z.wynik);
          }
        } else if (!dane.zebrana && dyst < -1.4) {
          // minięta bez skoku
          if (dane.dobra && stan.aktywne) zakonczPytanie(false, stan.aktywne.wynik);
          else dane.znika = true;
        }
      }

      // iskry po zebraniu
      for (let i = iskry.length - 1; i >= 0; i--) {
        const s = iskry[i];
        s.userData.zycie -= dt;
        if (s.userData.zycie <= 0) { scena.remove(s); s.material.dispose(); iskry.splice(i, 1); continue; }
        s.userData.v.y -= 6 * dt;
        s.position.addScaledVector(s.userData.v, dt);
        s.material.opacity = s.userData.zycie / 0.7;
      }

      // kamera zza pleców: punkt na krzywej 6 m za liskiem, 3.2 m nad drogą,
      // patrzy między liska a drogę przed nim — zakręt widać zawczasu
      const uZa = (((stan.d - 6.0) % DLUGOSC + DLUGOSC) % DLUGOSC) / DLUGOSC;
      const pZa = krzywa.getPointAt(uZa);
      kamera.position.lerp(new THREE.Vector3(pZa.x, p.y + 3.2 + stan.y * 0.35, pZa.z), 1 - Math.exp(-8 * dt));
      const cel = krzywa.getPointAt(((stan.d + 4.5) % DLUGOSC) / DLUGOSC).lerp(lis.position, 0.45);
      cel.y = p.y + 1.0;
      kamera.lookAt(cel);

      if (mixer) mixer.update(dt);
      renderer.render(scena, kamera);
      raf = requestAnimationFrame(klatka);
    };
    raf = requestAnimationFrame(klatka);

    return () => {
      zywe = false;
      cancelAnimationFrame(raf);
      canvas.removeEventListener("webglcontextlost", naUtracieKontekstu);
      window.removeEventListener("resize", dopasuj);
      window.removeEventListener("keydown", naKlawisz);
      skokRef.current = null;
      try { krokiStop(); } catch {}
      renderer.dispose();
      scena.traverse((o) => {
        if (o.geometry) o.geometry.dispose?.();
        if (o.material) {
          (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => { m.map?.dispose?.(); m.dispose?.(); });
        }
      });
    };
  }, [faza, diff]);

  return (
    <main className={`gra-root bieg-gra${osadzona ? " gra-osadzona" : ""}`} data-testid="gra-bieg-liska">
      <div className="gra-pasek bieg-pasek">
        {/* LEWY RÓG PASKA = STAN GRACZA (serca, potem postęp), PRAWY = wyjście.
            Wcześniej wszystko było dosunięte do prawej, więc licznik pytań
            wpadał pod czerwony krzyżyk, a pigułka z zadaniem — wyśrodkowana
            osobno — nachodziła na jedno i drugie. Teraz pasek ma dwa stałe
            końce, a zadanie mieszka POD nim (patrz `.bieg-info`), więc żaden
            element nie zależy od tego, jak długi akurat jest sąsiad. */}
        <div className="bieg-pasek-lewo">
          {/* Puste serce zostaje na swoim miejscu — znikające serca gubią
              informację, ILE ich było na starcie. */}
          {faza === "gra" ? (
            <span className="bieg-zycia" aria-label={`Życia: ${zycia} z ${ZYCIA_START}`}>
              {Array.from({ length: ZYCIA_START }, (_, i) => (
                <i key={i} className={i < zycia ? "jest" : "puste"} aria-hidden="true">♥</i>
              ))}
            </span>
          ) : null}
          {faza === "gra" && pytanie ? (
            <span className="bieg-postep" aria-label={`Pytanie ${pytanie.nr} z ${ILE_PYTAN}`}>
              <b>{pytanie.nr}</b><span>/ {ILE_PYTAN}</span>
            </span>
          ) : null}
        </div>
        <button type="button" className="gra-x" onClick={wrocDoHuba} aria-label="Zamknij grę">×</button>
      </div>

      {/* Scena 3D nie wstała albo padła. Bez tego dziecko zostawało na czarnym
          płótnie rozciągniętym nad całym hubem — bez HUD-u, bez mapy i bez
          żadnego przycisku. Jedno zdanie i wyjście wystarczą; nie udajemy,
          że gra działa. */}
      {bladSceny ? (
        <div className="bieg-blad" role="alert">
          <p>Bieg nie chce się dziś uruchomić.</p>
          <p className="hub-muted">
            {bladSceny === "utracony"
              ? "Telefon potrzebował pamięci na coś innego."
              : "Spróbuj jeszcze raz za chwilę."}
          </p>
          <button type="button" className="hub-btn hub-btn-primary" onClick={wrocDoHuba}>
            Wracam na mapę
          </button>
        </div>
      ) : null}

      {faza === "splash" || faza === "intro" ? (
        <div className="gra-scroll">
          <SplashGry minCzas={950} onKoniec={() => setFaza("intro")}>
            {({ laduje }) => (
              <EkranStartuGry
                ilustracja="/assets/minigry/lis-bieg.webp"
                tytul="Bieg Liska"
                haslo="Licz w biegu, skacz po wynik!"
                wariant="bieg"
                laduje={laduje}
                tekstLadowania="Buduję serpentynę…"
                poziomy={poziomyGry(GRA)}
                wybrany={diff}
                onWybor={setDiff}
                cta="Biegniemy!"
                onGraj={start}
              />
            )}
          </SplashGry>
        </div>
      ) : null}

      {faza === "gra" ? (
        <div className="bieg-scena">
          <canvas
            ref={canvasRef}
            className="bieg-canvas"
            onPointerDown={(e) => { e.preventDefault(); skokRef.current?.(); }}
            aria-label="Scena biegu. Dotknij ekranu, żeby lisek podskoczył."
          />
          {/* Zadanie i reakcja stoją JEDNO POD DRUGIM w kolumnie, zamiast być
              osobno kotwiczone do góry ekranu na sztywnych odległościach.
              Dzięki temu długie zadanie („12 − 7 = ?") samo odsuwa reakcję
              w dół, a nie wchodzi na nią. */}
          <div className="bieg-info">
            {pytanie ? (
              <div className="bieg-pytanie" role="status" key={pytanie.nr}>{pytanie.tekst}</div>
            ) : (
              <div className="bieg-pytanie is-cicha" role="status">Biegnij! Zaraz pierwsze zadanie…</div>
            )}
            {reakcja ? (
              <div className={`bieg-reakcja is-${reakcja.ton}`} role="status" key={reakcja.tekst}>
                {reakcja.tekst}
              </div>
            ) : null}
          </div>
          {/* Podpowiedź gestu ZNIKA PO NAUCE. Wcześniej wisiała przez całą
              partię — a to jedyny gest w tej grze, więc po trzecim podskoku
              nie uczy już niczego, tylko zasłania dolny kawałek drogi, czyli
              dokładnie ten, na którym widać nadchodzącą wyrwę.
              Do tego momentu jest ZNACZNIE większa niż wcześniej: dziecko ma
              ją przeczytać kątem oka w biegu, a nie szukać na dole ekranu. */}
          {skokow <= SKOKI_BEZ_PODPOWIEDZI ? (
            <div
              className={`bieg-podpowiedz${skokow >= SKOKI_BEZ_PODPOWIEDZI ? " is-gasnie" : ""}`}
              aria-hidden="true"
            >
              <span className="bieg-palec">☝</span>
              <span>Dotknij — podskok</span>
            </div>
          ) : null}
        </div>
      ) : null}

      {faza === "koniec" ? (
        <RewardScreen
          eyebrow="BIEG LISKA"
          /* Koniec przez wyrwy dostaje własny tytuł — „Dobiegłeś do mety!"
             po wpadnięciu w przepaść brzmiałoby jak kpina. Monety i tak
             zostają, więc to nie jest przegrana, tylko krótszy bieg. */
          title={
            zycia <= 0
              ? "Wyrwa Cię złapała!"
              : dobrze === ILE_PYTAN ? "Mistrz liczenia!" : dobrze >= 3 ? "Świetny bieg!" : "Dobiegłeś do mety!"
          }
          subtitle={
            zycia <= 0
              ? `Serca się skończyły, ale odpowiedzi zostają: ${dobrze} z ${ILE_PYTAN}.`
              : `Zebrane odpowiedzi: ${dobrze} z ${ILE_PYTAN}.`
          }
          coins={monety + nagrodaMisji}
          gwiazdki={dobrze >= ILE_PYTAN ? 3 : dobrze >= 3 ? 2 : 1}
          /* Rozbicie wchodzi tylko wtedy, gdy nagroda ma dwa źródła — patrz
             `RewardScreen`. Bez misji zostaje sama liczba za partię. */
          rozbicie={[
            { etykieta: "Za bieg", monety },
            { etykieta: "Od Wizkora za misję", monety: nagrodaMisji },
          ]}
          kafelki={[
            { wartosc: `${dobrze}/${ILE_PYTAN}`, etykieta: "wyniki" },
            { wartosc: `${zycia}/${ZYCIA_START}`, etykieta: "serca" },
            { wartosc: monety, etykieta: "monety" },
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
