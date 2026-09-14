# Domek drewniany V4 — reguły konstrukcji

Status: zatwierdzany koncept techniczny. To nie jest jeszcze model 3D.

Plansza referencyjna: `domek-drewniany-dach-warianty-v4-konstrukcja.png`.

## Układ osi i wymiary robocze

- lokalne `Y`: pion domku,
- lokalne `Z`: długość domku oraz kierunek kalenicy,
- lokalne `X`: szerokość elewacji szczytowej,
- szerokość: `4.0`, głębokość: `3.2`, wysokość okapu: `3.0`, wysokość kalenicy: `5.0`,
- połowa rozpiętości i wznios dachu mają po `2.0`, więc obie połacie mają dokładnie `45°`,
- belki konstrukcyjne: przekrój około `0.24 × 0.24`; pokrycie dachu: grubość około `0.16–0.20`.

## Ściany

1. Cztery słupy narożne są pionowe i równoległe w lokalnym układzie domku.
2. Oczepy ścian są poziome. Ich osie kończą się na osiach słupów, bez przenikania i bez szczelin.
3. Nie dodajemy ozdobnych kostek ani osobnych nakładek na końce belek.
4. Końce belek są cięte prostopadle do ich osi albo jednym, powtarzalnym fazowaniem.
5. Rama drzwi i okna jest niezależna od głównej ramy nośnej i nie przecina słupów narożnych.

## Dach

1. Kalenica jest jedną prostą belką równoległą do lokalnej osi `Z`. Ma `pitch = 0°` i `roll = 0°`.
2. Wszystkie lewe krokwie mają obrót `+45°`, a wszystkie prawe `-45°` w przekroju szczytu.
3. Osie par krokwi spotykają się symetrycznie na osi kalenicy. Cięcia przy kalenicy są lustrzane.
4. Deski wiatrowe szczytu leżą w płaszczyznach połaci i kopiują dokładnie kąt krokwi. Na wierzchołku łączą się jednym symetrycznym stykiem, bez wystających klocków.
5. Deski okapowe biegną wzdłuż lokalnej osi `Z`, równolegle do kalenicy. Nie mogą być skręcone względem połaci.
6. Panele pokrycia są płaskie, mają identyczną grubość i jednakowy okap. Ich normalne są zgodne z normalną danej połaci.
7. Uszkodzenie dachu usuwa wyłącznie dwa sąsiednie panele pokrycia. Kalenica, krokwie i deski krawędziowe pozostają całe.
8. Dwa elementy leżące obok domu są dokładnie tymi samymi panelami: zachowują rozmiar, grubość i kąty potrzebne do wstawienia w otwór.

## Styk z kulistym terenem

1. Nie ma podestu, fundamentu, schodka ani rampy.
2. Płaska podłoga wewnętrzna jest styczna do terenu przy progu drzwi.
3. Próg jest na poziomie gruntu i daje bezpośrednie wejście.
4. Dolne krawędzie ścian oraz słupów tworzą osobny kontur dopasowany do rzeczywistego terenu. Narożne słupy mogą schodzić niżej niż środek ściany.
5. Nie wolno obliczać tego konturu tylko z idealnego promienia kuli. Przed wykonaniem siatki należy zmierzyć faktyczną wysokość fasetowanego terenu pod co najmniej siatką `5 × 5` punktów obrysu domu.
6. Obecny loader ustawia cały GLB według wysokości w jednym punkcie centralnym. Samo to nie gwarantuje styku na narożnikach; potrzebny będzie wypalony kontur dla ustalonej pozycji albo proceduralny dolny fartuch dopasowany z pomiarów terenu.

## Kontrola modelu przed eksportem

- symetria krokwi i jednakowy kąt `45°`,
- kalenica, oba okapy i boczne krawędzie paneli są wzajemnie równoległe tam, gdzie powinny,
- brak luźnych końcówek, ozdobnych kostek, szczelin i przenikających się belek,
- brak skręcenia desek wiatrowych i okapowych,
- dwa brakujące panele dokładnie domykają otwór,
- próg nie tworzy uskoku,
- brak prześwitów między dolną krawędzią domu a terenem w całym obrysie.
