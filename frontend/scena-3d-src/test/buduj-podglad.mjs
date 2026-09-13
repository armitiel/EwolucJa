import { build } from "esbuild";
import path from "node:path";
import { fileURLToPath } from "node:url";
const tu = path.dirname(fileURLToPath(import.meta.url));
const frontend = path.resolve(tu, "..", "..");
await build({
  entryPoints: [path.join(tu, "podglad-pnacza.js")],
  outfile: path.join(tu, "podglad-pnacza.bundle.js"),
  bundle: true, format: "esm", target: ["es2020"], minify: false, logLevel: "info",
  absWorkingDir: frontend, nodePaths: [path.join(frontend, "node_modules")],
});
