<script>
import CtrlS from '$lib/components/CtrlS.svelte'
import Error from '$lib/components/Error.svelte'
import Textbox from '$lib/ui/Textbox.svelte'
import { toast } from '$lib/util'
import { getAPI, post } from '$lib/util/api'
import { goto } from '$app/navigation'
import { createEventDispatcher, onMount } from 'svelte'
import ToggleSwitch from '$lib/ui/ToggleSwitch.svelte'
import Textarea from '$lib/ui/Textarea.svelte'

const dispatch = createEventDispatcher()

let err = null
let loading = false
let formChanged = false
export let states = false
export let countries = false

export let address = {}
function saveImage({ detail, field }) {
	address[field] = detail
	SaveAddress(address)
}

async function SaveAddress(address) {
	try {
		let id = address.id || 'new'
		loading = true
		const { firstName, lastName, email, phone, locality, city, state, country, zip } = address
		toast('Saving Address Info...', 'info')
		const newAddress = (
			await post('addresses', {
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
				zip
			})
		).data?.saveAddress

		// console.log(newAddress)

		toast('Address Info Saved.', 'success')
		dispatch('saved')
		if (id === 'new') goto(`/my/addresses/${newAddress.id}`)
	} catch (e) {
		err = e
		toast(e, 'error')
	} finally {
		loading = false
		formChanged = false
	}
}
onMount(async () => {})
async function onCountryChange(country) {
	formChanged = true
	await getAPI('states', { limit: 300, page: 0, countryCode: country })
}
</script>

<div class="min-h-screen">
	<Error err="{err}" />

	<div class="max-w-3xl">
		<form on:submit|preventDefault="{() => SaveAddress(address)}">
			<div class="mb-5 flex flex-col gap-2 lg:mb-10">
				<div class="flex flex-wrap">
					<h6 class="mb-1 mr-5 w-52 flex-shrink-0 font-medium">First Name</h6>

					<div class="mb-2 w-full max-w-md">
						<Textbox
							type="text"
							placeholder="Enter First Name"
							bind:value="{address.firstName}"
							on:input="{() => (formChanged = true)}" />
					</div>
				</div>

				<div class="flex flex-wrap">
					<h6 class="mb-1 mr-5 w-52 flex-shrink-0 font-medium">Last Name</h6>

					<div class="mb-2 w-full max-w-md">
						<Textbox
							placeholder="Enter Last Name"
							bind:value="{address.lastName}"
							on:input="{() => (formChanged = true)}" />
					</div>
				</div>

				<div class="flex flex-wrap">
					<h6 class="mb-1 mr-5 w-52 flex-shrink-0 font-medium">Email</h6>

					<div class="mb-2 w-full max-w-md">
						<Textbox
							type="text"
							placeholder="Enter Email"
							bind:value="{address.email}"
							on:input="{() => (formChanged = true)}" />
					</div>
				</div>

				<div class="flex flex-wrap">
					<h6 class="mb-1 mr-5 w-52 flex-shrink-0 font-medium">Phone</h6>

					<div class="mb-2 w-full max-w-md">
						<Textbox
							type="text"
							placeholder="Enter Phone"
							bind:value="{address.phone}"
							on:input="{() => (formChanged = true)}" />
					</div>
				</div>

				<div class="flex flex-wrap">
					<h6 class="mb-1 mr-5 w-52 flex-shrink-0 font-medium">Address</h6>

					<div class="mb-2 w-full max-w-md">
						<Textarea
							placeholder="Enter Address"
							bind:value="{address.address}"
							on:input="{() => (formChanged = true)}" />
					</div>
				</div>

				<div class="flex flex-wrap">
					<h6 class="mb-1 mr-5 w-52 flex-shrink-0 font-medium">Locality</h6>

					<div class="mb-2 w-full max-w-md">
						<Textbox
							placeholder="Enter Locality"
							bind:value="{address.locality}"
							on:input="{() => (formChanged = true)}" />
					</div>
				</div>
				<div class="flex flex-wrap">
					<h6 class="mb-1 mr-5 w-52 flex-shrink-0 font-medium">City</h6>

					<div class="mb-2 w-full max-w-md">
						<Textbox
							placeholder="Enter City"
							bind:value="{address.city}"
							on:input="{() => (formChanged = true)}" />
					</div>
				</div>
				{#if address?.country && states.data?.length}
					<div>
						<h6 class="mb-2 font-semibold">State</h6>
						<select
							class="w-full rounded-md border border-gray-300 bg-gray-50 p-2 text-sm placeholder-gray-400  transition duration-300 placeholder:font-normal hover:bg-white focus:outline-none focus:ring-1 focus:ring-primary-500"
							bind:value="{address.state}"
							on:input="{() => (formChanged = true)}">
							<option value="" selected>-- Select a State --</option>
							{#each states.data as c}
								{#if c}
									<option value="{c.name}">
										{c.name}
									</option>
								{/if}
							{/each}
						</select>
						<!-- <Textbox type="text" bind:value="{address.state}" placeholder="Enter State" required /> -->
					</div>
				{/if}
				<div>
					<h6 class="mb-2 font-semibold">Country</h6>
					<select
						class="w-full rounded-md border border-gray-300 bg-gray-50 p-2 text-sm placeholder-gray-400  transition duration-300 placeholder:font-normal hover:bg-white focus:outline-none focus:ring-1 focus:ring-primary-500"
						bind:value="{address.country}"
						on:change="{() => onCountryChange(address.country)}">
						<option value="" selected>-- Select a Country --</option>
						{#if countries?.data?.length}
							{#each countries.data as c}
								{#if c?.country}
									<option value="{c.country?.code}">
										{c.country?.name}
									</option>
								{/if}
							{/each}
						{/if}
					</select>
					<!-- <Textbox type="text" bind:value="{address.country}" placeholder="Enter Country" required /> -->
				</div>

				<div class="flex flex-wrap">
					<h6 class="mb-1 mr-5 w-52 flex-shrink-0 font-medium">zip</h6>

					<div class="mb-2 w-full max-w-md">
						<Textbox
							placeholder="Enter zip"
							bind:value="{address.zip}"
							on:input="{() => (formChanged = true)}" />
					</div>
				</div>

				<div class="flex flex-wrap">
					<h6 class="mb-1 mr-5 w-52 flex-shrink-0 font-medium">Active</h6>

					<div class="mb-2 w-full max-w-md">
						<ToggleSwitch
							color="blue"
							size="sm"
							bind:checked="{address.active}"
							on:input="{() => (formChanged = true)}" />
					</div>
				</div>
			</div>
		</form>
	</div>
</div>

<CtrlS
	loading="{loading}"
	loadingMessage="Saving Address Info."
	formChanged="{formChanged}"
	on:save="{() => SaveAddress(address)}" />
