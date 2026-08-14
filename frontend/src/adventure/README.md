# Przygoda — „Mapa, która zgubiła Iskry"

Nowe doświadczenie dziecka. Warstwa jest **sterowana danymi**: silnik nie zna ani
jednego zdania fabuły, więc kolejne przygody dokłada się jako pliki, a nie jako kod.

## Układ

```
adventure/
  data/
    mapa-iskier.v1.json      ← cała przygoda: krainy, postacie, sceny, wybory, misje, nagrody
    chwile-swiatla.v1.json   ← Chwile Światła / Iskra Dnia
  engine/
    useAdventure.js          ← maszyna stanu scen i pętli misji
    adventureState.js        ← trwałość (localStorage) + synchronizacja z API + mapowanie cech
    notifications.js         ← fundament powiadomień (w prototypie symulowane w aplikacji)
  audio/sceneAudio.js        ← stany audio, ducking, głos z gotowych plików
  art/                       ← sceny i postacie jako wektor (SVG w React)
  components/                ← dialog, wybory, misja, czekanie, nagroda, Chwila Światła
  styles/adventure.css       ← język wizualny
```

Ekrany: `src/pages/Przygoda.jsx` (`/przygoda`, `/przygoda/:view`) i
`src/pages/MapaSwiata.jsx` (`/mapa`).

## Trzy zasady, których nie wolno złamać

1. **Pierwsza historia działa bez API i bez konta.** Źródłem prawdy jest
   localStorage; sieć jest wyłącznie synchronizacją. Każdy błąd sieci jest
   połykany i nie zatrzymuje dziecka.
2. **Dźwięk nigdy nie blokuje decyzji.** Nie ma `onEnd` sterującego interfejsem.
   Głos to gotowe pliki `/vo/<id>.mp3`; brak pliku oznacza ciszę, nie czekanie.
   Synteza mowy na żywo nie jest w ścieżce krytycznej.
3. **Mini-gra i misja pojawiają się po fabularnej potrzebie, nigdy przed nią.**
   Kolejność: przeszkoda → decyzja dziecka → działanie → skutek na mapie.

## Jak dodać przygodę

1. Skopiuj `data/mapa-iskier.v1.json`, nadaj nowe `id` i `version`.
2. Zarejestruj plik w `ADVENTURES` w `engine/useAdventure.js`.
3. Nowe rodzaje kroków dodaje się w dwóch miejscach: obsługa w `Przygoda.jsx`
   i (jeśli to instrukcja sceniczna) w `SIDE_EFFECT_STEPS`.
4. Nowy element wyglądu awatara: wpis w `grants` w danych + jeden przypadek
   w `GRANT_ART` w `art/characters.jsx`.

## Cechy

Dziecko widzi pięć wymiarów (ciekawość, tworzenie, współpraca, odwaga,
wytrwałość). `adventureState.toLegacyScores()` przelicza je na istniejące kody
`EM/ST/KR/LD/DT/MD`, dzięki czemu radar, raporty mentora i biblioteka 336 misji
działają bez zmian. Mapowanie: `TRAIT_TO_LEGACY`.

## Testy

```
node e2e/przygoda.mjs offline                        # bez backendu — sprawdza wymóg offline
BASE_URL=http://127.0.0.1:3000 node e2e/przygoda.mjs online   # z backendem i pętlą Mentora
```

Zrzuty ekranu i raport lądują w `e2e/shots/<tryb>/`.
