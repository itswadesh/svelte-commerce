import type { Component } from 'svelte'
import AnnouncementBar from './sections/AnnouncementBar.svelte'
import Benefits from './sections/Benefits.svelte'
import Hero from './sections/Hero.svelte'
import ImageWithText from './sections/ImageWithText.svelte'
import ProductGrid from './sections/ProductGrid.svelte'
import RichText from './sections/RichText.svelte'

/**
 * The section types a composed page can use, each a trusted component of this storefront. The
 * keys are the engine's section types (ext/layouts registry.go): a type the engine adds later is
 * skipped here until a component is registered for it.
 */
export const SECTIONS: Record<string, Component<any>> = {
	'announcement-bar': AnnouncementBar,
	hero: Hero,
	'product-grid': ProductGrid,
	'image-with-text': ImageWithText,
	'rich-text': RichText,
	benefits: Benefits
}
