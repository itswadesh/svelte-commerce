<script context="module" lang="ts">
export async function load({ url, params, fetch, session, context }) {
	let ads, err
	let addressId = url.searchParams.get('id')

	if (addressId === 'new') {
		ads = { id: 'new' }
	} else {
		ads = (
			await KQL_Address.query({ fetch, variables: { id: addressId }, settings: { cacheMs: 0 } })
		).data?.address
	}
	return { props: { err, ads } }
}
</script>

<script>
import GradiantButton from '$lib/ui/GradiantButton.svelte'
import Textbox from '$lib/ui/Textbox.svelte'
import BackButton from '$lib/ui/BackButton.svelte'
import {
	KQL_Address,
	KQL_SaveAddress,
	KQL_States,
	KQL_StoreCountries
} from '$lib/graphql/_kitql/graphqlStores'
import Error from '$lib/Error.svelte'
import { goto } from '$app/navigation'
import { onMount } from 'svelte'
import { store, toast } from '$lib/util'
import AutoComplete from 'simple-svelte-autocomplete'
import Select from 'svelte-select'
import { stringify } from 'postcss'

$: ads = $KQL_Address.data?.address || {}
let err,
	loading = false,
	formChanged = false,
	selectedState = {},
	adsCountry = 'IN'

async function save(ads) {
	const id = ads.id || 'new'
	const {
		firstName,
		lastName,
		email,
		phone,
		address,
		locality,
		city,
		district,
		state,
		country,
		zip
	} = ads
	try {
		loading = true
		const { data, errors } = await KQL_SaveAddress.mutate({
			variables: {
				id,
				firstName,
				lastName,
				email,
				phone,
				address,
				locality,
				city,
				district,
				state,
				country,
				zip
			}
		})
		if (errors) {
			err = errors[0].message
			toast(err, 'error')
		} else goto(`/checkout/address`)
	} catch (e) {
		err = e
	} finally {
		loading = false
	}
}
onMount(async () => {
	await KQL_StoreCountries.query({ variables: { store: store?.id, page: 0, limit: 300 } })
	// selectedCountry = countries[0]
	// await KQL_Cities.query({ variables: { limit: 300, page: 0, country: ads.country } })
	await KQL_States.query({
		variables: { limit: 300, page: 0, countryCode: ads?.country?.code || ads?.country }
	})
	selectedState = { name: ads?.state }
	const adsCountryA = $KQL_StoreCountries.data?.storeCountries?.data.filter(
		(c) => c.code === ads.country
	)
	if (adsCountryA) {
		adsCountry = adsCountryA[0]
	}
})

async function onCountryChange() {
	// selectedCountry = ads.country
	// await KQL_Cities.query({
	// 	variables: { limit: 300, page: 0, country: ads.country },
	// 	settings: { policy: 'network-only' }
	// })
	if (adsCountry) {
		ads.country = adsCountry.code ? adsCountry.code : adsCountry
		formChanged = true
		await KQL_States.query({
			variables: { limit: 300, page: 0, countryCode: ads.country },
			settings: { policy: 'network-only' }
		})
		selectedState = { name: ads?.state }
	}
}
const seoProps = {
	title: 'Add Address ',
	metadescription: 'Add Address '
}

$: allCountries = $KQL_StoreCountries.data?.storeCountries
$: allStates = $KQL_States.data?.states?.data
let stateName = ads?.state
function stateChanged({ detail }) {
	console.log('state changed', detail)
	ads.state = detail.name
	// save({ ...ads, state: state.name })
}
</script>

{#if ads}
	<div class="container mx-auto max-w-4xl p-3 py-5 sm:p-10">
		<div class="flex items-center justify-between gap-5">
			<h2 class="mb-5 text-xl font-bold capitalize tracking-wide sm:text-2xl">
				{#if ads.id === 'new'}
					Add New Address
				{:else}
					Edit Address
				{/if}
			</h2>

			<BackButton to="/checkout/address" class="" />
		</div>

		<Error err="{err}" />

		<form novalidate autocomplete="off" on:submit|preventDefault="{() => save(ads)}">
			<div class="grid grid-cols-1 gap-2 text-sm sm:gap-5 md:grid-cols-2">
				<div>
					<h6 class="mb-2 font-semibold">First Name</h6>

					<Textbox
						type="text"
						bind:value="{ads.firstName}"
						placeholder="Enter First Name"
						required />
				</div>

				<div>
					<h6 class="mb-2 font-semibold">Last Name</h6>

					<Textbox type="text" bind:value="{ads.lastName}" placeholder="Enter First Name" />
				</div>

				<div>
					<h6 class="mb-2 font-semibold">Email</h6>

					<Textbox type="text" bind:value="{ads.email}" placeholder="Enter Email" required />
				</div>

				<div>
					<h6 class="mb-2 font-semibold">Mobile number</h6>

					<Textbox type="text" bind:value="{ads.phone}" placeholder="Enter Phone No" />
				</div>

				<div>
					<h6 class="mb-2 font-semibold">Address (Area and Street)</h6>

					<Textbox type="text" bind:value="{ads.address}" placeholder="Enter Address" required />
				</div>

				<div>
					<h6 class="mb-2 font-semibold">Landmark</h6>

					<Textbox type="text" bind:value="{ads.locality}" placeholder="Enter Landmark" required />
				</div>

				<div>
					<h6 class="mb-2 font-semibold">City/District/Town</h6>
					<Textbox type="text" bind:value="{ads.city}" placeholder="Enter City" required />
				</div>
				<!-- {#if ads?.country}
					<div>
						<h6 class="mb-2 font-semibold">State</h6>
						<select
							class="w-full rounded-md border border-gray-300 bg-gray-50 p-2 text-sm placeholder-gray-400  transition duration-300 placeholder:font-normal hover:bg-white focus:outline-none focus:ring-1 focus:ring-primary-500"
							bind:value="{ads.state}"
							on:input="{() => (formChanged = true)}">
							<option value="" selected>-- Select a State --</option>
							{#if $KQL_States.data?.states.data && $KQL_States.data?.states.data.length}
								{#each $KQL_States.data?.states.data as c}
									{#if c}
										<option value="{c.name}">
											{c.name}
										</option>
									{/if}
								{/each}
							{/if}
						</select>
					</div>
				{/if} -->
				<div>
					<h6 class="mb-2 font-semibold">Country</h6>
					{#if $KQL_StoreCountries.isFetching}
						Loading Countries...
					{:else if allCountries?.count}
						<Select
							items="{allCountries?.data}"
							bind:value="{adsCountry}"
							optionIdentifier="code"
							labelIdentifier="name"
							on:select="{() => onCountryChange()}" />
					{/if}
					<!-- <select
						class="w-full rounded-md border border-gray-300 bg-gray-50 p-2 text-sm placeholder-gray-400  transition duration-300 placeholder:font-normal hover:bg-white focus:outline-none focus:ring-1 focus:ring-primary-500"
						bind:value="{ads.country}"
						>
						<option value="" selected>-- Select a Country --</option>
						{#if allCountries?.length}
							{#each allCountries as c}
								{#if c?.country}
									<option value="{c.country?.code}">
										{c.country?.name}
									</option>
								{/if}
							{/each}
						{/if}
					</select> -->
					<!-- <Textbox type="text" bind:value="{ads.country}" placeholder="Enter Country" required /> -->
				</div>
				{#if ads?.country}
					<div>
						<h6 class="mb-2 font-semibold">State</h6>
						<Select
							items="{allStates}"
							bind:value="{selectedState}"
							optionIdentifier="name"
							labelIdentifier="name"
							on:select="{stateChanged}" />
						<!-- <AutoComplete
							noInputStyles="{true}"
							className="w-full placeholder:font-normal placeholder-gray-400"
							inputClassName="text-sm bg-gray-50 w-full hover:bg-white focus:ring-1 focus:ring-primary-500 rounded-md border border-gray-300 transition duration-300 focus:outline-none"
							items="{allStates}"
							bind:selectedItem="{selectedState}"
							bind:value="{stateName}"
							onChange="{stateChanged}"
							labelFieldName="name"
							valueFieldName="name" /> -->
						<!-- <select
							class="w-full rounded-md border border-gray-300 bg-gray-50 p-2 text-sm placeholder-gray-400  transition duration-300 placeholder:font-normal hover:bg-white focus:outline-none focus:ring-1 focus:ring-primary-500"
							bind:value="{ads.state}"
							on:change="{() => (formChanged = true)}">
							<option value="" selected>-- Select a State --</option>
							{#if allStates && allStates.length}
								{#each allStates as c}
									{#if c}
										<option value="{c.name}">
											{c.name}
										</option>
									{/if}
								{/each}
							{/if}
						</select> -->
						<!-- <Textbox type="text" bind:value="{ads.state}" placeholder="Enter State" required /> -->
					</div>
				{/if}

				<div>
					<h6 class="mb-2 font-semibold">Zip</h6>

					<Textbox type="text" bind:value="{ads.zip}" placeholder="Enter Pincode / Zip" required />
				</div>
			</div>

			<!-- <label class="flex flex-row">
                <h6 class="text-gray-500">Make this as a default address</h6>

               	<Textbox type="checkbox" bind:value="{ads.email}" />
            </label> -->

			<div class="mt-10 flex justify-center">
				<GradiantButton type="submit" loading="{loading}" class="px-10">
					SAVE ADDRESS
				</GradiantButton>
			</div>
		</form>
	</div>
{/if}
