<script>
import { fetchCountries } from '$lib/services/Litekart'
import { onMount } from 'svelte'
import { page } from '$app/stores'
import indiaFlag from '$lib/assets/flags/india.png'

let allCountries = []
let isEmail = false
let isPhone = false
let loadingCountries = false
let maxlength = null
let selectedCountry = allCountries[0]
let showDropDown = false
let value = null

onMount(async () => {
	await getCountries()
})

const getCountries = async () => {
	try {
		loadingCountries = true

		allCountries = await fetchCountries({
			storeId: $page?.data?.store?.id,
			origin: $page?.data?.origin
		})

		console.log('zzzzzzzzzzzzzzzzzz', allCountries)
	} catch (e) {
		// toast(e, 'error')
	} finally {
		loadingCountries = false
	}
}

const verifyIsMobileNum = () => {
	if (value) {
		if (value[0] === '+') {
			isEmail = false
			isPhone = true
			maxlength = 13
		} else if (parseFloat(value) == value) {
			isEmail = false
			isPhone = true
			maxlength = 13
		} else {
			isEmail = true
			isPhone = false
			maxlength = null
		}
	} else {
		isEmail = false
		isPhone = false
		maxlength = null
	}

	// console.log('isPhone, isEmail', isPhone, isEmail)
}
</script>

<label>
	<h6 class="mb-2">
		{#if isPhone}
			Mobile number
		{:else if isEmail}
			Email address
		{:else}
			Email or mobile number
		{/if}
	</h6>

	<div class="relative w-full bg-white rounded-md ">
		<input
			type="text"
			bind:value="{value}"
			maxlength="{maxlength}"
			class="py-3 w-full rounded-md border border-transparent focus:border-primary-500 focus:outline-none
			{isPhone ? 'pl-6 pr-32' : 'px-6'}"
			on:input="{verifyIsMobileNum}" />

		{#if isPhone && selectedCountry}
			<div class="absolute right-0 inset-y-0">
				<button
					type="button"
					class="h-full relative max-w-max px-4 flex items-center justify-center gap-2 text-sm whitespace-nowrap rounded-md border border-transparent focus:border-primary-500 focus:outline-none"
					on:click="{() => (showDropDown = !showDropDown)}">
					<img src="{indiaFlag}" alt="" class="h-8 w-8 object-contain object-center" />

					<span> {selectedCountry?.dialCode} </span>

					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="currentColor"
						class="w-5 h-5 transform transition duration-300"
						class:-rotate-180="{showDropDown}">
						<path
							fill-rule="evenodd"
							d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z"
							clip-rule="evenodd"></path>
					</svg>
				</button>
			</div>

			{#if showDropDown}
				<ul
					class="absolute z-10 top-14 inset-x-0 h-60 p-2 overflow-y-auto bg-white scrollbar-thin rounded-md">
					{#each allCountries as country}
						<li>
							<button
								class="w-full p-2 flex items-center gap-4 whitespace-nowrap hover:bg-gray-100 transition duration-300 rounded-md focus:outline-none"
								on:click="{() => {
									;(selectedCountry = country), (showDropDown = false)
								}}">
								<img src="{indiaFlag}" alt="" class="h-8 w-8 object-contain object-center" />

								<span> {country.name} ({country.dialCode}) </span>
							</button>
						</li>
					{/each}
				</ul>

				<button
					type="button"
					class="fixed inset-0 h-full w-screen bg-black bg-opacity-0 cursor-default focus:outline-none"
					on:click="{() => (showDropDown = false)}">
				</button>
			{/if}
		{/if}
	</div>
</label>
