# System stylów EwolucJA — zasady i plan

Wygląd ustala się **od góry**, w jednym pliku: `frontend/public/tokeny.css`.
Reguła komponentu mówi *co* jest kartą; tokeny mówią *jak wygląda karta*.
Zmiana złota to jedna linia, nie czternaście plików.

Ten dokument jest źródłem prawdy o tym, JAK się style pisze. O tym, jak
wyglądają dziś (paleta, kroje, komponenty, rozjazdy), mówi żywa strona
„System wizualny EwolucJA" w artefaktach; o pułapkach narzędziowych — CLAUDE.md.

---

## 1. Stan wyjściowy (audyt, 8 września 2026)

| co | ile | wniosek |
|---|---|---|
| arkusze CSS | 14, łącznie 322 kB | `hub.css` sam ma 158 kB i 713 reguł |
| tokeny CSS | 61 | tylko 36 dotyczy koloru |
| unikalne barwy | 405 (po scaleniu; przed: 892) | 344 barwy nadal bez nazwy |
| wartości odstępów (`gap`/`padding`/`margin`) | 29 różnych | każda liczba od 1 do 20 px — skali nie ma |
| kolory wpisane inline w JSX | 290 wystąpień w 29 plikach | tokeny CSS ich nie dosięgają; panel Mentora jest prawie w całości inline |
| selektory zadeklarowane wielokrotnie w jednym pliku | 37 grup, 66 nadpisań | `hud.css` rósł przez dopisywanie łatek na końcu |
| niezależne komplety tokenów | 4 (`--p-*`, `--hud-*`, `--adv-*`, `mapa.json`) | złoto istnieje w czterech wersjach |

Jedna rzecz w tym audycie jest **dobra i wzorcowa**: skala CTA. `--cta-h`,
`--cta-fs`, `--cta-r` w jednym miejscu, a wyjątek na niskim ekranie robi się
przez nadpisanie zmiennej w kontenerze (`.popup-postaci` w `@media`), nie przez
nową wysokość w guziku. Cały ten plan to rozciągnięcie tej jednej zasady na
kolory, cienie, promienie, odstępy i cztery światy.

---

## 2. Trzy warstwy tokenów

```
prymitywy  →  role  →  komponentowe
--p-amber     --akcent-nagrody     --cta-h, --cta-fs
--p-ink       --tekst              --r-card, --popup-bohater
--hud-gold    --lamowka-zloto      --kolo, --plansza
```

**Prymitywy** to surowe wartości: `--p-amber: #F4C95D`. Mówią *jaki* kolor,
nie *po co*. Docelowo komponent nie sięga po nie bezpośrednio.

**Role** mówią, do czego wartość służy: `--tlo-karty`, `--tekst`,
`--tekst-cichy`, `--akcent-cta`, `--lamowka-zloto`, `--cien-twardy`.
Komponent czyta **tylko role**. To jest warstwa, dzięki której jedna zmiana
idzie wszędzie: przemalowanie złota to zmiana jednej roli, a nie polowanie
na `#efb937`, `#f4c95d`, `#f5c45e` i `#ffd24a` po plikach.

**Komponentowe** to wymiary konkretnych elementów: `--cta-h`, `--r-card`,
`--popup-bohater`, `--kolo`. Już istnieją i działają. Wzorzec do naśladowania.

### Motywy to przemapowanie ról, nie nowe palety

Przygoda (ciemne szkło) i HUD (złoto) nie są osobnymi systemami. To te same
role z innymi wartościami, ustawionymi na kontenerze:

```css
.adv-root  { --tlo-karty: var(--noc-panel);  --tekst: var(--noc-atrament); }
.game-hud  { --lamowka:   var(--zloto);       --cien-twardy: var(--braz-gleboki); }
```

Dziś `--adv-*` i `--hud-*` to osobne nazwy. Docelowo zostaną jako prymitywy
(„noc", „złoto"), a komponenty przejdą na role. Wtedy przycisk w Przygodzie
i przycisk w hubie to **jedna reguła**, którą kontener przebarwia.

---

## 3. Pięć reguł — każda z powodem

**1. Nowa wartość wchodzi do `tokeny.css`, nie do reguły komponentu.**
Powód: przed scaleniem było 892 barw na 36 tokenów. 96% kolorów było wpisanych
wprost, a `#7a4dc2` występował dosłownie kilkanaście razy obok własnego tokenu
`--p-magic-dk`. Nie da się „potem to uporządkować" — trzeba nie dopuszczać.

**2. Komponent czyta `var(--rola)`. Nigdy `#hex`. W JSX też.**
Style inline nie są problemem — `style={{ color: "var(--tekst-cichy)" }}`
działa dokładnie tak samo jak `#5A4F77`, a idzie za tokenem. Problemem jest
290 wpisanych na sztywno kolorów w 29 plikach, z czego 76 w panelu Mentora.

**3. Wyjątek robi się przez nadpisanie ZMIENNEJ w kontenerze.**
Tak działa dziś `--cta-*`: `.popup-postaci` na niskim ekranie ustawia
`--cta-h: 50px` i wszystkie guziki w oknie schodzą razem. Nie dopisuj
`min-height` pojedynczemu przyciskowi — za pół roku nikt nie zgadnie, czemu
ten jeden jest inny.

**4. Nie dopisuj łatki na końcu pliku. Znajdź regułę i zmień ją.**
Powód: `.game-hud-profile` jest zadeklarowany w liniach 51, 1092, 1144 i 1233
`hud.css`. Linia 51 mówi `gap: 7px`, obowiązuje `gap: 12px` z linii 1144.
Kto czyta górę pliku, dostaje złą odpowiedź. 66 takich nadpisań w projekcie.

**5. Bloki `@media` idą na koniec pliku, zbiorczo.**
Powód: reguła bazowa dopisana PO bloku media wygrywa z nim na wąskim ekranie
(ta sama specyficzność, późniejsza w kaskadzie). W `hud.css` 19 grup selektorów
nie da się dziś bezpiecznie scalić właśnie dlatego, że warianty na 340 i 390 px
siedzą w środku pliku, a łatki pod nimi.

---

## 4. Skala odstępów (do wprowadzenia w kroku 3)

Dziś: 29 wartości, najczęstsze `8` (87×), `12` (81×), `10` (77×), `2`, `14`,
`6`, `7`, `9`, `18`… — czyli każda liczba, jaka przyszła do głowy przy
konkretnym elemencie.

Docelowo osiem stopni, z których siedem już jest najczęstsze w kodzie:

```
--o-1: 2px    włos — obrysy, korekty optyczne
--o-2: 4px
--o-3: 8px    domyślny odstęp między elementami w rzędzie
--o-4: 12px   domyślny padding kart i chipów
--o-5: 16px
--o-6: 24px   padding okien
--o-7: 32px
--o-8: 56px   minimalna strefa dotyku (już obowiązuje w Przygodzie)
```

Wartości 7, 9, 11, 13 i podobne przechodzą na sąsiedni stopień. Różnicy 1 px
w odstępie nie widzi nikt — widać za to, że wszystko zaczyna się układać
w jeden rytm.

---

## 5. Plan — krok po kroku

Każdy krok jest osobnym commitem, sam w sobie bezpieczny, z jasnym kryterium
„zrobione". Kolejność nie jest przypadkowa: najpierw fundament, potem to, co
z fundamentu korzysta.

| # | krok | co daje | kryterium „zrobione" | stan |
|---|---|---|---|---|
| 0 | **Zasady na piśmie** — ten dokument + wskaźnik w CLAUDE.md | dalszy dryf zatrzymany: każdy agent i człowiek wie, gdzie wchodzi nowy kolor | plik istnieje, CLAUDE.md go wskazuje | ✅ 9.09.2026 |
| 1 | **Jedno źródło tokenów** — `:root` z `ewolucja.css` i `hud.css` przeniesiony do `public/tokeny.css`, linkowany przed `hud.css` | jedno miejsce, w którym ustala się wygląd; HUD i React czytają te same nazwy | zero zmian wizualnych; `getComputedStyle(root)` zwraca te same wartości co przed | ✅ 9.09.2026 |
| 2 | **Warstwa ról** — `--tlo-*`, `--tekst-*`, `--akcent-*`, `--lamowka-*`, `--cien-*` zmapowane na prymitywy; `.adv-root` i `.game-hud` stają się motywami przemapowującymi role | „jedna zmiana idzie wszędzie" zaczyna działać naprawdę | fundament + HUD + Przygoda czytają role; cztery złota sprowadzone do jednej rampy `--zloto-*` | ✅ 9.09.2026 — rampa `--zloto-100…800`, `--p-amber`/`--hud-gold*`/`--adv-gold` jako aliasy; 16 ról w `:root`; motywy `.game-hud` i `.adv-root`; pierwsi konsumenci: `.game-hud-counter` (HUD) i `.adv-choice` (Przygoda). Masowe przepięcie komponentów na role = krok 3 |
| 3 | **Nazwanie 344 barw + skala odstępów** — z danych klastrowania: rampy złota, brązu (twarde cienie HUD-u), kremu, nocy; `--o-1…8` | koniec bezimiennych wartości; drugi przebieg `scripts/ujednolic-barwy.mjs` podmienia użycia na `var()` | mniej niż 60 barw bez tokenu; odstępy tylko ze skali w nowym kodzie | ⏳ |
| 4 | **Style inline w JSX → tokeny** — 290 wystąpień, zacząć od panelu Mentora (76) i `MissionView` (35); `App.jsx` (V1, 52) zostawić, bo jest martwy dla dziecka | panel Mentora przestaje być piątym światem | żaden żywy ekran nie ma `#hex` w `style={{}}` | ⏳ |
| 5 | **Komponenty wspólne** — `.plansza-gry` (dziś `.kolo-fortuny` i `.puzzle-brama` dzielą 85% deklaracji), `.okno` (popup / mentor-notice / nagroda), `.kafel-okragly` (34× ten sam trzyelementowy zestaw) | jedna zmiana w elemencie wspólnym zamiast łapania każdego osobno | każdy z trzech ma jedną regułę bazową i modyfikatory | ⏳ |
| 6 | **Porządek `hud.css`** — bloki `@media` na koniec, potem scalenie 19 zablokowanych grup selektorów | plik, któremu da się wierzyć przy czytaniu | zero powtórzonych selektorów; sprawdzone na 340 i 390 px | ⏳ |

Co jest celowo **poza** planem: paleta mapy (`mapa.json`) i palety sceny WebGL
(`scena3d.js`). To dane, nie CSS — decyzja, czy podpiąć je pod tokeny, jest
osobna i dotyczy pipeline'u grafiki, nie interfejsu.

---

## 6. Co robić, gdy…

**…chcę zmienić złoto w całej grze.** Rampa `--zloto-100…800` w `tokeny.css`,
sekcja 0. `--p-amber`, `--hud-gold*`, `--hud-shadow` i `--adv-gold` to jej
aliasy, więc zmiana stopnia rampy idzie do UI, HUD-u i Przygody naraz.
Podbij `?v=N` w obu `index.html`.

**…chcę, żeby komponent wyglądał inaczej w HUD-zie / w Przygodzie.** Nie pisz
drugiej reguły. Komponent czyta role (`--tlo-karty`, `--tekst`, `--lamowka`),
a motyw na kontenerze (`.game-hud`, `.adv-root` w `tokeny.css`, sekcja 5)
przemapowuje je. Jeśli motywowi brakuje roli — dopisz ją tam, nie w komponencie.

**…potrzebuję nowego koloru, którego nie ma.** Sprawdź najpierw, czy nie ma go
w promieniu ΔE 4 od istniejącego — `node scripts/ujednolic-barwy.mjs --sucho`
pokaże, do której grupy by wpadł. Jeśli naprawdę nowy: prymityw do
`tokeny.css`, rola nad nim, i dopiero `var(--rola)` w komponencie.

**…jeden ekran ma mieć mniejsze przyciski.** Kontener tego ekranu:
`.moj-ekran { --cta-h: 48px; --cta-fs: 17px; }`. Nic w samym guziku.

**…robię nowy komponent.** Najpierw sprawdź, czy nie jest wariantem istniejącego
(`.okno`, `.plansza-gry`, `.kafel-okragly` po kroku 5). Jeśli nowy: reguła
bazowa czyta wyłącznie role i skalę odstępów; warianty przez klasę
modyfikującą, stany przez `.is-*` (tak jak dziś `.is-active`, `.is-open`).

**…muszę coś poprawić w `hud.css`.** Znajdź istniejącą regułę (Ctrl+F po
selektorze — może być kilka trafień, obowiązuje ostatnia) i zmień ją tam.
Nie dopisuj na końcu.
