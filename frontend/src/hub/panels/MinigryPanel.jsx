/**
 * MinigryPanel — biblioteka minigier.
 *
 * Odblokowania NIE mają własnej listy: liczą się z `state.unlocked` przygody,
 * więc biblioteka nie może pokazać czegoś, czego nie ma na mapie.
 *
 * Kafel mówi tylko dwie rzeczy: JAKA to gra i ile daje monet — i obie mówi
 * obrazkiem. Nazwa gry z kafla zeszła: dziecko w wieku 6-12 lat wybiera
 * wzrokiem, a pięć podpisów pod pięcioma ikonami to pięć rzeczy do
 * przeczytania, zanim zacznie się zabawa. Nazwa i tak czeka na ekranie startu
 * gry, gdzie ma miejsce i sens.
 *
 * Ikony są PLIKAMI, nie emoji. Emoji rysuje system operacyjny — na każdym
 * telefonie wygląda inaczej i nigdy nie pasuje do reszty. Wszystkie siedzą na
 * jednej wspólnej płytce (`assets/minigry/kafel.png`), więc pięć gier obok
 * siebie ma jeden rytm, a różni je tylko ilustracja.
 *
 * Powód blokady pokazujemy dopiero po dotknięciu kafla, jako krótki komunikat.
 *
 * JEDNO ZADANIE NA RAZ (2026-09-14). Kiedy trwa etap puzzli którejś gry,
 * pozostałe gry łańcucha są w skrzyni WIDOCZNE, ale zgaszone — dotknięcie
 * mówi, co dziecko ma teraz do zrobienia, zamiast otwierać partię obok
 * niedokończonego zbierania. Kafel zostaje na wierzchu (a nie znika),
 * bo zdobytej gry się nie zabiera: ma być widać, że czeka.
 */
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GameIcon } from "../../adventure/components/icons.jsx";
import { useAdventureDane } from "../../adventure/engine/useAdventure.js";
import KATALOG from "../data/minigry.v1.json";
import { gryWZakladce, misjaOdblokowywana, MISJE, ZDARZENIE_ZMIANY as MISJE_ZMIANA } from "../misjeGier.js";
import { ZDARZENIE_ZMIANY as PUZZLE_ZMIANA } from "../puzzleGier.js";
import { oznaczMinigryObejrzane } from "../nowosci.js";

/**
 * Gry z łańcucha misji (`hub/misjeGier.js`) są ZDOBYCZĄ, nie pozycją
 * w spisie: do zakładki wchodzą dopiero wtedy, gdy dziecko ułoży ich
 * układankę — i zostają w niej na zawsze. Dopóki tego nie zrobi, kafelka
 * nie ma wcale. Zablokowany kafelek z kłódką zdradzałby, że coś istnieje,
 * a cała przyjemność jest w tym, że gra pojawia się znikąd.
 */
const ID_MISJI = new Set(MISJE.map((m) => m.id));

export default function MinigryPanel({ onGra, onZamknij, onKomunikat }) {
  const navigate = useNavigate();
  const { state } = useAdventureDane();
  // Odkrycie może paść przy otwartej zakładce (znak dotknięty, panel wraca),
  // więc czytamy listę na zdarzenie, a nie tylko przy montowaniu.
  const [odkryte, setOdkryte] = useState(() => gryWZakladce());
  /* Gra, którą dziecko właśnie odblokowuje (etap puzzli) albo `null`.
     Nasłuch na OBA zdarzenia: start zbierania i ułożenie obrazka ogłasza
     moduł puzzli, a zlecenie i rozliczenie — moduł misji. */
  const [teraz, setTeraz] = useState(() => misjaOdblokowywana());
  useEffect(() => {
    const odswiez = () => {
      setOdkryte(gryWZakladce());
      setTeraz(misjaOdblokowywana());
    };
    window.addEventListener(MISJE_ZMIANA, odswiez);
    window.addEventListener(PUZZLE_ZMIANA, odswiez);
    return () => {
      window.removeEventListener(MISJE_ZMIANA, odswiez);
      window.removeEventListener(PUZZLE_ZMIANA, odswiez);
    };
  }, []);

  /**
   * Zielona kropka na doku gaśnie, gdy dziecko TU zajrzy. Zależność od
   * `odkryte` jest celowa: jeśli gra wejdzie do zakładki przy otwartym
   * panelu, jest od razu obejrzana — kropka po zamknięciu zapaliłaby się
   * wtedy dla czegoś, co dziecko właśnie widziało na ekranie.
   */
  useEffect(() => { oznaczMinigryObejrzane(); }, [odkryte]);

  const gry = useMemo(
    () =>
      (KATALOG.gry || [])
        .filter((gra) => !ID_MISJI.has(gra.id) || odkryte.includes(gra.id))
        .map((gra) => ({
          ...gra,
          // Gra bez trasy jeszcze nie istnieje - i ma tak wygladac. Wczesniej
          // liczylo sie samo odblokowanie, wiec kafel zapalal sie na
          // pelny kolor, a dotkniecie konczylo sie suchym "Wkrotce". Kafel
          // obiecywal cos, czego nie ma.
          otwarta:
            Boolean(gra.trasa) &&
            (!gra.wymaga || (state.unlocked || []).includes(gra.wymaga)) &&
            !(teraz && ID_MISJI.has(gra.id) && gra.id !== teraz.id),
          /* Po co osobna flaga, skoro `otwarta` już jest fałszem: komunikat
             po dotknięciu ma powiedzieć CO ROBIĆ TERAZ, a nie „otworzy się
             później". To dwa różne powody blokady i dwa różne zdania. */
          wstrzymana: Boolean(teraz && ID_MISJI.has(gra.id) && gra.id !== teraz.id),
        })),
    [state.unlocked, odkryte, teraz]
  );

  function uruchom(gra) {
    if (!gra.trasa) {
      onKomunikat?.(`${gra.tytul} jeszcze powstaje`);
      return;
    }
    if (gra.wstrzymana) {
      onKomunikat?.(`Najpierw ułóż obrazek: ${teraz?.def?.tytul || "trwające zadanie"}`);
      return;
    }
    if (!gra.otwarta) {
      onKomunikat?.(`${gra.tytul} otworzy się później`);
      return;
    }
    // Zakładki NIE zamykamy. Gra rysuje się nad hubem, a otwarta zakładka pod
    // nią jest tym, do czego dziecko wraca po wyjściu — wcześniej hub trzeba
    // było w tym momencie zbudować od nowa, razem ze sceną 3D.
    if (onGra) { onGra(gra); return; }
    // Bez `onGra` (gra otwierana spoza huba) zostaje stara droga.
    onZamknij?.();
    navigate(gra.trasa);
  }

  return (
    <div className="hub-pane" data-testid="hub-pane-gry">
      <div className="hub-grid">
        {gry.map((gra) => (
          <button
            key={gra.id}
            type="button"
            className={`hub-tile${gra.otwarta ? "" : " is-locked"}`}
            onClick={() => uruchom(gra)}
            aria-label={`${gra.tytul}, ${gra.monety} monet`}
            data-testid={`hub-gra-${gra.id}`}
          >
            {/* Wspolne tlo dla wszystkich gier: kazdy kafel mial wczesniej
                wlasny gradient z katalogu i piec roznych kolorow obok siebie
                bilo sie z piecioma ikonami. Kolor niesie teraz jedna rzecz -
                czy gra jest otwarta - a rozroznia je ilustracja. */}
            <span className="hub-tile-in">
              <span className="hub-tile-ikona">
                {/* Gra WSTRZYMANA pokazuje swoją ikonę, nie kłódkę: kłódka
                    znaczy „jeszcze nie twoje", a ta gra jest już zdobyta —
                    tylko czeka na swoją kolej. Różnicę niesie samo
                    przygaszenie kafla (`is-locked` w `hub.css`). */}
                {(gra.otwarta || gra.wstrzymana) && gra.ikona ? (
                  <img src={gra.ikona} alt="" aria-hidden="true" draggable="false" />
                ) : (
                  <GameIcon name="lock" size={38} />
                )}
              </span>
              <span className="hub-coin hub-coin--duza">
                <img src="/assets/hub-nav/moneta.png" alt="" aria-hidden="true" draggable="false" />
                +{gra.monety}
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
