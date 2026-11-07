<script lang="ts">
	import { PaymentModule } from '$lib/core/composables/index.js'
	import { LiveQuote } from '$lib/checkout/quote.svelte'
	import Payment from './payment.svelte'
	import Review from './review.svelte'
	import { goto } from '$app/navigation'
	import { checkoutService } from '$lib/core/services'
	import { coveredByGiftCard } from '$lib/utils/price'
	import { toast } from 'svelte-sonner'

	const paymentModule = new PaymentModule()
	const quote = new LiveQuote(paymentModule)

	let showReview = $state(false)

	// `placeOrder` sets `paymentLoader = true` up front, but its "gateway not ready yet" branches
	// (Razorpay flips `razorpayReady` a second after its script loads; Affirm checks a global) only
	// toast and return — the reset lives in the success path's `finally`. Tapping Confirm Order too
	// early therefore left the button spinning and disabled forever, with no way to place the order
	// short of a full reload. Clearing it here covers every early-return branch at once. On the
	// success path the reset is harmless: the flow has either navigated away or handed off to the
	// gateway's own modal, which is the active UI at that point.
	async function placeOrder() {
		quote.expectShownTotal(paymentModule.cartState.cart?.id)
		try {
			if (coveredByGiftCard(quote.current)) return await placeCovered()
			await paymentModule.placeOrder()
		} finally {
			paymentModule.paymentLoader = false
		}
	}

	/**
	 * A gift card that pays for everything (D250). The engine marks the order paid with no gateway
	 * step, whichever switched-on method it is placed under, so it goes under the one the total was
	 * quoted for, or else one that adds no charge: a method's fee would move the total off zero.
	 */
	async function placeCovered() {
		const cartId = paymentModule.cartState.cart?.id
		const methods: { code: string; engineCode?: string; fee?: number }[] = paymentModule.allPaymentMethods ?? []
		const method = methods.find((m) => m.code === quote.method) ?? methods.find((m) => !(Number(m.fee) > 0)) ?? methods[0]
		const svc = checkoutService as unknown as { checkout: (code: string, args: { cartId?: string }) => Promise<{ orderNo: string }> }
		paymentModule.paymentLoader = true
		try {
			const placed = await svc.checkout(method?.engineCode || method?.code || 'cod', { cartId })
			await goto(`/checkout/success?order_no=${encodeURIComponent(placed.orderNo)}&cart_id=${encodeURIComponent(cartId ?? '')}`)
		} catch (err) {
			toast.error((err as Error)?.message || 'Your order could not be placed. Please try again.')
		}
	}
</script>

{#if showReview}
	<Review
		{paymentModule}
		{quote}
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
		{quote}
	/>
{/if}
