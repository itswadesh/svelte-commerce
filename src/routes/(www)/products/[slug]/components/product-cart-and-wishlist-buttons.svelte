<script lang="ts">
	import { page } from '$app/state'
	import { Button } from '$lib/components/ui/button'
	import { useProductState } from '$lib/core/composables/product'
	import { formatPrice } from '$lib/core/utils'
	import { fireGTagEvent } from '$lib/core/utils/gtag'
	import { Check, HeartIcon, LoaderCircle, ShoppingCart } from 'lucide-svelte'
	import { toast } from 'svelte-sonner'
	import { innerWidth } from 'svelte/reactivity/window'
	import { fly } from 'svelte/transition'

	const productState = useProductState()
</script>

{#if productState.wishlistPluginEnabled}
	<div class="flex items-center gap-2 sm:mb-3">
		<Button
			variant={innerWidth.current && innerWidth.current <= 640 ? 'ghost' : 'secondary'}
			class="flex w-full"
			onclick={productState.handleWishlistClick}
			aria-label="Add to wishlist"
		>
			{#if productState.wishlistLoading}
				<LoaderCircle class="animate-spin" />
			{:else if productState.wishlisted}
				<HeartIcon class="h-6 w-6 fill-black text-black max-sm:min-h-6 max-sm:min-w-6" />
				<span class="hidden sm:block">Remove from Wishlist </span>
			{:else}
				<HeartIcon class="h-6 w-6 max-sm:min-h-6 max-sm:min-w-6" />
				<span class="hidden sm:block">Add to Wishlist</span>
			{/if}
		</Button>
	</div>
{/if}

<div class="relative w-full">
	<!-- Added to cart message -->
	{#if productState.showAddToCartMessage}
		<div
			transition:fly={{ x: 50, duration: 150 }}
			class="fixed right-0 top-0 mr-2 mt-28 rounded-lg border border-gray-200 bg-white p-4 shadow-lg sm:mr-4"
		>
			<!-- close button -->
			<!-- <button
									class="absolute right-0 top-0 p-2"
									onclick={() => {
										showAddToCartMessage = false
									}}
								>
									<X class="h-4 w-4" />
									<span class="sr-only">Close</span>
								</button> -->
			<div class="flex flex-col items-center gap-4">
				<div class="flex min-w-40 items-center gap-5 min-[256px]:min-w-64">
					<img src={productState.selectedVariant?.image || productState.data?.product?.thumbnail} alt="Product" class="h-12 w-12 object-contain" />
					<div class="flex flex-col">
						<span class="line-clamp-3 max-w-40 text-xs font-semibold min-[256px]:max-w-64 sm:text-sm">{productState.data?.product?.title}</span>
						<span class="text-xs text-gray-500">
							{productState.selectedVariant?.title == 'default' ? '' : productState.selectedVariant?.title}
						</span>
						<span class="text-xs font-semibold"
							>{productState.qty} x {formatPrice(productState.selectedVariant?.price, page?.data?.store?.currency?.code)}</span
						>
					</div>
				</div>

				<!-- Checkout button -->
				<div class="flex w-full items-center">
					<a href="/checkout/cart" class="block w-full">
						<Button class="w-full" size="lg">Checkout</Button>
					</a>
				</div>
			</div>
		</div>
	{/if}

	<div class="w-full">
		{#if productState.cartState.showCheckout}
			<div class="flex items-center">
				<a href="/checkout/cart" class="block w-full">
					<Button class="w-full" size="lg">Checkout</Button>
				</a>
			</div>
		{:else}
			<div class="flex w-full items-center">
				<Button
					class="w-full {productState.cartState.addToCartMessage == 'Added to cart' ? 'bg-green-500 text-white hover:bg-green-600' : ''}"
					size="lg"
					disabled={productState.isAdding ||
						(!productState.data?.product?.manageInventory
							? false
							: productState.anyVariantStockThere
								? !productState.selectedVariant?.stock
								: !productState.data?.product.stock)}
					onclick={async () => {
						try {
							productState.isAdding = true
							await productState.cartState.addOrUpdate({
								productId: productState.data?.product?.id,
								variantId: productState.selectedVariant?.id,
								qty: productState.qty
							})
						} catch (e) {
							toast.error((e as Error).message || 'Failed to add item')
						} finally {
							productState.isAdding = false
						}
						if (productState.qty > 0) {
							// cartState.isOpen = true
							productState.showAddToCartMessage = true
							setTimeout(() => {
								productState.showAddToCartMessage = false
							}, productState.ADD_TO_CART_MESSAGE_DURATION)

							const me = productState.userState?.user
							const dataToFire = {
								items: [{ ...productState.data?.product, qty: productState.qty }],
								total: productState.data?.product?.price * productState.qty,
								qty: productState.qty,
								vendorBusinessName: productState.data?.product?.vendor?.businessName,
								user: {
									id: me?._id || me?.id,
									name: me?.firstName + ' ' + me?.lastName,
									email: me?.email
								}
							}
							fireGTagEvent('add_to_cart', dataToFire)
						}
					}}
				>
					{#if !productState.isLoading && (!productState.data?.product?.manageInventory ? false : productState.anyVariantStockThere ? !productState.selectedVariant?.stock : !productState.data?.product.stock)}
						Out of Stock
					{:else}
						{#if productState.cartState.addToCartMessage == 'Added to cart'}
							<Check class="mr-2 mt-0.5 h-4 w-4" />
						{:else if productState.cartState.addToCartMessage == 'Add to cart'}
							<ShoppingCart class="mr-2 mt-0.5 h-4 w-4" />
						{/if}
						{productState.cartState.addToCartMessage}
					{/if}
				</Button>
				<!-- {#if selectedVariant?.manageInventory} -- secret green wanted to hide it
									<div class="ml-4 w-32 text-sm text-red-500">
										Only {selectedVariant?.stock} left
									</div>
								{/if} -->
			</div>
		{/if}
	</div>
</div>

