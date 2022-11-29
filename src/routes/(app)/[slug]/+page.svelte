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
import { dateOnly, toast } from '$lib/util'
import { fade } from 'svelte/transition'
import { getAPI } from '$lib/util/api'
import { goto, invalidateAll } from '$app/navigation'
import { onMount } from 'svelte'
import { page } from '$app/stores'
import { sorts } from '$lib/config'
import DesktopFilter from '$lib/components/DesktopFilter.svelte'
import DummyProductCard from '$lib/DummyProductCard.svelte'
import MobileFilter from '$lib/components/MobileFilter.svelte'
import MobileFooter from '$lib/MobileFooter.svelte'
import noNoDataAvailable from '$lib/assets/no/no-data-availible.png'
import Pagination from '$lib/components/Pagination.svelte'
import PrimaryButton from '$lib/ui/PrimaryButton.svelte'
import ProductCard from '$lib/ProductCard.svelte'
import SEO from '$lib/components/SEO/index.svelte'
import Breadcrumb from '$lib/components/Breadcrumb.svelte'

export let data

// console.log('data = ', data)
// console.log('Products = ', products)
// console.log('Count = ', count)
// console.log('Facets = ', facets)

let seoProps = {
	title: `Find best ${data.category?.title || data.category?.name || ' '}`,
	metadescription: `Find best ${data.category?.metaDescription || ' '}`,
	keywords: `Find best ${data.category?.keywords || ' '}`
}

let showFilter = false
let showSort = false
let hidden = true
let showOnPx = 600
let y
$: innerWidth = 0

function goTop() {
	// scroll to the top
	window.scroll({ top: 0, behavior: 'smooth' })
}

function scrollContainer() {
	return document.documentElement || document.body
}

function handleOnScroll() {
	if (!scrollContainer()) {
		return
	}

	if (scrollContainer().scrollTop > showOnPx) {
		hidden = false
	} else {
		hidden = true
	}
}

async function sortNow(s) {
	let u = new URL($page.url)

	if (s == 'null' || s == null || s == undefined || s == 'undefined') {
		u.searchParams.delete('sort')
	} else {
		await u.searchParams.set('sort', s)
	}
	// await invalidateAll()
	goto(u.toString())
	window.scroll({ top: 0, behavior: 'smooth' })

	// await goto(`/search?${$page.url.searchParams.toString()}`)
}
let currentPage = 1
async function loadNextPage() {
	let nextPage = currentPage + 1
	$page.url.searchParams.delete('page')
	const searchParams = $page.url.searchParams.toString()
	try {
		data.isLoading = true
		const res = await getAPI(
			`es/products?categories=${data.categorySlug}&store=${data.store?.id}&page=${nextPage}&${searchParams}`,
			data.origin
		)
		// console.log('refresh res = ', res)
		const nextPageData = res?.data?.map((p) => {
			const p1 = { ...p._source }
			p1.id = p._id
			return p1
		})
		data.products = data?.products?.concat(nextPageData)
		data.count = res?.count
		data.facets = res?.facets
		data.err = !res?.estimatedTotalHits ? 'No result Not Found' : null
		currentPage = currentPage + 1
	} catch (e) {
		toast(e, 'error')
	} finally {
		data.isLoading = false
	}
}

async function refreshData() {
	// await invalidateAll()
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

onMount(() => {
	if ($page?.data?.isDesktop) return
	const intersectionObserver = new IntersectionObserver((entries) => {
		if (entries[0].intersectionRatio <= 0) return
		// load more content;
		loadNextPage()
	})
	// start observing
	intersectionObserver.observe(document.querySelector('.more'))
	// // @ts-ignore
	// gtag('event', 'view_item', {
	// 	currency: 'USD',
	// 	value: 7.77,
	// 	items: [
	// 		{
	// 			item_id: 'SKU_12345',
	// 			item_name: 'Stan and Friends Tee',
	// 			affiliation: 'Google Merchandise Store',
	// 			coupon: 'SUMMER_FUN',
	// 			currency: 'USD',
	// 			discount: 2.22,
	// 			index: 0,
	// 			item_brand: 'Google',
	// 			item_category: 'Apparel',
	// 			item_category2: 'Adult',
	// 			item_category3: 'Shirts',
	// 			item_category4: 'Crew',
	// 			item_category5: 'Short sleeve',
	// 			item_list_id: 'related_products',
	// 			item_list_name: 'Related Products',
	// 			item_variant: 'green',
	// 			location_id: 'ChIJIQBpAG2ahYAR_6128GcTUEo',
	// 			price: 9.99,
	// 			quantity: 1
	// 		}
	// 	]
	// })
	// // @ts-ignore
	// gtag('event', 'view_item_list', {
	// 	item_list_id: 'related_products',
	// 	item_list_name: 'Related products',
	// 	items: [
	// 		{
	// 			item_id: 'SKU_12345',
	// 			item_name: 'Stan and Friends Tee',
	// 			affiliation: 'Google Merchandise Store',
	// 			coupon: 'SUMMER_FUN',
	// 			currency: 'USD',
	// 			discount: 2.22,
	// 			index: 0,
	// 			item_brand: 'Google',
	// 			item_category: 'Apparel',
	// 			item_category2: 'Adult',
	// 			item_category3: 'Shirts',
	// 			item_category4: 'Crew',
	// 			item_category5: 'Short sleeve',
	// 			item_list_id: 'related_products',
	// 			item_list_name: 'Related Products',
	// 			item_variant: 'green',
	// 			location_id: 'ChIJIQBpAG2ahYAR_6128GcTUEo',
	// 			price: 9.99,
	// 			quantity: 1
	// 		}
	// 	]
	// })
})
</script>

<SEO {...seoProps} />

<svelte:window bind:scrollY="{y}" bind:innerWidth on:scroll="{handleOnScroll}" />

<div class="{showFilter || showSort ? 'h-[93vh] overflow-hidden' : 'min-h-screen h-full'}">
	{#if !hidden && innerWidth <= 1024}
		<button
			transition:fade="{{ duration: 500 }}"
			aria-label="Click to go to top"
			class="fixed top-28 left-[50%] z-40 -ml-14 flex w-28 transform items-center justify-center gap-1 rounded-full bg-black bg-opacity-60 py-1 px-3 text-xs uppercase text-white transition duration-300 focus:outline-none hover:bg-opacity-80 active:scale-90 sm:top-36"
			on:click="{goTop}">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="2"
				stroke="currentColor"
				class="h-3 w-3">
				<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18"
				></path>
			</svg>

			<span class="flex-1">{data.products?.length} / {data.count}</span>
		</button>
	{/if}

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
							<span class="text-xl font-bold capitalize md:text-2xl"> {data.category?.name} </span>

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

					{#if data.category?.topDescription}
						<div class="prose-sm prose mb-5 max-w-none text-justify">
							{@html data.category?.topDescription}
						</div>
					{/if}

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

	<!-- CATEGORY DESCRIPTION -->

	{#if data.category?.description}
		<div class="w-full justify-center bg-gray-50 px-3 py-10 sm:px-10 sm:py-20">
			<div
				class="container mx-auto grid max-w-6xl grid-cols-1 gap-10 text-sm sm:gap-20 md:grid-cols-6">
				<div class="prose-sm prose col-span-1 max-w-none text-justify md:col-span-3 lg:col-span-4">
					{@html data.category?.description}
				</div>

				<div class="col-span-1 md:col-span-3 lg:col-span-2">
					<h1 class="mb-5 text-center text-base font-bold uppercase tracking-wide">
						{data.category?.name} price list
					</h1>

					<ul class="flex flex-col gap-2">
						<li class="grid grid-cols-6 items-center gap-5 font-semibold uppercase">
							<span class="col-span-5">{data.category?.name}</span>

							<span class="col-span-1">Price <br /> (Rs)</span>
						</li>

						{#each data.products as p, px}
							{#if p && px < 10}
								<li>
									<a href="/product/{p.slug}" class="grid grid-cols-6 gap-5">
										<span class="col-span-5 text-justify">{p.name}</span>

										<span class="col-span-1 whitespace-nowrap">{p.formattedPrice}</span>
									</a>
								</li>
							{/if}
						{/each}

						{#if data.products && data.products[0] && data.products[0]?.updatedAt}
							<li class="font-semibold">
								<i>Data last updated on {dateOnly(data.products[0]?.updatedAt)}</i>
							</li>
						{/if}
					</ul>
				</div>
			</div>
		</div>
	{/if}

	<div class="block sm:hidden">
		<MobileFooter />
	</div>
</div>
