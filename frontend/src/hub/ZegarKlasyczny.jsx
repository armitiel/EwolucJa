/**
 * ZegarKlasyczny — tarcza ze wskazówkami, nie cyfry.
 *
 * Cyfrowa godzina byłaby tu tylko liczbą do przeczytania. Tarcza pokazuje, GDZIE
 * w dobie jesteśmy: dziecko widzi, że wskazówka doszła do wieczora, zanim
 * przeczyta słowo „wieczór". Przy okazji zegar analogowy to rzecz, której dzieci
 * uczą się w tym wieku — niech ma gdzie na niego patrzeć.
 *
 * Rysowany SVG, nie obrazkiem: skaluje się bez rozmycia i bierze kolory z tokenów.
 */
import React, { useEffect, useState } from "react";
import { PORY } from "./poradaDnia.js";

/** Punkt na tarczy: 0 stopni to godzina 12, zegar liczy w prawo. */
function punkt(kat, r) {
  const rad = ((kat - 90) * Math.PI) / 180;
  return [50 + r * Math.cos(rad), 50 + r * Math.sin(rad)];
}

function luk(odGodz, doGodz, r) {
  const [x1, y1] = punkt(odGodz * 30, r);
  const [x2, y2] = punkt(doGodz * 30, r);
  const duzy = (doGodz - odGodz) * 30 > 180 ? 1 : 0;
  return `M${x1.toFixed(2)} ${y1.toFixed(2)} A${r} ${r} 0 ${duzy} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
}

/**
 * Kolorowy pierscien pór dnia.
 *
 * Tarcza ma dwanascie godzin, a doba dwadziescia cztery — 7 rano i 19 stoja w
 * tym samym miejscu. Zamiast udawac, ze da sie pokazac oba naraz, rysujemy
 * pory TEJ POLOWY DOBY, w ktorej wlasnie jestesmy. Dzieki temu wskazowka
 * godzinowa zawsze stoi na wlasciwym kolorze, a po poludniu pierscien po
 * cichu sie przemalowuje. Dziecko nie musi tego rozumiec — ma widziec, ze
 * "jestesmy w zoltym kawalku, a fiolet dopiero bedzie".
 */
const POLDOBA = {
  am: [["noc", 0, 5], ["rano", 5, 11], ["poludnie", 11, 12]],
  pm: [["poludnie", 0, 3], ["popoludnie", 3, 7], ["wieczor", 7, 10], ["noc", 10, 12]],
};

function PierscienPor({ poPoludniu }) {
  return (
    <g className="zegar-pory">
      {POLDOBA[poPoludniu ? "pm" : "am"].map(([id, od, doo]) => (
        <path key={id} className={`zegar-pora zegar-pora--${id}`} d={luk(od, doo, 29)} />
      ))}
    </g>
  );
}

/** Kreski na obwodzie: co godzinę, grubsze co trzy (12-3-6-9). */
function Kreski() {
  const kreski = [];
  for (let i = 0; i < 12; i += 1) {
    const duza = i % 3 === 0;
    kreski.push(
      <line
        key={i}
        className={duza ? "zegar-kreska zegar-kreska--duza" : "zegar-kreska"}
        x1="50"
        y1={duza ? 9 : 10.5}
        x2="50"
        y2={duza ? 16 : 14.5}
        transform={`rotate(${i * 30} 50 50)`}
      />
    );
  }
  return <g>{kreski}</g>;
}

export default function ZegarKlasyczny({ size = 132, etykieta }) {
  const [teraz, setTeraz] = useState(() => new Date());

  useEffect(() => {
    // Sekundnik wymaga tykania co sekunde. Zegar zyje tylko wtedy, gdy panel
    // jest otwarty (komponent sie odmontowuje razem z nim), wiec to nie jest
    // koszt w tle — a ruch na tarczy jest tu polowa atrakcji.
    const t = window.setInterval(() => setTeraz(new Date()), 1000);
    return () => window.clearInterval(t);
  }, []);

  const minuty = teraz.getMinutes();
  const godziny = teraz.getHours() % 12;
  // Wskazówka godzinowa przesuwa się PŁYNNIE razem z minutami - inaczej
  // o 11:59 pokazywałaby równo jedenastą i zegar czytalby sie jak zepsuty.
  const katGodz = godziny * 30 + minuty * 0.5;
  const katMin = minuty * 6;
  const katSek = teraz.getSeconds() * 6;

  return (
    <div className="zegar" style={{ width: size }}>
      <svg viewBox="0 0 100 100" className="zegar-tarcza" role="img"
           aria-label={`Godzina ${teraz.getHours()}:${String(minuty).padStart(2, "0")}`}>
        <circle className="zegar-koperta" cx="50" cy="50" r="47" />
        <circle className="zegar-plyta" cx="50" cy="50" r="41" />
        <PierscienPor poPoludniu={teraz.getHours() >= 12} />
        <Kreski />
        <line className="zegar-wsk zegar-wsk--godz" x1="50" y1="54" x2="50" y2="28"
              transform={`rotate(${katGodz} 50 50)`} />
        <line className="zegar-wsk zegar-wsk--min" x1="50" y1="56" x2="50" y2="18"
              transform={`rotate(${katMin} 50 50)`} />
        <line className="zegar-wsk zegar-wsk--sek" x1="50" y1="60" x2="50" y2="15"
              transform={`rotate(${katSek} 50 50)`} />
        <circle className="zegar-os" cx="50" cy="50" r="3.4" />
        <circle className="zegar-os-sek" cx="50" cy="50" r="1.5" />
      </svg>
      {etykieta ? <span className="zegar-etykieta">{etykieta}</span> : null}
    </div>
  );
}
