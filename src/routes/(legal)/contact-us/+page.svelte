<script lang="ts">
	import PolicyLink from '$lib/components/common/policy-link.svelte'
	import { canSubmitContactForm } from '$lib/components/common/store-capabilities.js'
	import { Button } from '$lib/components/ui/button'
	import { Input } from '$lib/components/ui/input'
	import { Label } from '$lib/components/ui/label'
	import { Textarea } from '$lib/components/ui/textarea'
	import { Check, AlertCircle, Mail, Phone, MapPin, Send } from '@lucide/svelte'
	import { page } from '$app/state'
	import { ContactUsRenderer } from '$lib/core/composables/index.js'
	import SeoHeader from '$lib/components/seo/seo-header.svelte'
	import { fade } from 'svelte/transition'

	let info = $state({
		name: '',
		email: '',
		message: ''
	})

	const store = $derived(page?.data?.store)

	// The two columns used to slide in over 600ms and the success tick sat behind a pulsing ring,
	// none of it suppressible from the one reduced-motion block in app.css because they are
	// JavaScript transitions. The entrances are gone; what remains is a fade inside the feedback
	// budget, and nothing at all for a visitor who asked for reduced motion.
	const reducedMotion = typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
	const feedbackFade = { duration: reducedMotion ? 0 : 140 }

	// Only real, store-configured contact details — no template fallback address and no
	// invented live-chat SLA. Anything the store record does not carry simply is not shown.
	// `href` is what makes each one usable on a phone, and it is also what stands in for the form
	// when the store cannot receive one.
	const contactEmail = $derived(store?.contact?.email || store?.businessEmail)
	const contactPhone = $derived(store?.contact?.phone)
	const telHref = $derived(contactPhone ? `tel:${String(contactPhone).replace(/\s+/g, '')}` : undefined)

	const contactMethods = $derived.by(() => {
		const methods: Array<{ icon: any; title: string; value: string; description: string; href?: string }> = []

		if (contactEmail) {
			methods.push({
				icon: Mail,
				title: 'Email',
				value: contactEmail,
				description: 'Our team will respond within 24 hours.',
				href: `mailto:${contactEmail}`
			})
		}

		if (contactPhone) {
			methods.push({
				icon: Phone,
				title: 'Phone',
				value: contactPhone,
				description: 'Call us for order and delivery queries.',
				href: telHref
			})
		}

		const address = [store?.address?.street, store?.address?.city, store?.address?.state, store?.address?.pincode, store?.address?.country]
			.filter(Boolean)
			.join(', ')
		if (address) {
			methods.push({ icon: MapPin, title: 'Address', value: address, description: 'Registered business address.' })
		}

		return methods
	})

	// The form writes to the storefront's own REST API. Behind a backend that has no such API every
	// submit answered "Failed to send message. Please try again later." and no retry could ever
	// succeed, so the shopper spent their message on a channel that was never open. Offer the
	// channels that are open instead. See store-capabilities.ts.
	const formAvailable = canSubmitContactForm()

	// With no form and no contact details on the store record there is nothing to put in a second
	// column, and the two-column shell left about 600px of blank canvas beside a small card. Fall
	// back to one centred column at the card's width.
	const twoColumn = $derived(formAvailable || contactMethods.length > 0)
</script>

<SeoHeader
	metaTitle={store?.name ? `Contact Us | ${store.name}` : 'Contact Us'}
	metaDescription={`Get in touch with ${store?.name || 'us'} about orders, delivery, returns and product questions.`}
/>

<!-- The page used to paint `body` from its own <style> block, so one visit recoloured the canvas of
     every page after it for the rest of the session. The tint belongs to this page's own wrapper,
     and it comes from the muted surface token so a merchant palette reaches it. -->
<div class="min-h-screen bg-muted/30 py-12 md:py-20">
	<div class="page-width">
		<ContactUsRenderer bind:info>
			{#snippet content({ error, success, nameError, messageError, emailError, loading, handleSubmit })}
				<div class="grid gap-12 lg:items-start {twoColumn ? 'lg:grid-cols-12' : 'mx-auto max-w-2xl'}">
					<!-- Left column: who we are and how else to reach us -->
					<div class={twoColumn ? 'lg:col-span-5' : ''}>
						<div class="mb-10">
							<h1 class="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
								Let's start a <span class="text-primary">conversation</span>
							</h1>
							<p class="mt-4 text-lg leading-relaxed text-muted-foreground">
								Have a question about an order, a delivery or a return? Send it over and we will come back to you.
							</p>
						</div>

						{#if contactMethods.length}
							<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
								{#each contactMethods as method}
									<div class="flex items-start gap-4 rounded-lg border bg-card p-5 shadow-xs">
										<div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
											<method.icon class="h-5 w-5" />
										</div>
										<div>
											<h2 class="text-sm font-semibold text-foreground">{method.title}</h2>
											{#if method.href}
												<!-- A phone number the shopper cannot tap is a phone number they have to
												     retype. 32px keeps the standalone link above the WCAG 2.2 target floor. -->
												<a href={method.href} class="mt-0.5 inline-flex min-h-[32px] items-center font-medium text-primary hover:underline">
													{method.value}
												</a>
											{:else}
												<p class="mt-0.5 font-medium text-foreground">{method.value}</p>
											{/if}
											<p class="mt-1 text-sm text-muted-foreground">{method.description}</p>
										</div>
									</div>
								{/each}
							</div>
						{/if}

						{#if page?.data?.page?.content}
							<div class="mt-10 border-t pt-10">
								<div class="prose prose-sm prose-neutral max-w-none prose-a:text-primary">
									{@html page.data.page.content}
								</div>
							</div>
						{/if}
					</div>

					<!-- Right column: the form, or the channels that are actually open -->
					<div class={twoColumn ? 'lg:col-span-7' : ''}>
						{#if !formAvailable}
							<div class="rounded-lg border bg-card p-8 shadow-xs md:p-10">
								<h2 class="text-2xl font-bold text-foreground">Reach us directly</h2>
								<p class="mt-2 text-muted-foreground">
									{#if contactEmail || contactPhone}
										This store takes enquiries over email and phone rather than through a form.
									{:else}
										This store does not take messages through the site, but most order, delivery and returns questions are already answered.
									{/if}
								</p>

								{#if contactEmail || contactPhone}
									<div class="mt-8 flex flex-col gap-3 sm:flex-row">
										{#if contactEmail}
											<Button href="mailto:{contactEmail}" class="h-12 w-full gap-2 sm:w-auto">
												<Mail class="h-4 w-4" />
												Email us
											</Button>
										{/if}
										{#if telHref}
											<Button variant="outline" href={telHref} class="h-12 w-full gap-2 sm:w-auto">
												<Phone class="h-4 w-4" />
												Call us
											</Button>
										{/if}
									</div>
								{/if}

								<p class="mt-8 border-t pt-6 text-sm text-muted-foreground">
									Looking for delivery, returns or payment details?
									<a href="/faqs" class="inline-flex min-h-[32px] items-center text-primary hover:underline">Read the FAQs</a>
									or
									<a href="/products" class="inline-flex min-h-[32px] items-center text-primary hover:underline">keep shopping</a>.
								</p>
							</div>
						{:else if success}
							<div in:fade={feedbackFade} class="rounded-lg border bg-card p-8 text-center shadow-xs md:p-12">
								<!-- A static success mark. The pulsing ring that used to sit behind it is this
								     codebase's loading language, and it ignored reduced motion. -->
								<div class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
									<Check class="h-8 w-8 text-success" />
								</div>
								<h2 class="text-2xl font-bold text-foreground">Message sent</h2>
								<p class="mx-auto mt-3 max-w-sm text-muted-foreground">
									Thank you for reaching out. A member of our team will get back to you shortly.
								</p>
								<!-- A success state with no way onward left the shopper on a dead page. -->
								<div class="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
									<Button href="/products" class="h-11">Continue shopping</Button>
									<Button href="/faqs" variant="outline" class="h-11">Read the FAQs</Button>
								</div>
							</div>
						{:else}
							<div class="overflow-hidden rounded-lg border bg-card shadow-xs">
								<div class="border-b bg-muted/40 p-6 md:p-8">
									<h2 class="text-2xl font-bold text-foreground">Send us a message</h2>
									<p class="mt-1 text-sm text-muted-foreground">Required fields are marked with an asterisk (*)</p>
								</div>

								<form class="space-y-6 p-6 md:p-8" onsubmit={handleSubmit}>
									{#if error}
										<!-- role="alert": the failure used to be a red box nobody was told about. -->
										<div role="alert" in:fade={feedbackFade} class="flex items-center gap-3 rounded-md bg-destructive/10 p-4 text-destructive">
											<AlertCircle class="h-5 w-5 shrink-0" />
											<p class="text-sm font-medium">{error}</p>
										</div>
									{/if}

									<div class="grid gap-6 sm:grid-cols-2">
										<div class="space-y-2">
											<Label for="name" class="text-sm font-medium text-muted-foreground">Full name *</Label>
											<Input
												id="name"
												name="name"
												autocomplete="name"
												placeholder="John Doe"
												bind:value={info.name}
												aria-invalid={nameError ? 'true' : undefined}
												aria-describedby={nameError ? 'name-error' : undefined}
												class="h-12 {nameError ? 'border-destructive focus-visible:ring-destructive' : ''}"
												required
											/>
											{#if nameError}
												<p id="name-error" class="text-sm text-destructive">{nameError}</p>
											{/if}
										</div>

										<div class="space-y-2">
											<Label for="email" class="text-sm font-medium text-muted-foreground">Email address *</Label>
											<Input
												id="email"
												name="email"
												type="email"
												autocomplete="email"
												placeholder="john@example.com"
												bind:value={info.email}
												aria-invalid={emailError ? 'true' : undefined}
												aria-describedby={emailError ? 'email-error' : undefined}
												class="h-12 {emailError ? 'border-destructive focus-visible:ring-destructive' : ''}"
												required
											/>
											{#if emailError}
												<p id="email-error" class="text-sm text-destructive">{emailError}</p>
											{/if}
										</div>
									</div>

									<div class="space-y-2">
										<Label for="message" class="text-sm font-medium text-muted-foreground">Your message *</Label>
										<Textarea
											id="message"
											name="message"
											placeholder="Tell us how we can help..."
											rows={5}
											bind:value={info.message}
											aria-invalid={messageError ? 'true' : undefined}
											aria-describedby={messageError ? 'message-error' : undefined}
											class="min-h-[150px] resize-none {messageError ? 'border-destructive focus-visible:ring-destructive' : ''}"
											required
										/>
										{#if messageError}
											<p id="message-error" class="text-sm text-destructive">{messageError}</p>
										{/if}
									</div>

									<Button type="submit" class="h-12 w-full gap-2" disabled={loading}>
										{#if loading}
											<span class="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground"></span>
											Sending…
										{:else}
											<Send class="h-4 w-4" />
											Send message
										{/if}
									</Button>

									<p class="text-center text-xs text-muted-foreground">
										By sending this message you agree to our
										<PolicyLink href="/terms-and-conditions" class="text-primary hover:underline">Terms</PolicyLink> and
										<PolicyLink href="/privacy-policy" class="text-primary hover:underline">Privacy Policy</PolicyLink>.
									</p>
								</form>
							</div>
						{/if}
					</div>
				</div>
			{/snippet}
		</ContactUsRenderer>
	</div>
</div>
