<script lang="ts">
	import { benefitItems, text, type ComposerSection } from '../helpers.js'
	import { benefitIcon } from '../benefit-icons.js'

	/** Up to six short promises, each a title, a line and an optional icon. Statements, not links. */
	let { section }: { section: ComposerSection } = $props()

	const heading = $derived(text(section.settings, 'heading'))
	const items = $derived(benefitItems(section.settings?.items))
	// One icon in the strip keeps the icon column for every benefit, so titles line up.
	const withIcons = $derived(items.some((item) => benefitIcon(item.icon)))
</script>

{#if items.length}
	<!-- Bold and bright (D140): a dark band, the page's own text and background colours swapped. -->
	<section class="cmp-benefits-band">
		<div class="page-width">
			{#if heading}
				<header class="cmp-head"><h2 class="cmp-head__title cmp-benefits__heading">{heading}</h2></header>
			{/if}
			<ul class="cmp-benefits" class:cmp-benefits--four={items.length === 4} class:cmp-benefits--icons={withIcons}>
				{#each items as item, i (i)}
					{@const Icon = benefitIcon(item.icon)}
					<li class="cmp-benefit">
						{#if Icon}<Icon class="cmp-benefit__icon" aria-hidden="true" />{/if}
						<div class="cmp-benefit__words">
							<!-- An h3 only under a section heading; without one it would skip a level. -->
							<svelte:element this={heading ? 'h3' : 'p'} class="cmp-benefit__title">{item.title}</svelte:element>
							{#if item.body}<p class="cmp-benefit__body">{item.body}</p>{/if}
						</div>
					</li>
				{/each}
			</ul>
		</div>
	</section>
{/if}

<style>
	/* A full-width band, not one of the page's plain bands: it keeps its own padding wherever it
	   sits, on the default theme the same space the page leaves between sections. */
	.cmp-benefits-band {
		padding-block: var(--space-section, clamp(28px, 4vw, 48px));
		background: hsl(var(--foreground));
		color: hsl(var(--background));
	}

	.cmp-benefits__heading {
		color: inherit;
	}

	.cmp-benefits {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 20px 16px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.cmp-benefit {
		display: flex;
		align-items: flex-start;
		gap: 12px;
	}

	/* Line icons at 22px in the band's own text colour: the accent can be too dark to see on it. */
	.cmp-benefit :global(.cmp-benefit__icon) {
		flex: none;
		width: 22px;
		height: 22px;
		margin-top: 1px;
		color: currentColor;
		stroke-width: 1.75;
	}

	/* Centred on the title's first line, whichever size the heading step is at (16-18px). */
	:global([data-theme='default']) .cmp-benefit :global(.cmp-benefit__icon) {
		margin-top: calc((var(--type-heading) * var(--leading-heading) - 22px) / 2);
	}

	.cmp-benefit__words {
		min-width: 0;
	}

	.cmp-benefits--icons .cmp-benefit__words:first-child {
		padding-left: 34px;
	}

	.cmp-benefit__title {
		margin: 0;
		font-family: var(--font-heading, inherit);
		font-size: var(--type-heading, 1.0625rem);
		font-weight: 700;
		line-height: var(--leading-heading, 1.3);
		overflow-wrap: anywhere;
	}

	.cmp-benefit__body {
		margin: 6px 0 0;
		color: inherit;
		font-size: var(--type-ui, 0.9rem);
		line-height: var(--leading-ui, 1.5);
		overflow-wrap: anywhere;
	}

	@media (min-width: 1024px) {
		.cmp-benefits {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
		.cmp-benefits--four {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}
	}
</style>
