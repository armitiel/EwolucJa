/**
 * PodpowiedzMedrca — Mędrzec wychyla się czasem w hubie z jedną myślą o ciele.
 *
 * Trzy decyzje, które warto znać przed zmianą:
 *
 * 1. RZADKO I NIGDY W DRODZE. Pokazuje się dopiero po chwili spokojnej gry
 *    (`PIERWSZA`), potem co kilka minut i najwyżej `MAX_NA_SESJE` razy. Znika
 *    sama albo po dotknięciu. To ma być mrugnięcie okiem, nie przypomnienie
 *    z aplikacji zdrowotnej — dziecko nie zrobi nic „źle", ignorując ją.
 *
 * 2. NIE PRZERYWA. Chowa się, gdy otwarty jest panel albo zwój, i nie wchodzi,
 *    zanim rozsuną się chmury. Nie łapie też dotknięć poza własnym dymkiem,
 *    więc nie blokuje chodzenia po świecie.
 *
 * 3. GŁOS MENTORA, NIE NARRATORA. `land: "mentor"` to w backendzie osobny
 *    klucz (`ELEVENLABS_MENTOR_VOICE_ID`) — ten sam, którym mówi Mentor
 *    w panelu opiekuna. Mędrzec jest po stronie dorosłego, więc brzmi jak on,
 *    a nie jak narrator prowadzący fabułę.
 *
 * Mówi tylko wtedy, gdy muzyka jest włączona: przycisk w HUD-zie jest dla
 * dziecka „ciszej w grze", a nie „ciszej, ale głos i tak wejdzie".
 */
import React, { useCallback, useEffect, useRef, useState } from "react";
import bgMusic from "../services/bgMusic.js";
import { ttsPlayer } from "../services/ttsPlayer.js";
import DANE from "../hub/data/porady-zdrowia.v1.json";

const PIERWSZA = 75_000;        // ile spokojnej gry przed pierwszym wejściem
const KOLEJNA = 300_000;        // odstęp między kolejnymi
const WIDOCZNA = 11_000;        // jak długo wisi, jeśli nikt jej nie dotknie
const MAX_NA_SESJE = 3;
const KLUCZ_OSTATNIA = "ewolucja.medrzec.ostatnia";   // znacznik czasu
const KLUCZ_HISTORIA = "ewolucja.medrzec.historia";   // ostatnio pokazane id

/** Losowa porada, ale nie ta sama co ostatnio — powtórka psuje wrażenie uwagi. */
function wybierzPorade() {
  const porady = DANE.porady || [];
  if (!porady.length) return null;
  let historia = [];
  try { historia = JSON.parse(localStorage.getItem(KLUCZ_HISTORIA) || "[]"); } catch {}
  const swieze = porady.filter((p) => !historia.includes(p.id));
  const pula = swieze.length ? swieze : porady;
  const wybrana = pula[Math.floor(Math.random() * pula.length)];
  try {
    localStorage.setItem(KLUCZ_HISTORIA, JSON.stringify([wybrana.id, ...historia].slice(0, 6)));
  } catch {}
  return wybrana;
}

export default function PodpowiedzMedrca({ aktywna = true }) {
  const [porada, setPorada] = useState(null);
  const licznik = useRef(0);
  const timerPokazu = useRef(null);
  const timerUkrycia = useRef(null);

  const schowaj = useCallback(() => {
    window.clearTimeout(timerUkrycia.current);
    setPorada(null);
  }, []);

  const pokaz = useCallback((id) => {
    const wybrana = id
      ? (DANE.porady || []).find((p) => p.id === id) || wybierzPorade()
      : wybierzPorade();
    if (!wybrana) return;
    licznik.current += 1;
    setPorada(wybrana);
    try { localStorage.setItem(KLUCZ_OSTATNIA, String(Date.now())); } catch {}
    if (bgMusic.isEnabled()) {
      // `interrupt: false` — jeśli akurat mówi narrator, Mędrzec czeka na swoją
      // kolej zamiast wchodzić mu w słowo.
      try { ttsPlayer.speak(wybrana.tekst, { land: "mentor", tone: "calm", interrupt: false }); } catch {}
    }
    timerUkrycia.current = window.setTimeout(() => setPorada(null), WIDOCZNA);
  }, []);

  useEffect(() => {
    if (!aktywna) {
      // Panel przykrył hub: chowamy dymek i wstrzymujemy zegar, ale NIE zerujemy
      // licznika — inaczej wchodzenie w zakładki resetowałoby limit na sesję.
      window.clearTimeout(timerPokazu.current);
      schowaj();
      return undefined;
    }
    if (licznik.current >= MAX_NA_SESJE) return undefined;

    let ostatnia = 0;
    try { ostatnia = Number(localStorage.getItem(KLUCZ_OSTATNIA)) || 0; } catch {}
    const odOstatniej = Date.now() - ostatnia;
    // Pierwsze wejście w tej sesji liczymy od zera, ale jeśli Mędrzec odezwał się
    // niedawno (np. dziecko wróciło do huba po minucie), czekamy do pełnej przerwy.
    const pierwsze = licznik.current === 0;
    const zwloka = pierwsze
      ? Math.max(PIERWSZA, ostatnia ? KOLEJNA - odOstatniej : 0)
      : KOLEJNA;

    timerPokazu.current = window.setTimeout(() => pokaz(), Math.max(1000, zwloka));
    return () => window.clearTimeout(timerPokazu.current);
  }, [aktywna, porada, pokaz, schowaj]);

  // Uchwyt do konsoli: czekanie 75 s przy kazdym sprawdzeniu tekstu jest nie do
  // zniesienia, a limit na sesje sprawia, ze po trzech probach nic juz nie wchodzi.
  //   window.medrzec.pokaz()        - wejscie teraz, z losowa porada
  //   window.medrzec.pokaz('woda')  - konkretna porada po id z JSON-a
  //   window.medrzec.schowaj()      - zdejmij dymek
  //   window.medrzec.reset()        - wyzeruj limit sesji i historie powtorek
  //   window.medrzec.lista()        - id wszystkich porad
  useEffect(() => {
    window.medrzec = {
      pokaz: (id) => pokaz(id),
      schowaj,
      reset: () => {
        licznik.current = 0;
        try {
          localStorage.removeItem(KLUCZ_OSTATNIA);
          localStorage.removeItem(KLUCZ_HISTORIA);
        } catch {}
        return "Medrzec: limit i historia wyzerowane";
      },
      lista: () => (DANE.porady || []).map((p) => p.id),
    };
    return () => { delete window.medrzec; };
  }, [pokaz, schowaj]);

  useEffect(() => () => {
    window.clearTimeout(timerPokazu.current);
    window.clearTimeout(timerUkrycia.current);
  }, []);

  if (!porada) return null;

  return (
    <div
      className="medrzec-podpowiedz"
      role="status"
      onClick={schowaj}
      data-testid="medrzec-podpowiedz"
    >
      {/* JEDEN kształt, nie dwa. Wcześniej był tu `MentorBubble`: głowa w osobnym
          białym kółku z własną obwódką plus dymek obok — czytało się to jak dwa
          obiekty przypadkiem postawione obok siebie. Teraz głowa jest grafiką
          NA karcie i wystaje poza jej krawędź, dokładnie tak jak moneta wystaje
          z kafelka w HUD-zie. Ta sama rodzina kształtów co reszta gry. */}
      <div className="medrzec-karta">
        <img className="medrzec-glowa" src="/wizhead.svg" alt="" aria-hidden="true" draggable="false" />
        <p className="medrzec-tekst">{porada.tekst}</p>
      </div>
    </div>
  );
}
