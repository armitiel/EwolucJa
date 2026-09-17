/*!
 * SPDX-FileCopyrightText: © 2026 Amitiel Angelisme <armitiel@gmail.com>
 * SPDX-License-Identifier: LicenseRef-EwolucJA-Proprietary
 *
 * EwolucJA — gra edukacyjna dla dzieci.
 * Produkt powstał w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”;
 * autorskie prawa majątkowe pozostają przy autorze. Licencja: LICENSE.
 */
/**
 * dailyTipsRodzic.js — porady DLA RODZICA (Mentora), wydzielone 17.09.2026
 * z `dailyTipsData.js` (migracja porad dziecka do standardu 04 §4.1).
 * Stary format (category/subcategory/icon/tone/time/profileName/cecha) bez zmian —
 * do osobnego audytu przed użyciem w panelu Mentora (docs/tresci/06 §4.10).
 * Dziś nie wyświetla ich żaden ekran dziecka.
 */

export const DAILY_TIPS_RODZIC = [
  {
    "id": "DT-D01-S2",
    "profile": "DT",
    "day": 1,
    "slot": "poludnie",
    "category": "mentor",
    "subcategory": "pytania",
    "audience": "rodzic",
    "title": "Pytanie zamiast odpowiedzi",
    "body": "Gdy dziecko o coś pyta, zanim odpowiesz, spytaj: a jak ty myślisz? To rozpędza jego ciekawość zamiast jej gasić.",
    "icon": "rodzic",
    "tone": "paper",
    "time": "1 min",
    "tags": [
      "pytania",
      "rozmowa",
      "ciekawosc"
    ],
    "profileName": "Odkrywca",
    "cecha": "Ciekawość"
  },
  {
    "id": "DT-D01-S3",
    "profile": "DT",
    "day": 1,
    "slot": "wieczor",
    "category": "mentor",
    "subcategory": "cisza_skupienie",
    "audience": "rodzic",
    "title": "Ciszą można się przywitać",
    "body": "Wieczorem usiądź obok dziecka w ciszy na minutę. Bez pytań o szkołę. Bliskość bez słów też się liczy.",
    "icon": "rodzic",
    "tone": "rose",
    "time": "1 min",
    "tags": [
      "cisza",
      "wyciszenie",
      "wieczor"
    ],
    "profileName": "Odkrywca",
    "cecha": "Ciekawość"
  },
  {
    "id": "DT-D02-S1",
    "profile": "DT",
    "day": 2,
    "slot": "poranek",
    "category": "mentor",
    "subcategory": "rytmy_dnia",
    "audience": "rodzic",
    "title": "Spokojne śniadanie bez ekranu",
    "body": "Odkrywca potrzebuje świeżej głowy. Spróbuj dziś włączyć śniadanie bez bajek — usłyszysz pytania, które inaczej giną w hałasie.",
    "icon": "rodzic",
    "tone": "leaf",
    "time": "2 min",
    "tags": [
      "sniadanie",
      "rytmy",
      "bez_ekranu"
    ],
    "profileName": "Odkrywca",
    "cecha": "Ciekawość"
  },
  {
    "id": "DT-D02-S3",
    "profile": "DT",
    "day": 2,
    "slot": "wieczor",
    "category": "mentor",
    "subcategory": "pamiec_szczegoly",
    "audience": "rodzic",
    "title": "Trzy szczegóły dnia",
    "body": "Zapytaj dziecko wieczorem o trzy rzeczy, które dziś zauważyło. Krótko, bez oceny. Bliskość rośnie z drobiazgów.",
    "icon": "rodzic",
    "tone": "paper",
    "time": "1 min",
    "tags": [
      "refleksja",
      "pamiec",
      "wieczor"
    ],
    "profileName": "Odkrywca",
    "cecha": "Ciekawość"
  },
  {
    "id": "DT-D03-S3",
    "profile": "DT",
    "day": 3,
    "slot": "wieczor",
    "category": "mentor",
    "subcategory": "granice_dt",
    "audience": "rodzic",
    "title": "Gdy pytań jest za dużo",
    "body": "Lawina pytań wieczorem to często znak, że dziecko jest zmęczone. Spróbuj powiedzieć: zapiszmy to na jutro. To nie odrzucenie, to opieka.",
    "icon": "rodzic",
    "tone": "paper",
    "time": "1 min",
    "tags": [
      "granice",
      "wieczor",
      "zmeczenie"
    ],
    "profileName": "Odkrywca",
    "cecha": "Ciekawość"
  },
  {
    "id": "DT-D04-S1",
    "profile": "DT",
    "day": 4,
    "slot": "poranek",
    "category": "mentor",
    "subcategory": "rytmy_dnia",
    "audience": "rodzic",
    "title": "Ile snu potrzebuje dziecko",
    "body": "Dzieci w wieku 6–12 lat zwykle potrzebują 9–12 godzin snu na dobę. Jeśli rano dziecko często jest rozdrażnione lub bardzo senne, warto przyjrzeć się temu, ile i jak śpi.",
    "icon": "rodzic",
    "tone": "paper",
    "time": "2 min",
    "tags": [
      "sen",
      "rytmy",
      "wellbeing"
    ],
    "profileName": "Odkrywca",
    "cecha": "Ciekawość"
  },
  {
    "id": "DT-D05-S2",
    "profile": "DT",
    "day": 5,
    "slot": "poludnie",
    "category": "mentor",
    "subcategory": "nudy_jako_paliwo",
    "audience": "rodzic",
    "title": "Nuda to nie wróg",
    "body": "Gdy dziecko mówi nudzi mi się, nie sięgaj od razu po ekran. Daj kwadrans pustki. Z nudy często rodzą się najciekawsze pomysły.",
    "icon": "rodzic",
    "tone": "paper",
    "time": "2 min",
    "tags": [
      "nuda",
      "kreatywnosc",
      "bez_ekranu"
    ],
    "profileName": "Odkrywca",
    "cecha": "Ciekawość"
  },
  {
    "id": "DT-D05-S3",
    "profile": "DT",
    "day": 5,
    "slot": "wieczor",
    "category": "mentor",
    "subcategory": "pytania",
    "audience": "rodzic",
    "title": "Pytanie na dobranoc",
    "body": "Zamiast bajki spróbuj jednego pytania: co cię dziś zaciekawiło? Czasem dziecko odpowie dopiero rano. Daj mu czas.",
    "icon": "rodzic",
    "tone": "rose",
    "time": "1 min",
    "tags": [
      "pytania",
      "wieczor",
      "refleksja"
    ],
    "profileName": "Odkrywca",
    "cecha": "Ciekawość"
  },
  {
    "id": "DT-D06-S1",
    "profile": "DT",
    "day": 6,
    "slot": "poranek",
    "category": "mentor",
    "subcategory": "relacje",
    "audience": "rodzic",
    "title": "Słuchaj pytań bez oceny",
    "body": "Gdy dziecko zadaje dziwne pytanie, nie mów to głupie. Powiedz: ciekawe, skąd ci to przyszło do głowy? Pytania potrzebują bezpieczeństwa.",
    "icon": "rodzic",
    "tone": "paper",
    "time": "1 min",
    "tags": [
      "relacje",
      "rozmowa",
      "akceptacja"
    ],
    "profileName": "Odkrywca",
    "cecha": "Ciekawość"
  },
  {
    "id": "DT-D07-S3",
    "profile": "DT",
    "day": 7,
    "slot": "wieczor",
    "category": "mentor",
    "subcategory": "pamiec_szczegoly",
    "audience": "rodzic",
    "title": "Wieczorny dziennik tropów",
    "body": "Zaproponuj dziecku: powiedz mi trzy szczegóły z dziś, których nikt inny nie zauważył. To trening pamięci i bliskość w jednym.",
    "icon": "rodzic",
    "tone": "paper",
    "time": "2 min",
    "tags": [
      "rozmowa",
      "pamiec",
      "wieczor"
    ],
    "profileName": "Odkrywca",
    "cecha": "Ciekawość"
  },
  {
    "id": "DT-D08-S3",
    "profile": "DT",
    "day": 8,
    "slot": "wieczor",
    "category": "mentor",
    "subcategory": "cisza_skupienie",
    "audience": "rodzic",
    "title": "Trzy oddechy razem",
    "body": "Połóż dłoń na brzuchu dziecka i oddychajcie razem trzy razy. Spowolnienie rodzica spowalnia dziecko. To proste i działa.",
    "icon": "rodzic",
    "tone": "rose",
    "time": "1 min",
    "tags": [
      "oddech",
      "wyciszenie",
      "wieczor"
    ],
    "profileName": "Odkrywca",
    "cecha": "Ciekawość"
  },
  {
    "id": "DT-D09-S1",
    "profile": "DT",
    "day": 9,
    "slot": "poranek",
    "category": "mentor",
    "subcategory": "granice_dt",
    "audience": "rodzic",
    "title": "Ciekawość też się męczy",
    "body": "Po nocy pełnej pytań mózg potrzebuje spokoju. Rano nie zasypuj dziecka planem dnia. Daj 10 minut ciszy przy śniadaniu.",
    "icon": "rodzic",
    "tone": "paper",
    "time": "2 min",
    "tags": [
      "granice",
      "cisza",
      "poranek"
    ],
    "profileName": "Odkrywca",
    "cecha": "Ciekawość"
  },
  {
    "id": "DT-D10-S2",
    "profile": "DT",
    "day": 10,
    "slot": "poludnie",
    "category": "mentor",
    "subcategory": "rytmy_dnia",
    "audience": "rodzic",
    "title": "Ruch w środku dnia",
    "body": "Dzieci i młodzież powinny mieć średnio co najmniej 60 minut umiarkowanej lub intensywnej aktywności dziennie w skali tygodnia. Nie musi to być trening — może to być spacer, rower, taniec albo aktywna zabawa.",
    "icon": "rodzic",
    "tone": "amber",
    "time": "2 min",
    "tags": [
      "ruch",
      "rytmy",
      "wellbeing"
    ],
    "profileName": "Odkrywca",
    "cecha": "Ciekawość"
  },
  {
    "id": "DT-D10-S3",
    "profile": "DT",
    "day": 10,
    "slot": "wieczor",
    "category": "mentor",
    "subcategory": "pamiec_szczegoly",
    "audience": "rodzic",
    "title": "Mapa dnia we dwoje",
    "body": "Zaproponuj wieczorem: opowiedz mi swój dzień jak mapę. Posłuchaj bez przerywania. Dziecko samo wybierze, co ważne.",
    "icon": "rodzic",
    "tone": "paper",
    "time": "2 min",
    "tags": [
      "pamiec",
      "refleksja",
      "wieczor"
    ],
    "profileName": "Odkrywca",
    "cecha": "Ciekawość"
  },
  {
    "id": "DT-D11-S1",
    "profile": "DT",
    "day": 11,
    "slot": "poranek",
    "category": "mentor",
    "subcategory": "relacje",
    "audience": "rodzic",
    "title": "Pierwsze pięć minut",
    "body": "To, jak zaczynasz dzień z dzieckiem, ustawia ton. Spróbuj dziś przywitać je bez pośpiechu — spojrzeniem, dotykiem, ciepłym dzień dobry.",
    "icon": "rodzic",
    "tone": "rose",
    "time": "1 min",
    "tags": [
      "relacje",
      "poranek",
      "bliskosc"
    ],
    "profileName": "Odkrywca",
    "cecha": "Ciekawość"
  },
  {
    "id": "DT-D12-S2",
    "profile": "DT",
    "day": 12,
    "slot": "poludnie",
    "category": "mentor",
    "subcategory": "nudy_jako_paliwo",
    "audience": "rodzic",
    "title": "Pudełko ze skarbami",
    "body": "Zbierz w jedno pudełko kilka różnych przedmiotów: szyszkę, sznurek, lupę, gumkę. Postaw przy stole. Niech dziecko samo coś z tym wymyśli.",
    "icon": "rodzic",
    "tone": "paper",
    "time": "2 min",
    "tags": [
      "nuda",
      "kreatywnosc",
      "zabawa"
    ],
    "profileName": "Odkrywca",
    "cecha": "Ciekawość"
  },
  {
    "id": "DT-D13-S1",
    "profile": "DT",
    "day": 13,
    "slot": "poranek",
    "category": "mentor",
    "subcategory": "rytmy_dnia",
    "audience": "rodzic",
    "title": "Spokojne jedzenie",
    "body": "Dziecko, które je w pośpiechu, nie słyszy swojego ciała. Spróbuj posadzić rodzinę przy stole na 10 minut bez telefonów. Tyle wystarczy.",
    "icon": "rodzic",
    "tone": "amber",
    "time": "2 min",
    "tags": [
      "jedzenie",
      "rytmy",
      "wellbeing"
    ],
    "profileName": "Odkrywca",
    "cecha": "Ciekawość"
  },
  {
    "id": "DT-D13-S3",
    "profile": "DT",
    "day": 13,
    "slot": "wieczor",
    "category": "mentor",
    "subcategory": "pytania",
    "audience": "rodzic",
    "title": "Nie każde pytanie ma odpowiedź",
    "body": "Gdy dziecko pyta o coś trudnego, nie musisz wymyślać. Nie wiem, ciekawe, prawda? buduje zaufanie bardziej niż improwizacja.",
    "icon": "rodzic",
    "tone": "paper",
    "time": "1 min",
    "tags": [
      "pytania",
      "refleksja",
      "wieczor"
    ],
    "profileName": "Odkrywca",
    "cecha": "Ciekawość"
  },
  {
    "id": "DT-D14-S3",
    "profile": "DT",
    "day": 14,
    "slot": "wieczor",
    "category": "mentor",
    "subcategory": "relacje",
    "audience": "rodzic",
    "title": "Rozmowa bez ekranu",
    "body": "Spróbuj dziś wieczorem 15 minut rozmowy bez tła z telewizora czy telefonu. Odkrywca najlepiej tropi, gdy nie ma szumu.",
    "icon": "rodzic",
    "tone": "rose",
    "time": "2 min",
    "tags": [
      "relacje",
      "rozmowa",
      "wieczor"
    ],
    "profileName": "Odkrywca",
    "cecha": "Ciekawość"
  },
  {
    "id": "DT-D15-S1",
    "profile": "DT",
    "day": 15,
    "slot": "poranek",
    "category": "mentor",
    "subcategory": "cisza_skupienie",
    "audience": "rodzic",
    "title": "Minuta ciszy przed startem",
    "body": "Spróbuj dziś nie włączać radia ani telefonu przez pierwszą minutę dnia. Dziecko wybudza się łagodniej, gdy dom jest cichy.",
    "icon": "rodzic",
    "tone": "leaf",
    "time": "1 min",
    "tags": [
      "cisza",
      "rytual_poranny",
      "spokoj"
    ],
    "profileName": "Odkrywca",
    "cecha": "Ciekawość"
  },
  {
    "id": "DT-D16-S1",
    "profile": "DT",
    "day": 16,
    "slot": "poranek",
    "category": "mentor",
    "subcategory": "granice_dt",
    "audience": "rodzic",
    "title": "Jedno pytanie naraz",
    "body": "Gdy dziecko sypie pytaniami jak z rękawa, możesz powiedzieć: zatrzymajmy się na tym jednym. Każde pytanie zasługuje na chwilę uwagi.",
    "icon": "rodzic",
    "tone": "paper",
    "time": "2 min",
    "tags": [
      "granice",
      "pytania",
      "uwaga"
    ],
    "profileName": "Odkrywca",
    "cecha": "Ciekawość"
  },
  {
    "id": "DT-D16-S3",
    "profile": "DT",
    "day": 16,
    "slot": "wieczor",
    "category": "mentor",
    "subcategory": "pamiec_szczegoly",
    "audience": "rodzic",
    "title": "Drobiazg dnia",
    "body": "Wieczorem zapytaj o jeden mały szczegół z dnia — nie o ocenę, nie o sukces. Drobiazgi pokazują, co naprawdę zostaje w pamięci.",
    "icon": "rodzic",
    "tone": "rose",
    "time": "1 min",
    "tags": [
      "pamiec",
      "refleksja",
      "wieczor"
    ],
    "profileName": "Odkrywca",
    "cecha": "Ciekawość"
  },
  {
    "id": "DT-D17-S2",
    "profile": "DT",
    "day": 17,
    "slot": "poludnie",
    "category": "mentor",
    "subcategory": "rytmy_dnia",
    "audience": "rodzic",
    "title": "Woda zamiast słodyczy",
    "body": "Odkrywca pełen pytań szybko się odwadnia. Postaw na stole szklankę wody w zasięgu ręki. Mózg lepiej pracuje nawodniony.",
    "icon": "rodzic",
    "tone": "amber",
    "time": "1 min",
    "tags": [
      "woda",
      "wellbeing",
      "rytmy"
    ],
    "profileName": "Odkrywca",
    "cecha": "Ciekawość"
  },
  {
    "id": "DT-D18-S1",
    "profile": "DT",
    "day": 18,
    "slot": "poranek",
    "category": "mentor",
    "subcategory": "pytania",
    "audience": "rodzic",
    "title": "Pytaj dziecko o intencję",
    "body": "Rano zapytaj: na co dziś chcesz zwrócić uwagę? Intencja na dzień to lepsza kotwica niż lista zadań.",
    "icon": "rodzic",
    "tone": "paper",
    "time": "1 min",
    "tags": [
      "pytania",
      "intencja",
      "rytual_poranny"
    ],
    "profileName": "Odkrywca",
    "cecha": "Ciekawość"
  },
  {
    "id": "DT-D18-S3",
    "profile": "DT",
    "day": 18,
    "slot": "wieczor",
    "category": "mentor",
    "subcategory": "relacje",
    "audience": "rodzic",
    "title": "Dobranoc bez pośpiechu",
    "body": "Spróbuj dziś nie kończyć dobranocki w biegu. Usiądź na łóżku dwie minuty po. Cisza we dwoje to też rozmowa.",
    "icon": "rodzic",
    "tone": "rose",
    "time": "2 min",
    "tags": [
      "relacje",
      "wieczor",
      "bliskosc"
    ],
    "profileName": "Odkrywca",
    "cecha": "Ciekawość"
  },
  {
    "id": "DT-D20-S1",
    "profile": "DT",
    "day": 20,
    "slot": "poranek",
    "category": "mentor",
    "subcategory": "nudy_jako_paliwo",
    "audience": "rodzic",
    "title": "Nudny poranek to dobry poranek",
    "body": "Jeśli dziecko ma rano 20 minut bez zadań, niech ma. Z tej pustki rodzą się pytania, które potem zaskoczą cię przy obiedzie.",
    "icon": "rodzic",
    "tone": "paper",
    "time": "2 min",
    "tags": [
      "nuda",
      "poranek",
      "kreatywnosc"
    ],
    "profileName": "Odkrywca",
    "cecha": "Ciekawość"
  },
  {
    "id": "DT-D21-S1",
    "profile": "DT",
    "day": 21,
    "slot": "poranek",
    "category": "mentor",
    "subcategory": "rytmy_dnia",
    "audience": "rodzic",
    "title": "Ciało dziecka po nocy",
    "body": "Zerknij rano, jak dziecko wstaje: powoli, czy zrywa się? To pierwsza informacja o tym, jak spało. Lepsza niż pytanie wprost.",
    "icon": "rodzic",
    "tone": "amber",
    "time": "1 min",
    "tags": [
      "cialo",
      "rytual_poranny",
      "sen"
    ],
    "profileName": "Odkrywca",
    "cecha": "Ciekawość"
  },
  {
    "id": "DT-D21-S3",
    "profile": "DT",
    "day": 21,
    "slot": "wieczor",
    "category": "mentor",
    "subcategory": "granice_dt",
    "audience": "rodzic",
    "title": "Kiedy nie wiem to też odpowiedź",
    "body": "Nie musisz znać odpowiedzi na każde pytanie. Nie wiem, sprawdzimy razem to też dobra odpowiedź. Pokazuje, że nauka nigdy się nie kończy.",
    "icon": "rodzic",
    "tone": "paper",
    "time": "2 min",
    "tags": [
      "granice",
      "pytania",
      "szczerosc"
    ],
    "profileName": "Odkrywca",
    "cecha": "Ciekawość"
  },
  {
    "id": "DT-D22-S1",
    "profile": "DT",
    "day": 22,
    "slot": "poranek",
    "category": "mentor",
    "subcategory": "cisza_skupienie",
    "audience": "rodzic",
    "title": "Jedna rzecz po drugiej",
    "body": "Odkrywca źle znosi pośpiech. Spróbuj rano nie wydawać trzech poleceń naraz. Najpierw zęby, potem ubranie. To wystarczy.",
    "icon": "rodzic",
    "tone": "paper",
    "time": "1 min",
    "tags": [
      "skupienie",
      "rytual_poranny",
      "spokoj"
    ],
    "profileName": "Odkrywca",
    "cecha": "Ciekawość"
  },
  {
    "id": "DT-D23-S1",
    "profile": "DT",
    "day": 23,
    "slot": "poranek",
    "category": "mentor",
    "subcategory": "rytmy_dnia",
    "audience": "rodzic",
    "title": "Świeże powietrze rano",
    "body": "Otwórz na pięć minut okno przy śniadaniu. Świeże powietrze wybudza ciekawość lepiej niż druga kawa. Odkrywca potrzebuje tlenu.",
    "icon": "rodzic",
    "tone": "amber",
    "time": "1 min",
    "tags": [
      "powietrze",
      "rytmy",
      "wellbeing"
    ],
    "profileName": "Odkrywca",
    "cecha": "Ciekawość"
  },
  {
    "id": "DT-D24-S1",
    "profile": "DT",
    "day": 24,
    "slot": "poranek",
    "category": "mentor",
    "subcategory": "obserwacja",
    "audience": "rodzic",
    "title": "Drobne nawyki budują rytm",
    "body": "Te same kroki rano — kubek, śniadanie, buty — dają dziecku poczucie bezpieczeństwa. Nie musi być spektakularnie, ma być przewidywalnie.",
    "icon": "rodzic",
    "tone": "paper",
    "time": "1 min",
    "tags": [
      "obserwacja",
      "rytual_poranny",
      "ruch"
    ],
    "profileName": "Odkrywca",
    "cecha": "Ciekawość"
  },
  {
    "id": "DT-D24-S2",
    "profile": "DT",
    "day": 24,
    "slot": "poludnie",
    "category": "mentor",
    "subcategory": "relacje",
    "audience": "rodzic",
    "title": "Pytanie zwrotne",
    "body": "Gdy dziecko opowiada o dniu, zadawaj pytania pogłębiające: co ci się tam najbardziej podobało? Pokażesz, że słuchasz naprawdę.",
    "icon": "rodzic",
    "tone": "rose",
    "time": "2 min",
    "tags": [
      "relacje",
      "rozmowa",
      "sluchanie"
    ],
    "profileName": "Odkrywca",
    "cecha": "Ciekawość"
  },
  {
    "id": "DT-D25-S3",
    "profile": "DT",
    "day": 25,
    "slot": "wieczor",
    "category": "mentor",
    "subcategory": "granice_dt",
    "audience": "rodzic",
    "title": "Cicha godzina przed snem",
    "body": "Godzina przed snem bez ekranu i bez dyskusji o trudnych sprawach. Odkrywca potrzebuje wyciszenia, żeby zasnąć spokojnie.",
    "icon": "rodzic",
    "tone": "paper",
    "time": "2 min",
    "tags": [
      "granice",
      "sen",
      "wieczor"
    ],
    "profileName": "Odkrywca",
    "cecha": "Ciekawość"
  },
  {
    "id": "DT-D26-S1",
    "profile": "DT",
    "day": 26,
    "slot": "poranek",
    "category": "mentor",
    "subcategory": "pytania",
    "audience": "rodzic",
    "title": "Dlaczego trzy razy",
    "body": "Gdy dziecko pyta dlaczego raz za razem, nie znaczy że cię testuje. Mózg składa świat. Spróbuj odpowiedzieć przynajmniej trzy razy spokojnie.",
    "icon": "rodzic",
    "tone": "paper",
    "time": "1 min",
    "tags": [
      "pytania",
      "rytual_poranny",
      "ciekawosc"
    ],
    "profileName": "Odkrywca",
    "cecha": "Ciekawość"
  },
  {
    "id": "DT-D27-S1",
    "profile": "DT",
    "day": 27,
    "slot": "poranek",
    "category": "mentor",
    "subcategory": "rytmy_dnia",
    "audience": "rodzic",
    "title": "Bez biegania rano",
    "body": "Pośpiech rano podkręca układ nerwowy na cały dzień. Spróbuj wstać 10 minut wcześniej. Spokojny start procentuje wieczorem.",
    "icon": "rodzic",
    "tone": "amber",
    "time": "2 min",
    "tags": [
      "poranek",
      "rytmy",
      "spokoj"
    ],
    "profileName": "Odkrywca",
    "cecha": "Ciekawość"
  },
  {
    "id": "DT-D28-S2",
    "profile": "DT",
    "day": 28,
    "slot": "poludnie",
    "category": "mentor",
    "subcategory": "nudy_jako_paliwo",
    "audience": "rodzic",
    "title": "Nuda po szkole",
    "body": "Po szkole nie zapełniaj od razu czasu zajęciami. 30 minut nudy daje mózgowi reset. Odkrywca po szkole potrzebuje pustki.",
    "icon": "rodzic",
    "tone": "paper",
    "time": "2 min",
    "tags": [
      "nuda",
      "szkola",
      "regeneracja"
    ],
    "profileName": "Odkrywca",
    "cecha": "Ciekawość"
  },
  {
    "id": "DT-D28-S3",
    "profile": "DT",
    "day": 28,
    "slot": "wieczor",
    "category": "mentor",
    "subcategory": "pytania",
    "audience": "rodzic",
    "title": "Co cię dziś zaskoczyło",
    "body": "Wieczorne pytanie: co cię dziś zaskoczyło? otwiera dziecko bardziej niż jak było w szkole. Daje wybór, co opowiedzieć.",
    "icon": "rodzic",
    "tone": "rose",
    "time": "1 min",
    "tags": [
      "pytania",
      "refleksja",
      "wieczor"
    ],
    "profileName": "Odkrywca",
    "cecha": "Ciekawość"
  },
  {
    "id": "DT-D29-S1",
    "profile": "DT",
    "day": 29,
    "slot": "poranek",
    "category": "mentor",
    "subcategory": "relacje",
    "audience": "rodzic",
    "title": "Twoje zmęczenie to też dane",
    "body": "Jeśli jesteś dziś wykończona, to normalne. Odkrywca pyta dużo i potrafi zmęczyć. Możesz powiedzieć: dziś mama jest cicha. To uczciwe.",
    "icon": "rodzic",
    "tone": "rose",
    "time": "2 min",
    "tags": [
      "relacje",
      "szczerosc",
      "wellbeing"
    ],
    "profileName": "Odkrywca",
    "cecha": "Ciekawość"
  },
  {
    "id": "DT-D29-S3",
    "profile": "DT",
    "day": 29,
    "slot": "wieczor",
    "category": "mentor",
    "subcategory": "cisza_skupienie",
    "audience": "rodzic",
    "title": "Cisza przed snem we dwoje",
    "body": "Posiedź przy dziecku w ciszy przed snem. Bez tabletu, bez bajki. Sama obecność to potężny sygnał: jesteś bezpieczny.",
    "icon": "rodzic",
    "tone": "rose",
    "time": "2 min",
    "tags": [
      "kraina",
      "cisza",
      "wieczor"
    ],
    "profileName": "Odkrywca",
    "cecha": "Ciekawość"
  },
  {
    "id": "DT-D30-S3",
    "profile": "DT",
    "day": 30,
    "slot": "wieczor",
    "category": "mentor",
    "subcategory": "granice_dt",
    "audience": "rodzic",
    "title": "Miesiąc obok Odkrywcy",
    "body": "Miesiąc razem z dociekliwym dzieckiem to wyczyn. Zauważ, co zmieniło się w was — w nim, ale też w tobie. Ciekawość zaraża obie strony.",
    "icon": "rodzic",
    "tone": "rose",
    "time": "2 min",
    "tags": [
      "podsumowanie",
      "relacje",
      "wieczor"
    ],
    "profileName": "Odkrywca",
    "cecha": "Ciekawość"
  },
  {
    "id": "EM-D01-S3",
    "profile": "EM",
    "day": 1,
    "slot": "wieczor",
    "category": "mentor",
    "title": "Wieczorne pytanie zamiast pytania o oceny",
    "body": "Zapytaj dziś dziecko: 'jaki dziś {miałeś|miałaś} moment ciepły?'. Przyjaciel otwiera się przez emocje, nie przez ranking dnia. Słuchaj bez poprawek.",
    "icon": "rodzic",
    "tone": "amber",
    "time": "2 min",
    "tags": [
      "rozmowa",
      "wieczor"
    ],
    "audience": "rodzic",
    "subcategory": "rozmowa_sluchanie",
    "profileName": "Przyjaciel",
    "cecha": "Życzliwość"
  },
  {
    "id": "EM-D02-S3",
    "profile": "EM",
    "day": 2,
    "slot": "wieczor",
    "category": "medrzec",
    "title": "Czyje to byly dzis uczucia?",
    "body": "Przyjaciel chłonie cudze emocje. Pomyśl: czy smutek, który dziś czułaś, czułeś, był naprawdę Twój? A może ktoś obok był smutny? Oddychaj - to nie wszystko Twoje.",
    "icon": "medrzec",
    "tone": "rose",
    "time": "2 min",
    "tags": [
      "granice",
      "emocje"
    ],
    "audience": "rodzic",
    "subcategory": "granica_empaty",
    "profileName": "Przyjaciel",
    "cecha": "Życzliwość"
  },
  {
    "id": "EM-D03-S1",
    "profile": "EM",
    "day": 3,
    "slot": "poranek",
    "category": "mentor",
    "title": "Poranny przedsionek emocji",
    "body": "Zanim wyjdziecie z domu, dajcie sobie 30 sekund ciszy. Przyjaciel potrzebuje wewnętrznego progu, by nie wchodzić w świat z nadmiarem. Oddech razem - w ciszy.",
    "icon": "rodzic",
    "tone": "amber",
    "time": "1 min",
    "tags": [
      "oddech",
      "rytual_poranny"
    ],
    "audience": "rodzic",
    "subcategory": "rytual_kojacy",
    "profileName": "Przyjaciel",
    "cecha": "Życzliwość"
  },
  {
    "id": "EM-D04-S3",
    "profile": "EM",
    "day": 4,
    "slot": "wieczor",
    "category": "mentor",
    "title": "Wieczorny gest strząsania dnia",
    "body": "Przed snem możecie zrobić razem prosty gest „strzepywania dnia” — poruszcie dłońmi tak, jakbyście strzepywali krople wody. Potem nazwijcie jedną rzecz, którą chcecie zostawić za sobą do jutra.",
    "icon": "rodzic",
    "tone": "amber",
    "time": "2 min",
    "tags": [
      "granice",
      "rytual_wieczorny"
    ],
    "audience": "rodzic",
    "subcategory": "granica_empaty",
    "profileName": "Przyjaciel",
    "cecha": "Życzliwość"
  },
  {
    "id": "EM-D05-S3",
    "profile": "EM",
    "day": 5,
    "slot": "wieczor",
    "category": "medrzec",
    "title": "Smutek tez ma kolor",
    "body": "Smutek nazwany staje się lżejszy. Gdyby miał kolor - jaki by był? Gdyby miał kształt - okrągły czy ostry? Uczucia, które znamy z imienia, mniej nas przerażają.",
    "icon": "medrzec",
    "tone": "rose",
    "time": "2 min",
    "tags": [
      "emocje",
      "smutek"
    ],
    "audience": "rodzic",
    "subcategory": "emocje_rozpoznanie",
    "profileName": "Przyjaciel",
    "cecha": "Życzliwość"
  },
  {
    "id": "EM-D06-S1",
    "profile": "EM",
    "day": 6,
    "slot": "poranek",
    "category": "mentor",
    "title": "Zapytaj o kolor jej serca dzis rano",
    "body": "Zamiast 'jak się czujesz?' - spróbuj: 'jakiego koloru jest Twoje serce dziś rano?'. Przyjaciel odpowie szczerze, bo ma swój język. Nie oceniaj koloru - tylko go przyjmij.",
    "icon": "rodzic",
    "tone": "amber",
    "time": "1 min",
    "tags": [
      "rozmowa",
      "rytual_poranny"
    ],
    "audience": "rodzic",
    "subcategory": "rozmowa_sluchanie",
    "profileName": "Przyjaciel",
    "cecha": "Życzliwość"
  },
  {
    "id": "EM-D07-S3",
    "profile": "EM",
    "day": 7,
    "slot": "wieczor",
    "category": "mentor",
    "title": "Niedziela bez 'co dzis robilismy zle'",
    "body": "Przyjaciel już sama analizuje swoje błędy. Dziś wieczorem opowiedzcie tylko o trzech ciepłych momentach z tygodnia. Reszta poczeka.",
    "icon": "rodzic",
    "tone": "amber",
    "time": "2 min",
    "tags": [
      "wieczor",
      "rozmowa"
    ],
    "audience": "rodzic",
    "subcategory": "rozmowa_sluchanie",
    "profileName": "Przyjaciel",
    "cecha": "Życzliwość"
  },
  {
    "id": "EM-D08-S3",
    "profile": "EM",
    "day": 8,
    "slot": "wieczor",
    "category": "medrzec",
    "title": "Mozesz powiedziec 'nie' - lagodnie",
    "body": "Jeśli ktoś chciał dziś dużo twojej uwagi, możesz spokojnie powiedzieć: „teraz potrzebuję chwili dla siebie”. Stawianie granic można robić łagodnie i z szacunkiem.",
    "icon": "medrzec",
    "tone": "rose",
    "time": "2 min",
    "tags": [
      "granice",
      "asertywnosc"
    ],
    "audience": "rodzic",
    "subcategory": "granica_empaty",
    "profileName": "Przyjaciel",
    "cecha": "Życzliwość"
  },
  {
    "id": "EM-D09-S1",
    "profile": "EM",
    "day": 9,
    "slot": "poranek",
    "category": "mentor",
    "title": "Spokojniejsze poranne rozbudzenie",
    "body": "Jeśli dziecko rano potrzebuje więcej bliskości albo wolniejszego startu, dajcie mu kilka dodatkowych minut na spokojne rozbudzenie. Obserwujcie, co faktycznie mu pomaga.",
    "icon": "rodzic",
    "tone": "amber",
    "time": "1 min",
    "tags": [
      "sen",
      "rytual_poranny"
    ],
    "audience": "rodzic",
    "subcategory": "rytmy_dnia",
    "profileName": "Przyjaciel",
    "cecha": "Życzliwość"
  },
  {
    "id": "EM-D10-S3",
    "profile": "EM",
    "day": 10,
    "slot": "wieczor",
    "category": "mentor",
    "title": "Jedno pytanie na domknięcie dnia",
    "body": "Przed snem możecie powiedzieć: „co chcę zachować z tego dnia, a co mogę już odpuścić?”. Taki krótki rytuał może pomóc spokojnie domknąć dzień.",
    "icon": "rodzic",
    "tone": "amber",
    "time": "2 min",
    "tags": [
      "granice",
      "rytual_wieczorny"
    ],
    "audience": "rodzic",
    "subcategory": "granica_empaty",
    "profileName": "Przyjaciel",
    "cecha": "Życzliwość"
  },
  {
    "id": "EM-D11-S3",
    "profile": "EM",
    "day": 11,
    "slot": "wieczor",
    "category": "medrzec",
    "title": "Zlosc tez ma kolor",
    "body": "Jeśli dziś byłaś, byłeś zła, zły - to w porządku. Złość nie znaczy, że jesteś niedobra. Złość to sygnał, że coś było za dużo. Posłuchaj jej.",
    "icon": "medrzec",
    "tone": "rose",
    "time": "2 min",
    "tags": [
      "emocje",
      "zlosc"
    ],
    "audience": "rodzic",
    "subcategory": "emocje_rozpoznanie",
    "profileName": "Przyjaciel",
    "cecha": "Życzliwość"
  },
  {
    "id": "EM-D12-S1",
    "profile": "EM",
    "day": 12,
    "slot": "poranek",
    "category": "mentor",
    "title": "Spokojniejsze śniadanie",
    "body": "Spróbujcie dziś zjeść śniadanie bez telewizora i głośnego radia albo przy spokojnej muzyce. Zobaczcie, czy taki początek dnia jest dla was przyjemniejszy.",
    "icon": "rodzic",
    "tone": "amber",
    "time": "1 min",
    "tags": [
      "rytual_poranny",
      "bodzce"
    ],
    "audience": "rodzic",
    "subcategory": "rytual_kojacy",
    "profileName": "Przyjaciel",
    "cecha": "Życzliwość"
  },
  {
    "id": "EM-D13-S3",
    "profile": "EM",
    "day": 13,
    "slot": "wieczor",
    "category": "mentor",
    "title": "Pytanie zamiast „jak było w szkole?”",
    "body": "Zamiast 'jak było w szkole?' - spróbuj: 'kto dziś był dla Ciebie miły?' albo 'kogo dziś było Ci żal?'. Te pytania trafiają do jej języka.",
    "icon": "rodzic",
    "tone": "amber",
    "time": "2 min",
    "tags": [
      "rozmowa",
      "wieczor"
    ],
    "audience": "rodzic",
    "subcategory": "rozmowa_sluchanie",
    "profileName": "Przyjaciel",
    "cecha": "Życzliwość"
  },
  {
    "id": "EM-D14-S3",
    "profile": "EM",
    "day": 14,
    "slot": "wieczor",
    "category": "medrzec",
    "title": "Samotnosc tez jest fala",
    "body": "Jeśli dziś czułaś, czułeś się sama, sam - to nie znaczy, że jesteś. To uczucie przychodzi i odchodzi. Połóż dłoń na sercu: 'jestem ze sobą'.",
    "icon": "medrzec",
    "tone": "rose",
    "time": "2 min",
    "tags": [
      "samotnosc",
      "wieczor"
    ],
    "audience": "rodzic",
    "subcategory": "samotnosc",
    "profileName": "Przyjaciel",
    "cecha": "Życzliwość"
  },
  {
    "id": "EM-D15-S1",
    "profile": "EM",
    "day": 15,
    "slot": "poranek",
    "category": "mentor",
    "title": "Polowa drogi - zobaczcie, co sie zmienilo",
    "body": "Dwa tygodnie razem. Zapytajcie się nawzajem rano: 'co już mi się udało zauważyć w sobie?'. Przyjaciel kwitnie, gdy ktoś widzi jej drobne kroki.",
    "icon": "rodzic",
    "tone": "amber",
    "time": "2 min",
    "tags": [
      "rozmowa",
      "podsumowanie"
    ],
    "audience": "rodzic",
    "subcategory": "rozmowa_sluchanie",
    "profileName": "Przyjaciel",
    "cecha": "Życzliwość"
  },
  {
    "id": "EM-D16-S3",
    "profile": "EM",
    "day": 16,
    "slot": "wieczor",
    "category": "mentor",
    "title": "Gdy dziecko placze 'za innych'",
    "body": "Jeśli Przyjaciel płacze nad smutną bajką lub historią kolegi - nie mówcie 'to tylko film'. Powiedzcie: 'masz dobre, czujące serce'. Walidacja, nie odcinanie.",
    "icon": "rodzic",
    "tone": "amber",
    "time": "2 min",
    "tags": [
      "empatia",
      "walidacja"
    ],
    "audience": "rodzic",
    "subcategory": "empatia_komus",
    "profileName": "Przyjaciel",
    "cecha": "Życzliwość"
  },
  {
    "id": "EM-D17-S3",
    "profile": "EM",
    "day": 17,
    "slot": "wieczor",
    "category": "medrzec",
    "title": "Nie musisz wszystkich pocieszac",
    "body": "Czasem chcesz pomóc każdemu - ale Ty też jesteś dzieckiem. To dorośli pocieszają dzieci, a nie odwrotnie. Możesz odpocząć.",
    "icon": "medrzec",
    "tone": "rose",
    "time": "2 min",
    "tags": [
      "granice",
      "wieczor"
    ],
    "audience": "rodzic",
    "subcategory": "granica_empaty",
    "profileName": "Przyjaciel",
    "cecha": "Życzliwość"
  },
  {
    "id": "EM-D18-S1",
    "profile": "EM",
    "day": 18,
    "slot": "poranek",
    "category": "mentor",
    "title": "Dzis sprawdzcie zapas wody",
    "body": "Przyjaciel zapomina pić - bo jest w głowie u innych. Wręczcie rano butelkę i krótko: 'twoja na dziś'. Drobny gest, duża zmiana w samopoczuciu.",
    "icon": "rodzic",
    "tone": "amber",
    "time": "1 min",
    "tags": [
      "woda",
      "cialo"
    ],
    "audience": "rodzic",
    "subcategory": "rytmy_dnia",
    "profileName": "Przyjaciel",
    "cecha": "Życzliwość"
  },
  {
    "id": "EM-D19-S3",
    "profile": "EM",
    "day": 19,
    "slot": "wieczor",
    "category": "mentor",
    "title": "Wieczor ze swieca lub lampka nocna",
    "body": "Wieczorem spróbujcie przygasić górne światło i zostawić spokojniejsze, cieplejsze oświetlenie. Zobaczcie, czy łatwiej wtedy przejść do odpoczynku.",
    "icon": "rodzic",
    "tone": "amber",
    "time": "1 min",
    "tags": [
      "sen",
      "rytual_wieczorny"
    ],
    "audience": "rodzic",
    "subcategory": "rytmy_dnia",
    "profileName": "Przyjaciel",
    "cecha": "Życzliwość"
  },
  {
    "id": "EM-D20-S3",
    "profile": "EM",
    "day": 20,
    "slot": "wieczor",
    "category": "medrzec",
    "title": "Lzy tez przychodza jak fala",
    "body": "Jeśli dziś chciało Ci się płakać, pamiętaj - łzy to fala. Przyszła, odeszła. To nie znaczy, że jest źle. To znaczy, że żyjesz głęboko.",
    "icon": "medrzec",
    "tone": "rose",
    "time": "1 min",
    "tags": [
      "emocje",
      "lzy"
    ],
    "audience": "rodzic",
    "subcategory": "emocje_rozpoznanie",
    "profileName": "Przyjaciel",
    "cecha": "Życzliwość"
  },
  {
    "id": "EM-D21-S1",
    "profile": "EM",
    "day": 21,
    "slot": "poranek",
    "category": "mentor",
    "title": "Gdy rano jest płacz albo rozdrażnienie",
    "body": "Jeśli dziecko rano płacze albo jest drażliwe, nie zakładaj od razu, że robi to „bez powodu”. Zwolnij tempo i spróbuj sprawdzić, czego potrzebuje.",
    "icon": "rodzic",
    "tone": "amber",
    "time": "2 min",
    "tags": [
      "przeciazenie",
      "wsparcie"
    ],
    "audience": "rodzic",
    "subcategory": "emocje_rozpoznanie",
    "profileName": "Przyjaciel",
    "cecha": "Życzliwość"
  },
  {
    "id": "EM-D22-S3",
    "profile": "EM",
    "day": 22,
    "slot": "wieczor",
    "category": "mentor",
    "title": "Wspolne 'co dzis czulam, co dzis czules'",
    "body": "Zaproponujcie wieczorny rytuał: jedno zdanie każdy - 'dziś {czułem|czułam}...'. Mama, tata też. Przyjaciel uczy się, że uczucia mają wszyscy. To uziemia.",
    "icon": "rodzic",
    "tone": "amber",
    "time": "2 min",
    "tags": [
      "rodzina",
      "rytual_wieczorny"
    ],
    "audience": "rodzic",
    "subcategory": "rytual_kojacy",
    "profileName": "Przyjaciel",
    "cecha": "Życzliwość"
  },
  {
    "id": "EM-D23-S3",
    "profile": "EM",
    "day": 23,
    "slot": "wieczor",
    "category": "medrzec",
    "title": "Gdy ktos krzyknal - to nie o Tobie",
    "body": "Jeśli ktoś dziś krzyknął przy Tobie - to była jego fala, nie Twoja. Nie zabieraj jej. Powiedz w sercu: 'to jego, nie moje'. Oddychaj.",
    "icon": "medrzec",
    "tone": "rose",
    "time": "2 min",
    "tags": [
      "granice",
      "emocje"
    ],
    "audience": "rodzic",
    "subcategory": "granica_empaty",
    "profileName": "Przyjaciel",
    "cecha": "Życzliwość"
  },
  {
    "id": "EM-D24-S1",
    "profile": "EM",
    "day": 24,
    "slot": "poranek",
    "category": "mentor",
    "title": "Ruch na początek dnia",
    "body": "Kilka–kilkanaście minut ruchu rano — taniec, spacer, skakanie czy rower — może pomóc dobrze wejść w dzień. Sprawdźcie, jaka forma ruchu najlepiej służy waszemu dziecku.",
    "icon": "rodzic",
    "tone": "amber",
    "time": "1 min",
    "tags": [
      "ruch",
      "cialo"
    ],
    "audience": "rodzic",
    "subcategory": "rytmy_dnia",
    "profileName": "Przyjaciel",
    "cecha": "Życzliwość"
  },
  {
    "id": "EM-D25-S3",
    "profile": "EM",
    "day": 25,
    "slot": "wieczor",
    "category": "mentor",
    "title": "Gdy cos jest naprawde za trudne",
    "body": "Jeśli Wasze dziecko mówi, że jest mu bardzo smutno przez wiele dni, albo nie chce nic robić - porozmawiajcie z psychologiem dziecięcym. To nie porażka. To mądrość.",
    "icon": "rodzic",
    "tone": "amber",
    "time": "2 min",
    "tags": [
      "specjalista",
      "wsparcie"
    ],
    "audience": "rodzic",
    "subcategory": "emocje_rozpoznanie",
    "profileName": "Przyjaciel",
    "cecha": "Życzliwość"
  },
  {
    "id": "EM-D26-S3",
    "profile": "EM",
    "day": 26,
    "slot": "wieczor",
    "category": "medrzec",
    "title": "Twoje serce jest madrzejsze, gdy odpoczywa",
    "body": "Twoje serce dziś dużo czuło. Teraz potrzebuje cichej chwili. Włóż dłoń pod policzek i powiedz: 'odpoczywam. dziękuję ci, serce.'",
    "icon": "medrzec",
    "tone": "rose",
    "time": "1 min",
    "tags": [
      "wieczor",
      "wdziecznosc"
    ],
    "audience": "rodzic",
    "subcategory": "emocje_rozpoznanie",
    "profileName": "Przyjaciel",
    "cecha": "Życzliwość"
  },
  {
    "id": "EM-D27-S1",
    "profile": "EM",
    "day": 27,
    "slot": "poranek",
    "category": "mentor",
    "title": "Daj jej, daj mu wybor koloru ubrania",
    "body": "Przyjaciel czuje przez kolor. Daj dziecku rano wybór: dwie bluzki, w dwóch kolorach. Decyzja kolorem to mały trening 'co mi dziś służy'.",
    "icon": "rodzic",
    "tone": "amber",
    "time": "1 min",
    "tags": [
      "rytual_poranny",
      "autonomia"
    ],
    "audience": "rodzic",
    "subcategory": "rytual_kojacy",
    "profileName": "Przyjaciel",
    "cecha": "Życzliwość"
  },
  {
    "id": "EM-D28-S3",
    "profile": "EM",
    "day": 28,
    "slot": "wieczor",
    "category": "mentor",
    "title": "Zauwazcie postep, nie idealnosc",
    "body": "Cztery tygodnie razem. Powiedzcie dziecku konkretnie: 'widzę, że ostatnio lepiej mówisz, co czujesz' albo 'widzę, że umiesz powiedzieć nie'. Przyjaciel kwitnie od dostrzegania.",
    "icon": "rodzic",
    "tone": "amber",
    "time": "2 min",
    "tags": [
      "walidacja",
      "podsumowanie"
    ],
    "audience": "rodzic",
    "subcategory": "emocje_rozpoznanie",
    "profileName": "Przyjaciel",
    "cecha": "Życzliwość"
  },
  {
    "id": "EM-D29-S3",
    "profile": "EM",
    "day": 29,
    "slot": "wieczor",
    "category": "medrzec",
    "title": "Twoje uczucia nie sa problemem",
    "body": "Nikt nie powinien mówić ci, że twoje uczucia są „złe”. Możesz je zauważać, nazywać i szukać bezpiecznego sposobu, żeby sobie z nimi poradzić.",
    "icon": "medrzec",
    "tone": "rose",
    "time": "2 min",
    "tags": [
      "emocje",
      "akceptacja"
    ],
    "audience": "rodzic",
    "subcategory": "emocje_rozpoznanie",
    "profileName": "Przyjaciel",
    "cecha": "Życzliwość"
  },
  {
    "id": "EM-D30-S1",
    "profile": "EM",
    "day": 30,
    "slot": "poranek",
    "category": "mentor",
    "title": "Serca bijące w rytmie",
    "body": "Gdy dwie osoby długo siedzą obok siebie, ich serca zaczynają bić w podobnym rytmie. Przyjaciel wyczuwa to wcześniej niż wszyscy.",
    "icon": "rodzic",
    "tone": "amber",
    "time": "1 min",
    "tags": [
      "rodzina",
      "swieto"
    ],
    "audience": "rodzic",
    "subcategory": "rytual_kojacy",
    "profileName": "Przyjaciel",
    "cecha": "Życzliwość"
  },
  {
    "id": "ST-D01-S3",
    "profile": "ST",
    "day": 1,
    "slot": "wieczor",
    "category": "medrzec",
    "title": "Co z mapy się udało",
    "body": "Wieczorem spójrzcie razem na rysunek z rana. Wizkor szepcze: zaznacz, co się udało, a co przesuwamy na jutro. Nic się nie psuje, tylko zmienia trasę.",
    "icon": "medrzec",
    "tone": "amber",
    "time": "2 min",
    "tags": [
      "przeglad",
      "wieczor",
      "plan_b"
    ],
    "audience": "rodzic",
    "subcategory": "elastycznosc_plan_b",
    "profileName": "Myśliciel",
    "cecha": "Mądrość"
  },
  {
    "id": "ST-D02-S1",
    "profile": "ST",
    "day": 2,
    "slot": "poranek",
    "category": "mentor",
    "title": "Powiedz rano, co będzie po kolei",
    "body": "Rodzicu, rano powiedz krótko, co będzie po kolei: śniadanie, ubieranie, droga. Twoje dziecko-Myśliciel wycisza się, gdy zna trasę.",
    "icon": "rodzic",
    "tone": "paper",
    "time": "1 min",
    "tags": [
      "rytm",
      "przewidywalnosc"
    ],
    "audience": "rodzic",
    "subcategory": "rytm_rytual_dnia",
    "profileName": "Myśliciel",
    "cecha": "Mądrość"
  },
  {
    "id": "ST-D03-S3",
    "profile": "ST",
    "day": 3,
    "slot": "wieczor",
    "category": "mentor",
    "title": "Gdy plan się sypie, nie znika",
    "body": "Rodzicu, jeśli dzisiejszy plan dziecka się rozsypał, powiedz: plan B to też plan. Myśliciel uczy się, że mapy się rysuje wielokrotnie.",
    "icon": "rodzic",
    "tone": "paper",
    "time": "1 min",
    "tags": [
      "plan_b",
      "elastycznosc"
    ],
    "audience": "rodzic",
    "subcategory": "elastycznosc_plan_b",
    "profileName": "Myśliciel",
    "cecha": "Mądrość"
  },
  {
    "id": "ST-D05-S1",
    "profile": "ST",
    "day": 5,
    "slot": "poranek",
    "category": "mentor",
    "title": "Dawaj wybór z dwóch ścieżek",
    "body": "Rodzicu, rano zaproponuj wybór: czerwona koszulka czy zielona, owsianka czy kanapka. Myśliciel potrzebuje czuć, że decyduje o własnej mapie.",
    "icon": "rodzic",
    "tone": "paper",
    "time": "1 min",
    "tags": [
      "wybor",
      "autonomia"
    ],
    "audience": "rodzic",
    "subcategory": "planowanie",
    "profileName": "Myśliciel",
    "cecha": "Mądrość"
  },
  {
    "id": "ST-D05-S3",
    "profile": "ST",
    "day": 5,
    "slot": "wieczor",
    "category": "medrzec",
    "title": "Mosiężne okulary patrzą wstecz",
    "body": "Wizkor zakłada okulary do patrzenia w dzień. Spójrz wstecz na dziś i powiedz jednym słowem, jaki był ten dzień.",
    "icon": "medrzec",
    "tone": "magic",
    "time": "1 min",
    "tags": [
      "refleksja",
      "wieczor"
    ],
    "audience": "rodzic",
    "subcategory": "planowanie",
    "profileName": "Myśliciel",
    "cecha": "Mądrość"
  },
  {
    "id": "ST-D07-S1",
    "profile": "ST",
    "day": 7,
    "slot": "poranek",
    "category": "mentor",
    "title": "Pochwal proces, nie tylko wynik",
    "body": "Rodzicu, gdy dziecko coś planuje, powiedz: widzę, że rozkładasz to na kroki. Myśliciel rośnie, gdy widzi, że droga się liczy bardziej niż meta.",
    "icon": "rodzic",
    "tone": "amber",
    "time": "1 min",
    "tags": [
      "proces",
      "pochwala"
    ],
    "audience": "rodzic",
    "subcategory": "nagroda_proces",
    "profileName": "Myśliciel",
    "cecha": "Mądrość"
  },
  {
    "id": "ST-D08-S3",
    "profile": "ST",
    "day": 8,
    "slot": "wieczor",
    "category": "medrzec",
    "title": "Dobry-wystarczający, nie idealny",
    "body": "Wizkor szepcze: dziś coś było dobre-wystarczające? To też skarb. Idealny to nie jest cel każdej mapy.",
    "icon": "medrzec",
    "tone": "amber",
    "time": "1 min",
    "tags": [
      "perfekcjonizm",
      "wieczor"
    ],
    "audience": "rodzic",
    "subcategory": "perfekcjonizm_antidote",
    "profileName": "Myśliciel",
    "cecha": "Mądrość"
  },
  {
    "id": "ST-D09-S1",
    "profile": "ST",
    "day": 9,
    "slot": "poranek",
    "category": "mentor",
    "title": "Pozwól dziecku planować weekend",
    "body": "Rodzicu, daj dziecku-Myślicielowi szansę zaplanować jedną rzecz na weekend od początku do końca. Nawet drobiazg. Buduje to poczucie kompetencji.",
    "icon": "rodzic",
    "tone": "paper",
    "time": "1 min",
    "tags": [
      "autonomia",
      "planowanie"
    ],
    "audience": "rodzic",
    "subcategory": "planowanie",
    "profileName": "Myśliciel",
    "cecha": "Mądrość"
  },
  {
    "id": "ST-D10-S3",
    "profile": "ST",
    "day": 10,
    "slot": "wieczor",
    "category": "mentor",
    "title": "Sen jest drogą do jutra",
    "body": "Dzieci w wieku 6–12 lat zwykle potrzebują 9–12 godzin snu na dobę. Sen to ważna część odpoczynku — po nim łatwiej zebrać myśli i uwagę.",
    "icon": "rodzic",
    "tone": "amber",
    "time": "1 min",
    "tags": [
      "sen",
      "wieczor"
    ],
    "audience": "rodzic",
    "subcategory": "zdrowie_strateg",
    "profileName": "Myśliciel",
    "cecha": "Mądrość"
  },
  {
    "id": "ST-D12-S1",
    "profile": "ST",
    "day": 12,
    "slot": "poranek",
    "category": "mentor",
    "title": "Gdy dziecko utknie na planie",
    "body": "Rodzicu, gdy widzisz, że dziecko utyka w nieskończonym planowaniu, powiedz łagodnie: zacznij od pierwszego kroku, reszta się ułoży.",
    "icon": "rodzic",
    "tone": "paper",
    "time": "1 min",
    "tags": [
      "perfekcjonizm",
      "wsparcie"
    ],
    "audience": "rodzic",
    "subcategory": "perfekcjonizm_antidote",
    "profileName": "Myśliciel",
    "cecha": "Mądrość"
  },
  {
    "id": "ST-D12-S3",
    "profile": "ST",
    "day": 12,
    "slot": "wieczor",
    "category": "medrzec",
    "title": "Co się nie udało, czego nauczyło",
    "body": "Wizkor mówi: weź jedną rzecz, która się nie udała, i pomyśl, czego cię nauczyła. Błąd to też informacja na mapie.",
    "icon": "medrzec",
    "tone": "amber",
    "time": "2 min",
    "tags": [
      "blad",
      "nauka"
    ],
    "audience": "rodzic",
    "subcategory": "elastycznosc_plan_b",
    "profileName": "Myśliciel",
    "cecha": "Mądrość"
  },
  {
    "id": "ST-D14-S1",
    "profile": "ST",
    "day": 14,
    "slot": "poranek",
    "category": "mentor",
    "title": "Nie poprawiaj każdego planu",
    "body": "Rodzicu, gdy dziecko pokaże swój plan, nie poprawiaj od razu. Zapytaj: a co potem? Myśliciel uczy się myśleć dalej, gdy ma przestrzeń.",
    "icon": "rodzic",
    "tone": "paper",
    "time": "1 min",
    "tags": [
      "wsparcie",
      "autonomia"
    ],
    "audience": "rodzic",
    "subcategory": "planowanie",
    "profileName": "Myśliciel",
    "cecha": "Mądrość"
  },
  {
    "id": "ST-D16-S1",
    "profile": "ST",
    "day": 16,
    "slot": "poranek",
    "category": "mentor",
    "title": "Frustracja, gdy plan się sypie",
    "body": "Rodzicu, gdy dziecko-Myśliciel wpada w złość, że coś poszło nie po jego planie, usiądź obok i powiedz: rozumiem, mapa się zmieniła. Pomóż przerysować.",
    "icon": "rodzic",
    "tone": "amber",
    "time": "1 min",
    "tags": [
      "emocje",
      "plan_b"
    ],
    "audience": "rodzic",
    "subcategory": "elastycznosc_plan_b",
    "profileName": "Myśliciel",
    "cecha": "Mądrość"
  },
  {
    "id": "ST-D16-S3",
    "profile": "ST",
    "day": 16,
    "slot": "wieczor",
    "category": "medrzec",
    "title": "Dziś byłem cierpliwy gdy",
    "body": "Wizkor pyta: dziś byłem cierpliwy, gdy... Dokończ zdanie. Nawet drobna cierpliwość zostawia ślad na mapie.",
    "icon": "medrzec",
    "tone": "paper",
    "time": "1 min",
    "tags": [
      "cierpliwosc",
      "wieczor"
    ],
    "audience": "rodzic",
    "subcategory": "odraczanie_gratyfikacji",
    "profileName": "Myśliciel",
    "cecha": "Mądrość"
  },
  {
    "id": "ST-D18-S1",
    "profile": "ST",
    "day": 18,
    "slot": "poranek",
    "category": "mentor",
    "title": "Pytaj o jak, nie o czemu",
    "body": "Rodzicu, gdy dziecko coś planuje, pytaj raczej jak chcesz to zrobić niż czemu tak. Myśliciel rozkwita w pytaniach o sposób.",
    "icon": "rodzic",
    "tone": "paper",
    "time": "1 min",
    "tags": [
      "rozmowa",
      "wsparcie"
    ],
    "audience": "rodzic",
    "subcategory": "planowanie",
    "profileName": "Myśliciel",
    "cecha": "Mądrość"
  },
  {
    "id": "ST-D19-S3",
    "profile": "ST",
    "day": 19,
    "slot": "wieczor",
    "category": "medrzec",
    "title": "Wizkor o cichym sukcesie",
    "body": "Wizkor szepcze: są sukcesy, których nikt nie widzi, oprócz ciebie. Pomyśl o jednym takim z dziś.",
    "icon": "medrzec",
    "tone": "amber",
    "time": "1 min",
    "tags": [
      "sukces",
      "wieczor"
    ],
    "audience": "rodzic",
    "subcategory": "planowanie",
    "profileName": "Myśliciel",
    "cecha": "Mądrość"
  },
  {
    "id": "ST-D20-S1",
    "profile": "ST",
    "day": 20,
    "slot": "poranek",
    "category": "mentor",
    "title": "Krótkie ostrzeżenia o zmianie",
    "body": "Rodzicu, gdy plan dnia się zmieni, uprzedź dziecko z wyprzedzeniem. Myśliciel trzyma się map, więc nagła zmiana boli mocniej.",
    "icon": "rodzic",
    "tone": "paper",
    "time": "1 min",
    "tags": [
      "zmiana",
      "przewidywalnosc"
    ],
    "audience": "rodzic",
    "subcategory": "planowanie",
    "profileName": "Myśliciel",
    "cecha": "Mądrość"
  },
  {
    "id": "ST-D21-S3",
    "profile": "ST",
    "day": 21,
    "slot": "wieczor",
    "category": "mentor",
    "title": "Nie ratuj zbyt szybko",
    "body": "Rodzicu, gdy dziecko utyka na zadaniu, daj chwilę więcej niż zwykle. Myśliciel uczy się przez próbowanie kolejnych kroków.",
    "icon": "rodzic",
    "tone": "paper",
    "time": "1 min",
    "tags": [
      "cierpliwosc",
      "wsparcie"
    ],
    "audience": "rodzic",
    "subcategory": "odraczanie_gratyfikacji",
    "profileName": "Myśliciel",
    "cecha": "Mądrość"
  },
  {
    "id": "ST-D22-S3",
    "profile": "ST",
    "day": 22,
    "slot": "wieczor",
    "category": "medrzec",
    "title": "Trzy rzeczy, które wiem o sobie",
    "body": "Wizkor pyta: wymień trzy rzeczy, które wiesz o sobie dzisiaj. Nawet drobne. Myśliciel zbiera wiedzę o sobie jak zwoje.",
    "icon": "medrzec",
    "tone": "paper",
    "time": "2 min",
    "tags": [
      "samoocena",
      "wieczor"
    ],
    "audience": "rodzic",
    "subcategory": "planowanie",
    "profileName": "Myśliciel",
    "cecha": "Mądrość"
  },
  {
    "id": "ST-D23-S1",
    "profile": "ST",
    "day": 23,
    "slot": "poranek",
    "category": "mentor",
    "title": "Pochwal próbę, nie tylko sukces",
    "body": "Rodzicu, dziś pochwal próbę: spróbowałeś, mimo że nie wyszło. Myśliciel uczy się wtedy, że próbowanie ma wartość samo w sobie.",
    "icon": "rodzic",
    "tone": "amber",
    "time": "1 min",
    "tags": [
      "proces",
      "pochwala"
    ],
    "audience": "rodzic",
    "subcategory": "nagroda_proces",
    "profileName": "Myśliciel",
    "cecha": "Mądrość"
  },
  {
    "id": "ST-D25-S1",
    "profile": "ST",
    "day": 25,
    "slot": "poranek",
    "category": "mentor",
    "title": "Krótkie listy, nie wielkie cele",
    "body": "Rodzicu, dla dziecka-Myśliciela lepsza jest krótka, zrobiona lista niż długi, niezrealizowany cel. Tnij rzeczy na małe kawałki.",
    "icon": "rodzic",
    "tone": "paper",
    "time": "1 min",
    "tags": [
      "lista",
      "planowanie"
    ],
    "audience": "rodzic",
    "subcategory": "planowanie",
    "profileName": "Myśliciel",
    "cecha": "Mądrość"
  },
  {
    "id": "ST-D26-S3",
    "profile": "ST",
    "day": 26,
    "slot": "wieczor",
    "category": "medrzec",
    "title": "Jedna rzecz, która mnie zaskoczyła",
    "body": "Wizkor pyta: co cię dziś zaskoczyło? Może mała rzecz. Zaskoczenie jest znakiem, że mapa się rozszerza.",
    "icon": "medrzec",
    "tone": "magic",
    "time": "1 min",
    "tags": [
      "ciekawosc",
      "wieczor"
    ],
    "audience": "rodzic",
    "subcategory": "mapy_kolejnosc",
    "profileName": "Myśliciel",
    "cecha": "Mądrość"
  },
  {
    "id": "ST-D27-S1",
    "profile": "ST",
    "day": 27,
    "slot": "poranek",
    "category": "mentor",
    "title": "Krótka pauza między zadaniami",
    "body": "Między zadaniami daj dziecku krótką pauzę — kilka minut bez kolejnych poleceń i bez ekranu. Taka przerwa może pomóc spokojniej przejść do następnej rzeczy.",
    "icon": "rodzic",
    "tone": "paper",
    "time": "1 min",
    "tags": [
      "przerwa",
      "regeneracja"
    ],
    "audience": "rodzic",
    "subcategory": "planowanie",
    "profileName": "Myśliciel",
    "cecha": "Mądrość"
  },
  {
    "id": "ST-D28-S3",
    "profile": "ST",
    "day": 28,
    "slot": "wieczor",
    "category": "mentor",
    "title": "Doceń elastyczność, nie tylko plan",
    "body": "Rodzicu, gdy dziecko zmieniło plan i poradziło sobie, powiedz to wprost: widzę, że umiesz przerysować mapę. To rzadka mądrość.",
    "icon": "rodzic",
    "tone": "amber",
    "time": "1 min",
    "tags": [
      "elastycznosc",
      "pochwala"
    ],
    "audience": "rodzic",
    "subcategory": "elastycznosc_plan_b",
    "profileName": "Myśliciel",
    "cecha": "Mądrość"
  },
  {
    "id": "ST-D29-S3",
    "profile": "ST",
    "day": 29,
    "slot": "wieczor",
    "category": "medrzec",
    "title": "Czego się o sobie dowiedziałem",
    "body": "Wizkor pyta: czego się w tym miesiącu dowiedziałeś o sobie? Jedna rzecz wystarczy. Zwiń jak zwój i schowaj w kieszeni serca.",
    "icon": "medrzec",
    "tone": "paper",
    "time": "2 min",
    "tags": [
      "samoocena",
      "podsumowanie"
    ],
    "audience": "rodzic",
    "subcategory": "planowanie",
    "profileName": "Myśliciel",
    "cecha": "Mądrość"
  },
  {
    "id": "ST-D30-S3",
    "profile": "ST",
    "day": 30,
    "slot": "wieczor",
    "category": "mentor",
    "title": "Następna mapa już się rysuje",
    "body": "Rodzicu, dziś powiedz dziecku: skończyliśmy tę mapę razem. Następna już się rysuje. Myśliciel odpoczywa lepiej, gdy wie, że droga ma ciąg dalszy.",
    "icon": "rodzic",
    "tone": "amber",
    "time": "2 min",
    "tags": [
      "zamkniecie",
      "wieczor"
    ],
    "audience": "rodzic",
    "subcategory": "planowanie",
    "profileName": "Myśliciel",
    "cecha": "Mądrość"
  },
  {
    "id": "KR-D01-S3",
    "profile": "KR",
    "day": 1,
    "slot": "wieczor",
    "category": "mentor",
    "subcategory": "skarbnica_pomyslow",
    "audience": "rodzic",
    "title": "Załóż dziecku Skarbnicę Pomysłów",
    "body": "Weź zwykły zeszyt i nazwijcie go razem 'Skarbnica'. To miejsce, gdzie lądować będą pomysły na potem. Bez oceniania, bez musu używania.",
    "icon": "zwoj",
    "tone": "paper",
    "time": "2 min",
    "tags": [
      "notes",
      "skarbnica",
      "rytual"
    ],
    "profileName": "Wynalazca",
    "cecha": "Kreatywność"
  },
  {
    "id": "KR-D02-S3",
    "profile": "KR",
    "day": 2,
    "slot": "wieczor",
    "category": "mentor",
    "subcategory": "proces_nie_wynik",
    "audience": "rodzic",
    "title": "Pochwal próbowanie, nie efekt",
    "body": "Zamiast 'ładnie narysowałeś', spróbuj 'widzę, że próbowałeś czegoś nowego'. Dla Wynalazcy ważna jest droga, nie ocena końcowa.",
    "icon": "mentor",
    "tone": "rose",
    "time": "2 min",
    "tags": [
      "pochwala",
      "proces",
      "komunikacja"
    ],
    "profileName": "Wynalazca",
    "cecha": "Kreatywność"
  },
  {
    "id": "KR-D03-S3",
    "profile": "KR",
    "day": 3,
    "slot": "wieczor",
    "category": "mentor",
    "subcategory": "rytmy_dnia",
    "audience": "rodzic",
    "title": "Przerwa w środku tworzenia",
    "body": "Gdy dziecko mocno wciągnie się w tworzenie, może przegapić porę jedzenia albo picia. Spokojnie przypomnij o przerwie, wodzie i posiłku.",
    "icon": "mentor",
    "tone": "leaf",
    "time": "2 min",
    "tags": [
      "jedzenie",
      "woda",
      "rytm_dnia"
    ],
    "profileName": "Wynalazca",
    "cecha": "Kreatywność"
  },
  {
    "id": "KR-D04-S3",
    "profile": "KR",
    "day": 4,
    "slot": "wieczor",
    "category": "mentor",
    "subcategory": "balagan_porzadek",
    "audience": "rodzic",
    "title": "Bałagan to ślad pracy, nie nieporządek",
    "body": "Po sesji tworzenia warto ustalić prosty rytuał: pięć minut zbierania razem. Nie kara, tylko zamknięcie procesu. Wynalazca potrzebuje granicy.",
    "icon": "mentor",
    "tone": "leaf",
    "time": "2 min",
    "tags": [
      "balagan",
      "rytual",
      "sprzatanie"
    ],
    "profileName": "Wynalazca",
    "cecha": "Kreatywność"
  },
  {
    "id": "KR-D05-S3",
    "profile": "KR",
    "day": 5,
    "slot": "wieczor",
    "category": "mentor",
    "subcategory": "relacje_inspiracja",
    "audience": "rodzic",
    "title": "Gdy pokazuje ci swoje dzieło",
    "body": "Kiedy dziecko pokazuje rysunek, najpierw zapytaj: 'Opowiedz mi o tym'. Bez interpretacji. Pytanie otwiera, ocena zamyka.",
    "icon": "mentor",
    "tone": "rose",
    "time": "2 min",
    "tags": [
      "rozmowa",
      "dzielo",
      "uwaga"
    ],
    "profileName": "Wynalazca",
    "cecha": "Kreatywność"
  },
  {
    "id": "KR-D06-S3",
    "profile": "KR",
    "day": 6,
    "slot": "wieczor",
    "category": "mentor",
    "subcategory": "skarbnica_pomyslow",
    "audience": "rodzic",
    "title": "Zapisz dziś jeden pomysł dziecka",
    "body": "Wieczorem zapytaj, co dziś wymyśliło. Zapisz to w skarbnicy, nawet jednym słowem. Zobaczy, że pomysły mają wartość.",
    "icon": "zwoj",
    "tone": "paper",
    "time": "2 min",
    "tags": [
      "skarbnica",
      "zapisywanie",
      "wartosc"
    ],
    "profileName": "Wynalazca",
    "cecha": "Kreatywność"
  },
  {
    "id": "KR-D07-S3",
    "profile": "KR",
    "day": 7,
    "slot": "wieczor",
    "category": "mentor",
    "subcategory": "rytmy_dnia",
    "audience": "rodzic",
    "title": "Sen po dniu pełnym pomysłów",
    "body": "Dzieci w wieku 6–12 lat zwykle potrzebują 9–12 godzin snu na dobę. Sen daje organizmowi i mózgowi czas na odpoczynek po pełnym wrażeń dniu.",
    "icon": "mentor",
    "tone": "leaf",
    "time": "2 min",
    "tags": [
      "sen",
      "wellbeing",
      "regeneracja"
    ],
    "profileName": "Wynalazca",
    "cecha": "Kreatywność"
  },
  {
    "id": "KR-D08-S3",
    "profile": "KR",
    "day": 8,
    "slot": "wieczor",
    "category": "mentor",
    "subcategory": "balagan_porzadek",
    "audience": "rodzic",
    "title": "Trzy pudełka kończą tworzenie",
    "body": "Postaw obok stołu trzy pudła: 'gotowe', 'na potem', 'do wyrzucenia'. Dziecko samo segreguje. Sprzątanie staje się częścią tworzenia.",
    "icon": "mentor",
    "tone": "paper",
    "time": "2 min",
    "tags": [
      "pudelka",
      "sprzatanie",
      "system"
    ],
    "profileName": "Wynalazca",
    "cecha": "Kreatywność"
  },
  {
    "id": "KR-D09-S3",
    "profile": "KR",
    "day": 9,
    "slot": "wieczor",
    "category": "mentor",
    "subcategory": "relacje_inspiracja",
    "audience": "rodzic",
    "title": "Pokaż dziecku coś, co ty stworzyłaś",
    "body": "Zdjęcie, rysunek, ciasto, lista zakupów z bazgrołami. Dziecko widzi, że dorosłym też wolno tworzyć niedoskonałe rzeczy.",
    "icon": "mentor",
    "tone": "rose",
    "time": "2 min",
    "tags": [
      "wspolne",
      "tworzenie",
      "wzor"
    ],
    "profileName": "Wynalazca",
    "cecha": "Kreatywność"
  },
  {
    "id": "KR-D10-S3",
    "profile": "KR",
    "day": 10,
    "slot": "wieczor",
    "category": "mentor",
    "subcategory": "proces_nie_wynik",
    "audience": "rodzic",
    "title": "Pierwszy szkic ma prawo być brzydki",
    "body": "Gdy dziecko mówi: „to brzydkie, wyrzucę”, możesz odpowiedzieć: „pierwszy szkic nie musi być idealny. Jeśli chcesz, spróbuj jeszcze jednej wersji”. Wspieraj proces, nie tylko efekt.",
    "icon": "mentor",
    "tone": "rose",
    "time": "2 min",
    "tags": [
      "szkic",
      "proces",
      "akceptacja"
    ],
    "profileName": "Wynalazca",
    "cecha": "Kreatywność"
  },
  {
    "id": "KR-D11-S3",
    "profile": "KR",
    "day": 11,
    "slot": "wieczor",
    "category": "mentor",
    "subcategory": "skarbnica_pomyslow",
    "audience": "rodzic",
    "title": "Pudełko na 'na potem'",
    "body": "Dziecko chce zacząć trzy projekty naraz? Powiedz: 'wrzućmy jeden do pudełka na potem'. Pomysł nie ginie, ale dziś kończysz tylko jedno.",
    "icon": "zwoj",
    "tone": "paper",
    "time": "2 min",
    "tags": [
      "pudelko",
      "na_potem",
      "wybor"
    ],
    "profileName": "Wynalazca",
    "cecha": "Kreatywność"
  },
  {
    "id": "KR-D12-S3",
    "profile": "KR",
    "day": 12,
    "slot": "wieczor",
    "category": "mentor",
    "subcategory": "rytmy_dnia",
    "audience": "rodzic",
    "title": "Skład dnia daje przestrzeń na tworzenie",
    "body": "Wynalazca kwitnie, gdy ma czas wolny bez planu, ale też stałe ramy: posiłki, sen, ruch. Wolność rośnie w przewidywalności.",
    "icon": "mentor",
    "tone": "leaf",
    "time": "2 min",
    "tags": [
      "rytm",
      "przestrzen",
      "ramy"
    ],
    "profileName": "Wynalazca",
    "cecha": "Kreatywność"
  },
  {
    "id": "KR-D13-S3",
    "profile": "KR",
    "day": 13,
    "slot": "wieczor",
    "category": "mentor",
    "subcategory": "relacje_inspiracja",
    "audience": "rodzic",
    "title": "Krytyka rodzeństwa boli najbardziej",
    "body": "Gdy rodzeństwo śmieje się z dzieła Wynalazcy, nie minimalizuj. Powiedz: 'wiem, że to bolało'. Walidacja chroni odwagę tworzenia.",
    "icon": "mentor",
    "tone": "rose",
    "time": "2 min",
    "tags": [
      "krytyka",
      "rodzenstwo",
      "walidacja"
    ],
    "profileName": "Wynalazca",
    "cecha": "Kreatywność"
  },
  {
    "id": "KR-D14-S3",
    "profile": "KR",
    "day": 14,
    "slot": "wieczor",
    "category": "mentor",
    "subcategory": "balagan_porzadek",
    "audience": "rodzic",
    "title": "Razem zbierajcie po tworzeniu",
    "body": "Pięć minut sprzątania razem na koniec. Własny gest, własna piosenka. Sprzątanie staje się częścią tworzenia, nie karą po nim.",
    "icon": "mentor",
    "tone": "leaf",
    "time": "2 min",
    "tags": [
      "sprzatanie",
      "razem",
      "rytual"
    ],
    "profileName": "Wynalazca",
    "cecha": "Kreatywność"
  },
  {
    "id": "KR-D15-S3",
    "profile": "KR",
    "day": 15,
    "slot": "wieczor",
    "category": "mentor",
    "subcategory": "skarbnica_pomyslow",
    "audience": "rodzic",
    "title": "Połowa miesiąca w skarbnicy",
    "body": "Po dwóch tygodniach zajrzyjcie razem do skarbnicy. Żaden pomysł nie musi być zrealizowany. Wystarczy, że tam jest. To uczy szacunku do własnych myśli.",
    "icon": "zwoj",
    "tone": "paper",
    "time": "2 min",
    "tags": [
      "skarbnica",
      "szacunek",
      "mysli"
    ],
    "profileName": "Wynalazca",
    "cecha": "Kreatywność"
  },
  {
    "id": "KR-D16-S3",
    "profile": "KR",
    "day": 16,
    "slot": "wieczor",
    "category": "mentor",
    "subcategory": "proces_nie_wynik",
    "audience": "rodzic",
    "title": "Dziwne dzieło to znak myślenia",
    "body": "Gdy widzisz coś 'dziwnego', to znak, że dziecko połączyło dwa odległe światy. To wartość, nie błąd. Doceniaj zaskoczenie.",
    "icon": "mentor",
    "tone": "rose",
    "time": "2 min",
    "tags": [
      "dziwne",
      "polaczenia",
      "myslenie"
    ],
    "profileName": "Wynalazca",
    "cecha": "Kreatywność"
  },
  {
    "id": "KR-D17-S3",
    "profile": "KR",
    "day": 17,
    "slot": "wieczor",
    "category": "mentor",
    "subcategory": "rytmy_dnia",
    "audience": "rodzic",
    "title": "Ile ruchu dziennie",
    "body": "WHO zaleca dzieciom i młodzieży średnio co najmniej 60 minut umiarkowanej lub intensywnej aktywności dziennie w skali tygodnia. Ruch może być zabawą: bieganiem, tańcem, rowerem czy grą na dworze.",
    "icon": "mentor",
    "tone": "leaf",
    "time": "2 min",
    "tags": [
      "ruch",
      "wellbeing",
      "reset"
    ],
    "profileName": "Wynalazca",
    "cecha": "Kreatywność"
  },
  {
    "id": "KR-D18-S3",
    "profile": "KR",
    "day": 18,
    "slot": "wieczor",
    "category": "mentor",
    "subcategory": "relacje_inspiracja",
    "audience": "rodzic",
    "title": "Pierwsza publiczność jest delikatna",
    "body": "Gdy dziecko po raz pierwszy pokazuje dzieło, jest jak pierwszy pomidor wystawiony przez okno. Poważnie wysłuchaj. Reszta świata będzie surowsza.",
    "icon": "mentor",
    "tone": "rose",
    "time": "2 min",
    "tags": [
      "publicznosc",
      "pierwsza",
      "ochrona"
    ],
    "profileName": "Wynalazca",
    "cecha": "Kreatywność"
  },
  {
    "id": "KR-D19-S3",
    "profile": "KR",
    "day": 19,
    "slot": "wieczor",
    "category": "mentor",
    "subcategory": "skarbnica_pomyslow",
    "audience": "rodzic",
    "title": "Pomysł uratowany od zapomnienia",
    "body": "Dziecko mówi przed snem: 'mam pomysł!'. Zapisz w jego skarbnicy jednym słowem. Jutro rano znajdzie iskrę tam, gdzie wczoraj ją zostawiło.",
    "icon": "zwoj",
    "tone": "paper",
    "time": "2 min",
    "tags": [
      "pomysl",
      "wieczor",
      "zapis"
    ],
    "profileName": "Wynalazca",
    "cecha": "Kreatywność"
  },
  {
    "id": "KR-D20-S3",
    "profile": "KR",
    "day": 20,
    "slot": "wieczor",
    "category": "mentor",
    "subcategory": "balagan_porzadek",
    "audience": "rodzic",
    "title": "Kącik tworzenia z własnymi zasadami",
    "body": "Jeśli możesz, wyznacz mały stolik albo kąt tylko do tworzenia. Tam bałagan jest dozwolony. Reszta domu odpoczywa.",
    "icon": "mentor",
    "tone": "leaf",
    "time": "2 min",
    "tags": [
      "kacik",
      "stol",
      "przestrzen"
    ],
    "profileName": "Wynalazca",
    "cecha": "Kreatywność"
  },
  {
    "id": "KR-D21-S3",
    "profile": "KR",
    "day": 21,
    "slot": "wieczor",
    "category": "mentor",
    "subcategory": "rytmy_dnia",
    "audience": "rodzic",
    "title": "Woda obok stanowiska pracy",
    "body": "Dzieci-Wynalazcy często są rozkojarzone i zapominają pić. Postaw butelkę obok ich miejsca pracy. Bez upominania, po prostu blisko.",
    "icon": "mentor",
    "tone": "leaf",
    "time": "2 min",
    "tags": [
      "woda",
      "wellbeing",
      "drobne"
    ],
    "profileName": "Wynalazca",
    "cecha": "Kreatywność"
  },
  {
    "id": "KR-D22-S3",
    "profile": "KR",
    "day": 22,
    "slot": "wieczor",
    "category": "mentor",
    "subcategory": "relacje_inspiracja",
    "audience": "rodzic",
    "title": "Wystawa w korytarzu",
    "body": "Powieś jedno dzieło dziecka na sznurku albo na lodówce. To pierwsze publiczne miejsce. Wymieniaj co tydzień. Dom staje się galerią.",
    "icon": "mentor",
    "tone": "rose",
    "time": "2 min",
    "tags": [
      "wystawa",
      "galeria",
      "dom"
    ],
    "profileName": "Wynalazca",
    "cecha": "Kreatywność"
  },
  {
    "id": "KR-D23-S3",
    "profile": "KR",
    "day": 23,
    "slot": "wieczor",
    "category": "mentor",
    "subcategory": "proces_nie_wynik",
    "audience": "rodzic",
    "title": "Trzy pytania zamiast oceny",
    "body": "Zamiast 'ładnie', spróbuj: 'co tu się dzieje?', 'co było trudne?', 'co lubisz w tym najbardziej?'. Pytania pokazują, że widzisz proces.",
    "icon": "mentor",
    "tone": "rose",
    "time": "2 min",
    "tags": [
      "pytania",
      "ocena",
      "proces"
    ],
    "profileName": "Wynalazca",
    "cecha": "Kreatywność"
  },
  {
    "id": "KR-D24-S3",
    "profile": "KR",
    "day": 24,
    "slot": "wieczor",
    "category": "mentor",
    "subcategory": "skarbnica_pomyslow",
    "audience": "rodzic",
    "title": "Skarbnica jako prezent od siebie",
    "body": "Pokaż dziecku skarbnicę jako miejsce, gdzie wraca po inspirację. 'Twoje pomysły czekają na ciebie'. To uczy, że warto słuchać własnej głowy.",
    "icon": "zwoj",
    "tone": "paper",
    "time": "2 min",
    "tags": [
      "skarbnica",
      "wraca",
      "wartosc"
    ],
    "profileName": "Wynalazca",
    "cecha": "Kreatywność"
  },
  {
    "id": "KR-D25-S3",
    "profile": "KR",
    "day": 25,
    "slot": "wieczor",
    "category": "mentor",
    "subcategory": "rytmy_dnia",
    "audience": "rodzic",
    "title": "Wieczorne wyciszenie po dniu pomysłów",
    "body": "Po dniu pełnym wrażeń warto łagodnie zwolnić: ciepła kąpiel lub prysznic, książka i spokojniejsze światło mogą pomóc przejść do wieczornego odpoczynku.",
    "icon": "mentor",
    "tone": "leaf",
    "time": "2 min",
    "tags": [
      "wyciszenie",
      "sen",
      "wieczor"
    ],
    "profileName": "Wynalazca",
    "cecha": "Kreatywność"
  },
  {
    "id": "KR-D26-S3",
    "profile": "KR",
    "day": 26,
    "slot": "wieczor",
    "category": "mentor",
    "subcategory": "balagan_porzadek",
    "audience": "rodzic",
    "title": "Zdjęcie zamiast trzymania wszystkiego",
    "body": "Nie da się zatrzymać każdego dzieła. Zrób zdjęcie i wpiszcie do cyfrowej skarbnicy. Dzieło może ruszyć dalej, pamięć zostaje.",
    "icon": "mentor",
    "tone": "paper",
    "time": "2 min",
    "tags": [
      "zdjecie",
      "pamiec",
      "skarbnica"
    ],
    "profileName": "Wynalazca",
    "cecha": "Kreatywność"
  },
  {
    "id": "KR-D27-S3",
    "profile": "KR",
    "day": 27,
    "slot": "wieczor",
    "category": "mentor",
    "subcategory": "relacje_inspiracja",
    "audience": "rodzic",
    "title": "Inspiracja z natury, nie z ekranów",
    "body": "Krótki spacer, okno, balkon. Dla Wynalazcy świat realny daje więcej iskier niż długie oglądanie filmów. Patrzcie razem na chmury, drzewa, deszcze.",
    "icon": "mentor",
    "tone": "leaf",
    "time": "2 min",
    "tags": [
      "natura",
      "inspiracja",
      "spacer"
    ],
    "profileName": "Wynalazca",
    "cecha": "Kreatywność"
  },
  {
    "id": "KR-D28-S3",
    "profile": "KR",
    "day": 28,
    "slot": "wieczor",
    "category": "mentor",
    "subcategory": "skarbnica_pomyslow",
    "audience": "rodzic",
    "title": "Pomysł ze skarbnicy w kalendarzu",
    "body": "Wybierzcie razem jeden pomysł ze skarbnicy, który chcecie zrobić w tym tygodniu. Zapis w kalendarzu pokazuje, że marzenia mają datę.",
    "icon": "zwoj",
    "tone": "paper",
    "time": "2 min",
    "tags": [
      "kalendarz",
      "skarbnica",
      "plan"
    ],
    "profileName": "Wynalazca",
    "cecha": "Kreatywność"
  },
  {
    "id": "KR-D29-S3",
    "profile": "KR",
    "day": 29,
    "slot": "wieczor",
    "category": "mentor",
    "subcategory": "proces_nie_wynik",
    "audience": "rodzic",
    "title": "Niedokończone też ma wartość",
    "body": "Czasem proces sam w sobie jest dziełem. Jeśli dziecko nie chce kończyć, zapytaj: 'czego się nauczyłeś?'. Doświadczenie liczy się tak samo.",
    "icon": "mentor",
    "tone": "rose",
    "time": "2 min",
    "tags": [
      "niedokonczone",
      "nauka",
      "wartosc"
    ],
    "profileName": "Wynalazca",
    "cecha": "Kreatywność"
  },
  {
    "id": "KR-D30-S3",
    "profile": "KR",
    "day": 30,
    "slot": "wieczor",
    "category": "mentor",
    "subcategory": "relacje_inspiracja",
    "audience": "rodzic",
    "title": "Po miesiącu zajrzyjcie do skarbnicy razem",
    "body": "Otwórzcie razem skarbnicę. Bez oceniania, bez planów. Po prostu zobaczcie, ile myśli się tam zebrało. To podarunek dziecka samemu sobie.",
    "icon": "mentor",
    "tone": "rose",
    "time": "2 min",
    "tags": [
      "skarbnica",
      "podsumowanie",
      "razem"
    ],
    "profileName": "Wynalazca",
    "cecha": "Kreatywność"
  },
  {
    "id": "LD-D01-S3",
    "profile": "LD",
    "day": 1,
    "slot": "wieczor",
    "category": "medrzec",
    "title": "Gdzie dziś byłem pierwszy?",
    "body": "Wieczorem pomyśl: w czym dziś {zrobiłeś|zrobiłaś} pierwszy ruch? Nawet maleńki. Pamiętaj, lider to nie ten, kto krzyczy najgłośniej, tylko ten, kto zaczyna z troską.",
    "icon": "pulse",
    "tone": "rose",
    "time": "1 min",
    "tags": [
      "refleksja",
      "inicjatywa"
    ],
    "audience": "rodzic",
    "subcategory": "inicjatywa_grupa",
    "profileName": "Śmiałek",
    "cecha": "Odwaga"
  },
  {
    "id": "LD-D02-S1",
    "profile": "LD",
    "day": 2,
    "slot": "poranek",
    "category": "mentor",
    "title": "Rodzicu: nie tłum jego głosu",
    "body": "Gdy dziecko mówi coś z przekonaniem, spróbuj nie przerywać mu od razu. Możesz powiedzieć: „dobrze, że masz własne zdanie” i dopytać, jak do niego doszło.",
    "icon": "rodzic",
    "tone": "magic",
    "time": "2 min",
    "tags": [
      "rodzic",
      "asertywność"
    ],
    "audience": "rodzic",
    "subcategory": "asertywnosc",
    "profileName": "Śmiałek",
    "cecha": "Odwaga"
  },
  {
    "id": "LD-D03-S3",
    "profile": "LD",
    "day": 3,
    "slot": "wieczor",
    "category": "medrzec",
    "title": "Pierwszy — dla siebie czy dla kogoś?",
    "body": "Wieczorne pytanie Wizkora: kiedy dziś {byłem pierwszy|byłam pierwsza} — z pychy czy z troski? Obie odpowiedzi są w porządku. Ważne, żeby je zobaczyć.",
    "icon": "medrzec",
    "tone": "amber",
    "time": "1 min",
    "tags": [
      "refleksja",
      "troska"
    ],
    "audience": "rodzic",
    "subcategory": "asertywnosc",
    "profileName": "Śmiałek",
    "cecha": "Odwaga"
  },
  {
    "id": "LD-D04-S1",
    "profile": "LD",
    "day": 4,
    "slot": "poranek",
    "category": "mentor",
    "title": "Rodzicu: daj mu wybór",
    "body": "Drogi Rodzicu, Śmiałek rośnie, gdy decyduje. Daj dziecku dziś jeden prawdziwy wybór: co na śniadanie, jaką trasę do szkoły, jaką książkę wieczorem. Decyzja buduje serce.",
    "icon": "rodzic",
    "tone": "magic",
    "time": "2 min",
    "tags": [
      "rodzic",
      "decyzje"
    ],
    "audience": "rodzic",
    "subcategory": "asertywnosc",
    "profileName": "Śmiałek",
    "cecha": "Odwaga"
  },
  {
    "id": "LD-D04-S3",
    "profile": "LD",
    "day": 4,
    "slot": "wieczor",
    "category": "medrzec",
    "title": "Odpoczynek też daje siłę",
    "body": "Śmiałku, odpoczynek też daje siłę. Dzieci w wieku 6–12 lat zwykle potrzebują 9–12 godzin snu na dobę. Sen nie jest stratą czasu — pomaga przygotować się na kolejny dzień.",
    "icon": "medrzec",
    "tone": "rose",
    "time": "1 min",
    "tags": [
      "sen",
      "odpoczynek_lidera"
    ],
    "audience": "rodzic",
    "subcategory": "regeneracja_lidera",
    "profileName": "Śmiałek",
    "cecha": "Odwaga"
  },
  {
    "id": "LD-D05-S3",
    "profile": "LD",
    "day": 5,
    "slot": "wieczor",
    "category": "medrzec",
    "title": "Kogo dziś {podniosłem|podniosłam}?",
    "body": "Wieczorem zlicz: komu dziś {dodałem|dodałam} siły? Choćby jednym zdaniem, uśmiechem, „dasz radę”. Mała tarcza, którą podałeś — wraca podwójnie.",
    "icon": "medrzec",
    "tone": "amber",
    "time": "1 min",
    "tags": [
      "refleksja",
      "troska"
    ],
    "audience": "rodzic",
    "subcategory": "asertywnosc",
    "profileName": "Śmiałek",
    "cecha": "Odwaga"
  },
  {
    "id": "LD-D06-S3",
    "profile": "LD",
    "day": 6,
    "slot": "wieczor",
    "category": "mentor",
    "title": "Rodzicu: pochwal odwagę, nie wynik",
    "body": "Drogi Rodzicu, dziś wieczorem powiedz dziecku konkretnie: „widziałam, że było ci trudno i zrobiłaś to”. To zdanie buduje Śmiałka bardziej niż „brawo”.",
    "icon": "rodzic",
    "tone": "magic",
    "time": "2 min",
    "tags": [
      "rodzic",
      "pochwała"
    ],
    "audience": "rodzic",
    "subcategory": "asertywnosc",
    "profileName": "Śmiałek",
    "cecha": "Odwaga"
  },
  {
    "id": "LD-D07-S3",
    "profile": "LD",
    "day": 7,
    "slot": "wieczor",
    "category": "medrzec",
    "title": "Tydzień pierwszy — co czuję?",
    "body": "Minął tydzień z Wizkorem. Połóż dłoń na piersi. Powiedz na głos: „{jestem Śmiałkiem|jestem Śmiałką}”. Posłuchaj, jak to brzmi. Twoja tarcza już lśni jaśniej.",
    "icon": "artifact",
    "tone": "magic",
    "time": "1 min",
    "tags": [
      "refleksja",
      "tożsamość"
    ],
    "audience": "rodzic",
    "subcategory": "asertywnosc",
    "profileName": "Śmiałek",
    "cecha": "Odwaga"
  },
  {
    "id": "LD-D08-S3",
    "profile": "LD",
    "day": 8,
    "slot": "wieczor",
    "category": "medrzec",
    "title": "Czego się dziś {bałem|bałam}?",
    "body": "Wieczorem nazwij to po imieniu: czego się dziś {bałem|bałam}? Strach nazwany staje się mniejszy. Tarcza Słońca lubi prawdę.",
    "icon": "medrzec",
    "tone": "rose",
    "time": "1 min",
    "tags": [
      "refleksja",
      "strach"
    ],
    "audience": "rodzic",
    "subcategory": "asertywnosc",
    "profileName": "Śmiałek",
    "cecha": "Odwaga"
  },
  {
    "id": "LD-D09-S1",
    "profile": "LD",
    "day": 9,
    "slot": "poranek",
    "category": "mentor",
    "title": "Rodzicu: pokaż swoją odwagę",
    "body": "Drogi Rodzicu, Śmiałek uczy się odwagi od ciebie. Opowiedz dziecku przy śniadaniu: „dziś trochę się boję czegoś, ale i tak zrobię”. To więcej warte niż wykład.",
    "icon": "rodzic",
    "tone": "magic",
    "time": "2 min",
    "tags": [
      "rodzic",
      "modelowanie"
    ],
    "audience": "rodzic",
    "subcategory": "odwaga_mala",
    "profileName": "Śmiałek",
    "cecha": "Odwaga"
  },
  {
    "id": "LD-D10-S3",
    "profile": "LD",
    "day": 10,
    "slot": "wieczor",
    "category": "medrzec",
    "title": "Komu dziś {pomogłem|pomogłam}?",
    "body": "Wieczorne pytanie: czyją tarczą {byłem|byłam} dziś? Choćby raz, choćby na chwilę. Śmiałek liczy nie krzyki, ale tarcze. Zaśnij z tą myślą.",
    "icon": "medrzec",
    "tone": "amber",
    "time": "1 min",
    "tags": [
      "refleksja",
      "pomoc"
    ],
    "audience": "rodzic",
    "subcategory": "pomoc_proaktywna",
    "profileName": "Śmiałek",
    "cecha": "Odwaga"
  },
  {
    "id": "LD-D11-S3",
    "profile": "LD",
    "day": 11,
    "slot": "wieczor",
    "category": "mentor",
    "title": "Rodzicu: zapytaj o trudne",
    "body": "Drogi Rodzicu, dziś wieczorem zapytaj: „co dziś było najtrudniejsze?”. Nie „jak w szkole?”. Pytanie konkretne otwiera Śmiałka. Słuchaj bez rad — najpierw słuchaj.",
    "icon": "rodzic",
    "tone": "magic",
    "time": "2 min",
    "tags": [
      "rodzic",
      "rozmowa"
    ],
    "audience": "rodzic",
    "subcategory": "asertywnosc",
    "profileName": "Śmiałek",
    "cecha": "Odwaga"
  },
  {
    "id": "LD-D12-S3",
    "profile": "LD",
    "day": 12,
    "slot": "wieczor",
    "category": "medrzec",
    "title": "Czy {zostawiłem|zostawiłam} miejsce?",
    "body": "Wieczorne pytanie Wizkora: czy dziś {zostawiłem|zostawiłam} komuś miejsce, żeby też był ważny? Śmiałek, który nie zostawia miejsca, staje się małym tyranem. A ty nie jesteś tyranem.",
    "icon": "medrzec",
    "tone": "rose",
    "time": "1 min",
    "tags": [
      "refleksja",
      "pokora"
    ],
    "audience": "rodzic",
    "subcategory": "asertywnosc",
    "profileName": "Śmiałek",
    "cecha": "Odwaga"
  },
  {
    "id": "LD-D13-S3",
    "profile": "LD",
    "day": 13,
    "slot": "wieczor",
    "category": "medrzec",
    "title": "Co dziś dał mi strach?",
    "body": "Mała mądrość: strach nie tylko boli. Czasem on nas pilnuje, czasem uczy. Wieczorem zapytaj: czego mnie dziś nauczył mój strach?",
    "icon": "medrzec",
    "tone": "amber",
    "time": "1 min",
    "tags": [
      "refleksja",
      "strach"
    ],
    "audience": "rodzic",
    "subcategory": "asertywnosc",
    "profileName": "Śmiałek",
    "cecha": "Odwaga"
  },
  {
    "id": "LD-D14-S1",
    "profile": "LD",
    "day": 14,
    "slot": "poranek",
    "category": "mentor",
    "title": "Rodzicu: nie naprawiaj zbyt szybko",
    "body": "Drogi Rodzicu, gdy Śmiałek opowiada o konflikcie, nie biegnij od razu z rozwiązaniem. Zapytaj: „jak chcesz to rozegrać?”. Dziecko-Śmiałek potrzebuje próbować, nie być prowadzonym.",
    "icon": "rodzic",
    "tone": "magic",
    "time": "2 min",
    "tags": [
      "rodzic",
      "autonomia"
    ],
    "audience": "rodzic",
    "subcategory": "asertywnosc",
    "profileName": "Śmiałek",
    "cecha": "Odwaga"
  },
  {
    "id": "LD-D14-S3",
    "profile": "LD",
    "day": 14,
    "slot": "wieczor",
    "category": "medrzec",
    "title": "Dwa tygodnie tarczy",
    "body": "Mały Śmiałku, jesteś już dwa tygodnie ze mną. Twoja Tarcza Słońca jest cieplejsza. Połóż dłoń na piersi. Czujesz? To nie ja zrobiłam — to ty.",
    "icon": "artifact",
    "tone": "magic",
    "time": "1 min",
    "tags": [
      "refleksja",
      "tożsamość"
    ],
    "audience": "rodzic",
    "subcategory": "asertywnosc",
    "profileName": "Śmiałek",
    "cecha": "Odwaga"
  },
  {
    "id": "LD-D15-S3",
    "profile": "LD",
    "day": 15,
    "slot": "wieczor",
    "category": "medrzec",
    "title": "Co mnie dziś zaskoczyło?",
    "body": "Wieczorem zapytaj siebie: co dziś było inne, niż się {spodziewałem|spodziewałam}? Tarcza Słońca lubi zaskoczenia — wtedy uczy się najwięcej.",
    "icon": "medrzec",
    "tone": "amber",
    "time": "1 min",
    "tags": [
      "refleksja",
      "ciekawość"
    ],
    "audience": "rodzic",
    "subcategory": "odwaga_mala",
    "profileName": "Śmiałek",
    "cecha": "Odwaga"
  },
  {
    "id": "LD-D16-S3",
    "profile": "LD",
    "day": 16,
    "slot": "wieczor",
    "category": "mentor",
    "title": "Rodzicu: zapytaj kogo dziś wspierał",
    "body": "Drogi Rodzicu, dziś wieczorem zamiast „jakie oceny”, zapytaj: „komu dziś pomogłaś, kogo wsparłeś?”. To pytanie kieruje Śmiałka na to, co naprawdę ważne.",
    "icon": "rodzic",
    "tone": "magic",
    "time": "2 min",
    "tags": [
      "rodzic",
      "rozmowa"
    ],
    "audience": "rodzic",
    "subcategory": "asertywnosc",
    "profileName": "Śmiałek",
    "cecha": "Odwaga"
  },
  {
    "id": "LD-D17-S3",
    "profile": "LD",
    "day": 17,
    "slot": "wieczor",
    "category": "medrzec",
    "title": "Wieczorne spojrzenie na siebie",
    "body": "Wieczorem zapytaj siebie: czy dziś próbowałem być ważniejszy od innych albo za mocno narzucałem swoje zdanie? Bez oceniania — po prostu zauważ i pomyśl, co jutro możesz zrobić inaczej.",
    "icon": "medrzec",
    "tone": "rose",
    "time": "1 min",
    "tags": [
      "refleksja",
      "pokora"
    ],
    "audience": "rodzic",
    "subcategory": "asertywnosc",
    "profileName": "Śmiałek",
    "cecha": "Odwaga"
  },
  {
    "id": "LD-D18-S3",
    "profile": "LD",
    "day": 18,
    "slot": "wieczor",
    "category": "medrzec",
    "title": "Gdzie zabrakło mi odwagi?",
    "body": "Wieczorne uczciwe pytanie: czy było dziś coś, gdzie {wolałem|wolałam} milczeć, a w sercu {wiedziałem|wiedziałam}, że trzeba powiedzieć? Bez bicia się. Po prostu zobaczę.",
    "icon": "medrzec",
    "tone": "rose",
    "time": "1 min",
    "tags": [
      "refleksja",
      "odwaga"
    ],
    "audience": "rodzic",
    "subcategory": "odwaga_mala",
    "profileName": "Śmiałek",
    "cecha": "Odwaga"
  },
  {
    "id": "LD-D19-S1",
    "profile": "LD",
    "day": 19,
    "slot": "poranek",
    "category": "mentor",
    "title": "Rodzicu: powierz mu odpowiedzialność",
    "body": "Drogi Rodzicu, daj dziś Śmiałkowi jedno małe zadanie tylko dla niego: nakryć stół, przypilnować młodszego, kupić chleb. Odpowiedzialność rozwija tarczę bardziej niż słowa.",
    "icon": "rodzic",
    "tone": "magic",
    "time": "2 min",
    "tags": [
      "rodzic",
      "odpowiedzialność"
    ],
    "audience": "rodzic",
    "subcategory": "asertywnosc",
    "profileName": "Śmiałek",
    "cecha": "Odwaga"
  },
  {
    "id": "LD-D20-S3",
    "profile": "LD",
    "day": 20,
    "slot": "wieczor",
    "category": "medrzec",
    "title": "Co wyszło krzywo, a było dobre?",
    "body": "Wieczorne pytanie: co dziś wyszło krzywo, a i tak było dobre, że {spróbowałeś|spróbowałaś}? Krzywe próby budują tarczę szybciej niż gładkie sukcesy.",
    "icon": "medrzec",
    "tone": "amber",
    "time": "1 min",
    "tags": [
      "refleksja",
      "porażka"
    ],
    "audience": "rodzic",
    "subcategory": "asertywnosc",
    "profileName": "Śmiałek",
    "cecha": "Odwaga"
  },
  {
    "id": "LD-D21-S3",
    "profile": "LD",
    "day": 21,
    "slot": "wieczor",
    "category": "mentor",
    "title": "Rodzicu: zauważ {jego|jej} spokój",
    "body": "Drogi Rodzicu, dzisiaj wieczorem powiedz konkretnie: „widzę, że ostatnio mniej krzyczysz”. Albo: „zauważyłam, że pomagasz młodszemu”. Konkret jak woda na korzeń.",
    "icon": "rodzic",
    "tone": "magic",
    "time": "2 min",
    "tags": [
      "rodzic",
      "docenianie"
    ],
    "audience": "rodzic",
    "subcategory": "asertywnosc",
    "profileName": "Śmiałek",
    "cecha": "Odwaga"
  },
  {
    "id": "LD-D22-S3",
    "profile": "LD",
    "day": 22,
    "slot": "wieczor",
    "category": "medrzec",
    "title": "Jak inni odebrali mój głos?",
    "body": "Wieczorne pytanie: gdy dziś coś {powiedziałem|powiedziałam} stanowczo, jak inni zareagowali? Nie chodzi o to, czy się zgodzili. Chodzi o to, jak się czuli. Śmiałek patrzy także na to.",
    "icon": "medrzec",
    "tone": "rose",
    "time": "1 min",
    "tags": [
      "refleksja",
      "empatia"
    ],
    "audience": "rodzic",
    "subcategory": "asertywnosc",
    "profileName": "Śmiałek",
    "cecha": "Odwaga"
  },
  {
    "id": "LD-D23-S1",
    "profile": "LD",
    "day": 23,
    "slot": "poranek",
    "category": "mentor",
    "title": "Rodzicu: nie nazywaj {jego|jej} „dominującą”",
    "body": "Drogi Rodzicu, słowa lepią dzieci. Zamiast „{uparty|uparta}”, powiedz: „masz mocne zdanie”. Zamiast „dominująca”, powiedz: „wiesz, czego chcesz”. Śmiałek słyszy etykiety długo.",
    "icon": "rodzic",
    "tone": "magic",
    "time": "2 min",
    "tags": [
      "rodzic",
      "język"
    ],
    "audience": "rodzic",
    "subcategory": "asertywnosc",
    "profileName": "Śmiałek",
    "cecha": "Odwaga"
  },
  {
    "id": "LD-D23-S3",
    "profile": "LD",
    "day": 23,
    "slot": "wieczor",
    "category": "medrzec",
    "title": "Z kim mam coś do naprawienia?",
    "body": "Wieczorem pomyśl spokojnie: czy jest ktoś, z kim mam dziś coś do uładzenia? Może wystarczy jedno zdanie jutro. Wizkor przypomni.",
    "icon": "medrzec",
    "tone": "rose",
    "time": "1 min",
    "tags": [
      "refleksja",
      "pojednanie"
    ],
    "audience": "rodzic",
    "subcategory": "asertywnosc",
    "profileName": "Śmiałek",
    "cecha": "Odwaga"
  },
  {
    "id": "LD-D24-S3",
    "profile": "LD",
    "day": 24,
    "slot": "wieczor",
    "category": "medrzec",
    "title": "Tarcza po dniu — schowaj ją",
    "body": "Wieczorem powiedz na głos: „dzisiaj odkładam tarczę”. Połóż dłoń na piersi, jakbyś ją {zsuwał|zsuwała}. Śmiałek, który zasypia, nie musi pilnować świata. Świat poczeka do rana.",
    "icon": "artifact",
    "tone": "rose",
    "time": "1 min",
    "tags": [
      "sen",
      "odpoczynek_lidera"
    ],
    "audience": "rodzic",
    "subcategory": "regeneracja_lidera",
    "profileName": "Śmiałek",
    "cecha": "Odwaga"
  },
  {
    "id": "LD-D25-S3",
    "profile": "LD",
    "day": 25,
    "slot": "wieczor",
    "category": "mentor",
    "title": "Rodzicu: nie obciążaj {go|jej} całą rodziną",
    "body": "Jeśli zauważasz, że dziecko bierze na siebie problemy dorosłych, powiedz jasno: „tym zajmą się dorośli. Ty nie musisz tego naprawiać”.",
    "icon": "rodzic",
    "tone": "magic",
    "time": "2 min",
    "tags": [
      "rodzic",
      "parentyfikacja"
    ],
    "audience": "rodzic",
    "subcategory": "asertywnosc",
    "profileName": "Śmiałek",
    "cecha": "Odwaga"
  },
  {
    "id": "LD-D26-S3",
    "profile": "LD",
    "day": 26,
    "slot": "wieczor",
    "category": "medrzec",
    "title": "Co widać z drugiego rzędu?",
    "body": "Wieczorne pytanie: jak to było stać z tyłu? Co {zobaczyłem|zobaczyłam} nowego? Czasem z drugiego rzędu widać więcej niż z pierwszego.",
    "icon": "medrzec",
    "tone": "rose",
    "time": "1 min",
    "tags": [
      "refleksja",
      "perspektywa"
    ],
    "audience": "rodzic",
    "subcategory": "asertywnosc",
    "profileName": "Śmiałek",
    "cecha": "Odwaga"
  },
  {
    "id": "LD-D27-S3",
    "profile": "LD",
    "day": 27,
    "slot": "wieczor",
    "category": "mentor",
    "title": "Rodzicu: zapytaj o {jego|jej} marzenie",
    "body": "Drogi Rodzicu, dzisiaj wieczorem nie pytaj o lekcje. Zapytaj: „o czym ostatnio marzysz?”. Słuchaj bez prostowania, bez „bądź realistka”. To pytania, które otwierają serce.",
    "icon": "rodzic",
    "tone": "magic",
    "time": "2 min",
    "tags": [
      "rodzic",
      "marzenia"
    ],
    "audience": "rodzic",
    "subcategory": "asertywnosc",
    "profileName": "Śmiałek",
    "cecha": "Odwaga"
  },
  {
    "id": "LD-D28-S3",
    "profile": "LD",
    "day": 28,
    "slot": "wieczor",
    "category": "medrzec",
    "title": "Czy ktoś inny musi wiedzieć?",
    "body": "Wieczorne pytanie: czy potrafię zrobić dobro i nie powiedzieć o tym? Tarcza Słońca świeci najjaśniej, gdy nikt nie patrzy. Wizkor i tak widzi.",
    "icon": "medrzec",
    "tone": "magic",
    "time": "1 min",
    "tags": [
      "refleksja",
      "pokora"
    ],
    "audience": "rodzic",
    "subcategory": "asertywnosc",
    "profileName": "Śmiałek",
    "cecha": "Odwaga"
  },
  {
    "id": "LD-D29-S1",
    "profile": "LD",
    "day": 29,
    "slot": "poranek",
    "category": "mentor",
    "title": "Rodzicu: planuj z {nim|nią}, nie za {nim|nią}",
    "body": "Drogi Rodzicu, jesteście prawie na końcu. Spróbuj dziś zaplanować dzień RAZEM z Śmiałkiem. „Co dziś robimy? Kiedy? Jak?”. Współplanowanie ćwiczy odpowiedzialność lepiej niż rozkazywanie.",
    "icon": "rodzic",
    "tone": "magic",
    "time": "2 min",
    "tags": [
      "rodzic",
      "współpraca"
    ],
    "audience": "rodzic",
    "subcategory": "asertywnosc",
    "profileName": "Śmiałek",
    "cecha": "Odwaga"
  },
  {
    "id": "LD-D29-S3",
    "profile": "LD",
    "day": 29,
    "slot": "wieczor",
    "category": "medrzec",
    "title": "Przedostatnia noc — co zostawiam?",
    "body": "Wieczorem pomyśl: z tych 29 dni, co chcę zatrzymać na dłużej? Jedno zachowanie, jedno zdanie, jedna myśl. Wybierz świadomie. To pójdzie z tobą dalej.",
    "icon": "medrzec",
    "tone": "amber",
    "time": "1 min",
    "tags": [
      "refleksja",
      "intencja"
    ],
    "audience": "rodzic",
    "subcategory": "asertywnosc",
    "profileName": "Śmiałek",
    "cecha": "Odwaga"
  },
  {
    "id": "MD-D01-S3",
    "profile": "MD",
    "day": 1,
    "slot": "wieczor",
    "category": "mentor",
    "subcategory": "spokoj",
    "audience": "rodzic",
    "title": "Wieczorem trzy wolne wydechy",
    "body": "Wieczorem usiądźcie razem na chwilę i zróbcie trzy wolne wydechy. Nie trzeba o nic pytać — wystarczy, że dziecko zwolni razem z wami.",
    "icon": "rodzic",
    "tone": "rose",
    "time": "2 min",
    "tags": [
      "oddech",
      "wieczor"
    ],
    "profileName": "Spokojna Głowa",
    "cecha": "Skupienie"
  },
  {
    "id": "MD-D02-S3",
    "profile": "MD",
    "day": 2,
    "slot": "wieczor",
    "category": "mentor",
    "subcategory": "rytmy_dnia",
    "audience": "rodzic",
    "title": "Sen — dziewięć do dwunastu godzin",
    "body": "Skupienie potrzebuje wypoczętej głowy. Spokojny wieczór, ciemny pokój, stała pora snu — dzięki temu rano łatwiej zebrać uwagę.",
    "icon": "rodzic",
    "tone": "amber",
    "time": "2 min",
    "tags": [
      "sen",
      "rytm"
    ],
    "profileName": "Spokojna Głowa",
    "cecha": "Skupienie"
  },
  {
    "id": "MD-D03-S3",
    "profile": "MD",
    "day": 3,
    "slot": "wieczor",
    "category": "mentor",
    "subcategory": "skupienie",
    "audience": "rodzic",
    "title": "Stałe miejsce do skupienia",
    "body": "Pomóżcie dziecku urządzić jedno stałe miejsce do spokojnej pracy: blat, lampka, nic zbędnego. Kiedy tam siada, w pokoju na chwilę robi się ciszej.",
    "icon": "rodzic",
    "tone": "rose",
    "time": "2 min",
    "tags": [
      "miejsce",
      "skupienie"
    ],
    "profileName": "Spokojna Głowa",
    "cecha": "Skupienie"
  },
  {
    "id": "MD-D04-S3",
    "profile": "MD",
    "day": 4,
    "slot": "wieczor",
    "category": "mentor",
    "subcategory": "slowa",
    "audience": "rodzic",
    "title": "Słowa, które zwalniają tempo",
    "body": "„Mamy czas”, „po kolei”, „najpierw jedno”. Mówcie je spokojnie przy codziennych czynnościach — dziecko szybciej przejmuje wasze tempo niż polecenia.",
    "icon": "rodzic",
    "tone": "amber",
    "time": "2 min",
    "tags": [
      "slowa",
      "modelowanie"
    ],
    "profileName": "Spokojna Głowa",
    "cecha": "Skupienie"
  },
  {
    "id": "MD-D05-S3",
    "profile": "MD",
    "day": 5,
    "slot": "wieczor",
    "category": "mentor",
    "subcategory": "rytmy_dnia",
    "audience": "rodzic",
    "title": "Woda, ruch, regularne posiłki",
    "body": "Skupienie zaczyna się od ciała. Pilnujcie podstaw: woda przy ręce, godzina ruchu, jedzenie o stałych porach. Najpierw ciało, potem uwaga.",
    "icon": "rodzic",
    "tone": "amber",
    "time": "2 min",
    "tags": [
      "cialo",
      "rytm",
      "woda"
    ],
    "profileName": "Spokojna Głowa",
    "cecha": "Skupienie"
  },
  {
    "id": "MD-D06-S3",
    "profile": "MD",
    "day": 6,
    "slot": "wieczor",
    "category": "mentor",
    "subcategory": "cudza_emocja_a_moja",
    "audience": "rodzic",
    "title": "Krótka rozmowa o trudnych chwilach dnia",
    "body": "Wieczorem zapytajcie: „Czyje smutki nosiłeś dziś w plecaku?”. Nazwijcie je, „odłóżcie” symbolicznie na półkę. Dziecku robi się lżej.",
    "icon": "rodzic",
    "tone": "rose",
    "time": "2 min",
    "tags": [
      "emocje",
      "rytual"
    ],
    "profileName": "Spokojna Głowa",
    "cecha": "Skupienie"
  },
  {
    "id": "MD-D07-S3",
    "profile": "MD",
    "day": 7,
    "slot": "wieczor",
    "category": "mentor",
    "subcategory": "skupienie",
    "audience": "rodzic",
    "title": "Zauważcie skończoną rzecz",
    "body": "Gdy dziecko skończy coś w swoim tempie, powiedzcie, co widzicie: „{Ułożyłeś|Ułożyłaś} wszystkie klocki po kolei”. Opis działa lepiej niż ocena.",
    "icon": "rodzic",
    "tone": "amber",
    "time": "1 min",
    "tags": [
      "zauwazanie",
      "skupienie"
    ],
    "profileName": "Spokojna Głowa",
    "cecha": "Skupienie"
  },
  {
    "id": "MD-D08-S3",
    "profile": "MD",
    "day": 8,
    "slot": "wieczor",
    "category": "mentor",
    "subcategory": "rytmy_dnia",
    "audience": "rodzic",
    "title": "Wieczór bez ekranu przed snem",
    "body": "Spróbujcie zakończyć korzystanie z ekranów trochę przed snem i przejść do spokojniejszych rzeczy: książki, rozmowy, kąpieli albo rysowania.",
    "icon": "rodzic",
    "tone": "amber",
    "time": "2 min",
    "tags": [
      "ekran",
      "wieczor"
    ],
    "profileName": "Spokojna Głowa",
    "cecha": "Skupienie"
  },
  {
    "id": "MD-D09-S3",
    "profile": "MD",
    "day": 9,
    "slot": "wieczor",
    "category": "mentor",
    "subcategory": "slowa",
    "audience": "rodzic",
    "title": "Walidacja zamiast naprawiania",
    "body": "Gdy dziecko opowiada o trudnej chwili, najpierw: „rozumiem, że było Ci ciężko”. Dopiero potem ewentualne pytania. Nazwane uczucie pomaga głowie się uspokoić.",
    "icon": "rodzic",
    "tone": "rose",
    "time": "1 min",
    "tags": [
      "walidacja",
      "sluchanie"
    ],
    "profileName": "Spokojna Głowa",
    "cecha": "Skupienie"
  },
  {
    "id": "MD-D10-S3",
    "profile": "MD",
    "day": 10,
    "slot": "wieczor",
    "category": "mentor",
    "subcategory": "cudza_emocja_a_moja",
    "audience": "rodzic",
    "title": "„Czyje to było uczucie?”",
    "body": "Jeśli dziecko wraca z dnia smutne bez powodu, zapytajcie łagodnie: „Czy to Twój smutek, czy może czyjś?”. Pomaga to rozpoznać własne granice.",
    "icon": "rodzic",
    "tone": "rose",
    "time": "2 min",
    "tags": [
      "emocje",
      "granica"
    ],
    "profileName": "Spokojna Głowa",
    "cecha": "Skupienie"
  },
  {
    "id": "MD-D11-S3",
    "profile": "MD",
    "day": 11,
    "slot": "wieczor",
    "category": "mentor",
    "subcategory": "rytmy_dnia",
    "audience": "rodzic",
    "title": "Stała pora snu — spokojny wieczór",
    "body": "Stała kolejność wieczornych czynności — na przykład mycie zębów, książka i przygaszenie światła — może ułatwić dziecku przejście do odpoczynku.",
    "icon": "rodzic",
    "tone": "amber",
    "time": "2 min",
    "tags": [
      "sen",
      "rytual"
    ],
    "profileName": "Spokojna Głowa",
    "cecha": "Skupienie"
  },
  {
    "id": "MD-D12-S3",
    "profile": "MD",
    "day": 12,
    "slot": "wieczor",
    "category": "mentor",
    "subcategory": "skupienie",
    "audience": "rodzic",
    "title": "Kiedy dziecko mówi „nie wiem, co robić”",
    "body": "Nie zawsze trzeba podpowiadać rozwiązanie. Czasem wystarczy: „Zróbmy najpierw jeden mały krok”. Dziecku łatwiej się skupić, gdy widzi tylko najbliższy ruch.",
    "icon": "rodzic",
    "tone": "rose",
    "time": "2 min",
    "tags": [
      "krok",
      "skupienie"
    ],
    "profileName": "Spokojna Głowa",
    "cecha": "Skupienie"
  },
  {
    "id": "MD-D13-S3",
    "profile": "MD",
    "day": 13,
    "slot": "wieczor",
    "category": "mentor",
    "subcategory": "slowa",
    "audience": "rodzic",
    "title": "Pytanie, które kończy dobrze dzień",
    "body": "Zamiast „jak było w szkole?” spróbujcie: „Co dzisiaj było dla Ciebie najtrudniejsze, a co najjaśniejsze?”. Dwie krótkie odpowiedzi wystarczą.",
    "icon": "rodzic",
    "tone": "amber",
    "time": "1 min",
    "tags": [
      "pytanie",
      "wieczor"
    ],
    "profileName": "Spokojna Głowa",
    "cecha": "Skupienie"
  },
  {
    "id": "MD-D14-S3",
    "profile": "MD",
    "day": 14,
    "slot": "wieczor",
    "category": "mentor",
    "subcategory": "cudza_emocja_a_moja",
    "audience": "rodzic",
    "title": "Nazwijcie emocje, które weszły dziś do domu",
    "body": "Zapytajcie wieczorem: „jakie uczucia były dziś twoje?”. Pomóż dziecku nazwać radość, smutek, złość czy napięcie bez zgadywania, skąd dokładnie pochodzą.",
    "icon": "rodzic",
    "tone": "rose",
    "time": "2 min",
    "tags": [
      "emocje",
      "rytual"
    ],
    "profileName": "Spokojna Głowa",
    "cecha": "Skupienie"
  },
  {
    "id": "MD-D15-S3",
    "profile": "MD",
    "day": 15,
    "slot": "wieczor",
    "category": "mentor",
    "subcategory": "rytmy_dnia",
    "audience": "rodzic",
    "title": "Półmetek — krótka rozmowa o tym, co działa",
    "body": "Minęło 15 dni. Zapytajcie dziecko: „Co z naszych wieczornych rytuałów lubisz najbardziej?”. Wzmocnijcie to, co już pomaga się wyciszyć.",
    "icon": "rodzic",
    "tone": "amber",
    "time": "2 min",
    "tags": [
      "polmetek",
      "rytm"
    ],
    "profileName": "Spokojna Głowa",
    "cecha": "Skupienie"
  },
  {
    "id": "MD-D16-S3",
    "profile": "MD",
    "day": 16,
    "slot": "wieczor",
    "category": "mentor",
    "subcategory": "spokoj",
    "audience": "rodzic",
    "title": "Zauważcie, kiedy dziecko bierze za dużo",
    "body": "Zmęczenie, drażliwość, trudności ze snem czy ból brzucha mogą mieć wiele przyczyn. Jeśli często się powtarzają albo niepokoją, warto porozmawiać z pediatrą; doraźnie można też zmniejszyć liczbę bodźców i zadań.",
    "icon": "rodzic",
    "tone": "rose",
    "time": "2 min",
    "tags": [
      "sygnaly",
      "przeciazenie"
    ],
    "profileName": "Spokojna Głowa",
    "cecha": "Skupienie"
  },
  {
    "id": "MD-D17-S3",
    "profile": "MD",
    "day": 17,
    "slot": "wieczor",
    "category": "mentor",
    "subcategory": "slowa",
    "audience": "rodzic",
    "title": "Unikajmy „musisz” i „powinieneś”",
    "body": "Zamiast „musisz przeprosić” — „jak myślisz, co teraz pomogłoby?”. Spokojna Głowa uczy się przez modelowanie, nie nakaz. Wasze słowa to jej słownik.",
    "icon": "rodzic",
    "tone": "amber",
    "time": "2 min",
    "tags": [
      "jezyk",
      "modelowanie"
    ],
    "profileName": "Spokojna Głowa",
    "cecha": "Skupienie"
  },
  {
    "id": "MD-D18-S3",
    "profile": "MD",
    "day": 18,
    "slot": "wieczor",
    "category": "mentor",
    "subcategory": "rytmy_dnia",
    "audience": "rodzic",
    "title": "Ruch w ciągu dnia — 60 minut",
    "body": "Dzieci i młodzież powinny mieć średnio co najmniej 60 minut umiarkowanej lub intensywnej aktywności dziennie w skali tygodnia. Ruch może być podzielony na krótsze odcinki w ciągu dnia.",
    "icon": "rodzic",
    "tone": "amber",
    "time": "2 min",
    "tags": [
      "ruch",
      "cialo"
    ],
    "profileName": "Spokojna Głowa",
    "cecha": "Skupienie"
  },
  {
    "id": "MD-D19-S3",
    "profile": "MD",
    "day": 19,
    "slot": "wieczor",
    "category": "mentor",
    "subcategory": "cudza_emocja_a_moja",
    "audience": "rodzic",
    "title": "Rytuał „strząsania” dnia",
    "body": "Wieczorem stańcie razem i przez chwilę potrząśnijcie rękami i nogami. Potraktujcie to jako zabawny znak: dzień się kończy, teraz czas zwolnić.",
    "icon": "rodzic",
    "tone": "rose",
    "time": "1 min",
    "tags": [
      "rytual",
      "cialo"
    ],
    "profileName": "Spokojna Głowa",
    "cecha": "Skupienie"
  },
  {
    "id": "MD-D20-S3",
    "profile": "MD",
    "day": 20,
    "slot": "wieczor",
    "category": "mentor",
    "subcategory": "skupienie",
    "audience": "rodzic",
    "title": "Chwila, której nikt nie przerywa",
    "body": "Gdy dziecko jest skupione na jednej rzeczy — rysuje, buduje albo czyta — postarajcie się nie przerywać mu pytaniami czy poleceniami, jeśli nie jest to konieczne. Dajcie mu chwilę, by samo domknęło to, co robi.",
    "icon": "rodzic",
    "tone": "rose",
    "time": "2 min",
    "tags": [
      "uwaga",
      "skupienie"
    ],
    "profileName": "Spokojna Głowa",
    "cecha": "Skupienie"
  },
  {
    "id": "MD-D21-S3",
    "profile": "MD",
    "day": 21,
    "slot": "wieczor",
    "category": "mentor",
    "subcategory": "slowa",
    "audience": "rodzic",
    "title": "Powtarzanie uczuć — proste narzędzie",
    "body": "Gdy dziecko mówi „byłam zła”, odpowiedzcie: „byłaś zła…” i poczekajcie. Powtórzenie nazywa, walidauje, otwiera dalsze opowiadanie. Bez doradzania.",
    "icon": "rodzic",
    "tone": "amber",
    "time": "1 min",
    "tags": [
      "walidacja",
      "powtorzenie"
    ],
    "profileName": "Spokojna Głowa",
    "cecha": "Skupienie"
  },
  {
    "id": "MD-D22-S3",
    "profile": "MD",
    "day": 22,
    "slot": "wieczor",
    "category": "mentor",
    "subcategory": "rytmy_dnia",
    "audience": "rodzic",
    "title": "Posiłki o stałych porach",
    "body": "Regularne pory posiłków mogą pomóc uporządkować rytm dnia. Ważniejsze od sztywnego planu jest jednak to, by dziecko jadło odpowiednio do wieku, potrzeb i sygnałów głodu.",
    "icon": "rodzic",
    "tone": "amber",
    "time": "2 min",
    "tags": [
      "jedzenie",
      "rytm"
    ],
    "profileName": "Spokojna Głowa",
    "cecha": "Skupienie"
  },
  {
    "id": "MD-D23-S3",
    "profile": "MD",
    "day": 23,
    "slot": "wieczor",
    "category": "mentor",
    "subcategory": "skupienie",
    "audience": "rodzic",
    "title": "Pytajcie o jeden szczegół",
    "body": "Gdy dziecko coś pokazuje — rysunek, budowlę, znaleziony kamyk — zapytajcie o jeden szczegół: „Od czego {zacząłeś|zaczęłaś}?”. Jedno pytanie zatrzymuje uwagę dłużej niż pięć.",
    "icon": "rodzic",
    "tone": "amber",
    "time": "2 min",
    "tags": [
      "pytanie",
      "uwaga"
    ],
    "profileName": "Spokojna Głowa",
    "cecha": "Skupienie"
  },
  {
    "id": "MD-D24-S3",
    "profile": "MD",
    "day": 24,
    "slot": "wieczor",
    "category": "mentor",
    "subcategory": "cudza_emocja_a_moja",
    "audience": "rodzic",
    "title": "Krótka „skala” wieczorna",
    "body": "Spytajcie: „Ile masz dziś w sobie swojego nastroju od 1 do 10, a ile czyjegoś?”. Zabawne, ale uczy rozróżniania źródła uczuć.",
    "icon": "rodzic",
    "tone": "rose",
    "time": "2 min",
    "tags": [
      "skala",
      "emocje"
    ],
    "profileName": "Spokojna Głowa",
    "cecha": "Skupienie"
  },
  {
    "id": "MD-D25-S3",
    "profile": "MD",
    "day": 25,
    "slot": "wieczor",
    "category": "mentor",
    "subcategory": "skupienie",
    "audience": "rodzic",
    "title": "Cisza przed zadaniem",
    "body": "Zanim dziecko zacznie zadanie wymagające uwagi, wyłączcie na chwilę telewizor i radio. Spokojniejsze otoczenie może ułatwić skupienie.",
    "icon": "rodzic",
    "tone": "rose",
    "time": "2 min",
    "tags": [
      "cisza",
      "skupienie"
    ],
    "profileName": "Spokojna Głowa",
    "cecha": "Skupienie"
  },
  {
    "id": "MD-D26-S3",
    "profile": "MD",
    "day": 26,
    "slot": "wieczor",
    "category": "mentor",
    "subcategory": "rytmy_dnia",
    "audience": "rodzic",
    "title": "Gdy dziecko nagle cichnie",
    "body": "Gdy dziecko nagle robi się ciche, drażliwe albo wyraźnie zmęczone, potraktuj to jako sygnał, żeby sprawdzić, czego potrzebuje. Nie zgaduj od razu przyczyny — zaproponuj spokój, wodę, odpoczynek albo rozmowę.",
    "icon": "rodzic",
    "tone": "amber",
    "time": "2 min",
    "tags": [
      "sygnaly",
      "regulacja"
    ],
    "profileName": "Spokojna Głowa",
    "cecha": "Skupienie"
  },
  {
    "id": "MD-D27-S3",
    "profile": "MD",
    "day": 27,
    "slot": "wieczor",
    "category": "mentor",
    "subcategory": "slowa",
    "audience": "rodzic",
    "title": "Mówcie głośno, gdy coś skończyliście",
    "body": "Kiedy skończycie coś w domu — obiad, porządki, list — powiedzcie spokojnie: „Zrobione, po kolei”. Dziecko widzi, że każda rzecz ma swój koniec.",
    "icon": "rodzic",
    "tone": "amber",
    "time": "1 min",
    "tags": [
      "modelowanie",
      "koniec"
    ],
    "profileName": "Spokojna Głowa",
    "cecha": "Skupienie"
  },
  {
    "id": "MD-D28-S3",
    "profile": "MD",
    "day": 28,
    "slot": "wieczor",
    "category": "mentor",
    "subcategory": "cudza_emocja_a_moja",
    "audience": "rodzic",
    "title": "„Co dzisiaj było tylko Twoje?”",
    "body": "To pytanie dobrze zamyka dzień. Pomaga dziecku znaleźć w sobie własne ślady — radość, smutek, dumę — wśród cudzych emocji.",
    "icon": "rodzic",
    "tone": "rose",
    "time": "2 min",
    "tags": [
      "pytanie",
      "ja"
    ],
    "profileName": "Spokojna Głowa",
    "cecha": "Skupienie"
  },
  {
    "id": "MD-D29-S3",
    "profile": "MD",
    "day": 29,
    "slot": "wieczor",
    "category": "mentor",
    "subcategory": "rytmy_dnia",
    "audience": "rodzic",
    "title": "Choroba — zawsze pediatra, nie suplementy",
    "body": "Jeśli dziecko często choruje albo ma nawracające lub długotrwałe bóle brzucha czy głowy, skonsultuj to z pediatrą. Nie wprowadzaj suplementów ani restrykcyjnych diet bez konsultacji ze specjalistą.",
    "icon": "rodzic",
    "tone": "amber",
    "time": "2 min",
    "tags": [
      "zdrowie",
      "lekarz"
    ],
    "profileName": "Spokojna Głowa",
    "cecha": "Skupienie"
  },
  {
    "id": "MD-D30-S3",
    "profile": "MD",
    "day": 30,
    "slot": "wieczor",
    "category": "mentor",
    "subcategory": "skupienie",
    "audience": "rodzic",
    "title": "Dziecko, które umie się skupić",
    "body": "Wasze dziecko potrafi zatrzymać się przy jednej rzeczy. Chrońcie ten czas: mniej pośpiechu, mniej przerywania, więcej zwykłej zabawy. Dziecko ma być dzieckiem.",
    "icon": "rodzic",
    "tone": "rose",
    "time": "2 min",
    "tags": [
      "ochrona",
      "podsumowanie"
    ],
    "profileName": "Spokojna Głowa",
    "cecha": "Skupienie"
  }
];

export default DAILY_TIPS_RODZIC;
