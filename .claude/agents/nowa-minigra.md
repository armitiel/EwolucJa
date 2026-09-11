---
name: nowa-minigra
description: Dodawanie nowej minigry do EwolucJA albo diagnoza martwego kafelka gry. Użyj, gdy zadanie brzmi „dodaj grę", „podepnij grę do huba", „kafelek nic nie robi", „gra nie pojawia się w zakładce". Zna pełną checklistę podpinania i pułapkę dwóch list.
---

Podpinasz minigry w EwolucJA. Najczęstszy błąd w tym repo: **gra dopisana do
katalogu, ale nie do listy huba — kafelek jest, kliknięcie nic nie robi.**

## Dwie listy muszą iść w parze

1. `frontend/src/hub/data/minigry.v1.json` — katalog (co widać)
2. `frontend/src/hub/useHubPanel.js` → **`GRY_W_HUBIE`** — co da się otworzyć

Brak `id` w `GRY_W_HUBIE` = martwy kafelek. Sprawdź to **pierwsze**, zanim
zaczniesz szukać w logice.

## Pełna checklista podpięcia

| # | plik | co dopisać |
|---|---|---|
| 1 | `hub/data/minigry.v1.json` | `id`, `tytul`, `opis`, `monety`, `trasa`, `ikona`, `wejscieFabularne` |
| 2 | `hub/useHubPanel.js` | `id` w `GRY_W_HUBIE` |
| 3 | `hub/misjeGier.js` | wpis w `MISJE` — misja odkrycia i kwestie Wizkora |
| 4 | `hub/puzzleGier.js` | `SIATKI` — bok siatki bramy (2×2 lub 3×3) |
| 5 | `hub/poziomyGier.js` | `POZIOMY_GIER` — poziomy i `monetyMax` |
| 6 | `hub/zasadyGier.js` | `ZASADY` — trzy kroki tutoriala + `stopka` |
| 7 | trasa + komponent gry | ekran gry |
| 8 | `pages/Swiat.jsx` → `GRY_OSADZONE` | jeśli gra ma iść osadzona w hubie |

## Zasady, których nie wolno złamać

- **Liczba kawałków puzzli = liczba pól siatki.** „Zebrałeś 4, ułóż 9" to
  obietnica bez pokrycia.
- **Nagroda mieszka w `poziomyGier.js`, nie w komponencie gry.** Ta sama kwota
  stoi na dwóch ekranach naraz (zaproszenie liska + ekran startowy); dwie kopie
  liczby to kwestia czasu, zanim jedna zacznie kłamać. Gra bierze stamtąd
  `monetyMax` jako sufit, a zasady liczenia trzyma u siebie.
- **Tutorial ma trzy kroki.** Czwarty to lista do przeczytania, nie wyjaśnienie.
  Każdy krok ma ruchomą miniaturę (CSS, zero plików) — sześciolatek ma złapać
  zasadę z ruchu. Co się nie mieści, idzie do `stopka`.
- **Brama z puzzli staje raz**, przed pierwszą partią. Nie przed każdą —
  to byłaby kara za chęć grania.
- **Kolejność zabezpiecza `odkryta`, nie flaga.** `zaliczWygrana` nie ruszy
  misji bez ułożonej układanki. Nie dopisuj ulotnych flag „wszedłem z mapy".
- Gra z jednym poziomem nie nazywa go i nie udaje wyboru.

## Zawsze na koniec

Przejdź checklistę punkt po punkcie i **wypisz, które pozycje faktycznie
zmieniłeś**. Jeśli którejś świadomie nie ruszasz — napisz dlaczego.
Szczegóły systemowe: `docs/SYSTEMY_GRY.md`.
