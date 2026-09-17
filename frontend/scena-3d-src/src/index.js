/*!
 * EwolucJA — gra edukacyjna dla dzieci.
 * © 2026 Amitiel Angelisme. Wszelkie prawa zastrzeżone.
 * Powstało w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”.
 * Prawa autorskie należą do autora. Pełna nota: LICENSE.
 */
/**
 * index.js — publiczne API modułu sceny (to samo, co w pierwotnym bundlu).
 *
 *   const scena = await utworzScena3D({ kontener, zasoby, panel, spokojnyRuch, klawiatura, onZdarzenie });
 *   scena.on("minigra:start", ({ znak }) => …);
 *
 * `scena._app` to instancja `Aplikacja` — używa jej `hub/znakiMapy.js`,
 * `hub/krokiBohatera.js` i pulpit reżyserki. Pola, na których polegają:
 * `markers` (id/state/phase/def/setVisible/mapa), `current`, `actions`,
 * `paused`, `destroyed`, `heroShadow`.
 */
import "./postacie.js";
import { Aplikacja } from "./app.js";
import { szablon, wstrzyknijStyl } from "./ui.js";

/**
 * TA LISTA JEST SUBSKRYPCJĄ, NIE DOKUMENTACJĄ. `Scena3D.jsx` zapisuje się
 * dokładnie na te nazwy (`for (const nazwa of modul.ZDARZENIA)`), więc
 * zdarzenie, którego tu nie ma, wychodzi ze sceny i ginie — bez błędu,
 * bez ostrzeżenia, bez śladu w konsoli.
 *
 * Kosztowało to pół dnia przy rąbaniu: scena poprawnie meldowała
 * `surowiec:zdobyty`, drzewko zamieniało się w stos, a HUD i Wizkor
 * milczeli, bo po drugiej stronie nikt nie słuchał. Dopisując nowy
 * `this.emit(...)` w `app.js`, DOPISZ GO TEŻ TUTAJ.
 */
export const ZDARZENIA = [
  "gotowa", "wejscie:gotowe", "minigra:start", "znak:dotkniety", "bohater:doszedl", "latarnia:reakcja",
  "doba:pora", "doba:sesja", "sesja:zamknieta",
  "swiatlo:zebrane", "woda:nabrana", "fasola:podlana", "fasola:wspinaczka", "swiat:dalej",
  "surowiec:zdobyty", "surowiec:podniesiony", "surowiec:dostarczony", "miejsce:pokazane",
  "pauza", "wznowienie", "zniszczona", "blad",
];

export async function utworzScena3D(s = {}) {
  const e = typeof s.kontener === "string" ? document.querySelector(s.kontener) : s.kontener || document.body;
  if (!e) throw new Error("Scena 3D: nie znalazłem kontenera");
  const doc = e.ownerDocument || document;
  wstrzyknijStyl(doc);
  const t = doc.createElement("div");
  t.className = "scena3d-root" + (s.panel === false ? " bez-panelu" : "");
  t.innerHTML = szablon(s.teksty || {});
  e.appendChild(t);
  const n = new Aplikacja(t, {
    zasoby: s.zasoby,
    spokojnyRuch: s.spokojnyRuch,
    klawiatura: s.klawiatura,
    onEvent: s.onZdarzenie,
  });
  const i = {
    element: t,
    on: (r, a) => n.on(r, a),
    off: (r, a) => n.off(r, a),
    pauza: () => n.pauza(),
    wznow: () => n.wznow(),
    ustawBohatera: (r, a) => n.ustawBohatera(r, a),
    ustawSpokojnyRuch: (r) => n.ustawSpokojnyRuch(r),
    ustawZasiew: (r) => n.ustawZasiew(r),
    // Mały, trwały ślad powrotów w W2. Korzysta z istniejącego sadzenia,
    // które osadza rośliny na faktycznej powierzchni terenu.
    ustawSladyPrzygod: (ile, bezAnimacji = false) => {
      const cel = Math.max(0, Math.min(7, Math.floor(Number(ile) || 0)));
      if (!n.kwiaty) return;
      const start = globalThis.__SCENA3D_MAPA?.start?.pos || [0, 6.72];
      for (let k = n._sladyPrzygod || 0; k < cel; k++) {
        for (let j = 0; j < 5; j++) {
          const kat = (k * 5 + j) / 35 * Math.PI * 2;
          n.kwiaty.posadz(start[0] + Math.cos(kat) * 2.5, start[1] + Math.sin(kat) * 2.5, bezAnimacji);
        }
      }
      n._sladyPrzygod = Math.max(n._sladyPrzygod || 0, cel);
    },
    ustawPowrotZnaku: (r, a) => n.ustawPowrotZnaku(r, a),
    pokazZnak: (r) => n.pokazZnak(r),
    kino: (r, a) => n.kino(r, a),
    kinoSkroc: () => n.kinoSkroc(),
    kinoWejsciaTeraz: () => n.kinoWejsciaTeraz(),
    // Rąbanie: React mówi, co już zużyte (powrót do gry) i kiedy w ogóle
    // wolno rąbać (zadanie trwa albo nie).
    oznaczZuzyte: (r) => n.oznaczZuzyte(r),
    oznaczDostarczone: (r) => n.oznaczDostarczone(r),
    ustawRabanieAktywne: (r) => n.ustawRabanieAktywne(r),
    ustawSchronienie: (r, a) => n.ustawSchronienie(r, a),
    /* Narzędzie właściciela: suwaki do domkowego drzewa, wprost w grze.
       Woła je pulpit reżyserki (`Swiat.jsx`) i adres `?edytorDomku=1`. */
    edytorDomku: () => n.edytorDomku(),
    ustawPlacBudowy: (r, a) => n.ustawPlacBudowy(r, a),
    pokazMiejsce: (r, a) => n.pokazMiejsce(r, a),
    pokazZnakWKadrze: (r, a) => n.pokazZnakWKadrze(r, a),
    stan: () => n.stan(),
    zniszcz: () => { n.zniszcz(); t.remove(); },
    _app: n,
  };
  try { globalThis.__SCENA = i; } catch {}
  try {
    await n.gotowa;
  } catch (r) {
    console.error("Scena 3D: nie udało się wczytać modeli", r);
    i.blad = String(r?.message || r);
  }
  return i;
}

export function zarejestrujElement(nazwa = "ewolucja-scena-3d") {
  if (typeof customElements === "undefined" || customElements.get(nazwa)) return;
  class Element extends HTMLElement {
    async connectedCallback() {
      if (this._api) return;
      this.style.display = this.style.display || "block";
      this._api = await utworzScena3D({
        kontener: this,
        zasoby: this.getAttribute("zasoby") || undefined,
        panel: !this.hasAttribute("bez-panelu"),
        klawiatura: !this.hasAttribute("bez-klawiatury"),
        spokojnyRuch: this.hasAttribute("spokojny-ruch") ? true : undefined,
      });
      for (const n of ["pauza", "wznow", "ustawBohatera", "ustawSpokojnyRuch", "ustawZasiew", "ustawPowrotZnaku", "pokazZnak", "stan"])
        this[n] = (...i) => this._api[n](...i);
      this.dispatchEvent(new CustomEvent("scena3d:zamontowana", { bubbles: true }));
    }
    disconnectedCallback() {
      this._api?.zniszcz();
      this._api = null;
    }
  }
  customElements.define(nazwa, Element);
}

/** Most iframe ↔ rodzic: zdarzenia w górę, komendy w dół (postMessage). */
export function mostIframe(s, e = "*") {
  if (typeof window === "undefined" || window.parent === window) return () => {};
  const t = s.on("*", (i) => { window.parent.postMessage({ scena3d: "zdarzenie", nazwa: i.nazwa, dane: i }, e); });
  const n = (i) => {
    const r = i.data;
    if (!r || r.scena3d !== "komenda" || typeof s[r.metoda] !== "function") return;
    const a = s[r.metoda](...(r.argumenty || []));
    window.parent.postMessage({ scena3d: "odpowiedz", metoda: r.metoda, wynik: a }, e);
  };
  addEventListener("message", n);
  window.parent.postMessage({ scena3d: "gotowa" }, e);
  return () => { t(); removeEventListener("message", n); };
}
