/*!
 * EwolucJA — gra edukacyjna dla dzieci.
 * © 2026 Amitiel Angelisme. Wszelkie prawa zastrzeżone.
 * Powstało w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”.
 * Prawa autorskie należą do autora. Pełna nota: LICENSE.
 */
/**
 * rodzaj — w jakim rodzaju gra mówi do dziecka i jak się wtedy nazywa jego archetyp.
 *
 * PO CO. Nazwy archetypów są rzeczownikami osobowymi, więc mają rodzaj:
 * dziewczynka, która dostaje „jesteś Odkrywcą", czyta zdanie nie o sobie.
 * Pięć z sześciu nazw ma formę żeńską; „Spokojna Głowa" jest wyrażeniem
 * i działa dla obojga bez zmiany.
 *
 * SKĄD RODZAJ. Gra nie pyta dziecka o płeć i nie ma takiej kolumny w bazie —
 * jedyne `gender` w kodzie obsługuje generator awatara w porzuconym prototypie
 * V1. Dlatego kolejność jest taka:
 *   1. `player.gender` ("girl" / "boy"), jeśli kiedykolwiek zostanie zapisane,
 *   2. końcówka imienia — w polskim imiona na „-a" są w przytłaczającej
 *      większości żeńskie, a wyjątki (Kuba, Barnaba, Bonawentura) mieszczą się
 *      na krótkiej liście,
 *   3. rodzaj męski jako ostatnia deska ratunku.
 *
 * Heurystyka po imieniu jest świadomym kompromisem: bez niej KAŻDA dziewczynka
 * dostaje formę męską, z nią myli się tylko przy kilku imionach. Docelowo to
 * ma być jedno pytanie w onboardingu („jak mam do Ciebie mówić?") i wtedy
 * `player.gender` wygra bez zgadywania.
 */

/** Imiona męskie zakończone na „-a" — inaczej heurystyka zrobiłaby z nich dziewczynki. */
const MESKIE_NA_A = new Set([
  "kuba", "barnaba", "bonawentura", "dyzma", "sasza", "jarema", "kosma", "nikita", "ilja", "mustafa",
]);

export const RODZAJ = { MESKI: "meski", ZENSKI: "zenski" };

/**
 * Wybór z onboardingu („Twój bohater to dziewczynka czy chłopiec?"). Trzyma się
 * w localStorage obok etapu szkolnego — tam, gdzie już siedzi wszystko, co gra
 * wie o dziecku przed pierwszą odpowiedzią backendu.
 */
export const KLUCZ_RODZAJ = "ewolucja.profil.rodzaj";

export function rodzajBohatera() {
  try {
    const z = localStorage.getItem(KLUCZ_RODZAJ);
    return z === RODZAJ.ZENSKI ? RODZAJ.ZENSKI : z === RODZAJ.MESKI ? RODZAJ.MESKI : null;
  } catch {
    return null;
  }
}

export function zapiszRodzajBohatera(rodzaj) {
  try { localStorage.setItem(KLUCZ_RODZAJ, rodzaj === RODZAJ.ZENSKI ? RODZAJ.ZENSKI : RODZAJ.MESKI); } catch {}
}

/**
 * Nazwy archetypów w obu rodzajach. Kolejność: [męski, żeński].
 * `MD` celowo ma dwa razy to samo — „Spokojna Głowa" to wyrażenie, nie nazwa
 * osoby, więc odmienia się tak samo niezależnie od tego, kto je nosi.
 */
export const NAZWY_ARCHETYPU = {
  DT: ["Odkrywca", "Odkrywczyni"],
  EM: ["Przyjaciel", "Przyjaciółka"],
  ST: ["Myśliciel", "Myślicielka"],
  KR: ["Wynalazca", "Wynalazczyni"],
  LD: ["Śmiałek", "Śmiałka"],
  MD: ["Spokojna Głowa", "Spokojna Głowa"],
};

export function rodzajZImienia(imie) {
  const i = String(imie || "").trim().toLowerCase();
  if (!i) return RODZAJ.MESKI;
  const pierwsze = i.split(/[\s-]/)[0];
  if (MESKIE_NA_A.has(pierwsze)) return RODZAJ.MESKI;
  return /[aą]$/.test(pierwsze) ? RODZAJ.ZENSKI : RODZAJ.MESKI;
}

/**
 * Imiona testowe / zastępcze, które nie są prawdziwym imieniem dziecka
 * ("test", "aaa", "gracz"...). Dla nich gra nie zgaduje rodzaju po końcówce
 * (żeby "ala"-podobny śmieć nie robił z gracza dziewczynki), tylko przyjmuje
 * męski jako domyślny.
 */
const IMIONA_TESTOWE = new Set([
  "test", "testy", "testowy", "testowa", "tester", "aaa", "bbb", "ccc", "abc",
  "abcd", "qwerty", "asdf", "asd", "qwe", "xxx", "xyz", "admin", "user", "gracz",
  "dziecko", "imie", "nick", "ktos", "nikt", "anonim", "null", "undefined",
  "none", "lol", "haha", "dupa", "aaaa", "bbbb",
]);

/**
 * Czy wpisany tekst wygląda na prawdziwe imię, a nie na wpis testowy albo
 * przypadkowy stukot w klawiaturę. Sito jest luźne — ma odsiać oczywisty
 * śmieć, nie recenzować imion.
 */
export function czyImieWyglada(imie) {
  const i = String(imie || "").trim().toLowerCase();
  if (!i) return false;
  const p = i.split(/[\s-]/)[0];               // pierwszy człon ("Anna Maria" -> "anna")
  if (p.length < 2) return false;               // jednoliterowe
  if (/[0-9]/.test(p)) return false;            // cyfry w imieniu
  if (/^(.)\1+$/.test(p)) return false;         // same powtórzone znaki: "aaa", "xxxx"
  if (!/[aeiouyąęó]/.test(p)) return false;    // brak samogłoski ("qwrt")
  if (IMIONA_TESTOWE.has(p)) return false;
  return true;
}

/**
 * Rodzaj przyjmowany na starcie, gdy gra pyta wyłącznie o imię (bez wyboru
 * postaci). Dla imienia, które nie wygląda na prawdziwe, wynik to męski (ON) —
 * świadomy domyślny. Dla sensownego imienia decyduje końcówka.
 */
export function rodzajStartowy(imie) {
  if (!czyImieWyglada(imie)) return RODZAJ.MESKI;
  return rodzajZImienia(imie);
}

/**
 * Rodzaj dla gracza. Kolejność: wybór dziecka z onboardingu → zapis na koncie →
 * końcówka imienia → rodzaj męski. Heurystyka jest ostatnią deską ratunku,
 * a nie pierwszym pomysłem: dziecko, które odpowiedziało na pytanie, ma być
 * potraktowane tak, jak odpowiedziało.
 */
export function rodzajGracza(player) {
  const wybor = rodzajBohatera();
  if (wybor) return wybor;
  const zapis = String(player?.gender || player?.rodzaj || "").toLowerCase();
  if (zapis === "girl" || zapis === "zenski" || zapis === "k") return RODZAJ.ZENSKI;
  if (zapis === "boy" || zapis === "meski" || zapis === "m") return RODZAJ.MESKI;
  return rodzajZImienia(player?.name || player?.imie);
}

/**
 * Nazwa archetypu w rodzaju pasującym do dziecka.
 * @param {string} kod kod profilu (DT/EM/ST/KR/LD/MD)
 * @param {string} rodzaj RODZAJ.MESKI albo RODZAJ.ZENSKI
 */
export function nazwaArchetypu(kod, rodzaj = RODZAJ.MESKI) {
  const para = NAZWY_ARCHETYPU[kod] || NAZWY_ARCHETYPU.DT;
  return rodzaj === RODZAJ.ZENSKI ? para[1] : para[0];
}

/** Skrót dla komponentów: gracz → gotowa nazwa. */
export function nazwaArchetypuGracza(kod, player) {
  return nazwaArchetypu(kod, rodzajGracza(player));
}

/**
 * ODMIANA TEKSTU. W treściach porad i zadań piszemy pary w klamrach:
 *
 *   "Dobry dzień, {mały|mała} {Śmiałku|Śmiałko}."
 *
 * Pierwsza forma jest męska, druga żeńska. Tekst bez klamer przechodzi bez
 * zmian, więc stare wpisy działają dalej — a te z klamrami czyta się w pliku
 * danych tak samo dobrze jak w grze, bo widać obie formy naraz.
 *
 * Alternatywą byłoby trzymanie dwóch wersji każdego zdania. Przy 355 poradach
 * to dwa razy więcej tekstu do napisania i do poprawienia przy każdej zmianie.
 */
export function odmien(tekst, rodzaj = RODZAJ.MESKI) {
  if (!tekst || tekst.indexOf("{") === -1) return tekst || "";
  const zenski = rodzaj === RODZAJ.ZENSKI;
  return String(tekst).replace(/\{([^{}|]*)\|([^{}|]*)\}/g, (_, m, z) => (zenski ? z : m));
}

/** Skrót: tekst odmieniony pod konkretnego gracza. */
export function odmienDlaGracza(tekst, player) {
  return odmien(tekst, rodzajGracza(player));
}

/**
 * Odmiana po samym imieniu — dla ekranów DOROSŁEGO (panel Mentora, panel GM),
 * gdzie nie ma obiektu gracza, tylko podpisane imię dziecka. Trafia gorzej niż
 * `odmienDlaGracza` (nie widzi zapisanego wyboru z onboardingu), ale i tak jest
 * lepsza niż zostawienie mentorowi surowego `{Śmiałku|Śmiałko}` na ekranie.
 */
export function odmienDlaImienia(tekst, imie) {
  return odmien(tekst, rodzajZImienia(imie));
}
