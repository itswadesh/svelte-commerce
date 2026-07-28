import { themeImage } from '../placeholder.js'
import type { SectionContext } from './types.js'

/** Reads a dot path (`'menu.emptyTitle'`) out of theme content; undefined when absent. */
export function get(source: unknown, path?: string): any {
	if (!path || !source) return undefined
	return path
		.split('.')
		.reduce<any>((value, key) => (value == null ? undefined : value[key]), source)
}

/** Reads a content path and returns a string, with `{brand}` replaced by the store's name. */
export function text(ctx: SectionContext, path?: string, literal?: string): string {
	const raw = literal ?? get(ctx.content, path)
	if (typeof raw !== 'string') return ''
	return raw.replaceAll('{brand}', ctx.brandName ?? '')
}

export interface Tile {
	image: string
	imageAlt?: string
	title?: string
	href?: string
}

/**
 * The tiles a tile-grid should render.
 *
 * With `liveCategories`, the store's own categories win and the theme's tiles are the fallback
 * for a catalogue that has none yet — the rule every theme was reimplementing by hand.
 */
export function resolveTiles(
	ctx: SectionContext,
	options: Record<string, any> = {}
): Tile[] {
	const fromContent: Tile[] = get(ctx.content, options.source) ?? []
	const live = options.liveCategories ? (ctx.featuredCategories ?? []) : []

	const tiles: Tile[] = live.length
		? live.map((category: any) => ({
				title: category?.name || category?.title || '',
				href: category?.slug ? '/' + category.slug : category?.link || '/products',
				image: category?.image || category?.thumbnail || category?.img || '',
				imageAlt: ''
			}))
		: fromContent

	const limited = options.limit ? tiles.slice(0, options.limit) : tiles
	// Every tile gets artwork: an empty image renders generated placeholder art rather than a
	// broken image, and the seed keeps a grid of empty tiles from looking identical.
	return limited.map((tile, index) => ({
		...tile,
		image: themeImage(tile.image, tile.title || `${options.source ?? 'tile'}-${index}`)
	}))
}
