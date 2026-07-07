#!/usr/bin/env node
/**
 * check-restyle — standalone logic-preservation guardrail.
 * Compares a restyled .svelte file against the original and exits non-zero if
 * any dynamic Svelte construct (props, handlers, bindings, control flow,
 * actions, or the <script> block) was dropped.
 *
 *   node bin/check-restyle.js <original.svelte> <restyled.svelte>
 *   node bin/check-restyle.js --git <path/in/repo.svelte>   # compares HEAD vs working tree
 *
 * Used by the Claude Code /reskin-store workflow and CI to verify every
 * component edit before it ships.
 */
import fs from 'node:fs';
import { execSync } from 'node:child_process';
import { sanityCheck } from '../src/restyle/aiRestyle.js';

const args = process.argv.slice(2);
let original, restyled, label;

if (args[0] === '--git') {
  const file = args[1];
  if (!file) usage();
  try {
    original = execSync(`git show HEAD:${JSON.stringify(file).slice(1, -1)}`, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
  } catch {
    console.error(`✗ could not read HEAD version of ${file} (new file? run from repo root?)`);
    process.exit(2);
  }
  restyled = fs.readFileSync(file, 'utf8');
  label = file;
} else {
  const [a, b] = args;
  if (!a || !b) usage();
  original = fs.readFileSync(a, 'utf8');
  restyled = fs.readFileSync(b, 'utf8');
  label = b;
}

if (sanityCheck(original, restyled)) {
  console.log(`✓ ${label}: all dynamic constructs preserved`);
} else {
  const find = (re) => [...original.matchAll(re)].map((m) => m[0]).filter((d) => !restyled.includes(d));
  const missing = [
    ...find(/on:[a-zA-Z]+/g), ...find(/bind:[a-zA-Z.]+/g),
    ...find(/\{#(if|each|await|key)\b/g), ...find(/export\s+let\s+[a-zA-Z_$][\w$]*/g),
    ...find(/use:[a-zA-Z]+/g),
  ];
  console.error(`✗ ${label}: FAILED logic-preservation check`);
  if (missing.length) console.error(`  missing: ${[...new Set(missing)].join(', ')}`);
  if (/<script[\s>]/.test(original) && !/<script[\s>]/.test(restyled)) console.error('  missing: <script> block');
  process.exit(1);
}

function usage() {
  console.log('Usage: check-restyle <original.svelte> <restyled.svelte>\n       check-restyle --git <path/in/repo.svelte>');
  process.exit(2);
}
