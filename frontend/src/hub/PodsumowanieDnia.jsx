/*!
 * SPDX-FileCopyrightText: © 2026 Amitiel Angelisme <armitiel@gmail.com>
 * SPDX-License-Identifier: LicenseRef-EwolucJA-Proprietary
 *
 * EwolucJA — gra edukacyjna dla dzieci.
 * Produkt powstał w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”;
 * autorskie prawa majątkowe pozostają przy autorze. Licencja: LICENSE.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { powiedzPostacia } from "./mowaPostaci.js";
import { odmienDlaGracza } from "../services/rodzaj.js";
import { etapSzkolny } from "./profilStartowy.js";
import SEKWENCJA from "./data/koniec-dnia.v1.json";

/**
 * PodsumowanieDnia — sekwencja końca dnia. Ostatnie, co dziecko widzi, zanim
 * odłoży urządzenie, i jedyne miejsce, w którym świat prosi je o coś naprawdę.
 *
 * OD 17.09 CZYTA REALNY STAN GRACZA (`docs/tresci/02` §3.3), nie makietę:
 *   `stan`  — nic | zadanie | slad | zauwazone (z `stanZadaniaWizkora()`),
 *   `domek` — brak | plac | domek (z `stanDrewna()`),
 *   `wpisy` — dziennik dnia (ostatnia zmiana w świecie),
 *   `tytul` / `miejsce` — z karty zadania w realu.
 * Treść i warianty stoją w `data/koniec-dnia.v1.json` (wersja 2) — to jest
 * plik do edycji, nie ten komponent. Cztery rzeczy, które łatwo zepsuć:
 * żadne zdanie nie opisuje dziecka (poza tokenem tam, gdzie musi), zero liczb,
 * przycisk kończy dzień i nie zobowiązuje, „poza ekranem" = „u ciebie".
 */
const OBRAZ_WIZKORA = "/wizPop.webp";
const OBRAZ_LISKA = "/lisPop.webp";

/** Głosy postaci — te same barwy, co w reszcie świata (`mowaPostaci.js`). */
const GLOSY = {
  narratorka: { glos: "gora_podsumowania", ton: "calm" },
  wizkor: { glos: "las_decyzji", ton: "mystery" },
  lisek: { glos: "lisek", ton: "zabawa" },
};

const PORTRETY = { wizkor: OBRAZ_WIZKORA, lisek: OBRAZ_LISKA, narratorka: null };

function Gwiazdka({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 1.6l3.1 6.4 7 1-5 4.9 1.2 7-6.3-3.3-6.3 3.3 1.2-7-5-4.9 7-1z" />
    </svg>
  );
}

/** Wstawia tytuł zadania i miejsce reakcji; `{Miejsce}` = wielką literą na początku zdania. */
function podstaw(t, stan) {
  if (!t) return t;
  const m = stan.miejsce || "na polanie";
  return String(t)
    .split("{tytul}").join(stan.tytul || "")
    .split("{Miejsce}").join(m.charAt(0).toUpperCase() + m.slice(1))
    .split("{miejsce}").join(m);
}

/** Wariant po stanie + nadpisanie etapem 1–3 / 4–8, jeśli plik je ma. */
function wariant(mapa, stan, etap) {
  const w = mapa?.[stan.stan] || mapa?.nic;
  if (!w || typeof w !== "object") return w;
  const e = w[etap];
  return e ? { ...w, ...e } : w;
}

/**
 * Składa pięć kroków z realnego stanu. Każdy krok dostaje `tekst` (karta)
 * i `glos` (lektor), już po odmianie rodzaju i podstawieniach.
 */
export function zlozKroki(stan, wpisy = [], etap = etapSzkolny()) {
  const S = { stan: "nic", domek: "brak", tytul: "", miejsce: "", ...stan };
  const D = S.domek in SEKWENCJA.dzienPusty.wgDomku ? S.domek : "brak";
  return SEKWENCJA.kroki.map((k) => {
    let krok;
    if (k.id === "nie-zasnelo") {
      krok = { ...k, ...k.wgDomku[D] };
    } else if (k.id === "stan-rzeczy") {
      /* BRAK JEST PRZEDOSTATNI, ostatnia linijka jest ciepła i po prostu jest.
         Psycholog: dzień domykany brakiem po tygodniu przestaje być sygnałem
         i uczy, że dzień zawsze kończy się niedoborem. */
      const l1 = wpisy.length ? wpisy[wpisy.length - 1].tekst : SEKWENCJA.dzienPusty.wgDomku[D];
      const l2raw = k.linia2[S.stan] ?? k.linia2.nic;
      const l2 = typeof l2raw === "object" ? l2raw[D] : l2raw;
      const l3raw = k.linia3[S.stan] ?? k.linia3.nic;
      const l3 = typeof l3raw === "object" ? l3raw[D] : l3raw;
      const linie = [l1, l2, l3];
      krok = { ...k, linie, glos: linie.join(" ") };
    } else {
      krok = { ...k, ...wariant(k.wgStanu, S, etap) };
    }
    return {
      ...krok,
      tekst: odmienDlaGracza(podstaw(krok.tekst, S)),
      glos: odmienDlaGracza(podstaw(krok.glos || krok.tekst, S)),
      linie: Array.isArray(krok.linie) ? krok.linie.map((l) => odmienDlaGracza(podstaw(l, S))) : undefined,
    };
  });
}

export default function PodsumowanieDnia({
  otwarty = false,
  wpisy = [],
  /** Realny stan: { stan, domek, tytul, miejsce } — patrz nagłówek pliku. */
  stan = null,
  onZamknij,
}) {
  const [krok, setKrok] = useState(0);
  const [odlozone, setOdlozone] = useState(false);
  const przyciskRef = useRef(null);

  const S = useMemo(() => ({ stan: "nic", domek: "brak", tytul: "", miejsce: "", ...(stan || {}) }), [stan]);
  const kroki = useMemo(() => zlozKroki(S, wpisy), [S, wpisy, otwarty]);

  useEffect(() => { if (otwarty) { setKrok(0); setOdlozone(false); } }, [otwarty]);

  const dalej = useCallback(() => {
    setKrok((k) => (k + 1 < kroki.length ? k + 1 : k));
  }, [kroki.length]);

  const K = kroki[krok] || kroki[0];
  const ostatni = krok === kroki.length - 1;

  /* Każdy krok mówiony jest na głos i — jak wszędzie w grze — lektor kończy
     zdanie, nawet gdy dziecko przewinie dalej albo zamknie okno
     (`hub/mowaPostaci.js`). Tu akurat o to chodzi: sekwencja ma dać się
     przeklikać w trzy sekundy komuś, kto już wie, o co chodzi. */
  useEffect(() => {
    if (!otwarty || !K) return;
    const g = GLOSY[K.kto] || GLOSY.narratorka;
    powiedzPostacia(K.glos || K.tekst, g);
  }, [otwarty, K]);

  useEffect(() => {
    if (!otwarty) return undefined;
    const naKlawisz = (e) => {
      if (e.key === "Escape") onZamknij?.();
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); ostatni ? onZamknij?.() : dalej(); }
    };
    window.addEventListener("keydown", naKlawisz);
    return () => window.removeEventListener("keydown", naKlawisz);
  }, [otwarty, ostatni, dalej, onZamknij]);

  useEffect(() => {
    if (!otwarty) return undefined;
    const t = window.setTimeout(() => {
      try { przyciskRef.current?.focus({ preventScroll: true }); } catch {}
    }, 380);
    return () => window.clearTimeout(t);
  }, [otwarty, krok]);

  /* Ramka braku: tytuł zadania, gdy jest; inaczej ogólne „Czegoś tu brakuje.".
     Pokazuje się TYLKO przy stanie nic/zadanie — po śladzie brak jest
     wypełniony i ramka byłaby kłamstwem. */
  const brak = useMemo(() => {
    const R = SEKWENCJA.brakRamka;
    return {
      naglowek: S.tytul ? podstaw(R.naglowek, S) : R.bezZadania,
      podpis: R.podpis,
    };
  }, [S]);
  const pokazBrakWOgole = S.stan === "nic" || S.stan === "zadanie";

  if (!otwarty || !K) return null;

  const portret = PORTRETY[K.kto];
  const pokazBrak = pokazBrakWOgole && (K.id === "nie-do-wyczarowania" || K.id === "pusty-ksztalt");

  return (
    <div className="podsumowanie-dnia" data-testid="podsumowanie-dnia" data-krok={K.id}>
      {/* Zasłona NIE zamyka okna dotknięciem obok — to jedyne okno w grze,
          które tak robi. Koniec dnia ma zostać przeczytany, a nie odklikany
          przypadkiem kciukiem przy krawędzi. Dotknięcie przewija KROK DALEJ:
          nic tu nie trzeba wysiedzieć. */}
      <div
        className="podsumowanie-dnia-zaslona"
        onClick={() => (ostatni ? null : dalej())}
        aria-hidden="true"
      />

      <div
        className="podsumowanie-dnia-karta"
        role="dialog"
        aria-modal="true"
        aria-labelledby="podsumowanie-dnia-tytul"
      >
        {portret ? (
          <img
            key={portret}
            className={`podsumowanie-dnia-obraz podsumowanie-dnia-obraz--${K.kto}`}
            src={portret}
            alt=""
            aria-hidden="true"
            draggable="false"
          />
        ) : null}

        <p className="podsumowanie-dnia-wstega" id="podsumowanie-dnia-tytul">
          <Gwiazdka className="podsumowanie-dnia-gwiazdka" />
          <span>{K.kto === "wizkor" ? "Wizkor" : K.kto === "lisek" ? "Lisek" : SEKWENCJA.wstega}</span>
          <Gwiazdka className="podsumowanie-dnia-gwiazdka" />
        </p>

        {K.linie ? (
          <ul className="podsumowanie-dnia-lista">
            {K.linie.map((l, i) => (
              <li key={l + i} className={`podsumowanie-dnia-wpis${i === 1 ? " jest-brak" : ""}`}>{l}</li>
            ))}
          </ul>
        ) : (
          <p className="podsumowanie-dnia-tekst">{K.tekst}</p>
        )}

        {/* BRAK JAKO PRZEDMIOT, nie jako polecenie. Pokazuje się dopiero
            wtedy, gdy Wizkor powie, czego nie potrafi — wcześniej byłby
            zadaniem doklejonym do podsumowania. */}
        {pokazBrak ? (
          <section className="podsumowanie-dnia-brak">
            <span className="podsumowanie-dnia-obrys" aria-hidden="true" />
            <h3>{odmienDlaGracza(brak.naglowek)}</h3>
            <p>{brak.podpis}</p>
          </section>
        ) : null}

        {odlozone ? (
          <p className="podsumowanie-dnia-odzew">{odmienDlaGracza(SEKWENCJA.odlozenie.odzew)}</p>
        ) : null}

        <button
          type="button"
          ref={przyciskRef}
          className="hub-btn hub-btn-primary podsumowanie-dnia-akcja"
          onClick={() => (ostatni ? onZamknij?.() : dalej())}
          data-testid="podsumowanie-dnia-akcja"
        >
          {K.przycisk || "Dalej"}
        </button>

        {/* TRZECIA DROGA. Bez niej dziecko może tylko przynieść albo milczeć,
            a milczenie zostawia rzecz otwartą bez żadnej kontroli po jego
            stronie — to gorsze niż niepowodzenie. To jest przycisk „decyduję",
            nie „poddaję się". */}
        {K.id === "pusty-ksztalt" && pokazBrakWOgole && !odlozone ? (
          <button
            type="button"
            className="hub-btn hub-btn-ghost podsumowanie-dnia-odloz"
            onClick={() => { setOdlozone(true); dalej(); }}
            data-testid="podsumowanie-dnia-odloz"
          >
            {SEKWENCJA.odlozenie.przycisk}
          </button>
        ) : null}
      </div>
    </div>
  );
}
