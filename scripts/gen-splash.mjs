/**
 * gen-splash — tla ekranow startowych minigier przez OpenAI Images (gpt-image-1).
 *
 * DLACZEGO OSOBNY SKRYPT OD `gen-ikony.mjs`: ikony to plaskie wektory z grubym
 * konturem (fal.ai / flux zalatwia je jednym strzalem), a splash to MALOWANE
 * tlo — miekkie swiatlo, glebia, mgielka. To dwa rozne zadania i dwa rozne
 * modele.
 *
 * STYL RODZINY jest opisany na podstawie istniejacych plikow
 * `start-pamiec-scena-v2.webp`, `start-puch-scena-v2.webp`,
 * `start-lot-scena-v2.webp`: ciepłe zlote swiatlo z gory, unoszace sie iskry,
 * kadrowanie roslinnoscia w rogach (winieta), miekkie gradienty, zero
 * twardych konturow, brak postaci i napisow (te dokłada UI).
 *
 * Klucz z `backend/.env` (OPENAI_API_KEY). Uruchomienie:
 *   node scripts/gen-splash.mjs [filtr]
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const WYJSCIE = path.join(ROOT, 'frontend', 'public', 'assets', 'minigry');

const env = fs.readFileSync(path.join(ROOT, 'backend', '.env'), 'utf8');
const KEY = (env.match(/^OPENAI_API_KEY\s*=\s*(.+)$/m) || [])[1]?.trim().replace(/^["']|["']$/g, '');
if (!KEY) { console.error('BLAD: brak OPENAI_API_KEY w backend/.env'); process.exit(1); }

const STYL = "Soft painterly children's book illustration, dreamy storybook background art. "
  + "PALETTE IS THE KEY: a bright cerulean blue sky with fluffy sunlit white cumulus clouds fills "
  + "the upper half, warm golden sunlight pours through it with visible light rays, and the land is "
  + "fresh vivid green. Warm gold against cool blue — vibrant, saturated, high-key and luminous, "
  + "NEVER sepia, never monochrome yellow, never desaturated or muddy. Tiny glowing sparkles float "
  + "in the air. Soft-focus foreground framing: leafy green branches and grass in the lower corners "
  + "forming a gentle vignette. Luminous atmospheric haze, smooth gradients, no harsh outlines, "
  + "no flat vector shapes. Vertical portrait composition with a calm open sky in the upper middle. "
  + "Absolutely no characters, no people, no animals, no text, no letters, no logos, no UI.";

const ZADANIA = [
  { plik: 'start-bieg-scena.webp',
    prompt: `A winding golden sandy path snaking over tall grass-topped rock plateaus that rise above a `
      + `sea of soft white clouds, the path climbing gently into the sunlit distance, sunlit warm ochre `
      + `cliff faces crowned with bright green grass, blue sky and white clouds filling the space between `
      + `and above the plateaus, a few glowing motes drifting over the ravine. ${STYL}` },
];

const FILTR = process.argv[2];

for (const z of ZADANIA) {
  if (FILTR && !z.plik.includes(FILTR)) continue;
  const t = Date.now();
  const r = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'gpt-image-1', prompt: z.prompt, size: '1024x1536', quality: 'high', n: 1 }),
  });
  const d = await r.json().catch(() => null);
  const b64 = d?.data?.[0]?.b64_json;
  if (!b64) { console.error('BLAD', z.plik, r.status, JSON.stringify(d).slice(0, 400)); continue; }
  fs.mkdirSync(WYJSCIE, { recursive: true });
  const cel = path.join(WYJSCIE, 'surowe-' + z.plik.replace(/\.webp$/, '.png'));
  fs.writeFileSync(cel, Buffer.from(b64, 'base64'));
  console.log('OK', path.basename(cel), fs.statSync(cel).size, 'B', ((Date.now() - t) / 1000).toFixed(1) + 's');
}
console.log('GOTOWE');
