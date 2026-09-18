# Powiadomienia — kto mówi, kiedy i w jakim kształcie

> Stan na 18.09.2026. Powstało z jednej obserwacji właściciela: „jest kolizja
> powiadomień". Było ich pięć rodzajów, trzy wyglądały podobnie i dwa potrafiły
> wejść na ekran naraz. Ten plik mówi, który kanał czym jest — i czego nie wolno
> mu robić.

## Cztery kanały

| kanał | kształt | treść | głos | kiedy |
|---|---|---|---|---|
| **Postać mówi** — okno postaci (`PopupPostaci`) | kremowa karta, popiersie NAD kartą, plakietka z imieniem, zielone CTA | tytuł + zdanie + przycisk | tak | zlecenie zadania, nagroda, zaproszenie do minigry |
| **Postać myśli** — myśl Wizkora (`PodpowiedzMedrca`) | zaokrąglony prostokąt z ogonem z kropek do odznaki postaci (`ChmurkaKsztalt`, wariant `prostokatTekst`) | jedno zdanie, pisane literka po literce | tak | rada o ciele, kilka razy na sesję |
| **Świat zaprasza** — wskazówka (`Reflektor` + `wskazowki.js`) | chmurka z popiersiem liska, dzióbek wbity w ikonę doku, obręcz na celu | tytuł + dwie linijki | tak | JEDEN raz na miejsce, którego dziecko jeszcze nie zna (Porada dnia, Minigry); potem milknie na zawsze |
| **Gra przypomina** — ikonki przy awatarze (`ChmurkaAwatara` + `coTeraz.js`) | mała kremowa pigułka ze złotą obwódką pod awatarem, dzióbek w awatar | **same obrazki**, bez tekstu | **nie** | po każdej zmianie etapu zadania |

Do tego dwa kanały bez chmurki: **toast** (pasek na dole — potwierdzenie tego, co
się właśnie stało) i **liczniki HUD** (ile czego mam).

## Zasady, które trzymają to w kupie

1. **Jedna chmurka na ekranie.** Ikonki przy awatarze nie wejdą, gdy widać myśl
   Wizkora (`onWidoczna` → `myslWizkora` w `Swiat.jsx`), wskazówkę Reflektora,
   okno postaci, panel albo minigrę. Etap nie przepada — czeka w kolejce
   (`doPokazaniaRef`) i wchodzi, gdy ekran się uwolni.
2. **Kto mówi zdaniem, mówi rzadko.** Tekst i lektor są w kanałach postaci.
   Kanał, który odzywa się często, jest cichy — inaczej po tygodniu dziecko
   przestaje czytać wszystko.
3. **Cisza po postaci.** Przez minutę po oknie postaci ikonki milczą
   (`CISZA_PO_POSTACI`): Wizkor właśnie to powiedział, powtarzanie tego samego
   trzy sekundy później uczy, że świat mówi dwa razy.
4. **Ten sam etap nie wraca.** Chmurka „co teraz" jest odpowiedzią na ZMIANĘ,
   nie przypominaczem na zegarze.
5. **Kształt znaczy rolę.** Karta = ktoś do Ciebie mówi. Prostokąt z ogonem
   z kropek = ktoś myśli. Pigułka przy awatarze = Twoja własna myśl, co robić.
   Nowy rodzaj powiadomienia nie dostaje nowego kształtu bez powodu.

## Gdzie to siedzi

- `frontend/src/hub/coTeraz.js` — który etap zadania jest teraz otwarty (8 etapów:
  gwiazdki, drewno, puzzle, zadanie w realu) i jakie dwie ikonki to mówią.
- `frontend/src/hub/ChmurkaAwatara.jsx` — sam kanał ikonek.
- `frontend/src/hub/ChmurkaKsztalt.jsx` — wspólny kształt chmurek (obłok i
  prostokąt), wspólna lamówka `--chmurka-akcent`.
- `frontend/src/hub/wskazowki.js` — zaproszenia do miejsc (Reflektor).
- `frontend/src/pages/Swiat.jsx` — kolejka i warunki: kto ma pierwszeństwo.
- Ikony kanału: `public/assets/wskazowki/` i `public/assets/puzzle/ikona-puzzel.png`
  (rodzina D, `docs/design-system/styl-ikon-3d.md`).
