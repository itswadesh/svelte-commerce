<script lang="ts">
	import { page } from '$app/state'
	import { Button } from '$lib/components/ui/button'
	import { useProductState } from '$lib/core/composables/index.js'
	import { formatPrice } from '$lib/core/utils'
	import { Check, HeartIcon, LoaderCircle, ShoppingCart, MoveRight } from '@lucide/svelte'
	import { fly } from 'svelte/transition'
	import EnquiryModal from '$lib/core/components/plugins/enquiry-modal.svelte'
	import { quintOut } from 'svelte/easing'

	const { showWishlist = true } = $props()

	const productState = useProductState()
	const enquiryPlugin = $derived(page.data?.store?.plugins?.enquiryMode)

	let showEnquiryModal = $state(false)
</script>

{#snippet wishlistButton()}
	{#if showWishlist && productState.wishlistPluginEnabled}
		<button
			class="ease-out-expo flex h-full w-16 items-center justify-center rounded-md border border-gray-200 transition-all duration-300 hover:bg-gray-50 active:scale-95"
			onclick={productState.handleWishlistClick}
			aria-label="Add to wishlist"
		>
			{#if productState.wishlistLoading}
				<LoaderCircle class="h-6 w-6 animate-spin text-primary" />
			{:else}
				<HeartIcon
					class="h-6 w-6 {productState.wishlisted
						? 'scale-110 fill-red-500 text-red-500'
						: 'text-gray-900'} transition-transform duration-300"
				/>
			{/if}
		</button>
	{/if}
{/snippet}

{#if productState.showAddToCartMessage}
	<!-- Added to cart message toast-like notification -->
	<div
		transition:fly={{ x: 50, duration: 300, easing: quintOut }}
		class="fixed right-4 top-24 z-[100] w-full max-w-sm rounded-lg border border-gray-100 bg-white p-4 shadow-2xl"
	>
		<div class="flex items-center gap-4">
			<div class="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-100 bg-gray-50">
				<img
					src={productState.selectedVariant?.image || page.data?.product?.thumbnail}
					alt="Product"
					class="h-full w-full object-contain"
				/>
			</div>
			<div class="flex flex-1 flex-col gap-1">
				<p class="text-xs font-bold uppercase tracking-tight text-gray-900">Added to Bag</p>
				<p class="line-clamp-1 text-[11px] text-gray-500">{page.data?.product?.title}</p>
				<p class="text-xs font-bold text-primary">
					{formatPrice(productState.selectedVariant?.price, page?.data?.store?.currency?.code)}
				</p>
			</div>
			<a
				href="/checkout/cart"
				class="rounded-md bg-primary px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white transition-all active:scale-95"
			>
				View Bag
			</a>
		</div>
	</div>
{/if}

<div class="flex h-[4rem] items-center gap-4 lg:h-[3rem]">
	<div class="flex-1 h-full">
		{#if enquiryPlugin?.active}
			<EnquiryModal
				onClose={() => (showEnquiryModal = false)}
				isOpen={showEnquiryModal}
				productId={page.data?.product?.id}
				productTitle={page.data?.product?.title}
			/>
			<Button
				onclick={() => (showEnquiryModal = true)}
				class="ease-out-expo h-full w-full bg-primary text-xs font-bold uppercase tracking-widest transition-all duration-300 hover:bg-black active:scale-[0.98]"
			>
				{enquiryPlugin?.buttonText || 'Enquire'}
			</Button>
		{:else}
			<div class="flex h-full w-full gap-2">
				<Button
					class="ease-out-expo h-full flex-1 py-0 text-[10px] font-bold uppercase tracking-[0.1em] transition-all duration-300 active:scale-[0.98] sm:text-xs {productState
						.cartState.addToCartMessage == 'Added to cart'
						? 'bg-green-600 hover:bg-green-700'
						: 'bg-primary shadow-lg hover:shadow-xl'}"
					size="lg"
					disabled={productState.addToCartButtonDisabled}
					onclick={productState.handleAddToCart}
				>
					{#if !productState.isLoading && (!page.data?.product?.manageInventory ? false : productState.anyVariantStockThere ? !productState.selectedVariant?.stock : !page.data?.product.stock)}
						Out of Stock
					{:else}
						<ShoppingCart class="mr-2 h-4 w-4" />
						Add to bag
					{/if}
				</Button>

				{#if productState.cartState.showCheckout}
					<a href="/checkout/cart" class="h-full flex-1">
						<Button
							class="ease-out-expo h-full w-full bg-primary py-0 text-[10px] font-bold uppercase tracking-[0.1em] transition-all duration-300 hover:bg-black active:scale-[0.98] sm:text-xs"
							size="lg"
						>
							Go to bag
							<MoveRight class="ml-2 h-4 w-4" />
						</Button>
					</a>
				{/if}
			</div>
		{/if}
	</div>

	{@render wishlistButton()}
</div>
