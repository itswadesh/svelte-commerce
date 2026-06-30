<script lang="ts">
	import type { PaymentModule } from '@misiki/kitcommerce-core/composables'
	import { getContext } from 'svelte'

  const { block } = $props()

	const paymentModule: InstanceType<typeof PaymentModule> = getContext('checkout-payment-module')
</script>

<div class="h-fit space-y-6">
	<h2 class="text-base font-bold uppercase text-gray-900">Select Payment Method</h2>
	{#if paymentModule.showError}
		<div class="rounded bg-destructive p-3 text-[11px] font-bold uppercase tracking-tight text-destructive-foreground ring-1 ring-red-100">
			{paymentModule.errorMessage}
		</div>
	{/if}

	{#if paymentModule.showPaymentMethods}
		<div class="grid grid-cols-1 gap-4">
			{#each paymentModule.listOfPaymentMethods as method}
				<label
					class="relative flex cursor-pointer items-center justify-between rounded-lg border bg-background px-6 py-5 {paymentModule.selectedPGCode ==
						method?.code && paymentModule.listOfPaymentMethods?.length !== 1
						? 'border-primary ring-1 ring-primary'
						: 'border-border shadow-sm'}"
				>
					<div class="flex items-center gap-4">
						<div class="relative flex h-5 w-5 items-center justify-center">
							<input
								type="radio"
								name="paymentMethod"
								value={method?.code}
								checked={paymentModule.SELECTED_PG_CODE === method?.code}
								onchange={() => (paymentModule.SELECTED_PG_CODE = method?.code)}
								class="peer h-5 w-5 appearance-none rounded-full border-2 border-gray-200 transition-all checked:border-primary"
							/>
							<div class="absolute h-2.5 w-2.5 rounded-full bg-primary opacity-0 transition-opacity peer-checked:opacity-100"></div>
						</div>

						<div class="flex items-center gap-3">
							{#if method?.img}
								<div class="flex h-10 w-12 items-center justify-center rounded border border-border bg-white p-1 shadow-sm">
									<img src={method.img} alt={method?.name} class="h-full w-full object-contain" />
								</div>
							{/if}
							<div class="flex flex-col">
								<span class="text-sm font-bold uppercase tracking-tight text-gray-900">{method?.name}</span>
								{#if method?.description}
									<span class="text-[10px] font-medium uppercase tracking-tighter text-gray-400">{@html method?.description}</span>
								{/if}
							</div>
						</div>
					</div>

					{#if method?.badges?.length}
						<div class="flex gap-2">
							{#each method.badges as badge}
								<span class="rounded bg-gray-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-gray-400 ring-1 ring-gray-100">
									{badge}
								</span>
							{/each}
						</div>
					{/if}
				</label>
			{/each}
		</div>
	{/if}
</div>
