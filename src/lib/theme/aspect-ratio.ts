// Callers pass image ratios in two shapes: the store setting and the section library use
// `'3:4'`, while `related-products.svelte` and `store/[slug]` pass the keyword `'square'`.
// A bare `.replace(':', ' / ')` leaves the keyword untouched and emits `aspect-ratio: square`,
// which is invalid CSS — the browser drops the declaration and the card collapses to its
// intrinsic image height, breaking the grid.
const KEYWORDS: Record<string, string> = {
	square: '1 / 1',
	portrait: '3 / 4',
	landscape: '4 / 3',
	video: '16 / 9'
}

/** Normalise an aspect-ratio prop (`'3:4'`, `'3/4'`, `'square'`, `1`) into a valid CSS value. */
export function toCssRatio(value: unknown, fallback = '1:1'): string {
	const raw = String(value ?? '').trim() || String(fallback)
	return KEYWORDS[raw.toLowerCase()] ?? raw.replace(':', ' / ')
}
