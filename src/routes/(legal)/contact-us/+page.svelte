<script lang="ts">
	import { page } from '$app/state'
	import { ChevronRight, Clock, Mail, MapPin, MessageCircle, Phone } from '@lucide/svelte'
	import { isCmsPageResolvable } from '$lib/components/common/cms-pages.js'
	import SeoHeader from '$lib/components/seo/seo-header.svelte'
	import StructuredData from '$lib/components/seo/structured-data.svelte'
	import ContactForm from '$lib/components/contact/contact-form.svelte'
	import MapFacade from '$lib/components/contact/map-facade.svelte'
	import { addressLines, contactPageSchema, hoursRows, inIndia, mapFor, phoneLink, whatsappLink } from '$lib/components/contact/contact-facts'

	const store = $derived(page?.data?.store)

	// Only what the store record carries; anything it lacks is simply not shown. The address, map
	// location, hours and country are there only when the store published them (GoCommerce D156).
	const india = $derived(inIndia(store?.businessCountry || store?.address?.country))
	const email = $derived(String(store?.contact?.email || store?.businessEmail || '').trim())
	const phone = $derived(phoneLink(store?.contact?.phone || store?.businessPhone, india))
	const chat = $derived(store?.plugins?.whatsappChatButton)
	const whatsapp = $derived(chat?.active ? whatsappLink(chat.phone, india, chat.message) : null)
	const lines = $derived(addressLines(store?.address))
	const map = $derived(mapFor(store?.mapLocation, lines.join(', ')))
	const hours = $derived(hoursRows(store?.openingHours))

	// WhatsApp first, then a call: how most shoppers here would rather reach a shop (india.md).
	const methods = $derived(
		[
			whatsapp && { icon: MessageCircle, title: 'Chat on WhatsApp', value: whatsapp.label, href: whatsapp.href, external: true },
			phone && { icon: Phone, title: 'Call us', value: phone.label, href: phone.href, external: false },
			email && { icon: Mail, title: 'Email us', value: email, href: `mailto:${email}`, external: false }
		].filter((m) => !!m)
	)
	const hasFacts = $derived(methods.length > 0 || lines.length > 0 || !!map || hours.length > 0)

	// Decided on the server from the store's own capabilities: a form on a channel that is not open
	// would spend the shopper's message on an error. See store-capabilities.ts.
	const formAvailable = $derived(!!page.data?.contactFormOpen)

	// The merchant's own page at /contact-us, when they have written one in the CMS, is the intro.
	const cmsContent = $derived(page.data?.page?.content)

	// Name only the policies this store has actually published.
	const termsOk = $derived(isCmsPageResolvable('/terms-and-conditions', page.data?.cmsPages ?? []))
	const privacyOk = $derived(isCmsPageResolvable('/privacy-policy', page.data?.cmsPages ?? []))

	const schema = $derived(
		contactPageSchema({
			url: page.url.origin + page.url.pathname,
			origin: page.url.origin,
			name: store?.name,
			schemaType: store?.schemaType,
			email,
			phone: phone?.label,
			address: store?.address,
			hours: store?.openingHours
		})
	)
</script>

<SeoHeader
	metaTitle={store?.name ? `Contact us | ${store.name}` : 'Contact us'}
	metaDescription={`Get in touch with ${store?.name || 'us'} about orders, delivery, returns and product questions.`}
/>
<StructuredData {schema} />

<div class="page-width py-6 md:py-10">
	<header class="mb-6 max-w-2xl md:mb-8">
		<h1 class="page-heading">Contact us</h1>
		{#if cmsContent}
			<div class="prose prose-sm prose-neutral mt-2 max-w-none md:prose-base prose-a:text-primary">
				{@html cmsContent}
			</div>
		{:else}
			<p class="mt-1 text-base text-muted-foreground">
				{#if formAvailable}
					Questions about an order, a delivery or a return? Send a message{methods.length ? ', or reach the shop directly' : ''}.
				{:else if methods.length}
					Questions about an order, a delivery or a return? Reach the shop directly.
				{:else}
					Most order, delivery and returns questions are answered in the <a href="/faqs" class="text-foreground underline underline-offset-2">FAQs</a>.
				{/if}
			</p>
		{/if}
	</header>

	<div class="grid items-start gap-6 {hasFacts && formAvailable ? 'lg:grid-cols-12 lg:gap-10' : 'max-w-2xl'}">
		{#if hasFacts}
			<div class="space-y-4 {formAvailable ? 'lg:col-span-5' : ''}">
				{#if methods.length}
					<ul class="grid gap-3" aria-label="Ways to reach the shop">
						{#each methods as method (method.title)}
							<li>
								<a
									href={method.href}
									class="contact-card group flex min-h-16 items-center gap-3 rounded-lg border bg-card p-4"
									{...method.external ? { target: '_blank', rel: 'noopener noreferrer' } : {}}
								>
									<span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-foreground">
										<method.icon class="h-5 w-5" aria-hidden="true" />
									</span>
									<span class="min-w-0 flex-1">
										<span class="block text-sm font-semibold text-foreground">{method.title}</span>
										<!-- An email address has no spaces to wrap at; it must not push the page sideways at 360px. -->
										<span class="block text-sm text-muted-foreground [overflow-wrap:anywhere]">{method.value}</span>
										{#if method.external}<span class="sr-only">(opens WhatsApp)</span>{/if}
									</span>
									<ChevronRight class="contact-card__go h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
								</a>
							</li>
						{/each}
					</ul>
				{/if}

				{#if lines.length || map}
					<section class="rounded-lg border bg-card p-4" aria-labelledby="contact-address-title">
						<h2 id="contact-address-title" class="flex items-center gap-2 text-base font-semibold text-foreground">
							<MapPin class="h-4 w-4 text-muted-foreground" aria-hidden="true" />
							{lines.length ? 'Address' : 'Location'}
						</h2>
						{#if lines.length}
							<address class="mt-2 text-sm not-italic text-foreground">
								{#each lines as line, i (i)}<span class="block">{line}</span>{/each}
							</address>
						{/if}
						{#if map}
							<div class={lines.length || map.embed ? 'mt-3' : ''}>
								<MapFacade embed={map.embed} open={map.open} label={lines[0] || store?.name || 'the shop'} />
							</div>
						{/if}
					</section>
				{/if}

				{#if hours.length}
					<section class="rounded-lg border bg-card p-4" aria-labelledby="contact-hours-title">
						<h2 id="contact-hours-title" class="flex items-center gap-2 text-base font-semibold text-foreground">
							<Clock class="h-4 w-4 text-muted-foreground" aria-hidden="true" />
							Opening hours
						</h2>
						<table class="mt-2 w-full text-sm">
							<tbody>
								{#each hours as row (row.days)}
									<tr class="border-t first:border-t-0">
										<th scope="row" class="py-2 pr-4 text-left font-normal text-muted-foreground">{row.days}</th>
										<td class="py-2 text-right tabular-nums text-foreground">{row.time}</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</section>
				{/if}
			</div>
		{/if}

		{#if formAvailable}
			<div class={hasFacts ? 'lg:col-span-7' : ''}>
				<ContactForm subjects={page.data?.contactSubjects ?? []} thanks={page.data?.contactThanks ?? ''} {termsOk} {privacyOk} />
			</div>
		{/if}
	</div>
</div>

<style>
	/* Each way to reach the shop answers the pointer: a border on hover, a lift and an arrow nudge
	   where the device hovers and movement is welcome, a press under the finger. The global
	   :focus-visible ring marks it for the keyboard. */
	.contact-card {
		transition:
			transform var(--motion-fast) var(--motion-ease),
			border-color var(--motion-fast) var(--motion-ease);
	}
	.contact-card :global(.contact-card__go) {
		transition: transform var(--motion-fast) var(--motion-ease);
	}
	@media (hover: hover) {
		.contact-card:hover {
			border-color: hsl(var(--foreground) / 0.35);
		}
	}
	@media (prefers-reduced-motion: no-preference) {
		@media (hover: hover) {
			.contact-card:hover {
				transform: translateY(-2px);
			}
			.contact-card:hover :global(.contact-card__go) {
				transform: translateX(2px);
			}
		}
		.contact-card:active {
			transform: scale(0.98);
		}
	}
</style>
