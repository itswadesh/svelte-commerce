<script lang="ts">
	import ProductCard from '$lib/components/product-catalogue/product-card.svelte'
	import ThemeSections from '../ThemeSections.svelte'
	import type { SectionContext, ThemeLayout } from '../sections/types.js'
	import type { ThemeHomepageProps } from '../homepages.js'

	/**
	 * Noor homepage — the bundled fallback for the theme's section layout.
	 *
	 * Noor renders from `store.themeLayout` (served by the API) when that is present. When it is
	 * NOT — a brand-new store, a Medusa/Shopify backend, or an API hiccup — the homepage route
	 * used to fall back to `themeHomepages['default']`, i.e. the Refined Editorial homepage
	 * (Bodoni serif, cream canvas, its own hero and assurance copy) sandwiched between the noor
	 * header and the noor footer. This component is noor's own guaranteed homepage instead: the
	 * same section library, driven by a layout bundled with the build.
	 */
	let {
		themeContent,
		brandName,
		currencyCode,
		aspectWidth,
		aspectHeight,
		featuredCategories = [],
		featuredProducts = [],
		loading = false
	}: Pick<
		ThemeHomepageProps,
		| 'themeContent'
		| 'brandName'
		| 'currencyCode'
		| 'aspectWidth'
		| 'aspectHeight'
		| 'featuredCategories'
		| 'featuredProducts'
		| 'loading'
	> = $props()

	/**
	 * Section order and settings. Every string is a content path resolved against the store's
	 * theme content, so nothing here is hardcoded copy; live products/categories come from the
	 * props above.
	 */
	const noorLayout: ThemeLayout = {
		rootClass: 'noor-home',
		sections: [
			{
				type: 'banner',
				options: {
					image: 'hero.image',
					alt: 'hero.imageAlt',
					class: 'noor-hero',
					aspect: '16/9',
					priority: true,
					href: '/products'
				}
			},
			{
				type: 'tile-grid',
				options: {
					source: 'tiles.categories',
					liveCategories: true,
					limit: 6,
					caption: 'below',
					class: 'noor-section noor-categories',
					gridClass: 'noor-tile-row',
					tileClass: 'noor-tile',
					heading: {
						label: 'category.label',
						title: 'category.titleLead',
						titleSuffix: 'category.titleAccent',
						text: 'category.text'
					}
				}
			},
			{
				type: 'product-grid',
				options: {
					limit: 8,
					class: 'noor-section noor-products',
					gridClass: 'noor-product-row',
					heading: {
						label: 'menu.label',
						title: 'menu.titleLead',
						titleSuffix: 'menu.titleAccent',
						cta: 'menu.cta',
						ctaHref: '/products'
					},
					empty: { title: 'menu.emptyTitle', text: 'menu.emptyText' }
				}
			},
			{
				type: 'banner',
				options: {
					image: 'special.image',
					alt: 'special.imageAlt',
					class: 'noor-campaign',
					aspect: '21/9'
				}
			},
			{
				type: 'newsletter',
				options: {
					class: 'noor-section noor-newsletter',
					label: 'newsletter.label',
					title: 'newsletter.titleLead',
					titleSuffix: 'newsletter.titleAccent',
					text: 'newsletter.text',
					placeholder: 'newsletter.placeholder',
					cta: 'newsletter.cta',
					privacy: 'newsletter.privacy'
				}
			}
		]
	}

	const ctx: SectionContext = $derived({
		content: themeContent,
		brandName,
		currencyCode,
		aspectWidth,
		aspectHeight,
		featuredProducts,
		featuredCategories,
		loading,
		ProductCard
	})

	// The section library only ever emits <h2>, so a section-driven homepage has no top-level
	// heading. The hero is artwork, so this one is visually hidden.
	const pageTitle = $derived(
		[themeContent?.hero?.titleLead, themeContent?.hero?.titleAccent].filter(Boolean).join(' ') ||
			brandName
	)
</script>

<div class="noor-homepage">
	<h1 class="sr-only">{pageTitle}</h1>
	<ThemeSections layout={noorLayout} {ctx} />
</div>

<style>
	/*
	 * Baseline styling for the bundled layout. A store that serves its own `themeCss` overrides
	 * these (its stylesheet is injected in <head>, this is component CSS on the same classes);
	 * without one the fallback still reads as noor rather than as unstyled markup.
	 */
	.noor-homepage {
		background: #fff;
		color: var(--noor-ink, #151515);
		font-family: var(--font-body);
	}

	.noor-homepage :global(.noor-section) {
		width: min(var(--container-max, 1240px), 100% - 2 * var(--container-gutter, 16px));
		margin-inline: auto;
		padding-block: clamp(40px, 6vw, 80px);
	}

	.noor-homepage :global(.noor-hero img),
	.noor-homepage :global(.noor-campaign img) {
		display: block;
		width: 100%;
		height: auto;
		object-fit: cover;
	}

	.noor-homepage :global(.ts-heading) {
		margin-bottom: clamp(20px, 3vw, 36px);
		text-align: center;
	}

	.noor-homepage :global(.ts-heading-label) {
		display: block;
		margin-bottom: 8px;
		color: var(--muted-foreground, #6b6b6b);
		font-size: 11px;
		letter-spacing: 0.22em;
		text-transform: uppercase;
	}

	.noor-homepage :global(.ts-heading h2) {
		margin: 0;
		font-family: var(--font-heading);
		font-size: clamp(1.4rem, 2.6vw, 2rem);
		font-weight: 500;
		letter-spacing: 0.06em;
	}

	.noor-homepage :global(.noor-tile-row),
	.noor-homepage :global(.noor-product-row) {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: clamp(12px, 2vw, 28px);
	}

	@media (min-width: 768px) {
		.noor-homepage :global(.noor-tile-row) {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}

		.noor-homepage :global(.noor-product-row) {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}
	}

	.noor-homepage :global(.noor-tile img) {
		display: block;
		width: 100%;
		aspect-ratio: 3 / 4;
		object-fit: cover;
	}

	.noor-homepage :global(.noor-tile span),
	.noor-homepage :global(.noor-tile figcaption) {
		display: block;
		padding-top: 10px;
		font-size: 12px;
		letter-spacing: 0.1em;
		text-align: center;
		text-transform: uppercase;
	}

	.noor-homepage :global(.noor-newsletter) {
		display: grid;
		justify-items: center;
		gap: 16px;
		background: var(--noor-ivory, #f8f6f2);
		text-align: center;
	}

	.noor-homepage :global(.noor-newsletter form) {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 8px;
	}

	.noor-homepage :global(.noor-newsletter input) {
		min-width: 240px;
		border: 1px solid var(--noor-line, #ded8cf);
		background: #fff;
		padding: 11px 14px;
		font-size: 13px;
	}

	.noor-homepage :global(.noor-newsletter button) {
		border: 1px solid var(--noor-ink, #151515);
		background: var(--noor-ink, #151515);
		color: #fff;
		padding: 11px 22px;
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}

	.noor-homepage :global(.ts-empty) {
		display: grid;
		min-height: 200px;
		place-items: center;
		border: 1px solid var(--noor-line, #ded8cf);
		padding: 28px;
		text-align: center;
	}
</style>
