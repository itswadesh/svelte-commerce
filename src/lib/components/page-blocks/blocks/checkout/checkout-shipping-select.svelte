<script lang="ts">
	import { page } from '$app/state'
	import { formatPrice } from '$lib/core/utils/index.js'
	import type { PaymentModule } from '@misiki/kitcommerce-core/composables'
	import { getCartState } from '@misiki/kitcommerce-core/stores'
	import { getContext } from 'svelte'

	const { block } = $props()

	const paymentModule: InstanceType<typeof PaymentModule> = getContext('checkout-payment-module')
  const cartState = getCartState()
</script>

{#if paymentModule.shippingRates?.data?.length}
	<div class="grid h-fit grid-cols-1 space-y-6">
		<h2 class="text-base font-bold uppercase text-gray-900" style="font-family: 'Montserrat', sans-serif;">Select Shipping Method</h2>

		<div class="flex flex-col gap-3">
			{#each paymentModule.shippingRates?.data as rate}
				<label
					for={rate.id}
					class="flex items-center justify-between rounded-lg border bg-white p-5 transition-all duration-300 active:scale-[0.99] {cartState?.cart
						?.shippingRateId === rate.id
						? ''
						: 'shadow-sm'}"
				>
					<div class="flex items-center gap-4">
						<div class="relative flex h-5 w-5 items-center justify-center">
							<input
								type="radio"
								name="shippingRate"
								id={rate.id}
								checked={cartState?.cart?.shippingRateId === rate.id}
								onchange={() => paymentModule.handleShippingRateChange(rate)}
								class="peer h-5 w-5 appearance-none rounded-full border-2 border-border transition-all checked:border-primary"
							/>
							<div class="absolute h-2.5 w-2.5 rounded-full bg-primary opacity-0 transition-opacity peer-checked:opacity-100"></div>
						</div>

						<div class="flex flex-col gap-0.5">
							<span class="text-sm font-bold uppercase tracking-tight text-gray-900">
								{rate.name}
							</span>
							<div class="flex items-center gap-2">
								{#if !Number.isNaN(Number.parseFloat(rate?.estimated_min_days)) && !Number.isNaN(Number.parseFloat(rate?.estimated_max_days))}
									<span class="text-[10px] font-bold uppercase tracking-tighter text-primary">
										{rate?.estimated_min_days} - {rate?.estimated_max_days} Days
									</span>
									<span class="h-1 w-1 rounded-full bg-gray-200"></span>
								{/if}
								<span class="text-[10px] font-medium uppercase tracking-tighter text-gray-400">{rate.description}</span>
							</div>
						</div>
					</div>
					<div class="text-right">
						<span class="text-sm font-bold text-gray-900">
							{rate.base_rate > 0 ? formatPrice(rate.base_rate, page?.data?.store?.currency?.code) : 'FREE'}
						</span>
					</div>
				</label>
			{/each}
		</div>
	</div>
{/if}
