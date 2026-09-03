<script lang="ts">
	import { page } from '$app/state'
	import { Button } from '$lib/components/ui/button'
	import Spinner from '$lib/components/common/spinner.svelte'
	import { useProductState } from '$lib/core/composables/index.js'
	import { formatPrice } from '$lib/core/utils'
	import { Check, HeartIcon, ShoppingBag } from '@lucide/svelte'
	import { fly } from 'svelte/transition'
	import EnquiryModal from '$lib/core/components/plugins/enquiry-modal.svelte'
	import { quintOut } from 'svelte/easing'
	import { toast } from 'svelte-sonner'

	/**
	 * `compact` is the sticky mobile bar: CTA only, no secondary link, no wishlist.
	 */
	const { showWishlist = true, compact = false } = $props()

	const productState = useProductState()
	const enquiryPlugin = $derived(page.data?.store?.plugins?.enquiryMode)

	let showEnquiryModal = $state(false)

	// Availability is read from the selected variant with the product record as the fallback, so
	// the CTA is correct during SSR too. It used to be gated on `productState.isLoading`, which is
	// true for the whole server render, so the label carried no availability at all until
	// hydration finished.
	const variant = $derived(productState.selectedVariant?.id ? productState.selectedVariant : null)
	const stockSource = $derived<Record<string, any> | null>(variant ?? page.data?.product ?? null)
	const outOfStock = $derived(
		!!stockSource && stockSource.manageInventory !== false && !stockSource.allowBackorder && Number(stockSource.stock ?? 0) <= 0
	)

	const cartCount = $derived(productState.cartState?.cart?.lineItems?.length ?? 0)
	const thumbnail = $derived(productState.selectedVariant?.img || productState.selectedVariant?.image || page.data?.product?.thumbnail || '')

	// Success is owned here rather than read from `cartState.addToCartMessage`. The store never
	// sets the 'Added to cart' string the old green style waited for, so that state could not fire;
	// and the message it does set ('Proceed to checkout') used to rewrite the primary button into
	// "Go to bag" for five seconds, so a shopper who picked another size and pressed the button
	// again got the cart drawer instead of a second line item.
	const SUCCESS_MS = 2200
	let justAdded = $state(false)
	let resetTimer: ReturnType<typeof setTimeout> | undefined

	$effect(() => () => clearTimeout(resetTimer))

	async function addToBag() {
		const added = await productState.handleAddToCart()
		if (!added) return

		justAdded = true
		clearTimeout(resetTimer)
		resetTimer = setTimeout(() => (justAdded = false), SUCCESS_MS)

		// The confirmation card below is desktop-only, so phones had no confirmation at all. The
		// shared toast covers them — but only when nothing else is already confirming: the cart
		// sidebar opens itself on `showCheckout`, and a toast on top of the open drawer would be
		// the third acknowledgement of one tap.
		const drawerWillConfirm = !!(productState.cartState?.isOpen || productState.cartState?.showCheckout)
		if (!drawerWillConfirm && typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches) {
			toast.success('Added to bag', {
				description: page.data?.product?.title,
				action: {
					label: 'View bag',
					onClick: () => {
						if (productState.cartState) productState.cartState.isOpen = true
					}
				}
			})
		}
	}
</script>

{#snippet wishlistButton()}
	{#if showWishlist && productState.wishlistPluginEnabled}
		<Button
			variant="outline"
			size="icon"
			class="edp-wish h-full w-11 shrink-0 md:w-10"
			onclick={productState.handleWishlistClick}
			aria-label="Add to wishlist"
		>
			{#if productState.wishlistLoading}
				<Spinner size={5} label="Updating wishlist" class="text-primary" />
			{:else}
				<HeartIcon
					class="!h-5 !w-5 stroke-[1.3] {productState.wishlisted
						? 'scale-110 fill-destructive text-destructive'
						: 'text-foreground'} transition-transform duration-fast"
				/>
			{/if}
		</Button>
	{/if}
{/snippet}

<!-- Adding to the bag also opens the cart drawer, which shows the same line item with the same
     "View Bag" affordance. Two confirmations of one action, stacked on top of each other, so this
     card stands down whenever the drawer is the thing on screen. -->
{#if productState.showAddToCartMessage && !productState.cartState?.isOpen && !compact}
	<div
		transition:fly={{ x: 50, duration: 300, easing: quintOut }}
		class="edp-toast fixed right-4 top-24 z-toast hidden w-full max-w-sm rounded-lg border bg-card p-3 shadow-z-10 md:block"
		role="status"
	>
		<div class="flex items-center gap-3">
			{#if thumbnail}
				<div class="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border bg-muted">
					<img src={thumbnail} alt="" width="48" height="48" class="h-full w-full object-contain" />
				</div>
			{/if}
			<div class="flex flex-1 flex-col gap-1">
				<p class="text-sm font-semibold text-foreground">Added to bag</p>
				<p class="line-clamp-1 text-xs text-muted-foreground">{page.data?.product?.title}</p>
				<p class="text-xs font-bold text-foreground">
					{formatPrice(productState.selectedVariant?.price || page.data?.product?.price, page.data?.store?.currency?.code)}
				</p>
			</div>
			<Button
				size="sm"
				class="px-4"
				onclick={() => {
					if (productState.cartState) productState.cartState.isOpen = true
				}}
			>
				View bag
			</Button>
		</div>
	</div>
{/if}

<div class="flex flex-col gap-2">
	<div class="flex h-11 items-center gap-2 md:h-10">
		<div class="h-full flex-1">
			{#if enquiryPlugin?.active}
				<EnquiryModal
					onClose={() => (showEnquiryModal = false)}
					isOpen={showEnquiryModal}
					productId={page.data?.product?.id}
					productTitle={page.data?.product?.title}
				/>
				<Button onclick={() => (showEnquiryModal = true)} class="edp-atc h-full w-full">
					{enquiryPlugin?.buttonText || 'Enquire'}
				</Button>
			{:else}
				<!-- One action, one label. Loading, success and out-of-stock are states of this button,
				     never a different button in its place. -->
				<Button
					data-testid="add-to-cart-button"
					class="edp-atc flex h-full w-full items-center justify-center gap-2 text-sm font-semibold uppercase {justAdded
						? 'bg-success text-success-foreground hover:bg-success'
						: ''}"
					size="lg"
					aria-busy={productState.isAdding}
					disabled={productState.isAdding || outOfStock}
					onclick={addToBag}
				>
					{#if productState.isAdding}
						<Spinner label="Adding to bag" />
						<span>Adding…</span>
					{:else if justAdded}
						<Check class="h-4 w-4" aria-hidden="true" />
						<span>Added</span>
					{:else if outOfStock}
						<span>Out of stock</span>
					{:else}
						<ShoppingBag class="h-4 w-4" aria-hidden="true" />
						<span>Add to bag</span>
					{/if}
				</Button>
			{/if}
		</div>

		{@render wishlistButton()}
	</div>

	<!-- A quiet link, not a second primary button: the shopper can reach the bag they already have
	     without the add action ever moving out from under their finger. -->
	{#if !compact && cartCount > 0}
		<Button variant="link" href="/checkout/cart" class="h-auto self-start p-0 text-sm font-medium">
			Go to bag ({cartCount})
		</Button>
	{/if}
</div>

<style>
	/* Refined Editorial — default theme only. Primary fill CTA + bordered ghost wishlist. */
	:global([data-theme='default'] .edp-atc) {
		border-radius: var(--ed-radius) !important;
		font-size: 0.8rem !important;
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
		background: hsl(var(--muted)) !important;
	}

	:global([data-theme='default'] .edp-toast) {
		border: 1px solid var(--ed-line) !important;
		border-radius: var(--ed-radius) !important;
		background: var(--ed-surface) !important;
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
