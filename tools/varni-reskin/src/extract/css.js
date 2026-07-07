/**
 * CSS extraction — parses every stylesheet and produces weighted "signals":
 * each color/font/radius/shadow occurrence tagged with the property and
 * selector context it appeared in, so the analyzer can assign semantic roles.
 */
import { parse, walk, generate } from 'css-tree';
import fs from 'node:fs';
import path from 'node:path';

const COLOR_PROPS = new Set([
  'color', 'background', 'background-color', 'border', 'border-color',
  'border-top-color', 'border-bottom-color', 'border-left-color', 'border-right-color',
  'outline-color', 'fill', 'stroke', 'box-shadow', 'text-shadow', 'caret-color',
]);

const COLOR_RE = /(#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)|hsla?\([^)]*\)|oklch\([^)]*\)|\b(?:white|black|red|blue|green|gold|silver|ivory|beige|crimson|maroon|navy|teal|orange|purple|pink|brown|gray|grey|tan|salmon|coral|khaki|olive|indigo|violet|magenta|cyan|lime|aqua|azure|lavender|plum|orchid|chocolate|sienna|tomato|wheat|snow|linen)\b)/g;

// Interactive/emphasis selectors → strong "brand color" signal
const PRIMARY_HINTS = /\.(btn|button|cta|primary|brand|accent|add-to-cart|buy|action|badge|highlight|active|link)|(^|[\s,>+~])(button|a)\b|:hover|:focus/i;
const HEADING_HINTS = /(^|[\s,>+~])h[1-6]\b|\.(heading|title|display|hero-title|logo|brand-name)/i;
const BODY_HINTS = /(^|[\s,>+~])(body|html|p)\b|\.(body|text|content|description)/i;
const SURFACE_HINTTS = /(^|[\s,>+~])(body|html|main|section)\b|\.(page|wrapper|container|section|main|site)/i;
const ERROR_HINTS = /\.(error|danger|alert|invalid|warning|destructive|sale|discount)|\berror\b/i;

export function extractCssSignals(cssFiles) {
  const signals = {
    colors: [],       // { value, prop, selector, weight, context }
    fonts: [],        // { family, selector, context }
    radii: [],        // { value, selector }
    shadows: [],      // { value, selector }
    spacing: [],      // { value, prop }
    fontSizes: [],    // { value, selector }
    fontWeights: [],  // { value, selector }
    letterSpacings: [],
    transitions: [],
    customProps: {},  // existing CSS variables in source, gold if present
    maxWidths: [],
    raw: { files: [], bytes: 0 },
  };

  for (const file of cssFiles) {
    const css = fs.readFileSync(file, 'utf8');
    signals.raw.files.push(path.basename(file));
    signals.raw.bytes += css.length;
    ingestCss(css, signals, path.basename(file));
  }
  return signals;
}

export function ingestCss(css, signals, sourceName = 'inline') {
  let ast;
  try {
    ast = parse(css, { parseValue: false, positions: false });
  } catch {
    return; // skip unparsable file rather than abort the pipeline
  }

  walk(ast, {
    visit: 'Rule',
    enter(rule) {
      const selector = generate(rule.prelude).slice(0, 200);
      const context = classifyContext(selector);

      rule.block.children.forEach((decl) => {
        if (decl.type !== 'Declaration') return;
        const prop = decl.property.toLowerCase();
        const value = generate(decl.value).trim();

        // Existing CSS custom properties are the highest-fidelity source
        if (prop.startsWith('--')) {
          signals.customProps[prop] = value;
          return;
        }

        if (COLOR_PROPS.has(prop) || prop.startsWith('border')) {
          for (const m of value.matchAll(COLOR_RE)) {
            signals.colors.push({
              value: m[0], prop, selector, context,
              weight: contextWeight(prop, context), source: sourceName,
            });
          }
        }

        switch (prop) {
          case 'font-family':
            signals.fonts.push({ family: cleanFontFamily(value), selector, context });
            break;
          case 'font':
            { const fam = value.split('/').pop()?.trim();
              if (fam) signals.fonts.push({ family: cleanFontFamily(fam), selector, context }); }
            break;
          case 'font-size':
            signals.fontSizes.push({ value, selector, context });
            break;
          case 'font-weight':
            signals.fontWeights.push({ value, selector, context });
            break;
          case 'letter-spacing':
            signals.letterSpacings.push({ value, selector });
            break;
          case 'border-radius':
            signals.radii.push({ value, selector, context });
            break;
          case 'box-shadow':
            if (value !== 'none') signals.shadows.push({ value, selector });
            break;
          case 'transition':
          case 'transition-duration':
            signals.transitions.push({ value });
            break;
          case 'max-width':
            if (/px|rem|ch/.test(value)) signals.maxWidths.push({ value, selector });
            break;
          case 'padding': case 'margin': case 'gap':
          case 'padding-top': case 'padding-bottom': case 'margin-top': case 'margin-bottom':
            for (const v of value.split(/\s+/)) {
              if (/^\d+(\.\d+)?(px|rem|em)$/.test(v)) signals.spacing.push({ value: v, prop });
            }
            break;
        }
      });
    },
  });
}

function classifyContext(selector) {
  const ctx = [];
  if (ERROR_HINTS.test(selector)) { ctx.push('error'); return ctx; }
  if (PRIMARY_HINTS.test(selector)) ctx.push('interactive');
  if (HEADING_HINTS.test(selector)) ctx.push('heading');
  if (BODY_HINTS.test(selector)) ctx.push('body');
  if (SURFACE_HINTTS.test(selector)) ctx.push('surface');
  return ctx;
}

function contextWeight(prop, context) {
  let w = 1;
  if (context.includes('interactive')) w += 4;   // buttons/links carry brand color
  if (context.includes('surface') && prop.startsWith('background')) w += 3;
  if (context.includes('body') && prop === 'color') w += 3;
  if (context.includes('heading')) w += 2;
  if (prop === 'background-color' || prop === 'background') w += 1;
  return w;
}

function cleanFontFamily(value) {
  return value
    .split(',')[0]
    .replace(/["']/g, '')
    .replace(/!important/g, '')
    .trim();
}
