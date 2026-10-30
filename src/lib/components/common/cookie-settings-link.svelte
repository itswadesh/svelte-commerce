<script lang="ts">
	import { page } from '$app/state'
	import { asksConsent, openConsentBanner } from './consent-banner.svelte'

	let { class: className = '' }: { class?: string } = $props()
</script>

<!-- A cookie choice has to be as easy to take back as it was to give (DPDP, GDPR), so every footer
     offers the banner again, on a store that loads a tag to ask about. -->
{#if asksConsent(page.data?.store?.plugins)}
	<button type="button" class={className} onclick={openConsentBanner}>Cookie settings</button>
{/if}
