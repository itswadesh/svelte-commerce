<script lang="ts">
	import { Quote, Star } from '@lucide/svelte'
	import SectionHead from '../SectionHead.svelte'
	import { choice, quoteItems, text, type ComposerSection, type QuoteItem } from '../helpers.js'

	/** What customers said, as the shop entered it: nothing here is ever generated or filled in. */
	let { section }: { section: ComposerSection } = $props()

	const quotes = $derived(quoteItems(section.settings?.items))
	const style = $derived(choice(section.settings?.style, ['wall', 'feature', 'row'], 'wall'))
	const heading = $derived(text(section.settings, 'heading'))
	// One quote has nothing to sit beside or swipe to: it takes the large look whichever was chosen.
	const look = $derived(quotes.length === 1 ? 'feature' : style)
	const first = $derived(quotes[0])
	const rest = $derived(look === 'feature' ? quotes.slice(1) : quotes)
</script>

{#snippet card(item: QuoteItem)}
	<figure class="cmp-quote">
		{#if item.rating}
			<div class="cmp-quote__stars" role="img" aria-label="{item.rating} out of 5 stars">
				{#each { length: item.rating } as _, i (i)}<Star aria-hidden="true" />{/each}
			</div>
		{/if}
		<blockquote class="cmp-quote__words">{item.quote}</blockquote>
		{@render person(item)}
	</figure>
{/snippet}

{#snippet person(item: QuoteItem)}
	{#if item.name || item.detail || item.image}
		<!-- svelte-ignore a11y_figcaption_parent: both looks render this directly inside their figure -->
		<figcaption class="cmp-quote__who">
			{#if item.image}<img class="cmp-quote__photo" src={item.image} alt="" width="44" height="44" loading="lazy" decoding="async" />{/if}
			<span class="cmp-quote__names">
				{#if item.name}<span class="cmp-quote__name">{item.name}</span>{/if}
				{#if item.detail}<span class="cmp-quote__detail">{item.detail}</span>{/if}
			</span>
		</figcaption>
	{/if}
{/snippet}

{#if quotes.length}
	<section class="cmp-band">
		<div class="page-width">
			<SectionHead settings={section.settings} />
			{#if look === 'feature'}
				<div class="cmp-quotes-feature" class:cmp-quotes-feature--alone={!rest.length}>
					<figure class="cmp-quote-large">
						<Quote class="cmp-quote-large__mark" aria-hidden="true" />
						<blockquote class="cmp-quote-large__words">{first.quote}</blockquote>
						{@render person(first)}
					</figure>
					{#if rest.length}
						<ul class="cmp-quotes-stack">
							{#each rest as item, i (i)}<li>{@render card(item)}</li>{/each}
						</ul>
					{/if}
				</div>
			{:else if look === 'row'}
				<!-- A scroller a keyboard can reach: the arrow keys move it once it has focus. -->
				<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
				<ul class="cmp-quotes-row" tabindex="0" aria-label={heading || 'Customer quotes'}>
					{#each rest as item, i (i)}<li>{@render card(item)}</li>{/each}
				</ul>
			{:else}
				<ul class="cmp-quotes-wall">
					{#each rest as item, i (i)}<li>{@render card(item)}</li>{/each}
				</ul>
			{/if}
		</div>
	</section>
{/if}

<style>
	.cmp-quotes-wall,
	.cmp-quotes-row,
	.cmp-quotes-stack {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.cmp-quote {
		display: grid;
		gap: 12px;
		height: 100%;
		margin: 0;
		align-content: start;
		padding: clamp(16px, 1.8vw, 24px);
		border: 1px solid hsl(var(--border));
		border-radius: calc(var(--radius, 0.5rem) * 1.5);
		background: hsl(var(--card, var(--background)));
	}

	.cmp-quote__stars {
		display: flex;
		gap: 2px;
		color: hsl(var(--primary-ink));
	}

	.cmp-quote__stars :global(svg) {
		width: 16px;
		height: 16px;
		fill: currentColor;
	}

	.cmp-quote__words {
		margin: 0;
		font-size: var(--type-body, 1rem);
		line-height: var(--leading-body, 1.5);
		white-space: pre-line;
		overflow-wrap: break-word;
	}

	.cmp-quote__who {
		display: flex;
		align-items: center;
		gap: 12px;
		min-width: 0;
		margin-top: auto;
		padding-top: 4px;
	}

	.cmp-quote__photo {
		flex: none;
		width: 44px;
		height: 44px;
		border-radius: 999px;
		background: hsl(var(--muted));
		object-fit: cover;
	}

	.cmp-quote__names {
		display: grid;
		min-width: 0;
	}

	.cmp-quote__name {
		font-size: var(--type-ui, 0.875rem);
		font-weight: 600;
		overflow-wrap: break-word;
	}

	.cmp-quote__detail {
		color: hsl(var(--muted-foreground));
		font-size: var(--type-dense, 0.8125rem);
		overflow-wrap: break-word;
	}

	/* Columns rather than a grid, so quotes of different lengths pack without gaps. */
	.cmp-quotes-wall {
		columns: 1;
		column-gap: var(--grid-gap-x, 12px);
	}

	.cmp-quotes-wall > li {
		break-inside: avoid;
		margin-bottom: var(--grid-gap-x, 12px);
	}

	.cmp-quotes-wall > li:last-child {
		margin-bottom: 0;
	}

	@media (min-width: 640px) {
		.cmp-quotes-wall {
			columns: 2;
		}
		.cmp-quotes-wall > li:last-child {
			margin-bottom: var(--grid-gap-x, 12px);
		}
	}

	@media (min-width: 1024px) {
		.cmp-quotes-wall {
			columns: 3;
		}
	}

	.cmp-quotes-row {
		display: grid;
		grid-auto-flow: column;
		grid-auto-columns: min(340px, 82vw);
		gap: var(--grid-gap-x, 12px);
		overflow-x: auto;
		overscroll-behavior-x: contain;
		scroll-snap-type: x mandatory;
		scroll-padding-inline: var(--container-gutter, 16px);
		margin-inline: calc(-1 * var(--container-gutter, 16px));
		padding: 4px var(--container-gutter, 16px);
		scrollbar-width: none;
	}

	.cmp-quotes-row::-webkit-scrollbar {
		display: none;
	}

	.cmp-quotes-row > li {
		scroll-snap-align: start;
	}

	.cmp-quotes-row:focus-visible {
		outline: 2px solid hsl(var(--primary-ink));
		outline-offset: -2px;
	}

	.cmp-quotes-feature {
		display: grid;
		gap: var(--grid-gap-x, 12px);
	}

	.cmp-quote-large {
		display: grid;
		gap: 20px;
		align-content: space-between;
		margin: 0;
		padding: clamp(24px, 4vw, 56px);
		border-radius: calc(var(--radius, 0.5rem) * 2);
		background: hsl(var(--foreground));
		color: hsl(var(--background));
		/* The caption's quiet line sits on the dark block, not the page. */
		--muted-foreground: var(--background);
	}

	.cmp-quote-large :global(.cmp-quote-large__mark) {
		width: clamp(28px, 3.4vw, 44px);
		height: clamp(28px, 3.4vw, 44px);
		fill: currentColor;
		stroke-width: 0;
	}

	.cmp-quote-large__words {
		margin: 0;
		font-family: var(--font-heading, inherit);
		font-size: var(--type-section-title, clamp(1.5rem, 3vw, 2.125rem));
		font-weight: var(--weight-heading, 700);
		line-height: var(--leading-title, 1.2);
		letter-spacing: var(--tracking-title, -0.01em);
		white-space: pre-line;
		overflow-wrap: break-word;
	}

	.cmp-quotes-stack {
		display: grid;
		gap: var(--grid-gap-x, 12px);
		align-content: start;
	}

	@media (min-width: 1024px) {
		.cmp-quotes-feature:not(.cmp-quotes-feature--alone) {
			grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
		}
	}
</style>
