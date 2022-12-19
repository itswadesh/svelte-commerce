<script>
import LazyImg from '$lib/components/Image/LazyImg.svelte'
import { onMount } from 'svelte'

export let banners = []

$: sliderBanners = banners?.filter((b) => {
	return b.type === 'slider' && b.isMobile === false
})

$: sliderBannersMobile = banners?.filter((b) => {
	return b.type === 'slider' && b.isMobile === true
})

let Carousel
onMount(async () => {
	const RTEmodule = await import('$lib/components/TwECarousel.svelte')
	Carousel = RTEmodule.default
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
		<div class="h-full w-full animate-pulse bg-gray-300"></div>
	{/if}
</div> -->

{#if sliderBanners?.length > 0}
	<div class="relative mx-auto mt-20 hidden h-auto w-full overflow-hidden bg-white sm:block">
		<svelte:component this="{Carousel}">
			{#each sliderBanners as b, ix}
				{#if b.img}
					<a
						href="{b.link}"
						data-sveltekit-preload-data
						class="carousel-item relative  float-left h-auto w-full {ix == 0 ? 'active' : ''}">
						<LazyImg
							src="{b.img}"
							alt="{b.name}"
							width="1500"
							height="380"
							aspect_ratio="4:1"
							class="block h-auto w-full object-contain object-top" />
					</a>
				{/if}
			{/each}
		</svelte:component>
	</div>
{/if}

{#if sliderBannersMobile?.length > 0}
	<div class="mx-auto block h-auto w-full overflow-hidden bg-white sm:hidden">
		<svelte:component this="{Carousel}">
			{#each sliderBannersMobile as b, ix}
				{#if b.img}
					<a
						href="{b.link}"
						data-sveltekit-preload-data
						class="carousel-item relative float-left h-auto w-full {ix == 0 ? 'active' : ''}">
						<LazyImg
							src="{b.img}"
							alt="{b.name}"
							width="360"
							height="190"
							class="block h-auto w-full object-contain object-top" />
					</a>
				{/if}
			{/each}
		</svelte:component>
	</div>
{/if}
