/*!
 * SPDX-FileCopyrightText: © 2026 Amitiel Angelisme <armitiel@gmail.com>
 * SPDX-License-Identifier: LicenseRef-EwolucJA-Proprietary
 *
 * EwolucJA — gra edukacyjna dla dzieci.
 * Produkt powstał w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”;
 * autorskie prawa majątkowe pozostają przy autorze. Licencja: LICENSE.
 */
/**
 * teksty-mowione.mjs — spis WSZYSTKIEGO, co w grze idzie w głos.
 *
 * PO CO. Zanim wgramy głosy do projektu (zamiast ściągać je z ElevenLabs przy
 * każdym uruchomieniu), trzeba wiedzieć, czego to dotyczy: ile kwestii, czyim
 * głosem, jakim tonem — i które z nich w ogóle da się nagrać z góry, bo nie
 * powstają dopiero w trakcie gry.
 *
 * JAK. Skrypt NIE zgaduje po nazwach zmiennych. Lista źródeł niżej powstała
 * z prześledzenia każdego wywołania `ttsPlayer.speak` / `powiedzPostacia` /
 * `powiedzJakLisek` w `frontend/src` do miejsca, z którego bierze się tekst.
 * Pliki JS czytamy składnią (acorn), a nie wyrażeniami regularnymi: kwestie
 * Wizkora bywają sklejane z kilku kawałków przez `+` i tylko parser widzi
 * je jako jedno zdanie. Dane w JSON-ach czytamy wprost.
 *
 * WYNIK. Tabela na ekran + `tmp/teksty-mowione.json` z pełną listą kwestii
 * (źródło, głos, ton, treść, czy ma wstawkę). Ten plik jest wejściem dla
 * nagrywarki głosów.
 *
 * Uruchomienie:  node scripts/teksty-mowione.mjs
 */
import { createRequire } from "node:module";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const KORZEN = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const wymagaj = createRequire(resolve(KORZEN, "frontend/package.json"));
const acorn = wymagaj("acorn");

const czytaj = (p) => readFileSync(resolve(KORZEN, p), "utf8");
const czytajJson = (p) => JSON.parse(czytaj(p));

/** Głosy postaci — przepisane z `hub/PodsumowanieDnia.jsx` i `mowaPostaci.js`. */
const GLOSY = {
  narratorka: { glos: "gora_podsumowania", ton: "calm" },
  wizkor: { glos: "las_decyzji", ton: "mystery" },
  lisek: { glos: "lisek", ton: "zabawa" },
};

/**
 * ŹRÓDŁA MOWY. Każdy wpis to jedno miejsce, z którego tekst naprawdę trafia
 * do `ttsPlayer`. `glos` i `ton` przepisane z wywołania, bo to one decydują,
 * którym głosem i z jakimi ustawieniami powstanie nagranie.
 *
 *  pola     — nazwy pól obiektów w pliku JS, których wartość idzie w głos
 *  tablice  — nazwy stałych JS będących tablicą samych zdań
 *  wyciag   — dla JSON-a: co z danych jest wypowiadane (string albo {tekst,glos,ton})
 *  atrybut  — dla JSX-a: nazwa atrybutu komponentu z tekstem (czytane wzorcem,
 *             bo acorn nie zna JSX-a, a esbuild w repo jest w wersji dla Windows)
 */
const ZRODLA = [
  {
    id: "wizkor-okna",
    plik: "frontend/src/hub/kwestieWizkora.js",
    opis: "Wizkor w oknach postaci na mapie (PopupPostaci)",
    glos: "las_decyzji", ton: "mystery",
    pola: ["tekst"],
  },
  {
    id: "wizkor-zadania",
    plik: "frontend/src/hub/data/zadania-wizkora.v1.json",
    opis: "Wizkor czyta zadanie poza ekranem (ZadaniePanel: cel + jak)",
    glos: "las_decyzji", ton: "mystery",
    wyciag: (d) => (d.zadania || []).map((z) => ({ id: z.id, tekst: [z.cel, z.jak].filter(Boolean).join(" ") })),
  },
  {
    id: "medrzec-cialo",
    plik: "frontend/src/hub/data/porady-zdrowia.v1.json",
    opis: "Podpowiedź Mędrca o ciele (PodpowiedzMedrca)",
    glos: "las_decyzji", ton: "calm",
    wyciag: (d) => (d.porady || d).map((p) => ({ id: p.id, tekst: p.tekst })),
  },
  {
    id: "lisek-zachety",
    plik: "frontend/src/hub/glosLiska.js",
    opis: "Lisek zaprasza do wyboru karty dnia",
    glos: "lisek", ton: "zabawa",
    tablice: ["ZACHETY", "WEJSCIA"],
  },
  {
    id: "lisek-karty",
    plik: "frontend/src/hub/poradaDnia.js",
    opis: "Lisek zapowiada wybraną kartę dnia (KARTY_DNIA)",
    glos: "lisek", ton: "zabawa",
    pola: ["zapowiedz"],
  },
  {
    id: "lisek-porady",
    plik: "frontend/src/dailyTipsData.js",
    opis: "Lisek czyta poradę dnia (PoradaPanel → „przeczytaj”)",
    glos: "lisek", ton: "zabawa",
    // Ten jeden plik IMPORTUJEMY, zamiast czytać składnię: to czyste dane bez
    // zależności, a przy tekście chcemy mieć tytuł, dzień i odbiorcę — część
    // porad jest pisana DO RODZICA i nie mówi ich lisek dziecku.
    modul: (m) => (m.DAILY_TIPS || []).map((t) => ({
      id: t.id, tekst: t.body,
      meta: { tytul: t.title, dla: t.audience, profil: t.profileName, dzien: t.day, pora: t.slot },
    })),
  },
  {
    id: "koniec-dnia",
    plik: "frontend/src/hub/data/koniec-dnia.v1.json",
    opis: "Sekwencja końca dnia — narratorka, Wizkor i lisek po kolei",
    glos: "(trzy głosy)", ton: "wg postaci",
    wyciag: (d) => {
      const o = [];
      (d.kroki || []).forEach((k) => {
        const g = GLOSY[k.kto] || GLOSY.narratorka;
        // W głos idzie POLE `glos`, nie `tekst`: na ekranie stoi wersja łamana
        // na wersy, a mówiona jest płynna (`K.glos || K.tekst` w komponencie).
        // Wyjątek: „stan rzeczy" komponent skleja z tego, co dziecko naprawdę
        // dziś postawiło na planecie — tej kwestii nie da się nagrać z góry.
        const tekst = k.glos || k.tekst;
        if (tekst) o.push({ id: k.id, tekst, ...g, wstawka: k.id === "stan-rzeczy" });
      });
      // Zdania dnia pustego wchodzą do „stanu rzeczy" jako gotowe kawałki.
      (d.dzienPusty?.linie || []).forEach((t, i) => o.push({ id: `dzienPusty.linie[${i}]`, tekst: t, ...GLOSY.narratorka }));
      if (d.dzienPusty?.domkniecie) o.push({ id: "dzienPusty.domkniecie", tekst: d.dzienPusty.domkniecie, ...GLOSY.narratorka });
      return o;
    },
  },
  {
    id: "misje-gier",
    plik: "frontend/src/hub/misjeGier.js",
    opis: "Wizkor o misji w minigrze: zaproszenie, „w trakcie\", wypłata",
    glos: "las_decyzji", ton: "mystery",
    pola: ["tekst"],
  },
  {
    id: "onboarding",
    plik: "frontend/src/pages/Onboarding.jsx",
    opis: "Narratorka w onboardingu (NarratorVoice)",
    glos: "dolina_selfie", ton: "warm",
    atrybut: "text",
  },
];

/** Miejsca, w których tekst POWSTAJE W TRAKCIE gry — nagrać z góry się nie da. */
const ZYWE = [
  ["frontend/src/hub/panels/CzatPanel.jsx", "odpowiedzi modelu w czacie"],
  ["frontend/src/pages/MissionView.jsx", "narracja misji składana z danych przygody"],
  ["frontend/src/pages/GMPanel.jsx", "dowód wpisany przez dziecko, czytany Mentorowi"],
  ["frontend/src/components/TopBar.jsx", "bieżący komunikat paska górnego"],
  ["frontend/src/hub/Reflektor.jsx", "wskazówki chmurki — tekst podaje ekran, który ją otwiera"],
];

// ── czytanie składni ────────────────────────────────────────────────

function chodz(w, fn) {
  if (!w || typeof w !== "object") return;
  if (Array.isArray(w)) { w.forEach((x) => chodz(x, fn)); return; }
  if (typeof w.type === "string") fn(w);
  for (const k of Object.keys(w)) {
    if (k === "type" || k === "start" || k === "end" || k === "loc" || k === "range") continue;
    chodz(w[k], fn);
  }
}

/**
 * Wyrażenie → zdanie. Kwestie bywają sklejane (`"a" + "b"`) albo mają wstawkę
 * (`${real.def.tytul}`); wstawkę zaznaczamy jako ⟨…⟩ i takie zdanie idzie do
 * kolumny „wstawka" — nagrać je z góry można dopiero po rozbiciu na część
 * stałą i doczytywaną resztę.
 */
function zdanie(n) {
  if (!n) return null;
  if (n.type === "Literal") return typeof n.value === "string" ? { t: n.value, wstawka: false } : null;
  if (n.type === "TemplateLiteral") {
    let t = "";
    n.quasis.forEach((q, i) => { t += q.value.cooked; if (i < n.expressions.length) t += "⟨…⟩"; });
    return { t, wstawka: n.expressions.length > 0 };
  }
  if (n.type === "BinaryExpression" && n.operator === "+") {
    const a = zdanie(n.left); const b = zdanie(n.right);
    if (!a || !b) return null;
    return { t: a.t + b.t, wstawka: a.wstawka || b.wstawka };
  }
  return null;
}

/** Czy to w ogóle zdanie do powiedzenia, a nie klasa CSS albo ścieżka pliku. */
const MOWA = (t) => t && t.trim().length >= 8 && /\s/.test(t) && /[.!?…]/.test(t);

/** Krótki podgląd wyrażenia, żeby w spisie było widać, o którą kwestię chodzi. */
function zrodloWezla(n) {
  return String(n.__zrodlo || "").slice(n.start, n.start + 60).replace(/\s+/g, " ").trim();
}

function zJs(z) {
  const tekstPliku = czytaj(z.plik);
  const drzewo = acorn.parse(tekstPliku, { ecmaVersion: 2023, sourceType: "module" });
  chodz(drzewo, (n) => { n.__zrodlo = tekstPliku; });
  const out = [];
  // Wartość, której parser nie składa w zdanie (zmienna, `split().join()`),
  // jest budowana w kodzie — liczy się jako kwestia ze wstawką, bo INACZEJ
  // zniknęłaby ze spisu i nikt by nie zauważył, że nie ma jej w nagraniach.
  // Numer linii to namiar na kwestię przy nanoszeniu poprawek — tam, gdzie
  // dane nie mają własnego `id` (kwestie Wizkora stoją wprost w kodzie).
  const linia = (n) => tekstPliku.slice(0, n.start).split("\n").length;
  const dodaj = (w, wezel, id) => {
    const poz = wezel ? { linia: linia(wezel), id: id || null } : {};
    if (w && MOWA(w.t)) { out.push({ tekst: w.t.trim(), wstawka: w.wstawka, ...poz }); return; }
    if (!w && wezel) out.push({ tekst: `⟨budowane w kodzie: ${zrodloWezla(wezel)}⟩`, wstawka: true, ...poz });
  };

  chodz(drzewo, (n) => {
    // Idziemy po OBIEKTACH, nie po pojedynczych właściwościach: dzięki temu
    // przy tekście stoi `id` z tego samego obiektu (porady dnia mają swoje).
    if (z.pola && n.type === "ObjectExpression") {
      const wl = (nazwa) => n.properties.find((p) => p.type === "Property" && !p.computed
        && (p.key.name ?? p.key.value) === nazwa);
      const idProp = wl("id");
      const id = idProp && idProp.value.type === "Literal" ? String(idProp.value.value) : null;
      for (const nazwa of z.pola) {
        const w = wl(nazwa);
        if (!w) continue;
        if (w.value.type === "ArrayExpression") w.value.elements.forEach((e) => dodaj(zdanie(e), e, id));
        else dodaj(zdanie(w.value), w.value, id);
      }
    }
    if (z.tablice && n.type === "VariableDeclarator" && z.tablice.includes(n.id?.name)
        && n.init?.type === "ArrayExpression") {
      n.init.elements.forEach((e, i) => dodaj(zdanie(e), e, `${n.id.name}[${i}]`));
    }
  });
  return out;
}

/**
 * JSX czytamy wzorcem, nie parserem: `acorn` nie zna składni komponentów,
 * a `esbuild` leży w repo w wersji dla Windows i w innym systemie nie ruszy.
 * Wzorzec bierze `text="…"` oraz `text={`…`}` — a backtick prawie zawsze
 * znaczy wstawkę, więc taka kwestia i tak trafi do kolumny „wstawka".
 */
function zJsx(z) {
  const zrodlo = czytaj(z.plik);
  const out = [];
  const wzor = new RegExp(`${z.atrybut}=(?:"([^"]*)"|\\{\`([^\`]*)\`\\})`, "g");
  for (const m of zrodlo.matchAll(wzor)) {
    const surowy = m[1] ?? m[2] ?? "";
    const tekst = surowy.replace(/\$\{[^}]*\}/g, "⟨…⟩").replace(/\s+/g, " ").trim();
    if (MOWA(tekst)) out.push({ tekst, wstawka: tekst.includes("⟨…⟩"), linia: zrodlo.slice(0, m.index).split("\n").length });
  }
  return out;
}

async function zModul(z) {
  const m = await import(new URL(`../${z.plik}`, import.meta.url).href);
  return z.modul(m)
    .filter((w) => w?.tekst)
    .map((w) => ({ ...w, tekst: String(w.tekst).replace(/\s+/g, " ").trim(), wstawka: false }))
    .filter((w) => MOWA(w.tekst));
}

function zJson(z) {
  return z.wyciag(czytajJson(z.plik))
    .map((w) => (typeof w === "string" ? { tekst: w } : w))
    .filter((w) => w?.tekst)
    .map((w) => ({ ...w, tekst: String(w.tekst).replace(/\s+/g, " ").trim(), wstawka: !!w.wstawka }))
    .filter((w) => MOWA(w.tekst));
}

// ── raport ──────────────────────────────────────────────────────────

const RODZAJ = /\{[^{}|]+\|[^{}|]+\}/;   // „{zauważyłeś|zauważyłaś}" — dwa nagrania
const TOKEN = /\{[a-ząćęłńóśźż_]+\}/i;    // „{nagroda}" — liczba wstawiana w kodzie
const manifest = [];
const wiersze = [];

for (const z of ZRODLA) {
  const kwestie = (z.modul ? await zModul(z) : z.wyciag ? zJson(z) : z.atrybut ? zJsx(z) : zJs(z))
    // ta sama kwestia potrafi stać w dwóch gałęziach `if`-a
    .filter((w, i, a) => a.findIndex((b) => b.tekst === w.tekst) === i);

  let znaki = 0, wstawki = 0, rodzaje = 0;
  for (const k of kwestie) {
    const rodzaj = RODZAJ.test(k.tekst);
    if (TOKEN.test(k.tekst) && !rodzaj) k.wstawka = true;
    znaki += k.tekst.length;
    if (k.wstawka) wstawki += 1;
    if (rodzaj) rodzaje += 1;
    manifest.push({
      zrodlo: z.id, opis: z.opis, plik: z.plik,
      id: k.id || null, linia: k.linia || null, meta: k.meta || null,
      glos: k.glos || z.glos, ton: k.ton || z.ton,
      tekst: k.tekst, wstawka: k.wstawka, rodzaj,
    });
  }
  // Ile NAGRAŃ: zdanie w formie męskiej i żeńskiej to dwa pliki; zdanie ze
  // wstawką nie nadaje się do nagrania w tej postaci.
  const nagran = kwestie.length - wstawki + rodzaje;
  wiersze.push({ id: z.id, opis: z.opis, glos: z.glos, ton: z.ton, kwestii: kwestie.length, wstawki, rodzaje, znaki, nagran });
}

const kol = (s, n) => String(s).padEnd(n).slice(0, n);
const licz = (s, n) => String(s).padStart(n);

console.log("\nCO W GRZE IDZIE W GŁOS\n");
console.log(kol("źródło", 16), kol("głos", 18), kol("ton", 12), licz("kwestii", 8), licz("wstawka", 8), licz("rodzaj", 7), licz("znaków", 8), licz("nagrań", 7));
console.log("-".repeat(96));
let sumaK = 0, sumaZ = 0, sumaN = 0, sumaW = 0, sumaR = 0;
for (const w of wiersze) {
  console.log(kol(w.id, 16), kol(w.glos, 18), kol(w.ton, 12), licz(w.kwestii, 8), licz(w.wstawki, 8), licz(w.rodzaje, 7), licz(w.znaki, 8), licz(w.nagran, 7));
  sumaK += w.kwestii; sumaZ += w.znaki; sumaN += w.nagran; sumaW += w.wstawki; sumaR += w.rodzaje;
}
console.log("-".repeat(96));
console.log(kol("RAZEM", 48), licz(sumaK, 8), licz(sumaW, 8), licz(sumaR, 7), licz(sumaZ, 8), licz(sumaN, 7));

console.log("\nGŁOSY (ile nagrań czyim głosem)");
const poGlosie = {};
for (const m of manifest) {
  if (m.wstawka) continue;
  poGlosie[m.glos] = (poGlosie[m.glos] || 0) + (m.rodzaj ? 2 : 1);
}
for (const [g, n] of Object.entries(poGlosie).sort((a, b) => b[1] - a[1])) console.log(" ", kol(g, 20), licz(n, 5));

console.log("\nŻYWE — tekst powstaje w trakcie gry, nagrać z góry się nie da:");
for (const [p, co] of ZYWE) console.log("  •", kol(co, 50), p);

console.log("\nOPIS ŹRÓDEŁ");
for (const w of wiersze) console.log("  •", kol(w.id, 16), w.opis);

mkdirSync(resolve(KORZEN, "tmp"), { recursive: true });
writeFileSync(resolve(KORZEN, "tmp/teksty-mowione.json"),
  JSON.stringify({ data: new Date().toISOString().slice(0, 10), kwestie: manifest }, null, 1), "utf8");
console.log(`\nManifest: tmp/teksty-mowione.json (${manifest.length} kwestii)\n`);
