---
description: Zwołaj panel specjalistów do zadań poza ekranem (nowe zadania, audyt, porada dnia)
---

Prowadzisz panel. Nie piszesz zadań sam — zbierasz je od specjalistów
i scalasz.

Najpierw przeczytaj `docs/PANEL_ZADAN.md` (formaty, twarde reguły, kto czego
pilnuje) i to, co już jest w bazie, żeby nie powtórzyć istniejącego:
`frontend/src/hub/data/zadania-wizkora.v1.json`.

## Tryb bierzesz z argumentu

| argument | co robisz |
|---|---|
| temat albo cecha (`odwaga`, „coś na deszczowy dzień") | nowe zadania Wizkora |
| `audyt` | panel czyta istniejącą bazę i wypunktowuje, co jest słabe |
| `porada` | karty dnia do `hub/poradaDnia.js` → `KARTY_DNIA` |
| `mentor` | wpisy do `frontend/src/data/mentorTaskLibrary.js` (format profili) |

Bez argumentu: zapytaj, czego dotyczy runda, zanim zwołasz kogokolwiek.

## Przebieg

**1. Szkic.** Odpal `projektant-zadan` i `swieze-spojrzenie` **równolegle**
(jedna wiadomość, dwa wywołania). Pierwszy dowozi kształt i balans bazy,
drugi rozbija schemat. Z tego składasz dwa–trzy szkice zadań.

**2. Recenzja.** Puść szkice **równolegle** przez pięć głosów:
`rodzic-1-3`, `rodzic-4-8`, `pedagog`, `psycholog`, `socjolog`.
Każdy dostaje ten sam szkic i wie, o co pytać.

**3. Rozstrzygnięcie.** Zderz uwagi. Reguła: **weto ma bezpieczeństwo
i wykluczenie** (`psycholog`, `socjolog`, twarde reguły z briefu) — reszta
to argumenty do wyważenia, nie wyroki. Jeśli `rodzic-1-3` mówi „nie da się",
a `rodzic-4-8` „za dziecinne", to zwykle znak, że są tu dwa zadania,
nie jedno kompromisowe.

**3b. Czy to ma sens jako produkt.** Tylko gdy runda dotyczy **całej
mechaniki albo nowego rodzaju treści**, a nie pojedynczego zadania:
dołóż `strateg-produktu`. Pyta, czyj problem to rozwiązuje, ile wywołań
AI na dziecko na dzień dokłada i czym to zmierzymy. Przy zwykłej rundzie
„dwa nowe zadania na odwagę" — pomijasz go.

**4. Słowa.** `copywriter` przycina do pól, potem `narrator-gama` robi
ostatnie przejście po tonie. Ta kolejność jest ważna — kanon głosu jest po
stronie narratora.

**5. Wynik.** Pokaż w odpowiedzi:

- **gotowy JSON** do wklejenia (albo wpisy w formacie właściwym dla trybu),
- **dziennik panelu** — po jednym zdaniu na specjalistę, co wniósł,
- **co wypadło i dlaczego** — pomysły odrzucone wymień z powodem, to jest
  najcenniejsza część rundy,
- **stan balansu** po dopisaniu: ile zadań na cechę, czego teraz brakuje.

## Zanim dopiszesz do pliku

Zadania jadą na produkcję razem z gałęzią `v2-postgres-vercel`. **Pokaż
propozycję i poczekaj na zgodę**, zanim ruszysz
`zadania-wizkora.v1.json`. Po akceptacji: dopisz, sprawdź, że JSON się
parsuje, i wypisz dodane `id`.

Runda: $ARGUMENTS
