<script lang="ts">
	import { AlertCircle, Check, LoaderCircle } from '@lucide/svelte'
	import { fade } from '$lib/motion'
	import Textbox from '$lib/components/form/textbox.svelte'
	import { page } from '$app/state'
	import { AddressSchema } from '$lib/core/components/index.js'
	import { AddressFormRenderer, checkoutAddressSchema } from '$lib/core/composables/index.js'
	import { z } from 'zod'
	import * as Select from '$lib/components/ui/select/index.js'
	import { Label } from '$lib/components/ui/label/index.js'
	import PinAutofill from '$lib/components/address/pin-autofill.svelte'
	import { tidyPhone } from '$lib/utils/phone'

	let {
		address = $bindable(),
		isLoading = false,
		detailsOnly = false,
		pickup = false,
		autosave = false,
		onsave
	}: {
		/** Collected from the shop (GoCommerce D271): only the name, email and phone are asked. */
		pickup?: boolean
		/**
		 * Save the address by itself once it is complete, with no button. The one-page checkout needs
		 * it on the engine's cart before delivery rates, COD and the payment methods can be worked out,
		 * and a separate Save step there was one more thing to tap (merchant request, 2026-11-28).
		 */
		autosave?: boolean
		address: any
		isLoading?: boolean
		/**
		 * A basket of downloads (GoCommerce D254): nothing is posted, so only the buyer's name,
		 * contact, state and country are asked — the state because tax and a GST invoice are worked
		 * out from it. No street, city or PIN code is invented to fill the gap.
		 */
		detailsOnly?: boolean
		onsave?: (address: any, opts?: { auto?: boolean }) => void | Promise<void>
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

	// Every rejected field, not just the first one. Reporting `errors[0]` alone made an empty form a
	// guessing game: submit, fix one field, submit again, nine times over, with the single message
	// stranded below the fold (UX-082). The shared textbox renders an externally supplied error
	// straight away, so each field now carries its own.
	let fieldErrors = $state<Record<string, string>>({})

	const errorCount = $derived(Object.keys(fieldErrors).length)
	const summary = (errors: Record<string, string>) => {
		const values = Object.values(errors)
		if (!values.length) return ''
		return values.length === 1 ? values[0] : `Please correct the ${values.length} highlighted fields below.`
	}

	// A banner that is only cleared on a successful submit keeps naming a field the shopper has
	// already fixed, and contradicts the live field errors beside it. Input events bubble, so one
	// handler on the form clears whichever field was just corrected.
	function clearErrorOnInput(event: Event) {
		const name = (event.target as HTMLInputElement | null)?.name
		if (!name || !fieldErrors[name]) return
		const next = { ...fieldErrors }
		delete next[name]
		fieldErrors = next
		formError = summary(next)
	}

	// `checkoutAddressSchema.email` accepts an empty string, so it cannot carry a store that mandates
	// email — every backend served by the static store config does (see static-store.ts).
	const emailRule = $derived(
		page?.data?.store?.isEmailMandatory
			? z.string().min(1, 'Email address is required').email('Please enter a valid email address')
			: checkoutAddressSchema.email
	)

	const POSTAL_FIELDS = ['address_1', 'address_2', 'zip', 'city']
	const CONTACT_FIELDS = ['firstName', 'lastName', 'email', 'phone']
	// Details alone go straight to the page's save, without the renderer's postal checks.
	const short = $derived(detailsOnly || pickup)
	// The shared rule wants bare digits; a shopper's spaces, dashes or leading 0 are tidied away
	// before it looks, and the tidied number is what is saved.
	const phoneRule = z.preprocess(tidyPhone, AddressSchema.phone)
	const rules = $derived(
		Object.fromEntries(
			Object.entries({ ...AddressSchema, phone: phoneRule, email: emailRule }).filter(([key]) =>
				pickup ? CONTACT_FIELDS.includes(key) : !detailsOnly || !POSTAL_FIELDS.includes(key)
			)
		)
	)

	// A field the shopper has never touched comes back as null, not '', and zod then reports
	// "Expected string, received null" instead of the rule's own message. Normalise first.
	function candidateOf(): Record<string, unknown> {
		const candidate: Record<string, unknown> = Object.fromEntries(
			Object.keys(rules).map((key) => [key, (address as Record<string, unknown>)?.[key] ?? ''])
		)
		candidate.countryCode = address?.countryCode || page?.data?.store?.country?.code || ''
		return candidate
	}

	// Autosave: quiet while the shopper is still typing (no field errors for a half-filled form), and
	// only once every rule the submit path checks passes, the renderer's own included, so it never
	// saves what the footer button would refuse. The same address is not sent twice; a failed save is
	// shown on the form and retried on the next change, not in a loop.
	const AUTOSAVE_MS = 800
	let lastAutosaved = ''

	function saveQuietly() {
		if (!autosave || isLoading || !address) return
		const candidate = candidateOf()
		const key = JSON.stringify(candidate)
		if (key === lastAutosaved || !z.object(rules).safeParse(candidate).success) return
		if (!short && !z.object(AddressSchema).safeParse({ ...address, phone: tidyPhone(address.phone), countryCode: candidate.countryCode }).success)
			return
		lastAutosaved = key
		if (address.phone) address.phone = tidyPhone(address.phone)
		address.countryCode = candidate.countryCode
		saveAndReportFailure(address, true)
	}

	// Typing, pasting, browser autofill and the PIN code filling the city all land here; leaving a
	// field saves straight away (onfocusout below), so a tap on Place order never races the timer.
	$effect(() => {
		if (!autosave || isLoading) return
		if (JSON.stringify(candidateOf()) === lastAutosaved) return
		const timer = setTimeout(saveQuietly, AUTOSAVE_MS)
		return () => clearTimeout(timer)
	})

	function submitWithVisibleErrors(event: Event, handleSubmit: (e: Event) => void) {
		event.preventDefault()
		if (address?.phone) address.phone = tidyPhone(address.phone)
		const candidate = candidateOf()
		const result = z.object(rules).safeParse(candidate)
		if (!result.success) {
			const next: Record<string, string> = {}
			for (const issue of result.error.errors) {
				const field = String(issue?.path?.[0] ?? '')
				if (field && !next[field]) next[field] = issue.message
			}
			fieldErrors = next
			formError = summary(next) || 'Please fill in every required field correctly.'
			const first = Object.keys(next)[0]
			const el = first
				? (formEl?.querySelector(`[name="${first}"], #${first === 'countryCode' ? 'country-code' : first}`) as HTMLElement | null)
				: null
			el?.scrollIntoView({ block: 'center', behavior: 'smooth' })
			el?.focus()
			return
		}
		fieldErrors = {}
		formError = ''
		// The renderer would hold the address to every postal field again; details alone go straight on.
		if (short) {
			if (detailsOnly) address.countryCode = candidate.countryCode
			saveAndReportFailure(address)
			return
		}
		handleSubmit(event)
	}

	// Whatever `onsave` throws — the backend rejecting the customer, a failed cart update — used to
	// reach the shopper only as a toast. Show it on the form too, so a failed save can never look
	// like a dead button again.
	// With no button, the shopper still sees the address go: a quiet line under the form.
	let autosaved = $state<'' | 'saving' | 'saved'>('')

	async function saveAndReportFailure(saved: any, auto = false) {
		if (autosave) autosaved = 'saving'
		try {
			await onsave?.(saved, { auto })
			if (autosave) autosaved = 'saved'
		} catch (e) {
			autosaved = ''
			fieldErrors = {}
			formError = e instanceof Error ? e.message : 'Could not save this address. Please try again.'
		}
	}

	const countryCode = $derived(address?.countryCode || page?.data?.store?.country?.code || '')
	const countryName = $derived(page?.data?.store?.countries?.find((c: any) => c.code === countryCode)?.name || countryCode)

	// The store's own list. A single-country store keeps the read-only treatment.
	const countries = $derived(
		[...(page?.data?.store?.countries ?? [])].filter((c: any) => c?.code && c?.name).sort((a: any, b: any) => a.name.localeCompare(b.name))
	)

	// India's postcode is a PIN code, and it comes first: six digits fill the city and state
	// (GoCommerce D134), which only helps if they have not been typed already.
	const isIndia = $derived(countryCode.toUpperCase() === 'IN')

	// Seed the code so a shopper who never opens the select still saves a valid address.
	$effect(() => {
		if (address && !address.countryCode && page?.data?.store?.country?.code) {
			address.countryCode = page.data.store.country.code
		}
	})
</script>

<AddressFormRenderer bind:address bind:show onsave={saveAndReportFailure}>
	{#snippet content({ handleSubmit })}
		<!-- novalidate: the footer submits this form with `requestSubmit()`, and native constraint
		     validation would abort before the submit event fires, pinning its bubble to whichever
		     field is off-screen. The zod pass below is the single authority and reports on the form. -->
		<form
			id={FORM_ID}
			bind:this={formEl}
			novalidate
			oninput={clearErrorOnInput}
			onfocusout={saveQuietly}
			onsubmit={(e) => submitWithVisibleErrors(e, handleSubmit)}
			class="grid"
		>
			<!-- Above the fields, not below all nine of them: at 390px the old placement put the only
			     message the shopper received off-screen (UX-082). -->
			{#if formError}
				<p
					role="alert"
					class="mb-4 flex items-start gap-2 rounded-radius border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm font-medium text-destructive"
				>
					<AlertCircle class="mt-0.5 size-4 shrink-0" aria-hidden="true" />
					<span>{formError}</span>
				</p>
			{/if}
			<div class="grid grid-cols-2 gap-2">
				<Textbox
					name="firstName"
					error={fieldErrors.firstName}
					autocomplete="given-name"
					bind:value={address.firstName}
					placeholder="First name"
					schema={AddressSchema.firstName}
					label="First name"
					required
				/>
				<Textbox
					name="lastName"
					error={fieldErrors.lastName}
					autocomplete="family-name"
					bind:value={address.lastName}
					placeholder="Last name"
					schema={AddressSchema.lastName}
					label="Last name"
					required
				/>
			</div>
			<div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
				<Textbox
					name="email"
					error={fieldErrors.email}
					type="email"
					autocomplete="email"
					bind:value={address.email}
					placeholder="your@email.com"
					schema={emailRule}
					label="Email"
					required
				/>
				<Textbox
					name="phone"
					error={fieldErrors.phone}
					type="tel"
					autocomplete="tel"
					bind:value={address.phone}
					placeholder="Mobile number"
					schema={phoneRule}
					label="Phone"
					required
				/>
			</div>
			{#if !short}
				<Textbox
					name="address_1"
					error={fieldErrors.address_1}
					autocomplete="address-line1"
					bind:value={address.address_1}
					placeholder="Street address"
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
			{/if}
			<div class="grid grid-cols-2 gap-2" class:hidden={pickup}>
				{#if !short}
					<Textbox
						name="zip"
						error={fieldErrors.zip}
						autocomplete="postal-code"
						inputmode="numeric"
						bind:value={address.zip}
						placeholder={isIndia ? '6-digit PIN code' : '12345'}
						schema={AddressSchema.zip}
						label={isIndia ? 'PIN code' : 'ZIP Code'}
						required
					/>
					<PinAutofill bind:address country={countryCode} />
					<Textbox
						name="city"
						error={fieldErrors.city}
						autocomplete="address-level2"
						bind:value={address.city}
						placeholder="City"
						schema={AddressSchema.city}
						label="City"
						required
					/>
				{/if}
				<Textbox
					name="state"
					error={fieldErrors.state}
					autocomplete="address-level1"
					bind:value={address.state}
					placeholder="State"
					schema={AddressSchema.state}
					label="State"
					required
				/>
				<!-- A real control, not two spans. A guest shipping anywhere but the store default had no
				     way to say so: they either abandoned here or reached the payment step and hit
				     "we currently deliver only to…" with nothing to change. Read-only is kept only for
				     a store that genuinely ships to one country, decided by the country list itself.
				     The cell also matches its neighbours now; it used to use a 12px uppercase caption
				     where every other field uses the 14px label, and centred itself so its text sat
				     below the ZIP label beside it. -->
				<div class="flex flex-col gap-2">
					<Label for="country-code"
						>Country{#if countries.length > 1}<span class="text-destructive"> *</span>{/if}</Label
					>
					{#if countries.length > 1}
						<Select.Root type="single" value={countryCode} onValueChange={(value: string) => value && (address.countryCode = value)}>
							<Select.Trigger id="country-code" class="h-11 w-full">{countryName || 'Select country'}</Select.Trigger>
							<Select.Content>
								{#each countries as country}
									<Select.Item value={country.code} label={country.name}>{country.name}</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
					{:else}
						<p id="country-code" class="flex h-11 items-center text-sm font-medium text-foreground">{countryName}</p>
					{/if}
					{#if fieldErrors.countryCode}
						<p class="flex items-start gap-1 text-sm font-medium text-destructive">
							<AlertCircle class="mt-0.5 size-4 shrink-0" aria-hidden="true" />
							{fieldErrors.countryCode}
						</p>
					{/if}
				</div>
			</div>
			<!-- No Save button (merchant request, 2026-11-28): the summary's forward button submits
			     this form with `requestSubmit()`, and on one page the address also saves itself. -->
			{#if autosave}
				<p class="mt-3 flex min-h-5 items-center gap-2 text-sm text-muted-foreground" aria-live="polite" data-testid="address-autosave">
					{#if autosaved === 'saving'}
						<span class="flex items-center gap-2" in:fade
							><LoaderCircle class="size-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />Saving {short
								? 'your details'
								: 'your address'}</span
						>
					{:else if autosaved === 'saved'}
						<span class="flex items-center gap-2" in:fade
							><Check class="size-4 text-success" aria-hidden="true" />{short ? 'Details saved' : 'Address saved'}</span
						>
					{/if}
				</p>
			{/if}
		</form>
	{/snippet}
</AddressFormRenderer>
