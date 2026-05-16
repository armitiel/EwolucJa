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
        `SELECT mc.invite_code, mc.name, mc.invite_code_expires_at, mc.archived_at, mc.created_at, mc.gm_account_id,
                LENGTH(mc.invite_code) AS code_len, ENCODE(mc.invite_code::bytea, 'hex') AS code_hex,
                (SELECT COUNT(*) FROM class_memberships cm WHERE cm.class_id = mc.id AND cm.left_at IS NULL) AS students
           FROM mentor_classes mc
           ORDER BY mc.created_at DESC LIMIT 50`
      );
      res.json({ classes: rows });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  // DEBUG: members per klasa
  r.get("/_debug/members", async (req, res) => {
    try {
      const pool = await initDatabase();
      const { rows } = await pool.query(
        `SELECT cm.class_id, mc.name AS class_name, mc.invite_code,
                p.id AS player_id, p.name AS player_name, p.archetype,
                cm.joined_at, cm.left_at
           FROM class_memberships cm
           JOIN mentor_classes mc ON mc.id = cm.class_id
           JOIN players p ON p.id = cm.player_id
           ORDER BY cm.joined_at DESC LIMIT 40`
      );
      res.json({ memberships: rows });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  // DEBUG: lista graczy w klasie z full danymi
  r.get("/_debug/students", async (req, res) => {
    try {
      const pool = await initDatabase();
      const { rows } = await pool.query(
        `SELECT p.id, p.name, p.archetype, p.lifetime_scores, p.scores,
                p.archetype_assigned_at, p.current_chapter, p.registered_at, p.updated_at
           FROM players p
           ORDER BY p.registered_at DESC LIMIT 30`
      );
      res.json({ players: rows });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  // DEBUG: prosty test ze samym WHERE
  r.get("/_debug/find", async (req, res) => {
    try {
      const code = String(req.query.code || "").trim().toUpperCase();
      const pool = await initDatabase();
      const r1 = await pool.query(`SELECT id, invite_code FROM mentor_classes WHERE invite_code = $1`, [code]);
      const r2 = await pool.query(`SELECT id, invite_code FROM mentor_classes WHERE invite_code ILIKE $1`, [code]);
      const r3 = await pool.query(`SELECT id, invite_code FROM mentor_classes`);
      res.json({ exact: r1.rows, ilike: r2.rows, all: r3.rows });
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
