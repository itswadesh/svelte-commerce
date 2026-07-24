<script lang="ts">
	import { page } from '$app/state'
	import { Button } from '$lib/components/ui/button'
	import { useProductState } from '$lib/core/composables/index.js'
	import { formatPrice } from '$lib/core/utils'
	import { Check, ChevronRight, HeartIcon, LoaderCircle, ShoppingCart, MoveRight, ShoppingBag } from '@lucide/svelte'
	import { fly } from 'svelte/transition'
	import EnquiryModal from '$lib/core/components/plugins/enquiry-modal.svelte'
	import { quintOut } from 'svelte/easing'

	const { showWishlist = true } = $props()

	const productState = useProductState()
	const enquiryPlugin = $derived(page.data?.store?.plugins?.enquiryMode)

	let showEnquiryModal = $state(false)

  function handleClick() {
    if (productState.cartState?.showCheckout)
      productState.cartState.isOpen = true
    else
      productState.handleAddToCart()
  }
</script>

{#snippet wishlistButton()}
	{#if showWishlist && productState.wishlistPluginEnabled}
		<Button
			variant="outline"
			size="icon"
			class="h-full w-[4rem] edp-wish"
			onclick={productState.handleWishlistClick}
			aria-label="Add to wishlist"
		>
			{#if productState.wishlistLoading}
				<LoaderCircle class="h-7 w-7 animate-spin text-primary" />
			{:else}
				<HeartIcon
					class="!h-6 !w-6 stroke-[1.3] {productState.wishlisted
						? 'scale-110 fill-red-500 text-red-500'
						: 'text-gray-900'} transition-transform duration-300"
				/>
			{/if}
		</Button>
	{/if}
{/snippet}

{#if productState.showAddToCartMessage}
	<!-- Added to cart message toast-like notification -->
	<div
		transition:fly={{ x: 50, duration: 300, easing: quintOut }}
		class="fixed hidden md:block right-4 top-24 z-[100] w-full max-w-sm rounded-lg border border-gray-100 bg-white p-4 shadow-2xl edp-toast"
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
			<Button
				size="sm"
				class="px-4"
				onclick={() => {
					if (productState.cartState) productState.cartState.isOpen = true
				}}
			>
				View Bag
			</Button>
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
				class="h-full w-full edp-atc"
			>
				{enquiryPlugin?.buttonText || 'Enquire'}
			</Button>
		{:else}
			<div class="flex h-full w-full gap-2">
				<Button
					class="edp-atc h-full flex justify-center items-center gap-2 text-base flex-1 uppercase font-semibold {productState
						.cartState?.addToCartMessage == 'Added to cart'
						? 'bg-green-600 hover:bg-green-700'
						: ''}"
					size="lg"
					disabled={productState.addToCartButtonDisabled}
					onclick={handleClick}
				>
					{#if !productState.isLoading && (!page.data?.product?.manageInventory ? false : productState.anyVariantStockThere ? (productState.selectedVariant?.manageInventory && !productState.selectedVariant?.stock) : !page.data?.product.stock)}
						Out of Stock
					{:else if productState.cartState?.showCheckout}
						Go to bag
						<ChevronRight class="h-5 w-5" />
					{:else}
						<ShoppingBag class="h-5 w-5" />
					<span class="">Add to bag</span>
					{/if}
				</Button>

				<!-- {#if productState.cartState.showCheckout}
					<Button
						href="/checkout/cart"
						class="h-full flex-1"
						size="lg"
					>
						Go to bag
						<MoveRight class="ml-2 h-4 w-4" />
					</Button>
				{/if} -->
			</div>
		{/if}
	</div>

	{@render wishlistButton()}
</div>

<style>
	/* Refined Editorial — default theme only. Primary fill CTA + bordered ghost wishlist. */
	:global([data-theme='default'] .edp-atc) {
		border-radius: var(--ed-radius) !important;
		font-size: 0.82rem !important;
		font-weight: 600;
		letter-spacing: 0.08em;
		transition:
			transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
			opacity 0.25s ease,
			background 0.25s ease;
	}

	:global([data-theme='default'] .edp-atc:hover:not(:disabled)) {
		transform: translateY(-2px);
	}

	:global([data-theme='default'] .edp-wish) {
		border: 1px solid var(--ed-line-strong) !important;
		border-radius: var(--ed-radius) !important;
		background: transparent !important;
		transition:
			border-color 0.2s ease,
			background 0.2s ease;
	}

	:global([data-theme='default'] .edp-wish:hover) {
		border-color: var(--ed-ink) !important;
		background: rgba(27, 26, 23, 0.04) !important;
	}

	:global([data-theme='default'] .edp-toast) {
		border: 1px solid var(--ed-line) !important;
		border-radius: var(--ed-radius) !important;
		background: var(--ed-surface) !important;
		box-shadow: 0 18px 48px -20px rgba(27, 26, 23, 0.35) !important;
	}

	@media (prefers-reduced-motion: reduce) {
		:global([data-theme='default'] .edp-atc),
		:global([data-theme='default'] .edp-wish) {
			transition: none;
		}
		:global([data-theme='default'] .edp-atc:hover:not(:disabled)) {
			transform: none;
		}
	}
</style>
