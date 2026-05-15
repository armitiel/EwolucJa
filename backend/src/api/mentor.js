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
