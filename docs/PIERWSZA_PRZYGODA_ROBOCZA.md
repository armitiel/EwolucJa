# Pierwsza przygoda — scenariusz roboczy

Data: 2026-09-13. Status: propozycja do wspólnego dopracowania, nie opis wdrożonej gry.

## Uzgodniony kierunek rozmowy

Przygoda łączy edukację, poznawanie sposobów działania i zadania poza ekranem. Cechy wyłaniają się z wielu doświadczeń; nie zaczynamy od quizu osobowości. Dziecko zmienia świat swoimi działaniami. Pierwszy zakres projektujemy dla wieku 7–9 lat.

## Granice tej wersji

Projektujemy pierwszy rozdział na istniejącej planecie, nie nowy silnik. Ten dokument nie zmienia docs/KONCEPT_GRY.md ani istniejącego panelu zadań. docs/PANEL_ZADAN.md opisuje wcześniejszą pętlę z Kołem i Mentorem; proponowana tutaj przygoda wynika z fabuły. Nie zakładamy, że nowe reakcje mieszkańców, interakcje i nagrody są zaimplementowane.

## 00 — START i intro

- START uruchamia istniejącą kurtynę chmur podczas ładowania świata.
- Rozsunięcie następuje po gotowości sceny. Bez wymogu zakończenia narracji.
- Pierwszy widok: lisek na polanie, domek w średnim planie, przy nim mieszkaniec i przekrzywiony dach. Dalej rzeka, istniejący most i zasłonięta roślinnością okolica. Nie usuwamy istniejącej przeprawy tylko po to, aby fabuła wymagała nowej.
- Narratorka: „Wiatr narobił tu niezłego zamieszania”. To robocza kwestia; żadnego wykładu o historii świata.
- Mieszkaniec przytrzymuje lekką część dachu. Nie jest ranny ani w niebezpieczeństwie.
- Gest mieszkańca i ruch elementu wskazują cel również bez dźwięku.
- Lisek od początku pozostaje sterowalny. Intro można pominąć; nie odtwarza się w całości po wznowieniu.

## 01 — Pierwszy HUD

| Moment | Widoczne | Warunek pojawienia się |
|---|---|---|
| Wejście | Sterowanie, menu z dźwiękiem i pomocą | Gotowy świat |
| Podejście do mieszkańca | Przycisk „Porozmawiaj” | Zasięg interakcji; sama bliskość nie uruchamia dialogu |
| Przyjęte zadanie | Jeden mały cel: „Pomóż naprawić dach” | Świadome rozpoczęcie |
| Pierwsza ukończona przygoda | Kronika | Jest pierwsze odkrycie do pokazania |
| Pierwsza wyprawa do realu | Jedna przypięta karta w Kronice | Dziecko odkłada zadanie na później |
| Pierwsza odkryta minigra | Skrót do gier | Istnieje grywalna odblokowana pozycja |

Propozycja na początek: bez licznika monet, radaru cech, pustych zakładek, plakietek nowości i wyskakującej porady. To zmiana projektowa względem obecnego HUD-u, jeszcze niewdrożona. Pomoc używa istniejącej chmurki. Jeden komunikat naraz; instrukcja nie zasłania celu ani sterowania. Na komputerze i dotyku pokazujemy odpowiedni sposób ruchu.

## 02 — Pierwszy kontakt

Roboczy mieszkaniec: mały leśny sąsiad, imię i wygląd do ustalenia. Nie zakładamy dostępnego modelu ani animacji.

Mieszkaniec: „Wiatr przesunął mój dach. Pomożesz mi go ułożyć?”

Przycisk: „Pomogę!”. Drugie wyjście: „Za chwilę”. Odmowa nie jest oceniana; można zwiedzać i wrócić. Cel pozostaje blisko miejsca startowego. Dopiero po spotkaniu można naturalnie zapytać o imię liska, jeśli nie jest już zapisane. Istniejący gracz nie podaje go ponownie.

## 03 — Pierwsze zadanie w grze

Roboczy tytuł: „Dach na swoim miejscu”. Szczegóły po przeglądzie agentów poniżej.

Zakres: jedna krótka interakcja dopasowania i możliwość poprawy po próbie. Bez łańcucha zbierania dziesięciu przedmiotów przed właściwym zadaniem. Główny cel edukacyjny: rozpoznawanie i dopasowywanie kształtów. Ukończenie zostawia naprawiony dach w świecie.

Nie wyciągamy diagnozy z czasu, błędu, pomocy ani rezygnacji. Informacja zwrotna opisuje działanie, nie osobowość. Zapisujemy postęp i wybrany wygląd; po wznowieniu nie każemy ponownie kończyć zadania.

## 04 — Pierwsze zadanie w realu

Roboczy tytuł: „Znak naszego domku”. Pojawia się po ukończeniu dachu jako zaproszenie do stworzenia znaku, nie warunek dalszego chodzenia po świecie.

Przyciski: „Robię teraz” i „Na później”. Powrót prowadzi do tej samej karty; opuszczenie aplikacji nie powoduje utraty postępu. Instrukcja ma tekst, obraz i opcjonalny odsłuch.

Nie obiecujemy automatycznego przeniesienia zdjęcia na model. Pierwszy wariant może zapisać wybrany przez dziecko symbol i kolor na drzwiach; własny rysunek jako tekstura to osobny zakres techniczny. Dziecko musi z góry wiedzieć, jaki efekt otrzyma.

## 05 — Zakończenie i dalsza droga

Mieszkaniec dziękuje za konkretną pomoc. Kamera krótko pokazuje naprawiony domek, ale można kontynuować sterowanie po zakończeniu krótkiego ujęcia lub jego pominięciu. Kronika zapisuje pierwszy wpis. Kolejna wskazówka prowadzi do pracowni w dalszej części planety; dokładną lokalizację trzeba dobrać do istniejącej mapy.

Rozdział ma własne zakończenie. Dalsza gra jest dostępna bez odczekiwania do jutra. Powrót przypomina aktualne działanie, bez wyrzutu za nieobecność i bez serii logowania.

## Praca agentów

W tej sesji dwa agenty pomocnicze przygotowały projekt pierwszego zadania edukacyjnego i pierwszej wyprawy do realu. Wyniki zostały połączone w kartach poniżej. Nie jest to ocena prawdziwego pedagoga ani badanie z dziećmi. Nie jest to stale działający generator zadań w aplikacji.

Istniejących plików .claude/agents/* oraz docs/PANEL_ZADAN.md nie nadpisujemy. Docelowy format nowej karty: identyfikator, etap fabuły, wiek, cel edukacyjny, materiały, kroki, kwestie, HUD, pomoc, warunek końca, trwały efekt, wariant dostępny, zapis/wznowienie, obserwacje i zakazane wnioski.

## Kolejność wspólnego dopracowania

1. Zatwierdzić lub zmienić sam pierwszy widok, mieszkańca i problem dachu.
2. Dopracować interakcję pierwszego zadania i jego teksty.
3. Dopracować wyprawę do realu i dokładny efekt powrotu.
4. Dopiero potem przygotować wdrożenie wariantu i sprawdzić je w przeglądarce.

## Karta PLANETA-01 — Dach dla Piórka

Piórko to robocze imię mieszkańca, nie zatwierdzony projekt postaci. Cel edukacyjny: dopasowanie kształtów przez porównywanie i obracanie. Czas orientacyjny całego spotkania: 5–8 minut, bez odliczania.

1. Przy domku mieszkaniec otrzepuje poduszkę z liści wpadających przez otwór w dachu. Kwestia: „Liście wpadają mi do łóżka. Pomożesz zasłonić tę dziurę?”.
2. Po „Pomogę!” przybliżamy dach. Dwa duże trójkątne elementy leżą obok. Instrukcja: „Połóż ten kawałek na dachu”.
3. Dziecko wybiera element, obraca dużym przyciskiem i wskazuje miejsce. Przeciąganie jest alternatywą, nie jedyną metodą. Pasujące miejsce przyciąga element bez wymagania precyzji.
4. Niepasujący element można dowolnie obracać i przestawiać. Bez utraty punktów. Podpowiedź: „Spróbuj go obrócić”.
5. Po dołożeniu drugiego kawałka przycisk „Sprawdźmy!” uruchamia krótki podmuch z liśćmi. Liście zsuwają się po zamkniętym dachu.
6. Kwestia końcowa: „Dwa kawałki razem zasłoniły całą dziurę. Dziękuję!”. Naprawiony dach zostaje na mapie.

Pomoc na żądanie: kontur miejsca → pokaz obrotu → wspólne ustawienie pierwszego elementu. Ukończenie z pomocą daje ten sam trwały efekt. Zapis obejmuje ułożone części, etap i ukończenie. Żadna liczba prób nie staje się oceną cechy.

Do wykonania technicznego: reprezentacja uszkodzonego i naprawionego dachu, interakcja układania, krótki test z liśćmi, reakcja mieszkańca, zapis. Istnienie tych funkcji nie zostało potwierdzone.

## Karta REAL-01 — Znak naszego domku

Cel: przedstawienie pomysłu prostym symbolem. Dostęp po PLANETA-01. Orientacyjnie 3–5 minut; bez wymaganego zdjęcia, pisania i udziału dorosłego.

Zaproszenie: „Dach już jest! Teraz wymyślmy znak na drzwi, żeby łatwo rozpoznać nasz domek”. „Robię teraz” / „Na później”. Pusta tabliczka przy domku pozwala wrócić do zadania.

Instrukcja: „Narysuj na kartce znak naszego domku”. Dodatkowa propozycja: „Spróbuj pokazać pomysł bez liter”. Litera nie unieważnia pracy. Od razu jasno podajemy: „Po powrocie wybierzesz podobny znak do gry”.

Wariant bez materiałów: „Pokaż kształt znaku palcem w powietrzu albo go sobie wyobraź”. Ten wariant nie jest dowodem aktywności poza ekranem; aplikacja nie twierdzi, że ją zaobserwowała.

Po powrocie: „Mam pomysł” / „Dokończę później”. Po deklaracji dziecko wybiera jeden z sześciu symboli (liść, gwiazda, słońce, fala, łapka, spirala) i kolor. Podgląd na drzwiach, zatwierdzenie „Zawieszamy!”. Zapisujemy symbol i kolor. Można później je zmienić.

Finał: „Teraz nasz domek ma swój znak!”. Dopiero po zapisie opcjonalne pytanie: „Co chcesz, żeby ten znak opowiadał?”. Można odpowiedzieć sobie na głos lub pominąć; bez nagrywania i obowiązkowego formularza.

Stany: dostępne → w trakcie lub odłożone → powrót → ukończone. Ukończenie wymaga deklaracji i zatwierdzenia znaku; samo otwarcie karty nie wystarcza. Odłożenie nigdy nie blokuje podstawowej przygody. Mentor może dostać informację o deklaracji, nie fikcyjne potwierdzenie wykonania.

Do wykonania technicznego: tabliczka z wariantami, karta wyprawy, zapis/wznowienie i podgląd. Import zdjęcia jako tekstury nie należy do pierwszego zakresu.

## Weryfikacja przyszłego prototypu

- Dziecko potrafi wskazać pierwszy cel i rozpocząć bez czytania wykładu.
- Wyłączenie audio nie blokuje żadnej czynności.
- Błąd daje możliwość próby lub pomocy.
- Zamknięcie gry w każdym etapie pozwala sensownie wrócić.
- Zadanie w realu może czekać bez zatrzymania podstawowej przygody.
- Zakończenie zadania faktycznie zmienia domek i zapis utrzymuje tę zmianę.
- Ocena atrakcyjności i celu edukacyjnego wymaga obserwacji dzieci; build i test przeglądarkowy tego nie zastępują.
