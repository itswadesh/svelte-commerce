export { getThemeHomepageContent, resolveThemeContent, type ThemeHomepageContent } from './homepage-content.js'

export type StorefrontThemeName = 'default' | 'wine' | 'organic' | 'lime' | string

export interface StorefrontTheme {
	name: StorefrontThemeName
	source: 'admin' | 'default'
	available: string[]
}

/**
 * Themes this storefront build can render. It is deliberately NOT the catalogue: on Litekart the
 * catalogue comes from the API (`GET /api/themes`), which may list themes a given storefront
 * build does not have. This list is what the frontend ships.
 */
const AVAILABLE_THEMES = ['default', 'wine', 'organic', 'lime', 'noor']
const DEFAULT_THEME = 'default'

const THEME_FONTS: Record<string, string> = {
	default:
		'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap',
	wine:
		'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Poppins:wght@300;400;500;600;700&family=Dancing+Script:wght@700&display=swap',
	organic:
		'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Nunito:wght@400;600;700;900&family=Open+Sans:ital,wght@0,300;0,400;0,600;0,700;1,400&display=swap',
	noor:
		'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Montserrat:wght@400;500;600;700&display=swap'
}

export function getThemeFontsUrl(theme: string): string | null {
	return THEME_FONTS[theme] || null
}

/**
 * Which theme to render: the one the backend names on the store record (`store.theme.name`, as
 * Litekart's admin sets it), else the default theme. A backend with no theme feature (Saleor,
 * Medusa, Shopify) gets the default theme, and so does a name this build does not ship. Owner
 * decision, docs/decisions.md 2026-10-27; there is deliberately no env override.
 */
export function resolveStorefrontTheme(store: any): StorefrontTheme {
	// `store.theme` is now a first-class object `{ name, content }`; older data may still be a
	// plain string. Read the name from either shape.
	const themeField = store?.theme
	const themeFieldName = typeof themeField === 'string' ? themeField : themeField?.name
	const adminTheme =
		themeFieldName ||
		store?.activeTheme ||
		store?.themeName ||
		store?.settings?.theme ||
		store?.plugins?.themeSettings?.theme ||
		store?.plugins?.themeSettings?.activeTheme
	const requested = String(adminTheme || '').trim().toLowerCase()
	const name = normalizeThemeName(requested)

	return {
		name,
		source: name === requested ? 'admin' : 'default',
		available: AVAILABLE_THEMES
	}
}

export function normalizeThemeName(value: unknown): StorefrontThemeName {
	const name = String(value || '').trim().toLowerCase()
	return AVAILABLE_THEMES.includes(name) ? name : DEFAULT_THEME
}
