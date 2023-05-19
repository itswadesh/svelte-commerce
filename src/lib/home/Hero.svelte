<script>
import { onMount } from 'svelte'
import { SplideSlide } from '@splidejs/svelte-splide'
import {LazyImg} from '$lib/components'

export let banners = []

$: sliderBanners = banners?.filter((b) => {
	return b.type === 'slider' && b.isMobile === false
})

$: sliderBannersMobile = banners?.filter((b) => {
	return b.type === 'slider' && b.isMobile === true
})

let Splide

onMount(async () => {
	const SplideModule = await import('$lib/components/SplideJs.svelte')
	Splide = SplideModule.default
})
</script>

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
</div> -->

<div class="relative mx-auto hidden w-full overflow-hidden bg-white sm:block">
	{#if sliderBanners?.length}
		<svelte:component this="{Splide}" options="{{ type: 'loop', autoplay: true, lazyLoad: true }}">
			{#each sliderBanners as b, ix}
				{#if b.img}
					<SplideSlide>
						<a
							href="{b.link || '##'}"
							aria-label="Click to visit banner related products page"
							class="block"
							data-sveltekit-preload-data>
							<LazyImg
								src="{b.img}"
								alt="{b.name}"
								height="384"
								class="block h-screen w-full object-contain object-top" />
							</a>
							<!-- aspect_ratio="4:1" -->
					</SplideSlide>
				{/if}
			{/each}
		</svelte:component>
	{/if}

	<!-- <svelte:component this="{Carousel}">
			{#each sliderBanners as b, ix}
				{#if b.img}
					<a
						href="{b.link || '##'}"
						aria-label="Click to visit banner related products page"
						data-sveltekit-preload-data
						class="carousel-item relative  float-left h-auto w-full {ix == 0 ? 'active' : ''}">
						<LazyImg
							src="{b.img}"
							alt="{b.name}"
							height="380"
							aspect_ratio="4:1"
							class="block h-auto w-full object-contain object-top" />
					</a>
				{/if}
			{/each}
		</svelte:component> -->
</div>

<div class="relative mx-auto block w-full overflow-hidden bg-white sm:hidden">
	{#if sliderBannersMobile?.length}
		<svelte:component
			this="{Splide}"
			options="{{ type: 'loop', autoplay: true, lazyLoad: true, arrows: false }}">
			{#each sliderBannersMobile as b, ix}
				{#if b.img}
					<SplideSlide>
						<a
							href="{b.link || '##'}"
							aria-label="Click to visit banner related products page"
							class="block"
							data-sveltekit-preload-data>
							<LazyImg
								src="{b.img}"
								alt="{b.name}"
								height="190"
								aspect_ratio="4:1"
								class="block h-auto w-full object-contain object-top" />
						</a>
					</SplideSlide>
				{/if}
			{/each}
		</svelte:component>
	{/if}
</div>
