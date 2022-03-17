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
import type { Product } from '$lib/types'

export let showPhotosModal = false
export let product: Product | any = {}
export let selectedImgIndex = 0

let product_image_dimention = $page.data.store.product_image_dimention || '3x4'
let selectedimg: string

$: if (product?.images) {
	selectedimg = product?.images[selectedImgIndex]
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
			class="fixed top-2 right-2 transform cursor-pointer text-zinc-200 transition duration-300 hover:scale-125 hover:text-white lg:top-5 lg:right-5"
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
					{#each product?.images as img, ix}
						{#if img}
							<SplideSlide>
								{#if product_image_dimention === '1x1'}
									<LazyImg
										src="{img}"
										alt="{product?.name} catelog {ix}"
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
			{:else if product?.images?.length === 1}
				{#if product_image_dimention === '1x1'}
					<LazyImg
						src="{product?.images && product?.images[0]}"
						alt="{product?.name} catelog 1"
						height="512"
						width="512"
						aspect_ratio="1:1"
						class="object-cover object-center w-full h-auto first-line:text-xs" />
				{:else}
					<LazyImg
						src="{product?.images && product?.images[0]}"
						alt=""
						class="block h-full object-contain" />
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
						alt="{product?.name} catelog"
						class="object-center w-full h-full first-line:text-xs
						{product_image_dimention === '1x1' ? 'object-cover' : 'object-contain'}" />
				</div>
			{/if}

			{#if product?.images?.length}
				<div class="w-full flex-1 bg-white py-5 md:max-w-lg lg:h-full">
					<div class="mb-2 px-5">
						<h2 class="mb-1 font-bold sm:text-lg">Photos for {product?.name}</h2>

						<p class="text-sm">{product?.images?.length} photos available</p>
					</div>

					<div
						class="grid grid-cols-3 gap-2 overflow-y-auto px-5 overflow-x-hidden scrollbar-thin scrollbar-thumb-slate-300 lg:max-h-[70vh] lg:grid-cols-2">
						{#each product?.images as img, ix}
							{#if img}
								<button
									type="button"
									class="relative z-0 col-span-1 border bg-zinc-100 focus:outline-none flex items-center justify-center"
									on:click="{() => (selectedimg = img)}">
									<LazyImg
										src="{img}"
										alt="{product?.name} catelog {ix}"
										height="512"
										width="512"
										aspect_ratio="1:1"
										class="object-center w-full h-auto first-line:text-xs{product_image_dimention ===
										'1x1'
											? 'object-cover'
											: 'object-contain'}" />

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
