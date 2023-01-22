<script>
import { createEventDispatcher, onMount } from 'svelte'
import {  post } from '$lib/utils/api'
import { goto } from '$app/navigation'
import { page } from '$app/stores'
import { toast } from '$lib/utils'
import CtrlS from '$lib/components/CtrlS.svelte'
import Error from '$lib/components/Error.svelte'
import PrimaryButton from '$lib/ui/PrimaryButton.svelte'
import Textarea from '$lib/ui/Textarea.svelte'
import Textbox from '$lib/ui/Textbox.svelte'

const dispatch = createEventDispatcher()

let err = null
let formChanged = false
let loading = false

export let address = {}
export let countries = false
export let states = false

async function SaveAddress(address) {
	try {
		let id = address._id || address.id || 'new'
		loading = true
		const { firstName, lastName, email, phone, locality, city, state, country, zip } = address
		toast('Saving Address Info...', 'info')
		const newAddress = await post(
			'addresses',
			{
				id,
				firstName,
				lastName,
				email,
				phone,
				address: address.address,
				locality,
				city,
				state,
				country,
				zip,
				store: $page.data.store?.id
			},
			$page.data.origin
		)

		toast('Address Info Saved.', 'success')
		dispatch('saved')
		if (id === 'new') goto(`/my/addresses/${newAddress._id}`)
	} catch (e) {
		err = e
		toast(e, 'error')
	} finally {
		loading = false
		formChanged = false
	}
}

async function onCountryChange(country) {
	// 	formChanged = true
}
</script>

<div>
	<Error err="{err}" />

	<form on:submit|preventDefault="{() => SaveAddress(address)}">
		<div class="mb-5 flex flex-col gap-2 lg:mb-10">
			<div class="flex flex-wrap">
				<h6 class="mb-1 mr-5 w-52 flex-shrink-0 font-medium">First Name</h6>

				<div class="mb-2 w-full max-w-md">
					<Textbox type="text" placeholder="Enter First Name" bind:value="{address.firstName}" />
				</div>
			</div>

			<div class="flex flex-wrap">
				<h6 class="mb-1 mr-5 w-52 flex-shrink-0 font-medium">Last Name</h6>

				<div class="mb-2 w-full max-w-md">
					<Textbox placeholder="Enter Last Name" bind:value="{address.lastName}" />
				</div>
			</div>

			<div class="flex flex-wrap">
				<h6 class="mb-1 mr-5 w-52 flex-shrink-0 font-medium">Email</h6>

				<div class="mb-2 w-full max-w-md">
					<Textbox type="text" placeholder="Enter Email" bind:value="{address.email}" />
				</div>
			</div>

			<div class="flex flex-wrap">
				<h6 class="mb-1 mr-5 w-52 flex-shrink-0 font-medium">Phone</h6>

				<div class="mb-2 w-full max-w-md">
					<Textbox type="text" placeholder="Enter Phone" bind:value="{address.phone}" />
				</div>
			</div>

			<div class="flex flex-wrap">
				<h6 class="mb-1 mr-5 w-52 flex-shrink-0 font-medium">Address</h6>

				<div class="mb-2 w-full max-w-md">
					<Textarea placeholder="Enter Address" bind:value="{address.address}" />
				</div>
			</div>

			<div class="flex flex-wrap">
				<h6 class="mb-1 mr-5 w-52 flex-shrink-0 font-medium">Locality</h6>

				<div class="mb-2 w-full max-w-md">
					<Textbox placeholder="Enter Locality" bind:value="{address.locality}" />
				</div>
			</div>

			<div class="flex flex-wrap">
				<h6 class="mb-1 mr-5 w-52 flex-shrink-0 font-medium">City</h6>

				<div class="mb-2 w-full max-w-md">
					<Textbox placeholder="Enter City" bind:value="{address.city}" />
				</div>
			</div>

			{#if states?.count}
				<div class="flex flex-wrap">
					<h6 class="mb-1 mr-5 w-52 flex-shrink-0 font-medium">State</h6>

					<div class="mb-2 w-full max-w-md">
						<select
							class="w-full rounded-md border border-gray-300 bg-white p-2 text-sm placeholder-gray-400  transition duration-300 placeholder:font-normal focus:outline-none focus:ring-1 focus:ring-primary-500 hover:bg-gray-50"
							bind:value="{address.state}">
							<option value="" selected>-- Select a State --</option>
							{#each states?.data as c}
								{#if c}
									<option value="{c.name}">
										{c.name}
									</option>
								{/if}
							{/each}
						</select>
					</div>
				</div>
			{/if}

			<div class="flex flex-wrap">
				<h6 class="mb-1 mr-5 w-52 flex-shrink-0 font-medium">Country</h6>

				<div class="mb-2 w-full max-w-md">
					<select
						disabled
						class="w-full rounded-md border border-gray-300 bg-white p-2 text-sm placeholder-gray-400  transition duration-300 placeholder:font-normal focus:outline-none focus:ring-1 focus:ring-primary-500 hover:bg-gray-50"
						bind:value="{address.country}"
						on:change="{() => onCountryChange(address.country)}">
						{#if countries?.data?.length}
							{#each countries.data as c}
								{#if c}
									<option value="{c.code}">
										{c.name}
									</option>
								{/if}
							{/each}
						{/if}
					</select>
				</div>
			</div>

			<div class="flex flex-wrap">
				<h6 class="mb-1 mr-5 w-52 flex-shrink-0 font-medium">zip</h6>

				<div class="mb-2 w-full max-w-md">
					<Textbox placeholder="Enter zip" bind:value="{address.zip}" />
				</div>
			</div>
			</div>
		</form>
	</div>
</div>


		<PrimaryButton type="submit" loading="{loading}" class="w-60">Save Address</PrimaryButton>
	</form>
</div>
