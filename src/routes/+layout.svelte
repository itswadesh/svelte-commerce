<style>
.minimum-width-rem {
	min-width: 360px;
}
</style>

<script lang="ts">
import { pwaInfo } from 'virtual:pwa-info'
// import { partytownSnippet } from '@builder.io/partytown/integration'
import './../app.css'
import { navigating } from '$app/stores'
import { onMount } from 'svelte'
import { page } from '$app/stores'
import { ToastContainer, FlatToast } from 'svelte-toasts'
import BackToTop from '$lib/components/BackToTop.svelte'
import GoogleAnalytics from '$lib/components/GoogleAnalytics.svelte' // Can not dynamically import Google Analytics, it throws gtag not found error, not even party town
import PreloadingIndicator from '$lib/PreloadingIndicator.svelte'
import { cubicIn, cubicOut } from 'svelte/easing'

$: innerWidth = 0

let showBackToTopButton = true

$: if (innerWidth < 1024) {
	showBackToTopButton = false
} else {
	showBackToTopButton = true
}
// let ReloadPrompt
onMount(async () => {
	if (pwaInfo) {
		const { registerSW } = await import('virtual:pwa-register')
		registerSW({
			immediate: true,
			onRegistered(r) {
				console.log(`SW Registered: ${r}`)
			},
			onRegisterError(error) {
				console.log('SW registration error', error)
			}
		})
	}
})

$: webManifest = pwaInfo ? pwaInfo.webManifest.linkTag : ''

// Add the Partytown script to the DOM head
// let scriptEl
// onMount(() => {
// 	if (scriptEl) {
// 		scriptEl.textContent = partytownSnippet()
// 	}
// })

// let GoogleAnalytics
// onMount(async () => {
// 	const GoogleAnalyticsEmodule = await import('$lib/components/GoogleAnalytics.svelte')
// 	GoogleAnalytics = GoogleAnalyticsEmodule.default
// })
// import PartytownSnippet from 'partytown-sveltekit/PartytownSnippet.svelte'
// import { GOOGLE_ANALYTICS_ID } from '$lib/config'
// if (typeof window !== 'undefined' && window) {
// 	// @ts-ignore
// 	window.dataLayer = window.dataLayer || []
// 	// @ts-ignore
// 	function gtag() {
// 		window.dataLayer.push(arguments)
// 	}
// 	gtag('js', new Date())
// 	gtag('config', GOOGLE_ANALYTICS_ID, {
// 		page_title: document.title,
// 		page_path: $page.url.pathname
// 	})
// }
export let data
</script>

<svelte:head>
	{@html webManifest}
</svelte:head>

<!-- <svelte:head>
	<script>
	partytown = {
		forward: ['dataLayer.push'],
		resolveUrl: (url) => {
			const siteUrl = $page.data?.origin

			if (url.hostname === 'www.googletagmanager.com') {
				const proxyUrl = new URL(`${siteUrl}/gtm`)

				const gtmId = new URL(url).searchParams.get('id')
				gtmId && proxyUrl.searchParams.append('id', gtmId)

				return proxyUrl
			} else if (url.hostname === 'www.google-analytics.com') {
				const proxyUrl = new URL(`${siteUrl}/ga`)

				return proxyUrl
			}

			return url
		}
	}
	</script>

	<script bind:this="{scriptEl}"></script>
	<script
		type="text/partytown"
		src="https://www.googletagmanager.com/gtag/js?id=G-BG3JKWLYPF"></script>
	<script type="text/partytown">
	window.dataLayer = window.dataLayer || []

	function gtag() {
		dataLayer.push(arguments)
	}

	gtag('js', new Date())
	gtag('config', 'G-BG3JKWLYPF', {
		page_path: window.location.pathname
	})
	</script>
</svelte:head> -->

<svelte:window bind:innerWidth="{innerWidth}" />

<GoogleAnalytics />

{#if $navigating}
	<PreloadingIndicator />
{/if}
<section class="minimum-width-rem relative flex min-h-screen flex-col bg-white antialiased">
	<div class="h-rem w-full flex-1">
		<slot />
	</div>
</section>
<!-- <PartytownSnippet /> -->

{#if showBackToTopButton}
	<BackToTop />
{/if}

<ToastContainer let:data>
	<FlatToast data="{data}" />
</ToastContainer>

<!-- {#if ReloadPrompt}
	<svelte:component this="{ReloadPrompt}" />
{/if} -->
