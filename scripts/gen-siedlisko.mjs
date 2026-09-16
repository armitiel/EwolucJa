/**
 * gen-siedlisko — ikona DOMKU do znaku placu budowy, W STYLU SIEKIERY.
 *
 * DLACZEGO images.edit, a nie zwykla generacja: stylu tych ikon NIE DA SIE
 * opisac promptem (patrz docs/grafika.md, rozdz. 2b). Proba opisu ("soft 3D,
 * chunky rounded, satin finish") dwa razy z rzedu dala napuchnieta glina.
 * Dlatego styl podajemy OBRAZEM — `docs/styl/rabanie/siekiera-styl.png` leci
 * do modelu jako referencja, a prompt mowi WYLACZNIE, co ma byc na obrazku.
 *
 * Uruchomienie (Windows):  node scripts/gen-siedlisko.mjs
 * Wynik: frontend/public/scena-3d/assets/ikona-siedlisko-3d.png
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const WYJSCIE = path.join(ROOT, 'frontend', 'public', 'scena-3d', 'assets');
const REF = path.join(ROOT, 'docs', 'styl', 'rabanie', 'siekiera-styl.png');

const env = fs.readFileSync(path.join(ROOT, 'backend', '.env'), 'utf8');
const KEY = (env.match(/^OPENAI_API_KEY\s*=\s*(.+)$/m) || [])[1]?.trim().replace(/^["']|["']$/g, '');
if (!KEY) { console.error('BLAD: brak OPENAI_API_KEY w backend/.env'); process.exit(1); }

/* O STYLU ANI SLOWA. Model widzi go w zalaczniku. */
const PROMPT =
  "The attached image is an existing icon from this game. Draw the new icon so that it belongs to " +
  "the same set: the same rendering, the same surface finish and materials, the same lighting, the " +
  "same level of detail and the same overall feel — as if the same artist made one more icon for the " +
  "same game.\n\n" +
  "WHAT TO DRAW: a small cosy cottage seen slightly from above — plain walls, a pitched roof, a door.\n\n" +
  "FRAMING: one single object, centred, filling the frame with an even margin, isolated on a fully " +
  "transparent background. No ground, no cast shadow, no text, no letters, no frame, no background elements.";

const fd = new FormData();
fd.append('model', 'gpt-image-1');
fd.append('prompt', PROMPT);
fd.append('size', '1024x1024');
fd.append('quality', 'high');
fd.append('background', 'transparent');
fd.append('n', '1');
fd.append('image[]', new Blob([fs.readFileSync(REF)], { type: 'image/png' }), 'siekiera-styl.png');

const t = Date.now();
const r = await fetch('https://api.openai.com/v1/images/edits', {
  method: 'POST', headers: { Authorization: 'Bearer ' + KEY }, body: fd,
});
const d = await r.json().catch(() => null);
const b64 = d?.data?.[0]?.b64_json;
if (!b64) { console.error('BLAD', r.status, JSON.stringify(d).slice(0, 600)); process.exit(1); }
fs.mkdirSync(WYJSCIE, { recursive: true });
const buf = Buffer.from(b64, 'base64');
fs.writeFileSync(path.join(WYJSCIE, 'ikona-siedlisko-3d.png'), buf);
console.log('OK ikona-siedlisko-3d.png', buf.length, 'B', ((Date.now() - t) / 1000).toFixed(1) + 's');
