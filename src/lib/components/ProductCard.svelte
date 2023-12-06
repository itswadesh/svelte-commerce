<style>
.shadow-effect:hover {
	box-shadow: 0 2px 16px 4px rgba(40, 44, 63, 0.07);
}
/* .zoom {
	overflow: hidden;
}
.zoom img {
	transition: transform 0.7s;
}
.zoom:hover img {
	transform: scale(1.035);
} */
.trans {
	transition: width 0.3s;
	overflow: hidden;
	justify-content: start;
	padding-left: 2px;
}
.trans:hover {
	width: 130px;
	padding-left: 0px;
	justify-content: center;
}
.text-rem {
	font-size: 0.6rem;
}
</style>

<script>
import { currency } from '$lib/utils'
import { fly } from 'svelte/transition'
import { page } from '$app/stores'
import LazyImg from '$lib/components/Image/LazyImg.svelte'
import productNonVeg from '$lib/assets/product/non-veg.png'
import productVeg from '$lib/assets/product/veg.png'
// import { storeStore } from '$lib/store/store'
import { browser } from '$app/environment'
import { onMount } from 'svelte'

export let product = {}
// console.log('zzzzzzzzzzzzzzzzzz', product)

if (product?._source) {
	product = product?._source
}

let isWislisted = false
let loadingForWishlist = false
let product_image_dimension = $page.data.store?.product_image_dimension || '3x4'
let ribbonTags = []
let show = false
let showRelatedProducts = false

function showitems() {
	show = true
}

function hideitems() {
	show = false
}

// console.log('product', product)

if (product?.tags?.length) {
	ribbonTags = product?.tags.filter((tag) => {
		return tag.type === 'Ribbon'
	})

	// console.log('Ribbon tags =', ribbonTags)
}

$: store = $page.data?.store

onMount(async () => {
	if (browser) {
		// storeStore.subscribe((value) => (store = value))
	}
})
</script>

{#if product}
	<div
		class="group relative col-span-1 block w-full sm:shrink-0 rounded bg-white shadow-effect overflow-hidden sm:overflow-visible
		{product_image_dimension == '16x9' ? 'md:w-[420px]' : 'sm:w-[210px]'}"
		on:mouseenter="{showitems}"
		on:mouseleave="{hideitems}">
		<a
			href="/product/{product.slug}"
			rel="noopener noreferrer"
			aria-label="Click to view the product details"
			data-sveltekit-preload-data="tap"
			class="flex flex-col items-center">
			<!-- New and Tags -->

			{#if ribbonTags?.length || product?.new}
				<div class="absolute z-10 top-1 left-1 flex flex-col gap-0.5">
					{#if product.new}
						<div
							class="text-rem max-w-max bg-red-500 py-0.5 px-1.5 text-xs font-semibold uppercase text-white">
							New
						</div>
					{/if}

					{#if ribbonTags?.length}
						{#each ribbonTags as tag}
							<div
								class="text-rem max-w-max py-0.5 px-1.5 text-xs font-semibold uppercase text-white"
								style="background-color: {tag.colorCode || '#27272A'};">
								{tag.name}
							</div>
						{/each}
					{/if}
				</div>
			{/if}

			{#if product_image_dimension == '1x1'}
				{#if product.img || (product.images && product.images[0])}
					<LazyImg
						src="{product.img || (product.images && product.images[0])}"
						alt="{product.name}"
						height="210"
						aspect_ratio="1:1"
						class="object-contain object-bottom w-[210px] h-[210px] text-xs rounded" />
				{:else}
					<div
						class="w-[210px] h-[210px] bg-zinc-100 flex flex-col items-center justify-center p-5 text-zinc-500 text-xs text-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="w-6 h-6">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
							></path>
						</svg>

						<span>No image available</span>
					</div>
				{/if}
			{:else if product_image_dimension == '3x4'}
				{#if product.img || (product.images && product.images[0])}
					<LazyImg
						src="{product.img || (product.images && product.images[0])}"
						alt="{product.name}"
						height="280"
						aspect_ratio="3:4"
						class="object-contain object-bottom w-[210px] h-[280px] text-xs" />
				{:else}
					<div
						class="w-[210px] h-[280px] bg-zinc-100 flex flex-col items-center justify-center p-5 text-zinc-500 text-xs text-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="w-6 h-6">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
							></path>
						</svg>

						<span>No image available</span>
					</div>
				{/if}
			{:else if product_image_dimension == '4x3'}
				{#if product.img || (product.images && product.images[0])}
					<LazyImg
						src="{product.img || (product.images && product.images[0])}"
						alt="{product.name}"
						height="157"
						aspect_ratio="4:3"
						class="object-contain object-bottom w-[210px] h-[157px] text-xs" />
				{:else}
					<div
						class="w-[210px] h-[157px] bg-zinc-100 flex flex-col items-center justify-center p-5 text-zinc-500 text-xs text-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="w-6 h-6">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
							></path>
						</svg>

						<span>No image available</span>
					</div>
				{/if}
			{:else if product_image_dimension == '16x9'}
				{#if product.img || (product.images && product.images[0])}
					<LazyImg
						src="{product.img || (product.images && product.images[0])}"
						alt="{product.name}"
						height="236"
						aspect_ratio="16:9"
						class="object-contain object-bottom w-[420px] h-[236px] text-xs" />
				{:else}
					<div
						class="w-[420px] h-[236px] bg-zinc-100 flex flex-col items-center justify-center p-5 text-zinc-500 text-xs text-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="w-6 h-6">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
							></path>
						</svg>

						<span>No image available</span>
					</div>
				{/if}
			{:else if product_image_dimension == '9x16'}
				{#if product.img || (product.images && product.images[0])}
					<LazyImg
						src="{product.img || (product.images && product.images[0])}"
						alt="{product.name}"
						height="373"
						aspect_ratio="9:16"
						class="object-contain object-bottom w-[210px] h-[373px] text-xs" />
				{:else}
					<div
						class="w-[210px] h-[373px] bg-zinc-100 flex flex-col items-center justify-center p-5 text-zinc-500 text-xs text-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="w-6 h-6">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
							></path>
						</svg>

						<span>No image available</span>
					</div>
				{/if}
			{/if}
		</a>

		<div class="p-4">
			<!-- View smilar button start-->

			<!-- <div class="{product.relatedProducts?.length > 0 ? 'absolute bottom-24 right-4' : 'hidden'}">
				<button class="focus:outline-none" on:click="{() => (showRelatedProducts = true)}">
					<div
						class="trans flex h-7 w-7 items-center rounded-full border border-primary-500 bg-white text-primary-500">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5 shrink-0"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
							></path>
						</svg>

						<span class="whitespace-nowrap pl-2 text-xs">View similar</span>
					</div>
				</button>
			</div> -->

			<!-- View smilar button end-->

			<!-- {#if show} -->
			<!-- For view above 640px start -->

			<!-- <div class="-mt-12 hidden sm:block"> -->
			<!-- View smilar button start-->

			<!-- <div
				class="flex justify-end 
					{product.relatedProducts?.length > 0 ? 'opacity-100' : 'opacity-0'}">
				<button class="focus:outline-none" on:click="{() => (showRelatedProducts = true)}">
					<div
						class="trans flex h-7 w-7 items-center rounded-full border border-primary-500 bg-white text-primary-500">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5 shrink-0"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
							></path>
						</svg>

						<span class="whitespace-nowrap pl-2 text-xs">View similar</span>
					</div>
				</button>
			</div> -->

			<!-- View smilar button end-->

			<!-- Wishlist start-->

			<!-- <button
				class="mt-3.5 flex w-full items-center justify-center  gap-2 border border-zinc-200 py-1 text-sm font-semibold focus:outline-none"
				on:click="{() => toggleWishlist(product._id)}">
				{#if isWislisted}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5 text-red-600"
						viewBox="0 0 20 20"
						fill="currentColor">
						<path
							fill-rule="evenodd"
							d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
							clip-rule="evenodd"></path>
					</svg>

					<span>Wishlisted</span>
				{:else}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5 shrink-0"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						stroke-width="2">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
						></path>
					</svg>

					<span>Wishlist</span>
				{/if}
			</button> -->

			<!-- Wishlist end-->

			<!-- Size chart start-->

			<!-- <div class="mt-1.5 flex items-baseline justify-start">
				<h2 class="mr-1 text-sm">Sizes:</h2>

				<h3 class="flex items-baseline gap-1 text-xs font-medium text-zinc-500 ">
					{#if product.variants?.length}
						{#each product.variants as v, i}
							<div>{v.size}</div>
						{/each}
					{:else}
						One Size
					{/if}
				</h3>
			</div> -->

			<!-- Size chart end-->
			<!-- </div> -->

			<!-- For view above 640px end -->

			<!-- For view below 640px start -->

			<!-- <div class="sm:hidden">
				<a
					href="/product/{product.slug}"
					rel="noopener noreferrer"
					aria-label="Click to view the product details"
					data-sveltekit-preload-data>
					<div class="flex items-center justify-between">
						<h2 class="mb-1.5 font-semibold">
							{#if product.brandName}
								{product.brandName}
							{:else}
								_
							{/if}
						</h2>

						<div class="sm:hidden">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
								></path>
							</svg>
						</div>
					</div>

					<h3
						href="{'/' + product.slug}"
						rel="noopener noreferrer"
						class="overflow-hidden overflow-ellipsis whitespace-nowrap text-sm font-medium group-hover:underline">
						{#if product.name}
							{product.name}
						{:else}
							_
						{/if}
					</h3>
				</a>
			</div> -->

			<!-- For view below 640px end -->
			<!-- {:else} -->
			<div>
				<!-- {#if !product.hasStock && !show}
					<p class="text-center text-xs text-red-600">Out of Stock</p>
				{/if} -->

				<a
					href="/product/{product.slug}"
					aria-label="Click to view the product details"
					data-sveltekit-preload-data>
					<!-- <div class="mb-1.5 flex items-center justify-between"> -->

					{#if product.brand?.name || product.brandName}
						<h3 class="text-xs sm:text-sm truncate">
							{product.brand?.name || product.brandName}
						</h3>
					{/if}

					<!-- Wishlist -->

					<!-- <div class="sm:hidden">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z">
							</path>
						</svg>
					</div> -->
					<!-- </div> -->

					<div class="flex gap-2 justify-between">
						<h4
							class="flex-1 text-xs sm:text-sm font-normal text-zinc-500 line-clamp-2 w-full group-hover:underline">
							{product.name || '_'}
						</h4>

						{#if $page?.data?.store?.isFnb && product.foodType}
							<div>
								{#if product.foodType === 'veg'}
									<img src="{productVeg}" alt="veg" class="h-5 w-5" />
								{:else if product.foodType === 'nonveg'}
									<img src="{productNonVeg}" alt="non veg" class="h-5 w-5" />
								{/if}
							</div>
						{/if}
					</div>
				</a>

				{#if $page?.data?.store?.isMultiVendor && product?.vendor && product?.vendor?.slug && product?.vendor?.businessName}
					<div class="flex items-center gap-1 text-xs sm:text-sm text-zinc-500">
						<span> By </span>

						<a
							href="/store/{product?.vendor?.slug}"
							class="block w-full truncate font-semibold hover:text-zinc-800 capitalize">
							{product?.vendor?.businessName}
						</a>
					</div>
				{/if}
			</div>
			<!-- {/if} -->

			{#if product.price}
				<a
					href="/product/{product.slug}"
					aria-label="Click to view the product details"
					data-sveltekit-preload-data>
					<!-- Price, MRP and Discount -->

					{#if product.price}
						<div
							class="{$page.data.store?.isSecureCatalogue && !$page.data?.me
								? 'hidden'
								: 'flex'} mt-1 flex-wrap items-baseline justify-start gap-1.5 text-xs leading-3">
							<span class="text-base font-bold whitespace-nowrap leading-3">
								{currency(product.price, store?.currencySymbol)}
							</span>

							{#if product.mrp > product.price}
								<span class="text-zinc-500 line-through whitespace-nowrap">
									{currency(product.mrp, store?.currencySymbol)}
								</span>

								{#if Math.floor(((product.mrp - product.price) / product.mrp) * 100) > 0}
									<span class="text-secondary-500 whitespace-nowrap">
										({Math.floor(((product.mrp - product.price) / product.mrp) * 100)}% off)
									</span>
								{/if}
							{/if}
						</div>
					{/if}
				</a>
			{/if}
		</div>
	</div>

	{#if showRelatedProducts}
		<div class="fixed inset-0 z-[100] h-screen w-full">
			<button
				class="absolute inset-0 cursor-default bg-black bg-opacity-50 focus:outline-none"
				on:click="{() => (showRelatedProducts = false)}">
			</button>

			<div
				transition:fly="{{ x: 400, duration: 500 }}"
				class="absolute inset-y-0 right-0 z-[101] h-full max-w-max border-l bg-white">
				<button
					type="button"
					class="absolute top-5 right-4 transform cursor-pointer text-zinc-500 transition duration-300 focus:outline-none hover:scale-125 hover:text-zinc-800"
					on:click="{() => (showRelatedProducts = false)}">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						viewBox="0 0 20 20"
						fill="currentColor">
						<path
							fill-rule="evenodd"
							d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
							clip-rule="evenodd"></path>
					</svg>
				</button>

				<div class="h-full shrink-0">
					<h2 class="border-b p-4 text-center font-bold uppercase sm:text-lg">Similar Products</h2>

					<div class="h-full overflow-y-auto overflow-x-hidden p-4 pb-16">
						<div class="grid grid-cols-2 sm:gap-4">
							{#each product.relatedProducts as relatedProduct}
								<a
									href="/product/{relatedProduct.slug}"
									rel="noopener noreferrer"
									class="group relative w-full sm:w-48"
									on:click="{() => (showRelatedProducts = false)}">
									<!-- New -->

									{#if relatedProduct.new}
										<div
											class="text-rem absolute top-2 left-2 max-w-max rounded bg-red-500 py-0.5 px-1.5 text-center uppercase tracking-wider text-white">
											NEW
										</div>
									{/if}

									<div class="w-[210px] h-[280px] overflow-hidden">
										<LazyImg
											src="{product.img || (product.images && product.images[0])}"
											alt="{product.name}"
											height="280"
											class="object-contain object-bottom w-[210px] h-[280px] text-xs" />
									</div>

									<div class="p-4">
										{#if relatedProduct.brand?.name}
											<h2 class="mb-1.5 font-semibold">
												{relatedProduct.brand?.name}
											</h2>
										{/if}

										<h3
											class="overflow-hidden overflow-ellipsis whitespace-nowrap text-sm group-hover:underline">
											{#if relatedProduct.name}
												{relatedProduct.name}
											{:else}
												_
											{/if}
										</h3>

										<div
											class="mt-2.5 flex flex-wrap items-baseline justify-start leading-4 text-xs gap-1.5">
											<span class="font-semibold sm:text-sm whitespace-nowrap">
												{currency(relatedProduct.price, store?.currencySymbol)}
											</span>

											{#if relatedProduct.mrp > relatedProduct.price}
												<span class="text-zinc-500 line-through whitespace-nowrap">
													{currency(relatedProduct.mrp, store?.currencySymbol)}
												</span>

												{#if Math.floor(((relatedProduct.mrp - relatedProduct.price) / relatedProduct.mrp) * 100) > 0}
													<span class="text-green-600 sm:text-zinc-800 whitespace-nowrap">
														({Math.floor(
															((relatedProduct.mrp - relatedProduct.price) / relatedProduct.mrp) *
																100
														)}% off)
													</span>
												{/if}
											{/if}
										</div>
									</div>
								</a>
							{/each}
						</div>
					</div>
				</div>
			</div>
		</div>
	{/if}
{/if}
