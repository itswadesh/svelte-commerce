<script lang="ts">
	import type { PaymentModule } from '@misiki/kitcommerce-core/composables'
	import { getContext } from 'svelte'

	const { block } = $props()

	const paymentModule: InstanceType<typeof PaymentModule> = getContext('checkout-payment-module')
</script>

{#if paymentModule.shippingRates?.error?.message}
	<div class="mb-4 rounded bg-red-50 p-4 text-[11px] font-bold tracking-tight text-red-600 ring-1 ring-red-100">
		We currently deliver only to
		{#each paymentModule.shippingRates?.error?.countriesDeliverable || [] as country, index}
			<span class="font-black">{country}</span>{#if index !== paymentModule.shippingRates?.error?.countriesDeliverable?.length - 1},
				{' '}
			{/if}
		{/each}.

		{#if paymentModule.shippingRates?.error?.moreCountriesCount}
			<span class="font-black"> and {paymentModule.shippingRates.error.moreCountriesCount} more</span>
		{/if} Your selected country is <span class="font-black">"{paymentModule.shippingRates?.error?.selectedCountry}"</span>.
	</div>
{/if}
