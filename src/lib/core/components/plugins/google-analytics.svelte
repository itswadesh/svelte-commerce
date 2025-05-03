<script lang="ts">
	// import { page } from '$app/state'
	let { storeData } = $props()
	// let storePlugins = $derived(page?.data?.store?.plugins)

	// First check store data, then fall back to setting state
	let gtagId = storeData?.plugins?.googleTagManager?.id

	let isActive = storeData?.plugins?.googleTagManager?.active

	$effect(() => {
		if (isActive && gtagId && typeof document !== 'undefined') {
			// console.log('GTM initializing with ID:', gtagId)

			// Clean up existing scripts to avoid duplicates
			const existingLoader = document.querySelector(`script[src="https://www.googletagmanager.com/gtm.js?id=${gtagId}"]`)
			const existingConfig = document.querySelector('script#gtag-config')

			if (existingLoader) existingLoader.remove()
			if (existingConfig) existingConfig.remove()

			// Create and append loader script
			const loaderScript = document.createElement('script')
			loaderScript.src = `https://www.googletagmanager.com/gtm.js?id=${gtagId}`
			loaderScript.async = true

			// Create and append configuration script
			const configScript = document.createElement('script')
			configScript.id = 'gtag-config'
			configScript.textContent = `
        window.dataLayer = window.dataLayer || []

        function gtag() {
          dataLayer.push(arguments)
        }

        gtag('js', new Date())
        gtag('config', '${gtagId}')
      `

			document.head.appendChild(loaderScript)
			document.head.appendChild(configScript)
		}
	})
</script>

<!-- Add noscript fallback iframe for users with JavaScript disabled -->
{#if isActive && gtagId}
	<noscript>
		<iframe
			src="https://www.googletagmanager.com/ns.html?id={gtagId}"
			height="0"
			width="0"
			style="display:none;visibility:hidden"
			title="Google Tag Manager"
		></iframe>
	</noscript>
{/if}
