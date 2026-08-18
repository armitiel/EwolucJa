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
 */

import { Router } from "express";
import { handleUpload } from "@vercel/blob/client";

export function uploadRoutes() {
  const router = Router();

  // Handler dla client uploads. Frontend kieruje tu @vercel/blob/client.upload({handleUploadUrl}).
  router.post("/handler", async (req, res) => {
    try {
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
          // Walidacja: zdjecia tylko, max 10MB, random suffix zeby uniknac kolizji
          return {
            allowedContentTypes: [
              "image/jpeg", "image/png", "image/webp", "image/heic", "image/heif",
              // Dowody dzwiekowe (melodia, rytm, nagrany odglos) — rdzen misji w Dolinie Dzwiekow.
              "audio/mpeg", "audio/mp4", "audio/aac", "audio/ogg", "audio/wav", "audio/webm", "audio/x-m4a",
            ],
            maximumSizeInBytes: 10 * 1024 * 1024,
            addRandomSuffix: true,
            tokenPayload: clientPayload || null,
          };
        },
        onUploadCompleted: async ({ blob }) => {
          // Loguje, ale nie zapisuje do DB - URL leci osobno przez proof submit
          console.log("[upload completed]", blob.pathname, "->", blob.url);
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
