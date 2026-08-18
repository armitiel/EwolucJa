# Moduł 3D — mapka i postać (EwolucJA)

Samodzielna scena WebGL: jedna animowana postać low-poly na spokojnej mapie
izometrycznej, dwa świecące znaki (medal = wejście do minigry, liść = pamiątka).
Moduł **nie dotyka** routingu aplikacji, kont, API ani danych dziecka i **nie
wchodzi w build Vite** — leży w `public/`, więc jest kopiowany 1:1 do `dist/`.

## Co tu jest

| plik | do czego |
|---|---|
| `index.html` | gotowa strona pod adresem **`/scena-3d/`** (pion, pełny ekran) |
| `scena3d.js` | bundle uruchamiający scenę na stronie (three.js w środku) |
| `scena3d.esm.js` | ten sam moduł jako ES module — do osadzenia w aplikacji |
| `assets/*.glb` | modele: bohater (539 kB), medal (241 kB), liść (223 kB) |
| `podglad-offline.html` | ta sama scena w JEDNYM pliku (modele w base64) — otwiera się z dysku podwójnym klikiem |

Adresy zasobów strona ustala sama ze swojego adresu, więc folder można przenieść
pod inny prefiks bez przebudowy.

## Podgląd bez serwera

`index.html` ładuje osobne pliki, więc **z dysku (`file://`) się nie uruchomi** —
przeglądarki blokują moduły ES otwierane z dysku. Dlatego podwójny klik na
`index.html` przeskakuje automatycznie na `podglad-offline.html`, który działa
bez serwera. Lokalnie z serwera: `npm run dev` → `http://localhost:3000/scena-3d/`.

## 1. Osobny adres (nic nie trzeba integrować)

Po deployu: **`/scena-3d/`**. Parametry:

- `?panel=0` — chowa przyciski deweloperskie (Stój / Idź / Powtórz chód,
  przełącznik biegu) — widok dla dziecka,
- `?spokojnie=1` — wymusza spokojny ruch (jak `prefers-reduced-motion`).

Można też wstawić jako `<iframe src="/scena-3d/?panel=0">` — moduł sam wykrywa
iframe i wysyła zdarzenia przez `postMessage`:

```js
window.addEventListener('message', (e) => {
  if (e.data?.scena3d === 'zdarzenie' && e.data.nazwa === 'minigra:start') otworzMinigre();
});
// komendy w drugą stronę:
iframe.contentWindow.postMessage({ scena3d: 'komenda', metoda: 'pauza' }, '*');
```

## 2. Osadzenie w aplikacji (React)

Bez dodawania three.js do `package.json` — moduł ładuje się dynamicznie z `public/`:

```jsx
import { useEffect, useRef } from 'react';

export default function Scena3D({ onMinigra }) {
  const ref = useRef(null);
  useEffect(() => {
    let scena;
    let zywe = true;
    import(/* @vite-ignore */ '/scena-3d/scena3d.esm.js').then(async (m) => {
      scena = await m.utworzScena3D({
        kontener: ref.current,
        zasoby: '/scena-3d/assets/',
        panel: false,
      });
      if (!zywe) return scena.zniszcz();
      scena.on('minigra:start', ({ znak }) => onMinigra?.(znak));
    });
    return () => { zywe = false; scena?.zniszcz(); };
  }, [onMinigra]);
  return <div ref={ref} style={{ position: 'absolute', inset: 0 }} />;
}
```

Albo jako element własny (bez Reacta):

```html
<script type="module">
  import { zarejestrujElement } from '/scena-3d/scena3d.esm.js';
  zarejestrujElement();
</script>
<ewolucja-scena-3d zasoby="/scena-3d/assets/" bez-panelu style="position:absolute;inset:0"></ewolucja-scena-3d>
```

## API

**Zdarzenia** (`scena.on(nazwa, fn)`, `onZdarzenie`, oraz `scena3d:<nazwa>` na węźle DOM):

| zdarzenie | dane | kiedy |
|---|---|---|
| `gotowa` | `{ klipy }` | model i mapa wczytane |
| `minigra:start` | `{ znak, etykieta, palcem, poDomknieciu }` | dziecko weszło w medal — **tu odpalić minigrę** (`poDomknieciu` = 0,95 s animacji odlotu) |
| `znak:dotkniety` | `{ znak, etykieta, palcem }` | dotknięcie znaku stałego (liść) |
| `bohater:doszedl` | `{ x, z, latarnia }` | dotarcie do wskazanego punktu |
| `latarnia:reakcja` | `{ faza }` | sekwencja radości przy latarni |
| `pauza`, `wznowienie`, `zniszczona`, `blad` | — | stan modułu |

**Metody:**

```js
scena.pauza(); scena.wznow();            // np. gdy otwierasz minigrę na wierzchu
scena.ustawBohatera(x, z);               // przestawienie bohatera
scena.ustawSpokojnyRuch(true);           // wyciszenie animacji
scena.ustawPowrotZnaku('medal', false);  // medal ma zostać zabrany po wejściu
scena.pokazZnak('medal');                // przywróć po zamknięciu minigry
scena.stan();                            // { gotowa, pauza, animacja, bohater, znaki }
scena.zniszcz();                         // zwolnienie WebGL i usunięcie węzła
```

Domyślnie medal wraca sam po 3,2 s — to zachowanie prototypu. Po podpięciu
minigry ustaw `ustawPowrotZnaku('medal', false)` i wołaj `pokazZnak('medal')`
po jej zamknięciu.

## Sterowanie

Przeciągnięcie palcem = kierunek (joystick pojawia się pod palcem), trzymanie
dłużej = bieg, dotknięcie ścieżki = dojście do punktu, dotknięcie znaku =
reakcja. Na komputerze działają strzałki i Shift (można wyłączyć:
`klawiatura: false`).

## Wydajność

Ortograficzna kamera, materiały Lambert, brak cieni rzucanych, modele odchudzone
(mapa bazowa JPEG, zbędne tekstury zamienione na 1×1 px). Wersja z osobnymi
plikami to ~1,7 MB, z czego 1 MB to modele — trafiają do cache przeglądarki, więc
kolejne wejścia są natychmiastowe.

## Mapa świata i edytor

Geometria sceny — ścieżka, rzeka, most, brama, latarnia, drzewa, głazy, budynki
i znaki minigier — leży w **`mapa.json`** obok tego pliku. Scena czyta ją przez
`globalThis.__SCENA3D_MAPA`, które musi być ustawione **przed** doładowaniem
modułu (robi to `index.html` i `src/components/Scena3D.jsx`). Gdy pliku nie ma,
bundle wraca do wartości wbudowanych i świat wygląda tak, jak przed edytorem.

Bundle jest zminifikowany i nie ma źródeł, więc te literały otworzył na dane
skrypt **`scripts/mapa-hook.py`**:

```bash
python scripts/mapa-hook.py            # podepnij mapę (idempotentne)
python scripts/mapa-hook.py --cofnij   # wróć do bundla sprzed patcha
python scripts/mapa-eksport.py         # wygeneruj mapa.json z bundla na nowo
```

**Po każdej podmianie `scena3d.js` / `scena3d.esm.js` trzeba uruchomić
`mapa-hook.py` ponownie** — nowy bundle przychodzi bez tych zaczepów.

### Edytor: `/scena-3d/edytor.html`

Rzut mapy z góry plus podgląd 3D w rogu. Lewy przycisk zaznacza i przeciąga,
prawy (albo spacja) przesuwa mapę, kółko przybliża. `Delete` kasuje, `Q`/`E`
obracają, `[`/`]` skalują, strzałki przesuwają co 10 cm, `Ctrl+Z` cofa.

Zmiany lądują w `localStorage` (klucz `scena3d.mapa`) i to je pokazuje podgląd —
prawdziwa aplikacja czyta wyłącznie `mapa.json`. Żeby je utrwalić: **Pobierz
mapa.json** i podmień plik w `public/scena-3d/`.

Czego edytor NIE ruszy: trawy, kwiatków i płyt ścieżki malowanych na teksturze
terenu (powstają z ziarna losowego w środku modułu) ani samych modeli GLB.
