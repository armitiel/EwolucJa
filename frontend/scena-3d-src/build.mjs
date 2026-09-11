/**
 * build.mjs — buduje moduł sceny 3D do `public/scena-3d/`.
 *
 *   cd frontend && node scena-3d-src/build.mjs          # produkcja (minifikacja)
 *   cd frontend && node scena-3d-src/build.mjs --dev    # bez minifikacji, z mapą źródeł
 *   cd frontend && node scena-3d-src/build.mjs --watch  # przebudowa przy zmianie
 *
 * Wyjścia:
 *   public/scena-3d/scena3d.esm.js — ES module (React: `components/Scena3D.jsx`)
 *   public/scena-3d/scena3d.js     — ten sam moduł z autostartem (`index.html`)
 *
 * three.js wchodzi do bundla z `node_modules` frontendu — moduł dalej NIE
 * jest zależnością buildu Vite (leży w public/), więc po każdej przebudowie
 * podbij `WERSJA_SCENY` w `src/components/Scena3D.jsx`.
 */
import { build, context } from "esbuild";
import { fileURLToPath } from "node:url";
import path from "node:path";

const tu = path.dirname(fileURLToPath(import.meta.url));
const frontend = path.resolve(tu, "..");
const wyjscie = path.join(frontend, "public", "scena-3d");
const dev = process.argv.includes("--dev");
const watch = process.argv.includes("--watch");

const wspolne = {
  bundle: true,
  format: "esm",
  target: ["es2020"],
  minify: !dev,
  sourcemap: dev ? "inline" : false,
  legalComments: "none",
  logLevel: "info",
  absWorkingDir: frontend,
  nodePaths: [path.join(frontend, "node_modules")],
  banner: { js: "/* EwolucJA — scena 3D (planeta). Źródła: frontend/scena-3d-src/. NIE EDYTOWAĆ RĘCZNIE. */" },
};

const cele = [
  { entryPoints: [path.join(tu, "src", "index.js")], outfile: path.join(wyjscie, "scena3d.esm.js") },
  { entryPoints: [path.join(tu, "src", "autostart.js")], outfile: path.join(wyjscie, "scena3d.js") },
];

if (watch) {
  for (const c of cele) {
    const ctx = await context({ ...wspolne, ...c });
    await ctx.watch();
  }
  console.log("Czuwam nad zmianami w scena-3d-src/src …");
} else {
  for (const c of cele) await build({ ...wspolne, ...c });
}
