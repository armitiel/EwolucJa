# Styl ikon HUD / znaczników — wzorzec: siekiera

Ikony w znaczkach nad światem (siekiera we wskaźniku ścinania, domek
placu budowy, kolejne narzędzia) mają jeden styl. Opis wszystkich rodzin grafik
(postacie, HUD, surowce, wskaźniki): [`styl-ilustracji-i-ikon.md`](styl-ilustracji-i-ikon.md).
Domek wyszedł w wariancie claymorphism, który od 17.09.2026 jest dozwolonym stylem —
przy kolejnej ikonie wskaźnika wybierz wzorzec (siekiera albo domek) i trzymaj się go. **Tego stylu nie opisujemy
słowami — podajemy go OBRAZEM.**

## Lekcja, która kosztowała dwie generacje

Próba opisania stylu promptem („soft 3D, chunky rounded forms, satin finish,
soft ambient occlusion") dała **dwa razy z rzędu napuchniętą, matową glinę** —
plastelinowy domek, który z siekierą nie miał nic wspólnego. Słowa typu
„rounded", „soft", „clay", „satin" ciągną model prosto w claymorphizm.

To ten sam wniosek, który `docs/grafika.md` (rozdz. 2b) zapisał już dla
ilustracji pop-upowych: **gpt-image-1 nie ma seeda ani ID stylu, więc jedyne,
co da się „zapisać", to referencje.**

## Jak to robimy (droga, która działa)

`images.edit` z **referencją stylu w załączniku**, a prompt mówi WYŁĄCZNIE,
co ma być na obrazku — o stylu ani słowa.

- **Referencja stylu:** `docs/styl/rabanie/siekiera-styl.png` (siekiera, 512 px).
  512 px celowo — pełnowymiarowe pliki potrafią wisieć przy uploadzie.
- **Skrypt wzorcowy:** `scripts/gen-siedlisko.mjs` (endpoint `images/edits`).
- **Parametry:** `gpt-image-1`, `size 1024x1024`, `quality high`,
  `background transparent`, `n 1`.
- **Klucz:** z `backend/.env`, odpalane z maszyny autora (sandbox blokuje OpenAI).

### Szkielet promptu

```
The attached image is an existing icon from this game. Draw the new icon so that
it belongs to the same set: the same rendering, the same surface finish and
materials, the same lighting, the same level of detail and the same overall feel
— as if the same artist made one more icon for the same game.

WHAT TO DRAW: {jedno zdanie, co to jest}

FRAMING: one single object, centred, filling the frame with an even margin,
isolated on a fully transparent background. No ground, no cast shadow, no text,
no letters, no frame, no background elements.
```

**Dorzucenie nowej ikony do `docs/styl/rabanie/` poszerza wzorzec** — to jest
miejsce, w którym „uczy się" ten styl.

### Zrobione tą drogą

| ikona | skrypt | mistrz | gdzie leży |
|---|---|---|---|
| domek (plac budowy) | `scripts/gen-siedlisko.mjs` | — | `public/scena-3d/assets/ikona-siedlisko.png` |
| lupa + puzelek (chmurka mówiąca obrazkami) | `scripts/gen-ikony-wskazowki.mjs` | `lupa-surowa.png`, `puzzel-surowy.png` | `public/assets/wskazowki/ikona-lupa.png`, `public/assets/puzzle/ikona-puzzel.png` |

Lupa i puzelek powstały **jedną generacją jako para**, bo wyświetlają się na
przemian w tej samej chmurce — ikony robione osobno, innego dnia, „prawie" do
siebie pasują, a przy przejściu widać każdą różnicę. Obróbka (przycięcie do
alfy, wyśrodkowanie, 256 px): `scripts/ikony-wskazowki-obrobka.py`.

## Co widać na wzorcu (do oceny wyniku, nie do promptu)

Opis poniżej służy WYŁĄCZNIE do sprawdzenia, czy wynik trafił — nie wkłada się
go do promptu:

- płaskie fazy i wyraźne krawędzie brył, nie napuchnięte poduchy;
- czysta, gładka powierzchnia z jednym wyraźnym rozświetleniem; bez chropowatej,
  „ulepionej" tekstury i bez matu plasteliny;
- rzut 3/4 z lekkiej góry, czytelna sylwetka przy 40 px;
- miękkie, równe światło z góry-lewej, delikatne AO w zagięciach;
- bez ciemnego konturu i bez cel-shadingu;
- ciepła paleta z jednym akcentem; w siekierze chłodna stal robi kontrast.

Jeśli wynik wygląda na miękką plastelinę — odrzucamy i powtarzamy z referencją,
a nie „poprawiamy" prompt kolejnymi przymiotnikami.

## Obróbka po generacji

1. Przyciąć do alfy (`getbbox`) i wyśrodkować na kwadracie — inaczej obiekt
   siedzi w znaku krzywo.
2. Przeskalować do **256 px** (znak rysuje ikonę przy ~78 px, 256 starcza z zapasem).
3. **Dokleić obrys** — `scripts/ikony-obrys.py`, opis niżej. Krok OSTATNI
   i jednorazowy: skrypt NIE jest idempotentny, drugie uruchomienie na tym samym
   pliku doklei drugi rant.
4. Zapisać PNG z `optimize=True`. Mistrz 1024 px zostaje nieśledzony lokalnie.

Kroki 1–2 robi `scripts/ikony-wskazowki-obrobka.py`, krok 3 — `ikony-obrys.py`.
Ten pierwszy nic nie wie o obrysie, więc **po każdej regeneracji ikon trzeba
przejechać drugim**, inaczej zestaw wraca do wersji bez konturu.

### Obrys: rant w kolorze wypełnienia

Generator nie rysuje konturu — i nie każemy mu (patrz „Co widać na wzorcu"),
bo prośba o kontur w prompcie ciągnie model w cel-shading. Ikona wychodzi więc
jako miękka bryła z samym cieniem renderu. Na ciemnej tarczy znaku to
wystarcza. Na **kremowym kaflu HUD-u i w chmurce podpowiedzi — nie**: jasna
ikona na jasnym tle rozmywa się z półtora metra od tabletu, a tam właśnie
siedzi dziecko.

Wzorcem jest `/star.png` — jedyna ikona, która czytała się z odległości od
początku. Pomiar jej krawędzi (profil jasności wzdłuż odległości od konturu)
pokazuje, skąd to się bierze:

| odległość od krawędzi | RGB | V | S |
|---|---|---|---|
| 1–5 px (rant) | 163, 89, 2 | 0,64 | 0,99 |
| od 8 px (wypełnienie) | 249, 208, 34 | 0,97 | 0,86 |

Czyli **ten sam odcień, jasność ×0,65, nasycenie dobite do maksimum**, pas
szerokości ~2,9 % rozmiaru ikony. To nie jest czarny kontur (rodzina E) ani
ciemny brąz (rodzina B) — rant jest z tej samej barwy, co ikona, tylko
głębszej. Dlatego trzyma się i na kremie, i na zieleni świata, i nie zmienia
charakteru bryły: z bliska go nie widać, z daleka robi sylwetkę.

`scripts/ikony-obrys.py` odtwarza ten rant na dowolnej ikonie:

- **rysuje NA ZEWNĄTRZ kształtu**, nie przemalowuje krawędzi grafiki — render
  ma na obrzeżu własne cieniowanie i przyciemnienie go po raz drugi zjadałoby
  detal;
- **kolor bierze z najbliższego piksela WNĘTRZA**, nie z wygładzonej krawędzi,
  więc ikona wielobarwna dostaje kontur idący za lokalnym kolorem — lupa ma
  osobny rant przy drewnianej rączce i osobny przy szkle;
- domyślna grubość to 4,2 % dłuższego boku kształtu: obrys zewnętrzny musi być
  odrobinę szerszy niż wewnętrzny rant gwiazdki, żeby ważył optycznie tyle samo.

### Ile płótna ma zajmować kształt

Krok 1 łatwo obejść. Jeżeli render zostawia w alfie miękki cień albo poświatę,
`getbbox` bierze ją razem z obiektem i na płótnie zostaje przezroczysty pas.
Zestaw z 17.09.2026 miał przez to kształt na **58–75 %** płótna, każda ikona
inaczej — a `object-fit: contain` skaluje do PŁÓTNA, nie do kształtu. Skutek:
puzelek mierzył w liczniku **19,9 px** obok **31 px** gwiazdki w tym samym
kaflu, choć CSS obu kazał mieć 31.

**Nie da się tego naprawić numerem w CSS.** Każda ikona potrzebowałaby innego,
a przy następnej generacji wszystkie by się przesunęły — dokładnie to zdarzyło
się już raz, `.popup-postaci-cel--puzzle { width:56px }` było próbą ratowania
proporcji w drugą stronę. Reguła: kształt zajmuje **~96 % płótna**, płótno jest
**kwadratowe** (reguły CSS ustawiają `width == height`, więc kwadrat znaczy
„dłuższy bok wypełnia kafelek"). `ikony-obrys.py` robi ten kadr przy okazji
obrysu; przy ikonie spoza tego potoku warto sprawdzić:

```python
from PIL import Image
import numpy as np
im = Image.open(p).convert("RGBA")
ys, xs = np.nonzero(np.array(im)[..., 3] > 6)
print(max(xs.ptp(), ys.ptp()) / max(im.size))   # ma wyjść ~0,96
```

## Osadzenie w znaku

Ikona (przezroczyste tło) leży na ciemnej granatowej tarczy znaku
(`rgba(36,49,71)`) z pomarańczową obwódką — miękka poświata renderu wtapia się
w tarczę i nie wymaga wycinania.
