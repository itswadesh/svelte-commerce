<script>
import { CatelogNav, DummyProductCard, MobileFilter, Pagination } from '$lib/components'
import { currency, dateOnly, generatePriceRange, toast } from '$lib/utils'
import { DesktopFilter, Footer, ProductCard } from '$lib/themes/varni-ace'
import { fade } from 'svelte/transition'
import { fireGTagEvent } from '$lib/utils/gTag'
import { goto, invalidateAll } from '$app/navigation'
import { Hero } from '$lib/themes/misiki'
import { MobileFooter } from '$lib/components'
import { onMount } from 'svelte'
import { page } from '$app/stores'
import { PopularSearchService, ProductService } from '$lib/services'
import { PrimaryButton } from '$lib/ui'
import { sorts } from '$lib/config'
import dayjs from 'dayjs'
import dotsLoading from '$lib/assets/dots-loading.gif'
import noDataAvailable from '$lib/assets/no/no-data-available.png'
import SEO from '$lib/components/SEO/index.svelte'
import { browser } from '$app/environment'
import { storeStore } from '$lib/store/store'

export let data
export let showFooter = false
export let showPinCodeEntryModal = false

console.log('zzzzzzzzzzzzzzzzzz', data)

let today = dayjs(new Date()).toISOString()

let seoProps = {
	brand: $page.data.store?.title,
	// breadcrumbs: data.category?.children,
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
	metaDescription: $page.data.store?.description,
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

let currentPage = 1
let hidden = true
let priceRange = []
let reachedLast = false
let selectedFilter
let showFilter = false
let showOnPx = 600
let showSort = false
let y

if (
	data.products?.facets?.all_aggs?.price_stats?.max > 0 &&
	data.products?.facets?.all_aggs?.price_stats?.min >= 0
) {
	priceRange = generatePriceRange(
		data.products?.facets?.all_aggs?.price_stats,
		data.store?.currencySymbol
	)
}

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

async function loadNextPage() {
	if (!reachedLast) {
		let nextPage = currentPage + 1
		$page?.url?.searchParams.delete('page')
		const searchParams = $page?.url?.searchParams.toString()

		try {
			data.isLoading = true

			const res = await ProductService.fetchNextPageProducts({
				categorySlug: data?.category?.slug,
				nextPage,
				searchParams,
				isCors: $page?.data?.store?.isCors,
				origin: $page?.data?.origin,
				storeId: $page?.data?.storeId
			})

			// console.log('res', res)

			const nextPageData = res?.nextPageData
			currentPage = currentPage + 1
			data.err = !res?.estimatedTotalHits ? 'No result Not Found' : null
			data.products.category = res?.category
			data.products.count = res?.count
			data.products.products = data?.products?.products?.concat(nextPageData)
			data.products.products.facets = res?.facets

			if (data.product?.count && data.products?.length === data.product?.count) {
				reachedLast = true
			}
		} catch (e) {
			toast(e, 'error')
		} finally {
			data.isLoading = false
		}
	}
}

async function refreshData() {}

let loadMoreDiv
let store = {}
onMount(() => {
	if (browser) {
		storeStore.subscribe((value) => {
			store = value
		})
	}
	fireGTagEvent('search', { search_term: data.query })

	const observer = new IntersectionObserver((entries) => {
		if (!entries) return

		entries.forEach((entry) => {
			if (
				entry.isIntersecting &&
				data.products?.count &&
				data.products?.products?.length < data.products?.count &&
				!data.isLoading
			) {
				// Do something when the element is intersecting
				loadNextPage()
			}
		})
	})

	if (loadMoreDiv && !$page?.data?.isDesktop) {
		observer.observe(loadMoreDiv)
	}

	// const intersectionObserver = new IntersectionObserver((entries) => {
	// 	if (entries[0].intersectionRatio <= 0) return
	// 	// load more content;
	// 	loadNextPage()
	// })

	// // start observing

	// intersectionObserver.observe(document.querySelector('.more'))
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
	// }
})

async function goCheckbox(item) {
	if (item === $page.url.searchParams.get('materials')) {
		$page.url.searchParams.set('materials', '')
	} else {
		$page.url.searchParams.set('materials', item)
		$page.url.searchParams.set('page', '1')
	}
	await goto($page.url.toString())
	await invalidateAll()
}

function handleFilterTags() {
	selectedFilter = 'Themes'
	showFilter = true
}
</script>

<SEO {...seoProps} />

<svelte:window bind:scrollY="{y}" bind:innerWidth="{innerWidth}" on:scroll="{handleOnScroll}" />

<div class="bg-opacity-25 bg-center bg-repeat min-h-screen">
	<div class="mb-14 lg:mb-0">
		<!-- Main slider banner -->

		{#await data.streamed.home}
			<div class="h-96 w-full bg-zinc-200 animate-pulse"></div>
		{:then home}
			<Hero
				sliderBannersDesktop="{home.page?.sliderBanners?.banners}"
				sliderBannersMobile="{home.page?.sliderBanners?.bannersMobile}" />
		{/await}

		<!-- Mobile black product count indicator -->

		{#if !hidden && innerWidth <= 1024 && data.products?.products?.length}
			<button
				transition:fade="{{ duration: 500 }}"
				aria-label="Click to go to top"
				class="fixed top-28 left-[50%] z-40 transform -translate-x-1/2 flex w-28 items-center justify-center gap-1 rounded-full bg-black bg-opacity-60 py-1 px-3 text-xs uppercase text-white transition duration-300 focus:outline-none hover:bg-opacity-80 active:scale-90 sm:top-36 whitespace-nowrap"
				on:click="{goTop}">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="2"
					stroke="currentColor"
					class="h-3 w-3">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18"></path>
				</svg>

				<span class="flex-1">{data.products?.products?.length} / {data.products?.count}</span>
			</button>
		{/if}

		<div class="mb-10 flex flex-col items-start sm:mb-20 lg:flex-row lg:gap-10 lg:p-10">
			<!-- materials="{data?.products?.facets?.all_aggs?.materials?.all?.buckets}" -->
			{#if data.products.facets}
				<DesktopFilter
					class="sticky hidden lg:block {hellobar?.active?.val ? 'top-32' : 'top-24'}"
					facets="{data.products.facets}"
					priceRange="{priceRange}"
					query="{data.query}"
					on:clearAll="{refreshData}" />

				<!-- materials="{data?.products?.facets?.all_aggs?.materials?.all?.buckets}" -->
				<MobileFilter
					bind:selected="{selectedFilter}"
					bind:showFilter="{showFilter}"
					bind:showSort="{showSort}"
					class="mb-5 block lg:hidden"
					facets="{data.products.facets}"
					priceRange="{priceRange}"
					on:clearAll="{refreshData}" />
			{/if}

			<!-- <div
			class="w-full flex-1 sm:px-10 sm:pt-10 lg:pt-0 lg:px-0
			{data.products?.facets?.all_aggs?.materials?.all?.buckets?.length ? 'mt-12 lg:mt-0' : 'mt-0'}"> -->
			<div class="w-full flex-1 sm:px-10 sm:pt-10 lg:pt-0 lg:px-0 mt-0">
				<!-- Name and count -->

				<h4 class="px-3 sm:px-0 text-center uppercase">
					{#if data.products.count}
						{#if data.products.count > 100}
							We have over {Math.floor(data.products.count / 100) * 100}
							products in our shop
						{:else if data.products.count > 10}
							We have over {Math.floor(data.products.count / 10) * 10}
							products in our shop
						{:else}
							We have {Math.floor(data.products.count / 10) * 10}
							{#if data.products.count === 1}
								product
							{:else}
								products
							{/if}
							in our shop
						{/if}
					{:else}
						We do not have any product now
					{/if}
				</h4>

				<!-- Products -->

				{#if data.products?.products?.length}
					<ul
						class="mt-5 grid grid-cols-2 items-start border-t border-b sm:flex sm:flex-wrap sm:justify-between sm:gap-3 sm:border-t-0 sm:border-b-0 lg:gap-6">
						{#each data.products?.products as p, ix}
							<li>
								<ProductCard product="{p}" />
							</li>

							<!-- Filter by tags -->

							{#if ix % 40 === 39 && data.products?.facets?.all_aggs?.tags?.all?.buckets?.length}
								<div
									class="col-span-2 block sm:hidden overflow-x-auto bg-primary-100 scrollbar-none">
									<div class="w-full flex items-center gap-6 p-4">
										<div class="shrink-0">
											<span class="text-lg text-zinc-500">Filter by</span>

											<br />

											<span class="text-2xl font-bold">Tags</span>
										</div>

										<ul class="flex max-w-[40rem] shrink-0 flex-wrap gap-2">
											{#each data.products.facets.all_aggs.tags.all.buckets || [] as t, tx}
												{#if t && tx < 12}
													<button
														type="button"
														class="capitalizefocus:outline-none max-w-max rounded bg-white py-2 px-4 text-sm font-semibold"
														on:click="{() => goCheckbox(t.key)}">
														{t.key}
													</button>
												{/if}
											{/each}

											{#if data.products.facets.all_aggs.tags.all.buckets?.length - 12 > 0}
												<button
													type="button"
													class="font-semibold text-sm text-primary-500 focus:outline-none"
													on:click="{handleFilterTags}">
													+{data.products.facets.all_aggs.tags.all.buckets?.length - 12} more
												</button>
											{/if}
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

					{#if !$page?.data?.isDesktop}
						<!-- <div class="more"> -->
						<div bind:this="{loadMoreDiv}">
							<!-- Dot loading gif -->
							{#if data.isLoading}
								<div class="flex items-center justify-center p-6">
									<img
										src="{dotsLoading}"
										alt="loading"
										class="h-auto w-5 object-contain object-center" />
								</div>
							{/if}
						</div>

						<!-- Reached last -->

						{#if reachedLast}
							<p class="text-zinc-500 p-4 text-center">
								<i>~ You have seen all the products ~</i>
							</p>
						{/if}
					{:else}
						<Pagination
							count="{Math.ceil((data.products?.count || 1) / data.products?.pageSize)}"
							current="{data?.currentPage || 1}"
							providePaddingOnMobile />
					{/if}
				{:else}
					<div class="flex items-center justify-center px-3 sm:px-0" style="height: 60vh;">
						<div class="m-10 flex flex-col items-center justify-center text-center">
							<h2 class="mb-10 text-xl capitalize sm:text-2xl lg:text-3xl">
								{#if data.searchData}You searched for "{data.searchData}"{/if}
							</h2>

							<div class="mb-5">
								<img
									src="{noDataAvailable}"
									alt="no data available"
									class="h-60 w-auto object-contain text-xs" />
							</div>

							<h2 class="mb-1 font-semibold">We couldn't find any matches!</h2>

							<p class="mb-5 text-center text-sm text-zinc-500">
								Please check the spelling or try searching something else
							</p>

							<PrimaryButton class="text-sm" on:click="{() => goto('/')}"
								>Back to Home</PrimaryButton>
						</div>
					</div>
				{/if}
			</div>
		</div>

		<!-- Footer show hide toggle -->

		<button
			type="button"
			class="lg:hidden p-3 sm:px-10 w-full border-t border-b border-zinc-400 flex items-center justify-between gap-4 text-sm focus:outline-none"
			on:click="{() => (showFooter = !showFooter)}">
			<span>More about {$page.data.store?.websiteName || 'store'}</span>

			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor"
				class="w-5 h-5 transition duration-300
				{showFooter ? 'transform rotate-180' : ''}">
				<path
					fill-rule="evenodd"
					d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
					clip-rule="evenodd"></path>
			</svg>
		</button>

		<div class="{showFooter ? 'block' : 'hidden'}">
			<Footer me="{data.me}" />
		</div>
	</div>

	<!-- MOBILE FOOTER -->

	<div class="block lg:hidden">
		<MobileFooter />
	</div>
</div>
