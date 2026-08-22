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
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { zadanieDlaCechy } from "./zadanieWizkora.js";
import "../styles/kolo-fortuny.css";

export const CECHY_KOLA = [
  { id: "ciekawosc", nazwa: "Ciekawość", emoji: "🔍", kolor: "#4DABF7", ciemny: "#1c5c93" },
  { id: "tworzenie", nazwa: "Tworzenie", emoji: "🎨", kolor: "#B197FC", ciemny: "#4f3a8f" },
  { id: "wspolpraca", nazwa: "Współpraca", emoji: "🤝", kolor: "#69DB7C", ciemny: "#2a6b38" },
  { id: "odwaga", nazwa: "Odwaga", emoji: "🦁", kolor: "#FF6B6B", ciemny: "#8f2626" },
  { id: "wytrwalosc", nazwa: "Wytrwałość", emoji: "🧗", kolor: "#FFA94D", ciemny: "#8a5313" },
];

const R = 150;            // promień koła w jednostkach viewBoxu
const WYCINEK = 360 / CECHY_KOLA.length;
/** Punkt na okręgu; kąt w stopniach, 0 = góra, rośnie zgodnie z zegarem. */
const pkt = (kat, r = R) => {
  const rad = (kat * Math.PI) / 180;
  return `${Math.sin(rad) * r} ${-Math.cos(rad) * r}`;
};

export default function KoloFortuny({ onWybor, onZamknij }) {
  // "gotowe" → "kreci" → "wynik"
  const [faza, setFaza] = useState("gotowe");
  const [wylosowana, setWylosowana] = useState(null);
  const [obrot, setObrot] = useState(0);
  const zegarRef = useRef(0);

  useEffect(() => () => window.clearTimeout(zegarRef.current), []);

  const zakrec = () => {
    if (faza !== "gotowe") return;
    const idx = Math.floor(Math.random() * CECHY_KOLA.length);
    // Dojazd tak, żeby ŚRODEK wylosowanego wycinka stanął pod strzałką
    // (u góry), z rozrzutem ±40% szerokości pola — koniec kręcenia nie
    // wygląda wtedy jak zatrzaśnięcie w idealnym środku.
    const rozrzut = (Math.random() - 0.5) * WYCINEK * 0.8;
    const cel = 360 * 5 + ((360 - (idx * WYCINEK + WYCINEK / 2)) % 360) + rozrzut;
    setFaza("kreci");
    setObrot(cel);
    setWylosowana(CECHY_KOLA[idx]);
    // Koniec po czasie animacji, nie po `transitionend` — zdarzenie potrafi
    // nie dojść, gdy karta jest akurat zasłonięta, a zawieszony ekran
    // „kręci się" bez końca to najgorszy możliwy stan.
    zegarRef.current = window.setTimeout(() => setFaza("wynik"), 3600);
  };

  const zadanie = useMemo(
    () => (wylosowana ? zadanieDlaCechy(wylosowana.id) : null),
    [wylosowana]
  );

  return (
    <div className="kolo-fortuny" data-testid="kolo-fortuny">
      <div className="kolo-karta">
        <button type="button" className="kolo-x" onClick={onZamknij} aria-label="Zamknij" title="Zamknij">
          ×
        </button>
        <p className="kolo-nadtytul">✦ KOŁO PRZEZNACZENIA</p>
        <h2 className="kolo-tytul">
          {faza === "wynik" && wylosowana ? `${wylosowana.emoji} ${wylosowana.nazwa}!` : "Co dziś ćwiczysz?"}
        </h2>
        <p className="kolo-podpowiedz">
          {faza === "wynik" && wylosowana
            ? `Koło wybrało. ${zadanie ? `Zadanie: „${zadanie.tytul}”.` : "Wizkor szykuje zadanie."}`
            : "Zakręć kołem — każde pole to jedna\nz mocnych stron twojego bohatera."}
        </p>

        <div className="kolo-scena">
          {/* Strzałka — stoi nieruchomo, koło kręci się pod nią. */}
          <svg className="kolo-strzalka" viewBox="0 0 40 34" aria-hidden="true">
            <path d="M 20 34 L 4 6 Q 20 -6 36 6 Z" fill="#e6a832" stroke="#a2621c" strokeWidth="3" strokeLinejoin="round" />
          </svg>
          <svg className="kolo-tarcza" viewBox="-170 -170 340 340" aria-hidden="true">
            <g
              className="kolo-wirnik"
              style={{ transform: `rotate(${obrot}deg)`, transitionDuration: faza === "gotowe" ? "0s" : undefined }}
            >
              {CECHY_KOLA.map((c, i) => {
                const a0 = i * WYCINEK - WYCINEK / 2;
                const a1 = a0 + WYCINEK;
                const kat = i * WYCINEK;
                const wygrane = faza === "wynik" && wylosowana?.id === c.id;
                return (
                  <g key={c.id} className={wygrane ? "kolo-pole is-wygrane" : "kolo-pole"}>
                    <path
                      d={`M 0 0 L ${pkt(a0)} A ${R} ${R} 0 0 1 ${pkt(a1)} Z`}
                      fill={c.kolor}
                      stroke="#fff8dd"
                      strokeWidth="4"
                    />
                    <text
                      className="kolo-emoji"
                      transform={`rotate(${kat}) translate(0 ${-R * 0.66})`}
                      textAnchor="middle"
                    >
                      {c.emoji}
                    </text>
                    <text
                      className="kolo-napis"
                      transform={`rotate(${kat}) translate(0 ${-R * 0.4})`}
                      textAnchor="middle"
                      fill={c.ciemny}
                    >
                      {c.nazwa}
                    </text>
                  </g>
                );
              })}
              <circle r={R * 0.16} fill="#fff8dd" stroke="#e6a832" strokeWidth="5" />
              <text className="kolo-gwiazdka" textAnchor="middle" dy="9">✦</text>
            </g>
            <circle r={R} fill="none" stroke="#a2621c" strokeWidth="6" />
          </svg>
        </div>

        {faza === "wynik" ? (
          <button
            type="button"
            className="kolo-cta"
            onClick={() => onWybor?.(wylosowana.id)}
            data-testid="kolo-cta"
          >
            Biorę zadanie! ✦
          </button>
        ) : (
          <button
            type="button"
            className="kolo-cta"
            onClick={zakrec}
            disabled={faza !== "gotowe"}
            data-testid="kolo-zakrec"
          >
            {faza === "kreci" ? "Kręci się…" : "Zakręć! ✦"}
          </button>
        )}
      </div>
    </div>
  );
}
