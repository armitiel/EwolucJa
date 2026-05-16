/**
 * /api/mentor - operacje mentora (wymaga zalogowania).
 *
 * Endpoints:
 *   GET    /api/mentor/classes                    - lista klas mentora
 *   POST   /api/mentor/classes                    - utworz klase
 *   GET    /api/mentor/classes/:id                - szczegoly klasy + lista uczniow
 *   POST   /api/mentor/classes/:id/regenerate     - nowy invite code
 */

import { Router } from "express";
import { randomUUID } from "node:crypto";
import { requireMentor } from "../services/authService.js";
import { initDatabase } from "../database/db.js";
import { getPairDefinition } from "../services/pairsService.js";
import {
  createClass,
  listMentorClasses,
  getClassDetail,
  regenerateInviteCode,
} from "../services/classService.js";

export function mentorRoutes() {
  const r = Router();

  r.use(requireMentor());

  r.get("/classes", async (req, res) => {
    try {
      const classes = await listMentorClasses(req.mentor.gmAccountId);
      res.json({ classes });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  r.post("/classes", async (req, res) => {
    try {
      const { name, description, maxStudents } = req.body || {};
      const created = await createClass({
        gmAccountId: req.mentor.gmAccountId,
        name, description, maxStudents,
      });
      res.status(201).json(created);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  });

  r.get("/classes/:id", async (req, res) => {
    try {
      const detail = await getClassDetail(req.mentor.gmAccountId, req.params.id);
      if (!detail) return res.status(404).json({ error: "Klasa nie znaleziona" });
      res.json(detail);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  // Aktywne pary w klasie - lista pair_assignments dla uczniow tej klasy
  r.get("/classes/:id/pairs", async (req, res) => {
    try {
      const pool = await initDatabase();
      // Verify ownership
      const { rows: cls } = await pool.query(
        `SELECT id FROM mentor_classes WHERE id = $1 AND gm_account_id = $2`,
        [req.params.id, req.mentor.gmAccountId]
      );
      if (!cls.length) return res.status(404).json({ error: "Klasa nie znaleziona" });

      const { rows } = await pool.query(
        `SELECT pa.*,
                p_a.name AS player_a_name, p_a.archetype AS player_a_archetype,
                p_b.name AS player_b_name, p_b.archetype AS player_b_archetype
           FROM pair_assignments pa
           JOIN players p_a ON p_a.id = pa.player_a_id
           JOIN players p_b ON p_b.id = pa.player_b_id
           WHERE EXISTS (SELECT 1 FROM class_memberships cm WHERE cm.player_id = pa.player_a_id AND cm.class_id = $1 AND cm.left_at IS NULL)
             AND EXISTS (SELECT 1 FROM class_memberships cm WHERE cm.player_id = pa.player_b_id AND cm.class_id = $1 AND cm.left_at IS NULL)
           ORDER BY pa.created_at DESC`,
        [req.params.id]
      );

      const enriched = rows.map((r) => ({
        ...r,
        definition: getPairDefinition(r.pair_definition_id),
      }));
      res.json({ pairs: enriched });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  // Mentor weryfikuje misje ucznia (approve/reject z komentarzem)
  r.post("/missions/:missionId/verify", async (req, res) => {
    try {
      const { decision, comment } = req.body || {}; // decision: 'approve' | 'reject'
      if (!["approve", "reject"].includes(decision)) {
        return res.status(400).json({ error: "decision musi byc 'approve' lub 'reject'" });
      }
      const pool = await initDatabase();
      // Verify ownership - mentor musi byc wlasicielem klasy do ktorej naleza grasz tej misji
      const { rows: ownCheck } = await pool.query(
        `SELECT m.id, m.player_id FROM missions m
           JOIN class_memberships cm ON cm.player_id = m.player_id
           JOIN mentor_classes mc ON mc.id = cm.class_id
           WHERE m.id = $1 AND mc.gm_account_id = $2 LIMIT 1`,
        [req.params.missionId, req.mentor.gmAccountId]
      );
      if (!ownCheck.length) return res.status(404).json({ error: "Misja nie znaleziona w Twoich klasach" });

      const newStatus = decision === "approve" ? "verified" : "rejected";
      const verification = {
        decision,
        comment: comment || null,
        verified_at: new Date().toISOString(),
        gm_account_id: req.mentor.gmAccountId,
      };
      await pool.query(
        `UPDATE missions SET status = $1, gm_verification = $2 WHERE id = $3`,
        [newStatus, JSON.stringify(verification), req.params.missionId]
      );

      // Jezeli approve - dodaj bonus 20 coinow + +5 do glownego profilu gracza
      if (decision === "approve") {
        const playerId = ownCheck[0].player_id;
        const { rows: pRows } = await pool.query(`SELECT archetype, coins, lifetime_scores FROM players WHERE id = $1`, [playerId]);
        if (pRows.length) {
          const p = pRows[0];
          const lifetime = p.lifetime_scores || {};
          const mainProfile = p.archetype && lifetime[p.archetype] !== undefined ? p.archetype : "DT";
          lifetime[mainProfile] = (lifetime[mainProfile] || 0) + 5;
          const newCoins = (p.coins || 0) + 20;
          await pool.query(
            `UPDATE players SET coins = $1, lifetime_scores = $2, updated_at = NOW() WHERE id = $3`,
            [newCoins, JSON.stringify(lifetime), playerId]
          );
        }
      }
      res.json({ ok: true, status: newStatus });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  // Mentor oznacza pare jako wykonana
  r.post("/pairs/:assignmentId/complete", async (req, res) => {
    try {
      const pool = await initDatabase();
      // Weryfikacja ze mentor jest wlasicielem klasy do ktorej naleza obaj uczniowie
      const { rows } = await pool.query(
        `SELECT pa.id FROM pair_assignments pa
           WHERE pa.id = $1
             AND EXISTS (
               SELECT 1 FROM class_memberships cm
                 JOIN mentor_classes mc ON mc.id = cm.class_id
                 WHERE cm.player_id IN (pa.player_a_id, pa.player_b_id)
                   AND mc.gm_account_id = $2
             )`,
        [req.params.assignmentId, req.mentor.gmAccountId]
      );
      if (!rows.length) return res.status(404).json({ error: "Para nie znaleziona w Twoich klasach" });
      await pool.query(
        `UPDATE pair_assignments SET status = 'completed', completed_at = NOW() WHERE id = $1`,
        [req.params.assignmentId]
      );
      res.json({ ok: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  // Pelne detale ucznia: scores, missions, hints sent
  r.get("/classes/:id/students/:playerId", async (req, res) => {
    try {
      const pool = await initDatabase();
      // Verify ownership
      const ownCheck = await pool.query(
        `SELECT 1 FROM mentor_classes mc
           JOIN class_memberships cm ON cm.class_id = mc.id
           WHERE mc.id = $1 AND mc.gm_account_id = $2 AND cm.player_id = $3 LIMIT 1`,
        [req.params.id, req.mentor.gmAccountId, req.params.playerId]
      );
      if (!ownCheck.rows.length) return res.status(404).json({ error: "Uczen nie znaleziony w klasie" });

      const { rows: pRows } = await pool.query(
        `SELECT id, name, archetype, scores, lifetime_scores, backpack,
                completed_lands, current_chapter, updated_at, registered_at
           FROM players WHERE id = $1`,
        [req.params.playerId]
      );
      if (!pRows.length) return res.status(404).json({ error: "Gracz nie znaleziony" });
      const player = pRows[0];

      const { rows: missions } = await pool.query(
        `SELECT id, title, body, status, generated_at, submitted_proof, gm_verification
           FROM missions WHERE player_id = $1 ORDER BY generated_at DESC LIMIT 10`,
        [req.params.playerId]
      );

      const { rows: hints } = await pool.query(
        `SELECT id, kind, title, body, sent_at, viewed_at
           FROM mentor_hints WHERE player_id = $1 ORDER BY sent_at DESC LIMIT 20`,
        [req.params.playerId]
      );

      // Coins z nowego pola (fallback do sumy lifetime_scores dla starych rekordow)
      const coins = player.coins != null && player.coins > 0
        ? player.coins
        : Object.values(player.lifetime_scores || {}).reduce((a, b) => a + (b || 0), 0);

      // Postep tygodnia: dane z ostatnich 7 dni - przyblizenie z misji submitted_at
      const weekStart = new Date(); weekStart.setDate(weekStart.getDate() - 7);
      const { rows: weekMissions } = await pool.query(
        `SELECT COUNT(*) as week_count FROM missions
           WHERE player_id = $1
             AND submitted_proof IS NOT NULL
             AND (submitted_proof->>'submitted_at')::timestamptz >= $2`,
        [req.params.playerId, weekStart.toISOString()]
      );
      const weekCoinsApprox = (Number(weekMissions[0]?.week_count || 0)) * 10;

      res.json({
        player,
        missions,
        hints,
        total_coins: coins,
        week_coins: weekCoinsApprox,
        week_missions: Number(weekMissions[0]?.week_count || 0),
      });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  // Wyslij hint/artefakt/wiadomosc do ucznia
  r.post("/students/:playerId/hints", async (req, res) => {
    try {
      const pool = await initDatabase();
      // Verify mentor owns class containing this player
      const ownCheck = await pool.query(
        `SELECT 1 FROM mentor_classes mc
           JOIN class_memberships cm ON cm.class_id = mc.id
           WHERE mc.gm_account_id = $1 AND cm.player_id = $2 LIMIT 1`,
        [req.mentor.gmAccountId, req.params.playerId]
      );
      if (!ownCheck.rows.length) return res.status(404).json({ error: "Uczen nie w Twojej klasie" });
      const { kind = "hint", title, body } = req.body || {};
      if (!body?.trim()) return res.status(400).json({ error: "body required" });
      const id = randomUUID();
      await pool.query(
        `INSERT INTO mentor_hints (id, gm_account_id, player_id, kind, title, body) VALUES ($1, $2, $3, $4, $5, $6)`,
        [id, req.mentor.gmAccountId, req.params.playerId, kind, title || null, body.trim()]
      );
      res.status(201).json({ id, ok: true });
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  });

  r.delete("/classes/:id/students/:playerId", async (req, res) => {
    try {
      const pool = await initDatabase();
      // Verify mentor owns the class
      const { rows: cls } = await pool.query(
        `SELECT id FROM mentor_classes WHERE id = $1 AND gm_account_id = $2`,
        [req.params.id, req.mentor.gmAccountId]
      );
      if (!cls.length) return res.status(404).json({ error: "Klasa nie znaleziona lub brak uprawnien" });
      // Cascade: players row removed -> class_memberships, missions, cycles, pair_assignments all CASCADE deleted
      await pool.query(`DELETE FROM players WHERE id = $1`, [req.params.playerId]);
      res.json({ ok: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  r.post("/classes/:id/regenerate", async (req, res) => {
    try {
      const result = await regenerateInviteCode(req.mentor.gmAccountId, req.params.id);
      res.json(result);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  });

  // Whitelist mentorow
  r.get("/whitelist", async (req, res) => {
    try {
      const pool = await initDatabase();
      const { rows } = await pool.query(
        `SELECT mw.email, mw.added_at, mw.note,
                ga.name AS added_by_name,
                gi.email AS added_by_email
           FROM mentor_whitelist mw
           LEFT JOIN gm_accounts ga ON ga.id = mw.added_by_gm_account_id
           LEFT JOIN google_identities gi ON gi.gm_account_id = mw.added_by_gm_account_id
           ORDER BY mw.added_at DESC`
      );
      res.json({ emails: rows });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  r.post("/whitelist", async (req, res) => {
    try {
      const { email, note } = req.body || {};
      if (!email?.trim()) return res.status(400).json({ error: "email required" });
      const normEmail = email.trim().toLowerCase();
      const pool = await initDatabase();
      await pool.query(
        `INSERT INTO mentor_whitelist (email, added_by_gm_account_id, note)
           VALUES ($1, $2, $3)
           ON CONFLICT (email) DO UPDATE SET note = EXCLUDED.note`,
        [normEmail, req.mentor.gmAccountId, note || null]
      );
      res.status(201).json({ email: normEmail, ok: true });
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  });

  // Demo player - mentor wchodzi jako uczen do testow
  r.get("/me/demo-player", async (req, res) => {
    try {
      const pool = await initDatabase();
      const { rows } = await pool.query(
        `SELECT id, name, archetype FROM players
           WHERE created_by_gm_account_id = $1 AND is_demo = TRUE
           ORDER BY created_at DESC LIMIT 1`,
        [req.mentor.gmAccountId]
      );
      res.json({ player: rows[0] || null });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  r.post("/me/demo-player", async (req, res) => {
    try {
      const pool = await initDatabase();
      // Reuse istniejacy demo
      const existing = await pool.query(
        `SELECT id FROM players WHERE created_by_gm_account_id = $1 AND is_demo = TRUE
           ORDER BY created_at DESC LIMIT 1`,
        [req.mentor.gmAccountId]
      );
      if (existing.rows.length) return res.json({ player_id: existing.rows[0].id, reused: true });

      // Nowy demo
      const id = randomUUID();
      const name = (req.body?.name || "Tester").trim();
      await pool.query(
        `INSERT INTO players (id, name, is_demo, created_by_gm_account_id) VALUES ($1, $2, TRUE, $3)`,
        [id, name, req.mentor.gmAccountId]
      );
      res.status(201).json({ player_id: id, reused: false });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  r.delete("/me/demo-player", async (req, res) => {
    try {
      const pool = await initDatabase();
      await pool.query(
        `DELETE FROM players WHERE created_by_gm_account_id = $1 AND is_demo = TRUE`,
        [req.mentor.gmAccountId]
      );
      res.json({ ok: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  r.delete("/whitelist/:email", async (req, res) => {
    try {
      const pool = await initDatabase();
      await pool.query(`DELETE FROM mentor_whitelist WHERE LOWER(email) = LOWER($1)`, [req.params.email]);
      res.json({ ok: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  return r;
}
