/*!
 * SPDX-FileCopyrightText: © 2026 Amitiel Angelisme <armitiel@gmail.com>
 * SPDX-License-Identifier: LicenseRef-EwolucJA-Proprietary
 *
 * EwolucJA — gra edukacyjna dla dzieci.
 * Produkt powstał w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”;
 * autorskie prawa majątkowe pozostają przy autorze. Licencja: LICENSE.
 */
/** Buduje edytor etapów fasoli prosto do `public/scena-3d/`, obok mapy i sceny. */
import { build } from "esbuild";
import path from "node:path";
import { fileURLToPath } from "node:url";
const tu = path.dirname(fileURLToPath(import.meta.url));
const frontend = path.resolve(tu, "..", "..");
await build({
  entryPoints: [path.join(tu, "edytor-fasoli.js")],
  outfile: path.join(frontend, "public", "scena-3d", "edytor-fasoli.bundle.js"),
  bundle: true, format: "esm", target: ["es2020"], minify: false, logLevel: "info",
  absWorkingDir: frontend, nodePaths: [path.join(frontend, "node_modules")],
});
