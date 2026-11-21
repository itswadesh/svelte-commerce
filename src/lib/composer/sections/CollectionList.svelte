<script lang="ts">
	import SectionHead from '../SectionHead.svelte'
	import { collectionCards, intSetting, text, type ComposerSection } from '../helpers.js'

	/**
	 * Collections the merchant picked, each its picture and title, linking to it. The engine
	 * resolves them when the page is read, so a collection deleted since is simply not there; a
	 * list with none left renders nothing.
	 */
	let { section }: { section: ComposerSection } = $props()

	const cards = $derived(collectionCards(section))
	const columns = $derived(intSetting(section.settings?.columns, 2, 4, 3))
	const overlay = $derived(text(section.settings, 'style') === 'overlay')
</script>

{#if cards.length}
	<section class="cmp-band">
		<div class="page-width">
			<SectionHead settings={section.settings} />
			<ul class="cmp-cols cmp-cols--{columns}" class:cmp-cols--overlay={overlay}>
				{#each cards as card (card.id)}
					<li>
						<a class="cmp-col-card" href={card.link}>
							<span class="cmp-col-card__media">
								{#if card.image}
									<img src={card.image} alt="" width="600" height="750" loading="lazy" decoding="async" />
								{/if}
							</span>
							{#if overlay}
								<span class="cmp-col-card__caption">
									<span class="cmp-col-card__title">{card.title}</span>
									{#if card.description}
										<span class="cmp-col-card__line">{card.description}</span>
									{/if}
								</span>
							{:else}
								<span class="cmp-col-card__title">{card.title}</span>
							{/if}
						</a>
					</li>
				{/each}
			</ul>
		</div>
	</section>
{/if}

<style>
	.cmp-cols {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 12px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	@media (min-width: 768px) {
		.cmp-cols {
			gap: 20px;
		}
		.cmp-cols--3 {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
		.cmp-cols--4 {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}
	}

	.cmp-col-card {
		display: grid;
		gap: 10px;
		color: hsl(var(--foreground));
	}

	/* A picture's box is set before it arrives, and a collection without one keeps the box. */
	.cmp-col-card__media {
		display: block;
		overflow: hidden;
		border-radius: var(--radius, 0.5rem);
		aspect-ratio: 4 / 5;
		background: hsl(var(--muted));
	}

	.cmp-col-card__media img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 300ms var(--motion-ease, ease-out);
	}

	.cmp-col-card:hover .cmp-col-card__media img {
		transform: scale(1.04);
	}

	.cmp-col-card__title {
		font-family: var(--font-heading, inherit);
		font-size: 1rem;
		font-weight: 500;
		line-height: 1.3;
		overflow-wrap: anywhere;
		transition: opacity var(--motion-fast, 150ms) var(--motion-ease, ease-out);
	}

	.cmp-col-card:hover .cmp-col-card__title {
		text-decoration: underline;
		text-underline-offset: 3px;
	}

	.cmp-col-card:active .cmp-col-card__title {
		opacity: 0.7;
	}

	@media (prefers-reduced-motion: reduce) {
		.cmp-col-card__media img {
			transition: none;
		}
		.cmp-col-card:hover .cmp-col-card__media img {
			transform: none;
		}
	}

	.cmp-cols--overlay .cmp-col-card {
		position: relative;
		overflow: hidden;
		border-radius: var(--radius, 0.5rem);
	}

	.cmp-cols--overlay .cmp-col-card__media {
		aspect-ratio: 1 / 1;
	}

	.cmp-col-card__caption {
		--fade: 32px;
		--shade-under-words: rgb(0 0 0 / 0.6);
		position: absolute;
		inset: auto 0 0;
		display: grid;
		gap: 2px;
		padding: var(--fade) 12px 12px;
		color: white;
		background: linear-gradient(to top, rgb(0 0 0 / 0.75), var(--shade-under-words) calc(100% - var(--fade) + 6px), rgb(0 0 0 / 0));
	}

	@media (min-width: 1024px) {
		.cmp-col-card__caption {
			--fade: 56px;
			padding-inline: 16px;
			padding-bottom: 16px;
		}
	}

	.cmp-cols--overlay .cmp-col-card__title {
		font-weight: var(--weight-heading, 600);
		line-height: 1.3;
	}

	.cmp-cols--overlay .cmp-col-card__title,
	.cmp-col-card__line {
		display: -webkit-box;
		overflow: hidden;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
	}

	.cmp-col-card__line {
		font-size: var(--type-label, 0.75rem);
		line-height: 1.35;
		color: rgb(255 255 255 / 0.85);
	}

	@media (prefers-reduced-motion: reduce) {
		.cmp-cols--overlay .cmp-col-card__media img {
			transition: opacity var(--motion-emphasis, 300ms) var(--motion-ease, ease-out);
		}
		.cmp-cols--overlay .cmp-col-card:hover .cmp-col-card__media img {
			opacity: 0.85;
		}
	}
</style>
