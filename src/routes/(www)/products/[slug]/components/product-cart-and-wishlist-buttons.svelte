<script lang="ts">
	import { page } from '$app/state'
	import { Button } from '$lib/components/ui/button'
	import { useProductState } from '$lib/core/composables/index.js'
	import { formatPrice } from '$lib/core/utils'
	import { fireGTagEvent } from '$lib/core/utils/index.js'
	import { Check, HeartIcon, LoaderCircle, ShoppingCart } from '@lucide/svelte'
	import { toast } from 'svelte-sonner'
	import { innerWidth } from 'svelte/reactivity/window'
	import { fly } from 'svelte/transition'
	import EnquiryModal from '$lib/core/components/plugins/enquiry-modal.svelte'

	const productState = useProductState()
	const enquiryPlugin = $derived(page.data?.store?.plugins?.enquiryMode)

	let showEnquiryModal = $state(false)
</script>

{#if productState.wishlistPluginEnabled}
	<div class="flex items-center gap-3 sm:mb-4">
		<button
			class="flex flex-1 items-center justify-center gap-2 rounded-md border border-gray-200 py-3 transition-all duration-300 ease-out-expo hover:bg-gray-50 active:scale-95"
			onclick={productState.handleWishlistClick}
			aria-label="Add to wishlist"
		>
			{#if productState.wishlistLoading}
				<LoaderCircle class="h-5 w-5 animate-spin text-primary" />
			{:else}
				<HeartIcon class="h-5 w-5 {productState.wishlisted ? 'fill-red-500 text-red-500 scale-110' : 'text-gray-900'} transition-transform duration-300" />
				<span class="text-xs font-bold uppercase tracking-widest text-gray-900">
					{productState.wishlisted ? 'Wishlisted' : 'Add to Wishlist'}
				</span>
			{/if}
		</button>
	</div>
{/if}

{#if enquiryPlugin?.active}
	<EnquiryModal
		onClose={() => (showEnquiryModal = false)}
		isOpen={showEnquiryModal}
		productId={page.data?.product?.id}
		productTitle={page.data?.product?.title}
	/>
	<Button onclick={() => (showEnquiryModal = true)} class="w-full bg-primary hover:bg-black text-xs font-bold uppercase tracking-widest py-6 transition-all duration-300 ease-out-expo active:scale-[0.98]"> {enquiryPlugin?.buttonText || "Enquire"} </Button>
{:else}
	<div class="relative w-full">
		{#if productState.showAddToCartMessage}
			<!-- Added to cart message toast-like notification -->
			<div
				transition:fly={{ x: 50, duration: 300, easing: quintOut }}
				class="fixed right-4 top-24 z-[100] w-full max-w-sm rounded-lg border border-gray-100 bg-white p-4 shadow-2xl"
			>
				<div class="flex items-center gap-4">
					<div class="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-100 bg-gray-50">
						<img src={productState.selectedVariant?.image || page.data?.product?.thumbnail} alt="Product" class="h-full w-full object-contain" />
					</div>
					<div class="flex flex-1 flex-col gap-1">
						<p class="text-xs font-bold text-gray-900 uppercase tracking-tight">Added to Bag</p>
						<p class="line-clamp-1 text-[11px] text-gray-500">{page.data?.product?.title}</p>
						<p class="text-xs font-bold text-primary">
							{formatPrice(productState.selectedVariant?.price, page?.data?.store?.currency?.code)}
						</p>
					</div>
					<a href="/checkout/cart" class="rounded-md bg-primary px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-black transition-all active:scale-95">
						View Bag
					</a>
				</div>
			</div>
		{/if}

		<div class="w-full">
			{#if productState.cartState.showCheckout}
				<div class="flex items-center">
					<a href="/checkout/cart" class="block w-full">
						<Button class="w-full bg-primary hover:bg-black py-6 text-xs font-bold uppercase tracking-widest transition-all duration-300 ease-out-expo active:scale-[0.98]" size="lg">Go to Checkout</Button>
					</a>
				</div>
			{:else}
				<div class="flex w-full items-center">
					<Button
						class="w-full py-7 text-sm font-bold uppercase tracking-[0.2em] transition-all duration-300 ease-out-expo active:scale-[0.98] {productState.cartState.addToCartMessage == 'Added to cart' ? 'bg-green-600 hover:bg-green-700' : 'bg-primary hover:bg-black shadow-lg hover:shadow-xl'}"
						size="lg"
						disabled={productState.addToCartButtonDisabled}
						onclick={productState.handleAddToCart}
					>
						{#if !productState.isLoading && (!page.data?.product?.manageInventory ? false : productState.anyVariantStockThere ? !productState.selectedVariant?.stock : !page.data?.product.stock)}
							Out of Stock
						{:else}
							{#if productState.cartState.addToCartMessage == 'Added to cart'}
								<Check class="mr-3 h-5 w-5" />
							{:else if productState.cartState.addToCartMessage == 'Add to cart'}
								<ShoppingCart class="mr-3 h-5 w-5" />
							{/if}
							{productState.cartState.addToCartMessage}
						{/if}
					</Button>
				</div>
			{/if}
		</div>
	</div>
{/if}
