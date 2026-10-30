<script lang="ts">
	import { page } from '$app/state'
	import { onMount } from 'svelte'
	import { Button } from '$lib/components/ui/button'
	import PolicyLink from '$lib/components/common/policy-link.svelte'
	import { fade, fly } from '$lib/motion'
	import { onFirstInteraction } from '$lib/utils/on-first-interaction'
	import { criteoAccount } from '$lib/criteo'

	type Consent = { ad_storage: 'granted' | 'denied'; analytics_storage: 'granted' | 'denied' }

	// Only a store that actually loads ad or analytics tags has anything to ask about: the
	// GoogleAnalytics loader in the root layout needs the plugin switched on and a container id,
	// criteo-tag.svelte a Criteo account.
	const gtm = $derived(page.data?.store?.plugins?.googleTagManager)
	const tagsLoad = $derived((!!(gtm?.active ?? gtm?.isActive) && !!gtm?.id) || !!criteoAccount(page.data?.store?.plugins?.criteo))

	let showBanner = $state(false)

	// A saved choice is re-applied by the inline consent script in app.html, before tags load, so a
	// returning visitor is never asked again. A first-time visitor is asked on their first
	// interaction, which keeps the banner out of the first paint.
	onMount(() => {
		if (localStorage.getItem('user_consent')) return
		return onFirstInteraction(() => (showBanner = true))
	})

	function choose(settings: Consent) {
		try {
			localStorage.setItem('user_consent', JSON.stringify(settings))
		} catch {
			/* storage blocked: the choice still applies to this page view */
		}
		const gtag = (window as any).gtag
		if (typeof gtag === 'function') {
			gtag('consent', 'update', {
				ad_storage: settings.ad_storage,
				ad_user_data: settings.ad_storage,
				ad_personalization: settings.ad_storage,
				analytics_storage: settings.analytics_storage,
				personalization_storage: settings.analytics_storage
			})
		}
		// Tags that do not read Google's consent mode (criteo-tag.svelte) listen for the choice.
		window.dispatchEvent(new CustomEvent('consentchange', { detail: settings }))
		showBanner = false
	}
</script>

{#if showBanner && tagsLoad}
	<div
		in:fly={{ y: 12 }}
		out:fade
		role="region"
		aria-label="Cookie consent"
		class="fixed left-4 right-4 z-toast rounded-lg border bg-card p-4 shadow-z-10 max-sm:bottom-20 sm:bottom-6 sm:right-auto sm:max-w-sm"
	>
		<p class="text-sm text-foreground">
			We use cookies to improve your experience and analyze traffic.
			<PolicyLink href="/privacy-policy" class="text-primary underline-offset-4 hover:underline">Privacy Policy</PolicyLink>
		</p>
		<div class="mt-3 flex items-center justify-end gap-2">
			<Button variant="outline" size="sm" onclick={() => choose({ ad_storage: 'denied', analytics_storage: 'denied' })}>Required only</Button>
			<Button size="sm" onclick={() => choose({ ad_storage: 'granted', analytics_storage: 'granted' })}>Accept all</Button>
		</div>
	</div>
{/if}
