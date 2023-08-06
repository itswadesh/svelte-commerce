<script>
import { AddressService, CountryService } from '$lib/services'
import { applyAction, enhance } from '$app/forms'
import { createEventDispatcher } from 'svelte'
import { Error } from '$lib/components'
import { goto, invalidateAll } from '$app/navigation'
import { page } from '$app/stores'
import { PrimaryButton, Textarea, Textbox } from '$lib/ui'
import { toast } from '$lib/utils'

const dispatch = createEventDispatcher()

export let address = {}
export let countries = []
export let editAddress = false
export let states = []

// console.log('address', address)
// console.log('countries', countries)
// console.log('states', states)

let err = null
let formChanged = false
let loading = false
let loadingStates = false

let refinedAddress = {
	address_address: address.address || address.address_1,
	address_city: address.city,
	address_company: address.company,
	address_country: address.country || address.country_code,
	address_email: address.email,
	address_firstName: address.firstName || address.first_name,
	address_id: address._id || address.id || 'new',
	address_lastName: address.lastName || address.last_name,
	address_locality: address.locality || address.address_2,
	address_phone: address.phone,
	address_state: address.state || address.province,
	address_zip: address.zip || address.postal_code
}

async function onCountryChange(country) {
	try {
		err = null
		loadingStates = true
		address.state = null
		states = await CountryService.fetchStates({
			countryCode: country,
			storeId: $page.data?.store?.id,
			origin: $page.data?.origin
		})

		// console.log('states', states)
	} catch (e) {
		err = e
	} finally {
		loadingStates = false
	}
}

async function SaveAddress(address) {
	try {
		loading = true
		err = null

		let id = address._id || address.id || 'new'
		const {
			address_address,
			address_city,
			address_company,
			address_country,
			address_email,
			address_firstName,
			address_lastName,
			address_locality,
			address_phone,
			address_state,
			address_zip
		} = address

		toast('Saving Address Info...', 'info')

		const newAddress = await AddressService.saveAddress({
			id,
			address: address_address,
			city: address_city,
			// company: address_company,
			country: address_country,
			email: address_email,
			firstName: address_firstName,
			lastName: address_lastName,
			locality: address_locality,
			phone: address_phone,
			state: address_state,
			zip: address_zip,
			storeId: $page.data.store?.id,
			origin: $page.data.origin
		})

		const newAddressId = newAddress._id || newAddress.id

		toast('Address Info Saved.', 'success')
		dispatch('saved', { id, newAddressId })
	} catch (e) {
		// console.log('error', e)
		err = e?.body
		toast(err, 'error')
	} finally {
		loading = false
		formChanged = false
	}
}
</script>

<div>
	<Error err="{err}" class="mb-5" />

	<form
		action="{refinedAddress.address_id === 'new'
			? '/my/addresses?/saveAddress'
			: '/my/addresses?/editAddress'}"
		method="POST"
		use:enhance="{() => {
			return async ({ result }) => {
				console.log('result, refinedAddress.address_id', result, refinedAddress.address_id)

				if (result?.data) {
					const newAddressId = result.data?._id || result.data?.id
					toast('Address Info Saved.', 'success')
					if (refinedAddress.address_id === 'new' && newAddressId) {
						goto(`/checkout/payment-options?address=${newAddressId}`)
					}
					await applyAction(result)
				}

				editAddress = false
			}
		}}">
		<!-- <form on:submit|preventDefault="{() => SaveAddress(refinedAddress)}"> -->
		<div class="mb-5 flex flex-col gap-2 lg:mb-10">
			<!-- First Name -->

			<div class="flex flex-col sm:flex-row gap-2 sm:gap-5">
				<h6 class="sm:w-52 sm:shrink-0">
					First Name

					<span class="text-accent-500">*</span>
				</h6>

				<div class="w-full">
					<Textbox
						type="text"
						placeholder="Enter First Name"
						bind:value="{refinedAddress.address_firstName}"
						autoFocus
						required />
				</div>
			</div>

			<!-- Last Name -->

			<div class="flex flex-col sm:flex-row gap-2 sm:gap-5">
				<h6 class="sm:w-52 sm:shrink-0">
					Last Name

					<span class="text-accent-500">*</span>
				</h6>

				<div class="w-full">
					<Textbox
						placeholder="Enter Last Name"
						bind:value="{refinedAddress.address_lastName}"
						required />
				</div>
			</div>

			<!-- Email -->

			<div class="flex flex-col sm:flex-row gap-2 sm:gap-5">
				<h6 class="sm:w-52 sm:shrink-0">Email</h6>

				<div class="w-full">
					<Textbox
						type="email"
						placeholder="Enter Email"
						bind:value="{refinedAddress.address_email}" />
				</div>
			</div>

			<!-- Phone -->

			<div class="flex flex-col sm:flex-row gap-2 sm:gap-5">
				<h6 class="sm:w-52 sm:shrink-0">
					Phone

					<span class="text-accent-500">*</span>
				</h6>

				<div class="w-full">
					<Textbox
						type="tel"
						placeholder="Enter Phone"
						maxlength="13"
						bind:value="{refinedAddress.address_phone}"
						required />

					<p class="mt-1">E.g.+nnxxxxxxxxxx</p>
				</div>
			</div>

			<!-- Address -->

			<div class="flex flex-col sm:flex-row gap-2 sm:gap-5">
				<h6 class="sm:w-52 sm:shrink-0">
					Address

					<span class="text-accent-500">*</span>
				</h6>

				<Textarea
					placeholder="Enter Address"
					bind:value="{refinedAddress.address_address}"
					required />
			</div>

			<!-- Locality -->

			<div class="flex flex-col sm:flex-row gap-2 sm:gap-5">
				<h6 class="sm:w-52 sm:shrink-0">Locality</h6>

				<div class="w-full">
					<Textbox placeholder="Enter Locality" bind:value="{refinedAddress.address_locality}" />
				</div>
			</div>

			<!-- City -->

			<div class="flex flex-col sm:flex-row gap-2 sm:gap-5">
				<h6 class="sm:w-52 sm:shrink-0">City</h6>

				<div class="w-full">
					<Textbox placeholder="Enter City" bind:value="{refinedAddress.address_city}" />
				</div>
			</div>

			<!-- Company -->

			<div class="flex flex-col sm:flex-row gap-2 sm:gap-5">
				<h6 class="sm:w-52 sm:shrink-0">Company</h6>

				<div class="w-full">
					<Textbox placeholder="Enter Company" bind:value="{refinedAddress.address_company}" />
				</div>
			</div>

			<!-- Country -->

			<div class="flex flex-col sm:flex-row gap-2 sm:gap-5">
				<h6 class="sm:w-52 sm:shrink-0">
					Country

					<span class="text-accent-500">*</span>
				</h6>

				{#if countries?.length}
					<select
						disabled="{countries?.length === 1}"
						class="w-full rounded border border-zinc-200 bg-white p-2 text-sm placeholder-zinc-400 transition duration-300 placeholder:font-normal focus:outline-none focus:ring-1 focus:ring-primary-500 hover:bg-zinc-50"
						bind:value="{refinedAddress.address_country}"
						on:change="{() => onCountryChange(refinedAddress.address_country)}"
						required>
						<option value="{null}" disabled selected>-- Select a Country --</option>

						{#each countries as c}
							{#if c}
								<option value="{c.code || c.iso_2}" selected="{c.default}">
									{c.name}
								</option>
							{/if}
						{/each}
					</select>
				{:else}
					<a
						href="/contact-us"
						aria-label="contact us"
						class="py-2 text-sm text-zinc-500 hover:text-zinc-800 hover:underline">
						Contact the website admin to enable your country
					</a>
				{/if}
			</div>

			<!-- State -->

			{#if states?.length}
				<div class="flex flex-col sm:flex-row gap-2 sm:gap-5">
					<h6 class="sm:w-52 sm:shrink-0">
						State/Province

						<span class="text-accent-500">*</span>
					</h6>

					<select
						class="w-full rounded border border-zinc-200 bg-white p-2 text-sm placeholder-zinc-400 transition duration-300 placeholder:font-normal focus:outline-none focus:ring-1 focus:ring-primary-500 hover:bg-zinc-50"
						bind:value="{refinedAddress.address_state}"
						disabled="{!refinedAddress.address_country || loadingStates}"
						required>
						<option value="{null}" disabled selected>-- Select a State --</option>
						{#each states as s}
							{#if s}
								<option value="{s.code || s.iso_2}">
									{s.name}
								</option>
							{/if}
						{/each}
					</select>
				</div>
			{/if}

			<!-- ZIP -->

			<div class="flex flex-col sm:flex-row gap-2 sm:gap-5">
				<h6 class="sm:w-52 sm:shrink-0">
					ZIP

					<span class="text-accent-500">*</span>
				</h6>

				<div class="w-full">
					<Textbox
						type="tel"
						placeholder="Enter zip"
						maxlength="6"
						bind:value="{refinedAddress.address_zip}"
						required />
				</div>
			</div>
		</div>

		<input type="hidden" name="address" value="{refinedAddress.address_address}" />
		<input type="hidden" name="city" value="{refinedAddress.address_city}" />
		<input type="hidden" name="company" value="{refinedAddress.address_company}" />
		<input type="hidden" name="country" value="{refinedAddress.address_country}" />
		<input type="hidden" name="email" value="{refinedAddress.address_email}" />
		<input type="hidden" name="firstName" value="{refinedAddress.address_firstName}" />
		<input type="hidden" name="id" value="{refinedAddress.address_id}" />
		<input type="hidden" name="lastName" value="{refinedAddress.address_lastName}" />
		<input type="hidden" name="locality" value="{refinedAddress.address_locality}" />
		<input type="hidden" name="phone" value="{refinedAddress.address_phone}" />
		<input type="hidden" name="state" value="{refinedAddress.address_state}" />
		<input type="hidden" name="zip" value="{refinedAddress.address_zip}" />

		<PrimaryButton type="submit" loading="{loading}" class="w-60">Save Address</PrimaryButton>
	</form>
</div>
