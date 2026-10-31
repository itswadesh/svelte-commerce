/**
 * The store's theme settings (GoCommerce ext/layouts, D127) as CSS custom properties.
 *
 * The merchant picks a handful of design tokens in the panel's theme editor — colours, a heading
 * and a body font, corner rounding — and they publish with the home page. This maps them onto the
 * variables the storefront is already built on (src/app.css: HSL triplets per `[data-theme]`), so
 * every component that uses `bg-primary`, `text-muted-foreground`, `rounded-*` or `--font-heading`
 * follows without being touched.
 *
 * Every value is the merchant's, so every value is checked again here even though the engine
 * validated it: a colour must be exactly `#rrggbb`, a font a key of FONTS, a rounding one of four
 * words. Anything else is dropped, so nothing typed in the panel can reach a style sheet as written.
 * An unset token is simply absent: the storefront keeps its own value for it.
 */

export type ThemeSettings = Partial<
	Record<
		| 'background'
		| 'text'
		| 'accent'
		| 'accent_text'
		| 'muted'
		| 'sale'
		| 'heading_font'
		| 'body_font'
		| 'heading_weight'
		| 'type_scale'
		| 'density'
		| 'radius'
		| 'product_image_ratio'
		| 'product_image_fit',
		unknown
	>
>

type Font = { family: string; googleName: string; weights: number[] }

/** The engine's font list (ext/layouts registry.go `Fonts`), keyed alike. */
export const FONTS: Record<string, Font> = {
	inter: { family: "'Inter', ui-sans-serif, system-ui, sans-serif", googleName: 'Inter', weights: [400, 500, 600, 700, 800] },
	roboto: { family: "'Roboto', ui-sans-serif, system-ui, sans-serif", googleName: 'Roboto', weights: [400, 500, 700] },
	poppins: { family: "'Poppins', ui-sans-serif, system-ui, sans-serif", googleName: 'Poppins', weights: [400, 500, 600, 700] },
	montserrat: { family: "'Montserrat', ui-sans-serif, system-ui, sans-serif", googleName: 'Montserrat', weights: [400, 500, 600, 700] },
	lato: { family: "'Lato', ui-sans-serif, system-ui, sans-serif", googleName: 'Lato', weights: [400, 700] },
	'open-sans': { family: "'Open Sans', ui-sans-serif, system-ui, sans-serif", googleName: 'Open+Sans', weights: [400, 500, 600, 700] },
	nunito: { family: "'Nunito', ui-sans-serif, system-ui, sans-serif", googleName: 'Nunito', weights: [400, 600, 700] },
	'dm-sans': { family: "'DM Sans', ui-sans-serif, system-ui, sans-serif", googleName: 'DM+Sans', weights: [400, 500, 600, 700] },
	'work-sans': { family: "'Work Sans', ui-sans-serif, system-ui, sans-serif", googleName: 'Work+Sans', weights: [400, 500, 600, 700] },
	'source-sans-3': { family: "'Source Sans 3', ui-sans-serif, system-ui, sans-serif", googleName: 'Source+Sans+3', weights: [400, 500, 600, 700] },
	'playfair-display': { family: "'Playfair Display', Georgia, serif", googleName: 'Playfair+Display', weights: [400, 500, 600, 700] },
	lora: { family: "'Lora', Georgia, serif", googleName: 'Lora', weights: [400, 500, 600, 700] },
	merriweather: { family: "'Merriweather', Georgia, serif", googleName: 'Merriweather', weights: [400, 700] },
	'cormorant-garamond': { family: "'Cormorant Garamond', Georgia, serif", googleName: 'Cormorant+Garamond', weights: [400, 500, 600, 700] },
	'libre-baskerville': { family: "'Libre Baskerville', Georgia, serif", googleName: 'Libre+Baskerville', weights: [400, 700] },
	'eb-garamond': { family: "'EB Garamond', Georgia, serif", googleName: 'EB+Garamond', weights: [400, 500, 600, 700] },
	'noto-serif': { family: "'Noto Serif', Georgia, serif", googleName: 'Noto+Serif', weights: [400, 500, 600, 700] }
}

export function googleFamily(face: Font): string {
	return `${face.googleName}:wght@${face.weights.join(';')}`
}

const RADII: Record<string, string> = { none: '0px', small: '4px', medium: '8px', large: '16px' }

// Product cards read these as --product-image-ratio and --product-image-fit (D128).
const RATIOS: Record<string, string> = { square: '1 / 1', portrait: '3 / 4', tall: '2 / 3', landscape: '4 / 3' }
const FITS: Record<string, string> = { fill: 'cover', whole: 'contain' }

/**
 * The --type-* role ladder of src/app.css at three sizes. `standard` is the default theme's own
 * (a test holds app.css to these numbers): a 16px body. `compact` is a step smaller, a 14px body;
 * `large` a step larger, an 18px one. Each fluid step reaches its desktop size where the standard
 * one does, near the 1240px rail. Nothing a shopper reads goes under 12px, so the label step holds.
 */
export const TYPE_SCALES: Record<string, Record<string, string>> = {
	compact: {
		'--type-label': '0.75rem',
		'--type-dense': '0.75rem',
		'--type-ui': '0.8125rem',
		'--type-body': '0.875rem',
		'--type-heading': 'clamp(0.9375rem, 1.3vw, 1rem)',
		'--type-page-title': 'clamp(1.125rem, 1.75vw, 1.375rem)',
		'--type-product-title': 'clamp(1.375rem, 1.95vw, 1.5rem)',
		'--type-section-title': 'clamp(1.375rem, 2.25vw, 1.75rem)',
		'--type-display': 'clamp(1.875rem, 5.6vw, 3.75rem)'
	},
	standard: {
		'--type-label': '0.75rem',
		'--type-dense': '0.8125rem',
		'--type-ui': '0.875rem',
		'--type-body': '1rem',
		'--type-heading': 'clamp(1rem, 1.45vw, 1.125rem)',
		'--type-page-title': 'clamp(1.25rem, 1.95vw, 1.5rem)',
		'--type-product-title': 'clamp(1.5rem, 2.25vw, 1.75rem)',
		'--type-section-title': 'clamp(1.5rem, 2.6vw, 2rem)',
		'--type-display': 'clamp(2.125rem, 6.4vw, 4.25rem)'
	},
	large: {
		'--type-label': '0.8125rem',
		'--type-dense': '0.875rem',
		'--type-ui': '0.9375rem',
		'--type-body': '1.125rem',
		'--type-heading': 'clamp(1.125rem, 1.6vw, 1.25rem)',
		'--type-page-title': 'clamp(1.375rem, 2.25vw, 1.75rem)',
		'--type-product-title': 'clamp(1.75rem, 2.6vw, 2rem)',
		'--type-section-title': 'clamp(1.75rem, 2.9vw, 2.25rem)',
		'--type-display': 'clamp(2.375rem, 7.15vw, 4.75rem)'
	}
}

/** --weight-heading: every heading but the hero's display line. */
const HEADING_WEIGHTS: Record<string, string> = { medium: '500', semibold: '600', bold: '700', extrabold: '800' }

/**
 * The page gutter, the gap between page sections, the gap under a section's heading and the product
 * grid's gaps. `compact` is the default theme's own, in src/app.css.
 */
export const DENSITIES: Record<string, Record<string, string>> = {
	compact: {
		'--container-gutter': 'clamp(16px, 4vw, 48px)',
		'--space-section': 'clamp(24px, 3vw, 40px)',
		'--space-head': 'clamp(16px, 2.4vw, 24px)',
		'--grid-gap-x': 'clamp(10px, 1.1vw, 16px)',
		'--grid-gap-y': 'clamp(14px, 1.4vw, 20px)'
	},
	comfortable: {
		'--container-gutter': 'clamp(20px, 5vw, 56px)',
		'--space-section': 'clamp(32px, 4vw, 56px)',
		'--space-head': 'clamp(20px, 2.8vw, 32px)',
		'--grid-gap-x': 'clamp(14px, 1.5vw, 20px)',
		'--grid-gap-y': 'clamp(20px, 2vw, 28px)'
	},
	spacious: {
		'--container-gutter': 'clamp(24px, 6vw, 72px)',
		'--space-section': 'clamp(40px, 5vw, 72px)',
		'--space-head': 'clamp(24px, 3.2vw, 40px)',
		'--grid-gap-x': 'clamp(18px, 2vw, 28px)',
		'--grid-gap-y': 'clamp(28px, 2.8vw, 40px)'
	}
}

const HEX = /^#[0-9a-f]{6}$/i

/** A colour setting, or '' when it is not exactly #rrggbb. */
function colour(value: unknown): string {
	return typeof value === 'string' && HEX.test(value) ? value.toLowerCase() : ''
}

type Rgb = [number, number, number]

function rgb(hex: string): Rgb {
	return [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)) as Rgb
}

/** `#rrggbb` → the `H S% L%` triplet the storefront's tokens hold. */
export function hexToTriplet(hex: string): string {
	const [r, g, b] = rgb(hex).map((c) => c / 255)
	const max = Math.max(r, g, b)
	const min = Math.min(r, g, b)
	const l = (max + min) / 2
	let h = 0
	let s = 0
	if (max !== min) {
		const d = max - min
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
		h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4
		h *= 60
	}
	const round = (n: number) => Math.round(n * 10) / 10
	return `${round(h)} ${round(s * 100)}% ${round(l * 100)}%`
}

/** a moved `amount` of the way towards b, as #rrggbb. */
function mix(a: string, b: string, amount: number): string {
	const [x, y] = [rgb(a), rgb(b)]
	return (
		'#' +
		x
			.map((c, i) =>
				Math.round(c + (y[i] - c) * amount)
					.toString(16)
					.padStart(2, '0')
			)
			.join('')
	)
}

/** An `H S% L%` triplet → `#rrggbb`, or '' when it is not one. */
export function tripletToHex(triplet: string): string {
	const [h, s, l] = triplet.trim().split(/\s+/).map(parseFloat)
	if (![h, s, l].every(Number.isFinite)) return ''
	const a = (s / 100) * Math.min(l / 100, 1 - l / 100)
	const channel = (n: number) => {
		const k = (n + h / 30) % 12
		const v = l / 100 - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))
		return Math.round(v * 255)
			.toString(16)
			.padStart(2, '0')
	}
	return '#' + channel(0) + channel(8) + channel(4)
}

/** WCAG contrast ratio between two #rrggbb colours. */
export function contrast(a: string, b: string): number {
	const lum = (hex: string) =>
		rgb(hex)
			.map((c) => c / 255)
			.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
			.reduce((sum, c, i) => sum + c * [0.2126, 0.7152, 0.0722][i], 0)
	const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x)
	return (hi + 0.05) / (lo + 0.05)
}

/** The colour's own hue, darkened until it reads as text on `ground` (4.5:1). */
function readableOn(hex: string, ground: string): string {
	const [h, s, l] = hexToTriplet(hex).split(' ')
	let light = parseFloat(l)
	let colour = hex
	while (contrast(colour, ground) < 4.5 && light > 0) {
		light = Math.max(0, light - 2)
		colour = tripletToHex(`${h} ${s} ${light}%`)
	}
	return colour
}

/** The same hue a step lighter or darker, whichever reads as a change on a hover. */
function hoverTriplet(hex: string): string {
	const [h, s, l] = hexToTriplet(hex).split(' ')
	const light = parseFloat(l)
	const next = light < 50 ? Math.min(100, light + 9) : Math.max(0, light - 9)
	return `${h} ${s} ${Math.round(next * 10) / 10}%`
}

/**
 * The custom properties for a set of theme settings: only those the merchant set, plus the tokens
 * that have to move with them (a muted text and the hairlines follow text and background, so a
 * dark background does not keep the light theme's grey lines and captions).
 */
export function themeTokenDeclarations(settings: ThemeSettings | null | undefined): Record<string, string> {
	const s = settings ?? {}
	const out: Record<string, string> = {}
	const background = colour(s.background)
	const text = colour(s.text)
	const accent = colour(s.accent)
	const accentText = colour(s.accent_text)
	const muted = colour(s.muted)

	if (background) {
		for (const key of ['--background', '--card', '--popover']) out[key] = hexToTriplet(background)
	}
	if (text) {
		for (const key of ['--foreground', '--card-foreground', '--popover-foreground', '--secondary-foreground']) out[key] = hexToTriplet(text)
	}
	// The default theme's own ground and ink stand in for whichever half was left unset.
	const ink = text || '#1a1a1a'
	const ground = background || '#ffffff'
	if (background || text) {
		out['--muted-foreground'] = hexToTriplet(mix(ink, ground, 0.3))
		out['--border'] = hexToTriplet(mix(ink, ground, 0.8))
		out['--input'] = hexToTriplet(mix(ink, ground, 0.55))
		out['--border-strong'] = hexToTriplet(mix(ink, ground, 0.6))
	}
	if (accent) {
		out['--primary'] = hexToTriplet(accent)
		out['--primary-hover'] = hoverTriplet(accent)
		// The accent as text and borders only where it reads on the ground (4.5:1); a light accent
		// such as yellow is a fill, and its ink is the text colour.
		out['--primary-ink'] = hexToTriplet(contrast(accent, ground) >= 4.5 ? accent : ink)
		// With no label colour set, ink or white, whichever reads on this accent.
		if (!accentText) out['--primary-foreground'] = hexToTriplet(contrast(accent, ink) >= contrast(accent, '#ffffff') ? ink : '#ffffff')
	}
	if (accentText) out['--primary-foreground'] = hexToTriplet(accentText)
	if (muted) {
		out['--muted'] = hexToTriplet(muted)
		out['--secondary'] = hexToTriplet(muted)
		// The warm band behind the hero and the strips is a literal colour, not a triplet.
		out['--ed-canvas'] = muted
	}

	const heading = font(s.heading_font)
	const body = font(s.body_font)
	if (heading) out['--font-heading'] = heading.family
	if (body) {
		out['--font-body'] = body.family
		out['--font-primary'] = body.family
	}
	const sale = colour(s.sale)
	if (sale) out['--sale'] = hexToTriplet(readableOn(sale, ground))
	if (typeof s.heading_weight === 'string' && Object.hasOwn(HEADING_WEIGHTS, s.heading_weight)) out['--weight-heading'] = HEADING_WEIGHTS[s.heading_weight]
	if (typeof s.type_scale === 'string' && Object.hasOwn(TYPE_SCALES, s.type_scale)) Object.assign(out, TYPE_SCALES[s.type_scale])
	if (typeof s.density === 'string' && Object.hasOwn(DENSITIES, s.density)) Object.assign(out, DENSITIES[s.density])
	if (typeof s.radius === 'string' && Object.hasOwn(RADII, s.radius)) out['--radius'] = RADII[s.radius]
	if (typeof s.product_image_ratio === 'string' && Object.hasOwn(RATIOS, s.product_image_ratio))
		out['--product-image-ratio'] = RATIOS[s.product_image_ratio]
	if (typeof s.product_image_fit === 'string' && Object.hasOwn(FITS, s.product_image_fit)) out['--product-image-fit'] = FITS[s.product_image_fit]
	return out
}

/** A font setting's entry, or undefined — own keys only, so `toString` is not a font. */
function font(key: unknown): Font | undefined {
	return typeof key === 'string' && Object.hasOwn(FONTS, key) ? FONTS[key] : undefined
}

/**
 * A style sheet that applies the settings over the theme. `!important` because the theme's own
 * palette can arrive as inline styles on the shell (store-palette.svelte) and the merchant's
 * choice here is the later, more specific one. `depth` raises the selector's weight: the theme
 * editor's live preview draws a draft over the published block and must win over it.
 */
export function themeTokenCss(settings: ThemeSettings | null | undefined, depth = 2): string {
	const declarations = Object.entries(themeTokenDeclarations(settings))
		.map(([key, value]) => `${key}: ${value} !important;`)
		.join(' ')
	if (!declarations) return ''
	return `${'[data-theme]'.repeat(Math.max(1, depth))} { ${declarations} }`
}

export function setsBothFonts(settings: ThemeSettings | null | undefined): boolean {
	return !!font(settings?.heading_font) && !!font(settings?.body_font)
}

/**
 * The Google Fonts stylesheet for the chosen fonts, or '' when none is chosen. Every weight of each,
 * the heading face's too: besides the store's heading weight the theme draws headings at fixed ones
 * (the hero's 800, the footer's 600, a collection or slide title's 500).
 */
export function themeFontsHref(settings: ThemeSettings | null | undefined): string {
	const s = settings ?? {}
	const keys = [s.heading_font, s.body_font].filter((k, i, all): k is string => !!font(k) && all.indexOf(k) === i)
	if (!keys.length) return ''
	return 'https://fonts.googleapis.com/css2?' + keys.map((k) => 'family=' + googleFamily(FONTS[k])).join('&') + '&display=swap'
}

/** The page's background colour, for the browser's own chrome, or ''. */
export function themeBackground(settings: ThemeSettings | null | undefined): string {
	return colour(settings?.background)
}
