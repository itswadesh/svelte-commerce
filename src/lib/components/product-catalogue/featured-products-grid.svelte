 <script lang="ts">import Product from '$lib/components/product-catalogue/product-card.svelte'
  import { FeaturedProductsGrid } from '$lib/core/composables/use-featured-products-grid.svelte'

	let { data, displayProduct, loadMore, hasMore = false, loading = false } = $props()
  const featuredProductGrid = new FeaturedProductsGrid({ loadMore, loading, hasMore })
</script>

{#if data?.length === 0}
	<div class="flex h-full items-center justify-center">
		<div class="text-center">
			<h2 class="text-2xl font-semibold tracking-tight">No products found</h2>
			<!-- <p class="text-sm text-muted-foreground">High quality products at affordable price</p> -->
		</div>
	</div>
{:else}
	<div class="!-z-10 grid grid-cols-2 gap-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
		{#each data || [] as p}
			<Product
				product={{
					id: p.id,
					slug: p.slug,
					thumbnail: p.thumbnail,
					price: p.price,
					mrp: p.mrp,
					title: p.title,
					vendor: p.vendor,
					variants: p.variants,
					tag: p.tag
				}}
				aspectRatio="square"
				{displayProduct}
				hideVariations={true}
				hideCartControls={true}
			/>
		{/each}
	</div>

	{#if hasMore || loading}
		<div bind:this={featuredProductGrid.loadMoreTrigger} class="mt-4 flex justify-center">
			{#if loading}
				<div class="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
			{/if}
		</div>
	{/if}
{/if}
