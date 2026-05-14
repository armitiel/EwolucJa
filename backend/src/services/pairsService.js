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

/** Oznacz zadanie jako wykonane (np. po przyznaniu nagrody przez mentora). */
export async function markCompleted(_db, assignmentId, proof = null) {
  const p = await pool();
  await p.query(
    `UPDATE pair_assignments
       SET status = 'completed', completed_at = NOW(), proof = $2
       WHERE id = $1`,
    [assignmentId, proof ? JSON.stringify(proof) : null]
  );
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
