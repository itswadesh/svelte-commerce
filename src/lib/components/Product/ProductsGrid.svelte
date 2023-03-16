<script>
import DummyProductCard from '$lib/DummyProductCard.svelte'
import ProductCard from '$lib/ProductCard.svelte'

export let title = 'Recommended Products'
export let products = []
</script>

{#if products}
	<div class="mb-5 sm:mb-10">
		<h2 class="mb-5 text-lg font-bold capitalize sm:text-xl md:text-2xl">{title}</h2>

		<div
			class="mb-5 grid w-full grid-cols-2 items-start gap-3 sm:mb-10 sm:flex sm:flex-wrap sm:justify-between lg:mb-20 lg:gap-6">
			{#each products as p, px}
				<ProductCard product="{p}" />
			{/each}

			{#each { length: 7 } as _}
				<div class="hidden sm:block">
					<DummyProductCard />
				</div>
			{/each}
		</div>
	</div>
{/if}
