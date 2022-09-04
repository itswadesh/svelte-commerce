<script>
import SEO from '$lib/components/SEO/index.svelte'
import Hero from '$lib/home/Hero.svelte'
import CategoriesMobile from '$lib/home/CategoriesMobile.svelte'
import HeroBanners from '$lib/home/HeroBanners.svelte'
import ProductCard from '$lib/ProductCard.svelte'
import PickedBanners from '$lib/home/PickedBanners.svelte'
import LazyImg from '$lib/components/Image/LazyImg.svelte'
import MobileFooter from '$lib/MobileFooter.svelte'

export let data

// console.log('zzzzzzzzzzzzzzzzzz', data)

const seoProps = {
	title: 'Custom Printed Mobile Back Cover and Cases Online @Rs. 99 - Misiki',
	description:
		'Customised Mobile Covers - Buy Custom Photo Printed Mobile Back Cover And Cases Online For All Stylish Phone Models @Rs.99 On Misiki Store. 100% Easy Returns.',
	slug: '/',
	keywords:
		'Customised Mobile Covers, Buy Custom Photo Printed Mobile Back Cover,Misiki Store,100% Easy Returns ',
	featuredImage: {
		url: '/logo.png',
		width: 672,
		height: 448,
		caption: 'Home page'
	},
	ogImage: {
		url: '/logo.png'
	},
	ogSquareImage: {
		url: '/logo.png'
	},
	twitterImage: {
		url: '/logo.png'
	}
}

$: heroBanners = data.home?.banners?.data.filter((b) => {
	return b.type === 'hero'
})
</script>

<SEO {...seoProps} />

<!-- {JSON.stringify(home?.categories.data)} -->

<div class="bg-opacity-25 bg-center bg-repeat" style="background-image:url('/gray-dot.png') ;">
	<div class="mb-20">
		<!-- CATEGORIES SLIDER MOBILE -->

		{#await data.home then home}
			<div class="block sm:hidden">
				<CategoriesMobile loading="{home.isFetching}" categories="{home?.categories?.data ?? []}" />
			</div>
		{/await}

		<div class="mb-5 sm:mb-10">
			<Hero banners="{data.home.banners?.data}" />
		</div>

		<!-- TOP CATEGORIES -->

		{#if data.home?.categories?.data?.length > 0}
			<div class="mb-5 sm:mb-10">
				<h1
					class="p-3 py-5 text-center font-serif text-xl font-medium tracking-wider sm:px-10 sm:text-2xl md:py-10 md:text-3xl xl:text-4xl">
					TOP CATEGORIES
				</h1>

				<div class="max-w-screen overflow-x-auto scrollbar-none lg:hidden">
					<div class="flex flex-row">
						{#each data.home?.categories?.data as category}
							{#if category?.imgCdn}
								<a
									href="{category.link}"
									aria-label="Click to get the category related products"
									class="flex-shrink-0">
									<LazyImg
										src="{category.imgCdn}"
										alt=""
										width="375"
										class="w-[47vw] object-contain sm:w-60" />
								</a>
							{/if}
						{/each}
					</div>
				</div>

				<div class="hidden grid-cols-7 lg:grid">
					{#each data.home?.categories?.data as category}
						{#if category?.imgCdn}
							<a
								href="{category.link}"
								aria-label="Click to get the category related products"
								class="col-span-1">
								<LazyImg
									src="{category.imgCdn}"
									alt=""
									width="375"
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
			{#if heroBanners.length}
				<div class="mb-5 sm:mb-10">
					<h1
						class="p-3 py-5 text-center font-serif text-xl font-medium tracking-wider sm:px-10 md:py-10 sm:text-2xl md:text-3xl xl:text-4xl">
						BEST OF MISIKI EXCLUSIVE
					</h1>

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

		<!-- POPULAR PRODUCTS -->

		{#await data.home then home}
			{#if home?.popular}
				<div class="mb-5 sm:mb-10">
					<h1
						class="p-3 py-5 text-center font-serif text-xl font-medium tracking-wider sm:px-10 md:py-10 sm:text-2xl md:text-3xl xl:text-4xl">
						POPULAR PRODUCTS
					</h1>

					<div
						class="grid w-full grid-cols-2 items-end sm:flex sm:flex-wrap sm:justify-center sm:gap-10">
						{#each home?.popular?.data as p, px}
							{#if p}
								<ProductCard product="{p}" />
							{/if}
						{/each}
					</div>
				</div>
			{/if}
		{/await}

		<!-- TRENDING ITEMS -->

		<!-- {#if home.data?.trending}
			<div class="px-2 pt-1">
				<div class="flex flex-row items-center justify-between">
					<h1
						class="p-3 py-5 text-center font-serif text-xl font-medium tracking-wider sm:px-10 sm:text-2xl md:py-10 md:text-3xl xl:text-4xl">
						TRENDING ITEMS
					</h1>

					<a
						href="##"
						aria-label="Click to get the trending products list"
						class="text-sm text-gray-500 hover:text-primary-500 sm:mr-2">
						See All
					</a>
				</div>

				<div class="mt-5 flex overflow-x-auto">
					{#each home?.trending.data as p}
						{#if p}
							<ProductCard product="{p}" />
						{/if}
					{/each}
				</div>
			</div>
		{/if} -->

		<!-- {home.banners}
      {home.brands}
      {home.categories}
      {home.groupByBanner}
      {home.popular}
      {home.trending}
    	{home.youMayLike} -->
	</div>

	<!-- MOBILE FOOTER -->

	<div class="block sm:hidden">
		<MobileFooter />
	</div>
</div>
