/**
 * Visual verification (optional) — screenshots the static source pages and
 * the running SvelteKit dev server, writes side-by-side pairs plus a pixel
 * diff score per page so drift is caught without a human looking.
 *
 * Playwright is a peer dependency (heavy): npm i -D playwright && npx playwright install chromium
 * Skipped gracefully when unavailable or when --verify-url is not given.
 */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export async function verify({ staticEntry, liveUrl, outDir, log = console.log }) {
  let chromium;
  try {
    ({ chromium } = await import('playwright'));
  } catch {
    log('  ⤷ playwright not installed — skipping visual verification.');
    return null;
  }

  const shotsDir = path.join(outDir, 'verify');
  fs.mkdirSync(shotsDir, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });

  const targets = [
    { name: 'source', url: pathToFileURL(path.resolve(staticEntry)).href },
    { name: 'reskinned', url: liveUrl },
  ];
  const shots = {};
  for (const t of targets) {
    await page.goto(t.url, { waitUntil: 'networkidle', timeout: 45000 });
    const file = path.join(shotsDir, `${t.name}.png`);
    await page.screenshot({ path: file, fullPage: false });
    shots[t.name] = file;
    log(`  ⤷ screenshot: ${file}`);
  }
  await browser.close();

  const score = await pixelDiff(shots.source, shots.reskinned, path.join(shotsDir, 'diff.png'), log);
  return { shots, diffScore: score };
}

async function pixelDiff(aPath, bPath, outPath, log) {
  try {
    const [{ PNG }, pixelmatch] = await Promise.all([import('pngjs'), import('pixelmatch')]);
    const a = PNG.sync.read(fs.readFileSync(aPath));
    const b = PNG.sync.read(fs.readFileSync(bPath));
    if (a.width !== b.width || a.height !== b.height) {
      log('  ⤷ dimensions differ — skipping pixel diff (layout comparison still available via screenshots).');
      return null;
    }
    const diff = new PNG({ width: a.width, height: a.height });
    const n = pixelmatch.default(a.data, b.data, diff.data, a.width, a.height, { threshold: 0.15 });
    fs.writeFileSync(outPath, PNG.sync.write(diff));
    const pct = ((n / (a.width * a.height)) * 100).toFixed(2);
    log(`  ⤷ pixel drift: ${pct}% (diff.png written)`);
    return +pct;
  } catch {
    log('  ⤷ pngjs/pixelmatch not installed — screenshots written, numeric diff skipped.');
    return null;
  }
}
