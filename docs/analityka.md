# Analityka — co mierzymy i jak nie liczyć siebie

## Skąd się biorą dane

Vercel Web Analytics. Skrypt wpina `<Analityka />` w `main.jsx`, a wszystkie
zdarzenia idą przez jedną funkcję: `zdarzenie(nazwa, dane)` z
`src/services/analityka.jsx`. Nic nie woła `track()` bezpośrednio — dzięki temu
wyciszenie działa w jednym miejscu, a nie w piętnastu.

## Wyłączenie własnych wizyt

**Vercel nie ma listy wykluczonych adresów IP.** Filtr może działać tylko
w przeglądarce, zanim zdarzenie wyjdzie — i tak jest to zrobione. Nic nie
wychodzi, gdy zachodzi którykolwiek z warunków:

1. jesteśmy „u siebie" — `localhost`, sieć domowa (`192.168.*`, `10.*`),
   build deweloperski; to ta sama funkcja `czyLokalnie()`, której używa tryb
   testowy,
2. w przeglądarce leży zapis `ewolucja.bez-analityki`,
3. adres zawiera `?analityka=off` — co **jednocześnie zapisuje** wyłączenie na
   stałe w tej przeglądarce.

W praktyce: wejdź raz na

```
https://<adres-publikacji>/?analityka=off
```

na każdym urządzeniu i w każdej przeglądarce, z której testujesz publikację.
Od tej pory ani odsłony, ani zdarzenia z tego urządzenia nie trafiają do
statystyk. `?analityka=on` cofa wyłączenie.

Uwaga: zapis siedzi w `localStorage`, więc czyszczenie danych strony, tryb
prywatny i inna przeglądarka wymagają powtórzenia. Zmiana adresu IP niczego nie
psuje — filtr nie ma z IP nic wspólnego.

## Zdarzenia

| zdarzenie | kiedy | dane |
|---|---|---|
| `gra_start` | rozpoczęcie partii | `gra`, `poziom` |
| `gra_koniec` | wypłata monet po partii | `gra`, `poziom`, `monety` + miary gry: `gwiazdki`, `sekundy`, `strzaly`, `brama`, `rundy`, `bez_pudla` |
| `panel_otwarty` | otwarcie zakładki huba | `panel` |
| `karta_wybrana` | wybór karty dnia w poradach | `karta`, `akcja`, `pora` |
| `karta_ukonczona` | doprowadzenie karty do końca | `karta`, `akcja`, `pora` |
| `oddech_start` | wejście na ekran oddechu | `pora` |
| `oddech_koniec` | przejście wszystkich pięciu cykli | `pora`, `cykle` |

Pary zdarzeń są tu celowe: `gra_start` / `gra_koniec` mówi, ile partii ktoś
porzuca, `karta_wybrana` / `karta_ukonczona` — ile wybranych aktywności
dziecko naprawdę robi, a `oddech_start` / `oddech_koniec` — czy ekran oddechu
działa, czy jest ozdobą. Pojedyncze liczniki bez pary nie odpowiadają na żadne
pytanie.

## Dokładanie zdarzeń

```js
import { zdarzenie } from "../services/analityka.jsx";

zdarzenie("nazwa_zdarzenia", { klucz: "wartosc", liczba: 3 });
```

Wartości muszą być płaskie (tekst, liczba, prawda/fałsz) — Vercel odrzuca
zagnieżdżone obiekty. `zdarzenie()` sam zamienia obiekty na tekst i wycina
`null`/`undefined`, żeby nic nie ginęło po cichu po drodze.

Nazwy trzymamy po polsku, z podkreśleniami: w panelu Vercela mają być czytelne
bez tłumaczenia.
