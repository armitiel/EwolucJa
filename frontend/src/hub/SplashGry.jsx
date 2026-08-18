/**
 * SplashGry — ekran, który stoi między dotknięciem kafelka a grą.
 *
 * Po co on jest: minigry wczytują własną grafikę (Sekret pod puchem prawie
 * megabajt) i bez tego ekranu dziecko patrzy przez ten czas na puste tło,
 * a to wygląda jak zawieszona aplikacja. Splash daje temu oczekiwaniu twarz.
 *
 * Dwie zasady, które trzymają go przy życiu:
 *
 * 1. NIE MIGA. `minCzas` trzyma go na ekranie chwilę nawet wtedy, gdy grafiki
 *    są już w cache i wczytują się w 30 ms. Splash, który mignął i zniknął,
 *    czyta się jak usterka, nie jak wejście do gry.
 *
 * 2. NIE KŁAMIE. Znika dopiero, gdy `gotowe` jest prawdą — czyli gdy gra
 *    naprawdę ma czym rysować. Gra bez `gotowe` (jak Pamięć Mędrca, która nie
 *    dociąga plików) po prostu zostawia domyślne `true` i splash odlicza sam.
 *
 * Użycie:
 *   <SplashGry tytul="Sekret pod puchem" obrazy={[...]} gotowe={zaladowane}
 *              onKoniec={() => setFaza("intro")} />
 */
import React, { useEffect, useRef, useState } from "react";

export default function SplashGry({
  tytul,
  podpis = "Chwileczkę…",
  obrazy = [],
  emoji = null,
  gotowe = true,
  minCzas = 1100,
  onKoniec,
}) {
  const start = useRef(Date.now());
  const [minieloMin, setMinieloMin] = useState(false);

  useEffect(() => {
    const zostalo = Math.max(0, minCzas - (Date.now() - start.current));
    const t = window.setTimeout(() => setMinieloMin(true), zostalo);
    return () => window.clearTimeout(t);
  }, [minCzas]);

  useEffect(() => {
    if (minieloMin && gotowe) onKoniec?.();
  }, [minieloMin, gotowe, onKoniec]);

  return (
    <div className="splash-gry" data-testid="splash-gry">
      <div className="splash-gry-art" aria-hidden="true">
        {obrazy.length
          ? obrazy.map((src, i) => <img key={src + i} src={src} alt="" style={{ "--nr": i }} />)
          : <span className="splash-gry-emoji" style={{ "--nr": 0 }}>{emoji || "✦"}</span>}
      </div>
      <h1>{tytul}</h1>
      <p>{podpis}</p>
      {/* Pasek zamiast samego napisu: dwa ekrany z tym samym tekstem i bez
          ruchu czytaja sie jak zawieszona aplikacja. */}
      <span className="splash-gry-pasek" aria-hidden="true"><i /></span>
    </div>
  );
}
