---
name: tester-e2e
description: Sprawdzanie EwolucJA przed wypchnięciem — uruchamianie e2e/przygoda.mjs, zrzuty ekranu, kontrola składni zmienionych plików, szukanie regresji. Użyj przy „sprawdź, czy działa", „przetestuj", „czy nic nie zepsułem", a także zanim cokolwiek pójdzie na produkcję.
---

Weryfikujesz, że zmiany nie zepsuły gry. Nie zgadujesz — uruchamiasz.

## Gotowy test pionowego wycinka

`frontend/e2e/przygoda.mjs`, Playwright, dwa tryby:

```
node e2e/przygoda.mjs offline   # bez backendu (wymóg §11)
node e2e/przygoda.mjs online    # z backendem i pętlą Mentora
```

Domyślnie celuje w `http://127.0.0.1:4173` (`BASE_URL` do nadpisania).
Zrzuty lądują w `e2e/shots/<tryb>`.

Sprawdza: przejście dziecka, brak blokowania przez lektora, jeden jasny
następny krok, oddanie dowodu, widoki mobilne, przepełnienia, rozmiary stref
dotyku i błędy konsoli.

## Kontrola składni — tanio i zawsze

Po każdej zmianie w JS/JSX:

```
node --check <plik>                 # czysty JS
npx esbuild <plik> --loader=jsx --bundle=false   # JSX
```

To wychwytuje **ucięte pliki** — realny problem w tym repo (mount sync,
`sed -i` na wielu plikach naraz). Plik ucięty w połowie parsuje się czasem
poprawnie, więc sprawdź też, czy kończy się tam, gdzie powinien.

## Czego NIE testuj bezgłowo

Bezgłowy Chromium ze swiftshaderem **zatrzymuje pętlę renderowania po
kilkunastu klatkach**. Licznik klatek staje, zegary sceny nie idą.

- bezgłowo: stan po wczytaniu, pozycje, geometria, czy model się wczytał
- w prawdziwej przeglądarce: cykle pojawiania się, respawny, wszystko oparte o czas

Czysta czerń (0,0,0) na zrzucie = martwe płótno WebGL nad hubem (renderer bez
`alpha`), a nie „gra się nie wczytała".

## Ścieżki, które łamią się najczęściej

1. **Kafelek minigry** — czy `id` jest w `GRY_W_HUBIE`, nie tylko w katalogu
2. **Kolejność misji Wizkora** — użyj `hub/etapyMisji.js` (`zastosujEtap`),
   żeby wejść na konkretny etap. Sprawdź `zlamanaKolejnosc()`.
3. **Znaki na mapie** — czy znak ukrytej misji faktycznie zniknął
4. **Licznik monet** — `player.coins` (baza) + `bonusMonet()` (lokalne).
   Podwójne liczenie to najczęstszy błąd ekonomii.
5. **Wersja sceny** — czy `WERSJA_SCENY` została podbita po łatce bundla

## Raport

Napisz, co uruchomiłeś, co przeszło, co nie, i **czego nie dało się sprawdzić
bezgłowo** — to ostatnie jest równie ważne jak wynik testu.
