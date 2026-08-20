/**
 * PoradaPanel — trzy małe aktywności zamiast jednej karteczki z poleceniem.
 *
 * Przepływ jest celowo taki sam jak w Minigrach: najpierw wybór dużym
 * obrazkiem, potem krótka aktywność i dopiero na końcu reakcja świata. Samo
 * dotknięcie kafla niczego nie zalicza.
 */
import React, { useCallback, useEffect, useMemo, useState } from "react";
import EkranOddechu from "../EkranOddechu.jsx";
import PoradaAkcja from "../PoradaAkcja.jsx";
import {
  anulujWyborKarty,
  czytajRytual,
  czytajSlady,
  kartyDnia,
  poraDnia,
  ukonczKarteDnia,
  wybierzKarteDnia,
  zresetujPorade,
} from "../poradaDnia.js";
import { oznaczPoradyObejrzane } from "../nowosci.js";
import { powiedzJakLisek, uciszLiska, zachetaDoKarty, zachetaDoWyboru } from "../glosLiska.js";

export default function PoradaPanel({ onPowrot }) {
  const [stan, setStan] = useState(() => czytajRytual());
  const [slady, setSlady] = useState(() => czytajSlady());
  const [akcja, setAkcja] = useState(false);
  const [karty] = useState(kartyDnia);
  const [pora] = useState(poraDnia);
  const wybrana = karty.find((k) => k.id === stan.wybrana) || null;
  const ukonczona = karty.find((k) => k.id === stan.ukonczona) || null;

  /** Samo zajrzenie gasi plakietkę. Wybór ani wykonanie nie są wymuszane. */
  useEffect(() => { oznaczPoradyObejrzane(); }, []);

  /**
   * GŁOS LISKA. Karty dnia to „5 oddechów z liskiem" i „3 ruchy razem z
   * liskiem" — więc to on zaprasza, a nie narratorka. Odzywa się w dwóch
   * momentach i w żadnym innym: przy wyborze („zrobimy to razem") i zaraz
   * po dotknięciu karty („wchodzimy w to").
   *
   * Zdanie jest ZAPISANE NA EKRANIE, a mowa tylko je powtarza. Dziecko
   * z wyciszonym telefonem, z zepsutym TTS-em albo takie, które nie
   * dosłyszało, ma dostać dokładnie tę samą treść.
   */
  const zachetaWyboru = useMemo(() => zachetaDoWyboru(), []);
  const [zachetaKarty, setZachetaKarty] = useState(null);

  // Cisza przy wyjściu z panelu — inaczej lisek dokańcza zdanie już nad mapą.
  useEffect(() => () => uciszLiska(), []);

  // Uchwyt dla testów i reżyserki: resetuje stary i nowy zapis porad.
  useEffect(() => {
    window.poradaDnia = {
      reset: () => {
        zresetujPorade();
        setStan(czytajRytual());
        setSlady([]);
        setAkcja(false);
      },
    };
    return () => { delete window.poradaDnia; };
  }, []);

  function wybierz(karta) {
    setStan(wybierzKarteDnia(karta.id));
    const zdanie = zachetaDoKarty(karta);
    setZachetaKarty(zdanie);
    powiedzJakLisek(zdanie);
  }

  const wybierzInna = useCallback(() => {
    setStan(anulujWyborKarty());
    setAkcja(false);
    setZachetaKarty(null);
    uciszLiska();
  }, []);

  // Strzałka w belce ma dwa poziomy: szczegół/podsumowanie → lista kart,
  // a dopiero z listy kart → świat. Panel przekazuje rodzicowi wyłącznie
  // pierwszy krok; brak funkcji oznacza, że rodzic ma zamknąć szufladę.
  useEffect(() => {
    const maWidokWewnetrzny = Boolean(wybrana || ukonczona);
    onPowrot?.(maWidokWewnetrzny ? wybierzInna : null);
    return () => onPowrot?.(null);
  }, [onPowrot, wybierzInna, wybrana, ukonczona]);

  function uruchom() {
    if (wybrana) setAkcja(true);
  }

  function ukoncz() {
    if (!wybrana) return;
    setStan(ukonczKarteDnia(wybrana.id));
    setSlady(czytajSlady());
    setAkcja(false);
  }

  return (
    <div className="hub-pane porada-nowa" data-testid="hub-pane-porada">
      {akcja && wybrana?.akcja === "oddech" ? (
        <EkranOddechu
          pora={pora.id}
          onKoniec={() => setAkcja(false)}
          onUkonczone={ukoncz}
        />
      ) : null}
      {akcja && wybrana?.akcja !== "oddech" ? (
        <PoradaAkcja karta={wybrana} onZamknij={() => setAkcja(false)} onUkonczone={ukoncz} />
      ) : null}

      {ukonczona ? (
        <section className="porada-odzew" data-testid="porada-odzew">
          <span className="porada-odzew-portret" aria-hidden="true">
            <img src={ukonczona.ilustracja} alt="" draggable="false" />
          </span>
          <h3>{ukonczona.tytul}</h3>
          <p>{ukonczona.odzew}</p>
        </section>
      ) : wybrana ? (
        <section className="porada-wybrana" data-testid="porada-wybrana">
          <span className="porada-wybrana-obraz" aria-hidden="true">
            <img src={wybrana.ilustracja} alt="" draggable="false" />
          </span>
          <h3>{wybrana.tytul}</h3>
          {zachetaKarty ? (
            <button
              type="button"
              className="porada-lisek porada-lisek--wybor"
              onClick={() => powiedzJakLisek(zachetaKarty)}
              data-testid="porada-lisek-wybor"
            >
              <img src="/lisPop.webp" alt="" aria-hidden="true" draggable="false" />
              <span>{zachetaKarty}</span>
            </button>
          ) : null}
          <button type="button" className="hub-btn hub-btn-primary" onClick={uruchom}>
            Zrób to ze mną
          </button>
          <button type="button" className="porada-zmien" onClick={wybierzInna}>
            Wybierz inną kartę
          </button>
        </section>
      ) : (
        <>
          <header className="porada-wstep">
            <h3>Wybierz zabawę</h3>
            {/* Zdanie liska: napisane i powiedziane jego głosem. Dotknięcie
                powtarza mowę — dziecko, które nie dosłyszało, nie musi
                zamykać i otwierać szuflady. */}
            <button
              type="button"
              className="porada-lisek"
              onClick={() => powiedzJakLisek(zachetaWyboru)}
              data-testid="porada-lisek"
            >
              <img src="/lisPop.webp" alt="" aria-hidden="true" draggable="false" />
              <span>{zachetaWyboru}</span>
            </button>
          </header>
          <div className="porada-wybor" data-testid="porada-wybor">
            {karty.map((karta) => (
              <button
                key={karta.id}
                type="button"
                className="porada-kafelek"
                onClick={() => wybierz(karta)}
                aria-label={`${karta.tytul}. ${karta.opis}`}
                data-testid={`porada-karta-${karta.id}`}
              >
                <span className="porada-kafelek-in">
                  <span className="porada-kafelek-obraz">
                    <img src={karta.ilustracja} alt="" aria-hidden="true" draggable="false" />
                  </span>
                  <strong>{karta.tytul}</strong>
                </span>
              </button>
            ))}
          </div>
        </>
      )}

      <section className="porada-slady" aria-label="Ślady z ostatnich siedmiu dni">
        <div>
          <h3>Twoje listki</h3>
        </div>
        <div className="porada-slady-listki" aria-label={`${slady.length} z 7 listków`}>
          {Array.from({ length: 7 }, (_, i) => (
            <span key={i} className={i < slady.length ? "jest-pelny" : undefined} aria-hidden="true" />
          ))}
        </div>
      </section>
    </div>
  );
}
