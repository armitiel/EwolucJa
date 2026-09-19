/*!
 * SPDX-FileCopyrightText: © 2026 Amitiel Angelisme <armitiel@gmail.com>
 * SPDX-License-Identifier: LicenseRef-EwolucJA-Proprietary
 *
 * EwolucJA — gra edukacyjna dla dzieci.
 * Produkt powstał w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”;
 * autorskie prawa majątkowe pozostają przy autorze. Licencja: LICENSE.
 */
/**
 * kwestieWizkora — CO czarodziej mówi w danym momencie łańcucha zadań.
 *
 * Wyjęte z `Swiat.jsx` nie dla porządku, tylko dlatego, że tę samą odpowiedź
 * musi znać jeszcze jedno miejsce: pulpit testowy. Dopóki funkcja siedziała
 * w komponencie strony, jedynym sposobem sprawdzenia, którą kwestię wybierze
 * Wizkor, było doprowadzenie świata do danego stanu i podejście do niego.
 * Stąd wzięła się cała klasa błędów „Wizkor gubi kolejność" — nie dało się
 * ZOBACZYĆ etapu, na który patrzy, inaczej niż grając.
 *
 * Teksty misji stoją przy ich definicjach (`misjeGier.js`), a tutaj zostaje
 * samo DOBRANIE kwestii do etapu. To jest jedyne miejsce, które o tym decyduje
 * — hub i pulpit pytają je o to samo.
 */
import { CEL_DOMYSLNY } from "./zadanieGwiazdek.js";
import { etapSzkolny } from "./profilStartowy.js";
import { stanDrewna } from "./zadanieDrewna.js";
import { stanZadania as stanZadaniaWizkora, zadanieDoZlecenia } from "./zadanieWizkora.js";
import { celPuzzli, stanPuzzli } from "./puzzleGier.js";
import { czyRysowalDzis } from "./ramkaDomku.js";
import {
  czekaOdWczoraj,
  kwestiaHybrydy,
  mozliwaHybryda,
  przypomnianoDzis,
  stanHybrydy,
  zWariantemHybrydy,
} from "./hybryda.js";

/**
 * Czarodziej na mapie: identyfikator jego znaku w module sceny (`xf`
 * w `scena3d.js`).
 *
 * STOI NA STAŁE, W JEDNYM MIEJSCU. Miał kiedyś rytm znikania i powrotów
 * (`cykl`/`respawn` + losowanie z listy `pozycje` w `mapa.json`) — dziecko
 * uczyło się wtedy czekania zamiast drogi do niego i wracając na polanę nie
 * wiedziało, czy go zastanie. Dziś jest punktem orientacyjnym mapy, jak choinka
 * Lotu Liska: `absorb: false` + `raz: true`, więc odzywa się raz na podejście
 * i uzbraja dopiero, gdy lis odbiegnie dalej niż `zbrojenie`.
 */
export const ZNAK_CZARODZIEJA = "czarodziej";

/*
 * Stało tu jeszcze `PYTANIE_CZARODZIEJA` — „Czarodziej zatrzymał się na
 * polanie i patrzy w twoją stronę. Zagadać do niego?". Zdjęte razem z całym
 * krokiem pytania: dziecko, które wbiegło w czarodzieja, już odpowiedziało
 * nogami, a okno pytania wyglądało prawie tak samo jak okno odpowiedzi.
 * Komponent `hub/PytanieSpotkania.jsx` został — wzorzec „zapytaj, zanim
 * wyrwiesz z biegu" dalej obsługuje zaproszenia do gier.
 */

/**
 * Co czarodziej mówi, zależy od STANU ZADANIA — i to nie jest ozdoba, tylko
 * poprawka błędu. Wcześniej miał jedną kwestię i zlecał zbieranie gwiazdek
 * nawet wtedy, gdy dziecko miało już komplet albo dawno odebrało nagrodę.
 *
 * Liczby w zdaniach biorą się ze stanu, nie z palca: to te same wartości,
 * które liczy kafelek w HUD-zie. Rozjazd między „zbierz 10" a licznikiem
 * do 12 byłby dla dziecka po prostu kłamstwem.
 *
 * `akcja` mówi hubowi, co zrobić po zielonym przycisku:
 *   "start"           → załóż zadanie gwiazdek i zapal licznik
 *   "nagroda"         → otwórz ekran wygranej za gwiazdki
 *   "zlec:<id gry>"   → ujawnij misję: kawałki puzzli wchodzą na mapę
 *   "ukladanka:<id>"  → otwórz układankę puzzli tej gry
 *   "naplac:<id gry>" → otwórz ekran wygranej za rozegraną partię
 *   "zlecReal:<id>"   → zleć zadanie do zrobienia poza ekranem (ląduje w zwoju)
 *   (koło przeznaczenia nie ma własnej akcji — mieszka w panelu zadania,
 *    więc zaproszenie do losowania to zwykłe "otworzZadanie")
 *   "otworzZadanie"   → otwórz zakładkę z tym zadaniem
 *   null              → sam przycisk zamykający, nic się nie dzieje
 *
 * ZADANIA IDĄ PO KOLEI, nie równolegle. Wizkor zaczyna mówić o grach dopiero
 * wtedy, gdy gwiazdki są rozliczone (`z.wyplacone`) — dziecko ma na ekranie
 * jeden licznik i jeden cel, a nie listę zadań do ogarnięcia. Cały łańcuch
 * (`misja` = pierwsza nierozliczona) opisuje `hub/misjeGier.js`; tutaj zostaje
 * samo dobranie kwestii do etapu, a same teksty stoją przy definicjach misji.
 */
/**
 * WIZKOR W CHWILI POCHWAŁY. Jedyne miejsce w grze, w którym czarodziej się
 * rusza: mruga i rozjaśnia się w uśmiechu, raz, po czym zostaje na ostatniej
 * klatce. Świadomie TYLKO tutaj — gdyby machał przy każdym powitaniu, gest
 * przestałby cokolwiek znaczyć, a sesja zyskałaby powód, żeby trwać dłużej.
 *
 * `obrazek` to ostatnia klatka animacji (ten sam uśmiech), więc dziecko
 * z wyłączonymi animacjami dostaje ten sam obraz, tylko bez dojścia do niego.
 */
/** Pierwsza litera wielka — kwestie składamy z fragmentów, a Wizkor nie krzyczy. */
function wielka(t) { return t ? t[0].toUpperCase() + t.slice(1) : t; }

const POCHWALA = {
  obrazek: "/wizkor-super-koniec.webp",
  obrazekAnim: "/wizkor-super.webp",
};

/**
 * WIZKOR NA ZACHODZIE SŁOŃCA. Wchodzi raz, w chwili gdy niebo zaczyna się
 * złocić — czyli wtedy, gdy sesji zostaje jeszcze kilka minut pełnego,
 * ciepłego światła.
 *
 * NIE MÓWI, ILE ZOSTAŁO. Żadnych minut, żadnego „kończymy za chwilę".
 * Odliczanie robi z końca sesji karę i uczy dziecko patrzeć na zegar zamiast
 * na świat — a tu zegarem JEST świat: słońce nisko widać samemu, bez liczb
 * (`docs/OPIS_PROJEKTU.md`, akapit o ograniczonym czasie sesji).
 *
 * MÓWI, PO CO ZOSTAŁO. Zachód nie jest tu sygnałem „odłóż to", tylko
 * zaproszeniem do ostatniej rzeczy — i do tej prawdziwej, która czeka poza
 * ekranem. Dlatego kwestia zależy od tego, czy dziecko ma zadanie w realu.
 */
/**
 * WARIANTY 1–3 / 4–8. Kwestia może nieść `warianty: { "1-3": {...}, "4-8": {...} }`
 * — pola z wariantu nadpisują bazowe (`02` §2, `01` R1). Etap czytamy z zapisu
 * onboardingu (`profilStartowy.etapSzkolny`); bez zapisu wchodzi tekst bazowy.
 */
export function zWariantem(karta, etap = etapSzkolny()) {
  if (!karta || !karta.warianty) return karta;
  const { warianty, ...reszta } = karta;
  const w = warianty[etap];
  return w ? { ...reszta, ...w } : reszta;
}

/**
 * CZTERY WARIANTY ZACHODU wg stanu zadania w realu (`02` §3.1):
 * zadanie czeka u dziecka / ślad dziś zostawiony / Mentor zauważył / brak zadania.
 * Karta NAZYWA zadanie poza ekranem i mówi „u ciebie, nie tu" — nigdy
 * „na zewnątrz" (dla siedmiolatka to „na dwór"). Zero terminów, zero liczb.
 * `{miejsce_reakcji}` z karty zadania (v2); bez niego „na polanie".
 */
export function kwestiaZachodu(realZewn = null, hybZewn = null) {
  const baza = { imie: "Wizkor", obrazek: "/wizPop.webp" };
  const real = realZewn || stanZadaniaWizkora();
  const miejsce = real.def?.miejsce_reakcji || "na polanie";

  /* RYSUNEK DNIA — ostatnia rzecz przed nocą, raz dziennie, tylko gdy stoi
     domek (ramka wisi w domku; bez domku nie ma gdzie powiesić). Ma
     pierwszeństwo przed czterema wariantami niżej, bo one mówią o tym, co
     czeka POZA ekranem — a rysunek jest tym jednym, co dziecko robi jeszcze
     tu, zanim odłoży urządzenie. Jeśli zadanie w realu czeka, karta wspomina
     o nim jednym zdaniem — nie znika, tylko ustępuje miejsca. Trzy zdania,
     bez cyfr, jak każda kwestia Wizkora w głos (`01` standard). */
  const hyb = hybZewn || stanHybrydy();

  /* HYBRYDA MD (`swiatlo-w-oknie`): zachód JEST jej mostem — kwestia z karty
     zamiast wariantu „zadanie czeka" (05 karta 2). Karta nieaktywna do czasu
     `ustawLampke`, ale gałąź już czeka. */
  const mostZachodu = (def, akcja) => {
    const d = zWariantemHybrydy(def);
    const q = kwestiaHybrydy(def, "wizkor", "most");
    return {
      ...baza,
      tekst: q?.tekst || d.most.glos,
      tekstEkranu: q?.tekstEkranu || d.most.karta,
      wyroznienie: d.most.wyroznienie || "",
      przycisk: def.czescA?.przycisk || "Otwieram",
      akcja,
    };
  };
  if (hyb.istnieje && hyb.def?.czescA?.zachod && (hyb.trop || hyb.czescA)) return mostZachodu(hyb.def, "otworzZadanie");
  /* Hybrydy jeszcze nie ma, a profil ma kartę zachodu (MD): zachód ją OTWIERA
     — Wizkor mówi most, przycisk prowadzi do wyboru miejsca lampki. */
  if (!hyb.istnieje && !hybZewn) {
    const karta = mozliwaHybryda();
    if (karta?.czescA?.zachod) return mostZachodu(karta, `hybryda:otworz:${karta.id}`);
  }

  if (!czyRysowalDzis() && stanDrewna().zbudowane) {
    const t = real.doZrobienia ? real.def?.tytul : (hyb.otwarta ? hyb.def?.tytul : null);
    return zWariantem({
      ...baza,
      tekst:
        "Słońce schodzi. Zanim zaśnie, narysuj jedną rzecz z dziś — jedną linią, powieszę ją w domku."
        + (t ? ` A „${t}" czeka u ciebie, nie tu.` : ""),
      tekstEkranu: "Słońce schodzi. Narysuj jedną rzecz z dziś.",
      wyroznienie: "jedną rzecz z dziś",
      przycisk: "Rysuję",
      akcja: "rysunek",
      warianty: {
        "1-3": { tekst: "Słońce schodzi. Narysuj jedną rzecz z dziś, jedną linią. Powieszę ją w domku." },
      },
    });
  }

  /* HYBRYDA OTWARTA (trop / zakład / „Czeka — u ciebie"): ten sam wariant,
     co dla zadania z Koła — tytuł w karcie, „u ciebie, nie tu" (02 §3.1,
     wariant 1). Zadanie z Koła i hybryda nie zachodzą na siebie (05 §1.2). */
  if (hyb.otwarta && hyb.def) {
    const t = hyb.def.tytul;
    return zWariantem({
      ...baza,
      tekst:
        `Słońce schodzi. Tu już nic mi nie trzeba. `
        + `„${t}" czeka tam, gdzie magia nie sięga — u ciebie w domu.`,
      tekstEkranu: `Słońce schodzi. „${t}" czeka u ciebie, nie tu.`,
      wyroznienie: t,
      przycisk: "Idę",
      akcja: null,
      warianty: {
        "1-3": { tekst: `Słońce schodzi. „${t}" czeka u ciebie, nie tu. Tam, gdzie magia nie sięga.` },
      },
    });
  }

  if (real.doZrobienia) {
    const t = real.def.tytul;
    return zWariantem({
      ...baza,
      tekst:
        `Słońce schodzi. Tu już nic mi nie trzeba. `
        + `„${t}" czeka tam, gdzie magia nie sięga — u ciebie w domu.`,
      tekstEkranu: `Słońce schodzi. „${t}" czeka u ciebie, nie tu.`,
      wyroznienie: t,
      przycisk: "Idę",
      akcja: null,
      warianty: {
        "1-3": { tekst: `Słońce schodzi. „${t}" czeka u ciebie, nie tu. Tam, gdzie magia nie sięga.` },
      },
    });
  }

  if (real.czeka) {
    return {
      ...baza,
      tekst:
        `Słońce schodzi. To, co {zrobiłeś|zrobiłaś}, zostawiło ślad ${miejsce}. `
        + `Jutro będzie go lepiej widać.`,
      tekstEkranu: "Słońce schodzi. Na polanie coś przybyło.",
      wyroznienie: "coś przybyło",
      przycisk: "Dobrze",
      akcja: null,
    };
  }

  if (real.doOdbioru) {
    return {
      ...baza,
      tekst:
        "Mentor {zobaczył|zobaczyła}, co {zrobiłeś|zrobiłaś}. "
        + "Przy drzewie wyrósł kwiat, którego rano nie było. Spójrz.",
      tekstEkranu: "Mentor to {zobaczył|zobaczyła}. Przy drzewie wyrósł nowy kwiat.",
      wyroznienie: "nowy kwiat",
      przycisk: "Patrzę",
      akcja: null,
    };
  }

  return zWariantem({
    ...baza,
    tekst:
      "Słońce schodzi nad polaną. Sprawdź, czy u ciebie za oknem też — "
      + "i co robi światło.",
    tekstEkranu: "Słońce schodzi. U ciebie za oknem też?",
    wyroznienie: "za oknem",
    przycisk: "Sprawdzam",
    akcja: null,
    warianty: {
      "1-3": { tekst: "Słońce schodzi. Zobacz, czy za oknem też." },
    },
  });
}

/**
 * `drewnoZewn` służy WYŁĄCZNIE pulpitowi testowemu: pozwala pokazać kwestię
 * o schronieniu na podstawionym stanie, bez dotykania zapisu dziecka.
 * W grze zostaje `null` i stan czytamy z `zadanieDrewna`.
 */
/* LICZEBNIKI ODMIENIONE Z RĘKI. Polskie „jeden stos / dwa stosy / trzy stosy"
   nie wychodzi z żadnego prostego wzoru, a kwestie składamy z fragmentów —
   bez tych tablic Wizkor mówił „dwa stos" albo „trzy drzewo". W grze, w której
   dziecko dopiero uczy się czytać, to nie jest drobiazg. Indeks 0 nigdy nie
   powinien trafić na ekran (zero braków = inna gałąź), ale stoi na wypadek. */
const STOSY = ["wszystko", "jeden stos", "dwa stosy", "trzy stosy"];
const CZEKA = ["czeka", "czeka", "czekają", "czekają"];
const JE = ["je", "go", "je", "je"];
const DRZEWA = ["wszystko", "jedno drzewo", "dwa drzewa", "trzy drzewa"];

/**
 * KAŻDA KARTA MA `tekstEkranu`. Kwestie bez własnej krótkiej wersji dostają
 * pierwsze zdanie pełnego `tekst` — karta nigdy nie wyświetla całej kwestii
 * (ściana liter dla sześciolatka, `06` §4.2), a głos i tak mówi całość.
 * Pierwsze zdanie = do pierwszej kropki/wykrzyknika/pytajnika albo do
 * pierwszego łamania wiersza; cudzysłów domykający zostaje przy zdaniu.
 */
export function pierwszeZdanie(tekst) {
  const t = String(tekst || "").trim();
  if (!t) return "";
  const m = t.match(/^[^.!?\n]*[.!?]+["”"]?/);
  return (m ? m[0] : t.split("\n")[0]).trim();
}

function zTekstemEkranu(karta) {
  if (!karta || karta.tekstEkranu) return karta;
  return { ...karta, tekstEkranu: pierwszeZdanie(karta.tekst) || karta.tekst };
}

export function powitanieCzarodzieja(z, misja, drewnoZewn = null, hybZewn = null) {
  return zDrugimWejsciemDoHybrydy(zTekstemEkranu(zWariantem(powitanieCzarodziejaSurowe(z, misja, drewnoZewn, hybZewn))), hybZewn);
}

/**
 * DRUGIE WEJŚCIE DO ŚLADU. Zakładka Zadania nie stoi dziś w doku, więc do
 * karty hybrydy prowadzi tylko rozmowa z Wizkorem. Gdy hybryda czeka
 * u dziecka od wczoraj, Wizkor mówi już o grach (05 §5) — ale okno dostaje
 * drugi przycisk z tytułem hybrydy, żeby ślad dało się zostawić bez
 * szukania. Nie dotyka kwestii, które same otwierają zadanie.
 */
function zDrugimWejsciemDoHybrydy(karta, hybZewn = null) {
  if (!karta || karta.akcja === "otworzZadanie" || String(karta.akcja || "").startsWith("hybryda:")) return karta;
  const h = hybZewn || stanHybrydy();
  if (!h.istnieje || !h.czeka || !h.def) return karta;
  return { ...karta, przyciskDrugi: `„${h.def.tytul}” — zostaw ślad`, akcjaDrugi: "otworzZadanie" };
}

/**
 * KWESTIE HYBRYDY (dane z `hybrydy.v1.json`, `kwestie[]` z wariantem etapu).
 * Zwraca `null`, gdy Wizkor ma mówić o czymś innym (gry, Koło).
 *
 *   brak hybrydy, ale wolno ją otworzyć → most z karty, przycisk części A,
 *                                           akcja `hybryda:otworz:<id>`
 *   trop / zakład postawiony              → most, „otworzZadanie"
 *   czeka (ten sam dzień)                 → przypomnienie, „otworzZadanie"
 *   czeka (następny dzień)                → przypomnienie RAZ, potem gry
 *                                           (05 §5: gra to warstwa ekranowa,
 *                                           nie drugie zadanie)
 *   zauważone, nieobejrzane               → „Mentor to zobaczył…", `hybryda:zobacz`
 *   ślad / obejrzane                      → null (zwykła kwestia stanu)
 *
 * `hybZewn` — tylko pulpit testowy (podstawiony stan, bez zapisu dziecka).
 */
function kwestiaHybrydyWizkora(baza, hybZewn = null) {
  const h = hybZewn || stanHybrydy();
  const etap = etapSzkolny();
  const most = (def, przycisk, akcja) => {
    const d = zWariantemHybrydy(def, etap);
    const q = kwestiaHybrydy(def, "wizkor", "most", etap);
    return {
      ...baza,
      tekst: q?.tekst || d.most.glos,
      tekstEkranu: q?.tekstEkranu || d.most.karta,
      wyroznienie: d.most.wyroznienie || "",
      przycisk,
      akcja,
    };
  };
  if (!h.istnieje) {
    const karta = hybZewn ? null : mozliwaHybryda();
    if (!karta) return null;
    return most(karta, karta.czescA?.przycisk || "Spójrz", `hybryda:otworz:${karta.id}`);
  }
  const def = h.def;
  if (!def) return null;
  if (h.trop || h.czescA) return most(def, h.czescA ? "Otwieram" : (def.czescA?.przycisk || "Otwieram"), "otworzZadanie");
  if (h.czeka) {
    if (czekaOdWczoraj() && przypomnianoDzis()) return null;
    const q = kwestiaHybrydy(def, "wizkor", "przypomnienie", etap) || kwestiaHybrydy(def, "wizkor", "most", etap);
    if (!q) return null;
    return {
      ...baza,
      tekst: q.tekst,
      tekstEkranu: q.tekstEkranu,
      wyroznienie: "u ciebie",
      przycisk: "Otwieram zadanie",
      akcja: "otworzZadanie",
      hybrydaPrzypomnienie: true,
    };
  }
  if (h.zauwazone && !h.zauwazoneObejrzane) {
    const q = kwestiaHybrydy(def, "wizkor", "zauwazone", etap);
    if (!q) return null;
    return {
      ...baza,
      ...POCHWALA,
      tekst: q.tekst,
      tekstEkranu: q.tekstEkranu,
      wyroznienie: "Mentor",
      przycisk: "Idę zobaczyć",
      akcja: "hybryda:zobacz",
    };
  }
  return null;
}

function powitanieCzarodziejaSurowe(z, misja, drewnoZewn = null, hybZewn = null) {
  const baza = { imie: "Wizkor", obrazek: "/wizPop.webp" };

  if (z.wyplacone) {
    /* ── SCHRONIENIE: materiał na pierwszy etap ─────────────────────────
       Wchodzi ZARAZ po gwiazdkach i PRZED grami. Nie dlatego, że jest
       ważniejsze, tylko dlatego, że jako jedyne zostawia ślad na polanie —
       a zasada „jedno zadanie na dany moment" każe puścić przodem to,
       którego efekt widać w świecie.

       Nagrodą nie są monety, tylko postawiony szkielet. Gdyby ktoś chciał
       tu dopisać wypłatę: `docs/OPIS_PROJEKTU.md`, akapit o gospodarce. */
    const drewno = drewnoZewn || stanDrewna();
    if (!drewno.zbudowane) {
      if (!drewno.istnieje) {
        return {
          ...baza,
          tekst:
            /* NIE MÓWIMY „suche drzewko". Ścinać można KAŻDE drzewo na mapie
               (decyzja 16.09), a suchy pień zszedł z mapy 17.09 — nazwa,
               której nic już nie odpowiada, wysłałaby dziecko na poszukiwanie
               obiektu, którego tam nie ma. */
            "Na tym wielkim drzewie stanie domek. Na domek trzeba desek. " +
            "Zetnij trzy drzewa i znieś stosy pod to drzewo.",
          /* NA KARCIE MUSI STAĆ, PO CO TO WSZYSTKO. Wcześniej ekran mówił samo
             „Przynieś pod drzewo drewno i głaz" — dziecko widziało polecenie
             bez powodu i bez pierwszego ruchu: skąd niby ma wziąć drewno?
             Domek na drzewie jest obietnicą, a „zetnij trzy drzewa" pierwszym
             krokiem. Ile dokładnie i dokąd, dopowiada Wizkor głosem, a trzy
             znaczki w HUD-zie liczą za dziecko. */
          /* `\n` łamie kartę tam, gdzie kończy się myśl (patrz `.popup-postaci-tekst`,
             `white-space: pre-line`): obietnica w pierwszej linijce, pierwszy ruch w drugiej. */
          tekstEkranu: "Zbudujemy domek na drzewie.\nZetnij trzy drzewa i przynieś drewno.",
          wyroznienie: "domek na drzewie",
          przycisk: "Biorę się za to",
          akcja: "zlecDrewno",
        };
      }
      if (!drewno.spelnione) {
        /* DWA RÓŻNE BRAKI, NIGDY NARAZ. „Nie masz jeszcze drzewa" i „drewno
           leży ścięte, ale wciąż w lesie" to nie to samo — a dziecko, które
           usłyszy pierwsze zdanie, poszłoby ścinać czwarte drzewo zamiast
           donieść to, co już ma. Dlatego najpierw domykamy KURS (stos leży
           w lesie), a dopiero potem wołamy o kolejne ścięcie.

           Liczymy SŁOWAMI, nie cyframi: „dwa stosy" czyta sześciolatek od
           razu, „2/3" wymaga zatrzymania się nad ułamkiem. Cyfra zostaje
           w HUD-zie, gdzie i tak stoją trzy znaczki. */
        const doSciecia = drewno.doSciecia;
        const doZniesienia = drewno.doZniesienia;

        /* ZDANIA UŁOŻONE TAK, ŻEBY LICZBA NIE RZĄDZIŁA CZASOWNIKIEM.
           „Zostało dwa drzewa" i „zostanie trzy stosy" to błędy, które wychodzą
           same, gdy do szablonu wpada raz jeden, raz trzy. Zamiast dokładać
           trzecią tablicę odmian, mówimy „do ścięcia masz jeszcze…" i „zetnij
           jeszcze…" — te formy stoją tak samo przy każdej liczbie. */
        let tekst;
        let ekran;
        if (doZniesienia > 0) {
          tekst = `Dobrze idzie. ${wielka(STOSY[doZniesienia])} ${CZEKA[doZniesienia]} tam, w lesie — `
            + `znieś ${JE[doZniesienia]} pod drzewo.`;
          if (doSciecia > 0) tekst += ` Do ścięcia masz jeszcze ${DRZEWA[doSciecia]}.`;
          ekran = `Znieś ${STOSY[doZniesienia]} pod drzewo.`;
        } else {
          tekst = `Idzie dobrze. Zetnij jeszcze ${DRZEWA[doSciecia]} i znieś je pod to drzewo.`;
          ekran = `Zetnij jeszcze ${DRZEWA[doSciecia]}.`;
        }
        return {
          ...baza,
          tekst,
          tekstEkranu: ekran,
          wyroznienie: doZniesienia > 0 ? "pod drzewo" : DRZEWA[doSciecia],
          przycisk: "Idę dalej",
          akcja: null,
        };
      }
      return {
        ...baza,
        ...POCHWALA,
        tekst:
          "Wszystko leży pod drzewem — {sam|sama} to {przyniosłeś|przyniosłaś}. " +
          "Stawiamy domek na drzewie: ściany, dach i drabinkę.",
        tekstEkranu: "Budujemy domek na drzewie!",
        wyroznienie: "domek na drzewie",
        przycisk: "Budujemy!",
        akcja: "postawEtap",
      };
    }

    /* ── HYBRYDA: między domkiem a grami (05 §5, 06 §4.3 pkt 6) ──────────
       Pierwsze zadanie w realu nie przychodzi z Koła po trzech grach, tylko
       ze świata — po pierwszej rzeczy, którą dziecko zbudowało. Dopóki
       hybryda jest na tropie albo czeka u dziecka, Wizkor mówi o niej;
       po śladzie wraca zwykła kwestia stanu (gra). */
    const hyb = kwestiaHybrydyWizkora(baza, hybZewn);
    if (hyb) return hyb;

    // ── ŁAŃCUCH MISJI Z GRAMI ─────────────────────────────────────────
    if (!misja) {
      // ── ZADANIE POZA EKRANEM ────────────────────────────────────────
      // Wchodzi dopiero, gdy gry są rozliczone. Kolejność jest tu tak samo
      // twarda jak wyżej: dziecko ma jeden cel naraz, a to jest jedyny cel,
      // którego nie da się osiągnąć klikaniem — więc nie może się kłócić
      // o uwagę z niczym na mapie.
      const real = stanZadaniaWizkora();

      if (real.doOdbioru) {
        /* MENTOR ZAUWAŻA, ŚWIAT DOKŁADA (`02` §2.2 `:248`, decyzja 17.09):
           zero monet w ustach Wizkora, zero „przyjął". Dodatek po zauważeniu
           to kwiat w nowym kolorze przy drabince (hak sceny — drugi zespół). */
        return {
          ...baza,
          ...POCHWALA,
          tekst:
            "Mentor {zobaczył|zobaczyła} to, co {zrobiłeś|zrobiłaś}. " +
            "A przy drzewie wyrósł nowy kwiat — idź, zobacz.",
          tekstEkranu: "Mentor to {zobaczył|zobaczyła}.\nPrzy drzewie wyrósł nowy kwiat.",
          wyroznienie: "nowy kwiat",
          przycisk: "Idę zobaczyć",
          akcja: "otworzZadanie",
        };
      }

      if (real.czeka) {
        // Ten sam ton co niżej: bez „nie musisz" — zamiast tego, co WOLNO
        // robić w międzyczasie. Czekanie ma być spokojne, nie pilnowane.
        /* KARTA wg `02` §2.2 (`:263`): „Ślad zostawiony. Zobacz {miejsce_reakcji}.”
           Pole `miejsce_reakcji` wchodzi z v2 zadań (`06` §4.2); dopóki go nie
           ma, karta kończy się na pierwszym zdaniu — nie obiecuje miejsca,
           którego scena jeszcze nie zmienia. Głos zostaje do kroku 2. */
        const miejsceReakcji = real.def?.miejsce_reakcji || null;
        /* GŁOS NIE OBIECUJE MENTORA (weto psychologa, `02` §7): w demo i bez
           konta dorosłego „Mentor już to widzi" byłoby obietnicą bez pokrycia.
           Mówi świat: ślad jest, reakcja jest od ciebie. */
        return {
          ...baza,
          tekst:
            `To, co {zrobiłeś|zrobiłaś}, zostawiło ślad ${miejsceReakcji || "na polanie"}. ` +
            "Idź, zobacz — to od ciebie.",
          tekstEkranu: miejsceReakcji
            ? `Ślad zostawiony. Zobacz ${miejsceReakcji}.`
            : "Ślad zostawiony.",
          wyroznienie: "Ślad zostawiony",
          przycisk: "Dobrze",
          akcja: null,
        };
      }

      if (real.doZrobienia) {
        /**
         * TYLKO przypomnienie — trzy krótkie wiersze, każdy z osobną myślą:
         * pytanie / tytuł / gdzie leży. Tytuł stoi SAM w środkowym wierszu,
         * bo to on jest tu najważniejszy (`\n` + pre-line w oknie postaci).
         *
         * BEZ dopisków w stylu „zrób naprawdę" i bez zakazów „tego nie
         * zrobisz tutaj" (obie wersje tu były i obie wyleciały): pouczenie
         * brzmi jak nieufność, a zakaz jak przyłapanie na oszustwie, którego
         * nikt nie planował. Wizkor przypomina i wierzy — jak zadanie ma się
         * odbywać, mówi samo zadanie w zakładce Zadania.
         */
        /* KARTA wg `02` §2.2 (`:285`): tytuł w pierwszym wierszu, „u ciebie,
           nie tu” w drugim — bez „na zewnątrz” (weto rodzica 1–3). */
        return {
          ...baza,
          tekst: `„${real.def.tytul}" dalej czeka — u ciebie. Jak zrobisz swoje, polana to zauważy.`,
          tekstEkranu: `„${real.def.tytul}" czeka.\nU ciebie, nie tu.`,
          wyroznienie: real.def.tytul,
          przycisk: "Otwieram zadanie",
          akcja: "otworzZadanie",
        };
      }

      const nowe = zadanieDoZlecenia();
      if (nowe) {
        /**
         * ZADANIA W REALU LOSUJE KOŁO PRZEZNACZENIA (decyzja właściciela,
         * 2026-08-22). Wizkor nie przydziela zadania — wynosi koło: ono
         * wskazuje jedną z cech awatara, a cecha wybiera zadanie, które ją
         * ćwiczy (`zadanieDlaCechy`). Zlecenie zapada dopiero przy losowaniu,
         * więc `zadanieDoZlecenia` zostaje tu bramkarzem: mówi, czy w ogóle
         * jest co losować.
         *
         * KOŁO WYCHODZI Z ROZMOWY, nie z szuflady (decyzja właściciela,
         * 2026-08-23). Akcja `kolo` otwiera je wprost nad mapą; szuflada
         * zadania wjeżdża dopiero po „Biorę zadanie!". Zamknięcie krzyżykiem
         * nie zostawia więc żadnego skrótu — po koło wraca się do Wizkora,
         * tak jak po każde inne zlecenie.
         */
        return {
          ...baza,
          tekst:
            "Tu na polanie zrobiliśmy swoje. Teraz coś, czego magią nie zrobię. " +
            "Zakręć kołem — wskaże, którą siłą dziś działasz.",
          tekstEkranu: "Zakręć kołem. Wskaże dzisiejszą siłę.",
          wyroznienie: "kołem",
          przycisk: "Kręcę kołem!",
          akcja: "kolo",
          warianty: {
            "1-3": { tekst: "Zakręć kołem. Ono pokaże, co dziś robimy naprawdę." },
          },
        };
      }

      return {
        ...baza,
        tekst:
          "Na dziś nie mam już nic. Polana poczeka. " +
          "U ciebie dzieje się więcej niż tu.",
        tekstEkranu: "Na dziś koniec zleceń. Polana poczeka.",
        wyroznienie: "Polana poczeka",
        przycisk: "Idę",
        akcja: null,
        warianty: {
          "4-8": { tekst: "Dziś nic więcej ode mnie. Polana poczeka." },
        },
      };
    }

    const { def } = misja;
    // Kwota siedzi w definicji misji, a w tekście stoi `{nagroda}` — inaczej
    // zmiana nagrody z 40 na 50 wymagałaby poprawki w dwóch miejscach i przy
    // pierwszym przeoczeniu Wizkor obiecywałby co innego, niż wypłaca.
    const zNagroda = (tresc) => ({
      tekst: String(tresc.tekst).split("{nagroda}").join(String(def.nagroda)),
      tekstEkranu: tresc.tekstEkranu
        ? String(tresc.tekstEkranu).split("{nagroda}").join(String(def.nagroda))
        : null,
      wyroznienie: String(tresc.wyroznienie || "").split("{nagroda}").join(String(def.nagroda)),
      przycisk: tresc.przycisk,
    });

    if (misja.wygrana) return { ...baza, ...zNagroda(def.wyplata), akcja: `naplac:${def.id}` };
    // Kwestie „w trakcie" są ze świata trudno osiągalne (przy przyjętej misji
    // czarodziej rzuca krótki komunikat zamiast otwierać okno), ale muszą
    // istnieć: dosięga ich `window.popupPostaci.pokaz()` i pulpit testowy,
    // a stan jest realny.
    if (misja.odkryta) return { ...baza, ...def.granie, akcja: null };
    if (misja.ujawniona) {
      /**
       * ETAP PUZZLI — jedyny etap między zleceniem a grą. Zlecona misja
       * zaczyna się od kawałków obrazka i dopóki układanka nie jest ułożona,
       * Wizkor mówi o kawałkach: znaku i tak nie ma jeszcze na mapie (patrz
       * `naMapie` w `misjeGier`). Z kompletem kwestia dostaje zielony przycisk
       * „Układam!", który otwiera układankę prosto z rozmowy — a ułożenie
       * wchodzi wprost w grę, więc kwestii „szukaj znaku" już nie ma.
       */
      /* Pulpit dev podstawia `misja.puzzle`, żeby dało się obejrzeć kwestię
         każdego pod-etapu bez grzebania w prawdziwym zapisie puzzli —
         dokładnie tak, jak podstawia całe stany misji. Świat tego pola nie
         ustawia nigdy, więc gra zawsze czyta stan prawdziwy. */
      const puzzle = misja.puzzle || stanPuzzli(misja.def.id);
      if (puzzle.brama && !puzzle.ulozona) {
        if (puzzle.komplet) {
          return {
            ...baza,
            ...misja.def.ukladanie,
            tekstEkranu: "Masz komplet. Teraz ułóż obrazek!",
            wizualizacja: { typ: "puzzle", wartosc: puzzle.zebrane, cel: puzzle.cel },
            akcja: `ukladanka:${misja.def.id}`,
          };
        }
        return {
          ...baza,
          ...misja.def.zbieranie,
          tekstEkranu: "Zbieraj kawałki błyszczące na polanie.",
          wizualizacja: { typ: "puzzle", wartosc: puzzle.zebrane, cel: puzzle.cel },
          akcja: null,
        };
      }
      /* Układanka ułożona, a misja nieoznaczona jako odkryta: zapis sprzed
         tej zmiany albo gra bez bramy z puzzli. Gra jest wtedy dostępna, więc
         Wizkor mówi to samo, co po zdobyciu — „idź zagrać". */
      return { ...baza, ...def.granie, akcja: null };
    }
    return {
      ...baza,
      ...def.zlecenie,
      tekstEkranu: "Zbierz kawałki obrazka na polanie.",
      wizualizacja: { typ: "puzzle", wartosc: 0, cel: celPuzzli(def.id) },
      akcja: `zlec:${def.id}`,
    };
  }

  if (z.spelnione) {
    return {
      ...baza,
      ...POCHWALA,
      tekst:
        "Wszystkie, co do jednej. Popatrz na polanę — jest jaśniej niż rano.",
      tekstEkranu: "Wszystkie gwiazdki! Polana jaśniej świeci.",
      wizualizacja: { typ: "gwiazdki", wartosc: z.cel, cel: z.cel },
      wyroznienie: "jaśniej",
      przycisk: "Patrzę!",
      akcja: "nagroda",
    };
  }

  // Kwestia „w trakcie" jest dziś nieosiągalna ze świata: w czasie zbierania
  // czarodziej w ogóle nie zagaduje (patrz obsługa dotknięcia — zamiast okna
  // wchodzi krótki komunikat). Zostaje, bo stan istnieje i wróci w chwili,
  // gdy rozmowa w trakcie zadania znów będzie miała co wnosić; na razie
  // dosięga jej `window.popupPostaci.pokaz()` i pulpit testowy.
  if (z.istnieje) {
    return {
      ...baza,
      /* „Trzeba tylko wbiec" brzmiało jak polecenie od kogoś, kto stoi obok
         i patrzy. Wizkor zauważa wysiłek i daje pewność, że szukanie ma sens
         — to jest jego rola przy zadaniu już przyjętym (poprawka 19.09). */
      tekst:
        "Widzę, że nadal szukasz gwiazdek. Przebiegnij się po polanie — na pewno na którąś trafisz.",
      tekstEkranu: "Przebiegnij polanę. Na pewno trafisz.",
      wizualizacja: { typ: "gwiazdki", wartosc: z.zebrane, cel: z.cel },
      wyroznienie: "na pewno",
      przycisk: "Zbieram dalej!",
      akcja: null,
    };
  }

  return {
    ...baza,
    tekst:
      "Jestem Wizkor. W nocy z polany spadło dziesięć gwiazdek i leżą w trawie. " +
      "Pozbierasz je?",
    tekstEkranu: "Na polanie spadło dziesięć gwiazdek. Znajdziesz je?",
    wizualizacja: { typ: "gwiazdki", wartosc: 0, cel: CEL_DOMYSLNY },
    wyroznienie: "dziesięć gwiazdek",
    przycisk: "Ruszam po gwiazdki!",
    akcja: "start",
    warianty: {
      "1-3": { tekst: "Na polanie spadło dziesięć gwiazdek. Znajdziesz je? Leżą w trawie." },
    },
  };
}
