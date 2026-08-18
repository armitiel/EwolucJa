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
import "../hub/styles/hub.css";

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
export default function PiorkaGame({ osadzona = false, onWyjscie }) {
  const navigate = useNavigate();
  const wrocDoHuba = () => (onWyjscie ? onWyjscie() : navigate("/swiat?panel=gry"));
  const canvasRef = useRef(null);
  const obrazy = useRef({});
  const piorka = useRef([]);
  const scena = useRef({ w: 0, h: 0, obiekt: { x: 0, y: 0, r: 0 }, faza: "kopiec" });
  const petla = useRef(0);
  const ostatniPunkt = useRef(null);

  const [faza, setFaza] = useState("splash");   // splash|wczytywanie|intro|gra|koniec|blad
  const [runda, setRunda] = useState(0);
  const [monety, setMonety] = useState(0);
  const [odslon, setOdslon] = useState(0);
  const [zestaw, setZestaw] = useState(null);        // { cel, opcje }
  const [zgaszone, setZgaszone] = useState([]);      // id-ki spudłowanych kafelków
  const [kara, setKara] = useState(0);               // ile progów w dół za pudła
  const [nagrodaPokazana, setNagrodaPokazana] = useState(false);
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
    const ile = Math.round((w * h) / 1500);
    for (let i = 0; i < ile; i++) {
      // Nad obiektem sypiemy GĘŚCIEJ — inaczej start bywa już częściowo
      // odsłonięty i pierwsza runda rozdaje pełną nagrodę za nic.
      const nadObiektem = Math.random() < 0.42;
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
    const policz = () => {
      const { obiekt } = scena.current;
      const bok = obiekt.r * 2.1;
      const x0 = obiekt.x - bok / 2, y0 = obiekt.y - bok / 2;
      const siatka = new Uint8Array(KOL * WIE);
      for (const p of piorka.current) {
        const kx = Math.floor((p.x - x0) / (bok / KOL));
        const ky = Math.floor((p.y - y0) / (bok / WIE));
        if (kx >= 0 && kx < KOL && ky >= 0 && ky < WIE) siatka[ky * KOL + kx] = 1;
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
    scena.current.faza = "wybuch";
    try { fx?.sukces?.(); } catch {}
    window.setTimeout(() => {
      if (runda + 1 >= RUND) { setFaza("koniec"); return; }
      setRunda((r) => r + 1);
      nowaRunda(zestaw.cel.id);
    }, 1700);
  }

  function start() {
    setRunda(0); setMonety(0); setNagrodaPokazana(false);
    nowaRunda();
    setFaza("gra");
  }

  const wyjdz = () => {
    if (faza === "gra") { setFaza("intro"); return; }
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
        {faza === "splash" ? (
          <SplashGry
            tytul="Sekret pod puchem"
            podpis="Zbieram piórka…"
            obrazy={[...PIORKA.slice(0, 2), ZLOTE, ...PIORKA.slice(2)].map((n) => SCIEZKA + n + ".png")}
            gotowe={zaladowane}
            onKoniec={() => setFaza("intro")}
          />
        ) : null}

        {faza === "blad" ? (
          <div className="puch-srodek">
            <p className="hub-muted">Nie udało się wczytać piórek.</p>
            <button className="hub-btn hub-btn-primary" onClick={wrocDoHuba}>Wróć</button>
          </div>
        ) : null}

        {faza === "intro" ? (
          <EkranStartuGry
            ilustracja={SCIEZKA + "lis-skok.webp"}
            tytul="Sekret pod puchem"
            poziomy={[{ id: "jeden", monetyMax: RUND * NAGRODY[0].monety }]}
            wybrany="jeden"
            cta="Zaczynamy"
            onGraj={start}
          />
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

        {faza === "koniec" ? (
          <div className="puch-intro">
            <img className="puch-godlo" src={SCIEZKA + "piorko-zlote.png"} alt="" aria-hidden="true" />
            <h1>{monety >= RUND * 4 ? "Bystre oko!" : monety >= RUND * 2 ? "Dobra robota!" : "Brawo!"}</h1>
            <p>Zebrane monety: <strong>{monety}</strong></p>
            <div className="hub-actions gra-akcje">
              <button className="hub-btn hub-btn-ghost" onClick={start}>Jeszcze raz</button>
              <button className="hub-btn hub-btn-primary" onClick={wrocDoHuba}>Wracam</button>
            </div>
          </div>
        ) : null}
      </div>

      {faza === "koniec" && !nagrodaPokazana ? (
        <RewardScreen
          eyebrow="SEKRET POD PUCHEM"
          title="Znalezione!"
          subtitle="Pięć sekretów odkrytych."
          coins={monety}
          ctaLabel="Zobacz wynik"
          onDismiss={() => setNagrodaPokazana(true)}
        />
      ) : null}
    </main>
  );
}
