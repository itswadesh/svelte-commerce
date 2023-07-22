<script>
import { AddressService, CountryService } from '$lib/services'
import { createEventDispatcher } from 'svelte'
import { goto } from '$app/navigation'
import { page } from '$app/stores'
import { toast } from '$lib/utils'
import { Error } from '$lib/components'
import { PrimaryButton, Textarea, Textbox } from '$lib/ui'

const dispatch = createEventDispatcher()

let err = null
let formChanged = false
let loading = false

export let address = {}
export let countries = []
export let states = []

let loadingStates = false

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
		const { city, country, email, firstName, lastName, locality, phone, state, zip } = address

		toast('Saving Address Info...', 'info')

		const newAddress = await AddressService.saveAddress({
			id,
			address: address.address,
			city,
			country,
			email,
			firstName,
			lastName,
			locality,
			phone,
			state,
			zip,
			storeId: $page.data.store?.id,
			origin: $page.data.origin
		})

		const newAddressId = newAddress._id || newAddress.id

		toast('Address Info Saved.', 'success')
		dispatch('saved', { id, newAddressId })
	} catch (e) {
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

	<form on:submit|preventDefault="{() => SaveAddress(address)}">
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
						bind:value="{address.firstName}"
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
					<Textbox placeholder="Enter Last Name" bind:value="{address.lastName}" required />
				</div>
			</div>

			<!-- Email -->

			<div class="flex flex-col sm:flex-row gap-2 sm:gap-5">
				<h6 class="sm:w-52 sm:shrink-0">Email</h6>

				<div class="w-full">
					<Textbox type="email" placeholder="Enter Email" bind:value="{address.email}" />
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
						bind:value="{address.phone}"
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

				<Textarea placeholder="Enter Address" bind:value="{address.address}" required />
			</div>

			<!-- Locality -->

			<div class="flex flex-col sm:flex-row gap-2 sm:gap-5">
				<h6 class="sm:w-52 sm:shrink-0">Locality</h6>

				<div class="w-full">
					<Textbox placeholder="Enter Locality" bind:value="{address.locality}" />
				</div>
			</div>

			<!-- City -->

			<div class="flex flex-col sm:flex-row gap-2 sm:gap-5">
				<h6 class="sm:w-52 sm:shrink-0">City</h6>

				<div class="w-full">
					<Textbox placeholder="Enter City" bind:value="{address.city}" />
				</div>
			</div>

			<!-- Country -->

			<div class="flex flex-col sm:flex-row gap-2 sm:gap-5">
				<h6 class="sm:w-52 sm:shrink-0">
					Country

					<span class="text-accent-500">*</span>
				</h6>

				<select
					class="w-full rounded border border-zinc-200 bg-white p-2 text-sm placeholder-zinc-400 transition duration-300 placeholder:font-normal focus:outline-none focus:ring-1 focus:ring-primary-500 hover:bg-zinc-50"
					bind:value="{address.country}"
					on:change="{() => onCountryChange(address.country)}"
					required>
					<option value="{null}" disabled selected>-- Select a Country --</option>
					{#if countries?.length > 1}
						{#each countries as c}
							{#if c}
								<option value="{c.code}">
									{c.name}
								</option>
							{/if}
						{/each}
					{/if}
				</select>
			</div>

			<!-- State -->

			<div class="flex flex-col sm:flex-row gap-2 sm:gap-5">
				<h6 class="sm:w-52 sm:shrink-0">
					State/Province

					<span class="text-accent-500">*</span>
				</h6>

				<select
					class="w-full rounded border border-zinc-200 bg-white p-2 text-sm placeholder-zinc-400 transition duration-300 placeholder:font-normal focus:outline-none focus:ring-1 focus:ring-primary-500 hover:bg-zinc-50"
					bind:value="{address.state}"
					disabled="{!address.country || loadingStates}"
					required>
					<option value="{null}" disabled selected>-- Select a State --</option>
					{#if states?.length > 1}
						{#each states as s}
							{#if s}
								<option value="{s.name}">
									{s.name}
								</option>
							{/if}
						{/each}
					{/if}
				</select>
			</div>

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
						bind:value="{address.zip}"
						required />
				</div>
			</div>
		</div>

		<PrimaryButton type="submit" loading="{loading}" class="w-60">Save Address</PrimaryButton>
	</form>
</div>
