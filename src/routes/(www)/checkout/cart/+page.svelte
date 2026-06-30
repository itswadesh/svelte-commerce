<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js'
	import { LoaderCircle, ShoppingBag, X } from '@lucide/svelte'
	import { page } from '$app/state'
	import OrderTrustBadges from '$lib/core/components/plugins/order-trust-badges.svelte'
	import CouponsDrawer from '$lib/components/coupon/coupons-drawer.svelte'
	import { CartModule } from '$lib/core/composables/index.js'
	import CheckoutHeader from '$lib/components/checkout/checkout-header.svelte'
	import Blocks from '$lib/components/page-blocks/blocks.svelte'

	const cartModule = new CartModule()
	const cartState = cartModule.cartState
	$inspect(page.data)
</script>

{#await cartState.hasLoaded}
	<div class="flex min-h-96 items-center justify-center py-8">
		<LoaderCircle class="animate-spin" />
	</div>
{:then _}
	{#if cartState.cart?.lineItems?.length === 0}
		<div class="min-h-screen py-8">
			<div class="container mx-auto px-4">
				<div class="flex h-[60vh] flex-col items-center justify-center text-center">
					<div class="mb-6 rounded-full bg-gray-50 p-8 ring-1 ring-gray-100">
						<ShoppingBag class="h-12 w-12 text-gray-300" />
					</div>
					<h2 class="mb-2 text-xl font-bold uppercase tracking-widest text-gray-900">Your bag is empty</h2>
					<p class="mb-8 max-w-xs text-sm text-gray-500">Looks like you haven't added anything to your bag yet.</p>
					<Button href="/" variant="default" class="rounded-full px-8 py-3 text-xs font-bold uppercase tracking-[0.2em]">Start Shopping</Button>
				</div>
			</div>
		</div>
	{:else}
		<Blocks layouts={page.data.page.layouts} />
	{/if}
{/await}

<svelte:head>
	<title>Cart - {page?.data?.store?.name || ''}</title>
</svelte:head>
