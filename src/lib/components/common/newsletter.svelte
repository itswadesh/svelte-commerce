<script lang="ts">
	import Button from '../ui/button/button.svelte'
	import Input from '../ui/input/input.svelte'
	import { NewsletterRenderer } from '$lib/core/composables/index.js'
	import { page } from '$app/state'
	import { goto } from '$app/navigation'
	import { toast } from '@misiki/kitcommerce-core'
	import { z } from 'zod'
	import { storeService } from '$lib/core/services'
	import { getUserState } from '$lib/core/stores/index.js'
	import { klaviyoIdentify, klaviyoSubscribe, resolveKlaviyoConfig } from '$lib/klaviyo'

	let email = $state('')
	let subscribing = $state(false)
	const plugin = $derived(page.data.store?.plugins?.newsletter)
	const klaviyoConfig = $derived(resolveKlaviyoConfig(page.data.store?.plugins))
	const userState = getUserState()

	// Own submit instead of the renderer's subscribeToNewsletter: that one only fires a
	// toast and gives no success signal back, but a successful subscribe must land on
	// /subscription-success so the confirm-your-email instruction can't be missed.
	async function handleSubscribe() {
		const result = z.string().email().safeParse(email)
		if (!result.success) {
			toast.error('Please enter a valid email address')
			return
		}

		subscribing = true
		try {
			// Litekart's own newsletter list (existing behavior).
			await storeService.post('/api/newsletter/subscribe', {
				email,
				customerId: userState?.user?.userId || null
			})
			// Klaviyo: attach the session to a profile, then subscribe it to the configured
			// list so flows/campaigns can email them. No-op when Klaviyo isn't configured.
			klaviyoIdentify({ email })
			klaviyoSubscribe(email, klaviyoConfig)
			goto('/subscription-success', { state: { email } })
		} catch (e: any) {
			console.error('newsletter', e)
			toast.error(e?.message || 'Subscription failed, please try again')
		} finally {
			subscribing = false
		}
	}
</script>

<!-- NewsletterRenderer is kept for its side effect: it prefills `email` for logged-in users. -->
<NewsletterRenderer bind:email>
	{#snippet content({ loadingForSubmitting })}
		<div class="flex flex-col gap-2 sm:gap-3">
			<div class="space-y-1.5">
				<h3 class="text-sm font-bold uppercase tracking-widest text-foreground">{plugin.heading || 'Newsletter'}</h3>
				<p class="text-sm text-muted-foreground"> {plugin.subheading || 'Subscribe to get the latest arrivals and offers.'}</p>
			</div>

			<form
				class="flex flex-row items-center gap-2"
				onsubmit={(e) => {
					e.preventDefault()
					handleSubscribe()
				}}
			>
				<Input
					type="email"
					aria-label="Email address"
					placeholder={plugin.placeholder || "Enter your email" }
					bind:value={email}
					class="h-10 w-full min-w-0 flex-1 bg-background"
					required
				/>
				<Button
					type="submit"
					class="ed-sub-btn h-10 shrink-0 px-5 sm:px-8"
					disabled={subscribing || loadingForSubmitting}
				>
					{#if subscribing}
						Subscribing…
					{:else}
						Subscribe
					{/if}
				</Button>
			</form>
		</div>
	{/snippet}
</NewsletterRenderer>

<style>
	/* Match the editorial buttons on the homepage (.ed-btn): sharp radius, uppercase, tracked,
	   primary fill with a subtle lift on hover. Default theme only. */
	:global([data-theme='default']) .ed-sub-btn {
		border: 1px solid hsl(var(--primary));
		border-radius: var(--ed-radius);
		font-family: var(--ed-body);
		font-weight: 600;
		font-size: 0.76rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		transition:
			transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
			opacity 0.25s ease;
	}

	:global([data-theme='default']) .ed-sub-btn:hover {
		transform: translateY(-2px);
		opacity: 0.92;
	}

	@media (prefers-reduced-motion: reduce) {
		:global([data-theme='default']) .ed-sub-btn {
			transition: none;
		}
	}
</style>
