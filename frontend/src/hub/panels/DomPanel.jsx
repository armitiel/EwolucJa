/**
 * DomPanel — „Twój pokój". To, co dziecko widzi po wejściu do chatki na mapie.
 *
 * PO CO TO MIEJSCE ISTNIEJE. Cała gra jest o EWOLUCJI: dziecko zbiera monety,
 * gwiazdki, odkrywa gry, dostaje przedmioty do awatara. Do tej pory te rzeczy
 * leżały porozrzucane po zakładkach — monety w HUD-zie, gwiazdki w liczniku,
 * gry w Minigrach — i nigdzie nie było widać CAŁOŚCI. Pokój jest tym jednym
 * miejscem: wchodzisz i widzisz, kim się stałeś.
 *
 * DLACZEGO NIE KOLEJNA LISTA. Zakładki w doku odpowiadają na pytanie „co mogę
 * teraz zrobić". Pokój odpowiada na inne: „co już mam". Dlatego nie ma tu ani
 * jednego przycisku, który coś zaczyna — to jest miejsce do popatrzenia, nie
 * do klikania. Jedyne, co się rusza, to sam bohater.
 *
 * WSZYSTKO Z DANYCH, KTÓRE JUŻ SĄ. Awatar i barwa z przygody, monety z konta
 * plus bonus lokalny, gwiazdki z zadania czarodzieja, trofea ze stanu misji,
 * listki ze śladów Porady dnia. Żadnego nowego zapisu — pokój tylko czyta.
 */
import React, { useEffect, useMemo, useState } from "react";
import { AvatarArt } from "../../adventure/art/characters.jsx";
import { useAdventureDane } from "../../adventure/engine/useAdventure.js";
import { useAppData } from "../../contexts/AppData.jsx";
import { bonusMonet, ZDARZENIE_ZMIANY as MONETY_ZMIANA } from "../../services/monety.js";
import { stanZadania as stanGwiazdek } from "../zadanieGwiazdek.js";
import { stanMisji, ZDARZENIE_ZMIANY as MISJE_ZMIANA } from "../misjeGier.js";
import { czytajSlady, KARTY_DNIA } from "../poradaDnia.js";
import "../styles/dom.css";

export default function DomPanel({ onPowrot }) {
  const { adventure, state } = useAdventureDane();
  const { player } = useAppData();

  const [bonus, setBonus] = useState(() => bonusMonet());
  const [misje, setMisje] = useState(() => stanMisji());
  const [gwiazdki] = useState(() => stanGwiazdek());
  const [slady] = useState(() => czytajSlady());

  // Pokój czyta stan, a stan potrafi zmienić się gdzie indziej (gra nad hubem,
  // druga zakładka). Nasłuch zamiast odpytywania — te same zdarzenia, których
  // słucha HUD.
  useEffect(() => {
    const odswiezMonety = () => setBonus(bonusMonet());
    const odswiezMisje = (e) => setMisje(e?.detail?.misje || stanMisji());
    window.addEventListener(MONETY_ZMIANA, odswiezMonety);
    window.addEventListener(MISJE_ZMIANA, odswiezMisje);
    return () => {
      window.removeEventListener(MONETY_ZMIANA, odswiezMonety);
      window.removeEventListener(MISJE_ZMIANA, odswiezMisje);
    };
  }, []);

  useEffect(() => { onPowrot?.(); }, [onPowrot]);

  const monety = (player?.coins ?? 0) + bonus;

  /* Trofeum = misja ROZLICZONA. Znalezione, ale nierozegrane nie trafia na
     półkę: półka ma mówić „to już zrobiłeś", a nie „to zacząłeś". */
  const trofea = useMemo(() => misje.filter((m) => m.wyplacona), [misje]);
  const wToku = useMemo(() => misje.find((m) => m.aktywna) || null, [misje]);

  const listki = useMemo(
    () => slady.map((s) => KARTY_DNIA.find((k) => k.id === s.id)).filter(Boolean),
    [slady]
  );

  return (
    <div className="hub-pane dom-pane" data-testid="hub-pane-dom">
      {/* Bohater stoi na środku pokoju, w kręgu ciepłego światła z okna. */}
      <div className="dom-bohater">
        <span className="dom-swiatlo" aria-hidden="true" />
        <AvatarArt size={168} color={state.color} grants={state.grants} grantDefs={adventure.grants} />
        <strong className="dom-imie">{player?.name || "Wędrowiec"}</strong>
      </div>

      {/* Trzy liczby, które dziecko zbierało — razem, pierwszy raz w jednym miejscu. */}
      <div className="dom-skarby">
        <span className="dom-skarb">
          <img src="/assets/hub-nav/moneta.png" alt="" aria-hidden="true" draggable="false" />
          <b>{monety}</b>
          <small>monet</small>
        </span>
        <span className="dom-skarb">
          <img src="/star.png" alt="" aria-hidden="true" draggable="false" />
          <b>{gwiazdki.istnieje ? gwiazdki.zebrane : 0}</b>
          <small>gwiazdek</small>
        </span>
        <span className="dom-skarb">
          <img src="/assets/minigry/kafel.png" alt="" aria-hidden="true" draggable="false" />
          <b>{trofea.length}</b>
          <small>{trofea.length === 1 ? "przygoda" : "przygód"}</small>
        </span>
      </div>

      {/* Półka z trofeami — po jednym przedmiocie za każdą domkniętą misję. */}
      <div className="hub-sec-title"><h3>Twoja półka</h3></div>
      {trofea.length === 0 ? (
        <p className="dom-pusto">
          Półka czeka pusta. Pierwsza skończona przygoda coś na niej postawi.
        </p>
      ) : (
        <ul className="dom-polka">
          {trofea.map((m) => (
            <li key={m.id} className="dom-trofeum" title={m.def.tytul}>
              <img src={m.def.ikona} alt="" aria-hidden="true" draggable="false" />
              <span>{m.def.tytul}</span>
            </li>
          ))}
        </ul>
      )}

      {wToku ? (
        <p className="dom-wtoku">
          W drodze: <b>{wToku.def.tytul}</b>
        </p>
      ) : null}

      {/* Listki z ostatnich dni — ślad rytuału, nie seria do pilnowania. */}
      <div className="hub-sec-title"><h3>Ostatnie dni</h3></div>
      {listki.length === 0 ? (
        <p className="dom-pusto">Jeszcze żadnego listka. Zajrzyj do Porady dnia.</p>
      ) : (
        <ul className="dom-listki">
          {listki.map((k, i) => (
            <li key={`${k.id}-${i}`} className="dom-listek" title={k.tytul}>
              <img src={k.ilustracja} alt="" aria-hidden="true" draggable="false" />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
