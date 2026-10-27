<script lang="ts">
	import { page } from '$app/state'
	import { Check } from '@lucide/svelte'
	import { fade } from '$lib/motion'

	/**
	 * The product's highlights (GoCommerce D134): up to eight short lines the shop wrote, as a
	 * ticked list in the buy box, above the description. Plain text; never read as markup.
	 */
	const lines = $derived<string[]>(
		(Array.isArray(page.data?.product?.highlights) ? page.data.product.highlights : [])
			.filter((s: unknown): s is string => typeof s === 'string' && s.trim() !== '')
			.slice(0, 8)
	)
</script>

{#if lines.length}
	<section class="border-t pt-3" aria-labelledby="pdp-highlights-title" data-testid="product-highlights" in:fade>
		<h2 id="pdp-highlights-title" class="mb-2 text-sm font-semibold text-foreground">Highlights</h2>
		<ul class="grid gap-1.5 sm:grid-cols-2 sm:gap-x-4">
			{#each lines as line, i (i)}
				<li class="flex items-start gap-2 text-sm leading-snug text-foreground">
					<Check class="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" />
					<span class="min-w-0 break-words">{line}</span>
				</li>
			{/each}
		</ul>
	</section>
{/if}
