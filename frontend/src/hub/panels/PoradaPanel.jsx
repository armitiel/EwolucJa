/*!
 * SPDX-FileCopyrightText: © 2026 Amitiel Angelisme <armitiel@gmail.com>
 * SPDX-License-Identifier: LicenseRef-EwolucJA-Proprietary
 *
 * EwolucJA — gra edukacyjna dla dzieci.
 * Produkt powstał w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”;
 * autorskie prawa majątkowe pozostają przy autorze. Licencja: LICENSE.
 */
/**
 * PoradaPanel — jedna porada dnia z liskiem: zapowiedź → „Zrób to ze mną” /
 * „Zrobione” → odzew liska → ślad w świecie. Pod spodem wszystko, co już było.
 *
 * FORMAT: docs/tresci/04_PORADY_DNIA.md §4.1 (`dailyTipsData.js`). Karta
 * pokazuje `title`, `zapowiedz` (to mówi lisek), `krok` (cała instrukcja) i
 * `minimum` („na gorszy dzień” — zawsze widoczne, nigdy jako wyrzut).
 *
 * SILNIKI: pole `silnik` porady otwiera wykonanie w aplikacji — `oddech`
 * (`EkranOddechu`, balon), `szukanie` / `fazy` / `cisza` / `napiecie`
 * (`PoradaAkcja`, wszystko przełączane dotknięciem, bez sekund i cyfr).
 * Porady `gdzie: obok | dzien` mają „Zrobione” i „Później”. „Później” nie
 * jest porażką: nic nie liczy, nic nie mówi, karta zostaje.
 *
 * ODZEW: po wykonaniu lisek mówi `odzew` (jedno zdanie, o sobie, z pytaniem).
 * Przy `gdzie: dzien` odzew pada przy następnym wejściu tego dnia.
 *
 * ŚLAD: `pokazSladPorady(slad)` woła defensywnie API sceny
 * (`globalThis.__SCENA.ustawSladPorady`) — do końca doby, bez licznika,
 * bez monet, bez Fasoli. Zdarzenie analityki: `porada_wykonana`.
 *
 * NIE MA: stopki z nazwą profilu (etykieta), listków „x z 7”, „zajrzyj później”,
 * przełącznika `POKAZ_KARTY_AKTYWNOSCI`, osobnych pul `KARTY_DNIA` i `porady.v1.json`.
 */
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { api, session } from "../../services/api.js";
import { zdarzenie } from "../../services/analityka.jsx";
import { useAppData } from "../../contexts/AppData.jsx";
import { odmienDlaGracza } from "../../services/rodzaj.js";
import { GameIcon } from "../../adventure/components/icons.jsx";
import { oznaczPoradyObejrzane } from "../nowosci.js";
import { powiedzJakLisek, uciszLiska } from "../glosLiska.js";
import EkranOddechu from "../EkranOddechu.jsx";
import PoradaAkcja from "../PoradaAkcja.jsx";
import {
  PORA_NAZWA,
  czytajHistorie,
  czytajWykonanie,
  etykietaDnia,
  kodProfilu,
  oznaczOdzewPowiedziany,
  pokazSladPorady,
  poradaPoId,
  scalHistorie,
  swiezaPorada,
  zanotujPorade,
  zapiszWykonanie,
} from "../poradaZBiblioteki.js";

export default function PoradaPanel({ onPowrot }) {
  return <PoradaDnia onPowrot={onPowrot} />;
}

function PoradaDnia({ onPowrot }) {
  const { player } = useAppData();
  const profil = kodProfilu(player?.archetype);

  // Porada wybierana RAZ na wejście do panelu. Gdyby liczyła się przy każdym
  // renderze, przejście przez granicę pory dnia podmieniałoby kartę pod palcem.
  const swieza = useMemo(() => swiezaPorada(profil, player), [profil, player]);
  const [historia, setHistoria] = useState(() => czytajHistorie());
  const [otwarta, setOtwarta] = useState(null);
  const [wykonane, setWykonane] = useState(() => czytajWykonanie());
  const [silnik, setSilnik] = useState(null);

  /** Samo zajrzenie gasi plakietkę „nowe" na doku. */
  useEffect(() => { oznaczPoradyObejrzane(); }, []);
  /* Bez uciszania przy zamknięciu — lisek kończy zdanie (`hub/mowaPostaci.js`). */

  // Zobaczona porada od razu ląduje w historii (lokalnie i na koncie).
  useEffect(() => {
    if (!swieza) return;
    setHistoria(zanotujPorade(swieza));
    zdarzenie("porada_dnia_pokazana", { porada: swieza.id, profil, pora: swieza.slot, wersja: swieza.wersja || 1 });
    const pid = session.getPlayer?.();
    if (!pid) return;
    api.markTipViewed(pid, swieza.id).catch((e) => console.warn("[porada] markTipViewed:", e));
  }, [swieza, profil]);

  // Konto jest źródłem prawdy dla historii między urządzeniami; localStorage
  // trzyma ją offline. Przy wejściu scalamy oba zbiory.
  useEffect(() => {
    const pid = session.getPlayer?.();
    if (!pid) return;
    api.getViewedTips(pid)
      .then((dane) => { setHistoria(scalHistorie(dane?.viewed || [])); })
      .catch((e) => console.warn("[porada] getViewedTips:", e));
  }, []);

  // Porada `gdzie: dzien` zrobiona wcześniej tego dnia: lisek odpowiada teraz,
  // przy wejściu — raz. Ślad w świecie przywracamy bez animacji.
  useEffect(() => {
    if (!wykonane) return;
    const p = poradaPoId(wykonane.id);
    if (p) pokazSladPorady(p.slad, { bezAnimacji: true });
    if (!wykonane.odzewPowiedziany && p?.odzew) {
      powiedzJakLisek(p.odzew);
      setWykonane(oznaczOdzewPowiedziany());
    }
    // tylko przy wejściu do panelu
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const zamknijSzczegol = useCallback(() => setOtwarta(null), []);

  // Strzałka w belce ma dwa poziomy: szczegół → lista, lista → świat.
  useEffect(() => {
    onPowrot?.(otwarta ? zamknijSzczegol : null);
    return () => onPowrot?.(null);
  }, [onPowrot, otwarta, zamknijSzczegol]);

  // Historia to wpisy, które umiemy rozwinąć w poradę TEGO dziecka.
  const wpisy = useMemo(() => historia
    .map((w) => ({ ...w, porada: poradaPoId(w.id) }))
    .filter((w) => w.porada && w.porada.profile === profil)
    .filter((w) => w.id !== swieza?.id), [historia, profil, swieza]);

  function przeczytaj(tekst) {
    // Czyta lisek — to jego zakładka w doku. Odmiana tokenów siedzi w `powiedzJakLisek`.
    powiedzJakLisek(tekst);
  }

  function otworz(wpis) {
    zdarzenie("porada_historia_otwarta", { porada: wpis.id, profil });
    setOtwarta(wpis);
  }

  const dzisiejszaZrobiona = !!(wykonane && swieza && wykonane.id === swieza.id);

  /** Wykonanie: zapis, odzew (od razu albo przy następnym wejściu), ślad, zdarzenie. */
  function zrobione() {
    if (!swieza) return;
    const odRazu = swieza.gdzie !== "dzien";
    const zapis = zapiszWykonanie(swieza, { odzewPowiedziany: odRazu });
    setWykonane(zapis);
    setSilnik(null);
    zdarzenie("porada_wykonana", { porada: swieza.id, rodzaj: swieza.rodzaj, gdzie: swieza.gdzie, wersja: swieza.wersja || 1 });
    pokazSladPorady(swieza.slad);
    if (odRazu && swieza.odzew) powiedzJakLisek(swieza.odzew);
  }

  function pozniej() {
    // „Później" niczego nie liczy i nic nie mówi. Karta zostaje na tę porę.
    zdarzenie("porada_pozniej", { porada: swieza?.id });
  }

  function uruchom() {
    if (!swieza?.silnik) return;
    uciszLiska();
    zdarzenie("porada_silnik_start", { porada: swieza.id, silnik: swieza.silnik });
    setSilnik(swieza.silnik);
  }

  if (otwarta?.porada) {
    const p = otwarta.porada;
    return (
      <div className="hub-pane porada-dnia" data-testid="hub-pane-porada">
        <article className="porada-szczegol" data-testid="porada-szczegol">
          <span className="porada-znacznik">{PORA_NAZWA[p.slot] || "Porada"} · {etykietaDnia(otwarta.kiedy)}</span>
          <h3>{odmienDlaGracza(p.title, player)}</h3>
          <p>{odmienDlaGracza(p.zapowiedz || p.body, player)}</p>
          {p.krok ? <p className="porada-tekst">{odmienDlaGracza(p.krok, player)}</p> : null}
          <button type="button" className="porada-czytaj" onClick={() => przeczytaj(p.zapowiedz || p.body)}>
            <span className="porada-czytaj-znak" aria-hidden="true">
              <GameIcon name="play" size={26} />
            </span>
            <span>Posłuchaj</span>
          </button>
          <button type="button" className="porada-zmien" onClick={zamknijSzczegol}>
            Wróć do porad
          </button>
        </article>
      </div>
    );
  }

  return (
    <div className="hub-pane porada-dnia" data-testid="hub-pane-porada">
      {silnik === "oddech" && swieza ? (
        <EkranOddechu
          pora={swieza.slot}
          onKoniec={() => setSilnik(null)}
          onUkonczone={zrobione}
        />
      ) : null}
      {silnik && silnik !== "oddech" && swieza ? (
        <PoradaAkcja porada={swieza} silnik={silnik} onZamknij={() => setSilnik(null)} onUkonczone={zrobione} />
      ) : null}

      {swieza ? (
        <article className="porada-swieza" data-testid="porada-swieza">
          <figure className="porada-swieza-ilustracja" aria-hidden="true">
            <img
              src="/assets/porady/lis-zdrowie-uniwersalny.png"
              alt=""
              draggable="false"
            />
          </figure>
          <div className="porada-swieza-tresc">
            <header>
              <span className="porada-znacznik">{dzisiejszaZrobiona ? "Zrobione dziś" : "Małe odkrycie"}</span>
              <h3>{odmienDlaGracza(swieza.title, player)}</h3>
            </header>
            <p>{odmienDlaGracza(swieza.zapowiedz || swieza.body, player)}</p>
            {swieza.krok ? (
              <p className="porada-tekst" data-testid="porada-krok">{odmienDlaGracza(swieza.krok, player)}</p>
            ) : null}
            {swieza.minimum ? (
              <p className="porada-czas" data-testid="porada-minimum">Na gorszy dzień: {odmienDlaGracza(swieza.minimum, player)}</p>
            ) : null}
            <footer>
              <button
                type="button"
                className="porada-czytaj"
                onClick={() => przeczytaj(swieza.zapowiedz || swieza.body)}
              >
                <span className="porada-czytaj-znak" aria-hidden="true">
                  <GameIcon name="play" size={26} />
                </span>
                <span>Posłuchaj</span>
              </button>
            </footer>
            {dzisiejszaZrobiona ? (
              swieza.odzew ? (
                <button
                  type="button"
                  className="porada-lisek porada-lisek--wybor"
                  onClick={() => przeczytaj(swieza.odzew)}
                  data-testid="porada-odzew"
                >
                  <img src="/lisPop.webp" alt="" aria-hidden="true" draggable="false" />
                  <span>{odmienDlaGracza(swieza.odzew, player)}</span>
                </button>
              ) : null
            ) : (
              <div className="porada-akcje" data-testid="porada-akcje">
                {swieza.silnik ? (
                  <button type="button" className="hub-btn hub-btn-primary" onClick={uruchom} data-testid="porada-zrob">
                    Zrób to ze mną
                  </button>
                ) : (
                  <button type="button" className="hub-btn hub-btn-primary" onClick={zrobione} data-testid="porada-zrobione">
                    Zrobione
                  </button>
                )}
                <button type="button" className="porada-zmien" onClick={pozniej} data-testid="porada-pozniej">
                  Później
                </button>
              </div>
            )}
          </div>
        </article>
      ) : (
        <p className="porada-pusto">Dziś nic nowego. Wczorajsze rady są niżej.</p>
      )}

      <section className="porada-historia" aria-label="Rady, które już znasz">
        <header className="porada-historia-head">
          <img src="/assets/hub-nav/porada-simple.png" alt="" aria-hidden="true" draggable="false" />
          <h3>Rady, które już znasz</h3>
          <span aria-hidden="true" />
        </header>
        {wpisy.length ? (
          <ul>
            {wpisy.map((w) => (
              <li key={w.id}>
                <button type="button" onClick={() => otworz(w)} data-testid={`porada-historia-${w.id}`}>
                  <span className="porada-historia-tekst">
                    <strong>{odmienDlaGracza(w.porada.title, player)}</strong>
                    <small>{etykietaDnia(w.kiedy)}</small>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="porada-pusto porada-pusto-historia">
            Poznane rady pojawią się tutaj.
          </p>
        )}
      </section>
    </div>
  );
}
