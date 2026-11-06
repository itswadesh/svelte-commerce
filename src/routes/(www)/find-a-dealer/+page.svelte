<script lang="ts">
	import { page } from '$app/state'
	import { tick } from 'svelte'
	import { Check, Send } from '@lucide/svelte'
	import { Button } from '$lib/components/ui/button'
	import { Input } from '$lib/components/ui/input'
	import { Label } from '$lib/components/ui/label'
	import { Textarea } from '$lib/components/ui/textarea'
	import ErrorSummary from '$lib/components/form/error-summary.svelte'
	import SeoHeader from '$lib/components/seo/seo-header.svelte'
	import { trackGenerateLead } from '$lib/analytics'
	import { fade, fly, scale } from '$lib/motion'

	/**
	 * An enquiry for the dealer who covers the shopper's area, filed with the engine's public form
	 * (GoCommerce D69). Its answer is the same whoever it reached, and whether anybody covers the
	 * address, so the page promises only that somebody will answer: the dealer, or the store.
	 *
	 * The engine limits this per address and takes the honeypot, so both work here with no extra code.
	 */
	const store = $derived(page.data?.store)
	// A territory names a country, and only a two-letter code can match one. A store that has not
	// published its country still gets the enquiry, kept with the store rather than routed.
	const country = $derived.by(() => {
		const c = String(store?.businessCountry || store?.address?.country || '').trim()
		return /^[A-Za-z]{2}$/.test(c) ? c.toUpperCase() : ''
	})

	let name = $state('')
	let phone = $state('')
	let email = $state('')
	let stateName = $state('')
	let postalCode = $state('')
	let message = $state('')
	let website = $state('')

	let touched = $state({ name: false, reach: false, postalCode: false })
	let submitted = $state(false)
	let loading = $state(false)
	let sent = $state(false)
	let serverError = $state('')
	let summary = $state<ErrorSummary | null>(null)
	let doneHeading = $state<HTMLHeadingElement | null>(null)

	const errors = $derived({
		name: name.trim() ? '' : 'Enter your name',
		reach: phone.trim() || email.trim() ? '' : 'Enter a phone number or an email, so the dealer can answer',
		postalCode: postalCode.trim() ? '' : 'Enter your PIN or postal code, so this reaches the dealer for your area'
	})
	const shown = $derived({
		name: touched.name || submitted ? errors.name : '',
		reach: touched.reach || submitted ? errors.reach : '',
		postalCode: touched.postalCode || submitted ? errors.postalCode : ''
	})

	function explain(status: number, text: string): string {
		if (status === 429) return 'Too many enquiries from here just now. Wait a minute, then send it again. What you wrote is still here.'
		if (status === 400 && text) return text.charAt(0).toUpperCase() + text.slice(1) + '.'
		return 'Your enquiry did not send. Check your connection and press Send again. What you wrote is still here.'
	}

	async function submit(event: SubmitEvent) {
		event.preventDefault()
		if (loading) return
		submitted = true
		serverError = ''
		if (errors.name || errors.reach || errors.postalCode) {
			await tick()
			summary?.focus()
			return
		}
		loading = true
		try {
			const res = await fetch('/x/b2b/leads', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({
					name: name.trim(),
					phone: phone.trim(),
					email: email.trim(),
					state: stateName.trim(),
					postal_code: postalCode.trim(),
					message: message.trim(),
					source: 'find-a-dealer',
					website,
					...(country ? { country } : {})
				})
			})
			if (!res.ok) {
				const body = await res.json().catch(() => null)
				serverError = explain(res.status, body?.error?.message ?? '')
				await tick()
				summary?.focus()
				return
			}
			sent = true
			trackGenerateLead('find_a_dealer')
			await tick()
			doneHeading?.focus()
		} catch {
			serverError = explain(0, '')
			await tick()
			summary?.focus()
		} finally {
			loading = false
		}
	}
</script>

<SeoHeader
	metaTitle={store?.name ? `Find a dealer | ${store.name}` : 'Find a dealer'}
	metaDescription={`Tell ${store?.name || 'us'} where you are and what you need, and the dealer for your area will get back to you.`}
/>

<div class="page-width py-6 md:py-10">
	<div class="mx-auto max-w-xl">
		<h1 class="page-heading">Find a dealer</h1>
		<p class="mt-2 text-sm text-muted-foreground md:text-base">
			Tell us where you are and what you need. The dealer for your area will get back to you, or we will if no dealer covers it yet.
		</p>

		{#if sent}
			<div in:fade class="mt-6 rounded-lg border bg-card p-5 md:p-6" role="status">
				<div in:scale={{ start: 0.8 }} class="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
					<Check class="h-5 w-5 text-success" aria-hidden="true" />
				</div>
				<h2 bind:this={doneHeading} tabindex="-1" class="text-lg font-semibold text-foreground outline-none">Enquiry sent</h2>
				<p class="mt-1 text-sm text-muted-foreground">We have your details. The answer will come to {phone.trim() || email.trim()}.</p>
				<div class="mt-5"><Button href="/products" size="lg">Continue shopping</Button></div>
			</div>
		{:else}
			<form class="mt-6 space-y-4 rounded-lg border bg-card p-4 md:p-6" novalidate onsubmit={submit}>
				<ErrorSummary
					bind:this={summary}
					items={[
						...(submitted && shown.name ? [{ field: 'dealer-name', message: shown.name }] : []),
						...(submitted && shown.reach ? [{ field: 'dealer-phone', message: shown.reach }] : []),
						...(submitted && shown.postalCode ? [{ field: 'dealer-postal', message: shown.postalCode }] : []),
						...(serverError ? [{ message: serverError }] : [])
					]}
				/>

				<div class="space-y-1.5">
					<Label for="dealer-name">Your name</Label>
					<Input
						id="dealer-name"
						autocomplete="name"
						maxlength={200}
						bind:value={name}
						onblur={() => (touched.name = true)}
						aria-invalid={shown.name ? 'true' : undefined}
						aria-describedby={shown.name ? 'dealer-name-error' : undefined}
						class={shown.name ? 'border-destructive' : ''}
						required
					/>
					{#if shown.name}<p id="dealer-name-error" in:fly={{ y: -2 }} class="text-sm text-destructive">{shown.name}</p>{/if}
				</div>

				<div class="grid gap-4 sm:grid-cols-2">
					<div class="space-y-1.5">
						<Label for="dealer-phone">Phone</Label>
						<Input
							id="dealer-phone"
							type="tel"
							inputmode="tel"
							autocomplete="tel"
							maxlength={40}
							bind:value={phone}
							onblur={() => (touched.reach = true)}
							aria-invalid={shown.reach ? 'true' : undefined}
							aria-describedby={shown.reach ? 'dealer-reach-error' : undefined}
							class={shown.reach ? 'border-destructive' : ''}
						/>
					</div>
					<div class="space-y-1.5">
						<Label for="dealer-email">Email <span class="font-normal text-muted-foreground">(if you'd rather)</span></Label>
						<Input
							id="dealer-email"
							type="email"
							inputmode="email"
							autocomplete="email"
							autocapitalize="off"
							spellcheck="false"
							maxlength={200}
							bind:value={email}
							onblur={() => (touched.reach = true)}
						/>
					</div>
				</div>
				{#if shown.reach}<p id="dealer-reach-error" in:fly={{ y: -2 }} class="text-sm text-destructive">{shown.reach}</p>{/if}

				<div class="grid gap-4 sm:grid-cols-2">
					<div class="space-y-1.5">
						<Label for="dealer-postal">PIN or postal code</Label>
						<Input
							id="dealer-postal"
							autocomplete="postal-code"
							maxlength={20}
							bind:value={postalCode}
							onblur={() => (touched.postalCode = true)}
							aria-invalid={shown.postalCode ? 'true' : undefined}
							aria-describedby={shown.postalCode ? 'dealer-postal-error' : undefined}
							class={shown.postalCode ? 'border-destructive' : ''}
							required
						/>
						{#if shown.postalCode}<p id="dealer-postal-error" in:fly={{ y: -2 }} class="text-sm text-destructive">{shown.postalCode}</p>{/if}
					</div>
					<div class="space-y-1.5">
						<Label for="dealer-state">State</Label>
						<Input id="dealer-state" autocomplete="address-level1" maxlength={100} bind:value={stateName} />
					</div>
				</div>

				<div class="space-y-1.5">
					<Label for="dealer-message">What do you need? <span class="font-normal text-muted-foreground">(optional)</span></Label>
					<Textarea id="dealer-message" rows={4} maxlength={5000} bind:value={message} class="min-h-24 resize-y" />
				</div>

				<!-- Off-screen rather than display:none, which some bots skip; out of the tab order and
				     hidden from assistive tech, so no person fills it in. -->
				<div class="dealer-trap" aria-hidden="true">
					<label for="dealer-website">Leave this empty</label>
					<input id="dealer-website" type="text" tabindex="-1" autocomplete="off" bind:value={website} />
				</div>

				<Button type="submit" size="lg" class="w-full gap-2 px-6 sm:w-auto sm:min-w-44" disabled={loading} aria-busy={loading}>
					{#if loading}
						<span class="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" aria-hidden="true"></span>
						Sending
					{:else}
						<Send class="h-4 w-4" aria-hidden="true" />
						Send enquiry
					{/if}
				</Button>
			</form>
		{/if}
	</div>
</div>

<style>
	.dealer-trap {
		position: absolute;
		left: -10000px;
		width: 1px;
		height: 1px;
		overflow: hidden;
	}
</style>
