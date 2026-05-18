/**
 * pairsService — logika biznesowa systemu par ("Rozdarta Mapa").
 *
 * Glowne operacje:
 *   - assignPair(playerA, playerB, pairDefId, gmAccountId?)  -> tworzy assignment
 *   - getActiveAssignmentForPlayer(playerId)                  -> aktualne dla ucznia
 *   - getMyKeywordView(playerId)                              -> co ma widziec uczen (slowo + podpowiedz partnera)
 *   - verifyKeyword(playerId, fullKeyword)                    -> sprawdzenie hasla -> zwrot zadania
 *   - markCompleted(assignmentId, proof?)                     -> zamknij zadanie
 *
 * Status assignment: 'pending' (oboje nie wpisali) -> 'matched' (po wpisaniu hasla) -> 'completed'
 */

import { randomUUID } from "node:crypto";
import { initDatabase } from "../database/db.js";
import { PAIR_DEFINITIONS, findPairByKeyword, normalizeKeyword } from "../data/pairDefinitions.js";

// Helper: pobierz pool. Argumenty `db` w funkcjach sa ignorowane (legacy from API signatures).
async function pool() {
  return await initDatabase();
}

/** Zwroc definicje pary po ID (1-15). */
export function getPairDefinition(id) {
  return PAIR_DEFINITIONS.find((p) => p.id === Number(id)) || null;
}

/** Lista wszystkich definicji - dla GM panel. */
export function listPairDefinitions() {
  return PAIR_DEFINITIONS.map((p) => ({
    id: p.id,
    archetype_a: p.archetype_a,
    archetype_b: p.archetype_b,
    word_a: p.word_a,
    word_b: p.word_b,
    full_keyword: p.full_keyword,
    task_title: p.task_title,
  }));
}

/**
 * Utworz assignment: dwoch graczy + definicja pary.
 * playerA dostaje word_a, playerB dostaje word_b.
 */
export async function assignPair(_db, { playerAId, playerBId, pairDefinitionId, gmAccountId = null }) {
  const def = getPairDefinition(pairDefinitionId);
  if (!def) throw new Error(`Unknown pair_definition_id: ${pairDefinitionId}`);
  if (playerAId === playerBId) throw new Error("Player A and Player B cannot be the same");

  const p = await pool();
  const id = randomUUID();
  await p.query(
    `INSERT INTO pair_assignments
       (id, pair_definition_id, player_a_id, player_b_id, gm_account_id, status, created_at)
     VALUES ($1, $2, $3, $4, $5, 'pending', NOW())`,
    [id, def.id, playerAId, playerBId, gmAccountId]
  );
  return { id, pair_definition_id: def.id, status: "pending" };
}

/** Aktywny assignment (pending lub matched) dla danego gracza, jako A LUB B. */
export async function getActiveAssignmentForPlayer(_db, playerId) {
  const p = await pool();
  const { rows } = await p.query(
    `SELECT * FROM pair_assignments
       WHERE (player_a_id = $1 OR player_b_id = $1)
         AND status IN ('pending', 'matched')
       ORDER BY created_at DESC
       LIMIT 1`,
    [playerId]
  );
  if (!rows.length) return null;
  const row = rows[0];
  const def = getPairDefinition(row.pair_definition_id);
  return { ...row, definition: def };
}

/**
 * Widok dla ucznia PRZED matchem:
 *   - jego slowo (A lub B)
 *   - archetyp partnera jako podpowiedz (np. "Strateg")
 *   - status (pending / matched / completed)
 *   - jezeli matched: zadanie + role-specific instructions
 */
export async function getMyKeywordView(_db, playerId) {
  const assignment = await getActiveAssignmentForPlayer(null, playerId);
  if (!assignment) return { has_pair: false };

  const def = assignment.definition;
  const iAmA = assignment.player_a_id === playerId;
  const myWord = iAmA ? def.word_a : def.word_b;
  const partnerArchetype = iAmA ? def.archetype_b : def.archetype_a;
  const myInstruction = iAmA ? def.instructions_a : def.instructions_b;

  const base = {
    has_pair: true,
    assignment_id: assignment.id,
    status: assignment.status,
    my_word: myWord,
    partner_archetype: partnerArchetype,
    pair_definition_id: def.id,
  };

  if (assignment.status === "matched" || assignment.status === "completed") {
    return {
      ...base,
      task_title: def.task_title,
      task_body: def.task_body,
      my_instruction: myInstruction,
      full_keyword: def.full_keyword, // ujawniamy po matchu - nie wczesniej
    };
  }
  return base;
}

/**
 * Sprawdz wpisane haslo. Jezeli zgadza sie z full_keyword w assignment -> zaznacz matched.
 * Zwroc {ok, task?, instruction?}.
 */
export async function verifyKeyword(_db, playerId, text) {
  const assignment = await getActiveAssignmentForPlayer(null, playerId);
  if (!assignment) return { ok: false, reason: "no_assignment" };
  if (assignment.status === "completed") return { ok: false, reason: "already_completed" };

  const def = assignment.definition;
  const normalized = normalizeKeyword(text);
  const expected = normalizeKeyword(def.full_keyword);

  if (normalized !== expected) {
    return { ok: false, reason: "wrong_keyword" };
  }

  // Match!
  if (assignment.status === "pending") {
    const p = await pool();
    await p.query(
      `UPDATE pair_assignments SET status = 'matched', matched_at = NOW() WHERE id = $1`,
      [assignment.id]
    );
  }

  const iAmA = assignment.player_a_id === playerId;
  return {
    ok: true,
    assignment_id: assignment.id,
    task_title: def.task_title,
    task_body: def.task_body,
    my_instruction: iAmA ? def.instructions_a : def.instructions_b,
    partner_archetype: iAmA ? def.archetype_b : def.archetype_a,
    full_keyword: def.full_keyword,
  };
}

/** Oznacz zadanie jako wykonane + nagrodz obu graczy w parze. */
export async function markCompleted(_db, assignmentId, proof = null, points = 20) {
  const p = await pool();
  // 1) Update status + proof
  const { rows: assignRows } = await p.query(
    `UPDATE pair_assignments
       SET status = 'completed', completed_at = NOW(), proof = $2
       WHERE id = $1
       RETURNING player_a_id, player_b_id`,
    [assignmentId, proof ? JSON.stringify(proof) : null]
  );
  if (!assignRows.length) return { ok: false, reason: "assignment_not_found" };

  // 2) Nagroda dla obu graczy (custom points, clamp 15-35). Domyslnie 20.
  const award = Math.max(15, Math.min(35, Number(points) || 20));
  const playerIds = [assignRows[0].player_a_id, assignRows[0].player_b_id].filter(Boolean);
  for (const pid of playerIds) {
    await p.query(
      `UPDATE players SET coins = COALESCE(coins, 0) + $1, updated_at = NOW() WHERE id = $2`,
      [award, pid]
    );
  }
  return { ok: true, awarded: award, players: playerIds };
}

/**
 * Greedy matching uczniow w klasie do 15 par archetypicznych.
 * Idzie po definicjach 1..15 i bierze pierwszych dostepnych uczniow.
 * Zwraca {suggestions: [{playerA, playerB, pairDefinitionId, definition}], unpaired: [...]}
 */
export async function suggestPairsForClass(classId) {
  const pool = await pool_internal();
  const { rows: students } = await pool.query(
    `SELECT p.id, p.name, p.archetype
       FROM class_memberships cm
       JOIN players p ON p.id = cm.player_id
       WHERE cm.class_id = $1 AND cm.left_at IS NULL AND p.archetype IS NOT NULL`,
    [classId]
  );

  // Pulle per-archetyp (kopia listy, by mozna bylo wyciagac)
  const pool_byArch = { EM: [], ST: [], KR: [], LD: [], DT: [], MD: [] };
  for (const s of students) {
    if (pool_byArch[s.archetype]) pool_byArch[s.archetype].push(s);
  }

  const suggestions = [];
  for (const def of PAIR_DEFINITIONS) {
    const aPool = pool_byArch[def.archetype_a];
    const bPool = pool_byArch[def.archetype_b];
    if (!aPool || !bPool) continue;
    if (aPool.length === 0 || bPool.length === 0) continue;
    // Wez pierwszych. Jezeli archetypy te same i pool ma mniej niz 2 - skip.
    const playerA = aPool.shift();
    if (def.archetype_a === def.archetype_b && bPool.length === 0) {
      aPool.unshift(playerA); // odloz z powrotem
      continue;
    }
    const playerB = bPool.shift();
    suggestions.push({
      pair_definition_id: def.id,
      definition: def,
      player_a: { id: playerA.id, name: playerA.name, archetype: playerA.archetype },
      player_b: { id: playerB.id, name: playerB.name, archetype: playerB.archetype },
    });
  }

  // Pozostali bez pary
  const unpaired = [];
  for (const arch of Object.keys(pool_byArch)) {
    for (const s of pool_byArch[arch]) {
      unpaired.push({ id: s.id, name: s.name, archetype: s.archetype });
    }
  }

  // Uczniowie bez archetypu (jeszcze przed onboardingiem)
  const noArchetype = students.filter((s) => !s.archetype).map((s) => ({ id: s.id, name: s.name, archetype: null }));

  return { suggestions, unpaired, noArchetype, total_students: students.length };
}

// Helper dla suggestPairsForClass - getter dla pool poniewaz pool() jest juz uzyte powyzej w pliku
async function pool_internal() {
  const { initDatabase } = await import("../database/db.js");
  return await initDatabase();
}

/** Bulk assign - lista par naraz. Zwroc liste utworzonych assignmentow. */
export async function bulkAssignPairs(_db, assignments, gmAccountId = null) {
  const created = [];
  for (const a of assignments) {
    try {
      const result = await assignPair(null, {
        playerAId: a.player_a_id,
        playerBId: a.player_b_id,
        pairDefinitionId: a.pair_definition_id,
        gmAccountId,
      });
      created.push(result);
    } catch (e) {
      created.push({ error: e.message, ...a });
    }
  }
  return created;
}

/** Lista assignmentow w klasie/grupie (dla GM panel). */
export async function listAssignmentsForGm(_db, gmAccountId) {
  const p = await pool();
  const { rows } = await p.query(
    `SELECT pa.*, pa.id as assignment_id,
            a.name AS player_a_name, b.name AS player_b_name
       FROM pair_assignments pa
       LEFT JOIN players a ON a.id = pa.player_a_id
       LEFT JOIN players b ON b.id = pa.player_b_id
       WHERE pa.gm_account_id = $1
       ORDER BY pa.created_at DESC`,
    [gmAccountId]
  );
  return rows.map((r) => ({
    ...r,
    definition: getPairDefinition(r.pair_definition_id),
  }));
}
