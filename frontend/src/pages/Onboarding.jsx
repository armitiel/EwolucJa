import React, { useState, useEffect, useRef } from "react";
import { zapiszRodzajBohatera, rodzajStartowy } from "../services/rodzaj.js";
import { useNavigate } from "react-router-dom";
import { api, session } from "../services/api.js";
import { useAppData } from "../contexts/AppData.jsx";
import { ttsPlayer } from "../services/ttsPlayer";
import NarratorVoice from "../components/NarratorVoice.jsx";
import PageShell from "../components/PageShell.jsx";
import { Avatar, Sparkle, Coin, CoinPill } from "../components/art.jsx";
import ProfileAvatar, { PROFILE_INFO } from "../components/ProfileAvatar.jsx";
// Jezyk wizualny gry — kremowa karta, zloty rant, guziki `hub-btn`. Do 14.09
// ten ekran byl pisany stylem inline i mial wlasna palete: fioletowa ramke
// 2,5 px i gradient na wybranej odpowiedzi, czyli ksztalty nieobecne nigdzie
// indziej w grze. Ekran startowy i HUD mowia jednym jezykiem, a test siedzacy
// miedzy nimi wygladal jak formularz z innej aplikacji.
import "../styles/onboarding.css";
import { KLUCZ_ETAP, KLUCZ_TYP, etapSzkolny } from "../hub/profilStartowy.js";
import StarBurst from "../components/StarBurst.jsx";
import Loading from "../components/Loading.jsx";
import { fx } from "../services/soundFx.js";

// Mapowanie starych nazw archetypow z bazy/configu na nowe kody profili
const LEGACY_TO_PROFILE = {
  tropiciel_tajemnic: "DT", zaklinacz_uczuc: "EM", mistrz_map: "ST",
  tkacz_snow: "KR", gwardzista_odwagi: "LD", straznik_mostu: "MD",
};
// Opisy + taglines dla 6 profili (zastepuje stara mape ARCHETYPES)
const PROFILE_LORE = {
  DT: { tagline: "Nic nie umknie Twojej uwadze.", description: "Cicho stąpasz przez świat i widzisz to, czego inni nie zauważają. Rozwijasz dociekliwość, uważność i sztukę zadawania pytań.", artifact: "Kompas Cieni" },
  EM: { tagline: "Twoje serce widzi to, czego oczy nie widzą.", description: "Czujesz emocje innych jak ciepło słońca. Rozwijasz empatię, wrażliwość i łagodność.", artifact: "Muszla Echa" },
  ST: { tagline: "Trzy kroki do przodu, zawsze.", description: "Rozpisujesz świat w mapy i strategie. Rozwijasz logikę, planowanie i samokontrolę.", artifact: "Kompas Strategiczny" },
  KR: { tagline: "Robisz z kartonu kosmiczny statek.", description: "Z prostych elementów tworzysz nieprawdopodobne historie. Rozwijasz myślenie nieszablonowe i ekspresję.", artifact: "Atrament Kronikarski" },
  LD: { tagline: "Idziesz pierwszy, nie z pychy — z troski.", description: "Pociągasz innych za sobą, bo widzą w Tobie odwagę i ciepło. Rozwijasz inicjatywę i troskę o innych.", artifact: "Tarcza Słońca" },
  MD: { tagline: "Łączysz dwie strony, gdy nikt inny nie może.", description: "Słuchasz obu głosów i znajdujesz wspólny punkt. Rozwijasz mediację i empatyczną komunikację.", artifact: "Wstęga Łączeń" },
};
function profileCodeFrom(v) {
  if (!v) return null;
  if (PROFILE_INFO[v]) return v;
  return LEGACY_TO_PROFILE[v] || null;
}

// Krotkie teksty przejsciowe miedzy odpowiedzia a kolejnym pytaniem.
// Indeksowane po numerze pytania DO KTOREGO przechodzimy (1 -> 7).
// Quiz v3-final ma 8 pytan, wiec potrzeba 8 wejsc (idx 0 nieuzywany — intro).
const TRANSITIONS = [
  "",                                                          // przed pyt. 1 (nieuzywane — tam jest intro)
  "Dobrze… słyszę cię. A teraz powiedz mi…",                   // przed pyt. 2
  "Hmm, to ciekawe. Pomyśl chwilę nad tym…",                   // przed pyt. 3
  "Czuję, że zaczynam cię już rozumieć. Jeszcze jedno…",       // przed pyt. 4
  "Świetnie. Twoje odpowiedzi wiele mi mówią. Idziemy dalej…", // przed pyt. 5
  "Półmetek za nami. Spokojnie, oddychaj…",                    // przed pyt. 6
  "Widzę, co Cię porusza. Jeszcze chwilkę…",                   // przed pyt. 7
  "Ostatnie pytanie. Skup się jeszcze na chwilę…",             // przed pyt. 8
];

/**
 * Onboarding jest w nowym doświadczeniu WYŁĄCZONY W CAŁOŚCI — łącznie z pytaniem
 * o imię. Wejście na `/onboarding` zakłada konto po cichu i przepuszcza dziecko
 * prosto do świata 3D; ekran przewija się tak szybko, że nikt go nie zobaczy.
 *
 * Dlaczego nie usunięty: koncept onboardingu jest wstrzymany, nie porzucony.
 * Cały przepływ (imię → osiem pytań z narracją i lektorem → objawienie profilu)
 * jest kompletny i działa pod `/onboarding?quiz=1`. Odtwarzanie go z historii
 * razem z TTS i animacjami kosztowałoby więcej niż ta jedna flaga.
 *
 * Konto MUSI powstać, choć nic nie pytamy: HUD, Mentor i misje wiszą na
 * `player_id`. Imię jest tymczasowe — do zmiany, gdy wróci ekran powitalny
 * albo gdy profil zacznie się budować z decyzji w fabule.
 */
// 2026-09-14: onboarding WRACA. Kanon wejscia: START -> onboarding -> /swiat
// (docs/WERSJA_AKTUALNA.md). Bez niego zaden gracz nie ma typu, a porady
// i zadania nie maja wedlug czego sie dobierac.
const POMIN_ONBOARDING = false;
const IMIE_TYMCZASOWE = "Wędrowiec";
// Dokad prowadzi koniec onboardingu. Jedno miejsce, bo tor swiata bywa
// przepinany (`/swiat` <-> `/w2`) i nie chcemy go szukac po pliku.
// 2026-09-14: z powrotem na `/swiat` — patrz komentarz przy `SWIAT`
// w `Landing.jsx`. Typ z quizu i tak idzie przez localStorage (`KLUCZ_TYP`),
// wiec przepiecie toru niczego mu nie zabiera.
const SWIAT_PO_QUIZIE = "/swiat";
// Most miedzy kontem (baza) a torem W2, ktory ma wlasny, odizolowany zapis
// w localStorage i nie wola AppData. Typ zapisany tutaj pozwala W2 dobrac
// pierwsze przygody bez pytania dziecka drugi raz o to samo.
/**
 * Klucze zapisu profilu mieszkaja w `hub/profilStartowy.js` — czyta je takze
 * os etapow i dwa pulpity dev, a import calej tej strony po dwa ciagi znakow
 * wciagalby do huba komponent z lektorem i quizem. Reeksport zostaje, bo
 * starsze miejsca importuja je stad.
 */
export { KLUCZ_TYP, KLUCZ_ETAP, etapSzkolny };

export default function Onboarding() {
  const navigate = useNavigate();
  const { refreshAll } = useAppData();
  const chceQuiz = (() => {
    try { return new URLSearchParams(window.location.search).get("quiz") === "1"; }
    catch { return false; }
  })();
  // Player_id moze juz istniec (z /dolacz join flow) - wykorzystamy go. Imie zawsze pytamy w name step.
  const initialPlayerId = (() => { try { return session.getPlayer(); } catch { return null; } })();
  const [step, setStep] = useState("name");
  const [name, setName] = useState("");
  // RODZAJ BOHATERA. Gra nie pyta juz o plec wyborem postaci — rodzaj
  // (w jakim mowi do dziecka i jak nazywa jego archetyp) wykrywa sie z
  // imienia przy przejsciu dalej: `rodzajStartowy(name)`. Imie testowe albo
  // dziwne dostaje rodzaj meski (ON) jako domyslny — patrz services/rodzaj.js.
  const [playerId, setPlayerId] = useState(initialPlayerId);
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [questionIdx, setQuestionIdx] = useState(0);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // Czy lektor skonczyl mowic (intro lub przejscie) — dopiero wtedy pokazujemy odpowiedzi.
  // Przy 1. pytaniu blokuje wszystko do konca intro. Przy kolejnych — do konca przejscia.
  const [narrationDone, setNarrationDone] = useState(false);
  // Animowane potwierdzenie wyboru — id zaznaczonej odpowiedzi, delay przed przejsciem.
  const [pickedAnswerId, setPickedAnswerId] = useState(null);

  /* ── Cichy przelot do świata ──────────────────────────────────────────
     Zakładamy konto (jeśli trzeba) i od razu przechodzimy dalej. Ekran
     onboardingu nie ma się pokazać ani na moment — stąd `Loading` zamiast
     formularza, dopóki przelot trwa.

     Gdy backend nie odpowie, i tak idziemy do świata: pierwsza przygoda żyje
     w localStorage, więc dziecko nie utknie na komunikacie o błędzie z powodu
     konta, o które samo nie prosiło. Konto dopisze się przy następnym wejściu. */
  const przelotRef = useRef(false);
  const [przelot] = useState(() => POMIN_ONBOARDING && !chceQuiz);

  useEffect(() => {
    if (!przelot || przelotRef.current) return;
    przelotRef.current = true;
    (async () => {
      try {
        if (!session.getPlayer()) {
          const player = await api.createPlayer(IMIE_TYMCZASOWE);
          session.setPlayer(player.player_id);
        }
        await refreshAll();
      } catch (err) {
        console.warn("[Onboarding] cichy start bez konta:", err);
      } finally {
        navigate(SWIAT_PO_QUIZIE, { replace: true });
      }
    })();
  }, [przelot, navigate, refreshAll]);

  useEffect(() => {
    if (przelot) return;
    if (step === "quiz" && !quiz) {
      api.getQuiz(etapSzkolny()).then(setQuiz).catch((e) => setError(e.message));
    }
  }, [przelot, step, quiz]);

  const czyBrakGracza = (err) => /gracz nie znaleziony/i.test(String(err?.message || ""));

  async function utworzGraczaDoQuizu() {
    const player = await api.createPlayer(name.trim() || IMIE_TYMCZASOWE);
    session.setPlayer(player.player_id);
    setPlayerId(player.player_id);
    return player.player_id;
  }

  async function aktywnyGraczDoQuizu() {
    const existingId = session.getPlayer();
    if (!existingId) return utworzGraczaDoQuizu();
    try {
      await api.getPlayer(existingId);
      return existingId;
    } catch (err) {
      if (!czyBrakGracza(err)) throw err;
      return utworzGraczaDoQuizu();
    }
  }

  async function handleStart(e) {
    e.preventDefault();
    if (!name.trim()) return;
    ttsPlayer.unlock();
    zapiszRodzajBohatera(rodzajStartowy(name));
    setLoading(true);
    setError(null);
    try {
      // Zapis z /dolacz zachowujemy, ale najpierw sprawdzamy, czy gracz nadal
      // istnieje. Lokalny identyfikator potrafi przeżyć reset bazy i dopiero
      // ostatnia odpowiedź ujawniała wtedy martwą sesję.
      const pid = await aktywnyGraczDoQuizu();
      setPlayerId(pid);
      setStep("quiz");
    } catch (err) {
      /* ZAWIESZKA NA OSTATNIM PYTANIU. Blad wysylki ustawial tylko `error`,
         ktory rysowal sie WYLACZNIE na ekranie imienia — na szostym pytaniu
         dziecko zostawalo z zaznaczonym kafelkiem, wszystkimi pozostalymi
         wygaszonymi (`pickedAnswerId` blokuje klikanie) i bez zadnej
         informacji. Zdejmujemy zaznaczenie i pokazujemy blad TAM, GDZIE
         dziecko stoi, razem z przyciskiem ponowienia. */
      setPickedAnswerId(null);
      setError(err.message || "Nie udało się wysłać odpowiedzi.");
    } finally {
      setLoading(false);
    }
  }

  function selectAnswer(qid, aid) {
    if (pickedAnswerId) return; // chrona przed double-clickiem
    setPickedAnswerId(aid);
    // Sygnal dzwiekowy + zlote gwiazdki natychmiast po wyborze (user gesture - autoplay OK)
    fx.gentleMagical(0.6);
    // Maly delay (1100ms) zeby uzytkownik zauwazyl efekty zanim przejdzie dalej
    setTimeout(() => {
      setAnswers((prev) => ({ ...prev, [qid]: aid }));
      if (quiz && questionIdx < quiz.questions.length - 1) {
        setNarrationDone(false);
        setQuestionIdx((i) => i + 1);
        setPickedAnswerId(null);
      } else {
        submitQuiz({ ...answers, [qid]: aid });
      }
    }, 1100);
  }

  /* Ostatni komplet odpowiedzi — do ponowienia, gdy wysylka padnie. Bez tego
     „Sprobuj jeszcze raz" nie mialoby czego wyslac: `answers` w stanie nie
     zawiera tej odpowiedzi, ktora wlasnie domknela test (leci inline). */
  const ostatniaProbaRef = useRef(null);

  async function submitQuiz(finalAnswers) {
    ostatniaProbaRef.current = finalAnswers;
    setError(null);
    setLoading(true);
    try {
      const payload = Object.entries(finalAnswers).map(([q, a]) => ({ question_id: q, answer_id: a }));
      let pid = playerId || session.getPlayer();
      let res;
      try {
        res = await api.submitQuiz(pid, payload, name.trim(), etapSzkolny());
      } catch (err) {
        if (!czyBrakGracza(err)) throw err;
        // Ostatnia osłona na wypadek resetu bazy już w trakcie sześciu pytań.
        // Nowy zapis dostaje ten sam komplet odpowiedzi, więc dziecko nie musi
        // powtarzać całego quizu.
        pid = await utworzGraczaDoQuizu();
        res = await api.submitQuiz(pid, payload, name.trim(), etapSzkolny());
      }
      // KRYTYCZNE: po submit (nowe imie + archetype + coins) odswiez cala AppData,
      // inaczej TopBar/Profile/WorldHub pokazuja stale dane z "Uczen 0 coinow"
      try { await refreshAll(); } catch {}
      try { if (res?.profile) localStorage.setItem(KLUCZ_TYP, res.profile); } catch {}
      setResult(res);
      setStep("result");
      try { await api.generateMission(pid); } catch {}
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // DEV: szybko przeskocz do ekranu wyniku z auto-odpowiedziami (pierwsza opcja kazdego pytania).
  // Widoczne tylko jezeli localStorage 'ewolucja.dev' = '1' lub URL ?dev=1.
  function devSkipQuiz() {
    if (!quiz) return;
    const auto = {};
    for (const q of quiz.questions) auto[q.question_id] = q.answers[0].answer_id;
    setAnswers(auto);
    submitQuiz(auto);
  }
  const devMode = (typeof window !== "undefined") && (
    new URLSearchParams(window.location.search).get("dev") === "1" ||
    (() => { try { return localStorage.getItem("ewolucja.dev") === "1"; } catch { return false; } })()
  );

  const totalSteps = 1 + (quiz?.questions?.length || 8) + 1;
  const currentStepIdx = step === "name" ? 0 : step === "quiz" ? 1 + questionIdx : totalSteps - 1;

  // Podczas cichego przelotu nie rysujemy onboardingu w ogóle — inaczej mignąłby
  // formularz z imieniem, czyli dokładnie to, co mamy schować.
  if (przelot) return <Loading text="Otwieram świat…" />;

  return (
    <PageShell ramka>
      {/* Tlo calego onboardingu — zmierzchowa polana. Osobna warstwa, a nie
          tlo `.ob-ekran`, bo ma wypelniac caly kadr razem z paskiem gornym,
          a nie tylko kolumne tresci. */}
      <div className="ob-tlo" aria-hidden="true" />
      {step !== "result" && <div className="topbar" style={{ position: "relative", zIndex: 1 }}>
        <button className="ob-wroc" onClick={() => navigate("/")}>‹ Wróć</button>
        <div style={{ flex: 1 }} />
        {/* Pasek postepu i licznik siedza w JEDNEJ ciemnej podkladce
            (`.ob-kroki`), bo leza na zdjeciu, a nie na papierze: zlote kropki
            na rozswietlonym niebie po prostu znikaly. Kontrast bierze sie
            z podkladki, wiec trzyma sie przy kazdej tapecie.

            Docelowo kropki znikaja w calosci — postep ma byc widoczny jako
            swiat, a nie jako licznik (decyzja wlasciciela,
            `docs/TEST_OBRAZKOWY.md`) — ale to wchodzi razem z ukladem
            trzy pytania + czynnosc + trzy. */}
        <div className="ob-kroki">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`ob-krok${i === currentStepIdx ? " jest-teraz" : i < currentStepIdx ? " jest-zrobiony" : ""}`}
            />
          ))}
          {step === "quiz" && quiz && (
            <span className="ob-licznik">
              {questionIdx + 1} / {quiz.questions.length}
            </span>
          )}
        </div>
      </div>}

      {devMode && step === "quiz" && (
        <button
          onClick={devSkipQuiz}
          style={{
            position: "fixed", bottom: 80, right: 18, zIndex: 80,
            background: "#3B2A12", color: "#FFD269", fontWeight: 700, fontSize: 11,
            border: "none", padding: "6px 12px", borderRadius: 999, cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0,0,0,.25)",
          }}
          title="Auto-odpowiedz na wszystkie pytania pierwsza opcja i skocz do wyniku"
        >
          ⚙️ DEV → wynik
        </button>
      )}
      <div
        className={`screen-scroll ob-scroll${step === "result" ? " ob-scroll-wynik" : ""}`}
        style={{ flex: 1, padding: "16px 18px 120px", WebkitOverflowScrolling: "touch" }}
      >
        {step === "name" && (
          /* Wizkor wychodzi PONAD karte — tak samo jak w oknie postaci
             i w zaproszeniu do minigry. Grafika ma plaskie ciecie u dolu:
             siada ono na gornej krawedzi karty i chowa sie pod jej rantem,
             wiec czyta sie to jako jedna bryla, a nie jako obrazek doklejony
             nad prostokatem. Ta sama zasada rzadzi glowa Medrca. */
          <div className="ob-ekran pop-in">
            <form onSubmit={handleStart} className="ob-karta">
              <img className="ob-wizkor" src="/wizPop.webp" alt="" aria-hidden="true" draggable="false" />

              <h1 className="ob-tytul">Witaj, wędrowcze</h1>
              <p className="ob-podtytul">Zanim ruszymy w drogę — powiedz, jak masz na imię?</p>
              <div className="ob-przerywnik" aria-hidden="true" />

              <div className="ob-pole">
                <label className="ob-pole-etykieta" htmlFor="ob-imie">Twoje imię</label>
                <input
                  id="ob-imie"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={16}
                  autoFocus
                />
              </div>

              <div className="ob-akcja">
                <button type="submit" className="hub-btn hub-btn-primary" disabled={loading || !name.trim()}>
                  {loading ? "Otwieram bramę…" : "Dalej"}
                </button>
              </div>

              <NarratorVoice
                text="Witaj, wędrowcze… Zanim ruszymy w tę przygodę — powiedz mi, jak masz na imię?"
                land="dolina_selfie"
                tone="warm"
                speed={0.95}
                pauseBefore={500}
                inlinePauses
                autoPlayDelay={1200}
                autoPlay
              />

              {error && <p className="ob-blad">{error}</p>}
            </form>
          </div>
        )}

        {step === "quiz" && quiz && (
          <div className="ob-ekran pop-in" key={questionIdx}>
            {/* TA SAMA GRAFIKA, CO W GRZE (`/wizPop.webp` — okno postaci,
                zaproszenie do minigry, podpowiedz Medrca). Wczesniej stal tu
                `wizard.png`: inny rysunek, inna postac i megabajt do pobrania
                na wejsciu. Przy kolejnych pytaniach czarodziej schodzi na
                drugi plan — pytanie jest wtedy wazniejsze niz ten, kto je
                zadaje. */}
            <div className={`ob-karta${questionIdx === 0 && !narrationDone ? "" : " wizkor-maly"}`}>
              <img className="ob-wizkor" src="/wizPop.webp" alt="" aria-hidden="true" draggable="false" />

              <h2 className="ob-pytanie">{quiz.questions[questionIdx].question}</h2>

            {/* Kontrolka lektora — wysrodkowana pod pytaniem */}
            <div style={{ display: "flex", justifyContent: "center", margin: "4px 0 8px" }}>
              {questionIdx === 0 ? (
                <NarratorVoice
                  text={`Witaj. Cieszę się, że tu jesteś. Świat Ewolucji właśnie otwiera przed tobą swoje bramy. Zanim ruszymy w drogę — chcę cię lepiej poznać. Przygotowałem dla ciebie kilka prostych pytań. Odpowiadaj szczerze, a dowiesz się, jaka siła w tobie drzemie. A teraz… ${quiz.questions[0].question}`}
                  land="las_decyzji"
                  tone="warm"
                  speed={0.92}
                  pauseBefore={500}
                  inlinePauses
                  autoPlay
                  onEnd={() => setNarrationDone(true)}
                />
              ) : (
                <NarratorVoice
                  text={`${TRANSITIONS[questionIdx] || ""} ${quiz.questions[questionIdx].question}`.trim()}
                  land="las_decyzji"
                  tone="calm"
                  speed={0.94}
                  pauseBefore={300}
                  inlinePauses
                  autoPlay
                  onEnd={() => setNarrationDone(true)}
                />
              )}
            </div>

            {/* Odpowiedzi. Ksztalt kafelka jest TEN SAM, co kafelki gier
                w skrzyni (`.hub-tile-in`): kremowe tlo, zloty rant, wypuklosc
                pod spodem. Wybrana jest ZLOTA, nie fioletowa — fiolet to
                w tym projekcie barwa magii i mentorow, a potwierdzenie wyboru
                dziecka nalezy do rodziny HUD-u.

                Jedna kolumna, dopoki odpowiedzi sa zdaniami. Gdy dojda
                ilustracje, `--ob-kolumny` przestawi to na siatke bez ruszania
                tego pliku. */}
            {/* SIATKA WCHODZI Z OBRAZKAMI, nie z gory. Dopoki kafelki sa
                zdaniami, jedna kolumna czyta sie lepiej; gdy pytanie ma komplet
                ilustracji, przestawiamy sie na dwie kolumny kwadratow. Warunek
                liczy sie Z DANYCH pytania, wiec pytania z gotowymi obrazkami
                i te bez moga istniec obok siebie — a tak wlasnie jest, dopoki
                nie dogenerujemy wozu i klody. */}
            {/* KAFELKI SA AKTYWNE OD RAZU, lektor idzie w tle (decyzja
                wlasciciela 14.09). Wczesniej caly blok mial `opacity: 0`, dopoki
                `NarratorVoice` nie zglosil `onEnd` — a gdy TTS nie dojechal
                (brak sieci, cisza w przegladarce, blad ElevenLabs), zglaszal
                to NIGDY i dziecko patrzylo na pusta karte z samym pytaniem.
                Blokada byla tez glownym powodem, dla ktorego pytan moglo byc
                tylko szesc: osiem razy czekanie z wygaszonym ekranem.
                `narrationDone` zostaje w stanie, ale pilnuje juz tylko jednej
                rzeczy: czy czarodziej przy PIERWSZYM pytaniu stoi duzy (mowi),
                czy zszedl na drugi plan. Niczego nie blokuje, wiec cisza
                w glosnikach nie zatrzymuje testu. */}
            <div
              className={`ob-odpowiedzi${
                quiz.questions[questionIdx].answers.every((a) => a.obraz) ? " ma-obrazki" : ""
              }${quiz.etap === "1-3" ? " jest-13" : ""}`}
            >
              {quiz.questions[questionIdx].answers.map((a, idx) => {
                const isPicked = pickedAnswerId === a.answer_id;
                const isDimmed = pickedAnswerId && !isPicked;
                return (
                  <button
                    key={a.answer_id}
                    type="button"
                    className={`ob-kafelek${isPicked ? " jest-wybrany" : ""}${isDimmed ? " jest-przygaszony" : ""}`}
                    onClick={() => selectAnswer(quiz.questions[questionIdx].question_id, a.answer_id)}
                    disabled={loading || !!pickedAnswerId}
                  >
                    {/* TRZY STANY, JEDEN KAFELEK. `obraz` to ilustracja scenki,
                        `podpis` to dwa, cztery slowa pod nia — backend oddaje oba.
                        Dopoki pliku nie ma, kafelek pokazuje podpis i pod nim
                        pelne zdanie; gdy obrazek wejdzie, zdanie schodzi do
                        lektora na dotkniecie i zostaje sam podpis. Zaden
                        z tych stanow nie wymaga zmiany tutaj. */}
                    {a.obraz ? (
                      <img
                        className="ob-kafelek-obraz"
                        src={a.obraz}
                        alt=""
                        aria-hidden="true"
                        draggable="false"
                        onError={(e) => { e.currentTarget.style.display = "none"; }}
                      />
                    ) : null}
                    <span className="ob-kafelek-tresc">
                      {a.podpis ? <span className="ob-kafelek-podpis">{a.podpis}</span> : null}
                      {a.podpis && a.obraz ? null : <span className="ob-kafelek-zdanie">{a.text}</span>}
                      {/* Dla klas 1-3 podpis jest schowany wizualnie, wiec
                          czytnik ekranu i lektor maja z czego wziac tresc. */}
                    </span>
                    {isPicked && <StarBurst count={10} duration={950} />}
                    {isPicked && <span className="ob-kafelek-ptaszek" aria-hidden="true">✓</span>}
                  </button>
                );
              })}

              </div>

              {error && (
                <div className="ob-akcja">
                  <p className="ob-blad">{error}</p>
                  <button
                    type="button"
                    className="hub-btn hub-btn-primary"
                    disabled={loading}
                    onClick={() => submitQuiz(ostatniaProbaRef.current || answers)}
                  >
                    {loading ? "Wysyłam…" : "Spróbuj jeszcze raz"}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {step === "result" && result && (
          <CelebrationThenArchetype result={result} onEnter={() => navigate(SWIAT_PO_QUIZIE)} />
        )}
      </div>
    </PageShell>
  );
}

function ArchetypeReveal({ result, onEnter }) {
  // Backend zwraca teraz 'profile' jako kod (EM/ST/...). Fallback na 'archetype' (stara nazwa, mapujemy).
  const profileCode = profileCodeFrom(result.profile || result.archetype) || "DT";
  const info = PROFILE_INFO[profileCode];
  const lore = PROFILE_LORE[profileCode];
  const dlugaNazwa = info.name.length > 12;

  // Ten sam scroll obsluguje pytania i wynik. Ostatnie pytanie bywa dluzsze,
  // wiec bez resetu pozycja przechodzila na karte i ucinala gore medalionu.
  useEffect(() => {
    document.querySelector(".screen-scroll")?.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  return (
    <div
      className="ob-reveal pop-in"
      data-profile={profileCode}
      style={{
        "--ob-profile": info.color,
        "--ob-profile-glow": info.glow,
        "--ob-medalion": info.revealBg,
        "--ob-medalion-dk": info.revealBgDark,
        "--ob-badge": info.revealBadge || info.color,
      }}
    >
      <section className="ob-reveal-card" aria-labelledby="ob-reveal-name">
        <div className="ob-reveal-medalion">
          <div className="ob-reveal-stars" aria-hidden="true">
            <span className="ob-reveal-star s1"><Sparkle size={25} /></span>
            <span className="ob-reveal-star s2"><Sparkle size={18} /></span>
            <span className="ob-reveal-star s3"><Sparkle size={14} /></span>
            <span className="ob-reveal-star s4"><Sparkle size={21} /></span>
            <span className="ob-reveal-star s5"><Sparkle size={12} /></span>
          </div>
          <div className="ob-reveal-avatar">
            <ProfileAvatar profile={profileCode} size={236} variant="reveal" />
          </div>
        </div>

        <img className="ob-reveal-laurel jest-lewy" src="/assets/onboarding/ornament-zlote-liscie-v1.png" alt="" aria-hidden="true" />
        <img className="ob-reveal-laurel jest-prawy" src="/assets/onboarding/ornament-zlote-liscie-v1.png" alt="" aria-hidden="true" />
        <div className="ob-reveal-chip">Twój archetyp</div>
        <h2
          id="ob-reveal-name"
          className={`ob-reveal-name${dlugaNazwa ? " jest-dluga" : ""}`}
        >
          {info.name}
        </h2>

        <div className="ob-reveal-copy">
          <blockquote className="ob-reveal-tagline">„{lore.tagline}”</blockquote>
          <div className="ob-reveal-divider" aria-hidden="true"><Sparkle size={18} /></div>
          <p className="ob-reveal-description">{lore.description}</p>
          <button className="hub-btn hub-btn-primary ob-reveal-cta" onClick={onEnter}>
            Wyrusz w drogę
          </button>
        </div>
      </section>
    </div>
  );
}

// ─── Ekran nagrody po quizie — najpierw burst + monety, potem ArchetypeReveal ───
function CelebrationThenArchetype({ result, onEnter }) {
  const [phase, setPhase] = useState("burst"); // burst -> archetype
  const [coinCount, setCoinCount] = useState(0);
  const REWARD = 50;
  // Trzymamy ten ekran ~6.5s, by gracz nasycil sie nagroda zanim trafi do ArchetypeReveal.
  const DWELL_MS = 6500;

  useEffect(() => {
    if (phase !== "burst") return;
    // Animowany licznik monet 0 -> 50 w 1.8s
    const start = Date.now();
    const duration = 1800;
    const tick = setInterval(() => {
      const t = Math.min(1, (Date.now() - start) / duration);
      setCoinCount(Math.round(REWARD * t));
      if (t >= 1) clearInterval(tick);
    }, 40);
    // NIE robimy auto-przejscia - gracz musi kliknac 'Odkryj swoja sile ->'
    return () => clearInterval(tick);
  }, [phase]);

  if (phase === "archetype") {
    return <ArchetypeReveal result={result} onEnter={onEnter} />;
  }

  // Konfetti — 3 rodzaje czastek na losowych pozycjach z roznymi animacjami.
  const colors = ["#FFD269", "#B886E8", "#7BC0E8", "#F08C8C", "#5FA76F", "#FFB347"];
  const PIECES = 36;
  return (
    <div
      className="pop-in"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 18,
        padding: "24px 0",
        position: "relative",
        minHeight: "100%",
        overflow: "hidden",
      }}
    >
      {/* WARSTWA KONFETTI — pętla 3.2s, kazdy element rusza losowo */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        {Array.from({ length: PIECES }).map((_, i) => {
          const left = (i * 137) % 100; // pseudo-losowe equal spread
          const delay = (i % 12) * 0.15;
          const dur = 2.4 + (i % 5) * 0.4;
          const sz = 8 + (i % 4) * 3;
          const drift = -30 + ((i * 31) % 60);
          const rot = (i * 47) % 360;
          const color = colors[i % colors.length];
          const shape = i % 3; // 0=koło 1=kwadrat 2=płatek
          const radius = shape === 0 ? "50%" : shape === 1 ? "3px" : "60% 0 60% 0";
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${left}%`,
                top: "-20px",
                width: sz,
                height: sz,
                background: color,
                borderRadius: radius,
                transform: `rotate(${rot}deg)`,
                animation: `confetti-fall ${dur}s linear ${delay}s infinite`,
                ["--tx"]: `${drift}px`,
                opacity: 0.85,
              }}
            />
          );
        })}
      </div>

      {/* Drobne sparkle-burst dookola monety (jednorazowy efekt) */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * Math.PI * 2;
          const cx = 50 + Math.cos(a) * 22;
          const cy = 32 + Math.sin(a) * 16;
          return (
            <div
              key={`b${i}`}
              style={{
                position: "absolute",
                left: `${cx}%`,
                top: `${cy}%`,
                width: 14,
                height: 14,
                borderRadius: "60% 0 60% 0",
                background: colors[i % colors.length],
                transform: `rotate(${i * 32}deg)`,
                animation: `petal-fly 1.6s cubic-bezier(.34,1.56,.64,1) ${i * 0.05}s both`,
              }}
            />
          );
        })}
      </div>

      <p
        className="t-hand"
        style={{
          fontSize: 22,
          color: "var(--p-ink-soft)",
          margin: 0,
          textAlign: "center",
          maxWidth: 340,
          lineHeight: 1.3,
          position: "relative",
          zIndex: 1,
        }}
      >
        Twoje szczere odpowiedzi zasłużyły na pierwszą nagrodę.
      </p>

      {/* Wielka pigulka z monetami — animowany licznik */}
      <div style={{ margin: "10px 0", position: "relative", animation: "coin-tally .6s ease-out", zIndex: 1 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            background: "linear-gradient(180deg,#FFF1B0,#FFD269)",
            color: "#7A4D10",
            fontWeight: 800,
            fontSize: 40,
            padding: "18px 32px",
            borderRadius: 999,
            boxShadow: "inset 0 0 0 2.5px #E1B66A, 0 8px 20px rgba(160,110,30,.35), 0 0 60px rgba(255,210,105,.55)",
            fontFamily: "var(--font-display, 'Baloo 2'), sans-serif",
          }}
        >
          <Coin size={48} anim />
          <span style={{ lineHeight: 1 }}>+{coinCount}</span>
        </div>
        <div style={{ position: "absolute", top: -12, right: -16 }}>
          <Sparkle size={28} />
        </div>
        <div style={{ position: "absolute", bottom: -10, left: -12 }}>
          <Sparkle size={20} delay={0.4} />
        </div>
      </div>

      <button
        className="hub-btn hub-btn-primary"
        style={{ maxWidth: 360, marginTop: 10, position: "relative", zIndex: 1 }}
        onClick={() => setPhase("archetype")}
      >
        Odkryj swoją siłę →
      </button>

      <div style={{ position: "relative", zIndex: 1 }}>
        <NarratorVoice
          text={`Brawo! Zdobyłeś pierwsze ${REWARD} złotych monet. Twój skarbiec dopiero się otwiera.`}
          land="gora_podsumowania"
          tone="celebration"
          pauseBefore={300}
          inlinePauses
          autoPlay
        />
      </div>
    </div>
  );
}
