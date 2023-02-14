<script>
import { fetchCountries, fetchStates } from '$lib/services/CountryService'
import { goto } from '$app/navigation'
import { onMount } from 'svelte'
import { page } from '$app/stores'
import { post } from '$lib/utils/api'
import { saveAddress } from '$lib/services/AddressService'
import { toast } from '$lib/utils'
import BackButton from '$lib/ui/BackButton.svelte'
import Error from '$lib/components/Error.svelte'
import PrimaryButton from '$lib/ui/PrimaryButton.svelte'
import SEO from '$lib/components/SEO/index.svelte'
import Textbox from '$lib/ui/Textbox.svelte'

export let data


let err
let loading = false
let countries
let states

async function onCountryChange(country) {
	getStates(country)
}

async function getStates(countryCode) {
	try {
		states = await fetchStates({
			countryCode,
			origin: $page?.data?.origin,
			storeId: $page?.data?.store?.id
		})
	} catch (e) {}
}

const seoProps = {
	title: 'Add Address ',
	metadescription: 'Add Address '
}

async function save(ads) {
	const id = data.ads._id || 'new'
	const {
		address,
		city,
		country,
		district,
		email,
		firstName,
		lastName,
		locality,
		phone,
		state,
		zip
	} = ads
	try {
		loading = true
		await saveAddress({
			id,
			address,
			city,
			country,
			district,
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
		goto(`/checkout/address`)
	} catch (e) {
		err = e
		toast(e?.body?.message || e, 'error')
	} finally {
		loading = false
	}
}
</script>

<SEO {...seoProps} />

{#if data.ads}
	<div class="container mx-auto min-h-screen max-w-4xl p-3 py-5 sm:p-10">
		<div class="flex items-center justify-between gap-5">
			<h2 class="mb-5 text-xl font-bold capitalize tracking-wide sm:text-2xl">
				{#if data.ads.id === 'new'}
					Add New Address
				{:else}
					Edit Address
				{/if}
			</h2>

			<BackButton to="/checkout/address" class="" />
		</div>

		<Error err="{err}" />

		<form novalidate autocomplete="off" on:submit|preventDefault="{() => save(data.ads)}">
			<div class="grid grid-cols-1 gap-2 text-sm sm:gap-5 md:grid-cols-2">
				<div>
					<h6 class="mb-2 font-semibold">First Name <span class="text-red-500">*</span></h6>

					<Textbox
						type="text"
						bind:value="{data.ads.firstName}"
						placeholder="Enter First Name"
						required
					/>
				</div>

				<div>
					<h6 class="mb-2 font-semibold">Last Name</h6>

					<Textbox type="text" bind:value="{data.ads.lastName}" placeholder="Enter Last Name" />
				</div>

				<div>
					<h6 class="mb-2 font-semibold">Email</h6>

					<Textbox type="text" bind:value="{data.ads.email}" placeholder="Enter Email" />
				</div>

				<div>
					<h6 class="mb-2 font-semibold">Mobile number <span class="text-red-500">*</span></h6>

					<Textbox
						type="text"
						maxlength="10"
						bind:value="{data.ads.phone}"
						placeholder="Enter Phone No"
					/>
				</div>

				<div>
					<h6 class="mb-2 font-semibold">
						Address (Area and Street) <span class="text-red-500">*</span>
					</h6>

					<Textbox
						type="text"
						bind:value="{data.ads.address}"
						placeholder="Enter Address"
						required
					/>
				</div>

				<div>
					<h6 class="mb-2 font-semibold">Landmark</h6>

					<Textbox type="text" bind:value="{data.ads.locality}" placeholder="Enter Landmark" />
				</div>

				<div>
					<h6 class="mb-2 font-semibold">City/District/Town <span class="text-red-500">*</span></h6>

					<Textbox type="text" bind:value="{data.ads.city}" placeholder="Enter City" required />
				</div>

				{#if data.ads.country}
					<div>
						<h6 class="mb-2 font-semibold">State <span class="text-red-500">*</span></h6>

						{#if data.states?.length}
							<select
								bind:value="{data.ads.state}"
								required
								class="w-full rounded-md border border-gray-300 bg-white p-2 text-sm placeholder-gray-400  transition duration-300 placeholder:font-normal focus:outline-none focus:ring-1 focus:ring-primary-500 hover:bg-gray-50"
							>
								<option disabled selected>-- Select a State --</option>
								{#each data.states as s}
									{#if s}
										<option value="{s.name}">
											{s.name}
										</option>
									{/if}
								{/each}
							</select>
						{/if}
					</div>
				{/if}

				<div>
					<h6 class="mb-2 font-semibold">Country <span class="text-red-500">*</span></h6>

					{#if data.countries?.length}
						<select
							bind:value="{data.ads.country}"
							required
							class="w-full rounded-md border border-gray-300 bg-white p-2 text-sm placeholder-gray-400  transition duration-300 placeholder:font-normal focus:outline-none focus:ring-1 focus:ring-primary-500 hover:bg-gray-50"
							on:change="{() => onCountryChange(data.ads.country)}"
						>
							<option disabled selected>-- Select a Country --</option>
							{#each data.countries as c}
								{#if c}
									<option value="{c.code}">
										{c.name}
									</option>
								{/if}
							{/each}
						</select>
					{/if}
				</div>

				<div>
					<h6 class="mb-2 font-semibold">Pincode / Zip <span class="text-red-500">*</span></h6>

					<Textbox
						type="text"
						bind:value="{data.ads.zip}"
						placeholder="Enter Pincode / Zip"
						required
					/>
				</div>
			</div>

			<div class="mt-5 flex justify-end sm:mt-10">
				<PrimaryButton type="submit" loading="{loading}" class="px-10">SAVE ADDRESS</PrimaryButton>
			</div>
		</form>
	</div>
{/if}
