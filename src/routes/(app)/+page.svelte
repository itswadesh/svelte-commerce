<script>
import { page } from '$app/stores'
import CategoriesMobile from '$lib/home/CategoriesMobile.svelte'
import dayjs from 'dayjs'
import Deals from '$lib/home/Deals.svelte'
import DummyProductCard from '$lib/DummyProductCard.svelte'
import Hero from '$lib/home/Hero.svelte'
import HeroBanners from '$lib/home/HeroBanners.svelte'
import LazyImg from '$lib/components/Image/LazyImg.svelte'
import logo from '$lib/assets/logo.svg'
import MobileFooter from '$lib/MobileFooter.svelte'
import PickedBanners from '$lib/home/PickedBanners.svelte'
import ProductCard from '$lib/ProductCard.svelte'
import ProductTab from '$lib/components/Product/ProductTab.svelte'
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

$: heroBanners =
	data.home?.banners?.data &&
	data.home?.banners?.data.filter((b) => {
		return b.type === 'hero'
	})
</script>

<SEO {...seoProps} />

<div class="bg-opacity-25 bg-center bg-repeat">
	<div class="mb-14 sm:mb-0">
		<!-- CATEGORIES SLIDER MOBILE -->

		{#await data.home then home}
			{#if home?.categories?.data?.length > 0}
				<div class="block sm:hidden">
					<CategoriesMobile loading="{home.isFetching}" categories="{home?.categories?.data}" />
				</div>
			{/if}
		{/await}

		<div class="mb-5 sm:mb-10">
			<Hero banners="{data.home.banners?.data}" />
		</div>

		<h1 class="text-center text-2xl font-bold sm:text-3xl">
			The High Performance and Scalable Ecommerce
		</h1>

		<!-- TOP CATEGORIES -->

		{#if data.home?.categories?.data?.length > 0}
			<div class="mb-5 hidden sm:mb-10 sm:block">
				<h2
					class="p-3 py-5 text-center font-serif text-xl font-medium uppercase tracking-wider sm:px-10 sm:text-2xl md:py-10 md:text-3xl xl:text-4xl">
					TOP COLLECTIONS
				</h2>

				<div class="max-w-screen overflow-x-auto scrollbar-none lg:hidden">
					<div class="flex flex-row">
						{#each data.home?.categories?.data as category}
							{#if category?.img || category?.img}
								<a
									href="/{category.link || category.slug}"
									aria-label="Click to get the category related products"
									class="flex-shrink-0">
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
					{#each data.home?.categories?.data as category}
						{#if category?.img || category?.img}
							<a
								href="/{category.link || category.slug}"
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

		{#await data.home}
			<div class="grid grid-cols-2 items-center gap-2 md:grid-cols-4">
				<div class="col-span-2 h-40 animate-pulse rounded-md bg-gray-300 sm:h-60"></div>

				<div class="col-span-2 h-40 animate-pulse rounded-md bg-gray-300 sm:h-60"></div>

				<div class="col-span-1 h-40 animate-pulse rounded-md bg-gray-300 sm:h-60"></div>

				<div class="col-span-1 h-40 animate-pulse rounded-md bg-gray-300 sm:h-60"></div>

				<div class="col-span-2 h-40 animate-pulse rounded-md bg-gray-300 sm:h-60"></div>
			</div>
		{:then home}
			{#if heroBanners?.length > 0}
				<div class="mb-5 sm:mb-10">
					<h2
						class="p-3 py-5 text-center font-serif text-xl font-medium tracking-wider sm:px-10 sm:text-2xl md:py-10 md:text-3xl xl:text-4xl uppercase">
						BEST OF {$page.data.store?.websiteName} EXCLUSIVE
					</h2>

					<HeroBanners heroBanners="{heroBanners}" />
				</div>
			{/if}
		{/await}

		<!-- PICKED BANNERS -->

		{#await data.home}
			<div class="grid grid-cols-2 items-center gap-2 md:grid-cols-4">
				<div class="col-span-2 h-40 animate-pulse rounded-md bg-gray-300 sm:h-60"></div>

				<div class="col-span-2 h-40 animate-pulse rounded-md bg-gray-300 sm:h-60"></div>

				<div class="col-span-1 h-40 animate-pulse rounded-md bg-gray-300 sm:h-60"></div>

				<div class="col-span-1 h-40 animate-pulse rounded-md bg-gray-300 sm:h-60"></div>

				<div class="col-span-2 h-40 animate-pulse rounded-md bg-gray-300 sm:h-60"></div>
			</div>
		{:then home}
			{#if home.groupByBanner?.length > 0}
				<div class="mb-5 sm:mb-10">
					<PickedBanners banners="{home.groupByBanner}" />
				</div>
			{/if}
		{/await}

		{#await data.deals}
			<div class="flex w-[98vw] items-start justify-start gap-3 overflow-x-auto">
				<div class="w-60 h-60 animate-pulse rounded-md bg-gray-300">
					{#each { length: 10 } as _}
						<div class="w-52 h-60 animate-pulse rounded-md bg-gray-300"></div>
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

		<!-- POPULAR PRODUCTS -->

		{#await data.home then home}
			{#if home?.popular}
				{#if home?.popular?.data?.length > 0}
					<div class="mb-5 sm:mb-10">
						<h2
							class="p-3 py-5 text-center font-serif text-xl font-medium tracking-wider sm:px-10 sm:text-2xl md:py-10 md:text-3xl xl:text-4xl uppercase">
							POPULAR ON {$page.data.store?.websiteName}
						</h2>

						<ul
							class="sm:px-10 border-t sm:border-t-0 grid w-full grid-cols-2 items-start sm:gap-3 sm:flex sm:flex-wrap sm:justify-between lg:gap-6">
							{#each home?.popular?.data as p}
								<li>
									<ProductCard product="{p}" />
								</li>
							{/each}

							{#each { length: 7 } as _}
								<li class="hidden sm:block">
									<DummyProductCard />
								</li>
							{/each}
						</ul>
					</div>
				{/if}
			{/if}
		{/await}

		<!-- TRENDING PRODUCTS -->

		{#await data.home then home}
			{#if home?.trending?.length > 0}
				<div>
					<h2
						class="p-3 py-5 text-center font-serif text-xl font-medium tracking-wider sm:px-10 sm:text-2xl md:py-10 md:text-3xl xl:text-4xl uppercase">
						TRENDING ON {$page.data.store?.websiteName}
					</h2>

					<ul
						class="sm:px-10 border-t sm:border-t-0 grid w-full grid-cols-2 items-start sm:gap-3 sm:flex sm:flex-wrap sm:justify-between lg:gap-6">
						{#each home?.trending as p}
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
			{/if}
		{/await}

		<!-- <ProductTab /> -->
	</div>

	<!-- MOBILE FOOTER -->

	<div class="block sm:hidden">
		<MobileFooter />
	</div>
</div>
