/**
 * gen-awatar-wizkora — odznaka Wizkora w stylu odznaki liska (`fox_avatar.png`).
 *
 * DLACZEGO DWIE REFERENCJE. Styl odznaki (zlota obrecz, zielona tarcza, grubosc
 * konturu, swiatlo) NIE DA SIE opisac promptem — patrz docs/grafika.md 2b.
 * Ale sam Wizkor tez musi sie zgadzac z kanonem postaci. Dlatego do modelu leca
 * DWA obrazki: pierwszy mowi JAK rysowac, drugi KOGO.
 *
 * Uruchomienie (Windows):  node scripts/gen-awatar-wizkora.mjs
 * Wynik: docs/styl/postacie/wizkor-awatar-surowy.png
 * Potem: python scripts/obrob-ikone.py docs/styl/postacie/wizkor-awatar-surowy.png ^
 *            frontend/public/wizkor_avatar.png 512 2
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const WYJSCIE = path.join(ROOT, 'docs', 'styl', 'postacie');
const REF_STYL = path.join(ROOT, 'frontend', 'public', 'fox_avatar.png');
const REF_POSTAC = path.join(ROOT, 'frontend', 'public', 'wizPop.png');

const env = fs.readFileSync(path.join(ROOT, 'backend', '.env'), 'utf8');
const KEY = (env.match(/^OPENAI_API_KEY\s*=\s*(.+)$/m) || [])[1]?.trim().replace(/^["']|["']$/g, '');
if (!KEY) { console.error('BLAD: brak OPENAI_API_KEY w backend/.env'); process.exit(1); }

/* O STYLU ANI SLOWA — model widzi go w pierwszym zalaczniku. */
const PROMPT =
  "The FIRST image is an existing avatar badge from this game. The SECOND image is a character " +
  "from the same game.\n\n" +
  "Draw one new avatar badge: the character from the second image, rendered exactly the way the " +
  "first image is rendered — the same round badge with its ring, the same disc behind the " +
  "character, the same outline weight, the same painting, shading and lighting, the same level " +
  "of detail — as if the same artist painted a second badge for the same set.\n\n" +
  "POSE: head and shoulders, facing the viewer, friendly and warm. The character is bigger than " +
  "the badge, so the top of the hat and both shoulders cross over the ring and stick out past it, " +
  "the way the ears and shoulders stick out in the first image.\n\n" +
  "FRAMING: one single badge, centred, filling the frame, isolated on a fully transparent " +
  "background. No ground, no cast shadow, no text, no letters, no extra frame.";

const fd = new FormData();
fd.append('model', 'gpt-image-1');
fd.append('prompt', PROMPT);
fd.append('size', '1024x1024');
fd.append('quality', 'high');
fd.append('background', 'transparent');
fd.append('n', '1');
fd.append('image[]', new Blob([fs.readFileSync(REF_STYL)], { type: 'image/png' }), 'styl-odznaki.png');
fd.append('image[]', new Blob([fs.readFileSync(REF_POSTAC)], { type: 'image/png' }), 'wizkor.png');

const t = Date.now();
const r = await fetch('https://api.openai.com/v1/images/edits', {
  method: 'POST', headers: { Authorization: 'Bearer ' + KEY }, body: fd,
});
const d = await r.json().catch(() => null);
const b64 = d?.data?.[0]?.b64_json;
if (!b64) { console.error('BLAD', r.status, JSON.stringify(d).slice(0, 700)); process.exit(1); }
fs.mkdirSync(WYJSCIE, { recursive: true });
const buf = Buffer.from(b64, 'base64');
fs.writeFileSync(path.join(WYJSCIE, 'wizkor-awatar-surowy.png'), buf);
console.log('OK docs/styl/postacie/wizkor-awatar-surowy.png', buf.length, 'B', ((Date.now() - t) / 1000).toFixed(1) + 's');
