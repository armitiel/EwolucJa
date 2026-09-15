# Wizkor — krótka animacja (Higgsfield)

Cel: **jedno krótkie, lekkie ujęcie na moment pochwały** — kiedy dziecko wraca po realnym
działaniu albo kończy zadanie. Reszta popupów zostaje statyczna. Animacja ma być drobna:
gest „super" + ciepły uśmiech, ewentualnie samo mrugnięcie. Nie ma prawa przeciągać sesji
ani ciągnąć wzroku, kiedy nic się nie stało.

---

## 1. Przezroczystość — odpowiedź wprost

Higgsfield (jak każdy generator wideo) **oddaje MP4 bez kanału alfa**. Przezroczystość
robi się dopiero po generacji, dlatego klatka źródłowa jest na płaskim greenscreenie —
zieleń wycinamy, zostaje sam Wizkor.

Formaty, do których można wyeksportować gotową animację z przezroczystością:

| Format | Alfa | Gdzie działa | Uwagi |
|---|---|---|---|
| **Animowany WebP** | tak | wszędzie, zwykły `<img>` | **rekomendacja** — bez polityk autoplay, bez `<video>`, jeden plik |
| WebM / VP9 (`yuva420p`) | tak | Chrome, Edge, Firefox, Android | Safari odtworzy plik, ale **zignoruje alfę** |
| MP4 / HEVC z alfą (`hvc1`) | tak | tylko Safari / iOS / macOS | używany jako druga ścieżka obok WebM |
| Sprite sheet PNG + `steps()` | tak | wszędzie | najbardziej przewidywalny, pełna kontrola klatek |
| APNG | tak | wszędzie | cięższy od WebP przy tej samej jakości |
| Lottie | tak | wszędzie, kilka kB | wektor — **nie da się wygenerować z wideo AI** |

Plan: **animowany WebP** jako główny plik (jeden `<img>`, zero problemów z autoplay na iOS),
a gdyby zabrakło płynności — WebM+HEVC jako para źródeł w `<video>`.
Budżet: do ~250 kB na ujęcie (512 px, ~15 kl/s, ~1,2 s).

---

## 2. Klatki źródłowe (w tym folderze)

| Plik | Kadr | Do czego |
|---|---|---|
| `wizkor-src-green-wide.png` | 1024×1024, postać 654×700, zapas 324 px nad kapeluszem | **gest „super"** — ręka ma gdzie pójść w górę |
| `wizkor-src-green-close.png` | 1024×1024, postać 823×880 | mrugnięcie / uśmiech (bez ruchu ręki) |
| `wizkor-src-magenta-wide.png` | jw., tło #FF00FF | zapas, gdyby model „wciągał" zieleń w postać |

**Wycinanie jest już przetestowane na tym konkretnym Wizkorze** (`test-wycinania-zieleni.png`):
po przepuszczeniu klatki przez cały łańcuch chromakey + despill zostało **zero zielonych
pikseli**, przy 3663 pikselach miękkiej krawędzi — broda i złote obwódki wychodzą czyste.
Czyli ustawienia w `post-produkcja.sh` są dobrane pod tę grafikę, nie wzięte z sufitu.

Zieleń `#00B140` jest bezpieczna — w Wizkorze nie ma ani jednego zielonego piksela
(fiolet, złoto, biel, cera). Dolna krawędź postaci jest równo z dołem kadru celowo:
asset jest ucięty płasko i tak samo siada we wstędze popupu. Gdyby zostawić pod nim tło,
model zacznie dorysowywać brzuch i nogi.

---

## 3. Ustawienia w Higgsfield

- tryb: **image-to-video** (nie text-to-video)
- model: dowolny z listy dostępnych dla obrazu (Kling / Wan / Seedance — bierz ten, który
  w Twoim planie daje **najkrótszy klip i najsłabszy ruch**; potrzebujemy 1,2 s, nie 10 s)
- proporcje: **1:1** (klatka jest kwadratowa, popup też jest prawie kwadratowy)
- rozdzielczość: 1080 lub 720 — wyżej nie ma sensu, i tak skalujemy do 512 px
- długość: **najkrótsza dostępna** (3–5 s); z tego wytniemy ~1,2 s
- kamera: **statyczna / locked-off**, bez push-in, bez orbit, bez żadnego presetu ruchu
- siła ruchu / motion: **niska**
- generuj **3–4 podejścia każdego ujęcia** i wybierz to, w którym dłoń się nie rozpływa —
  modele wideo najczęściej psują właśnie kreskówkowe dłonie i brodę

---

## 4. Prompty

### Ujęcie A — „SUPER" (główne, do momentu pochwały)
Klatka: `wizkor-src-green-wide.png`

```
2D cartoon wizard stays perfectly still and centered. He lifts his right hand from the
ledge and gives a cheerful thumbs-up, then holds it steady. His mouth widens into a warm
closed-lip smile and his eyes squint slightly with joy. One soft blink. The hat, beard and
staff stay in place. Flat solid green screen background stays perfectly even and unchanged.
Locked-off camera, no zoom, no pan, no parallax. Hand-drawn 2D cartoon animation, thick
clean outlines, flat cel shading, identical character design in every frame.
```

### Ujęcie B — mrugnięcie + uśmiech (lżejsza wersja)
Klatka: `wizkor-src-green-close.png`

```
2D cartoon wizard stays perfectly still and centered. He closes and opens his eyes in one
soft blink, then his mouth curves into a small warm smile. Barely visible breathing motion
in the shoulders. Hands, hat, beard and staff do not move. Flat solid green screen
background stays perfectly even and unchanged. Locked-off camera, no zoom, no pan.
Hand-drawn 2D cartoon animation, thick clean outlines, flat cel shading, identical
character design in every frame.
```

### Ujęcie C — iskra na lasce (opcjonalne, jako akcent przy „świat się zmienił")
Klatka: `wizkor-src-green-wide.png`

```
2D cartoon wizard stays completely still. Only the purple crystal on his staff pulses with
a soft glow and a few tiny sparkles rise from it and fade. No character movement at all.
Flat solid green screen background stays perfectly even. Locked-off camera.
Hand-drawn 2D cartoon animation, flat cel shading, identical character design.
```

### Negative prompt (do wszystkich)

```
3D render, photorealistic, realistic skin, morphing face, distorted hands, extra fingers,
melting beard, changing hat shape, different character, camera movement, zoom, dolly,
parallax, background gradient, shadows on the background, green spill on the character,
text, watermark, logo, character leaving the frame, body turning away
```

---

## 5. Czego unikać (zasady, nie kaprysy)

- **żadnego ruchu kamery** — popup ma stać w miejscu; push-in zamienia gest w scenkę
- **żadnego cienia i gradientu na tle** — każdy cień na zieleni psuje wycinanie
- **nie dokładaj mowy ani napisów** — tekst popupu jest osobno i czyta go lektor
- **nie zmieniaj proporcji postaci** — jeśli model „odchudza" Wizkora albo zmienia kapelusz,
  generuj ponownie zamiast poprawiać w post-produkcji
- **nie rób długiego ujęcia** — im dłużej, tym większa szansa, że twarz zacznie płynąć

---

## 6. Co zrobić z wynikiem

Wrzuć pobrane MP4 do podfolderu `surowe/` w tym katalogu, z nazwami:

```
surowe/wizkor-super.mp4       (ujęcie A)
surowe/wizkor-mrugniecie.mp4  (ujęcie B)
surowe/wizkor-iskra.mp4       (ujęcie C, jeśli robisz)
```

Dalej robię ja:

1. wycinam zieleń (chromakey + despill, ffmpeg — patrz `post-produkcja.sh`),
2. przycinam do ~1,2 s i wybieram punkt pętli tak, żeby pierwszą i ostatnią klatkę
   dało się skleić bez przeskoku,
3. wracam do kadru popupu 560×599 i eksportuję animowany WebP (512 px) + w razie potrzeby
   WebM z alfą i HEVC dla Safari,
4. podpinam w kodzie — **wyłącznie w momentach pochwały**, z fallbackiem na dzisiejszy
   `/wizPop.webp` i wyłączeniem przy `prefers-reduced-motion`.

---

## 7. Gdzie to zagra (ustalony zakres)

Tylko sukces: ukończone zadanie, powrót po działaniu w realu, „super".
Powitania, onboarding, chmurka z podpowiedzią i faza „trop" zostają na statycznym obrazku —
gdyby Wizkor machał ręką za każdym razem, gest przestałby cokolwiek znaczyć.
