<script>
// import logo from '$lib/assets/logo.svg'
// import ProductTab from '$lib/components/Product/ProductTab.svelte'
import {
	CategoriesHome,
	CategoriesMobile,
	CategoriesSlider,
	Deals,
	Hero,
	HeroBanners
} from '$lib/home'
import {
	CollectionsHome,
	DummyProductCard,
	Footer,
	HeroBannersCollage6,
	LazyImg,
	LegalFooterInformation,
	MobileFooter,
	PopularProductsHome,
	ProductCard,
	ProductGridShowCase,
	ShopYourStone,
	TrendingProductsHome
} from '$lib/components'
import { onMount } from 'svelte'
import { page } from '$app/stores'
import Cookie from 'cookie-universal'
import dayjs from 'dayjs'
import PickedBanners from '$lib/home/PickedBanners.svelte'
import PincodeInputBox from '$lib/home/PincodeInputBox.svelte'
import SEO from '$lib/components/SEO/index.svelte'

const cookies = Cookie()

let today = dayjs(new Date()).toISOString()

export let data
// console.log('$page', $page)

let seoProps = {
	// addressCountry: 'India',
	// addressLocality: 'Semiliguda, Koraput',
	// addressRegion: 'Odisha',
	// alternateJsonHref: '',
	// alternateXml: { title: '', href: '' },
	brand: $page.data.store?.title,
	// breadcrumbs: '',
	caption: $page.data.store?.title,
	category: $page.data.store?.title,
	contentUrl: $page.data.store?.logo,
	createdAt: today,
	// depth: { unitCode: '', value: '' },
	email: `${$page?.data?.store?.email}`,
	// entityMeta: '',
	// facebookPage: '',
	// gtin: '',
	// height: '',
	id: $page?.url?.href,
	image: $page.data.store?.logo,
	logo: $page.data.store?.logo,
	ogSquareImage: { url: '', width: 56, height: 56 },
	openingHours: ['Monday,Tuesday,Wednesday,Thursday,Friday,Saturday 08:00-13:00'],
	// popularity: product.popularity,
	// postalCode: '764036',
	// price: product.price,
	// priceRange: `${product.price}-${product.mrp}`,
	// ratingCount: 1,
	// ratingValue: +product.ratings + 1,
	// sku: product.sku,
	// streetAddress: 'Padmajyoti Marg, Nandapur Road',
	timeToRead: 0,
	updatedAt: today,
	// weight: { unitCode: '', value: '' },
	// width: { unitCode: '', value: '' },
	// wlwmanifestXmlHref: '',
	metaDescription: $page.data.store?.metaDescription,
	// article: false,
	canonical: `${$page?.url.href}`,
	datePublished: today,
	description: $page.data.store?.description,
	dnsPrefetch: `//cdn.jsdelivr.net`,
	// entityMeta: null,
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
	// productAvailability: `${product.stock}`,
	productBrand: $page.data.store?.title,
	productName: $page.data.store?.title,
	// productPriceAmount: `${product.price}`,
	productPriceCurrency: `${$page?.data?.store?.currencyCode}`,
	slug: `/`,
	// timeToRead: 0,
	title: $page.data.store?.title,
	twitterImage: { url: $page.data.store?.logo }
}

let showPinCodeEntryModal = false

onMount(() => {
	const pin = cookies.get('zip')

	if (pin && pin.toString()?.length === 6) {
		showPinCodeEntryModal = false
	} else {
		showPinCodeEntryModal = true
	}

	// console.log('pin, showPinCodeEntryModal', pin, pin.toString()?.length, showPinCodeEntryModal)
})
</script>

<SEO {...seoProps} />

<div class="bg-opacity-25 bg-center bg-repeat min-h-screen">
	{#if $page.data.store?.isHyperlocal && showPinCodeEntryModal}
		<PincodeInputBox on:close="{() => (showPinCodeEntryModal = false)}" />
	{/if}

	<div class="mb-14 lg:mb-0">
		<!-- Categories slider mobile -->

		{#await data.streamed.home then home}
			{#if home?.categories?.length}
				<div class="block sm:hidden">
					<CategoriesMobile loading="{home.isFetching}" categories="{home?.categories}" />
				</div>
			{/if}
		{/await}

		<!-- Main slider banner -->

		{#await data.streamed.home}
			<div class="h-96 w-full bg-zinc-200 animate-pulse"></div>
		{:then home}
			<Hero banners="{home.banners}" />
			<!-- <div class="h-96 w-full bg-red-500 animate-pulse"></div> -->
		{/await}

		<!-- Alert message -->

		{#if data.store?.alert}
			<div class="p-3 py-5 sm:p-10 bg-primary-50">
				<h1 class="container mx-auto text-center text-3xl font-bold sm:text-4xl md:text-5xl">
					{data.store?.alert}
				</h1>
			</div>
		{/if}

		<!-- top categories -->

		{#await data.streamed.home}
			<ul class="flex flex-wrap gap-3 justify-center p-3 py-5 md:py-10">
				{#each { length: 10 } as _}
					<li class="h-24 w-24 shrink-0 rounded-full lg:h-28 lg:w-28 bg-zinc-200 animate-pulse">
					</li>
				{/each}
			</ul>
		{:then home}
			{#if home?.categories?.length}
				<div class="hidden sm:block">
					<!-- <CategoriesHome categories="{data.home?.categories}" /> -->

					<CategoriesSlider title="Top Categories" categories="{home?.categories}" />

					<!-- <h2
					class="p-3 py-5 text-center font-serif text-xl font-medium uppercase tracking-wider sm:px-10 sm:text-2xl md:py-10 md:text-3xl xl:text-4xl">
					TOP COLLECTIONS
				</h2>

				<div class="max-w-screen overflow-x-auto scrollbar-none lg:hidden">
					<div class="flex flex-row">
						{#each data.home?.categories as category}
							{#if category?.img || category?.img}
								<a
									href="/{category.link || category.slug || '##'}"
									aria-label="Click to get the category related products"
									class="shrink-0">
									<LazyImg
										src="{category.img || category.img}"
										alt=""
										width="160"
										height="160"
										aspect_ratio="1:1"
										class="w-40 object-contain" />
								</a>
							{/if}
						{/each}
					</div>
				</div>

				<div class="hidden grid-cols-12 lg:grid">
					{#each data.home?.categories as category}
						{#if category?.img || category?.img}
							<a
								href="/{category.link || category.slug || '##'}"
								aria-label="Click to get the category related products"
								class="col-span-1">
								<LazyImg
									src="{category.img || category.img}"
									alt=""
									width="375"
									aspect_ratio="1:1"
									class="h-full w-full object-contain" />
							</a>
						{/if}
					{/each}
				</div> -->
				</div>
			{/if}
		{/await}

		<!-- Hero banners -->

		{#await data.streamed.home}
			<div class="p-3 py-5 md:py-10 grid grid-cols-2 items-center gap-2 md:grid-cols-4">
				<div class="col-span-2 h-40 animate-pulse rounded bg-zinc-200 sm:h-60"></div>

				<div class="col-span-2 h-40 animate-pulse rounded bg-zinc-200 sm:h-60"></div>

				<div class="col-span-1 h-40 animate-pulse rounded bg-zinc-200 sm:h-60"></div>

				<div class="col-span-1 h-40 animate-pulse rounded bg-zinc-200 sm:h-60"></div>

				<div class="col-span-2 h-40 animate-pulse rounded bg-zinc-200 sm:h-60"></div>
			</div>
		{:then home}
			{#if home.heroBanners?.length}
				<div>
					<h2
						class="p-3 py-5 text-center font-serif text-xl font-medium tracking-wider sm:px-10 sm:text-2xl md:py-10 md:text-3xl xl:text-4xl uppercase">
						BEST OF {$page.data.store?.websiteName} EXCLUSIVE
					</h2>

					<HeroBanners heroBanners="{home.heroBanners}" />
				</div>
			{/if}
		{/await}

		<!-- Picked banners -->

		{#await data.streamed.home}
			<div class="grid grid-cols-2 items-center gap-2 md:grid-cols-4">
				<div class="col-span-2 h-40 animate-pulse rounded bg-zinc-200 sm:h-60"></div>

				<div class="col-span-2 h-40 animate-pulse rounded bg-zinc-200 sm:h-60"></div>

				<div class="col-span-1 h-40 animate-pulse rounded bg-zinc-200 sm:h-60"></div>

				<div class="col-span-1 h-40 animate-pulse rounded bg-zinc-200 sm:h-60"></div>

				<div class="col-span-2 h-40 animate-pulse rounded bg-zinc-200 sm:h-60"></div>
			</div>
		{:then home}
			{#if home.groupByBanner?.length > 0}
				<PickedBanners banners="{home.groupByBanner}" />
			{/if}
		{/await}

		{#if $page.data.store?.isDeals}
			{#await data.streamed.deals}
				<div class="flex w-[98vw] items-start justify-start gap-3 overflow-x-auto">
					<div class="w-60 h-60 animate-pulse rounded bg-zinc-200">
						{#each { length: 10 } as _}
							<div class="w-52 h-60 animate-pulse rounded bg-zinc-200"></div>
						{/each}
					</div>
				</div>
			{:then deals}
				{#if deals.data?.length > 0}
					{#each deals.data as deal}
						<div class="mb-5 sm:mb-10">
							<h2
								class="p-3 py-5 text-center font-serif text-xl font-medium tracking-wider sm:px-10 sm:text-2xl md:py-10 md:text-3xl xl:text-4xl uppercase">
								{deal.name}
							</h2>

							<Deals deal="{deal}" />
						</div>
					{/each}
				{/if}
			{/await}
		{/if}

		{#await data.streamed.collections}
			<div class="flex w-[98vw] items-start justify-start gap-3 overflow-x-auto">
				<div class="w-60 h-60 animate-pulse rounded bg-zinc-200">
					{#each { length: 10 } as _}
						<div class="w-52 h-60 animate-pulse rounded bg-zinc-200"></div>
					{/each}
				</div>
			</div>
		{:then collections}
			{#if collections.data?.length > 0}
				{#each collections.data as collection}
					<div class="mb-5 sm:mb-10">
						<h2
							class="p-3 py-5 text-center font-serif text-xl font-medium tracking-wider sm:px-10 sm:text-2xl md:py-10 md:text-3xl xl:text-4xl uppercase">
							{collection.name}
						</h2>

						<Deals deal="{collection}" />
					</div>
				{/each}
			{/if}
		{/await}

		{#await data.streamed.home then home}
			<HeroBannersCollage6 heroBanners="{home.heroBanners}" />
		{/await}

		<!-- Popular products -->

		<PopularProductsHome data="{data}" />

		<!-- Trending products -->

		<TrendingProductsHome data="{data}" />

		<!-- Trending products -->
		<!-- Note: Write the categories with comma separation -->
		<ProductGridShowCase topTitle="New Shop Items" title="Fashion" categories="fashion" />

		<!-- Collections -->

		<CollectionsHome data="{data}" />

		<!-- Shop your stone -->

		<ShopYourStone />

		<!-- Legal Footer Information -->

		<LegalFooterInformation />

		<!-- <ProductTab /> -->
	</div>

	<div class="block lg:hidden mb-14 lg:mb-0">
		<Footer me="{data.me}" />
	</div>

	<!-- MOBILE FOOTER -->

	<div class="block lg:hidden">
		<MobileFooter />
	</div>
</div>
