/**
 * aset-koncept — koncept 2D pod Tripo (image-to-3D) w DNA stylu gry.
 * Uzycie: node scripts/aset-koncept.mjs <id> "<opis postaci/obiektu>" [n=3] [size=1024x1024]
 * Wyjscie: assets/<typ>/<id>/concept/concept_v<N>_<i>.png
 * Klucz: backend/.env (OPENAI_API_KEY). Model: gpt-image-2.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const flagi = Object.fromEntries(process.argv.slice(2).filter(a => a.startsWith('--')).map(a => a.slice(2).split('=')));
const [ID, OPIS, N = '3', SIZE = '1024x1024', TYP = 'postac'] = process.argv.slice(2).filter(a => !a.startsWith('--'));
// --poza=biped|quad|prop   --lowpoly   (domyslnie biped, clay)
if (!ID || !OPIS) { console.error('uzycie: node scripts/aset-koncept.mjs <id> "<opis>" [n] [size] [typ]'); process.exit(1); }

const env = fs.readFileSync(path.join(ROOT, 'backend', '.env'), 'utf8');
const KEY = (env.match(/^OPENAI_API_KEY\s*=\s*(.+)$/m) || [])[1]?.trim().replace(/^["']|["']$/g, '');
if (!KEY || KEY.startsWith('sk-ant-')) { console.error('BLAD: brak poprawnego OPENAI_API_KEY w backend/.env'); process.exit(1); }

// DNA stylu — docs/grafika.md §2 (bez zmiany slowa)
const DNA = `STYLE: stylized 3D claymorphism, Pixar-like children's game art. Soft rounded
forms, matte clay surface with a subtle soft-touch texture, no gloss, no plastic
specular highlights, no glitter. Gentle volumetric shading, soft ambient
occlusion in the creases. Clean silhouette readable at 40 pixels. Light comes
from the upper left. Warm, friendly, calm — nothing sharp, nothing scary.
No text, no letters, no numbers, no watermark, no border, no frame,
no ground shadow, no background elements.

PALETTE: cream #FBF1D6, sand #F4E3B8, warm white #FFFDF4,
ink violet #4e4d76, soft violet #B886E8, deep violet #7A4DC2,
amber #F4C95D, dusk orange #E89A3D, leaf green #5FA76F, sky blue #B7E3FF.`;

// wymagania pod rekonstrukcje 3D (Tripo): poza, kadr, tlo
const POD_3D = `Character turnaround reference for 3D modeling: full body from ears to feet, standing upright
on two legs, facing the camera straight on, symmetrical A-POSE with both arms held slightly away
from the body, legs slightly apart, fingers together, mouth closed in a gentle smile, no props
touching the body. Centered with a small margin. PLAIN SOLID PURE WHITE background — flat white,
no gradient, no glow, no vignette, no ground, no shadow under the character.`;

const POD_3D_QUAD = `Creature reference for 3D modeling: full body, standing calmly on all four legs on a flat
invisible floor, seen from a three-quarter front view (slightly from above), head turned towards the
camera, all four legs clearly separated and visible, tail held slightly away from the body, ears up,
mouth closed in a gentle smile, no props. Centered with a small margin. PLAIN SOLID PURE WHITE
background — flat white, no gradient, no glow, no vignette, no ground, no shadow under the creature.`;
const POD_3D_PROP = `Object reference for 3D modeling: single object, three-quarter view from slightly above so the top
and two sides are visible, nothing touching it. Centered with a small margin. PLAIN SOLID PURE WHITE
background — flat white, no gradient, no glow, no vignette, no ground, no shadow.`;
const LOWPOLY = `RENDER STYLE OVERRIDE: low-poly stylized game asset — simple faceted geometry with visibly
flat triangular facets, few polygons, chunky simplified shapes, flat solid colors per facet with soft
gentle shading, no fur strands, no fine texture detail. Same palette, same friendly mood.`;
const POZA = { biped: POD_3D, quad: POD_3D_QUAD, prop: POD_3D_PROP }[flagi.poza || 'biped'];
const prompt = `${DNA}\n\n${'lowpoly' in flagi ? LOWPOLY + '\n\n' : ''}SUBJECT: ${OPIS}\n\n${POZA}`;
const out = path.join(ROOT, 'assets', TYP, ID, 'concept');
fs.mkdirSync(out, { recursive: true });
const wersja = 1 + fs.readdirSync(out).filter(f => /^concept_v\d+_/.test(f)).map(f => +f.match(/_v(\d+)_/)[1]).reduce((a, b) => Math.max(a, b), 0);

const t = Date.now();
const r = await fetch('https://api.openai.com/v1/images/generations', {
  method: 'POST',
  headers: { Authorization: 'Bearer ' + KEY, 'Content-Type': 'application/json' },
  body: JSON.stringify({ model: 'gpt-image-2', prompt, size: SIZE, quality: 'high', output_format: 'png', n: +N }),
});
const d = await r.json().catch(() => null);
if (!d?.data?.length) { console.error('BLAD', r.status, JSON.stringify(d).slice(0, 500)); process.exit(1); }
d.data.forEach((it, i) => {
  const cel = path.join(out, `concept_v${wersja}_${i + 1}.png`);
  fs.writeFileSync(cel, Buffer.from(it.b64_json, 'base64'));
  console.log('OK', path.relative(ROOT, cel), fs.statSync(cel).size, 'B');
});
fs.writeFileSync(path.join(out, `concept_v${wersja}.prompt.txt`), prompt);
console.log('GOTOWE', ((Date.now() - t) / 1000).toFixed(1) + 's');
