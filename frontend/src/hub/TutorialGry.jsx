/**
 * TutorialGry — jeden ekran zasad, wspólny dla wszystkich minigier.
 *
 * MIEJSCE W PRZEPŁYWIE: ekran startowy → „Zagraj!" → TUTAJ → partia.
 * Zasady czyta się dopiero wtedy, gdy dziecko już zdecydowało, że gra — na
 * ekranie startowym konkurowałyby z nagrodą i wyborem poziomu, czyli z dwiema
 * rzeczami, które mają tam wygrać.
 *
 * POKAZUJEMY, NIE OPISUJEMY. Każdy krok ma ruchomą miniaturę: karty naprawdę
 * się odwracają, para naprawdę zostaje. Sześciolatek, który jeszcze nie czyta,
 * rozumie zasadę z samego ruchu — zdanie obok jest dla tych, którzy czytają,
 * i dla dorosłego, który siedzi obok. Miniatury są z CSS-a, więc nie dokładają
 * ani jednego pliku do pobrania.
 *
 * WRACA NA ŻĄDANIE. Sam wchodzi raz na grę (`zasadyGier.tutorialWidziany`),
 * potem tylko po dotknięciu „?" w pasku gry. Dziecko, które już umie, nie
 * przeklikuje tego samego przy dziesiątej partii.
 *
 * DEMA są mapą po nazwie, a nie propsem z JSX-em, żeby treść zasad
 * (`hub/zasadyGier.js`) została czystymi danymi — bez importu Reacta.
 */
import React from "react";
import "./styles/tutorial.css";

/* ── Symbole na awersach. Nie sięgamy po prawdziwe `GameSym` z MemoryGame:
      tutorial ma pokazać ZASADĘ, a nie konkretną talię, i ma działać także
      dla gier, które własnych symboli nie mają. ── */
function Gwiazda({ kolor = "#E8A33D" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path fill={kolor} d="M12 2.6l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.5 6.1 20.6l1.2-6.5L2.5 9.5l6.6-.9z" />
    </svg>
  );
}
function Ksiezyc({ kolor = "#7A4DC2" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path fill={kolor} d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" />
    </svg>
  );
}

const REWERS = "/assets/karty/rewers-3d.png";

/**
 * Jedna karta miniatury. `stan` steruje animacją przez klasę, a nie przez JS —
 * dzięki temu wszystkie trzy dema chodzą bez ani jednego timera w Reakcie.
 */
function Karta({ stan, symbol, opoznienie = 0 }) {
  return (
    <span className={`tut-karta tut-karta--${stan}`} style={{ animationDelay: `${opoznienie}s` }}>
      <span className="tut-karta-rewers">
        <img src={REWERS} alt="" aria-hidden="true" draggable="false" />
      </span>
      <span className="tut-karta-lice">{symbol === "ksiezyc" ? <Ksiezyc /> : <Gwiazda />}</span>
    </span>
  );
}

const DEMA = {
  /* Dotknij dwóch kart — palec puka w jedną, potem w drugą, każda się odwraca. */
  "karty-odkryj": () => (
    <span className="tut-scena">
      <Karta stan="odkryj" symbol="gwiazda" opoznienie={0} />
      <Karta stan="odkryj" symbol="ksiezyc" opoznienie={0.9} />
      <span className="tut-palec" aria-hidden="true" />
    </span>
  ),
  /* Para zostaje — obie te same, po odwróceniu dostają złotą poświatę. */
  "karty-para": () => (
    <span className="tut-scena tut-scena--para">
      <Karta stan="para" symbol="gwiazda" opoznienie={0} />
      <Karta stan="para" symbol="gwiazda" opoznienie={0.25} />
    </span>
  ),
  /* Różne wracają — odwracają się, chwila na zapamiętanie, i z powrotem. */
  "karty-wracaja": () => (
    <span className="tut-scena">
      <Karta stan="wracaja" symbol="gwiazda" opoznienie={0} />
      <Karta stan="wracaja" symbol="ksiezyc" opoznienie={0.25} />
    </span>
  ),
};

export default function TutorialGry({
  kroki = [],
  stopka = null,
  cta = "Gram!",
  onStart,
  onZamknij,
  wariant = "domyslny",
}) {
  return (
    <div className={`tut-ekran tut-ekran--${wariant}`} role="dialog" aria-label="Jak grać" data-testid="tutorial-gry">
      <div className="tut-panel">
        <h2 className="tut-tytul">Jak grać?</h2>

        <ol className="tut-kroki">
          {kroki.map((k, i) => {
            const Demo = DEMA[k.demo];
            return (
              <li key={k.id || i} className="tut-krok">
                <span className="tut-demo" aria-hidden="true">{Demo ? <Demo /> : null}</span>
                <span className="tut-tekst">{k.tekst}</span>
              </li>
            );
          })}
        </ol>

        {stopka ? <p className="tut-stopka">{stopka}</p> : null}

        <button type="button" className="hub-btn hub-btn-primary tut-cta" onClick={onStart} autoFocus>
          {cta}
        </button>
        {onZamknij ? (
          <button type="button" className="tut-wroc" onClick={onZamknij}>Wracam do gry</button>
        ) : null}
      </div>
    </div>
  );
}
