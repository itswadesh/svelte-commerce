<script lang="ts">
	import { page } from '$app/state'
	import CheckoutHeader from '$lib/components/checkout/checkout-header.svelte'
	const { block } = $props()

	const step = $derived.by(() => {
		if (page.route.id === '/(www)/checkout/address') return 2
		if (page.route.id === '/(www)/checkout/cart') return 1
		if (page.route.id === '/(www)/checkout/payment') return 3
		return 0
	})
</script>

<CheckoutHeader {step} />
