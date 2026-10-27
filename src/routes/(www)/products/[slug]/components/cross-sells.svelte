<script lang="ts">
	import { page } from '$app/state'
	import ProductCard from '$lib/components/product-catalogue/product-card.svelte'
	import { productService } from '$lib/core/services'

	/**
	 * "You may also like" (GoCommerce D133): the products the shop chose for this one, each with
	 * a quick add that becomes a quantity once it is in the bag. Curated only: with none chosen it
	 * draws nothing, and Related products below fills in from the category as before.
	 */
	let { heading = '' }: { heading?: string } = $props()

	let products = $state<any[]>([])
	const slug = $derived(page.data?.product?.slug as string | undefined)

	$effect(() => {
		const s = slug
		const svc = productService as unknown as { listCrossSells?: (q: { product: string; limit?: number }) => Promise<any[]> }
		products = []
		if (!s || typeof svc.listCrossSells !== 'function') return
		let live = true
		svc
			.listCrossSells({ product: s, limit: 12 })
			.then((rows) => {
				if (live) products = rows ?? []
			})
			.catch(() => {})
		return () => {
			live = false
		}
	})
</script>

{#if products.length}
	<section class="edp-related mb-12" data-testid="cross-sells" aria-labelledby="cross-sells-title">
		<header class="edp-related-head">
			<h2 id="cross-sells-title" class="edp-related-title text-center text-lg font-semibold sm:text-xl">{heading || 'You may also like'}</h2>
		</header>
		<!-- A row that scrolls on a phone and a grid from md up, the way the reference shelf reads:
		     cheap accessories a thumb can flick through without leaving the product. -->
		<div class="xs-rail -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-4 md:overflow-visible md:px-0 lg:grid-cols-6">
			{#each products as { id, slug, thumbnail, price, mrp, title, vendor, variants } (id)}
				<div class="w-40 shrink-0 snap-start md:w-auto">
					<ProductCard product={{ id, slug, thumbnail, price, mrp, title, vendor, variants }} hideCartControls={false} />
				</div>
			{/each}
		</div>
	</section>
{/if}

<style>
	.xs-rail {
		scrollbar-width: none;
	}
	.xs-rail::-webkit-scrollbar {
		display: none;
	}
</style>
