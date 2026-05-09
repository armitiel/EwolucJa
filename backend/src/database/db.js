/**
 * Baza danych SQLite — przechowywanie profili graczy.
 * V2: dodane archetyp, cykle tygodniowe, misje, konta Game Mastera, plecak artefaktów.
 *
 * Migracja zachowuje wsteczną kompatybilność — istniejące kolumny pozostają,
 * nowe są dodawane warunkowo (ALTER TABLE ADD COLUMN IF NOT EXISTS).
 */

import Database from "better-sqlite3";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

function columnExists(db, table, column) {
  const rows = db.prepare(`PRAGMA table_info(${table})`).all();
  return rows.some((r) => r.name === column);
}

function addColumnIfMissing(db, table, column, definition) {
  if (!columnExists(db, table, column)) {
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition};`);
  }
}

export function initDatabase(dbPath) {
  const path = dbPath || join(__dirname, "..", "..", "ewolucja.db");
  const db = new Database(path);

  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  // ── Tabela players (V1 + V2 kolumny) ──────────────────────────────
  db.exec(`
    CREATE TABLE IF NOT EXISTS players (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      avatar_json TEXT DEFAULT '{}',
      scores_json TEXT DEFAULT '{"EM":0,"ST":0,"KR":0,"LD":0,"DT":0,"MD":0}',
      current_land TEXT DEFAULT 'dolina_selfie',
      completed_lands_json TEXT DEFAULT '[]',
      choices_log_json TEXT DEFAULT '[]',
      final_profile_json TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );
  `);

  // V2 — migracja kolumn na players (rolling migration, nie psuje istniejących danych)
  addColumnIfMissing(db, "players", "archetype", "TEXT");
  addColumnIfMissing(db, "players", "archetype_assigned_at", "TEXT");
  addColumnIfMissing(db, "players", "onboarding_answers_json", "TEXT DEFAULT '[]'");
  addColumnIfMissing(db, "players", "lifetime_scores_json", "TEXT DEFAULT '{\"EM\":0,\"ST\":0,\"KR\":0,\"LD\":0,\"DT\":0,\"MD\":0}'");
  addColumnIfMissing(db, "players", "current_cycle_id", "TEXT");
  addColumnIfMissing(db, "players", "current_chapter", "TEXT");
  addColumnIfMissing(db, "players", "backpack_json", "TEXT DEFAULT '[]'");
  addColumnIfMissing(db, "players", "gm_persona_id", "TEXT");
  addColumnIfMissing(db, "players", "registered_at", "TEXT DEFAULT (datetime('now'))");

  // ── Tabela cycles (cykl tygodniowy gracza) ─────────────────────────
  db.exec(`
    CREATE TABLE IF NOT EXISTS cycles (
      id TEXT PRIMARY KEY,
      player_id TEXT NOT NULL,
      cycle_number INTEGER NOT NULL,
      started_at TEXT NOT NULL,
      friday_deadline TEXT NOT NULL,
      status TEXT DEFAULT 'active',
      cycle_summary_json TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE
    );
  `);

  // ── Tabela missions (misje "w realu") ──────────────────────────────
  db.exec(`
    CREATE TABLE IF NOT EXISTS missions (
      id TEXT PRIMARY KEY,
      cycle_id TEXT NOT NULL,
      player_id TEXT NOT NULL,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      narrative_intro TEXT,
      competency_focus_json TEXT DEFAULT '[]',
      proof_type TEXT DEFAULT 'conversation',
      estimated_minutes INTEGER DEFAULT 15,
      safety_notes TEXT,
      status TEXT DEFAULT 'pending',
      submitted_proof_json TEXT,
      gm_verification_json TEXT,
      artifact_reward_json TEXT,
      generated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (cycle_id) REFERENCES cycles(id) ON DELETE CASCADE,
      FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE
    );
  `);

  // ── Tabela gm_accounts (rodzic / nauczyciel) ───────────────────────
  db.exec(`
    CREATE TABLE IF NOT EXISTS gm_accounts (
      id TEXT PRIMARY KEY,
      role TEXT NOT NULL CHECK (role IN ('parent', 'teacher')),
      name TEXT NOT NULL,
      email TEXT,
      gm_persona_id TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);

  // ── Tabela gm_pairings (powiązanie kont GM z dziećmi) ──────────────
  db.exec(`
    CREATE TABLE IF NOT EXISTS gm_pairings (
      id TEXT PRIMARY KEY,
      gm_account_id TEXT NOT NULL,
      player_id TEXT NOT NULL,
      paired_at TEXT DEFAULT (datetime('now')),
      pairing_code TEXT,
      UNIQUE(gm_account_id, player_id),
      FOREIGN KEY (gm_account_id) REFERENCES gm_accounts(id) ON DELETE CASCADE,
      FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE
    );
  `);

  // ── Tabela pairing_codes (jednorazowe kody parowania) ──────────────
  db.exec(`
    CREATE TABLE IF NOT EXISTS pairing_codes (
      code TEXT PRIMARY KEY,
      player_id TEXT NOT NULL,
      issued_by_account_id TEXT,
      role_for TEXT NOT NULL CHECK (role_for IN ('parent', 'teacher')),
      expires_at TEXT NOT NULL,
      used_by_account_id TEXT,
      used_at TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE
    );
  `);

  return db;
}

// ── V1 API (zachowane) ─────────────────────────────────────────────
export function getPlayer(db, playerId) {
  const row = db.prepare("SELECT * FROM players WHERE id = ?").get(playerId);
  if (!row) return null;

  return {
    player_id: row.id,
    player_name: row.name,
    avatar: JSON.parse(row.avatar_json || "{}"),
    scores: JSON.parse(row.scores_json || '{"EM":0,"ST":0,"KR":0,"LD":0,"DT":0,"MD":0}'),
    current_land: row.current_land,
    completed_lands: JSON.parse(row.completed_lands_json || "[]"),
    choices_log: JSON.parse(row.choices_log_json || "[]"),
    final_profile: row.final_profile_json ? JSON.parse(row.final_profile_json) : null,
    // V2 fields
    archetype: row.archetype || null,
    archetype_assigned_at: row.archetype_assigned_at || null,
    onboarding_answers: JSON.parse(row.onboarding_answers_json || "[]"),
    lifetime_scores: JSON.parse(row.lifetime_scores_json || '{"EM":0,"ST":0,"KR":0,"LD":0,"DT":0,"MD":0}'),
    current_cycle_id: row.current_cycle_id || null,
    current_chapter: row.current_chapter || null,
    backpack: JSON.parse(row.backpack_json || "[]"),
    gm_persona_id: row.gm_persona_id || null,
    registered_at: row.registered_at || row.created_at,
  };
}

export function savePlayer(db, profile) {
  const stmt = db.prepare(`
    INSERT INTO players (
      id, name, avatar_json, scores_json, current_land,
      completed_lands_json, choices_log_json, final_profile_json,
      archetype, archetype_assigned_at, onboarding_answers_json, lifetime_scores_json,
      current_cycle_id, current_chapter, backpack_json, gm_persona_id, updated_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    ON CONFLICT(id) DO UPDATE SET
      name = excluded.name,
      avatar_json = excluded.avatar_json,
      scores_json = excluded.scores_json,
      current_land = excluded.current_land,
      completed_lands_json = excluded.completed_lands_json,
      choices_log_json = excluded.choices_log_json,
      final_profile_json = excluded.final_profile_json,
      archetype = excluded.archetype,
      archetype_assigned_at = excluded.archetype_assigned_at,
      onboarding_answers_json = excluded.onboarding_answers_json,
      lifetime_scores_json = excluded.lifetime_scores_json,
      current_cycle_id = excluded.current_cycle_id,
      current_chapter = excluded.current_chapter,
      backpack_json = excluded.backpack_json,
      gm_persona_id = excluded.gm_persona_id,
      updated_at = datetime('now')
  `);

  stmt.run(
    profile.player_id,
    profile.player_name,
    JSON.stringify(profile.avatar || {}),
    JSON.stringify(profile.scores || { EM: 0, ST: 0, KR: 0, LD: 0, DT: 0, MD: 0 }),
    profile.current_land || null,
    JSON.stringify(profile.completed_lands || []),
    JSON.stringify(profile.choices_log || []),
    profile.final_profile ? JSON.stringify(profile.final_profile) : null,
    profile.archetype || null,
    profile.archetype_assigned_at || null,
    JSON.stringify(profile.onboarding_answers || []),
    JSON.stringify(profile.lifetime_scores || { EM: 0, ST: 0, KR: 0, LD: 0, DT: 0, MD: 0 }),
    profile.current_cycle_id || null,
    profile.current_chapter || null,
    JSON.stringify(profile.backpack || []),
    profile.gm_persona_id || null
  );
}

// ── V2 API: cycles ─────────────────────────────────────────────────
function nextFriday(fromDateIso) {
  const d = fromDateIso ? new Date(fromDateIso) : new Date();
  const day = d.getDay(); // 0=Sun, 5=Fri
  let delta = (5 - day + 7) % 7;
  if (delta === 0) delta = 7; // jeśli dziś piątek, deadline na kolejny piątek
  d.setDate(d.getDate() + delta);
  d.setHours(20, 0, 0, 0); // deadline 20:00
  return d.toISOString();
}

export { nextFriday };

export function createCycle(db, playerId) {
  const id = `cyc_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const startedAt = new Date().toISOString();
  const fridayDeadline = nextFriday(startedAt);

  const cycleNumberRow = db
    .prepare("SELECT COUNT(*) as c FROM cycles WHERE player_id = ?")
    .get(playerId);
  const cycleNumber = (cycleNumberRow?.c || 0) + 1;

  db.prepare(
    `INSERT INTO cycles (id, player_id, cycle_number, started_at, friday_deadline, status)
     VALUES (?, ?, ?, ?, ?, 'active')`
  ).run(id, playerId, cycleNumber, startedAt, fridayDeadline);

  db.prepare("UPDATE players SET current_cycle_id = ? WHERE id = ?").run(id, playerId);

  return {
    cycle_id: id,
    player_id: playerId,
    cycle_number: cycleNumber,
    started_at: startedAt,
    friday_deadline: fridayDeadline,
    status: "active",
  };
}

export function getCurrentCycle(db, playerId) {
  const row = db
    .prepare(
      "SELECT * FROM cycles WHERE player_id = ? AND status = 'active' ORDER BY cycle_number DESC LIMIT 1"
    )
    .get(playerId);
  if (!row) return null;
  return {
    cycle_id: row.id,
    player_id: row.player_id,
    cycle_number: row.cycle_number,
    started_at: row.started_at,
    friday_deadline: row.friday_deadline,
    status: row.status,
    cycle_summary: row.cycle_summary_json ? JSON.parse(row.cycle_summary_json) : null,
  };
}

export function closeCycle(db, cycleId, summary) {
  db.prepare(
    "UPDATE cycles SET status = 'closed', cycle_summary_json = ? WHERE id = ?"
  ).run(JSON.stringify(summary || {}), cycleId);
}

// ── V2 API: missions ───────────────────────────────────────────────
export function createMission(db, mission) {
  const id = mission.mission_id || `mis_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  db.prepare(
    `INSERT INTO missions (
       id, cycle_id, player_id, title, body, narrative_intro,
       competency_focus_json, proof_type, estimated_minutes, safety_notes, status
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`
  ).run(
    id,
    mission.cycle_id,
    mission.player_id,
    mission.title,
    mission.body,
    mission.narrative_intro || null,
    JSON.stringify(mission.competency_focus || []),
    mission.proof_type || "conversation",
    mission.estimated_minutes || 15,
    mission.safety_notes || null
  );
  return { ...mission, mission_id: id };
}

export function getMission(db, missionId) {
  const row = db.prepare("SELECT * FROM missions WHERE id = ?").get(missionId);
  if (!row) return null;
  return mapMissionRow(row);
}

export function getCurrentMission(db, playerId) {
  const row = db
    .prepare(
      `SELECT * FROM missions
       WHERE player_id = ? AND status IN ('pending', 'submitted')
       ORDER BY generated_at DESC LIMIT 1`
    )
    .get(playerId);
  if (!row) return null;
  return mapMissionRow(row);
}

export function submitMissionProof(db, missionId, proof) {
  db.prepare(
    "UPDATE missions SET status = 'submitted', submitted_proof_json = ? WHERE id = ?"
  ).run(JSON.stringify(proof), missionId);
}

export function verifyMission(db, missionId, verification) {
  const verdict = verification.verdict || "approved";
  const newStatus =
    verdict === "highlighted" ? "highlighted" : verdict === "needs_followup" ? "needs_followup" : "verified";
  db.prepare(
    "UPDATE missions SET status = ?, gm_verification_json = ? WHERE id = ?"
  ).run(newStatus, JSON.stringify(verification), missionId);
}

export function getMissionQueueForGM(db, gmAccountId) {
  // missions of children paired to this GM, awaiting verification
  const rows = db
    .prepare(
      `SELECT m.* FROM missions m
       INNER JOIN gm_pairings p ON p.player_id = m.player_id
       WHERE p.gm_account_id = ? AND m.status = 'submitted'
       ORDER BY m.generated_at ASC`
    )
    .all(gmAccountId);
  return rows.map(mapMissionRow);
}

function mapMissionRow(row) {
  return {
    mission_id: row.id,
    cycle_id: row.cycle_id,
    player_id: row.player_id,
    title: row.title,
    body: row.body,
    narrative_intro: row.narrative_intro,
    competency_focus: JSON.parse(row.competency_focus_json || "[]"),
    proof_type: row.proof_type,
    estimated_minutes: row.estimated_minutes,
    safety_notes: row.safety_notes,
    status: row.status,
    submitted_proof: row.submitted_proof_json ? JSON.parse(row.submitted_proof_json) : null,
    gm_verification: row.gm_verification_json ? JSON.parse(row.gm_verification_json) : null,
    artifact_reward: row.artifact_reward_json ? JSON.parse(row.artifact_reward_json) : null,
    generated_at: row.generated_at,
  };
}

// ── V2 API: gm_accounts + pairings ─────────────────────────────────
export function createGMAccount(db, account) {
  db.prepare(
    `INSERT INTO gm_accounts (id, role, name, email, gm_persona_id) VALUES (?, ?, ?, ?, ?)`
  ).run(account.account_id, account.role, account.name, account.email || null, account.gm_persona_id);
  return account;
}

export function getGMAccount(db, accountId) {
  const row = db.prepare("SELECT * FROM gm_accounts WHERE id = ?").get(accountId);
  if (!row) return null;
  const pairings = db
    .prepare("SELECT player_id FROM gm_pairings WHERE gm_account_id = ?")
    .all(accountId);
  return {
    account_id: row.id,
    role: row.role,
    name: row.name,
    email: row.email,
    gm_persona_id: row.gm_persona_id,
    paired_player_ids: pairings.map((p) => p.player_id),
    created_at: row.created_at,
  };
}

export function pairGMWithPlayer(db, gmAccountId, playerId, pairingCode) {
  const id = `pair_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  db.prepare(
    `INSERT OR IGNORE INTO gm_pairings (id, gm_account_id, player_id, pairing_code) VALUES (?, ?, ?, ?)`
  ).run(id, gmAccountId, playerId, pairingCode || null);
}

export function issuePairingCode(db, playerId, role, issuedByAccountId) {
  const code = Math.random().toString(36).slice(2, 8).toUpperCase();
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  db.prepare(
    `INSERT INTO pairing_codes (code, player_id, issued_by_account_id, role_for, expires_at)
     VALUES (?, ?, ?, ?, ?)`
  ).run(code, playerId, issuedByAccountId || null, role, expires);
  return { code, player_id: playerId, role_for: role, expires_at: expires };
}

export function consumePairingCode(db, code, accountId) {
  const row = db.prepare("SELECT * FROM pairing_codes WHERE code = ? AND used_by_account_id IS NULL").get(code);
  if (!row) return null;
  if (new Date(row.expires_at).getTime() < Date.now()) return null;
  db.prepare(
    "UPDATE pairing_codes SET used_by_account_id = ?, used_at = datetime('now') WHERE code = ?"
  ).run(accountId, code);
  return { player_id: row.player_id, role_for: row.role_for };
}

export function getBackpack(db, playerId) {
  const row = db.prepare("SELECT backpack_json FROM players WHERE id = ?").get(playerId);
  if (!row) return [];
  return JSON.parse(row.backpack_json || "[]");
}

export function addArtifactToBackpack(db, playerId, artifact) {
  const current = getBackpack(db, playerId);
  current.push({
    artifact_id: artifact.artifact_id,
    artifact_name: artifact.artifact_name,
    awarded_at: new Date().toISOString(),
    cycle_id: artifact.cycle_id || null,
  });
  db.prepare("UPDATE players SET backpack_json = ? WHERE id = ?").run(
    JSON.stringify(current),
    playerId
  );
  return current;
}
