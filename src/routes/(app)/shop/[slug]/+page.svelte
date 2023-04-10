<script>
// import logo from '$lib/assets/logo.svg'
// import ProductTab from '$lib/components/Product/ProductTab.svelte'
import { goto } from '$app/navigation'
import { page } from '$app/stores'
import CategoriesMobile from '$lib/home/CategoriesMobile.svelte'
import dayjs from 'dayjs'
import Deals from '$lib/home/Deals.svelte'
import DummyProductCard from '$lib/DummyProductCard.svelte'
import Hero from '$lib/home/Hero.svelte'
import HeroBanners from '$lib/home/HeroBanners.svelte'
import LazyImg from '$lib/components/Image/LazyImg.svelte'
import MobileFooter from '$lib/MobileFooter.svelte'
import PickedBanners from '$lib/home/PickedBanners.svelte'
import PrimaryButton from '$lib/ui/PrimaryButton.svelte'
import ProductCard from '$lib/ProductCard.svelte'
import SEO from '$lib/components/SEO/index.svelte'

let today = dayjs(new Date()).toISOString()

export let data

// console.log('zzzzzzzzzzzzzzzzzz', data)

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
	metadescription: $page.data.store?.description,
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
</script>

<SEO {...seoProps} />

<div class="bg-opacity-25 bg-center bg-repeat">
	{#if data.banners?.length > 0 || data.groupByBanners?.length > 0}
		<div class="mb-14 sm:mb-0">
			<!-- CATEGORIES SLIDER MOBILE -->

			{#await data then categories}
				{#if data?.categories?.length}
					<div class="block sm:hidden">
						<CategoriesMobile loading="{data.isFetching}" categories="{data?.categories}" />
					</div>
				{/if}
			{/await}

			<div class="mb-5 sm:mb-10">
				<Hero banners="{data.banners}" />
			</div>

			{#if data.store?.alert}
				<div class="p-3 py-5 sm:p-10 bg-primary-50">
					<h1 class="container mx-auto text-center text-3xl font-bold sm:text-4xl md:text-5xl">
						{data.store?.alert}
					</h1>
				</div>
			{/if}

			<!-- TOP CATEGORIES -->

			{#if data.categories?.length}
				<div class="mb-5 hidden sm:mb-10 sm:block">
					<h2
						class="p-3 py-5 text-center font-serif text-xl font-medium uppercase tracking-wider sm:px-10 sm:text-2xl md:py-10 md:text-3xl xl:text-4xl">
						TOP COLLECTIONS
					</h2>

					<div class="max-w-screen overflow-x-auto scrollbar-none lg:hidden">
						<div class="flex flex-row">
							{#each data.categories as category}
								{#if category?.img || category?.img}
									<a
										href="/{category.link || category.slug || '##'}"
										aria-label="Click to get the category related products"
										class="shrink-0">
										<LazyImg
											src="{category.img || category.img}"
											alt=""
											width="375"
											height="375"
											aspect_ratio="1:1"
											class="w-[47vw] object-contain sm:w-60" />
									</a>
								{/if}
							{/each}
						</div>
					</div>

					<div class="hidden grid-cols-7 lg:grid">
						{#each data.categories as category}
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
					</div>
				</div>
			{/if}

			<!-- HERO BANNERS -->

			{#await data.heroBanners}
				<div class="grid grid-cols-2 items-center gap-2 md:grid-cols-4">
					<div class="col-span-2 h-40 animate-pulse rounded-md bg-gray-300 sm:h-60"></div>

					<div class="col-span-2 h-40 animate-pulse rounded-md bg-gray-300 sm:h-60"></div>

					<div class="col-span-1 h-40 animate-pulse rounded-md bg-gray-300 sm:h-60"></div>

					<div class="col-span-1 h-40 animate-pulse rounded-md bg-gray-300 sm:h-60"></div>

					<div class="col-span-2 h-40 animate-pulse rounded-md bg-gray-300 sm:h-60"></div>
				</div>
			{:then heroBanners}
				{#if data.heroBanners?.length}
					<div class="mb-5 sm:mb-10">
						<h2
							class="p-3 py-5 text-center font-serif text-xl font-medium tracking-wider sm:px-10 sm:text-2xl md:py-10 md:text-3xl xl:text-4xl uppercase">
							BEST OF {$page.data.store?.websiteName} EXCLUSIVE
						</h2>

						<HeroBanners heroBanners="{data.heroBanners}" />
					</div>
				{/if}
			{/await}

			<!-- PICKED BANNERS -->

			{#await data.groupByBanner}
				<div class="grid grid-cols-2 items-center gap-2 md:grid-cols-4">
					<div class="col-span-2 h-40 animate-pulse rounded-md bg-gray-300 sm:h-60"></div>

					<div class="col-span-2 h-40 animate-pulse rounded-md bg-gray-300 sm:h-60"></div>

					<div class="col-span-1 h-40 animate-pulse rounded-md bg-gray-300 sm:h-60"></div>

					<div class="col-span-1 h-40 animate-pulse rounded-md bg-gray-300 sm:h-60"></div>

					<div class="col-span-2 h-40 animate-pulse rounded-md bg-gray-300 sm:h-60"></div>
				</div>
			{:then groupByBanner}
				{#if data.groupByBanner?.length}
					<div class="mb-5 sm:mb-10">
						<PickedBanners banners="{data.groupByBanner}" />
					</div>
				{/if}
			{/await}
		</div>

		<!-- MOBILE FOOTER -->

		<div class="block lg:hidden">
			<MobileFooter />
		</div>
	{:else}
		<div class="flex h-[70vh] items-center justify-center">
			<div class="m-10 flex flex-col items-center justify-center text-center">
				<h1 class="mb-10 text-xl font-semibold capitalize sm:text-2xl lg:text-3xl">
					Oops!!, No Items Found In this Id
				</h1>

				<div class="mb-5">
					<img
						src="/no/no-data-availible.png"
						alt="no data availible"
						class="h-20 w-20 text-xs object-contain" />
				</div>

				<p class="mb-5 text-center text-gray-500">No data found</p>

				<PrimaryButton class="text-sm" on:click="{() => goto('/')}">Back to banner</PrimaryButton>
			</div>
		</div>
	{/if}
</div>
