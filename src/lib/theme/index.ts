import { env } from '$env/dynamic/public'
export { getThemeHomepageContent, type ThemeHomepageContent } from './homepage-content.js'

export type StorefrontThemeName = 'default' | 'sarab' | 'organic' | 'limelight' | string

export interface StorefrontTheme {
	name: StorefrontThemeName
	source: 'admin' | 'env' | 'default'
	available: string[]
}

const AVAILABLE_THEMES = ['default', 'sarab', 'organic', 'limelight', 'noor']
const DEFAULT_THEME = 'default'

const THEME_FONTS: Record<string, string> = {
	sarab:
		'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Poppins:wght@300;400;500;600;700&family=Dancing+Script:wght@700&display=swap',
	organic:
		'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Nunito:wght@400;600;700;900&family=Open+Sans:ital,wght@0,300;0,400;0,600;0,700;1,400&display=swap',
	noor:
		'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Montserrat:wght@400;500;600;700&display=swap'
}

export function getThemeFontsUrl(theme: string): string | null {
	return THEME_FONTS[theme] || null
}

export function resolveStorefrontTheme(store: any): StorefrontTheme {
	const adminTheme =
		store?.theme ||
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
