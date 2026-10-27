import type { Component } from 'svelte'
import AnnouncementBar from './sections/AnnouncementBar.svelte'
import Benefits from './sections/Benefits.svelte'
import CollectionList from './sections/CollectionList.svelte'
import Faq from './sections/Faq.svelte'
import Hero from './sections/Hero.svelte'
import ImageWithText from './sections/ImageWithText.svelte'
import MultiColumn from './sections/MultiColumn.svelte'
import Newsletter from './sections/Newsletter.svelte'
import ProductGrid from './sections/ProductGrid.svelte'
import RichText from './sections/RichText.svelte'
import Slideshow from './sections/Slideshow.svelte'
import Video from './sections/Video.svelte'

/**
 * The section types a composed page can use, each a trusted component of this storefront. The
 * keys are the engine's section types (ext/layouts registry.go): a type the engine adds later is
 * skipped here until a component is registered for it.
 */
export const SECTIONS: Record<string, Component<any>> = {
	'announcement-bar': AnnouncementBar,
	hero: Hero,
	slideshow: Slideshow,
	'product-grid': ProductGrid,
	'collection-list': CollectionList,
	'image-with-text': ImageWithText,
	'rich-text': RichText,
	'multi-column': MultiColumn,
	video: Video,
	faq: Faq,
	newsletter: Newsletter,
	benefits: Benefits
}
