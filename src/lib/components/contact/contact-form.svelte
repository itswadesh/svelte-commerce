<script lang="ts">
	import { tick } from 'svelte'
	import { Check, Send } from '@lucide/svelte'
	import { Button } from '$lib/components/ui/button'
	import { Input } from '$lib/components/ui/input'
	import { Label } from '$lib/components/ui/label'
	import { Textarea } from '$lib/components/ui/textarea'
	import ErrorSummary from '$lib/components/form/error-summary.svelte'
	import PolicyLink from '$lib/components/common/policy-link.svelte'
	import { contactService } from '$lib/core/services'
	import { trackGenerateLead } from '$lib/analytics'
	import { fade, fly, scale } from '$lib/motion'

	/**
	 * The contact form, sent to the store's own inbox (GoCommerce's ext/contact, through the
	 * connector's contactService). Written here rather than through the shared renderer because
	 * the renderer sends neither the subject nor the honeypot, and answers every failure with the
	 * same "try again later" — a typo in an email address and a closed form both need a different
	 * fix from the shopper. The checks mirror the engine's, so a message that passes here is one
	 * the engine takes; the engine still checks everything.
	 */
	let {
		subjects = [],
		thanks = '',
		termsOk = false,
		privacyOk = false
	}: { subjects?: string[]; thanks?: string; termsOk?: boolean; privacyOk?: boolean } = $props()

	let name = $state('')
	let email = $state('')
	let subject = $state('')
	let message = $state('')
	// The honeypot: a field no person sees or reaches. A bot that fills it is told "sent" by the engine.
	let website = $state('')

	let touched = $state({ name: false, email: false, message: false })
	let submitted = $state(false)
	let loading = $state(false)
	let sent = $state(false)
	let serverError = $state('')
	// The field a refusal from the shop names, so its message sits beside that field too.
	let serverField = $state<'' | 'name' | 'email' | 'message'>('')
	let summary = $state<ErrorSummary | null>(null)
	let doneHeading = $state<HTMLHeadingElement | null>(null)

	const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	// Characters, as the engine counts them, not UTF-16 units.
	const chars = (s: string) => Array.from(s.trim()).length
	const errors = $derived({
		name: !name.trim() ? 'Enter your name' : chars(name) > 200 ? 'Your name is too long: 200 characters at most' : '',
		email: !email.trim() ? 'Enter your email, so the shop can reply' : !EMAIL.test(email.trim()) ? 'Check the email address: it should look like name@example.com' : '',
		message: !message.trim() ? 'Write your message' : chars(message) > 5000 ? 'The message is too long: 5,000 characters at most' : ''
	})
	// An error shows once the shopper has left the field or pressed Send, never while they type; one
	// the shop's server gave shows beside its field until the shopper changes that field.
	const shown = $derived({
		name: (touched.name || submitted ? errors.name : '') || (serverField === 'name' ? serverError : ''),
		email: (touched.email || submitted ? errors.email : '') || (serverField === 'email' ? serverError : ''),
		message: (touched.message || submitted ? errors.message : '') || (serverField === 'message' ? serverError : '')
	})
	const edited = (field: 'name' | 'email' | 'message') => {
		if (serverField === field) serverField = ''
	}

	/** What went wrong, in words that say what to do about it. */
	function explain(err: unknown): string {
		const e = err as { status?: number; message?: string; name?: string } | null
		if (e?.status === 429) return 'Too many messages from here just now. Wait a minute, then send it again. What you wrote is still here.'
		if (e?.status === 404 || e?.name === 'NotSupportedError') return 'This shop is not taking messages through this form right now. Use the email or phone number on this page instead.'
		if (e?.status === 400 && e.message) return e.message.charAt(0).toUpperCase() + e.message.slice(1) + '.'
		return 'Your message did not send. Check your connection and press Send again. What you wrote is still here.'
	}

	/** Which field a refusal is about, from the engine's own words ("that does not look like an email address"). */
	function fieldOf(err: unknown): '' | 'name' | 'email' | 'message' {
		const e = err as { status?: number; message?: string } | null
		if (e?.status !== 400) return ''
		const m = String(e.message ?? '')
		return /email/i.test(m) ? 'email' : /\bname\b/i.test(m) ? 'name' : /\bmessage\b/i.test(m) ? 'message' : ''
	}

	async function submit(event: SubmitEvent) {
		event.preventDefault()
		if (loading) return
		submitted = true
		serverError = ''
		serverField = ''
		if (errors.name || errors.email || errors.message) {
			await tick()
			summary?.focus()
			return
		}
		loading = true
		try {
			await contactService.submitContactUsForm({
				name: name.trim(),
				email: email.trim(),
				subject,
				message: message.trim(),
				website
			} as Parameters<typeof contactService.submitContactUsForm>[0])
			sent = true
			trackGenerateLead('contact')
			await tick()
			doneHeading?.focus()
		} catch (err) {
			serverError = explain(err)
			serverField = fieldOf(err)
			await tick()
			summary?.focus()
		} finally {
			loading = false
		}
	}
</script>

{#if sent}
	<div in:fade class="rounded-lg border bg-card p-5 md:p-6" role="status">
		<div in:scale={{ start: 0.8 }} class="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
			<Check class="h-5 w-5 text-success" aria-hidden="true" />
		</div>
		<h2 bind:this={doneHeading} tabindex="-1" class="contact-title text-lg font-semibold text-foreground outline-none">Message sent</h2>
		<!-- The shop's own words when it wrote some; it is the one that knows how it replies. -->
		<p class="mt-1 text-sm text-muted-foreground">
			{#if thanks}{thanks}{:else}The shop has your message. A reply goes to {email.trim()}.{/if}
		</p>
		<div class="mt-5 flex flex-col gap-3 sm:flex-row">
			<Button href="/products" size="lg">Continue shopping</Button>
		</div>
	</div>
{:else}
	<section class="rounded-lg border bg-card p-4 md:p-6" aria-labelledby="contact-form-title">
		<h2 id="contact-form-title" class="contact-title text-lg font-semibold text-foreground">Send a message</h2>

		<form class="mt-4 space-y-4" novalidate onsubmit={submit}>
			<ErrorSummary
				bind:this={summary}
				items={[
					...(submitted && shown.name ? [{ field: 'contact-name', message: shown.name }] : []),
					...(submitted && shown.email ? [{ field: 'contact-email', message: shown.email }] : []),
					...(submitted && shown.message ? [{ field: 'contact-message', message: shown.message }] : []),
					...(serverError && !serverField ? [{ message: serverError }] : [])
				]}
			/>

			<div class="grid gap-4 sm:grid-cols-2">
				<div class="space-y-1.5">
					<Label for="contact-name">Your name</Label>
					<Input
						id="contact-name"
						name="name"
						autocomplete="name"
						maxlength={200}
						bind:value={name}
						onblur={() => (touched.name = true)}
						oninput={() => edited('name')}
						aria-invalid={shown.name ? 'true' : undefined}
						aria-describedby={shown.name ? 'contact-name-error' : undefined}
						class="md:h-10 {shown.name ? 'border-destructive' : ''}"
						required
					/>
					{#if shown.name}
						<p id="contact-name-error" in:fly={{ y: -2 }} class="text-sm text-destructive">{shown.name}</p>
					{/if}
				</div>

				<div class="space-y-1.5">
					<Label for="contact-email">Email</Label>
					<Input
						id="contact-email"
						name="email"
						type="email"
						inputmode="email"
						autocomplete="email"
						autocapitalize="off"
						spellcheck="false"
						bind:value={email}
						onblur={() => (touched.email = true)}
						oninput={() => edited('email')}
						aria-invalid={shown.email ? 'true' : undefined}
						aria-describedby={shown.email ? 'contact-email-error' : undefined}
						class="md:h-10 {shown.email ? 'border-destructive' : ''}"
						required
					/>
					{#if shown.email}
						<p id="contact-email-error" in:fly={{ y: -2 }} class="text-sm text-destructive">{shown.email}</p>
					{/if}
				</div>
			</div>

			<!-- The subjects the shop set on its contact-form plugin, as tap choices. Optional. -->
			{#if subjects.length}
				<fieldset>
					<legend class="text-sm font-medium leading-none text-foreground">What is it about? <span class="font-normal text-muted-foreground">(optional)</span></legend>
					<div class="mt-2 flex flex-wrap gap-2">
						{#each subjects as s (s)}
							<label class="contact-chip">
								<input type="radio" name="subject" value={s} bind:group={subject} class="peer sr-only" />
								<span
									class="flex min-h-11 items-center rounded-md border px-3.5 text-sm text-foreground peer-checked:border-foreground peer-checked:bg-foreground peer-checked:text-background peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2"
									>{s}</span
								>
							</label>
						{/each}
					</div>
				</fieldset>
			{/if}

			<div class="space-y-1.5">
				<Label for="contact-message">Message</Label>
				<Textarea
					id="contact-message"
					name="message"
					placeholder="An order number helps, if it is about an order"
					rows={5}
					maxlength={5000}
					bind:value={message}
					onblur={() => (touched.message = true)}
					oninput={() => edited('message')}
					aria-invalid={shown.message ? 'true' : undefined}
					aria-describedby={shown.message ? 'contact-message-error' : undefined}
					class="min-h-32 resize-y {shown.message ? 'border-destructive' : ''}"
					required
				/>
				{#if shown.message}
					<p id="contact-message-error" in:fly={{ y: -2 }} class="text-sm text-destructive">{shown.message}</p>
				{/if}
			</div>

			<!-- Off-screen rather than display:none, which some bots skip; out of the tab order and
			     hidden from assistive tech, so no person fills it in. -->
			<div class="contact-trap" aria-hidden="true">
				<label for="contact-website">Leave this empty</label>
				<input id="contact-website" name="website" type="text" tabindex="-1" autocomplete="off" bind:value={website} />
			</div>

			<div class="flex flex-col gap-3 sm:flex-row sm:items-center">
				<!-- Keeps its width while sending, so the row does not jump. -->
				<Button type="submit" size="lg" class="w-full gap-2 px-6 sm:w-auto sm:min-w-44" disabled={loading} aria-busy={loading}>
					{#if loading}
						<span class="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" aria-hidden="true"></span>
						Sending…
					{:else}
						<Send class="h-4 w-4" aria-hidden="true" />
						Send message
					{/if}
				</Button>

				{#if termsOk || privacyOk}
					<p class="contact-caption text-xs text-muted-foreground">
						By sending this you agree to our
						{#if termsOk}<PolicyLink href="/terms-and-conditions" class="text-foreground underline underline-offset-2">terms</PolicyLink
							>{/if}{#if termsOk && privacyOk}
							and
						{/if}{#if privacyOk}<PolicyLink href="/privacy-policy" class="text-foreground underline underline-offset-2">privacy policy</PolicyLink>{/if}.
					</p>
				{/if}
			</div>
		</form>
	</section>
{/if}

<style>
	.contact-trap {
		position: absolute;
		left: -10000px;
		width: 1px;
		height: 1px;
		overflow: hidden;
	}
	.contact-chip span {
		cursor: pointer;
		transition:
			transform var(--motion-fast) var(--motion-ease),
			background-color var(--motion-fast) var(--motion-ease),
			border-color var(--motion-fast) var(--motion-ease),
			color var(--motion-fast) var(--motion-ease);
	}
	@media (hover: hover) {
		.contact-chip:hover span {
			border-color: hsl(var(--foreground) / 0.4);
		}
	}
	@media (prefers-reduced-motion: no-preference) {
		.contact-chip:active span {
			transform: scale(0.97);
		}
	}

	/* The default theme reads the role ladder, so the store's type scale moves these; the other
	   themes keep the classes. */
	:global([data-theme='default']) .contact-title {
		font-size: var(--type-heading);
		line-height: var(--leading-heading);
	}
	:global([data-theme='default']) .contact-caption {
		font-size: var(--type-dense);
		line-height: var(--leading-ui);
	}
</style>
