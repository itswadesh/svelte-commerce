<script lang="ts">
	import { page } from '$app/state'
	import { Button } from '$lib/components/ui/button'
	import { useProductState } from '$lib/core/composables/index.js'
	import { Check, ChevronRight, HeartIcon, LoaderCircle, ShoppingCart, MoveRight, ShoppingBag } from '@lucide/svelte'
	import EnquiryModal from '$lib/core/components/plugins/enquiry-modal.svelte'

	const { showWishlist = true } = $props()

	const productState = useProductState()
	const enquiryPlugin = $derived(page.data?.store?.plugins?.enquiryMode)

	let showEnquiryModal = $state(false)

  // Adding to the bag opens the cart drawer, which shows the item, its price and the
  // checkout path — that drawer IS the confirmation, so nothing else announces the add.
  //
  // The open is explicit rather than left to cart-sidebar's auto-open: that effect only
  // fires when the cart goes from empty to non-empty, so a SECOND add would otherwise
  // give the shopper no feedback at all.
  async function handleClick() {
    if (productState.cartState.showCheckout) {
      productState.cartState.isOpen = true
      return
    }
    // handleAddToCart swallows failures (it raises its own error toast) and returns false;
    // don't open an empty drawer over a failed add.
    const added = await productState.handleAddToCart()
    if (added !== false) productState.cartState.isOpen = true
  }
</script>

{#snippet wishlistButton()}
	{#if showWishlist && productState.wishlistPluginEnabled}
		<Button
			variant="outline"
			size="icon"
			class="h-full w-[4rem]"
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

<!--
	Adding to the bag opens the cart sidebar (cart-sidebar.svelte opens it as soon as the
	cart becomes non-empty), which already shows the item, its price and a checkout path.
	The floating "Added to Bag" card that used to sit here said the same thing at the same
	moment, so it has been removed rather than duplicating the confirmation.
-->

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
				class="h-full w-full"
			>
				{enquiryPlugin?.buttonText || 'Enquire'}
			</Button>
		{:else}
			<div class="flex h-full w-full gap-2">
				<Button
					class="h-full flex justify-center items-center gap-2 text-base flex-1 uppercase font-semibold {productState
						.cartState.addToCartMessage == 'Added to cart'
						? 'bg-green-600 hover:bg-green-700'
						: ''}"
					size="lg"
					disabled={productState.addToCartButtonDisabled}
					onclick={handleClick}
				>
					{#if !productState.isLoading && (!page.data?.product?.manageInventory ? false : productState.anyVariantStockThere ? (productState.selectedVariant?.manageInventory && !productState.selectedVariant?.stock) : !page.data?.product.stock)}
						Out of Stock
					{:else if productState.cartState.showCheckout}
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
