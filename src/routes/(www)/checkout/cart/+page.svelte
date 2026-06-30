<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js'
	import { Check, LoaderCircle, LockKeyhole, Minus, Plus, ShoppingBag, Tag, Trash, X } from '@lucide/svelte'
	import { formatPrice } from '$lib/core/utils/index.js'
	import LoadingDots from '$lib/core/components/common/loading-dots.svelte'
	import { page } from '$app/state'
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte'
	import OrderTrustBadges from '$lib/core/components/plugins/order-trust-badges.svelte'
	import CouponsDrawer from '$lib/components/coupon/coupons-drawer.svelte'
	import { CartModule } from '$lib/core/composables/index.js'
	import CheckoutHeader from '$lib/components/checkout/checkout-header.svelte'
	import LazyImg from '$lib/core/components/image/lazy-img.svelte'
	import CheckoutButton from '$lib/components/buttons/checkout-button.svelte'
	import Blocks from '$lib/components/page-blocks/blocks.svelte'

	const cartModule = new CartModule()
	const cartState = cartModule.cartState
	$inspect(page.data)
</script>

<Blocks layouts={page.data.page.layouts} />

<svelte:head>
	<title>Cart - {page?.data?.store?.name || ''}</title>
</svelte:head>

<div class="min-h-screen py-8">
	<div class="container mx-auto px-4">
		<CheckoutHeader step={1} />

		<!-- <div class="mb-8">
		  <div>
				<p class="font-semibold tracking-tight text-xl">My Bag <span class="font-bold">({cartState?.cart?.lineItems?.length ?? 0}) {cartState.cart.lineItems.length>1 ? "Items" : "Item"}</span></p>
			</div>
		</div> -->

		<!-- {#if freeShippingOn && cartState?.cart?.total <= freeShippingOn}
      <div class="bg-gray-100 p-4 py-2 rounded-lg text-sm text-gray-600 w-fit mb-5">
        <p>
          <span>✨🎉 Free Shipping For all Orders Over {formatPrice(
              freeShippingOn,
              page?.data?.store?.currency?.code
            )} 🚚</span>
        </p>
      </div>
    {:else if freeShippingOn && cartState?.cart?.total > freeShippingOn}
      <div class="bg-gray-100 p-4 py-2 rounded-lg text-sm text-gray-600 w-fit mb-5">
        <p>
          <span>🚚 Yay! You get <span class="text-green-400">FREE</span> delivery on
            this order</span>
        </p>
      </div>
    {/if} -->

		{#await cartState.hasLoaded}
			<div class="flex min-h-96 items-center justify-center py-8">
				<LoaderCircle class="animate-spin" />
			</div>
		{:then _}
			{#if cartState.cart?.lineItems?.length === 0}
				<div class="flex h-[60vh] flex-col items-center justify-center text-center">
					<div class="mb-6 rounded-full bg-gray-50 p-8 ring-1 ring-gray-100">
						<ShoppingBag class="h-12 w-12 text-gray-300" />
					</div>
					<h2 class="mb-2 text-xl font-bold uppercase tracking-widest text-gray-900">Your bag is empty</h2>
					<p class="mb-8 max-w-xs text-sm text-gray-500">Looks like you haven't added anything to your bag yet.</p>
					<Button href="/" variant="default" class="rounded-full px-8 py-3 text-xs font-bold uppercase tracking-[0.2em]">Start Shopping</Button>
				</div>
			{:else}
				<div class="grid gap-8 lg:grid-cols-[1fr_400px]">
					<!-- Left Column -->
					<div>
						<!-- {#if freeShippingOn && cartState?.cart?.total <= freeShippingOn}
						<div class="mb-5 w-fit rounded-lg bg-gray-100 p-4 py-2 text-sm text-gray-600">
							<p>
								<span>✨🎉 Free Shipping For all Orders Over {formatPrice(freeShippingOn, page?.data?.store?.currency?.code)} 🚚</span>
							</p>
						</div>
					{:else if freeShippingOn && cartState?.cart?.total > freeShippingOn}
						<div class="mb-5 w-fit rounded-lg bg-gray-100 p-4 py-2 text-sm text-gray-600">
							<p>
								<span>🚚 Yay! You get <span class="text-green-400">FREE</span> delivery on this order</span>
							</p>
						</div>
					{/if} -->

					</div>

					<!-- Right Column - Order Summary -->
					<div class="flex flex-col gap-3">
						<!-- coupon applied-->
						{#if cartState.cart.couponCode}
							<div class="flex items-center justify-between px-1 text-sm sm:text-base">
								<p class="font-medium">Coupon Applied</p>
								<div class="flex items-center gap-2 rounded-radius bg-gray-100 p-2 px-3">
									<p class="text-sm font-medium text-gray-600">
										{cartState.cart.couponCode}
									</p>
									<Button variant="ghost" size="icon" class="h-auto w-auto p-1 text-destructive" onclick={() => cartState.removeCoupon()}>
										<X class="size-4" />
									</Button>
								</div>
							</div>
						{/if}

						<CouponsDrawer />



						<!-- <div class="rounded-md bg-gray-100 border p-4">
            <div class="flex items-center text-sm text-gray-600">
              <ShoppingBag class="mr-2 size-4" />
              <span>Your order is secured with 256-bit encryption</span>
            </div>
          </div> -->

						<OrderTrustBadges />

						<!-- <div
            class="bg-gray-100 flex items-start justify-between gap-3 p-4 border rounded-md"
          >
            <div
              class="flex flex-col items-center justify-center gap-2 text-center text-[0.5em] text-zinc-500 uppercase"
            >
              <img
                src="/cart-badge-trust.svg"
                alt="cart badge trust"
                class="h-8 w-8 object-contain object-bottom"
              /> <span>100% secure payments</span>
            </div>
            <div
              class="flex flex-col items-center justify-center gap-2 text-center text-[0.5em] text-zinc-500 uppercase"
            >
              <img
                src="/cart-easy-return.svg"
                alt="cart badge trust"
                class="h-8 w-8 object-contain object-bottom"
              /> <span>Easy return &amp; quick refunds</span>
            </div>
            <div
              class="flex flex-col items-center justify-center gap-2 text-center text-[0.5em] text-zinc-500 uppercase"
            >
              <img
                src="/quality-check.svg"
                alt="cart badge trust"
                class="h-8 w-8 object-contain object-bottom"
              /> <span>Quality assurance</span>
            </div>
          </div> -->
					</div>
				</div>
			{/if}
		{:catch}
			<div class="flex h-96 flex-col items-center justify-center gap-3">
				<p class="text-xl text-gray-400">Your cart is empty</p>
				<Button class="ml-4" href="/" variant="outline" size="sm">Continue Shopping</Button>
			</div>
		{/await}
	</div>
</div>
