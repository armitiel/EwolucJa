/**
 * Mały serwer lokalny dla modułu 3D — zero zależności (same wbudowane moduły
 * Node), więc działa nawet gdy `node_modules` jest nieświeże albo nie ma sieci.
 *
 *   node tools/scena-3d-serwer.mjs [katalog] [port]
 *
 * Domyślnie podaje `frontend/public`, więc scena jest pod /scena-3d/.
 * Robi to, czego nie potrafi podwójny klik na plik: serwuje pliki po HTTP,
 * dzięki czemu moduły ES i modele .glb wczytują się normalnie.
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';

const KORZEN = resolve(process.argv[2] || 'frontend/public');
const PORT_START = Number(process.argv[3] || 5173);

const TYPY = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.glb': 'model/gltf-binary',
  '.gltf': 'model/gltf+json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.mp3': 'audio/mpeg',
  '.wasm': 'application/wasm',
  '.ico': 'image/x-icon',
};

async function plik(sciezka) {
  try {
    const s = await stat(sciezka);
    if (s.isDirectory()) return plik(join(sciezka, 'index.html'));
    return { dane: await readFile(sciezka), typ: TYPY[extname(sciezka).toLowerCase()] || 'application/octet-stream' };
  } catch {
    return null;
  }
}

const serwer = createServer(async (req, res) => {
  const adres = decodeURIComponent((req.url || '/').split('?')[0]);
  // bez wychodzenia poza katalog (żaden ../ nie przejdzie)
  const wzgledna = normalize(adres).replace(/^([/\\.]+)/, '');
  const cel = join(KORZEN, wzgledna);
  if (!cel.startsWith(KORZEN)) { res.writeHead(403).end('403'); return; }

  const p = await plik(cel);
  if (!p) {
    res.writeHead(404, { 'content-type': 'text/html; charset=utf-8' });
    res.end(`<p style="font:600 15px system-ui;padding:24px">Nie ma takiego pliku: ${adres}<br>
      Scena jest pod <a href="/scena-3d/">/scena-3d/</a></p>`);
    return;
  }
  res.writeHead(200, { 'content-type': p.typ, 'cache-control': 'no-store' });
  res.end(p.dane);
});

function start(port, prob = 0) {
  serwer.once('error', (err) => {
    if (err.code === 'EADDRINUSE' && prob < 12) return start(port + 1, prob + 1);
    console.error('Nie udało się wystartować:', err.message);
    process.exit(1);
  });
  serwer.listen(port, '127.0.0.1', () => {
    const url = `http://127.0.0.1:${port}/scena-3d/`;
    console.log(`\n  Katalog:  ${KORZEN}`);
    console.log(`  Scena:    ${url}`);
    console.log(`  Dla dziecka (bez panelu):  ${url}?panel=0`);
    console.log('\n  Zatrzymanie: Ctrl+C\n');
    if (process.env.SCENA3D_OTWORZ !== '0') {
      const cmd = process.platform === 'win32' ? `start "" "${url}?panel=0"`
        : process.platform === 'darwin' ? `open "${url}?panel=0"` : `xdg-open "${url}?panel=0"`;
      import('node:child_process').then(({ exec }) => exec(cmd, () => {}));
    }
  });
}

start(PORT_START);
