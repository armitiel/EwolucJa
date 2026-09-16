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
import { CEL_DOMYSLNY, NAGRODA_MONET } from "./zadanieGwiazdek.js";
import { CEL_DRZEWKA, CEL_GLAZY, stanDrewna } from "./zadanieDrewna.js";
import { stanZadania as stanZadaniaWizkora, zadanieDoZlecenia } from "./zadanieWizkora.js";
import { celPuzzli, stanPuzzli } from "./puzzleGier.js";

/**
 * Czarodziej na mapie: identyfikator jego znaku w module sceny (`xf`
 * w `scena3d.js`).
 *
 * STOI NA STAŁE, W JEDNYM MIEJSCU. Miał kiedyś rytm znikania i powrotów
 * (`cykl`/`respawn` + losowanie z listy `pozycje` w `mapa.json`) — dziecko
 * uczyło się wtedy czekania zamiast drogi do niego i wracając na polanę nie
 * wiedziało, czy go zastanie. Dziś jest punktem orientacyjnym mapy, jak sosna
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
 * `drewnoZewn` służy WYŁĄCZNIE pulpitowi testowemu: pozwala pokazać kwestię
 * o schronieniu na podstawionym stanie, bez dotykania zapisu dziecka.
 * W grze zostaje `null` i stan czytamy z `zadanieDrewna`.
 */
export function powitanieCzarodzieja(z, misja, drewnoZewn = null) {
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
            "Na polanie wbiłem paliki — tu stanie schronienie. " +
            "Suche drzewko da słupy, głaz da kamienie pod spód. " +
            "Przynieś jedno i drugie na paliki.",
          tekstEkranu: "Przynieś na paliki suche drzewko i głaz.",
          wyroznienie: "suche drzewko i głaz",
          przycisk: "Biorę się za to",
          akcja: "zlecDrewno",
        };
      }
      if (!drewno.spelnione) {
        /* MÓWIMY O DWÓCH RÓŻNYCH ROBOTACH. „Nie masz jeszcze głazu" i „głaz
           leży rozbity, ale wciąż w lesie" to nie to samo — a dziecko, które
           usłyszy pierwsze zdanie, poszłoby szukać drugiego głazu.
           Wyliczamy CZEGO brakuje, zamiast pokazywać „1 z 2": w głowie ma
           dwie konkretne rzeczy, nie ułamek. */
        const doZdobycia = [];
        if (drewno.drzewka < CEL_DRZEWKA) doZdobycia.push("suche drzewko");
        if (drewno.glazy < CEL_GLAZY) doZdobycia.push("głaz");
        /* Każdy materiał niesie SWOJĄ GRAMATYKĘ. „Drewno czeka", ale „kamienie
           czekają" — a kwestie składamy z fragmentów, więc bez tego Wizkor
           mówił „kamienie leży". W grze dla sześciolatka, która uczy się
           czytać, to nie jest drobiazg. */
        const MAT = {
          drewno: { nazwa: "drewno", czeka: "czeka", je: "je", gdzie: "tam, gdzie je ściąłeś" },
          kamien: { nazwa: "kamienie", czeka: "czekają", je: "je", gdzie: "tam, gdzie rozbiłeś głaz" },
        };
        const doPrzyniesienia = [];
        if (drewno.drzewka >= CEL_DRZEWKA && !drewno.drewnoNaPlacu) doPrzyniesienia.push(MAT.drewno);
        if (drewno.glazy >= CEL_GLAZY && !drewno.kamienNaPlacu) doPrzyniesienia.push(MAT.kamien);

        /* Dwie wersje tej samej kwestii: `ekran` to jedno polecenie do
           przeczytania w biegu, `tekst` to pełniejsze zdanie dla lektora.
           Głos dopowiada je spokojnie także po zamknięciu okna, więc na
           karcie nie musi stać wszystko (patrz `hub/mowaPostaci.js`). */
        let tekst;
        let ekran;
        if (doPrzyniesienia.length === 1) {
          const m = doPrzyniesienia[0];
          tekst = doZdobycia.length
            ? `Dobrze idzie. ${wielka(m.nazwa)} ${m.czeka} ${m.gdzie} — zanieś ${m.je} na paliki. `
              + `Zostało jeszcze: ${doZdobycia.join(" i ")}.`
            : `Jest wszystko, tylko ${m.nazwa} wciąż ${m.czeka} ${m.gdzie}. `
              + `Zanieś ${m.je} na paliki, a zaczniemy stawiać.`;
          ekran = doZdobycia.length
            ? `Zanieś ${m.nazwa} na paliki. Zostało: ${doZdobycia.join(" i ")}.`
            : `Zanieś ${m.nazwa} na paliki.`;
        } else if (doPrzyniesienia.length > 1) {
          tekst = "Jest wszystko, tylko drewno i kamienie wciąż czekają tam, gdzie powstały. "
            + "Zanieś je na paliki, a zaczniemy stawiać.";
          ekran = "Zanieś drewno i kamienie na paliki.";
        } else {
          tekst = `Idzie dobrze. Zostało jeszcze: ${doZdobycia.join(" i ")}.`;
          ekran = `Zostało: ${doZdobycia.join(" i ")}.`;
        }
        return {
          ...baza,
          tekst,
          tekstEkranu: ekran,
          wyroznienie: doPrzyniesienia.length ? "na paliki" : doZdobycia[0],
          przycisk: "Idę dalej",
          akcja: null,
        };
      }
      return {
        ...baza,
        ...POCHWALA,
        tekst:
          "Wszystko leży na placu — sam to przyniosłeś. " +
          "Postawmy pierwsze słupy, reszta przyjdzie z czasem.",
        tekstEkranu: "Stawiamy pierwsze słupy!",
        wyroznienie: "pierwsze słupy",
        przycisk: "Stawiamy!",
        akcja: "postawEtap",
      };
    }

    // ── ŁAŃCUCH MISJI Z GRAMI ─────────────────────────────────────────
    if (!misja) {
      // ── ZADANIE POZA EKRANEM ────────────────────────────────────────
      // Wchodzi dopiero, gdy gry są rozliczone. Kolejność jest tu tak samo
      // twarda jak wyżej: dziecko ma jeden cel naraz, a to jest jedyny cel,
      // którego nie da się osiągnąć klikaniem — więc nie może się kłócić
      // o uwagę z niczym na mapie.
      const real = stanZadaniaWizkora();

      if (real.doOdbioru) {
        const nagroda = real.nagroda || real.def.nagroda || 25;
        return {
          ...baza,
          ...POCHWALA,
          tekst:
            `Mentor przeczytał to, co mu wysłałeś, i przyjął. ` +
            `Przyznał ci ${nagroda} monet — bierz.`,
          tekstEkranu: `Mentor przyznał ci ${nagroda} monet.`,
          wyroznienie: `${nagroda} monet`,
          przycisk: "Odbieram nagrodę!",
          akcja: "otworzZadanie",
        };
      }

      if (real.czeka) {
        // Ten sam ton co niżej: bez „nie musisz" — zamiast tego, co WOLNO
        // robić w międzyczasie. Czekanie ma być spokojne, nie pilnowane.
        return {
          ...baza,
          tekst:
            "Twoje zadanie jest u Mentora.\n" +
            "Baw się dalej — zajrzyj do Zadań za jakiś czas.",
          wyroznienie: "u Mentora",
          przycisk: "Dobrze!",
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
        return {
          ...baza,
          tekst: `Pamiętasz o zadaniu?\n„${real.def.tytul}"\nczeka w zakładce Zadania.`,
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
            "Mapę już znasz, wędrowcze. Czas na zadanie poza ekranem. " +
            "Zakręć kołem przeznaczenia — wskaże, którą siłę dziś ćwiczysz.",
          tekstEkranu: "Zakręć kołem przeznaczenia.",
          wyroznienie: "kołem przeznaczenia",
          przycisk: "Kręcę kołem!",
          akcja: "kolo",
        };
      }

      return {
        ...baza,
        tekst:
          "Dobrze się spisałeś, mały wędrowcze. " +
          "Odpocznij chwilę — przygotowuję dla ciebie nowe zadanie.",
        tekstEkranu: "Odpocznij. Nowe zadanie już się szykuje.",
        wyroznienie: "Nowe zadanie",
        przycisk: "Do zobaczenia!",
        akcja: null,
      };
    }

    const { def } = misja;
    // Kwota siedzi w definicji misji, a w tekście stoi `{nagroda}` — inaczej
    // zmiana nagrody z 40 na 50 wymagałaby poprawki w dwóch miejscach i przy
    // pierwszym przeoczeniu Wizkor obiecywałby co innego, niż wypłaca.
    const zNagroda = (tresc) => ({
      tekst: String(tresc.tekst).split("{nagroda}").join(String(def.nagroda)),
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
        `Masz je wszystkie! ${z.cel} gwiazdek, co do jednej. ` +
        `Należy ci się ${NAGRODA_MONET} monet — bierz.`,
      tekstEkranu: `Masz wszystkie gwiazdki! Odbierz ${NAGRODA_MONET} monet.`,
      wizualizacja: { typ: "gwiazdki", wartosc: z.cel, cel: z.cel },
      wyroznienie: `${NAGRODA_MONET} monet`,
      przycisk: "Odbieram nagrodę!",
      akcja: "nagroda",
    };
  }

  // Kwestia „w trakcie" jest dziś nieosiągalna ze świata: w czasie zbierania
  // czarodziej w ogóle nie zagaduje (patrz obsługa dotknięcia — zamiast okna
  // wchodzi krótki komunikat). Zostaje, bo stan istnieje i wróci w chwili,
  // gdy rozmowa w trakcie zadania znów będzie miała co wnosić; na razie
  // dosięga jej `window.popupPostaci.pokaz()` i pulpit testowy.
  if (z.istnieje) {
    const zostalo = z.cel - z.zebrane;
    return {
      ...baza,
      tekst:
        `Widzę, że szukasz. Masz ${z.zebrane} z ${z.cel} gwiazdek — ` +
        `zostało ${zostalo}. Świecą w trawie, trzeba tylko wbiec.`,
      tekstEkranu: "Szukaj świecących gwiazdek na polanie.",
      wizualizacja: { typ: "gwiazdki", wartosc: z.zebrane, cel: z.cel },
      wyroznienie: `${z.zebrane} z ${z.cel} gwiazdek`,
      przycisk: "Zbieram dalej!",
      akcja: null,
    };
  }

  return {
    ...baza,
    tekst:
      `Witaj, mały wędrowcze! Jestem Wizkor, opiekun Świata Gama. ` +
      `W krainie ukryło się ${CEL_DOMYSLNY} złotych gwiazdek. Znajdziesz wszystkie?`,
    tekstEkranu: "Zbierz złote gwiazdki ukryte na polanie.",
    wizualizacja: { typ: "gwiazdki", wartosc: 0, cel: CEL_DOMYSLNY },
    wyroznienie: `${CEL_DOMYSLNY} złotych gwiazdek`,
    przycisk: "Ruszam po gwiazdki!",
    akcja: "start",
  };
}
