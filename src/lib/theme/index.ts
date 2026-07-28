import { env } from '$env/dynamic/public'
export { getThemeHomepageContent, resolveThemeContent, type ThemeHomepageContent } from './homepage-content.js'

export type StorefrontThemeName = 'default' | 'wine' | 'organic' | 'lime' | string

export interface StorefrontTheme {
	name: StorefrontThemeName
	source: 'admin' | 'env' | 'default'
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
		'https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,500;0,6..96,600;0,6..96,700;1,6..96,400&family=Hanken+Grotesk:wght@400;500;600;700&display=swap',
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
 * Which theme to render, in precedence order:
 *
 *  1. the store record (`store.theme.name`) — how it works on Litekart, where the theme is chosen
 *     in the admin and the API also serves that theme's content, layout and CSS;
 *  2. `PUBLIC_STOREFRONT_THEME` — the mechanism for backends that serve no theme data (Medusa,
 *     Shopify), where the theme is fixed for the deployment and everything it needs is bundled;
 *  3. the default theme.
 *
 * Step 2 is why the env variable stays: without it a non-Litekart deployment could only ever run
 * the default theme.
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
	const envTheme = env.PUBLIC_STOREFRONT_THEME || env.PUBLIC_THEME || env.PUBLIC_ACTIVE_THEME
	const candidate = normalizeThemeName(adminTheme || envTheme || DEFAULT_THEME)

	return {
		name: candidate,
		source: adminTheme ? 'admin' : envTheme ? 'env' : 'default',
		available: AVAILABLE_THEMES
	}
}

export function normalizeThemeName(value: unknown): StorefrontThemeName {
	const name = String(value || '').trim().toLowerCase()
	return name || DEFAULT_THEME
}
