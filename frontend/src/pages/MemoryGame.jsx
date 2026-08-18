/**
 * MemoryGame — "Pamięć Mędrca" — klikalna mini-gra w pamięć par.
 * Z handoff Ewolucja-handoff(4)/game-memory.jsx, zaadaptowana do projektu EwolucJA:
 *  - TRYB GRY: bez wspolnego chromu aplikacji (PageShell/TopBar/TabBar).
 *    Gra zajmuje caly ekran, a jedynym wyjsciem jest przycisk w lewym gornym
 *    rogu. Dolna belka z zakladkami znikala tu z rozmyslem: kusila wyjsciem
 *    w srodku rozgrywki, a wracalo sie i tak do miejsca, z ktorego sie przyszlo.
 *  - Styl z huba (`hub/styles/hub.css`): te same zlote przyciski i kroje co na
 *    glownym ekranie, zeby gra nie wygladala na doklejona z innej aplikacji.
 *  - Sparkle/Cloud z naszego art.jsx
 *  - wyjscie wraca do `/swiat` — hub jest baza gry
 *  - 3 fazy: intro → playing → done
 *  - 2 poziomy: easy (6 par 3×4) / hard (8 par 4×4)
 *  - Star rating po liczbie ruchów (<idealne+2 → 3*, <idealne+6 → 2*, inaczej 1*)
 */
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkle, Cloud, Coin } from "../components/art.jsx";
import { fx } from "../services/soundFx.js";
import RewardScreen from "../components/RewardScreen.jsx";
import SplashGry from "../hub/SplashGry.jsx";
import { dodajMonety } from "../services/monety.js";
import "../hub/styles/hub.css";

// ─── Game symbols (8 unique) ────────────────────────────────────
const GAME_SYMS = [
  { id: "scroll",  name: "Zwój",     c: "#A87A2A" },
  { id: "crystal", name: "Kryształ", c: "#7A4DC2" },
  { id: "coin",    name: "Moneta",   c: "#E89A3D" },
  { id: "owl",     name: "Sowa",     c: "#2E7AB8" },
  { id: "mush",    name: "Grzyb",    c: "#D45A5A" },
  { id: "star",    name: "Gwiazda",  c: "#F4C95D" },
  { id: "moon",    name: "Księżyc",  c: "#5FA76F" },
  { id: "feather", name: "Pióro",    c: "#B886E8" },
];

function GameSym({ kind, size = 42, c = "#7A4DC2" }) {
  const ic = {
    scroll: (
      <g>
        <rect x="5" y="6" width="14" height="12" rx="2" fill={c} opacity=".15" />
        <path d="M5 8h14M5 12h10M5 16h12" stroke={c} strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="20" cy="7" r="1.8" fill={c} />
      </g>
    ),
    crystal: (
      <g>
        <path d="M12 3l5 5-5 13-5-13 5-5z" fill={c} fillOpacity=".2" stroke={c} strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M7 8h10M12 3v18" stroke={c} strokeWidth="1.8" />
      </g>
    ),
    coin: (
      <g>
        <circle cx="12" cy="12" r="8" fill={c} fillOpacity=".2" stroke={c} strokeWidth="1.8" />
        <text x="12" y="16" textAnchor="middle" fontSize="11" fontWeight="900" fill={c} fontFamily="Nunito">$</text>
      </g>
    ),
    owl: (
      <g>
        <ellipse cx="12" cy="13" rx="6" ry="7" fill={c} fillOpacity=".2" stroke={c} strokeWidth="1.6" />
        <circle cx="9.5" cy="11" r="1.7" fill={c} />
        <circle cx="14.5" cy="11" r="1.7" fill={c} />
        <path d="M12 14l-1.2 1.5h2.4L12 14z" fill={c} />
      </g>
    ),
    mush: (
      <g>
        <path d="M6 13c0-3.5 2.7-6 6-6s6 2.5 6 6H6z" fill={c} fillOpacity=".2" stroke={c} strokeWidth="1.6" />
        <rect x="10" y="13" width="4" height="6" rx="1" fill={c} fillOpacity=".4" />
        <circle cx="9" cy="11" r="1" fill={c} />
        <circle cx="14" cy="10" r="1.2" fill={c} />
      </g>
    ),
    star: (
      <g>
        <path d="M12 3l2.5 6 6 .5-4.5 4.2 1.5 6.3L12 17l-5.5 3 1.5-6.3L3.5 9.5l6-.5L12 3z" fill={c} fillOpacity=".25" stroke={c} strokeWidth="1.6" strokeLinejoin="round" />
      </g>
    ),
    moon: (
      <g>
        <path d="M16 12a6 6 0 1 1-6.5-6 5 5 0 0 0 6.5 6z" fill={c} fillOpacity=".25" stroke={c} strokeWidth="1.6" />
      </g>
    ),
    feather: (
      <g>
        <path d="M18 4c-7 0-12 5-12 12l3 3 11-11c1-1 1-3 0-4s-1-0-2 0z" fill={c} fillOpacity=".2" stroke={c} strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M6 19l4-4" stroke={c} strokeWidth="1.6" strokeLinecap="round" />
      </g>
    ),
  }[kind] || null;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      {ic}
    </svg>
  );
}

// ─── Deck builder ──────────────────────────────────────────────
function makeDeck(pairs) {
  const syms = GAME_SYMS.slice(0, pairs);
  const cards = [];
  syms.forEach((s, idx) => {
    cards.push({ uid: `${s.id}-a`, sym: s, idx });
    cards.push({ uid: `${s.id}-b`, sym: s, idx });
  });
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}

// ─── Single card ───────────────────────────────────────────────
function MemCard({ card, flipped, matched, onFlip, size }) {
  const isUp = flipped || matched;
  const [displayUp, setDisplayUp] = useState(isUp);
  const [flipping, setFlipping] = useState(false);

  useEffect(() => {
    if (isUp === displayUp) return;
    setFlipping(true);
    const t = setTimeout(() => {
      setDisplayUp(isUp);
      setFlipping(false);
    }, 180);
    return () => clearTimeout(t);
  }, [isUp, displayUp]);

  return (
    <button
      onClick={() => !flipped && !matched && onFlip(card.uid)}
      style={{
        width: size, height: size, padding: 0, border: "none",
        background: "transparent", cursor: flipped || matched ? "default" : "pointer",
        opacity: matched ? 0.55 : 1,
        transition: "opacity .4s",
      }}
    >
      <div
        style={{
          width: "100%", height: "100%",
          transform: flipping ? "scaleX(0)" : "scaleX(1)",
          transition: "transform .18s ease-out",
          transformOrigin: "center",
        }}
      >
        {displayUp ? (
          <div style={{
            width: "100%", height: "100%", borderRadius: 14,
            background: matched
              ? `linear-gradient(135deg, ${card.sym.c}30, ${card.sym.c}15)`
              : "linear-gradient(180deg,#FCF5E1,#F4E3B8)",
            boxShadow: matched
              ? `inset 0 0 0 2px ${card.sym.c}88, 0 0 0 3px ${card.sym.c}33`
              : "inset 0 0 0 1.5px rgba(168,122,42,.4), 0 3px 0 rgba(120,90,30,.18), 0 6px 12px rgba(80,50,10,.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <GameSym kind={card.sym.id} size={size * 0.55} c={card.sym.c} />
          </div>
        ) : (
          <div style={{
            width: "100%", height: "100%", borderRadius: 14,
            background: "linear-gradient(135deg,#7A4DC2 0%,#4A2D80 60%,#291752 100%)",
            boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,.15), 0 3px 0 #2A1452, 0 8px 14px rgba(43,30,90,.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative", overflow: "hidden",
          }}>
            <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 60 60">
              <circle cx="30" cy="30" r="22" stroke="#FFD269" strokeWidth="1.2" fill="none" opacity=".6" />
              <circle cx="30" cy="30" r="16" stroke="#FFD269" strokeWidth="1.2" fill="none" opacity=".4" strokeDasharray="3 4" />
              <path d="M30 12l4 11 11 1-8 8 3 11-10-6-10 6 3-11-8-8 11-1 4-11z" fill="#FFD269" opacity=".75" />
            </svg>
            <div style={{ position: "absolute", top: 6, right: 8 }}><Sparkle size={10} c="#FFE7B0" /></div>
            <div style={{ position: "absolute", bottom: 6, left: 8 }}><Sparkle size={8} c="#C8A0F0" delay={0.4} /></div>
          </div>
        )}
      </div>
    </button>
  );
}

// ─── Helpers UI ────────────────────────────────────────────────
function fmtTime(s) {
  const m = Math.floor(s / 60);
  const ss = s % 60;
  return `${m}:${ss.toString().padStart(2, "0")}`;
}

function StatPill({ icon, label, value }) {
  const ic = {
    moves: <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M4 7h16M4 12h10M4 17h16" stroke="#7A4DC2" strokeWidth="2.4" strokeLinecap="round" /></svg>,
    time: <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="13" r="8" stroke="#7A4DC2" strokeWidth="2" /><path d="M12 9v4l3 2M9 3h6" stroke="#7A4DC2" strokeWidth="2" strokeLinecap="round" /></svg>,
    pairs: <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="8" height="11" rx="2" stroke="#7A4DC2" strokeWidth="2" /><rect x="13" y="9" width="8" height="11" rx="2" stroke="#7A4DC2" strokeWidth="2" /></svg>,
  }[icon];
  return (
    <div style={{
      flex: 1, padding: "8px 10px", borderRadius: 14,
      background: "rgba(255,255,255,.85)",
      boxShadow: "inset 0 0 0 1.2px rgba(122,77,194,.18)",
      display: "flex", alignItems: "center", gap: 8,
    }}>
      <span style={{
        width: 24, height: 24, borderRadius: 8,
        background: "rgba(122,77,194,.15)",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
      }}>{ic}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 9, fontWeight: 900, letterSpacing: 1, color: "var(--p-ink-soft)", textTransform: "uppercase" }}>{label}</div>
        <div className="t-display" style={{ fontSize: 15, lineHeight: 1 }}>{value}</div>
      </div>
    </div>
  );
}

/**
 * Gwiazda — jedna zlota ikonka (public/star.png) na wszystkie miejsca, w ktorych
 * gra liczy gwiazdki: kafelki poziomu, podium wyniku i nagroda „echa".
 * Wczesniej byly to trzy rozne rysunki SVG i dziecko widzialo trzy rozne
 * gwiazdki za to samo. Niezdobyta to ta sama grafika, tylko wyszarzona — od razu
 * widac, czego brakuje, bo ksztalt sie nie zmienia.
 */
function Gwiazda({ size = 24, zdobyta = true, style }) {
  return (
    <img
      src="/star.png"
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      draggable="false"
      style={{
        display: "block", width: size, height: size, userSelect: "none",
        filter: zdobyta
          ? "drop-shadow(0 3px 4px rgba(180,115,34,.42))"
          : "grayscale(1) brightness(1.3) opacity(.34)",
        transition: "width .3s, height .3s, filter .3s",
        ...style,
      }}
    />
  );
}

function SummaryTile({ n, l }) {
  return (
    <div style={{
      padding: "10px 8px", borderRadius: 14,
      background: "rgba(255,255,255,.78)",
      boxShadow: "inset 0 0 0 1.2px rgba(43,42,74,.06)",
      display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
    }}>
      <div className="t-display" style={{ fontSize: 20, lineHeight: 1 }}>{n}</div>
      <div style={{ fontSize: 10.5, fontWeight: 800, color: "var(--p-ink-soft)", textTransform: "uppercase", letterSpacing: 0.4 }}>{l}</div>
    </div>
  );
}

function RewardItem({ icon, v, label }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, gap: 4 }}>
      {icon}
      <div className="t-display" style={{ fontSize: 18, lineHeight: 1 }}>{v}</div>
      <div style={{ fontSize: 10, fontWeight: 800, color: "var(--p-ink-soft)", letterSpacing: 0.4 }}>{label}</div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────
/**
 * `osadzona` = gra rysuje sie NAD huba `/swiat`, ktory zostaje zamontowany
 * (scena 3D pauzuje w tle zamiast sie wyladowac). Wtedy wyjscie oddaje
 * sterowanie rodzicowi przez `onWyjscie`, zamiast nawigowac gdziekolwiek.
 * Bez tych propsow komponent dziala po staremu, jako wlasny ekran pod
 * `/games/memory` - stare linki i zakladki dalej trafiaja, gdzie trzeba.
 */
export default function MemoryGame({ osadzona = false, onWyjscie }) {
  const navigate = useNavigate();
  const wrocDoHuba = () => (onWyjscie ? onWyjscie() : navigate("/swiat?panel=gry"));
  const [phase, setPhase] = useState("splash"); // intro | playing | done
  const [rewardShown, setRewardShown] = useState(false); // gdy true -> ukryty RewardScreen, pokazany summary
  const [diff, setDiff] = useState("easy");
  const pairs = diff === "easy" ? 6 : 8;
  const cols = 3;

  const [deck, setDeck] = useState(() => makeDeck(pairs));
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState(new Set());
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const tickRef = useRef(null);

  /**
   * Ocena partii liczy sie TU, przed efektami, ktore z niej korzystaja.
   * Wczesniej `stars` stalo nizej niz efekt wyplacajacy monety, a ten mial je
   * w tablicy zaleznosci — tablica jest czytana przy renderze, wiec React
   * dostawal ReferenceError zanim cokolwiek narysowal i gra "wieszala sie"
   * zaraz po wejsciu. Kolejnosc deklaracji jest tu czescia dzialania, nie stylu.
   */
  const idealMoves = pairs;
  const stars = moves <= idealMoves + 2 ? 3 : moves <= idealMoves + 6 ? 2 : 1;

  useEffect(() => {
    setDeck(makeDeck(pairs));
    setFlipped([]); setMatched(new Set()); setMoves(0); setSeconds(0);
  }, [pairs]);

  // `soundFx` nie pobiera juz nic z gory — kazdy ekran zamawia to, czego uzywa.
  useEffect(() => { try { fx.przygotuj("dopamine"); } catch {} }, []);

  /**
   * Monety z minigry TRAFIAJA DO LICZNIKA. Wczesniej ekran wygranej pokazywal
   * "+11", ale nikt tej liczby nigdzie nie zapisywal — dziecko widzialo
   * nagrode, ktora znikala razem z ekranem.
   *
   * Zapis idzie przez `services/monety.js`, czyli tam, gdzie leza monety
   * z zadania czarodzieja: backend nie ma koncowki "dodaj graczowi monety",
   * wiec dorobek z gry trzymamy lokalnie i doliczamy w HUD-dzie do liczby
   * z bazy. Straznik `wyplaconoRef` pilnuje, zeby jedna wygrana zaplacila
   * raz - efekt potrafi odpalic ponownie przy kazdym renderze fazy "done".
   */
  const wyplaconoRef = useRef(false);
  useEffect(() => {
    if (phase !== "done" || wyplaconoRef.current) return;
    wyplaconoRef.current = true;
    dodajMonety(5 + stars * 3, "minigra:memory");
  }, [phase, stars]);

  // Nowa partia = nowa wyplata.
  useEffect(() => { if (phase === "playing") wyplaconoRef.current = false; }, [phase]);

  useEffect(() => {
    if (phase !== "playing") { clearInterval(tickRef.current); return; }
    tickRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(tickRef.current);
  }, [phase]);

  useEffect(() => {
    if (phase === "playing" && matched.size === pairs * 2) {
      try { fx.dopamine(0.5); } catch {}
      setTimeout(() => setPhase("done"), 600);
    }
  }, [matched, pairs, phase]);

  const handleFlip = (uid) => {
    if (flipped.length === 2) return;
    if (flipped.includes(uid)) return;
    try { fx.gentleMagical(0.25); } catch {}
    const next = [...flipped, uid];
    setFlipped(next);
    if (next.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = next.map((u) => deck.find((c) => c.uid === u));
      if (a.sym.id === b.sym.id) {
        setTimeout(() => {
          try { fx.dopamine(0.3); } catch {}
          setMatched((prev) => new Set([...prev, a.uid, b.uid]));
          setFlipped([]);
        }, 450);
      } else {
        setTimeout(() => setFlipped([]), 900);
      }
    }
  };

  const restart = (newDiff) => {
    if (newDiff) setDiff(newDiff);
    else setDeck(makeDeck(pairs));
    setFlipped([]); setMatched(new Set()); setMoves(0); setSeconds(0);
    setRewardShown(false);
    setPhase("playing");
  };

  const progress = matched.size / (pairs * 2);
  const cardSize = useMemo(() => Math.floor((342 - (cols - 1) * 10) / cols), []);

  // Wyjscie z trybu gry. W trakcie rozgrywki najpierw cofa do ekranu startowego
  // (zeby przypadkowe dotkniecie nie kasowalo partii), dopiero z niego do huba -
  // i to od razu do OTWARTEJ zakladki minigier, czyli tam, skad sie tu weszlo.
  // Panel huba czyta sie z adresu (`useHubPanel`), wiec wystarczy query.
  const wyjdz = () => {
    if (phase === "playing") { setPhase("intro"); return; }
    wrocDoHuba();
  };

  return (
    <main className={`gra-root${osadzona ? " gra-osadzona" : ""}`} data-testid="gra-memory">
      <div className="gra-pasek">
        {/* Tytul gry stoi juz w tresci ekranu startowego - powtarzanie go w pasku
            bylo drugim takim samym napisem na jednym ekranie. */}
        {phase === "playing" ? (
          <button type="button" className="gra-ikona" onClick={() => restart()} title="Zagraj od nowa" aria-label="Zagraj od nowa">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 12a8 8 0 1 1 2.3 5.6M4 4v6h6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        ) : null}
        <button
          type="button"
          className="gra-x"
          onClick={wyjdz}
          aria-label={phase === "playing" ? "Przerwij grę" : "Zamknij grę"}
          title={phase === "playing" ? "Przerwij" : "Zamknij"}
        >
          ×
        </button>
      </div>

      <div className="gra-scroll screen-scroll">
        {/* Splash także tutaj — żeby wejście w każdą minigrę wyglądało tak samo.
            Ta gra nie dociąga plików, więc `gotowe` zostaje domyślnie prawdą
            i ekran schodzi po samym minimalnym czasie. */}
        {phase === "splash" ? (
          <SplashGry
            tytul="Pamięć Mędrca"
            podpis="Tasuję symbole…"
            emoji="🧠"
            onKoniec={() => setPhase("intro")}
          />
        ) : null}

        <div style={{ position: "absolute", top: 80, right: -20, animation: "float-slow 6s ease-in-out infinite", zIndex: 0, pointerEvents: "none" }}><Cloud size={100} opacity={0.5} /></div>
        <div style={{ position: "absolute", bottom: 120, left: -30, animation: "float-mid 7s ease-in-out infinite", zIndex: 0, pointerEvents: "none" }}><Cloud size={80} opacity={0.4} /></div>

        {/* INTRO */}
        {phase === "intro" && (
          <div style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column", padding: "10px 24px 24px" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 16, gap: 10 }}>
              <div style={{ position: "relative", width: 150, height: 150 }}>
                <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,210,105,.5), transparent 65%)", filter: "blur(8px)", animation: "float-mid 4s ease-in-out infinite" }} />
                <div style={{
                  position: "absolute", inset: 14, borderRadius: "50%",
                  background: "linear-gradient(135deg,#7A4DC2 0%,#4A2D80 60%,#291752 100%)",
                  boxShadow: "0 6px 0 #2A1452, 0 20px 40px rgba(43,30,90,.5), inset 0 0 0 2px rgba(255,255,255,.12)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  animation: "float-mid 3.5s ease-in-out infinite",
                }}>
                  <svg width="76" height="76" viewBox="0 0 60 60">
                    <circle cx="30" cy="30" r="22" stroke="#FFD269" strokeWidth="1.5" fill="none" opacity=".6" />
                    <circle cx="30" cy="30" r="16" stroke="#FFD269" strokeWidth="1.2" fill="none" opacity=".4" strokeDasharray="3 4" />
                    <path d="M30 12l4 11 11 1-8 8 3 11-10-6-10 6 3-11-8-8 11-1 4-11z" fill="#FFD269" opacity=".85" />
                  </svg>
                </div>
                <div style={{ position: "absolute", top: 8, right: 18 }}><Sparkle size={16} c="#FFD269" /></div>
                <div style={{ position: "absolute", bottom: 24, left: 14 }}><Sparkle size={12} c="#C8A0F0" delay={0.4} /></div>
              </div>

              <h1 className="t-display" style={{ fontSize: 32, margin: 0, textShadow: "0 2px 0 rgba(255,255,255,.4)" }}>Pamięć Mędrca</h1>
              <p className="t-hand" style={{ margin: 0, fontSize: 16, color: "var(--p-ink-soft)", textAlign: "center", maxWidth: 280, lineHeight: 1.4 }}>
                Znajdź pary symboli.
              </p>
            </div>

            <div style={{ marginTop: 22 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[
                  { k: "easy", t: "Łatwy", sub: "6 par · 3×4", stars: 1 },
                  { k: "hard", t: "Średni", sub: "8 par · 4×4", stars: 2 },
                ].map((opt) => {
                  const active = diff === opt.k;
                  return (
                    <button key={opt.k} onClick={() => setDiff(opt.k)} style={{
                      border: "none", cursor: "pointer", textAlign: "left",
                      padding: "12px 14px", borderRadius: 18,
                      background: active ? "rgba(184,134,232,.22)" : "rgba(255,255,255,.78)",
                      boxShadow: active
                        ? "inset 0 0 0 2.5px var(--p-magic-dk), 0 4px 14px rgba(122,77,194,.2)"
                        : "inset 0 0 0 1.4px rgba(43,42,74,.08)",
                    }}>
                      <div className="t-display" style={{ fontSize: 18, lineHeight: 1 }}>{opt.t}</div>
                      <div style={{ fontSize: 12, color: "var(--p-ink-soft)", fontWeight: 700, marginTop: 2 }}>{opt.sub}</div>
                      <div style={{ display: "flex", gap: 2, marginTop: 6 }}>
                        {[1, 2, 3].map((i) => (
                          <Gwiazda key={i} size={13} zdobyta={i <= opt.stars} />
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ marginTop: 14, padding: "12px 14px", borderRadius: 14, background: "linear-gradient(180deg, #FCF5E1 0%, #F4E3B8 100%)", boxShadow: "inset 0 0 0 1.5px rgba(168,122,42,.25)", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ flex: 1 }} />
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12.5, fontWeight: 900, color: "#4A2A0E" }}>
                <Coin size={16} /> 10
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12.5, fontWeight: 900, color: "var(--p-magic-dk)" }}><Gwiazda size={15} /> 1</span>
            </div>

            <div style={{ flex: 1 }} />

            <button onClick={() => restart()} className="hub-btn hub-btn-primary gra-btn-duzy">
              Zagraj
            </button>
          </div>
        )}

        {/* PLAYING — grid */}
        {phase === "playing" && (
          <>
            <div style={{ position: "relative", zIndex: 1, padding: "4px 18px 8px", display: "flex", gap: 10 }}>
              <StatPill icon="moves" label="Ruchy" value={moves} />
              <StatPill icon="time" label="Czas" value={fmtTime(seconds)} />
              <StatPill icon="pairs" label="Pary" value={`${matched.size / 2}/${pairs}`} />
            </div>
            <div style={{ position: "relative", zIndex: 1, padding: "0 18px 4px" }}>
              <div className="prog magic" style={{ height: 6 }}>
                <i style={{ width: `${progress * 100}%` }} />
              </div>
            </div>
            <div style={{
              position: "relative", zIndex: 1, flex: 1,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              padding: "12px 18px 8px",
            }}>
              <div style={{
                display: "grid",
                gridTemplateColumns: `repeat(${cols}, ${cardSize}px)`,
                gridAutoRows: `${cardSize}px`,
                gap: 10,
              }}>
                {deck.map((card) => (
                  <MemCard key={card.uid}
                    card={card}
                    flipped={flipped.includes(card.uid)}
                    matched={matched.has(card.uid)}
                    onFlip={handleFlip}
                    size={cardSize}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {/* DONE */}
        {phase === "done" && (
          <div style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column", padding: "20px 24px 24px" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
              <div className="pop-in" style={{ display: "flex", gap: 8 }}>
                {[1, 2, 3].map((i) => {
                  const earned = i <= stars;
                  return (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transform: `translateY(${i === 2 ? -8 : 0}px)`,
                      transition: "all .3s",
                    }}>
                      <Gwiazda size={earned ? 64 : 46} zdobyta={earned} />
                    </div>
                  );
                })}
              </div>

              <h1 className="t-display" style={{ fontSize: 32, margin: "2px 0 0", textShadow: "0 2px 0 rgba(255,255,255,.4)" }}>
                {stars === 3 ? "Wspaniale!" : stars === 2 ? "Super!" : "Brawo!"}
              </h1>
              <p className="t-hand" style={{ margin: 0, fontSize: 16, color: "var(--p-ink-soft)", textAlign: "center" }}>
                {stars === 3 ? "Twoja pamięć jest jak zwój Mędrca." :
                 stars === 2 ? "Niezła robota — spróbuj jeszcze raz!" :
                              "Każdy ruch to krok do wprawy."}
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, width: "100%", marginTop: 6 }}>
                <SummaryTile n={moves} l="ruchy" />
                <SummaryTile n={fmtTime(seconds)} l="czas" />
                <SummaryTile n={`${matched.size / 2}/${pairs}`} l="pary" />
              </div>

              <div style={{ padding: "14px 14px", width: "100%", marginTop: 6, borderRadius: 14, background: "linear-gradient(180deg, #FCF5E1 0%, #F4E3B8 100%)", boxShadow: "inset 0 0 0 1.5px rgba(168,122,42,.25)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "space-between" }}>
                  <RewardItem icon={<Coin size={26} />} v={5 + stars * 3} label="monet" />
                  <RewardItem icon={<Gwiazda size={26} />} v={stars} label="ech" />
                  <RewardItem icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#7A4DC2" strokeWidth="2" /><circle cx="12" cy="12" r="5" stroke="#7A4DC2" strokeWidth="2" /><circle cx="12" cy="12" r="1.5" fill="#7A4DC2" /></svg>} v="+1" label="Skupienie" />
                </div>
              </div>
            </div>

            <div style={{ flex: 1 }} />

            <div className="hub-actions gra-akcje">
              <button onClick={() => restart()} className="hub-btn hub-btn-ghost">Jeszcze raz</button>
              <button onClick={wrocDoHuba} className="hub-btn hub-btn-primary">Wracam</button>
            </div>
          </div>
        )}
      </div>

      {/* Celebration overlay - pokazuje sie PIERWSZY po wygranej, z huczna animacja.
          Po dismiss user widzi pelen summary screen z gwiazdkami i nagrodami. */}
      {phase === "done" && !rewardShown && (
        <RewardScreen
          eyebrow="✨ PAMIĘĆ MĘDRCA · UKOŃCZONA"
          title={stars === 3 ? "Wspaniale!" : stars === 2 ? "Super!" : "Brawo!"}
          subtitle={
            stars === 3 ? "Twoja pamięć jest jak zwój Mędrca." :
            stars === 2 ? "Niezła robota — spróbuj jeszcze raz!" :
                         "Każdy ruch to krok do wprawy."
          }
          coins={5 + stars * 3}
          note={`${stars} ${stars === 1 ? "echo" : "echa"} · +1 Skupienie`}
          noteStyle="caption"
          ctaLabel="Zobacz wynik ✦"
          onDismiss={() => setRewardShown(true)}
        />
      )}
    </main>
  );
}
