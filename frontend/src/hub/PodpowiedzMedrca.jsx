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
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
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

const PodpowiedzMedrca = forwardRef(function PodpowiedzMedrca({ aktywna = true }, ref) {
  const [porada, setPorada] = useState(null);
  const licznik = useRef(0);
  const timerPokazu = useRef(null);
  const timerUkrycia = useRef(null);
  const mowi = useRef(false);
  const wymuszone = useRef(false);

  const powtorz = useCallback((tekst) => {
    if (!tekst || !bgMusic.isEnabled()) return;
    mowi.current = true;
    try {
      Promise.resolve(ttsPlayer.speak(tekst, {
        land: "mentor",
        tone: "calm",
        interrupt: true,
      })).finally(() => { mowi.current = false; });
    } catch {
      mowi.current = false;
    }
  }, []);

  const schowaj = useCallback(() => {
    window.clearTimeout(timerUkrycia.current);
    wymuszone.current = false;
    if (mowi.current) {
      try { ttsPlayer.stop(); } catch {}
      mowi.current = false;
    }
    setPorada(null);
  }, []);

  const pokaz = useCallback((id) => {
    if (!id && licznik.current >= MAX_NA_SESJE) return;
    const wybrana = id
      ? (DANE.porady || []).find((p) => p.id === id) || wybierzPorade()
      : wybierzPorade();
    if (!wybrana) return;
    window.clearTimeout(timerUkrycia.current);
    licznik.current += 1;
    setPorada(wybrana);
    try { localStorage.setItem(KLUCZ_OSTATNIA, String(Date.now())); } catch {}
    powtorz(wybrana.tekst);
    timerUkrycia.current = window.setTimeout(schowaj, WIDOCZNA);
  }, [powtorz, schowaj]);

  const pokazWymuszone = useCallback((id) => {
    wymuszone.current = true;
    pokaz(id);
  }, [pokaz]);

  const reset = useCallback(() => {
    licznik.current = 0;
    wymuszone.current = false;
    try {
      localStorage.removeItem(KLUCZ_OSTATNIA);
      localStorage.removeItem(KLUCZ_HISTORIA);
    } catch {}
    return "Medrzec: limit i historia wyzerowane";
  }, []);

  const lista = useCallback(() => (DANE.porady || []).map((p) => p.id), []);

  // Ten sam sterownik dostają hub, pulpit DEV i konsola. Dzięki temu testowa
  // chmurka nie ma osobnej, łatwej do zerwania ścieżki renderowania.
  useImperativeHandle(ref, () => ({
    pokaz: pokazWymuszone,
    schowaj,
    reset,
    lista,
  }), [lista, pokazWymuszone, reset, schowaj]);

  useEffect(() => {
    if (!aktywna && !wymuszone.current) {
      // Panel przykrył hub: chowamy dymek i wstrzymujemy zegar, ale NIE zerujemy
      // licznika — inaczej wchodzenie w zakładki resetowałoby limit na sesję.
      window.clearTimeout(timerPokazu.current);
      schowaj();
      return undefined;
    }
    // Dopóki karta jest widoczna, nie istnieje drugi zegar wejścia. Wcześniej
    // zmiana `porada` uruchamiała efekt ponownie i w tle zaczynało się kolejne
    // odliczanie — przy szybkich zmianach widoków komunikaty potrafiły się
    // przez to składać lub znikać w złym momencie.
    if (porada) return undefined;
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
      pokaz: pokazWymuszone,
      schowaj,
      reset,
      lista,
    };
    return () => { delete window.medrzec; };
  }, [lista, pokazWymuszone, reset, schowaj]);

  // Lokalny podgląd wizualny: `/swiat?medrzec=woda`. Działa wyłącznie w
  // buildzie developerskim, więc nie tworzy ukrytego wejścia w produkcji.
  useEffect(() => {
    if (!import.meta.env.DEV) return undefined;
    let id = null;
    try { id = new URLSearchParams(window.location.search).get("medrzec"); } catch {}
    if (!id) return undefined;
    const start = Date.now();
    const pokazGdyWidacSwiat = () => {
      if (window.__chmuryWisza && Date.now() - start < 12000) return;
      window.clearInterval(zegar);
      pokazWymuszone(id);
    };
    const zegar = window.setInterval(pokazGdyWidacSwiat, 250);
    pokazGdyWidacSwiat();
    return () => window.clearInterval(zegar);
  }, [pokazWymuszone]);

  useEffect(() => () => {
    window.clearTimeout(timerPokazu.current);
    window.clearTimeout(timerUkrycia.current);
  }, []);

  if (!porada) return null;

  return (
    <div
      className="medrzec-podpowiedz"
      role="status"
      aria-live="polite"
      data-testid="medrzec-podpowiedz"
    >
      {/* JEDEN kształt, nie dwa. Wcześniej był tu `MentorBubble`: głowa w osobnym
          białym kółku z własną obwódką plus dymek obok — czytało się to jak dwa
          obiekty przypadkiem postawione obok siebie. Teraz głowa jest grafiką
          NA karcie i wystaje poza jej krawędź, dokładnie tak jak moneta wystaje
          z kafelka w HUD-zie. Ta sama rodzina kształtów co reszta gry. */}
      <div className="medrzec-karta">
        <img className="medrzec-glowa" src="/wizhead.svg" alt="" aria-hidden="true" draggable="false" />
        <div className="medrzec-tresc">
          <p className="medrzec-tekst">{porada.tekst}</p>
        </div>
        <div className="medrzec-akcje">
          <button type="button" onClick={schowaj} aria-label="Zamknij podpowiedź">
            <span aria-hidden="true">×</span>
          </button>
        </div>
      </div>
      <span className="medrzec-mysl-ogon" aria-hidden="true">
        <span />
        <span />
      </span>
    </div>
  );
});

export default PodpowiedzMedrca;
