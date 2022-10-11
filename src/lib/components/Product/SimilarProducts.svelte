<script>
import ProductCard from '$lib/ProductCard.svelte'

export let similarProducts = []
</script>

{#if similarProducts}
	<div class="mb-5 sm:mb-10">
		<h2 class="mb-5 text-lg font-bold capitalize sm:text-xl md:text-2xl">Similar Products</h2>

		<div
			class="mb-5 grid w-full grid-cols-2 items-start gap-3 sm:mb-10 sm:flex sm:flex-wrap lg:mb-20 lg:gap-6">
			{#each similarProducts as p, px}
				{#if px < 10}
					<ProductCard product="{p._source}" />
				{/if}
			{/each}
		</div>
	</div>
{/if}
