/**
 * Palette analysis — clusters every extracted color occurrence in OKLCH space
 * and assigns semantic roles (background, foreground, primary, secondary,
 * accent, muted, border, destructive) using weighted context heuristics.
 * Fully deterministic: same input files → same theme.
 */
import { parse as parseColor, oklch, formatHex, differenceEuclidean, wcagContrast } from 'culori';

const diff = differenceEuclidean('oklab');
const CLUSTER_THRESHOLD = 0.055;

export function analyzePalette(colorSignals) {
  // 1) Normalize + cluster
  const clusters = [];
  for (const sig of colorSignals) {
    const parsed = parseColor(sig.value);
    if (!parsed) continue;
    if (parsed.alpha !== undefined && parsed.alpha < 0.35) continue; // overlays, not brand
    const c = oklch(parsed);
    if (!c) continue;

    let cluster = clusters.find((k) => diff(k.color, parsed) < CLUSTER_THRESHOLD);
    if (!cluster) {
      cluster = { color: parsed, oklch: c, hex: formatHex(parsed), weight: 0, count: 0, contexts: {}, props: {} };
      clusters.push(cluster);
    }
    cluster.weight += sig.weight;
    cluster.count += 1;
    for (const ctx of sig.context) cluster.contexts[ctx] = (cluster.contexts[ctx] || 0) + sig.weight;
    cluster.props[sig.prop] = (cluster.props[sig.prop] || 0) + sig.weight;
  }
  clusters.sort((a, b) => b.weight - a.weight);

  // 2) Partition by lightness/chroma
  const light   = clusters.filter((k) => k.oklch.l > 0.85);
  const dark    = clusters.filter((k) => k.oklch.l < 0.45);
  const chromatic = clusters.filter((k) => (k.oklch.c ?? 0) > 0.05 && k.oklch.l >= 0.25 && k.oklch.l <= 0.85);
  const neutral = clusters.filter((k) => (k.oklch.c ?? 0) <= 0.05);

  const bgScore = (k) => (k.props['background'] || 0) + (k.props['background-color'] || 0) + (k.contexts['surface'] || 0);
  const fgScore = (k) => (k.props['color'] || 0) + (k.contexts['body'] || 0);
  const brandScore = (k) => k.weight + 2 * (k.contexts['interactive'] || 0) + (k.contexts['heading'] || 0) + 20 * (k.oklch.c ?? 0);

  // 3) Assign roles
  const background = pick(light, bgScore) ?? { hex: '#ffffff', oklch: oklch(parseColor('#fff')) };
  const foreground = pick(dark, fgScore)  ?? { hex: '#1a1a1a', oklch: oklch(parseColor('#1a1a1a')) };

  const isError = (k) => (k.contexts['error'] || 0) > 0.5 * k.weight;
  const brandRanked = chromatic.filter((k) => !isError(k)).sort((a, b) => brandScore(b) - brandScore(a));
  const primary = brandRanked[0] ?? foreground;
  const secondary = brandRanked.find((k) => k !== primary && diff(k.color ?? parseColor(k.hex), primary.color ?? parseColor(primary.hex)) > 0.12);
  const accent = brandRanked.find((k) => k !== primary && k !== secondary && diff(k.color ?? parseColor(k.hex), primary.color ?? parseColor(primary.hex)) > 0.12);

  const muted = pick(neutral.filter((k) => k.oklch.l > 0.8 && k !== background), (k) => k.weight)
    ?? deriveMuted(background);
  const border = pick(neutral.filter((k) => k.oklch.l > 0.6 && k.oklch.l < 0.95 && (k.props['border-color'] || k.props['border'])), (k) => k.weight)
    ?? deriveBorder(background);
  const destructive = chromatic.find(isError) ?? chromatic.find((k) => {
    const h = k.oklch.h ?? 0;
    return (h >= 15 && h <= 40) && k.oklch.c > 0.12 && k !== primary && k !== secondary && k !== accent;
  });

  const roles = {
    background: background.hex,
    foreground: foreground.hex,
    primary: primary.hex,
    'primary-foreground': onColor(primary.hex),
    secondary: secondary?.hex ?? shift(primary.hex, 0.18),
    'secondary-foreground': onColor(secondary?.hex ?? shift(primary.hex, 0.18)),
    accent: accent?.hex ?? (secondary?.hex ?? shift(primary.hex, -0.1)),
    'accent-foreground': onColor(accent?.hex ?? secondary?.hex ?? primary.hex),
    muted: muted.hex ?? muted,
    'muted-foreground': mix(foreground.hex, background.hex, 0.35),
    border: border.hex ?? border,
    input: border.hex ?? border,
    ring: primary.hex,
    card: background.hex,
    'card-foreground': foreground.hex,
    destructive: destructive?.hex ?? '#dc2626',
    'destructive-foreground': '#ffffff',
  };

  return {
    roles,
    fullPalette: clusters.slice(0, 24).map((k) => ({
      hex: k.hex, weight: k.weight, count: k.count,
      contexts: Object.keys(k.contexts),
    })),
    confidence: {
      primary: brandRanked.length ? 'high' : 'low (no chromatic colors found — check source CSS)',
      contrastPrimaryOnBg: +wcagContrast(roles.primary, roles.background).toFixed(2),
      contrastFgOnBg: +wcagContrast(roles.foreground, roles.background).toFixed(2),
    },
  };
}

function pick(arr, score) {
  if (!arr.length) return null;
  return arr.reduce((best, k) => (score(k) > score(best) ? k : best), arr[0]);
}

function onColor(hex) {
  return wcagContrast('#ffffff', hex) >= 3.2 ? '#ffffff' : '#111111';
}

function shift(hex, dl) {
  const c = oklch(parseColor(hex));
  c.l = Math.min(0.98, Math.max(0.08, c.l + dl));
  return formatHex(c);
}

function mix(hexA, hexB, t) {
  const a = oklch(parseColor(hexA)); const b = oklch(parseColor(hexB));
  return formatHex({ mode: 'oklch', l: a.l + (b.l - a.l) * t, c: (a.c ?? 0) + ((b.c ?? 0) - (a.c ?? 0)) * t, h: a.h ?? b.h ?? 0 });
}

function deriveMuted(bg) { return { hex: shift(bg.hex, -0.045) }; }
function deriveBorder(bg) { return { hex: shift(bg.hex, -0.12) }; }
