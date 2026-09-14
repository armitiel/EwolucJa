# Trzy wersje gry — najlepsze motywy i jedna rozgrywka

Obejrzane 2026-09-14 w przeglądarce (telefon 375×812), z wejściem w każdy
ekran, do którego dało się dojść. Vercel nie oddał metadanych wdrożeń
(brak autoryzacji do zakresu), więc wersje rozpoznane po treści i po repo.
Cel odniesienia: `docs/OPIS_PROJEKTU.md` — serce gry to zadanie poza ekranem
przyjęte przez Mentora, a zasada nadrzędna brzmi *nie zbieramy, żeby mieć
więcej — zbieramy, żeby zobaczyć, co stanie się ze światem*.

---

## Co jest w której wersji

### V1 — aplikacja zakładkowa (`…b88fyem0w…/world`, ok. maj 2026)

Onboarding: imię → quiz ośmiu sytuacji („Sąsiadka zgubiła kota. Co robisz
najpierw?") → archetyp. **Dom:** pasek tygodnia PN–ND, „0 / 1000 coinów",
trzy karty — *Gierki dla Ciebie +30*, *Zadania w Realu +12*, *Rozkmina Dnia*.
**Gry:** „Wyprawa tygodnia" — jedna gra otwarta, następna z kłódką.
**Zadania:** zwinięty zwój → „Rozwiń zwój ✦" → konfetti → tytuł, dwa zdania,
„Daj odpowiedź ✦". Zadanie, które wypadło: *„Bądź obok kogoś smutnego —
bez słów"*. **Porady:** „Komnata Mędrca", porada dnia w łuku trzydziestu dni
(„30 dni tropienia — dziś mija miesiąc twoich odkryć"), trzy pory dnia,
i **historia dzień po dniu**: *Dzień 1 — Pierwsze spojrzenie dnia · Dzień 3 —
Niebo jak mapa · Dzień 4 — Oddech jak mgła · Dzień 12 — Dźwięki domu ·
Dzień 20 — Trzy zapachy dnia · Dzień 22 — Pytanie do snu*. **Profil:** lisek
z latarnią, LV 1, „Postęp tygodnia 0 / 80", „Ścieżka ewolucji 1–2–3–4",
radar sześciu cech.

Co nie działa: odpowiedzi w quizie pojawiają się dopiero po odsłuchaniu TTS,
a wyciszenie głosu blokuje je na zawsze; wszędzie liczniki; przycisk DEV
dla dziecka.

### V2 — lisek na planecie (`…hviwbl3mw…/swiat`, baza `11f01b7`, 11.09)

**Zejście przez chmury** na start. Nocna planeta z gwiazdami, lisek jako
bohater, ścieżka, rzeka z nurtem, most z gwiazdką, drewniana brama.
HUD: awatar „Wędrowiec", monety, muzyka; podpowiedź „Przesuń palcem, by iść
w dowolną stronę". **Dok** czterech ikon z plakietkami (Minigry · Rozmowy 1 ·
Zadania · Porada 8). **Porada dnia:** „Wybierz zabawę — wskaż jedną, a ja
robię z tobą": trzy karty z ilustracjami liska (Balon spokoju, Zielony trop,
Strząśnij napięcie) i **„Twoje listki"** — siedem pustych liści zamiast
licznika tygodnia.

### V3 — świat W2, Magiczna Fasola (`ewolucja-azure…/scena-3d/?mapa=w2`, 13–14.09)

Dzienna, kredowo-zielona kula, fasetowane drzewa, głazy, kwiaty. **Bez doku,
bez znaków, bez Wizkora.** Lisek, oczko wody, kopczyk z ziarnem. Krąg
i kropla nad fasolą **wynurzają się tylko, gdy lisek jest blisko**. Lisek
**nosi widocznie** — kule światła krążą wokół niego. Doba robiona nogami: kąt
od środka mapy to pora dnia. Świetliki nocą (wyłączone 13.09). Pętla z
`fasola.js`: oczko → lisek nabiera kroplę → niesie → fasola wypija i **rośnie
o etap** (podskok, rozbryzg) → przy ostatnim etapie wspinaczka po wstędze
pnącza → `swiat:dalej` → W3. W3 to dziś placeholder.

---

## Najlepsze motywy — po jednym zdaniu, dlaczego

| motyw | skąd | dlaczego zostaje |
|---|---|---|
| **Świat odpowiada** — przynieś, a coś urośnie | V3 | jedyna mechanika, która wprost realizuje zasadę z `OPIS_PROJEKTU.md`; nie licznik, tylko zmiana w świecie |
| **Lisek nosi** — widać, co przyniósł | V3 | metafora dowodu: dziecko też coś przynosi z realu |
| **Wskaźnik tylko z bliska** | V3 | świat, który świeci bez przerwy, przestaje podpowiadać |
| **Doba robiona nogami** | V3 | czas jako przestrzeń — bez zegara na ekranie |
| **Zejście przez chmury** | V2 | świat jest miejscem, do którego się przybywa, nie ekranem, który się otwiera |
| **Noc na planecie** | V2 | nastrój, którego dzienna V3 nie ma; razem z dobą V3 daje pełny cykl |
| **„Robię to z tobą"** | V2 | lisek zaprasza, nie zleca — jedyny ton, który przetrwa u dwunastolatka |
| **Listki zamiast licznika** | V2 | tydzień bez liczb — to, co V1 robiło paskiem 0/80 |
| **Brama, most, latarnia** | V2 | obiekty, które już stoją; brakuje im po jednym zdaniu |
| **Zwój jako ceremonia** | V1 | rozwinięcie zwoju z konfetti to lepszy pojemnik na zadanie niż karta; ikona zwoju już jest w doku |
| **Kronika dnia po dniu** | V1 | „Dzień 12 — Dźwięki domu": ślad, którego dzisiejszej grze brakuje najbardziej |
| **Łuk trzydziestu dni** | V1 | porada dnia, która wie, że jest miesiąc, a nie kolejny dzień |
| **Zadania bez produktu** | V1 | „Bądź obok kogoś smutnego — bez słów" — kształt, którego w `zadania-wizkora.v1.json` nie ma ani razu |
| **Sytuacje z quizu jako materiał** | V1 | „Koledze wypadła książka…" — to gotowe scenariusze zadań, nie test osobowości |
| **Latarnia liska** | V1 profil + V2 obiekt + V3 światło | trzy wersje, jeden niedomknięty wątek |

## Co zostaje w starych wersjach

Liczniki (0/1000, 0/80, LV, ścieżka 1–4 jako XP) — `OPIS_PROJEKTU.md` mówi
wprost: świat nie wyświetla liczników. Typowanie archetypu z quizu — zakazane
tam samo. Odpowiedzi bramkowane odsłuchem. Rozmowy w doku (atrapa).
Dok czterech ikon w ogóle: V3 pokazała, że bez doku świat jest czytelniejszy.

---

## Jedna rozgrywka z tego wszystkiego

### Metafora, która spina całość: **lisek nosi, świat rośnie**

Wszystko, co dziecko robi, wraca do świata jako coś, co lisek niesie.
Trzy rodzaje ładunku, trzy pętle z `ANALIZA_I_ROZGRYWKA.md` §2:

| ładunek | skąd | co robi ze światem | pętla |
|---|---|---|---|
| **woda z oczka** | bieganie po planecie, minigry, gwiazdki | fasola wypuszcza **liść** | puls dnia |
| **światło świetlików** | wieczorna porada dnia z liskiem | zapala **latarnię** — polana świeci w nocy | puls dnia |
| **kropla z realu** | **dowód przyjęty przez Mentora** | fasola rośnie o **etap** | łuk zadania |

Regułą, której nic nie może obejść: **na etap fasoli nie da się uzbierać
wodą z oczka.** Oczko daje liście, świetliki dają światło, ale wysokość
rośnie wyłącznie od tego, co dziecko przyniosło z prawdziwego świata. To
jest mechaniczne wcielenie zdania z briefu: zadanie poza ekranem jest sercem,
reszta istnieje, żeby do niego doprowadzić.

**Pięć etapów fasoli = pięć cech.** Każdy etap odpowiada jednemu przyjętemu
zadaniu; kolejność cech wybiera dziecko w tygodniu pierwszym, Koło od
drugiego (rozstrzygnięcie z analizy). Po piątym etapie — wspinaczka do W3.
Przy dwóch–trzech zadaniach na tydzień to **dwa–trzy tygodnie na świat**;
światy są rozdziałami, W3 dostaje własną roślinę albo własną rzecz, która
rośnie.

### Czekanie na Mentora — pokazane światem, nie tekstem

Dowód wysłany → nad fasolą **zbiera się chmura** (bryły z V2/V3 już są).
Mentor przyjął → **deszcz**, fasola rośnie, lisek podskakuje. Minęły
dwadzieścia cztery godziny bez werdyktu → chmura odpływa, a na fasolę
spada **rosa**: pół etapu, z jednym zdaniem narratorki, że Mentor nie zdążył.
Stan „Sprawdzane" przestaje być tekstem w zwoju, a staje się pogodą nad
rośliną — psycholog chciał, żeby czekanie miało twarz; tu ma niebo.

### Rytm dnia, tygodnia, miesiąca

**Dzień.** Zejście przez chmury (V2). Planeta w porze dnia, w której dziecko
naprawdę gra — doba nogami. Wizkor ma **jedną** rzecz: zwój. Lisek ma jedną:
„zrobimy to razem?". Nic więcej nie czeka.

**Tydzień.** Siedem liści na łodydze fasoli (listki z V2 przeniesione ze
zwoju na roślinę — ten sam brak liczb, tylko widać go w świecie). Liść za
dzień z poradą albo z wodą z oczka. Pusty dzień to brak liścia, nie wyrzut.

**Miesiąc.** Kronika w domu (V1) — jedna linia na dzień, głosem narratorki,
tytułami jak w Komnacie Mędrca: *„Dzień 12 — Dźwięki domu"*, *„Dzień 14 —
Ola przyniosła Odwagę"*. Do tego łuk trzydziestu dni porad z V1, tym razem
bez archetypu: miesiąc ma początek, środek i koniec.

### Zwój zamiast karty

Zadanie przychodzi jak w V1: zwój z pieczęcią w kolorze cechy, „Rozwiń",
konfetti, **tytuł + dwie linie celu + szept**, i przycisk dowodu z dwiema
drogami. Wybór miejsca zostaje z dzisiejszej wersji — to jedyny wybór, który
dziecko ma w zadaniu, i musi być widoczny.

### Ekran bez doku

Z V3: bez doku. Zwój leży przy Wizkorze, porada przy lisku, gry za bramą,
kronika w domu. Dziecko idzie do rzeczy, zamiast dotykać ikony. Cztery
obiekty V2 — brama, most, latarnia, domek — dostają po dwa zdania narratorki
i po jednej funkcji: brama = gry, most = przejście do W3 po wspinaczce,
latarnia = światło z porad, domek = kronika.

---

## Co to zamyka z listy luk

| luka (`ROZWOJ_GRY.md`, `ANALIZA_I_ROZGRYWKA.md`) | czym |
|---|---|
| łańcuch Wizkora ma koniec | etapy fasoli i światy-rozdziały |
| monety nie mają ujścia | monety schodzą na drugi plan; ujściem jest roślina i latarnia |
| cechy niczego nie zmieniają | każda cecha to widoczny etap rośliny |
| dowód wychodzi i nie wraca | chmura → deszcz albo rosa |
| brak powodu powrotu | liście, światło w nocy, kronika |
| ekran płaci lepiej niż świat | woda z ekranu daje liść, dowód z realu daje etap |

## Czego nie brać, choć kusi

Nie wracać do quizu jako typowania — ale **zabrać z niego sytuacje** jako
materiał na zadania. Nie wracać do dok-u z czterema ikonami. Nie wracać do
pasków postępu i poziomów — listki i wysokość rośliny robią to samo bez
liczb. Nie robić W3 jako kopii W2 z inną rośliną — W3 ma dostać jedną nową
rzecz, która rośnie inaczej.

## Najtańszy dowód, że to działa

Jedna klasa świetlicowa, dwa tygodnie, W2 z fasolą, której etapy przestawia
**ręcznie** nauczyciel po obejrzeniu dowodu (bez pisania kodu chmury
i deszczu). Pytanie: czy dzieci wracają zobaczyć, czy fasola urosła. Jeśli
tak — mechanika niesie; jeśli nie — żadna chmura tego nie uratuje.
