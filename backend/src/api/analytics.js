/*!
 * SPDX-FileCopyrightText: © 2026 Amitiel Angelisme <armitiel@gmail.com>
 * SPDX-License-Identifier: LicenseRef-EwolucJA-Proprietary
 *
 * EwolucJA — gra edukacyjna dla dzieci.
 * Produkt powstał w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”;
 * autorskie prawa majątkowe pozostają przy autorze. Licencja: LICENSE.
 */
/**
 * /api/analytics — zdarzenia pętli (docs/tresci/06 §4.12) i liczniki miar
 * sukcesu z docs/OPIS_PROJEKTU.md.
 *
 *   POST /api/analytics/zdarzenia   - klient wysyła jedno zdarzenie albo paczkę
 *                                     { zdarzenia: [...] } (≤ 50). Bez PII.
 *   GET  /api/analytics/petla?od=&do=[&gracz=<player_id>]
 *                                   - liczniki per zdarzenie + miary; Mentor
 *                                     (cookie/JWT) albo autor (Bearer CRON_SECRET).
 *
 * Dotychczas zdarzenia (np. `porada_dnia_pokazana`) szły wyłącznie z klienta
 * do Vercel Web Analytics (frontend/src/services/analityka.jsx) — tam nie da
 * się policzyć „ilu wróciło po śladzie". Ten moduł jest źródłem dla panelu.
 */
import { Router } from "express";
import { initDatabase } from "../database/db.js";
import { resolvePlayerId } from "../services/playerAuth.js";
import { verifySession } from "../services/authService.js";
import { zapiszPaczke, NAZWY_ZDARZEN, ZDARZENIA_SERWERA, skrotGracza } from "../services/zdarzenia.js";

const CRON_SECRET = (process.env.CRON_SECRET || "").trim();
const MAX_PACZKA = 50;

/* Mentor albo autor (Bearer CRON_SECRET, jak w api/push.js). */
async function requireMentorLubAutor(req, res, next) {
  const bearer = req.headers.authorization?.replace(/^Bearer\s+/i, "") || "";
  if (CRON_SECRET && bearer === CRON_SECRET) { req.autor = true; return next(); }
  const token = req.cookies?.mentor_token || bearer;
  const s = token ? await verifySession(token) : null;
  if (!s) return res.status(401).json({ error: "Wymagane zalogowanie mentora" });
  req.mentor = s;
  next();
}

function dataAlbo(v, domyslna) {
  if (typeof v === "string" && v) {
    const t = Date.parse(v.length === 10 ? `${v}T00:00:00Z` : v);
    if (Number.isFinite(t)) return new Date(t);
  }
  return domyslna;
}

export function analyticsRoutes() {
  const r = Router();

  r.get("/nazwy", (req, res) => {
    res.json({ nazwy: NAZWY_ZDARZEN, serwer: ZDARZENIA_SERWERA });
  });

  /* Zapis z klienta. Gracz: nagłówek X-Player-Id (preferowany) albo pole
     `gracz` w zdarzeniu — i tak zapisujemy tylko skrót. Nie wymagamy, by gracz
     istniał (zdarzenia z ekranu przed rejestracją też się liczą). */
  r.post("/zdarzenia", async (req, res) => {
    try {
      const body = req.body;
      let lista;
      if (Array.isArray(body?.zdarzenia)) lista = body.zdarzenia;
      else if (body && typeof body === "object" && typeof body.nazwa === "string") lista = [body];
      else return res.status(400).json({ error: "Body: { nazwa, gracz?, kiedy?, dane?, wersja? } albo { zdarzenia: [...] }" });
      if (lista.length > MAX_PACZKA) return res.status(400).json({ error: `Za dużo zdarzeń naraz (max ${MAX_PACZKA})` });
      const domyslnyGracz = resolvePlayerId(req) || (typeof body.gracz === "string" ? body.gracz : null);
      const wynik = await zapiszPaczke(lista, domyslnyGracz);
      res.status(202).json({ ok: true, ...wynik });
    } catch (e) {
      console.error("[analytics zdarzenia]", e);
      res.status(500).json({ error: e.message });
    }
  });

  /* Liczniki pętli. Domyślnie ostatnie 30 dni. `gracz` = surowe player_id
     (Mentor filtruje po dziecku; skrót liczymy tu). */
  r.get("/petla", requireMentorLubAutor, async (req, res) => {
    try {
      const teraz = new Date();
      const doD = dataAlbo(req.query.do, teraz);
      const odD = dataAlbo(req.query.od, new Date(doD.getTime() - 30 * 864e5));
      if (odD > doD) return res.status(400).json({ error: "od > do" });
      const gracz = typeof req.query.gracz === "string" && req.query.gracz ? skrotGracza(req.query.gracz) : null;
      const pool = await initDatabase();
      const par = [odD.toISOString(), doD.toISOString()];
      let filtr = "kiedy >= $1 AND kiedy <= $2";
      if (gracz) { par.push(gracz); filtr += ` AND gracz = $${par.length}`; }

      const { rows: perNazwa } = await pool.query(
        `SELECT nazwa, COUNT(*)::int AS n, COUNT(DISTINCT gracz)::int AS gracze
           FROM zdarzenia WHERE ${filtr} GROUP BY nazwa`, par
      );
      const { rows: dziennie } = await pool.query(
        `SELECT to_char(date_trunc('day', kiedy), 'YYYY-MM-DD') AS dzien, nazwa, COUNT(*)::int AS n
           FROM zdarzenia WHERE ${filtr} GROUP BY 1, 2 ORDER BY 1, 2`, par
      );
      const { rows: aktywni } = await pool.query(
        `SELECT COUNT(DISTINCT gracz)::int AS n FROM zdarzenia WHERE ${filtr} AND gracz IS NOT NULL`, par
      );

      const liczniki = {};
      const graczePerNazwa = {};
      for (const n of NAZWY_ZDARZEN) { liczniki[n] = 0; graczePerNazwa[n] = 0; }
      for (const row of perNazwa) { liczniki[row.nazwa] = row.n; graczePerNazwa[row.nazwa] = row.gracze; }

      // Miary sukcesu (docs/OPIS_PROJEKTU.md „Najważniejsza miara sukcesu").
      const miary = {
        rozpoczete_poza_ekranem: liczniki["zadanie.zlecone"],
        zakonczone_sladem: liczniki["slad.zostawiony"],
        powroty_po_dzialaniu: liczniki["powrot.po.sladzie"],
        zauwazenia_mentora: liczniki["mentor.zauwazyl"],
        swiat_zareagowal: liczniki["swiat.zareagowal"],
        porady_wykonane: liczniki["porada_wykonana"],
        gracze_aktywni: aktywni[0]?.n || 0,
        // Ułamki (null gdy mianownik 0) — bez procentów na ekranie dziecka, to panel Mentora/autora.
        udzial_sladow: liczniki["zadanie.zlecone"] ? +(liczniki["slad.zostawiony"] / liczniki["zadanie.zlecone"]).toFixed(3) : null,
        udzial_zauwazen: liczniki["slad.zostawiony"] ? +(liczniki["mentor.zauwazyl"] / liczniki["slad.zostawiony"]).toFixed(3) : null,
        udzial_powrotow: liczniki["slad.zostawiony"] ? +(liczniki["powrot.po.sladzie"] / liczniki["slad.zostawiony"]).toFixed(3) : null,
      };
      res.json({ od: odD.toISOString(), do: doD.toISOString(), gracz: gracz ? "filtr" : null, liczniki, gracze_per_zdarzenie: graczePerNazwa, miary, dziennie });
    } catch (e) {
      console.error("[analytics petla]", e);
      res.status(500).json({ error: e.message });
    }
  });

  return r;
}
