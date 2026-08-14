/**
 * Scena3D — most między aplikacją React i modułem WebGL z `public/scena-3d/`.
 *
 * Moduł NIE jest zależnością npm: leży w `public/`, więc ładujemy go dynamicznie
 * po adresie. Dzięki temu three.js nie wchodzi w build Vite i nic tu nie trzeba
 * przebudowywać po podmianie sceny — wystarczy podbić WERSJA_SCENY (cache-busting,
 * bo pliki w `public/` nie mają hasha w nazwie).
 *
 * Kontrakt:
 *   <Scena3D apiRef={ref} onZdarzenie={fn} onBlad={fn} />
 *   ref.current → pełne API sceny (pauza/wznow/pokazZnak/stan/…) albo null
 *
 * Komponent celowo montuje scenę TYLKO RAZ (deps []). `onZdarzenie` i `onBlad`
 * trzymamy w refach, żeby zmiana funkcji w rodzicu nie przeładowywała WebGL.
 */
import React, { useEffect, useRef } from "react";

export const WERSJA_SCENY = "2";
const ZASOBY = "/scena-3d/assets/";

/**
 * Adres modułu budujemy DOPIERO W RUNTIME z `location.origin`.
 * To nie jest ozdoba: gdy specyfikator jest stałą, którą Vite potrafi wyliczyć
 * przy transformacji (nawet z `@vite-ignore`), dev-server próbuje go rozwiązać
 * jako moduł źródłowy i przerywa błędem „this file is in /public and should not
 * be imported from source code". Wyrażenie liczone w przeglądarce jest dla
 * analizy statycznej nieprzejrzyste, więc import zostaje zwykłym pobraniem pliku.
 * Uwaga: `?v=` to własna konwencja Vite — dlatego cache-busting nazywa się `wersja`.
 */
function adresModulu() {
  const baza = typeof window === "undefined" ? "" : window.location.origin;
  return `${baza}/scena-3d/scena3d.esm.js?wersja=${WERSJA_SCENY}`;
}

/** Czy przeglądarka w ogóle da radę z WebGL-em. Bez tego pokazujemy tło zastępcze. */
export function webglDostepny() {
  try {
    const canvas = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")));
  } catch {
    return false;
  }
}

/**
 * Domyślne przybliżenie kamery. Moduł liczy szerokość kadru w jednostkach świata
 * (8,4 w pionie / 14 w poziomie) i dzieli ją przez `globalThis.SCENA3D_ZOOM`,
 * więc 1 = kadr oryginalny, 1,25 = bohater o ćwierć większy. Wartość czyta przy
 * każdym `resize()`, dlatego da się ją stroić na żywo: ustaw `SCENA3D_ZOOM`
 * w konsoli i zmień rozmiar okna, albo wejdź z `?zoom=1.4` w adresie.
 */
export const ZOOM_DOMYSLNY = 1.25;

/**
 * Cień bohatera — poprawka przeniesiona z podglądu `/scena-3d/index.html`.
 *
 * Domyślnie plamka cienia rysuje się zwykłym alpha-blendem i przy jasnej
 * ziemi wygląda jak naklejona szara łata. MultiplyBlending (THREE = 4) mnoży
 * ją przez kolor podłoża, więc cień przyciemnia teren zamiast go zakrywać,
 * a skala 0,7 ściąga go pod stopy zamiast rozlewać wokół postaci.
 *
 * Robimy to tutaj, a nie w module sceny, bo `scena3d.js` jest gotowym
 * bundlem — grzebanie w nim rozjechałoby się z podglądem przy pierwszym
 * przebudowaniu.
 */
function dopracujCienBohatera(scena, proba = 0) {
  const cien = scena?.heroShadow || globalThis.__POC?.app?.heroShadow;
  if (!cien) {
    // Cień powstaje razem z modelem GLB, czyli po `utworzScena3D`. Czekamy,
    // ale nie w nieskończoność — 12 s wystarczy nawet na wolne łącze.
    if (proba < 120) window.setTimeout(() => dopracujCienBohatera(scena, proba + 1), 100);
    return;
  }
  if (cien.userData?.dopracowany) return;
  try {
    cien.material.blending = 4; // THREE.MultiplyBlending
    cien.material.premultipliedAlpha = true;
    cien.material.map.premultiplyAlpha = true;
    cien.material.map.needsUpdate = true;
    cien.material.needsUpdate = true;
    cien.geometry.scale(0.7, 0.7, 1);
    cien.userData.dopracowany = true;
  } catch (err) {
    console.warn("[Scena3D] nie udało się poprawić cienia bohatera:", err);
  }
}

export default function Scena3D({ apiRef, onZdarzenie, onBlad, spokojnyRuch, zoom = ZOOM_DOMYSLNY, className = "hub-scena" }) {
  const hostRef = useRef(null);
  const zdarzenieRef = useRef(onZdarzenie);
  const bladRef = useRef(onBlad);
  zdarzenieRef.current = onZdarzenie;
  bladRef.current = onBlad;

  useEffect(() => {
    let zywe = true;
    let scena = null;

    (async () => {
      if (!webglDostepny()) {
        bladRef.current?.(new Error("Brak WebGL"));
        return;
      }
      try {
        // Zoom ustawiamy PRZED utworzeniem sceny — pierwszy `resize()` już go użyje.
        const zAdresu = Number(new URLSearchParams(window.location.search).get("zoom"));
        globalThis.SCENA3D_ZOOM = zAdresu > 0 ? zAdresu : zoom;

        const adres = adresModulu();
        const modul = await import(/* @vite-ignore */ adres);
        if (!zywe || !hostRef.current) return;

        scena = await modul.utworzScena3D({
          kontener: hostRef.current,
          zasoby: ZASOBY,
          panel: false,           // bez przycisków deweloperskich — widok dziecka
          spokojnyRuch,
        });

        if (!zywe) {
          scena.zniszcz();
          return;
        }
        if (scena.blad) throw new Error(scena.blad);

        // Jedno wejście na wszystkie zdarzenia modułu — mapowanie zostaje w hubie.
        for (const nazwa of modul.ZDARZENIA || []) {
          scena.on(nazwa, (dane) => zdarzenieRef.current?.(nazwa, dane || {}));
        }
        if (apiRef) apiRef.current = scena;
        dopracujCienBohatera(scena);
      } catch (err) {
        console.warn("[Scena3D] nie udało się uruchomić sceny:", err);
        bladRef.current?.(err);
      }
    })();

    return () => {
      zywe = false;
      if (apiRef && apiRef.current === scena) apiRef.current = null;
      try { scena?.zniszcz(); } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={hostRef} className={className} aria-hidden="true" />;
}
