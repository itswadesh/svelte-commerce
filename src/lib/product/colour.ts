/**
 * The paint for a colour option's value: a swatch on the product page, a dot on the card. Stores
 * name their colours in words ("Rani pink", "Bottle green") and GoCommerce keeps no colour code,
 * so the paint comes from the name. A name this list does not know gets none, and the caller says
 * the colour in words rather than painting a guess.
 */

const MULTI = 'conic-gradient(#d84343, #f2c94c, #3fa45b, #2f6fd0, #8e44ad, #d84343)'

// Garment colour names, Indian retail's included. The plain CSS words are here too, because a
// name is never handed to CSS as it is: "cream" is not a CSS colour and painted nothing.
const NAMED: Record<string, string> = {
	black: '#1a1a1a',
	white: '#ffffff',
	'off white': '#f5f2ea',
	cream: '#f3ead3',
	ivory: '#fffff0',
	beige: '#d9c7a7',
	nude: '#e3bc9a',
	camel: '#c19a6b',
	khaki: '#c3b091',
	tan: '#d2b48c',
	brown: '#7b4b2a',
	coffee: '#6f4e37',
	chocolate: '#5a3a22',
	grey: '#8c8c8c',
	gray: '#8c8c8c',
	charcoal: '#36454f',
	silver: '#c0c0c0',
	gold: '#d4af37',
	golden: '#d4af37',
	copper: '#b87333',
	bronze: '#cd7f32',
	navy: '#1f2a52',
	'navy blue': '#1f2a52',
	blue: '#2f5dc8',
	'royal blue': '#2a52be',
	'sky blue': '#87ceeb',
	'powder blue': '#b0e0e6',
	'baby blue': '#a7c7e7',
	denim: '#3c5a8a',
	teal: '#008080',
	turquoise: '#40e0d0',
	aqua: '#3fc7d0',
	cyan: '#00b7c7',
	mint: '#a8e6cf',
	'sea green': '#2e8b57',
	green: '#2e7d32',
	'bottle green': '#0b4d2c',
	emerald: '#50c878',
	olive: '#708238',
	sage: '#9caf88',
	lime: '#a4c639',
	pista: '#93c572',
	'pista green': '#93c572',
	yellow: '#f2c94c',
	lemon: '#fff44f',
	mustard: '#d4a017',
	orange: '#f28c28',
	rust: '#b7410e',
	peach: '#ffcba4',
	coral: '#ff7f50',
	salmon: '#fa8072',
	red: '#c62828',
	crimson: '#b0172f',
	maroon: '#800000',
	wine: '#722f37',
	burgundy: '#800020',
	pink: '#f4a6c1',
	'baby pink': '#f4c2c2',
	'rani pink': '#e0218a',
	'hot pink': '#ff69b4',
	blush: '#e8b4b8',
	rose: '#d98695',
	'rose gold': '#b76e79',
	magenta: '#c71585',
	fuchsia: '#d6249f',
	purple: '#6a1b9a',
	lavender: '#c8b6e2',
	lilac: '#c8a2c8',
	mauve: '#b784a7',
	orchid: '#da70d6',
	violet: '#8a2be2',
	indigo: '#33407a',
	multi: MULTI,
	multicolor: MULTI,
	multicolour: MULTI,
	'multi color': MULTI,
	'multi colour': MULTI
}

// A code a merchant typed is used only when it is a whole colour and nothing more, since it ends
// up in a style attribute.
const CODE = /^(#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})|(rgb|hsl)a?\([\d\s.,%/+-]+\))$/i

/** The paint for a colour name or code, or null when it is not a colour this knows. */
export function colourPaint(name: unknown): string | null {
	const raw = String(name ?? '').trim()
	if (CODE.test(raw)) return raw
	const key = raw.toLowerCase().replace(/[\s_-]+/g, ' ')
	if (NAMED[key]) return NAMED[key]
	// "Light blue", "Dark green", "Pastel pink": the base colour, lightened or darkened.
	const shade = /^(light|pale|pastel|dark|deep)\s+(.+)$/.exec(key)
	const base = shade && NAMED[shade[2]]
	if (!shade || !base || base === MULTI) return null
	return shade[1] === 'dark' || shade[1] === 'deep' ? `color-mix(in srgb, ${base}, black 35%)` : `color-mix(in srgb, ${base}, white 45%)`
}

/** An option value's paint: the code its connector sent when there is one, else its name's. */
export function swatchPaint(value: Record<string, any> | null | undefined): string | null {
	const code = value?.colorCode || value?.colourCode || value?.hex || value?.color
	return (typeof code === 'string' && CODE.test(code.trim()) ? code.trim() : null) ?? colourPaint(value?.value)
}

export type ProductColour = { name: string; paint: string | null }

const COLOUR_OPTION = /^(colou?rs?|shades?)$/i

/** The colours a product comes in, in the store's order, when there is more than one; else none. */
export function productColours(product: { options?: unknown } | null | undefined): ProductColour[] {
	const options = Array.isArray(product?.options) ? product.options : []
	const option = options.find((o: any) => o?.type === 'Color' || COLOUR_OPTION.test(String(o?.name ?? o?.title ?? '').trim()))
	const values: any[] = Array.isArray(option?.values) ? option.values : []
	const colours = values
		.map((v) => ({ name: String(v?.value ?? '').trim(), paint: swatchPaint(v) }))
		.filter((c) => c.name)
	return colours.length > 1 ? colours : []
}
