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
 * telefonie wygląda inaczej i nigdy nie pasuje do reszty. `emoji` z katalogu
 * zostaje tylko jako zapas dla gry, która nie ma jeszcze swojej ikony.
 *
 * Powód blokady pokazujemy dopiero po dotknięciu kafla, jako krótki komunikat.
 */
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GameIcon } from "../../adventure/components/icons.jsx";
import { useAdventureDane } from "../../adventure/engine/useAdventure.js";
import KATALOG from "../data/minigry.v1.json";
import { gryWZakladce, MISJE, ZDARZENIE_ZMIANY as MISJE_ZMIANA } from "../misjeGier.js";

/**
 * Gry z łańcucha misji (`hub/misjeGier.js`) są ZNALEZISKIEM, nie pozycją
 * w spisie: do zakładki wchodzą dopiero wtedy, gdy dziecko wbiegnie w ich
 * znak na mapie — i zostają w niej na zawsze. Dopóki tego nie zrobi, kafelka
 * nie ma wcale. Zablokowany kafelek z kłódką zdradzałby, że coś istnieje,
 * a cała przyjemność jest w tym, że gra pojawia się znikąd.
 */
const ID_MISJI = new Set(MISJE.map((m) => m.id));

export default function MinigryPanel({ onGra, onZamknij, onKomunikat }) {
  const navigate = useNavigate();
  const { adventure, state } = useAdventureDane();
  // Odkrycie może paść przy otwartej zakładce (znak dotknięty, panel wraca),
  // więc czytamy listę na zdarzenie, a nie tylko przy montowaniu.
  const [odkryte, setOdkryte] = useState(() => gryWZakladce());
  useEffect(() => {
    const odswiez = () => setOdkryte(gryWZakladce());
    window.addEventListener(MISJE_ZMIANA, odswiez);
    return () => window.removeEventListener(MISJE_ZMIANA, odswiez);
  }, []);

  const gry = useMemo(
    () =>
      (KATALOG.gry || [])
        .filter((gra) => !ID_MISJI.has(gra.id) || odkryte.includes(gra.id))
        .map((gra) => ({
          ...gra,
          otwarta: !gra.wymaga || (state.unlocked || []).includes(gra.wymaga),
          kraina: gra.wymaga ? adventure.locations?.[gra.wymaga]?.name || gra.wymaga : null,
        })),
    [adventure, state.unlocked, odkryte]
  );

  function uruchom(gra) {
    if (!gra.otwarta) {
      onKomunikat?.(`${gra.tytul} otworzy się w krainie: ${gra.kraina}`);
      return;
    }
    if (!gra.trasa) {
      onKomunikat?.("Wkrótce");
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
            <span className="hub-tile-in" style={{ background: gra.otwarta ? gra.tlo : undefined }}>
              <span className="hub-tile-ikona">
                {!gra.otwarta ? (
                  <GameIcon name="lock" size={38} />
                ) : gra.ikona ? (
                  <img src={gra.ikona} alt="" aria-hidden="true" draggable="false" />
                ) : (
                  <span className="hub-tile-emoji">{gra.emoji}</span>
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
