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
  import StoreFont from '$lib/components/common/store-font.svelte'
  import StorePalette from '$lib/components/common/store-palette.svelte'

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

	// Themes built on the section library keep their look in the API and ship it on the store
	// payload. Inlining it here means the theme's CSS is already in the SSR head — no extra
	// request and nothing cross-origin blocking first paint, which a linked API stylesheet would.
	// The tag name is split on purpose: Svelte's preprocessor treats any literal `<style>` in the
	// file as this component's own stylesheet, even inside a string, and tries to compile it.
	const STYLE_OPEN = '<sty' + 'le id="theme-css">'
	const STYLE_CLOSE = '</sty' + 'le>'
	const themeStyleTag = $derived(
		data?.store?.themeCss ? STYLE_OPEN + data.store.themeCss + STYLE_CLOSE : ''
	)

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

	// Origin serving product imagery — usually the LCP element and always a different host from
	// the document, so without a preconnect the browser pays DNS + TCP + TLS before the fetch can
	// even start (~100ms measured on a production storefront). Derived at runtime rather than
	// hardcoded so it follows whatever store/CDN this theme is deployed against. The Cloudflare
	// provider falls back to the image's own origin when no explicit CDN prefix is configured, so
	// fall back to a known store asset in that case.
	const imageCdnOrigin = $derived.by(() => {
		const cdn = data?.store?.plugins?.imageCdn
		if (!cdn?.active) return ''
		try {
			return new URL(cdn.url || data?.store?.logo || data?.store?.favicon).origin
		} catch {
			return ''
		}
	})
</script>

<svelte:head>
	<!-- No `crossorigin` here on purpose: the product <img> tags are non-CORS and would not reuse
	     a connection opened in the CORS pool. -->
	{#if imageCdnOrigin}
		<link rel="preconnect" href={imageCdnOrigin} />
	{/if}
	<link rel="icon" href={data?.store?.favicon || '/favicon.png'} />
	<!-- No canonical here. A layout-level default cannot know whether the page below it already
	     emitted one, and the listing routes now pass an explicit `canonicalUrl` that preserves
	     ?page=N — so a default emitted here would ship a second, *conflicting* <link rel=canonical>
	     on every paginated listing and Google would discard both. Canonicals are owned per page:
	     SeoHeader routes get theirs from SeoHeader, the handful of hand-rolled <title> routes
	     render <Canonical /> ($lib/components/seo/canonical.svelte).
	     No default <meta name="description"> here either — the root head renders *before* the
	     page's, so a generic one would shadow the per-page description on every SeoHeader route. -->
	{#if themeFontsUrl}
		<link rel="preconnect" href="https://fonts.googleapis.com" />
		<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
		<link rel="preload" as="style" href={themeFontsUrl} />
		<link href={themeFontsUrl} rel="stylesheet" />
	{/if}
	{#if themeStyleTag}
		{@html themeStyleTag}
	{/if}
	{#if data?.store?.plugins?.headerScripts?.active}
		{@html data?.store?.plugins?.headerScripts?.html}
	{/if}
</svelte:head>

<ColorPalette />
<StorePalette />
<StoreFont />
<GoogleAnalytics />
<KlaviyoPlugin storeData={data?.store} />

<!-- <ThemeProvider /> -->

<div
	class="light min-h-screen theme-{data?.theme?.name || 'default'}"
	data-theme={data?.theme?.name || 'default'}
	data-theme-source={data?.theme?.source || 'default'}
>
	<!-- Background/min-height wrapper only. NOT a <main>: every group layout renders its own
	     <main>, and nesting them ships duplicate main landmarks on all 55 routes. -->
	<div class="min-h-screen bg-background">
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
	</div>
</div>
<Toaster position="top-center" />
