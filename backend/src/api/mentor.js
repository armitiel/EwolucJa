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

  // Mentor weryfikuje misje ucznia (approve/reject z komentarzem + customowa liczba punktow)
  r.post("/missions/:missionId/verify", async (req, res) => {
    try {
      const { decision, comment, points } = req.body || {}; // decision: 'approve' | 'reject', points: 10-50
      if (!["approve", "reject"].includes(decision)) {
        return res.status(400).json({ error: "decision musi byc 'approve' lub 'reject'" });
      }
      // Game design v2: clamp 15-40, default 25. Real-life zadanie = wysokowartosciowe.
      const awardCoins = Math.max(15, Math.min(40, Number(points) || 25));
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
        points_awarded: decision === "approve" ? awardCoins : 0,
        verified_at: new Date().toISOString(),
        gm_account_id: req.mentor.gmAccountId,
      };
      await pool.query(
        `UPDATE missions SET status = $1, gm_verification = $2 WHERE id = $3`,
        [newStatus, JSON.stringify(verification), req.params.missionId]
      );

      // Jezeli approve - dodaj awardCoins + +5 do glownego profilu gracza + powiadomienie reward
      if (decision === "approve") {
        const playerId = ownCheck[0].player_id;
        const { rows: pRows } = await pool.query(`SELECT archetype, coins, lifetime_scores FROM players WHERE id = $1`, [playerId]);
        if (pRows.length) {
          const p = pRows[0];
          const lifetime = p.lifetime_scores || {};
          const mainProfile = p.archetype && lifetime[p.archetype] !== undefined ? p.archetype : "DT";
          lifetime[mainProfile] = (lifetime[mainProfile] || 0) + 5;
          const newCoins = (p.coins || 0) + awardCoins;
          await pool.query(
            `UPDATE players SET coins = $1, lifetime_scores = $2, updated_at = NOW() WHERE id = $3`,
            [newCoins, JSON.stringify(lifetime), playerId]
          );
        }
        // Reward hint - HintPopup u ucznia pokaze custom celebration screen (coin animation + Dziekuje).
        // Body zawiera liczbe coinow - frontend parsuje. Tytul = krotki naglowek.
        const rewardId = randomUUID();
        const missionTitleRow = await pool.query("SELECT title FROM missions WHERE id = $1", [req.params.missionId]);
        const missionTitle = missionTitleRow.rows[0]?.title || "Twoje zadanie";
        await pool.query(
          `INSERT INTO mentor_hints (id, gm_account_id, player_id, kind, title, body)
             VALUES ($1, $2, $3, 'reward', $4, $5)`,
          [
            rewardId, req.mentor.gmAccountId, playerId,
            `+${awardCoins} ✦ za „${missionTitle}"`,
            // Body: pierwszy "wiersz" = liczba coinow (frontend parsuje regex \+(\d+)), reszta to krotki komentarz
            `+${awardCoins} ✦ ${comment ? "· " + comment : "· Mentor docenia Twoj wysilek!"}`,
          ]
        );
      }
      res.json({ ok: true, status: newStatus, points_awarded: decision === "approve" ? awardCoins : 0 });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  // Mentor tworzy nowa misje dla ucznia. Misja idzie do biezacego cyklu (lub nowego jezeli brak).
  // Po utworzeniu - wysylamy automatyczny hint typu 'task' zeby HintPopup powiadomil ucznia.
  // Mentor usuwa misje (np. stara wykonana zadania). Tylko gdy nalezy do klasy mentora.
  r.delete("/missions/:missionId", async (req, res) => {
    try {
      const pool = await initDatabase();
      const { rows: ownCheck } = await pool.query(
        `SELECT m.id FROM missions m
           JOIN class_memberships cm ON cm.player_id = m.player_id
           JOIN mentor_classes mc ON mc.id = cm.class_id
           WHERE m.id = $1 AND mc.gm_account_id = $2 LIMIT 1`,
        [req.params.missionId, req.mentor.gmAccountId]
      );
      if (!ownCheck.length) return res.status(404).json({ error: "Misja nie znaleziona w Twoich klasach" });
      await pool.query(`DELETE FROM missions WHERE id = $1`, [req.params.missionId]);
      res.json({ ok: true });
    } catch (e) {
      console.error("[mentor delete mission]", e);
      res.status(500).json({ error: e.message });
    }
  });

  r.post("/students/:playerId/missions", async (req, res) => {
    try {
      const { title, body, competency_focus, points_reward } = req.body || {};
      if (!title?.trim() || !body?.trim()) {
        return res.status(400).json({ error: "title i body sa wymagane" });
      }
      const reward = Math.max(15, Math.min(40, Number(points_reward) || 25));
      const focus = Array.isArray(competency_focus) ? competency_focus : [];

      const pool = await initDatabase();
      // Verify mentor owns class containing this player
      const ownCheck = await pool.query(
        `SELECT 1 FROM mentor_classes mc
           JOIN class_memberships cm ON cm.class_id = mc.id
           WHERE mc.gm_account_id = $1 AND cm.player_id = $2 LIMIT 1`,
        [req.mentor.gmAccountId, req.params.playerId]
      );
      if (!ownCheck.rows.length) return res.status(404).json({ error: "Uczen nie w Twojej klasie" });

      // Znajdz biezacy cykl ucznia (lub stworz minimalny rekord jezeli brak)
      let cycleId;
      const { rows: cycleRows } = await pool.query(
        `SELECT id FROM cycles WHERE player_id = $1 AND status = 'active' ORDER BY started_at DESC LIMIT 1`,
        [req.params.playerId]
      );
      if (cycleRows.length) {
        cycleId = cycleRows[0].id;
      } else {
        // Brak cyklu - tworz nowy do najblizszego piatku. cycle_number = max+1 dla tego gracza.
        cycleId = randomUUID();
        const now = new Date();
        const friday = new Date(now);
        const daysToFri = (5 - now.getDay() + 7) % 7 || 7;
        friday.setDate(now.getDate() + daysToFri);
        friday.setHours(23, 59, 59);
        const { rows: cn } = await pool.query(
          `SELECT COALESCE(MAX(cycle_number), 0) + 1 AS next_num FROM cycles WHERE player_id = $1`,
          [req.params.playerId]
        );
        const cycleNumber = cn[0]?.next_num || 1;
        await pool.query(
          `INSERT INTO cycles (id, player_id, cycle_number, status, started_at, friday_deadline)
             VALUES ($1, $2, $3, 'active', NOW(), $4)`,
          [cycleId, req.params.playerId, cycleNumber, friday.toISOString()]
        );
      }

      const missionId = randomUUID();
      // safety_notes w schema to TEXT (nie JSONB), wiec stringify do JSON-stringu
      const safetyNotes = JSON.stringify({ source: "mentor", gm_account_id: req.mentor.gmAccountId, reward_hint: reward });
      await pool.query(
        `INSERT INTO missions (id, cycle_id, player_id, title, body, narrative_intro, competency_focus, proof_type, estimated_minutes, safety_notes, status, generated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, 'conversation', 15, $8, 'pending', NOW())`,
        [
          missionId, cycleId, req.params.playerId,
          title.trim(), body.trim(),
          "Mędrzec szepcze: Twój mentor przygotował dla Ciebie nowe zadanie...",
          JSON.stringify(focus),
          safetyNotes,
        ]
      );

      // Auto-hint dla ucznia, zeby HintPopup pokazal powiadomienie (kind=task)
      const hintId = randomUUID();
      await pool.query(
        `INSERT INTO mentor_hints (id, gm_account_id, player_id, kind, title, body)
           VALUES ($1, $2, $3, 'task', $4, $5)`,
        [
          hintId, req.mentor.gmAccountId, req.params.playerId,
          "Nowe zadanie w realu!",
          `Twój mentor wysłał Ci nowe zadanie: "${title.trim()}". Otwórz „Zadania w realu" w Domu i ruszaj na tropienie!`,
        ]
      );

      res.status(201).json({ id: missionId, hint_id: hintId, ok: true, reward });
    } catch (e) {
      console.error("[mentor create mission]", e);
      res.status(400).json({ error: e.message });
    }
  });

  // Mentor oznacza pare jako wykonana - akceptuje checks (pola wyboru) + custom points dla obu graczy
  r.post("/pairs/:assignmentId/complete", async (req, res) => {
    try {
      const { checks, points, comment } = req.body || {};
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

      const proof = {
        checks: checks || {},
        comment: comment || null,
        completed_by: req.mentor.gmAccountId,
        completed_at: new Date().toISOString(),
      };
      // markCompleted nagradza oboje graczy custom punktami (clamp 10-50 wewnatrz)
      const result = await pairs.markCompleted(null, req.params.assignmentId, proof, points);
      res.json({ ok: true, ...result });
    } catch (e) {
      console.error("[mentor pair complete]", e);
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
                completed_lands, current_chapter, updated_at, registered_at, coins, login_code
           FROM players WHERE id = $1`,
        [req.params.playerId]
      );
      if (!pRows.length) return res.status(404).json({ error: "Gracz nie znaleziony" });
      const player = pRows[0];
      // Lazy backfill: jezeli stary gracz nie ma jeszcze kodu, wygeneruj.
      if (!player.login_code) {
        const { generateUniqueLoginCode } = await import("../database/db.js");
        const code = await generateUniqueLoginCode(pool);
        await pool.query("UPDATE players SET login_code=$1 WHERE id=$2", [code, player.id]);
        player.login_code = code;
      }

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

  // Usun hint wyslany do ucznia (mentor moze cofnac wiadomosc)
  r.delete("/students/:playerId/hints/:hintId", async (req, res) => {
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
      const result = await pool.query(
        `DELETE FROM mentor_hints WHERE id = $1 AND player_id = $2`,
        [req.params.hintId, req.params.playerId]
      );
      res.json({ ok: true, deleted: result.rowCount || 0 });
    } catch (e) {
      console.error("[mentor hints delete]", e);
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
