<script lang="ts">
	import { page } from '$app/state'
	import Input from '$lib/components/ui/input/input.svelte'
	import { addressService } from '$lib/core/services'
	import { InfoIcon, Loader } from 'lucide-svelte'
	import { toast } from 'svelte-sonner'
	import { browser } from '$app/environment'

	let address: any = $state({})

	const countries = [
		{ name: 'India', value: 'ind' },
		{ name: 'United Kingdoms', value: 'uk' },
		{ name: 'Unigted States of America', value: 'usa' }
	]

	let detailsChanged = $state(false)
	let isLoading = $state(false)
	const saveAddress = async () => {
		try {
			if (page.params.id == 'new') {
				address = await addressService.saveAddress(address)
				// console.log(address)
				return
			}
			address = await addressService.editAddress(page.params.id, address)
			// console.log(address)
		} catch (e: any) {
			toast.error(e.message)
		} finally {
			detailsChanged = false
		}
	}
	const handleDetailsChange = () => {
		detailsChanged = true
	}

	const mount = async () => {
		if (browser) {
			document.onkeydown = function (e) {
				e = e || window.event
				if (e.ctrlKey || e.metaKey) {
					// Check for both Ctrl and Command key
					var c = e.which || e.keyCode // Get key code
					switch (c) {
						case 83: // Block Ctrl/Cmd + S
							e.preventDefault()
							e.stopPropagation()
							saveAddress()
							break
					}
				}
			}
		}

		try {
			if (page.params.id == 'new') return
			let res = await addressService.fetchAddress(page.params.id)
			// console.log(res)
			address = res
		} catch (e) {}
	}

	$effect(() => {
		mount()
	})

	// onMount()
</script>

<svelte:head>
	<title>Address Page</title>
</svelte:head>
<div class="flex min-h-screen items-center justify-center">
	<div class="w-full max-w-4xl transform space-y-6 rounded-xl bg-white p-8 shadow-2xl transition-all dark:bg-gray-800">
		<div class="space-y-2 text-center">
			<!-- <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Update Vendor: {address.name}</h1> -->
		</div>
		<form onsubmit={saveAddress} class="w-full space-y-4" oninput={handleDetailsChange}>
			<h2 class="text-2xl font-bold text-gray-900 dark:text-white">Address:</h2>
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div>
					<label for="firstName" class="text-gray-700 dark:text-gray-300"> First Name: </label>
					<Input
						id="firstName"
						name="firstName"
						bind:value={address.firstName}
						placeholder="Enter First Name"
						class="mt-1 block w-full rounded-md px-3 py-2 shadow-sm focus:outline-none sm:text-sm"
					/>
				</div>
				<div>
					<label for="lastName" class="text-gray-700 dark:text-gray-300"> Last Name: </label>
					<Input
						id="lastName"
						name="lastName"
						bind:value={address.lastName}
						placeholder="Enter Last Name"
						class="mt-1 block w-full rounded-md px-3 py-2 shadow-sm focus:outline-none sm:text-sm"
					/>
				</div>
				<div>
					<label for="address1" class="text-gray-700 dark:text-gray-300"> Address 1: </label>
					<Input
						id="address1"
						name="address1"
						bind:value={address.address_1}
						placeholder="Enter Address 1"
						class="mt-1 block w-full rounded-md px-3 py-2 shadow-sm focus:outline-none sm:text-sm"
					/>
				</div>

				<div>
					<label for="address2" class="text-gray-700 dark:text-gray-300"> Address 2: </label>
					<Input
						id="address2"
						name="address2"
						bind:value={address.address_2}
						placeholder="Enter Address 2"
						class="mt-1 block w-full rounded-md px-3 py-2 shadow-sm focus:outline-none sm:text-sm"
					/>
				</div>
				<div>
					<label for="city" class="text-gray-700 dark:text-gray-300">City: </label>
					<Input
						id="city"
						name="city"
						bind:value={address.city}
						placeholder="Enter City"
						class="mt-1 block w-full rounded-md px-3 py-2 shadow-sm focus:outline-none sm:text-sm"
					/>
				</div>
				<div>
					<label for="state" class="text-gray-700 dark:text-gray-300">State/Province: </label>
					<Input
						id="state"
						name="state"
						bind:value={address.state}
						placeholder="Enter State/Province"
						class="mt-1 block w-full rounded-md px-3 py-2 shadow-sm focus:outline-none sm:text-sm"
					/>
				</div>

				<div>
					<label for="zip" class="text-gray-700 dark:text-gray-300">Zip/Postal Code: </label>
					<Input
						id="zip"
						name="zip"
						bind:value={address.zip}
						placeholder="Enter Zip/Postal Code"
						class="mt-1 block w-full rounded-md px-3 py-2 shadow-sm focus:outline-none sm:text-sm"
					/>
				</div>
				<div>
					<label for="country" class="text-gray-700 dark:text-gray-300">Country: </label>
					<!-- <Input
						id="country"
						name="country"
						bind:value={address.country}
						placeholder="Enter Country"
						class="mt-1 block w-full rounded-md px-3 py-2 shadow-sm focus:outline-none sm:text-sm"
					/> -->
					<!-- <Select
						id="country"
						title="Select Country"
						errors={null}
						label=""
						value={address.country}
						data={countries || []}
						optionSelected={(v: any) => {
							address.country = v
							handleDetailsChange()
						}}
					/> -->
					<select
						bind:value={address.country}
						id="country"
						class="mt-1 block h-10 w-full rounded-md bg-background px-3 py-2 shadow-sm focus:outline-none sm:text-sm"
					>
						{#each countries as country}
							<option value={country.value}>{country.name}</option>
						{/each}
					</select>
				</div>
			</div>
			<h2 class="text-2xl font-bold text-gray-900 dark:text-white">Contact Details:</h2>
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div>
					<label for="phone" class="text-gray-700 dark:text-gray-300">Business phone:</label>
					<Input
						id="phone"
						type="phone"
						name="phone"
						bind:value={address.phone}
						placeholder="Enter Business Phone"
						required
						class="mt-1 block w-full rounded-md px-3 py-2 shadow-sm focus:outline-none sm:text-sm"
					/>
				</div>

				<div>
					<label for="email" class="text-gray-700 dark:text-gray-300">Business email:</label>
					<Input
						id="email"
						type="email"
						name="email"
						bind:value={address.email}
						placeholder="Enter Business Email"
						required
						class="mt-1 block w-full rounded-md px-3 py-2 shadow-sm focus:outline-none sm:text-sm"
					/>
				</div>
			</div>
			<h2 class="text-2xl font-bold text-gray-900 dark:text-white">Location Details:</h2>
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div>
					<label for="lat" class="text-gray-700 dark:text-gray-300">Latitude:</label>
					<Input
						id="lat"
						type="number"
						name="lat"
						bind:value={address.lat}
						placeholder="Enter Latitude"
						required
						class="mt-1 block w-full rounded-md px-3 py-2 shadow-sm focus:outline-none sm:text-sm"
					/>
				</div>
				<div>
					<label for="lng" class="text-gray-700 dark:text-gray-300">Longitude:</label>
					<Input
						id="lng"
						type="number"
						name="lng"
						bind:value={address.lng}
						placeholder="Enter Longitude"
						required
						class="mt-1 block w-full rounded-md px-3 py-2 shadow-sm focus:outline-none sm:text-sm"
					/>
				</div>
			</div>
			<h2 class="text-2xl font-bold text-gray-900 dark:text-white">Additional Details:</h2>
			<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
				<div>
					<label for="isPrimary" class="text-gray-700 dark:text-gray-300">Is Default Location:</label>
					<input
						id="isPrimary"
						type="checkbox"
						name="isPrimary"
						bind:checked={address.isPrimary}
						placeholder="Is Deafult Location"
						required
						class="mt-1 block h-[20px] w-[20px] rounded-md px-3 py-2 shadow-sm focus:outline-none sm:text-sm"
					/>
				</div>
				<div>
					<label for="isResiddential" class="text-gray-700 dark:text-gray-300">Is Resident:</label>
					<input
						id="isResiddential"
						type="checkbox"
						name="isResiddential"
						bind:checked={address.isResiddential}
						placeholder="Is Resident:"
						required
						class="mt-1 block h-[20px] w-[20px] rounded-md px-3 py-2 shadow-sm focus:outline-none sm:text-sm"
					/>
				</div>
				<div class="md:col-span-3">
					<label for="deliveryInstructions" class="text-gray-700 dark:text-gray-300">Delivery Instructions:</label>
					<textarea
						id="deliveryInstructions"
						name="deliveryInstructions"
						bind:value={address.deliveryInstructions}
						placeholder="Instructions for Delivery"
						required
						class="mt-1 block w-full rounded-md px-3 py-2 shadow-sm focus:outline-none sm:text-sm"
					></textarea>
				</div>
				<div>
					<label for="locality" class="text-gray-700 dark:text-gray-300">Locality:</label>
					<Input
						id="locality"
						name="locality"
						bind:value={address.locality}
						placeholder="Enter Locality"
						required
						class="mt-1 block w-full rounded-md px-3 py-2 shadow-sm focus:outline-none sm:text-sm"
					/>
				</div>
			</div>
		</form>
	</div>
</div>

<div
	class="ease-[cubic-bezier(1,.32,.52,.67)] fixed left-0 right-0 top-10 z-50 mx-auto flex w-1/2 max-w-[1000px] flex-row justify-between rounded-lg border border-gray-300 bg-gray-50 p-2 text-xs font-semibold text-black shadow transition-all duration-150 hover:bg-gray-100"
	style={detailsChanged ? 'display: flex' : 'display: none'}
>
	<div class="flex flex-row items-center gap-2">
		<InfoIcon class="h-4 w-4" />
		<span>Unsaved changes</span>
	</div>

	<button onclick={saveAddress} class="rounded bg-white px-2 py-1 text-xs text-black shadow">
		{#if isLoading}
			<Loader class="h-4 w-4 animate-spin" />
		{:else}
			Save
		{/if}
	</button>
</div>
