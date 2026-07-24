<script lang="ts">
	import '../app.css'
	import { Toaster } from '@misiki/kitcommerce-core'
	import { getThemeFontsUrl } from '$lib/theme/index.js'
	import { setUserState } from '$lib/core/stores/index.js'
	import { GoogleAnalytics } from '$lib/core/components/index.js'
	import KlaviyoPlugin from '$lib/core/components/plugins/klaviyo-plugin.svelte'
	import { navigating } from '$app/stores'
	import { updated } from '$app/state'
	import { afterNavigate, beforeNavigate } from '$app/navigation'
	import { browser } from '$app/environment'
	import { Loader } from '@lucide/svelte'
	import { type Snippet } from 'svelte'
	import type { StoreData } from '$lib/core/types/index.js'
  import { ColorPalette } from '$lib/core/components/index.js'

	interface LayoutData {
		store: StoreData
		theme?: {
			name: string
			source: 'admin' | 'env' | 'default'
			available: string[]
		}
		timestamp: number
		error?: string
	}
	let { children, data }: { children: Snippet; data: LayoutData } = $props()
	setUserState()

	const themeFontsUrl = $derived(getThemeFontsUrl(data?.theme?.name || 'default'))

	// Stale-client protection. SvelteKit's `updated` store flips to true once the
	// deployed build (via _app/version.json polling) no longer matches the running
	// client. We then load fresh code so mobile/PWA users never keep running an
	// old bundle:
	//  - on the next in-app navigation (hard load instead of client-side nav)
	//  - immediately while the tab sits idle (covers webviews in the background)
	beforeNavigate((nav) => {
		if (updated.current && nav.to?.url && !nav.willUnload) {
			location.href = nav.to.url.href
		}
	})

	// Auto-update as soon as a new deployment is detected, even while the tab
	// sits idle (e.g. inside a mobile webview) — don't wait for a navigation.
	$effect(() => {
		if (browser && updated.current) {
			location.reload()
		}
	})

	// Also re-check on every navigation so a stale webview updates promptly.
	afterNavigate(() => {
		if (browser) updated.check()
	})
</script>

<svelte:head>
	<link rel="icon" href={data?.store?.favicon || '/favicon.png'} />
	{#if themeFontsUrl}
		<link rel="preconnect" href="https://fonts.googleapis.com" />
		<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
		<link rel="preload" as="style" href={themeFontsUrl} />
		<link href={themeFontsUrl} rel="stylesheet" />
	{/if}
	{#if data?.store?.plugins?.headerScripts?.active}
		{@html data?.store?.plugins?.headerScripts?.html}
	{/if}
</svelte:head>

<ColorPalette />
<GoogleAnalytics />
<KlaviyoPlugin storeData={data?.store} />

<!-- <ThemeProvider /> -->

<div
	class="light min-h-screen theme-{data?.theme?.name || 'default'}"
	data-theme={data?.theme?.name || 'default'}
	data-theme-source={data?.theme?.source || 'default'}
>
	<main class="min-h-screen bg-background">
		{#if !!$navigating}
			<!-- Delayed spinner: fast navigations finish without a loader flash; only
			     navigations still pending after 700ms get the overlay. -->
			{#await new Promise((resolve) => setTimeout(resolve, 700)) then _}
				<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm" role="status">
					<div class="rounded-lg bg-white p-4">
						<Loader class="animate-spin" />
						<span class="sr-only">Loading</span>
					</div>
				</div>
			{:catch}
				<!-- Ignore any errors from the promise -->
			{/await}
		{/if}
		{@render children()}
	</main>
</div>
<Toaster position="top-center" />
