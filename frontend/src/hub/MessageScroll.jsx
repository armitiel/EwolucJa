/**
 * MessageScroll — wiadomości jako rozwijany zwój, wersja z podglądu
 * `public/scena-3d/index.html`. Nie jest to zwykły arkusz z pergaminową
 * grafiką: pergamin ROZWIJA SIĘ do wysokości treści, a rozłożenie pojedynczej
 * wiadomości dolicza jej wysokość i animuje zwój dalej. Stąd pomiar w JS —
 * CSS nie potrafi animować `height: auto`.
 *
 * Wzór wysokości przeniesiony 1:1 z podglądu:
 *   (scrollHeight listy + 56) / 0.85 + pionowe marginesy papieru,
 * przycięty do 360–530 px. 0.85 to skala papieru wewnątrz rolek, 56 to zapas
 * na nagłówek; bez tego zapasu ostatnia wiadomość chowa się pod dolną rolką.
 */
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdventureDane } from "../adventure/engine/useAdventure.js";
import { kiedyTekst, oznaczPrzeczytana, wpisZadania, zbierzWiadomosci } from "./wiadomosci.js";

const MIN_WYSOKOSC = 360;
const MAX_WYSOKOSC = 530;

export default function MessageScroll({ open, onClose, onZmiana }) {
  const navigate = useNavigate();
  const pergaminRef = useRef(null);
  const papierRef = useRef(null);
  const listaRef = useRef(null);
  const czasomierzRef = useRef(null);

  const { adventure, state, nextStep } = useAdventureDane();
  const [wiesci, setWiesci] = useState([]);
  const [rozwinieta, setRozwinieta] = useState(null);
  const [ladowanie, setLadowanie] = useState(true);

  // Zadanie w realu stoi na górze i nie miesza się z wieściami — ma inny
  // status (trwa) niż one (przyszły, przeczytane, koniec).
  const zadanie = useMemo(() => wpisZadania(adventure, state, nextStep), [adventure, state, nextStep]);
  const pozycje = useMemo(() => (zadanie ? [zadanie, ...wiesci] : wiesci), [zadanie, wiesci]);

  /* ── pomiar: pergamin rośnie do treści ───────────────────────────────── */
  const przelicz = useCallback((animowane) => {
    const pergamin = pergaminRef.current;
    const papier = papierRef.current;
    const lista = listaRef.current;
    if (!pergamin || !papier || !lista) return;

    const style = window.getComputedStyle(papier);
    const obudowa = (parseFloat(style.top) || 0) + (parseFloat(style.bottom) || 0);
    const docelowa = Math.ceil((lista.scrollHeight + 56) / 0.85 + obudowa);

    if (animowane) pergamin.classList.add("is-resizing");
    pergamin.style.setProperty(
      "--message-scroll-height",
      `${Math.max(MIN_WYSOKOSC, Math.min(MAX_WYSOKOSC, docelowa))}px`
    );
    window.clearTimeout(czasomierzRef.current);
    czasomierzRef.current = window.setTimeout(() => {
      pergaminRef.current?.classList.remove("is-resizing");
    }, 380);
  }, []);

  useEffect(() => () => window.clearTimeout(czasomierzRef.current), []);

  /* ── dane: świeże przy każdym otwarciu ───────────────────────────────── */
  useEffect(() => {
    if (!open) return;
    let aktualne = true;
    setLadowanie(true);
    zbierzWiadomosci().then((dane) => {
      if (!aktualne) return;
      setWiesci(dane);
      setLadowanie(false);
    });
    return () => { aktualne = false; };
  }, [open]);

  // Pierwszy pomiar BEZ animacji (zwój ma się rozwinąć raz, do gotowej
  // wysokości), każdy kolejny — z animacją.
  useLayoutEffect(() => {
    if (open) przelicz(false);
  }, [open, ladowanie, pozycje.length, przelicz]);

  useEffect(() => {
    if (!open) return undefined;
    const naKlawisz = (e) => { if (e.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", naKlawisz);
    return () => window.removeEventListener("keydown", naKlawisz);
  }, [open, onClose]);

  async function przelaczPozycje(pozycja) {
    const zwijamy = rozwinieta === pozycja.klucz;
    setRozwinieta(zwijamy ? null : pozycja.klucz);
    window.requestAnimationFrame(() => przelicz(true));
    if (zwijamy || !pozycja.nieprzeczytana) return;

    setWiesci((poprzednie) =>
      poprzednie.map((p) => (p.klucz === pozycja.klucz ? { ...p, nieprzeczytana: false } : p))
    );
    await oznaczPrzeczytana(pozycja);
    onZmiana?.();
  }

  return (
    <section
      className={`message-scroll${open ? " is-open" : ""}`}
      aria-hidden={open ? "false" : "true"}
      aria-label="Wiadomości"
      data-testid="hub-message-scroll"
    >
      <button className="message-scroll-backdrop" type="button" aria-label="Zamknij wiadomości" onClick={onClose} />

      <div className="message-scroll-parchment" ref={pergaminRef} role="dialog" aria-modal="false" aria-label="Wiadomości">
        <div className="message-scroll-paper" ref={papierRef}>
          <div className="message-scroll-content">
            <div className="message-scroll-list" ref={listaRef}>
              {ladowanie ? (
                <p className="message-scroll-note">Zaglądam do skrzynki…</p>
              ) : pozycje.length === 0 ? (
                <p className="message-scroll-note">Na razie cisza. To też jest w porządku.</p>
              ) : (
                pozycje.map((pozycja) => {
                  const otwarta = rozwinieta === pozycja.klucz;
                  // „Zobacz" ma sens tylko wtedy, gdy prowadzi GDZIE INDZIEJ.
                  // Wieść o rozjaśnieniu świata pokazuje się w tym samym świecie,
                  // po którym dziecko właśnie chodzi — przycisk kazałby mu
                  // „przejść" tam, gdzie już jest. Stare cele na mapę 2D
                  // odpadają z tego samego powodu: tej mapy już nie ma.
                  const celObcy =
                    !!pozycja.to && pozycja.to !== "/swiat" && !pozycja.to.startsWith("/mapa");
                  return (
                    <article
                      key={pozycja.klucz}
                      className={`scroll-message${pozycja.nieprzeczytana ? " is-unread" : ""}${
                        pozycja.przypieta ? " is-quest" : ""
                      }`}
                    >
                      <button
                        className="scroll-message-head"
                        type="button"
                        aria-expanded={otwarta}
                        onClick={() => przelaczPozycje(pozycja)}
                      >
                        <span className="scroll-message-avatar">
                          <img src={pozycja.ikona} alt="" aria-hidden="true" draggable="false" />
                        </span>
                        <span className="scroll-message-copy">
                          <strong>{pozycja.tytul}</strong>
                          <small>{otwarta ? "" : pozycja.tresc}</small>
                        </span>
                        <span className="scroll-message-meta">
                          {pozycja.przypieta ? pozycja.etykieta : kiedyTekst(pozycja.kiedy)}
                          {pozycja.nieprzeczytana ? <i /> : null}
                        </span>
                      </button>

                      <div className="scroll-message-body" hidden={!otwarta}>
                        {pozycja.autor ? <span>od {pozycja.autor}</span> : null}
                        <p>{pozycja.tresc}</p>
                        {pozycja.jak ? <p className="scroll-message-how">{pozycja.jak}</p> : null}
                        {pozycja.notatka ? <p className="scroll-message-note">„{pozycja.notatka}”</p> : null}
                        {celObcy ? (
                          <button
                            type="button"
                            className="hub-btn hub-btn-primary"
                            onClick={() => { onClose?.(); navigate(pozycja.to); }}
                          >
                            {pozycja.cta || "Zobacz"}
                          </button>
                        ) : null}
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <button className="message-scroll-close" type="button" aria-label="Zamknij wiadomości" onClick={onClose}>×</button>
        <img className="message-scroll-rod message-scroll-rod--top" src="/zwoj-gora.svg" alt="" aria-hidden="true" />
        <img className="message-scroll-rod message-scroll-rod--bottom" src="/zwoj-gora.svg" alt="" aria-hidden="true" />
      </div>
    </section>
  );
}
