/*!
 * SPDX-FileCopyrightText: © 2026 Amitiel Angelisme <armitiel@gmail.com>
 * SPDX-License-Identifier: LicenseRef-EwolucJA-Proprietary
 *
 * EwolucJA — gra edukacyjna dla dzieci.
 * Produkt powstał w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”;
 * autorskie prawa majątkowe pozostają przy autorze. Licencja: LICENSE.
 */
/**
 * gen-drzewko — ikona DRZEWKA do chmurki "co jest do zrobienia", W STYLU SIEKIERY.
 *
 * DLACZEGO images.edit, a nie zwykla generacja: stylu tych ikon NIE DA SIE
 * opisac promptem (patrz docs/grafika.md, rozdz. 2b; docs/design-system/styl-ikon-3d.md).
 * Styl podajemy OBRAZEM — `docs/styl/rabanie/siekiera-styl.png` leci do modelu
 * jako referencja, a prompt mowi WYLACZNIE, co ma byc na obrazku.
 *
 * Uruchomienie (Windows):  node scripts/gen-drzewko.mjs
 * Wynik: docs/styl/rabanie/drzewko-surowa.png  (1024x1024, prosto z modelu)
 * Potem:  python scripts/obrob-ikone.py docs/styl/rabanie/drzewko-surowa.png ^
 *             frontend/public/scena-3d/assets/ikona-drzewko.png 256 6
 *
 * Surowy plik ZOSTAJE w repo obok referencji stylu: przycięcie i skala są
 * kwestią gustu i wraca się do nich częściej niż do samego rysunku, a jedno
 * wygenerowanie kosztuje ~0,19 USD.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const WYJSCIE = path.join(ROOT, 'docs', 'styl', 'rabanie');
const REF = path.join(WYJSCIE, 'siekiera-styl.png');

const env = fs.readFileSync(path.join(ROOT, 'backend', '.env'), 'utf8');
const KEY = (env.match(/^OPENAI_API_KEY\s*=\s*(.+)$/m) || [])[1]?.trim().replace(/^["']|["']$/g, '');
if (!KEY) { console.error('BLAD: brak OPENAI_API_KEY w backend/.env'); process.exit(1); }

/* O STYLU ANI SLOWA. Model widzi go w zalaczniku. */
const PROMPT =
  "The attached image is an existing icon from this game. Draw the new icon so that it belongs to " +
  "the same set: the same rendering, the same surface finish and materials, the same lighting, the " +
  "same level of detail and the same overall feel — as if the same artist made one more icon for the " +
  "same game.\n\n" +
  "WHAT TO DRAW: a single small tree — a short brown trunk and one rounded leafy green crown above it.\n\n" +
  "FRAMING: one single object, centred, filling the frame with an even margin, isolated on a fully " +
  "transparent background. No ground, no grass, no cast shadow, no text, no letters, no frame, " +
  "no background elements.";

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
fs.writeFileSync(path.join(WYJSCIE, 'drzewko-surowa.png'), buf);
console.log('OK docs/styl/rabanie/drzewko-surowa.png', buf.length, 'B', ((Date.now() - t) / 1000).toFixed(1) + 's');
