---
name: scena-3d
description: Zmiany w scenie 3D EwolucJA (źródła frontend/scena-3d-src/, build do public/scena-3d/). Użyj ZAWSZE, gdy zadanie dotyczy planety, mapy, znaków, bohatera, animacji, drzew, cieni, kamery, respawnu albo czegokolwiek w scenie. Zna rzut na kulę i pilnuje WERSJA_SCENY.
---

Jesteś odpowiedzialny za scenę 3D w EwolucJA. Zanim cokolwiek zrobisz,
przyjmij te fakty.

## Scena ma źródła — i tylko tam się ją zmienia

`frontend/scena-3d-src/src/` to kod źródłowy (three.js + esbuild).
`frontend/public/scena-3d/scena3d.js` i `scena3d.esm.js` to WYNIK BUILDU —
nie edytuj ich, nie łataj skryptami z `narzedzia/` (to relikty sprzed
2026-09-09; na nowym bundlu nie mają prawa trafić).

Przeczytaj `frontend/scena-3d-src/README.md` — opisuje rzut na kulę,
podział na pliki i kontrakt z Reactem.

Build (w cmd na Windowsie, z katalogu `frontend`):
```
node scena-3d-src/build.mjs
```

## Świat jest kulą, logika jest płaska

Cała logika (ruch, kolizje, ścieżka, znaki, `mapa.json`, edytor) liczy się
na płaskiej mapie (x, z). Kula to prezentacja: `Planeta.ustaw(obj, x, z, h,
obrotY)` stawia obiekt na sferze. Dodając cokolwiek do świata NIE ustawiaj
`position.set(x, 0, z)` — użyj `planeta.ustaw`. Kierunki z kamery przeliczaj
przez `kierunekNaMape()`. Odległości między rzeczami licz w układzie mapy
(`hp`, `znak.mapa`), nie z pozycji 3D.

## Po KAŻDEJ przebudowie

Podbij `WERSJA_SCENY` w `frontend/src/components/Scena3D.jsx`.
Pliki w `public/` nie mają hasha w nazwie — bez tego przeglądarka poda scenę
z cache. **Numer ma tylko rosnąć.** To samo dotyczy `hud.css` (`?v=N` w
`frontend/index.html`).

## Czego NIE da się przetestować bezgłowo

Bezgłowy Chromium ze swiftshaderem zatrzymuje pętlę renderowania po
kilkunastu klatkach. Ruch symuluj ręcznie (`__POC.setInput` + `app.tick()`
w pętli z podmienionym `clock.getDelta`), patrz README. Cykle czasowe,
respawny, kino — tylko w prawdziwej przeglądarce.

Czysta czerń (0,0,0) na zrzucie = martwe płótno WebGL nad hubem (renderer
bez `alpha`).

## Jedyne dozwolone wejście do wnętrza sceny z kodu React

`frontend/src/hub/znakiMapy.js` (`_app.markers`: `id`, `state`, `phase`,
`def.respawn`, `def.respawnPierwszy`, `setVisible`, `mapa`),
`hub/krokiBohatera.js` (`current`, `actions`), `hub/DevRezyserka.jsx`
(`markers[].mapa`). Nowy dostęp dopisuj TAM, nie w komponencie.

Pułapka respawnu: próg powrotu to `powroty ? def.respawn : (def.respawnPierwszy ?? def.respawn)`.

## Na koniec

Powiedz wprost: które pliki źródłowe zmieniłeś, czy przebudowałeś bundle,
na ile podbiłeś `WERSJA_SCENY` i co trzeba sprawdzić ręcznie w przeglądarce.
