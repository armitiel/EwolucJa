/**
 * CzatPanel — rozmowa z postacią. Treść z `data/czat.mock.json`, zero sieci.
 *
 * UWAGA DLA ZESPOŁU (nie dla dziecka — w interfejsie tego nie piszemy):
 * warstwa danych jeszcze nie istnieje. Do decyzji zostaje, czy to ma być
 * rozmowa z POSTACIĄ (dialogi z pliku albo AI, bez kontaktu z ludźmi), czy
 * dwustronny czat DZIECKO ↔ MENTOR — a to znaczy nowa tabela, moderacja
 * i zgoda rodzica.
 *
 * Świadome decyzje projektowe: brak klawiatury (odpowiedzi z listy), brak
 * wskaźnika „pisze…", brak licznika nieodebranych — nic, co popycha do
 * ciągłego wracania.
 */
import React, { useMemo, useState } from "react";
import { GameIcon } from "../../adventure/components/icons.jsx";
import DANE from "../data/czat.mock.json";

export default function CzatPanel() {
  const watki = DANE.watki || [];
  const [aktywnyId, setAktywnyId] = useState(watki.find((w) => !w.zablokowany)?.id || null);
  // Odpowiedzi wybrane przez dziecko, per wątek. Trzymamy je tylko w pamięci
  // panelu — po zamknięciu huba znikają, bo nie ma ich gdzie zapisać.
  const [moje, setMoje] = useState({});
  const aktywny = watki.find((w) => w.id === aktywnyId) || null;

  const wiadomosci = useMemo(
    () => [...(aktywny?.wiadomosci || []), ...(moje[aktywnyId] || []).map((tekst) => ({ od: "ja", tekst }))],
    [aktywny, moje, aktywnyId]
  );

  function odpowiedz(tekst) {
    setMoje((poprz) => ({ ...poprz, [aktywnyId]: [...(poprz[aktywnyId] || []), tekst] }));
  }

  return (
    <div className="hub-pane" data-testid="hub-pane-czat">
      <div className="hub-tabs">
        {watki.map((watek) => (
          <button
            key={watek.id}
            type="button"
            className={`hub-tab${watek.id === aktywnyId ? " is-active" : ""}${watek.zablokowany ? " is-locked" : ""}`}
            onClick={() => { if (!watek.zablokowany) setAktywnyId(watek.id); }}
          >
            <span aria-hidden="true">{watek.emoji}</span> {watek.kto}
            {watek.zablokowany ? <GameIcon name="lock" size={15} /> : null}
          </button>
        ))}
      </div>

      {aktywny ? (
        <>
          <div className="hub-bubbles">
            {wiadomosci.map((wiadomosc, indeks) => (
              <div key={indeks} className={`hub-bubble ${wiadomosc.od === "ja" ? "is-me" : "is-them"}`}>
                {wiadomosc.od === "on" ? <span className="hub-bubble-who">{aktywny.kto}</span> : null}
                {wiadomosc.tekst}
              </div>
            ))}
          </div>

          <div className="hub-replies">
            {aktywny.odpowiedzi.map((tekst) => (
              <button key={tekst} type="button" onClick={() => odpowiedz(tekst)}>
                {tekst}
              </button>
            ))}
          </div>

          <div className="hub-composer" aria-hidden="true">
            <input placeholder="Wybierz odpowiedź powyżej" disabled />
            <button type="button" disabled>➤</button>
          </div>
        </>
      ) : null}
    </div>
  );
}
