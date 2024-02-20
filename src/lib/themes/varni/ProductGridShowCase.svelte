<script>
import { onMount } from 'svelte'
import { page } from '$app/stores'
import { ProductCard } from '$lib/components'
import { services } from '@misiki/litekart-utils'

export let categories = ''
export let title = 'Products'
export let topTitle = ''

let categoriesProducts
let showCount = 10

onMount(async () => {
	categoriesProducts = (
		await services.HomeService.fetchCategoriesProducts({
			categories,
			origin,
			storeId: $page?.data?.storeId
		})
	).data
})
</script>

{#if categoriesProducts?.length}
	<div class="px-3 xl:px-10 py-10">
		<div class="w-full xl:mx-auto xl:max-w-6xl">
			<h2 class="mb-5 uppercase flex items-center gap-4">
				<hr class="flex-1" />

				<div class="flex flex-col gap-1 items-center text-center">
					<span class="text-xs font-medium">{topTitle}</span>

					<span class="text-primary-500 font-bold text-xl">{title}</span>
				</div>

				<hr class="flex-1" />
			</h2>

			<div>
				<ul class="mb-5 grid grid-cols-2 sm:flex sm:flex-wrap justify-between sm:gap-4">
					{#each categoriesProducts as p, px}
						{#if px < showCount}
							<li>
								<ProductCard product="{p}" />
							</li>
						{/if}
					{/each}
				</ul>

				{#if showCount !== 20}
					<div class="flex justify-center">
						<button
							type="button"
							class="border-2 py-2 px-8 border-primary-500 bg-transparent hover:bg-primary-500 transition duration-300 text-primary-500 hover:text-white font-semibold focus:outline-none"
							on:click="{() => (showCount = 20)}">
							SHOW MORE
						</button>
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}
