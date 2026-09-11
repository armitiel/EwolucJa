**Porównywane źródła**

- Mówiony dymek: `C:/Users/DELL/AppData/Local/Temp/codex-clipboard-25a2914d-e436-4837-942e-e0a0109eb647.png` (594 × 249 px).
- Istniejąca porada Mędrca: `C:/Users/DELL/AppData/Local/Temp/codex-clipboard-d81bb827-9f3c-48ca-8472-2559ff6459b9.png` (416 × 137 px).
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
