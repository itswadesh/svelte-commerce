<script lang="ts">
	import Autoplay from 'embla-carousel-autoplay'
	import * as Carousel from '$lib/components/ui/carousel'
	import LazyImg from '$lib/core/components/image/lazy-img.svelte'
	let { sliderBannersDesktop, sliderBannersMobile } = $props()

  const isVideoURL = (url: string) => /\.(mp4|webm|mkv)$/.test(url)
</script>

<!-- Desktop -->
<div class="hidden sm:block">
	<Carousel.Root opts={{ align: 'start', loop: true }} plugins={[Autoplay({ delay: 10000 })]}>
		<Carousel.Content class="-ml-5">
			{#each sliderBannersDesktop as b, ix}
				<Carousel.Item class="">
					<div class="relative w-full">
						{#if b.url}
							<!-- Banner -->
							<a href={b.link} aria-label="Click to visit banner related products page" class="block h-full" data-sveltekit-preload-data>
                {#if isVideoURL(b.url)}
                  <video class="w-full" src={b.url} loop autoplay>
                    <track kind="captions" />
                    <p> Video playback not supported </p>
                  </video>
                {:else}
								  <LazyImg aspectRatio="auto:auto" src={b.url} alt="banner {ix}" class="w-full object-cover" />
                {/if}
							</a>
						{/if}
					</div>
				</Carousel.Item>
			{/each}
		</Carousel.Content>
		<!-- {#if sliderBannersDesktop?.length > 1}
			<Carousel.Previous />
			<Carousel.Next />
		{/if} -->
	</Carousel.Root>
</div>

<!-- Mobile -->
<div class="block max-h-[300px] sm:hidden">
	<Carousel.Root opts={{ align: 'start', loop: true }} plugins={[Autoplay({ delay: 10000 })]}>
		<Carousel.Content class="-ml-5">
			{#each sliderBannersMobile as b, ix}
				<Carousel.Item class="h-full">
					<div class="relative w-full">
						{#if b.url}
							<!-- Banner -->
							<a href={b.link} aria-label="Click to visit banner related products page" class="block h-full" data-sveltekit-preload-data>
                {#if isVideoURL(b.url)}
                  <video class="w-full" src={b.url} loop autoplay>
                    <track kind="captions" />
                    <p> Video playback not supported </p>
                  </video>
                {:else}
								  <LazyImg src={b.url} aspectRatio="auto:auto" alt="banner {ix}" class="h-full w-full object-cover" />
                {/if}
							</a>
						{/if}
					</div>
				</Carousel.Item>
			{/each}
		</Carousel.Content>
		<!-- {#if sliderBannersMobile?.length > 1}
      <Carousel.Previous />
      <Carousel.Next />
    {/if} -->
	</Carousel.Root>
</div>
