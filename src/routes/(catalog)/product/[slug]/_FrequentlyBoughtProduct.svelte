<script>
import { applyAction, enhance } from '$app/forms'
import { currency } from '$lib/utils'
import { fireGTagEvent } from '$lib/utils/gTag'
import { invalidateAll } from '$app/navigation'
import { page } from '$app/stores'
import AnimatedCartItem from '$lib/components/AnimatedCartItem.svelte'
import LazyImg from '$lib/components/Image/LazyImg.svelte'
import PrimaryButton from '$lib/ui/PrimaryButton.svelte'
import productNonVeg from '$lib/assets/product/non-veg.png'
import productVeg from '$lib/assets/product/veg.png'

export let product = {}

let loading = false
let cartButtonText = 'Add to Bag'
let bounceItemFromTop = false
</script>

<div class="group relative col-span-1 block w-full overflow-hidden sm:w-48 sm:shrink-0">
	<a
		href="/product/{product.slug}"
		target="_blank"
		rel="noopener noreferrer"
		aria-label="Click to route product details page"
	>
		<div class="mb-2 h-[280px] w-[210px] overflow-hidden">
			<LazyImg
				src="{product.img}"
				alt="{product.name}"
				width="210"
				height="280"
				class="h-[280px] w-[210px] object-contain object-bottom text-xs"
			/>
		</div>

		<div class="flex flex-col gap-1">
			<!-- Brand -->

			{#if product.brand?.name}
				<h1 class="text-center text-lg uppercase"><b>{product.brand?.name}</b></h1>
			{/if}

			<!-- Name -->

			<div class="flex justify-between gap-2">
				{#if product.name}
					<h2
						class="flex-1 truncate text-sm text-gray-500 group-hover:text-blue-600 group-hover:underline sm:text-base"
					>
						{product.name}
					</h2>

					{#if $page?.data?.store?.isFnb && product.foodType}
						<div>
							{#if product.foodType === 'veg'}
								<img src="{productVeg}" alt="veg" class="h-5 w-5" />
							{:else if product.foodType === 'nonveg'}
								<img src="{productNonVeg}" alt="non veg" class="h-5 w-5" />
							{/if}
						</div>
					{/if}
				{/if}
			</div>

			<!-- prices -->

			<div class="mx-auto flex max-w-max flex-wrap items-center gap-2 text-xs">
				<span class="whitespace-nowrap text-sm">
					<b>
						{currency(product.price, $page.data?.store?.currencySymbol)}
					</b>
				</span>

				{#if product.mrp > product.price}
					<span class="whitespace-nowrap text-gray-600 line-through">
						{currency(product.mrp, $page.data?.store?.currencySymbol)}
					</span>

					{#if product.discount > 0}
						<span class="whitespace-nowrap text-green-600">
							({product.discount}%)
						</span>
					{/if}
				{/if}
			</div>
		</div>
	</a>

	<div class="mx-auto mt-2 max-w-max">
		{#if product.active && product.hasStock}
			{#if cartButtonText === 'Go to cart'}
				<a
					href="/cart"
					aria-label="cart"
					class="relative flex w-full transform items-center justify-center overflow-hidden rounded-full border border-primary-500 bg-primary-500 px-4 py-2 text-center text-xs font-semibold tracking-wider text-white shadow-md transition duration-700 focus:outline-none focus:ring-0 focus:ring-offset-0 hover:border-primary-700 hover:bg-primary-700"
					data-sveltekit-preload-data
				>
					{cartButtonText}
				</a>
			{:else}
				<form
					action="/cart?/add"
					method="POST"
					use:enhance="{() => {
						return async ({ result }) => {
							result.data.qty < 0
								? fireGTagEvent('remove_from_cart', result.data)
								: fireGTagEvent('add_to_cart', result.data)
							bounceItemFromTop = true
							setTimeout(() => {
								bounceItemFromTop = false
							}, 3000)
							invalidateAll()
							await applyAction(result)
						}
					}}"
				>
					<input type="hidden" name="pid" value="{product?._id}" />
					<input type="hidden" name="vid" value="{product?._id}" />
					<input type="hidden" name="qty" value="{1}" />
					<input type="hidden" name="options" value="{JSON.stringify(product?.options)}" />
					<input type="hidden" name="customizedImg" value="{'undefined'}" />

					<PrimaryButton
						type="submit"
						loading="{loading}"
						loadingringsize="xs"
						roundedFull
						class="text-xs"
					>
						{cartButtonText}
					</PrimaryButton>
				</form>
			{/if}
		{:else}
			<PrimaryButton type="button" roundedFull class="text-xs">Item Unavailable</PrimaryButton>
		{/if}
	</div>
</div>

{#if bounceItemFromTop}
	<AnimatedCartItem img="{product?.img}" />
{/if}
