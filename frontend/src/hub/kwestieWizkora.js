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
import { stanZadania as stanZadaniaWizkora, zadanieDoZlecenia } from "./zadanieWizkora.js";

/**
 * Czarodziej na mapie: identyfikator jego znaku w module sceny (`xf`
 * w `scena3d.js`).
 *
 * Rytm pojawiania się siedzi PO STRONIE SCENY, nie tutaj: znak ma `cykl: 30`
 * (tyle stoi) i `respawn: 60` (tyle go nie ma), a przy każdym powrocie staje
 * w losowym miejscu z listy `pozycje`. Zegar chodzi w pętli renderowania, więc
 * zatrzymuje się razem z nią — pod otwartym panelem czarodziej nie zniknie.
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
 *   "zlec:<id gry>"   → ujawnij misję: znak tej gry wchodzi na mapę
 *   "naplac:<id gry>" → otwórz ekran wygranej za rozegraną partię
 *   "zlecReal:<id>"   → zleć zadanie do zrobienia poza ekranem (ląduje w zwoju)
 *   "otworzZadanie"   → otwórz zakładkę z tym zadaniem
 *   null              → sam przycisk zamykający, nic się nie dzieje
 *
 * ZADANIA IDĄ PO KOLEI, nie równolegle. Wizkor zaczyna mówić o grach dopiero
 * wtedy, gdy gwiazdki są rozliczone (`z.wyplacone`) — dziecko ma na ekranie
 * jeden licznik i jeden cel, a nie listę zadań do ogarnięcia. Cały łańcuch
 * (`misja` = pierwsza nierozliczona) opisuje `hub/misjeGier.js`; tutaj zostaje
 * samo dobranie kwestii do etapu, a same teksty stoją przy definicjach misji.
 */
export function powitanieCzarodzieja(z, misja) {
  const baza = { imie: "Wizkor", obrazek: "/wizPop.webp" };

  if (z.wyplacone) {
    // ── ŁAŃCUCH MISJI Z GRAMI ─────────────────────────────────────────
    if (!misja) {
      // ── ZADANIE POZA EKRANEM ────────────────────────────────────────
      // Wchodzi dopiero, gdy gry są rozliczone. Kolejność jest tu tak samo
      // twarda jak wyżej: dziecko ma jeden cel naraz, a to jest jedyny cel,
      // którego nie da się osiągnąć klikaniem — więc nie może się kłócić
      // o uwagę z niczym na mapie.
      const real = stanZadaniaWizkora();

      if (real.doOdbioru) {
        return {
          ...baza,
          tekst:
            `Mentor przeczytał to, co mu wysłałeś. Przyjął. ` +
            `Należy ci się ${real.def.nagroda} monet — bierz.`,
          wyroznienie: `${real.def.nagroda} monet`,
          przycisk: "Odbieram nagrodę!",
          akcja: "otworzZadanie",
        };
      }

      if (real.czeka) {
        return {
          ...baza,
          tekst:
            "Twoje zadanie jest u Mentora. Nie musisz nad nim stać — " +
            "zajrzyj do wiadomości później.",
          wyroznienie: "u Mentora",
          przycisk: "Dobrze!",
          akcja: null,
        };
      }

      if (real.doZrobienia) {
        return {
          ...baza,
          tekst:
            `Pamiętasz o zadaniu? „${real.def.tytul}" czeka w twoich wiadomościach. ` +
            "Tego nie zrobisz tutaj — to trzeba zrobić naprawdę.",
          wyroznienie: real.def.tytul,
          przycisk: "Otwieram zadanie",
          akcja: "otworzZadanie",
        };
      }

      const nowe = zadanieDoZlecenia();
      if (nowe) {
        return {
          ...baza,
          tekst:
            `Mapę już znasz, wędrowcze. Teraz coś trudniejszego: ${nowe.cel} ` +
            `Zapiszę ci to w wiadomościach, a Mentor sprawdzi. ${nowe.nagroda} monet.`,
          wyroznienie: `${nowe.nagroda} monet`,
          przycisk: "Zrobię to!",
          akcja: `zlecReal:${nowe.id}`,
        };
      }

      return {
        ...baza,
        tekst:
          "Dobrze się spisałeś, mały wędrowcze. Odpocznij chwilę — " +
          "przygotowuję dla ciebie nowe zadanie.",
        wyroznienie: "nowe zadanie",
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
    if (misja.znaleziona) return { ...baza, ...def.granie, akcja: null };
    if (misja.ujawniona) return { ...baza, ...def.szukanie, akcja: null };
    return { ...baza, ...def.zlecenie, akcja: `zlec:${def.id}` };
  }

  if (z.spelnione) {
    return {
      ...baza,
      tekst:
        `Masz je wszystkie! ${z.cel} gwiazdek, co do jednej. ` +
        `Należy ci się ${NAGRODA_MONET} monet — bierz.`,
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
      wyroznienie: `${z.zebrane} z ${z.cel} gwiazdek`,
      przycisk: "Zbieram dalej!",
      akcja: null,
    };
  }

  return {
    ...baza,
    tekst:
      `Witaj, mały wędrowcze! Jestem Wizkor, strażnik Lasu Szeptów. ` +
      `Zbierz dla mnie ${CEL_DOMYSLNY} złotych gwiazdek, a otworzę przed tobą pierwszą bramę.`,
    wyroznienie: `${CEL_DOMYSLNY} złotych gwiazdek`,
    przycisk: "Ruszam po gwiazdki!",
    akcja: "start",
  };
}
