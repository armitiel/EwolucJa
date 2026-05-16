/**
 * /api/classes - publiczne endpointy dla ucznia/rodzica do dolaczenia.
 *
 * Endpoints:
 *   POST /api/classes/join     - body: {invite_code, player_name}  -> tworzy gracza + membership
 *   GET  /api/classes/check    - query: ?code=XXX                  -> waliduj kod (nie tworzy)
 */

import { Router } from "express";
import { joinClassByCode } from "../services/classService.js";
import { initDatabase } from "../database/db.js";

export function classRoutes() {
  const r = Router();

  // TYMCZASOWY DEBUG endpoint - lista wszystkich klas (do diagnozy zaprosen)
  r.get("/_debug/list", async (req, res) => {
    try {
      const pool = await initDatabase();
      const { rows } = await pool.query(
        `SELECT mc.invite_code, mc.name, mc.invite_code_expires_at, mc.archived_at, mc.created_at,
                (SELECT COUNT(*) FROM class_memberships cm WHERE cm.class_id = mc.id AND cm.left_at IS NULL) AS students
           FROM mentor_classes mc
           ORDER BY mc.created_at DESC LIMIT 50`
      );
      res.json({ classes: rows });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  r.get("/check", async (req, res) => {
    try {
      const code = String(req.query.code || "").trim().toUpperCase();
      if (!code) return res.status(400).json({ error: "code required" });
      const pool = await initDatabase();
      const { rows } = await pool.query(
        `SELECT mc.id, mc.name, mc.invite_code_expires_at, mc.archived_at, mc.max_students, ga.name AS mentor_name,
                (SELECT COUNT(*) FROM class_memberships cm WHERE cm.class_id = mc.id AND cm.left_at IS NULL) AS student_count
           FROM mentor_classes mc
           LEFT JOIN gm_accounts ga ON ga.id = mc.gm_account_id
           WHERE mc.invite_code = $1`,
        [code]
      );
      if (!rows.length) return res.json({ valid: false, reason: "not_found" });
      const cls = rows[0];
      if (cls.archived_at) return res.json({ valid: false, reason: "archived" });
      if (cls.invite_code_expires_at && new Date(cls.invite_code_expires_at) < new Date()) {
        return res.json({ valid: false, reason: "expired" });
      }
      if (cls.student_count >= cls.max_students) {
        return res.json({ valid: false, reason: "full" });
      }
      res.json({
        valid: true,
        class_name: cls.name,
        mentor_name: cls.mentor_name,
        student_count: Number(cls.student_count),
        max_students: cls.max_students,
      });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  r.post("/join", async (req, res) => {
    try {
      const { invite_code, player_name, player_id } = req.body || {};
      const result = await joinClassByCode({ inviteCode: invite_code, playerId: player_id, playerName: player_name });
      res.status(201).json(result);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  });

  return r;
}
