/*!
 * SPDX-FileCopyrightText: © 2026 Amitiel Angelisme <armitiel@gmail.com>
 * SPDX-License-Identifier: LicenseRef-EwolucJA-Proprietary
 *
 * EwolucJA — gra edukacyjna dla dzieci.
 * Produkt powstał w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”;
 * autorskie prawa majątkowe pozostają przy autorze. Licencja: LICENSE.
 */
/**
 * uploads.js — backend handler dla @vercel/blob client uploads.
 *
 * Flow:
 *  1. Frontend uzywa @vercel/blob/client `upload()` ktora najpierw POST-uje JSON na nasz handler.
 *  2. Handler zwraca podpisany token (przez handleUpload) z konfiguracja (max size, MIME).
 *  3. Frontend uploaduje plik bezposrednio do Vercel Blob storage (omija 4.5MB limit Vercel Function body).
 *  4. Po uploadzie callback (onUploadCompleted) - tu tylko log, brak DB pisania (URL trafia z proof submit).
 *
 * Wymaga ENV: BLOB_READ_WRITE_TOKEN (Vercel Dashboard -> Storage -> Blob -> Create).
 *
 * BEZPIECZNY TOR OBRAZU W7 (docs/tresci/06 §4.5) — stan po 18.09:
 *  - `@vercel/blob` 0.27.x zna WYŁĄCZNIE `access: "public"` (brak prywatnego
 *    magazynu i podpisanych adresów), więc zdjęcia dzieci przez Blob są
 *    publiczne z natury. Obrazy idą planem B: `POST /api/missions/:id/miniatura`
 *    (miniatura JPEG w bazie, odczyt podpisanym adresem — api/cycles.js).
 *  - Ten handler zostaje TYLKO dla dowodów dźwiękowych i wymaga:
 *      1) tożsamości dziecka (`X-Player-Id`, services/playerAuth.js),
 *      2) jawnego włączenia `BLOB_UPLOADS=1` w env (domyślnie 410 Gone),
 *      3) `access` wymuszonego po stronie serwera (klientowi nie wierzymy),
 *      4) MIME z listy — obrazy tu już NIE przechodzą.
 */

import { Router } from "express";
import { handleUpload } from "@vercel/blob/client";
import { requirePlayer } from "../services/playerAuth.js";

const BLOB_UPLOADS = process.env.BLOB_UPLOADS === "1";
// Jedyny tryb dostępu, jaki zna zainstalowana wersja @vercel/blob.
const WYMUSZONY_ACCESS = "public";

export function uploadRoutes() {
  const router = Router();

  /* Auth tylko dla `blob.generate-client-token` (woła przeglądarka dziecka).
     `blob.upload-completed` woła Vercel Blob bez naszych nagłówków — tam
     tożsamością jest podpis `x-vercel-signature`, sprawdzany w handleUpload. */
  const authGdyTokenu = (req, res, next) => {
    if (req.body?.type === "blob.upload-completed") return next();
    return requirePlayer()(req, res, next);
  };

  // Handler dla client uploads. Frontend kieruje tu @vercel/blob/client.upload({handleUploadUrl}).
  router.post("/handler", authGdyTokenu, async (req, res) => {
    try {
      if (!BLOB_UPLOADS) {
        return res.status(410).json({
          error: "Tor Vercel Blob jest wyłączony (magazyn tylko publiczny). Obrazy: POST /api/missions/:id/miniatura.",
          kod: "blob_wylaczony",
        });
      }
      if (!process.env.BLOB_READ_WRITE_TOKEN) {
        return res.status(500).json({
          error: "BLOB_READ_WRITE_TOKEN not set. Add it in Vercel Dashboard -> Storage -> Blob.",
        });
      }
      // Skladamy Web-standard Request do handleUpload (Express req nie jest natywnym Request).
      const proto = req.headers["x-forwarded-proto"] || "https";
      const host = req.headers["x-forwarded-host"] || req.headers.host;
      const webRequest = new Request(`${proto}://${host}${req.originalUrl}`, {
        method: "POST",
        headers: new Headers(req.headers),
        body: JSON.stringify(req.body),
      });

      const jsonResponse = await handleUpload({
        body: req.body,
        request: webRequest,
        onBeforeGenerateToken: async (pathname, clientPayload) => {
          // Ścieżka w magazynie przypięta do gracza — bez wskazywania cudzych katalogów.
          if (typeof pathname !== "string" || !pathname.startsWith(`dowody/${req.player.playerId}/`)) {
            throw new Error(`Ścieżka musi zaczynać się od dowody/${req.player.playerId}/`);
          }
          // Walidacja: TYLKO dźwięk (obrazy planem B), max 10MB, random suffix zeby uniknac kolizji.
          // `access`: SDK 0.27 nie zna innego trybu niż WYMUSZONY_ACCESS ("public");
          // pole klienta jest ignorowane po stronie tokenu — nie ma czego wymuszać
          // poza tym, że obrazy tędy nie idą wcale (lista MIME niżej).
          return {
            allowedContentTypes: [
              // Dowody dzwiekowe (melodia, rytm, nagrany odglos) — rdzen misji dzwiekowych.
              "audio/mpeg", "audio/mp4", "audio/aac", "audio/ogg", "audio/wav", "audio/webm", "audio/x-m4a",
            ],
            maximumSizeInBytes: 10 * 1024 * 1024,
            addRandomSuffix: true,
            // Do tokenu nie wpuszczamy dowolnego payloadu klienta — tylko id gracza.
            tokenPayload: JSON.stringify({ player_id: req.player.playerId }),
          };
        },
        onUploadCompleted: async ({ blob }) => {
          // Loguje, ale nie zapisuje do DB - URL leci osobno przez proof submit
          console.log("[upload completed]", blob.pathname, `(access: ${WYMUSZONY_ACCESS})`);
        },
      });
      res.json(jsonResponse);
    } catch (e) {
      console.error("[uploads handler]", e);
      res.status(400).json({ error: e.message });
    }
  });

  return router;
}
