/**
 * /api/pairs — endpointy systemu par ("Rozdarta Mapa").
 *
 * Endpoints:
 *   GET    /api/pairs/definitions                    -> lista 15 par (publiczne, ale GM-only w UI)
 *   GET    /api/pairs/my/:playerId                   -> co widzi uczen (slowo + status)
 *   POST   /api/pairs/verify                         -> body: {playerId, keyword} -> sprawdz haslo
 *   POST   /api/pairs/assign                         -> body: {playerAId, playerBId, pairDefinitionId, gmAccountId?}
 *   POST   /api/pairs/:assignmentId/complete         -> body: {proof?} -> zamknij zadanie
 *   GET    /api/pairs/gm/:gmAccountId/assignments    -> lista assignmentow w klasie/grupie
 */

import { Router } from "express";
import * as pairs from "../services/pairsService.js";

export function pairRoutes(db) {
  const r = Router();

  r.get("/definitions", (req, res) => {
    res.json({ definitions: pairs.listPairDefinitions() });
  });

  r.get("/my/:playerId", async (req, res) => {
    try {
      const view = await pairs.getMyKeywordView(db, req.params.playerId);
      res.json(view);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  r.post("/verify", async (req, res) => {
    try {
      const { playerId, keyword } = req.body || {};
      if (!playerId || !keyword) {
        return res.status(400).json({ error: "playerId and keyword required" });
      }
      const result = await pairs.verifyKeyword(db, playerId, keyword);
      res.json(result);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  r.post("/assign", async (req, res) => {
    try {
      const { playerAId, playerBId, pairDefinitionId, gmAccountId } = req.body || {};
      if (!playerAId || !playerBId || !pairDefinitionId) {
        return res.status(400).json({ error: "playerAId, playerBId, pairDefinitionId required" });
      }
      const result = await pairs.assignPair(db, {
        playerAId, playerBId, pairDefinitionId, gmAccountId: gmAccountId || null,
      });
      res.status(201).json(result);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  });

  r.post("/:assignmentId/complete", async (req, res) => {
    try {
      await pairs.markCompleted(db, req.params.assignmentId, req.body?.proof || null);
      res.json({ ok: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  r.get("/gm/:gmAccountId/assignments", async (req, res) => {
    try {
      const list = await pairs.listAssignmentsForGm(db, req.params.gmAccountId);
      res.json({ assignments: list });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  return r;
}
