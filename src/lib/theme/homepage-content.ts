import { defaultContent } from './default/homepage-content.js'
import { sarabContent } from './sarab/homepage-content.js'
import { organicContent } from './organic/homepage-content.js'
import { limelightContent } from './limelight/homepage-content.js'
import { noorContent } from './noor/homepage-content.js'
import type { ThemeHomepageContent } from './types.js'
const CONTENT_BY_THEME: Record<string, ThemeHomepageContent> = {
	default: defaultContent,
	sarab: sarabContent,
	organic: organicContent,
	limelight: limelightContent,
	noor: noorContent
}
export type { ThemeHomepageContent } from './types.js'
export function getThemeHomepageContent(themeName = 'default') {
	return CONTENT_BY_THEME[themeName] || defaultContent
}

function isPlainObject(v: unknown): v is Record<string, any> {
	return !!v && typeof v === 'object' && !Array.isArray(v)
}

/**
 * Deep-merge `override` onto `base`, section by section:
 *  - nested plain objects merge field-by-field (admin can override just `hero.titleLead`),
 *  - scalars and arrays replace wholesale (an admin-set list of tiles/assurances swaps the array),
 *  - `undefined`/`null`/`''` in `override` are ignored, so a missing or cleared admin value never
 *    wipes a default. (The admin editor leaves untouched fields absent and blank fields empty; both
 *    fall back to the theme's design copy.)
 */
function deepMerge<T>(base: T, override: unknown): T {
	if (!isPlainObject(override)) return base
	const out: Record<string, any> = { ...(base as any) }
	for (const key of Object.keys(override)) {
		const value = (override as Record<string, any>)[key]
		if (value === undefined || value === null || value === '') continue
		out[key] = isPlainObject(value) && isPlainObject(out[key]) ? deepMerge(out[key], value) : value
	}
	return out as T
}

/**
 * Theme content with the store's admin-provided `themeContent` layered on top of the hardcoded
 * theme defaults — replaced section by section. Anything the store has NOT set falls back to the
 * theme's design copy/imagery, so the page always renders fully.
 *
 * Dynamic source (a first-class theme field on the store, not a plugin):
 *   store.theme = { name?: string, content?: Partial<ThemeHomepageContent> }
 * `store.theme.content` is the themeContent override. Absent → the static theme content is used
 * unchanged.
 */
/**
 * Editorial content for a given device with the admin cascade mobile → tablet → desktop:
 * `editorial` (already defaults-merged by resolveThemeContent) is the base/mobile layer;
 * `editorialTablet` deep-merges over it; `editorialDesktop` deep-merges over the tablet
 * result. Absent layers or blank fields inherit the previous layer.
 */
export function resolveEditorialForDevice(
	themeContent: ThemeHomepageContent,
	device: 'mobile' | 'tablet' | 'desktop'
): ThemeHomepageContent['editorial'] {
	let ed = themeContent.editorial
	if (!ed || device === 'mobile') return ed
	ed = deepMerge(ed, themeContent.editorialTablet)
	if (device === 'tablet') return ed
	return deepMerge(ed, themeContent.editorialDesktop)
}

export function resolveThemeContent(
	themeName = 'default',
	store?: { theme?: { content?: unknown } | null } | null
): ThemeHomepageContent {
	const base = getThemeHomepageContent(themeName)
	let override: unknown = store?.theme?.content
	// jsonb serves this as an object, but tolerate a JSON string too.
	if (typeof override === 'string') {
		try {
			override = JSON.parse(override)
		} catch {
			return base
		}
	}
	return deepMerge(base, override)
}