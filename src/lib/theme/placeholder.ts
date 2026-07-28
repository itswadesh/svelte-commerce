/**
 * Inline artwork for a theme image slot that has no image set.
 *
 * Themes deliberately ship **no** placeholder asset files. With a theme library in the
 * hundreds, per-theme placeholder art would be a large maintenance surface and a permanent
 * source of 404s whenever a theme is added, renamed, or copied. Instead an empty image field
 * renders this generated data URI: no network request, no file to keep in sync, any aspect
 * ratio, and a composition that varies by seed so a grid of empty tiles reads as "no image
 * yet" rather than as a broken page.
 *
 * It renders as a normal `<img src>`, so every theme's existing `img` CSS (sizing, object-fit,
 * radius) applies unchanged.
 */

/** Small deterministic hash so the same slot always draws the same composition. */
function hash(seed: string): number {
	let h = 2166136261
	for (let i = 0; i < seed.length; i++) {
		h ^= seed.charCodeAt(i)
		h = Math.imul(h, 16777619)
	}
	return Math.abs(h)
}

export type ThemePlaceholderTone = 'light' | 'dark'

/**
 * @param seed  Anything stable for the slot (a tile title, section name, index).
 * @param tone  'dark' for slots that render light copy on top of the artwork.
 */
export function themePlaceholder(seed = '', tone: ThemePlaceholderTone = 'light'): string {
	const h = hash(seed)
	const angle = h % 90
	const cx = 25 + (h % 50)
	const cy = 20 + ((h >> 3) % 55)
	const r = 22 + ((h >> 6) % 18)

	const [from, to, mark] =
		tone === 'dark'
			? ['#2f3330', '#5b615c', '#ffffff']
			: ['#f1efec', '#dedad4', '#000000']

	const svg =
		`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 75" preserveAspectRatio="xMidYMid slice">` +
		`<defs><linearGradient id="g" gradientTransform="rotate(${angle})">` +
		`<stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/>` +
		`</linearGradient></defs>` +
		`<rect width="100" height="75" fill="url(#g)"/>` +
		`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${mark}" fill-opacity="0.05"/>` +
		`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${mark}" stroke-opacity="0.07"/>` +
		`</svg>`

	return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

/**
 * `src` for an image slot: the configured image when the store (or theme) has one, otherwise
 * generated artwork. Use everywhere a theme renders content-owned imagery.
 */
export function themeImage(
	src: string | undefined | null,
	seed = '',
	tone: ThemePlaceholderTone = 'light'
): string {
	return src || themePlaceholder(seed, tone)
}
