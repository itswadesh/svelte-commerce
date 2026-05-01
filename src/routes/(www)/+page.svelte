<script lang="ts">
	import FeaturedProductsGrid from '$lib/components/product-catalogue/featured-products-grid.svelte'
	import { X } from '@lucide/svelte'
	import { Skeleton } from '$lib/components/ui/skeleton'
	import CategoryList from '$lib/components/category/category-list.svelte'
	import { fly } from 'svelte/transition'
	import GoogleStructuredDataProductsList from '$lib/core/components/plugins/google-structured-data-products-list.svelte'
	import GoogleStructuredDataOrganization from '$lib/core/components/plugins/google-structured-data-organization.svelte'
	import GoogleStructuredDataWebsite from '$lib/core/components/plugins/google-structured-data-website.svelte'
	import type { Product } from '$lib/core/types/index.js'
	import HomepageCategoryListWithImage from '$lib/components/home/homepage-category-list-with-image.svelte'
	import HomepageBanners from '$lib/components/home/homepage-banners.svelte'
	import Banners from '$lib/components/home/banners.svelte'
	import SeoHeader from '$lib/core/components/plugins/seo-header.svelte'
	import Collections from '$lib/components/home/collections.svelte'
	let { data } = $props()
	import { HomepageModule } from '$lib/core/composables/index.js'
	import { timestampToAgo } from '$lib/core/utils/index.js'
  import Slider from '$lib/components/home/slider.svelte'
	import { page } from '$app/state'

	// Type definition for page data needed for this component
	interface ExtendedPage {
		metaTitle?: string
		metaDescription?: string
		metaKeywords?: string
		logo?: string
		desktopBanners?: any[]
		mobileBanners?: any[]
		sections?: any[]
	}

	interface PageData {
		page?: ExtendedPage
		store?: any
		storeId?: string
	}

	// Cast data.page to ExtendedPage type for TypeScript
	const homepage = (data?.page || {}) as ExtendedPage

	const homepageModule = new HomepageModule()
</script>

<GoogleStructuredDataProductsList products={homepageModule.featuredProductsStructuredData} />

<GoogleStructuredDataOrganization
	name={data?.store?.name || 'ArialShop'}
	url={page.url.origin}
	logo={data?.store?.logo}
	description={data?.store?.description}
	sameAs={data?.store?.socialSharing?.active ? (Object.values(data?.store?.socialSharing || {}).filter((link: any) => typeof link === 'string' && link.startsWith('http')) as string[]) : []}
	address={data?.store?.address ? {
		streetAddress: data?.store?.address?.street,
		addressLocality: data?.store?.address?.city,
		addressRegion: data?.store?.address?.state,
		postalCode: data?.store?.address?.pincode,
		addressCountry: data?.store?.address?.country
	} : undefined}
	contactPoint={data?.store?.contact?.phone ? {
		telephone: data?.store?.contact?.phone,
		email: data?.store?.contact?.email,
		contactType: 'customer service'
	} : undefined}
/>

<GoogleStructuredDataWebsite
	name={data?.store?.name || 'ArialShop'}
	url={page.url.origin}
	description={data?.store?.description}
	searchUrl={`${page.url.origin}/products?q={search_term_string}`}
/>

<SeoHeader
	metaTitle={homepage?.metaTitle || "Arialshop — Women's Fashion, Dresses & Co-ord Sets | Up to 70% Off"}
	metaDescription={homepage?.metaDescription || "Welcome to Arialshop, your ultimate destination for trendy women's fashion. Discover our exclusive collection of stylish dresses, elegant co-ord sets, and more with amazing discounts of up to 70% off. Enjoy premium quality apparel, free delivery on orders over ₹999, and easy returns. Shop the latest fashion trends at Arialshop today!"}
	metaKeywords={homepage?.metaKeywords}
	image={homepage?.logo}
/>

<h1 class="sr-only">Shop Women's Fashion Online — Dresses, Co-ord Sets & More</h1>

<!-- {#if homepageModule.featuredCategories?.length > 0}
	<div class="mx-2 flex justify-center bg-gray-100 px-2 lg:container lg:mx-auto lg:hidden">
		<CategoryList categories={homepageModule.featuredCategories} />
	</div>
{/if} -->

<!-- Hello bar -->
<!-- {#if helloBarPlugin?.active}
	<div class="bg-primary py-2 text-center text-xs text-white sm:text-sm">
		{@html helloBarPlugin?.content}
	</div>
{/if} -->

<!-- {#if displayProduct === 'flex'}
	<div class="fixed inset-0 z-40 {displayProduct} flex items-center justify-center bg-[rgba(0,0,0,0.7)] p-10">
		<div class="absolute inset-0 h-full w-full cursor-pointer"></div>

		<div
			class="relative z-50 max-w-[90vw] rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800 dark:text-white sm:max-h-[90vh] sm:w-full sm:max-w-[600px] sm:p-4"
		>
			<Button
				class="absolute right-4 top-4 m-1 h-8 w-8 rounded-full bg-gray-200 text-gray-800 hover:bg-red-500 hover:text-white focus:outline-none"
				onclick={hideProduct}
				aria-label="Close"
			>
				<X class="h-6 w-6" />
			</Button>

			<ProductDetails {product} />
		</div>
	</div>
{/if} -->

<div class="relative w-full">
	{#if homepageModule.loading || !homepage?.desktopBanners}
		<div class="relative aspect-[16/6] max-h-[50vh] w-full">
			<Skeleton class="h-full w-full rounded-none" />
		</div>
	{:else if homepage?.desktopBanners?.[0]?.url || homepage?.mobileBanners?.[0]?.url}
		<Banners sliderBannersDesktop={homepage?.desktopBanners} sliderBannersMobile={homepage?.mobileBanners} />
	{:else}
		<!-- Fallback Hero Section when no banners are configured -->
		<div class="relative bg-gradient-to-r from-gray-900 to-gray-700 py-20 px-4 text-white">
			<div class="mx-auto max-w-7xl">
				<div class="grid gap-8 md:grid-cols-2">
					<div class="flex flex-col justify-center">
						<h2 class="mb-4 text-4xl font-bold md:text-5xl">{data?.store?.name || 'Welcome to Our Store'}</h2>
						<p class="mb-8 text-lg text-gray-200">
							{data?.store?.description || 'Discover amazing products at unbeatable prices. Shop now and enjoy fast shipping on all orders.'}
						</p>
						<a
							href="/products"
							class="inline-block w-fit rounded-lg bg-white px-8 py-3 font-semibold text-gray-900 transition-colors hover:bg-gray-100"
						>
							Shop Now
						</a>
					</div>
					<div class="hidden md:flex items-center justify-center">
						<div class="text-9xl font-bold text-white/20">NEW</div>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>

<Slider />

<div class="mb-12 container mx-auto">
	<HomepageCategoryListWithImage categories={homepageModule.featuredCategories} loading={homepageModule.loading} />
</div>


<Collections />


{#if homepage?.sections?.length && homepage?.sections[0]?.isActive}
	<div class="mx-2 mb-12 xl:mx-24">
		<HomepageBanners bannersList={homepage?.sections} />
	</div>
{/if}

<div class="container mx-auto px-4 py-16">
	<div class="mb-12 flex flex-col items-center justify-between gap-6 md:flex-row md:items-end">
		<div class="text-center md:text-left">
			<h2 class="text-3xl font-extrabold tracking-tight text-foreground lg:text-4xl">
				New Arrivals
			</h2>
			<div class="mt-2 h-1 w-12 bg-primary mx-auto md:mx-0"></div>
			<p class="mt-4 text-sm font-medium text-muted-foreground">
				Stay ahead of the curve with our latest drops and trending pieces
			</p>
		</div>
		<a
			href="/products"
			class="group flex items-center rounded-full bg-secondary px-6 py-2.5 text-sm font-semibold text-secondary-foreground transition-all hover:bg-primary hover:text-primary-foreground"
		>
			View All Arrivals
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
			</svg>
		</a>
	</div>

	{#if homepageModule.loadingFeaturedProducts}
		<div class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
			{#each Array(12) as _}
				<div class="space-y-4">
					<Skeleton class="aspect-square w-full rounded-2xl" />
					<div class="space-y-2">
						<Skeleton class="h-4 w-3/4" />
						<Skeleton class="h-4 w-1/2" />
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<FeaturedProductsGrid
			data={homepageModule.featuredProducts?.slice(0, 18)}
			displayProduct={(prod: Product) => homepageModule.showProduct(prod)}
			loadMore={homepageModule.loadMoreFeaturedProducts}
		/>
		{#if homepageModule.hasMoreFeaturedProducts}
			<div class="mt-16 flex justify-center pb-12">
				<button
					class="group relative flex items-center justify-center gap-3 overflow-hidden rounded-full bg-foreground px-12 py-5 text-sm font-black uppercase tracking-[0.2em] text-background shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
					onclick={homepageModule.loadMoreFeaturedProducts}
				>
					<!-- Shimmer effect -->
					<div
						class="absolute -inset-full top-0 z-0 block h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shimmer"
					></div>

					<span class="relative z-10 transition-colors duration-300">Discover More</span>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="relative z-10 h-5 w-5 transition-transform duration-300 group-hover:translate-y-1 group-hover:animate-bounce"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
					</svg>
				</button>
			</div>
		{/if}
	{/if}
</div>

<!-- Notification to show recent order -->
{#if homepageModule.showRecentOrderPopup}
	<div transition:fly={{ x: 50, duration: 150 }} class="fixed bottom-20 right-4 z-50">
		<div class="relative flex justify-between rounded-lg bg-white p-4 shadow-lg">
			<a href="/products/{homepageModule.selectedRecentOrder?.slug || ''}" class="flex items-center justify-between">
				<div class="flex space-x-2">
					<div class="">
						<img
							src={homepageModule.selectedRecentOrder?.image ||
								homepageModule.selectedRecentOrder?.img ||
								homepageModule.selectedRecentOrder?.thumbnail}
							alt={homepageModule.selectedRecentOrder?.title || 'Product'}
							class="h-16 w-16 object-contain sm:h-28 sm:w-28"
						/>
					</div>
					<div class="flex flex-col">
						<p class="text-xs text-black sm:text-sm">
							{homepageModule.selectedRecentOrder?.first_name || 'Someone'} from {homepageModule.selectedRecentOrder?.city || 'somewhere'}
						</p>
						<p class="text-xs text-gray-500 sm:text-sm">purchased a</p>
						<p class="line-clamp-3 max-w-[200px] text-sm text-blue-600">
							{homepageModule.selectedRecentOrder?.title || 'product'}
						</p>
						<p class="mt-auto text-xs text-gray-500 sm:text-xs">
							{timestampToAgo(homepageModule.selectedRecentOrder?.created_at || homepageModule.selectedRecentOrder?.createdAt || '')}
						</p>
					</div>
				</div>
			</a>
			<button class="self-start text-gray-500 hover:text-red-500" onclick={() => (homepageModule.showRecentOrderPopup = false)}>
				<X class="h-4 w-4" />
			</button>
		</div>
	</div>
{/if}

