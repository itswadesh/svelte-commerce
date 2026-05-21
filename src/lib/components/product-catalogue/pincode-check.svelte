<script lang="ts">
	import LoadingDots from '$lib/core/components/common/loading-dots.svelte'
	import { Button } from '$lib/components/ui/button/index.js'
	import { Input } from '$lib/components/ui/input/index.js'
	import { PincodeCheckRenderer, useProductState } from '$lib/core/composables/index.js'

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
				<div class="relative flex gap-3">
					<Input
						type="number"
						bind:value={pincode}
						class="w-full rounded-md border border-gray-300 p-2 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
						placeholder="Enter Pincode"
					/>
					<Button disabled={pincode || 0 > 0 ? false : true} onclick={checkPincode} class="">
						{#if loading}
							<LoadingDots />
						{:else}
							Check
						{/if}
					</Button>
				</div>
			{/if}

			{#if !showPincode}
				<button onclick={toggleShowPincode} class="text-sm hover:underline">
					Check Availability in your area
					<span class="text-primary">🏠 </span>
				</button>
			{/if}
		{/if}

		{#if resultText}
			{#if selectedWarehouse}
				<p class="mt-1 text-sm text-green-500">Available in your area. Ships in {selectedWarehouse.leadTime} business days</p>
			{:else}
				<p class="mt-1 text-sm text-green-500">Sorry, we do not deliver to your area.</p>
			{/if}
		{/if}
	{/snippet}
</PincodeCheckRenderer>
