<script lang="ts">
	import LoadingDots from '$lib/core/components/common/loading-dots.svelte'
	import { Button } from '$lib/components/ui/button/index.js'
	import { Input } from '$lib/components/ui/input/index.js'
	import { PincodeCheckRenderer, useProductState } from '$lib/core/composables/index.js'
	import { MapPin } from '@lucide/svelte'

	let pincode: number | undefined = $state()
	const productState = useProductState()
</script>

<PincodeCheckRenderer bind:pincode>
	{#snippet content({ showPincode, loading, hasSingleWarehouse, selectedWarehouse, resultText, checkPincode, toggleShowPincode })}
		{#if !productState.warehouseLoaded}
			<div class="flex w-full justify-center">
				<LoadingDots />
			</div>
		{:else if !hasSingleWarehouse}
			{#if showPincode}
				<div class="relative flex gap-2">
					<Input
						type="number"
						bind:value={pincode}
						class="w-full rounded-md border-input bg-background p-2 [appearance:textfield] placeholder:text-muted-foreground/80 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
						placeholder="Enter Pincode"
						aria-label="Enter Pincode"
					/>
					<Button disabled={!(pincode && pincode > 0) || loading} onclick={checkPincode} class="min-w-[80px] shadow-sm transition-all">
						{#if loading}
							<LoadingDots />
						{:else}
							Check
						{/if}
					</Button>
				</div>
			{/if}

			{#if !showPincode}
				<button
					onclick={toggleShowPincode}
					class="group flex min-h-[44px] items-center text-sm font-medium transition-colors hover:text-primary focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
				>
					<span class="mr-2 group-hover:underline">Check Availability in your area</span>
					<MapPin class="size-4 text-primary transition-transform group-hover:scale-110" />
				</button>
			{/if}
		{/if}

		{#if resultText}
			<div aria-live="polite" aria-atomic="true" class="min-h-[20px]">
				{#if selectedWarehouse}
					<p class="mt-1 text-sm font-medium text-green-600 dark:text-green-400">
						Available in your area. Ships in {selectedWarehouse.leadTime} business days
					</p>
				{:else}
					<p class="mt-1 text-sm font-medium text-destructive">Sorry, we do not deliver to your area.</p>
				{/if}
			</div>
		{/if}
	{/snippet}
</PincodeCheckRenderer>
