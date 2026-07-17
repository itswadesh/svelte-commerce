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
	let hasChanged = $state(false)

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
	onsave={async (address: any) => {
		await onsave?.(address)
		hasChanged = false
	}}
>
	{#snippet content({ handleSubmit })}
		<form onsubmit={handleSubmit} class="grid">
			<div class="grid grid-cols-2 gap-2">
				<Textbox
					name="firstName"
					bind:value={address.firstName}
					placeholder="First Name"
					schema={AddressSchema.firstName}
					label="First Name"
					onkeyup={() => (hasChanged = true)}
					required
				/>
				<Textbox
					name="lastName"
					bind:value={address.lastName}
					placeholder="Last Name"
					schema={AddressSchema.lastName}
					label="Last Name"
					onkeyup={() => (hasChanged = true)}
					required
				/>
			</div>
			<div class="grid grid-cols-2 gap-2">
				<Textbox
					name="email"
					type="email"
					bind:value={address.email}
					placeholder="your@email.com"
					schema={checkoutAddressSchema.email}
					label="Email"
					onkeyup={() => (hasChanged = true)}
					required
				/>
				<Textbox
					name="phone"
					type="tel"
					bind:value={address.phone}
					placeholder="+1234567890"
					schema={AddressSchema.phone}
					label="Phone"
					onkeyup={() => (hasChanged = true)}
					required
				/>
			</div>
			<Textbox
				name="address_1"
				bind:value={address.address_1}
				placeholder="Street Address"
				schema={AddressSchema.address_1}
				label="Address Line 1"
				onkeyup={() => (hasChanged = true)}
				required
			/>
			<Textbox
				name="address_2"
				bind:value={address.address_2}
				placeholder="Apartment, suite, etc."
				label="Address Line 2"
				onkeyup={() => (hasChanged = true)}
			/>
			<div class="grid grid-cols-2 gap-2">
				<Textbox name="city" bind:value={address.city} placeholder="City" schema={AddressSchema.city} label="City" onkeyup={() => (hasChanged = true)} required />
				<Textbox
					name="state"
					bind:value={address.state}
					placeholder="State"
					schema={AddressSchema.state}
					label="State"
					onkeyup={() => (hasChanged = true)}
					required
				/>
				<div class="flex flex-col justify-center">
					<span class="text-xs uppercase tracking-wide text-gray-500">Country</span>
					<span class="text-sm font-medium text-gray-900">{countryName}</span>
				</div>
				<Textbox
					name="zip"
					bind:value={address.zip}
					placeholder="12345"
					schema={AddressSchema.zip}
					label="ZIP Code"
					onkeyup={() => (hasChanged = true)}
					required
				/>
			</div>
			<br />
			<div class="flex flex-col gap-2">
				<Button type="submit" disabled={!hasChanged || isLoading} class="w-full">
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
