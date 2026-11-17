<script lang="ts">
	import ProductCard from '$lib/components/product-catalogue/product-card.svelte'
	import SectionHead from '../SectionHead.svelte'
	import { fittingRoom, hexColor, outfitFor, type ComposerSection } from '../helpers.js'

	/**
	 * Fitting room (GoCommerce D284): tops on one side, bottoms on the other, and in the middle the
	 * pair the shopper picked, worn by a person when the shop has photographed that pair, else the
	 * two products' own pictures one above the other. Both products sit underneath with Add to bag.
	 * On a phone the middle comes first, then a strip of tops and a strip of bottoms.
	 */
	let { section, priority = false }: { section: ComposerSection; priority?: boolean } = $props()

	const s = $derived(section.settings ?? {})
	const room = $derived(fittingRoom(section))
	const background = $derived(hexColor(s.background))
	let topIndex = $state(0)
	let bottomIndex = $state(0)
	const top = $derived(room.tops[Math.min(topIndex, room.tops.length - 1)])
	const bottom = $derived(room.bottoms[Math.min(bottomIndex, room.bottoms.length - 1)])
	const outfit = $derived(top && bottom ? outfitFor(room, top, bottom) : null)
	const stageId = $derived(`fr-${section.id}`)

	const name = (p: any) => p?.title || p?.name || ''
	const picture = (p: any) => p?.thumbnail || p?.image_url || ''
</script>

{#snippet rack(items: any[], label: string, picked: number, choose: (i: number) => void)}
	<div class="fr__rack" role="group" aria-label={label}>
		{#each items as item, i (item.id)}
			<button
				type="button"
				class="fr__piece"
				class:fr__piece--on={i === picked}
				aria-pressed={i === picked}
				aria-controls={stageId}
				onclick={() => choose(i)}
			>
				{#if picture(item)}
					<img class="fr__piece-img" src={picture(item)} alt="" width="240" height="240" loading="lazy" decoding="async" />
				{/if}
				<span class="fr__piece-name">{name(item)}</span>
			</button>
		{/each}
	</div>
{/snippet}

{#if top && bottom}
	<section class="cmp-band fr" style:--fr-bg={background || null}>
		<div class="page-width">
			<SectionHead settings={s} />
			<div class="fr__layout" class:fr__layout--tinted={!!background}>
				<div class="fr__side fr__side--tops">{@render rack(room.tops, 'Tops', topIndex, (i) => (topIndex = i))}</div>
				<div class="fr__stage" id={stageId} aria-live="polite">
					{#key `${top.id}:${bottom.id}`}
						<div class="fr__worn">
							{#if outfit}
								<img
									class="fr__person"
									src={outfit.image}
									alt={outfit.alt || `${name(top)} with ${name(bottom)}`}
									width="600"
									height="900"
									loading={priority ? 'eager' : 'lazy'}
									decoding="async"
								/>
							{:else}
								<div class="fr__stack" role="img" aria-label={`${name(top)} with ${name(bottom)}`}>
									{#if picture(top)}<img class="fr__stack-img" src={picture(top)} alt="" decoding="async" />{/if}
									{#if picture(bottom)}<img class="fr__stack-img" src={picture(bottom)} alt="" decoding="async" />{/if}
								</div>
							{/if}
						</div>
					{/key}
					<p class="fr__caption"><span>{name(top)}</span><span aria-hidden="true">·</span><span>{name(bottom)}</span></p>
				</div>
				<div class="fr__side fr__side--bottoms">{@render rack(room.bottoms, 'Bottoms', bottomIndex, (i) => (bottomIndex = i))}</div>
			</div>
			<div class="fr__buy product-grid">
				{#each [top, bottom] as product (product.id)}
					<div class="fr__card"><ProductCard {product} hideCartControls={false} /></div>
				{/each}
			</div>
		</div>
	</section>
{/if}

<style>
	.fr__layout {
		display: grid;
		gap: 1rem;
		grid-template-areas: 'stage' 'tops' 'bottoms';
		border-radius: var(--radius, 0.5rem);
	}

	.fr__layout--tinted {
		padding: 1rem;
		background: var(--fr-bg);
	}

	.fr__side--tops {
		grid-area: tops;
	}

	.fr__side--bottoms {
		grid-area: bottoms;
	}

	.fr__stage {
		grid-area: stage;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}

	.fr__worn {
		width: min(100%, 22rem);
		aspect-ratio: 2 / 3;
		overflow: hidden;
		animation: fr-in var(--motion-panel, 220ms) var(--motion-ease, ease-out);
	}

	@keyframes fr-in {
		from {
			opacity: 0;
			transform: scale(0.98);
		}
	}

	.fr__person {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: contain;
		object-position: 50% 100%;
	}

	/* No photo of this pair: the top over the bottom, as they would be worn. */
	.fr__stack {
		display: grid;
		grid-template-rows: minmax(0, 1fr) minmax(0, 1fr);
		height: 100%;
	}

	.fr__stack-img {
		width: 100%;
		height: 100%;
		min-height: 0;
		object-fit: contain;
	}

	.fr__caption {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.375rem;
		margin: 0;
		font-size: 0.875rem;
		font-weight: 500;
		text-align: center;
	}

	/* A phone: each rack is a strip a thumb flicks through. */
	.fr__rack {
		display: flex;
		gap: 0.5rem;
		overflow-x: auto;
		scroll-snap-type: x mandatory;
		scrollbar-width: none;
		padding-block: 0.25rem;
	}

	.fr__rack::-webkit-scrollbar {
		display: none;
	}

	.fr__piece {
		display: flex;
		flex: none;
		width: 6.5rem;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
		padding: 0.375rem;
		border: 1px solid transparent;
		border-radius: var(--radius, 0.5rem);
		background: none;
		color: inherit;
		cursor: pointer;
		scroll-snap-align: start;
		opacity: 0.65;
		transition:
			opacity var(--motion-fast, 150ms) var(--motion-ease, ease-out),
			transform var(--motion-fast, 150ms) var(--motion-ease, ease-out),
			border-color var(--motion-fast, 150ms) var(--motion-ease, ease-out);
	}

	.fr__piece:hover {
		opacity: 0.9;
		transform: translateY(-2px);
	}

	.fr__piece:active {
		transform: scale(0.96);
	}

	.fr__piece--on,
	.fr__piece--on:hover {
		opacity: 1;
		border-color: hsl(var(--foreground));
	}

	.fr__piece:focus-visible {
		outline: 2px solid hsl(var(--primary-ink));
		outline-offset: 2px;
	}

	.fr__piece-img {
		display: block;
		width: 100%;
		height: auto;
		aspect-ratio: 1;
		object-fit: contain;
	}

	.fr__piece-name {
		display: -webkit-box;
		width: 100%;
		overflow: hidden;
		font-size: 0.75rem;
		line-height: 1.3;
		text-align: center;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.fr__buy {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.75rem;
		max-width: 32rem;
		margin: 1.25rem auto 0;
	}

	/* Wider: tops down the left, bottoms down the right, the pair between them. */
	@media (min-width: 768px) {
		.fr__layout {
			grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr) minmax(0, 1fr);
			grid-template-areas: 'tops stage bottoms';
			align-items: center;
			gap: 1.5rem;
		}

		.fr__rack {
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			overflow: visible;
		}

		.fr__piece {
			width: auto;
		}
	}

	/* Still: no rise, no press, no fade in. The picked piece stays clear by its border. */
	@media (prefers-reduced-motion: reduce) {
		.fr__worn {
			animation: none;
		}
		.fr__piece,
		.fr__piece:hover,
		.fr__piece:active {
			transform: none;
		}
		.fr__piece {
			transition-property: opacity, border-color;
		}
	}
</style>
