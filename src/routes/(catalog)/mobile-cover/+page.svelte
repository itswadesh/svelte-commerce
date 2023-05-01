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
import { currency, dateOnly, generatePriceRange, toast } from '$lib/utils'
import { fade } from 'svelte/transition'
import { goto, invalidateAll } from '$app/navigation'
import { onMount } from 'svelte'
import { page } from '$app/stores'
import { ProductService } from '$lib/services'
import { sorts } from '$lib/config'
import CatelogNav from '$lib/CatelogNav.svelte'
import DesktopFilter from '$lib/components/DesktopFilter.svelte'
import dotsLoading from '$lib/assets/dots-loading.gif'
import DummyProductCard from '$lib/DummyProductCard.svelte'
import MobileFilter from '$lib/components/MobileFilter.svelte'
import noDataAvailable from '$lib/assets/no/no-data-available.png'
import Pagination from '$lib/components/Pagination.svelte'
import PrimaryButton from '$lib/ui/PrimaryButton.svelte'
import ProductCard from '$lib/ProductCard.svelte'
import SEO from '$lib/components/SEO/index.svelte'
import { children } from 'svelte/internal'
export let data
let selectedBrand = ''
let selectedOption = ''
let seoProps = {
	// addressCountry: 'India',
	// addressLocality: 'Semiliguda, Koraput',
	// addressRegion: 'Odisha',
	// alternateJsonHref: '',
	// alternateXml: { title: '', href: '' },
	brand: $page.data.store?.title,
	breadcrumbs: data.category?.children,
	caption: $page.data.store?.title,
	category: data.category?.name,
	contentUrl: $page.data.store?.logo,
	createdAt: `${data.category?.createdAt || '_'}`,
	// depth: { unitCode: '', value: '' },
	email: `${$page?.data?.store?.email}`,
	// entityMeta: '',
	// facebookPage: '',
	// gtin: '',
	// height: '',
	id: $page?.url?.href,
	image: `${data.category?.img}`,
	logo: $page.data.store?.logo,
	ogSquareImage: { url: '', width: 56, height: 56 },
	openingHours: ['Monday,Tuesday,Wednesday,Thursday,Friday,Saturday 10:00-20:00'],
	// popularity: data.category?.popularity,
	// postalCode: '764036',
	// price: data.category?.price,
	// priceRange: `${data.category?.price}-${data.category?.mrp}`,
	// ratingCount: 1,
	// ratingValue: +data.category?.ratings + 1,
	// sku: data.category?.sku,
	// streetAddress: 'Padmajyoti Marg, Nandapur Road',
	timeToRead: 0,
	updatedAt: `${data.category?.updatedAt || '_'}`,
	// weight: { unitCode: '', value: '' },
	// width: { unitCode: '', value: '' },
	// wlwmanifestXmlHref: '',
	metadescription: data.category?.metaDescription,
	// article: false,
	canonical: `${$page?.url.href}`,
	datePublished: `${data.category?.publishedAt || '_'}`,
	description: ` ${data.category?.description}`,
	dnsPrefetch: `//cdn.jsdelivr.net`,
	// entityMeta: null,
	featuredImage: {
		url: `${data.category?.img}`,
		width: 675,
		height: 380,
		caption: data.category?.name
	},
	keywords: $page.data.store?.keywords,
	lastUpdated: `${data.category?.updatedAt || '_'}`,
	msapplicationTileImage: `${data.category?.img}`,
	ogImage: { url: $page.data.store?.logo, width: 128, height: 56 },
	ogImageSecureUrl: `${$page?.data?.store?.logo}`,
	ogImageType: 'image/jpeg',
	ogSiteName: `${$page.data.origin}/sitemap/sitemap.xml`,
	productAvailability: `${data.category?.stock}`,
	productBrand: `${data.category?.brandName || $page.data.store?.title}`,
	productName: `${data.category?.name}`,
	// productPriceAmount: `${data.category?.price}`,
	productPriceCurrency: `${$page?.data?.store?.currencyCode}`,
	slug: `${data.category?.slug}`,
	// timeToRead: 0,
	title: `${data.category?.name || 'Buy online in - ' + $page.data.store?.websiteName}`,
	twitterImage: { url: `${data.category?.img}` }
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
function handleSelectedBrand(event) {
	selectedBrand = event.target.value
	selectedOption = ''
}
function handleOptionChange(event) {
	selectedOption = event.target.value
}
if (
	data.products?.facets?.all_aggs?.price_stats?.max > 0 &&
	data.products?.facets?.all_aggs?.price_stats?.min >= 0
) {
	priceRange = generatePriceRange(
		data.products?.facets?.all_aggs?.price_stats,
		data.store.currencySymbol
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
		$page.url.searchParams.delete('page')
		const searchParams = $page.url.searchParams.toString()
		try {
			data.isLoading = true
			const res = await ProductService.fetchNextPageProducts({
				categorySlug: data.category?.slug,
				origin: $page?.data?.origin,
				storeId: $page?.data?.store?.id,
				nextPage,
				searchParams
			})
			const nextPageData = res.nextPageData
			data.products = data?.products?.concat(nextPageData)
			data.count = res?.count
			data.products.facets = res?.facets
			data.err = !res?.estimatedTotalHits ? 'No result Not Found' : null
			currentPage = currentPage + 1
			if (data.count && data.products?.length === data.count) {
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
onMount(() => {
	const observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (
				entry.isIntersecting &&
				data.count &&
				data.products?.length < data.count &&
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
	if (item === $page.url.searchParams.get('tags')) {
		$page.url.searchParams.set('tags', '')
	} else {
		$page.url.searchParams.set('tags', item)
		$page.url.searchParams.set('page', '1')
	}
	await goto($page.url.toString())
	await invalidateAll()
}
function handleFilterTags() {
	selectedFilter = 'Tags'
	showFilter = true
}
</script>

<SEO {...seoProps} />
<svelte:window bind:scrollY="{y}" bind:innerWidth="{innerWidth}" on:scroll="{handleOnScroll}" />
<CatelogNav me="{$page?.data?.me}" cart="{$page?.data?.cart}" store="{$page?.data?.store}">
	<div class="flex max-w-max flex-col items-start gap-1">
		{#if data.category?.name}
			<h2 class="w-28 truncate font-semibold capitalize leading-4">{data.category?.name}</h2>
		{/if}
		<p class="text-xs">
			{#if data.products?.count}
				<b>
					{data.products?.count}
				</b>
				Items
			{:else}
				No Item
			{/if}
		</p>
	</div>
</CatelogNav>
<div class="h-full min-h-screen">
	<div class="container bg-[#f5f5f5]">
		<div class="flex flex-col">
			<div class="flex-auto mt-5 ml-5">
				<h1 class="text-3xl underline underline-offset-8 text-gray-950 font-bold">
					Mobile Covers And Cases
				</h1>
			</div>
			<div class="flex-auto">
				{#await data.streamed?.megamenu}
					loadingDelayed...
				{:then value}
					<select
						class="mt-4 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
						name="mobile-cover"
						id="mobile-cover"
						bind:value="{selectedBrand}"
						on:change="{handleSelectedBrand}">
						<option value="">Select a brand</option>
						{#each value as { children }}
							{#each children as cdata}
								<option value="{cdata?.name}">{cdata?.name}</option>
							{/each}
						{/each}
					</select>
				{:catch error}
					{error?.message}
				{/await}
			</div>
			<div class="flex-auto">
				<select
					class="mt-4 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
					name="mobile-cover"
					id="mobile-cover"
					bind:value="{selectedOption}"
					on:change="{handleOptionChange}">
					<option value="">Select Model</option>
					{#if selectedBrand}
						{#each selectedBrand as option}
							<option value="">{option}</option>
						{/each}
					{/if}
				</select>
			</div>
			<div class="flex-col">
				<div
					class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4 mx-5 my-5">
					<!-- Loop through the array and create a card for each element -->
					{#each data.category?.children as c}
						<a class="p-4 bg-white rounded-lg shadow-md" href="/mobile-cover/{c?.slug}">
							<p class="text-xl font-medium">{c?.name}</p>
						</a>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>
