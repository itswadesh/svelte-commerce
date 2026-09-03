<script lang="ts">
	import CartItem from '$lib/components/cart/cart-item.svelte'
	import { X, ShoppingBag } from '@lucide/svelte'
	import { Button } from '$lib/components/ui/button'
	import { Skeleton } from '$lib/components/ui/skeleton/index.js'
	import { goto } from '$app/navigation'
	import { formatPrice } from '$lib/core/utils'
	import { getCartState } from '@misiki/kitcommerce-core/stores'
	import { cubicOut } from 'svelte/easing'
	import { page } from '$app/state'
	import { onDestroy, onMount } from 'svelte'
	import { dialog } from '$lib/actions/dialog.js'

	const cartState = getCartState()
	const storeData = $derived(page.data?.store)

	// One busy flag for the whole panel. The old guard read `isUpdatingCart`, which the line-item
	// update path never sets, so the checkout CTA stayed enabled and the subtotal stayed at full
	// contrast while a quantity change was still in flight — a shopper could start checkout against
	// a figure that was already wrong. The store flips `updatingItem[lineId]` around every line
	// mutation, so the two together are the honest answer.
	const isBusy = $derived(!!cartState?.isUpdatingCart || Object.values(cartState?.updatingItem || {}).some(Boolean))

	const subtotal = $derived(formatPrice(cartState?.cart?.subtotal ?? cartState?.cart?.total ?? 0, storeData?.currencyCode))
	const itemCount = $derived(cartState?.cart?.lineItems?.length ?? 0)

	const { onClose, onContinueShopping, onRemoveCartItem } = $props()
	const modalHistoryKey = '__svelteCommerceCartSidebar'
	const titleId = $props.id()
	let ownsHistoryEntry = false
	let isNavigatingFromCart = false

	// The core nav composable exposes close as `(e) => { e.stopPropagation(); … }`, so every caller
	// that has no event to hand it — the dialog action's Escape key, the popstate handler — threw a
	// TypeError before anything closed. Escape left the drawer open and the focus trap in place,
	// which is the one escape hatch a modal must always have. Give it a no-op event.
	const noopEvent = { stopPropagation() {} } as unknown as Event
	function closeCart(e?: Event) {
		onClose?.(e ?? noopEvent)
	}

	// Auto-open the slide-out cart on any successful add/update action.
	// `showCheckout` is flipped to true by the core store's add()/update() on a
	// user action, but is NOT set during initial cart hydration, so watching it
	// opens the drawer on "add to bag" without spurious opens on page load.
	// Seed the baseline to the mount-time value so only a false→true transition
	// that happens while this component is mounted opens the drawer (avoids a
	// spurious open when returning to a shop page while showCheckout is still on).
	let prevShowCheckout = !!cartState?.showCheckout

	function handleBrowserBack() {
		if (!cartState?.isOpen || !ownsHistoryEntry) return
		ownsHistoryEntry = false
		cartState.isOpen = false
		closeCart()
	}

	onMount(() => {
		window.addEventListener('popstate', handleBrowserBack)
		return () => window.removeEventListener('popstate', handleBrowserBack)
	})

	$effect(() => {
		if (typeof window === 'undefined') return

		if (cartState?.isOpen && !ownsHistoryEntry) {
			history.pushState({ ...history.state, [modalHistoryKey]: true }, '', window.location.href)
			ownsHistoryEntry = true
		} else if (!cartState?.isOpen && ownsHistoryEntry) {
			const isCurrentModalEntry = history.state?.[modalHistoryKey] === true
			ownsHistoryEntry = false
			if (isCurrentModalEntry && !isNavigatingFromCart) history.back()
			isNavigatingFromCart = false
		}
	})

	onDestroy(() => {
		if (typeof window !== 'undefined' && ownsHistoryEntry && history.state?.[modalHistoryKey] === true) {
			history.back()
		}
	})

	$effect(() => {
		const showCheckout = !!cartState?.showCheckout
		if (showCheckout && !prevShowCheckout && cartState && !cartState.isOpen) {
			cartState.isOpen = true
		}
		prevShowCheckout = showCheckout
	})

	// A panel slides in from the edge it is anchored to; it does not squash. The previous transition
	// animated `scaleX` from a top-right origin over 500ms, which stretched every price and button
	// inside it horizontally for half a second. `prefers-reduced-motion` collapses it to a fade.
	function slideInFromRight(node: Element, params: { duration?: number } = {}) {
		const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

		return {
			duration: reduced ? 0 : (params.duration ?? 220),
			easing: cubicOut,
			css: (t: number, u: number) => `transform: translateX(${u * 100}%); opacity: ${Math.min(1, t * 1.5)};`
		}
	}

	async function proceedToCart() {
		isNavigatingFromCart = true
		if (typeof window !== 'undefined' && history.state?.[modalHistoryKey] === true) {
			const nextState = { ...history.state }
			delete nextState[modalHistoryKey]
			history.replaceState(nextState, '', window.location.href)
		}
		if (cartState) cartState.isOpen = false
		await goto('/checkout/cart')
	}
</script>

<!-- No role="navigation": a single toggle button is not a navigation landmark, and an unnamed
     one just adds noise to the screen-reader landmark list. -->
<div class="relative">
	<!-- The box makes the target, not the 20px glyph: 44px on phones, 36px from md up, the same
	     geometry as every other header action. -->
	<button
		data-testid="cart-icon"
		class="flex h-9 w-9 items-center justify-center rounded-full max-md:h-11 max-md:w-11"
		aria-label="Cart, {cartState?.cart?.qty ?? 0} items"
		aria-expanded={!!cartState?.isOpen}
		onclick={() => {
			if (cartState) cartState.isOpen = !cartState.isOpen
		}}
	>
		<ShoppingBag class="h-5 w-5" />
		{#if cartState?.cart?.total && cartState.cart?.lineItems?.length > 0}
			<span
				class="absolute right-0 top-0 inline-flex -translate-y-1/2 translate-x-1/2 transform items-center justify-center rounded-full bg-primary px-1.5 py-1 text-xs font-bold leading-none text-primary-foreground"
			>
				{cartState.cart.qty}
			</span>
		{/if}
	</button>
	{#if cartState?.isOpen}
		<!-- close cart backdrop -->
		<Button
			variant="ghost"
			class="fixed inset-0 z-overlay h-svh w-full rounded-none border-0 bg-foreground/40 hover:bg-foreground/40"
			aria-label="Close cart"
			onclick={closeCart}
		>
			<style>
				body {
					overflow: hidden;
				}
			</style>
			<span class="sr-only">Close cart</span>
		</Button>

		<!-- Named z step instead of `z-[10000000]`, tokens instead of `bg-white`: the theme wrapper
		     now sits on <html>, so a panel painted in `bg-background` follows the active theme
		     rather than freezing the default palette into the drawer. -->
		<div
			class="fixed right-0 top-0 z-modal flex h-svh w-full flex-col bg-background shadow-z-10 sm:w-[26rem]"
			transition:slideInFromRight={{ duration: 220 }}
			role="dialog"
			aria-modal="true"
			aria-labelledby={titleId}
			tabindex="-1"
			use:dialog={closeCart}
		>
			<div class="flex shrink-0 items-center justify-between gap-2 border-b border-border px-4 py-3">
				<h2 id={titleId} class="text-base font-semibold text-foreground">
					Your bag
					{#if itemCount > 0}
						<span class="font-normal text-muted-foreground">({cartState.cart.qty})</span>
					{/if}
				</h2>
				<Button variant="ghost" size="icon" class="-mr-2 rounded-full" aria-label="Close cart" onclick={closeCart}>
					<X class="size-5" />
				</Button>
			</div>

			{#if itemCount > 0}
				<div class="min-h-0 flex-1 divide-y divide-border overflow-y-auto px-4">
					{#each cartState.cart?.lineItems || [] as _, i}
						<CartItem bind:cartProduct={cartState.cart.lineItems[i]} removeItem={onRemoveCartItem} />
					{/each}
				</div>

				<div class="shrink-0 border-t border-border bg-muted/40 px-4 py-4 pb-[calc(1rem_+_env(safe-area-inset-bottom))]">
					<div class="flex items-baseline justify-between gap-4">
						<p class="text-sm font-medium text-foreground">Subtotal</p>
						{#if isBusy}
							<!-- Stale figures at full contrast are worse than none: while a line update is in
							     flight the amount is skeletoned rather than left asserting the old number. -->
							<Skeleton class="h-6 w-24" />
						{:else}
							<p class="text-lg font-bold text-foreground">{subtotal}</p>
						{/if}
					</div>
					<p class="mt-1 text-xs text-muted-foreground">Shipping and taxes calculated at checkout.</p>

					<!-- The drawer had no live region, so a screen-reader user heard nothing when a quantity
					     change moved the subtotal. -->
					<p class="sr-only" aria-live="polite" aria-atomic="true">
						{isBusy ? 'Updating your bag' : `${cartState.cart.qty} items in your bag, subtotal ${subtotal}`}
					</p>

					<Button
						disabled={isBusy}
						aria-busy={isBusy}
						onclick={(e) => {
							e.stopPropagation()
							proceedToCart()
						}}
						class="mt-4 h-12 w-full text-sm font-semibold"
					>
						Checkout
					</Button>
					<Button
						variant="link"
						onclick={onContinueShopping}
						class="mt-1 h-11 w-full text-sm font-medium text-muted-foreground hover:text-foreground hover:no-underline"
					>
						Continue shopping
					</Button>
				</div>
			{:else}
				<div class="flex flex-1 flex-col items-center justify-center gap-2 px-6 pb-10 text-center">
					<div class="mb-4 rounded-full bg-muted p-6">
						<ShoppingBag class="h-9 w-9 text-muted-foreground" />
					</div>
					<p class="text-base font-semibold text-foreground">Your bag is empty</p>
					<p class="max-w-xs text-sm leading-relaxed text-muted-foreground">Nothing here yet. Browse the store and add something you like.</p>
					<Button onclick={onContinueShopping} class="mt-6 h-11 px-8">Start shopping</Button>
				</div>
			{/if}
		</div>
	{/if}
</div>
