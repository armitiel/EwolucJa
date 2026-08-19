/**
 * KacikDobrostanu — mała rzecz do ZROBIENIA obok zegara.
 *
 * Zegar mówi, KTÓRA jest pora dnia. Miejsce obok niego mówi, co z tą porą
 * zrobić dla siebie — i celowo nie jest zawsze tym samym. Przy każdym wejściu
 * losujemy jedną z trzech rzeczy, bo widget, który wygląda identycznie przez
 * trzysta dni, po tygodniu przestaje istnieć dla dziecka.
 *
 * Trzy zasady, które trzymają ten kącik przy życiu:
 *
 * 1. NIC SIĘ NIE LICZY MIĘDZY DNIAMI. Żadnej serii, żadnego procentu. Woda
 *    zeruje się o północy i nie zostawia po sobie oceny. Panel porad ma być
 *    miejscem, do którego wraca się bez długu.
 * 2. KAŻDA RZECZ MIEŚCI SIĘ W POŁOWIE MINUTY. To jest kącik obok zegara,
 *    nie ćwiczenie do odrobienia.
 * 3. TEMPO IDZIE ZA PORĄ DNIA. Rano oddech jest szybszy, wieczorem wolniejszy —
 *    ta sama zasada, co kolory na tarczy.
 *
 * Losowanie nie powtarza ostatniej rzeczy: dwa razy pod rząd ta sama karta
 * czytałaby się jak brak losowania.
 */
import React, { useEffect, useMemo, useRef, useState } from "react";

const KLUCZ_OSTATNI = "ewolucja:kacik:ostatni";
const KLUCZ_WODA = "ewolucja:kacik:woda";

function dzisiaj(d = new Date()) {
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

/* ── Oddech ─────────────────────────────────────────────────────────────── */

// Wdech i wydech tej samej długości: rytmy typu 4-7-8 są dla dorosłych, dziecko
// przy wstrzymywaniu oddechu zaczyna się pilnować, zamiast się uspokajać.
const TEMPO = { rano: 3.4, poludnie: 3.8, popoludnie: 3.8, wieczor: 4.6, noc: 5 };

function Oddech({ pora }) {
  const dlugosc = TEMPO[pora] || 4;
  const [wdech, setWdech] = useState(true);
  const [idzie, setIdzie] = useState(false);

  useEffect(() => {
    if (!idzie) return undefined;
    const t = window.setInterval(() => setWdech((w) => !w), dlugosc * 1000);
    return () => window.clearInterval(t);
  }, [idzie, dlugosc]);

  // Sam start liczy się jako wdech — bez tego pierwsza faza trwała pół sekundy
  // i koło szarpało, zanim dziecko zdążyło nabrać powietrza.
  function start() {
    setWdech(true);
    setIdzie(true);
    window.setTimeout(() => setIdzie(false), dlugosc * 6000);
  }

  return (
    <div className="kacik kacik--oddech">
      <span className="kacik-tytul">Oddech</span>
      <button
        type="button"
        className={`kacik-oddech-kolo${idzie ? (wdech ? " jest-wdech" : " jest-wydech") : ""}`}
        style={{ transitionDuration: `${dlugosc}s` }}
        onClick={start}
        aria-label={idzie ? (wdech ? "Wdech" : "Wydech") : "Zacznij oddychać"}
      >
        <span>{idzie ? (wdech ? "wdech" : "wydech") : "start"}</span>
      </button>
    </div>
  );
}

/* ── Woda ───────────────────────────────────────────────────────────────── */

function Kropla({ pelna }) {
  return (
    <svg viewBox="0 0 24 24" className={`kacik-kropla${pelna ? " jest-pelna" : ""}`} aria-hidden="true">
      <path d="M12 2.5c4.2 5 6.6 8.3 6.6 11.3A6.6 6.6 0 0 1 12 20.4a6.6 6.6 0 0 1-6.6-6.6c0-3 2.4-6.3 6.6-11.3z" />
    </svg>
  );
}

function Woda() {
  const [ile, setIle] = useState(() => {
    try {
      const s = JSON.parse(localStorage.getItem(KLUCZ_WODA) || "null");
      return s && s.dzien === dzisiaj() ? s.ile : 0;
    } catch { return 0; }
  });

  useEffect(() => {
    try { localStorage.setItem(KLUCZ_WODA, JSON.stringify({ dzien: dzisiaj(), ile })); } catch {}
  }, [ile]);

  return (
    <div className="kacik kacik--woda">
      <span className="kacik-tytul">Woda</span>
      {/* Stuknięcie w ostatnią pełną kroplę ją zabiera — pomyłka nie może być
          nie do cofnięcia, bo dziecko klika szybciej, niż czyta. */}
      <div className="kacik-krople">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            type="button"
            className="kacik-kropla-btn"
            onClick={() => setIle(i + 1 === ile ? i : i + 1)}
            aria-label={`${i + 1} szklanka`}
            aria-pressed={i < ile}
          >
            <Kropla pelna={i < ile} />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Ruch ───────────────────────────────────────────────────────────────── */

const RUCHY = {
  rano: ["Przeciągnij się jak kot", "Pięć podskoków", "Obudź ramiona: dziesięć kółek"],
  poludnie: ["Pięć podskoków", "Postój na jednej nodze", "Sięgnij do sufitu i do palców"],
  popoludnie: ["Dziesięć kroków w bok", "Potrząśnij rękami i nogami", "Postój na jednej nodze"],
  wieczor: ["Powolny skłon do palców", "Kółka ramionami, wolno", "Rozluźnij szyję: ucho do barku"],
  noc: ["Powolny skłon do palców", "Rozluźnij szyję: ucho do barku", "Napnij i puść całe ciało"],
};

function Ruch({ pora }) {
  const lista = RUCHY[pora] || RUCHY.poludnie;
  const cwiczenie = useMemo(() => lista[Math.floor(Math.random() * lista.length)], [lista]);
  const [zostalo, setZostalo] = useState(null);
  const tik = useRef(null);

  useEffect(() => () => window.clearInterval(tik.current), []);

  function start() {
    if (zostalo !== null) return;
    setZostalo(20);
    tik.current = window.setInterval(() => {
      setZostalo((z) => {
        if (z <= 1) { window.clearInterval(tik.current); return null; }
        return z - 1;
      });
    }, 1000);
  }

  return (
    <div className="kacik kacik--ruch">
      <span className="kacik-tytul">Rusz się</span>
      <p className="kacik-ruch-tekst">{cwiczenie}</p>
      <button type="button" className="kacik-ruch-btn" onClick={start}>
        {zostalo === null ? "20 sekund" : `${zostalo} s`}
      </button>
    </div>
  );
}

/* ── Losowanie ──────────────────────────────────────────────────────────── */

const RZECZY = ["oddech", "woda", "ruch"];

export default function KacikDobrostanu({ pora = "poludnie" }) {
  const co = useMemo(() => {
    let ostatnia = null;
    try { ostatnia = localStorage.getItem(KLUCZ_OSTATNI); } catch {}
    const pula = RZECZY.filter((r) => r !== ostatnia);
    const wybor = pula[Math.floor(Math.random() * pula.length)];
    try { localStorage.setItem(KLUCZ_OSTATNI, wybor); } catch {}
    return wybor;
  }, []);

  if (co === "woda") return <Woda />;
  if (co === "ruch") return <Ruch pora={pora} />;
  return <Oddech pora={pora} />;
}
