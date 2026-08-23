/**
 * zadanieWizkora — zadanie, którego NIE da się zrobić w grze.
 *
 * Wizkor zleca je tak samo jak misje z grami (`misjeGier.js`), ale dowodem nie
 * jest rozegrana partia, tylko coś, co dziecko zrobiło poza ekranem: zdjęcie
 * albo własne zdanie. Ten dowód idzie do Mentora ISTNIEJĄCYM torem
 * weryfikacji — `POST /missions/seed` → `POST /missions/:id/submit` →
 * Mentor w swoim panelu → `GET /missions/:id`. Nie budujemy drugiego.
 *
 * PIĘĆ STANÓW, każdy odczytywalny z jednego obiektu (ta sama zasada, co
 * w `zadanieGwiazdek.js` — inaczej Wizkor nie wie, co powiedzieć, a zwój nie
 * wie, co pokazać):
 *
 *   brak        — Wizkor jeszcze nie zlecił
 *   zlecone     — do zrobienia poza ekranem
 *   wyslane     — dowód poszedł, czekamy na Mentora
 *   poprawka    — Mentor prosi o poprawkę (jego komentarz w `notatka`)
 *   zatwierdzone— Mentor przyjął, nagroda czeka
 *   wyplacone   — monety dopisane
 *
 * Monety mają JEDNO źródło prawdy: backend przy decyzji Mentora. Frontend
 * zapamiętuje `points_awarded`, pokazuje je dziecku i pozwala domknąć ekran,
 * ale nie dopisuje drugiej lokalnej nagrody.
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
  zlecone: { etykieta: "Do zrobienia", cta: "Otwórz" },
  poprawka: { etykieta: "Mentor prosi o poprawkę", cta: "Popraw" },
  // „Sprawdzane" zamiast „U Mentora": plakietka ma mowic, CO SIE DZIEJE
  // z odpowiedzia dziecka, a nie gdzie lezy teczka. CTA prowadzi do panelu,
  // wiec zaprasza („Zajrzyj"), zamiast obiecywac werdykt od razu.
  wyslane: { etykieta: "Sprawdzane", cta: "Zajrzyj" },
  zatwierdzone: { etykieta: "Nagroda czeka", cta: "Odbierz nagrodę" },
  wyplacone: { etykieta: "Zrobione", cta: "Zobacz" },
};

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
};

/** Jedno źródło prawdy o zadaniu — czyta je zwój, panel, Wizkor i licznik. */
export function stanZadania() {
  const zapis = czytaj();
  if (!zapis) return { ...PUSTE };
  const def = definicjaZadania(zapis.id);
  const status = zapis.status || "zlecone";
  const opis = OPIS_STANU[status] || OPIS_STANU.zlecone;
  return {
    istnieje: true,
    def,
    id: zapis.id,
    missionId: zapis.missionId || null,
    status,
    doZrobienia: status === "zlecone" || status === "poprawka",
    czeka: status === "wyslane",
    doOdbioru: status === "zatwierdzone",
    wyplacone: status === "wyplacone",
    notatka: zapis.notatka || null,
    dowod: zapis.dowod || null,
    nagroda: zapis.nagroda != null && Number.isFinite(Number(zapis.nagroda))
      ? Number(zapis.nagroda)
      : null,
    zleconeAt: zapis.zleconeAt || null,
    etykieta: opis.etykieta,
    cta: opis.cta,
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
    });
    missionId = utworzona?.mission_id || utworzona?.id;
    if (!missionId) throw new Error("Nie udało się założyć zadania u Mentora.");
  }

  await api.submitMissionProof(missionId, {
    proof_text: opis || "",
    proof_media_url: zdjecieUrl || null,
  });

  return zapisz({
    ...zapis,
    missionId,
    status: "wyslane",
    notatka: null,
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
 * „Listy" pali sam przypięty wpis (patrz `wpisZadaniaWizkora` w
 * `wiadomosci.js`), więc sygnał „coś na Ciebie czeka" nie znika.
 */
/* ── DEMO: WERDYKT PRZYCHODZI SAM ─────────────────────────────────────────
   JAK JEST BEZ TEGO. Dowód leci do bazy i misja dostaje status `submitted`.
   Na `verified` przestawia ją WYŁĄCZNIE prawdziwy Mentor ze swojego panelu
   (`backend/src/api/mentor.js` → `decision: "approve"`); w kodzie nie ma
   niczego, co zrobiłoby to samo automatycznie. W wersji demo, gdzie po
   drugiej stronie nie ma nikogo, zadanie zostawało więc na zawsze
   w „Sprawdzane", a nagroda nie dochodziła nigdy.

   CO ROBI PRZEŁĄCZNIK. Po `DEMO_OPOZNIENIE_MS` od wysłania dowodu werdykt
   przychodzi sam: karta zadania zmienia się na „Nagroda czeka", plakietka
   zapala się na „Listach", a monety dopisują się przy odbiorze nagrody.

   DLACZEGO NIE NATYCHMIAST. „Wysłane do Mentora", po którym nagroda pojawia
   się w tej samej sekundzie, mówi dziecku wprost, że po drugiej stronie
   nikogo nie ma. Minuta wystarczy, żeby werdykt trafił do niego w trakcie
   biegania po mapie — jako coś, co przyszło, a nie jako część kliknięcia.

   GDY POWSTANIE PANEL MENTORA: `DEMO_SAM_ZATWIERDZA = false` i tyle. Reszta
   toru — sprawdzanie, karta w zwoju, ekran nagrody — jest wspólna dla obu
   dróg i nie zauważy różnicy. */
const DEMO_SAM_ZATWIERDZA = true;
const DEMO_OPOZNIENIE_MS = 60_000;
const DEMO_NOTATKA = "Widziałem, co zrobiłeś. Właśnie tak wygląda ciche dobro.";

function demoWerdyktGotowy(zapis) {
  if (!DEMO_SAM_ZATWIERDZA) return false;
  if (!zapis || zapis.status !== "wyslane") return false;
  const wyslane = new Date(zapis.dowod?.wyslaneAt || 0).getTime();
  // Zapis bez znacznika (starsza wersja gry) nie ma czekać w nieskończoność.
  if (!wyslane || Number.isNaN(wyslane)) return true;
  return Date.now() - wyslane >= DEMO_OPOZNIENIE_MS;
}

/** `demo: true` w zapisie znaczy „tych monet NIE ma w bazie" — patrz `odbierzNagrode`. */
function zatwierdzDemo(zapis) {
  const def = definicjaZadania(zapis.id);
  return zapisz({
    ...zapis,
    status: "zatwierdzone",
    notatka: DEMO_NOTATKA,
    nagroda: zapis.nagroda ?? def?.nagroda ?? 25,
    demo: true,
  });
}

const PRZYJETE = new Set(["verified", "highlighted"]);
const DO_POPRAWKI = new Set(["rejected", "needs_followup"]);

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
  // Demo odpowiada zamiast Mentora i nie potrzebuje do tego ani sieci, ani
  // `missionId`: dowód wysłany skrótem z pulpitu (`wyslijDowodDev`) też ma
  // doczekać się werdyktu.
  if (demoWerdyktGotowy(zapis)) return zatwierdzDemo(zapis);
  if (!zapis?.missionId) return stanZadania();
  const misja = await api.getMissionById(zapis.missionId);
  const status = misja?.status || misja?.mission?.status;
  const werdykt = misja?.gm_verification || misja?.mission?.gm_verification || null;

  if (PRZYJETE.has(status)) {
    const nagroda = Number(werdykt?.points_awarded);
    return zapisz({
      ...zapis,
      status: "zatwierdzone",
      notatka: werdykt?.comment_text || werdykt?.comment || null,
      nagroda: Number.isFinite(nagroda) ? nagroda : null,
    });
  }
  if (DO_POPRAWKI.has(status)) {
    return zapisz({ ...zapis, status: "poprawka", notatka: werdykt?.comment_text || werdykt?.comment || null });
  }
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
  // Werdykt demo jest lokalny, więc idzie PRZED dławikiem — ten pilnuje
  // zapytań do serwera, a tutaj żadnego nie ma. Inaczej nagroda w demie
  // potrafiłaby spóźnić się o dziesięć minut z powodu ochrony przed
  // odpytywaniem czegoś, o co i tak nie pytamy.
  const zapis = czytaj();
  if (demoWerdyktGotowy(zapis)) return zatwierdzDemo(zapis);
  if (!stan.missionId) return stan;
  if (!wolnoPytac()) return stan;
  try { localStorage.setItem(KLUCZ_PYTANIA, String(Date.now())); } catch {}
  try {
    return await sprawdzMentora();
  } catch {
    return stan;
  }
}

export function odbierzNagrode() {
  const zapis = czytaj();
  if (!zapis || zapis.status !== "zatwierdzone") return stanZadania();
  /**
   * JEDNO ŹRÓDŁO MONET NA JEDNĄ DROGĘ, nigdy dwa naraz.
   *
   * Prawdziwy werdykt Mentora zapisuje monety w bazie (`points_awarded`) —
   * wchodzą do HUD-u przy najbliższym odświeżeniu gracza, a dopisanie ich tu
   * jeszcze raz byłoby podwójnym liczeniem (patrz `services/monety.js`).
   * Werdykt demo nie ma ich skąd wziąć, więc lecą torem lokalnym — tym samym,
   * co nagrody za minigry. Rozstrzyga o tym `demo` w zapisie.
   */
  if (zapis.demo) {
    const def = definicjaZadania(zapis.id);
    dodajMonety(zapis.nagroda ?? def?.nagroda ?? 25, "zadanie w realu (demo)");
  }
  /**
   * ZADANIE WZMACNIA CECHĘ, pod którą je wylosowano (koło fortuny).
   * Podbicie idzie przy WYPŁACIE, nie przy wysłaniu dowodu — cecha rośnie
   * za rzecz zrobioną i przyjętą przez Mentora, a wypłata jest idempotentna,
   * więc i cecha nie urośnie dwa razy za jedno zadanie.
   */
  const cecha = definicjaZadania(zapis.id)?.cecha;
  if (cecha) { try { wzmocnijCeche(cecha, 1); } catch {} }
  dopiszDoHistorii(zapis.id);
  return zapisz({ ...zapis, status: "wyplacone" });
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
  return zapisz({
    ...zapis,
    status: "wyslane",
    notatka: null,
    dowod: {
      opis: opis || "",
      zdjecieUrl: zdjecieUrl || null,
      wyslaneAt: new Date().toISOString(),
    },
  });
}

export function ustawStatus(status, notatka = null) {
  const zapis = czytaj();
  if (!zapis) return stanZadania();
  const def = definicjaZadania(zapis.id);
  return zapisz({
    ...zapis,
    // Skrót z pulpitu nie jest werdyktem z bazy, więc monety muszą pójść
    // torem lokalnym — inaczej „Odbierz nagrodę" nie dołożyłoby ani grosza.
    demo: status === "zatwierdzone" ? true : zapis.demo,
    status,
    notatka,
    nagroda: status === "zatwierdzone" ? (zapis.nagroda || def?.nagroda || 25) : zapis.nagroda,
  });
}
