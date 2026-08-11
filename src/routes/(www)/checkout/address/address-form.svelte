<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js'
	import { Save } from '@lucide/svelte'
	import Textbox from '$lib/components/form/textbox.svelte'
	import LoadingDots from '$lib/core/components/common/loading-dots.svelte'
	import { page } from '$app/state'
	import { AddressSchema } from '$lib/core/components/index.js'
	import { AddressFormRenderer, checkoutAddressSchema } from '$lib/core/composables/index.js'

	let {
		address = $bindable(),
		isLoading = false,
		onsave
	}: {
		address: any
		isLoading?: boolean
		onsave?: (address: any) => void | Promise<void>
	} = $props()
	let show = $state(true)

	const countryCode = $derived(address?.countryCode || page?.data?.store?.country?.code || '')
	const countryName = $derived(page?.data?.store?.countries?.find((c: any) => c.code === countryCode)?.name || countryCode)

	// The country is display-only, so make sure the saved address still carries a code.
	$effect(() => {
		if (address && !address.countryCode && page?.data?.store?.country?.code) {
			address.countryCode = page.data.store.country.code
		}
	})
</script>

<AddressFormRenderer
	bind:address
	bind:show
	{onsave}
>
	{#snippet content({ handleSubmit })}
		<form onsubmit={handleSubmit} class="grid">
			<div class="grid grid-cols-2 gap-2">
				<Textbox
					name="firstName"
					autocomplete="given-name"
					bind:value={address.firstName}
					placeholder="First Name"
					schema={AddressSchema.firstName}
					label="First Name"
					required
				/>
				<Textbox
					name="lastName"
					autocomplete="family-name"
					bind:value={address.lastName}
					placeholder="Last Name"
					schema={AddressSchema.lastName}
					label="Last Name"
					required
				/>
			</div>
			<div class="grid grid-cols-2 gap-2">
				<Textbox
					name="email"
					type="email"
					autocomplete="email"
					bind:value={address.email}
					placeholder="your@email.com"
					schema={checkoutAddressSchema.email}
					label="Email"
					required
				/>
				<Textbox
					name="phone"
					type="tel"
					autocomplete="tel"
					bind:value={address.phone}
					placeholder="+1234567890"
					schema={AddressSchema.phone}
					label="Phone"
					required
				/>
			</div>
			<Textbox
				name="address_1"
				autocomplete="address-line1"
				bind:value={address.address_1}
				placeholder="Street Address"
				schema={AddressSchema.address_1}
				label="Address Line 1"
				required
			/>
			<Textbox
				name="address_2"
				autocomplete="address-line2"
				bind:value={address.address_2}
				placeholder="Apartment, suite, etc."
				label="Address Line 2"
			/>
			<div class="grid grid-cols-2 gap-2">
				<Textbox
					name="city"
					autocomplete="address-level2"
					bind:value={address.city}
					placeholder="City"
					schema={AddressSchema.city}
					label="City"
					required
				/>
				<Textbox
					name="state"
					autocomplete="address-level1"
					bind:value={address.state}
					placeholder="State"
					schema={AddressSchema.state}
					label="State"
					required
				/>
				<div class="flex flex-col justify-center">
					<span class="text-xs uppercase tracking-wide text-gray-500">Country</span>
					<span class="text-sm font-medium text-gray-900">{countryName}</span>
				</div>
				<Textbox
					name="zip"
					autocomplete="postal-code"
					bind:value={address.zip}
					placeholder="12345"
					schema={AddressSchema.zip}
					label="ZIP Code"
					required
				/>
			</div>
			<br />
			<div class="flex flex-col gap-2">
				<!-- No dirty-tracking gate: autofill and paste never fired keyup, so it stranded shoppers.
				     The renderer's zod validation on submit already blocks incomplete addresses. -->
				<Button type="submit" disabled={isLoading} class="w-full">
					{#if isLoading}
						<LoadingDots />
					{:else}
						<Save class="mr-2 h-4 w-4" />
						Save Address
					{/if}
				</Button>
			</div>
		</form>
	{/snippet}
</AddressFormRenderer>
