/**
 * CzatPanel — ATRAPA. Wygląd i przepływ, zero sieci.
 *
 * Panel istnieje po to, żeby dało się ocenić dwa warianty, zanim powstanie backend:
 *  – rozmowa z POSTACIĄ: dialogi z danych albo AI, bez kontaktu z ludźmi,
 *  – czat DZIECKO ↔ MENTOR: nowa tabela, moderacja, zgoda rodzica, RODO.
 *
 * Świadome decyzje projektowe w atrapie: brak klawiatury (odpowiedzi z listy),
 * brak wskaźnika „pisze…", brak licznika nieodebranych — nic, co popycha do
 * ciągłego wracania.
 */
import React, { useState } from "react";
import { GameIcon } from "../../adventure/components/icons.jsx";
import DANE from "../data/czat.mock.json";

export default function CzatPanel({ onKomunikat }) {
  const watki = DANE.watki || [];
  const [aktywnyId, setAktywnyId] = useState(watki.find((w) => !w.zablokowany)?.id || null);
  const aktywny = watki.find((w) => w.id === aktywnyId) || null;

  return (
    <div className="hub-pane" data-testid="hub-pane-czat">
      <p className="hub-note hub-note-warn">
        <GameIcon name="hourglass" size={18} />
        <span>
          <b>Atrapa UI.</b> Nic nie wychodzi w sieć. Do decyzji: rozmowa z <b>postacią</b> (dialogi z danych albo AI,
          bez kontaktu z ludźmi) czy dwustronny czat <b>dziecko ↔ Mentor</b> — tabela, moderacja i zgoda rodzica.
        </span>
      </p>

      <div className="hub-tabs">
        {watki.map((watek) => (
          <button
            key={watek.id}
            type="button"
            className={`hub-tab${watek.id === aktywnyId ? " is-active" : ""}${watek.zablokowany ? " is-locked" : ""}`}
            onClick={() =>
              watek.zablokowany
                ? onKomunikat?.("Czat z Mentorem — decyzja jeszcze nie podjęta")
                : setAktywnyId(watek.id)
            }
          >
            <span aria-hidden="true">{watek.emoji}</span> {watek.kto}
            {watek.zablokowany ? <GameIcon name="lock" size={15} /> : null}
          </button>
        ))}
      </div>

      {aktywny ? (
        <>
          <div className="hub-bubbles">
            {aktywny.wiadomosci.map((wiadomosc, indeks) => (
              <div key={indeks} className={`hub-bubble ${wiadomosc.od === "ja" ? "is-me" : "is-them"}`}>
                {wiadomosc.od === "on" ? <span className="hub-bubble-who">{aktywny.kto}</span> : null}
                {wiadomosc.tekst}
              </div>
            ))}
          </div>

          <div className="hub-replies">
            {aktywny.odpowiedzi.map((odpowiedz) => (
              <button key={odpowiedz} type="button" onClick={() => onKomunikat?.("Odpowiedź z listy — atrapa")}>
                {odpowiedz}
              </button>
            ))}
          </div>

          <div className="hub-composer" aria-hidden="true">
            <input placeholder="Pisanie wyłączone w atrapie…" disabled />
            <button type="button" disabled>➤</button>
          </div>
        </>
      ) : null}
    </div>
  );
}
