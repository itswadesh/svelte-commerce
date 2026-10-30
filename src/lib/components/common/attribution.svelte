<script lang="ts">
	import { onMount } from 'svelte'
	import { enabledTags } from '$lib/ad-tags'
	import { resolveKlaviyoConfig } from '$lib/klaviyo'
	import { ATTRIBUTION_KEY, captureLanding, withoutAttribution } from '$lib/attribution'

	let { plugins } = $props()

	// Once per page load: a client-side navigation is not an arrival.
	onMount(() => {
		const href = location.href
		const referrer = document.referrer
		const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || ''
		const capture = () => {
			try {
				captureLanding({ href, referrer, storage: localStorage, timeZone })
			} catch {
				/* storage blocked: nothing is recorded */
			}
		}
		capture()

		// The store's ad tags read gclid and fbclid from the address themselves when they load, and
		// Klaviyo its utm_ parameters, which is after the shopper's first touch; while any of them is
		// on, the parameters stay until the next page.
		if (!Object.keys(enabledTags(plugins)).length && !resolveKlaviyoConfig(plugins).active) {
			const clean = withoutAttribution(href)
			if (clean) history.replaceState(history.state, '', clean)
		}

		// The banner's answer, given after arrival, decides as one given before would have.
		const onChoice = (e: Event) => {
			if ((e as CustomEvent).detail?.analytics_storage === 'granted') return capture()
			try {
				localStorage.removeItem(ATTRIBUTION_KEY)
			} catch {
				/* storage blocked: there is nothing to forget */
			}
		}
		window.addEventListener('consentchange', onChoice)
		return () => window.removeEventListener('consentchange', onChoice)
	})
</script>
