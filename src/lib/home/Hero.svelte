<script>
import LazyImg from '$lib/components/Image/LazyImg.svelte'

export let banners = []

$: sliderBanners = banners?.filter((b) => {
	return b.type === 'slider' && b.isMobile === false
})

$: sliderBannersMobile = banners?.filter((b) => {
	return b.type === 'slider' && b.isMobile === true
})
</script>

<!-- <div class="w-full overflow-hidden">
	{#if sliderBanners?.length > 0}
		<LazyImg
			src="{sliderBanners[0]?.img}"
			alt="banner"
			class="h-full w-full object-contain object-center" />
	{:else}
		<div class="h-full w-full animate-pulse bg-gray-300"></div>
	{/if}
</div> -->

{#if sliderBanners?.length > 0}
	<div class="relative mx-auto hidden h-auto w-full overflow-hidden bg-white sm:block">
		<div class="carousel">
			{#each sliderBanners as b, bx}
				<div id="{`slide${bx}`}" role="banner" class="carousel-item relative h-auto w-full">
					{#if b.imgCdn}
						<a href="{b.link}" sveltekit:prefetch class="h-auto w-full">
							<LazyImg
								src="{b.imgCdn}"
								alt="{b.name}"
								width="1500"
								height="380"
								class="h-auto w-full object-contain object-top" />
						</a>
					{/if}
				</div>

				<div class="absolute left-5 right-5 top-1/2 flex justify-between">
					<!-- Previous slide button -->

					{#if bx != 0}
						<a
							href="{`#slide${bx - 1}`}"
							aria-label="Click for previous slide"
							class="absolute left-5 z-10 -mt-3.5 hidden items-center justify-center rounded-full bg-white bg-opacity-50 p-2 text-gray-800 transition duration-300 hover:bg-opacity-70 sm:flex">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"></path>
							</svg>
						</a>
					{/if}

					<!-- Next slide button -->

					{#if bx + 1 < sliderBanners?.length}
						<a
							href="{`#slide${bx + 1}`}"
							aria-label="Click for next slide"
							class="absolute right-5 z-10 -mt-3.5 hidden items-center justify-center rounded-full bg-white bg-opacity-50 p-2 text-gray-800 transition duration-300 hover:bg-opacity-70 sm:flex">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"></path>
							</svg>
						</a>
					{/if}
				</div>
			{/each}
		</div>
	</div>
{/if}

{#if sliderBannersMobile?.length > 0}
	<div class="mx-auto block h-auto w-full overflow-hidden bg-white sm:hidden">
		{#if sliderBannersMobile?.length > 0}
			<div class="carousel">
				{#each sliderBannersMobile as b, bx}
					<div id="{`slide${bx}`}" role="banner" class="carousel-item h-auto w-full">
						{#if b.imgCdn}
							<a href="{b.link}" class="h-auto w-full" data-sveltekit-prefetch>
								<LazyImg
									src="{b.imgCdn}"
									alt="{b.alt || ''}"
									width="360"
									height="190"
									class="h-auto w-full object-contain object-top" />
							</a>
						{/if}
					</div>
				{/each}
			</div>
		{/if}
	</div>
{/if}
