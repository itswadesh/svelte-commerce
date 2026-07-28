import type { Component } from 'svelte'
import type { ThemeHomepageContent } from '../types.js'

/**
 * Everything a section can render from. Sections are presentational: they receive resolved
 * content plus live commerce data and never fetch anything themselves.
 */
export interface SectionContext {
	/** Theme content, already merged with the store's overrides by the API. */
	content: ThemeHomepageContent
	brandName: string
	currencyCode?: string
	aspectWidth: string
	aspectHeight: string
	featuredProducts: any[]
	featuredCategories: any[]
	loading?: boolean
	/** The active theme's product card, supplied by the theme registry. */
	ProductCard?: Component<any>
}

/**
 * One section on a theme's homepage.
 *
 * `options` are the section's settings, and the string values in them are **content paths**
 * (`'menu.label'`, `'tiles.seasons'`) resolved against the store's theme content — the same
 * indirection Shopify section settings use. That keeps sections dumb and makes a theme's
 * homepage a data structure the API can serve.
 *
 * `class`/`gridClass`/`tileClass` are the styling hooks: a theme's stylesheet targets them, so
 * the same section component can look completely different between themes.
 */
export interface SectionInstance {
	type: string
	options?: Record<string, any>
}

export interface ThemeLayout {
	/** Class on the layout root — where a theme hangs its CSS variables. */
	rootClass?: string
	sections: SectionInstance[]
}
