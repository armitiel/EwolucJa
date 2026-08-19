/**
 * DevRezyserka — pulpit testowy świata. Skraca do jednego kliknięcia rzeczy,
 * które inaczej trwają: dziesięć gwiazdek, czekanie na Wizkora (pojawia się
 * co ~95 s), bieganie w poszukiwaniu znaku, rozgrywanie partii do końca.
 *
 * NIE JEST CZĘŚCIĄ GRY. Wchodzi tylko przy włączonym trybie dev
 * (`services/dev.js`), więc na ekranie dziecka nie istnieje — także wtedy,
 * gdy ktoś zajrzy do zbudowanej paczki na produkcji.
 *
 * ZASADA: pulpit nie ma własnej logiki stanu. Każdy przycisk woła DOKŁADNIE
 * tę samą funkcję, co gra (`zadanieGwiazdek`, `misjeGier`, API sceny), a po
 * niej `onZmiana()`. Gdyby skróty szły własną drogą — wpisywały do
 * localStorage po swojemu — testowałyby siebie, a nie grę.
 *
 * OŚ ETAPÓW na górze (`etapyMisji.js`) jest tu najważniejsza. Grupy niżej to
 * pojedyncze przełączniki i da się nimi ustawić stan, którego gra nigdy by
 * nie wyprodukowała — piórko zlecone przed rozliczeniem karty wygląda potem
 * dokładnie jak „Wizkor gubi kolejność misji". Oś ma jeden punkt naraz,
 * odbudowuje oba zapisy od zera i pokazuje wprost, którą kwestię Wizkor
 * wybierze — więc rozjazd widać, zanim się do niego podejdzie.
 */
import React, { useState } from "react";
import {
  CEL_DOMYSLNY,
  dolicz as doliczGwiazdke,
  NAGRODA_MONET,
  odbierzNagrode as odbierzGwiazdki,
  rozpocznijZadanie as rozpocznijGwiazdki,
  skasujZadanie as skasujGwiazdki,
  stanZadania as stanGwiazdek,
} from "./zadanieGwiazdek.js";
import {
  aktualnaMisja,
  MISJE,
  odbierzNagrode as odbierzNagrodeMisji,
  odkryj,
  skasujMisje,
  stanMisji,
  ujawnij,
  zaliczWygrana,
} from "./misjeGier.js";
import {
  ETAPY,
  etapBiezacy,
  przesunEtap,
  zastosujEtap,
  zlamanaKolejnosc,
} from "./etapyMisji.js";
import { powitanieCzarodzieja, ZNAK_CZARODZIEJA } from "./kwestieWizkora.js";
import { pokazZnakNaMapie } from "./znakiMapy.js";
import { bonusMonet, dodajMonety, wyzerujBonus } from "../services/monety.js";
import { czyLokalnie } from "../services/dev.js";
import { WSKAZOWKI, czyPoznana, zresetujWskazowki } from "./wskazowki.js";

/**
 * Pozycja znaku w świecie. Bierzemy ją z ŻYWEGO obiektu sceny, nie z
 * `mapa.json`: czarodziej wędruje po liście `pozycje`, więc plik powiedziałby,
 * gdzie stał na początku, a nie gdzie stoi teraz.
 */
function pozycjaZnaku(scena, znak) {
  const m = (scena?._app?.markers || []).find((z) => z && z.id === znak);
  const p = m?.root?.position;
  return p ? { x: p.x, z: p.z } : null;
}

function Grupa({ tytul, children }) {
  return (
    <div className="dev-grupa">
      <h3>{tytul}</h3>
      <div className="dev-rzad">{children}</div>
    </div>
  );
}

function Guzik({ children, onClick, ton = "" }) {
  return (
    <button type="button" className={`dev-guzik ${ton}`} onClick={onClick}>
      {children}
    </button>
  );
}

export default function DevRezyserka({
  scenaRef, onZmiana, onOtworzGre, onKomunikat, onPokazWskazowke, onWylacz, zdarzenia = [],
}) {
  const [otwarty, setOtwarty] = useState(false);
  const [, przerysuj] = useState(0);

  const odswiez = (info) => {
    przerysuj((n) => n + 1);
    onZmiana?.();
    if (info) onKomunikat?.(info);
  };

  const gwiazdki = stanGwiazdek();
  const misje = stanMisji();
  const scena = () => scenaRef?.current || null;

  /* ── oś etapów ────────────────────────────────────────────────────── */
  // Numer etapu i kwestia Wizkora czytane są przy KAŻDYM rysowaniu pulpitu,
  // ze świeżego zapisu. Trzymane w stanie komponentu rozjeżdżałyby się
  // z rzeczywistością przy pierwszej zmianie zrobionej gdzie indziej —
  // w grze, w konsoli, w drugiej zakładce.
  const nrEtapu = etapBiezacy();
  const etap = ETAPY[nrEtapu] || null;
  const rozjazd = zlamanaKolejnosc();
  // TA SAMA funkcja, z której korzysta świat (`hub/kwestieWizkora.js`).
  // Gdyby pulpit liczył kwestię po swojemu, pokazywałby, co POWINNO się
  // zdarzyć, zamiast tego, co się zdarzy.
  const kwestia = powitanieCzarodzieja(gwiazdki, aktualnaMisja());
  const oczekiwana = etap ? etap.akcja || null : null;
  const zgodne = (kwestia.akcja || null) === oczekiwana;

  function naEtap(nr) {
    const wybrany = zastosujEtap(nr);
    odswiez(`DEV: etap ${nr + 1}/${ETAPY.length} — ${wybrany?.tytul || "?"}`);
  }

  function krok(o) {
    const wybrany = przesunEtap(o);
    odswiez(`DEV: ${wybrany?.tytul || "koniec osi"}`);
  }

  // Naprawa polega na ustawieniu TEGO SAMEGO etapu jeszcze raz: łańcuch
  // odbudowuje się od zera, więc wszystko, co wyprzedziło swoją kolej,
  // wraca na swoje miejsce.
  function naprawKolejnosc() {
    zastosujEtap(nrEtapu);
    odswiez("DEV: kolejność odtworzona");
  }

  // Okno Wizkora bez szukania go na mapie. `odswiez` NIE leci po tym
  // wywołaniu — zamknęłoby okno w tej samej chwili, w której je otwieramy.
  function pokazOknoWizkora() {
    if (!window.popupPostaci?.pokaz) { onKomunikat?.("DEV: świat jeszcze nie gotowy"); return; }
    window.popupPostaci.pokaz();
    przerysuj((n) => n + 1);
  }

  /* ── gwiazdki ─────────────────────────────────────────────────────── */
  function gwiazdkiKomplet() {
    rozpocznijGwiazdki(CEL_DOMYSLNY);
    // Pętla przez `dolicz`, a nie wpis „zebrane: 10" na skróty — to ta sama
    // droga, którą idą gwiazdki zbierane w trawie.
    for (let i = 0; i < CEL_DOMYSLNY; i += 1) doliczGwiazdke();
    odswiez("DEV: gwiazdki 10/10");
  }

  function gwiazdkiPoNagrodzie() {
    gwiazdkiKomplet();
    odbierzGwiazdki(NAGRODA_MONET);
    odswiez("DEV: gwiazdki rozliczone");
  }

  /* ── stany zbiorcze ───────────────────────────────────────────────── */
  function swiezyStart() {
    skasujGwiazdki();
    skasujMisje();
    wyzerujBonus();
    odswiez("DEV: świeży start");
  }

  function wszystkoOdkryte() {
    gwiazdkiPoNagrodzie();
    for (const def of MISJE) { ujawnij(def.id); odkryj(def.id); }
    odswiez("DEV: wszystkie gry odkryte");
  }

  function wszystkoRozliczone() {
    wszystkoOdkryte();
    for (const def of MISJE) { zaliczWygrana(def.id); odbierzNagrodeMisji(def.id); }
    odswiez("DEV: łańcuch skończony");
  }

  /* ── świat ────────────────────────────────────────────────────────── */
  function przywolajWizkora() {
    const s = scena();
    if (!s) return;
    pokazZnakNaMapie(s, ZNAK_CZARODZIEJA);
    const p = pozycjaZnaku(s, ZNAK_CZARODZIEJA);
    // Stajemy OBOK, nie na nim: wejście dokładnie w środek znaku bywa
    // liczone jako dotknięcie, więc okno wchodziłoby samo z siebie.
    if (p) s.ustawBohatera?.(p.x + 1.6, p.z + 1.6);
    odswiez("DEV: Wizkor na polanie");
  }

  function skoczDoZnaku(znak) {
    const s = scena();
    if (!s) return;
    pokazZnakNaMapie(s, znak);
    const p = pozycjaZnaku(s, znak);
    if (p) s.ustawBohatera?.(p.x + 1.4, p.z + 1.4);
    odswiez(`DEV: skok do „${znak}"`);
  }

  function szybkiPowrotZnakow() {
    const s = scena();
    if (!s) return;
    for (const def of MISJE) s.ustawPowrotZnaku?.(def.znak, 0.6);
    s.ustawPowrotZnaku?.(ZNAK_CZARODZIEJA, 3);
    odswiez("DEV: znaki wracają szybciej");
  }

  /* ── gry ──────────────────────────────────────────────────────────── */
  function wygrajOtwartaGre() {
    const uchwyt = window.__devGra;
    if (!uchwyt?.wygraj) { onKomunikat?.("DEV: żadna gra nie jest otwarta"); return; }
    uchwyt.wygraj();
    odswiez(`DEV: wygrana w „${uchwyt.id}"`);
  }

  if (!otwarty) {
    return (
      <>
        <style>{STYL}</style>
        <button
          type="button"
          className="dev-pinezka"
          onClick={() => setOtwarty(true)}
          title="Pulpit testowy (Ctrl+Shift+D chowa i przywraca)"
        >
          DEV
        </button>
      </>
    );
  }

  return (
    <>
      <style>{STYL}</style>
      <aside className="dev-panel" data-testid="dev-rezyserka">
        <header>
          <strong>Pulpit testowy</strong>
          <button type="button" className="dev-x" onClick={() => setOtwarty(false)} aria-label="Zamknij">×</button>
        </header>

        <div className="dev-tresc">
          {/* OŚ ETAPÓW stoi pierwsza, bo to jedyne miejsce, w którym widać CAŁĄ
              kolejność naraz. Grupy niżej ruszają pojedynczymi przełącznikami
              i to właśnie nimi da się zrobić stan, którego gra sama nigdy by
              nie wyprodukowała — a potem wygląda to jak jej błąd. */}
          <div className="dev-grupa dev-os">
            <h3>Etap {nrEtapu + 1} z {ETAPY.length}</h3>
            <div className="dev-rzad">
              <Guzik onClick={() => krok(-1)}>◀</Guzik>
              <select
                className="dev-wybor"
                value={nrEtapu}
                onChange={(e) => naEtap(Number(e.target.value))}
              >
                {ETAPY.map((e, i) => (
                  <option key={e.id} value={i}>{`${i + 1}. ${e.tytul}`}</option>
                ))}
              </select>
              <Guzik onClick={() => krok(1)}>▶</Guzik>
            </div>
            <p className="dev-opis">{etap?.opis}</p>
            {/* Kwestia Wizkora WPROST na pulpicie: bez tego jedynym sposobem
                sprawdzenia, o której misji mówi, było podejście do niego. */}
            <p className="dev-kwestia">
              <b>Wizkor powie:</b> „{kwestia.tekst}"
              <br />
              <span className="dev-akcja">[{kwestia.przycisk}]</span>{" "}
              <code>{String(kwestia.akcja)}</code>
            </p>
            {zgodne ? null : (
              <p className="dev-alarm">
                Rozjazd: etap oczekuje <code>{String(oczekiwana)}</code>, a Wizkor
                wybrał <code>{String(kwestia.akcja)}</code>.
              </p>
            )}
            {rozjazd ? <p className="dev-alarm">Kolejność złamana: {rozjazd}</p> : null}
            <div className="dev-rzad">
              <Guzik onClick={pokazOknoWizkora}>Pokaż okno Wizkora</Guzik>
              <Guzik onClick={przywolajWizkora}>Przywołaj na polanę</Guzik>
              {rozjazd || !zgodne ? (
                <Guzik ton="mocny" onClick={naprawKolejnosc}>Napraw kolejność</Guzik>
              ) : null}
            </div>
          </div>

          <Grupa tytul="Skróty stanu">
            <Guzik ton="mocny" onClick={swiezyStart}>Świeży start</Guzik>
            <Guzik onClick={gwiazdkiPoNagrodzie}>Po gwiazdkach</Guzik>
            <Guzik onClick={wszystkoOdkryte}>Wszystko odkryte</Guzik>
            <Guzik onClick={wszystkoRozliczone}>Wszystko rozliczone</Guzik>
          </Grupa>

          <Grupa tytul={`Gwiazdki — ${gwiazdki.istnieje ? `${gwiazdki.zebrane}/${gwiazdki.cel}` : "brak zadania"}${gwiazdki.wyplacone ? " (rozliczone)" : ""}`}>
            <Guzik onClick={() => { rozpocznijGwiazdki(CEL_DOMYSLNY); odswiez("DEV: zadanie gwiazdek"); }}>Zleć</Guzik>
            <Guzik onClick={() => { doliczGwiazdke(); odswiez(); }}>+1</Guzik>
            <Guzik onClick={gwiazdkiKomplet}>Komplet</Guzik>
            <Guzik onClick={() => { odbierzGwiazdki(NAGRODA_MONET); odswiez("DEV: nagroda wypłacona"); }}>Wypłać</Guzik>
            <Guzik onClick={() => { skasujGwiazdki(); odswiez("DEV: gwiazdki skasowane"); }}>Reset</Guzik>
          </Grupa>

          {misje.map((m) => (
            <Grupa
              key={m.id}
              tytul={`${m.def.tytul} — ${
                m.wyplacona ? "rozliczona"
                : m.wygrana ? "wygrana, do wypłaty"
                : m.znaleziona ? "znaleziona"
                : m.ujawniona ? "zlecona, do znalezienia"
                : "ukryta"
              }`}
            >
              <Guzik onClick={() => { ujawnij(m.id); odswiez(`DEV: zlecona ${m.def.tytul}`); }}>Zleć</Guzik>
              <Guzik onClick={() => { odkryj(m.id); odswiez(`DEV: znaleziona ${m.def.tytul}`); }}>Znajdź</Guzik>
              <Guzik onClick={() => { zaliczWygrana(m.id); odswiez(`DEV: zaliczona ${m.def.tytul}`); }}>Zalicz partię</Guzik>
              <Guzik onClick={() => { odbierzNagrodeMisji(m.id); odswiez(`DEV: +${m.def.nagroda} monet`); }}>Wypłać</Guzik>
              <Guzik onClick={() => skoczDoZnaku(m.def.znak)}>Skocz do znaku</Guzik>
              <Guzik onClick={() => onOtworzGre?.(m.id)}>Otwórz grę</Guzik>
            </Grupa>
          ))}

          <Grupa tytul="Świat">
            <Guzik onClick={przywolajWizkora}>Przywołaj Wizkora</Guzik>
            <Guzik onClick={szybkiPowrotZnakow}>Szybszy powrót znaków</Guzik>
            <Guzik onClick={wygrajOtwartaGre}>Wygraj otwartą grę</Guzik>
          </Grupa>

          {/* ZDARZENIA ŚWIATA — okna i ekrany, które normalnie przychodzą same
              i rzadko. Katalog przychodzi z huba (`zdarzeniaDev` w `Swiat.jsx`),
              bo to hub wie, co potrafi się w nim wydarzyć; pulpit tylko rysuje
              przyciski, więc dołożenie nowego okna nie wymaga zmiany tutaj.

              Grupy budujemy z samych pozycji, w kolejności ich pojawienia —
              osobna lista nazw grup byłaby drugim miejscem do aktualizowania. */}
          {[...new Set(zdarzenia.map((z) => z.grupa))].map((grupa) => (
            <Grupa key={grupa} tytul={grupa}>
              {zdarzenia
                .filter((z) => z.grupa === grupa)
                .map((z) => (
                  <Guzik
                    key={`${grupa}:${z.etykieta}`}
                    onClick={() => { setOtwarty(false); z.odpal(); }}
                  >
                    {z.etykieta}
                  </Guzik>
                ))}
            </Grupa>
          ))}

          <Grupa tytul="Wskazówki (chmurki)">
            {WSKAZOWKI.map((w) => (
              <Guzik key={w.id} onClick={() => { setOtwarty(false); onPokazWskazowke?.(w.id); }}>
                {`Pokaż: ${w.tytul}${czyPoznana(w.id) ? " ✓" : ""}`}
              </Guzik>
            ))}
            <Guzik onClick={() => { zresetujWskazowki(); odswiez("DEV: wskazówki od nowa"); }}>
              Reset pamięci
            </Guzik>
          </Grupa>

          <Grupa tytul={`Monety — bonus ${bonusMonet()}`}>
            <Guzik onClick={() => { dodajMonety(100, "dev"); odswiez(); }}>+100</Guzik>
            <Guzik onClick={() => { wyzerujBonus(); odswiez("DEV: bonus wyzerowany"); }}>Zeruj</Guzik>
          </Grupa>

          <Grupa tytul="Narzędzie">
            <Guzik onClick={() => window.location.reload()}>Przeładuj</Guzik>
            <Guzik ton="mocny" onClick={() => onWylacz?.()}>Wyłącz DEV</Guzik>
          </Grupa>

          <p className="dev-stopka">
            {czyLokalnie()
              ? "Lokalnie pulpit jest włączony domyślnie. Ctrl+Shift+D chowa go i przywraca — bez przeładowania."
              : "Na publikacji pulpit nie włącza się sam. Wejście awaryjne: ?dev=1 w adresie, bez zapamiętywania."}
          </p>
        </div>
      </aside>
    </>
  );
}

/* Style trzymam W KOMPONENCIE, a nie w `hub.css`: to narzędzie ma nie zostawiać
   śladu w arkuszu, z którego żyje HUD dziecka. Przy usuwaniu pulpitu znika
   jeden plik i nie trzeba niczego wycinać z CSS-a. */
const STYL = `
.dev-pinezka {
  position: fixed; left: 8px; top: 50%; transform: translateY(-50%);
  z-index: 90; padding: 7px 6px; border: 0; border-radius: 8px;
  background: rgba(24, 20, 40, .82); color: #ffd76b;
  font: 800 11px/1 system-ui, sans-serif; letter-spacing: .08em;
  writing-mode: vertical-rl; cursor: pointer;
}
.dev-panel {
  position: fixed; left: 0; top: 0; bottom: 0; z-index: 95;
  width: min(330px, 88vw); display: flex; flex-direction: column;
  background: rgba(18, 16, 30, .95); color: #f3efe4;
  font: 13px/1.35 system-ui, sans-serif;
  box-shadow: 4px 0 22px rgba(0, 0, 0, .45);
}
.dev-panel header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 12px; border-bottom: 1px solid rgba(255, 255, 255, .12);
}
.dev-x { border: 0; background: transparent; color: #f3efe4; font-size: 22px; line-height: 1; cursor: pointer; }
.dev-tresc { overflow-y: auto; padding: 10px 12px 22px; }
.dev-grupa { margin-bottom: 12px; }
.dev-grupa h3 { margin: 0 0 5px; font-size: 11px; font-weight: 700; letter-spacing: .03em; color: #b9b2d6; text-transform: uppercase; }
.dev-rzad { display: flex; flex-wrap: wrap; gap: 5px; }
.dev-guzik {
  padding: 6px 9px; border: 1px solid rgba(255, 255, 255, .18); border-radius: 7px;
  background: rgba(255, 255, 255, .07); color: #f3efe4;
  font: 600 12px/1 system-ui, sans-serif; cursor: pointer;
}
.dev-guzik:hover { background: rgba(255, 255, 255, .16); }
.dev-guzik.mocny { border-color: #ffb35c; color: #ffd76b; }
.dev-os {
  padding: 8px 9px 9px; margin-bottom: 14px; border-radius: 9px;
  background: rgba(255, 255, 255, .05); border: 1px solid rgba(255, 255, 255, .14);
}
.dev-os h3 { color: #ffd76b; }
.dev-wybor {
  flex: 1 1 150px; min-width: 0; padding: 6px 7px; border-radius: 7px;
  border: 1px solid rgba(255, 255, 255, .18);
  background: rgba(255, 255, 255, .07); color: #f3efe4;
  font: 600 12px/1 system-ui, sans-serif;
}
.dev-wybor option { background: #1a1730; color: #f3efe4; }
.dev-opis { margin: 7px 0 0; font-size: 11.5px; line-height: 1.35; color: #b9b2d6; }
.dev-kwestia { margin: 7px 0 0; font-size: 11.5px; line-height: 1.4; color: #ded8f0; }
.dev-kwestia b { color: #9b95b8; font-weight: 700; }
.dev-akcja { color: #7fd6a5; font-weight: 700; }
.dev-kwestia code, .dev-alarm code {
  background: rgba(255, 255, 255, .1); padding: 1px 4px; border-radius: 4px; font-size: 11px;
}
/* Alarm jest POMARAŃCZOWY, nie czerwony: to informacja z pulpitu testowego,
   a nie awaria gry — czerwień w tym panelu ma zostać zarezerwowana dla rzeczy,
   które naprawdę się wywaliły. */
.dev-alarm {
  margin: 7px 0 0; padding: 6px 8px; border-radius: 7px;
  background: rgba(255, 179, 92, .14); border: 1px solid rgba(255, 179, 92, .45);
  color: #ffcf9a; font-size: 11.5px; line-height: 1.4;
}
.dev-stopka { margin: 4px 0 0; font-size: 11px; color: #9b95b8; }
.dev-stopka code { background: rgba(255, 255, 255, .1); padding: 1px 4px; border-radius: 4px; }
`;
