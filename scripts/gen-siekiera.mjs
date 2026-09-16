/**
 * gen-siekiera — ikona siekiery do WSKAŹNIKA ŚCINANIA (HUD schronienia).
 *
 * Generator: OpenAI Images (gpt-image-1), bo autor poprosił o ten tor.
 * Wzorzec pliku jak `gen-ikony.mjs`: klucz z `backend/.env`, nigdy do repo;
 * odpalane z maszyny autora (sieć org blokuje OpenAI z piaskownicy).
 *
 * Uruchomienie (Windows):  node scripts/gen-siekiera.mjs
 * Wynik: frontend/public/assets/rabanie/siekiera.png (przezroczyste tło)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const WYJSCIE = path.join(ROOT, 'frontend', 'public', 'assets', 'rabanie');

const env = fs.readFileSync(path.join(ROOT, 'backend', '.env'), 'utf8');
const KEY = (env.match(/^OPENAI_API_KEY\s*=\s*(.+)$/m) || [])[1]?.trim().replace(/^["']|["']$/g, '');
if (!KEY) { console.error('BLAD: brak OPENAI_API_KEY w backend/.env'); process.exit(1); }

const PROMPT =
  "A single friendly hatchet axe icon for a cozy low-poly children's adventure game. " +
  "Chunky steel axe head with a bright beveled cutting edge and soft smooth metallic shading, " +
  "short warm honey-brown wooden handle with a subtle grain highlight, gentle rounded soft-3D clay look, " +
  "soft even studio lighting, slight three-quarter top view with the blade facing left, warm and inviting, " +
  "bold clear silhouette that reads clearly at small size, centered, isolated single object, " +
  "no text, no numbers, no letters, no shadow, no ground, fully transparent background.";

const t = Date.now();
const r = await fetch('https://api.openai.com/v1/images/generations', {
  method: 'POST',
  headers: { Authorization: 'Bearer ' + KEY, 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'gpt-image-1', prompt: PROMPT,
    size: '1024x1024', quality: 'high', background: 'transparent', n: 1,
  }),
});
const d = await r.json().catch(() => null);
const b64 = d?.data?.[0]?.b64_json;
if (!b64) { console.error('BLAD', r.status, JSON.stringify(d).slice(0, 500)); process.exit(1); }
fs.mkdirSync(WYJSCIE, { recursive: true });
const buf = Buffer.from(b64, 'base64');
fs.writeFileSync(path.join(WYJSCIE, 'siekiera.png'), buf);
console.log('OK siekiera.png', buf.length, 'B', ((Date.now() - t) / 1000).toFixed(1) + 's');
