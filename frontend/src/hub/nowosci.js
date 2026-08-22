/**
 * nowosci — co w hubie czeka na dziecko, policzone dla plakietek w doku.
 *
 * PO CO JEDEN PLIK NA TRZY SEKCJE. Minigry, porady i czat liczą „nowe"
 * z trzech różnych źródeł (katalog gier + stan misji, karteczki na dziś,
 * atrapa czatu), ale mechanika jest wszędzie ta sama: zbiór rzeczy DOSTĘPNYCH
 * minus zbiór rzeczy OBEJRZANYCH. Trzymanie tego w jednym miejscu znaczy, że
 * dołożenie czwartej plakietki to jedna funkcja, a nie czwarty własny wzorzec.
 *
 * Obejrzane siedzą w localStorage, bo to nie jest postęp gracza tylko stan
 * TEGO urządzenia — dziecko, które przeczytało porady na tablecie, na telefonie
 * ma prawo zobaczyć je jako nowe. Zapis jest też odporny na brak sieci, a dok
 * musi się rysować także wtedy.
 *
 * KAŻDA zmiana ogłasza `ZDARZENIE_ZMIANY`, bo dok żyje w `Swiat.jsx`, a
 * odznaczanie dzieje się w panelach — bez zdarzenia plakietka gasłaby dopiero
 * przy następnym przeładowaniu świata.
 */
import KATALOG_GIER from "./data/minigry.v1.json";
import DANE_CZATU from "./data/czat.mock.json";
import { gryWZakladce, MISJE } from "./misjeGier.js";
import { poradaDnia, poradyNaPore, poraDnia } from "./poradaDnia.js";

export const ZDARZENIE_ZMIANY = "ewolucja:nowosciZmiana";

const KLUCZE = {
  gry: "ewolucja.nowosci.gry",
  porady: "ewolucja.nowosci.porady",
  czat: "ewolucja.nowosci.czat",
};

function czytajZbior(klucz) {
  try {
    const surowe = JSON.parse(localStorage.getItem(klucz) || "[]");
    return new Set(Array.isArray(surowe) ? surowe.filter((x) => typeof x === "string") : []);
  } catch {
    return new Set();
  }
}

function zapiszZbior(klucz, zbior) {
  try {
    localStorage.setItem(klucz, JSON.stringify([...zbior]));
  } catch {}
  try {
    window.dispatchEvent(new CustomEvent(ZDARZENIE_ZMIANY));
  } catch {}
}

/** Ile z `dostepne` nie ma jeszcze w zapisie obejrzanych. */
function ileNowych(klucz, dostepne) {
  const widziane = czytajZbior(klucz);
  return dostepne.filter((id) => !widziane.has(id)).length;
}

/** Dopisuje `dostepne` do obejrzanych. Nic nie robi, gdy nic się nie zmienia. */
function oznacz(klucz, dostepne) {
  const widziane = czytajZbior(klucz);
  const przed = widziane.size;
  dostepne.forEach((id) => widziane.add(id));
  if (widziane.size === przed) return;
  zapiszZbior(klucz, widziane);
}

/* ── MINIGRY ──────────────────────────────────────────────────────────────
   Dostępne = dokładnie to, co widać w zakładce: gry spoza misji są tam zawsze,
   gry z misji dopiero po ułożeniu ich układanki. Filtr jest ten sam, co
   w `MinigryPanel`, i musi taki zostać — plakietka obiecująca coś, czego
   w zakładce nie ma, byłaby gorsza niż jej brak. */
const ID_MISJI = new Set(MISJE.map((m) => m.id));

function dostepneGry() {
  let odkryte = [];
  try { odkryte = gryWZakladce(); } catch {}
  return (KATALOG_GIER.gry || [])
    .filter((gra) => !ID_MISJI.has(gra.id) || odkryte.includes(gra.id))
    .map((gra) => gra.id);
}

/** Czy w zakładce minigier pojawiło się coś, czego dziecko jeszcze nie widziało. */
export function saNoweMinigry() {
  return ileNowych(KLUCZE.gry, dostepneGry()) > 0;
}

export function oznaczMinigryObejrzane() {
  oznacz(KLUCZE.gry, dostepneGry());
}

/* ── PORADY DNIA ──────────────────────────────────────────────────────────
   Liczymy karteczkę na dziś (dopóki wisi) i porady z półek na BIEŻĄCĄ porę
   dnia. Półki zmieniają się razem z porą, więc licznik sam odżywa po południu
   i wieczorem — i o to chodzi: to jest zaproszenie „zajrzyj teraz", a nie
   zaległość do nadrobienia. */
function dostepnePorady() {
  const lista = [];
  try {
    const dzis = poradaDnia();
    if (dzis) lista.push(`dzis:${dzis.id}`);
  } catch {}
  try {
    const pora = poraDnia().id;
    const { zdrowie, samopoczucie } = poradyNaPore(pora);
    [...zdrowie, ...samopoczucie].forEach((p) => lista.push(`${pora}:${p.id}`));
  } catch {}
  return lista;
}

export function nowychPorad() {
  return ileNowych(KLUCZE.porady, dostepnePorady());
}

export function oznaczPoradyObejrzane() {
  oznacz(KLUCZE.porady, dostepnePorady());
}

/* ── CZAT ─────────────────────────────────────────────────────────────────
   UWAGA: czat to wciąż ATRAPA (`czat.mock.json`), więc „nowe" bierzemy
   z flagi `nowe` przy rozmowie. Gdy powstanie warstwa danych, tu wejdzie
   liczba z serwera, a `oznaczRozmoweCzytana` zamieni się w zwykłe „przeczytane".
   Reszta huba nie zauważy różnicy — dok pyta tylko o liczbę. */
function noweRozmowy() {
  return (DANE_CZATU.prywatne?.rozmowy || [])
    .filter((r) => r && r.nowe)
    .map((r) => r.id);
}

export function nowychWCzacie() {
  return ileNowych(KLUCZE.czat, noweRozmowy());
}

/** Wejście w rozmowę = przeczytana. Pojedynczo, nie hurtem: samo otwarcie
 *  zakładki czatu nie znaczy, że dziecko przeczytało wiadomość od Zosi. */
export function oznaczRozmoweCzytana(id) {
  if (typeof id !== "string") return;
  oznacz(KLUCZE.czat, [id]);
}

/** Uchwyt do konsoli: `window.nowosci.kasuj()` zapala plakietki od nowa. */
export function kasujNowosci() {
  Object.values(KLUCZE).forEach((k) => {
    try { localStorage.removeItem(k); } catch {}
  });
  try { window.dispatchEvent(new CustomEvent(ZDARZENIE_ZMIANY)); } catch {}
}
