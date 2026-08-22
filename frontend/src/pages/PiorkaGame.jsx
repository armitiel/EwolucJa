/**
 * PiorkaGame — „Sekret pod puchem".
 *
 * Pod kopcem piórek leży przedmiot. Dziecko rozgarnia puch palcem i w dowolnym
 * momencie może zgadnąć, co tam jest.
 *
 * TRZY DECYZJE, KTÓRE TRZYMAJĄ TĘ GRĘ:
 *
 * 1. NAGRODA ZA *MAŁO ODSŁONIĘTEGO*, NIE ZA SZYBKOŚĆ. Punktuje stan kopca
 *    w chwili dotknięcia odpowiedzi, a nie sekundy. Liczenie czasu uczyłoby
 *    pośpiechu, a reszta aplikacji uczy dokładnie odwrotnie. Dziecko, które
 *    rozgarnia wolno i rozpoznaje wcześnie, ma dostać tyle samo co szybkie.
 *
 * 2. POMYŁKA MUSI KOSZTOWAĆ. Gdyby zła odpowiedź była darmowa, optymalną
 *    strategią byłoby klikać po kolei wszystkie trzy kafelki od razu. Pudło
 *    gasi kafelek i zbija próg nagrody — wczesne zgadywanie jest zakładem,
 *    nie losem na loterii. Przegranej nie ma: najgorszy przebieg to jedna
 *    moneta.
 *
 * 3. PIÓRKA SIĘ PRZESUWAJĄ, NIE ZNIKAJĄ. Cała przyjemność jest w grzebaniu.
 *    Znikanie po dotknięciu zamieniłoby to w zdrapkę.
 *
 * Postęp pokazuje POŚWIATA spod spodu, a nie pasek — pasek podpowiadałby,
 * kiedy wypada zgadywać, a to jest właśnie ta decyzja, którą mierzymy.
 */
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import RewardScreen from "../components/RewardScreen.jsx";
import SplashGry from "../hub/SplashGry.jsx";
import EkranStartuGry from "../hub/EkranStartuGry.jsx";
import { fx } from "../services/soundFx.js";
import { dodajMonety } from "../services/monety.js";
import { rozliczPartie } from "../hub/misjeGier.js";
import { poziomIstnieje, poziomyGry } from "../hub/poziomyGier.js";
import { czyDev } from "../services/dev.js";
import "../hub/styles/hub.css";

/** Identyfikator z katalogu — ten sam w misjach, na mapie i w adresie. */
const GRA = "sekret-pod-puchem";

const SCIEZKA = "/assets/piorka/";
const PIORKA = ["piorko-krem", "piorko-piasek", "piorko-biel", "piorko-blekit"];
const ZLOTE = "piorko-zlote";

/* Dziewięć przedmiotów daje 9 × 8 × 7 = 504 możliwe zestawy trzech kafelków,
   więc pięć rund pod rząd nie powtórzy się w oczywisty sposób. Dokładanie
   kolejnych to jedna linijka plus plik w `public/assets/piorka/`. */
const OBIEKTY = [
  { id: "ptak",    nazwa: "Ptak",    plik: "ukryty-ptak" },
  { id: "klucz",   nazwa: "Klucz",   plik: "ukryty-klucz" },
  { id: "lis",     nazwa: "Lis",     plik: "ukryty-lis" },
  { id: "muszla",  nazwa: "Muszla",  plik: "ukryty-muszla" },
  { id: "ksiezyc", nazwa: "Księżyc", plik: "ukryty-ksiezyc" },
  { id: "zwoj",    nazwa: "Zwój",    plik: "ukryty-zwoj" },
  { id: "dzwonek", nazwa: "Dzwonek", plik: "ukryty-dzwonek" },
  { id: "grzyb",   nazwa: "Grzybek", plik: "ukryty-grzyb" },
  { id: "serce",   nazwa: "Serce",   plik: "ukryty-serce" },
];

const RUND = 5;
const PROG_KAFELKOW = 0.12;   // ile trzeba odsłonić, zanim wolno zgadywać
const NAGRODY = [
  { doOdsloniecia: 0.20, monety: 5 },
  { doOdsloniecia: 0.50, monety: 3 },
  { doOdsloniecia: 1.01, monety: 1 },
];

function wczytaj(nazwa) {
  return new Promise((ok, blad) => {
    const img = new Image();
    img.onload = () => ok(img);
    img.onerror = () => blad(new Error(nazwa));
    img.src = SCIEZKA + nazwa + ".png";
  });
}

function losowa(t) { return t[Math.floor(Math.random() * t.length)]; }
function tasuj(t) {
  const k = [...t];
  for (let i = k.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [k[i], k[j]] = [k[j], k[i]];
  }
  return k;
}

/**
 * `osadzona` = gra rysuje sie NAD huba `/swiat`, ktory zostaje zamontowany
 * (scena 3D pauzuje w tle zamiast sie wyladowac). Wtedy wyjscie oddaje
 * sterowanie rodzicowi przez `onWyjscie`, zamiast nawigowac gdziekolwiek.
 * Bez tych propsow komponent dziala po staremu, jako wlasny ekran pod
 * `/games/piorka` - stare linki i zakladki dalej trafiaja, gdzie trzeba.
 */
/**
 * `poziom` = dziecko potwierdziło start JUŻ WCZEŚNIEJ, w oknie liska na mapie
 * (ta gra ma jeden poziom, więc okno pokazywało tam samą kwotę). Ekran startowy
 * tej gry nie ma wtedy nic do dodania, więc go pomijamy. Wejście z kafelka
 * w zakładce nie ma tego propsa i działa po staremu.
 */
export default function PiorkaGame({ osadzona = false, poziom = null, onWyjscie }) {
  const navigate = useNavigate();
  const wrocDoHuba = () => (onWyjscie ? onWyjscie() : navigate("/swiat?panel=gry"));
  const zPominieciemIntro = poziomIstnieje(GRA, poziom);
  const canvasRef = useRef(null);
  const obrazy = useRef({});
  const piorka = useRef([]);
  const scena = useRef({ w: 0, h: 0, obiekt: { x: 0, y: 0, r: 0 }, faza: "kopiec" });
  const petla = useRef(0);
  const ostatniPunkt = useRef(null);
  /**
   * Odliczanie od trafionej odpowiedzi do następnej rundy.
   *
   * MUSI mieć uchwyt. Wcześniej `setTimeout` leciał bez niego i przeżywał
   * wszystko: wyjście krzyżykiem w trakcie wybuchu, restart z „Jeszcze raz",
   * odmontowanie gry nad hubem. Zaległe odliczenie z poprzedniej partii
   * wchodziło potem w świeżo zaczętą — przestawiało numer rundy albo, jeśli
   * padło na ostatniej, od razu kończyło grę i wypłacało monety za partię,
   * której dziecko nie rozegrało. Z zewnątrz wygląda to jak zawieszony ekran:
   * plansza znika, wchodzi ekran wyniku, którego nikt się nie spodziewał.
   *
   * `sesjaRef` to drugi zamek: numer bieżącej partii. Odliczenie sprawdza go
   * przy odpaleniu i milczy, jeśli partia jest już inna.
   */
  const zegarRundyRef = useRef(0);
  const sesjaRef = useRef(0);

  const [faza, setFaza] = useState("splash");   // splash|wczytywanie|intro|gra|koniec|blad
  const [runda, setRunda] = useState(0);
  const [monety, setMonety] = useState(0);
  const [odslon, setOdslon] = useState(0);
  const [zestaw, setZestaw] = useState(null);        // { cel, opcje }
  const [zgaszone, setZgaszone] = useState([]);      // id-ki spudłowanych kafelków
  const [kara, setKara] = useState(0);               // ile progów w dół za pudła
  // Rundy zgadnięte za pierwszym razem — jedyna liczba poza monetami, która
  // mówi dziecku coś o TYM, jak grało, a nie ile dostało.
  const [bezPudla, setBezPudla] = useState(0);
  // Nagroda Wizkora za misję, doliczona na koniec partii. Ekran wyniku pisze
  // o niej tylko wtedy, gdy naprawdę była — patrz `misjeGier.rozliczPartie`.
  const [nagrodaMisji, setNagrodaMisji] = useState(0);
  const [zaladowane, setZaladowane] = useState(false);

  /* ── wczytanie grafiki ─────────────────────────────────────────────────── */
  /* Ekran startowy wchodzi dopiero, gdy WSZYSTKIE grafiki są w pamięci —
     inaczej pierwsza runda zaczynałaby się od dziur w kopcu. Odliczaniem
     i minimalnym czasem zajmuje się `SplashGry`. */
  useEffect(() => {
    let zywe = true;
    const lista = [...PIORKA, ZLOTE, ...OBIEKTY.map((o) => o.plik)];
    Promise.all(lista.map(wczytaj))
      .then((wynik) => {
        if (!zywe) return;
        lista.forEach((n, i) => { obrazy.current[n] = wynik[i]; });
        setZaladowane(true);
      })
      .catch(() => zywe && setFaza("blad"));
    return () => { zywe = false; };
  }, []);

  /* ── budowa kopca ──────────────────────────────────────────────────────── */
  const zasyp = useCallback(() => {
    const { w, h, obiekt } = scena.current;
    const lista = [];
    /* GĘSTOŚĆ, NIE LICZBA. Wcześniej stało tu `ile = w*h/1500`, czyli liczba
       piórek rosła z polem CAŁEGO płótna, a rozgarnia się tylko kopiec nad
       obiektem — pole mniej więcej `min(w,h)²`. Na tablecie i na laptopie
       wychodziło z tego 550-700 piórek na kopcu wielkości telefonowego:
       dziecko grzebało i grzebało, licznik odsłonięcia nie ruszał się z zera,
       kafelki z odpowiedziami nigdy nie wchodziły i ekran wyglądał na zawieszony.

       Teraz obie porcje są skalowane tak, żeby gęstość PRZY OBIEKCIE była ta
       sama na każdym ekranie: kopiec liczony z `min(w,h)²`, tło z pola płótna
       skorygowanego o ten sam czynnik. `LIMIT` to bezpiecznik wydajności —
       każde piórko to `drawImage` w każdej klatce. */
    const m = Math.min(w, h);
    const LIMIT = 800;
    let nad = Math.round((m * m) / 2300);
    let wokol = Math.round(((w * h) / 2600) * (390 / m) * (390 / m));
    if (nad + wokol > LIMIT) {
      const k = LIMIT / (nad + wokol);
      nad = Math.round(nad * k); wokol = Math.round(wokol * k);
    }
    for (let i = 0; i < nad + wokol; i++) {
      // Nad obiektem sypiemy GĘŚCIEJ — inaczej start bywa już częściowo
      // odsłonięty i pierwsza runda rozdaje pełną nagrodę za nic.
      const nadObiektem = i < nad;
      let x, y;
      if (nadObiektem) {
        const kat = Math.random() * Math.PI * 2;
        const d = Math.sqrt(Math.random()) * obiekt.r * 1.25;
        x = obiekt.x + Math.cos(kat) * d;
        y = obiekt.y + Math.sin(kat) * d;
      } else {
        x = Math.random() * w;
        y = Math.random() * h;
      }
      const plan = Math.random();
      lista.push({
        x, y, vx: 0, vy: 0,
        kat: Math.random() * Math.PI * 2, vk: 0,
        skala: (plan < 0.28 ? 0.20 : plan < 0.72 ? 0.28 : 0.38) * (Math.min(w, h) / 420),
        plan: plan < 0.28 ? 0 : plan < 0.72 ? 1 : 2,
        obraz: Math.random() < 0.035 ? ZLOTE : losowa(PIORKA),
        faza: Math.random() * 7,
      });
    }
    lista.sort((a, b) => a.plan - b.plan);
    piorka.current = lista;
  }, []);

  const nowaRunda = useCallback((poprzedni) => {
    const pula = poprzedni ? OBIEKTY.filter((o) => o.id !== poprzedni) : OBIEKTY;
    const cel = losowa(pula);
    const reszta = tasuj(OBIEKTY.filter((o) => o.id !== cel.id)).slice(0, 2);
    setZestaw({ cel, opcje: tasuj([cel, ...reszta]) });
    setZgaszone([]); setKara(0); setOdslon(0);
    scena.current.faza = "kopiec";
    zasyp();
  }, [zasyp]);

  /* ── pętla rysująca ────────────────────────────────────────────────────── */
  useEffect(() => {
    if (faza !== "gra") return undefined;
    const c = canvasRef.current;
    if (!c) return undefined;
    const g = c.getContext("2d");
    let t = 0, doPomiaru = 0;

    const wymiary = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = c.clientWidth, h = c.clientHeight;
      c.width = w * dpr; c.height = h * dpr;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      const poprzednie = scena.current.w;
      scena.current.w = w; scena.current.h = h;
      scena.current.obiekt = { x: w / 2, y: h * 0.45, r: Math.min(w, h) * 0.17 };
      if (!poprzednie) zasyp();
    };
    wymiary();
    window.addEventListener("resize", wymiary);

    const KOL = 12, WIE = 12;
    /* Ile z szerokości piórka liczymy jako realnie zakryte. 0.30 dobrane tak,
       żeby pełny kopiec dawał ~0.01, a mocno rozgarnięty ~0.6. */
    const KRYCIE = 0.30;
    /**
     * Komórka jest ZAKRYTA, gdy leży pod piórkiem — nie gdy trafił w nią jego
     * ŚRODEK.
     *
     * Poprzednia wersja stemplowała same środki, a piórko ma ~70 px przy
     * komórce ~12 px. Kopiec wyglądał więc na pełny, a licznik pokazywał
     * 0.17-0.66 JUŻ NA STARCIE. Dwa skutki, oba widoczne w grze: kafelki
     * z odpowiedziami (próg 0.12) były odsłonięte od pierwszej klatki, więc
     * „rozgarnij, zanim zgadniesz" nie działało wcale; i `NAGRODY` zawsze
     * trafiały w ostatni próg, czyli JEDNA moneta za rundę zamiast pięciu —
     * gra nie potrafiła wypłacić obiecanych 25.
     */
    const policz = () => {
      const { obiekt } = scena.current;
      const bok = obiekt.r * 2.1;
      const x0 = obiekt.x - bok / 2, y0 = obiekt.y - bok / 2;
      const kw = bok / KOL, kh = bok / WIE;
      const siatka = new Uint8Array(KOL * WIE);
      for (const p of piorka.current) {
        const R = 300 * p.skala * KRYCIE;
        const kx0 = Math.max(0, Math.floor((p.x - R - x0) / kw));
        const kx1 = Math.min(KOL - 1, Math.floor((p.x + R - x0) / kw));
        const ky0 = Math.max(0, Math.floor((p.y - R - y0) / kh));
        const ky1 = Math.min(WIE - 1, Math.floor((p.y + R - y0) / kh));
        for (let ky = ky0; ky <= ky1; ky++) {
          for (let kx = kx0; kx <= kx1; kx++) {
            const cx = x0 + (kx + 0.5) * kw, cy = y0 + (ky + 0.5) * kh;
            if ((cx - p.x) ** 2 + (cy - p.y) ** 2 <= R * R) siatka[ky * KOL + kx] = 1;
          }
        }
      }
      let puste = 0;
      for (let i = 0; i < siatka.length; i++) if (!siatka[i]) puste++;
      setOdslon(puste / siatka.length);
    };

    const klatka = () => {
      t += 1 / 60;
      const { w, h, obiekt } = scena.current;
      const wybuch = scena.current.faza === "wybuch";
      g.clearRect(0, 0, w, h);

      // poświata spod spodu — rośnie razem z odsłonięciem, zastępuje pasek postępu
      const moc = wybuch ? 1 : Math.min(1, odslonRef.current * 1.7);
      if (moc > 0.01) {
        const gl = g.createRadialGradient(obiekt.x, obiekt.y, obiekt.r * 0.15, obiekt.x, obiekt.y, obiekt.r * 2.5);
        gl.addColorStop(0, `rgba(255,232,168,${0.9 * moc})`);
        gl.addColorStop(0.5, `rgba(255,214,120,${0.34 * moc})`);
        gl.addColorStop(1, "rgba(255,214,120,0)");
        g.fillStyle = gl; g.fillRect(0, 0, w, h);
      }

      const celObraz = obrazy.current[celRef.current];
      if (celObraz) {
        // Wpisujemy obrazek w kwadrat ZACHOWUJĄC proporcje. Wcześniej szło tu
        // `bok x bok` i wysokie grafiki (klucz: 340x512) rozciągały się wszerz.
        const bok = obiekt.r * 2 * (wybuch ? 1.06 : 1);
        const skala = Math.min(bok / celObraz.naturalWidth, bok / celObraz.naturalHeight);
        const cw = celObraz.naturalWidth * skala, ch = celObraz.naturalHeight * skala;
        const skok = wybuch ? Math.sin(t * 6) * 4 : 0;
        g.drawImage(celObraz, obiekt.x - cw / 2, obiekt.y - ch / 2 + skok, cw, ch);
      }

      for (const p of piorka.current) {
        if (wybuch) {
          p.vy -= 30 / 60;
          p.vx += Math.sin(p.faza + t) * 0.4;
          p.vk += 0.014;
        }
        p.x += p.vx; p.y += p.vy;
        p.vx *= 0.90; p.vy *= 0.90;
        p.kat += p.vk; p.vk *= 0.93;
        // falowanie w miejscu — bez tego puch „jedzie" jak kafelki
        p.x += Math.sin(t * 1.5 + p.faza) * 0.13;
        if (!wybuch) {
          if (p.x < -80) p.x = w + 70; if (p.x > w + 80) p.x = -70;
          if (p.y < -80) p.y = h + 70; if (p.y > h + 80) p.y = -70;
        }
        const img = obrazy.current[p.obraz];
        if (!img) continue;
        const bok = 300 * p.skala;
        const s = Math.min(bok / img.naturalWidth, bok / img.naturalHeight);
        const iw = img.naturalWidth * s, ih = img.naturalHeight * s;
        g.save();
        g.translate(p.x, p.y); g.rotate(p.kat);
        g.globalAlpha = p.plan === 0 ? 0.75 : 1;
        g.drawImage(img, -iw / 2, -ih / 2, iw, ih);
        g.restore();
      }
      g.globalAlpha = 1;

      doPomiaru += 1;
      if (doPomiaru % 8 === 0 && !wybuch) policz();
      petla.current = requestAnimationFrame(klatka);
    };
    petla.current = requestAnimationFrame(klatka);
    return () => {
      cancelAnimationFrame(petla.current);
      window.removeEventListener("resize", wymiary);
    };
  }, [faza, zasyp]);

  // Wartości czytane w pętli animacji trzymamy w refach — pętla powstaje raz
  // i nie widziałaby zmian stanu Reacta.
  const odslonRef = useRef(0);
  const celRef = useRef(null);
  useEffect(() => { odslonRef.current = odslon; }, [odslon]);
  useEffect(() => { celRef.current = zestaw?.cel?.plik || null; }, [zestaw]);

  /* ── rozgarnianie ──────────────────────────────────────────────────────── */
  const zamiec = useCallback((x, y, px, py) => {
    if (scena.current.faza === "wybuch") return;
    const dx = x - px, dy = y - py;
    const dl = Math.hypot(dx, dy) || 1;
    const ux = dx / dl, uy = dy / dl;
    const R = Math.min(scena.current.w, scena.current.h) * 0.16;
    for (const p of piorka.current) {
      const ddx = p.x - x, ddy = p.y - y;
      const d = Math.hypot(ddx, ddy);
      if (d > R) continue;
      const sila = (1 - d / R) * Math.min(24, dl * 1.4);
      // W kierunku ruchu ORAZ na zewnątrz od palca. Samo „od palca" wygląda
      // jak wybuch, samo „w kierunku" jak przesuwanie kafelków.
      p.vx += ux * sila * 0.9 + (ddx / (d || 1)) * sila * 0.7;
      p.vy += uy * sila * 0.9 + (ddy / (d || 1)) * sila * 0.7;
      p.vk += (Math.random() - 0.5) * 0.5 * (sila / 10);
    }
  }, []);

  const naRuch = (e) => {
    if (!ostatniPunkt.current) return;
    const r = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    zamiec(x, y, ostatniPunkt.current.x, ostatniPunkt.current.y);
    ostatniPunkt.current = { x, y };
  };
  const naStart = (e) => {
    const r = canvasRef.current.getBoundingClientRect();
    ostatniPunkt.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    canvasRef.current.setPointerCapture?.(e.pointerId);
  };
  const naKoniec = () => { ostatniPunkt.current = null; };

  /* ── odpowiedź ─────────────────────────────────────────────────────────── */
  function odpowiedz(opcja) {
    if (!zestaw || scena.current.faza === "wybuch") return;
    if (opcja.id !== zestaw.cel.id) {
      setZgaszone((z) => [...z, opcja.id]);
      setKara((k) => k + 1);
      try { fx?.blad?.(); } catch {}
      return;
    }
    const prog = NAGRODY.findIndex((n) => odslon <= n.doOdsloniecia);
    const indeks = Math.min(NAGRODY.length - 1, (prog < 0 ? NAGRODY.length - 1 : prog) + kara);
    setMonety((m) => m + NAGRODY[indeks].monety);
    if (kara === 0) setBezPudla((n) => n + 1);
    scena.current.faza = "wybuch";
    try { fx?.sukces?.(); } catch {}
    const sesja = sesjaRef.current;
    window.clearTimeout(zegarRundyRef.current);
    zegarRundyRef.current = window.setTimeout(() => {
      zegarRundyRef.current = 0;
      if (sesja !== sesjaRef.current) return;   // partia już inna — nie ruszaj jej
      if (runda + 1 >= RUND) {
        // Sama zmiana fazy. Wypłata i domknięcie misji siedzą w efekcie niżej,
        // żeby dev-owe „wygraj partię" szło DOKŁADNIE tą samą drogą.
        setFaza("koniec");
        return;
      }
      setRunda((r) => r + 1);
      nowaRunda(zestaw.cel.id);
    }, 1700);
  }

  /**
   * Uchwyt dla pulpitu testowego — konczy partie od reki. Tylko w trybie dev;
   * patrz blizniaczy komentarz w `MemoryGame.jsx`.
   */
  useEffect(() => {
    if (!czyDev()) return undefined;
    window.__devGra = {
      id: GRA,
      wygraj: () => setFaza("koniec"),
    };
    return () => { if (window.__devGra?.id === GRA) delete window.__devGra; };
  }, []);

  /**
   * Koniec partii: monety trafiają do licznika, a misja Wizkora domyka się
   * i PŁACI od razu.
   *
   * Monety zbierane w rundach były do tej pory tylko liczbą na ekranie —
   * `dodajMonety` nie było tu wołane ani razu, więc dziecko oglądało nagrodę,
   * której nikt nie zapisywał. Ekran wyniku, który obiecuje i nie daje, jest
   * gorszy niż brak ekranu.
   *
   * Strażnik `wyplaconoRef` pilnuje jednej wypłaty na partię: efekt potrafi
   * odpalić ponownie przy każdym renderze fazy „koniec".
   */
  const wyplaconoRef = useRef(false);
  useEffect(() => {
    if (faza !== "koniec" || wyplaconoRef.current) return;
    wyplaconoRef.current = true;
    if (monety > 0) dodajMonety(monety, "minigra:piorka");
    try {
      const { dodane } = rozliczPartie(GRA);
      setNagrodaMisji(dodane || 0);
    } catch { setNagrodaMisji(0); }
  }, [faza, monety]);

  function start() {
    // Nowa partia unieważnia wszystko, co zostało po poprzedniej: zaległe
    // odliczenie rundy i stan sceny. `faza: "wybuch"` zostawał tu po wygranej
    // ostatniej rundzie, a dopóki wisi, `zamiec` i `odpowiedz` wychodzą na
    // wejściu — plansza nie reaguje ani na palec, ani na kafelki.
    window.clearTimeout(zegarRundyRef.current);
    zegarRundyRef.current = 0;
    sesjaRef.current += 1;
    scena.current.faza = "kopiec";
    setRunda(0); setMonety(0); setBezPudla(0); setNagrodaMisji(0);
    wyplaconoRef.current = false;
    nowaRunda();
    setFaza("gra");
  }

  // Wyjście z gry w trakcie wybuchu zostawiało wiszące odliczenie, które
  // odpalało się już po odmontowaniu komponentu.
  useEffect(() => () => window.clearTimeout(zegarRundyRef.current), []);

  // Przy wejsciu z mapy ekranu startowego NIE MA, wiec krzyzyk wychodzi wprost
  // do swiata — cofanie na ekran, ktorego dziecko nigdy nie widzialo, byloby
  // pojawieniem sie z niczego. To samo rozwiazanie, co w `MemoryGame`.
  const wyjdz = () => {
    window.clearTimeout(zegarRundyRef.current);
    zegarRundyRef.current = 0;
    sesjaRef.current += 1;
    if (faza === "gra" && !zPominieciemIntro) { setFaza("intro"); return; }
    wrocDoHuba();
  };

  /* ── widok ─────────────────────────────────────────────────────────────── */
  return (
    <main className={`gra-root${osadzona ? " gra-osadzona" : ""}`} data-testid="gra-piorka">
      <div className="gra-pasek">
        {faza === "gra" ? (
          <span className="puch-runda">{runda + 1} / {RUND}</span>
        ) : null}
        <button
          type="button"
          className="gra-x"
          onClick={wyjdz}
          aria-label={faza === "gra" ? "Przerwij grę" : "Zamknij grę"}
          title={faza === "gra" ? "Przerwij" : "Zamknij"}
        >
          ×
        </button>
      </div>

      <div className="gra-scroll">
        {faza === "blad" ? (
          <div className="puch-srodek">
            <p className="hub-muted">Nie udało się wczytać piórek.</p>
            <button className="hub-btn hub-btn-primary" onClick={wrocDoHuba}>Wróć</button>
          </div>
        ) : null}

        {/* Jedna scena czeka na prawdziwe grafiki piórek, a gdy są gotowe,
            płynnie zamienia loader na nagrodę i CTA. */}
        {faza === "splash" || faza === "intro" ? (
          <SplashGry gotowe={zaladowane} onKoniec={() => (zPominieciemIntro ? start() : setFaza("intro"))}>
            {({ laduje }) => (
              <EkranStartuGry
                ilustracja={SCIEZKA + "lis-skok.webp"}
                tytul="Sekret pod puchem"
                haslo="Znajdź ukryte piórko!"
                wariant="puch"
                laduje={laduje}
                tekstLadowania="Układam piórka…"
                /* Kwota z `hub/poziomyGier.js` — tę samą obiecuje okno liska
                   na mapie, więc nie ma jej gdzie policzyć dwa razy. */
                poziomy={poziomyGry(GRA)}
                wybrany="jeden"
                cta="Zaczynamy!"
                onGraj={start}
              />
            )}
          </SplashGry>
        ) : null}

        {faza === "gra" ? (
          <>
            <canvas
              ref={canvasRef}
              className="puch-plotno"
              onPointerDown={naStart}
              onPointerMove={naRuch}
              onPointerUp={naKoniec}
              onPointerCancel={naKoniec}
            />
            <div className={`puch-kafelki${odslon >= PROG_KAFELKOW ? " widoczne" : ""}`}>
              {(zestaw?.opcje || []).map((o) => (
                <button
                  key={o.id}
                  type="button"
                  className={`puch-kafel${zgaszone.includes(o.id) ? " zgaszony" : ""}`}
                  onClick={() => odpowiedz(o)}
                  disabled={zgaszone.includes(o.id)}
                >
                  <img src={SCIEZKA + o.plik + ".png"} alt="" aria-hidden="true" />
                  <span>{o.nazwa}</span>
                </button>
              ))}
            </div>
          </>
        ) : null}

      </div>

      {/* JEDEN ekran na koniec partii — patrz bliźniaczy komentarz
          w `MemoryGame.jsx`. Wcześniej stały tu dwa: ten i zaraz pod nim
          własne podsumowanie z tą samą liczbą monet, a po powrocie na mapę
          dochodziła jeszcze nagroda Wizkora za misję. */}
      {faza === "koniec" ? (
        <RewardScreen
          eyebrow="SEKRET POD PUCHEM"
          title={monety >= RUND * 4 ? "Bystre oko!" : monety >= RUND * 2 ? "Dobra robota!" : "Brawo!"}
          subtitle="Pięć sekretów odkrytych."
          coins={monety + nagrodaMisji}
          rozbicie={[
            { etykieta: "Za partię", monety },
            { etykieta: "Od Wizkora za misję", monety: nagrodaMisji },
          ]}
          kafelki={[
            { wartosc: `${RUND}/${RUND}`, etykieta: "rundy" },
            { wartosc: `${bezPudla}/${RUND}`, etykieta: "za pierwszym" },
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
