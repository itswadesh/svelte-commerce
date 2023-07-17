<script>
import { createEventDispatcher } from 'svelte'
import { del } from '$lib/utils/api'
import { Error } from '$lib/components'
import { goto } from '$app/navigation'
import { page } from '$app/stores'
import AddressSkeleton from './_AddressSkeleton.svelte'

const dispatch = createEventDispatcher()

export let address
export let loading
export let selectedAddress

let removing = false
let err

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
				value="{address._id}"
				name="group"
				class="mt-1.5 h-4 w-4 focus:outline-none focus:ring-0 focus:ring-offset-0"
				on:change="{() => addressChanged(address._id)}" />

			<div class="flex w-full cursor-pointer flex-col gap-1 font-light">
				<h6 class="flex-1 capitalize">
					{address.firstName}
					{address.lastName}
				</h6>

				<p>
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
					{#if address.zip}
						- {address.zip}
					{/if}
				</p>

				<p>
					{address.phone}
				</p>

				<p>
					{address.email}
				</p>
			</div>
		</label>

		<div class="ml-6 mt-5 flex items-center gap-5 text-sm sm:ml-8">
			<button
				type="button"
				class="w-full rounded border py-2 px-4 font-semibold tracking-wide text-zinc-800 transition duration-300 focus:outline-none hover:border-zinc-800"
				on:click="{() => goto(`/checkout/add-address?id=${address._id}`)}">
				EDIT
			</button>

			<button
				type="button"
				class="w-full rounded border border-transparent py-2 px-4 font-semibold tracking-wide text-zinc-500 transition duration-300 focus:outline-none hover:text-zinc-800"
				on:click="{() => remove(address._id)}">
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
		</div>
	</div>
{/if}
