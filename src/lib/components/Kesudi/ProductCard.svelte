<style>
@media (min-width: 640px) {
	.shadow-effect:hover {
		box-shadow: 0 2px 16px 4px rgba(40, 44, 63, 0.07);
	}
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
import { page } from '$app/stores'
import LazyImg from '$lib/components/Image/LazyImg.svelte'
import productNonVeg from '$lib/assets/product/non-veg.png'
import productVeg from '$lib/assets/product/veg.png'

// console.log('$page', $page)

export let product = {}
// console.log('product', product)

if (product?._source) {
	product = product?._source
}
</script>

{#if product}
	<div class="flex flex-col items-center text-center">
		<a
			href="/product/{product.slug}"
			rel="noopener noreferrer"
			aria-label="Click to view the product details"
			data-sveltekit-preload-data="tap"
			class="flex flex-col items-center">
			<!-- New -->
			{#if product.new || product.tags?.length}
				<div class="absolute top-1 left-1 flex flex-col gap-0.5">
					{#if product.new}
						<div
							class="text-rem max-w-max bg-red-500 py-0.5 px-1.5 text-xs font-semibold uppercase text-white">
							New
						</div>
					{/if}

					{#if product.tags?.length}
						{#each product.tags as tag}
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

			{#if product.img}
				<LazyImg
					src="{product.img}"
					alt="{product.name}"
					width="400"
					height="533"
					aspect_ratio="3:4"
					class="object-cover object-bottom text-xs" />
			{:else}
				<div
					class="bg-zinc-100 flex flex-col items-center justify-center p-5 text-zinc-500 text-xs text-center">
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
		</a>

		<div class="p-4 flex flex-col gap-2">
			<div class="flex gap-2 justify-between">
				<a
					href="/product/{product.slug}"
					rel="noopener noreferrer"
					aria-label="Click to view the product details"
					data-sveltekit-preload-data="tap"
					class="block flex-1 text-xs sm:text-sm truncate w-full group-hover:underline">
					{product.name || '_'}
				</a>

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

			<span>
				{currency(product.price, $page.data?.store?.currencySymbol)}
			</span>
		</div>
	</div>
{/if}
