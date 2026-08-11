<script lang="ts">
	import { PaymentModule } from '$lib/core/composables/index.js'
	import Payment from './payment.svelte'
	import Review from './review.svelte'

	const paymentModule = new PaymentModule()

	let showReview = $state(false)

	// `placeOrder` sets `paymentLoader = true` up front, but its "gateway not ready yet" branches
	// (Razorpay flips `razorpayReady` a second after its script loads; Affirm checks a global) only
	// toast and return — the reset lives in the success path's `finally`. Tapping Confirm Order too
	// early therefore left the button spinning and disabled forever, with no way to place the order
	// short of a full reload. Clearing it here covers every early-return branch at once. On the
	// success path the reset is harmless: the flow has either navigated away or handed off to the
	// gateway's own modal, which is the active UI at that point.
	async function placeOrder() {
		try {
			await paymentModule.placeOrder()
		} finally {
			paymentModule.paymentLoader = false
		}
	}
</script>

{#if showReview}
	<Review
		{paymentModule}
		onsubmit={placeOrder}
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
	/>
{/if}
