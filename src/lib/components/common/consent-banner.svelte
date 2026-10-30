<script module lang="ts">
	import { enabledTags } from '$lib/ad-tags'
	import { criteoAccount } from '$lib/criteo'

	/** Only a store that loads a tag (ad-tags.svelte, criteo-tag.svelte) has anything to ask about. */
	export const asksConsent = (plugins: Record<string, any> | null | undefined) =>
		Object.keys(enabledTags(plugins)).length > 0 || !!criteoAccount(plugins?.criteo)

	/** Shows the banner again, so a choice is as easy to change or take back as it was to make. */
	export const openConsentBanner = () => window.dispatchEvent(new Event('consentopen'))
</script>

<script lang="ts">
	import { page } from '$app/state'
	import { onMount, tick } from 'svelte'
	import { Button } from '$lib/components/ui/button'
	import PolicyLink from '$lib/components/common/policy-link.svelte'
	import { fade, fly } from '$lib/motion'
	import { onFirstInteraction } from '$lib/utils/on-first-interaction'

	type Consent = { ad_storage: 'granted' | 'denied'; analytics_storage: 'granted' | 'denied' }

	const tagsLoad = $derived(asksConsent(page.data?.store?.plugins))

	let showBanner = $state(false)
	let banner: HTMLDivElement | undefined = $state()

	// A saved choice is re-applied by the inline consent script in app.html, before tags load, so a
	// returning visitor is never asked again. A first-time visitor is asked on their first
	// interaction, which keeps the banner out of the first paint.
	onMount(() => {
		// Opened again from the footer's Cookie settings: focus moves to it, since it appears away
		// from the link.
		const reopen = async () => {
			showBanner = true
			await tick()
			banner?.focus()
		}
		window.addEventListener('consentopen', reopen)
		let saved: string | null = null
		try {
			saved = localStorage.getItem('user_consent')
		} catch {
			/* storage blocked: no saved choice */
		}
		const stop = saved ? () => {} : onFirstInteraction(() => (showBanner = true))
		return () => {
			window.removeEventListener('consentopen', reopen)
			stop()
		}
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
		// Every tag waits on the choice itself (ad-tags.ts); one taken back reloads the page without it.
		window.dispatchEvent(new CustomEvent('consentchange', { detail: settings }))
		showBanner = false
	}
</script>

{#if showBanner && tagsLoad}
	<div
		bind:this={banner}
		in:fly={{ y: 12 }}
		out:fade
		role="region"
		aria-label="Cookie consent"
		tabindex="-1"
		class="fixed left-4 right-4 z-toast rounded-lg border bg-card p-4 shadow-z-10 outline-none max-sm:bottom-20 sm:bottom-6 sm:right-auto sm:max-w-sm"
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
