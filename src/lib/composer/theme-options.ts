/**
 * The store's theme settings that choose behaviour rather than a colour or a size: what a product
 * card shows, how a listing is laid out, what the product page offers. Same source as the design
 * tokens (GoCommerce ext/layouts theme_settings, read by +layout.server.ts into
 * `page.data.themeSettings`), the same rule too: every value is checked against its list, and
 * anything unset or unrecognised takes the storefront's own choice below. Nothing a merchant types
 * is ever used as markup or CSS; the one free-text value, the size guide link, must be a site path.
 *
 * The defaults are the default theme's own look (docs/decisions.md, 2026-10-29).
 */

const CHOICES = {
	card_badge: ['none', 'product_badge', 'first_tag', 'first_highlight'],
	card_title_lines: ['one', 'two'],
	list_columns_mobile: ['one', 'two'],
	list_columns_desktop: ['three', 'four', 'five'],
	list_filters_desktop: ['sidebar', 'drawer'],
	pdp_gallery: ['carousel', 'grid']
} as const

type Choice<K extends keyof typeof CHOICES> = (typeof CHOICES)[K][number]

export type ThemeOptions = { [K in keyof typeof CHOICES]: Choice<K> } & {
	card_vendor: boolean
	card_rating: boolean
	card_discount: boolean
	card_wishlist: boolean
	card_add_to_cart: boolean
	card_second_image: boolean
	list_subcategories: boolean
	list_quick_filters: boolean
	list_mobile_bar: boolean
	pdp_sticky_buy: boolean
	pdp_highlights_grid: boolean
	pdp_delivery_check: boolean
	/** Show "N left" at or below this many; 0 never shows it. */
	pdp_low_stock_at: number
	/** A path on this site, or '' for no size guide link. */
	pdp_size_guide: string
}

export const DEFAULT_THEME_OPTIONS: ThemeOptions = {
	card_badge: 'product_badge',
	card_vendor: true,
	card_title_lines: 'one',
	card_rating: true,
	card_discount: true,
	card_wishlist: true,
	card_add_to_cart: false,
	card_second_image: true,
	list_columns_mobile: 'two',
	list_columns_desktop: 'five',
	list_subcategories: true,
	list_quick_filters: true,
	list_filters_desktop: 'sidebar',
	list_mobile_bar: true,
	pdp_sticky_buy: true,
	pdp_gallery: 'carousel',
	pdp_highlights_grid: true,
	pdp_delivery_check: true,
	pdp_low_stock_at: 5,
	pdp_size_guide: ''
}

/** A site path: one leading slash, no scheme or protocol-relative `//host`, nothing that ends a URL. */
const SITE_PATH = /^\/(?!\/)[\w\-./~%]*$/

export function themeOptions(settings: Record<string, unknown> | null | undefined): ThemeOptions {
	const s = settings ?? {}
	const out: ThemeOptions = { ...DEFAULT_THEME_OPTIONS }
	const writable = out as Record<string, unknown>
	for (const [key, allowed] of Object.entries(CHOICES)) {
		const value = s[key]
		if (typeof value === 'string' && (allowed as readonly string[]).includes(value)) writable[key] = value
	}
	for (const [key, fallback] of Object.entries(DEFAULT_THEME_OPTIONS)) {
		if (typeof fallback === 'boolean' && typeof s[key] === 'boolean') writable[key] = s[key]
	}
	const lowStock = s.pdp_low_stock_at
	if (typeof lowStock === 'number' && Number.isInteger(lowStock) && lowStock >= 0 && lowStock <= 20) out.pdp_low_stock_at = lowStock
	if (typeof s.pdp_size_guide === 'string') {
		const path = s.pdp_size_guide.trim()
		if (path === '' || SITE_PATH.test(path)) out.pdp_size_guide = path
	}
	return out
}
