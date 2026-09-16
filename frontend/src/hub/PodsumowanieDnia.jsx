/**
 * PodsumowanieDnia — sekwencja końca dnia. Ostatnie, co dziecko widzi, zanim
 * odłoży urządzenie, i jedyne miejsce, w którym świat prosi je o coś naprawdę.
 *
 * SKĄD TA WERSJA. Pierwsza była jednym oknem z listą i zdaniem „Planeta
 * czekała dziś spokojnie. Też tak można." przy pustym dniu. Właściciel:
 * „ten tekst nic nie znaczy" — i miał rację. To zdanie NAZYWA PUSTKĘ i nie
 * robi nic więcej: nie opisuje świata, nie prosi, nie otwiera jutra. Panel
 * (`projektant-zadan`, `psycholog`, `narrator-gama`, `rodzic-1-3`) przerobił
 * ekran na sekwencję. Treść i uzasadnienia stoją w `data/koniec-dnia.v1.json`
 * i to jest plik do edycji, nie ten komponent.
 *
 * MECHANIZM, NA KTÓRYM TO STOI: **BRAK WPISANY W ŚWIAT PRZED WYJŚCIEM
 * DZIECKA**. Nie ma zdania „twoje zadanie na dziś"; jest dziura o konkretnym
 * kształcie, którą widać, i czarodziej, który mówi, że jej nie wyczaruje.
 * Kierunek się odwraca: dziecko nie idzie coś zrobić DLA SIEBIE, tylko
 * przynieść coś ŚWIATU — a wtedy powrót jest sensem wyjścia i pętla domyka
 * się już w chwili odejścia.
 *
 * CZTERY RZECZY, KTÓRE ŁATWO ZEPSUĆ PRZY EDYCJI:
 *
 * 1. ŻADNE ZDANIE NIE OPISUJE DZIECKA. Bez „ty", bez „zrobiłeś", bez „nie
 *    zrobiłeś". Opisujemy rzeczy. Jeśli w zdaniu da się podstawić „byłeś" —
 *    zdanie jest do wyrzucenia. To jest korzeń błędu, od którego się zaczęło.
 * 2. ZERO LICZB. Żadnych „trzy z pięciu", pasków, serii. Jedna liczba na tym
 *    ekranie zamienia dzień w wynik i kasuje cały zwrot akcji.
 * 3. PRZYCISK KOŃCZY DZIEŃ, NIE ZOBOWIĄZUJE. „Idę poszukać" wypadło:
 *    dla dziecka, które potem nie pójdzie, to złamana obietnica złożona
 *    samemu sobie — gorsza niż niezrobione zadanie.
 * 4. SZUKANIE JEST NA JUTRO. Sekwencja gra o dwudziestej, dziesięć minut
 *    przed kąpielą. „Poszukamy" bez „kiedy" znaczy dla siedmiolatka „teraz",
 *    czyli rozbebeszona szafa i telefon z powrotem w rękach. Lisek mówi
 *    wprost: jutro, jak będzie jasno.
 *
 * NA RAZIE TO MOCKUP TREŚCI. Zadanie jest brane z `zadania-mockup-braki`,
 * a nie ze stanu gracza — właściciel prosił o treść do obejrzenia, spinanie
 * z Kołem Przeznaczenia i panelem Mentora idzie osobno.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { powiedzPostacia } from "./mowaPostaci.js";
import SEKWENCJA from "./data/koniec-dnia.v1.json";
import MOCK_ZADANIA from "./data/zadania-mockup-braki.v1.json";

/**
 * MIEJSCE NA GRAFIKĘ KOŃCA DNIA. Docelowo: planeta nocą, lisek pod gwiazdami.
 * Dziś stoi tu Wizkor, którego już mamy — okno działa i wygląda skończenie,
 * zanim powstanie właściwa ilustracja. Po jej wygenerowaniu wystarczy podmienić
 * tę jedną ścieżkę; komponent nic o niej nie wie.
 */
const OBRAZ_WIZKORA = "/wizPop.webp";
const OBRAZ_LISKA = "/lisPop.webp";

/** Głosy postaci — te same barwy, co w reszcie świata (`mowaPostaci.js`). */
const GLOSY = {
  narratorka: { glos: "gora_podsumowania", ton: "calm" },
  wizkor: { glos: "las_decyzji", ton: "mystery" },
  lisek: { glos: "lisek", ton: "zabawa" },
};

const PORTRETY = { wizkor: OBRAZ_WIZKORA, lisek: OBRAZ_LISKA, narratorka: null };

function Gwiazdka({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 1.6l3.1 6.4 7 1-5 4.9 1.2 7-6.3-3.3-6.3 3.3 1.2-7-5-4.9 7-1z" />
    </svg>
  );
}

/**
 * Buduje kroki pod DZISIEJSZY dzień. Jedyne, co się zmienia, to „stan rzeczy":
 * w pustym dniu świat mówi o sobie zamiast wymieniać nieistniejące zdobycze.
 *
 * `wpisy` to rzeczy, które naprawdę stanęły dziś na planecie (zbierane
 * w `Swiat.jsx`). Nie są listą osiągnięć — wchodzą do zdania o obiektach.
 */
function zlozKroki(wpisy) {
  const pusty = !wpisy.length;
  const D = SEKWENCJA.dzienPusty;
  return SEKWENCJA.kroki.map((k) => {
    if (k.id !== "stan-rzeczy") return k;
    /* BRAK JEST PRZEDOSTATNI, ostatnia linijka jest ciepła i po prostu jest.
       Psycholog: dzień domykany brakiem po tygodniu przestaje być sygnałem
       i uczy, że dzień zawsze kończy się niedoborem. */
    const linie = pusty
      ? [D.linie[Math.floor(Math.random() * D.linie.length)], SEKWENCJA.kroki[1].linie[1], D.domkniecie]
      : [wpisy[wpisy.length - 1].tekst, ...SEKWENCJA.kroki[1].linie.slice(1)];
    return { ...k, linie, glos: linie.join(" ") };
  });
}

export default function PodsumowanieDnia({
  otwarty = false,
  wpisy = [],
  /** Zadanie ze stanu gracza; gdy go nie ma, bierzemy mockup do obejrzenia. */
  zadanie = null,
  onZamknij,
}) {
  const [krok, setKrok] = useState(0);
  const [odlozone, setOdlozone] = useState(false);
  const przyciskRef = useRef(null);

  const kroki = useMemo(() => zlozKroki(wpisy), [wpisy, otwarty]);
  const brak = useMemo(
    () => zadanie || MOCK_ZADANIA.zadania[0],
    [zadanie],
  );

  useEffect(() => { if (otwarty) { setKrok(0); setOdlozone(false); } }, [otwarty]);

  const dalej = useCallback(() => {
    setKrok((k) => (k + 1 < kroki.length ? k + 1 : k));
  }, [kroki.length]);

  const K = kroki[krok] || kroki[0];
  const ostatni = krok === kroki.length - 1;

  /* Każdy krok mówiony jest na głos i — jak wszędzie w grze — lektor kończy
     zdanie, nawet gdy dziecko przewinie dalej albo zamknie okno
     (`hub/mowaPostaci.js`). Tu akurat o to chodzi: sekwencja ma dać się
     przeklikać w trzy sekundy komuś, kto już wie, o co chodzi. */
  useEffect(() => {
    if (!otwarty || !K) return;
    const g = GLOSY[K.kto] || GLOSY.narratorka;
    powiedzPostacia(K.glos || K.tekst, g);
  }, [otwarty, K]);

  useEffect(() => {
    if (!otwarty) return undefined;
    const naKlawisz = (e) => {
      if (e.key === "Escape") onZamknij?.();
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); ostatni ? onZamknij?.() : dalej(); }
    };
    window.addEventListener("keydown", naKlawisz);
    return () => window.removeEventListener("keydown", naKlawisz);
  }, [otwarty, ostatni, dalej, onZamknij]);

  useEffect(() => {
    if (!otwarty) return undefined;
    const t = window.setTimeout(() => {
      try { przyciskRef.current?.focus({ preventScroll: true }); } catch {}
    }, 380);
    return () => window.clearTimeout(t);
  }, [otwarty, krok]);

  if (!otwarty || !K) return null;

  const portret = PORTRETY[K.kto];
  const pokazBrak = K.id === "nie-do-wyczarowania" || K.id === "pusty-ksztalt";

  return (
    <div className="podsumowanie-dnia" data-testid="podsumowanie-dnia" data-krok={K.id}>
      {/* Zasłona NIE zamyka okna dotknięciem obok — to jedyne okno w grze,
          które tak robi. Koniec dnia ma zostać przeczytany, a nie odklikany
          przypadkiem kciukiem przy krawędzi. Dotknięcie przewija KROK DALEJ:
          nic tu nie trzeba wysiedzieć. */}
      <div
        className="podsumowanie-dnia-zaslona"
        onClick={() => (ostatni ? null : dalej())}
        aria-hidden="true"
      />

      <div
        className="podsumowanie-dnia-karta"
        role="dialog"
        aria-modal="true"
        aria-labelledby="podsumowanie-dnia-tytul"
      >
        {portret ? (
          <img
            key={portret}
            className={`podsumowanie-dnia-obraz podsumowanie-dnia-obraz--${K.kto}`}
            src={portret}
            alt=""
            aria-hidden="true"
            draggable="false"
          />
        ) : null}

        <p className="podsumowanie-dnia-wstega" id="podsumowanie-dnia-tytul">
          <Gwiazdka className="podsumowanie-dnia-gwiazdka" />
          <span>{K.kto === "wizkor" ? "Wizkor" : K.kto === "lisek" ? "Lisek" : "Dzień się skończył"}</span>
          <Gwiazdka className="podsumowanie-dnia-gwiazdka" />
        </p>

        {K.linie ? (
          <ul className="podsumowanie-dnia-lista">
            {K.linie.map((l, i) => (
              <li key={l + i} className={`podsumowanie-dnia-wpis${i === 1 ? " jest-brak" : ""}`}>{l}</li>
            ))}
          </ul>
        ) : (
          <p className="podsumowanie-dnia-tekst">{K.tekst}</p>
        )}

        {/* BRAK JAKO PRZEDMIOT, nie jako polecenie. Pokazuje się dopiero
            wtedy, gdy Wizkor powie, czego nie potrafi — wcześniej byłby
            zadaniem doklejonym do podsumowania. */}
        {pokazBrak ? (
          <section className="podsumowanie-dnia-brak">
            <span className="podsumowanie-dnia-obrys" aria-hidden="true" />
            <h3>{brak.brak || "Czegoś tu brakuje."}</h3>
            <p>{(brak.cel || "").split("\n")[0]}</p>
          </section>
        ) : null}

        {odlozone ? (
          <p className="podsumowanie-dnia-odzew">{SEKWENCJA.odlozenie.odzew}</p>
        ) : null}

        <button
          type="button"
          ref={przyciskRef}
          className="hub-btn hub-btn-primary podsumowanie-dnia-akcja"
          onClick={() => (ostatni ? onZamknij?.() : dalej())}
          data-testid="podsumowanie-dnia-akcja"
        >
          {K.przycisk || "Dalej"}
        </button>

        {/* TRZECIA DROGA. Bez niej dziecko może tylko przynieść albo milczeć,
            a milczenie zostawia rzecz otwartą bez żadnej kontroli po jego
            stronie — to gorsze niż niepowodzenie. To jest przycisk „decyduję",
            nie „poddaję się". */}
        {K.id === "pusty-ksztalt" && !odlozone ? (
          <button
            type="button"
            className="hub-btn hub-btn-ghost podsumowanie-dnia-odloz"
            onClick={() => { setOdlozone(true); dalej(); }}
            data-testid="podsumowanie-dnia-odloz"
          >
            {SEKWENCJA.odlozenie.przycisk}
          </button>
        ) : null}
      </div>
    </div>
  );
}
