#!/usr/bin/env node
/**
 * straznik-sceny — dwie bariery wokół bundla sceny 3D.
 *
 * PreToolUse  : blokuje bezpośrednią edycję `public/scena-3d/scena3d*.js`.
 *               To wynik builda ze źródeł `frontend/scena-3d-src/` —
 *               zmiany robi się tam i przebudowuje (`build.mjs`).
 * PostToolUse : po zmianie czegokolwiek w `public/scena-3d/` przypomina
 *               o podbiciu WERSJA_SCENY — pliki w `public/` nie mają hasha
 *               w nazwie, więc bez tego przeglądarka serwuje scenę z cache.
 *
 * Kontrakt hooka: JSON na stdin, kod wyjścia 2 = komunikat ze stderr wraca
 * do Claude'a. Każdy inny błąd ma kończyć się cicho zerem — strażnik nie
 * może zablokować pracy, gdy sam się wywróci.
 */

let wejscie = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (c) => (wejscie += c));
process.stdin.on("end", () => {
  try {
    sprawdz(JSON.parse(wejscie || "{}"));
  } catch {
    process.exit(0);
  }
});

const NARZEDZIA = [
  "cd frontend && node scena-3d-src/build.mjs",
];

function sciezki(dane) {
  const we = dane.tool_input || {};
  const zbior = [we.file_path, we.path, we.notebook_path, we.command];
  return zbior
    .filter((x) => typeof x === "string" && x)
    .map((x) => x.replace(/\\/g, "/").toLowerCase());
}

function sprawdz(dane) {
  const zdarzenie = dane.hook_event_name || "";
  const narzedzie = dane.tool_name || "";
  const cele = sciezki(dane);
  const dotykaBundla = cele.some((p) => p.includes("public/scena-3d/scena3d"));
  const dotykaSceny = cele.some((p) => p.includes("public/scena-3d/"));

  if (zdarzenie === "PreToolUse" && dotykaBundla && /^(Edit|Write|NotebookEdit)$/.test(narzedzie)) {
    console.error(
      [
        "ZABLOKOWANE: scena3d.js / scena3d.esm.js to WYNIK BUILDU, nie kod zrodlowy.",
        "",
        "Zrodla sceny leza w frontend/scena-3d-src/src/ - zmien je tam,",
        "a potem przebuduj bundle:",
        "  " + NARZEDZIA[0],
        "",
        "Przeczytaj frontend/scena-3d-src/README.md (rzut na kule, kontrakt z Reactem).",
        "",
        "Po zmianie podbij WERSJA_SCENY w frontend/src/components/Scena3D.jsx.",
      ].join("\n")
    );
    process.exit(2);
  }

  if (zdarzenie === "PostToolUse" && dotykaSceny) {
    console.error(
      [
        "PRZYPOMNIENIE: zmiana w public/scena-3d/.",
        "Podbij WERSJA_SCENY w frontend/src/components/Scena3D.jsx (numer tylko rosnie).",
        "Pliki w public/ nie maja hasha w nazwie - bez tego przegladarka poda scene z cache.",
        "Jesli ruszales hud.css, podbij tez ?v=N w frontend/index.html.",
      ].join("\n")
    );
    process.exit(2);
  }

  process.exit(0);
}
