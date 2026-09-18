/*!
 * SPDX-FileCopyrightText: © 2026 Amitiel Angelisme <armitiel@gmail.com>
 * SPDX-License-Identifier: LicenseRef-EwolucJA-Proprietary
 *
 * EwolucJA — gra edukacyjna dla dzieci.
 * Produkt powstał w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”;
 * autorskie prawa majątkowe pozostają przy autorze. Licencja: LICENSE.
 */
/**
 * hybryda — ZADANIE HYBRYDOWE: pół w świecie 3D, pół na podłodze w domu
 * (docs/tresci/05_ZADANIA_HYBRYDOWE.md, część wspólna W1–W6; 06 §4.3, §4.11).
 *
 * Część A na ekranie tylko STAWIA ZAKŁAD (jedno pytanie, trzy kafle), most
 * to chwila, w której dziecko odkłada urządzenie, część B dzieje się
 * naprawdę, a po powrocie zostaje ślad — i świat odpowiada od razu, bez
 * czekania na dorosłego. Mentor ZAUWAŻA (nie zatwierdza) i świat dokłada
 * coś małego.
 *
 * FAZY, jeden zapis, jedno źródło prawdy (ta sama zasada, co w
 * `zadanieWizkora.js`):
 *
 *   trop       — hybryda otwarta: obiekt części A stoi w świecie        „Do zrobienia"
 *   czescA     — zakład postawiony (wybór z trzech), most jeszcze otwarty „Do zrobienia"
 *   czeka      — dziecko nacisnęło „Idę": zadanie jest u niego w domu    „Czeka — u ciebie"
 *   slad       — ślad zostawiony; świat już zareagował                   „Ślad zostawiony"
 *   zauwazone  — Mentor nacisnął „Zauważam"; dodatek w świecie           „Mentor {zobaczył|zobaczyła}"
 *
 * DRUGIEJ HYBRYDY NIE MA PRZEZ TYDZIEŃ od zauważenia (`nastepnaOd`) —
 * sześć hybryd to zapas na sześć tygodni, nie na sześć dni (05 §5).
 *
 * MENTOR WIDZI ŚLAD TĄ SAMĄ DROGĄ, co zadania Koła: `POST /missions/seed`
 * (`adventure_ref: hybryda:<id>` → `library_id`) i `POST /missions/:id/submit`.
 * Bez sieci albo bez gracza ślad zostaje lokalny (25 monet w tle dopisane
 * tutaj), a zauważenia nikt nie udaje.
 */
import DANE from "./data/hybrydy.v1.json";
import { api, session } from "../services/api.js";
import { dodajMonety } from "../services/monety.js";
import { zdarzenie } from "../services/zdarzenia.js";
import { etapSzkolny, typStartowy } from "./profilStartowy.js";
import { stanDrewna } from "./zadanieDrewna.js";
import { zapiszSlad } from "./sladySwiata.js";
import { etykietaZauwazone, historiaZadan, odpalReakcjeSwiata } from "./zadanieWizkora.js";

const KLUCZ = "ewolucja.hybryda";
/** Zamknięte hybrydy — same `id`, żeby druga nie była tą samą. */
const KLUCZ_HISTORII = "ewolucja.hybryda.historia";
export const ZDARZENIE_ZMIANY = "ewolucja:hybrydaZmiana";

export const HYBRYDY = DANE.hybrydy || [];
const KOLEJNOSC = DANE.kolejnosc || HYBRYDY.map((h) => h.id);
export const HYBRYDY_AKTYWNE = KOLEJNOSC.map((id) => HYBRYDY.find((h) => h.id === id)).filter((h) => h && h.aktywna);

export const FAZY = ["trop", "czescA", "czeka", "slad", "zauwazone"];
const OTWARTA = new Set(["trop", "czescA", "czeka"]);
const MONETY_ZA_SLAD = 25;
const TYDZIEN_MS = 7 * 24 * 60 * 60 * 1000;
const ZAUWAZONE_STATUSY = new Set(["noticed", "verified", "highlighted"]);

/* Obrazki śladu i części A (docelowo rysunki claymorphism, dziś emoji — ta sama
   nazwa = ten sam znak w całej grze; uzupełnia `OBRAZKI_SLADU` z `zadanieWizkora`). */
export const OBRAZKI_HYBRYD = {
  "stopa-na-kamieniu": "👣", "stopa-obok": "🦶", "oko": "👁", "lampa-zgaszona": "🔦", "cien": "🚶",
  "plaska": "📄", "wachlarz": "📐", "rowno": "⚖️", "kamyk-na-wodzie": "🪨", "patyk-na-dnie": "🪵", "zgadniete": "✅",
  "poduszka": "🛋", "kubek": "☕", "krzeslo": "🪑", "lisc": "🍃", "gwiazda": "⭐", "slonce": "☀️", "fala": "🌊",
  "lapka": "🐾", "spirala": "🌀",
};
export function obrazekHybrydy(nazwa) { return OBRAZKI_HYBRYD[nazwa] || "✦"; }

export function definicjaHybrydy(id) {
  return HYBRYDY.find((h) => h.id === id) || null;
}

/* Wariant etapu 1–3 / 4–8 (mapowanie 05 §4): `warianty[etap]` nadpisuje pola
   bazowe; `most.warianty[etap]` nadpisuje `most`; miejsca z polem `etap`
   spoza etapu gracza odpadają. */
export function zWariantemHybrydy(def, etap = etapSzkolny()) {
  if (!def) return def;
  const w = def.warianty?.[etap] || {};
  const { miejsca: mapaMiejsc, ...reszta } = w;
  const out = { ...def, ...reszta };
  if (def.most) {
    const { warianty, ...most } = def.most;
    out.most = { ...most, ...(warianty?.[etap] || {}) };
  }
  out.miejsca = (def.miejsca || [])
    .filter((m) => !m.etap || m.etap === etap)
    .map((m) => (mapaMiejsc?.[m.id] ? { ...m, opis: mapaMiejsc[m.id] } : m));
  return out;
}

/** Kwestia z karty: `glos` ∈ wizkor/lisek/narratorka, `moment` ∈ most/przypomnienie/zaproszenie/slad/zauwazone. */
export function kwestiaHybrydy(def, glos, moment, etap = etapSzkolny()) {
  const lista = (def?.kwestie || []).filter((q) => q.glos === glos && q.moment === moment);
  if (!lista.length) return null;
  return lista.find((q) => q.wariant === etap) || lista.find((q) => q.wariant === "oba") || lista[0];
}

/* ── ZAPIS ──────────────────────────────────────────────────────────────── */
function czytaj() {
  try {
    const s = JSON.parse(localStorage.getItem(KLUCZ) || "null");
    if (!s || typeof s !== "object" || !s.id || !FAZY.includes(s.faza)) return null;
    if (!definicjaHybrydy(s.id)) return null;
    return s;
  } catch { return null; }
}

function zapisz(zapis) {
  try {
    if (zapis) localStorage.setItem(KLUCZ, JSON.stringify(zapis));
    else localStorage.removeItem(KLUCZ);
  } catch {}
  const stan = stanHybrydy();
  try { window.dispatchEvent(new CustomEvent(ZDARZENIE_ZMIANY, { detail: stan })); } catch {}
  return stan;
}

export function historiaHybryd() {
  try {
    const s = JSON.parse(localStorage.getItem(KLUCZ_HISTORII) || "[]");
    return Array.isArray(s) ? s.filter((x) => typeof x === "string") : [];
  } catch { return []; }
}

function dopiszDoHistorii(id) {
  if (!id) return;
  try {
    const teraz = historiaHybryd();
    if (!teraz.includes(id)) localStorage.setItem(KLUCZ_HISTORII, JSON.stringify([...teraz, id]));
  } catch {}
}

function dobaDzis(data = new Date()) {
  const d = new Date(data);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

/** Etykiety stanu R9 (01, 05 W1) — jedno słownictwo dla panelu, doku i Wizkora. */
export const OPIS_FAZY = {
  trop: { etykieta: "Do zrobienia", cta: "Otwórz" },
  czescA: { etykieta: "Do zrobienia", cta: "Otwórz" },
  czeka: { etykieta: "Czeka — u ciebie", cta: "Otwórz" },
  slad: { etykieta: "Ślad zostawiony", cta: "Zobacz" },
  zauwazone: { etykieta: "Mentor {zobaczył|zobaczyła}", cta: "Zobacz, co się zmieniło" },
};

const PUSTE = {
  istnieje: false, def: null, id: null, faza: null,
  trop: false, czescA: false, czeka: false, slad: false, zauwazone: false, otwarta: false,
  wyborA: null, sladWybor: null, sladZdanie: null, kiedy: {}, etykieta: null, cta: null,
  mentorPrawdziwy: false, mentorRodzaj: null, notatka: null, nastepnaOd: null, mostOdlozony: false,
  zauwazoneObejrzane: false, missionId: null, miejsce: null, przypomnianoDnia: null,
};

/** Jedno źródło prawdy o hybrydzie — czyta je panel, dok, oś etapów i Wizkor. */
export function stanHybrydy() {
  const z = czytaj();
  if (!z) return { ...PUSTE };
  const opis = OPIS_FAZY[z.faza] || OPIS_FAZY.trop;
  const mentorPrawdziwy = !!z.mentorPrawdziwy && !z.demo;
  return {
    istnieje: true,
    def: definicjaHybrydy(z.id),
    id: z.id,
    faza: z.faza,
    trop: z.faza === "trop",
    czescA: z.faza === "czescA",
    czeka: z.faza === "czeka",
    slad: z.faza === "slad",
    zauwazone: z.faza === "zauwazone",
    otwarta: OTWARTA.has(z.faza),
    wyborA: z.wyborA || null,
    sladWybor: Number.isInteger(z.sladWybor) ? z.sladWybor : null,
    sladZdanie: z.sladZdanie || null,
    kiedy: z.kiedy || {},
    etykieta: z.faza === "zauwazone" ? etykietaZauwazone(z.mentorRodzaj || null) : opis.etykieta,
    cta: opis.cta,
    mentorPrawdziwy,
    mentorRodzaj: z.mentorRodzaj || null,
    notatka: z.notatka || null,
    nastepnaOd: z.nastepnaOd || null,
    mostOdlozony: !!z.mostOdlozony,
    zauwazoneObejrzane: !!z.zauwazoneObejrzane,
    missionId: z.missionId || null,
    miejsce: z.miejsce || null,
    przypomnianoDnia: z.przypomnianoDnia || null,
  };
}

/** Czy hybryda blokuje Koło (jedno zadanie na dany moment, 05 §1.2). */
export function hybrydaOtwarta() { return stanHybrydy().otwarta; }

/**
 * Czy dziecko wraca do czekającej hybrydy NASTĘPNEGO dnia (05 §5, wyjątek:
 * Wizkor przypomina i jednocześnie zleca pierwszą grę — hybryda nie zamyka
 * gier na tydzień).
 */
export function czekaOdWczoraj() {
  const s = stanHybrydy();
  if (!s.czeka) return false;
  const od = s.kiedy?.czeka ? dobaDzis(new Date(s.kiedy.czeka)) : null;
  return !!od && od !== dobaDzis();
}

/** Przypomnienie Wizkora raz dziennie — potem zwykła kwestia stanu (gry). */
export function oznaczPrzypomnienie() {
  const z = czytaj();
  if (!z) return stanHybrydy();
  return zapisz({ ...z, przypomnianoDnia: dobaDzis() });
}
export function przypomnianoDzis() { return stanHybrydy().przypomnianoDnia === dobaDzis(); }

/* Rodziny zużyte przez zadania Koła (06 §6): hybryda z rodziny, którą
   dziecko już przeszło w realu, nie wchodzi jako pierwsza. */
function rodzinyZuzyte() {
  const zrobione = new Set([...historiaZadan(), ...historiaHybryd()]);
  const r = new Set();
  for (const h of HYBRYDY) if (zrobione.has(h.id) && h.rodzina) r.add(h.rodzina);
  return r;
}

/**
 * PIERWSZA HYBRYDA dla profilu z testu (05 §5): karta z `profil_pierwszy`
 * równym profilowi; gdy jej nie ma (karta nieaktywna) albo rodzina zużyta —
 * pierwsza z pozostałych aktywnych w kolejności tabeli. `null`, gdy żadna
 * aktywna karta nie pasuje — wtedy Wizkor zleca jak dotąd (Koło po grach).
 */
export function pierwszaHybryda(profil = typStartowy()) {
  const zrobione = new Set(historiaHybryd());
  const rodziny = rodzinyZuzyte();
  const wolna = (h) => !zrobione.has(h.id) && !(h.rodzina && rodziny.has(h.rodzina));
  const swoja = HYBRYDY_AKTYWNE.find((h) => h.profil_pierwszy === profil && wolna(h));
  if (swoja) return swoja;
  /* Bez profilu albo z profilem, którego karta jeszcze nie jest aktywna:
     NIE podstawiamy cudzej pierwszej przygody — kolejne karty włączą się
     razem z metodami sceny (05 §4), a do tego czasu profil dostaje Koło. */
  if (profil && !HYBRYDY.some((h) => h.profil_pierwszy === profil && h.aktywna)) return null;
  return HYBRYDY_AKTYWNE.find(wolna) || null;
}

/* ETAP SESJI (słońce): hybryda z `czescA.zachod` (MD, 05 karta 2) otwiera się
   dopiero o zachodzie — jej most JEST kwestią zachodu; do tego czasu Wizkor
   zleca gry. `Swiat.jsx` melduje etap z `doba:sesja`. Pamięć na czas strony:
   nowy dzień (`dzien`) kasuje flagę. */
let etapSesji = "dzien";
export function oznaczEtapSesji(etap) { if (typeof etap === "string") etapSesji = etap; }
export function poZachodzie() { return etapSesji === "zachod" || etapSesji === "noc"; }

/**
 * Czy hybrydę wolno teraz otworzyć: domek etap 1 stoi, żadna hybryda nie
 * jest w toku, tydzień od zauważenia minął (albo nie było żadnej), jest karta
 * — a karta z `czescA.zachod` czeka na zachód (nie po „Budujemy!").
 */
export function mozliwaHybryda() {
  if (!stanDrewna().zbudowane) return null;
  const s = stanHybrydy();
  if (s.istnieje && s.faza !== "zauwazone") return null;
  if (s.nastepnaOd && Date.parse(s.nastepnaOd) > Date.now()) return null;
  if (s.istnieje && s.faza === "zauwazone" && !s.zauwazoneObejrzane) return null;
  const karta = pierwszaHybryda();
  if (karta?.czescA?.zachod && !poZachodzie()) return null;
  return karta;
}

/* ── PRZEBIEG ───────────────────────────────────────────────────────────── */

/** Reakcja sceny bez analityki „świat zareagował" (część A to nie ślad). */
function pokazWScenie(reakcja, zrodlo) {
  if (!reakcja?.metoda) return false;
  zapiszSlad(reakcja, zrodlo);
  const fn = globalThis.__SCENA?.[reakcja.metoda];
  if (typeof fn !== "function") return false;
  try { fn(...(Array.isArray(reakcja.args) ? reakcja.args : [])); return true; }
  catch (err) { console.warn("[hybryda] scena nie przyjęła części A:", reakcja.metoda, err); return false; }
}

/** Znacznik braku (W6) — stoi, dopóki hybryda jest otwarta; schodzi po śladzie. */
export function odswiezZnacznikBraku(scena = globalThis.__SCENA) {
  const s = stanHybrydy();
  const kotwica = s.otwarta ? (s.def?.czescA?.kotwica || null) : null;
  try { scena?.pokazZnacznikBraku?.(kotwica); } catch {}
}

/**
 * Odtworzenie w świeżo zbudowanej scenie (po „gotowa", obok `odtworzSlady`):
 * obiekt części A wraca z dziennika śladów; tu dochodzi tylko znacznik braku,
 * którego w dzienniku nie ma (to sygnał „tu czegoś brakuje", nie ślad).
 */
export function odtworzHybrydeWScenie(scena = globalThis.__SCENA) {
  odswiezZnacznikBraku(scena);
}

/** Otwarcie hybrydy (trop): obiekt części A wchodzi do świata. */
export function rozpocznij(id) {
  const def = definicjaHybrydy(id);
  if (!def) return stanHybrydy();
  const teraz = new Date().toISOString();
  const stan = zapisz({ id, faza: "trop", kiedy: { trop: teraz }, wyborA: null });
  pokazWScenie(def.czescA?.reakcja, `hybryda:${id}`);
  odswiezZnacznikBraku();
  zdarzenie("hybryda.otwarta", { hybryda: id, profil: typStartowy() || null, etap: etapSzkolny() });
  return stan;
}

/** Zakład z części A (id opcji z `czescA.opcje`). */
export function wybierzA(opcja) {
  const z = czytaj();
  if (!z || !OTWARTA.has(z.faza)) return stanHybrydy();
  const def = definicjaHybrydy(z.id);
  const id = def?.czescA?.opcje?.some((o) => o.id === opcja) ? opcja : null;
  if (!id) return stanHybrydy();
  const faza = z.faza === "trop" ? "czescA" : z.faza;
  zdarzenie("czescA.wybor", { hybryda: z.id, wybor: id });
  const nowy = { ...z, faza, wyborA: id, kiedy: { ...(z.kiedy || {}), czescA: z.kiedy?.czescA || new Date().toISOString() } };
  const stan = zapisz(nowy);
  /* Wybór widać od razu (MD: zgaszona lampka staje tam, gdzie dziecko
     wskazało). Metoda musi być idempotentna — zmiana zdania przestawia. */
  if (def.czescA?.reakcjaPoWyborze) pokazWScenie(argumenty(def.czescA.reakcjaPoWyborze, nowy, def), `hybryda:${z.id}`);
  return stan;
}

/** Wybrane `miejsce` (id z `def.miejsca`) — zapisane, żeby nie przepadało. */
export function zapiszMiejsce(miejsce) {
  const z = czytaj();
  if (!z) return stanHybrydy();
  return zapisz({ ...z, miejsce: miejsce || null });
}

/** „Zostaw otwarte" — most odłożony, dziecko gra dalej; zadanie nie idzie w „czeka". */
export function odlozMost() {
  const z = czytaj();
  if (!z || z.faza !== "czescA") return stanHybrydy();
  zdarzenie("most.odlozony", { hybryda: z.id });
  return zapisz({ ...z, mostOdlozony: true });
}

/** „Idę" — dziecko odkłada urządzenie; od tej chwili zadanie jest u niego. */
export function idz() {
  const z = czytaj();
  if (!z || !(z.faza === "czescA" || z.faza === "trop")) return stanHybrydy();
  return zapisz({ ...z, faza: "czeka", kiedy: { ...(z.kiedy || {}), czeka: new Date().toISOString() } });
}

/* Argumenty reakcji z zapisu: `{wyborA}` (id opcji części A), `{slad}` (indeks
   opcji śladu) i `{sladId}` (`slad.wartosci[indeks]`, np. kształt desek) w `args`. */
function argumenty(reakcja, z, def = definicjaHybrydy(z?.id)) {
  if (!reakcja) return null;
  const podstaw = (v) => {
    if (v === "{wyborA}") return z.wyborA || null;
    if (v === "{slad}") return Number.isInteger(z.sladWybor) ? z.sladWybor : null;
    if (v === "{sladId}") return Number.isInteger(z.sladWybor) ? (def?.slad?.wartosci?.[z.sladWybor] ?? null) : null;
    if (v && typeof v === "object" && !Array.isArray(v)) return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, podstaw(x)]));
    return v;
  };
  return { ...reakcja, args: (reakcja.args || []).map(podstaw) };
}

/**
 * ŚLAD ZOSTAWIONY. Zapis najpierw (świat reaguje niezależnie od sieci),
 * potem Mentor tą samą drogą, co zadania Koła (`seed` + `submit`). Brak
 * gracza albo sieci = ślad lokalny, 25 monet w tle dopisane tu, bez udawania
 * dorosłego. Zwraca `{ stan, toast, narratorka }`.
 */
export async function zostawSlad({ opcja = null, zdanie = "" } = {}) {
  const z = czytaj();
  if (!z || z.faza !== "czeka") return { stan: stanHybrydy(), toast: null, narratorka: null };
  const def = definicjaHybrydy(z.id);
  const etap = etapSzkolny();
  const sladWybor = Number.isInteger(opcja) && def.slad?.opcje?.[opcja] != null ? opcja : null;
  const tekstOpcji = sladWybor != null ? def.slad.opcje[sladWybor] : null;
  const teraz = new Date().toISOString();

  let nowy = {
    ...z, faza: "slad", sladWybor, sladZdanie: String(zdanie || "").slice(0, 160) || null,
    kiedy: { ...(z.kiedy || {}), slad: teraz },
  };

  /* Mentor: seed (idempotentny po `adventure_ref`) → submit. Bez gracza —
     lokalnie. Błąd sieci też schodzi na lokalnie: ślad ma zostać. */
  const pid = session.getPlayer();
  if (pid) {
    try {
      let missionId = z.missionId;
      if (!missionId) {
        const d = zWariantemHybrydy(def, etap);
        const utworzona = await api.seedMission(pid, {
          title: def.tytul,
          body: `${d.cel}\n\n${d.jak || ""}`.trim(),
          narrative_intro: d.most?.karta || null,
          competency_focus: def.competency_focus || [],
          proof_type: "text",
          estimated_minutes: def.minuty || 15,
          adventure_ref: `hybryda:${def.id}`,
          rozmowa: d.rozmowa || def.rozmowa || null,
        });
        missionId = utworzona?.mission_id || utworzona?.id || null;
      }
      if (missionId) {
        const odp = await api.submitMissionProof(missionId, {
          proof_text: nowy.sladZdanie || (tekstOpcji || ""),
          proof_media_url: null,
          place_id: z.miejsce || null,
          slad_opcja: sladWybor,
          slad_opcja_tekst: tekstOpcji,
          mentor_powiadomienie: def.mentor_powiadomienie || null,
        });
        nowy = { ...nowy, missionId, monetyZaSlad: Number(odp?.coins_awarded) || 0, mentorPrawdziwy: !!odp?.mentor_present };
      }
    } catch (err) {
      console.warn("[hybryda] ślad nie doszedł do Mentora — zostaje lokalnie:", err?.message || err);
    }
  }
  if (!nowy.missionId && !nowy.monetyZaSlad) {
    dodajMonety(MONETY_ZA_SLAD, "hybryda (ślad, lokalnie)");
    nowy = { ...nowy, monetyZaSlad: MONETY_ZA_SLAD, demo: true };
  }
  const stan = zapisz(nowy);
  dopiszDoHistorii(z.id);
  zdarzenie("slad.zostawiony", { hybryda: z.id, opcja: sladWybor, zdanie: !!nowy.sladZdanie, etap });

  // Świat reaguje OD RAZU — bez werdyktu (05 §1.2). Znacznik braku schodzi.
  const toast = odpalReakcjeSwiata(argumenty(def.reakcja, nowy), `hybryda:${z.id}`);
  odswiezZnacznikBraku();
  const narratorka = kwestiaHybrydy(def, "narratorka", "slad", etap);
  return { stan, toast, narratorka: narratorka ? podstawRzecz(narratorka.tekst, def, nowy) : null, kadr: def.reakcja?.kadr || null };
}

/* `{rzecz}` w kwestii narratorki (EM) = wybór z części A. */
function podstawRzecz(tekst, def, z) {
  const o = def?.czescA?.opcje?.find((x) => x.id === z?.wyborA);
  return String(tekst || "").split("{rzecz}").join(o ? o.tekst.toLowerCase() : "coś");
}

/** Zauważenie przez Mentora — dodatek w świecie RAZ, tydzień do następnej hybrydy. */
function zauwaz(z, { notatka = null, mentorRodzaj = null, mentorPrawdziwy = null, demo = false } = {}) {
  const def = definicjaHybrydy(z.id);
  if (!z.reakcjaMentorOdpalona) odpalReakcjeSwiata(argumenty(def?.reakcjaMentor, z), `hybryda:${z.id}`);
  zdarzenie("mentor.zauwazyl", { hybryda: z.id, demo });
  return zapisz({
    ...z, faza: "zauwazone", reakcjaMentorOdpalona: true,
    notatka, mentorRodzaj,
    mentorPrawdziwy: mentorPrawdziwy == null ? !!z.mentorPrawdziwy : mentorPrawdziwy,
    demo: demo || z.demo,
    kiedy: { ...(z.kiedy || {}), zauwazone: new Date().toISOString() },
    nastepnaOd: new Date(Date.now() + TYDZIEN_MS).toISOString(),
  });
}

/**
 * Sprawdzenie, czy Mentor zauważył — przy otwarciu panelu, bez pollingu
 * (jak `zadanieWizkora.sprawdzMentora`). `rejected`/`needs_followup` dziecko
 * nie widzi: ślad zostaje śladem.
 */
export async function sprawdzMentora() {
  const z = czytaj();
  if (!z?.missionId || z.faza !== "slad") return stanHybrydy();
  const misja = await api.getMissionById(z.missionId);
  const status = misja?.status || misja?.mission?.status;
  const werdykt = misja?.gm_verification || misja?.mission?.gm_verification || null;
  const mentorPrawdziwy = misja?.mentor_present != null ? !!misja.mentor_present : !!z.mentorPrawdziwy;
  if (ZAUWAZONE_STATUSY.has(status)) {
    return zauwaz(z, { notatka: werdykt?.formula || werdykt?.comment || null, mentorRodzaj: werdykt?.mentor_gender || null, mentorPrawdziwy });
  }
  if (mentorPrawdziwy !== !!z.mentorPrawdziwy) return zapisz({ ...z, mentorPrawdziwy });
  return stanHybrydy();
}

/* Ciche sprawdzenie poza panelem — ten sam dławik, co w `zadanieWizkora`
   (jedno zapytanie na dziesięć minut), tylko gdy naprawdę czekamy. */
const KLUCZ_PYTANIA = "ewolucja.hybryda.ostatniePytanie";
const ODSTEP_MS = 10 * 60 * 1000;
export async function sprawdzMentoraWTle() {
  const s = stanHybrydy();
  if (!s.slad || !s.missionId) return s;
  try {
    const kiedy = Number(localStorage.getItem(KLUCZ_PYTANIA) || 0);
    if (Number.isFinite(kiedy) && Date.now() - kiedy < ODSTEP_MS) return s;
    localStorage.setItem(KLUCZ_PYTANIA, String(Date.now()));
  } catch {}
  try { return await sprawdzMentora(); } catch { return s; }
}

/** Miniatura zdjęcia poszła na `/missions/:id/miniatura` (KR) — sama flaga, bez bajtów. */
export function oznaczMiniature(missionId) {
  const z = czytaj();
  if (!z || (missionId && z.missionId && z.missionId !== missionId)) return stanHybrydy();
  return zapisz({ ...z, miniatura: true });
}

/** Dziecko obejrzało dodatek po zauważeniu (kamera pokazała miejsce). */
export function oznaczZauwazoneObejrzane() {
  const z = czytaj();
  if (!z || z.faza !== "zauwazone") return stanHybrydy();
  return zapisz({ ...z, zauwazoneObejrzane: true });
}

/** Wiersz narratorki po zauważeniu + kadr — dla wejścia i dla panelu. */
export function reakcjaPoZauwazeniu() {
  const s = stanHybrydy();
  if (!s.zauwazone || !s.def) return null;
  const q = kwestiaHybrydy(s.def, "narratorka", "zauwazone");
  return { tekst: q ? q.tekst : null, kadr: s.def.reakcjaMentor?.kadr || null, toast: s.def.reakcjaMentor?.toast || null };
}

/* ── DEV / PULPIT ───────────────────────────────────────────────────────── */

/** Ślad bez sieci — ten sam kształt zapisu, co `zostawSlad`, tylko lokalnie. */
export async function zostawSladDev({ opcja = 0, zdanie = "DEV: ślad z pulpitu" } = {}) {
  const z = czytaj();
  if (!z) return stanHybrydy();
  if (z.faza === "trop" || z.faza === "czescA") { wybierzA(z.wyborA || definicjaHybrydy(z.id)?.czescA?.opcje?.[0]?.id); idz(); }
  // Pomijamy backend: na czas wywołania „nie ma gracza" — ślad zostaje lokalny.
  const org = session.getPlayer;
  try { session.getPlayer = () => null; return (await zostawSlad({ opcja, zdanie })).stan; }
  finally { session.getPlayer = org; }
}

/** Skrót z pulpitu: „Mentor zauważa" bez Mentora — jawnie demo. */
export function zauwazDev(notatka = "(tryb demo) Świat to zauważył.") {
  const z = czytaj();
  if (!z || z.faza !== "slad") return stanHybrydy();
  return zauwaz(z, { notatka, demo: true, mentorPrawdziwy: false });
}

/** Pulpit i konsola — hybryda od nowa (z historią albo bez). */
export function skasujHybryde({ historia = false } = {}) {
  if (historia) { try { localStorage.removeItem(KLUCZ_HISTORII); } catch {} }
  const stan = zapisz(null);
  odswiezZnacznikBraku();
  return stan;
}
