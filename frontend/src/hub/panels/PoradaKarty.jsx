/*!
 * SPDX-FileCopyrightText: © 2026 Amitiel Angelisme <armitiel@gmail.com>
 * SPDX-License-Identifier: LicenseRef-EwolucJA-Proprietary
 *
 * EwolucJA — gra edukacyjna dla dzieci.
 * Produkt powstał w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”;
 * autorskie prawa majątkowe pozostają przy autorze. Licencja: LICENSE.
 */
/**
 * PoradaKarty — DAWNE trzy karty aktywności (balon, trop, ruch).
 *
 * Od 17.09.2026 NIEUŻYWANE: `PoradaPanel.jsx` nie importuje już tego pliku, a
 * silniki (`EkranOddechu`, `PoradaAkcja`) uruchamia bezpośrednio z pola
 * `silnik` porady w bibliotece (docs/tresci/04 §4.1). Listki „x z 7” (ukryty
 * licznik tygodnia) zdjęte. Plik zostaje do czasu decyzji o `git rm` — wraz
 * z `KARTY_DNIA` w `poradaDnia.js`, których używa jeszcze `DomPanel.jsx`.
 * `PoradaAkcja` ma dziś inny interfejs (`porada`, `silnik`) — ten komponent
 * nie zbuduje się poprawnie w runtime i nie wolno go podpinać bez przepisania.
 *
 * Przepływ jest celowo taki sam jak w Minigrach: najpierw wybór dużym
 * obrazkiem, potem krótka aktywność i dopiero na końcu reakcja świata. Samo
 * dotknięcie kafla niczego nie zalicza.
 */
import React, { useCallback, useEffect, useMemo, useState } from "react";
import EkranOddechu from "../EkranOddechu.jsx";
import { zdarzenie } from "../../services/analityka.jsx";
import PoradaAkcja from "../PoradaAkcja.jsx";
import {
  anulujWyborKarty,
  czytajRytual,
  kartyDnia,
  poraDnia,
  ukonczKarteDnia,
  wybierzKarteDnia,
  zresetujPorade,
} from "../poradaDnia.js";
import { oznaczPoradyObejrzane } from "../nowosci.js";
import { powiedzJakLisek, uciszLiska, zachetaDoKarty, zachetaDoWyboru } from "../glosLiska.js";

export default function PoradaKarty({ onPowrot }) {
  const [stan, setStan] = useState(() => czytajRytual());
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
  /* Zamknięcie szuflady nie ucisza liska — zasada z `hub/mowaPostaci.js`.
     Ucisza dopiero WEJŚCIE W ĆWICZENIE (`uruchom` niżej), bo tam głos
     przejmuje sama praktyka. */

  // Uchwyt dla testów i reżyserki: resetuje stary i nowy zapis porad.
  useEffect(() => {
    window.poradaDnia = {
      reset: () => {
        zresetujPorade();
        setStan(czytajRytual());
        setAkcja(false);
      },
    };
    return () => { delete window.poradaDnia; };
  }, []);

  function wybierz(karta) {
    zdarzenie("karta_wybrana", { karta: karta.id, akcja: karta.akcja, pora: pora.id });
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
    // Para zdarzen karta_wybrana / karta_ukonczona daje jedyna liczbe, ktora
    // cos tu mowi: ile wybranych kart dziecko doprowadza do konca.
    zdarzenie("karta_ukonczona", { karta: wybrana.id, akcja: wybrana.akcja, pora: pora.id });
    setStan(ukonczKarteDnia(wybrana.id));
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

    </div>
  );
}
