/**
 * SplashGry — sterownik gotowości wspólnego ekranu startowego gry.
 *
 * Minigry wczytują własną grafikę, ale nie pokazujemy już osobnego splasha.
 * Ten komponent pilnuje minimalnego czasu oraz realnej gotowości zasobów,
 * a dziecko cały czas widzi TEN SAM ekran: najpierw z loaderem, potem z CTA.
 *
 * Dwie zasady, które trzymają go przy życiu:
 *
 * 1. NIE MIGA. `minCzas` trzyma loader chwilę nawet wtedy, gdy grafiki są już
 *    w cache i wczytują się w 30 ms.
 *
 * 2. NIE KŁAMIE. CTA pojawia się dopiero, gdy `gotowe` jest prawdą — czyli
 *    gdy gra naprawdę ma czym rysować.
 *
 * `children` jest funkcją i dostaje `{ laduje }`. Dzięki temu sterownik nie ma
 * własnego UI i nie tworzy drugiego ekranu.
 */
import React, { useEffect, useRef, useState } from "react";

export default function SplashGry({
  gotowe = true,
  minCzas = 1100,
  onKoniec,
  children,
}) {
  const start = useRef(Date.now());
  const zakonczono = useRef(false);
  const [minieloMin, setMinieloMin] = useState(false);

  useEffect(() => {
    const zostalo = Math.max(0, minCzas - (Date.now() - start.current));
    const t = window.setTimeout(() => setMinieloMin(true), zostalo);
    return () => window.clearTimeout(t);
  }, [minCzas]);

  useEffect(() => {
    if (!minieloMin || !gotowe || zakonczono.current) return;
    zakonczono.current = true;
    onKoniec?.();
  }, [minieloMin, gotowe, onKoniec]);

  const laduje = !minieloMin || !gotowe;
  return typeof children === "function" ? children({ laduje }) : null;
}
