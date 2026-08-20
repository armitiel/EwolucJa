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
import WyborPoziomu from "./WyborPoziomu.jsx";

export default function EkranStartuGry({
  ilustracja,
  tytul,
  haslo,
  wariant = "domyslny",
  laduje = false,
  tekstLadowania = "Szykuję zabawę…",
  poziomy = [],
  wybrany,
  onWybor,
  cta = "Zagraj",
  onGraj,
}) {
  return (
    <div className={`start-gry start-gry--${wariant}${laduje ? " is-loading" : " is-ready"}`} aria-busy={laduje || undefined}>
      <div className="start-gry-scena" aria-hidden="true">
        <div className="start-gry-efekty">
          {wariant === "pamiec" ? (
            <>
              <img className="start-gry-karta start-gry-karta--1" src="/assets/karty/rewers-3d.png" alt="" />
              <img className="start-gry-karta start-gry-karta--2" src="/assets/karty/rewers-3d.png" alt="" />
              <img className="start-gry-karta start-gry-karta--3" src="/assets/karty/rewers-3d.png" alt="" />
            </>
          ) : null}
          {wariant === "puch" ? (
            <>
              <img className="start-gry-piorko start-gry-piorko--1" src="/assets/piorka/piorko-krem.png" alt="" />
              <img className="start-gry-piorko start-gry-piorko--2" src="/assets/piorka/piorko-blekit.png" alt="" />
              <img className="start-gry-piorko start-gry-piorko--3" src="/assets/piorka/piorko-piasek.png" alt="" />
            </>
          ) : null}
          {wariant === "lot" ? (
            <>
              <i className="start-gry-lisc start-gry-lisc--1" />
              <i className="start-gry-lisc start-gry-lisc--2" />
              <i className="start-gry-lisc start-gry-lisc--3" />
            </>
          ) : null}
          <i className="start-gry-iskra start-gry-iskra--1" />
          <i className="start-gry-iskra start-gry-iskra--2" />
          <i className="start-gry-iskra start-gry-iskra--3" />
        </div>

        {ilustracja ? (
          <div className="start-gry-postac">
            <img className="start-gry-art" src={ilustracja} alt="" draggable="false" />
          </div>
        ) : null}
      </div>

      <div className="start-gry-panel">
        <div className="start-gry-tabliczka">
          <h1 className="start-gry-tytul t-display">{tytul}</h1>
          {haslo ? <p className="start-gry-haslo">{haslo}</p> : null}
        </div>

        <div className="start-gry-akcje">
          {laduje ? (
            <div className="start-gry-loader" role="status" aria-live="polite" data-testid="start-gry-loader">
              <span className="start-gry-loader-fiolka" aria-hidden="true">
                <span className="start-gry-loader-plyn">
                  <i /><i /><i />
                </span>
                <span className="start-gry-loader-szklo" />
              </span>
              <strong>{tekstLadowania}</strong>
            </div>
          ) : (
            <div className="start-gry-gotowe">
              {/* Te same kafelki, co w zaproszeniu liska na mapie — patrz
                  `hub/WyborPoziomu.jsx`. */}
              <WyborPoziomu poziomy={poziomy} wybrany={wybrany} onWybor={onWybor} />

              <button type="button" className="hub-btn hub-btn-primary start-gry-cta" onClick={onGraj}>
                <span>{cta}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
