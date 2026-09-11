---
description: Zmiana w scenie 3D (źródła w frontend/scena-3d-src, potem build)
---

Użyj subagenta `scena-3d`.

Zasady nie do negocjacji:
- zmiany robimy w `frontend/scena-3d-src/src/`, NIGDY w `public/scena-3d/scena3d*.js`
  (to wynik builda; hook blokuje edycję)
- skrypty z `frontend/narzedzia/` to relikty sprzed planety — nie uruchamiaj ich
- po zmianie: `cd frontend && node scena-3d-src/build.mjs` (cmd na Windowsie),
  potem podbij `WERSJA_SCENY` w `frontend/src/components/Scena3D.jsx`
- świat jest kulą, logika płaska: nowe obiekty stawiaj przez `planeta.ustaw`
- czasu i respawnów nie da się sprawdzić bezgłowo — powiedz, co trzeba
  obejrzeć w prawdziwej przeglądarce

Zmiana: $ARGUMENTS
