<script>
import { goto } from '$app/navigation'
import { GQL_deleteAddress, GQL_myAddresses } from '$houdini'
import AddressSkeleton from './_AddressSkeleton.svelte'
import { createEventDispatcher } from 'svelte'

const dispatch = createEventDispatcher()

export let address, selectedAddress, loading

let removing = false,
	err

function edit(id) {
	goto(`/checkout/add-address?id=${id}`)
}

async function remove(id) {
	if (confirm('Are you sure to delete?')) {
		try {
			removing = true
			await GQL_deleteAddress.mutate({
				variables: {
					id: id
				}
			})
			await getAddress()
		} catch (e) {
			err = e
		} finally {
			removing = false
		}
	}
}

async function getAddress() {
	dispatch('deleteAddress')
}

async function addressChanged(id) {
	dispatch('addressChanged', id)
}
</script>

{#if loading}
	<AddressSkeleton />
{:else if address}
	<div class="border-b p-4 sm:p-6">
		<label class="flex w-full cursor-pointer flex-row gap-2 sm:gap-4">
			<input
				bind:group="{selectedAddress}"
				type="radio"
				value="{address.id}"
				name="group"
				class="mt-1.5 h-4 w-4 focus:outline-none focus:ring-0 focus:ring-offset-0"
				on:change="{() => addressChanged(address.id)}" />

			<div class="flex w-full cursor-pointer flex-col gap-2 font-light text-gray-800">
				<h5 class="flex-1 font-semibold capitalize tracking-wide md:text-lg">
					{address.firstName}
					{address.lastName}
				</h5>

				<div class="flex flex-wrap items-start text-sm md:flex-nowrap">
					<h5 class="w-20 font-semibold">Address</h5>

					<p class="flex flex-1 flex-wrap items-center">
						{#if address.address}
							{address.address}
						{/if}
						{#if address.locality}
							, {address.locality}
						{/if}
						{#if address.city}
							, {address.city}
						{/if}
						{#if address.state}
							, {address.state}
						{/if}
						{#if address.country}
							, {address.country}
						{/if}
					</p>
				</div>

				<div class="flex flex-wrap items-start text-sm md:flex-nowrap">
					<h5 class="w-20 font-semibold">Pin Code</h5>

					<p class="flex flex-1 flex-col">
						{address.zip}
					</p>
				</div>

				<div class="flex flex-wrap items-start text-sm md:flex-nowrap">
					<h5 class="w-20 font-semibold">Phone</h5>

					<p class="flex flex-1 flex-col">
						{address.phone}
					</p>
				</div>

				<div class="flex flex-wrap items-start text-sm md:flex-nowrap">
					<h5 class="w-20 font-semibold">Email</h5>

					<p class="flex flex-1 flex-col">
						{address.email}
					</p>
				</div>
			</div>
		</label>

		<div class="ml-6 mt-5 flex items-center gap-5 text-sm sm:ml-8">
			<button
				type="button"
				class="w-full rounded-md border border-primary-500 py-2 px-4 font-semibold tracking-wide text-primary-500 shadow-md transition duration-300 hover:bg-primary-500 hover:text-white focus:outline-none"
				on:click="{() => edit(address.id)}">
				EDIT
			</button>

			<button
				type="button"
				class="w-full rounded-md border border-transparent bg-transparent py-2 px-4 font-semibold tracking-wide text-gray-500 transition duration-300 hover:border-gray-500 hover:bg-gray-500 hover:text-white hover:shadow-md focus:outline-none"
				on:click="{() => remove(address.id)}">
				{#if removing}
					<div class="flex justify-center">
						<svg
							style="height: 20px; width: 20px"
							class="animate-spin text-gray-500 -ms-1"
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
				{:else}
					<span>REMOVE</span>
				{/if}
			</button>
		</div>
	</div>
{/if}
