<script>
import { browser } from '$app/environment'
import { Error } from '$lib/components'
import { goto } from '$app/navigation'
import { onMount } from 'svelte'

let alreadyHavePinCode = false
let disabled = false
let err = null
let loading = false
let locationPinCodesList = [
	{ area: 'Semiliguda', pinCode: '764036' },
	{ area: 'Sunabeda', pinCode: '763002' }
]
let pinCode = null

onMount(() => {
	const pin = localStorage.getItem('pinCode')
	// console.log('pin', pin)
	if (pin && pin.length === 6) {
		alreadyHavePinCode = true
		disabled = true
		pinCode = pin
	}
})

function changePinCode() {
	alreadyHavePinCode = false
	disabled = false
	pinCode = null
}

function handlePinCode() {
	err = null

	if (pinCode && pinCode.toString().length !== 6) {
		err = 'Wrong Pin Code'
		return
	} else {
		disabled = true

		if (browser) {
			localStorage.setItem('pinCode', JSON.stringify(pinCode))
		}

		goto(`/search?zip=${pinCode}`)
	}
}
</script>

{#if !alreadyHavePinCode}
	<div
		class="fixed z-[100] inset-0 h-screen w-screen flex items-center justify-center p-5 sm:p-10 bg-black bg-opacity-50">
		<div class="bg-white shadow rounded-3xl">
			<h2 class="p-5 font-semibold">Enter Your Pin Code</h2>

			<hr />

			<div class="p-5 flex flex-col gap-5">
				<Error bind:err="{err}" />

				<form
					on:submit|preventDefault="{handlePinCode}"
					class="relative w-full sm:w-96 overflow-hidden rounded border
        			{disabled ? 'border-zinc-200' : ''}
					{pinCode && pinCode.toString().length === 6 ? 'border-primary-500' : 'border-zinc-200'}">
					<input
						type="number"
						name="zip"
						bind:value="{pinCode}"
						maxlength="6"
						placeholder="Enter your 6 digit pin code..."
						disabled="{disabled}"
						required
						class="w-full rounded disabled:bg-zinc-100 disabled:text-zinc-400 bg-transparent py-3 px-4 pr-24 text-sm font-semibold truncate placeholder:font-normal focus:outline-none" />

					{#if !alreadyHavePinCode}
						<button
							type="submit"
							class="absolute inset-y-0 right-0 z-10 flex w-20 items-center justify-center text-right text-sm font-bold
				        	{pinCode && pinCode.toString().length === 6 ? 'text-primary-500' : 'text-zinc-200'}">
							{#if loading}
								<div
									class="absolute inset-0 flex cursor-not-allowed items-center justify-center bg-black bg-opacity-70">
									<svg
										class="mx-auto h-4 w-4 animate-spin text-white"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24">
										<circle
											class="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											stroke-width="4"></circle>
										<path
											class="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										></path>
									</svg>
								</div>
							{/if}

							<span> Check </span>
						</button>
					{:else}
						<button
							type="button"
							class="absolute inset-y-0 right-0 z-10 flex w-20 text-primary-500 items-center justify-center text-right text-sm font-bold"
							on:click="{changePinCode}">
							{#if loading}
								<div
									class="absolute inset-0 flex cursor-not-allowed items-center justify-center bg-black bg-opacity-70">
									<svg
										class="mx-auto h-4 w-4 animate-spin text-white"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24">
										<circle
											class="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											stroke-width="4"></circle>
										<path
											class="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										></path>
									</svg>
								</div>
							{/if}

							<span> Change </span>
						</button>
					{/if}
				</form>

				{#if locationPinCodesList?.length}
					<div class="flex flex-col gap-3">
						<h3 class="text-sm text-zinc-500">Suggested Area</h3>

						<ul class="m-0 p-0 list-none flex flex-wrap gap-1">
							{#each locationPinCodesList as lp}
								<li>
									<a
										href="/search?zip={lp.pinCode}"
										class="bg-zinc-200 rounded py-1 px-2 text-xs text-zinc-500 font-semibold hover:bg-zinc-300 hover:text-zinc-800 transition duration-300 focus:outline-none">
										{lp.area}
									</a>
								</li>
							{/each}
						</ul>
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}
