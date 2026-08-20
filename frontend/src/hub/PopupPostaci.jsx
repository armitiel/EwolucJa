/**
 * PopupPostaci — okno powitalne, gdy lisek spotyka nową postać.
 *
 * Trzy decyzje, które warto znać przed zmianą:
 *
 * 1. POSTAĆ WYCHODZI Z KARTY, a nie stoi obok niej. Grafika jest przycięta
 *    płaskim dołem (tak przyszedł asset), więc wstęga z imieniem siada
 *    dokładnie na tym cięciu i je zakrywa — czyta się to jako jedną bryłę,
 *    a nie obrazek doklejony nad prostokątem. Ta sama zasada rządzi głową
 *    Mędrca w `PodpowiedzMedrca` i monetą w HUD-zie.
 *
 * 2. KOLORY WYŁĄCZNIE Z TOKENÓW `styles/ewolucja.css`. Fiolet (`--p-magic`)
 *    to w tym projekcie barwa magii i mentorów, papier to karta, zieleń
 *    (`--p-leaf`) to „idź dalej". Nie ma tu ani jednej nowej barwy — okno ma
 *    wyglądać na część gry, a nie na osobny ekran.
 *
 * 3. TO JEST MODAL. Zatrzymuje świat pod spodem (rodzic pauzuje scenę),
 *    łapie Escape i wpuszcza fokus na przycisk. Dziecko ma jedno wyjście
 *    główne (duży zielony przycisk) i jedno awaryjne (krzyżyk).
 *
 * Wyzwalacz „lisek spotkał nową postać" przyjdzie osobno — na razie okno
 * otwiera się z zewnątrz (prop `otwarty`), a do oglądania służy uchwyt
 * `window.popupPostaci.pokaz()` i adres `?popup=1`.
 */
import React, { useEffect, useRef } from "react";
import bgMusic from "../services/bgMusic.js";
import { ttsPlayer } from "../services/ttsPlayer.js";

/** Gwiazdka wektorem, nie plikiem: skaluje się bez rozmycia i bierze kolor z CSS. */
function Gwiazdka({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 1.6l3.1 6.4 7 1-5 4.9 1.2 7-6.3-3.3-6.3 3.3 1.2-7-5-4.9 7-1z" />
    </svg>
  );
}

/**
 * Wyróżnia JEDEN fragment zdania. Świadomie tylko jeden: podkreślenie działa,
 * dopóki jest rzadkie — dwa „ważne" fragmenty w trzech linijkach znaczą tyle,
 * co żaden. Gdy frazy nie ma w tekście, zdanie idzie w całości (bez wyjątku).
 */
function zlozTekst(tekst, wyroznienie) {
  if (!wyroznienie) return tekst;
  const i = tekst.indexOf(wyroznienie);
  if (i < 0) return tekst;
  return [
    tekst.slice(0, i),
    <mark key="wyroznik" className="popup-postaci-wyroznik">{wyroznienie}</mark>,
    tekst.slice(i + wyroznienie.length),
  ];
}

export default function PopupPostaci({
  otwarty = false,
  imie = "Wizkor",
  obrazek = "/wizPop.webp",
  tekst = "",
  wyroznienie = "",
  przycisk = "Poznajmy się!",
  /**
   * Drugi przycisk pojawia się tylko wtedy, gdy okno naprawdę o coś PYTA.
   * Powitanie ma jedno wyjście („poznajmy się") i domknięcie krzyżykiem —
   * dokładanie mu „nie teraz" sugerowałoby wybór tam, gdzie go nie ma.
   * Zaproszenie do minigry ma dwa wyjścia i oba są w porządku.
   */
  przyciskDrugi = null,
  /**
   * Nazwa wariantu wyglądu (`lis` → klasa `popup-postaci--lis`). Postacie mają
   * różne sylwetki: czarodziej jest prawie kwadratowy przez kapelusz, lisek
   * wąski i wysoki przez uszy. Ta sama geometria dla obu dawałaby albo lisa
   * wielkości znaczka, albo czarodzieja poza ekranem.
   */
  wariant = null,
  /**
   * Cokolwiek, co okno ma pokazać MIĘDZY zdaniem postaci a przyciskami —
   * dziś kafelki „poziom + ile można wygrać" w zaproszeniu do minigry.
   *
   * Slot, a nie własne pole „poziomy": okno postaci nie ma nic wspólnego
   * z minigrami i nie powinno o nich wiedzieć. Wie tylko, że pod zdaniem
   * bywa coś do wybrania, zanim padnie odpowiedź.
   */
  dodatek = null,
  glos = null,
  ton = "mystery",
  onAkcja,
  onDrugi,
  onZamknij,
}) {
  const przyciskRef = useRef(null);

  /**
   * Postać MÓWI to, co ma w dymku. Tekst i tak jest na ekranie, więc lektor
   * nie jest jedynym nośnikiem treści — jest dla dzieci, które jeszcze słabo
   * czytają, i dla wrażenia, że ktoś naprawdę się odezwał.
   *
   * Dwie zasady, obie te same co u Mędrca:
   *  • milczy przy wyciszonej grze — przycisk nutki w HUD-zie znaczy dla
   *    dziecka „ciszej w grze", a nie „ciszej, ale głos i tak wejdzie";
   *  • zamknięcie okna ucina mowę w pół słowa. Postać skończyła rozmowę,
   *    więc nie ma prawa mówić dalej zza kadru, gdy lis już biegnie.
   *
   * Muzykę ścisza i przywraca sam `ttsPlayer`.
   */
  useEffect(() => {
    if (!otwarty || !glos || !tekst) return undefined;
    if (!bgMusic.isEnabled()) return undefined;
    try {
      ttsPlayer.speak(tekst, { land: glos, tone: ton, interrupt: true });
    } catch {}
    return () => { try { ttsPlayer.stop(); } catch {} };
  }, [otwarty, glos, ton, tekst]);

  // Escape zamyka — na desktopie to odruch, a okno nie ma nic do stracenia.
  useEffect(() => {
    if (!otwarty) return undefined;
    const naKlawisz = (e) => { if (e.key === "Escape") onZamknij?.(); };
    window.addEventListener("keydown", naKlawisz);
    return () => window.removeEventListener("keydown", naKlawisz);
  }, [otwarty, onZamknij]);

  // Fokus na przycisku, a nie na oknie: czytnik ekranu od razu mówi, co zrobić,
  // a klawiatura ma gdzie stać. `preventScroll`, żeby strona pod spodem nie drgnęła.
  useEffect(() => {
    if (!otwarty) return;
    const t = window.setTimeout(() => {
      try { przyciskRef.current?.focus({ preventScroll: true }); } catch {}
    }, 380);
    return () => window.clearTimeout(t);
  }, [otwarty]);

  if (!otwarty) return null;

  return (
    <div
      className={`popup-postaci${wariant ? ` popup-postaci--${wariant}` : ""}`}
      data-testid="popup-postaci"
    >
      {/* Zasłona jest osobnym elementem, a nie tłem kontenera: dzięki temu
          dotknięcie obok karty zamyka okno, a dotknięcie karty nie. */}
      <div className="popup-postaci-zaslona" onClick={() => onZamknij?.()} aria-hidden="true" />

      <div
        className="popup-postaci-karta"
        role="dialog"
        aria-modal="true"
        aria-labelledby="popup-postaci-imie"
      >
        <img
          className="popup-postaci-bohater"
          src={obrazek}
          alt=""
          aria-hidden="true"
          draggable="false"
        />

        <button
          type="button"
          className="popup-postaci-zamknij"
          onClick={() => onZamknij?.()}
          aria-label="Zamknij"
        >
          {/* Znak „×" pisany LITERĄ, nie rysowany SVG. Guzik ma wyglądać
              dokładnie jak ten w belce szuflady, a tam krzyżyk jest tekstem
              (`font:900 32px`) — kreska SVG w tej samej grubości nominalnej
              wychodzi cieńsza niż glif w wadze 900 i różnicę widać od razu,
              gdy oba stoją w jednej aplikacji. */}
          ×
        </button>

        <p className="popup-postaci-wstega" id="popup-postaci-imie">
          <Gwiazdka className="popup-postaci-gwiazdka" />
          <span>{imie}</span>
          <Gwiazdka className="popup-postaci-gwiazdka" />
        </p>

        <p className="popup-postaci-tekst">{zlozTekst(tekst, wyroznienie)}</p>

        {/* Przerywnik: trzy gwiazdki na cienkiej złotej linii. Oddziela to,
            co postać mówi, od tego, co dziecko ma zrobić. */}
        <p className="popup-postaci-przerywnik" aria-hidden="true">
          <Gwiazdka className="popup-postaci-iskra" />
          <Gwiazdka className="popup-postaci-iskra popup-postaci-iskra--duza" />
          <Gwiazdka className="popup-postaci-iskra" />
        </p>

        {dodatek ? <div className="popup-postaci-dodatek">{dodatek}</div> : null}

        <button
          type="button"
          ref={przyciskRef}
          className="hub-btn hub-btn-primary popup-postaci-akcja"
          onClick={() => (onAkcja || onZamknij)?.()}
          data-testid="popup-postaci-akcja"
        >
          {przycisk}
        </button>

        {/* Odmowa jest lżejsza od zgody i stoi niżej — pierwszy pod kciukiem
            ma być ten przycisk, który prowadzi dalej. Ten sam układ, co
            w oknie „zagadać?": pion, nie dwa wąskie obok siebie. */}
        {przyciskDrugi ? (
          <button
            type="button"
            className="hub-btn hub-btn-ghost popup-postaci-akcja-drugi"
            onClick={() => (onDrugi || onZamknij)?.()}
            data-testid="popup-postaci-drugi"
          >
            {przyciskDrugi}
          </button>
        ) : null}
      </div>
    </div>
  );
}
