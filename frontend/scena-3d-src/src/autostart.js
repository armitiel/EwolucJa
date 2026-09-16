/**
 * autostart.js — wejście dla `scena3d.js`: ta sama biblioteka, ale po
 * wczytaniu od razu stawia scenę w `#scena-3d` (albo w <body>) i wystawia
 * `globalThis.EwolucjaScena3D`. Używa tego `public/scena-3d/index.html`.
 */
import { utworzScena3D, zarejestrujElement, mostIframe, ZDARZENIA } from "./index.js";

zarejestrujElement();
const host = document.getElementById("scena-3d") || document.body;
const q = new URLSearchParams(location.search);
const gotowa = utworzScena3D({
  kontener: host,
  zasoby: globalThis.__SCENA3D_ZASOBY,
  panel: q.get("panel") !== "0",
  spokojnyRuch: q.get("spokojnie") === "1" ? true : undefined,
}).then((s) => {
  mostIframe(s);
  /* HARNESS POKAZUJE ŚWIAT TAKI, JAKI ZAPROJEKTOWANO — a nie taki, jaki widzi
     dziecko w połowie zadania. W grze plac budowy i rąbanie włącza React,
     zależnie od stanu zapisu; tutaj nie ma kto, więc znacznik placu nigdy by
     się nie pokazał i podgląd w edytorze mapy kłamałby o tym, co gdzie stoi.
     `?zadania=0` wyłącza to, gdy ktoś chce czyste ujęcie samego terenu. */
  if (q.get("zadania") !== "0") {
    s.ustawPlacBudowy?.(true, true);
    s.ustawRabanieAktywne?.(true);
  }
  // Szczyt fasoli: przejście do kolejnego świata (`?mapa=<cel>`), jeśli mapa go wskazuje.
  s.on("swiat:dalej", ({ cel }) => {
    if (!cel) return;
    const u = new URL(location.href);
    u.searchParams.set("mapa", cel);
    setTimeout(() => location.assign(u.toString()), 900);
  });
  globalThis.EwolucjaScena3D.scena = s;
  return s;
});
globalThis.EwolucjaScena3D = { gotowa, utworzScena3D, zarejestrujElement, ZDARZENIA };
