<script>
import { AddressService, CountryService, ZipService } from '$lib/services'
import { applyAction, enhance } from '$app/forms'
import { createEventDispatcher, onMount } from 'svelte'
import { Error } from '$lib/components'
import { goto, invalidateAll } from '$app/navigation'
import { page } from '$app/stores'
import { PrimaryButton, Textarea, Textbox } from '$lib/ui'
import { toast } from '$lib/utils'
import { slide } from 'svelte/transition'

const IS_DEV = import.meta.env.DEV
const dispatch = createEventDispatcher()

export let billing_address = {}
export let shipping_address = {}
export let countries = []
export let editAddress = false

// console.log('$page', $page)
// console.log('address', address)
// console.log('countries', countries)

if (!shipping_address?.firstName) {
	shipping_address = IS_DEV
		? {
				address: 'Test address',
				city: 'Test city',
				country: 'IN',
				email: 'test@email.com',
				firstName: 'Test first name',
				lastName: 'Test last name',
				phone: '1111111111',
				state: 'GOA',
				zip: '111111'
			}
		: {}
}

shipping_address.zip = shipping_address.zip || shipping_address.pincode || ''
shipping_address.phone = shipping_address.phone || $page?.data?.me?.phone || ''

let err = null
let formChanged = false
let isSameAsBillingAddress = true
let loading = false
let loadingStates = false
let selectedCountry = {}
let showErrorMessage = false
let showBillingErrorMessage = false
let states = []
let zodErrors = null

onMount(async () => {
	await invalidateAll()
	if (countries?.length === 1) {
		shipping_address.country = countries[0].code
	} else if (countries?.length > 1) {
		const dafaultCountry = countries.filter((c) => {
			return c.dafault
		})

		// console.log('dafaultCountry', dafaultCountry)

		if (dafaultCountry[0]) {
			shipping_address.country = dafaultCountry[0].code
		}
	}

	if (shipping_address.country) {
		fetchStates(shipping_address.country)
		getSelectedCountry()
	}

	if (
		shipping_address &&
		billing_address &&
		shipping_address.address === billing_address.address &&
		shipping_address.zip === billing_address.zip
	) {
		isSameAsBillingAddress = true
	} else if (!billing_address.firstName) {
		isSameAsBillingAddress = true
	} else {
		isSameAsBillingAddress = false
	}
})

function getSelectedCountry() {
	selectedCountry = countries.filter((c) => {
		if (c.code === shipping_address.country) {
			return c
		}
	})

	// console.log('selectedCountry', selectedCountry)
}

async function onCountryChange(country) {
	shipping_address.state = null
	fetchStates(country)
	getSelectedCountry()
}

async function fetchStates(country) {
	try {
		err = null
		loadingStates = true

		states = await CountryService.fetchStates({
			countryCode: country,
			storeId: $page.data?.storeId,
			origin: $page.data?.origin
		})

		states = states.map((s) => {
			s.name = s.name.toUpperCase()
			return s
		})

		// console.log('states', states)
	} catch (e) {
		err = e
	} finally {
		loadingStates = false
	}
}

async function fetchStateAndCity(zip, addresstype) {
	if (zip.length != 6) {
		toast('Please enter 6 digit code', 'error')
		return
	}

	try {
		err = null
		loadingStates = true

		let { city, state } = shipping_address

		const zipInfo = await ZipService.findZip({
			zip,
			origin
		})

		// console.log('zipInfo', zipInfo)
		// console.log('addresstype', addresstype)

		if (addresstype === 'billing') {
			billing_address.city = zipInfo.District || ''
			billing_address.state = zipInfo.StateName || ''
		} else {
			shipping_address.city = zipInfo.District || ''
			shipping_address.state = zipInfo.StateName || ''
		}
	} catch (e) {
		err = e
		// console.log(e)
		toast(e.message.error, 'error')
	} finally {
		loadingStates = false
	}
}

function removeSpacesAndAlphabets(input) {
	// Remove spaces and alphabetic characters using regular expression
	const result = input.replace(/[a-zA-Z ]/g, '')

	return result
}

async function SaveAddress(address) {
	try {
		loading = true
		err = null

		let id = address._id || address.id || 'new'
		let { city, country, email, firstName, lastName, phone, state, zip } = address

		if (phone.startsWith('0')) {
			phone = phone.substring(1)
		}

		phone = removeSpacesAndAlphabets(phone)

		getSelectedCountry()
		if (!phone.startsWith('+')) {
			phone = (selectedCountry[0].dialCode || '+91') + phone
		}

		toast('Saving Address Info...', 'info')

		const newAddress = await AddressService.saveAddress({
			id,
			address: address.address, // This is to ignore conflicts
			city: city,
			country: country,
			email: email,
			firstName: firstName,
			lastName: lastName,
			phone: phone,
			state: state,
			zip: zip,
			storeId: $page.data.storeId,
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

// $: // console.log('refinedAddress', JSON.stringify(refinedAddress))

function validatePhoneNumber(phoneNumber, addresstype) {
	// Remove any spaces from the phone number
	phoneNumber = phoneNumber.replace(/\s/g, '')

	// Remove any leading '0' or '+91'
	if (phoneNumber.startsWith('0')) {
		phoneNumber = phoneNumber.substring(1)
	} else if (phoneNumber.startsWith('+91')) {
		phoneNumber = phoneNumber.substring(3)
	}

	// Check if the resulting number is numeric and has a valid length
	if (/^\d+$/.test(phoneNumber) && phoneNumber.length === 10) {
		if (addresstype === 'billing') {
			showBillingErrorMessage = false
		} else {
			showErrorMessage = false
		}

		return true
	}

	if (addresstype === 'billing') {
		showBillingErrorMessage = true
	} else {
		showErrorMessage = true
	}
	return false
}
</script>

<div>
	<Error err="{err?.message?.error || err}" class="mb-5" />

	<form
		action="{!shipping_address.id || shipping_address.id === 'new'
			? '/my/addresses?/saveAddress'
			: '/my/addresses?/editAddress'}"
		method="POST"
		use:enhance="{() => {
			return async ({ result }) => {
				// console.log('result', result)

				// console.log(
				// 	'result, address.id, $page?.url?.pathname',
				// 	result,
				// 	address.id,
				// 	$page?.url?.pathname
				// )

				toast('Address saved successfully', 'success')

				if (result?.status === 200 && result?.data) {
					const newAddressId = result.data?._id || result.data?.id
					toast('Address Info Saved.', 'success')

					if ((!shipping_address.id || shipping_address.id === 'new') && newAddressId) {
						if ($page?.url?.pathname.includes('checkout')) {
							goto(`/checkout/payment-options?address=${newAddressId}`)
						} else {
							goto(`${newAddressId}`)
						}
					} else if ($page?.url?.pathname.includes('checkout')) {
						goto(`/checkout/address`)
					} else {
						goto(`/my/addresses?sort=-updatedAt`)
					}

					await applyAction(result)
				} else if (result?.error) {
					shipping_address.phone = ''
					zodErrors = result?.error?.errors || null
					err = result?.error?.message || null
					// toast(result?.error?.message, 'error')
				}
				editAddress = false
				await invalidateAll()
			}
		}}">
		<!-- <form on:submit|preventDefault="{() => SaveAddress(refinedAddress)}"> -->
		<div class="mb-5 flex flex-col gap-2 lg:mb-10">
			<!-- First Name -->

			<div class="flex flex-col sm:flex-row gap-2 sm:gap-5">
				<h6 class="sm:w-60 sm:shrink-0">
					First Name

					<span class="text-accent-500">*</span>
				</h6>

				<div class="w-full">
					<Textbox
						type="text"
						placeholder="Enter First Name"
						bind:value="{shipping_address.firstName}"
						autoFocus
						required />

					{#if zodErrors?.firstName}<p class="mt-1 text-red-600">
							{zodErrors?.firstName}
						</p>{/if}
				</div>
			</div>

			<!-- Last Name -->

			<div class="flex flex-col sm:flex-row gap-2 sm:gap-5">
				<h6 class="sm:w-60 sm:shrink-0">
					Last Name

					<span class="text-accent-500">*</span>
				</h6>

				<div class="w-full">
					<Textbox
						placeholder="Enter Last Name"
						bind:value="{shipping_address.lastName}"
						required />

					{#if zodErrors?.lastName}<p class="mt-1 text-red-600">{zodErrors?.lastName}</p>{/if}
				</div>
			</div>

			<!-- Email -->

			<div class="flex flex-col sm:flex-row gap-2 sm:gap-5">
				<h6 class="sm:w-60 sm:shrink-0">Email <span class="text-accent-500">*</span></h6>

				<div class="w-full">
					<Textbox
						type="email"
						placeholder="Enter Email"
						bind:value="{shipping_address.email}"
						required />

					{#if zodErrors?.email}<p class="mt-1 text-red-600">{zodErrors?.email}</p>{/if}
				</div>
			</div>

			<!-- Phone -->

			<div class="flex flex-col sm:flex-row gap-2 sm:gap-5">
				<h6 class="sm:w-60 sm:shrink-0">
					Phone

					<span class="text-accent-500">*</span>
				</h6>

				<div class="w-full">
					<Textbox
						type="tel"
						placeholder="Enter Phone"
						maxlength="17"
						bind:value="{shipping_address.phone}"
						on:input="{() => validatePhoneNumber(shipping_address.phone, '')}"
						required />

					<!-- <p class="mt-1">E.g.+nnxxxxxxxxxx</p> -->

					{#if showErrorMessage}
						<p id="phone-warning" class="mt-1 text-red-600">Please enter vaild phone number</p>
					{/if}

					{#if zodErrors?.phone}<p class="mt-1 text-red-600">{zodErrors?.phone}</p>{/if}
				</div>
			</div>

			<!-- Address -->

			<div class="flex flex-col sm:flex-row gap-2 sm:gap-5">
				<h6 class="sm:w-60 sm:shrink-0">
					Address

					<span class="text-accent-500">*</span>
				</h6>

				<div class="w-full">
					<Textarea placeholder="Enter Address" bind:value="{shipping_address.address}" required />

					{#if zodErrors?.address}<p class="mt-1 text-red-600">{zodErrors?.address}</p>{/if}
				</div>
			</div>

			<!-- Postal Code/Pincode/Zipcode -->

			<div class="flex flex-col sm:flex-row gap-2 sm:gap-5">
				<h6 class="sm:w-60 sm:shrink-0">
					Postal Code/Pincode/Zipcode

					<span class="text-accent-500">*</span>
				</h6>

				<div class="w-full">
					<Textbox
						type="tel"
						placeholder="Enter Postal Code/Pincode/Zipcode"
						maxlength="6"
						bind:value="{shipping_address.zip}"
						on:blur="{() => fetchStateAndCity(shipping_address.zip, '')}"
						required />

					{#if zodErrors?.zip}<p class="mt-1 text-red-600">{zodErrors?.zip}</p>{/if}
				</div>
			</div>

			<!-- City -->

			<div class="flex flex-col sm:flex-row gap-2 sm:gap-5">
				<h6 class="sm:w-60 sm:shrink-0">
					City

					<span class="text-accent-500">*</span>
				</h6>

				<div class="w-full">
					<Textbox
						type="text"
						placeholder="Enter City"
						bind:value="{shipping_address.city}"
						required />

					{#if zodErrors?.city}<p class="mt-1 text-red-600">{zodErrors?.city}</p>{/if}
				</div>
			</div>

			<!-- State -->

			{#if states?.length}
				<div class="flex flex-col sm:flex-row gap-2 sm:gap-5">
					<h6 class="sm:w-60 sm:shrink-0">
						State/Province

						<span class="text-accent-500">*</span>
					</h6>

					<div class="w-full">
						<select
							class="w-full rounded border border-zinc-200 bg-white p-2 text-sm placeholder-zinc-400 transition duration-300 placeholder:font-normal focus:outline-none focus:ring-1 focus:ring-primary-500 hover:bg-zinc-50"
							bind:value="{shipping_address.state}"
							disabled="{!shipping_address.country || loadingStates}"
							required>
							<option value="{null}" disabled selected>-- Select a State --</option>
							{#each states as s}
								{#if s}
									<option value="{s.name.toUpperCase()}">
										{s.name}
									</option>
								{/if}
							{/each}
						</select>

						{#if zodErrors?.state}<p class="mt-1 text-red-600">{zodErrors?.state}</p>{/if}
					</div>
				</div>
			{/if}

			<!-- Country -->

			<div class="flex flex-col sm:flex-row gap-2 sm:gap-5">
				<h6 class="sm:w-60 sm:shrink-0">
					Country

					<span class="text-accent-500">*</span>
				</h6>

				<div class="w-full">
					{#if countries?.length}
						<select
							disabled="{countries?.length === 1}"
							class="w-full rounded border border-zinc-200 bg-white p-2 text-sm placeholder-zinc-400 transition duration-300 placeholder:font-normal focus:outline-none focus:ring-1 focus:ring-primary-500 hover:bg-zinc-50"
							bind:value="{shipping_address.country}"
							on:change="{() => onCountryChange(shipping_address.country)}"
							required>
							<option value="{null}" disabled selected>-- Select a Country --</option>

							{#each countries as c}
								{#if c}
									<option value="{c.code}" selected="{c.default}">
										{c.name}
									</option>
								{/if}
							{/each}
						</select>

						{#if zodErrors?.country}<p class="mt-1 text-red-600">{zodErrors?.country}</p>{/if}
					{:else}
						<a
							href="/contact-us"
							aria-label="contact us"
							class="py-2 text-sm text-zinc-500 hover:text-zinc-800 hover:underline">
							Contact the website admin to enable your country
						</a>
					{/if}
				</div>
			</div>
		</div>

		<!-- Billing address for guest checkout -->

		{#if !$page.data.me}
			<label class="mb-5 lg:mb-10 flex items-center gap-2 text-lg font-semibold">
				<input type="checkbox" class="h-5 w-5" bind:checked="{isSameAsBillingAddress}" />

				<span>Same as billing address</span>
			</label>

			{#if !isSameAsBillingAddress}
				<div transition:slide="{{ duration: 300 }}" class="mb-5 lg:mb-10">
					<h2 class="mb-5">Enter Billing Address</h2>

					<div class="flex flex-col gap-2">
						<!-- First Name -->

						<div class="flex flex-col sm:flex-row gap-2 sm:gap-5">
							<h6 class="sm:w-60 sm:shrink-0">
								First Name

								<span class="text-accent-500">*</span>
							</h6>

							<div class="w-full">
								<Textbox
									type="text"
									placeholder="Enter First Name"
									bind:value="{billing_address.firstName}"
									autoFocus
									required />

								{#if zodErrors?.firstName}<p class="mt-1 text-red-600">
										{zodErrors?.firstName}
									</p>{/if}
							</div>
						</div>

						<!-- Last Name -->

						<div class="flex flex-col sm:flex-row gap-2 sm:gap-5">
							<h6 class="sm:w-60 sm:shrink-0">
								Last Name

								<span class="text-accent-500">*</span>
							</h6>

							<div class="w-full">
								<Textbox
									placeholder="Enter Last Name"
									bind:value="{billing_address.lastName}"
									required />

								{#if zodErrors?.lastName}<p class="mt-1 text-red-600">{zodErrors?.lastName}</p>{/if}
							</div>
						</div>

						<!-- Email -->

						<div class="flex flex-col sm:flex-row gap-2 sm:gap-5">
							<h6 class="sm:w-60 sm:shrink-0">Email <span class="text-accent-500">*</span></h6>

							<div class="w-full">
								<Textbox
									type="email"
									placeholder="Enter Email"
									bind:value="{billing_address.email}"
									required />

								{#if zodErrors?.email}<p class="mt-1 text-red-600">{zodErrors?.email}</p>{/if}
							</div>
						</div>

						<!-- Phone -->

						<div class="flex flex-col sm:flex-row gap-2 sm:gap-5">
							<h6 class="sm:w-60 sm:shrink-0">
								Phone

								<span class="text-accent-500">*</span>
							</h6>

							<div class="w-full">
								<Textbox
									type="tel"
									placeholder="Enter Phone"
									maxlength="17"
									bind:value="{billing_address.phone}"
									on:input="{() => validatePhoneNumber(billing_address.phone, 'billing')}"
									required />

								<!-- <p class="mt-1">E.g.+nnxxxxxxxxxx</p> -->

								{#if showBillingErrorMessage}
									<p id="phone-warning" class="mt-1 text-red-600">
										Please enter vaild phone number
									</p>
								{/if}

								{#if zodErrors?.phone}<p class="mt-1 text-red-600">{zodErrors?.phone}</p>{/if}
							</div>
						</div>

						<!-- Address -->

						<div class="flex flex-col sm:flex-row gap-2 sm:gap-5">
							<h6 class="sm:w-60 sm:shrink-0">
								Address

								<span class="text-accent-500">*</span>
							</h6>

							<div class="w-full">
								<Textarea
									placeholder="Enter Address"
									bind:value="{billing_address.address}"
									required />

								{#if zodErrors?.address}<p class="mt-1 text-red-600">{zodErrors?.address}</p>{/if}
							</div>
						</div>

						<!-- Postal Code/Pincode/Zipcode -->

						<div class="flex flex-col sm:flex-row gap-2 sm:gap-5">
							<h6 class="sm:w-60 sm:shrink-0">
								Postal Code/Pincode/Zipcode

								<span class="text-accent-500">*</span>
							</h6>

							<div class="w-full">
								<Textbox
									type="tel"
									placeholder="Enter Postal Code/Pincode/Zipcode"
									maxlength="6"
									bind:value="{billing_address.zip}"
									on:blur="{() => fetchStateAndCity(billing_address.zip, 'billing')}"
									required />

								{#if zodErrors?.zip}<p class="mt-1 text-red-600">{zodErrors?.zip}</p>{/if}
							</div>
						</div>

						<!-- City -->

						<div class="flex flex-col sm:flex-row gap-2 sm:gap-5">
							<h6 class="sm:w-60 sm:shrink-0">
								City

								<span class="text-accent-500">*</span>
							</h6>

							<div class="w-full">
								<Textbox
									type="text"
									placeholder="Enter City"
									bind:value="{billing_address.city}"
									required />

								{#if zodErrors?.city}<p class="mt-1 text-red-600">{zodErrors?.city}</p>{/if}
							</div>
						</div>

						<!-- State -->

						{#if states?.length}
							<div class="flex flex-col sm:flex-row gap-2 sm:gap-5">
								<h6 class="sm:w-60 sm:shrink-0">
									State/Province

									<span class="text-accent-500">*</span>
								</h6>

								<div class="w-full">
									<select
										class="w-full rounded border border-zinc-200 bg-white p-2 text-sm placeholder-zinc-400 transition duration-300 placeholder:font-normal focus:outline-none focus:ring-1 focus:ring-primary-500 hover:bg-zinc-50"
										bind:value="{billing_address.state}"
										disabled="{!billing_address.country || loadingStates}"
										required>
										<option value="{null}" disabled selected>-- Select a State --</option>
										{#each states as s}
											{#if s}
												<option value="{s.name.toUpperCase()}">
													{s.name}
												</option>
											{/if}
										{/each}
									</select>

									{#if zodErrors?.state}<p class="mt-1 text-red-600">{zodErrors?.state}</p>{/if}
								</div>
							</div>
						{/if}

						<!-- Country -->

						<div class="flex flex-col sm:flex-row gap-2 sm:gap-5">
							<h6 class="sm:w-60 sm:shrink-0">
								Country

								<span class="text-accent-500">*</span>
							</h6>

							<div class="w-full">
								{#if countries?.length}
									<select
										disabled="{countries?.length === 1}"
										class="w-full rounded border border-zinc-200 bg-white p-2 text-sm placeholder-zinc-400 transition duration-300 placeholder:font-normal focus:outline-none focus:ring-1 focus:ring-primary-500 hover:bg-zinc-50"
										bind:value="{billing_address.country}"
										on:change="{() => onCountryChange(billing_address.country)}"
										required>
										<option value="{null}" disabled selected>-- Select a Country --</option>

										{#each countries as c}
											{#if c}
												<option value="{c.code}" selected="{c.default}">
													{c.name}
												</option>
											{/if}
										{/each}
									</select>

									{#if zodErrors?.country}<p class="mt-1 text-red-600">{zodErrors?.country}</p>{/if}
								{:else}
									<a
										href="/contact-us"
										aria-label="contact us"
										class="py-2 text-sm text-zinc-500 hover:text-zinc-800 hover:underline">
										Contact the website admin to enable your country
									</a>
								{/if}
							</div>
						</div>
					</div>
				</div>
			{/if}

			<input type="hidden" name="isSameAsBillingAddress" value="{isSameAsBillingAddress || null}" />
			<input type="hidden" name="billingAddressAddress" value="{billing_address.address || null}" />
			<input type="hidden" name="billingAddressCity" value="{billing_address.city || null}" />
			<input type="hidden" name="billingAddressCountry" value="{billing_address.country || null}" />
			<input type="hidden" name="billingAddressEmail" value="{billing_address.email || null}" />
			<input
				type="hidden"
				name="billingAddressFirstName"
				value="{billing_address.firstName || null}" />
			<input
				type="hidden"
				name="billingAddressId"
				value="{billing_address.id || billing_address._id || null}" />
			<input
				type="hidden"
				name="billingAddressLastName"
				value="{billing_address.lastName || null}" />
			<input type="hidden" name="billingAddressPhone" value="{billing_address.phone || null}" />
			<input type="hidden" name="billingAddressSelectedCountry" value="{selectedCountry || null}" />
			<input type="hidden" name="showBillingErrorMessage" bind:value="{showBillingErrorMessage}" />
			<input type="hidden" name="billingAddressState" value="{billing_address.state || null}" />
			<input type="hidden" name="billingAddressZip" value="{billing_address.zip || null}" />
		{/if}

		<input type="hidden" name="address" value="{shipping_address.address || null}" />
		<input type="hidden" name="city" value="{shipping_address.city || null}" />
		<input type="hidden" name="country" value="{shipping_address.country || null}" />
		<input type="hidden" name="email" value="{shipping_address.email || null}" />
		<input type="hidden" name="firstName" value="{shipping_address.firstName || null}" />
		<input type="hidden" name="id" value="{shipping_address.id || shipping_address._id || null}" />
		<input type="hidden" name="lastName" value="{shipping_address.lastName || null}" />
		<input type="hidden" name="phone" value="{shipping_address.phone || null}" />
		<input type="hidden" name="selectedCountry" value="{selectedCountry || null}" />
		<input type="hidden" name="showErrorMessage" bind:value="{showErrorMessage}" />
		<input type="hidden" name="state" value="{shipping_address.state || null}" />
		<input type="hidden" name="zip" value="{shipping_address.zip || null}" />

		<PrimaryButton
			type="submit"
			{loading}
			disabled="{loading || showErrorMessage}"
			class="{$page.data.me ? 'w-60' : 'w-80'}"
			on:click="{() => (zodErrors = null)}">
			{#if $page.data.me}
				Save Address
			{:else}
				Save and Proceed to Checkout
			{/if}
		</PrimaryButton>
	</form>
</div>
