import type { Component } from 'svelte'
import Banner from './banner.svelte'
import Newsletter from './newsletter.svelte'
import ProductGrid from './product-grid.svelte'
import TileGrid from './tile-grid.svelte'

/**
 * The section library: the vocabulary a theme's layout is written in.
 *
 * A theme is a list of these section types with options and class hooks (served by the API),
 * plus a stylesheet. Adding a theme needs no new components unless it introduces a genuinely
 * new kind of section — in which case it is added here once and every later theme can use it.
 */
export const SECTIONS: Record<string, Component<any>> = {
	banner: Banner,
	'tile-grid': TileGrid,
	'product-grid': ProductGrid,
	newsletter: Newsletter
}

export type SectionType = keyof typeof SECTIONS

export { default as SectionHeading } from './section-heading.svelte'
export * from './types.js'
export * from './utils.js'
