/**
 * ODZNAKA WIZKORA — jedno miejsce na adres pliku i jego wersję.
 *
 * DLACZEGO Z `?wersja=`, A NIE PO PROSTU `/wizkor_avatar.png`:
 * plik podmieniono 19.09.2026 (nowa obręcz, wyczyszczony kapelusz), a nazwa
 * została ta sama. Przeglądarki, które miały stary rysunek w pamięci, dalej
 * podawały go z cache — na ekranie wracał poprzedni kapelusz wystający
 * daleko ponad krąg, mimo że serwer wysyłał już nowy plik. Numer w adresie
 * jest jedyną rzeczą, która to przecina bez zmiany nazwy pliku.
 *
 * KTO PODMIENIA PLIK, PODBIJA NUMER. Numer ma tylko rosnąć — cofnięcie go
 * serwuje z cache ten rysunek, który już raz pod tym adresem był.
 *
 * Korzystają z tego `PodpowiedzMedrca` (myśl Wizkora w rogu) i
 * `PasekKolejnejMisji`. Obie mają dostać ten sam adres, bo wtedy druga
 * dostaje obrazek już wczytany.
 */
export const ODZNAKA_WIZKORA = "/wizkor_avatar.png?wersja=3";
