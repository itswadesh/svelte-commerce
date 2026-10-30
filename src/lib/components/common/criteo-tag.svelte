<script lang="ts">
	import { adsAllowed, criteoAccount, loadCriteo } from '$lib/criteo'
	import { onFirstInteraction } from '$lib/utils/on-first-interaction'

	let { plugin } = $props()

	const account = $derived(criteoAccount(plugin))

	// Like Klaviyo, the tag waits for the visitor's first interaction, out of the first paint. A
	// choice made later in the cookie banner (consentchange) is honoured as soon as it is made.
	$effect(() => {
		const id = account
		if (!id) return
		const tryLoad = (event?: Event) => {
			// The banner's choice arrives with its event, so it counts even where storage is blocked.
			let saved: string | null = null
			const choice = (event as CustomEvent | undefined)?.detail
			try {
				saved = choice ? JSON.stringify(choice) : localStorage.getItem('user_consent')
			} catch {
				/* storage blocked: no saved choice */
			}
			if (adsAllowed(saved, Intl.DateTimeFormat().resolvedOptions().timeZone || '')) loadCriteo(id)
		}
		const stop = onFirstInteraction(tryLoad)
		window.addEventListener('consentchange', tryLoad)
		return () => {
			stop()
			window.removeEventListener('consentchange', tryLoad)
		}
	})
</script>
