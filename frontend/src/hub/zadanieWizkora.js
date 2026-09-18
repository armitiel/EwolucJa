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
import DANE from "./data/zadania-wizkora.v2.json";
import { api, session } from "../services/api.js";
import { dodajMonety } from "../services/monety.js";
import { loadState, wzmocnijCeche } from "../adventure/engine/adventureState.js";
import { etapSzkolny, typStartowy } from "./profilStartowy.js";
import { zapiszSlad } from "./sladySwiata.js";
import { zdarzenie } from "../services/zdarzenia.js";
/* Import krzyżowy (hybryda.js czyta stąd `historiaZadan` i `odpalReakcjeSwiata`)
   — obie strony sięgają po siebie dopiero w funkcjach, nie przy ładowaniu. */
import { hybrydaOtwarta } from "./hybryda.js";


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

/* v2 (docs/tresci/03 §7–§8, 06 §4.2): 22 zadania aktywne + 3 zastąpione.
   Zastąpione (`zastapione_przez`) nie są już zlecane, ale ich `id` w zapisach
   graczy i w `historiaZadan()` muszą dalej znaczyć to samo — dlatego
   `definicjaZadania` zna oba zbiory. */
export const ZADANIA = DANE.zadania || [];
export const ZADANIA_ZASTAPIONE = DANE.zastapione || [];
const WSZYSTKIE = [...ZADANIA, ...ZADANIA_ZASTAPIONE];

/* Obrazki śladu (`slad.obrazki`) — do narysowania w stylu claymorphism; do tego
   czasu emoji (ta sama nazwa = ten sam znak w całej grze). */
export const OBRAZKI_SLADU = {
  "trzy-rzeczy": "🔎", "puste-miejsce": "⬜", "nowa-rzecz": "✨", "jedna-rzecz": "🔍", "stara-rzecz": "🪨",
  "dwie-osoby": "🧑‍🤝‍🧑", "dymek-prosba": "💬", "rece": "🙌", "cicho": "🤫", "znak-zapytania": "❓", "oko": "👁",
  "dwa-krzesla": "🪑", "dymek": "💭", "puste-krzeslo": "🪑", "wachlarz": "📐", "rowno": "⚖️", "plaska": "📄",
  "zegar-mniej": "⏱", "zegar-rowno": "🕛", "zegar-wiecej": "⏰", "rzecz-w-roli": "🔧", "polowa": "◑",
  "trzy-krzywe": "〰️", "duzo-krzywych": "🌀", "jedna-krzywa": "➰", "skarpetki-blisko": "🧦", "skarpetki-daleko": "🧦",
  "trzy-skoki": "🦘", "stoi": "🏗", "w-polowie": "🧱", "start": "🚀", "fala-mala": "🔉", "fala-duza": "🔊", "jedna-fala": "🔈",
  "slady-duzo": "👣", "slady-kilka": "🐾", "piec-sladow": "✋", "rzecz-dziala": "⚙️", "rzecz-trzyma": "🧷", "dwie-rzeczy": "🔗",
  "dwie-rece-wieza": "🧱", "dymki": "💬", "dymek-zaproszenie": "📣", "dymek-dwa": "🗨", "dymek-cichy": "🤍",
  "zarowka": "💡", "zegar": "🕰", "ksiazka": "📖", "reka": "✋", "gwiazdka": "⭐", "strzalka": "➡️", "check": "✅",
  "siedem": "7️⃣", "srodek": "🎯", "trzy": "3️⃣", "rzecz-stoi": "🧍",
};
export function obrazekSladu(nazwa) { return OBRAZKI_SLADU[nazwa] || "✦"; }

/* Wariant etapu 1–3 / 4–8: pola z `warianty[etap]` nadpisują bazowe; `miejsca`
   w wariancie to mapa `id → opis` (03 §7). Bez zapisu etapu — tekst bazowy 4–8. */
export function zWariantemZadania(def, etap = etapSzkolny()) {
  if (!def) return def;
  const w = def.warianty?.[etap];
  if (!w) return def;
  const { miejsca: mapaMiejsc, ...reszta } = w;
  const out = { ...def, ...reszta };
  if (mapaMiejsc && Array.isArray(def.miejsca)) {
    out.miejsca = def.miejsca.map((m) => (mapaMiejsc[m.id] ? { ...m, opis: mapaMiejsc[m.id] } : m));
  }
  return out;
}

/* Filtr etapu: zadanie spoza etapu gracza nie wchodzi do puli. */
function dlaEtapu(z, etap = etapSzkolny()) {
  return !z.etap || z.etap === "oba" || z.etap === etap;
}

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
  return WSZYSTKIE.find((z) => z.id === id) || null;
}

/* Rodziny już wykonane (`rodzina` — jedno doświadczenie w wielu miejscach,
   06 §6): zadanie z rodziny, którą dziecko już przeszło, nie wraca. */
function rodzinyZrobione() {
  const zrobione = new Set(historiaZadan());
  const r = new Set();
  for (const z of WSZYSTKIE) if (zrobione.has(z.id) && z.rodzina) r.add(z.rodzina);
  return r;
}

/**
 * PIERWSZE TRZY ZADANIA bez losowania Kołem (03 §6.2, 06 §4.7):
 * para z `profil_pierwszy` (profil z testu, `typStartowy()`), potem zadanie
 * z osi o najniższym liczniku cech (`adventureState.traits`, rośnie przez
 * `wzmocnijCeche`). Profil to kolejność, nie zbiór — nic nie blokuje osi.
 * Zwraca listę definicji jeszcze niezrobionych, w kolejności.
 */
export function pierwszeZadania(profil = typStartowy(), sygnaly = null) {
  const etap = etapSzkolny();
  const zrobione = new Set(historiaZadan());
  const pula = ZADANIA.filter((z) => dlaEtapu(z, etap));
  const para = profil ? pula.filter((z) => z.profil_pierwszy === profil) : [];
  const traits = sygnaly || (() => { try { return loadState(null)?.traits || {}; } catch { return {}; } })();
  const osie = ["ciekawosc", "tworzenie", "wspolpraca", "odwaga", "wytrwalosc"];
  const najslabsza = osie
    .filter((o) => !para.some((z) => z.cecha === o))
    .sort((a, b) => (traits[a] || 0) - (traits[b] || 0))[0];
  const trzecie = pula.find((z) => z.cecha === najslabsza && !para.includes(z));
  const kolejka = [...para, ...(trzecie ? [trzecie] : [])].slice(0, 3);
  return kolejka.filter((z) => !zrobione.has(z.id));
}

/** Czy dziecko jest jeszcze w pierwszych trzech zadaniach (Koło nie losuje). */
export function fazaPierwszych() {
  return historiaZadan().length < 3 && pierwszeZadania().length > 0;
}

/** Cecha, na której Koło ma stanąć w fazie pierwszych zadań (albo `null`). */
export function cechaNastepnegoZadania() {
  if (!fazaPierwszych()) return null;
  return pierwszeZadania()[0]?.cecha || null;
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
  /* JEDNO ZADANIE NA DANY MOMENT (05 §1.2): dopóki hybryda jest otwarta
     (trop / część A / „Czeka — u ciebie"), Koło nie ma czego losować. Gier
     to nie blokuje — o tym decyduje oś w `etapyMisji`/`kwestieWizkora`. */
  if (hybrydaOtwarta()) return null;
  const zrobione = new Set([...historiaZadan(), stan.istnieje ? stan.id : null].filter(Boolean));
  const etap = etapSzkolny();
  return pierwszeZadania()[0] || ZADANIA.find((z) => dlaEtapu(z, etap) && !zrobione.has(z.id)) || ZADANIA.find((z) => dlaEtapu(z, etap)) || null;
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
  if (hybrydaOtwarta()) return null;   // hybryda czeka u dziecka — Koło stoi (05 §1.2)
  /* Pierwsze trzy zadania idą z kolejki profilu, nie z losowania — Koło jest
     wtedy ceremonią, która staje na cesze zadania z kolejki
     (`cechaNastepnegoZadania` w `KoloFortuny`). */
  const pierwsze = pierwszeZadania();
  if (historiaZadan().length < 3 && pierwsze.length) return pierwsze[0];

  const etap = etapSzkolny();
  const wCesze = ZADANIA.filter((z) => z.cecha === cecha && dlaEtapu(z, etap));
  if (!wCesze.length) return zadanieDoZlecenia();
  // Kolejka bez powtórek po `id` i bez rodzin już przejścianych; ostatnio
  // rozliczone też odpada. Gdy cała cecha przerobiona — zadania wracają
  // (zadania w realu wolno powtarzać, „zrób coś dobrego" się nie zużywa).
  const pominiete = new Set([...historiaZadan(), stan.istnieje ? stan.id : null].filter(Boolean));
  const rodziny = rodzinyZrobione();
  const swieze = wCesze.filter((z) => !pominiete.has(z.id) && !(z.rodzina && rodziny.has(z.rodzina)));
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

/** Wybrana opcja śladu (indeks 0–2 w `def.slad.opcje`, albo `null`). */
export function zapiszSladOpcje(opcja) {
  const zapis = czytaj();
  if (!zapis) return stanZadania();
  return zapisz({ ...zapis, sladOpcja: Number.isInteger(opcja) ? opcja : null });
}

/**
 * REAKCJA ŚWIATA — kanał ślad → scena (06 §4.3, krok 5).
 *
 * Metody z `reakcja_swiata.metoda` żyją w `scena-3d-src/src/slady.js`
 * i wychodzą na zewnątrz przez `globalThis.__SCENA`. Wołamy je po nazwie
 * z danych, więc literówka w JSON-ie rozłącza kanał bez błędu — zostaje
 * ostrzeżenie w konsoli.
 *
 * ŚLAD ZAPISUJEMY NIEZALEŻNIE OD TEGO, CZY SCENA GO PRZYJĘŁA. Dziecko może
 * zostawić ślad w panelu otwartym, zanim scena zdąży wstać, albo w ogóle poza
 * światem 3D. Wpis w dzienniku (`sladySwiata.js`) sprawia, że kwiat wyrośnie
 * przy najbliższym wejściu — a to jest ta sama obietnica, tylko odroczona.
 * Odwrotna kolejność (zapis dopiero po udanym wywołaniu) gubiłaby dokładnie
 * te ślady, przy których najbardziej widać, że świat nie zauważył.
 *
 * Zwraca toast z definicji (tytuł ≤ 28 znaków).
 */
export function odpalReakcjeSwiata(reakcja, zrodlo = null) {
  if (!reakcja || !reakcja.metoda) return null;
  zapiszSlad(reakcja, zrodlo);
  const scena = globalThis.__SCENA;
  const fn = scena?.[reakcja.metoda];
  if (typeof fn === "function") {
    try {
      fn(...(Array.isArray(reakcja.args) ? reakcja.args : []));
      // Analityka pętli (06 §4.12): świat NAPRAWDĘ zareagował — nie „ślad czeka".
      zdarzenie("swiat.zareagowal", { zadanie: zrodlo || null, metoda: reakcja.metoda });
    }
    catch (err) { console.warn("[zadanieWizkora] reakcja świata nie poszła:", reakcja.metoda, err); }
  } else {
    console.warn("[zadanieWizkora] scena nie zna metody", reakcja.metoda, "— ślad czeka w dzienniku");
  }
  try { scena?.pokazMiejsce?.(); } catch {}
  return reakcja.toast || null;
}

/**
 * Wysłanie dowodu do Mentora. Dwa kroki, bo backend tak działa: najpierw
 * misja musi istnieć (`seed` jest idempotentny po `adventure_ref` + tytule),
 * potem leci do niej dowód. Bez sieci nie udajemy sukcesu — dziecko ma
 * zobaczyć, że nie poszło, a nie czekać w nieskończoność na Mentora.
 */
export async function wyslijDowod({ opis, zdjecieUrl, maZdjecie = false }) {
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
      proof_type: (zdjecieUrl || maZdjecie) ? "photo" : "text",
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
    slad_opcja: Number.isInteger(zapis.sladOpcja) ? zapis.sladOpcja : null,
    slad_opcja_tekst: Number.isInteger(zapis.sladOpcja) ? (def.slad?.opcje?.[zapis.sladOpcja] || null) : null,
    mentor_powiadomienie: def.mentor_powiadomienie || null,
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
    dowod: { opis: opis || "", zdjecieUrl: zdjecieUrl || null, sladOpcja: zapis.sladOpcja ?? null, wyslaneAt: new Date().toISOString() },
  });
}

/**
 * MINIATURA POSZŁA (tor W7): panel wysłał obraz z canvasu na
 * `/missions/:id/miniatura` już PO śladzie (misja musi istnieć). Zapamiętujemy
 * samą flagę — sam obraz leży na serwerze, w zapisie nie trzymamy bajtów.
 */
export function oznaczMiniature(missionId) {
  const zapis = czytaj();
  if (!zapis || (missionId && zapis.missionId && zapis.missionId !== missionId)) return stanZadania();
  return zapisz({ ...zapis, dowod: { ...(zapis.dowod || {}), miniatura: true } });
}

/* ── POWRÓT PO ŚLADZIE (analityka pętli, 06 §4.12) ─────────────────────────
   „Wrócił" znaczy: wszedł do świata w NOWEJ sesji po tym, jak zostawił ślad
   — nie odświeżył strony sekundę po wysłaniu. Dlatego liczymy raz na
   załadowanie strony (`powrotSprawdzony`), tylko gdy ślad jest starszy niż
   start tej strony, i tylko raz na zadanie (`powrotOdnotowany` w zapisie). */
const START_STRONY = new Date().toISOString();
let powrotSprawdzony = false;
const PO_SLADZIE = new Set(["wyslane", "poprawka", "zatwierdzone"]);

export function odnotujPowrotPoSladzie() {
  if (powrotSprawdzony) return false;
  powrotSprawdzony = true;
  const zapis = czytaj();
  if (!zapis || !PO_SLADZIE.has(zapis.status) || zapis.powrotOdnotowany) return false;
  const wyslaneAt = zapis.dowod?.wyslaneAt || null;
  if (!wyslaneAt || wyslaneAt >= START_STRONY) return false;
  zdarzenie("powrot.po.sladzie", { zadanie: zapis.id, status: zapis.status, po_minutach: Math.round((Date.now() - Date.parse(wyslaneAt)) / 60000) });
  zapisz({ ...zapis, powrotOdnotowany: true });
  return true;
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
    // Dodatek w świecie (kwiat w nowym kolorze przy drabince) — raz.
    const def = definicjaZadania(zapis.id);
    if (!zapis.reakcjaMentorOdpalona) odpalReakcjeSwiata(def?.reakcja_mentor, zapis.id);
    return zapisz({
      ...zapis,
      status: "zatwierdzone",
      notatka: werdykt?.formula || werdykt?.comment || null,
      mentorRodzaj: werdykt?.mentor_gender || null,
      mentorPrawdziwy,
      reakcjaMentorOdpalona: true,
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
  // Pierwsze wywołanie na tej stronie = wejście do świata; tu liczy się powrót.
  try { odnotujPowrotPoSladzie(); } catch {}
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
  // przy śladzie); notatka domyślnie jawnie demowa; dodatek w świecie raz.
  if (status === "zatwierdzone" && !zapis.reakcjaMentorOdpalona) odpalReakcjeSwiata(definicjaZadania(zapis.id)?.reakcja_mentor, zapis.id);
  return zapisz({
    reakcjaMentorOdpalona: status === "zatwierdzone" ? true : zapis.reakcjaMentorOdpalona,
    ...zapis,
    demo: status === "zatwierdzone" ? true : zapis.demo,
    status,
    notatka: notatka ?? (status === "zatwierdzone" ? DEMO_NOTATKA : null),
  });
}
