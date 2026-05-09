/**
 * Vercel Serverless Function entry point.
 * Wszystkie /api/* request'y trafiają tu. Express obsługuje routing wewnętrznie.
 */
import { createApp } from "../backend/src/server.js";

const app = createApp();

export default function handler(req, res) {
  return app(req, res);
}
