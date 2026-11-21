<script lang="ts">
	import ProductCard from '$lib/components/product-catalogue/product-card.svelte'
	import ComposerButton from '../ComposerButton.svelte'
	import SectionHead from '../SectionHead.svelte'
	import { gridColumnsClass, intSetting, safeHref, text, type ComposerSection } from '../helpers.js'

	/**
	 * A shelf of products the engine resolved live — prices and stock never live in the layout.
	 * A grid with nothing on sale renders nothing at all: an empty heading would promise products
	 * the shopper cannot find.
	 */
	let { section, aspectRatio = '4 / 5', priority = false }: { section: ComposerSection; aspectRatio?: string; priority?: boolean } = $props()

	// Two rows of a phone grid are on screen at first. Their pictures come with the page instead of
	// waiting for the script to wake them, which kept a phone's first product picture ~7 s late.
	const PRIORITY_CARDS = 4

	const s = $derived(section.settings ?? {})
	const products = $derived((section.products ?? []).slice(0, intSetting(s.limit, 1, 24, 24)))
	const row = $derived(text(s, 'mobile_layout') === 'row' ? ' cmp-grid--row' : '')
	const columns = $derived(gridColumnsClass(s.columns) + row)

	// Beside a picture the shelf is a block of the page: past six cards it would outgrow the picture.
	const SHOWCASE_MAX = 6
	const picture = $derived(safeHref(s.image))
	const showcase = $derived(text(s, 'style') === 'showcase' && !!picture)
	const shown = $derived(showcase ? products.slice(0, SHOWCASE_MAX) : products)
	const heading = $derived(text(s, 'heading'))
	const eyebrow = $derived(text(s, 'eyebrow'))
	const subtitle = $derived(text(s, 'subtitle'))
	const alt = $derived(text(s, 'image_alt') || heading)
	// Two or four sit two across. Three across for three, five or six, so three cards leave no hole.
	const showcaseColumns = $derived((shown.length % 2 || shown.length > 4 ? 'grid-cols-2 lg:grid-cols-3' : 'grid-cols-2') + row)
</script>

{#if products.length && showcase}
	<section class="cmp-band">
		<div class="page-width">
			<div class="cmp-show" class:cmp-show--right={text(s, 'image_side') === 'right'}>
				<div class="cmp-show__picture">
					<img class="cmp-show__img" src={picture} {alt} width="900" height="1100" loading={priority ? 'eager' : 'lazy'} decoding="async" />
					<div class="cmp-show__words">
						{#if eyebrow}<span class="cmp-eyebrow-ink">{eyebrow}</span>{/if}
						{#if heading}<h2 class="cmp-show__title">{heading}</h2>{/if}
						{#if subtitle}<p class="cmp-show__line">{subtitle}</p>{/if}
						<ComposerButton href={s.view_all_link} label={text(s, 'view_all_text') || 'View all'} />
					</div>
				</div>
				<div class="product-grid cmp-show__cards grid gap-3 sm:gap-5 {showcaseColumns}">
					{#each shown as product, i (product.id || product.slug)}
						<ProductCard {product} {aspectRatio} priority={priority && i < PRIORITY_CARDS} />
					{/each}
				</div>
			</div>
		</div>
	</section>
{:else if products.length}
	<section class="cmp-band">
		<div class="page-width">
			<SectionHead settings={s} />
			<div class="product-grid grid gap-3 sm:gap-5 {columns}">
				{#each products as product, i (product.id || product.slug)}
					<ProductCard {product} {aspectRatio} priority={priority && i < PRIORITY_CARDS} />
				{/each}
			</div>
		</div>
	</section>
{/if}

<style>
	.cmp-show {
		display: grid;
		gap: var(--grid-gap-y, 16px);
	}

	.cmp-show__picture {
		position: relative;
		isolation: isolate;
		display: flex;
		align-items: flex-end;
		min-width: 0;
		min-height: clamp(340px, 80vw, 480px);
		overflow: hidden;
		border-radius: calc(var(--radius, 0.5rem) * 2);
		background: hsl(var(--muted));
		color: hsl(var(--on-photo, 0 0% 100%));
		--foreground: var(--on-photo, 0 0% 100%);
	}

	.cmp-show__img {
		position: absolute;
		inset: 0;
		z-index: -2;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.cmp-show__picture::after {
		content: '';
		position: absolute;
		inset: 0;
		z-index: -1;
		background: linear-gradient(
			to top,
			hsl(var(--photo-shade, 0 0% 0%) / 0.74) 0%,
			hsl(var(--photo-shade, 0 0% 0%) / 0.3) 45%,
			hsl(var(--photo-shade, 0 0% 0%) / 0) 75%
		);
	}

	.cmp-show__words {
		display: grid;
		gap: 12px;
		justify-items: start;
		min-width: 0;
		padding: clamp(20px, 3vw, 40px);
	}

	.cmp-show__title {
		margin: 0;
		font-family: var(--font-heading, inherit);
		font-size: var(--type-section-title, clamp(1.5rem, 3vw, 2.125rem));
		font-weight: var(--weight-heading, 700);
		line-height: var(--leading-title, 1.15);
		letter-spacing: var(--tracking-title, -0.01em);
		text-wrap: balance;
		overflow-wrap: break-word;
		min-width: 0;
	}

	.cmp-show__line {
		margin: 0;
		font-size: var(--type-body, 1rem);
		line-height: var(--leading-body, 1.5);
		overflow-wrap: break-word;
	}

	.cmp-show__words :global(.cmp-btn:focus-visible) {
		outline: 3px solid hsl(var(--on-photo, 0 0% 100%));
		outline-offset: 3px;
	}

	.cmp-show__cards {
		min-width: 0;
		align-content: start;
	}

	@media (min-width: 1024px) {
		.cmp-show {
			grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
			align-items: stretch;
		}
		/* It stands as tall as the cards, but a short row must not squash it to a strip. */
		.cmp-show__picture {
			min-height: 440px;
		}
		.cmp-show--right .cmp-show__picture {
			order: 2;
		}
	}

	/* Global, not scoped: a scoped rule stamps Svelte's class on every product grid's element,
	   changing the markup of grids without the row. overflow-x: auto clips the block axis too;
	   the 4px block padding keeps a card's focus ring unclipped. */
	@media (max-width: 767.98px) {
		:global(.product-grid.cmp-grid--row) {
			grid-template-columns: none;
			grid-auto-flow: column;
			grid-auto-columns: min(165px, 42vw);
			overflow-x: auto;
			overscroll-behavior-x: contain;
			scroll-snap-type: x mandatory;
			scroll-padding-inline: var(--container-gutter, 16px);
			margin: -4px calc(-1 * var(--container-gutter, 16px));
			padding: 4px var(--container-gutter, 16px);
			scrollbar-width: none;
		}
		:global(.cmp-grid--row::-webkit-scrollbar) {
			display: none;
		}
		:global(.cmp-grid--row > *) {
			scroll-snap-align: start;
		}
	}

	@media (max-width: 767.98px) and (prefers-reduced-motion: no-preference) {
		:global(.cmp-grid--row) {
			scroll-behavior: smooth;
		}
	}
</style>
