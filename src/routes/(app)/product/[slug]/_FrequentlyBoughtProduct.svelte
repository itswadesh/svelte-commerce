<script>
import { post } from '$lib/util/api'
import { invalidateAll } from '$app/navigation'
import { page } from '$app/stores'
import { date, currency, delay, toast } from '$lib/util'
import LazyImg from '$lib/components/Image/LazyImg.svelte'
import PrimaryButton from '$lib/ui/PrimaryButton.svelte'
import { applyAction, enhance } from '$app/forms'
import { fireGTagEvent } from '$lib/util/gTag'
import AnimatedCartItem from '$lib/components/AnimatedCartItem.svelte'

export let product = {}

let loading = false
let cartButtonText = 'Add to Bag'
let bounceItemFromTop = false

// async function addToBag(p) {
// 	loading = true
// 	cartButtonText = 'Adding...'

// 	try {
// 		await post(
// 			'carts/add-to-cart',
// 			{
// 				pid: p._id,
// 				vid: p._id,
// 				qty: 1,
// 				options: p.options,
// 				store: $page.data.store?.id
// 			},
// 			$page.data.origin
// 		)

// 		await invalidateAll() //$page.url.toString()
// 		cartButtonText = 'Go to cart'

// 		// const res = await getAPI('carts/my')

// 		// if (res) {
// 		// 	const cookieCart = {
// 		// 		items: res?.items,
// 		// 		qty: res?.qty,
// 		// 		tax: res?.tax,
// 		// 		subtotal: res?.subtotal,
// 		// 		total: res?.total,
// 		// 		currencySymbol: res?.currencySymbol,
// 		// 		discount: res?.discount,
// 		// 		selfTakeout: res?.selfTakeout,
// 		// 		shipping: res?.shipping,
// 		// 		unavailableItems: res?.unavailableItems,
// 		// 		formattedAmount: res?.formattedAmount
// 		// 	}
// 		// 	await cookies.set('cart', cookieCart, { path: '/' })
// 		// 	$page.data.cart = cookieCart
// 		// 	cartButtonText = 'Added To Cart'
// 		// 	bounceItemFromTop = true
// 		// }
// 	} catch (e) {
// 		cartButtonText = 'Error adding To Cart'
// 	} finally {
// 		loading = false
// 		await delay(5000)
// 		cartButtonText = 'Add to bag'
// 		bounceItemFromTop = false
// 	}
// }
</script>

<div class="group relative col-span-1 block w-full overflow-hidden sm:w-48 sm:flex-shrink-0">
	<a href="/product/{product.slug}" target="_blank" rel="noopener noreferrer">
		<div class="mb-2 h-40 overflow-hidden">
			<img
				src="{product.img}"
				alt="{product.name}"
				width="208"
				height="240"
				class="h-full w-full object-contain object-bottom" />
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
						class="flex-1 truncate text-sm text-gray-500 group-hover:text-blue-600 group-hover:underline sm:text-base">
						{product.name}
					</h2>

					{#if $page?.data?.store?.isFnb && product.foodType}
						<div>
							{#if product.foodType === 'veg'}
								<img src="/product/veg.png" alt="veg" class="h-5 w-5" />
							{:else if product.foodType === 'nonveg'}
								<img src="/product/non-veg.png" alt="non veg" class="h-5 w-5" />
							{/if}
						</div>
					{/if}
				{/if}
			</div>

			<!-- prices -->

			<div class="mx-auto flex max-w-max flex-wrap items-center gap-2">
				<span class="whitespace-nowrap text-sm"><b>{product.formattedPrice}</b></span>

				{#if product.mrp > product.price}
					<span class="whitespace-nowrap text-xs">
						<strike>{product.formattedMrp}</strike>
					</span>

					{#if Math.floor(((product.mrp - product.price) / product.mrp) * 100) > 0}
						<span class="whitespace-nowrap text-xs">
							({Math.floor(((product.mrp - product.price) / product.mrp) * 100)}%)
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
					class="relative flex w-full transform items-center justify-center overflow-hidden rounded-full border border-primary-500 bg-primary-500 px-4 py-2 text-center text-xs font-semibold tracking-wider text-white shadow-md transition duration-700 focus:outline-none focus:ring-0 focus:ring-offset-0 hover:border-primary-700 hover:bg-primary-700"
					href="/cart"
					data-sveltekit-preload-data>
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
							// console.log('bounceItemFromTop')
							bounceItemFromTop = true
							setTimeout(() => {
								bounceItemFromTop = false
							}, 3000)
							invalidateAll()
							await applyAction(result)
						}
					}}">
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
						class="text-xs">
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
