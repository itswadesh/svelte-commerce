<script module>
	declare global {
		interface Window {
			Trustpilot: any
		}
	}
</script>

<script lang="ts">
	import { browser } from '$app/environment'
	import { page } from '$app/state'

	let pluginActive = $state(false)
	let widget: HTMLDivElement | null = $state(null)
	let domain = $state('')
	let templateId = $state('')
	let businessUnitId = $state('')

	$effect(() => {
		if (page?.data?.store?.plugins?.trustPilot?.active) {
			pluginActive = true
		}
	})

	$effect(() => {
		// let plugin = page?.data?.store?.plugins?.trustPilot
		let d = page?.data?.store?.plugins?.trustPilot?.domain
		let tId = page?.data?.store?.plugins?.trustPilot?.templateId
		let bUId = page?.data?.store?.plugins?.trustPilot?.businessUnitId

		d && (domain = d)
		tId && (templateId = tId)
		bUId && (businessUnitId = bUId)
	})

	$effect(() => {
		if (widget && browser) {
			var element = document.getElementsByClassName('trustpilot-widget')
			for (var i = 0; i < element.length; i++) {
				window?.Trustpilot?.loadFromElement?.(element[i])
			}
		}
	})
</script>

<svelte:head>
	{#if pluginActive}
		<!-- TrustBox script -->
		<script type="text/javascript" src="//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js" async></script>
		<!-- End TrustBox script -->
	{/if}
</svelte:head>

{#if pluginActive}
	<!-- TrustBox widget - Micro Review Count -->
	<div
		bind:this={widget}
		class="trustpilot-widget"
		data-locale="en-US"
		data-template-id={templateId}
		data-businessunit-id={businessUnitId}
		data-style-height="24px"
		data-style-width="100%"
		data-min-review-count="0"
		data-style-alignment="center"
	>
		<a href={`https://www.trustpilot.com/review/${domain}`} target="_blank" rel="noopener">Trustpilot</a>
	</div>
	<!-- End TrustBox widget -->
{/if}
