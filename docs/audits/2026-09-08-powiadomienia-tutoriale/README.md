# Audyt powiadomień i tutoriali dziecka

Data: 2026-09-08  
Zakres: pierwszy kontakt ze światem, wskazówki w hubie, zdarzenia fabularne, minigry, skrzynka zadań, powiadomienia w aplikacji i Web Push.

## Wniosek

System jest **częściowo spójny wizualnie, ale niespójny czasowo i semantycznie**. Dziecko nie jest jeszcze prowadzone jednym mechanizmem „krok → wykonanie → potwierdzenie → następny krok”. Obok siebie działają niezależne timery, wskazówki doraźne, dialogi zdarzeń, toasty, zwój zadań i Web Push. Nie mają wspólnej kolejki ani reguły priorytetu.

Ocena całości: **2/5 — wymaga przebudowy orkiestracji, nie kolejnych pojedynczych komunikatów.**

## Zalecana hierarchia

| Poziom | Rola | Przykład | Reguła |
|---|---|---|---|
| L0 — stan | Pokazuje, co już istnieje | badge, licznik, kropka | nie przerywa i nie znika czasowo |
| L1 — nauka | Uczy jednego gestu lub miejsca | „Przesuń palcem”, chmurka przy przycisku | widoczna do potwierdzonego wykonania, nie do dowolnego kliknięcia |
| L2 — reakcja | Potwierdza właśnie wykonane zdarzenie | „Kawałek 2 z 9” | pojawia się po evencie, krótko, jedna naraz |
| L3 — decyzja | Zatrzymuje tok i wymaga wyboru | Wizkor, zaproszenie do gry, tutorial minigry | wycisza L1/L2 i ma jeden główny CTA |
| L4 — obowiązek | Przechowuje niedokończoną sprawę | zadanie w zwoju | trwa do zmiany stanu zadania |
| L5 — zewnętrzne | Przywołuje do aplikacji | Web Push | tylko za zgodą opiekuna, strefa czasowa i limit częstotliwości |

## Przepływ krok po kroku

1. **Wejście do świata — 3/5**
   - Przesłona chmur działa i rzeczywiście oddziela ładowanie od świata.
   - Po odsłonięciu pojawia się instrukcja ruchu.
   - Błąd: dowolny `pointerdown` zapisuje tutorial jako ukończony. Dziecko może dotknąć HUD-u lub ekranu przypadkiem i już nigdy nie zobaczyć instrukcji.
   - Brakuje potwierdzenia „lisek rzeczywiście przeszedł minimalny dystans”.

2. **Pierwszy cel w świecie — 2/5**
   - Wizkor reaguje poprawnie na wejście/dotknięcie i dialog jest powiązany ze zdarzeniem.
   - Brakuje warstwy prowadzącej od nauki ruchu do pierwszego celu: „idź do Wizkora” z kierunkiem lub reflektorem.
   - Tryb blokującego reflektora istnieje w komponencie, lecz żadna obecna definicja wskazówki go nie używa.

3. **Miękkie wskazówki huba — 2/5**
   - Chmurki są nieblokujące, mają tekst i opcjonalny głos, więc audio nie blokuje zadania.
   - Test wizualny w widoku 1280×720 ujawnił błąd krytyczny: po wymuszeniu „Porady dnia” jej treść była obecna w drzewie dostępności (`role=status`), ale sama chmurka i obręcz nie były widoczne na zrzucie. Warstwa liczy pozycję względem całego `window`, choć świat jest osadzony w węższym, wyśrodkowanym obszarze; prowadzenie może więc istnieć logicznie, ale wypaść poza widoczny obszar gry.
   - „Porada dnia” startuje po 75 s; „Minigry” po 90 s. Obie wracają maksymalnie trzy razy na sesję.
   - Kolejność jest sztywna. Dopóki dziecko nie otworzy Porady, system wybiera ją jako pierwszą niepoznaną; podpowiedź Minigier może w praktyce nigdy nie dostać swojej kolejki.
   - Zamknięcie chmurki nie oznacza nauczenia; nauczenie następuje dopiero po otwarciu docelowego panelu — to akurat dobra semantyka.

4. **„Chwila dla ciała” — 2/5**
   - Wizualnie pasuje do premium-casualowego huba i nie blokuje świata.
   - Ma osobny zegar: także pierwsze wejście po 75 s, kolejne co 300 s, maksymalnie trzy razy.
   - W tej samej 75. sekundzie chce wystartować co chmurka „Porada dnia”. Nie ma wspólnego arbitra ani kolejki priorytetów.
   - Warunek aktywności nie uwzględnia wprost trwającej misji; podpowiedź zdrowotna może odezwać się w trakcie aktywnego celu, mimo komentarza „nigdy w drodze”.
   - Po przerwaniu panelem pierwszy licznik startuje praktycznie od nowa, podczas gdy timer chmurek działa inaczej. „75 sekund spokoju” nie ma jednej definicji.

5. **Reakcje na zdarzenia — 4/5**
   - Zaproszenie do gry jest zsynchronizowane z animacją znaku: ok. 790–800 ms po dotknięciu. Blokada kolejnych kolizji zapada od razu. To dobry wzorzec „event → animacja → decyzja”.
   - Licznik gwiazdek zmienia się dopiero po dolocie iskry, więc przyczyna i skutek są czytelne.
   - Toast działa 5 s i używa jednego wspólnego slotu, więc nowy zastępuje poprzedni.
   - Ryzyko: po ostatnim puzzlu toast „Masz wszystkie kawałki!” trwa 5 s, lecz układanka otwiera się już po ok. 950 ms. Potwierdzenie zostaje przykryte przez następny ekran i nie pełni swojej roli.

6. **Minigry — 3/5**
   - „Pamięć Mędrca” ma spójny, obowiązkowy tutorial przed pierwszą partią: trzy krótkie kroki, animowane demonstracje, tekst i jeden CTA. Pokazuje się raz na urządzenie i można do niego wrócić przez „?”.
   - „Bieg Liska” stosuje lepszy wzorzec just-in-time: „Dotknij — podskok” znika po trzech faktycznych skokach, czyli po wykazaniu umiejętności.
   - „Lot Liska” przechodzi bezpośrednio z ekranu startowego do gry, pokazuje jednocześnie komunikat celu i instrukcję gestu, ale instrukcja nie ma warunku opanowania i pozostaje stale.
   - Wspólny katalog tutoriali zawiera tylko „Pamięć Mędrca”; pozostałe gry mają lokalne, różne mechanizmy.

7. **Zadania, rozmowy i skrzynka — 3/5**
   - Dock rozróżnia liczbowy badge i zieloną kropkę; etykiety dostępności przekazują liczbę nowości.
   - Zwój „Zadania” jest wizualnie czytelny i odmienny od „Rozmów”. Puste stany są spokojne, bez presji.
   - Semantycznie dziecko ma jednak dwa sąsiednie miejsca komunikacji: „Rozmowy” i „Zadania”, a wewnętrznie drugie jest także nazywane wiadomościami. Wymaga jednej zasady: rozmowa = ludzie, zadanie = rzecz do wykonania.
   - Dobrze: przypięte zadanie nie generuje ciągłego nagabywania podczas wysłania lub sprawdzania.

8. **Powiadomienia w aplikacji — 1/5**
   - Zadeklarowano pięć rodzajów, ale w realnych wywołaniach działa głównie `mentor_accepted`.
   - `map_ready` jest wywoływane, lecz celowo ukryte; `story_invite`, `mission_reminder` i `light_moment` nie mają aktywnych nadawców w interfejsie dziecka.
   - Funkcje preferencji istnieją, ale nie ma ekranu, który pozwala nimi zarządzać.
   - Globalny `HintPopup` nie działa na głównych trasach dziecka (`/swiat`, `/przygoda`, `/porady`, profil), za to może działać na innych trasach. Jego stary modal emoji jest wizualnie niespójny z obecnym hubem.

9. **Web Push — 1/5**
   - Prośba o zgodę pojawia się dopiero po trzech różnych poradach — to dobry moment progresywnego pytania o uprawnienie.
   - Backend wysyła trzy globalne wiadomości dziennie do wszystkich subskrypcji, bez typów, preferencji użytkownika, strefy czasowej i kontroli opiekuna.
   - Cron 06:00 / 11:00 / 17:00 UTC nie daje stałych godzin lokalnych w Europie/Berlinie po zmianie czasu.
   - Ustawienia wewnętrznych typów powiadomień nie są połączone z Web Push.

## Najważniejsze decyzje naprawcze

1. Wprowadzić jeden `GuidanceOrchestrator` z kolejką i priorytetami L0–L5; tylko jeden komunikat L1/L2 naraz, a L3 zawsze je wstrzymuje.
2. Zastąpić „tutorial zobaczony” przez „umiejętność potwierdzona”: ruch po dystansie, skok po trzech skokach, Lot po pierwszym poprawnym naciągnięciu i puszczeniu.
3. Zbudować pierwszy łańcuch: **odsłonięcie chmur → ruch → dojście do Wizkora → przyjęcie celu → zebranie pierwszego elementu → wskazanie miejsca trwałego zadania**.
4. Ujednolicić tutoriale gier do wspólnej umowy: maks. trzy kroki przed startem tylko jeśli potrzebne, potem podpowiedź just-in-time wygaszana po wykonaniu.
5. Rozdzielić „przed eventem / w evencie / po evencie”: przed — jedna instrukcja; w evencie — brak dodatkowej edukacji; po — krótkie potwierdzenie i następny krok.
6. Podłączyć realną taksonomię powiadomień albo usunąć martwe typy. Web Push przenieść pod zgodę i harmonogram opiekuna, z limitem i lokalną strefą czasową.

## Materiał wizualny

- `01-pierwszy-ekran-tutorial-ruchu.png` — świat po odsłonięciu, instrukcja ruchu.
- `02-miekka-chmurka-porada.png` — błąd miękkiej wskazówki: aktywna w DOM/AX, lecz niewidoczna w kadrze.
- `03-chwila-dla-ciala.png` — niezależna podpowiedź Mędrca.
- `04-tutorial-pamiec-medrca.png` — obowiązkowy tutorial minigry.
- `05-panel-zadania-pusty.png` — zwój zadań i pusty stan.

Zrzuty wykonano z lokalnie uruchomionej aplikacji w przeglądarce in-app. Analiza czasowa i warunki zdarzeń zostały zweryfikowane w aktualnym kodzie; nie wykonywano zgody na Web Push ani rzeczywistej wysyłki powiadomień zewnętrznych.
