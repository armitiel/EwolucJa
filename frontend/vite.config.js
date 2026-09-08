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

/**
 * modeleMapy — własne modele 3D dla edytora mapy.
 *
 * `GET  /__modele`        → lista modeli, które scena umie postawić
 * `POST /__model?nazwa=x` → wgranie pliku `.glb` do `public/scena-3d/assets/`
 *
 * PO CO. Edytor stawiał wyłącznie modele z listy wpisanej na sztywno w kodzie,
 * więc dołożenie własnego domku znaczyło: skopiuj plik do `assets/`, otwórz
 * `edytor.html`, dopisz nazwę do tablicy `MODELE`. Teraz plik idzie prosto
 * z okna wyboru, a lista czyta się z dysku — mapę da się budować bez wracania
 * do kodu.
 *
 * CZEGO PILNUJE. Nazwa jest sprowadzana do bezpiecznego sluga (bez ścieżek,
 * bez kropek, bez znaków spoza `a-z0-9-`), plik musi zaczynać się magicznym
 * `glTF` (czyli być prawdziwym binarnym GLB) i mieścić się w 25 MB. Wtyczka
 * żyje TYLKO w serwerze deweloperskim (`apply: "serve"`), więc na produkcji
 * nie ma żadnej z tych końcówek — nikt nie wgra pliku na Vercela przez HTTP.
 *
 * Modele „generatorowe" (drzewo, głaz, kwiat) nie są plikami — buduje je kod
 * sceny — więc dopisujemy je do listy osobno, żeby edytor widział jeden zbiór.
 */
const MODELE_GENERATORA = ["drzewo", "drzewo-lisciaste"];

function modeleMapy() {
  const katalog = (serwer) => path.resolve(serwer.config.root, "public/scena-3d/assets");
  const slug = (s) =>
    String(s || "")
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/\.(glb|gltf)$/i, "")
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48);

  return {
    name: "ewolucja-modele-mapy",
    apply: "serve",
    configureServer(serwer) {
      serwer.middlewares.use("/__modele", (req, res, next) => {
        if (req.method !== "GET") return next();
        let pliki = [];
        try {
          pliki = fs.readdirSync(katalog(serwer))
            .filter((f) => f.toLowerCase().endsWith(".glb"))
            .map((f) => f.replace(/\.glb$/i, ""));
        } catch { /* brak katalogu = pusta lista, edytor ma swoje wbudowane */ }
        const modele = [...new Set([...pliki, ...MODELE_GENERATORA])].sort();
        res.setHeader("content-type", "application/json");
        res.end(JSON.stringify({ ok: true, modele }));
      });

      serwer.middlewares.use("/__model", (req, res, next) => {
        if (req.method !== "POST") return next();
        const odpowiedz = (kod, dane) => {
          res.statusCode = kod;
          res.setHeader("content-type", "application/json");
          res.end(JSON.stringify(dane));
        };
        const nazwa = slug(new URL(req.url, "http://x").searchParams.get("nazwa"));
        if (!nazwa) return odpowiedz(400, { ok: false, blad: "pusta nazwa modelu" });

        const kawalki = [];
        let ile = 0;
        req.on("data", (k) => {
          ile += k.length;
          if (ile > 25_000_000) { req.destroy(); return; }
          kawalki.push(k);
        });
        req.on("end", () => {
          try {
            const dane = Buffer.concat(kawalki);
            if (dane.length < 20 || dane.subarray(0, 4).toString("ascii") !== "glTF") {
              throw new Error("to nie jest binarny .glb (brak nagłówka glTF)");
            }
            fs.mkdirSync(katalog(serwer), { recursive: true });
            fs.writeFileSync(path.join(katalog(serwer), `${nazwa}.glb`), dane);
            serwer.config.logger.info(`[modele] ${nazwa}.glb (${dane.length} B)`);
            odpowiedz(200, { ok: true, nazwa });
          } catch (e) {
            odpowiedz(400, { ok: false, blad: String(e.message || e) });
          }
        });
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), zapisMapy(), modeleMapy()],
  define: {
    // Wersja wydania dla Sentry — po niej widać, który commit wywalił scenę.
    // Na Vercelu zmienna jest ustawiana automatycznie przy każdym buildzie;
    // lokalnie zostaje "dev". JSON.stringify jest konieczny: `define` wkleja
    // wartość dosłownie w kod, więc goły skrót byłby nazwą zmiennej.
    __EWOLUCJA_RELEASE__: JSON.stringify(
      (process.env.VERCEL_GIT_COMMIT_SHA || "").slice(0, 7) || "dev"
    ),
    // Środowisko wydania. `import.meta.env.PROD` jest prawdziwe także dla
    // buildów podglądowych, więc bez tego błędy z preview trafiałyby do
    // Sentry oznaczone jako produkcja.
    __EWOLUCJA_ENV__: JSON.stringify(process.env.VERCEL_ENV || "development"),
  },
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
