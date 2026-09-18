/*!
 * SPDX-FileCopyrightText: © 2026 Amitiel Angelisme <armitiel@gmail.com>
 * SPDX-License-Identifier: LicenseRef-EwolucJA-Proprietary
 *
 * EwolucJA — gra edukacyjna dla dzieci.
 * Produkt powstał w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”;
 * autorskie prawa majątkowe pozostają przy autorze. Licencja: LICENSE.
 */
/**
 * /api/admin — zadania porządkowe.
 *
 *   POST|GET /api/admin/retencja  - kasuje miniatury misji po `obraz_do`
 *                                   (30 dni; docs/tresci/06 §4.5 pkt 2).
 *
 * Ochrona jak jedyny istniejący „admin" w repo — cron w api/push.js:
 * `Authorization: Bearer <CRON_SECRET>`. Dodatkowo wpuszczamy zalogowanego
 * Mentora (panel może mieć przycisk). GET jest po to, żeby Vercel Cron
 * (vercel.json → "crons": [{ "path": "/api/admin/retencja", "schedule": "30 3 * * *" }])
 * mógł to wołać — cron wysyła GET z nagłówkiem Bearer CRON_SECRET.
 * Niezależnie od crona czyszczenie odpala się leniwie przy ruchu na torze
 * obrazu (services/obrazy.js `czyscPrzyOkazji`).
 */
import { Router } from "express";
import { verifySession } from "../services/authService.js";
import { usunStareObrazy, RETENCJA_DNI } from "../services/obrazy.js";

const CRON_SECRET = (process.env.CRON_SECRET || "").trim();

async function requireAdmin(req, res, next) {
  const bearer = req.headers.authorization?.replace(/^Bearer\s+/i, "") || "";
  if (CRON_SECRET && bearer === CRON_SECRET) return next();
  const token = req.cookies?.mentor_token || bearer;
  const s = token ? await verifySession(token) : null;
  if (!s) return res.status(401).json({ error: "unauthorized" });
  req.mentor = s;
  next();
}

export function adminRoutes() {
  const r = Router();

  const retencja = async (req, res) => {
    try {
      const usunieto = await usunStareObrazy();
      res.json({ ok: true, usunieto, retencja_dni: RETENCJA_DNI, kiedy: new Date().toISOString() });
    } catch (e) {
      console.error("[admin retencja]", e);
      res.status(500).json({ error: e.message });
    }
  };
  r.post("/retencja", requireAdmin, retencja);
  r.get("/retencja", requireAdmin, retencja);

  return r;
}
