/*!
 * SPDX-FileCopyrightText: © 2026 Amitiel Angelisme <armitiel@gmail.com>
 * SPDX-License-Identifier: LicenseRef-EwolucJA-Proprietary
 *
 * EwolucJA — gra edukacyjna dla dzieci.
 * Produkt powstał w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”;
 * autorskie prawa majątkowe pozostają przy autorze. Licencja: LICENSE.
 */
/**
 * zadanieWizkora — zadanie, którego NIE da się zrobić w grze.
 *
 * Wizkor zleca je tak samo jak misje z grami (`misjeGier.js`), ale dowodem nie
 * jest rozegrana partia, tylko coś, co dziecko zrobiło poza ekranem: zdjęcie
 * albo własne zdanie. Ten dowód idzie do Mentora ISTNIEJĄCYM torem
 * weryfikacji — `POST /missions/seed` → `POST /missions/:id/submit` →
 * Mentor w swoim panelu → `GET /missions/:id`. Nie budujemy drugiego.
 *
 * STANY, każdy odczytywalny z jednego obiektu (ta sama zasada, co
 * w `zadanieGwiazdek.js` — inaczej Wizkor nie wie, co powiedzieć, a zwój nie
 * wie, co pokazać). Nazwy klucza zostają dla zgodności zapisów w localStorage,
 * znaczenie wg docs/tresci/06 §4.7 (Mentor ZAUWAŻA, nie zatwierdza):
 *
 *   brak        — Wizkor jeszcze nie zlecił                       („Do zrobienia" to pusty panel)
 *   zlecone     — wzięte z koła, czeka u dziecka                  „Czeka — u ciebie"
 *   wyslane     — ślad zostawiony; świat już zareagował            „Ślad zostawiony"
 *                 (+ „Mentor już to widzi" TYLKO przy prawdziwym, niedemowym Mentorze)
 *   zatwierdzone— Mentor zauważył (backend `noticed`/`verified`)  „Mentor {zobaczył|zobaczyła}"
 *   wyplacone   — dziecko obejrzało zmianę; do historii            „Zrobione" (tylko historia)
 *
 * Statusów `poprawka` / `rejected` / `needs_followup` dziecko NIE widzi — mapują
 * się na „Ślad zostawiony" (zadania nie da się oblać). Monety: 25 w tle przy
 * śladzie (backend `/submit` albo lokalnie w demie), 0 za zauważenie.
 */
import DANE from "./data/zadania-wizkora.v1.json";
import { api, session } from "../services/api.js";
import { dodajMonety } from "../services/monety.js";
import { wzmocnijCeche } from "../adventure/engine/adventureState.js";


const KLUCZ = "ewolucja.zadanie.wizkora";
/**
 * HISTORIA rozliczonych zadań — same identyfikatory, osobno od bieżącego
 * zapisu. Bieżący zapis trzyma JEDNO zadanie i po wypłacie zostaje
 * nadpisany następnym, więc bez tej listy koło co losowanie podawałoby to
 * samo zadanie z cechy (kolejność w katalogu). Historia jest tylko
 * podpowiedzią dla losowania: gdy dziecko przerobi już całą cechę,
 * zadania wracają — powtórka „zrób coś dobrego" niczego nie psuje.
 */
const KLUCZ_HISTORII = "ewolucja.zadanie.wizkora.historia";
export const ZDARZENIE_ZMIANY = "ewolucja:zadanieWizkoraZmiana";

export const ZADANIA = DANE.zadania || [];

/**
 * Etykiety stanu — jedno słownictwo dla zwoju, panelu i Wizkora.
 *
 * CTA są JEDNOWYRAZOWE tam, gdzie się da. Przycisk stoi wewnątrz karty
 * zadania, pod jego tytułem i treścią — dopisywanie do niego słowa „zadanie"
 * powtarzało to, co dziecko właśnie przeczytało dwa wiersze wyżej.
 */
export const OPIS_STANU = {
  zlecone: { etykieta: "Czeka — u ciebie", cta: "Otwórz" },
  // Legacy: dawny status „poprawka" (stare zapisy) czyta się jak „Ślad zostawiony".
  poprawka: { etykieta: "Ślad zostawiony", cta: "Zobacz" },
  wyslane: { etykieta: "Ślad zostawiony", cta: "Zobacz" },
  zatwierdzone: { etykieta: "Mentor {zobaczył|zobaczyła}", cta: "Zobacz, co się zmieniło" },
  wyplacone: { etykieta: "Zrobione", cta: "Zobacz" },
};

/* Etykieta stanu „zauważone" zależy od tego, co wiemy o Mentorze. gm_accounts
   nie ma pola płci — odczytujemy ją z formuły „Widziałem." / „Widziałam."
   (`mentor.js` zapisuje `mentor_gender`); bez tej wiedzy zdanie idzie w czasie
   teraźniejszym, bez tokenu, żeby nikomu nie przypisać rodzaju. */
export function etykietaZauwazone(mentorRodzaj) {
  if (mentorRodzaj === "m") return "Mentor zobaczył";
  if (mentorRodzaj === "z") return "Mentor zobaczyła";
  return "Mentor to widzi";
}

/* Podtytuł pod „Ślad zostawiony": obiecujemy dorosłego tylko wtedy, gdy jest
   (klasa z żywym kontem Mentora, gracz nie-demo, tryb nie-demo). */
export function podtytulSladu(stan) {
  return stan?.mentorPrawdziwy ? "Mentor już to widzi" : null;
}

export function definicjaZadania(id) {
  return ZADANIA.find((z) => z.id === id) || null;
}

function czytaj() {
  try {
    const surowe = JSON.parse(localStorage.getItem(KLUCZ) || "null");
    if (!surowe || typeof surowe !== "object" || !surowe.id) return null;
    if (!definicjaZadania(surowe.id)) return null;
    return surowe;
  } catch {
    return null;
  }
}

function zapisz(zapis) {
  try {
    if (zapis) localStorage.setItem(KLUCZ, JSON.stringify(zapis));
    else localStorage.removeItem(KLUCZ);
  } catch {}
  const stan = stanZadania();
  try { window.dispatchEvent(new CustomEvent(ZDARZENIE_ZMIANY, { detail: stan })); } catch {}
  return stan;
}

const PUSTE = {
  istnieje: false,
  def: null,
  status: null,
  doZrobienia: false,
  czeka: false,
  doOdbioru: false,
  wyplacone: false,
  notatka: null,
  dowod: null,
  nagroda: null,
  etykieta: null,
  cta: null,
  mentorPrawdziwy: false,
  mentorRodzaj: null,
  miejsce: null,
};

/** Jedno źródło prawdy o zadaniu — czyta je zwój, panel, Wizkor i licznik. */
export function stanZadania() {
  const zapis = czytaj();
  if (!zapis) return { ...PUSTE };
  const def = definicjaZadania(zapis.id);
  // Dawna „poprawka" (stare zapisy) = ślad zostawiony; dziecko nie widzi werdyktów.
  const status = zapis.status === "poprawka" ? "wyslane" : (zapis.status || "zlecone");
  const opis = OPIS_STANU[status] || OPIS_STANU.zlecone;
  const mentorRodzaj = zapis.mentorRodzaj || null;
  const mentorPrawdziwy = !!zapis.mentorPrawdziwy && !zapis.demo && !DEMO_SAM_ZATWIERDZA;
  return {
    istnieje: true,
    def,
    id: zapis.id,
    missionId: zapis.missionId || null,
    status,
    doZrobienia: status === "zlecone",
    czeka: status === "wyslane",
    doOdbioru: status === "zatwierdzone",
    wyplacone: status === "wyplacone",
    notatka: zapis.notatka || null,
    dowod: zapis.dowod || null,
    nagroda: zapis.nagroda != null && Number.isFinite(Number(zapis.nagroda))
      ? Number(zapis.nagroda)
      : null,
    zleconeAt: zapis.zleconeAt || null,
    etykieta: status === "zatwierdzone" ? etykietaZauwazone(mentorRodzaj) : opis.etykieta,
    cta: opis.cta,
    mentorPrawdziwy,
    mentorRodzaj,
    miejsce: zapis.miejsce || null,
  };
}

/** Pierwsze zadanie, którego dziecko jeszcze nie rozliczyło (albo `null`). */
export function zadanieDoZlecenia() {
  const stan = stanZadania();
  if (stan.istnieje && !stan.wyplacone) return null;
  const zrobione = stan.istnieje ? [stan.id] : [];
  return ZADANIA.find((z) => !zrobione.includes(z.id)) || null;
}

/**
 * Zadanie pod WYLOSOWANĄ CECHĘ (koło fortuny). Ta sama zasada dostępności
 * co w `zadanieDoZlecenia` — nic nowego, póki bieżące niewypłacone. W cesze
 * bierzemy pierwsze nierozliczone; gdy wszystkie z cechy już były, bierzemy
 * pierwsze z cechy jeszcze raz (zadania w realu wolno powtarzać — „zrób
 * dziś coś dobrego" nie zużywa się jak misja na mapie).
 */
export function zadanieDlaCechy(cecha) {
  const stan = stanZadania();
  if (stan.istnieje && !stan.wyplacone) return null;
  const wCesze = ZADANIA.filter((z) => z.cecha === cecha);
  if (!wCesze.length) return zadanieDoZlecenia();
  // Ostatnio rozliczone też odpada — dwa razy pod rząd to samo zadanie
  // czyta się jak awaria koła, nawet gdy naprawdę wypadła ta sama cecha.
  const pominiete = new Set([...historiaZadan(), stan.istnieje ? stan.id : null].filter(Boolean));
  const swieze = wCesze.filter((z) => !pominiete.has(z.id));
  const pula = swieze.length ? swieze : wCesze;
  return pula[Math.floor(Math.random() * pula.length)];
}

/** Identyfikatory zadań już rozliczonych (do losowania bez powtórek). */
export function historiaZadan() {
  try {
    const surowe = JSON.parse(localStorage.getItem(KLUCZ_HISTORII) || "[]");
    return Array.isArray(surowe) ? surowe.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function dopiszDoHistorii(id) {
  if (!id) return;
  try {
    const teraz = historiaZadan();
    if (teraz.includes(id)) return;
    localStorage.setItem(KLUCZ_HISTORII, JSON.stringify([...teraz, id]));
  } catch {}
}

export function zlecZadanie(id) {
  const def = definicjaZadania(id);
  if (!def) return stanZadania();
  return zapisz({ id, status: "zlecone", zleconeAt: new Date().toISOString() });
}

/** Wybrane `miejsce` (id z `def.miejsca`) — zapisane, żeby nie przepadało (06 pkt 19). */
export function zapiszMiejsce(miejsce) {
  const zapis = czytaj();
  if (!zapis) return stanZadania();
  return zapisz({ ...zapis, miejsce: miejsce || null });
}

/**
 * Wysłanie dowodu do Mentora. Dwa kroki, bo backend tak działa: najpierw
 * misja musi istnieć (`seed` jest idempotentny po `adventure_ref` + tytule),
 * potem leci do niej dowód. Bez sieci nie udajemy sukcesu — dziecko ma
 * zobaczyć, że nie poszło, a nie czekać w nieskończoność na Mentora.
 */
export async function wyslijDowod({ opis, zdjecieUrl }) {
  const zapis = czytaj();
  if (!zapis) throw new Error("Nie ma zleconego zadania.");
  const def = definicjaZadania(zapis.id);
  const pid = session.getPlayer();
  if (!pid) throw new Error("Brak gracza — zaloguj się w grze.");

  let missionId = zapis.missionId;
  if (!missionId) {
    const utworzona = await api.seedMission(pid, {
      title: def.tytul,
      body: `${def.cel}\n\n${def.jak}`,
      narrative_intro: def.przypomnienie || null,
      competency_focus: def.competency_focus || [],
      proof_type: zdjecieUrl ? "photo" : "text",
      estimated_minutes: def.minuty || 15,
      adventure_ref: `wizkor.${def.id}`,
      // Pytanie do rozmowy dla Mentora (03 §7 `rozmowa`) — zamiast werdyktu.
      rozmowa: def.rozmowa || null,
    });
    missionId = utworzona?.mission_id || utworzona?.id;
    if (!missionId) throw new Error("Nie udało się założyć zadania u Mentora.");
  }

  const odpowiedz = await api.submitMissionProof(missionId, {
    proof_text: opis || "",
    proof_media_url: zdjecieUrl || null,
    place_id: zapis.miejsce || null,
  });

  /* ŚLAD ZOSTAWIONY: monety (25) dopisał backend przy `/submit` — tu tylko
     zapamiętujemy, że poszły, żeby demo nie dopisało ich drugi raz. Świat
     reaguje od razu (`ZadaniePanel` → `onPokazMiejsce`), bez czekania na Mentora. */
  return zapisz({
    ...zapis,
    missionId,
    status: "wyslane",
    notatka: null,
    monetyZaSlad: Number(odpowiedz?.coins_awarded) || 0,
    mentorPrawdziwy: !!odpowiedz?.mentor_present,
    dowod: { opis: opis || "", zdjecieUrl: zdjecieUrl || null, wyslaneAt: new Date().toISOString() },
  });
}

/**
 * WERDYKT BEZ OSOBNEJ WIEŚCI W SKRZYNCE.
 *
 * Była tu funkcja `ogloszZatwierdzenie`, która przy przyjęciu zadania
 * wrzucala do zwoju wpis „Mentor przyjął Twoje zadanie!". USUNIĘTA
 * (2026-08-22, decyzja właściciela): przypięta karta zadania i tak zmienia
 * się wtedy na „Nagroda czeka" — z kwotą i przyciskiem odbioru — więc wieść
 * mówiła to samo drugi raz, dwa centymetry niżej. Plakietkę na zakładce
 * „Zadania" pali sam przypięty wpis (patrz `wpisZadaniaWizkora` w
 * `wiadomosci.js`), więc sygnał „coś na Ciebie czeka" nie znika.
 */
/* ── DEMO: BEZ UDAWANIA OSOBY ─────────────────────────────────────────────
   Dawniej po 60 s od wysłania dowodu zadanie samo przechodziło na
   „zatwierdzone" z notatką „ciche dobro" — czyli udawało żywego Mentora.
   Od 17.09 (docs/tresci/06 pkt 6): świat reaguje OD RAZU po śladzie (status
   `wyslane` = „Ślad zostawiony"), a demo NIGDY nie przełącza na „Mentor
   zobaczył". Jedyne, co demo robi: dopisuje lokalnie 25 monet w tle, gdy
   dowód poszedł skrótem bez backendu (`wyslijDowodDev`), i — jeśli notatka
   w ogóle ma się pokazać — mówi jawnie, że to tryb demo.

   GDY POWSTANIE PANEL MENTORA: `DEMO_SAM_ZATWIERDZA = false`; wtedy
   „Mentor już to widzi" pod śladem pojawia się przy prawdziwym Mentorze. */
const DEMO_SAM_ZATWIERDZA = true;
const DEMO_NOTATKA = "(tryb demo) Świat to zauważył.";
const MONETY_ZA_SLAD = 25;

const ZAUWAZONE = new Set(["noticed", "verified", "highlighted"]);

/**
 * Sprawdzenie werdyktu PRZY OTWARCIU PANELU zadania, bez pollingu. Odpytywanie
 * w tle o coś, co dzieje się raz na dobę, to tylko transfer i bateria.
 *
 * Wcześniej wołał to przycisk „Sprawdź, czy odpisał" — czyli dziecko musiało
 * poprosić o rzecz, po którą właśnie przyszło. Jedno zapytanie na jedno
 * wejście do panelu (`ZadaniePanel`) daje to samo, nie pytając o zgodę.
 */
export async function sprawdzMentora() {
  const zapis = czytaj();
  if (!zapis?.missionId) return stanZadania();
  const misja = await api.getMissionById(zapis.missionId);
  const status = misja?.status || misja?.mission?.status;
  const werdykt = misja?.gm_verification || misja?.mission?.gm_verification || null;
  const mentorPrawdziwy = misja?.mentor_present != null ? !!misja.mentor_present : !!zapis.mentorPrawdziwy;

  if (ZAUWAZONE.has(status)) {
    // Zauważenie nie dodaje monet (`nagroda` zostaje z tła). Formuła Mentora
    // bez oceny idzie do dziecka jako `notatka`; z niej też rodzaj Mentora.
    return zapisz({
      ...zapis,
      status: "zatwierdzone",
      notatka: werdykt?.formula || werdykt?.comment || null,
      mentorRodzaj: werdykt?.mentor_gender || null,
      mentorPrawdziwy,
    });
  }
  // `rejected` / `needs_followup`: dziecko nie widzi werdyktu — ślad zostaje śladem.
  if (mentorPrawdziwy !== !!zapis.mentorPrawdziwy) return zapisz({ ...zapis, mentorPrawdziwy });
  return stanZadania();
}

/* ── SPRAWDZENIE W TLE ────────────────────────────────────────────────────
   Panel pyta o werdykt przy otwarciu, ale dziecko nie ma powodu tam zagladac,
   dopoki nie wie, ze cos sie zmienilo. Zeby wiesc o zatwierdzeniu trafila do
   skrzynki SAMA, swiat pyta raz przy wejsciu i raz przy powrocie do karty.

   To wciaz nie jest polling: dlawik przepuszcza jedno zapytanie na 10 minut,
   a pytamy wylacznie wtedy, gdy naprawde czekamy na Mentora. Znacznik siedzi
   w localStorage, wiec przeladowanie strony w kolko tez nie zamieni tego
   w petle zapytan. */
const KLUCZ_PYTANIA = "ewolucja.zadanie.wizkora.ostatniePytanie";
const ODSTEP_MS = 10 * 60 * 1000;

function wolnoPytac() {
  try {
    const kiedy = Number(localStorage.getItem(KLUCZ_PYTANIA) || 0);
    return !Number.isFinite(kiedy) || Date.now() - kiedy > ODSTEP_MS;
  } catch {
    return true;
  }
}

/** Ciche sprawdzenie werdyktu poza panelem. Bledy sieci sa tu bez znaczenia. */
export async function sprawdzMentoraWTle() {
  const stan = stanZadania();
  if (!stan.czeka) return stan;
  if (!stan.missionId) return stan;
  if (!wolnoPytac()) return stan;
  try { localStorage.setItem(KLUCZ_PYTANIA, String(Date.now())); } catch {}
  try {
    return await sprawdzMentora();
  } catch {
    return stan;
  }
}

/**
 * „Zobacz, co się zmieniło" — dziecko obejrzało reakcję świata po zauważeniu.
 * Nazwa funkcji zostaje (woła ją panel i pulpit), ale monet tu już nie ma:
 * 25 w tle poszło przy śladzie (backend `/submit` albo lokalnie w demie —
 * `oznaczSladLokalnie`), zauważenie nie dodaje nic. Zamyka kartę do historii.
 */
export function odbierzNagrode() {
  const zapis = czytaj();
  if (!zapis || zapis.status !== "zatwierdzone") return stanZadania();
  /**
   * ZADANIE WZMACNIA CECHĘ, pod którą je wylosowano (koło fortuny) — raz,
   * przy domknięciu karty (idempotentne).
   */
  const cecha = definicjaZadania(zapis.id)?.cecha;
  if (cecha) { try { wzmocnijCeche(cecha, 1); } catch {} }
  dopiszDoHistorii(zapis.id);
  return zapisz({ ...zapis, status: "wyplacone" });
}

/**
 * Ślad w demie / bez backendu: 25 monet w tle dopisane lokalnie, raz.
 * Backend robi to sam przy `/submit` (`coins_awarded`), więc lokalnie tylko
 * wtedy, gdy zapis nie ma `missionId` (dowód poszedł skrótem) i monety
 * jeszcze nie poszły.
 */
export function oznaczSladLokalnie() {
  const zapis = czytaj();
  if (!zapis || zapis.status !== "wyslane") return stanZadania();
  if (zapis.missionId || zapis.monetyZaSlad) return stanZadania();
  dodajMonety(MONETY_ZA_SLAD, "zadanie w realu (ślad, demo)");
  return zapisz({ ...zapis, monetyZaSlad: MONETY_ZA_SLAD, demo: true });
}

/** Do pulpitu testowego i konsoli — czekanie na Mentora byłoby nie do zniesienia. */
export function skasujZadanie({ historia = false } = {}) {
  if (historia) { try { localStorage.removeItem(KLUCZ_HISTORII); } catch {} }
  return zapisz(null);
}

/**
 * DEV: wysłanie dowodu BEZ sieci. Zapisuje dokładnie ten sam kształt stanu,
 * który zostawia prawdziwe `wyslijDowod` (status `wyslane` + `dowod` ze
 * zdjęciem i opisem) — pomija tylko backend. Dzięki temu panel zadania,
 * zwój i kwestie Wizkora po dev-owej wysyłce wyglądają IDENTYCZNIE jak po
 * prawdziwej; różni się jedno: brak `missionId`, więc „sprawdź werdykt"
 * nie ma o co pytać — werdykt w tym trybie ustawia się też skrótem
 * (`ustawStatus`). Pulpit próbuje najpierw prawdziwej drogi i schodzi tu
 * dopiero, gdy sieci albo gracza nie ma.
 */
export function wyslijDowodDev({ opis, zdjecieUrl } = {}) {
  const zapis = czytaj();
  if (!zapis) return stanZadania();
  zapisz({
    ...zapis,
    status: "wyslane",
    notatka: null,
    dowod: {
      opis: opis || "",
      zdjecieUrl: zdjecieUrl || null,
      wyslaneAt: new Date().toISOString(),
    },
  });
  return oznaczSladLokalnie();
}

export function ustawStatus(status, notatka = null) {
  const zapis = czytaj();
  if (!zapis) return stanZadania();
  // Skrót z pulpitu: „zatwierdzone" symuluje zauważenie (bez monet — te poszły
  // przy śladzie); notatka domyślnie jawnie demowa.
  return zapisz({
    ...zapis,
    demo: status === "zatwierdzone" ? true : zapis.demo,
    status,
    notatka: notatka ?? (status === "zatwierdzone" ? DEMO_NOTATKA : null),
  });
}
