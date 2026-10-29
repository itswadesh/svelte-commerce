<script lang="ts">
	import PolicyLink from '$lib/components/common/policy-link.svelte'
	import { isCmsPageResolvable } from '$lib/components/common/cms-pages.js'
	import { Button } from '$lib/components/ui/button'
	import { Input } from '$lib/components/ui/input'
	import { Label } from '$lib/components/ui/label'
	import { Textarea } from '$lib/components/ui/textarea'
	import { Check, Mail, Phone, MapPin, Send } from '@lucide/svelte'
	import { page } from '$app/state'
	import { ContactUsRenderer } from '$lib/core/composables/index.js'
	import SeoHeader from '$lib/components/seo/seo-header.svelte'
	import ErrorSummary from '$lib/components/form/error-summary.svelte'
	import { trackGenerateLead } from '$lib/analytics'
	import { fade, scale } from '$lib/motion'
	import { tick } from 'svelte'

	let info = $state({
		name: '',
		email: '',
		message: ''
	})

	let summary = $state<ErrorSummary | null>(null)

	const store = $derived(page?.data?.store)

	// Only what the store record carries; anything it lacks is simply not shown. No country code is
	// added to the phone: the store's country on an engine without one is the template default (US),
	// which would turn an Indian number into a wrong one.
	const contactEmail = $derived(store?.contact?.email || store?.businessEmail)
	const contactPhone = $derived(store?.contact?.phone || store?.businessPhone)

	const contactMethods = $derived.by(() => {
		const methods: Array<{ icon: typeof Mail; title: string; value: string; href?: string }> = []
		if (contactEmail) methods.push({ icon: Mail, title: 'Email', value: contactEmail, href: `mailto:${contactEmail}` })
		if (contactPhone) {
			methods.push({ icon: Phone, title: 'Phone', value: contactPhone, href: `tel:${String(contactPhone).replace(/[^\d+]/g, '')}` })
		}
		const address = [store?.address?.street, store?.address?.city, store?.address?.state, store?.address?.pincode, store?.address?.country]
			.filter(Boolean)
			.join(', ')
		if (address) methods.push({ icon: MapPin, title: 'Address', value: address })
		return methods
	})

	// Decided on the server from the store's own capabilities: a form on a channel that is not open
	// would spend the shopper's message on an error. See store-capabilities.ts.
	const formAvailable = $derived(!!page.data?.contactFormOpen)

	// The merchant's own page at /contact-us, when they have written one in the CMS.
	const cmsContent = $derived(page.data?.page?.content)
	const hasAside = $derived(contactMethods.length > 0 || !!cmsContent)

	// Name only the policies this store has actually published.
	const termsOk = $derived(isCmsPageResolvable('/terms-and-conditions', page.data?.cmsPages ?? []))
	const privacyOk = $derived(isCmsPageResolvable('/privacy-policy', page.data?.cmsPages ?? []))
</script>

<SeoHeader
	metaTitle={store?.name ? `Contact us | ${store.name}` : 'Contact us'}
	metaDescription={`Get in touch with ${store?.name || 'us'} about orders, delivery, returns and product questions.`}
/>

<div class="page-width py-6 md:py-10">
	<header class="mb-5 max-w-2xl md:mb-8">
		<h1 class="page-heading">Contact us</h1>
		<p class="mt-1 text-sm text-muted-foreground md:text-base">
			{#if formAvailable}
				Questions about an order, a delivery or a return? Send us a message{contactMethods.length ? ' or use the details below' : ''}.
			{:else if contactMethods.length}
				Questions about an order, a delivery or a return? Write or call us.
			{:else}
				Most order, delivery and returns questions are answered in the <a href="/faqs" class="text-primary hover:underline">FAQs</a>.
			{/if}
		</p>
	</header>

	<div class="grid items-start gap-6 {hasAside && formAvailable ? 'lg:grid-cols-12 lg:gap-10' : 'max-w-2xl'}">
		{#if hasAside}
			<div class="space-y-6 {formAvailable ? 'lg:col-span-5' : ''}">
				{#if contactMethods.length}
					<ul class="divide-y rounded-lg border bg-card">
						{#each contactMethods as method}
							<li>
								<svelte:element
									this={method.href ? 'a' : 'div'}
									href={method.href}
									class="flex min-h-11 items-center gap-3 px-4 py-3 {method.href
										? 'transition-colors duration-fast ease-standard hover:bg-muted/50 focus-visible:bg-muted/50'
										: ''}"
								>
									<method.icon class="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
									<span class="min-w-0">
										<span class="block text-caption text-muted-foreground">{method.title}</span>
										<!-- An email address has no spaces to wrap at; without break-all it pushed the page
										     sideways at 360px. -->
										<span class="block break-all text-sm font-medium {method.href ? 'text-primary' : 'text-foreground'}">{method.value}</span>
									</span>
								</svelte:element>
							</li>
						{/each}
					</ul>
				{/if}

				{#if cmsContent}
					<div class="prose prose-sm prose-neutral max-w-none prose-a:text-primary">
						{@html cmsContent}
					</div>
				{/if}
			</div>
		{/if}

		{#if formAvailable}
			<div class={hasAside ? 'lg:col-span-7' : ''}>
				<ContactUsRenderer bind:info>
					{#snippet content({ error, success, nameError, messageError, emailError, loading, handleSubmit })}
						{#if success}
							<div in:fade class="rounded-lg border bg-card p-5 shadow-xs md:p-6" role="status">
								<div in:scale={{ start: 0.8 }} class="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
									<Check class="h-5 w-5 text-success" aria-hidden="true" />
								</div>
								<h2 class="text-subsection text-foreground">Message sent</h2>
								<p class="mt-1 text-sm text-muted-foreground">
									Thanks{info.name ? `, ${info.name.trim().split(/\s+/)[0]}` : ''}. Replies go to {info.email}.
								</p>
								<div class="mt-5 flex flex-col gap-3 sm:flex-row">
									<Button href="/products" size="lg">Continue shopping</Button>
									<Button href="/faqs" variant="outline" size="lg">Read the FAQs</Button>
								</div>
							</div>
						{:else}
							<section class="rounded-lg border bg-card p-4 shadow-xs md:p-6" aria-labelledby="contact-form-title">
								<h2 id="contact-form-title" class="text-subsection text-foreground">Send a message</h2>

								<!-- `novalidate` hands every check to the renderer's schema, so an empty field and a
								     malformed one report the same way: in the summary, which takes focus after a
								     failed submit, and under the field itself. Typed values stay in place. -->
								<form
									class="mt-4 space-y-4"
									novalidate
									onsubmit={async (e) => {
										await handleSubmit(e)
										await tick()
										if (success) trackGenerateLead('contact')
										else summary?.focus()
									}}
								>
									<ErrorSummary
										bind:this={summary}
										items={[
											...(nameError ? [{ field: 'name', message: nameError }] : []),
											...(emailError ? [{ field: 'email', message: emailError }] : []),
											...(messageError ? [{ field: 'message', message: messageError }] : []),
											...(error ? [{ message: error }] : [])
										]}
									/>

									<div class="grid gap-4 sm:grid-cols-2">
										<div class="space-y-1.5">
											<Label for="name">Name</Label>
											<Input
												id="name"
												name="name"
												autocomplete="name"
												bind:value={info.name}
												aria-invalid={nameError ? 'true' : undefined}
												aria-describedby={nameError ? 'name-error' : undefined}
												class="md:h-10 {nameError ? 'border-destructive focus-visible:ring-destructive' : ''}"
												required
											/>
											{#if nameError}
												<p id="name-error" in:fade class="text-sm text-destructive">{nameError}</p>
											{/if}
										</div>

										<div class="space-y-1.5">
											<Label for="email">Email</Label>
											<Input
												id="email"
												name="email"
												type="email"
												inputmode="email"
												autocomplete="email"
												autocapitalize="off"
												spellcheck="false"
												bind:value={info.email}
												aria-invalid={emailError ? 'true' : undefined}
												aria-describedby={emailError ? 'email-error' : undefined}
												class="md:h-10 {emailError ? 'border-destructive focus-visible:ring-destructive' : ''}"
												required
											/>
											{#if emailError}
												<p id="email-error" in:fade class="text-sm text-destructive">{emailError}</p>
											{/if}
										</div>
									</div>

									<div class="space-y-1.5">
										<Label for="message">Message</Label>
										<Textarea
											id="message"
											name="message"
											placeholder="Your order number helps, if it is about an order"
											rows={5}
											bind:value={info.message}
											aria-invalid={messageError ? 'true' : undefined}
											aria-describedby={messageError ? 'message-error' : undefined}
											class="min-h-32 resize-y {messageError ? 'border-destructive focus-visible:ring-destructive' : ''}"
											required
										/>
										{#if messageError}
											<p id="message-error" in:fade class="text-sm text-destructive">{messageError}</p>
										{/if}
									</div>

									<div class="flex flex-col gap-3 sm:flex-row sm:items-center">
										<!-- Keeps its width while sending, so the row does not jump. -->
										<Button type="submit" size="lg" class="w-full gap-2 px-6 sm:w-auto" disabled={loading} aria-busy={loading}>
											{#if loading}
												<span class="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground"></span>
												Sending…
											{:else}
												<Send class="h-4 w-4" aria-hidden="true" />
												Send message
											{/if}
										</Button>

										{#if termsOk || privacyOk}
											<p class="text-caption text-muted-foreground">
												By sending this you agree to our
												{#if termsOk}<PolicyLink href="/terms-and-conditions" class="text-primary hover:underline">terms</PolicyLink
													>{/if}{#if termsOk && privacyOk}
													and
												{/if}{#if privacyOk}<PolicyLink href="/privacy-policy" class="text-primary hover:underline">privacy policy</PolicyLink>{/if}.
											</p>
										{/if}
									</div>
								</form>
							</section>
						{/if}
					{/snippet}
				</ContactUsRenderer>
			</div>
		{/if}
	</div>
</div>
