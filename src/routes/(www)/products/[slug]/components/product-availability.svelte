<script lang="ts">
	import { page } from '$app/state'
	import { useProductState } from '$lib/core/composables/index.js'
	import { Badge } from '$lib/components/ui/badge/index.js'
	import { Skeleton } from '$lib/components/ui/skeleton/index.js'
	import { Check, CircleAlert, PackageX, Clock, CalendarClock } from '@lucide/svelte'
	import { shipsFromLabel } from '$lib/utils/ships-from'
	import { themeOptions } from '$lib/composer/theme-options.js'
	import { stockSourceOf } from '$lib/product/size-choice.svelte'

	/**
	 * Whether the thing in the buy box can actually be bought.
	 *
	 * The page previously ran from the option pills straight to the CTA: no stock statement, no
	 * dispatch estimate, nothing. The only availability signal was a CTA label that was suppressed
	 * while `productState.isLoading` was true — which it is throughout SSR, so a crawler and a
	 * no-JS shopper were told nothing at all.
	 *
	 * The answer is read from the selected variant, falling back to the product record the server
	 * already sent. That fallback is what keeps this line correct before hydration, so no skeleton
	 * is shown for a value the page already knows.
	 */
	const productState = useProductState()

	/** At or below this, say how many are left instead of a bare "In stock" (the store's pdp_low_stock_at; 0 never). */
	const lowStockAt = $derived(themeOptions(page.data?.themeSettings).pdp_low_stock_at)

	// Shared with Add to bag (size-choice.svelte.ts), so the badge and the button never disagree.
	const source = $derived<Record<string, any> | null>(stockSourceOf(page.data?.product, productState.selectedVariant))

	const managed = $derived(source?.manageInventory !== false)
	const stock = $derived(Number(source?.stock ?? 0))
	const backorder = $derived(!!source?.allowBackorder)
	// The merchant's pre-order day (D356). The product record has none of its own, so an optionless
	// product reads its one variant's before a variant is picked.
	const shipsFrom = $derived.by(() => {
		const variants = (page.data?.product?.variants ?? []) as unknown[]
		return shipsFromLabel(source?.shipsFrom ? source : variants.length === 1 ? variants[0] : null)
	})

	const status = $derived.by(() => {
		if (!source) return 'unknown'
		if (!managed) return 'in'
		if (stock > 0) return stock <= lowStockAt ? 'low' : 'in'
		return backorder ? 'backorder' : 'out'
	})
</script>

<!-- aria-live: price, SKU and this line all change together when a variant is picked, and this is
     the one that decides whether the shopper can buy at all. -->
<div class="edp-avail flex min-h-7 flex-wrap items-center gap-x-3 gap-y-1" aria-live="polite" data-testid="product-availability">
	{#if status === 'unknown'}
		<Skeleton class="h-5 w-28" />
	{:else if status === 'out'}
		<Badge variant="outline" class="gap-1.5 border-destructive/30 bg-destructive/10 py-1 font-medium text-destructive">
			<PackageX class="size-3.5" aria-hidden="true" />
			Out of stock
		</Badge>
	{:else if status === 'low'}
		<Badge variant="outline" class="gap-1.5 border-warning/30 bg-warning/10 py-1 font-medium text-warning">
			<CircleAlert class="size-3.5" aria-hidden="true" />
			Only {stock} left
		</Badge>
	{:else if status === 'backorder'}
		<Badge variant="outline" class="gap-1.5 border py-1 font-medium text-muted-foreground">
			<Clock class="size-3.5" aria-hidden="true" />
			Available to order
		</Badge>
	{:else}
		<Badge variant="outline" class="gap-1.5 border-success/30 bg-success/10 py-1 font-medium text-success">
			<Check class="size-3.5" aria-hidden="true" />
			In stock
		</Badge>
	{/if}
	{#if shipsFrom && status !== 'out' && status !== 'unknown'}
		{#key shipsFrom}
			<span class="flex animate-in items-center gap-1.5 text-sm font-medium text-foreground duration-fast ease-standard fade-in-0" data-testid="product-ships-from">
				<CalendarClock class="size-3.5" aria-hidden="true" />
				{shipsFrom}
			</span>
		{/key}
	{/if}
</div>
