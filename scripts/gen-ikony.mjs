/**
 * gen-ikony — generowanie ikon gry przez fal.ai (ten sam tor, co awatary).
 *
 * Styl bazowy jest PRZEPISANY z `backend/src/services/falService.js`, zeby nowe
 * ikony trafialy w ten sam jezyk wizualny, co `assets/minigry/karty.png`
 * i `piorko.png`: gruby ciemny kontur, plaskie kolory, zero fotorealizmu.
 *
 * Klucz czytamy z `backend/.env` — nigdy nie wpisujemy go do repo.
 * Uruchomienie:  node scripts/gen-ikony.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const WYJSCIE = path.join(ROOT, 'frontend', 'public', 'assets', 'minigry');

const env = fs.readFileSync(path.join(ROOT, 'backend', '.env'), 'utf8');
const KEY = (env.match(/^FAL_KEY\s*=\s*(.+)$/m) || [])[1]?.trim().replace(/^["']|["']$/g, '');
if (!KEY) { console.error('BLAD: brak FAL_KEY w backend/.env'); process.exit(1); }

const STYL = "2D cartoon illustration style, bold clean dark brown outlines, flat cel-shaded colors, "
  + "hand-drawn look, vibrant saturated palette, minimal shading, playful proportions, "
  + "children's book illustration, adventure cartoon, simple game icon, centered composition, "
  + "single isolated object on plain pure white background";

const NEG = "realistic, photographic, 3D render, CGI, dark, scary, text, watermark, letters, numbers, "
  + "border, frame, drop shadow, gradient background, busy scene, landscape, multiple objects, clutter";

const ZADANIA = [
  { plik: 'choinka.png',
    prompt: `A single stylized fir tree, thick short trunk, three tiers of rounded triangular branches, `
      + `deep green and golden-green flat colors, tiny gold sparkles around it, cheerful and springy, ${STYL}` },
  { plik: 'lot-liska.png',
    prompt: `Close-up game icon: a cheerful little orange fox cub flying through the air, arms and tail spread wide, `
      + `big happy eyes, and in the lower left corner a small fir tree bent back like a slingshot that launched him, `
      + `short golden dashed arc between them, a few gold sparkles. The fox and the tree fill the whole square frame `
      + `edge to edge, no empty space, no machinery, no ramp, ${STYL}` },
];

// Filtr z linii polecen: `node scripts/gen-ikony.mjs lot-liska` odswieza jedna ikone.
const FILTR = process.argv[2];

for (const z of ZADANIA) {
  if (FILTR && !z.plik.includes(FILTR)) continue;
  const t = Date.now();
  const r = await fetch('https://fal.run/fal-ai/flux/schnell', {
    method: 'POST',
    headers: { Authorization: 'Key ' + KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: z.prompt, negative_prompt: NEG, image_size: 'square_hd',
                           num_inference_steps: 4, num_images: 1 }),
  });
  const d = await r.json().catch(() => null);
  const url = d?.images?.[0]?.url;
  if (!url) { console.error('BLAD', z.plik, r.status, JSON.stringify(d).slice(0, 300)); continue; }
  const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
  fs.mkdirSync(WYJSCIE, { recursive: true });
  fs.writeFileSync(path.join(WYJSCIE, 'surowe-' + z.plik), buf);
  console.log('OK', z.plik, buf.length, 'B', ((Date.now() - t) / 1000).toFixed(1) + 's');
}
console.log('GOTOWE');
