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
	<section class="cmp-band">
		<div class="page-width">
			{#if heading}
				<header class="cmp-head"><h2 class="cmp-head__title">{heading}</h2></header>
			{/if}
			<ul class="cmp-benefits" class:cmp-benefits--four={items.length === 4} class:cmp-benefits--icons={withIcons}>
				{#each items as item, i (i)}
					{@const Icon = benefitIcon(item.icon)}
					<li class="cmp-benefit bg-card">
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
	.cmp-benefits {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 12px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.cmp-benefit {
		display: flex;
		align-items: flex-start;
		gap: 14px;
		padding: 18px;
		border: 1px solid hsl(var(--border));
		border-radius: var(--radius, 0.5rem);
	}

	/* The built-in home page's promise icons: line icons at 22px in the primary colour. */
	.cmp-benefit :global(.cmp-benefit__icon) {
		flex: none;
		width: 22px;
		height: 22px;
		margin-top: 1px;
		color: hsl(var(--primary));
		stroke-width: 1.5;
	}

	.cmp-benefit__words {
		min-width: 0;
	}

	.cmp-benefits--icons .cmp-benefit__words:first-child {
		padding-left: 36px;
	}

	.cmp-benefit__title {
		margin: 0;
		font-size: 1rem;
		font-weight: 600;
		line-height: 1.3;
		overflow-wrap: anywhere;
	}

	.cmp-benefit__body {
		margin: 6px 0 0;
		color: hsl(var(--muted-foreground));
		font-size: 0.9rem;
		line-height: 1.5;
		overflow-wrap: anywhere;
	}

	@media (min-width: 640px) {
		.cmp-benefits {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
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
