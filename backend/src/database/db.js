/**
 * Baza danych SQLite — przechowywanie profili graczy.
 */

import Database from "better-sqlite3";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export function initDatabase(dbPath) {
  const path = dbPath || join(__dirname, "..", "..", "ewolucja.db");
  const db = new Database(path);

  // Włącz WAL mode dla lepszej wydajności
  db.pragma("journal_mode = WAL");

  // Tworzenie tabel
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

  return db;
}

export function getPlayer(db, playerId) {
  const row = db.prepare("SELECT * FROM players WHERE id = ?").get(playerId);
  if (!row) return null;

  return {
    player_id: row.id,
    player_name: row.name,
    avatar: JSON.parse(row.avatar_json),
    scores: JSON.parse(row.scores_json),
    current_land: row.current_land,
    completed_lands: JSON.parse(row.completed_lands_json),
    choices_log: JSON.parse(row.choices_log_json),
    final_profile: row.final_profile_json ? JSON.parse(row.final_profile_json) : null,
  };
}

export function savePlayer(db, profile) {
  const stmt = db.prepare(`
    INSERT INTO players (id, name, avatar_json, scores_json, current_land,
                         completed_lands_json, choices_log_json, final_profile_json, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    ON CONFLICT(id) DO UPDATE SET
      name = excluded.name,
      avatar_json = excluded.avatar_json,
      scores_json = excluded.scores_json,
      current_land = excluded.current_land,
      completed_lands_json = excluded.completed_lands_json,
      choices_log_json = excluded.choices_log_json,
      final_profile_json = excluded.final_profile_json,
      updated_at = datetime('now')
  `);

  stmt.run(
    profile.player_id,
    profile.player_name,
    JSON.stringify(profile.avatar),
    JSON.stringify(profile.scores),
    profile.current_land,
    JSON.stringify(profile.completed_lands),
    JSON.stringify(profile.choices_log),
    profile.final_profile ? JSON.stringify(profile.final_profile) : null
  );
}
