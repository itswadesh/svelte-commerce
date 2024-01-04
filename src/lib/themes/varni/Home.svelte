<script>
// import { navigateToProperPath } from '$lib/utils/index.js'
// import logo from '$lib/assets/logo.svg'
// import ProductTab from '$lib/components/Product/ProductTab.svelte'
import {
	CategoriesHome,
	CategoriesMobile,
	CategoriesSlider,
	CustomBanners,
	CustomerFeedback,
	Deals,
	Hero,
	PickedBanners
} from '$lib/themes/misiki'
import {
	CollectionsGeneral,
	CollectionsHome,
	CollectionsHome2,
	Footer,
	HeroBanners,
	TrendingProductsHome
} from '$lib/themes/varni'
import {
	HeroBannersCollage6,
	LegalFooterInformation,
	MobileFooter,
	PopularProductsHome,
	PopUpReviews,
	ProductGridShowCase,
	ShopYourStone
} from '$lib/components'
import { page } from '$app/stores'
import { slide } from 'svelte/transition'
import PincodeInputBox from '$lib/themes/misiki/PincodeInputBox.svelte'
import SEO from '$lib/components/SEO/index.svelte'
import Skeleton from '$lib/ui/Skeleton.svelte'
import { onMount } from 'svelte'
import { browser } from '$app/environment'
import { storeStore } from '$lib/store/store'

export let data
export let showFooter = false
export let showPinCodeEntryModal = false
let store = {}
onMount(() => {
	if (browser) {
		storeStore.subscribe((value) => (store = value))
	}
})
</script>

<div class="bg-opacity-25 bg-center bg-repeat min-h-screen">
	{#if store?.isHyperlocal && showPinCodeEntryModal}
		<PincodeInputBox on:close="{() => (showPinCodeEntryModal = false)}" />
	{/if}

	<div class="mb-14 lg:mb-0">
		<!-- Categories slider mobile -->

		{#await data?.streamed?.home then home}
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
			<Hero
				sliderBannersDesktop="{home.page?.sliderBanners?.banners}"
				sliderBannersMobile="{home.page?.sliderBanners?.bannersMobile}" />
		{/await}

		<!-- Alert message -->

		{#if $page?.data?.store?.alert}
			<div class="p-3 py-5 sm:p-10 bg-primary-50">
				<h1 class="container mx-auto text-center">
					{$page?.data.store.alert}
				</h1>
			</div>
		{/if}

		<!-- top categories -->

		{#await data?.streamed?.home}
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

					<!-- <h2 class="p-3 py-5 text-center uppercase sm:px-10 md:py-10">TOP COLLECTIONS</h2>

					<div class="max-w-screen overflow-x-auto scrollbar-none lg:hidden">
						<div class="flex flex-row">
							{#each data.home?.categories as category}
								{#if category?.img || category?.img}
									<a
										href="{navigateToProperPath(category.link || category.slug)}"
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
									href="{navigateToProperPath(category.link || category.slug)}"
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
			{#if home.page?.heroBanners?.banners?.length}
				<HeroBanners heroBanners="{home?.page?.heroBanners?.banners}" />
			{/if}
		{/await}

		<!-- Picked banners -->

		{#await data.streamed.home}
			<div class="w-screen overflow-x-auto scrollbar-none lg:hidden">
				<div class="flex flex-row items-start gap-5">
					{#each { length: 7 } as _}
						<div class="h-40 w-40 animate-pulse rounded bg-zinc-200 sm:h-60 sm:w-60 shrink-0"></div>
					{/each}
				</div>
			</div>

			<div class="hidden p-3 py-5 sm:px-10 md:py-10 grid-cols-7 lg:grid gap-5">
				{#each { length: 7 } as _}
					<div class="col-span-1 h-40 animate-pulse rounded bg-zinc-200 sm:h-60"></div>
				{/each}
			</div>
		{:then home}
			{#if home.page?.pickedBanners?.length > 0}
				<PickedBanners pickedBanners="{home.page?.pickedBanners}" />
			{/if}
		{/await}

		{#await data.streamed.home}
			<div class="p-3 py-5 md:py-10">
				<Skeleton />
			</div>
		{:then home}
			{#if home.page?.banners?.length > 0}
				<CustomBanners sections="{home.page?.banners}" />
			{/if}
		{/await}

		{#if store?.isDeals}
			{#await data?.streamed?.deals}
				<div class="p-3 py-5 md:py-10">
					<Skeleton />
				</div>
			{:then deals}
				{#if deals?.data?.length}
					<Deals deals="{deals.data}" />
				{/if}
			{/await}
		{/if}

		{#await data?.streamed?.collections}
			<div class="p-3 py-5 md:py-10">
				<Skeleton />
			</div>
		{:then collections}
			{#if collections?.data?.length}
				<CollectionsGeneral collections="{collections.data}" />
			{/if}
		{/await}

		{#await data.streamed.home then home}
			<HeroBannersCollage6 heroBanners="{home.heroBanners}" />
		{/await}

		<!-- Popular products -->

		<PopularProductsHome {data} />

		<!-- Trending products -->

		<TrendingProductsHome {data} />

		<!-- Trending products -->
		<!-- Note: Write the categories with comma separation -->
		<ProductGridShowCase topTitle="New Shop Items" title="Fashion" categories="fashion" />

		<!-- Collections Home -->

		<CollectionsHome {data} />

		<!-- Collections Home 2 -->

		<CollectionsHome2 {data} />

		<!-- Shop your stone -->

		<ShopYourStone />

		<!-- <ProductTab /> -->

		<!-- Customer feedback -->

		<CustomerFeedback {data} />

		<!-- Legal Footer Information -->

		<LegalFooterInformation />

		<div class="h-10 sm:h-20 w-full"></div>

		<!-- Footer mobile show hide toggle -->

		<div class="block lg:hidden">
			<button
				type="button"
				class="p-3 sm:px-10 w-full flex items-center justify-between gap-4 text-sm focus:outline-none"
				on:click="{() => (showFooter = !showFooter)}">
				<span>More about {$page.data?.store?.websiteName || 'store'}</span>

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

			{#if showFooter}
				<div transition:slide="{{ duration: 300 }}">
					<Footer />
				</div>
			{/if}
		</div>
	</div>

	<!-- MOBILE FOOTER -->

	<div class="block lg:hidden">
		<MobileFooter />
	</div>

	<!-- Pop-up reviews -->

	<!-- <PopUpReviews /> -->
</div>
