<script lang="ts">
import type { Product } from '$lib/types'
import { onMount } from 'svelte'
import { page } from '$app/stores'
import { ProductCard, DummyProductCard } from '$lib/components'

import { ProductService } from '$lib/services'

let name = 'Product Tab'
let allCoreCategories = [
	{
		title: 'New Products',
		value: 'new'
	},
	{
		title: 'Best Selling',
		value: 'best-selling'
	},
	{
		title: 'Featured Products',
		value: 'featured'
	},
	{
		title: 'Most Popular',
		value: 'popular'
	}
]

let selectedCategory = 'new'
let loading = false
let products: Product[] = []

onMount(async () => {
	try {
		loading = true
		products = await ProductService.fetchProducts({
			origin: $page?.data?.origin,
			storeId: $page?.data?.storeId
		})
	} catch (e) {
	} finally {
		loading = false
	}

	filterProducts('new')
})

function filterProducts(selectedCategory: string) {
	products = products?.filter((p) => {
		return p.new
	})
}
</script>

<div>
	<div
		class="mb-5 flex flex-wrap items-center justify-between gap-5 border-b-2 border-zinc-200 p-3 py-5 pb-2 sm:mb-10 sm:px-10">
		<h2 class="text-xl font-bold uppercase sm:text-2xl">Bracelets & Bangles</h2>

		<ul
			class="hidden max-w-max flex-wrap divide-x divide-zinc-500 text-sm font-semibold uppercase leading-4 md:flex">
			{#each allCoreCategories as c}
				<li class="relative">
					<label
						for="{c.value}"
						class="relative flex cursor-pointer items-center gap-2 whitespace-nowrap px-3 transition duration-300">
						<input
							type="radio"
							bind:group="{selectedCategory}"
							name="{name}"
							id="{c.value}"
							class="hidden"
							value="{c.value}"
							on:click="{() => filterProducts(c.value)}" />

						<span class="{selectedCategory === c.value ? 'text-zinc-800' : 'text-zinc-500'}">
							{c.title}
						</span>
					</label>

					<div class="absolute inset-x-0 -bottom-5 hidden items-center justify-center sm:flex">
						<div class="{selectedCategory === c.value ? 'opacity-100' : 'opacity-0'}">
							<div class="inline-block w-6 overflow-hidden">
								<div class="h-3 w-3 origin-bottom-left rotate-45 transform bg-zinc-200"></div>
							</div>
						</div>
					</div>
				</li>
			{/each}
		</ul>

		<ul class="grid w-full grid-cols-2 gap-2 text-sm font-semibold uppercase leading-4 md:hidden">
			{#each allCoreCategories as c}
				<li>
					<label
						for="{c.value}"
						class="flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap border p-2 px-3
						{selectedCategory === c.value ? 'border-zinc-800' : 'border-zinc-500'}">
						<input
							type="radio"
							bind:group="{selectedCategory}"
							name="{name}"
							id="{c.value}"
							class="hidden"
							value="{c.value}"
							on:click="{() => filterProducts(c.value)}" />

						<span class="{selectedCategory === c.value ? 'text-zinc-800' : 'text-zinc-500'}">
							{c.title}
						</span>
					</label>
				</li>
			{/each}
		</ul>
	</div>

	<ul
		class="grid w-full grid-cols-2 items-start border-t sm:flex sm:flex-wrap sm:justify-between sm:gap-3 sm:border-t-0 sm:px-10 lg:gap-6">
		{#each products as p}
			<li>
				<ProductCard product="{p}" />
			</li>
		{/each}

		{#each { length: 8 } as _}
			<li class="hidden sm:block">
				<DummyProductCard />
			</li>
		{/each}
	</ul>
</div>
