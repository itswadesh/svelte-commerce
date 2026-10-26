<script lang="ts">
	import { benefitItems, text, type ComposerSection } from '../helpers.js'

	/** Up to six short promises, each a title and a line. Statements, not links. */
	let { section }: { section: ComposerSection } = $props()

	const heading = $derived(text(section.settings, 'heading'))
	const items = $derived(benefitItems(section.settings?.items))
</script>

{#if items.length}
	<section class="cmp-band">
		<div class="page-width">
			{#if heading}
				<header class="cmp-head"><h2 class="cmp-head__title">{heading}</h2></header>
			{/if}
			<ul class="cmp-benefits" class:cmp-benefits--four={items.length === 4}>
				{#each items as item, i (i)}
					<li class="cmp-benefit bg-card">
						<!-- An h3 only under a section heading; without one it would skip a level. -->
						<svelte:element this={heading ? 'h3' : 'p'} class="cmp-benefit__title">{item.title}</svelte:element>
						{#if item.body}<p class="cmp-benefit__body">{item.body}</p>{/if}
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
		padding: 18px;
		border: 1px solid hsl(var(--border));
		border-radius: var(--radius, 0.5rem);
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
