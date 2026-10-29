<script lang="ts">
	import Button from '../ui/button/button.svelte'
	import Input from '../ui/input/input.svelte'
	import { Check } from '@lucide/svelte'
	import { Label } from '../ui/label'
	import { NewsletterRenderer } from '$lib/core/composables/index.js'
	import { page } from '$app/state'
	import { toast } from '@misiki/kitcommerce-core'
	import { z } from 'zod'
	import { storeService } from '$lib/core/services'
	import { getUserState } from '$lib/core/stores/index.js'
	import { klaviyoIdentify, klaviyoSubscribe, resolveKlaviyoConfig } from '$lib/klaviyo'
	import { canSubscribeToNewsletter } from './store-capabilities.js'

	let email = $state('')
	let subscribing = $state(false)
	// A mistyped address used to get a toast at the other end of the page and nothing beside the
	// field; a successful one navigated away, so a shopper who subscribed while reading a product
	// lost the product and their scroll position. Both are answered next to the input now.
	let fieldError = $state('')
	let subscribed = $state(false)
	const errorId = 'newsletter-error'
	const plugin = $derived(page.data.store?.plugins?.newsletter)
	const klaviyoConfig = $derived(resolveKlaviyoConfig(page.data.store?.plugins))
	const userState = getUserState()

	// Two independent places an address can land: the storefront's own list, served by the Litekart
	// REST API, and Klaviyo. On a backend that has neither, the form could only ever answer
	// "Subscription failed" — asking for an address the store has nowhere to put is worse than not
	// asking — so the block does not render at all. See store-capabilities.ts.
	const storeListAvailable = canSubscribeToNewsletter()
	const canSubscribe = $derived(storeListAvailable || klaviyoConfig.active)

	// Own submit instead of the renderer's subscribeToNewsletter: that one only fires a
	// toast and gives no success signal back, but a successful subscribe must land on
	// /subscription-success so the confirm-your-email instruction can't be missed.
	async function handleSubscribe() {
		const result = z.string().email().safeParse(email)
		if (!result.success) {
			fieldError = 'Enter a valid email address.'
			return
		}
		fieldError = ''

		subscribing = true
		try {
			// Litekart's own newsletter list (existing behavior), where that API is behind this store.
			if (storeListAvailable) {
				await storeService.post('/api/newsletter/subscribe', {
					email,
					customerId: userState?.user?.userId || null
				})
			}
			// Klaviyo: attach the session to a profile, then subscribe it to the configured
			// list so flows/campaigns can email them. No-op when Klaviyo isn't configured.
			klaviyoIdentify({ email })
			klaviyoSubscribe(email, klaviyoConfig)
			subscribed = true
		} catch (e: any) {
			console.error('newsletter', e)
			fieldError = e?.message || 'Subscription failed, please try again.'
			toast.error(fieldError)
		} finally {
			subscribing = false
		}
	}
</script>

<!-- NewsletterRenderer is kept for its side effect: it prefills `email` for logged-in users. -->
{#if canSubscribe}
	<NewsletterRenderer bind:email>
		{#snippet content({ loadingForSubmitting })}
			<div class="flex flex-col gap-2 sm:gap-3">
				<div class="space-y-1.5">
					<!-- Same type as a footer-menu column heading (footer-menu.svelte: text-xs font-bold)
					     so the four headings on the footer's one row sit on a shared baseline instead of
					     this one standing a size taller. -->
					<h2 class="text-xs font-bold text-foreground">{plugin?.heading || 'Newsletter'}</h2>
					<p class="text-sm text-muted-foreground">{plugin?.subheading || 'Subscribe to get the latest arrivals and offers.'}</p>
				</div>

				{#if subscribed}
					<!-- Confirmed where the shopper is standing. The old success path left the page for
					     /subscription-success, which also asserted a confirmation email the storefront
					     cannot know was sent. -->
					<p class="flex items-center gap-2 text-sm font-medium text-success" role="status">
						<Check class="h-4 w-4 shrink-0" />
						You're on the list.
					</p>
				{:else}
					<form
						onsubmit={(e) => {
							e.preventDefault()
							handleSubscribe()
						}}
					>
						<!-- A visible label, not a placeholder standing in for one. It sits above the row, not
						     inside the input's column, so `items-start` alone lines the button up with the
						     input. Inside the column, the button had to be pushed down by a guessed 26px,
						     which missed the label's real height and left it 4px low. -->
						<Label for="newsletter-email" class="sr-only sm:not-sr-only sm:mb-1.5 sm:block sm:text-xs sm:text-muted-foreground">Email address</Label>
						<div class="flex flex-col gap-2 sm:flex-row sm:items-start">
							<div class="w-full min-w-0 flex-1">
								<Input
									id="newsletter-email"
									type="email"
									name="email"
									autocomplete="email"
									placeholder={plugin?.placeholder || 'Enter your email'}
									bind:value={email}
									aria-invalid={fieldError ? 'true' : undefined}
									aria-describedby={fieldError ? errorId : undefined}
									class="h-11 w-full bg-background md:h-10 {fieldError ? 'border-destructive focus-visible:ring-destructive' : ''}"
									required
								/>
								{#if fieldError}
									<p id={errorId} class="mt-1.5 text-sm text-destructive">{fieldError}</p>
								{/if}
							</div>
							<Button type="submit" class="h-11 shrink-0 px-5 sm:px-8 md:h-10" disabled={subscribing || loadingForSubmitting}>
								{#if subscribing}
									Subscribing…
								{:else}
									Subscribe
								{/if}
							</Button>
						</div>
					</form>
				{/if}
			</div>
		{/snippet}
	</NewsletterRenderer>
{/if}
