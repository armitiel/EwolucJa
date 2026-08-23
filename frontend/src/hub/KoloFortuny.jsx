/**
 * KoloFortuny — losowanie CECHY przed zadaniem w realu.
 *
 * Wizkor nie wybiera już zadania za dziecko: dziecko kręci kołem, koło
 * wskazuje jedną z pięciu cech awatara (te same, co „Mocne strony"
 * w profilu), a wylosowana cecha wybiera zadanie, które ją ćwiczy
 * (`zadanieDlaCechy` w `zadanieWizkora`). Rozliczenie zadania podbija tę
 * cechę w profilu — pętla jest domknięta: koło → zadanie → silniejsza cecha.
 *
 * DLACZEGO KOŁO. Zadanie „z przydziału" czyta się jak polecenie. To samo
 * zadanie wylosowane własnym zakręceniem jest wyzwaniem — dziecko dostaje
 * moment sprawczości (to JA zakręciłem) i teatr oczekiwania, a lista zadań
 * i tak pozostaje pod kontrolą katalogu.
 *
 * Mechanika uczciwa: cecha losuje się równomiernie w chwili naciśnięcia
 * „Zakręć!", a animacja tylko ją inscenizuje (5 pełnych obrotów + dojazd
 * do wylosowanego pola, z lekkim rozrzutem w obrębie pola).
 *
 * WYSKAKUJE NAD CAŁYM EKRANEM, nie siedzi w szufladzie. Wcześniej koło było
 * wstawione w panel zadania i nie mieściło się w nim: tarcza schodziła pod
 * dolną krawędź, a przycisk trzeba było doscrollować. Koło jest jedną decyzją
 * na jeden moment, więc dostaje własne okno — całe naraz, bez przewijania.
 *
 * Okno idzie przez `createPortal` do `document.body`. To nie jest ozdoba:
 * szuflada huba stoi w kontenerze z własnym `transform`, a taki przodek
 * zamienia `position:fixed` w pozycjonowanie względem siebie — okno zostałoby
 * uwięzione w szufladzie i znowu ucięte.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { zadanieDlaCechy } from "./zadanieWizkora.js";
import { fx } from "../services/soundFx.js";
import "../styles/kolo-fortuny.css";

/**
 * KOLEJNOŚĆ MA ZNACZENIE: pole `i` leży na `i · 72°` od góry, zgodnie
 * z ruchem wskazówek, i musi się zgadzać z narysowaną tarczą
 * (`public/assets/kolo/kolo-tarcza.png`, patrz README obok niej).
 * `kolor` i `ciemny` zostają — czyta je pulpit testowy i profil bohatera.
 */
export const CECHY_KOLA = [
  { id: "ciekawosc",  nazwa: "Ciekawość",  emoji: "🔍", kolor: "#4DABF7", ciemny: "#1c5c93", ikona: "/assets/kolo/ikona-ciekawosc.webp" },
  { id: "tworzenie",  nazwa: "Tworzenie",  emoji: "🎨", kolor: "#B197FC", ciemny: "#4f3a8f", ikona: "/assets/kolo/ikona-tworzenie.webp" },
  { id: "wspolpraca", nazwa: "Współpraca", emoji: "🤝", kolor: "#69DB7C", ciemny: "#2a6b38", ikona: "/assets/kolo/ikona-wspolpraca.webp" },
  { id: "odwaga",     nazwa: "Odwaga",     emoji: "🦁", kolor: "#FF6B6B", ciemny: "#8f2626", ikona: "/assets/kolo/ikona-odwaga.webp" },
  { id: "wytrwalosc", nazwa: "Wytrwałość", emoji: "🧗", kolor: "#FFA94D", ciemny: "#8a5313", ikona: "/assets/kolo/ikona-wytrwalosc.webp" },
];

const WYCINEK = 360 / CECHY_KOLA.length;
const CZAS_KRECENIA = 3400;                  // musi być RÓWNE `transition` w CSS
const KRZYWA = [0.15, 0.65, 0.08, 1];        // to samo `cubic-bezier` co w CSS

/**
 * Kiedy kołek trafi w kolejny klin — czyli kiedy zagrać tyk.
 *
 * Koło jedzie na przejściu CSS, więc nie mamy kąta klatka po klatce. Zamiast
 * przerabiać animację na `requestAnimationFrame` (i tracić płynność GPU),
 * ODWRACAMY krzywą: dla każdej mijanej granicy pól liczymy, w którym ułamku
 * czasu przejście osiągnie ten kąt. Dźwięk sam zwalnia razem z tarczą, bo
 * odstępy między granicami rozciągają się dokładnie tak, jak krzywa.
 *
 * `cubic-bezier` to krzywa parametryczna: X(s) i Y(s) są sześcianami tego
 * samego parametru `s`. Szukamy `s`, dla którego Y(s) = postęp kąta,
 * a potem czytamy X(s) — obie funkcje rosną, więc wystarczy bisekcja.
 */
function czasDlaPostepu(p, [x1, y1, x2, y2] = KRZYWA) {
  const wart = (a, b, s) => 3 * (1 - s) * (1 - s) * s * a + 3 * (1 - s) * s * s * b + s * s * s;
  let lo = 0, hi = 1;
  for (let i = 0; i < 40; i++) {
    const sr = (lo + hi) / 2;
    if (wart(y1, y2, sr) < p) lo = sr; else hi = sr;
  }
  return wart(x1, x2, (lo + hi) / 2);
}

/** Momenty (ms) i siła kolejnych tyknięć na drodze z `od` do `do_`. */
export function rozkladTykow(od, do_, czas = CZAS_KRECENIA) {
  const droga = do_ - od;
  if (droga <= 0) return [];
  const tyki = [];
  // Granica pól mija strzałkę, gdy obrót przechodzi przez `36° + k·72°`.
  const pierwsza = Math.ceil((od - WYCINEK / 2) / WYCINEK) * WYCINEK + WYCINEK / 2;
  for (let kat = pierwsza; kat < do_; kat += WYCINEK) {
    const p = (kat - od) / droga;
    const kiedy = czasDlaPostepu(p) * czas;
    // Siła spada z prędkością: pod koniec tarcza ledwo się toczy.
    tyki.push({ kiedy, sila: Math.max(0.12, 1 - p * p) });
  }
  return tyki;
}

export default function KoloFortuny({ onWybor, onZamknij }) {
  // "gotowe" → "kreci" → "wynik"
  const [faza, setFaza] = useState("gotowe");
  const [wylosowana, setWylosowana] = useState(null);
  const [obrot, setObrot] = useState(0);
  const zegarRef = useRef(0);
  const tykiRef = useRef([]);

  const przerwijTyki = () => {
    tykiRef.current.forEach((t) => window.clearTimeout(t));
    tykiRef.current = [];
  };

  useEffect(() => {
    // Próbka nagrody ma być gotowa ZANIM koło stanie — pobierana w chwili
    // zatrzymania spóźniłaby się o pół sekundy i zabrała cały efekt.
    try { fx.przygotuj?.("dopamine"); } catch {}
    return () => { window.clearTimeout(zegarRef.current); przerwijTyki(); };
  }, []);

  const zakrec = () => {
    if (faza !== "gotowe") return;
    const idx = Math.floor(Math.random() * CECHY_KOLA.length);
    // Dojazd tak, żeby ŚRODEK wylosowanego wycinka stanął pod strzałką
    // (u góry), z rozrzutem ±40% szerokości pola — koniec kręcenia nie
    // wygląda wtedy jak zatrzaśnięcie w idealnym środku.
    const rozrzut = (Math.random() - 0.5) * WYCINEK * 0.8;
    // ŚRODEK pola `idx` leży na `idx · 72°`, więc pod strzałkę stawia go obrót
    // o `−idx · 72°`. Wcześniej dochodziło tu jeszcze pół wycinka i koło
    // zatrzymywało się granicą pól pod strzałką, nie środkiem.
    const cel = 360 * 5 + ((360 - idx * WYCINEK) % 360) + rozrzut;
    setFaza("kreci");
    setObrot(cel);
    setWylosowana(CECHY_KOLA[idx]);

    // Tyki rozstawiamy z góry, na całą drogę — patrz `rozkladTykow`.
    przerwijTyki();
    tykiRef.current = rozkladTykow(obrot, cel).map(({ kiedy, sila }) =>
      window.setTimeout(() => { try { fx.tykKola(sila); } catch {} }, kiedy)
    );
    // Koniec po czasie animacji, nie po `transitionend` — zdarzenie potrafi
    // nie dojść, gdy karta jest akurat zasłonięta, a zawieszony ekran
    // „kręci się" bez końca to najgorszy możliwy stan.
    zegarRef.current = window.setTimeout(() => {
      setFaza("wynik");
      try { fx.dopamine(0.55); } catch {}
    }, CZAS_KRECENIA + 200);
  };

  const zadanie = useMemo(
    () => (wylosowana ? zadanieDlaCechy(wylosowana.id) : null),
    [wylosowana]
  );

  /**
   * KTÓRE NAPISY ODWRÓCIĆ — liczone z POZYCJI NA EKRANIE, nie z numeru pola.
   *
   * Etykieta jedzie razem z tarczą, więc jej kąt na ekranie to `kąt pola
   * + obrót koła`. Odwracamy te, które wylądowały w dolnej połowie (90°–270°),
   * bo tam napis stanąłby na głowie. Stała lista pól nie wystarczała: po
   * zatrzymaniu na Odwadze to właśnie ona wisiała do góry nogami.
   *
   * Liczymy z kąta DOCELOWEGO, więc przełączenie dzieje się w chwili startu —
   * pod rozpędzonym kołem i tak niewidoczne, a po zatrzymaniu wszystko czyta
   * się normalnie.
   */
  const odwrocone = useMemo(() => {
    const norm = ((obrot % 360) + 360) % 360;
    return CECHY_KOLA.map((_, i) => {
      const naEkranie = (i * WYCINEK + norm) % 360;
      return naEkranie > 90 && naEkranie < 270;
    });
  }, [obrot]);

  const okno = (
    <div className="kolo-fortuny" data-testid="kolo-fortuny">
      <div className="kolo-karta">
        {/* Ten sam krzyżyk co w szufladzie i w oknach postaci — jeden guzik
            zamykania w całej grze. */}
        <button
          type="button"
          className="popup-postaci-zamknij kolo-x"
          onClick={onZamknij}
          aria-label="Zamknij"
          title="Zamknij"
        >
          ×
        </button>
        <p className="kolo-nadtytul">Koło Przeznaczenia</p>
        <h2 className={"kolo-tytul" + (faza === "wynik" ? " is-wynik" : "")}>
          {faza === "wynik" && wylosowana ? (
            <>
              <img className="kolo-tytul-ikona" src={wylosowana.ikona} alt="" />
              {`${wylosowana.nazwa}!`}
            </>
          ) : (
            "Co dziś ćwiczysz?"
          )}
        </h2>
        {/* JEDNA LINIJKA, NIE TRZY. Wcześniej stało tu zdanie o mocnych
            stronach bohatera i drugie o tym, że koło wybrało — dziecko i tak
            patrzy na tarczę, a nie czyta akapitu nad nią. Zostaje sama
            informacja, której nie widać nigdzie indziej: nazwa zadania. */}
        <p className="kolo-podpowiedz">
          {faza === "wynik"
            ? (zadanie ? `„${zadanie.tytul}”` : "Wizkor szykuje zadanie…")
            : "Każde pole to inna mocna strona."}
        </p>

        {/* Cztery warstwy na wspólnym płótnie 1024×1024 ze środkiem koła
            w środku pliku — dlatego wystarczy `inset:0` i nic nie trzeba
            pozycjonować. Kręci się TYLKO tarcza; rama, piasta i strzałka
            stoją. Opis warstw: `public/assets/kolo/README.md`. */}
        <div className={"kolo-scena" + (faza === "wynik" ? " is-wynik" : "")}>
          <div
            className="kolo-wirnik"
            style={{ transform: `rotate(${obrot}deg)`, transitionDuration: faza === "gotowe" ? "0s" : undefined }}
          >
            <img className="kolo-tarcza" src="/assets/kolo/kolo-tarcza.png" alt="" />
            {CECHY_KOLA.map((c, i) => (
              <div
                key={c.id}
                className={
                  "kolo-etykieta" +
                  (odwrocone[i] ? " is-odwrocona" : "") +
                  (faza === "wynik" && wylosowana?.id === c.id ? " is-wygrane" : "")
                }
                style={{ "--kat": `${i * WYCINEK}deg` }}
              >
                <span className="kolo-tresc">
                  <img src={c.ikona} alt="" />
                  <b>{c.nazwa}</b>
                </span>
              </div>
            ))}
          </div>
          <img className="kolo-piasta" src="/assets/kolo/kolo-piasta.png" alt="" />
          <img className="kolo-rama" src="/assets/kolo/kolo-rama.png" alt="" />
          <img className="kolo-strzalka" src="/assets/kolo/kolo-wskaznik.png" alt="" />
          {/* Nagroda dla oka: rozbłysk z osi koła i wianek iskier rozlatujący
              się na zewnątrz. Rysowane dopiero po zatrzymaniu, żeby przez całe
              kręcenie nie wisiało dwanaście animowanych elementów. */}
          {faza === "wynik" ? (
            <div className="kolo-fajerwerk" aria-hidden="true">
              <span className="kolo-rozblysk" />
              {Array.from({ length: 12 }, (_, i) => (
                <i key={i} className="kolo-iskra" style={{ "--kat": `${i * 30}deg`, "--zwloka": `${(i % 4) * 40}ms` }} />
              ))}
            </div>
          ) : null}
        </div>

        {faza === "wynik" ? (
          <button
            type="button"
            className="hub-btn hub-btn-primary btn-block kolo-cta"
            onClick={() => onWybor?.(wylosowana.id)}
            data-testid="kolo-cta"
          >
            Biorę zadanie!
          </button>
        ) : (
          <button
            type="button"
            className="hub-btn hub-btn-primary btn-block kolo-cta"
            onClick={zakrec}
            disabled={faza !== "gotowe"}
            data-testid="kolo-zakrec"
          >
            {faza === "kreci" ? "Kręci się…" : "Zakręć!"}
          </button>
        )}
      </div>
    </div>
  );

  // Okno musi wyjść POZA szufladę — patrz nagłówek pliku.
  return typeof document === "undefined" ? okno : createPortal(okno, document.body);
}
