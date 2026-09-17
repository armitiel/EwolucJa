/*!
 * SPDX-FileCopyrightText: © 2026 Amitiel Angelisme <armitiel@gmail.com>
 * SPDX-License-Identifier: LicenseRef-EwolucJA-Proprietary
 *
 * EwolucJA — gra edukacyjna dla dzieci.
 * Produkt powstał w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”;
 * autorskie prawa majątkowe pozostają przy autorze. Licencja: LICENSE.
 */
/**
 * gen-ikony-wskazowki — LUPA i PUZELEK do chmurki mówiącej obrazkami,
 * w rodzinie siekiery (`docs/design-system/styl-ikon-3d.md`).
 *
 * DLACZEGO images.edit, a nie zwykła generacja: tego stylu NIE DA SIĘ opisać
 * promptem — dwie próby dały napuchniętą glinę (`docs/grafika.md`, rozdz. 2b).
 * Styl podajemy OBRAZEM: `docs/styl/rabanie/siekiera-styl.png` leci jako
 * referencja, a prompt mówi WYŁĄCZNIE, co ma być na obrazku.
 *
 * DWIE IKONY W JEDNEJ PARZE. Lupa i puzelek wyświetlają się na przemian w tej
 * samej chmurce, więc muszą być rodzeństwem: ta sama referencja, ta sama
 * generacja, ta sama obróbka. Robienie ich osobno, innego dnia, kończy się
 * dwiema ikonami, które „prawie" do siebie pasują.
 *
 * Uruchomienie (Windows, bo sieć piaskownicy nie dopuszcza OpenAI):
 *   node scripts/gen-ikony-wskazowki.mjs
 * Potem obróbka (przycięcie do alfy + 256 px):
 *   python scripts/ikony-wskazowki-obrobka.py
 *
 * Wynik: mistrzowie 1024 px w `docs/styl/rabanie/`, gotowe ikony w
 * `frontend/public/assets/wskazowki/`.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REF = path.join(ROOT, 'docs', 'styl', 'rabanie', 'siekiera-styl.png');
const MISTRZE = path.join(ROOT, 'docs', 'styl', 'rabanie');

const env = fs.readFileSync(path.join(ROOT, 'backend', '.env'), 'utf8');
const KEY = (env.match(/^OPENAI_API_KEY\s*=\s*(.+)$/m) || [])[1]?.trim().replace(/^["']|["']$/g, '');
if (!KEY) { console.error('BLAD: brak OPENAI_API_KEY w backend/.env'); process.exit(1); }

/* O STYLU ANI SŁOWA — model widzi go w załączniku. Zmieniamy tylko „WHAT TO DRAW”. */
const szkielet = (co) =>
  "The attached image is an existing icon from this game. Draw the new icon so that it belongs to " +
  "the same set: the same rendering, the same surface finish and materials, the same lighting, the " +
  "same level of detail and the same overall feel — as if the same artist made one more icon for the " +
  "same game.\n\n" +
  `WHAT TO DRAW: ${co}\n\n` +
  "FRAMING: one single object, centred, filling the frame with an even margin, isolated on a fully " +
  "transparent background. No ground, no cast shadow, no text, no letters, no frame, no background elements.";

const IKONY = [
  {
    plik: 'lupa-surowa.png',
    /* Lupa ma czytać „szukaj”, więc szkło musi być duże i puste, a trzonek
       krótki — długi trzonek przy 40 px zamienia ją w chorągiewkę. */
    co: "a magnifying glass held at a slight angle: a big round clear glass lens in a chunky metal rim, "
      + "with a short warm honey-brown wooden handle",
  },
  {
    plik: 'puzzel-surowy.png',
    /* Turkus, bo puzelek zastępuje turkusowy `kawalek-v2.svg` w liczniku HUD
       i w locie do licznika — dziecko ma widzieć tę samą rzecz. */
    co: "a single jigsaw puzzle piece seen slightly from above, turquoise blue, "
      + "with one round knob on one side and one matching socket on the other",
  },
];

fs.mkdirSync(MISTRZE, { recursive: true });
for (const ikona of IKONY) {
  const fd = new FormData();
  fd.append('model', 'gpt-image-1');
  fd.append('prompt', szkielet(ikona.co));
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
  if (!b64) { console.error('BLAD', ikona.plik, r.status, JSON.stringify(d).slice(0, 600)); process.exit(1); }
  const buf = Buffer.from(b64, 'base64');
  fs.writeFileSync(path.join(MISTRZE, ikona.plik), buf);
  console.log('OK', ikona.plik, buf.length, 'B', ((Date.now() - t) / 1000).toFixed(1) + 's');
}
