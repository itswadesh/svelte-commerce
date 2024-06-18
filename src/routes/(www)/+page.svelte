<script lang="ts">
	import FeaturedProductsGrid from '$lib/components/product-catalogue/featured-products-grid.svelte'
	import { X } from 'lucide-svelte'
	import { Skeleton } from '$lib/components/ui/skeleton'
	import CategoryList from '$lib/components/category/category-list.svelte'
	import { fly } from 'svelte/transition'
	import GoogleStructuredDataProductsList from '$lib/core/components/plugins/google-structured-data-products-list.svelte'
	import type { Product } from '$lib/core/types/index.js'
	import HomepageCategoryListWithImage from '$lib/components/home/homepage-category-list-with-image.svelte'
	import HomepageBanners from '$lib/components/home/homepage-banners.svelte'
	import Banners from '$lib/components/home/banners.svelte'
	import SeoHeader from '$lib/core/components/plugins/seo-header.svelte'
	import Collections from '$lib/components/home/collections.svelte'
	let { data } = $props()
	import { HomepageModule } from '$lib/core/composables/use-homepage.svelte'
	import { timestampToAgo } from '$lib/core/utils/index.js'
  import Slider from '$lib/components/home/slider.svelte'

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
	const page = (data?.page || {}) as ExtendedPage

	const homepageModule = new HomepageModule()
</script>

<GoogleStructuredDataProductsList products={homepageModule.featuredProductsStructuredData} />

<SeoHeader
	metaTitle={page?.metaTitle || page?.data?.store?.name || 'Litekart'}
	metaDescription={page?.metaDescription}
	metaKeywords={page?.metaKeywords}
	image={page?.logo}
/>

{#if homepageModule.featuredCategories?.length > 0}
	<div class="mx-2 flex justify-center bg-gray-100 px-2 lg:container lg:mx-auto lg:hidden">
		<CategoryList categories={homepageModule.featuredCategories} />
	</div>
{/if}

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
	{#if homepageModule.loading || !page?.desktopBanners}
		<div class="relative aspect-[16/6] max-h-[50vh] w-full">
			<Skeleton class="h-full w-full rounded-none" />
		</div>
	{:else if page?.desktopBanners?.[0]?.url || page?.mobileBanners?.[0]?.url}
		<!-- <div class="relative hidden md:block">
      <LazyImg
        src={banners?.desktopBanners[0]?.url}
        alt=""
        class="h-[50vh] w-full object-cover"
        aspect_ratio="16:6"
      />
    </div>
    <LazyImg
      src={data?.page?.mobileBanners[0]?.url}
      alt=""
      class="relative h-[50vh] w-full object-cover md:hidden"
      aspect_ratio="1:1"
    /> -->
		<Banners sliderBannersDesktop={page?.desktopBanners} sliderBannersMobile={page?.mobileBanners} />

	{/if}
</div>

<!-- <div class="mx-2 lg:container lg:mx-auto"> -->
<!-- <BannerGrid banners={bannerData} /> -->

<!-- <div class="mx-auto w-auto laptop:w-[80%]">
		<div class="mx-auto mb-2 flex items-center justify-center">
			<div class="ml-2 flex-1 border-2 border-black dark:border-white"></div>
			<div class="mx-4 text-[20px] font-bold tracking-wide">TRENDING NOW</div>
			<div class="mr-2 flex-1 border-2 border-black dark:border-white"></div>
		</div>
		<div class="mx-auto mb-5 flex items-center justify-center text-[12px]">
			<a href="/products" class="mx-auto block h-fit border-b border-black pb-[2px] dark:border-white">View All</a>
		</div>
	</div>
	{#if loadingTrendingProducts}
		<div class="relative w-full">
			<div class="flex gap-4 overflow-hidden p-4">
				{#each Array(4) as _}
					<div class="w-full min-w-[280px] flex-none space-y-3">
						<Skeleton class="h-[200px] w-full" />
						<Skeleton class="h-4 w-[250px]" />
						<Skeleton class="h-4 w-[200px]" />
						<Skeleton class="h-4 w-[150px]" />
					</div>
				{/each}
			</div>
		</div>
	{:else}
		<ProductCarousel data={featuredProducts} displayProduct={showProduct} />
	{/if} -->
<!-- <div class="mx-auto mt-10 w-auto laptop:w-[80%]">
		<div class="mx-auto mb-2 flex items-center justify-center">
			<div class="ml-2 flex-1 border-2 border-black dark:border-white"></div>
			<div class="mx-4 text-[20px] font-bold tracking-wide">FEATURED</div>
			<div class="mr-2 flex-1 border-2 border-black dark:border-white"></div>
		</div>
	</div> -->

<Slider />
<Collections />

<!-- <InstagramSection /> -->
<!-- <ProductDetails /> -->
<!-- </div> -->
<div class="mx-2 mb-12 lg:container lg:mx-auto">
	<HomepageCategoryListWithImage categories={homepageModule.featuredCategories} loading={homepageModule.loading} />
</div>

{#if page?.sections?.length && page?.sections[0]?.isActive}
	<div class="mx-2 mb-12 xl:mx-24">
		<HomepageBanners bannersList={page?.sections} />
	</div>
{/if}

<div class="mx-2 lg:container lg:mx-auto">
	<div class="">
		<div class="mx-auto mb-2 flex items-center justify-center">
			<div class="flex-1 border-2 border-black dark:border-white"></div>
			<div class="mx-4 text-[20px] font-bold tracking-wide">NEW ARRIVALS</div>
			<div class="flex-1 border-2 border-black dark:border-white"></div>
		</div>
		<div class="mx-auto mb-5 flex items-center justify-center text-[12px]">
			<a href="/products" class="mx-auto block h-fit border-b border-black pb-[2px] dark:border-white">View All</a>
		</div>
	</div>
</div>

{#if homepageModule.loadingFeaturedProducts}
	<div class="grid grid-cols-1 gap-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:mx-24">
		{#each Array(8) as _}
			<div class="mx-2 space-y-3 lg:container lg:mx-auto">
				<Skeleton class="h-[200px] w-full" />
				<Skeleton class="h-4 w-[250px]" />
				<Skeleton class="h-4 w-[200px]" />
				<Skeleton class="h-4 w-[150px]" />
			</div>
		{/each}
	</div>
{:else}
	<div class="lg:container lg:mx-auto">
		<FeaturedProductsGrid
			data={homepageModule.featuredProducts}
			displayProduct={(prod: Product) => homepageModule.showProduct(prod)}
			loadMore={homepageModule.loadMoreFeaturedProducts}
		/>
		{#if homepageModule.hasMoreFeaturedProducts}
			<div class="mt-4 flex justify-center">
				<button
					class="mb-2 me-2 rounded-lg border border-gray-800 px-5 py-2.5 text-center text-sm font-medium text-gray-900 hover:bg-gray-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-gray-300 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-800"
					onclick={homepageModule.loadMoreFeaturedProducts}
				>
					Load More
				</button>
			</div>
		{/if}
	</div>
{/if}

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
							alt="Product"
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

