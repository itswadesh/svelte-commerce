<style>
.frosted-black {
	backdrop-filter: blur(5px);
	background-color: hsla(0, 0%, 0%, 0.8);
}
</style>

<script>
import { SplideSlide } from '@splidejs/svelte-splide'
import { onMount } from 'svelte'
import { slide } from 'svelte/transition'
import LazyImg from '../Image/LazyImg.svelte'

export let showPhotosModal = false
export let product = {}
export let selectedImgIndex = 0

let selectedimg

$: if (product) {
	selectedimg = product?.images[selectedImgIndex]
}

let Carousel, Splide
onMount(async () => {
	// const RTEmodule = await import('$lib/components/TwECarousel.svelte')
	// Carousel = RTEmodule.default
	const SplideModule = await import('$lib/components/SplideJs.svelte')
	Splide = SplideModule.default
})
</script>

{#if showPhotosModal}
	<div
		class="frosted-black fixed inset-0 z-50 flex h-screen w-screen items-center justify-center overflow-hidden sm:p-10 lg:p-20">
		<button
			type="button"
			class="fixed top-2 right-2 transform cursor-pointer text-gray-200 transition duration-300 hover:scale-125 hover:text-white lg:top-5 lg:right-5"
			on:click="{() => (showPhotosModal = false)}">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="h-8 w-8">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
			</svg>
		</button>

		<!-- Mobile slider -->

		<div class="relative block lg:hidden">
			{#if product?.images?.length > 1}
				<svelte:component
					this="{Splide}"
					options="{{
						rewind: true,
						lazyLoad: true,
						perPage: 1,
						perMove: 1,
						arrows: false
						// breakpoints: {
						// 640: {
						// 	perPage: 1,
						// 	perMove: 1,
						// 	arrows: false
						// }
						// }
					}}">
					{#each product?.images as img}
						{#if img}
							<SplideSlide>
								<div class="itmes-center jusrify-center flex h-full w-full p-2 sm:p-5">
									<img
										src="{img}"
										alt=""
										class="block h-full w-full object-contain object-center" />
								</div>
							</SplideSlide>
						{/if}
					{/each}
				</svelte:component>

				<!-- <svelte:component this="{Carousel}">
					{#each product?.images as img, ix}
						{#if img}
							<div
								class="carousel-item relative float-left max-h-screen w-full 
							{ix == 0 ? 'active' : ''}">
								<img src="{img}" alt="" class="block h-full object-contain" />
							</div>
						{/if}
					{/each}
				</svelte:component> -->
			{:else if product?.images?.length === 1}
				<div data-sveltekit-preload-data class="max-h-screen w-full">
					<img src="{product?.images[0]}" alt="" class="block h-full object-contain" />
				</div>
			{:else}
				<div
					class="flex max-h-screen w-full items-center justify-center text-center text-sm text-white">
					Oops! No Image found
				</div>
			{/if}
		</div>

		<!-- Desktop Gallery -->

		<div
			class="container relative mx-auto hidden h-full w-full items-center justify-between gap-4 overflow-hidden rounded-md bg-black lg:flex lg:flex-row">
			{#if selectedimg}
				<div
					class="flex h-full w-full flex-1 flex-shrink-0 items-center justify-center overflow-hidden px-5 sm:px-10">
					<LazyImg src="{selectedimg}" alt="" class="h-full w-full object-contain object-center" />
				</div>
			{/if}

			{#if product?.images?.length}
				<div class="w-full flex-1 bg-white py-5 md:max-w-lg lg:h-full">
					<div class="mb-2 px-5">
						<h1 class="mb-1 font-bold sm:text-lg">Photos for {product?.name}</h1>

						<p class="text-sm">{product?.images?.length} photos available</p>
					</div>

					<div
						class="grid grid-cols-3 gap-2 overflow-y-auto px-5 overflow-x-hidden scrollbar-thin scrollbar-thumb-slate-300 lg:max-h-[70vh] lg:grid-cols-2">
						{#each product?.images as img}
							{#if img}
								<button
									type="button"
									class="relative z-0 col-span-1 border bg-gray-100 focus:outline-none"
									on:click="{() => (selectedimg = img)}">
									<LazyImg
										src="{img}"
										alt=""
										height="240"
										class="h-40 w-40 rounded-md object-contain object-center" />

									<div
										class="absolute inset-0 z-10 h-full w-full bg-white  
                                    {selectedimg === img ? 'bg-opacity-0' : 'bg-opacity-50'}">
									</div>
								</button>
							{/if}
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</div>
{/if}
