<!--
  SPDX-FileCopyrightText: © 2026 Amitiel Angelisme <armitiel@gmail.com>
  SPDX-License-Identifier: LicenseRef-EwolucJA-Proprietary
-->

# Składniki osób trzecich

EwolucJA korzysta z bibliotek i krojów pisma, do których prawa przysługują
osobom trzecim. **Licencja EwolucJI ich nie obejmuje** — każdy z tych
składników pozostaje na własnej licencji, wymienionej niżej.

Ten plik jest wymagany przez licencje typu MIT i BSD: warunkiem korzystania
jest zachowanie noty o prawach autorskich twórcy biblioteki. Dlatego nota
z `LICENSE` mówi „wszelkie prawa zastrzeżone" o **EwolucJI**, a nie o tym,
co jest tu wymienione.

## Biblioteki — frontend

| Składnik | Licencja | Do czego |
|---|---|---|
| [React](https://react.dev) i React DOM | MIT | interfejs aplikacji |
| [React Router](https://reactrouter.com) | MIT | trasy w aplikacji |
| [three.js](https://threejs.org) | MIT | scena 3D (planeta) |
| [Vite](https://vite.dev) + `@vitejs/plugin-react` | MIT | budowanie paczki |
| [vite-plugin-pwa](https://vite-pwa-org.netlify.app) | MIT | tryb aplikacji offline |
| [@lottiefiles/dotlottie-react](https://lottiefiles.com) | MIT | animacje Lottie |
| [@sentry/react](https://sentry.io), `@sentry/vite-plugin` | MIT | raportowanie błędów |
| [@vercel/analytics](https://vercel.com/analytics), `@vercel/blob` | Apache-2.0 | statystyki i pliki |
| [esbuild](https://esbuild.github.io) | MIT | budowanie paczki sceny 3D |

## Biblioteki — backend

| Składnik | Licencja | Do czego |
|---|---|---|
| [Express](https://expressjs.com) | MIT | serwer HTTP |
| [pg](https://node-postgres.com) | MIT | połączenie z bazą PostgreSQL |
| [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) | MIT | tokeny sesji |
| [google-auth-library](https://github.com/googleapis/google-auth-library-nodejs) | Apache-2.0 | logowanie Google |
| [web-push](https://github.com/web-push-libs/web-push) | MPL-2.0 | powiadomienia push |
| `cors`, `cookie-parser`, `dotenv` | MIT | warstwa serwera |
| [@sentry/node](https://sentry.io) | MIT | raportowanie błędów |

Pełne teksty licencji tych bibliotek znajdują się w katalogach
`node_modules/<nazwa>/LICENSE` po instalacji zależności.

## Kroje pisma

Wszystkie pobierane z Google Fonts, wszystkie na licencji
[SIL Open Font License 1.1](https://openfontlicense.org) — wolno ich używać
także w produkcie komercyjnym i zamkniętym:

* **Baloo 2** — nagłówki i teksty postaci
* **Sniglet** — logo i wyróżnienia
* **Nunito** — tekst interfejsu
* **Mali** — teksty pisane „ręcznie"
* **Caveat** — dowody i notatki dziecka

## Treści wytworzone narzędziami AI

Część grafik i modeli powstała z użyciem generatywnych narzędzi AI, po czym
została wybrana, poprawiona i złożona w całość przez autora. Regulaminy tych
narzędzi przekazują użytkownikowi prawa do wyników w zakresie, w jakim mogą
je przekazać — ale **surowy wynik generatora sam w sobie może nie być
utworem** w rozumieniu prawa autorskiego, bo brakuje mu twórcy-człowieka.

Chronione jest to, co wniósł autor: dobór, kadr, poprawki, kompozycja sceny
i całość produktu. Ta uwaga nie osłabia praw do EwolucJI jako dzieła — ma
tylko zapobiec przekonaniu, że każdy pojedynczy wygenerowany plik jest
samodzielnie chroniony.

## Modele 3D i assety autorskie

Modele w `frontend/public/scena-3d/assets/`, ilustracje i dźwięk powstały na
potrzeby tego projektu i objęte są `LICENSE`. Jeżeli do projektu trafi
kiedykolwiek asset z zewnętrznego banku (model, dźwięk, ikona), **jego wpis
musi trafić do tej tabeli razem z licencją i linkiem do źródła** — inaczej
nota „wszelkie prawa zastrzeżone" przestaje być prawdziwa.
