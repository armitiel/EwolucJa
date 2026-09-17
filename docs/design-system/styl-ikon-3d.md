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
3. Zapisać PNG z `optimize=True`. Mistrz 1024 px zostaje nieśledzony lokalnie.

## Osadzenie w znaku

Ikona (przezroczyste tło) leży na ciemnej granatowej tarczy znaku
(`rgba(36,49,71)`) z pomarańczową obwódką — miękka poświata renderu wtapia się
w tarczę i nie wymaga wycinania.
