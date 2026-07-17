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

	let email = $state('')
	let subscribing = $state(false)
	const plugin = $derived(page.data.store?.plugins?.newsletter)
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
			await storeService.post('/api/newsletter/subscribe', {
				email,
				customerId: userState?.user?.userId || null
			})
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
				class="flex flex-col gap-2 sm:flex-row sm:items-center"
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
					class="h-10 w-full bg-background sm:w-64"
					required
				/>
				<Button
					type="submit"
					class="h-10 w-full sm:w-auto sm:px-8"
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
