<script>
	import { applyAction, enhance } from '$app/forms'
	import { onMount } from 'svelte'
	import { goto, invalidateAll } from '$app/navigation'
	import { page } from '$app/state'
	import { countryService, zipService } from '$lib/core/services'
	import { slide } from 'svelte/transition'
	import { Button } from '$lib/components/ui/button'

	const IS_DEV = import.meta.env.DEV

	let {
		billing_address = {},
		countries = [],
		editAddress = false,
		selectedAddress = '',
		selectedBillingAddress = '',
		shipping_address = {}
	} = $props()

	if (!shipping_address?.firstName) {
		shipping_address = IS_DEV
			? {
					address: 'Test address',
					city: 'Test city',
					country: 'IN',
					email: 'test@email.com',
					firstName: 'Test first name',
					id: 'new',
					lastName: 'Test last name',
					phone: '1111111111',
					state: 'GOA',
					zip: '111111'
				}
			: { id: 'new' }
	}

	shipping_address.zip = shipping_address.zip || shipping_address.pincode || ''
	shipping_address.phone = shipping_address.phone || page?.data?.me?.phone || ''

	billing_address.zip = billing_address.zip || billing_address.pincode || ''
	billing_address.phone = billing_address.phone || page?.data?.me?.phone || ''

	let err = $state(null)
	let isSameAsBillingAddress = $state(true)

	// Shipping variables
	let loadingForShippingAddressStates = $state(false)
	let selectedShippingAddressCountry = $state({})
	let shippingAddressStates = $state([])
	let showShippingAddressErrorMessage = $state(false)
	let zodShippingErrors = $state(null)

	// Billing variables
	let billingAddressStates = $state([])
	let loadingForBillingAddressStates = $state(false)
	let selectedBillingAddressCountry = $state({})
	let showBillingAddressErrorMessage = $state(false)
	let zodBillingErrors = $state(null)

	onMount(async () => {
		await invalidateAll()

		// If only country is available then make it shipping and billing address country
		if (countries?.length === 1) {
			shipping_address.country = countries[0].code
			billing_address.country = countries[0].code
		} else if (countries?.length > 1) {
			const dafaultCountry = countries.filter((c) => {
				return c.dafault
			})

			if (dafaultCountry[0]) {
				shipping_address.country = dafaultCountry[0].code
				billing_address.country = dafaultCountry[0].code
			}
		}

		if (shipping_address.country) {
			fetchShippingAddressStates(shipping_address.country)
			getShippingAddressSelectedCountry()
		}

		if (billing_address.country) {
			fetchBillingAddressStates(shipping_address.country)
			getBillingAddressSelectedCountry()
		}

		// Checks is the shipping address and billing address same or not
		if (shipping_address && billing_address && shipping_address.address === billing_address.address && shipping_address.zip === billing_address.zip) {
			isSameAsBillingAddress = true
		} else if (!billing_address.firstName) {
			isSameAsBillingAddress = true
		} else {
			isSameAsBillingAddress = false
		}
	})

	function getShippingAddressSelectedCountry() {
		selectedShippingAddressCountry = countries.filter((c) => {
			if (c.code === shipping_address.country) {
				return c
			}
		})[0]
	}

	function getBillingAddressSelectedCountry() {
		selectedBillingAddressCountry = countries.filter((c) => {
			if (c.code === shipping_address.country) {
				return c
			}
		})[0]
	}

	async function onShippingAddressCountryChange(country) {
		shipping_address.state = null
		fetchShippingAddressStates(country)
		getShippingAddressSelectedCountry()
	}

	async function onBillingAddressCountryChange(country) {
		billing_address.state = null
		fetchBillingAddressStates(country)
		getBillingAddressSelectedCountry()
	}

	async function fetchShippingAddressStates(country) {
		try {
			err = null
			loadingForShippingAddressStates = true

			shippingAddressStates = await countryService.fetchStates({
				countryCode: country,
				storeId: page.data.storeId,
				origin: page.data?.origin
			})

			shippingAddressStates = shippingAddressStates.map((s) => {
				s.name = s.name.toUpperCase()
				return s
			})
		} catch (e) {
			err = e
		} finally {
			loadingForShippingAddressStates = false
		}
	}

	async function fetchBillingAddressStates(country) {
		try {
			err = null
			loadingForBillingAddressStates = true

			billingAddressStates = await countryService.fetchStates({
				countryCode: country,
				storeId: page.data.storeId,
				origin: page.data?.origin
			})

			billingAddressStates = billingAddressStates.map((s) => {
				s.name = s.name.toUpperCase()
				return s
			})
		} catch (e) {
			err = e
		} finally {
			loadingForBillingAddressStates = false
		}
	}

	async function fetchStateAndCity(zip, addresstype) {
		if (zip.length != 6) {
			toast('Please enter 6 digit code', 'error')
			return
		}

		try {
			err = null
			loadingForShippingAddressStates = true
			loadingForBillingAddressStates = true

			let { city, state } = shipping_address

			const zipInfo = await zipService.findZip({
				zip,
				origin
			})

			if (addresstype === 'shipping') {
				shipping_address.city = zipInfo.District || ''
				shipping_address.state = zipInfo.StateName || ''
			} else if (addresstype === 'billing') {
				billing_address.city = zipInfo.District || ''
				billing_address.state = zipInfo.StateName || ''
			}
		} catch (e) {
			err = e
			toast(e.message.error, 'error')
		} finally {
			loadingForShippingAddressStates = false
			loadingForBillingAddressStates = false
		}
	}

	function validatePhoneNumber(phoneNumber, addresstype) {
		if (page.data.store?.storeCountry?.code === 'IN') {
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
				if (addresstype === 'shipping') {
					showShippingAddressErrorMessage = false
				} else if (addresstype === 'billing') {
					showBillingAddressErrorMessage = false
				}

				return true
			}

			if (addresstype === 'shipping') {
				showShippingAddressErrorMessage = true
			} else if (addresstype === 'billing') {
				showBillingAddressErrorMessage = true
			}

			return false
		} else {
			return true
		}
	}
</script>

<div>
	<Error {err} class="mb-5" />

	<form
		action={!shipping_address.id || shipping_address.id === 'new' ? '/my/addresses?/saveAddress' : '/my/addresses?/editAddress'}
		method="POST"
		use:enhance={() => {
			return async ({ result }) => {
				// console.log('result', result)

				if (result?.status === 200 && result?.data) {
					const newAddressId = result.data?._id || result.data?.id
					toast('Address saved successfully', 'success')

					selectedBillingAddress = newAddressId
					selectedAddress = newAddressId

					await applyAction(result)
					editAddress = false

					if (page?.data.me) {
						await invalidateAll()
					}

					if (!page?.url?.pathname.includes('checkout')) {
						goto(`/my/addresses?sort=-updatedAt`)
					} else if (!page?.data.me) {
						goto(`/checkout/payment-options?address=${newAddressId}`)
					}
				} else if (result?.error) {
					shipping_address.phone = ''
					zodShippingErrors = result?.error?.errors || null
					zodBillingErrors = result?.error?.billing_errors || null
					err = result?.error?.message || null
					// toast(result?.error?.message, 'error')
				}
			}
		}}
	>
		<!-- <form on:submit|preventDefault="{() => SaveAddress(refinedAddress)}"> -->
		<div class="mb-5 flex flex-col gap-2 lg:mb-10">
			<!-- First Name -->

			<div class="flex flex-col gap-2 sm:flex-row sm:gap-5">
				<h6 class="sm:w-60 sm:shrink-0">
					First Name

					<span class="text-accent-500">*</span>
				</h6>

				<div class="w-full">
					<Textbox type="text" placeholder="Enter First Name" bind:value={shipping_address.firstName} autoFocus required />

					{#if zodShippingErrors?.firstName}<p class="mt-1 text-xs text-red-600">
							{zodShippingErrors?.firstName}
						</p>{/if}
				</div>
			</div>

			<!-- Last Name -->

			<div class="flex flex-col gap-2 sm:flex-row sm:gap-5">
				<h6 class="sm:w-60 sm:shrink-0">
					Last Name

					<span class="text-accent-500">*</span>
				</h6>

				<div class="w-full">
					<Textbox placeholder="Enter Last Name" bind:value={shipping_address.lastName} required />

					{#if zodShippingErrors?.lastName}<p class="mt-1 text-xs text-red-600">
							{zodShippingErrors?.lastName}
						</p>{/if}
				</div>
			</div>

			<!-- Email -->

			<div class="flex flex-col gap-2 sm:flex-row sm:gap-5">
				<h6 class="sm:w-60 sm:shrink-0">Email <span class="text-accent-500">*</span></h6>

				<div class="w-full">
					<Textbox type="email" placeholder="Enter Email" bind:value={shipping_address.email} required />

					{#if zodShippingErrors?.email}<p class="mt-1 text-xs text-red-600">
							{zodShippingErrors?.email}
						</p>{/if}
				</div>
			</div>

			<!-- Phone -->

			<div class="flex flex-col gap-2 sm:flex-row sm:gap-5">
				<h6 class="sm:w-60 sm:shrink-0">
					Phone

					<span class="text-accent-500">*</span>
				</h6>

				<div class="w-full">
					<Textbox
						type="tel"
						placeholder="Enter Phone"
						maxlength="17"
						bind:value={shipping_address.phone}
						oninput={() => validatePhoneNumber(shipping_address.phone, 'shipping')}
						required
					/>

					<!-- <p class="mt-1">E.g.+nnxxxxxxxxxx</p> -->

					{#if showShippingAddressErrorMessage}
						<p id="phone-warning" class="mt-1 text-red-600">Please enter vaild phone number</p>
					{/if}

					{#if zodShippingErrors?.phone}<p class="mt-1 text-xs text-red-600">
							{zodShippingErrors?.phone}
						</p>{/if}
				</div>
			</div>

			<!-- Address -->

			<div class="flex flex-col gap-2 sm:flex-row sm:gap-5">
				<h6 class="sm:w-60 sm:shrink-0">
					Address

					<span class="text-accent-500">*</span>
				</h6>

				<div class="w-full">
					<Textarea placeholder="Enter Address" bind:value={shipping_address.address} required />

					{#if zodShippingErrors?.address}
						<p class="mt-1 text-xs text-red-600">
							{zodShippingErrors?.address}
						</p>
					{/if}
				</div>
			</div>

			<!-- Postal Code/Pincode/Zipcode -->

			<div class="flex flex-col gap-2 sm:flex-row sm:gap-5">
				<h6 class="sm:w-60 sm:shrink-0">
					Postal Code/Pincode/Zipcode

					<span class="text-accent-500">*</span>
				</h6>

				<div class="w-full">
					{#if shipping_address.country === 'IN'}
						<Textbox
							type="tel"
							placeholder="Enter Postal Code/Pincode/Zipcode"
							maxlength="6"
							bind:value={shipping_address.zip}
							on:blur={() => fetchStateAndCity(shipping_address.zip, 'shipping')}
							required
						/>
					{:else if shipping_address.country === 'GB'}
						<Textbox type="text" placeholder="Enter Postal Code/Pincode/Zipcode" maxlength="7" bind:value={shipping_address.zip} required />
					{:else}
						<Textbox type="tel" placeholder="Enter Postal Code/Pincode/Zipcode" bind:value={shipping_address.zip} required />
					{/if}

					{#if zodShippingErrors?.zip}<p class="mt-1 text-xs text-red-600">
							{zodShippingErrors?.zip}
						</p>{/if}
				</div>
			</div>

			<!-- City -->

			<div class="flex flex-col gap-2 sm:flex-row sm:gap-5">
				<h6 class="sm:w-60 sm:shrink-0">
					City

					<span class="text-accent-500">*</span>
				</h6>

				<div class="w-full">
					<Textbox type="text" placeholder="Enter City" bind:value={shipping_address.city} required />

					{#if zodShippingErrors?.city}<p class="mt-1 text-xs text-red-600">
							{zodShippingErrors?.city}
						</p>{/if}
				</div>
			</div>

			<!-- State -->

			{#if shippingAddressStates?.length}
				<div class="flex flex-col gap-2 sm:flex-row sm:gap-5">
					<h6 class="sm:w-60 sm:shrink-0">
						State/Province

						<span class="text-accent-500">*</span>
					</h6>

					<div class="w-full">
						<select
							class="w-full rounded border border-zinc-200 bg-white p-2 text-sm placeholder-zinc-400 transition duration-300 placeholder:font-normal hover:bg-zinc-50 focus:outline-none focus:ring-1 focus:ring-zinc-500"
							bind:value={shipping_address.state}
							disabled={!shipping_address.country || loadingForShippingAddressStates}
							required
						>
							<option value={null} disabled selected>-- Select a State --</option>
							{#each shippingAddressStates as s}
								{#if s}
									<option value={s.name.toUpperCase()}>
										{s.name}
									</option>
								{/if}
							{/each}
						</select>

						{#if zodShippingErrors?.state}<p class="mt-1 text-xs text-red-600">
								{zodShippingErrors?.state}
							</p>{/if}
					</div>
				</div>
			{/if}

			<!-- Country -->

			<div class="flex flex-col gap-2 sm:flex-row sm:gap-5">
				<h6 class="sm:w-60 sm:shrink-0">
					Country

					<span class="text-accent-500">*</span>
				</h6>

				<div class="w-full">
					{#if countries?.length}
						<select
							disabled={countries?.length === 1}
							class="w-full rounded border border-zinc-200 bg-white p-2 text-sm placeholder-zinc-400 transition duration-300 placeholder:font-normal hover:bg-zinc-50 focus:outline-none focus:ring-1 focus:ring-zinc-500"
							bind:value={shipping_address.country}
							onchange={() => onShippingAddressCountryChange(shipping_address.country)}
							required
						>
							<option value={null} disabled selected>-- Select a Country --</option>

							{#each countries as c}
								{#if c}
									<option value={c.code} selected={c.default}>
										{c.name}
									</option>
								{/if}
							{/each}
						</select>

						{#if zodShippingErrors?.country}<p class="mt-1 text-xs text-red-600">
								{zodShippingErrors?.country}
							</p>{/if}
					{:else}
						<a href="/contact-us" aria-label="contact us" class="py-2 text-sm text-zinc-500 hover:text-zinc-800 hover:underline">
							Contact the website admin to enable your country
						</a>
					{/if}
				</div>
			</div>
		</div>

		<!-- Billing address for guest checkout -->

		{#if page.data.store?.b2b && page.data.store?.b2b?.allowDifferentBillingAddress && page.data.store?.b2b?.allowDifferentBillingAddress?.val === true}
			<label class="mb-5 flex items-center gap-2 text-lg font-semibold lg:mb-10">
				<input type="checkbox" class="h-5 w-5" bind:checked={isSameAsBillingAddress} />

				<span>Same as billing address</span>
			</label>

			{#if !isSameAsBillingAddress}
				<div transition:slide={{ duration: 300 }} class="mb-5 lg:mb-10">
					<h2 class="mb-5">Enter Billing Address</h2>

					<div class="flex flex-col gap-2">
						<!-- First Name -->

						<div class="flex flex-col gap-2 sm:flex-row sm:gap-5">
							<h6 class="sm:w-60 sm:shrink-0">
								First Name

								<span class="text-accent-500">*</span>
							</h6>

							<div class="w-full">
								<Textbox type="text" placeholder="Enter First Name" bind:value={billing_address.firstName} autoFocus required />

								{#if zodBillingErrors?.firstName}
									<p class="mt-1 text-xs text-red-600">
										{zodBillingErrors?.firstName}
									</p>
								{/if}
							</div>
						</div>

						<!-- Last Name -->

						<div class="flex flex-col gap-2 sm:flex-row sm:gap-5">
							<h6 class="sm:w-60 sm:shrink-0">
								Last Name

								<span class="text-accent-500">*</span>
							</h6>

							<div class="w-full">
								<Textbox placeholder="Enter Last Name" bind:value={billing_address.lastName} required />

								{#if zodBillingErrors?.lastName}
									<p class="mt-1 text-xs text-red-600">
										{zodBillingErrors?.lastName}
									</p>
								{/if}
							</div>
						</div>

						<!-- Email -->

						<div class="flex flex-col gap-2 sm:flex-row sm:gap-5">
							<h6 class="sm:w-60 sm:shrink-0">Email <span class="text-accent-500">*</span></h6>

							<div class="w-full">
								<Textbox type="email" placeholder="Enter Email" bind:value={billing_address.email} required />

								{#if zodBillingErrors?.email}
									<p class="mt-1 text-xs text-red-600">
										{zodBillingErrors?.email}
									</p>
								{/if}
							</div>
						</div>

						<!-- Phone -->

						<div class="flex flex-col gap-2 sm:flex-row sm:gap-5">
							<h6 class="sm:w-60 sm:shrink-0">
								Phone

								<span class="text-accent-500">*</span>
							</h6>

							<div class="w-full">
								<Textbox
									type="tel"
									placeholder="Enter Phone"
									maxlength="17"
									bind:value={billing_address.phone}
									oninput={() => validatePhoneNumber(billing_address.phone, 'billing')}
									required
								/>

								<!-- <p class="mt-1">E.g.+nnxxxxxxxxxx</p> -->

								{#if showBillingAddressErrorMessage}
									<p id="phone-warning" class="mt-1 text-red-600">Please enter vaild phone number</p>
								{/if}

								{#if zodBillingErrors?.phone}
									<p class="mt-1 text-xs text-red-600">{zodBillingErrors?.phone}</p>
								{/if}
							</div>
						</div>

						<!-- Address -->

						<div class="flex flex-col gap-2 sm:flex-row sm:gap-5">
							<h6 class="sm:w-60 sm:shrink-0">
								Address

								<span class="text-accent-500">*</span>
							</h6>

							<div class="w-full">
								<Textarea placeholder="Enter Address" bind:value={billing_address.address} required />

								{#if zodBillingErrors?.address}
									<p class="mt-1 text-xs text-red-600">{zodBillingErrors?.address}</p>
								{/if}
							</div>
						</div>

						<!-- Postal Code/Pincode/Zipcode -->

						<div class="flex flex-col gap-2 sm:flex-row sm:gap-5">
							<h6 class="sm:w-60 sm:shrink-0">
								Postal Code/Pincode/Zipcode

								<span class="text-accent-500">*</span>
							</h6>

							<div class="w-full">
								{#if billing_address.country === 'IN'}
									<Textbox
										type="tel"
										placeholder="Enter Postal Code/Pincode/Zipcode"
										maxlength="6"
										bind:value={billing_address.zip}
										on:blur={() => fetchStateAndCity(billing_address.zip, 'shipping')}
										required
									/>
								{:else if billing_address.country === 'GB'}
									<Textbox type="text" placeholder="Enter Postal Code/Pincode/Zipcode" maxlength="7" bind:value={billing_address.zip} required />
								{:else}
									<Textbox type="tel" placeholder="Enter Postal Code/Pincode/Zipcode" bind:value={billing_address.zip} required />
								{/if}

								{#if zodBillingErrors?.zip}
									<p class="mt-1 text-xs text-red-600">{zodBillingErrors?.zip}</p>
								{/if}
							</div>
						</div>

						<!-- City -->

						<div class="flex flex-col gap-2 sm:flex-row sm:gap-5">
							<h6 class="sm:w-60 sm:shrink-0">
								City

								<span class="text-accent-500">*</span>
							</h6>

							<div class="w-full">
								<Textbox type="text" placeholder="Enter City" bind:value={billing_address.city} required />

								{#if zodBillingErrors?.city}
									<p class="mt-1 text-xs text-red-600">{zodBillingErrors?.city}</p>
								{/if}
							</div>
						</div>

						<!-- State -->

						{#if billingAddressStates?.length}
							<div class="flex flex-col gap-2 sm:flex-row sm:gap-5">
								<h6 class="sm:w-60 sm:shrink-0">
									State/Province

									<span class="text-accent-500">*</span>
								</h6>

								<div class="w-full">
									<select
										class="w-full rounded border border-zinc-200 bg-white p-2 text-sm placeholder-zinc-400 transition duration-300 placeholder:font-normal hover:bg-zinc-50 focus:outline-none focus:ring-1 focus:ring-zinc-500"
										bind:value={billing_address.state}
										disabled={!billing_address.country || loadingForBillingAddressStates}
										required
									>
										<option value={null} disabled selected>-- Select a State --</option>
										{#each billingAddressStates as s}
											{#if s}
												<option value={s.name.toUpperCase()}>
													{s.name}
												</option>
											{/if}
										{/each}
									</select>

									{#if zodBillingErrors?.state}
										<p class="mt-1 text-xs text-red-600">{zodBillingErrors?.state}</p>
									{/if}
								</div>
							</div>
						{/if}

						<!-- Country -->

						<div class="flex flex-col gap-2 sm:flex-row sm:gap-5">
							<h6 class="sm:w-60 sm:shrink-0">
								Country

								<span class="text-accent-500">*</span>
							</h6>

							<div class="w-full">
								{#if countries?.length}
									<select
										disabled={countries?.length === 1}
										class="w-full rounded border border-zinc-200 bg-white p-2 text-sm placeholder-zinc-400 transition duration-300 placeholder:font-normal hover:bg-zinc-50 focus:outline-none focus:ring-1 focus:ring-zinc-500"
										bind:value={billing_address.country}
										onchange={() => onBillingAddressCountryChange(billing_address.country)}
										required
									>
										<option value={null} disabled selected>-- Select a Country --</option>

										{#each countries as c}
											{#if c}
												<option value={c.code} selected={c.default}>
													{c.name}
												</option>
											{/if}
										{/each}
									</select>

									{#if zodBillingErrors?.country}
										<p class="mt-1 text-xs text-red-600">{zodBillingErrors?.country}</p>
									{/if}
								{:else}
									<a href="/contact-us" aria-label="contact us" class="py-2 text-sm text-zinc-500 hover:text-zinc-800 hover:underline">
										Contact the website admin to enable your country
									</a>
								{/if}
							</div>
						</div>
					</div>
				</div>
			{/if}

			<input type="hidden" name="isSameAsBillingAddress" value={isSameAsBillingAddress || null} />
			<input type="hidden" name="billingAddressAddress" value={billing_address.address || null} />
			<input type="hidden" name="billingAddressCity" value={billing_address.city || null} />
			<input type="hidden" name="billingAddressCountry" value={billing_address.country || null} />
			<input type="hidden" name="billingAddressEmail" value={billing_address.email || null} />
			<input type="hidden" name="billingAddressFirstName" value={billing_address.firstName || null} />
			<input type="hidden" name="billingAddressLastName" value={billing_address.lastName || null} />
			<input type="hidden" name="billingAddressPhone" value={billing_address.phone || null} />
			<input type="hidden" name="selectedBillingAddressCountry" value={JSON.stringify(selectedBillingAddressCountry) || null} />
			<input type="hidden" name="showBillingAddressErrorMessage" bind:value={showBillingAddressErrorMessage} />
			<input type="hidden" name="billingAddressState" value={billing_address.state || null} />
			<input type="hidden" name="billingAddressZip" value={billing_address.zip || null} />
		{/if}

		<input type="hidden" name="address" value={shipping_address.address || null} />
		<input type="hidden" name="city" value={shipping_address.city || null} />
		<input type="hidden" name="country" value={shipping_address.country || null} />
		<input type="hidden" name="email" value={shipping_address.email || null} />
		<input type="hidden" name="firstName" value={shipping_address.firstName || null} />
		<input type="hidden" name="id" value={shipping_address.id || shipping_address._id || null} />
		<input type="hidden" name="lastName" value={shipping_address.lastName || null} />
		<input type="hidden" name="phone" value={shipping_address.phone || null} />
		<input type="hidden" name="selectedShippingAddressCountry" value={JSON.stringify(selectedShippingAddressCountry) || null} />
		<input type="hidden" name="showShippingAddressErrorMessage" bind:value={showShippingAddressErrorMessage} />
		<input type="hidden" name="state" value={shipping_address.state || null} />
		<input type="hidden" name="zip" value={shipping_address.zip || null} />

		<Button
			type="submit"
			disabled={showShippingAddressErrorMessage || showBillingAddressErrorMessage}
			class={page.data.me ? 'w-60' : 'w-80'}
			onclick={() => (zodShippingErrors = null)}
		>
			{#if page.data.me}
				Save Address
			{:else}
				Save and Proceed to Checkout
			{/if}
		</Button>
	</form>
</div>
