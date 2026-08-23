/**
 * CzatPanel — dwa kanały kontaktu z innymi graczami. Treść z
 * `data/czat.mock.json`, zero sieci.
 *
 * UWAGA DLA ZESPOŁU (nie dla dziecka — w interfejsie tego nie piszemy):
 * warstwa danych jeszcze nie istnieje. Ten panel jest atrapą pod decyzję,
 * ale rozkład kanałów jest już docelowy:
 *
 *   FORUM     — wspólny czat wszystkich, którzy teraz grają. NIC poza
 *               rozmową i paskiem pisania: to ekran startowy i ma pokazywać
 *               wiadomości, a nie otoczkę wokół nich.
 *   PRYWATNE  — same rozmowy jeden na jeden: lista → wątek. Tu trafiają
 *               wiadomości bezpośrednie i nic poza nimi. Postaci z gry TU
 *               NIE MA (mówią przez chmurkę Wizkora i misje) — czat jest
 *               miejscem kontaktu z ludźmi.
 * Mentor nie jest kanałem czatu: to realny dorosły, który odpowiada na
 * zadania przez zakładkę Zadania. Pokazywanie tu zamkniętego kafla tworzyło drugą,
 * pozorną drogę do tej samej osoby.
 *
 * UKŁAD (2026-08-20). Ekran wejściowy mówi tym samym językiem co Minigry:
 *   - kanały są dużymi, wyraźnie oddzielonymi kaflami z ikoną i krótkim
 *     statusem. Forum i Prywatne są obok siebie;
 *   - po wybraniu kanału kafle znikają. Zostaje mały nagłówek z powrotem
 *     i właściwa rozmowa, więc wybór nie konkuruje z wiadomościami;
 *   - forum to JEDNA kolumna na całą szerokość. SPISU OBECNYCH NIE MA NIGDZIE
 *     (2026-08-20): najpierw jako pionowa szyna zabierał 92 z 375 px i robił
 *     z rozmowy wąski pasek obok listy ludzi, potem jako zwijany pasek
 *     w Prywatnych — a Prywatne to skrzynka wiadomości bezpośrednich i nic
 *     więcej. Kto jest w grze, widać na mapie;
 *   - strumień to DYMKI, tak samo jak w rozmowie prywatnej: cudze po lewej
 *     z buźką, własne po prawej, bez buźki. Jeden język w obu kanałach
 *     zamiast dwóch różnych rysunków wiadomości;
 *   - strumień przewija się SAM, a pole pisania stoi w nieprzezroczystym pasku
 *     przyklejonym do dołu szuflady. Gotowe zdania wysuwają się z tego paska
 *     dopiero po dotknięciu dymka.
 * Stąd `hub-pane--czat` i `wypelnia` na arkuszu: panel bierze całą wysokość
 * i sam rozdziela ją między strumień a pasek pisania.
 *
 * Świadome decyzje projektowe, których nie cofamy bez powodu:
 * - Dziecko PISZE z klawiatury (decyzja właściciela z 2026-08-20). Gotowe
 *   zdania są SCHOWANE pod przyciskiem z dymkiem przy polu — na ekranie widać
 *   rozmowę, a nie pięć kolorowych podpowiedzi. Szczegóły przy `DolRozmowy`.
 *   UWAGA DLA ZESPOŁU: to przenosi całą moderację na serwer. Wolny tekst na
 *   forum publicznym bez filtra i bez człowieka po drugiej stronie NIE MOŻE
 *   wyjść na produkcję — do zrobienia razem z warstwą danych.
 * - Brak wskaźnika „pisze…" i brak LICZNIKA nieprzeczytanych. Kropka „nowe"
 *   wystarcza; liczba rosnąca w tle jest zaproszeniem do ciągłego wracania.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GameIcon } from "../../adventure/components/icons.jsx";
import IkonaKanalu from "../IkonyCzatu.jsx";
import { oznaczRozmoweCzytana } from "../nowosci.js";
import DANE from "../data/czat.mock.json";

const KANALY = [
  { id: "forum", nazwa: "Forum", opis: "Rozmawiajcie razem", status: "4 osoby" },
  { id: "prywatne", nazwa: "Prywatne", opis: "Wiadomości od znajomych", status: "1 nowa" },
];

/** Dymek z trzema kropkami — znak „gotowe zdania". */
function IkonaPodpowiedzi() {
  return (
    <svg viewBox="0 0 32 32" width="21" height="21" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M6.5 4h19A5.5 5.5 0 0 1 31 9.5v8a5.5 5.5 0 0 1-5.5 5.5H14.6l-6.1 4.1a.9.9 0 0 1-1.4-.8V23h-.6A5.5 5.5 0 0 1 1 17.5v-8A5.5 5.5 0 0 1 6.5 4Z"
      />
      <circle cx="10.4" cy="13.5" r="2.2" fill="#fff" />
      <circle cx="16" cy="13.5" r="2.2" fill="#fff" />
      <circle cx="21.6" cy="13.5" r="2.2" fill="#fff" />
    </svg>
  );
}

/**
 * Dół rozmowy — pole pisania, a gotowe zdania SCHOWANE pod przyciskiem.
 *
 * Wszystko stoi na jednym nieprzezroczystym pasku: to granica między
 * przewijającą się rozmową a tym, co dziecko robi teraz.
 *
 * DLACZEGO SCHOWANE (decyzja właściciela 2026-08-20): pięć gotowych zdań
 * leżących na stałe nad polem to pięć kolorowych przycisków na ekranie, który
 * ma pokazywać rozmowę. Podpowiedź, której nikt nie prosił, przestaje być
 * podpowiedzią i staje się tłem.
 *
 * DLACZEGO NIE USUNIĘTE ZUPEŁNIE: dolna granica wieku to sześć lat. Dziecko,
 * które jeszcze nie pisze na klawiaturze, bez gotowych zdań nie odezwie się
 * w ogóle. Przycisk z dymkiem obok pola zostawia im drogę, nie zaśmiecając
 * ekranu wszystkim pozostałym.
 *
 * Zamykają się same po wybraniu zdania i nie otwierają się, gdy w polu jest
 * już jakiś tekst — dlatego stan tekstu siedzi TUTAJ, a nie w samym polu.
 */
function DolRozmowy({ zdania, onWyslij, placeholder }) {
  const [tekst, setTekst] = useState("");
  const [pokazZdania, setPokazZdania] = useState(false);
  const gotowe = tekst.trim();
  const saZdania = !!zdania?.length;
  const zdaniaWidoczne = saZdania && pokazZdania && !gotowe;

  function wyslij(zdarzenie) {
    zdarzenie.preventDefault();
    if (!gotowe) return;
    onWyslij(gotowe);
    setTekst("");
  }

  function wybierz(zdanie) {
    onWyslij(zdanie);
    setPokazZdania(false);
  }

  return (
    <div className="czat-dol">
      {zdaniaWidoczne ? (
        <div className="czat-skroty">
          {zdania.map((zdanie) => (
            <button key={zdanie} type="button" onClick={() => wybierz(zdanie)}>
              {zdanie}
            </button>
          ))}
        </div>
      ) : null}

      <form className="hub-composer" onSubmit={wyslij}>
        {saZdania ? (
          <button
            type="button"
            className={`czat-podpowiedzi${zdaniaWidoczne ? " is-otwarte" : ""}`}
            onClick={() => setPokazZdania((czy) => !czy)}
            aria-expanded={zdaniaWidoczne}
            aria-label="Gotowe zdania"
            disabled={!!gotowe}
          >
            <IkonaPodpowiedzi />
          </button>
        ) : null}
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

export default function CzatPanel({ onPowrot }) {
  // Ekran startowy jest prostym wyborem miejsca, tak jak siatka Minigier.
  // Dopiero po wybraniu dużego kafla pokazujemy właściwą rozmowę.
  const [kanal, setKanal] = useState(null);
  // Rozmowa otwarta w kanale Prywatne. null = lista rozmów.
  const [rozmowaId, setRozmowaId] = useState(null);
  // Wszystko, co dziecko doda w tej sesji, żyje tylko w pamięci panelu —
  // po zamknięciu huba znika, bo nie ma tego gdzie zapisać.
  const [mojeWpisy, setMojeWpisy] = useState([]);
  const [mojeOdpowiedzi, setMojeOdpowiedzi] = useState({});
  const [brawa, setBrawa] = useState({});
  const feedRef = useRef(null);

  const gracze = DANE.gracze || [];
  const graczById = useMemo(
    () => Object.fromEntries(gracze.map((g) => [g.id, g])),
    [gracze]
  );
  const rozmowy = DANE.prywatne?.rozmowy || [];
  const rozmowa = rozmowy.find((r) => r.id === rozmowaId) || null;
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

  /*
   * POWRÓT SIEDZI W KRZYŻYKU BELKI — tak samo jak w Poradach i w Zadaniu.
   *
   * Czat ma dwa poziomy w głąb (wybór kanału → kanał → wątek w Prywatnych),
   * więc cofa o JEDEN krok naraz: z wątku na listę rozmów, z kanału na wybór
   * kanału, a z samego wyboru (`null`) krzyżyk znów zamyka szufladę. Wcześniej
   * ten sam ruch robił osobny złoty przycisk w nagłówku kanału — dziecko
   * miało wtedy w oknie DWA przyciski cofania, każdy w innym miejscu
   * i o innym wyglądzie.
   */
  const cofnij = useCallback(() => {
    if (kanal === "prywatne" && rozmowaId) { setRozmowaId(null); return; }
    setKanal(null);
    setRozmowaId(null);
  }, [kanal, rozmowaId]);
  useEffect(() => {
    onPowrot?.(kanal ? cofnij : null);
    return () => onPowrot?.(null);
  }, [onPowrot, kanal, cofnij]);

  return (
    <div className="hub-pane hub-pane--czat" data-testid="hub-pane-czat">
      {!kanal ? (
        <div className="czat-wybor" aria-label="Wybierz rodzaj rozmowy">
          <p className="czat-wybor-wstep">Z kim chcesz porozmawiać?</p>
          <div className="czat-kafelki">
            {KANALY.map((k) => {
              const nowe = k.id === "prywatne" && rozmowy.some((r) => r.nowe);
              return (
                <button
                  key={k.id}
                  type="button"
                  className="czat-kafelek"
                  onClick={() => { setKanal(k.id); setRozmowaId(null); }}
                  aria-label={`${k.nazwa}. ${k.opis}. ${k.status}`}
                >
                  <span className="czat-kafelek-ikona" aria-hidden="true">
                    <IkonaKanalu kanal={k.id} size={54} />
                    {nowe ? <b className="czat-kafelek-nowe">1</b> : null}
                  </span>
                  <strong>{k.nazwa}</strong>
                  <small>{k.opis}</small>
                  <span className="czat-kafelek-status">
                    {k.status}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* Belka mówi, GDZIE dziecko jest — a w otwartym wątku to nie jest
           „Prywatne", tylko konkretna osoba. Ma to teraz znaczenie: cofanie
           przeniosło się do krzyżyka arkusza, więc nagłówek został jedynym
           miejscem, z którego widać poziom rozmowy. */
        <div className="czat-kanal-head">
          <span className="czat-kanal-znak" aria-hidden="true">
            {rozmowa
              ? <b className="czat-kanal-avatar">{graczById[rozmowa.ktoId]?.emoji || "🙂"}</b>
              : <IkonaKanalu kanal={kanal} size={28} />}
          </span>
          <strong>
            {rozmowa
              ? (graczById[rozmowa.ktoId]?.imie || "Gracz")
              : KANALY.find((k) => k.id === kanal)?.nazwa}
          </strong>
        </div>
      )}

      {/* ── FORUM: wspólna rozmowa ── */}
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
          {rozmowy.map((r) => {
            const kto = graczById[r.ktoId] || {};
            return (
              <div key={r.id} className={`hub-msg${r.nowe ? " is-unread" : ""}`}>
                {/* Wejście w rozmowę gasi ją na plakietce doku. Pojedynczo,
                    nie hurtem przy otwarciu zakładki: samo zajrzenie do
                    skrzynki nie znaczy, że dziecko przeczytało wiadomość. */}
                <button
                  type="button"
                  className="hub-msg-head"
                  onClick={() => { oznaczRozmoweCzytana(r.id); setRozmowaId(r.id); }}
                >
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
    </div>
  );
}
