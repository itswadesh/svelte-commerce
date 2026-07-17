<script lang="ts">
	import { PaymentModule } from '$lib/core/composables/index.js'
	import Payment from './payment.svelte'
	import Review from './review.svelte'

	const paymentModule = new PaymentModule()

	let showReview = $state(false)
</script>

{#if showReview}
	<Review
		{paymentModule}
		onsubmit={() => paymentModule.placeOrder()}
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
