<script>
import { LazyImg } from '$lib/components'
import { onMount } from 'svelte'
import { page } from '$app/stores'
import { SplideSlide } from '@splidejs/svelte-splide'

export let banners = []
// console.log('$page', $page)

$: sliderBanners = banners?.filter((b) => {
	return b.type === 'slider' && b.isMobile === false
})

$: sliderBannersMobile = banners?.filter((b) => {
	return b.type === 'slider' && b.isMobile === true
})

$: innerHeight = 0
$: innerWidth = 0

let bannerHeight = $page?.data?.store?.homePageSliderBannerImageHeight || 50
let hellobar = $page.data.store?.hellobar || {}
let sliderHeightAccToPageHeight = innerHeight
let Splide

onMount(async () => {
	const SplideModule = await import('$lib/components/SplideJs.svelte')
	Splide = SplideModule.default
})

$: if (innerWidth < 640) {
	if (hellobar?.active?.val && $page.data.store?.isHyperlocal) {
		// 112 (without mobile footer)
		sliderHeightAccToPageHeight = innerHeight - 168
	} else if (hellobar?.active?.val && !$page.data.store?.isHyperlocal) {
		// 88 (without mobile footer)
		sliderHeightAccToPageHeight = innerHeight - 144
	} else if ($page.data.store?.isHyperlocal && !hellobar?.active?.val) {
		// 80 (without mobile footer)
		sliderHeightAccToPageHeight = innerHeight - 136
	} else if (!hellobar?.active?.val && !$page.data.store?.isHyperlocal) {
		// 56 (without mobile footer)
		sliderHeightAccToPageHeight = innerHeight - 112
	}
} else if (innerWidth < 1024) {
	if (hellobar?.active?.val && $page.data.store?.isHyperlocal) {
		// 136 (without mobile footer)
		sliderHeightAccToPageHeight = innerHeight - 192
	} else if (hellobar?.active?.val && !$page.data.store?.isHyperlocal) {
		// 112 (without mobile footer)
		sliderHeightAccToPageHeight = innerHeight - 168
	} else if ($page.data.store?.isHyperlocal && !hellobar?.active?.val) {
		// 104 (without mobile footer)
		sliderHeightAccToPageHeight = innerHeight - 160
	} else if (!hellobar?.active?.val && !$page.data.store?.isHyperlocal) {
		// 80 (without mobile footer)
		sliderHeightAccToPageHeight = innerHeight - 136
	}
} else {
	if (hellobar?.active?.val && $page.data.store?.isHyperlocal) {
		sliderHeightAccToPageHeight = innerHeight - 112
	} else if (hellobar?.active?.val && !$page.data.store?.isHyperlocal) {
		sliderHeightAccToPageHeight = innerHeight - 112
	} else if ($page.data.store?.isHyperlocal && !hellobar?.active?.val) {
		sliderHeightAccToPageHeight = innerHeight - 80
	} else if (!hellobar?.active?.val && !$page.data.store?.isHyperlocal) {
		sliderHeightAccToPageHeight = innerHeight - 80
	}
}
</script>

<svelte:window bind:innerHeight="{innerHeight}" bind:innerWidth="{innerWidth}" />

<!-- <div class="w-full overflow-hidden">
	{#if sliderBanners?.length > 0}
		<LazyImg
			src="{sliderBanners[0]?.img}"
			alt="banner"
			width="1500"
			height="380"
			class="h-full w-full object-contain object-center" />
	{:else}
		<div class="h-full w-full animate-pulse bg-zinc-200"></div>
	{/if}
</div>

<svelte:component this="{Carousel}">
	{#each sliderBanners as b, ix}
		{#if b.img}
			<a
				href="{b.link || '##'}"
				aria-label="Click to visit banner related products page"
				data-sveltekit-preload-data
				class="carousel-item relative float-left h-auto w-full {ix == 0 ? 'active' : ''}">
				<LazyImg
					src="{b.img}"
					alt="{b.name}"
					height="380"
					aspect_ratio="4:1"
					class="block h-auto w-full object-contain object-center" />
			</a>
		{/if}
	{/each}
</svelte:component> -->

<!-- Desktop banner -->

<div class="hidden sm:block">
	{#if sliderBanners?.length}
		<svelte:component
			this="{Splide}"
			totalImagesLength="{sliderBanners?.length}"
			options="{{
				// heightRatio: 0.432,
				arrows: true,
				autoplay: true,
				cover: true,
				focus: 'center',
				height: bannerHeight == 50 ? sliderHeightAccToPageHeight / 2 : sliderHeightAccToPageHeight,
				lazyLoad: true,
				type: 'loop'
			}}">
			{#each sliderBanners as b, ix}
				{#if b.img}
					<SplideSlide key="{b._id || b.id}">
						<a
							href="{b.link || '##'}"
							aria-label="Click to visit banner related products page"
							class="block h-full"
							data-sveltekit-preload-data>
							<!-- <LazyImg
								src="{b.img}"
								alt="{b.name}"
								height="{sliderHeightAccToPageHeight}"
								class="h-[{sliderHeightAccToPageHeight}px] w-full object-cover" /> -->

							<img src="{b.img}" alt="{b.name}" class="h-full w-full object-cover" />
						</a>
					</SplideSlide>
				{/if}
			{/each}
		</svelte:component>
	{/if}
</div>

<!-- Mobile banner -->

<div class="block sm:hidden">
	{#if sliderBannersMobile?.length}
		<svelte:component
			this="{Splide}"
			totalImagesLength="{sliderBannersMobile?.length}"
			options="{{
				arrows: false,
				autoplay: true,
				cover: true,
				focus: 'center',
				height: bannerHeight == 50 ? sliderHeightAccToPageHeight / 3 : sliderHeightAccToPageHeight,
				lazyLoad: true,
				type: 'loop'
			}}">
			{#each sliderBannersMobile as b, ix}
				{#if b.img}
					<SplideSlide key="{b._id || b.id}">
						<a
							href="{b.link || '##'}"
							aria-label="Click to visit banner related products page"
							class="block h-full"
							data-sveltekit-preload-data>
							<!-- <LazyImg
								src="{b.img}"
								alt="{b.name}"
								height="{sliderHeightAccToPageHeight}"
								class="h-[{sliderHeightAccToPageHeight}px] w-full object-cover" /> -->

							<img src="{b.img}" alt="{b.name}" class="h-full w-full object-cover" />
						</a>
					</SplideSlide>
				{/if}
			{/each}
		</svelte:component>
	{/if}
</div>

<!-- <div class="block sm:hidden">
	{#if sliderBannersMobile?.length}
		<svelte:component
			this="{Splide}"
			totalImagesLength="{sliderBanners?.length}"
			options="{{
				arrows: false,
				autoHeight: true,
				autoplay: true,
				cover: true,
				focus: 'center',
				lazyLoad: true,
				type: 'loop'
			}}">
			{#each sliderBannersMobile as b, ix}
				{#if b.img}
					<SplideSlide key="{b._id || b.id}">
						<a
							href="{b.link || '##'}"
							aria-label="Click to visit banner related products page"
							class="block"
							data-sveltekit-preload-data>
							<LazyImg src="{b.img}" alt="{b.name}" class="h-full w-full object-cover" />
						</a>
					</SplideSlide>
				{/if}
			{/each}
		</svelte:component>
	{/if}
</div> -->
