/*!
 * SPDX-FileCopyrightText: © 2026 Amitiel Angelisme <armitiel@gmail.com>
 * SPDX-License-Identifier: LicenseRef-EwolucJA-Proprietary
 *
 * EwolucJA — gra edukacyjna dla dzieci.
 * Produkt powstał w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”;
 * autorskie prawa majątkowe pozostają przy autorze. Licencja: LICENSE.
 */
/**
 * HybrydaPanel — ZADANIE HYBRYDOWE w zakładce Zadania (05 W1/W2, `hub/hybryda.js`).
 *
 * Odsłony, po jednej na fazę — nigdy dwie naraz:
 *   trop / czescA  → CZĘŚĆ A: jedno pytanie, trzy kafle (zakład, nie test);
 *                    po wyborze MOST: karta Wizkora, „Idę" albo „Zostaw otwarte"
 *   czeka          → CZĘŚĆ B: karta zadania (wariant 1–3 / 4–8, „Wersja na
 *                    gorszy dzień", miejsca) → „Do dzieła!" → ŚLAD z trzech opcji
 *                    + jedno zdanie ≤ 160 (bez zdjęcia do czasu W7)
 *   slad           → „Ślad zostawiony" — świat już zareagował; „Mentor już to
 *                    widzi" tylko przy prawdziwym, niedemowym Mentorze
 *   zauwazone      → „Mentor {zobaczył|zobaczyła}" + „Zobacz, co się zmieniło"
 *
 * Nad odsłoną stoi WPIS — tytuł i status R9 — tak, żeby w zakładce hybryda
 * była wpisem nad zadaniem z Koła, a nie drugim panelem.
 *
 * Kafle śladu i miejsca są wspólne z `ZadaniePanel` (`panels/wspolne/`).
 */
import React, { useCallback, useEffect, useRef, useState } from "react";
import { api } from "../../services/api.js";
import { miniaturaZPliku } from "../../services/miniatura.js";
import { useAppData } from "../../contexts/AppData.jsx";
import { zdjeciaWlaczone } from "./ZadaniePanel.jsx";
import { GameIcon } from "../../adventure/components/icons.jsx";
import { powiedzPostacia } from "../mowaPostaci.js";
import { odmienDlaGracza } from "../../services/rodzaj.js";
import { zdarzenie } from "../../services/zdarzenia.js";
import { etapSzkolny } from "../profilStartowy.js";
import SladWybor from "./wspolne/SladWybor.jsx";
import MiejscaZadania from "./wspolne/MiejscaZadania.jsx";
import {
  idz,
  kwestiaHybrydy,
  obrazekHybrydy,
  odlozMost,
  oznaczMiniature,
  oznaczZauwazoneObejrzane,
  reakcjaPoZauwazeniu,
  sprawdzMentora,
  stanHybrydy,
  wybierzA,
  zapiszMiejsce,
  zostawSlad,
  zWariantemHybrydy,
  ZDARZENIE_ZMIANY,
} from "../hybryda.js";

/* Kadr kamery z definicji (`reakcja.kadr`: `{ metoda, args }`), a bez niego
   `pokazMiejsce` (domek). Panel nie zna sceny — woła API globalne. */
function pokazKadr(kadr) {
  const s = globalThis.__SCENA;
  if (!s) return;
  try {
    const fn = kadr?.metoda ? s[kadr.metoda] : null;
    if (typeof fn === "function") { fn(...(kadr.args || [])); return; }
    s.pokazMiejsce?.();
  } catch {}
}

/** Wpis nad odsłoną: tytuł + status R9 (+ „Mentor już to widzi" tylko naprawdę). */
function WpisHybrydy({ def, stan, o }) {
  return (
    <div className="zadanie-karta" data-testid="hybryda-wpis" style={{ paddingBottom: 12 }}>
      <h3 className="zadanie-tytul">{o(def.tytul)}</h3>
      <p className="zadanie-jak" style={{ fontWeight: 700 }}>{o(stan.etykieta)}</p>
      {stan.slad && stan.mentorPrawdziwy ? <p className="zadanie-jak">{o("Mentor już to widzi")}</p> : null}
    </div>
  );
}

export default function HybrydaPanel({ onKomunikat, onZamknij, onPowrot }) {
  const { player } = useAppData();
  const [stan, setStan] = useState(() => stanHybrydy());
  const etapGracza = etapSzkolny();
  const mlodsi = etapGracza === "1-3";
  const o = useCallback((tekst) => odmienDlaGracza(tekst, player), [player]);
  const def = zWariantemHybrydy(stan.def, etapGracza);

  // „A" → „most" w części A; „plan" → „dowod" w części B.
  const [krok, setKrok] = useState(() => (stanHybrydy().czescA ? "most" : "A"));
  const [miejsce, setMiejsce] = useState(() => stanHybrydy().miejsce || null);
  const [sladOpcja, setSladOpcja] = useState(null);
  const [zdanie, setZdanie] = useState("");
  const [wysylka, setWysylka] = useState(false);
  const [blad, setBlad] = useState(null);
  /* ZDJĘCIE — tylko KR (`slad.zdjecie`) i tylko, gdy Mentor włączył
     `ustawienia.zdjecia` (06 §4.5). Ta sama droga, co w `ZadaniePanel`:
     canvas → JPEG ≤ 512 px bez EXIF (`services/miniatura.js`), a plik leci
     dopiero PO śladzie na `missionId` z seed/submit hybrydy. W scenie i tak
     wisi symbol; rysunek w domku pokazuje `WnetrzeDomku` po „Pokaż w domku". */
  const [miniatura, setMiniatura] = useState(null);
  const [podglad, setPodglad] = useState(null);
  const [wgrywanie, setWgrywanie] = useState(false);
  const plikRef = useRef(null);
  const panelRef = useRef(null);
  const mostPrzeczytany = useRef(false);

  useEffect(() => {
    const odswiez = () => setStan(stanHybrydy());
    window.addEventListener(ZDARZENIE_ZMIANY, odswiez);
    return () => window.removeEventListener(ZDARZENIE_ZMIANY, odswiez);
  }, []);

  useEffect(() => {
    if (stan.czeka) setKrok("plan");
    else if (stan.czescA) setKrok("most");
    else if (stan.trop) setKrok("A");
  }, [stan.faza]);

  /* Powrót z drugiego kroku w krzyżyku belki — jak w ZadaniePanel. */
  const wrocDoPlanu = useCallback(() => setKrok("plan"), []);
  useEffect(() => {
    onPowrot?.(krok === "dowod" ? wrocDoPlanu : null);
    return () => onPowrot?.(null);
  }, [onPowrot, krok, wrocDoPlanu]);

  useEffect(() => {
    const przewijany = panelRef.current?.closest(".hub-sheet-body");
    if (przewijany) przewijany.scrollTop = 0;
  }, [krok]);

  /* WIZKOR MÓWI MOST RAZ, gdy dziecko postawiło zakład (głos, nie karta —
     karta ≤ 60 stoi na ekranie). Ta sama barwa, co u czarodzieja. */
  useEffect(() => {
    if (krok !== "most" || !def || mostPrzeczytany.current) return;
    mostPrzeczytany.current = true;
    const q = kwestiaHybrydy(stan.def, "wizkor", "most", etapGracza);
    powiedzPostacia(o(q?.tekst || def.most?.glos), { glos: "las_decyzji", ton: "mystery" });
  }, [krok, def, stan.def, etapGracza, o]);

  const czytajZadanie = useCallback(() => {
    if (!def) return;
    powiedzPostacia(o([def.cel, def.jak].filter(Boolean).join(" ")), { glos: "las_decyzji", ton: "mystery" });
  }, [def, o]);

  /* Część B czytana raz, przy wejściu w „plan" (jak w ZadaniePanel). */
  useEffect(() => {
    if (krok === "plan" && stan.czeka) czytajZadanie();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [krok, stan.czeka]);

  /* Czy Mentor zauważył — raz przy otwarciu odsłony „ślad", bez pollingu. */
  useEffect(() => {
    if (!stan.slad || !stan.missionId) return undefined;
    let porzucone = false;
    (async () => {
      try { const nowy = await sprawdzMentora(); if (!porzucone) setStan(nowy); } catch {}
    })();
    return () => { porzucone = true; };
  }, [stan.slad, stan.missionId]);

  const dodajZdjecie = useCallback(async (ev) => {
    const plik = ev.target.files?.[0];
    if (!plik) return;
    if (!plik.type.startsWith("image/")) { setBlad("To nie jest zdjęcie."); return; }
    if (plik.size > 20 * 1024 * 1024) { setBlad("Zdjęcie jest za duże. Spróbuj mniejsze."); return; }
    setBlad(null);
    setWgrywanie(true);
    try {
      const m = await miniaturaZPliku(plik);
      setMiniatura(m.obraz);
      setPodglad(m.obraz);
    } catch {
      setMiniatura(null);
      setPodglad(null);
      setBlad("Nie udało się odczytać zdjęcia. Wybierz symbol albo napisz zdanie.");
    } finally {
      setWgrywanie(false);
      try { ev.target.value = ""; } catch {}
    }
  }, []);

  if (!stan.istnieje || !def) return null;

  /* ── zauważone ─────────────────────────────────────────────────────── */
  if (stan.zauwazone) {
    const zobacz = () => {
      const r = reakcjaPoZauwazeniu();
      oznaczZauwazoneObejrzane();
      if (r?.tekst) powiedzPostacia(o(r.tekst), { glos: "gora_podsumowania", ton: "calm" });
      if (r?.toast?.tytul) onKomunikat?.(r.toast.tytul, { opis: r.toast.opis });
      pokazKadr(r?.kadr);
      onZamknij?.();
    };
    return (
      <div className="hub-pane" data-testid="hub-pane-hybryda">
        <WpisHybrydy def={def} stan={stan} o={o} />
        <div className="zadanie-nagroda">
          <GameIcon name="star" size={40} />
          <h3 className="czat-naglowek">{o(stan.etykieta)}</h3>
          {stan.notatka ? <p className="zadanie-notatka">„{o(stan.notatka)}”</p> : null}
          {!stan.zauwazoneObejrzane ? (
            <button type="button" className="hub-btn hub-btn-primary" onClick={zobacz}>{o(stan.cta)}</button>
          ) : (
            <p className="zadanie-jak">{o(def.trwaly_obiekt || "")}</p>
          )}
        </div>
      </div>
    );
  }

  /* ── ślad zostawiony ───────────────────────────────────────────────── */
  if (stan.slad) {
    const wybor = Number.isInteger(stan.sladWybor) ? def.slad?.opcje?.[stan.sladWybor] : null;
    return (
      <div className="hub-pane" data-testid="hub-pane-hybryda">
        <WpisHybrydy def={def} stan={stan} o={o} />
        <div className="zadanie-czekanie">
          <img className="zadanie-sprawdzanie" src="/wizSprawdza.webp" alt="" aria-hidden="true" draggable="false" />
          <h3 className="czat-naglowek">{o("Ślad zostawiony")}</h3>
          <p>{o(`To, co {zrobiłeś|zrobiłaś}, zostawiło ślad ${def.miejsce_reakcji || "na polanie"}. Zobacz na polanie.`)}</p>
          {wybor ? <p className="zadanie-notatka">{obrazekHybrydy(def.slad?.obrazki?.[stan.sladWybor])} {o(wybor)}</p> : null}
          {stan.sladZdanie ? <p className="zadanie-notatka">„{stan.sladZdanie}”</p> : null}
          <div className="hub-actions">
            <button type="button" className="hub-btn hub-btn-primary" onClick={() => { pokazKadr(def.reakcja?.kadr); onZamknij?.(); }}>
              {o("Zobacz na polanie")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── część A: pytanie i trzy kafle ─────────────────────────────────── */
  if ((stan.trop || stan.czescA) && krok === "A") {
    const A = def.czescA || {};
    return (
      <div ref={panelRef} className="hub-pane" data-testid="hub-pane-hybryda-a">
        <WpisHybrydy def={def} stan={stan} o={o} />
        <div className="zadanie-karta">
          {A.wprowadzenie ? <p className="zadanie-jak">{o(A.wprowadzenie)}</p> : null}
          <p className="zadanie-cel">{o(A.pytanie)}</p>
        </div>
        <div className={`zadanie-miejsca zadanie-slad${stan.wyborA ? " ma-wybor" : ""}`} data-testid="hybryda-kafle">
          {(A.opcje || []).map((op) => (
            <button
              key={op.id}
              type="button"
              className={`zadanie-miejsce${stan.wyborA === op.id ? " is-wybrane" : ""}`}
              onClick={() => { setStan(wybierzA(op.id)); setKrok("most"); }}
            >
              <span className="zadanie-pinezka" aria-hidden="true" />
              <span className="zadanie-miejsce-emoji" aria-hidden="true">{op.emoji}</span>
              <strong>{o(op.tekst)}</strong>
            </button>
          ))}
        </div>
      </div>
    );
  }

  /* ── most: karta Wizkora, „Idę" / „Zostaw otwarte" ─────────────────── */
  if (stan.trop || stan.czescA) {
    const M = def.most || {};
    const wybrana = (def.czescA?.opcje || []).find((x) => x.id === stan.wyborA);
    return (
      <div ref={panelRef} className="hub-pane" data-testid="hub-pane-hybryda-most">
        <WpisHybrydy def={def} stan={stan} o={o} />
        <div className="zadanie-czekanie">
          <img className="zadanie-sprawdzanie" src="/wizPop.webp" alt="" aria-hidden="true" draggable="false" />
          {wybrana ? <p className="zadanie-notatka">{wybrana.emoji} {o(`Twój zakład: ${wybrana.tekst.toLowerCase()}.`)}</p> : null}
          <p className="zadanie-cel">{o(M.karta || "")}</p>
          <button type="button" className="zadanie-glos" onClick={() => powiedzPostacia(o(M.glos), { glos: "las_decyzji", ton: "mystery" })}>
            <GameIcon name="sound" size={20} />
            Posłuchaj jeszcze raz
          </button>
        </div>
        <div className="hub-actions">
          <button
            type="button"
            className="hub-btn"
            onClick={() => { setStan(odlozMost()); onZamknij?.(); window.setTimeout(() => pokazKadr(def.czescA?.kadr), 450); }}
          >
            {o(M.przyciskOtwarte || "Zostaw otwarte")}
          </button>
          <button
            type="button"
            className="hub-btn hub-btn-primary"
            onClick={() => { setStan(idz()); setKrok("plan"); }}
          >
            {o(M.przycisk || "Idę")}
          </button>
        </div>
        <button type="button" className="zadanie-glos" onClick={() => setKrok("A")}>
          {o("Zmień zakład")}
        </button>
      </div>
    );
  }

  /* ── część B: ślad ─────────────────────────────────────────────────── */
  if (stan.czeka && krok === "dowod") {
    const S = def.slad || {};
    const wyslij = async () => {
      const maWybor = Number.isInteger(sladOpcja) && S.opcje?.length;
      if (!zdanie.trim() && !maWybor) {
        setBlad("Wybierz jedną z kartek albo napisz jedno zdanie.");
        return;
      }
      setBlad(null);
      setWysylka(true);
      try {
        /* Świat reaguje od razu (`zostawSlad` woła scenę), narratorka mówi
           teraz; kadr kamery czeka na „Zobacz na polanie" — pod otwartą
           szufladą scena stoi zapauzowana. */
        const { stan: nowy, toast, narratorka } = await zostawSlad({ opcja: maWybor ? sladOpcja : null, zdanie: zdanie.trim() });
        setStan(nowy);
        if (miniatura && nowy?.missionId) {
          try { await api.wyslijMiniature(nowy.missionId, miniatura); setStan(oznaczMiniature(nowy.missionId)); }
          catch (err) { setPodglad(null); setBlad(err?.kod === "zdjecia_wylaczone" ? "Zdjęcia włącza Mentor." : "Zdjęcie nie chce się wysłać. Ślad i tak został."); }
        }
        if (toast?.tytul) onKomunikat?.(toast.tytul, { opis: toast.opis });
        if (narratorka) powiedzPostacia(o(narratorka), { glos: "gora_podsumowania", ton: "calm" });
      } catch (err) {
        setBlad(err?.message || "Nie udało się zostawić śladu. Spróbuj za chwilę.");
      } finally {
        setWysylka(false);
      }
    };
    return (
      <div ref={panelRef} className="hub-pane" data-testid="hub-pane-hybryda-dowod">
        <h3 className="czat-naglowek czat-naglowek--pisz">{o("Pokaż, co {zrobiłeś|zrobiłaś}")}</h3>
        {stan.mentorPrawdziwy ? <p className="zadanie-notatka">{o("Mentor to zobaczy.")}</p> : null}
        <SladWybor
          opcje={S.opcje || []}
          obrazki={S.obrazki || []}
          wybrana={sladOpcja}
          onWybor={setSladOpcja}
          obrazek={obrazekHybrydy}
          o={o}
          testId="hybryda-slad"
        />
        {S.zdjecie && zdjeciaWlaczone(player) ? (<>
          <button type="button" className="zadanie-zdjecie" onClick={() => plikRef.current?.click()} disabled={wgrywanie}>
            {podglad ? (
              <img src={podglad} alt="Twoje zdjęcie" />
            ) : (
              <>
                <GameIcon name="camera" size={30} />
                <strong>{wgrywanie ? "Przygotowuję zdjęcie…" : "Dodaj zdjęcie rysunku"}</strong>
                <small>{o(S.podpowiedz || "Bez twarzy, bez okna, bez numeru domu.")}</small>
              </>
            )}
          </button>
          <input ref={plikRef} type="file" accept="image/*" capture="environment" onChange={dodajZdjecie} style={{ display: "none" }} data-testid="hybryda-plik" />
        </>) : null}
        {S.zdanie !== false && !(S.zdanieTylko && S.zdanieTylko !== etapGracza) ? (
          <textarea
            className="zadanie-opis"
            value={zdanie}
            onChange={(e) => setZdanie(e.target.value)}
            placeholder={o(S.pytanieZdania || "Jedno zdanie o tym, co powstało")}
            maxLength={160}
            rows={3}
          />
        ) : null}
        {blad ? <p className="zadanie-blad">{o(blad)}</p> : null}
        <div className="hub-actions">
          <button type="button" className="hub-btn hub-btn-primary" onClick={wyslij} disabled={wysylka || wgrywanie}>
            {wysylka ? "Zostawiam…" : "Zostaw ślad"}
          </button>
        </div>
      </div>
    );
  }

  /* ── część B: karta zadania, miejsca ───────────────────────────────── */
  return (
    <div ref={panelRef} className="hub-pane" data-testid="hub-pane-hybryda">
      <WpisHybrydy def={def} stan={stan} o={o} />
      <div className="zadanie-karta">
        <p className="zadanie-cel">{o(def.cel)}</p>
        {def.jak && !mlodsi ? <p className="zadanie-jak">{o(def.jak)}</p> : null}
        {mlodsi && def.przyklad ? <p className="zadanie-jak">{o(def.przyklad)}</p> : null}
        {def.minimum ? (
          <p className="zadanie-przyklad">
            <b>{o("Wersja na gorszy dzień:")}</b>
            <span>{o(def.minimum)}</span>
          </p>
        ) : null}
        <button type="button" className="zadanie-glos" onClick={czytajZadanie}>
          <GameIcon name="sound" size={20} />
          Posłuchaj jeszcze raz
        </button>
      </div>

      <div className="hub-actions">
        <button type="button" className="hub-btn hub-btn-primary" onClick={() => setKrok("dowod")}>
          Do dzieła!
        </button>
      </div>

      <MiejscaZadania
        miejsca={def.miejsca || []}
        wybrane={miejsce}
        o={o}
        onWybor={(nowe) => {
          setMiejsce(nowe);
          zapiszMiejsce(nowe);
          if (nowe) zdarzenie("miejsce.wybrane", { zadanie: `hybryda:${def.id}`, miejsce: nowe, etap: etapGracza || "oba" });
        }}
      />
    </div>
  );
}
