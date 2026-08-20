/**
 * ZadaniePanel — zadanie od Wizkora, które robi się POZA ekranem.
 *
 * Ekran ma cztery odsłony, po jednej na stan zadania (`hub/zadanieWizkora.js`):
 * do zrobienia → wysłane → nagroda czeka → zrobione. Nigdy nie pokazuje dwóch
 * naraz: dziecko ma na ekranie jedną rzecz do zrobienia.
 *
 * Sekcja „Gdzie to zrobisz?" jest zbudowana jak karteczki Porady dnia — papier,
 * pinezka, jedno zdanie. To nie jest lista wymagań do odhaczenia, tylko
 * podpowiedzi, w które miejsce dnia takie zadanie się mieści. Wybór jednej
 * karteczki niczego nie blokuje ani nie odblokowuje; jest po to, żeby dziecko
 * przestało szukać „gdzie" i zaczęło robić.
 *
 * Zdjęcie leci prosto do Vercel Blob (ten sam tor co dowody misji w przygodzie
 * — plik omija limit ciała funkcji), a do bazy idzie dopiero URL razem
 * z opisem. Brak sieci nie blokuje opisu słowami.
 */
import React, { useCallback, useEffect, useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import { API_BASE } from "../../config.js";
import { useAppData } from "../../contexts/AppData.jsx";
import { GameIcon } from "../../adventure/components/icons.jsx";
import bgMusic from "../../services/bgMusic.js";
import { ttsPlayer } from "../../services/ttsPlayer.js";
import {
  odbierzNagrode,
  sprawdzMentora,
  stanZadania,
  wyslijDowod,
  ZDARZENIE_ZMIANY,
} from "../zadanieWizkora.js";

export default function ZadaniePanel({ onKomunikat, onZamknij }) {
  const { refreshPlayer } = useAppData();
  const [stan, setStan] = useState(() => stanZadania());
  const [etap, setEtap] = useState("plan");
  const [miejsce, setMiejsce] = useState(null);
  const [opis, setOpis] = useState("");
  const [zdjecieUrl, setZdjecieUrl] = useState(null);
  const [podglad, setPodglad] = useState(null);
  const [wysylka, setWysylka] = useState(false);
  const [wgrywanie, setWgrywanie] = useState(false);
  const [blad, setBlad] = useState(null);
  const plikRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    const odswiez = () => setStan(stanZadania());
    window.addEventListener(ZDARZENIE_ZMIANY, odswiez);
    return () => window.removeEventListener(ZDARZENIE_ZMIANY, odswiez);
  }, []);

  // Podgląd zdjęcia żyje w pamięci przeglądarki — trzeba go po sobie posprzątać.
  useEffect(() => () => { if (podglad) URL.revokeObjectURL(podglad); }, [podglad]);

  const def = stan.def;

  useEffect(() => { setEtap("plan"); }, [def?.id, stan.status]);

  // Drugi krok zaczyna się zawsze od nagłówka, niezależnie od tego, jak daleko
  // dziecko przewinęło listę podpowiedzi w pierwszym kroku.
  useEffect(() => {
    const przewijanyPanel = panelRef.current?.closest(".hub-sheet-body");
    if (przewijanyPanel) przewijanyPanel.scrollTop = 0;
  }, [etap]);

  const czytajZadanie = useCallback(() => {
    if (!def || !stan.doZrobienia) return;
    try {
      ttsPlayer.speak([def.cel, def.jak].filter(Boolean).join(" "), {
        land: "las_decyzji",
        tone: "mystery",
        interrupt: true,
      });
    } catch {}
  }, [def, stan.doZrobienia]);

  /**
   * WIZKOR CZYTA ZADANIE NA GŁOS, raz, zaraz po otwarciu panelu.
   *
   * To jest jedyne miejsce w grze, gdzie dziecko dostaje polecenie do zrobienia
   * POZA ekranem — i jedyne, w którym nie ma postaci, która by je powiedziała.
   * Sam tekst wystarcza dziecku, które płynnie czyta; sześciolatkowi nie.
   *
   * Trzy zasady te same, co u czarodzieja w `PopupPostaci`:
   *  • ta sama barwa i ton (`las_decyzji` + `mystery`), bo to ten sam Wizkor —
   *    inny głos w panelu znaczyłby dla dziecka inną postać;
   *  • milczy przy wyciszonej grze — nutka w HUD-zie znaczy „ciszej w grze",
   *    a nie „ciszej, ale głos i tak wejdzie";
   *  • zamknięcie panelu ucina mowę w pół słowa.
   *
   * Mówi TYLKO o zadaniu do zrobienia. Dowód ma osobny, drugi krok, więc nie
   * czytamy jego instrukcji, zanim dziecko zdecyduje, że już skończyło.
   * Ekrany „u Mentora", „nagroda czeka"
   * i „zrobione" to stany, nie polecenia — czytanie ich na głos przy każdym
   * zajrzeniu do panelu byłoby gadaniem, nie pomocą.
   *
   * BEZ TYTUŁU. „Ciche dobro" to etykieta dla oka — stoi wielkimi literami
   * nad tekstem i dziecko i tak ją widzi. Wypowiedziana na głos jest zagadką:
   * sześciolatek słyszy dwa słowa, które nic nie znaczą, zanim usłyszy, o co
   * chodzi. Wizkor mówi więc od razu, na czym zadanie polega.
   */
  useEffect(() => {
    if (!def || !stan.doZrobienia) return undefined;
    if (!bgMusic.isEnabled()) return undefined;
    czytajZadanie();
    return () => { try { ttsPlayer.stop(); } catch {} };
  }, [czytajZadanie, stan.doZrobienia]);

  const dodajZdjecie = useCallback(async (zdarzenie) => {
    const plik = zdarzenie.target.files?.[0];
    if (!plik) return;
    if (!plik.type.startsWith("image/")) { setBlad("To nie jest zdjęcie."); return; }
    if (plik.size > 10 * 1024 * 1024) { setBlad("Zdjęcie jest za duże. Spróbuj mniejsze."); return; }
    setBlad(null);
    setWgrywanie(true);
    if (podglad) URL.revokeObjectURL(podglad);
    setPodglad(URL.createObjectURL(plik));
    try {
      const rozszerzenie = (plik.name.split(".").pop() || "jpg").toLowerCase();
      const wynik = await upload(`dowody/wizkor-${Date.now()}.${rozszerzenie}`, plik, {
        access: "public",
        handleUploadUrl: `${API_BASE}/uploads/handler`,
      });
      setZdjecieUrl(wynik.url);
    } catch {
      // Zdjęcie nie poszło — ale zadanie zostaje wykonalne. To jest cała
      // różnica między „opisz to słowami" a ślepym zaułkiem.
      setZdjecieUrl(null);
      setBlad("Zdjęcie nie chce się wysłać. Możesz opisać wszystko słowami — Mentor to zobaczy.");
    } finally {
      setWgrywanie(false);
    }
  }, [podglad]);

  async function wyslij() {
    if (!opis.trim() && !zdjecieUrl) {
      setBlad("Napisz choć jedno zdanie albo dodaj zdjęcie.");
      return;
    }
    setBlad(null);
    setWysylka(true);
    try {
      setStan(await wyslijDowod({ opis: opis.trim(), zdjecieUrl }));
      onKomunikat?.("Wysłane do Mentora");
    } catch (err) {
      setBlad(err?.message || "Nie udało się wysłać. Spróbuj za chwilę.");
    } finally {
      setWysylka(false);
    }
  }

  /**
   * WERDYKT SPRAWDZA SIĘ SAM, PRZY OTWARCIU PANELU.
   *
   * Wcześniej robił to przycisk „Sprawdź, czy odpisał" pod ekranem czekania.
   * Przycisk kazał dziecku poprosić o rzecz, po którą właśnie przyszło —
   * weszło do zadania, żeby zobaczyć, czy Mentor odpowiedział, i dostawało
   * do kliknięcia pytanie „chcesz zobaczyć, czy Mentor odpowiedział?".
   *
   * To DALEJ NIE JEST POLLING (patrz `sprawdzMentora`): jedno zapytanie na
   * jedno wejście do panelu, nic w tle, nic na zegarze. Mentor decyduje raz
   * na dobę — odpytywanie co minutę byłoby samym transferem i baterią.
   *
   * Efekt zależy od `stan.czeka`, nie od `stan`: `sprawdzMentora` przy braku
   * werdyktu zwraca nowy obiekt stanu o tej samej treści, więc zależność od
   * całego `stan` zapętliłaby zapytania.
   */
  useEffect(() => {
    if (!stan.czeka) return undefined;
    let porzucone = false;
    (async () => {
      try {
        const nowy = await sprawdzMentora();
        if (!porzucone) setStan(nowy);
      } catch {
        // Cicho: dziecko i tak nie ma tu nic do zrobienia, a komunikat o
        // błędzie sieci pod ekranem czekania byłby zmartwieniem bez wyjścia.
        // Następne otwarcie panelu zapyta jeszcze raz.
      }
    })();
    return () => { porzucone = true; };
  }, [stan.czeka]);

  async function odbierz() {
    const nowy = odbierzNagrode();
    setStan(nowy);
    await refreshPlayer();
    onKomunikat?.(stan.nagroda ? `+${stan.nagroda} monet od Mentora` : "Nagroda odebrana");
  }

  /* ── brak zadania ──────────────────────────────────────────────────── */
  if (!stan.istnieje || !def) {
    return (
      <div className="hub-pane" data-testid="hub-pane-zadanie">
        <div className="hub-empty">
          <GameIcon name="hourglass" size={34} />
          <p>Wizkor nie ma dziś dla Ciebie zadania. Pobiegaj po mapie — znajdzie Cię sam.</p>
        </div>
      </div>
    );
  }

  /* ── nagroda odebrana ──────────────────────────────────────────────── */
  if (stan.wyplacone) {
    return (
      <div className="hub-pane" data-testid="hub-pane-zadanie">
        <div className="hub-empty">
          <GameIcon name="check" size={38} />
          <h3 className="czat-naglowek">Zrobione!</h3>
          <p>{def.tytul} — masz to za sobą. Wizkor przygotuje kolejne.</p>
        </div>
      </div>
    );
  }

  /* ── nagroda czeka ─────────────────────────────────────────────────── */
  if (stan.doOdbioru) {
    return (
      <div className="hub-pane" data-testid="hub-pane-zadanie">
        <div className="zadanie-nagroda">
          <GameIcon name="gift" size={40} />
          <h3 className="czat-naglowek">Mentor przyjął Twoje zadanie</h3>
          {stan.notatka ? <p className="zadanie-notatka">„{stan.notatka}”</p> : null}
          {stan.nagroda ? <p className="zadanie-kwota">+{stan.nagroda} monet</p> : null}
          <button type="button" className="hub-btn hub-btn-primary" onClick={odbierz}>
            Odbieram nagrodę!
          </button>
        </div>
      </div>
    );
  }

  /* ── dowód u Mentora ───────────────────────────────────────────────── */
  /* KLEPSYDRA POSZLA (2026-08-20). Kreskowa klepsydra z zestawu ikon znaczy
     „system pracuje, czekaj" w każdej aplikacji świata — dziecko zna ten znak
     z aktualizacji i z wolnego internetu. Tutaj nic się nie ładuje: ktoś żywy
     ogląda to, co dziecko zrobiło naprawdę. Stąd ilustracja Wizkora z lupą nad
     zwojem (`/wizSprawdza.webp`, robiona img2img z `wizPop.webp` — patrz
     `narzedzia/ilustracja-zadanie-sprawdzane.py`): ten sam bohater, który
     zadanie zlecił, teraz przy nim siedzi.

     TEKST mówi, co się dzieje, i zaprasza z powrotem. Poprzedni („Nie musisz
     tu siedzieć i czekać") odprawiał dziecko od ekranu, na który samo weszło
     sprawdzić, jak poszło — a przy okazji nie mówił ani słowa o tym, że jego
     odpowiedź jest właśnie oglądana. */
  if (stan.czeka) {
    return (
      <div className="hub-pane" data-testid="hub-pane-zadanie">
        <div className="zadanie-czekanie">
          <img
            className="zadanie-sprawdzanie"
            src="/wizSprawdza.webp"
            alt=""
            aria-hidden="true"
            draggable="false"
          />
          <h3 className="czat-naglowek">Twoje zadanie jest sprawdzane</h3>
          <p>Wizkor zaniósł Twoją odpowiedź Mentorowi. Mentor właśnie ją ogląda. Zajrzyj tu później.</p>
          {stan.dowod?.zdjecieUrl ? (
            <img className="zadanie-podglad" src={stan.dowod.zdjecieUrl} alt="Twoje zdjęcie" />
          ) : null}
          {stan.dowod?.opis ? <p className="zadanie-notatka">„{stan.dowod.opis}”</p> : null}
        </div>
      </div>
    );
  }

  /* ── dowód: osobny, krótki drugi krok ───────────────────────────────── */
  if (etap === "dowod") {
    return (
      <div ref={panelRef} className="hub-pane" data-testid="hub-pane-zadanie-dowod">
        <button type="button" className="zadanie-powrot" onClick={() => setEtap("plan")}>
          <span aria-hidden="true">←</span> Wróć do zadania
        </button>
        <h3 className="czat-naglowek czat-naglowek--pisz">Pokaż Mentorowi</h3>
        {def.dowod ? <p className="zadanie-dowod">{def.dowod}</p> : null}

        <button
          type="button"
          className="zadanie-zdjecie"
          onClick={() => plikRef.current?.click()}
          disabled={wgrywanie}
        >
          {podglad ? (
            <img src={podglad} alt="Twoje zdjęcie" />
          ) : (
            <>
              <GameIcon name="camera" size={30} />
              <strong>{wgrywanie ? "Wysyłam zdjęcie…" : "Dodaj zdjęcie"}</strong>
            </>
          )}
        </button>
        <input
          ref={plikRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={dodajZdjecie}
          style={{ display: "none" }}
          data-testid="zadanie-plik"
        />

        <textarea
          className="zadanie-opis"
          value={opis}
          onChange={(zdarzenie) => setOpis(zdarzenie.target.value)}
          placeholder="Napisz, co zrobiłeś…"
          maxLength={600}
          rows={4}
        />
        {def.przyklad ? (
          <p className="zadanie-przyklad">
            <b>Na przykład:</b>
            <span>{def.przyklad}</span>
          </p>
        ) : null}

        {blad ? <p className="zadanie-blad">{blad}</p> : null}
        <div className="hub-actions">
          <button
            type="button"
            className="hub-btn hub-btn-primary"
            onClick={wyslij}
            disabled={wysylka || wgrywanie}
          >
            {wysylka ? "Wysyłam…" : "Wyślij do Mentora"}
          </button>
        </div>
      </div>
    );
  }

  /* ── plan: jedno zadanie, opcjonalne miejsce, jeden następny krok ───── */
  return (
    <div ref={panelRef} className="hub-pane" data-testid="hub-pane-zadanie">
      <div className="zadanie-karta">
        <h3 className="zadanie-tytul">{def.tytul}</h3>
        <p className="zadanie-cel">{def.cel}</p>
        {def.jak ? <p className="zadanie-jak">{def.jak}</p> : null}
        <button type="button" className="zadanie-glos" onClick={czytajZadanie}>
          <GameIcon name="sound" size={20} />
          Posłuchaj jeszcze raz
        </button>
      </div>

      {stan.status === "poprawka" && stan.notatka ? (
        <p className="hub-note hub-note-warn">
          <GameIcon name="pen" size={16} />
          Mentor pisze: „{stan.notatka}”
        </p>
      ) : null}

      <div className="hub-actions">
        <button type="button" className="hub-btn hub-btn-primary" onClick={() => setEtap("dowod")}>
          Już zrobione — pokażę Mentorowi
        </button>
      </div>

      <h3 className="czat-naglowek">Gdzie możesz to zrobić?</h3>
      <div className={`zadanie-miejsca${miejsce ? " ma-wybor" : ""}`}>
        {(def.miejsca || []).map((m) => (
          <button
            key={m.id}
            type="button"
            className={`zadanie-miejsce${miejsce === m.id ? " is-wybrane" : ""}`}
            onClick={() => setMiejsce(miejsce === m.id ? null : m.id)}
          >
            <span className="zadanie-pinezka" aria-hidden="true" />
            <span className="zadanie-miejsce-emoji" aria-hidden="true">{m.emoji}</span>
            <strong>{m.nazwa}</strong>
            {miejsce === m.id ? <small>{m.opis}</small> : null}
          </button>
        ))}
      </div>

    </div>
  );
}
