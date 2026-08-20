/**
 * ProfilPanel — awatar, imię, monety i mocne strony. Nic więcej.
 *
 * ZDJĘTE 2026-08-20 (decyzja właściciela): sekcja „Mapa", sekcja „Ekwipunek"
 * i licznik iskier. Wszystkie trzy opisywały tor `/przygoda` (dane
 * z `mapa-iskier.v1.json`), a nie to, w co dziecko realnie gra — świat 3D.
 * Lista czterech krain mówiła o innej mapie niż ta na ekranie, ekwipunek
 * u większości dzieci świecił „Jeszcze pusto", a licznik iskier stał na zerze.
 * Profil pokazujący same zera uczy, że nie warto tu zaglądać.
 *
 * Gdyby tor przygody wrócił do głównej pętli, te sekcje warto odtworzyć —
 * kod usunięty, ale dane (`state.grants`, `state.iskry`, `adventure.locations`)
 * nadal istnieją i nikt ich nie ruszał.
 *
 * WYGLĄD: ten sam język, co zakładka Minigry — kafle na kremowym papierze
 * ze złotym obrysem i pigułką liczby (`.hub-tile-in`, `.hub-coin`). Profil
 * i biblioteka gier leżą obok siebie w doku, więc dwa różne style robiły
 * wrażenie dwóch różnych aplikacji.
 *
 * Panel jest celowo ubogi w słowa: kafel mówi nazwę cechy i liczbę, bez
 * podpisów powtarzających to, co widać po pasku.
 */
import React, { useMemo } from "react";
import { AvatarArt } from "../../adventure/art/characters.jsx";
import { TRAIT_LABELS } from "../../adventure/engine/adventureState.js";
import { useAdventureDane } from "../../adventure/engine/useAdventure.js";
import { useAppData } from "../../contexts/AppData.jsx";

export default function ProfilPanel() {
  const { adventure, state } = useAdventureDane();
  const { player } = useAppData();

  const cechy = useMemo(
    () => Object.entries(state.traits || {}).sort((a, b) => b[1] - a[1]),
    [state.traits]
  );
  const maks = Math.max(1, ...cechy.map(([, v]) => v));

  return (
    <div className="hub-pane" data-testid="hub-pane-profil">
      {/* Kafel bohatera — ta sama płytka, co pod ikonami gier, tylko szersza. */}
      <div className="profil-kafel">
        <span className="profil-awatar" style={{ "--hub-avatar-color": state.color }}>
          <AvatarArt size={132} color={state.color} grants={state.grants} grantDefs={adventure.grants} />
        </span>
        <strong className="profil-imie">{player?.name || "Wędrowiec bez imienia"}</strong>
        <span className="hub-coin hub-coin--duza">
          <img src="/assets/hub-nav/moneta.png" alt="" aria-hidden="true" draggable="false" />
          {player?.coins ?? 0}
        </span>
      </div>

      <div className="hub-sec-title">
        <h3>Mocne strony</h3>
      </div>

      {cechy.length === 0 ? (
        <div className="hub-tile-in profil-cecha profil-cecha--pusta">
          <span className="hub-muted">Jeszcze nic — pierwszy wybór zostawi ślad.</span>
        </div>
      ) : (
        <div className="hub-grid">
          {cechy.map(([klucz, wartosc]) => (
            <div className="hub-tile" key={klucz}>
              <span className="hub-tile-in profil-cecha">
                <strong>{TRAIT_LABELS[klucz] || klucz}</strong>
                <span className="profil-pasek">
                  <i style={{ width: `${Math.round((wartosc / maks) * 100)}%`, background: state.color }} />
                </span>
                <span className="hub-coin">{wartosc}</span>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
