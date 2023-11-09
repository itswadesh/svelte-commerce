<style>
.minimum-width-rem {
	min-width: 360px;
}
</style>

<script lang="ts">
// import { pwaInfo } from 'virtual:pwa-info'
// import FetchInit from '$lib/components/FetchInit.svelte'
import './../app.css'
import { BackToTop, LazyImg } from '$lib/components' // Can not dynamically import Google Analytics, it throws gtag not found error, not even party town
import { browser } from '$app/environment'
import { CategoryService } from '$lib/services'
import { FacebookPixel } from '@beyonk/svelte-facebook-pixel'
import { GOOGLE_ANALYTICS_ID } from '$lib/config'
import { GoogleAnalytics } from '@beyonk/svelte-google-analytics'
import { navigating } from '$app/stores'
import { onMount } from 'svelte'
import { page } from '$app/stores'
import { ToastContainer, FlatToast } from 'svelte-toasts'
import noStoreFound from '$lib/assets/no/no_store_found.png'
import PreloadingIndicator from '$lib/PreloadingIndicator.svelte'
import storeClosed from '$lib/assets/store-closed.png'
import whatsappIcon from '$lib/assets/social-media/whatsapp.png'
import { getCartFromStore } from '$lib/store/cart'

// console.log('$page', $page)

export let data
// console.log('zzzzzzzzzzzzzzzzzz', data)

$: innerWidth = 0
// $: isAndroid = false

let customfont = $page.data.store?.fontFamily || ''
let showBackToTopButton = true

$: if (innerWidth < 1024) {
	showBackToTopButton = false
} else {
	showBackToTopButton = true
}

// let ReloadPrompt

onMount(async () => {
	if (browser) {
		await getCartFromStore({
			origin,
			storeId: $page.data.store.id,
			cartId: $page.data.cartId
		})
	}
	// 	// if (pwaInfo) {
	// 	// 	const { registerSW } = await import('virtual:pwa-register')
	// 	// 	registerSW({
	// 	// 		immediate: true,
	// 	// 		onRegistered(r) {
	// 	// 		},
	// 	// 		onRegisterError(error) {
	// 	// 		}
	// 	// 	})
	// 	// }
	// 	if (browser) {
	// 		// Get the User-Agent header from the request
	// 		// const userAgent = navigator.userAgent || navigator.vendor || window.opera
	// 		// // console.log('userAgent', userAgent)
	// 		// // Check if the User-Agent indicates an Android device
	// 		// // const isAndroid = userAgent.includes('Android')
	// 		// if (/android/i.test(userAgent) && $page.url.host !== 'm.zapvi.in') {
	// 		// 	// Attempt to open the app using the custom URL scheme
	// 		// 	window.location.href = `zapviin://m.zapvi.in/?slug=${$page.url.pathname.substring(1)}`
	// 		// }
	// 	}
})

// $: webManifest = pwaInfo ? pwaInfo.webManifest.linkTag : ''

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
</script>

<svelte:head>
	<link rel="icon" type="image/x-icon" href="{$page.data.store?.favicon}" />
	<link rel="shortcut icon" type="image/x-icon" href="{$page.data.store?.favicon}" />
	<meta name="theme-color" content="{$page.data.store?.themeColor}" />
	<link rel="apple-touch-icon" href="{$page.data.store?.favicon}" />
	<meta name="apple-mobile-web-app-title" content="{$page.data.store?.websiteName}" />
	<meta name="application-name" content="{$page.data.store?.websiteName}" />
	<link
		href="https://fonts.googleapis.com/css2?family={$page.data.store.fontFamily ||
			'Montserrat'}:wght@100;200;300;400;500;600;700;800;900&display=swap"
		rel="stylesheet" />

	<!-- {@html webManifest} -->
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

<main style="font-family: {customfont};">
	{#if $page.data.store?.googleAnalytics?.active}
		<GoogleAnalytics properties="{[$page.data.store?.googleAnalytics.id.val]}" />

		<!-- <GoogleAnalytics googleAnalyticsId="{$page.data.store?.googleAnalytics.id}" /> -->
	{/if}

	{#if $page.data.store?.facebookPixel?.active}
		<FacebookPixel pixels="{[$page.data.store?.facebookPixel.id]}" />
	{/if}

	{#if $navigating}
		<PreloadingIndicator />
	{/if}

	{#if !$page?.data?.store}
		<!-- If store not found -->

		<div class="h-screen w-full bg-white flex items-center justify-center">
			<a
				href="https://litekart.in/"
				class="fixed top-0 inset-x-0 z-10 p-5 px-10 flex items-center justify-center border-b shadow-md">
				<img
					src="/litekart-rectangular-logo-black.png"
					alt=""
					class="h-10 w-auto object-contain object-center" />
			</a>

			<div class="flex items-center justify-center p-10 bg-white text-center">
				<img src="{noStoreFound}" alt="" class="h-80 w-auto object-contain object-center" />
			</div>
		</div>
	{:else if !$page.data?.store?.closed}
		<!-- If store found and is not closed -->

		<section class="minimum-width-rem relative flex min-h-screen flex-col bg-white antialiased">
			<div class="h-rem w-full flex-1">
				<slot />
			</div>
		</section>

		<!-- <PartytownSnippet /> -->

		{#if showBackToTopButton}
			<BackToTop />
		{/if}

		{#if $page.data.store?.whatsappChatButton?.active?.val && $page.data.store?.whatsappChatButton?.phone?.val}
			<a
				href="https://wa.me/{$page.data.store?.whatsappChatButton?.phone?.val.replace('+', '')}"
				target="_blank"
				rel="noopener noreferrer"
				class="fixed z-40 bottom-16 left-4">
				<img
					src="{whatsappIcon}"
					alt=""
					class="h-10 w-10 object-contain transform hover:scale-125 hover:-translate-y-2 transition duration-300" />
			</a>
		{/if}

		<ToastContainer let:data>
			<FlatToast data="{data}" />
		</ToastContainer>

		<!-- {#if ReloadPrompt}
		<svelte:component this="{ReloadPrompt}" />
	{/if} -->
	{:else}
		<!-- If store found and is closed -->

		<div class="h-screen w-full bg-white flex items-center justify-center">
			<div
				class="fixed top-0 inset-x-0 z-10 p-5 px-10 flex items-center justify-center border-b shadow-md">
				<LazyImg
					src="{$page.data.store?.logo || '/litekart-rectangular-logo-black.png'}"
					class="h-10 w-auto object-contain object-center" />
			</div>

			<div class="flex items-center justify-center p-10 bg-white text-center">
				<div
					class="p-10 flex flex-col gap-2 items-center justify-center border-4 rounded-3xl shadow-2xl">
					<img src="{storeClosed}" alt="" class="h-52 w-auto object-contain object-center" />

					<p>
						{$page.data.store?.closedMessage}
					</p>
				</div>
			</div>
		</div>
	{/if}

	<!-- <FetchInit /> -->
</main>
