/**
 * useHudSkin — pilnuje, że arkusz HUD-u (`public/scena-3d/hud.css`) jest wpięty.
 *
 * Normalnie NIC nie robi: link stoi w `frontend/index.html`, więc przeglądarka
 * pobiera arkusz razem z dokumentem i HUD od pierwszej klatki ma style.
 * Wstrzykiwanie go stąd (tak było wcześniej) dawało błysk nieostylowanego
 * HUD-u — obrazki w naturalnym rozmiarze, rozjechany układ — i dopiero potem
 * skok na miejsce.
 *
 * Zostaje jako siatka bezpieczeństwa dla widoków montowanych poza tym
 * `index.html` (np. osobne wejście prototypu) i dla sytuacji, gdy ktoś usunie
 * link z HTML-a nie wiedząc, po co tam jest.
 *
 * Dlaczego arkusz w ogóle leży w `public/`, a nie w `src/`: podgląd
 * `/scena-3d/` jest miejscem, w którym HUD się projektuje i stroi, i otwiera
 * się bez builda. Jedna kopia = jedno źródło prawdy dla podglądu i gry.
 */
import { useEffect } from "react";

const SCIEZKA = "/scena-3d/hud.css";
const ID = "scena3d-hud-css";

function jestWpiety() {
  if (document.getElementById(ID)) return true;
  return Array.from(document.styleSheets).some((arkusz) => {
    try { return (arkusz.href || "").includes(SCIEZKA); } catch { return false; }
  }) || !!document.querySelector(`link[rel="stylesheet"][href*="${SCIEZKA}"]`);
}

export default function useHudSkin() {
  useEffect(() => {
    if (jestWpiety()) return undefined;
    const link = document.createElement("link");
    link.id = ID;
    link.rel = "stylesheet";
    link.href = SCIEZKA;
    document.head.appendChild(link);
    // Celowo NIE usuwamy przy odmontowaniu: arkusz jest bezstanowy, a ponowne
    // pobranie przy każdym wejściu do huba dawałoby ten sam błysk.
    return undefined;
  }, []);
}
