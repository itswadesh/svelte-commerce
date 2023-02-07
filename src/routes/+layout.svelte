<style>
.minimum-width-rem {
	min-width: 360px;
}
</style>

<script lang="ts">
import '../app.css'
import { ToastContainer, FlatToast } from 'svelte-toasts'
import PreloadingIndicator from '$lib/PreloadingIndicator.svelte'
import BackToTop from '$lib/components/BackToTop.svelte'
import GoogleAnalytics from '$lib/components/GoogleAnalytics.svelte'
import { navigating, page } from '$app/stores'
// import { onMount } from 'svelte'
// import { partytownSnippet } from '@builder.io/partytown/integration'
// Add the Partytown script to the DOM head
export let data
// let scriptEl
// onMount(() => {
// 	if (scriptEl) {
// 		scriptEl.textContent = partytownSnippet()
// 	}
// })
</script>

<!-- <svelte:head>
	<scipt>
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
	</script>r
</svelte:head> -->
<GoogleAnalytics />

{#if $navigating}
	<PreloadingIndicator />
{/if}

<main
	data-sveltekit-preload-data
	class="minimum-width-rem relative flex min-h-screen flex-col bg-white antialiased"
>
	<div class="h-rem w-full flex-1">
		<slot />
	</div>
</main>

<!-- <PartytownSnippet /> -->

<BackToTop />

<ToastContainer let:data>
	<FlatToast data="{data}" />
</ToastContainer>
