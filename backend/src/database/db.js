/**
 * Baza danych — Neon Postgres przez pg Pool.
 * V2 schemat: archetyp, cykl tygodniowy, misje, konta GM, plecak, kody parowania.
 */
import pg from "pg";

const { Pool } = pg;

// pg requires JSONB params as strings (no auto-stringification)
const J = (v) => v == null ? null : JSON.stringify(v);

let _pool = null;
let _schemaReady = null;

export function getPool() {
  if (_pool) return _pool;
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL not set in environment");
  }
  _pool = new Pool({
    connectionString,
    ssl: connectionString.includes("sslmode=require") ? { rejectUnauthorized: false } : false,
    max: 10,
  });
  return _pool;
}

async function ensureSchema(pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS players (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      avatar JSONB DEFAULT '{}'::jsonb,
      scores JSONB DEFAULT '{"EM":0,"ST":0,"KR":0,"LD":0,"DT":0,"MD":0}'::jsonb,
      current_land TEXT DEFAULT 'dolina_selfie',
      completed_lands JSONB DEFAULT '[]'::jsonb,
      choices_log JSONB DEFAULT '[]'::jsonb,
      final_profile JSONB,
      archetype TEXT,
      archetype_assigned_at TIMESTAMPTZ,
      onboarding_answers JSONB DEFAULT '[]'::jsonb,
      lifetime_scores JSONB DEFAULT '{"EM":0,"ST":0,"KR":0,"LD":0,"DT":0,"MD":0}'::jsonb,
      current_cycle_id TEXT,
      current_chapter TEXT,
      backpack JSONB DEFAULT '[]'::jsonb,
      gm_persona_id TEXT,
      registered_at TIMESTAMPTZ DEFAULT NOW(),
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS cycles (
      id TEXT PRIMARY KEY,
      player_id TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
      cycle_number INTEGER NOT NULL,
      started_at TIMESTAMPTZ NOT NULL,
      friday_deadline TIMESTAMPTZ NOT NULL,
      status TEXT DEFAULT 'active',
      cycle_summary JSONB,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS missions (
      id TEXT PRIMARY KEY,
      cycle_id TEXT NOT NULL REFERENCES cycles(id) ON DELETE CASCADE,
      player_id TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      narrative_intro TEXT,
      competency_focus JSONB DEFAULT '[]'::jsonb,
      proof_type TEXT DEFAULT 'conversation',
      estimated_minutes INTEGER DEFAULT 15,
      safety_notes TEXT,
      status TEXT DEFAULT 'pending',
      submitted_proof JSONB,
      gm_verification JSONB,
      artifact_reward JSONB,
      generated_at TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS gm_accounts (
      id TEXT PRIMARY KEY,
      role TEXT NOT NULL CHECK (role IN ('parent','teacher')),
      name TEXT NOT NULL,
      email TEXT,
      gm_persona_id TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS gm_pairings (
      id TEXT PRIMARY KEY,
      gm_account_id TEXT NOT NULL REFERENCES gm_accounts(id) ON DELETE CASCADE,
      player_id TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
      paired_at TIMESTAMPTZ DEFAULT NOW(),
      pairing_code TEXT,
      UNIQUE(gm_account_id, player_id)
    );
    CREATE TABLE IF NOT EXISTS pairing_codes (
      code TEXT PRIMARY KEY,
      player_id TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
      issued_by_account_id TEXT,
      role_for TEXT NOT NULL CHECK (role_for IN ('parent','teacher')),
      expires_at TIMESTAMPTZ NOT NULL,
      used_by_account_id TEXT,
      used_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    -- System par "Rozdarta Mapa" - 15 statycznych definicji par archetypow + dynamiczne assignmenty
    CREATE TABLE IF NOT EXISTS pair_assignments (
      id TEXT PRIMARY KEY,
      pair_definition_id INTEGER NOT NULL,         -- 1..15, FK do PAIR_DEFINITIONS w kodzie
      player_a_id TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
      player_b_id TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
      gm_account_id TEXT REFERENCES gm_accounts(id) ON DELETE SET NULL,
      status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','matched','completed')),
      matched_at TIMESTAMPTZ,
      completed_at TIMESTAMPTZ,
      proof JSONB,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_pair_assignments_player_a ON pair_assignments(player_a_id);
    CREATE INDEX IF NOT EXISTS idx_pair_assignments_player_b ON pair_assignments(player_b_id);
    CREATE INDEX IF NOT EXISTS idx_pair_assignments_gm ON pair_assignments(gm_account_id);
    CREATE INDEX IF NOT EXISTS idx_pair_assignments_status ON pair_assignments(status);

    -- Mentor: Google identity (1 do 1 z gm_accounts)
    CREATE TABLE IF NOT EXISTS google_identities (
      gm_account_id TEXT PRIMARY KEY REFERENCES gm_accounts(id) ON DELETE CASCADE,
      google_sub TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL,
      picture TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_google_identities_email ON google_identities(email);

    -- Mentor: aktywne sesje (JWT hash do unievazniania)
    CREATE TABLE IF NOT EXISTS mentor_sessions (
      id TEXT PRIMARY KEY,
      gm_account_id TEXT NOT NULL REFERENCES gm_accounts(id) ON DELETE CASCADE,
      token_hash TEXT NOT NULL UNIQUE,
      expires_at TIMESTAMPTZ NOT NULL,
      user_agent TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      last_used_at TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_mentor_sessions_gm ON mentor_sessions(gm_account_id);
    CREATE INDEX IF NOT EXISTS idx_mentor_sessions_expires ON mentor_sessions(expires_at);

    -- Klasy mentora
    CREATE TABLE IF NOT EXISTS mentor_classes (
      id TEXT PRIMARY KEY,
      gm_account_id TEXT NOT NULL REFERENCES gm_accounts(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      description TEXT,
      invite_code TEXT NOT NULL UNIQUE,
      invite_code_expires_at TIMESTAMPTZ,
      max_students INTEGER DEFAULT 30,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      archived_at TIMESTAMPTZ
    );
    CREATE INDEX IF NOT EXISTS idx_mentor_classes_gm ON mentor_classes(gm_account_id);
    CREATE INDEX IF NOT EXISTS idx_mentor_classes_invite ON mentor_classes(invite_code);

    -- Whitelist emaili mentorow (kto moze zalozyc konto przez OAuth)
    CREATE TABLE IF NOT EXISTS mentor_whitelist (
      email TEXT PRIMARY KEY,
      added_by_gm_account_id TEXT REFERENCES gm_accounts(id) ON DELETE SET NULL,
      added_at TIMESTAMPTZ DEFAULT NOW(),
      note TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_mentor_whitelist_added_by ON mentor_whitelist(added_by_gm_account_id);

    -- Czlonkostwo ucznia w klasie
    CREATE TABLE IF NOT EXISTS class_memberships (
      id TEXT PRIMARY KEY,
      class_id TEXT NOT NULL REFERENCES mentor_classes(id) ON DELETE CASCADE,
      player_id TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
      joined_at TIMESTAMPTZ DEFAULT NOW(),
      left_at TIMESTAMPTZ,
      UNIQUE(class_id, player_id)
    );
    CREATE INDEX IF NOT EXISTS idx_class_memberships_class ON class_memberships(class_id);
    CREATE INDEX IF NOT EXISTS idx_class_memberships_player ON class_memberships(player_id);

    -- Demo player: mentor moze testowac jako dziecko bez ingerencji w klasy/pary
    ALTER TABLE players ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT FALSE;
    ALTER TABLE players ADD COLUMN IF NOT EXISTS created_by_gm_account_id TEXT REFERENCES gm_accounts(id) ON DELETE SET NULL;
    -- Coiny: licznik widoczny w TopBar. Quiz daje +50, kazda misja +10. Niezalezne od lifetime_scores (cech).
    ALTER TABLE players ADD COLUMN IF NOT EXISTS coins INTEGER DEFAULT 0;
    -- Login code: krotki kod do recznego wpisania w celu odzyskania konta (gdy localStorage znika).
    -- Format: 6 znakow z alfabetu bez 0/O/1/I (np. HQ7K2P). Unikalny.
    ALTER TABLE players ADD COLUMN IF NOT EXISTS login_code TEXT UNIQUE;
    CREATE INDEX IF NOT EXISTS idx_players_demo_owner ON players(created_by_gm_account_id) WHERE is_demo = TRUE;
    CREATE INDEX IF NOT EXISTS idx_players_login_code ON players(login_code) WHERE login_code IS NOT NULL;

    -- Mentor hints: artefakty/podpowiedzi wyslane przez mentora do ucznia
    CREATE TABLE IF NOT EXISTS mentor_hints (
      id TEXT PRIMARY KEY,
      gm_account_id TEXT NOT NULL REFERENCES gm_accounts(id) ON DELETE CASCADE,
      player_id TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
      kind TEXT NOT NULL DEFAULT 'hint' CHECK (kind IN ('hint','artifact','message')),
      title TEXT,
      body TEXT NOT NULL,
      sent_at TIMESTAMPTZ DEFAULT NOW(),
      viewed_at TIMESTAMPTZ
    );
    CREATE INDEX IF NOT EXISTS idx_mentor_hints_player ON mentor_hints(player_id);
    CREATE INDEX IF NOT EXISTS idx_mentor_hints_gm ON mentor_hints(gm_account_id);

    -- Migracja: rozszerz CHECK constraint o nowe kinds 'task' (mentor stworzyl misje)
    -- i 'reward' (mentor zatwierdzil misje, uczen dostaje powiadomienie o coinach).
    DO $$
    BEGIN
      ALTER TABLE mentor_hints DROP CONSTRAINT IF EXISTS mentor_hints_kind_check;
      ALTER TABLE mentor_hints ADD CONSTRAINT mentor_hints_kind_check
        CHECK (kind IN ('hint','artifact','message','task','reward'));
    EXCEPTION WHEN OTHERS THEN
      -- constraint juz w docelowym stanie albo brak uprawnien - ignoruj
      NULL;
    END $$;

    -- Porady dnia (z dailyTipsData.js) - tracking ktore widzial gracz, persist miedzy urzadzeniami.
    -- Klucz zlozony (player_id, tip_id) - jeden wpis per porada per gracz.
    CREATE TABLE IF NOT EXISTS viewed_tips (
      player_id TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
      tip_id TEXT NOT NULL,
      viewed_at TIMESTAMPTZ DEFAULT NOW(),
      PRIMARY KEY (player_id, tip_id)
    );
    CREATE INDEX IF NOT EXISTS idx_viewed_tips_player ON viewed_tips(player_id);
  `);
}

export async function initDatabase() {
  const pool = getPool();
  if (!_schemaReady) {
    _schemaReady = ensureSchema(pool);
  }
  await _schemaReady;
  return pool;
}

// helper: rozpakuj wiersz gracza do struktury V2
function mapPlayerRow(row) {
  if (!row) return null;
  return {
    player_id: row.id,
    player_name: row.name,
    avatar: row.avatar || {},
    scores: row.scores || { EM: 0, ST: 0, KR: 0, LD: 0, DT: 0, MD: 0 },
    current_land: row.current_land,
    completed_lands: row.completed_lands || [],
    choices_log: row.choices_log || [],
    final_profile: row.final_profile || null,
    archetype: row.archetype || null,
    archetype_assigned_at: row.archetype_assigned_at,
    onboarding_answers: row.onboarding_answers || [],
    lifetime_scores: row.lifetime_scores || { EM: 0, ST: 0, KR: 0, LD: 0, DT: 0, MD: 0 },
    coins: row.coins || 0,
    login_code: row.login_code || null,
    current_cycle_id: row.current_cycle_id || null,
    current_chapter: row.current_chapter || null,
    backpack: row.backpack || [],
    gm_persona_id: row.gm_persona_id || null,
    registered_at: row.registered_at,
  };
}

export async function getPlayer(_unused, playerId) {
  const pool = await initDatabase();
  const { rows } = await pool.query("SELECT * FROM players WHERE id=$1", [playerId]);
  const player = mapPlayerRow(rows[0]);
  // Lazy backfill: jezeli istniejacy gracz nie ma jeszcze login_code, wygeneruj i zapisz.
  if (player && !player.login_code) {
    const code = await generateUniqueLoginCode(pool);
    await pool.query("UPDATE players SET login_code=$1 WHERE id=$2", [code, playerId]);
    player.login_code = code;
  }
  return player;
}

// Krotki kod logowania ucznia: 6 znakow z alfabetu bez 0/O/1/I (latwy do dyktowania dziecku).
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
function randomLoginCode(len = 6) {
  let s = "";
  for (let i = 0; i < len; i++) s += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
  return s;
}

export async function generateUniqueLoginCode(poolArg, maxAttempts = 8) {
  const pool = poolArg || (await initDatabase());
  for (let i = 0; i < maxAttempts; i++) {
    const code = randomLoginCode(6);
    const { rows } = await pool.query("SELECT 1 FROM players WHERE login_code=$1 LIMIT 1", [code]);
    if (!rows.length) return code;
  }
  // Fallback: 8-znakowy, prawie na pewno unikalny
  return randomLoginCode(8);
}

export async function findPlayerByLoginCode(code) {
  if (!code) return null;
  const pool = await initDatabase();
  const normalized = String(code).toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (normalized.length < 4) return null;
  const { rows } = await pool.query("SELECT * FROM players WHERE login_code=$1 LIMIT 1", [normalized]);
  return mapPlayerRow(rows[0]);
}

export async function savePlayer(_unused, profile) {
  const pool = await initDatabase();
  // Wygeneruj login_code dla nowych graczy (lub uzyj istniejacego z profile).
  // ON CONFLICT (id) DO UPDATE nie nadpisuje login_code zeby istniejacy zostal.
  const loginCode = profile.login_code || await generateUniqueLoginCode(pool);
  await pool.query(
    `INSERT INTO players (
       id, name, avatar, scores, current_land, completed_lands, choices_log,
       final_profile, archetype, archetype_assigned_at, onboarding_answers,
       lifetime_scores, current_cycle_id, current_chapter, backpack, gm_persona_id, coins, login_code, updated_at
     ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,NOW())
     ON CONFLICT (id) DO UPDATE SET
       name=EXCLUDED.name,
       avatar=EXCLUDED.avatar,
       scores=EXCLUDED.scores,
       current_land=EXCLUDED.current_land,
       completed_lands=EXCLUDED.completed_lands,
       choices_log=EXCLUDED.choices_log,
       final_profile=EXCLUDED.final_profile,
       archetype=EXCLUDED.archetype,
       archetype_assigned_at=EXCLUDED.archetype_assigned_at,
       onboarding_answers=EXCLUDED.onboarding_answers,
       lifetime_scores=EXCLUDED.lifetime_scores,
       current_cycle_id=EXCLUDED.current_cycle_id,
       current_chapter=EXCLUDED.current_chapter,
       backpack=EXCLUDED.backpack,
       gm_persona_id=EXCLUDED.gm_persona_id,
       coins=EXCLUDED.coins,
       login_code=COALESCE(players.login_code, EXCLUDED.login_code),
       updated_at=NOW()`,
    [
      profile.player_id,
      profile.player_name,
      J(profile.avatar || {}),
      J(profile.scores || { EM: 0, ST: 0, KR: 0, LD: 0, DT: 0, MD: 0 }),
      profile.current_land || null,
      J(profile.completed_lands || []),
      J(profile.choices_log || []),
      J(profile.final_profile),
      profile.archetype || null,
      profile.archetype_assigned_at || null,
      J(profile.onboarding_answers || []),
      J(profile.lifetime_scores || { EM: 0, ST: 0, KR: 0, LD: 0, DT: 0, MD: 0 }),
      profile.current_cycle_id || null,
      profile.current_chapter || null,
      J(profile.backpack || []),
      profile.gm_persona_id || null,
      profile.coins || 0,
      loginCode,
    ]
  );
}

function nextFriday(fromDateIso) {
  const d = fromDateIso ? new Date(fromDateIso) : new Date();
  const day = d.getDay();
  let delta = (5 - day + 7) % 7;
  if (delta === 0) delta = 7;
  d.setDate(d.getDate() + delta);
  d.setHours(20, 0, 0, 0);
  return d.toISOString();
}
export { nextFriday };

export async function createCycle(_unused, playerId) {
  const pool = await initDatabase();
  const id = `cyc_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const startedAt = new Date().toISOString();
  const fridayDeadline = nextFriday(startedAt);
  const { rows: countRows } = await pool.query(
    "SELECT COUNT(*)::int AS c FROM cycles WHERE player_id=$1",
    [playerId]
  );
  const cycleNumber = (countRows[0]?.c || 0) + 1;
  await pool.query(
    `INSERT INTO cycles (id, player_id, cycle_number, started_at, friday_deadline, status)
     VALUES ($1,$2,$3,$4,$5,'active')`,
    [id, playerId, cycleNumber, startedAt, fridayDeadline]
  );
  await pool.query("UPDATE players SET current_cycle_id=$1 WHERE id=$2", [id, playerId]);
  return { cycle_id: id, player_id: playerId, cycle_number: cycleNumber, started_at: startedAt, friday_deadline: fridayDeadline, status: "active" };
}

export async function getCurrentCycle(_unused, playerId) {
  const pool = await initDatabase();
  const { rows } = await pool.query(
    "SELECT * FROM cycles WHERE player_id=$1 AND status='active' ORDER BY cycle_number DESC LIMIT 1",
    [playerId]
  );
  const row = rows[0];
  if (!row) return null;
  return {
    cycle_id: row.id,
    player_id: row.player_id,
    cycle_number: row.cycle_number,
    started_at: row.started_at,
    friday_deadline: row.friday_deadline,
    status: row.status,
    cycle_summary: row.cycle_summary || null,
  };
}

export async function closeCycle(_unused, cycleId, summary) {
  const pool = await initDatabase();
  await pool.query("UPDATE cycles SET status='closed', cycle_summary=$1 WHERE id=$2", [J(summary || {}), cycleId]);
}

function mapMissionRow(row) {
  if (!row) return null;
  return {
    mission_id: row.id,
    cycle_id: row.cycle_id,
    player_id: row.player_id,
    title: row.title,
    body: row.body,
    narrative_intro: row.narrative_intro,
    competency_focus: row.competency_focus || [],
    proof_type: row.proof_type,
    estimated_minutes: row.estimated_minutes,
    safety_notes: row.safety_notes,
    status: row.status,
    submitted_proof: row.submitted_proof || null,
    gm_verification: row.gm_verification || null,
    artifact_reward: row.artifact_reward || null,
    generated_at: row.generated_at,
  };
}

export async function createMission(_unused, mission) {
  const pool = await initDatabase();
  const id = mission.mission_id || `mis_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  await pool.query(
    `INSERT INTO missions (id, cycle_id, player_id, title, body, narrative_intro, competency_focus, proof_type, estimated_minutes, safety_notes, status)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'pending')`,
    [id, mission.cycle_id, mission.player_id, mission.title, mission.body, mission.narrative_intro || null, J(mission.competency_focus || []), mission.proof_type || "conversation", mission.estimated_minutes || 15, mission.safety_notes || null]
  );
  return { ...mission, mission_id: id };
}

export async function getMission(_unused, missionId) {
  const pool = await initDatabase();
  const { rows } = await pool.query("SELECT * FROM missions WHERE id=$1", [missionId]);
  return mapMissionRow(rows[0]);
}

export async function getCurrentMission(_unused, playerId) {
  const pool = await initDatabase();
  // Wlaczamy 'rejected' - uczen widzi misje "do doprawki" zeby moc poprawic.
  // 'verified' nie pokazujemy - to konczy cykl (lub generuje nowa misje).
  const { rows } = await pool.query(
    "SELECT * FROM missions WHERE player_id=$1 AND status IN ('pending','submitted','rejected') ORDER BY generated_at DESC LIMIT 1",
    [playerId]
  );
  return mapMissionRow(rows[0]);
}

export async function submitMissionProof(_unused, missionId, proof) {
  const pool = await initDatabase();
  await pool.query("UPDATE missions SET status='submitted', submitted_proof=$1 WHERE id=$2", [J(proof), missionId]);
}

export async function verifyMission(_unused, missionId, verification) {
  const pool = await initDatabase();
  const verdict = verification.verdict || "approved";
  const newStatus = verdict === "highlighted" ? "highlighted" : verdict === "needs_followup" ? "needs_followup" : "verified";
  await pool.query("UPDATE missions SET status=$1, gm_verification=$2 WHERE id=$3", [newStatus, J(verification), missionId]);
}

export async function getMissionQueueForGM(_unused, gmAccountId) {
  const pool = await initDatabase();
  const { rows } = await pool.query(
    `SELECT m.* FROM missions m
     INNER JOIN gm_pairings p ON p.player_id = m.player_id
     WHERE p.gm_account_id=$1 AND m.status='submitted'
     ORDER BY m.generated_at ASC`,
    [gmAccountId]
  );
  return rows.map(mapMissionRow);
}

export async function createGMAccount(_unused, account) {
  const pool = await initDatabase();
  await pool.query(
    "INSERT INTO gm_accounts (id, role, name, email, gm_persona_id) VALUES ($1,$2,$3,$4,$5)",
    [account.account_id, account.role, account.name, account.email || null, account.gm_persona_id]
  );
  return account;
}

export async function getGMAccount(_unused, accountId) {
  const pool = await initDatabase();
  const { rows } = await pool.query("SELECT * FROM gm_accounts WHERE id=$1", [accountId]);
  const row = rows[0];
  if (!row) return null;
  const { rows: pairs } = await pool.query("SELECT player_id FROM gm_pairings WHERE gm_account_id=$1", [accountId]);
  return {
    account_id: row.id,
    role: row.role,
    name: row.name,
    email: row.email,
    gm_persona_id: row.gm_persona_id,
    paired_player_ids: pairs.map((p) => p.player_id),
    created_at: row.created_at,
  };
}

export async function pairGMWithPlayer(_unused, gmAccountId, playerId, pairingCode) {
  const pool = await initDatabase();
  const id = `pair_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  await pool.query(
    "INSERT INTO gm_pairings (id, gm_account_id, player_id, pairing_code) VALUES ($1,$2,$3,$4) ON CONFLICT (gm_account_id, player_id) DO NOTHING",
    [id, gmAccountId, playerId, pairingCode || null]
  );
}

export async function issuePairingCode(_unused, playerId, role, issuedByAccountId) {
  const pool = await initDatabase();
  const code = Math.random().toString(36).slice(2, 8).toUpperCase();
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  await pool.query(
    "INSERT INTO pairing_codes (code, player_id, issued_by_account_id, role_for, expires_at) VALUES ($1,$2,$3,$4,$5)",
    [code, playerId, issuedByAccountId || null, role, expires]
  );
  return { code, player_id: playerId, role_for: role, expires_at: expires };
}

export async function consumePairingCode(_unused, code, accountId) {
  const pool = await initDatabase();
  const { rows } = await pool.query(
    "SELECT * FROM pairing_codes WHERE code=$1 AND used_by_account_id IS NULL",
    [code]
  );
  const row = rows[0];
  if (!row) return null;
  if (new Date(row.expires_at).getTime() < Date.now()) return null;
  await pool.query("UPDATE pairing_codes SET used_by_account_id=$1, used_at=NOW() WHERE code=$2", [accountId, code]);
  return { player_id: row.player_id, role_for: row.role_for };
}

export async function getBackpack(_unused, playerId) {
  const pool = await initDatabase();
  const { rows } = await pool.query("SELECT backpack FROM players WHERE id=$1", [playerId]);
  return rows[0]?.backpack || [];
}

export async function addArtifactToBackpack(_unused, playerId, artifact) {
  const pool = await initDatabase();
  const current = await getBackpack(null, playerId);
  current.push({
    artifact_id: artifact.artifact_id,
    artifact_name: artifact.artifact_name,
    awarded_at: new Date().toISOString(),
    cycle_id: artifact.cycle_id || null,
  });
  await pool.query("UPDATE players SET backpack=$1 WHERE id=$2", [J(current), playerId]);
  return current;
}
