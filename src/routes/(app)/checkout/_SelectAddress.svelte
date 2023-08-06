<script>
import { applyAction, enhance } from '$app/forms'
import { CountryService } from '$lib/services'
import { createEventDispatcher, onMount } from 'svelte'
import { del } from '$lib/utils/api'
import { Error } from '$lib/components'
import { goto, invalidateAll } from '$app/navigation'
import { page } from '$app/stores'
import { toast } from '$lib/utils'
import AddressSkeleton from './_AddressSkeleton.svelte'
import Modal from '$lib/components/Modal.svelte'
import SaveAddress from '../my/addresses/_SaveAddress.svelte'

const dispatch = createEventDispatcher()

export let address
export let loading
export let selectedAddress

let countries = []
let editAddress = false
let err = null
let removing = false
let states = []

onMount(async () => {
	countries = await CountryService.fetchCountries({
		origin: $page.data.origin,
		storeId: $page.data.store?.id
	})

	if (countries?.length === 1) {
		address.country = countries[0].code || countries[0].iso_2
	} else if (countries?.length > 1) {
		const dafaultCountry = countries.filter((c) => {
			return c.dafault
		})

		// console.log('dafaultCountry', dafaultCountry)

		if (dafaultCountry[0]) {
			address.country = dafaultCountry[0].code
		}
	}

	if (address?.country) {
		states = await CountryService.fetchStates({
			countryCode: address?.country,
			origin: $page.data.origin,
			storeId: $page.data.store?.id
		})
	}

	if (states?.length === 1) {
		address.state = states[0].code || states[0].iso_2
	}
})

async function remove(id) {
	if (confirm('Are you sure to delete?')) {
		try {
			removing = true
			await del(`addresses/${id}?store=${$page.data.store?.id}`, $page.data.origin)
			await dispatch('deleteAddress', id)
		} catch (e) {
			err = e
		} finally {
			removing = false
		}
	}
}

async function addressChanged(id) {
	dispatch('addressChanged', id)
}
</script>

<Error err="{err}" class="mb-5" />

{#if loading}
	<AddressSkeleton />
{:else if address}
	<div class="border-b p-4 sm:p-6">
		<label class="flex w-full cursor-pointer flex-row gap-2 sm:gap-4">
			<input
				bind:group="{selectedAddress}"
				type="radio"
				value="{address._id || address.id}"
				name="group"
				class="mt-1.5 h-4 w-4 focus:outline-none focus:ring-0 focus:ring-offset-0"
				on:change="{() => addressChanged(address._id || address.id)}" />

			<div class="flex w-full cursor-pointer flex-col gap-1 font-light">
				<h6 class="flex-1 capitalize">
					{address.firstName || address.first_name}
					{address.lastName || address.last_name}
				</h6>

				<p>
					{#if address.address || address.address_1}
						{address.address || address.address_1}
					{/if}
					{#if address.locality || address.address_2}
						, {address.locality || address.address_2}
					{/if}
					{#if address.company}
						, {address.company}
					{/if}
					{#if address.city}
						, {address.city}
					{/if}
					{#if address.state || address.province}
						, {address.state || address.province}
					{/if}
					{#if address.country || address.country_code}
						, {address.country || address.country_code}
					{/if}
					{#if address.zip || address.postal_code}
						- {address.zip || address.postal_code}
					{/if}
				</p>

				{#if address.phone}
					<p>
						{address.phone}
					</p>
				{/if}

				{#if address.email}
					<p>
						{address.email}
					</p>
				{/if}
			</div>
		</label>

		<div class="ml-6 mt-5 flex items-center gap-5 text-sm sm:ml-8">
			<button
				type="button"
				class="w-full rounded border py-2 px-4 font-semibold tracking-wide text-zinc-800 transition duration-300 focus:outline-none hover:border-zinc-800"
				on:click="{() => (editAddress = true)}">
				<!-- on:click="{() => goto(`/checkout/add-address?id=${address._id}`)}" -->
				EDIT
			</button>

			<form
				action="/my/addresses?/deleteAddress"
				method="POST"
				use:enhance="{() => {
					return async ({ result }) => {
						// console.log('result', result)

						if (result?.data) {
							toast('Address deleted', 'success')
							await invalidateAll()
							await applyAction(result)
						}
					}
				}}"
				class="w-full">
				<input type="hidden" name="id" value="{address._id || address.id}" />

				<button
					type="submit"
					class="w-full rounded border border-transparent py-2 px-4 font-semibold tracking-wide text-zinc-500 transition duration-300 focus:outline-none hover:text-zinc-800">
					<!-- on:click="{() => remove(address._id || address.id)}" -->
					{#if removing}
						<div class="flex justify-center">
							<svg
								style="height: 20px; width: 20px"
								class="-ms-1 animate-spin text-zinc-500"
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
			</form>
		</div>
	</div>
{/if}

<Modal
	show="{editAddress}"
	title="Edit Address"
	hideFooter
	on:close="{() => (editAddress = false)}">
	<SaveAddress
		bind:editAddress="{editAddress}"
		address="{address}"
		countries="{countries}"
		states="{states}" />
</Modal>
