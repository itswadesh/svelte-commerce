<script>
import { LazyImg } from '$lib/components'
import { navigateToProperPath } from '$lib/utils'
import { onMount } from 'svelte'
import { page } from '$app/stores'
import { SplideSlide } from '@splidejs/svelte-splide'

export let sliderBannersDesktop = []
export let sliderBannersMobile = []

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
		// 168 (with mobile footer)
		sliderHeightAccToPageHeight = innerHeight - 168
	} else if (hellobar?.active?.val && !$page.data.store?.isHyperlocal) {
		// 88 (without mobile footer)
		// 144 (with mobile footer)
		sliderHeightAccToPageHeight = innerHeight - 144
	} else if ($page.data.store?.isHyperlocal && !hellobar?.active?.val) {
		// 80 (without mobile footer)
		// 136 (with mobile footer)
		sliderHeightAccToPageHeight = innerHeight - 136
	} else if (!hellobar?.active?.val && !$page.data.store?.isHyperlocal) {
		// 56 (without mobile footer)
		// 112 (with mobile footer)
		sliderHeightAccToPageHeight = innerHeight - 112
	}
} else if (innerWidth < 1024) {
	if (hellobar?.active?.val && $page.data.store?.isHyperlocal) {
		// 136 (without mobile footer)
		// 192 (with mobile footer)
		sliderHeightAccToPageHeight = innerHeight - 192
	} else if (hellobar?.active?.val && !$page.data.store?.isHyperlocal) {
		// 112 (without mobile footer)
		// 168 (with mobile footer)
		sliderHeightAccToPageHeight = innerHeight - 168
	} else if ($page.data.store?.isHyperlocal && !hellobar?.active?.val) {
		// 104 (without mobile footer)
		// 160 (with mobile footer)
		sliderHeightAccToPageHeight = innerHeight - 160
	} else if (!hellobar?.active?.val && !$page.data.store?.isHyperlocal) {
		// 80 (without mobile footer)
		// 136 (with mobile footer)
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

<svelte:window bind:innerHeight bind:innerWidth />

<!-- Desktop banner -->

{#if sliderBannersDesktop?.length}
	<div class="hidden sm:block">
		<svelte:component
			this="{Splide}"
			totalImagesLength="{sliderBannersDesktop?.length}"
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
			{#each sliderBannersDesktop as b, ix}
				{#if b.img}
					<SplideSlide key="{b._id || b.id}">
						<a
							href="{navigateToProperPath(b.link || b.slug)}"
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
	</div>
{/if}

<!-- Mobile banner -->

{#if sliderBannersMobile?.length}
	<div class="block sm:hidden">
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
							href="{navigateToProperPath(b.link || b.slug)}"
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
	</div>
{/if}
