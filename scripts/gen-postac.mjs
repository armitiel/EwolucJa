/**
 * gen-postac — postacie na ekrany startowe minigier przez OpenAI Images.
 *
 * ROZNICA WOBEC `gen-splash.mjs`: tam generujemy TLO od zera, tutaj chodzi
 * o TEGO SAMEGO LISKA w nowej pozie. Dlatego nie `/images/generations`, tylko
 * `/images/edits` z obrazem referencyjnym (`scripts/ref/lis-skok.png`) —
 * model dostaje wzor pyska, oczu, chusty i lap, zamiast wymyslac je od nowa.
 * Bez tego kazdy ekran ma innego lisa, a dziecko widzi wtedy inna postac,
 * nie inna gre.
 *
 * TLO: prosimy o PLASKA BIEL, nie o `background:"transparent"`. Przezroczystosc
 * na tym endpoincie nie zadziala (wraca zlote tlo), a wycinanie zlotego tla
 * spod pomaranczowego lisa konczy sie zjedzeniem korpusu — kolory sa za blisko.
 * Biel jest daleko od kazdej barwy postaci, wiec zalewanie od krawedzi tnie ja
 * czysto (ten sam zabieg co przy `lis-skok.webp` i ikonach).
 *
 * Klucz z `backend/.env` (OPENAI_API_KEY). Uruchomienie:
 *   node scripts/gen-postac.mjs [filtr]
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const WYJSCIE = path.join(ROOT, 'frontend', 'public', 'assets', 'minigry');
const REF = path.join(ROOT, 'scripts', 'ref', 'lis-skok.png');

const env = fs.readFileSync(path.join(ROOT, 'backend', '.env'), 'utf8');
const KEY = (env.match(/^OPENAI_API_KEY\s*=\s*(.+)$/m) || [])[1]?.trim().replace(/^["']|["']$/g, '');
if (!KEY) { console.error('BLAD: brak OPENAI_API_KEY w backend/.env'); process.exit(1); }

const TOZSAMOSC = "Keep EXACTLY the same fox character as in the reference image: the same face and "
  + "muzzle shape, the same big glossy dark eyes with white highlights, the same cream chest and "
  + "cheek fur, the same dark brown paws and boots, the same teal neckerchief, the same fluffy tail "
  + "with a cream tip, the same soft airbrushed shading and the same thick soft outline. "
  + "Same proportions, same friendly cheerful expression. Do not restyle him, do not flatten him, "
  + "do not change his colors.";

const ZADANIA = [
  { plik: 'lis-bieg.png',
    prompt: `${TOZSAMOSC} Redraw him MID-RUN, sprinting energetically towards the viewer's right: `
      + `front leg reaching forward, back leg pushing off behind, arms swinging in stride, tail `
      + `streaming behind him, mouth open in a happy laugh. Three round golden coins with dark `
      + `numbers on them float in the air around his head. Full body from ears to feet, centered `
      + `with a small margin, standing out against a PLAIN SOLID PURE WHITE background — flat white, `
      + `no gradient, no colored glow, no vignette, no ground, no shadow under him, no text, no frame.` },
];

const FILTR = process.argv[2];

for (const z of ZADANIA) {
  if (FILTR && !z.plik.includes(FILTR)) continue;
  const t = Date.now();
  const form = new FormData();
  form.append('model', 'gpt-image-1');
  form.append('prompt', z.prompt);
  form.append('size', '1024x1536');
  form.append('quality', 'high');
  form.append('output_format', 'png');
  form.append('n', '1');
  form.append('image[]', new Blob([fs.readFileSync(REF)], { type: 'image/png' }), 'lis-skok.png');

  const r = await fetch('https://api.openai.com/v1/images/edits', {
    method: 'POST', headers: { Authorization: 'Bearer ' + KEY }, body: form,
  });
  const d = await r.json().catch(() => null);
  const b64 = d?.data?.[0]?.b64_json;
  if (!b64) { console.error('BLAD', z.plik, r.status, JSON.stringify(d).slice(0, 400)); continue; }
  fs.mkdirSync(WYJSCIE, { recursive: true });
  const cel = path.join(WYJSCIE, 'surowe-' + z.plik);
  fs.writeFileSync(cel, Buffer.from(b64, 'base64'));
  console.log('OK', path.basename(cel), fs.statSync(cel).size, 'B', ((Date.now() - t) / 1000).toFixed(1) + 's');
}
console.log('GOTOWE');
