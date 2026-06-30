<script lang="ts">
	import CheckoutButton from '$lib/components/buttons/checkout-button.svelte'
	import { CartModule } from '@misiki/kitcommerce-core/composables'

	const { block } = $props()

	const cartModule = new CartModule()
</script>

<CheckoutButton onclick={cartModule.gotoCheckout} loading={cartModule.loadingForCheckout} />
