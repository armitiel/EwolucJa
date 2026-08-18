/**
 * EkranStartuGry — wspólny ekran wejścia do KAŻDEJ minigry.
 *
 * Schemat jest zawsze ten sam, bo dziecko ma się go nauczyć raz:
 *
 *   ilustracja  →  tytuł  →  jedno zdanie  →  ILE MOŻNA WYGRAĆ  →  poziom  →  CTA
 *
 * Nagroda stoi WYSOKO i jest duża, bo to ona odpowiada na pytanie „po co mam
 * w to grać". Wcześniej siedziała na dole jako drobny napis „10 ✦ 1" i ginęła.
 * Waluta jest jedna — monety — więc nie ma czego mylić.
 *
 * Przyciski i typografia są z tej samej rodziny co ekran główny (`hub-btn`),
 * a nie z własnego zestawu: minigra ma być kolejnym pokojem tego samego domu.
 *
 * Użycie:
 *   <EkranStartuGry
 *     ilustracja="/assets/karty/wizkor-karty.png"
 *     tytul="Pamięć Mędrca"
 *     opis="Znajdź pary symboli."
 *     poziomy={[{ id:"easy", nazwa:"Łatwy", opis:"6 par · 3×4", monetyMax:15 }, …]}
 *     wybrany={diff} onWybor={setDiff}
 *     wskazowka="Im mniej ruchów i im szybciej, tym więcej monet."
 *     cta="Zagraj" onGraj={() => restart()}
 *   />
 */
import React from "react";
import { Coin } from "../components/art.jsx";

export default function EkranStartuGry({
  ilustracja,
  tytul,
  poziomy = [],
  wybrany,
  onWybor,
  cta = "Zagraj",
  onGraj,
}) {
  const jeden = poziomy.length < 2;

  return (
    <div className="start-gry">
      {ilustracja ? (
        <img className="start-gry-art" src={ilustracja} alt="" aria-hidden="true" draggable="false" />
      ) : null}

      <h1 className="start-gry-tytul t-display">{tytul}</h1>

      {/* Nagroda BEZ SLOWA „monet”: moneta jest tu rzeczownikiem. Dziecko,
          ktore jeszcze nie czyta, widzi ikonke z HUD-u i liczbe — dokladnie to,
          co przybedzie mu na liczniku po wygranej. */}
      <div className={"start-gry-poziomy" + (jeden ? " jeden" : "")}>
        {poziomy.map((p) => (
          <button
            key={p.id}
            type="button"
            className={"start-gry-poziom" + (p.id === wybrany ? " wybrany" : "")}
            onClick={() => onWybor?.(p.id)}
            aria-pressed={poziomy.length > 1 ? p.id === wybrany : undefined}
            aria-label={p.nazwa ? `${p.nazwa}, do ${p.monetyMax} monet` : `Do ${p.monetyMax} monet`}
            disabled={jeden}
          >
            {p.nazwa ? <span className="start-gry-poziom-nazwa">{p.nazwa}</span> : null}
            <span className="start-gry-poziom-monety">
              <Coin size={34} />
              <b>{p.monetyMax}</b>
            </span>
          </button>
        ))}
      </div>

      <div className="start-gry-luz" />

      <button type="button" className="hub-btn hub-btn-primary start-gry-cta" onClick={onGraj}>
        {cta}
      </button>
    </div>
  );
}
