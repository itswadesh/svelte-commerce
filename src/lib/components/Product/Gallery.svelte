<style>
.frosted-black {
	backdrop-filter: blur(5px);
	background-color: hsla(0, 0%, 0%, 0.8);
}
</style>

<script>
import { slide } from 'svelte/transition'
import LazyImg from '../Image/LazyImg.svelte'
import { onMount } from 'svelte'

export let showPhotosModal = false,
	product = {}

let Carousel
onMount(async () => {
	const RTEmodule = await import('$lib/components/TwECarousel.svelte')
	Carousel = RTEmodule.default
})

let selectedImgCdn

if (product) {
	selectedImgCdn = product?.imagesCdn[0]
}
</script>

{#if showPhotosModal}
	<div
		class="frosted-black fixed inset-0 z-[60] flex h-screen w-screen items-center justify-center overflow-hidden sm:p-10 lg:p-20"
		transition:slide="{{ duration: 200 }}">
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

		<div class="relative md:hidden block">
			<svelte:component this="{Carousel}">
				{#each product?.imagesCdn as imgCdn, ix}
					{#if imgCdn}
						<div
							data-sveltekit-prefetch
							class="max-h-screen carousel-item relative float-left w-full 
							{ix == 0 ? 'active' : ''}">
							<LazyImg
								src="{imgCdn}"
								alt=" "
								class="block h-full w-full object-contain object-top" />
						</div>
					{/if}
				{/each}
			</svelte:component>
		</div>

		<div
			class="container relative mx-auto hidden h-full w-full flex-col items-center justify-between gap-4 overflow-hidden rounded-md bg-black md:flex lg:flex-row">
			{#if selectedImgCdn}
				<div
					class="flex h-full w-full flex-1 items-center justify-center overflow-hidden px-5 sm:px-10">
					<LazyImg
						src="{selectedImgCdn}"
						alt=" "
						width="1000"
						class="h-full w-full object-contain object-center" />
				</div>
			{/if}
			{#if product?.imagesCdn?.length}
				<div class="w-full flex-1 bg-white py-5 md:max-w-lg lg:h-full">
					<div class="mb-2 px-5">
						<h1 class="mb-1 font-bold sm:text-lg">Photos for {product?.name}</h1>

						<p class="text-sm">{product?.imagesCdn?.length} photos available</p>
					</div>

					<div
						class="grid grid-cols-3 gap-2 overflow-y-auto overflow-x-hidden px-5 scrollbar-thin scrollbar-thumb-slate-300 lg:max-h-[70vh] lg:grid-cols-2">
						{#each product?.imagesCdn as imgCdn}
							{#if imgCdn}
								<button
									type="button"
									class="relative z-0 col-span-1 border bg-gray-100 focus:outline-none"
									on:click="{() => (selectedImgCdn = imgCdn)}">
									<LazyImg
										src="{imgCdn}"
										alt=""
										height="240"
										class="max-w-60 h-40 w-full rounded-md object-contain object-center sm:h-60" />

									<div
										class="absolute inset-0 z-10 h-full w-full bg-white  
                                    {selectedImgCdn === imgCdn ? 'bg-opacity-0' : 'bg-opacity-50'}">
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
