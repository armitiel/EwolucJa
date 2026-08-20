/**
 * CzatPanel — trzy kanały jednego miejsca kontaktu. Treść z
 * `data/czat.mock.json`, zero sieci.
 *
 * UWAGA DLA ZESPOŁU (nie dla dziecka — w interfejsie tego nie piszemy):
 * warstwa danych jeszcze nie istnieje. Ten panel jest atrapą pod decyzję,
 * ale rozkład kanałów jest już docelowy:
 *
 *   FORUM     — wspólny czat wszystkich, którzy teraz grają, plus szyna
 *               „kto teraz gra". To ekran startowy: dziecko od razu widzi
 *               ludzi i ich wiadomości, a nie suchą listę zdarzeń.
 *   PRYWATNE  — rozmowy jeden na jeden z innymi dziećmi. Lista rozmów →
 *               wątek. Postaci z gry TU NIE MA (mówią przez chmurkę Wizkora
 *               i misje) — czat jest miejscem kontaktu z ludźmi.
 *   MENTOR    — zablokowany do czasu zgody rodzica.
 *
 * UKŁAD (zmiana z 2026-08-20, decyzja właściciela: „za dużo elementów, które
 * wyglądają jak przyciski"). Panel wygląda teraz jak zwykły komunikator:
 *   - kanały siedzą w NAGŁÓWKU szuflady (portal przez `SlotNaglowka`), a nie
 *     jako trzy duże kafle w treści — wybór miejsca to nie jest treść;
 *   - forum to dwie kolumny: po lewej kto gra, po prawej rozmowa;
 *   - strumień wiadomości przewija się SAM, pole pisania stoi na dole.
 * Stąd `hub-pane--czat` i `wypelnia` na arkuszu: panel bierze całą wysokość
 * i sam rozdziela ją między listę a rozmowę.
 *
 * Świadome decyzje projektowe, których nie cofamy bez powodu:
 * - Dziecko PISZE z klawiatury (decyzja właściciela z 2026-08-20). Gotowe
 *   zdania zostają nad polem jako skróty, nie jako jedyne wyjście.
 *   UWAGA DLA ZESPOŁU: to przenosi całą moderację na serwer. Wolny tekst na
 *   forum publicznym bez filtra i bez człowieka po drugiej stronie NIE MOŻE
 *   wyjść na produkcję — do zrobienia razem z warstwą danych.
 * - Brak wskaźnika „pisze…" i brak LICZNIKA nieprzeczytanych. Kropka „nowe"
 *   wystarcza; liczba rosnąca w tle jest zaproszeniem do ciągłego wracania.
 * - Kanał Mentora jest widoczny, choć zamknięty. Dziecko ma wiedzieć, że
 *   dorosły jest w zasięgu, nawet zanim rodzic to włączy.
 */
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { GameIcon } from "../../adventure/components/icons.jsx";
import { SlotNaglowka } from "../PanelSheet.jsx";
import IkonaKanalu from "../IkonyCzatu.jsx";
import DANE from "../data/czat.mock.json";

const KANALY = [
  { id: "forum", nazwa: "Forum" },
  { id: "prywatne", nazwa: "Prywatne" },
  { id: "mentor", nazwa: "Mentor" },
];

const STATUS_OPIS = { gra: "w grze", misja: "w misji", offline: "poza grą" };

/** Pole do pisania. Enter wysyła, pusty tekst nie idzie nigdzie. */
function Pisanie({ onWyslij, placeholder }) {
  const [tekst, setTekst] = useState("");
  const gotowe = tekst.trim();

  function wyslij(zdarzenie) {
    zdarzenie.preventDefault();
    if (!gotowe) return;
    onWyslij(gotowe);
    setTekst("");
  }

  return (
    <form className="hub-composer" onSubmit={wyslij}>
      <input
        value={tekst}
        onChange={(zdarzenie) => setTekst(zdarzenie.target.value)}
        placeholder={placeholder}
        maxLength={200}
        autoComplete="off"
      />
      <button type="submit" disabled={!gotowe} aria-label="Wyślij">➤</button>
    </form>
  );
}

/** Gotowe zdania — JEDEN pasek przewijany w bok, nie kilka rzędów pigułek. */
function Skroty({ zdania, onWybor }) {
  if (!zdania?.length) return null;
  return (
    <div className="czat-skroty">
      {zdania.map((tekst) => (
        <button key={tekst} type="button" onClick={() => onWybor(tekst)}>{tekst}</button>
      ))}
    </div>
  );
}

export default function CzatPanel() {
  const [kanal, setKanal] = useState("forum");
  // Rozmowa otwarta w kanale Prywatne. null = lista rozmów.
  const [rozmowaId, setRozmowaId] = useState(null);
  // Wszystko, co dziecko doda w tej sesji, żyje tylko w pamięci panelu —
  // po zamknięciu huba znika, bo nie ma tego gdzie zapisać.
  const [mojeWpisy, setMojeWpisy] = useState([]);
  const [mojeOdpowiedzi, setMojeOdpowiedzi] = useState({});
  const [brawa, setBrawa] = useState({});
  const slotNaglowka = useContext(SlotNaglowka);
  const feedRef = useRef(null);

  const gracze = DANE.gracze || [];
  const graczById = useMemo(
    () => Object.fromEntries(gracze.map((g) => [g.id, g])),
    [gracze]
  );
  const rozmowy = DANE.prywatne?.rozmowy || [];
  const rozmowa = rozmowy.find((r) => r.id === rozmowaId) || null;
  const mentorZamkniety = !!DANE.mentor?.zablokowany;

  const wiadomosciForum = useMemo(
    () => [...(DANE.forum?.wiadomosci || []), ...mojeWpisy],
    [mojeWpisy]
  );

  function dodajWpis(tekst) {
    setMojeWpisy((poprz) => [
      ...poprz,
      { id: `moj-${poprz.length}`, kto: "ja", tekst, kiedy: "teraz", brawa: 0 },
    ]);
  }

  function przybij(id) {
    setBrawa((poprz) => (poprz[id] ? poprz : { ...poprz, [id]: 1 }));
  }

  function odpowiedz(tekst) {
    setMojeOdpowiedzi((poprz) => ({
      ...poprz,
      [rozmowaId]: [...(poprz[rozmowaId] || []), tekst],
    }));
  }

  const wiadomosci = useMemo(
    () => [
      ...(rozmowa?.wiadomosci || []),
      ...(mojeOdpowiedzi[rozmowaId] || []).map((tekst) => ({ od: "ja", tekst })),
    ],
    [rozmowa, mojeOdpowiedzi, rozmowaId]
  );

  // Czat otwiera się na NAJNOWSZEJ wiadomości, jak każdy komunikator.
  // Wcześniej strumień był częścią przewijania całego panelu i zaczynał się
  // od najstarszego wpisu — dziecko musiało przewinąć, żeby zobaczyć „teraz".
  // Efekt stoi TUTAJ, po obu `useMemo`, bo czyta ich długości: wyżej byłby
  // odczytem `const` przed inicjalizacją i panel wywalałby się przy montażu.
  useEffect(() => {
    const feed = feedRef.current;
    if (feed) feed.scrollTop = feed.scrollHeight;
  }, [kanal, rozmowaId, wiadomosciForum.length, wiadomosci.length]);

  /** Pasek kanałów. Ląduje w nagłówku szuflady, nie w treści panelu. */
  const zakladki = (
    <nav className="czat-zakladki" role="tablist" aria-label="Kanały czatu">
      {KANALY.map((k) => {
        const zamkniety = k.id === "mentor" && mentorZamkniety;
        return (
          <button
            key={k.id}
            type="button"
            role="tab"
            aria-selected={k.id === kanal}
            className={`czat-zakladka${k.id === kanal ? " is-active" : ""}${zamkniety ? " is-locked" : ""}`}
            onClick={() => { setKanal(k.id); setRozmowaId(null); }}
          >
            <IkonaKanalu kanal={k.id} />
            <span>{k.nazwa}</span>
            {zamkniety ? (
              <i className="czat-zakladka-klodka"><GameIcon name="lock" size={12} /></i>
            ) : null}
            {k.id === "prywatne" && rozmowy.some((r) => r.nowe) ? (
              <i className="czat-kropka" aria-label="nowe wiadomości" />
            ) : null}
          </button>
        );
      })}
    </nav>
  );

  return (
    <div className="hub-pane hub-pane--czat" data-testid="hub-pane-czat">
      {slotNaglowka ? createPortal(zakladki, slotNaglowka) : null}

      {/* ── FORUM: kto teraz gra | wspólny czat ── */}
      {kanal === "forum" ? (
        <div className="czat-forum">
          <aside className="czat-rail">
            <h3 className="czat-rail-tytul">W grze</h3>
            <ul className="czat-rail-lista">
              {gracze.map((g) => (
                <li
                  key={g.id}
                  className={`czat-rail-osoba${g.wStatusie === "offline" ? " is-off" : ""}`}
                  title={g.gdzie || STATUS_OPIS[g.wStatusie]}
                >
                  <span className="czat-avatar" aria-hidden="true">
                    {g.emoji}
                    <i className={`czat-lampka is-${g.wStatusie}`} />
                  </span>
                  <strong>{g.imie}</strong>
                </li>
              ))}
            </ul>
          </aside>

          <div className="czat-rozmowa">
            <div className="czat-feed" ref={feedRef}>
              {wiadomosciForum.map((wpis) => {
                const autor = wpis.kto === "ja" ? DANE.ja : graczById[wpis.kto];
                const licznik = (wpis.brawa || 0) + (brawa[wpis.id] || 0);
                const moja = wpis.kto === "ja";
                return (
                  <div key={wpis.id} className={`czat-wpis${moja ? " is-moja" : ""}`}>
                    <span className="czat-wpis-av" aria-hidden="true">{autor?.emoji || "🙂"}</span>
                    <div className="czat-wpis-tresc">
                      <span className="czat-wpis-kto">{moja ? "Ty" : autor?.imie || "Gracz"}</span>
                      <p>{wpis.tekst}</p>
                      {/* „👏" siedzi POD tekstem, w tej samej kolumnie, i jest
                          znakiem, nie guzikiem: ramka przy każdej wiadomości
                          robiła z rozmowy stos kafelków z przyciskami.
                          Pod własną wiadomością go nie ma — „👏 0" przy swoim
                          wpisie wygląda jak wynik, a nie jak zaproszenie. */}
                      {moja ? null : (
                        <button
                          type="button"
                          className={`czat-brawa${brawa[wpis.id] ? " is-dane" : ""}`}
                          onClick={() => przybij(wpis.id)}
                          aria-label={`Przybij brawo (${licznik})`}
                        >
                          <span aria-hidden="true">👏</span> {licznik}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <Skroty zdania={DANE.forum?.odpowiedzi} onWybor={dodajWpis} />
            <Pisanie onWyslij={dodajWpis} placeholder="Napisz coś do wszystkich…" />
          </div>
        </div>
      ) : null}

      {/* ── PRYWATNE: lista rozmów → wątek ── */}
      {kanal === "prywatne" && !rozmowa ? (
        <div className="czat-lista">
          {rozmowy.map((r) => {
            const kto = graczById[r.ktoId] || {};
            return (
              <div key={r.id} className={`hub-msg${r.nowe ? " is-unread" : ""}`}>
                <button type="button" className="hub-msg-head" onClick={() => setRozmowaId(r.id)}>
                  <span className="hub-msg-av" aria-hidden="true">{kto.emoji || "🙂"}</span>
                  <span className="hub-msg-copy">
                    <strong>{kto.imie || "Gracz"}{r.nowe ? <i className="czat-kropka" /> : null}</strong>
                    <small>{r.zajawka}</small>
                  </span>
                  <GameIcon name="arrow" size={16} />
                </button>
              </div>
            );
          })}
          <p className="hub-note">
            <GameIcon name="lock" size={16} />
            Piszesz tylko z osobami, które grają razem z Tobą.
          </p>
        </div>
      ) : null}

      {kanal === "prywatne" && rozmowa ? (
        <div className="czat-rozmowa czat-rozmowa--watek">
          <button type="button" className="czat-powrot" onClick={() => setRozmowaId(null)}>
            <span aria-hidden="true">←</span> Wszystkie rozmowy
          </button>
          <div className="hub-bubbles czat-feed" ref={feedRef}>
            {wiadomosci.map((wiadomosc, indeks) => (
              <div key={indeks} className={`hub-bubble ${wiadomosc.od === "ja" ? "is-me" : "is-them"}`}>
                {wiadomosc.od === "on" ? (
                  <span className="hub-bubble-who">{graczById[rozmowa.ktoId]?.imie || "Gracz"}</span>
                ) : null}
                {wiadomosc.tekst}
              </div>
            ))}
          </div>

          <Skroty zdania={rozmowa.odpowiedzi} onWybor={odpowiedz} />
          <Pisanie
            onWyslij={odpowiedz}
            placeholder={`Napisz do: ${graczById[rozmowa.ktoId]?.imie || "Gracz"}…`}
          />
        </div>
      ) : null}

      {/* ── MENTOR ── */}
      {kanal === "mentor" ? (
        <div className="hub-empty czat-mentor">
          <GameIcon name="lock" size={34} />
          <h3 className="hub-card-title" style={{ margin: 0 }}>{DANE.mentor?.naglowek}</h3>
          <p>{DANE.mentor?.tekst}</p>
        </div>
      ) : null}
    </div>
  );
}
