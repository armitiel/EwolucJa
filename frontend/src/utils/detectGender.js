/**
 * detectGender — Rozpoznaje płeć na podstawie polskiego imienia.
 *
 * Zwraca: "boy" | "girl" | "unknown"
 *
 * Logika:
 * 1. Sprawdza listę wyjątków męskich kończących się na -a (Kuba, Barnaba, itp.)
 * 2. Sprawdza listę wyjątków żeńskich NIE kończących się na -a (Noemi, Ruth, itp.)
 * 3. Imiona kończące się na -a → girl
 * 4. Reszta → boy
 */

// Męskie imiona kończące się na -a (wyjątki od reguły)
const MALE_ENDING_A = new Set([
  "kuba", "jakuba", "barnaba", "bonawentura", "kosma",
  "dyzma", "jarema", "juda", "luka", "boryna",
  "saba", "sasza", "kalina", "nikita",
]);

// Żeńskie imiona NIE kończące się na -a (wyjątki)
const FEMALE_NOT_A = new Set([
  "noemi", "ruth", "rut", "noel", "miriam",
  "carmen", "esther", "ines", "iris", "ingrid",
  "nicole", "rachel", "judith",
]);

// Popularne polskie imiona — backup dla pewności
const KNOWN_MALE = new Set([
  "adam", "adrian", "aleksander", "andrzej", "antoni", "artur",
  "bartek", "bartosz", "bartłomiej", "bogdan", "borys", "bruno",
  "cezary", "cyprian", "czesław", "damian", "daniel", "dariusz",
  "dawid", "dominik", "dorian", "edward", "emil", "ernest",
  "eryk", "fabian", "filip", "franciszek", "fryderyk",
  "gabriel", "grzegorz", "gustaw", "henryk", "hubert", "igor",
  "ireneusz", "jacek", "jakub", "jan", "janusz", "jarosław",
  "jerzy", "joachim", "julian", "juliusz", "kacper", "kajetan",
  "kamil", "karol", "kazimierz", "konrad", "kornel", "krystian",
  "krzysztof", "leon", "leszek", "łukasz", "maciej", "maksymilian",
  "marcel", "marcin", "marek", "mariusz", "mateusz", "maurycy",
  "michał", "mieczysław", "mikołaj", "miłosz", "nikodem", "norbert",
  "olaf", "oliwier", "oskar", "patryk", "paweł", "piotr",
  "przemysław", "radosław", "rafał", "robert", "roman", "ryszard",
  "sebastian", "sławomir", "stanisław", "stefan", "szymon",
  "tadeusz", "tomasz", "tymon", "tymoteusz", "wacław", "wiktor",
  "witold", "władysław", "wojciech", "zbigniew", "zdzisław",
]);

const KNOWN_FEMALE = new Set([
  "ada", "adrianna", "agata", "agnieszka", "aleksandra", "alicja",
  "amelia", "anastazja", "ania", "anna", "antonina", "aurelia",
  "barbara", "beata", "bianka", "blanka", "bogusława", "celina",
  "dagmara", "daria", "dominika", "dorota", "edyta", "eliza",
  "elżbieta", "emilia", "ewa", "ewelina", "gabriela", "grażyna",
  "halina", "hanna", "helena", "iga", "ilona", "irena",
  "iza", "izabela", "jadwiga", "jana", "janina", "joanna",
  "jolanta", "julia", "julita", "justyna", "kalina", "kamila",
  "karina", "karolina", "katarzyna", "kinga", "klara", "klaudia",
  "kornelia", "krystyna", "lena", "liliana", "lucyna", "ludmiła",
  "łucja", "magda", "magdalena", "maja", "małgorzata", "maria",
  "marianna", "marlena", "marta", "martyna", "matylda", "milena",
  "monika", "nadia", "natalia", "nina", "oliwia", "olga",
  "patrycja", "paula", "paulina", "renata", "róża", "sandra",
  "sara", "sonia", "stella", "sylwia", "teresa", "urszula",
  "wanda", "weronika", "wiktoria", "zofia", "zuzanna",
]);

export default function detectGender(name) {
  if (!name || typeof name !== "string") return "unknown";

  const clean = name.trim().toLowerCase().replace(/\s+/g, " ");
  // Weź pierwsze imię (jeśli ktoś wpisze pełne)
  const first = clean.split(" ")[0];

  if (!first || first.length < 2) return "unknown";

  // 1. Sprawdź znane listy
  if (KNOWN_MALE.has(first)) return "boy";
  if (KNOWN_FEMALE.has(first)) return "girl";

  // 2. Wyjątki
  if (MALE_ENDING_A.has(first)) return "boy";
  if (FEMALE_NOT_A.has(first)) return "girl";

  // 3. Heurystyka końcówki
  if (first.endsWith("a")) return "girl";
  if (first.endsWith("i")) return "girl"; // Noemi-style

  // 4. Domyślnie chłopiec (w polskim większość męskich nie kończy się na -a)
  return "boy";
}
