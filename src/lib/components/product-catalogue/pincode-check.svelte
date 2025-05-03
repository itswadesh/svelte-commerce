<script lang="ts">
	import LoadingDots from '$lib/core/components/common/loading-dots.svelte'
	import { Button } from '$lib/components/ui/button'
	import { Input } from '$lib/components/ui/input'
	import PincodeCheckRenderer from '$lib/core/composables/pincode-check-renderer.svelte'

	let pincode: number | undefined = $state()
</script>

<PincodeCheckRenderer bind:pincode>
	{#snippet content({ showPincode, loading, resultText, checkPincode, toggleShowPincode })}
		{#if showPincode}
			<div class="relative flex gap-3">
				<Input
					type="number"
					bind:value={pincode}
					oninput={() => {
						if (String(pincode)?.length > 6) {
							pincode = parseInt(String(pincode)?.slice(0, 6) || '')
						}
					}}
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

		{#if resultText}
			<p class="mt-1 text-sm text-green-500">{resultText}</p>{/if}

		{#if !showPincode}
			<button onclick={toggleShowPincode} class="text-sm hover:underline">
				Check Availability in your area
				<span class="text-primary">🏠 </span>
			</button>
		{/if}
	{/snippet}
</PincodeCheckRenderer>
