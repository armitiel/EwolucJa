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
