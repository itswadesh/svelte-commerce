<script lang="ts">
	import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte'
	import Pagination from '$lib/components/common/pagination.svelte'
	import ProductCard from '$lib/components/product-catalogue/product-card.svelte'
	import { page } from "$app/state"

  const data = $derived(page.data)
	let loading = $state(false)
</script>

{#if loading}
	<ul class="intra-gap grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
		{#each { length: 12 } as _}
			<li class="w-full">
				<Skeleton class="aspect-square w-full rounded-lg bg-gray-100" />
			</li>
		{/each}
	</ul>
{:else}
	{#if !data.products.data.length}
		<div class="intra-gap flex h-96 flex-col items-center justify-center">
			<p class="text-md uppercase text-gray-500">No products found</p>
			<a href="/products" class="text-sm font-bold uppercase tracking-widest text-primary underline underline-offset-4">Clear all filters</a>
		</div>
	{:else}
		<div class="intra-gap grid auto-rows-auto grid-cols-2 lg:grid-cols-3">
			{#each data.products.data as product}
				<ProductCard {product} />
			{/each}
		</div>
	{/if}
	<div class="">
		<Pagination noOfPage={data.products.totalPages} />
	</div>
{/if}
