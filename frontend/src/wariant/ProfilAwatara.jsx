/**
 * ProfilAwatara — „Twój profil" jako popup W2.
 *
 * NIE ma własnych styli: korzysta z arkusza poprzedniej wersji
 * `hub/styles/hub.css` i z tych samych klas, co profil w hubie
 * (`hub/panels/ProfilPanel.jsx`) — `.profil-kafel`, `.profil-awatar`,
 * `.profil-imie`, `.hub-coin`, `.hub-sec-title`, `.hub-grid`, `.hub-tile-in
 * .profil-cecha`, `.profil-pasek`. Dzięki temu kafel bohatera i płytki cech
 * wyglądają dokładnie tak samo w obu światach, a poprawka wyglądu robi się
 * w jednym pliku. Arkusz jest bezpieczny do wciągnięcia tutaj: wszystkie
 * reguły są na klasach z prefiksem (`hub-`/`profil-`), zero selektorów
 * elementowych, więc nic nie przecieka na resztę W2.
 *
 * Różnica merytoryczna wobec starego profilu: sześć TYPÓW (ST/MD/EM/KR/DT/LD)
 * zamiast pięciu cech zadaniowych — decyzja z 2026-09-14,
 * `docs/WERSJA_AKTUALNA.md`. Płytki stoją zawsze, także na zerach.
 *
 * W2 nie wczytuje konta przez AppData (jawny wyjątek w `contexts/AppData.jsx`),
 * więc gracza dociągamy tu sami; bez konta zostaje awatar, imię i zera.
 */
import React, { useEffect, useRef, useState } from "react";
import { PROFILE_INFO } from "../components/ProfileAvatar.jsx";
import { GROWTH_TIPS } from "../growthData.js";
import { api, session } from "../services/api.js";
import HubIcon from "../hub/HubIcons.jsx";
import "../hub/styles/hub.css";

const KLUCZ_TYP = "ewolucja.profil.typ";

// Kolejnosc i barwy jak na radarze (`components/CharakterBohatera.jsx`) —
// dziecko ma widziec te same szesc osi, gdziekolwiek na nie patrzy.
const CECHY = [
  { kod: "DT", nazwa: "Ciekawość",   kolor: "#5FA76F" },
  { kod: "KR", nazwa: "Kreatywność", kolor: "#EF9F27" },
  { kod: "EM", nazwa: "Życzliwość",  kolor: "#E4779C" },
  { kod: "LD", nazwa: "Odwaga",      kolor: "#E89A3D" },
  { kod: "ST", nazwa: "Mądrość",     kolor: "#7A4DC2" },
  { kod: "MD", nazwa: "Skupienie",   kolor: "#378ADD" },
];
// Stala skala, ta sama co radar: quiz daje max 24, zadania dokladaja powoli.
const SKALA = 50;

export default function ProfilAwatara({ imie, onZapiszImie }) {
  const [gracz, setGracz] = useState(null);
  const [typ, setTyp] = useState(() => { try { return localStorage.getItem(KLUCZ_TYP); } catch { return null; } });

  useEffect(() => {
    let zywy = true;
    const id = session.getPlayer();
    if (!id) return;
    api.getPlayer(id)
      .then((p) => { if (!zywy) return; setGracz(p); if (p?.archetype) setTyp(p.archetype); })
      .catch(() => {});
    return () => { zywy = false; };
  }, []);

  const info = PROFILE_INFO[typ];
  const opis = GROWTH_TIPS[typ]?.desc;
  const wyniki = gracz?.lifetime_scores || {};

  // Imię zmienia się NA MIEJSCU. Ołówek zamienia napis w pole tekstowe;
  // Enter albo kliknięcie obok zapisuje, Escape cofa. Osobne okno
  // („Poznajmy się") było całą ankietą od nowa tylko po to, żeby poprawić
  // literówkę w imieniu — dziecko gubiło kontekst profilu.
  const [edycja, setEdycja] = useState(false);
  const [wpis, setWpis] = useState("");
  const poleRef = useRef(null);
  const imieAktualne = imie || gracz?.player_name || "Wędrowiec";

  useEffect(() => { if (edycja) poleRef.current?.select(); }, [edycja]);

  function zacznijEdycje() {
    setWpis(imieAktualne === "Wędrowiec" ? "" : imieAktualne);
    setEdycja(true);
  }
  function zapiszImie() {
    const nowe = wpis.trim().slice(0, 24);
    if (nowe && nowe !== imieAktualne) onZapiszImie?.(nowe);
    setEdycja(false);
  }

  return (
    <div className="hub-pane" data-testid="w2-pane-profil">
      <div className="profil-kafel">
        {/* Awatar jest już okrągłą plakietką ze złotym rantem — własne
            zaokrąglenie i `cover` ucinały mu uszy. Wpisujemy go w kółko
            `.profil-awatar` w całości (`contain`), bez maski. */}
        <span className="profil-awatar profil-awatar--plakietka">
          <img src={info?.svgMini || "/fox_avatar.png"} alt="" width={132} height={132}
               style={{ width: 132, height: 132, objectFit: "contain", display: "block" }} />
        </span>
        <span className="profil-imie-rzad">
          {edycja ? (
            <input
              ref={poleRef}
              className="profil-imie-pole"
              value={wpis}
              maxLength={24}
              autoFocus
              autoComplete="off"
              aria-label="Twoje imię"
              placeholder="Twoje imię"
              onChange={(e) => setWpis(e.target.value)}
              onBlur={zapiszImie}
              onKeyDown={(e) => {
                if (e.key === "Enter") { e.preventDefault(); zapiszImie(); }
                if (e.key === "Escape") { e.preventDefault(); setEdycja(false); }
              }}
            />
          ) : (
            <>
              <strong className="profil-imie">{imieAktualne}</strong>
              {onZapiszImie && (
                <button type="button" className="profil-edycja" onClick={zacznijEdycje} aria-label="Zmień imię">
                  <HubIcon name="olowek" size={18} />
                </button>
              )}
            </>
          )}
        </span>
        <span className="hub-coin hub-coin--duza">
          <img src="/assets/hub-nav/moneta.png" alt="" aria-hidden="true" draggable="false" />
          {gracz?.coins ?? 0}
        </span>
      </div>

      {opis && <p className="hub-note">{opis}</p>}

      <div className="hub-sec-title"><h3>Mocne strony</h3></div>

      <div className="hub-grid">
        {CECHY.map((c) => {
          const v = wyniki[c.kod] || 0;
          return (
            <div className="hub-tile" key={c.kod}>
              <span className="hub-tile-in profil-cecha">
                <strong>{c.nazwa}</strong>
                <span className="profil-pasek">
                  <i style={{ width: `${Math.max(3, Math.round((v / SKALA) * 100))}%`, background: c.kolor }} />
                </span>
                <span className="hub-coin">{v}</span>
              </span>
            </div>
          );
        })}
      </div>

    </div>
  );
}
