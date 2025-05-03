<script lang="ts">
	import ProductCard from '$lib/components/product-catalogue/product-card.svelte'
	import { useProductState } from '$lib/core/composables/product'

	const productState = useProductState()
</script>

{#if productState.isLoadingRelatedProducts || productState.productsOfSameCategory.length > 0}
	<div class="mx-2 mb-20 mt-4">
		<h1 class="my-4 text-center text-2xl font-bold">Related Products</h1>

		{#if productState.isLoadingRelatedProducts}
			<div class="flex justify-center py-8">
				<div class="border-primary-500 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
			</div>
		{:else}
			<div class="!-z-10 grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
				{#each productState.productsOfSameCategory as { id, slug, thumbnail, price, mrp, title, vendor, variants }}
					<ProductCard
						product={{
							id,
							slug,
							thumbnail,
							price,
							mrp,
							title,
							vendor,
							variants
						}}
						aspectRatio="square"
					/>
				{/each}
			</div>
		{/if}
	</div>
{/if}

