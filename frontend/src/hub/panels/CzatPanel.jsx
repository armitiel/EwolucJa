/**
 * CzatPanel — trzy kanały jednego miejsca kontaktu. Treść z
 * `data/czat.mock.json`, zero sieci.
 *
 * UWAGA DLA ZESPOŁU (nie dla dziecka — w interfejsie tego nie piszemy):
 * warstwa danych jeszcze nie istnieje. Ten panel jest atrapą pod decyzję,
 * ale rozkład kanałów jest już docelowy:
 *
 *   FORUM     — wspólny czat wszystkich, którzy teraz grają. NIC poza
 *               rozmową i paskiem pisania: to ekran startowy i ma pokazywać
 *               wiadomości, a nie otoczkę wokół nich.
 *   PRYWATNE  — ludzie. Na górze „kto teraz gra", pod spodem lista rozmów →
 *               wątek. Postaci z gry TU NIE MA (mówią przez chmurkę Wizkora
 *               i misje) — czat jest miejscem kontaktu z ludźmi.
 *   MENTOR    — zablokowany do czasu zgody rodzica.
 *
 * UKŁAD (2026-08-20, druga tura). Panel wygląda jak zwykły komunikator:
 *   - kanały to PAS POD BELKĄ TYTUŁOWĄ, na całą szerokość szuflady (portal
 *     przez `SlotNaglowka`). Nie trzy kafle w treści i nie wkładka wciśnięta
 *     w ciemną belkę — wybór miejsca to nawigacja, nie treść i nie ozdoba;
 *   - forum to JEDNA kolumna na całą szerokość, bez spisu obecnych. Pionowa
 *     szyna z awatarami zabierała 92 z 375 px i robiła z rozmowy wąski pasek
 *     obok listy ludzi; lista przeniosła się do zakładki Prywatne;
 *   - strumień to DYMKI, tak samo jak w rozmowie prywatnej: cudze po lewej
 *     z buźką, własne po prawej, bez buźki. Jeden język w obu kanałach
 *     zamiast dwóch różnych rysunków wiadomości;
 *   - strumień przewija się SAM, a gotowe zdania i pole pisania stoją razem
 *     w jednym nieprzezroczystym pasku przyklejonym do dołu szuflady.
 * Stąd `hub-pane--czat` i `wypelnia` na arkuszu: panel bierze całą wysokość
 * i sam rozdziela ją między strumień a pasek pisania.
 *
 * Świadome decyzje projektowe, których nie cofamy bez powodu:
 * - Dziecko PISZE z klawiatury (decyzja właściciela z 2026-08-20). Gotowe
 *   zdania zostają nad polem jako skróty, nie jako jedyne wyjście, i CHOWAJĄ
 *   SIĘ, gdy tylko dziecko zacznie pisać — skrót przestaje być skrótem
 *   w chwili, w której ktoś układa własne zdanie.
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

/**
 * Polska odmiana po liczbie. „4 osoby grają" i „5 osób gra" to nie jest
 * detal — pasek czyta dziecko, które uczy się języka, i błędna forma
 * w interfejsie jest widoczna od razu.
 */
function opisObecnych(ile) {
  if (ile === 1) return "1 osoba teraz gra";
  const koncowka = ile % 10;
  const setka = ile % 100;
  const mnoga = koncowka >= 2 && koncowka <= 4 && (setka < 12 || setka > 14);
  return mnoga ? `${ile} osoby teraz grają` : `${ile} osób teraz gra`;
}

/**
 * Pasek obecnych — kto teraz gra.
 *
 * NIE MA GO NA FORUM (decyzja właściciela 2026-08-20: „na głównej zakładce
 * czatu nie muszą być widoczni aktywni gracze"). Forum to rozmowa i nic poza
 * rozmową. Lista obecnych mieszka w zakładce PRYWATNE, bo tam jest do czegoś
 * potrzebna: to zakładka od pisania do konkretnej osoby, więc „kto jest teraz
 * pod ręką" odpowiada na pytanie, które dziecko właśnie sobie zadaje.
 *
 * Zwinięty pokazuje TYLKO liczbę i nakładające się buźki. Rozwinięty daje
 * imiona i miejsca. Osoby poza grą są dopiero w rozwinięciu — w zwiniętym
 * pasku „kto teraz gra" nie ma miejsca na tych, których nie ma.
 */
function Obecni({ gracze, domyslnieOtwarte = false }) {
  const [rozwiniete, setRozwiniete] = useState(domyslnieOtwarte);
  const wGrze = gracze.filter((g) => g.wStatusie !== "offline");
  if (!gracze.length) return null;

  return (
    <div className={`czat-obecni${rozwiniete ? " is-otwarte" : ""}`}>
      <button
        type="button"
        className="czat-obecni-pasek"
        onClick={() => setRozwiniete((czy) => !czy)}
        aria-expanded={rozwiniete}
      >
        <span className="czat-obecni-buzki" aria-hidden="true">
          {wGrze.slice(0, 4).map((g) => (
            <i key={g.id}>{g.emoji}</i>
          ))}
        </span>
        <span className="czat-obecni-opis">{opisObecnych(wGrze.length)}</span>
        <span className="czat-obecni-strzalka" aria-hidden="true">▾</span>
      </button>

      {rozwiniete ? (
        <ul className="czat-obecni-lista">
          {gracze.map((g) => (
            <li key={g.id} className={g.wStatusie === "offline" ? "is-off" : ""}>
              <span className="czat-avatar" aria-hidden="true">
                {g.emoji}
                <i className={`czat-lampka is-${g.wStatusie}`} />
              </span>
              <strong>{g.imie}</strong>
              <small>{g.gdzie || STATUS_OPIS[g.wStatusie]}</small>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

/**
 * Dół rozmowy — gotowe zdania i pole pisania w JEDNYM pasku.
 *
 * Razem, bo razem stoją na nieprzezroczystym tle: pasek jest granicą między
 * przewijającą się rozmową a tym, co dziecko robi teraz. Osobno wyglądały
 * jak dwie warstwy pływające nad pergaminem.
 *
 * Skróty znikają, gdy w polu jest choć jeden znak — dlatego stan tekstu
 * siedzi TUTAJ, a nie w samym polu.
 */
function DolRozmowy({ zdania, onWyslij, placeholder }) {
  const [tekst, setTekst] = useState("");
  const gotowe = tekst.trim();

  function wyslij(zdarzenie) {
    zdarzenie.preventDefault();
    if (!gotowe) return;
    onWyslij(gotowe);
    setTekst("");
  }

  return (
    <div className="czat-dol">
      {zdania?.length && !gotowe ? (
        <div className="czat-skroty">
          {zdania.map((zdanie) => (
            <button key={zdanie} type="button" onClick={() => onWyslij(zdanie)}>
              {zdanie}
            </button>
          ))}
        </div>
      ) : null}

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

      {/* ── FORUM: zwijany pasek obecnych nad wspólną rozmową ── */}
      {kanal === "forum" ? (
        <div className="czat-rozmowa czat-rozmowa--forum">
          {/* Na forum nie ma NIC poza rozmową i paskiem pisania — ani spisu
              obecnych, ani nagłówka sekcji. Wszystko, co tu wcześniej stało,
              konkurowało o uwagę z jedyną treścią tego ekranu. */}
          <div className="czat-feed" ref={feedRef}>
            {wiadomosciForum.map((wpis) => {
              const autor = wpis.kto === "ja" ? DANE.ja : graczById[wpis.kto];
              const licznik = (wpis.brawa || 0) + (brawa[wpis.id] || 0);
              const moja = wpis.kto === "ja";
              return (
                <div key={wpis.id} className={`czat-wpis${moja ? " is-moja" : ""}`}>
                  {/* Przy własnej wiadomości buźki nie ma: dymek po prawej
                      stronie już mówi, kto to napisał, a druga buźka tylko
                      zabierałaby szerokość tekstowi. */}
                  {moja ? null : (
                    <span className="czat-wpis-av" aria-hidden="true">{autor?.emoji || "🙂"}</span>
                  )}
                  <div className="czat-wpis-tresc">
                    {/* Imię i „👏" w JEDNYM wierszu nad tekstem. Brawa stały
                        wcześniej osobną linijką pod wiadomością i kosztowały
                        24 px na każdy dymek — na telefonie 320×568 to była
                        różnica między półtorej a dwiema i pół wiadomości na
                        ekranie. Sam znak zostaje bez ramki i bez tła: własna
                        ramka przy każdej wiadomości robiła z rozmowy stos
                        kafelków z przyciskami.
                        Przy własnym wpisie nie ma ani imienia, ani braw —
                        „👏 0" pod swoją wiadomością wygląda jak wynik,
                        a nie jak zaproszenie. */}
                    {moja ? null : (
                      <span className="czat-wpis-meta">
                        <span className="czat-wpis-kto">{autor?.imie || "Gracz"}</span>
                        <button
                          type="button"
                          className={`czat-brawa${brawa[wpis.id] ? " is-dane" : ""}`}
                          onClick={() => przybij(wpis.id)}
                          aria-label={`Przybij brawo (${licznik})`}
                        >
                          <span aria-hidden="true">👏</span> {licznik}
                        </button>
                      </span>
                    )}
                    <p>{wpis.tekst}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <DolRozmowy
            zdania={DANE.forum?.odpowiedzi}
            onWyslij={dodajWpis}
            placeholder="Napisz coś do wszystkich…"
          />
        </div>
      ) : null}

      {/* ── PRYWATNE: lista rozmów → wątek ── */}
      {kanal === "prywatne" && !rozmowa ? (
        <div className="czat-lista">
          {/* Rozwinięty od razu: dziecko weszło do zakładki „z kim porozmawiać",
              więc odpowiedź na to pytanie ma być na wierzchu, a nie za
              kliknięciem. Zwinąć nadal można. */}
          <Obecni gracze={gracze} domyslnieOtwarte />

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

          <DolRozmowy
            zdania={rozmowa.odpowiedzi}
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
