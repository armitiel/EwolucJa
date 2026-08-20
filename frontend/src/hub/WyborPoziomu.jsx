/**
 * WyborPoziomu — kafelki „poziom + ile można wygrać".
 *
 * Wyjęte z `EkranStartuGry`, bo od kiedy zaproszenie liska na mapie pyta
 * o to samo (poziom i kwota), ten wybór stoi w dwóch różnych oknach. Gdyby
 * każde rysowało go po swojemu, dziecko uczyłoby się dwóch układów tej samej
 * decyzji — a to jest dokładnie ten element, który ma być rozpoznawalny
 * od pierwszego spojrzenia.
 *
 * Kwota jest BEZ SŁOWA „monet": moneta jest tu rzeczownikiem. Dziecko, które
 * jeszcze nie czyta, widzi ikonkę z HUD-u i liczbę — dokładnie to, co przybędzie
 * mu na liczniku po wygranej.
 *
 * Przy jednym poziomie kafelek jest wyłączony: nie ma czego wybierać, więc
 * nie udajemy wyboru — zostaje sama obietnica.
 */
import React from "react";
import { Coin } from "../components/art.jsx";

export default function WyborPoziomu({ poziomy = [], wybrany, onWybor, rozmiarMonety = 34 }) {
  if (!poziomy.length) return null;
  const jeden = poziomy.length < 2;

  return (
    <div className={"start-gry-poziomy" + (jeden ? " jeden" : "")}>
      {poziomy.map((p) => (
        <button
          key={p.id}
          type="button"
          className={"start-gry-poziom" + (p.id === wybrany ? " wybrany" : "")}
          onClick={() => onWybor?.(p.id)}
          aria-pressed={jeden ? undefined : p.id === wybrany}
          aria-label={p.nazwa ? `${p.nazwa}, do ${p.monetyMax} monet` : `Do ${p.monetyMax} monet`}
          disabled={jeden}
        >
          {!jeden && p.id === wybrany ? <span className="start-gry-poziom-check" aria-hidden="true">✓</span> : null}
          {p.nazwa ? <span className="start-gry-poziom-nazwa">{p.nazwa}</span> : null}
          <span className="start-gry-poziom-monety">
            <Coin size={rozmiarMonety} />
            <b>{p.monetyMax}</b>
          </span>
        </button>
      ))}
    </div>
  );
}
