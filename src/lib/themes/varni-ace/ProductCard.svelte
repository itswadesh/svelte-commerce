<style>
.text-rem {
	font-size: 0.6rem;
}
</style>

<script>
// import productNonVeg from '$lib/assets/product/non-veg.png'
// import productVeg from '$lib/assets/product/veg.png'
import discountBadge from '$lib/assets/product/discount-badge.svg'
import videoIcon from '$lib/assets/product/video-icon.svg'
import { currency, getIdFromYoutubeVideo, toast } from '$lib/utils'
import { LazyImg } from '$lib/components'
import { onMount } from 'svelte'
import { page } from '$app/stores'
import { browser } from '$app/environment'
import { storeStore } from '$lib/store/store'

export let product = {}

let isVideoUrlAvailable = false
let newProduct = {}
let store = {}
onMount(() => {
	if (browser) {
		storeStore.subscribe((value) => (store = value))
	}
	if (product?._source) {
		newProduct = product?._source
		newProduct._id = product?._id
	} else {
		newProduct = product
	}

	if (newProduct) {
		newProduct?.images?.forEach((img) => {
			if (isVideoUrlAvailable) {
				return
			} else {
				const videoId = getIdFromYoutubeVideo(img)


				if (videoId) {
					isVideoUrlAvailable = videoId
				}
			}
		})

	}
})
</script>

<div
	class="relative col-span-1 flex flex-col gap-2 items-center justify-center p-2 w-full border sm:w-[200px] sm:shrink-0">
	<!-- New and Tags -->

	{#if newProduct.new || newProduct.tags?.length}
		<div class="absolute top-0 right-0 flex flex-col gap-0.5 text-right">
			{#if newProduct.new}
				<div
					class="text-rem max-w-max bg-red-500 py-0.5 px-1.5 text-xs font-semibold uppercase text-white">
					New
				</div>
			{/if}

			{#if newProduct.tags?.length}
				{#each newProduct.tags as tag}
					{#if tag?.name && tag?.type === 'Ribbon'}
						<div
							class="text-rem max-w-max py-0.5 px-1.5 text-xs font-semibold uppercase text-white"
							style="background-color: {tag.colorCode};">
							{tag.name}
						</div>
					{/if}
				{/each}
			{/if}
		</div>
	{/if}

	{#if Math.floor(((newProduct.mrp - newProduct.price) / newProduct.mrp) * 100) > 0}
		<div class="absolute z-10 -top-3.5 left-2">
			<div class="relative">
				<img src="{discountBadge}" alt="" class="h-auto w-14 object-contain object-bottom" />

				<div
					class="absolute z-20 text-white font-semibold inset-x-0 top-0 pt-2.5 flex items-center justify-center text-center gap-[1px] leading-3">
					<span class="text-lg">
						{Math.floor(((newProduct.mrp - newProduct.price) / newProduct.mrp) * 100)}
					</span>

					<span class="text-sm"> % </span>
				</div>
			</div>
		</div>
	{/if}

	<!-- Product image -->

	<a
		href="/product/{newProduct.slug}"
		rel="noopener noreferrer"
		aria-label="Click to view the product details"
		data-sveltekit-preload-data="tap"
		class="block">
		<LazyImg
			src="{newProduct.img}"
			alt="{newProduct.name}"
			width="200"
			height="200"
			aspect_ratio="1:1"
			class="object-contain object-bottom w-[200px] h-[200px] text-xs" />
	</a>

	<div class="rounded-bull h-1 bg-zinc-200 w-10"></div>

	<!-- Product name and prices -->

	<div>
		<p class="text-sm line-clamp-2">
			{newProduct.name || '_'}
		</p>

		<div class="mt-1 flex items-center gap-1 justify-between">
			<div
				class="{store?.isSecureCatalogue && !$page.data?.me ? 'hidden' : 'flex'}
				flex-wrap flex-1 items-baseline gap-1 text-xs">
				<span class="whitespace-nowrap text-sm font-bold sm:text-base text-secondary-500">
					{currency(newProduct.price, store?.currencySymbol)}
				</span>

				{#if newProduct.mrp > newProduct.price}
					<span class="whitespace-nowrap text-zinc-500 line-through">
						{currency(newProduct.mrp, store?.currencySymbol)}
					</span>
				{/if}
			</div>

			{#if isVideoUrlAvailable}
				<div class="ml-auto">
					<img src="{videoIcon}" alt="" class="h-8 w=8 object-contain object-right" />
				</div>
			{/if}
		</div>

		<!-- Out of Stock -->

		{#if !newProduct.hasStock}
			<p class="absolute inset-x-0 top-[12.5rem] text-center text-xs text-red-600">Out of Stock</p>
		{/if}
	</div>
</div>
