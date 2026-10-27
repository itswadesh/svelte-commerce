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
		'background' | 'text' | 'accent' | 'accent_text' | 'muted' | 'heading_font' | 'body_font' | 'radius' | 'product_image_ratio' | 'product_image_fit',
		unknown
	>
>

type Font = { family: string; google: string }

/** The engine's font list (ext/layouts registry.go `Fonts`), keyed alike. */
export const FONTS: Record<string, Font> = {
	inter: { family: "'Inter', ui-sans-serif, system-ui, sans-serif", google: 'Inter:wght@400;500;600;700' },
	roboto: { family: "'Roboto', ui-sans-serif, system-ui, sans-serif", google: 'Roboto:wght@400;500;700' },
	poppins: { family: "'Poppins', ui-sans-serif, system-ui, sans-serif", google: 'Poppins:wght@400;500;600;700' },
	montserrat: { family: "'Montserrat', ui-sans-serif, system-ui, sans-serif", google: 'Montserrat:wght@400;500;600;700' },
	lato: { family: "'Lato', ui-sans-serif, system-ui, sans-serif", google: 'Lato:wght@400;700' },
	'open-sans': { family: "'Open Sans', ui-sans-serif, system-ui, sans-serif", google: 'Open+Sans:wght@400;500;600;700' },
	nunito: { family: "'Nunito', ui-sans-serif, system-ui, sans-serif", google: 'Nunito:wght@400;600;700' },
	'dm-sans': { family: "'DM Sans', ui-sans-serif, system-ui, sans-serif", google: 'DM+Sans:wght@400;500;600;700' },
	'work-sans': { family: "'Work Sans', ui-sans-serif, system-ui, sans-serif", google: 'Work+Sans:wght@400;500;600;700' },
	'playfair-display': { family: "'Playfair Display', Georgia, serif", google: 'Playfair+Display:wght@400;500;600;700' },
	lora: { family: "'Lora', Georgia, serif", google: 'Lora:wght@400;500;600;700' },
	merriweather: { family: "'Merriweather', Georgia, serif", google: 'Merriweather:wght@400;700' },
	'cormorant-garamond': { family: "'Cormorant Garamond', Georgia, serif", google: 'Cormorant+Garamond:wght@400;500;600;700' },
	'libre-baskerville': { family: "'Libre Baskerville', Georgia, serif", google: 'Libre+Baskerville:wght@400;700' },
	'eb-garamond': { family: "'EB Garamond', Georgia, serif", google: 'EB+Garamond:wght@400;500;600;700' }
}

const RADII: Record<string, string> = { none: '0px', small: '4px', medium: '8px', large: '16px' }

// Product cards read these as --product-image-ratio and --product-image-fit (D128).
const RATIOS: Record<string, string> = { square: '1 / 1', portrait: '3 / 4', tall: '2 / 3', landscape: '4 / 3' }
const FITS: Record<string, string> = { fill: 'cover', whole: 'contain' }

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
	if (background || text) {
		// The default theme's own ground and ink stand in for whichever half was left unset.
		const ink = text || '#0f172a'
		const ground = background || '#ffffff'
		out['--muted-foreground'] = hexToTriplet(mix(ink, ground, 0.3))
		out['--border'] = hexToTriplet(mix(ink, ground, 0.8))
		out['--input'] = hexToTriplet(mix(ink, ground, 0.55))
		out['--border-strong'] = hexToTriplet(mix(ink, ground, 0.6))
	}
	if (accent) {
		out['--primary'] = hexToTriplet(accent)
		out['--primary-hover'] = hoverTriplet(accent)
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

/** The Google Fonts stylesheet for the chosen fonts, or '' when none is chosen. */
export function themeFontsHref(settings: ThemeSettings | null | undefined): string {
	const s = settings ?? {}
	const keys = [s.heading_font, s.body_font].filter((k, i, all): k is string => !!font(k) && all.indexOf(k) === i)
	if (!keys.length) return ''
	return 'https://fonts.googleapis.com/css2?' + keys.map((k) => 'family=' + FONTS[k].google).join('&') + '&display=swap'
}

/** The page's background colour, for the browser's own chrome, or ''. */
export function themeBackground(settings: ThemeSettings | null | undefined): string {
	return colour(settings?.background)
}
