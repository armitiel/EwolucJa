/**
 * useHudSkin — dociąga arkusz stylów HUD-u z `public/scena-3d/hud.css`.
 *
 * Dlaczego w runtime, a nie `import "./hud.css"`: podgląd `/scena-3d/` jest
 * miejscem, w którym HUD jest projektowany i strojony (leży w `public/`, więc
 * otwiera się bez builda). Gdyby aplikacja miała własną kopię, każda poprawka
 * w podglądzie wymagałaby ręcznego przepisania i oba HUD-y znów by się
 * rozjechały — dokładnie to stało się między 13 a 14 sierpnia.
 *
 * Ta sama zasada rządzi modułem sceny (`components/Scena3D.jsx`), łącznie
 * z cache-bustingiem: pliki w `public/` nie mają hasha w nazwie, więc po
 * zmianie designu trzeba podbić WERSJA_HUD.
 */
import { useEffect } from "react";

export const WERSJA_HUD = "6";
const ID = "scena3d-hud-css";

export default function useHudSkin() {
  useEffect(() => {
    if (document.getElementById(ID)) return undefined;
    const link = document.createElement("link");
    link.id = ID;
    link.rel = "stylesheet";
    link.href = `/scena-3d/hud.css?wersja=${WERSJA_HUD}`;
    document.head.appendChild(link);
    // Celowo NIE usuwamy przy odmontowaniu: arkusz jest bezstanowy, a ponowne
    // pobranie przy każdym wejściu do huba dawałoby błysk gołego HUD-u.
    return undefined;
  }, []);
}
