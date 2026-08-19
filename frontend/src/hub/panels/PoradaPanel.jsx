/**
 * PoradaPanel — jedna karteczka na dziś, a pod nią tablica.
 *
 * Trzy decyzje, które warto znać przed zmianą:
 *
 * 1. JEDNO KRÓTKIE ZDANIE. Wcześniej stał tu akapit z podpisem postaci —
 *    dziecko w wieku 6-12 lat takiego bloku nie czyta, tylko go przewija.
 *    Porada ma być do wykonania, nie do przeczytania: „Wypij szklankę wody",
 *    a nie wykład o nawodnieniu.
 *
 * 2. BEZ NADAWCY. Nikt tego nie mówi. Podpis („od Szeptuna") kazał dziecku
 *    pamiętać jeszcze jedną postać i zamieniał zdanie w cytat, czyli w coś,
 *    co się czyta, zamiast w polecenie, które się robi.
 *
 * 3. DWA WYJŚCIA, OBA W PORZĄDKU. Zielony kciuk = zrobione. Krzyżyk = odkładam.
 *    Karteczka schodzi tak samo w obu przypadkach i ląduje na tablicy pod
 *    spodem. Nic nie jest liczone, nic nie przepada — odłożenie to nie porażka
 *    i nie może wyglądać jak kara.
 *
 * Po zdjęciu karteczki zostaje zegar i dwie półki z poradami na aktualną porę
 * dnia. Dzień się nie kończy pustym ekranem.
 */
import React, { useEffect, useMemo, useState } from "react";
import ZegarKlasyczny from "../ZegarKlasyczny.jsx";
import KacikDobrostanu from "../KacikDobrostanu.jsx";
import {
  czytajHistorie,
  poradaDnia,
  poradyNaPore,
  poraDnia,
  zdejmijPorade,
  zresetujPorade,
} from "../poradaDnia.js";

/** Kciuk i krzyżyk rysowane wektorem — biorą kolor z CSS i nie mażą się przy skalowaniu. */
function IkonaKciuk() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M7 10.5v9H4.5a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1H7zm2.4 0 3.3-6.7a1.4 1.4 0 0 1 2.6.9l-.7 4h4.1a1.9 1.9 0 0 1 1.85 2.34l-1.3 6A2 2 0 0 1 17.3 19H9.4v-8.5z" />
    </svg>
  );
}

function IkonaKrzyzyk() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M7 7l10 10M17 7L7 17" />
    </svg>
  );
}

export default function PoradaPanel() {
  const [porada, setPorada] = useState(() => poradaDnia());
  const [historia, setHistoria] = useState(() => czytajHistorie());
  const [znika, setZnika] = useState(null);

  const pora = useMemo(() => poraDnia(), []);
  // Karteczka dnia WYPADA z półek pod spodem. Bez tego to samo zdanie stało na
  // ekranie dwa razy w odstępie dwóch centymetrów i karteczka przestawała być
  // wyróżniona — była po prostu tą samą pozycją, tylko większą.
  const polki = useMemo(() => {
    const p = poradyNaPore(pora.id);
    if (!porada) return p;
    return {
      zdrowie: p.zdrowie.filter((x) => x.id !== porada.id),
      samopoczucie: p.samopoczucie.filter((x) => x.id !== porada.id),
    };
  }, [pora.id, porada]);

  // Uchwyt do konsoli — czekanie do jutra przy każdej poprawce byłoby absurdem:
  //   window.poradaDnia.reset()
  useEffect(() => {
    window.poradaDnia = {
      reset: () => { zresetujPorade(); setPorada(poradaDnia()); setHistoria([]); },
    };
    return () => { delete window.poradaDnia; };
  }, []);

  /**
   * Zdjęcie karteczki. Najpierw animacja (klasa `znika`), dopiero po niej
   * zamiana stanu — inaczej karteczka nie odlatuje, tylko gaśnie w miejscu.
   */
  function zdejmij(akcja) {
    if (!porada || znika) return;
    setZnika(akcja);
    window.setTimeout(() => {
      setHistoria(zdejmijPorade(porada, akcja));
      setPorada(null);
      setZnika(null);
    }, akcja === "odlozona" ? 460 : 380);
  }

  return (
    <div className="hub-pane" data-testid="hub-pane-porada">
      {porada ? (
        <div
          className={`porada-karta${znika ? ` porada-karta--${znika}` : ""}`}
          data-testid="porada-karta"
        >
          <span className="porada-pinezka" aria-hidden="true" />
          <p className="porada-tekst">{porada.tekst}</p>
          <div className="porada-akcje">
            <button
              type="button"
              className="porada-ikona porada-ikona--tak"
              onClick={() => zdejmij("wzieta")}
              aria-label="Zrobione"
              title="Zrobione"
              data-testid="porada-tak"
            >
              <IkonaKciuk />
            </button>
            <button
              type="button"
              className="porada-ikona porada-ikona--nie"
              onClick={() => zdejmij("odlozona")}
              aria-label="Odłóż na potem"
              title="Odłóż na potem"
              data-testid="porada-nie"
            >
              <IkonaKrzyzyk />
            </button>
          </div>
        </div>
      ) : (
        <div className="porada-zegar-blok" data-testid="porada-zegar">
          <ZegarKlasyczny size={112} etykieta={pora.nazwa} />
          {/* Obok zegara losowana drobnostka dla siebie - inna przy kazdym
              wejsciu, zeby gora panelu nie byla martwa po trzecim dniu. */}
          <KacikDobrostanu pora={pora.id} />
        </div>
      )}

      <div className="porada-polka">
        <h3>Ciało</h3>
        <ul>
          {polki.zdrowie.map((p) => (
            <li key={p.id}>{p.tekst}</li>
          ))}
        </ul>
      </div>

      <div className="porada-polka porada-polka--dusza">
        <h3>Głowa</h3>
        <ul>
          {polki.samopoczucie.map((p) => (
            <li key={p.id}>{p.tekst}</li>
          ))}
        </ul>
      </div>

      {historia.length ? (
        <div className="porada-historia" data-testid="porada-historia">
          <h3>Wcześniejsze karteczki</h3>
          <ul>
            {historia.map((h) => (
              <li key={`${h.dzien}-${h.id}`} className={`porada-historia--${h.akcja}`}>
                <span className="porada-historia-znak" aria-hidden="true">
                  {h.akcja === "wzieta" ? <IkonaKciuk /> : <IkonaKrzyzyk />}
                </span>
                <span>{h.tekst}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
