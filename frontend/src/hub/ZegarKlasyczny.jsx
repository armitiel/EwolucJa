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
    // Co 10 s, nie co sekundę: sekundnika i tak nie ma, a budzenie Reacta
    // sześćdziesiąt razy na minutę pod otwartym panelem to czysty koszt.
    const t = window.setInterval(() => setTeraz(new Date()), 10000);
    return () => window.clearInterval(t);
  }, []);

  const minuty = teraz.getMinutes();
  const godziny = teraz.getHours() % 12;
  // Wskazówka godzinowa przesuwa się PŁYNNIE razem z minutami - inaczej
  // o 11:59 pokazywałaby równo jedenastą i zegar czytalby sie jak zepsuty.
  const katGodz = godziny * 30 + minuty * 0.5;
  const katMin = minuty * 6;

  return (
    <div className="zegar" style={{ width: size }}>
      <svg viewBox="0 0 100 100" className="zegar-tarcza" role="img"
           aria-label={`Godzina ${teraz.getHours()}:${String(minuty).padStart(2, "0")}`}>
        <circle className="zegar-koperta" cx="50" cy="50" r="47" />
        <circle className="zegar-plyta" cx="50" cy="50" r="41" />
        <Kreski />
        <line className="zegar-wsk zegar-wsk--godz" x1="50" y1="54" x2="50" y2="28"
              transform={`rotate(${katGodz} 50 50)`} />
        <line className="zegar-wsk zegar-wsk--min" x1="50" y1="56" x2="50" y2="18"
              transform={`rotate(${katMin} 50 50)`} />
        <circle className="zegar-os" cx="50" cy="50" r="3.4" />
      </svg>
      {etykieta ? <span className="zegar-etykieta">{etykieta}</span> : null}
    </div>
  );
}
