<script>
// import { CategoryService } from '$lib/services'
// import { page } from '$app/stores'
import { onMount } from 'svelte'
import DummyProductCard from '$lib/DummyProductCard.svelte'
import ProductCard from '$lib/ProductCard.svelte'
import ProductSkeleton from '$lib/ui/ProductSkeleton.svelte'

// export let categorySlug

export let data

// console.log('zzzzzzzzzzzzzzzzzz', data)

let loading = false

onMount(async () => {
	try {
		loading = true

		// data = await CategoryService.fetchProductsOfCategory({
		// 	origin: $page?.data?.origin,
		// 	storeId: $page?.data?.store?.id,
		// 	categorySlug,
		// 	server: false
		// })
	} catch (e) {
	} finally {
		loading = false
	}
})

// console.log('data', data)
</script>

{#if loading}
	<ul
		class="mb-5 grid w-full grid-cols-2 items-start gap-3 sm:mb-10 sm:flex sm:flex-wrap sm:justify-between lg:gap-6">
		{#each { length: 12 } as _}
			<li>
				<ProductSkeleton />
			</li>
		{/each}

		{#each { length: 7 } as _}
			<li class="hidden sm:block">
				<DummyProductCard />
			</li>
		{/each}
	</ul>
{:else if data?.length}
	<div class="mb-5 sm:mb-10">
		<div class="sticky top-14 z-30 lg:static lg:z-0 mb-3 bg-white py-2">
			<h2 class="font-bold capitalize sm:text-lg border-b-4 border-zinc-800 max-w-max">
				Similar Products
			</h2>
		</div>

		<div
			class="mb-5 grid w-full grid-cols-2 items-start gap-3 sm:mb-10 sm:flex sm:flex-wrap sm:justify-between lg:gap-6">
			{#each data as p}
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
