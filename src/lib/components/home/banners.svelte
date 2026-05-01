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
					<div class="relative w-full overflow-hidden rounded-none shadow-2xl">
						{#if b.url}
							<!-- Banner -->
							<a href={b.link} aria-label="Click to visit banner related products page" class="group block h-full" data-sveltekit-preload-data>
                {#if isVideoURL(b.url)}
                  <video class="w-full object-cover" src={b.url} loop autoplay muted playsinline>
                    <track kind="captions" />
                    <p> Video playback not supported </p>
                  </video>
                {:else}
								  <div class="relative overflow-hidden">
                    <LazyImg aspectRatio="auto:auto" src={b.url} alt="Promotional Banner {ix + 1} - Shop the latest collection" class="w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.02]" fetchpriority={ix === 0 ? 'high' : 'auto'} loading={ix === 0 ? 'eager' : 'lazy'} />
                    <div class="absolute inset-0 flex flex-col items-center justify-center bg-black/10 transition-opacity duration-500 group-hover:bg-black/20">
                      <div class="translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                        <span class="mb-6 block text-center text-sm font-black uppercase tracking-[0.4em] text-white/90">Curated for you</span>
                        <div class="relative text-center overflow-hidden rounded-full bg-white px-10 py-4 text-sm font-black uppercase tracking-widest text-black shadow-2xl transition-all hover:scale-105 active:scale-95">
                          Shop Now
                        </div>
                      </div>
                    </div>
                  </div>
                {/if}
							</a>
						{/if}
					</div>
				</Carousel.Item>
			{/each}
		</Carousel.Content>
	</Carousel.Root>
</div>

<!-- Mobile -->
<div class="block max-h-[600px] sm:hidden">
	<Carousel.Root opts={{ align: 'start', loop: true }} plugins={[Autoplay({ delay: 10000 })]}>
		<Carousel.Content class="-ml-5">
			{#each sliderBannersMobile as b, ix}
				<Carousel.Item class="h-full">
					<div class="relative w-full overflow-hidden rounded-none shadow-lg">
						{#if b.url}
							<!-- Banner -->
							<a href={b.link} aria-label="Click to visit banner related products page" class="group block h-full" data-sveltekit-preload-data>
                {#if isVideoURL(b.url)}
                  <video class="w-full object-cover" src={b.url} loop autoplay muted playsinline>
                    <track kind="captions" />
                    <p> Video playback not supported </p>
                  </video>
                {:else}
								  <div class="relative">
                    <LazyImg src={b.url} aspectRatio="auto:auto" alt="Promotional Mobile Banner {ix + 1} - Exclusive Deals" class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]" fetchpriority={ix === 0 ? 'high' : 'auto'} loading={ix === 0 ? 'eager' : 'lazy'} />
                    <div class="absolute inset-0 flex items-center justify-center">
                      <div class="rounded-full bg-white/90 backdrop-blur-sm px-6 py-2.5 text-xs font-black uppercase tracking-widest text-black shadow-xl">
                        Shop Now
                      </div>
                    </div>
                  </div>
                {/if}
							</a>
						{/if}
					</div>
				</Carousel.Item>
			{/each}
		</Carousel.Content>
	</Carousel.Root>
</div>
