# narzedzia — łatki na zbudowany moduł sceny

Scena 3D (`public/scena-3d/scena3d.js` i `scena3d.esm.js`) jest **zminifikowanym
bundlem**, a nie kodem źródłowym. Zmian nie da się w nim czytać z diffa, więc
każda wchodzi przez skrypt, który podmienia konkretne łańcuchy i **przerywa
pracę, jeśli wzorzec nie trafi dokładnie raz**. Skrypty są jedyną czytelną
dokumentacją tego, co siedzi w bundlu ponad oryginalny build.

Leżą tutaj, a nie w `public/`, bo wszystko z `public/` trafia do produkcji —
narzędzia deweloperskie nie mają po co jechać do przeglądarki dziecka.

Uruchamianie z katalogu `frontend`:

```bash
python3 narzedzia/czarodziej-lata-modul.py public/scena-3d/scena3d.js public/scena-3d/scena3d.esm.js
python3 narzedzia/czarodziej-strojenie.py public/scena-3d/scena3d.js public/scena-3d/scena3d.esm.js
```

| skrypt | co robi | powtarzalny |
|---|---|---|
| `czarodziej-lata-modul.py` | Dokłada czarodzieja: mikser animacji dla znaków, cykl znikania po czasie, losowe miejsce przy powrocie, własny promień zasięgu, dotknięcie raz na podejście, API `schowajZnak`. | **nie** — druga próba zgłosi 0 trafień i przerwie |
| `czarodziej-strojenie.py` | Podmienia całą definicję znaku czarodzieja (skala, jasność, lewitacja, rytm) i uzależnia promień uzbrojenia od definicji. | tak — nadpisuje poprzednie wartości |
| `cien-pod-nogi.py` | Przesuwa cień bohatera do przodu, w stronę patrzenia (`heading`), zamiast trzymać go pod środkiem modelu. | tak — wzorzec łapie też wartość już ustawioną, więc da się stroić |

Po każdej zmianie w bundlu **podbij `WERSJA_SCENY`** w
`src/components/Scena3D.jsx`. Pliki w `public/` nie mają hasha w nazwie, więc
bez tego przeglądarka poda z cache starą scenę. Numer ma tylko rosnąć.
