<script lang="ts">
	import ProductCard from '$lib/components/product-catalogue/product-card.svelte'
	import SectionHead from '../SectionHead.svelte'
	import { hexColor, lookItems, type ComposerSection } from '../helpers.js'

	/**
	 * Shop the look line-up (GoCommerce D282): people in a row, each in a look, swaying a little.
	 * Picking one (hover, focus or tap) brings it forward and lists what it wears beside it, each
	 * with the card's own quick add. On a phone the people are a strip that snaps one at a time,
	 * and the one in view is the one picked, with its products in a strip underneath.
	 */
	let { section, priority = false }: { section: ComposerSection; priority?: boolean } = $props()

	const s = $derived(section.settings ?? {})
	const looks = $derived(lookItems(section))
	const background = $derived(hexColor(s.background))
	let active = $state(0)
	const look = $derived(looks[Math.min(active, looks.length - 1)])
	const panelId = $derived(`stl-${section.id}`)

	let strip: HTMLElement | undefined = $state()
	let frame = 0

	// Only a phone's strip scrolls: on a wider screen everyone fits and this never fires.
	function onScroll() {
		cancelAnimationFrame(frame)
		frame = requestAnimationFrame(() => {
			const first = strip?.firstElementChild as HTMLElement | null
			if (!strip || !first) return
			const step = first.offsetWidth + parseFloat(getComputedStyle(strip).columnGap || '0')
			active = Math.max(0, Math.min(looks.length - 1, Math.round(strip.scrollLeft / step)))
		})
	}

	const still = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches

	// A tap on a phone also brings the person fully into view.
	function pick(i: number, scroll = false) {
		active = i
		if (scroll && strip && strip.scrollWidth > strip.clientWidth) {
			;(strip.children[i] as HTMLElement | undefined)?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: still() ? 'auto' : 'smooth' })
		}
	}
</script>

{#if looks.length}
	<section class="cmp-band stl" style:--stl-bg={background || null}>
		<div class="page-width">
			<SectionHead settings={s} />
			<div class="stl__layout">
				<div class="stl__stage" class:stl__stage--tinted={!!background}>
					<ul class="stl__row" bind:this={strip} onscroll={onScroll} aria-label="Looks">
						{#each looks as item, i (i)}
							<li class="stl__slot" style:--stl-i={i}>
								<button
									type="button"
									class="stl__person"
									class:stl__person--on={i === active}
									aria-pressed={i === active}
									aria-controls={panelId}
									onclick={() => pick(i, true)}
									onfocus={() => pick(i)}
									onpointerenter={(e) => e.pointerType === 'mouse' && pick(i)}
								>
									<span class="stl__sway">
										<img
											class="stl__img"
											src={item.image}
											alt={item.alt}
											width="600"
											height="900"
											loading={priority && i === 0 ? 'eager' : 'lazy'}
											fetchpriority={priority && i === 0 ? 'high' : undefined}
											decoding="async"
										/>
									</span>
									<span class="stl__name">{item.label}</span>
								</button>
							</li>
						{/each}
					</ul>
				</div>
				<div class="stl__panel" id={panelId} aria-live="polite">
					{#key active}
						<div class="stl__panel-body">
							<p class="stl__eyebrow">Shop the look</p>
							<h3 class="stl__title">{look.label}</h3>
							{#if look.products.length}
								<div class="stl__products product-grid">
									{#each look.products as product (product.id)}
										<div class="stl__card">
											<ProductCard {product} hideCartControls={false} />
										</div>
									{/each}
								</div>
							{/if}
						</div>
					{/key}
				</div>
			</div>
		</div>
	</section>
{/if}

<style>
	.stl__layout {
		display: grid;
		gap: 1.25rem;
	}

	.stl__stage {
		border-radius: var(--radius, 0.5rem);
	}

	.stl__stage--tinted {
		background: var(--stl-bg);
	}

	/* A phone: one person at a time, the next peeking in so the strip reads as one to swipe. */
	.stl__row {
		display: grid;
		grid-auto-flow: column;
		grid-auto-columns: 72%;
		column-gap: 0.75rem;
		margin: 0;
		padding: 1rem 14%;
		list-style: none;
		overflow-x: auto;
		scroll-snap-type: x mandatory;
		scrollbar-width: none;
	}

	.stl__row::-webkit-scrollbar {
		display: none;
	}

	.stl__slot {
		min-width: 0;
		scroll-snap-align: center;
	}

	.stl__person {
		display: flex;
		width: 100%;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		padding: 0;
		border: 0;
		background: none;
		color: inherit;
		cursor: pointer;
		border-radius: var(--radius, 0.5rem);
		opacity: 0.5;
		transform: scale(0.94);
		transform-origin: 50% 100%;
		transition:
			opacity var(--motion-panel, 220ms) var(--motion-ease, ease-out),
			transform var(--motion-panel, 220ms) var(--motion-ease, ease-out);
	}

	.stl__person:hover {
		opacity: 0.8;
	}

	.stl__person:active {
		transform: scale(0.92);
		transition-duration: var(--motion-fast, 150ms);
	}

	.stl__person--on,
	.stl__person--on:hover {
		opacity: 1;
		transform: translateY(-6px) scale(1.02);
	}

	.stl__person:focus-visible {
		outline: 2px solid hsl(var(--primary-ink));
		outline-offset: 4px;
	}

	/* The idle sway: each person a little out of step with the next, pivoting at the feet. */
	.stl__sway {
		display: block;
		width: 100%;
		transform-origin: 50% 100%;
		animation: stl-sway 5.5s ease-in-out infinite alternate;
		animation-delay: calc(var(--stl-i, 0) * -0.9s);
	}

	@keyframes stl-sway {
		from {
			transform: rotate(-1.2deg);
		}
		to {
			transform: rotate(1.2deg);
		}
	}

	.stl__img {
		display: block;
		width: 100%;
		height: auto;
		aspect-ratio: 2 / 3;
		object-fit: contain;
		object-position: 50% 100%;
		/* Soft sides, so photos shot on a plain backdrop melt into the stage and each other. */
		mask-image: linear-gradient(to right, transparent, #000 14%, #000 86%, transparent);
	}

	.stl__name {
		position: relative;
		padding-bottom: 0.25rem;
		font-size: 0.875rem;
		font-weight: 500;
	}

	.stl__name::after {
		content: '';
		position: absolute;
		inset: auto 0 0;
		height: 2px;
		background: currentColor;
		transform: scaleX(0);
		transition: transform var(--motion-panel, 220ms) var(--motion-ease, ease-out);
	}

	.stl__person--on .stl__name::after {
		transform: scaleX(1);
	}

	.stl__panel-body {
		animation: stl-in var(--motion-panel, 220ms) var(--motion-ease, ease-out);
	}

	@keyframes stl-in {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
	}

	.stl__eyebrow {
		margin: 0;
		font-size: 0.75rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		opacity: 0.7;
	}

	.stl__title {
		margin: 0.25rem 0 0.875rem;
		font-size: 1.25rem;
		font-weight: 600;
	}

	/* A phone: the look's products in a strip a thumb flicks through, as You may also like does. */
	.stl__products {
		display: flex;
		gap: 0.75rem;
		margin-inline: -1rem;
		padding: 0 1rem 0.5rem;
		overflow-x: auto;
		scroll-snap-type: x mandatory;
		scroll-padding-inline: 1rem;
		scrollbar-width: none;
	}

	.stl__products::-webkit-scrollbar {
		display: none;
	}

	.stl__card {
		width: 10rem;
		flex: none;
		scroll-snap-align: start;
	}

	/* Wider: everyone stands in one row beside the panel. */
	@media (min-width: 768px) {
		.stl__layout {
			grid-template-columns: minmax(0, 3fr) minmax(0, 2fr);
			align-items: start;
			gap: 2rem;
		}

		.stl__row {
			display: flex;
			justify-content: center;
			gap: 0;
			padding: 1.5rem 1rem 1rem;
			overflow: visible;
		}

		/* Shoulder to shoulder, as a line-up stands; the picked one in front. */
		.stl__slot {
			position: relative;
			flex: 1 1 0;
			max-width: 240px;
		}

		.stl__slot + .stl__slot {
			margin-inline-start: -3%;
		}

		.stl__slot:has(.stl__person--on) {
			z-index: 1;
		}

		.stl__products {
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			margin: 0;
			padding: 0;
			overflow: visible;
		}

		.stl__card {
			width: auto;
		}
	}

	@media (min-width: 1024px) {
		.stl__layout {
			grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
		}
	}

	/* Still: no sway, no stepping forward, no slide-in. The picked person stays the clear one. */
	@media (prefers-reduced-motion: reduce) {
		.stl__sway,
		.stl__panel-body {
			animation: none;
		}
		.stl__person,
		.stl__person:active,
		.stl__person--on,
		.stl__person--on:hover {
			transform: none;
		}
		.stl__person {
			transition-property: opacity;
		}
		.stl__person--on .stl__name::after {
			transform: scaleX(1);
		}
		.stl__name::after {
			transition: none;
		}
	}
</style>
