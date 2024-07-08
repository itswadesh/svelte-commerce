<script>
import { LazyImg } from '$lib/components'
import { navigateToProperPath } from '$lib/utils'
import { onMount } from 'svelte'
import { page } from '$app/stores'
import * as Carousel from '$lib/shad-components/ui/carousel/index'

export let sliderBannersDesktop = []
export let sliderBannersMobile = []

$: innerHeight = 0
$: innerWidth = 0

let bannerHeight = $page.data.store?.homePageSliderBannerImageHeight || 50
let hellobar = $page.data.store?.hellobar || {}
let sliderHeightAccToPageHeight = innerHeight

$: if (innerWidth < 640) {
	if (hellobar?.active?.val) {
		// 96 (without mobile footer)
		sliderHeightAccToPageHeight = innerHeight - 152
	} else {
		// 56 (without mobile footer)
		sliderHeightAccToPageHeight = innerHeight - 112
	}
} else if (innerWidth < 1024) {
	if (hellobar?.active?.val) {
		// 120 (without mobile footer)
		sliderHeightAccToPageHeight = innerHeight - 176
	} else {
		// 80 (without mobile footer)
		sliderHeightAccToPageHeight = innerHeight - 136
	}
} else {
	if (hellobar?.active?.val) {
		sliderHeightAccToPageHeight = innerHeight - 168
	} else {
		sliderHeightAccToPageHeight = innerHeight - 128
	}
}
</script>

<svelte:window bind:innerHeight bind:innerWidth />

<!-- Desktop banner -->

{#if sliderBannersDesktop?.length}
	<div class="hidden sm:block">
		<Carousel.Root
			opts="{{
				align: 'start',
				loop: true
			}}">
			<Carousel.Content class="-ml-5">
				{#each sliderBannersDesktop as b, ix}
					<Carousel.Item class="{bannerHeight === 50 ? 'h-[300px]' : 'h-[600px]'}">
						<div class="relative w-full">
							{#if b.img}
								<!-- Banner -->
								<a
									href="{navigateToProperPath(b.link || b.slugPath || b.slug)}"
									aria-label="Click to visit banner related products page"
									class="block h-full"
									data-sveltekit-preload-data>
									<LazyImg
										src="{b.img}"
										alt="banner {ix}"
										aspect_ratio="16:9"
										class="h-full w-full object-cover" />
								</a>
							{/if}
						</div>
					</Carousel.Item>
				{/each}
			</Carousel.Content>
			{#if sliderBannersDesktop?.length > 1}
				<Carousel.Previous />
				<Carousel.Next />
			{/if}
		</Carousel.Root>
	</div>
{/if}

<!-- Mobile banner -->

{#if sliderBannersMobile?.length}
	<div class="block sm:hidden">
		<Carousel.Root
			opts="{{
				align: 'start',
				loop: true
			}}">
			<Carousel.Content class="-ml-5">
				{#each sliderBannersMobile as b, ix}
					<Carousel.Item class="{bannerHeight === 50 ? 'h-[300px]' : 'h-[600px]'}">
						<div class="relative w-full">
							{#if b.img}
								<!-- Banner -->
								<a
									href="{navigateToProperPath(b.link || b.slugPath || b.slug)}"
									aria-label="Click to visit banner related products page"
									class="block h-full"
									data-sveltekit-preload-data>
									<LazyImg
										src="{b.img}"
										alt="banner {ix}"
										aspect_ratio="1:1"
										class="h-full w-full object-cover" />
								</a>
							{/if}
						</div>
					</Carousel.Item>
				{/each}
			</Carousel.Content>
			{#if sliderBannersDesktop?.length > 1}
				<Carousel.Previous />
				<Carousel.Next />
			{/if}
		</Carousel.Root>
	</div>
{/if}
