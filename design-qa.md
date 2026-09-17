**Porównywane źródła**

- Mówiony dymek: `C:/Users/DELL/AppData/Local/Temp/codex-clipboard-25a2914d-e436-4837-942e-e0a0109eb647.png` (594 × 249 px).
- Istniejąca podpowiedź o ciele (Wizkor): `C:/Users/DELL/AppData/Local/Temp/codex-clipboard-d81bb827-9f3c-48ca-8472-2559ff6459b9.png` (416 × 137 px).
- Wzorzec ogonka myśli: `C:/Users/DELL/AppData/Local/Temp/codex-clipboard-05858d76-910e-4985-b03e-c4cd2fc0c437.png` (152 × 152 px).

**Implementacja**

- `docs/design-system/evidence/10-guidance-bubble-soft-clay.jpg` (1510 × 1272 px).
- `docs/design-system/evidence/11-thinking-cloud-soft-clay-circles.jpg` (1510 × 1272 px).
- Przeglądarka: Codex In-app Browser, route `/swiat` i `/swiat?medrzec=woda`.
- Widoczny artboard aplikacji: 480 CSS px; screenshot bez dodatkowego skalowania porównawczego.
- Stan: spokojny hub, aktywna pojedyncza chmurka, brak panelu DEV na wierzchu.

**Dowody porównawcze**

- Pełne widoki: oba pliki implementacji powyżej.
- Dymek mówiony, crop 594 × 249: `docs/design-system/evidence/qa-speech-comparison.png`.
- Ogonek myśli, crop 152 × 156: `docs/design-system/evidence/qa-thinking-trail-comparison.png`.

**Findings**

- Brak otwartych P0/P1/P2. Wypowiedź zachowuje komiksowy ostry ogonek, a myśl ma obłą chmurę i trzy coraz mniejsze kółka. Nazwa postaci i przycisk nutki nie są renderowane. Tekst jest optycznie wyśrodkowany, pionowy padding jest równy, a cienki obrys i dwustopniowy cień tworzą lekki efekt soft clay.

**Sprawdzone powierzchnie jakości**

- Typografia: `Baloo 2` dla tytułu i `Nunito` dla treści; hierarchia i zawijanie czytelne.
- Rytm i spacing: równe paddingi góra/dół; postać nie spycha tekstu poza środek; ogonek nie nachodzi na dok.
- Kolory: pergamin, przygaszony fiolet i złoty kant pozostają w tokenach świata.
- Assety: zachowane oryginalne ilustracje Liska, Wizkora i istniejąca chmura tytułowa gry.
- Copy: brak zbędnego podpisu „Lisek/Wizkor”; treść komunikatu nie została skrócona ani ukryta.
- Interakcja: dymek nie blokuje świata; krzyżyk zamyka poradę; brak osobnej kontrolki audio w drzewie dostępności.
- Responsywność: reguły `≤360px` utrzymują dwie kolumny, zmniejszają ilustrację i zachowują minimum 8–12 px marginesu. Brak możliwości wymuszenia osobnego viewportu mobilnego w aktywnym panelu przeglądarki pozostaje wyłącznie luką testową P3.

**Historia porównań**

1. P1: dymek był pozycjonowany względem viewportu, ale osadzony w transformowanym kontenerze huba. Naprawa: portal do `document.body`. Dowód po poprawce: `10-guidance-bubble-soft-clay.jpg`.
2. P2: wariant myśli używał pomniejszonych kopii chmury zamiast klasycznych kółek. Naprawa: trzy malejące koła z tym samym kremowym wypełnieniem, obrysem i cieniem. Dowód po poprawce: `11-thinking-cloud-soft-clay-circles.jpg`.

**Implementation Checklist**

- [x] Rozdzielić wypowiedź i myśl na dwa czytelne kształty.
- [x] Usunąć podpis postaci i ikonę nutki.
- [x] Wyśrodkować treść i wyrównać pionowe paddingi.
- [x] Ujednolicić soft-clay obrys, gradient i cień.
- [x] Sprawdzić pozycję na wycentrowanym desktopowym hubie.
- [x] Sprawdzić działanie zamknięcia.
- [x] Przeprowadzić build produkcyjny.

**Follow-up Polish**

- P3: dodatkowy zrzut na fizycznym viewportcie 320–360 px może potwierdzić optyczne położenie kółek na najwęższych telefonach.

final result: passed

---

## Onboarding — powitanie i wybór postaci (2026-09-15)

**Źródło i stan**

- Widok zgłoszony przez użytkownika: `C:/Users/DELL/AppData/Local/Temp/codex-clipboard-3655ee1d-1d48-43a2-8524-cd7af10f0c8b.png` (643 × 833 px).
- Referencja stylu ekranu startowego: `C:/Users/DELL/AppData/Local/Temp/codex-clipboard-846cd5f3-53be-4032-a0bd-253d1548fbe7.png` (1645 × 1217 px).
- Implementacja: `/onboarding?quiz=1`, sprawdzona w Codex In-app Browser na viewportach 1510 × 1272 oraz 390 × 844 CSS px, DPR 1.
- Finalny stan wejściowy: oba wybory mają `aria-pressed=false`, a przycisk „Dalej” jest nieaktywny.

**Findings i poprawki**

1. P2: etykiety w złotych kapsułach nachodziły na krawędzie i treść kontrolek. Naprawa: zwykły, osobny wiersz etykiety nad każdą kontrolką.
2. P2: pole imienia i wybór postaci miały różne wysokości. Naprawa: jedna zmienna `--ob-control-h`; pomiar w przeglądarce potwierdził identyczną wysokość obu typów kontrolek.
3. P2: tekstowe odpowiedzi „dziewczynka/chłopiec” nie pasowały do dziecięcego charakteru gry. Pierwszy wariant portretowy był zbyt szczegółowy. Naprawa: proste, edytowalne ikony SVG oparte na głowie, fryzurze i ramionach, bez widocznych podpisów.
4. P2: wybór nie może być podejmowany za dziecko. Naprawa: stan zaczyna się od `null`, po odświeżeniu oba kafelki pozostają neutralne, a wysłanie formularza wymaga świadomego kliknięcia.
5. P2: ciemne tło nie należało do stylu zaakceptowanego ekranu startowego. Naprawa: jasny las 3D z cichym środkiem pod formularzem; ten sam statyczny asset działa na desktopie i w pionowym kadrze mobilnym.

**Sprawdzone powierzchnie jakości**

- Layout: brak poziomego przepełnienia; cała karta mieści się w 390 × 844 px; etykiety nie przecinają pól.
- Interakcja: test kliknięcia obu kafelków potwierdził dokładnie jeden aktywny stan; odświeżenie przywraca brak wyboru.
- Dostępność: grupa ma nazwę „Wybierz postać”, przyciski mają nazwy „Bohaterka” i „Bohater”, a stan jest przekazywany przez `aria-pressed`.
- Wizualne QA: sprawdzono neutralny i zaznaczony stan w podglądzie mobilnym oraz neutralny stan desktopowy.
- Build: `npm run build` zakończony powodzeniem; 556 modułów przetworzonych. Pozostaje istniejące ostrzeżenie Vite o dużym głównym chunku.

**Follow-up Polish**

- Brak otwartych P0/P1/P2 dla pierwszego ekranu. Pełne przejście wszystkich ośmiu pytań nie było częścią tego zakresu.

final result: passed

---

## Porada dnia — minimalistyczna pusta historia

**Źródło i stan**

- Źródło wizualne z adnotacją użytkownika: `docs/design-system/evidence/porada-historia-empty-source.png` (377 × 240 px).
- Finalna implementacja: `docs/design-system/evidence/porada-historia-empty-final-390x844.png` (390 × 844 px).
- Focus pustej historii: `docs/design-system/evidence/porada-historia-empty-final-focus.png` (390 × 180 px).
- Viewport: 390 × 844 CSS px, DPR 1. Źródło i focus porównano przy zbliżonej szerokości bez korekty gęstości.
- Stan: `/swiat?panel=porada`, bieżąca rada „Roślina w domu”, brak wcześniejszych porad w historii.

**Dowody porównawcze**

- Pełny widok mobilny: `docs/design-system/evidence/porada-historia-empty-final-390x844.png`.
- Porównanie skupione przed/po: `docs/design-system/evidence/porada-historia-empty-comparison.png` (787 × 240 px).

**Findings**

- Brak otwartych P0/P1/P2. Pusty stan zawiera tylko nagłówek i jedno krótkie zdanie „Poznane rady pojawią się tutaj.”
- Informacja o profilu, cesze i liczbie porad nie jest renderowana, gdy historia jest pusta; pozostaje dostępna po pojawieniu się wpisów.
- Typografia, kolory i ikona nagłówka korzystają z istniejącego stylu panelu. Sekcja zachowuje spokojne odstępy i nie konkuruje z bieżącą poradą.
- Zrzut z przeglądarki potwierdza brak przepełnienia w 390 × 844 px. W konsoli pozostaje istniejące ostrzeżenie API `markTipViewed: Bad Request`, niezwiązane z pustym stanem i bez wpływu na renderowanie.

**Historia porównań**

1. P2: pusty stan zawierał dwa akapity objaśniające mechanikę, profil oraz zapas porad. Naprawa: jedna linia i warunkowe ukrycie stopki przy pustej historii.
2. Po poprawce porównanie `porada-historia-empty-comparison.png` potwierdza krótszy blok oraz zachowanie hierarchii nagłówka.

**Sprawdzone powierzchnie jakości**

- Typografia i copy: krótkie, dziecięce sformułowanie bez języka systemowego.
- Spacing i layout: kompaktowa sekcja, bez poziomego przepełnienia i bez zbędnych bloków tekstu.
- Kolory i tokeny: bez zmian względem zaakceptowanego panelu.
- Assety: istniejąca ikona lampionu zachowana bez zamienników.
- Interakcja i dostępność: region „Rady, które już znasz” oraz tekst pustego stanu są obecne w drzewie dostępności.
- Build: `npm run build` zakończony powodzeniem; 553 moduły przetworzone.

final result: passed

---

## Porada dnia — świeża rada zdrowotna

**Źródło i stan**

- Wybrany mockup: `docs/design-system/evidence/porada-dnia-health-source.png` (1024 × 1536 px).
- Finalna implementacja: `docs/design-system/evidence/porada-dnia-health-mobile-390x844.png` (390 × 844 px).
- Viewport kontrolny: 390 × 844 CSS px, DPR 1; zrzut bez dodatkowego skalowania.
- Stan: `/swiat?panel=porada`, świeża rada „Roślina w domu”, pusta historia porad.

**Dowody porównawcze**

- Pełny widok: oba pliki powyżej, porównane po normalizacji do tej samej szerokości panelu.
- Region skupienia: górna sekcja od ilustracji do granicy historii oraz CTA „Posłuchaj”; mieści się w finalnym zrzucie 390 × 844 px, dlatego osobny crop nie był potrzebny.

**Findings**

- Brak otwartych P0/P1/P2. Świeża rada wykorzystuje całą szerokość panelu i nie jest już osobną kartą z boczną ramką.
- Historia jest oddzielona zmianą tła na jasny lawendowy, odstępem i nagłówkiem z linią, więc nie zlewa się z bieżącą poradą.
- CTA jest lekkim kremowym przyciskiem z zielonym, okrągłym symbolem play i fioletową etykietą; czas pozostaje osobno.
- Akceptowana różnica względem mockupu: rzeczywista treść ma więcej wierszy, więc historia zaczyna się niżej. Widok pozostaje przewijalny, a CTA i początek historii są widoczne w 390 × 844 px.

**Historia iteracji**

1. P2: świeża rada była osadzona w wewnętrznej karcie z pełną ramką. Naprawa: sekcja pełnej szerokości, bez bocznego obrysu, z jedynie dolnym rozdzieleniem.
2. P2: CTA miało ciężką zieloną bryłę i ikonę Liska. Naprawa: kremowa kapsuła z zielonym symbolem play z istniejącego systemu ikon.
3. P2: wersja pośrednia używała symbolu głośnika. Naprawa: wspólny symbol play zgodny z mockupem i funkcją odsłuchu.

**Sprawdzone powierzchnie jakości**

- Typografia i copy: hierarchia chip → tytuł → treść → CTA jest czytelna na telefonie.
- Layout: pełna szerokość świeżej rady, osobna strefa historii, brak poziomego przepełnienia.
- Interakcja i dostępność: `dialog` „Porada dnia”, przycisk „Posłuchaj” oraz region „Rady, które już znasz” są obecne w drzewie dostępności.
- Asset: jedna uniwersalna ilustracja zdrowotna 1536 × 1024 px, używana wielokrotnie bez generowania grafiki dla każdej porady.
- Build: końcowy `npm run build` został ponowiony po ustabilizowaniu równoległych zmian i zakończył się powodzeniem; 553 moduły przetworzone.

final result: passed

---

## Onboarding — kompletny szósty ekran quizu (2026-09-15)

**Źródło i stan**

- Źródło wizualne, stan przed wyborem: `C:/Users/DELL/AppData/Local/Temp/codex-clipboard-835f2d39-36b3-4de5-b2b6-ad0bbe01800e.png` (420 × 919 px).
- Źródło wizualne, stan błędu po wyborze: `C:/Users/DELL/AppData/Local/Temp/codex-clipboard-02574a68-3d23-4792-9209-710a2823c274.png` (429 × 938 px).
- Renderowana implementacja: `http://localhost:3000/onboarding?quiz=1`, zrzuty w Codex In-app Browser przy 420 × 936 CSS px, DPR 1.
- Stan porównania: pytanie 6/6 „Na ścieżce utknął wóz…”, komplet czterech odpowiedzi oraz przejście po zaznaczeniu do nagrody.

**Porównanie pełnego widoku i focusu**

- Pełny widok: oba źródła i finalny mobilny render porównano w bieżącym przeglądzie przy tej samej szerokości około 420 px.
- Focus: karta odpowiedzi 2 × 2. Pomiary DOM potwierdziły cztery obrazy załadowane z `woz-a.webp`…`woz-d.webp`, szerokość około 181 px i jednakową wysokość około 232 px każdego kafelka.

**Findings i historia poprawek**

1. P1: tylko pierwsza odpowiedź miała ilustrację, pozostałe trzy wyglądały jak niedokończone karty tekstowe. Przyczyna: pliki istniały, ale brakowało pól `obraz` w danych Q6. Naprawa: podłączono `woz-b.webp`, `woz-c.webp` i `woz-d.webp`; finalnie wszystkie 24 odpowiedzi quizu mają istniejący asset.
2. P1: ostatnia odpowiedź kończyła się komunikatem „Gracz nie znaleziony”, a ponowienie wysyłało żądanie z tym samym martwym identyfikatorem. Naprawa: identyfikator jest sprawdzany przed quizem, a reset bazy w trakcie quizu uruchamia jednokrotne odtworzenie gracza i ponowne wysłanie kompletu odpowiedzi.
3. P2: po przełączeniu na siatkę drugi rząd był niższy od pierwszego, bo pierwszy podpis zawijał się na dwie linie. Naprawa: równe wiersze siatki i `height: 100%` na kafelkach. Finalny pomiar potwierdza cztery identyczne wysokości.

**Sprawdzone powierzchnie jakości**

- Typografia i copy: krótkie podpisy pozostają czytelne; pytanie zachowuje istniejącą hierarchię Baloo 2.
- Spacing i layout: równa siatka 2 × 2, brak poziomego przepełnienia przy 420 × 936 px, czarodziej i pasek 6/6 pozostają widoczne.
- Kolory i tokeny: kremowe kafelki, złoty rant i fioletowy tekst bez nowych barw.
- Jakość obrazów: cztery spójne scenki z tym samym liskiem, wozem, światłem i gęstością; wszystkie załadowały się z dodatnią `naturalWidth`.
- Interakcja: pełne przejście sześciu pytań zakończyło się ekranem nagrody z CTA „Zobacz, kim jesteś”; brak `.ob-blad`.
- Konsola: brak błędów po pełnym przejściu.
- Build: `npm run build` zakończony powodzeniem; 556 modułów. Test pokrycia potwierdza osiągalność wszystkich sześciu profili; istniejące ostrzeżenie rozkładu MD pozostaje poza zakresem tego ekranu.

**Follow-up Polish**

- Brak otwartych P0/P1/P2 dla pytania 6 i odzyskiwania sesji.

final result: passed
