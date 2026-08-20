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

const KLUCZ = "ewolucja.zadanie.wizkora";
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

export function odbierzNagrode() {
  const zapis = czytaj();
  if (!zapis || zapis.status !== "zatwierdzone") return stanZadania();
  return zapisz({ ...zapis, status: "wyplacone" });
}

/** Do pulpitu testowego i konsoli — czekanie na Mentora byłoby nie do zniesienia. */
export function skasujZadanie() {
  return zapisz(null);
}

export function ustawStatus(status, notatka = null) {
  const zapis = czytaj();
  if (!zapis) return stanZadania();
  const def = definicjaZadania(zapis.id);
  return zapisz({
    ...zapis,
    status,
    notatka,
    nagroda: status === "zatwierdzone" ? (zapis.nagroda || def?.nagroda || 25) : zapis.nagroda,
  });
}
