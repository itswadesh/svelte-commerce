<script>
import { browser } from '$app/environment'
import { Error } from '$lib/components'
import { fade } from 'svelte/transition'
import { createEventDispatcher, onMount } from 'svelte'
import Cookie from 'cookie-universal'

const cookies = Cookie()
const dispatch = createEventDispatcher()

let alreadyHavePinCode = false
let disabled = false
let err = null
let loading = false
let locationPinCodesList = [
	{ area: 'Semiliguda', pincode: 764036 },
	{ area: 'Sunabeda', pincode: 763002 }
]
let pincode = null

onMount(() => {
	const pin = cookies.get('zip')

	// console.log('pin', pin, pin.toString()?.length)

	if (pin && pin.toString()?.length === 6) {
		alreadyHavePinCode = true
		disabled = true
		pincode = pin
	}
})

function changePinCode() {
	alreadyHavePinCode = false
	disabled = false
	pincode = null
}

function handlePinCode(pincodeNew) {
	err = null

	if (pincodeNew && pincodeNew.toString().length !== 6) {
		err = 'Wrong Pin Code'
		return
	} else {
		disabled = true

		if (browser) {
			cookies.set('zip', JSON.stringify(pincodeNew), { path: '/' })
		}

		dispatch('close')
	}
}
</script>

<div
	transition:fade="{{ duration: 300 }}"
	class="fixed z-[100] inset-0 h-screen w-screen flex items-center justify-center p-5 sm:p-10 bg-black bg-opacity-50">
	<div class="relative bg-white shadow rounded-3xl">
		<button
			type="button"
			class="absolute -top-6 -right-6 z-10 text-white transform hover:scale-110 transition duration-300 focus:outline-noen"
			on:click="{() => dispatch('close')}">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="2"
				stroke="currentColor"
				class="w-8 h-8">
				<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
			</svg>
		</button>

		<h2 class="p-5 font-semibold">Enter Your Pin Code</h2>

		<hr />

		<div class="p-5 flex flex-col gap-5">
			<Error bind:err="{err}" />

			<form
				on:submit|preventDefault="{() => handlePinCode(pincode)}"
				class="relative w-full sm:w-96 overflow-hidden rounded border
        		{disabled ? 'border-zinc-200' : ''}
				{pincode && pincode.toString().length === 6 ? 'border-primary-500' : 'border-zinc-200'}">
				<input
					type="number"
					name="zip"
					bind:value="{pincode}"
					maxlength="6"
					placeholder="Enter your 6 digit pin code..."
					disabled="{disabled}"
					required
					class="w-full rounded disabled:bg-zinc-100 disabled:text-zinc-400 bg-transparent py-3 px-4 pr-24 text-sm font-semibold truncate placeholder:font-normal focus:outline-none" />

				{#if !alreadyHavePinCode}
					<button
						type="submit"
						class="absolute inset-y-0 right-0 z-10 flex w-20 items-center justify-center text-right text-sm font-bold
				        	{pincode && pincode.toString().length === 6 ? 'text-primary-500' : 'text-zinc-200'}">
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

						<span> Save </span>
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
						{#each locationPinCodesList as lp, ix}
							<li>
								<button
									type="button"
									class="bg-zinc-200 rounded py-1 px-2 text-xs text-zinc-500 font-semibold hover:bg-zinc-300 hover:text-zinc-800 transition duration-300 focus:outline-none"
									on:click="{() => handlePinCode(lp.pincode)}">
									{lp.area}
								</button>
							</li>
						{/each}
					</ul>
				</div>
			{/if}
		</div>
	</div>
</div>
