<script lang="ts">
	import { page } from '$app/state'
	import { useProductState } from '$lib/core/composables/index.js'
	import { Badge } from '$lib/components/ui/badge/index.js'
	import { Skeleton } from '$lib/components/ui/skeleton/index.js'
	import { Check, CircleAlert, PackageX, Clock } from '@lucide/svelte'

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

	/** Below this, say how many are left instead of a bare "In stock". */
	const LOW_STOCK = 5

	const variant = $derived(productState.selectedVariant?.id ? productState.selectedVariant : null)
	const source = $derived<Record<string, any> | null>(variant ?? page.data?.product ?? null)

	const managed = $derived(source?.manageInventory !== false)
	const stock = $derived(Number(source?.stock ?? 0))
	const backorder = $derived(!!source?.allowBackorder)

	const status = $derived.by(() => {
		if (!source) return 'unknown'
		if (!managed) return 'in'
		if (stock > 0) return stock <= LOW_STOCK ? 'low' : 'in'
		return backorder ? 'backorder' : 'out'
	})
</script>

<!-- aria-live: price, SKU and this line all change together when a variant is picked, and this is
     the one that decides whether the shopper can buy at all. -->
<div class="edp-avail flex min-h-7 items-center" aria-live="polite" data-testid="product-availability">
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
</div>
