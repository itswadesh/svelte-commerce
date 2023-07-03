<style>
.frosted-black {
	backdrop-filter: blur(5px);
	background-color: hsla(0, 0%, 0%, 0.8);
}
</style>

<script lang="ts">
import { fade } from 'svelte/transition'
import { onMount } from 'svelte'
import { page } from '$app/stores'
import { SplideSlide } from '@splidejs/svelte-splide'
import LazyImg from '../Image/LazyImg.svelte'

export let images = []
export let title = ''
export let selectedImgIndex = 0
export let showPhotosModal = false

let product_image_dimention = $page.data.store.product_image_dimention || '3x4'
let selectedimg: string

$: if (images?.length) {
	selectedimg = images[selectedImgIndex]
}

let Splide: any
onMount(async () => {
	const SplideModule = await import('$lib/components/SplideJs.svelte')
	Splide = SplideModule.default
})
</script>

{#if showPhotosModal}
	<div
		class="frosted-black fixed inset-0 z-[100] flex h-screen w-screen items-center justify-center overflow-hidden sm:p-10 lg:p-20">
		<button
			type="button"
			class="fixed top-5 right-5 transform cursor-pointer text-zinc-200 transition duration-300 hover:scale-125 hover:text-white lg:top-5 lg:right-5"
			on:click="{() => (showPhotosModal = false)}">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="w-10 h-10">
				<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
			</svg>
		</button>

		<!-- Mobile slider -->

		<div class="relative block lg:hidden">
			{#if images?.length > 1}
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
					{#each images as img, ix}
						{#if img}
							<SplideSlide>
								{#if product_image_dimention === '1x1'}
									<LazyImg
										src="{img}"
										alt="image {ix}"
										height="512"
										width="512"
										aspect_ratio="1:1"
										class="object-cover object-center w-full h-auto first-line:text-xs" />
								{:else}
									<LazyImg
										src="{img}"
										alt=""
										class="block h-full w-full object-contain object-center" />
								{/if}
							</SplideSlide>
						{/if}
					{/each}
				</svelte:component>
			{:else if images?.length === 1}
				{#if product_image_dimention === '1x1'}
					<LazyImg
						src="{images && images[0]}"
						alt="image 1"
						height="512"
						width="512"
						aspect_ratio="1:1"
						class="object-cover object-center w-full h-auto first-line:text-xs" />
				{:else}
					<LazyImg src="{images && images[0]}" alt="" class="block h-full object-contain" />
				{/if}
			{:else}
				<div
					class="flex max-h-screen w-full items-center justify-center text-center text-sm text-white">
					Oops! No Image found
				</div>
			{/if}
		</div>

		<!-- Desktop Gallery -->

		<div
			class="container relative mx-auto hidden h-full w-full items-center justify-between gap-4 overflow-hidden rounded bg-black lg:flex lg:flex-row">
			{#if selectedimg}
				<div
					class="flex h-full w-full flex-1 shrink-0 items-center justify-center overflow-hidden px-5 sm:px-10"
					in:fade="{{ duration: 1000 }}">
					<img
						src="{selectedimg}"
						alt="image"
						class="object-center w-full h-full first-line:text-xs object-contain" />
				</div>
			{/if}

			{#if images?.length}
				<div class="w-full flex-1 bg-white p-5 md:max-w-xs lg:h-full">
					<div class="mb-5">
						{#if title}
							<h2 class="mb-1 font-bold sm:text-lg truncate">
								Photos for {title}
							</h2>
						{/if}

						<p class="text-sm truncate">
							{images?.length} photos available
						</p>
					</div>

					<div
						class="overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-slate-300
						{title ? 'h-[90%]' : 'h-[94%]'}">
						<ul
							class="m-0 p-0 list-none grid grid-cols-3 items-start justify-between gap-2 lg:grid-cols-2">
							{#each images as img, ix}
								{#if img}
									<li>
										<button
											type="button"
											class="relative z-0 col-span-1 border bg-zinc-100 focus:outline-none flex items-center justify-center"
											on:click="{() => (selectedimg = img)}">
											<LazyImg
												src="{img}"
												alt="image {ix}"
												height="512"
												width="512"
												aspect_ratio="1:1"
												class="object-center w-full h-auto first-line:text-xs
												{product_image_dimention === '1x1' ? 'object-cover' : 'object-contain'}" />

											<div
												class="absolute inset-0 z-10 h-full w-full bg-white
												{selectedimg === img ? 'bg-opacity-0' : 'bg-opacity-50'}">
											</div>
										</button>
									</li>
								{/if}
							{/each}
						</ul>
					</div>
				</div>
			{/if}
		</div>
	</div>
{/if}
