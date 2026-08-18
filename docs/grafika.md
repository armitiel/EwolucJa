# Jak powstaje grafika w EwolucJA

Dokument opisuje CAŁĄ drogę obrazka: od promptu albo pliku od Ciebie, przez
odchudzanie, po miejsce w kodzie. Zawiera też błędy, które już popełniliśmy —
żeby nie popełniać ich drugi raz.

Prompty do konkretnej gry („Sekret pod puchem") leżą osobno w
[`prompty-piorka.md`](prompty-piorka.md). Tutaj są zasady wspólne.

---

## 1. Trzy źródła grafiki

| źródło | kiedy | przykłady |
|---|---|---|
| **generator (OpenAI `gpt-image-1`)** | przedmioty, postacie, tła — wszystko, co ma wyglądać na ulepione z gliny | piórka, klucz, kryształ, sowa, Wizkor przy stole |
| **rysowane w kodzie (Pillow)** | rzeczy geometryczne i takie, które muszą się zgadzać co do piksela z UI | rewers karty, tekstura karty 3D |
| **pliki od Ciebie** | gdy masz gotowy element albo poprawiłeś wygenerowany | `stol_.png`, `lis_.png`, `wi_.png`, `tra.png` |

Wszystkie trzy przechodzą przez **ten sam etap odchudzania** (punkt 4). Plik,
który trafia do `public/`, nigdy nie jest tym, co wyszło z generatora.

---

## 2. DNA stylu

Ten blok wchodzi do **każdego** promptu bez zmiany słowa. To on trzyma
kilkadziesiąt plików w jednej rodzinie — zwłaszcza stały kierunek światła,
który model gubi najczęściej.

```
STYLE: stylized 3D claymorphism, Pixar-like children's game art. Soft rounded
forms, matte clay surface with a subtle soft-touch texture, no gloss, no plastic
specular highlights, no glitter. Gentle volumetric shading, soft ambient
occlusion in the creases. Clean silhouette readable at 40 pixels. Light comes
from the upper left. Warm, friendly, calm — nothing sharp, nothing scary.
No text, no letters, no numbers, no watermark, no border, no frame,
no ground shadow, no background elements.

PALETTE: cream #FBF1D6, sand #F4E3B8, warm white #FFFDF4,
ink violet #4e4d76, soft violet #B886E8, deep violet #7A4DC2,
amber #F4C95D, dusk orange #E89A3D, leaf green #5FA76F, sky blue #B7E3FF.
```

Paleta to te same barwy, co w `src/styles/ewolucja.css`. Jeśli kiedyś zmienimy
tokeny UI, ten blok trzeba zmienić razem z nimi — inaczej gra rozjedzie się
kolorystycznie z własną grafiką.

---

## 3. Parametry API i prompty, które działają

```python
client.images.generate(
    model="gpt-image-1",
    prompt=f"{DNA}\n\n{OPIS}",
    size="1024x1024",        # 1024x1536 pion, 1536x1024 poziom
    quality="high",
    background="transparent",  # obiekty; tła i koncepty: "opaque"
    output_format="png",       # transparent działa tylko z png/webp
    n=1,
)
```

Klucz API skrypty szukają w tej kolejności: `OPENAI_API_KEY` → `OPENAI_API` →
`tmp/openai.key` → `~/Desktop/api.txt`. Klucze zaczynające się od `sk-ant-`
są pomijane (to Anthropic, nie OpenAI — już raz kosztowało to trzy błędy 401).

### Reguły promptowania wyuczone na własnych błędach

1. **Nie nazywaj kształtu — opisz go.** „Feather" model rozumiał jako LIŚĆ:
   symetryczny, z żyłkowaniem, ząbkowany. Dopiero opis („asymetryczny wachlarz,
   jedna miękka stosina przesunięta z osi, puszysty nierówny brzeg") plus wprost
   zakazane cechy („this is NOT a leaf — no veins, no serrated edge") dały pióro.
2. **Zakazuj wprost tego, czego nie chcesz.** Model dorzuca rekwizyty: karty,
   kostki, kartkę w dłoniach. Pomaga zdanie w rodzaju „the fox is the ONLY thing
   in the picture. Nothing else at all: no cards, no tiles, no toys, no paper".
3. **Kadr i orientację opisuj jak instrukcję montażową.** „Rzut z góry" nie
   wystarcza. Działa wyliczanka: co jest na DOLE kadru, co na GÓRZE, co jest
   ucięte krawędzią, czego NIE widać („no eyes, no nose — if any facial feature
   is visible, the picture is wrong").
4. **Jedna rzecz na plik.** Żadnych „sheetów" — rozcinanie kosztuje więcej niż
   osobna generacja i psuje alfę na krawędziach.
5. **Zero cieni w pliku.** Cień dokłada CSS albo silnik 3D. Wypalony cień na
   trzystu sprite'ach to szara breja.
6. **Licz na 2–3 podejścia.** Lisek do stołu miał sześć wersji, zanim usiadł
   tyłem do gracza. Poprzednie zostają w `tmp/` do porównania.

---

## 4. Odchudzanie — obowiązkowe

Plik z generatora waży 1,5–2,7 MB. W grze ma ważyć kilkadziesiąt kB, bo
wczytuje się na telefonie w tle rozgrywki.

```python
im = Image.open(zrodlo).convert('RGBA')
im = im.crop(im.getbbox())                  # 1. przytnij do zawartości
s = SZEROKOSC_DOCELOWA / im.width
im = im.resize((SZEROKOSC_DOCELOWA, round(im.height*s)), Image.LANCZOS)
im.quantize(colors=160, method=Image.FASTOCTREE).save(cel, optimize=True)
```

**Przycięcie do alfy jest pierwsze** — inaczej skalujesz przezroczyste
marginesy i tracisz rozdzielczość na nic.

| rodzaj | szerokość | format | typowo |
|---|---|---|---|
| ikonka w UI (gwiazdka, klucz) | 192–256 px | PNG, 128 kolorów | 6–18 kB |
| symbol na karcie, obiekt do zgadywania | 256–512 px | PNG, 144–160 kolorów | 6–45 kB |
| postać w scenie (Wizkor, lisek) | 620 px | PNG, 160 kolorów | 45–70 kB |
| duży element (blat) | 820 px | PNG, 128 kolorów | ~64 kB |
| tło bez przezroczystości (trawa) | 900 px | **JPEG** q78–82 | 45–96 kB |
| tekstura modelu 3D | 512 px | PNG, 96–128 kolorów | 5–10 kB |

Kwantyzacja (`quantize`) to największa oszczędność przy glinie: płaskie pola
i miękkie cienie schodzą do 128 kolorów bez widocznej różnicy. Zdjęciowe
gradienty (niebo, trawa) idą do JPEG-a.

Po zapisaniu sprawdź alfę: `im.getextrema()` na kanale alfa i piksel w rogu.
Jeśli w rogu siedzi kolor tła zamiast zera — masz otoczkę (tak było
z `music.png`, gdzie została magentowa obwódka po nieprzezroczystym tle).

---

## 5. Gdzie co leży

```
frontend/public/
  star.png                      ikonki globalne (gwiazdka, music, avatary)
  assets/piorka/                „Sekret pod puchem": piórka, obiekty
  assets/karty/                 „Pamięć Mędrca": symbole, rewers, scena stołu
  assets/wejscie/               ekran startowy: klucz, tło
  scena-3d/assets/*.glb         modele 3D (w tym karta.glb)
docs/
  grafika.md                    ten plik
  prompty-piorka.md             prompty i koncepty jednej gry
scripts/
  assety-piorka.py              piórka i obiekty do zgadywania
  assety-karty.py               symbole kart + scena stołu
  assety-wejscie.py             klucz na ekran logowania
  rewers-karty.py               rewers karty rysowany w kodzie (2 warianty)
  karta-glb.py                  model 3D karty razem z teksturą
  koncepty-piorka.py            koncept arty do zatwierdzenia kierunku
```

---

## 6. Pułapki, które już nas kosztowały czas

- **Proporcje kadru vs `object-fit: cover`.** Rewers karty przyszedł jako
  pionowa karta 2:3 ze złotą ramką. Kafelek w grze jest kwadratowy, więc `cover`
  przyciął środek i z ramki zostały dwa jasne pionowe pasy — plansza wyglądała
  jak zebra. Zasada: **kadr grafiki musi mieć proporcje miejsca, w którym
  usiądzie.** Jak miejsc jest kilka, rób kilka wariantów (`rewers.png` 1:1
  i `rewers-3d.png` 2:3).
- **Kafelkowanie tła.** Trawa kafelkowana pokazuje siatkę powtórzeń — oko
  wyłapuje każdy powtórzony kępek. Jednorodne tła dajemy jako JEDEN kadr
  z `cover`.
- **Przezroczystość w modelach 3D.** `alphaMode` inny niż `OPAQUE` już raz
  rozłożył scenę. Zaokrąglone rogi karty są NAMALOWANE ciemnym fioletem, nie
  wycięte alfą.
- **Nie generuj tego, co już masz.** Cztery symbole kart to pliki z gry
  w piórka, gwiazdka to ta z ekranu wyniku. Mniej plików = mniej miejsc,
  w których świat może się rozjechać.
- **Trzymaj oryginały.** Wersje robocze zostają w `tmp/` (`lis-dol-v1…v5.png`).
  Kosztują zero, a pozwalają wrócić do wcześniejszego ujęcia bez płacenia za
  generację.

---

## 7. Zanim wrzucisz asset do repo

1. Przycięty do zawartości i przeskalowany do rozmiaru z tabeli w punkcie 4.
2. Waga w granicach z tej tabeli (grafika gry ≠ grafika na stronę).
3. Alfa czysta, bez otoczki po tle.
4. Wygląda dobrze w DOCELOWYM rozmiarze, nie tylko w podglądzie 1:1 —
   sprawdź symbol przy 40 px, ikonkę przy 24 px.
5. Kolory z palety; jeśli asset ma sąsiadować z innym, obejrzyj je razem.
6. Skrypt, który go wygenerował, jest w `scripts/` i da się go uruchomić
   ponownie.
