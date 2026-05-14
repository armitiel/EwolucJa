/**
 * classService — klasy mentora + kody zaproszen + membership.
 *
 * Kody zaproszen: format SLOWO-SLOWO-SLOWO (3 losowe slowa ze slownika).
 * ~1000 slow w slowniku -> ~10^9 kombinacji, latwe do podyktowania rodzicowi.
 * Domyslna waznosc: 30 dni od stworzenia.
 */

import { randomUUID, randomBytes } from "node:crypto";
import { initDatabase } from "../database/db.js";

const DEFAULT_CODE_DAYS = 30;
const DEFAULT_MAX_STUDENTS = 30;

// Slownik 3-slowowy: prosta, neutralne, latwo wymawialne (dla rodzicow PL/EN)
// Lista ~140 slow z 3 kategorii -> ~140^3 = ~2.7M kombinacji, wystarczy na MVP
const WORDS = [
  // Zwierzeta (40)
  "WYDRA","BOBR","KOT","LIS","WILK","SARNA","ZAJAC","ORZEL","SOWA","JEZ",
  "JELEN","NIEDZWIEDZ","RYS","ZUBR","KUNA","PUMA","TYGRYS","LWICA","GEPARD","KOALA",
  "PANDA","DELFIN","WALEN","OKON","KARP","SZCZUPAK","REKIN","BIEDRONKA","MOTYL","SOWKA",
  "JASTRZAB","KRUK","WROBEL","SIKORKA","BOCIAN","CZAPLA","KACZKA","GES","LABEDZ","KOLIBER",
  // Kolory (30)
  "ZIELONA","CZERWONA","NIEBIESKA","ZOLTA","FIOLETOWA","POMARANCZOWA","ROZOWA","TURKUSOWA","BORDOWA","BEZOWA",
  "ZLOTA","SREBRNA","MIEDZIANA","KOBALTOWA","KARMINOWA","SZAFIROWA","SZMARAGDOWA","BIALA","CIEMNA","JASNA",
  "WISNIOWA","MIETOWA","LAWENDOWA","BURSZTYNOWA","KORALOWA","INDYGOWA","OLIWKOWA","PURPUROWA","KREMOWA","KASZTANOWA",
  // Magiczne/przygody (40)
  "GWIAZDA","KSIEZYC","SLONCE","TECZA","BLYSKAWICA","BURZA","CHMURA","DESZCZ","SNIEG","LODOWIEC",
  "GORA","RZEKA","JEZIORO","OCEAN","WYSPA","LAS","POLANA","DOLINA","ZAMEK","WIEZA",
  "MOSTEK","SCIEZKA","SZLAK","MAPA","KOMPAS","LATARNIA","KLUCZ","SKRZYNIA","SKARB","ZWOJ",
  "PERLA","KRYSZTAL","RUBIN","SZAFIR","DIAMENT","AMETYST","TOPAZ","BURSZTYN","OPAL","ZIRKON",
  // Cechy bohatera (30)
  "ODWAZNA","MADRA","SZYBKA","SILNA","ZRECZNA","CZUJNA","SPOKOJNA","RADOSNA","UWAZNA","CZULA",
  "WIERNA","BYSTRA","BACZNA","SLUSZNA","HOJNA","CIERPLIWA","PRAWA","SZCZERA","SKROMNA","DZIELNA",
  "WYTRWALA","WOLNA","JASNA","CICHA","GLOSNA","WESOLA","DOBRA","BLISKA","DALEKA","WSPANIALA",
];

function pickWord() {
  // Bezpieczny randomInt z randomBytes (crypto, nie Math.random)
  const idx = randomBytes(2).readUInt16BE(0) % WORDS.length;
  return WORDS[idx];
}

/** Generuj kod typu "ZIELONA-WYDRA-MAPA". 3 slowa z duzych liter. */
export function generateInviteCode() {
  return `${pickWord()}-${pickWord()}-${pickWord()}`;
}

/** Wygeneruj UNIKALNY kod (sprawdza kolizje w DB, max 5 prob). */
export async function generateUniqueInviteCode() {
  const pool = await initDatabase();
  for (let i = 0; i < 5; i++) {
    const code = generateInviteCode();
    const { rows } = await pool.query(
      `SELECT 1 FROM mentor_classes WHERE invite_code = $1 LIMIT 1`,
      [code]
    );
    if (!rows.length) return code;
  }
  // Fallback: dorzuc randomowy sufiks
  return `${generateInviteCode()}-${randomBytes(2).toString("hex").toUpperCase()}`;
}

/** Stworz klase. */
export async function createClass({ gmAccountId, name, description = null, maxStudents = DEFAULT_MAX_STUDENTS }) {
  if (!gmAccountId) throw new Error("gmAccountId wymagane");
  if (!name?.trim()) throw new Error("Nazwa klasy wymagana");
  const pool = await initDatabase();
  const id = randomUUID();
  const inviteCode = await generateUniqueInviteCode();
  const expiresAt = new Date(Date.now() + DEFAULT_CODE_DAYS * 86400000);
  await pool.query(
    `INSERT INTO mentor_classes
       (id, gm_account_id, name, description, invite_code, invite_code_expires_at, max_students)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [id, gmAccountId, name.trim(), description, inviteCode, expiresAt, maxStudents]
  );
  return { id, name: name.trim(), description, invite_code: inviteCode, invite_code_expires_at: expiresAt, max_students: maxStudents };
}

/** Lista klas mentora (bez zarchiwizowanych). */
export async function listMentorClasses(gmAccountId) {
  const pool = await initDatabase();
  const { rows } = await pool.query(
    `SELECT mc.*,
            (SELECT COUNT(*) FROM class_memberships cm WHERE cm.class_id = mc.id AND cm.left_at IS NULL) AS student_count
       FROM mentor_classes mc
       WHERE mc.gm_account_id = $1 AND mc.archived_at IS NULL
       ORDER BY mc.created_at DESC`,
    [gmAccountId]
  );
  return rows.map(rowToClass);
}

/** Szczegoly klasy + lista uczniow (z polami: name, archetype, last_activity, last_mission_status). */
export async function getClassDetail(gmAccountId, classId) {
  const pool = await initDatabase();
  const { rows: classRows } = await pool.query(
    `SELECT * FROM mentor_classes WHERE id = $1 AND gm_account_id = $2`,
    [classId, gmAccountId]
  );
  if (!classRows.length) return null;
  const cls = rowToClass(classRows[0]);

  const { rows: students } = await pool.query(
    `SELECT p.id, p.name, p.archetype, p.scores, p.lifetime_scores,
            p.updated_at AS last_activity, cm.joined_at,
            (SELECT m.status FROM missions m WHERE m.player_id = p.id ORDER BY m.generated_at DESC LIMIT 1) AS last_mission_status,
            (SELECT m.title FROM missions m WHERE m.player_id = p.id ORDER BY m.generated_at DESC LIMIT 1) AS last_mission_title
       FROM class_memberships cm
       JOIN players p ON p.id = cm.player_id
       WHERE cm.class_id = $1 AND cm.left_at IS NULL
       ORDER BY cm.joined_at ASC`,
    [classId]
  );
  return { ...cls, students };
}

/** Regeneruj kod zaproszenia (np. po wycieku). */
export async function regenerateInviteCode(gmAccountId, classId) {
  const pool = await initDatabase();
  // weryfikuj ownership
  const { rows } = await pool.query(
    `SELECT id FROM mentor_classes WHERE id = $1 AND gm_account_id = $2`,
    [classId, gmAccountId]
  );
  if (!rows.length) throw new Error("Klasa nie znaleziona lub brak uprawnien");
  const newCode = await generateUniqueInviteCode();
  const expiresAt = new Date(Date.now() + DEFAULT_CODE_DAYS * 86400000);
  await pool.query(
    `UPDATE mentor_classes SET invite_code = $2, invite_code_expires_at = $3 WHERE id = $1`,
    [classId, newCode, expiresAt]
  );
  return { invite_code: newCode, invite_code_expires_at: expiresAt };
}

/**
 * Dolacz ucznia do klasy po kodzie. Zwroc {class_id, player_id} lub rzuc blad.
 * playerId podany = istniejacy gracz dolacza. playerId null = nowy gracz, utworzony tu.
 */
export async function joinClassByCode({ inviteCode, playerId = null, playerName = null }) {
  if (!inviteCode) throw new Error("Kod zaproszenia wymagany");
  const pool = await initDatabase();
  const code = inviteCode.trim().toUpperCase();

  const { rows: classRows } = await pool.query(
    `SELECT id, max_students, invite_code_expires_at, archived_at,
            (SELECT COUNT(*) FROM class_memberships cm WHERE cm.class_id = mc.id AND cm.left_at IS NULL) AS student_count
       FROM mentor_classes mc WHERE invite_code = $1`,
    [code]
  );
  if (!classRows.length) throw new Error("Niepoprawny kod zaproszenia");
  const cls = classRows[0];
  if (cls.archived_at) throw new Error("Klasa zarchiwizowana");
  if (cls.invite_code_expires_at && new Date(cls.invite_code_expires_at) < new Date()) {
    throw new Error("Kod zaproszenia wygasl. Poprosz mentora o nowy.");
  }
  if (cls.student_count >= cls.max_students) throw new Error("Klasa pelna");

  let resolvedPlayerId = playerId;

  if (!resolvedPlayerId) {
    if (!playerName?.trim()) throw new Error("Imie ucznia wymagane");
    resolvedPlayerId = randomUUID();
    await pool.query(
      `INSERT INTO players (id, name) VALUES ($1, $2)`,
      [resolvedPlayerId, playerName.trim()]
    );
  } else {
    // Sprawdz czy istnieje
    const { rows: pRows } = await pool.query(`SELECT id FROM players WHERE id = $1`, [resolvedPlayerId]);
    if (!pRows.length) throw new Error("Gracz nie istnieje");
  }

  // Insert membership (idempotent - UNIQUE(class_id, player_id))
  try {
    await pool.query(
      `INSERT INTO class_memberships (id, class_id, player_id) VALUES ($1, $2, $3)`,
      [randomUUID(), cls.id, resolvedPlayerId]
    );
  } catch (e) {
    if (!/duplicate key/i.test(e.message)) throw e;
  }

  return { class_id: cls.id, player_id: resolvedPlayerId };
}

function rowToClass(row) {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    invite_code: row.invite_code,
    invite_code_expires_at: row.invite_code_expires_at,
    max_students: row.max_students,
    student_count: Number(row.student_count || 0),
    created_at: row.created_at,
    archived_at: row.archived_at,
  };
}
