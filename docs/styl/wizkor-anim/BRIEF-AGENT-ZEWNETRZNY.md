# Zlecenie: animacja postaci „Wizkor" (image-to-video, Higgsfield)

Brief samowystarczalny — nie wymaga znajomości projektu. Wykonaj dokładnie to, co poniżej,
i nic ponad to. Wszystko, czego nie ma w tym pliku, jest poza zakresem zlecenia.

---

## 1. Kontekst w trzech zdaniach

Wizkor to czarodziej-przewodnik w grze edukacyjnej dla dzieci 6–12 lat. Potrzebna jest
**jedna krótka pętla animacji na moment pochwały** — wyświetlana wtedy, gdy dziecko ukończy
zadanie. Animacja ma być drobna i spokojna: gest „super" plus ciepły uśmiech; nic, co
przyciąga wzrok dłużej niż sekundę.

Materiał trafi potem do przezroczystej pętli na stronie, dlatego **tło musi zostać
jednolicie zielone** — zdejmie je post-produkcja po Twojej stronie odbioru.

---

## 2. Materiał wejściowy

| Plik | Kadr | Do którego ujęcia |
|---|---|---|
| `wizkor-src-green-wide.png` | 1024×1024, postać 654×700 przy dolnej krawędzi, zapas 324 px nad kapeluszem | **ujęcie A i C** |
| `wizkor-src-green-close.png` | 1024×1024, postać 823×880 | ujęcie B |
| `wizkor-src-magenta-wide.png` | jw., tło `#FF00FF` | **tylko awaryjnie**, gdy model wciąga zieleń w postać |

Tło: płaska zieleń `#00B140`. Postać dotyka dolnej krawędzi kadru celowo — to popiersie
ucięte płasko, nie błąd kadrowania.

---

## 3. Co dokładnie zrobić

1. Higgsfield → tryb **image-to-video** (nie text-to-video, nie video-to-video).
2. Wgraj `wizkor-src-green-wide.png`.
3. Wklej **prompt ujęcia A** (rozdział 4) i **negative prompt** (rozdział 5) bez zmian.
4. Ustawienia:
   - proporcje **1:1**
   - długość klipu: **najkrótsza dostępna** (3–5 s)
   - siła ruchu / motion: **niska**
   - kamera: **statyczna**, bez presetu ruchu (żadnego push-in, orbit, dolly, zoom)
   - rozdzielczość 720 lub 1080 — wyżej nie jest potrzebne
5. Wygeneruj **4 podejścia** ujęcia A.
6. Oceń je według rozdziału 6 i **odrzuć wadliwe**. Jeśli wszystkie cztery odpadają,
   wygeneruj drugą turę; jeśli druga tura też odpada, przerwij i napisz w raporcie,
   co konkretnie się psuło.
7. Powtórz punkty 2–6 dla **ujęcia B** (plik `wizkor-src-green-close.png`), tym razem
   wystarczą **2 podejścia**.
8. Ujęcie C generuj **tylko jeśli zostaje budżet** — jest opcjonalne.

---

## 4. Prompty (wklej dosłownie)

### Ujęcie A — „SUPER" (obowiązkowe)

```
2D cartoon wizard stays perfectly still and centered. He lifts his right hand from the
ledge and gives a cheerful thumbs-up, then holds it steady. His mouth widens into a warm
closed-lip smile and his eyes squint slightly with joy. One soft blink. The hat, beard and
staff stay in place. Flat solid green screen background stays perfectly even and unchanged.
Locked-off camera, no zoom, no pan, no parallax. Hand-drawn 2D cartoon animation, thick
clean outlines, flat cel shading, identical character design in every frame.
```

### Ujęcie B — mrugnięcie + uśmiech (obowiązkowe)

```
2D cartoon wizard stays perfectly still and centered. He closes and opens his eyes in one
soft blink, then his mouth curves into a small warm smile. Barely visible breathing motion
in the shoulders. Hands, hat, beard and staff do not move. Flat solid green screen
background stays perfectly even and unchanged. Locked-off camera, no zoom, no pan.
Hand-drawn 2D cartoon animation, thick clean outlines, flat cel shading, identical
character design in every frame.
```

### Ujęcie C — iskra na lasce (opcjonalne)

```
2D cartoon wizard stays completely still. Only the purple crystal on his staff pulses with
a soft glow and a few tiny sparkles rise from it and fade. No character movement at all.
Flat solid green screen background stays perfectly even. Locked-off camera.
Hand-drawn 2D cartoon animation, flat cel shading, identical character design.
```

## 5. Negative prompt (ten sam do wszystkich)

```
3D render, photorealistic, realistic skin, morphing face, distorted hands, extra fingers,
melting beard, changing hat shape, different character, camera movement, zoom, dolly,
parallax, background gradient, shadows on the background, green spill on the character,
text, watermark, logo, character leaving the frame, body turning away
```

---

## 6. Kryteria odbioru — odrzuć podejście, jeśli

- **dłoń gubi palce, zrasta się albo się rozpływa** — to psuje się najczęściej i jest
  jedynym powodem, dla którego generujemy cztery podejścia
- broda albo wąsy zmieniają kształt między klatkami
- kapelusz zmienia sylwetkę, kryształ na opasce znika lub zmienia kolor
- postać obraca tułów, przesuwa się w bok albo wychodzi poza kadr
- kamera drgnęła, najechała albo odjechała
- tło przestało być jednolite: gradient, cień postaci na zieleni, rozjaśnienie przy krawędzi
- styl przeskoczył na 3D, realizm albo inną kreskę
- usta układają się w słowa (postać ma się uśmiechać, nie mówić)
- twarz w którymkolwiek momencie wygląda inaczej niż na klatce wejściowej

Lepiej oddać **jedno czyste podejście** niż cztery „prawie dobre".

---

## 7. Czego NIE robić

- **nie usuwaj tła** i nie eksportuj z przezroczystością — zieleń jest potrzebna w oryginale
- nie przycinaj, nie zmieniaj proporcji, nie skaluj, nie upscaluj
- nie dodawaj dźwięku, lektora, napisów, muzyki ani efektów
- nie montuj, nie zapętlaj, nie zwalniaj i nie przyspieszaj materiału
- nie konwertuj do GIF-a ani WebM — oddajesz surowy MP4 prosto z platformy
- nie „poprawiaj" promptu według własnego pomysłu; jeśli uważasz, że prompt jest zły,
  napisz to w raporcie zamiast zmieniać po cichu

---

## 8. Co oddać

Pliki MP4 **bez żadnej obróbki**, w oryginalnej rozdzielczości, nazwane:

```
wizkor-super-1.mp4      wizkor-super-2.mp4   (i kolejne, jeśli więcej przeszło odbiór)
wizkor-mrugniecie-1.mp4
wizkor-iskra-1.mp4      (jeśli robione)
```

Do tego krótki raport (5–8 zdań), w którym podajesz:

1. użyty model i długość klipu,
2. ile podejść wygenerowano, ile odrzucono i z jakiego powodu,
3. które podejście uważasz za najlepsze i dlaczego,
4. czy trzeba było sięgnąć po wariant magenta,
5. zużyte kredyty.

---

## 9. Uwagi techniczne, które oszczędzą pytania

- **MP4 bez kanału alfa jest oczekiwany.** Higgsfield nie umie inaczej i nie trzeba
  szukać obejścia — przezroczystość powstaje później, z wycięcia zieleni.
- **Zieleń `#00B140` jest bezpieczna** dla tej postaci: w grafice nie ma ani jednego
  zielonego piksela (fiolet, złoto, biel, cera). Wycinanie zostało już przetestowane
  na tym assecie i daje zero zielonych pikseli — pod warunkiem, że tło w klipie
  pozostanie płaskie.
- **Krótko znaczy krótko.** Z klipu zostanie wykorzystane około 1,2 sekundy. Dłuższe
  ujęcie to wyłącznie większa szansa, że twarz zacznie płynąć.
- Konto i kredyty Higgsfield są po stronie zlecającego — jeśli nie masz dostępu,
  zgłoś to od razu, zamiast zakładać własne.
