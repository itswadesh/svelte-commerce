<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js'
	import { ChevronRight } from '@lucide/svelte'
	import LoadingDots from '$lib/core/components/common/loading-dots.svelte'
	import { getContext } from 'svelte'


  const { block } = $props()
  const cartModule = getContext('checkout-cart-module')
  const addressModule = getContext('checkout-address-module')
  const paymentModule = getContext('checkout-payment-module')

  $inspect(cartModule, addressModule, paymentModule)

  function handleClick() {
    if (addressModule)
      addressModule.handleProceedToPayment()
    if (cartModule)
      cartModule.gotoCheckout()
    if (paymentModule)
      paymentModule.placeOrder()
  }

	const text = $derived(block.metadata.text || 'Proceed')
	const disabledText = $derived(block.metadata.disabledText)
	const disabled = $state(cartModule?.loadingForCheckout || paymentModule?.isCheckoutDisabled || addressModule?.disableProceedToPayment)
  const loading = $derived(cartModule?.loadingForCheckout || addressModule?.loadingForCheckout || paymentModule?.paymentLoader)
</script>

<div class="w-full {block.metadata.isFloating ? 'fixed bottom-0 left-0 right-0 z-[60]' : ''}">
	<Button
		class="ease-out-expo group w-full bg-primary py-7 text-sm font-bold tracking-[0.2em] shadow-lg transition-all duration-300 hover:shadow-xl disabled:border disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:opacity-100 disabled:shadow-none {block
			.metadata.isFloating
			? 'h-20 !rounded-none'
			: ''}"
		disabled={loading || disabled}
		onclick={handleClick}
	>
		{#if loading}
			<LoadingDots />
		{:else}
			<div class="flex items-center justify-center gap-2">
				<span>{disabled && disabledText ? disabledText : text}</span>
				{#if !disabled}
					<ChevronRight class="size-4 transition-transform duration-300 group-hover:translate-x-1" />
				{/if}
			</div>
		{/if}
	</Button>
</div>
