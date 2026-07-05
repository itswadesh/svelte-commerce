/**
 * Typography / geometry analysis — picks heading & body font stacks, the
 * dominant border-radius, shadow style, container width, and spacing scale.
 */
const GENERIC = new Set(['serif', 'sans-serif', 'monospace', 'cursive', 'fantasy', 'system-ui', 'inherit', 'initial', 'unset', '-apple-system']);

export function analyzeTypography(signals) {
  const headingVotes = {}; const bodyVotes = {}; const allVotes = {};
  for (const f of signals.fonts) {
    const fam = f.family;
    if (!fam || GENERIC.has(fam.toLowerCase())) continue;
    allVotes[fam] = (allVotes[fam] || 0) + 1;
    if (f.context.includes('heading')) headingVotes[fam] = (headingVotes[fam] || 0) + 3;
    if (f.context.includes('body') || f.context.includes('surface')) bodyVotes[fam] = (bodyVotes[fam] || 0) + 3;
    if (f.context.includes('linked')) { // Google Fonts link: strong signal it's intentional
      headingVotes[fam] = (headingVotes[fam] || 0) + 1;
      bodyVotes[fam] = (bodyVotes[fam] || 0) + 1;
    }
  }

  const top = (votes, fallback) => Object.entries(votes).sort((a, b) => b[1] - a[1])[0]?.[0] ?? fallback;
  const body = top(bodyVotes, top(allVotes, 'Inter'));
  let heading = top(headingVotes, body);
  // If heading === body but a second distinct family exists with meaningful votes, prefer it for headings
  if (heading === body) {
    const second = Object.entries(allVotes).sort((a, b) => b[1] - a[1]).map(([f]) => f).find((f) => f !== body);
    if (second && (headingVotes[second] || allVotes[second] > 2)) heading = second;
  }

  const weights = [...new Set(signals.fontWeights.map((w) => normalizeWeight(w.value)))].filter(Boolean).sort((a, b) => a - b);
  const sizes = mode(signals.fontSizes.map((s) => s.value));

  return {
    fontHeading: heading,
    fontBody: body,
    googleFontFamilies: [...new Set([heading, body])],
    fontWeights: weights.length ? weights : [400, 500, 700],
    dominantBodySize: sizes ?? '16px',
    letterSpacingHeading: mode(signals.letterSpacings.map((l) => l.value)) ?? 'normal',
  };
}

export function analyzeGeometry(signals) {
  const radiusRaw = mode(
    signals.radii
      .filter((r) => !/50%|9999|999px/.test(r.value)) // pills/circles aren't the base radius
      .map((r) => r.value.split(/\s+/)[0])
  );
  const shadow = mode(signals.shadows.map((s) => s.value));
  const containerWidth = mode(
    signals.maxWidths.filter((m) => parseInt(m.value) > 700).map((m) => m.value)
  );
  const spacingScale = topN(signals.spacing.map((s) => s.value), 8);
  const transition = mode(signals.transitions.map((t) => {
    const m = t.value.match(/(\d+(\.\d+)?m?s)/); return m?.[1];
  }).filter(Boolean));

  return {
    radius: radiusRaw ?? '0.5rem',
    shadow: shadow ?? '0 1px 3px rgba(0,0,0,0.08)',
    containerWidth: containerWidth ?? '1280px',
    spacingScale,
    transitionDuration: transition ?? '200ms',
  };
}

function normalizeWeight(v) {
  if (/^\d+$/.test(v)) return +v;
  return { normal: 400, bold: 700, lighter: 300, bolder: 700, medium: 500, semibold: 600 }[v.toLowerCase()];
}

function mode(arr) {
  const counts = {};
  for (const v of arr) if (v) counts[v] = (counts[v] || 0) + 1;
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];
}

function topN(arr, n) {
  const counts = {};
  for (const v of arr) counts[v] = (counts[v] || 0) + 1;
  return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, n).map(([v]) => v);
}
