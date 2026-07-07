#!/usr/bin/env node
/**
 * varni-reskin - zero-interaction design transplant for svelte-commerce.
 *
 *   reskin run   --in <static-site-dir> --out <theme-out-dir> [--repo <sveltekit-repo>] [--write] [--verify-url <url>]
 *   reskin batch --in <dir-of-store-dirs> --out <themes-root> [--repo <repo>] [--concurrency 4]
 *
 * Per store, `run` produces:
 *   design-tokens.json   full extracted design DNA
 *   theme.css            :root CSS variables (shadcn/HSL - drop into app.css)
 *   tailwind.theme.cjs   Tailwind theme extension
 *   store.config.json    name / logo / favicon / fonts
 *   fonts.html           Google Fonts <link> tags for app.html
 *   REPORT.md            summary + confidence warnings
 *   components/          AI-restyled .svelte files (when ANTHROPIC_API_KEY set)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { extractCssSignals } from '../src/extract/css.js';
import { extractHtml } from '../src/extract/html.js';
import { analyzePalette } from '../src/analyze/palette.js';
import { analyzeTypography, analyzeGeometry } from '../src/analyze/typography.js';
import { generateThemeCss, generateTailwindTheme, generateStoreConfig, generateFontsHtml, generateReport } from '../src/generate/index.js';
import { restyleComponents } from '../src/restyle/aiRestyle.js';
import { verify } from '../src/verify/visualDiff.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rawArgs = parseArgs(process.argv.slice(2));
const cmd = rawArgs._[0];

// Config file gives project-level defaults (repo, out, concurrency, engine)
// so callers -- including Claude Code running this unattended -- don't need
// to pass every flag every time. CLI flags always win over config values.
const config = loadConfig(rawArgs.config);
const args = { ...config, ...rawArgs, _: rawArgs._ };

if (!cmd || !args.in) {
  console.log(`Usage:
  reskin auto  --in <single-store-path> [--out <out-dir>] [--repo <repo>] [--engine ...]
               Runs exactly one store. Refuses parent folders that contain multiple stores.
  reskin run   --in <static-site-dir> --out <out-dir> [--repo <sveltekit-repo>] [--engine auto|claude-code|api] [--write] [--verify-url <url>]
  reskin batch --in <stores-root>     --out <out-root> [--repo <repo>] [--engine ...] [--concurrency 4]

Defaults can be set once in reskin.config.json at the project root (or pass --config <path>):
  { "repo": ".", "out": "./themes", "concurrency": 1, "engine": "auto" }`);
  process.exit(1);
}

// Only an --out passed directly on the CLI is a literal target path.
// An --out coming from reskin.config.json is a *root* - for a single store
// it still needs the store's own name appended, or two stores would collide
// into the same folder.
const explicitOut = rawArgs.out;

if (cmd === 'auto') await runAuto(args, explicitOut);
else if (cmd === 'run') await runOne(args.in, explicitOut || resolveOut(args, args.in), args);
else if (cmd === 'batch') await runBatch(args);
else { console.error(`Unknown command: ${cmd}`); process.exit(1); }

/* ------------------------------------------------------------------ */

async function runOne(inDir, outDir, opts, log = console.log) {
  const t0 = Date.now();
  log(`\nâ–¶ reskin: ${inDir}`);

  const files = walk(inDir);
  const cssFiles = files.filter((f) => f.endsWith('.css'));
  const htmlFiles = files.filter((f) => /\.html?$/.test(f));
  if (!htmlFiles.length && !cssFiles.length) throw new Error(`No .html/.css files found in ${inDir}`);
  log(`  â¤· found ${htmlFiles.length} html, ${cssFiles.length} css`);

  // 1. EXTRACT
  const signals = extractCssSignals(cssFiles);
  const structure = extractHtml(htmlFiles, signals); // also ingests <style> + inline styles

  // 2. ANALYZE
  const palette = analyzePalette(signals.colors);
  const typography = analyzeTypography(signals);
  const geometry = analyzeGeometry(signals);
  const tokens = {
    generatedAt: new Date().toISOString(),
    source: { dir: inDir, files: signals.raw.files.concat(htmlFiles.map((f) => path.basename(f))) },
    palette, typography, geometry,
    sourceCustomProps: signals.customProps,
  };

  // 3. GENERATE
  fs.mkdirSync(outDir, { recursive: true });
  const w = (name, content) => { fs.writeFileSync(path.join(outDir, name), content); log(`  âœ“ ${name}`); };
  w('design-tokens.json', JSON.stringify(tokens, null, 2));
  w('theme.css', generateThemeCss(tokens));
  w('tailwind.theme.cjs', generateTailwindTheme(tokens));
  w('store.config.json', generateStoreConfig(tokens, structure));
  w('fonts.html', generateFontsHtml(tokens, structure));

  // 4. AI RESTYLE (only when a target repo is provided)
  let restyle = null;
  if (opts.repo) {
    const mapPath = opts.map || path.join(__dirname, '..', 'config', 'component-map.json');
    const componentMap = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
    restyle = await restyleComponents({
      tokens, structure, componentMap,
      targetRepo: opts.repo, outDir,
      write: !!opts.write, engine: opts.engine || 'auto', log,
    });
  }

  w('REPORT.md', generateReport(tokens, structure) + (restyle ? restyleSummary(restyle) : ''));

  // 5. VERIFY (optional)
  if (opts['verify-url']) {
    const entry = htmlFiles.find((f) => /index\.html?$/.test(f)) || htmlFiles[0];
    await verify({ staticEntry: entry, liveUrl: opts['verify-url'], outDir, log });
  }

  log(`âœ” done in ${((Date.now() - t0) / 1000).toFixed(1)}s â†’ ${outDir}`);
  return tokens;
}

async function runBatch(opts) {
  // Batch root is literal (opts.out or the default) - per-store subfolders
  // are appended below by store name, so no basename-of-input-dir logic here.
  const outRoot = opts.out || './themes';
  const storeDirs = fs.readdirSync(opts.in, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => path.join(opts.in, d.name));
  const concurrency = +(opts.concurrency || 4);
  console.log(`â–¶ batch: ${storeDirs.length} stores, concurrency ${concurrency}, out ${outRoot}`);

  const results = [];
  const queue = [...storeDirs];
  const workers = Array.from({ length: Math.min(concurrency, queue.length) }, async () => {
    while (queue.length) {
      const dir = queue.shift();
      const name = path.basename(dir);
      const out = path.join(outRoot, name);
      try {
        const logLines = [];
        await runOne(dir, out, opts, (m) => logLines.push(m));
        results.push({ store: name, ok: true });
        console.log(`  âœ“ ${name}`);
      } catch (err) {
        results.push({ store: name, ok: false, error: err.message });
        console.error(`  âœ— ${name}: ${err.message}`);
      }
    }
  });
  await Promise.all(workers);

  const ok = results.filter((r) => r.ok).length;
  fs.mkdirSync(outRoot, { recursive: true });
  fs.writeFileSync(path.join(outRoot, 'batch-summary.json'), JSON.stringify(results, null, 2));
  console.log(`\nâœ” batch complete: ${ok}/${results.length} succeeded â†’ ${path.join(outRoot, 'batch-summary.json')}`);
  if (ok < results.length) process.exitCode = 1;
}

/**
 * Auto-detect whether --in is a single store (html files directly inside it).
 * Parent folders that contain multiple stores are refused by default because
 * this project is reskinned one client store at a time. Use `batch` only when
 * explicitly requested.
 */
async function runAuto(opts, explicitOut) {
  const inDir = opts.in;
  const entries = fs.readdirSync(inDir, { withFileTypes: true });
  const hasHtmlDirectly = entries.some((e) => e.isFile() && /\.html?$/i.test(e.name));
  if (hasHtmlDirectly) {
    console.log(`â–¶ auto-detected: single store (html found directly in ${inDir})`);
    await runOne(inDir, explicitOut || resolveOut(opts, inDir), opts);
    return;
  }

  const subdirs = entries.filter((e) => e.isDirectory());
  const looksLikeStoreRoot = subdirs.some((d) =>
    fs.readdirSync(path.join(inDir, d.name)).some((f) => /\.html?$/i.test(f))
  );
  if (looksLikeStoreRoot) {
    throw new Error(
      `Auto mode found a parent folder with multiple stores in ${inDir}. ` +
      `Pick exactly one store folder, or run the explicit batch command if batch processing was requested.`
    );
  }

  throw new Error(`Could not detect a single-store layout inside ${inDir} (no .html found directly).`);
}

// Only used as a fallback when no explicit --out was given on the CLI.
// Treats opts.out (usually from config) or the hardcoded default as a ROOT
// directory and always appends the store's own folder name under it, so
// multiple stores never collide into one output directory.
function resolveOut(opts, inDir, fallbackRoot = './themes') {
  const root = opts.out || fallbackRoot;
  return path.join(root, path.basename(path.resolve(inDir)));
}

/**
 * Looks for reskin.config.json: explicit --config path, else project root
 * (cwd, then walking up to 4 parents) so it's found regardless of where the
 * command is invoked from inside a repo.
 */
function loadConfig(explicitPath) {
  const candidates = [];
  if (explicitPath) candidates.push(explicitPath);
  let dir = process.cwd();
  for (let i = 0; i < 5; i++) {
    candidates.push(path.join(dir, 'reskin.config.json'));
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  for (const p of candidates) {
    if (fs.existsSync(p)) {
      try {
        const cfg = JSON.parse(fs.readFileSync(p, 'utf8'));
        console.log(`  (using defaults from ${p})`);
        return cfg;
      } catch (e) {
        console.error(`âš  could not parse config at ${p}: ${e.message}`);
      }
    }
  }
  return {};
}

/* ---------------------------- helpers ----------------------------- */

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory() && !['node_modules', '.git'].includes(e.name)) walk(p, acc);
    else if (e.isFile()) acc.push(p);
  }
  return acc;
}

function parseArgs(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith('--')) { out[key] = next; i++; }
      else out[key] = true;
    } else out._.push(a);
  }
  return out;
}

function restyleSummary(r) {
  return `\n## AI component restyle\n- Restyled: ${r.restyled.map((x) => x.component).join(', ') || 'none'}\n- Skipped: ${r.skipped.join(', ') || 'none'}\n- Failed guardrail: ${r.failed?.join(', ') || 'none'}\n`;
}

