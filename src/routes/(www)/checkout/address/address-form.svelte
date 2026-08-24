<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js'
	import { Save } from '@lucide/svelte'
	import Textbox from '$lib/components/form/textbox.svelte'
	import LoadingDots from '$lib/core/components/common/loading-dots.svelte'
	import { page } from '$app/state'
	import { AddressSchema } from '$lib/core/components/index.js'
	import { AddressFormRenderer, checkoutAddressSchema } from '$lib/core/composables/index.js'
	import { z } from 'zod'

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

	// The submit path the page's pinned footer drives with `requestSubmit()`.
	export const FORM_ID = 'checkout-address-form'

	// AddressFormRenderer validates with this same schema and reports a failure through
	// `toast.error`. Nothing renders those here, so a rejected field made Save look dead: the submit
	// event fired, validation returned, and the shopper got no clue which field was wrong. Validate
	// first, show it on the form, and put the cursor in the offending field.
	let formError = $state('')
	let formEl = $state<HTMLFormElement | null>(null)

	// `checkoutAddressSchema.email` accepts an empty string, so it cannot carry a store that mandates
	// email — every backend served by the static store config does (see static-store.ts).
	const emailRule = $derived(
		page?.data?.store?.isEmailMandatory
			? z.string().min(1, 'Email address is required').email('Please enter a valid email address')
			: checkoutAddressSchema.email
	)

	function submitWithVisibleErrors(event: Event, handleSubmit: (e: Event) => void) {
		event.preventDefault()
		// A field the shopper has never touched comes back as null, not '', and zod then reports
		// "Expected string, received null" instead of the rule's own message. Normalise first.
		const candidate = Object.fromEntries(
			Object.keys({ ...AddressSchema, email: emailRule }).map((key) => [key, (address as Record<string, unknown>)?.[key] ?? ''])
		)
		candidate.countryCode = address?.countryCode || page?.data?.store?.country?.code || ''
		const result = z.object({ ...AddressSchema, email: emailRule }).safeParse(candidate)
		if (!result.success) {
			const issue = result.error.errors[0]
			formError = issue?.message || 'Please fill in every required field correctly.'
			const field = issue?.path?.[0]
			const el = field ? (formEl?.querySelector(`[name="${field}"]`) as HTMLElement | null) : null
			el?.scrollIntoView({ block: 'center', behavior: 'smooth' })
			el?.focus()
			return
		}
		formError = ''
		handleSubmit(event)
	}

	// Whatever `onsave` throws — the backend rejecting the customer, a failed cart update — used to
	// reach the shopper only as a toast. Show it on the form too, so a failed save can never look
	// like a dead button again.
	async function saveAndReportFailure(saved: any) {
		try {
			await onsave?.(saved)
		} catch (e) {
			formError = e instanceof Error ? e.message : 'Could not save this address. Please try again.'
		}
	}

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
	onsave={saveAndReportFailure}
>
	{#snippet content({ handleSubmit })}
		<!-- novalidate: the footer submits this form with `requestSubmit()`, and native constraint
		     validation would abort before the submit event fires, pinning its bubble to whichever
		     field is off-screen. The zod pass below is the single authority and reports on the form. -->
		<form
			id={FORM_ID}
			bind:this={formEl}
			novalidate
			onsubmit={(e) => submitWithVisibleErrors(e, handleSubmit)}
			class="grid"
		>
			<div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
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
			<div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
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
			<div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
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
					inputmode="numeric"
					bind:value={address.zip}
					placeholder="12345"
					schema={AddressSchema.zip}
					label="ZIP Code"
					required
				/>
			</div>
			<br />
			{#if formError}
				<p role="alert" class="mb-3 rounded-radius border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm font-medium text-destructive">
					{formError}
				</p>
			{/if}
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
