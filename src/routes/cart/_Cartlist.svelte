<script lang="ts">
import ImageLoader from '$lib/components/Image/ImageLoader.svelte'

import { CDN_URL } from '$lib/config'
import { KQL_AddToCart, KQL_Cart } from '$lib/graphql/_kitql/graphqlStores'
import { createEventDispatcher } from 'svelte'
import { currency, store, toast } from '$lib/util'
const dispatch = createEventDispatcher()

export let item,
	addingToBag = false

$: discount = item.mrp ? Math.round(((item?.mrp - item?.price) * 100) / item?.mrp) : 0

async function addToBag(item, qty) {
	dispatch('addToCart', { item, qty })
}
</script>

<!-- Product detail start  -->
<div class="flex items-start border-b border-gray-200 py-5 sm:py-10">
	<a href="{`${item?.slug}`}">
		<img
			src="{`${item?.imgCdn}`}"
			alt=""
			class="w-20 cursor-pointer rounded-lg bg-gray-100 object-cover sm:w-32" />
	</a>
	<div class="mx-4 ">
		<div class="flex flex-wrap items-center justify-between">
			<a
				href="{`${item?.slug}?id=${item?.pid}`}"
				class="mr-5 w-72 cursor-pointer truncate text-base font-medium text-gray-600 hover:underline sm:text-lg">
				{item?.name}
			</a>
			<!-- <h2 class="whitespace-nowrap text-base sm:text-lg">Arrives by {item.deliveryDetails}</h2> -->
		</div>

		<div class="mb-1 {item.foodType ? 'flex items-start gap-2' : ''}">
			{#if item.foodType}
				<div class="mt-0.5 flex-shrink-0">
					{#if item.foodType === 'V'}
						<ImageLoader
							src="/product/veg.png"
							alt="veg"
							class="h-5 object-contain object-left-top" />
					{:else if item.foodType === 'N'}
						<ImageLoader
							src="/product/non-veg.png"
							alt="veg"
							class="h-5 object-contain object-left-top" />
					{:else}
						<ImageLoader
							src="/product/other.png"
							alt="veg"
							class="h-5 object-contain object-left-top" />
					{/if}
				</div>
			{/if}
		</div>

		<div class="mt-2 flex items-center">
			<span class="text-lg font-bold sm:text-xl">{currency(item?.price)}</span>
			<span class="ml-2 text-sm font-light text-gray-400 sm:text-base ">
				<span class="line-through">{currency(item?.mrp)}</span>
			</span>
			<span class="ml-2 text-sm text-green-500 sm:text-base ">
				{discount}% off
			</span>
		</div>
		<div class="my-2 flex justify-between">
			<div class="flex items-center justify-center">
				<button
					on:click="{() => addToBag(item, -1)}"
					type="button"
					class="flex h-6 w-6 transform items-center justify-center rounded-full  bg-gray-200 shadow transition  duration-300 hover:bg-gray-300 hover:opacity-80 focus:outline-none active:scale-95 sm:h-8 sm:w-8">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-4 w-4 text-gray-600"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"
						></path>
					</svg>
				</button>

				<div
					class="mx-2 flex h-6 w-6 items-center justify-center text-xs font-bold sm:h-8  sm:w-8  ">
					{#if $KQL_AddToCart?.isFetching || $KQL_Cart.isFetching}
						<img
							src="/dots-loading.gif"
							alt="loading"
							class="h-auto w-5 object-contain object-center" />
					{:else}
						<span>{item?.qty}</span>
					{/if}
				</div>

				<button
					on:click="{() => addToBag(item, 1)}"
					type="button"
					class="flex h-6 w-6 transform items-center justify-center rounded-full  bg-gray-200 shadow transition  duration-300 hover:bg-gray-300 hover:opacity-80 focus:outline-none active:scale-95 sm:h-8 sm:w-8">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-4 w-4 text-gray-600"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
					</svg>
				</button>
			</div>
			<div>
				<button
					on:click="{() => addToBag(item, -100000)}"
					class="flex h-10 w-10 transform items-center justify-center rounded-md bg-gray-200 text-xs  shadow transition duration-300 hover:bg-gray-300 hover:opacity-80 focus:outline-none active:scale-95">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5 text-gray-600"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
						></path>
					</svg>
				</button>
			</div>
		</div>
	</div>
</div>
