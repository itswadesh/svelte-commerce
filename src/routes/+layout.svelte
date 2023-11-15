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
import { FacebookPixel } from '@beyonk/svelte-facebook-pixel'
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
import { getStoreFromStore } from '$lib/store/store'

export let data

$: innerWidth = 0
// $: isAndroid = false

let customfont = data.store?.fontFamily || ''
let showBackToTopButton = true

$: if (innerWidth < 1024) {
	showBackToTopButton = false
} else {
	showBackToTopButton = true
}
// let ReloadPrompt
$: store = data.store

onMount(async () => {
	if (browser) {
		// const url = new URL(data.url)
		// const storeRes = await getStoreFromStore({
		// 	origin,
		// 	host: data.host,
		// 	storeId: data.storeId
		// })
		// store = storeRes.existingStore
		await getCartFromStore({
			origin,
			storeId: data.storeId,
			cartId: data.cartId
		})
	}
})
</script>

<svelte:head>
	<link rel="icon" type="image/x-icon" href="{data.store?.favicon}" />
	<link rel="shortcut icon" type="image/x-icon" href="{data.store?.favicon}" />
	<meta name="theme-color" content="{data.store?.themeColor}" />
	<link rel="apple-touch-icon" href="{data.store?.favicon}" />
	<meta name="apple-mobile-web-app-title" content="{data.store?.websiteName}" />
	<meta name="application-name" content="{data.store?.websiteName}" />
	<link
		href="https://fonts.googleapis.com/css2?family={data.store?.fontFamily ||
			'Montserrat'}:wght@100;200;300;400;500;600;700;800;900&display=swap"
		rel="stylesheet" />
</svelte:head>

<svelte:window bind:innerWidth="{innerWidth}" />
<main style="font-family: {customfont};">
	{#if store?.googleAnalytics?.active}
		<GoogleAnalytics properties="{[store?.googleAnalytics.id.val]}" />

		<!-- <GoogleAnalytics googleAnalyticsId="{store?.googleAnalytics.id}" /> -->
	{/if}

	{#if store?.facebookPixel?.active}
		<FacebookPixel pixels="{[store?.facebookPixel.id]}" />
	{/if}

	{#if $navigating}
		<PreloadingIndicator />
	{/if}
	{#if !data?.store}
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
	{:else if data?.store && !data?.store?.closed}
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

		{#if data?.store?.whatsappChatButton?.active?.val && data?.store?.whatsappChatButton?.phone?.val}
			<a
				href="https://wa.me/{data?.store?.whatsappChatButton?.phone?.val.replace('+', '')}"
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
					src="{data?.store?.logo || '/litekart-rectangular-logo-black.png'}"
					class="h-10 w-auto object-contain object-center" />
			</div>

			<div class="flex items-center justify-center p-10 bg-white text-center">
				<div
					class="p-10 flex flex-col gap-2 items-center justify-center border-4 rounded-3xl shadow-2xl">
					<img src="{storeClosed}" alt="" class="h-52 w-auto object-contain object-center" />

					<p>
						{data?.store?.closedMessage}
					</p>
				</div>
			</div>
		</div>
	{/if}

	<!-- <FetchInit /> -->
</main>
