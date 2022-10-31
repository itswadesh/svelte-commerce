<script>
import SEO from '$lib/components/SEO/index.svelte'
import Hero from '$lib/home/Hero.svelte'
import CategoriesMobile from '$lib/home/CategoriesMobile.svelte'
import HeroBanners from '$lib/home/HeroBanners.svelte'
import ProductCard from '$lib/ProductCard.svelte'
import PickedBanners from '$lib/home/PickedBanners.svelte'
import LazyImg from '$lib/components/Image/LazyImg.svelte'
import MobileFooter from '$lib/MobileFooter.svelte'
import DummyProductCard from '$lib/DummyProductCard.svelte'
import { getAPI } from '$lib/util/api'
import { page } from '$app/stores'
import { browser } from '$app/environment'
import { toast } from '$lib/util'
import { onMount } from 'svelte'

export let data

const seoProps = {
	title: $page.data.store.title,
	description: $page.data.store.description,
	slug: '/',
	keywords: $page.data.store.keywords,
	featuredImage: {
		url: $page.data.store.logo,
		width: 672,
		height: 448,
		caption: 'Home page'
	},
	ogImage: {
		url: $page.data.store.logo
	},
	ogSquareImage: {
		url: $page.data.store.logo
	},
	twitterImage: {
		url: $page.data.store.logo
	}
}

onMount(async () => {
	// await getHome()
})

$: heroBanners = data.home?.banners?.data.filter((b) => {
	return b.type === 'hero'
})

// let home
// async function getHome() {
// 	if (browser) {
// 		try {
// 			const localHome = localStorage.getItem('home')
// 			if (!localHome) {
// 				const res = await getAPI(`home?store=${$page.data?.store?.id}`)
// 				home = res
// 			} else {
// 				home = JSON.parse(localHome)
// 			}
// 		} catch (e) {
// 			toast(e, 'error')
// 		} finally {
// 		}
// 	}
// }
</script>

<SEO {...seoProps} />

<!-- {JSON.stringify(home?.categories.data)} -->

<div class="bg-opacity-25 bg-center bg-repeat" style="background-image:url('/gray-dot.png') ;">
	<div class="mb-20">
		<!-- CATEGORIES SLIDER MOBILE -->

		{#await data.home then home}
			{#if home?.categories?.data?.length > 0}
				<div class="block sm:hidden">
					<CategoriesMobile loading="{home.isFetching}" categories="{home?.categories?.data}" />
				</div>
			{/if}
		{/await}

		<div class="mb-5 sm:mb-10">
			<Hero banners="{data.home?.banners?.data}" />
		</div>

		<!-- TOP CATEGORIES -->

		{#if data.home?.categories?.data?.length > 0}
			<div class="mb-5 sm:mb-10">
				<h1
					class="p-3 py-5 text-center font-serif text-xl font-medium tracking-wider sm:px-10 sm:text-2xl md:py-10 md:text-3xl xl:text-4xl uppercase">
					TOP CATEGORIES
				</h1>

				<div class="max-w-screen overflow-x-auto scrollbar-none lg:hidden">
					<div class="flex flex-row">
						{#each data.home?.categories?.data as category}
							{#if category?.img}
								<a
									href="{category.link}"
									aria-label="Click to get the category related products"
									class="flex-shrink-0">
									<LazyImg
										src="{category.img}"
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
						{#if category?.img}
							<a
								href="{category.link}"
								aria-label="Click to get the category related products"
								class="col-span-1">
								<LazyImg
									src="{category.img}"
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
			{#if heroBanners.length > 0}
				<div class="mb-5 sm:mb-10">
					<h1
						class="p-3 py-5 text-center font-serif text-xl font-medium tracking-wider sm:px-10 sm:text-2xl md:py-10 md:text-3xl xl:text-4xl uppercase">
						BEST OF {$page.data.store?.websiteName} EXCLUSIVE
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
				{#if home?.popular?.data?.length > 0}
					<div class="mb-5 sm:mb-10">
						<h1
							class="p-3 py-5 text-center font-serif text-xl font-medium tracking-wider sm:px-10 sm:text-2xl md:py-10 md:text-3xl xl:text-4xl uppercase">
							POPULAR ON {$page.data.store.websiteName}
						</h1>

						<div
							class="px-3 sm:px-10 grid w-full grid-cols-2 items-start gap-3 sm:flex sm:flex-wrap sm:justify-between lg:mb-20 lg:gap-6">
							{#each home?.popular?.data as p}
								<ProductCard product="{p}" />
							{/each}

							{#each { length: 8 } as _}
								<div class="hidden sm:block">
									<DummyProductCard />
								</div>
							{/each}
						</div>
					</div>
				{/if}
			{/if}

			<!-- TRENDING PRODUCTS -->
			{#if home?.trending}
				{#if home?.trending?.length > 0}
					<div class="mb-5 sm:mb-10">
						<h1
							class="p-3 py-5 text-center font-serif text-xl font-medium tracking-wider sm:px-10 sm:text-2xl md:py-10 md:text-3xl xl:text-4xl uppercase">
							TRENDING ON {$page.data.store.websiteName}
						</h1>

						<div
							class="px-3 sm:px-10 grid w-full grid-cols-2 items-start gap-3 sm:flex sm:flex-wrap sm:justify-between lg:mb-20 lg:gap-6">
							{#each home?.trending as p}
								<ProductCard product="{p}" />
							{/each}

							{#each { length: 8 } as _}
								<div class="hidden sm:block">
									<DummyProductCard />
								</div>
							{/each}
						</div>
					</div>
				{/if}
			{/if}
		{/await}
	</div>

	<!-- MOBILE FOOTER -->

	<div class="block sm:hidden">
		<MobileFooter />
	</div>
</div>
