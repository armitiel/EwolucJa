import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";

/**
 * zapisMapy — końcówka `POST /__mapa` dla edytora mapy 3D (`/scena-3d/edytor.html`).
 *
 * Edytor jest zwykłą stroną w `public/`, więc sam z siebie nie umie nic zapisać
 * na dysk — przeglądarka na to nie pozwala. Bez tego jedynym wyjściem było
 * „Pobierz mapa.json" i ręczne podmienianie pliku, co przy dziesiątej poprawce
 * przestaje być zabawne.
 *
 * Wtyczka żyje TYLKO w serwerze deweloperskim (`configureServer`), więc nie
 * wchodzi do produkcyjnego builda i na Vercelu nie istnieje. Zapisuje wyłącznie
 * jeden konkretny plik i tylko wtedy, gdy treść parsuje się jako JSON i ma
 * kształt mapy — nie chcę końcówki, która przyjmie cokolwiek.
 */
function zapisMapy() {
  return {
    name: "ewolucja-zapis-mapy",
    apply: "serve",
    configureServer(serwer) {
      serwer.middlewares.use("/__mapa", (req, res, next) => {
        if (req.method !== "POST") return next();
        let cialo = "";
        req.on("data", (k) => {
          cialo += k;
          if (cialo.length > 2_000_000) req.destroy();   // mapa to kilkadziesiąt kB
        });
        req.on("end", () => {
          try {
            const mapa = JSON.parse(cialo);
            if (!mapa || typeof mapa !== "object" || !Array.isArray(mapa.sciezka)) {
              throw new Error("to nie wygląda na mapę (brak tablicy `sciezka`)");
            }
            const plik = path.resolve(serwer.config.root, "public/scena-3d/mapa.json");
            fs.writeFileSync(plik, JSON.stringify(mapa, null, 2), "utf8");
            res.setHeader("content-type", "application/json");
            res.end(JSON.stringify({ ok: true, plik: "public/scena-3d/mapa.json" }));
            serwer.config.logger.info(`[mapa] zapisana (${cialo.length} B)`);
          } catch (e) {
            res.statusCode = 400;
            res.setHeader("content-type", "application/json");
            res.end(JSON.stringify({ ok: false, blad: String(e.message || e) }));
          }
        });
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), zapisMapy()],
  server: {
    port: 3000,
    proxy: {
      // 127.0.0.1, NIE localhost. Node 18+ rozwiazuje `localhost` na ::1, a backend
      // (Express) slucha tylko na IPv4 — proxy leci wiec w pustke i kazde
      // wywolanie /api konczy sie `ECONNREFUSED ::1:3001`. Objaw w grze: HUD
      // pokazuje „Wedrowiec" i 0 monet, choc oba serwery dzialaja.
      "/api": "http://127.0.0.1:3001",
    },
  },
});
