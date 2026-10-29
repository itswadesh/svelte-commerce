<script lang="ts">
	import { page } from '$app/state'
	import { Check } from '@lucide/svelte'
	import { fade } from '$lib/motion'
	import { themeOptions } from '$lib/composer/theme-options.js'

	/**
	 * The product's highlights (GoCommerce D134): up to eight short lines the shop wrote, as a
	 * ticked list in the buy box, above the description. Plain text; never read as markup.
	 *
	 * With the store's pdp_highlights_grid on, this is the "Key highlights" card instead: the
	 * product's attribute answers (fabric, fit …) as label and value pairs two across, then the lines.
	 * The specifications panel leaves those attributes out, so they are listed once.
	 */
	const lines = $derived<string[]>(
		(Array.isArray(page.data?.product?.highlights) ? page.data.product.highlights : [])
			.filter((s: unknown): s is string => typeof s === 'string' && s.trim() !== '')
			.slice(0, 8)
	)
	const grid = $derived(themeOptions(page.data?.themeSettings).pdp_highlights_grid)
	const attributes = $derived<{ name: string; value: string }[]>(
		grid ? (Array.isArray(page.data?.product?.attributes) ? page.data.product.attributes : []).filter((a: any) => a?.name && a?.value) : []
	)
</script>

{#if lines.length || attributes.length}
	<section
		class={grid ? 'rounded-lg border p-4' : 'border-t pt-3'}
		aria-labelledby="pdp-highlights-title"
		data-testid="product-highlights"
		in:fade
	>
		<h2 id="pdp-highlights-title" class="mb-3 text-[length:var(--type-heading,0.875rem)] font-semibold leading-[var(--leading-heading,1.25rem)] text-foreground">{grid ? 'Key highlights' : 'Highlights'}</h2>
		{#if attributes.length}
			<dl class="grid grid-cols-2 gap-x-4 gap-y-3" class:mb-4={lines.length}>
				{#each attributes as attribute (attribute.name)}
					<div class="min-w-0 border-b pb-2">
						<dt class="text-[length:var(--type-dense,0.8125rem)] text-muted-foreground">{attribute.name}</dt>
						<dd class="break-words text-[length:var(--type-ui,0.875rem)] font-medium text-foreground">{attribute.value}</dd>
					</div>
				{/each}
			</dl>
		{/if}
		{#if lines.length}
			<ul class="grid gap-1.5 sm:grid-cols-2 sm:gap-x-4">
				{#each lines as line, i (i)}
					<li class="flex items-start gap-2 text-[length:var(--type-ui,0.875rem)] leading-snug text-foreground">
						<Check class="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" />
						<span class="min-w-0 break-words">{line}</span>
					</li>
				{/each}
			</ul>
		{/if}
	</section>
{/if}
