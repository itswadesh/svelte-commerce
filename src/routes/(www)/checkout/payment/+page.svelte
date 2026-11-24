<script lang="ts">
	import { PaymentModule } from '$lib/core/composables/index.js'
	import { LiveQuote } from '$lib/checkout/quote.svelte'
	import Payment from './payment.svelte'
	import Review from './review.svelte'
	import { offerStoreMethods, placeOrder } from '$lib/checkout/place-order'
	import { Button } from '$lib/components/ui/button/index.js'

	const paymentModule = new PaymentModule()
	const quote = new LiveQuote(paymentModule)

	let showReview = $state(false)

	$effect(() => offerStoreMethods(paymentModule))

	// The module's cart type is loose; this asks only what the empty state needs.
	const bag = $derived(paymentModule.cartState as { cart?: { lineItems?: unknown[] } | null; isUpdatingCart?: boolean } | undefined)
	const bagIsEmpty = $derived(Array.isArray(bag?.cart?.lineItems) && bag.cart.lineItems.length === 0 && !bag?.isUpdatingCart)
</script>

<!-- An empty bag, as on the address step. Back from the success page, or a payment link opened
     later, used to land here on "Select payment method" with a ₹0 total and nothing to say the order
     had gone through or the bag was empty. -->
{#if bagIsEmpty}
	<div class="page-width flex h-96 flex-col items-center justify-center gap-3 text-center">
		<p class="text-xl text-muted-foreground">Your bag is empty</p>
		<div class="flex flex-wrap justify-center gap-3">
			<Button href="/">Continue shopping</Button>
			<Button variant="outline" href="/order-tracking">Track an order</Button>
		</div>
	</div>
{:else if showReview}
	<Review
		{paymentModule}
		{quote}
		onsubmit={() => placeOrder(paymentModule, quote)}
		onback={() => {
			showReview = false
			window.scrollTo({ top: 0 })
		}}
	/>
{:else}
	<Payment
		onreview={() => {
			showReview = true
			window.scrollTo({ top: 0 })
		}}
		{paymentModule}
		{quote}
	/>
{/if}
