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
import { getAPI, post } from '$lib/util/api'
import { goto, invalidateAll } from '$app/navigation'
import { onMount } from 'svelte'
import { page } from '$app/stores'
import { sorts } from '$lib/config'
import { toast } from '$lib/util'
import DesktopFilter from '$lib/components/DesktopFilter.svelte'
import DummyProductCard from '$lib/DummyProductCard.svelte'
import MobileFilter from '$lib/components/MobileFilter.svelte'
import MobileFooter from '$lib/MobileFooter.svelte'
import noNoDataAvailable from '$lib/assets/no/no-data-availible.png'
import Pagination from '$lib/components/Pagination.svelte'
import PrimaryButton from '$lib/ui/PrimaryButton.svelte'
import ProductCard from '$lib/ProductCard.svelte'
import SEO from '$lib/components/SEO/index.svelte'

export let data

// console.log('data = ', data)
// console.log('Products = ', products)
// console.log('Count = ', count)
// console.log('Facets = ', facets)

let seoProps = {
	title: `Find best ${data.searchData || ' '}`,
	metadescription: `Find best ${data.searchData || ' '}`
}

let showFilter = false
let showSort = false

$: if (data?.count === 0) {
	saveSearchData(data?.searchData)
}

async function saveSearchData(searchData) {
	// try {
	// 	const res1 = await getAPI(`popular-search?store=${$page.data?.store?.id}`)
	// 	// console.log('res1', res1)
	// 	const newArray = res1?.data.map((s) => {
	// 		return s.text
	// 	})
	// 	// console.log('newArray', newArray)
	// 	const isSearchedDataPresent = newArray.includes(searchData)
	// 	// console.log('isSearchedDataPresent', isSearchedDataPresent)

	// 	if (!isSearchedDataPresent) {
	// 		try {
	// 			const res = await post('popular-search', {
	// 				id: 'new',
	// 				popularity: 0,
	// 				text: searchData
	// 			})

	// 		} catch (e) {
	// 		} finally {
	// 		}
	// 	} else return
	// } catch (e) {
	// } finally {
	// }

	try {
		const res = await post(
			'popular-search',
			{
				id: 'new',
				// popularity: 0,
				text: searchData,
				store: $page.data.store?.id
			},
			$page.data.origin
		)
	} catch (e) {
	} finally {
	}
}

async function sortNow(s) {
	if (s == 'null' || s == null || s == undefined || s == 'undefined') {
		$page.url.searchParams.delete('sort')
	} else {
		await $page.url.searchParams.set('sort', s)
	}
	await goto(`/search?${$page.url.searchParams.toString()}`)
	await invalidateAll()
}

async function refreshData() {
	await invalidateAll()
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

<div class="{showFilter || showSort ? 'h-[93vh] overflow-hidden' : 'h-full'}">
	<div class="mb-20 flex w-full flex-col gap-5 lg:flex-row lg:gap-10 lg:p-10">
		{#if data.facets}
			<DesktopFilter
				facets="{data.facets}"
				query="{data.query}"
				class="sticky top-24 hidden lg:block"
				on:clearAll="{refreshData}" />

			<MobileFilter
				facets="{data.facets}"
				bind:showFilter
				bind:showSort
				class="sticky top-14 z-40 block sm:top-20 lg:hidden"
				on:clearAll="{refreshData}" />
		{/if}

		<div class="w-full px-3 sm:px-10 lg:px-0">
			{#if data.products?.length > 0}
				<div class="mb-5 w-full sm:mb-10 lg:mb-20">
					<div class="mb-5 flex flex-wrap items-center justify-between gap-4">
						<h1 class="flex flex-wrap items-center gap-2">
							<span class="text-xl font-bold capitalize md:text-2xl">
								Showing results {#if data.searchData}
									for "{data.searchData}"
								{/if}
							</span>

							-

							<p>
								<span class="text-xl font-bold capitalize md:text-2xl">
									{data.count}
								</span>

								<span>
									{#if data.count > 1}
										Items
									{:else}
										Item
									{/if}
								</span>
							</p>
						</h1>

						<div class="hidden flex-wrap items-center justify-between md:flex">
							<label class="flex items-center gap-2">
								<span>Sort : </span>

								<select
									class="bg-transparent px-2 py-1 font-semibold focus:outline-none hover:underline"
									bind:value="{data.sort}"
									on:change="{() => sortNow(data.sort)}">
									{#each sorts as s}
										<option value="{s.val}">{s.name}</option>
									{/each}
								</select>
							</label>
						</div>
					</div>

					<div
						class="grid w-full grid-cols-2 items-start gap-3 sm:flex sm:flex-wrap sm:justify-between lg:gap-6">
						{#each data.products as p}
							<ProductCard product="{p}" />
						{/each}

						{#each { length: 7 } as _}
							<div class="hidden sm:block">
								<DummyProductCard />
							</div>
						{/each}
					</div>
				</div>
			{:else}
				<div
					class="mb-5 flex w-full items-center justify-center sm:mb-10 lg:mb-20"
					style="height: 60vh;">
					<div class="m-10 flex flex-col items-center justify-center text-center">
						<h1 class="mb-10 text-xl capitalize sm:text-2xl lg:text-3xl">
							{#if data.searchData}You searched for "{data.searchData}"{/if}
						</h1>

						<div class="mb-5">
							<img
								src="{noNoDataAvailable}"
								alt="no data availible"
								class="h-20 w-20 object-contain text-xs" />
						</div>

						<h2>We couldn't find any matches!</h2>

						<p class="mb-5 text-center text-xs text-gray-500">
							Please check the spelling or try searching something else
						</p>

						<PrimaryButton class="text-sm" on:click="{() => goto('/')}">Back to Home</PrimaryButton>
					</div>
				</div>
			{/if}

			{#if !$page?.data?.isDesktop}
				<div class="more">{data.isLoading ? 'loading...' : ''}</div>
			{:else}
				<Pagination
					count="{Math.ceil((data?.count || 1) / data.pageSize)}"
					current="{data?.currentPage || 1}" />
			{/if}
		</div>
	</div>

	<div class="block sm:hidden">
		<MobileFooter />
	</div>
</div>
