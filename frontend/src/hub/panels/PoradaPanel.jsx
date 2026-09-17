/**
 * PoradaPanel — jedna świeża porada dnia, pod nią wszystko, co już było.
 *
 * DLACZEGO TAK. Zakładka pokazywała trzy kafle ćwiczeń (oddech, trop, ruch),
 * co czytało się jak przybornik, a nie jak rada. Wracamy do pomysłu z pierwszej
 * wersji: biblioteka porad dobranych do archetypu dziecka. Karty ćwiczeń nie
 * zostały skasowane — siedzą w `PoradaKarty.jsx` i wracają przestawieniem
 * `POKAZ_KARTY_AKTYWNOSCI` na `true`.
 *
 * ŚWIEŻA U GÓRY, RESZTA POD SPODEM. Nagłówek to porada na teraz (profil × dzień
 * × pora dnia — patrz `hub/poradaZBiblioteki.js`). Gdy zmienia się pora albo
 * dzień, poprzednia schodzi na listę „Rady, które już masz" i na górze pojawia
 * się nowa. Nic się nie kasuje i nic nie przepada.
 *
 * ODBIORCĄ JEST DZIECKO. Biblioteka trzyma też 189 porad dla rodzica; tutaj
 * nie mają wstępu — filtr siedzi w module i jest tam opisany.
 */
import React, { Suspense, lazy, useCallback, useEffect, useMemo, useState } from "react";
import { api, session } from "../../services/api.js";
import { zdarzenie } from "../../services/analityka.jsx";
import { useAppData } from "../../contexts/AppData.jsx";
import { nazwaArchetypuGracza, odmienDlaGracza } from "../../services/rodzaj.js";
import { GameIcon } from "../../adventure/components/icons.jsx";
import { oznaczPoradyObejrzane } from "../nowosci.js";
import { powiedzJakLisek } from "../glosLiska.js";
import {
  PORA_NAZWA,
  czytajHistorie,
  etykietaDnia,
  ilePorad,
  kodProfilu,
  metaProfilu,
  poradaPoId,
  scalHistorie,
  swiezaPorada,
  zanotujPorade,
} from "../poradaZBiblioteki.js";

/** Trzy karty ćwiczeń z poprzedniej wersji. `true` przywraca je w całości. */
const POKAZ_KARTY_AKTYWNOSCI = false;
const PoradaKarty = lazy(() => import("./PoradaKarty.jsx"));

export default function PoradaPanel({ onPowrot }) {
  if (POKAZ_KARTY_AKTYWNOSCI) {
    return (
      <Suspense fallback={<div className="hub-pane" data-testid="hub-pane-porada" />}>
        <PoradaKarty onPowrot={onPowrot} />
      </Suspense>
    );
  }
  return <PoradaDnia onPowrot={onPowrot} />;
}

function PoradaDnia({ onPowrot }) {
  const { player } = useAppData();
  const profil = kodProfilu(player?.archetype);
  const meta = metaProfilu(profil);

  // Porada wybierana RAZ na wejście do panelu. Gdyby liczyła się przy każdym
  // renderze, przejście przez granicę pory dnia podmieniałoby kartę pod palcem.
  const swieza = useMemo(() => swiezaPorada(profil, player), [profil, player]);
  const [historia, setHistoria] = useState(() => czytajHistorie());
  const [otwarta, setOtwarta] = useState(null);

  /** Samo zajrzenie gasi plakietkę „nowe" na doku. */
  useEffect(() => { oznaczPoradyObejrzane(); }, []);
  /* Bez uciszania przy zamknięciu — lisek kończy zdanie (`hub/mowaPostaci.js`). */

  // Zobaczona porada od razu ląduje w historii (lokalnie i na koncie), więc
  // jutro widać ją na liście, a nie tylko wtedy, gdy dziecko w nią kliknęło.
  useEffect(() => {
    if (!swieza) return;
    setHistoria(zanotujPorade(swieza));
    zdarzenie("porada_dnia_pokazana", { porada: swieza.id, profil, pora: swieza.slot });
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

  const zamknijSzczegol = useCallback(() => setOtwarta(null), []);

  // Strzałka w belce ma dwa poziomy: szczegół → lista, lista → świat.
  useEffect(() => {
    onPowrot?.(otwarta ? zamknijSzczegol : null);
    return () => onPowrot?.(null);
  }, [onPowrot, otwarta, zamknijSzczegol]);

  // Historia to wpisy, które umiemy rozwinąć w poradę TEGO dziecka. Wpisy po
  // poradach dla rodzica (czytanych na stronie porad) i po innym profilu
  // odpadają — inaczej dziecko dostałoby listę cudzych rad.
  const wpisy = useMemo(() => historia
    .map((w) => ({ ...w, porada: poradaPoId(w.id) }))
    .filter((w) => w.porada && w.porada.profile === profil && w.porada.audience === "dziecko")
    .filter((w) => w.id !== swieza?.id), [historia, profil, swieza]);

  function przeczytaj(tekst) {
    // Czyta lisek — to jego zakładka w doku.
    powiedzJakLisek(tekst);
  }

  function otworz(wpis) {
    zdarzenie("porada_historia_otwarta", { porada: wpis.id, profil });
    setOtwarta(wpis);
  }

  if (otwarta?.porada) {
    const p = otwarta.porada;
    return (
      <div className="hub-pane porada-dnia" data-testid="hub-pane-porada">
        <article className="porada-szczegol" data-testid="porada-szczegol">
          <span className="porada-znacznik">{PORA_NAZWA[p.slot] || "Porada"} · {etykietaDnia(otwarta.kiedy)}</span>
          <h3>{odmienDlaGracza(p.title, player)}</h3>
          <p>{odmienDlaGracza(p.body, player)}</p>
          <button type="button" className="porada-czytaj" onClick={() => przeczytaj(odmienDlaGracza(p.body, player))}>
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
              <span className="porada-znacznik">Małe odkrycie</span>
              <h3>{odmienDlaGracza(swieza.title, player)}</h3>
            </header>
            <p>{odmienDlaGracza(swieza.body, player)}</p>
            <footer>
              <button
                type="button"
                className="porada-czytaj"
                onClick={() => przeczytaj(odmienDlaGracza(swieza.body, player))}
              >
                <span className="porada-czytaj-znak" aria-hidden="true">
                  <GameIcon name="play" size={26} />
                </span>
                <span>Posłuchaj</span>
              </button>
              {swieza.time ? <span className="porada-czas">{swieza.time}</span> : null}
            </footer>
          </div>
        </article>
      ) : (
        <p className="porada-pusto">Nie mam dziś dla Ciebie nowej porady. Zajrzyj jutro.</p>
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
        {wpisy.length && meta ? (
          <p className="porada-stopka">
            Porady dobrane dla Ciebie: {nazwaArchetypuGracza(profil, player)} · {meta.cecha}. W zapasie jest ich {ilePorad(profil)}.
          </p>
        ) : null}
      </section>
    </div>
  );
}
