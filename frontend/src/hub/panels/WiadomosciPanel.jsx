/**
 * WiadomosciPanel — jedna spokojna skrzynka na dwa strumienie, które do dziś
 * żyły osobno: powiadomienia świata (`adventure/engine/notifications.js`,
 * modal na mapie) i wiadomości Mentora (`api.getAllHints`, tab w Poradach).
 *
 * Reguły utrzymane z poprzedniego wycinka: nic nie wyskakuje, nic nie ponagla,
 * brak konsekwencji za nieprzeczytanie.
 */
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GameIcon } from "../../adventure/components/icons.jsx";
import { listNotifications, markRead } from "../../adventure/engine/notifications.js";
import { api, session } from "../../services/api.js";

const ETYKIETY_MENTORA = { hint: "Podpowiedź", artifact: "Artefakt", message: "Wiadomość" };

function dataTekst(wartosc) {
  if (!wartosc) return "";
  const data = new Date(wartosc);
  if (Number.isNaN(data.getTime())) return "";
  return data.toLocaleDateString("pl-PL", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

function czasMs(wartosc) {
  const ms = new Date(wartosc || 0).getTime();
  return Number.isNaN(ms) ? 0 : ms;
}

export default function WiadomosciPanel({ onZmiana, onZamknij }) {
  const navigate = useNavigate();
  const [pozycje, setPozycje] = useState([]);
  const [otwarta, setOtwarta] = useState(null);
  const [ladowanie, setLadowanie] = useState(true);

  const zbierz = useCallback(async () => {
    const swiat = listNotifications().map((wpis) => ({
      klucz: `swiat-${wpis.id}`,
      zrodlo: "swiat",
      id: wpis.id,
      tytul: wpis.title,
      tresc: wpis.body,
      kiedy: wpis.at,
      nieprzeczytana: !wpis.read,
      to: wpis.to,
      autor: null,
    }));

    let mentor = [];
    const pid = session.getPlayer();
    if (pid) {
      try {
        const dane = await api.getAllHints(pid);
        mentor = (dane?.hints || []).map((wpis) => ({
          klucz: `mentor-${wpis.id}`,
          zrodlo: "mentor",
          id: wpis.id,
          tytul: wpis.title || ETYKIETY_MENTORA[wpis.kind] || "Wiadomość od Mentora",
          tresc: wpis.body,
          kiedy: wpis.sent_at,
          nieprzeczytana: !wpis.viewed_at,
          to: null,
          autor: wpis.mentor_name || null,
        }));
      } catch (err) {
        // Brak sieci nie może wygasić skrzynki — świat zostaje widoczny.
        console.warn("[WiadomosciPanel] getAllHints nie odpowiedział:", err);
      }
    }

    setPozycje([...swiat, ...mentor].sort((a, b) => czasMs(b.kiedy) - czasMs(a.kiedy)));
    setLadowanie(false);
  }, []);

  useEffect(() => {
    zbierz();
  }, [zbierz]);

  async function otworzPozycje(pozycja) {
    setOtwarta(otwarta === pozycja.klucz ? null : pozycja.klucz);
    if (!pozycja.nieprzeczytana) return;

    setPozycje((poprzednie) => poprzednie.map((p) => (p.klucz === pozycja.klucz ? { ...p, nieprzeczytana: false } : p)));
    if (pozycja.zrodlo === "swiat") {
      markRead(pozycja.id);
    } else {
      const pid = session.getPlayer();
      if (pid) {
        try { await api.markHintViewed(pid, pozycja.id); }
        catch (err) { console.warn("[WiadomosciPanel] markHintViewed nie odpowiedział:", err); }
      }
    }
    onZmiana?.();
  }

  const nieprzeczytane = pozycje.filter((p) => p.nieprzeczytana).length;

  return (
    <div className="hub-pane" data-testid="hub-pane-wiadomosci">
      <p className="hub-note">
        <GameIcon name="scroll" size={18} />
        <span>
          Spokojna skrzynka: nic nie wyskakuje, wszystko czeka tutaj. Możesz tu nie zaglądać przez tydzień
          i nic się nie stanie.
        </span>
      </p>

      {ladowanie ? (
        <p className="hub-muted">Zaglądam do skrzynki…</p>
      ) : pozycje.length === 0 ? (
        <div className="hub-card hub-empty">
          <GameIcon name="scroll" size={26} />
          <p>Na razie cisza. To też jest w porządku.</p>
        </div>
      ) : (
        <>
          <div className="hub-list-head">
            <span className="hub-muted">{pozycje.length} wiadomości</span>
            {nieprzeczytane > 0 ? <span className="hub-muted">{nieprzeczytane} nieprzeczytane</span> : null}
          </div>

          {pozycje.map((pozycja) => {
            const rozwinieta = otwarta === pozycja.klucz;
            return (
              <div key={pozycja.klucz} className={`hub-msg${pozycja.nieprzeczytana ? " is-unread" : ""}`}>
                <button type="button" className="hub-msg-head" onClick={() => otworzPozycje(pozycja)}>
                  <span className="hub-msg-av">
                    <GameIcon name={pozycja.zrodlo === "mentor" ? "profile" : "spark"} size={19} />
                  </span>
                  <span className="hub-msg-copy">
                    <strong>{pozycja.tytul}</strong>
                    <small>{rozwinieta ? "" : pozycja.tresc}</small>
                  </span>
                  <span className="hub-msg-when">
                    {dataTekst(pozycja.kiedy)}
                    {pozycja.nieprzeczytana ? <i className="hub-msg-dot" /> : null}
                  </span>
                </button>

                {rozwinieta ? (
                  <div className="hub-msg-body">
                    {pozycja.autor ? <span className="hub-kicker">od {pozycja.autor}</span> : null}
                    <p>{pozycja.tresc}</p>
                    {pozycja.to ? (
                      <button
                        type="button"
                        className="hub-btn hub-btn-primary"
                        onClick={() => { onZamknij?.(); navigate(pozycja.to); }}
                      >
                        Zobacz
                      </button>
                    ) : null}
                  </div>
                ) : null}
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
