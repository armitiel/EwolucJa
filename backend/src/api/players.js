import { Router } from "express";
import { getPlayer, savePlayer, initDatabase, findPlayerByLoginCode, getPool } from "../database/db.js";
import { randomUUID } from "crypto";

export function playerRoutes(db) {
  const router = Router();

  router.post("/", async (req, res) => {
    try {
      const { name } = req.body;
      if (!name || name.trim().length === 0) {
        return res.status(400).json({ error: "Imię gracza jest wymagane" });
      }
      const profile = {
        player_id: randomUUID(),
        player_name: name.trim(),
        avatar: { base_image: null, aura_color: null, starter_item: null, unlocked_assets: [] },
        scores: { EM: 0, ST: 0, KR: 0, LD: 0, DT: 0, MD: 0 },
        current_land: "dolina_selfie",
        completed_lands: [],
        choices_log: [],
        final_profile: null,
        lifetime_scores: { EM: 0, ST: 0, KR: 0, LD: 0, DT: 0, MD: 0 },
        backpack: [],
      };
      await savePlayer(db, profile);
      res.status(201).json(profile);
    } catch (e) {
      console.error("[players POST]", e);
      res.status(500).json({ error: e.message });
    }
  });

  // Logowanie ucznia krotkim kodem (6 znakow z alfabetu bez 0/O/1/I).
  // Uzywany gdy uczen stracil localStorage i potrzebuje wrocic. Mentor pokazuje kod w popupie.
  // UWAGA: route musi byc PRZED "/:id" zeby "by-code/XYZ" nie trafial w /:id.
  router.get("/by-code/:code", async (req, res) => {
    try {
      const player = await findPlayerByLoginCode(req.params.code);
      if (!player) return res.status(404).json({ error: "Nie ma takiego kodu. Sprawdź pisownię." });
      // Zwracamy minimum potrzebne do ustawienia sesji + redirect:
      res.json({ player_id: player.player_id, player_name: player.player_name, archetype: player.archetype || null });
    } catch (e) {
      console.error("[players by-code]", e);
      res.status(500).json({ error: e.message });
    }
  });

  router.get("/:id", async (req, res) => {
    try {
      const player = await getPlayer(db, req.params.id);
      if (!player) return res.status(404).json({ error: "Gracz nie znaleziony" });
      res.json(player);
    } catch (e) {
      console.error("[players GET]", e);
      res.status(500).json({ error: e.message });
    }
  });

  router.put("/:id", async (req, res) => {
    try {
      const existing = await getPlayer(db, req.params.id);
      if (!existing) return res.status(404).json({ error: "Gracz nie znaleziony" });
      const updated = { ...existing, ...req.body, player_id: req.params.id };
      await savePlayer(db, updated);
      res.json(updated);
    } catch (e) {
      console.error("[players PUT]", e);
      res.status(500).json({ error: e.message });
    }
  });

  // HINT/ARTEFAKT od mentora - pobierz nieprzeczytane
  /* ── Przygoda „Mapa Iskier" ─────────────────────────────────────────────
   * Stan przygody trzyma klient (localStorage) — te dwa endpointy sluza
   * wylacznie synchronizacji miedzy urzadzeniami. Brak sieci nie blokuje gry.
   */
  router.get("/:id/adventure", async (req, res) => {
    try {
      const pool = await getPool();
      const { rows } = await pool.query("SELECT adventure_state FROM players WHERE id = $1", [req.params.id]);
      if (!rows.length) return res.status(404).json({ error: "Gracz nie znaleziony" });
      res.json(rows[0].adventure_state || null);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  router.put("/:id/adventure", async (req, res) => {
    try {
      const { state } = req.body || {};
      if (!state || typeof state !== "object") return res.status(400).json({ error: "state jest wymagany" });
      const pool = await getPool();
      const { rowCount } = await pool.query(
        "UPDATE players SET adventure_state = $1, updated_at = NOW() WHERE id = $2",
        [JSON.stringify(state), req.params.id]
      );
      if (!rowCount) return res.status(404).json({ error: "Gracz nie znaleziony" });
      res.json({ ok: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  /* Wybory z pierwszej przygody zasilaja ISTNIEJACY system cech.
   * Nowy model 5 cech dziecka jest juz przelozony po stronie klienta na kody
   * EM/ST/KR/LD/DT/MD, wiec radar, raporty mentora i biblioteka misji dzialaja
   * bez zmian. Archetyp ustawiamy tylko gdy gracz go jeszcze nie ma.
   */
  router.post("/:id/adventure-profile", async (req, res) => {
    try {
      const { scores, name } = req.body || {};
      if (!scores || typeof scores !== "object") return res.status(400).json({ error: "scores sa wymagane" });
      const CODES = ["EM", "ST", "KR", "LD", "DT", "MD"];
      const pool = await getPool();
      const { rows } = await pool.query(
        "SELECT lifetime_scores, scores, archetype, coins, name FROM players WHERE id = $1",
        [req.params.id]
      );
      if (!rows.length) return res.status(404).json({ error: "Gracz nie znaleziony" });
      const p = rows[0];
      const lifetime = { ...(p.lifetime_scores || {}) };
      const cycleScores = { ...(p.scores || {}) };
      for (const code of CODES) {
        const add = Number(scores[code]) || 0;
        lifetime[code] = (lifetime[code] || 0) + add;
        cycleScores[code] = (cycleScores[code] || 0) + add;
      }
      let archetype = p.archetype;
      if (!archetype) {
        archetype = CODES.reduce((best, c) => ((scores[c] || 0) > (scores[best] || 0) ? c : best), "DT");
      }
      const nextName = (name && name.trim()) || p.name;
      const coins = Math.max(Number(p.coins) || 0, 50);
      await pool.query(
        "UPDATE players SET lifetime_scores = $1, scores = $2, archetype = $3, archetype_assigned_at = COALESCE(archetype_assigned_at, NOW()), name = $4, coins = $5, updated_at = NOW() WHERE id = $6",
        [JSON.stringify(lifetime), JSON.stringify(cycleScores), archetype, nextName, coins, req.params.id]
      );
      res.json({ ok: true, archetype, lifetime_scores: lifetime });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  router.get("/:id/hints/unread", async (req, res) => {
    try {
      const pool = await initDatabase();
      const { rows } = await pool.query(
        `SELECT mh.id, mh.kind, mh.title, mh.body, mh.sent_at,
                ga.name AS mentor_name
           FROM mentor_hints mh
           LEFT JOIN gm_accounts ga ON ga.id = mh.gm_account_id
           WHERE mh.player_id = $1 AND mh.viewed_at IS NULL
           ORDER BY mh.sent_at ASC`,
        [req.params.id]
      );
      res.json({ hints: rows });
    } catch (e) {
      console.error("[hints unread]", e);
      res.status(500).json({ error: e.message });
    }
  });

  // HINT/ARTEFAKT od mentora - pelna historia (przeczytane + nieprzeczytane)
  router.get("/:id/hints/all", async (req, res) => {
    try {
      const pool = await initDatabase();
      const { rows } = await pool.query(
        `SELECT mh.id, mh.kind, mh.title, mh.body, mh.sent_at, mh.viewed_at,
                ga.name AS mentor_name
           FROM mentor_hints mh
           LEFT JOIN gm_accounts ga ON ga.id = mh.gm_account_id
           WHERE mh.player_id = $1
           ORDER BY mh.sent_at DESC`,
        [req.params.id]
      );
      res.json({ hints: rows });
    } catch (e) {
      console.error("[hints all]", e);
      res.status(500).json({ error: e.message });
    }
  });

  // Oznacz hint jako widziany
  router.post("/:id/hints/:hintId/view", async (req, res) => {
    try {
      const pool = await initDatabase();
      await pool.query(
        `UPDATE mentor_hints SET viewed_at = NOW()
           WHERE id = $1 AND player_id = $2`,
        [req.params.hintId, req.params.id]
      );
      res.json({ ok: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  // Usun hint (uczen kasuje wiadomosc ze swojej skrzynki)
  router.delete("/:id/hints/:hintId", async (req, res) => {
    try {
      const pool = await initDatabase();
      const result = await pool.query(
        `DELETE FROM mentor_hints WHERE id = $1 AND player_id = $2`,
        [req.params.hintId, req.params.id]
      );
      res.json({ ok: true, deleted: result.rowCount || 0 });
    } catch (e) {
      console.error("[hints delete student]", e);
      res.status(500).json({ error: e.message });
    }
  });

  // ─── PORADY DNIA — tracking ktore widzial gracz (persist miedzy urzadzeniami) ───
  // GET /:id/viewed-tips -> [{ tip_id, viewed_at }]
  router.get("/:id/viewed-tips", async (req, res) => {
    try {
      const pool = await initDatabase();
      const { rows } = await pool.query(
        `SELECT tip_id, viewed_at FROM viewed_tips WHERE player_id = $1`,
        [req.params.id]
      );
      res.json({ viewed: rows });
    } catch (e) {
      console.error("[viewed-tips get]", e);
      res.status(500).json({ error: e.message });
    }
  });

  // POST /:id/push-subscribe - zapisz token push notification dla tego urzadzenia.
  // Lazy-import zeby nie ladowac web-push gdy nie potrzebne.
  router.post("/:id/push-subscribe", async (req, res) => {
    try {
      const { subscribePush } = await import("./push.js");
      const pool = await initDatabase();
      await subscribePush(pool, req.params.id, req.body || {});
      res.json({ ok: true });
    } catch (e) {
      console.error("[push subscribe]", e);
      res.status(400).json({ error: e.message });
    }
  });

  router.delete("/:id/push-unsubscribe", async (req, res) => {
    try {
      const { unsubscribePush } = await import("./push.js");
      const pool = await initDatabase();
      await unsubscribePush(pool, req.params.id, req.body || {});
      res.json({ ok: true });
    } catch (e) {
      console.error("[push unsubscribe]", e);
      res.status(400).json({ error: e.message });
    }
  });

  // POST /:id/viewed-tips body: { tip_id } -> INSERT ON CONFLICT DO NOTHING
  router.post("/:id/viewed-tips", async (req, res) => {
    try {
      const tipId = (req.body?.tip_id || "").toString().trim();
      if (!tipId) return res.status(400).json({ error: "tip_id required" });
      const pool = await initDatabase();
      await pool.query(
        `INSERT INTO viewed_tips (player_id, tip_id) VALUES ($1, $2)
           ON CONFLICT (player_id, tip_id) DO NOTHING`,
        [req.params.id, tipId]
      );
      res.json({ ok: true });
    } catch (e) {
      console.error("[viewed-tips post]", e);
      res.status(500).json({ error: e.message });
    }
  });

  return router;
}
