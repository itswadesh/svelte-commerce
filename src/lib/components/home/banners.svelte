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
								  <div class="relative group">
                    <LazyImg aspectRatio="auto:auto" src={b.url} alt="Promotional Banner {ix + 1} - Shop the latest collection" class="w-full object-cover" fetchpriority={ix === 0 ? 'high' : 'auto'} loading={ix === 0 ? 'eager' : 'lazy'} />
                    <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/10">
                      <a href="/products" class="bg-white text-black px-6 py-2 rounded-none font-semibold uppercase tracking-widest shadow-lg">Shop Now</a>
                    </div>
                  </div>
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
<div class="block max-h-[600px] sm:hidden">
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
								  <LazyImg src={b.url} aspectRatio="auto:auto" alt="Promotional Mobile Banner {ix + 1} - Exclusive Deals" class="h-full w-full object-cover" fetchpriority={ix === 0 ? 'high' : 'auto'} loading={ix === 0 ? 'eager' : 'lazy'} />
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
