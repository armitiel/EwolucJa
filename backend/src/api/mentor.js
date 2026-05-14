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
import { requireMentor } from "../services/authService.js";
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

  r.post("/classes/:id/regenerate", async (req, res) => {
    try {
      const result = await regenerateInviteCode(req.mentor.gmAccountId, req.params.id);
      res.json(result);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  });

  return r;
}
