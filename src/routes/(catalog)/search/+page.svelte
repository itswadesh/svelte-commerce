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
import { goto, invalidateAll } from '$app/navigation'
import { onMount } from 'svelte'
import { page } from '$app/stores'
import { post } from '$lib/utils/api'
import { savePopularSearch } from '$lib/services/PopularSearchService'
import { sorts } from '$lib/config'
import { toast } from '$lib/utils'
import dayjs from 'dayjs'
import DesktopFilter from '$lib/components/DesktopFilter.svelte'
import DummyProductCard from '$lib/DummyProductCard.svelte'
import MobileFilter from '$lib/components/MobileFilter.svelte'
import MobileFooter from '$lib/MobileFooter.svelte'
import noNoDataAvailable from '$lib/assets/no/no-data-availible.png'
import Pagination from '$lib/components/Pagination.svelte'
import PrimaryButton from '$lib/ui/PrimaryButton.svelte'
import ProductCard from '$lib/ProductCard.svelte'
import ProductNav from '$lib/ProductNav.svelte'
import SEO from '$lib/components/SEO/index.svelte'

let today = dayjs(new Date()).toISOString()

export let data


let seoProps = {
	brand: $page.data.store?.title,
	caption: $page.data.store?.title,
	category: data.searchData,
	contentUrl: $page.data.store?.logo,
	createdAt: today,
	email: `${$page?.data?.store?.email}`,
	id: $page?.url?.href,
	image: $page.data.store?.logo,
	logo: $page.data.store?.logo,
	ogSquareImage: { url: '', width: 56, height: 56 },
	openingHours: ['Monday,Tuesday,Wednesday,Thursday,Friday,Saturday 10:00-20:00'],
	timeToRead: 0,
	updatedAt: today,
	metadescription: $page.data.store?.description,
	canonical: `${$page?.url.href}`,
	datePublished: today,
	description: $page.data.store?.description,
	dnsPrefetch: `//cdn.jsdelivr.net`,
	featuredImage: {
		url: $page.data.store?.logo,
		width: 675,
		height: 380,
		caption: $page.data.store?.title
	},
	keywords: $page.data.store?.keywords,
	lastUpdated: today,
	msapplicationTileImage: $page.data.store?.logo,
	ogImage: { url: $page.data.store?.logo, width: 128, height: 56 },
	ogImageSecureUrl: `${$page?.data?.store?.logo}`,
	ogImageType: 'image/jpeg',
	ogSiteName: `${$page.data.origin}/sitemap/sitemap.xml`,
	productBrand: data.searchData,
	productName: data.searchData,
	productPriceCurrency: `${$page?.data?.store?.currencyCode}`,
	slug: `/`,
	title: data.searchData || 'Buy online in - ' + $page.data.store?.websiteName,
	twitterImage: { url: $page.data.store?.logo }
}

let showFilter = false
let showSort = false

$: if (data?.count === 0) {
	saveSearchData(data?.searchData)
}

async function saveSearchData(searchData) {
	try {
		await savePopularSearch({
			id: 'new',
			// popularity: 0,
			text: searchData,
			storeId: $page.data.store?.id,
			origin: $page.data.origin
		})
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
}

async function goCheckbox(item) {
	if (item === $page.url.searchParams.get('tags')) {
		$page.url.searchParams.set('tags', '')
	} else {
		$page.url.searchParams.set('tags', item)
		$page.url.searchParams.set('page', '1')
	}
	await goto($page.url.toString())
	await invalidateAll()
}
</script>

<SEO {...seoProps} />

<ProductNav me="{$page?.data?.me}" cart="{$page?.data?.cart}" store="{$page?.data?.store}">
	<div class="flex max-w-max flex-col items-start gap-1">
		<h1 class="w-28 truncate font-semibold capitalize leading-4">{data.searchData}</h1>

		<p class="text-xs">
			{data.count}

			{#if data.count > 1}
				Items
			{:else}
				Item
			{/if}
		</p>
	</div>
</ProductNav>

<div class="{showFilter || showSort ? 'h-[93vh] overflow-hidden' : 'min-h-screen h-full'}">
	<div class="mb-10 flex w-full flex-col sm:mb-20 lg:flex-row lg:gap-10 lg:p-10">
		{#if data.facets}
			<DesktopFilter
				facets="{data.facets}"
				query="{data.query}"
				class="sticky top-24 hidden lg:block"
				on:clearAll="{refreshData}"
			/>

			<MobileFilter
				facets="{data.facets}"
				bind:showFilter="{showFilter}"
				bind:showSort="{showSort}"
				class="sticky top-14 z-40 block sm:top-20 lg:hidden"
				on:clearAll="{refreshData}"
			/>
		{/if}

		<div class="w-full sm:px-10 lg:px-0">
			{#if data.products?.length}
				<div class="mb-5 w-full sm:mb-10 lg:mb-20">
					<div
						class="mb-5 hidden flex-wrap items-center justify-between gap-4 px-3 sm:px-0 lg:flex"
					>
						<h2 class="flex flex-wrap items-center gap-2">
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
						</h2>

						<div class="hidden flex-wrap items-center justify-between md:flex">
							<label class="flex items-center gap-2">
								<span>Sort : </span>

								<select
									bind:value="{data.sort}"
									class="max-w-max border-b bg-transparent py-1 pr-2 font-semibold focus:border-primary-500 focus:outline-none hover:border-primary-500"
									on:change="{() => sortNow(data.sort)}"
								>
									{#each sorts as s}
										<option value="{s.val}">{s.name}</option>
									{/each}
								</select>
							</label>
						</div>
					</div>

					{#if data.facets.all_aggs.style_tags?.all?.buckets?.length}
						<div
							class="w-screen overflow-x-auto scrollbar-none lg:mb-5 lg:w-full lg:overflow-x-hidden"
						>
							<div class="inline-flex gap-2 p-3 lg:flex lg:flex-wrap lg:p-0">
								{#each data.facets.all_aggs.style_tags.all.buckets || [] as t}
									{#if t}
										<button
											class="block whitespace-nowrap rounded-full border bg-white py-1 px-3 text-xs font-medium uppercase transition duration-300 focus:outline-none hover:border-primary-500 hover:text-primary-500"
											on:click="{() => goCheckbox(t.key)}"
										>
											{t.key} ({t.doc_count})
										</button>
									{/if}
								{/each}
							</div>
						</div>
					{/if}

					<ul
						class="grid w-full grid-cols-2 items-start border-t sm:flex sm:flex-wrap sm:justify-between sm:gap-3 sm:border-t-0 lg:gap-6"
					>
						{#each data.products as p, ix}
							<li>
								<ProductCard product="{p}" />
							</li>

							{#if ix % 40 === 39 && data.facets.all_aggs.tags?.all?.buckets?.length}
								<div class="col-span-2 w-screen overflow-x-auto bg-primary-100 scrollbar-none">
									<div class="flex items-center gap-6 p-4">
										<div class="shrink-0">
											<span class="text-lg text-gray-500">Filter by</span>

											<br />

											<span class="text-2xl font-bold">Tags</span>
										</div>

										<ul class="flex w-[40rem] shrink-0 flex-wrap gap-2">
											{#each data.facets.all_aggs.tags.all.buckets || [] as t}
												{#if t}
													<button
														class="capitalizefocus:outline-none max-w-max rounded-md bg-white py-2 px-4 text-sm font-semibold"
														on:click="{() => goCheckbox(t.key)}"
													>
														{t.key}
													</button>
												{/if}
											{/each}
										</ul>
									</div>
								</div>
							{/if}
						{/each}

						{#each { length: 7 } as _}
							<li class="hidden sm:block">
								<DummyProductCard />
							</li>
						{/each}
					</ul>
				</div>
			{:else}
				<div
					class="mb-5 flex w-full items-center justify-center px-3 sm:mb-10 sm:px-0 lg:mb-20"
					style="height: 60vh;"
				>
					<div class="m-10 flex flex-col items-center justify-center text-center">
						<h2 class="mb-10 text-xl capitalize sm:text-2xl lg:text-3xl">
							{#if data.searchData}You searched for "{data.searchData}"{/if}
						</h2>

						<div class="mb-5">
							<img
								src="{noNoDataAvailable}"
								alt="no data availible"
								class="h-20 w-20 object-contain text-xs"
							/>
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
					current="{data?.currentPage || 1}"
				/>
			{/if}
		</div>
	</div>

	<div class="block sm:hidden">
		<MobileFooter />
	</div>
</div>
