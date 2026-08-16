/**
 * Swiat — hub 3D, GŁÓWNY ekran dziecka. Scena z `public/scena-3d/` jest tu
 * tłem trwałym, a nie stroną: montuje się raz i żyje, dopóki dziecko nie
 * wyjdzie z huba. Panele jej nie odmontowują — pauzują ją, żeby nie kręciła
 * się (i nie zjadała baterii) pod otwartym arkuszem.
 *
 * HUD jest WSPÓLNY z podglądem `/scena-3d/`: te same klasy (`game-hud-*`)
 * i ten sam arkusz (`useHudSkin`). Podgląd jest miejscem, gdzie HUD się
 * projektuje; aplikacja go tylko wypełnia danymi. Nie dubluj tu stylów —
 * poprawki idą do `public/scena-3d/hud.css`.
 *
 * Bez WebGL-a hub NIE przestaje działać: scena zamienia się w statyczne tło,
 * a wszystkie sekcje zostają dostępne.
 */
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Scena3D, { webglDostepny } from "../components/Scena3D.jsx";
import HubDock from "../hub/HubDock.jsx";
import PanelSheet from "../hub/PanelSheet.jsx";
import MessageScroll from "../hub/MessageScroll.jsx";
import PodpowiedzMedrca from "../hub/PodpowiedzMedrca.jsx";
import PopupPostaci from "../hub/PopupPostaci.jsx";
import useHudSkin from "../hub/useHudSkin.js";
import { useHubPanel } from "../hub/useHubPanel.js";
import MinigryPanel from "../hub/panels/MinigryPanel.jsx";
import ProfilPanel from "../hub/panels/ProfilPanel.jsx";
import CzatPanel from "../hub/panels/CzatPanel.jsx";
import PoradaPanel from "../hub/panels/PoradaPanel.jsx";
import { GameIcon } from "../adventure/components/icons.jsx";
import { unreadCount } from "../adventure/engine/notifications.js";
import { useAppData } from "../contexts/AppData.jsx";
import { api, session } from "../services/api.js";
import bgMusic from "../services/bgMusic.js";
import { fx } from "../services/soundFx.js";
import kolejkaStartu from "../services/kolejkaStartu.js";
import { awatarPostaci } from "../utils/postac.js";
import "../adventure/styles/adventure.css";
import "../hub/styles/hub.css";

// Cel monetowy pokazywany paskiem w HUD. Trzymany tutaj, a nie w bazie, bo
// dopóki ekonomia się ustala, to liczba do strojenia, nie ustawienie gracza.
const CEL_MONET = 100;

/**
 * Znaki w scenie ↔ panele huba.
 *
 * PUSTA MAPA JEST CELOWA. Znaki na mapie są teraz zbieractwem: dziecko wbiega
 * w złoty listek, listek znika z wybuchem iskier i po chwili odrasta. Otwarcie
 * panelu w tym momencie przerywałoby bieg — a bieg jest tu całą przyjemnością.
 * Sekcje otwiera się dokiem na dole.
 *
 * Mechanizm zostaje gotowy: wystarczy dopisać `{ id_znaku: "nazwa_panelu" }`,
 * żeby wybrany znak znów coś otwierał. Uwaga na identyfikatory — złote listki
 * mają id `zloto-1`…`zloto-9`, a `lisc` to tylko nazwa pliku GLB (na tej
 * pomyłce już raz straciliśmy wieczór).
 */
const ZNAK_PANELU = {};

/**
 * Powitanie postaci. Docelowo odpali je spotkanie w świecie („lisek podszedł
 * do czarodzieja") — ten wyzwalacz przychodzi osobno, razem z postacią na
 * mapie. Do tego czasu treść siedzi tutaj jako jeden obiekt, żeby wyzwalacz
 * miał co podać, a okno dało się obejrzeć:
 *
 *   window.popupPostaci.pokaz()                     — otwórz teraz
 *   window.popupPostaci.pokaz({ imie: "Ktoś" })     — podmień pola
 *   window.popupPostaci.schowaj()
 *   /swiat?popup=1                                  — otwarte od razu po wejściu
 */
const POWITANIE_WIZCOR = {
  imie: "Wizcor",
  obrazek: "/wizPop.webp",
  tekst:
    "Witaj, mały wędrowcze! Jestem Wizcor, strażnik Lasu Szeptów. " +
    "Zbierz dla mnie 10 złotych gwiazdek, a otworzę przed tobą pierwszą bramę.",
  wyroznienie: "10 złotych gwiazdek",
  przycisk: "Ruszam po gwiazdki!",
};

// Sam tytuł sekcji, bez nadtytułu. Nadtytuł powtarzał innymi słowami to, co
// mówi już przycisk w doku — dziecko czytało dwie linijki zamiast jednej.
const NAGLOWKI = {
  gry: "Minigry",
  profil: "Twój profil",
  czat: "Czat",
  porada: "Porada dnia",
};

export default function Swiat() {
  const navigate = useNavigate();
  const { panel, otworz, zamknij, przelacz } = useHubPanel();
  const { player } = useAppData();
  useHudSkin();

  const scenaRef = useRef(null);
  const [scenaMartwa, setScenaMartwa] = useState(() => !webglDostepny());
  // Scena wchodzi przejściem dopiero gdy naprawdę ma co pokazać (zdarzenie
  // „gotowa" z modułu). Do tego czasu widać spokojne tło huba, a nie puste
  // płótno WebGL, które przeskakuje w jasny las.
  const [scenaGotowa, setScenaGotowa] = useState(false);
  // Kurtyna z chmur żyje w `index.html` (musi zakryć też czas ładowania
  // bundla). Jeśli jej nie ma — bo dziecko weszło tu przejściem z innego
  // ekranu, a nie przeładowaniem — HUD pokazujemy od razu.
  const [odsloniete, setOdsloniete] = useState(
    () => typeof window === "undefined" || typeof window.__rozsunChmury !== "function"
  );
  // Powitanie postaci: `null` = zamknięte, obiekt = treść okna.
  const [powitanie, setPowitanie] = useState(null);
  const [komunikat, setKomunikat] = useState(null);
  const [nieprzeczytane, setNieprzeczytane] = useState(0);
  // Podpowiedź sterowania pokazujemy do pierwszego dotknięcia i nigdy więcej —
  // dziecko, które już wie, jak chodzić, nie potrzebuje przypomnienia co wejście.
  const [pokazPodpowiedz, setPokazPodpowiedz] = useState(() => {
    try { return localStorage.getItem("ewolucja.hub.chodzenie") !== "1"; } catch { return true; }
  });

  // Bezpiecznik: gdyby moduł kiedyś przestał wysyłać „gotowa" (inna wersja
  // sceny, cichy błąd), scena zostałaby przezroczysta na zawsze. Po 6 s
  // pokazujemy ją bez pytania — lepiej jeden przeskok niż czarny ekran.
  useEffect(() => {
    if (scenaGotowa || scenaMartwa) return undefined;
    const t = window.setTimeout(() => setScenaGotowa(true), 6000);
    return () => window.clearTimeout(t);
  }, [scenaGotowa, scenaMartwa]);

  // Świat jest gotowy (albo wiadomo, że nie będzie) → rozsuwamy chmury,
  // a HUD wpuszczamy dopiero po ich zejściu.
  useEffect(() => {
    if (odsloniete || !(scenaGotowa || scenaMartwa)) return undefined;
    const rozsun = window.__rozsunChmury;
    if (typeof rozsun !== "function") { setOdsloniete(true); return undefined; }
    rozsun(() => setOdsloniete(true));
    return undefined;
  }, [scenaGotowa, scenaMartwa, odsloniete]);

  useEffect(() => {
    if (!pokazPodpowiedz) return undefined;
    const schowaj = () => {
      setPokazPodpowiedz(false);
      try { localStorage.setItem("ewolucja.hub.chodzenie", "1"); } catch {}
    };
    window.addEventListener("pointerdown", schowaj, { once: true });
    return () => window.removeEventListener("pointerdown", schowaj);
  }, [pokazPodpowiedz]);

  // Wiadomości mają własną formę (zwój), więc nie wchodzą do arkusza sekcji.
  const zwojOtwarty = panel === "wiadomosci";
  const naglowek = zwojOtwarty ? null : NAGLOWKI[panel] || null;

  /* ── licznik nieprzeczytanych: świat + Mentor ─────────────────────────── */
  const przeliczNieprzeczytane = useCallback(async () => {
    let suma = 0;
    try { suma += unreadCount(); } catch {}
    const pid = session.getPlayer();
    if (pid) {
      try {
        const dane = await api.getAllHints(pid);
        suma += (dane?.hints || []).filter((h) => !h.viewed_at).length;
      } catch {
        // Brak sieci = tylko licznik świata. Skrzynka i tak działa offline.
      }
    }
    setNieprzeczytane(suma);
  }, []);

  useEffect(() => { przeliczNieprzeczytane(); }, [przeliczNieprzeczytane]);
  useEffect(() => { if (!panel) przeliczNieprzeczytane(); }, [panel, przeliczNieprzeczytane]);

  /* ── komunikaty (krótkie, bez modali) ────────────────────────────────── */
  const pokazKomunikat = useCallback((tekst) => {
    setKomunikat(tekst);
    window.clearTimeout(pokazKomunikat._t);
    pokazKomunikat._t = window.setTimeout(() => setKomunikat(null), 2200);
  }, []);
  useEffect(() => () => window.clearTimeout(pokazKomunikat._t), [pokazKomunikat]);

  /* ── powitanie postaci (na razie bez wyzwalacza w świecie) ───────────── */
  // Uchwyt do konsoli i adres `?popup=1` — inaczej okna nie da się obejrzeć,
  // dopóki nie powstanie spotkanie z postacią na mapie.
  useEffect(() => {
    const pokaz = (nadpisz) => setPowitanie({ ...POWITANIE_WIZCOR, ...(nadpisz || {}) });
    window.popupPostaci = { pokaz, schowaj: () => setPowitanie(null) };
    try {
      if (new URLSearchParams(window.location.search).get("popup") === "1") pokaz();
    } catch {}
    return () => { delete window.popupPostaci; };
  }, []);

  /* ── scena reaguje na panele ─────────────────────────────────────────── */
  // Powitanie zatrzymuje świat tak samo jak szuflada: postać mówi, a lisek
  // w tle biegłby dalej pod kartą — razem z dźwiękiem kroków.
  useEffect(() => {
    const scena = scenaRef.current;
    if (scena) {
      if (panel || powitanie) scena.pauza?.();
      else scena.wznow?.();
    }
  }, [panel, powitanie]);

  useEffect(() => { if (powitanie) fx.krokiStop(); }, [powitanie]);

  const naZdarzenieSceny = useCallback(
    (nazwa, dane) => {
      if (nazwa === "gotowa") {
        // Znaki wracają SAME, po swoim czasie z definicji (3,2 s). Wcześniej
        // wstrzymywaliśmy powrót do zamknięcia panelu (`ustawPowrotZnaku(…, false)`)
        // i to było źródłem szarpania: znak wracał dokładnie w chwili, gdy
        // bohater wciąż na nim stał, więc od razu wchłaniał się znowu.
        // Teraz cykl jest jeden: powiększenie → zanik → chwila przerwy → powrót,
        // a przed natychmiastowym powtórzeniem chroni `armed` w module — znak
        // uzbraja się dopiero, gdy bohater odejdzie dalej niż 1,7 jednostki.
        if (panel) scenaRef.current?.pauza?.();
        setScenaGotowa(true);
        return;
      }
      // `minigra:start` = znak wchłonięty (dotknięty palcem albo wejściem
      // bohatera), `znak:dotkniety` = znak bez wchłaniania. Oba prowadzą do
      // panelu, więc obsługujemy je tą samą ścieżką.
      if (nazwa === "minigra:start" || nazwa === "znak:dotkniety") {
        fx.gentleMagical(0.55);
        const doOtwarcia = ZNAK_PANELU[dane?.znak];
        if (doOtwarcia) otworz(doOtwarcia);
        return;
      }
      if (nazwa === "blad") setScenaMartwa(true);
    },
    [otworz, panel]
  );

  /* ── doładowanie dźwięków pod kurtyną z chmur ────────────────────────── */
  /**
   * Kolejka rusza w chwili, gdy scena zgłosi „gotowa" — czyli DOKŁADNIE wtedy,
   * gdy modele są już pobrane, a chmury dopiero zaczynają się rozsuwać.
   * To najtańsze okno w całym starcie: pasmo jest wolne, główny wątek prawie
   * bezczynny (rozsuwanie chmur to transformacje CSS na kompozytorze), a
   * dziecko i tak nie może jeszcze grać. Zanim kurtyna zejdzie, kroki
   * (12 KB) i brzdęk połknięcia (70 KB) są na miejscu.
   *
   * Wcześniej te pliki — i jeszcze 385 KB ambientu, którego hub w ogóle nie
   * używa — leciały RÓWNOLEGLE z modelami, bo `soundFx` pobierał wszystko
   * przy imporcie modułu.
   */
  useEffect(() => {
    kolejkaStartu.dodaj("kroki", () => fx.przygotuj("kroki"), { priorytet: 1 });
    kolejkaStartu.dodaj("polkniecie", () => fx.przygotuj("gentleMagical"), { priorytet: 2 });
  }, []);

  useEffect(() => {
    if (scenaGotowa || scenaMartwa) kolejkaStartu.ruszaj();
  }, [scenaGotowa, scenaMartwa]);

  /* ── kroki ───────────────────────────────────────────────────────────── */
  // Moduł sceny nie emituje zdarzenia „stawiam krok", więc odpytujemy go
  // 8 razy na sekundę o stan ruchu.
  //
  // Sterujemy PRĘDKOŚCIĄ, a nie nazwą klipu animacji — i to jest poprawka
  // błędu, nie kosmetyka. Nazwa klipu potrafi zostać na „walk" po zatrzymaniu
  // (klip dobiega swoje, sekwencje w rodzaju „happy" wchodzą po swojemu),
  // więc dźwięk zapętlał się przy stojącej postaci. Prędkość jest liczbą
  // i zeruje się natychmiast — nie da się jej źle zinterpretować.
  useEffect(() => {
    if (!scenaGotowa || scenaMartwa) return undefined;
    // Bieg z HISTEREZĄ i na tych samych progach co animacja w module sceny
    // (`e > 1.46` przy wchodzeniu w bieg, `e > 1.37` przy wychodzeniu).
    // Wcześniej dźwięk miał własny, jeden próg 2,2: między 1,46 a 2,2 lis
    // wizualnie biegł, a brzmiał jakby szedł, a przy drążku trzymanym równo
    // w okolicy progu tempo przeskakiwało kilka razy na sekundę.
    let bieg = false;
    const t = window.setInterval(() => {
      const stan = scenaRef.current?.stan?.();
      const v = stan && !stan.pauza ? stan.predkosc ?? 0 : 0;
      // Próg 0,08 zamiast zera: przy dobieganiu do celu prędkość schodzi
      // asymptotycznie i szczątkowy ruch trzymałby dźwięk w nieskończoność.
      if (v > 0.08) {
        bieg = bieg ? v > 1.37 : v > 1.46;
        fx.krokiGraj({ bieg });
      } else {
        bieg = false;
        fx.krokiStop();
      }
    }, 125);
    return () => { window.clearInterval(t); fx.krokiStop(); };
  }, [scenaGotowa, scenaMartwa]);

  // Panel zasłania świat i pauzuje scenę — kroki muszą ucichnąć razem z nią,
  // inaczej dudnią pod otwartym arkuszem.
  useEffect(() => { if (panel) fx.krokiStop(); }, [panel]);

  // Karta w tle: przeglądarka wstrzymuje pętlę renderowania, ale nie audio —
  // bez tego kroki zostają słyszalne po przełączeniu zakładki.
  useEffect(() => {
    const naZmiane = () => { if (document.hidden) fx.krokiStop(); };
    document.addEventListener("visibilitychange", naZmiane);
    return () => document.removeEventListener("visibilitychange", naZmiane);
  }, []);

  /* ── muzyka krainy ───────────────────────────────────────────────────── */
  // bgMusic ma własny localStorage i bywa przełączany spoza tego ekranu
  // (DevTools, inne widoki), więc stan czytamy przy montowaniu i co sekundę
  // dosynchronizowujemy — inaczej ikona kłamałaby po powrocie do huba.
  const [muzykaGra, setMuzykaGra] = useState(() => bgMusic.isEnabled());
  useEffect(() => {
    const t = window.setInterval(() => {
      const teraz = bgMusic.isEnabled();
      setMuzykaGra((poprzednio) => (poprzednio === teraz ? poprzednio : teraz));
    }, 1000);
    return () => window.clearInterval(t);
  }, []);
  const przelaczMuzyke = useCallback(() => {
    setMuzykaGra(bgMusic.toggle());
  }, []);

  const monety = player?.coins ?? 0;
  // Pasek nie przepełnia się powyżej celu — po przekroczeniu 100 zostaje pełny
  // i świeci, zamiast wychodzić poza kafelek.
  const postepMonet = Math.max(0, Math.min(100, (monety / CEL_MONET) * 100));

  return (
    <main className="hub-root" data-testid="hub-swiat">
      {scenaMartwa ? (
        <div className="hub-scena hub-scena-zastepcza">
          <img src="/assets/adventure-v2/harbor-arrival.png" alt="" aria-hidden="true" />
          <div className="hub-scena-info">
            <GameIcon name="compass" size={26} />
            {/* Bez przycisku „Otwórz Mapę Iskier": plaska mapa zostala usunieta,
                a jej adres przekierowuje tutaj — przycisk zawracalby na ten sam
                ekran. Zamiast slepego wyjscia zostaje uczciwa informacja, bo
                HUD, zakladki i zadania dzialaja pod spodem normalnie. */}
            <p>
              Ta przeglądarka nie rysuje sceny 3D — zostaje nieruchomy widok świata.
              Zakładki na dole, zadania i wiadomości działają normalnie.
            </p>
          </div>
        </div>
      ) : (
        <Scena3D
          apiRef={scenaRef}
          onZdarzenie={naZdarzenieSceny}
          onBlad={() => setScenaMartwa(true)}
          className={`hub-scena${scenaGotowa ? " is-ready" : ""}`}
        />
      )}

      {/* `naglowek`, a nie `panel`: zwój wiadomości nie jest szufladą i sam
          przykrywa ekran pergaminem — mocniejszy podkład pod dokiem robiłby
          tam drugie, konkurencyjne tło. */}
      <div
        className={`game-hud${odsloniete ? " jest-widoczny" : ""}${naglowek ? " ma-szuflade" : ""}`}
        data-variant="B"
        aria-label="Interfejs świata"
      >
        <div className="game-hud-top">
          <button
            type="button"
            className="game-hud-profile"
            onClick={() => otworz("profil")}
            aria-label={`Otwórz profil: ${player?.name || "Wędrowiec"}`}
            data-testid="hub-chip-profil"
          >
            <img src={awatarPostaci("/assets/hub-nav/profil-simple.png")} alt="" aria-hidden="true" draggable="false" />
            <span>{player?.name || "Wędrowiec"}</span>
          </button>

          <div className="game-hud-resources">
            <span
              className="game-hud-counter game-hud-counter--coins"
              aria-label={`Monety: ${monety} ze ${CEL_MONET}`}
            >
              <img src="/assets/hub-nav/moneta.png" alt="" aria-hidden="true" draggable="false" />
              <strong>{monety}</strong>
              <i
                className={`game-hud-progress${monety <= 0 ? " is-empty" : ""}${postepMonet >= 100 ? " is-full" : ""}`}
                aria-hidden="true"
              >
                <i style={{ width: `${postepMonet}%` }} />
              </i>
            </span>

            <button
              type="button"
              className={`game-hud-music${muzykaGra ? "" : " is-off"}`}
              onClick={przelaczMuzyke}
              aria-pressed={muzykaGra}
              aria-label={muzykaGra ? "Wycisz muzykę krainy" : "Włącz muzykę krainy"}
              title={muzykaGra ? "Wycisz muzykę krainy" : "Włącz muzykę krainy"}
              data-testid="hub-music"
            >
              <img src="/music.png" alt="" aria-hidden="true" draggable="false" />
            </button>
          </div>
        </div>

        <div className="game-hud-bottom">
          {!panel && pokazPodpowiedz && !scenaMartwa ? (
            <span className="hub-hint">Przesuń palcem, by iść w dowolną stronę</span>
          ) : null}
          <HubDock aktywny={panel} onWybor={przelacz} nieprzeczytane={nieprzeczytane} />
        </div>
      </div>

      {/* Mędrzec odzywa się tylko w spokojnym hubie: nie nad panelem, nie nad
          zwojem i nie zanim rozsuną się chmury. */}
      <PodpowiedzMedrca aktywna={!panel && !zwojOtwarty && !powitanie && odsloniete} />

      <PopupPostaci
        otwarty={!!powitanie}
        imie={powitanie?.imie}
        obrazek={powitanie?.obrazek}
        tekst={powitanie?.tekst || ""}
        wyroznienie={powitanie?.wyroznienie}
        przycisk={powitanie?.przycisk}
        onZamknij={() => setPowitanie(null)}
      />

      <MessageScroll open={zwojOtwarty} onClose={zamknij} onZmiana={przeliczNieprzeczytane} />

      <PanelSheet
        open={!!naglowek}
        title={naglowek}
        onClose={zamknij}
        testId="hub-sheet"
      >
        {panel === "gry" ? <MinigryPanel onZamknij={zamknij} onKomunikat={pokazKomunikat} /> : null}
        {panel === "profil" ? <ProfilPanel /> : null}
        {panel === "czat" ? <CzatPanel /> : null}
        {panel === "porada" ? <PoradaPanel onZamknij={zamknij} /> : null}
      </PanelSheet>

      {komunikat ? (
        <div className="game-hud-toast is-visible" role="status" data-testid="hub-toast">{komunikat}</div>
      ) : null}
    </main>
  );
}
