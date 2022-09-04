<style>
@media (min-width: 1024px) {
	.top-rem-map {
		top: 85px;
	}
}
.frosted-black {
	backdrop-filter: blur(5px);
	background-color: hsla(0, 0%, 0%, 0.8);
}
.height {
	max-height: 85vh;
}
</style>

<script>
import SEO from '$lib/components/SEO/index.svelte'
import { goto, invalidate } from '$app/navigation'
import { page } from '$app/stores'
import LazyImg from '$lib/components/Image/LazyImg.svelte'
import { toast } from '$lib/util'
import PrimaryButton from '$lib/ui/PrimaryButton.svelte'
import { sorts } from '$lib/config'
import { getAPI } from '$lib/util/api'
import ProductCard from '$lib/ProductCard.svelte'
import DesktopFilter from '$lib/components/DesktopFilter.svelte'
import MobileFilter from '$lib/components/MobileFilter.svelte'
import MobileFooter from '$lib/MobileFooter.svelte'
import Pagination from '$lib/components/Pagination.svelte'

export let data

// console.log('ressss = ', data.ressss)
// console.log('Products = ', products)
// console.log('Count = ', count)
// console.log('Facets = ', facets)

let seoProps = {
	title: `Find best ${data.searchData || ' '}`,
	metadescription: `Find best ${data.searchData || ' '}`
}

async function sortNow(s) {
	if (s == 'null' || s == null || s == undefined || s == 'undefined') {
		$page.url.searchParams.delete('sort')
	} else {
		await $page.url.searchParams.set('sort', s)
	}
	await goto(`/search?${$page.url.searchParams.toString()}`)
	await invalidate()
}

async function refreshData() {
	await invalidate()
	// try {
	// 	const res = await getAPI(`products?${data.query.toString()}`)

	// 	// console.log('refresh res = ', res)

	// 	data.products = res?.data
	// 	data.count = res?.count
	// 	data.facets = res?.facets?.all_aggs
	// 	data.err = !data.products ? 'No result Not Found' : null
	// } catch (e) {
	// 	toast(e, 'error')
	// } finally {
	// }
}
</script>

<SEO {...seoProps} />

<div>
	<div class="mb-20 flex w-full flex-col gap-5 lg:flex-row lg:gap-10 lg:p-10">
		{#if data.facets}
			<DesktopFilter
				facets="{data.facets}"
				query="{data.query}"
				class="sticky top-[7.5rem] hidden lg:top-[5.5rem] lg:block"
				on:clearAll="{refreshData}" />

			<MobileFilter
				facets="{data.facets}"
				class="sticky top-[5rem] z-50 block lg:hidden"
				on:clearAll="{refreshData}" />
		{/if}

		<div class="flex w-full px-3 sm:px-10 lg:px-0">
			{#if data.products}
				<div class="w-full">
					{#if data.products.length > 0}
						<h1 class="mb-5 text-xl font-bold capitalize md:text-2xl">
							Showing results

							{#if data.searchData}
								for "{data.searchData}"
							{/if}

							({data.count})
						</h1>

						<div class="mb-4 hidden flex-wrap items-center justify-between md:flex">
							<label class="flex items-center gap-2">
								<span>Sort : </span>

								<select
									class="bg-transparent px-2 py-1 font-semibold hover:underline focus:outline-none"
									bind:value="{data.sort}"
									on:change="{() => sortNow(data.sort)}">
									{#each sorts as s}
										<option value="{s.val}">{s.name}</option>
									{/each}
								</select>
							</label>
						</div>

						<div
							class="mb-5 grid w-full grid-cols-2 items-start gap-3 sm:mb-10 sm:flex sm:flex-wrap sm:justify-between lg:mb-20 lg:gap-6">
							{#each data.products as p, lx}
								<ProductCard product="{p}" />
							{/each}
						</div>

						<Pagination count="{Math.ceil(data.count / 40)}" current="{data.currentPage}" />
					{:else}
						<div class="flex items-center justify-center" style="height: 60vh;">
							<div class="m-10 flex flex-col items-center justify-center text-center">
								<h1 class="mb-10 text-xl capitalize sm:text-2xl lg:text-3xl">
									Oops!!, No result found {#if data.searchData} for "{data.searchData}"{/if}
								</h1>

								<div class="mb-5">
									<LazyImg
										src="/no/no-data-availible.png"
										alt="no data availible"
										width="80"
										height="80"
										class="h-20 w-20 text-xs" />
								</div>

								<p class="mb-5 text-center text-gray-500">No data found</p>

								<PrimaryButton class="text-sm" on:click="{() => goto('/')}">
									Back to Home
								</PrimaryButton>
							</div>
						</div>
					{/if}
				</div>
			{/if}
		</div>
	</div>

	<!-- CATEGORY DESCRIPTION -->

	{#if data.category?.description}
		<div class="w-full justify-center bg-gray-50 p-3 text-sm sm:p-10">
			<div class="container mx-auto max-w-6xl">
				<p class="prose text-gray-500">
					{@html data.category?.description}
				</p>
			</div>
		</div>
	{/if}

	<div class="block sm:hidden">
		<MobileFooter />
	</div>
</div>
