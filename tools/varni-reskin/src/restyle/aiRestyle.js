/**
 * AI restyle — pairs each detected static-site section with the matching
 * svelte-commerce component and asks Claude to restyle it under a hard
 * contract: script logic, props, stores, handlers, bindings preserved;
 * only markup structure and classes change.
 *
 * Engines (auto-selected, or forced with --engine):
 *   claude-code  spawns `claude -p` headless — uses your Claude Code login
 *                (subscription auth), no API key required. Default whenever
 *                the `claude` binary is on PATH.
 *   api          direct Anthropic API calls. Used when ANTHROPIC_API_KEY is
 *                set and `claude` is absent, or forced with --engine api.
 *
 * Output goes to <out>/components/ (never in-place unless --write), and every
 * result must pass a deterministic logic-preservation guardrail first.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';

const API_MODEL = process.env.RESKIN_MODEL || 'claude-sonnet-4-6';
const API = 'https://api.anthropic.com/v1/messages';
const CLAUDE_BIN = process.env.CLAUDE_BIN || 'claude';
const CC_TIMEOUT_MS = +(process.env.RESKIN_CC_TIMEOUT_MS || 300000);

const SYSTEM = `You are a Svelte component restyling engine inside an automated pipeline. You receive:
1. A target design as an HTML snippet + design tokens.
2. An existing, fully functional SvelteKit component (svelte-commerce / Litekart).

Rewrite the component so its rendered appearance matches the target design.

HARD RULES — violating any of these breaks production stores:
- Preserve the <script> block byte-for-byte unless a rename is strictly required by markup changes (then keep behavior identical).
- Preserve every prop, store subscription, {#if}/{#each}/{#await} block, event handler (on:click etc.), use: action, bind:, transition:, and slot. Every dynamic expression in the original markup MUST appear in the output.
- Use Tailwind utility classes referencing the token system (bg-primary, text-foreground, rounded, font-heading, border-border, bg-muted etc.) — never hardcode hex values.
- Keep accessibility attributes (aria-*, alt, role) and add them where the target design's markup has them.
- Do not add new npm dependencies or import new components.
- Output ONLY the complete .svelte file content. No markdown fences, no commentary, no explanation before or after.`;

export function detectEngine(forced) {
  if (forced && forced !== 'auto') return forced;
  if (claudeBinaryExists()) return 'claude-code';
  if (process.env.ANTHROPIC_API_KEY) return 'api';
  return null;
}

function claudeBinaryExists() {
  try {
    const r = spawnSync(CLAUDE_BIN, ['--version'], { timeout: 15000, encoding: 'utf8' });
    return r.status === 0;
  } catch { return false; }
}

export async function restyleComponents({ tokens, structure, componentMap, targetRepo, outDir, write = false, engine = 'auto', log = console.log }) {
  const eng = detectEngine(engine);
  if (!eng) {
    log('  ⤷ No restyle engine available — install Claude Code (npm i -g @anthropic-ai/claude-code, then `claude` once to log in) or set ANTHROPIC_API_KEY. Theme files were still generated.');
    return { engine: null, restyled: [], skipped: Object.keys(structure.sections), failed: [] };
  }
  if (eng === 'api' && !process.env.ANTHROPIC_API_KEY) {
    log('  ⤷ --engine api requested but ANTHROPIC_API_KEY not set — skipping restyle.');
    return { engine: eng, restyled: [], skipped: Object.keys(structure.sections), failed: [] };
  }
  log(`  ⤷ restyle engine: ${eng}`);

  const outComponents = path.join(outDir, 'components');
  fs.mkdirSync(outComponents, { recursive: true });
  const results = { engine: eng, restyled: [], skipped: [], failed: [] };

  for (const [section, mapping] of Object.entries(componentMap)) {
    const snippet = structure.sections[section];
    if (!snippet) { results.skipped.push(section); continue; }

    const componentPath = path.join(targetRepo, mapping.component);
    if (!fs.existsSync(componentPath)) {
      log(`  ⤷ ${section}: component not found at ${mapping.component} — skipping`);
      results.skipped.push(section);
      continue;
    }
    const original = fs.readFileSync(componentPath, 'utf8');
    const prompt = buildPrompt({ section, snippet, tokens, original, notes: mapping.notes });

    log(`  ⤷ restyling ${section} → ${mapping.component}`);
    try {
      const raw = eng === 'claude-code'
        ? await callClaudeCode(prompt)
        : await callApi(prompt);

      const cleaned = stripFences(raw);
      if (!sanityCheck(original, cleaned)) {
        log(`     ✗ ${section}: output failed logic-preservation check — original kept, draft saved as .rejected.svelte`);
        fs.writeFileSync(path.join(outComponents, path.basename(mapping.component) + '.rejected.svelte'), cleaned);
        results.failed.push(section);
        continue;
      }

      const outPath = path.join(outComponents, path.basename(mapping.component));
      fs.writeFileSync(outPath, cleaned);
      if (write) fs.writeFileSync(componentPath, cleaned);
      results.restyled.push({ section, component: mapping.component, out: outPath, written: write });
    } catch (err) {
      log(`     ✗ ${section}: ${err.message}`);
      results.failed.push(section);
    }
  }
  return results;
}

function buildPrompt({ section, snippet, tokens, original, notes }) {
  return `## Design tokens
${JSON.stringify({ roles: tokens.palette.roles, typography: tokens.typography, geometry: tokens.geometry }, null, 2)}

## Target design (static site "${section}" section)
\`\`\`html
${snippet.html}
\`\`\`

${notes ? '## Mapping notes\n' + notes + '\n\n' : ''}## Existing component to restyle
\`\`\`svelte
${original}
\`\`\``;
}

/* ------------------------- claude-code engine ------------------------- */
/**
 * Spawns `claude -p` (headless print mode). The full payload is piped via
 * stdin to avoid ARG_MAX limits; the restyle contract goes in
 * --append-system-prompt. This is a pure text transform — no tools needed —
 * so the run never blocks on a permission prompt. Auth comes from your
 * Claude Code login (subscription), not an API key.
 */
function callClaudeCode(prompt) {
  return new Promise((resolve, reject) => {
    const args = [
      '-p', 'Restyle the component per the contract in your system prompt, using the design tokens, target HTML, and existing component provided on stdin. Output only the complete .svelte file content.',
      '--append-system-prompt', SYSTEM,
      '--output-format', 'text',
    ];
    const child = spawn(CLAUDE_BIN, args, { stdio: ['pipe', 'pipe', 'pipe'] });
    let out = '', err = '';
    const timer = setTimeout(() => { child.kill('SIGKILL'); reject(new Error(`claude -p timed out after ${CC_TIMEOUT_MS / 1000}s`)); }, CC_TIMEOUT_MS);
    child.stdout.on('data', (d) => (out += d));
    child.stderr.on('data', (d) => (err += d));
    child.on('error', (e) => { clearTimeout(timer); reject(new Error(`could not spawn '${CLAUDE_BIN}': ${e.message}`)); });
    child.on('close', (code) => {
      clearTimeout(timer);
      if (code !== 0) return reject(new Error(`claude exited ${code}: ${err.slice(0, 300)}`));
      resolve(out);
    });
    child.stdin.write(prompt);
    child.stdin.end();
  });
}

/* ----------------------------- api engine ----------------------------- */
async function callApi(prompt) {
  const body = {
    model: API_MODEL,
    max_tokens: 8000,
    system: SYSTEM,
    messages: [{ role: 'user', content: prompt }],
  };
  for (let attempt = 1; attempt <= 3; attempt++) {
    const res = await fetch(API, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(body),
    });
    if (res.status === 429 || res.status >= 500) {
      await new Promise((r) => setTimeout(r, attempt * 4000));
      continue;
    }
    if (!res.ok) throw new Error(`API ${res.status}: ${(await res.text()).slice(0, 200)}`);
    const data = await res.json();
    return data.content.filter((b) => b.type === 'text').map((b) => b.text).join('\n');
  }
  throw new Error('API retries exhausted');
}

/* ----------------------------- guardrail ------------------------------ */
function stripFences(text) {
  return text.replace(/^```(?:svelte|html)?\s*\n?/m, '').replace(/\n?```\s*$/m, '').trim() + '\n';
}

/**
 * Deterministic guardrail: every dynamic Svelte token from the original must
 * survive in the output. Cheap but catches the worst failure (logic dropped).
 */
export function sanityCheck(original, restyled) {
  const dynamics = [
    ...matchAll(original, /on:[a-zA-Z]+/g),
    ...matchAll(original, /bind:[a-zA-Z.]+/g),
    ...matchAll(original, /\{#(if|each|await|key)\b/g),
    ...matchAll(original, /export\s+let\s+([a-zA-Z_$][\w$]*)/g),
    ...matchAll(original, /use:[a-zA-Z]+/g),
  ];
  const missing = dynamics.filter((d) => !restyled.includes(d));
  if (/<script[\s>]/.test(original) && !/<script[\s>]/.test(restyled)) return false;
  return missing.length === 0;
}

function matchAll(str, re) {
  return [...str.matchAll(re)].map((m) => m[0]);
}
