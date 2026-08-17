# Sekret pod puchem — prompty do generowania grafiki

Do `gpt-image-1` (OpenAI Images API). Prompty po angielsku, bo model tak reaguje
lepiej; komentarze po polsku.

**Kolejność pracy:** najpierw **Etap 1** (trzy koncepty całego ekranu) → akceptacja
kierunku → dopiero **Etap 2** (pojedyncze assety). Odwrotnie kończy się dwudziestoma
plikami, z których połowa nie pasuje do siebie.

---

## 0. Parametry API

```python
client.images.generate(
    model="gpt-image-1",
    prompt=PROMPT,
    size="1024x1024",        # 1536x1024 dla koncept artów w poziomie
    quality="high",
    background="transparent",  # TYLKO dla assetów; koncept arty: "opaque"
    output_format="png",
    n=1,
)
```

`background="transparent"` działa wyłącznie z `output_format` `png` albo `webp`.
Przy koncept artach zostaw `opaque` — tam tło jest częścią oceny.

---

## 1. DNA stylu (wklej do KAŻDEGO promptu)

Ten akapit ma się nie zmieniać. To on trzyma dwadzieścia plików w jednej rodzinie.

```
STYLE: stylized 3D claymorphism, Pixar-like children's game art. Soft rounded
forms, matte clay surface with subtle soft-touch texture, no gloss, no plastic
specular highlights. Gentle volumetric shading, soft ambient occlusion in the
creases. Clean silhouette readable at small size. Light comes from the upper
left at a consistent angle across every asset. Warm, friendly, calm — nothing
sharp, nothing scary. No text, no letters, no numbers, no watermark, no UI
elements, no border frame.
```

```
PALETTE (use these exact colors):
cream #FBF1D6, sand #F4E3B8, warm white #FFFDF4,
ink violet #4e4d76, soft violet #B886E8, deep violet #7A4DC2,
amber #F4C95D, dusk orange #E89A3D, leaf green #5FA76F, sky blue #B7E3FF.
```

---

## 2. ETAP 1 — koncept arty (do zatwierdzenia)

Trzy ujęcia całego ekranu. Nie trafią do gry — służą do tego, żeby ocenić
materiał piórka, gęstość kopca i moment odsłonięcia, zanim zrobimy sprite'y.

**Koncept A — kopiec przed rozgarnięciem** (`size="1024x1536"`, `background="opaque"`)

```
[DNA STYLU] [PALETA]
A vertical mobile game screen. The entire frame is covered with a deep drift of
soft clay feathers piled on top of each other — hundreds of small rounded
feathers in cream, sand and warm white, with a few in pale sky blue. The pile is
uneven: denser and taller along the screen edges, slightly thinner in the middle,
so the eye is drawn to the centre. Feathers vary in size — small, medium, large —
and lie at many different angles. Each feather is a simple stylized shape with a
soft central shaft line and a thin darker outline. Behind and above the pile, a
calm gradient sky from light blue to warm sand. Nothing is visible underneath the
feathers yet. Soft, cosy, inviting to touch.
```

**Koncept B — kopiec w połowie rozgarnięty** (`size="1024x1536"`, `background="opaque"`)

```
[DNA STYLU] [PALETA]
A vertical mobile game screen. A drift of soft clay feathers covers most of the
frame, but a wide sweeping channel has been cleared through the middle, as if by
a hand. Along the edges of the channel the feathers are pushed aside and piled
up, some caught mid-air, gently tumbling and rotating. Through the cleared gap a
warm golden glow shines up from underneath, and part of a hidden object is
revealed inside that glow: the wing and beak of a small friendly clay bird. The
rest of the bird is still buried. The light from below makes the surrounding
feathers glow warm at their edges. Magical, calm, the moment just before
recognition.
```

**Koncept C — moment odsłonięcia** (`size="1024x1536"`, `background="opaque"`)

```
[DNA STYLU] [PALETA]
A vertical mobile game screen at the moment of discovery. A single gust has
lifted all the feathers at once — they fly upward and outward in a staggered
wave, rotating, spreading across the frame, leaving the centre clear. In the
centre, fully revealed and lit by a warm radial glow, sits a small friendly clay
bird with big kind eyes, mid-hop, celebrating. Three or four feathers among the
flying ones are golden and spin more slowly than the rest. Sparkles of warm
light. Joyful but soft — a quiet celebration, not fireworks.
```

---

## 3. ETAP 2 — assety do gry

Wszystkie z `background="transparent"`, `output_format="png"`, `size="1024x1024"`.
Zmniejszamy je potem lokalnie: piórka do 256 px, obiekty do 512 px.

### 3.1 Piórka (podstawa kopca)

Jeden szablon, cztery przebiegi. `{KOLOR}` i `{KSZTALT}` podmieniasz.

```
[DNA STYLU] [PALETA]
A single stylized clay feather, isolated on a fully transparent background,
centred in frame with even margin on all sides. {KSZTALT} The feather is
{KOLOR}, matte clay material, with a slightly darker soft central shaft and a
thin darker outline of even thickness around the whole silhouette. Seen flat
from directly above, lying still. No shadow on the ground, no background
elements, no reflections. Simple enough to read clearly at 40 pixels tall.
```

| plik | `{KOLOR}` | `{KSZTALT}` |
|---|---|---|
| `piorko-krem.png` | `cream #FBF1D6 with a soft sand #F4E3B8 shaft` | `Broad and softly rounded at the tip, gently curved like a comma.` |
| `piorko-piasek.png` | `sand #F4E3B8 with a deeper warm shaft` | `Slimmer and longer, with a slight S-curve along its length.` |
| `piorko-biel.png` | `warm white #FFFDF4 with a pale grey shaft` | `Short, wide and fluffy — a small down feather with a soft irregular edge.` |
| `piorko-blekit.png` | `pale sky blue #B7E3FF with a soft violet shaft` | `Medium length, straight, with a slightly pointed tip.` |

**Złote piórko (bonus w kopcu)** — `piorko-zlote.png`

```
[DNA STYLU] [PALETA]
A single stylized clay feather, isolated on a fully transparent background,
centred in frame. Medium length, elegant, gently curved. The feather is warm
amber gold #F4C95D deepening to dusk orange #E89A3D along the shaft, with a
thin darker gold outline. Matte clay with a faint inner glow, as if lit from
within — but still matte, no metallic shine, no glitter. Seen flat from above.
No shadow, no background, no sparkles around it.
```

### 3.2 Obiekty ukryte pod puchem

Sześć na start. Wspólny szablon, `{OBIEKT}` podmieniasz.

```
[DNA STYLU] [PALETA]
{OBIEKT} Isolated on a fully transparent background, centred in frame with even
margin. Seen from the front, slightly above eye level, in a friendly three-quarter
view. Compact chunky proportions, big soft shapes, immediately recognisable from
its silhouette alone. No shadow on the ground, no scenery, no props around it.
```

| plik | `{OBIEKT}` |
|---|---|
| `ukryty-ptak.png` | `A small friendly clay bird with a round body, big kind eyes and a tiny amber beak, sitting calmly.` |
| `ukryty-klucz.png` | `An old ornate key made of warm amber-gold clay, with a round decorated bow and simple teeth.` |
| `ukryty-lis.png` | `The head of a friendly young fox with big green eyes, ginger fur and a cream muzzle, facing forward.` |
| `ukryty-muszla.png` | `A spiral seashell in cream and pale sand tones, with soft ridges.` |
| `ukryty-ksiezyc.png` | `A crescent moon of pale cream clay with a gently smiling sleepy face.` |
| `ukryty-liscik.png` | `A rolled paper scroll tied with a violet ribbon, slightly open at one end.` |

### 3.3 Sylwetki na kafelki odpowiedzi

Do każdego obiektu jedna sylwetka — jednokolorowa, żeby nie konkurowała
z odsłanianym obrazkiem. Plik `sylwetka-<nazwa>.png`.

```
A flat solid silhouette of {OBIEKT — ten sam opis co wyżej, bez kolorów}.
Single flat colour ink violet #4e4d76, no gradient, no shading, no outline,
no detail inside the shape. Isolated on a fully transparent background, centred,
seen from exactly the same angle as the full-colour version. Readable at 48
pixels. No text.
```

**Uwaga:** sylwetka MUSI być z tego samego ujęcia co obiekt kolorowy — inaczej
dziecko nie połączy kafelka z tym, co odsłoniło.

---

## 4. Zasady, które trzymają to w kupie

1. **Jedno światło.** Górne lewe, w każdym pliku. Model o tym zapomina — jeśli
   któryś asset wróci oświetlony z prawej, wygeneruj go ponownie, nie poprawiaj
   w edytorze.
2. **Jedna skala grubości obrysu.** Duże i małe piórka mają mieć kreskę tej samej
   grubości. Model tego nie utrzyma idealnie — dlatego zmniejszamy wszystkie do
   tej samej wysokości i porównujemy obok siebie przed wrzuceniem do gry.
3. **Zero cieni w plikach.** Cień dokłada silnik, tylko dla planu bliskiego.
   Wypalony cień na trzystu sprite'ach to szara breja.
4. **Zero tekstu i ramek.** Model lubi dorzucić podpis albo obramowanie.
5. **Po jednym obiekcie na plik.** Żadnych „sheetów" z czterema piórkami —
   rozcinanie ich to strata czasu i tracisz alfę na krawędziach.

---

## 5. Gdzie to trafia

```
frontend/public/assets/piorka/
  piorko-krem.png       256×256
  piorko-piasek.png     256×256
  piorko-biel.png       256×256
  piorko-blekit.png     256×256
  piorko-zlote.png      256×256
  ukryty-*.png          512×512
  sylwetka-*.png        256×256
```

Po wygenerowaniu daj znać — przycinam do zawartości, skaluję i sprawdzam, czy
alfa nie ma otoczki (ten sam problem, co przy `music.png`, gdzie została
magentowa obwódka po nieprzezroczystym tle).
