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

/** Rodzaj dla gracza: zapis wygrywa z heurystyką, heurystyka z domyślnym męskim. */
export function rodzajGracza(player) {
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
